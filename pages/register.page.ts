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
const EMAIL_ERROR = '[data-testid="alert-popup"]';

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
	fillRegistrationForm: (userData: RegistrationData) => Promise<void>;
	clickDatepickerDoneButton: () => Promise<void>;
	selectAvatar: (avatarName?: string) => Promise<void>;
	getAvatarList: () => Locator;
	getAvatarDisplay: () => Locator;
	getEmailError: () => Locator;
	getCurrentAvatarSrc: () => Promise<string | null>;
	clickRegisterButton: () => Promise<void>;
	getValidationErrorsCount: () => Promise<number>;
};

export const createRegisterPage = (page: Page): RegisterPage => ({
	hoverPageElement: async () => {
		await page.hover(PAGE_DROPDOWN_BUTTON);
	},

	clickPageRegisterButton: async () => {
		await page.click(PAGE_REGISTER_BUTTON);
	},

	fillRegistrationForm: async (userData: RegistrationData) => {
		const fillIfExist = async (value: string | undefined, selector: string) => {
			if (value) await page.fill(selector, value);
		};

		await fillIfExist(userData.firstName, FIRST_NAME_INPUT);
		await fillIfExist(userData.lastName, LAST_NAME_INPUT);
		await fillIfExist(userData.email, EMAIL_INPUT);
		await fillIfExist(userData.birthDate, BIRTH_DATE_INPUT);
		await fillIfExist(userData.password, PASSWORD_INPUT);
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

	getEmailError: () => page.locator(EMAIL_ERROR),

	getCurrentAvatarSrc: async () => await page.locator(AVATAR_DISPLAY).getAttribute('src'),

	clickRegisterButton: async () => {
		await page.click(REGISTER_BUTTON);
	},

	getValidationErrorsCount: async () => {
		const errorSelector = '[id*="octavalidate_"]';
		return await page.locator(errorSelector).count();
	},
});
