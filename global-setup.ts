import {
  chromium,
  firefox,
  webkit,
  Browser,
} from "@playwright/test";
import MainPage from "./tests/page-objects/MainPage";
import { localeTestData as testData } from "./tests/config/locales";

async function globalSetup() {
  const args = process.argv;
  const projectArgs: string[] = [];
  args.forEach((arg) => {
    // TODO: Abstrakcja do utils getCommandArgs
    if (arg.includes("--project")) {
      projectArgs.push(arg.split("=")[1]);
    }
  });
  if (projectArgs.length === 0) {
    console.warn("No project specified. Running all projects.");
    // TODO: Run for all projects
    return;
  } else {
    console.log(`Running setup for projects: ${projectArgs}`);
    for (const project of projectArgs) {
      const locale = project.split("-")[0];
      const projectBrowser = project.split("-")[1];
      const browser: Browser = await (projectBrowser === "chromium"
        ? chromium
        : projectBrowser === "firefox"
        ? firefox
        : webkit
      ).launch();

      const context = await browser.newContext();
      const page = await context.newPage();
      const mainPage = new MainPage(page, locale, testData);
      await mainPage.goto();
      await mainPage.acceptCookiesBtn.click();
      await mainPage.confirmAgeBtn.click();
      const storageStatePath = `./storageStates/${project}.json`;
      await context.storageState({ path: storageStatePath });
      console.log(`Saved storage state for ${project} to ${storageStatePath}`);

      await browser.close();
    }
  }
}

export default globalSetup;
