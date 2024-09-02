import { MarkdownSerializer } from "prosemirror-markdown";
import markDefinitions from "./marks.js";
import nodeDefinitions from "./nodes.js";

export default function constructMarkdownSerializer(options) {
  const nodesSerializer = Object.fromEntries(
    nodeDefinitions
      .filter((node) => typeof node.toGovspeak !== "undefined")
      .map((node) => [node.name, node.toGovspeak(options)]),
  );

  const marksSerializerSpec = Object.fromEntries(
    markDefinitions.map((mark) => [mark.name, mark.serializerSpec]),
  );
  return new MarkdownSerializer(nodesSerializer, marksSerializerSpec);
}
