import Tooltip from "../components/tooltip";
import placeholder from "../assets/placeholder.jpg";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

function renderNoSrcTooltip() {
  const ul = document.createElement("ul");
  [
    "Save this document",
    "Copy image from the 'Images' tab of this document and paste here",
  ].forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });
  const tooltip = new Tooltip(
    "Image not found. You can try the following: ",
    ul,
  );
  tooltip.error = true;
  tooltip.column = true;
  return tooltip.dom;
}

function renderNoMarkdownTooltip() {
  const tooltip = new Tooltip(
    "Upload the image on the images tab before using it in the document.",
  );
  tooltip.error = true;
  return tooltip.dom;
}

function findProblems(schema, doc, options) {
  const problems = [];

  doc.descendants((node, pos) => {
    if (node.type !== schema.nodes.image) return;
    if (node.attrs.src === placeholder) {
      problems.push({
        tooltip: renderNoSrcTooltip(),
        from: pos,
        to: pos + 1,
      });
    } else if (!options.images[node.attrs.src]) {
      problems.push({
        tooltip: renderNoMarkdownTooltip(),
        from: pos,
        to: pos + 1,
      });
    }
  });

  return problems;
}

function decorations(state, schema, options) {
  const decorations = [];
  findProblems(schema, state.doc, options).forEach((problem) => {
    decorations.push(
      Decoration.node(problem.from, problem.to, {
        nodeName: "div",
        class: "visual-editor__highlight--image-error",
      }),
    );
    if (
      problem.from === state.selection.from &&
      problem.to === state.selection.to
    ) {
      decorations.push(Decoration.widget(state.selection.to, problem.tooltip));
    }
  });
  return DecorationSet.create(state.doc, decorations);
}

export default (schema, options) => {
  return new Plugin({
    props: {
      decorations(state) {
        return decorations(state, schema, options);
      },
    },
  });
};
