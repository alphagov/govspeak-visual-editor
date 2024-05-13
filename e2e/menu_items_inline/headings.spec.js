import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test.describe("H2", () => {
  test("renders H2 menu items", async ({ page }) => {
    await page.getByText("H²", { exact: true }).click();
    await expect(page.locator(".menubar")).toBeVisible();
    const enabledMenuButtons = ["H²"];
    const disabledMenuButtons = ["•", "⒈", "➊"];

    for (const button of enabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeDisabled();
  });

  test("loads H2 from the index file in the editor", async ({ page }) => {
    await expect(
      page.locator("#editor H2").getByText("This is an H2 heading"),
    ).toBeVisible();
  });

  test("should render H2 headings in the editor and clear style after new line when clicking on 'H2' and typing", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByText("H²", { exact: true }).click();
    await page.getByText("New line").selectText();
    await page.keyboard.type("Testing H2!\nTesting not H2!\n");
    await expect(
      page.locator("#editor h2").getByText("Testing H2!"),
    ).toBeVisible();
    await expect(
      page.locator("#editor h2").getByText("Testing not H2!"),
    ).not.toBeVisible();
  });

  test("should toggle H2 headings on for existing paragraph line", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");

    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page.getByText("H²", { exact: true }).click();
    await expect(
      page.locator("#editor h2").getByText("Testing paragraph"),
    ).toBeVisible();
  });

  test("should toggle H2 headings off for existing heading", async ({
    page,
  }) => {
    await page.getByText("H²", { exact: true }).click();
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing heading\n");

    await page.locator("#editor h2").getByText("Testing heading").click();
    await page.getByText("H²", { exact: true }).click();
    await expect(
      page.locator("#editor p").getByText("Testing heading"),
    ).toBeVisible();
  });
});

test.fixme("H3", () => {
  test("renders H3 menu items with expected disabled state", async ({
    page,
  }) => {
    await page.getByText("H3", { exact: true }).click();
    await expect(page.locator(".menubar")).toBeVisible();
    const visibleMenuButtons = ["p", "H2", "^", "%"];
    const disabledMenuButtons = [
      "H3",
      "1.",
      "-",
      "“”",
      "$A",
      "$CTA",
      "$C",
      "$E",
    ];

    for (const button of visibleMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeVisible();
    for (const button of disabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeDisabled();
  });

  test("loads H3 from the index file in the editor", async ({ page }) => {
    await expect(
      page.locator("#editor H3").getByText("This is an H3 heading"),
    ).toBeVisible();
  });

  test("should render H3 headings in the editor and clear style after new line when clicking on 'H3' and typing", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByText("H3", { exact: true }).click();
    await page.getByText("New line").selectText();
    await page.keyboard.type("Testing H3!\nTesting not H3!\n");
    await expect(
      page.locator("#editor h3").getByText("Testing H3!"),
    ).toBeVisible();
    await expect(
      page.locator("#editor h3").getByText("Testing not H3!"),
    ).not.toBeVisible();
  });

  test("should toggle H3 headings on for existing paragraph line", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");

    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page.getByText("H3", { exact: true }).click();
    await expect(
      page.locator("#editor h3").getByText("Testing paragraph"),
    ).toBeVisible();
  });

  test("should toggle H3 headings off for existing heading", async ({
    page,
  }) => {
    await page.getByText("H3", { exact: true }).click();
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing heading\n");

    await page.locator("#editor h3").getByText("Testing heading").click();
    await page.getByText("p", { exact: true }).click();
    await expect(
      page.locator("#editor p").getByText("Testing heading"),
    ).toBeVisible();
  });
});
