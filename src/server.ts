import express, { Request, Response } from 'express';
//import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const EXPRESS_PORT = process.env.EXPRESS_PORT;

const app: express.Application = express();
const address = `0.0.0.0:${EXPRESS_PORT}`;

//bodyParser is deprecated, use express.json() instead
//app.use(bodyParser.json());

app.use(express.json());

app.get('/', function (req: Request, res: Response) {
	res.send('Hello World!');
});

app.listen(3000, function () {
	console.log(`starting app on: ${address}`);
});
