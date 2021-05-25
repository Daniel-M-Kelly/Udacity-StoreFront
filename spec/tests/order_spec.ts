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
const userToken = '';

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
				userName: 'testUserProduct',
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
			conn.query(sql);
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
				conn.query(sql);
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

			xit('Index method should return array of orders with orderproduct 1 in it', async () => {
				const result = await orderModel.indexOrderProduct(1);
				expect(result).toEqual([
					jasmine.objectContaining({
						id: 1
					})
				]);
			});

			xit('Show method should return widget when called with ID', async () => {
				const result = await orderModel.showOrderProduct(1, 1);
				expect(result).toEqual(
					jasmine.objectContaining({
						id: '1'
					})
				);
			});

			xit('Edit method should return a order with edited properties', async () => {
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

			xit('Delete method should return', async () => {
				const result = await orderModel.deleteOrderProduct(1, 1);
				expect(result).toEqual(
					jasmine.objectContaining({
						id: 1
					})
				);
			});
		});
	});
	/*
	xdescribe('Test API Endpoints', () => {
		beforeAll(async () => {
			await userModel.create({
				userName: 'testUser',
				firstName: 'Test',
				lastName: 'User',
				password: 'test123'
			});

			await orderModel.create({
				name: 'widget',
				price: 19.99,
				category: 'Misc.'
			});
		});

		afterAll(async () => {
			const conn = await client.connect();
			const sql =
				'DELETE FROM users; \nALTER SEQUENCE users_id_seq RESTART WITH 1;\n';
			conn.query(sql);
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
					userName: 'testUser',
					password: 'test123'
				});
			expect(response.status).toBe(200);

			userToken = response.body;
		});

		it('Test Index should return array of orders', async () => {
			const response = await request
				.get('/orders')
				.set('Authorization', 'Bearer ' + userToken);
			expect(response.status).toBe(200);
			expect(response.body).toEqual([
				jasmine.objectContaining({
					name: 'widget'
				})
			]);
		});

		it('Test Show should return order', async () => {
			const response = await request
				.get('/orders/2')
				.set('Authorization', 'Bearer ' + userToken);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					name: 'widget'
				})
			);
		});

		it('Test Create should return created order', async () => {
			const response = await request
				.post('/orders')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					name: 'gizmo',
					price: 99.99,
					category: 'Misc.'
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					name: 'gizmo'
				})
			);
		});

		it('Test edit should return edited order', async () => {
			const response = await request
				.patch('/orders/2')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					id: 3,
					name: 'gizmo',
					price: 199.95,
					category: 'Misc.'
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					price: '199.95'
				})
			);
		});

		it('Test delete should return deleted order', async () => {
			const response = await request
				.delete('/orders')
				.set('Authorization', 'Bearer ' + userToken)
				.send({
					id: 3
				});
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					name: 'gizmo'
				})
			);
		});
	});*/
});
