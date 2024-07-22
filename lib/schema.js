import { Schema } from "prosemirror-model";
import nodeDefinitions from "./nodes";
import markDefinitions from "./marks";

export default function constructSchema(options) {
  const nodes = Object.fromEntries(
    nodeDefinitions.map((node) => [node.name, node.schema(options)]),
  );

  const marks = Object.fromEntries(
    markDefinitions.map((mark) => [mark.name, mark.schema(options)]),
  );

  return new Schema({
    nodes,
    marks,
  });
}
