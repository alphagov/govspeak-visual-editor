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
    state.inAutolink = isPlainURL(mark, parent, index);
    return state.inAutolink ? "<" : "[";
  },
  close(state, mark, parent, index) {
    const { inAutolink } = state;
    state.inAutolink = undefined;
    return inAutolink
      ? ">"
      : "](" +
          mark.attrs.href.replace(/[()"]/g, "\\$&") +
          (mark.attrs.title
            ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"`
            : "") +
          ")";
  },
  mixable: true,
};

function isPlainURL(link, parent, index) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false;
  const content = parent.child(index);
  if (
    !content.isText ||
    content.text !== link.attrs.href ||
    content.marks[content.marks.length - 1] !== link
  )
    return false;
  return (
    index === parent.childCount - 1 ||
    !link.isInSet(parent.child(index + 1).marks)
  );
}
