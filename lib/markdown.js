import { MarkdownSerializer } from "prosemirror-markdown";
import markDefinitions from "./marks.js";
import nodeDefinitions from "./nodes.js";

export default (options) => {
  const nodeSerializers = Object.fromEntries(
    nodeDefinitions
      .filter((node) => typeof node.serializer !== "undefined")
      .map((node) => [node.name, node.serializer(options)]),
  );

  const markSerializerSpecs = Object.fromEntries(
    markDefinitions.map((mark) => [mark.name, mark.serializerSpec(options)]),
  );

  return new MarkdownSerializer(nodeSerializers, markSerializerSpecs);
};
