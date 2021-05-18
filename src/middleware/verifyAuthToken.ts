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
			const decode = jwt.verify(
				token,
				process.env.TOKEN_SECRET as unknown as string
			);
			if (decode) {
				next();
			} else {
				res.status(401).send('Invalid or Expired Token');
			}
		} else {
			res.status(401).send('Valid Token Required');
		}
	} catch (err) {
		res.status(401);
		res.json(err);
	}
};

export default verifyAuthToken;
