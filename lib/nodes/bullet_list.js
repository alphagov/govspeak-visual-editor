import { wrapIn } from "prosemirror-commands";

export const name = "bullet_list";

export const schema = {
  content: "list_item+",
  group: "block",
  attrs: { tight: { default: false } },
  parseDOM: [
    {
      tag: "ul",
      getAttrs: (dom) => ({ tight: dom.hasAttribute("data-tight") }),
    },
  ],
  toDOM(node) {
    return ["ul", { "data-tight": node.attrs.tight ? "true" : null }, 0];
  },
};

export const buildMenuItemCommand = (nodeSchema) => wrapIn(nodeSchema);

export const buildMenuItemDom = () => {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "Bullet list";
  button.textContent = "-";
  button.type = "button";
  return button;
};
export const toGovspeak = (state, node) => {
  state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ");
};
