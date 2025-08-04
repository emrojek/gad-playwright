import { Page, Locator } from '@playwright/test';

const PAGE_DROPDOWN_BUTTON = '[data-testid="btn-dropdown"]';
const PAGE_REGISTER_BUTTON = '[id="registerBtn"]';
const FIRST_NAME_INPUT = '[data-testid="firstname-input"]';
const LAST_NAME_INPUT = '[data-testid="lastname-input"]';
const EMAIL_INPUT = '[data-testid="email-input"]';
const BIRTH_DATE_INPUT = '[data-testid="birthdate-input"]';
const DATEPICKER_DONE_BUTTON = '.ui-datepicker-close';
const PASSWORD_INPUT = '[data-testid="password-input"]';
const AVATAR_DISPLAY = '[id="userPicture"]';
const AVATAR_LIST = '[id="avatar"]';
const REGISTER_BUTTON = '[data-testid="register-button"]';

export type RegistrationData = {
	firstName?: string;
	lastName?: string;
	email?: string;
	birthDate?: string;
	password?: string;
	avatarName?: string;
};

export type RegisterPage = {
	hoverPageElement: () => Promise<void>;
	clickPageRegisterButton: () => Promise<void>;
	fillRegistrationForm(userData: RegistrationData): Promise<void>;
	clickDatepickerDoneButton: () => Promise<void>;
	selectAvatar(avatarName?: string): Promise<void>;
	getAvatarList: () => Locator;
	getAvatarDisplay: () => Locator;
	getCurrentAvatarSrc: () => Promise<string | null>;
	clickRegisterButton: () => Promise<void>;
};

export const createRegisterPage = (page: Page): RegisterPage => ({
	hoverPageElement: async () => {
		await page.hover(PAGE_DROPDOWN_BUTTON);
	},

	clickPageRegisterButton: async () => {
		await page.click(PAGE_REGISTER_BUTTON);
	},

	fillRegistrationForm: async (userData: RegistrationData) => {
		if (userData.firstName) {
			await page.fill(FIRST_NAME_INPUT, userData.firstName);
		}
		if (userData.lastName) {
			await page.fill(LAST_NAME_INPUT, userData.lastName);
		}
		if (userData.email) {
			await page.fill(EMAIL_INPUT, userData.email);
		}
		if (userData.birthDate) {
			await page.fill(BIRTH_DATE_INPUT, userData.birthDate);
		}
		if (userData.password) {
			await page.fill(PASSWORD_INPUT, userData.password);
		}
	},

	clickDatepickerDoneButton: async () => {
		await page.click(DATEPICKER_DONE_BUTTON);
	},

	selectAvatar: async (avatarName?: string) => {
		await page.click(AVATAR_LIST);

		if (avatarName) {
			await page.locator(`${AVATAR_LIST} option[value="${avatarName}"]`).click();
		} else {
			await page.locator(`${AVATAR_LIST} option`).first().click();
		}
	},

	getAvatarList: () => page.locator(AVATAR_LIST),

	getAvatarDisplay: () => page.locator(AVATAR_DISPLAY),

	getCurrentAvatarSrc: async () => {
		return await page.locator(AVATAR_DISPLAY).getAttribute('src');
	},

	clickRegisterButton: async () => {
		await page.click(REGISTER_BUTTON);
	},
});
