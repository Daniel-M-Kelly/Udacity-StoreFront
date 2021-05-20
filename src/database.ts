import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
	POSTGRES_HOST,
	POSTGRES_DB,
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	ENV,
	POSTGRES_DB_TEST
} = process.env;

let client;

if (ENV == 'dev') {
	client = new Pool({
		host: POSTGRES_HOST,
		database: POSTGRES_DB,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD
	});
}

if (ENV == 'test') {
	client = new Pool({
		host: POSTGRES_HOST,
		database: POSTGRES_DB_TEST,
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD
	});
}

export default client as Pool;
