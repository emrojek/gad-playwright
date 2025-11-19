import { test as setup, expect } from '../../fixtures/pages.fixture';
import { registerUser, loginUser, type UserCredentials } from '../../helpers/auth-helpers';

const authFile = '.auth/user.json';

setup('authenticate', async ({ page, loginPage, registerPage }) => {
	const loginButton = loginPage.getLoginButton();

	await page.goto('/');
	await registerPage.openUserMenu();
	await registerPage.clickPageRegisterButton();

	const user: UserCredentials = await registerUser(registerPage);

	await expect(loginButton).toBeVisible();

	await loginUser(loginPage, user);

	await expect(page).toHaveURL('/welcome');
	await page.context().storageState({ path: authFile });
});
