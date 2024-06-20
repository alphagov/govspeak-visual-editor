import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

const parentIsType = (type, head) => {
  const parentDepth = head.depth - 1;
  return head.node(parentDepth).type === type;
};

function renderTooltip() {
  const tooltipWrapper = document.createElement("div");
  tooltipWrapper.className = "tooltip-wrapper";
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip govuk-body";
  tooltip.textContent = "Press return again to exit"
  tooltipWrapper.appendChild(tooltip);
  return tooltipWrapper;
}

const positionIsAtEndInParagraph = (head, schema) => {
  // debugger;
  return (
    !parentIsType(schema.nodes.doc, head) && 
    (head.nodeBefore &&
    head.nodeBefore.type === schema.nodes.hard_break || head.node().type === schema.nodes.paragraph && head.node().textContent === '')  &&
    head.parentOffset === head.parent.content.size
  );
};

function inlineHelpDecorations(state, schema) {
  if (!state.selection.empty || !positionIsAtEndInParagraph(state.selection.$head, schema)) return null;
  return DecorationSet.create(state.doc, [
    Decoration.widget(state.selection.head, renderTooltip()),
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
