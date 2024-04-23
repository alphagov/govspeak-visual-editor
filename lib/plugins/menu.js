import { setBlockType } from "prosemirror-commands";
import nodeDefinitions from "../nodes.js";
import { Plugin } from "prosemirror-state";
import MenuPluginView from "./menu-plugin-view";

// Create an icon for a heading at the given level
function headingButton(schema, level) {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = "heading";
  button.textContent = "H" + level;
  button.type = "button";

  return {
    command: setBlockType(schema.nodes.heading, { level }),
    dom: button,
  };
}

function items(schema) {
  return [
    headingButton(schema, 2),
    headingButton(schema, 3),
    ...nodeDefinitions
      .filter((node) => typeof node.buildMenuItemCommand !== "undefined")
      .map((node) => ({
        command: node.buildMenuItemCommand(schema.nodes[node.name]),
        dom: node.buildMenuItemDom(),
      })),
  ];
}

export default function menu(schema) {
  return new Plugin({
    view: (editorView) => new MenuPluginView(items(schema), editorView),
  });
}
