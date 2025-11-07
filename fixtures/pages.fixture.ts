import { test as base } from '@playwright/test';
import { createRegisterPage, type RegisterPage } from '../pages/register.page';
import { createLoginPage, type LoginPage } from '../pages/login.page';
import { createUserProfilePage, type UserProfilePage } from '../pages/user-profile.page';

type PageFixtures = {
	loginPage: LoginPage;
	registerPage: RegisterPage;
	userProfilePage: UserProfilePage;
};

export const test = base.extend<PageFixtures>({
	loginPage: async ({ page }, use) => {
		await use(createLoginPage(page));
	},

	registerPage: async ({ page }, use) => {
		await use(createRegisterPage(page));
	},

	userProfilePage: async ({ page }, use) => {
		await use(createUserProfilePage(page));
	},
});

export { expect } from '@playwright/test';
