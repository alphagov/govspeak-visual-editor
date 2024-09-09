import { tableNodes } from "prosemirror-tables";

const nodes = tableNodes({
  tableGroup: "block",
  cellContent: "block+",
  cellAttributes: {},
});

export default [
  { name: "table", schema: nodes.table },
  { name: "table_cell", schema: nodes.table_cell },
  { name: "table_row", schema: nodes.table_row },
  { name: "table_header", schema: nodes.table_header },
];
