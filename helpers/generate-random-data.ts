import { faker } from '@faker-js/faker';

export type RandomUserData = {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
};

export const generateRandomUserData = (): RandomUserData => {
    const firstName = faker.person.firstName().replace(/[^a-zA-Z]/g, '');
    const lastName = faker.person.lastName().replace(/[^a-zA-Z]/g, '');

    const email = faker.internet.email({ firstName: firstName, lastName: lastName });

    const birthDate = faker.date
        .birthdate({ min: 1970, max: 2005, mode: 'year' })
        .toISOString()
        .split('T')[0];

    return {
        firstName,
        lastName,
        email,
        birthDate,
    };
};
