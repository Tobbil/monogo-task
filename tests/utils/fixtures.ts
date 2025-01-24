import { test as base, expect } from "@playwright/test";
import { localeTestData as testData } from "../config/locales";
import { getBySKU } from "./helpers";
import MainPage from "../page-objects/MainPage";
import ProductPage from "../page-objects/ProductPage";
import Cart from "../page-objects/Cart";

export const test = base.extend({
  itemInCart: async ({ page }, use, testInfo) => {
    const locale: string = testInfo.project.name.split("-")[0] || "en";
    const mainPage = new MainPage(page, locale, testData);
    const productPage = new ProductPage(page, locale, testData);
    const cart = new Cart(page, locale, testData);

    await mainPage.goto();
    await mainPage.shopBtn.click();
    await page.mouse.move(0, 0);
    await getBySKU(page, testData[locale].locators.testid.testSKU).click();
    await productPage.addToCartBtn.click();
    await expect(cart.cartContainer).toBeVisible();

    use({ mainPage, productPage, cart });
  },
});

export { expect } from "@playwright/test";
