export const dispatchSelectCustomEvent = (select) => {
  select.dispatchEvent(
    new CustomEvent("visualEditorSelectChange", {
      bubbles: true,
      detail: {
        selectText: select.options[select.selectedIndex].text,
      },
    }),
  );
};

export const dispatchButtonCustomEvent = (button) => {
  button.dispatchEvent(
    new CustomEvent("visualEditorButtonClick", {
      bubbles: true,
      detail: {
        buttonText: button.title,
      },
    }),
  );
};
