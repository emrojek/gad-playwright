import { test as base } from './pages.fixture';
import { expect } from '@playwright/test';
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
	validUser: async ({ page, registerPage, loginPage }, use) => {
		const userData: ValidUser = {
			firstName: generateRandomName(),
			lastName: generateRandomSurname(),
			email: generateRandomEmail(),
			password: 'password123',
		};
		const loginButton = loginPage.getLoginButton();

		await page.goto('/');
		await registerPage.openUserMenu();
		await registerPage.clickPageRegisterButton();
		await registerPage.fillRegistrationForm(userData);

		await Promise.all([
			registerPage.clickRegisterButton(),
			expect(loginButton).toBeVisible(),
		]);

		await use(userData);
	},
});

export { expect } from '@playwright/test';
