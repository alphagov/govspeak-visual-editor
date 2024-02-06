import '../scss/style.scss'

import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { DOMParser } from "prosemirror-model"
import { markdownSerializer } from "./markdown"
import schema from "./schema"
import plugins from "./plugins"

class GovspeakVisualEditor {
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
        govspeak.value = markdownSerializer.serialize(window.view.state.doc)
      }
    })

    govspeak.value = markdownSerializer.serialize(window.view.state.doc)
  }
}

window.GovspeakVisualEditor = GovspeakVisualEditor
