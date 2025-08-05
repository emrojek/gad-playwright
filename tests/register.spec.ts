import { test, expect } from '@playwright/test';
import { createRegisterPage, RegisterPage } from '../pages/register.page';
import {
	generateRandomDate,
	generateRandomName,
	generateRandomSurname,
	generateRandomEmail,
} from '../helpers/generate-random-data';

test.describe('Registration Form', () => {
	let registerPage: RegisterPage;

	test.beforeEach(async ({ page }) => {
		await page.goto('/');

		registerPage = createRegisterPage(page);

		await registerPage.hoverPageElement();
		await registerPage.clickPageRegisterButton();
	});

	test('successful user register', async ({ page }) => {
		await registerPage.fillRegistrationForm({
			firstName: generateRandomName(),
			lastName: generateRandomSurname(),
			email: generateRandomEmail(),
			birthDate: generateRandomDate(),
			password: 'password123',
		});
		await registerPage.clickDatepickerDoneButton();
		await registerPage.clickRegisterButton();
		await expect(page).toHaveURL('/login/');
	});

	test('should show validation errors for empty required fields', async () => {
		await registerPage.clickRegisterButton();

		const errorsCount = await registerPage.getValidationErrorsCount();
		expect(errorsCount).toBeGreaterThanOrEqual(4);
	});

	test('should show error for duplicate email during registration', async ({ page }) => {
		const email = generateRandomEmail();
		const userData = {
			firstName: generateRandomName(),
			lastName: generateRandomSurname(),
			email: email,
			password: 'password123',
		};

		await registerPage.fillRegistrationForm(userData);
		await registerPage.clickRegisterButton();
		await expect(page).toHaveURL('/login/');

		await page.goto('/');
		await registerPage.hoverPageElement();
		await registerPage.clickPageRegisterButton();

		await registerPage.fillRegistrationForm(userData);
		await registerPage.clickRegisterButton();

		await expect(registerPage.getEmailError()).toBeVisible();
	});
});
