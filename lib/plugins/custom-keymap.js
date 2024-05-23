import { Selection } from "prosemirror-state";
import { keymap } from "prosemirror-keymap";
import { chainCommands, } from "prosemirror-commands";

const newlineInAddress = (schema) => {
  return (state, dispatch) => {
    const { $head, $anchor } = state.selection;
    if (!$head.sameParent($anchor)) return false;

    const paragraphParent = $head.node($head.depth - 1);
    if (!(paragraphParent.type === schema.nodes.address)) return false;

    if (
      $head.nodeBefore.type === schema.nodes.hard_break &&
      $head.parentOffset === $head.parent.content.size
    ) {
      const pos = $head.after();
      const tr = state.tr.deleteRange(pos - 2, pos);
      tr.replaceWith(pos - 2, pos - 2, schema.nodes.paragraph.createAndFill());
      tr.setSelection(Selection.near(tr.doc.resolve(pos - 1), 1));
      dispatch(tr.scrollIntoView());
      return false;
    }

    const hardBreak = schema.node("hard_break");
    dispatch(state.tr.replaceSelectionWith(hardBreak).scrollIntoView());
    return true;
  };
};

export default function customKeymap(schema) {
  return keymap({
    "Shift-Enter": chainCommands(
      newlineInAddress(schema),
    ),
    "Mod-Enter": chainCommands(
      newlineInAddress(schema),
    ),
    "Ctrl-Enter": chainCommands(
      newlineInAddress(schema),
    ),
    Enter: newlineInAddress(schema),
  });
}
