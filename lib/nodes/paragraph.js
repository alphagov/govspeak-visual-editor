export const name = "paragraph";

export const schema = {
  content: "inline*",
  group: "block",
  parseDOM: [{ tag: "p" }],
  toDOM() {
    return ["p", 0];
  },
};

export function serializer() {
  return (state, node) => {
    state.renderInline(node);
    state.closeBlock(node);
  };
}
