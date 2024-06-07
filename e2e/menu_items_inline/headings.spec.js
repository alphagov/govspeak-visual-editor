import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "../helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test.describe("Heading 2", () => {
  test("renders menu items", async ({ page }) => {
    await page
      .locator('select:has-text("Paragraph")')
      .selectOption("Heading 2");
    await expect(page.locator(".menubar")).toBeVisible();
    const enabledMenuButtons = [];
    const disabledMenuButtons = ["Bullet list", "Ordered list"];

    for (const button of enabledMenuButtons)
      await expect(page.getByTitle(button)).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByTitle(button)).toBeDisabled();

    const enabledSelectOptions = ["Paragraph", "Heading 3", "Heading 4"];
    const disabledSelectOptions = [
      "Heading 2",
      "Call to action",
      "Address",
      "Blockquote",
    ];

    for (const option of enabledSelectOptions)
      await expect(page.locator(`option:has-text("${option}")`)).toBeEnabled();
    for (const option of disabledSelectOptions)
      await expect(page.locator(`option:has-text("${option}")`)).toBeDisabled();
  });

  test("loads from the index file in the editor", async ({ page }) => {
    await expect(
      page.locator("#editor H2").getByText("This is an H2 heading"),
    ).toBeVisible();
  });

  test("should render in the editor and clear style after new line when selecting 'Heading 2' and typing", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page
      .locator('select:has-text("Paragraph")')
      .selectOption("Heading 2");
    await page.getByText("New line").selectText();
    await page.keyboard.type("Testing H2!\nTesting not H2!\n");
    await expect(
      page.locator("#editor h2").getByText("Testing H2!"),
    ).toBeVisible();
    await expect(
      page.locator("#editor h2").getByText("Testing not H2!"),
    ).not.toBeVisible();
  });

  test("should toggle on for existing paragraph line", async ({ page }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");

    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page
      .locator('select:has-text("Paragraph")')
      .selectOption("Heading 2");
    await expect(
      page.locator("#editor h2").getByText("Testing paragraph"),
    ).toBeVisible();
  });

  test("should toggle off for existing heading", async ({ page }) => {
    await page
      .locator('select:has-text("Paragraph")')
      .selectOption("Heading 2");
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing heading\n");

    await page.locator("#editor h2").getByText("Testing heading").click();
    await page
      .locator('select:has-text("Paragraph")')
      .selectOption("Paragraph");
    await expect(
      page.locator("#editor p").getByText("Testing heading"),
    ).toBeVisible();
  });
});

test.describe("Heading 3", () => {
  test("renders menu items with expected disabled state", async ({ page }) => {
    await page
      .locator('select:has-text("Paragraph")')
      .selectOption("Heading 3");
    await expect(page.locator(".menubar")).toBeVisible();
    const enabledMenuButtons = [];
    const disabledMenuButtons = ["Bullet list", "Ordered list"];

    for (const button of enabledMenuButtons)
      await expect(page.getByTitle(button)).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByTitle(button)).toBeDisabled();

    const enabledSelectOptions = ["Paragraph", "Heading 2", "Heading 4"];
    const disabledSelectOptions = [
      "Heading 3",
      "Call to action",
      "Address",
      "Blockquote",
    ];

    for (const option of enabledSelectOptions)
      await expect(page.locator(`option:has-text("${option}")`)).toBeEnabled();
    for (const option of disabledSelectOptions)
      await expect(page.locator(`option:has-text("${option}")`)).toBeDisabled();
  });

  test("loads from the index file in the editor", async ({ page }) => {
    await expect(
      page.locator("#editor h3").getByText("This is an H3 heading"),
    ).toBeVisible();
  });

  test("should render in the editor and clear style after new line when clicking on 'Heading 3' and typing", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page
      .locator('select:has-text("Paragraph")')
      .selectOption("Heading 3");
    await page.getByText("New line").selectText();
    await page.keyboard.type("Testing Heading 3!\nTesting not Heading 3!\n");
    await expect(
      page.locator("#editor h3").getByText("Testing Heading 3!"),
    ).toBeVisible();
    await expect(
      page.locator("#editor h3").getByText("Testing not Heading 3!"),
    ).not.toBeVisible();
  });

  test("should toggle on for existing paragraph line", async ({ page }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");

    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page
      .locator('select:has-text("Paragraph")')
      .selectOption("Heading 3");
    await expect(
      page.locator("#editor h3").getByText("Testing paragraph"),
    ).toBeVisible();
  });

  test("should toggle off for existing heading", async ({ page }) => {
    await page
      .locator('select:has-text("Paragraph")')
      .selectOption("Heading 3");
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing heading\n");

    await page.locator("#editor h3").getByText("Testing heading").click();
    await page
      .locator('select:has-text("Paragraph")')
      .selectOption("Paragraph");
    await expect(
      page.locator("#editor p").getByText("Testing heading"),
    ).toBeVisible();
  });
});

test.describe("Select", () => {
  test("Should update as different heading levels are focused", async ({
    page,
  }) => {
    await expect(page.locator('select:has-text("Paragraph")')).toHaveValue("0");
    await page.locator("#editor H2").selectText();
    await expect(page.locator('select:has-text("Paragraph")')).toHaveValue("1");
    await page.locator("#editor H3").selectText();
    await expect(page.locator('select:has-text("Paragraph")')).toHaveValue("2");
  });
});
