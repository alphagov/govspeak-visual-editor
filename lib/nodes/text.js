export const name = "text";

export const schema = {
  group: "inline",
};
export const toGovspeak = (state, node) => {
  state.text(node.text, !state.inAutolink);
};
