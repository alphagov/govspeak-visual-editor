import { expect, test } from 'vitest'
import { builders } from 'prosemirror-test-builder'
import schema from '../lib/schema.js'
import { createEditor, doc, p } from 'jest-prosemirror';
import {EditorState} from "prosemirror-state";
import {EditorView} from "prosemirror-view";

test('displays address', () => {

  // This is one possibility
  // const {address } = builders(schema)
  // const editor = createEditor(doc(address(p("some text"))));


  // Or a more custom step by step thing
  const editor = document.createElement("div")
  const {address } = builders(schema)
  const document1 = doc(address(p("some text")));


  let state = EditorState.create({ doc: document1 })
  let view = new EditorView(editor, {state})
})


// I have seen this pattern a lot where people do their own editor implementation

// let tempView = null
//
// function tempEditor(inProps) {
//   let space = document.querySelector("#workspace")
//   if (tempView) {
//     tempView.destroy()
//     tempView = null
//   }
//
//   let props = {}
//   for (let n in inProps) props[n] = inProps[n]
//   props.state = EditorState.create({doc: props.doc,
//     schema,
//     selection: props.doc && selFor(props.doc),
//     plugins: props.plugins})
//   return tempView = new EditorView(space, props)
// }