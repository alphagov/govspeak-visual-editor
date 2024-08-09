export const name = "example_callout";

export function schema() {
  return {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{ tag: `div.example` }],
    toDOM() {
      return ["div", { class: "example" }, 0];
    },
  };
}

export function serializer() {
  return (state, node) => {
    state.write("$E\n\n");
    state.renderInline(node);
    state.write("$E");
    state.closeBlock(node);
  };
}
