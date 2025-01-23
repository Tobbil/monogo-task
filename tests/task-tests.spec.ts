import { test, expect } from "./utils/fixtures";
import { baseURL } from "../playwright.config";
import { testDataForMarkets as testData } from "./config/markets";
import MainPage from "./page-objects/MainPage";
import ProductPage from "./page-objects/ProductPage";
import Cart from "./page-objects/Cart";

test.describe("Ploom tests for Monogo", () => {
  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.goto();
    await mainPage.acceptCookiesBtn.click();
    await mainPage.confirmAgeBtn.click();
  });

  test("Verify if it's possible to add a product to the cart", async ({
    page,
  }) => {
    const mainPage = new MainPage(page);
    const productPage = new ProductPage(page);
    const cart = new Cart(page);

    await mainPage.shopBtn.click();
    await page.mouse.move(0, 0);
    const testSKU = page.locator(".aem-productTeaserComponent__link").first();
    await testSKU.click();

    const productName = await productPage.getProductName();
    await productPage.addToCartBtn.click();

    const productNameInCart = await cart.getNthItemName(0);
    const cartIconCount = await cart.getCartIconCount();
    expect(cartIconCount).toBe(1);
    expect(productNameInCart).toContain(productName);
    await page.pause();
  });

  test("Verify if it's possible to remove a product from the cart", async ({
    page,
    firstItemInCart,
  }) => {
    const [, , cart] = firstItemInCart;
    await expect(cart.cartItems).toHaveCount(1);
    expect(await cart.getItemCountFromHeader()).toBe("1");
    await cart.decreaseNthItemQuantity(0);
    await expect(cart.cartItems).toHaveCount(0);
    await expect(cart.cartItemCountHeader).toHaveText(
      testData[baseURL].testData.expCartHeaderCountEmpty
    );
    await page.pause();
  });
});
