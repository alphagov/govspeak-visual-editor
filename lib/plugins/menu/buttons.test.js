import { expect, test } from "vitest";
import {
  bulletListMenuItem,
  emailLinkMenuItem,
  linkMenuItem,
  orderedListMenuItem,
  redoMenuItem,
  undoMenuItem,
} from "./buttons.js";
import schema from "../../schema";

test("GA4 Tracking is set for bulletList button", () => {
  const bulletListButton = bulletListMenuItem(schema);
  expect(
    JSON.parse(bulletListButton.dom.getAttribute("data-ga4-event")).text,
  ).to.equal("Bullet list");
});

test("GA4 Tracking is set for orderedList button", () => {
  const orderedListButton = orderedListMenuItem(schema);
  expect(
    JSON.parse(orderedListButton.dom.getAttribute("data-ga4-event")).text,
  ).to.equal("Ordered list");
});

test("GA4 Tracking is set for link button", () => {
  const linkButton = linkMenuItem(schema);
  expect(
    JSON.parse(linkButton.dom.getAttribute("data-ga4-event")).text,
  ).to.equal("Link");
});

test("GA4 Tracking is set for emailLink button", () => {
  const emailLinkButton = emailLinkMenuItem(schema);
  expect(
    JSON.parse(emailLinkButton.dom.getAttribute("data-ga4-event")).text,
  ).to.equal("Email link");
});

test("GA4 Tracking is set for undo button", () => {
  const undoButton = undoMenuItem(schema);
  expect(
    JSON.parse(undoButton.dom.getAttribute("data-ga4-event")).text,
  ).to.equal("Undo");
});

test("GA4 Tracking is set for redo button", () => {
  const redoButton = redoMenuItem(schema);
  expect(
    JSON.parse(redoButton.dom.getAttribute("data-ga4-event")).text,
  ).to.equal("Redo");
});
