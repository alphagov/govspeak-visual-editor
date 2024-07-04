import { Plugin } from "prosemirror-state";

export default new Plugin({
  props: {
    attributes: {
      class: "govspeak visual-editor__contenteditable",
      role: "textbox",
      "aria-multiline": "true",
    },
  },
});
