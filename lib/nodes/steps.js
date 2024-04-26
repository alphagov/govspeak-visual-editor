import { wrapIn } from "prosemirror-commands";
import { wrappingInputRule } from "prosemirror-inputrules";

export const name = "steps";

export const schema = {
  content: "list_item+",
  group: "block",
  parseDOM: [
    {
      tag: "ol.steps",
    },
  ],
  toDOM() {
    return ["ol", { class: "steps" }, 0];
  },
};

export const buildMenuItemCommand = (nodeSchema) => wrapIn(nodeSchema);

export const buildMenuItemDom = () => {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "Steps";
  button.textContent = "s1.";
  button.type = "button";
  return button;
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
