import { test, expect } from '../fixtures/user.fixture';
import { generateRandomUserData } from '../helpers/generate-random-data';
import { convertMonthNameToNumber, getCurrentDate, getFutureDate, getPastDate } from '../helpers/date-helpers';
import { TEST_PASSWORDS } from '../helpers/test-constants';

test.describe('Registration Form', () => {
	test.beforeEach(async ({ page, registerPage }) => {
		const registerButton = registerPage.getRegisterButton();

		await page.goto('/');
		await registerPage.openUserMenu();
		await registerPage.clickPageRegisterButton();

		await expect(registerButton).toBeVisible();
		await expect(page).toHaveURL('/register.html');
	});

	test.describe('Happy path scenarios', () => {
		test('should register successfully', async ({ page, registerPage }) => {
			const { firstName, lastName, email, birthDate } = generateRandomUserData();
			const alert = registerPage.getAlertPopup();
			const firstNameError = registerPage.getFirstNameError();
			const lastNameError = registerPage.getLastNameError();

			const userData = {
				firstName,
				lastName,
				email,
				birthDate,
				password: TEST_PASSWORDS.valid,
			};

			await registerPage.fillRegistrationForm(userData);

			await expect(firstNameError).toBeHidden();
			await expect(lastNameError).toBeHidden();

			await registerPage.clickDatepickerDoneButton();
			await registerPage.clickRegisterButton();
			await alert.waitFor({ state: 'visible' });

			await expect(alert).toBeVisible();
			await expect(alert).toHaveText('User created');
			await expect(page).toHaveURL('/login/');
		});
	});

	test.describe('Form validation', () => {
		test('should show validation errors for empty required fields', async ({ registerPage }) => {
			await registerPage.clickRegisterButton();

			const errorsCount = await registerPage.getValidationErrorsCount();
			expect(errorsCount).toBeGreaterThanOrEqual(4);
		});

		test('should show error for duplicate email during registration', async ({ page, registerPage, loginPage }) => {
			const { firstName, lastName, email } = generateRandomUserData();
			const alert = registerPage.getAlertPopup();
			const loginButton = loginPage.getLoginButton();
			const registerButton = registerPage.getRegisterButton();

			const userData = {
				firstName,
				lastName,
				email,
				password: TEST_PASSWORDS.valid,
			};

			await test.step('Register first account', async () => {
				await registerPage.fillRegistrationForm(userData);
				await registerPage.clickRegisterButton();

				await expect(loginButton).toBeVisible();
				await expect(page).toHaveURL('/login/');
			});

			await test.step('Attempt registration with duplicate email', async () => {
				await page.goto('/');
				await registerPage.openUserMenu();
				await registerPage.clickPageRegisterButton();

				await expect(registerButton).toBeVisible();
				await expect(page).toHaveURL('/register.html');

				await registerPage.fillRegistrationForm(userData);
				await registerPage.clickRegisterButton();

				await expect(alert).toBeVisible();
				await expect(alert).toHaveText('User not created! Email not unique');
			});
		});

		test('should show validation error for non-letter characters in name fields', async ({ registerPage }) => {
			const firstNameError = registerPage.getFirstNameError();
			const lastNameError = registerPage.getLastNameError();
			const userData = {
				firstName: 'John123',
				lastName: 'Doe-!@',
			};

			await registerPage.fillRegistrationForm(userData);
			await registerPage.clickRegisterButton();

			await expect(firstNameError).toBeVisible();
			await expect(firstNameError).toHaveText('Please enter only Letters!');

			await expect(lastNameError).toBeVisible();
			await expect(lastNameError).toHaveText('Please enter only letter.');
		});

		test('should show validation error for password with only whitespaces', async ({ registerPage }) => {
			const passwordError = registerPage.getPasswordError();
			const userPassword = {
				password: TEST_PASSWORDS.spaces,
			};

			await registerPage.fillRegistrationForm(userPassword);
			await registerPage.clickRegisterButton();

			await expect(passwordError).toBeVisible();
			await expect(passwordError).toHaveText('This field is required');
		});

		test('should pass a weak password, indicating no strength validation', async ({ registerPage }) => {
			const passwordInput = registerPage.getPasswordInput();
			const userPassword = {
				password: TEST_PASSWORDS.weak,
			};

			await registerPage.fillRegistrationForm(userPassword);
			await registerPage.clickRegisterButton();

			await expect(passwordInput).not.toHaveClass(/error/);
		});
	});

	test.describe('Avatar functionality', () => {
		test('should display default avatar', async ({ registerPage }) => {
			await expect(registerPage.getAvatarDisplay()).toBeVisible();

			const avatarSrc = await registerPage.getCurrentAvatarSrc();
			const selectedAvatarValue = await registerPage.getAvatarList().inputValue();

			expect(avatarSrc).not.toBe('');
			expect(selectedAvatarValue).not.toBe('');
			expect(avatarSrc).toContain(selectedAvatarValue);
		});

		test('should change avatar with different option selected', async ({ registerPage }) => {
			const firstAvatarSrc = await registerPage.getCurrentAvatarSrc();
			const avatarOptions = await registerPage.getAvatarList().locator('option').allTextContents();

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

	test.describe('Datepicker functionality', () => {
		test('should open and close the datepicker', async ({ registerPage }) => {
			const datepicker = registerPage.getDatepicker();
			await expect(datepicker).toBeHidden();

			await registerPage.clickBirthDateInput();
			await expect(datepicker).toBeVisible();

			await registerPage.clickDatepickerDoneButton();
			await expect(datepicker).toBeHidden();
		});

		test('should allow changing month and selecting a date in the datepicker', async ({ registerPage }) => {
			const setDatepickerDay = '15';
			const birthDateField = registerPage.getBirthDateInput();

			await registerPage.clickBirthDateInput();
			await registerPage.clickDatePickerNext();

			const monthName = await registerPage.getDatePickerMonth().textContent();
			const year = await registerPage.getDatePickerYear().textContent();

			if (!monthName || !year) {
				throw new Error('Could not read year or month from the datepicker.');
			}

			await registerPage.selectDayFromDatepicker(setDatepickerDay);
			await registerPage.clickDatepickerDoneButton();

			const monthNumber = convertMonthNameToNumber(monthName);
			const expectedDate = `${year}-${monthNumber}-${setDatepickerDay}`;

			await expect(birthDateField).not.toBeEmpty();
			await expect(birthDateField).toHaveValue(expectedDate);
		});

		test.describe('Known datepicker bugs', { tag: '@bug' }, () => {
			test('BUG: should display current month in datepicker', async ({ registerPage }) => {
				test.fail(); // Bug: datepicker opens with October (due to hardcoded 1995-10-10 date) instead of current month

				const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

				await registerPage.clickBirthDateInput();

				const displayedMonth = await registerPage.getDatePickerMonth().textContent();

				expect(displayedMonth).toBe(currentMonth);
			});

			test('BUG: should display current year in datepicker', async ({ registerPage }) => {
				test.fail(); // Bug: datepicker opens with 1995 (due to hardcoded 1995-10-10 date) instead of current year

				const currentYear = new Date().getFullYear().toString();

				await registerPage.clickBirthDateInput();

				const displayedYear = await registerPage.getDatePickerYear().textContent();

				expect(displayedYear).toBe(currentYear);
			});

			test('BUG: should reset future date to current date when using "Done" button in datepicker', async ({
				registerPage,
			}) => {
				test.fail(); // Bug: datepicker allows selecting future date - 'Done' button did not reset future date to current date

				const birthDateField = registerPage.getBirthDateInput();
				const currentDate = getCurrentDate();
				const futureDate = getFutureDate();

				await registerPage.clickBirthDateInput();
				await registerPage.fillRegistrationForm({ birthDate: futureDate });
				await registerPage.clickDatepickerDoneButton();

				await expect(birthDateField).not.toBeEmpty();
				await expect(birthDateField).toHaveValue(currentDate);
			});

			test('BUG: should reset future date to current date when using "Enter" key', async ({ registerPage }) => {
				test.fail(); // Bug: Enter resets to hardcoded defaultDate (1995-10-10) instead of current date

				const birthDateField = registerPage.getBirthDateInput();
				const currentDate = getCurrentDate();
				const futureDate = getFutureDate();

				await registerPage.clickBirthDateInput();
				await registerPage.fillRegistrationForm({ birthDate: futureDate });
				await birthDateField.press('Enter');

				await expect(birthDateField).not.toBeEmpty();
				await expect(birthDateField).toHaveValue(currentDate);
			});

			test('BUG: should reset very old date to current date when using "Done" button in datepicker ', async ({
				registerPage,
			}) => {
				test.fail(); // Bug: datepicker allows selecting date older than 120 years - 'Done' button did not reset past date to current date

				const birthDateField = registerPage.getBirthDateInput();
				const ancientDate = getPastDate(200);
				const currentDate = getCurrentDate();

				await registerPage.clickBirthDateInput();
				await registerPage.fillRegistrationForm({ birthDate: ancientDate });
				await registerPage.clickDatepickerDoneButton();

				await expect(birthDateField).not.toBeEmpty();
				await expect(birthDateField).toHaveValue(currentDate);
			});

			test('BUG: should reset very old date to current date when using "Enter" key', async ({ registerPage }) => {
				test.fail(); // Bug: Enter resets to hardcoded defaultDate (1995-10-10) instead of current date

				const birthDateField = registerPage.getBirthDateInput();
				const ancientDate = getPastDate(500);
				const currentDate = getCurrentDate();

				await registerPage.clickBirthDateInput();
				await registerPage.fillRegistrationForm({ birthDate: ancientDate });
				await birthDateField.press('Enter');

				await expect(birthDateField).not.toBeEmpty();
				await expect(birthDateField).toHaveValue(currentDate);
			});
		});
	});

	test.describe('Known registration bugs', { tag: '@bug' }, () => {
		test('BUG: should prevent registration with future birth date', async ({ page, registerPage, loginPage }) => {
			// Bug: Registration allowed with future birth date

			const { firstName, lastName, email } = generateRandomUserData();
			const loginButton = loginPage.getLoginButton();
			const futureDate = getFutureDate();

			await registerPage.fillRegistrationForm({
				firstName,
				lastName,
				email,
				birthDate: futureDate,
				password: TEST_PASSWORDS.valid,
			});
			await registerPage.clickDatepickerDoneButton();
			await registerPage.clickRegisterButton();

			await expect(loginButton).toBeVisible();
			await expect(page).toHaveURL('/login/');
		});

		test('BUG: should prevent registration with unrealistic past date', async ({
			page,
			registerPage,
			loginPage,
		}) => {
			// Bug: Registration allowed with unrealistic past birth date

			const { firstName, lastName, email } = generateRandomUserData();
			const loginButton = loginPage.getLoginButton();
			const ancientDate = getPastDate(500);

			await registerPage.fillRegistrationForm({
				firstName,
				lastName,
				email,
				birthDate: ancientDate,
				password: TEST_PASSWORDS.valid,
			});
			await registerPage.clickDatepickerDoneButton();
			await registerPage.clickRegisterButton();

			await expect(loginButton).toBeVisible();
			await expect(page).toHaveURL('/login/');
		});
	});
});
