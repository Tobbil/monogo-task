import { Page, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class MainPage extends BasePage {
  readonly acceptCookiesBtn: Locator;
  readonly confirmAgeBtn: Locator;
  readonly cartIcon: Locator;
  readonly menuItems: Locator;

  constructor(page: Page) {
    super(page);
    this.acceptCookiesBtn = this.page.locator("#onetrust-accept-btn-handler");
    this.confirmAgeBtn = this.page
      .locator(".ageconfirmation__actionWrapper > div")
      .first();
    this.cartIcon = this.page.getByTestId("cart");
    this.menuItems = this.page.locator(".navigation__item");
  }

  getMenuItem(text: string) {
    return this.menuItems.filter({ hasText: text });
  }

  async clickMenuItem(text: string) {
    return await this.getMenuItem(text).click();
  }

  async hoverOnMenuItem(text: string) {
    return await this.getMenuItem(text).hover();
  }

  getItemBySKU(page: Page, sku: string) {
    const skuLocator = page.locator(`[data-sku="${sku}"]`);
    return skuLocator;
  }
}
