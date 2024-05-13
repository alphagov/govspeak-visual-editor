import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test.fixme(
  "renders information callout menu items with expected disabled states",
  async ({ page }) => {
    await page.getByText("^", { exact: true }).click();
    await expect(page.locator(".menubar")).toBeVisible();
    const enabledMenuButtons = ["p", "H2", "H3", "$A", "$CTA", "$E", "%"];
    const disabledMenuButtons = ["“”", "^", "1.", "-", "$C"];
    for (const button of enabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeDisabled();
  },
);

test.fixme(
  "loads information callouts from the index file in the editor",
  async ({ page }) => {
    await expect(
      page
        .locator("#editor .info-notice")
        .getByText("This is an information callout"),
    ).toBeVisible();
  },
);

test.fixme(
  "should render information callouts in the editor and clear style after new line when clicking on 'H2' and typing",
  async ({ page }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByText("^", { exact: true }).click();
    await page.getByText("New line").selectText();
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
  },
);

test.fixme(
  "should toggle information callout for existing paragraph line",
  async ({ page }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");

    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page.getByText("^", { exact: true }).click();
    await expect(
      page.locator("#editor .info-notice").getByText("Testing paragraph"),
    ).toBeVisible();
  },
);

test.fixme(
  "should toggle information callout off for existing callout",
  async ({ page }) => {
    await page.getByText("^", { exact: true }).click();
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing information callout\n");

    await page
      .locator("#editor .info-notice")
      .getByText("Testing information callout")
      .click();
    await page.getByText("p", { exact: true }).click();
    await expect(
      page.locator("#editor p").getByText("Testing information callout"),
    ).toBeVisible();
  },
);
