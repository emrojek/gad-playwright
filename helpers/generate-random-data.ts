import { faker } from '@faker-js/faker';

export const generateRandomEmail = (): string => faker.internet.email();

export const generateRandomName = (): string => faker.person.firstName();

export const generateRandomSurname = (): string => faker.person.lastName();

export const generateRandomDate = (): string =>
    faker.date.birthdate({ min: 1970, max: 2005, mode: 'year' }).toISOString().split('T')[0];
