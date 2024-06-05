export const name = "information_callout";

export const schema = {
  content: "inline*",
  group: "block",
  defining: true,
  parseDOM: [
    {
      tag: `div.application-notice.info-notice[role="note"][aria-label="Information"]`,
    },
  ],
  toDOM() {
    return ["div", { class: "application-notice info-notice" }, ["p", 0]];
  },
};

export const toGovspeak = (state, node) => {
  state.write("^");
  state.renderInline(node, false);
  state.write("^");
  state.closeBlock(node);
};
