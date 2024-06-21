import Tooltip from "../components/tooltip";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

function renderTooltip(href) {
  const textContent = href.startsWith("mailto:") ? "Email: " : "Link: ";

  const a = document.createElement("a");
  a.className = "visual-editor__tooltip-link";
  a.href = href;
  a.target = "_blank";
  a.textContent = href.startsWith("mailto:") ? href.slice(7) : href;

  return new Tooltip(textContent, a).dom;
}

function linkTooltipDecorations(state, schema) {
  if (!state.selection.empty) return null;
  const link = state.selection.$head
    .marks()
    .find((m) => m.type === schema.marks.link);
  if (!link) return null;
  return DecorationSet.create(state.doc, [
    Decoration.widget(state.selection.from, renderTooltip(link.attrs.href)),
  ]);
}

export default function linkTooltip(schema) {
  return new Plugin({
    props: {
      decorations(state) {
        return linkTooltipDecorations(state, schema);
      },
    },
  });
}
