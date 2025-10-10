import { Page, Locator } from '@playwright/test';

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
    getPasswordError: () => Locator;
    getPasswordInput: () => Locator;
    getDatepicker: () => Locator;
    clickBirthDateInput: () => Promise<void>;
    clickDatePickerNext: () => Promise<void>;
    clickDatePickerPrev: () => Promise<void>;
    selectDayFromDatepicker: (day: string) => Promise<void>;
    getDatePickerMonth: () => Locator;
    getDatePickerYear: () => Locator;
    getBirthDateInput: () => Locator;
};

export const createRegisterPage = (page: Page): RegisterPage => ({
    openUserMenu: async () => {
        await page.getByTestId('btn-dropdown').hover();
    },

    clickPageRegisterButton: async () => {
        await page.getByRole('link', { name: 'Register' }).click();
    },

    fillRegistrationForm: async (userData: RegistrationData) => {
        if (userData.firstName) {
            await page.getByTestId('firstname-input').fill(userData.firstName);
        }

        if (userData.lastName) {
            await page.getByTestId('lastname-input').fill(userData.lastName);
        }

        if (userData.email) {
            await page.getByTestId('email-input').fill(userData.email);
        }

        if (userData.birthDate) {
            await page.getByTestId('birthdate-input').fill(userData.birthDate);
        }

        if (userData.password) {
            await page.getByTestId('password-input').fill(userData.password);
        }
    },

    clickDatepickerDoneButton: async () => {
        await page.getByRole('button', { name: 'Done' }).click();
    },

    selectAvatar: async (avatarName?: string) => {
        const avatarDropdown = page.getByRole('combobox');

        if (avatarName) {
            await avatarDropdown.selectOption(avatarName);
        } else {
            const firstOption = await avatarDropdown
                .locator(`option`)
                .first()
                .getAttribute('value');
            if (firstOption) {
                await avatarDropdown.selectOption(firstOption);
            }
        }
    },

    getAvatarList: () => page.getByRole('combobox'),

    getAvatarDisplay: () => page.locator('#userPicture'),

    getCurrentAvatarSrc: async () => await page.locator('#userPicture').getAttribute('src'),

    getAlertPopup: () => page.getByTestId('alert-popup'),

    getRegisterButton: () => page.getByRole('button', { name: 'Register' }),

    clickRegisterButton: async () => {
        await page.getByRole('button', { name: 'Register' }).click();
    },

    getValidationErrorsCount: async () => await page.locator('p.octavalidate-txt-error').count(),

    getFirstNameError: () =>
        page
            .locator('div.input-field:has([data-testid="firstname-input"])')
            .locator('p.octavalidate-txt-error'),

    getLastNameError: () =>
        page
            .locator('div.input-field:has([data-testid="lastname-input"])')
            .locator('p.octavalidate-txt-error'),

    getPasswordError: () =>
        page
            .locator('div.input-field:has([data-testid="password-input"])')
            .locator('p.octavalidate-txt-error'),

    getPasswordInput: () => page.getByTestId('password-input'),

    getDatepicker: () => page.locator('#ui-datepicker-div'),

    clickBirthDateInput: async () => {
        await page.getByTestId('birthdate-input').click();
    },

    clickDatePickerNext: async () => {
        await page.getByTitle('>').click();
    },

    clickDatePickerPrev: async () => {
        await page.getByTitle('<').click();
    },

    selectDayFromDatepicker: async (day: string) => {
        await page.getByRole('link', { name: day }).click();
    },

    getDatePickerMonth: () => page.locator('span.ui-datepicker-month'),

    getDatePickerYear: () => page.locator('span.ui-datepicker-year'),

    getBirthDateInput: () => page.getByTestId('birthdate-input'),
});
