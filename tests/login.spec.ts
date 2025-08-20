import { test, expect } from '../fixtures/user.fixture';
import { createLoginPage, LoginPage } from '../pages/login.page';

test.describe('Login Form', () => {
	let loginPage: LoginPage;

	test.beforeEach(async ({ page }) => {
		loginPage = createLoginPage(page);
	});

	test.describe('Tests requiring valid user', () => {
		test('should login successfully', async ({ page, validUser }) => {
			const welcomeMessage = loginPage.getWelcomeMessage();

			await loginPage.fillLoginForm({
				email: validUser.email,
				password: validUser.password,
			});

			await Promise.all([loginPage.clickFormLoginButton(), page.waitForURL('/welcome')]);

			await expect(page).toHaveURL('/welcome');
			await expect(welcomeMessage).toBeVisible();
			await expect(welcomeMessage).toContainText(`Hi ${validUser.email}`);
		});
	});

	test.describe('Tests without user registration', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
			await loginPage.openUserMenu();
			await loginPage.clickPageLoginButton();
		});

		test('should show error for invalid credentials', async () => {
			const welcomeMessage = loginPage.getWelcomeMessage();
			const errorMessage = loginPage.getFormLoginError();

			await loginPage.fillLoginForm({
				email: 'invalid-email.com',
				password: 'wrongpassword',
			});
			await loginPage.clickFormLoginButton();

			await expect(errorMessage).toBeVisible();
			await expect(errorMessage).toHaveText('Invalid username or password');
			await expect(welcomeMessage).not.toBeVisible();
		});
	});
});
