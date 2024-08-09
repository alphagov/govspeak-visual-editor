import placeholder from "../assets/placeholder.jpg";

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
      let src = images[node.attrs.markdown];
      let classes = "";
      if (!src) {
        src = placeholder;
        classes = "visual-editor__block--error";
      }
      return ["img", { src, class: classes }];
    },
  };
}

export function serializer(options) {
  return (state, node) => {
    state.write(node.attrs.markdown);
    state.closeBlock(node);
  };
}
