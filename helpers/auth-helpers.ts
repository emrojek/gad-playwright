// import type { Page } from '@playwright/test';
import type { RegisterPage } from '../pages/register.page';
import type { LoginPage } from '../pages/login.page';
import { generateRandomUserData } from './generate-random-data';
import { TEST_PASSWORDS } from './test-constants';

export type UserCredentials = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
};

export const registerUser = async (registerPage: RegisterPage): Promise<UserCredentials> => {
	const { firstName, lastName, email } = generateRandomUserData();
	const userData: UserCredentials = {
		firstName,
		lastName,
		email,
		password: TEST_PASSWORDS.valid,
	};

	await registerPage.fillRegistrationForm(userData);
	await registerPage.clickRegisterButton();

	return userData;
};

export const loginUser = async (loginPage: LoginPage, credentials: UserCredentials): Promise<void> => {
	await loginPage.fillLoginForm({ email: credentials.email, password: credentials.password });
	await loginPage.clickFormLoginButton();
};
