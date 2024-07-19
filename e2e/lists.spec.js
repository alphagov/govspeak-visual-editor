import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "./helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test.describe("bulleted list", () => {
  test("renders bullet list menu items", async ({ page }) => {
    await page.getByTitle("Ordered list").click();
    await expect(page.locator(".visual-editor__menu")).toBeVisible();
    const enabledMenuButtons = [];
    const disabledMenuButtons = ["Bullet list", "Ordered list"];

    for (const button of enabledMenuButtons)
      await expect(page.getByTitle(button)).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByTitle(button)).toBeDisabled();

    const enabledSelectOptions = [];
    const disabledSelectOptions = [
      "Call to action",
      "Address",
      "Blockquote",
      "Heading 2",
      "Heading 3",
      "Heading 4",
    ];

    for (const option of enabledSelectOptions)
      await expect(page.locator(`option:has-text("${option}")`)).toBeEnabled();
    for (const option of disabledSelectOptions)
      await expect(page.locator(`option:has-text("${option}")`)).toBeDisabled();
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

  test("should render bullet list in the editor clearing on double enter", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByTitle("Bullet list").click();
    await page.getByText("New line").selectText();
    await page.keyboard.type("test 1");
    await page.keyboard.press("Enter");
    await page.keyboard.type("test 2");
    await page.keyboard.press("Shift+Enter");
    await page.keyboard.type("test 3");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Not list");

    await expect(
      page.locator("#editor ul li").getByText("test 1"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ul li").getByText("test 2"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ul li").getByText("test 3"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ul li").getByText("Not list"),
    ).not.toBeVisible();

    expect(await page.locator("textarea#govspeak").inputValue()).toMatch(
      /\* test 1\n\* test 2\n\* test 3\n\nNot list/,
    );
  });

  test("should jump back onto previous list item when pressing backspace on an empty list item", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByTitle("Bullet list").click();
    await page.getByText("New line").selectText();
    await page.keyboard.type("test 1");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Backspace");
    await page.keyboard.type(" extra");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Not list");

    await expect(
      page.locator("#editor ul li").getByText("test 1 extra"),
    ).toBeVisible();

    expect(await page.locator("textarea#govspeak").inputValue()).toMatch(
      /\* test 1 extra\n\nNot list/,
    );
  });

  test("should jump back to previous list item when pressing backspace at the start of a list item", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByTitle("Bullet list").click();
    await page.getByText("New line").selectText();
    await page.keyboard.type("test 1");
    await page.keyboard.press("Enter");
    await page.keyboard.type("2");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("Backspace");

    await expect(
      page.locator("#editor ul li").getByText("test 12"),
    ).toBeVisible();
  });

  test("should exit the list when pressing backspace in an empty list", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").selectText();
    await page.keyboard.press("Backspace");
    await page.getByTitle("Bullet list").click();
    await expect(page.locator("#editor ul li")).toHaveCount(1);
    await page.keyboard.press("Backspace");
    await expect(page.locator("#editor ul li")).toHaveCount(0);
  });

  test("should toggle bullet list item for existing paragraph line", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");

    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page.getByTitle("Bullet list").click();
    await expect(
      page.locator("#editor ul li").getByText("Testing paragraph"),
    ).toBeVisible();
  });
});

test.describe("numbered list", () => {
  test("renders numbered list menu items", async ({ page }) => {
    await page.getByTitle("Bullet list").click();
    await expect(page.locator(".visual-editor__menu")).toBeVisible();
    const enabledMenuButtons = [];
    const disabledMenuButtons = ["Bullet list", "Ordered list"];

    for (const button of enabledMenuButtons)
      await expect(page.getByTitle(button)).toBeEnabled();
    for (const button of disabledMenuButtons)
      await expect(page.getByTitle(button)).toBeDisabled();

    const enabledSelectOptions = [];
    const disabledSelectOptions = [
      "Call to action",
      "Address",
      "Blockquote",
      "Heading 2",
      "Heading 3",
      "Heading 4",
    ];

    for (const option of enabledSelectOptions)
      await expect(page.locator(`option:has-text("${option}")`)).toBeEnabled();
    for (const option of disabledSelectOptions)
      await expect(page.locator(`option:has-text("${option}")`)).toBeDisabled();
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

  test("should render numbered list in the editor clearing on double enter", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByTitle("Ordered list").click();
    await page.getByText("New line").selectText();
    await page.keyboard.type("test 1");
    await page.keyboard.press("Enter");
    await page.keyboard.type("test 2");
    await page.keyboard.press("Shift+Enter");
    await page.keyboard.type("test 3");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Not list");

    await expect(
      page.locator("#editor ol li").getByText("test 1"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol li").getByText("test 2"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol li").getByText("test 3"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol li").getByText("Not list"),
    ).not.toBeVisible();

    expect(await page.locator("textarea#govspeak").inputValue()).toMatch(
      /1\. test 1\n2\. test 2\n3\. test 3\n\nNot list/,
    );
  });

  test("should jump back onto previous list item when pressing backspace on an empty list item", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("New line\n");

    await page.getByText("New line").click();
    await page.getByTitle("Ordered list").click();
    await page.getByText("New line").selectText();
    await page.keyboard.type("test 1");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Backspace");
    await page.keyboard.type(" extra");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Not list");

    await expect(
      page.locator("#editor ol li").getByText("test 1 extra"),
    ).toBeVisible();

    expect(await page.locator("textarea#govspeak").inputValue()).toMatch(
      /1\. test 1 extra\n\nNot list/,
    );
  });

  test("should toggle numbered list item for existing paragraph line", async ({
    page,
  }) => {
    await page.locator("#editor .ProseMirror.govspeak").focus();
    await page.keyboard.type("Testing paragraph\n");

    await page.locator("#editor p").getByText("Testing paragraph").click();
    await page.getByTitle("Ordered list").click();
    await expect(
      page.locator("#editor ol li").getByText("Testing paragraph"),
    ).toBeVisible();
  });
});

test.describe("steps", () => {
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

  test("should render steps in the editor clearing on double enter", async ({
    page,
  }) => {
    await page.locator("#editor ol.steps").selectText();
    await page.keyboard.type("Step test 1");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Step test 2");
    await page.keyboard.press("Shift+Enter");
    await page.keyboard.type("Step test 3");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Not steps");

    await expect(
      page.locator("#editor ol.steps li").getByText("Step test 1"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol.steps li").getByText("Step test 2"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol.steps li").getByText("Step test 3"),
    ).toBeVisible();
    await expect(
      page.locator("#editor ol.steps li").getByText("Not steps"),
    ).not.toBeVisible();

    expect(await page.locator("textarea#govspeak").inputValue()).toMatch(
      /s1\. Step test 1\ns2\. Step test 2\ns3\. Step test 3\n\n\nNot steps/,
    );
  });

  test("should jump back onto previous list item when pressing backspace on an empty list item", async ({
    page,
  }) => {
    await page.locator("#editor ol.steps").selectText();
    await page.keyboard.type("test 1");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Backspace");
    await page.keyboard.type(" extra");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Not list");

    await expect(
      page.locator("#editor ol.steps li").getByText("test 1 extra"),
    ).toBeVisible();

    expect(await page.locator("textarea#govspeak").inputValue()).toMatch(
      /s1\. test 1 extra\n\n\nNot list/,
    );
  });
});
