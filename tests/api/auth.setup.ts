import { test as setup } from '@playwright/test';
import { registerUserAPI, type ApiUser } from '../../helpers/api-helpers';
import fs from 'fs';

const authFolder = '.auth';
const authFile = `${authFolder}/api-user.json`;

setup('create test user for API', async ({ request }) => {
	const user: ApiUser = await registerUserAPI(request);

	fs.mkdirSync(authFolder, { recursive: true });
	fs.writeFileSync(authFile, JSON.stringify({ userEmail: user.email, userPassword: user.password }, null, 4));
});
