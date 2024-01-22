import { buildMenuItems, exampleSetup } from "prosemirror-example-setup"
import { inputRules } from "prosemirror-inputrules"
import { Plugin } from "prosemirror-state"
import customNodes from "./nodes"

const buildMenu = (schema) => {
  const menu = buildMenuItems(schema);

  // Add menu items from custom nodes
  customNodes.forEach((node) => {
    node.buildMenu({ menu, schema });
  });

  return menu.fullMenu;
};

const customInputRules = (schema) => {
  const rules = customNodes.flatMap((node) => (node.inputRules(schema)));
  return inputRules({ rules });
};

export default (options) => {
  options.menuContent = buildMenu(options.schema);
  const plugins = exampleSetup(options);

  // Remove the "ProseMirror-example-setup-style" class name plugin
  plugins.pop();

  // Add "govspeak" class name to the editor
  plugins.push(new Plugin({
    props: {
      attributes: { class: "govspeak" }
    }
  }));

  // Input rules for custom nodes
  plugins.push(customInputRules(options.schema));

  return plugins;
};
