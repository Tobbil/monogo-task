import { Page, Locator } from "@playwright/test";
import { LocaleTestData } from "../config/locales";
import BasePage from "./BasePage";

export default class MainPage extends BasePage {
  readonly shopBtn: Locator;
  readonly acceptCookiesBtn: Locator;
  readonly confirmAgeBtn: Locator;
  readonly cartIcon: Locator;

  constructor(
    page: Page,
    locale: keyof LocaleTestData,
    testData: LocaleTestData
  ) {
    super(page, locale, testData);
    this.shopBtn = this.page.getByTestId(
      this.testData[locale].locators.testid.shopBtn
    );
    this.acceptCookiesBtn = this.page.locator("#onetrust-accept-btn-handler");
    this.confirmAgeBtn = this.page
      .locator(".ageconfirmation__actionWrapper > div")
      .first();
    this.cartIcon = this.page.getByTestId("cart");
  }
}
