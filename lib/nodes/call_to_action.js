import { wrapIn } from "prosemirror-commands";
import { wrappingInputRule } from "prosemirror-inputrules";

export const name = "call_to_action";

export const schema = {
  content: "block+",
  group: "block",
  defining: true,
  parseDOM: [{ tag: "div.call-to-action" }],
  toDOM() {
    return ["div", { class: "call-to-action" }, 0];
  },
};
export const buildMenuItemCommand = (nodeSchema) => wrapIn(nodeSchema);

export const buildMenuItemDom = () => {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "Call to Action";
  button.textContent = "$CTA";
  button.type = "button";
  return button;
};

export const inputRules = (schema) => [
  // $CTA Call to action
  wrappingInputRule(/^\$CTA\s$/, schema.nodes[name]),
];

export const toGovspeak = (state, node) => {
  state.write("$CTA\n\n");
  state.renderInline(node);
  state.write("$CTA");
  state.closeBlock(node);
};
