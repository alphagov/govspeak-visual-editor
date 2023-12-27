import { wrapItem } from "prosemirror-menu"
import { wrappingInputRule } from "prosemirror-inputrules"

export const name = "address"

export const schema = {
  content: "block+",
  group: "block",
  defining: true,
  parseDOM: [{ tag: "div.address" }],
  toDOM() { return ["div", { class: "address" }, 0] }
}

export const buildMenu = ({ menu, schema }) => {
  menu.typeMenu.content.push(
    wrapItem(schema.nodes[name], {
      label: "Address"
    })
  )
}

export const inputRules = (schema) => ([
  // $A Address
  wrappingInputRule(/^\$A\s$/, schema.nodes[name]),
])

export const toGovspeak = (state, node) => {
  state.write("$A\n\n")
  state.renderInline(node)
  state.write("$A")
  state.closeBlock(node)
}
