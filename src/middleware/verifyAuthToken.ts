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
		if (authorizationHeader) {
			const token = authorizationHeader.split(' ')[1];
			console.log(`The token is: ${token}`);
			const decode = jwt.verify(
				token,
				(process.env.TOKEN_SECRET as unknown) as string
			);
			if (decode) {
				next();
			} else {
				res.status(401);
			}
		}
	} catch (err) {
		res.status(401);
		res.json(err);
	}
};

export default verifyAuthToken;
