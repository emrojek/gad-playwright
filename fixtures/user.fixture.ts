import { test as base } from './pages.fixture';
import { expect } from '@playwright/test';
import { generateRandomUserData } from '../helpers/generate-random-data';
import { TEST_PASSWORDS } from '../helpers/test-constants';

export type ValidUser = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

type TestFixtures = {
    validUser: ValidUser;
};

export const test = base.extend<TestFixtures>({
    validUser: async ({ page, registerPage, loginPage }, use) => {
        const { firstName, lastName, email } = generateRandomUserData();
        const userData: ValidUser = {
            firstName,
            lastName,
            email,
            password: TEST_PASSWORDS.valid,
        };
        const loginButton = loginPage.getLoginButton();

        await page.goto('/');
        await registerPage.openUserMenu();
        await registerPage.clickPageRegisterButton();
        await registerPage.fillRegistrationForm(userData);
        await registerPage.clickRegisterButton();

        await expect(loginButton).toBeVisible();

        await use(userData);
    },
});

export { expect } from '@playwright/test';
