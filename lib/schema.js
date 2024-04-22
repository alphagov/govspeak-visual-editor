import { Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-markdown";
import nodeDefinitions from "./nodes";

const nodes = Object.fromEntries(
  nodeDefinitions.map((node) => [node.name, node.schema]),
);

// Remove em from the schema as it is not supported in Govspeak
const marks = basicSchema.spec.marks.remove("em");

export default new Schema({
  nodes,
  marks,
});
