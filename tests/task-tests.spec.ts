import { test, expect } from "@playwright/test";
import MainPage from "./page-objects/MainPage";
import ProductPage from "./page-objects/ProductPage";
import Cart from "./page-objects/Cart";

test.describe("Ploom tests for Monogo", () => {
  test("Verify if it's possible to add a product to the cart", async ({
    page,
  }) => {
    const mainPage = new MainPage(page);
    const productPage = new ProductPage(page);
    const cart = new Cart(page);
    const testSKU = page.locator('[data-sku="ploom-x-advanced"]');

    await mainPage.goto();
    await mainPage.acceptCookiesBtn.click();
    await mainPage.confirmAgeBtn.click();
    await mainPage.shopBtn.hover();
    await mainPage.showAllProductsBtn.click();
    await testSKU.click();

    const productName = await productPage.getProductName();
    await productPage.addToCartBtn.click();

    const productNameInCart = await cart.getNthItemName(0);
    const cartIconCount = await cart.getCartIconCount();
    expect(cartIconCount).toBe(1);
    expect(productNameInCart).toContain(productName);
  });
});
