import { test as base } from '@playwright/test';
import { createRegisterPage } from '../pages/register.page';
import {
	generateRandomEmail,
	generateRandomName,
	generateRandomSurname,
} from '../helpers/generate-random-data';

export type ValidUser = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

type TestFixtures = {
	validUser: ValidUser;
};

export const test = base.extend<TestFixtures>({
	validUser: async ({ page }, use) => {
		const userData: ValidUser = {
			firstName: generateRandomName(),
			lastName: generateRandomSurname(),
			email: generateRandomEmail(),
			password: 'password123',
		};

		const registerPage = createRegisterPage(page);

		await page.goto('/');
		await registerPage.openUserMenu();
		await registerPage.clickPageRegisterButton();
		await registerPage.fillRegistrationForm(userData);
		await Promise.all([
			registerPage.clickRegisterButton(),
			page.waitForURL('/login/', { waitUntil: 'commit', timeout: 15000 }),
		]);

		await use(userData);
	},
});

export { expect } from '@playwright/test';
