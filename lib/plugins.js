import { exampleSetup } from "prosemirror-example-setup";
import customInputRules from "./plugins/custom-input-rules";
import customKeymap from "./plugins/custom-keymap";
import editorGovspeakClass from "./plugins/editor-govspeak-class";
import lintImages from "./plugins/lint-images";
import linkTooltip from "./plugins/link-tooltip";
import menu from "./plugins/menu/menu";
import lint from "./plugins/lint";
import paste from "./plugins/paste";
import { columnResizing, goToNextCell, tableEditing } from "prosemirror-tables";
import { keymap } from "prosemirror-keymap";

export default (schema, options) => {
  const plugins = [
    customInputRules(schema),
    customKeymap(schema),
    editorGovspeakClass,
    linkTooltip(schema),
    menu(schema),
    lint(schema),
    lintImages(schema, options),
    paste(schema, options),
  ];

  const examplePlugins = exampleSetup({ schema, menuBar: false });
  // Remove the "ProseMirror-example-setup-style" class name plugin
  examplePlugins.pop();
  plugins.push(...examplePlugins);
  plugins.push(columnResizing());
  plugins.push(tableEditing());
  plugins.push(
    keymap({
      Tab: goToNextCell(1),
      "Shift-Tab": goToNextCell(-1),
    }),
  );

  return plugins;
};
