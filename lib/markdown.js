import { MarkdownSerializer } from "prosemirror-markdown";
import markDefinitions from "./marks.js";
import nodeDefinitions from "./nodes.js";

const nodesSerializer = Object.fromEntries(
  nodeDefinitions
    .filter((node) => typeof node.toGovspeak !== "undefined")
    .map((node) => [node.name, node.toGovspeak]),
);

const marksSerializerSpec = Object.fromEntries(
  markDefinitions.map((mark) => [mark.name, mark.serializerSpec]),
);

export const markdownSerializer = new MarkdownSerializer(
  nodesSerializer,
  marksSerializerSpec,
);
