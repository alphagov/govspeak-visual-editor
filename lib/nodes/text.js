export const name = "text";

export const schema = {
  group: "inline",
};

export function serializer() {
  return (state, node) => {
    state.text(node.text, !state.inAutolink);
  };
}
