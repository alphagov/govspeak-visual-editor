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
  for (let i = index + 1; i < parent.childCount; i++)
    if (parent.child(i).type !== node.type) {
      state.write("\\\n");
      return;
    }
};
