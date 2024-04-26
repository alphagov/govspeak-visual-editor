export default class MenuPluginView {
  constructor(items, editorView) {
    this.items = items;
    this.dom = document.createElement("div");
    this.dom.className = "menubar govuk-button-group";
    this.dom.role = "toolbar";

    const linkButton = document.createElement("button");
    linkButton.className = "govuk-button govuk-button--secondary";
    linkButton.title = "Link";
    linkButton.textContent = "🔗";
    linkButton.type = "button";
    this.dom.appendChild(linkButton);
    linkButton.addEventListener("click", (e) => {
      e.preventDefault();
      const href = prompt("Web address")
      // toggleMark("link", {href})(view.state, view.dispatch)
    });


    items.forEach(({ command, dom }, index) => {
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
        command(editorView.state, editorView.dispatch, editorView);
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

    this.items.forEach(({ command, dom }) => {
      const active = command(view.state, null, view);
      dom.disabled = !active;
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
