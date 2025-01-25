import { test, expect } from "./utils/fixtures";
import { getBySKU } from "./utils/helpers";
import { localeTestData as testData } from "./config/locales";
import MainPage from "./page-objects/MainPage";
import ProductPage from "./page-objects/ProductPage";
import Cart from "./page-objects/Cart";

test.describe("Ploom tests for Monogo", () => {
  let locale: string;

  test.beforeAll(async ({}, testInfo) => {
    locale = testInfo.project.name.split("-")[0] || "en";
  });

  test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page, locale, testData);
    await mainPage.goto();
  });

  test(`Verify if it's possible to add a product to the cart`, async ({
    page,
  }) => {
    const mainPage = new MainPage(page, locale, testData);
    const productPage = new ProductPage(page, locale, testData);
    const cart = new Cart(page, locale, testData);

    await mainPage.shopBtn.click();
    await page.mouse.move(0, 0);
    await getBySKU(page, testData[locale].locators.testid.testSKU).click();
    await productPage.addToCartBtn.click();
    const cartIconCount = await cart.getCartIconCount();
    expect(cartIconCount).toBe(1);
    await expect(cart.getNthItemName(0)).toHaveText(
      await productPage.getProductName()
    );
  });

  test(`Verify if it's possible to remove a product from the cart`, async ({
    itemInCart,
  }) => {
    const { cart } = itemInCart;
    await expect(cart.cartItems).toHaveCount(1);
    expect(await cart.getItemCountFromHeader()).toBe(1);
    await cart.decreaseNthItemQuantity(0);
    await expect(cart.cartItems).toHaveCount(0);
    await expect(cart.cartItemCountHeader).toHaveText(
      testData[locale].testData.expCartHeaderCountEmpty
    );
  });

  test(`Verify there are no broken links or incomplete images on the product page`, async ({
    page,
    request,
  }) => {
    test.setTimeout(45000);
    const mainPage = new MainPage(page, locale, testData);

    const linkErrors: string[] = [];
    const incompleteImages: string[] = [];

    await mainPage.goto();
    await mainPage.shopBtn.click();
    await page.mouse.move(0, 0);
    await getBySKU(page, testData[locale].locators.testid.testSKU).click();
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
            incompleteImages.push(image.src);
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
          incompleteImages.push(image.src);
        }
      })
    );

    // Assert no errors
    expect(linkErrors, "Some links are broken").toHaveLength(0);
    expect(incompleteImages, "Some images are broken").toHaveLength(0);
  });
});
