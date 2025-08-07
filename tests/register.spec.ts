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

		await registerPage.openUserMenu();
		await registerPage.clickPageRegisterButton();
	});

	test('should register successfully', async ({ page }) => {
		const userData = {
			firstName: generateRandomName(),
			lastName: generateRandomSurname(),
			email: generateRandomEmail(),
			birthDate: generateRandomDate(),
			password: 'password123',
		};

		await registerPage.fillRegistrationForm(userData);
		await registerPage.clickDatepickerDoneButton();
		await registerPage.clickRegisterButton();

		await expect(registerPage.getAlertPopup()).toBeVisible();
		await expect(registerPage.getAlertPopup()).toContainText('User created');
		await expect(page).toHaveURL('/login/');
	});

	test('should show validation errors for empty required fields', async () => {
		await registerPage.clickRegisterButton();

		const errorsCount = await registerPage.getValidationErrorsCount();
		expect(errorsCount).toBeGreaterThanOrEqual(4);
	});

	test('should show error for duplicate email during registration', async ({ page }) => {
		const userData = {
			firstName: generateRandomName(),
			lastName: generateRandomSurname(),
			email: generateRandomEmail(),
			password: 'password123',
		};

		await registerPage.fillRegistrationForm(userData);
		await registerPage.clickRegisterButton();
		await expect(page).toHaveURL('/login/');

		await page.goto('/');
		await registerPage.openUserMenu();
		await registerPage.clickPageRegisterButton();

		await registerPage.fillRegistrationForm(userData);
		await registerPage.clickRegisterButton();

		await expect(registerPage.getAlertPopup()).toBeVisible();
		await expect(registerPage.getAlertPopup()).toContainText(
			'User not created! Email not unique'
		);
	});

	test('should display default avatar', async () => {
		await expect(registerPage.getAvatarDisplay()).toBeVisible();

		const avatarSrc = await registerPage.getCurrentAvatarSrc();
		const selectedAvatarValue = await registerPage.getAvatarList().inputValue();

		expect(avatarSrc).not.toBe('');
		expect(selectedAvatarValue).not.toBe('');
		expect(avatarSrc).toContain(selectedAvatarValue);
	});

	test('should change avatar with different option selected', async () => {
		const firstAvatarSrc = await registerPage.getCurrentAvatarSrc();
		const avatarOptions = await registerPage
			.getAvatarList()
			.locator('option')
			.allTextContents();

		if (avatarOptions.length > 1) {
			const secondAvatarSrc = await registerPage
				.getAvatarList()
				.locator('option')
				.nth(1)
				.getAttribute('value');

			await registerPage.selectAvatar(secondAvatarSrc!);

			const updatedAvatarSrc = await registerPage.getCurrentAvatarSrc();

			expect(updatedAvatarSrc).not.toBe(firstAvatarSrc);
		}
	});
});
