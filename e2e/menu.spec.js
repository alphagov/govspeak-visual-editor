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

test("selects emits appropriate custom event", async ({ page }) => {
  const selectTextPromise = page.evaluate(() => {
    return new Promise((resolve) => {
      document.addEventListener("visualEditorSelectChange", (e) =>
        resolve(e.detail.selectText),
      );
    });
  });
  page.locator('select:has-text("Paragraph")').selectOption("Heading 2");
  const selectText = await selectTextPromise;
  await expect(selectText).toEqual("Heading 2");
});

test("buttons emits appropriate custom events", async ({ page }) => {
  const buttonTextPromise = page.evaluate(() => {
    return new Promise((resolve) => {
      document.addEventListener("visualEditorButtonClick", (e) =>
        resolve(e.detail.buttonText),
      );
    });
  });
  await page.getByTitle("Bullet list").click();
  const buttonText = await buttonTextPromise;
  await expect(buttonText).toEqual("Bullet list");
});
