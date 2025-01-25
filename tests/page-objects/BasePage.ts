import { Page } from "@playwright/test";
import { LocaleTestData } from "../config/locales";

export default class BasePage {
  readonly page: Page;
  readonly url: string;
  readonly testData: LocaleTestData;

  constructor(page: Page, locale: keyof LocaleTestData, testData: LocaleTestData) {
    this.page = page;
    this.testData = testData;
    this.url = testData[locale].baseURL || testData["en"].baseURL;
  }

  async goto() {
    await this.page.goto(this.url);
  }
}
