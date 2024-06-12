import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

const wordsToAvoid =
  /\b(agenda|advancing|collaborate|combating|commit|pledge|countering|deliver|deploy|dialogue|disincentivise|incentivise|empower|facilitate|focusing|foster|impact|initiate|key|leverage|liaise|overarching|progress|promote|robust|slimming down|streamline|strengthening|tackling|transforming|utilise)\b/gi;

function renderTooltip(text) {
  const tooltipWrapper = document.createElement("div");
  tooltipWrapper.className = "tooltip-wrapper";
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip govuk-body";
  tooltip.textContent = text;
  tooltipWrapper.appendChild(tooltip);
  return tooltipWrapper;
}

function findProblems(schema, doc) {
  const problems = [];
  let lastHeadLevel = null;

  function pushProblem(message, from, to) {
    problems.push({ message, from, to });
  }

  doc.descendants((node, pos) => {
    if (node.isText) {
      let result;
      while ((result = wordsToAvoid.exec(node.text)))
        pushProblem(
          `Avoid using the word '${result[0]}'`,
          pos + result.index,
          pos + result.index + result[0].length,
        );
    } else if (node.type === schema.nodes.heading) {
      const level = node.attrs.level;
      if (lastHeadLevel != null && level > lastHeadLevel + 1)
        pushProblem(
          `Heading level skipped (${level} under ${lastHeadLevel})`,
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
        class: "problem",
      })
    );
    if ((problem.from <= state.selection.from) && (problem.to >= state.selection.to)) {
      decorations.push(
        Decoration.widget(state.selection.from, renderTooltip(problem.message))
      );
    };
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
