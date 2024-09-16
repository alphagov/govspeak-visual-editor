import { MarkdownSerializer } from "prosemirror-markdown";
import markDefinitions from "./marks.js";
import nodeDefinitions from "./nodes.js";
import MarkdownIt from "markdown-it";
import { markdownItTable } from "markdown-it-table";
import {SerializerState} from "@milkdown/transformer";
import schema from "./schema";
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'

export default (options) => {
  MarkdownIt().use(markdownItTable);

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

export const milkdownSerializer = () => {
  const remark = unified().use(remarkParse).use(remarkStringify)
  return SerializerState.create(schema, remark);
}