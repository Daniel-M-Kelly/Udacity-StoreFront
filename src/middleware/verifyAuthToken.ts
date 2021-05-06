import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const verifyAuthToken = (
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	try {
		const authorizationHeader = req.headers.authorization;
		const token = authorizationHeader.split(' ')[1];
		const decoded = jwt.verify(
			token,
			(process.env.TOKEN_SECRET as unknown) as string
		);

		next();
	} catch (error) {
		res.status(401);
	}
};

export default verifyAuthToken;
