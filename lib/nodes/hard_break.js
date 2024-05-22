export const name = "hard_break";

export const schema = {
  inline: true,
  group: "inline",
  selectable: false,
  parseDOM: [{ tag: "br" }],
  toDOM() {
    return ["br"];
  },
};
export const toGovspeak = (state, node, parent, index) => {
  state.write("\n");
};
