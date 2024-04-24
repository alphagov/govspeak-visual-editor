import { wrapIn } from "prosemirror-commands";

export const name = "blockquote";

export const schema = {
  content: "paragraph+",
  group: "block",
  parseDOM: [{ tag: "blockquote" }],
  toDOM() {
    return ["blockquote", 0];
  },
};

export const buildMenuItemCommand = (nodeSchema) => wrapIn(nodeSchema);

export const buildMenuItemDom = () => {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "Blockquote";
  button.textContent = "“”";
  button.type = "button";
  return button;
};
export const toGovspeak = (state, node) => {
  state.wrapBlock("> ", null, node, () => state.renderContent(node));
};
