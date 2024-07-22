import { Fragment, Slice } from "prosemirror-model";
import { Plugin } from "prosemirror-state";

export default function paste(schema, options) {
  return new Plugin({
    props: {
      transformPasted(slice) {
        const child = slice.content?.firstChild?.firstChild;
        if (!child || !child.isText) {
          return slice;
        }

        const imageMatch = child.text.match(/\[Image: (.+)]/);
        if (!imageMatch || !options.images[imageMatch[1]]) {
          return slice;
        }

        const image = schema.nodes.image.create({
          src: options.images[imageMatch[1]],
        });
        return new Slice(
          Fragment.from(schema.nodes.paragraph.create({}, image)),
          slice.openStart,
          slice.openEnd,
        );
      },
    },
  });
}
