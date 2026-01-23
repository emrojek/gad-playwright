import { test, expect } from '../../fixtures/api.fixture';
import { generateRandomUserData } from '../../helpers/generate-random-data';
import { TEST_PASSWORDS } from '../../helpers/test-constants';
import {
	expectSuccessfulJsonResponse,
	expectUnsuccessfulJsonResponse,
	expectJsonResponseWithBody,
	ApiUserResponse,
	loginUserAPI,
} from '../../helpers/api-helpers';

test.describe('Users API', () => {
	test.describe('Positive scenarios', () => {
		test('GET /api/users should return list of users', async ({ request, tempUser }) => {
			const response = await request.get('/api/users');
			const users = await expectJsonResponseWithBody<ApiUserResponse[]>(response);

			expect(users).toBeInstanceOf(Array);
			expect(users.length).toBeGreaterThan(0);

			const foundUser = users.find(user => user.id === tempUser.id);

			expect(foundUser).toBeDefined();
			expect(foundUser).toMatchObject({
				email: expect.any(String),
				firstname: tempUser.firstName,
				lastname: expect.any(String),
				password: expect.any(String),
				avatar: tempUser.avatar,
				id: tempUser.id,
			});
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
			const user = await expectJsonResponseWithBody<ApiUserResponse>(response, 201);

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
				const { access_token } = await loginUserAPI(request, user.email, TEST_PASSWORDS.valid);
				const deleteResponse = await request.delete(`/api/users/${user.id}`, {
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				});

				await expectSuccessfulJsonResponse(deleteResponse);
			}
		});

		test('GET /api/users/:id should return a specific user', async ({ request, tempUser }) => {
			const response = await request.get(`/api/users/${tempUser.id}`);

			await expectSuccessfulJsonResponse(response);

			const user = await response.json();

			expect(user).toEqual({
				email: '****',
				firstname: tempUser.firstName,
				lastname: '****',
				password: '****',
				avatar: tempUser.avatar,
				id: tempUser.id,
			});
		});

		test('PUT /api/users/:id should update a specific user with all fields required', async ({ tempAuthUser }) => {
			const { user, userAuthRequest } = tempAuthUser;
			const { firstName, lastName, avatar } = generateRandomUserData();
			const updatedResponse = await userAuthRequest.put(`/api/users/${user.id}`, {
				data: {
					email: user.email,
					firstname: firstName,
					lastname: lastName,
					password: TEST_PASSWORDS.weak,
					avatar,
				},
			});
			const updatedUser = await expectJsonResponseWithBody<ApiUserResponse>(updatedResponse);

			expect(updatedUser).toEqual({
				email: user.email,
				firstname: firstName,
				lastname: lastName,
				password: TEST_PASSWORDS.weak,
				avatar,
				id: user.id,
			});
		});

		test('PATCH /api/users/:id should partially update a specific user', async ({ tempAuthUser }) => {
			const { user, userAuthRequest } = tempAuthUser;
			const newUserData = generateRandomUserData();
			const updatedResponse = await userAuthRequest.patch(`/api/users/${user.id}`, {
				data: {
					avatar: newUserData.avatar,
				},
			});
			const updatedUser = await expectJsonResponseWithBody<ApiUserResponse>(updatedResponse);

			expect(updatedUser).toEqual({
				email: user.email,
				firstname: user.firstName,
				lastname: user.lastName,
				password: user.password,
				avatar: newUserData.avatar,
				id: user.id,
			});
		});

		test('DELETE /api/users/:id should delete a user', async ({ tempAuthUserNoCleanup }) => {
			const { user, userAuthRequest } = tempAuthUserNoCleanup;
			const response = await userAuthRequest.delete(`/api/users/${user.id}`);

			await expectSuccessfulJsonResponse(response);

			const getResponse = await userAuthRequest.get(`/api/users/${user.id}`);

			expect(getResponse.status()).toBe(404);
		});

		test('HEAD /api/users/:id should return headers without body', async ({ request, tempUser }) => {
			const response = await request.head(`/api/users/${tempUser.id}`);

			await expectSuccessfulJsonResponse(response);

			const body = await response.text();

			expect(body).toBe('');
		});
	});

	test.describe('Negative scenarios', () => {
		test('POST /api/users should not create a new user with previously used email', async ({ request }) => {
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
			const user = await expectJsonResponseWithBody<ApiUserResponse>(response, 201);
			const duplicateResponse = await request.post('/api/users', {
				data: {
					email: user.email,
					firstname: firstName,
					lastname: lastName,
					password: TEST_PASSWORDS.valid,
					avatar,
				},
			});

			try {
				await expectUnsuccessfulJsonResponse(duplicateResponse, 409);

				const duplicateBody = await duplicateResponse.json();

				expect(duplicateBody).toHaveProperty('error');
				expect(duplicateBody.error.message).toBe('Email not unique');
			} finally {
				const { access_token } = await loginUserAPI(request, user.email, TEST_PASSWORDS.valid);
				const deleteResponse = await request.delete(`/api/users/${user.id}`, {
					headers: {
						Authorization: `Bearer ${access_token}`,
					},
				});

				await expectSuccessfulJsonResponse(deleteResponse);
			}
		});

		test('POST /api/users should not create a new user with invalid request', async ({ request }) => {
			const response = await request.post('/api/users', {
				headers: { 'Content-Type': 'application/json' },
				data: '{"invalidJson": "true",',
			});

			await expectUnsuccessfulJsonResponse(response);

			const responseBody = await response.json();

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error).toContain('Unexpected data in JSON');
		});

		test('PUT /api/users/:id should return 400 with invalid JSON sent', async ({ tempAuthUser }) => {
			const { user, userAuthRequest } = tempAuthUser;
			const response = await userAuthRequest.put(`/api/users/${user.id}`, {
				headers: { 'Content-Type': 'application/json' },
				data: '{"invalidJson": "true",',
			});

			await expectUnsuccessfulJsonResponse(response);

			const responseBody = await response.json();

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error).toContain('Unexpected data in JSON');
		});

		test('PUT /api/users/:id should return 401 without authorization', async ({ request }) => {
			const { firstName, lastName, email, avatar } = generateRandomUserData();
			const response = await request.put('/api/users/1', {
				data: {
					email,
					firstname: firstName,
					lastname: lastName,
					password: TEST_PASSWORDS.valid,
					avatar,
				},
			});

			await expectUnsuccessfulJsonResponse(response, 401);

			const responseBody = await response.json();

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error.message).toBe('Access token not provided!');
		});

		test('PUT /api/users/:id should return 422 with any of the required fields missing', async ({
			tempAuthUser,
		}) => {
			const { user, userAuthRequest } = tempAuthUser;
			const updatedResponse = await userAuthRequest.put(`/api/users/${user.id}`, {
				data: {
					email: user.email,
					firstname: user.firstName,
					password: user.password,
					avatar: user.avatar,
				},
			});

			await expectUnsuccessfulJsonResponse(updatedResponse, 422);

			const responseBody = await updatedResponse.json();

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error.details).toContain('lastname');
		});
	});

	test.describe('Known bugs', { tag: '@bug' }, () => {
		test('BUG: POST /api/users should not create a new user without all required fields', async ({ request }) => {
			test.fail(); // Bug: API allows creating user without providing a password

			const { firstName, lastName, email, avatar } = generateRandomUserData();
			const response = await request.post('/api/users', {
				data: {
					email,
					firstname: firstName,
					lastname: lastName,
					avatar,
				},
			});

			await expectUnsuccessfulJsonResponse(response, 422);

			const responseBody = await response.json();

			const fieldsRequired = ['email', 'firstname', 'lastname', 'password', 'avatar'];

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error.details).toEqual(expect.arrayContaining(fieldsRequired));
		});

		test('BUG: GET /api/users/:id should return 400 with invalid id used', async ({ request }) => {
			test.fail(); // Bug: API returns 500 Internal Server Error (URIError: Failed to decode param) instead of 400 Bad Request

			const response = await request.get('/api/users/%');

			expect(response.status()).toBe(400);

			const responseBody = await response.json();

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error).toContain('Invalid user ID supplied');
		});

		test('BUG: GET /api/users/:id should return 404 for non-existing user', async ({ request }) => {
			test.fail(); // Bug: Instead of error message API returns JSON with masked 'email', 'lastname', and 'password' fields

			const response = await request.get('/api/users/999999999');

			await expectUnsuccessfulJsonResponse(response, 404);

			const responseBody = await response.json();

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error).toContain('User does not exist');
		});

		test('BUG: PUT /api/users/:id should not update user without password provided', async ({ tempAuthUser }) => {
			test.fail(); // Bug: API allows updating user without providing a password

			const { user, userAuthRequest } = tempAuthUser;
			const newUserData = generateRandomUserData();
			const updatedResponse = await userAuthRequest.put(`/api/users/${user.id}`, {
				data: {
					email: newUserData.email,
					firstname: user.firstName,
					lastname: user.lastName,
					avatar: user.avatar,
				},
			});

			await expectUnsuccessfulJsonResponse(updatedResponse, 422);

			const responseBody = await updatedResponse.json();
			const fieldsRequired = ['email', 'firstname', 'lastname', 'password', 'avatar'];

			expect(responseBody).toHaveProperty('error');
			expect(responseBody.error.details).toEqual(expect.arrayContaining(fieldsRequired));
		});
	});
});
