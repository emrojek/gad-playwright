import { faker } from '@faker-js/faker';

export type RandomUserData = {
	firstName: string;
	lastName: string;
	email: string;
	birthDate?: string;
	avatar?: string;
};

export type RandomArticleData = {
	title: string;
	body: string;
	date: string;
	image: string;
};

export const generateRandomUserData = (): RandomUserData => {
	const firstName = faker.person.firstName().replace(/[^a-zA-Z]/g, '');
	const lastName = faker.person.lastName().replace(/[^a-zA-Z]/g, '');

	const email = faker.internet.email({ firstName: firstName, lastName: lastName });

	const birthDate =
		faker.date.birthdate({ min: 1970, max: 2005, mode: 'year' }).toISOString().split('T')[0] ?? '1990-01-01';

	const avatar = faker.image.avatar();

	return {
		firstName,
		lastName,
		email,
		birthDate,
		avatar,
	};
};

export const generateRandomArticleData = (): RandomArticleData => {
	const title = faker.book.title();
	const body = faker.lorem.paragraph({ min: 1, max: 3 });
	const date = faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2025-01-01T00:00:00.000Z' }).toISOString();
	const image = faker.image.url();

	return {
		title,
		body,
		date,
		image,
	};
};
