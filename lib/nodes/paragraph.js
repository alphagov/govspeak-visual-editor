export const name = "paragraph";

export const schema = {
  content: "inline*",
  group: "block",
  parseDOM: [{ tag: "p" }],
  toDOM() {
    return ["p", 0];
  },
};

export const toGovspeak = (state, node) => {
  state.renderInline(node);
  state.closeBlock(node);
};
