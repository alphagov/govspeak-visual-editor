export const name = "list_item";

export const schema = {
  content: "paragraph block*",
  defining: true,
  parseDOM: [{ tag: "li" }],
  toDOM() {
    return ["li", 0];
  },
};

export const toGovspeak = (state, node) => {
  state.renderContent(node);
};
