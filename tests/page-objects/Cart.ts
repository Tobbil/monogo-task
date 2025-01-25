import { Page, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class Cart extends BasePage {
  readonly cartIcon: Locator;
  readonly cartIconCounter: Locator;
  readonly cartContainer: Locator;
  readonly cartItems: Locator;
  readonly decreaseQuantityBtn: Locator;
  readonly cartItemCountHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.cartIcon = this.page.getByTestId("cart");
    this.cartIconCounter = this.page.locator(".mini-cart__icon-label");
    this.cartContainer = this.page.locator(".mini-cart__container");
    this.cartItems = this.page.getByTestId("mini-cart-list");
    this.decreaseQuantityBtn = this.page.getByTestId("quantityMinus");
    this.cartItemCountHeader = this.page.locator(".mini-cart__header-count");
  }

  async getCartIconCount() {
    return Number(await this.cartIcon.locator(".mini-cart__icon-label").innerText());
  }

  getNthItemName(n: number) {
    return this.cartItems.locator(".ProductMiniature-module-productName-JRifI").nth(n);
  }

  async decreaseNthItemQuantity(n: number) {
    await this.decreaseQuantityBtn.nth(n).click();
  }
}
