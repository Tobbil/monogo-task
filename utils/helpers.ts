import { Page } from "@playwright/test";

export function getBySKU(page: Page, sku: string) {
  const skuLocator = page.locator(`[data-sku="${sku}"]`);
  return skuLocator;
}
