import { test as base, APIRequestContext } from '@playwright/test';
import { expectJsonResponseWithBody, registerUserAPI, type ApiUser } from '../helpers/api-helpers';
import fs from 'fs';

type ApiFixtures = {
	authRequest: APIRequestContext;
	tempAuthUser: {
		user: ApiUser;
		request: APIRequestContext;
	};
};

export const test = base.extend<ApiFixtures>({
	authRequest: async ({ playwright }, use) => {
		const authData = JSON.parse(fs.readFileSync('.auth/api-user.json', 'utf-8'));

		const context = await playwright.request.newContext({
			baseURL: 'http://localhost:3000',
			extraHTTPHeaders: {
				Authorization: `Bearer ${authData.access_token}`,
			},
		});

		await use(context);
		await context.dispose();
	},

	tempAuthUser: async ({ request, playwright }, use) => {
		const user = await registerUserAPI(request);

		const loginResponse = await request.post('/api/login', {
			data: {
				email: user.email,
				password: user.password,
			},
		});

		const { access_token } = await expectJsonResponseWithBody<{ access_token: string }>(loginResponse);

		const authContext = await playwright.request.newContext({
			baseURL: 'http://localhost:3000',
			extraHTTPHeaders: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		await use({ user, request: authContext });

		await authContext.delete(`/api/users/${user.id}`).catch(() => {});
		await authContext.dispose();
	},
});

export { expect } from '@playwright/test';
