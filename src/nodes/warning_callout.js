import { blockTypeItem } from "prosemirror-menu"
import { textblockTypeInputRule } from "prosemirror-inputrules"

export const name = "warning_callout"

export const schema = {
  content: "inline*",
  group: "block",
  defining: true,
  parseDOM: [{ tag: `div.application-notice.help-notice[role="note"][aria-label="Warning"]` }],
  toDOM() { return ["div", { class: "application-notice help-notice" }, ["p", 0]] }
}

export const buildMenu = ({ menu, schema }) => {
  menu.typeMenu.content.push(
    blockTypeItem(schema.nodes[name], {
      label: "Warning callout"
    })
  )
}

export const inputRules = (schema) => ([
  // % Warning callout
  textblockTypeInputRule(/^%\s$/, schema.nodes[name]),
])
