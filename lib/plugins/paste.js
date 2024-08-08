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
        if (!imageMatch) {
          return slice;
        }

        const images = options.images;
        const imagesReverse = Object.fromEntries(
          Object.entries(images).map(([k, v]) => [v, k]),
        );

        const image = schema.nodes.image.create({
          markdown: child.text,
          src: imagesReverse[child.text],
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
