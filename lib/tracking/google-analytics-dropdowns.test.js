import { test, vi, expect } from "vitest";
import schema from "../schema";
import {
  headingDropdown,
  insertDropdown,
  textBlockDropdown,
} from "../plugins/menu/dropdowns";

test("Tracking event emitted for heading dropdown", () => {
  const selectDom = headingDropdown(schema, mockEditorView).dom;
  assertSelectChangeTriggersVisualEditorEvent(selectDom);
});

test("Tracking event emitted for text block dropdown", () => {
  const selectDom = textBlockDropdown(schema, mockEditorView).dom;
  assertSelectChangeTriggersVisualEditorEvent(selectDom);
});

test("Tracking event emitted for insert dropdown", () => {
  const selectDom = insertDropdown(schema, mockEditorView).dom;
  assertSelectChangeTriggersVisualEditorEvent(selectDom);
});

const assertSelectChangeTriggersVisualEditorEvent = (selectDom) => {
  let selectChangeEvent;
  document.addEventListener("visualEditorSelectChange", (event) => {
    selectChangeEvent = event;
  });
  document.body.appendChild(selectDom);

  selectDom.value = 2;
  selectDom.dispatchEvent(new Event("change"));

  expect(selectChangeEvent).not.toBeNull();
  expect(selectChangeEvent.detail.selectText).toBe(selectDom.options[2].text);
};

const mockEditorView = {
  state: {
    selection: {
      ranges: [],
      $from: {
        blockRange: vi.fn(),
      },
      $to: {},
    },
  },
  focus: vi.fn(),
};
