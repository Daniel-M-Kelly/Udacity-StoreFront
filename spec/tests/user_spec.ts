import { User, UserModel } from '../../src/models/user';

const store = new UserModel();

describe('User Model', () => {
	it('Create method should exist', () => {
		expect(store.create).toBeDefined();
	});
});
