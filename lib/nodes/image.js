export const name = "image";

export function schema(options) {
  const images = options.images;
  const imagesReverse = Object.fromEntries(
    Object.entries(images).map(([k, v]) => [v, k]),
  );
  return {
    group: "block",
    attrs: { markdown: {} },
    draggable: true,
    parseDOM: [
      {
        tag: "img[src]",
        getAttrs(dom) {
          const src = dom.getAttribute("src");
          const markdown = imagesReverse[src];
          return markdown ? { markdown } : false;
        },
      },
    ],
    toDOM(node) {
      return ["img", { src: images[node.attrs.markdown] }];
    },
  };
}

export function serializer(options) {
  return (state, node) => {
    state.write(node.attrs.markdown);
    state.closeBlock(node);
  };
}
