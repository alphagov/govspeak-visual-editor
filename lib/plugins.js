import { exampleSetup } from "prosemirror-example-setup";
import customInputRules from "./plugins/custom-input-rules";
import customKeymap from "./plugins/custom-keymap";
import editorGovspeakClass from "./plugins/editor-govspeak-class";
import lintImages from "./plugins/lint-images";
import linkTooltip from "./plugins/link-tooltip";
import menu from "./plugins/menu/menu";
import lint from "./plugins/lint";
import paste from "./plugins/paste";

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

  return plugins;
};
