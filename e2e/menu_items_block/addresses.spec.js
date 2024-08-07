import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("renders address menu items with expected disabled states", async ({
  page,
}) => {
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Address");
  await expect(page.locator(".visual-editor__menu")).toBeVisible();

  const enabledMenuButtons = [
    "Link",
    "Email link",
    "Bullet list",
    "Ordered list",
  ];
  const disabledMenuButtons = [];

  for (const button of enabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeEnabled();
  for (const button of disabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeDisabled();

  const enabledSelectOptions = ["Call to action", "Address", "Blockquote"];
  const disabledSelectOptions = ["Heading 2", "Heading 3", "Heading 4"];

  for (const option of enabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeEnabled();
  for (const option of disabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeDisabled();
});

test("loads addresses from the index file in the editor", async ({ page }) => {
  await expect(
    page.locator("#editor .address").getByText("HM Revenue and Customs"),
  ).toBeVisible();
});

test("should render address in the editor on multiple lines clearing on double enter when clicking on 'Address' and typing", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("New line\n");

  await page.getByText("New line").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Address");
  await page.getByText("New line").selectText();
  await page.keyboard.type("Address line 1\nAddress line 2\n\nNot address\n");

  await expect(
    page.locator("#editor .address").getByText("Address line 1"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .address").getByText("Address line 2"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .address").getByText("Not address"),
  ).not.toBeVisible();
});

test("should produce expected markdown honouring multiple spacing for Enter and Shift+Enter keys", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("New line\n");

  await page.getByText("New line").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Address");
  await page.getByText("New line").selectText();
  await page.keyboard.type("Address line 1");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Address line 2");
  await page.keyboard.press("Shift+Enter");
  await page.keyboard.press("Shift+Enter");
  await page.keyboard.type("Address line 3");
  await page.keyboard.press("Shift+Enter");
  await page.keyboard.press("Shift+Enter");
  await page.keyboard.press("Shift+Enter");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");

  await page.keyboard.type("Not address\n");

  await expect(
    page.locator("#editor .address").getByText("Address line 1"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .address").getByText("Address line 2"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .address").getByText("Address line 3"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .address").getByText("Not address"),
  ).not.toBeVisible();

  expect(await page.locator("textarea#govspeak").inputValue()).toMatch(
    /\$A\nAddress line 1\nAddress line 2\n\nAddress line 3\n\n\$A/,
  );
});

test("should toggle address for existing paragraph line", async ({ page }) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing paragraph\n");

  await page.locator("#editor p").getByText("Testing paragraph").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Address");
  await expect(
    page.locator("#editor .address").getByText("Testing paragraph"),
  ).toBeVisible();
});

test("should allow embedding of other content", async ({ page }) => {
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Address");
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing address\n\n");

  await page.locator("#editor .address").getByText("Testing address").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Address");
  await expect(
    page.locator("#editor .address .address").getByText("Testing address"),
  ).toBeVisible();
});
