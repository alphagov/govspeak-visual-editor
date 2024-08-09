export const name = "steps";

export function schema() {
  return {
    content: "list_item+",
    group: "block",
    attrs: { tight: { default: true } },
    parseDOM: [
      {
        tag: "ol.steps",
      },
    ],
    toDOM() {
      return ["ol", { class: "steps" }, 0];
    },
  };
}

export function serializer() {
  return (state, node) => {
    state.renderList(node, "", (i) => {
      return "s" + (i + 1) + ". ";
    });
    state.write("\n");
  };
}
