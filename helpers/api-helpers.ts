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

export type ApiUserResponse = {
	firstname: string;
	lastname: string;
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
	await expectSuccessfulJsonResponse(response, 201);
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

export const expectUnsuccessfulJsonResponse = async (
	response: APIResponse,
	expectedStatus: number = 400
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
	const response = await request.delete(`/api/users/${userId}`);
	await expectSuccessfulJsonResponse(response);
};

export const deleteArticle = async (request: APIRequestContext, articleId: number): Promise<void> => {
	const response = await request.delete(`/api/articles/${articleId}`);
	await expectSuccessfulJsonResponse(response);
};

export const loginUserAPI = async (
	request: APIRequestContext,
	email: string,
	password: string
): Promise<{ access_token: string }> => {
	const loginResponse = await request.post('/api/login', {
		data: {
			email,
			password,
		},
	});
	const responseBody = await expectJsonResponseWithBody<{ access_token: string }>(loginResponse);
	const { access_token } = responseBody;

	expect(access_token).toBeDefined();

	return { access_token };
};
