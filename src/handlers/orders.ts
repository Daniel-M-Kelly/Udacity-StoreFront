import express, { Request, Response } from 'express';
import { Order, OrderProduct, OrderModel } from '../models/order';
import verifyAuthToken from '../middleware/verifyAuthToken';

const orderModel = new OrderModel();

const index = async (_req: Request, res: Response) => {
	const orders = await orderModel.index();
	res.json(orders);
};

const currentOrder = async (req: Request, res: Response) => {
	const orders = await orderModel.current(
		req.body.user_id as unknown as number
	);
	res.json(orders);
};

const show = async (req: Request, res: Response) => {
	const order = await orderModel.show(req.params.id as unknown as number);
	res.json(order);
};

const create = async (req: Request, res: Response) => {
	const order: Order = {
		user_id: req.body.user_id,
		complete: req.body.complete
	};

	try {
		const newOrder = await orderModel.create(order);
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
		const editedOrder = await orderModel.edit(order);
		res.json(editedOrder);
	} catch (err) {
		res.status(400);
		res.json(err + order);
	}
};

const destroy = async (req: Request, res: Response) => {
	try {
		const order = await orderModel.delete(req.body.id);
		res.json(order);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const indexOrderProduct = async (req: Request, res: Response) => {
	try {
		const orderProducts = await orderModel.indexOrderProduct(
			req.body.order_id as unknown as number
		);
		res.json(orderProducts);
	} catch (err) {
		res.status(400);
		res.json(err);
	}
};

const showOrderProduct = async (req: Request, res: Response) => {
	try {
		const orderProducts = await orderModel.showOrderProduct(
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
		const newProduct = await orderModel.addOrderProduct(product);
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
		const newProduct = await orderModel.editOrderProduct(product);
		res.json(newProduct);
	} catch (err) {
		res.status(400);
		res.json(err + product);
	}
};

const deleteOrderProduct = async (req: Request, res: Response) => {
	try {
		const product = await orderModel.deleteOrderProduct(
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
	app.get('/orders/current/:id', verifyAuthToken, currentOrder);
	app.post('/orders', verifyAuthToken, create);
	app.patch('/orders/:id', verifyAuthToken, edit);
	app.delete('/orders', verifyAuthToken, destroy);
	app.post('/orders/:id', verifyAuthToken, addOrderProduct);
	app.get('/orders/:id/items', verifyAuthToken, indexOrderProduct);
	app.get('/orders/:id/items/:id', verifyAuthToken, showOrderProduct);
	app.patch('/orders/:id/items/:id', verifyAuthToken, editOrderProduct);
	app.delete('/orders/:id', verifyAuthToken, deleteOrderProduct);
};

export default orderRoutes;
