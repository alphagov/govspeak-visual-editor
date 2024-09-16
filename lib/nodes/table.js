import { tableNodes } from "prosemirror-tables";
import { milkdownSerializer } from "../markdown.js";

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
    console.log(milkdownSerializer().run(node));
  };
};

export default [
  { name: "table", schema: nodes.table, serializer: tableSerializer },
  { name: "table_row", schema: nodes.table_row },
  { name: "table_header", schema: nodes.table_header },
  { name: "table_cell", schema: nodes.table_cell },
];
