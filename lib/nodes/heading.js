export const name = "heading";

export const schema = {
  attrs: { level: { default: 2 } },
  content: "text*",
  marks: "",
  defining: true,
  parseDOM: [
    { tag: "h2", attrs: { level: 2 } },
    { tag: "h3", attrs: { level: 3 } },
    { tag: "h4", attrs: { level: 4 } },
    { tag: "h5", attrs: { level: 5 } },
    { tag: "h6", attrs: { level: 6 } },
  ],
  toDOM(node) {
    return ["h" + node.attrs.level, 0];
  },
};

export function serializer() {
  return (state, node) => {
    state.write(state.repeat("#", node.attrs.level) + " ");
    state.renderInline(node, false);
    state.closeBlock(node);
  };
}
