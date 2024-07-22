import { wrappingInputRule } from "prosemirror-inputrules";

export const name = "address";

export function schema() {
  return {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{ tag: "div.address" }],
    toDOM() {
      return ["div", { class: "address" }, 0];
    },
  };
}

export const inputRules = (schema) => [
  // $A Address
  wrappingInputRule(/^\$A\s$/, schema.nodes[name]),
];

export function toGovspeak() {
  return (state, node) => {
    state.write("$A\n");
    state.renderInline(node);
    state.flushClose(1);
    state.write("$A");
    state.closeBlock(node);
  };
}
