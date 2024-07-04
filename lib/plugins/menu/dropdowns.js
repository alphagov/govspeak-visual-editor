import { chainCommands, setBlockType, wrapIn } from "prosemirror-commands";
import { dispatchSelectTrackingEvent } from "../../tracking/google-analytics";

function selectDom(options, editorView, className, resetOnChange) {
  const select = document.createElement("select");
  select.className = `govuk-select visual-editor__menu-select ${className}`;
  options.forEach((o, index) => {
    o.dom = document.createElement("option");
    o.dom.text = o.text;
    o.dom.value = index;
    select.appendChild(o.dom);
  });
  select.addEventListener("change", () => {
    options[Number(select.value)].command(
      editorView.state,
      editorView.dispatch,
      editorView,
    );
    editorView.focus();
    dispatchSelectTrackingEvent(select);
    if (resetOnChange) select.selectedIndex = 0;
  });
  return select;
}

function menuSelect(options, editorView, className) {
  return {
    command: chainCommands(...options.map((o) => o.command)),
    dom: selectDom(options, editorView, className, true),
    customHandler: () => {},
    update: (view) => {
      options.forEach((o) => {
        o.dom.disabled = !o.command(view.state, null, view);
      });
    },
  };
}

function headingSelect(options, editorView, className) {
  const dom = selectDom(options, editorView, className);
  return {
    command: chainCommands(...options.map((o) => o.command)),
    dom,
    customHandler: () => {},
    update: (view) => {
      const index = view.state.selection.$head.parent.attrs.level || 1;
      dom.selectedIndex = index - 1;
      options.forEach((o) => {
        o.dom.disabled = !o.command(view.state, null, view);
      });
    },
  };
}

function headingSelectOptions(schema) {
  return [
    {
      text: "Paragraph",
      command: setBlockType(schema.nodes.paragraph),
    },
    {
      text: "Heading 2",
      command: setBlockType(schema.nodes.heading, { level: 2 }),
    },
    {
      text: "Heading 3",
      command: setBlockType(schema.nodes.heading, { level: 3 }),
    },
    {
      text: "Heading 4",
      command: setBlockType(schema.nodes.heading, { level: 4 }),
    },
  ];
}

function textBlockMenuSelectOptions(schema) {
  return [
    {
      text: "Add text block",
      command: () => {},
    },
    {
      text: "Call to action",
      command: wrapIn(schema.nodes.call_to_action),
    },
    {
      text: "Address",
      command: wrapIn(schema.nodes.address),
    },
    {
      text: "Blockquote",
      command: wrapIn(schema.nodes.blockquote),
    },
  ];
}

function insertMenuSelectOptions(schema) {
  return [
    {
      text: "Insert",
      command: wrapIn(schema.nodes.call_to_action), // Temporary command to get appropriate enabled/disabled behaviour
    },
    {
      text: "Image",
      command: () => {},
    },
    {
      text: "Attachment",
      command: () => {},
    },
  ];
}

export const headingDropdown = (schema, editorView) => {
  return headingSelect(
    headingSelectOptions(schema),
    editorView,
    "visual-editor__menu-heading-select",
  );
};

export const textBlockDropdown = (schema, editorView) => {
  return menuSelect(
    textBlockMenuSelectOptions(schema),
    editorView,
    "visual-editor__menu-text-block-select",
  );
};

export const insertDropdown = (schema, editorView) => {
  return menuSelect(
    insertMenuSelectOptions(schema),
    editorView,
    "visual-editor__menu-insert-select",
  );
};
