import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

export default [
  { name: "table", schema: Table, serializer: () => {console.log("I am a serializer")}},
  { name: "tableRow", schema: TableRow },
  { name: "tableCell", schema: TableCell },
  { name: "tableHeader", schema: TableHeader }
];
