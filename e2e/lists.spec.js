import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "./helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test.describe("bulleted list", () => {
  test("renders bullet list menu items", async ({ page }) => {
    await page.getByText("⒈", { exact: true }).click();
    await expect(page.locator(".menubar")).toBeVisible();
    const enabledMenuButtons = [];
    const disabledMenuButtons = ["H²", "•", "⒈", "➊"];

    for (const button of enabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeDisabled();
  });

  test("loads bullet list from the index file in the editor", async ({
    page,
  }) => {
    await expect(page.locator("#editor ul li").getByText("One")).toBeVisible();
    await expect(page.locator("#editor ul li").getByText("Two")).toBeVisible();
    await expect(
      page.locator("#editor ul li").getByText("Three"),
    ).toBeVisible();
  });

  test("should render bullet list in the editor clearing on double enter when clicking on '-' and typing", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByText("•", { exact: true }).click();
    await page.getByText("New line").selectText();
    await page.keyboard.type("test 1\ntest 2\n\nnot list\n");

    await expect(
      page.locator("#editor ul li").getByText("test 1"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ul li").getByText("test 2"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ul li").getByText("Not list"),
    ).not.toBeVisible();
  });

  test("should toggle bullet list item for existing paragraph line", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");

    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page.getByText("•", { exact: true }).click();
    await expect(
      page.locator("#editor ul li").getByText("Testing paragraph"),
    ).toBeVisible();
  });
});

test.describe("numbered list", () => {
  test("renders numbered list menu items", async ({ page }) => {
    await page.getByText("•", { exact: true }).click();
    await expect(page.locator(".menubar")).toBeVisible();
    const enabledMenuButtons = [];
    const disabledMenuButtons = ["H²", "•", "⒈", "➊"];

    for (const button of enabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeDisabled();
  });

  test("loads numbered list from the index file in the editor", async ({
    page,
  }) => {
    await expect(
      page.locator("#editor ol li").getByText("First"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol li").getByText("Second"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol li").getByText("Third"),
    ).toBeVisible();
  });

  test("should render numbered list in the editor clearing on double enter when clicking on '1.' and typing", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByText("⒈", { exact: true }).click();
    await page.getByText("New line").selectText();
    await page.keyboard.type("test 1\ntest 2\n\nnot list\n");

    await expect(
      page.locator("#editor ol li").getByText("test 1"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol li").getByText("test 2"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol li").getByText("Not list"),
    ).not.toBeVisible();
  });

  test("should toggle numbered list item for existing paragraph line", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");

    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page.getByText("⒈", { exact: true }).click();
    await expect(
      page.locator("#editor ol li").getByText("Testing paragraph"),
    ).toBeVisible();
  });
});

test.describe("steps", () => {
  test("renders steps menu items", async ({ page }) => {
    await page.getByText("➊", { exact: true }).click();
    await expect(page.locator(".menubar")).toBeVisible();
    const enabledMenuButtons = [];
    const disabledMenuButtons = ["H²", "•", "⒈", "➊"];

    for (const button of enabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByText(button, { exact: true })).toBeDisabled();
  });

  test("loads steps from the index file in the editor", async ({ page }) => {
    await expect(
      page.locator("#editor ol.steps li").getByText("Step 1"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol.steps li").getByText("Step 2"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol.steps li").getByText("Step 3"),
    ).toBeVisible();
  });

  test("should render steps in the editor clearing on double enter when clicking on 's1.' and typing", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByText("➊", { exact: true }).click();
    await page.getByText("New line").selectText();
    await page.keyboard.type("test 1\ntest 2\n\nnot steps\n");

    await expect(
      page.locator("#editor ol.steps li").getByText("Step 1"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol.steps li").getByText("Step 2"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol.steps li").getByText("Not steps"),
    ).not.toBeVisible();
  });

  test("should toggle steps item for existing paragraph line", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing steps\n");

    await page.locator("#editor p").getByText("Testing steps").click();
    await page.getByText("➊", { exact: true }).click();
    await expect(
      page.locator("#editor ol.steps li").getByText("Testing steps"),
    ).toBeVisible();
  });
});
