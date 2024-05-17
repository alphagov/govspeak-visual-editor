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
import headingIconUrl from "../icons/heading.svg";
import bulletListIconUrl from "../icons/bullet-list.svg";
import orderedListIconUrl from "../icons/ordered-list.svg";
import stepsIconUrl from "../icons/steps.svg";
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

function select(options, editorView, className) {
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
    select.selectedIndex = 0;
  });
  return {
    command: chainCommands(...options.map((o) => o.command)),
    dom: select,
    customHandler: () => {},
    update: (view) => {
      options.forEach((o) => {
        o.dom.disabled = !o.command(view.state, null, view);
      });
    },
  };
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

function headingMenuSelectOptions(schema) {
  return [
    {
      text: "H",
      command: () => {},
    },
    {
      text: "H3",
      command: chainCommands(
        setBlockType(schema.nodes.heading, { level: 3 }),
        setBlockType(schema.nodes.paragraph),
      ),
    },
    {
      text: "H4",
      command: chainCommands(
        setBlockType(schema.nodes.heading, { level: 4 }),
        setBlockType(schema.nodes.paragraph),
      ),
    },
    {
      text: "H5",
      command: chainCommands(
        setBlockType(schema.nodes.heading, { level: 5 }),
        setBlockType(schema.nodes.paragraph),
      ),
    },
    {
      text: "H6",
      command: chainCommands(
        setBlockType(schema.nodes.heading, { level: 6 }),
        setBlockType(schema.nodes.paragraph),
      ),
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

function stepsMenuItem(schema) {
  return {
    command: wrapInList(schema.nodes.steps),
    dom: button("Steps", stepsIconUrl),
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
      state.selection.empty && toggleMark(schema.marks.link)(state, null, view),
    dom: button("Email link", emailLinkIconUrl),
    customHandler: (state, dispatch, editorView) => {
      const email = prompt("Enter the email address");
      if (!email) return;
      dispatch(
        state.tr
          .addStoredMark(schema.marks.link.create({ href: `mailto:${email}` }))
          .insertText(email),
      );
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
      text: "Information callout",
      command: chainCommands(
        setBlockType(schema.nodes.information_callout),
        setBlockType(schema.nodes.paragraph),
      ),
    },
    {
      text: "Warning callout",
      command: chainCommands(
        setBlockType(schema.nodes.warning_callout),
        setBlockType(schema.nodes.paragraph),
      ),
    },
    {
      text: "Example callout",
      command: wrapIn(schema.nodes.example_callout),
    },
    {
      text: "Contact",
      command: wrapIn(schema.nodes.contact),
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
      text: "Attachemnt",
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
    headingMenuItem(schema),
    select(headingMenuSelectOptions(schema), editorView, "heading-select"),
    bulletListMenuItem(schema),
    orderedListMenuItem(schema),
    stepsMenuItem(schema),
    linkMenuItem(schema),
    emailLinkMenuItem(schema),
    select(textBlockMenuSelectOptions(schema), editorView, "text-block-select"),
    select(insertMenuSelectOptions(schema), editorView, "insert-select"),
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
