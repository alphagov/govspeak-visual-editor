export const name = "bullet_list";

export function schema() {
  return {
    content: "list_item+",
    group: "block",
    attrs: { tight: { default: true } },
    parseDOM: [
      {
        tag: "ul",
      },
    ],
    toDOM(node) {
      return ["ul", 0];
    },
  };
}

export function toGovspeak() {
  return (state, node) => {
    state.renderList(node, "", () => (node.attrs.bullet || "*") + " ");
  };
}
