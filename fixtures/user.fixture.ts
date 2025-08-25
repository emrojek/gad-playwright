import { test as base } from './pages.fixture';
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
	validUser: async ({ page, registerPage }, use) => {
		const userData: ValidUser = {
			firstName: generateRandomName(),
			lastName: generateRandomSurname(),
			email: generateRandomEmail(),
			password: 'password123',
		};

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
