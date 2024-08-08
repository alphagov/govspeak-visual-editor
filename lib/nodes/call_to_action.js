import { wrappingInputRule } from "prosemirror-inputrules";

export const name = "call_to_action";

export function schema() {
  return {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{ tag: "div.call-to-action" }],
    toDOM() {
      return ["div", { class: "call-to-action" }, 0];
    },
  };
}

export const inputRules = (schema) => [
  // $CTA Call to action
  wrappingInputRule(/^\$CTA\s$/, schema.nodes[name]),
];

export function serializer() {
  return (state, node) => {
    state.write("$CTA\n\n");
    state.renderInline(node);
    state.write("$CTA");
    state.closeBlock(node);
  };
}
