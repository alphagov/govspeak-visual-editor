import Tooltip from "../components/tooltip";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

function findProblems(schema, doc) {
  const problems = [];
  let lastHeadLevel = null;

  doc.descendants((node, pos) => {
    if (node.type === schema.nodes.heading) {
      const level = node.attrs.level;
      if (lastHeadLevel == null && level !== 2) {
        problems.push({
          message: `The first heading in a document must be H2.`,
          from: pos + 1,
          to: pos + 1 + node.content.size,
        });
      } else if (lastHeadLevel !== null && level > lastHeadLevel + 1)
        problems.push({
          message: `Skipped heading from H${lastHeadLevel} to H${level}. Consider H${lastHeadLevel + 1} instead.`,
          from: pos + 1,
          to: pos + 1 + node.content.size,
        });
      lastHeadLevel = level;
    }
  });

  return problems;
}

function lintDecorations(state, schema) {
  const decorations = [];
  findProblems(schema, state.doc).forEach((problem) => {
    decorations.push(
      Decoration.inline(problem.from, problem.to, {
        class: "visual-editor__highlight--error",
      }),
    );
    if (
      problem.from <= state.selection.from &&
      problem.to >= state.selection.to
    ) {
      const tooltip = new Tooltip(problem.message);
      tooltip.error = true;
      decorations.push(Decoration.widget(state.selection.from, tooltip.dom));
    }
  });
  return DecorationSet.create(state.doc, decorations);
}

export default function lint(schema) {
  return new Plugin({
    props: {
      decorations(state) {
        return lintDecorations(state, schema);
      },
    },
  });
}
