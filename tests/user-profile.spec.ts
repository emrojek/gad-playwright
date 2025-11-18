import { test, expect } from '../fixtures/pages.fixture';

test.describe('User Profile', () => {
	test.describe('Menu dropdown navigation', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/');
		});

		test('should navigate to profile page when clicking "My account" in the menu', async ({
			page,
			loginPage,
			userProfilePage,
		}) => {
			await loginPage.openUserMenu();
			await userProfilePage.clickMenuProfileButton();

			await expect(page).toHaveURL('/welcome');
		});

		test('should navigate to messenger page when clicking "Message center" in the menu', async ({
			page,
			loginPage,
			userProfilePage,
		}) => {
			await loginPage.openUserMenu();
			await userProfilePage.clickMenuMessagesButton();

			await expect(page).toHaveURL('/messenger.html');
		});

		test('should logout user when clicking "Logout" in the menu', async ({ page, loginPage, userProfilePage }) => {
			const loginButton = loginPage.getLoginButton();

			await loginPage.openUserMenu();
			await userProfilePage.clickMenuLogoutButton();

			await expect(page).toHaveURL('/login/');
			await expect(loginButton).toBeVisible();
		});
	});

	test.describe('Dashboard buttons navigation', () => {
		test.beforeEach(async ({ page, loginPage }) => {
			const welcomeMessage = loginPage.getWelcomeMessage();

			await page.goto('/welcome');

			await expect(welcomeMessage).toBeVisible();
		});

		test('should navigate to profile page when clicking "My profile" button', async ({ page, userProfilePage }) => {
			await userProfilePage.clickPageProfileButton();

			await expect(page).toHaveURL(/\/user\.html/);
		});

		test('should navigate to articles page when clicking "My articles" button', async ({
			page,
			userProfilePage,
		}) => {
			await userProfilePage.clickPageArticlesButton();

			await expect(page).toHaveURL(/\/articles\.html/);
		});

		test('should navigate to comments page when clicking "My comments" button', async ({
			page,
			userProfilePage,
		}) => {
			await userProfilePage.clickPageCommentsButton();

			await expect(page).toHaveURL(/\/comments\.html/);
		});

		test('should navigate to surveys page when clicking "Surveys" button', async ({ page, userProfilePage }) => {
			await userProfilePage.clickPageSurveysButton();

			await expect(page).toHaveURL('/surveys.html');
		});

		test('should navigate to games page when clicking "Games" button', async ({ page, userProfilePage }) => {
			await userProfilePage.clickPageGamesButton();

			await expect(page).toHaveURL('/games/games.html');
		});

		test('should navigate to messenger page when clicking "Messenger" button', async ({
			page,
			userProfilePage,
		}) => {
			await userProfilePage.clickPageMessengerButton();

			await expect(page).toHaveURL('/messenger.html');
		});

		test('should toggle darkmode when clicking "Toggle darkmode" button', async ({ page, userProfilePage }) => {
			const body = userProfilePage.getPageBody();

			await userProfilePage.clickToggleDarkmode();

			await expect(body).toHaveClass('darkmode');
			await expect(body).toHaveCSS('background-color', 'rgb(0, 0, 0)');
			await expect(page).toHaveURL('/welcome');
		});

		test('should edit the dashboard when clicking "Edit Dashboard" button', async ({ page, userProfilePage }) => {
			const editDashboardButton = userProfilePage.getEditDashboardButton();

			await editDashboardButton.click();

			await expect(editDashboardButton).toContainText('Save this Dashboard');
			await expect(page).toHaveURL('/welcome');
		});
	});
});
