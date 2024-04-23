import { wrapIn } from "prosemirror-commands";

export const name = "ordered_list";

export const schema = {
  content: "list_item+",
  group: "block",
  attrs: { order: { default: 1 } },
  parseDOM: [
    {
      tag: "ol",
      getAttrs(dom) {
        return {
          order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1,
        };
      },
    },
  ],
  toDOM(node) {
    return node.attrs.order === 1
      ? ["ol", 0]
      : ["ol", { start: node.attrs.order }, 0];
  },
};

export const buildMenuItemCommand = (nodeSchema) => wrapIn(nodeSchema);

export const buildMenuItemDom = () => {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "Ordered list";
  button.textContent = "1.";
  button.type = "button";
  return button;
};
export const toGovspeak = (state, node) => {
  const start = node.attrs.order || 1;
  const maxW = String(start + node.childCount - 1).length;
  const space = state.repeat(" ", maxW + 2);
  state.renderList(node, space, (i) => {
    const nStr = String(start + i);
    return state.repeat(" ", maxW - nStr.length) + nStr + ". ";
  });
};
