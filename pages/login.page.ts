import { Page, Locator } from '@playwright/test';

const PAGE_DROPDOWN_BUTTON = '[data-testid="btn-dropdown"]';
const PAGE_LOGIN_BUTTON = '[id="loginBtn"]';
const USER_EMAIL_INPUT = 'input[id="username"]';
const USER_PASSWORD_INPUT = 'input[id="password"]';
const FORM_LOGIN_BUTTON = 'input[id="loginButton"]';
const FORM_LOGIN_ERROR = '[data-testid="login-error"]';
const FORM_KEEP_SIGN_IN_CHECKBOX = 'input[id="keepSignIn"]';
const PAGE_WELCOME_USER = '[data-testid="hello"]';
const PAGE_LOGOUT_BUTTON = '[data-testid="logoutButton"]';

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
        await page.hover(PAGE_DROPDOWN_BUTTON);
    },

    clickPageLoginButton: async () => {
        await page.click(PAGE_LOGIN_BUTTON);
    },

    clickPageLogoutButton: async () => {
        await page.click(PAGE_LOGOUT_BUTTON);
    },

    fillLoginForm: async (credentials: LoginCredentials) => {
        if (credentials.email) {
            await page.fill(USER_EMAIL_INPUT, credentials.email)
        }

        if (credentials.password) {
            await page.fill(USER_PASSWORD_INPUT, credentials.password)
        }

        if (credentials.keepSignIn) {
            await page.locator(FORM_KEEP_SIGN_IN_CHECKBOX).check();
        }
    },

    clickFormLoginButton: async () => {
        await page.click(FORM_LOGIN_BUTTON);
    },

    getFormLoginError: () => page.locator(FORM_LOGIN_ERROR),

    getWelcomeMessage: () => page.locator(PAGE_WELCOME_USER),

    getLogoutButton: () => page.locator(PAGE_LOGOUT_BUTTON),

    getLoginButton: () => page.locator(FORM_LOGIN_BUTTON),
});
