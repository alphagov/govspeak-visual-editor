export const name = "warning_callout";

export const schema = {
  content: "inline*",
  group: "block",
  defining: true,
  parseDOM: [
    {
      tag: `div.application-notice.help-notice[role="note"][aria-label="Warning"]`,
    },
  ],
  toDOM() {
    return ["div", { class: "application-notice help-notice" }, ["p", 0]];
  },
};

export function serializer() {
  return (state, node) => {
    state.write("%");
    state.renderInline(node, false);
    state.write("%");
    state.closeBlock(node);
  };
}
