export const name = "contact";

export const schema = {
  content: "paragraph+",
  group: "block",
  defining: true,
  parseDOM: [{ tag: `div.contact[role="contact"][aria-label="Contact"]` }],
  toDOM() {
    return ["div", { class: "contact" }, ["p", 0]];
  },
};

export const toGovspeak = (state, node) => {
  state.write("$C\n\n");
  state.renderInline(node);
  state.write("$C");
  state.closeBlock(node);
};
