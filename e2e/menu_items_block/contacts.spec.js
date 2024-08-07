import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("loads contacts from the index file in the editor", async ({ page }) => {
  await expect(
    page.locator("#editor .contact").getByText("Financial Conduct Authority"),
  ).toBeVisible();
});

test("renders contact menu items with expected disabled states", async ({
  page,
}) => {
  await page.locator("#editor .contact").click();
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

test("should render contact in the editor on multiple lines clearing on double enter", async ({
  page,
}) => {
  await page.locator("#editor .contact").selectText();
  await page.keyboard.type("Contact line 1\nContact line 2\n\nNot contact\n");

  await expect(
    page.locator("#editor .contact").getByText("Contact line 1"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .contact").getByText("Contact line 2"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .contact").getByText("Not contact"),
  ).not.toBeVisible();
});
