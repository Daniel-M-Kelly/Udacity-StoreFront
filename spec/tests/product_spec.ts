import { ProductModel } from '../../src/models/product';
import { UserModel } from '../../src/models/user';
import supertest from 'supertest';
import app from '../../src/server';
import client from '../../src/database';

const userModel = new UserModel();
const productModel = new ProductModel();
const request = supertest(app);
let userToken = '';

describe('Product Model', () => {
	describe('Test methods exist', () => {
		it('Index method should exist', () => {
			expect(productModel.index).toBeDefined();
		});

		it('Show method should exist', () => {
			expect(productModel.show).toBeDefined();
		});

		it('Create method should exist', () => {
			expect(productModel.create).toBeDefined();
		});

		it('Edit method should exist', () => {
			expect(productModel.edit).toBeDefined();
		});

		it('Delete method should exist', () => {
			expect(productModel.delete).toBeDefined();
		});
	});

	describe('Test methods return correct values', () => {
		it('Create method should return a Product', async () => {
			const result = await productModel.create({
				name: 'widget',
				price: 9.99,
				category: 'Misc.'
			});
			expect(result).toEqual(
				jasmine.objectContaining({
					name: 'widget',
					price: '9.99',
					category: 'Misc.'
				})
			);
		});

		it('Index method should return array of users with testUser in it', async () => {
			const result = await productModel.index();
			expect(result).toEqual([
				jasmine.objectContaining({
					name: 'widget'
				})
			]);
		});

		it('Show method should return widget when called with ID', async () => {
			const result = await productModel.show(1);
			expect(result).toEqual(
				jasmine.objectContaining({
					name: 'widget'
				})
			);
		});

		it('Edit method should return a product with edited properties', async () => {
			const result = await productModel.edit({
				id: 1,
				name: 'widget',
				price: 19.99,
				category: 'Misc.'
			});
			expect(result).toEqual(
				jasmine.objectContaining({
					price: '19.99'
				})
			);
		});

		it('Delete method should return', async () => {
			const result = await productModel.delete(1);
			expect(result).toEqual(
				jasmine.objectContaining({
					name: 'widget'
				})
			);
		});
	});

	describe('Test API Endpoints', () => {
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
					userName: 'testUserProduct',
					password: 'test123'
				});
			expect(response.status).toBe(200);

			userToken = response.body;
		});

		it('Test Index should return array of products', async () => {
			const response = await request
				.get('/products')
				.set('Authorization', 'Bearer ' + userToken);
			expect(response.status).toBe(200);
			expect(response.body).toEqual([
				jasmine.objectContaining({
					name: 'widget'
				})
			]);
		});

		it('Test Show should return product', async () => {
			const response = await request
				.get('/products/2')
				.set('Authorization', 'Bearer ' + userToken);
			expect(response.status).toBe(200);
			expect(response.body).toEqual(
				jasmine.objectContaining({
					name: 'widget'
				})
			);
		});

		it('Test Create should return created Product', async () => {
			const response = await request
				.post('/products')
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

		it('Test edit should return edited User', async () => {
			const response = await request
				.patch('/products/2')
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

		it('Test delete should return deleted Product', async () => {
			const response = await request
				.delete('/products')
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
	});
});
