import { test as base } from "@playwright/test";
import { createRegisterPage, type RegisterPage } from "../pages/register.page";
import { createLoginPage, type LoginPage } from "../pages/login.page";

type PageFixtures = {
    loginPage: LoginPage;
    registerPage: RegisterPage;
};

export const test = base.extend<PageFixtures>({
    loginPage: async ({ page }, use) => {
        await use(createLoginPage(page));
    },

    registerPage: async ({ page }, use) => {
        await use(createRegisterPage(page));
    }
})
