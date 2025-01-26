import { test, expect } from "./utils/fixtures";
import ProductPage from "./page-objects/ProductPage";
import Cart from "./page-objects/Cart";
import { getConfigForLocale, getLocale } from "./config/localeConfig";
import allTestData from "./task-tests-data";

const locales = getLocale();

for (const locale of locales) {
  const { localeStrings, data } = allTestData[locale];
  test.describe("Ploom tests for Monogo", () => {
    test.use(getConfigForLocale(locale));

    test(`[${locale}] Verify if it's possible to add a product to the cart`, async ({
      mainPage,
    }) => {
      const page = mainPage.page;
      const productPage = new ProductPage(page);
      const cart = new Cart(page);

      await mainPage.clickMenuItem(localeStrings.shop);
      await page.mouse.move(0, 0);
      await mainPage.getItemBySKU(page, data.itemSKU).click();
      await productPage.addToCartBtn.click();
      await expect(cart.cartIconCounter).toHaveText("1");
      await expect(cart.getNthItemName(0)).toHaveText(await productPage.getProductName());
    });

    test(`[${locale}] Verify if it's possible to remove a product from the cart`, async ({
      mainPage,
    }) => {
      const page = mainPage.page;
      const productPage = new ProductPage(page);
      const cart = new Cart(page);
      // It would be better to create a universal cart with one item via API
      await mainPage.clickMenuItem(localeStrings.shop);
      await page.mouse.move(0, 0);
      await mainPage.getItemBySKU(page, data.itemSKU).click();
      await productPage.addToCartBtn.click();
      await expect(cart.cartIconCounter).toHaveText("1");
      await expect(cart.getNthItemName(0)).toHaveText(await productPage.getProductName());
      await expect(cart.cartItems).toHaveCount(1);
      await expect(cart.cartItemCountHeader).toContainText("1");
      await cart.decreaseNthItemQuantity(0);
      await expect(cart.cartItems).toHaveCount(0);
      await expect(cart.cartItemCountHeader).toHaveText(localeStrings.emptyCart);
    });

    test(`[${locale}] Verify there are no broken links or incomplete images on the product page`, async ({
      mainPage,
      request,
    }) => {
      test.setTimeout(45000);
      const page = mainPage.page;

      const linkErrors: string[] = [];
      const incompleteImages: string[] = [];

      await mainPage.goto();
      await mainPage.clickMenuItem(localeStrings.shop);
      await page.mouse.move(0, 0);
      await mainPage.getItemBySKU(page, data.itemSKU).click();
      await page.waitForLoadState("networkidle");

      const links = await page.$$eval("a", (anchors) =>
        anchors
          .map((a) => a.href)
          .filter((href) => href && (href.startsWith("http://") || href.startsWith("https://")))
      );

      const images = await page.$$eval("img", (imgs) =>
        imgs.map((img) => ({
          src: img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
        }))
      );

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

      expect(linkErrors, "Some links are broken").toHaveLength(0);
      expect(incompleteImages, "Some images are broken").toHaveLength(0);
    });
  });
}
