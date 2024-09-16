import "../scss/style.scss";

import {EditorState} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {DOMParser} from "prosemirror-model";
import markdownSerializerFromOptions from "./markdown";
import pluginsFromOptions from "./plugins";
import schema from "./schema";
import {fixTables} from "prosemirror-tables";

import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import {unified} from 'unified'

function htmlToMarkdown(html) {
  const file = unified()
    .use(remarkGfm)
    .use(remarkHtml)
    .use(rehypeParse)
    .use(rehypeRemark)
    .use(remarkStringify)
    .processSync(html)

  console.log("HEllo", file)
  return file.value
}

class GovspeakVisualEditor {
  constructor(content, editor, govspeak, options) {
    const markdownSerializer = markdownSerializerFromOptions(options);

    let state = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(content),
      plugins: pluginsFromOptions(schema, options),
    });

    // Normalise tables so they're safe to edit
    const fix = fixTables(state);
    if (fix) state = state.apply(fix.setMeta("addToHistory", false));

    window.view = new EditorView(editor, {
      state,
      dispatchTransaction(transaction) {
        const newState = window.view.state.apply(transaction);
        window.view.updateState(newState);
        govspeak.value = htmlToMarkdown(content.innerHTML);
      },
    });

    govspeak.value = htmlToMarkdown(content.innerHTML);
  }
}

window.GovspeakVisualEditor = GovspeakVisualEditor;
