export const name = "hard_break";

export function schema() {
  return {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{ tag: "br" }],
    toDOM() {
      return ["br"];
    },
  };
}

export function toGovspeak() {
  return (state, node) => {
    state.write("\n");
  };
}
