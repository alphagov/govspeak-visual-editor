import { Schema } from "prosemirror-model";
import nodeDefinitions from "./nodes";
import markDefinitions from "./marks";

const nodes = Object.fromEntries(
  nodeDefinitions.map((node) => [node.name, node.schema]),
);

const marks = Object.fromEntries(
  markDefinitions.map((mark) => [mark.name, mark.schema]),
);

export default new Schema({
  nodes,
  marks,
});
