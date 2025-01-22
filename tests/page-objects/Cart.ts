import { Page, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class Cart extends BasePage {
  readonly page: Page;
  readonly cartIcon: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.cartIcon = this.page.getByTestId("cart");
    this.cartItems = this.page.getByTestId("mini-cart-list");
  }

  async getCartIconCount() {
    return Number(
      await this.cartIcon.locator(".mini-cart__icon-label").innerText()
    );
  }

  async getNthItemName(n: number) {
    return await this.cartItems
      .locator(".ProductMiniature-module-productName-JRifI")
      .nth(n)
      .innerText();
  }
}
