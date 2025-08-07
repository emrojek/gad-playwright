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
		await registerPage.clickRegisterButton();

		await expect(page).toHaveURL('/login/');
	});

	test('should login successfully', async ({ page }) => {
		await loginPage.fillLoginForm({
			email: validUser.email,
			password: validUser.password,
		});

		await loginPage.clickFormLoginButton();

		await expect(page).toHaveURL('/welcome')
		await expect(loginPage.getWelcomeMessage()).toBeVisible()
		await expect(loginPage.getWelcomeMessage()).toContainText(`Hi ${validUser.email}`)
	});
});
