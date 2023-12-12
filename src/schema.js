import { addListNodes } from "prosemirror-schema-list"
import { Schema } from "prosemirror-model"
import { schema as basicSchema } from "prosemirror-schema-basic"
import customNodes from "./nodes"
import { tableSchema } from "./tables"

// Use basic schema which roughly corresponds to the CommonMark schema
let nodes = basicSchema.spec.nodes;

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
nodes = addListNodes(nodes, "paragraph block*", "block");

// Add table nodes from prosemirror-tables
nodes = nodes.append(tableSchema)

// Add node schemas from the "nodes" directory
customNodes.forEach((node) => {
  nodes = nodes.addToEnd(node.name, node.schema);
});

export default new Schema({
  nodes,
  marks: basicSchema.spec.marks,
});
