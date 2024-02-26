import { wrapItem } from "prosemirror-menu";
import { wrappingInputRule } from "prosemirror-inputrules";

export const name = "call_to_action";

export const schema = {
  content: "block+",
  group: "block",
  defining: true,
  parseDOM: [{ tag: "div.call-to-action" }],
  toDOM() {
    return ["div", { class: "call-to-action" }, 0];
  },
};

export const buildMenu = ({ menu, schema }) => {
  menu.typeMenu.content.push(
    wrapItem(schema.nodes[name], {
      label: "Call to action",
    }),
  );
};

export const inputRules = (schema) => [
  // $CTA Call to action
  wrappingInputRule(/^\$CTA\s$/, schema.nodes[name]),
];

export const toGovspeak = (state, node) => {
  state.write("$CTA\n\n");
  state.renderInline(node);
  state.write("$CTA");
  state.closeBlock(node);
};
