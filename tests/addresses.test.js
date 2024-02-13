import { expect, test } from 'vitest'
import { builders } from 'prosemirror-test-builder'
import schema from '../lib/schema.js'
import { createEditor, doc, p } from 'jest-prosemirror';

test('displays address', () => {
  const {address } = builders(schema)
  const editor = createEditor(doc(address(p("some text"))));

})