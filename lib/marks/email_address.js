export const name = "email_address";

export const schema = {
  attrs: {
    email: {},
    // think I need a title here
  },
  inclusive: false,
  // ask Dan about inclusive, not sure exactly what it does
  parseDOM: [
    {
      tag: "a[href^='mailto:']",
      getAttrs(dom) {
        return {
          email: dom.getAttribute("href").replace(/^mailto:/, ""),
        };
      },
    },
  ],
  toDOM(node) {
    return ["a", { href: `mailto:${node.attrs.email}` }];
  },
};

export const serializerSpec = {
  open(state, mark, parent, index) {
    return "<";
  },
  close(state, mark, parent, index) {
    const { email } = mark.attrs;
    return `${email}>`;
    // confirm the open and close functions are always used together
  },
  mixable: true,
  // do we want mixable to be true?
};

// Does link.js's autolink < > behaviour interact with email markdown? What circumstances is it used?