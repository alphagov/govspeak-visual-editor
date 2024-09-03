import placeholder from "../assets/placeholder.jpg";

export const name = "image";

export const schema = {
  group: "block",
  attrs: { markdown: {}, src: { default: placeholder } },
  draggable: true,
  parseDOM: [
    {
      tag: "img[src]",
      getAttrs(dom) {
        return {
          src: dom.getAttribute("src"),
          markdown: null,
        };
      },
    },
  ],
  toDOM(node) {
    return ["img", { src: node.attrs.src }];
  },
};

export function serializer(options) {
  return (state, node) => {
    state.write(node.attrs.markdown || options.images[node.attrs.src]);
    state.closeBlock(node);
  };
}
