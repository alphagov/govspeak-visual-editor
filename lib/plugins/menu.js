import {
  chainCommands,
  setBlockType,
  toggleMark,
  wrapIn,
} from "prosemirror-commands";
import { wrapInList } from "prosemirror-schema-list";
import { redo, undo } from "prosemirror-history";
import { Plugin } from "prosemirror-state";
import MenuPluginView from "./menu-plugin-view";
import bulletListIconUrl from "../icons/bullet-list.svg";
import orderedListIconUrl from "../icons/ordered-list.svg";
import linkIconUrl from "../icons/link.svg";
import emailLinkIconUrl from "../icons/email-link.svg";
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

function selectDom(options, editorView, className, resetOnChange) {
  const select = document.createElement("select");
  select.className = `govuk-select ${className}`;
  options.forEach((o, index) => {
    o.dom = document.createElement("option");
    o.dom.text = o.text;
    o.dom.value = index;
    select.appendChild(o.dom);
  });
  select.addEventListener("change", () => {
    options[Number(select.value)].command(
      editorView.state,
      editorView.dispatch,
      editorView,
    );
    editorView.focus();
    if (resetOnChange) select.selectedIndex = 0;
  });
  return select;
}

function menuSelect(options, editorView, className) {
  return {
    command: chainCommands(...options.map((o) => o.command)),
    dom: selectDom(options, editorView, className, true),
    customHandler: () => {},
    update: (view) => {
      options.forEach((o) => {
        o.dom.disabled = !o.command(view.state, null, view);
      });
    },
  };
}

function headingSelect(options, editorView, className) {
  const dom = selectDom(options, editorView, className);
  return {
    command: chainCommands(...options.map((o) => o.command)),
    dom,
    customHandler: () => {},
    update: (view) => {
      const index = view.state.selection.$head.parent.attrs.level || 1;
      dom.selectedIndex = index - 1;
      options.forEach((o) => {
        o.dom.disabled = !o.command(view.state, null, view);
      });
    },
  };
}

function headingSelectOptions(schema) {
  return [
    {
      text: "Paragraph",
      command: setBlockType(schema.nodes.paragraph),
    },
    {
      text: "Heading 2",
      command: setBlockType(schema.nodes.heading, { level: 2 }),
    },
    {
      text: "Heading 3",
      command: setBlockType(schema.nodes.heading, { level: 3 }),
    },
    {
      text: "Heading 4",
      command: setBlockType(schema.nodes.heading, { level: 4 }),
    },
  ];
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

function linkMenuItem(schema) {
  return {
    command: toggleMark(schema.marks.link),
    dom: button("Link", linkIconUrl),
    customHandler: (state, dispatch, editorView) => {
      const selectionHasLink =
        !state.selection.empty &&
        state.selection.ranges.some((r) =>
          state.doc.rangeHasMark(r.$from.pos, r.$to.pos, schema.marks.link),
        );
      if (selectionHasLink) {
        toggleMark(schema.marks.link)(state, dispatch);
        editorView.focus();
        return;
      }

      let href = null;
      href = prompt("Enter absolute admin paths or full public URLs");
      if (!href) return;

      if (!state.selection.empty) {
        toggleMark(schema.marks.link, { href })(state, dispatch);
      } else {
        const text = prompt("Enter the link text");
        dispatch(
          state.tr
            .addStoredMark(schema.marks.link.create({ href }))
            .insertText(text),
        );
      }
      editorView.focus();
    },
  };
}

function emailLinkMenuItem(schema) {
  return {
    command: (...[state, , view]) =>
      toggleMark(schema.marks.link)(state, null, view),
    dom: button("Email link", emailLinkIconUrl),
    customHandler: (state, dispatch, editorView) => {
      const selectionHasLinkMark =
        !state.selection.empty &&
        state.selection.ranges.some((r) =>
          state.doc.rangeHasMark(r.$from.pos, r.$to.pos, schema.marks.link),
        );
      if (selectionHasLinkMark) {
        toggleMark(schema.marks.link)(state, dispatch);
        editorView.focus();
        return;
      }

      const email = prompt("Enter the email address");
      if (!email) return;

      if (!state.selection.empty) {
        toggleMark(schema.marks.link, { href: `mailto:${email}` })(
          state,
          dispatch,
        );
      } else {
        dispatch(
          state.tr
            .addStoredMark(
              schema.marks.link.create({ href: `mailto:${email}` }),
            )
            .insertText(email),
        );
      }
      editorView.focus();
    },
  };
}

function textBlockMenuSelectOptions(schema) {
  return [
    {
      text: "Add text block",
      command: () => {},
    },
    {
      text: "Call to action",
      command: wrapIn(schema.nodes.call_to_action),
    },
    {
      text: "Address",
      command: wrapIn(schema.nodes.address),
    },
    {
      text: "Blockquote",
      command: wrapIn(schema.nodes.blockquote),
    },
  ];
}

function insertMenuSelectOptions(schema) {
  return [
    {
      text: "Insert",
      command: wrapIn(schema.nodes.call_to_action), // Temporary command to get appropriate enabled/disabled behaviour
    },
    {
      text: "Image",
      command: () => {},
    },
    {
      text: "Attachment",
      command: () => {},
    },
  ];
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

function items(schema, editorView) {
  return [
    headingSelect(headingSelectOptions(schema), editorView, "heading-select"),
    bulletListMenuItem(schema),
    orderedListMenuItem(schema),
    linkMenuItem(schema),
    emailLinkMenuItem(schema),
    menuSelect(
      textBlockMenuSelectOptions(schema),
      editorView,
      "text-block-select",
    ),
    menuSelect(insertMenuSelectOptions(schema), editorView, "insert-select"),
    undoMenuItem(schema),
    redoMenuItem(schema),
  ];
}

export default function menu(schema) {
  return new Plugin({
    view: (editorView) =>
      new MenuPluginView(items(schema, editorView), editorView),
  });
}
