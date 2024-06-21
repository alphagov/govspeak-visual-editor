export default class MenuPluginView {
  constructor(items, editorView) {
    this.items = items;
    this.dom = document.createElement("div");
    this.dom.className = "govuk-button-group visual-editor__menu";
    this.dom.role = "toolbar";

    items.forEach(({ command, dom, customHandler }, index) => {
      const button = this.dom.appendChild(dom);
      button.setAttribute("tabindex", index === 0 ? 0 : -1);

      button.addEventListener("keyup", (event) => {
        if (event.key === "ArrowLeft") {
          this.focusPreviousButton(button);
        }
        if (event.key === "ArrowRight") {
          this.focusNextButton(button);
        }
      });

      button.addEventListener("click", (e) => {
        e.preventDefault();
        if (customHandler) {
          customHandler(editorView.state, editorView.dispatch, editorView);
        } else {
          command(editorView.state, editorView.dispatch, editorView);
          editorView.focus();
        }
      });
    });

    this.update(editorView);

    editorView.dom.parentNode.insertBefore(this.dom, editorView.dom);
  }

  focusPreviousButton(button) {
    let buttonToFocus = button.previousElementSibling;
    while (buttonToFocus && buttonToFocus.disabled) {
      buttonToFocus = buttonToFocus.previousElementSibling;
    }

    if (buttonToFocus) {
      button.setAttribute("tabindex", -1);
      buttonToFocus.setAttribute("tabindex", 0);
      buttonToFocus.focus();
    }
  }

  focusNextButton(button) {
    let buttonToFocus = button.nextElementSibling;
    while (buttonToFocus && buttonToFocus.disabled) {
      buttonToFocus = buttonToFocus.nextElementSibling;
    }

    if (buttonToFocus) {
      button.setAttribute("tabindex", -1);
      buttonToFocus.setAttribute("tabindex", 0);
      buttonToFocus.focus();
    }
  }

  update(view) {
    const focusableButton = this.dom.querySelector('[tabindex="0"]');

    this.items.forEach(({ command, dom, update }) => {
      const active = command(view.state, null, view);
      dom.disabled = !active;
      if (update) update(view);
    });

    if (!focusableButton || !focusableButton.disabled) return;

    const buttonToFocus = this.dom.querySelector("button:not(:disabled)");

    if (!buttonToFocus) return;

    focusableButton.setAttribute("tabindex", -1);
    buttonToFocus.setAttribute("tabindex", 0);
  }

  destroy() {
    this.dom.remove();
  }
}
