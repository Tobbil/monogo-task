import { Page, Locator } from "@playwright/test";
import { baseURL } from "../../playwright.config";
import { testDataForMarkets as testData } from "../config/markets";
import BasePage from "./BasePage";

export default class MainPage extends BasePage {
  readonly page: Page;
  readonly shopBtn: Locator;
  readonly acceptCookiesBtn: Locator;
  readonly confirmAgeBtn: Locator;
  readonly addToCartBtn: Locator;
  readonly cartIcon: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.shopBtn = this.page.getByTestId(
      testData[baseURL].locators.testid.shopBtn
    );
    this.acceptCookiesBtn = this.page.locator("#onetrust-accept-btn-handler");
    this.confirmAgeBtn = this.page
      .locator(".ageconfirmation__actionWrapper > div")
      .first();
    this.cartIcon = this.page.getByTestId("cart");
  }
}
