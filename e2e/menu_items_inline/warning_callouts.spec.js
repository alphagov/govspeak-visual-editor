import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("renders warning callout menu items", async ({ page }) => {
  await page.getByText("%", { exact: true }).click();
  await expect(page.locator(".menubar")).toBeVisible();
  const visibleMenuButtons = [
    "B",
    "p",
    "H2",
    "H3",
    "“”",
    "<>",
    "$A",
    "$CTA",
    "$C",
    "$E",
    "^",
  ];
  const disabledMenuButtons = ["%", "1.", "-"];

  for (const button of visibleMenuButtons)
    await expect(page.getByText(button, { exact: true })).toBeVisible();
  for (const button of disabledMenuButtons)
    await expect(page.getByText(button, { exact: true })).toBeDisabled();
});

test("loads warning callouts from the index file in the editor", async ({
  page,
}) => {
  await expect(
    page.locator("#editor .help-notice").getByText("This is a warning callout"),
  ).toBeVisible();
});

test("should render warning callouts in the editor and clear style after new line when clicking on 'H2' and typing", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("New line\n");

  await page.getByText("New line").click();
  await page.getByText("%", { exact: true }).click();
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
  await page.getByText("%", { exact: true }).click();
  await expect(
    page.locator("#editor .help-notice").getByText("Testing paragraph"),
  ).toBeVisible();
});

test("should toggle warning callout off for existing callout", async ({
  page,
}) => {
  await page.getByText("%", { exact: true }).click();
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing warning callout\n");

  await page
    .locator("#editor .help-notice")
    .getByText("Testing warning callout")
    .click();
  await page.getByText("p", { exact: true }).click();
  await expect(
    page.locator("#editor p").getByText("Testing warning callout"),
  ).toBeVisible();
});
