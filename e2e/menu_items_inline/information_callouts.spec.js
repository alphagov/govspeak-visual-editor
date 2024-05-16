import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("renders information callout menu items with expected disabled states", async ({
  page,
}) => {
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Information callout");
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

test("loads information callouts from the index file in the editor", async ({
  page,
}) => {
  await expect(
    page
      .locator("#editor .info-notice")
      .getByText("This is an information callout"),
  ).toBeVisible();
});

test("should render information callouts in the editor and clear style after new line when clicking on 'Information callout' and typing", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("New line\n");

  await page.getByText("New line").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Information callout");
  await page.getByText("New line").selectText();
  await page.keyboard.type(
    "Testing information callout!\nTesting not information callout!\n",
  );
  await expect(
    page
      .locator("#editor .info-notice")
      .getByText("Testing information callout!"),
  ).toBeVisible();
  await expect(
    page
      .locator("#editor .info-notice")
      .getByText("Testing not information callout!"),
  ).not.toBeVisible();
});

test("should toggle information callout for existing paragraph line", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing paragraph\n");

  await page.locator("#editor p").getByText("Testing paragraph").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Information callout");
  await expect(
    page.locator("#editor .info-notice").getByText("Testing paragraph"),
  ).toBeVisible();
});

test("should toggle information callout off for existing callout", async ({
  page,
}) => {
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Information callout");
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing information callout\n");

  await page
    .locator("#editor .info-notice")
    .getByText("Testing information callout")
    .click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Information callout");
  await expect(
    page.locator("#editor p").getByText("Testing information callout"),
  ).toBeVisible();
});
