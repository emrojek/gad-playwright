import { test, expect } from '../fixtures/user.fixture';
import * as fs from 'fs';

test.describe('Login Form', () => {
    test.describe('Tests requiring valid user', () => {
        test('should login successfully', async ({ page, validUser, loginPage }) => {
            const welcomeMessage = loginPage.getWelcomeMessage();
            const logoutButton = loginPage.getLogoutButton();

            await loginPage.fillLoginForm({
                email: validUser.email,
                password: validUser.password,
            });

            await Promise.all([
                loginPage.clickFormLoginButton(),
                expect(logoutButton).toBeVisible(),
            ]);

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

            await Promise.all([
                loginPage.clickFormLoginButton(),
                expect(logoutButton).toBeVisible(),
            ]);

            await Promise.all([
                loginPage.clickPageLogoutButton(),
                expect(loginButton).toBeVisible(),
            ]);

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
            const storageStatePath = 'playwright/.auth/user-session.json';

            try {
                await loginPage.fillLoginForm({
                    email: validUser.email,
                    password: validUser.password,
                    keepSignIn: true,
                });

                await Promise.all([
                    loginPage.clickFormLoginButton(),
                    expect(logoutButton).toBeVisible(),
                ]);

                await page.context().storageState({ path: storageStatePath });
                expect(fs.existsSync(storageStatePath)).toBeTruthy();

                const newContext = await browser.newContext({ storageState: storageStatePath });
                const newPage = await newContext.newPage();
                await newPage.goto('/');

                const newDropdownMenu = newPage.locator('[data-testid="btn-dropdown"]');
                const newPageLogoutButton = newPage.locator('[id="logoutBtn"]');
                const newUserWelcome = newPage.locator('[id="username"]');

                await newDropdownMenu.hover();
                await expect(newPageLogoutButton).toBeVisible();
                await expect(newUserWelcome).toContainText(`Hello ${validUser.firstName}`);
            } finally {
                if (fs.existsSync(storageStatePath)) {
                    fs.unlinkSync(storageStatePath);
                }
            }
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
    });
});
