import { toggleMark, setBlockType, wrapIn } from "prosemirror-commands";
import customNodes from "../nodes.js";
import { Plugin } from "prosemirror-state";
import MenuPluginView from "./menu-plugin-view";

// Helper function to create menu buttons
function button(text, name) {
  const button = document.createElement("button");
  button.className = "govuk-button govuk-button--secondary";
  button.title = name;
  button.textContent = text;
  button.type = "button";
  return button;
}

// Create an icon for a heading at the given level
function headingButton(schema, level) {
  return {
    command: setBlockType(schema.nodes.heading, { level }),
    dom: button("H" + level, "heading"),
  };
}

function items(schema) {
  return [
    { command: toggleMark(schema.marks.strong), dom: button("B", "Strong") },
    {
      command: setBlockType(schema.nodes.paragraph),
      dom: button("p", "Paragraph"),
    },
    headingButton(schema, 2),
    headingButton(schema, 3),
    {
      command: wrapIn(schema.nodes.blockquote),
      dom: button("“”", "Blockquote"),
    },
    {
      command: setBlockType(schema.nodes.code_block),
      dom: button("<>", "Code block"),
    },
    {
      command: wrapIn(schema.nodes.ordered_list),
      dom: button("1.", "Ordered list"),
    },
    {
      command: wrapIn(schema.nodes.bullet_list),
      dom: button("-", "Bullet list"),
    },
    ...customNodes.map((node) => ({
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
