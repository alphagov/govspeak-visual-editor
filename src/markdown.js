import { MarkdownSerializer } from "prosemirror-markdown"

const defaultNodes = {
  blockquote(state, node) {
    state.wrapBlock("> ", null, node, () => state.renderContent(node))
  },
  code_block(state, node) {
    // Make sure the front matter fences are longer than any dash sequence within it
    const backticks = node.textContent.match(/`{3,}/gm)
    const fence = backticks ? (backticks.sort().slice(-1)[0] + "`") : "```"

    state.write(fence + (node.attrs.params || "") + "\n")
    state.text(node.textContent, false)
    // Add a newline to the current content before adding closing marker
    state.write("\n")
    state.write(fence)
    state.closeBlock(node)
  },
  heading(state, node) {
    state.write(state.repeat("#", node.attrs.level) + " ")
    state.renderInline(node, false)
    state.closeBlock(node)
  },
  horizontal_rule(state, node) {
    state.write(node.attrs.markup || "---")
    state.closeBlock(node)
  },
  bullet_list(state, node) {
    state.renderList(node, "  ", () => (node.attrs.bullet || "*") + " ")
  },
  ordered_list(state, node) {
    let start = node.attrs.order || 1
    let maxW = String(start + node.childCount - 1).length
    let space = state.repeat(" ", maxW + 2)
    state.renderList(node, space, i => {
      let nStr = String(start + i)
      return state.repeat(" ", maxW - nStr.length) + nStr + ". "
    })
  },
  list_item(state, node) {
    state.renderContent(node)
  },
  paragraph(state, node) {
    state.renderInline(node)
    state.closeBlock(node)
  },
  image(state, node) {
    state.write("![" + state.esc(node.attrs.alt || "") + "](" + node.attrs.src.replace(/[\(\)]/g, "\\$&") +
                (node.attrs.title ? ' "' + node.attrs.title.replace(/"/g, '\\"') + '"' : "") + ")")
  },
  hard_break(state, node, parent, index) {
    for (let i = index + 1; i < parent.childCount; i++)
      if (parent.child(i).type != node.type) {
        state.write("\\\n")
        return
      }
  },
  text(state, node) {
    state.text(node.text, !state.inAutolink)
  },
}

const globImport = import.meta.glob('./nodes/*.js', { eager: true });
const modules = Object.values(globImport);
const customNodes = Object.fromEntries(modules.map((node) => [node.name, node.toGovspeak]))

const nodes = Object.assign(defaultNodes, customNodes);

export const markdownSerializer = new MarkdownSerializer(nodes, {
  em: {open: "*", close: "*", mixable: true, expelEnclosingWhitespace: true},
  strong: {open: "**", close: "**", mixable: true, expelEnclosingWhitespace: true},
  link: {
    open(state, mark, parent, index) {
      state.inAutolink = isPlainURL(mark, parent, index)
      return state.inAutolink ? "<" : "["
    },
    close(state, mark, parent, index) {
      let {inAutolink} = state
      state.inAutolink = undefined
      return inAutolink ? ">"
        : "](" + mark.attrs.href.replace(/[\(\)"]/g, "\\$&") + (mark.attrs.title ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"` : "") + ")"
    },
    mixable: true
  },
  code: {open(_state, _mark, parent, index) { return backticksFor(parent.child(index), -1) },
         close(_state, _mark, parent, index) { return backticksFor(parent.child(index - 1), 1) },
         escape: false}
})

function backticksFor(node, side) {
  let ticks = /`+/g, m, len = 0
  if (node.isText) while (m = ticks.exec(node.text)) len = Math.max(len, m[0].length)
  let result = len > 0 && side > 0 ? " `" : "`"
  for (let i = 0; i < len; i++) result += "`"
  if (len > 0 && side < 0) result += " "
  return result
}

function isPlainURL(link, parent, index) {
  if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false
  let content = parent.child(index)
  if (!content.isText || content.text != link.attrs.href || content.marks[content.marks.length - 1] != link) return false
  return index == parent.childCount - 1 || !link.isInSet(parent.child(index + 1).marks)
}
