import { Page, Locator } from "@playwright/test";
import { LocaleTestData } from "../config/locales";
import BasePage from "./BasePage";

export default class Cart extends BasePage {
  readonly page: Page;
  readonly locale: string;
  readonly cartIcon: Locator;
  readonly cartContainer: Locator;
  readonly cartItems: Locator;
  readonly decreaseQuantityBtn: Locator;
  readonly cartItemCountHeader: Locator;

  constructor(page: Page, locale: string, testData: LocaleTestData) {
    super(page, locale, testData);
    this.page = page;
    this.locale = locale;
    this.cartIcon = this.page.getByTestId("cart");
    this.cartContainer = this.page.locator(".mini-cart__container");
    this.cartItems = this.page.getByTestId("mini-cart-list");
    this.decreaseQuantityBtn = this.page.getByTestId("quantityMinus");
    this.cartItemCountHeader = this.page.locator(".mini-cart__header-count");
  }

  async getCartIconCount() {
    return Number(
      await this.cartIcon.locator(".mini-cart__icon-label").innerText()
    );
  }

  getNthItemName(n: number) {
    return this.cartItems
      .locator(".ProductMiniature-module-productName-JRifI")
      .nth(n);
  }

  async getItemCountFromHeader() {
    const itemCountString = await this.cartItemCountHeader.innerText();
    return Number(itemCountString.split(" ")[0]);
  }

  async decreaseNthItemQuantity(n: number) {
    await this.decreaseQuantityBtn.nth(n).click();
  }
}
