import { expect, test } from "vitest";
import { doc, p, builders } from "prosemirror-test-builder";
import { markdownSerializer } from "./markdown";
import schema from "../lib/schema.js";

const {
  address,
  call_to_action,
  contact,
  example_callout,
  information_callout,
  warning_callout,
} = builders(schema);

test("Custom nodes", () => {
  const state = doc(
    address(p("address")),
    call_to_action(p("call to action")),
    contact(p("contact")),
    example_callout("example callout"),
    information_callout("information callout"),
    warning_callout("warning callout"),
  );

  expect(markdownSerializer.serialize(state)).toMatchSnapshot();
});
