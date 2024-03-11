import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("renders call to action menu items", async ({ page }) => {
  await page.getByText("$CTA", { exact: true }).click();
  await expect(page.locator(".menubar")).toBeVisible();
  const visibleMenuButtons = [
    "B",
    "H2",
    "H3",
    "“”",
    "<>",
    "$A",
    "$CTA",
    "$C",
    "$E",
    "^",
    "%",
    "1.",
    "-",
  ];
  const disabledMenuButtons = ["p"];

  for (const button of visibleMenuButtons)
    await expect(page.getByText(button, { exact: true })).toBeVisible();
  for (const button of disabledMenuButtons)
    await expect(page.getByText(button, { exact: true })).toBeDisabled();
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
  await page.getByText("$CTA", { exact: true }).click();
  await page.getByText("New line").selectText();
  await page.keyboard.type("Action 1\nAction 2\n\nNot action\n");

  await expect(
    page.locator("#editor .call-to-action").getByText("Action 1"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .call-to-action").getByText("Action 2"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .call-to-action").getByText("Not action"),
  ).not.toBeVisible();
});

test("should toggle call to action for existing paragraph line", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing paragraph\n");

  await page.locator("#editor p").getByText("Testing paragraph").click();
  await page.getByText("$CTA", { exact: true }).click();
  await expect(
    page.locator("#editor .call-to-action").getByText("Testing paragraph"),
  ).toBeVisible();
});

test("should allow embedding of other content", async ({ page }) => {
  await page.getByText("$CTA", { exact: true }).click();
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing call to action\n\n");

  await page
    .locator("#editor .call-to-action")
    .getByText("Testing call to action")
    .click();
  await page.getByText("$CTA", { exact: true }).click();
  await expect(
    page
      .locator("#editor .call-to-action .call-to-action")
      .getByText("Testing call to action"),
  ).toBeVisible();
});
