import { test, expect } from '../fixtures/user.fixture';
import {
    generateRandomDate,
    generateRandomName,
    generateRandomSurname,
    generateRandomEmail,
} from '../helpers/generate-random-data';

test.describe('Registration Form', () => {
    test.beforeEach(async ({ page, registerPage }) => {
        const registerButton = registerPage.getRegisterButton();

        await page.goto('/');
        await registerPage.openUserMenu();
        await Promise.all([
            registerPage.clickPageRegisterButton(),
            expect(registerButton).toBeVisible(),
        ]);

        await expect(page).toHaveURL('/register.html');
    });

    test('should register successfully', async ({ page, registerPage }) => {
        const alert = registerPage.getAlertPopup();
        const userData = {
            firstName: generateRandomName(),
            lastName: generateRandomSurname(),
            email: generateRandomEmail(),
            birthDate: generateRandomDate(),
            password: 'password123',
        };

        await registerPage.fillRegistrationForm(userData);
        await registerPage.clickDatepickerDoneButton();
        await Promise.all([
            registerPage.clickRegisterButton(),
            alert.waitFor({ state: 'visible' }),
        ]);

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
        const alert = registerPage.getAlertPopup();
        const loginButton = loginPage.getLoginButton();
        const registerButton = registerPage.getRegisterButton();
        const userData = {
            firstName: generateRandomName(),
            lastName: generateRandomSurname(),
            email: generateRandomEmail(),
            password: 'password123',
        };

        await registerPage.fillRegistrationForm(userData);
        await Promise.all([registerPage.clickRegisterButton(), expect(loginButton).toBeVisible()]);
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
});
