import { test, expect } from '../fixtures/user.fixture';
import { generateRandomUserData } from '../helpers/generate-random-data';
import { convertMonthNameToNumber } from '../helpers/date-helpers';

test.describe('Registration Form', () => {
    test.beforeEach(async ({ page, registerPage }) => {
        const registerButton = registerPage.getRegisterButton();

        await page.goto('/');
        await registerPage.openUserMenu();
        await registerPage.clickPageRegisterButton();

        await expect(registerButton).toBeVisible();
        await expect(page).toHaveURL('/register.html');
    });

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
            password: 'password123',
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

    test('should show validation errors for empty required fields', async ({ registerPage }) => {
        await registerPage.clickRegisterButton();

        const errorsCount = await registerPage.getValidationErrorsCount();
        expect(errorsCount).toBeGreaterThanOrEqual(4);
    });

    test('should show error for duplicate email during registration', async ({
        page,
        registerPage,
        loginPage,
    }) => {
        const { firstName, lastName, email } = generateRandomUserData();
        const alert = registerPage.getAlertPopup();
        const loginButton = loginPage.getLoginButton();
        const registerButton = registerPage.getRegisterButton();

        const userData = {
            firstName,
            lastName,
            email,
            password: 'password123',
        };

        await registerPage.fillRegistrationForm(userData);
        await registerPage.clickRegisterButton();

        await expect(loginButton).toBeVisible();
        await expect(page).toHaveURL('/login/');

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

    test('should show validation error for non-letter characters in name fields', async ({
        registerPage,
    }) => {
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

    test('should show validation error for password with only whitespaces', async ({
        registerPage,
    }) => {
        const passwordError = registerPage.getPasswordError();
        const userPassword = {
            password: '    ',
        };

        await registerPage.fillRegistrationForm(userPassword);
        await registerPage.clickRegisterButton();

        await expect(passwordError).toBeVisible();
        await expect(passwordError).toHaveText('This field is required');
    });

    test('should pass a weak password, indicating no strength validation', async ({
        registerPage,
    }) => {
        const passwordInput = registerPage.getPasswordInput();
        const userPassword = {
            password: '123',
        };

        await registerPage.fillRegistrationForm(userPassword);
        await registerPage.clickRegisterButton();

        await expect(passwordInput).not.toHaveClass(/error/);
    });

    test('should open and close the datepicker', async ({ registerPage }) => {
        const datepicker = registerPage.getDatepicker();
        await expect(datepicker).toBeHidden();

        await registerPage.clickBirthDateInput();
        await expect(datepicker).toBeVisible();

        await registerPage.clickDatepickerDoneButton();
        await expect(datepicker).toBeHidden();
    });

    test('should allow changing month and selecting a date in the datepicker', async ({
        registerPage,
    }) => {
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
});
