import { test as base, expect } from "@playwright/test";
import { baseURL } from "../../playwright.config";
import { testDataForMarkets as testData } from "../config/markets";
import MainPage from "../page-objects/MainPage";
import ProductPage from "../page-objects/ProductPage";
import Cart from "../page-objects/Cart";

export const test = base.extend({
  firstItemInCart: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    const productPage = new ProductPage(page);
    const cart = new Cart(page);

    await mainPage.goto();
    await mainPage.shopBtn.click();
    await page.mouse.move(0, 0);
    const testSKU = page.locator(".aem-productTeaserComponent__link").first();
    await testSKU.click();
    await productPage.addToCartBtn.click();
    await expect(cart.cartContainer).toBeVisible();

    use({ mainPage, productPage, cart });
  },
});

export { expect } from "@playwright/test";
