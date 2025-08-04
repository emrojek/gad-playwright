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
	});

	test('successful user register', async ({ page }) => {
		await registerPage.hoverPageElement();
		await registerPage.clickPageRegisterButton();

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
});
