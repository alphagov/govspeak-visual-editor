import Tooltip from "../components/tooltip";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

const parentIsType = (type, head) => {
  const parentDepth = head.depth - 1;
  return head.node(parentDepth).type === type;
};

const positionIsAtEndInParagraph = (head, schema) => {
  const notTopLevel = !parentIsType(schema.nodes.doc, head);
  const endOfBlockAfterHardBreak =
    head.nodeBefore &&
    head.nodeBefore.type === schema.nodes.hard_break &&
    head.parentOffset === head.parent.content.size;
  const inEmptyParagraph =
    head.node().type === schema.nodes.paragraph &&
    head.node().textContent === "";
  return notTopLevel && (endOfBlockAfterHardBreak || inEmptyParagraph);
};

function inlineHelpDecorations(state, schema) {
  if (
    !state.selection.empty ||
    !positionIsAtEndInParagraph(state.selection.$head, schema)
  )
    return null;
  return DecorationSet.create(state.doc, [
    Decoration.widget(
      state.selection.head,
      new Tooltip("Press return a second time to exit the block").dom,
    ),
  ]);
}

export default function inlineHelp(schema) {
  return new Plugin({
    props: {
      decorations(state) {
        return inlineHelpDecorations(state, schema);
      },
    },
  });
}
