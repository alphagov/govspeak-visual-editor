const buttonTrackingAttributes = (buttonText) => {
  return JSON.stringify({
    event_name: "select_content",
    Type: "tabs",
    text: buttonText,
    external: "false",
    method: "primary click",
    section: document.title,
    action: "select",
    tool_name: "Visual Editor",
  });
};

export const trackButton = (button) => {
  button.setAttribute("data-ga4-event", buttonTrackingAttributes(button.title));
};

export const dispatchSelectTrackingEvent = (select) => {
  select.dispatchEvent(
    new CustomEvent("visualEditorSelectChange", {
      bubbles: true,
      detail: {
        selectText: select.options[select.selectedIndex].text,
      },
    }),
  );
};
