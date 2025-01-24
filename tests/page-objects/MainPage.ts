import { Page, Locator } from "@playwright/test";
import { LocaleTestData } from "../config/locales";
import BasePage from "./BasePage";

export default class MainPage extends BasePage {
  readonly page: Page;
  readonly locale: string;
  readonly shopBtn: Locator;
  readonly acceptCookiesBtn: Locator;
  readonly confirmAgeBtn: Locator;
  readonly addToCartBtn: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page, locale: string, testData: LocaleTestData) {
    super(page, locale, testData);
    this.page = page;
    this.locale = locale;
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
