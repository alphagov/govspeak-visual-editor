import { expect, test } from "vitest";
import { doc, p, builders } from "prosemirror-test-builder";
import constructMarkdownSerializer from "./markdown";
import constructSchema from "../lib/schema.js";

const {
  address,
  call_to_action,
  contact,
  example_callout,
  image,
  information_callout,
  warning_callout,
  link,
  steps,
} = builders(constructSchema({ images: [] }));

const markdownSerializer = constructMarkdownSerializer();

test("Custom nodes", () => {
  const state = doc(
    address(p("address")),
    call_to_action(p("call to action")),
    contact(p("contact")),
    example_callout("example callout"),
    image({ markdown: "[Image: example.jpg]" }),
    information_callout("information callout"),
    warning_callout("warning callout"),
  );

  expect(markdownSerializer.serialize(state)).toMatchSnapshot();
});

test("Links and email links", () => {
  const state = doc(
    p(link({ href: "example.com" }, "link")),
    p(link({ href: "mailto:contact@example.com" }, "contact@example.com")),
    p(link({ href: "mailto:contact@example.com" }, "link")),
  );

  expect(markdownSerializer.serialize(state)).toMatchSnapshot();
});

test("Steps", () => {
  const state = doc(steps(p("step1"), p("step2"), p("step3")));

  expect(markdownSerializer.serialize(state)).toMatchSnapshot();
});
