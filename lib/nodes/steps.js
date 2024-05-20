import { wrappingInputRule } from "prosemirror-inputrules";

export const name = "steps";

export const schema = {
  content: "list_item+",
  group: "block",
  attrs: { tight: { default: true } },
  parseDOM: [
    {
      tag: "ol.steps",
    },
  ],
  toDOM() {
    return ["ol", { class: "steps" }, 0];
  },
};

export const inputRules = (schema) => [
  // s1. steps
  wrappingInputRule(/^s1.\s$/, schema.nodes[name]),
];

export const toGovspeak = (state, node) => {
  state.renderList(node, "", (i) => {
    return "s" + (i + 1) + ". ";
  });
  state.write("\n");
};
