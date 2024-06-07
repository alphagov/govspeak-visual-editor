import { exampleSetup } from "prosemirror-example-setup";
import customInputRules from "./plugins/custom-input-rules";
import editorGovspeakClass from "./plugins/editor-govspeak-class";
import customKeymap from "./plugins/custom-keymap";
import menu from "./plugins/menu";

export default (options) => {
  const plugins = [
    customInputRules(options.schema),
    editorGovspeakClass,
    customKeymap(options.schema),
    menu(options.schema),
  ];

  options.menuBar = false;
  const examplePlugins = exampleSetup(options);
  // Remove the "ProseMirror-example-setup-style" class name plugin
  examplePlugins.pop();
  plugins.push(...examplePlugins);

  return plugins;
};
