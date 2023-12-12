import './style.scss'

import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { DOMParser } from "prosemirror-model"
import schema from "./src/schema"
import plugins from "./src/plugins"
import { fixTables } from "prosemirror-tables"

let state = EditorState.create({
  doc: DOMParser.fromSchema(schema).parse(document.querySelector("#content")),
  plugins: plugins({ schema })
})

// Normalise tables so they're safe to edit
const fix = fixTables(state);
if (fix) state = state.apply(fix.setMeta('addToHistory', false));

window.view = new EditorView(document.querySelector("#editor"), { state })
