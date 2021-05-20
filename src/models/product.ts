import client from '../database';

export type Product = {
	id?: number;
	name: string;
	price: number;
	category: string;
};

export class ProductModel {
	async index(): Promise<Product[]> {
		try {
			const conn = await client.connect();
			const sql = 'SELECT * FROM products';

			const result = await conn.query(sql);

			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Unable to retrieve products: ${err}`);
		}
	}

	async show(id: number): Promise<Product> {
		try {
			const conn = await client.connect();
			const sql = 'SELECT * FROM products WHERE "id"=$1';

			const result = await conn.query(sql, [id]);

			conn.release();
			return result.rows[0];
		} catch (err) {
			throw new Error(`Unable to retrieve product: ${err}`);
		}
	}

	async create(p: Product): Promise<Product> {
		try {
			const conn = await client.connect();
			const sql =
				'INSERT INTO products ("name", "price", "category") VALUES ($1, $2, $3) RETURNING *';

			const result = await conn.query(sql, [p.name, p.price, p.category]);

			const product = result.rows[0];
			conn.release();

			return product;
		} catch (err) {
			throw new Error(`Unable to create Product (${p.name}): ${err}`);
		}
	}

	async edit(p: Product): Promise<Product> {
		try {
			const conn = await client.connect();
			const sql =
				'UPDATE products SET "name" = $1, "price" = $2, "category" = $3 WHERE "id" = $4 RETURNING *';

			const result = await conn.query(sql, [
				p.name,
				p.price,
				p.category,
				p.id
			]);

			const product = result.rows[0];
			conn.release();

			return product;
		} catch (err) {
			throw new Error(`Unable to edit Product (${p.name}): ${err}`);
		}
	}

	async delete(id: number): Promise<Product> {
		try {
			const conn = await client.connect();
			const sql = 'DELETE FROM products WHERE "id"=$1';
			const result = await conn.query(sql, [id]);
			const product = result.rows[0];
			conn.release();
			return product;
		} catch (err) {
			throw new Error(`Cannot Delete User with id: (${id}) ${err}`);
		}
	}
}
