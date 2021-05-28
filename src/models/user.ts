import client from '../database';
import bcrypt from 'bcrypt';

const saltRounds = process.env.SALT_ROUNDS;
const pepper = process.env.BCRYPT_PASSWORD;

export type User = {
	id?: number;
	userName: string;
	firstName: string;
	lastName: string;
	password: string;
};

export class UserModel {
	async index(): Promise<User[]> {
		try {
			const conn = await client.connect();
			const sql = 'SELECT * FROM users';

			const result = await conn.query(sql);

			conn.release();

			return result.rows;
		} catch (err) {
			throw new Error(`Unable to retrieve users: ${err}`);
		}
	}

	async show(id: number): Promise<User> {
		try {
			const conn = await client.connect();
			const sql = 'SELECT * FROM users WHERE "id"=$1';

			const result = await conn.query(sql, [id]);

			conn.release();

			return result.rows[0];
		} catch (err) {
			throw new Error(`Unable to retrieve user ${id}: ${err}`);
		}
	}

	async create(u: User): Promise<User> {
		try {
			const conn = await client.connect();
			const sql =
				'INSERT INTO users ("userName", "firstName", "lastName", "password") VALUES ($1, $2, $3, $4) RETURNING *';

			const hash = bcrypt.hashSync(
				u.password + pepper,
				parseInt(saltRounds as unknown as string)
			);

			const result = await conn.query(sql, [
				u.userName,
				u.firstName,
				u.lastName,
				hash
			]);
			const user = result.rows[0];

			conn.release();

			return user;
		} catch (err) {
			throw new Error(`Unable to create user (${u.userName}): ${err}`);
		}
	}

	async edit(u: User): Promise<User> {
		try {
			const conn = await client.connect();
			const sql =
				'UPDATE users SET "userName" = $1, "firstName" = $2, "lastName" = $3, "password" = $4 WHERE "id" = $5 RETURNING *';

			const hash = bcrypt.hashSync(
				u.password + pepper,
				parseInt(saltRounds as unknown as string)
			);

			const result = await conn.query(sql, [
				u.userName,
				u.firstName,
				u.lastName,
				hash,
				u.id
			]);
			const user = result.rows[0];

			conn.release();

			return user;
		} catch (err) {
			throw new Error(`Unable to create user (${u.userName}): ${err}`);
		}
	}

	async delete(id: number): Promise<User> {
		try {
			const conn = await client.connect();
			const sql = 'DELETE FROM users WHERE "id"=$1 RETURNING *';

			const result = await conn.query(sql, [id]);

			const user = result.rows[0];

			conn.release();

			return user;
		} catch (err) {
			throw new Error(`Unable to delete user (${id}): ${err}`);
		}
	}

	async authenticate(
		userName: string,
		password: string
	): Promise<User | null> {
		const conn = await client.connect();
		const sql = 'SELECT "password" FROM users WHERE "userName"=$1';

		const result = await conn.query(sql, [userName]);

		if (result.rows.length) {
			const user = result.rows[0];

			if (bcrypt.compareSync(password + pepper, user.password)) {
				conn.release();
				return user;
			}
		}
		throw new Error('Invalid username or Password');
	}
}
