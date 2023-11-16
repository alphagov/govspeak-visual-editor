import './style.scss'

import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { DOMParser } from "prosemirror-model"
import { markdownSerializer} from "./src/markdown"
import schema from "./src/schema"
import plugins from "./src/plugins"

let state = EditorState.create({
  doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content")),
  plugins: plugins({ schema })
})

window.view = new EditorView(document.querySelector("#editor"), {
  state,
  dispatchTransaction(transaction) {
    let newState = view.state.apply(transaction)
    view.updateState(newState)
    document.querySelector('pre').textContent = markdownSerializer.serialize(window.view.state.doc)
  }
})

document.querySelector('pre').textContent = markdownSerializer.serialize(window.view.state.doc)
