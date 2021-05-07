import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
	const products = await store.index();
	res.json(products);
};

const show = async (req: Request, res: Response) => {
	const product = await store.show(req.params.id);
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

const productRoutes = (app: express.Application): void => {
	app.get('/products', index);
	app.get('/products/:id', show);
	app.post('/products', create);
};
export default productRoutes;
