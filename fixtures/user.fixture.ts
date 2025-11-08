import { test as base, expect } from './pages.fixture';
import { registerUser, type UserCredentials } from '../helpers/auth-helpers';

type TestFixtures = {
	validUser: UserCredentials;
};

export const test = base.extend<TestFixtures>({
	validUser: async ({ page, registerPage, loginPage }, use) => {
		const loginButton = loginPage.getLoginButton();

		await page.goto('/');
		await registerPage.openUserMenu();
		await registerPage.clickPageRegisterButton();

		const user: UserCredentials = await registerUser(registerPage);

		await expect(loginButton).toBeVisible();

		await use(user);
	},
});

export { expect } from './pages.fixture';
