import { wrapIn } from "prosemirror-commands";
import { wrappingInputRule } from "prosemirror-inputrules";

export const name = "example_callout";

export const schema = {
  content: "block+",
  group: "block",
  defining: true,
  parseDOM: [{ tag: `div.example` }],
  toDOM() {
    return ["div", { class: "example" }, 0];
  },
};

export const buildMenuItemCommand = (nodeSchema) => wrapIn(nodeSchema);

export const buildMenuItemDom = () => {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "Example callout";
  button.textContent = "$E";
  button.type = "button";
  return button;
};

export const inputRules = (schema) => [
  // $E Example callout
  wrappingInputRule(/^\$E\s$/, schema.nodes[name]),
];

export const toGovspeak = (state, node) => {
  state.write("$E\n\n");
  state.renderInline(node);
  state.write("$E");
  state.closeBlock(node);
};
