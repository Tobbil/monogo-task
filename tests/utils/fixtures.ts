import { test as base } from "@playwright/test";
import MainPage from "../page-objects/MainPage";

export const test = base.extend<CustomFixtures>({
  mainPage: async ({ page }, use) => {
    await page.goto("");
    await use(new MainPage(page));
  },
});

type CustomFixtures = {
  mainPage: MainPage;
};

export { expect } from "@playwright/test";
