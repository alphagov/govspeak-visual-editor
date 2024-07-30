export const name = "text";

export function schema() {
  return {
    group: "inline",
  };
}

export function toGovspeak() {
  return (state, node) => {
    state.text(node.text, !state.inAutolink);
  };
}
