import { test, expect } from '../../fixtures/api.fixture';
import { generateRandomUserData } from '../../helpers/generate-random-data';
import { TEST_PASSWORDS } from '../../helpers/test-constants';
import {
	expectSuccessfulJsonResponse,
	expectJsonResponseWithBody,
	deleteUser,
	registerUserAPI,
} from '../../helpers/api-helpers';

test.describe('Users API', () => {
	test('GET /api/users should return list of users', async ({ request }) => {
		const newUser = await registerUserAPI(request);

		try {
			const response = await request.get('/api/users');
			await expectSuccessfulJsonResponse(response);
			const users = await response.json();

			expect(users).toBeInstanceOf(Array);
			expect(users.length).toBeGreaterThan(0);

			const foundUser = users.find((user: any) => user.id === newUser.id);
			expect(foundUser).toBeDefined();
			expect(foundUser).toMatchObject({
				email: expect.any(String),
				firstname: newUser.firstName,
				lastname: expect.any(String),
				password: expect.any(String),
				avatar: newUser.avatar,
				id: newUser.id,
			});
		} finally {
			await deleteUser(request, newUser.id);
		}
	});

	test('POST /api/users should create a new user', async ({ request }) => {
		const { firstName, lastName, email, avatar } = generateRandomUserData();
		const response = await request.post('/api/users', {
			data: {
				email,
				firstname: firstName,
				lastname: lastName,
				password: TEST_PASSWORDS.valid,
				avatar,
			},
		});
		await expectSuccessfulJsonResponse(response, 201);
		const user = await response.json();

		try {
			expect(user).toEqual({
				email,
				firstname: firstName,
				lastname: lastName,
				password: TEST_PASSWORDS.valid,
				avatar,
				id: user.id,
			});
		} finally {
			await deleteUser(request, user.id);
		}
	});

	test('GET /api/users/:id should return a specific user', async ({ request }) => {
		const newUser = await registerUserAPI(request);

		try {
			const response = await request.get(`/api/users/${newUser.id}`);
			await expectSuccessfulJsonResponse(response);

			const user = await response.json();
			expect(user).toEqual({
				email: '****',
				firstname: newUser.firstName,
				lastname: '****',
				password: '****',
				avatar: newUser.avatar,
				id: newUser.id,
			});
		} finally {
			await deleteUser(request, newUser.id);
		}
	});

	test('PUT /api/users/:id should update a specific user with all fields required', async ({ tempAuthUser }) => {
		const { user, request: authRequest } = tempAuthUser;

		const { firstName, lastName, email, avatar } = generateRandomUserData();
		const updatedResponse = await authRequest.put(`/api/users/${user.id}`, {
			data: {
				email: email,
				firstname: firstName,
				lastname: lastName,
				password: TEST_PASSWORDS.weak,
				avatar: avatar,
			},
		});

		const updatedUser = await expectJsonResponseWithBody(updatedResponse);
		expect(updatedUser).toEqual({
			email: email,
			firstname: firstName,
			lastname: lastName,
			password: TEST_PASSWORDS.weak,
			avatar: avatar,
			id: user.id,
		});
	});

	test('PATCH /api/users/:id should partially update a specific user', async ({ tempAuthUser }) => {
		const { user, request: authRequest } = tempAuthUser;

		const updateAvatar = generateRandomUserData();
		const updatedResponse = await authRequest.patch(`/api/users/${user.id}`, {
			data: {
				avatar: updateAvatar.avatar,
			},
		});

		const updatedUser = await expectJsonResponseWithBody(updatedResponse);
		expect(updatedUser).toEqual({
			email: user.email,
			firstname: user.firstName,
			lastname: user.lastName,
			password: user.password,
			avatar: updateAvatar.avatar,
			id: user.id,
		});
	});

	test('DELETE /api/users/:id should delete a user', async ({ tempAuthUser }) => {
		const { user, request: authRequest } = tempAuthUser;

		const response = await authRequest.delete(`/api/users/${user.id}`);
		await expectSuccessfulJsonResponse(response);

		const getResponse = await authRequest.get(`/api/users/${user.id}`);
		expect(getResponse.status()).toBe(404);
	});

	test('HEAD /api/users/:id should return headers without body', async ({ request }) => {
		const newUser = await registerUserAPI(request);

		try {
			const response = await request.head(`/api/users/${newUser.id}`);

			await expectSuccessfulJsonResponse(response);

			const body = await response.text();
			expect(body).toBe('');
		} finally {
			await deleteUser(request, newUser.id);
		}
	});
});
