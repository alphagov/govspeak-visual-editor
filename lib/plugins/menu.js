import { chainCommands, setBlockType, toggleMark } from "prosemirror-commands";
import { wrapInList } from "prosemirror-schema-list";
import { redo, undo } from "prosemirror-history";
import { Plugin } from "prosemirror-state";
import MenuPluginView from "./menu-plugin-view";

function button(title, textContent) {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.type = "button";
  button.title = title;
  button.textContent = textContent;
  return button;
}

function headingMenuItem(schema) {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "Heading 2";
  const content = document.createElement("strong");
  content.textContent = "H²";
  button.appendChild(content);
  button.type = "button";

  return {
    command: chainCommands(
      setBlockType(schema.nodes.heading, { level: 2 }),
      setBlockType(schema.nodes.paragraph),
    ),
    dom: button,
  };
}

function bulletListMenuItem(schema) {
  return {
    command: wrapInList(schema.nodes.bullet_list),
    dom: button("Bullet list", "•"),
  };
}

function orderedListMenuItem(schema) {
  return {
    command: wrapInList(schema.nodes.ordered_list),
    dom: button("Ordered list", "⒈"),
  };
}

function stepsMenuItem(schema) {
  return {
    command: wrapInList(schema.nodes.steps),
    dom: button("Steps", "➊"),
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
    dom: button("Undo", "↺"),
  };
}

function redoMenuItem(schema) {
  return {
    command: redo,
    dom: button("Redo", "↻"),
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
