import { test as base, APIRequestContext } from '@playwright/test';
import fs from 'fs';

type ApiFixtures = {
	authRequest: APIRequestContext;
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
});

export { expect } from '@playwright/test';
