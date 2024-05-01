import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("should render default menu items with expected disabled states", async ({
  page,
}) => {
  await expect(page.locator(".menubar")).toBeVisible();
  const enabledMenuButtons = [
    "H2",
    "H3",
    "“”",
    "1.",
    "-",
    "$A",
    "$CTA",
    "$C",
    "$E",
    "^",
    "%",
  ];
  const disabledMenuButtons = ["p"];

  for (const button of enabledMenuButtons)
    await expect(page.getByText(button, { exact: true })).toBeEnabled();
  for (const button of disabledMenuButtons)
    await expect(page.getByText(button, { exact: true })).toBeDisabled();
});

test("should load paragraphs from the index file in the editor", async ({
  page,
}) => {
  await expect(
    page
      .locator("#editor p")
      .getByText("Hello world, this is the ProseMirror editor."),
  ).toBeVisible();
});

test("should render typed paragraph text in the editor when clicking on 'p'", async ({
  page,
}) => {
  await page.getByText("H2", { exact: true }).click();
  await page.getByText("p", { exact: true }).click();

  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing!\n");

  await expect(page.locator("#editor p").getByText("Testing!")).toBeVisible();
});
