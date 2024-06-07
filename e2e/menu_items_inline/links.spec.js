import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test.describe("Link", () => {
  test("link menu item enabled by default", async ({ page }) => {
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

  test("link menu item inserts a link when text is not selected", async ({
    page,
  }) => {
    page.on("dialog", (dialog) => dialog.accept("example.com"));
    await page.getByTitle("Link", { exact: true }).click();
    await expect(
      page.locator("#editor").getByText("example.com", { exact: true }),
    ).toHaveAttribute("href", "example.com");
  });

  test("A tooltip is displayed with the URL of a link", async ({ page }) => {
    await expect(
      page.locator(".tooltip").getByText("example.com", { exact: true }),
    ).not.toBeVisible();
    await page
      .locator("#editor")
      .getByText("Example link", { exact: true })
      .click();
    await expect(
      page.locator(".tooltip").getByText("example.com", { exact: true }),
    ).toBeVisible();
  });
});

test.describe("Email link", () => {
  test("email link menu item enabled by default", async ({ page }) => {
    await expect(page.getByTitle("Email link", { exact: true })).toBeEnabled();
  });

  test("email link menu item prompts the user for an email that it links to", async ({
    page,
  }) => {
    page.on("dialog", (dialog) => dialog.accept("contact@example.com"));
    await page.getByTitle("Email link", { exact: true }).click();
    await expect(
      page.locator("#editor").getByText("contact@example.com", { exact: true }),
    ).toHaveAttribute("href", "mailto:contact@example.com");
  });

  test("email link menu item adds a email link to selected text", async ({
    page,
  }) => {
    await page
      .locator("#editor")
      .getByText("Example link", { exact: true })
      .selectText();
    await page.getByTitle("Email link", { exact: true }).click();
    page.on("dialog", (dialog) => dialog.accept("someone@example.com"));
    await page.getByTitle("Email link", { exact: true }).click();
    await expect(
      page.locator("#editor").getByText("Example link", { exact: true }),
    ).toHaveAttribute("href", "mailto:someone@example.com");
  });

  test("email link menu item removes a selected email link", async ({
    page,
  }) => {
    await page
      .locator("#editor")
      .getByText("someone@example.com", { exact: true })
      .selectText();
    await page.getByTitle("Email link", { exact: true }).click();
    await expect(
      page.locator("#editor").getByText("someone@example.com", { exact: true }),
    ).not.toHaveAttribute("href");
  });
});
