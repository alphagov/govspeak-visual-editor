import { chainCommands, setBlockType, toggleMark } from "prosemirror-commands";
import { wrapInList } from "prosemirror-schema-list";
import { redo, undo } from "prosemirror-history";
import { Plugin } from "prosemirror-state";
import MenuPluginView from "./menu-plugin-view";
import headingIconUrl from "../icons/heading.svg";
import bulletListIconUrl from "../icons/bullet-list.svg";
import orderedListIconUrl from "../icons/ordered-list.svg";
import stepsIconUrl from "../icons/steps.svg";
import undoIconUrl from "../icons/undo.svg";
import redoIconUrl from "../icons/redo.svg";

function button(title, iconUrl) {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.type = "button";
  button.title = title;
  const icon = document.createElement("img");
  icon.src = iconUrl;
  button.appendChild(icon);
  return button;
}

function headingMenuItem(schema) {
  return {
    command: chainCommands(
      setBlockType(schema.nodes.heading, { level: 2 }),
      setBlockType(schema.nodes.paragraph),
    ),
    dom: button("Heading 2", headingIconUrl),
  };
}

function bulletListMenuItem(schema) {
  return {
    command: wrapInList(schema.nodes.bullet_list),
    dom: button("Bullet list", bulletListIconUrl),
  };
}

function orderedListMenuItem(schema) {
  return {
    command: wrapInList(schema.nodes.ordered_list),
    dom: button("Ordered list", orderedListIconUrl),
  };
}

function stepsMenuItem(schema) {
  return {
    command: wrapInList(schema.nodes.steps),
    dom: button("Steps", stepsIconUrl),
  };
}

function linkMenuItem(schema) {
  return {
    command: (state) => !state.selection.empty,
    dom: button("Link", "🔗"),
    customHandler: (state, dispatch, editorView) => {
      const selectionHasLink = state.selection.ranges.some((r) =>
        state.doc.rangeHasMark(r.$from.pos, r.$to.pos, schema.marks.link),
      );
      let href = null;
      if (!selectionHasLink) {
        href = prompt("Enter absolute admin paths or full public URLs");
        if (!href) return;
      }
      toggleMark(schema.marks.link, { href })(state, dispatch);
    },
  };
}

function undoMenuItem(schema) {
  return {
    command: undo,
    dom: button("Undo", undoIconUrl),
  };
}

function redoMenuItem(schema) {
  return {
    command: redo,
    dom: button("Redo", redoIconUrl),
  };
}

function items(schema) {
  return [
    headingMenuItem(schema),
    bulletListMenuItem(schema),
    orderedListMenuItem(schema),
    stepsMenuItem(schema),
    linkMenuItem(schema),
    undoMenuItem(schema),
    redoMenuItem(schema),
  ];
}

export default function menu(schema) {
  return new Plugin({
    view: (editorView) => new MenuPluginView(items(schema), editorView),
  });
}
