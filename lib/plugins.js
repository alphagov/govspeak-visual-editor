import { exampleSetup } from "prosemirror-example-setup";
import { inputRules } from "prosemirror-inputrules";
import { Plugin } from "prosemirror-state";
import nodeDefinitions from "./nodes";
import menu from "./plugins/menu";

const customInputRules = (schema) => {
  const rules = nodeDefinitions
    .filter((node) => typeof node.inputRules !== "undefined")
    .flatMap((node) => node.inputRules(schema));
  return inputRules({ rules });
};

export default (options) => {
  options.menuBar = false;
  const plugins = exampleSetup(options);

  // Remove the "ProseMirror-example-setup-style" class name plugin
  plugins.pop();

  // Add "govspeak" class name to the editor
  plugins.push(
    new Plugin({
      props: {
        attributes: { class: "govspeak" },
      },
    }),
  );

  // Input rules for custom nodes
  plugins.push(customInputRules(options.schema));

  plugins.push(menu(options.schema));

  return plugins;
};
