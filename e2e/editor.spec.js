import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "./helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test.describe("Editor Container", () => {
  test("contains the aria labels", async ({ page }) => {
    const editorDiv = page.locator(".govspeak");
    await expect(editorDiv).toBeVisible();

    await expect(editorDiv).toHaveAttribute("aria-multiline", "true");
    await expect(editorDiv).toHaveAttribute("role", "textbox");
  });
});
