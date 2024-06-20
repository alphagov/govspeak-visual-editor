import { wrapInList } from "prosemirror-schema-list";
import { toggleMark } from "prosemirror-commands";
import { redo, undo } from "prosemirror-history";
import bulletListIconUrl from "../../icons/bullet-list.svg";
import orderedListIconUrl from "../../icons/ordered-list.svg";
import linkIconUrl from "../../icons/link.svg";
import emailLinkIconUrl from "../../icons/email-link.svg";
import undoIconUrl from "../../icons/undo.svg";
import redoIconUrl from "../../icons/redo.svg";
import { trackButton } from "../../tracking/google-analytics.js";

function button(title, iconUrl) {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.type = "button";
  button.title = title;
  trackButton(button);
  const icon = document.createElement("img");
  icon.src = iconUrl;
  button.appendChild(icon);
  return button;
}

export const bulletListMenuItem = (schema) => {
  return {
    command: wrapInList(schema.nodes.bullet_list),
    dom: button("Bullet list", bulletListIconUrl),
  };
};

export const orderedListMenuItem = (schema) => {
  return {
    command: wrapInList(schema.nodes.ordered_list),
    dom: button("Ordered list", orderedListIconUrl),
  };
};

export const linkMenuItem = (schema) => {
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
};

export const emailLinkMenuItem = (schema) => {
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
};

export const undoMenuItem = () => {
  return {
    command: undo,
    dom: button("Undo", undoIconUrl),
  };
};

export const redoMenuItem = () => {
  return {
    command: redo,
    dom: button("Redo", redoIconUrl),
  };
};
