import { test, expect } from "@playwright/test";

// TODO: set up host as env var
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

test("renders components from index file in the editable view", async ({
  page,
}) => {
  await expect(page.locator(".address:visible")).toHaveText(
    /HM Revenue and Customs/,
  );
  await expect(page.locator(".call-to-action:visible")).toHaveText(
    "Call to action",
  );
  await expect(page.locator(".contact:visible")).toHaveText(
    /Financial Conduct Authority/,
  );
  await expect(page.locator(".example:visible")).toHaveText(
    /This is an example callout/,
  );
  await expect(
    page.locator(".application-notice.info-notice:visible"),
  ).toHaveText(/This is an information callout/);
  await expect(
    page.locator(".application-notice.help-notice:visible"),
  ).toHaveText(/This is a warning callout/);
});
