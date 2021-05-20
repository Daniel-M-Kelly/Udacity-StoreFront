import { User, UserStore } from '../models/user';

const store = new UserStore();

describe('User Model', () => {
	it('Create method should exist', () => {
		expect(store.create).toBeDefined();
	});
});
