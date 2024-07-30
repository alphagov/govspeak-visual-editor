export const name = "list_item";

export function schema() {
  return {
    content: "paragraph paragraph*",
    defining: true,
    parseDOM: [{ tag: "li" }],
    toDOM() {
      return ["li", 0];
    },
  };
}

export function toGovspeak() {
  return (state, node) => {
    state.renderContent(node);
  };
}
