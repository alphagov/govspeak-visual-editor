import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("link menu item disabled by default", async ({ page }) => {
  await expect(page.getByTitle("Link", { exact: true })).toBeDisabled();
});

test("link menu item enabled with selection", async ({ page }) => {
  await page
    .locator("#editor")
    .getByText("Example link", { exact: true })
    .selectText();
  await expect(page.getByTitle("Link", { exact: true })).toBeEnabled();
});

test("link menu item removes a selected link", async ({ page }) => {
  await page
    .locator("#editor")
    .getByText("Example link", { exact: true })
    .selectText();
  await page.getByTitle("Link", { exact: true }).click();
  await expect(
    page.locator("#editor").getByText("Example link", { exact: true }),
  ).not.toHaveAttribute("href");
});

test("link menu item adds a link to selected text", async ({ page }) => {
  await page
    .locator("#editor")
    .getByText("Example link", { exact: true })
    .selectText();
  await page.getByTitle("Link", { exact: true }).click();
  page.on("dialog", (dialog) => dialog.accept("example.com"));
  await page.getByTitle("Link", { exact: true }).click();
  await expect(
    page.locator("#editor").getByText("Example link", { exact: true }),
  ).toHaveAttribute("href", "example.com");
});
