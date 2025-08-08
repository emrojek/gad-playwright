import { Page, Locator } from '@playwright/test';

const PAGE_DROPDOWN_BUTTON = '[data-testid="btn-dropdown"]';
const PAGE_LOGIN_BUTTON = '[id="loginBtn"]';
const USER_EMAIL_INPUT = 'input[id="username"]';
const USER_PASSWORD_INPUT = 'input[id="password"]';
const FORM_LOGIN_BUTTON = 'input[id="loginButton"]';
const FORM_LOGIN_ERROR = '[data-testid="login-error"]';
const PAGE_WELCOME_USER = '[data-testid="hello"]';

export type LoginCredentials = {
	email?: string;
	password?: string;
};

export type LoginPage = {
	openUserMenu: () => Promise<void>;
	clickPageLoginButton: () => Promise<void>;
	fillLoginForm: (credentials: LoginCredentials) => Promise<void>;
	clickFormLoginButton: () => Promise<void>;
	getFormLoginError: () => Locator;
	getWelcomeMessage: () => Locator;
};

export const createLoginPage = (page: Page): LoginPage => ({
	openUserMenu: async () => {
		await page.hover(PAGE_DROPDOWN_BUTTON);
	},

	clickPageLoginButton: async () => {
		await page.click(PAGE_LOGIN_BUTTON);
	},

	fillLoginForm: async (credentials: LoginCredentials) => {
		const fillIfExist = async (value: string | undefined, selector: string) => {
			if (value) await page.fill(selector, value);
		};

		await fillIfExist(credentials.email, USER_EMAIL_INPUT);
		await fillIfExist(credentials.password, USER_PASSWORD_INPUT);
	},

	clickFormLoginButton: async () => {
		await page.click(FORM_LOGIN_BUTTON);
	},

	getFormLoginError: () => page.locator(FORM_LOGIN_ERROR),

	getWelcomeMessage: () => page.locator(PAGE_WELCOME_USER),
});
