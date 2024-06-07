import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("loads example callout from the index file in the editor", async ({
  page,
}) => {
  await expect(
    page.locator("#editor .example").getByText("This is an example callout"),
  ).toBeVisible();
});

test("renders example callout menu items with expected disabled states", async ({
  page,
}) => {
  await page.locator("#editor .example").click();
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

test("should render example callout in the editor on multiple lines clearing on double enter when clicking on '$A' and typing", async ({
  page,
}) => {
  await page.locator("#editor .example").selectText();
  await page.keyboard.type("Example 1\nExample 2\n\nNot example\n");

  await expect(
    page.locator("#editor .example").getByText("Example 1"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .example").getByText("Example 2"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .example").getByText("Not example"),
  ).not.toBeVisible();
});

test("should allow embedding of other content", async ({ page }) => {
  await page.locator("#editor .example").selectText();

  await page
    .locator('select:has-text("Add text block")')
    .selectOption("Call to action");

  await expect(
    page
      .locator("#editor .example .call-to-action")
      .getByText("This is an example callout"),
  ).toBeVisible();
});
