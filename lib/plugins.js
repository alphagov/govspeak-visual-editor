import { exampleSetup } from "prosemirror-example-setup";
import customInputRules from "./plugins/custom-input-rules";
import customKeymap from "./plugins/custom-keymap";
import editorGovspeakClass from "./plugins/editor-govspeak-class";
import inlineHelp from "./plugins/inline-help";
import linkTooltip from "./plugins/link-tooltip";
import menu from "./plugins/menu/menu";

export default (options) => {
  const plugins = [
    customInputRules(options.schema),
    customKeymap(options.schema),
    editorGovspeakClass,
    inlineHelp(options.schema),
    linkTooltip(options.schema),
    menu(options.schema),
  ];

  options.menuBar = false;
  const examplePlugins = exampleSetup(options);
  // Remove the "ProseMirror-example-setup-style" class name plugin
  examplePlugins.pop();
  plugins.push(...examplePlugins);

  return plugins;
};
