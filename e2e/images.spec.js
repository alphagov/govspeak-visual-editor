import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "./helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("loads image from the index file in the editor", async ({ page }) => {
  await expect(page.locator('#content [src="/example.jpg"]')).toBeAttached();
  await expect(page.locator('#editor [src="/example.jpg"]')).toBeVisible();
});

test("parses pasted markdown", async ({ page }) => {
  await expect(page.locator('#editor [src="/example.jpg"]')).toHaveCount(1);
  await page.locator('#editor [contenteditable="true"]').focus();
  await page.keyboard.type("[Image: example.jpg]\n");
  await page.locator("#editor").getByText("[Image: example.jpg]").selectText();
  await page.keyboard.press("ControlOrMeta+X");
  await page.keyboard.press("ControlOrMeta+V");
  await expect(page.locator('#editor [src="/example.jpg"]')).toHaveCount(2);
});
