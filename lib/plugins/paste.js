import { Fragment, Slice } from "prosemirror-model";
import { Plugin } from "prosemirror-state";

export default function paste(schema) {
  return new Plugin({
    props: {
      transformPasted(slice) {
        const child = slice.content?.firstChild?.firstChild;
        if (!child.isText) {
          return slice;
        }

        const imageMatch = child.text.match(/\[Image: .+\..+\]/);
        if (!imageMatch) {
          return slice;
        }

        const image = schema.nodes.image.create({
          src: "http://localhost:5173/example.jpg",
        });
        return new Slice(
          Fragment.from(
            schema.nodes.paragraph.create({}, image),
          ),
          slice.openStart,
          slice.openEnd,
        );
      },
    },
  });
}
