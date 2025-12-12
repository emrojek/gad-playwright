import { test as setup, expect } from '@playwright/test';
import { registerUserAPI, type UserCredentials } from '../../helpers/auth-helpers';
import fs from 'fs';

const authFile = '.auth/api-user.json';

setup('create test user for API', async ({ request }) => {
	const user: UserCredentials = await registerUserAPI(request);

	const loginResponse = await request.post('/api/login', {
		data: {
			email: user.email,
			password: user.password,
		},
	});

	expect(loginResponse.ok()).toBeTruthy();
	expect(loginResponse.status()).toBe(200);

	const responseBody = await loginResponse.json();
	const { access_token } = responseBody;

	expect(access_token).toBeDefined();

	fs.writeFileSync(authFile, JSON.stringify({ access_token }));
});
