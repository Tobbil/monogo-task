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
    await expect(cart.getNthItemName(0)).toHaveText(
      await productPage.getProductName()
    );
  });

  test("Verify if it's possible to remove a product from the cart", async ({
    firstItemInCart,
  }) => {
    const { cart } = firstItemInCart;
    await expect(cart.cartItems).toHaveCount(1);
    expect(await cart.getItemCountFromHeader()).toBe(1);
    await cart.decreaseNthItemQuantity(0);
    await expect(cart.cartItems).toHaveCount(0);
    await expect(cart.cartItemCountHeader).toHaveText(
      testData[baseURL].testData.expCartHeaderCountEmpty
    );
  });

  test("Verify no broken links or images on the product page", async ({
    page,
    request,
  }) => {
    test.setTimeout(45000);
    const mainPage = new MainPage(page);

    const linkErrors: string[] = [];
    const imageErrors: string[] = [];

    await mainPage.goto();
    await mainPage.shopBtn.click();
    await page.mouse.move(0, 0);
    const testSKU = page.locator(".aem-productTeaserComponent__link").first();
    await testSKU.click();
    await page.waitForLoadState("networkidle");

    // Get all links and images
    const links = await page.$$eval("a", (anchors) =>
      anchors
        .map((a) => a.href)
        .filter(
          (href) =>
            href && (href.startsWith("http://") || href.startsWith("https://"))
        )
    );

    const images = await page.$$eval("img", (imgs) =>
      imgs.map((img) => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
      }))
    );

    // Check links in parallel
    await Promise.all(
      links.map(async (link) => {
        try {
          const response = await request.get(link);
          if (response.status() >= 400) {
            console.log(`Broken link: ${link}`);
            linkErrors.push(link);
          } else {
            console.log(`Link OK: ${link}`);
          }
        } catch (error) {
          console.error(`Error checking link: ${link}`, error);
          linkErrors.push(link);
        }
      })
    );

    // Check images in parallel
    await Promise.all(
      images.map(async (image) => {
        try {
          if (!image.complete || image.naturalWidth === 0) {
            console.log(`Image BROKEN: ${image.src}`);
            imageErrors.push(image.src);
          } else {
            console.log(`Image OK: ${image.src}`);
          }

          const response = await request.get(image.src);
          if (response.status() >= 400) {
            console.log(`Image link BROKEN: ${image.src}`);
            linkErrors.push(image.src);
          } else {
            console.log(`Image link OK: ${image.src}`);
          }
        } catch (error) {
          console.error(`Error checking image: ${image.src}`, error);
          imageErrors.push(image.src);
        }
      })
    );

    // Assert no errors
    expect(linkErrors, "Some links are broken").toHaveLength(0);
    expect(imageErrors, "Some images are broken").toHaveLength(0);
  });
});
