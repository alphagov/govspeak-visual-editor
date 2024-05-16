import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("renders warning callout menu items with expected disabled states", async ({
  page,
}) => {
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Warning callout");
  await expect(page.locator(".menubar")).toBeVisible();

  const enabledMenuButtons = ["Heading 2", "Link", "Email link"];
  const disabledMenuButtons = ["Bullet list", "Ordered list", "Steps"];

  for (const button of enabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeEnabled();
  for (const button of disabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeDisabled();

  const enabledSelectOptions = [
    "H3",
    "H4",
    "H5",
    "H6",
    "Call to action",
    "Information callout",
    "Warning callout",
    "Example callout",
    "Address",
  ];
  const disabledSelectOptions = ["Contact", "Blockquote"];

  for (const option of enabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeEnabled();
  for (const option of disabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeDisabled();
});

test("loads warning callouts from the index file in the editor", async ({
  page,
}) => {
  await expect(
    page.locator("#editor .help-notice").getByText("This is a warning callout"),
  ).toBeVisible();
});

test("should render warning callouts in the editor and clear style after new line when selecting 'Warning callout' and typing", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("New line\n");

  await page.getByText("New line").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Warning callout");
  await page.getByText("New line").selectText();
  await page.keyboard.type(
    "Testing warning callout!\nTesting not warning callout!\n",
  );
  await expect(
    page.locator("#editor .help-notice").getByText("Testing warning callout!"),
  ).toBeVisible();
  await expect(
    page
      .locator("#editor .help-notice")
      .getByText("Testing not warning callout!"),
  ).not.toBeVisible();
});

test("should toggle warning callout for existing paragraph line", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing paragraph\n");

  await page.locator("#editor p").getByText("Testing paragraph").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Warning callout");
  await expect(
    page.locator("#editor .help-notice").getByText("Testing paragraph"),
  ).toBeVisible();
});

test("should toggle warning callout off for existing callout", async ({
  page,
}) => {
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Warning callout");
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing warning callout\n");

  await page
    .locator("#editor .help-notice")
    .getByText("Testing warning callout")
    .click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Warning callout");
  await expect(
    page.locator("#editor p").getByText("Testing warning callout"),
  ).toBeVisible();
});
