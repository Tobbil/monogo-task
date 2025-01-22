import { Page, Locator } from "@playwright/test";
import BasePage from "./BasePage";

export default class ProductPage extends BasePage {
  readonly page: Page;
  readonly addToCartBtn: Locator;
  readonly productName: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.addToCartBtn = this.page.getByTestId("pdpAddToProduct");
    this.productName = page.getByTestId("product-details").locator("h1");
  }

  async getProductName() {
    return await this.productName.innerText();
  }
}
