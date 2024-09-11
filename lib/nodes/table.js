import { tableNodes } from "prosemirror-tables";

const nodes = tableNodes({
  tableGroup: "block",
  cellContent: "paragraph",
  cellAttributes: {
    background: {
      default: null,
      getFromDOM(dom) {
        return dom.style.backgroundColor || null;
      },
      setDOMAttr(value, attrs) {
        if (value)
          attrs.style = (attrs.style || "") + `background-color: ${value};`;
      },
    },
    horizontalAlign: {
      default: null,
      getFromDOM(dom) {
        return dom.style.textAlign || null;
      },
      setDOMAttr(value, attrs) {
        if (value) attrs.style = (attrs.style || "") + `text-align: ${value};`;
      },
    },
  },
});

const tableSerializer = function () {
  return (state, node) => {
    console.log("table", node);
    const rows = node.content.content;
    rows.forEach((row) => {
      if (row.type.name === "table_row") {
        state.write("| ");
        const cells = row.content.content;
        cells.forEach((cell) => {
          state.renderInline(cell.content.content[0], false);
          state.write(" | ");
        });
      } else if (row.type.name === "table_header") {
        state.write("| ");
        const cells = row.content.content;
        cells.forEach((cell) => {
          state.renderInline(cell.content.content[0], false);
          state.write(" | ");
        });

        state.write("\n");
        state.write("|");
        cells.forEach(() => {
          state.write("---");
          state.write("|");
        });
      }
      state.write("\n");
    });
    state.closeBlock(node);
  };
};

export default [
  { name: "table", schema: nodes.table, serializer: tableSerializer },
  { name: "table_cell", schema: nodes.table_cell },
  { name: "table_row", schema: nodes.table_row },
  { name: "table_header", schema: nodes.table_header },
];
