import { Page, Locator } from "@playwright/test";
import { LocaleTestData } from "../config/locales";
import BasePage from "./BasePage";

export default class ProductPage extends BasePage {
  readonly page: Page;
  readonly locale: string;
  readonly addToCartBtn: Locator;
  readonly productName: Locator;

  constructor(page: Page, locale: string, testData: LocaleTestData) {
    super(page, locale, testData);
    this.page = page;
    this.locale = locale;
    this.addToCartBtn = this.page.getByTestId("pdpAddToProduct");
    this.productName = page.getByTestId("product-details").locator("h1");
  }

  async getProductName() {
    return await this.productName.innerText();
  }
}
