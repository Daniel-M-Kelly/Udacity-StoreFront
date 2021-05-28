import { OrderModel } from '../../src/models/order';
import { UserModel } from '../../src/models/user';
import { ProductModel } from '../../src/models/product';
import supertest from 'supertest';
import app from '../../src/server';
import client from '../../src/database';

const userModel = new UserModel();
const productModel = new ProductModel();
const orderModel = new OrderModel();
const request = supertest(app);
let userToken = '';

describe('Order Model', () => {
	describe('Test methods exist', () => {
		describe('Test Order Methods', () => {
			it('Index method should exist', () => {
				expect(orderModel.index).toBeDefined();
			});

			it('Show method should exist', () => {
				expect(orderModel.show).toBeDefined();
			});

			it('Create method should exist', () => {
				expect(orderModel.create).toBeDefined();
			});

			it('Edit method should exist', () => {
				expect(orderModel.edit).toBeDefined();
			});

			it('Delete method should exist', () => {
				expect(orderModel.delete).toBeDefined();
			});

			it('current method should exist', () => {
				expect(orderModel.current).toBeDefined();
			});
		});
		describe('Test Order Product Methods', () => {
			it('Index method should exist', () => {
				expect(orderModel.indexOrderProduct).toBeDefined();
			});

			it('Show method should exist', () => {
				expect(orderModel.showOrderProduct).toBeDefined();
			});

			it('Add method should exist', () => {
				expect(orderModel.addOrderProduct).toBeDefined();
			});

			it('Edit method should exist', () => {
				expect(orderModel.editOrderProduct).toBeDefined();
			});

			it('Delete method should exist', () => {
				expect(orderModel.deleteOrderProduct).toBeDefined();
			});
		});
	});

	describe('Test methods return correct values', () => {
		beforeAll(async () => {
			await userModel.create({
				userName: 'testUserOrder',
				firstName: 'Test',
				lastName: 'User',
				password: 'test123'
			});

			await productModel.create({
				name: 'widget',
				price: 19.99,
				category: 'Misc.'
			});
		});

		afterAll(async () => {
			const conn = await client.connect();
			const sql =
				'DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM products;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;\n';
			await conn.query(sql);
			conn.release();
		});

		describe('Test Order Methods return correct values', () => {
			afterAll(async () => {
				const conn = await client.connect();
				const sql = 'ALTER SEQUENCE orders_id_seq RESTART WITH 1;\n';
				conn.query(sql);
			});
			it('Create method should return an order', async () => {
				const result = await orderModel.create({
					user_id: 1,
					complete: false
				});
				expect(result).toEqual(
					jasmine.objectContaining({
						id: 1,
						user_id: '1'
					})
				);
			});

			it('Index method should return array of orders with order 1 in it', async () => {
				const result = await orderModel.index();
				expect(result).toEqual([
					jasmine.objectContaining({
						id: 1
					})
				]);
			});

			it('Current method should return incomplete orders associated with user_id', async () => {
				const result = await orderModel.current(1);
				expect(result).toEqual(
					jasmine.objectContaining({
						id: 1,
						userName: 'testUserOrder'
					})
				);
			});

			it('Show method should return widget when called with ID', async () => {
				const result = await orderModel.show(1);
				expect(result).toEqual(
					jasmine.objectContaining({
						id: 1
					})
				);
			});

			it('Edit method should return a order with edited properties', async () => {
				const result = await orderModel.edit({
					id: 1,
					user_id: 1,
					complete: true
				});
				expect(result).toEqual(
					jasmine.objectContaining({
						complete: true
					})
				);
			});

			it('Delete method should return', async () => {
				const result = await orderModel.delete(1);
				expect(result).toEqual(
					jasmine.objectContaining({
						id: 1
					})
				);
			});
		});
		describe('Test Order Product methods return correct values', () => {
			beforeAll(async () => {
				await orderModel.create({
					user_id: 1,
					complete: true
				});
			});

			afterAll(async () => {
				const conn = await client.connect();
				const sql =
					'DELETE FROM order_products;\n ALTER SEQUENCE order_products_id_seq RESTART WITH 1; DELETE FROM orders;\n ALTER SEQUENCE orders_id_seq RESTART WITH 1;\n';
				await conn.query(sql);
				conn.release();
			});
			it('Add method should return an order product', async () => {
				const result = await orderModel.addOrderProduct({
					quantity: 5,
					order_id: 1,
					product_id: 1
				});
				expect(result).toEqual(
					jasmine.objectContaining({
						id: 1
					})
				);
			});

			it('Index method should return array of orders with orderproduct 1 in it', async () => {
				const result = await orderModel.indexOrderProduct(1);
				expect(result).toEqual([
					jasmine.objectContaining({
						id: 1
					})
				]);
			});

			it('Show method should return widget when called with ID', async () => {
				const result = await orderModel.showOrderProduct(1, 1);
				expect(result).toEqual(
					jasmine.objectContaining({
						id: '1'
					})
				);
			});

			it('Edit method should return a order with edited properties', async () => {
				const result = await orderModel.editOrderProduct({
					id: 1,
					quantity: 10,
					order_id: 1,
					product_id: 1
				});
				expect(result).toEqual(
					jasmine.objectContaining({
						quantity: 10
					})
				);
			});

			it('Delete method should return', async () => {
				const result = await orderModel.deleteOrderProduct(1, 1);
				expect(result).toEqual(
					jasmine.objectContaining({
						id: 1
					})
				);
			});
		});
	});

	describe('Test API Endpoints', () => {
		beforeAll(async () => {
			await userModel.create({
				userName: 'testUserOrder',
				firstName: 'Test',
				lastName: 'User',
				password: 'test123'
			});

			await productModel.create({
				name: 'widget',
				price: 19.99,
				category: 'Misc.'
			});
		});

		afterAll(async () => {
			const conn = await client.connect();
			const sql =
				'DELETE FROM order_products; \n ALTER SEQUENCE order_products_id_seq RESTART WITH 1;\n DELETE FROM orders; \n ALTER SEQUENCE orders_id_seq RESTART WITH 1;\n DELETE FROM products; \n ALTER SEQUENCE products_id_seq RESTART WITH 1;\n DELETE FROM users; \n ALTER SEQUENCE users_id_seq RESTART WITH 1;\n';
			await conn.query(sql);
			conn.release();
		});

		it('Check if server runs, should return 200 status', async () => {
			const response = await request.get('/');
			expect(response.status).toBe(200);
		});

		it('Authenticate user and get token', async () => {
			const response = await request
				.post('/users/authenticate')
				.set('Content-type', 'application/json')
				.send({
					userName: 'testUserOrder',
					password: 'test123'
				});
			expect(response.status).toBe(200);

			userToken = response.body;
		});

		it('Test Add an Order', async () => {
			const response = await request
				.post('/orders')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					user_id: 1,
					complete: false
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					user_id: '1'
				})
			);
		});

		it('Test add should return created order product', async () => {
			const response = await request
				.post('/orders/1')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					quantity: 5,
					order_id: 1,
					product_id: 1
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					quantity: 5
				})
			);
		});

		it('Test Index should return array of orders', async () => {
			const response = await request
				.get('/orders')
				.set('Authorization', 'Bearer ' + userToken);
			expect(response.status).toBe(200);
			expect(response.body).toEqual([
				jasmine.objectContaining({
					id: 1
				})
			]);
		});

		it('Test Show should return order', async () => {
			const response = await request
				.get('/orders/1')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					id: 1
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					id: 1
				})
			);
		});

		it('Test Index should return array of products in an order', async () => {
			const response = await request
				.get('/orders/1/items')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					order_id: 1
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual([
				jasmine.objectContaining({
					id: 1
				})
			]);
		});

		it('Test Show should return order product', async () => {
			const response = await request
				.get('/orders/1/items/1')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					order_id: 1,
					product_id: 1
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					product: 'widget'
				})
			);
		});
		it('Test Current order should return open orders for user', async () => {
			const response = await request
				.get('/orders/current/1')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					user_id: 1
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					userName: 'testUserOrder'
				})
			);
		});

		it('Test edit should return edited order', async () => {
			const response = await request
				.patch('/orders/1')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					id: 1,
					user_id: 1,
					complete: true
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					complete: true
				})
			);
		});

		it('Test edit should return edited order product', async () => {
			const response = await request
				.patch('/orders/1/items/1')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					id: 1,
					product_id: 1,
					order_id: 1,
					quantity: 100
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					quantity: 100
				})
			);
		});

		it('Test delete should return deleted order product', async () => {
			const response = await request
				.delete('/orders/1')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					order_id: 1,
					product_id: 1
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					id: 1
				})
			);
		});

		it('Test delete should return deleted order', async () => {
			const response = await request
				.delete('/orders')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					id: 1
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					id: 1
				})
			);
		});
	});
});
