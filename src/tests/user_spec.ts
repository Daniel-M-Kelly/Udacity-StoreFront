import { User, UserModel } from '../models/user';

const store = new UserModel();

describe('User Model', () => {
	it('Create method should exist', () => {
		expect(store.create).toBeDefined();
	});
});
