import { test, expect } from '@playwright/test';
import { createLoginPage, LoginPage } from '../pages/login.page';
import { createRegisterPage, RegisterPage } from '../pages/register.page';
import {
	generateRandomEmail,
	generateRandomName,
	generateRandomSurname,
} from '../helpers/generate-random-data';

test.describe('Login Form', () => {
	let loginPage: LoginPage;
	let registerPage: RegisterPage;
	let validUser: {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
	};

	test.beforeEach(async ({ page }) => {
		validUser = {
			firstName: generateRandomName(),
			lastName: generateRandomSurname(),
			email: generateRandomEmail(),
			password: 'password123',
		};

		registerPage = createRegisterPage(page);
		loginPage = createLoginPage(page);

		await page.goto('/');
		await registerPage.openUserMenu();
		await registerPage.clickPageRegisterButton();
		await registerPage.fillRegistrationForm(validUser);
		await Promise.all([
			registerPage.clickRegisterButton(),
			page.waitForURL('/login/', { waitUntil: 'commit', timeout: 15000 }),
		]);

		await expect(page).toHaveURL('/login/');
	});

	test('should login successfully', async ({ page }) => {
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
