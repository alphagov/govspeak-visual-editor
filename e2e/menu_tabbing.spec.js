import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "./helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("navigates menu items using arrow keys", async ({ page }) => {
  await page.locator('select:has-text("Paragraph")').focus();

  await page.keyboard.press("ArrowRight");
  await expect(page.getByTitle("Bullet list")).toBeFocused();

  await page.keyboard.press("ArrowRight");
  await expect(page.getByTitle("Ordered list")).toBeFocused();

  await page.keyboard.press("ArrowLeft");
  await expect(page.getByTitle("Bullet list")).toBeFocused();
});
