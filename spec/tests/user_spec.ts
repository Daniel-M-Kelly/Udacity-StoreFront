import { UserModel } from '../../src/models/user';

const userModel = new UserModel();

describe('User Model', () => {
	it('Create method should exist', () => {
		expect(userModel.create).toBeDefined();
	});
	it('Create method should return a User', async () => {
		const result = await userModel.create({
			userName: 'testUser',
			firstName: 'Test',
			lastName: 'User',
			password: 'test123'
		});
		expect(result).toEqual(
			jasmine.objectContaining({
				userName: 'testUser',
				firstName: 'Test',
				lastName: 'User'
			})
		);
	});
	it('Index method should exist', () => {
		expect(userModel.index).toBeDefined();
	});
	it('Index method should return array of users', async () => {
		const result = await userModel.index();
		expect(result).toEqual(
			jasmine.objectContaining([
				{
					userName: 'testUser'
				}
			])
		);
	});
});
