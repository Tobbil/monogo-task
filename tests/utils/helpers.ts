import MainPage from "../page-objects/MainPage";
import ProductPage from "../page-objects/ProductPage";
import { Page } from "@playwright/test";

export async function addRandomItemToCart(
  page: Page,
  mainPage: MainPage,
  productPage: ProductPage
) {
  await mainPage.goto();
  await mainPage.shopBtn.hover();
  await mainPage.showAllProductsBtn.click();
  const quantitySKU = await page.locator(".aem-productTeaserComponent__link").count()
  
  const testSKU = page.locator(".aem-productTeaserComponent__link").first();
  await testSKU.click();
}
