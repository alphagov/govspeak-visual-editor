export default class Tooltip {
  constructor(textContent, ...children) {
    this.dom = document.createElement("div");
    this.dom.className = "visual-editor__tooltip-wrapper";

    this.tooltip = document.createElement("div");
    this.tooltip.className = "visual-editor__tooltip govuk-body";
    this.tooltip.textContent = textContent;

    children.forEach((child) => this.tooltip.appendChild(child));

    this.dom.appendChild(this.tooltip);
  }

  set error(value) {
    this.tooltip.classList.toggle("govuk-error-message", value);
  }

  get error() {
    return this.tooltip.classList.contains("govuk-error-message");
  }
}
