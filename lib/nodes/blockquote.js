export const name = "blockquote";

export const schema = {
  content: "paragraph+",
  group: "block",
  parseDOM: [{ tag: "blockquote" }],
  toDOM() {
    return ["blockquote", 0];
  },
};

export function serializer() {
  return (state, node) => {
    state.wrapBlock("> ", null, node, () => state.renderContent(node));
  };
}
