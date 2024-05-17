function U(n) {
  this.content = n;
}
U.prototype = {
  constructor: U,
  find: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === n)
        return e;
    return -1;
  },
  // :: (string) → ?any
  // Retrieve the value stored under `key`, or return undefined when
  // no such key exists.
  get: function(n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  // :: (string, any, ?string) → OrderedMap
  // Create a new map by replacing the value of `key` with a new
  // value, or adding a binding to the end of the map. If `newKey` is
  // given, the key of the binding will be replaced with that key.
  update: function(n, e, t) {
    var r = t && t != n ? this.remove(t) : this, o = r.find(n), s = r.content.slice();
    return o == -1 ? s.push(t || n, e) : (s[o + 1] = e, t && (s[o] = t)), new U(s);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1)
      return this;
    var t = this.content.slice();
    return t.splice(e, 2), new U(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new U([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new U(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), o = r.content.slice(), s = r.find(n);
    return o.splice(s == -1 ? o.length : s, 0, e, t), new U(o);
  },
  // :: ((key: string, value: any))
  // Call the given function for each key/value pair in the map, in
  // order.
  forEach: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      n(this.content[e], this.content[e + 1]);
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by prepending the keys in this map that don't
  // appear in `map` before the keys in `map`.
  prepend: function(n) {
    return n = U.from(n), n.size ? new U(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = U.from(n), n.size ? new U(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = U.from(n);
    for (var t = 0; t < n.content.length; t += 2)
      e = e.remove(n.content[t]);
    return e;
  },
  // :: () → Object
  // Turn ordered map into a plain object.
  toObject: function() {
    var n = {};
    return this.forEach(function(e, t) {
      n[e] = t;
    }), n;
  },
  // :: number
  // The amount of keys in this map.
  get size() {
    return this.content.length >> 1;
  }
};
U.from = function(n) {
  if (n instanceof U)
    return n;
  var e = [];
  if (n)
    for (var t in n)
      e.push(t, n[t]);
  return new U(e);
};
function bi(n, e, t) {
  for (let r = 0; ; r++) {
    if (r == n.childCount || r == e.childCount)
      return n.childCount == e.childCount ? null : t;
    let o = n.child(r), s = e.child(r);
    if (o == s) {
      t += o.nodeSize;
      continue;
    }
    if (!o.sameMarkup(s))
      return t;
    if (o.isText && o.text != s.text) {
      for (let i = 0; o.text[i] == s.text[i]; i++)
        t++;
      return t;
    }
    if (o.content.size || s.content.size) {
      let i = bi(o.content, s.content, t + 1);
      if (i != null)
        return i;
    }
    t += o.nodeSize;
  }
}
function Di(n, e, t, r) {
  for (let o = n.childCount, s = e.childCount; ; ) {
    if (o == 0 || s == 0)
      return o == s ? null : { a: t, b: r };
    let i = n.child(--o), l = e.child(--s), c = i.nodeSize;
    if (i == l) {
      t -= c, r -= c;
      continue;
    }
    if (!i.sameMarkup(l))
      return { a: t, b: r };
    if (i.isText && i.text != l.text) {
      let a = 0, u = Math.min(i.text.length, l.text.length);
      for (; a < u && i.text[i.text.length - a - 1] == l.text[l.text.length - a - 1]; )
        a++, t--, r--;
      return { a: t, b: r };
    }
    if (i.content.size || l.content.size) {
      let a = Di(i.content, l.content, t - 1, r - 1);
      if (a)
        return a;
    }
    t -= c, r -= c;
  }
}
class M {
  /**
  @internal
  */
  constructor(e, t) {
    if (this.content = e, this.size = t || 0, t == null)
      for (let r = 0; r < e.length; r++)
        this.size += e[r].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(e, t, r, o = 0, s) {
    for (let i = 0, l = 0; l < t; i++) {
      let c = this.content[i], a = l + c.nodeSize;
      if (a > e && r(c, o + l, s || null, i) !== !1 && c.content.size) {
        let u = l + 1;
        c.nodesBetween(Math.max(0, e - u), Math.min(c.content.size, t - u), r, o + u);
      }
      l = a;
    }
  }
  /**
  Call the given callback for every descendant node. `pos` will be
  relative to the start of the fragment. The callback may return
  `false` to prevent traversal of a given node's children.
  */
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  /**
  Extract the text between `from` and `to`. See the same method on
  [`Node`](https://prosemirror.net/docs/ref/#model.Node.textBetween).
  */
  textBetween(e, t, r, o) {
    let s = "", i = !0;
    return this.nodesBetween(e, t, (l, c) => {
      let a = l.isText ? l.text.slice(Math.max(e, c) - c, t - c) : l.isLeaf ? o ? typeof o == "function" ? o(l) : o : l.type.spec.leafText ? l.type.spec.leafText(l) : "" : "";
      l.isBlock && (l.isLeaf && a || l.isTextblock) && r && (i ? i = !1 : s += r), s += a;
    }, 0), s;
  }
  /**
  Create a new fragment containing the combined content of this
  fragment and the other.
  */
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let t = this.lastChild, r = e.firstChild, o = this.content.slice(), s = 0;
    for (t.isText && t.sameMarkup(r) && (o[o.length - 1] = t.withText(t.text + r.text), s = 1); s < e.content.length; s++)
      o.push(e.content[s]);
    return new M(o, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let r = [], o = 0;
    if (t > e)
      for (let s = 0, i = 0; i < t; s++) {
        let l = this.content[s], c = i + l.nodeSize;
        c > e && ((i < e || c > t) && (l.isText ? l = l.cut(Math.max(0, e - i), Math.min(l.text.length, t - i)) : l = l.cut(Math.max(0, e - i - 1), Math.min(l.content.size, t - i - 1))), r.push(l), o += l.nodeSize), i = c;
      }
    return new M(r, o);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? M.empty : e == 0 && t == this.content.length ? this : new M(this.content.slice(e, t));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(e, t) {
    let r = this.content[e];
    if (r == t)
      return this;
    let o = this.content.slice(), s = this.size + t.nodeSize - r.nodeSize;
    return o[e] = t, new M(o, s);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new M([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new M(this.content.concat(e), this.size + e.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t]))
        return !1;
    return !0;
  }
  /**
  The first child of the fragment, or `null` if it is empty.
  */
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  /**
  The last child of the fragment, or `null` if it is empty.
  */
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  /**
  The number of child nodes in this fragment.
  */
  get childCount() {
    return this.content.length;
  }
  /**
  Get the child node at the given index. Raise an error when the
  index is out of range.
  */
  child(e) {
    let t = this.content[e];
    if (!t)
      throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content[e] || null;
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    for (let t = 0, r = 0; t < this.content.length; t++) {
      let o = this.content[t];
      e(o, r, t), r += o.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, t = 0) {
    return bi(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return Di(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. (Not public.)
  */
  findIndex(e, t = -1) {
    if (e == 0)
      return un(0, e);
    if (e == this.size)
      return un(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, o = 0; ; r++) {
      let s = this.child(r), i = o + s.nodeSize;
      if (i >= e)
        return i == e || t > 0 ? un(r + 1, i) : un(r, o);
      o = i;
    }
  }
  /**
  Return a debugging string that describes this fragment.
  */
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  /**
  @internal
  */
  toStringInner() {
    return this.content.join(", ");
  }
  /**
  Create a JSON-serializeable representation of this fragment.
  */
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  /**
  Deserialize a fragment from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return M.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new M(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return M.empty;
    let t, r = 0;
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      r += s.nodeSize, o && s.isText && e[o - 1].sameMarkup(s) ? (t || (t = e.slice(0, o)), t[t.length - 1] = s.withText(t[t.length - 1].text + s.text)) : t && t.push(s);
    }
    return new M(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return M.empty;
    if (e instanceof M)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new M([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
M.empty = new M([], 0);
const Zn = { index: 0, offset: 0 };
function un(n, e) {
  return Zn.index = n, Zn.offset = e, Zn;
}
function bn(n, e) {
  if (n === e)
    return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object"))
    return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t)
    return !1;
  if (t) {
    if (n.length != e.length)
      return !1;
    for (let r = 0; r < n.length; r++)
      if (!bn(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !bn(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
class v {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.attrs = t;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(e) {
    let t, r = !1;
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      if (this.eq(s))
        return e;
      if (this.type.excludes(s.type))
        t || (t = e.slice(0, o));
      else {
        if (s.type.excludes(this.type))
          return e;
        !r && s.type.rank > this.type.rank && (t || (t = e.slice(0, o)), t.push(this), r = !0), t && t.push(s);
      }
    }
    return t || (t = e.slice()), r || t.push(this), t;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return !0;
    return !1;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(e) {
    return this == e || this.type == e.type && bn(this.attrs, e.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[t.type];
    if (!r)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    return r.create(t.attrs);
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(e, t) {
    if (e == t)
      return !0;
    if (e.length != t.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!e[r].eq(t[r]))
        return !1;
    return !0;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return v.none;
    if (e instanceof v)
      return [e];
    let t = e.slice();
    return t.sort((r, o) => r.type.rank - o.type.rank), t;
  }
}
v.none = [];
class Dn extends Error {
}
class D {
  /**
  Create a slice. When specifying a non-zero open depth, you must
  make sure that there are nodes of at least that depth at the
  appropriate side of the fragment—i.e. if the fragment is an
  empty paragraph node, `openStart` and `openEnd` can't be greater
  than 1.
  
  It is not necessary for the content of open nodes to conform to
  the schema's content constraints, though it should be a valid
  start/end/middle for such a node, depending on which sides are
  open.
  */
  constructor(e, t, r) {
    this.content = e, this.openStart = t, this.openEnd = r;
  }
  /**
  The size this slice would add when inserted into a document.
  */
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  /**
  @internal
  */
  insertAt(e, t) {
    let r = wi(this.content, e + this.openStart, t);
    return r && new D(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new D(Ni(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
  }
  /**
  Tests whether this slice is equal to another slice.
  */
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  /**
  @internal
  */
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  /**
  Convert a slice to a JSON-serializable representation.
  */
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  /**
  Deserialize a slice from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      return D.empty;
    let r = t.openStart || 0, o = t.openEnd || 0;
    if (typeof r != "number" || typeof o != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new D(M.fromJSON(e, t.content), r, o);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, t = !0) {
    let r = 0, o = 0;
    for (let s = e.firstChild; s && !s.isLeaf && (t || !s.type.spec.isolating); s = s.firstChild)
      r++;
    for (let s = e.lastChild; s && !s.isLeaf && (t || !s.type.spec.isolating); s = s.lastChild)
      o++;
    return new D(e, r, o);
  }
}
D.empty = new D(M.empty, 0, 0);
function Ni(n, e, t) {
  let { index: r, offset: o } = n.findIndex(e), s = n.maybeChild(r), { index: i, offset: l } = n.findIndex(t);
  if (o == e || s.isText) {
    if (l != t && !n.child(i).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != i)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, s.copy(Ni(s.content, e - o - 1, t - o - 1)));
}
function wi(n, e, t, r) {
  let { index: o, offset: s } = n.findIndex(e), i = n.maybeChild(o);
  if (s == e || i.isText)
    return r && !r.canReplace(o, o, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let l = wi(i.content, e - s - 1, t);
  return l && n.replaceChild(o, i.copy(l));
}
function Ac(n, e, t) {
  if (t.openStart > n.depth)
    throw new Dn("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new Dn("Inconsistent open depths");
  return Ci(n, e, t, 0);
}
function Ci(n, e, t, r) {
  let o = n.index(r), s = n.node(r);
  if (o == e.index(r) && r < n.depth - t.openStart) {
    let i = Ci(n, e, t, r + 1);
    return s.copy(s.content.replaceChild(o, i));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let i = n.parent, l = i.content;
      return st(i, l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: i, end: l } = Sc(t, n);
      return st(s, Si(n, i, l, e, r));
    }
  else
    return st(s, Nn(n, e, r));
}
function Ai(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new Dn("Cannot join " + e.type.name + " onto " + n.type.name);
}
function jr(n, e, t) {
  let r = n.node(t);
  return Ai(r, e.node(t)), r;
}
function ot(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Pt(n, e, t, r) {
  let o = (e || n).node(t), s = 0, i = e ? e.index(t) : o.childCount;
  n && (s = n.index(t), n.depth > t ? s++ : n.textOffset && (ot(n.nodeAfter, r), s++));
  for (let l = s; l < i; l++)
    ot(o.child(l), r);
  e && e.depth == t && e.textOffset && ot(e.nodeBefore, r);
}
function st(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function Si(n, e, t, r, o) {
  let s = n.depth > o && jr(n, e, o + 1), i = r.depth > o && jr(t, r, o + 1), l = [];
  return Pt(null, n, o, l), s && i && e.index(o) == t.index(o) ? (Ai(s, i), ot(st(s, Si(n, e, t, r, o + 1)), l)) : (s && ot(st(s, Nn(n, e, o + 1)), l), Pt(e, t, o, l), i && ot(st(i, Nn(t, r, o + 1)), l)), Pt(r, null, o, l), new M(l);
}
function Nn(n, e, t) {
  let r = [];
  if (Pt(null, n, t, r), n.depth > t) {
    let o = jr(n, e, t + 1);
    ot(st(o, Nn(n, e, t + 1)), r);
  }
  return Pt(e, null, t, r), new M(r);
}
function Sc(n, e) {
  let t = e.depth - n.openStart, o = e.node(t).copy(n.content);
  for (let s = t - 1; s >= 0; s--)
    o = e.node(s).copy(M.from(o));
  return {
    start: o.resolveNoCache(n.openStart + t),
    end: o.resolveNoCache(o.content.size - n.openEnd - t)
  };
}
class Wt {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.path = t, this.parentOffset = r, this.depth = t.length / 3 - 1;
  }
  /**
  @internal
  */
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  /**
  The parent node that the position points into. Note that even if
  a position points into a text node, that node is not considered
  the parent—text nodes are ‘flat’ in this model, and have no content.
  */
  get parent() {
    return this.node(this.depth);
  }
  /**
  The root node in which the position was resolved.
  */
  get doc() {
    return this.node(0);
  }
  /**
  The ancestor node at the given level. `p.node(p.depth)` is the
  same as `p.parent`.
  */
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  /**
  The index into the ancestor at the given level. If this points
  at the 3rd node in the 2nd paragraph on the top level, for
  example, `p.index(0)` is 1 and `p.index(1)` is 2.
  */
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  /**
  The index pointing after this position into the ancestor at the
  given level.
  */
  indexAfter(e) {
    return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
  }
  /**
  The (absolute) position at the start of the node at the given
  level.
  */
  start(e) {
    return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  /**
  The (absolute) position at the end of the node at the given
  level.
  */
  end(e) {
    return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
  }
  /**
  The (absolute) position directly before the wrapping node at the
  given level, or, when `depth` is `this.depth + 1`, the original
  position.
  */
  before(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  /**
  The (absolute) position directly after the wrapping node at the
  given level, or the original position when `depth` is `this.depth + 1`.
  */
  after(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  /**
  When this position points into a text node, this returns the
  distance between the position and the start of the text node.
  Will be zero for positions that point between nodes.
  */
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  /**
  Get the node directly after the position, if any. If the position
  points into a text node, only the part of that node after the
  position is returned.
  */
  get nodeAfter() {
    let e = this.parent, t = this.index(this.depth);
    if (t == e.childCount)
      return null;
    let r = this.pos - this.path[this.path.length - 1], o = e.child(t);
    return r ? e.child(t).cut(r) : o;
  }
  /**
  Get the node directly before the position, if any. If the
  position points into a text node, only the part of that node
  before the position is returned.
  */
  get nodeBefore() {
    let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
    return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
  }
  /**
  Get the position at the given index in the parent node at the
  given depth (which defaults to `this.depth`).
  */
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let r = this.path[t * 3], o = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let s = 0; s < e; s++)
      o += r.child(s).nodeSize;
    return o;
  }
  /**
  Get the marks at this position, factoring in the surrounding
  marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
  position is at the start of a non-empty node, the marks of the
  node after it (if any) are returned.
  */
  marks() {
    let e = this.parent, t = this.index();
    if (e.content.size == 0)
      return v.none;
    if (this.textOffset)
      return e.child(t).marks;
    let r = e.maybeChild(t - 1), o = e.maybeChild(t);
    if (!r) {
      let l = r;
      r = o, o = l;
    }
    let s = r.marks;
    for (var i = 0; i < s.length; i++)
      s[i].type.spec.inclusive === !1 && (!o || !s[i].isInSet(o.marks)) && (s = s[i--].removeFromSet(s));
    return s;
  }
  /**
  Get the marks after the current position, if any, except those
  that are non-inclusive and not present at position `$end`. This
  is mostly useful for getting the set of marks to preserve after a
  deletion. Will return `null` if this position is at the end of
  its parent node or its parent node isn't a textblock (in which
  case no marks should be preserved).
  */
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline)
      return null;
    let r = t.marks, o = e.parent.maybeChild(e.index());
    for (var s = 0; s < r.length; s++)
      r[s].type.spec.inclusive === !1 && (!o || !r[s].isInSet(o.marks)) && (r = r[s--].removeFromSet(r));
    return r;
  }
  /**
  The depth up to which this position and the given (non-resolved)
  position share the same parent nodes.
  */
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e)
        return t;
    return 0;
  }
  /**
  Returns a range based on the place where this position and the
  given position diverge around block content. If both point into
  the same textblock, for example, a range around that textblock
  will be returned. If they point into different blocks, the range
  around those blocks in their shared ancestor is returned. You can
  pass in an optional predicate that will be called with a parent
  node to see if a range into that parent is acceptable.
  */
  blockRange(e = this, t) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let r = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); r >= 0; r--)
      if (e.pos <= this.end(r) && (!t || t(this.node(r))))
        return new wn(this, e, r);
    return null;
  }
  /**
  Query whether the given position shares the same parent node.
  */
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  /**
  Return the greater of this and the given position.
  */
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  /**
  Return the smaller of this and the given position.
  */
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  /**
  @internal
  */
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let r = [], o = 0, s = t;
    for (let i = e; ; ) {
      let { index: l, offset: c } = i.content.findIndex(s), a = s - c;
      if (r.push(i, l, o + c), !a || (i = i.child(l), i.isText))
        break;
      s = a - 1, o += c + 1;
    }
    return new Wt(t, r, s);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    for (let o = 0; o < Kn.length; o++) {
      let s = Kn[o];
      if (s.pos == t && s.doc == e)
        return s;
    }
    let r = Kn[Xn] = Wt.resolve(e, t);
    return Xn = (Xn + 1) % Tc, r;
  }
}
let Kn = [], Xn = 0, Tc = 12;
class wn {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.depth = r;
  }
  /**
  The position at the start of the range.
  */
  get start() {
    return this.$from.before(this.depth + 1);
  }
  /**
  The position at the end of the range.
  */
  get end() {
    return this.$to.after(this.depth + 1);
  }
  /**
  The parent node that the range points into.
  */
  get parent() {
    return this.$from.node(this.depth);
  }
  /**
  The start index of the range in the parent node.
  */
  get startIndex() {
    return this.$from.index(this.depth);
  }
  /**
  The end index of the range in the parent node.
  */
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const Ec = /* @__PURE__ */ Object.create(null);
let it = class Lr {
  /**
  @internal
  */
  constructor(e, t, r, o = v.none) {
    this.type = e, this.attrs = t, this.marks = o, this.content = r || M.empty;
  }
  /**
  The size of this node, as defined by the integer-based [indexing
  scheme](/docs/guide/#doc.indexing). For text nodes, this is the
  amount of characters. For other leaf nodes, it is one. For
  non-leaf nodes, it is the size of the content plus two (the
  start and end token).
  */
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  /**
  The number of children that the node has.
  */
  get childCount() {
    return this.content.childCount;
  }
  /**
  Get the child node at the given index. Raises an error when the
  index is out of range.
  */
  child(e) {
    return this.content.child(e);
  }
  /**
  Get the child node at the given index, if it exists.
  */
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  /**
  Call `f` for every child node, passing the node, its offset
  into this parent node, and its index.
  */
  forEach(e) {
    this.content.forEach(e);
  }
  /**
  Invoke a callback for all descendant nodes recursively between
  the given two positions that are relative to start of this
  node's content. The callback is invoked with the node, its
  position relative to the original node (method receiver),
  its parent node, and its child index. When the callback returns
  false for a given node, that node's children will not be
  recursed over. The last parameter can be used to specify a
  starting position to count from.
  */
  nodesBetween(e, t, r, o = 0) {
    this.content.nodesBetween(e, t, r, o, this);
  }
  /**
  Call the given callback for every descendant node. Doesn't
  descend into a node when the callback returns `false`.
  */
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  /**
  Concatenates all the text nodes found in this fragment and its
  children.
  */
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  /**
  Get all text between positions `from` and `to`. When
  `blockSeparator` is given, it will be inserted to separate text
  from different block nodes. If `leafText` is given, it'll be
  inserted for every non-text leaf node encountered, otherwise
  [`leafText`](https://prosemirror.net/docs/ref/#model.NodeSpec^leafText) will be used.
  */
  textBetween(e, t, r, o) {
    return this.content.textBetween(e, t, r, o);
  }
  /**
  Returns this node's first child, or `null` if there are no
  children.
  */
  get firstChild() {
    return this.content.firstChild;
  }
  /**
  Returns this node's last child, or `null` if there are no
  children.
  */
  get lastChild() {
    return this.content.lastChild;
  }
  /**
  Test whether two nodes represent the same piece of document.
  */
  eq(e) {
    return this == e || this.sameMarkup(e) && this.content.eq(e.content);
  }
  /**
  Compare the markup (type, attributes, and marks) of this node to
  those of another. Returns `true` if both have the same markup.
  */
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  /**
  Check whether this node's markup correspond to the given type,
  attributes, and marks.
  */
  hasMarkup(e, t, r) {
    return this.type == e && bn(this.attrs, t || e.defaultAttrs || Ec) && v.sameSet(this.marks, r || v.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Lr(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Lr(this.type, this.attrs, this.content, e);
  }
  /**
  Create a copy of this node with only the content between the
  given positions. If `to` is not given, it defaults to the end of
  the node.
  */
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  /**
  Cut out the part of the document between the given positions, and
  return it as a `Slice` object.
  */
  slice(e, t = this.content.size, r = !1) {
    if (e == t)
      return D.empty;
    let o = this.resolve(e), s = this.resolve(t), i = r ? 0 : o.sharedDepth(t), l = o.start(i), a = o.node(i).content.cut(o.pos - l, s.pos - l);
    return new D(a, o.depth - i, s.depth - i);
  }
  /**
  Replace the part of the document between the given positions with
  the given slice. The slice must 'fit', meaning its open sides
  must be able to connect to the surrounding content, and its
  content nodes must be valid children for the node they are placed
  into. If any of this is violated, an error of type
  [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
  */
  replace(e, t, r) {
    return Ac(this.resolve(e), this.resolve(t), r);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: r, offset: o } = t.content.findIndex(e);
      if (t = t.maybeChild(r), !t)
        return null;
      if (o == e || t.isText)
        return t;
      e -= o + 1;
    }
  }
  /**
  Find the (direct) child node after the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childAfter(e) {
    let { index: t, offset: r } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: r };
  }
  /**
  Find the (direct) child node before the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: t, offset: r } = this.content.findIndex(e);
    if (r < e)
      return { node: this.content.child(t), index: t, offset: r };
    let o = this.content.child(t - 1);
    return { node: o, index: t - 1, offset: r - o.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return Wt.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Wt.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, t, r) {
    let o = !1;
    return t > e && this.nodesBetween(e, t, (s) => (r.isInSet(s.marks) && (o = !0), !o)), o;
  }
  /**
  True when this is a block (non-inline node)
  */
  get isBlock() {
    return this.type.isBlock;
  }
  /**
  True when this is a textblock node, a block node with inline
  content.
  */
  get isTextblock() {
    return this.type.isTextblock;
  }
  /**
  True when this node allows inline content.
  */
  get inlineContent() {
    return this.type.inlineContent;
  }
  /**
  True when this is an inline node (a text node or a node that can
  appear among text).
  */
  get isInline() {
    return this.type.isInline;
  }
  /**
  True when this is a text node.
  */
  get isText() {
    return this.type.isText;
  }
  /**
  True when this is a leaf node.
  */
  get isLeaf() {
    return this.type.isLeaf;
  }
  /**
  True when this is an atom, i.e. when it does not have directly
  editable content. This is usually the same as `isLeaf`, but can
  be configured with the [`atom` property](https://prosemirror.net/docs/ref/#model.NodeSpec.atom)
  on a node's spec (typically used when the node is displayed as
  an uneditable [node view](https://prosemirror.net/docs/ref/#view.NodeView)).
  */
  get isAtom() {
    return this.type.isAtom;
  }
  /**
  Return a string representation of this node for debugging
  purposes.
  */
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), Ti(this.marks, e);
  }
  /**
  Get the content match in this node at the given index.
  */
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  /**
  Test whether replacing the range between `from` and `to` (by
  child index) with the given replacement fragment (which defaults
  to the empty fragment) would leave the node's content valid. You
  can optionally pass `start` and `end` indices into the
  replacement fragment.
  */
  canReplace(e, t, r = M.empty, o = 0, s = r.childCount) {
    let i = this.contentMatchAt(e).matchFragment(r, o, s), l = i && i.matchFragment(this.content, t);
    if (!l || !l.validEnd)
      return !1;
    for (let c = o; c < s; c++)
      if (!this.type.allowsMarks(r.child(c).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, t, r, o) {
    if (o && !this.type.allowsMarks(o))
      return !1;
    let s = this.contentMatchAt(e).matchType(r), i = s && s.matchFragment(this.content, t);
    return i ? i.validEnd : !1;
  }
  /**
  Test whether the given node's content could be appended to this
  node. If that node is empty, this will only return true if there
  is at least one node type that can appear in both nodes (to avoid
  merging completely incompatible nodes).
  */
  canAppend(e) {
    return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
  }
  /**
  Check whether this node and its descendants conform to the
  schema, and raise error when they do not.
  */
  check() {
    this.type.checkContent(this.content);
    let e = v.none;
    for (let t = 0; t < this.marks.length; t++)
      e = this.marks[t].addToSet(e);
    if (!v.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`);
    this.content.forEach((t) => t.check());
  }
  /**
  Return a JSON-serializeable representation of this node.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())), e;
  }
  /**
  Deserialize a node from its JSON representation.
  */
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Node.fromJSON");
    let r = null;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      r = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, r);
    }
    let o = M.fromJSON(e, t.content);
    return e.nodeType(t.type).create(t.attrs, o, r);
  }
};
it.prototype.text = void 0;
class Cn extends it {
  /**
  @internal
  */
  constructor(e, t, r, o) {
    if (super(e, t, null, o), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : Ti(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new Cn(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new Cn(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function Ti(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class at {
  /**
  @internal
  */
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  /**
  @internal
  */
  static parse(e, t) {
    let r = new Ic(e, t);
    if (r.next == null)
      return at.empty;
    let o = Ei(r);
    r.next && r.err("Unexpected trailing text");
    let s = qc(Lc(o));
    return Rc(s, r), s;
  }
  /**
  Match a node type, returning a match after that node if
  successful.
  */
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e)
        return this.next[t].next;
    return null;
  }
  /**
  Try to match a fragment. Returns the resulting match when
  successful.
  */
  matchFragment(e, t = 0, r = e.childCount) {
    let o = this;
    for (let s = t; o && s < r; s++)
      o = o.matchType(e.child(s).type);
    return o;
  }
  /**
  @internal
  */
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  /**
  Get the first matching node type at this match position that can
  be generated.
  */
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs()))
        return t;
    }
    return null;
  }
  /**
  @internal
  */
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let r = 0; r < e.next.length; r++)
        if (this.next[t].type == e.next[r].type)
          return !0;
    return !1;
  }
  /**
  Try to match the given fragment, and if that fails, see if it can
  be made to match by inserting nodes in front of it. When
  successful, return a fragment of inserted nodes (which may be
  empty if nothing had to be inserted). When `toEnd` is true, only
  return a fragment if the resulting match goes to the end of the
  content expression.
  */
  fillBefore(e, t = !1, r = 0) {
    let o = [this];
    function s(i, l) {
      let c = i.matchFragment(e, r);
      if (c && (!t || c.validEnd))
        return M.from(l.map((a) => a.createAndFill()));
      for (let a = 0; a < i.next.length; a++) {
        let { type: u, next: f } = i.next[a];
        if (!(u.isText || u.hasRequiredAttrs()) && o.indexOf(f) == -1) {
          o.push(f);
          let h = s(f, l.concat(u));
          if (h)
            return h;
        }
      }
      return null;
    }
    return s(this, []);
  }
  /**
  Find a set of wrapping node types that would allow a node of the
  given type to appear at this position. The result may be empty
  (when it fits directly) and will be null when no such wrapping
  exists.
  */
  findWrapping(e) {
    for (let r = 0; r < this.wrapCache.length; r += 2)
      if (this.wrapCache[r] == e)
        return this.wrapCache[r + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  /**
  @internal
  */
  computeWrapping(e) {
    let t = /* @__PURE__ */ Object.create(null), r = [{ match: this, type: null, via: null }];
    for (; r.length; ) {
      let o = r.shift(), s = o.match;
      if (s.matchType(e)) {
        let i = [];
        for (let l = o; l.type; l = l.via)
          i.push(l.type);
        return i.reverse();
      }
      for (let i = 0; i < s.next.length; i++) {
        let { type: l, next: c } = s.next[i];
        !l.isLeaf && !l.hasRequiredAttrs() && !(l.name in t) && (!o.type || c.validEnd) && (r.push({ match: l.contentMatch, type: l, via: o }), t[l.name] = !0);
      }
    }
    return null;
  }
  /**
  The number of outgoing edges this node has in the finite
  automaton that describes the content expression.
  */
  get edgeCount() {
    return this.next.length;
  }
  /**
  Get the _n_​th outgoing edge from this node in the finite
  automaton that describes the content expression.
  */
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    function t(r) {
      e.push(r);
      for (let o = 0; o < r.next.length; o++)
        e.indexOf(r.next[o].next) == -1 && t(r.next[o].next);
    }
    return t(this), e.map((r, o) => {
      let s = o + (r.validEnd ? "*" : " ") + " ";
      for (let i = 0; i < r.next.length; i++)
        s += (i ? ", " : "") + r.next[i].type.name + "->" + e.indexOf(r.next[i].next);
      return s;
    }).join(`
`);
  }
}
at.empty = new at(!0);
class Ic {
  constructor(e, t) {
    this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function Ei(n) {
  let e = [];
  do
    e.push(vc(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function vc(n) {
  let e = [];
  do
    e.push(Oc(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Oc(n) {
  let e = jc(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = zc(n, e);
    else
      break;
  return e;
}
function vo(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function zc(n, e) {
  let t = vo(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = vo(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function _c(n, e) {
  let t = n.nodeTypes, r = t[e];
  if (r)
    return [r];
  let o = [];
  for (let s in t) {
    let i = t[s];
    i.groups.indexOf(e) > -1 && o.push(i);
  }
  return o.length == 0 && n.err("No node type or group '" + e + "' found"), o;
}
function jc(n) {
  if (n.eat("(")) {
    let e = Ei(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = _c(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Lc(n) {
  let e = [[]];
  return o(s(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(i, l, c) {
    let a = { term: c, to: l };
    return e[i].push(a), a;
  }
  function o(i, l) {
    i.forEach((c) => c.to = l);
  }
  function s(i, l) {
    if (i.type == "choice")
      return i.exprs.reduce((c, a) => c.concat(s(a, l)), []);
    if (i.type == "seq")
      for (let c = 0; ; c++) {
        let a = s(i.exprs[c], l);
        if (c == i.exprs.length - 1)
          return a;
        o(a, l = t());
      }
    else if (i.type == "star") {
      let c = t();
      return r(l, c), o(s(i.expr, c), c), [r(c)];
    } else if (i.type == "plus") {
      let c = t();
      return o(s(i.expr, l), c), o(s(i.expr, c), c), [r(c)];
    } else {
      if (i.type == "opt")
        return [r(l)].concat(s(i.expr, l));
      if (i.type == "range") {
        let c = l;
        for (let a = 0; a < i.min; a++) {
          let u = t();
          o(s(i.expr, c), u), c = u;
        }
        if (i.max == -1)
          o(s(i.expr, c), c);
        else
          for (let a = i.min; a < i.max; a++) {
            let u = t();
            r(c, u), o(s(i.expr, c), u), c = u;
          }
        return [r(c)];
      } else {
        if (i.type == "name")
          return [r(l, void 0, i.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function Ii(n, e) {
  return e - n;
}
function Oo(n, e) {
  let t = [];
  return r(e), t.sort(Ii);
  function r(o) {
    let s = n[o];
    if (s.length == 1 && !s[0].term)
      return r(s[0].to);
    t.push(o);
    for (let i = 0; i < s.length; i++) {
      let { term: l, to: c } = s[i];
      !l && t.indexOf(c) == -1 && r(c);
    }
  }
}
function qc(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Oo(n, 0));
  function t(r) {
    let o = [];
    r.forEach((i) => {
      n[i].forEach(({ term: l, to: c }) => {
        if (!l)
          return;
        let a;
        for (let u = 0; u < o.length; u++)
          o[u][0] == l && (a = o[u][1]);
        Oo(n, c).forEach((u) => {
          a || o.push([l, a = []]), a.indexOf(u) == -1 && a.push(u);
        });
      });
    });
    let s = e[r.join(",")] = new at(r.indexOf(n.length - 1) > -1);
    for (let i = 0; i < o.length; i++) {
      let l = o[i][1].sort(Ii);
      s.next.push({ type: o[i][0], next: e[l.join(",")] || t(l) });
    }
    return s;
  }
}
function Rc(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let o = r[t], s = !o.validEnd, i = [];
    for (let l = 0; l < o.next.length; l++) {
      let { type: c, next: a } = o.next[l];
      i.push(c.name), s && !(c.isText || c.hasRequiredAttrs()) && (s = !1), r.indexOf(a) == -1 && r.push(a);
    }
    s && e.err("Only non-generatable nodes (" + i.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function vi(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function Oi(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in n) {
    let o = e && e[r];
    if (o === void 0) {
      let s = n[r];
      if (s.hasDefault)
        o = s.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    t[r] = o;
  }
  return t;
}
function zi(n) {
  let e = /* @__PURE__ */ Object.create(null);
  if (n)
    for (let t in n)
      e[t] = new Fc(n[t]);
  return e;
}
let zo = class _i {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = zi(r.attrs), this.defaultAttrs = vi(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
  }
  /**
  True if this is an inline type.
  */
  get isInline() {
    return !this.isBlock;
  }
  /**
  True if this is a textblock type, a block that contains inline
  content.
  */
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  /**
  True for node types that allow no content.
  */
  get isLeaf() {
    return this.contentMatch == at.empty;
  }
  /**
  True when this node is an atom, i.e. when it does not have
  directly editable content.
  */
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  /**
  The node type's [whitespace](https://prosemirror.net/docs/ref/#model.NodeSpec.whitespace) option.
  */
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  /**
  Tells you whether this node type has any required attributes.
  */
  hasRequiredAttrs() {
    for (let e in this.attrs)
      if (this.attrs[e].isRequired)
        return !0;
    return !1;
  }
  /**
  Indicates whether this node allows some of the same content as
  the given node type.
  */
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  /**
  @internal
  */
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : Oi(this.attrs, e);
  }
  /**
  Create a `Node` of this type. The given attributes are
  checked and defaulted (you can pass `null` to use the type's
  defaults entirely, if no required attributes exist). `content`
  may be a `Fragment`, a node, an array of nodes, or
  `null`. Similarly `marks` may be `null` to default to the empty
  set of marks.
  */
  create(e = null, t, r) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new it(this, this.computeAttrs(e), M.from(t), v.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = M.from(t), this.checkContent(t), new it(this, this.computeAttrs(e), t, v.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
  necessary to add nodes to the start or end of the given fragment
  to make it fit the node. If no fitting wrapping can be found,
  return null. Note that, due to the fact that required nodes can
  always be created, this will always succeed if you pass null or
  `Fragment.empty` as content.
  */
  createAndFill(e = null, t, r) {
    if (e = this.computeAttrs(e), t = M.from(t), t.size) {
      let i = this.contentMatch.fillBefore(t);
      if (!i)
        return null;
      t = i.append(t);
    }
    let o = this.contentMatch.matchFragment(t), s = o && o.fillBefore(M.empty, !0);
    return s ? new it(this, e, t.append(s), v.setFrom(r)) : null;
  }
  /**
  Returns true if the given fragment is valid content for this node
  type with the given attributes.
  */
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd)
      return !1;
    for (let r = 0; r < e.childCount; r++)
      if (!this.allowsMarks(e.child(r).marks))
        return !1;
    return !0;
  }
  /**
  Throws a RangeError if the given fragment is not valid content for this
  node type.
  @internal
  */
  checkContent(e) {
    if (!this.validContent(e))
      throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
  }
  /**
  Check whether the given mark type is allowed in this node.
  */
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  /**
  Test whether the given set of marks are allowed in this node.
  */
  allowsMarks(e) {
    if (this.markSet == null)
      return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type))
        return !1;
    return !0;
  }
  /**
  Removes the marks that are not allowed in this node from the given set.
  */
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let t;
    for (let r = 0; r < e.length; r++)
      this.allowsMarkType(e[r].type) ? t && t.push(e[r]) : t || (t = e.slice(0, r));
    return t ? t.length ? t : v.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((s, i) => r[s] = new _i(s, t, i));
    let o = t.spec.topNode || "doc";
    if (!r[o])
      throw new RangeError("Schema is missing its top node type ('" + o + "')");
    if (!r.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let s in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
};
class Fc {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Ln {
  /**
  @internal
  */
  constructor(e, t, r, o) {
    this.name = e, this.rank = t, this.schema = r, this.spec = o, this.attrs = zi(o.attrs), this.excluded = null;
    let s = vi(this.attrs);
    this.instance = s ? new v(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new v(this, Oi(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), o = 0;
    return e.forEach((s, i) => r[s] = new Ln(s, o++, t, i)), r;
  }
  /**
  When there is a mark of this type in the given set, a new set
  without it is returned. Otherwise, the input set is returned.
  */
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
    return e;
  }
  /**
  Tests whether there is a mark of this type in the given set.
  */
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].type == this)
        return e[t];
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class ji {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let o in e)
      t[o] = e[o];
    t.nodes = U.from(e.nodes), t.marks = U.from(e.marks || {}), this.nodes = zo.compile(this.spec.nodes, this), this.marks = Ln.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let o in this.nodes) {
      if (o in this.marks)
        throw new RangeError(o + " can not be both a node and a mark");
      let s = this.nodes[o], i = s.spec.content || "", l = s.spec.marks;
      s.contentMatch = r[i] || (r[i] = at.parse(i, this.nodes)), s.inlineContent = s.contentMatch.inlineContent, s.markSet = l == "_" ? null : l ? _o(this, l.split(" ")) : l == "" || !s.inlineContent ? [] : null;
    }
    for (let o in this.marks) {
      let s = this.marks[o], i = s.spec.excludes;
      s.excluded = i == null ? [s] : i == "" ? [] : _o(this, i.split(" "));
    }
    this.nodeFromJSON = this.nodeFromJSON.bind(this), this.markFromJSON = this.markFromJSON.bind(this), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, t = null, r, o) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof zo) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else
      throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, r, o);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, t) {
    let r = this.nodes.text;
    return new Cn(r, r.defaultAttrs, e, v.setFrom(t));
  }
  /**
  Create a mark with the given type and attributes.
  */
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  /**
  Deserialize a node from its JSON representation. This method is
  bound.
  */
  nodeFromJSON(e) {
    return it.fromJSON(this, e);
  }
  /**
  Deserialize a mark from its JSON representation. This method is
  bound.
  */
  markFromJSON(e) {
    return v.fromJSON(this, e);
  }
  /**
  @internal
  */
  nodeType(e) {
    let t = this.nodes[e];
    if (!t)
      throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function _o(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let o = e[r], s = n.marks[o], i = s;
    if (s)
      t.push(s);
    else
      for (let l in n.marks) {
        let c = n.marks[l];
        (o == "_" || c.spec.group && c.spec.group.split(" ").indexOf(o) > -1) && t.push(i = c);
      }
    if (!i)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
class wt {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [], t.forEach((r) => {
      r.tag ? this.tags.push(r) : r.style && this.styles.push(r);
    }), this.normalizeLists = !this.tags.some((r) => {
      if (!/^(ul|ol)\b/.test(r.tag) || !r.node)
        return !1;
      let o = e.nodes[r.node];
      return o.contentMatch.matchType(o);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, t = {}) {
    let r = new Lo(this, t, !1);
    return r.addAll(e, t.from, t.to), r.finish();
  }
  /**
  Parses the content of the given DOM node, like
  [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
  options. But unlike that method, which produces a whole node,
  this one returns a slice that is open at the sides, meaning that
  the schema constraints aren't applied to the start of nodes to
  the left of the input and the end of nodes at the end.
  */
  parseSlice(e, t = {}) {
    let r = new Lo(this, t, !0);
    return r.addAll(e, t.from, t.to), D.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let o = r ? this.tags.indexOf(r) + 1 : 0; o < this.tags.length; o++) {
      let s = this.tags[o];
      if (Uc(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || t.matchesContext(s.context))) {
        if (s.getAttrs) {
          let i = s.getAttrs(e);
          if (i === !1)
            continue;
          s.attrs = i || void 0;
        }
        return s;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, t, r, o) {
    for (let s = o ? this.styles.indexOf(o) + 1 : 0; s < this.styles.length; s++) {
      let i = this.styles[s], l = i.style;
      if (!(l.indexOf(e) != 0 || i.context && !r.matchesContext(i.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))) {
        if (i.getAttrs) {
          let c = i.getAttrs(t);
          if (c === !1)
            continue;
          i.attrs = c || void 0;
        }
        return i;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let t = [];
    function r(o) {
      let s = o.priority == null ? 50 : o.priority, i = 0;
      for (; i < t.length; i++) {
        let l = t[i];
        if ((l.priority == null ? 50 : l.priority) < s)
          break;
      }
      t.splice(i, 0, o);
    }
    for (let o in e.marks) {
      let s = e.marks[o].spec.parseDOM;
      s && s.forEach((i) => {
        r(i = qo(i)), i.mark || i.ignore || i.clearMark || (i.mark = o);
      });
    }
    for (let o in e.nodes) {
      let s = e.nodes[o].spec.parseDOM;
      s && s.forEach((i) => {
        r(i = qo(i)), i.node || i.ignore || i.mark || (i.node = o);
      });
    }
    return t;
  }
  /**
  Construct a DOM parser using the parsing rules listed in a
  schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
  [priority](https://prosemirror.net/docs/ref/#model.ParseRule.priority).
  */
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new wt(e, wt.schemaRules(e)));
  }
}
const Li = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, Bc = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, qi = { ol: !0, ul: !0 }, An = 1, Sn = 2, Ut = 4;
function jo(n, e, t) {
  return e != null ? (e ? An : 0) | (e === "full" ? Sn : 0) : n && n.whitespace == "pre" ? An | Sn : t & ~Ut;
}
class fn {
  constructor(e, t, r, o, s, i, l) {
    this.type = e, this.attrs = t, this.marks = r, this.pendingMarks = o, this.solid = s, this.options = l, this.content = [], this.activeMarks = v.none, this.stashMarks = [], this.match = i || (l & Ut ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(M.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let r = this.type.contentMatch, o;
        return (o = r.findWrapping(e.type)) ? (this.match = r, o) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & An)) {
      let r = this.content[this.content.length - 1], o;
      if (r && r.isText && (o = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let s = r;
        r.text.length == o[0].length ? this.content.pop() : this.content[this.content.length - 1] = s.withText(s.text.slice(0, s.text.length - o[0].length));
      }
    }
    let t = M.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(M.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  popFromStashMark(e) {
    for (let t = this.stashMarks.length - 1; t >= 0; t--)
      if (e.eq(this.stashMarks[t]))
        return this.stashMarks.splice(t, 1)[0];
  }
  applyPending(e) {
    for (let t = 0, r = this.pendingMarks; t < r.length; t++) {
      let o = r[t];
      (this.type ? this.type.allowsMarkType(o.type) : $c(o.type, e)) && !o.isInSet(this.activeMarks) && (this.activeMarks = o.addToSet(this.activeMarks), this.pendingMarks = o.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Li.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Lo {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0;
    let o = t.topNode, s, i = jo(null, t.preserveWhitespace, 0) | (r ? Ut : 0);
    o ? s = new fn(o.type, o.attrs, v.none, v.none, !0, t.topMatch || o.type.contentMatch, i) : r ? s = new fn(null, null, v.none, v.none, !0, null, i) : s = new fn(e.schema.topNodeType, null, v.none, v.none, !0, null, i), this.nodes = [s], this.find = t.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  // Add a DOM node to the content. Text is inserted as text node,
  // otherwise, the node is passed to `addElement` or, if it has a
  // `style` attribute, `addElementWithStyles`.
  addDOM(e) {
    e.nodeType == 3 ? this.addTextNode(e) : e.nodeType == 1 && this.addElement(e);
  }
  withStyleRules(e, t) {
    let r = e.getAttribute("style");
    if (!r)
      return t();
    let o = this.readStyles(Vc(r));
    if (!o)
      return;
    let [s, i] = o, l = this.top;
    for (let c = 0; c < i.length; c++)
      this.removePendingMark(i[c], l);
    for (let c = 0; c < s.length; c++)
      this.addPendingMark(s[c]);
    t();
    for (let c = 0; c < s.length; c++)
      this.removePendingMark(s[c], l);
    for (let c = 0; c < i.length; c++)
      this.addPendingMark(i[c]);
  }
  addTextNode(e) {
    let t = e.nodeValue, r = this.top;
    if (r.options & Sn || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
      if (r.options & An)
        r.options & Sn ? t = t.replace(/\r\n?/g, `
`) : t = t.replace(/\r?\n|\r/g, " ");
      else if (t = t.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(t) && this.open == this.nodes.length - 1) {
        let o = r.content[r.content.length - 1], s = e.previousSibling;
        (!o || s && s.nodeName == "BR" || o.isText && /[ \t\r\n\u000c]$/.test(o.text)) && (t = t.slice(1));
      }
      t && this.insertNode(this.parser.schema.text(t)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, t) {
    let r = e.nodeName.toLowerCase(), o;
    qi.hasOwnProperty(r) && this.parser.normalizeLists && Pc(e);
    let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (o = this.parser.matchTag(e, this, t));
    if (s ? s.ignore : Bc.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!s || s.skip || s.closeParent) {
      s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
      let i, l = this.top, c = this.needsBlock;
      if (Li.hasOwnProperty(r))
        l.content.length && l.content[0].isInline && this.open && (this.open--, l = this.top), i = !0, l.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      s && s.skip ? this.addAll(e) : this.withStyleRules(e, () => this.addAll(e)), i && this.sync(l), this.needsBlock = c;
    } else
      this.withStyleRules(e, () => {
        this.addElementByRule(e, s, s.consuming === !1 ? o : void 0);
      });
  }
  // Called for leaf DOM nodes that would otherwise be ignored
  leafFallback(e) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`));
  }
  // Called for ignored nodes
  ignoreFallback(e) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"));
  }
  // Run any style parser associated with the node's styles. Either
  // return an array of marks, or null to indicate some of the styles
  // had a rule with `ignore` set.
  readStyles(e) {
    let t = v.none, r = v.none;
    for (let o = 0; o < e.length; o += 2)
      for (let s = void 0; ; ) {
        let i = this.parser.matchStyle(e[o], e[o + 1], this, s);
        if (!i)
          break;
        if (i.ignore)
          return null;
        if (i.clearMark ? this.top.pendingMarks.concat(this.top.activeMarks).forEach((l) => {
          i.clearMark(l) && (r = l.addToSet(r));
        }) : t = this.parser.schema.marks[i.mark].create(i.attrs).addToSet(t), i.consuming === !1)
          s = i;
        else
          break;
      }
    return [t, r];
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, t, r) {
    let o, s, i;
    t.node ? (s = this.parser.schema.nodes[t.node], s.isLeaf ? this.insertNode(s.create(t.attrs)) || this.leafFallback(e) : o = this.enter(s, t.attrs || null, t.preserveWhitespace)) : (i = this.parser.schema.marks[t.mark].create(t.attrs), this.addPendingMark(i));
    let l = this.top;
    if (s && s.isLeaf)
      this.findInside(e);
    else if (r)
      this.addElement(e, r);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((c) => this.insertNode(c));
    else {
      let c = e;
      typeof t.contentElement == "string" ? c = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? c = t.contentElement(e) : t.contentElement && (c = t.contentElement), this.findAround(e, c, !0), this.addAll(c);
    }
    o && this.sync(l) && this.open--, i && this.removePendingMark(i, l);
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, t, r) {
    let o = t || 0;
    for (let s = t ? e.childNodes[t] : e.firstChild, i = r == null ? null : e.childNodes[r]; s != i; s = s.nextSibling, ++o)
      this.findAtPoint(e, o), this.addDOM(s);
    this.findAtPoint(e, o);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e) {
    let t, r;
    for (let o = this.open; o >= 0; o--) {
      let s = this.nodes[o], i = s.findWrapping(e);
      if (i && (!t || t.length > i.length) && (t = i, r = s, !i.length) || s.solid)
        break;
    }
    if (!t)
      return !1;
    this.sync(r);
    for (let o = 0; o < t.length; o++)
      this.enterInner(t[o], null, !1);
    return !0;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let t = this.textblockFromContext();
      t && this.enterInner(t);
    }
    if (this.findPlace(e)) {
      this.closeExtra();
      let t = this.top;
      t.applyPending(e.type), t.match && (t.match = t.match.matchType(e.type));
      let r = t.activeMarks;
      for (let o = 0; o < e.marks.length; o++)
        (!t.type || t.type.allowsMarkType(e.marks[o].type)) && (r = e.marks[o].addToSet(r));
      return t.content.push(e.mark(r)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, t, r) {
    let o = this.findPlace(e.create(t));
    return o && this.enterInner(e, t, !0, r), o;
  }
  // Open a node of the given type
  enterInner(e, t = null, r = !1, o) {
    this.closeExtra();
    let s = this.top;
    s.applyPending(e), s.match = s.match && s.match.matchType(e);
    let i = jo(e, o, s.options);
    s.options & Ut && s.content.length == 0 && (i |= Ut), this.nodes.push(new fn(e, t, s.activeMarks, s.pendingMarks, r, null, i)), this.open++;
  }
  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(this.isOpen || this.options.topOpen);
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--)
      if (this.nodes[t] == e)
        return this.open = t, !0;
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let r = this.nodes[t].content;
      for (let o = r.length - 1; o >= 0; o--)
        e += r[o].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e && this.find[r].offset == t && (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, r) {
    if (e != t && this.find)
      for (let o = 0; o < this.find.length; o++)
        this.find[o].pos == null && e.nodeType == 1 && e.contains(this.find[o].node) && t.compareDocumentPosition(this.find[o].node) & (r ? 2 : 4) && (this.find[o].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  // Determines whether the given context string matches this context.
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"), r = this.options.context, o = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), s = -(r ? r.depth + 1 : 0) + (o ? 0 : 1), i = (l, c) => {
      for (; l >= 0; l--) {
        let a = t[l];
        if (a == "") {
          if (l == t.length - 1 || l == 0)
            continue;
          for (; c >= s; c--)
            if (i(l - 1, c))
              return !0;
          return !1;
        } else {
          let u = c > 0 || c == 0 && o ? this.nodes[c].type : r && c >= s ? r.node(c - s).type : null;
          if (!u || u.name != a && u.groups.indexOf(a) == -1)
            return !1;
          c--;
        }
      }
      return !0;
    };
    return i(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let r = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs)
          return r;
      }
    for (let t in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[t];
      if (r.isTextblock && r.defaultAttrs)
        return r;
    }
  }
  addPendingMark(e) {
    let t = Qc(e, this.top.pendingMarks);
    t && this.top.stashMarks.push(t), this.top.pendingMarks = e.addToSet(this.top.pendingMarks);
  }
  removePendingMark(e, t) {
    for (let r = this.open; r >= 0; r--) {
      let o = this.nodes[r];
      if (o.pendingMarks.lastIndexOf(e) > -1)
        o.pendingMarks = e.removeFromSet(o.pendingMarks);
      else {
        o.activeMarks = e.removeFromSet(o.activeMarks);
        let i = o.popFromStashMark(e);
        i && o.type && o.type.allowsMarkType(i.type) && (o.activeMarks = i.addToSet(o.activeMarks));
      }
      if (o == t)
        break;
    }
  }
}
function Pc(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && qi.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function Uc(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function Vc(n) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g, t, r = [];
  for (; t = e.exec(n); )
    r.push(t[1], t[2].trim());
  return r;
}
function qo(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function $c(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let o = t[r];
    if (!o.allowsMarkType(n))
      continue;
    let s = [], i = (l) => {
      s.push(l);
      for (let c = 0; c < l.edgeCount; c++) {
        let { type: a, next: u } = l.edge(c);
        if (a == e || s.indexOf(u) < 0 && i(u))
          return !0;
      }
    };
    if (i(o.contentMatch))
      return !0;
  }
}
function Qc(n, e) {
  for (let t = 0; t < e.length; t++)
    if (n.eq(e[t]))
      return e[t];
}
class ve {
  /**
  Create a serializer. `nodes` should map node names to functions
  that take a node and return a description of the corresponding
  DOM. `marks` does the same for mark names, but also gets an
  argument that tells it whether the mark's content is block or
  inline content (for typical use, it'll always be inline). A mark
  serializer may be `null` to indicate that marks of that type
  should not be serialized.
  */
  constructor(e, t) {
    this.nodes = e, this.marks = t;
  }
  /**
  Serialize the content of this fragment to a DOM fragment. When
  not in the browser, the `document` option, containing a DOM
  document, should be passed so that the serializer can create
  nodes.
  */
  serializeFragment(e, t = {}, r) {
    r || (r = er(t).createDocumentFragment());
    let o = r, s = [];
    return e.forEach((i) => {
      if (s.length || i.marks.length) {
        let l = 0, c = 0;
        for (; l < s.length && c < i.marks.length; ) {
          let a = i.marks[c];
          if (!this.marks[a.type.name]) {
            c++;
            continue;
          }
          if (!a.eq(s[l][0]) || a.type.spec.spanning === !1)
            break;
          l++, c++;
        }
        for (; l < s.length; )
          o = s.pop()[1];
        for (; c < i.marks.length; ) {
          let a = i.marks[c++], u = this.serializeMark(a, i.isInline, t);
          u && (s.push([a, o]), o.appendChild(u.dom), o = u.contentDOM || u.dom);
        }
      }
      o.appendChild(this.serializeNodeInner(i, t));
    }), r;
  }
  /**
  @internal
  */
  serializeNodeInner(e, t) {
    let { dom: r, contentDOM: o } = ve.renderSpec(er(t), this.nodes[e.type.name](e));
    if (o) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, o);
    }
    return r;
  }
  /**
  Serialize this node to a DOM node. This can be useful when you
  need to serialize a part of a document, as opposed to the whole
  document. To serialize a whole document, use
  [`serializeFragment`](https://prosemirror.net/docs/ref/#model.DOMSerializer.serializeFragment) on
  its [content](https://prosemirror.net/docs/ref/#model.Node.content).
  */
  serializeNode(e, t = {}) {
    let r = this.serializeNodeInner(e, t);
    for (let o = e.marks.length - 1; o >= 0; o--) {
      let s = this.serializeMark(e.marks[o], e.isInline, t);
      s && ((s.contentDOM || s.dom).appendChild(r), r = s.dom);
    }
    return r;
  }
  /**
  @internal
  */
  serializeMark(e, t, r = {}) {
    let o = this.marks[e.type.name];
    return o && ve.renderSpec(er(r), o(e, t));
  }
  /**
  Render an [output spec](https://prosemirror.net/docs/ref/#model.DOMOutputSpec) to a DOM node. If
  the spec has a hole (zero) in it, `contentDOM` will point at the
  node with the hole.
  */
  static renderSpec(e, t, r = null) {
    if (typeof t == "string")
      return { dom: e.createTextNode(t) };
    if (t.nodeType != null)
      return { dom: t };
    if (t.dom && t.dom.nodeType != null)
      return t;
    let o = t[0], s = o.indexOf(" ");
    s > 0 && (r = o.slice(0, s), o = o.slice(s + 1));
    let i, l = r ? e.createElementNS(r, o) : e.createElement(o), c = t[1], a = 1;
    if (c && typeof c == "object" && c.nodeType == null && !Array.isArray(c)) {
      a = 2;
      for (let u in c)
        if (c[u] != null) {
          let f = u.indexOf(" ");
          f > 0 ? l.setAttributeNS(u.slice(0, f), u.slice(f + 1), c[u]) : l.setAttribute(u, c[u]);
        }
    }
    for (let u = a; u < t.length; u++) {
      let f = t[u];
      if (f === 0) {
        if (u < t.length - 1 || u > a)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom: l, contentDOM: l };
      } else {
        let { dom: h, contentDOM: d } = ve.renderSpec(e, f, r);
        if (l.appendChild(h), d) {
          if (i)
            throw new RangeError("Multiple content holes");
          i = d;
        }
      }
    }
    return { dom: l, contentDOM: i };
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new ve(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Ro(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Ro(e.marks);
  }
}
function Ro(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function er(n) {
  return n.document || window.document;
}
const Ri = 65535, Fi = Math.pow(2, 16);
function Yc(n, e) {
  return n + e * Fi;
}
function Fo(n) {
  return n & Ri;
}
function Hc(n) {
  return (n - (n & Ri)) / Fi;
}
const Bi = 1, Pi = 2, kn = 4, Ui = 8;
class qr {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.pos = e, this.delInfo = t, this.recover = r;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & Ui) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (Bi | kn)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Pi | kn)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & kn) > 0;
  }
}
class ne {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && ne.empty)
      return ne.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = Fo(e);
    if (!this.inverted)
      for (let o = 0; o < r; o++)
        t += this.ranges[o * 3 + 2] - this.ranges[o * 3 + 1];
    return this.ranges[r * 3] + t + Hc(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let o = 0, s = this.inverted ? 2 : 1, i = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let c = this.ranges[l] - (this.inverted ? o : 0);
      if (c > e)
        break;
      let a = this.ranges[l + s], u = this.ranges[l + i], f = c + a;
      if (e <= f) {
        let h = a ? e == c ? -1 : e == f ? 1 : t : t, d = c + o + (h < 0 ? 0 : u);
        if (r)
          return d;
        let p = e == (t < 0 ? c : f) ? null : Yc(l / 3, e - c), m = e == c ? Pi : e == f ? Bi : kn;
        return (t < 0 ? e != c : e != f) && (m |= Ui), new qr(d, m, p);
      }
      o += u - a;
    }
    return r ? e + o : new qr(e + o, 0, null);
  }
  /**
  @internal
  */
  touches(e, t) {
    let r = 0, o = Fo(t), s = this.inverted ? 2 : 1, i = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let c = this.ranges[l] - (this.inverted ? r : 0);
      if (c > e)
        break;
      let a = this.ranges[l + s], u = c + a;
      if (e <= u && l == o * 3)
        return !0;
      r += this.ranges[l + i] - a;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let t = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let o = 0, s = 0; o < this.ranges.length; o += 3) {
      let i = this.ranges[o], l = i - (this.inverted ? s : 0), c = i + (this.inverted ? 0 : s), a = this.ranges[o + t], u = this.ranges[o + r];
      e(l, l + a, c, c + u), s += u - a;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new ne(this.ranges, !this.inverted);
  }
  /**
  @internal
  */
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  /**
  Create a map that moves all positions by offset `n` (which may be
  negative). This can be useful when applying steps meant for a
  sub-document to a larger document, or vice-versa.
  */
  static offset(e) {
    return e == 0 ? ne.empty : new ne(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
ne.empty = new ne([]);
class kt {
  /**
  Create a new mapping with the given position maps.
  */
  constructor(e = [], t, r = 0, o = e.length) {
    this.maps = e, this.mirror = t, this.from = r, this.to = o;
  }
  /**
  Create a mapping that maps only through a part of this one.
  */
  slice(e = 0, t = this.maps.length) {
    return new kt(this.maps, this.mirror, e, t);
  }
  /**
  @internal
  */
  copy() {
    return new kt(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
  }
  /**
  Add a step map to the end of this mapping. If `mirrors` is
  given, it should be the index of the step map that is the mirror
  image of this one.
  */
  appendMap(e, t) {
    this.to = this.maps.push(e), t != null && this.setMirror(this.maps.length - 1, t);
  }
  /**
  Add all the step maps in a given mapping to this one (preserving
  mirroring information).
  */
  appendMapping(e) {
    for (let t = 0, r = this.maps.length; t < e.maps.length; t++) {
      let o = e.getMirror(t);
      this.appendMap(e.maps[t], o != null && o < t ? r + o : void 0);
    }
  }
  /**
  Finds the offset of the step map that mirrors the map at the
  given offset, in this mapping (as per the second argument to
  `appendMap`).
  */
  getMirror(e) {
    if (this.mirror) {
      for (let t = 0; t < this.mirror.length; t++)
        if (this.mirror[t] == e)
          return this.mirror[t + (t % 2 ? -1 : 1)];
    }
  }
  /**
  @internal
  */
  setMirror(e, t) {
    this.mirror || (this.mirror = []), this.mirror.push(e, t);
  }
  /**
  Append the inverse of the given mapping to this one.
  */
  appendMappingInverted(e) {
    for (let t = e.maps.length - 1, r = this.maps.length + e.maps.length; t >= 0; t--) {
      let o = e.getMirror(t);
      this.appendMap(e.maps[t].invert(), o != null && o > t ? r - o - 1 : void 0);
    }
  }
  /**
  Create an inverted version of this mapping.
  */
  invert() {
    let e = new kt();
    return e.appendMappingInverted(this), e;
  }
  /**
  Map a position through this mapping.
  */
  map(e, t = 1) {
    if (this.mirror)
      return this._map(e, t, !0);
    for (let r = this.from; r < this.to; r++)
      e = this.maps[r].map(e, t);
    return e;
  }
  /**
  Map a position through this mapping, returning a mapping
  result.
  */
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  /**
  @internal
  */
  _map(e, t, r) {
    let o = 0;
    for (let s = this.from; s < this.to; s++) {
      let i = this.maps[s], l = i.mapResult(e, t);
      if (l.recover != null) {
        let c = this.getMirror(s);
        if (c != null && c > s && c < this.to) {
          s = c, e = this.maps[c].recover(l.recover);
          continue;
        }
      }
      o |= l.delInfo, e = l.pos;
    }
    return r ? e : new qr(e, o, null);
  }
}
const tr = /* @__PURE__ */ Object.create(null);
class G {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return ne.empty;
  }
  /**
  Try to merge this step with another one, to be applied directly
  after it. Returns the merged step when possible, null if the
  steps can't be merged.
  */
  merge(e) {
    return null;
  }
  /**
  Deserialize a step from its JSON representation. Will call
  through to the step class' own implementation of this method.
  */
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = tr[t.stepType];
    if (!r)
      throw new RangeError(`No step type ${t.stepType} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(e, t) {
    if (e in tr)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return tr[e] = t, t.prototype.jsonID = e, t;
  }
}
class R {
  /**
  @internal
  */
  constructor(e, t) {
    this.doc = e, this.failed = t;
  }
  /**
  Create a successful step result.
  */
  static ok(e) {
    return new R(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new R(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, o) {
    try {
      return R.ok(e.replace(t, r, o));
    } catch (s) {
      if (s instanceof Dn)
        return R.fail(s.message);
      throw s;
    }
  }
}
function ro(n, e, t) {
  let r = [];
  for (let o = 0; o < n.childCount; o++) {
    let s = n.child(o);
    s.content.size && (s = s.copy(ro(s.content, e, s))), s.isInline && (s = e(s, t, o)), r.push(s);
  }
  return M.fromArray(r);
}
class Pe extends G {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), o = r.node(r.sharedDepth(this.to)), s = new D(ro(t.content, (i, l) => !i.isAtom || !l.type.allowsMarkType(this.mark.type) ? i : i.mark(this.mark.addToSet(i.marks)), o), t.openStart, t.openEnd);
    return R.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new xe(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Pe(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Pe && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Pe(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new Pe(t.from, t.to, e.markFromJSON(t.mark));
  }
}
G.jsonID("addMark", Pe);
class xe extends G {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new D(ro(t.content, (o) => o.mark(this.mark.removeFromSet(o.marks)), e), t.openStart, t.openEnd);
    return R.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Pe(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new xe(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof xe && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new xe(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new xe(t.from, t.to, e.markFromJSON(t.mark));
  }
}
G.jsonID("removeMark", xe);
class Ue extends G {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return R.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return R.fromReplace(e, this.pos, this.pos + 1, new D(M.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let o = 0; o < t.marks.length; o++)
          if (!t.marks[o].isInSet(r))
            return new Ue(this.pos, t.marks[o]);
        return new Ue(this.pos, this.mark);
      }
    }
    return new Ct(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Ue(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new Ue(t.pos, e.markFromJSON(t.mark));
  }
}
G.jsonID("addNodeMark", Ue);
class Ct extends G {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return R.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return R.fromReplace(e, this.pos, this.pos + 1, new D(M.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new Ue(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Ct(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new Ct(t.pos, e.markFromJSON(t.mark));
  }
}
G.jsonID("removeNodeMark", Ct);
class Y extends G {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, t, r, o = !1) {
    super(), this.from = e, this.to = t, this.slice = r, this.structure = o;
  }
  apply(e) {
    return this.structure && Rr(e, this.from, this.to) ? R.fail("Structure replace would overwrite content") : R.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new ne([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new Y(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new Y(t.pos, Math.max(t.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof Y) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? D.empty : new D(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new Y(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? D.empty : new D(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new Y(e.from, this.to, t, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new Y(t.from, t.to, D.fromJSON(e, t.slice), !!t.structure);
  }
}
G.jsonID("replace", Y);
class $ extends G {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, t, r, o, s, i, l = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = r, this.gapTo = o, this.slice = s, this.insert = i, this.structure = l;
  }
  apply(e) {
    if (this.structure && (Rr(e, this.from, this.gapFrom) || Rr(e, this.gapTo, this.to)))
      return R.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return R.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? R.fromReplace(e, this.from, this.to, r) : R.fail("Content does not fit in gap");
  }
  getMap() {
    return new ne([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new $(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), o = e.map(this.gapFrom, -1), s = e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || o < t.pos || s > r.pos ? null : new $(t.pos, r.pos, o, s, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number" || typeof t.gapFrom != "number" || typeof t.gapTo != "number" || typeof t.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new $(t.from, t.to, t.gapFrom, t.gapTo, D.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
G.jsonID("replaceAround", $);
function Rr(n, e, t) {
  let r = n.resolve(e), o = t - e, s = r.depth;
  for (; o > 0 && s > 0 && r.indexAfter(s) == r.node(s).childCount; )
    s--, o--;
  if (o > 0) {
    let i = r.node(s).maybeChild(r.indexAfter(s));
    for (; o > 0; ) {
      if (!i || i.isLeaf)
        return !0;
      i = i.firstChild, o--;
    }
  }
  return !1;
}
function Gc(n, e, t, r) {
  let o = [], s = [], i, l;
  n.doc.nodesBetween(e, t, (c, a, u) => {
    if (!c.isInline)
      return;
    let f = c.marks;
    if (!r.isInSet(f) && u.type.allowsMarkType(r.type)) {
      let h = Math.max(a, e), d = Math.min(a + c.nodeSize, t), p = r.addToSet(f);
      for (let m = 0; m < f.length; m++)
        f[m].isInSet(p) || (i && i.to == h && i.mark.eq(f[m]) ? i.to = d : o.push(i = new xe(h, d, f[m])));
      l && l.to == h ? l.to = d : s.push(l = new Pe(h, d, r));
    }
  }), o.forEach((c) => n.step(c)), s.forEach((c) => n.step(c));
}
function Wc(n, e, t, r) {
  let o = [], s = 0;
  n.doc.nodesBetween(e, t, (i, l) => {
    if (!i.isInline)
      return;
    s++;
    let c = null;
    if (r instanceof Ln) {
      let a = i.marks, u;
      for (; u = r.isInSet(a); )
        (c || (c = [])).push(u), a = u.removeFromSet(a);
    } else
      r ? r.isInSet(i.marks) && (c = [r]) : c = i.marks;
    if (c && c.length) {
      let a = Math.min(l + i.nodeSize, t);
      for (let u = 0; u < c.length; u++) {
        let f = c[u], h;
        for (let d = 0; d < o.length; d++) {
          let p = o[d];
          p.step == s - 1 && f.eq(o[d].style) && (h = p);
        }
        h ? (h.to = a, h.step = s) : o.push({ style: f, from: Math.max(l, e), to: a, step: s });
      }
    }
  }), o.forEach((i) => n.step(new xe(i.from, i.to, i.style)));
}
function Jc(n, e, t, r = t.contentMatch) {
  let o = n.doc.nodeAt(e), s = [], i = e + 1;
  for (let l = 0; l < o.childCount; l++) {
    let c = o.child(l), a = i + c.nodeSize, u = r.matchType(c.type);
    if (!u)
      s.push(new Y(i, a, D.empty));
    else {
      r = u;
      for (let f = 0; f < c.marks.length; f++)
        t.allowsMarkType(c.marks[f].type) || n.step(new xe(i, a, c.marks[f]));
      if (c.isText && !t.spec.code) {
        let f, h = /\r?\n|\r/g, d;
        for (; f = h.exec(c.text); )
          d || (d = new D(M.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), s.push(new Y(i + f.index, i + f.index + f[0].length, d));
      }
    }
    i = a;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(M.empty, !0);
    n.replace(i, i, new D(l, 0, 0));
  }
  for (let l = s.length - 1; l >= 0; l--)
    n.step(s[l]);
}
function Zc(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function on(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth; ; --r) {
    let o = n.$from.node(r), s = n.$from.index(r), i = n.$to.indexAfter(r);
    if (r < n.depth && o.canReplace(s, i, t))
      return r;
    if (r == 0 || o.type.spec.isolating || !Zc(o, s, i))
      break;
  }
  return null;
}
function Kc(n, e, t) {
  let { $from: r, $to: o, depth: s } = e, i = r.before(s + 1), l = o.after(s + 1), c = i, a = l, u = M.empty, f = 0;
  for (let p = s, m = !1; p > t; p--)
    m || r.index(p) > 0 ? (m = !0, u = M.from(r.node(p).copy(u)), f++) : c--;
  let h = M.empty, d = 0;
  for (let p = s, m = !1; p > t; p--)
    m || o.after(p + 1) < o.end(p) ? (m = !0, h = M.from(o.node(p).copy(h)), d++) : a++;
  n.step(new $(c, a, i, l, new D(u.append(h), f, d), u.size - f, !0));
}
function oo(n, e, t = null, r = n) {
  let o = Xc(n, e), s = o && ea(r, e);
  return s ? o.map(Bo).concat({ type: e, attrs: t }).concat(s.map(Bo)) : null;
}
function Bo(n) {
  return { type: n, attrs: null };
}
function Xc(n, e) {
  let { parent: t, startIndex: r, endIndex: o } = n, s = t.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let i = s.length ? s[0] : e;
  return t.canReplaceWith(r, o, i) ? s : null;
}
function ea(n, e) {
  let { parent: t, startIndex: r, endIndex: o } = n, s = t.child(r), i = e.contentMatch.findWrapping(s.type);
  if (!i)
    return null;
  let c = (i.length ? i[i.length - 1] : e).contentMatch;
  for (let a = r; c && a < o; a++)
    c = c.matchType(t.child(a).type);
  return !c || !c.validEnd ? null : i;
}
function ta(n, e, t) {
  let r = M.empty;
  for (let i = t.length - 1; i >= 0; i--) {
    if (r.size) {
      let l = t[i].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = M.from(t[i].type.create(t[i].attrs, r));
  }
  let o = e.start, s = e.end;
  n.step(new $(o, s, o, s, new D(r, 0, 0), t.length, !0));
}
function na(n, e, t, r, o) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = n.steps.length;
  n.doc.nodesBetween(e, t, (i, l) => {
    if (i.isTextblock && !i.hasMarkup(r, o) && ra(n.doc, n.mapping.slice(s).map(l), r)) {
      n.clearIncompatible(n.mapping.slice(s).map(l, 1), r);
      let c = n.mapping.slice(s), a = c.map(l, 1), u = c.map(l + i.nodeSize, 1);
      return n.step(new $(a, u, a + 1, u - 1, new D(M.from(r.create(o, null, i.marks)), 0, 0), 1, !0)), !1;
    }
  });
}
function ra(n, e, t) {
  let r = n.resolve(e), o = r.index();
  return r.parent.canReplaceWith(o, o + 1, t);
}
function oa(n, e, t, r, o) {
  let s = n.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  t || (t = s.type);
  let i = t.create(r, null, o || s.marks);
  if (s.isLeaf)
    return n.replaceWith(e, e + s.nodeSize, i);
  if (!t.validContent(s.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new $(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new D(M.from(i), 0, 0), 1, !0));
}
function xt(n, e, t = 1, r) {
  let o = n.resolve(e), s = o.depth - t, i = r && r[r.length - 1] || o.parent;
  if (s < 0 || o.parent.type.spec.isolating || !o.parent.canReplace(o.index(), o.parent.childCount) || !i.type.validContent(o.parent.content.cutByIndex(o.index(), o.parent.childCount)))
    return !1;
  for (let a = o.depth - 1, u = t - 2; a > s; a--, u--) {
    let f = o.node(a), h = o.index(a);
    if (f.type.spec.isolating)
      return !1;
    let d = f.content.cutByIndex(h, f.childCount), p = r && r[u + 1];
    p && (d = d.replaceChild(0, p.type.create(p.attrs)));
    let m = r && r[u] || f;
    if (!f.canReplace(h + 1, f.childCount) || !m.type.validContent(d))
      return !1;
  }
  let l = o.indexAfter(s), c = r && r[0];
  return o.node(s).canReplaceWith(l, l, c ? c.type : o.node(s + 1).type);
}
function sa(n, e, t = 1, r) {
  let o = n.doc.resolve(e), s = M.empty, i = M.empty;
  for (let l = o.depth, c = o.depth - t, a = t - 1; l > c; l--, a--) {
    s = M.from(o.node(l).copy(s));
    let u = r && r[a];
    i = M.from(u ? u.type.create(u.attrs, i) : o.node(l).copy(i));
  }
  n.step(new Y(e, e, new D(s.append(i), t, t), !0));
}
function vt(n, e) {
  let t = n.resolve(e), r = t.index();
  return Vi(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function Vi(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function $i(n, e, t = -1) {
  let r = n.resolve(e);
  for (let o = r.depth; ; o--) {
    let s, i, l = r.index(o);
    if (o == r.depth ? (s = r.nodeBefore, i = r.nodeAfter) : t > 0 ? (s = r.node(o + 1), l++, i = r.node(o).maybeChild(l)) : (s = r.node(o).maybeChild(l - 1), i = r.node(o + 1)), s && !s.isTextblock && Vi(s, i) && r.node(o).canReplace(l, l + 1))
      return e;
    if (o == 0)
      break;
    e = t < 0 ? r.before(o) : r.after(o);
  }
}
function ia(n, e, t) {
  let r = new Y(e - t, e + t, D.empty, !0);
  n.step(r);
}
function la(n, e, t) {
  let r = n.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), t))
    return e;
  if (r.parentOffset == 0)
    for (let o = r.depth - 1; o >= 0; o--) {
      let s = r.index(o);
      if (r.node(o).canReplaceWith(s, s, t))
        return r.before(o + 1);
      if (s > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let o = r.depth - 1; o >= 0; o--) {
      let s = r.indexAfter(o);
      if (r.node(o).canReplaceWith(s, s, t))
        return r.after(o + 1);
      if (s < r.node(o).childCount)
        return null;
    }
  return null;
}
function Qi(n, e, t) {
  let r = n.resolve(e);
  if (!t.content.size)
    return e;
  let o = t.content;
  for (let s = 0; s < t.openStart; s++)
    o = o.firstChild.content;
  for (let s = 1; s <= (t.openStart == 0 && t.size ? 2 : 1); s++)
    for (let i = r.depth; i >= 0; i--) {
      let l = i == r.depth ? 0 : r.pos <= (r.start(i + 1) + r.end(i + 1)) / 2 ? -1 : 1, c = r.index(i) + (l > 0 ? 1 : 0), a = r.node(i), u = !1;
      if (s == 1)
        u = a.canReplace(c, c, o);
      else {
        let f = a.contentMatchAt(c).findWrapping(o.firstChild.type);
        u = f && a.canReplaceWith(c, c, f[0]);
      }
      if (u)
        return l == 0 ? r.pos : l < 0 ? r.before(i + 1) : r.after(i + 1);
    }
  return null;
}
function so(n, e, t = e, r = D.empty) {
  if (e == t && !r.size)
    return null;
  let o = n.resolve(e), s = n.resolve(t);
  return Yi(o, s, r) ? new Y(e, t, r) : new ca(o, s, r).fit();
}
function Yi(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class ca {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = M.empty;
    for (let o = 0; o <= e.depth; o++) {
      let s = e.node(o);
      this.frontier.push({
        type: s.type,
        match: s.contentMatchAt(e.indexAfter(o))
      });
    }
    for (let o = e.depth; o > 0; o--)
      this.placed = M.from(e.node(o).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let a = this.findFittable();
      a ? this.placeNodes(a) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, r = this.$from, o = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!o)
      return null;
    let s = this.placed, i = r.depth, l = o.depth;
    for (; i && l && s.childCount == 1; )
      s = s.firstChild.content, i--, l--;
    let c = new D(s, i, l);
    return e > -1 ? new $(r.pos, e, this.$to.pos, this.$to.end(), c, t) : c.size || r.pos != this.$to.pos ? new Y(r.pos, o.pos, c) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, r = 0, o = this.unplaced.openEnd; r < e; r++) {
      let s = t.firstChild;
      if (t.childCount > 1 && (o = 0), s.type.spec.isolating && o <= r) {
        e = r;
        break;
      }
      t = s.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let r = t == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let o, s = null;
        r ? (s = nr(this.unplaced.content, r - 1).firstChild, o = s.content) : o = this.unplaced.content;
        let i = o.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: c, match: a } = this.frontier[l], u, f = null;
          if (t == 1 && (i ? a.matchType(i.type) || (f = a.fillBefore(M.from(i), !1)) : s && c.compatibleContent(s.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, inject: f };
          if (t == 2 && i && (u = a.findWrapping(i.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, wrap: u };
          if (s && a.matchType(s.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, o = nr(e, t);
    return !o.childCount || o.firstChild.isLeaf ? !1 : (this.unplaced = new D(e, t + 1, Math.max(r, o.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, o = nr(e, t);
    if (o.childCount <= 1 && t > 0) {
      let s = e.size - t <= t + o.size;
      this.unplaced = new D(Rt(e, t - 1, 1), t - 1, s ? t - 1 : r);
    } else
      this.unplaced = new D(Rt(e, t, 1), t, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: r, inject: o, wrap: s }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (s)
      for (let m = 0; m < s.length; m++)
        this.openFrontierNode(s[m]);
    let i = this.unplaced, l = r ? r.content : i.content, c = i.openStart - e, a = 0, u = [], { match: f, type: h } = this.frontier[t];
    if (o) {
      for (let m = 0; m < o.childCount; m++)
        u.push(o.child(m));
      f = f.matchFragment(o);
    }
    let d = l.size + e - (i.content.size - i.openEnd);
    for (; a < l.childCount; ) {
      let m = l.child(a), g = f.matchType(m.type);
      if (!g)
        break;
      a++, (a > 1 || c == 0 || m.content.size) && (f = g, u.push(Hi(m.mark(h.allowedMarks(m.marks)), a == 1 ? c : 0, a == l.childCount ? d : -1)));
    }
    let p = a == l.childCount;
    p || (d = -1), this.placed = Ft(this.placed, t, M.from(u)), this.frontier[t].match = f, p && d < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = l; m < d; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), g = y.content;
    }
    this.unplaced = p ? e == 0 ? D.empty : new D(Rt(i.content, e - 1, 1), e - 1, d < 0 ? i.openEnd : e - 1) : new D(Rt(i.content, e, a), i.openStart, i.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !rr(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, o = this.$to.after(r);
    for (; r > 1 && o == this.$to.end(--r); )
      ++o;
    return o;
  }
  findCloseLevel(e) {
    e:
      for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
        let { match: r, type: o } = this.frontier[t], s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), i = rr(e, t, o, r, s);
        if (i) {
          for (let l = t - 1; l >= 0; l--) {
            let { match: c, type: a } = this.frontier[l], u = rr(e, l, a, c, !0);
            if (!u || u.childCount)
              continue e;
          }
          return { depth: t, fit: i, move: s ? e.doc.resolve(e.after(t + 1)) : e };
        }
      }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = Ft(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let o = e.node(r), s = o.type.contentMatch.fillBefore(o.content, !0, e.index(r));
      this.openFrontierNode(o.type, o.attrs, s);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let o = this.frontier[this.depth];
    o.match = o.match.matchType(e), this.placed = Ft(this.placed, this.depth, M.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(M.empty, !0);
    t.childCount && (this.placed = Ft(this.placed, this.frontier.length, t));
  }
}
function Rt(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(Rt(n.firstChild.content, e - 1, t)));
}
function Ft(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(Ft(n.lastChild.content, e - 1, t)));
}
function nr(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Hi(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Hi(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(M.empty, !0)))), n.copy(r);
}
function rr(n, e, t, r, o) {
  let s = n.node(e), i = o ? n.indexAfter(e) : n.index(e);
  if (i == s.childCount && !t.compatibleContent(s.type))
    return null;
  let l = r.fillBefore(s.content, !0, i);
  return l && !aa(t, s.content, i) ? l : null;
}
function aa(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function ua(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function fa(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let o = n.doc.resolve(e), s = n.doc.resolve(t);
  if (Yi(o, s, r))
    return n.step(new Y(e, t, r));
  let i = Wi(o, n.doc.resolve(t));
  i[i.length - 1] == 0 && i.pop();
  let l = -(o.depth + 1);
  i.unshift(l);
  for (let h = o.depth, d = o.pos - 1; h > 0; h--, d--) {
    let p = o.node(h).type.spec;
    if (p.defining || p.definingAsContext || p.isolating)
      break;
    i.indexOf(h) > -1 ? l = h : o.before(h) == d && i.splice(1, 0, -h);
  }
  let c = i.indexOf(l), a = [], u = r.openStart;
  for (let h = r.content, d = 0; ; d++) {
    let p = h.firstChild;
    if (a.push(p), d == r.openStart)
      break;
    h = p.content;
  }
  for (let h = u - 1; h >= 0; h--) {
    let d = a[h], p = ua(d.type);
    if (p && !d.sameMarkup(o.node(Math.abs(l) - 1)))
      u = h;
    else if (p || !d.type.isTextblock)
      break;
  }
  for (let h = r.openStart; h >= 0; h--) {
    let d = (h + u + 1) % (r.openStart + 1), p = a[d];
    if (p)
      for (let m = 0; m < i.length; m++) {
        let g = i[(m + c) % i.length], y = !0;
        g < 0 && (y = !1, g = -g);
        let k = o.node(g - 1), w = o.index(g - 1);
        if (k.canReplaceWith(w, w, p.type, p.marks))
          return n.replace(o.before(g), y ? s.after(g) : t, new D(Gi(r.content, 0, r.openStart, d), d, r.openEnd));
      }
  }
  let f = n.steps.length;
  for (let h = i.length - 1; h >= 0 && (n.replace(e, t, r), !(n.steps.length > f)); h--) {
    let d = i[h];
    d < 0 || (e = o.before(d), t = s.after(d));
  }
}
function Gi(n, e, t, r, o) {
  if (e < t) {
    let s = n.firstChild;
    n = n.replaceChild(0, s.copy(Gi(s.content, e + 1, t, r, s)));
  }
  if (e > r) {
    let s = o.contentMatchAt(0), i = s.fillBefore(n).append(n);
    n = i.append(s.matchFragment(i).fillBefore(M.empty, !0));
  }
  return n;
}
function ha(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let o = la(n.doc, e, r.type);
    o != null && (e = t = o);
  }
  n.replaceRange(e, t, new D(M.from(r), 0, 0));
}
function da(n, e, t) {
  let r = n.doc.resolve(e), o = n.doc.resolve(t), s = Wi(r, o);
  for (let i = 0; i < s.length; i++) {
    let l = s[i], c = i == s.length - 1;
    if (c && l == 0 || r.node(l).type.contentMatch.validEnd)
      return n.delete(r.start(l), o.end(l));
    if (l > 0 && (c || r.node(l - 1).canReplace(r.index(l - 1), o.indexAfter(l - 1))))
      return n.delete(r.before(l), o.after(l));
  }
  for (let i = 1; i <= r.depth && i <= o.depth; i++)
    if (e - r.start(i) == r.depth - i && t > r.end(i) && o.end(i) - t != o.depth - i)
      return n.delete(r.before(i), t);
  n.delete(e, t);
}
function Wi(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let o = r; o >= 0; o--) {
    let s = n.start(o);
    if (s < n.pos - (n.depth - o) || e.end(o) > e.pos + (e.depth - o) || n.node(o).type.spec.isolating || e.node(o).type.spec.isolating)
      break;
    (s == e.start(o) || o == n.depth && o == e.depth && n.parent.inlineContent && e.parent.inlineContent && o && e.start(o - 1) == s - 1) && t.push(o);
  }
  return t;
}
class bt extends G {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return R.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in t.attrs)
      r[s] = t.attrs[s];
    r[this.attr] = this.value;
    let o = t.type.create(r, null, t.marks);
    return R.fromReplace(e, this.pos, this.pos + 1, new D(M.from(o), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return ne.empty;
  }
  invert(e) {
    return new bt(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new bt(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new bt(t.pos, t.attr, t.value);
  }
}
G.jsonID("attr", bt);
class Jt extends G {
  /**
  Construct an attribute step.
  */
  constructor(e, t) {
    super(), this.attr = e, this.value = t;
  }
  apply(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let o in e.attrs)
      t[o] = e.attrs[o];
    t[this.attr] = this.value;
    let r = e.type.create(t, e.content, e.marks);
    return R.ok(r);
  }
  getMap() {
    return ne.empty;
  }
  invert(e) {
    return new Jt(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new Jt(t.attr, t.value);
  }
}
G.jsonID("docAttr", Jt);
let At = class extends Error {
};
At = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
At.prototype = Object.create(Error.prototype);
At.prototype.constructor = At;
At.prototype.name = "TransformError";
class pa {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new kt();
  }
  /**
  The starting document.
  */
  get before() {
    return this.docs.length ? this.docs[0] : this.doc;
  }
  /**
  Apply a new step in this transform, saving the result. Throws an
  error when the step fails.
  */
  step(e) {
    let t = this.maybeStep(e);
    if (t.failed)
      throw new At(t.failed);
    return this;
  }
  /**
  Try to apply a step in this transformation, ignoring it if it
  fails. Returns the step result.
  */
  maybeStep(e) {
    let t = e.apply(this.doc);
    return t.failed || this.addStep(e, t.doc), t;
  }
  /**
  True when the document has been changed (when there are any
  steps).
  */
  get docChanged() {
    return this.steps.length > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
  }
  /**
  Replace the part of the document between `from` and `to` with the
  given `slice`.
  */
  replace(e, t = e, r = D.empty) {
    let o = so(this.doc, e, t, r);
    return o && this.step(o), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new D(M.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, D.empty);
  }
  /**
  Insert the given content at the given position.
  */
  insert(e, t) {
    return this.replaceWith(e, e, t);
  }
  /**
  Replace a range of the document with a given slice, using
  `from`, `to`, and the slice's
  [`openStart`](https://prosemirror.net/docs/ref/#model.Slice.openStart) property as hints, rather
  than fixed start and end points. This method may grow the
  replaced area or close open nodes in the slice in order to get a
  fit that is more in line with WYSIWYG expectations, by dropping
  fully covered parent nodes of the replaced region when they are
  marked [non-defining as
  context](https://prosemirror.net/docs/ref/#model.NodeSpec.definingAsContext), or including an
  open parent node from the slice that _is_ marked as [defining
  its content](https://prosemirror.net/docs/ref/#model.NodeSpec.definingForContent).
  
  This is the method, for example, to handle paste. The similar
  [`replace`](https://prosemirror.net/docs/ref/#transform.Transform.replace) method is a more
  primitive tool which will _not_ move the start and end of its given
  range, and is useful in situations where you need more precise
  control over what happens.
  */
  replaceRange(e, t, r) {
    return fa(this, e, t, r), this;
  }
  /**
  Replace the given range with a node, but use `from` and `to` as
  hints, rather than precise positions. When from and to are the same
  and are at the start or end of a parent node in which the given
  node doesn't fit, this method may _move_ them out towards a parent
  that does allow the given node to be placed. When the given range
  completely covers a parent node, this method may completely replace
  that parent node.
  */
  replaceRangeWith(e, t, r) {
    return ha(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return da(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return Kc(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return ia(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return ta(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, o = null) {
    return na(this, e, t, r, o), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, o) {
    return oa(this, e, t, r, o), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new bt(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new Jt(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new Ue(e, t)), this;
  }
  /**
  Remove a mark (or a mark of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    if (!(t instanceof v)) {
      let r = this.doc.nodeAt(e);
      if (!r)
        throw new RangeError("No node at position " + e);
      if (t = t.isInSet(r.marks), !t)
        return this;
    }
    return this.step(new Ct(e, t)), this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split.
  */
  split(e, t = 1, r) {
    return sa(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return Gc(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return Wc(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return Jc(this, e, t, r), this;
  }
}
const or = /* @__PURE__ */ Object.create(null);
class I {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new ma(e.min(t), e.max(t))];
  }
  /**
  The selection's anchor, as an unresolved position.
  */
  get anchor() {
    return this.$anchor.pos;
  }
  /**
  The selection's head.
  */
  get head() {
    return this.$head.pos;
  }
  /**
  The lower bound of the selection's main range.
  */
  get from() {
    return this.$from.pos;
  }
  /**
  The upper bound of the selection's main range.
  */
  get to() {
    return this.$to.pos;
  }
  /**
  The resolved lower  bound of the selection's main range.
  */
  get $from() {
    return this.ranges[0].$from;
  }
  /**
  The resolved upper bound of the selection's main range.
  */
  get $to() {
    return this.ranges[0].$to;
  }
  /**
  Indicates whether the selection contains any content.
  */
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos)
        return !1;
    return !0;
  }
  /**
  Get the content of this selection as a slice.
  */
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  /**
  Replace the selection with a slice or, if no slice is given,
  delete the selection. Will append to the given transaction.
  */
  replace(e, t = D.empty) {
    let r = t.content.lastChild, o = null;
    for (let l = 0; l < t.openEnd; l++)
      o = r, r = r.lastChild;
    let s = e.steps.length, i = this.ranges;
    for (let l = 0; l < i.length; l++) {
      let { $from: c, $to: a } = i[l], u = e.mapping.slice(s);
      e.replaceRange(u.map(c.pos), u.map(a.pos), l ? D.empty : t), l == 0 && Vo(e, s, (r ? r.isInline : o && o.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, t) {
    let r = e.steps.length, o = this.ranges;
    for (let s = 0; s < o.length; s++) {
      let { $from: i, $to: l } = o[s], c = e.mapping.slice(r), a = c.map(i.pos), u = c.map(l.pos);
      s ? e.deleteRange(a, u) : (e.replaceRangeWith(a, u, t), Vo(e, r, t.isInline ? -1 : 1));
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom(e, t, r = !1) {
    let o = e.parent.inlineContent ? new j(e) : gt(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (o)
      return o;
    for (let s = e.depth - 1; s >= 0; s--) {
      let i = t < 0 ? gt(e.node(0), e.node(s), e.before(s + 1), e.index(s), t, r) : gt(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, t, r);
      if (i)
        return i;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new re(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return gt(e, e, 0, 0, 1) || new re(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return gt(e, e, e.content.size, e.childCount, -1) || new re(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = or[t.type];
    if (!r)
      throw new RangeError(`No selection type ${t.type} defined`);
    return r.fromJSON(e, t);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(e, t) {
    if (e in or)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return or[e] = t, t.prototype.jsonID = e, t;
  }
  /**
  Get a [bookmark](https://prosemirror.net/docs/ref/#state.SelectionBookmark) for this selection,
  which is a value that can be mapped without having access to a
  current document, and later resolved to a real selection for a
  given document again. (This is used mostly by the history to
  track and restore old selections.) The default implementation of
  this method just converts the selection to a text selection and
  returns the bookmark for that.
  */
  getBookmark() {
    return j.between(this.$anchor, this.$head).getBookmark();
  }
}
I.prototype.visible = !0;
class ma {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Po = !1;
function Uo(n) {
  !Po && !n.parent.inlineContent && (Po = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class j extends I {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Uo(e), Uo(t), super(e, t);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    if (!r.parent.inlineContent)
      return I.near(r);
    let o = e.resolve(t.map(this.anchor));
    return new j(o.parent.inlineContent ? o : r, r);
  }
  replace(e, t = D.empty) {
    if (super.replace(e, t), t == D.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof j && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new qn(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new j(e.resolve(t.anchor), e.resolve(t.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, t, r = t) {
    let o = e.resolve(t);
    return new this(o, r == t ? o : e.resolve(r));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between(e, t, r) {
    let o = e.pos - t.pos;
    if ((!r || o) && (r = o >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let s = I.findFrom(t, r, !0) || I.findFrom(t, -r, !0);
      if (s)
        t = s.$head;
      else
        return I.near(t, r);
    }
    return e.parent.inlineContent || (o == 0 ? e = t : (e = (I.findFrom(e, -r, !0) || I.findFrom(e, r, !0)).$anchor, e.pos < t.pos != o < 0 && (e = t))), new j(e, t);
  }
}
I.jsonID("text", j);
class qn {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new qn(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return j.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class C extends I {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let t = e.nodeAfter, r = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, r), this.node = t;
  }
  map(e, t) {
    let { deleted: r, pos: o } = t.mapResult(this.anchor), s = e.resolve(o);
    return r ? I.near(s) : new C(s);
  }
  content() {
    return new D(M.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof C && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new io(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new C(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new C(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
C.prototype.visible = !1;
I.jsonID("node", C);
class io {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new qn(r, r) : new io(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && C.isSelectable(r) ? new C(t) : I.near(t);
  }
}
class re extends I {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = D.empty) {
    if (t == D.empty) {
      e.delete(0, e.doc.content.size);
      let r = I.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else
      super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(e) {
    return new re(e);
  }
  map(e) {
    return new re(e);
  }
  eq(e) {
    return e instanceof re;
  }
  getBookmark() {
    return ga;
  }
}
I.jsonID("all", re);
const ga = {
  map() {
    return this;
  },
  resolve(n) {
    return new re(n);
  }
};
function gt(n, e, t, r, o, s = !1) {
  if (e.inlineContent)
    return j.create(n, t);
  for (let i = r - (o > 0 ? 0 : 1); o > 0 ? i < e.childCount : i >= 0; i += o) {
    let l = e.child(i);
    if (l.isAtom) {
      if (!s && C.isSelectable(l))
        return C.create(n, t - (o < 0 ? l.nodeSize : 0));
    } else {
      let c = gt(n, l, t + o, o < 0 ? l.childCount : 0, o, s);
      if (c)
        return c;
    }
    t += l.nodeSize * o;
  }
  return null;
}
function Vo(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let o = n.steps[r];
  if (!(o instanceof Y || o instanceof $))
    return;
  let s = n.mapping.maps[r], i;
  s.forEach((l, c, a, u) => {
    i == null && (i = u);
  }), n.setSelection(I.near(n.doc.resolve(i), t));
}
const $o = 1, hn = 2, Qo = 4;
class ya extends pa {
  /**
  @internal
  */
  constructor(e) {
    super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = /* @__PURE__ */ Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
  }
  /**
  The transaction's current selection. This defaults to the editor
  selection [mapped](https://prosemirror.net/docs/ref/#state.Selection.map) through the steps in the
  transaction, but can be overwritten with
  [`setSelection`](https://prosemirror.net/docs/ref/#state.Transaction.setSelection).
  */
  get selection() {
    return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
  }
  /**
  Update the transaction's current selection. Will determine the
  selection that the editor gets when the transaction is applied.
  */
  setSelection(e) {
    if (e.$from.doc != this.doc)
      throw new RangeError("Selection passed to setSelection must point at the current document");
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | $o) & ~hn, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & $o) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= hn, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return v.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
  }
  /**
  Add a mark to the set of stored marks.
  */
  addStoredMark(e) {
    return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Remove a mark or mark type from the set of stored marks.
  */
  removeStoredMark(e) {
    return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
  }
  /**
  Whether the stored marks were explicitly set for this transaction.
  */
  get storedMarksSet() {
    return (this.updated & hn) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~hn, this.storedMarks = null;
  }
  /**
  Update the timestamp for the transaction.
  */
  setTime(e) {
    return this.time = e, this;
  }
  /**
  Replace the current selection with the given slice.
  */
  replaceSelection(e) {
    return this.selection.replace(this, e), this;
  }
  /**
  Replace the selection with the given node. When `inheritMarks` is
  true and the content is inline, it inherits the marks from the
  place where it is inserted.
  */
  replaceSelectionWith(e, t = !0) {
    let r = this.selection;
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || v.none))), r.replaceWith(this, e), this;
  }
  /**
  Delete the selection.
  */
  deleteSelection() {
    return this.selection.replace(this), this;
  }
  /**
  Replace the given range, or the selection if no range is given,
  with a text node containing the given string.
  */
  insertText(e, t, r) {
    let o = this.doc.type.schema;
    if (t == null)
      return e ? this.replaceSelectionWith(o.text(e), !0) : this.deleteSelection();
    {
      if (r == null && (r = t), r = r ?? t, !e)
        return this.deleteRange(t, r);
      let s = this.storedMarks;
      if (!s) {
        let i = this.doc.resolve(t);
        s = r == t ? i.marks() : i.marksAcross(this.doc.resolve(r));
      }
      return this.replaceRangeWith(t, r, o.text(e, s)), this.selection.empty || this.setSelection(I.near(this.selection.$to)), this;
    }
  }
  /**
  Store a metadata property in this transaction, keyed either by
  name or by plugin.
  */
  setMeta(e, t) {
    return this.meta[typeof e == "string" ? e : e.key] = t, this;
  }
  /**
  Retrieve a metadata property for a given name or plugin.
  */
  getMeta(e) {
    return this.meta[typeof e == "string" ? e : e.key];
  }
  /**
  Returns true if this transaction doesn't contain any metadata,
  and can thus safely be extended.
  */
  get isGeneric() {
    for (let e in this.meta)
      return !1;
    return !0;
  }
  /**
  Indicate that the editor should scroll the selection into view
  when updated to the state produced by this transaction.
  */
  scrollIntoView() {
    return this.updated |= Qo, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & Qo) > 0;
  }
}
function Yo(n, e) {
  return !e || !n ? n : n.bind(e);
}
class Bt {
  constructor(e, t, r) {
    this.name = e, this.init = Yo(t.init, r), this.apply = Yo(t.apply, r);
  }
}
const Ma = [
  new Bt("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new Bt("selection", {
    init(n, e) {
      return n.selection || I.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new Bt("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new Bt("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class sr {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = Ma.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new Bt(r.key, r.spec.state, r));
    });
  }
}
class Mt {
  /**
  @internal
  */
  constructor(e) {
    this.config = e;
  }
  /**
  The schema of the state's document.
  */
  get schema() {
    return this.config.schema;
  }
  /**
  The plugins that are active in this state.
  */
  get plugins() {
    return this.config.plugins;
  }
  /**
  Apply the given transaction to produce a new state.
  */
  apply(e) {
    return this.applyTransaction(e).state;
  }
  /**
  @internal
  */
  filterTransaction(e, t = -1) {
    for (let r = 0; r < this.config.plugins.length; r++)
      if (r != t) {
        let o = this.config.plugins[r];
        if (o.spec.filterTransaction && !o.spec.filterTransaction.call(o, e, this))
          return !1;
      }
    return !0;
  }
  /**
  Verbose variant of [`apply`](https://prosemirror.net/docs/ref/#state.EditorState.apply) that
  returns the precise transactions that were applied (which might
  be influenced by the [transaction
  hooks](https://prosemirror.net/docs/ref/#state.PluginSpec.filterTransaction) of
  plugins) along with the new state.
  */
  applyTransaction(e) {
    if (!this.filterTransaction(e))
      return { state: this, transactions: [] };
    let t = [e], r = this.applyInner(e), o = null;
    for (; ; ) {
      let s = !1;
      for (let i = 0; i < this.config.plugins.length; i++) {
        let l = this.config.plugins[i];
        if (l.spec.appendTransaction) {
          let c = o ? o[i].n : 0, a = o ? o[i].state : this, u = c < t.length && l.spec.appendTransaction.call(l, c ? t.slice(c) : t, a, r);
          if (u && r.filterTransaction(u, i)) {
            if (u.setMeta("appendedTransaction", e), !o) {
              o = [];
              for (let f = 0; f < this.config.plugins.length; f++)
                o.push(f < i ? { state: r, n: t.length } : { state: this, n: 0 });
            }
            t.push(u), r = r.applyInner(u), s = !0;
          }
          o && (o[i] = { state: r, n: t.length });
        }
      }
      if (!s)
        return { state: r, transactions: t };
    }
  }
  /**
  @internal
  */
  applyInner(e) {
    if (!e.before.eq(this.doc))
      throw new RangeError("Applying a mismatched transaction");
    let t = new Mt(this.config), r = this.config.fields;
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      t[s.name] = s.apply(e, this[s.name], this, t);
    }
    return t;
  }
  /**
  Start a [transaction](https://prosemirror.net/docs/ref/#state.Transaction) from this state.
  */
  get tr() {
    return new ya(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new sr(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new Mt(t);
    for (let o = 0; o < t.fields.length; o++)
      r[t.fields[o].name] = t.fields[o].init(e, r);
    return r;
  }
  /**
  Create a new state based on this one, but with an adjusted set
  of active plugins. State fields that exist in both sets of
  plugins are kept unchanged. Those that no longer exist are
  dropped, and those that are new are initialized using their
  [`init`](https://prosemirror.net/docs/ref/#state.StateField.init) method, passing in the new
  configuration object..
  */
  reconfigure(e) {
    let t = new sr(this.schema, e.plugins), r = t.fields, o = new Mt(t);
    for (let s = 0; s < r.length; s++) {
      let i = r[s].name;
      o[i] = this.hasOwnProperty(i) ? this[i] : r[s].init(e, o);
    }
    return o;
  }
  /**
  Serialize this state to JSON. If you want to serialize the state
  of plugins, pass an object mapping property names to use in the
  resulting JSON object to plugin objects. The argument may also be
  a string or number, in which case it is ignored, to support the
  way `JSON.stringify` calls `toString` methods.
  */
  toJSON(e) {
    let t = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
    if (this.storedMarks && (t.storedMarks = this.storedMarks.map((r) => r.toJSON())), e && typeof e == "object")
      for (let r in e) {
        if (r == "doc" || r == "selection")
          throw new RangeError("The JSON fields `doc` and `selection` are reserved");
        let o = e[r], s = o.spec.state;
        s && s.toJSON && (t[r] = s.toJSON.call(o, this[o.key]));
      }
    return t;
  }
  /**
  Deserialize a JSON representation of a state. `config` should
  have at least a `schema` field, and should contain array of
  plugins to initialize the state with. `pluginFields` can be used
  to deserialize the state of plugins, by associating plugin
  instances with the property names they use in the JSON object.
  */
  static fromJSON(e, t, r) {
    if (!t)
      throw new RangeError("Invalid input for EditorState.fromJSON");
    if (!e.schema)
      throw new RangeError("Required config field 'schema' missing");
    let o = new sr(e.schema, e.plugins), s = new Mt(o);
    return o.fields.forEach((i) => {
      if (i.name == "doc")
        s.doc = it.fromJSON(e.schema, t.doc);
      else if (i.name == "selection")
        s.selection = I.fromJSON(s.doc, t.selection);
      else if (i.name == "storedMarks")
        t.storedMarks && (s.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
      else {
        if (r)
          for (let l in r) {
            let c = r[l], a = c.spec.state;
            if (c.key == i.name && a && a.fromJSON && Object.prototype.hasOwnProperty.call(t, l)) {
              s[i.name] = a.fromJSON.call(c, e, t[l], s);
              return;
            }
          }
        s[i.name] = i.init(e, s);
      }
    }), s;
  }
}
function Ji(n, e, t) {
  for (let r in n) {
    let o = n[r];
    o instanceof Function ? o = o.bind(e) : r == "handleDOMEvents" && (o = Ji(o, e, {})), t[r] = o;
  }
  return t;
}
class ze {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Ji(e.props, this, this.props), this.key = e.key ? e.key.key : Zi("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const ir = /* @__PURE__ */ Object.create(null);
function Zi(n) {
  return n in ir ? n + "$" + ++ir[n] : (ir[n] = 0, n + "$");
}
class Ki {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Zi(e);
  }
  /**
  Get the active plugin with this key, if any, from an editor
  state.
  */
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  /**
  Get the plugin's state from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const J = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, Zt = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let Ho = null;
const Te = function(n, e, t) {
  let r = Ho || (Ho = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, ut = function(n, e, t, r) {
  return t && (Go(n, e, t, r, -1) || Go(n, e, t, r, 1));
}, ka = /^(img|br|input|textarea|hr)$/i;
function Go(n, e, t, r, o) {
  for (; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (o < 0 ? 0 : ke(n))) {
      let s = n.parentNode;
      if (!s || s.nodeType != 1 || lo(n) || ka.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = J(n) + (o < 0 ? 0 : 1), n = s;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (o < 0 ? -1 : 0)], n.contentEditable == "false")
        return !1;
      e = o < 0 ? ke(n) : 0;
    } else
      return !1;
  }
}
function ke(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function xa(n, e, t) {
  for (let r = e == 0, o = e == ke(n); r || o; ) {
    if (n == t)
      return !0;
    let s = J(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && s == 0, o = o && s == ke(n);
  }
}
function lo(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Rn = function(n) {
  return n.focusNode && ut(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function et(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function ba(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function Da(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let r = n.caretPositionFromPoint(e, t);
      if (r)
        return { node: r.offsetNode, offset: r.offset };
    } catch {
    }
  if (n.caretRangeFromPoint) {
    let r = n.caretRangeFromPoint(e, t);
    if (r)
      return { node: r.startContainer, offset: r.startOffset };
  }
}
const Ne = typeof navigator < "u" ? navigator : null, Wo = typeof document < "u" ? document : null, We = Ne && Ne.userAgent || "", Fr = /Edge\/(\d+)/.exec(We), Xi = /MSIE \d/.exec(We), Br = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(We), te = !!(Xi || Br || Fr), $e = Xi ? document.documentMode : Br ? +Br[1] : Fr ? +Fr[1] : 0, me = !te && /gecko\/(\d+)/i.test(We);
me && +(/Firefox\/(\d+)/.exec(We) || [0, 0])[1];
const Pr = !te && /Chrome\/(\d+)/.exec(We), H = !!Pr, Na = Pr ? +Pr[1] : 0, Z = !te && !!Ne && /Apple Computer/.test(Ne.vendor), St = Z && (/Mobile\/\w+/.test(We) || !!Ne && Ne.maxTouchPoints > 2), ie = St || (Ne ? /Mac/.test(Ne.platform) : !1), wa = Ne ? /Win/.test(Ne.platform) : !1, de = /Android \d/.test(We), sn = !!Wo && "webkitFontSmoothing" in Wo.documentElement.style, Ca = sn ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function Aa(n) {
  return {
    left: 0,
    right: n.documentElement.clientWidth,
    top: 0,
    bottom: n.documentElement.clientHeight
  };
}
function Se(n, e) {
  return typeof n == "number" ? n : n[e];
}
function Sa(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function Jo(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, o = n.someProp("scrollMargin") || 5, s = n.dom.ownerDocument;
  for (let i = t || n.dom; i; i = Zt(i)) {
    if (i.nodeType != 1)
      continue;
    let l = i, c = l == s.body, a = c ? Aa(s) : Sa(l), u = 0, f = 0;
    if (e.top < a.top + Se(r, "top") ? f = -(a.top - e.top + Se(o, "top")) : e.bottom > a.bottom - Se(r, "bottom") && (f = e.bottom - e.top > a.bottom - a.top ? e.top + Se(o, "top") - a.top : e.bottom - a.bottom + Se(o, "bottom")), e.left < a.left + Se(r, "left") ? u = -(a.left - e.left + Se(o, "left")) : e.right > a.right - Se(r, "right") && (u = e.right - a.right + Se(o, "right")), u || f)
      if (c)
        s.defaultView.scrollBy(u, f);
      else {
        let h = l.scrollLeft, d = l.scrollTop;
        f && (l.scrollTop += f), u && (l.scrollLeft += u);
        let p = l.scrollLeft - h, m = l.scrollTop - d;
        e = { left: e.left - p, top: e.top - m, right: e.right - p, bottom: e.bottom - m };
      }
    if (c || /^(fixed|sticky)$/.test(getComputedStyle(i).position))
      break;
  }
}
function Ta(n) {
  let e = n.dom.getBoundingClientRect(), t = Math.max(0, e.top), r, o;
  for (let s = (e.left + e.right) / 2, i = t + 1; i < Math.min(innerHeight, e.bottom); i += 5) {
    let l = n.root.elementFromPoint(s, i);
    if (!l || l == n.dom || !n.dom.contains(l))
      continue;
    let c = l.getBoundingClientRect();
    if (c.top >= t - 20) {
      r = l, o = c.top;
      break;
    }
  }
  return { refDOM: r, refTop: o, stack: el(n.dom) };
}
function el(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = Zt(r))
    ;
  return e;
}
function Ea({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  tl(t, r == 0 ? 0 : r - e);
}
function tl(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: o, left: s } = n[t];
    r.scrollTop != o + e && (r.scrollTop = o + e), r.scrollLeft != s && (r.scrollLeft = s);
  }
}
let dt = null;
function Ia(n) {
  if (n.setActive)
    return n.setActive();
  if (dt)
    return n.focus(dt);
  let e = el(n);
  n.focus(dt == null ? {
    get preventScroll() {
      return dt = { preventScroll: !0 }, !0;
    }
  } : void 0), dt || (dt = !1, tl(e, 0));
}
function nl(n, e) {
  let t, r = 2e8, o, s = 0, i = e.top, l = e.top, c, a;
  for (let u = n.firstChild, f = 0; u; u = u.nextSibling, f++) {
    let h;
    if (u.nodeType == 1)
      h = u.getClientRects();
    else if (u.nodeType == 3)
      h = Te(u).getClientRects();
    else
      continue;
    for (let d = 0; d < h.length; d++) {
      let p = h[d];
      if (p.top <= i && p.bottom >= l) {
        i = Math.max(p.bottom, i), l = Math.min(p.top, l);
        let m = p.left > e.left ? p.left - e.left : p.right < e.left ? e.left - p.right : 0;
        if (m < r) {
          t = u, r = m, o = m && t.nodeType == 3 ? {
            left: p.right < e.left ? p.right : p.left,
            top: e.top
          } : e, u.nodeType == 1 && m && (s = f + (e.left >= (p.left + p.right) / 2 ? 1 : 0));
          continue;
        }
      } else
        p.top > e.top && !c && p.left <= e.left && p.right >= e.left && (c = u, a = { left: Math.max(p.left, Math.min(p.right, e.left)), top: p.top });
      !t && (e.left >= p.right && e.top >= p.top || e.left >= p.left && e.top >= p.bottom) && (s = f + 1);
    }
  }
  return !t && c && (t = c, o = a, r = 0), t && t.nodeType == 3 ? va(t, o) : !t || r && t.nodeType == 1 ? { node: n, offset: s } : nl(t, o);
}
function va(n, e) {
  let t = n.nodeValue.length, r = document.createRange();
  for (let o = 0; o < t; o++) {
    r.setEnd(n, o + 1), r.setStart(n, o);
    let s = Le(r, 1);
    if (s.top != s.bottom && co(e, s))
      return { node: n, offset: o + (e.left >= (s.left + s.right) / 2 ? 1 : 0) };
  }
  return { node: n, offset: 0 };
}
function co(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function Oa(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function za(n, e, t) {
  let { node: r, offset: o } = nl(e, t), s = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let i = r.getBoundingClientRect();
    s = i.left != i.right && t.left > (i.left + i.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, o, s);
}
function _a(n, e, t, r) {
  let o = -1;
  for (let s = e, i = !1; s != n.dom; ) {
    let l = n.docView.nearestDesc(s, !0);
    if (!l)
      return null;
    if (l.dom.nodeType == 1 && (l.node.isBlock && l.parent && !i || !l.contentDOM)) {
      let c = l.dom.getBoundingClientRect();
      if (l.node.isBlock && l.parent && !i && (i = !0, c.left > r.left || c.top > r.top ? o = l.posBefore : (c.right < r.left || c.bottom < r.top) && (o = l.posAfter)), !l.contentDOM && o < 0 && !l.node.isText)
        return (l.node.isBlock ? r.top < (c.top + c.bottom) / 2 : r.left < (c.left + c.right) / 2) ? l.posBefore : l.posAfter;
    }
    s = l.dom.parentNode;
  }
  return o > -1 ? o : n.docView.posFromDOM(e, t, -1);
}
function rl(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let o = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), s = o; ; ) {
      let i = n.childNodes[s];
      if (i.nodeType == 1) {
        let l = i.getClientRects();
        for (let c = 0; c < l.length; c++) {
          let a = l[c];
          if (co(e, a))
            return rl(i, e, a);
        }
      }
      if ((s = (s + 1) % r) == o)
        break;
    }
  return n;
}
function ja(n, e) {
  let t = n.dom.ownerDocument, r, o = 0, s = Da(t, e.left, e.top);
  s && ({ node: r, offset: o } = s);
  let i = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), l;
  if (!i || !n.dom.contains(i.nodeType != 1 ? i.parentNode : i)) {
    let a = n.dom.getBoundingClientRect();
    if (!co(e, a) || (i = rl(n.dom, e, a), !i))
      return null;
  }
  if (Z)
    for (let a = i; r && a; a = Zt(a))
      a.draggable && (r = void 0);
  if (i = Oa(i, e), r) {
    if (me && r.nodeType == 1 && (o = Math.min(o, r.childNodes.length), o < r.childNodes.length)) {
      let u = r.childNodes[o], f;
      u.nodeName == "IMG" && (f = u.getBoundingClientRect()).right <= e.left && f.bottom > e.top && o++;
    }
    let a;
    sn && o && r.nodeType == 1 && (a = r.childNodes[o - 1]).nodeType == 1 && a.contentEditable == "false" && a.getBoundingClientRect().top >= e.top && o--, r == n.dom && o == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? l = n.state.doc.content.size : (o == 0 || r.nodeType != 1 || r.childNodes[o - 1].nodeName != "BR") && (l = _a(n, r, o, e));
  }
  l == null && (l = za(n, i, e));
  let c = n.docView.nearestDesc(i, !0);
  return { pos: l, inside: c ? c.posAtStart - c.border : -1 };
}
function Zo(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Le(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (Zo(r))
      return r;
  }
  return Array.prototype.find.call(t, Zo) || n.getBoundingClientRect();
}
const La = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function ol(n, e, t) {
  let { node: r, offset: o, atom: s } = n.docView.domFromPos(e, t < 0 ? -1 : 1), i = sn || me;
  if (r.nodeType == 3)
    if (i && (La.test(r.nodeValue) || (t < 0 ? !o : o == r.nodeValue.length))) {
      let c = Le(Te(r, o, o), t);
      if (me && o && /\s/.test(r.nodeValue[o - 1]) && o < r.nodeValue.length) {
        let a = Le(Te(r, o - 1, o - 1), -1);
        if (a.top == c.top) {
          let u = Le(Te(r, o, o + 1), -1);
          if (u.top != c.top)
            return Lt(u, u.left < a.left);
        }
      }
      return c;
    } else {
      let c = o, a = o, u = t < 0 ? 1 : -1;
      return t < 0 && !o ? (a++, u = -1) : t >= 0 && o == r.nodeValue.length ? (c--, u = 1) : t < 0 ? c-- : a++, Lt(Le(Te(r, c, a), u), u < 0);
    }
  if (!n.state.doc.resolve(e - (s || 0)).parent.inlineContent) {
    if (s == null && o && (t < 0 || o == ke(r))) {
      let c = r.childNodes[o - 1];
      if (c.nodeType == 1)
        return lr(c.getBoundingClientRect(), !1);
    }
    if (s == null && o < ke(r)) {
      let c = r.childNodes[o];
      if (c.nodeType == 1)
        return lr(c.getBoundingClientRect(), !0);
    }
    return lr(r.getBoundingClientRect(), t >= 0);
  }
  if (s == null && o && (t < 0 || o == ke(r))) {
    let c = r.childNodes[o - 1], a = c.nodeType == 3 ? Te(c, ke(c) - (i ? 0 : 1)) : c.nodeType == 1 && (c.nodeName != "BR" || !c.nextSibling) ? c : null;
    if (a)
      return Lt(Le(a, 1), !1);
  }
  if (s == null && o < ke(r)) {
    let c = r.childNodes[o];
    for (; c.pmViewDesc && c.pmViewDesc.ignoreForCoords; )
      c = c.nextSibling;
    let a = c ? c.nodeType == 3 ? Te(c, 0, i ? 0 : 1) : c.nodeType == 1 ? c : null : null;
    if (a)
      return Lt(Le(a, -1), !0);
  }
  return Lt(Le(r.nodeType == 3 ? Te(r) : r, -t), t >= 0);
}
function Lt(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function lr(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function sl(n, e, t) {
  let r = n.state, o = n.root.activeElement;
  r != e && n.updateState(e), o != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), o != n.dom && o && o.focus();
  }
}
function qa(n, e, t) {
  let r = e.selection, o = t == "up" ? r.$from : r.$to;
  return sl(n, e, () => {
    let { node: s } = n.docView.domFromPos(o.pos, t == "up" ? -1 : 1);
    for (; ; ) {
      let l = n.docView.nearestDesc(s, !0);
      if (!l)
        break;
      if (l.node.isBlock) {
        s = l.contentDOM || l.dom;
        break;
      }
      s = l.dom.parentNode;
    }
    let i = ol(n, o.pos, 1);
    for (let l = s.firstChild; l; l = l.nextSibling) {
      let c;
      if (l.nodeType == 1)
        c = l.getClientRects();
      else if (l.nodeType == 3)
        c = Te(l, 0, l.nodeValue.length).getClientRects();
      else
        continue;
      for (let a = 0; a < c.length; a++) {
        let u = c[a];
        if (u.bottom > u.top + 1 && (t == "up" ? i.top - u.top > (u.bottom - i.top) * 2 : u.bottom - i.bottom > (i.bottom - u.top) * 2))
          return !1;
      }
    }
    return !0;
  });
}
const Ra = /[\u0590-\u08ac]/;
function Fa(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let o = r.parentOffset, s = !o, i = o == r.parent.content.size, l = n.domSelection();
  return !Ra.test(r.parent.textContent) || !l.modify ? t == "left" || t == "backward" ? s : i : sl(n, e, () => {
    let { focusNode: c, focusOffset: a, anchorNode: u, anchorOffset: f } = n.domSelectionRange(), h = l.caretBidiLevel;
    l.modify("move", t, "character");
    let d = r.depth ? n.docView.domAfterPos(r.before()) : n.dom, { focusNode: p, focusOffset: m } = n.domSelectionRange(), g = p && !d.contains(p.nodeType == 1 ? p : p.parentNode) || c == p && a == m;
    try {
      l.collapse(u, f), c && (c != u || a != f) && l.extend && l.extend(c, a);
    } catch {
    }
    return h != null && (l.caretBidiLevel = h), g;
  });
}
let Ko = null, Xo = null, es = !1;
function Ba(n, e, t) {
  return Ko == e && Xo == t ? es : (Ko = e, Xo = t, es = t == "up" || t == "down" ? qa(n, e, t) : Fa(n, e, t));
}
const fe = 0, ts = 1, tt = 2, we = 3;
class ln {
  constructor(e, t, r, o) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = o, this.dirty = fe, r.pmViewDesc = this;
  }
  // Used to check whether a given description corresponds to a
  // widget/mark/node.
  matchesWidget(e) {
    return !1;
  }
  matchesMark(e) {
    return !1;
  }
  matchesNode(e, t, r) {
    return !1;
  }
  matchesHack(e) {
    return !1;
  }
  // When parsing in-editor content (in domchange.js), we allow
  // descriptions to determine the parse rules that should be used to
  // parse them.
  parseRule() {
    return null;
  }
  // Used by the editor's event handler to ignore events that come
  // from certain descs.
  stopEvent(e) {
    return !1;
  }
  // The size of the content represented by this desc.
  get size() {
    let e = 0;
    for (let t = 0; t < this.children.length; t++)
      e += this.children[t].size;
    return e;
  }
  // For block nodes, this represents the space taken up by their
  // start/end tokens.
  get border() {
    return 0;
  }
  destroy() {
    this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
    for (let e = 0; e < this.children.length; e++)
      this.children[e].destroy();
  }
  posBeforeChild(e) {
    for (let t = 0, r = this.posAtStart; ; t++) {
      let o = this.children[t];
      if (o == e)
        return r;
      r += o.size;
    }
  }
  get posBefore() {
    return this.parent.posBeforeChild(this);
  }
  get posAtStart() {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
  }
  get posAfter() {
    return this.posBefore + this.size;
  }
  get posAtEnd() {
    return this.posAtStart + this.size - 2 * this.border;
  }
  localPosFromDOM(e, t, r) {
    if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode))
      if (r < 0) {
        let s, i;
        if (e == this.contentDOM)
          s = e.childNodes[t - 1];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          s = e.previousSibling;
        }
        for (; s && !((i = s.pmViewDesc) && i.parent == this); )
          s = s.previousSibling;
        return s ? this.posBeforeChild(i) + i.size : this.posAtStart;
      } else {
        let s, i;
        if (e == this.contentDOM)
          s = e.childNodes[t];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          s = e.nextSibling;
        }
        for (; s && !((i = s.pmViewDesc) && i.parent == this); )
          s = s.nextSibling;
        return s ? this.posBeforeChild(i) : this.posAtEnd;
      }
    let o;
    if (e == this.dom && this.contentDOM)
      o = t > J(this.contentDOM);
    else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM))
      o = e.compareDocumentPosition(this.contentDOM) & 2;
    else if (this.dom.firstChild) {
      if (t == 0)
        for (let s = e; ; s = s.parentNode) {
          if (s == this.dom) {
            o = !1;
            break;
          }
          if (s.previousSibling)
            break;
        }
      if (o == null && t == e.childNodes.length)
        for (let s = e; ; s = s.parentNode) {
          if (s == this.dom) {
            o = !0;
            break;
          }
          if (s.nextSibling)
            break;
        }
    }
    return o ?? r > 0 ? this.posAtEnd : this.posAtStart;
  }
  nearestDesc(e, t = !1) {
    for (let r = !0, o = e; o; o = o.parentNode) {
      let s = this.getDesc(o), i;
      if (s && (!t || s.node))
        if (r && (i = s.nodeDOM) && !(i.nodeType == 1 ? i.contains(e.nodeType == 1 ? e : e.parentNode) : i == e))
          r = !1;
        else
          return s;
    }
  }
  getDesc(e) {
    let t = e.pmViewDesc;
    for (let r = t; r; r = r.parent)
      if (r == this)
        return t;
  }
  posFromDOM(e, t, r) {
    for (let o = e; o; o = o.parentNode) {
      let s = this.getDesc(o);
      if (s)
        return s.localPosFromDOM(e, t, r);
    }
    return -1;
  }
  // Find the desc for the node after the given pos, if any. (When a
  // parent node overrode rendering, there might not be one.)
  descAt(e) {
    for (let t = 0, r = 0; t < this.children.length; t++) {
      let o = this.children[t], s = r + o.size;
      if (r == e && s != r) {
        for (; !o.border && o.children.length; )
          o = o.children[0];
        return o;
      }
      if (e < s)
        return o.descAt(e - r - o.border);
      r = s;
    }
  }
  domFromPos(e, t) {
    if (!this.contentDOM)
      return { node: this.dom, offset: 0, atom: e + 1 };
    let r = 0, o = 0;
    for (let s = 0; r < this.children.length; r++) {
      let i = this.children[r], l = s + i.size;
      if (l > e || i instanceof ll) {
        o = e - s;
        break;
      }
      s = l;
    }
    if (o)
      return this.children[r].domFromPos(o - this.children[r].border, t);
    for (let s; r && !(s = this.children[r - 1]).size && s instanceof il && s.side >= 0; r--)
      ;
    if (t <= 0) {
      let s, i = !0;
      for (; s = r ? this.children[r - 1] : null, !(!s || s.dom.parentNode == this.contentDOM); r--, i = !1)
        ;
      return s && t && i && !s.border && !s.domAtom ? s.domFromPos(s.size, t) : { node: this.contentDOM, offset: s ? J(s.dom) + 1 : 0 };
    } else {
      let s, i = !0;
      for (; s = r < this.children.length ? this.children[r] : null, !(!s || s.dom.parentNode == this.contentDOM); r++, i = !1)
        ;
      return s && i && !s.border && !s.domAtom ? s.domFromPos(0, t) : { node: this.contentDOM, offset: s ? J(s.dom) : this.contentDOM.childNodes.length };
    }
  }
  // Used to find a DOM range in a single parent for a given changed
  // range.
  parseRange(e, t, r = 0) {
    if (this.children.length == 0)
      return { node: this.contentDOM, from: e, to: t, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    let o = -1, s = -1;
    for (let i = r, l = 0; ; l++) {
      let c = this.children[l], a = i + c.size;
      if (o == -1 && e <= a) {
        let u = i + c.border;
        if (e >= u && t <= a - c.border && c.node && c.contentDOM && this.contentDOM.contains(c.contentDOM))
          return c.parseRange(e, t, u);
        e = i;
        for (let f = l; f > 0; f--) {
          let h = this.children[f - 1];
          if (h.size && h.dom.parentNode == this.contentDOM && !h.emptyChildAt(1)) {
            o = J(h.dom) + 1;
            break;
          }
          e -= h.size;
        }
        o == -1 && (o = 0);
      }
      if (o > -1 && (a > t || l == this.children.length - 1)) {
        t = a;
        for (let u = l + 1; u < this.children.length; u++) {
          let f = this.children[u];
          if (f.size && f.dom.parentNode == this.contentDOM && !f.emptyChildAt(-1)) {
            s = J(f.dom);
            break;
          }
          t += f.size;
        }
        s == -1 && (s = this.contentDOM.childNodes.length);
        break;
      }
      i = a;
    }
    return { node: this.contentDOM, from: e, to: t, fromOffset: o, toOffset: s };
  }
  emptyChildAt(e) {
    if (this.border || !this.contentDOM || !this.children.length)
      return !1;
    let t = this.children[e < 0 ? 0 : this.children.length - 1];
    return t.size == 0 || t.emptyChildAt(e);
  }
  domAfterPos(e) {
    let { node: t, offset: r } = this.domFromPos(e, 0);
    if (t.nodeType != 1 || r == t.childNodes.length)
      throw new RangeError("No node after pos " + e);
    return t.childNodes[r];
  }
  // View descs are responsible for setting any selection that falls
  // entirely inside of them, so that custom implementations can do
  // custom things with the selection. Note that this falls apart when
  // a selection starts in such a node and ends in another, in which
  // case we just use whatever domFromPos produces as a best effort.
  setSelection(e, t, r, o = !1) {
    let s = Math.min(e, t), i = Math.max(e, t);
    for (let h = 0, d = 0; h < this.children.length; h++) {
      let p = this.children[h], m = d + p.size;
      if (s > d && i < m)
        return p.setSelection(e - d - p.border, t - d - p.border, r, o);
      d = m;
    }
    let l = this.domFromPos(e, e ? -1 : 1), c = t == e ? l : this.domFromPos(t, t ? -1 : 1), a = r.getSelection(), u = !1;
    if ((me || Z) && e == t) {
      let { node: h, offset: d } = l;
      if (h.nodeType == 3) {
        if (u = !!(d && h.nodeValue[d - 1] == `
`), u && d == h.nodeValue.length)
          for (let p = h, m; p; p = p.parentNode) {
            if (m = p.nextSibling) {
              m.nodeName == "BR" && (l = c = { node: m.parentNode, offset: J(m) + 1 });
              break;
            }
            let g = p.pmViewDesc;
            if (g && g.node && g.node.isBlock)
              break;
          }
      } else {
        let p = h.childNodes[d - 1];
        u = p && (p.nodeName == "BR" || p.contentEditable == "false");
      }
    }
    if (me && a.focusNode && a.focusNode != c.node && a.focusNode.nodeType == 1) {
      let h = a.focusNode.childNodes[a.focusOffset];
      h && h.contentEditable == "false" && (o = !0);
    }
    if (!(o || u && Z) && ut(l.node, l.offset, a.anchorNode, a.anchorOffset) && ut(c.node, c.offset, a.focusNode, a.focusOffset))
      return;
    let f = !1;
    if ((a.extend || e == t) && !u) {
      a.collapse(l.node, l.offset);
      try {
        e != t && a.extend(c.node, c.offset), f = !0;
      } catch {
      }
    }
    if (!f) {
      if (e > t) {
        let d = l;
        l = c, c = d;
      }
      let h = document.createRange();
      h.setEnd(c.node, c.offset), h.setStart(l.node, l.offset), a.removeAllRanges(), a.addRange(h);
    }
  }
  ignoreMutation(e) {
    return !this.contentDOM && e.type != "selection";
  }
  get contentLost() {
    return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
  }
  // Remove a subtree of the element tree that has been touched
  // by a DOM change, so that the next update will redraw it.
  markDirty(e, t) {
    for (let r = 0, o = 0; o < this.children.length; o++) {
      let s = this.children[o], i = r + s.size;
      if (r == i ? e <= i && t >= r : e < i && t > r) {
        let l = r + s.border, c = i - s.border;
        if (e >= l && t <= c) {
          this.dirty = e == r || t == i ? tt : ts, e == l && t == c && (s.contentLost || s.dom.parentNode != this.contentDOM) ? s.dirty = we : s.markDirty(e - l, t - l);
          return;
        } else
          s.dirty = s.dom == s.contentDOM && s.dom.parentNode == this.contentDOM && !s.children.length ? tt : we;
      }
      r = i;
    }
    this.dirty = tt;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? tt : ts;
      t.dirty < r && (t.dirty = r);
    }
  }
  get domAtom() {
    return !1;
  }
  get ignoreForCoords() {
    return !1;
  }
}
class il extends ln {
  constructor(e, t, r, o) {
    let s, i = t.type.toDOM;
    if (typeof i == "function" && (i = i(r, () => {
      if (!s)
        return o;
      if (s.parent)
        return s.parent.posBeforeChild(s);
    })), !t.type.spec.raw) {
      if (i.nodeType != 1) {
        let l = document.createElement("span");
        l.appendChild(i), i = l;
      }
      i.contentEditable = "false", i.classList.add("ProseMirror-widget");
    }
    super(e, [], i, null), this.widget = t, this.widget = t, s = this;
  }
  matchesWidget(e) {
    return this.dirty == fe && e.type.eq(this.widget.type);
  }
  parseRule() {
    return { ignore: !0 };
  }
  stopEvent(e) {
    let t = this.widget.spec.stopEvent;
    return t ? t(e) : !1;
  }
  ignoreMutation(e) {
    return e.type != "selection" || this.widget.spec.ignoreSelection;
  }
  destroy() {
    this.widget.type.destroy(this.dom), super.destroy();
  }
  get domAtom() {
    return !0;
  }
  get side() {
    return this.widget.type.side;
  }
}
class Pa extends ln {
  constructor(e, t, r, o) {
    super(e, [], t, null), this.textDOM = r, this.text = o;
  }
  get size() {
    return this.text.length;
  }
  localPosFromDOM(e, t) {
    return e != this.textDOM ? this.posAtStart + (t ? this.size : 0) : this.posAtStart + t;
  }
  domFromPos(e) {
    return { node: this.textDOM, offset: e };
  }
  ignoreMutation(e) {
    return e.type === "characterData" && e.target.nodeValue == e.oldValue;
  }
}
class ft extends ln {
  constructor(e, t, r, o) {
    super(e, [], r, o), this.mark = t;
  }
  static create(e, t, r, o) {
    let s = o.nodeViews[t.type.name], i = s && s(t, o, r);
    return (!i || !i.dom) && (i = ve.renderSpec(document, t.type.spec.toDOM(t, r))), new ft(e, t, i.dom, i.contentDOM || i.dom);
  }
  parseRule() {
    return this.dirty & we || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != we && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != fe) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = fe;
    }
  }
  slice(e, t, r) {
    let o = ft.create(this.parent, this.mark, !0, r), s = this.children, i = this.size;
    t < i && (s = $r(s, t, i, r)), e > 0 && (s = $r(s, 0, e, r));
    for (let l = 0; l < s.length; l++)
      s[l].parent = o;
    return o.children = s, o;
  }
}
class Qe extends ln {
  constructor(e, t, r, o, s, i, l, c, a) {
    super(e, [], s, i), this.node = t, this.outerDeco = r, this.innerDeco = o, this.nodeDOM = l;
  }
  // By default, a node is rendered using the `toDOM` method from the
  // node type spec. But client code can use the `nodeViews` spec to
  // supply a custom node view, which can influence various aspects of
  // the way the node works.
  //
  // (Using subclassing for this was intentionally decided against,
  // since it'd require exposing a whole slew of finicky
  // implementation details to the user code that they probably will
  // never need.)
  static create(e, t, r, o, s, i) {
    let l = s.nodeViews[t.type.name], c, a = l && l(t, s, () => {
      if (!c)
        return i;
      if (c.parent)
        return c.parent.posBeforeChild(c);
    }, r, o), u = a && a.dom, f = a && a.contentDOM;
    if (t.isText) {
      if (!u)
        u = document.createTextNode(t.text);
      else if (u.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else
      u || ({ dom: u, contentDOM: f } = ve.renderSpec(document, t.type.spec.toDOM(t)));
    !f && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let h = u;
    return u = ul(u, r, t), a ? c = new Ua(e, t, r, o, u, f || null, h, a, s, i + 1) : t.isText ? new Fn(e, t, r, o, u, h, s) : new Qe(e, t, r, o, u, f || null, h, s, i + 1);
  }
  parseRule() {
    if (this.node.type.spec.reparseInView)
      return null;
    let e = { node: this.node.type.name, attrs: this.node.attrs };
    if (this.node.type.whitespace == "pre" && (e.preserveWhitespace = "full"), !this.contentDOM)
      e.getContent = () => this.node.content;
    else if (!this.contentLost)
      e.contentElement = this.contentDOM;
    else {
      for (let t = this.children.length - 1; t >= 0; t--) {
        let r = this.children[t];
        if (this.dom.contains(r.dom.parentNode)) {
          e.contentElement = r.dom.parentNode;
          break;
        }
      }
      e.contentElement || (e.getContent = () => M.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return this.dirty == fe && e.eq(this.node) && Vr(t, this.outerDeco) && r.eq(this.innerDeco);
  }
  get size() {
    return this.node.nodeSize;
  }
  get border() {
    return this.node.isLeaf ? 0 : 1;
  }
  // Syncs `this.children` to match `this.node.content` and the local
  // decorations, possibly introducing nesting for marks. Then, in a
  // separate step, syncs the DOM inside `this.contentDOM` to
  // `this.children`.
  updateChildren(e, t) {
    let r = this.node.inlineContent, o = t, s = e.composing ? this.localCompositionInfo(e, t) : null, i = s && s.pos > -1 ? s : null, l = s && s.pos < 0, c = new $a(this, i && i.node, e);
    Ha(this.node, this.innerDeco, (a, u, f) => {
      a.spec.marks ? c.syncToMarks(a.spec.marks, r, e) : a.type.side >= 0 && !f && c.syncToMarks(u == this.node.childCount ? v.none : this.node.child(u).marks, r, e), c.placeWidget(a, e, o);
    }, (a, u, f, h) => {
      c.syncToMarks(a.marks, r, e);
      let d;
      c.findNodeMatch(a, u, f, h) || l && e.state.selection.from > o && e.state.selection.to < o + a.nodeSize && (d = c.findIndexWithChild(s.node)) > -1 && c.updateNodeAt(a, u, f, d, e) || c.updateNextNode(a, u, f, e, h, o) || c.addNode(a, u, f, e, o), o += a.nodeSize;
    }), c.syncToMarks([], r, e), this.node.isTextblock && c.addTextblockHacks(), c.destroyRest(), (c.changed || this.dirty == tt) && (i && this.protectLocalComposition(e, i), cl(this.contentDOM, this.children, e), St && Ga(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: o } = e.state.selection;
    if (!(e.state.selection instanceof j) || r < t || o > t + this.node.content.size)
      return null;
    let s = e.domSelectionRange(), i = Wa(s.focusNode, s.focusOffset);
    if (!i || !this.dom.contains(i.parentNode))
      return null;
    if (this.node.inlineContent) {
      let l = i.nodeValue, c = Ja(this.node.content, l, r - t, o - t);
      return c < 0 ? null : { node: i, pos: c, text: l };
    } else
      return { node: i, pos: -1, text: "" };
  }
  protectLocalComposition(e, { node: t, pos: r, text: o }) {
    if (this.getDesc(t))
      return;
    let s = t;
    for (; s.parentNode != this.contentDOM; s = s.parentNode) {
      for (; s.previousSibling; )
        s.parentNode.removeChild(s.previousSibling);
      for (; s.nextSibling; )
        s.parentNode.removeChild(s.nextSibling);
      s.pmViewDesc && (s.pmViewDesc = void 0);
    }
    let i = new Pa(this, s, t, o);
    e.input.compositionNodes.push(i), this.children = $r(this.children, r, r + o.length, e, i);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, o) {
    return this.dirty == we || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, o), !0);
  }
  updateInner(e, t, r, o) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(o, this.posAtStart), this.dirty = fe;
  }
  updateOuterDeco(e) {
    if (Vr(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = al(this.dom, this.nodeDOM, Ur(this.outerDeco, this.node, t), Ur(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
  }
  // Mark this node as being the selected node.
  selectNode() {
    this.nodeDOM.nodeType == 1 && this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.dom.draggable = !0);
  }
  // Remove selected node marking from this node.
  deselectNode() {
    this.nodeDOM.nodeType == 1 && this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.dom.removeAttribute("draggable");
  }
  get domAtom() {
    return this.node.isAtom;
  }
}
function ns(n, e, t, r, o) {
  ul(r, e, n);
  let s = new Qe(void 0, n, e, t, r, r, r, o, 0);
  return s.contentDOM && s.updateChildren(o, 0), s;
}
class Fn extends Qe {
  constructor(e, t, r, o, s, i, l) {
    super(e, t, r, o, s, null, i, l, 0);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; )
      e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, t, r, o) {
    return this.dirty == we || this.dirty != fe && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != fe || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, o.trackWrites == this.nodeDOM && (o.trackWrites = null)), this.node = e, this.dirty = fe, !0);
  }
  inParent() {
    let e = this.parent.contentDOM;
    for (let t = this.nodeDOM; t; t = t.parentNode)
      if (t == e)
        return !0;
    return !1;
  }
  domFromPos(e) {
    return { node: this.nodeDOM, offset: e };
  }
  localPosFromDOM(e, t, r) {
    return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, r);
  }
  ignoreMutation(e) {
    return e.type != "characterData" && e.type != "selection";
  }
  slice(e, t, r) {
    let o = this.node.cut(e, t), s = document.createTextNode(o.text);
    return new Fn(this.parent, o, this.outerDeco, this.innerDeco, s, s, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = we);
  }
  get domAtom() {
    return !1;
  }
}
class ll extends ln {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == fe && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class Ua extends Qe {
  constructor(e, t, r, o, s, i, l, c, a, u) {
    super(e, t, r, o, s, i, l, a, u), this.spec = c;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, o) {
    if (this.dirty == we)
      return !1;
    if (this.spec.update) {
      let s = this.spec.update(e, t, r);
      return s && this.updateInner(e, t, r, o), s;
    } else
      return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, r, o);
  }
  selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
  }
  deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
  }
  setSelection(e, t, r, o) {
    this.spec.setSelection ? this.spec.setSelection(e, t, r) : super.setSelection(e, t, r, o);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
  stopEvent(e) {
    return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
}
function cl(n, e, t) {
  let r = n.firstChild, o = !1;
  for (let s = 0; s < e.length; s++) {
    let i = e[s], l = i.dom;
    if (l.parentNode == n) {
      for (; l != r; )
        r = rs(r), o = !0;
      r = r.nextSibling;
    } else
      o = !0, n.insertBefore(l, r);
    if (i instanceof ft) {
      let c = r ? r.previousSibling : n.lastChild;
      cl(i.contentDOM, i.children, t), r = c ? c.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = rs(r), o = !0;
  o && t.trackWrites == n && (t.trackWrites = null);
}
const Vt = function(n) {
  n && (this.nodeName = n);
};
Vt.prototype = /* @__PURE__ */ Object.create(null);
const nt = [new Vt()];
function Ur(n, e, t) {
  if (n.length == 0)
    return nt;
  let r = t ? nt[0] : new Vt(), o = [r];
  for (let s = 0; s < n.length; s++) {
    let i = n[s].type.attrs;
    if (i) {
      i.nodeName && o.push(r = new Vt(i.nodeName));
      for (let l in i) {
        let c = i[l];
        c != null && (t && o.length == 1 && o.push(r = new Vt(e.isInline ? "span" : "div")), l == "class" ? r.class = (r.class ? r.class + " " : "") + c : l == "style" ? r.style = (r.style ? r.style + ";" : "") + c : l != "nodeName" && (r[l] = c));
      }
    }
  }
  return o;
}
function al(n, e, t, r) {
  if (t == nt && r == nt)
    return e;
  let o = e;
  for (let s = 0; s < r.length; s++) {
    let i = r[s], l = t[s];
    if (s) {
      let c;
      l && l.nodeName == i.nodeName && o != n && (c = o.parentNode) && c.nodeName.toLowerCase() == i.nodeName || (c = document.createElement(i.nodeName), c.pmIsDeco = !0, c.appendChild(o), l = nt[0]), o = c;
    }
    Va(o, l || nt[0], i);
  }
  return o;
}
function Va(n, e, t) {
  for (let r in e)
    r != "class" && r != "style" && r != "nodeName" && !(r in t) && n.removeAttribute(r);
  for (let r in t)
    r != "class" && r != "style" && r != "nodeName" && t[r] != e[r] && n.setAttribute(r, t[r]);
  if (e.class != t.class) {
    let r = e.class ? e.class.split(" ").filter(Boolean) : [], o = t.class ? t.class.split(" ").filter(Boolean) : [];
    for (let s = 0; s < r.length; s++)
      o.indexOf(r[s]) == -1 && n.classList.remove(r[s]);
    for (let s = 0; s < o.length; s++)
      r.indexOf(o[s]) == -1 && n.classList.add(o[s]);
    n.classList.length == 0 && n.removeAttribute("class");
  }
  if (e.style != t.style) {
    if (e.style) {
      let r = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, o;
      for (; o = r.exec(e.style); )
        n.style.removeProperty(o[1]);
    }
    t.style && (n.style.cssText += t.style);
  }
}
function ul(n, e, t) {
  return al(n, n, nt, Ur(e, t, n.nodeType != 1));
}
function Vr(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function rs(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class $a {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Qa(e.node.content, e);
  }
  // Destroy and remove the children between the given indices in
  // `this.top`.
  destroyBetween(e, t) {
    if (e != t) {
      for (let r = e; r < t; r++)
        this.top.children[r].destroy();
      this.top.children.splice(e, t - e), this.changed = !0;
    }
  }
  // Destroy all remaining children in `this.top`.
  destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  }
  // Sync the current stack of mark descs with the given array of
  // marks, reusing existing mark descs when possible.
  syncToMarks(e, t, r) {
    let o = 0, s = this.stack.length >> 1, i = Math.min(s, e.length);
    for (; o < i && (o == s - 1 ? this.top : this.stack[o + 1 << 1]).matchesMark(e[o]) && e[o].type.spec.spanning !== !1; )
      o++;
    for (; o < s; )
      this.destroyRest(), this.top.dirty = fe, this.index = this.stack.pop(), this.top = this.stack.pop(), s--;
    for (; s < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let l = -1;
      for (let c = this.index; c < Math.min(this.index + 3, this.top.children.length); c++) {
        let a = this.top.children[c];
        if (a.matchesMark(e[s]) && !this.isLocked(a.dom)) {
          l = c;
          break;
        }
      }
      if (l > -1)
        l > this.index && (this.changed = !0, this.destroyBetween(this.index, l)), this.top = this.top.children[this.index];
      else {
        let c = ft.create(this.top, e[s], t, r);
        this.top.children.splice(this.index, 0, c), this.top = c, this.changed = !0;
      }
      this.index = 0, s++;
    }
  }
  // Try to find a node desc matching the given data. Skip over it and
  // return true when successful.
  findNodeMatch(e, t, r, o) {
    let s = -1, i;
    if (o >= this.preMatch.index && (i = this.preMatch.matches[o - this.preMatch.index]).parent == this.top && i.matchesNode(e, t, r))
      s = this.top.children.indexOf(i, this.index);
    else
      for (let l = this.index, c = Math.min(this.top.children.length, l + 5); l < c; l++) {
        let a = this.top.children[l];
        if (a.matchesNode(e, t, r) && !this.preMatch.matched.has(a)) {
          s = l;
          break;
        }
      }
    return s < 0 ? !1 : (this.destroyBetween(this.index, s), this.index++, !0);
  }
  updateNodeAt(e, t, r, o, s) {
    let i = this.top.children[o];
    return i.dirty == we && i.dom == i.contentDOM && (i.dirty = tt), i.update(e, t, r, s) ? (this.destroyBetween(this.index, o), this.index++, !0) : !1;
  }
  findIndexWithChild(e) {
    for (; ; ) {
      let t = e.parentNode;
      if (!t)
        return -1;
      if (t == this.top.contentDOM) {
        let r = e.pmViewDesc;
        if (r) {
          for (let o = this.index; o < this.top.children.length; o++)
            if (this.top.children[o] == r)
              return o;
        }
        return -1;
      }
      e = t;
    }
  }
  // Try to update the next node, if any, to the given data. Checks
  // pre-matches to avoid overwriting nodes that could still be used.
  updateNextNode(e, t, r, o, s, i) {
    for (let l = this.index; l < this.top.children.length; l++) {
      let c = this.top.children[l];
      if (c instanceof Qe) {
        let a = this.preMatch.matched.get(c);
        if (a != null && a != s)
          return !1;
        let u = c.dom, f, h = this.isLocked(u) && !(e.isText && c.node && c.node.isText && c.nodeDOM.nodeValue == e.text && c.dirty != we && Vr(t, c.outerDeco));
        if (!h && c.update(e, t, r, o))
          return this.destroyBetween(this.index, l), c.dom != u && (this.changed = !0), this.index++, !0;
        if (!h && (f = this.recreateWrapper(c, e, t, r, o, i)))
          return this.top.children[this.index] = f, f.contentDOM && (f.dirty = tt, f.updateChildren(o, i + 1), f.dirty = fe), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, t, r, o, s, i) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content))
      return null;
    let l = Qe.create(this.top, t, r, o, s, i);
    if (l.contentDOM) {
      l.children = e.children, e.children = [];
      for (let c of l.children)
        c.parent = l;
    }
    return e.destroy(), l;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, o, s) {
    let i = Qe.create(this.top, e, t, r, o, s);
    i.contentDOM && i.updateChildren(o, s + 1), this.top.children.splice(this.index++, 0, i), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let o = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (o && o.matchesWidget(e) && (e == o.widget || !o.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let s = new il(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof ft; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof Fn) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((Z || H) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let o = new ll(this.top, [], r, null);
      t != this.top ? t.children.push(o) : t.children.splice(this.index++, 0, o), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function Qa(n, e) {
  let t = e, r = t.children.length, o = n.childCount, s = /* @__PURE__ */ new Map(), i = [];
  e:
    for (; o > 0; ) {
      let l;
      for (; ; )
        if (r) {
          let a = t.children[r - 1];
          if (a instanceof ft)
            t = a, r = a.children.length;
          else {
            l = a, r--;
            break;
          }
        } else {
          if (t == e)
            break e;
          r = t.parent.children.indexOf(t), t = t.parent;
        }
      let c = l.node;
      if (c) {
        if (c != n.child(o - 1))
          break;
        --o, s.set(l, o), i.push(l);
      }
    }
  return { index: o, matched: s, matches: i.reverse() };
}
function Ya(n, e) {
  return n.type.side - e.type.side;
}
function Ha(n, e, t, r) {
  let o = e.locals(n), s = 0;
  if (o.length == 0) {
    for (let a = 0; a < n.childCount; a++) {
      let u = n.child(a);
      r(u, o, e.forChild(s, u), a), s += u.nodeSize;
    }
    return;
  }
  let i = 0, l = [], c = null;
  for (let a = 0; ; ) {
    let u, f;
    for (; i < o.length && o[i].to == s; ) {
      let g = o[i++];
      g.widget && (u ? (f || (f = [u])).push(g) : u = g);
    }
    if (u)
      if (f) {
        f.sort(Ya);
        for (let g = 0; g < f.length; g++)
          t(f[g], a, !!c);
      } else
        t(u, a, !!c);
    let h, d;
    if (c)
      d = -1, h = c, c = null;
    else if (a < n.childCount)
      d = a, h = n.child(a++);
    else
      break;
    for (let g = 0; g < l.length; g++)
      l[g].to <= s && l.splice(g--, 1);
    for (; i < o.length && o[i].from <= s && o[i].to > s; )
      l.push(o[i++]);
    let p = s + h.nodeSize;
    if (h.isText) {
      let g = p;
      i < o.length && o[i].from < g && (g = o[i].from);
      for (let y = 0; y < l.length; y++)
        l[y].to < g && (g = l[y].to);
      g < p && (c = h.cut(g - s), h = h.cut(0, g - s), p = g, d = -1);
    } else
      for (; i < o.length && o[i].to <= p; )
        i++;
    let m = h.isInline && !h.isLeaf ? l.filter((g) => !g.inline) : l.slice();
    r(h, m, e.forChild(s, h), d), s = p;
  }
}
function Ga(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function Wa(n, e) {
  for (; ; ) {
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.childNodes.length > e && n.childNodes[e].nodeType == 3)
        return n.childNodes[e];
      n = n.childNodes[e - 1], e = ke(n);
    } else if (n.nodeType == 1 && e < n.childNodes.length)
      n = n.childNodes[e], e = 0;
    else
      return null;
  }
}
function Ja(n, e, t, r) {
  for (let o = 0, s = 0; o < n.childCount && s <= r; ) {
    let i = n.child(o++), l = s;
    if (s += i.nodeSize, !i.isText)
      continue;
    let c = i.text;
    for (; o < n.childCount; ) {
      let a = n.child(o++);
      if (s += a.nodeSize, !a.isText)
        break;
      c += a.text;
    }
    if (s >= t) {
      if (s >= r && c.slice(r - e.length - l, r - l) == e)
        return r - e.length;
      let a = l < r ? c.lastIndexOf(e, r - l - 1) : -1;
      if (a >= 0 && a + e.length + l >= t)
        return l + a;
      if (t == r && c.length >= r + e.length - l && c.slice(r - l, r - l + e.length) == e)
        return r;
    }
  }
  return -1;
}
function $r(n, e, t, r, o) {
  let s = [];
  for (let i = 0, l = 0; i < n.length; i++) {
    let c = n[i], a = l, u = l += c.size;
    a >= t || u <= e ? s.push(c) : (a < e && s.push(c.slice(0, e - a, r)), o && (s.push(o), o = void 0), u > t && s.push(c.slice(t - a, c.size, r)));
  }
  return s;
}
function ao(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let o = n.docView.nearestDesc(t.focusNode), s = o && o.size == 0, i = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (i < 0)
    return null;
  let l = r.resolve(i), c, a;
  if (Rn(t)) {
    for (c = l; o && !o.node; )
      o = o.parent;
    let u = o.node;
    if (o && u.isAtom && C.isSelectable(u) && o.parent && !(u.isInline && xa(t.focusNode, t.focusOffset, o.dom))) {
      let f = o.posBefore;
      a = new C(i == f ? l : r.resolve(f));
    }
  } else {
    let u = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (u < 0)
      return null;
    c = r.resolve(u);
  }
  if (!a) {
    let u = e == "pointer" || n.state.selection.head < l.pos && !s ? 1 : -1;
    a = uo(n, c, l, u);
  }
  return a;
}
function fl(n) {
  return n.editable ? n.hasFocus() : dl(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Oe(n, e = !1) {
  let t = n.state.selection;
  if (hl(n, t), !!fl(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && H) {
      let r = n.domSelectionRange(), o = n.domObserver.currentSelection;
      if (r.anchorNode && o.anchorNode && ut(r.anchorNode, r.anchorOffset, o.anchorNode, o.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      Ka(n);
    else {
      let { anchor: r, head: o } = t, s, i;
      ss && !(t instanceof j) && (t.$from.parent.inlineContent || (s = is(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (i = is(n, t.to))), n.docView.setSelection(r, o, n.root, e), ss && (s && ls(s), i && ls(i)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Za(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const ss = Z || H && Na < 63;
function is(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), o = r < t.childNodes.length ? t.childNodes[r] : null, s = r ? t.childNodes[r - 1] : null;
  if (Z && o && o.contentEditable == "false")
    return cr(o);
  if ((!o || o.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (o)
      return cr(o);
    if (s)
      return cr(s);
  }
}
function cr(n) {
  return n.contentEditable = "true", Z && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function ls(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function Za(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, o = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != o) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!fl(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function Ka(n) {
  let e = n.domSelection(), t = document.createRange(), r = n.cursorWrapper.dom, o = r.nodeName == "IMG";
  o ? t.setEnd(r.parentNode, J(r) + 1) : t.setEnd(r, 0), t.collapse(!1), e.removeAllRanges(), e.addRange(t), !o && !n.state.selection.visible && te && $e <= 11 && (r.disabled = !0, r.disabled = !1);
}
function hl(n, e) {
  if (e instanceof C) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (cs(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    cs(n);
}
function cs(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function uo(n, e, t, r) {
  return n.someProp("createSelectionBetween", (o) => o(n, e, t)) || j.between(e, t, r);
}
function as(n) {
  return n.editable && !n.hasFocus() ? !1 : dl(n);
}
function dl(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function Xa(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return ut(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Qr(n, e) {
  let { $anchor: t, $head: r } = n.selection, o = e > 0 ? t.max(r) : t.min(r), s = o.parent.inlineContent ? o.depth ? n.doc.resolve(e > 0 ? o.after() : o.before()) : null : o;
  return s && I.findFrom(s, e);
}
function qe(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function us(n, e, t) {
  let r = n.state.selection;
  if (r instanceof j)
    if (t.indexOf("s") > -1) {
      let { $head: o } = r, s = o.textOffset ? null : e < 0 ? o.nodeBefore : o.nodeAfter;
      if (!s || s.isText || !s.isLeaf)
        return !1;
      let i = n.state.doc.resolve(o.pos + s.nodeSize * (e < 0 ? -1 : 1));
      return qe(n, new j(r.$anchor, i));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let o = Qr(n.state, e);
        return o && o instanceof C ? qe(n, o) : !1;
      } else if (!(ie && t.indexOf("m") > -1)) {
        let o = r.$head, s = o.textOffset ? null : e < 0 ? o.nodeBefore : o.nodeAfter, i;
        if (!s || s.isText)
          return !1;
        let l = e < 0 ? o.pos - s.nodeSize : o.pos;
        return s.isAtom || (i = n.docView.descAt(l)) && !i.contentDOM ? C.isSelectable(s) ? qe(n, new C(e < 0 ? n.state.doc.resolve(o.pos - s.nodeSize) : o)) : sn ? qe(n, new j(n.state.doc.resolve(e < 0 ? l : l + s.nodeSize))) : !1 : !1;
      }
    } else
      return !1;
  else {
    if (r instanceof C && r.node.isInline)
      return qe(n, new j(e > 0 ? r.$to : r.$from));
    {
      let o = Qr(n.state, e);
      return o ? qe(n, o) : !1;
    }
  }
}
function Tn(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function $t(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function pt(n, e) {
  return e < 0 ? eu(n) : tu(n);
}
function eu(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let o, s, i = !1;
  for (me && t.nodeType == 1 && r < Tn(t) && $t(t.childNodes[r], -1) && (i = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let l = t.childNodes[r - 1];
        if ($t(l, -1))
          o = t, s = --r;
        else if (l.nodeType == 3)
          t = l, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (pl(t))
        break;
      {
        let l = t.previousSibling;
        for (; l && $t(l, -1); )
          o = t.parentNode, s = J(l), l = l.previousSibling;
        if (l)
          t = l, r = Tn(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  i ? Yr(n, t, r) : o && Yr(n, o, s);
}
function tu(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let o = Tn(t), s, i;
  for (; ; )
    if (r < o) {
      if (t.nodeType != 1)
        break;
      let l = t.childNodes[r];
      if ($t(l, 1))
        s = t, i = ++r;
      else
        break;
    } else {
      if (pl(t))
        break;
      {
        let l = t.nextSibling;
        for (; l && $t(l, 1); )
          s = l.parentNode, i = J(l) + 1, l = l.nextSibling;
        if (l)
          t = l, r = 0, o = Tn(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = o = 0;
        }
      }
    }
  s && Yr(n, s, i);
}
function pl(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function nu(n, e) {
  for (; n && e == n.childNodes.length && !lo(n); )
    e = J(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function ru(n, e) {
  for (; n && !e && !lo(n); )
    e = J(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function Yr(n, e, t) {
  if (e.nodeType != 3) {
    let s, i;
    (i = nu(e, t)) ? (e = i, t = 0) : (s = ru(e, t)) && (e = s, t = s.nodeValue.length);
  }
  let r = n.domSelection();
  if (Rn(r)) {
    let s = document.createRange();
    s.setEnd(e, t), s.setStart(e, t), r.removeAllRanges(), r.addRange(s);
  } else
    r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: o } = n;
  setTimeout(() => {
    n.state == o && Oe(n);
  }, 50);
}
function fs(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(H || wa) && t.parent.inlineContent) {
    let o = n.coordsAtPos(e);
    if (e > t.start()) {
      let s = n.coordsAtPos(e - 1), i = (s.top + s.bottom) / 2;
      if (i > o.top && i < o.bottom && Math.abs(s.left - o.left) > 1)
        return s.left < o.left ? "ltr" : "rtl";
    }
    if (e < t.end()) {
      let s = n.coordsAtPos(e + 1), i = (s.top + s.bottom) / 2;
      if (i > o.top && i < o.bottom && Math.abs(s.left - o.left) > 1)
        return s.left > o.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
}
function hs(n, e, t) {
  let r = n.state.selection;
  if (r instanceof j && !r.empty || t.indexOf("s") > -1 || ie && t.indexOf("m") > -1)
    return !1;
  let { $from: o, $to: s } = r;
  if (!o.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let i = Qr(n.state, e);
    if (i && i instanceof C)
      return qe(n, i);
  }
  if (!o.parent.inlineContent) {
    let i = e < 0 ? o : s, l = r instanceof re ? I.near(i, e) : I.findFrom(i, e);
    return l ? qe(n, l) : !1;
  }
  return !1;
}
function ds(n, e) {
  if (!(n.state.selection instanceof j))
    return !0;
  let { $head: t, $anchor: r, empty: o } = n.state.selection;
  if (!t.sameParent(r))
    return !0;
  if (!o)
    return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let s = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (s && !s.isText) {
    let i = n.state.tr;
    return e < 0 ? i.delete(t.pos - s.nodeSize, t.pos) : i.delete(t.pos, t.pos + s.nodeSize), n.dispatch(i), !0;
  }
  return !1;
}
function ps(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function ou(n) {
  if (!Z || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    ps(n, r, "true"), setTimeout(() => ps(n, r, "false"), 20);
  }
  return !1;
}
function su(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function iu(n, e) {
  let t = e.keyCode, r = su(e);
  if (t == 8 || ie && t == 72 && r == "c")
    return ds(n, -1) || pt(n, -1);
  if (t == 46 && !e.shiftKey || ie && t == 68 && r == "c")
    return ds(n, 1) || pt(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || ie && t == 66 && r == "c") {
    let o = t == 37 ? fs(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return us(n, o, r) || pt(n, o);
  } else if (t == 39 || ie && t == 70 && r == "c") {
    let o = t == 39 ? fs(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return us(n, o, r) || pt(n, o);
  } else {
    if (t == 38 || ie && t == 80 && r == "c")
      return hs(n, -1, r) || pt(n, -1);
    if (t == 40 || ie && t == 78 && r == "c")
      return ou(n) || hs(n, 1, r) || pt(n, 1);
    if (r == (ie ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function ml(n, e) {
  n.someProp("transformCopied", (d) => {
    e = d(e, n);
  });
  let t = [], { content: r, openStart: o, openEnd: s } = e;
  for (; o > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    o--, s--;
    let d = r.firstChild;
    t.push(d.type.name, d.attrs != d.type.defaultAttrs ? d.attrs : null), r = d.content;
  }
  let i = n.someProp("clipboardSerializer") || ve.fromSchema(n.state.schema), l = bl(), c = l.createElement("div");
  c.appendChild(i.serializeFragment(r, { document: l }));
  let a = c.firstChild, u, f = 0;
  for (; a && a.nodeType == 1 && (u = xl[a.nodeName.toLowerCase()]); ) {
    for (let d = u.length - 1; d >= 0; d--) {
      let p = l.createElement(u[d]);
      for (; c.firstChild; )
        p.appendChild(c.firstChild);
      c.appendChild(p), f++;
    }
    a = c.firstChild;
  }
  a && a.nodeType == 1 && a.setAttribute("data-pm-slice", `${o} ${s}${f ? ` -${f}` : ""} ${JSON.stringify(t)}`);
  let h = n.someProp("clipboardTextSerializer", (d) => d(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: c, text: h };
}
function gl(n, e, t, r, o) {
  let s = o.parent.type.spec.code, i, l;
  if (!t && !e)
    return null;
  let c = e && (r || s || !t);
  if (c) {
    if (n.someProp("transformPastedText", (h) => {
      e = h(e, s || r, n);
    }), s)
      return e ? new D(M.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0) : D.empty;
    let f = n.someProp("clipboardTextParser", (h) => h(e, o, r, n));
    if (f)
      l = f;
    else {
      let h = o.marks(), { schema: d } = n.state, p = ve.fromSchema(d);
      i = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = i.appendChild(document.createElement("p"));
        m && g.appendChild(p.serializeNode(d.text(m, h)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (f) => {
      t = f(t, n);
    }), i = au(t), sn && uu(i);
  let a = i && i.querySelector("[data-pm-slice]"), u = a && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(a.getAttribute("data-pm-slice") || "");
  if (u && u[3])
    for (let f = +u[3]; f > 0; f--) {
      let h = i.firstChild;
      for (; h && h.nodeType != 1; )
        h = h.nextSibling;
      if (!h)
        break;
      i = h;
    }
  if (l || (l = (n.someProp("clipboardParser") || n.someProp("domParser") || wt.fromSchema(n.state.schema)).parseSlice(i, {
    preserveWhitespace: !!(c || u),
    context: o,
    ruleFromNode(h) {
      return h.nodeName == "BR" && !h.nextSibling && h.parentNode && !lu.test(h.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    l = fu(ms(l, +u[1], +u[2]), u[4]);
  else if (l = D.maxOpen(cu(l.content, o), !0), l.openStart || l.openEnd) {
    let f = 0, h = 0;
    for (let d = l.content.firstChild; f < l.openStart && !d.type.spec.isolating; f++, d = d.firstChild)
      ;
    for (let d = l.content.lastChild; h < l.openEnd && !d.type.spec.isolating; h++, d = d.lastChild)
      ;
    l = ms(l, f, h);
  }
  return n.someProp("transformPasted", (f) => {
    l = f(l, n);
  }), l;
}
const lu = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function cu(n, e) {
  if (n.childCount < 2)
    return n;
  for (let t = e.depth; t >= 0; t--) {
    let o = e.node(t).contentMatchAt(e.index(t)), s, i = [];
    if (n.forEach((l) => {
      if (!i)
        return;
      let c = o.findWrapping(l.type), a;
      if (!c)
        return i = null;
      if (a = i.length && s.length && Ml(c, s, l, i[i.length - 1], 0))
        i[i.length - 1] = a;
      else {
        i.length && (i[i.length - 1] = kl(i[i.length - 1], s.length));
        let u = yl(l, c);
        i.push(u), o = o.matchType(u.type), s = c;
      }
    }), i)
      return M.from(i);
  }
  return n;
}
function yl(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, M.from(n));
  return n;
}
function Ml(n, e, t, r, o) {
  if (o < n.length && o < e.length && n[o] == e[o]) {
    let s = Ml(n, e, t, r.lastChild, o + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(o == n.length - 1 ? t.type : n[o + 1]))
      return r.copy(r.content.append(M.from(yl(t, n, o + 1))));
  }
}
function kl(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, kl(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(M.empty, !0);
  return n.copy(t.append(r));
}
function Hr(n, e, t, r, o, s) {
  let i = e < 0 ? n.firstChild : n.lastChild, l = i.content;
  return n.childCount > 1 && (s = 0), o < r - 1 && (l = Hr(l, e, t, r, o + 1, s)), o >= t && (l = e < 0 ? i.contentMatchAt(0).fillBefore(l, s <= o).append(l) : l.append(i.contentMatchAt(i.childCount).fillBefore(M.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, i.copy(l));
}
function ms(n, e, t) {
  return e < n.openStart && (n = new D(Hr(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new D(Hr(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const xl = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"]
};
let gs = null;
function bl() {
  return gs || (gs = document.implementation.createHTMLDocument("title"));
}
function au(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = bl().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), o;
  if ((o = r && xl[r[1].toLowerCase()]) && (n = o.map((s) => "<" + s + ">").join("") + n + o.map((s) => "</" + s + ">").reverse().join("")), t.innerHTML = n, o)
    for (let s = 0; s < o.length; s++)
      t = t.querySelector(o[s]) || t;
  return t;
}
function uu(n) {
  let e = n.querySelectorAll(H ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function fu(n, e) {
  if (!n.size)
    return n;
  let t = n.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: o, openStart: s, openEnd: i } = n;
  for (let l = r.length - 2; l >= 0; l -= 2) {
    let c = t.nodes[r[l]];
    if (!c || c.hasRequiredAttrs())
      break;
    o = M.from(c.create(r[l + 1], o)), s++, i++;
  }
  return new D(o, s, i);
}
const K = {}, X = {}, hu = { touchstart: !0, touchmove: !0 };
class du {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "" }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastAndroidDelete = 0, this.composing = !1, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function pu(n) {
  for (let e in K) {
    let t = K[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      gu(n, r) && !fo(n, r) && (n.editable || !(r.type in X)) && t(n, r);
    }, hu[e] ? { passive: !0 } : void 0);
  }
  Z && n.dom.addEventListener("input", () => null), Gr(n);
}
function Ve(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function mu(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function Gr(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => fo(n, r));
  });
}
function fo(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function gu(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function yu(n, e) {
  !fo(n, e) && K[e.type] && (n.editable || !(e.type in X)) && K[e.type](n, e);
}
X.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !Nl(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(de && H && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), St && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (o) => o(n, et(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else
      n.someProp("handleKeyDown", (r) => r(n, t)) || iu(n, t) ? t.preventDefault() : Ve(n, "key");
};
X.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
X.keypress = (n, e) => {
  let t = e;
  if (Nl(n, t) || !t.charCode || t.ctrlKey && !t.altKey || ie && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (o) => o(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof j) || !r.$from.sameParent(r.$to)) {
    let o = String.fromCharCode(t.charCode);
    !/[\r\n]/.test(o) && !n.someProp("handleTextInput", (s) => s(n, r.$from.pos, r.$to.pos, o)) && n.dispatch(n.state.tr.insertText(o).scrollIntoView()), t.preventDefault();
  }
};
function Bn(n) {
  return { left: n.clientX, top: n.clientY };
}
function Mu(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function ho(n, e, t, r, o) {
  if (r == -1)
    return !1;
  let s = n.state.doc.resolve(r);
  for (let i = s.depth + 1; i > 0; i--)
    if (n.someProp(e, (l) => i > s.depth ? l(n, t, s.nodeAfter, s.before(i), o, !0) : l(n, t, s.node(i), s.before(i), o, !1)))
      return !0;
  return !1;
}
function Dt(n, e, t) {
  n.focused || n.focus();
  let r = n.state.tr.setSelection(e);
  t == "pointer" && r.setMeta("pointer", !0), n.dispatch(r);
}
function ku(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && C.isSelectable(r) ? (Dt(n, new C(t), "pointer"), !0) : !1;
}
function xu(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, o;
  t instanceof C && (r = t.node);
  let s = n.state.doc.resolve(e);
  for (let i = s.depth + 1; i > 0; i--) {
    let l = i > s.depth ? s.nodeAfter : s.node(i);
    if (C.isSelectable(l)) {
      r && t.$from.depth > 0 && i >= t.$from.depth && s.before(t.$from.depth + 1) == t.$from.pos ? o = s.before(t.$from.depth) : o = s.before(i);
      break;
    }
  }
  return o != null ? (Dt(n, C.create(n.state.doc, o), "pointer"), !0) : !1;
}
function bu(n, e, t, r, o) {
  return ho(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (s) => s(n, e, r)) || (o ? xu(n, t) : ku(n, t));
}
function Du(n, e, t, r) {
  return ho(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (o) => o(n, e, r));
}
function Nu(n, e, t, r) {
  return ho(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (o) => o(n, e, r)) || wu(n, t, r);
}
function wu(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (Dt(n, j.create(r, 0, r.content.size), "pointer"), !0) : !1;
  let o = r.resolve(e);
  for (let s = o.depth + 1; s > 0; s--) {
    let i = s > o.depth ? o.nodeAfter : o.node(s), l = o.before(s);
    if (i.inlineContent)
      Dt(n, j.create(r, l + 1, l + 1 + i.content.size), "pointer");
    else if (C.isSelectable(i))
      Dt(n, C.create(r, l), "pointer");
    else
      continue;
    return !0;
  }
}
function po(n) {
  return En(n);
}
const Dl = ie ? "metaKey" : "ctrlKey";
K.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = po(n), o = Date.now(), s = "singleClick";
  o - n.input.lastClick.time < 500 && Mu(t, n.input.lastClick) && !t[Dl] && (n.input.lastClick.type == "singleClick" ? s = "doubleClick" : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")), n.input.lastClick = { time: o, x: t.clientX, y: t.clientY, type: s };
  let i = n.posAtCoords(Bn(t));
  i && (s == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new Cu(n, i, t, !!r)) : (s == "doubleClick" ? Du : Nu)(n, i.pos, i.inside, t) ? t.preventDefault() : Ve(n, "pointer"));
};
class Cu {
  constructor(e, t, r, o) {
    this.view = e, this.pos = t, this.event = r, this.flushed = o, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Dl], this.allowDefault = r.shiftKey;
    let s, i;
    if (t.inside > -1)
      s = e.state.doc.nodeAt(t.inside), i = t.inside;
    else {
      let u = e.state.doc.resolve(t.pos);
      s = u.parent, i = u.depth ? u.before() : 0;
    }
    const l = o ? null : r.target, c = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = c ? c.dom : null;
    let { selection: a } = e.state;
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || a instanceof C && a.from <= i && a.to > i) && (this.mightDrag = {
      node: s,
      pos: i,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && me && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Ve(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => Oe(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Bn(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Ve(this.view, "pointer") : bu(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    Z && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    H && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (Dt(this.view, I.near(this.view.state.doc.resolve(t.pos)), "pointer"), e.preventDefault()) : Ve(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Ve(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
K.touchstart = (n) => {
  n.input.lastTouch = Date.now(), po(n), Ve(n, "pointer");
};
K.touchmove = (n) => {
  n.input.lastTouch = Date.now(), Ve(n, "pointer");
};
K.contextmenu = (n) => po(n);
function Nl(n, e) {
  return n.composing ? !0 : Z && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const Au = de ? 5e3 : -1;
X.compositionstart = X.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      n.markCursor = n.state.storedMarks || t.marks(), En(n, !0), n.markCursor = null;
    else if (En(n), me && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
      let r = n.domSelectionRange();
      for (let o = r.focusNode, s = r.focusOffset; o && o.nodeType == 1 && s != 0; ) {
        let i = s < 0 ? o.lastChild : o.childNodes[s - 1];
        if (!i)
          break;
        if (i.nodeType == 3) {
          n.domSelection().collapse(i, i.nodeValue.length);
          break;
        } else
          o = i, s = -1;
      }
    }
    n.input.composing = !0;
  }
  wl(n, Au);
};
X.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, wl(n, 20));
};
function wl(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => En(n), e));
}
function Cl(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = Su()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function Su() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function En(n, e = !1) {
  if (!(de && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Cl(n), e || n.docView && n.docView.dirty) {
      let t = ao(n);
      return t && !t.eq(n.state.selection) ? n.dispatch(n.state.tr.setSelection(t)) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function Tu(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), o = document.createRange();
  o.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(o), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Kt = te && $e < 15 || St && Ca < 604;
K.copy = X.cut = (n, e) => {
  let t = e, r = n.state.selection, o = t.type == "cut";
  if (r.empty)
    return;
  let s = Kt ? null : t.clipboardData, i = r.content(), { dom: l, text: c } = ml(n, i);
  s ? (t.preventDefault(), s.clearData(), s.setData("text/html", l.innerHTML), s.setData("text/plain", c)) : Tu(n, l), o && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Eu(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function Iu(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let o = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? Xt(n, r.value, null, o, e) : Xt(n, r.textContent, r.innerHTML, o, e);
  }, 50);
}
function Xt(n, e, t, r, o) {
  let s = gl(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (c) => c(n, o, s || D.empty)))
    return !0;
  if (!s)
    return !1;
  let i = Eu(s), l = i ? n.state.tr.replaceSelectionWith(i, r) : n.state.tr.replaceSelection(s);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Al(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
X.paste = (n, e) => {
  let t = e;
  if (n.composing && !de)
    return;
  let r = Kt ? null : t.clipboardData, o = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && Xt(n, Al(r), r.getData("text/html"), o, t) ? t.preventDefault() : Iu(n, t);
};
class Sl {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const Tl = ie ? "altKey" : "ctrlKey";
K.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let o = n.state.selection, s = o.empty ? null : n.posAtCoords(Bn(t)), i;
  if (!(s && s.pos >= o.from && s.pos <= (o instanceof C ? o.to - 1 : o.to))) {
    if (r && r.mightDrag)
      i = C.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let u = n.docView.nearestDesc(t.target, !0);
      u && u.node.type.spec.draggable && u != n.docView && (i = C.create(n.state.doc, u.posBefore));
    }
  }
  let l = (i || n.state.selection).content(), { dom: c, text: a } = ml(n, l);
  t.dataTransfer.clearData(), t.dataTransfer.setData(Kt ? "Text" : "text/html", c.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Kt || t.dataTransfer.setData("text/plain", a), n.dragging = new Sl(l, !t[Tl], i);
};
K.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
X.dragover = X.dragenter = (n, e) => e.preventDefault();
X.drop = (n, e) => {
  let t = e, r = n.dragging;
  if (n.dragging = null, !t.dataTransfer)
    return;
  let o = n.posAtCoords(Bn(t));
  if (!o)
    return;
  let s = n.state.doc.resolve(o.pos), i = r && r.slice;
  i ? n.someProp("transformPasted", (p) => {
    i = p(i, n);
  }) : i = gl(n, Al(t.dataTransfer), Kt ? null : t.dataTransfer.getData("text/html"), !1, s);
  let l = !!(r && !t[Tl]);
  if (n.someProp("handleDrop", (p) => p(n, t, i || D.empty, l))) {
    t.preventDefault();
    return;
  }
  if (!i)
    return;
  t.preventDefault();
  let c = i ? Qi(n.state.doc, s.pos, i) : s.pos;
  c == null && (c = s.pos);
  let a = n.state.tr;
  if (l) {
    let { node: p } = r;
    p ? p.replace(a) : a.deleteSelection();
  }
  let u = a.mapping.map(c), f = i.openStart == 0 && i.openEnd == 0 && i.content.childCount == 1, h = a.doc;
  if (f ? a.replaceRangeWith(u, u, i.content.firstChild) : a.replaceRange(u, u, i), a.doc.eq(h))
    return;
  let d = a.doc.resolve(u);
  if (f && C.isSelectable(i.content.firstChild) && d.nodeAfter && d.nodeAfter.sameMarkup(i.content.firstChild))
    a.setSelection(new C(d));
  else {
    let p = a.mapping.map(c);
    a.mapping.maps[a.mapping.maps.length - 1].forEach((m, g, y, k) => p = k), a.setSelection(uo(n, d, a.doc.resolve(p)));
  }
  n.focus(), n.dispatch(a.setMeta("uiEvent", "drop"));
};
K.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && Oe(n);
  }, 20));
};
K.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
K.beforeinput = (n, e) => {
  if (H && de && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (s) => s(n, et(8, "Backspace")))))
        return;
      let { $cursor: o } = n.state.selection;
      o && o.pos > 0 && n.dispatch(n.state.tr.delete(o.pos - 1, o.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in X)
  K[n] = X[n];
function en(n, e) {
  if (n == e)
    return !0;
  for (let t in n)
    if (n[t] !== e[t])
      return !1;
  for (let t in e)
    if (!(t in n))
      return !1;
  return !0;
}
class In {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || lt, this.side = this.spec.side || 0;
  }
  map(e, t, r, o) {
    let { pos: s, deleted: i } = e.mapResult(t.from + o, this.side < 0 ? -1 : 1);
    return i ? null : new ae(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof In && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && en(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class Ye {
  constructor(e, t) {
    this.attrs = e, this.spec = t || lt;
  }
  map(e, t, r, o) {
    let s = e.map(t.from + o, this.spec.inclusiveStart ? -1 : 1) - r, i = e.map(t.to + o, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= i ? null : new ae(s, i, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof Ye && en(this.attrs, e.attrs) && en(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof Ye;
  }
  destroy() {
  }
}
class mo {
  constructor(e, t) {
    this.attrs = e, this.spec = t || lt;
  }
  map(e, t, r, o) {
    let s = e.mapResult(t.from + o, 1);
    if (s.deleted)
      return null;
    let i = e.mapResult(t.to + o, -1);
    return i.deleted || i.pos <= s.pos ? null : new ae(s.pos - r, i.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: o } = e.content.findIndex(t.from), s;
    return o == t.from && !(s = e.child(r)).isText && o + s.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof mo && en(this.attrs, e.attrs) && en(this.spec, e.spec);
  }
  destroy() {
  }
}
class ae {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.from = e, this.to = t, this.type = r;
  }
  /**
  @internal
  */
  copy(e, t) {
    return new ae(e, t, this.type);
  }
  /**
  @internal
  */
  eq(e, t = 0) {
    return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
  }
  /**
  @internal
  */
  map(e, t, r) {
    return this.type.map(e, this, t, r);
  }
  /**
  Creates a widget decoration, which is a DOM node that's shown in
  the document at the given position. It is recommended that you
  delay rendering the widget by passing a function that will be
  called when the widget is actually drawn in a view, but you can
  also directly pass a DOM node. `getPos` can be used to find the
  widget's current document position.
  */
  static widget(e, t, r) {
    return new ae(e, e, new In(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, o) {
    return new ae(e, t, new Ye(r, o));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, o) {
    return new ae(e, t, new mo(r, o));
  }
  /**
  The spec provided when creating this decoration. Can be useful
  if you've stored extra information in that object.
  */
  get spec() {
    return this.type.spec;
  }
  /**
  @internal
  */
  get inline() {
    return this.type instanceof Ye;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof In;
  }
}
const yt = [], lt = {};
class F {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : yt, this.children = t.length ? t : yt;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? vn(t, e, 0, lt) : Q;
  }
  /**
  Find all decorations in this set which touch the given range
  (including decorations that start or end directly at the
  boundaries) and match the given predicate on their spec. When
  `start` and `end` are omitted, all decorations in the set are
  considered. When `predicate` isn't given, all decorations are
  assumed to match.
  */
  find(e, t, r) {
    let o = [];
    return this.findInner(e ?? 0, t ?? 1e9, o, 0, r), o;
  }
  findInner(e, t, r, o, s) {
    for (let i = 0; i < this.local.length; i++) {
      let l = this.local[i];
      l.from <= t && l.to >= e && (!s || s(l.spec)) && r.push(l.copy(l.from + o, l.to + o));
    }
    for (let i = 0; i < this.children.length; i += 3)
      if (this.children[i] < t && this.children[i + 1] > e) {
        let l = this.children[i] + 1;
        this.children[i + 2].findInner(e - l, t - l, r, o + l, s);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, t, r) {
    return this == Q || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || lt);
  }
  /**
  @internal
  */
  mapInner(e, t, r, o, s) {
    let i;
    for (let l = 0; l < this.local.length; l++) {
      let c = this.local[l].map(e, r, o);
      c && c.type.valid(t, c) ? (i || (i = [])).push(c) : s.onRemove && s.onRemove(this.local[l].spec);
    }
    return this.children.length ? vu(this.children, i || [], e, t, r, o, s) : i ? new F(i.sort(ct), yt) : Q;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == Q ? F.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let o, s = 0;
    e.forEach((l, c) => {
      let a = c + r, u;
      if (u = Il(t, l, a)) {
        for (o || (o = this.children.slice()); s < o.length && o[s] < c; )
          s += 3;
        o[s] == c ? o[s + 2] = o[s + 2].addInner(l, u, a + 1) : o.splice(s, 0, c, c + l.nodeSize, vn(u, l, a + 1, lt)), s += 3;
      }
    });
    let i = El(s ? vl(t) : t, -r);
    for (let l = 0; l < i.length; l++)
      i[l].type.valid(e, i[l]) || i.splice(l--, 1);
    return new F(i.length ? this.local.concat(i).sort(ct) : this.local, o || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Q ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let r = this.children, o = this.local;
    for (let s = 0; s < r.length; s += 3) {
      let i, l = r[s] + t, c = r[s + 1] + t;
      for (let u = 0, f; u < e.length; u++)
        (f = e[u]) && f.from > l && f.to < c && (e[u] = null, (i || (i = [])).push(f));
      if (!i)
        continue;
      r == this.children && (r = this.children.slice());
      let a = r[s + 2].removeInner(i, l + 1);
      a != Q ? r[s + 2] = a : (r.splice(s, 3), s -= 3);
    }
    if (o.length) {
      for (let s = 0, i; s < e.length; s++)
        if (i = e[s])
          for (let l = 0; l < o.length; l++)
            o[l].eq(i, t) && (o == this.local && (o = this.local.slice()), o.splice(l--, 1));
    }
    return r == this.children && o == this.local ? this : o.length || r.length ? new F(o, r) : Q;
  }
  /**
  @internal
  */
  forChild(e, t) {
    if (this == Q)
      return this;
    if (t.isLeaf)
      return F.empty;
    let r, o;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let s = e + 1, i = s + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let c = this.local[l];
      if (c.from < i && c.to > s && c.type instanceof Ye) {
        let a = Math.max(s, c.from) - s, u = Math.min(i, c.to) - s;
        a < u && (o || (o = [])).push(c.copy(a, u));
      }
    }
    if (o) {
      let l = new F(o.sort(ct), yt);
      return r ? new Be([l, r]) : l;
    }
    return r || Q;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof F) || this.local.length != e.local.length || this.children.length != e.children.length)
      return !1;
    for (let t = 0; t < this.local.length; t++)
      if (!this.local[t].eq(e.local[t]))
        return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (this.children[t] != e.children[t] || this.children[t + 1] != e.children[t + 1] || !this.children[t + 2].eq(e.children[t + 2]))
        return !1;
    return !0;
  }
  /**
  @internal
  */
  locals(e) {
    return go(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Q)
      return yt;
    if (e.inlineContent || !this.local.some(Ye.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof Ye || t.push(this.local[r]);
    return t;
  }
}
F.empty = new F([], []);
F.removeOverlap = go;
const Q = F.empty;
class Be {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((o) => o.map(e, t, lt));
    return Be.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return F.empty;
    let r = [];
    for (let o = 0; o < this.members.length; o++) {
      let s = this.members[o].forChild(e, t);
      s != Q && (s instanceof Be ? r = r.concat(s.members) : r.push(s));
    }
    return Be.from(r);
  }
  eq(e) {
    if (!(e instanceof Be) || e.members.length != this.members.length)
      return !1;
    for (let t = 0; t < this.members.length; t++)
      if (!this.members[t].eq(e.members[t]))
        return !1;
    return !0;
  }
  locals(e) {
    let t, r = !0;
    for (let o = 0; o < this.members.length; o++) {
      let s = this.members[o].localsInner(e);
      if (s.length)
        if (!t)
          t = s;
        else {
          r && (t = t.slice(), r = !1);
          for (let i = 0; i < s.length; i++)
            t.push(s[i]);
        }
    }
    return t ? go(r ? t : t.sort(ct)) : yt;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return Q;
      case 1:
        return e[0];
      default:
        return new Be(e.every((t) => t instanceof F) ? e : e.reduce((t, r) => t.concat(r instanceof F ? r : r.members), []));
    }
  }
}
function vu(n, e, t, r, o, s, i) {
  let l = n.slice();
  for (let a = 0, u = s; a < t.maps.length; a++) {
    let f = 0;
    t.maps[a].forEach((h, d, p, m) => {
      let g = m - p - (d - h);
      for (let y = 0; y < l.length; y += 3) {
        let k = l[y + 1];
        if (k < 0 || h > k + u - f)
          continue;
        let w = l[y] + u - f;
        d >= w ? l[y + 1] = h <= w ? -2 : -1 : h >= u && g && (l[y] += g, l[y + 1] += g);
      }
      f += g;
    }), u = t.maps[a].map(u, -1);
  }
  let c = !1;
  for (let a = 0; a < l.length; a += 3)
    if (l[a + 1] < 0) {
      if (l[a + 1] == -2) {
        c = !0, l[a + 1] = -1;
        continue;
      }
      let u = t.map(n[a] + s), f = u - o;
      if (f < 0 || f >= r.content.size) {
        c = !0;
        continue;
      }
      let h = t.map(n[a + 1] + s, -1), d = h - o, { index: p, offset: m } = r.content.findIndex(f), g = r.maybeChild(p);
      if (g && m == f && m + g.nodeSize == d) {
        let y = l[a + 2].mapInner(t, g, u + 1, n[a] + s + 1, i);
        y != Q ? (l[a] = f, l[a + 1] = d, l[a + 2] = y) : (l[a + 1] = -2, c = !0);
      } else
        c = !0;
    }
  if (c) {
    let a = Ou(l, n, e, t, o, s, i), u = vn(a, r, 0, i);
    e = u.local;
    for (let f = 0; f < l.length; f += 3)
      l[f + 1] < 0 && (l.splice(f, 3), f -= 3);
    for (let f = 0, h = 0; f < u.children.length; f += 3) {
      let d = u.children[f];
      for (; h < l.length && l[h] < d; )
        h += 3;
      l.splice(h, 0, u.children[f], u.children[f + 1], u.children[f + 2]);
    }
  }
  return new F(e.sort(ct), l);
}
function El(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let o = n[r];
    t.push(new ae(o.from + e, o.to + e, o.type));
  }
  return t;
}
function Ou(n, e, t, r, o, s, i) {
  function l(c, a) {
    for (let u = 0; u < c.local.length; u++) {
      let f = c.local[u].map(r, o, a);
      f ? t.push(f) : i.onRemove && i.onRemove(c.local[u].spec);
    }
    for (let u = 0; u < c.children.length; u += 3)
      l(c.children[u + 2], c.children[u] + a + 1);
  }
  for (let c = 0; c < n.length; c += 3)
    n[c + 1] == -1 && l(n[c + 2], e[c] + s + 1);
  return t;
}
function Il(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, o = null;
  for (let s = 0, i; s < n.length; s++)
    (i = n[s]) && i.from > t && i.to < r && ((o || (o = [])).push(i), n[s] = null);
  return o;
}
function vl(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function vn(n, e, t, r) {
  let o = [], s = !1;
  e.forEach((l, c) => {
    let a = Il(n, l, c + t);
    if (a) {
      s = !0;
      let u = vn(a, l, t + c + 1, r);
      u != Q && o.push(c, c + l.nodeSize, u);
    }
  });
  let i = El(s ? vl(n) : n, -t).sort(ct);
  for (let l = 0; l < i.length; l++)
    i[l].type.valid(e, i[l]) || (r.onRemove && r.onRemove(i[l].spec), i.splice(l--, 1));
  return i.length || o.length ? new F(i, o) : Q;
}
function ct(n, e) {
  return n.from - e.from || n.to - e.to;
}
function go(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let o = t + 1; o < e.length; o++) {
        let s = e[o];
        if (s.from == r.from) {
          s.to != r.to && (e == n && (e = n.slice()), e[o] = s.copy(s.from, r.to), ys(e, o + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, s.from), ys(e, o, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function ys(n, e, t) {
  for (; e < n.length && ct(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function ar(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != Q && e.push(r);
  }), n.cursorWrapper && e.push(F.create(n.state.doc, [n.cursorWrapper.deco])), Be.from(e);
}
const zu = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, _u = te && $e <= 11;
class ju {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  set(e) {
    this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
  }
  clear() {
    this.anchorNode = this.focusNode = null;
  }
  eq(e) {
    return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
  }
}
class Lu {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new ju(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let o = 0; o < r.length; o++)
        this.queue.push(r[o]);
      te && $e <= 11 && r.some((o) => o.type == "childList" && o.removedNodes.length || o.type == "characterData" && o.oldValue.length > o.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), _u && (this.onCharData = (r) => {
      this.queue.push({ target: r.target, type: "characterData", oldValue: r.prevValue }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this);
  }
  flushSoon() {
    this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
      this.flushingSoon = -1, this.flush();
    }, 20));
  }
  forceFlush() {
    this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
  }
  start() {
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, zu)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
  }
  stop() {
    if (this.observer) {
      let e = this.observer.takeRecords();
      if (e.length) {
        for (let t = 0; t < e.length; t++)
          this.queue.push(e[t]);
        window.setTimeout(() => this.flush(), 20);
      }
      this.observer.disconnect();
    }
    this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
  }
  connectSelection() {
    this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
  }
  disconnectSelection() {
    this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
  }
  suppressSelectionUpdates() {
    this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
  }
  onSelectionChange() {
    if (as(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Oe(this.view);
      if (te && $e <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && ut(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
          return this.flushSoon();
      }
      this.flush();
    }
  }
  setCurSelection() {
    this.currentSelection.set(this.view.domSelectionRange());
  }
  ignoreSelectionChange(e) {
    if (!e.focusNode)
      return !0;
    let t = /* @__PURE__ */ new Set(), r;
    for (let s = e.focusNode; s; s = Zt(s))
      t.add(s);
    for (let s = e.anchorNode; s; s = Zt(s))
      if (t.has(s)) {
        r = s;
        break;
      }
    let o = r && this.view.docView.nearestDesc(r);
    if (o && o.ignoreMutation({
      type: "selection",
      target: r.nodeType == 3 ? r.parentNode : r
    }))
      return this.setCurSelection(), !0;
  }
  pendingRecords() {
    if (this.observer)
      for (let e of this.observer.takeRecords())
        this.queue.push(e);
    return this.queue;
  }
  flush() {
    let { view: e } = this;
    if (!e.docView || this.flushingSoon > -1)
      return;
    let t = this.pendingRecords();
    t.length && (this.queue = []);
    let r = e.domSelectionRange(), o = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && as(e) && !this.ignoreSelectionChange(r), s = -1, i = -1, l = !1, c = [];
    if (e.editable)
      for (let u = 0; u < t.length; u++) {
        let f = this.registerMutation(t[u], c);
        f && (s = s < 0 ? f.from : Math.min(f.from, s), i = i < 0 ? f.to : Math.max(f.to, i), f.typeOver && (l = !0));
      }
    if (me && c.length > 1) {
      let u = c.filter((f) => f.nodeName == "BR");
      if (u.length == 2) {
        let f = u[0], h = u[1];
        f.parentNode && f.parentNode.parentNode == h.parentNode ? h.remove() : f.remove();
      }
    }
    let a = null;
    s < 0 && o && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Rn(r) && (a = ao(e)) && a.eq(I.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Oe(e), this.currentSelection.set(r), e.scrollToSelection()) : (s > -1 || o) && (s > -1 && (e.docView.markDirty(s, i), qu(e)), this.handleDOMChange(s, i, l, c), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Oe(e), this.currentSelection.set(r));
  }
  registerMutation(e, t) {
    if (t.indexOf(e.target) > -1)
      return null;
    let r = this.view.docView.nearestDesc(e.target);
    if (e.type == "attributes" && (r == this.view.docView || e.attributeName == "contenteditable" || // Firefox sometimes fires spurious events for null/empty styles
    e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !r || r.ignoreMutation(e))
      return null;
    if (e.type == "childList") {
      for (let u = 0; u < e.addedNodes.length; u++)
        t.push(e.addedNodes[u]);
      if (r.contentDOM && r.contentDOM != r.dom && !r.contentDOM.contains(e.target))
        return { from: r.posBefore, to: r.posAfter };
      let o = e.previousSibling, s = e.nextSibling;
      if (te && $e <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: f, nextSibling: h } = e.addedNodes[u];
          (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (o = f), (!h || Array.prototype.indexOf.call(e.addedNodes, h) < 0) && (s = h);
        }
      let i = o && o.parentNode == e.target ? J(o) + 1 : 0, l = r.localPosFromDOM(e.target, i, -1), c = s && s.parentNode == e.target ? J(s) : e.target.childNodes.length, a = r.localPosFromDOM(e.target, c, 1);
      return { from: l, to: a };
    } else
      return e.type == "attributes" ? { from: r.posAtStart - r.border, to: r.posAtEnd + r.border } : {
        from: r.posAtStart,
        to: r.posAtEnd,
        // An event was generated for a text change that didn't change
        // any text. Mark the dom change to fall back to assuming the
        // selection was typed over with an identical value if it can't
        // find another change.
        typeOver: e.target.nodeValue == e.oldValue
      };
  }
}
let Ms = /* @__PURE__ */ new WeakMap(), ks = !1;
function qu(n) {
  if (!Ms.has(n) && (Ms.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = me, ks)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), ks = !0;
  }
}
function Ru(n) {
  let e;
  function t(c) {
    c.preventDefault(), c.stopImmediatePropagation(), e = c.getTargetRanges()[0];
  }
  n.dom.addEventListener("beforeinput", t, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", t, !0);
  let r = e.startContainer, o = e.startOffset, s = e.endContainer, i = e.endOffset, l = n.domAtPos(n.state.selection.anchor);
  return ut(l.node, l.offset, s, i) && ([r, o, s, i] = [s, i, r, o]), { anchorNode: r, anchorOffset: o, focusNode: s, focusOffset: i };
}
function Fu(n, e, t) {
  let { node: r, fromOffset: o, toOffset: s, from: i, to: l } = n.docView.parseRange(e, t), c = n.domSelectionRange(), a, u = c.anchorNode;
  if (u && n.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (a = [{ node: u, offset: c.anchorOffset }], Rn(c) || a.push({ node: c.focusNode, offset: c.focusOffset })), H && n.input.lastKeyCode === 8)
    for (let g = s; g > o; g--) {
      let y = r.childNodes[g - 1], k = y.pmViewDesc;
      if (y.nodeName == "BR" && !k) {
        s = g;
        break;
      }
      if (!k || k.size)
        break;
    }
  let f = n.state.doc, h = n.someProp("domParser") || wt.fromSchema(n.state.schema), d = f.resolve(i), p = null, m = h.parse(r, {
    topNode: d.parent,
    topMatch: d.parent.contentMatchAt(d.index()),
    topOpen: !0,
    from: o,
    to: s,
    preserveWhitespace: d.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: a,
    ruleFromNode: Bu,
    context: d
  });
  if (a && a[0].pos != null) {
    let g = a[0].pos, y = a[1] && a[1].pos;
    y == null && (y = g), p = { anchor: g + i, head: y + i };
  }
  return { doc: m, sel: p, from: i, to: l };
}
function Bu(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (Z && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || Z && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const Pu = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Uu(n, e, t, r, o) {
  let s = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let A = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, E = ao(n, A);
    if (E && !n.state.selection.eq(E)) {
      if (H && de && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (_e) => _e(n, et(13, "Enter"))))
        return;
      let W = n.state.tr.setSelection(E);
      A == "pointer" ? W.setMeta("pointer", !0) : A == "key" && W.scrollIntoView(), s && W.setMeta("composition", s), n.dispatch(W);
    }
    return;
  }
  let i = n.state.doc.resolve(e), l = i.sharedDepth(t);
  e = i.before(l + 1), t = n.state.doc.resolve(t).after(l + 1);
  let c = n.state.selection, a = Fu(n, e, t), u = n.state.doc, f = u.slice(a.from, a.to), h, d;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (h = n.state.selection.to, d = "end") : (h = n.state.selection.from, d = "start"), n.input.lastKeyCode = null;
  let p = Qu(f.content, a.doc.content, a.from, h, d);
  if ((St && n.input.lastIOSEnter > Date.now() - 225 || de) && o.some((A) => A.nodeType == 1 && !Pu.test(A.nodeName)) && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (A) => A(n, et(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && c instanceof j && !c.empty && c.$head.sameParent(c.$anchor) && !n.composing && !(a.sel && a.sel.anchor != a.sel.head))
      p = { start: c.from, endA: c.to, endB: c.to };
    else {
      if (a.sel) {
        let A = xs(n, n.state.doc, a.sel);
        if (A && !A.eq(n.state.selection)) {
          let E = n.state.tr.setSelection(A);
          s && E.setMeta("composition", s), n.dispatch(E);
        }
      }
      return;
    }
  if (H && n.cursorWrapper && a.sel && a.sel.anchor == n.cursorWrapper.deco.from && a.sel.head == a.sel.anchor) {
    let A = p.endB - p.start;
    a.sel = { anchor: a.sel.anchor + A, head: a.sel.anchor + A };
  }
  n.input.domChangeCount++, n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof j && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= a.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= a.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), te && $e <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > a.from && a.doc.textBetween(p.start - a.from - 1, p.start - a.from + 1) == "  " && (p.start--, p.endA--, p.endB--);
  let m = a.doc.resolveNoCache(p.start - a.from), g = a.doc.resolveNoCache(p.endB - a.from), y = u.resolve(p.start), k = m.sameParent(g) && m.parent.inlineContent && y.end() >= p.endA, w;
  if ((St && n.input.lastIOSEnter > Date.now() - 225 && (!k || o.some((A) => A.nodeName == "DIV" || A.nodeName == "P")) || !k && m.pos < a.doc.content.size && !m.sameParent(g) && (w = I.findFrom(a.doc.resolve(m.pos + 1), 1, !0)) && w.head == g.pos) && n.someProp("handleKeyDown", (A) => A(n, et(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && $u(u, p.start, p.endA, m, g) && n.someProp("handleKeyDown", (A) => A(n, et(8, "Backspace")))) {
    de && H && n.domObserver.suppressSelectionUpdates();
    return;
  }
  H && de && p.endB == p.start && (n.input.lastAndroidDelete = Date.now()), de && !k && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && a.sel && a.sel.anchor == a.sel.head && a.sel.head == p.endA && (p.endB -= 2, g = a.doc.resolveNoCache(p.endB - a.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(A) {
      return A(n, et(13, "Enter"));
    });
  }, 20));
  let S = p.start, T = p.endA, x, O, L;
  if (k) {
    if (m.pos == g.pos)
      te && $e <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Oe(n), 20)), x = n.state.tr.delete(S, T), O = u.resolve(p.start).marksAcross(u.resolve(p.endA));
    else if (
      // Adding or removing a mark
      p.endA == p.endB && (L = Vu(m.parent.content.cut(m.parentOffset, g.parentOffset), y.parent.content.cut(y.parentOffset, p.endA - y.start())))
    )
      x = n.state.tr, L.type == "add" ? x.addMark(S, T, L.mark) : x.removeMark(S, T, L.mark);
    else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let A = m.parent.textBetween(m.parentOffset, g.parentOffset);
      if (n.someProp("handleTextInput", (E) => E(n, S, T, A)))
        return;
      x = n.state.tr.insertText(A, S, T);
    }
  }
  if (x || (x = n.state.tr.replace(S, T, a.doc.slice(p.start - a.from, p.endB - a.from))), a.sel) {
    let A = xs(n, x.doc, a.sel);
    A && !(H && de && n.composing && A.empty && (p.start != p.endB || n.input.lastAndroidDelete < Date.now() - 100) && (A.head == S || A.head == x.mapping.map(T) - 1) || te && A.empty && A.head == S) && x.setSelection(A);
  }
  O && x.ensureMarks(O), s && x.setMeta("composition", s), n.dispatch(x.scrollIntoView());
}
function xs(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : uo(n, e.resolve(t.anchor), e.resolve(t.head));
}
function Vu(n, e) {
  let t = n.firstChild.marks, r = e.firstChild.marks, o = t, s = r, i, l, c;
  for (let u = 0; u < r.length; u++)
    o = r[u].removeFromSet(o);
  for (let u = 0; u < t.length; u++)
    s = t[u].removeFromSet(s);
  if (o.length == 1 && s.length == 0)
    l = o[0], i = "add", c = (u) => u.mark(l.addToSet(u.marks));
  else if (o.length == 0 && s.length == 1)
    l = s[0], i = "remove", c = (u) => u.mark(l.removeFromSet(u.marks));
  else
    return null;
  let a = [];
  for (let u = 0; u < e.childCount; u++)
    a.push(c(e.child(u)));
  if (M.from(a).eq(n))
    return { mark: l, type: i };
}
function $u(n, e, t, r, o) {
  if (!r.parent.isTextblock || // The content must have shrunk
  t - e <= o.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
  ur(r, !0, !1) < o.pos)
    return !1;
  let s = n.resolve(e);
  if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
    return !1;
  let i = n.resolve(ur(s, !0, !0));
  return !i.parent.isTextblock || i.pos > t || ur(i, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(i.parent.content);
}
function ur(n, e, t) {
  let r = n.depth, o = e ? n.end() : n.pos;
  for (; r > 0 && (e || n.indexAfter(r) == n.node(r).childCount); )
    r--, o++, e = !1;
  if (t) {
    let s = n.node(r).maybeChild(n.indexAfter(r));
    for (; s && !s.isLeaf; )
      s = s.firstChild, o++;
  }
  return o;
}
function Qu(n, e, t, r, o) {
  let s = n.findDiffStart(e, t);
  if (s == null)
    return null;
  let { a: i, b: l } = n.findDiffEnd(e, t + n.size, t + e.size);
  if (o == "end") {
    let c = Math.max(0, s - Math.min(i, l));
    r -= i + c - s;
  }
  if (i < s && n.size < e.size) {
    let c = r <= s && r >= i ? s - r : 0;
    s -= c, s && s < e.size && bs(e.textBetween(s - 1, s + 1)) && (s += c ? 1 : -1), l = s + (l - i), i = s;
  } else if (l < s) {
    let c = r <= s && r >= l ? s - r : 0;
    s -= c, s && s < n.size && bs(n.textBetween(s - 1, s + 1)) && (s += c ? 1 : -1), i = s + (i - l), l = s;
  }
  return { start: s, endA: i, endB: l };
}
function bs(n) {
  if (n.length != 2)
    return !1;
  let e = n.charCodeAt(0), t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class Yu {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new du(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(As), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = ws(this), Ns(this), this.nodeViews = Cs(this), this.docView = ns(this.state.doc, Ds(this), ar(this), this.dom, this), this.domObserver = new Lu(this, (r, o, s, i) => Uu(this, r, o, s, i)), this.domObserver.start(), pu(this), this.updatePluginViews();
  }
  /**
  Holds `true` when a
  [composition](https://w3c.github.io/uievents/#events-compositionevents)
  is active.
  */
  get composing() {
    return this.input.composing;
  }
  /**
  The view's current [props](https://prosemirror.net/docs/ref/#view.EditorProps).
  */
  get props() {
    if (this._props.state != this.state) {
      let e = this._props;
      this._props = {};
      for (let t in e)
        this._props[t] = e[t];
      this._props.state = this.state;
    }
    return this._props;
  }
  /**
  Update the view's props. Will immediately cause an update to
  the DOM.
  */
  update(e) {
    e.handleDOMEvents != this._props.handleDOMEvents && Gr(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(As), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
  }
  /**
  Update the view by updating existing props object with the object
  given as argument. Equivalent to `view.update(Object.assign({},
  view.props, props))`.
  */
  setProps(e) {
    let t = {};
    for (let r in this._props)
      t[r] = this._props[r];
    t.state = this.state;
    for (let r in e)
      t[r] = e[r];
    this.update(t);
  }
  /**
  Update the editor's `state` prop, without touching any of the
  other props.
  */
  updateState(e) {
    this.updateStateInner(e, this._props);
  }
  updateStateInner(e, t) {
    var r;
    let o = this.state, s = !1, i = !1;
    e.storedMarks && this.composing && (Cl(this), i = !0), this.state = e;
    let l = o.plugins != e.plugins || this._props.plugins != t.plugins;
    if (l || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let d = Cs(this);
      Gu(d, this.nodeViews) && (this.nodeViews = d, s = !0);
    }
    (l || t.handleDOMEvents != this._props.handleDOMEvents) && Gr(this), this.editable = ws(this), Ns(this);
    let c = ar(this), a = Ds(this), u = o.plugins != e.plugins && !o.doc.eq(e.doc) ? "reset" : e.scrollToSelection > o.scrollToSelection ? "to selection" : "preserve", f = s || !this.docView.matchesNode(e.doc, a, c);
    (f || !e.selection.eq(o.selection)) && (i = !0);
    let h = u == "preserve" && i && this.dom.style.overflowAnchor == null && Ta(this);
    if (i) {
      this.domObserver.stop();
      let d = f && (te || H) && !this.composing && !o.selection.empty && !e.selection.empty && Hu(o.selection, e.selection);
      if (f) {
        let p = H ? this.trackWrites = this.domSelectionRange().focusNode : null;
        (s || !this.docView.update(e.doc, a, c, this)) && (this.docView.updateOuterDeco([]), this.docView.destroy(), this.docView = ns(e.doc, a, c, this.dom, this)), p && !this.trackWrites && (d = !0);
      }
      d || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && Xa(this)) ? Oe(this, d) : (hl(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(o), !((r = this.dragging) === null || r === void 0) && r.node && !o.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, o), u == "reset" ? this.dom.scrollTop = 0 : u == "to selection" ? this.scrollToSelection() : h && Ea(h);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!this.someProp("handleScrollToSelection", (t) => t(this)))
      if (this.state.selection instanceof C) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && Jo(this, t.getBoundingClientRect(), e);
      } else
        Jo(this, this.coordsAtPos(this.state.selection.head, 1), e);
  }
  destroyPluginViews() {
    let e;
    for (; e = this.pluginViews.pop(); )
      e.destroy && e.destroy();
  }
  updatePluginViews(e) {
    if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
      this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
      for (let t = 0; t < this.directPlugins.length; t++) {
        let r = this.directPlugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
      for (let t = 0; t < this.state.plugins.length; t++) {
        let r = this.state.plugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
    } else
      for (let t = 0; t < this.pluginViews.length; t++) {
        let r = this.pluginViews[t];
        r.update && r.update(this, e);
      }
  }
  updateDraggedNode(e, t) {
    let r = e.node, o = -1;
    if (this.state.doc.nodeAt(r.from) == r.node)
      o = r.from;
    else {
      let s = r.from + (this.state.doc.content.size - t.doc.content.size);
      (s > 0 && this.state.doc.nodeAt(s)) == r.node && (o = s);
    }
    this.dragging = new Sl(e.slice, e.move, o < 0 ? void 0 : C.create(this.state.doc, o));
  }
  someProp(e, t) {
    let r = this._props && this._props[e], o;
    if (r != null && (o = t ? t(r) : r))
      return o;
    for (let i = 0; i < this.directPlugins.length; i++) {
      let l = this.directPlugins[i].props[e];
      if (l != null && (o = t ? t(l) : l))
        return o;
    }
    let s = this.state.plugins;
    if (s)
      for (let i = 0; i < s.length; i++) {
        let l = s[i].props[e];
        if (l != null && (o = t ? t(l) : l))
          return o;
      }
  }
  /**
  Query whether the view has focus.
  */
  hasFocus() {
    if (te) {
      let e = this.root.activeElement;
      if (e == this.dom)
        return !0;
      if (!e || !this.dom.contains(e))
        return !1;
      for (; e && this.dom != e && this.dom.contains(e); ) {
        if (e.contentEditable == "false")
          return !1;
        e = e.parentElement;
      }
      return !0;
    }
    return this.root.activeElement == this.dom;
  }
  /**
  Focus the editor.
  */
  focus() {
    this.domObserver.stop(), this.editable && Ia(this.dom), Oe(this), this.domObserver.start();
  }
  /**
  Get the document root in which the editor exists. This will
  usually be the top-level `document`, but might be a [shadow
  DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Shadow_DOM)
  root if the editor is inside one.
  */
  get root() {
    let e = this._root;
    if (e == null) {
      for (let t = this.dom.parentNode; t; t = t.parentNode)
        if (t.nodeType == 9 || t.nodeType == 11 && t.host)
          return t.getSelection || (Object.getPrototypeOf(t).getSelection = () => t.ownerDocument.getSelection()), this._root = t;
    }
    return e || document;
  }
  /**
  When an existing editor view is moved to a new document or
  shadow tree, call this to make it recompute its root.
  */
  updateRoot() {
    this._root = null;
  }
  /**
  Given a pair of viewport coordinates, return the document
  position that corresponds to them. May return null if the given
  coordinates aren't inside of the editor. When an object is
  returned, its `pos` property is the position nearest to the
  coordinates, and its `inside` property holds the position of the
  inner node that the position falls inside of, or -1 if it is at
  the top level, not in any node.
  */
  posAtCoords(e) {
    return ja(this, e);
  }
  /**
  Returns the viewport rectangle at a given document position.
  `left` and `right` will be the same number, as this returns a
  flat cursor-ish rectangle. If the position is between two things
  that aren't directly adjacent, `side` determines which element
  is used. When < 0, the element before the position is used,
  otherwise the element after.
  */
  coordsAtPos(e, t = 1) {
    return ol(this, e, t);
  }
  /**
  Find the DOM position that corresponds to the given document
  position. When `side` is negative, find the position as close as
  possible to the content before the position. When positive,
  prefer positions close to the content after the position. When
  zero, prefer as shallow a position as possible.
  
  Note that you should **not** mutate the editor's internal DOM,
  only inspect it (and even that is usually not necessary).
  */
  domAtPos(e, t = 0) {
    return this.docView.domFromPos(e, t);
  }
  /**
  Find the DOM node that represents the document node after the
  given position. May return `null` when the position doesn't point
  in front of a node or if the node is inside an opaque node view.
  
  This is intended to be able to call things like
  `getBoundingClientRect` on that DOM node. Do **not** mutate the
  editor DOM directly, or add styling this way, since that will be
  immediately overriden by the editor as it redraws the node.
  */
  nodeDOM(e) {
    let t = this.docView.descAt(e);
    return t ? t.nodeDOM : null;
  }
  /**
  Find the document position that corresponds to a given DOM
  position. (Whenever possible, it is preferable to inspect the
  document structure directly, rather than poking around in the
  DOM, but sometimes—for example when interpreting an event
  target—you don't have a choice.)
  
  The `bias` parameter can be used to influence which side of a DOM
  node to use when the position is inside a leaf node.
  */
  posAtDOM(e, t, r = -1) {
    let o = this.docView.posFromDOM(e, t, r);
    if (o == null)
      throw new RangeError("DOM position not inside the editor");
    return o;
  }
  /**
  Find out whether the selection is at the end of a textblock when
  moving in a given direction. When, for example, given `"left"`,
  it will return true if moving left from the current cursor
  position would leave that position's parent textblock. Will apply
  to the view's current state by default, but it is possible to
  pass a different state.
  */
  endOfTextblock(e, t) {
    return Ba(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return Xt(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return Xt(this, e, null, !0, t || new ClipboardEvent("paste"));
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (mu(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], ar(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null);
  }
  /**
  This is true when the view has been
  [destroyed](https://prosemirror.net/docs/ref/#view.EditorView.destroy) (and thus should not be
  used anymore).
  */
  get isDestroyed() {
    return this.docView == null;
  }
  /**
  Used for testing.
  */
  dispatchEvent(e) {
    return yu(this, e);
  }
  /**
  Dispatch a transaction. Will call
  [`dispatchTransaction`](https://prosemirror.net/docs/ref/#view.DirectEditorProps.dispatchTransaction)
  when given, and otherwise defaults to applying the transaction to
  the current state and calling
  [`updateState`](https://prosemirror.net/docs/ref/#view.EditorView.updateState) with the result.
  This method is bound to the view instance, so that it can be
  easily passed around.
  */
  dispatch(e) {
    let t = this._props.dispatchTransaction;
    t ? t.call(this, e) : this.updateState(this.state.apply(e));
  }
  /**
  @internal
  */
  domSelectionRange() {
    return Z && this.root.nodeType === 11 && ba(this.dom.ownerDocument) == this.dom ? Ru(this) : this.domSelection();
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
function Ds(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [ae.node(0, n.state.doc.content.size, e)];
}
function Ns(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: ae.widget(n.state.selection.head, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function ws(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function Hu(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Cs(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let o in r)
      Object.prototype.hasOwnProperty.call(e, o) || (e[o] = r[o]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function Gu(n, e) {
  let t = 0, r = 0;
  for (let o in n) {
    if (n[o] != e[o])
      return !0;
    t++;
  }
  for (let o in e)
    r++;
  return t != r;
}
function As(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
function Wu(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
function Ju(n) {
  if (n.__esModule)
    return n;
  var e = n.default;
  if (typeof e == "function") {
    var t = function r() {
      return this instanceof r ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
    };
    t.prototype = e.prototype;
  } else
    t = {};
  return Object.defineProperty(t, "__esModule", { value: !0 }), Object.keys(n).forEach(function(r) {
    var o = Object.getOwnPropertyDescriptor(n, r);
    Object.defineProperty(t, r, o.get ? o : {
      enumerable: !0,
      get: function() {
        return n[r];
      }
    });
  }), t;
}
var _ = {};
const Zu = "Á", Ku = "á", Xu = "Ă", ef = "ă", tf = "∾", nf = "∿", rf = "∾̳", of = "Â", sf = "â", lf = "´", cf = "А", af = "а", uf = "Æ", ff = "æ", hf = "⁡", df = "𝔄", pf = "𝔞", mf = "À", gf = "à", yf = "ℵ", Mf = "ℵ", kf = "Α", xf = "α", bf = "Ā", Df = "ā", Nf = "⨿", wf = "&", Cf = "&", Af = "⩕", Sf = "⩓", Tf = "∧", Ef = "⩜", If = "⩘", vf = "⩚", Of = "∠", zf = "⦤", _f = "∠", jf = "⦨", Lf = "⦩", qf = "⦪", Rf = "⦫", Ff = "⦬", Bf = "⦭", Pf = "⦮", Uf = "⦯", Vf = "∡", $f = "∟", Qf = "⊾", Yf = "⦝", Hf = "∢", Gf = "Å", Wf = "⍼", Jf = "Ą", Zf = "ą", Kf = "𝔸", Xf = "𝕒", eh = "⩯", th = "≈", nh = "⩰", rh = "≊", oh = "≋", sh = "'", ih = "⁡", lh = "≈", ch = "≊", ah = "Å", uh = "å", fh = "𝒜", hh = "𝒶", dh = "≔", ph = "*", mh = "≈", gh = "≍", yh = "Ã", Mh = "ã", kh = "Ä", xh = "ä", bh = "∳", Dh = "⨑", Nh = "≌", wh = "϶", Ch = "‵", Ah = "∽", Sh = "⋍", Th = "∖", Eh = "⫧", Ih = "⊽", vh = "⌅", Oh = "⌆", zh = "⌅", _h = "⎵", jh = "⎶", Lh = "≌", qh = "Б", Rh = "б", Fh = "„", Bh = "∵", Ph = "∵", Uh = "∵", Vh = "⦰", $h = "϶", Qh = "ℬ", Yh = "ℬ", Hh = "Β", Gh = "β", Wh = "ℶ", Jh = "≬", Zh = "𝔅", Kh = "𝔟", Xh = "⋂", ed = "◯", td = "⋃", nd = "⨀", rd = "⨁", od = "⨂", sd = "⨆", id = "★", ld = "▽", cd = "△", ad = "⨄", ud = "⋁", fd = "⋀", hd = "⤍", dd = "⧫", pd = "▪", md = "▴", gd = "▾", yd = "◂", Md = "▸", kd = "␣", xd = "▒", bd = "░", Dd = "▓", Nd = "█", wd = "=⃥", Cd = "≡⃥", Ad = "⫭", Sd = "⌐", Td = "𝔹", Ed = "𝕓", Id = "⊥", vd = "⊥", Od = "⋈", zd = "⧉", _d = "┐", jd = "╕", Ld = "╖", qd = "╗", Rd = "┌", Fd = "╒", Bd = "╓", Pd = "╔", Ud = "─", Vd = "═", $d = "┬", Qd = "╤", Yd = "╥", Hd = "╦", Gd = "┴", Wd = "╧", Jd = "╨", Zd = "╩", Kd = "⊟", Xd = "⊞", ep = "⊠", tp = "┘", np = "╛", rp = "╜", op = "╝", sp = "└", ip = "╘", lp = "╙", cp = "╚", ap = "│", up = "║", fp = "┼", hp = "╪", dp = "╫", pp = "╬", mp = "┤", gp = "╡", yp = "╢", Mp = "╣", kp = "├", xp = "╞", bp = "╟", Dp = "╠", Np = "‵", wp = "˘", Cp = "˘", Ap = "¦", Sp = "𝒷", Tp = "ℬ", Ep = "⁏", Ip = "∽", vp = "⋍", Op = "⧅", zp = "\\", _p = "⟈", jp = "•", Lp = "•", qp = "≎", Rp = "⪮", Fp = "≏", Bp = "≎", Pp = "≏", Up = "Ć", Vp = "ć", $p = "⩄", Qp = "⩉", Yp = "⩋", Hp = "∩", Gp = "⋒", Wp = "⩇", Jp = "⩀", Zp = "ⅅ", Kp = "∩︀", Xp = "⁁", em = "ˇ", tm = "ℭ", nm = "⩍", rm = "Č", om = "č", sm = "Ç", im = "ç", lm = "Ĉ", cm = "ĉ", am = "∰", um = "⩌", fm = "⩐", hm = "Ċ", dm = "ċ", pm = "¸", mm = "¸", gm = "⦲", ym = "¢", Mm = "·", km = "·", xm = "𝔠", bm = "ℭ", Dm = "Ч", Nm = "ч", wm = "✓", Cm = "✓", Am = "Χ", Sm = "χ", Tm = "ˆ", Em = "≗", Im = "↺", vm = "↻", Om = "⊛", zm = "⊚", _m = "⊝", jm = "⊙", Lm = "®", qm = "Ⓢ", Rm = "⊖", Fm = "⊕", Bm = "⊗", Pm = "○", Um = "⧃", Vm = "≗", $m = "⨐", Qm = "⫯", Ym = "⧂", Hm = "∲", Gm = "”", Wm = "’", Jm = "♣", Zm = "♣", Km = ":", Xm = "∷", eg = "⩴", tg = "≔", ng = "≔", rg = ",", og = "@", sg = "∁", ig = "∘", lg = "∁", cg = "ℂ", ag = "≅", ug = "⩭", fg = "≡", hg = "∮", dg = "∯", pg = "∮", mg = "𝕔", gg = "ℂ", yg = "∐", Mg = "∐", kg = "©", xg = "©", bg = "℗", Dg = "∳", Ng = "↵", wg = "✗", Cg = "⨯", Ag = "𝒞", Sg = "𝒸", Tg = "⫏", Eg = "⫑", Ig = "⫐", vg = "⫒", Og = "⋯", zg = "⤸", _g = "⤵", jg = "⋞", Lg = "⋟", qg = "↶", Rg = "⤽", Fg = "⩈", Bg = "⩆", Pg = "≍", Ug = "∪", Vg = "⋓", $g = "⩊", Qg = "⊍", Yg = "⩅", Hg = "∪︀", Gg = "↷", Wg = "⤼", Jg = "⋞", Zg = "⋟", Kg = "⋎", Xg = "⋏", e0 = "¤", t0 = "↶", n0 = "↷", r0 = "⋎", o0 = "⋏", s0 = "∲", i0 = "∱", l0 = "⌭", c0 = "†", a0 = "‡", u0 = "ℸ", f0 = "↓", h0 = "↡", d0 = "⇓", p0 = "‐", m0 = "⫤", g0 = "⊣", y0 = "⤏", M0 = "˝", k0 = "Ď", x0 = "ď", b0 = "Д", D0 = "д", N0 = "‡", w0 = "⇊", C0 = "ⅅ", A0 = "ⅆ", S0 = "⤑", T0 = "⩷", E0 = "°", I0 = "∇", v0 = "Δ", O0 = "δ", z0 = "⦱", _0 = "⥿", j0 = "𝔇", L0 = "𝔡", q0 = "⥥", R0 = "⇃", F0 = "⇂", B0 = "´", P0 = "˙", U0 = "˝", V0 = "`", $0 = "˜", Q0 = "⋄", Y0 = "⋄", H0 = "⋄", G0 = "♦", W0 = "♦", J0 = "¨", Z0 = "ⅆ", K0 = "ϝ", X0 = "⋲", ey = "÷", ty = "÷", ny = "⋇", ry = "⋇", oy = "Ђ", sy = "ђ", iy = "⌞", ly = "⌍", cy = "$", ay = "𝔻", uy = "𝕕", fy = "¨", hy = "˙", dy = "⃜", py = "≐", my = "≑", gy = "≐", yy = "∸", My = "∔", ky = "⊡", xy = "⌆", by = "∯", Dy = "¨", Ny = "⇓", wy = "⇐", Cy = "⇔", Ay = "⫤", Sy = "⟸", Ty = "⟺", Ey = "⟹", Iy = "⇒", vy = "⊨", Oy = "⇑", zy = "⇕", _y = "∥", jy = "⤓", Ly = "↓", qy = "↓", Ry = "⇓", Fy = "⇵", By = "̑", Py = "⇊", Uy = "⇃", Vy = "⇂", $y = "⥐", Qy = "⥞", Yy = "⥖", Hy = "↽", Gy = "⥟", Wy = "⥗", Jy = "⇁", Zy = "↧", Ky = "⊤", Xy = "⤐", eM = "⌟", tM = "⌌", nM = "𝒟", rM = "𝒹", oM = "Ѕ", sM = "ѕ", iM = "⧶", lM = "Đ", cM = "đ", aM = "⋱", uM = "▿", fM = "▾", hM = "⇵", dM = "⥯", pM = "⦦", mM = "Џ", gM = "џ", yM = "⟿", MM = "É", kM = "é", xM = "⩮", bM = "Ě", DM = "ě", NM = "Ê", wM = "ê", CM = "≖", AM = "≕", SM = "Э", TM = "э", EM = "⩷", IM = "Ė", vM = "ė", OM = "≑", zM = "ⅇ", _M = "≒", jM = "𝔈", LM = "𝔢", qM = "⪚", RM = "È", FM = "è", BM = "⪖", PM = "⪘", UM = "⪙", VM = "∈", $M = "⏧", QM = "ℓ", YM = "⪕", HM = "⪗", GM = "Ē", WM = "ē", JM = "∅", ZM = "∅", KM = "◻", XM = "∅", e1 = "▫", t1 = " ", n1 = " ", r1 = " ", o1 = "Ŋ", s1 = "ŋ", i1 = " ", l1 = "Ę", c1 = "ę", a1 = "𝔼", u1 = "𝕖", f1 = "⋕", h1 = "⧣", d1 = "⩱", p1 = "ε", m1 = "Ε", g1 = "ε", y1 = "ϵ", M1 = "≖", k1 = "≕", x1 = "≂", b1 = "⪖", D1 = "⪕", N1 = "⩵", w1 = "=", C1 = "≂", A1 = "≟", S1 = "⇌", T1 = "≡", E1 = "⩸", I1 = "⧥", v1 = "⥱", O1 = "≓", z1 = "ℯ", _1 = "ℰ", j1 = "≐", L1 = "⩳", q1 = "≂", R1 = "Η", F1 = "η", B1 = "Ð", P1 = "ð", U1 = "Ë", V1 = "ë", $1 = "€", Q1 = "!", Y1 = "∃", H1 = "∃", G1 = "ℰ", W1 = "ⅇ", J1 = "ⅇ", Z1 = "≒", K1 = "Ф", X1 = "ф", ek = "♀", tk = "ﬃ", nk = "ﬀ", rk = "ﬄ", ok = "𝔉", sk = "𝔣", ik = "ﬁ", lk = "◼", ck = "▪", ak = "fj", uk = "♭", fk = "ﬂ", hk = "▱", dk = "ƒ", pk = "𝔽", mk = "𝕗", gk = "∀", yk = "∀", Mk = "⋔", kk = "⫙", xk = "ℱ", bk = "⨍", Dk = "½", Nk = "⅓", wk = "¼", Ck = "⅕", Ak = "⅙", Sk = "⅛", Tk = "⅔", Ek = "⅖", Ik = "¾", vk = "⅗", Ok = "⅜", zk = "⅘", _k = "⅚", jk = "⅝", Lk = "⅞", qk = "⁄", Rk = "⌢", Fk = "𝒻", Bk = "ℱ", Pk = "ǵ", Uk = "Γ", Vk = "γ", $k = "Ϝ", Qk = "ϝ", Yk = "⪆", Hk = "Ğ", Gk = "ğ", Wk = "Ģ", Jk = "Ĝ", Zk = "ĝ", Kk = "Г", Xk = "г", ex = "Ġ", tx = "ġ", nx = "≥", rx = "≧", ox = "⪌", sx = "⋛", ix = "≥", lx = "≧", cx = "⩾", ax = "⪩", ux = "⩾", fx = "⪀", hx = "⪂", dx = "⪄", px = "⋛︀", mx = "⪔", gx = "𝔊", yx = "𝔤", Mx = "≫", kx = "⋙", xx = "⋙", bx = "ℷ", Dx = "Ѓ", Nx = "ѓ", wx = "⪥", Cx = "≷", Ax = "⪒", Sx = "⪤", Tx = "⪊", Ex = "⪊", Ix = "⪈", vx = "≩", Ox = "⪈", zx = "≩", _x = "⋧", jx = "𝔾", Lx = "𝕘", qx = "`", Rx = "≥", Fx = "⋛", Bx = "≧", Px = "⪢", Ux = "≷", Vx = "⩾", $x = "≳", Qx = "𝒢", Yx = "ℊ", Hx = "≳", Gx = "⪎", Wx = "⪐", Jx = "⪧", Zx = "⩺", Kx = ">", Xx = ">", eb = "≫", tb = "⋗", nb = "⦕", rb = "⩼", ob = "⪆", sb = "⥸", ib = "⋗", lb = "⋛", cb = "⪌", ab = "≷", ub = "≳", fb = "≩︀", hb = "≩︀", db = "ˇ", pb = " ", mb = "½", gb = "ℋ", yb = "Ъ", Mb = "ъ", kb = "⥈", xb = "↔", bb = "⇔", Db = "↭", Nb = "^", wb = "ℏ", Cb = "Ĥ", Ab = "ĥ", Sb = "♥", Tb = "♥", Eb = "…", Ib = "⊹", vb = "𝔥", Ob = "ℌ", zb = "ℋ", _b = "⤥", jb = "⤦", Lb = "⇿", qb = "∻", Rb = "↩", Fb = "↪", Bb = "𝕙", Pb = "ℍ", Ub = "―", Vb = "─", $b = "𝒽", Qb = "ℋ", Yb = "ℏ", Hb = "Ħ", Gb = "ħ", Wb = "≎", Jb = "≏", Zb = "⁃", Kb = "‐", Xb = "Í", eD = "í", tD = "⁣", nD = "Î", rD = "î", oD = "И", sD = "и", iD = "İ", lD = "Е", cD = "е", aD = "¡", uD = "⇔", fD = "𝔦", hD = "ℑ", dD = "Ì", pD = "ì", mD = "ⅈ", gD = "⨌", yD = "∭", MD = "⧜", kD = "℩", xD = "Ĳ", bD = "ĳ", DD = "Ī", ND = "ī", wD = "ℑ", CD = "ⅈ", AD = "ℐ", SD = "ℑ", TD = "ı", ED = "ℑ", ID = "⊷", vD = "Ƶ", OD = "⇒", zD = "℅", _D = "∞", jD = "⧝", LD = "ı", qD = "⊺", RD = "∫", FD = "∬", BD = "ℤ", PD = "∫", UD = "⊺", VD = "⋂", $D = "⨗", QD = "⨼", YD = "⁣", HD = "⁢", GD = "Ё", WD = "ё", JD = "Į", ZD = "į", KD = "𝕀", XD = "𝕚", eN = "Ι", tN = "ι", nN = "⨼", rN = "¿", oN = "𝒾", sN = "ℐ", iN = "∈", lN = "⋵", cN = "⋹", aN = "⋴", uN = "⋳", fN = "∈", hN = "⁢", dN = "Ĩ", pN = "ĩ", mN = "І", gN = "і", yN = "Ï", MN = "ï", kN = "Ĵ", xN = "ĵ", bN = "Й", DN = "й", NN = "𝔍", wN = "𝔧", CN = "ȷ", AN = "𝕁", SN = "𝕛", TN = "𝒥", EN = "𝒿", IN = "Ј", vN = "ј", ON = "Є", zN = "є", _N = "Κ", jN = "κ", LN = "ϰ", qN = "Ķ", RN = "ķ", FN = "К", BN = "к", PN = "𝔎", UN = "𝔨", VN = "ĸ", $N = "Х", QN = "х", YN = "Ќ", HN = "ќ", GN = "𝕂", WN = "𝕜", JN = "𝒦", ZN = "𝓀", KN = "⇚", XN = "Ĺ", ew = "ĺ", tw = "⦴", nw = "ℒ", rw = "Λ", ow = "λ", sw = "⟨", iw = "⟪", lw = "⦑", cw = "⟨", aw = "⪅", uw = "ℒ", fw = "«", hw = "⇤", dw = "⤟", pw = "←", mw = "↞", gw = "⇐", yw = "⤝", Mw = "↩", kw = "↫", xw = "⤹", bw = "⥳", Dw = "↢", Nw = "⤙", ww = "⤛", Cw = "⪫", Aw = "⪭", Sw = "⪭︀", Tw = "⤌", Ew = "⤎", Iw = "❲", vw = "{", Ow = "[", zw = "⦋", _w = "⦏", jw = "⦍", Lw = "Ľ", qw = "ľ", Rw = "Ļ", Fw = "ļ", Bw = "⌈", Pw = "{", Uw = "Л", Vw = "л", $w = "⤶", Qw = "“", Yw = "„", Hw = "⥧", Gw = "⥋", Ww = "↲", Jw = "≤", Zw = "≦", Kw = "⟨", Xw = "⇤", eC = "←", tC = "←", nC = "⇐", rC = "⇆", oC = "↢", sC = "⌈", iC = "⟦", lC = "⥡", cC = "⥙", aC = "⇃", uC = "⌊", fC = "↽", hC = "↼", dC = "⇇", pC = "↔", mC = "↔", gC = "⇔", yC = "⇆", MC = "⇋", kC = "↭", xC = "⥎", bC = "↤", DC = "⊣", NC = "⥚", wC = "⋋", CC = "⧏", AC = "⊲", SC = "⊴", TC = "⥑", EC = "⥠", IC = "⥘", vC = "↿", OC = "⥒", zC = "↼", _C = "⪋", jC = "⋚", LC = "≤", qC = "≦", RC = "⩽", FC = "⪨", BC = "⩽", PC = "⩿", UC = "⪁", VC = "⪃", $C = "⋚︀", QC = "⪓", YC = "⪅", HC = "⋖", GC = "⋚", WC = "⪋", JC = "⋚", ZC = "≦", KC = "≶", XC = "≶", eA = "⪡", tA = "≲", nA = "⩽", rA = "≲", oA = "⥼", sA = "⌊", iA = "𝔏", lA = "𝔩", cA = "≶", aA = "⪑", uA = "⥢", fA = "↽", hA = "↼", dA = "⥪", pA = "▄", mA = "Љ", gA = "љ", yA = "⇇", MA = "≪", kA = "⋘", xA = "⌞", bA = "⇚", DA = "⥫", NA = "◺", wA = "Ŀ", CA = "ŀ", AA = "⎰", SA = "⎰", TA = "⪉", EA = "⪉", IA = "⪇", vA = "≨", OA = "⪇", zA = "≨", _A = "⋦", jA = "⟬", LA = "⇽", qA = "⟦", RA = "⟵", FA = "⟵", BA = "⟸", PA = "⟷", UA = "⟷", VA = "⟺", $A = "⟼", QA = "⟶", YA = "⟶", HA = "⟹", GA = "↫", WA = "↬", JA = "⦅", ZA = "𝕃", KA = "𝕝", XA = "⨭", eS = "⨴", tS = "∗", nS = "_", rS = "↙", oS = "↘", sS = "◊", iS = "◊", lS = "⧫", cS = "(", aS = "⦓", uS = "⇆", fS = "⌟", hS = "⇋", dS = "⥭", pS = "‎", mS = "⊿", gS = "‹", yS = "𝓁", MS = "ℒ", kS = "↰", xS = "↰", bS = "≲", DS = "⪍", NS = "⪏", wS = "[", CS = "‘", AS = "‚", SS = "Ł", TS = "ł", ES = "⪦", IS = "⩹", vS = "<", OS = "<", zS = "≪", _S = "⋖", jS = "⋋", LS = "⋉", qS = "⥶", RS = "⩻", FS = "◃", BS = "⊴", PS = "◂", US = "⦖", VS = "⥊", $S = "⥦", QS = "≨︀", YS = "≨︀", HS = "¯", GS = "♂", WS = "✠", JS = "✠", ZS = "↦", KS = "↦", XS = "↧", eT = "↤", tT = "↥", nT = "▮", rT = "⨩", oT = "М", sT = "м", iT = "—", lT = "∺", cT = "∡", aT = " ", uT = "ℳ", fT = "𝔐", hT = "𝔪", dT = "℧", pT = "µ", mT = "*", gT = "⫰", yT = "∣", MT = "·", kT = "⊟", xT = "−", bT = "∸", DT = "⨪", NT = "∓", wT = "⫛", CT = "…", AT = "∓", ST = "⊧", TT = "𝕄", ET = "𝕞", IT = "∓", vT = "𝓂", OT = "ℳ", zT = "∾", _T = "Μ", jT = "μ", LT = "⊸", qT = "⊸", RT = "∇", FT = "Ń", BT = "ń", PT = "∠⃒", UT = "≉", VT = "⩰̸", $T = "≋̸", QT = "ŉ", YT = "≉", HT = "♮", GT = "ℕ", WT = "♮", JT = " ", ZT = "≎̸", KT = "≏̸", XT = "⩃", eE = "Ň", tE = "ň", nE = "Ņ", rE = "ņ", oE = "≇", sE = "⩭̸", iE = "⩂", lE = "Н", cE = "н", aE = "–", uE = "⤤", fE = "↗", hE = "⇗", dE = "↗", pE = "≠", mE = "≐̸", gE = "​", yE = "​", ME = "​", kE = "​", xE = "≢", bE = "⤨", DE = "≂̸", NE = "≫", wE = "≪", CE = `
`, AE = "∄", SE = "∄", TE = "𝔑", EE = "𝔫", IE = "≧̸", vE = "≱", OE = "≱", zE = "≧̸", _E = "⩾̸", jE = "⩾̸", LE = "⋙̸", qE = "≵", RE = "≫⃒", FE = "≯", BE = "≯", PE = "≫̸", UE = "↮", VE = "⇎", $E = "⫲", QE = "∋", YE = "⋼", HE = "⋺", GE = "∋", WE = "Њ", JE = "њ", ZE = "↚", KE = "⇍", XE = "‥", eI = "≦̸", tI = "≰", nI = "↚", rI = "⇍", oI = "↮", sI = "⇎", iI = "≰", lI = "≦̸", cI = "⩽̸", aI = "⩽̸", uI = "≮", fI = "⋘̸", hI = "≴", dI = "≪⃒", pI = "≮", mI = "⋪", gI = "⋬", yI = "≪̸", MI = "∤", kI = "⁠", xI = " ", bI = "𝕟", DI = "ℕ", NI = "⫬", wI = "¬", CI = "≢", AI = "≭", SI = "∦", TI = "∉", EI = "≠", II = "≂̸", vI = "∄", OI = "≯", zI = "≱", _I = "≧̸", jI = "≫̸", LI = "≹", qI = "⩾̸", RI = "≵", FI = "≎̸", BI = "≏̸", PI = "∉", UI = "⋵̸", VI = "⋹̸", $I = "∉", QI = "⋷", YI = "⋶", HI = "⧏̸", GI = "⋪", WI = "⋬", JI = "≮", ZI = "≰", KI = "≸", XI = "≪̸", ev = "⩽̸", tv = "≴", nv = "⪢̸", rv = "⪡̸", ov = "∌", sv = "∌", iv = "⋾", lv = "⋽", cv = "⊀", av = "⪯̸", uv = "⋠", fv = "∌", hv = "⧐̸", dv = "⋫", pv = "⋭", mv = "⊏̸", gv = "⋢", yv = "⊐̸", Mv = "⋣", kv = "⊂⃒", xv = "⊈", bv = "⊁", Dv = "⪰̸", Nv = "⋡", wv = "≿̸", Cv = "⊃⃒", Av = "⊉", Sv = "≁", Tv = "≄", Ev = "≇", Iv = "≉", vv = "∤", Ov = "∦", zv = "∦", _v = "⫽⃥", jv = "∂̸", Lv = "⨔", qv = "⊀", Rv = "⋠", Fv = "⊀", Bv = "⪯̸", Pv = "⪯̸", Uv = "⤳̸", Vv = "↛", $v = "⇏", Qv = "↝̸", Yv = "↛", Hv = "⇏", Gv = "⋫", Wv = "⋭", Jv = "⊁", Zv = "⋡", Kv = "⪰̸", Xv = "𝒩", eO = "𝓃", tO = "∤", nO = "∦", rO = "≁", oO = "≄", sO = "≄", iO = "∤", lO = "∦", cO = "⋢", aO = "⋣", uO = "⊄", fO = "⫅̸", hO = "⊈", dO = "⊂⃒", pO = "⊈", mO = "⫅̸", gO = "⊁", yO = "⪰̸", MO = "⊅", kO = "⫆̸", xO = "⊉", bO = "⊃⃒", DO = "⊉", NO = "⫆̸", wO = "≹", CO = "Ñ", AO = "ñ", SO = "≸", TO = "⋪", EO = "⋬", IO = "⋫", vO = "⋭", OO = "Ν", zO = "ν", _O = "#", jO = "№", LO = " ", qO = "≍⃒", RO = "⊬", FO = "⊭", BO = "⊮", PO = "⊯", UO = "≥⃒", VO = ">⃒", $O = "⤄", QO = "⧞", YO = "⤂", HO = "≤⃒", GO = "<⃒", WO = "⊴⃒", JO = "⤃", ZO = "⊵⃒", KO = "∼⃒", XO = "⤣", ez = "↖", tz = "⇖", nz = "↖", rz = "⤧", oz = "Ó", sz = "ó", iz = "⊛", lz = "Ô", cz = "ô", az = "⊚", uz = "О", fz = "о", hz = "⊝", dz = "Ő", pz = "ő", mz = "⨸", gz = "⊙", yz = "⦼", Mz = "Œ", kz = "œ", xz = "⦿", bz = "𝔒", Dz = "𝔬", Nz = "˛", wz = "Ò", Cz = "ò", Az = "⧁", Sz = "⦵", Tz = "Ω", Ez = "∮", Iz = "↺", vz = "⦾", Oz = "⦻", zz = "‾", _z = "⧀", jz = "Ō", Lz = "ō", qz = "Ω", Rz = "ω", Fz = "Ο", Bz = "ο", Pz = "⦶", Uz = "⊖", Vz = "𝕆", $z = "𝕠", Qz = "⦷", Yz = "“", Hz = "‘", Gz = "⦹", Wz = "⊕", Jz = "↻", Zz = "⩔", Kz = "∨", Xz = "⩝", e_ = "ℴ", t_ = "ℴ", n_ = "ª", r_ = "º", o_ = "⊶", s_ = "⩖", i_ = "⩗", l_ = "⩛", c_ = "Ⓢ", a_ = "𝒪", u_ = "ℴ", f_ = "Ø", h_ = "ø", d_ = "⊘", p_ = "Õ", m_ = "õ", g_ = "⨶", y_ = "⨷", M_ = "⊗", k_ = "Ö", x_ = "ö", b_ = "⌽", D_ = "‾", N_ = "⏞", w_ = "⎴", C_ = "⏜", A_ = "¶", S_ = "∥", T_ = "∥", E_ = "⫳", I_ = "⫽", v_ = "∂", O_ = "∂", z_ = "П", __ = "п", j_ = "%", L_ = ".", q_ = "‰", R_ = "⊥", F_ = "‱", B_ = "𝔓", P_ = "𝔭", U_ = "Φ", V_ = "φ", $_ = "ϕ", Q_ = "ℳ", Y_ = "☎", H_ = "Π", G_ = "π", W_ = "⋔", J_ = "ϖ", Z_ = "ℏ", K_ = "ℎ", X_ = "ℏ", e2 = "⨣", t2 = "⊞", n2 = "⨢", r2 = "+", o2 = "∔", s2 = "⨥", i2 = "⩲", l2 = "±", c2 = "±", a2 = "⨦", u2 = "⨧", f2 = "±", h2 = "ℌ", d2 = "⨕", p2 = "𝕡", m2 = "ℙ", g2 = "£", y2 = "⪷", M2 = "⪻", k2 = "≺", x2 = "≼", b2 = "⪷", D2 = "≺", N2 = "≼", w2 = "≺", C2 = "⪯", A2 = "≼", S2 = "≾", T2 = "⪯", E2 = "⪹", I2 = "⪵", v2 = "⋨", O2 = "⪯", z2 = "⪳", _2 = "≾", j2 = "′", L2 = "″", q2 = "ℙ", R2 = "⪹", F2 = "⪵", B2 = "⋨", P2 = "∏", U2 = "∏", V2 = "⌮", $2 = "⌒", Q2 = "⌓", Y2 = "∝", H2 = "∝", G2 = "∷", W2 = "∝", J2 = "≾", Z2 = "⊰", K2 = "𝒫", X2 = "𝓅", ej = "Ψ", tj = "ψ", nj = " ", rj = "𝔔", oj = "𝔮", sj = "⨌", ij = "𝕢", lj = "ℚ", cj = "⁗", aj = "𝒬", uj = "𝓆", fj = "ℍ", hj = "⨖", dj = "?", pj = "≟", mj = '"', gj = '"', yj = "⇛", Mj = "∽̱", kj = "Ŕ", xj = "ŕ", bj = "√", Dj = "⦳", Nj = "⟩", wj = "⟫", Cj = "⦒", Aj = "⦥", Sj = "⟩", Tj = "»", Ej = "⥵", Ij = "⇥", vj = "⤠", Oj = "⤳", zj = "→", _j = "↠", jj = "⇒", Lj = "⤞", qj = "↪", Rj = "↬", Fj = "⥅", Bj = "⥴", Pj = "⤖", Uj = "↣", Vj = "↝", $j = "⤚", Qj = "⤜", Yj = "∶", Hj = "ℚ", Gj = "⤍", Wj = "⤏", Jj = "⤐", Zj = "❳", Kj = "}", Xj = "]", eL = "⦌", tL = "⦎", nL = "⦐", rL = "Ř", oL = "ř", sL = "Ŗ", iL = "ŗ", lL = "⌉", cL = "}", aL = "Р", uL = "р", fL = "⤷", hL = "⥩", dL = "”", pL = "”", mL = "↳", gL = "ℜ", yL = "ℛ", ML = "ℜ", kL = "ℝ", xL = "ℜ", bL = "▭", DL = "®", NL = "®", wL = "∋", CL = "⇋", AL = "⥯", SL = "⥽", TL = "⌋", EL = "𝔯", IL = "ℜ", vL = "⥤", OL = "⇁", zL = "⇀", _L = "⥬", jL = "Ρ", LL = "ρ", qL = "ϱ", RL = "⟩", FL = "⇥", BL = "→", PL = "→", UL = "⇒", VL = "⇄", $L = "↣", QL = "⌉", YL = "⟧", HL = "⥝", GL = "⥕", WL = "⇂", JL = "⌋", ZL = "⇁", KL = "⇀", XL = "⇄", e4 = "⇌", t4 = "⇉", n4 = "↝", r4 = "↦", o4 = "⊢", s4 = "⥛", i4 = "⋌", l4 = "⧐", c4 = "⊳", a4 = "⊵", u4 = "⥏", f4 = "⥜", h4 = "⥔", d4 = "↾", p4 = "⥓", m4 = "⇀", g4 = "˚", y4 = "≓", M4 = "⇄", k4 = "⇌", x4 = "‏", b4 = "⎱", D4 = "⎱", N4 = "⫮", w4 = "⟭", C4 = "⇾", A4 = "⟧", S4 = "⦆", T4 = "𝕣", E4 = "ℝ", I4 = "⨮", v4 = "⨵", O4 = "⥰", z4 = ")", _4 = "⦔", j4 = "⨒", L4 = "⇉", q4 = "⇛", R4 = "›", F4 = "𝓇", B4 = "ℛ", P4 = "↱", U4 = "↱", V4 = "]", $4 = "’", Q4 = "’", Y4 = "⋌", H4 = "⋊", G4 = "▹", W4 = "⊵", J4 = "▸", Z4 = "⧎", K4 = "⧴", X4 = "⥨", e3 = "℞", t3 = "Ś", n3 = "ś", r3 = "‚", o3 = "⪸", s3 = "Š", i3 = "š", l3 = "⪼", c3 = "≻", a3 = "≽", u3 = "⪰", f3 = "⪴", h3 = "Ş", d3 = "ş", p3 = "Ŝ", m3 = "ŝ", g3 = "⪺", y3 = "⪶", M3 = "⋩", k3 = "⨓", x3 = "≿", b3 = "С", D3 = "с", N3 = "⊡", w3 = "⋅", C3 = "⩦", A3 = "⤥", S3 = "↘", T3 = "⇘", E3 = "↘", I3 = "§", v3 = ";", O3 = "⤩", z3 = "∖", _3 = "∖", j3 = "✶", L3 = "𝔖", q3 = "𝔰", R3 = "⌢", F3 = "♯", B3 = "Щ", P3 = "щ", U3 = "Ш", V3 = "ш", $3 = "↓", Q3 = "←", Y3 = "∣", H3 = "∥", G3 = "→", W3 = "↑", J3 = "­", Z3 = "Σ", K3 = "σ", X3 = "ς", eq = "ς", tq = "∼", nq = "⩪", rq = "≃", oq = "≃", sq = "⪞", iq = "⪠", lq = "⪝", cq = "⪟", aq = "≆", uq = "⨤", fq = "⥲", hq = "←", dq = "∘", pq = "∖", mq = "⨳", gq = "⧤", yq = "∣", Mq = "⌣", kq = "⪪", xq = "⪬", bq = "⪬︀", Dq = "Ь", Nq = "ь", wq = "⌿", Cq = "⧄", Aq = "/", Sq = "𝕊", Tq = "𝕤", Eq = "♠", Iq = "♠", vq = "∥", Oq = "⊓", zq = "⊓︀", _q = "⊔", jq = "⊔︀", Lq = "√", qq = "⊏", Rq = "⊑", Fq = "⊏", Bq = "⊑", Pq = "⊐", Uq = "⊒", Vq = "⊐", $q = "⊒", Qq = "□", Yq = "□", Hq = "⊓", Gq = "⊏", Wq = "⊑", Jq = "⊐", Zq = "⊒", Kq = "⊔", Xq = "▪", eR = "□", tR = "▪", nR = "→", rR = "𝒮", oR = "𝓈", sR = "∖", iR = "⌣", lR = "⋆", cR = "⋆", aR = "☆", uR = "★", fR = "ϵ", hR = "ϕ", dR = "¯", pR = "⊂", mR = "⋐", gR = "⪽", yR = "⫅", MR = "⊆", kR = "⫃", xR = "⫁", bR = "⫋", DR = "⊊", NR = "⪿", wR = "⥹", CR = "⊂", AR = "⋐", SR = "⊆", TR = "⫅", ER = "⊆", IR = "⊊", vR = "⫋", OR = "⫇", zR = "⫕", _R = "⫓", jR = "⪸", LR = "≻", qR = "≽", RR = "≻", FR = "⪰", BR = "≽", PR = "≿", UR = "⪰", VR = "⪺", $R = "⪶", QR = "⋩", YR = "≿", HR = "∋", GR = "∑", WR = "∑", JR = "♪", ZR = "¹", KR = "²", XR = "³", eF = "⊃", tF = "⋑", nF = "⪾", rF = "⫘", oF = "⫆", sF = "⊇", iF = "⫄", lF = "⊃", cF = "⊇", aF = "⟉", uF = "⫗", fF = "⥻", hF = "⫂", dF = "⫌", pF = "⊋", mF = "⫀", gF = "⊃", yF = "⋑", MF = "⊇", kF = "⫆", xF = "⊋", bF = "⫌", DF = "⫈", NF = "⫔", wF = "⫖", CF = "⤦", AF = "↙", SF = "⇙", TF = "↙", EF = "⤪", IF = "ß", vF = "	", OF = "⌖", zF = "Τ", _F = "τ", jF = "⎴", LF = "Ť", qF = "ť", RF = "Ţ", FF = "ţ", BF = "Т", PF = "т", UF = "⃛", VF = "⌕", $F = "𝔗", QF = "𝔱", YF = "∴", HF = "∴", GF = "∴", WF = "Θ", JF = "θ", ZF = "ϑ", KF = "ϑ", XF = "≈", e5 = "∼", t5 = "  ", n5 = " ", r5 = " ", o5 = "≈", s5 = "∼", i5 = "Þ", l5 = "þ", c5 = "˜", a5 = "∼", u5 = "≃", f5 = "≅", h5 = "≈", d5 = "⨱", p5 = "⊠", m5 = "×", g5 = "⨰", y5 = "∭", M5 = "⤨", k5 = "⌶", x5 = "⫱", b5 = "⊤", D5 = "𝕋", N5 = "𝕥", w5 = "⫚", C5 = "⤩", A5 = "‴", S5 = "™", T5 = "™", E5 = "▵", I5 = "▿", v5 = "◃", O5 = "⊴", z5 = "≜", _5 = "▹", j5 = "⊵", L5 = "◬", q5 = "≜", R5 = "⨺", F5 = "⃛", B5 = "⨹", P5 = "⧍", U5 = "⨻", V5 = "⏢", $5 = "𝒯", Q5 = "𝓉", Y5 = "Ц", H5 = "ц", G5 = "Ћ", W5 = "ћ", J5 = "Ŧ", Z5 = "ŧ", K5 = "≬", X5 = "↞", eB = "↠", tB = "Ú", nB = "ú", rB = "↑", oB = "↟", sB = "⇑", iB = "⥉", lB = "Ў", cB = "ў", aB = "Ŭ", uB = "ŭ", fB = "Û", hB = "û", dB = "У", pB = "у", mB = "⇅", gB = "Ű", yB = "ű", MB = "⥮", kB = "⥾", xB = "𝔘", bB = "𝔲", DB = "Ù", NB = "ù", wB = "⥣", CB = "↿", AB = "↾", SB = "▀", TB = "⌜", EB = "⌜", IB = "⌏", vB = "◸", OB = "Ū", zB = "ū", _B = "¨", jB = "_", LB = "⏟", qB = "⎵", RB = "⏝", FB = "⋃", BB = "⊎", PB = "Ų", UB = "ų", VB = "𝕌", $B = "𝕦", QB = "⤒", YB = "↑", HB = "↑", GB = "⇑", WB = "⇅", JB = "↕", ZB = "↕", KB = "⇕", XB = "⥮", eP = "↿", tP = "↾", nP = "⊎", rP = "↖", oP = "↗", sP = "υ", iP = "ϒ", lP = "ϒ", cP = "Υ", aP = "υ", uP = "↥", fP = "⊥", hP = "⇈", dP = "⌝", pP = "⌝", mP = "⌎", gP = "Ů", yP = "ů", MP = "◹", kP = "𝒰", xP = "𝓊", bP = "⋰", DP = "Ũ", NP = "ũ", wP = "▵", CP = "▴", AP = "⇈", SP = "Ü", TP = "ü", EP = "⦧", IP = "⦜", vP = "ϵ", OP = "ϰ", zP = "∅", _P = "ϕ", jP = "ϖ", LP = "∝", qP = "↕", RP = "⇕", FP = "ϱ", BP = "ς", PP = "⊊︀", UP = "⫋︀", VP = "⊋︀", $P = "⫌︀", QP = "ϑ", YP = "⊲", HP = "⊳", GP = "⫨", WP = "⫫", JP = "⫩", ZP = "В", KP = "в", XP = "⊢", eU = "⊨", tU = "⊩", nU = "⊫", rU = "⫦", oU = "⊻", sU = "∨", iU = "⋁", lU = "≚", cU = "⋮", aU = "|", uU = "‖", fU = "|", hU = "‖", dU = "∣", pU = "|", mU = "❘", gU = "≀", yU = " ", MU = "𝔙", kU = "𝔳", xU = "⊲", bU = "⊂⃒", DU = "⊃⃒", NU = "𝕍", wU = "𝕧", CU = "∝", AU = "⊳", SU = "𝒱", TU = "𝓋", EU = "⫋︀", IU = "⊊︀", vU = "⫌︀", OU = "⊋︀", zU = "⊪", _U = "⦚", jU = "Ŵ", LU = "ŵ", qU = "⩟", RU = "∧", FU = "⋀", BU = "≙", PU = "℘", UU = "𝔚", VU = "𝔴", $U = "𝕎", QU = "𝕨", YU = "℘", HU = "≀", GU = "≀", WU = "𝒲", JU = "𝓌", ZU = "⋂", KU = "◯", XU = "⋃", eV = "▽", tV = "𝔛", nV = "𝔵", rV = "⟷", oV = "⟺", sV = "Ξ", iV = "ξ", lV = "⟵", cV = "⟸", aV = "⟼", uV = "⋻", fV = "⨀", hV = "𝕏", dV = "𝕩", pV = "⨁", mV = "⨂", gV = "⟶", yV = "⟹", MV = "𝒳", kV = "𝓍", xV = "⨆", bV = "⨄", DV = "△", NV = "⋁", wV = "⋀", CV = "Ý", AV = "ý", SV = "Я", TV = "я", EV = "Ŷ", IV = "ŷ", vV = "Ы", OV = "ы", zV = "¥", _V = "𝔜", jV = "𝔶", LV = "Ї", qV = "ї", RV = "𝕐", FV = "𝕪", BV = "𝒴", PV = "𝓎", UV = "Ю", VV = "ю", $V = "ÿ", QV = "Ÿ", YV = "Ź", HV = "ź", GV = "Ž", WV = "ž", JV = "З", ZV = "з", KV = "Ż", XV = "ż", e8 = "ℨ", t8 = "​", n8 = "Ζ", r8 = "ζ", o8 = "𝔷", s8 = "ℨ", i8 = "Ж", l8 = "ж", c8 = "⇝", a8 = "𝕫", u8 = "ℤ", f8 = "𝒵", h8 = "𝓏", d8 = "‍", p8 = "‌", m8 = {
  Aacute: Zu,
  aacute: Ku,
  Abreve: Xu,
  abreve: ef,
  ac: tf,
  acd: nf,
  acE: rf,
  Acirc: of,
  acirc: sf,
  acute: lf,
  Acy: cf,
  acy: af,
  AElig: uf,
  aelig: ff,
  af: hf,
  Afr: df,
  afr: pf,
  Agrave: mf,
  agrave: gf,
  alefsym: yf,
  aleph: Mf,
  Alpha: kf,
  alpha: xf,
  Amacr: bf,
  amacr: Df,
  amalg: Nf,
  amp: wf,
  AMP: Cf,
  andand: Af,
  And: Sf,
  and: Tf,
  andd: Ef,
  andslope: If,
  andv: vf,
  ang: Of,
  ange: zf,
  angle: _f,
  angmsdaa: jf,
  angmsdab: Lf,
  angmsdac: qf,
  angmsdad: Rf,
  angmsdae: Ff,
  angmsdaf: Bf,
  angmsdag: Pf,
  angmsdah: Uf,
  angmsd: Vf,
  angrt: $f,
  angrtvb: Qf,
  angrtvbd: Yf,
  angsph: Hf,
  angst: Gf,
  angzarr: Wf,
  Aogon: Jf,
  aogon: Zf,
  Aopf: Kf,
  aopf: Xf,
  apacir: eh,
  ap: th,
  apE: nh,
  ape: rh,
  apid: oh,
  apos: sh,
  ApplyFunction: ih,
  approx: lh,
  approxeq: ch,
  Aring: ah,
  aring: uh,
  Ascr: fh,
  ascr: hh,
  Assign: dh,
  ast: ph,
  asymp: mh,
  asympeq: gh,
  Atilde: yh,
  atilde: Mh,
  Auml: kh,
  auml: xh,
  awconint: bh,
  awint: Dh,
  backcong: Nh,
  backepsilon: wh,
  backprime: Ch,
  backsim: Ah,
  backsimeq: Sh,
  Backslash: Th,
  Barv: Eh,
  barvee: Ih,
  barwed: vh,
  Barwed: Oh,
  barwedge: zh,
  bbrk: _h,
  bbrktbrk: jh,
  bcong: Lh,
  Bcy: qh,
  bcy: Rh,
  bdquo: Fh,
  becaus: Bh,
  because: Ph,
  Because: Uh,
  bemptyv: Vh,
  bepsi: $h,
  bernou: Qh,
  Bernoullis: Yh,
  Beta: Hh,
  beta: Gh,
  beth: Wh,
  between: Jh,
  Bfr: Zh,
  bfr: Kh,
  bigcap: Xh,
  bigcirc: ed,
  bigcup: td,
  bigodot: nd,
  bigoplus: rd,
  bigotimes: od,
  bigsqcup: sd,
  bigstar: id,
  bigtriangledown: ld,
  bigtriangleup: cd,
  biguplus: ad,
  bigvee: ud,
  bigwedge: fd,
  bkarow: hd,
  blacklozenge: dd,
  blacksquare: pd,
  blacktriangle: md,
  blacktriangledown: gd,
  blacktriangleleft: yd,
  blacktriangleright: Md,
  blank: kd,
  blk12: xd,
  blk14: bd,
  blk34: Dd,
  block: Nd,
  bne: wd,
  bnequiv: Cd,
  bNot: Ad,
  bnot: Sd,
  Bopf: Td,
  bopf: Ed,
  bot: Id,
  bottom: vd,
  bowtie: Od,
  boxbox: zd,
  boxdl: _d,
  boxdL: jd,
  boxDl: Ld,
  boxDL: qd,
  boxdr: Rd,
  boxdR: Fd,
  boxDr: Bd,
  boxDR: Pd,
  boxh: Ud,
  boxH: Vd,
  boxhd: $d,
  boxHd: Qd,
  boxhD: Yd,
  boxHD: Hd,
  boxhu: Gd,
  boxHu: Wd,
  boxhU: Jd,
  boxHU: Zd,
  boxminus: Kd,
  boxplus: Xd,
  boxtimes: ep,
  boxul: tp,
  boxuL: np,
  boxUl: rp,
  boxUL: op,
  boxur: sp,
  boxuR: ip,
  boxUr: lp,
  boxUR: cp,
  boxv: ap,
  boxV: up,
  boxvh: fp,
  boxvH: hp,
  boxVh: dp,
  boxVH: pp,
  boxvl: mp,
  boxvL: gp,
  boxVl: yp,
  boxVL: Mp,
  boxvr: kp,
  boxvR: xp,
  boxVr: bp,
  boxVR: Dp,
  bprime: Np,
  breve: wp,
  Breve: Cp,
  brvbar: Ap,
  bscr: Sp,
  Bscr: Tp,
  bsemi: Ep,
  bsim: Ip,
  bsime: vp,
  bsolb: Op,
  bsol: zp,
  bsolhsub: _p,
  bull: jp,
  bullet: Lp,
  bump: qp,
  bumpE: Rp,
  bumpe: Fp,
  Bumpeq: Bp,
  bumpeq: Pp,
  Cacute: Up,
  cacute: Vp,
  capand: $p,
  capbrcup: Qp,
  capcap: Yp,
  cap: Hp,
  Cap: Gp,
  capcup: Wp,
  capdot: Jp,
  CapitalDifferentialD: Zp,
  caps: Kp,
  caret: Xp,
  caron: em,
  Cayleys: tm,
  ccaps: nm,
  Ccaron: rm,
  ccaron: om,
  Ccedil: sm,
  ccedil: im,
  Ccirc: lm,
  ccirc: cm,
  Cconint: am,
  ccups: um,
  ccupssm: fm,
  Cdot: hm,
  cdot: dm,
  cedil: pm,
  Cedilla: mm,
  cemptyv: gm,
  cent: ym,
  centerdot: Mm,
  CenterDot: km,
  cfr: xm,
  Cfr: bm,
  CHcy: Dm,
  chcy: Nm,
  check: wm,
  checkmark: Cm,
  Chi: Am,
  chi: Sm,
  circ: Tm,
  circeq: Em,
  circlearrowleft: Im,
  circlearrowright: vm,
  circledast: Om,
  circledcirc: zm,
  circleddash: _m,
  CircleDot: jm,
  circledR: Lm,
  circledS: qm,
  CircleMinus: Rm,
  CirclePlus: Fm,
  CircleTimes: Bm,
  cir: Pm,
  cirE: Um,
  cire: Vm,
  cirfnint: $m,
  cirmid: Qm,
  cirscir: Ym,
  ClockwiseContourIntegral: Hm,
  CloseCurlyDoubleQuote: Gm,
  CloseCurlyQuote: Wm,
  clubs: Jm,
  clubsuit: Zm,
  colon: Km,
  Colon: Xm,
  Colone: eg,
  colone: tg,
  coloneq: ng,
  comma: rg,
  commat: og,
  comp: sg,
  compfn: ig,
  complement: lg,
  complexes: cg,
  cong: ag,
  congdot: ug,
  Congruent: fg,
  conint: hg,
  Conint: dg,
  ContourIntegral: pg,
  copf: mg,
  Copf: gg,
  coprod: yg,
  Coproduct: Mg,
  copy: kg,
  COPY: xg,
  copysr: bg,
  CounterClockwiseContourIntegral: Dg,
  crarr: Ng,
  cross: wg,
  Cross: Cg,
  Cscr: Ag,
  cscr: Sg,
  csub: Tg,
  csube: Eg,
  csup: Ig,
  csupe: vg,
  ctdot: Og,
  cudarrl: zg,
  cudarrr: _g,
  cuepr: jg,
  cuesc: Lg,
  cularr: qg,
  cularrp: Rg,
  cupbrcap: Fg,
  cupcap: Bg,
  CupCap: Pg,
  cup: Ug,
  Cup: Vg,
  cupcup: $g,
  cupdot: Qg,
  cupor: Yg,
  cups: Hg,
  curarr: Gg,
  curarrm: Wg,
  curlyeqprec: Jg,
  curlyeqsucc: Zg,
  curlyvee: Kg,
  curlywedge: Xg,
  curren: e0,
  curvearrowleft: t0,
  curvearrowright: n0,
  cuvee: r0,
  cuwed: o0,
  cwconint: s0,
  cwint: i0,
  cylcty: l0,
  dagger: c0,
  Dagger: a0,
  daleth: u0,
  darr: f0,
  Darr: h0,
  dArr: d0,
  dash: p0,
  Dashv: m0,
  dashv: g0,
  dbkarow: y0,
  dblac: M0,
  Dcaron: k0,
  dcaron: x0,
  Dcy: b0,
  dcy: D0,
  ddagger: N0,
  ddarr: w0,
  DD: C0,
  dd: A0,
  DDotrahd: S0,
  ddotseq: T0,
  deg: E0,
  Del: I0,
  Delta: v0,
  delta: O0,
  demptyv: z0,
  dfisht: _0,
  Dfr: j0,
  dfr: L0,
  dHar: q0,
  dharl: R0,
  dharr: F0,
  DiacriticalAcute: B0,
  DiacriticalDot: P0,
  DiacriticalDoubleAcute: U0,
  DiacriticalGrave: V0,
  DiacriticalTilde: $0,
  diam: Q0,
  diamond: Y0,
  Diamond: H0,
  diamondsuit: G0,
  diams: W0,
  die: J0,
  DifferentialD: Z0,
  digamma: K0,
  disin: X0,
  div: ey,
  divide: ty,
  divideontimes: ny,
  divonx: ry,
  DJcy: oy,
  djcy: sy,
  dlcorn: iy,
  dlcrop: ly,
  dollar: cy,
  Dopf: ay,
  dopf: uy,
  Dot: fy,
  dot: hy,
  DotDot: dy,
  doteq: py,
  doteqdot: my,
  DotEqual: gy,
  dotminus: yy,
  dotplus: My,
  dotsquare: ky,
  doublebarwedge: xy,
  DoubleContourIntegral: by,
  DoubleDot: Dy,
  DoubleDownArrow: Ny,
  DoubleLeftArrow: wy,
  DoubleLeftRightArrow: Cy,
  DoubleLeftTee: Ay,
  DoubleLongLeftArrow: Sy,
  DoubleLongLeftRightArrow: Ty,
  DoubleLongRightArrow: Ey,
  DoubleRightArrow: Iy,
  DoubleRightTee: vy,
  DoubleUpArrow: Oy,
  DoubleUpDownArrow: zy,
  DoubleVerticalBar: _y,
  DownArrowBar: jy,
  downarrow: Ly,
  DownArrow: qy,
  Downarrow: Ry,
  DownArrowUpArrow: Fy,
  DownBreve: By,
  downdownarrows: Py,
  downharpoonleft: Uy,
  downharpoonright: Vy,
  DownLeftRightVector: $y,
  DownLeftTeeVector: Qy,
  DownLeftVectorBar: Yy,
  DownLeftVector: Hy,
  DownRightTeeVector: Gy,
  DownRightVectorBar: Wy,
  DownRightVector: Jy,
  DownTeeArrow: Zy,
  DownTee: Ky,
  drbkarow: Xy,
  drcorn: eM,
  drcrop: tM,
  Dscr: nM,
  dscr: rM,
  DScy: oM,
  dscy: sM,
  dsol: iM,
  Dstrok: lM,
  dstrok: cM,
  dtdot: aM,
  dtri: uM,
  dtrif: fM,
  duarr: hM,
  duhar: dM,
  dwangle: pM,
  DZcy: mM,
  dzcy: gM,
  dzigrarr: yM,
  Eacute: MM,
  eacute: kM,
  easter: xM,
  Ecaron: bM,
  ecaron: DM,
  Ecirc: NM,
  ecirc: wM,
  ecir: CM,
  ecolon: AM,
  Ecy: SM,
  ecy: TM,
  eDDot: EM,
  Edot: IM,
  edot: vM,
  eDot: OM,
  ee: zM,
  efDot: _M,
  Efr: jM,
  efr: LM,
  eg: qM,
  Egrave: RM,
  egrave: FM,
  egs: BM,
  egsdot: PM,
  el: UM,
  Element: VM,
  elinters: $M,
  ell: QM,
  els: YM,
  elsdot: HM,
  Emacr: GM,
  emacr: WM,
  empty: JM,
  emptyset: ZM,
  EmptySmallSquare: KM,
  emptyv: XM,
  EmptyVerySmallSquare: e1,
  emsp13: t1,
  emsp14: n1,
  emsp: r1,
  ENG: o1,
  eng: s1,
  ensp: i1,
  Eogon: l1,
  eogon: c1,
  Eopf: a1,
  eopf: u1,
  epar: f1,
  eparsl: h1,
  eplus: d1,
  epsi: p1,
  Epsilon: m1,
  epsilon: g1,
  epsiv: y1,
  eqcirc: M1,
  eqcolon: k1,
  eqsim: x1,
  eqslantgtr: b1,
  eqslantless: D1,
  Equal: N1,
  equals: w1,
  EqualTilde: C1,
  equest: A1,
  Equilibrium: S1,
  equiv: T1,
  equivDD: E1,
  eqvparsl: I1,
  erarr: v1,
  erDot: O1,
  escr: z1,
  Escr: _1,
  esdot: j1,
  Esim: L1,
  esim: q1,
  Eta: R1,
  eta: F1,
  ETH: B1,
  eth: P1,
  Euml: U1,
  euml: V1,
  euro: $1,
  excl: Q1,
  exist: Y1,
  Exists: H1,
  expectation: G1,
  exponentiale: W1,
  ExponentialE: J1,
  fallingdotseq: Z1,
  Fcy: K1,
  fcy: X1,
  female: ek,
  ffilig: tk,
  fflig: nk,
  ffllig: rk,
  Ffr: ok,
  ffr: sk,
  filig: ik,
  FilledSmallSquare: lk,
  FilledVerySmallSquare: ck,
  fjlig: ak,
  flat: uk,
  fllig: fk,
  fltns: hk,
  fnof: dk,
  Fopf: pk,
  fopf: mk,
  forall: gk,
  ForAll: yk,
  fork: Mk,
  forkv: kk,
  Fouriertrf: xk,
  fpartint: bk,
  frac12: Dk,
  frac13: Nk,
  frac14: wk,
  frac15: Ck,
  frac16: Ak,
  frac18: Sk,
  frac23: Tk,
  frac25: Ek,
  frac34: Ik,
  frac35: vk,
  frac38: Ok,
  frac45: zk,
  frac56: _k,
  frac58: jk,
  frac78: Lk,
  frasl: qk,
  frown: Rk,
  fscr: Fk,
  Fscr: Bk,
  gacute: Pk,
  Gamma: Uk,
  gamma: Vk,
  Gammad: $k,
  gammad: Qk,
  gap: Yk,
  Gbreve: Hk,
  gbreve: Gk,
  Gcedil: Wk,
  Gcirc: Jk,
  gcirc: Zk,
  Gcy: Kk,
  gcy: Xk,
  Gdot: ex,
  gdot: tx,
  ge: nx,
  gE: rx,
  gEl: ox,
  gel: sx,
  geq: ix,
  geqq: lx,
  geqslant: cx,
  gescc: ax,
  ges: ux,
  gesdot: fx,
  gesdoto: hx,
  gesdotol: dx,
  gesl: px,
  gesles: mx,
  Gfr: gx,
  gfr: yx,
  gg: Mx,
  Gg: kx,
  ggg: xx,
  gimel: bx,
  GJcy: Dx,
  gjcy: Nx,
  gla: wx,
  gl: Cx,
  glE: Ax,
  glj: Sx,
  gnap: Tx,
  gnapprox: Ex,
  gne: Ix,
  gnE: vx,
  gneq: Ox,
  gneqq: zx,
  gnsim: _x,
  Gopf: jx,
  gopf: Lx,
  grave: qx,
  GreaterEqual: Rx,
  GreaterEqualLess: Fx,
  GreaterFullEqual: Bx,
  GreaterGreater: Px,
  GreaterLess: Ux,
  GreaterSlantEqual: Vx,
  GreaterTilde: $x,
  Gscr: Qx,
  gscr: Yx,
  gsim: Hx,
  gsime: Gx,
  gsiml: Wx,
  gtcc: Jx,
  gtcir: Zx,
  gt: Kx,
  GT: Xx,
  Gt: eb,
  gtdot: tb,
  gtlPar: nb,
  gtquest: rb,
  gtrapprox: ob,
  gtrarr: sb,
  gtrdot: ib,
  gtreqless: lb,
  gtreqqless: cb,
  gtrless: ab,
  gtrsim: ub,
  gvertneqq: fb,
  gvnE: hb,
  Hacek: db,
  hairsp: pb,
  half: mb,
  hamilt: gb,
  HARDcy: yb,
  hardcy: Mb,
  harrcir: kb,
  harr: xb,
  hArr: bb,
  harrw: Db,
  Hat: Nb,
  hbar: wb,
  Hcirc: Cb,
  hcirc: Ab,
  hearts: Sb,
  heartsuit: Tb,
  hellip: Eb,
  hercon: Ib,
  hfr: vb,
  Hfr: Ob,
  HilbertSpace: zb,
  hksearow: _b,
  hkswarow: jb,
  hoarr: Lb,
  homtht: qb,
  hookleftarrow: Rb,
  hookrightarrow: Fb,
  hopf: Bb,
  Hopf: Pb,
  horbar: Ub,
  HorizontalLine: Vb,
  hscr: $b,
  Hscr: Qb,
  hslash: Yb,
  Hstrok: Hb,
  hstrok: Gb,
  HumpDownHump: Wb,
  HumpEqual: Jb,
  hybull: Zb,
  hyphen: Kb,
  Iacute: Xb,
  iacute: eD,
  ic: tD,
  Icirc: nD,
  icirc: rD,
  Icy: oD,
  icy: sD,
  Idot: iD,
  IEcy: lD,
  iecy: cD,
  iexcl: aD,
  iff: uD,
  ifr: fD,
  Ifr: hD,
  Igrave: dD,
  igrave: pD,
  ii: mD,
  iiiint: gD,
  iiint: yD,
  iinfin: MD,
  iiota: kD,
  IJlig: xD,
  ijlig: bD,
  Imacr: DD,
  imacr: ND,
  image: wD,
  ImaginaryI: CD,
  imagline: AD,
  imagpart: SD,
  imath: TD,
  Im: ED,
  imof: ID,
  imped: vD,
  Implies: OD,
  incare: zD,
  in: "∈",
  infin: _D,
  infintie: jD,
  inodot: LD,
  intcal: qD,
  int: RD,
  Int: FD,
  integers: BD,
  Integral: PD,
  intercal: UD,
  Intersection: VD,
  intlarhk: $D,
  intprod: QD,
  InvisibleComma: YD,
  InvisibleTimes: HD,
  IOcy: GD,
  iocy: WD,
  Iogon: JD,
  iogon: ZD,
  Iopf: KD,
  iopf: XD,
  Iota: eN,
  iota: tN,
  iprod: nN,
  iquest: rN,
  iscr: oN,
  Iscr: sN,
  isin: iN,
  isindot: lN,
  isinE: cN,
  isins: aN,
  isinsv: uN,
  isinv: fN,
  it: hN,
  Itilde: dN,
  itilde: pN,
  Iukcy: mN,
  iukcy: gN,
  Iuml: yN,
  iuml: MN,
  Jcirc: kN,
  jcirc: xN,
  Jcy: bN,
  jcy: DN,
  Jfr: NN,
  jfr: wN,
  jmath: CN,
  Jopf: AN,
  jopf: SN,
  Jscr: TN,
  jscr: EN,
  Jsercy: IN,
  jsercy: vN,
  Jukcy: ON,
  jukcy: zN,
  Kappa: _N,
  kappa: jN,
  kappav: LN,
  Kcedil: qN,
  kcedil: RN,
  Kcy: FN,
  kcy: BN,
  Kfr: PN,
  kfr: UN,
  kgreen: VN,
  KHcy: $N,
  khcy: QN,
  KJcy: YN,
  kjcy: HN,
  Kopf: GN,
  kopf: WN,
  Kscr: JN,
  kscr: ZN,
  lAarr: KN,
  Lacute: XN,
  lacute: ew,
  laemptyv: tw,
  lagran: nw,
  Lambda: rw,
  lambda: ow,
  lang: sw,
  Lang: iw,
  langd: lw,
  langle: cw,
  lap: aw,
  Laplacetrf: uw,
  laquo: fw,
  larrb: hw,
  larrbfs: dw,
  larr: pw,
  Larr: mw,
  lArr: gw,
  larrfs: yw,
  larrhk: Mw,
  larrlp: kw,
  larrpl: xw,
  larrsim: bw,
  larrtl: Dw,
  latail: Nw,
  lAtail: ww,
  lat: Cw,
  late: Aw,
  lates: Sw,
  lbarr: Tw,
  lBarr: Ew,
  lbbrk: Iw,
  lbrace: vw,
  lbrack: Ow,
  lbrke: zw,
  lbrksld: _w,
  lbrkslu: jw,
  Lcaron: Lw,
  lcaron: qw,
  Lcedil: Rw,
  lcedil: Fw,
  lceil: Bw,
  lcub: Pw,
  Lcy: Uw,
  lcy: Vw,
  ldca: $w,
  ldquo: Qw,
  ldquor: Yw,
  ldrdhar: Hw,
  ldrushar: Gw,
  ldsh: Ww,
  le: Jw,
  lE: Zw,
  LeftAngleBracket: Kw,
  LeftArrowBar: Xw,
  leftarrow: eC,
  LeftArrow: tC,
  Leftarrow: nC,
  LeftArrowRightArrow: rC,
  leftarrowtail: oC,
  LeftCeiling: sC,
  LeftDoubleBracket: iC,
  LeftDownTeeVector: lC,
  LeftDownVectorBar: cC,
  LeftDownVector: aC,
  LeftFloor: uC,
  leftharpoondown: fC,
  leftharpoonup: hC,
  leftleftarrows: dC,
  leftrightarrow: pC,
  LeftRightArrow: mC,
  Leftrightarrow: gC,
  leftrightarrows: yC,
  leftrightharpoons: MC,
  leftrightsquigarrow: kC,
  LeftRightVector: xC,
  LeftTeeArrow: bC,
  LeftTee: DC,
  LeftTeeVector: NC,
  leftthreetimes: wC,
  LeftTriangleBar: CC,
  LeftTriangle: AC,
  LeftTriangleEqual: SC,
  LeftUpDownVector: TC,
  LeftUpTeeVector: EC,
  LeftUpVectorBar: IC,
  LeftUpVector: vC,
  LeftVectorBar: OC,
  LeftVector: zC,
  lEg: _C,
  leg: jC,
  leq: LC,
  leqq: qC,
  leqslant: RC,
  lescc: FC,
  les: BC,
  lesdot: PC,
  lesdoto: UC,
  lesdotor: VC,
  lesg: $C,
  lesges: QC,
  lessapprox: YC,
  lessdot: HC,
  lesseqgtr: GC,
  lesseqqgtr: WC,
  LessEqualGreater: JC,
  LessFullEqual: ZC,
  LessGreater: KC,
  lessgtr: XC,
  LessLess: eA,
  lesssim: tA,
  LessSlantEqual: nA,
  LessTilde: rA,
  lfisht: oA,
  lfloor: sA,
  Lfr: iA,
  lfr: lA,
  lg: cA,
  lgE: aA,
  lHar: uA,
  lhard: fA,
  lharu: hA,
  lharul: dA,
  lhblk: pA,
  LJcy: mA,
  ljcy: gA,
  llarr: yA,
  ll: MA,
  Ll: kA,
  llcorner: xA,
  Lleftarrow: bA,
  llhard: DA,
  lltri: NA,
  Lmidot: wA,
  lmidot: CA,
  lmoustache: AA,
  lmoust: SA,
  lnap: TA,
  lnapprox: EA,
  lne: IA,
  lnE: vA,
  lneq: OA,
  lneqq: zA,
  lnsim: _A,
  loang: jA,
  loarr: LA,
  lobrk: qA,
  longleftarrow: RA,
  LongLeftArrow: FA,
  Longleftarrow: BA,
  longleftrightarrow: PA,
  LongLeftRightArrow: UA,
  Longleftrightarrow: VA,
  longmapsto: $A,
  longrightarrow: QA,
  LongRightArrow: YA,
  Longrightarrow: HA,
  looparrowleft: GA,
  looparrowright: WA,
  lopar: JA,
  Lopf: ZA,
  lopf: KA,
  loplus: XA,
  lotimes: eS,
  lowast: tS,
  lowbar: nS,
  LowerLeftArrow: rS,
  LowerRightArrow: oS,
  loz: sS,
  lozenge: iS,
  lozf: lS,
  lpar: cS,
  lparlt: aS,
  lrarr: uS,
  lrcorner: fS,
  lrhar: hS,
  lrhard: dS,
  lrm: pS,
  lrtri: mS,
  lsaquo: gS,
  lscr: yS,
  Lscr: MS,
  lsh: kS,
  Lsh: xS,
  lsim: bS,
  lsime: DS,
  lsimg: NS,
  lsqb: wS,
  lsquo: CS,
  lsquor: AS,
  Lstrok: SS,
  lstrok: TS,
  ltcc: ES,
  ltcir: IS,
  lt: vS,
  LT: OS,
  Lt: zS,
  ltdot: _S,
  lthree: jS,
  ltimes: LS,
  ltlarr: qS,
  ltquest: RS,
  ltri: FS,
  ltrie: BS,
  ltrif: PS,
  ltrPar: US,
  lurdshar: VS,
  luruhar: $S,
  lvertneqq: QS,
  lvnE: YS,
  macr: HS,
  male: GS,
  malt: WS,
  maltese: JS,
  Map: "⤅",
  map: ZS,
  mapsto: KS,
  mapstodown: XS,
  mapstoleft: eT,
  mapstoup: tT,
  marker: nT,
  mcomma: rT,
  Mcy: oT,
  mcy: sT,
  mdash: iT,
  mDDot: lT,
  measuredangle: cT,
  MediumSpace: aT,
  Mellintrf: uT,
  Mfr: fT,
  mfr: hT,
  mho: dT,
  micro: pT,
  midast: mT,
  midcir: gT,
  mid: yT,
  middot: MT,
  minusb: kT,
  minus: xT,
  minusd: bT,
  minusdu: DT,
  MinusPlus: NT,
  mlcp: wT,
  mldr: CT,
  mnplus: AT,
  models: ST,
  Mopf: TT,
  mopf: ET,
  mp: IT,
  mscr: vT,
  Mscr: OT,
  mstpos: zT,
  Mu: _T,
  mu: jT,
  multimap: LT,
  mumap: qT,
  nabla: RT,
  Nacute: FT,
  nacute: BT,
  nang: PT,
  nap: UT,
  napE: VT,
  napid: $T,
  napos: QT,
  napprox: YT,
  natural: HT,
  naturals: GT,
  natur: WT,
  nbsp: JT,
  nbump: ZT,
  nbumpe: KT,
  ncap: XT,
  Ncaron: eE,
  ncaron: tE,
  Ncedil: nE,
  ncedil: rE,
  ncong: oE,
  ncongdot: sE,
  ncup: iE,
  Ncy: lE,
  ncy: cE,
  ndash: aE,
  nearhk: uE,
  nearr: fE,
  neArr: hE,
  nearrow: dE,
  ne: pE,
  nedot: mE,
  NegativeMediumSpace: gE,
  NegativeThickSpace: yE,
  NegativeThinSpace: ME,
  NegativeVeryThinSpace: kE,
  nequiv: xE,
  nesear: bE,
  nesim: DE,
  NestedGreaterGreater: NE,
  NestedLessLess: wE,
  NewLine: CE,
  nexist: AE,
  nexists: SE,
  Nfr: TE,
  nfr: EE,
  ngE: IE,
  nge: vE,
  ngeq: OE,
  ngeqq: zE,
  ngeqslant: _E,
  nges: jE,
  nGg: LE,
  ngsim: qE,
  nGt: RE,
  ngt: FE,
  ngtr: BE,
  nGtv: PE,
  nharr: UE,
  nhArr: VE,
  nhpar: $E,
  ni: QE,
  nis: YE,
  nisd: HE,
  niv: GE,
  NJcy: WE,
  njcy: JE,
  nlarr: ZE,
  nlArr: KE,
  nldr: XE,
  nlE: eI,
  nle: tI,
  nleftarrow: nI,
  nLeftarrow: rI,
  nleftrightarrow: oI,
  nLeftrightarrow: sI,
  nleq: iI,
  nleqq: lI,
  nleqslant: cI,
  nles: aI,
  nless: uI,
  nLl: fI,
  nlsim: hI,
  nLt: dI,
  nlt: pI,
  nltri: mI,
  nltrie: gI,
  nLtv: yI,
  nmid: MI,
  NoBreak: kI,
  NonBreakingSpace: xI,
  nopf: bI,
  Nopf: DI,
  Not: NI,
  not: wI,
  NotCongruent: CI,
  NotCupCap: AI,
  NotDoubleVerticalBar: SI,
  NotElement: TI,
  NotEqual: EI,
  NotEqualTilde: II,
  NotExists: vI,
  NotGreater: OI,
  NotGreaterEqual: zI,
  NotGreaterFullEqual: _I,
  NotGreaterGreater: jI,
  NotGreaterLess: LI,
  NotGreaterSlantEqual: qI,
  NotGreaterTilde: RI,
  NotHumpDownHump: FI,
  NotHumpEqual: BI,
  notin: PI,
  notindot: UI,
  notinE: VI,
  notinva: $I,
  notinvb: QI,
  notinvc: YI,
  NotLeftTriangleBar: HI,
  NotLeftTriangle: GI,
  NotLeftTriangleEqual: WI,
  NotLess: JI,
  NotLessEqual: ZI,
  NotLessGreater: KI,
  NotLessLess: XI,
  NotLessSlantEqual: ev,
  NotLessTilde: tv,
  NotNestedGreaterGreater: nv,
  NotNestedLessLess: rv,
  notni: ov,
  notniva: sv,
  notnivb: iv,
  notnivc: lv,
  NotPrecedes: cv,
  NotPrecedesEqual: av,
  NotPrecedesSlantEqual: uv,
  NotReverseElement: fv,
  NotRightTriangleBar: hv,
  NotRightTriangle: dv,
  NotRightTriangleEqual: pv,
  NotSquareSubset: mv,
  NotSquareSubsetEqual: gv,
  NotSquareSuperset: yv,
  NotSquareSupersetEqual: Mv,
  NotSubset: kv,
  NotSubsetEqual: xv,
  NotSucceeds: bv,
  NotSucceedsEqual: Dv,
  NotSucceedsSlantEqual: Nv,
  NotSucceedsTilde: wv,
  NotSuperset: Cv,
  NotSupersetEqual: Av,
  NotTilde: Sv,
  NotTildeEqual: Tv,
  NotTildeFullEqual: Ev,
  NotTildeTilde: Iv,
  NotVerticalBar: vv,
  nparallel: Ov,
  npar: zv,
  nparsl: _v,
  npart: jv,
  npolint: Lv,
  npr: qv,
  nprcue: Rv,
  nprec: Fv,
  npreceq: Bv,
  npre: Pv,
  nrarrc: Uv,
  nrarr: Vv,
  nrArr: $v,
  nrarrw: Qv,
  nrightarrow: Yv,
  nRightarrow: Hv,
  nrtri: Gv,
  nrtrie: Wv,
  nsc: Jv,
  nsccue: Zv,
  nsce: Kv,
  Nscr: Xv,
  nscr: eO,
  nshortmid: tO,
  nshortparallel: nO,
  nsim: rO,
  nsime: oO,
  nsimeq: sO,
  nsmid: iO,
  nspar: lO,
  nsqsube: cO,
  nsqsupe: aO,
  nsub: uO,
  nsubE: fO,
  nsube: hO,
  nsubset: dO,
  nsubseteq: pO,
  nsubseteqq: mO,
  nsucc: gO,
  nsucceq: yO,
  nsup: MO,
  nsupE: kO,
  nsupe: xO,
  nsupset: bO,
  nsupseteq: DO,
  nsupseteqq: NO,
  ntgl: wO,
  Ntilde: CO,
  ntilde: AO,
  ntlg: SO,
  ntriangleleft: TO,
  ntrianglelefteq: EO,
  ntriangleright: IO,
  ntrianglerighteq: vO,
  Nu: OO,
  nu: zO,
  num: _O,
  numero: jO,
  numsp: LO,
  nvap: qO,
  nvdash: RO,
  nvDash: FO,
  nVdash: BO,
  nVDash: PO,
  nvge: UO,
  nvgt: VO,
  nvHarr: $O,
  nvinfin: QO,
  nvlArr: YO,
  nvle: HO,
  nvlt: GO,
  nvltrie: WO,
  nvrArr: JO,
  nvrtrie: ZO,
  nvsim: KO,
  nwarhk: XO,
  nwarr: ez,
  nwArr: tz,
  nwarrow: nz,
  nwnear: rz,
  Oacute: oz,
  oacute: sz,
  oast: iz,
  Ocirc: lz,
  ocirc: cz,
  ocir: az,
  Ocy: uz,
  ocy: fz,
  odash: hz,
  Odblac: dz,
  odblac: pz,
  odiv: mz,
  odot: gz,
  odsold: yz,
  OElig: Mz,
  oelig: kz,
  ofcir: xz,
  Ofr: bz,
  ofr: Dz,
  ogon: Nz,
  Ograve: wz,
  ograve: Cz,
  ogt: Az,
  ohbar: Sz,
  ohm: Tz,
  oint: Ez,
  olarr: Iz,
  olcir: vz,
  olcross: Oz,
  oline: zz,
  olt: _z,
  Omacr: jz,
  omacr: Lz,
  Omega: qz,
  omega: Rz,
  Omicron: Fz,
  omicron: Bz,
  omid: Pz,
  ominus: Uz,
  Oopf: Vz,
  oopf: $z,
  opar: Qz,
  OpenCurlyDoubleQuote: Yz,
  OpenCurlyQuote: Hz,
  operp: Gz,
  oplus: Wz,
  orarr: Jz,
  Or: Zz,
  or: Kz,
  ord: Xz,
  order: e_,
  orderof: t_,
  ordf: n_,
  ordm: r_,
  origof: o_,
  oror: s_,
  orslope: i_,
  orv: l_,
  oS: c_,
  Oscr: a_,
  oscr: u_,
  Oslash: f_,
  oslash: h_,
  osol: d_,
  Otilde: p_,
  otilde: m_,
  otimesas: g_,
  Otimes: y_,
  otimes: M_,
  Ouml: k_,
  ouml: x_,
  ovbar: b_,
  OverBar: D_,
  OverBrace: N_,
  OverBracket: w_,
  OverParenthesis: C_,
  para: A_,
  parallel: S_,
  par: T_,
  parsim: E_,
  parsl: I_,
  part: v_,
  PartialD: O_,
  Pcy: z_,
  pcy: __,
  percnt: j_,
  period: L_,
  permil: q_,
  perp: R_,
  pertenk: F_,
  Pfr: B_,
  pfr: P_,
  Phi: U_,
  phi: V_,
  phiv: $_,
  phmmat: Q_,
  phone: Y_,
  Pi: H_,
  pi: G_,
  pitchfork: W_,
  piv: J_,
  planck: Z_,
  planckh: K_,
  plankv: X_,
  plusacir: e2,
  plusb: t2,
  pluscir: n2,
  plus: r2,
  plusdo: o2,
  plusdu: s2,
  pluse: i2,
  PlusMinus: l2,
  plusmn: c2,
  plussim: a2,
  plustwo: u2,
  pm: f2,
  Poincareplane: h2,
  pointint: d2,
  popf: p2,
  Popf: m2,
  pound: g2,
  prap: y2,
  Pr: M2,
  pr: k2,
  prcue: x2,
  precapprox: b2,
  prec: D2,
  preccurlyeq: N2,
  Precedes: w2,
  PrecedesEqual: C2,
  PrecedesSlantEqual: A2,
  PrecedesTilde: S2,
  preceq: T2,
  precnapprox: E2,
  precneqq: I2,
  precnsim: v2,
  pre: O2,
  prE: z2,
  precsim: _2,
  prime: j2,
  Prime: L2,
  primes: q2,
  prnap: R2,
  prnE: F2,
  prnsim: B2,
  prod: P2,
  Product: U2,
  profalar: V2,
  profline: $2,
  profsurf: Q2,
  prop: Y2,
  Proportional: H2,
  Proportion: G2,
  propto: W2,
  prsim: J2,
  prurel: Z2,
  Pscr: K2,
  pscr: X2,
  Psi: ej,
  psi: tj,
  puncsp: nj,
  Qfr: rj,
  qfr: oj,
  qint: sj,
  qopf: ij,
  Qopf: lj,
  qprime: cj,
  Qscr: aj,
  qscr: uj,
  quaternions: fj,
  quatint: hj,
  quest: dj,
  questeq: pj,
  quot: mj,
  QUOT: gj,
  rAarr: yj,
  race: Mj,
  Racute: kj,
  racute: xj,
  radic: bj,
  raemptyv: Dj,
  rang: Nj,
  Rang: wj,
  rangd: Cj,
  range: Aj,
  rangle: Sj,
  raquo: Tj,
  rarrap: Ej,
  rarrb: Ij,
  rarrbfs: vj,
  rarrc: Oj,
  rarr: zj,
  Rarr: _j,
  rArr: jj,
  rarrfs: Lj,
  rarrhk: qj,
  rarrlp: Rj,
  rarrpl: Fj,
  rarrsim: Bj,
  Rarrtl: Pj,
  rarrtl: Uj,
  rarrw: Vj,
  ratail: $j,
  rAtail: Qj,
  ratio: Yj,
  rationals: Hj,
  rbarr: Gj,
  rBarr: Wj,
  RBarr: Jj,
  rbbrk: Zj,
  rbrace: Kj,
  rbrack: Xj,
  rbrke: eL,
  rbrksld: tL,
  rbrkslu: nL,
  Rcaron: rL,
  rcaron: oL,
  Rcedil: sL,
  rcedil: iL,
  rceil: lL,
  rcub: cL,
  Rcy: aL,
  rcy: uL,
  rdca: fL,
  rdldhar: hL,
  rdquo: dL,
  rdquor: pL,
  rdsh: mL,
  real: gL,
  realine: yL,
  realpart: ML,
  reals: kL,
  Re: xL,
  rect: bL,
  reg: DL,
  REG: NL,
  ReverseElement: wL,
  ReverseEquilibrium: CL,
  ReverseUpEquilibrium: AL,
  rfisht: SL,
  rfloor: TL,
  rfr: EL,
  Rfr: IL,
  rHar: vL,
  rhard: OL,
  rharu: zL,
  rharul: _L,
  Rho: jL,
  rho: LL,
  rhov: qL,
  RightAngleBracket: RL,
  RightArrowBar: FL,
  rightarrow: BL,
  RightArrow: PL,
  Rightarrow: UL,
  RightArrowLeftArrow: VL,
  rightarrowtail: $L,
  RightCeiling: QL,
  RightDoubleBracket: YL,
  RightDownTeeVector: HL,
  RightDownVectorBar: GL,
  RightDownVector: WL,
  RightFloor: JL,
  rightharpoondown: ZL,
  rightharpoonup: KL,
  rightleftarrows: XL,
  rightleftharpoons: e4,
  rightrightarrows: t4,
  rightsquigarrow: n4,
  RightTeeArrow: r4,
  RightTee: o4,
  RightTeeVector: s4,
  rightthreetimes: i4,
  RightTriangleBar: l4,
  RightTriangle: c4,
  RightTriangleEqual: a4,
  RightUpDownVector: u4,
  RightUpTeeVector: f4,
  RightUpVectorBar: h4,
  RightUpVector: d4,
  RightVectorBar: p4,
  RightVector: m4,
  ring: g4,
  risingdotseq: y4,
  rlarr: M4,
  rlhar: k4,
  rlm: x4,
  rmoustache: b4,
  rmoust: D4,
  rnmid: N4,
  roang: w4,
  roarr: C4,
  robrk: A4,
  ropar: S4,
  ropf: T4,
  Ropf: E4,
  roplus: I4,
  rotimes: v4,
  RoundImplies: O4,
  rpar: z4,
  rpargt: _4,
  rppolint: j4,
  rrarr: L4,
  Rrightarrow: q4,
  rsaquo: R4,
  rscr: F4,
  Rscr: B4,
  rsh: P4,
  Rsh: U4,
  rsqb: V4,
  rsquo: $4,
  rsquor: Q4,
  rthree: Y4,
  rtimes: H4,
  rtri: G4,
  rtrie: W4,
  rtrif: J4,
  rtriltri: Z4,
  RuleDelayed: K4,
  ruluhar: X4,
  rx: e3,
  Sacute: t3,
  sacute: n3,
  sbquo: r3,
  scap: o3,
  Scaron: s3,
  scaron: i3,
  Sc: l3,
  sc: c3,
  sccue: a3,
  sce: u3,
  scE: f3,
  Scedil: h3,
  scedil: d3,
  Scirc: p3,
  scirc: m3,
  scnap: g3,
  scnE: y3,
  scnsim: M3,
  scpolint: k3,
  scsim: x3,
  Scy: b3,
  scy: D3,
  sdotb: N3,
  sdot: w3,
  sdote: C3,
  searhk: A3,
  searr: S3,
  seArr: T3,
  searrow: E3,
  sect: I3,
  semi: v3,
  seswar: O3,
  setminus: z3,
  setmn: _3,
  sext: j3,
  Sfr: L3,
  sfr: q3,
  sfrown: R3,
  sharp: F3,
  SHCHcy: B3,
  shchcy: P3,
  SHcy: U3,
  shcy: V3,
  ShortDownArrow: $3,
  ShortLeftArrow: Q3,
  shortmid: Y3,
  shortparallel: H3,
  ShortRightArrow: G3,
  ShortUpArrow: W3,
  shy: J3,
  Sigma: Z3,
  sigma: K3,
  sigmaf: X3,
  sigmav: eq,
  sim: tq,
  simdot: nq,
  sime: rq,
  simeq: oq,
  simg: sq,
  simgE: iq,
  siml: lq,
  simlE: cq,
  simne: aq,
  simplus: uq,
  simrarr: fq,
  slarr: hq,
  SmallCircle: dq,
  smallsetminus: pq,
  smashp: mq,
  smeparsl: gq,
  smid: yq,
  smile: Mq,
  smt: kq,
  smte: xq,
  smtes: bq,
  SOFTcy: Dq,
  softcy: Nq,
  solbar: wq,
  solb: Cq,
  sol: Aq,
  Sopf: Sq,
  sopf: Tq,
  spades: Eq,
  spadesuit: Iq,
  spar: vq,
  sqcap: Oq,
  sqcaps: zq,
  sqcup: _q,
  sqcups: jq,
  Sqrt: Lq,
  sqsub: qq,
  sqsube: Rq,
  sqsubset: Fq,
  sqsubseteq: Bq,
  sqsup: Pq,
  sqsupe: Uq,
  sqsupset: Vq,
  sqsupseteq: $q,
  square: Qq,
  Square: Yq,
  SquareIntersection: Hq,
  SquareSubset: Gq,
  SquareSubsetEqual: Wq,
  SquareSuperset: Jq,
  SquareSupersetEqual: Zq,
  SquareUnion: Kq,
  squarf: Xq,
  squ: eR,
  squf: tR,
  srarr: nR,
  Sscr: rR,
  sscr: oR,
  ssetmn: sR,
  ssmile: iR,
  sstarf: lR,
  Star: cR,
  star: aR,
  starf: uR,
  straightepsilon: fR,
  straightphi: hR,
  strns: dR,
  sub: pR,
  Sub: mR,
  subdot: gR,
  subE: yR,
  sube: MR,
  subedot: kR,
  submult: xR,
  subnE: bR,
  subne: DR,
  subplus: NR,
  subrarr: wR,
  subset: CR,
  Subset: AR,
  subseteq: SR,
  subseteqq: TR,
  SubsetEqual: ER,
  subsetneq: IR,
  subsetneqq: vR,
  subsim: OR,
  subsub: zR,
  subsup: _R,
  succapprox: jR,
  succ: LR,
  succcurlyeq: qR,
  Succeeds: RR,
  SucceedsEqual: FR,
  SucceedsSlantEqual: BR,
  SucceedsTilde: PR,
  succeq: UR,
  succnapprox: VR,
  succneqq: $R,
  succnsim: QR,
  succsim: YR,
  SuchThat: HR,
  sum: GR,
  Sum: WR,
  sung: JR,
  sup1: ZR,
  sup2: KR,
  sup3: XR,
  sup: eF,
  Sup: tF,
  supdot: nF,
  supdsub: rF,
  supE: oF,
  supe: sF,
  supedot: iF,
  Superset: lF,
  SupersetEqual: cF,
  suphsol: aF,
  suphsub: uF,
  suplarr: fF,
  supmult: hF,
  supnE: dF,
  supne: pF,
  supplus: mF,
  supset: gF,
  Supset: yF,
  supseteq: MF,
  supseteqq: kF,
  supsetneq: xF,
  supsetneqq: bF,
  supsim: DF,
  supsub: NF,
  supsup: wF,
  swarhk: CF,
  swarr: AF,
  swArr: SF,
  swarrow: TF,
  swnwar: EF,
  szlig: IF,
  Tab: vF,
  target: OF,
  Tau: zF,
  tau: _F,
  tbrk: jF,
  Tcaron: LF,
  tcaron: qF,
  Tcedil: RF,
  tcedil: FF,
  Tcy: BF,
  tcy: PF,
  tdot: UF,
  telrec: VF,
  Tfr: $F,
  tfr: QF,
  there4: YF,
  therefore: HF,
  Therefore: GF,
  Theta: WF,
  theta: JF,
  thetasym: ZF,
  thetav: KF,
  thickapprox: XF,
  thicksim: e5,
  ThickSpace: t5,
  ThinSpace: n5,
  thinsp: r5,
  thkap: o5,
  thksim: s5,
  THORN: i5,
  thorn: l5,
  tilde: c5,
  Tilde: a5,
  TildeEqual: u5,
  TildeFullEqual: f5,
  TildeTilde: h5,
  timesbar: d5,
  timesb: p5,
  times: m5,
  timesd: g5,
  tint: y5,
  toea: M5,
  topbot: k5,
  topcir: x5,
  top: b5,
  Topf: D5,
  topf: N5,
  topfork: w5,
  tosa: C5,
  tprime: A5,
  trade: S5,
  TRADE: T5,
  triangle: E5,
  triangledown: I5,
  triangleleft: v5,
  trianglelefteq: O5,
  triangleq: z5,
  triangleright: _5,
  trianglerighteq: j5,
  tridot: L5,
  trie: q5,
  triminus: R5,
  TripleDot: F5,
  triplus: B5,
  trisb: P5,
  tritime: U5,
  trpezium: V5,
  Tscr: $5,
  tscr: Q5,
  TScy: Y5,
  tscy: H5,
  TSHcy: G5,
  tshcy: W5,
  Tstrok: J5,
  tstrok: Z5,
  twixt: K5,
  twoheadleftarrow: X5,
  twoheadrightarrow: eB,
  Uacute: tB,
  uacute: nB,
  uarr: rB,
  Uarr: oB,
  uArr: sB,
  Uarrocir: iB,
  Ubrcy: lB,
  ubrcy: cB,
  Ubreve: aB,
  ubreve: uB,
  Ucirc: fB,
  ucirc: hB,
  Ucy: dB,
  ucy: pB,
  udarr: mB,
  Udblac: gB,
  udblac: yB,
  udhar: MB,
  ufisht: kB,
  Ufr: xB,
  ufr: bB,
  Ugrave: DB,
  ugrave: NB,
  uHar: wB,
  uharl: CB,
  uharr: AB,
  uhblk: SB,
  ulcorn: TB,
  ulcorner: EB,
  ulcrop: IB,
  ultri: vB,
  Umacr: OB,
  umacr: zB,
  uml: _B,
  UnderBar: jB,
  UnderBrace: LB,
  UnderBracket: qB,
  UnderParenthesis: RB,
  Union: FB,
  UnionPlus: BB,
  Uogon: PB,
  uogon: UB,
  Uopf: VB,
  uopf: $B,
  UpArrowBar: QB,
  uparrow: YB,
  UpArrow: HB,
  Uparrow: GB,
  UpArrowDownArrow: WB,
  updownarrow: JB,
  UpDownArrow: ZB,
  Updownarrow: KB,
  UpEquilibrium: XB,
  upharpoonleft: eP,
  upharpoonright: tP,
  uplus: nP,
  UpperLeftArrow: rP,
  UpperRightArrow: oP,
  upsi: sP,
  Upsi: iP,
  upsih: lP,
  Upsilon: cP,
  upsilon: aP,
  UpTeeArrow: uP,
  UpTee: fP,
  upuparrows: hP,
  urcorn: dP,
  urcorner: pP,
  urcrop: mP,
  Uring: gP,
  uring: yP,
  urtri: MP,
  Uscr: kP,
  uscr: xP,
  utdot: bP,
  Utilde: DP,
  utilde: NP,
  utri: wP,
  utrif: CP,
  uuarr: AP,
  Uuml: SP,
  uuml: TP,
  uwangle: EP,
  vangrt: IP,
  varepsilon: vP,
  varkappa: OP,
  varnothing: zP,
  varphi: _P,
  varpi: jP,
  varpropto: LP,
  varr: qP,
  vArr: RP,
  varrho: FP,
  varsigma: BP,
  varsubsetneq: PP,
  varsubsetneqq: UP,
  varsupsetneq: VP,
  varsupsetneqq: $P,
  vartheta: QP,
  vartriangleleft: YP,
  vartriangleright: HP,
  vBar: GP,
  Vbar: WP,
  vBarv: JP,
  Vcy: ZP,
  vcy: KP,
  vdash: XP,
  vDash: eU,
  Vdash: tU,
  VDash: nU,
  Vdashl: rU,
  veebar: oU,
  vee: sU,
  Vee: iU,
  veeeq: lU,
  vellip: cU,
  verbar: aU,
  Verbar: uU,
  vert: fU,
  Vert: hU,
  VerticalBar: dU,
  VerticalLine: pU,
  VerticalSeparator: mU,
  VerticalTilde: gU,
  VeryThinSpace: yU,
  Vfr: MU,
  vfr: kU,
  vltri: xU,
  vnsub: bU,
  vnsup: DU,
  Vopf: NU,
  vopf: wU,
  vprop: CU,
  vrtri: AU,
  Vscr: SU,
  vscr: TU,
  vsubnE: EU,
  vsubne: IU,
  vsupnE: vU,
  vsupne: OU,
  Vvdash: zU,
  vzigzag: _U,
  Wcirc: jU,
  wcirc: LU,
  wedbar: qU,
  wedge: RU,
  Wedge: FU,
  wedgeq: BU,
  weierp: PU,
  Wfr: UU,
  wfr: VU,
  Wopf: $U,
  wopf: QU,
  wp: YU,
  wr: HU,
  wreath: GU,
  Wscr: WU,
  wscr: JU,
  xcap: ZU,
  xcirc: KU,
  xcup: XU,
  xdtri: eV,
  Xfr: tV,
  xfr: nV,
  xharr: rV,
  xhArr: oV,
  Xi: sV,
  xi: iV,
  xlarr: lV,
  xlArr: cV,
  xmap: aV,
  xnis: uV,
  xodot: fV,
  Xopf: hV,
  xopf: dV,
  xoplus: pV,
  xotime: mV,
  xrarr: gV,
  xrArr: yV,
  Xscr: MV,
  xscr: kV,
  xsqcup: xV,
  xuplus: bV,
  xutri: DV,
  xvee: NV,
  xwedge: wV,
  Yacute: CV,
  yacute: AV,
  YAcy: SV,
  yacy: TV,
  Ycirc: EV,
  ycirc: IV,
  Ycy: vV,
  ycy: OV,
  yen: zV,
  Yfr: _V,
  yfr: jV,
  YIcy: LV,
  yicy: qV,
  Yopf: RV,
  yopf: FV,
  Yscr: BV,
  yscr: PV,
  YUcy: UV,
  yucy: VV,
  yuml: $V,
  Yuml: QV,
  Zacute: YV,
  zacute: HV,
  Zcaron: GV,
  zcaron: WV,
  Zcy: JV,
  zcy: ZV,
  Zdot: KV,
  zdot: XV,
  zeetrf: e8,
  ZeroWidthSpace: t8,
  Zeta: n8,
  zeta: r8,
  zfr: o8,
  Zfr: s8,
  ZHcy: i8,
  zhcy: l8,
  zigrarr: c8,
  zopf: a8,
  Zopf: u8,
  Zscr: f8,
  zscr: h8,
  zwj: d8,
  zwnj: p8
};
var Ol = m8, yo = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, Ot = {}, Ss = {};
function g8(n) {
  var e, t, r = Ss[n];
  if (r)
    return r;
  for (r = Ss[n] = [], e = 0; e < 128; e++)
    t = String.fromCharCode(e), /^[0-9a-z]$/i.test(t) ? r.push(t) : r.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
  for (e = 0; e < n.length; e++)
    r[n.charCodeAt(e)] = n[e];
  return r;
}
function Pn(n, e, t) {
  var r, o, s, i, l, c = "";
  for (typeof e != "string" && (t = e, e = Pn.defaultChars), typeof t > "u" && (t = !0), l = g8(e), r = 0, o = n.length; r < o; r++) {
    if (s = n.charCodeAt(r), t && s === 37 && r + 2 < o && /^[0-9a-f]{2}$/i.test(n.slice(r + 1, r + 3))) {
      c += n.slice(r, r + 3), r += 2;
      continue;
    }
    if (s < 128) {
      c += l[s];
      continue;
    }
    if (s >= 55296 && s <= 57343) {
      if (s >= 55296 && s <= 56319 && r + 1 < o && (i = n.charCodeAt(r + 1), i >= 56320 && i <= 57343)) {
        c += encodeURIComponent(n[r] + n[r + 1]), r++;
        continue;
      }
      c += "%EF%BF%BD";
      continue;
    }
    c += encodeURIComponent(n[r]);
  }
  return c;
}
Pn.defaultChars = ";/?:@&=+$,-_.!~*'()#";
Pn.componentChars = "-_.!~*'()";
var y8 = Pn, Ts = {};
function M8(n) {
  var e, t, r = Ts[n];
  if (r)
    return r;
  for (r = Ts[n] = [], e = 0; e < 128; e++)
    t = String.fromCharCode(e), r.push(t);
  for (e = 0; e < n.length; e++)
    t = n.charCodeAt(e), r[t] = "%" + ("0" + t.toString(16).toUpperCase()).slice(-2);
  return r;
}
function Un(n, e) {
  var t;
  return typeof e != "string" && (e = Un.defaultChars), t = M8(e), n.replace(/(%[a-f0-9]{2})+/gi, function(r) {
    var o, s, i, l, c, a, u, f = "";
    for (o = 0, s = r.length; o < s; o += 3) {
      if (i = parseInt(r.slice(o + 1, o + 3), 16), i < 128) {
        f += t[i];
        continue;
      }
      if ((i & 224) === 192 && o + 3 < s && (l = parseInt(r.slice(o + 4, o + 6), 16), (l & 192) === 128)) {
        u = i << 6 & 1984 | l & 63, u < 128 ? f += "��" : f += String.fromCharCode(u), o += 3;
        continue;
      }
      if ((i & 240) === 224 && o + 6 < s && (l = parseInt(r.slice(o + 4, o + 6), 16), c = parseInt(r.slice(o + 7, o + 9), 16), (l & 192) === 128 && (c & 192) === 128)) {
        u = i << 12 & 61440 | l << 6 & 4032 | c & 63, u < 2048 || u >= 55296 && u <= 57343 ? f += "���" : f += String.fromCharCode(u), o += 6;
        continue;
      }
      if ((i & 248) === 240 && o + 9 < s && (l = parseInt(r.slice(o + 4, o + 6), 16), c = parseInt(r.slice(o + 7, o + 9), 16), a = parseInt(r.slice(o + 10, o + 12), 16), (l & 192) === 128 && (c & 192) === 128 && (a & 192) === 128)) {
        u = i << 18 & 1835008 | l << 12 & 258048 | c << 6 & 4032 | a & 63, u < 65536 || u > 1114111 ? f += "����" : (u -= 65536, f += String.fromCharCode(55296 + (u >> 10), 56320 + (u & 1023))), o += 9;
        continue;
      }
      f += "�";
    }
    return f;
  });
}
Un.defaultChars = ";/?:@&=+$,#";
Un.componentChars = "";
var k8 = Un, x8 = function(e) {
  var t = "";
  return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
};
function On() {
  this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var b8 = /^([a-z0-9.+-]+:)/i, D8 = /:[0-9]*$/, N8 = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, w8 = ["<", ">", '"', "`", " ", "\r", `
`, "	"], C8 = ["{", "}", "|", "\\", "^", "`"].concat(w8), A8 = ["'"].concat(C8), Es = ["%", "/", "?", ";", "#"].concat(A8), Is = ["/", "?", "#"], S8 = 255, vs = /^[+a-z0-9A-Z_-]{0,63}$/, T8 = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, Os = {
  javascript: !0,
  "javascript:": !0
}, zs = {
  http: !0,
  https: !0,
  ftp: !0,
  gopher: !0,
  file: !0,
  "http:": !0,
  "https:": !0,
  "ftp:": !0,
  "gopher:": !0,
  "file:": !0
};
function E8(n, e) {
  if (n && n instanceof On)
    return n;
  var t = new On();
  return t.parse(n, e), t;
}
On.prototype.parse = function(n, e) {
  var t, r, o, s, i, l = n;
  if (l = l.trim(), !e && n.split("#").length === 1) {
    var c = N8.exec(l);
    if (c)
      return this.pathname = c[1], c[2] && (this.search = c[2]), this;
  }
  var a = b8.exec(l);
  if (a && (a = a[0], o = a.toLowerCase(), this.protocol = a, l = l.substr(a.length)), (e || a || l.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = l.substr(0, 2) === "//", i && !(a && Os[a]) && (l = l.substr(2), this.slashes = !0)), !Os[a] && (i || a && !zs[a])) {
    var u = -1;
    for (t = 0; t < Is.length; t++)
      s = l.indexOf(Is[t]), s !== -1 && (u === -1 || s < u) && (u = s);
    var f, h;
    for (u === -1 ? h = l.lastIndexOf("@") : h = l.lastIndexOf("@", u), h !== -1 && (f = l.slice(0, h), l = l.slice(h + 1), this.auth = f), u = -1, t = 0; t < Es.length; t++)
      s = l.indexOf(Es[t]), s !== -1 && (u === -1 || s < u) && (u = s);
    u === -1 && (u = l.length), l[u - 1] === ":" && u--;
    var d = l.slice(0, u);
    l = l.slice(u), this.parseHost(d), this.hostname = this.hostname || "";
    var p = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!p) {
      var m = this.hostname.split(/\./);
      for (t = 0, r = m.length; t < r; t++) {
        var g = m[t];
        if (g && !g.match(vs)) {
          for (var y = "", k = 0, w = g.length; k < w; k++)
            g.charCodeAt(k) > 127 ? y += "x" : y += g[k];
          if (!y.match(vs)) {
            var S = m.slice(0, t), T = m.slice(t + 1), x = g.match(T8);
            x && (S.push(x[1]), T.unshift(x[2])), T.length && (l = T.join(".") + l), this.hostname = S.join(".");
            break;
          }
        }
      }
    }
    this.hostname.length > S8 && (this.hostname = ""), p && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
  }
  var O = l.indexOf("#");
  O !== -1 && (this.hash = l.substr(O), l = l.slice(0, O));
  var L = l.indexOf("?");
  return L !== -1 && (this.search = l.substr(L), l = l.slice(0, L)), l && (this.pathname = l), zs[o] && this.hostname && !this.pathname && (this.pathname = ""), this;
};
On.prototype.parseHost = function(n) {
  var e = D8.exec(n);
  e && (e = e[0], e !== ":" && (this.port = e.substr(1)), n = n.substr(0, n.length - e.length)), n && (this.hostname = n);
};
var I8 = E8;
Ot.encode = y8;
Ot.decode = k8;
Ot.format = x8;
Ot.parse = I8;
var Xe = {}, fr, _s;
function zl() {
  return _s || (_s = 1, fr = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/), fr;
}
var hr, js;
function _l() {
  return js || (js = 1, hr = /[\0-\x1F\x7F-\x9F]/), hr;
}
var dr, Ls;
function v8() {
  return Ls || (Ls = 1, dr = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/), dr;
}
var pr, qs;
function jl() {
  return qs || (qs = 1, pr = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/), pr;
}
var Rs;
function O8() {
  return Rs || (Rs = 1, Xe.Any = zl(), Xe.Cc = _l(), Xe.Cf = v8(), Xe.P = yo, Xe.Z = jl()), Xe;
}
(function(n) {
  function e(b) {
    return Object.prototype.toString.call(b);
  }
  function t(b) {
    return e(b) === "[object String]";
  }
  var r = Object.prototype.hasOwnProperty;
  function o(b, z) {
    return r.call(b, z);
  }
  function s(b) {
    var z = Array.prototype.slice.call(arguments, 1);
    return z.forEach(function(N) {
      if (N) {
        if (typeof N != "object")
          throw new TypeError(N + "must be object");
        Object.keys(N).forEach(function(je) {
          b[je] = N[je];
        });
      }
    }), b;
  }
  function i(b, z, N) {
    return [].concat(b.slice(0, z), N, b.slice(z + 1));
  }
  function l(b) {
    return !(b >= 55296 && b <= 57343 || b >= 64976 && b <= 65007 || (b & 65535) === 65535 || (b & 65535) === 65534 || b >= 0 && b <= 8 || b === 11 || b >= 14 && b <= 31 || b >= 127 && b <= 159 || b > 1114111);
  }
  function c(b) {
    if (b > 65535) {
      b -= 65536;
      var z = 55296 + (b >> 10), N = 56320 + (b & 1023);
      return String.fromCharCode(z, N);
    }
    return String.fromCharCode(b);
  }
  var a = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g, u = /&([a-z#][a-z0-9]{1,31});/gi, f = new RegExp(a.source + "|" + u.source, "gi"), h = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i, d = Ol;
  function p(b, z) {
    var N;
    return o(d, z) ? d[z] : z.charCodeAt(0) === 35 && h.test(z) && (N = z[1].toLowerCase() === "x" ? parseInt(z.slice(2), 16) : parseInt(z.slice(1), 10), l(N)) ? c(N) : b;
  }
  function m(b) {
    return b.indexOf("\\") < 0 ? b : b.replace(a, "$1");
  }
  function g(b) {
    return b.indexOf("\\") < 0 && b.indexOf("&") < 0 ? b : b.replace(f, function(z, N, je) {
      return N || p(z, je);
    });
  }
  var y = /[&<>"]/, k = /[&<>"]/g, w = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  };
  function S(b) {
    return w[b];
  }
  function T(b) {
    return y.test(b) ? b.replace(k, S) : b;
  }
  var x = /[.?*+^$[\]\\(){}|-]/g;
  function O(b) {
    return b.replace(x, "\\$&");
  }
  function L(b) {
    switch (b) {
      case 9:
      case 32:
        return !0;
    }
    return !1;
  }
  function A(b) {
    if (b >= 8192 && b <= 8202)
      return !0;
    switch (b) {
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 32:
      case 160:
      case 5760:
      case 8239:
      case 8287:
      case 12288:
        return !0;
    }
    return !1;
  }
  var E = yo;
  function W(b) {
    return E.test(b);
  }
  function _e(b) {
    switch (b) {
      case 33:
      case 34:
      case 35:
      case 36:
      case 37:
      case 38:
      case 39:
      case 40:
      case 41:
      case 42:
      case 43:
      case 44:
      case 45:
      case 46:
      case 47:
      case 58:
      case 59:
      case 60:
      case 61:
      case 62:
      case 63:
      case 64:
      case 91:
      case 92:
      case 93:
      case 94:
      case 95:
      case 96:
      case 123:
      case 124:
      case 125:
      case 126:
        return !0;
      default:
        return !1;
    }
  }
  function jt(b) {
    return b = b.trim().replace(/\s+/g, " "), "ẞ".toLowerCase() === "Ṿ" && (b = b.replace(/ẞ/g, "ß")), b.toLowerCase().toUpperCase();
  }
  n.lib = {}, n.lib.mdurl = Ot, n.lib.ucmicro = O8(), n.assign = s, n.isString = t, n.has = o, n.unescapeMd = m, n.unescapeAll = g, n.isValidEntityCode = l, n.fromCodePoint = c, n.escapeHtml = T, n.arrayReplaceAt = i, n.isSpace = L, n.isWhiteSpace = A, n.isMdAsciiPunct = _e, n.isPunctChar = W, n.escapeRE = O, n.normalizeReference = jt;
})(_);
var Vn = {}, z8 = function(e, t, r) {
  var o, s, i, l, c = -1, a = e.posMax, u = e.pos;
  for (e.pos = t + 1, o = 1; e.pos < a; ) {
    if (i = e.src.charCodeAt(e.pos), i === 93 && (o--, o === 0)) {
      s = !0;
      break;
    }
    if (l = e.pos, e.md.inline.skipToken(e), i === 91) {
      if (l === e.pos - 1)
        o++;
      else if (r)
        return e.pos = u, -1;
    }
  }
  return s && (c = e.pos), e.pos = u, c;
}, Fs = _.unescapeAll, _8 = function(e, t, r) {
  var o, s, i = t, l = {
    ok: !1,
    pos: 0,
    lines: 0,
    str: ""
  };
  if (e.charCodeAt(i) === 60) {
    for (i++; i < r; ) {
      if (o = e.charCodeAt(i), o === 10 || o === 60)
        return l;
      if (o === 62)
        return l.pos = i + 1, l.str = Fs(e.slice(t + 1, i)), l.ok = !0, l;
      if (o === 92 && i + 1 < r) {
        i += 2;
        continue;
      }
      i++;
    }
    return l;
  }
  for (s = 0; i < r && (o = e.charCodeAt(i), !(o === 32 || o < 32 || o === 127)); ) {
    if (o === 92 && i + 1 < r) {
      if (e.charCodeAt(i + 1) === 32)
        break;
      i += 2;
      continue;
    }
    if (o === 40 && (s++, s > 32))
      return l;
    if (o === 41) {
      if (s === 0)
        break;
      s--;
    }
    i++;
  }
  return t === i || s !== 0 || (l.str = Fs(e.slice(t, i)), l.pos = i, l.ok = !0), l;
}, j8 = _.unescapeAll, L8 = function(e, t, r) {
  var o, s, i = 0, l = t, c = {
    ok: !1,
    pos: 0,
    lines: 0,
    str: ""
  };
  if (l >= r || (s = e.charCodeAt(l), s !== 34 && s !== 39 && s !== 40))
    return c;
  for (l++, s === 40 && (s = 41); l < r; ) {
    if (o = e.charCodeAt(l), o === s)
      return c.pos = l + 1, c.lines = i, c.str = j8(e.slice(t + 1, l)), c.ok = !0, c;
    if (o === 40 && s === 41)
      return c;
    o === 10 ? i++ : o === 92 && l + 1 < r && (l++, e.charCodeAt(l) === 10 && i++), l++;
  }
  return c;
};
Vn.parseLinkLabel = z8;
Vn.parseLinkDestination = _8;
Vn.parseLinkTitle = L8;
var q8 = _.assign, R8 = _.unescapeAll, ht = _.escapeHtml, Ce = {};
Ce.code_inline = function(n, e, t, r, o) {
  var s = n[e];
  return "<code" + o.renderAttrs(s) + ">" + ht(s.content) + "</code>";
};
Ce.code_block = function(n, e, t, r, o) {
  var s = n[e];
  return "<pre" + o.renderAttrs(s) + "><code>" + ht(n[e].content) + `</code></pre>
`;
};
Ce.fence = function(n, e, t, r, o) {
  var s = n[e], i = s.info ? R8(s.info).trim() : "", l = "", c = "", a, u, f, h, d;
  return i && (f = i.split(/(\s+)/g), l = f[0], c = f.slice(2).join("")), t.highlight ? a = t.highlight(s.content, l, c) || ht(s.content) : a = ht(s.content), a.indexOf("<pre") === 0 ? a + `
` : i ? (u = s.attrIndex("class"), h = s.attrs ? s.attrs.slice() : [], u < 0 ? h.push(["class", t.langPrefix + l]) : (h[u] = h[u].slice(), h[u][1] += " " + t.langPrefix + l), d = {
    attrs: h
  }, "<pre><code" + o.renderAttrs(d) + ">" + a + `</code></pre>
`) : "<pre><code" + o.renderAttrs(s) + ">" + a + `</code></pre>
`;
};
Ce.image = function(n, e, t, r, o) {
  var s = n[e];
  return s.attrs[s.attrIndex("alt")][1] = o.renderInlineAsText(s.children, t, r), o.renderToken(n, e, t);
};
Ce.hardbreak = function(n, e, t) {
  return t.xhtmlOut ? `<br />
` : `<br>
`;
};
Ce.softbreak = function(n, e, t) {
  return t.breaks ? t.xhtmlOut ? `<br />
` : `<br>
` : `
`;
};
Ce.text = function(n, e) {
  return ht(n[e].content);
};
Ce.html_block = function(n, e) {
  return n[e].content;
};
Ce.html_inline = function(n, e) {
  return n[e].content;
};
function zt() {
  this.rules = q8({}, Ce);
}
zt.prototype.renderAttrs = function(e) {
  var t, r, o;
  if (!e.attrs)
    return "";
  for (o = "", t = 0, r = e.attrs.length; t < r; t++)
    o += " " + ht(e.attrs[t][0]) + '="' + ht(e.attrs[t][1]) + '"';
  return o;
};
zt.prototype.renderToken = function(e, t, r) {
  var o, s = "", i = !1, l = e[t];
  return l.hidden ? "" : (l.block && l.nesting !== -1 && t && e[t - 1].hidden && (s += `
`), s += (l.nesting === -1 ? "</" : "<") + l.tag, s += this.renderAttrs(l), l.nesting === 0 && r.xhtmlOut && (s += " /"), l.block && (i = !0, l.nesting === 1 && t + 1 < e.length && (o = e[t + 1], (o.type === "inline" || o.hidden || o.nesting === -1 && o.tag === l.tag) && (i = !1))), s += i ? `>
` : ">", s);
};
zt.prototype.renderInline = function(n, e, t) {
  for (var r, o = "", s = this.rules, i = 0, l = n.length; i < l; i++)
    r = n[i].type, typeof s[r] < "u" ? o += s[r](n, i, e, t, this) : o += this.renderToken(n, i, e);
  return o;
};
zt.prototype.renderInlineAsText = function(n, e, t) {
  for (var r = "", o = 0, s = n.length; o < s; o++)
    n[o].type === "text" ? r += n[o].content : n[o].type === "image" ? r += this.renderInlineAsText(n[o].children, e, t) : n[o].type === "softbreak" && (r += `
`);
  return r;
};
zt.prototype.render = function(n, e, t) {
  var r, o, s, i = "", l = this.rules;
  for (r = 0, o = n.length; r < o; r++)
    s = n[r].type, s === "inline" ? i += this.renderInline(n[r].children, e, t) : typeof l[s] < "u" ? i += l[s](n, r, e, t, this) : i += this.renderToken(n, r, e, t);
  return i;
};
var F8 = zt;
function ge() {
  this.__rules__ = [], this.__cache__ = null;
}
ge.prototype.__find__ = function(n) {
  for (var e = 0; e < this.__rules__.length; e++)
    if (this.__rules__[e].name === n)
      return e;
  return -1;
};
ge.prototype.__compile__ = function() {
  var n = this, e = [""];
  n.__rules__.forEach(function(t) {
    t.enabled && t.alt.forEach(function(r) {
      e.indexOf(r) < 0 && e.push(r);
    });
  }), n.__cache__ = {}, e.forEach(function(t) {
    n.__cache__[t] = [], n.__rules__.forEach(function(r) {
      r.enabled && (t && r.alt.indexOf(t) < 0 || n.__cache__[t].push(r.fn));
    });
  });
};
ge.prototype.at = function(n, e, t) {
  var r = this.__find__(n), o = t || {};
  if (r === -1)
    throw new Error("Parser rule not found: " + n);
  this.__rules__[r].fn = e, this.__rules__[r].alt = o.alt || [], this.__cache__ = null;
};
ge.prototype.before = function(n, e, t, r) {
  var o = this.__find__(n), s = r || {};
  if (o === -1)
    throw new Error("Parser rule not found: " + n);
  this.__rules__.splice(o, 0, {
    name: e,
    enabled: !0,
    fn: t,
    alt: s.alt || []
  }), this.__cache__ = null;
};
ge.prototype.after = function(n, e, t, r) {
  var o = this.__find__(n), s = r || {};
  if (o === -1)
    throw new Error("Parser rule not found: " + n);
  this.__rules__.splice(o + 1, 0, {
    name: e,
    enabled: !0,
    fn: t,
    alt: s.alt || []
  }), this.__cache__ = null;
};
ge.prototype.push = function(n, e, t) {
  var r = t || {};
  this.__rules__.push({
    name: n,
    enabled: !0,
    fn: e,
    alt: r.alt || []
  }), this.__cache__ = null;
};
ge.prototype.enable = function(n, e) {
  Array.isArray(n) || (n = [n]);
  var t = [];
  return n.forEach(function(r) {
    var o = this.__find__(r);
    if (o < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + r);
    }
    this.__rules__[o].enabled = !0, t.push(r);
  }, this), this.__cache__ = null, t;
};
ge.prototype.enableOnly = function(n, e) {
  Array.isArray(n) || (n = [n]), this.__rules__.forEach(function(t) {
    t.enabled = !1;
  }), this.enable(n, e);
};
ge.prototype.disable = function(n, e) {
  Array.isArray(n) || (n = [n]);
  var t = [];
  return n.forEach(function(r) {
    var o = this.__find__(r);
    if (o < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + r);
    }
    this.__rules__[o].enabled = !1, t.push(r);
  }, this), this.__cache__ = null, t;
};
ge.prototype.getRules = function(n) {
  return this.__cache__ === null && this.__compile__(), this.__cache__[n] || [];
};
var Mo = ge, B8 = /\r\n?|\n/g, P8 = /\0/g, U8 = function(e) {
  var t;
  t = e.src.replace(B8, `
`), t = t.replace(P8, "�"), e.src = t;
}, V8 = function(e) {
  var t;
  e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}, $8 = function(e) {
  var t = e.tokens, r, o, s;
  for (o = 0, s = t.length; o < s; o++)
    r = t[o], r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
}, Q8 = _.arrayReplaceAt;
function Y8(n) {
  return /^<a[>\s]/i.test(n);
}
function H8(n) {
  return /^<\/a\s*>/i.test(n);
}
var G8 = function(e) {
  var t, r, o, s, i, l, c, a, u, f, h, d, p, m, g, y, k = e.tokens, w;
  if (e.md.options.linkify) {
    for (r = 0, o = k.length; r < o; r++)
      if (!(k[r].type !== "inline" || !e.md.linkify.pretest(k[r].content)))
        for (s = k[r].children, p = 0, t = s.length - 1; t >= 0; t--) {
          if (l = s[t], l.type === "link_close") {
            for (t--; s[t].level !== l.level && s[t].type !== "link_open"; )
              t--;
            continue;
          }
          if (l.type === "html_inline" && (Y8(l.content) && p > 0 && p--, H8(l.content) && p++), !(p > 0) && l.type === "text" && e.md.linkify.test(l.content)) {
            for (u = l.content, w = e.md.linkify.match(u), c = [], d = l.level, h = 0, w.length > 0 && w[0].index === 0 && t > 0 && s[t - 1].type === "text_special" && (w = w.slice(1)), a = 0; a < w.length; a++)
              m = w[a].url, g = e.md.normalizeLink(m), e.md.validateLink(g) && (y = w[a].text, w[a].schema ? w[a].schema === "mailto:" && !/^mailto:/i.test(y) ? y = e.md.normalizeLinkText("mailto:" + y).replace(/^mailto:/, "") : y = e.md.normalizeLinkText(y) : y = e.md.normalizeLinkText("http://" + y).replace(/^http:\/\//, ""), f = w[a].index, f > h && (i = new e.Token("text", "", 0), i.content = u.slice(h, f), i.level = d, c.push(i)), i = new e.Token("link_open", "a", 1), i.attrs = [["href", g]], i.level = d++, i.markup = "linkify", i.info = "auto", c.push(i), i = new e.Token("text", "", 0), i.content = y, i.level = d, c.push(i), i = new e.Token("link_close", "a", -1), i.level = --d, i.markup = "linkify", i.info = "auto", c.push(i), h = w[a].lastIndex);
            h < u.length && (i = new e.Token("text", "", 0), i.content = u.slice(h), i.level = d, c.push(i)), k[r].children = s = Q8(s, t, c);
          }
        }
  }
}, Ll = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, W8 = /\((c|tm|r)\)/i, J8 = /\((c|tm|r)\)/ig, Z8 = {
  c: "©",
  r: "®",
  tm: "™"
};
function K8(n, e) {
  return Z8[e.toLowerCase()];
}
function X8(n) {
  var e, t, r = 0;
  for (e = n.length - 1; e >= 0; e--)
    t = n[e], t.type === "text" && !r && (t.content = t.content.replace(J8, K8)), t.type === "link_open" && t.info === "auto" && r--, t.type === "link_close" && t.info === "auto" && r++;
}
function e6(n) {
  var e, t, r = 0;
  for (e = n.length - 1; e >= 0; e--)
    t = n[e], t.type === "text" && !r && Ll.test(t.content) && (t.content = t.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–")), t.type === "link_open" && t.info === "auto" && r--, t.type === "link_close" && t.info === "auto" && r++;
}
var t6 = function(e) {
  var t;
  if (e.md.options.typographer)
    for (t = e.tokens.length - 1; t >= 0; t--)
      e.tokens[t].type === "inline" && (W8.test(e.tokens[t].content) && X8(e.tokens[t].children), Ll.test(e.tokens[t].content) && e6(e.tokens[t].children));
}, Bs = _.isWhiteSpace, Ps = _.isPunctChar, Us = _.isMdAsciiPunct, n6 = /['"]/, Vs = /['"]/g, $s = "’";
function dn(n, e, t) {
  return n.slice(0, e) + t + n.slice(e + 1);
}
function r6(n, e) {
  var t, r, o, s, i, l, c, a, u, f, h, d, p, m, g, y, k, w, S, T, x;
  for (S = [], t = 0; t < n.length; t++) {
    for (r = n[t], c = n[t].level, k = S.length - 1; k >= 0 && !(S[k].level <= c); k--)
      ;
    if (S.length = k + 1, r.type === "text") {
      o = r.content, i = 0, l = o.length;
      e:
        for (; i < l && (Vs.lastIndex = i, s = Vs.exec(o), !!s); ) {
          if (g = y = !0, i = s.index + 1, w = s[0] === "'", u = 32, s.index - 1 >= 0)
            u = o.charCodeAt(s.index - 1);
          else
            for (k = t - 1; k >= 0 && !(n[k].type === "softbreak" || n[k].type === "hardbreak"); k--)
              if (n[k].content) {
                u = n[k].content.charCodeAt(n[k].content.length - 1);
                break;
              }
          if (f = 32, i < l)
            f = o.charCodeAt(i);
          else
            for (k = t + 1; k < n.length && !(n[k].type === "softbreak" || n[k].type === "hardbreak"); k++)
              if (n[k].content) {
                f = n[k].content.charCodeAt(0);
                break;
              }
          if (h = Us(u) || Ps(String.fromCharCode(u)), d = Us(f) || Ps(String.fromCharCode(f)), p = Bs(u), m = Bs(f), m ? g = !1 : d && (p || h || (g = !1)), p ? y = !1 : h && (m || d || (y = !1)), f === 34 && s[0] === '"' && u >= 48 && u <= 57 && (y = g = !1), g && y && (g = h, y = d), !g && !y) {
            w && (r.content = dn(r.content, s.index, $s));
            continue;
          }
          if (y) {
            for (k = S.length - 1; k >= 0 && (a = S[k], !(S[k].level < c)); k--)
              if (a.single === w && S[k].level === c) {
                a = S[k], w ? (T = e.md.options.quotes[2], x = e.md.options.quotes[3]) : (T = e.md.options.quotes[0], x = e.md.options.quotes[1]), r.content = dn(r.content, s.index, x), n[a.token].content = dn(
                  n[a.token].content,
                  a.pos,
                  T
                ), i += x.length - 1, a.token === t && (i += T.length - 1), o = r.content, l = o.length, S.length = k;
                continue e;
              }
          }
          g ? S.push({
            token: t,
            pos: s.index,
            single: w,
            level: c
          }) : y && w && (r.content = dn(r.content, s.index, $s));
        }
    }
  }
}
var o6 = function(e) {
  var t;
  if (e.md.options.typographer)
    for (t = e.tokens.length - 1; t >= 0; t--)
      e.tokens[t].type !== "inline" || !n6.test(e.tokens[t].content) || r6(e.tokens[t].children, e);
}, s6 = function(e) {
  var t, r, o, s, i, l, c = e.tokens;
  for (t = 0, r = c.length; t < r; t++)
    if (c[t].type === "inline") {
      for (o = c[t].children, i = o.length, s = 0; s < i; s++)
        o[s].type === "text_special" && (o[s].type = "text");
      for (s = l = 0; s < i; s++)
        o[s].type === "text" && s + 1 < i && o[s + 1].type === "text" ? o[s + 1].content = o[s].content + o[s + 1].content : (s !== l && (o[l] = o[s]), l++);
      s !== l && (o.length = l);
    }
};
function _t(n, e, t) {
  this.type = n, this.tag = e, this.attrs = null, this.map = null, this.nesting = t, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
_t.prototype.attrIndex = function(e) {
  var t, r, o;
  if (!this.attrs)
    return -1;
  for (t = this.attrs, r = 0, o = t.length; r < o; r++)
    if (t[r][0] === e)
      return r;
  return -1;
};
_t.prototype.attrPush = function(e) {
  this.attrs ? this.attrs.push(e) : this.attrs = [e];
};
_t.prototype.attrSet = function(e, t) {
  var r = this.attrIndex(e), o = [e, t];
  r < 0 ? this.attrPush(o) : this.attrs[r] = o;
};
_t.prototype.attrGet = function(e) {
  var t = this.attrIndex(e), r = null;
  return t >= 0 && (r = this.attrs[t][1]), r;
};
_t.prototype.attrJoin = function(e, t) {
  var r = this.attrIndex(e);
  r < 0 ? this.attrPush([e, t]) : this.attrs[r][1] = this.attrs[r][1] + " " + t;
};
var ko = _t, i6 = ko;
function ql(n, e, t) {
  this.src = n, this.env = t, this.tokens = [], this.inlineMode = !1, this.md = e;
}
ql.prototype.Token = i6;
var l6 = ql, c6 = Mo, mr = [
  ["normalize", U8],
  ["block", V8],
  ["inline", $8],
  ["linkify", G8],
  ["replacements", t6],
  ["smartquotes", o6],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ["text_join", s6]
];
function xo() {
  this.ruler = new c6();
  for (var n = 0; n < mr.length; n++)
    this.ruler.push(mr[n][0], mr[n][1]);
}
xo.prototype.process = function(n) {
  var e, t, r;
  for (r = this.ruler.getRules(""), e = 0, t = r.length; e < t; e++)
    r[e](n);
};
xo.prototype.State = l6;
var a6 = xo, gr = _.isSpace;
function yr(n, e) {
  var t = n.bMarks[e] + n.tShift[e], r = n.eMarks[e];
  return n.src.slice(t, r);
}
function Qs(n) {
  var e = [], t = 0, r = n.length, o, s = !1, i = 0, l = "";
  for (o = n.charCodeAt(t); t < r; )
    o === 124 && (s ? (l += n.substring(i, t - 1), i = t) : (e.push(l + n.substring(i, t)), l = "", i = t + 1)), s = o === 92, t++, o = n.charCodeAt(t);
  return e.push(l + n.substring(i)), e;
}
var u6 = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h, d, p, m, g, y, k, w, S, T, x;
  if (t + 2 > r || (u = t + 1, e.sCount[u] < e.blkIndent) || e.sCount[u] - e.blkIndent >= 4 || (l = e.bMarks[u] + e.tShift[u], l >= e.eMarks[u]) || (T = e.src.charCodeAt(l++), T !== 124 && T !== 45 && T !== 58) || l >= e.eMarks[u] || (x = e.src.charCodeAt(l++), x !== 124 && x !== 45 && x !== 58 && !gr(x)) || T === 45 && gr(x))
    return !1;
  for (; l < e.eMarks[u]; ) {
    if (s = e.src.charCodeAt(l), s !== 124 && s !== 45 && s !== 58 && !gr(s))
      return !1;
    l++;
  }
  for (i = yr(e, t + 1), f = i.split("|"), p = [], c = 0; c < f.length; c++) {
    if (m = f[c].trim(), !m) {
      if (c === 0 || c === f.length - 1)
        continue;
      return !1;
    }
    if (!/^:?-+:?$/.test(m))
      return !1;
    m.charCodeAt(m.length - 1) === 58 ? p.push(m.charCodeAt(0) === 58 ? "center" : "right") : m.charCodeAt(0) === 58 ? p.push("left") : p.push("");
  }
  if (i = yr(e, t).trim(), i.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4 || (f = Qs(i), f.length && f[0] === "" && f.shift(), f.length && f[f.length - 1] === "" && f.pop(), h = f.length, h === 0 || h !== p.length))
    return !1;
  if (o)
    return !0;
  for (k = e.parentType, e.parentType = "table", S = e.md.block.ruler.getRules("blockquote"), d = e.push("table_open", "table", 1), d.map = g = [t, 0], d = e.push("thead_open", "thead", 1), d.map = [t, t + 1], d = e.push("tr_open", "tr", 1), d.map = [t, t + 1], c = 0; c < f.length; c++)
    d = e.push("th_open", "th", 1), p[c] && (d.attrs = [["style", "text-align:" + p[c]]]), d = e.push("inline", "", 0), d.content = f[c].trim(), d.children = [], d = e.push("th_close", "th", -1);
  for (d = e.push("tr_close", "tr", -1), d = e.push("thead_close", "thead", -1), u = t + 2; u < r && !(e.sCount[u] < e.blkIndent); u++) {
    for (w = !1, c = 0, a = S.length; c < a; c++)
      if (S[c](e, u, r, !0)) {
        w = !0;
        break;
      }
    if (w || (i = yr(e, u).trim(), !i) || e.sCount[u] - e.blkIndent >= 4)
      break;
    for (f = Qs(i), f.length && f[0] === "" && f.shift(), f.length && f[f.length - 1] === "" && f.pop(), u === t + 2 && (d = e.push("tbody_open", "tbody", 1), d.map = y = [t + 2, 0]), d = e.push("tr_open", "tr", 1), d.map = [u, u + 1], c = 0; c < h; c++)
      d = e.push("td_open", "td", 1), p[c] && (d.attrs = [["style", "text-align:" + p[c]]]), d = e.push("inline", "", 0), d.content = f[c] ? f[c].trim() : "", d.children = [], d = e.push("td_close", "td", -1);
    d = e.push("tr_close", "tr", -1);
  }
  return y && (d = e.push("tbody_close", "tbody", -1), y[1] = u), d = e.push("table_close", "table", -1), g[1] = u, e.parentType = k, e.line = u, !0;
}, f6 = function(e, t, r) {
  var o, s, i;
  if (e.sCount[t] - e.blkIndent < 4)
    return !1;
  for (s = o = t + 1; o < r; ) {
    if (e.isEmpty(o)) {
      o++;
      continue;
    }
    if (e.sCount[o] - e.blkIndent >= 4) {
      o++, s = o;
      continue;
    }
    break;
  }
  return e.line = s, i = e.push("code_block", "code", 0), i.content = e.getLines(t, s, 4 + e.blkIndent, !1) + `
`, i.map = [t, e.line], !0;
}, h6 = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h = !1, d = e.bMarks[t] + e.tShift[t], p = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || d + 3 > p || (s = e.src.charCodeAt(d), s !== 126 && s !== 96) || (a = d, d = e.skipChars(d, s), i = d - a, i < 3) || (f = e.src.slice(a, d), l = e.src.slice(d, p), s === 96 && l.indexOf(String.fromCharCode(s)) >= 0))
    return !1;
  if (o)
    return !0;
  for (c = t; c++, !(c >= r || (d = a = e.bMarks[c] + e.tShift[c], p = e.eMarks[c], d < p && e.sCount[c] < e.blkIndent)); )
    if (e.src.charCodeAt(d) === s && !(e.sCount[c] - e.blkIndent >= 4) && (d = e.skipChars(d, s), !(d - a < i) && (d = e.skipSpaces(d), !(d < p)))) {
      h = !0;
      break;
    }
  return i = e.sCount[t], e.line = c + (h ? 1 : 0), u = e.push("fence", "code", 0), u.info = l, u.content = e.getLines(t + 1, c, i, !0), u.markup = f, u.map = [t, e.line], !0;
}, d6 = _.isSpace, p6 = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h, d, p, m, g, y, k, w, S, T, x, O, L, A = e.lineMax, E = e.bMarks[t] + e.tShift[t], W = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(E) !== 62)
    return !1;
  if (o)
    return !0;
  for (p = [], m = [], k = [], w = [], x = e.md.block.ruler.getRules("blockquote"), y = e.parentType, e.parentType = "blockquote", h = t; h < r && (L = e.sCount[h] < e.blkIndent, E = e.bMarks[h] + e.tShift[h], W = e.eMarks[h], !(E >= W)); h++) {
    if (e.src.charCodeAt(E++) === 62 && !L) {
      for (c = e.sCount[h] + 1, e.src.charCodeAt(E) === 32 ? (E++, c++, s = !1, S = !0) : e.src.charCodeAt(E) === 9 ? (S = !0, (e.bsCount[h] + c) % 4 === 3 ? (E++, c++, s = !1) : s = !0) : S = !1, d = c, p.push(e.bMarks[h]), e.bMarks[h] = E; E < W && (i = e.src.charCodeAt(E), d6(i)); ) {
        i === 9 ? d += 4 - (d + e.bsCount[h] + (s ? 1 : 0)) % 4 : d++;
        E++;
      }
      u = E >= W, m.push(e.bsCount[h]), e.bsCount[h] = e.sCount[h] + 1 + (S ? 1 : 0), k.push(e.sCount[h]), e.sCount[h] = d - c, w.push(e.tShift[h]), e.tShift[h] = E - e.bMarks[h];
      continue;
    }
    if (u)
      break;
    for (T = !1, l = 0, a = x.length; l < a; l++)
      if (x[l](e, h, r, !0)) {
        T = !0;
        break;
      }
    if (T) {
      e.lineMax = h, e.blkIndent !== 0 && (p.push(e.bMarks[h]), m.push(e.bsCount[h]), w.push(e.tShift[h]), k.push(e.sCount[h]), e.sCount[h] -= e.blkIndent);
      break;
    }
    p.push(e.bMarks[h]), m.push(e.bsCount[h]), w.push(e.tShift[h]), k.push(e.sCount[h]), e.sCount[h] = -1;
  }
  for (g = e.blkIndent, e.blkIndent = 0, O = e.push("blockquote_open", "blockquote", 1), O.markup = ">", O.map = f = [t, 0], e.md.block.tokenize(e, t, h), O = e.push("blockquote_close", "blockquote", -1), O.markup = ">", e.lineMax = A, e.parentType = y, f[1] = e.line, l = 0; l < w.length; l++)
    e.bMarks[l + t] = p[l], e.tShift[l + t] = w[l], e.sCount[l + t] = k[l], e.bsCount[l + t] = m[l];
  return e.blkIndent = g, !0;
}, m6 = _.isSpace, g6 = function(e, t, r, o) {
  var s, i, l, c, a = e.bMarks[t] + e.tShift[t], u = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || (s = e.src.charCodeAt(a++), s !== 42 && s !== 45 && s !== 95))
    return !1;
  for (i = 1; a < u; ) {
    if (l = e.src.charCodeAt(a++), l !== s && !m6(l))
      return !1;
    l === s && i++;
  }
  return i < 3 ? !1 : (o || (e.line = t + 1, c = e.push("hr", "hr", 0), c.map = [t, e.line], c.markup = Array(i + 1).join(String.fromCharCode(s))), !0);
}, Rl = _.isSpace;
function Ys(n, e) {
  var t, r, o, s;
  return r = n.bMarks[e] + n.tShift[e], o = n.eMarks[e], t = n.src.charCodeAt(r++), t !== 42 && t !== 45 && t !== 43 || r < o && (s = n.src.charCodeAt(r), !Rl(s)) ? -1 : r;
}
function Hs(n, e) {
  var t, r = n.bMarks[e] + n.tShift[e], o = r, s = n.eMarks[e];
  if (o + 1 >= s || (t = n.src.charCodeAt(o++), t < 48 || t > 57))
    return -1;
  for (; ; ) {
    if (o >= s)
      return -1;
    if (t = n.src.charCodeAt(o++), t >= 48 && t <= 57) {
      if (o - r >= 10)
        return -1;
      continue;
    }
    if (t === 41 || t === 46)
      break;
    return -1;
  }
  return o < s && (t = n.src.charCodeAt(o), !Rl(t)) ? -1 : o;
}
function y6(n, e) {
  var t, r, o = n.level + 2;
  for (t = e + 2, r = n.tokens.length - 2; t < r; t++)
    n.tokens[t].level === o && n.tokens[t].type === "paragraph_open" && (n.tokens[t + 2].hidden = !0, n.tokens[t].hidden = !0, t += 2);
}
var M6 = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h, d, p, m, g, y, k, w, S, T, x, O, L, A, E, W, _e, jt, b, z, N = t, je = !1, Io = !0;
  if (e.sCount[N] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[N] - e.listIndent >= 4 && e.sCount[N] < e.blkIndent)
    return !1;
  if (o && e.parentType === "paragraph" && e.sCount[N] >= e.blkIndent && (je = !0), (E = Hs(e, N)) >= 0) {
    if (f = !0, _e = e.bMarks[N] + e.tShift[N], y = Number(e.src.slice(_e, E - 1)), je && y !== 1)
      return !1;
  } else if ((E = Ys(e, N)) >= 0)
    f = !1;
  else
    return !1;
  if (je && e.skipSpaces(E) >= e.eMarks[N])
    return !1;
  if (o)
    return !0;
  for (g = e.src.charCodeAt(E - 1), m = e.tokens.length, f ? (z = e.push("ordered_list_open", "ol", 1), y !== 1 && (z.attrs = [["start", y]])) : z = e.push("bullet_list_open", "ul", 1), z.map = p = [N, 0], z.markup = String.fromCharCode(g), W = !1, b = e.md.block.ruler.getRules("list"), T = e.parentType, e.parentType = "list"; N < r; ) {
    for (A = E, k = e.eMarks[N], u = w = e.sCount[N] + E - (e.bMarks[N] + e.tShift[N]); A < k; ) {
      if (s = e.src.charCodeAt(A), s === 9)
        w += 4 - (w + e.bsCount[N]) % 4;
      else if (s === 32)
        w++;
      else
        break;
      A++;
    }
    if (i = A, i >= k ? a = 1 : a = w - u, a > 4 && (a = 1), c = u + a, z = e.push("list_item_open", "li", 1), z.markup = String.fromCharCode(g), z.map = h = [N, 0], f && (z.info = e.src.slice(_e, E - 1)), L = e.tight, O = e.tShift[N], x = e.sCount[N], S = e.listIndent, e.listIndent = e.blkIndent, e.blkIndent = c, e.tight = !0, e.tShift[N] = i - e.bMarks[N], e.sCount[N] = w, i >= k && e.isEmpty(N + 1) ? e.line = Math.min(e.line + 2, r) : e.md.block.tokenize(e, N, r, !0), (!e.tight || W) && (Io = !1), W = e.line - N > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = S, e.tShift[N] = O, e.sCount[N] = x, e.tight = L, z = e.push("list_item_close", "li", -1), z.markup = String.fromCharCode(g), N = e.line, h[1] = N, N >= r || e.sCount[N] < e.blkIndent || e.sCount[N] - e.blkIndent >= 4)
      break;
    for (jt = !1, l = 0, d = b.length; l < d; l++)
      if (b[l](e, N, r, !0)) {
        jt = !0;
        break;
      }
    if (jt)
      break;
    if (f) {
      if (E = Hs(e, N), E < 0)
        break;
      _e = e.bMarks[N] + e.tShift[N];
    } else if (E = Ys(e, N), E < 0)
      break;
    if (g !== e.src.charCodeAt(E - 1))
      break;
  }
  return f ? z = e.push("ordered_list_close", "ol", -1) : z = e.push("bullet_list_close", "ul", -1), z.markup = String.fromCharCode(g), p[1] = N, e.line = N, e.parentType = T, Io && y6(e, m), !0;
}, k6 = _.normalizeReference, pn = _.isSpace, x6 = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h, d, p, m, g, y, k, w, S, T = 0, x = e.bMarks[t] + e.tShift[t], O = e.eMarks[t], L = t + 1;
  if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(x) !== 91)
    return !1;
  for (; ++x < O; )
    if (e.src.charCodeAt(x) === 93 && e.src.charCodeAt(x - 1) !== 92) {
      if (x + 1 === O || e.src.charCodeAt(x + 1) !== 58)
        return !1;
      break;
    }
  for (c = e.lineMax, w = e.md.block.ruler.getRules("reference"), p = e.parentType, e.parentType = "reference"; L < c && !e.isEmpty(L); L++)
    if (!(e.sCount[L] - e.blkIndent > 3) && !(e.sCount[L] < 0)) {
      for (k = !1, u = 0, f = w.length; u < f; u++)
        if (w[u](e, L, c, !0)) {
          k = !0;
          break;
        }
      if (k)
        break;
    }
  for (y = e.getLines(t, L, e.blkIndent, !1).trim(), O = y.length, x = 1; x < O; x++) {
    if (s = y.charCodeAt(x), s === 91)
      return !1;
    if (s === 93) {
      d = x;
      break;
    } else
      s === 10 ? T++ : s === 92 && (x++, x < O && y.charCodeAt(x) === 10 && T++);
  }
  if (d < 0 || y.charCodeAt(d + 1) !== 58)
    return !1;
  for (x = d + 2; x < O; x++)
    if (s = y.charCodeAt(x), s === 10)
      T++;
    else if (!pn(s))
      break;
  if (m = e.md.helpers.parseLinkDestination(y, x, O), !m.ok || (a = e.md.normalizeLink(m.str), !e.md.validateLink(a)))
    return !1;
  for (x = m.pos, T += m.lines, i = x, l = T, g = x; x < O; x++)
    if (s = y.charCodeAt(x), s === 10)
      T++;
    else if (!pn(s))
      break;
  for (m = e.md.helpers.parseLinkTitle(y, x, O), x < O && g !== x && m.ok ? (S = m.str, x = m.pos, T += m.lines) : (S = "", x = i, T = l); x < O && (s = y.charCodeAt(x), !!pn(s)); )
    x++;
  if (x < O && y.charCodeAt(x) !== 10 && S)
    for (S = "", x = i, T = l; x < O && (s = y.charCodeAt(x), !!pn(s)); )
      x++;
  return x < O && y.charCodeAt(x) !== 10 || (h = k6(y.slice(1, d)), !h) ? !1 : (o || (typeof e.env.references > "u" && (e.env.references = {}), typeof e.env.references[h] > "u" && (e.env.references[h] = { title: S, href: a }), e.parentType = p, e.line = t + T + 1), !0);
}, b6 = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "section",
  "source",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], $n = {}, D6 = "[a-zA-Z_:][a-zA-Z0-9:._-]*", N6 = "[^\"'=<>`\\x00-\\x20]+", w6 = "'[^']*'", C6 = '"[^"]*"', A6 = "(?:" + N6 + "|" + w6 + "|" + C6 + ")", S6 = "(?:\\s+" + D6 + "(?:\\s*=\\s*" + A6 + ")?)", Fl = "<[A-Za-z][A-Za-z0-9\\-]*" + S6 + "*\\s*\\/?>", Bl = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", T6 = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->", E6 = "<[?][\\s\\S]*?[?]>", I6 = "<![A-Z]+\\s+[^>]*>", v6 = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", O6 = new RegExp("^(?:" + Fl + "|" + Bl + "|" + T6 + "|" + E6 + "|" + I6 + "|" + v6 + ")"), z6 = new RegExp("^(?:" + Fl + "|" + Bl + ")");
$n.HTML_TAG_RE = O6;
$n.HTML_OPEN_CLOSE_TAG_RE = z6;
var _6 = b6, j6 = $n.HTML_OPEN_CLOSE_TAG_RE, mt = [
  [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, !0],
  [/^<!--/, /-->/, !0],
  [/^<\?/, /\?>/, !0],
  [/^<![A-Z]/, />/, !0],
  [/^<!\[CDATA\[/, /\]\]>/, !0],
  [new RegExp("^</?(" + _6.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, !0],
  [new RegExp(j6.source + "\\s*$"), /^$/, !1]
], L6 = function(e, t, r, o) {
  var s, i, l, c, a = e.bMarks[t] + e.tShift[t], u = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(a) !== 60)
    return !1;
  for (c = e.src.slice(a, u), s = 0; s < mt.length && !mt[s][0].test(c); s++)
    ;
  if (s === mt.length)
    return !1;
  if (o)
    return mt[s][2];
  if (i = t + 1, !mt[s][1].test(c)) {
    for (; i < r && !(e.sCount[i] < e.blkIndent); i++)
      if (a = e.bMarks[i] + e.tShift[i], u = e.eMarks[i], c = e.src.slice(a, u), mt[s][1].test(c)) {
        c.length !== 0 && i++;
        break;
      }
  }
  return e.line = i, l = e.push("html_block", "", 0), l.map = [t, i], l.content = e.getLines(t, i, e.blkIndent, !0), !0;
}, Gs = _.isSpace, q6 = function(e, t, r, o) {
  var s, i, l, c, a = e.bMarks[t] + e.tShift[t], u = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || (s = e.src.charCodeAt(a), s !== 35 || a >= u))
    return !1;
  for (i = 1, s = e.src.charCodeAt(++a); s === 35 && a < u && i <= 6; )
    i++, s = e.src.charCodeAt(++a);
  return i > 6 || a < u && !Gs(s) ? !1 : (o || (u = e.skipSpacesBack(u, a), l = e.skipCharsBack(u, 35, a), l > a && Gs(e.src.charCodeAt(l - 1)) && (u = l), e.line = t + 1, c = e.push("heading_open", "h" + String(i), 1), c.markup = "########".slice(0, i), c.map = [t, e.line], c = e.push("inline", "", 0), c.content = e.src.slice(a, u).trim(), c.map = [t, e.line], c.children = [], c = e.push("heading_close", "h" + String(i), -1), c.markup = "########".slice(0, i)), !0);
}, R6 = function(e, t, r) {
  var o, s, i, l, c, a, u, f, h, d = t + 1, p, m = e.md.block.ruler.getRules("paragraph");
  if (e.sCount[t] - e.blkIndent >= 4)
    return !1;
  for (p = e.parentType, e.parentType = "paragraph"; d < r && !e.isEmpty(d); d++)
    if (!(e.sCount[d] - e.blkIndent > 3)) {
      if (e.sCount[d] >= e.blkIndent && (a = e.bMarks[d] + e.tShift[d], u = e.eMarks[d], a < u && (h = e.src.charCodeAt(a), (h === 45 || h === 61) && (a = e.skipChars(a, h), a = e.skipSpaces(a), a >= u)))) {
        f = h === 61 ? 1 : 2;
        break;
      }
      if (!(e.sCount[d] < 0)) {
        for (s = !1, i = 0, l = m.length; i < l; i++)
          if (m[i](e, d, r, !0)) {
            s = !0;
            break;
          }
        if (s)
          break;
      }
    }
  return f ? (o = e.getLines(t, d, e.blkIndent, !1).trim(), e.line = d + 1, c = e.push("heading_open", "h" + String(f), 1), c.markup = String.fromCharCode(h), c.map = [t, e.line], c = e.push("inline", "", 0), c.content = o, c.map = [t, e.line - 1], c.children = [], c = e.push("heading_close", "h" + String(f), -1), c.markup = String.fromCharCode(h), e.parentType = p, !0) : !1;
}, F6 = function(e, t, r) {
  var o, s, i, l, c, a, u = t + 1, f = e.md.block.ruler.getRules("paragraph");
  for (a = e.parentType, e.parentType = "paragraph"; u < r && !e.isEmpty(u); u++)
    if (!(e.sCount[u] - e.blkIndent > 3) && !(e.sCount[u] < 0)) {
      for (s = !1, i = 0, l = f.length; i < l; i++)
        if (f[i](e, u, r, !0)) {
          s = !0;
          break;
        }
      if (s)
        break;
    }
  return o = e.getLines(t, u, e.blkIndent, !1).trim(), e.line = u, c = e.push("paragraph_open", "p", 1), c.map = [t, e.line], c = e.push("inline", "", 0), c.content = o, c.map = [t, e.line], c.children = [], c = e.push("paragraph_close", "p", -1), e.parentType = a, !0;
}, Pl = ko, Qn = _.isSpace;
function Ae(n, e, t, r) {
  var o, s, i, l, c, a, u, f;
  for (this.src = n, this.md = e, this.env = t, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0, this.result = "", s = this.src, f = !1, i = l = a = u = 0, c = s.length; l < c; l++) {
    if (o = s.charCodeAt(l), !f)
      if (Qn(o)) {
        a++, o === 9 ? u += 4 - u % 4 : u++;
        continue;
      } else
        f = !0;
    (o === 10 || l === c - 1) && (o !== 10 && l++, this.bMarks.push(i), this.eMarks.push(l), this.tShift.push(a), this.sCount.push(u), this.bsCount.push(0), f = !1, a = 0, u = 0, i = l + 1);
  }
  this.bMarks.push(s.length), this.eMarks.push(s.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
Ae.prototype.push = function(n, e, t) {
  var r = new Pl(n, e, t);
  return r.block = !0, t < 0 && this.level--, r.level = this.level, t > 0 && this.level++, this.tokens.push(r), r;
};
Ae.prototype.isEmpty = function(e) {
  return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
};
Ae.prototype.skipEmptyLines = function(e) {
  for (var t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++)
    ;
  return e;
};
Ae.prototype.skipSpaces = function(e) {
  for (var t, r = this.src.length; e < r && (t = this.src.charCodeAt(e), !!Qn(t)); e++)
    ;
  return e;
};
Ae.prototype.skipSpacesBack = function(e, t) {
  if (e <= t)
    return e;
  for (; e > t; )
    if (!Qn(this.src.charCodeAt(--e)))
      return e + 1;
  return e;
};
Ae.prototype.skipChars = function(e, t) {
  for (var r = this.src.length; e < r && this.src.charCodeAt(e) === t; e++)
    ;
  return e;
};
Ae.prototype.skipCharsBack = function(e, t, r) {
  if (e <= r)
    return e;
  for (; e > r; )
    if (t !== this.src.charCodeAt(--e))
      return e + 1;
  return e;
};
Ae.prototype.getLines = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h = e;
  if (e >= t)
    return "";
  for (u = new Array(t - e), s = 0; h < t; h++, s++) {
    for (i = 0, f = c = this.bMarks[h], h + 1 < t || o ? a = this.eMarks[h] + 1 : a = this.eMarks[h]; c < a && i < r; ) {
      if (l = this.src.charCodeAt(c), Qn(l))
        l === 9 ? i += 4 - (i + this.bsCount[h]) % 4 : i++;
      else if (c - f < this.tShift[h])
        i++;
      else
        break;
      c++;
    }
    i > r ? u[s] = new Array(i - r + 1).join(" ") + this.src.slice(c, a) : u[s] = this.src.slice(c, a);
  }
  return u.join("");
};
Ae.prototype.Token = Pl;
var B6 = Ae, P6 = Mo, mn = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  ["table", u6, ["paragraph", "reference"]],
  ["code", f6],
  ["fence", h6, ["paragraph", "reference", "blockquote", "list"]],
  ["blockquote", p6, ["paragraph", "reference", "blockquote", "list"]],
  ["hr", g6, ["paragraph", "reference", "blockquote", "list"]],
  ["list", M6, ["paragraph", "reference", "blockquote"]],
  ["reference", x6],
  ["html_block", L6, ["paragraph", "reference", "blockquote"]],
  ["heading", q6, ["paragraph", "reference", "blockquote"]],
  ["lheading", R6],
  ["paragraph", F6]
];
function Yn() {
  this.ruler = new P6();
  for (var n = 0; n < mn.length; n++)
    this.ruler.push(mn[n][0], mn[n][1], { alt: (mn[n][2] || []).slice() });
}
Yn.prototype.tokenize = function(n, e, t) {
  for (var r, o, s, i = this.ruler.getRules(""), l = i.length, c = e, a = !1, u = n.md.options.maxNesting; c < t && (n.line = c = n.skipEmptyLines(c), !(c >= t || n.sCount[c] < n.blkIndent)); ) {
    if (n.level >= u) {
      n.line = t;
      break;
    }
    for (s = n.line, o = 0; o < l; o++)
      if (r = i[o](n, c, t, !1), r) {
        if (s >= n.line)
          throw new Error("block rule didn't increment state.line");
        break;
      }
    if (!r)
      throw new Error("none of the block rules matched");
    n.tight = !a, n.isEmpty(n.line - 1) && (a = !0), c = n.line, c < t && n.isEmpty(c) && (a = !0, c++, n.line = c);
  }
};
Yn.prototype.parse = function(n, e, t, r) {
  var o;
  n && (o = new this.State(n, e, t, r), this.tokenize(o, o.line, o.lineMax));
};
Yn.prototype.State = B6;
var U6 = Yn;
function V6(n) {
  switch (n) {
    case 10:
    case 33:
    case 35:
    case 36:
    case 37:
    case 38:
    case 42:
    case 43:
    case 45:
    case 58:
    case 60:
    case 61:
    case 62:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
var $6 = function(e, t) {
  for (var r = e.pos; r < e.posMax && !V6(e.src.charCodeAt(r)); )
    r++;
  return r === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, r)), e.pos = r, !0);
}, Q6 = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i, Y6 = function(e, t) {
  var r, o, s, i, l, c, a, u;
  return !e.md.options.linkify || e.linkLevel > 0 || (r = e.pos, o = e.posMax, r + 3 > o) || e.src.charCodeAt(r) !== 58 || e.src.charCodeAt(r + 1) !== 47 || e.src.charCodeAt(r + 2) !== 47 || (s = e.pending.match(Q6), !s) || (i = s[1], l = e.md.linkify.matchAtStart(e.src.slice(r - i.length)), !l) || (c = l.url, c.length <= i.length) || (c = c.replace(/\*+$/, ""), a = e.md.normalizeLink(c), !e.md.validateLink(a)) ? !1 : (t || (e.pending = e.pending.slice(0, -i.length), u = e.push("link_open", "a", 1), u.attrs = [["href", a]], u.markup = "linkify", u.info = "auto", u = e.push("text", "", 0), u.content = e.md.normalizeLinkText(c), u = e.push("link_close", "a", -1), u.markup = "linkify", u.info = "auto"), e.pos += c.length - i.length, !0);
}, H6 = _.isSpace, G6 = function(e, t) {
  var r, o, s, i = e.pos;
  if (e.src.charCodeAt(i) !== 10)
    return !1;
  if (r = e.pending.length - 1, o = e.posMax, !t)
    if (r >= 0 && e.pending.charCodeAt(r) === 32)
      if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
        for (s = r - 1; s >= 1 && e.pending.charCodeAt(s - 1) === 32; )
          s--;
        e.pending = e.pending.slice(0, s), e.push("hardbreak", "br", 0);
      } else
        e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
    else
      e.push("softbreak", "br", 0);
  for (i++; i < o && H6(e.src.charCodeAt(i)); )
    i++;
  return e.pos = i, !0;
}, W6 = _.isSpace, bo = [];
for (var Ws = 0; Ws < 256; Ws++)
  bo.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(n) {
  bo[n.charCodeAt(0)] = 1;
});
var J6 = function(e, t) {
  var r, o, s, i, l, c = e.pos, a = e.posMax;
  if (e.src.charCodeAt(c) !== 92 || (c++, c >= a))
    return !1;
  if (r = e.src.charCodeAt(c), r === 10) {
    for (t || e.push("hardbreak", "br", 0), c++; c < a && (r = e.src.charCodeAt(c), !!W6(r)); )
      c++;
    return e.pos = c, !0;
  }
  return i = e.src[c], r >= 55296 && r <= 56319 && c + 1 < a && (o = e.src.charCodeAt(c + 1), o >= 56320 && o <= 57343 && (i += e.src[c + 1], c++)), s = "\\" + i, t || (l = e.push("text_special", "", 0), r < 256 && bo[r] !== 0 ? l.content = i : l.content = s, l.markup = s, l.info = "escape"), e.pos = c + 1, !0;
}, Z6 = function(e, t) {
  var r, o, s, i, l, c, a, u, f = e.pos, h = e.src.charCodeAt(f);
  if (h !== 96)
    return !1;
  for (r = f, f++, o = e.posMax; f < o && e.src.charCodeAt(f) === 96; )
    f++;
  if (s = e.src.slice(r, f), a = s.length, e.backticksScanned && (e.backticks[a] || 0) <= r)
    return t || (e.pending += s), e.pos += a, !0;
  for (c = f; (l = e.src.indexOf("`", c)) !== -1; ) {
    for (c = l + 1; c < o && e.src.charCodeAt(c) === 96; )
      c++;
    if (u = c - l, u === a)
      return t || (i = e.push("code_inline", "code", 0), i.markup = s, i.content = e.src.slice(f, l).replace(/\n/g, " ").replace(/^ (.+) $/, "$1")), e.pos = c, !0;
    e.backticks[u] = l;
  }
  return e.backticksScanned = !0, t || (e.pending += s), e.pos += a, !0;
}, Hn = {};
Hn.tokenize = function(e, t) {
  var r, o, s, i, l, c = e.pos, a = e.src.charCodeAt(c);
  if (t || a !== 126 || (o = e.scanDelims(e.pos, !0), i = o.length, l = String.fromCharCode(a), i < 2))
    return !1;
  for (i % 2 && (s = e.push("text", "", 0), s.content = l, i--), r = 0; r < i; r += 2)
    s = e.push("text", "", 0), s.content = l + l, e.delimiters.push({
      marker: a,
      length: 0,
      // disable "rule of 3" length checks meant for emphasis
      token: e.tokens.length - 1,
      end: -1,
      open: o.can_open,
      close: o.can_close
    });
  return e.pos += o.length, !0;
};
function Js(n, e) {
  var t, r, o, s, i, l = [], c = e.length;
  for (t = 0; t < c; t++)
    o = e[t], o.marker === 126 && o.end !== -1 && (s = e[o.end], i = n.tokens[o.token], i.type = "s_open", i.tag = "s", i.nesting = 1, i.markup = "~~", i.content = "", i = n.tokens[s.token], i.type = "s_close", i.tag = "s", i.nesting = -1, i.markup = "~~", i.content = "", n.tokens[s.token - 1].type === "text" && n.tokens[s.token - 1].content === "~" && l.push(s.token - 1));
  for (; l.length; ) {
    for (t = l.pop(), r = t + 1; r < n.tokens.length && n.tokens[r].type === "s_close"; )
      r++;
    r--, t !== r && (i = n.tokens[r], n.tokens[r] = n.tokens[t], n.tokens[t] = i);
  }
}
Hn.postProcess = function(e) {
  var t, r = e.tokens_meta, o = e.tokens_meta.length;
  for (Js(e, e.delimiters), t = 0; t < o; t++)
    r[t] && r[t].delimiters && Js(e, r[t].delimiters);
};
var Gn = {};
Gn.tokenize = function(e, t) {
  var r, o, s, i = e.pos, l = e.src.charCodeAt(i);
  if (t || l !== 95 && l !== 42)
    return !1;
  for (o = e.scanDelims(e.pos, l === 42), r = 0; r < o.length; r++)
    s = e.push("text", "", 0), s.content = String.fromCharCode(l), e.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker: l,
      // Total length of these series of delimiters.
      //
      length: o.length,
      // A position of the token this delimiter corresponds to.
      //
      token: e.tokens.length - 1,
      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end: -1,
      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open: o.can_open,
      close: o.can_close
    });
  return e.pos += o.length, !0;
};
function Zs(n, e) {
  var t, r, o, s, i, l, c = e.length;
  for (t = c - 1; t >= 0; t--)
    r = e[t], !(r.marker !== 95 && r.marker !== 42) && r.end !== -1 && (o = e[r.end], l = t > 0 && e[t - 1].end === r.end + 1 && // check that first two markers match and adjacent
    e[t - 1].marker === r.marker && e[t - 1].token === r.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
    e[r.end + 1].token === o.token + 1, i = String.fromCharCode(r.marker), s = n.tokens[r.token], s.type = l ? "strong_open" : "em_open", s.tag = l ? "strong" : "em", s.nesting = 1, s.markup = l ? i + i : i, s.content = "", s = n.tokens[o.token], s.type = l ? "strong_close" : "em_close", s.tag = l ? "strong" : "em", s.nesting = -1, s.markup = l ? i + i : i, s.content = "", l && (n.tokens[e[t - 1].token].content = "", n.tokens[e[r.end + 1].token].content = "", t--));
}
Gn.postProcess = function(e) {
  var t, r = e.tokens_meta, o = e.tokens_meta.length;
  for (Zs(e, e.delimiters), t = 0; t < o; t++)
    r[t] && r[t].delimiters && Zs(e, r[t].delimiters);
};
var K6 = _.normalizeReference, Mr = _.isSpace, X6 = function(e, t) {
  var r, o, s, i, l, c, a, u, f, h = "", d = "", p = e.pos, m = e.posMax, g = e.pos, y = !0;
  if (e.src.charCodeAt(e.pos) !== 91 || (l = e.pos + 1, i = e.md.helpers.parseLinkLabel(e, e.pos, !0), i < 0))
    return !1;
  if (c = i + 1, c < m && e.src.charCodeAt(c) === 40) {
    for (y = !1, c++; c < m && (o = e.src.charCodeAt(c), !(!Mr(o) && o !== 10)); c++)
      ;
    if (c >= m)
      return !1;
    if (g = c, a = e.md.helpers.parseLinkDestination(e.src, c, e.posMax), a.ok) {
      for (h = e.md.normalizeLink(a.str), e.md.validateLink(h) ? c = a.pos : h = "", g = c; c < m && (o = e.src.charCodeAt(c), !(!Mr(o) && o !== 10)); c++)
        ;
      if (a = e.md.helpers.parseLinkTitle(e.src, c, e.posMax), c < m && g !== c && a.ok)
        for (d = a.str, c = a.pos; c < m && (o = e.src.charCodeAt(c), !(!Mr(o) && o !== 10)); c++)
          ;
    }
    (c >= m || e.src.charCodeAt(c) !== 41) && (y = !0), c++;
  }
  if (y) {
    if (typeof e.env.references > "u")
      return !1;
    if (c < m && e.src.charCodeAt(c) === 91 ? (g = c + 1, c = e.md.helpers.parseLinkLabel(e, c), c >= 0 ? s = e.src.slice(g, c++) : c = i + 1) : c = i + 1, s || (s = e.src.slice(l, i)), u = e.env.references[K6(s)], !u)
      return e.pos = p, !1;
    h = u.href, d = u.title;
  }
  return t || (e.pos = l, e.posMax = i, f = e.push("link_open", "a", 1), f.attrs = r = [["href", h]], d && r.push(["title", d]), e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, f = e.push("link_close", "a", -1)), e.pos = c, e.posMax = m, !0;
}, e$ = _.normalizeReference, kr = _.isSpace, t$ = function(e, t) {
  var r, o, s, i, l, c, a, u, f, h, d, p, m, g = "", y = e.pos, k = e.posMax;
  if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91 || (c = e.pos + 2, l = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1), l < 0))
    return !1;
  if (a = l + 1, a < k && e.src.charCodeAt(a) === 40) {
    for (a++; a < k && (o = e.src.charCodeAt(a), !(!kr(o) && o !== 10)); a++)
      ;
    if (a >= k)
      return !1;
    for (m = a, f = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), f.ok && (g = e.md.normalizeLink(f.str), e.md.validateLink(g) ? a = f.pos : g = ""), m = a; a < k && (o = e.src.charCodeAt(a), !(!kr(o) && o !== 10)); a++)
      ;
    if (f = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < k && m !== a && f.ok)
      for (h = f.str, a = f.pos; a < k && (o = e.src.charCodeAt(a), !(!kr(o) && o !== 10)); a++)
        ;
    else
      h = "";
    if (a >= k || e.src.charCodeAt(a) !== 41)
      return e.pos = y, !1;
    a++;
  } else {
    if (typeof e.env.references > "u")
      return !1;
    if (a < k && e.src.charCodeAt(a) === 91 ? (m = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(m, a++) : a = l + 1) : a = l + 1, i || (i = e.src.slice(c, l)), u = e.env.references[e$(i)], !u)
      return e.pos = y, !1;
    g = u.href, h = u.title;
  }
  return t || (s = e.src.slice(c, l), e.md.inline.parse(
    s,
    e.md,
    e.env,
    p = []
  ), d = e.push("image", "img", 0), d.attrs = r = [["src", g], ["alt", ""]], d.children = p, d.content = s, h && r.push(["title", h])), e.pos = a, e.posMax = k, !0;
}, n$ = /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, r$ = /^([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)$/, o$ = function(e, t) {
  var r, o, s, i, l, c, a = e.pos;
  if (e.src.charCodeAt(a) !== 60)
    return !1;
  for (l = e.pos, c = e.posMax; ; ) {
    if (++a >= c || (i = e.src.charCodeAt(a), i === 60))
      return !1;
    if (i === 62)
      break;
  }
  return r = e.src.slice(l + 1, a), r$.test(r) ? (o = e.md.normalizeLink(r), e.md.validateLink(o) ? (t || (s = e.push("link_open", "a", 1), s.attrs = [["href", o]], s.markup = "autolink", s.info = "auto", s = e.push("text", "", 0), s.content = e.md.normalizeLinkText(r), s = e.push("link_close", "a", -1), s.markup = "autolink", s.info = "auto"), e.pos += r.length + 2, !0) : !1) : n$.test(r) ? (o = e.md.normalizeLink("mailto:" + r), e.md.validateLink(o) ? (t || (s = e.push("link_open", "a", 1), s.attrs = [["href", o]], s.markup = "autolink", s.info = "auto", s = e.push("text", "", 0), s.content = e.md.normalizeLinkText(r), s = e.push("link_close", "a", -1), s.markup = "autolink", s.info = "auto"), e.pos += r.length + 2, !0) : !1) : !1;
}, s$ = $n.HTML_TAG_RE;
function i$(n) {
  return /^<a[>\s]/i.test(n);
}
function l$(n) {
  return /^<\/a\s*>/i.test(n);
}
function c$(n) {
  var e = n | 32;
  return e >= 97 && e <= 122;
}
var a$ = function(e, t) {
  var r, o, s, i, l = e.pos;
  return !e.md.options.html || (s = e.posMax, e.src.charCodeAt(l) !== 60 || l + 2 >= s) || (r = e.src.charCodeAt(l + 1), r !== 33 && r !== 63 && r !== 47 && !c$(r)) || (o = e.src.slice(l).match(s$), !o) ? !1 : (t || (i = e.push("html_inline", "", 0), i.content = o[0], i$(i.content) && e.linkLevel++, l$(i.content) && e.linkLevel--), e.pos += o[0].length, !0);
}, Ks = Ol, u$ = _.has, f$ = _.isValidEntityCode, Xs = _.fromCodePoint, h$ = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, d$ = /^&([a-z][a-z0-9]{1,31});/i, p$ = function(e, t) {
  var r, o, s, i, l = e.pos, c = e.posMax;
  if (e.src.charCodeAt(l) !== 38 || l + 1 >= c)
    return !1;
  if (r = e.src.charCodeAt(l + 1), r === 35) {
    if (s = e.src.slice(l).match(h$), s)
      return t || (o = s[1][0].toLowerCase() === "x" ? parseInt(s[1].slice(1), 16) : parseInt(s[1], 10), i = e.push("text_special", "", 0), i.content = f$(o) ? Xs(o) : Xs(65533), i.markup = s[0], i.info = "entity"), e.pos += s[0].length, !0;
  } else if (s = e.src.slice(l).match(d$), s && u$(Ks, s[1]))
    return t || (i = e.push("text_special", "", 0), i.content = Ks[s[1]], i.markup = s[0], i.info = "entity"), e.pos += s[0].length, !0;
  return !1;
};
function ei(n) {
  var e, t, r, o, s, i, l, c, a = {}, u = n.length;
  if (u) {
    var f = 0, h = -2, d = [];
    for (e = 0; e < u; e++)
      if (r = n[e], d.push(0), (n[f].marker !== r.marker || h !== r.token - 1) && (f = e), h = r.token, r.length = r.length || 0, !!r.close) {
        for (a.hasOwnProperty(r.marker) || (a[r.marker] = [-1, -1, -1, -1, -1, -1]), s = a[r.marker][(r.open ? 3 : 0) + r.length % 3], t = f - d[f] - 1, i = t; t > s; t -= d[t] + 1)
          if (o = n[t], o.marker === r.marker && o.open && o.end < 0 && (l = !1, (o.close || r.open) && (o.length + r.length) % 3 === 0 && (o.length % 3 !== 0 || r.length % 3 !== 0) && (l = !0), !l)) {
            c = t > 0 && !n[t - 1].open ? d[t - 1] + 1 : 0, d[e] = e - t + c, d[t] = c, r.open = !1, o.end = e, o.close = !1, i = -1, h = -2;
            break;
          }
        i !== -1 && (a[r.marker][(r.open ? 3 : 0) + (r.length || 0) % 3] = i);
      }
  }
}
var m$ = function(e) {
  var t, r = e.tokens_meta, o = e.tokens_meta.length;
  for (ei(e.delimiters), t = 0; t < o; t++)
    r[t] && r[t].delimiters && ei(r[t].delimiters);
}, g$ = function(e) {
  var t, r, o = 0, s = e.tokens, i = e.tokens.length;
  for (t = r = 0; t < i; t++)
    s[t].nesting < 0 && o--, s[t].level = o, s[t].nesting > 0 && o++, s[t].type === "text" && t + 1 < i && s[t + 1].type === "text" ? s[t + 1].content = s[t].content + s[t + 1].content : (t !== r && (s[r] = s[t]), r++);
  t !== r && (s.length = r);
}, Do = ko, ti = _.isWhiteSpace, ni = _.isPunctChar, ri = _.isMdAsciiPunct;
function cn(n, e, t, r) {
  this.src = n, this.env = t, this.md = e, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
cn.prototype.pushPending = function() {
  var n = new Do("text", "", 0);
  return n.content = this.pending, n.level = this.pendingLevel, this.tokens.push(n), this.pending = "", n;
};
cn.prototype.push = function(n, e, t) {
  this.pending && this.pushPending();
  var r = new Do(n, e, t), o = null;
  return t < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, t > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], o = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(o), r;
};
cn.prototype.scanDelims = function(n, e) {
  var t = n, r, o, s, i, l, c, a, u, f, h = !0, d = !0, p = this.posMax, m = this.src.charCodeAt(n);
  for (r = n > 0 ? this.src.charCodeAt(n - 1) : 32; t < p && this.src.charCodeAt(t) === m; )
    t++;
  return s = t - n, o = t < p ? this.src.charCodeAt(t) : 32, a = ri(r) || ni(String.fromCharCode(r)), f = ri(o) || ni(String.fromCharCode(o)), c = ti(r), u = ti(o), u ? h = !1 : f && (c || a || (h = !1)), c ? d = !1 : a && (u || f || (d = !1)), e ? (i = h, l = d) : (i = h && (!d || a), l = d && (!h || f)), {
    can_open: i,
    can_close: l,
    length: s
  };
};
cn.prototype.Token = Do;
var y$ = cn, oi = Mo, xr = [
  ["text", $6],
  ["linkify", Y6],
  ["newline", G6],
  ["escape", J6],
  ["backticks", Z6],
  ["strikethrough", Hn.tokenize],
  ["emphasis", Gn.tokenize],
  ["link", X6],
  ["image", t$],
  ["autolink", o$],
  ["html_inline", a$],
  ["entity", p$]
], br = [
  ["balance_pairs", m$],
  ["strikethrough", Hn.postProcess],
  ["emphasis", Gn.postProcess],
  // rules for pairs separate '**' into its own text tokens, which may be left unused,
  // rule below merges unused segments back with the rest of the text
  ["fragments_join", g$]
];
function an() {
  var n;
  for (this.ruler = new oi(), n = 0; n < xr.length; n++)
    this.ruler.push(xr[n][0], xr[n][1]);
  for (this.ruler2 = new oi(), n = 0; n < br.length; n++)
    this.ruler2.push(br[n][0], br[n][1]);
}
an.prototype.skipToken = function(n) {
  var e, t, r = n.pos, o = this.ruler.getRules(""), s = o.length, i = n.md.options.maxNesting, l = n.cache;
  if (typeof l[r] < "u") {
    n.pos = l[r];
    return;
  }
  if (n.level < i) {
    for (t = 0; t < s; t++)
      if (n.level++, e = o[t](n, !0), n.level--, e) {
        if (r >= n.pos)
          throw new Error("inline rule didn't increment state.pos");
        break;
      }
  } else
    n.pos = n.posMax;
  e || n.pos++, l[r] = n.pos;
};
an.prototype.tokenize = function(n) {
  for (var e, t, r, o = this.ruler.getRules(""), s = o.length, i = n.posMax, l = n.md.options.maxNesting; n.pos < i; ) {
    if (r = n.pos, n.level < l) {
      for (t = 0; t < s; t++)
        if (e = o[t](n, !1), e) {
          if (r >= n.pos)
            throw new Error("inline rule didn't increment state.pos");
          break;
        }
    }
    if (e) {
      if (n.pos >= i)
        break;
      continue;
    }
    n.pending += n.src[n.pos++];
  }
  n.pending && n.pushPending();
};
an.prototype.parse = function(n, e, t, r) {
  var o, s, i, l = new this.State(n, e, t, r);
  for (this.tokenize(l), s = this.ruler2.getRules(""), i = s.length, o = 0; o < i; o++)
    s[o](l);
};
an.prototype.State = y$;
var M$ = an, Dr, si;
function k$() {
  return si || (si = 1, Dr = function(n) {
    var e = {};
    n = n || {}, e.src_Any = zl().source, e.src_Cc = _l().source, e.src_Z = jl().source, e.src_P = yo.source, e.src_ZPCc = [e.src_Z, e.src_P, e.src_Cc].join("|"), e.src_ZCc = [e.src_Z, e.src_Cc].join("|");
    var t = "[><｜]";
    return e.src_pseudo_letter = "(?:(?!" + t + "|" + e.src_ZPCc + ")" + e.src_Any + ")", e.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", e.src_auth = "(?:(?:(?!" + e.src_ZCc + "|[@/\\[\\]()]).)+@)?", e.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", e.src_host_terminator = "(?=$|" + t + "|" + e.src_ZPCc + ")(?!" + (n["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + e.src_ZPCc + "))", e.src_path = "(?:[/?#](?:(?!" + e.src_ZCc + "|" + t + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + e.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + e.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + e.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + e.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + e.src_ZCc + "|[']).)+\\'|\\'(?=" + e.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + e.src_ZCc + "|[.]|$)|" + (n["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + ",(?!" + e.src_ZCc + "|$)|;(?!" + e.src_ZCc + "|$)|\\!+(?!" + e.src_ZCc + "|[!]|$)|\\?(?!" + e.src_ZCc + "|[?]|$))+|\\/)?", e.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*', e.src_xn = "xn--[a-z0-9\\-]{1,59}", e.src_domain_root = // Allow letters & digits (http://test1)
    "(?:" + e.src_xn + "|" + e.src_pseudo_letter + "{1,63})", e.src_domain = "(?:" + e.src_xn + "|(?:" + e.src_pseudo_letter + ")|(?:" + e.src_pseudo_letter + "(?:-|" + e.src_pseudo_letter + "){0,61}" + e.src_pseudo_letter + "))", e.src_host = "(?:(?:(?:(?:" + e.src_domain + ")\\.)*" + e.src_domain + "))", e.tpl_host_fuzzy = "(?:" + e.src_ip4 + "|(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%)))", e.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%))", e.src_host_strict = e.src_host + e.src_host_terminator, e.tpl_host_fuzzy_strict = e.tpl_host_fuzzy + e.src_host_terminator, e.src_host_port_strict = e.src_host + e.src_port + e.src_host_terminator, e.tpl_host_port_fuzzy_strict = e.tpl_host_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_port_no_ip_fuzzy_strict = e.tpl_host_no_ip_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + e.src_ZPCc + "|>|$))", e.tpl_email_fuzzy = "(^|" + t + '|"|\\(|' + e.src_ZCc + ")(" + e.src_email_name + "@" + e.tpl_host_fuzzy_strict + ")", e.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_fuzzy_strict + e.src_path + ")", e.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_no_ip_fuzzy_strict + e.src_path + ")", e;
  }), Dr;
}
function Wr(n) {
  var e = Array.prototype.slice.call(arguments, 1);
  return e.forEach(function(t) {
    t && Object.keys(t).forEach(function(r) {
      n[r] = t[r];
    });
  }), n;
}
function Wn(n) {
  return Object.prototype.toString.call(n);
}
function x$(n) {
  return Wn(n) === "[object String]";
}
function b$(n) {
  return Wn(n) === "[object Object]";
}
function D$(n) {
  return Wn(n) === "[object RegExp]";
}
function ii(n) {
  return Wn(n) === "[object Function]";
}
function N$(n) {
  return n.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
var Ul = {
  fuzzyLink: !0,
  fuzzyEmail: !0,
  fuzzyIP: !1
};
function w$(n) {
  return Object.keys(n || {}).reduce(function(e, t) {
    return e || Ul.hasOwnProperty(t);
  }, !1);
}
var C$ = {
  "http:": {
    validate: function(n, e, t) {
      var r = n.slice(e);
      return t.re.http || (t.re.http = new RegExp(
        "^\\/\\/" + t.re.src_auth + t.re.src_host_port_strict + t.re.src_path,
        "i"
      )), t.re.http.test(r) ? r.match(t.re.http)[0].length : 0;
    }
  },
  "https:": "http:",
  "ftp:": "http:",
  "//": {
    validate: function(n, e, t) {
      var r = n.slice(e);
      return t.re.no_http || (t.re.no_http = new RegExp(
        "^" + t.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
        // with code comments
        "(?:localhost|(?:(?:" + t.re.src_domain + ")\\.)+" + t.re.src_domain_root + ")" + t.re.src_port + t.re.src_host_terminator + t.re.src_path,
        "i"
      )), t.re.no_http.test(r) ? e >= 3 && n[e - 3] === ":" || e >= 3 && n[e - 3] === "/" ? 0 : r.match(t.re.no_http)[0].length : 0;
    }
  },
  "mailto:": {
    validate: function(n, e, t) {
      var r = n.slice(e);
      return t.re.mailto || (t.re.mailto = new RegExp(
        "^" + t.re.src_email_name + "@" + t.re.src_host_strict,
        "i"
      )), t.re.mailto.test(r) ? r.match(t.re.mailto)[0].length : 0;
    }
  }
}, A$ = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", S$ = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function T$(n) {
  n.__index__ = -1, n.__text_cache__ = "";
}
function E$(n) {
  return function(e, t) {
    var r = e.slice(t);
    return n.test(r) ? r.match(n)[0].length : 0;
  };
}
function li() {
  return function(n, e) {
    e.normalize(n);
  };
}
function zn(n) {
  var e = n.re = k$()(n.__opts__), t = n.__tlds__.slice();
  n.onCompile(), n.__tlds_replaced__ || t.push(A$), t.push(e.src_xn), e.src_tlds = t.join("|");
  function r(l) {
    return l.replace("%TLDS%", e.src_tlds);
  }
  e.email_fuzzy = RegExp(r(e.tpl_email_fuzzy), "i"), e.link_fuzzy = RegExp(r(e.tpl_link_fuzzy), "i"), e.link_no_ip_fuzzy = RegExp(r(e.tpl_link_no_ip_fuzzy), "i"), e.host_fuzzy_test = RegExp(r(e.tpl_host_fuzzy_test), "i");
  var o = [];
  n.__compiled__ = {};
  function s(l, c) {
    throw new Error('(LinkifyIt) Invalid schema "' + l + '": ' + c);
  }
  Object.keys(n.__schemas__).forEach(function(l) {
    var c = n.__schemas__[l];
    if (c !== null) {
      var a = { validate: null, link: null };
      if (n.__compiled__[l] = a, b$(c)) {
        D$(c.validate) ? a.validate = E$(c.validate) : ii(c.validate) ? a.validate = c.validate : s(l, c), ii(c.normalize) ? a.normalize = c.normalize : c.normalize ? s(l, c) : a.normalize = li();
        return;
      }
      if (x$(c)) {
        o.push(l);
        return;
      }
      s(l, c);
    }
  }), o.forEach(function(l) {
    n.__compiled__[n.__schemas__[l]] && (n.__compiled__[l].validate = n.__compiled__[n.__schemas__[l]].validate, n.__compiled__[l].normalize = n.__compiled__[n.__schemas__[l]].normalize);
  }), n.__compiled__[""] = { validate: null, normalize: li() };
  var i = Object.keys(n.__compiled__).filter(function(l) {
    return l.length > 0 && n.__compiled__[l];
  }).map(N$).join("|");
  n.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")", "i"), n.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")", "ig"), n.re.schema_at_start = RegExp("^" + n.re.schema_search.source, "i"), n.re.pretest = RegExp(
    "(" + n.re.schema_test.source + ")|(" + n.re.host_fuzzy_test.source + ")|@",
    "i"
  ), T$(n);
}
function I$(n, e) {
  var t = n.__index__, r = n.__last_index__, o = n.__text_cache__.slice(t, r);
  this.schema = n.__schema__.toLowerCase(), this.index = t + e, this.lastIndex = r + e, this.raw = o, this.text = o, this.url = o;
}
function Jr(n, e) {
  var t = new I$(n, e);
  return n.__compiled__[t.schema].normalize(t, n), t;
}
function se(n, e) {
  if (!(this instanceof se))
    return new se(n, e);
  e || w$(n) && (e = n, n = {}), this.__opts__ = Wr({}, Ul, e), this.__index__ = -1, this.__last_index__ = -1, this.__schema__ = "", this.__text_cache__ = "", this.__schemas__ = Wr({}, C$, n), this.__compiled__ = {}, this.__tlds__ = S$, this.__tlds_replaced__ = !1, this.re = {}, zn(this);
}
se.prototype.add = function(e, t) {
  return this.__schemas__[e] = t, zn(this), this;
};
se.prototype.set = function(e) {
  return this.__opts__ = Wr(this.__opts__, e), this;
};
se.prototype.test = function(e) {
  if (this.__text_cache__ = e, this.__index__ = -1, !e.length)
    return !1;
  var t, r, o, s, i, l, c, a, u;
  if (this.re.schema_test.test(e)) {
    for (c = this.re.schema_search, c.lastIndex = 0; (t = c.exec(e)) !== null; )
      if (s = this.testSchemaAt(e, t[2], c.lastIndex), s) {
        this.__schema__ = t[2], this.__index__ = t.index + t[1].length, this.__last_index__ = t.index + t[0].length + s;
        break;
      }
  }
  return this.__opts__.fuzzyLink && this.__compiled__["http:"] && (a = e.search(this.re.host_fuzzy_test), a >= 0 && (this.__index__ < 0 || a < this.__index__) && (r = e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null && (i = r.index + r[1].length, (this.__index__ < 0 || i < this.__index__) && (this.__schema__ = "", this.__index__ = i, this.__last_index__ = r.index + r[0].length))), this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && (u = e.indexOf("@"), u >= 0 && (o = e.match(this.re.email_fuzzy)) !== null && (i = o.index + o[1].length, l = o.index + o[0].length, (this.__index__ < 0 || i < this.__index__ || i === this.__index__ && l > this.__last_index__) && (this.__schema__ = "mailto:", this.__index__ = i, this.__last_index__ = l))), this.__index__ >= 0;
};
se.prototype.pretest = function(e) {
  return this.re.pretest.test(e);
};
se.prototype.testSchemaAt = function(e, t, r) {
  return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, r, this) : 0;
};
se.prototype.match = function(e) {
  var t = 0, r = [];
  this.__index__ >= 0 && this.__text_cache__ === e && (r.push(Jr(this, t)), t = this.__last_index__);
  for (var o = t ? e.slice(t) : e; this.test(o); )
    r.push(Jr(this, t)), o = o.slice(this.__last_index__), t += this.__last_index__;
  return r.length ? r : null;
};
se.prototype.matchAtStart = function(e) {
  if (this.__text_cache__ = e, this.__index__ = -1, !e.length)
    return null;
  var t = this.re.schema_at_start.exec(e);
  if (!t)
    return null;
  var r = this.testSchemaAt(e, t[2], t[0].length);
  return r ? (this.__schema__ = t[2], this.__index__ = t.index + t[1].length, this.__last_index__ = t.index + t[0].length + r, Jr(this, 0)) : null;
};
se.prototype.tlds = function(e, t) {
  return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(r, o, s) {
    return r !== s[o - 1];
  }).reverse(), zn(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, zn(this), this);
};
se.prototype.normalize = function(e) {
  e.schema || (e.url = "http://" + e.url), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = "mailto:" + e.url);
};
se.prototype.onCompile = function() {
};
var v$ = se;
const Nt = 2147483647, be = 36, No = 1, tn = 26, O$ = 38, z$ = 700, Vl = 72, $l = 128, Ql = "-", _$ = /^xn--/, j$ = /[^\0-\x7F]/, L$ = /[\x2E\u3002\uFF0E\uFF61]/g, q$ = {
  overflow: "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
}, Nr = be - No, De = Math.floor, wr = String.fromCharCode;
function Re(n) {
  throw new RangeError(q$[n]);
}
function R$(n, e) {
  const t = [];
  let r = n.length;
  for (; r--; )
    t[r] = e(n[r]);
  return t;
}
function Yl(n, e) {
  const t = n.split("@");
  let r = "";
  t.length > 1 && (r = t[0] + "@", n = t[1]), n = n.replace(L$, ".");
  const o = n.split("."), s = R$(o, e).join(".");
  return r + s;
}
function wo(n) {
  const e = [];
  let t = 0;
  const r = n.length;
  for (; t < r; ) {
    const o = n.charCodeAt(t++);
    if (o >= 55296 && o <= 56319 && t < r) {
      const s = n.charCodeAt(t++);
      (s & 64512) == 56320 ? e.push(((o & 1023) << 10) + (s & 1023) + 65536) : (e.push(o), t--);
    } else
      e.push(o);
  }
  return e;
}
const Hl = (n) => String.fromCodePoint(...n), F$ = function(n) {
  return n >= 48 && n < 58 ? 26 + (n - 48) : n >= 65 && n < 91 ? n - 65 : n >= 97 && n < 123 ? n - 97 : be;
}, ci = function(n, e) {
  return n + 22 + 75 * (n < 26) - ((e != 0) << 5);
}, Gl = function(n, e, t) {
  let r = 0;
  for (n = t ? De(n / z$) : n >> 1, n += De(n / e); n > Nr * tn >> 1; r += be)
    n = De(n / Nr);
  return De(r + (Nr + 1) * n / (n + O$));
}, Co = function(n) {
  const e = [], t = n.length;
  let r = 0, o = $l, s = Vl, i = n.lastIndexOf(Ql);
  i < 0 && (i = 0);
  for (let l = 0; l < i; ++l)
    n.charCodeAt(l) >= 128 && Re("not-basic"), e.push(n.charCodeAt(l));
  for (let l = i > 0 ? i + 1 : 0; l < t; ) {
    const c = r;
    for (let u = 1, f = be; ; f += be) {
      l >= t && Re("invalid-input");
      const h = F$(n.charCodeAt(l++));
      h >= be && Re("invalid-input"), h > De((Nt - r) / u) && Re("overflow"), r += h * u;
      const d = f <= s ? No : f >= s + tn ? tn : f - s;
      if (h < d)
        break;
      const p = be - d;
      u > De(Nt / p) && Re("overflow"), u *= p;
    }
    const a = e.length + 1;
    s = Gl(r - c, a, c == 0), De(r / a) > Nt - o && Re("overflow"), o += De(r / a), r %= a, e.splice(r++, 0, o);
  }
  return String.fromCodePoint(...e);
}, Ao = function(n) {
  const e = [];
  n = wo(n);
  const t = n.length;
  let r = $l, o = 0, s = Vl;
  for (const c of n)
    c < 128 && e.push(wr(c));
  const i = e.length;
  let l = i;
  for (i && e.push(Ql); l < t; ) {
    let c = Nt;
    for (const u of n)
      u >= r && u < c && (c = u);
    const a = l + 1;
    c - r > De((Nt - o) / a) && Re("overflow"), o += (c - r) * a, r = c;
    for (const u of n)
      if (u < r && ++o > Nt && Re("overflow"), u === r) {
        let f = o;
        for (let h = be; ; h += be) {
          const d = h <= s ? No : h >= s + tn ? tn : h - s;
          if (f < d)
            break;
          const p = f - d, m = be - d;
          e.push(
            wr(ci(d + p % m, 0))
          ), f = De(p / m);
        }
        e.push(wr(ci(f, 0))), s = Gl(o, a, l === i), o = 0, ++l;
      }
    ++o, ++r;
  }
  return e.join("");
}, Wl = function(n) {
  return Yl(n, function(e) {
    return _$.test(e) ? Co(e.slice(4).toLowerCase()) : e;
  });
}, Jl = function(n) {
  return Yl(n, function(e) {
    return j$.test(e) ? "xn--" + Ao(e) : e;
  });
}, B$ = {
  /**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
  version: "2.3.1",
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
  ucs2: {
    decode: wo,
    encode: Hl
  },
  decode: Co,
  encode: Ao,
  toASCII: Jl,
  toUnicode: Wl
}, P$ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: Co,
  default: B$,
  encode: Ao,
  toASCII: Jl,
  toUnicode: Wl,
  ucs2decode: wo,
  ucs2encode: Hl
}, Symbol.toStringTag, { value: "Module" })), U$ = /* @__PURE__ */ Ju(P$);
var V$ = {
  options: {
    html: !1,
    // Enable HTML tags in source
    xhtmlOut: !1,
    // Use '/' to close single tags (<br />)
    breaks: !1,
    // Convert '\n' in paragraphs into <br>
    langPrefix: "language-",
    // CSS language prefix for fenced blocks
    linkify: !1,
    // autoconvert URL-like texts to links
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    maxNesting: 100
    // Internal protection, recursion limit
  },
  components: {
    core: {},
    block: {},
    inline: {}
  }
}, $$ = {
  options: {
    html: !1,
    // Enable HTML tags in source
    xhtmlOut: !1,
    // Use '/' to close single tags (<br />)
    breaks: !1,
    // Convert '\n' in paragraphs into <br>
    langPrefix: "language-",
    // CSS language prefix for fenced blocks
    linkify: !1,
    // autoconvert URL-like texts to links
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    maxNesting: 20
    // Internal protection, recursion limit
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "text"
      ],
      rules2: [
        "balance_pairs",
        "fragments_join"
      ]
    }
  }
}, Q$ = {
  options: {
    html: !0,
    // Enable HTML tags in source
    xhtmlOut: !0,
    // Use '/' to close single tags (<br />)
    breaks: !1,
    // Convert '\n' in paragraphs into <br>
    langPrefix: "language-",
    // CSS language prefix for fenced blocks
    linkify: !1,
    // autoconvert URL-like texts to links
    // Enable some language-neutral replacements + quotes beautification
    typographer: !1,
    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: "“”‘’",
    /* “”‘’ */
    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,
    maxNesting: 20
    // Internal protection, recursion limit
  },
  components: {
    core: {
      rules: [
        "normalize",
        "block",
        "inline",
        "text_join"
      ]
    },
    block: {
      rules: [
        "blockquote",
        "code",
        "fence",
        "heading",
        "hr",
        "html_block",
        "lheading",
        "list",
        "reference",
        "paragraph"
      ]
    },
    inline: {
      rules: [
        "autolink",
        "backticks",
        "emphasis",
        "entity",
        "escape",
        "html_inline",
        "image",
        "link",
        "newline",
        "text"
      ],
      rules2: [
        "balance_pairs",
        "emphasis",
        "fragments_join"
      ]
    }
  }
}, Qt = _, Y$ = Vn, H$ = F8, G$ = a6, W$ = U6, J$ = M$, Z$ = v$, rt = Ot, Zl = U$, K$ = {
  default: V$,
  zero: $$,
  commonmark: Q$
}, X$ = /^(vbscript|javascript|file|data):/, eQ = /^data:image\/(gif|png|jpeg|webp);/;
function tQ(n) {
  var e = n.trim().toLowerCase();
  return X$.test(e) ? !!eQ.test(e) : !0;
}
var Kl = ["http:", "https:", "mailto:"];
function nQ(n) {
  var e = rt.parse(n, !0);
  if (e.hostname && (!e.protocol || Kl.indexOf(e.protocol) >= 0))
    try {
      e.hostname = Zl.toASCII(e.hostname);
    } catch {
    }
  return rt.encode(rt.format(e));
}
function rQ(n) {
  var e = rt.parse(n, !0);
  if (e.hostname && (!e.protocol || Kl.indexOf(e.protocol) >= 0))
    try {
      e.hostname = Zl.toUnicode(e.hostname);
    } catch {
    }
  return rt.decode(rt.format(e), rt.decode.defaultChars + "%");
}
function he(n, e) {
  if (!(this instanceof he))
    return new he(n, e);
  e || Qt.isString(n) || (e = n || {}, n = "default"), this.inline = new J$(), this.block = new W$(), this.core = new G$(), this.renderer = new H$(), this.linkify = new Z$(), this.validateLink = tQ, this.normalizeLink = nQ, this.normalizeLinkText = rQ, this.utils = Qt, this.helpers = Qt.assign({}, Y$), this.options = {}, this.configure(n), e && this.set(e);
}
he.prototype.set = function(n) {
  return Qt.assign(this.options, n), this;
};
he.prototype.configure = function(n) {
  var e = this, t;
  if (Qt.isString(n) && (t = n, n = K$[t], !n))
    throw new Error('Wrong `markdown-it` preset "' + t + '", check name');
  if (!n)
    throw new Error("Wrong `markdown-it` preset, can't be empty");
  return n.options && e.set(n.options), n.components && Object.keys(n.components).forEach(function(r) {
    n.components[r].rules && e[r].ruler.enableOnly(n.components[r].rules), n.components[r].rules2 && e[r].ruler2.enableOnly(n.components[r].rules2);
  }), this;
};
he.prototype.enable = function(n, e) {
  var t = [];
  Array.isArray(n) || (n = [n]), ["core", "block", "inline"].forEach(function(o) {
    t = t.concat(this[o].ruler.enable(n, !0));
  }, this), t = t.concat(this.inline.ruler2.enable(n, !0));
  var r = n.filter(function(o) {
    return t.indexOf(o) < 0;
  });
  if (r.length && !e)
    throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + r);
  return this;
};
he.prototype.disable = function(n, e) {
  var t = [];
  Array.isArray(n) || (n = [n]), ["core", "block", "inline"].forEach(function(o) {
    t = t.concat(this[o].ruler.disable(n, !0));
  }, this), t = t.concat(this.inline.ruler2.disable(n, !0));
  var r = n.filter(function(o) {
    return t.indexOf(o) < 0;
  });
  if (r.length && !e)
    throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + r);
  return this;
};
he.prototype.use = function(n) {
  var e = [this].concat(Array.prototype.slice.call(arguments, 1));
  return n.apply(n, e), this;
};
he.prototype.parse = function(n, e) {
  if (typeof n != "string")
    throw new Error("Input data should be a String");
  var t = new this.core.State(n, this, e);
  return this.core.process(t), t.tokens;
};
he.prototype.render = function(n, e) {
  return e = e || {}, this.renderer.render(this.parse(n, e), this.options, e);
};
he.prototype.parseInline = function(n, e) {
  var t = new this.core.State(n, this, e);
  return t.inlineMode = !0, this.core.process(t), t.tokens;
};
he.prototype.renderInline = function(n, e) {
  return e = e || {}, this.renderer.render(this.parseInline(n, e), this.options, e);
};
var oQ = he, sQ = oQ;
const iQ = /* @__PURE__ */ Wu(sQ), lQ = new ji({
  nodes: {
    doc: {
      content: "block+"
    },
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM() {
        return ["p", 0];
      }
    },
    blockquote: {
      content: "block+",
      group: "block",
      parseDOM: [{ tag: "blockquote" }],
      toDOM() {
        return ["blockquote", 0];
      }
    },
    horizontal_rule: {
      group: "block",
      parseDOM: [{ tag: "hr" }],
      toDOM() {
        return ["div", ["hr"]];
      }
    },
    heading: {
      attrs: { level: { default: 1 } },
      content: "(text | image)*",
      group: "block",
      defining: !0,
      parseDOM: [
        { tag: "h1", attrs: { level: 1 } },
        { tag: "h2", attrs: { level: 2 } },
        { tag: "h3", attrs: { level: 3 } },
        { tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } },
        { tag: "h6", attrs: { level: 6 } }
      ],
      toDOM(n) {
        return ["h" + n.attrs.level, 0];
      }
    },
    code_block: {
      content: "text*",
      group: "block",
      code: !0,
      defining: !0,
      marks: "",
      attrs: { params: { default: "" } },
      parseDOM: [{ tag: "pre", preserveWhitespace: "full", getAttrs: (n) => ({ params: n.getAttribute("data-params") || "" }) }],
      toDOM(n) {
        return ["pre", n.attrs.params ? { "data-params": n.attrs.params } : {}, ["code", 0]];
      }
    },
    ordered_list: {
      content: "list_item+",
      group: "block",
      attrs: { order: { default: 1 }, tight: { default: !1 } },
      parseDOM: [{ tag: "ol", getAttrs(n) {
        return {
          order: n.hasAttribute("start") ? +n.getAttribute("start") : 1,
          tight: n.hasAttribute("data-tight")
        };
      } }],
      toDOM(n) {
        return ["ol", {
          start: n.attrs.order == 1 ? null : n.attrs.order,
          "data-tight": n.attrs.tight ? "true" : null
        }, 0];
      }
    },
    bullet_list: {
      content: "list_item+",
      group: "block",
      attrs: { tight: { default: !1 } },
      parseDOM: [{ tag: "ul", getAttrs: (n) => ({ tight: n.hasAttribute("data-tight") }) }],
      toDOM(n) {
        return ["ul", { "data-tight": n.attrs.tight ? "true" : null }, 0];
      }
    },
    list_item: {
      content: "block+",
      defining: !0,
      parseDOM: [{ tag: "li" }],
      toDOM() {
        return ["li", 0];
      }
    },
    text: {
      group: "inline"
    },
    image: {
      inline: !0,
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null }
      },
      group: "inline",
      draggable: !0,
      parseDOM: [{ tag: "img[src]", getAttrs(n) {
        return {
          src: n.getAttribute("src"),
          title: n.getAttribute("title"),
          alt: n.getAttribute("alt")
        };
      } }],
      toDOM(n) {
        return ["img", n.attrs];
      }
    },
    hard_break: {
      inline: !0,
      group: "inline",
      selectable: !1,
      parseDOM: [{ tag: "br" }],
      toDOM() {
        return ["br"];
      }
    }
  },
  marks: {
    em: {
      parseDOM: [
        { tag: "i" },
        { tag: "em" },
        { style: "font-style=italic" },
        { style: "font-style=normal", clearMark: (n) => n.type.name == "em" }
      ],
      toDOM() {
        return ["em"];
      }
    },
    strong: {
      parseDOM: [
        { tag: "strong" },
        { tag: "b", getAttrs: (n) => n.style.fontWeight != "normal" && null },
        { style: "font-weight=400", clearMark: (n) => n.type.name == "strong" },
        { style: "font-weight", getAttrs: (n) => /^(bold(er)?|[5-9]\d{2,})$/.test(n) && null }
      ],
      toDOM() {
        return ["strong"];
      }
    },
    link: {
      attrs: {
        href: {},
        title: { default: null }
      },
      inclusive: !1,
      parseDOM: [{ tag: "a[href]", getAttrs(n) {
        return { href: n.getAttribute("href"), title: n.getAttribute("title") };
      } }],
      toDOM(n) {
        return ["a", n.attrs];
      }
    },
    code: {
      parseDOM: [{ tag: "code" }],
      toDOM() {
        return ["code"];
      }
    }
  }
});
function cQ(n, e) {
  if (n.isText && e.isText && v.sameSet(n.marks, e.marks))
    return n.withText(n.text + e.text);
}
class aQ {
  constructor(e, t) {
    this.schema = e, this.tokenHandlers = t, this.stack = [{ type: e.topNodeType, attrs: null, content: [], marks: v.none }];
  }
  top() {
    return this.stack[this.stack.length - 1];
  }
  push(e) {
    this.stack.length && this.top().content.push(e);
  }
  // Adds the given text to the current position in the document,
  // using the current marks as styling.
  addText(e) {
    if (!e)
      return;
    let t = this.top(), r = t.content, o = r[r.length - 1], s = this.schema.text(e, t.marks), i;
    o && (i = cQ(o, s)) ? r[r.length - 1] = i : r.push(s);
  }
  // Adds the given mark to the set of active marks.
  openMark(e) {
    let t = this.top();
    t.marks = e.addToSet(t.marks);
  }
  // Removes the given mark from the set of active marks.
  closeMark(e) {
    let t = this.top();
    t.marks = e.removeFromSet(t.marks);
  }
  parseTokens(e) {
    for (let t = 0; t < e.length; t++) {
      let r = e[t], o = this.tokenHandlers[r.type];
      if (!o)
        throw new Error("Token type `" + r.type + "` not supported by Markdown parser");
      o(this, r, e, t);
    }
  }
  // Add a node at the current position.
  addNode(e, t, r) {
    let o = this.top(), s = e.createAndFill(t, r, o ? o.marks : []);
    return s ? (this.push(s), s) : null;
  }
  // Wrap subsequent content in a node of the given type.
  openNode(e, t) {
    this.stack.push({ type: e, attrs: t, content: [], marks: v.none });
  }
  // Close and return the node that is currently on top of the stack.
  closeNode() {
    let e = this.stack.pop();
    return this.addNode(e.type, e.attrs, e.content);
  }
}
function qt(n, e, t, r) {
  return n.getAttrs ? n.getAttrs(e, t, r) : n.attrs instanceof Function ? n.attrs(e) : n.attrs;
}
function Cr(n, e) {
  return n.noCloseToken || e == "code_inline" || e == "code_block" || e == "fence";
}
function ai(n) {
  return n[n.length - 1] == `
` ? n.slice(0, n.length - 1) : n;
}
function Ar() {
}
function uQ(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in e) {
    let o = e[r];
    if (o.block) {
      let s = n.nodeType(o.block);
      Cr(o, r) ? t[r] = (i, l, c, a) => {
        i.openNode(s, qt(o, l, c, a)), i.addText(ai(l.content)), i.closeNode();
      } : (t[r + "_open"] = (i, l, c, a) => i.openNode(s, qt(o, l, c, a)), t[r + "_close"] = (i) => i.closeNode());
    } else if (o.node) {
      let s = n.nodeType(o.node);
      t[r] = (i, l, c, a) => i.addNode(s, qt(o, l, c, a));
    } else if (o.mark) {
      let s = n.marks[o.mark];
      Cr(o, r) ? t[r] = (i, l, c, a) => {
        i.openMark(s.create(qt(o, l, c, a))), i.addText(ai(l.content)), i.closeMark(s);
      } : (t[r + "_open"] = (i, l, c, a) => i.openMark(s.create(qt(o, l, c, a))), t[r + "_close"] = (i) => i.closeMark(s));
    } else if (o.ignore)
      Cr(o, r) ? t[r] = Ar : (t[r + "_open"] = Ar, t[r + "_close"] = Ar);
    else
      throw new RangeError("Unrecognized parsing spec " + JSON.stringify(o));
  }
  return t.text = (r, o) => r.addText(o.content), t.inline = (r, o) => r.parseTokens(o.children), t.softbreak = t.softbreak || ((r) => r.addText(" ")), t;
}
class fQ {
  /**
  Create a parser with the given configuration. You can configure
  the markdown-it parser to parse the dialect you want, and provide
  a description of the ProseMirror entities those tokens map to in
  the `tokens` object, which maps token names to descriptions of
  what to do with them. Such a description is an object, and may
  have the following properties:
  */
  constructor(e, t, r) {
    this.schema = e, this.tokenizer = t, this.tokens = r, this.tokenHandlers = uQ(e, r);
  }
  /**
  Parse a string as [CommonMark](http://commonmark.org/) markup,
  and create a ProseMirror document as prescribed by this parser's
  rules.
  
  The second argument, when given, is passed through to the
  [Markdown
  parser](https://markdown-it.github.io/markdown-it/#MarkdownIt.parse).
  */
  parse(e, t = {}) {
    let r = new aQ(this.schema, this.tokenHandlers), o;
    r.parseTokens(this.tokenizer.parse(e, t));
    do
      o = r.closeNode();
    while (r.stack.length);
    return o || this.schema.topNodeType.createAndFill();
  }
}
function ui(n, e) {
  for (; ++e < n.length; )
    if (n[e].type != "list_item_open")
      return n[e].hidden;
  return !1;
}
new fQ(lQ, iQ("commonmark", { html: !1 }), {
  blockquote: { block: "blockquote" },
  paragraph: { block: "paragraph" },
  list_item: { block: "list_item" },
  bullet_list: { block: "bullet_list", getAttrs: (n, e, t) => ({ tight: ui(e, t) }) },
  ordered_list: { block: "ordered_list", getAttrs: (n, e, t) => ({
    order: +n.attrGet("start") || 1,
    tight: ui(e, t)
  }) },
  heading: { block: "heading", getAttrs: (n) => ({ level: +n.tag.slice(1) }) },
  code_block: { block: "code_block", noCloseToken: !0 },
  fence: { block: "code_block", getAttrs: (n) => ({ params: n.info || "" }), noCloseToken: !0 },
  hr: { node: "horizontal_rule" },
  image: { node: "image", getAttrs: (n) => ({
    src: n.attrGet("src"),
    title: n.attrGet("title") || null,
    alt: n.children[0] && n.children[0].content || null
  }) },
  hardbreak: { node: "hard_break" },
  em: { mark: "em" },
  strong: { mark: "strong" },
  link: { mark: "link", getAttrs: (n) => ({
    href: n.attrGet("href"),
    title: n.attrGet("title") || null
  }) },
  code_inline: { mark: "code", noCloseToken: !0 }
});
class hQ {
  /**
  Construct a serializer with the given configuration. The `nodes`
  object should map node names in a given schema to function that
  take a serializer state and such a node, and serialize the node.
  */
  constructor(e, t, r = {}) {
    this.nodes = e, this.marks = t, this.options = r;
  }
  /**
  Serialize the content of the given node to
  [CommonMark](http://commonmark.org/).
  */
  serialize(e, t = {}) {
    t = Object.assign({}, this.options, t);
    let r = new dQ(this.nodes, this.marks, t);
    return r.renderContent(e), r.out;
  }
}
class dQ {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.nodes = e, this.marks = t, this.options = r, this.delim = "", this.out = "", this.closed = null, this.inAutolink = void 0, this.atBlockStart = !1, this.inTightList = !1, typeof this.options.tightLists > "u" && (this.options.tightLists = !1), typeof this.options.hardBreakNodeName > "u" && (this.options.hardBreakNodeName = "hard_break");
  }
  /**
  @internal
  */
  flushClose(e = 2) {
    if (this.closed) {
      if (this.atBlank() || (this.out += `
`), e > 1) {
        let t = this.delim, r = /\s+$/.exec(t);
        r && (t = t.slice(0, t.length - r[0].length));
        for (let o = 1; o < e; o++)
          this.out += t + `
`;
      }
      this.closed = null;
    }
  }
  /**
  Render a block, prefixing each line with `delim`, and the first
  line in `firstDelim`. `node` should be the node that is closed at
  the end of the block, and `f` is a function that renders the
  content of the block.
  */
  wrapBlock(e, t, r, o) {
    let s = this.delim;
    this.write(t ?? e), this.delim += e, o(), this.delim = s, this.closeBlock(r);
  }
  /**
  @internal
  */
  atBlank() {
    return /(^|\n)$/.test(this.out);
  }
  /**
  Ensure the current content ends with a newline.
  */
  ensureNewLine() {
    this.atBlank() || (this.out += `
`);
  }
  /**
  Prepare the state for writing output (closing closed paragraphs,
  adding delimiters, and so on), and then optionally add content
  (unescaped) to the output.
  */
  write(e) {
    this.flushClose(), this.delim && this.atBlank() && (this.out += this.delim), e && (this.out += e);
  }
  /**
  Close the block for the given node.
  */
  closeBlock(e) {
    this.closed = e;
  }
  /**
  Add the given text to the document. When escape is not `false`,
  it will be escaped.
  */
  text(e, t = !0) {
    let r = e.split(`
`);
    for (let o = 0; o < r.length; o++)
      this.write(), !t && r[o][0] == "[" && /(^|[^\\])\!$/.test(this.out) && (this.out = this.out.slice(0, this.out.length - 1) + "\\!"), this.out += t ? this.esc(r[o], this.atBlockStart) : r[o], o != r.length - 1 && (this.out += `
`);
  }
  /**
  Render the given node as a block.
  */
  render(e, t, r) {
    if (typeof t == "number")
      throw new Error("!");
    if (!this.nodes[e.type.name])
      throw new Error("Token type `" + e.type.name + "` not supported by Markdown renderer");
    this.nodes[e.type.name](this, e, t, r);
  }
  /**
  Render the contents of `parent` as block nodes.
  */
  renderContent(e) {
    e.forEach((t, r, o) => this.render(t, e, o));
  }
  /**
  Render the contents of `parent` as inline content.
  */
  renderInline(e) {
    this.atBlockStart = !0;
    let t = [], r = "", o = (s, i, l) => {
      let c = s ? s.marks : [];
      s && s.type.name === this.options.hardBreakNodeName && (c = c.filter((p) => {
        if (l + 1 == e.childCount)
          return !1;
        let m = e.child(l + 1);
        return p.isInSet(m.marks) && (!m.isText || /\S/.test(m.text));
      }));
      let a = r;
      if (r = "", s && s.isText && c.some((p) => {
        let m = this.marks[p.type.name];
        return m && m.expelEnclosingWhitespace && !p.isInSet(t);
      })) {
        let [p, m, g] = /^(\s*)(.*)$/m.exec(s.text);
        m && (a += m, s = g ? s.withText(g) : null, s || (c = t));
      }
      if (s && s.isText && c.some((p) => {
        let m = this.marks[p.type.name];
        return m && m.expelEnclosingWhitespace && (l == e.childCount - 1 || !p.isInSet(e.child(l + 1).marks));
      })) {
        let [p, m, g] = /^(.*?)(\s*)$/m.exec(s.text);
        g && (r = g, s = m ? s.withText(m) : null, s || (c = t));
      }
      let u = c.length ? c[c.length - 1] : null, f = u && this.marks[u.type.name].escape === !1, h = c.length - (f ? 1 : 0);
      e:
        for (let p = 0; p < h; p++) {
          let m = c[p];
          if (!this.marks[m.type.name].mixable)
            break;
          for (let g = 0; g < t.length; g++) {
            let y = t[g];
            if (!this.marks[y.type.name].mixable)
              break;
            if (m.eq(y)) {
              p > g ? c = c.slice(0, g).concat(m).concat(c.slice(g, p)).concat(c.slice(p + 1, h)) : g > p && (c = c.slice(0, p).concat(c.slice(p + 1, g)).concat(m).concat(c.slice(g, h)));
              continue e;
            }
          }
        }
      let d = 0;
      for (; d < Math.min(t.length, h) && c[d].eq(t[d]); )
        ++d;
      for (; d < t.length; )
        this.text(this.markString(t.pop(), !1, e, l), !1);
      if (a && this.text(a), s) {
        for (; t.length < h; ) {
          let p = c[t.length];
          t.push(p), this.text(this.markString(p, !0, e, l), !1), this.atBlockStart = !1;
        }
        f && s.isText ? this.text(this.markString(u, !0, e, l) + s.text + this.markString(u, !1, e, l + 1), !1) : this.render(s, e, l), this.atBlockStart = !1;
      }
      s != null && s.isText && s.nodeSize > 0 && (this.atBlockStart = !1);
    };
    e.forEach(o), o(null, 0, e.childCount), this.atBlockStart = !1;
  }
  /**
  Render a node's content as a list. `delim` should be the extra
  indentation added to all lines except the first in an item,
  `firstDelim` is a function going from an item index to a
  delimiter for the first line of the item.
  */
  renderList(e, t, r) {
    this.closed && this.closed.type == e.type ? this.flushClose(3) : this.inTightList && this.flushClose(1);
    let o = typeof e.attrs.tight < "u" ? e.attrs.tight : this.options.tightLists, s = this.inTightList;
    this.inTightList = o, e.forEach((i, l, c) => {
      c && o && this.flushClose(1), this.wrapBlock(t, r(c), e, () => this.render(i, e, c));
    }), this.inTightList = s;
  }
  /**
  Escape the given string so that it can safely appear in Markdown
  content. If `startOfLine` is true, also escape characters that
  have special meaning only at the start of the line.
  */
  esc(e, t = !1) {
    return e = e.replace(/[`*\\~\[\]_]/g, (r, o) => r == "_" && o > 0 && o + 1 < e.length && e[o - 1].match(/\w/) && e[o + 1].match(/\w/) ? r : "\\" + r), t && (e = e.replace(/^[\-*+>]/, "\\$&").replace(/^(\s*)(#{1,6})(\s|$)/, "$1\\$2$3").replace(/^(\s*\d+)\.\s/, "$1\\. ")), this.options.escapeExtraCharacters && (e = e.replace(this.options.escapeExtraCharacters, "\\$&")), e;
  }
  /**
  @internal
  */
  quote(e) {
    let t = e.indexOf('"') == -1 ? '""' : e.indexOf("'") == -1 ? "''" : "()";
    return t[0] + e + t[1];
  }
  /**
  Repeat the given string `n` times.
  */
  repeat(e, t) {
    let r = "";
    for (let o = 0; o < t; o++)
      r += e;
    return r;
  }
  /**
  Get the markdown string for a given opening or closing mark.
  */
  markString(e, t, r, o) {
    let s = this.marks[e.type.name], i = t ? s.open : s.close;
    return typeof i == "string" ? i : i(this, e, r, o);
  }
  /**
  Get leading and trailing whitespace from a string. Values of
  leading or trailing property of the return object will be undefined
  if there is no match.
  */
  getEnclosingWhitespace(e) {
    return {
      leading: (e.match(/^(\s+)/) || [void 0])[0],
      trailing: (e.match(/(\s+)$/) || [void 0])[0]
    };
  }
}
const pQ = "link", mQ = {
  attrs: {
    href: {},
    title: { default: null }
  },
  inclusive: !1,
  parseDOM: [
    {
      tag: "a[href]",
      getAttrs(n) {
        return {
          href: n.getAttribute("href"),
          title: n.getAttribute("title")
        };
      }
    }
  ],
  toDOM(n) {
    return ["a", n.attrs];
  }
}, gQ = {
  open(n, e, t, r) {
    return n.inEmail = yQ(e, t, r), n.inEmail ? "<" : "[";
  },
  close(n, e, t, r) {
    const { inEmail: o } = n;
    return n.inEmail = void 0, o ? ">" : "](" + e.attrs.href.replace(/[()"]/g, "\\$&") + (e.attrs.title ? ` "${e.attrs.title.replace(/"/g, '\\"')}"` : "") + ")";
  },
  mixable: !0
};
function yQ(n, e, t) {
  if (!n.attrs.href.startsWith("mailto:"))
    return !1;
  const r = e.child(t).text;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    r
  );
}
const MQ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: pQ,
  schema: mQ,
  serializerSpec: gQ
}, Symbol.toStringTag, { value: "Module" })), Xl = [MQ];
class Je {
  // :: (RegExp, union<string, (state: EditorState, match: [string], start: number, end: number) → ?Transaction>)
  /**
  Create an input rule. The rule applies when the user typed
  something and the text directly in front of the cursor matches
  `match`, which should end with `$`.
  
  The `handler` can be a string, in which case the matched text, or
  the first matched group in the regexp, is replaced by that
  string.
  
  Or a it can be a function, which will be called with the match
  array produced by
  [`RegExp.exec`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec),
  as well as the start and end of the matched range, and which can
  return a [transaction](https://prosemirror.net/docs/ref/#state.Transaction) that describes the
  rule's effect, or null to indicate the input was not handled.
  */
  constructor(e, t, r = {}) {
    this.match = e, this.match = e, this.handler = typeof t == "string" ? kQ(t) : t, this.undoable = r.undoable !== !1;
  }
}
function kQ(n) {
  return function(e, t, r, o) {
    let s = n;
    if (t[1]) {
      let i = t[0].lastIndexOf(t[1]);
      s += t[0].slice(i + t[1].length), r += i;
      let l = r - o;
      l > 0 && (s = t[0].slice(i - l, i) + s, r = o);
    }
    return e.tr.insertText(s, r, o);
  };
}
const xQ = 500;
function ec({ rules: n }) {
  let e = new ze({
    state: {
      init() {
        return null;
      },
      apply(t, r) {
        let o = t.getMeta(this);
        return o || (t.selectionSet || t.docChanged ? null : r);
      }
    },
    props: {
      handleTextInput(t, r, o, s) {
        return fi(t, r, o, s, n, e);
      },
      handleDOMEvents: {
        compositionend: (t) => {
          setTimeout(() => {
            let { $cursor: r } = t.state.selection;
            r && fi(t, r.pos, r.pos, "", n, e);
          });
        }
      }
    },
    isInputRules: !0
  });
  return e;
}
function fi(n, e, t, r, o, s) {
  if (n.composing)
    return !1;
  let i = n.state, l = i.doc.resolve(e);
  if (l.parent.type.spec.code)
    return !1;
  let c = l.parent.textBetween(Math.max(0, l.parentOffset - xQ), l.parentOffset, null, "￼") + r;
  for (let a = 0; a < o.length; a++) {
    let u = o[a], f = u.match.exec(c), h = f && u.handler(i, f, e - (f[0].length - r.length), t);
    if (h)
      return u.undoable && h.setMeta(s, { transform: h, from: e, to: t, text: r }), n.dispatch(h), !0;
  }
  return !1;
}
const bQ = (n, e) => {
  let t = n.plugins;
  for (let r = 0; r < t.length; r++) {
    let o = t[r], s;
    if (o.spec.isInputRules && (s = o.getState(n))) {
      if (e) {
        let i = n.tr, l = s.transform;
        for (let c = l.steps.length - 1; c >= 0; c--)
          i.step(l.steps[c].invert(l.docs[c]));
        if (s.text) {
          let c = i.doc.resolve(s.from).marks();
          i.replaceWith(s.from, s.to, n.schema.text(s.text, c));
        } else
          i.delete(s.from, s.to);
        e(i);
      }
      return !0;
    }
  }
  return !1;
}, DQ = new Je(/--$/, "—"), NQ = new Je(/\.\.\.$/, "…"), wQ = new Je(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "“"), CQ = new Je(/"$/, "”"), AQ = new Je(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "‘"), SQ = new Je(/'$/, "’"), TQ = [wQ, CQ, AQ, SQ];
function Ze(n, e, t = null, r) {
  return new Je(n, (o, s, i, l) => {
    let c = t instanceof Function ? t(s) : t, a = o.tr.delete(i, l), u = a.doc.resolve(i), f = u.blockRange(), h = f && oo(f, e, c);
    if (!h)
      return null;
    a.wrap(f, h);
    let d = a.doc.resolve(i - 1).nodeBefore;
    return d && d.type == e && vt(a.doc, i - 1) && (!r || r(s, d)) && a.join(i - 1), a;
  });
}
function Jn(n, e, t = null) {
  return new Je(n, (r, o, s, i) => {
    let l = r.doc.resolve(s), c = t instanceof Function ? t(o) : t;
    return l.node(-1).canReplaceWith(l.index(-1), l.indexAfter(-1), e) ? r.tr.delete(s, i).setBlockType(s, s, e, c) : null;
  });
}
const tc = "address", EQ = {
  content: "block+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: "div.address" }],
  toDOM() {
    return ["div", { class: "address" }, 0];
  }
}, IQ = (n) => [
  // $A Address
  Ze(/^\$A\s$/, n.nodes[tc])
], vQ = (n, e) => {
  n.write(`$A

`), n.renderInline(e), n.write("$A"), n.closeBlock(e);
}, OQ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: IQ,
  name: tc,
  schema: EQ,
  toGovspeak: vQ
}, Symbol.toStringTag, { value: "Module" })), zQ = "blockquote", _Q = {
  content: "paragraph+",
  group: "block",
  parseDOM: [{ tag: "blockquote" }],
  toDOM() {
    return ["blockquote", 0];
  }
}, jQ = (n, e) => {
  n.wrapBlock("> ", null, e, () => n.renderContent(e));
}, LQ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: zQ,
  schema: _Q,
  toGovspeak: jQ
}, Symbol.toStringTag, { value: "Module" })), qQ = "bullet_list", RQ = {
  content: "list_item+",
  group: "block",
  attrs: { tight: { default: !1 } },
  parseDOM: [
    {
      tag: "ul",
      getAttrs: (n) => ({ tight: n.hasAttribute("data-tight") })
    }
  ],
  toDOM(n) {
    return ["ul", { "data-tight": n.attrs.tight ? "true" : null }, 0];
  }
}, FQ = (n, e) => {
  n.renderList(e, "  ", () => (e.attrs.bullet || "*") + " ");
}, BQ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: qQ,
  schema: RQ,
  toGovspeak: FQ
}, Symbol.toStringTag, { value: "Module" })), nc = "call_to_action", PQ = {
  content: "block+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: "div.call-to-action" }],
  toDOM() {
    return ["div", { class: "call-to-action" }, 0];
  }
}, UQ = (n) => [
  // $CTA Call to action
  Ze(/^\$CTA\s$/, n.nodes[nc])
], VQ = (n, e) => {
  n.write(`$CTA

`), n.renderInline(e), n.write("$CTA"), n.closeBlock(e);
}, $Q = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: UQ,
  name: nc,
  schema: PQ,
  toGovspeak: VQ
}, Symbol.toStringTag, { value: "Module" })), rc = "contact", QQ = {
  content: "paragraph+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: 'div.contact[role="contact"][aria-label="Contact"]' }],
  toDOM() {
    return ["div", { class: "contact" }, ["p", 0]];
  }
}, YQ = (n) => [
  // $C Contact
  Ze(/^\$C\s$/, n.nodes[rc])
], HQ = (n, e) => {
  n.write(`$C

`), n.renderInline(e), n.write("$C"), n.closeBlock(e);
}, GQ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: YQ,
  name: rc,
  schema: QQ,
  toGovspeak: HQ
}, Symbol.toStringTag, { value: "Module" })), WQ = "doc", JQ = {
  content: "(block|heading)+"
}, ZQ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: WQ,
  schema: JQ
}, Symbol.toStringTag, { value: "Module" })), oc = "example_callout", KQ = {
  content: "block+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: "div.example" }],
  toDOM() {
    return ["div", { class: "example" }, 0];
  }
}, XQ = (n) => [
  // $E Example callout
  Ze(/^\$E\s$/, n.nodes[oc])
], e9 = (n, e) => {
  n.write(`$E

`), n.renderInline(e), n.write("$E"), n.closeBlock(e);
}, t9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: XQ,
  name: oc,
  schema: KQ,
  toGovspeak: e9
}, Symbol.toStringTag, { value: "Module" })), n9 = "hard_break", r9 = {
  inline: !0,
  group: "inline",
  selectable: !1,
  parseDOM: [{ tag: "br" }],
  toDOM() {
    return ["br"];
  }
}, o9 = (n, e, t, r) => {
  for (let o = r + 1; o < t.childCount; o++)
    if (t.child(o).type !== e.type) {
      n.write(`\\
`);
      return;
    }
}, s9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: n9,
  schema: r9,
  toGovspeak: o9
}, Symbol.toStringTag, { value: "Module" })), i9 = "heading", l9 = {
  attrs: { level: { default: 2 } },
  content: "text*",
  marks: "",
  defining: !0,
  parseDOM: [
    { tag: "h2", attrs: { level: 2 } },
    { tag: "h3", attrs: { level: 3 } },
    { tag: "h4", attrs: { level: 4 } },
    { tag: "h5", attrs: { level: 5 } },
    { tag: "h6", attrs: { level: 6 } }
  ],
  toDOM(n) {
    return ["h" + n.attrs.level, 0];
  }
}, c9 = (n, e) => {
  n.write(n.repeat("#", e.attrs.level) + " "), n.renderInline(e, !1), n.closeBlock(e);
}, a9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: i9,
  schema: l9,
  toGovspeak: c9
}, Symbol.toStringTag, { value: "Module" })), sc = "information_callout", u9 = {
  content: "inline*",
  group: "block",
  defining: !0,
  parseDOM: [
    {
      tag: 'div.application-notice.info-notice[role="note"][aria-label="Information"]'
    }
  ],
  toDOM() {
    return ["div", { class: "application-notice info-notice" }, ["p", 0]];
  }
}, f9 = (n) => [
  // ^ Information callout
  Jn(/^\^\s$/, n.nodes[sc])
], h9 = (n, e) => {
  n.write("^"), n.renderInline(e, !1), n.write("^"), n.closeBlock(e);
}, d9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: f9,
  name: sc,
  schema: u9,
  toGovspeak: h9
}, Symbol.toStringTag, { value: "Module" })), p9 = "list_item", m9 = {
  content: "paragraph",
  defining: !0,
  parseDOM: [{ tag: "li" }],
  toDOM() {
    return ["li", 0];
  }
}, g9 = (n, e) => {
  n.renderContent(e);
}, y9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: p9,
  schema: m9,
  toGovspeak: g9
}, Symbol.toStringTag, { value: "Module" })), M9 = "ordered_list", k9 = {
  content: "list_item+",
  group: "block",
  attrs: { order: { default: 1 } },
  parseDOM: [
    {
      tag: "ol",
      getAttrs(n) {
        return {
          order: n.hasAttribute("start") ? +n.getAttribute("start") : 1
        };
      }
    }
  ],
  toDOM(n) {
    return n.attrs.order === 1 ? ["ol", 0] : ["ol", { start: n.attrs.order }, 0];
  }
}, x9 = (n, e) => {
  const t = e.attrs.order || 1, r = String(t + e.childCount - 1).length, o = n.repeat(" ", r + 2);
  n.renderList(e, o, (s) => {
    const i = String(t + s);
    return n.repeat(" ", r - i.length) + i + ". ";
  });
}, b9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: M9,
  schema: k9,
  toGovspeak: x9
}, Symbol.toStringTag, { value: "Module" })), D9 = "paragraph", N9 = {
  content: "inline*",
  group: "block",
  parseDOM: [{ tag: "p" }],
  toDOM() {
    return ["p", 0];
  }
}, w9 = (n, e) => {
  n.renderInline(e), n.closeBlock(e);
}, C9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: D9,
  schema: N9,
  toGovspeak: w9
}, Symbol.toStringTag, { value: "Module" })), ic = "steps", A9 = {
  content: "list_item+",
  group: "block",
  parseDOM: [
    {
      tag: "ol.steps"
    }
  ],
  toDOM() {
    return ["ol", { class: "steps" }, 0];
  }
}, S9 = (n) => [
  // s1. steps
  Ze(/^s1.\s$/, n.nodes[ic])
], T9 = (n, e) => {
  n.renderList(e, "", (t) => "s" + (t + 1) + ". "), n.write(`
`);
}, E9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: S9,
  name: ic,
  schema: A9,
  toGovspeak: T9
}, Symbol.toStringTag, { value: "Module" })), I9 = "text", v9 = {
  group: "inline"
}, O9 = (n, e) => {
  n.text(e.text, !n.inAutolink);
}, z9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: I9,
  schema: v9,
  toGovspeak: O9
}, Symbol.toStringTag, { value: "Module" })), lc = "warning_callout", _9 = {
  content: "inline*",
  group: "block",
  defining: !0,
  parseDOM: [
    {
      tag: 'div.application-notice.help-notice[role="note"][aria-label="Warning"]'
    }
  ],
  toDOM() {
    return ["div", { class: "application-notice help-notice" }, ["p", 0]];
  }
}, j9 = (n) => [
  // % Warning callout
  Jn(/^%\s$/, n.nodes[lc])
], L9 = (n, e) => {
  n.write("%"), n.renderInline(e, !1), n.write("%"), n.closeBlock(e);
}, q9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: j9,
  name: lc,
  schema: _9,
  toGovspeak: L9
}, Symbol.toStringTag, { value: "Module" })), So = [
  C9,
  // Paragraph must be first to be the default
  OQ,
  LQ,
  BQ,
  $Q,
  GQ,
  ZQ,
  t9,
  s9,
  a9,
  d9,
  y9,
  E9,
  // Steps must be before ordered_list so it doesn't get overridden by ordered_list
  b9,
  z9,
  q9
], R9 = Object.fromEntries(
  So.filter((n) => typeof n.toGovspeak < "u").map((n) => [n.name, n.toGovspeak])
), F9 = Object.fromEntries(
  Xl.map((n) => [n.name, n.serializerSpec])
), hi = new hQ(
  R9,
  F9
), B9 = Object.fromEntries(
  So.map((n) => [n.name, n.schema])
), P9 = Object.fromEntries(
  Xl.map((n) => [n.name, n.schema])
), di = new ji({
  nodes: B9,
  marks: P9
});
var Ge = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, _n = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, U9 = typeof navigator < "u" && /Mac/.test(navigator.platform), V9 = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var V = 0; V < 10; V++)
  Ge[48 + V] = Ge[96 + V] = String(V);
for (var V = 1; V <= 24; V++)
  Ge[V + 111] = "F" + V;
for (var V = 65; V <= 90; V++)
  Ge[V] = String.fromCharCode(V + 32), _n[V] = String.fromCharCode(V);
for (var Sr in Ge)
  _n.hasOwnProperty(Sr) || (_n[Sr] = Ge[Sr]);
function $9(n) {
  var e = U9 && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || V9 && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? _n : Ge)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const Q9 = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function Y9(n) {
  let e = n.split(/-(?!$)/), t = e[e.length - 1];
  t == "Space" && (t = " ");
  let r, o, s, i;
  for (let l = 0; l < e.length - 1; l++) {
    let c = e[l];
    if (/^(cmd|meta|m)$/i.test(c))
      i = !0;
    else if (/^a(lt)?$/i.test(c))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(c))
      o = !0;
    else if (/^s(hift)?$/i.test(c))
      s = !0;
    else if (/^mod$/i.test(c))
      Q9 ? i = !0 : o = !0;
    else
      throw new Error("Unrecognized modifier name: " + c);
  }
  return r && (t = "Alt-" + t), o && (t = "Ctrl-" + t), i && (t = "Meta-" + t), s && (t = "Shift-" + t), t;
}
function H9(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[Y9(t)] = n[t];
  return e;
}
function Tr(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function pi(n) {
  return new ze({ props: { handleKeyDown: cc(n) } });
}
function cc(n) {
  let e = H9(n);
  return function(t, r) {
    let o = $9(r), s, i = e[Tr(o, r)];
    if (i && i(t.state, t.dispatch, t))
      return !0;
    if (o.length == 1 && o != " ") {
      if (r.shiftKey) {
        let l = e[Tr(o, r, !1)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.shiftKey || r.altKey || r.metaKey || o.charCodeAt(0) > 127) && (s = Ge[r.keyCode]) && s != o) {
        let l = e[Tr(s, r)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
var jn = 200, P = function() {
};
P.prototype.append = function(e) {
  return e.length ? (e = P.from(e), !this.length && e || e.length < jn && this.leafAppend(e) || this.length < jn && e.leafPrepend(this) || this.appendInner(e)) : this;
};
P.prototype.prepend = function(e) {
  return e.length ? P.from(e).append(this) : this;
};
P.prototype.appendInner = function(e) {
  return new G9(this, e);
};
P.prototype.slice = function(e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? P.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
};
P.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
P.prototype.forEach = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length), t <= r ? this.forEachInner(e, t, r, 0) : this.forEachInvertedInner(e, t, r, 0);
};
P.prototype.map = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length);
  var o = [];
  return this.forEach(function(s, i) {
    return o.push(e(s, i));
  }, t, r), o;
};
P.from = function(e) {
  return e instanceof P ? e : e && e.length ? new ac(e) : P.empty;
};
var ac = /* @__PURE__ */ function(n) {
  function e(r) {
    n.call(this), this.values = r;
  }
  n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e;
  var t = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(o, s) {
    return o == 0 && s == this.length ? this : new e(this.values.slice(o, s));
  }, e.prototype.getInner = function(o) {
    return this.values[o];
  }, e.prototype.forEachInner = function(o, s, i, l) {
    for (var c = s; c < i; c++)
      if (o(this.values[c], l + c) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(o, s, i, l) {
    for (var c = s - 1; c >= i; c--)
      if (o(this.values[c], l + c) === !1)
        return !1;
  }, e.prototype.leafAppend = function(o) {
    if (this.length + o.length <= jn)
      return new e(this.values.concat(o.flatten()));
  }, e.prototype.leafPrepend = function(o) {
    if (this.length + o.length <= jn)
      return new e(o.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
}(P);
P.empty = new ac([]);
var G9 = /* @__PURE__ */ function(n) {
  function e(t, r) {
    n.call(this), this.left = t, this.right = r, this.length = t.length + r.length, this.depth = Math.max(t.depth, r.depth) + 1;
  }
  return n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, o, s, i) {
    var l = this.left.length;
    if (o < l && this.left.forEachInner(r, o, Math.min(s, l), i) === !1 || s > l && this.right.forEachInner(r, Math.max(o - l, 0), Math.min(this.length, s) - l, i + l) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, o, s, i) {
    var l = this.left.length;
    if (o > l && this.right.forEachInvertedInner(r, o - l, Math.max(s, l) - l, i + l) === !1 || s < l && this.left.forEachInvertedInner(r, Math.min(o, l), s, i) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, o) {
    if (r == 0 && o == this.length)
      return this;
    var s = this.left.length;
    return o <= s ? this.left.slice(r, o) : r >= s ? this.right.slice(r - s, o - s) : this.left.slice(r, s).append(this.right.slice(0, o - s));
  }, e.prototype.leafAppend = function(r) {
    var o = this.right.leafAppend(r);
    if (o)
      return new e(this.left, o);
  }, e.prototype.leafPrepend = function(r) {
    var o = this.left.leafPrepend(r);
    if (o)
      return new e(o, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
}(P);
const W9 = 500;
class pe {
  constructor(e, t) {
    this.items = e, this.eventCount = t;
  }
  // Pop the latest event off the branch's history and apply it
  // to a document transform.
  popEvent(e, t) {
    if (this.eventCount == 0)
      return null;
    let r = this.items.length;
    for (; ; r--)
      if (this.items.get(r - 1).selection) {
        --r;
        break;
      }
    let o, s;
    t && (o = this.remapping(r, this.items.length), s = o.maps.length);
    let i = e.tr, l, c, a = [], u = [];
    return this.items.forEach((f, h) => {
      if (!f.step) {
        o || (o = this.remapping(r, h + 1), s = o.maps.length), s--, u.push(f);
        return;
      }
      if (o) {
        u.push(new Me(f.map));
        let d = f.step.map(o.slice(s)), p;
        d && i.maybeStep(d).doc && (p = i.mapping.maps[i.mapping.maps.length - 1], a.push(new Me(p, void 0, void 0, a.length + u.length))), s--, p && o.appendMap(p, s);
      } else
        i.maybeStep(f.step);
      if (f.selection)
        return l = o ? f.selection.map(o.slice(s)) : f.selection, c = new pe(this.items.slice(0, r).append(u.reverse().concat(a)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: c, transform: i, selection: l };
  }
  // Create a new branch with the given transform added.
  addTransform(e, t, r, o) {
    let s = [], i = this.eventCount, l = this.items, c = !o && l.length ? l.get(l.length - 1) : null;
    for (let u = 0; u < e.steps.length; u++) {
      let f = e.steps[u].invert(e.docs[u]), h = new Me(e.mapping.maps[u], f, t), d;
      (d = c && c.merge(h)) && (h = d, u ? s.pop() : l = l.slice(0, l.length - 1)), s.push(h), t && (i++, t = void 0), o || (c = h);
    }
    let a = i - r.depth;
    return a > Z9 && (l = J9(l, a), i -= a), new pe(l.append(s), i);
  }
  remapping(e, t) {
    let r = new kt();
    return this.items.forEach((o, s) => {
      let i = o.mirrorOffset != null && s - o.mirrorOffset >= e ? r.maps.length - o.mirrorOffset : void 0;
      r.appendMap(o.map, i);
    }, e, t), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new pe(this.items.append(e.map((t) => new Me(t))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(e, t) {
    if (!this.eventCount)
      return this;
    let r = [], o = Math.max(0, this.items.length - t), s = e.mapping, i = e.steps.length, l = this.eventCount;
    this.items.forEach((h) => {
      h.selection && l--;
    }, o);
    let c = t;
    this.items.forEach((h) => {
      let d = s.getMirror(--c);
      if (d == null)
        return;
      i = Math.min(i, d);
      let p = s.maps[d];
      if (h.step) {
        let m = e.steps[d].invert(e.docs[d]), g = h.selection && h.selection.map(s.slice(c + 1, d));
        g && l++, r.push(new Me(p, m, g));
      } else
        r.push(new Me(p));
    }, o);
    let a = [];
    for (let h = t; h < i; h++)
      a.push(new Me(s.maps[h]));
    let u = this.items.slice(0, o).append(a).append(r), f = new pe(u, l);
    return f.emptyItemCount() > W9 && (f = f.compress(this.items.length - r.length)), f;
  }
  emptyItemCount() {
    let e = 0;
    return this.items.forEach((t) => {
      t.step || e++;
    }), e;
  }
  // Compressing a branch means rewriting it to push the air (map-only
  // items) out. During collaboration, these naturally accumulate
  // because each remote change adds one. The `upto` argument is used
  // to ensure that only the items below a given level are compressed,
  // because `rebased` relies on a clean, untouched set of items in
  // order to associate old items with rebased steps.
  compress(e = this.items.length) {
    let t = this.remapping(0, e), r = t.maps.length, o = [], s = 0;
    return this.items.forEach((i, l) => {
      if (l >= e)
        o.push(i), i.selection && s++;
      else if (i.step) {
        let c = i.step.map(t.slice(r)), a = c && c.getMap();
        if (r--, a && t.appendMap(a, r), c) {
          let u = i.selection && i.selection.map(t.slice(r));
          u && s++;
          let f = new Me(a.invert(), c, u), h, d = o.length - 1;
          (h = o.length && o[d].merge(f)) ? o[d] = h : o.push(f);
        }
      } else
        i.map && r--;
    }, this.items.length, 0), new pe(P.from(o.reverse()), s);
  }
}
pe.empty = new pe(P.empty, 0);
function J9(n, e) {
  let t;
  return n.forEach((r, o) => {
    if (r.selection && e-- == 0)
      return t = o, !1;
  }), n.slice(t);
}
class Me {
  constructor(e, t, r, o) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = o;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t)
        return new Me(t.getMap().invert(), t, this.selection);
    }
  }
}
class Fe {
  constructor(e, t, r, o, s) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = o, this.prevComposition = s;
  }
}
const Z9 = 20;
function K9(n, e, t, r) {
  let o = t.getMeta(He), s;
  if (o)
    return o.historyState;
  t.getMeta(eY) && (n = new Fe(n.done, n.undone, null, 0, -1));
  let i = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (i && i.getMeta(He))
    return i.getMeta(He).redo ? new Fe(n.done.addTransform(t, void 0, r, xn(e)), n.undone, mi(t.mapping.maps[t.steps.length - 1]), n.prevTime, n.prevComposition) : new Fe(n.done, n.undone.addTransform(t, void 0, r, xn(e)), null, n.prevTime, n.prevComposition);
  if (t.getMeta("addToHistory") !== !1 && !(i && i.getMeta("addToHistory") === !1)) {
    let l = t.getMeta("composition"), c = n.prevTime == 0 || !i && n.prevComposition != l && (n.prevTime < (t.time || 0) - r.newGroupDelay || !X9(t, n.prevRanges)), a = i ? Er(n.prevRanges, t.mapping) : mi(t.mapping.maps[t.steps.length - 1]);
    return new Fe(n.done.addTransform(t, c ? e.selection.getBookmark() : void 0, r, xn(e)), pe.empty, a, t.time, l ?? n.prevComposition);
  } else
    return (s = t.getMeta("rebased")) ? new Fe(n.done.rebased(t, s), n.undone.rebased(t, s), Er(n.prevRanges, t.mapping), n.prevTime, n.prevComposition) : new Fe(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), Er(n.prevRanges, t.mapping), n.prevTime, n.prevComposition);
}
function X9(n, e) {
  if (!e)
    return !1;
  if (!n.docChanged)
    return !0;
  let t = !1;
  return n.mapping.maps[0].forEach((r, o) => {
    for (let s = 0; s < e.length; s += 2)
      r <= e[s + 1] && o >= e[s] && (t = !0);
  }), t;
}
function mi(n) {
  let e = [];
  return n.forEach((t, r, o, s) => e.push(o, s)), e;
}
function Er(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let o = e.map(n[r], 1), s = e.map(n[r + 1], -1);
    o <= s && t.push(o, s);
  }
  return t;
}
function uc(n, e, t, r) {
  let o = xn(e), s = He.get(e).spec.config, i = (r ? n.undone : n.done).popEvent(e, o);
  if (!i)
    return;
  let l = i.selection.resolve(i.transform.doc), c = (r ? n.done : n.undone).addTransform(i.transform, e.selection.getBookmark(), s, o), a = new Fe(r ? c : i.remaining, r ? i.remaining : c, null, 0, -1);
  t(i.transform.setSelection(l).setMeta(He, { redo: r, historyState: a }).scrollIntoView());
}
let Ir = !1, gi = null;
function xn(n) {
  let e = n.plugins;
  if (gi != e) {
    Ir = !1, gi = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        Ir = !0;
        break;
      }
  }
  return Ir;
}
const He = new Ki("history"), eY = new Ki("closeHistory");
function tY(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new ze({
    key: He,
    state: {
      init() {
        return new Fe(pe.empty, pe.empty, null, 0, -1);
      },
      apply(e, t, r) {
        return K9(t, r, e, n);
      }
    },
    config: n,
    props: {
      handleDOMEvents: {
        beforeinput(e, t) {
          let r = t.inputType, o = r == "historyUndo" ? nn : r == "historyRedo" ? Tt : null;
          return o ? (t.preventDefault(), o(e.state, e.dispatch)) : !1;
        }
      }
    }
  });
}
const nn = (n, e) => {
  let t = He.getState(n);
  return !t || t.done.eventCount == 0 ? !1 : (e && uc(t, n, e, !1), !0);
}, Tt = (n, e) => {
  let t = He.getState(n);
  return !t || t.undone.eventCount == 0 ? !1 : (e && uc(t, n, e, !0), !0);
}, fc = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function nY(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const rY = (n, e, t) => {
  let r = nY(n, t);
  if (!r)
    return !1;
  let o = hc(r);
  if (!o) {
    let i = r.blockRange(), l = i && on(i);
    return l == null ? !1 : (e && e(n.tr.lift(i, l).scrollIntoView()), !0);
  }
  let s = o.nodeBefore;
  if (!s.type.spec.isolating && mc(n, o, e))
    return !0;
  if (r.parent.content.size == 0 && (Et(s, "end") || C.isSelectable(s))) {
    let i = so(n.doc, r.before(), r.after(), D.empty);
    if (i && i.slice.size < i.to - i.from) {
      if (e) {
        let l = n.tr.step(i);
        l.setSelection(Et(s, "end") ? I.findFrom(l.doc.resolve(l.mapping.map(o.pos, -1)), -1) : C.create(l.doc, o.pos - s.nodeSize)), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && o.depth == r.depth - 1 ? (e && e(n.tr.delete(o.pos - s.nodeSize, o.pos).scrollIntoView()), !0) : !1;
};
function Et(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const oY = (n, e, t) => {
  let { $head: r, empty: o } = n.selection, s = r;
  if (!o)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    s = hc(r);
  }
  let i = s && s.nodeBefore;
  return !i || !C.isSelectable(i) ? !1 : (e && e(n.tr.setSelection(C.create(n.doc, s.pos - i.nodeSize)).scrollIntoView()), !0);
};
function hc(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function sY(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const iY = (n, e, t) => {
  let r = sY(n, t);
  if (!r)
    return !1;
  let o = dc(r);
  if (!o)
    return !1;
  let s = o.nodeAfter;
  if (mc(n, o, e))
    return !0;
  if (r.parent.content.size == 0 && (Et(s, "start") || C.isSelectable(s))) {
    let i = so(n.doc, r.before(), r.after(), D.empty);
    if (i && i.slice.size < i.to - i.from) {
      if (e) {
        let l = n.tr.step(i);
        l.setSelection(Et(s, "start") ? I.findFrom(l.doc.resolve(l.mapping.map(o.pos)), 1) : C.create(l.doc, l.mapping.map(o.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && o.depth == r.depth - 1 ? (e && e(n.tr.delete(o.pos, o.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, lY = (n, e, t) => {
  let { $head: r, empty: o } = n.selection, s = r;
  if (!o)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    s = dc(r);
  }
  let i = s && s.nodeAfter;
  return !i || !C.isSelectable(i) ? !1 : (e && e(n.tr.setSelection(C.create(n.doc, s.pos)).scrollIntoView()), !0);
};
function dc(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount)
        return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating)
        break;
    }
  return null;
}
const Zr = (n, e) => {
  let t = n.selection, r = t instanceof C, o;
  if (r) {
    if (t.node.isTextblock || !vt(n.doc, t.from))
      return !1;
    o = t.from;
  } else if (o = $i(n.doc, t.from, -1), o == null)
    return !1;
  if (e) {
    let s = n.tr.join(o);
    r && s.setSelection(C.create(s.doc, o - n.doc.resolve(o).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, cY = (n, e) => {
  let t = n.selection, r;
  if (t instanceof C) {
    if (t.node.isTextblock || !vt(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = $i(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, Kr = (n, e) => {
  let { $from: t, $to: r } = n.selection, o = t.blockRange(r), s = o && on(o);
  return s == null ? !1 : (e && e(n.tr.lift(o, s).scrollIntoView()), !0);
}, aY = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function To(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const pc = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let o = t.node(-1), s = t.indexAfter(-1), i = To(o.contentMatchAt(s));
  if (!i || !o.canReplaceWith(s, s, i))
    return !1;
  if (e) {
    let l = t.after(), c = n.tr.replaceWith(l, l, i.createAndFill());
    c.setSelection(I.near(c.doc.resolve(l), 1)), e(c.scrollIntoView());
  }
  return !0;
}, uY = (n, e) => {
  let t = n.selection, { $from: r, $to: o } = t;
  if (t instanceof re || r.parent.inlineContent || o.parent.inlineContent)
    return !1;
  let s = To(o.parent.contentMatchAt(o.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let i = (!r.parentOffset && o.index() < o.parent.childCount ? r : o).pos, l = n.tr.insert(i, s.createAndFill());
    l.setSelection(j.create(l.doc, i + 1)), e(l.scrollIntoView());
  }
  return !0;
}, fY = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let s = t.before();
    if (xt(n.doc, s))
      return e && e(n.tr.split(s).scrollIntoView()), !0;
  }
  let r = t.blockRange(), o = r && on(r);
  return o == null ? !1 : (e && e(n.tr.lift(r, o).scrollIntoView()), !0);
};
function hY(n) {
  return (e, t) => {
    let { $from: r, $to: o } = e.selection;
    if (e.selection instanceof C && e.selection.node.isBlock)
      return !r.parentOffset || !xt(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.parent.isBlock)
      return !1;
    if (t) {
      let s = o.parentOffset == o.parent.content.size, i = e.tr;
      (e.selection instanceof j || e.selection instanceof re) && i.deleteSelection();
      let l = r.depth == 0 ? null : To(r.node(-1).contentMatchAt(r.indexAfter(-1))), c = n && n(o.parent, s), a = c ? [c] : s && l ? [{ type: l }] : void 0, u = xt(i.doc, i.mapping.map(r.pos), 1, a);
      if (!a && !u && xt(i.doc, i.mapping.map(r.pos), 1, l ? [{ type: l }] : void 0) && (l && (a = [{ type: l }]), u = !0), u && (i.split(i.mapping.map(r.pos), 1, a), !s && !r.parentOffset && r.parent.type != l)) {
        let f = i.mapping.map(r.before()), h = i.doc.resolve(f);
        l && r.node(-1).canReplaceWith(h.index(), h.index() + 1, l) && i.setNodeMarkup(i.mapping.map(r.before()), l);
      }
      t(i.scrollIntoView());
    }
    return !0;
  };
}
const dY = hY(), Xr = (n, e) => {
  let { $from: t, to: r } = n.selection, o, s = t.sharedDepth(r);
  return s == 0 ? !1 : (o = t.before(s), e && e(n.tr.setSelection(C.create(n.doc, o))), !0);
}, pY = (n, e) => (e && e(n.tr.setSelection(new re(n.doc))), !0);
function mY(n, e, t) {
  let r = e.nodeBefore, o = e.nodeAfter, s = e.index();
  return !r || !o || !r.type.compatibleContent(o.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(o.isTextblock || vt(n.doc, e.pos)) ? !1 : (t && t(n.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function mc(n, e, t) {
  let r = e.nodeBefore, o = e.nodeAfter, s, i;
  if (r.type.spec.isolating || o.type.spec.isolating)
    return !1;
  if (mY(n, e, t))
    return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (l && (s = (i = r.contentMatchAt(r.childCount)).findWrapping(o.type)) && i.matchType(s[0] || o.type).validEnd) {
    if (t) {
      let f = e.pos + o.nodeSize, h = M.empty;
      for (let m = s.length - 1; m >= 0; m--)
        h = M.from(s[m].create(null, h));
      h = M.from(r.copy(h));
      let d = n.tr.step(new $(e.pos - 1, f, e.pos, f, new D(h, 1, 0), s.length, !0)), p = f + 2 * s.length;
      vt(d.doc, p) && d.join(p), t(d.scrollIntoView());
    }
    return !0;
  }
  let c = I.findFrom(e, 1), a = c && c.$from.blockRange(c.$to), u = a && on(a);
  if (u != null && u >= e.depth)
    return t && t(n.tr.lift(a, u).scrollIntoView()), !0;
  if (l && Et(o, "start", !0) && Et(r, "end")) {
    let f = r, h = [];
    for (; h.push(f), !f.isTextblock; )
      f = f.lastChild;
    let d = o, p = 1;
    for (; !d.isTextblock; d = d.firstChild)
      p++;
    if (f.canReplace(f.childCount, f.childCount, d.content)) {
      if (t) {
        let m = M.empty;
        for (let y = h.length - 1; y >= 0; y--)
          m = M.from(h[y].copy(m));
        let g = n.tr.step(new $(e.pos - h.length, e.pos + o.nodeSize, e.pos + p, e.pos + o.nodeSize - p, new D(m, h.length, 0), 0, !0));
        t(g.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function gc(n) {
  return function(e, t) {
    let r = e.selection, o = n < 0 ? r.$from : r.$to, s = o.depth;
    for (; o.node(s).isInline; ) {
      if (!s)
        return !1;
      s--;
    }
    return o.node(s).isTextblock ? (t && t(e.tr.setSelection(j.create(e.doc, n < 0 ? o.start(s) : o.end(s)))), !0) : !1;
  };
}
const gY = gc(-1), yY = gc(1);
function Ie(n, e = null) {
  return function(t, r) {
    let { $from: o, $to: s } = t.selection, i = o.blockRange(s), l = i && oo(i, n, e);
    return l ? (r && r(t.tr.wrap(i, l).scrollIntoView()), !0) : !1;
  };
}
function B(n, e = null) {
  return function(t, r) {
    let o = !1;
    for (let s = 0; s < t.selection.ranges.length && !o; s++) {
      let { $from: { pos: i }, $to: { pos: l } } = t.selection.ranges[s];
      t.doc.nodesBetween(i, l, (c, a) => {
        if (o)
          return !1;
        if (!(!c.isTextblock || c.hasMarkup(n, e)))
          if (c.type == n)
            o = !0;
          else {
            let u = t.doc.resolve(a), f = u.index();
            o = u.parent.canReplaceWith(f, f + 1, n);
          }
      });
    }
    if (!o)
      return !1;
    if (r) {
      let s = t.tr;
      for (let i = 0; i < t.selection.ranges.length; i++) {
        let { $from: { pos: l }, $to: { pos: c } } = t.selection.ranges[i];
        s.setBlockType(l, c, n, e);
      }
      r(s.scrollIntoView());
    }
    return !0;
  };
}
function MY(n, e, t) {
  for (let r = 0; r < e.length; r++) {
    let { $from: o, $to: s } = e[r], i = o.depth == 0 ? n.inlineContent && n.type.allowsMarkType(t) : !1;
    if (n.nodesBetween(o.pos, s.pos, (l) => {
      if (i)
        return !1;
      i = l.inlineContent && l.type.allowsMarkType(t);
    }), i)
      return !0;
  }
  return !1;
}
function ce(n, e = null) {
  return function(t, r) {
    let { empty: o, $cursor: s, ranges: i } = t.selection;
    if (o && !s || !MY(t.doc, i, n))
      return !1;
    if (r)
      if (s)
        n.isInSet(t.storedMarks || s.marks()) ? r(t.tr.removeStoredMark(n)) : r(t.tr.addStoredMark(n.create(e)));
      else {
        let l = !1, c = t.tr;
        for (let a = 0; !l && a < i.length; a++) {
          let { $from: u, $to: f } = i[a];
          l = t.doc.rangeHasMark(u.pos, f.pos, n);
        }
        for (let a = 0; a < i.length; a++) {
          let { $from: u, $to: f } = i[a];
          if (l)
            c.removeMark(u.pos, f.pos, n);
          else {
            let h = u.pos, d = f.pos, p = u.nodeAfter, m = f.nodeBefore, g = p && p.isText ? /^\s*/.exec(p.text)[0].length : 0, y = m && m.isText ? /\s*$/.exec(m.text)[0].length : 0;
            h + g < d && (h += g, d -= y), c.addMark(h, d, n.create(e));
          }
        }
        r(c.scrollIntoView());
      }
    return !0;
  };
}
function ue(...n) {
  return function(e, t, r) {
    for (let o = 0; o < n.length; o++)
      if (n[o](e, t, r))
        return !0;
    return !1;
  };
}
let vr = ue(fc, rY, oY), yi = ue(fc, iY, lY);
const Ee = {
  Enter: ue(aY, uY, fY, dY),
  "Mod-Enter": pc,
  Backspace: vr,
  "Mod-Backspace": vr,
  "Shift-Backspace": vr,
  Delete: yi,
  "Mod-Delete": yi,
  "Mod-a": pY
}, yc = {
  "Ctrl-h": Ee.Backspace,
  "Alt-Backspace": Ee["Mod-Backspace"],
  "Ctrl-d": Ee.Delete,
  "Ctrl-Alt-Backspace": Ee["Mod-Delete"],
  "Alt-Delete": Ee["Mod-Delete"],
  "Alt-d": Ee["Mod-Delete"],
  "Ctrl-a": gY,
  "Ctrl-e": yY
};
for (let n in Ee)
  yc[n] = Ee[n];
const kY = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform ? os.platform() == "darwin" : !1, xY = kY ? yc : Ee;
function bY(n = {}) {
  return new ze({
    view(e) {
      return new DY(e, n);
    }
  });
}
class DY {
  constructor(e, t) {
    var r;
    this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.width = (r = t.width) !== null && r !== void 0 ? r : 1, this.color = t.color === !1 ? void 0 : t.color || "black", this.class = t.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((o) => {
      let s = (i) => {
        this[o](i);
      };
      return e.dom.addEventListener(o, s), { name: o, handler: s };
    });
  }
  destroy() {
    this.handlers.forEach(({ name: e, handler: t }) => this.editorView.dom.removeEventListener(e, t));
  }
  update(e, t) {
    this.cursorPos != null && t.doc != e.state.doc && (this.cursorPos > e.state.doc.content.size ? this.setCursor(null) : this.updateOverlay());
  }
  setCursor(e) {
    e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
  }
  updateOverlay() {
    let e = this.editorView.state.doc.resolve(this.cursorPos), t = !e.parent.inlineContent, r;
    if (t) {
      let l = e.nodeBefore, c = e.nodeAfter;
      if (l || c) {
        let a = this.editorView.nodeDOM(this.cursorPos - (l ? l.nodeSize : 0));
        if (a) {
          let u = a.getBoundingClientRect(), f = l ? u.bottom : u.top;
          l && c && (f = (f + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2), r = { left: u.left, right: u.right, top: f - this.width / 2, bottom: f + this.width / 2 };
        }
      }
    }
    if (!r) {
      let l = this.editorView.coordsAtPos(this.cursorPos);
      r = { left: l.left - this.width / 2, right: l.left + this.width / 2, top: l.top, bottom: l.bottom };
    }
    let o = this.editorView.dom.offsetParent;
    this.element || (this.element = o.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", t), this.element.classList.toggle("prosemirror-dropcursor-inline", !t);
    let s, i;
    if (!o || o == document.body && getComputedStyle(o).position == "static")
      s = -pageXOffset, i = -pageYOffset;
    else {
      let l = o.getBoundingClientRect();
      s = l.left - o.scrollLeft, i = l.top - o.scrollTop;
    }
    this.element.style.left = r.left - s + "px", this.element.style.top = r.top - i + "px", this.element.style.width = r.right - r.left + "px", this.element.style.height = r.bottom - r.top + "px";
  }
  scheduleRemoval(e) {
    clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
  }
  dragover(e) {
    if (!this.editorView.editable)
      return;
    let t = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }), r = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside), o = r && r.type.spec.disableDropCursor, s = typeof o == "function" ? o(this.editorView, t, e) : o;
    if (t && !s) {
      let i = t.pos;
      if (this.editorView.dragging && this.editorView.dragging.slice) {
        let l = Qi(this.editorView.state.doc, i, this.editorView.dragging.slice);
        l != null && (i = l);
      }
      this.setCursor(i), this.scheduleRemoval(5e3);
    }
  }
  dragend() {
    this.scheduleRemoval(20);
  }
  drop() {
    this.scheduleRemoval(20);
  }
  dragleave(e) {
    (e.target == this.editorView.dom || !this.editorView.dom.contains(e.relatedTarget)) && this.setCursor(null);
  }
}
class q extends I {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    return q.valid(r) ? new q(r) : I.near(r);
  }
  content() {
    return D.empty;
  }
  eq(e) {
    return e instanceof q && e.head == this.head;
  }
  toJSON() {
    return { type: "gapcursor", pos: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for GapCursor.fromJSON");
    return new q(e.resolve(t.pos));
  }
  /**
  @internal
  */
  getBookmark() {
    return new Eo(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let t = e.parent;
    if (t.isTextblock || !NY(e) || !wY(e))
      return !1;
    let r = t.type.spec.allowGapCursor;
    if (r != null)
      return r;
    let o = t.contentMatchAt(e.index()).defaultType;
    return o && o.isTextblock;
  }
  /**
  @internal
  */
  static findGapCursorFrom(e, t, r = !1) {
    e:
      for (; ; ) {
        if (!r && q.valid(e))
          return e;
        let o = e.pos, s = null;
        for (let i = e.depth; ; i--) {
          let l = e.node(i);
          if (t > 0 ? e.indexAfter(i) < l.childCount : e.index(i) > 0) {
            s = l.child(t > 0 ? e.indexAfter(i) : e.index(i) - 1);
            break;
          } else if (i == 0)
            return null;
          o += t;
          let c = e.doc.resolve(o);
          if (q.valid(c))
            return c;
        }
        for (; ; ) {
          let i = t > 0 ? s.firstChild : s.lastChild;
          if (!i) {
            if (s.isAtom && !s.isText && !C.isSelectable(s)) {
              e = e.doc.resolve(o + s.nodeSize * t), r = !1;
              continue e;
            }
            break;
          }
          s = i, o += t;
          let l = e.doc.resolve(o);
          if (q.valid(l))
            return l;
        }
        return null;
      }
  }
}
q.prototype.visible = !1;
q.findFrom = q.findGapCursorFrom;
I.jsonID("gapcursor", q);
class Eo {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new Eo(e.map(this.pos));
  }
  resolve(e) {
    let t = e.resolve(this.pos);
    return q.valid(t) ? new q(t) : I.near(t);
  }
}
function NY(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.index(e), r = n.node(e);
    if (t == 0) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let o = r.child(t - 1); ; o = o.lastChild) {
      if (o.childCount == 0 && !o.inlineContent || o.isAtom || o.type.spec.isolating)
        return !0;
      if (o.inlineContent)
        return !1;
    }
  }
  return !0;
}
function wY(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.indexAfter(e), r = n.node(e);
    if (t == r.childCount) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let o = r.child(t); ; o = o.firstChild) {
      if (o.childCount == 0 && !o.inlineContent || o.isAtom || o.type.spec.isolating)
        return !0;
      if (o.inlineContent)
        return !1;
    }
  }
  return !0;
}
function CY() {
  return new ze({
    props: {
      decorations: EY,
      createSelectionBetween(n, e, t) {
        return e.pos == t.pos && q.valid(t) ? new q(t) : null;
      },
      handleClick: SY,
      handleKeyDown: AY,
      handleDOMEvents: { beforeinput: TY }
    }
  });
}
const AY = cc({
  ArrowLeft: gn("horiz", -1),
  ArrowRight: gn("horiz", 1),
  ArrowUp: gn("vert", -1),
  ArrowDown: gn("vert", 1)
});
function gn(n, e) {
  const t = n == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, o, s) {
    let i = r.selection, l = e > 0 ? i.$to : i.$from, c = i.empty;
    if (i instanceof j) {
      if (!s.endOfTextblock(t) || l.depth == 0)
        return !1;
      c = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let a = q.findGapCursorFrom(l, e, c);
    return a ? (o && o(r.tr.setSelection(new q(a))), !0) : !1;
  };
}
function SY(n, e, t) {
  if (!n || !n.editable)
    return !1;
  let r = n.state.doc.resolve(e);
  if (!q.valid(r))
    return !1;
  let o = n.posAtCoords({ left: t.clientX, top: t.clientY });
  return o && o.inside > -1 && C.isSelectable(n.state.doc.nodeAt(o.inside)) ? !1 : (n.dispatch(n.state.tr.setSelection(new q(r))), !0);
}
function TY(n, e) {
  if (e.inputType != "insertCompositionText" || !(n.state.selection instanceof q))
    return !1;
  let { $from: t } = n.state.selection, r = t.parent.contentMatchAt(t.index()).findWrapping(n.state.schema.nodes.text);
  if (!r)
    return !1;
  let o = M.empty;
  for (let i = r.length - 1; i >= 0; i--)
    o = M.from(r[i].createAndFill(null, o));
  let s = n.state.tr.replace(t.pos, t.pos, new D(o, 0, 0));
  return s.setSelection(j.near(s.doc.resolve(t.pos + 1))), n.dispatch(s), !1;
}
function EY(n) {
  if (!(n.selection instanceof q))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", F.create(n.doc, [ae.widget(n.selection.head, e, { key: "gapcursor" })]);
}
function oe() {
  var n = arguments[0];
  typeof n == "string" && (n = document.createElement(n));
  var e = 1, t = arguments[1];
  if (t && typeof t == "object" && t.nodeType == null && !Array.isArray(t)) {
    for (var r in t)
      if (Object.prototype.hasOwnProperty.call(t, r)) {
        var o = t[r];
        typeof o == "string" ? n.setAttribute(r, o) : o != null && (n[r] = o);
      }
    e++;
  }
  for (; e < arguments.length; e++)
    Mc(n, arguments[e]);
  return n;
}
function Mc(n, e) {
  if (typeof e == "string")
    n.appendChild(document.createTextNode(e));
  else if (e != null)
    if (e.nodeType != null)
      n.appendChild(e);
    else if (Array.isArray(e))
      for (var t = 0; t < e.length; t++)
        Mc(n, e[t]);
    else
      throw new RangeError("Unsupported child node: " + e);
}
const Yt = "http://www.w3.org/2000/svg", IY = "http://www.w3.org/1999/xlink", eo = "ProseMirror-icon";
function vY(n) {
  let e = 0;
  for (let t = 0; t < n.length; t++)
    e = (e << 5) - e + n.charCodeAt(t) | 0;
  return e;
}
function OY(n, e) {
  let t = (n.nodeType == 9 ? n : n.ownerDocument) || document, r = t.createElement("div");
  if (r.className = eo, e.path) {
    let { path: o, width: s, height: i } = e, l = "pm-icon-" + vY(o).toString(16);
    t.getElementById(l) || zY(n, l, e);
    let c = r.appendChild(t.createElementNS(Yt, "svg"));
    c.style.width = s / i + "em", c.appendChild(t.createElementNS(Yt, "use")).setAttributeNS(IY, "href", /([^#]*)/.exec(t.location.toString())[1] + "#" + l);
  } else if (e.dom)
    r.appendChild(e.dom.cloneNode(!0));
  else {
    let { text: o, css: s } = e;
    r.appendChild(t.createElement("span")).textContent = o || "", s && (r.firstChild.style.cssText = s);
  }
  return r;
}
function zY(n, e, t) {
  let [r, o] = n.nodeType == 9 ? [n, n.body] : [n.ownerDocument || document, n], s = r.getElementById(eo + "-collection");
  s || (s = r.createElementNS(Yt, "svg"), s.id = eo + "-collection", s.style.display = "none", o.insertBefore(s, o.firstChild));
  let i = r.createElementNS(Yt, "symbol");
  i.id = e, i.setAttribute("viewBox", "0 0 " + t.width + " " + t.height), i.appendChild(r.createElementNS(Yt, "path")).setAttribute("d", t.path), s.appendChild(i);
}
const ee = "ProseMirror-menu";
class ye {
  /**
  Create a menu item.
  */
  constructor(e) {
    this.spec = e;
  }
  /**
  Renders the icon according to its [display
  spec](https://prosemirror.net/docs/ref/#menu.MenuItemSpec.display), and adds an event handler which
  executes the command when the representation is clicked.
  */
  render(e) {
    let t = this.spec, r = t.render ? t.render(e) : t.icon ? OY(e.root, t.icon) : t.label ? oe("div", null, rn(e, t.label)) : null;
    if (!r)
      throw new RangeError("MenuItem without icon or label property");
    if (t.title) {
      const s = typeof t.title == "function" ? t.title(e.state) : t.title;
      r.setAttribute("title", rn(e, s));
    }
    t.class && r.classList.add(t.class), t.css && (r.style.cssText += t.css), r.addEventListener("mousedown", (s) => {
      s.preventDefault(), r.classList.contains(ee + "-disabled") || t.run(e.state, e.dispatch, e, s);
    });
    function o(s) {
      if (t.select) {
        let l = t.select(s);
        if (r.style.display = l ? "" : "none", !l)
          return !1;
      }
      let i = !0;
      if (t.enable && (i = t.enable(s) || !1, to(r, ee + "-disabled", !i)), t.active) {
        let l = i && t.active(s) || !1;
        to(r, ee + "-active", l);
      }
      return !0;
    }
    return { dom: r, update: o };
  }
}
function rn(n, e) {
  return n._props.translate ? n._props.translate(e) : e;
}
let Ht = { time: 0, node: null };
function kc(n) {
  Ht.time = Date.now(), Ht.node = n.target;
}
function xc(n) {
  return Date.now() - 100 < Ht.time && Ht.node && n.contains(Ht.node);
}
class Mi {
  /**
  Create a dropdown wrapping the elements.
  */
  constructor(e, t = {}) {
    this.options = t, this.options = t || {}, this.content = Array.isArray(e) ? e : [e];
  }
  /**
  Render the dropdown menu and sub-items.
  */
  render(e) {
    let t = bc(this.content, e), r = e.dom.ownerDocument.defaultView || window, o = oe("div", {
      class: ee + "-dropdown " + (this.options.class || ""),
      style: this.options.css
    }, rn(e, this.options.label || ""));
    this.options.title && o.setAttribute("title", rn(e, this.options.title));
    let s = oe("div", { class: ee + "-dropdown-wrap" }, o), i = null, l = null, c = () => {
      i && i.close() && (i = null, r.removeEventListener("mousedown", l));
    };
    o.addEventListener("mousedown", (u) => {
      u.preventDefault(), kc(u), i ? c() : (i = this.expand(s, t.dom), r.addEventListener("mousedown", l = () => {
        xc(s) || c();
      }));
    });
    function a(u) {
      let f = t.update(u);
      return s.style.display = f ? "" : "none", f;
    }
    return { dom: s, update: a };
  }
  /**
  @internal
  */
  expand(e, t) {
    let r = oe("div", { class: ee + "-dropdown-menu " + (this.options.class || "") }, t), o = !1;
    function s() {
      return o ? !1 : (o = !0, e.removeChild(r), !0);
    }
    return e.appendChild(r), { close: s, node: r };
  }
}
function bc(n, e) {
  let t = [], r = [];
  for (let o = 0; o < n.length; o++) {
    let { dom: s, update: i } = n[o].render(e);
    t.push(oe("div", { class: ee + "-dropdown-item" }, s)), r.push(i);
  }
  return { dom: t, update: Dc(r, t) };
}
function Dc(n, e) {
  return (t) => {
    let r = !1;
    for (let o = 0; o < n.length; o++) {
      let s = n[o](t);
      e[o].style.display = s ? "" : "none", s && (r = !0);
    }
    return r;
  };
}
class _Y {
  /**
  Creates a submenu for the given group of menu elements. The
  following options are recognized:
  */
  constructor(e, t = {}) {
    this.options = t, this.content = Array.isArray(e) ? e : [e];
  }
  /**
  Renders the submenu.
  */
  render(e) {
    let t = bc(this.content, e), r = e.dom.ownerDocument.defaultView || window, o = oe("div", { class: ee + "-submenu-label" }, rn(e, this.options.label || "")), s = oe("div", { class: ee + "-submenu-wrap" }, o, oe("div", { class: ee + "-submenu" }, t.dom)), i = null;
    o.addEventListener("mousedown", (c) => {
      c.preventDefault(), kc(c), to(s, ee + "-submenu-wrap-active", !1), i || r.addEventListener("mousedown", i = () => {
        xc(s) || (s.classList.remove(ee + "-submenu-wrap-active"), r.removeEventListener("mousedown", i), i = null);
      });
    });
    function l(c) {
      let a = t.update(c);
      return s.style.display = a ? "" : "none", a;
    }
    return { dom: s, update: l };
  }
}
function jY(n, e) {
  let t = document.createDocumentFragment(), r = [], o = [];
  for (let i = 0; i < e.length; i++) {
    let l = e[i], c = [], a = [];
    for (let u = 0; u < l.length; u++) {
      let { dom: f, update: h } = l[u].render(n), d = oe("span", { class: ee + "item" }, f);
      t.appendChild(d), a.push(d), c.push(h);
    }
    c.length && (r.push(Dc(c, a)), i < e.length - 1 && o.push(t.appendChild(LY())));
  }
  function s(i) {
    let l = !1, c = !1;
    for (let a = 0; a < r.length; a++) {
      let u = r[a](i);
      a && (o[a - 1].style.display = c && u ? "" : "none"), c = u, u && (l = !0);
    }
    return l;
  }
  return { dom: t, update: s };
}
function LY() {
  return oe("span", { class: ee + "separator" });
}
const le = {
  join: {
    width: 800,
    height: 900,
    path: "M0 75h800v125h-800z M0 825h800v-125h-800z M250 400h100v-100h100v100h100v100h-100v100h-100v-100h-100z"
  },
  lift: {
    width: 1024,
    height: 1024,
    path: "M219 310v329q0 7-5 12t-12 5q-8 0-13-5l-164-164q-5-5-5-13t5-13l164-164q5-5 13-5 7 0 12 5t5 12zM1024 749v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12zM1024 530v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 310v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 91v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12z"
  },
  selectParentNode: { text: "⬚", css: "font-weight: bold" },
  undo: {
    width: 1024,
    height: 1024,
    path: "M761 1024c113-206 132-520-313-509v253l-384-384 384-384v248c534-13 594 472 313 775z"
  },
  redo: {
    width: 1024,
    height: 1024,
    path: "M576 248v-248l384 384-384 384v-253c-446-10-427 303-313 509-280-303-221-789 313-775z"
  },
  strong: {
    width: 805,
    height: 1024,
    path: "M317 869q42 18 80 18 214 0 214-191 0-65-23-102-15-25-35-42t-38-26-46-14-48-6-54-1q-41 0-57 5 0 30-0 90t-0 90q0 4-0 38t-0 55 2 47 6 38zM309 442q24 4 62 4 46 0 81-7t62-25 42-51 14-81q0-40-16-70t-45-46-61-24-70-8q-28 0-74 7 0 28 2 86t2 86q0 15-0 45t-0 45q0 26 0 39zM0 950l1-53q8-2 48-9t60-15q4-6 7-15t4-19 3-18 1-21 0-19v-37q0-561-12-585-2-4-12-8t-25-6-28-4-27-2-17-1l-2-47q56-1 194-6t213-5q13 0 39 0t38 0q40 0 78 7t73 24 61 40 42 59 16 78q0 29-9 54t-22 41-36 32-41 25-48 22q88 20 146 76t58 141q0 57-20 102t-53 74-78 48-93 27-100 8q-25 0-75-1t-75-1q-60 0-175 6t-132 6z"
  },
  em: {
    width: 585,
    height: 1024,
    path: "M0 949l9-48q3-1 46-12t63-21q16-20 23-57 0-4 35-165t65-310 29-169v-14q-13-7-31-10t-39-4-33-3l10-58q18 1 68 3t85 4 68 1q27 0 56-1t69-4 56-3q-2 22-10 50-17 5-58 16t-62 19q-4 10-8 24t-5 22-4 26-3 24q-15 84-50 239t-44 203q-1 5-7 33t-11 51-9 47-3 32l0 10q9 2 105 17-1 25-9 56-6 0-18 0t-18 0q-16 0-49-5t-49-5q-78-1-117-1-29 0-81 5t-69 6z"
  },
  code: {
    width: 896,
    height: 1024,
    path: "M608 192l-96 96 224 224-224 224 96 96 288-320-288-320zM288 192l-288 320 288 320 96-96-224-224 224-224-96-96z"
  },
  link: {
    width: 951,
    height: 1024,
    path: "M832 694q0-22-16-38l-118-118q-16-16-38-16-24 0-41 18 1 1 10 10t12 12 8 10 7 14 2 15q0 22-16 38t-38 16q-8 0-15-2t-14-7-10-8-12-12-10-10q-18 17-18 41 0 22 16 38l117 118q15 15 38 15 22 0 38-14l84-83q16-16 16-38zM430 292q0-22-16-38l-117-118q-16-16-38-16-22 0-38 15l-84 83q-16 16-16 38 0 22 16 38l118 118q15 15 38 15 24 0 41-17-1-1-10-10t-12-12-8-10-7-14-2-15q0-22 16-38t38-16q8 0 15 2t14 7 10 8 12 12 10 10q18-17 18-41zM941 694q0 68-48 116l-84 83q-47 47-116 47-69 0-116-48l-117-118q-47-47-47-116 0-70 50-119l-50-50q-49 50-118 50-68 0-116-48l-118-118q-48-48-48-116t48-116l84-83q47-47 116-47 69 0 116 48l117 118q47 47 47 116 0 70-50 119l50 50q49-50 118-50 68 0 116 48l118 118q48 48 48 116z"
  },
  bulletList: {
    width: 768,
    height: 896,
    path: "M0 512h128v-128h-128v128zM0 256h128v-128h-128v128zM0 768h128v-128h-128v128zM256 512h512v-128h-512v128zM256 256h512v-128h-512v128zM256 768h512v-128h-512v128z"
  },
  orderedList: {
    width: 768,
    height: 896,
    path: "M320 512h448v-128h-448v128zM320 768h448v-128h-448v128zM320 128v128h448v-128h-448zM79 384h78v-256h-36l-85 23v50l43-2v185zM189 590c0-36-12-78-96-78-33 0-64 6-83 16l1 66c21-10 42-15 67-15s32 11 32 28c0 26-30 58-110 112v50h192v-67l-91 2c49-30 87-66 87-113l1-1z"
  },
  blockquote: {
    width: 640,
    height: 896,
    path: "M0 448v256h256v-256h-128c0 0 0-128 128-128v-128c0 0-256 0-256 256zM640 320v-128c0 0-256 0-256 256v256h256v-256h-128c0 0 0-128 128-128z"
  }
}, qY = new ye({
  title: "Join with above block",
  run: Zr,
  select: (n) => Zr(n),
  icon: le.join
}), RY = new ye({
  title: "Lift out of enclosing block",
  run: Kr,
  select: (n) => Kr(n),
  icon: le.lift
}), FY = new ye({
  title: "Select parent node",
  run: Xr,
  select: (n) => Xr(n),
  icon: le.selectParentNode
});
let BY = new ye({
  title: "Undo last change",
  run: nn,
  enable: (n) => nn(n),
  icon: le.undo
}), PY = new ye({
  title: "Redo last undone change",
  run: Tt,
  enable: (n) => Tt(n),
  icon: le.redo
});
function UY(n, e) {
  let t = {
    run(r, o) {
      return Ie(n, e.attrs)(r, o);
    },
    select(r) {
      return Ie(n, e.attrs)(r);
    }
  };
  for (let r in e)
    t[r] = e[r];
  return new ye(t);
}
function Or(n, e) {
  let t = B(n, e.attrs), r = {
    run: t,
    enable(o) {
      return t(o);
    },
    active(o) {
      let { $from: s, to: i, node: l } = o.selection;
      return l ? l.hasMarkup(n, e.attrs) : i <= s.end() && s.parent.hasMarkup(n, e.attrs);
    }
  };
  for (let o in e)
    r[o] = e[o];
  return new ye(r);
}
function to(n, e, t) {
  t ? n.classList.add(e) : n.classList.remove(e);
}
const yn = "ProseMirror-menubar";
function VY() {
  if (typeof navigator > "u")
    return !1;
  let n = navigator.userAgent;
  return !/Edge\/\d/.test(n) && /AppleWebKit/.test(n) && /Mobile\/\w+/.test(n);
}
function $Y(n) {
  return new ze({
    view(e) {
      return new QY(e, n);
    }
  });
}
class QY {
  constructor(e, t) {
    this.editorView = e, this.options = t, this.spacer = null, this.maxHeight = 0, this.widthForMaxHeight = 0, this.floating = !1, this.scrollHandler = null, this.wrapper = oe("div", { class: yn + "-wrapper" }), this.menu = this.wrapper.appendChild(oe("div", { class: yn })), this.menu.className = yn, e.dom.parentNode && e.dom.parentNode.replaceChild(this.wrapper, e.dom), this.wrapper.appendChild(e.dom);
    let { dom: r, update: o } = jY(this.editorView, this.options.content);
    if (this.contentUpdate = o, this.menu.appendChild(r), this.update(), t.floating && !VY()) {
      this.updateFloat();
      let s = GY(this.wrapper);
      this.scrollHandler = (i) => {
        let l = this.editorView.root;
        (l.body || l).contains(this.wrapper) ? this.updateFloat(i.target.getBoundingClientRect ? i.target : void 0) : s.forEach((c) => c.removeEventListener("scroll", this.scrollHandler));
      }, s.forEach((i) => i.addEventListener("scroll", this.scrollHandler));
    }
  }
  update() {
    this.contentUpdate(this.editorView.state), this.floating ? this.updateScrollCursor() : (this.menu.offsetWidth != this.widthForMaxHeight && (this.widthForMaxHeight = this.menu.offsetWidth, this.maxHeight = 0), this.menu.offsetHeight > this.maxHeight && (this.maxHeight = this.menu.offsetHeight, this.menu.style.minHeight = this.maxHeight + "px"));
  }
  updateScrollCursor() {
    let e = this.editorView.root.getSelection();
    if (!e.focusNode)
      return;
    let t = e.getRangeAt(0).getClientRects(), r = t[YY(e) ? 0 : t.length - 1];
    if (!r)
      return;
    let o = this.menu.getBoundingClientRect();
    if (r.top < o.bottom && r.bottom > o.top) {
      let s = HY(this.wrapper);
      s && (s.scrollTop -= o.bottom - r.top);
    }
  }
  updateFloat(e) {
    let t = this.wrapper, r = t.getBoundingClientRect(), o = e ? Math.max(0, e.getBoundingClientRect().top) : 0;
    if (this.floating)
      if (r.top >= o || r.bottom < this.menu.offsetHeight + 10)
        this.floating = !1, this.menu.style.position = this.menu.style.left = this.menu.style.top = this.menu.style.width = "", this.menu.style.display = "", this.spacer.parentNode.removeChild(this.spacer), this.spacer = null;
      else {
        let s = (t.offsetWidth - t.clientWidth) / 2;
        this.menu.style.left = r.left + s + "px", this.menu.style.display = r.top > (this.editorView.dom.ownerDocument.defaultView || window).innerHeight ? "none" : "", e && (this.menu.style.top = o + "px");
      }
    else if (r.top < o && r.bottom >= this.menu.offsetHeight + 10) {
      this.floating = !0;
      let s = this.menu.getBoundingClientRect();
      this.menu.style.left = s.left + "px", this.menu.style.width = s.width + "px", e && (this.menu.style.top = o + "px"), this.menu.style.position = "fixed", this.spacer = oe("div", { class: yn + "-spacer", style: `height: ${s.height}px` }), t.insertBefore(this.spacer, this.menu);
    }
  }
  destroy() {
    this.wrapper.parentNode && this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper);
  }
}
function YY(n) {
  return n.anchorNode == n.focusNode ? n.anchorOffset > n.focusOffset : n.anchorNode.compareDocumentPosition(n.focusNode) == Node.DOCUMENT_POSITION_FOLLOWING;
}
function HY(n) {
  for (let e = n.parentNode; e; e = e.parentNode)
    if (e.scrollHeight > e.clientHeight)
      return e;
}
function GY(n) {
  let e = [n.ownerDocument.defaultView || window];
  for (let t = n.parentNode; t; t = t.parentNode)
    e.push(t);
  return e;
}
function It(n, e = null) {
  return function(t, r) {
    let { $from: o, $to: s } = t.selection, i = o.blockRange(s), l = !1, c = i;
    if (!i)
      return !1;
    if (i.depth >= 2 && o.node(i.depth - 1).type.compatibleContent(n) && i.startIndex == 0) {
      if (o.index(i.depth - 1) == 0)
        return !1;
      let u = t.doc.resolve(i.start - 2);
      c = new wn(u, u, i.depth), i.endIndex < i.parent.childCount && (i = new wn(o, t.doc.resolve(s.end(i.depth)), i.depth)), l = !0;
    }
    let a = oo(c, n, e, i);
    return a ? (r && r(WY(t.tr, i, a, l, n).scrollIntoView()), !0) : !1;
  };
}
function WY(n, e, t, r, o) {
  let s = M.empty;
  for (let u = t.length - 1; u >= 0; u--)
    s = M.from(t[u].type.create(t[u].attrs, s));
  n.step(new $(e.start - (r ? 2 : 0), e.end, e.start, e.end, new D(s, 0, 0), t.length, !0));
  let i = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == o && (i = u + 1);
  let l = t.length - i, c = e.start + t.length - (r ? 2 : 0), a = e.parent;
  for (let u = e.startIndex, f = e.endIndex, h = !0; u < f; u++, h = !1)
    !h && xt(n.doc, c, l) && (n.split(c, l), c += 2 * l), c += a.child(u).nodeSize;
  return n;
}
function JY(n, e) {
  return function(t, r) {
    let { $from: o, $to: s, node: i } = t.selection;
    if (i && i.isBlock || o.depth < 2 || !o.sameParent(s))
      return !1;
    let l = o.node(-1);
    if (l.type != n)
      return !1;
    if (o.parent.content.size == 0 && o.node(-1).childCount == o.indexAfter(-1)) {
      if (o.depth == 3 || o.node(-3).type != n || o.index(-2) != o.node(-2).childCount - 1)
        return !1;
      if (r) {
        let f = M.empty, h = o.index(-1) ? 1 : o.index(-2) ? 2 : 3;
        for (let y = o.depth - h; y >= o.depth - 3; y--)
          f = M.from(o.node(y).copy(f));
        let d = o.indexAfter(-1) < o.node(-2).childCount ? 1 : o.indexAfter(-2) < o.node(-3).childCount ? 2 : 3;
        f = f.append(M.from(n.createAndFill()));
        let p = o.before(o.depth - (h - 1)), m = t.tr.replace(p, o.after(-d), new D(f, 4 - h, 0)), g = -1;
        m.doc.nodesBetween(p, m.doc.content.size, (y, k) => {
          if (g > -1)
            return !1;
          y.isTextblock && y.content.size == 0 && (g = k + 1);
        }), g > -1 && m.setSelection(I.near(m.doc.resolve(g))), r(m.scrollIntoView());
      }
      return !0;
    }
    let c = s.pos == o.end() ? l.contentMatchAt(0).defaultType : null, a = t.tr.delete(o.pos, s.pos), u = c ? [e ? { type: n, attrs: e } : null, { type: c }] : void 0;
    return xt(a.doc, o.pos, 2, u) ? (r && r(a.split(o.pos, 2, u).scrollIntoView()), !0) : !1;
  };
}
function ZY(n) {
  return function(e, t) {
    let { $from: r, $to: o } = e.selection, s = r.blockRange(o, (i) => i.childCount > 0 && i.firstChild.type == n);
    return s ? t ? r.node(s.depth - 1).type == n ? KY(e, t, n, s) : XY(e, t, s) : !0 : !1;
  };
}
function KY(n, e, t, r) {
  let o = n.tr, s = r.end, i = r.$to.end(r.depth);
  s < i && (o.step(new $(s - 1, i, s, i, new D(M.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new wn(o.doc.resolve(r.$from.pos), o.doc.resolve(i), r.depth));
  const l = on(r);
  if (l == null)
    return !1;
  o.lift(r, l);
  let c = o.mapping.map(s, -1) - 1;
  return vt(o.doc, c) && o.join(c), e(o.scrollIntoView()), !0;
}
function XY(n, e, t) {
  let r = n.tr, o = t.parent;
  for (let d = t.end, p = t.endIndex - 1, m = t.startIndex; p > m; p--)
    d -= o.child(p).nodeSize, r.delete(d - 1, d + 1);
  let s = r.doc.resolve(t.start), i = s.nodeAfter;
  if (r.mapping.map(t.end) != t.start + s.nodeAfter.nodeSize)
    return !1;
  let l = t.startIndex == 0, c = t.endIndex == o.childCount, a = s.node(-1), u = s.index(-1);
  if (!a.canReplace(u + (l ? 0 : 1), u + 1, i.content.append(c ? M.empty : M.from(o))))
    return !1;
  let f = s.pos, h = f + i.nodeSize;
  return r.step(new $(f - (l ? 1 : 0), h + (c ? 1 : 0), f + 1, h - 1, new D((l ? M.empty : M.from(o.copy(M.empty))).append(c ? M.empty : M.from(o.copy(M.empty))), l ? 0 : 1, c ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function eH(n) {
  return function(e, t) {
    let { $from: r, $to: o } = e.selection, s = r.blockRange(o, (a) => a.childCount > 0 && a.firstChild.type == n);
    if (!s)
      return !1;
    let i = s.startIndex;
    if (i == 0)
      return !1;
    let l = s.parent, c = l.child(i - 1);
    if (c.type != n)
      return !1;
    if (t) {
      let a = c.lastChild && c.lastChild.type == l.type, u = M.from(a ? n.create() : null), f = new D(M.from(n.create(null, M.from(l.type.create(null, u)))), a ? 3 : 1, 0), h = s.start, d = s.end;
      t(e.tr.step(new $(h - (a ? 3 : 1), d, h, d, f, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const Mn = "ProseMirror-prompt";
function Nc(n) {
  let e = document.body.appendChild(document.createElement("div"));
  e.className = Mn;
  let t = (h) => {
    e.contains(h.target) || r();
  };
  setTimeout(() => window.addEventListener("mousedown", t), 50);
  let r = () => {
    window.removeEventListener("mousedown", t), e.parentNode && e.parentNode.removeChild(e);
  }, o = [];
  for (let h in n.fields)
    o.push(n.fields[h].render());
  let s = document.createElement("button");
  s.type = "submit", s.className = Mn + "-submit", s.textContent = "OK";
  let i = document.createElement("button");
  i.type = "button", i.className = Mn + "-cancel", i.textContent = "Cancel", i.addEventListener("click", r);
  let l = e.appendChild(document.createElement("form"));
  n.title && (l.appendChild(document.createElement("h5")).textContent = n.title), o.forEach((h) => {
    l.appendChild(document.createElement("div")).appendChild(h);
  });
  let c = l.appendChild(document.createElement("div"));
  c.className = Mn + "-buttons", c.appendChild(s), c.appendChild(document.createTextNode(" ")), c.appendChild(i);
  let a = e.getBoundingClientRect();
  e.style.top = (window.innerHeight - a.height) / 2 + "px", e.style.left = (window.innerWidth - a.width) / 2 + "px";
  let u = () => {
    let h = tH(n.fields, o);
    h && (r(), n.callback(h));
  };
  l.addEventListener("submit", (h) => {
    h.preventDefault(), u();
  }), l.addEventListener("keydown", (h) => {
    h.keyCode == 27 ? (h.preventDefault(), r()) : h.keyCode == 13 && !(h.ctrlKey || h.metaKey || h.shiftKey) ? (h.preventDefault(), u()) : h.keyCode == 9 && window.setTimeout(() => {
      e.contains(document.activeElement) || r();
    }, 500);
  });
  let f = l.elements[0];
  f && f.focus();
}
function tH(n, e) {
  let t = /* @__PURE__ */ Object.create(null), r = 0;
  for (let o in n) {
    let s = n[o], i = e[r++], l = s.read(i), c = s.validate(l);
    if (c)
      return nH(i, c), null;
    t[o] = s.clean(l);
  }
  return t;
}
function nH(n, e) {
  let t = n.parentNode, r = t.appendChild(document.createElement("div"));
  r.style.left = n.offsetLeft + n.offsetWidth + 2 + "px", r.style.top = n.offsetTop - 5 + "px", r.className = "ProseMirror-invalid", r.textContent = e, setTimeout(() => t.removeChild(r), 1500);
}
class rH {
  /**
  Create a field with the given options. Options support by all
  field types are:
  */
  constructor(e) {
    this.options = e;
  }
  /**
  Read the field's value from its DOM node.
  */
  read(e) {
    return e.value;
  }
  /**
  A field-type-specific validation function.
  */
  validateType(e) {
    return null;
  }
  /**
  @internal
  */
  validate(e) {
    return !e && this.options.required ? "Required field" : this.validateType(e) || (this.options.validate ? this.options.validate(e) : null);
  }
  clean(e) {
    return this.options.clean ? this.options.clean(e) : e;
  }
}
class Gt extends rH {
  render() {
    let e = document.createElement("input");
    return e.type = "text", e.placeholder = this.options.label, e.value = this.options.value || "", e.autocomplete = "off", e;
  }
}
function wc(n, e) {
  let t = n.selection.$from;
  for (let r = t.depth; r >= 0; r--) {
    let o = t.index(r);
    if (t.node(r).canReplaceWith(o, o, e))
      return !0;
  }
  return !1;
}
function oH(n) {
  return new ye({
    title: "Insert image",
    label: "Image",
    enable(e) {
      return wc(e, n);
    },
    run(e, t, r) {
      let { from: o, to: s } = e.selection, i = null;
      e.selection instanceof C && e.selection.node.type == n && (i = e.selection.node.attrs), Nc({
        title: "Insert image",
        fields: {
          src: new Gt({ label: "Location", required: !0, value: i && i.src }),
          title: new Gt({ label: "Title", value: i && i.title }),
          alt: new Gt({
            label: "Description",
            value: i ? i.alt : e.doc.textBetween(o, s, " ")
          })
        },
        callback(l) {
          r.dispatch(r.state.tr.replaceSelectionWith(n.createAndFill(l))), r.focus();
        }
      });
    }
  });
}
function Cc(n, e) {
  let t = {
    label: e.title,
    run: n
  };
  for (let r in e)
    t[r] = e[r];
  return !e.enable && !e.select && (t[e.enable ? "enable" : "select"] = (r) => n(r)), new ye(t);
}
function no(n, e) {
  let { from: t, $from: r, to: o, empty: s } = n.selection;
  return s ? !!e.isInSet(n.storedMarks || r.marks()) : n.doc.rangeHasMark(t, o, e);
}
function zr(n, e) {
  let t = {
    active(r) {
      return no(r, n);
    }
  };
  for (let r in e)
    t[r] = e[r];
  return Cc(ce(n), t);
}
function sH(n) {
  return new ye({
    title: "Add or remove link",
    icon: le.link,
    active(e) {
      return no(e, n);
    },
    enable(e) {
      return !e.selection.empty;
    },
    run(e, t, r) {
      if (no(e, n))
        return ce(n)(e, t), !0;
      Nc({
        title: "Create a link",
        fields: {
          href: new Gt({
            label: "Link target",
            required: !0
          }),
          title: new Gt({ label: "Title" })
        },
        callback(o) {
          ce(n, o)(r.state, r.dispatch), r.focus();
        }
      });
    }
  });
}
function ki(n, e) {
  return Cc(It(n, e.attrs), e);
}
function iH(n) {
  let e = {}, t;
  (t = n.marks.strong) && (e.toggleStrong = zr(t, { title: "Toggle strong style", icon: le.strong })), (t = n.marks.em) && (e.toggleEm = zr(t, { title: "Toggle emphasis", icon: le.em })), (t = n.marks.code) && (e.toggleCode = zr(t, { title: "Toggle code font", icon: le.code })), (t = n.marks.link) && (e.toggleLink = sH(t));
  let r;
  if ((r = n.nodes.image) && (e.insertImage = oH(r)), (r = n.nodes.bullet_list) && (e.wrapBulletList = ki(r, {
    title: "Wrap in bullet list",
    icon: le.bulletList
  })), (r = n.nodes.ordered_list) && (e.wrapOrderedList = ki(r, {
    title: "Wrap in ordered list",
    icon: le.orderedList
  })), (r = n.nodes.blockquote) && (e.wrapBlockQuote = UY(r, {
    title: "Wrap in block quote",
    icon: le.blockquote
  })), (r = n.nodes.paragraph) && (e.makeParagraph = Or(r, {
    title: "Change to paragraph",
    label: "Plain"
  })), (r = n.nodes.code_block) && (e.makeCodeBlock = Or(r, {
    title: "Change to code block",
    label: "Code"
  })), r = n.nodes.heading)
    for (let s = 1; s <= 10; s++)
      e["makeHead" + s] = Or(r, {
        title: "Change to heading " + s,
        label: "Level " + s,
        attrs: { level: s }
      });
  if (r = n.nodes.horizontal_rule) {
    let s = r;
    e.insertHorizontalRule = new ye({
      title: "Insert horizontal rule",
      label: "Horizontal rule",
      enable(i) {
        return wc(i, s);
      },
      run(i, l) {
        l(i.tr.replaceSelectionWith(s.create()));
      }
    });
  }
  let o = (s) => s.filter((i) => i);
  return e.insertMenu = new Mi(o([e.insertImage, e.insertHorizontalRule]), { label: "Insert" }), e.typeMenu = new Mi(o([e.makeParagraph, e.makeCodeBlock, e.makeHead1 && new _Y(o([
    e.makeHead1,
    e.makeHead2,
    e.makeHead3,
    e.makeHead4,
    e.makeHead5,
    e.makeHead6
  ]), { label: "Heading" })]), { label: "Type..." }), e.inlineMenu = [o([e.toggleStrong, e.toggleEm, e.toggleCode, e.toggleLink])], e.blockMenu = [o([
    e.wrapBulletList,
    e.wrapOrderedList,
    e.wrapBlockQuote,
    qY,
    RY,
    FY
  ])], e.fullMenu = e.inlineMenu.concat([[e.insertMenu, e.typeMenu]], [[BY, PY]], e.blockMenu), e;
}
const xi = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function lH(n, e) {
  let t = {}, r;
  function o(s, i) {
    if (e) {
      let l = e[s];
      if (l === !1)
        return;
      l && (s = l);
    }
    t[s] = i;
  }
  if (o("Mod-z", nn), o("Shift-Mod-z", Tt), o("Backspace", bQ), xi || o("Mod-y", Tt), o("Alt-ArrowUp", Zr), o("Alt-ArrowDown", cY), o("Mod-BracketLeft", Kr), o("Escape", Xr), (r = n.marks.strong) && (o("Mod-b", ce(r)), o("Mod-B", ce(r))), (r = n.marks.em) && (o("Mod-i", ce(r)), o("Mod-I", ce(r))), (r = n.marks.code) && o("Mod-`", ce(r)), (r = n.nodes.bullet_list) && o("Shift-Ctrl-8", It(r)), (r = n.nodes.ordered_list) && o("Shift-Ctrl-9", It(r)), (r = n.nodes.blockquote) && o("Ctrl->", Ie(r)), r = n.nodes.hard_break) {
    let s = r, i = ue(pc, (l, c) => (c && c(l.tr.replaceSelectionWith(s.create()).scrollIntoView()), !0));
    o("Mod-Enter", i), o("Shift-Enter", i), xi && o("Ctrl-Enter", i);
  }
  if ((r = n.nodes.list_item) && (o("Enter", JY(r)), o("Mod-[", ZY(r)), o("Mod-]", eH(r))), (r = n.nodes.paragraph) && o("Shift-Ctrl-0", B(r)), (r = n.nodes.code_block) && o("Shift-Ctrl-\\", B(r)), r = n.nodes.heading)
    for (let s = 1; s <= 6; s++)
      o("Shift-Ctrl-" + s, B(r, { level: s }));
  if (r = n.nodes.horizontal_rule) {
    let s = r;
    o("Mod-_", (i, l) => (l && l(i.tr.replaceSelectionWith(s.create()).scrollIntoView()), !0));
  }
  return t;
}
function cH(n) {
  return Ze(/^\s*>\s$/, n);
}
function aH(n) {
  return Ze(/^(\d+)\.\s$/, n, (e) => ({ order: +e[1] }), (e, t) => t.childCount + t.attrs.order == +e[1]);
}
function uH(n) {
  return Ze(/^\s*([-+*])\s$/, n);
}
function fH(n) {
  return Jn(/^```$/, n);
}
function hH(n, e) {
  return Jn(new RegExp("^(#{1," + e + "})\\s$"), n, (t) => ({ level: t[1].length }));
}
function dH(n) {
  let e = TQ.concat(NQ, DQ), t;
  return (t = n.nodes.blockquote) && e.push(cH(t)), (t = n.nodes.ordered_list) && e.push(aH(t)), (t = n.nodes.bullet_list) && e.push(uH(t)), (t = n.nodes.code_block) && e.push(fH(t)), (t = n.nodes.heading) && e.push(hH(t, 6)), ec({ rules: e });
}
function pH(n) {
  let e = [
    dH(n.schema),
    pi(lH(n.schema, n.mapKeys)),
    pi(xY),
    bY(),
    CY()
  ];
  return n.menuBar !== !1 && e.push($Y({
    floating: n.floatingMenu !== !1,
    content: n.menuContent || iH(n.schema).fullMenu
  })), n.history !== !1 && e.push(tY()), e.concat(new ze({
    props: {
      attributes: { class: "ProseMirror-example-setup-style" }
    }
  }));
}
class mH {
  constructor(e, t) {
    this.items = e, this.dom = document.createElement("div"), this.dom.className = "menubar govuk-button-group", this.dom.role = "toolbar", e.forEach(({ command: r, dom: o, customHandler: s }, i) => {
      const l = this.dom.appendChild(o);
      l.setAttribute("tabindex", i === 0 ? 0 : -1), l.addEventListener("keyup", (c) => {
        c.key === "ArrowLeft" && this.focusPreviousButton(l), c.key === "ArrowRight" && this.focusNextButton(l);
      }), l.addEventListener("click", (c) => {
        c.preventDefault(), s ? s(t.state, t.dispatch, t) : (r(t.state, t.dispatch, t), t.focus());
      });
    }), this.update(t), t.dom.parentNode.insertBefore(this.dom, t.dom);
  }
  focusPreviousButton(e) {
    let t = e.previousElementSibling;
    for (; t && t.disabled; )
      t = t.previousElementSibling;
    t && (e.setAttribute("tabindex", -1), t.setAttribute("tabindex", 0), t.focus());
  }
  focusNextButton(e) {
    let t = e.nextElementSibling;
    for (; t && t.disabled; )
      t = t.nextElementSibling;
    t && (e.setAttribute("tabindex", -1), t.setAttribute("tabindex", 0), t.focus());
  }
  update(e) {
    const t = this.dom.querySelector('[tabindex="0"]');
    if (this.items.forEach(({ command: o, dom: s, update: i }) => {
      const l = o(e.state, null, e);
      s.disabled = !l, i && i(e);
    }), !t || !t.disabled)
      return;
    const r = this.dom.querySelector("button:not(:disabled)");
    r && (t.setAttribute("tabindex", -1), r.setAttribute("tabindex", 0));
  }
  destroy() {
    this.dom.remove();
  }
}
const gH = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNyAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjY3MSAxMi4yMzc1SDMuNjY2ODRWMjAuMDAwN0gwVjEuNTYxNzFIMy42NzczMlY4Ljg5NTRIMTEuNjgxNVYxLjU2MTcxSDE1LjM1ODhWMjAuMDAwN0gxMS42OTJMMTEuNjcxIDEyLjIzNzVaTTIyLjI3MzQgMi4xMTY5OEMyMS45OTQgMi4xMTA4NyAyMS43MTYxIDIuMTYwNzQgMjEuNDU2MyAyLjI2MzY1QzIxLjIzNDQgMi4zNTcwNSAyMS4wMzcyIDIuNTAwNDggMjAuODggMi42ODI3MkMyMC43MjYxIDIuODY2ODcgMjAuNjEyIDMuMDgwOSAyMC41NDQ4IDMuMzExMzJDMjAuNDcxMSAzLjU2MzAxIDIwLjQzNTggMy44MjQzNyAyMC40NCA0LjA4NjZMMTguMDgyOCAzLjg3NzA2QzE4LjA3NDEgMy4zMDg2NSAxOC4xODQ3IDIuNzQ0NzQgMTguNDA3NSAyLjIyMTc0QzE4LjYxMjYgMS43NTY3OSAxOC45MTY1IDEuMzQyMDggMTkuMjk4MSAxLjAwNjQ1QzE5LjY5MzcgMC42Njk3NDMgMjAuMTUzNCAwLjQxNjcwMyAyMC42NDk2IDAuMjYyNjAzQzIxLjE4NyAwLjA4NTkxMjEgMjEuNzQ5NiAtMC4wMDI1MzkzNiAyMi4zMTUzIDAuMDAwNjg1OTMyQzIyLjkwMyAtMC4wMDg5NjAzIDIzLjQ4NzggMC4wODMxOTg4IDI0LjA0NCAwLjI3MzA4QzI0LjUzODggMC40NDMzMzggMjQuOTk0NiAwLjcxMDQ1NSAyNS4zODUgMS4wNTg4M0MyNS43NTQ1IDEuMzk0MTcgMjYuMDQ3NSAxLjgwNTA4IDI2LjI0NDEgMi4yNjM2NUMyNi40NTQ5IDIuNzUzMjIgMjYuNTYyIDMuMjgxMTggMjYuNTU4NCAzLjgxNDJDMjYuNTYyOSA0LjQwNjgxIDI2LjQzNzcgNC45OTMyMyAyNi4xOTE3IDUuNTMyMzhDMjUuOTQzNCA2LjA3NDM2IDI1LjYxNSA2LjU3NTg3IDI1LjIxNzQgNy4wMjAwN0MyNC43OTExIDcuNDg4MTIgMjQuMzEzMSA3LjkwNjM3IDIzLjc5MjYgOC4yNjY3OUMyMy4yNzA3IDguNjUwNjIgMjIuNzI0OCA5LjAwMDU3IDIyLjE1ODIgOS4zMTQ0NkwyMS45NDg3IDkuNDI5NzFIMjYuNjk0NlYxMS41MjVIMTguMzk3MVY5LjQyOTcxQzE4LjgyMzEgOS4xOTkyMiAxOS4yNTk2IDguOTUxMjcgMTkuNzA2NyA4LjY4NTg2QzIwLjE1MzcgOC40MjA0NSAyMC41ODY3IDguMTQ0NTcgMjEuMDA1OCA3Ljg1ODJDMjEuNDI0OCA3LjU3MTg0IDIxLjgyMjkgNy4yNzE1MSAyMi4yMDAxIDYuOTU3MjFDMjIuNTU0MyA2LjY2NzA0IDIyLjg4MDUgNi4zNDQzNSAyMy4xNzQ0IDUuOTkzMzVDMjMuNDM5NiA1LjY3NDc0IDIzLjY2MTYgNS4zMjI0NiAyMy44MzQ1IDQuOTQ1NjhDMjMuOTg3MiA0LjYxNzE4IDI0LjA2OTMgNC4yNjAyNSAyNC4wNzU0IDMuODk4MDFDMjQuMDczOCAzLjY3OTk3IDI0LjAzNDkgMy40NjM4MSAyMy45NjAyIDMuMjU4OTRDMjMuODg2MSAzLjA1MzU1IDIzLjc3MjIgMi44NjQ4NCAyMy42MjQ5IDIuNzAzNjdDMjMuNDY5NiAyLjUzNjM5IDIzLjI4MDMgMi40MDQyMyAyMy4wNjk3IDIuMzE2MDNDMjIuODIxNiAyLjE5MzMgMjIuNTUwMSAyLjEyNTQxIDIyLjI3MzQgMi4xMTY5OFoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=", yH = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjkiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyOSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03Ljc0MTkzIDMuODcwOTdDNy43NDE5MyA2LjAwODg0IDYuMDA4ODQgNy43NDE5NCAzLjg3MDk3IDcuNzQxOTRDMS43MzMwOSA3Ljc0MTk0IDAgNi4wMDg4NCAwIDMuODcwOTdDMCAxLjczMzA5IDEuNzMzMDkgMCAzLjg3MDk3IDBDNi4wMDg4NCAwIDcuNzQxOTMgMS43MzMwOSA3Ljc0MTkzIDMuODcwOTdaTTExLjI5MDMgNS40NDQwNFYyLjI1ODA2SDI4LjA2NDVWNS40NDQwNEgxMS4yOTAzWk0xMS4yOTAzIDE3Ljc0MTlWMTQuNTU1OUgyOC4wNjQ1VjE3Ljc0MTlIMTEuMjkwM1pNMy44NzA5NyAyMEM2LjAwODg0IDIwIDcuNzQxOTMgMTguMjY2OSA3Ljc0MTkzIDE2LjEyOUM3Ljc0MTkzIDEzLjk5MTIgNi4wMDg4NCAxMi4yNTgxIDMuODcwOTcgMTIuMjU4MUMxLjczMzA5IDEyLjI1ODEgMCAxMy45OTEyIDAgMTYuMTI5QzAgMTguMjY2OSAxLjczMzA5IDIwIDMuODcwOTcgMjBaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K", MH = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuNjQ3NDUgNS44MjY2MVYyLjgwMjQySDI1LjMyMjlWNS44MjY2MUg5LjY0NzQ1Wk05LjY0NzQ1IDE3LjUyMDJWMTQuNDk2SDI1LjMyMjlWMTcuNTIwMkg5LjY0NzQ1Wk0zLjk0MTggMFY2Ljk4NTg5SDUuNzE2VjguNTM4MzFIMC40MjM2NlY2Ljk4NTg5SDIuMTg3NzdWMi45MDMyMkgwLjQxMzU3OVYxLjM0MDczSDEuMDA4MzRDMS4yMTg4OSAxLjM0NTIxIDEuNDI5MDkgMS4zMjE0OCAxLjYzMzM0IDEuMjcwMTZDMS43NzQ2OCAxLjIzNTAzIDEuOTAzNjkgMS4xNjE4MSAyLjAwNjMyIDEuMDU4NDdDMi4wOTg3NCAwLjk1NjI5MSAyLjE2MTQ4IDAuODMwODA1IDIuMTg3NzcgMC42OTU1NjRDMi4yMDU5NyAwLjUxNzkzOCAyLjIwNTk3IDAuMzM4OTE3IDIuMTg3NzcgMC4xNjEyOVYwLjAxMDA3OTlMMy45NDE4IDBaTTIuOTg0MTQgMTMuMzE2NUMyLjc4NzA3IDEzLjMxNDEgMi41OTE1NiAxMy4zNTE4IDIuNDA5NTUgMTMuNDI3NEMyLjI1MDA3IDEzLjQ5NDYgMi4xMDg1MiAxMy41OTgyIDEuOTk2MjQgMTMuNzI5OEMxLjg4NjAxIDEzLjg1OTUgMS44MDM2NSAxNC4wMTA1IDEuNzU0MyAxNC4xNzM0QzEuNjk5ODEgMTQuMzUzMSAxLjY3MjYyIDE0LjU0IDEuNjczNjYgMTQuNzI3OEwwLjAwMDI3MjcxMyAxNC41NzY2Qy0wLjAwNTI2ODc2IDE0LjE3MTYgMC4wNzM2OTYyIDEzLjc2OTkgMC4yMzIxMjcgMTMuMzk3MkMwLjM3NTUzNCAxMy4wNjY1IDAuNTg4NzM5IDEyLjc3MDggMC44NTcxMjcgMTIuNTMwMkMxLjEzMDg0IDEyLjI5MTQgMS40NDk2IDEyLjEwOTcgMS43OTQ2MyAxMS45OTZDMi4xNzUzMiAxMS44NzE5IDIuNTczNjggMTEuODEwNiAyLjk3NDA2IDExLjgxNDVDMy4zODkyNSAxMS44MTA3IDMuODAxOTYgMTEuODc4OSA0LjE5MzgyIDEyLjAxNjFDNC41NDMzNyAxMi4xMzYyIDQuODY1NSAxMi4zMjQ2IDUuMTQxNCAxMi41NzA2QzUuNDA2MzggMTIuODExOSA1LjYxNjEzIDEzLjEwNzYgNS43NTYzMiAxMy40Mzc1QzUuOTA1NjUgMTMuNzg4IDUuOTgxMTUgMTQuMTY1NCA1Ljk3ODEgMTQuNTQ2NEM1Ljk4MTMgMTQuOTcwNSA1Ljg5MTg1IDE1LjM5MDIgNS43MTYgMTUuNzc2MkM1LjUzODM5IDE2LjE2MTggNS4zMDM5MyAxNi41MTg2IDUuMDIwNDMgMTYuODM0N0M0LjcxODc0IDE3LjE2NzIgNC4zODA1OSAxNy40NjQ4IDQuMDEyMzcgMTcuNzIxOEMzLjY0MTc4IDE3Ljk4ODEgMy4yNTQ1NyAxOC4yMzA2IDIuODUzMSAxOC40NDc2TDIuNzAxODggMTguNTI4Mkg2LjA2ODgyVjIwSDAuMjMyMTI3VjE4LjUzODNMMS4xNTk1NSAxOC4wMDRDMS40NzU0MSAxNy44MTU5IDEuNzgxMTkgMTcuNjE3NiAyLjA3Njg5IDE3LjQwOTNDMi4zNzI1OCAxNy4yMDA5IDIuNjU0ODQgMTYuOTg1OSAyLjkyMzY2IDE2Ljc2NDFDMy4xNzY3NiAxNi41NTQ1IDMuNDA5NjQgMTYuMzIxNyAzLjYxOTIyIDE2LjA2ODVDMy44MDUwNSAxNS44NDQ0IDMuOTYwOTMgMTUuNTk3IDQuMDgyOTMgMTUuMzMyN0M0LjE5NjYgMTUuMDg2MiA0LjI1NTA4IDE0LjgxNzggNC4yNTQzIDE0LjU0NjRDNC4yNTMyMSAxNC4zOTE3IDQuMjI1OTQgMTQuMjM4MyA0LjE3MzY2IDE0LjA5MjdDNC4xMjM2NiAxMy45NDQ0IDQuMDQ0ODcgMTMuODA3NCAzLjk0MTggMTMuNjg5NUMzLjgzMjQ5IDEzLjU2ODQgMy42OTg0MSAxMy40NzIxIDMuNTQ4NjYgMTMuNDA3M0MzLjM2OTA0IDEzLjMzNzQgMy4xNzY2MiAxMy4zMDY1IDIuOTg0MTQgMTMuMzE2NVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=", kH = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaTTEyLjk1ODcgMTUuODE4MlY2TDEwLjQ5MzUgNi4wMTQxN1Y2LjIyNjY4QzEwLjUxOTEgNi40NzYzMiAxMC41MTkxIDYuNzI3OTMgMTAuNDkzNSA2Ljk3NzU3QzEwLjQ1NjYgNy4xNjc2NCAxMC4zNjg0IDcuMzQ0IDEwLjIzODUgNy40ODc2QzEwLjA5NDIgNy42MzI4NCA5LjkxMjk0IDcuNzM1NzUgOS43MTQyOSA3Ljc4NTEyQzkuNDI3MjMgNy44NTcyNSA5LjEzMTggNy44OTA2IDguODM1ODkgNy44ODQzSDhWMTAuMDgwM0gxMC40OTM1VjE1LjgxODJIOC4wMTQxN1YxOEgxNS40NTIyVjE1LjgxODJIMTIuOTU4N1oiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=", xH = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4Ljg3MjMgMS4wODA4NEMxOC41Mjg4IDAuNzM2NTcxIDE4LjEyMDQgMC40NjM3OTUgMTcuNjcwOCAwLjI3ODI4MUMxNy4yMjEzIDAuMDkyNzY2NiAxNi43Mzk0IC0wLjAwMTgwNzE4IDE2LjI1MyAyLjYxNTI2ZS0wNUMxNS43NjYxIDQuNjU4OTRlLTA2IDE1LjI4MzkgMC4wOTYzNTU2IDE0LjgzNDQgMC4yODM1MjZDMTQuMzg0OCAwLjQ3MDY5NSAxMy45NzY4IDAuNzQ0OTgzIDEzLjYzMzcgMS4wOTA1OEwxMC42MjUgNC4xMTg4MkMxMC4xNDY2IDQuNTk5NzIgOS44MDkzMSA1LjIwMjU2IDkuNjQ5NjYgNS44NjE3OUM5LjQ5IDYuNTIxMDEgOS41MTQxMyA3LjIxMTM5IDkuNzE5NDMgNy44NTc4Nkw5LjgwNzA2IDguMTMwNUwxMS4yODcxIDYuNjQwNzNWNi41NzI1N0MxMS4zMjA3IDYuMTA1OTEgMTEuNTIxMiA1LjY2NjkzIDExLjg1MTkgNS4zMzU5NkwxNC44NDExIDIuMzE3NDZDMTUuMDI0IDIuMTMzMzIgMTUuMjQxMyAxLjk4NzAxIDE1LjQ4MDcgMS44ODY4N0MxNS43MjAxIDEuNzg2NzMgMTUuOTc2OSAxLjczNDcyIDE2LjIzNjQgMS43MzM4MkMxNi40OTU5IDEuNzMyOTEgMTYuNzUzIDEuNzgzMTMgMTYuOTkzMSAxLjg4MTZDMTcuMjMzMiAxLjk4MDA3IDE3LjQ1MTYgMi4xMjQ4NiAxNy42MzU3IDIuMzA3NzJDMTcuODE5OCAyLjQ5MDU3IDE3Ljk2NjEgMi43MDc5IDE4LjA2NjMgMi45NDczQzE4LjE2NjQgMy4xODY3IDE4LjIxODQgMy40NDM0OCAxOC4yMTkzIDMuNzAyOThDMTguMjIwMiAzLjk2MjQ3IDE4LjE3IDQuMjE5NjEgMTguMDcxNSA0LjQ1OTdDMTcuOTczMSA0LjY5OTc5IDE3LjgyODMgNC45MTgxMyAxNy42NDU0IDUuMTAyMjdMMTQuNjM2NyA4LjEzMDVDMTQuMzA3MiA4LjQ2NDc2IDEzLjg2OCA4LjY2ODc3IDEzLjQwMDEgOC43MDQ5OUgxMy4zMzE5TDExLjg1MTkgMTAuMTk0OEwxMi4xMjQ1IDEwLjI4MjRDMTIuNzcyNyAxMC40ODUzIDEzLjQ2NDEgMTAuNTA2MyAxNC4xMjM1IDEwLjM0MzJDMTQuNzgyOCAxMC4xODAxIDE1LjM4NDcgOS44MzkwNiAxNS44NjM1IDkuMzU3MzhMMTguODcyMyA2LjMyOTE0QzE5LjU2NjIgNS42MzIwOCAxOS45NTU4IDQuNjg4NTUgMTkuOTU1OCAzLjcwNDk5QzE5Ljk1NTggMi43MjE0MyAxOS41NjYyIDEuNzc3OTEgMTguODcyMyAxLjA4MDg0Wk0xMC4xNTc2IDExLjkwODVMOC42Nzc1NiAxMy4zOTgzVjEzLjQ2NjRDOC42NDM5NyAxMy45MzMxIDguNDQzNDkgMTQuMzcyMSA4LjExMjgxIDE0LjcwM0w1LjEwNDA0IDE3LjcyMTVDNC43Mjk1OSAxOC4wOTM0IDQuMjIyNzUgMTguMzAxMyAzLjY5NTAyIDE4LjI5OTVDMy4xNjcyOSAxOC4yOTc2IDIuNjYxOSAxOC4wODYzIDIuMjkwMDIgMTcuNzExOEMxLjkxODE1IDE3LjMzNzQgMS43MTAyNiAxNi44MzA1IDEuNzEyMDkgMTYuMzAyOEMxLjcxMzkyIDE1Ljc3NSAxLjkyNTMxIDE1LjI2OTcgMi4yOTk3NiAxNC44OTc4TDUuMzA4NTIgMTEuODY5NUM1LjYzODAzIDExLjUzNTMgNi4wNzcxNyAxMS4zMzEzIDYuNTQ1MTMgMTEuMjk1MUg2LjYxMzI5TDguMDkzMzMgOS44MDUyOEw3LjgyMDcgOS43MTc2NUM3LjE3Mzg2IDkuNTE2NyA2LjQ4NDM2IDkuNDk2NjggNS44MjY5NiA5LjY1OTc0QzUuMTY5NTUgOS44MjI4MSA0LjU2OTMzIDEwLjE2MjcgNC4wOTEzOSAxMC42NDI3TDEuMDgyNjIgMTMuNjcwOUMwLjU2NDgwOCAxNC4xOTAzIDAuMjEyNTU4IDE0Ljg1MTUgMC4wNzAzNzk0IDE1LjU3MUMtMC4wNzE3OTg5IDE2LjI5MDUgMC4wMDI0NzQzOCAxNy4wMzYgMC4yODM4MTYgMTcuNzEzM0MwLjU2NTE1NyAxOC4zOTA2IDEuMDQwOTQgMTguOTY5MyAxLjY1MTA1IDE5LjM3NjNDMi4yNjExNyAxOS43ODMzIDIuOTc4MjMgMjAuMDAwNCAzLjcxMTY0IDIwQzQuMTk4NTkgMjAgNC42ODA3MyAxOS45MDM3IDUuMTMwMjcgMTkuNzE2NUM1LjU3OTgxIDE5LjUyOTQgNS45ODc4NyAxOS4yNTUxIDYuMzMwOTIgMTguOTA5NUw5LjMzOTY4IDE1Ljg4MTJDOS44MTg5NCAxNS40MDA5IDEwLjE1NjkgMTQuNzk4MSAxMC4zMTY2IDE0LjEzODdDMTAuNDc2MyAxMy40NzkyIDEwLjQ1MTYgMTIuNzg4NSAxMC4yNDUyIDEyLjE0MjJMMTAuMTU3NiAxMS45MDg1Wk0xMy41MDcyIDUuMzA2NzRMNS4zOTYxNiAxMy40NTY3TDUuMjY5NTggMTMuNTgzM0w2LjQ0Nzc2IDE0Ljc1MTdMMTQuNTU4OCA2LjYwMTc4TDE0LjY3NTYgNi40NzUyTDEzLjUwNzIgNS4zMDY3NFoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=", bH = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAzMCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDguMzY5MjNMMjEuNjYxNSAyLjMwNzY5SDIuMzM4NDZMMTIgOC4zNjkyM1pNMTIgMTAuNzA3N0wyLjMwNzY5IDQuNjE1MzlWMTYuODMwOEgxNC45NzgyTDEyLjc1IDE5LjEzODVIMi4zMDc2OUMxLjY3MzA3IDE5LjEzODUgMCAxOS4xMzg1IDAgMTkuMTM4NUMwIDE5LjEzODUgMCAxNy40NjU0IDAgMTYuODMwOFYyLjMwNzY5QzAgMS42NzMwNyAwIDAgMCAwQzAgMCAxLjY3MzA3IDAgMi4zMDc2OSAwSDIxLjY5MjNDMjIuMzI2OSAwIDI0IDAgMjQgMEMyNCAwIDI0IDEuNjczMDcgMjQgMi4zMDc2OVY3LjgzMDc3TDIxLjY5MjMgMTAuMTM4NVY0LjYxNTM5TDEyIDEwLjcwNzdaIiBmaWxsPSIjMUMxQjFGIi8+CjxwYXRoIGQ9Ik0yOC40NjY5IDkuNjc1MjZDMjguMjA4NiA5LjQxNzA1IDI3LjkwMTcgOS4yMTI0NyAyNy41NjM4IDkuMDczMzNDMjcuMjI1OCA4LjkzNDIgMjYuODYzNiA4Ljg2MzI3IDI2LjQ5OCA4Ljg2NDY0QzI2LjEzMiA4Ljg2NDYzIDI1Ljc2OTYgOC45MzY4OSAyNS40MzE3IDkuMDc3MjdDMjUuMDkzOCA5LjIxNzY1IDI0Ljc4NzEgOS40MjMzNiAyNC41MjkyIDkuNjgyNTZMMjIuMjY3NiAxMS45NTM3QzIxLjkwODEgMTIuMzE0NCAyMS42NTQ1IDEyLjc2NjUgMjEuNTM0NSAxMy4yNjFDMjEuNDE0NSAxMy43NTU0IDIxLjQzMjcgMTQuMjczMiAyMS41ODcgMTQuNzU4TDIxLjY1MjkgMTQuOTYyNUwyMi43NjUzIDEzLjg0NTJWMTMuNzk0QzIyLjc5MDYgMTMuNDQ0IDIyLjk0MTMgMTMuMTE0OCAyMy4xODk4IDEyLjg2NjZMMjUuNDM2OCAxMC42MDI3QzI1LjU3NDIgMTAuNDY0NiAyNS43Mzc2IDEwLjM1NDkgMjUuOTE3NSAxMC4yNzk4QzI2LjA5NzUgMTAuMjA0NyAyNi4yOTA1IDEwLjE2NTcgMjYuNDg1NSAxMC4xNjVDMjYuNjgwNiAxMC4xNjQzIDI2Ljg3MzkgMTAuMjAyIDI3LjA1NDMgMTAuMjc1OEMyNy4yMzQ4IDEwLjM0OTcgMjcuMzk4OSAxMC40NTgzIDI3LjUzNzMgMTAuNTk1NEMyNy42NzU3IDEwLjczMjYgMjcuNzg1NyAxMC44OTU1IDI3Ljg2MSAxMS4wNzUxQzI3LjkzNjMgMTEuMjU0NiAyNy45NzU0IDExLjQ0NzIgMjcuOTc2IDExLjY0MTlDMjcuOTc2NyAxMS44MzY1IDI3LjkzOSAxMi4wMjkzIDI3Ljg2NSAxMi4yMDk0QzI3Ljc5MDkgMTIuMzg5NSAyNy42ODIxIDEyLjU1MzIgMjcuNTQ0NyAxMi42OTEzTDI1LjI4MzEgMTQuOTYyNUMyNS4wMzU0IDE1LjIxMzIgMjQuNzA1MyAxNS4zNjYyIDI0LjM1MzYgMTUuMzkzNEgyNC4zMDIzTDIzLjE4OTggMTYuNTEwN0wyMy4zOTQ4IDE2LjU3NjRDMjMuODgyIDE2LjcyODYgMjQuNDAxNyAxNi43NDQzIDI0Ljg5NzMgMTYuNjIyQzI1LjM5MjkgMTYuNDk5NyAyNS44NDUzIDE2LjI0MzkgMjYuMjA1MyAxNS44ODI2TDI4LjQ2NjkgMTMuNjExNUMyOC45ODg0IDEzLjA4ODcgMjkuMjgxMyAxMi4zODEgMjkuMjgxMyAxMS42NDM0QzI5LjI4MTMgMTAuOTA1NyAyOC45ODg0IDEwLjE5ODEgMjguNDY2OSA5LjY3NTI2Wk0yMS45MTYzIDE3Ljc5NkwyMC44MDM4IDE4LjkxMzNWMTguOTY0NEMyMC43Nzg2IDE5LjMxNDQgMjAuNjI3OSAxOS42NDM3IDIwLjM3OTMgMTkuODkxOUwxOC4xMTc4IDIyLjE1NThDMTcuODM2MyAyMi40MzQ3IDE3LjQ1NTMgMjIuNTkwNiAxNy4wNTg3IDIyLjU4OTJDMTYuNjYyIDIyLjU4NzggMTYuMjgyMSAyMi40MjkzIDE2LjAwMjYgMjIuMTQ4NUMxNS43MjMxIDIxLjg2NzYgMTUuNTY2OCAyMS40ODc1IDE1LjU2ODIgMjEuMDkxN0MxNS41Njk1IDIwLjY5NTkgMTUuNzI4NCAyMC4zMTY5IDE2LjAwOTkgMjAuMDM3OUwxOC4yNzE1IDE3Ljc2NjhDMTguNTE5MSAxNy41MTYxIDE4Ljg0OTIgMTcuMzYzMSAxOS4yMDEgMTcuMzM1OUgxOS4yNTIyTDIwLjM2NDcgMTYuMjE4NkwyMC4xNTk4IDE2LjE1MjlDMTkuNjczNiAxNi4wMDIxIDE5LjE1NTMgMTUuOTg3MSAxOC42NjEyIDE2LjEwOTRDMTguMTY3IDE2LjIzMTcgMTcuNzE1OCAxNi40ODY3IDE3LjM1NjYgMTYuODQ2NkwxNS4wOTUgMTkuMTE3OEMxNC43MDU4IDE5LjUwNzMgMTQuNDQxIDIwLjAwMzIgMTQuMzM0MiAyMC41NDI5QzE0LjIyNzMgMjEuMDgyNSAxNC4yODMxIDIxLjY0MTYgMTQuNDk0NiAyMi4xNDk2QzE0LjcwNjEgMjIuNjU3NiAxNS4wNjM3IDIzLjA5MTYgMTUuNTIyMyAyMy4zOTY5QzE1Ljk4MDkgMjMuNzAyMSAxNi41MTk5IDIzLjg2NDkgMTcuMDcxMiAyMy44NjQ2QzE3LjQzNzIgMjMuODY0NiAxNy43OTk2IDIzLjc5MjQgMTguMTM3NSAyMy42NTJDMTguNDc1NCAyMy41MTE2IDE4Ljc4MjEgMjMuMzA1OSAxOS4wNCAyMy4wNDY3TDIxLjMwMTUgMjAuNzc1NUMyMS42NjE4IDIwLjQxNTMgMjEuOTE1OCAxOS45NjMyIDIyLjAzNTkgMTkuNDY4NkMyMi4xNTU5IDE4Ljk3NCAyMi4xMzczIDE4LjQ1NiAyMS45ODIyIDE3Ljk3MTNMMjEuOTE2MyAxNy43OTZaTTI0LjQzNDEgMTIuODQ0N0wxOC4zMzczIDE4Ljk1NzFMMTguMjQyMiAxOS4wNTIxTDE5LjEyNzggMTkuOTI4NEwyNS4yMjQ1IDEzLjgxNkwyNS4zMTI0IDEzLjcyMUwyNC40MzQxIDEyLjg0NDdaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K", DH = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxOCAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMuMzc1IDE2Ljg3NVYxNC42MjVIMTEuMzYyNUMxMi41NDM3IDE0LjYyNSAxMy41NzAzIDE0LjI1IDE0LjQ0MjIgMTMuNUMxNS4zMTQxIDEyLjc1IDE1Ljc1IDExLjgxMjUgMTUuNzUgMTAuNjg3NUMxNS43NSA5LjU2MjUgMTUuMzE0MSA4LjYyNSAxNC40NDIyIDcuODc1QzEzLjU3MDMgNy4xMjUgMTIuNTQzNyA2Ljc1IDExLjM2MjUgNi43NUg0LjI3NUw3LjIgOS42NzVMNS42MjUgMTEuMjVMMCA1LjYyNUw1LjYyNSAwTDcuMiAxLjU3NUw0LjI3NSA0LjVIMTEuMzYyNUMxMy4xODEyIDQuNSAxNC43NDIyIDUuMDkwNjIgMTYuMDQ1MyA2LjI3MTg3QzE3LjM0ODQgNy40NTMxMiAxOCA4LjkyNSAxOCAxMC42ODc1QzE4IDEyLjQ1IDE3LjM0ODQgMTMuOTIxOSAxNi4wNDUzIDE1LjEwMzFDMTQuNzQyMiAxNi4yODQ0IDEzLjE4MTIgMTYuODc1IDExLjM2MjUgMTYuODc1SDMuMzc1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==", NH = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxOCAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNjM3NSAxNi44NzVDNC44MTg3NSAxNi44NzUgMy4yNTc4MSAxNi4yODQ0IDEuOTU0NjkgMTUuMTAzMUMwLjY1MTU2MyAxMy45MjE5IDAgMTIuNDUgMCAxMC42ODc1QzAgOC45MjUgMC42NTE1NjMgNy40NTMxMiAxLjk1NDY5IDYuMjcxODdDMy4yNTc4MSA1LjA5MDYyIDQuODE4NzUgNC41IDYuNjM3NSA0LjVIMTMuNzI1TDEwLjggMS41NzVMMTIuMzc1IDBMMTggNS42MjVMMTIuMzc1IDExLjI1TDEwLjggOS42NzVMMTMuNzI1IDYuNzVINi42Mzc1QzUuNDU2MjUgNi43NSA0LjQyOTY5IDcuMTI1IDMuNTU3ODEgNy44NzVDMi42ODU5NCA4LjYyNSAyLjI1IDkuNTYyNSAyLjI1IDEwLjY4NzVDMi4yNSAxMS44MTI1IDIuNjg1OTQgMTIuNzUgMy41NTc4MSAxMy41QzQuNDI5NjkgMTQuMjUgNS40NTYyNSAxNC42MjUgNi42Mzc1IDE0LjYyNUgxNC42MjVWMTYuODc1SDYuNjM3NVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=";
function Ke(n, e) {
  const t = document.createElement("button");
  t.className = "govuk-button govuk-button--secondary", t.type = "button", t.title = n;
  const r = document.createElement("img");
  return r.src = e, t.appendChild(r), t;
}
function _r(n, e, t) {
  const r = document.createElement("select");
  return r.className = `govuk-select ${t}`, n.forEach((o, s) => {
    o.dom = document.createElement("option"), o.dom.text = o.text, o.dom.value = s, r.appendChild(o.dom);
  }), r.addEventListener("change", () => {
    n[Number(r.value)].command(
      e.state,
      e.dispatch,
      e
    ), e.focus(), r.selectedIndex = 0;
  }), {
    command: ue(...n.map((o) => o.command)),
    dom: r,
    customHandler: () => {
    },
    update: (o) => {
      n.forEach((s) => {
        s.dom.disabled = !s.command(o.state, null, o);
      });
    }
  };
}
function wH(n) {
  return {
    command: ue(
      B(n.nodes.heading, { level: 2 }),
      B(n.nodes.paragraph)
    ),
    dom: Ke("Heading 2", gH)
  };
}
function CH(n) {
  return [
    {
      text: "H",
      command: () => {
      }
    },
    {
      text: "H3",
      command: ue(
        B(n.nodes.heading, { level: 3 }),
        B(n.nodes.paragraph)
      )
    },
    {
      text: "H4",
      command: ue(
        B(n.nodes.heading, { level: 4 }),
        B(n.nodes.paragraph)
      )
    },
    {
      text: "H5",
      command: ue(
        B(n.nodes.heading, { level: 5 }),
        B(n.nodes.paragraph)
      )
    },
    {
      text: "H6",
      command: ue(
        B(n.nodes.heading, { level: 6 }),
        B(n.nodes.paragraph)
      )
    }
  ];
}
function AH(n) {
  return {
    command: It(n.nodes.bullet_list),
    dom: Ke("Bullet list", yH)
  };
}
function SH(n) {
  return {
    command: It(n.nodes.ordered_list),
    dom: Ke("Ordered list", MH)
  };
}
function TH(n) {
  return {
    command: It(n.nodes.steps),
    dom: Ke("Steps", kH)
  };
}
function EH(n) {
  return {
    command: ce(n.marks.link),
    dom: Ke("Link", xH),
    customHandler: (e, t, r) => {
      if (!e.selection.empty && e.selection.ranges.some(
        (i) => e.doc.rangeHasMark(i.$from.pos, i.$to.pos, n.marks.link)
      )) {
        ce(n.marks.link)(e, t), r.focus();
        return;
      }
      let s = null;
      if (s = prompt("Enter absolute admin paths or full public URLs"), !!s) {
        if (!e.selection.empty)
          ce(n.marks.link, { href: s })(e, t);
        else {
          const i = prompt("Enter the link text");
          t(
            e.tr.addStoredMark(n.marks.link.create({ href: s })).insertText(i)
          );
        }
        r.focus();
      }
    }
  };
}
function IH(n) {
  return {
    command: (...[e, , t]) => e.selection.empty && ce(n.marks.link)(e, null, t),
    dom: Ke("Email link", bH),
    customHandler: (e, t, r) => {
      const o = prompt("Enter the email address");
      o && (t(
        e.tr.addStoredMark(n.marks.link.create({ href: `mailto:${o}` })).insertText(o)
      ), r.focus());
    }
  };
}
function vH(n) {
  return [
    {
      text: "Add text block",
      command: () => {
      }
    },
    {
      text: "Call to action",
      command: Ie(n.nodes.call_to_action)
    },
    {
      text: "Information callout",
      command: ue(
        B(n.nodes.information_callout),
        B(n.nodes.paragraph)
      )
    },
    {
      text: "Warning callout",
      command: ue(
        B(n.nodes.warning_callout),
        B(n.nodes.paragraph)
      )
    },
    {
      text: "Example callout",
      command: Ie(n.nodes.example_callout)
    },
    {
      text: "Contact",
      command: Ie(n.nodes.contact)
    },
    {
      text: "Address",
      command: Ie(n.nodes.address)
    },
    {
      text: "Blockquote",
      command: Ie(n.nodes.blockquote)
    }
  ];
}
function OH(n) {
  return [
    {
      text: "Insert",
      command: Ie(n.nodes.call_to_action)
      // Temporary command to get appropriate enabled/disabled behaviour
    },
    {
      text: "Image",
      command: () => {
      }
    },
    {
      text: "Attachemnt",
      command: () => {
      }
    }
  ];
}
function zH(n) {
  return {
    command: nn,
    dom: Ke("Undo", DH)
  };
}
function _H(n) {
  return {
    command: Tt,
    dom: Ke("Redo", NH)
  };
}
function jH(n, e) {
  return [
    wH(n),
    _r(CH(n), e, "headingSelect"),
    AH(n),
    SH(n),
    TH(n),
    EH(n),
    IH(n),
    _r(vH(n), e, "textBlockSelect"),
    _r(OH(n), e, "insertSelect"),
    zH(),
    _H()
  ];
}
function LH(n) {
  return new ze({
    view: (e) => new mH(jH(n, e), e)
  });
}
const qH = (n) => {
  const e = So.filter((t) => typeof t.inputRules < "u").flatMap((t) => t.inputRules(n));
  return ec({ rules: e });
}, RH = (n) => {
  n.menuBar = !1;
  const e = pH(n);
  return e.pop(), e.push(
    new ze({
      props: {
        attributes: { class: "govspeak" }
      }
    })
  ), e.push(qH(n.schema)), e.push(LH(n.schema)), e;
};
class FH {
  constructor(e, t, r) {
    const o = Mt.create({
      doc: wt.fromSchema(di).parse(e),
      plugins: RH({ schema: di })
    });
    window.view = new Yu(t, {
      state: o,
      dispatchTransaction(s) {
        const i = window.view.state.apply(s);
        window.view.updateState(i), r.value = hi.serialize(window.view.state.doc);
      }
    }), r.value = hi.serialize(window.view.state.doc);
  }
}
window.GovspeakVisualEditor = FH;
