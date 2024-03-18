import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("renders address menu items", async ({ page }) => {
  await page.getByText("$A", { exact: true }).click();
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

test("loads addresses from the index file in the editor", async ({ page }) => {
  await expect(
    page.locator("#editor .address").getByText("HM Revenue and Customs"),
  ).toBeVisible();
});

test("should render address in the editor on multiple lines clearing on double enter when clicking on '$A' and typing", async ({
  page,
}) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("New line\n");

  await page.getByText("New line").click();
  await page.getByText("$A", { exact: true }).click();
  await page.getByText("New line").selectText();
  await page.keyboard.type("Address line 1\nAddress line 2\n\nNot address\n");

  await expect(
    page.locator("#editor .address").getByText("Address line 1"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .address").getByText("Address line 2"),
  ).toBeVisible();
  await expect(
    page.locator("#editor .address").getByText("Not address"),
  ).not.toBeVisible();
});

test("should toggle address for existing paragraph line", async ({ page }) => {
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing paragraph\n");

  await page.locator("#editor p").getByText("Testing paragraph").click();
  await page.getByText("$A", { exact: true }).click();
  await expect(
    page.locator("#editor .address").getByText("Testing paragraph"),
  ).toBeVisible();
});

test("should allow embedding of other content", async ({ page }) => {
  await page.getByText("$A", { exact: true }).click();
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing address\n\n");

  await page.locator("#editor .address").getByText("Testing address").click();
  await page.getByText("$A", { exact: true }).click();
  await expect(
    page.locator("#editor .address .address").getByText("Testing address"),
  ).toBeVisible();
});
