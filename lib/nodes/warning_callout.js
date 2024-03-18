import { setBlockType } from "prosemirror-commands";
import { textblockTypeInputRule } from "prosemirror-inputrules";

export const name = "warning_callout";

export const schema = {
  content: "inline*",
  group: "block",
  defining: true,
  parseDOM: [
    {
      tag: `div.application-notice.help-notice[role="note"][aria-label="Warning"]`,
    },
  ],
  toDOM() {
    return ["div", { class: "application-notice help-notice" }, ["p", 0]];
  },
};

export const buildMenuItemCommand = (nodeSchema) => setBlockType(nodeSchema);

export const buildMenuItemDom = () => {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "Warning callout";
  button.textContent = "%";
  button.type = "button";
  return button;
};

export const inputRules = (schema) => [
  // % Warning callout
  textblockTypeInputRule(/^%\s$/, schema.nodes[name]),
];

export const toGovspeak = (state, node) => {
  state.write("%");
  state.renderInline(node, false);
  state.write("%");
  state.closeBlock(node);
};
