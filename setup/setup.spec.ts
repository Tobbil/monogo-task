import { test as setup, chromium } from "@playwright/test";
import MainPage from "../page-objects/MainPage";
import fs from "fs";
import { getConfigForLocale, getLocale } from "../config/localeConfig";

const locales = getLocale();

for (const locale of locales) {
  const localeConfig = getConfigForLocale(locale);
  const baseURL = localeConfig?.baseURL;
  setup.describe(() => {
    setup(`[${locale.toUpperCase()}] Accept cookies & confirm age`, async () => {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({ baseURL });
      const page = await context.newPage();
      const mainPage = new MainPage(page);
      await mainPage.goto();
      await mainPage.acceptCookiesBtn.click();
      await mainPage.confirmAgeBtn.click();
      const storageStatePath = "../storageStates";
      const storageState = await context.storageState();
      storageState.origins = [];
      if (!fs.existsSync(storageStatePath)) fs.mkdirSync(storageStatePath);
      fs.writeFileSync(
        `${storageStatePath}/baseState-${locale}.json`,
        JSON.stringify(storageState, null, "\t")
      );
    });
  });
}
