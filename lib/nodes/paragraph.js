import { setBlockType } from "prosemirror-commands";

export const name = "paragraph";

export const schema = {
  content: "inline*",
  group: "block",
  parseDOM: [{ tag: "p" }],
  toDOM() {
    return ["p", 0];
  },
};

export const buildMenuItemCommand = (nodeSchema) => setBlockType(nodeSchema);

export const buildMenuItemDom = () => {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "Paragraph";
  button.textContent = "p";
  button.type = "button";
  return button;
};
export const toGovspeak = (state, node) => {
  state.renderInline(node);
  state.closeBlock(node);
};
