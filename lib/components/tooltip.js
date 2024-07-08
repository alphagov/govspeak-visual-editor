export default class Tooltip {
  constructor(textContent, ...children) {
    this.dom = document.createElement("div");
    this.dom.className = "visual-editor__tooltip-wrapper";

    const tooltip = document.createElement("div");
    tooltip.className = "visual-editor__tooltip govuk-body";
    tooltip.textContent = textContent;

    children.forEach((child) => tooltip.appendChild(child));

    this.dom.appendChild(tooltip);
  }
}
