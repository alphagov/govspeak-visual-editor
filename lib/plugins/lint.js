import Tooltip from "../components/tooltip";
import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

function findProblems(schema, doc) {
  const problems = [];
  let lastHeadLevel = null;

  function pushProblem(message, from, to) {
    problems.push({ message, from, to });
  }

  doc.descendants((node, pos) => {
    if (node.type === schema.nodes.heading) {
      const level = node.attrs.level;
      if (lastHeadLevel != null && level > lastHeadLevel + 1)
        pushProblem(
          `Error: Heading level skipped (${level} under ${lastHeadLevel})`,
          pos + 1,
          pos + 1 + node.content.size,
        );
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
      decorations.push(
        Decoration.widget(
          state.selection.from,
          new Tooltip(problem.message).dom,
        ),
      );
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
