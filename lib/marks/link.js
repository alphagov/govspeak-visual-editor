export const name = "link";

export const schema = {
  attrs: {
    href: {},
    title: { default: null },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: "a[href]",
      getAttrs(dom) {
        return {
          href: dom.getAttribute("href"),
          title: dom.getAttribute("title"),
        };
      },
    },
  ],
  toDOM(node) {
    return ["a", node.attrs];
  },
};

export const serializerSpec = {
  open(state, mark, parent, index) {
    return "[";
  },
  close(state, mark, parent, index) {
    return (
      "](" +
      mark.attrs.href.replace(/[()"]/g, "\\$&") +
      (mark.attrs.title ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"` : "") +
      ")"
    );
  },
  mixable: true,
};
