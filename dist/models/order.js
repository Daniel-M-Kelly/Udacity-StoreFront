"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const database_1 = __importDefault(require("../database"));
class OrderModel {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT o.id AS id, u.\"userName\" AS \"userName\", JSON_AGG(JSONB_BUILD_OBJECT('product_id', p.id, 'name', p.name, 'price', p.price, 'quantity', op.quantity)) AS products, o.complete AS complete FROM orders AS o Left JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id GROUP BY o.id, u.\"userName\", o.complete";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Unable to retrieve orders: ${err}`);
        }
    }
    async show(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT o.id AS id, u.\"userName\" AS \"userName\", JSON_AGG(JSONB_BUILD_OBJECT('product_id', p.id, 'name', p.name, 'price', p.price, 'quantity', op.quantity)) AS products, o.complete AS complete FROM orders AS o Left JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id WHERE o.id = $1 GROUP BY o.id, u.\"userName\", o.complete";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`unable to retrieve order: (${id}) ${err}`);
        }
    }
    async current(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT o.id AS id, u.\"userName\" AS \"userName\", JSON_AGG(JSONB_BUILD_OBJECT('product_id', p.id, 'name', p.name, 'price', p.price, 'quantity', op.quantity)) AS products, o.complete AS complete FROM orders AS o Left JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id WHERE o.user_id = $1 AND o.complete = false GROUP BY o.id, u.\"userName\", o.complete";
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`unable to retrieve order: (${id}) ${err}`);
        }
    }
    async create(o) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'INSERT INTO orders ("user_id", "complete") VALUES ($1, $2) RETURNING *';
            const result = await conn.query(sql, [o.user_id, o.complete]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not create order (${o.id}): ${err}`);
        }
    }
    async edit(o) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'UPDATE orders SET "user_id" = $1, "complete" = $2 WHERE "id" = $3 RETURNING *';
            const result = await conn.query(sql, [o.user_id, o.complete, o.id]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not edit order (${o.id}): ${err}`);
        }
    }
    async delete(id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'DELETE FROM orders WHERE "id"=$1 RETURNING *';
            const result = await conn.query(sql, [id]);
            const order = result.rows[0];
            return order;
        }
        catch (err) {
            throw new Error(`Cannot delete user with id: (${id}) ${err}`);
        }
    }
    async indexOrderProduct(order_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT o.id AS id, JSON_AGG(JSONB_BUILD_OBJECT('product_id', p.id, 'name', p.name, 'price', p.price, 'quantity', op.quantity)) AS products FROM orders AS o LEFT JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id WHERE o.id = $1 GROUP BY o.id";
            const result = await conn.query(sql, [order_id]);
            return result.rows;
        }
        catch (err) {
            throw new Error(`Cannot retreive products in Order (${order_id}): ${err}`);
        }
    }
    async showOrderProduct(order_id, product_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT op."order_id" AS id, op."quantity", p."name" AS product, p."price" AS price FROM order_products AS op JOIN products AS p ON p."id" = op."product_id" WHERE "order_id" = $1 AND "product_id" = $2';
            const result = await conn.query(sql, [order_id, product_id]);
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Cannot retreive Product (${product_id}) in Order (${order_id}): ${err}`);
        }
    }
    async addOrderProduct(oP) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'INSERT INTO order_products ("quantity", "order_id", "product_id") VALUES ($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [
                oP.quantity,
                oP.order_id,
                oP.product_id
            ]);
            const orderProduct = result.rows[0];
            conn.release();
            return orderProduct;
        }
        catch (err) {
            throw new Error(`Cannot add product id (${oP.product_id}) to order id (${oP.order_id}): ${err}`);
        }
    }
    async deleteOrderProduct(order_id, product_id) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'DELETE FROM order_products WHERE "order_id"=$1 AND "product_id"=$2 RETURNING *';
            const result = await conn.query(sql, [order_id, product_id]);
            const orderProduct = result.rows[0];
            conn.release();
            return orderProduct;
        }
        catch (err) {
            throw new Error(`Could not delete item (${product_id}) from Order (${order_id}): ${err}`);
        }
    }
    async editOrderProduct(oP) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'UPDATE order_products SET "quantity" = $1, "order_id" = $2,  "product_id" = $3 WHERE "id" = $4 RETURNING *';
            const result = await conn.query(sql, [
                oP.quantity,
                oP.order_id,
                oP.product_id,
                oP.id
            ]);
            const orderProduct = result.rows[0];
            conn.release();
            return orderProduct;
        }
        catch (err) {
            throw new Error(`Could not update quantity of product (${oP.product_id}) in order (${oP.order_id}): ${err}`);
        }
    }
}
exports.OrderModel = OrderModel;
