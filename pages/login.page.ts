import { Page, Locator } from '@playwright/test';

export type LoginCredentials = {
    email?: string;
    password?: string;
    keepSignIn?: boolean;
};

export type LoginPage = {
    openUserMenu: () => Promise<void>;
    clickPageLoginButton: () => Promise<void>;
    clickPageLogoutButton: () => Promise<void>;
    fillLoginForm: (credentials: LoginCredentials) => Promise<void>;
    clickFormLoginButton: () => Promise<void>;
    getFormLoginError: () => Locator;
    getWelcomeMessage: () => Locator;
    getLogoutButton: () => Locator;
    getLoginButton: () => Locator;
};

export const createLoginPage = (page: Page): LoginPage => ({
    openUserMenu: async () => {
        await page.getByTestId('btn-dropdown').hover();
    },

    clickPageLoginButton: async () => {
        await page.getByRole('link', { name: 'Login' }).click();
    },

    clickPageLogoutButton: async () => {
        await page.getByTestId('logoutButton').click();
    },

    fillLoginForm: async (credentials: LoginCredentials) => {
        if (credentials.email) {
            await page.getByPlaceholder('Enter User Email').fill(credentials.email);
        }

        if (credentials.password) {
            await page.getByPlaceholder('Enter Password').fill(credentials.password);
        }

        if (credentials.keepSignIn) {
            await page.getByRole('checkbox', { name: 'keep me sign in' }).check();
        }
    },

    clickFormLoginButton: async () => {
        await page.getByRole('button', { name: 'Login' }).click();
    },

    getFormLoginError: () => page.getByTestId('login-error'),

    getWelcomeMessage: () => page.getByTestId('hello'),

    getLogoutButton: () => page.getByTestId('logoutButton'),

    getLoginButton: () => page.getByRole('button', { name: 'Login' }),
});
