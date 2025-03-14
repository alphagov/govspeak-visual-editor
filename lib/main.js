import "../scss/style.scss";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { DOMParser } from "prosemirror-model";
import markdownSerializerFromOptions from "./markdown";
import pluginsFromOptions from "./plugins";
import schema from "./schema";

class GovspeakVisualEditor {
  constructor(content, editor, govspeak, options) {
    const markdownSerializer = markdownSerializerFromOptions(options);

    const state = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(content),
      plugins: pluginsFromOptions(schema, options),
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
