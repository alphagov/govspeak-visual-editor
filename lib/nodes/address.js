import { wrapIn } from "prosemirror-commands";
import { wrappingInputRule } from "prosemirror-inputrules";

export const name = "address";

export const schema = {
  content: "block+",
  group: "block",
  defining: true,
  parseDOM: [{ tag: "div.address" }],
  toDOM() {
    return ["div", { class: "address" }, 0];
  },
};

export const buildMenuItemCommand = (nodeSchema) => wrapIn(nodeSchema);

export const buildMenuItemDom = () => {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "Address";
  button.textContent = "$A";
  button.type = "button";
  return button;
};

export const inputRules = (schema) => [
  // $A Address
  wrappingInputRule(/^\$A\s$/, schema.nodes[name]),
];

export const toGovspeak = (state, node) => {
  state.write("$A\n\n");
  state.renderInline(node);
  state.write("$A");
  state.closeBlock(node);
};
