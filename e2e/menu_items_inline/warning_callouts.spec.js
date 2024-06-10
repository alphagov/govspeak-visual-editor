import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("loads warning callouts from the index file in the editor", async ({
  page,
}) => {
  await expect(
    page.locator("#editor .help-notice").getByText("This is a warning callout"),
  ).toBeVisible();
});

test("renders warning callout menu items with expected disabled states", async ({
  page,
}) => {
  await page.locator("#editor .help-notice").click();
  await expect(page.locator(".menubar")).toBeVisible();

  const enabledMenuButtons = ["Link", "Email link"];
  const disabledMenuButtons = ["Bullet list", "Ordered list"];

  for (const button of enabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeEnabled();
  for (const button of disabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeDisabled();

  const enabledSelectOptions = [
    "Heading 2",
    "Heading 3",
    "Heading 4",
    "Call to action",
    "Address",
  ];
  const disabledSelectOptions = ["Blockquote"];

  for (const option of enabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeEnabled();
  for (const option of disabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeDisabled();
});

test("should render warning callouts in the editor and clear style after new line", async ({
  page,
}) => {
  await page.locator("#editor .help-notice").selectText();
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
