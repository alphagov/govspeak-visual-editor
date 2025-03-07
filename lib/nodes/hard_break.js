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

export function serializer() {
  return (state, node) => {
    state.write("\n");
  };
}
