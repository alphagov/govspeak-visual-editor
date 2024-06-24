import { Plugin } from "prosemirror-state";

export default new Plugin({
  props: {
    attributes: {
      class: "govspeak",
      role: "textbox",
      "aria-multiline": "true",
    },
  },
});
