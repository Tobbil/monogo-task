import { Page, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class MainPage extends BasePage {
  readonly page: Page;
  readonly shopBtn: Locator;
  readonly acceptCookiesBtn: Locator;
  readonly confirmAgeBtn: Locator;
  readonly addToCartBtn: Locator;
  readonly cartIcon: Locator;
  readonly showAllProductsBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.shopBtn = this.page.getByTestId("headerItem-0");
    this.acceptCookiesBtn = this.page.locator("#onetrust-accept-btn-handler");
    this.confirmAgeBtn = this.page
      .locator(".ageconfirmation__actionWrapper > div")
      .first();
    this.cartIcon = this.page.getByTestId("cart");
    this.showAllProductsBtn = this.page
      .locator(".navigation__secondLevel")
      .getByTestId("customButton")
      .first();
  }
}
