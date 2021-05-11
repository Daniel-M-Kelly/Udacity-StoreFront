import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';

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

const orderRoutes = (app: express.Application): void => {
	app.get('/orders', index);
	app.get('/orders/:id', show);
	app.post('/orders', create);
	app.patch('/orders/:id', edit);
	app.delete('/orders', destroy);
};

export default orderRoutes;
