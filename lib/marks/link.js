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
    state.inEmail = isEmail(mark, parent, index)
    return state.inEmail ? "<" : "[";
  },
  close(state, mark, parent, index) {
    const { inEmail } = state;
    state.inEmail = undefined;
    return inEmail ? ">" : (
      "](" +
      mark.attrs.href.replace(/[()"]/g, "\\$&") +
      (mark.attrs.title ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"` : "") +
      ")"
    );
  },
  mixable: true,
};

function isEmail(mark, parent, index) {
  if (!mark.attrs.href.startsWith("mailto:")) return false
  const content = parent.child(index).text;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(content)
}
