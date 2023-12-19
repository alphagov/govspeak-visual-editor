import './style.scss'

import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { DOMParser } from "prosemirror-model"
import schema from "./src/schema"
import plugins from "./src/plugins"
import FootnoteView from "./src/nodes/footnote/FootnoteView"

window.view = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content")),
    plugins: plugins({ schema })
  })
})

window.view = new EditorView(document.querySelector("#editor"), {
  state,
  nodeViews: {
    footnote(node, view, getPos) { return new FootnoteView(node, view, getPos) }
  }
})
