import { test as base, APIRequestContext } from '@playwright/test';
import { registerUserAPI, deleteUser, loginUserAPI, type ApiUser } from '../helpers/api-helpers';
import fs from 'fs';

type ApiFixtures = {
	authRequest: APIRequestContext;
	tempAuthUser: {
		user: ApiUser;
		userAuthRequest: APIRequestContext;
	};
	tempAuthUserNoCleanup: {
		user: ApiUser;
		userAuthRequest: APIRequestContext;
	};
	tempUser: ApiUser;
};

export const test = base.extend<ApiFixtures>({
	authRequest: async ({ request, playwright }, use) => {
		const authData = JSON.parse(fs.readFileSync('.auth/api-user.json', 'utf-8'));

		const { access_token } = await loginUserAPI(request, authData.userEmail, authData.userPassword);

		const context = await playwright.request.newContext({
			baseURL: 'http://localhost:3000',
			extraHTTPHeaders: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		await use(context);
		await context.dispose();
	},

	tempAuthUser: async ({ request, playwright }, use) => {
		const user = await registerUserAPI(request);
		const { access_token } = await loginUserAPI(request, user.email, user.password);
		const authContext = await playwright.request.newContext({
			baseURL: 'http://localhost:3000',
			extraHTTPHeaders: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		await use({ user, userAuthRequest: authContext });
		await deleteUser(authContext, user.id);
		await authContext.dispose();
	},

	tempUser: async ({ request, playwright }, use) => {
		const user = await registerUserAPI(request);
		const { access_token } = await loginUserAPI(request, user.email, user.password);
		const authContext = await playwright.request.newContext({
			baseURL: 'http://localhost:3000',
			extraHTTPHeaders: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		await use(user);
		await deleteUser(authContext, user.id);
		await authContext.dispose();
	},

	tempAuthUserNoCleanup: async ({ request, playwright }, use) => {
		const user = await registerUserAPI(request);
		const { access_token } = await loginUserAPI(request, user.email, user.password);
		const authContext = await playwright.request.newContext({
			baseURL: 'http://localhost:3000',
			extraHTTPHeaders: {
				Authorization: `Bearer ${access_token}`,
			},
		});

		await use({ user, userAuthRequest: authContext });
		await authContext.dispose();
	},
});

export { expect } from '@playwright/test';
