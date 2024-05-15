import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test.fixme(
  "renders contacts menu items with expected disabled states",
  async ({ page }) => {
    await page.getByText("$C", { exact: true }).click();
    await expect(page.locator(".menubar")).toBeVisible();
    const enabledMenuButtons = [];
    const disabledMenuButtons = [
      "H2",
      "p",
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

    for (const button of enabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeDisabled();
  },
);

test.fixme(
  "loads contacts from the index file in the editor",
  async ({ page }) => {
    await expect(
      page.locator("#editor .contact").getByText("Financial Conduct Authority"),
    ).toBeVisible();
  },
);

test.fixme(
  "should render contact in the editor on multiple lines clearing on double enter when clicking on '$A' and typing",
  async ({ page }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByText("$C", { exact: true }).click();
    await page.getByText("New line").selectText();
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
  },
);

test.fixme(
  "should toggle contact for existing paragraph line",
  async ({ page }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");
    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page.getByText("$C", { exact: true }).click();
    await expect(
      page.locator("#editor .contact").getByText("Testing paragraph"),
    ).toBeVisible();
  },
);
