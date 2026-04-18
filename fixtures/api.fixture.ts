import { test as base, APIRequestContext } from '@playwright/test';
import { registerUserAPI, deleteUser, loginUserAPI, createAuthContext, type ApiUser } from '../helpers/api-helpers';
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
	authRequest: async ({ request, playwright, baseURL }, use) => {
		const authData = JSON.parse(fs.readFileSync('.auth/api-user.json', 'utf-8'));

		const { access_token } = await loginUserAPI(request, authData.userEmail, authData.userPassword);

		const authContext = await createAuthContext(playwright.request, baseURL, access_token);

		await use(authContext);
		await authContext.dispose();
	},

	tempAuthUser: async ({ request, playwright, baseURL }, use) => {
		const user = await registerUserAPI(request);
		const { access_token } = await loginUserAPI(request, user.email, user.password);
		const authContext = await createAuthContext(playwright.request, baseURL, access_token);

		await use({ user, userAuthRequest: authContext });
		await deleteUser(authContext, user.id);
		await authContext.dispose();
	},

	tempUser: async ({ request, playwright, baseURL }, use) => {
		const user = await registerUserAPI(request);
		const { access_token } = await loginUserAPI(request, user.email, user.password);
		const authContext = await createAuthContext(playwright.request, baseURL, access_token);

		await use(user);
		await deleteUser(authContext, user.id);
		await authContext.dispose();
	},

	tempAuthUserNoCleanup: async ({ request, playwright, baseURL }, use) => {
		const user = await registerUserAPI(request);
		const { access_token } = await loginUserAPI(request, user.email, user.password);
		const authContext = await createAuthContext(playwright.request, baseURL, access_token);

		await use({ user, userAuthRequest: authContext });
		await authContext.dispose();
	},
});

export { expect } from '@playwright/test';
