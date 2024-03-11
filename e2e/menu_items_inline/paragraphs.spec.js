import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("should render default menu items", async ({ page }) => {
  await expect(page.locator(".menubar")).toBeVisible();
  const visibleMenuButtons = [
    "B",
    "H2",
    "H3",
    "“”",
    "<>",
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

  for (const button of visibleMenuButtons)
    await expect(page.getByText(button, { exact: true })).toBeVisible();
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

test.describe("with bold text", () => {
  test("should load bold paragraphs from the index file in the editor", async ({
    page,
  }) => {
    await expect(
      page.locator("#editor p strong").getByText("This is some bold text."),
    ).toBeVisible();
  });

  test("should render bold paragraph text in the editor and clear style after new line when clicking on 'B' and typing", async ({
    page,
  }) => {
    await page.getByText("B", { exact: true }).click();
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing bold!\nTesting not bold!\n");

    await expect(
      page.locator("#editor p strong").getByText("Testing bold!"),
    ).toBeVisible();
    await expect(
      page.locator("#editor p").getByText("Testing not bold!"),
    ).toBeVisible();
    await expect(
      page.locator("#editor p strong").getByText("Testing not bold!"),
    ).not.toBeVisible();
  });

  test("should toggle bold paragraph text for the same line in the editor when clicking 'B' and typing", async ({
    page,
  }) => {
    await page.getByText("B", { exact: true }).click();
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing bold! ");

    await page.getByText("B", { exact: true }).click();
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type(" and not bold");

    await expect(
      page.locator("#editor p").getByText("Testing bold! and not bold"),
    ).toBeVisible();
    await expect(
      page.locator("#editor p strong").getByText("Testing bold!"),
    ).toBeVisible();
    await expect(
      page.locator("#editor p strong").getByText("and not bold"),
    ).not.toBeVisible();
  });

  test("should toggle bold paragraph text when selecting text and clicking 'B'", async ({
    page,
  }) => {
    await page
      .locator("#editor p strong")
      .getByText("This is some bold text.")
      .selectText();
    await page.getByText("B", { exact: true }).click();

    await expect(
      page.locator("#editor p strong").getByText("This is some bold text."),
    ).not.toBeVisible();

    await page
      .locator("#editor p")
      .getByText("This is some bold text.")
      .selectText();
    await page.getByText("B", { exact: true }).click();

    await expect(
      page.locator("#editor p strong").getByText("This is some bold text."),
    ).toBeVisible();
  });
});
