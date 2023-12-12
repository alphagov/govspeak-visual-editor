import {
  addColumnAfter,
  addColumnBefore,
  deleteColumn,
  addRowAfter,
  addRowBefore,
  deleteRow,
  mergeCells,
  splitCell,
  toggleHeaderRow,
  toggleHeaderColumn,
  toggleHeaderCell,
  goToNextCell,
  deleteTable,
  tableEditing,
  columnResizing,
  tableNodes,
} from "prosemirror-tables";
import { Dropdown, MenuItem } from "prosemirror-menu";
import { DOMParser } from "prosemirror-model";
import { keymap } from "prosemirror-keymap";

export const tableSchema = tableNodes({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {},
});

function canInsert(state, nodeType) {
  let $from = state.selection.$from
  for (let d = $from.depth; d >= 0; d--) {
    let index = $from.index(d)
    if ($from.node(d).canReplaceWith(index, index, nodeType)) return true
  }
  return false
}

// Command to insert a 2x2 table into the editor
const insertTable = (schema) => {

  // const newTable = DOMParser.fromSchema(schema).parseSlice(newTableHtml)


  const { table, table_row, table_cell } = schema.nodes
  const newTable = () => {
    const container = document.createElement('div');
    container.innerHTML = `<table><tr><td><p></p></td><td><p></p></td></tr><tr><td><p></p></td><td><p></p></td></tr></table>`;
    return DOMParser.fromSchema(schema).parseSlice(container).content;
  };


  return (state, dispatch) => {
    // console.log(schema.nodes)
    // console.log(state.tr);




    let { $from } = state.selection, index = $from.index()
    if (!canInsert(state, table)) return false;
    if (dispatch)
      dispatch(state.tr.replaceSelectionWith(newTable(), false))
    return true
  }
}

export const buildTableMenu = ({ menu, schema }) => {
  const item = (label, cmd) => (
    new MenuItem({ label, select: cmd, run: cmd })
  );

  // Add 'Table' to insert menu
  menu.fullMenu[1][0].content.push(item("Table", insertTable(schema)));

  const tableMenu = [
    item('Insert column before', addColumnBefore),
    item('Insert column after', addColumnAfter),
    item('Delete column', deleteColumn),
    item('Insert row before', addRowBefore),
    item('Insert row after', addRowAfter),
    item('Delete row', deleteRow),
    item('Delete table', deleteTable),
    item('Merge cells', mergeCells),
    item('Split cell', splitCell),
    item('Toggle header column', toggleHeaderColumn),
    item('Toggle header row', toggleHeaderRow),
    item('Toggle header cells', toggleHeaderCell),
  ];
  menu.fullMenu.splice(2, 0, [new Dropdown(tableMenu, { label: 'Table' })]);
};

export const addTablePlugins = (plugins) => {
  plugins.push(columnResizing());
  plugins.push(tableEditing());
  plugins.push(keymap({
    Tab: goToNextCell(1),
    'Shift-Tab': goToNextCell(-1),
  }));
};
