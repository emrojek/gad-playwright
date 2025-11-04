import { test as setup, expect } from '../fixtures/pages.fixture';
import { generateRandomUserData } from '../helpers/generate-random-data';
import { TEST_PASSWORDS } from '../helpers/test-constants';

const authFile = '.auth/user.json';

setup('authenticate', async ({ page, loginPage, registerPage }) => {
	const loginButton = loginPage.getLoginButton();
	const { firstName, lastName, email } = generateRandomUserData();
	const userData = {
		firstName,
		lastName,
		email,
		password: TEST_PASSWORDS.valid,
	};

	await page.goto('/');
	await registerPage.openUserMenu();
	await registerPage.clickPageRegisterButton();
	await registerPage.fillRegistrationForm(userData);
	await registerPage.clickRegisterButton();

	await expect(loginButton).toBeVisible();

	await loginPage.fillLoginForm({ email: userData.email, password: userData.password });
	await loginPage.clickFormLoginButton();

	await expect(page).toHaveURL('/welcome');

	await page.context().storageState({ path: authFile });
});
