export const name = "footnote"

export const schema = {
  content: "text*",
  group: "inline",
  inline: true,
  atom: true,
  toDOM: () => ["footnote", 0],
  parseDOM: [{ tag: "footnote" }],
}

export const buildMenu = ({ menu, schema }) => { }

export const inputRules = (schema) => ([])
