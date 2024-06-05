import nodeDefinitions from "../nodes";
import { inputRules } from "prosemirror-inputrules";

export default function customInputRules(schema) {
  const rules = nodeDefinitions
    .filter((node) => typeof node.inputRules !== "undefined")
    .flatMap((node) => node.inputRules(schema));
  return inputRules({ rules });
}
