import type { RegisterPage } from '../pages/register.page';
import type { LoginPage } from '../pages/login.page';
import { generateRandomUserData } from './generate-random-data';
import { TEST_PASSWORDS } from './test-constants';
import { APIRequestContext } from '@playwright/test';

export type UserCredentials = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	avatar?: string;
};

// E2E
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

// API
export const registerUserAPI = async (request: APIRequestContext): Promise<UserCredentials> => {
	const { firstName, lastName, email } = generateRandomUserData();

	const response = await request.post('/api/users', {
		data: {
			email,
			firstname: firstName,
			lastname: lastName,
			password: TEST_PASSWORDS.valid,
			avatar: 'avatar.jpg',
		},
	});

	const user = await response.json();

	return {
		email: user.email,
		firstName: user.firstname,
		lastName: user.lastname,
		password: TEST_PASSWORDS.valid,
	};
};
