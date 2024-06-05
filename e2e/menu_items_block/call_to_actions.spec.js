import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("renders blockquote menu items with expected disabled states", async ({
  page,
}) => {
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Call to action");
  await expect(page.locator(".menubar")).toBeVisible();

  const enabledMenuButtons = [
    "Bullet list",
    "Ordered list",
    "Link",
    "Email link",
  ];
  const disabledMenuButtons = ["Heading 2"];

  for (const button of enabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeEnabled();
  for (const button of disabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeDisabled();

  const enabledSelectOptions = ["Call to action", "Address", "Blockquote"];
  const disabledSelectOptions = ["H3", "H4"];

  for (const option of enabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeEnabled();
  for (const option of disabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeDisabled();
});

test("loads call to action from the index file in the editor", async ({
  page,
}) => {
  await expect(
    page.locator("#editor .call-to-action").getByText("Call to action"),
  ).toBeVisible();
});

test("should render call to action in the editor on multiple lines clearing on double enter when clicking on '$A' and typing", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("New line\n");

  await page.getByText("New line").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Call to action");
  await page.getByText("New line").selectText();
  await page.keyboard.type("Action 1");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Action 2");
  await page.keyboard.press("Shift+Enter");
  await page.keyboard.type("Action 3");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Not action");
  await page.keyboard.press("Enter");

  await expect(
    page.locator("#editor .call-to-action").getByText("Action 1"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .call-to-action").getByText("Action 2"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .call-to-action").getByText("Action 3"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .call-to-action").getByText("Not action"),
  ).not.toBeVisible();

  expect(await page.locator("textarea#govspeak").inputValue()).toMatch(
    /\$CTA\n\nAction 1\n\nAction 2\n\nAction 3\n\n\$CTA\n\nNot action/,
  );
});

test("should toggle call to action for existing paragraph line", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing paragraph\n");

  await page.locator("#editor p").getByText("Testing paragraph").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Call to action");
  await expect(
    page.locator("#editor .call-to-action").getByText("Testing paragraph"),
  ).toBeVisible();
});

test("should allow embedding of other content", async ({ page }) => {
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Call to action");
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing call to action\n\n");

  await page
    .locator("#editor .call-to-action")
    .getByText("Testing call to action")
    .click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Call to action");
  await expect(
    page
      .locator("#editor .call-to-action .call-to-action")
      .getByText("Testing call to action"),
  ).toBeVisible();
});
