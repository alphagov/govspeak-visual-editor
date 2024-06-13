import { Plugin } from "prosemirror-state";
import MenuPluginView from "./menu-plugin-view";
import {
  headingDropdown,
  insertDropdown,
  textBlockDropdown,
} from "./dropdowns";
import {
  bulletListMenuItem,
  emailLinkMenuItem,
  linkMenuItem,
  orderedListMenuItem,
  redoMenuItem,
  undoMenuItem,
} from "./buttons";

function items(schema, editorView) {
  return [
    headingDropdown(schema, editorView),
    bulletListMenuItem(schema),
    orderedListMenuItem(schema),
    linkMenuItem(schema),
    emailLinkMenuItem(schema),
    textBlockDropdown(schema, editorView),
    insertDropdown(schema, editorView),
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
