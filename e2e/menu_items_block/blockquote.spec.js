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
    .selectOption("Blockquote");
  await expect(page.locator(".visual-editor__menu")).toBeVisible();

  const enabledMenuButtons = ["Link", "Email link"];
  const disabledMenuButtons = ["Bullet list", "Ordered list"];

  for (const button of enabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeEnabled();
  for (const button of disabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeDisabled();

  const enabledSelectOptions = [];
  const disabledSelectOptions = [
    "Heading 2",
    "Heading 3",
    "Heading 4",
    "Call to action",
    "Address",
    "Blockquote",
  ];

  for (const option of enabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeEnabled();
  for (const option of disabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeDisabled();
});

test("should render blockquote in the editor on multiple lines clearing on double enter when clicking on 'Text Block' and typing", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("New line\n");

  await page.getByText("New line").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Blockquote");
  await page.getByText("New line").selectText();
  await page.keyboard.type("Blockquote line 1");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Blockquote line 2");
  await page.keyboard.press("Shift+Enter");
  await page.keyboard.type("Blockquote line 3");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  await page.keyboard.type("Not blockquote");

  await expect(
    page.locator("#editor blockquote").getByText("Blockquote line 1"),
  ).toBeVisible();
  await expect(
    page.locator("#editor blockquote").getByText("Blockquote line 2"),
  ).toBeVisible();
  await expect(
    page.locator("#editor blockquote").getByText("Blockquote line 3"),
  ).toBeVisible();
  await expect(
    page.locator("#editor blockquote").getByText("Not blockquote"),
  ).not.toBeVisible();

  expect(await page.locator("textarea#govspeak").inputValue()).toMatch(
    /> Blockquote line 1\n>\n> Blockquote line 2\n>\n> Blockquote line 3\n\nNot blockquote/,
  );
});

test("should toggle blockquote for existing paragraph line", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing paragraph\n");

  await page.locator("#editor p").getByText("Testing paragraph").click();
  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Blockquote");
  await expect(
    page.locator("#editor blockquote").getByText("Testing paragraph"),
  ).toBeVisible();
});
