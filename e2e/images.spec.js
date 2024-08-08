import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "./helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("loads image from the index file in the editor", async ({ page }) => {
  await expect(page.locator('#content [src="/example.jpg"]')).toBeAttached();
  await expect(page.locator('#editor [src="/example.jpg"]')).toBeVisible();
});
