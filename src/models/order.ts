import client from '../database';

export type Order = {
	id?: number;
	user_id: number;
	complete: boolean;
};

export class OrderStore {
	async index(): Promise<Order[]> {
		try {
			const conn = await client.connect();
			const sql = 'SELECT * FROM orders';

			const result = await conn.query(sql);

			conn.release();
			return result.rows;
		} catch (err) {
			throw new Error(`Unable to retrieve orders: ${err}`);
		}
	}

	async show(id: number): Promise<Order> {
		try {
			const conn = await client.connect();
			const sql = 'SELECT * FROM orders WHERE "id"=$1';

			const result = await conn.query(sql, [id]);

			conn.release();
			return result.rows[0];
		} catch (err) {
			throw new Error(`unable to retrieve order: (${id}) ${err}`);
		}
	}

	async create(o: Order): Promise<Order> {
		try {
			const conn = await client.connect();
			const sql =
				'INSERT INTO orders ("user_id", "complete") VALUES ($1, $2) RETURNING *';

			const result = await conn.query(sql, [o.user_id, o.complete]);
			const order = result.rows[0];

			conn.release();

			return order;
		} catch (err) {
			throw new Error(`Could not create order (${o.id}): ${err}`);
		}
	}

	async edit(o: Order): Promise<Order> {
		try {
			const conn = await client.connect();
			const sql =
				'UPDATE orders SET "user_id" = $1, "complete" = $2 WHERE "id" = $3 RETURNING *';

			const result = await conn.query(sql, [o.user_id, o.complete, o.id]);
			const order = result.rows[0];

			conn.release();

			return order;
		} catch (err) {
			throw new Error(`Could not edit order (${o.id}): ${err}`);
		}
	}

	async delete(id: number): Promise<Order> {
		try {
			const conn = await client.connect();
			const sql = 'DELETE FROM orders WHERE "id"=$1';
			const result = await conn.query(sql, [id]);
			const order = result.rows[0];
			return order;
		} catch (err) {
			throw new Error(`Cannot delete user with id: (${id}) ${err}`);
		}
	}

	async addOrderProduct(
		quantity: number,
		order_id: number,
		product_id: number
	): Promise<Order> {
		try {
			const conn = await client.connect();
			const sql =
				'INSERT INTO order_products ("quantity", "order_id", "product_id" VALUES ($1, $2, $3)';

			const result = await conn.query(sql, [
				quantity,
				order_id,
				product_id
			]);

			const order = result.rows[0];

			conn.release();

			return order;
		} catch (err) {
			throw new Error(
				`Cannot add product id (${product_id}) to order id (${order_id}): ${err}`
			);
		}
	}

	async deleteOrderProduct(
		order_id: number,
		product_id: number
	): Promise<void> {
		try {
			const conn = await client.connect();
			const sql =
				'DELETE FROM order_products WHERE "order_id"=$1 AND "product_id"=$2';

			const result = await conn.query(sql, [order_id, product_id]);

			conn.release();
		} catch (err) {
			throw new Error(
				`Could not delete item (${product_id}) from Order (${order_id}): ${err}`
			);
		}
	}

	async updateOrderProductQty(
		quantity: number,
		order_id: number,
		product_id: number
	): Promise<void> {
		try {
			const conn = await client.connect();
			const sql =
				'UPDATE order_products SET "quantity" = $1 where "order_id"= $2 and "product_id" = $3 ';

			const result = await conn.query(sql, [
				quantity,
				order_id,
				product_id
			]);
			conn.release();
		} catch (err) {
			throw new Error(
				`Could not update quantity of product (${product_id}) in order (${order_id}): ${err}`
			);
		}
	}
}