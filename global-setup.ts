import { chromium, firefox, webkit, Browser } from "@playwright/test";
import { projects } from "./playwright.config";
import MainPage from "./tests/page-objects/MainPage";
import { localeTestData as testData } from "./tests/config/locales";

async function globalSetup(config) {
  // List of baseURLs and their corresponding projects

  for (const project of projects) {
    // TODO: Add checking which project is being run to only run setup on relevant url/browser configurations
    const browser: Browser = await (project.browser === "chromium"
      ? chromium
      : project.browser === "firefox"
      ? firefox
      : webkit
    ).launch();

    const context = await browser.newContext();
    const page = await context.newPage();
    const mainPage = new MainPage(page, project.name.split("-")[0], testData);
    await mainPage.goto();
    await mainPage.acceptCookiesBtn.click();
    await mainPage.confirmAgeBtn.click();
    const storageStatePath = `./storageStates/${project.name}.json`;
    await context.storageState({ path: storageStatePath });
    console.log(
      `Saved storage state for ${project.name} to ${storageStatePath}`
    );

    await browser.close();
  }
}

export default globalSetup;
