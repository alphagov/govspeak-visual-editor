import './scss/style.scss'

import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { DOMParser } from "prosemirror-model"
import { markdownSerializer} from "./src/markdown"
import schema from "./src/schema"
import plugins from "./src/plugins"

export default class GovspeakVisualEditor {
  constructor (content, editor, govspeak) {
    let state = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(content),
      plugins: plugins({ schema })
    })

    window.view = new EditorView(editor, {
      state,
      dispatchTransaction(transaction) {
        let newState = view.state.apply(transaction)
        view.updateState(newState)
        govspeak.textContent = markdownSerializer.serialize(window.view.state.doc)
      }
    })

    govspeak.textContent = markdownSerializer.serialize(window.view.state.doc)
  }
}
