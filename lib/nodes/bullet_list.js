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

export const toGovspeak = (state, node) => {
  state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ");
};
