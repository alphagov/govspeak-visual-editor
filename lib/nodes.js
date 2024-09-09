import * as address from "./nodes/address.js";
import * as blockquote from "./nodes/blockquote.js";
import * as bullet_list from "./nodes/bullet_list.js";
import * as callToAction from "./nodes/call_to_action.js";
import * as contact from "./nodes/contact.js";
import * as doc from "./nodes/doc.js";
import * as exampleCallout from "./nodes/example_callout.js";
import * as hard_break from "./nodes/hard_break.js";
import * as heading from "./nodes/heading.js";
import * as image from "./nodes/image.js";
import * as informationCallout from "./nodes/information_callout.js";
import * as list_item from "./nodes/list_item.js";
import * as ordered_list from "./nodes/ordered_list.js";
import * as paragraph from "./nodes/paragraph.js";
import * as steps from "./nodes/steps.js";
import * as text from "./nodes/text.js";
import * as warningCallout from "./nodes/warning_callout.js";
import tableNodes from "./nodes/table.js";

export default [
  paragraph, // Paragraph must be first to be the default
  address,
  blockquote,
  bullet_list,
  callToAction,
  contact,
  doc,
  exampleCallout,
  hard_break,
  heading,
  image,
  informationCallout,
  list_item,
  steps, // Steps must be before ordered_list so it doesn't get overridden by ordered_list
  ordered_list,
  text,
  warningCallout,
  ...tableNodes,
];
