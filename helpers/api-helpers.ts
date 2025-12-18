import { expect, APIResponse, APIRequestContext } from '@playwright/test';
import { TEST_PASSWORDS } from './test-constants';
import { generateRandomUserData } from './generate-random-data';

export type ApiUser = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	avatar: string;
	id: number;
};

export const registerUserAPI = async (request: APIRequestContext): Promise<ApiUser> => {
	const { firstName, lastName, email, avatar } = generateRandomUserData();

	const response = await request.post('/api/users', {
		data: {
			email,
			firstname: firstName,
			lastname: lastName,
			password: TEST_PASSWORDS.valid,
			avatar: avatar,
		},
	});

	const user = await response.json();

	return {
		email: user.email,
		firstName: user.firstname,
		lastName: user.lastname,
		password: TEST_PASSWORDS.valid,
		avatar: user.avatar,
		id: user.id,
	};
};

export const expectSuccessfulJsonResponse = async (
	response: APIResponse,
	expectedStatus: number = 200
): Promise<void> => {
	expect(response.status()).toBe(expectedStatus);
	expect(response.headers()['content-type']).toContain('application/json');
};

export const expectJsonResponseWithBody = async <T = unknown>(
	response: APIResponse,
	expectedStatus: number = 200
): Promise<T> => {
	await expectSuccessfulJsonResponse(response, expectedStatus);
	return response.json() as Promise<T>;
};

export const deleteUser = async (request: APIRequestContext, userId: number): Promise<void> => {
	await request.delete(`/api/users/${userId}`).catch(() => {});
};
