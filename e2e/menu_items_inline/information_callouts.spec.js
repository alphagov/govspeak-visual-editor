import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
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

test("renders information callout menu items with expected disabled states", async ({
  page,
}) => {
  await page.locator("#editor .info-notice").click();
  await expect(page.locator(".menubar")).toBeVisible();

  const enabledMenuButtons = ["Heading 2", "Link", "Email link"];
  const disabledMenuButtons = ["Bullet list", "Ordered list"];

  for (const button of enabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeEnabled();
  for (const button of disabledMenuButtons)
    await expect(page.getByTitle(button, { exact: true })).toBeDisabled();

  const enabledSelectOptions = ["H3", "H4", "Call to action", "Address"];
  const disabledSelectOptions = ["Blockquote"];

  for (const option of enabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeEnabled();
  for (const option of disabledSelectOptions)
    await expect(page.locator(`option:has-text("${option}")`)).toBeDisabled();
});

test("should render information callouts in the editor and clear style after new line", async ({
  page,
}) => {
  await page.locator("#editor .info-notice").selectText();
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
