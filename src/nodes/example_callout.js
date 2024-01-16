import {wrapItem} from "prosemirror-menu"
import {wrappingInputRule} from "prosemirror-inputrules"

export const name = "example_callout"

export const schema = {
  content: "block+",
  group: "block",
  defining: true,
  parseDOM: [{ tag: `div.example` }],
  toDOM() { return [ "div", { class: "example" }, 0 ] }
}

export const buildMenu = ({ menu, schema }) => {
  menu.typeMenu.content.push(
    wrapItem(schema.nodes[name], {
      label: "Example callout"
    })
  )
}

export const inputRules = (schema) => ([
  // $E Example callout
  wrappingInputRule(/^\$E\s$/, schema.nodes[name]),
])

export const toGovspeak = (state, node) => {
  state.write("$E\n\n")
  state.renderInline(node)
  state.write("$E")
  state.closeBlock(node)
}
