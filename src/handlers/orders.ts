import express, { Request, Response } from 'express';
import { Order, OrderProduct, OrderStore } from '../models/order';
import verifyAuthToken from '../middleware/verifyAuthToken';

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
	const orders = await store.index();
	res.json(orders);
};

const show = async (req: Request, res: Response) => {
	const order = await store.show(req.params.id as unknown as number);
	res.json(order);
};

const create = async (req: Request, res: Response) => {
	const order: Order = {
		user_id: req.body.user_id,
		complete: req.body.complete
	};

	try {
		const newOrder = await store.create(order);
		res.json(newOrder);
	} catch (err) {
		res.status(400);
		res.json(err + order);
	}
};

const edit = async (req: Request, res: Response) => {
	const order: Order = {
		user_id: req.body.user_id,
		complete: req.body.complete,
		id: req.body.id
	};

	try {
		const editedOrder = await store.edit(order);
		res.json(editedOrder);
	} catch (err) {
		res.status(400);
		res.json(err + order);
	}
};

const destroy = async (req: Request, res: Response) => {
	try {
		const order = await store.delete(req.body.id);
		res.json(order);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const showOrderProduct = async (req: Request, res: Response) => {
	try {
		const orderProducts = await store.showOrderProduct(
			req.body.order_id as unknown as number,
			req.body.product_id as unknown as number
		);
		res.json(orderProducts);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const addOrderProduct = async (req: Request, res: Response) => {
	const product: OrderProduct = {
		quantity: req.body.quantity,
		order_id: req.body.order_id,
		product_id: req.body.product_id
	};

	try {
		const newProduct = await store.addOrderProduct(product);
		res.json(newProduct);
	} catch (err) {
		res.status(400);
		res.json(err + product);
	}
};

const editOrderProduct = async (req: Request, res: Response) => {
	const product: OrderProduct = {
		id: req.body.id,
		quantity: req.body.quantity,
		order_id: req.body.order_id,
		product_id: req.body.product_id
	};
	try {
		const newProduct = await store.editOrderProduct(product);
		res.json(newProduct);
	} catch (err) {
		res.status(400);
		res.json(err + product);
	}
};

const deleteOrderProduct = async (req: Request, res: Response) => {
	try {
		const product = await store.deleteOrderProduct(
			req.body.order_id as unknown as number,
			req.body.product_id as unknown as number
		);
		res.json(product);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const orderRoutes = (app: express.Application): void => {
	app.get('/orders', index);
	app.get('/orders/:id', verifyAuthToken, show);
	app.post('/orders', verifyAuthToken, create);
	app.patch('/orders/:id', verifyAuthToken, edit);
	app.delete('/orders', verifyAuthToken, destroy);
	app.post('/orders/:id', verifyAuthToken, addOrderProduct);
	app.get('/orders/:id/item/:id', verifyAuthToken, showOrderProduct);
	app.patch('/order/:id/item/:id', verifyAuthToken, editOrderProduct);
	app.delete('/orders/:id', verifyAuthToken, deleteOrderProduct);
};

export default orderRoutes;
