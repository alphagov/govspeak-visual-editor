import Tooltip from "../components/tooltip";
import { toggleMark } from "prosemirror-commands";
import { Plugin, TextSelection } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

function renderTooltip(href, state) {
  const textContent = href.startsWith("mailto:") ? "Email: " : "Link: ";

  const a = document.createElement("a");
  a.href = href;
  a.target = "_blank";
  a.textContent = href.startsWith("mailto:") ? href.slice(7) : href;

  const button = document.createElement("button");
  button.textContent = "Remove link";
  button.className =
    "govuk-body govuk-link visual-editor__tooltip-button visual-editor__tooltip-button--destructive";
  button.removeLink = true;
  button.from =
    state.selection.head - state.selection.$head.nodeBefore.nodeSize;
  button.to = state.selection.head + state.selection.$head.nodeAfter.nodeSize;

  return new Tooltip(textContent, a, button).dom;
}

function linkTooltipDecorations(state, schema) {
  if (!state.selection.empty) return null;
  const link = state.selection.$head
    .marks()
    .find((m) => m.type === schema.marks.link);
  if (!link) return null;
  return DecorationSet.create(state.doc, [
    Decoration.widget(
      state.selection.head,
      renderTooltip(link.attrs.href, state),
    ),
  ]);
}

function maybeRemoveLink(schema, view, event) {
  if (!event.target.removeLink) {
    return;
  }

  const { from, to } = event.target;
  view.dispatch(
    view.state.tr
      .setSelection(TextSelection.create(view.state.doc, from, to))
      .scrollIntoView(),
  );
  toggleMark(schema.marks.link)(view.state, view.dispatch);
  view.focus();

  return true;
}

export default function linkTooltip(schema) {
  return new Plugin({
    props: {
      decorations(state) {
        return linkTooltipDecorations(state, schema);
      },
      handleKeyDown(view, event) {
        if (event.keyCode !== 13 && event.keyCode !== 32) {
          return;
        }
        return maybeRemoveLink(schema, view, event);
      },
      handleClick(view, _, event) {
        return maybeRemoveLink(schema, view, event);
      },
    },
  });
}
