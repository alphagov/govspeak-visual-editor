import { test, expect } from "@playwright/test";
import { VISUAL_EDITOR_URL } from "./helpers/constants.js";

test.beforeEach(async ({ page }) => {
  await page.goto(VISUAL_EDITOR_URL);
});

test("loads image from the index file in the editor", async ({ page }) => {
  await expect(page.locator('#content [src="/example.jpg"]')).toBeAttached();
  await expect(page.locator('#editor [src="/example.jpg"]')).toBeVisible();
});

test("invalid image from the index file in the editor is displayed with an error", async ({
  page,
}) => {
  await expect(page.locator('#content [src="/example-2.jpg"]')).toBeAttached();
  await expect(
    page.locator(
      '.visual-editor__highlight--image-error [src="/example-2.jpg"]',
    ),
  ).toBeVisible();
  await page
    .locator('.visual-editor__highlight--image-error [src="/example-2.jpg"]')
    .click();
  await expect(
    page.getByText(
      "Upload the image on the images tab before using it in the document.",
    ),
  ).toBeVisible();
});

async function simulatePaste(page, text) {
  await page.evaluate((text) => {
    const editor = document.querySelector('#editor [contenteditable="true"]');
    const clipboardData = new DataTransfer();
    clipboardData.setData("text/plain", text);
    const clipboardEvent = new ClipboardEvent("paste", {
      clipboardData,
    });
    editor.dispatchEvent(clipboardEvent);
  }, text);
}

async function triggerPaste(page, text) {
  await page.keyboard.type(`${text}\n`);
  await page.locator("#editor").getByText(`${text}\n`).selectText();
  await page.keyboard.press("ControlOrMeta+X");
  await page.keyboard.press("ControlOrMeta+V");
}

async function paste(page, browserName, text) {
  await page.locator('#editor [contenteditable="true"]').focus();

  // We are unable to trigger the browser paste event in Chrome
  // and the simulated paste event does not work in FireFox.
  if (browserName === "firefox") {
    await triggerPaste(page, text);
  } else {
    await simulatePaste(page, text);
  }
}

test("parses pasted markdown", async ({ page, browserName }) => {
  await expect(page.locator('#editor [src="/example.jpg"]')).toHaveCount(1);
  await paste(page, browserName, "[Image: example.jpg]");
  await expect(page.locator('#editor [src="/example.jpg"]')).toHaveCount(2);
});

test("invalid markdown is pasted with placeholder", async ({
  page,
  browserName,
}) => {
  await paste(page, browserName, "[Image: example-2.jpg]");
  await expect(
    page.locator(".visual-editor__highlight--image-error"),
  ).toHaveCount(2);
  await page.locator(".visual-editor__highlight--image-error").first().click();
  await expect(page.getByText("Image not found.")).toBeVisible();
});
