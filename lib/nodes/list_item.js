export const name = "list_item";

export const schema = {
  content: "paragraph paragraph*",
  defining: true,
  parseDOM: [{ tag: "li" }],
  toDOM() {
    return ["li", 0];
  },
};

export const toGovspeak = (state, node) => {
  state.renderContent(node);
};
