import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test.fixme(
  "renders example callout menu items with expected disabled state",
  async ({ page }) => {
    await page.getByText("$E", { exact: true }).click();
    await expect(page.locator(".menubar")).toBeVisible();
    const enabledMenuButtons = [
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
    const disabledMenuButtons = ["p", "H2", "H3"];

    for (const button of enabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeDisabled();
  },
);

test.fixme(
  "loads example callout from the index file in the editor",
  async ({ page }) => {
    await expect(
      page.locator("#editor .example").getByText("This is an example callout"),
    ).toBeVisible();
  },
);

test.fixme(
  "should render example callout in the editor on multiple lines clearing on double enter when clicking on '$A' and typing",
  async ({ page }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByText("$E", { exact: true }).click();
    await page.getByText("New line").selectText();
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
  },
);

test.fixme(
  "should toggle example callout for existing paragraph line",
  async ({ page }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");

    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page.getByText("$E", { exact: true }).click();
    await expect(
      page.locator("#editor .example").getByText("Testing paragraph"),
    ).toBeVisible();
  },
);

test.fixme("should allow embedding of other content", async ({ page }) => {
  await page.getByText("$E", { exact: true }).click();
  await page.locator("#editor .ProseMirror.govspeak").focus();
  await page.keyboard.type("Testing example callout\n\n");

  await page
    .locator("#editor .example")
    .getByText("Testing example callout")
    .click();
  await page.getByText("$E", { exact: true }).click();
  await expect(
    page
      .locator("#editor .example .example")
      .getByText("Testing example callout"),
  ).toBeVisible();
});
