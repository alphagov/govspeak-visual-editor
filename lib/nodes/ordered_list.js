export const name = "ordered_list";

export function schema() {
  return {
    content: "list_item+",
    group: "block",
    attrs: { tight: { default: true } },
    parseDOM: [
      {
        tag: "ol",
      },
    ],
    toDOM(node) {
      return ["ol", 0];
    },
  };
}

export function serializer() {
  return (state, node) => {
    state.renderList(node, "", (i) => `${i + 1}. `);
  };
}
