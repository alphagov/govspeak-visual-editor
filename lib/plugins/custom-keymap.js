import { Selection } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { baseKeymap, chainCommands } from "prosemirror-commands";
import { splitListItem } from "prosemirror-schema-list";

const paragraphParentIsType = (type, head) => {
  const paragraphParentDepth = head.depth - 1;
  return head.node(paragraphParentDepth).type === type;
};

const positionIsAtTheEndAfterABreak = (head, schema) => {
  if (!head.nodeBefore) return true;
  return (
    head.nodeBefore.type === schema.nodes.hard_break &&
    head.parentOffset === head.parent.content.size
  );
};

const exitEndOfBlock = (position, schema, state) => {
  const transaction = state.tr;
  return transaction
    .replaceWith(position - 2, position, schema.nodes.paragraph.createAndFill())
    .setSelection(Selection.near(transaction.doc.resolve(position - 1), 1))
    .scrollIntoView();
};

const newlineInAddress = (schema, attributes) => {
  return (state, dispatch) => {
    const { $head } = state.selection;

    if (!paragraphParentIsType(schema.nodes.address, $head)) return false;

    if (
      attributes.exitEndOfBlock &&
      positionIsAtTheEndAfterABreak($head, schema)
    ) {
      dispatch(exitEndOfBlock($head.after(), schema, state));
      return false;
    }

    dispatch(
      state.tr.replaceSelectionWith(schema.node("hard_break")).scrollIntoView(),
    );
    return true;
  };
};

const removeListItem = (schema) => {
  return (state, dispatch) => {
    const { $head } = state.selection;
    if (!paragraphParentIsType(schema.nodes.list_item, $head)) return false;
    if (!$head.nodeBefore && !$head.nodeAfter) {
      const transaction = state.tr;
      const position = $head.before();

      dispatch(
        transaction
          .deleteRange(position - 2, $head.after())
          .setSelection(
            Selection.near(transaction.doc.resolve(position - 3)),
            1,
          )
          .scrollIntoView(),
      );
      return true;
    }
  };
};

export default function customKeymap(schema) {
  const modifiedEnterBehaviour = chainCommands(
    newlineInAddress(schema, { exitEndOfBlock: false }),
    splitListItem(schema.nodes.list_item),
    baseKeymap.Enter,
  );

  return keymap({
    "Shift-Enter": modifiedEnterBehaviour,
    "Mod-Enter": modifiedEnterBehaviour,
    "Ctrl-Enter": modifiedEnterBehaviour,
    Enter: newlineInAddress(schema, { exitEndOfBlock: true }),
    Backspace: removeListItem(schema),
  });
}
