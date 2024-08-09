import Tooltip from "../components/tooltip";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

function renderTooltip() {
  const ul = document.createElement("ul");
  [
    "Save this document",
    "Copy image from the 'Images' tab of this document and paste here",
  ].forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });
  const tooltip = new Tooltip(
    "Image not found. You can try the following: ",
    ul,
  );
  tooltip.error = true;
  tooltip.column = true;
  return tooltip.dom;
}

function imageTooltipDecorations(state, schema, options) {
  if (
    !state.selection.node ||
    state.selection.node.type !== schema.nodes.image ||
    options.images[state.selection.node.attrs.markdown]
  )
    return null;
  return DecorationSet.create(state.doc, [
    Decoration.widget(state.selection.anchor, renderTooltip()),
  ]);
}

export default (schema, options) => {
  return new Plugin({
    props: {
      decorations(state) {
        return imageTooltipDecorations(state, schema, options);
      },
    },
  });
};
