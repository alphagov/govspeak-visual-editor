import { wrapIn } from "prosemirror-commands";
import { wrappingInputRule } from "prosemirror-inputrules";

export const name = "contact";

export const schema = {
  content: "block+",
  group: "block",
  defining: true,
  parseDOM: [{ tag: `div.contact[role="contact"][aria-label="Contact"]` }],
  toDOM() {
    return ["div", { class: "contact" }, ["p", 0]];
  },
};

export const buildMenuItemCommand = (nodeSchema) => wrapIn(nodeSchema);

export const buildMenuItemDom = () => {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "Contact";
  button.textContent = "$C";
  button.type = "button";
  return button;
};

export const inputRules = (schema) => [
  // $C Contact
  wrappingInputRule(/^\$C\s$/, schema.nodes[name]),
];

export const toGovspeak = (state, node) => {
  state.write("$C\n\n");
  state.renderInline(node);
  state.write("$C");
  state.closeBlock(node);
};
