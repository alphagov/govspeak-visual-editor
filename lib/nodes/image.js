export const name = "image";

export function schema(options) {
  const images = options.images;
  const imagesReverse = Object.fromEntries(
    Object.entries(images).map(([k, v]) => [v, k]),
  );
  return {
    group: "block",
    attrs: { src: {} },
    draggable: true,
    parseDOM: [
      {
        tag: "img[src]",
        getAttrs(dom) {
          const src = dom.getAttribute("src");
          return imagesReverse[src] ? { src } : false;
        },
      },
    ],
    toDOM(node) {
      return ["img", node.attrs];
    },
  };
}

export function toGovspeak(options) {
  return (state, node) => {
    const images = options.images;
    const imagesReverse = Object.fromEntries(
      Object.entries(images).map(([k, v]) => [v, k]),
    );
    state.write(`[Image: ${imagesReverse[node.attrs.src]}]`);
    state.closeBlock(node);
  };
}
