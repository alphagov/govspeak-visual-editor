import { MarkdownSerializer } from "prosemirror-markdown";
import nodeDefinitions from "./nodes.js";

const nodesSerializer = Object.fromEntries(
  nodeDefinitions
    .filter((node) => typeof node.toGovspeak !== "undefined")
    .map((node) => [node.name, node.toGovspeak]),
);

export const markdownSerializer = new MarkdownSerializer(nodesSerializer, {
  em: { open: "*", close: "*", mixable: true, expelEnclosingWhitespace: true },
  strong: {
    open: "**",
    close: "**",
    mixable: true,
    expelEnclosingWhitespace: true,
  },
  link: {
    open(state, mark, parent, index) {
      state.inAutolink = isPlainURL(mark, parent, index);
      return state.inAutolink ? "<" : "[";
    },
    close(state, mark, parent, index) {
      const { inAutolink } = state;
      state.inAutolink = undefined;
      return inAutolink
        ? ">"
        : "](" +
            mark.attrs.href.replace(/[()"]/g, "\\$&") +
            (mark.attrs.title
              ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"`
              : "") +
            ")";
    },
    mixable: true,
  },
  code: {
    open(_state, _mark, parent, index) {
      return backticksFor(parent.child(index), -1);
    },
    close(_state, _mark, parent, index) {
      return backticksFor(parent.child(index - 1), 1);
    },
    escape: false,
  },
});


function isPlainURL(link, parent, index) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false;
  const content = parent.child(index);
  if (
    !content.isText ||
    content.text !== link.attrs.href ||
    content.marks[content.marks.length - 1] !== link
  )
    return false;
  return (
    index === parent.childCount - 1 ||
    !link.isInSet(parent.child(index + 1).marks)
  );
}
