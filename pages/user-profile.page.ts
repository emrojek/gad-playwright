import { Page, Locator } from '@playwright/test';

export type UserProfilePage = {
	clickMenuProfileButton: () => Promise<void>;
	clickMenuMessagesButton: () => Promise<void>;
	clickMenuLogoutButton: () => Promise<void>;
	clickPageProfileButton: () => Promise<void>;
	clickPageArticlesButton: () => Promise<void>;
	clickPageCommentsButton: () => Promise<void>;
	clickPageSurveysButton: () => Promise<void>;
	clickPageGamesButton: () => Promise<void>;
	clickPageMessengerButton: () => Promise<void>;
	clickPageDeleteAccountButton: () => Promise<void>;
	clickEditDashboard: () => Promise<void>;
	clickToggleDarkmode: () => Promise<void>;
	getUserAvatar: () => Locator;
	getSessionTimer: () => Locator;
	getPageBody: () => Locator;
	getEditDashboardButton: () => Locator;
};

export const createUserProfilePage = (page: Page): UserProfilePage => ({
	clickMenuProfileButton: async () => await page.getByRole('link', { name: 'My Account' }).click(),

	clickMenuMessagesButton: async () => await page.getByRole('link', { name: 'Message center' }).click(),

	clickMenuLogoutButton: async () => await page.getByRole('link', { name: 'Logout' }).click(),

	clickPageProfileButton: async () => await page.getByRole('button', { name: 'My profile' }).click(),

	clickPageArticlesButton: async () => await page.getByRole('button', { name: 'My articles' }).click(),

	clickPageCommentsButton: async () => await page.getByRole('button', { name: 'My comments' }).click(),

	clickPageSurveysButton: async () => await page.getByRole('button', { name: 'Surveys' }).click(),

	clickPageGamesButton: async () => await page.getByRole('button', { name: 'Games' }).click(),

	clickPageMessengerButton: async () => await page.getByRole('button', { name: 'Messenger' }).click(),

	clickPageDeleteAccountButton: async () => await page.getByRole('button', { name: 'Delete Account' }).click(),

	clickEditDashboard: async () => await page.getByRole('button', { name: 'Edit this Dashboard' }).click(),

	clickToggleDarkmode: async () => await page.getByTitle('darkmode switch').click(),

	getUserAvatar: () => page.locator('#myAvatar'),

	getSessionTimer: () => page.getByTestId('countDown'),

	getPageBody: () => page.locator('body'),

	getEditDashboardButton: () => page.getByRole('button', { name: /Edit this Dashboard|Save this Dashboard/ }),
});
