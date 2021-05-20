import express, { Request, Response } from 'express';
import { Product, ProductModel } from '../models/product';
import verifyAuthToken from '../middleware/verifyAuthToken';

const store = new ProductModel();

const index = async (_req: Request, res: Response) => {
	const products = await store.index();
	res.json(products);
};

const show = async (req: Request, res: Response) => {
	const product = await store.show(req.params.id as unknown as number);
	res.json(product);
};

const create = async (req: Request, res: Response) => {
	const product: Product = {
		name: req.body.name,
		price: req.body.price,
		category: req.body.category
	};

	try {
		const newProduct = await store.create(product);
		res.json(newProduct);
	} catch (err) {
		res.status(400);
		res.json(err + product);
	}
};

const edit = async (req: Request, res: Response) => {
	const product: Product = {
		name: req.body.name,
		price: req.body.price,
		category: req.body.category,
		id: req.body.id
	};

	try {
		const editedProduct = await store.edit(product);
		res.json(editedProduct);
	} catch (err) {
		res.status(400);
		res.json(err + product);
	}
};

const destroy = async (req: Request, res: Response) => {
	const product = await store.delete(req.body.id as unknown as number);
	res.json(product);
};

const productRoutes = (app: express.Application): void => {
	app.get('/products', index);
	app.get('/products/:id', show);
	app.post('/products', verifyAuthToken, create);
	app.patch('/products/:id', verifyAuthToken, edit);
	app.delete('/products', verifyAuthToken, destroy);
};
export default productRoutes;
