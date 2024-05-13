import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test.fixme(
  "renders blockquote menu items with expected disabled states",
  async ({ page }) => {
    await page.getByText("“”", { exact: true }).click();
    await expect(page.locator(".menubar")).toBeVisible();
    const enabledMenuButtons = [];
    const disabledMenuButtons = [
      "H2",
      "H3",
      "p",
      "“”",
      "$A",
      "$CTA",
      "$C",
      "$E",
      "^",
      "%",
      "1.",
      "-",
    ];

    for (const button of enabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeDisabled();
  },
);

test.fixme(
  "should render blockquote in the editor on multiple lines clearing on double enter when clicking on '$A' and typing",
  async ({ page }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByText("“”", { exact: true }).click();
    await page.getByText("New line").selectText();
    await page.keyboard.type(
      "Blockquote line 1\nBlockquote line 2\n\nNot blockquote\n",
    );

    await expect(
      page.locator("#editor blockquote").getByText("Blockquote line 1"),
    ).toBeVisible();
    await expect(
      page.locator("#editor blockquote").getByText("Blockquote line 2"),
    ).toBeVisible();
    await expect(
      page.locator("#editor blockquote").getByText("Not blockquote"),
    ).not.toBeVisible();
  },
);

test.fixme(
  "should toggle blockquote for existing paragraph line",
  async ({ page }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");

    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page.getByText("“”", { exact: true }).click();
    await expect(
      page.locator("#editor blockquote").getByText("Testing paragraph"),
    ).toBeVisible();
  },
);
