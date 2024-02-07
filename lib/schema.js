import { addListNodes } from "prosemirror-schema-list"
import { Schema } from "prosemirror-model"
import { schema as basicSchema } from "prosemirror-markdown"
import customNodes from "./nodes"

// Use basic schema which roughly corresponds to the CommonMark schema
let nodes = basicSchema.spec.nodes;

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
nodes = addListNodes(nodes, "paragraph block*", "block");

// Add node schemas from the "nodes" directory
customNodes.forEach((node) => {
  nodes = nodes.addToEnd(node.name, node.schema);
});

// Remove em from the schema as it is not supported in Govspeak
const marks = basicSchema.spec.marks.remove('em')

export default new Schema({
  nodes,
  marks,
});
