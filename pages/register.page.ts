import { Page, Locator } from '@playwright/test';

const PAGE_DROPDOWN_BUTTON = '[data-testid="btn-dropdown"]';
const PAGE_REGISTER_BUTTON = '[id="registerBtn"]';
const FIRSTNAME_INPUT = '[data-testid="firstname-input"]';
const LASTNAME_INPUT = '[data-testid="lastname-input"]';
const EMAIL_INPUT = '[data-testid="email-input"]';
const BIRTH_DATE_INPUT = '[data-testid="birthdate-input"]';
const DATEPICKER_DONE_BUTTON = '.ui-datepicker-close';
const PASSWORD_INPUT = '[data-testid="password-input"]';
const AVATAR_DISPLAY = '[id="userPicture"]';
const AVATAR_LIST = 'select[id="avatar"]';
const REGISTER_BUTTON = '[data-testid="register-button"]';
const ALERT_POPUP = '[data-testid="alert-popup"]';
const FIRSTNAME_INPUT_ERROR = '[id="octavalidate_firstname"]';
const LASTNAME_INPUT_ERROR = '[id="octavalidate_lastname"]';

export type RegistrationData = {
    firstName?: string;
    lastName?: string;
    email?: string;
    birthDate?: string;
    password?: string;
    avatarName?: string;
};

export type RegisterPage = {
    openUserMenu: () => Promise<void>;
    clickPageRegisterButton: () => Promise<void>;
    fillRegistrationForm: (userData: RegistrationData) => Promise<void>;
    clickDatepickerDoneButton: () => Promise<void>;
    selectAvatar: (avatarName?: string) => Promise<void>;
    getAvatarList: () => Locator;
    getAvatarDisplay: () => Locator;
    getAlertPopup: () => Locator;
    getRegisterButton: () => Locator;
    getCurrentAvatarSrc: () => Promise<string | null>;
    clickRegisterButton: () => Promise<void>;
    getValidationErrorsCount: () => Promise<number>;
    getFirstNameError: () => Locator;
    getLastNameError: () => Locator;
};

export const createRegisterPage = (page: Page): RegisterPage => ({
    openUserMenu: async () => {
        await page.hover(PAGE_DROPDOWN_BUTTON);
    },

    clickPageRegisterButton: async () => {
        await page.click(PAGE_REGISTER_BUTTON);
    },

    fillRegistrationForm: async (userData: RegistrationData) => {
        if (userData.firstName) {
            await page.fill(FIRSTNAME_INPUT, userData.firstName);
        }

        if (userData.lastName) {
            await page.fill(LASTNAME_INPUT, userData.lastName);
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
        if (avatarName) {
            await page.selectOption(AVATAR_LIST, avatarName);
        } else {
            const firstOption = await page
                .locator(`${AVATAR_LIST} option`)
                .first()
                .getAttribute('value');
            if (firstOption) {
                await page.selectOption(AVATAR_LIST, firstOption);
            }
        }
    },

    getAvatarList: () => page.locator(AVATAR_LIST),

    getAvatarDisplay: () => page.locator(AVATAR_DISPLAY),

    getCurrentAvatarSrc: async () => await page.locator(AVATAR_DISPLAY).getAttribute('src'),

    getAlertPopup: () => page.locator(ALERT_POPUP),

    getRegisterButton: () => page.locator(REGISTER_BUTTON),

    clickRegisterButton: async () => {
        await page.click(REGISTER_BUTTON);
    },

    getValidationErrorsCount: async () => {
        const errorSelector = '[id*="octavalidate_"]';
        return await page.locator(errorSelector).count();
    },

    getFirstNameError: () => page.locator(FIRSTNAME_INPUT_ERROR),

    getLastNameError: () => page.locator(LASTNAME_INPUT_ERROR),
});
