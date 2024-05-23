import { Selection } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";

const parentIsType = (type, head) => {
  const parentDepth = head.depth - 1;
  return head.node(parentDepth).type === type;
};

const positionIsAtEndAfterHardBreak = (head, schema) => {
  return (
    head.nodeBefore &&
    head.nodeBefore.type === schema.nodes.hard_break &&
    head.parentOffset === head.parent.content.size
  );
};

const replaceHardBreakWithParagraph = (position, schema, state) => {
  const transaction = state.tr;
  const positionBeforeHardBreak = position - 2;
  return transaction
    .replaceWith(
      positionBeforeHardBreak,
      position,
      schema.nodes.paragraph.createAndFill(),
    )
    .setSelection(Selection.near(transaction.doc.resolve(position - 1), 1))
    .scrollIntoView();
};

const newlineInAddress = (schema) => {
  return (state, dispatch) => {
    const { $head } = state.selection;
    if (!parentIsType(schema.nodes.address, $head)) return false;

    if (positionIsAtEndAfterHardBreak($head, schema)) {
      dispatch(replaceHardBreakWithParagraph($head.after(), schema, state));
      return false; // Let default handler lift the new paragraph out of the address
    }

    dispatch(
      state.tr.replaceSelectionWith(schema.node("hard_break")).scrollIntoView(),
    );
    return true;
  };
};

export default function customKeymap(schema) {
  return keymap({
    "Shift-Enter": false,
    "Mod-Enter": false,
    "Ctrl-Enter": false,
    Enter: newlineInAddress(schema),
  });
}
