import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';

const store = new UserStore();

const index = async (req: Request, res: Response) => {
	const users = await store.index();
	res.json(users);
};

const show = async (req: Request, res: Response) => {
	const user = await store.show(req.params.id);
	res.json(user);
};

const create = async (req: Request, res: Response) => {
	const user: User = {
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password
	};
	try {
		const newUser = await store.create(user);
		const token = jwt.sign(
			{
				user: newUser
			},
			(process.env.TOKEN_SECRET as unknown) as string
		);
		res.json(token);
	} catch (err) {
		res.status(400);
		res.json(err + user);
	}
};

const destroy = async (req: Request, res: Response) => {
	const deleted = await store.delete(req.body.id);
	res.json(deleted);
};

const authenticate = async (req: Request, res: Response) => {
	const user: User = {
		userName: req.body.userName,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		password: req.body.password
	};

	try {
		const u = await store.authenticate(user.userName, user.password);
		res.json(u);
	} catch (err) {
		res.status(401);
		res.json(err + user);
	}
};

const userRoutes = (app: express.Application): void => {
	app.get('/users', index);
	app.get('/users/:id', show);
	app.post('/users', create);
	app.delete('/users', destroy);
	app.post('/users/authenticate', authenticate);
};

export default userRoutes;
