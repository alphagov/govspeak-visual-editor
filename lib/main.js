import "../scss/style.scss";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { DOMParser } from "prosemirror-model";
import constructMarkdownSerializer from "./markdown";
import constructSchema from "./schema";
import plugins from "./plugins";

class GovspeakVisualEditor {
  constructor(content, editor, govspeak, options) {
    const schema = constructSchema(options);
    const markdownSerializer = constructMarkdownSerializer(options);

    const state = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(content),
      plugins: plugins(schema, options),
    });

    window.view = new EditorView(editor, {
      state,
      dispatchTransaction(transaction) {
        const newState = window.view.state.apply(transaction);
        window.view.updateState(newState);
        govspeak.value = markdownSerializer.serialize(window.view.state.doc);
      },
    });

    govspeak.value = markdownSerializer.serialize(window.view.state.doc);
  }
}

window.GovspeakVisualEditor = GovspeakVisualEditor;
