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

    let headerRows = []
    let cellRows = []
    rows.forEach((row) => {
      const cellsCount = row.content.content.length;
      const firstCellType = row.content.content[0].type.name
      const lastCellType = row.content.content[cellsCount-1].type.name
      if (firstCellType === "table_header" && lastCellType === "table_header") {
        headerRows.push(row.content.content)
      } else {
        const isColumnHeader = firstCellType === "table_header";
        cellRows.push({row: row.content.content, isColumnHeader: isColumnHeader});
      }
    });

    if (headerRows.length > 0) {
      headerRows.forEach((row) => {
        state.write("| ");
        row.forEach((cell) => {
          state.renderInline(cell.content.content[0], false);
          state.write(" | ");
        });
        state.write("\n");
      });

      state.write("|");
      headerRows[0].forEach(() => {
        state.write("---");
        state.write("|");
      });
      state.write("\n");
    }

    cellRows.forEach((cellRow) => {
      if(cellRow.isColumnHeader) {
        state.write("# ");
      } else {
        state.write("| ");
      }
      cellRow.row.forEach((cell) => {
        state.renderInline(cell.content.content[0], false);
        state.write(" | ");
      });
      state.write("\n");
    });

    state.closeBlock(node);
  };
};

export default [
  { name: "table", schema: nodes.table, serializer: tableSerializer },
  { name: "table_row", schema: nodes.table_row },
  { name: "table_header", schema: nodes.table_header },
  { name: "table_cell", schema: nodes.table_cell },
];
