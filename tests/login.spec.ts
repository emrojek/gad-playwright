import { test, expect } from '../fixtures/user.fixture';

test.describe('Login Form', () => {
	test.describe('Tests requiring valid user', () => {
		test('should login successfully', async ({ page, validUser, loginPage }) => {
			const welcomeMessage = loginPage.getWelcomeMessage();
			const logoutButton = loginPage.getLogoutButton();

			await loginPage.fillLoginForm({
				email: validUser.email,
				password: validUser.password,
			});

			await loginPage.clickFormLoginButton();
			await expect(logoutButton).toBeVisible();

			await expect(page).toHaveURL('/welcome');
			await expect(welcomeMessage).toBeVisible();
			await expect(welcomeMessage).toContainText(`Hi ${validUser.email}`);
		});

		test('should logout successfully', async ({ page, validUser, loginPage }) => {
			const welcomeMessage = loginPage.getWelcomeMessage();
			const loginButton = loginPage.getLoginButton();
			const logoutButton = loginPage.getLogoutButton();

			await loginPage.fillLoginForm({
				email: validUser.email,
				password: validUser.password,
			});

			await loginPage.clickFormLoginButton();
			await expect(logoutButton).toBeVisible();

			await loginPage.clickPageLogoutButton();
			await expect(loginButton).toBeVisible();

			await expect(page).toHaveURL('/login/');
			await expect(welcomeMessage).not.toBeVisible();
		});

		test('should keep user signed in when "keep me signed in" is checked', async ({
			page,
			browser,
			validUser,
			loginPage,
		}) => {
			const logoutButton = loginPage.getLogoutButton();

			await loginPage.fillLoginForm({
				email: validUser.email,
				password: validUser.password,
				keepSignIn: true,
			});

			await loginPage.clickFormLoginButton();
			await expect(logoutButton).toBeVisible();

			const storageState = await page.context().storageState();

			const newContext = await browser.newContext({ storageState: storageState });
			const newPage = await newContext.newPage();
			await newPage.goto('/');

			const newDropdownMenu = newPage.getByTestId('btn-dropdown');
			const newPageLogoutButton = newPage.getByRole('link', { name: 'Logout' });
			const newUserWelcome = newPage.getByText(`Hello ${validUser.firstName}`);

			await newDropdownMenu.hover();
			await expect(newPageLogoutButton).toBeVisible();
			await expect(newUserWelcome).toContainText(`Hello ${validUser.firstName}`);
		});
	});

	test.describe('Tests without user registration', () => {
		test.beforeEach(async ({ page, loginPage }) => {
			await page.goto('/');
			await loginPage.openUserMenu();
			await loginPage.clickPageLoginButton();
		});

		test('should show error for invalid credentials', async ({ loginPage }) => {
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

		test('should show validation error for empty fields', async ({ loginPage }) => {
			const errorMessage = loginPage.getFormLoginError();

			await loginPage.clickFormLoginButton();

			await expect(errorMessage).toBeVisible();
			await expect(errorMessage).toHaveText('Invalid username or password');
		});

		test('should redirect user to registration page via header link', async ({ page, loginPage, registerPage }) => {
			const registerButton = registerPage.getRegisterButton();

			await loginPage.clickHeaderRegisterButton();

			await expect(page).toHaveURL('/register.html');
			await expect(registerButton).toBeVisible();
		});
	});
});
