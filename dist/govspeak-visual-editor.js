function B(t) {
  this.content = t;
}
B.prototype = {
  constructor: B,
  find: function(t) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === t)
        return e;
    return -1;
  },
  // :: (string) → ?any
  // Retrieve the value stored under `key`, or return undefined when
  // no such key exists.
  get: function(t) {
    var e = this.find(t);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  // :: (string, any, ?string) → OrderedMap
  // Create a new map by replacing the value of `key` with a new
  // value, or adding a binding to the end of the map. If `newKey` is
  // given, the key of the binding will be replaced with that key.
  update: function(t, e, n) {
    var r = n && n != t ? this.remove(n) : this, u = r.find(t), i = r.content.slice();
    return u == -1 ? i.push(n || t, e) : (i[u + 1] = e, n && (i[u] = n)), new B(i);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(t) {
    var e = this.find(t);
    if (e == -1)
      return this;
    var n = this.content.slice();
    return n.splice(e, 2), new B(n);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(t, e) {
    return new B([t, e].concat(this.remove(t).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(t, e) {
    var n = this.remove(t).content.slice();
    return n.push(t, e), new B(n);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(t, e, n) {
    var r = this.remove(e), u = r.content.slice(), i = r.find(t);
    return u.splice(i == -1 ? u.length : i, 0, e, n), new B(u);
  },
  // :: ((key: string, value: any))
  // Call the given function for each key/value pair in the map, in
  // order.
  forEach: function(t) {
    for (var e = 0; e < this.content.length; e += 2)
      t(this.content[e], this.content[e + 1]);
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by prepending the keys in this map that don't
  // appear in `map` before the keys in `map`.
  prepend: function(t) {
    return t = B.from(t), t.size ? new B(t.content.concat(this.subtract(t).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(t) {
    return t = B.from(t), t.size ? new B(this.subtract(t).content.concat(t.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(t) {
    var e = this;
    t = B.from(t);
    for (var n = 0; n < t.content.length; n += 2)
      e = e.remove(t.content[n]);
    return e;
  },
  // :: () → Object
  // Turn ordered map into a plain object.
  toObject: function() {
    var t = {};
    return this.forEach(function(e, n) {
      t[e] = n;
    }), t;
  },
  // :: number
  // The amount of keys in this map.
  get size() {
    return this.content.length >> 1;
  }
};
B.from = function(t) {
  if (t instanceof B)
    return t;
  var e = [];
  if (t)
    for (var n in t)
      e.push(n, t[n]);
  return new B(e);
};
function $i(t, e, n) {
  for (let r = 0; ; r++) {
    if (r == t.childCount || r == e.childCount)
      return t.childCount == e.childCount ? null : n;
    let u = t.child(r), i = e.child(r);
    if (u == i) {
      n += u.nodeSize;
      continue;
    }
    if (!u.sameMarkup(i))
      return n;
    if (u.isText && u.text != i.text) {
      for (let o = 0; u.text[o] == i.text[o]; o++)
        n++;
      return n;
    }
    if (u.content.size || i.content.size) {
      let o = $i(u.content, i.content, n + 1);
      if (o != null)
        return o;
    }
    n += u.nodeSize;
  }
}
function Yi(t, e, n, r) {
  for (let u = t.childCount, i = e.childCount; ; ) {
    if (u == 0 || i == 0)
      return u == i ? null : { a: n, b: r };
    let o = t.child(--u), s = e.child(--i), l = o.nodeSize;
    if (o == s) {
      n -= l, r -= l;
      continue;
    }
    if (!o.sameMarkup(s))
      return { a: n, b: r };
    if (o.isText && o.text != s.text) {
      let a = 0, c = Math.min(o.text.length, s.text.length);
      for (; a < c && o.text[o.text.length - a - 1] == s.text[s.text.length - a - 1]; )
        a++, n--, r--;
      return { a: n, b: r };
    }
    if (o.content.size || s.content.size) {
      let a = Yi(o.content, s.content, n - 1, r - 1);
      if (a)
        return a;
    }
    n -= l, r -= l;
  }
}
class x {
  /**
  @internal
  */
  constructor(e, n) {
    if (this.content = e, this.size = n || 0, n == null)
      for (let r = 0; r < e.length; r++)
        this.size += e[r].nodeSize;
  }
  /**
  Invoke a callback for all descendant nodes between the given two
  positions (relative to start of this fragment). Doesn't descend
  into a node when the callback returns `false`.
  */
  nodesBetween(e, n, r, u = 0, i) {
    for (let o = 0, s = 0; s < n; o++) {
      let l = this.content[o], a = s + l.nodeSize;
      if (a > e && r(l, u + s, i || null, o) !== !1 && l.content.size) {
        let c = s + 1;
        l.nodesBetween(Math.max(0, e - c), Math.min(l.content.size, n - c), r, u + c);
      }
      s = a;
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
  textBetween(e, n, r, u) {
    let i = "", o = !0;
    return this.nodesBetween(e, n, (s, l) => {
      let a = s.isText ? s.text.slice(Math.max(e, l) - l, n - l) : s.isLeaf ? u ? typeof u == "function" ? u(s) : u : s.type.spec.leafText ? s.type.spec.leafText(s) : "" : "";
      s.isBlock && (s.isLeaf && a || s.isTextblock) && r && (o ? o = !1 : i += r), i += a;
    }, 0), i;
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
    let n = this.lastChild, r = e.firstChild, u = this.content.slice(), i = 0;
    for (n.isText && n.sameMarkup(r) && (u[u.length - 1] = n.withText(n.text + r.text), i = 1); i < e.content.length; i++)
      u.push(e.content[i]);
    return new x(u, this.size + e.size);
  }
  /**
  Cut out the sub-fragment between the two given positions.
  */
  cut(e, n = this.size) {
    if (e == 0 && n == this.size)
      return this;
    let r = [], u = 0;
    if (n > e)
      for (let i = 0, o = 0; o < n; i++) {
        let s = this.content[i], l = o + s.nodeSize;
        l > e && ((o < e || l > n) && (s.isText ? s = s.cut(Math.max(0, e - o), Math.min(s.text.length, n - o)) : s = s.cut(Math.max(0, e - o - 1), Math.min(s.content.size, n - o - 1))), r.push(s), u += s.nodeSize), o = l;
      }
    return new x(r, u);
  }
  /**
  @internal
  */
  cutByIndex(e, n) {
    return e == n ? x.empty : e == 0 && n == this.content.length ? this : new x(this.content.slice(e, n));
  }
  /**
  Create a new fragment in which the node at the given index is
  replaced by the given node.
  */
  replaceChild(e, n) {
    let r = this.content[e];
    if (r == n)
      return this;
    let u = this.content.slice(), i = this.size + n.nodeSize - r.nodeSize;
    return u[e] = n, new x(u, i);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new x([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new x(this.content.concat(e), this.size + e.nodeSize);
  }
  /**
  Compare this fragment to another one.
  */
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let n = 0; n < this.content.length; n++)
      if (!this.content[n].eq(e.content[n]))
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
    let n = this.content[e];
    if (!n)
      throw new RangeError("Index " + e + " out of range for " + this);
    return n;
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
    for (let n = 0, r = 0; n < this.content.length; n++) {
      let u = this.content[n];
      e(u, r, n), r += u.nodeSize;
    }
  }
  /**
  Find the first position at which this fragment and another
  fragment differ, or `null` if they are the same.
  */
  findDiffStart(e, n = 0) {
    return $i(this, e, n);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, n = this.size, r = e.size) {
    return Yi(this, e, n, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. (Not public.)
  */
  findIndex(e, n = -1) {
    if (e == 0)
      return dn(0, e);
    if (e == this.size)
      return dn(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, u = 0; ; r++) {
      let i = this.child(r), o = u + i.nodeSize;
      if (o >= e)
        return o == e || n > 0 ? dn(r + 1, o) : dn(r, u);
      u = o;
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
  static fromJSON(e, n) {
    if (!n)
      return x.empty;
    if (!Array.isArray(n))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new x(n.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return x.empty;
    let n, r = 0;
    for (let u = 0; u < e.length; u++) {
      let i = e[u];
      r += i.nodeSize, u && i.isText && e[u - 1].sameMarkup(i) ? (n || (n = e.slice(0, u)), n[n.length - 1] = i.withText(n[n.length - 1].text + i.text)) : n && n.push(i);
    }
    return new x(n || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return x.empty;
    if (e instanceof x)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new x([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
x.empty = new x([], 0);
const Jn = { index: 0, offset: 0 };
function dn(t, e) {
  return Jn.index = t, Jn.offset = e, Jn;
}
function Dn(t, e) {
  if (t === e)
    return !0;
  if (!(t && typeof t == "object") || !(e && typeof e == "object"))
    return !1;
  let n = Array.isArray(t);
  if (Array.isArray(e) != n)
    return !1;
  if (n) {
    if (t.length != e.length)
      return !1;
    for (let r = 0; r < t.length; r++)
      if (!Dn(t[r], e[r]))
        return !1;
  } else {
    for (let r in t)
      if (!(r in e) || !Dn(t[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in t))
        return !1;
  }
  return !0;
}
class I {
  /**
  @internal
  */
  constructor(e, n) {
    this.type = e, this.attrs = n;
  }
  /**
  Given a set of marks, create a new set which contains this one as
  well, in the right position. If this mark is already in the set,
  the set itself is returned. If any marks that are set to be
  [exclusive](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) with this mark are present,
  those are replaced by this one.
  */
  addToSet(e) {
    let n, r = !1;
    for (let u = 0; u < e.length; u++) {
      let i = e[u];
      if (this.eq(i))
        return e;
      if (this.type.excludes(i.type))
        n || (n = e.slice(0, u));
      else {
        if (i.type.excludes(this.type))
          return e;
        !r && i.type.rank > this.type.rank && (n || (n = e.slice(0, u)), n.push(this), r = !0), n && n.push(i);
      }
    }
    return n || (n = e.slice()), r || n.push(this), n;
  }
  /**
  Remove this mark from the given set, returning a new set. If this
  mark is not in the set, the set itself is returned.
  */
  removeFromSet(e) {
    for (let n = 0; n < e.length; n++)
      if (this.eq(e[n]))
        return e.slice(0, n).concat(e.slice(n + 1));
    return e;
  }
  /**
  Test whether this mark is in the given set of marks.
  */
  isInSet(e) {
    for (let n = 0; n < e.length; n++)
      if (this.eq(e[n]))
        return !0;
    return !1;
  }
  /**
  Test whether this mark has the same type and attributes as
  another mark.
  */
  eq(e) {
    return this == e || this.type == e.type && Dn(this.attrs, e.attrs);
  }
  /**
  Convert this mark to a JSON-serializeable representation.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let n in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  /**
  Deserialize a mark from JSON.
  */
  static fromJSON(e, n) {
    if (!n)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[n.type];
    if (!r)
      throw new RangeError(`There is no mark type ${n.type} in this schema`);
    return r.create(n.attrs);
  }
  /**
  Test whether two sets of marks are identical.
  */
  static sameSet(e, n) {
    if (e == n)
      return !0;
    if (e.length != n.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!e[r].eq(n[r]))
        return !1;
    return !0;
  }
  /**
  Create a properly sorted mark set from null, a single mark, or an
  unsorted array of marks.
  */
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return I.none;
    if (e instanceof I)
      return [e];
    let n = e.slice();
    return n.sort((r, u) => r.type.rank - u.type.rank), n;
  }
}
I.none = [];
class Nn extends Error {
}
class M {
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
  constructor(e, n, r) {
    this.content = e, this.openStart = n, this.openEnd = r;
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
  insertAt(e, n) {
    let r = Hi(this.content, e + this.openStart, n);
    return r && new M(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, n) {
    return new M(Wi(this.content, e + this.openStart, n + this.openStart), this.openStart, this.openEnd);
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
  static fromJSON(e, n) {
    if (!n)
      return M.empty;
    let r = n.openStart || 0, u = n.openEnd || 0;
    if (typeof r != "number" || typeof u != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new M(x.fromJSON(e, n.content), r, u);
  }
  /**
  Create a slice from a fragment by taking the maximum possible
  open value on both side of the fragment.
  */
  static maxOpen(e, n = !0) {
    let r = 0, u = 0;
    for (let i = e.firstChild; i && !i.isLeaf && (n || !i.type.spec.isolating); i = i.firstChild)
      r++;
    for (let i = e.lastChild; i && !i.isLeaf && (n || !i.type.spec.isolating); i = i.lastChild)
      u++;
    return new M(e, r, u);
  }
}
M.empty = new M(x.empty, 0, 0);
function Wi(t, e, n) {
  let { index: r, offset: u } = t.findIndex(e), i = t.maybeChild(r), { index: o, offset: s } = t.findIndex(n);
  if (u == e || i.isText) {
    if (s != n && !t.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return t.cut(0, e).append(t.cut(n));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return t.replaceChild(r, i.copy(Wi(i.content, e - u - 1, n - u - 1)));
}
function Hi(t, e, n, r) {
  let { index: u, offset: i } = t.findIndex(e), o = t.maybeChild(u);
  if (i == e || o.isText)
    return r && !r.canReplace(u, u, n) ? null : t.cut(0, e).append(n).append(t.cut(e));
  let s = Hi(o.content, e - i - 1, n);
  return s && t.replaceChild(u, o.copy(s));
}
function il(t, e, n) {
  if (n.openStart > t.depth)
    throw new Nn("Inserted content deeper than insertion position");
  if (t.depth - n.openStart != e.depth - n.openEnd)
    throw new Nn("Inconsistent open depths");
  return Ji(t, e, n, 0);
}
function Ji(t, e, n, r) {
  let u = t.index(r), i = t.node(r);
  if (u == e.index(r) && r < t.depth - n.openStart) {
    let o = Ji(t, e, n, r + 1);
    return i.copy(i.content.replaceChild(u, o));
  } else if (n.content.size)
    if (!n.openStart && !n.openEnd && t.depth == r && e.depth == r) {
      let o = t.parent, s = o.content;
      return rt(o, s.cut(0, t.parentOffset).append(n.content).append(s.cut(e.parentOffset)));
    } else {
      let { start: o, end: s } = ol(n, t);
      return rt(i, Gi(t, o, s, e, r));
    }
  else
    return rt(i, Cn(t, e, r));
}
function Zi(t, e) {
  if (!e.type.compatibleContent(t.type))
    throw new Nn("Cannot join " + e.type.name + " onto " + t.type.name);
}
function Er(t, e, n) {
  let r = t.node(n);
  return Zi(r, e.node(n)), r;
}
function nt(t, e) {
  let n = e.length - 1;
  n >= 0 && t.isText && t.sameMarkup(e[n]) ? e[n] = t.withText(e[n].text + t.text) : e.push(t);
}
function Bt(t, e, n, r) {
  let u = (e || t).node(n), i = 0, o = e ? e.index(n) : u.childCount;
  t && (i = t.index(n), t.depth > n ? i++ : t.textOffset && (nt(t.nodeAfter, r), i++));
  for (let s = i; s < o; s++)
    nt(u.child(s), r);
  e && e.depth == n && e.textOffset && nt(e.nodeBefore, r);
}
function rt(t, e) {
  return t.type.checkContent(e), t.copy(e);
}
function Gi(t, e, n, r, u) {
  let i = t.depth > u && Er(t, e, u + 1), o = r.depth > u && Er(n, r, u + 1), s = [];
  return Bt(null, t, u, s), i && o && e.index(u) == n.index(u) ? (Zi(i, o), nt(rt(i, Gi(t, e, n, r, u + 1)), s)) : (i && nt(rt(i, Cn(t, e, u + 1)), s), Bt(e, n, u, s), o && nt(rt(o, Cn(n, r, u + 1)), s)), Bt(r, null, u, s), new x(s);
}
function Cn(t, e, n) {
  let r = [];
  if (Bt(null, t, n, r), t.depth > n) {
    let u = Er(t, e, n + 1);
    nt(rt(u, Cn(t, e, n + 1)), r);
  }
  return Bt(e, null, n, r), new x(r);
}
function ol(t, e) {
  let n = e.depth - t.openStart, u = e.node(n).copy(t.content);
  for (let i = n - 1; i >= 0; i--)
    u = e.node(i).copy(x.from(u));
  return {
    start: u.resolveNoCache(t.openStart + n),
    end: u.resolveNoCache(u.content.size - t.openEnd - n)
  };
}
class Yt {
  /**
  @internal
  */
  constructor(e, n, r) {
    this.pos = e, this.path = n, this.parentOffset = r, this.depth = n.length / 3 - 1;
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
    let e = this.parent, n = this.index(this.depth);
    if (n == e.childCount)
      return null;
    let r = this.pos - this.path[this.path.length - 1], u = e.child(n);
    return r ? e.child(n).cut(r) : u;
  }
  /**
  Get the node directly before the position, if any. If the
  position points into a text node, only the part of that node
  before the position is returned.
  */
  get nodeBefore() {
    let e = this.index(this.depth), n = this.pos - this.path[this.path.length - 1];
    return n ? this.parent.child(e).cut(0, n) : e == 0 ? null : this.parent.child(e - 1);
  }
  /**
  Get the position at the given index in the parent node at the
  given depth (which defaults to `this.depth`).
  */
  posAtIndex(e, n) {
    n = this.resolveDepth(n);
    let r = this.path[n * 3], u = n == 0 ? 0 : this.path[n * 3 - 1] + 1;
    for (let i = 0; i < e; i++)
      u += r.child(i).nodeSize;
    return u;
  }
  /**
  Get the marks at this position, factoring in the surrounding
  marks' [`inclusive`](https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive) property. If the
  position is at the start of a non-empty node, the marks of the
  node after it (if any) are returned.
  */
  marks() {
    let e = this.parent, n = this.index();
    if (e.content.size == 0)
      return I.none;
    if (this.textOffset)
      return e.child(n).marks;
    let r = e.maybeChild(n - 1), u = e.maybeChild(n);
    if (!r) {
      let s = r;
      r = u, u = s;
    }
    let i = r.marks;
    for (var o = 0; o < i.length; o++)
      i[o].type.spec.inclusive === !1 && (!u || !i[o].isInSet(u.marks)) && (i = i[o--].removeFromSet(i));
    return i;
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
    let n = this.parent.maybeChild(this.index());
    if (!n || !n.isInline)
      return null;
    let r = n.marks, u = e.parent.maybeChild(e.index());
    for (var i = 0; i < r.length; i++)
      r[i].type.spec.inclusive === !1 && (!u || !r[i].isInSet(u.marks)) && (r = r[i--].removeFromSet(r));
    return r;
  }
  /**
  The depth up to which this position and the given (non-resolved)
  position share the same parent nodes.
  */
  sharedDepth(e) {
    for (let n = this.depth; n > 0; n--)
      if (this.start(n) <= e && this.end(n) >= e)
        return n;
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
  blockRange(e = this, n) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let r = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); r >= 0; r--)
      if (e.pos <= this.end(r) && (!n || n(this.node(r))))
        return new An(this, e, r);
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
    for (let n = 1; n <= this.depth; n++)
      e += (e ? "/" : "") + this.node(n).type.name + "_" + this.index(n - 1);
    return e + ":" + this.parentOffset;
  }
  /**
  @internal
  */
  static resolve(e, n) {
    if (!(n >= 0 && n <= e.content.size))
      throw new RangeError("Position " + n + " out of range");
    let r = [], u = 0, i = n;
    for (let o = e; ; ) {
      let { index: s, offset: l } = o.content.findIndex(i), a = i - l;
      if (r.push(o, s, u + l), !a || (o = o.child(s), o.isText))
        break;
      i = a - 1, u += l + 1;
    }
    return new Yt(n, r, i);
  }
  /**
  @internal
  */
  static resolveCached(e, n) {
    for (let u = 0; u < Zn.length; u++) {
      let i = Zn[u];
      if (i.pos == n && i.doc == e)
        return i;
    }
    let r = Zn[Gn] = Yt.resolve(e, n);
    return Gn = (Gn + 1) % sl, r;
  }
}
let Zn = [], Gn = 0, sl = 12;
class An {
  /**
  Construct a node range. `$from` and `$to` should point into the
  same node until at least the given `depth`, since a node range
  denotes an adjacent set of nodes in a single parent node.
  */
  constructor(e, n, r) {
    this.$from = e, this.$to = n, this.depth = r;
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
const ll = /* @__PURE__ */ Object.create(null);
let ut = class Tr {
  /**
  @internal
  */
  constructor(e, n, r, u = I.none) {
    this.type = e, this.attrs = n, this.marks = u, this.content = r || x.empty;
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
  nodesBetween(e, n, r, u = 0) {
    this.content.nodesBetween(e, n, r, u, this);
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
  textBetween(e, n, r, u) {
    return this.content.textBetween(e, n, r, u);
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
  hasMarkup(e, n, r) {
    return this.type == e && Dn(this.attrs, n || e.defaultAttrs || ll) && I.sameSet(this.marks, r || I.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Tr(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Tr(this.type, this.attrs, this.content, e);
  }
  /**
  Create a copy of this node with only the content between the
  given positions. If `to` is not given, it defaults to the end of
  the node.
  */
  cut(e, n = this.content.size) {
    return e == 0 && n == this.content.size ? this : this.copy(this.content.cut(e, n));
  }
  /**
  Cut out the part of the document between the given positions, and
  return it as a `Slice` object.
  */
  slice(e, n = this.content.size, r = !1) {
    if (e == n)
      return M.empty;
    let u = this.resolve(e), i = this.resolve(n), o = r ? 0 : u.sharedDepth(n), s = u.start(o), a = u.node(o).content.cut(u.pos - s, i.pos - s);
    return new M(a, u.depth - o, i.depth - o);
  }
  /**
  Replace the part of the document between the given positions with
  the given slice. The slice must 'fit', meaning its open sides
  must be able to connect to the surrounding content, and its
  content nodes must be valid children for the node they are placed
  into. If any of this is violated, an error of type
  [`ReplaceError`](https://prosemirror.net/docs/ref/#model.ReplaceError) is thrown.
  */
  replace(e, n, r) {
    return il(this.resolve(e), this.resolve(n), r);
  }
  /**
  Find the node directly after the given position.
  */
  nodeAt(e) {
    for (let n = this; ; ) {
      let { index: r, offset: u } = n.content.findIndex(e);
      if (n = n.maybeChild(r), !n)
        return null;
      if (u == e || n.isText)
        return n;
      e -= u + 1;
    }
  }
  /**
  Find the (direct) child node after the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childAfter(e) {
    let { index: n, offset: r } = this.content.findIndex(e);
    return { node: this.content.maybeChild(n), index: n, offset: r };
  }
  /**
  Find the (direct) child node before the given offset, if any,
  and return it along with its index and offset relative to this
  node.
  */
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: n, offset: r } = this.content.findIndex(e);
    if (r < e)
      return { node: this.content.child(n), index: n, offset: r };
    let u = this.content.child(n - 1);
    return { node: u, index: n - 1, offset: r - u.nodeSize };
  }
  /**
  Resolve the given position in the document, returning an
  [object](https://prosemirror.net/docs/ref/#model.ResolvedPos) with information about its context.
  */
  resolve(e) {
    return Yt.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Yt.resolve(this, e);
  }
  /**
  Test whether a given mark or mark type occurs in this document
  between the two given positions.
  */
  rangeHasMark(e, n, r) {
    let u = !1;
    return n > e && this.nodesBetween(e, n, (i) => (r.isInSet(i.marks) && (u = !0), !u)), u;
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), Ki(this.marks, e);
  }
  /**
  Get the content match in this node at the given index.
  */
  contentMatchAt(e) {
    let n = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!n)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return n;
  }
  /**
  Test whether replacing the range between `from` and `to` (by
  child index) with the given replacement fragment (which defaults
  to the empty fragment) would leave the node's content valid. You
  can optionally pass `start` and `end` indices into the
  replacement fragment.
  */
  canReplace(e, n, r = x.empty, u = 0, i = r.childCount) {
    let o = this.contentMatchAt(e).matchFragment(r, u, i), s = o && o.matchFragment(this.content, n);
    if (!s || !s.validEnd)
      return !1;
    for (let l = u; l < i; l++)
      if (!this.type.allowsMarks(r.child(l).marks))
        return !1;
    return !0;
  }
  /**
  Test whether replacing the range `from` to `to` (by index) with
  a node of the given type would leave the node's content valid.
  */
  canReplaceWith(e, n, r, u) {
    if (u && !this.type.allowsMarks(u))
      return !1;
    let i = this.contentMatchAt(e).matchType(r), o = i && i.matchFragment(this.content, n);
    return o ? o.validEnd : !1;
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
    let e = I.none;
    for (let n = 0; n < this.marks.length; n++)
      e = this.marks[n].addToSet(e);
    if (!I.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((n) => n.type.name)}`);
    this.content.forEach((n) => n.check());
  }
  /**
  Return a JSON-serializeable representation of this node.
  */
  toJSON() {
    let e = { type: this.type.name };
    for (let n in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((n) => n.toJSON())), e;
  }
  /**
  Deserialize a node from its JSON representation.
  */
  static fromJSON(e, n) {
    if (!n)
      throw new RangeError("Invalid input for Node.fromJSON");
    let r = null;
    if (n.marks) {
      if (!Array.isArray(n.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      r = n.marks.map(e.markFromJSON);
    }
    if (n.type == "text") {
      if (typeof n.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(n.text, r);
    }
    let u = x.fromJSON(e, n.content);
    return e.nodeType(n.type).create(n.attrs, u, r);
  }
};
ut.prototype.text = void 0;
class En extends ut {
  /**
  @internal
  */
  constructor(e, n, r, u) {
    if (super(e, n, null, u), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : Ki(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, n) {
    return this.text.slice(e, n);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new En(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new En(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, n = this.text.length) {
    return e == 0 && n == this.text.length ? this : this.withText(this.text.slice(e, n));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function Ki(t, e) {
  for (let n = t.length - 1; n >= 0; n--)
    e = t[n].type.name + "(" + e + ")";
  return e;
}
class lt {
  /**
  @internal
  */
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  /**
  @internal
  */
  static parse(e, n) {
    let r = new al(e, n);
    if (r.next == null)
      return lt.empty;
    let u = Xi(r);
    r.next && r.err("Unexpected trailing text");
    let i = gl(ml(u));
    return bl(i, r), i;
  }
  /**
  Match a node type, returning a match after that node if
  successful.
  */
  matchType(e) {
    for (let n = 0; n < this.next.length; n++)
      if (this.next[n].type == e)
        return this.next[n].next;
    return null;
  }
  /**
  Try to match a fragment. Returns the resulting match when
  successful.
  */
  matchFragment(e, n = 0, r = e.childCount) {
    let u = this;
    for (let i = n; u && i < r; i++)
      u = u.matchType(e.child(i).type);
    return u;
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
      let { type: n } = this.next[e];
      if (!(n.isText || n.hasRequiredAttrs()))
        return n;
    }
    return null;
  }
  /**
  @internal
  */
  compatible(e) {
    for (let n = 0; n < this.next.length; n++)
      for (let r = 0; r < e.next.length; r++)
        if (this.next[n].type == e.next[r].type)
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
  fillBefore(e, n = !1, r = 0) {
    let u = [this];
    function i(o, s) {
      let l = o.matchFragment(e, r);
      if (l && (!n || l.validEnd))
        return x.from(s.map((a) => a.createAndFill()));
      for (let a = 0; a < o.next.length; a++) {
        let { type: c, next: f } = o.next[a];
        if (!(c.isText || c.hasRequiredAttrs()) && u.indexOf(f) == -1) {
          u.push(f);
          let d = i(f, s.concat(c));
          if (d)
            return d;
        }
      }
      return null;
    }
    return i(this, []);
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
    let n = this.computeWrapping(e);
    return this.wrapCache.push(e, n), n;
  }
  /**
  @internal
  */
  computeWrapping(e) {
    let n = /* @__PURE__ */ Object.create(null), r = [{ match: this, type: null, via: null }];
    for (; r.length; ) {
      let u = r.shift(), i = u.match;
      if (i.matchType(e)) {
        let o = [];
        for (let s = u; s.type; s = s.via)
          o.push(s.type);
        return o.reverse();
      }
      for (let o = 0; o < i.next.length; o++) {
        let { type: s, next: l } = i.next[o];
        !s.isLeaf && !s.hasRequiredAttrs() && !(s.name in n) && (!u.type || l.validEnd) && (r.push({ match: s.contentMatch, type: s, via: u }), n[s.name] = !0);
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
    function n(r) {
      e.push(r);
      for (let u = 0; u < r.next.length; u++)
        e.indexOf(r.next[u].next) == -1 && n(r.next[u].next);
    }
    return n(this), e.map((r, u) => {
      let i = u + (r.validEnd ? "*" : " ") + " ";
      for (let o = 0; o < r.next.length; o++)
        i += (o ? ", " : "") + r.next[o].type.name + "->" + e.indexOf(r.next[o].next);
      return i;
    }).join(`
`);
  }
}
lt.empty = new lt(!0);
class al {
  constructor(e, n) {
    this.string = e, this.nodeTypes = n, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
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
function Xi(t) {
  let e = [];
  do
    e.push(cl(t));
  while (t.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function cl(t) {
  let e = [];
  do
    e.push(fl(t));
  while (t.next && t.next != ")" && t.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function fl(t) {
  let e = pl(t);
  for (; ; )
    if (t.eat("+"))
      e = { type: "plus", expr: e };
    else if (t.eat("*"))
      e = { type: "star", expr: e };
    else if (t.eat("?"))
      e = { type: "opt", expr: e };
    else if (t.eat("{"))
      e = dl(t, e);
    else
      break;
  return e;
}
function yu(t) {
  /\D/.test(t.next) && t.err("Expected number, got '" + t.next + "'");
  let e = Number(t.next);
  return t.pos++, e;
}
function dl(t, e) {
  let n = yu(t), r = n;
  return t.eat(",") && (t.next != "}" ? r = yu(t) : r = -1), t.eat("}") || t.err("Unclosed braced range"), { type: "range", min: n, max: r, expr: e };
}
function hl(t, e) {
  let n = t.nodeTypes, r = n[e];
  if (r)
    return [r];
  let u = [];
  for (let i in n) {
    let o = n[i];
    o.groups.indexOf(e) > -1 && u.push(o);
  }
  return u.length == 0 && t.err("No node type or group '" + e + "' found"), u;
}
function pl(t) {
  if (t.eat("(")) {
    let e = Xi(t);
    return t.eat(")") || t.err("Missing closing paren"), e;
  } else if (/\W/.test(t.next))
    t.err("Unexpected token '" + t.next + "'");
  else {
    let e = hl(t, t.next).map((n) => (t.inline == null ? t.inline = n.isInline : t.inline != n.isInline && t.err("Mixing inline and block content"), { type: "name", value: n }));
    return t.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function ml(t) {
  let e = [[]];
  return u(i(t, 0), n()), e;
  function n() {
    return e.push([]) - 1;
  }
  function r(o, s, l) {
    let a = { term: l, to: s };
    return e[o].push(a), a;
  }
  function u(o, s) {
    o.forEach((l) => l.to = s);
  }
  function i(o, s) {
    if (o.type == "choice")
      return o.exprs.reduce((l, a) => l.concat(i(a, s)), []);
    if (o.type == "seq")
      for (let l = 0; ; l++) {
        let a = i(o.exprs[l], s);
        if (l == o.exprs.length - 1)
          return a;
        u(a, s = n());
      }
    else if (o.type == "star") {
      let l = n();
      return r(s, l), u(i(o.expr, l), l), [r(l)];
    } else if (o.type == "plus") {
      let l = n();
      return u(i(o.expr, s), l), u(i(o.expr, l), l), [r(l)];
    } else {
      if (o.type == "opt")
        return [r(s)].concat(i(o.expr, s));
      if (o.type == "range") {
        let l = s;
        for (let a = 0; a < o.min; a++) {
          let c = n();
          u(i(o.expr, l), c), l = c;
        }
        if (o.max == -1)
          u(i(o.expr, l), l);
        else
          for (let a = o.min; a < o.max; a++) {
            let c = n();
            r(l, c), u(i(o.expr, l), c), l = c;
          }
        return [r(l)];
      } else {
        if (o.type == "name")
          return [r(s, void 0, o.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function eo(t, e) {
  return e - t;
}
function ku(t, e) {
  let n = [];
  return r(e), n.sort(eo);
  function r(u) {
    let i = t[u];
    if (i.length == 1 && !i[0].term)
      return r(i[0].to);
    n.push(u);
    for (let o = 0; o < i.length; o++) {
      let { term: s, to: l } = i[o];
      !s && n.indexOf(l) == -1 && r(l);
    }
  }
}
function gl(t) {
  let e = /* @__PURE__ */ Object.create(null);
  return n(ku(t, 0));
  function n(r) {
    let u = [];
    r.forEach((o) => {
      t[o].forEach(({ term: s, to: l }) => {
        if (!s)
          return;
        let a;
        for (let c = 0; c < u.length; c++)
          u[c][0] == s && (a = u[c][1]);
        ku(t, l).forEach((c) => {
          a || u.push([s, a = []]), a.indexOf(c) == -1 && a.push(c);
        });
      });
    });
    let i = e[r.join(",")] = new lt(r.indexOf(t.length - 1) > -1);
    for (let o = 0; o < u.length; o++) {
      let s = u[o][1].sort(eo);
      i.next.push({ type: u[o][0], next: e[s.join(",")] || n(s) });
    }
    return i;
  }
}
function bl(t, e) {
  for (let n = 0, r = [t]; n < r.length; n++) {
    let u = r[n], i = !u.validEnd, o = [];
    for (let s = 0; s < u.next.length; s++) {
      let { type: l, next: a } = u.next[s];
      o.push(l.name), i && !(l.isText || l.hasRequiredAttrs()) && (i = !1), r.indexOf(a) == -1 && r.push(a);
    }
    i && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function to(t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let n in t) {
    let r = t[n];
    if (!r.hasDefault)
      return null;
    e[n] = r.default;
  }
  return e;
}
function no(t, e) {
  let n = /* @__PURE__ */ Object.create(null);
  for (let r in t) {
    let u = e && e[r];
    if (u === void 0) {
      let i = t[r];
      if (i.hasDefault)
        u = i.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    n[r] = u;
  }
  return n;
}
function ro(t) {
  let e = /* @__PURE__ */ Object.create(null);
  if (t)
    for (let n in t)
      e[n] = new xl(t[n]);
  return e;
}
let Du = class uo {
  /**
  @internal
  */
  constructor(e, n, r) {
    this.name = e, this.schema = n, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = ro(r.attrs), this.defaultAttrs = to(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == lt.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : no(this.attrs, e);
  }
  /**
  Create a `Node` of this type. The given attributes are
  checked and defaulted (you can pass `null` to use the type's
  defaults entirely, if no required attributes exist). `content`
  may be a `Fragment`, a node, an array of nodes, or
  `null`. Similarly `marks` may be `null` to default to the empty
  set of marks.
  */
  create(e = null, n, r) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new ut(this, this.computeAttrs(e), x.from(n), I.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, n, r) {
    return n = x.from(n), this.checkContent(n), new ut(this, this.computeAttrs(e), n, I.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but see if it is
  necessary to add nodes to the start or end of the given fragment
  to make it fit the node. If no fitting wrapping can be found,
  return null. Note that, due to the fact that required nodes can
  always be created, this will always succeed if you pass null or
  `Fragment.empty` as content.
  */
  createAndFill(e = null, n, r) {
    if (e = this.computeAttrs(e), n = x.from(n), n.size) {
      let o = this.contentMatch.fillBefore(n);
      if (!o)
        return null;
      n = o.append(n);
    }
    let u = this.contentMatch.matchFragment(n), i = u && u.fillBefore(x.empty, !0);
    return i ? new ut(this, e, n.append(i), I.setFrom(r)) : null;
  }
  /**
  Returns true if the given fragment is valid content for this node
  type with the given attributes.
  */
  validContent(e) {
    let n = this.contentMatch.matchFragment(e);
    if (!n || !n.validEnd)
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
    for (let n = 0; n < e.length; n++)
      if (!this.allowsMarkType(e[n].type))
        return !1;
    return !0;
  }
  /**
  Removes the marks that are not allowed in this node from the given set.
  */
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let n;
    for (let r = 0; r < e.length; r++)
      this.allowsMarkType(e[r].type) ? n && n.push(e[r]) : n || (n = e.slice(0, r));
    return n ? n.length ? n : I.none : e;
  }
  /**
  @internal
  */
  static compile(e, n) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((i, o) => r[i] = new uo(i, n, o));
    let u = n.spec.topNode || "doc";
    if (!r[u])
      throw new RangeError("Schema is missing its top node type ('" + u + "')");
    if (!r.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let i in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
};
class xl {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Rn {
  /**
  @internal
  */
  constructor(e, n, r, u) {
    this.name = e, this.rank = n, this.schema = r, this.spec = u, this.attrs = ro(u.attrs), this.excluded = null;
    let i = to(this.attrs);
    this.instance = i ? new I(this, i) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new I(this, no(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, n) {
    let r = /* @__PURE__ */ Object.create(null), u = 0;
    return e.forEach((i, o) => r[i] = new Rn(i, u++, n, o)), r;
  }
  /**
  When there is a mark of this type in the given set, a new set
  without it is returned. Otherwise, the input set is returned.
  */
  removeFromSet(e) {
    for (var n = 0; n < e.length; n++)
      e[n].type == this && (e = e.slice(0, n).concat(e.slice(n + 1)), n--);
    return e;
  }
  /**
  Tests whether there is a mark of this type in the given set.
  */
  isInSet(e) {
    for (let n = 0; n < e.length; n++)
      if (e[n].type == this)
        return e[n];
  }
  /**
  Queries whether a given mark type is
  [excluded](https://prosemirror.net/docs/ref/#model.MarkSpec.excludes) by this one.
  */
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class io {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.linebreakReplacement = null, this.cached = /* @__PURE__ */ Object.create(null);
    let n = this.spec = {};
    for (let u in e)
      n[u] = e[u];
    n.nodes = B.from(e.nodes), n.marks = B.from(e.marks || {}), this.nodes = Du.compile(this.spec.nodes, this), this.marks = Rn.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let u in this.nodes) {
      if (u in this.marks)
        throw new RangeError(u + " can not be both a node and a mark");
      let i = this.nodes[u], o = i.spec.content || "", s = i.spec.marks;
      if (i.contentMatch = r[o] || (r[o] = lt.parse(o, this.nodes)), i.inlineContent = i.contentMatch.inlineContent, i.spec.linebreakReplacement) {
        if (this.linebreakReplacement)
          throw new RangeError("Multiple linebreak nodes defined");
        if (!i.isInline || !i.isLeaf)
          throw new RangeError("Linebreak replacement nodes must be inline leaf nodes");
        this.linebreakReplacement = i;
      }
      i.markSet = s == "_" ? null : s ? Nu(this, s.split(" ")) : s == "" || !i.inlineContent ? [] : null;
    }
    for (let u in this.marks) {
      let i = this.marks[u], o = i.spec.excludes;
      i.excluded = o == null ? [i] : o == "" ? [] : Nu(this, o.split(" "));
    }
    this.nodeFromJSON = this.nodeFromJSON.bind(this), this.markFromJSON = this.markFromJSON.bind(this), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  /**
  Create a node in this schema. The `type` may be a string or a
  `NodeType` instance. Attributes will be extended with defaults,
  `content` may be a `Fragment`, `null`, a `Node`, or an array of
  nodes.
  */
  node(e, n = null, r, u) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof Du) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else
      throw new RangeError("Invalid node type: " + e);
    return e.createChecked(n, r, u);
  }
  /**
  Create a text node in the schema. Empty text nodes are not
  allowed.
  */
  text(e, n) {
    let r = this.nodes.text;
    return new En(r, r.defaultAttrs, e, I.setFrom(n));
  }
  /**
  Create a mark with the given type and attributes.
  */
  mark(e, n) {
    return typeof e == "string" && (e = this.marks[e]), e.create(n);
  }
  /**
  Deserialize a node from its JSON representation. This method is
  bound.
  */
  nodeFromJSON(e) {
    return ut.fromJSON(this, e);
  }
  /**
  Deserialize a mark from its JSON representation. This method is
  bound.
  */
  markFromJSON(e) {
    return I.fromJSON(this, e);
  }
  /**
  @internal
  */
  nodeType(e) {
    let n = this.nodes[e];
    if (!n)
      throw new RangeError("Unknown node type: " + e);
    return n;
  }
}
function Nu(t, e) {
  let n = [];
  for (let r = 0; r < e.length; r++) {
    let u = e[r], i = t.marks[u], o = i;
    if (i)
      n.push(i);
    else
      for (let s in t.marks) {
        let l = t.marks[s];
        (u == "_" || l.spec.group && l.spec.group.split(" ").indexOf(u) > -1) && n.push(o = l);
      }
    if (!o)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return n;
}
function Ml(t) {
  return t.tag != null;
}
function yl(t) {
  return t.style != null;
}
class Nt {
  /**
  Create a parser that targets the given schema, using the given
  parsing rules.
  */
  constructor(e, n) {
    this.schema = e, this.rules = n, this.tags = [], this.styles = [], n.forEach((r) => {
      Ml(r) ? this.tags.push(r) : yl(r) && this.styles.push(r);
    }), this.normalizeLists = !this.tags.some((r) => {
      if (!/^(ul|ol)\b/.test(r.tag) || !r.node)
        return !1;
      let u = e.nodes[r.node];
      return u.contentMatch.matchType(u);
    });
  }
  /**
  Parse a document from the content of a DOM node.
  */
  parse(e, n = {}) {
    let r = new Au(this, n, !1);
    return r.addAll(e, n.from, n.to), r.finish();
  }
  /**
  Parses the content of the given DOM node, like
  [`parse`](https://prosemirror.net/docs/ref/#model.DOMParser.parse), and takes the same set of
  options. But unlike that method, which produces a whole node,
  this one returns a slice that is open at the sides, meaning that
  the schema constraints aren't applied to the start of nodes to
  the left of the input and the end of nodes at the end.
  */
  parseSlice(e, n = {}) {
    let r = new Au(this, n, !0);
    return r.addAll(e, n.from, n.to), M.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, n, r) {
    for (let u = r ? this.tags.indexOf(r) + 1 : 0; u < this.tags.length; u++) {
      let i = this.tags[u];
      if (Nl(e, i.tag) && (i.namespace === void 0 || e.namespaceURI == i.namespace) && (!i.context || n.matchesContext(i.context))) {
        if (i.getAttrs) {
          let o = i.getAttrs(e);
          if (o === !1)
            continue;
          i.attrs = o || void 0;
        }
        return i;
      }
    }
  }
  /**
  @internal
  */
  matchStyle(e, n, r, u) {
    for (let i = u ? this.styles.indexOf(u) + 1 : 0; i < this.styles.length; i++) {
      let o = this.styles[i], s = o.style;
      if (!(s.indexOf(e) != 0 || o.context && !r.matchesContext(o.context) || // Test that the style string either precisely matches the prop,
      // or has an '=' sign after the prop, followed by the given
      // value.
      s.length > e.length && (s.charCodeAt(e.length) != 61 || s.slice(e.length + 1) != n))) {
        if (o.getAttrs) {
          let l = o.getAttrs(n);
          if (l === !1)
            continue;
          o.attrs = l || void 0;
        }
        return o;
      }
    }
  }
  /**
  @internal
  */
  static schemaRules(e) {
    let n = [];
    function r(u) {
      let i = u.priority == null ? 50 : u.priority, o = 0;
      for (; o < n.length; o++) {
        let s = n[o];
        if ((s.priority == null ? 50 : s.priority) < i)
          break;
      }
      n.splice(o, 0, u);
    }
    for (let u in e.marks) {
      let i = e.marks[u].spec.parseDOM;
      i && i.forEach((o) => {
        r(o = Eu(o)), o.mark || o.ignore || o.clearMark || (o.mark = u);
      });
    }
    for (let u in e.nodes) {
      let i = e.nodes[u].spec.parseDOM;
      i && i.forEach((o) => {
        r(o = Eu(o)), o.node || o.ignore || o.mark || (o.node = u);
      });
    }
    return n;
  }
  /**
  Construct a DOM parser using the parsing rules listed in a
  schema's [node specs](https://prosemirror.net/docs/ref/#model.NodeSpec.parseDOM), reordered by
  [priority](https://prosemirror.net/docs/ref/#model.ParseRule.priority).
  */
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new Nt(e, Nt.schemaRules(e)));
  }
}
const oo = {
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
}, kl = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, so = { ol: !0, ul: !0 }, Tn = 1, In = 2, Pt = 4;
function Cu(t, e, n) {
  return e != null ? (e ? Tn : 0) | (e === "full" ? In : 0) : t && t.whitespace == "pre" ? Tn | In : n & ~Pt;
}
class hn {
  constructor(e, n, r, u, i, o, s) {
    this.type = e, this.attrs = n, this.marks = r, this.pendingMarks = u, this.solid = i, this.options = s, this.content = [], this.activeMarks = I.none, this.stashMarks = [], this.match = o || (s & Pt ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let n = this.type.contentMatch.fillBefore(x.from(e));
      if (n)
        this.match = this.type.contentMatch.matchFragment(n);
      else {
        let r = this.type.contentMatch, u;
        return (u = r.findWrapping(e.type)) ? (this.match = r, u) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & Tn)) {
      let r = this.content[this.content.length - 1], u;
      if (r && r.isText && (u = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let i = r;
        r.text.length == u[0].length ? this.content.pop() : this.content[this.content.length - 1] = i.withText(i.text.slice(0, i.text.length - u[0].length));
      }
    }
    let n = x.from(this.content);
    return !e && this.match && (n = n.append(this.match.fillBefore(x.empty, !0))), this.type ? this.type.create(this.attrs, n, this.marks) : n;
  }
  popFromStashMark(e) {
    for (let n = this.stashMarks.length - 1; n >= 0; n--)
      if (e.eq(this.stashMarks[n]))
        return this.stashMarks.splice(n, 1)[0];
  }
  applyPending(e) {
    for (let n = 0, r = this.pendingMarks; n < r.length; n++) {
      let u = r[n];
      (this.type ? this.type.allowsMarkType(u.type) : Al(u.type, e)) && !u.isInSet(this.activeMarks) && (this.activeMarks = u.addToSet(this.activeMarks), this.pendingMarks = u.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !oo.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Au {
  constructor(e, n, r) {
    this.parser = e, this.options = n, this.isOpen = r, this.open = 0;
    let u = n.topNode, i, o = Cu(null, n.preserveWhitespace, 0) | (r ? Pt : 0);
    u ? i = new hn(u.type, u.attrs, I.none, I.none, !0, n.topMatch || u.type.contentMatch, o) : r ? i = new hn(null, null, I.none, I.none, !0, null, o) : i = new hn(e.schema.topNodeType, null, I.none, I.none, !0, null, o), this.nodes = [i], this.find = n.findPositions, this.needsBlock = !1;
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
  withStyleRules(e, n) {
    let r = e.getAttribute("style");
    if (!r)
      return n();
    let u = this.readStyles(Cl(r));
    if (!u)
      return;
    let [i, o] = u, s = this.top;
    for (let l = 0; l < o.length; l++)
      this.removePendingMark(o[l], s);
    for (let l = 0; l < i.length; l++)
      this.addPendingMark(i[l]);
    n();
    for (let l = 0; l < i.length; l++)
      this.removePendingMark(i[l], s);
    for (let l = 0; l < o.length; l++)
      this.addPendingMark(o[l]);
  }
  addTextNode(e) {
    let n = e.nodeValue, r = this.top;
    if (r.options & In || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(n)) {
      if (r.options & Tn)
        r.options & In ? n = n.replace(/\r\n?/g, `
`) : n = n.replace(/\r?\n|\r/g, " ");
      else if (n = n.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(n) && this.open == this.nodes.length - 1) {
        let u = r.content[r.content.length - 1], i = e.previousSibling;
        (!u || i && i.nodeName == "BR" || u.isText && /[ \t\r\n\u000c]$/.test(u.text)) && (n = n.slice(1));
      }
      n && this.insertNode(this.parser.schema.text(n)), this.findInText(e);
    } else
      this.findInside(e);
  }
  // Try to find a handler for the given tag and use that to parse. If
  // none is found, the element's content nodes are added directly.
  addElement(e, n) {
    let r = e.nodeName.toLowerCase(), u;
    so.hasOwnProperty(r) && this.parser.normalizeLists && Dl(e);
    let i = this.options.ruleFromNode && this.options.ruleFromNode(e) || (u = this.parser.matchTag(e, this, n));
    if (i ? i.ignore : kl.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!i || i.skip || i.closeParent) {
      i && i.closeParent ? this.open = Math.max(0, this.open - 1) : i && i.skip.nodeType && (e = i.skip);
      let o, s = this.top, l = this.needsBlock;
      if (oo.hasOwnProperty(r))
        s.content.length && s.content[0].isInline && this.open && (this.open--, s = this.top), o = !0, s.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      i && i.skip ? this.addAll(e) : this.withStyleRules(e, () => this.addAll(e)), o && this.sync(s), this.needsBlock = l;
    } else
      this.withStyleRules(e, () => {
        this.addElementByRule(e, i, i.consuming === !1 ? u : void 0);
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
    let n = I.none, r = I.none;
    for (let u = 0; u < e.length; u += 2)
      for (let i = void 0; ; ) {
        let o = this.parser.matchStyle(e[u], e[u + 1], this, i);
        if (!o)
          break;
        if (o.ignore)
          return null;
        if (o.clearMark ? this.top.pendingMarks.concat(this.top.activeMarks).forEach((s) => {
          o.clearMark(s) && (r = s.addToSet(r));
        }) : n = this.parser.schema.marks[o.mark].create(o.attrs).addToSet(n), o.consuming === !1)
          i = o;
        else
          break;
      }
    return [n, r];
  }
  // Look up a handler for the given node. If none are found, return
  // false. Otherwise, apply it, use its return value to drive the way
  // the node's content is wrapped, and return true.
  addElementByRule(e, n, r) {
    let u, i, o;
    n.node ? (i = this.parser.schema.nodes[n.node], i.isLeaf ? this.insertNode(i.create(n.attrs)) || this.leafFallback(e) : u = this.enter(i, n.attrs || null, n.preserveWhitespace)) : (o = this.parser.schema.marks[n.mark].create(n.attrs), this.addPendingMark(o));
    let s = this.top;
    if (i && i.isLeaf)
      this.findInside(e);
    else if (r)
      this.addElement(e, r);
    else if (n.getContent)
      this.findInside(e), n.getContent(e, this.parser.schema).forEach((l) => this.insertNode(l));
    else {
      let l = e;
      typeof n.contentElement == "string" ? l = e.querySelector(n.contentElement) : typeof n.contentElement == "function" ? l = n.contentElement(e) : n.contentElement && (l = n.contentElement), this.findAround(e, l, !0), this.addAll(l);
    }
    u && this.sync(s) && this.open--, o && this.removePendingMark(o, s);
  }
  // Add all child nodes between `startIndex` and `endIndex` (or the
  // whole node, if not given). If `sync` is passed, use it to
  // synchronize after every block element.
  addAll(e, n, r) {
    let u = n || 0;
    for (let i = n ? e.childNodes[n] : e.firstChild, o = r == null ? null : e.childNodes[r]; i != o; i = i.nextSibling, ++u)
      this.findAtPoint(e, u), this.addDOM(i);
    this.findAtPoint(e, u);
  }
  // Try to find a way to fit the given node type into the current
  // context. May add intermediate wrappers and/or leave non-solid
  // nodes that we're in.
  findPlace(e) {
    let n, r;
    for (let u = this.open; u >= 0; u--) {
      let i = this.nodes[u], o = i.findWrapping(e);
      if (o && (!n || n.length > o.length) && (n = o, r = i, !o.length) || i.solid)
        break;
    }
    if (!n)
      return !1;
    this.sync(r);
    for (let u = 0; u < n.length; u++)
      this.enterInner(n[u], null, !1);
    return !0;
  }
  // Try to insert the given node, adjusting the context when needed.
  insertNode(e) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let n = this.textblockFromContext();
      n && this.enterInner(n);
    }
    if (this.findPlace(e)) {
      this.closeExtra();
      let n = this.top;
      n.applyPending(e.type), n.match && (n.match = n.match.matchType(e.type));
      let r = n.activeMarks;
      for (let u = 0; u < e.marks.length; u++)
        (!n.type || n.type.allowsMarkType(e.marks[u].type)) && (r = e.marks[u].addToSet(r));
      return n.content.push(e.mark(r)), !0;
    }
    return !1;
  }
  // Try to start a node of the given type, adjusting the context when
  // necessary.
  enter(e, n, r) {
    let u = this.findPlace(e.create(n));
    return u && this.enterInner(e, n, !0, r), u;
  }
  // Open a node of the given type
  enterInner(e, n = null, r = !1, u) {
    this.closeExtra();
    let i = this.top;
    i.applyPending(e), i.match = i.match && i.match.matchType(e);
    let o = Cu(e, u, i.options);
    i.options & Pt && i.content.length == 0 && (o |= Pt), this.nodes.push(new hn(e, n, i.activeMarks, i.pendingMarks, r, null, o)), this.open++;
  }
  // Make sure all nodes above this.open are finished and added to
  // their parents
  closeExtra(e = !1) {
    let n = this.nodes.length - 1;
    if (n > this.open) {
      for (; n > this.open; n--)
        this.nodes[n - 1].content.push(this.nodes[n].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(this.isOpen || this.options.topOpen);
  }
  sync(e) {
    for (let n = this.open; n >= 0; n--)
      if (this.nodes[n] == e)
        return this.open = n, !0;
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let n = this.open; n >= 0; n--) {
      let r = this.nodes[n].content;
      for (let u = r.length - 1; u >= 0; u--)
        e += r[u].nodeSize;
      n && e++;
    }
    return e;
  }
  findAtPoint(e, n) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e && this.find[r].offset == n && (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let n = 0; n < this.find.length; n++)
        this.find[n].pos == null && e.nodeType == 1 && e.contains(this.find[n].node) && (this.find[n].pos = this.currentPos);
  }
  findAround(e, n, r) {
    if (e != n && this.find)
      for (let u = 0; u < this.find.length; u++)
        this.find[u].pos == null && e.nodeType == 1 && e.contains(this.find[u].node) && n.compareDocumentPosition(this.find[u].node) & (r ? 2 : 4) && (this.find[u].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let n = 0; n < this.find.length; n++)
        this.find[n].node == e && (this.find[n].pos = this.currentPos - (e.nodeValue.length - this.find[n].offset));
  }
  // Determines whether the given context string matches this context.
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let n = e.split("/"), r = this.options.context, u = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), i = -(r ? r.depth + 1 : 0) + (u ? 0 : 1), o = (s, l) => {
      for (; s >= 0; s--) {
        let a = n[s];
        if (a == "") {
          if (s == n.length - 1 || s == 0)
            continue;
          for (; l >= i; l--)
            if (o(s - 1, l))
              return !0;
          return !1;
        } else {
          let c = l > 0 || l == 0 && u ? this.nodes[l].type : r && l >= i ? r.node(l - i).type : null;
          if (!c || c.name != a && c.groups.indexOf(a) == -1)
            return !1;
          l--;
        }
      }
      return !0;
    };
    return o(n.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let n = e.depth; n >= 0; n--) {
        let r = e.node(n).contentMatchAt(e.indexAfter(n)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs)
          return r;
      }
    for (let n in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[n];
      if (r.isTextblock && r.defaultAttrs)
        return r;
    }
  }
  addPendingMark(e) {
    let n = El(e, this.top.pendingMarks);
    n && this.top.stashMarks.push(n), this.top.pendingMarks = e.addToSet(this.top.pendingMarks);
  }
  removePendingMark(e, n) {
    for (let r = this.open; r >= 0; r--) {
      let u = this.nodes[r];
      if (u.pendingMarks.lastIndexOf(e) > -1)
        u.pendingMarks = e.removeFromSet(u.pendingMarks);
      else {
        u.activeMarks = e.removeFromSet(u.activeMarks);
        let o = u.popFromStashMark(e);
        o && u.type && u.type.allowsMarkType(o.type) && (u.activeMarks = o.addToSet(u.activeMarks));
      }
      if (u == n)
        break;
    }
  }
}
function Dl(t) {
  for (let e = t.firstChild, n = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && so.hasOwnProperty(r) && n ? (n.appendChild(e), e = n) : r == "li" ? n = e : r && (n = null);
  }
}
function Nl(t, e) {
  return (t.matches || t.msMatchesSelector || t.webkitMatchesSelector || t.mozMatchesSelector).call(t, e);
}
function Cl(t) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g, n, r = [];
  for (; n = e.exec(t); )
    r.push(n[1], n[2].trim());
  return r;
}
function Eu(t) {
  let e = {};
  for (let n in t)
    e[n] = t[n];
  return e;
}
function Al(t, e) {
  let n = e.schema.nodes;
  for (let r in n) {
    let u = n[r];
    if (!u.allowsMarkType(t))
      continue;
    let i = [], o = (s) => {
      i.push(s);
      for (let l = 0; l < s.edgeCount; l++) {
        let { type: a, next: c } = s.edge(l);
        if (a == e || i.indexOf(c) < 0 && o(c))
          return !0;
      }
    };
    if (o(u.contentMatch))
      return !0;
  }
}
function El(t, e) {
  for (let n = 0; n < e.length; n++)
    if (t.eq(e[n]))
      return e[n];
}
class we {
  /**
  Create a serializer. `nodes` should map node names to functions
  that take a node and return a description of the corresponding
  DOM. `marks` does the same for mark names, but also gets an
  argument that tells it whether the mark's content is block or
  inline content (for typical use, it'll always be inline). A mark
  serializer may be `null` to indicate that marks of that type
  should not be serialized.
  */
  constructor(e, n) {
    this.nodes = e, this.marks = n;
  }
  /**
  Serialize the content of this fragment to a DOM fragment. When
  not in the browser, the `document` option, containing a DOM
  document, should be passed so that the serializer can create
  nodes.
  */
  serializeFragment(e, n = {}, r) {
    r || (r = Kn(n).createDocumentFragment());
    let u = r, i = [];
    return e.forEach((o) => {
      if (i.length || o.marks.length) {
        let s = 0, l = 0;
        for (; s < i.length && l < o.marks.length; ) {
          let a = o.marks[l];
          if (!this.marks[a.type.name]) {
            l++;
            continue;
          }
          if (!a.eq(i[s][0]) || a.type.spec.spanning === !1)
            break;
          s++, l++;
        }
        for (; s < i.length; )
          u = i.pop()[1];
        for (; l < o.marks.length; ) {
          let a = o.marks[l++], c = this.serializeMark(a, o.isInline, n);
          c && (i.push([a, u]), u.appendChild(c.dom), u = c.contentDOM || c.dom);
        }
      }
      u.appendChild(this.serializeNodeInner(o, n));
    }), r;
  }
  /**
  @internal
  */
  serializeNodeInner(e, n) {
    let { dom: r, contentDOM: u } = we.renderSpec(Kn(n), this.nodes[e.type.name](e));
    if (u) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, n, u);
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
  serializeNode(e, n = {}) {
    let r = this.serializeNodeInner(e, n);
    for (let u = e.marks.length - 1; u >= 0; u--) {
      let i = this.serializeMark(e.marks[u], e.isInline, n);
      i && ((i.contentDOM || i.dom).appendChild(r), r = i.dom);
    }
    return r;
  }
  /**
  @internal
  */
  serializeMark(e, n, r = {}) {
    let u = this.marks[e.type.name];
    return u && we.renderSpec(Kn(r), u(e, n));
  }
  /**
  Render an [output spec](https://prosemirror.net/docs/ref/#model.DOMOutputSpec) to a DOM node. If
  the spec has a hole (zero) in it, `contentDOM` will point at the
  node with the hole.
  */
  static renderSpec(e, n, r = null) {
    if (typeof n == "string")
      return { dom: e.createTextNode(n) };
    if (n.nodeType != null)
      return { dom: n };
    if (n.dom && n.dom.nodeType != null)
      return n;
    let u = n[0], i = u.indexOf(" ");
    i > 0 && (r = u.slice(0, i), u = u.slice(i + 1));
    let o, s = r ? e.createElementNS(r, u) : e.createElement(u), l = n[1], a = 1;
    if (l && typeof l == "object" && l.nodeType == null && !Array.isArray(l)) {
      a = 2;
      for (let c in l)
        if (l[c] != null) {
          let f = c.indexOf(" ");
          f > 0 ? s.setAttributeNS(c.slice(0, f), c.slice(f + 1), l[c]) : s.setAttribute(c, l[c]);
        }
    }
    for (let c = a; c < n.length; c++) {
      let f = n[c];
      if (f === 0) {
        if (c < n.length - 1 || c > a)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom: s, contentDOM: s };
      } else {
        let { dom: d, contentDOM: p } = we.renderSpec(e, f, r);
        if (s.appendChild(d), p) {
          if (o)
            throw new RangeError("Multiple content holes");
          o = p;
        }
      }
    }
    return { dom: s, contentDOM: o };
  }
  /**
  Build a serializer using the [`toDOM`](https://prosemirror.net/docs/ref/#model.NodeSpec.toDOM)
  properties in a schema's node and mark specs.
  */
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new we(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let n = Tu(e.nodes);
    return n.text || (n.text = (r) => r.text), n;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Tu(e.marks);
  }
}
function Tu(t) {
  let e = {};
  for (let n in t) {
    let r = t[n].spec.toDOM;
    r && (e[n] = r);
  }
  return e;
}
function Kn(t) {
  return t.document || window.document;
}
const lo = 65535, ao = Math.pow(2, 16);
function Tl(t, e) {
  return t + e * ao;
}
function Iu(t) {
  return t & lo;
}
function Il(t) {
  return (t - (t & lo)) / ao;
}
const co = 1, fo = 2, yn = 4, ho = 8;
class Ir {
  /**
  @internal
  */
  constructor(e, n, r) {
    this.pos = e, this.delInfo = n, this.recover = r;
  }
  /**
  Tells you whether the position was deleted, that is, whether the
  step removed the token on the side queried (via the `assoc`)
  argument from the document.
  */
  get deleted() {
    return (this.delInfo & ho) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (co | yn)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (fo | yn)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & yn) > 0;
  }
}
class te {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, n = !1) {
    if (this.ranges = e, this.inverted = n, !e.length && te.empty)
      return te.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let n = 0, r = Iu(e);
    if (!this.inverted)
      for (let u = 0; u < r; u++)
        n += this.ranges[u * 3 + 2] - this.ranges[u * 3 + 1];
    return this.ranges[r * 3] + n + Il(e);
  }
  mapResult(e, n = 1) {
    return this._map(e, n, !1);
  }
  map(e, n = 1) {
    return this._map(e, n, !0);
  }
  /**
  @internal
  */
  _map(e, n, r) {
    let u = 0, i = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let s = 0; s < this.ranges.length; s += 3) {
      let l = this.ranges[s] - (this.inverted ? u : 0);
      if (l > e)
        break;
      let a = this.ranges[s + i], c = this.ranges[s + o], f = l + a;
      if (e <= f) {
        let d = a ? e == l ? -1 : e == f ? 1 : n : n, p = l + u + (d < 0 ? 0 : c);
        if (r)
          return p;
        let h = e == (n < 0 ? l : f) ? null : Tl(s / 3, e - l), m = e == l ? fo : e == f ? co : yn;
        return (n < 0 ? e != l : e != f) && (m |= ho), new Ir(p, m, h);
      }
      u += c - a;
    }
    return r ? e + u : new Ir(e + u, 0, null);
  }
  /**
  @internal
  */
  touches(e, n) {
    let r = 0, u = Iu(n), i = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let s = 0; s < this.ranges.length; s += 3) {
      let l = this.ranges[s] - (this.inverted ? r : 0);
      if (l > e)
        break;
      let a = this.ranges[s + i], c = l + a;
      if (e <= c && s == u * 3)
        return !0;
      r += this.ranges[s + o] - a;
    }
    return !1;
  }
  /**
  Calls the given function on each of the changed ranges included in
  this map.
  */
  forEach(e) {
    let n = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let u = 0, i = 0; u < this.ranges.length; u += 3) {
      let o = this.ranges[u], s = o - (this.inverted ? i : 0), l = o + (this.inverted ? 0 : i), a = this.ranges[u + n], c = this.ranges[u + r];
      e(s, s + a, l, l + c), i += c - a;
    }
  }
  /**
  Create an inverted version of this map. The result can be used to
  map positions in the post-step document to the pre-step document.
  */
  invert() {
    return new te(this.ranges, !this.inverted);
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
    return e == 0 ? te.empty : new te(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
te.empty = new te([]);
class xt {
  /**
  Create a new mapping with the given position maps.
  */
  constructor(e = [], n, r = 0, u = e.length) {
    this.maps = e, this.mirror = n, this.from = r, this.to = u;
  }
  /**
  Create a mapping that maps only through a part of this one.
  */
  slice(e = 0, n = this.maps.length) {
    return new xt(this.maps, this.mirror, e, n);
  }
  /**
  @internal
  */
  copy() {
    return new xt(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
  }
  /**
  Add a step map to the end of this mapping. If `mirrors` is
  given, it should be the index of the step map that is the mirror
  image of this one.
  */
  appendMap(e, n) {
    this.to = this.maps.push(e), n != null && this.setMirror(this.maps.length - 1, n);
  }
  /**
  Add all the step maps in a given mapping to this one (preserving
  mirroring information).
  */
  appendMapping(e) {
    for (let n = 0, r = this.maps.length; n < e.maps.length; n++) {
      let u = e.getMirror(n);
      this.appendMap(e.maps[n], u != null && u < n ? r + u : void 0);
    }
  }
  /**
  Finds the offset of the step map that mirrors the map at the
  given offset, in this mapping (as per the second argument to
  `appendMap`).
  */
  getMirror(e) {
    if (this.mirror) {
      for (let n = 0; n < this.mirror.length; n++)
        if (this.mirror[n] == e)
          return this.mirror[n + (n % 2 ? -1 : 1)];
    }
  }
  /**
  @internal
  */
  setMirror(e, n) {
    this.mirror || (this.mirror = []), this.mirror.push(e, n);
  }
  /**
  Append the inverse of the given mapping to this one.
  */
  appendMappingInverted(e) {
    for (let n = e.maps.length - 1, r = this.maps.length + e.maps.length; n >= 0; n--) {
      let u = e.getMirror(n);
      this.appendMap(e.maps[n].invert(), u != null && u > n ? r - u - 1 : void 0);
    }
  }
  /**
  Create an inverted version of this mapping.
  */
  invert() {
    let e = new xt();
    return e.appendMappingInverted(this), e;
  }
  /**
  Map a position through this mapping.
  */
  map(e, n = 1) {
    if (this.mirror)
      return this._map(e, n, !0);
    for (let r = this.from; r < this.to; r++)
      e = this.maps[r].map(e, n);
    return e;
  }
  /**
  Map a position through this mapping, returning a mapping
  result.
  */
  mapResult(e, n = 1) {
    return this._map(e, n, !1);
  }
  /**
  @internal
  */
  _map(e, n, r) {
    let u = 0;
    for (let i = this.from; i < this.to; i++) {
      let o = this.maps[i], s = o.mapResult(e, n);
      if (s.recover != null) {
        let l = this.getMirror(i);
        if (l != null && l > i && l < this.to) {
          i = l, e = this.maps[l].recover(s.recover);
          continue;
        }
      }
      u |= s.delInfo, e = s.pos;
    }
    return r ? e : new Ir(e, u, null);
  }
}
const Xn = /* @__PURE__ */ Object.create(null);
class Y {
  /**
  Get the step map that represents the changes made by this step,
  and which can be used to transform between positions in the old
  and the new document.
  */
  getMap() {
    return te.empty;
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
  static fromJSON(e, n) {
    if (!n || !n.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = Xn[n.stepType];
    if (!r)
      throw new RangeError(`No step type ${n.stepType} defined`);
    return r.fromJSON(e, n);
  }
  /**
  To be able to serialize steps to JSON, each step needs a string
  ID to attach to its JSON representation. Use this method to
  register an ID for your step classes. Try to pick something
  that's unlikely to clash with steps from other modules.
  */
  static jsonID(e, n) {
    if (e in Xn)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return Xn[e] = n, n.prototype.jsonID = e, n;
  }
}
class z {
  /**
  @internal
  */
  constructor(e, n) {
    this.doc = e, this.failed = n;
  }
  /**
  Create a successful step result.
  */
  static ok(e) {
    return new z(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new z(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, n, r, u) {
    try {
      return z.ok(e.replace(n, r, u));
    } catch (i) {
      if (i instanceof Nn)
        return z.fail(i.message);
      throw i;
    }
  }
}
function Zr(t, e, n) {
  let r = [];
  for (let u = 0; u < t.childCount; u++) {
    let i = t.child(u);
    i.content.size && (i = i.copy(Zr(i.content, e, i))), i.isInline && (i = e(i, n, u)), r.push(i);
  }
  return x.fromArray(r);
}
class Pe extends Y {
  /**
  Create a mark step.
  */
  constructor(e, n, r) {
    super(), this.from = e, this.to = n, this.mark = r;
  }
  apply(e) {
    let n = e.slice(this.from, this.to), r = e.resolve(this.from), u = r.node(r.sharedDepth(this.to)), i = new M(Zr(n.content, (o, s) => !o.isAtom || !s.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), u), n.openStart, n.openEnd);
    return z.fromReplace(e, this.from, this.to, i);
  }
  invert() {
    return new Me(this.from, this.to, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deleted && r.deleted || n.pos >= r.pos ? null : new Pe(n.pos, r.pos, this.mark);
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
  static fromJSON(e, n) {
    if (typeof n.from != "number" || typeof n.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new Pe(n.from, n.to, e.markFromJSON(n.mark));
  }
}
Y.jsonID("addMark", Pe);
class Me extends Y {
  /**
  Create a mark-removing step.
  */
  constructor(e, n, r) {
    super(), this.from = e, this.to = n, this.mark = r;
  }
  apply(e) {
    let n = e.slice(this.from, this.to), r = new M(Zr(n.content, (u) => u.mark(this.mark.removeFromSet(u.marks)), e), n.openStart, n.openEnd);
    return z.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Pe(this.from, this.to, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deleted && r.deleted || n.pos >= r.pos ? null : new Me(n.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Me && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Me(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
  static fromJSON(e, n) {
    if (typeof n.from != "number" || typeof n.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new Me(n.from, n.to, e.markFromJSON(n.mark));
  }
}
Y.jsonID("removeMark", Me);
class Ue extends Y {
  /**
  Create a node mark step.
  */
  constructor(e, n) {
    super(), this.pos = e, this.mark = n;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return z.fail("No node at mark step's position");
    let r = n.type.create(n.attrs, null, this.mark.addToSet(n.marks));
    return z.fromReplace(e, this.pos, this.pos + 1, new M(x.from(r), 0, n.isLeaf ? 0 : 1));
  }
  invert(e) {
    let n = e.nodeAt(this.pos);
    if (n) {
      let r = this.mark.addToSet(n.marks);
      if (r.length == n.marks.length) {
        for (let u = 0; u < n.marks.length; u++)
          if (!n.marks[u].isInSet(r))
            return new Ue(this.pos, n.marks[u]);
        return new Ue(this.pos, this.mark);
      }
    }
    return new Ct(this.pos, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new Ue(n.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new Ue(n.pos, e.markFromJSON(n.mark));
  }
}
Y.jsonID("addNodeMark", Ue);
class Ct extends Y {
  /**
  Create a mark-removing step.
  */
  constructor(e, n) {
    super(), this.pos = e, this.mark = n;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return z.fail("No node at mark step's position");
    let r = n.type.create(n.attrs, null, this.mark.removeFromSet(n.marks));
    return z.fromReplace(e, this.pos, this.pos + 1, new M(x.from(r), 0, n.isLeaf ? 0 : 1));
  }
  invert(e) {
    let n = e.nodeAt(this.pos);
    return !n || !this.mark.isInSet(n.marks) ? this : new Ue(this.pos, this.mark);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new Ct(n.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new Ct(n.pos, e.markFromJSON(n.mark));
  }
}
Y.jsonID("removeNodeMark", Ct);
class $ extends Y {
  /**
  The given `slice` should fit the 'gap' between `from` and
  `to`—the depths must line up, and the surrounding nodes must be
  able to be joined with the open sides of the slice. When
  `structure` is true, the step will fail if the content between
  from and to is not just a sequence of closing and then opening
  tokens (this is to guard against rebased replace steps
  overwriting something they weren't supposed to).
  */
  constructor(e, n, r, u = !1) {
    super(), this.from = e, this.to = n, this.slice = r, this.structure = u;
  }
  apply(e) {
    return this.structure && Sr(e, this.from, this.to) ? z.fail("Structure replace would overwrite content") : z.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new te([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new $(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return n.deletedAcross && r.deletedAcross ? null : new $(n.pos, Math.max(n.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof $) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let n = this.slice.size + e.slice.size == 0 ? M.empty : new M(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new $(this.from, this.to + (e.to - e.from), n, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let n = this.slice.size + e.slice.size == 0 ? M.empty : new M(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new $(e.from, this.to, n, this.structure);
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
  static fromJSON(e, n) {
    if (typeof n.from != "number" || typeof n.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new $(n.from, n.to, M.fromJSON(e, n.slice), !!n.structure);
  }
}
Y.jsonID("replace", $);
class q extends Y {
  /**
  Create a replace-around step with the given range and gap.
  `insert` should be the point in the slice into which the content
  of the gap should be moved. `structure` has the same meaning as
  it has in the [`ReplaceStep`](https://prosemirror.net/docs/ref/#transform.ReplaceStep) class.
  */
  constructor(e, n, r, u, i, o, s = !1) {
    super(), this.from = e, this.to = n, this.gapFrom = r, this.gapTo = u, this.slice = i, this.insert = o, this.structure = s;
  }
  apply(e) {
    if (this.structure && (Sr(e, this.from, this.gapFrom) || Sr(e, this.gapTo, this.to)))
      return z.fail("Structure gap-replace would overwrite content");
    let n = e.slice(this.gapFrom, this.gapTo);
    if (n.openStart || n.openEnd)
      return z.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, n.content);
    return r ? z.fromReplace(e, this.from, this.to, r) : z.fail("Content does not fit in gap");
  }
  getMap() {
    return new te([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let n = this.gapTo - this.gapFrom;
    return new q(this.from, this.from + this.slice.size + n, this.from + this.insert, this.from + this.insert + n, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let n = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), u = this.from == this.gapFrom ? n.pos : e.map(this.gapFrom, -1), i = this.to == this.gapTo ? r.pos : e.map(this.gapTo, 1);
    return n.deletedAcross && r.deletedAcross || u < n.pos || i > r.pos ? null : new q(n.pos, r.pos, u, i, this.slice, this.insert, this.structure);
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
  static fromJSON(e, n) {
    if (typeof n.from != "number" || typeof n.to != "number" || typeof n.gapFrom != "number" || typeof n.gapTo != "number" || typeof n.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new q(n.from, n.to, n.gapFrom, n.gapTo, M.fromJSON(e, n.slice), n.insert, !!n.structure);
  }
}
Y.jsonID("replaceAround", q);
function Sr(t, e, n) {
  let r = t.resolve(e), u = n - e, i = r.depth;
  for (; u > 0 && i > 0 && r.indexAfter(i) == r.node(i).childCount; )
    i--, u--;
  if (u > 0) {
    let o = r.node(i).maybeChild(r.indexAfter(i));
    for (; u > 0; ) {
      if (!o || o.isLeaf)
        return !0;
      o = o.firstChild, u--;
    }
  }
  return !1;
}
function Sl(t, e, n, r) {
  let u = [], i = [], o, s;
  t.doc.nodesBetween(e, n, (l, a, c) => {
    if (!l.isInline)
      return;
    let f = l.marks;
    if (!r.isInSet(f) && c.type.allowsMarkType(r.type)) {
      let d = Math.max(a, e), p = Math.min(a + l.nodeSize, n), h = r.addToSet(f);
      for (let m = 0; m < f.length; m++)
        f[m].isInSet(h) || (o && o.to == d && o.mark.eq(f[m]) ? o.to = p : u.push(o = new Me(d, p, f[m])));
      s && s.to == d ? s.to = p : i.push(s = new Pe(d, p, r));
    }
  }), u.forEach((l) => t.step(l)), i.forEach((l) => t.step(l));
}
function wl(t, e, n, r) {
  let u = [], i = 0;
  t.doc.nodesBetween(e, n, (o, s) => {
    if (!o.isInline)
      return;
    i++;
    let l = null;
    if (r instanceof Rn) {
      let a = o.marks, c;
      for (; c = r.isInSet(a); )
        (l || (l = [])).push(c), a = c.removeFromSet(a);
    } else
      r ? r.isInSet(o.marks) && (l = [r]) : l = o.marks;
    if (l && l.length) {
      let a = Math.min(s + o.nodeSize, n);
      for (let c = 0; c < l.length; c++) {
        let f = l[c], d;
        for (let p = 0; p < u.length; p++) {
          let h = u[p];
          h.step == i - 1 && f.eq(u[p].style) && (d = h);
        }
        d ? (d.to = a, d.step = i) : u.push({ style: f, from: Math.max(s, e), to: a, step: i });
      }
    }
  }), u.forEach((o) => t.step(new Me(o.from, o.to, o.style)));
}
function po(t, e, n, r = n.contentMatch, u = !0) {
  let i = t.doc.nodeAt(e), o = [], s = e + 1;
  for (let l = 0; l < i.childCount; l++) {
    let a = i.child(l), c = s + a.nodeSize, f = r.matchType(a.type);
    if (!f)
      o.push(new $(s, c, M.empty));
    else {
      r = f;
      for (let d = 0; d < a.marks.length; d++)
        n.allowsMarkType(a.marks[d].type) || t.step(new Me(s, c, a.marks[d]));
      if (u && a.isText && n.whitespace != "pre") {
        let d, p = /\r?\n|\r/g, h;
        for (; d = p.exec(a.text); )
          h || (h = new M(x.from(n.schema.text(" ", n.allowedMarks(a.marks))), 0, 0)), o.push(new $(s + d.index, s + d.index + d[0].length, h));
      }
    }
    s = c;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(x.empty, !0);
    t.replace(s, s, new M(l, 0, 0));
  }
  for (let l = o.length - 1; l >= 0; l--)
    t.step(o[l]);
}
function Ol(t, e, n) {
  return (e == 0 || t.canReplace(e, t.childCount)) && (n == t.childCount || t.canReplace(0, n));
}
function un(t) {
  let n = t.parent.content.cutByIndex(t.startIndex, t.endIndex);
  for (let r = t.depth; ; --r) {
    let u = t.$from.node(r), i = t.$from.index(r), o = t.$to.indexAfter(r);
    if (r < t.depth && u.canReplace(i, o, n))
      return r;
    if (r == 0 || u.type.spec.isolating || !Ol(u, i, o))
      break;
  }
  return null;
}
function _l(t, e, n) {
  let { $from: r, $to: u, depth: i } = e, o = r.before(i + 1), s = u.after(i + 1), l = o, a = s, c = x.empty, f = 0;
  for (let h = i, m = !1; h > n; h--)
    m || r.index(h) > 0 ? (m = !0, c = x.from(r.node(h).copy(c)), f++) : l--;
  let d = x.empty, p = 0;
  for (let h = i, m = !1; h > n; h--)
    m || u.after(h + 1) < u.end(h) ? (m = !0, d = x.from(u.node(h).copy(d)), p++) : a++;
  t.step(new q(l, a, o, s, new M(c.append(d), f, p), c.size - f, !0));
}
function Gr(t, e, n = null, r = t) {
  let u = zl(t, e), i = u && jl(r, e);
  return i ? u.map(Su).concat({ type: e, attrs: n }).concat(i.map(Su)) : null;
}
function Su(t) {
  return { type: t, attrs: null };
}
function zl(t, e) {
  let { parent: n, startIndex: r, endIndex: u } = t, i = n.contentMatchAt(r).findWrapping(e);
  if (!i)
    return null;
  let o = i.length ? i[0] : e;
  return n.canReplaceWith(r, u, o) ? i : null;
}
function jl(t, e) {
  let { parent: n, startIndex: r, endIndex: u } = t, i = n.child(r), o = e.contentMatch.findWrapping(i.type);
  if (!o)
    return null;
  let l = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let a = r; l && a < u; a++)
    l = l.matchType(n.child(a).type);
  return !l || !l.validEnd ? null : o;
}
function Ll(t, e, n) {
  let r = x.empty;
  for (let o = n.length - 1; o >= 0; o--) {
    if (r.size) {
      let s = n[o].type.contentMatch.matchFragment(r);
      if (!s || !s.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = x.from(n[o].type.create(n[o].attrs, r));
  }
  let u = e.start, i = e.end;
  t.step(new q(u, i, u, i, new M(r, 0, 0), n.length, !0));
}
function Fl(t, e, n, r, u) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let i = t.steps.length;
  t.doc.nodesBetween(e, n, (o, s) => {
    if (o.isTextblock && !o.hasMarkup(r, u) && Bl(t.doc, t.mapping.slice(i).map(s), r)) {
      let l = null;
      if (r.schema.linebreakReplacement) {
        let d = r.whitespace == "pre", p = !!r.contentMatch.matchType(r.schema.linebreakReplacement);
        d && !p ? l = !1 : !d && p && (l = !0);
      }
      l === !1 && Rl(t, o, s, i), po(t, t.mapping.slice(i).map(s, 1), r, void 0, l === null);
      let a = t.mapping.slice(i), c = a.map(s, 1), f = a.map(s + o.nodeSize, 1);
      return t.step(new q(c, f, c + 1, f - 1, new M(x.from(r.create(u, null, o.marks)), 0, 0), 1, !0)), l === !0 && vl(t, o, s, i), !1;
    }
  });
}
function vl(t, e, n, r) {
  e.forEach((u, i) => {
    if (u.isText) {
      let o, s = /\r?\n|\r/g;
      for (; o = s.exec(u.text); ) {
        let l = t.mapping.slice(r).map(n + 1 + i + o.index);
        t.replaceWith(l, l + 1, e.type.schema.linebreakReplacement.create());
      }
    }
  });
}
function Rl(t, e, n, r) {
  e.forEach((u, i) => {
    if (u.type == u.type.schema.linebreakReplacement) {
      let o = t.mapping.slice(r).map(n + 1 + i);
      t.replaceWith(o, o + 1, e.type.schema.text(`
`));
    }
  });
}
function Bl(t, e, n) {
  let r = t.resolve(e), u = r.index();
  return r.parent.canReplaceWith(u, u + 1, n);
}
function Pl(t, e, n, r, u) {
  let i = t.doc.nodeAt(e);
  if (!i)
    throw new RangeError("No node at given position");
  n || (n = i.type);
  let o = n.create(r, null, u || i.marks);
  if (i.isLeaf)
    return t.replaceWith(e, e + i.nodeSize, o);
  if (!n.validContent(i.content))
    throw new RangeError("Invalid content for node type " + n.name);
  t.step(new q(e, e + i.nodeSize, e + 1, e + i.nodeSize - 1, new M(x.from(o), 0, 0), 1, !0));
}
function Mt(t, e, n = 1, r) {
  let u = t.resolve(e), i = u.depth - n, o = r && r[r.length - 1] || u.parent;
  if (i < 0 || u.parent.type.spec.isolating || !u.parent.canReplace(u.index(), u.parent.childCount) || !o.type.validContent(u.parent.content.cutByIndex(u.index(), u.parent.childCount)))
    return !1;
  for (let a = u.depth - 1, c = n - 2; a > i; a--, c--) {
    let f = u.node(a), d = u.index(a);
    if (f.type.spec.isolating)
      return !1;
    let p = f.content.cutByIndex(d, f.childCount), h = r && r[c + 1];
    h && (p = p.replaceChild(0, h.type.create(h.attrs)));
    let m = r && r[c] || f;
    if (!f.canReplace(d + 1, f.childCount) || !m.type.validContent(p))
      return !1;
  }
  let s = u.indexAfter(i), l = r && r[0];
  return u.node(i).canReplaceWith(s, s, l ? l.type : u.node(i + 1).type);
}
function Ul(t, e, n = 1, r) {
  let u = t.doc.resolve(e), i = x.empty, o = x.empty;
  for (let s = u.depth, l = u.depth - n, a = n - 1; s > l; s--, a--) {
    i = x.from(u.node(s).copy(i));
    let c = r && r[a];
    o = x.from(c ? c.type.create(c.attrs, o) : u.node(s).copy(o));
  }
  t.step(new $(e, e, new M(i.append(o), n, n), !0));
}
function _t(t, e) {
  let n = t.resolve(e), r = n.index();
  return mo(n.nodeBefore, n.nodeAfter) && n.parent.canReplace(r, r + 1);
}
function mo(t, e) {
  return !!(t && e && !t.isLeaf && t.canAppend(e));
}
function go(t, e, n = -1) {
  let r = t.resolve(e);
  for (let u = r.depth; ; u--) {
    let i, o, s = r.index(u);
    if (u == r.depth ? (i = r.nodeBefore, o = r.nodeAfter) : n > 0 ? (i = r.node(u + 1), s++, o = r.node(u).maybeChild(s)) : (i = r.node(u).maybeChild(s - 1), o = r.node(u + 1)), i && !i.isTextblock && mo(i, o) && r.node(u).canReplace(s, s + 1))
      return e;
    if (u == 0)
      break;
    e = n < 0 ? r.before(u) : r.after(u);
  }
}
function ql(t, e, n) {
  let r = new $(e - n, e + n, M.empty, !0);
  t.step(r);
}
function Vl(t, e, n) {
  let r = t.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), n))
    return e;
  if (r.parentOffset == 0)
    for (let u = r.depth - 1; u >= 0; u--) {
      let i = r.index(u);
      if (r.node(u).canReplaceWith(i, i, n))
        return r.before(u + 1);
      if (i > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let u = r.depth - 1; u >= 0; u--) {
      let i = r.indexAfter(u);
      if (r.node(u).canReplaceWith(i, i, n))
        return r.after(u + 1);
      if (i < r.node(u).childCount)
        return null;
    }
  return null;
}
function bo(t, e, n) {
  let r = t.resolve(e);
  if (!n.content.size)
    return e;
  let u = n.content;
  for (let i = 0; i < n.openStart; i++)
    u = u.firstChild.content;
  for (let i = 1; i <= (n.openStart == 0 && n.size ? 2 : 1); i++)
    for (let o = r.depth; o >= 0; o--) {
      let s = o == r.depth ? 0 : r.pos <= (r.start(o + 1) + r.end(o + 1)) / 2 ? -1 : 1, l = r.index(o) + (s > 0 ? 1 : 0), a = r.node(o), c = !1;
      if (i == 1)
        c = a.canReplace(l, l, u);
      else {
        let f = a.contentMatchAt(l).findWrapping(u.firstChild.type);
        c = f && a.canReplaceWith(l, l, f[0]);
      }
      if (c)
        return s == 0 ? r.pos : s < 0 ? r.before(o + 1) : r.after(o + 1);
    }
  return null;
}
function Kr(t, e, n = e, r = M.empty) {
  if (e == n && !r.size)
    return null;
  let u = t.resolve(e), i = t.resolve(n);
  return xo(u, i, r) ? new $(e, n, r) : new Ql(u, i, r).fit();
}
function xo(t, e, n) {
  return !n.openStart && !n.openEnd && t.start() == e.start() && t.parent.canReplace(t.index(), e.index(), n.content);
}
class Ql {
  constructor(e, n, r) {
    this.$from = e, this.$to = n, this.unplaced = r, this.frontier = [], this.placed = x.empty;
    for (let u = 0; u <= e.depth; u++) {
      let i = e.node(u);
      this.frontier.push({
        type: i.type,
        match: i.contentMatchAt(e.indexAfter(u))
      });
    }
    for (let u = e.depth; u > 0; u--)
      this.placed = x.from(e.node(u).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let a = this.findFittable();
      a ? this.placeNodes(a) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), n = this.placed.size - this.depth - this.$from.depth, r = this.$from, u = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!u)
      return null;
    let i = this.placed, o = r.depth, s = u.depth;
    for (; o && s && i.childCount == 1; )
      i = i.firstChild.content, o--, s--;
    let l = new M(i, o, s);
    return e > -1 ? new q(r.pos, e, this.$to.pos, this.$to.end(), l, n) : l.size || r.pos != this.$to.pos ? new $(r.pos, u.pos, l) : null;
  }
  // Find a position on the start spine of `this.unplaced` that has
  // content that can be moved somewhere on the frontier. Returns two
  // depths, one for the slice and one for the frontier.
  findFittable() {
    let e = this.unplaced.openStart;
    for (let n = this.unplaced.content, r = 0, u = this.unplaced.openEnd; r < e; r++) {
      let i = n.firstChild;
      if (n.childCount > 1 && (u = 0), i.type.spec.isolating && u <= r) {
        e = r;
        break;
      }
      n = i.content;
    }
    for (let n = 1; n <= 2; n++)
      for (let r = n == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
        let u, i = null;
        r ? (i = er(this.unplaced.content, r - 1).firstChild, u = i.content) : u = this.unplaced.content;
        let o = u.firstChild;
        for (let s = this.depth; s >= 0; s--) {
          let { type: l, match: a } = this.frontier[s], c, f = null;
          if (n == 1 && (o ? a.matchType(o.type) || (f = a.fillBefore(x.from(o), !1)) : i && l.compatibleContent(i.type)))
            return { sliceDepth: r, frontierDepth: s, parent: i, inject: f };
          if (n == 2 && o && (c = a.findWrapping(o.type)))
            return { sliceDepth: r, frontierDepth: s, parent: i, wrap: c };
          if (i && a.matchType(i.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: n, openEnd: r } = this.unplaced, u = er(e, n);
    return !u.childCount || u.firstChild.isLeaf ? !1 : (this.unplaced = new M(e, n + 1, Math.max(r, u.size + n >= e.size - r ? n + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: n, openEnd: r } = this.unplaced, u = er(e, n);
    if (u.childCount <= 1 && n > 0) {
      let i = e.size - n <= n + u.size;
      this.unplaced = new M(Ft(e, n - 1, 1), n - 1, i ? n - 1 : r);
    } else
      this.unplaced = new M(Ft(e, n, 1), n, r);
  }
  // Move content from the unplaced slice at `sliceDepth` to the
  // frontier node at `frontierDepth`. Close that frontier node when
  // applicable.
  placeNodes({ sliceDepth: e, frontierDepth: n, parent: r, inject: u, wrap: i }) {
    for (; this.depth > n; )
      this.closeFrontierNode();
    if (i)
      for (let m = 0; m < i.length; m++)
        this.openFrontierNode(i[m]);
    let o = this.unplaced, s = r ? r.content : o.content, l = o.openStart - e, a = 0, c = [], { match: f, type: d } = this.frontier[n];
    if (u) {
      for (let m = 0; m < u.childCount; m++)
        c.push(u.child(m));
      f = f.matchFragment(u);
    }
    let p = s.size + e - (o.content.size - o.openEnd);
    for (; a < s.childCount; ) {
      let m = s.child(a), g = f.matchType(m.type);
      if (!g)
        break;
      a++, (a > 1 || l == 0 || m.content.size) && (f = g, c.push(Mo(m.mark(d.allowedMarks(m.marks)), a == 1 ? l : 0, a == s.childCount ? p : -1)));
    }
    let h = a == s.childCount;
    h || (p = -1), this.placed = vt(this.placed, n, x.from(c)), this.frontier[n].match = f, h && p < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = s; m < p; m++) {
      let b = g.lastChild;
      this.frontier.push({ type: b.type, match: b.contentMatchAt(b.childCount) }), g = b.content;
    }
    this.unplaced = h ? e == 0 ? M.empty : new M(Ft(o.content, e - 1, 1), e - 1, p < 0 ? o.openEnd : e - 1) : new M(Ft(o.content, e, a), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], n;
    if (!e.type.isTextblock || !tr(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (n = this.findCloseLevel(this.$to)) && n.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, u = this.$to.after(r);
    for (; r > 1 && u == this.$to.end(--r); )
      ++u;
    return u;
  }
  findCloseLevel(e) {
    e:
      for (let n = Math.min(this.depth, e.depth); n >= 0; n--) {
        let { match: r, type: u } = this.frontier[n], i = n < e.depth && e.end(n + 1) == e.pos + (e.depth - (n + 1)), o = tr(e, n, u, r, i);
        if (o) {
          for (let s = n - 1; s >= 0; s--) {
            let { match: l, type: a } = this.frontier[s], c = tr(e, s, a, l, !0);
            if (!c || c.childCount)
              continue e;
          }
          return { depth: n, fit: o, move: i ? e.doc.resolve(e.after(n + 1)) : e };
        }
      }
  }
  close(e) {
    let n = this.findCloseLevel(e);
    if (!n)
      return null;
    for (; this.depth > n.depth; )
      this.closeFrontierNode();
    n.fit.childCount && (this.placed = vt(this.placed, n.depth, n.fit)), e = n.move;
    for (let r = n.depth + 1; r <= e.depth; r++) {
      let u = e.node(r), i = u.type.contentMatch.fillBefore(u.content, !0, e.index(r));
      this.openFrontierNode(u.type, u.attrs, i);
    }
    return e;
  }
  openFrontierNode(e, n = null, r) {
    let u = this.frontier[this.depth];
    u.match = u.match.matchType(e), this.placed = vt(this.placed, this.depth, x.from(e.create(n, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let n = this.frontier.pop().match.fillBefore(x.empty, !0);
    n.childCount && (this.placed = vt(this.placed, this.frontier.length, n));
  }
}
function Ft(t, e, n) {
  return e == 0 ? t.cutByIndex(n, t.childCount) : t.replaceChild(0, t.firstChild.copy(Ft(t.firstChild.content, e - 1, n)));
}
function vt(t, e, n) {
  return e == 0 ? t.append(n) : t.replaceChild(t.childCount - 1, t.lastChild.copy(vt(t.lastChild.content, e - 1, n)));
}
function er(t, e) {
  for (let n = 0; n < e; n++)
    t = t.firstChild.content;
  return t;
}
function Mo(t, e, n) {
  if (e <= 0)
    return t;
  let r = t.content;
  return e > 1 && (r = r.replaceChild(0, Mo(r.firstChild, e - 1, r.childCount == 1 ? n - 1 : 0))), e > 0 && (r = t.type.contentMatch.fillBefore(r).append(r), n <= 0 && (r = r.append(t.type.contentMatch.matchFragment(r).fillBefore(x.empty, !0)))), t.copy(r);
}
function tr(t, e, n, r, u) {
  let i = t.node(e), o = u ? t.indexAfter(e) : t.index(e);
  if (o == i.childCount && !n.compatibleContent(i.type))
    return null;
  let s = r.fillBefore(i.content, !0, o);
  return s && !$l(n, i.content, o) ? s : null;
}
function $l(t, e, n) {
  for (let r = n; r < e.childCount; r++)
    if (!t.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function Yl(t) {
  return t.spec.defining || t.spec.definingForContent;
}
function Wl(t, e, n, r) {
  if (!r.size)
    return t.deleteRange(e, n);
  let u = t.doc.resolve(e), i = t.doc.resolve(n);
  if (xo(u, i, r))
    return t.step(new $(e, n, r));
  let o = ko(u, t.doc.resolve(n));
  o[o.length - 1] == 0 && o.pop();
  let s = -(u.depth + 1);
  o.unshift(s);
  for (let d = u.depth, p = u.pos - 1; d > 0; d--, p--) {
    let h = u.node(d).type.spec;
    if (h.defining || h.definingAsContext || h.isolating)
      break;
    o.indexOf(d) > -1 ? s = d : u.before(d) == p && o.splice(1, 0, -d);
  }
  let l = o.indexOf(s), a = [], c = r.openStart;
  for (let d = r.content, p = 0; ; p++) {
    let h = d.firstChild;
    if (a.push(h), p == r.openStart)
      break;
    d = h.content;
  }
  for (let d = c - 1; d >= 0; d--) {
    let p = a[d], h = Yl(p.type);
    if (h && !p.sameMarkup(u.node(Math.abs(s) - 1)))
      c = d;
    else if (h || !p.type.isTextblock)
      break;
  }
  for (let d = r.openStart; d >= 0; d--) {
    let p = (d + c + 1) % (r.openStart + 1), h = a[p];
    if (h)
      for (let m = 0; m < o.length; m++) {
        let g = o[(m + l) % o.length], b = !0;
        g < 0 && (b = !1, g = -g);
        let y = u.node(g - 1), D = u.index(g - 1);
        if (y.canReplaceWith(D, D, h.type, h.marks))
          return t.replace(u.before(g), b ? i.after(g) : n, new M(yo(r.content, 0, r.openStart, p), p, r.openEnd));
      }
  }
  let f = t.steps.length;
  for (let d = o.length - 1; d >= 0 && (t.replace(e, n, r), !(t.steps.length > f)); d--) {
    let p = o[d];
    p < 0 || (e = u.before(p), n = i.after(p));
  }
}
function yo(t, e, n, r, u) {
  if (e < n) {
    let i = t.firstChild;
    t = t.replaceChild(0, i.copy(yo(i.content, e + 1, n, r, i)));
  }
  if (e > r) {
    let i = u.contentMatchAt(0), o = i.fillBefore(t).append(t);
    t = o.append(i.matchFragment(o).fillBefore(x.empty, !0));
  }
  return t;
}
function Hl(t, e, n, r) {
  if (!r.isInline && e == n && t.doc.resolve(e).parent.content.size) {
    let u = Vl(t.doc, e, r.type);
    u != null && (e = n = u);
  }
  t.replaceRange(e, n, new M(x.from(r), 0, 0));
}
function Jl(t, e, n) {
  let r = t.doc.resolve(e), u = t.doc.resolve(n), i = ko(r, u);
  for (let o = 0; o < i.length; o++) {
    let s = i[o], l = o == i.length - 1;
    if (l && s == 0 || r.node(s).type.contentMatch.validEnd)
      return t.delete(r.start(s), u.end(s));
    if (s > 0 && (l || r.node(s - 1).canReplace(r.index(s - 1), u.indexAfter(s - 1))))
      return t.delete(r.before(s), u.after(s));
  }
  for (let o = 1; o <= r.depth && o <= u.depth; o++)
    if (e - r.start(o) == r.depth - o && n > r.end(o) && u.end(o) - n != u.depth - o)
      return t.delete(r.before(o), n);
  t.delete(e, n);
}
function ko(t, e) {
  let n = [], r = Math.min(t.depth, e.depth);
  for (let u = r; u >= 0; u--) {
    let i = t.start(u);
    if (i < t.pos - (t.depth - u) || e.end(u) > e.pos + (e.depth - u) || t.node(u).type.spec.isolating || e.node(u).type.spec.isolating)
      break;
    (i == e.start(u) || u == t.depth && u == e.depth && t.parent.inlineContent && e.parent.inlineContent && u && e.start(u - 1) == i - 1) && n.push(u);
  }
  return n;
}
class yt extends Y {
  /**
  Construct an attribute step.
  */
  constructor(e, n, r) {
    super(), this.pos = e, this.attr = n, this.value = r;
  }
  apply(e) {
    let n = e.nodeAt(this.pos);
    if (!n)
      return z.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in n.attrs)
      r[i] = n.attrs[i];
    r[this.attr] = this.value;
    let u = n.type.create(r, null, n.marks);
    return z.fromReplace(e, this.pos, this.pos + 1, new M(x.from(u), 0, n.isLeaf ? 0 : 1));
  }
  getMap() {
    return te.empty;
  }
  invert(e) {
    return new yt(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let n = e.mapResult(this.pos, 1);
    return n.deletedAfter ? null : new yt(n.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, n) {
    if (typeof n.pos != "number" || typeof n.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new yt(n.pos, n.attr, n.value);
  }
}
Y.jsonID("attr", yt);
class Wt extends Y {
  /**
  Construct an attribute step.
  */
  constructor(e, n) {
    super(), this.attr = e, this.value = n;
  }
  apply(e) {
    let n = /* @__PURE__ */ Object.create(null);
    for (let u in e.attrs)
      n[u] = e.attrs[u];
    n[this.attr] = this.value;
    let r = e.type.create(n, e.content, e.marks);
    return z.ok(r);
  }
  getMap() {
    return te.empty;
  }
  invert(e) {
    return new Wt(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, n) {
    if (typeof n.attr != "string")
      throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new Wt(n.attr, n.value);
  }
}
Y.jsonID("docAttr", Wt);
let At = class extends Error {
};
At = function t(e) {
  let n = Error.call(this, e);
  return n.__proto__ = t.prototype, n;
};
At.prototype = Object.create(Error.prototype);
At.prototype.constructor = At;
At.prototype.name = "TransformError";
class Zl {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new xt();
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
    let n = this.maybeStep(e);
    if (n.failed)
      throw new At(n.failed);
    return this;
  }
  /**
  Try to apply a step in this transformation, ignoring it if it
  fails. Returns the step result.
  */
  maybeStep(e) {
    let n = e.apply(this.doc);
    return n.failed || this.addStep(e, n.doc), n;
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
  addStep(e, n) {
    this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = n;
  }
  /**
  Replace the part of the document between `from` and `to` with the
  given `slice`.
  */
  replace(e, n = e, r = M.empty) {
    let u = Kr(this.doc, e, n, r);
    return u && this.step(u), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, n, r) {
    return this.replace(e, n, new M(x.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, n) {
    return this.replace(e, n, M.empty);
  }
  /**
  Insert the given content at the given position.
  */
  insert(e, n) {
    return this.replaceWith(e, e, n);
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
  replaceRange(e, n, r) {
    return Wl(this, e, n, r), this;
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
  replaceRangeWith(e, n, r) {
    return Hl(this, e, n, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, n) {
    return Jl(this, e, n), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, n) {
    return _l(this, e, n), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, n = 1) {
    return ql(this, e, n), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, n) {
    return Ll(this, e, n), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, n = e, r, u = null) {
    return Fl(this, e, n, r, u), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, n, r = null, u) {
    return Pl(this, e, n, r, u), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, n, r) {
    return this.step(new yt(e, n, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, n) {
    return this.step(new Wt(e, n)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, n) {
    return this.step(new Ue(e, n)), this;
  }
  /**
  Remove a mark (or a mark of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, n) {
    if (!(n instanceof I)) {
      let r = this.doc.nodeAt(e);
      if (!r)
        throw new RangeError("No node at position " + e);
      if (n = n.isInSet(r.marks), !n)
        return this;
    }
    return this.step(new Ct(e, n)), this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split.
  */
  split(e, n = 1, r) {
    return Ul(this, e, n, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, n, r) {
    return Sl(this, e, n, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, n, r) {
    return wl(this, e, n, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, n, r) {
    return po(this, e, n, r), this;
  }
}
const nr = /* @__PURE__ */ Object.create(null);
class T {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, n, r) {
    this.$anchor = e, this.$head = n, this.ranges = r || [new Gl(e.min(n), e.max(n))];
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
    for (let n = 0; n < e.length; n++)
      if (e[n].$from.pos != e[n].$to.pos)
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
  replace(e, n = M.empty) {
    let r = n.content.lastChild, u = null;
    for (let s = 0; s < n.openEnd; s++)
      u = r, r = r.lastChild;
    let i = e.steps.length, o = this.ranges;
    for (let s = 0; s < o.length; s++) {
      let { $from: l, $to: a } = o[s], c = e.mapping.slice(i);
      e.replaceRange(c.map(l.pos), c.map(a.pos), s ? M.empty : n), s == 0 && _u(e, i, (r ? r.isInline : u && u.isTextblock) ? -1 : 1);
    }
  }
  /**
  Replace the selection with the given node, appending the changes
  to the given transaction.
  */
  replaceWith(e, n) {
    let r = e.steps.length, u = this.ranges;
    for (let i = 0; i < u.length; i++) {
      let { $from: o, $to: s } = u[i], l = e.mapping.slice(r), a = l.map(o.pos), c = l.map(s.pos);
      i ? e.deleteRange(a, c) : (e.replaceRangeWith(a, c, n), _u(e, r, n.isInline ? -1 : 1));
    }
  }
  /**
  Find a valid cursor or leaf node selection starting at the given
  position and searching back if `dir` is negative, and forward if
  positive. When `textOnly` is true, only consider cursor
  selections. Will return null when no valid selection position is
  found.
  */
  static findFrom(e, n, r = !1) {
    let u = e.parent.inlineContent ? new S(e) : mt(e.node(0), e.parent, e.pos, e.index(), n, r);
    if (u)
      return u;
    for (let i = e.depth - 1; i >= 0; i--) {
      let o = n < 0 ? mt(e.node(0), e.node(i), e.before(i + 1), e.index(i), n, r) : mt(e.node(0), e.node(i), e.after(i + 1), e.index(i) + 1, n, r);
      if (o)
        return o;
    }
    return null;
  }
  /**
  Find a valid cursor or leaf node selection near the given
  position. Searches forward first by default, but if `bias` is
  negative, it will search backwards first.
  */
  static near(e, n = 1) {
    return this.findFrom(e, n) || this.findFrom(e, -n) || new ne(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return mt(e, e, 0, 0, 1) || new ne(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return mt(e, e, e.content.size, e.childCount, -1) || new ne(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, n) {
    if (!n || !n.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = nr[n.type];
    if (!r)
      throw new RangeError(`No selection type ${n.type} defined`);
    return r.fromJSON(e, n);
  }
  /**
  To be able to deserialize selections from JSON, custom selection
  classes must register themselves with an ID string, so that they
  can be disambiguated. Try to pick something that's unlikely to
  clash with classes from other modules.
  */
  static jsonID(e, n) {
    if (e in nr)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return nr[e] = n, n.prototype.jsonID = e, n;
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
    return S.between(this.$anchor, this.$head).getBookmark();
  }
}
T.prototype.visible = !0;
class Gl {
  /**
  Create a range.
  */
  constructor(e, n) {
    this.$from = e, this.$to = n;
  }
}
let wu = !1;
function Ou(t) {
  !wu && !t.parent.inlineContent && (wu = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + t.parent.type.name + ")"));
}
class S extends T {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, n = e) {
    Ou(e), Ou(n), super(e, n);
  }
  /**
  Returns a resolved position if this is a cursor selection (an
  empty text selection), and null otherwise.
  */
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, n) {
    let r = e.resolve(n.map(this.head));
    if (!r.parent.inlineContent)
      return T.near(r);
    let u = e.resolve(n.map(this.anchor));
    return new S(u.parent.inlineContent ? u : r, r);
  }
  replace(e, n = M.empty) {
    if (super.replace(e, n), n == M.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof S && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Bn(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.anchor != "number" || typeof n.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new S(e.resolve(n.anchor), e.resolve(n.head));
  }
  /**
  Create a text selection from non-resolved positions.
  */
  static create(e, n, r = n) {
    let u = e.resolve(n);
    return new this(u, r == n ? u : e.resolve(r));
  }
  /**
  Return a text selection that spans the given positions or, if
  they aren't text positions, find a text selection near them.
  `bias` determines whether the method searches forward (default)
  or backwards (negative number) first. Will fall back to calling
  [`Selection.near`](https://prosemirror.net/docs/ref/#state.Selection^near) when the document
  doesn't contain a valid text position.
  */
  static between(e, n, r) {
    let u = e.pos - n.pos;
    if ((!r || u) && (r = u >= 0 ? 1 : -1), !n.parent.inlineContent) {
      let i = T.findFrom(n, r, !0) || T.findFrom(n, -r, !0);
      if (i)
        n = i.$head;
      else
        return T.near(n, r);
    }
    return e.parent.inlineContent || (u == 0 ? e = n : (e = (T.findFrom(e, -r, !0) || T.findFrom(e, r, !0)).$anchor, e.pos < n.pos != u < 0 && (e = n))), new S(e, n);
  }
}
T.jsonID("text", S);
class Bn {
  constructor(e, n) {
    this.anchor = e, this.head = n;
  }
  map(e) {
    return new Bn(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return S.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class N extends T {
  /**
  Create a node selection. Does not verify the validity of its
  argument.
  */
  constructor(e) {
    let n = e.nodeAfter, r = e.node(0).resolve(e.pos + n.nodeSize);
    super(e, r), this.node = n;
  }
  map(e, n) {
    let { deleted: r, pos: u } = n.mapResult(this.anchor), i = e.resolve(u);
    return r ? T.near(i) : new N(i);
  }
  content() {
    return new M(x.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof N && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new Xr(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new N(e.resolve(n.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, n) {
    return new N(e.resolve(n));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
N.prototype.visible = !1;
T.jsonID("node", N);
class Xr {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: n, pos: r } = e.mapResult(this.anchor);
    return n ? new Bn(r, r) : new Xr(r);
  }
  resolve(e) {
    let n = e.resolve(this.anchor), r = n.nodeAfter;
    return r && N.isSelectable(r) ? new N(n) : T.near(n);
  }
}
class ne extends T {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, n = M.empty) {
    if (n == M.empty) {
      e.delete(0, e.doc.content.size);
      let r = T.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else
      super.replace(e, n);
  }
  toJSON() {
    return { type: "all" };
  }
  /**
  @internal
  */
  static fromJSON(e) {
    return new ne(e);
  }
  map(e) {
    return new ne(e);
  }
  eq(e) {
    return e instanceof ne;
  }
  getBookmark() {
    return Kl;
  }
}
T.jsonID("all", ne);
const Kl = {
  map() {
    return this;
  },
  resolve(t) {
    return new ne(t);
  }
};
function mt(t, e, n, r, u, i = !1) {
  if (e.inlineContent)
    return S.create(t, n);
  for (let o = r - (u > 0 ? 0 : 1); u > 0 ? o < e.childCount : o >= 0; o += u) {
    let s = e.child(o);
    if (s.isAtom) {
      if (!i && N.isSelectable(s))
        return N.create(t, n - (u < 0 ? s.nodeSize : 0));
    } else {
      let l = mt(t, s, n + u, u < 0 ? s.childCount : 0, u, i);
      if (l)
        return l;
    }
    n += s.nodeSize * u;
  }
  return null;
}
function _u(t, e, n) {
  let r = t.steps.length - 1;
  if (r < e)
    return;
  let u = t.steps[r];
  if (!(u instanceof $ || u instanceof q))
    return;
  let i = t.mapping.maps[r], o;
  i.forEach((s, l, a, c) => {
    o == null && (o = c);
  }), t.setSelection(T.near(t.doc.resolve(o), n));
}
const zu = 1, pn = 2, ju = 4;
class Xl extends Zl {
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
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | zu) & ~pn, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & zu) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= pn, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return I.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
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
    return (this.updated & pn) > 0;
  }
  /**
  @internal
  */
  addStep(e, n) {
    super.addStep(e, n), this.updated = this.updated & ~pn, this.storedMarks = null;
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
  replaceSelectionWith(e, n = !0) {
    let r = this.selection;
    return n && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || I.none))), r.replaceWith(this, e), this;
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
  insertText(e, n, r) {
    let u = this.doc.type.schema;
    if (n == null)
      return e ? this.replaceSelectionWith(u.text(e), !0) : this.deleteSelection();
    {
      if (r == null && (r = n), r = r ?? n, !e)
        return this.deleteRange(n, r);
      let i = this.storedMarks;
      if (!i) {
        let o = this.doc.resolve(n);
        i = r == n ? o.marks() : o.marksAcross(this.doc.resolve(r));
      }
      return this.replaceRangeWith(n, r, u.text(e, i)), this.selection.empty || this.setSelection(T.near(this.selection.$to)), this;
    }
  }
  /**
  Store a metadata property in this transaction, keyed either by
  name or by plugin.
  */
  setMeta(e, n) {
    return this.meta[typeof e == "string" ? e : e.key] = n, this;
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
    return this.updated |= ju, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & ju) > 0;
  }
}
function Lu(t, e) {
  return !e || !t ? t : t.bind(e);
}
class Rt {
  constructor(e, n, r) {
    this.name = e, this.init = Lu(n.init, r), this.apply = Lu(n.apply, r);
  }
}
const ea = [
  new Rt("doc", {
    init(t) {
      return t.doc || t.schema.topNodeType.createAndFill();
    },
    apply(t) {
      return t.doc;
    }
  }),
  new Rt("selection", {
    init(t, e) {
      return t.selection || T.atStart(e.doc);
    },
    apply(t) {
      return t.selection;
    }
  }),
  new Rt("storedMarks", {
    init(t) {
      return t.storedMarks || null;
    },
    apply(t, e, n, r) {
      return r.selection.$cursor ? t.storedMarks : null;
    }
  }),
  new Rt("scrollToSelection", {
    init() {
      return 0;
    },
    apply(t, e) {
      return t.scrolledIntoView ? e + 1 : e;
    }
  })
];
class rr {
  constructor(e, n) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = ea.slice(), n && n.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new Rt(r.key, r.spec.state, r));
    });
  }
}
class bt {
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
  filterTransaction(e, n = -1) {
    for (let r = 0; r < this.config.plugins.length; r++)
      if (r != n) {
        let u = this.config.plugins[r];
        if (u.spec.filterTransaction && !u.spec.filterTransaction.call(u, e, this))
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
    let n = [e], r = this.applyInner(e), u = null;
    for (; ; ) {
      let i = !1;
      for (let o = 0; o < this.config.plugins.length; o++) {
        let s = this.config.plugins[o];
        if (s.spec.appendTransaction) {
          let l = u ? u[o].n : 0, a = u ? u[o].state : this, c = l < n.length && s.spec.appendTransaction.call(s, l ? n.slice(l) : n, a, r);
          if (c && r.filterTransaction(c, o)) {
            if (c.setMeta("appendedTransaction", e), !u) {
              u = [];
              for (let f = 0; f < this.config.plugins.length; f++)
                u.push(f < o ? { state: r, n: n.length } : { state: this, n: 0 });
            }
            n.push(c), r = r.applyInner(c), i = !0;
          }
          u && (u[o] = { state: r, n: n.length });
        }
      }
      if (!i)
        return { state: r, transactions: n };
    }
  }
  /**
  @internal
  */
  applyInner(e) {
    if (!e.before.eq(this.doc))
      throw new RangeError("Applying a mismatched transaction");
    let n = new bt(this.config), r = this.config.fields;
    for (let u = 0; u < r.length; u++) {
      let i = r[u];
      n[i.name] = i.apply(e, this[i.name], this, n);
    }
    return n;
  }
  /**
  Start a [transaction](https://prosemirror.net/docs/ref/#state.Transaction) from this state.
  */
  get tr() {
    return new Xl(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let n = new rr(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new bt(n);
    for (let u = 0; u < n.fields.length; u++)
      r[n.fields[u].name] = n.fields[u].init(e, r);
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
    let n = new rr(this.schema, e.plugins), r = n.fields, u = new bt(n);
    for (let i = 0; i < r.length; i++) {
      let o = r[i].name;
      u[o] = this.hasOwnProperty(o) ? this[o] : r[i].init(e, u);
    }
    return u;
  }
  /**
  Serialize this state to JSON. If you want to serialize the state
  of plugins, pass an object mapping property names to use in the
  resulting JSON object to plugin objects. The argument may also be
  a string or number, in which case it is ignored, to support the
  way `JSON.stringify` calls `toString` methods.
  */
  toJSON(e) {
    let n = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
    if (this.storedMarks && (n.storedMarks = this.storedMarks.map((r) => r.toJSON())), e && typeof e == "object")
      for (let r in e) {
        if (r == "doc" || r == "selection")
          throw new RangeError("The JSON fields `doc` and `selection` are reserved");
        let u = e[r], i = u.spec.state;
        i && i.toJSON && (n[r] = i.toJSON.call(u, this[u.key]));
      }
    return n;
  }
  /**
  Deserialize a JSON representation of a state. `config` should
  have at least a `schema` field, and should contain array of
  plugins to initialize the state with. `pluginFields` can be used
  to deserialize the state of plugins, by associating plugin
  instances with the property names they use in the JSON object.
  */
  static fromJSON(e, n, r) {
    if (!n)
      throw new RangeError("Invalid input for EditorState.fromJSON");
    if (!e.schema)
      throw new RangeError("Required config field 'schema' missing");
    let u = new rr(e.schema, e.plugins), i = new bt(u);
    return u.fields.forEach((o) => {
      if (o.name == "doc")
        i.doc = ut.fromJSON(e.schema, n.doc);
      else if (o.name == "selection")
        i.selection = T.fromJSON(i.doc, n.selection);
      else if (o.name == "storedMarks")
        n.storedMarks && (i.storedMarks = n.storedMarks.map(e.schema.markFromJSON));
      else {
        if (r)
          for (let s in r) {
            let l = r[s], a = l.spec.state;
            if (l.key == o.name && a && a.fromJSON && Object.prototype.hasOwnProperty.call(n, s)) {
              i[o.name] = a.fromJSON.call(l, e, n[s], i);
              return;
            }
          }
        i[o.name] = o.init(e, i);
      }
    }), i;
  }
}
function Do(t, e, n) {
  for (let r in t) {
    let u = t[r];
    u instanceof Function ? u = u.bind(e) : r == "handleDOMEvents" && (u = Do(u, e, {})), n[r] = u;
  }
  return n;
}
class _e {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Do(e.props, this, this.props), this.key = e.key ? e.key.key : No("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const ur = /* @__PURE__ */ Object.create(null);
function No(t) {
  return t in ur ? t + "$" + ++ur[t] : (ur[t] = 0, t + "$");
}
class Co {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = No(e);
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
const P = function(t) {
  for (var e = 0; ; e++)
    if (t = t.previousSibling, !t)
      return e;
}, Ht = function(t) {
  let e = t.assignedSlot || t.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let wr = null;
const Te = function(t, e, n) {
  let r = wr || (wr = document.createRange());
  return r.setEnd(t, n ?? t.nodeValue.length), r.setStart(t, e || 0), r;
}, ta = function() {
  wr = null;
}, at = function(t, e, n, r) {
  return n && (Fu(t, e, n, r, -1) || Fu(t, e, n, r, 1));
}, na = /^(img|br|input|textarea|hr)$/i;
function Fu(t, e, n, r, u) {
  for (; ; ) {
    if (t == n && e == r)
      return !0;
    if (e == (u < 0 ? 0 : xe(t))) {
      let i = t.parentNode;
      if (!i || i.nodeType != 1 || on(t) || na.test(t.nodeName) || t.contentEditable == "false")
        return !1;
      e = P(t) + (u < 0 ? 0 : 1), t = i;
    } else if (t.nodeType == 1) {
      if (t = t.childNodes[e + (u < 0 ? -1 : 0)], t.contentEditable == "false")
        return !1;
      e = u < 0 ? xe(t) : 0;
    } else
      return !1;
  }
}
function xe(t) {
  return t.nodeType == 3 ? t.nodeValue.length : t.childNodes.length;
}
function ra(t, e) {
  for (; ; ) {
    if (t.nodeType == 3 && e)
      return t;
    if (t.nodeType == 1 && e > 0) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[e - 1], e = xe(t);
    } else if (t.parentNode && !on(t))
      e = P(t), t = t.parentNode;
    else
      return null;
  }
}
function ua(t, e) {
  for (; ; ) {
    if (t.nodeType == 3 && e < t.nodeValue.length)
      return t;
    if (t.nodeType == 1 && e < t.childNodes.length) {
      if (t.contentEditable == "false")
        return null;
      t = t.childNodes[e], e = 0;
    } else if (t.parentNode && !on(t))
      e = P(t) + 1, t = t.parentNode;
    else
      return null;
  }
}
function ia(t, e, n) {
  for (let r = e == 0, u = e == xe(t); r || u; ) {
    if (t == n)
      return !0;
    let i = P(t);
    if (t = t.parentNode, !t)
      return !1;
    r = r && i == 0, u = u && i == xe(t);
  }
}
function on(t) {
  let e;
  for (let n = t; n && !(e = n.pmViewDesc); n = n.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == t || e.contentDOM == t);
}
const Pn = function(t) {
  return t.focusNode && at(t.focusNode, t.focusOffset, t.anchorNode, t.anchorOffset);
};
function Xe(t, e) {
  let n = document.createEvent("Event");
  return n.initEvent("keydown", !0, !0), n.keyCode = t, n.key = n.code = e, n;
}
function oa(t) {
  let e = t.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function sa(t, e, n) {
  if (t.caretPositionFromPoint)
    try {
      let r = t.caretPositionFromPoint(e, n);
      if (r)
        return { node: r.offsetNode, offset: r.offset };
    } catch {
    }
  if (t.caretRangeFromPoint) {
    let r = t.caretRangeFromPoint(e, n);
    if (r)
      return { node: r.startContainer, offset: r.startOffset };
  }
}
const De = typeof navigator < "u" ? navigator : null, vu = typeof document < "u" ? document : null, Je = De && De.userAgent || "", Or = /Edge\/(\d+)/.exec(Je), Ao = /MSIE \d/.exec(Je), _r = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Je), X = !!(Ao || _r || Or), Qe = Ao ? document.documentMode : _r ? +_r[1] : Or ? +Or[1] : 0, pe = !X && /gecko\/(\d+)/i.test(Je);
pe && +(/Firefox\/(\d+)/.exec(Je) || [0, 0])[1];
const zr = !X && /Chrome\/(\d+)/.exec(Je), W = !!zr, la = zr ? +zr[1] : 0, H = !X && !!De && /Apple Computer/.test(De.vendor), Et = H && (/Mobile\/\w+/.test(Je) || !!De && De.maxTouchPoints > 2), ie = Et || (De ? /Mac/.test(De.platform) : !1), aa = De ? /Win/.test(De.platform) : !1, de = /Android \d/.test(Je), sn = !!vu && "webkitFontSmoothing" in vu.documentElement.style, ca = sn ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function fa(t) {
  let e = t.defaultView && t.defaultView.visualViewport;
  return e ? {
    left: 0,
    right: e.width,
    top: 0,
    bottom: e.height
  } : {
    left: 0,
    right: t.documentElement.clientWidth,
    top: 0,
    bottom: t.documentElement.clientHeight
  };
}
function Ee(t, e) {
  return typeof t == "number" ? t : t[e];
}
function da(t) {
  let e = t.getBoundingClientRect(), n = e.width / t.offsetWidth || 1, r = e.height / t.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + t.clientWidth * n,
    top: e.top,
    bottom: e.top + t.clientHeight * r
  };
}
function Ru(t, e, n) {
  let r = t.someProp("scrollThreshold") || 0, u = t.someProp("scrollMargin") || 5, i = t.dom.ownerDocument;
  for (let o = n || t.dom; o; o = Ht(o)) {
    if (o.nodeType != 1)
      continue;
    let s = o, l = s == i.body, a = l ? fa(i) : da(s), c = 0, f = 0;
    if (e.top < a.top + Ee(r, "top") ? f = -(a.top - e.top + Ee(u, "top")) : e.bottom > a.bottom - Ee(r, "bottom") && (f = e.bottom - e.top > a.bottom - a.top ? e.top + Ee(u, "top") - a.top : e.bottom - a.bottom + Ee(u, "bottom")), e.left < a.left + Ee(r, "left") ? c = -(a.left - e.left + Ee(u, "left")) : e.right > a.right - Ee(r, "right") && (c = e.right - a.right + Ee(u, "right")), c || f)
      if (l)
        i.defaultView.scrollBy(c, f);
      else {
        let d = s.scrollLeft, p = s.scrollTop;
        f && (s.scrollTop += f), c && (s.scrollLeft += c);
        let h = s.scrollLeft - d, m = s.scrollTop - p;
        e = { left: e.left - h, top: e.top - m, right: e.right - h, bottom: e.bottom - m };
      }
    if (l || /^(fixed|sticky)$/.test(getComputedStyle(o).position))
      break;
  }
}
function ha(t) {
  let e = t.dom.getBoundingClientRect(), n = Math.max(0, e.top), r, u;
  for (let i = (e.left + e.right) / 2, o = n + 1; o < Math.min(innerHeight, e.bottom); o += 5) {
    let s = t.root.elementFromPoint(i, o);
    if (!s || s == t.dom || !t.dom.contains(s))
      continue;
    let l = s.getBoundingClientRect();
    if (l.top >= n - 20) {
      r = s, u = l.top;
      break;
    }
  }
  return { refDOM: r, refTop: u, stack: Eo(t.dom) };
}
function Eo(t) {
  let e = [], n = t.ownerDocument;
  for (let r = t; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), t != n); r = Ht(r))
    ;
  return e;
}
function pa({ refDOM: t, refTop: e, stack: n }) {
  let r = t ? t.getBoundingClientRect().top : 0;
  To(n, r == 0 ? 0 : r - e);
}
function To(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { dom: r, top: u, left: i } = t[n];
    r.scrollTop != u + e && (r.scrollTop = u + e), r.scrollLeft != i && (r.scrollLeft = i);
  }
}
let dt = null;
function ma(t) {
  if (t.setActive)
    return t.setActive();
  if (dt)
    return t.focus(dt);
  let e = Eo(t);
  t.focus(dt == null ? {
    get preventScroll() {
      return dt = { preventScroll: !0 }, !0;
    }
  } : void 0), dt || (dt = !1, To(e, 0));
}
function Io(t, e) {
  let n, r = 2e8, u, i = 0, o = e.top, s = e.top, l, a;
  for (let c = t.firstChild, f = 0; c; c = c.nextSibling, f++) {
    let d;
    if (c.nodeType == 1)
      d = c.getClientRects();
    else if (c.nodeType == 3)
      d = Te(c).getClientRects();
    else
      continue;
    for (let p = 0; p < d.length; p++) {
      let h = d[p];
      if (h.top <= o && h.bottom >= s) {
        o = Math.max(h.bottom, o), s = Math.min(h.top, s);
        let m = h.left > e.left ? h.left - e.left : h.right < e.left ? e.left - h.right : 0;
        if (m < r) {
          n = c, r = m, u = m && n.nodeType == 3 ? {
            left: h.right < e.left ? h.right : h.left,
            top: e.top
          } : e, c.nodeType == 1 && m && (i = f + (e.left >= (h.left + h.right) / 2 ? 1 : 0));
          continue;
        }
      } else
        h.top > e.top && !l && h.left <= e.left && h.right >= e.left && (l = c, a = { left: Math.max(h.left, Math.min(h.right, e.left)), top: h.top });
      !n && (e.left >= h.right && e.top >= h.top || e.left >= h.left && e.top >= h.bottom) && (i = f + 1);
    }
  }
  return !n && l && (n = l, u = a, r = 0), n && n.nodeType == 3 ? ga(n, u) : !n || r && n.nodeType == 1 ? { node: t, offset: i } : Io(n, u);
}
function ga(t, e) {
  let n = t.nodeValue.length, r = document.createRange();
  for (let u = 0; u < n; u++) {
    r.setEnd(t, u + 1), r.setStart(t, u);
    let i = je(r, 1);
    if (i.top != i.bottom && eu(e, i))
      return { node: t, offset: u + (e.left >= (i.left + i.right) / 2 ? 1 : 0) };
  }
  return { node: t, offset: 0 };
}
function eu(t, e) {
  return t.left >= e.left - 1 && t.left <= e.right + 1 && t.top >= e.top - 1 && t.top <= e.bottom + 1;
}
function ba(t, e) {
  let n = t.parentNode;
  return n && /^li$/i.test(n.nodeName) && e.left < t.getBoundingClientRect().left ? n : t;
}
function xa(t, e, n) {
  let { node: r, offset: u } = Io(e, n), i = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    i = o.left != o.right && n.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return t.docView.posFromDOM(r, u, i);
}
function Ma(t, e, n, r) {
  let u = -1;
  for (let i = e, o = !1; i != t.dom; ) {
    let s = t.docView.nearestDesc(i, !0);
    if (!s)
      return null;
    if (s.dom.nodeType == 1 && (s.node.isBlock && s.parent && !o || !s.contentDOM)) {
      let l = s.dom.getBoundingClientRect();
      if (s.node.isBlock && s.parent && !o && (o = !0, l.left > r.left || l.top > r.top ? u = s.posBefore : (l.right < r.left || l.bottom < r.top) && (u = s.posAfter)), !s.contentDOM && u < 0 && !s.node.isText)
        return (s.node.isBlock ? r.top < (l.top + l.bottom) / 2 : r.left < (l.left + l.right) / 2) ? s.posBefore : s.posAfter;
    }
    i = s.dom.parentNode;
  }
  return u > -1 ? u : t.docView.posFromDOM(e, n, -1);
}
function So(t, e, n) {
  let r = t.childNodes.length;
  if (r && n.top < n.bottom)
    for (let u = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - n.top) / (n.bottom - n.top)) - 2)), i = u; ; ) {
      let o = t.childNodes[i];
      if (o.nodeType == 1) {
        let s = o.getClientRects();
        for (let l = 0; l < s.length; l++) {
          let a = s[l];
          if (eu(e, a))
            return So(o, e, a);
        }
      }
      if ((i = (i + 1) % r) == u)
        break;
    }
  return t;
}
function ya(t, e) {
  let n = t.dom.ownerDocument, r, u = 0, i = sa(n, e.left, e.top);
  i && ({ node: r, offset: u } = i);
  let o = (t.root.elementFromPoint ? t.root : n).elementFromPoint(e.left, e.top), s;
  if (!o || !t.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let a = t.dom.getBoundingClientRect();
    if (!eu(e, a) || (o = So(t.dom, e, a), !o))
      return null;
  }
  if (H)
    for (let a = o; r && a; a = Ht(a))
      a.draggable && (r = void 0);
  if (o = ba(o, e), r) {
    if (pe && r.nodeType == 1 && (u = Math.min(u, r.childNodes.length), u < r.childNodes.length)) {
      let c = r.childNodes[u], f;
      c.nodeName == "IMG" && (f = c.getBoundingClientRect()).right <= e.left && f.bottom > e.top && u++;
    }
    let a;
    sn && u && r.nodeType == 1 && (a = r.childNodes[u - 1]).nodeType == 1 && a.contentEditable == "false" && a.getBoundingClientRect().top >= e.top && u--, r == t.dom && u == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? s = t.state.doc.content.size : (u == 0 || r.nodeType != 1 || r.childNodes[u - 1].nodeName != "BR") && (s = Ma(t, r, u, e));
  }
  s == null && (s = xa(t, o, e));
  let l = t.docView.nearestDesc(o, !0);
  return { pos: s, inside: l ? l.posAtStart - l.border : -1 };
}
function Bu(t) {
  return t.top < t.bottom || t.left < t.right;
}
function je(t, e) {
  let n = t.getClientRects();
  if (n.length) {
    let r = n[e < 0 ? 0 : n.length - 1];
    if (Bu(r))
      return r;
  }
  return Array.prototype.find.call(n, Bu) || t.getBoundingClientRect();
}
const ka = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function wo(t, e, n) {
  let { node: r, offset: u, atom: i } = t.docView.domFromPos(e, n < 0 ? -1 : 1), o = sn || pe;
  if (r.nodeType == 3)
    if (o && (ka.test(r.nodeValue) || (n < 0 ? !u : u == r.nodeValue.length))) {
      let l = je(Te(r, u, u), n);
      if (pe && u && /\s/.test(r.nodeValue[u - 1]) && u < r.nodeValue.length) {
        let a = je(Te(r, u - 1, u - 1), -1);
        if (a.top == l.top) {
          let c = je(Te(r, u, u + 1), -1);
          if (c.top != l.top)
            return jt(c, c.left < a.left);
        }
      }
      return l;
    } else {
      let l = u, a = u, c = n < 0 ? 1 : -1;
      return n < 0 && !u ? (a++, c = -1) : n >= 0 && u == r.nodeValue.length ? (l--, c = 1) : n < 0 ? l-- : a++, jt(je(Te(r, l, a), c), c < 0);
    }
  if (!t.state.doc.resolve(e - (i || 0)).parent.inlineContent) {
    if (i == null && u && (n < 0 || u == xe(r))) {
      let l = r.childNodes[u - 1];
      if (l.nodeType == 1)
        return ir(l.getBoundingClientRect(), !1);
    }
    if (i == null && u < xe(r)) {
      let l = r.childNodes[u];
      if (l.nodeType == 1)
        return ir(l.getBoundingClientRect(), !0);
    }
    return ir(r.getBoundingClientRect(), n >= 0);
  }
  if (i == null && u && (n < 0 || u == xe(r))) {
    let l = r.childNodes[u - 1], a = l.nodeType == 3 ? Te(l, xe(l) - (o ? 0 : 1)) : l.nodeType == 1 && (l.nodeName != "BR" || !l.nextSibling) ? l : null;
    if (a)
      return jt(je(a, 1), !1);
  }
  if (i == null && u < xe(r)) {
    let l = r.childNodes[u];
    for (; l.pmViewDesc && l.pmViewDesc.ignoreForCoords; )
      l = l.nextSibling;
    let a = l ? l.nodeType == 3 ? Te(l, 0, o ? 0 : 1) : l.nodeType == 1 ? l : null : null;
    if (a)
      return jt(je(a, -1), !0);
  }
  return jt(je(r.nodeType == 3 ? Te(r) : r, -n), n >= 0);
}
function jt(t, e) {
  if (t.width == 0)
    return t;
  let n = e ? t.left : t.right;
  return { top: t.top, bottom: t.bottom, left: n, right: n };
}
function ir(t, e) {
  if (t.height == 0)
    return t;
  let n = e ? t.top : t.bottom;
  return { top: n, bottom: n, left: t.left, right: t.right };
}
function Oo(t, e, n) {
  let r = t.state, u = t.root.activeElement;
  r != e && t.updateState(e), u != t.dom && t.focus();
  try {
    return n();
  } finally {
    r != e && t.updateState(r), u != t.dom && u && u.focus();
  }
}
function Da(t, e, n) {
  let r = e.selection, u = n == "up" ? r.$from : r.$to;
  return Oo(t, e, () => {
    let { node: i } = t.docView.domFromPos(u.pos, n == "up" ? -1 : 1);
    for (; ; ) {
      let s = t.docView.nearestDesc(i, !0);
      if (!s)
        break;
      if (s.node.isBlock) {
        i = s.contentDOM || s.dom;
        break;
      }
      i = s.dom.parentNode;
    }
    let o = wo(t, u.pos, 1);
    for (let s = i.firstChild; s; s = s.nextSibling) {
      let l;
      if (s.nodeType == 1)
        l = s.getClientRects();
      else if (s.nodeType == 3)
        l = Te(s, 0, s.nodeValue.length).getClientRects();
      else
        continue;
      for (let a = 0; a < l.length; a++) {
        let c = l[a];
        if (c.bottom > c.top + 1 && (n == "up" ? o.top - c.top > (c.bottom - o.top) * 2 : c.bottom - o.bottom > (o.bottom - c.top) * 2))
          return !1;
      }
    }
    return !0;
  });
}
const Na = /[\u0590-\u08ac]/;
function Ca(t, e, n) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let u = r.parentOffset, i = !u, o = u == r.parent.content.size, s = t.domSelection();
  return !Na.test(r.parent.textContent) || !s.modify ? n == "left" || n == "backward" ? i : o : Oo(t, e, () => {
    let { focusNode: l, focusOffset: a, anchorNode: c, anchorOffset: f } = t.domSelectionRange(), d = s.caretBidiLevel;
    s.modify("move", n, "character");
    let p = r.depth ? t.docView.domAfterPos(r.before()) : t.dom, { focusNode: h, focusOffset: m } = t.domSelectionRange(), g = h && !p.contains(h.nodeType == 1 ? h : h.parentNode) || l == h && a == m;
    try {
      s.collapse(c, f), l && (l != c || a != f) && s.extend && s.extend(l, a);
    } catch {
    }
    return d != null && (s.caretBidiLevel = d), g;
  });
}
let Pu = null, Uu = null, qu = !1;
function Aa(t, e, n) {
  return Pu == e && Uu == n ? qu : (Pu = e, Uu = n, qu = n == "up" || n == "down" ? Da(t, e, n) : Ca(t, e, n));
}
const ce = 0, Vu = 1, et = 2, Ne = 3;
class ln {
  constructor(e, n, r, u) {
    this.parent = e, this.children = n, this.dom = r, this.contentDOM = u, this.dirty = ce, r.pmViewDesc = this;
  }
  // Used to check whether a given description corresponds to a
  // widget/mark/node.
  matchesWidget(e) {
    return !1;
  }
  matchesMark(e) {
    return !1;
  }
  matchesNode(e, n, r) {
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
    for (let n = 0; n < this.children.length; n++)
      e += this.children[n].size;
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
    for (let n = 0, r = this.posAtStart; ; n++) {
      let u = this.children[n];
      if (u == e)
        return r;
      r += u.size;
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
  localPosFromDOM(e, n, r) {
    if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode))
      if (r < 0) {
        let i, o;
        if (e == this.contentDOM)
          i = e.childNodes[n - 1];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          i = e.previousSibling;
        }
        for (; i && !((o = i.pmViewDesc) && o.parent == this); )
          i = i.previousSibling;
        return i ? this.posBeforeChild(o) + o.size : this.posAtStart;
      } else {
        let i, o;
        if (e == this.contentDOM)
          i = e.childNodes[n];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          i = e.nextSibling;
        }
        for (; i && !((o = i.pmViewDesc) && o.parent == this); )
          i = i.nextSibling;
        return i ? this.posBeforeChild(o) : this.posAtEnd;
      }
    let u;
    if (e == this.dom && this.contentDOM)
      u = n > P(this.contentDOM);
    else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM))
      u = e.compareDocumentPosition(this.contentDOM) & 2;
    else if (this.dom.firstChild) {
      if (n == 0)
        for (let i = e; ; i = i.parentNode) {
          if (i == this.dom) {
            u = !1;
            break;
          }
          if (i.previousSibling)
            break;
        }
      if (u == null && n == e.childNodes.length)
        for (let i = e; ; i = i.parentNode) {
          if (i == this.dom) {
            u = !0;
            break;
          }
          if (i.nextSibling)
            break;
        }
    }
    return u ?? r > 0 ? this.posAtEnd : this.posAtStart;
  }
  nearestDesc(e, n = !1) {
    for (let r = !0, u = e; u; u = u.parentNode) {
      let i = this.getDesc(u), o;
      if (i && (!n || i.node))
        if (r && (o = i.nodeDOM) && !(o.nodeType == 1 ? o.contains(e.nodeType == 1 ? e : e.parentNode) : o == e))
          r = !1;
        else
          return i;
    }
  }
  getDesc(e) {
    let n = e.pmViewDesc;
    for (let r = n; r; r = r.parent)
      if (r == this)
        return n;
  }
  posFromDOM(e, n, r) {
    for (let u = e; u; u = u.parentNode) {
      let i = this.getDesc(u);
      if (i)
        return i.localPosFromDOM(e, n, r);
    }
    return -1;
  }
  // Find the desc for the node after the given pos, if any. (When a
  // parent node overrode rendering, there might not be one.)
  descAt(e) {
    for (let n = 0, r = 0; n < this.children.length; n++) {
      let u = this.children[n], i = r + u.size;
      if (r == e && i != r) {
        for (; !u.border && u.children.length; )
          u = u.children[0];
        return u;
      }
      if (e < i)
        return u.descAt(e - r - u.border);
      r = i;
    }
  }
  domFromPos(e, n) {
    if (!this.contentDOM)
      return { node: this.dom, offset: 0, atom: e + 1 };
    let r = 0, u = 0;
    for (let i = 0; r < this.children.length; r++) {
      let o = this.children[r], s = i + o.size;
      if (s > e || o instanceof zo) {
        u = e - i;
        break;
      }
      i = s;
    }
    if (u)
      return this.children[r].domFromPos(u - this.children[r].border, n);
    for (let i; r && !(i = this.children[r - 1]).size && i instanceof _o && i.side >= 0; r--)
      ;
    if (n <= 0) {
      let i, o = !0;
      for (; i = r ? this.children[r - 1] : null, !(!i || i.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return i && n && o && !i.border && !i.domAtom ? i.domFromPos(i.size, n) : { node: this.contentDOM, offset: i ? P(i.dom) + 1 : 0 };
    } else {
      let i, o = !0;
      for (; i = r < this.children.length ? this.children[r] : null, !(!i || i.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return i && o && !i.border && !i.domAtom ? i.domFromPos(0, n) : { node: this.contentDOM, offset: i ? P(i.dom) : this.contentDOM.childNodes.length };
    }
  }
  // Used to find a DOM range in a single parent for a given changed
  // range.
  parseRange(e, n, r = 0) {
    if (this.children.length == 0)
      return { node: this.contentDOM, from: e, to: n, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    let u = -1, i = -1;
    for (let o = r, s = 0; ; s++) {
      let l = this.children[s], a = o + l.size;
      if (u == -1 && e <= a) {
        let c = o + l.border;
        if (e >= c && n <= a - l.border && l.node && l.contentDOM && this.contentDOM.contains(l.contentDOM))
          return l.parseRange(e, n, c);
        e = o;
        for (let f = s; f > 0; f--) {
          let d = this.children[f - 1];
          if (d.size && d.dom.parentNode == this.contentDOM && !d.emptyChildAt(1)) {
            u = P(d.dom) + 1;
            break;
          }
          e -= d.size;
        }
        u == -1 && (u = 0);
      }
      if (u > -1 && (a > n || s == this.children.length - 1)) {
        n = a;
        for (let c = s + 1; c < this.children.length; c++) {
          let f = this.children[c];
          if (f.size && f.dom.parentNode == this.contentDOM && !f.emptyChildAt(-1)) {
            i = P(f.dom);
            break;
          }
          n += f.size;
        }
        i == -1 && (i = this.contentDOM.childNodes.length);
        break;
      }
      o = a;
    }
    return { node: this.contentDOM, from: e, to: n, fromOffset: u, toOffset: i };
  }
  emptyChildAt(e) {
    if (this.border || !this.contentDOM || !this.children.length)
      return !1;
    let n = this.children[e < 0 ? 0 : this.children.length - 1];
    return n.size == 0 || n.emptyChildAt(e);
  }
  domAfterPos(e) {
    let { node: n, offset: r } = this.domFromPos(e, 0);
    if (n.nodeType != 1 || r == n.childNodes.length)
      throw new RangeError("No node after pos " + e);
    return n.childNodes[r];
  }
  // View descs are responsible for setting any selection that falls
  // entirely inside of them, so that custom implementations can do
  // custom things with the selection. Note that this falls apart when
  // a selection starts in such a node and ends in another, in which
  // case we just use whatever domFromPos produces as a best effort.
  setSelection(e, n, r, u = !1) {
    let i = Math.min(e, n), o = Math.max(e, n);
    for (let d = 0, p = 0; d < this.children.length; d++) {
      let h = this.children[d], m = p + h.size;
      if (i > p && o < m)
        return h.setSelection(e - p - h.border, n - p - h.border, r, u);
      p = m;
    }
    let s = this.domFromPos(e, e ? -1 : 1), l = n == e ? s : this.domFromPos(n, n ? -1 : 1), a = r.getSelection(), c = !1;
    if ((pe || H) && e == n) {
      let { node: d, offset: p } = s;
      if (d.nodeType == 3) {
        if (c = !!(p && d.nodeValue[p - 1] == `
`), c && p == d.nodeValue.length)
          for (let h = d, m; h; h = h.parentNode) {
            if (m = h.nextSibling) {
              m.nodeName == "BR" && (s = l = { node: m.parentNode, offset: P(m) + 1 });
              break;
            }
            let g = h.pmViewDesc;
            if (g && g.node && g.node.isBlock)
              break;
          }
      } else {
        let h = d.childNodes[p - 1];
        c = h && (h.nodeName == "BR" || h.contentEditable == "false");
      }
    }
    if (pe && a.focusNode && a.focusNode != l.node && a.focusNode.nodeType == 1) {
      let d = a.focusNode.childNodes[a.focusOffset];
      d && d.contentEditable == "false" && (u = !0);
    }
    if (!(u || c && H) && at(s.node, s.offset, a.anchorNode, a.anchorOffset) && at(l.node, l.offset, a.focusNode, a.focusOffset))
      return;
    let f = !1;
    if ((a.extend || e == n) && !c) {
      a.collapse(s.node, s.offset);
      try {
        e != n && a.extend(l.node, l.offset), f = !0;
      } catch {
      }
    }
    if (!f) {
      if (e > n) {
        let p = s;
        s = l, l = p;
      }
      let d = document.createRange();
      d.setEnd(l.node, l.offset), d.setStart(s.node, s.offset), a.removeAllRanges(), a.addRange(d);
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
  markDirty(e, n) {
    for (let r = 0, u = 0; u < this.children.length; u++) {
      let i = this.children[u], o = r + i.size;
      if (r == o ? e <= o && n >= r : e < o && n > r) {
        let s = r + i.border, l = o - i.border;
        if (e >= s && n <= l) {
          this.dirty = e == r || n == o ? et : Vu, e == s && n == l && (i.contentLost || i.dom.parentNode != this.contentDOM) ? i.dirty = Ne : i.markDirty(e - s, n - s);
          return;
        } else
          i.dirty = i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length ? et : Ne;
      }
      r = o;
    }
    this.dirty = et;
  }
  markParentsDirty() {
    let e = 1;
    for (let n = this.parent; n; n = n.parent, e++) {
      let r = e == 1 ? et : Vu;
      n.dirty < r && (n.dirty = r);
    }
  }
  get domAtom() {
    return !1;
  }
  get ignoreForCoords() {
    return !1;
  }
  isText(e) {
    return !1;
  }
}
class _o extends ln {
  constructor(e, n, r, u) {
    let i, o = n.type.toDOM;
    if (typeof o == "function" && (o = o(r, () => {
      if (!i)
        return u;
      if (i.parent)
        return i.parent.posBeforeChild(i);
    })), !n.type.spec.raw) {
      if (o.nodeType != 1) {
        let s = document.createElement("span");
        s.appendChild(o), o = s;
      }
      o.contentEditable = "false", o.classList.add("ProseMirror-widget");
    }
    super(e, [], o, null), this.widget = n, this.widget = n, i = this;
  }
  matchesWidget(e) {
    return this.dirty == ce && e.type.eq(this.widget.type);
  }
  parseRule() {
    return { ignore: !0 };
  }
  stopEvent(e) {
    let n = this.widget.spec.stopEvent;
    return n ? n(e) : !1;
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
class Ea extends ln {
  constructor(e, n, r, u) {
    super(e, [], n, null), this.textDOM = r, this.text = u;
  }
  get size() {
    return this.text.length;
  }
  localPosFromDOM(e, n) {
    return e != this.textDOM ? this.posAtStart + (n ? this.size : 0) : this.posAtStart + n;
  }
  domFromPos(e) {
    return { node: this.textDOM, offset: e };
  }
  ignoreMutation(e) {
    return e.type === "characterData" && e.target.nodeValue == e.oldValue;
  }
}
class ct extends ln {
  constructor(e, n, r, u) {
    super(e, [], r, u), this.mark = n;
  }
  static create(e, n, r, u) {
    let i = u.nodeViews[n.type.name], o = i && i(n, u, r);
    return (!o || !o.dom) && (o = we.renderSpec(document, n.type.spec.toDOM(n, r))), new ct(e, n, o.dom, o.contentDOM || o.dom);
  }
  parseRule() {
    return this.dirty & Ne || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != Ne && this.mark.eq(e);
  }
  markDirty(e, n) {
    if (super.markDirty(e, n), this.dirty != ce) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = ce;
    }
  }
  slice(e, n, r) {
    let u = ct.create(this.parent, this.mark, !0, r), i = this.children, o = this.size;
    n < o && (i = Fr(i, n, o, r)), e > 0 && (i = Fr(i, 0, e, r));
    for (let s = 0; s < i.length; s++)
      i[s].parent = u;
    return u.children = i, u;
  }
}
class $e extends ln {
  constructor(e, n, r, u, i, o, s, l, a) {
    super(e, [], i, o), this.node = n, this.outerDeco = r, this.innerDeco = u, this.nodeDOM = s;
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
  static create(e, n, r, u, i, o) {
    let s = i.nodeViews[n.type.name], l, a = s && s(n, i, () => {
      if (!l)
        return o;
      if (l.parent)
        return l.parent.posBeforeChild(l);
    }, r, u), c = a && a.dom, f = a && a.contentDOM;
    if (n.isText) {
      if (!c)
        c = document.createTextNode(n.text);
      else if (c.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else
      c || ({ dom: c, contentDOM: f } = we.renderSpec(document, n.type.spec.toDOM(n)));
    !f && !n.isText && c.nodeName != "BR" && (c.hasAttribute("contenteditable") || (c.contentEditable = "false"), n.type.spec.draggable && (c.draggable = !0));
    let d = c;
    return c = Fo(c, r, n), a ? l = new Ta(e, n, r, u, c, f || null, d, a, i, o + 1) : n.isText ? new Un(e, n, r, u, c, d, i) : new $e(e, n, r, u, c, f || null, d, i, o + 1);
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
      for (let n = this.children.length - 1; n >= 0; n--) {
        let r = this.children[n];
        if (this.dom.contains(r.dom.parentNode)) {
          e.contentElement = r.dom.parentNode;
          break;
        }
      }
      e.contentElement || (e.getContent = () => x.empty);
    }
    return e;
  }
  matchesNode(e, n, r) {
    return this.dirty == ce && e.eq(this.node) && Lr(n, this.outerDeco) && r.eq(this.innerDeco);
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
  updateChildren(e, n) {
    let r = this.node.inlineContent, u = n, i = e.composing ? this.localCompositionInfo(e, n) : null, o = i && i.pos > -1 ? i : null, s = i && i.pos < 0, l = new Sa(this, o && o.node, e);
    _a(this.node, this.innerDeco, (a, c, f) => {
      a.spec.marks ? l.syncToMarks(a.spec.marks, r, e) : a.type.side >= 0 && !f && l.syncToMarks(c == this.node.childCount ? I.none : this.node.child(c).marks, r, e), l.placeWidget(a, e, u);
    }, (a, c, f, d) => {
      l.syncToMarks(a.marks, r, e);
      let p;
      l.findNodeMatch(a, c, f, d) || s && e.state.selection.from > u && e.state.selection.to < u + a.nodeSize && (p = l.findIndexWithChild(i.node)) > -1 && l.updateNodeAt(a, c, f, p, e) || l.updateNextNode(a, c, f, e, d, u) || l.addNode(a, c, f, e, u), u += a.nodeSize;
    }), l.syncToMarks([], r, e), this.node.isTextblock && l.addTextblockHacks(), l.destroyRest(), (l.changed || this.dirty == et) && (o && this.protectLocalComposition(e, o), jo(this.contentDOM, this.children, e), Et && za(this.dom));
  }
  localCompositionInfo(e, n) {
    let { from: r, to: u } = e.state.selection;
    if (!(e.state.selection instanceof S) || r < n || u > n + this.node.content.size)
      return null;
    let i = e.input.compositionNode;
    if (!i || !this.dom.contains(i.parentNode))
      return null;
    if (this.node.inlineContent) {
      let o = i.nodeValue, s = ja(this.node.content, o, r - n, u - n);
      return s < 0 ? null : { node: i, pos: s, text: o };
    } else
      return { node: i, pos: -1, text: "" };
  }
  protectLocalComposition(e, { node: n, pos: r, text: u }) {
    if (this.getDesc(n))
      return;
    let i = n;
    for (; i.parentNode != this.contentDOM; i = i.parentNode) {
      for (; i.previousSibling; )
        i.parentNode.removeChild(i.previousSibling);
      for (; i.nextSibling; )
        i.parentNode.removeChild(i.nextSibling);
      i.pmViewDesc && (i.pmViewDesc = void 0);
    }
    let o = new Ea(this, i, n, u);
    e.input.compositionNodes.push(o), this.children = Fr(this.children, r, r + u.length, e, o);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, n, r, u) {
    return this.dirty == Ne || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, n, r, u), !0);
  }
  updateInner(e, n, r, u) {
    this.updateOuterDeco(n), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(u, this.posAtStart), this.dirty = ce;
  }
  updateOuterDeco(e) {
    if (Lr(e, this.outerDeco))
      return;
    let n = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = Lo(this.dom, this.nodeDOM, jr(this.outerDeco, this.node, n), jr(e, this.node, n)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function Qu(t, e, n, r, u) {
  Fo(r, e, t);
  let i = new $e(void 0, t, e, n, r, r, r, u, 0);
  return i.contentDOM && i.updateChildren(u, 0), i;
}
class Un extends $e {
  constructor(e, n, r, u, i, o, s) {
    super(e, n, r, u, i, null, o, s, 0);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; )
      e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, n, r, u) {
    return this.dirty == Ne || this.dirty != ce && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(n), (this.dirty != ce || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, u.trackWrites == this.nodeDOM && (u.trackWrites = null)), this.node = e, this.dirty = ce, !0);
  }
  inParent() {
    let e = this.parent.contentDOM;
    for (let n = this.nodeDOM; n; n = n.parentNode)
      if (n == e)
        return !0;
    return !1;
  }
  domFromPos(e) {
    return { node: this.nodeDOM, offset: e };
  }
  localPosFromDOM(e, n, r) {
    return e == this.nodeDOM ? this.posAtStart + Math.min(n, this.node.text.length) : super.localPosFromDOM(e, n, r);
  }
  ignoreMutation(e) {
    return e.type != "characterData" && e.type != "selection";
  }
  slice(e, n, r) {
    let u = this.node.cut(e, n), i = document.createTextNode(u.text);
    return new Un(this.parent, u, this.outerDeco, this.innerDeco, i, i, r);
  }
  markDirty(e, n) {
    super.markDirty(e, n), this.dom != this.nodeDOM && (e == 0 || n == this.nodeDOM.nodeValue.length) && (this.dirty = Ne);
  }
  get domAtom() {
    return !1;
  }
  isText(e) {
    return this.node.text == e;
  }
}
class zo extends ln {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == ce && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class Ta extends $e {
  constructor(e, n, r, u, i, o, s, l, a, c) {
    super(e, n, r, u, i, o, s, a, c), this.spec = l;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, n, r, u) {
    if (this.dirty == Ne)
      return !1;
    if (this.spec.update) {
      let i = this.spec.update(e, n, r);
      return i && this.updateInner(e, n, r, u), i;
    } else
      return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, n, r, u);
  }
  selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
  }
  deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
  }
  setSelection(e, n, r, u) {
    this.spec.setSelection ? this.spec.setSelection(e, n, r) : super.setSelection(e, n, r, u);
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
function jo(t, e, n) {
  let r = t.firstChild, u = !1;
  for (let i = 0; i < e.length; i++) {
    let o = e[i], s = o.dom;
    if (s.parentNode == t) {
      for (; s != r; )
        r = $u(r), u = !0;
      r = r.nextSibling;
    } else
      u = !0, t.insertBefore(s, r);
    if (o instanceof ct) {
      let l = r ? r.previousSibling : t.lastChild;
      jo(o.contentDOM, o.children, n), r = l ? l.nextSibling : t.firstChild;
    }
  }
  for (; r; )
    r = $u(r), u = !0;
  u && n.trackWrites == t && (n.trackWrites = null);
}
const Ut = function(t) {
  t && (this.nodeName = t);
};
Ut.prototype = /* @__PURE__ */ Object.create(null);
const tt = [new Ut()];
function jr(t, e, n) {
  if (t.length == 0)
    return tt;
  let r = n ? tt[0] : new Ut(), u = [r];
  for (let i = 0; i < t.length; i++) {
    let o = t[i].type.attrs;
    if (o) {
      o.nodeName && u.push(r = new Ut(o.nodeName));
      for (let s in o) {
        let l = o[s];
        l != null && (n && u.length == 1 && u.push(r = new Ut(e.isInline ? "span" : "div")), s == "class" ? r.class = (r.class ? r.class + " " : "") + l : s == "style" ? r.style = (r.style ? r.style + ";" : "") + l : s != "nodeName" && (r[s] = l));
      }
    }
  }
  return u;
}
function Lo(t, e, n, r) {
  if (n == tt && r == tt)
    return e;
  let u = e;
  for (let i = 0; i < r.length; i++) {
    let o = r[i], s = n[i];
    if (i) {
      let l;
      s && s.nodeName == o.nodeName && u != t && (l = u.parentNode) && l.nodeName.toLowerCase() == o.nodeName || (l = document.createElement(o.nodeName), l.pmIsDeco = !0, l.appendChild(u), s = tt[0]), u = l;
    }
    Ia(u, s || tt[0], o);
  }
  return u;
}
function Ia(t, e, n) {
  for (let r in e)
    r != "class" && r != "style" && r != "nodeName" && !(r in n) && t.removeAttribute(r);
  for (let r in n)
    r != "class" && r != "style" && r != "nodeName" && n[r] != e[r] && t.setAttribute(r, n[r]);
  if (e.class != n.class) {
    let r = e.class ? e.class.split(" ").filter(Boolean) : [], u = n.class ? n.class.split(" ").filter(Boolean) : [];
    for (let i = 0; i < r.length; i++)
      u.indexOf(r[i]) == -1 && t.classList.remove(r[i]);
    for (let i = 0; i < u.length; i++)
      r.indexOf(u[i]) == -1 && t.classList.add(u[i]);
    t.classList.length == 0 && t.removeAttribute("class");
  }
  if (e.style != n.style) {
    if (e.style) {
      let r = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, u;
      for (; u = r.exec(e.style); )
        t.style.removeProperty(u[1]);
    }
    n.style && (t.style.cssText += n.style);
  }
}
function Fo(t, e, n) {
  return Lo(t, t, tt, jr(e, n, t.nodeType != 1));
}
function Lr(t, e) {
  if (t.length != e.length)
    return !1;
  for (let n = 0; n < t.length; n++)
    if (!t[n].type.eq(e[n].type))
      return !1;
  return !0;
}
function $u(t) {
  let e = t.nextSibling;
  return t.parentNode.removeChild(t), e;
}
class Sa {
  constructor(e, n, r) {
    this.lock = n, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = wa(e.node.content, e);
  }
  // Destroy and remove the children between the given indices in
  // `this.top`.
  destroyBetween(e, n) {
    if (e != n) {
      for (let r = e; r < n; r++)
        this.top.children[r].destroy();
      this.top.children.splice(e, n - e), this.changed = !0;
    }
  }
  // Destroy all remaining children in `this.top`.
  destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  }
  // Sync the current stack of mark descs with the given array of
  // marks, reusing existing mark descs when possible.
  syncToMarks(e, n, r) {
    let u = 0, i = this.stack.length >> 1, o = Math.min(i, e.length);
    for (; u < o && (u == i - 1 ? this.top : this.stack[u + 1 << 1]).matchesMark(e[u]) && e[u].type.spec.spanning !== !1; )
      u++;
    for (; u < i; )
      this.destroyRest(), this.top.dirty = ce, this.index = this.stack.pop(), this.top = this.stack.pop(), i--;
    for (; i < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let s = -1;
      for (let l = this.index; l < Math.min(this.index + 3, this.top.children.length); l++) {
        let a = this.top.children[l];
        if (a.matchesMark(e[i]) && !this.isLocked(a.dom)) {
          s = l;
          break;
        }
      }
      if (s > -1)
        s > this.index && (this.changed = !0, this.destroyBetween(this.index, s)), this.top = this.top.children[this.index];
      else {
        let l = ct.create(this.top, e[i], n, r);
        this.top.children.splice(this.index, 0, l), this.top = l, this.changed = !0;
      }
      this.index = 0, i++;
    }
  }
  // Try to find a node desc matching the given data. Skip over it and
  // return true when successful.
  findNodeMatch(e, n, r, u) {
    let i = -1, o;
    if (u >= this.preMatch.index && (o = this.preMatch.matches[u - this.preMatch.index]).parent == this.top && o.matchesNode(e, n, r))
      i = this.top.children.indexOf(o, this.index);
    else
      for (let s = this.index, l = Math.min(this.top.children.length, s + 5); s < l; s++) {
        let a = this.top.children[s];
        if (a.matchesNode(e, n, r) && !this.preMatch.matched.has(a)) {
          i = s;
          break;
        }
      }
    return i < 0 ? !1 : (this.destroyBetween(this.index, i), this.index++, !0);
  }
  updateNodeAt(e, n, r, u, i) {
    let o = this.top.children[u];
    return o.dirty == Ne && o.dom == o.contentDOM && (o.dirty = et), o.update(e, n, r, i) ? (this.destroyBetween(this.index, u), this.index++, !0) : !1;
  }
  findIndexWithChild(e) {
    for (; ; ) {
      let n = e.parentNode;
      if (!n)
        return -1;
      if (n == this.top.contentDOM) {
        let r = e.pmViewDesc;
        if (r) {
          for (let u = this.index; u < this.top.children.length; u++)
            if (this.top.children[u] == r)
              return u;
        }
        return -1;
      }
      e = n;
    }
  }
  // Try to update the next node, if any, to the given data. Checks
  // pre-matches to avoid overwriting nodes that could still be used.
  updateNextNode(e, n, r, u, i, o) {
    for (let s = this.index; s < this.top.children.length; s++) {
      let l = this.top.children[s];
      if (l instanceof $e) {
        let a = this.preMatch.matched.get(l);
        if (a != null && a != i)
          return !1;
        let c = l.dom, f, d = this.isLocked(c) && !(e.isText && l.node && l.node.isText && l.nodeDOM.nodeValue == e.text && l.dirty != Ne && Lr(n, l.outerDeco));
        if (!d && l.update(e, n, r, u))
          return this.destroyBetween(this.index, s), l.dom != c && (this.changed = !0), this.index++, !0;
        if (!d && (f = this.recreateWrapper(l, e, n, r, u, o)))
          return this.top.children[this.index] = f, f.contentDOM && (f.dirty = et, f.updateChildren(u, o + 1), f.dirty = ce), this.changed = !0, this.index++, !0;
        break;
      }
    }
    return !1;
  }
  // When a node with content is replaced by a different node with
  // identical content, move over its children.
  recreateWrapper(e, n, r, u, i, o) {
    if (e.dirty || n.isAtom || !e.children.length || !e.node.content.eq(n.content))
      return null;
    let s = $e.create(this.top, n, r, u, i, o);
    if (s.contentDOM) {
      s.children = e.children, e.children = [];
      for (let l of s.children)
        l.parent = s;
    }
    return e.destroy(), s;
  }
  // Insert the node as a newly created node desc.
  addNode(e, n, r, u, i) {
    let o = $e.create(this.top, e, n, r, u, i);
    o.contentDOM && o.updateChildren(u, i + 1), this.top.children.splice(this.index++, 0, o), this.changed = !0;
  }
  placeWidget(e, n, r) {
    let u = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (u && u.matchesWidget(e) && (e == u.widget || !u.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let i = new _o(this.top, e, n, r);
      this.top.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], n = this.top;
    for (; e instanceof ct; )
      n = e, e = n.children[n.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof Un) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((H || W) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", n), this.addHackNode("BR", this.top));
  }
  addHackNode(e, n) {
    if (n == this.top && this.index < n.children.length && n.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let u = new zo(this.top, [], r, null);
      n != this.top ? n.children.push(u) : n.children.splice(this.index++, 0, u), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function wa(t, e) {
  let n = e, r = n.children.length, u = t.childCount, i = /* @__PURE__ */ new Map(), o = [];
  e:
    for (; u > 0; ) {
      let s;
      for (; ; )
        if (r) {
          let a = n.children[r - 1];
          if (a instanceof ct)
            n = a, r = a.children.length;
          else {
            s = a, r--;
            break;
          }
        } else {
          if (n == e)
            break e;
          r = n.parent.children.indexOf(n), n = n.parent;
        }
      let l = s.node;
      if (l) {
        if (l != t.child(u - 1))
          break;
        --u, i.set(s, u), o.push(s);
      }
    }
  return { index: u, matched: i, matches: o.reverse() };
}
function Oa(t, e) {
  return t.type.side - e.type.side;
}
function _a(t, e, n, r) {
  let u = e.locals(t), i = 0;
  if (u.length == 0) {
    for (let a = 0; a < t.childCount; a++) {
      let c = t.child(a);
      r(c, u, e.forChild(i, c), a), i += c.nodeSize;
    }
    return;
  }
  let o = 0, s = [], l = null;
  for (let a = 0; ; ) {
    let c, f;
    for (; o < u.length && u[o].to == i; ) {
      let g = u[o++];
      g.widget && (c ? (f || (f = [c])).push(g) : c = g);
    }
    if (c)
      if (f) {
        f.sort(Oa);
        for (let g = 0; g < f.length; g++)
          n(f[g], a, !!l);
      } else
        n(c, a, !!l);
    let d, p;
    if (l)
      p = -1, d = l, l = null;
    else if (a < t.childCount)
      p = a, d = t.child(a++);
    else
      break;
    for (let g = 0; g < s.length; g++)
      s[g].to <= i && s.splice(g--, 1);
    for (; o < u.length && u[o].from <= i && u[o].to > i; )
      s.push(u[o++]);
    let h = i + d.nodeSize;
    if (d.isText) {
      let g = h;
      o < u.length && u[o].from < g && (g = u[o].from);
      for (let b = 0; b < s.length; b++)
        s[b].to < g && (g = s[b].to);
      g < h && (l = d.cut(g - i), d = d.cut(0, g - i), h = g, p = -1);
    } else
      for (; o < u.length && u[o].to < h; )
        o++;
    let m = d.isInline && !d.isLeaf ? s.filter((g) => !g.inline) : s.slice();
    r(d, m, e.forChild(i, d), p), i = h;
  }
}
function za(t) {
  if (t.nodeName == "UL" || t.nodeName == "OL") {
    let e = t.style.cssText;
    t.style.cssText = e + "; list-style: square !important", window.getComputedStyle(t).listStyle, t.style.cssText = e;
  }
}
function ja(t, e, n, r) {
  for (let u = 0, i = 0; u < t.childCount && i <= r; ) {
    let o = t.child(u++), s = i;
    if (i += o.nodeSize, !o.isText)
      continue;
    let l = o.text;
    for (; u < t.childCount; ) {
      let a = t.child(u++);
      if (i += a.nodeSize, !a.isText)
        break;
      l += a.text;
    }
    if (i >= n) {
      if (i >= r && l.slice(r - e.length - s, r - s) == e)
        return r - e.length;
      let a = s < r ? l.lastIndexOf(e, r - s - 1) : -1;
      if (a >= 0 && a + e.length + s >= n)
        return s + a;
      if (n == r && l.length >= r + e.length - s && l.slice(r - s, r - s + e.length) == e)
        return r;
    }
  }
  return -1;
}
function Fr(t, e, n, r, u) {
  let i = [];
  for (let o = 0, s = 0; o < t.length; o++) {
    let l = t[o], a = s, c = s += l.size;
    a >= n || c <= e ? i.push(l) : (a < e && i.push(l.slice(0, e - a, r)), u && (i.push(u), u = void 0), c > n && i.push(l.slice(n - a, l.size, r)));
  }
  return i;
}
function tu(t, e = null) {
  let n = t.domSelectionRange(), r = t.state.doc;
  if (!n.focusNode)
    return null;
  let u = t.docView.nearestDesc(n.focusNode), i = u && u.size == 0, o = t.docView.posFromDOM(n.focusNode, n.focusOffset, 1);
  if (o < 0)
    return null;
  let s = r.resolve(o), l, a;
  if (Pn(n)) {
    for (l = s; u && !u.node; )
      u = u.parent;
    let c = u.node;
    if (u && c.isAtom && N.isSelectable(c) && u.parent && !(c.isInline && ia(n.focusNode, n.focusOffset, u.dom))) {
      let f = u.posBefore;
      a = new N(o == f ? s : r.resolve(f));
    }
  } else {
    let c = t.docView.posFromDOM(n.anchorNode, n.anchorOffset, 1);
    if (c < 0)
      return null;
    l = r.resolve(c);
  }
  if (!a) {
    let c = e == "pointer" || t.state.selection.head < s.pos && !i ? 1 : -1;
    a = nu(t, l, s, c);
  }
  return a;
}
function vo(t) {
  return t.editable ? t.hasFocus() : Bo(t) && document.activeElement && document.activeElement.contains(t.dom);
}
function Oe(t, e = !1) {
  let n = t.state.selection;
  if (Ro(t, n), !!vo(t)) {
    if (!e && t.input.mouseDown && t.input.mouseDown.allowDefault && W) {
      let r = t.domSelectionRange(), u = t.domObserver.currentSelection;
      if (r.anchorNode && u.anchorNode && at(r.anchorNode, r.anchorOffset, u.anchorNode, u.anchorOffset)) {
        t.input.mouseDown.delayedSelectionSync = !0, t.domObserver.setCurSelection();
        return;
      }
    }
    if (t.domObserver.disconnectSelection(), t.cursorWrapper)
      Fa(t);
    else {
      let { anchor: r, head: u } = n, i, o;
      Yu && !(n instanceof S) && (n.$from.parent.inlineContent || (i = Wu(t, n.from)), !n.empty && !n.$from.parent.inlineContent && (o = Wu(t, n.to))), t.docView.setSelection(r, u, t.root, e), Yu && (i && Hu(i), o && Hu(o)), n.visible ? t.dom.classList.remove("ProseMirror-hideselection") : (t.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && La(t));
    }
    t.domObserver.setCurSelection(), t.domObserver.connectSelection();
  }
}
const Yu = H || W && la < 63;
function Wu(t, e) {
  let { node: n, offset: r } = t.docView.domFromPos(e, 0), u = r < n.childNodes.length ? n.childNodes[r] : null, i = r ? n.childNodes[r - 1] : null;
  if (H && u && u.contentEditable == "false")
    return or(u);
  if ((!u || u.contentEditable == "false") && (!i || i.contentEditable == "false")) {
    if (u)
      return or(u);
    if (i)
      return or(i);
  }
}
function or(t) {
  return t.contentEditable = "true", H && t.draggable && (t.draggable = !1, t.wasDraggable = !0), t;
}
function Hu(t) {
  t.contentEditable = "false", t.wasDraggable && (t.draggable = !0, t.wasDraggable = null);
}
function La(t) {
  let e = t.dom.ownerDocument;
  e.removeEventListener("selectionchange", t.input.hideSelectionGuard);
  let n = t.domSelectionRange(), r = n.anchorNode, u = n.anchorOffset;
  e.addEventListener("selectionchange", t.input.hideSelectionGuard = () => {
    (n.anchorNode != r || n.anchorOffset != u) && (e.removeEventListener("selectionchange", t.input.hideSelectionGuard), setTimeout(() => {
      (!vo(t) || t.state.selection.visible) && t.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function Fa(t) {
  let e = t.domSelection(), n = document.createRange(), r = t.cursorWrapper.dom, u = r.nodeName == "IMG";
  u ? n.setEnd(r.parentNode, P(r) + 1) : n.setEnd(r, 0), n.collapse(!1), e.removeAllRanges(), e.addRange(n), !u && !t.state.selection.visible && X && Qe <= 11 && (r.disabled = !0, r.disabled = !1);
}
function Ro(t, e) {
  if (e instanceof N) {
    let n = t.docView.descAt(e.from);
    n != t.lastSelectedViewDesc && (Ju(t), n && n.selectNode(), t.lastSelectedViewDesc = n);
  } else
    Ju(t);
}
function Ju(t) {
  t.lastSelectedViewDesc && (t.lastSelectedViewDesc.parent && t.lastSelectedViewDesc.deselectNode(), t.lastSelectedViewDesc = void 0);
}
function nu(t, e, n, r) {
  return t.someProp("createSelectionBetween", (u) => u(t, e, n)) || S.between(e, n, r);
}
function Zu(t) {
  return t.editable && !t.hasFocus() ? !1 : Bo(t);
}
function Bo(t) {
  let e = t.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return t.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (t.editable || t.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function va(t) {
  let e = t.docView.domFromPos(t.state.selection.anchor, 0), n = t.domSelectionRange();
  return at(e.node, e.offset, n.anchorNode, n.anchorOffset);
}
function vr(t, e) {
  let { $anchor: n, $head: r } = t.selection, u = e > 0 ? n.max(r) : n.min(r), i = u.parent.inlineContent ? u.depth ? t.doc.resolve(e > 0 ? u.after() : u.before()) : null : u;
  return i && T.findFrom(i, e);
}
function Le(t, e) {
  return t.dispatch(t.state.tr.setSelection(e).scrollIntoView()), !0;
}
function Gu(t, e, n) {
  let r = t.state.selection;
  if (r instanceof S)
    if (n.indexOf("s") > -1) {
      let { $head: u } = r, i = u.textOffset ? null : e < 0 ? u.nodeBefore : u.nodeAfter;
      if (!i || i.isText || !i.isLeaf)
        return !1;
      let o = t.state.doc.resolve(u.pos + i.nodeSize * (e < 0 ? -1 : 1));
      return Le(t, new S(r.$anchor, o));
    } else if (r.empty) {
      if (t.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let u = vr(t.state, e);
        return u && u instanceof N ? Le(t, u) : !1;
      } else if (!(ie && n.indexOf("m") > -1)) {
        let u = r.$head, i = u.textOffset ? null : e < 0 ? u.nodeBefore : u.nodeAfter, o;
        if (!i || i.isText)
          return !1;
        let s = e < 0 ? u.pos - i.nodeSize : u.pos;
        return i.isAtom || (o = t.docView.descAt(s)) && !o.contentDOM ? N.isSelectable(i) ? Le(t, new N(e < 0 ? t.state.doc.resolve(u.pos - i.nodeSize) : u)) : sn ? Le(t, new S(t.state.doc.resolve(e < 0 ? s : s + i.nodeSize))) : !1 : !1;
      }
    } else
      return !1;
  else {
    if (r instanceof N && r.node.isInline)
      return Le(t, new S(e > 0 ? r.$to : r.$from));
    {
      let u = vr(t.state, e);
      return u ? Le(t, u) : !1;
    }
  }
}
function Sn(t) {
  return t.nodeType == 3 ? t.nodeValue.length : t.childNodes.length;
}
function qt(t, e) {
  let n = t.pmViewDesc;
  return n && n.size == 0 && (e < 0 || t.nextSibling || t.nodeName != "BR");
}
function ht(t, e) {
  return e < 0 ? Ra(t) : Ba(t);
}
function Ra(t) {
  let e = t.domSelectionRange(), n = e.focusNode, r = e.focusOffset;
  if (!n)
    return;
  let u, i, o = !1;
  for (pe && n.nodeType == 1 && r < Sn(n) && qt(n.childNodes[r], -1) && (o = !0); ; )
    if (r > 0) {
      if (n.nodeType != 1)
        break;
      {
        let s = n.childNodes[r - 1];
        if (qt(s, -1))
          u = n, i = --r;
        else if (s.nodeType == 3)
          n = s, r = n.nodeValue.length;
        else
          break;
      }
    } else {
      if (Po(n))
        break;
      {
        let s = n.previousSibling;
        for (; s && qt(s, -1); )
          u = n.parentNode, i = P(s), s = s.previousSibling;
        if (s)
          n = s, r = Sn(n);
        else {
          if (n = n.parentNode, n == t.dom)
            break;
          r = 0;
        }
      }
    }
  o ? Rr(t, n, r) : u && Rr(t, u, i);
}
function Ba(t) {
  let e = t.domSelectionRange(), n = e.focusNode, r = e.focusOffset;
  if (!n)
    return;
  let u = Sn(n), i, o;
  for (; ; )
    if (r < u) {
      if (n.nodeType != 1)
        break;
      let s = n.childNodes[r];
      if (qt(s, 1))
        i = n, o = ++r;
      else
        break;
    } else {
      if (Po(n))
        break;
      {
        let s = n.nextSibling;
        for (; s && qt(s, 1); )
          i = s.parentNode, o = P(s) + 1, s = s.nextSibling;
        if (s)
          n = s, r = 0, u = Sn(n);
        else {
          if (n = n.parentNode, n == t.dom)
            break;
          r = u = 0;
        }
      }
    }
  i && Rr(t, i, o);
}
function Po(t) {
  let e = t.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function Pa(t, e) {
  for (; t && e == t.childNodes.length && !on(t); )
    e = P(t) + 1, t = t.parentNode;
  for (; t && e < t.childNodes.length; ) {
    let n = t.childNodes[e];
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && n.contentEditable == "false")
      break;
    t = n, e = 0;
  }
}
function Ua(t, e) {
  for (; t && !e && !on(t); )
    e = P(t), t = t.parentNode;
  for (; t && e; ) {
    let n = t.childNodes[e - 1];
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && n.contentEditable == "false")
      break;
    t = n, e = t.childNodes.length;
  }
}
function Rr(t, e, n) {
  if (e.nodeType != 3) {
    let i, o;
    (o = Pa(e, n)) ? (e = o, n = 0) : (i = Ua(e, n)) && (e = i, n = i.nodeValue.length);
  }
  let r = t.domSelection();
  if (Pn(r)) {
    let i = document.createRange();
    i.setEnd(e, n), i.setStart(e, n), r.removeAllRanges(), r.addRange(i);
  } else
    r.extend && r.extend(e, n);
  t.domObserver.setCurSelection();
  let { state: u } = t;
  setTimeout(() => {
    t.state == u && Oe(t);
  }, 50);
}
function Ku(t, e) {
  let n = t.state.doc.resolve(e);
  if (!(W || aa) && n.parent.inlineContent) {
    let u = t.coordsAtPos(e);
    if (e > n.start()) {
      let i = t.coordsAtPos(e - 1), o = (i.top + i.bottom) / 2;
      if (o > u.top && o < u.bottom && Math.abs(i.left - u.left) > 1)
        return i.left < u.left ? "ltr" : "rtl";
    }
    if (e < n.end()) {
      let i = t.coordsAtPos(e + 1), o = (i.top + i.bottom) / 2;
      if (o > u.top && o < u.bottom && Math.abs(i.left - u.left) > 1)
        return i.left > u.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(t.dom).direction == "rtl" ? "rtl" : "ltr";
}
function Xu(t, e, n) {
  let r = t.state.selection;
  if (r instanceof S && !r.empty || n.indexOf("s") > -1 || ie && n.indexOf("m") > -1)
    return !1;
  let { $from: u, $to: i } = r;
  if (!u.parent.inlineContent || t.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = vr(t.state, e);
    if (o && o instanceof N)
      return Le(t, o);
  }
  if (!u.parent.inlineContent) {
    let o = e < 0 ? u : i, s = r instanceof ne ? T.near(o, e) : T.findFrom(o, e);
    return s ? Le(t, s) : !1;
  }
  return !1;
}
function ei(t, e) {
  if (!(t.state.selection instanceof S))
    return !0;
  let { $head: n, $anchor: r, empty: u } = t.state.selection;
  if (!n.sameParent(r))
    return !0;
  if (!u)
    return !1;
  if (t.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let i = !n.textOffset && (e < 0 ? n.nodeBefore : n.nodeAfter);
  if (i && !i.isText) {
    let o = t.state.tr;
    return e < 0 ? o.delete(n.pos - i.nodeSize, n.pos) : o.delete(n.pos, n.pos + i.nodeSize), t.dispatch(o), !0;
  }
  return !1;
}
function ti(t, e, n) {
  t.domObserver.stop(), e.contentEditable = n, t.domObserver.start();
}
function qa(t) {
  if (!H || t.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: n } = t.domSelectionRange();
  if (e && e.nodeType == 1 && n == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    ti(t, r, "true"), setTimeout(() => ti(t, r, "false"), 20);
  }
  return !1;
}
function Va(t) {
  let e = "";
  return t.ctrlKey && (e += "c"), t.metaKey && (e += "m"), t.altKey && (e += "a"), t.shiftKey && (e += "s"), e;
}
function Qa(t, e) {
  let n = e.keyCode, r = Va(e);
  if (n == 8 || ie && n == 72 && r == "c")
    return ei(t, -1) || ht(t, -1);
  if (n == 46 && !e.shiftKey || ie && n == 68 && r == "c")
    return ei(t, 1) || ht(t, 1);
  if (n == 13 || n == 27)
    return !0;
  if (n == 37 || ie && n == 66 && r == "c") {
    let u = n == 37 ? Ku(t, t.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return Gu(t, u, r) || ht(t, u);
  } else if (n == 39 || ie && n == 70 && r == "c") {
    let u = n == 39 ? Ku(t, t.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return Gu(t, u, r) || ht(t, u);
  } else {
    if (n == 38 || ie && n == 80 && r == "c")
      return Xu(t, -1, r) || ht(t, -1);
    if (n == 40 || ie && n == 78 && r == "c")
      return qa(t) || Xu(t, 1, r) || ht(t, 1);
    if (r == (ie ? "m" : "c") && (n == 66 || n == 73 || n == 89 || n == 90))
      return !0;
  }
  return !1;
}
function Uo(t, e) {
  t.someProp("transformCopied", (p) => {
    e = p(e, t);
  });
  let n = [], { content: r, openStart: u, openEnd: i } = e;
  for (; u > 1 && i > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    u--, i--;
    let p = r.firstChild;
    n.push(p.type.name, p.attrs != p.type.defaultAttrs ? p.attrs : null), r = p.content;
  }
  let o = t.someProp("clipboardSerializer") || we.fromSchema(t.state.schema), s = Wo(), l = s.createElement("div");
  l.appendChild(o.serializeFragment(r, { document: s }));
  let a = l.firstChild, c, f = 0;
  for (; a && a.nodeType == 1 && (c = Yo[a.nodeName.toLowerCase()]); ) {
    for (let p = c.length - 1; p >= 0; p--) {
      let h = s.createElement(c[p]);
      for (; l.firstChild; )
        h.appendChild(l.firstChild);
      l.appendChild(h), f++;
    }
    a = l.firstChild;
  }
  a && a.nodeType == 1 && a.setAttribute("data-pm-slice", `${u} ${i}${f ? ` -${f}` : ""} ${JSON.stringify(n)}`);
  let d = t.someProp("clipboardTextSerializer", (p) => p(e, t)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: l, text: d, slice: e };
}
function qo(t, e, n, r, u) {
  let i = u.parent.type.spec.code, o, s;
  if (!n && !e)
    return null;
  let l = e && (r || i || !n);
  if (l) {
    if (t.someProp("transformPastedText", (d) => {
      e = d(e, i || r, t);
    }), i)
      return e ? new M(x.from(t.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0) : M.empty;
    let f = t.someProp("clipboardTextParser", (d) => d(e, u, r, t));
    if (f)
      s = f;
    else {
      let d = u.marks(), { schema: p } = t.state, h = we.fromSchema(p);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = o.appendChild(document.createElement("p"));
        m && g.appendChild(h.serializeNode(p.text(m, d)));
      });
    }
  } else
    t.someProp("transformPastedHTML", (f) => {
      n = f(n, t);
    }), o = Wa(n), sn && Ha(o);
  let a = o && o.querySelector("[data-pm-slice]"), c = a && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(a.getAttribute("data-pm-slice") || "");
  if (c && c[3])
    for (let f = +c[3]; f > 0; f--) {
      let d = o.firstChild;
      for (; d && d.nodeType != 1; )
        d = d.nextSibling;
      if (!d)
        break;
      o = d;
    }
  if (s || (s = (t.someProp("clipboardParser") || t.someProp("domParser") || Nt.fromSchema(t.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(l || c),
    context: u,
    ruleFromNode(d) {
      return d.nodeName == "BR" && !d.nextSibling && d.parentNode && !$a.test(d.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), c)
    s = Ja(ni(s, +c[1], +c[2]), c[4]);
  else if (s = M.maxOpen(Ya(s.content, u), !0), s.openStart || s.openEnd) {
    let f = 0, d = 0;
    for (let p = s.content.firstChild; f < s.openStart && !p.type.spec.isolating; f++, p = p.firstChild)
      ;
    for (let p = s.content.lastChild; d < s.openEnd && !p.type.spec.isolating; d++, p = p.lastChild)
      ;
    s = ni(s, f, d);
  }
  return t.someProp("transformPasted", (f) => {
    s = f(s, t);
  }), s;
}
const $a = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Ya(t, e) {
  if (t.childCount < 2)
    return t;
  for (let n = e.depth; n >= 0; n--) {
    let u = e.node(n).contentMatchAt(e.index(n)), i, o = [];
    if (t.forEach((s) => {
      if (!o)
        return;
      let l = u.findWrapping(s.type), a;
      if (!l)
        return o = null;
      if (a = o.length && i.length && Qo(l, i, s, o[o.length - 1], 0))
        o[o.length - 1] = a;
      else {
        o.length && (o[o.length - 1] = $o(o[o.length - 1], i.length));
        let c = Vo(s, l);
        o.push(c), u = u.matchType(c.type), i = l;
      }
    }), o)
      return x.from(o);
  }
  return t;
}
function Vo(t, e, n = 0) {
  for (let r = e.length - 1; r >= n; r--)
    t = e[r].create(null, x.from(t));
  return t;
}
function Qo(t, e, n, r, u) {
  if (u < t.length && u < e.length && t[u] == e[u]) {
    let i = Qo(t, e, n, r.lastChild, u + 1);
    if (i)
      return r.copy(r.content.replaceChild(r.childCount - 1, i));
    if (r.contentMatchAt(r.childCount).matchType(u == t.length - 1 ? n.type : t[u + 1]))
      return r.copy(r.content.append(x.from(Vo(n, t, u + 1))));
  }
}
function $o(t, e) {
  if (e == 0)
    return t;
  let n = t.content.replaceChild(t.childCount - 1, $o(t.lastChild, e - 1)), r = t.contentMatchAt(t.childCount).fillBefore(x.empty, !0);
  return t.copy(n.append(r));
}
function Br(t, e, n, r, u, i) {
  let o = e < 0 ? t.firstChild : t.lastChild, s = o.content;
  return t.childCount > 1 && (i = 0), u < r - 1 && (s = Br(s, e, n, r, u + 1, i)), u >= n && (s = e < 0 ? o.contentMatchAt(0).fillBefore(s, i <= u).append(s) : s.append(o.contentMatchAt(o.childCount).fillBefore(x.empty, !0))), t.replaceChild(e < 0 ? 0 : t.childCount - 1, o.copy(s));
}
function ni(t, e, n) {
  return e < t.openStart && (t = new M(Br(t.content, -1, e, t.openStart, 0, t.openEnd), e, t.openEnd)), n < t.openEnd && (t = new M(Br(t.content, 1, n, t.openEnd, 0, 0), t.openStart, n)), t;
}
const Yo = {
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
let ri = null;
function Wo() {
  return ri || (ri = document.implementation.createHTMLDocument("title"));
}
function Wa(t) {
  let e = /^(\s*<meta [^>]*>)*/.exec(t);
  e && (t = t.slice(e[0].length));
  let n = Wo().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(t), u;
  if ((u = r && Yo[r[1].toLowerCase()]) && (t = u.map((i) => "<" + i + ">").join("") + t + u.map((i) => "</" + i + ">").reverse().join("")), n.innerHTML = t, u)
    for (let i = 0; i < u.length; i++)
      n = n.querySelector(u[i]) || n;
  return n;
}
function Ha(t) {
  let e = t.querySelectorAll(W ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let n = 0; n < e.length; n++) {
    let r = e[n];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(t.ownerDocument.createTextNode(" "), r);
  }
}
function Ja(t, e) {
  if (!t.size)
    return t;
  let n = t.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return t;
  }
  let { content: u, openStart: i, openEnd: o } = t;
  for (let s = r.length - 2; s >= 0; s -= 2) {
    let l = n.nodes[r[s]];
    if (!l || l.hasRequiredAttrs())
      break;
    u = x.from(l.create(r[s + 1], u)), i++, o++;
  }
  return new M(u, i, o);
}
const J = {}, Z = {}, Za = { touchstart: !0, touchmove: !0 };
class Ga {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "" }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastAndroidDelete = 0, this.composing = !1, this.compositionNode = null, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function Ka(t) {
  for (let e in J) {
    let n = J[e];
    t.dom.addEventListener(e, t.input.eventHandlers[e] = (r) => {
      ec(t, r) && !ru(t, r) && (t.editable || !(r.type in Z)) && n(t, r);
    }, Za[e] ? { passive: !0 } : void 0);
  }
  H && t.dom.addEventListener("input", () => null), Pr(t);
}
function qe(t, e) {
  t.input.lastSelectionOrigin = e, t.input.lastSelectionTime = Date.now();
}
function Xa(t) {
  t.domObserver.stop();
  for (let e in t.input.eventHandlers)
    t.dom.removeEventListener(e, t.input.eventHandlers[e]);
  clearTimeout(t.input.composingTimeout), clearTimeout(t.input.lastIOSEnterFallbackTimeout);
}
function Pr(t) {
  t.someProp("handleDOMEvents", (e) => {
    for (let n in e)
      t.input.eventHandlers[n] || t.dom.addEventListener(n, t.input.eventHandlers[n] = (r) => ru(t, r));
  });
}
function ru(t, e) {
  return t.someProp("handleDOMEvents", (n) => {
    let r = n[e.type];
    return r ? r(t, e) || e.defaultPrevented : !1;
  });
}
function ec(t, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let n = e.target; n != t.dom; n = n.parentNode)
    if (!n || n.nodeType == 11 || n.pmViewDesc && n.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function tc(t, e) {
  !ru(t, e) && J[e.type] && (t.editable || !(e.type in Z)) && J[e.type](t, e);
}
Z.keydown = (t, e) => {
  let n = e;
  if (t.input.shiftKey = n.keyCode == 16 || n.shiftKey, !Jo(t, n) && (t.input.lastKeyCode = n.keyCode, t.input.lastKeyCodeTime = Date.now(), !(de && W && n.keyCode == 13)))
    if (n.keyCode != 229 && t.domObserver.forceFlush(), Et && n.keyCode == 13 && !n.ctrlKey && !n.altKey && !n.metaKey) {
      let r = Date.now();
      t.input.lastIOSEnter = r, t.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        t.input.lastIOSEnter == r && (t.someProp("handleKeyDown", (u) => u(t, Xe(13, "Enter"))), t.input.lastIOSEnter = 0);
      }, 200);
    } else
      t.someProp("handleKeyDown", (r) => r(t, n)) || Qa(t, n) ? n.preventDefault() : qe(t, "key");
};
Z.keyup = (t, e) => {
  e.keyCode == 16 && (t.input.shiftKey = !1);
};
Z.keypress = (t, e) => {
  let n = e;
  if (Jo(t, n) || !n.charCode || n.ctrlKey && !n.altKey || ie && n.metaKey)
    return;
  if (t.someProp("handleKeyPress", (u) => u(t, n))) {
    n.preventDefault();
    return;
  }
  let r = t.state.selection;
  if (!(r instanceof S) || !r.$from.sameParent(r.$to)) {
    let u = String.fromCharCode(n.charCode);
    !/[\r\n]/.test(u) && !t.someProp("handleTextInput", (i) => i(t, r.$from.pos, r.$to.pos, u)) && t.dispatch(t.state.tr.insertText(u).scrollIntoView()), n.preventDefault();
  }
};
function qn(t) {
  return { left: t.clientX, top: t.clientY };
}
function nc(t, e) {
  let n = e.x - t.clientX, r = e.y - t.clientY;
  return n * n + r * r < 100;
}
function uu(t, e, n, r, u) {
  if (r == -1)
    return !1;
  let i = t.state.doc.resolve(r);
  for (let o = i.depth + 1; o > 0; o--)
    if (t.someProp(e, (s) => o > i.depth ? s(t, n, i.nodeAfter, i.before(o), u, !0) : s(t, n, i.node(o), i.before(o), u, !1)))
      return !0;
  return !1;
}
function kt(t, e, n) {
  t.focused || t.focus();
  let r = t.state.tr.setSelection(e);
  n == "pointer" && r.setMeta("pointer", !0), t.dispatch(r);
}
function rc(t, e) {
  if (e == -1)
    return !1;
  let n = t.state.doc.resolve(e), r = n.nodeAfter;
  return r && r.isAtom && N.isSelectable(r) ? (kt(t, new N(n), "pointer"), !0) : !1;
}
function uc(t, e) {
  if (e == -1)
    return !1;
  let n = t.state.selection, r, u;
  n instanceof N && (r = n.node);
  let i = t.state.doc.resolve(e);
  for (let o = i.depth + 1; o > 0; o--) {
    let s = o > i.depth ? i.nodeAfter : i.node(o);
    if (N.isSelectable(s)) {
      r && n.$from.depth > 0 && o >= n.$from.depth && i.before(n.$from.depth + 1) == n.$from.pos ? u = i.before(n.$from.depth) : u = i.before(o);
      break;
    }
  }
  return u != null ? (kt(t, N.create(t.state.doc, u), "pointer"), !0) : !1;
}
function ic(t, e, n, r, u) {
  return uu(t, "handleClickOn", e, n, r) || t.someProp("handleClick", (i) => i(t, e, r)) || (u ? uc(t, n) : rc(t, n));
}
function oc(t, e, n, r) {
  return uu(t, "handleDoubleClickOn", e, n, r) || t.someProp("handleDoubleClick", (u) => u(t, e, r));
}
function sc(t, e, n, r) {
  return uu(t, "handleTripleClickOn", e, n, r) || t.someProp("handleTripleClick", (u) => u(t, e, r)) || lc(t, n, r);
}
function lc(t, e, n) {
  if (n.button != 0)
    return !1;
  let r = t.state.doc;
  if (e == -1)
    return r.inlineContent ? (kt(t, S.create(r, 0, r.content.size), "pointer"), !0) : !1;
  let u = r.resolve(e);
  for (let i = u.depth + 1; i > 0; i--) {
    let o = i > u.depth ? u.nodeAfter : u.node(i), s = u.before(i);
    if (o.inlineContent)
      kt(t, S.create(r, s + 1, s + 1 + o.content.size), "pointer");
    else if (N.isSelectable(o))
      kt(t, N.create(r, s), "pointer");
    else
      continue;
    return !0;
  }
}
function iu(t) {
  return wn(t);
}
const Ho = ie ? "metaKey" : "ctrlKey";
J.mousedown = (t, e) => {
  let n = e;
  t.input.shiftKey = n.shiftKey;
  let r = iu(t), u = Date.now(), i = "singleClick";
  u - t.input.lastClick.time < 500 && nc(n, t.input.lastClick) && !n[Ho] && (t.input.lastClick.type == "singleClick" ? i = "doubleClick" : t.input.lastClick.type == "doubleClick" && (i = "tripleClick")), t.input.lastClick = { time: u, x: n.clientX, y: n.clientY, type: i };
  let o = t.posAtCoords(qn(n));
  o && (i == "singleClick" ? (t.input.mouseDown && t.input.mouseDown.done(), t.input.mouseDown = new ac(t, o, n, !!r)) : (i == "doubleClick" ? oc : sc)(t, o.pos, o.inside, n) ? n.preventDefault() : qe(t, "pointer"));
};
class ac {
  constructor(e, n, r, u) {
    this.view = e, this.pos = n, this.event = r, this.flushed = u, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Ho], this.allowDefault = r.shiftKey;
    let i, o;
    if (n.inside > -1)
      i = e.state.doc.nodeAt(n.inside), o = n.inside;
    else {
      let c = e.state.doc.resolve(n.pos);
      i = c.parent, o = c.depth ? c.before() : 0;
    }
    const s = u ? null : r.target, l = s ? e.docView.nearestDesc(s, !0) : null;
    this.target = l ? l.dom : null;
    let { selection: a } = e.state;
    (r.button == 0 && i.type.spec.draggable && i.type.spec.selectable !== !1 || a instanceof N && a.from <= o && a.to > o) && (this.mightDrag = {
      node: i,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && pe && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), qe(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => Oe(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let n = this.pos;
    this.view.state.doc != this.startDoc && (n = this.view.posAtCoords(qn(e))), this.updateAllowDefault(e), this.allowDefault || !n ? qe(this.view, "pointer") : ic(this.view, n.pos, n.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    H && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    W && !this.view.state.selection.visible && Math.min(Math.abs(n.pos - this.view.state.selection.from), Math.abs(n.pos - this.view.state.selection.to)) <= 2) ? (kt(this.view, T.near(this.view.state.doc.resolve(n.pos)), "pointer"), e.preventDefault()) : qe(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), qe(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
J.touchstart = (t) => {
  t.input.lastTouch = Date.now(), iu(t), qe(t, "pointer");
};
J.touchmove = (t) => {
  t.input.lastTouch = Date.now(), qe(t, "pointer");
};
J.contextmenu = (t) => iu(t);
function Jo(t, e) {
  return t.composing ? !0 : H && Math.abs(e.timeStamp - t.input.compositionEndedAt) < 500 ? (t.input.compositionEndedAt = -2e8, !0) : !1;
}
const cc = de ? 5e3 : -1;
Z.compositionstart = Z.compositionupdate = (t) => {
  if (!t.composing) {
    t.domObserver.flush();
    let { state: e } = t, n = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !n.textOffset && n.parentOffset && n.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      t.markCursor = t.state.storedMarks || n.marks(), wn(t, !0), t.markCursor = null;
    else if (wn(t), pe && e.selection.empty && n.parentOffset && !n.textOffset && n.nodeBefore.marks.length) {
      let r = t.domSelectionRange();
      for (let u = r.focusNode, i = r.focusOffset; u && u.nodeType == 1 && i != 0; ) {
        let o = i < 0 ? u.lastChild : u.childNodes[i - 1];
        if (!o)
          break;
        if (o.nodeType == 3) {
          t.domSelection().collapse(o, o.nodeValue.length);
          break;
        } else
          u = o, i = -1;
      }
    }
    t.input.composing = !0;
  }
  Zo(t, cc);
};
Z.compositionend = (t, e) => {
  t.composing && (t.input.composing = !1, t.input.compositionEndedAt = e.timeStamp, t.input.compositionPendingChanges = t.domObserver.pendingRecords().length ? t.input.compositionID : 0, t.input.compositionNode = null, t.input.compositionPendingChanges && Promise.resolve().then(() => t.domObserver.flush()), t.input.compositionID++, Zo(t, 20));
};
function Zo(t, e) {
  clearTimeout(t.input.composingTimeout), e > -1 && (t.input.composingTimeout = setTimeout(() => wn(t), e));
}
function Go(t) {
  for (t.composing && (t.input.composing = !1, t.input.compositionEndedAt = dc()); t.input.compositionNodes.length > 0; )
    t.input.compositionNodes.pop().markParentsDirty();
}
function fc(t) {
  let e = t.domSelectionRange();
  if (!e.focusNode)
    return null;
  let n = ra(e.focusNode, e.focusOffset), r = ua(e.focusNode, e.focusOffset);
  if (n && r && n != r) {
    let u = r.pmViewDesc;
    if (!u || !u.isText(r.nodeValue))
      return r;
    if (t.input.compositionNode == r) {
      let i = n.pmViewDesc;
      if (!(!i || !i.isText(n.nodeValue)))
        return r;
    }
  }
  return n || r;
}
function dc() {
  let t = document.createEvent("Event");
  return t.initEvent("event", !0, !0), t.timeStamp;
}
function wn(t, e = !1) {
  if (!(de && t.domObserver.flushingSoon >= 0)) {
    if (t.domObserver.forceFlush(), Go(t), e || t.docView && t.docView.dirty) {
      let n = tu(t);
      return n && !n.eq(t.state.selection) ? t.dispatch(t.state.tr.setSelection(n)) : t.updateState(t.state), !0;
    }
    return !1;
  }
}
function hc(t, e) {
  if (!t.dom.parentNode)
    return;
  let n = t.dom.parentNode.appendChild(document.createElement("div"));
  n.appendChild(e), n.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), u = document.createRange();
  u.selectNodeContents(e), t.dom.blur(), r.removeAllRanges(), r.addRange(u), setTimeout(() => {
    n.parentNode && n.parentNode.removeChild(n), t.focus();
  }, 50);
}
const Jt = X && Qe < 15 || Et && ca < 604;
J.copy = Z.cut = (t, e) => {
  let n = e, r = t.state.selection, u = n.type == "cut";
  if (r.empty)
    return;
  let i = Jt ? null : n.clipboardData, o = r.content(), { dom: s, text: l } = Uo(t, o);
  i ? (n.preventDefault(), i.clearData(), i.setData("text/html", s.innerHTML), i.setData("text/plain", l)) : hc(t, s), u && t.dispatch(t.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function pc(t) {
  return t.openStart == 0 && t.openEnd == 0 && t.content.childCount == 1 ? t.content.firstChild : null;
}
function mc(t, e) {
  if (!t.dom.parentNode)
    return;
  let n = t.input.shiftKey || t.state.selection.$from.parent.type.spec.code, r = t.dom.parentNode.appendChild(document.createElement(n ? "textarea" : "div"));
  n || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let u = t.input.shiftKey && t.input.lastKeyCode != 45;
  setTimeout(() => {
    t.focus(), r.parentNode && r.parentNode.removeChild(r), n ? Zt(t, r.value, null, u, e) : Zt(t, r.textContent, r.innerHTML, u, e);
  }, 50);
}
function Zt(t, e, n, r, u) {
  let i = qo(t, e, n, r, t.state.selection.$from);
  if (t.someProp("handlePaste", (l) => l(t, u, i || M.empty)))
    return !0;
  if (!i)
    return !1;
  let o = pc(i), s = o ? t.state.tr.replaceSelectionWith(o, r) : t.state.tr.replaceSelection(i);
  return t.dispatch(s.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Ko(t) {
  let e = t.getData("text/plain") || t.getData("Text");
  if (e)
    return e;
  let n = t.getData("text/uri-list");
  return n ? n.replace(/\r?\n/g, " ") : "";
}
Z.paste = (t, e) => {
  let n = e;
  if (t.composing && !de)
    return;
  let r = Jt ? null : n.clipboardData, u = t.input.shiftKey && t.input.lastKeyCode != 45;
  r && Zt(t, Ko(r), r.getData("text/html"), u, n) ? n.preventDefault() : mc(t, n);
};
class Xo {
  constructor(e, n, r) {
    this.slice = e, this.move = n, this.node = r;
  }
}
const es = ie ? "altKey" : "ctrlKey";
J.dragstart = (t, e) => {
  let n = e, r = t.input.mouseDown;
  if (r && r.done(), !n.dataTransfer)
    return;
  let u = t.state.selection, i = u.empty ? null : t.posAtCoords(qn(n)), o;
  if (!(i && i.pos >= u.from && i.pos <= (u instanceof N ? u.to - 1 : u.to))) {
    if (r && r.mightDrag)
      o = N.create(t.state.doc, r.mightDrag.pos);
    else if (n.target && n.target.nodeType == 1) {
      let f = t.docView.nearestDesc(n.target, !0);
      f && f.node.type.spec.draggable && f != t.docView && (o = N.create(t.state.doc, f.posBefore));
    }
  }
  let s = (o || t.state.selection).content(), { dom: l, text: a, slice: c } = Uo(t, s);
  n.dataTransfer.clearData(), n.dataTransfer.setData(Jt ? "Text" : "text/html", l.innerHTML), n.dataTransfer.effectAllowed = "copyMove", Jt || n.dataTransfer.setData("text/plain", a), t.dragging = new Xo(c, !n[es], o);
};
J.dragend = (t) => {
  let e = t.dragging;
  window.setTimeout(() => {
    t.dragging == e && (t.dragging = null);
  }, 50);
};
Z.dragover = Z.dragenter = (t, e) => e.preventDefault();
Z.drop = (t, e) => {
  let n = e, r = t.dragging;
  if (t.dragging = null, !n.dataTransfer)
    return;
  let u = t.posAtCoords(qn(n));
  if (!u)
    return;
  let i = t.state.doc.resolve(u.pos), o = r && r.slice;
  o ? t.someProp("transformPasted", (h) => {
    o = h(o, t);
  }) : o = qo(t, Ko(n.dataTransfer), Jt ? null : n.dataTransfer.getData("text/html"), !1, i);
  let s = !!(r && !n[es]);
  if (t.someProp("handleDrop", (h) => h(t, n, o || M.empty, s))) {
    n.preventDefault();
    return;
  }
  if (!o)
    return;
  n.preventDefault();
  let l = o ? bo(t.state.doc, i.pos, o) : i.pos;
  l == null && (l = i.pos);
  let a = t.state.tr;
  if (s) {
    let { node: h } = r;
    h ? h.replace(a) : a.deleteSelection();
  }
  let c = a.mapping.map(l), f = o.openStart == 0 && o.openEnd == 0 && o.content.childCount == 1, d = a.doc;
  if (f ? a.replaceRangeWith(c, c, o.content.firstChild) : a.replaceRange(c, c, o), a.doc.eq(d))
    return;
  let p = a.doc.resolve(c);
  if (f && N.isSelectable(o.content.firstChild) && p.nodeAfter && p.nodeAfter.sameMarkup(o.content.firstChild))
    a.setSelection(new N(p));
  else {
    let h = a.mapping.map(l);
    a.mapping.maps[a.mapping.maps.length - 1].forEach((m, g, b, y) => h = y), a.setSelection(nu(t, p, a.doc.resolve(h)));
  }
  t.focus(), t.dispatch(a.setMeta("uiEvent", "drop"));
};
J.focus = (t) => {
  t.input.lastFocus = Date.now(), t.focused || (t.domObserver.stop(), t.dom.classList.add("ProseMirror-focused"), t.domObserver.start(), t.focused = !0, setTimeout(() => {
    t.docView && t.hasFocus() && !t.domObserver.currentSelection.eq(t.domSelectionRange()) && Oe(t);
  }, 20));
};
J.blur = (t, e) => {
  let n = e;
  t.focused && (t.domObserver.stop(), t.dom.classList.remove("ProseMirror-focused"), t.domObserver.start(), n.relatedTarget && t.dom.contains(n.relatedTarget) && t.domObserver.currentSelection.clear(), t.focused = !1);
};
J.beforeinput = (t, e) => {
  if (W && de && e.inputType == "deleteContentBackward") {
    t.domObserver.flushSoon();
    let { domChangeCount: r } = t.input;
    setTimeout(() => {
      if (t.input.domChangeCount != r || (t.dom.blur(), t.focus(), t.someProp("handleKeyDown", (i) => i(t, Xe(8, "Backspace")))))
        return;
      let { $cursor: u } = t.state.selection;
      u && u.pos > 0 && t.dispatch(t.state.tr.delete(u.pos - 1, u.pos).scrollIntoView());
    }, 50);
  }
};
for (let t in Z)
  J[t] = Z[t];
function Gt(t, e) {
  if (t == e)
    return !0;
  for (let n in t)
    if (t[n] !== e[n])
      return !1;
  for (let n in e)
    if (!(n in t))
      return !1;
  return !0;
}
class On {
  constructor(e, n) {
    this.toDOM = e, this.spec = n || it, this.side = this.spec.side || 0;
  }
  map(e, n, r, u) {
    let { pos: i, deleted: o } = e.mapResult(n.from + u, this.side < 0 ? -1 : 1);
    return o ? null : new le(i - r, i - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof On && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && Gt(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class Ye {
  constructor(e, n) {
    this.attrs = e, this.spec = n || it;
  }
  map(e, n, r, u) {
    let i = e.map(n.from + u, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(n.to + u, this.spec.inclusiveEnd ? 1 : -1) - r;
    return i >= o ? null : new le(i, o, this);
  }
  valid(e, n) {
    return n.from < n.to;
  }
  eq(e) {
    return this == e || e instanceof Ye && Gt(this.attrs, e.attrs) && Gt(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof Ye;
  }
  destroy() {
  }
}
class ou {
  constructor(e, n) {
    this.attrs = e, this.spec = n || it;
  }
  map(e, n, r, u) {
    let i = e.mapResult(n.from + u, 1);
    if (i.deleted)
      return null;
    let o = e.mapResult(n.to + u, -1);
    return o.deleted || o.pos <= i.pos ? null : new le(i.pos - r, o.pos - r, this);
  }
  valid(e, n) {
    let { index: r, offset: u } = e.content.findIndex(n.from), i;
    return u == n.from && !(i = e.child(r)).isText && u + i.nodeSize == n.to;
  }
  eq(e) {
    return this == e || e instanceof ou && Gt(this.attrs, e.attrs) && Gt(this.spec, e.spec);
  }
  destroy() {
  }
}
class le {
  /**
  @internal
  */
  constructor(e, n, r) {
    this.from = e, this.to = n, this.type = r;
  }
  /**
  @internal
  */
  copy(e, n) {
    return new le(e, n, this.type);
  }
  /**
  @internal
  */
  eq(e, n = 0) {
    return this.type.eq(e.type) && this.from + n == e.from && this.to + n == e.to;
  }
  /**
  @internal
  */
  map(e, n, r) {
    return this.type.map(e, this, n, r);
  }
  /**
  Creates a widget decoration, which is a DOM node that's shown in
  the document at the given position. It is recommended that you
  delay rendering the widget by passing a function that will be
  called when the widget is actually drawn in a view, but you can
  also directly pass a DOM node. `getPos` can be used to find the
  widget's current document position.
  */
  static widget(e, n, r) {
    return new le(e, e, new On(n, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, n, r, u) {
    return new le(e, n, new Ye(r, u));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, n, r, u) {
    return new le(e, n, new ou(r, u));
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
    return this.type instanceof On;
  }
}
const gt = [], it = {};
class j {
  /**
  @internal
  */
  constructor(e, n) {
    this.local = e.length ? e : gt, this.children = n.length ? n : gt;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, n) {
    return n.length ? _n(n, e, 0, it) : Q;
  }
  /**
  Find all decorations in this set which touch the given range
  (including decorations that start or end directly at the
  boundaries) and match the given predicate on their spec. When
  `start` and `end` are omitted, all decorations in the set are
  considered. When `predicate` isn't given, all decorations are
  assumed to match.
  */
  find(e, n, r) {
    let u = [];
    return this.findInner(e ?? 0, n ?? 1e9, u, 0, r), u;
  }
  findInner(e, n, r, u, i) {
    for (let o = 0; o < this.local.length; o++) {
      let s = this.local[o];
      s.from <= n && s.to >= e && (!i || i(s.spec)) && r.push(s.copy(s.from + u, s.to + u));
    }
    for (let o = 0; o < this.children.length; o += 3)
      if (this.children[o] < n && this.children[o + 1] > e) {
        let s = this.children[o] + 1;
        this.children[o + 2].findInner(e - s, n - s, r, u + s, i);
      }
  }
  /**
  Map the set of decorations in response to a change in the
  document.
  */
  map(e, n, r) {
    return this == Q || e.maps.length == 0 ? this : this.mapInner(e, n, 0, 0, r || it);
  }
  /**
  @internal
  */
  mapInner(e, n, r, u, i) {
    let o;
    for (let s = 0; s < this.local.length; s++) {
      let l = this.local[s].map(e, r, u);
      l && l.type.valid(n, l) ? (o || (o = [])).push(l) : i.onRemove && i.onRemove(this.local[s].spec);
    }
    return this.children.length ? gc(this.children, o || [], e, n, r, u, i) : o ? new j(o.sort(ot), gt) : Q;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, n) {
    return n.length ? this == Q ? j.create(e, n) : this.addInner(e, n, 0) : this;
  }
  addInner(e, n, r) {
    let u, i = 0;
    e.forEach((s, l) => {
      let a = l + r, c;
      if (c = ns(n, s, a)) {
        for (u || (u = this.children.slice()); i < u.length && u[i] < l; )
          i += 3;
        u[i] == l ? u[i + 2] = u[i + 2].addInner(s, c, a + 1) : u.splice(i, 0, l, l + s.nodeSize, _n(c, s, a + 1, it)), i += 3;
      }
    });
    let o = ts(i ? rs(n) : n, -r);
    for (let s = 0; s < o.length; s++)
      o[s].type.valid(e, o[s]) || o.splice(s--, 1);
    return new j(o.length ? this.local.concat(o).sort(ot) : this.local, u || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == Q ? this : this.removeInner(e, 0);
  }
  removeInner(e, n) {
    let r = this.children, u = this.local;
    for (let i = 0; i < r.length; i += 3) {
      let o, s = r[i] + n, l = r[i + 1] + n;
      for (let c = 0, f; c < e.length; c++)
        (f = e[c]) && f.from > s && f.to < l && (e[c] = null, (o || (o = [])).push(f));
      if (!o)
        continue;
      r == this.children && (r = this.children.slice());
      let a = r[i + 2].removeInner(o, s + 1);
      a != Q ? r[i + 2] = a : (r.splice(i, 3), i -= 3);
    }
    if (u.length) {
      for (let i = 0, o; i < e.length; i++)
        if (o = e[i])
          for (let s = 0; s < u.length; s++)
            u[s].eq(o, n) && (u == this.local && (u = this.local.slice()), u.splice(s--, 1));
    }
    return r == this.children && u == this.local ? this : u.length || r.length ? new j(u, r) : Q;
  }
  forChild(e, n) {
    if (this == Q)
      return this;
    if (n.isLeaf)
      return j.empty;
    let r, u;
    for (let s = 0; s < this.children.length; s += 3)
      if (this.children[s] >= e) {
        this.children[s] == e && (r = this.children[s + 2]);
        break;
      }
    let i = e + 1, o = i + n.content.size;
    for (let s = 0; s < this.local.length; s++) {
      let l = this.local[s];
      if (l.from < o && l.to > i && l.type instanceof Ye) {
        let a = Math.max(i, l.from) - i, c = Math.min(o, l.to) - i;
        a < c && (u || (u = [])).push(l.copy(a, c));
      }
    }
    if (u) {
      let s = new j(u.sort(ot), gt);
      return r ? new Re([s, r]) : s;
    }
    return r || Q;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof j) || this.local.length != e.local.length || this.children.length != e.children.length)
      return !1;
    for (let n = 0; n < this.local.length; n++)
      if (!this.local[n].eq(e.local[n]))
        return !1;
    for (let n = 0; n < this.children.length; n += 3)
      if (this.children[n] != e.children[n] || this.children[n + 1] != e.children[n + 1] || !this.children[n + 2].eq(e.children[n + 2]))
        return !1;
    return !0;
  }
  /**
  @internal
  */
  locals(e) {
    return su(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == Q)
      return gt;
    if (e.inlineContent || !this.local.some(Ye.is))
      return this.local;
    let n = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof Ye || n.push(this.local[r]);
    return n;
  }
}
j.empty = new j([], []);
j.removeOverlap = su;
const Q = j.empty;
class Re {
  constructor(e) {
    this.members = e;
  }
  map(e, n) {
    const r = this.members.map((u) => u.map(e, n, it));
    return Re.from(r);
  }
  forChild(e, n) {
    if (n.isLeaf)
      return j.empty;
    let r = [];
    for (let u = 0; u < this.members.length; u++) {
      let i = this.members[u].forChild(e, n);
      i != Q && (i instanceof Re ? r = r.concat(i.members) : r.push(i));
    }
    return Re.from(r);
  }
  eq(e) {
    if (!(e instanceof Re) || e.members.length != this.members.length)
      return !1;
    for (let n = 0; n < this.members.length; n++)
      if (!this.members[n].eq(e.members[n]))
        return !1;
    return !0;
  }
  locals(e) {
    let n, r = !0;
    for (let u = 0; u < this.members.length; u++) {
      let i = this.members[u].localsInner(e);
      if (i.length)
        if (!n)
          n = i;
        else {
          r && (n = n.slice(), r = !1);
          for (let o = 0; o < i.length; o++)
            n.push(i[o]);
        }
    }
    return n ? su(r ? n : n.sort(ot)) : gt;
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
        return new Re(e.every((n) => n instanceof j) ? e : e.reduce((n, r) => n.concat(r instanceof j ? r : r.members), []));
    }
  }
}
function gc(t, e, n, r, u, i, o) {
  let s = t.slice();
  for (let a = 0, c = i; a < n.maps.length; a++) {
    let f = 0;
    n.maps[a].forEach((d, p, h, m) => {
      let g = m - h - (p - d);
      for (let b = 0; b < s.length; b += 3) {
        let y = s[b + 1];
        if (y < 0 || d > y + c - f)
          continue;
        let D = s[b] + c - f;
        p >= D ? s[b + 1] = d <= D ? -2 : -1 : d >= c && g && (s[b] += g, s[b + 1] += g);
      }
      f += g;
    }), c = n.maps[a].map(c, -1);
  }
  let l = !1;
  for (let a = 0; a < s.length; a += 3)
    if (s[a + 1] < 0) {
      if (s[a + 1] == -2) {
        l = !0, s[a + 1] = -1;
        continue;
      }
      let c = n.map(t[a] + i), f = c - u;
      if (f < 0 || f >= r.content.size) {
        l = !0;
        continue;
      }
      let d = n.map(t[a + 1] + i, -1), p = d - u, { index: h, offset: m } = r.content.findIndex(f), g = r.maybeChild(h);
      if (g && m == f && m + g.nodeSize == p) {
        let b = s[a + 2].mapInner(n, g, c + 1, t[a] + i + 1, o);
        b != Q ? (s[a] = f, s[a + 1] = p, s[a + 2] = b) : (s[a + 1] = -2, l = !0);
      } else
        l = !0;
    }
  if (l) {
    let a = bc(s, t, e, n, u, i, o), c = _n(a, r, 0, o);
    e = c.local;
    for (let f = 0; f < s.length; f += 3)
      s[f + 1] < 0 && (s.splice(f, 3), f -= 3);
    for (let f = 0, d = 0; f < c.children.length; f += 3) {
      let p = c.children[f];
      for (; d < s.length && s[d] < p; )
        d += 3;
      s.splice(d, 0, c.children[f], c.children[f + 1], c.children[f + 2]);
    }
  }
  return new j(e.sort(ot), s);
}
function ts(t, e) {
  if (!e || !t.length)
    return t;
  let n = [];
  for (let r = 0; r < t.length; r++) {
    let u = t[r];
    n.push(new le(u.from + e, u.to + e, u.type));
  }
  return n;
}
function bc(t, e, n, r, u, i, o) {
  function s(l, a) {
    for (let c = 0; c < l.local.length; c++) {
      let f = l.local[c].map(r, u, a);
      f ? n.push(f) : o.onRemove && o.onRemove(l.local[c].spec);
    }
    for (let c = 0; c < l.children.length; c += 3)
      s(l.children[c + 2], l.children[c] + a + 1);
  }
  for (let l = 0; l < t.length; l += 3)
    t[l + 1] == -1 && s(t[l + 2], e[l] + i + 1);
  return n;
}
function ns(t, e, n) {
  if (e.isLeaf)
    return null;
  let r = n + e.nodeSize, u = null;
  for (let i = 0, o; i < t.length; i++)
    (o = t[i]) && o.from > n && o.to < r && ((u || (u = [])).push(o), t[i] = null);
  return u;
}
function rs(t) {
  let e = [];
  for (let n = 0; n < t.length; n++)
    t[n] != null && e.push(t[n]);
  return e;
}
function _n(t, e, n, r) {
  let u = [], i = !1;
  e.forEach((s, l) => {
    let a = ns(t, s, l + n);
    if (a) {
      i = !0;
      let c = _n(a, s, n + l + 1, r);
      c != Q && u.push(l, l + s.nodeSize, c);
    }
  });
  let o = ts(i ? rs(t) : t, -n).sort(ot);
  for (let s = 0; s < o.length; s++)
    o[s].type.valid(e, o[s]) || (r.onRemove && r.onRemove(o[s].spec), o.splice(s--, 1));
  return o.length || u.length ? new j(o, u) : Q;
}
function ot(t, e) {
  return t.from - e.from || t.to - e.to;
}
function su(t) {
  let e = t;
  for (let n = 0; n < e.length - 1; n++) {
    let r = e[n];
    if (r.from != r.to)
      for (let u = n + 1; u < e.length; u++) {
        let i = e[u];
        if (i.from == r.from) {
          i.to != r.to && (e == t && (e = t.slice()), e[u] = i.copy(i.from, r.to), ui(e, u + 1, i.copy(r.to, i.to)));
          continue;
        } else {
          i.from < r.to && (e == t && (e = t.slice()), e[n] = r.copy(r.from, i.from), ui(e, u, r.copy(i.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function ui(t, e, n) {
  for (; e < t.length && ot(n, t[e]) > 0; )
    e++;
  t.splice(e, 0, n);
}
function sr(t) {
  let e = [];
  return t.someProp("decorations", (n) => {
    let r = n(t.state);
    r && r != Q && e.push(r);
  }), t.cursorWrapper && e.push(j.create(t.state.doc, [t.cursorWrapper.deco])), Re.from(e);
}
const xc = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, Mc = X && Qe <= 11;
class yc {
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
class kc {
  constructor(e, n) {
    this.view = e, this.handleDOMChange = n, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new yc(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let u = 0; u < r.length; u++)
        this.queue.push(r[u]);
      X && Qe <= 11 && r.some((u) => u.type == "childList" && u.removedNodes.length || u.type == "characterData" && u.oldValue.length > u.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), Mc && (this.onCharData = (r) => {
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
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, xc)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
  }
  stop() {
    if (this.observer) {
      let e = this.observer.takeRecords();
      if (e.length) {
        for (let n = 0; n < e.length; n++)
          this.queue.push(e[n]);
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
    if (Zu(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Oe(this.view);
      if (X && Qe <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && at(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
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
    let n = /* @__PURE__ */ new Set(), r;
    for (let i = e.focusNode; i; i = Ht(i))
      n.add(i);
    for (let i = e.anchorNode; i; i = Ht(i))
      if (n.has(i)) {
        r = i;
        break;
      }
    let u = r && this.view.docView.nearestDesc(r);
    if (u && u.ignoreMutation({
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
    let n = this.pendingRecords();
    n.length && (this.queue = []);
    let r = e.domSelectionRange(), u = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && Zu(e) && !this.ignoreSelectionChange(r), i = -1, o = -1, s = !1, l = [];
    if (e.editable)
      for (let c = 0; c < n.length; c++) {
        let f = this.registerMutation(n[c], l);
        f && (i = i < 0 ? f.from : Math.min(f.from, i), o = o < 0 ? f.to : Math.max(f.to, o), f.typeOver && (s = !0));
      }
    if (pe && l.length > 1) {
      let c = l.filter((f) => f.nodeName == "BR");
      if (c.length == 2) {
        let f = c[0], d = c[1];
        f.parentNode && f.parentNode.parentNode == d.parentNode ? d.remove() : f.remove();
      }
    }
    let a = null;
    i < 0 && u && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Pn(r) && (a = tu(e)) && a.eq(T.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, Oe(e), this.currentSelection.set(r), e.scrollToSelection()) : (i > -1 || u) && (i > -1 && (e.docView.markDirty(i, o), Dc(e)), this.handleDOMChange(i, o, s, l), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || Oe(e), this.currentSelection.set(r));
  }
  registerMutation(e, n) {
    if (n.indexOf(e.target) > -1)
      return null;
    let r = this.view.docView.nearestDesc(e.target);
    if (e.type == "attributes" && (r == this.view.docView || e.attributeName == "contenteditable" || // Firefox sometimes fires spurious events for null/empty styles
    e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !r || r.ignoreMutation(e))
      return null;
    if (e.type == "childList") {
      for (let c = 0; c < e.addedNodes.length; c++)
        n.push(e.addedNodes[c]);
      if (r.contentDOM && r.contentDOM != r.dom && !r.contentDOM.contains(e.target))
        return { from: r.posBefore, to: r.posAfter };
      let u = e.previousSibling, i = e.nextSibling;
      if (X && Qe <= 11 && e.addedNodes.length)
        for (let c = 0; c < e.addedNodes.length; c++) {
          let { previousSibling: f, nextSibling: d } = e.addedNodes[c];
          (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (u = f), (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (i = d);
        }
      let o = u && u.parentNode == e.target ? P(u) + 1 : 0, s = r.localPosFromDOM(e.target, o, -1), l = i && i.parentNode == e.target ? P(i) : e.target.childNodes.length, a = r.localPosFromDOM(e.target, l, 1);
      return { from: s, to: a };
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
let ii = /* @__PURE__ */ new WeakMap(), oi = !1;
function Dc(t) {
  if (!ii.has(t) && (ii.set(t, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(t.dom).whiteSpace) !== -1)) {
    if (t.requiresGeckoHackNode = pe, oi)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), oi = !0;
  }
}
function si(t, e) {
  let n = e.startContainer, r = e.startOffset, u = e.endContainer, i = e.endOffset, o = t.domAtPos(t.state.selection.anchor);
  return at(o.node, o.offset, u, i) && ([n, r, u, i] = [u, i, n, r]), { anchorNode: n, anchorOffset: r, focusNode: u, focusOffset: i };
}
function Nc(t, e) {
  if (e.getComposedRanges) {
    let u = e.getComposedRanges(t.root)[0];
    if (u)
      return si(t, u);
  }
  let n;
  function r(u) {
    u.preventDefault(), u.stopImmediatePropagation(), n = u.getTargetRanges()[0];
  }
  return t.dom.addEventListener("beforeinput", r, !0), document.execCommand("indent"), t.dom.removeEventListener("beforeinput", r, !0), n ? si(t, n) : null;
}
function Cc(t, e, n) {
  let { node: r, fromOffset: u, toOffset: i, from: o, to: s } = t.docView.parseRange(e, n), l = t.domSelectionRange(), a, c = l.anchorNode;
  if (c && t.dom.contains(c.nodeType == 1 ? c : c.parentNode) && (a = [{ node: c, offset: l.anchorOffset }], Pn(l) || a.push({ node: l.focusNode, offset: l.focusOffset })), W && t.input.lastKeyCode === 8)
    for (let g = i; g > u; g--) {
      let b = r.childNodes[g - 1], y = b.pmViewDesc;
      if (b.nodeName == "BR" && !y) {
        i = g;
        break;
      }
      if (!y || y.size)
        break;
    }
  let f = t.state.doc, d = t.someProp("domParser") || Nt.fromSchema(t.state.schema), p = f.resolve(o), h = null, m = d.parse(r, {
    topNode: p.parent,
    topMatch: p.parent.contentMatchAt(p.index()),
    topOpen: !0,
    from: u,
    to: i,
    preserveWhitespace: p.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: a,
    ruleFromNode: Ac,
    context: p
  });
  if (a && a[0].pos != null) {
    let g = a[0].pos, b = a[1] && a[1].pos;
    b == null && (b = g), h = { anchor: g + o, head: b + o };
  }
  return { doc: m, sel: h, from: o, to: s };
}
function Ac(t) {
  let e = t.pmViewDesc;
  if (e)
    return e.parseRule();
  if (t.nodeName == "BR" && t.parentNode) {
    if (H && /^(ul|ol)$/i.test(t.parentNode.nodeName)) {
      let n = document.createElement("div");
      return n.appendChild(document.createElement("li")), { skip: n };
    } else if (t.parentNode.lastChild == t || H && /^(tr|table)$/i.test(t.parentNode.nodeName))
      return { ignore: !0 };
  } else if (t.nodeName == "IMG" && t.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
const Ec = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Tc(t, e, n, r, u) {
  let i = t.input.compositionPendingChanges || (t.composing ? t.input.compositionID : 0);
  if (t.input.compositionPendingChanges = 0, e < 0) {
    let E = t.input.lastSelectionTime > Date.now() - 50 ? t.input.lastSelectionOrigin : null, G = tu(t, E);
    if (G && !t.state.selection.eq(G)) {
      if (W && de && t.input.lastKeyCode === 13 && Date.now() - 100 < t.input.lastKeyCodeTime && t.someProp("handleKeyDown", (Hn) => Hn(t, Xe(13, "Enter"))))
        return;
      let ze = t.state.tr.setSelection(G);
      E == "pointer" ? ze.setMeta("pointer", !0) : E == "key" && ze.scrollIntoView(), i && ze.setMeta("composition", i), t.dispatch(ze);
    }
    return;
  }
  let o = t.state.doc.resolve(e), s = o.sharedDepth(n);
  e = o.before(s + 1), n = t.state.doc.resolve(n).after(s + 1);
  let l = t.state.selection, a = Cc(t, e, n), c = t.state.doc, f = c.slice(a.from, a.to), d, p;
  t.input.lastKeyCode === 8 && Date.now() - 100 < t.input.lastKeyCodeTime ? (d = t.state.selection.to, p = "end") : (d = t.state.selection.from, p = "start"), t.input.lastKeyCode = null;
  let h = wc(f.content, a.doc.content, a.from, d, p);
  if ((Et && t.input.lastIOSEnter > Date.now() - 225 || de) && u.some((E) => E.nodeType == 1 && !Ec.test(E.nodeName)) && (!h || h.endA >= h.endB) && t.someProp("handleKeyDown", (E) => E(t, Xe(13, "Enter")))) {
    t.input.lastIOSEnter = 0;
    return;
  }
  if (!h)
    if (r && l instanceof S && !l.empty && l.$head.sameParent(l.$anchor) && !t.composing && !(a.sel && a.sel.anchor != a.sel.head))
      h = { start: l.from, endA: l.to, endB: l.to };
    else {
      if (a.sel) {
        let E = li(t, t.state.doc, a.sel);
        if (E && !E.eq(t.state.selection)) {
          let G = t.state.tr.setSelection(E);
          i && G.setMeta("composition", i), t.dispatch(G);
        }
      }
      return;
    }
  t.input.domChangeCount++, t.state.selection.from < t.state.selection.to && h.start == h.endB && t.state.selection instanceof S && (h.start > t.state.selection.from && h.start <= t.state.selection.from + 2 && t.state.selection.from >= a.from ? h.start = t.state.selection.from : h.endA < t.state.selection.to && h.endA >= t.state.selection.to - 2 && t.state.selection.to <= a.to && (h.endB += t.state.selection.to - h.endA, h.endA = t.state.selection.to)), X && Qe <= 11 && h.endB == h.start + 1 && h.endA == h.start && h.start > a.from && a.doc.textBetween(h.start - a.from - 1, h.start - a.from + 1) == "  " && (h.start--, h.endA--, h.endB--);
  let m = a.doc.resolveNoCache(h.start - a.from), g = a.doc.resolveNoCache(h.endB - a.from), b = c.resolve(h.start), y = m.sameParent(g) && m.parent.inlineContent && b.end() >= h.endA, D;
  if ((Et && t.input.lastIOSEnter > Date.now() - 225 && (!y || u.some((E) => E.nodeName == "DIV" || E.nodeName == "P")) || !y && m.pos < a.doc.content.size && !m.sameParent(g) && (D = T.findFrom(a.doc.resolve(m.pos + 1), 1, !0)) && D.head == g.pos) && t.someProp("handleKeyDown", (E) => E(t, Xe(13, "Enter")))) {
    t.input.lastIOSEnter = 0;
    return;
  }
  if (t.state.selection.anchor > h.start && Sc(c, h.start, h.endA, m, g) && t.someProp("handleKeyDown", (E) => E(t, Xe(8, "Backspace")))) {
    de && W && t.domObserver.suppressSelectionUpdates();
    return;
  }
  W && de && h.endB == h.start && (t.input.lastAndroidDelete = Date.now()), de && !y && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && a.sel && a.sel.anchor == a.sel.head && a.sel.head == h.endA && (h.endB -= 2, g = a.doc.resolveNoCache(h.endB - a.from), setTimeout(() => {
    t.someProp("handleKeyDown", function(E) {
      return E(t, Xe(13, "Enter"));
    });
  }, 20));
  let k = h.start, C = h.endA, A, _, V;
  if (y) {
    if (m.pos == g.pos)
      X && Qe <= 11 && m.parentOffset == 0 && (t.domObserver.suppressSelectionUpdates(), setTimeout(() => Oe(t), 20)), A = t.state.tr.delete(k, C), _ = c.resolve(h.start).marksAcross(c.resolve(h.endA));
    else if (
      // Adding or removing a mark
      h.endA == h.endB && (V = Ic(m.parent.content.cut(m.parentOffset, g.parentOffset), b.parent.content.cut(b.parentOffset, h.endA - b.start())))
    )
      A = t.state.tr, V.type == "add" ? A.addMark(k, C, V.mark) : A.removeMark(k, C, V.mark);
    else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let E = m.parent.textBetween(m.parentOffset, g.parentOffset);
      if (t.someProp("handleTextInput", (G) => G(t, k, C, E)))
        return;
      A = t.state.tr.insertText(E, k, C);
    }
  }
  if (A || (A = t.state.tr.replace(k, C, a.doc.slice(h.start - a.from, h.endB - a.from))), a.sel) {
    let E = li(t, A.doc, a.sel);
    E && !(W && de && t.composing && E.empty && (h.start != h.endB || t.input.lastAndroidDelete < Date.now() - 100) && (E.head == k || E.head == A.mapping.map(C) - 1) || X && E.empty && E.head == k) && A.setSelection(E);
  }
  _ && A.ensureMarks(_), i && A.setMeta("composition", i), t.dispatch(A.scrollIntoView());
}
function li(t, e, n) {
  return Math.max(n.anchor, n.head) > e.content.size ? null : nu(t, e.resolve(n.anchor), e.resolve(n.head));
}
function Ic(t, e) {
  let n = t.firstChild.marks, r = e.firstChild.marks, u = n, i = r, o, s, l;
  for (let c = 0; c < r.length; c++)
    u = r[c].removeFromSet(u);
  for (let c = 0; c < n.length; c++)
    i = n[c].removeFromSet(i);
  if (u.length == 1 && i.length == 0)
    s = u[0], o = "add", l = (c) => c.mark(s.addToSet(c.marks));
  else if (u.length == 0 && i.length == 1)
    s = i[0], o = "remove", l = (c) => c.mark(s.removeFromSet(c.marks));
  else
    return null;
  let a = [];
  for (let c = 0; c < e.childCount; c++)
    a.push(l(e.child(c)));
  if (x.from(a).eq(t))
    return { mark: s, type: o };
}
function Sc(t, e, n, r, u) {
  if (
    // The content must have shrunk
    n - e <= u.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
    lr(r, !0, !1) < u.pos
  )
    return !1;
  let i = t.resolve(e);
  if (!r.parent.isTextblock) {
    let s = i.nodeAfter;
    return s != null && n == e + s.nodeSize;
  }
  if (i.parentOffset < i.parent.content.size || !i.parent.isTextblock)
    return !1;
  let o = t.resolve(lr(i, !0, !0));
  return !o.parent.isTextblock || o.pos > n || lr(o, !0, !1) < n ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function lr(t, e, n) {
  let r = t.depth, u = e ? t.end() : t.pos;
  for (; r > 0 && (e || t.indexAfter(r) == t.node(r).childCount); )
    r--, u++, e = !1;
  if (n) {
    let i = t.node(r).maybeChild(t.indexAfter(r));
    for (; i && !i.isLeaf; )
      i = i.firstChild, u++;
  }
  return u;
}
function wc(t, e, n, r, u) {
  let i = t.findDiffStart(e, n);
  if (i == null)
    return null;
  let { a: o, b: s } = t.findDiffEnd(e, n + t.size, n + e.size);
  if (u == "end") {
    let l = Math.max(0, i - Math.min(o, s));
    r -= o + l - i;
  }
  if (o < i && t.size < e.size) {
    let l = r <= i && r >= o ? i - r : 0;
    i -= l, i && i < e.size && ai(e.textBetween(i - 1, i + 1)) && (i += l ? 1 : -1), s = i + (s - o), o = i;
  } else if (s < i) {
    let l = r <= i && r >= s ? i - r : 0;
    i -= l, i && i < t.size && ai(t.textBetween(i - 1, i + 1)) && (i += l ? 1 : -1), o = i + (o - s), s = i;
  }
  return { start: i, endA: o, endB: s };
}
function ai(t) {
  if (t.length != 2)
    return !1;
  let e = t.charCodeAt(0), n = t.charCodeAt(1);
  return e >= 56320 && e <= 57343 && n >= 55296 && n <= 56319;
}
class Oc {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, n) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Ga(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = n, this.state = n.state, this.directPlugins = n.plugins || [], this.directPlugins.forEach(pi), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = di(this), fi(this), this.nodeViews = hi(this), this.docView = Qu(this.state.doc, ci(this), sr(this), this.dom, this), this.domObserver = new kc(this, (r, u, i, o) => Tc(this, r, u, i, o)), this.domObserver.start(), Ka(this), this.updatePluginViews();
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
      for (let n in e)
        this._props[n] = e[n];
      this._props.state = this.state;
    }
    return this._props;
  }
  /**
  Update the view's props. Will immediately cause an update to
  the DOM.
  */
  update(e) {
    e.handleDOMEvents != this._props.handleDOMEvents && Pr(this);
    let n = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(pi), this.directPlugins = e.plugins), this.updateStateInner(e.state, n);
  }
  /**
  Update the view by updating existing props object with the object
  given as argument. Equivalent to `view.update(Object.assign({},
  view.props, props))`.
  */
  setProps(e) {
    let n = {};
    for (let r in this._props)
      n[r] = this._props[r];
    n.state = this.state;
    for (let r in e)
      n[r] = e[r];
    this.update(n);
  }
  /**
  Update the editor's `state` prop, without touching any of the
  other props.
  */
  updateState(e) {
    this.updateStateInner(e, this._props);
  }
  updateStateInner(e, n) {
    var r;
    let u = this.state, i = !1, o = !1;
    e.storedMarks && this.composing && (Go(this), o = !0), this.state = e;
    let s = u.plugins != e.plugins || this._props.plugins != n.plugins;
    if (s || this._props.plugins != n.plugins || this._props.nodeViews != n.nodeViews) {
      let p = hi(this);
      zc(p, this.nodeViews) && (this.nodeViews = p, i = !0);
    }
    (s || n.handleDOMEvents != this._props.handleDOMEvents) && Pr(this), this.editable = di(this), fi(this);
    let l = sr(this), a = ci(this), c = u.plugins != e.plugins && !u.doc.eq(e.doc) ? "reset" : e.scrollToSelection > u.scrollToSelection ? "to selection" : "preserve", f = i || !this.docView.matchesNode(e.doc, a, l);
    (f || !e.selection.eq(u.selection)) && (o = !0);
    let d = c == "preserve" && o && this.dom.style.overflowAnchor == null && ha(this);
    if (o) {
      this.domObserver.stop();
      let p = f && (X || W) && !this.composing && !u.selection.empty && !e.selection.empty && _c(u.selection, e.selection);
      if (f) {
        let h = W ? this.trackWrites = this.domSelectionRange().focusNode : null;
        this.composing && (this.input.compositionNode = fc(this)), (i || !this.docView.update(e.doc, a, l, this)) && (this.docView.updateOuterDeco(a), this.docView.destroy(), this.docView = Qu(e.doc, a, l, this.dom, this)), h && !this.trackWrites && (p = !0);
      }
      p || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && va(this)) ? Oe(this, p) : (Ro(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(u), !((r = this.dragging) === null || r === void 0) && r.node && !u.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, u), c == "reset" ? this.dom.scrollTop = 0 : c == "to selection" ? this.scrollToSelection() : d && pa(d);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!this.someProp("handleScrollToSelection", (n) => n(this)))
      if (this.state.selection instanceof N) {
        let n = this.docView.domAfterPos(this.state.selection.from);
        n.nodeType == 1 && Ru(this, n.getBoundingClientRect(), e);
      } else
        Ru(this, this.coordsAtPos(this.state.selection.head, 1), e);
  }
  destroyPluginViews() {
    let e;
    for (; e = this.pluginViews.pop(); )
      e.destroy && e.destroy();
  }
  updatePluginViews(e) {
    if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
      this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
      for (let n = 0; n < this.directPlugins.length; n++) {
        let r = this.directPlugins[n];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
      for (let n = 0; n < this.state.plugins.length; n++) {
        let r = this.state.plugins[n];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
    } else
      for (let n = 0; n < this.pluginViews.length; n++) {
        let r = this.pluginViews[n];
        r.update && r.update(this, e);
      }
  }
  updateDraggedNode(e, n) {
    let r = e.node, u = -1;
    if (this.state.doc.nodeAt(r.from) == r.node)
      u = r.from;
    else {
      let i = r.from + (this.state.doc.content.size - n.doc.content.size);
      (i > 0 && this.state.doc.nodeAt(i)) == r.node && (u = i);
    }
    this.dragging = new Xo(e.slice, e.move, u < 0 ? void 0 : N.create(this.state.doc, u));
  }
  someProp(e, n) {
    let r = this._props && this._props[e], u;
    if (r != null && (u = n ? n(r) : r))
      return u;
    for (let o = 0; o < this.directPlugins.length; o++) {
      let s = this.directPlugins[o].props[e];
      if (s != null && (u = n ? n(s) : s))
        return u;
    }
    let i = this.state.plugins;
    if (i)
      for (let o = 0; o < i.length; o++) {
        let s = i[o].props[e];
        if (s != null && (u = n ? n(s) : s))
          return u;
      }
  }
  /**
  Query whether the view has focus.
  */
  hasFocus() {
    if (X) {
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
    this.domObserver.stop(), this.editable && ma(this.dom), Oe(this), this.domObserver.start();
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
      for (let n = this.dom.parentNode; n; n = n.parentNode)
        if (n.nodeType == 9 || n.nodeType == 11 && n.host)
          return n.getSelection || (Object.getPrototypeOf(n).getSelection = () => n.ownerDocument.getSelection()), this._root = n;
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
    return ya(this, e);
  }
  /**
  Returns the viewport rectangle at a given document position.
  `left` and `right` will be the same number, as this returns a
  flat cursor-ish rectangle. If the position is between two things
  that aren't directly adjacent, `side` determines which element
  is used. When < 0, the element before the position is used,
  otherwise the element after.
  */
  coordsAtPos(e, n = 1) {
    return wo(this, e, n);
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
  domAtPos(e, n = 0) {
    return this.docView.domFromPos(e, n);
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
    let n = this.docView.descAt(e);
    return n ? n.nodeDOM : null;
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
  posAtDOM(e, n, r = -1) {
    let u = this.docView.posFromDOM(e, n, r);
    if (u == null)
      throw new RangeError("DOM position not inside the editor");
    return u;
  }
  /**
  Find out whether the selection is at the end of a textblock when
  moving in a given direction. When, for example, given `"left"`,
  it will return true if moving left from the current cursor
  position would leave that position's parent textblock. Will apply
  to the view's current state by default, but it is possible to
  pass a different state.
  */
  endOfTextblock(e, n) {
    return Aa(this, n || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, n) {
    return Zt(this, "", e, !1, n || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, n) {
    return Zt(this, e, null, !0, n || new ClipboardEvent("paste"));
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (Xa(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], sr(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null, ta());
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
    return tc(this, e);
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
    let n = this._props.dispatchTransaction;
    n ? n.call(this, e) : this.updateState(this.state.apply(e));
  }
  /**
  @internal
  */
  domSelectionRange() {
    let e = this.domSelection();
    return H && this.root.nodeType === 11 && oa(this.dom.ownerDocument) == this.dom && Nc(this, e) || e;
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
function ci(t) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(t.editable), t.someProp("attributes", (n) => {
    if (typeof n == "function" && (n = n(t.state)), n)
      for (let r in n)
        r == "class" ? e.class += " " + n[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + n[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(n[r]));
  }), e.translate || (e.translate = "no"), [le.node(0, t.state.doc.content.size, e)];
}
function fi(t) {
  if (t.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), t.cursorWrapper = { dom: e, deco: le.widget(t.state.selection.head, e, { raw: !0, marks: t.markCursor }) };
  } else
    t.cursorWrapper = null;
}
function di(t) {
  return !t.someProp("editable", (e) => e(t.state) === !1);
}
function _c(t, e) {
  let n = Math.min(t.$anchor.sharedDepth(t.head), e.$anchor.sharedDepth(e.head));
  return t.$anchor.start(n) != e.$anchor.start(n);
}
function hi(t) {
  let e = /* @__PURE__ */ Object.create(null);
  function n(r) {
    for (let u in r)
      Object.prototype.hasOwnProperty.call(e, u) || (e[u] = r[u]);
  }
  return t.someProp("nodeViews", n), t.someProp("markViews", n), e;
}
function zc(t, e) {
  let n = 0, r = 0;
  for (let u in t) {
    if (t[u] != e[u])
      return !0;
    n++;
  }
  for (let u in e)
    r++;
  return n != r;
}
function pi(t) {
  if (t.spec.state || t.spec.filterTransaction || t.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
const mi = {};
function jc(t) {
  let e = mi[t];
  if (e)
    return e;
  e = mi[t] = [];
  for (let n = 0; n < 128; n++) {
    const r = String.fromCharCode(n);
    e.push(r);
  }
  for (let n = 0; n < t.length; n++) {
    const r = t.charCodeAt(n);
    e[r] = "%" + ("0" + r.toString(16).toUpperCase()).slice(-2);
  }
  return e;
}
function Tt(t, e) {
  typeof e != "string" && (e = Tt.defaultChars);
  const n = jc(e);
  return t.replace(/(%[a-f0-9]{2})+/gi, function(r) {
    let u = "";
    for (let i = 0, o = r.length; i < o; i += 3) {
      const s = parseInt(r.slice(i + 1, i + 3), 16);
      if (s < 128) {
        u += n[s];
        continue;
      }
      if ((s & 224) === 192 && i + 3 < o) {
        const l = parseInt(r.slice(i + 4, i + 6), 16);
        if ((l & 192) === 128) {
          const a = s << 6 & 1984 | l & 63;
          a < 128 ? u += "��" : u += String.fromCharCode(a), i += 3;
          continue;
        }
      }
      if ((s & 240) === 224 && i + 6 < o) {
        const l = parseInt(r.slice(i + 4, i + 6), 16), a = parseInt(r.slice(i + 7, i + 9), 16);
        if ((l & 192) === 128 && (a & 192) === 128) {
          const c = s << 12 & 61440 | l << 6 & 4032 | a & 63;
          c < 2048 || c >= 55296 && c <= 57343 ? u += "���" : u += String.fromCharCode(c), i += 6;
          continue;
        }
      }
      if ((s & 248) === 240 && i + 9 < o) {
        const l = parseInt(r.slice(i + 4, i + 6), 16), a = parseInt(r.slice(i + 7, i + 9), 16), c = parseInt(r.slice(i + 10, i + 12), 16);
        if ((l & 192) === 128 && (a & 192) === 128 && (c & 192) === 128) {
          let f = s << 18 & 1835008 | l << 12 & 258048 | a << 6 & 4032 | c & 63;
          f < 65536 || f > 1114111 ? u += "����" : (f -= 65536, u += String.fromCharCode(55296 + (f >> 10), 56320 + (f & 1023))), i += 9;
          continue;
        }
      }
      u += "�";
    }
    return u;
  });
}
Tt.defaultChars = ";/?:@&=+$,#";
Tt.componentChars = "";
const gi = {};
function Lc(t) {
  let e = gi[t];
  if (e)
    return e;
  e = gi[t] = [];
  for (let n = 0; n < 128; n++) {
    const r = String.fromCharCode(n);
    /^[0-9a-z]$/i.test(r) ? e.push(r) : e.push("%" + ("0" + n.toString(16).toUpperCase()).slice(-2));
  }
  for (let n = 0; n < t.length; n++)
    e[t.charCodeAt(n)] = t[n];
  return e;
}
function an(t, e, n) {
  typeof e != "string" && (n = e, e = an.defaultChars), typeof n > "u" && (n = !0);
  const r = Lc(e);
  let u = "";
  for (let i = 0, o = t.length; i < o; i++) {
    const s = t.charCodeAt(i);
    if (n && s === 37 && i + 2 < o && /^[0-9a-f]{2}$/i.test(t.slice(i + 1, i + 3))) {
      u += t.slice(i, i + 3), i += 2;
      continue;
    }
    if (s < 128) {
      u += r[s];
      continue;
    }
    if (s >= 55296 && s <= 57343) {
      if (s >= 55296 && s <= 56319 && i + 1 < o) {
        const l = t.charCodeAt(i + 1);
        if (l >= 56320 && l <= 57343) {
          u += encodeURIComponent(t[i] + t[i + 1]), i++;
          continue;
        }
      }
      u += "%EF%BF%BD";
      continue;
    }
    u += encodeURIComponent(t[i]);
  }
  return u;
}
an.defaultChars = ";/?:@&=+$,-_.!~*'()#";
an.componentChars = "-_.!~*'()";
function lu(t) {
  let e = "";
  return e += t.protocol || "", e += t.slashes ? "//" : "", e += t.auth ? t.auth + "@" : "", t.hostname && t.hostname.indexOf(":") !== -1 ? e += "[" + t.hostname + "]" : e += t.hostname || "", e += t.port ? ":" + t.port : "", e += t.pathname || "", e += t.search || "", e += t.hash || "", e;
}
function zn() {
  this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
const Fc = /^([a-z0-9.+-]+:)/i, vc = /:[0-9]*$/, Rc = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, Bc = ["<", ">", '"', "`", " ", "\r", `
`, "	"], Pc = ["{", "}", "|", "\\", "^", "`"].concat(Bc), Uc = ["'"].concat(Pc), bi = ["%", "/", "?", ";", "#"].concat(Uc), xi = ["/", "?", "#"], qc = 255, Mi = /^[+a-z0-9A-Z_-]{0,63}$/, Vc = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, yi = {
  javascript: !0,
  "javascript:": !0
}, ki = {
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
function au(t, e) {
  if (t && t instanceof zn)
    return t;
  const n = new zn();
  return n.parse(t, e), n;
}
zn.prototype.parse = function(t, e) {
  let n, r, u, i = t;
  if (i = i.trim(), !e && t.split("#").length === 1) {
    const a = Rc.exec(i);
    if (a)
      return this.pathname = a[1], a[2] && (this.search = a[2]), this;
  }
  let o = Fc.exec(i);
  if (o && (o = o[0], n = o.toLowerCase(), this.protocol = o, i = i.substr(o.length)), (e || o || i.match(/^\/\/[^@\/]+@[^@\/]+/)) && (u = i.substr(0, 2) === "//", u && !(o && yi[o]) && (i = i.substr(2), this.slashes = !0)), !yi[o] && (u || o && !ki[o])) {
    let a = -1;
    for (let h = 0; h < xi.length; h++)
      r = i.indexOf(xi[h]), r !== -1 && (a === -1 || r < a) && (a = r);
    let c, f;
    a === -1 ? f = i.lastIndexOf("@") : f = i.lastIndexOf("@", a), f !== -1 && (c = i.slice(0, f), i = i.slice(f + 1), this.auth = c), a = -1;
    for (let h = 0; h < bi.length; h++)
      r = i.indexOf(bi[h]), r !== -1 && (a === -1 || r < a) && (a = r);
    a === -1 && (a = i.length), i[a - 1] === ":" && a--;
    const d = i.slice(0, a);
    i = i.slice(a), this.parseHost(d), this.hostname = this.hostname || "";
    const p = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!p) {
      const h = this.hostname.split(/\./);
      for (let m = 0, g = h.length; m < g; m++) {
        const b = h[m];
        if (b && !b.match(Mi)) {
          let y = "";
          for (let D = 0, k = b.length; D < k; D++)
            b.charCodeAt(D) > 127 ? y += "x" : y += b[D];
          if (!y.match(Mi)) {
            const D = h.slice(0, m), k = h.slice(m + 1), C = b.match(Vc);
            C && (D.push(C[1]), k.unshift(C[2])), k.length && (i = k.join(".") + i), this.hostname = D.join(".");
            break;
          }
        }
      }
    }
    this.hostname.length > qc && (this.hostname = ""), p && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
  }
  const s = i.indexOf("#");
  s !== -1 && (this.hash = i.substr(s), i = i.slice(0, s));
  const l = i.indexOf("?");
  return l !== -1 && (this.search = i.substr(l), i = i.slice(0, l)), i && (this.pathname = i), ki[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
};
zn.prototype.parseHost = function(t) {
  let e = vc.exec(t);
  e && (e = e[0], e !== ":" && (this.port = e.substr(1)), t = t.substr(0, t.length - e.length)), t && (this.hostname = t);
};
const Qc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: Tt,
  encode: an,
  format: lu,
  parse: au
}, Symbol.toStringTag, { value: "Module" })), us = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, is = /[\0-\x1F\x7F-\x9F]/, $c = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, cu = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1B7D\u1B7E\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDEAD\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, ss = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2426\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E3\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBC2\uFD40-\uFD4F\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED7\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDF76\uDF7B-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0\uDCB1\uDD00-\uDE53\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE88\uDE90-\uDEBD\uDEBF-\uDEC5\uDECE-\uDEDB\uDEE0-\uDEE8\uDEF0-\uDEF8\uDF00-\uDF92\uDF94-\uDFCA]/, ls = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, Yc = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any: us,
  Cc: is,
  Cf: $c,
  P: cu,
  S: ss,
  Z: ls
}, Symbol.toStringTag, { value: "Module" })), Wc = new Uint16Array(
  // prettier-ignore
  'ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻 ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌'.split("").map((t) => t.charCodeAt(0))
), Hc = new Uint16Array(
  // prettier-ignore
  "Ȁaglq	\x1Bɭ\0\0p;䀦os;䀧t;䀾t;䀼uot;䀢".split("").map((t) => t.charCodeAt(0))
);
var ar;
const Jc = /* @__PURE__ */ new Map([
  [0, 65533],
  // C1 Unicode control character reference replacements
  [128, 8364],
  [130, 8218],
  [131, 402],
  [132, 8222],
  [133, 8230],
  [134, 8224],
  [135, 8225],
  [136, 710],
  [137, 8240],
  [138, 352],
  [139, 8249],
  [140, 338],
  [142, 381],
  [145, 8216],
  [146, 8217],
  [147, 8220],
  [148, 8221],
  [149, 8226],
  [150, 8211],
  [151, 8212],
  [152, 732],
  [153, 8482],
  [154, 353],
  [155, 8250],
  [156, 339],
  [158, 382],
  [159, 376]
]), Zc = (
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, node/no-unsupported-features/es-builtins
  (ar = String.fromCodePoint) !== null && ar !== void 0 ? ar : function(t) {
    let e = "";
    return t > 65535 && (t -= 65536, e += String.fromCharCode(t >>> 10 & 1023 | 55296), t = 56320 | t & 1023), e += String.fromCharCode(t), e;
  }
);
function Gc(t) {
  var e;
  return t >= 55296 && t <= 57343 || t > 1114111 ? 65533 : (e = Jc.get(t)) !== null && e !== void 0 ? e : t;
}
var v;
(function(t) {
  t[t.NUM = 35] = "NUM", t[t.SEMI = 59] = "SEMI", t[t.EQUALS = 61] = "EQUALS", t[t.ZERO = 48] = "ZERO", t[t.NINE = 57] = "NINE", t[t.LOWER_A = 97] = "LOWER_A", t[t.LOWER_F = 102] = "LOWER_F", t[t.LOWER_X = 120] = "LOWER_X", t[t.LOWER_Z = 122] = "LOWER_Z", t[t.UPPER_A = 65] = "UPPER_A", t[t.UPPER_F = 70] = "UPPER_F", t[t.UPPER_Z = 90] = "UPPER_Z";
})(v || (v = {}));
const Kc = 32;
var Ve;
(function(t) {
  t[t.VALUE_LENGTH = 49152] = "VALUE_LENGTH", t[t.BRANCH_LENGTH = 16256] = "BRANCH_LENGTH", t[t.JUMP_TABLE = 127] = "JUMP_TABLE";
})(Ve || (Ve = {}));
function Ur(t) {
  return t >= v.ZERO && t <= v.NINE;
}
function Xc(t) {
  return t >= v.UPPER_A && t <= v.UPPER_F || t >= v.LOWER_A && t <= v.LOWER_F;
}
function e0(t) {
  return t >= v.UPPER_A && t <= v.UPPER_Z || t >= v.LOWER_A && t <= v.LOWER_Z || Ur(t);
}
function t0(t) {
  return t === v.EQUALS || e0(t);
}
var L;
(function(t) {
  t[t.EntityStart = 0] = "EntityStart", t[t.NumericStart = 1] = "NumericStart", t[t.NumericDecimal = 2] = "NumericDecimal", t[t.NumericHex = 3] = "NumericHex", t[t.NamedEntity = 4] = "NamedEntity";
})(L || (L = {}));
var Be;
(function(t) {
  t[t.Legacy = 0] = "Legacy", t[t.Strict = 1] = "Strict", t[t.Attribute = 2] = "Attribute";
})(Be || (Be = {}));
class n0 {
  constructor(e, n, r) {
    this.decodeTree = e, this.emitCodePoint = n, this.errors = r, this.state = L.EntityStart, this.consumed = 1, this.result = 0, this.treeIndex = 0, this.excess = 1, this.decodeMode = Be.Strict;
  }
  /** Resets the instance to make it reusable. */
  startEntity(e) {
    this.decodeMode = e, this.state = L.EntityStart, this.result = 0, this.treeIndex = 0, this.excess = 1, this.consumed = 1;
  }
  /**
   * Write an entity to the decoder. This can be called multiple times with partial entities.
   * If the entity is incomplete, the decoder will return -1.
   *
   * Mirrors the implementation of `getDecoder`, but with the ability to stop decoding if the
   * entity is incomplete, and resume when the next string is written.
   *
   * @param string The string containing the entity (or a continuation of the entity).
   * @param offset The offset at which the entity begins. Should be 0 if this is not the first call.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  write(e, n) {
    switch (this.state) {
      case L.EntityStart:
        return e.charCodeAt(n) === v.NUM ? (this.state = L.NumericStart, this.consumed += 1, this.stateNumericStart(e, n + 1)) : (this.state = L.NamedEntity, this.stateNamedEntity(e, n));
      case L.NumericStart:
        return this.stateNumericStart(e, n);
      case L.NumericDecimal:
        return this.stateNumericDecimal(e, n);
      case L.NumericHex:
        return this.stateNumericHex(e, n);
      case L.NamedEntity:
        return this.stateNamedEntity(e, n);
    }
  }
  /**
   * Switches between the numeric decimal and hexadecimal states.
   *
   * Equivalent to the `Numeric character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericStart(e, n) {
    return n >= e.length ? -1 : (e.charCodeAt(n) | Kc) === v.LOWER_X ? (this.state = L.NumericHex, this.consumed += 1, this.stateNumericHex(e, n + 1)) : (this.state = L.NumericDecimal, this.stateNumericDecimal(e, n));
  }
  addToNumericResult(e, n, r, u) {
    if (n !== r) {
      const i = r - n;
      this.result = this.result * Math.pow(u, i) + parseInt(e.substr(n, i), u), this.consumed += i;
    }
  }
  /**
   * Parses a hexadecimal numeric entity.
   *
   * Equivalent to the `Hexademical character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericHex(e, n) {
    const r = n;
    for (; n < e.length; ) {
      const u = e.charCodeAt(n);
      if (Ur(u) || Xc(u))
        n += 1;
      else
        return this.addToNumericResult(e, r, n, 16), this.emitNumericEntity(u, 3);
    }
    return this.addToNumericResult(e, r, n, 16), -1;
  }
  /**
   * Parses a decimal numeric entity.
   *
   * Equivalent to the `Decimal character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNumericDecimal(e, n) {
    const r = n;
    for (; n < e.length; ) {
      const u = e.charCodeAt(n);
      if (Ur(u))
        n += 1;
      else
        return this.addToNumericResult(e, r, n, 10), this.emitNumericEntity(u, 2);
    }
    return this.addToNumericResult(e, r, n, 10), -1;
  }
  /**
   * Validate and emit a numeric entity.
   *
   * Implements the logic from the `Hexademical character reference start
   * state` and `Numeric character reference end state` in the HTML spec.
   *
   * @param lastCp The last code point of the entity. Used to see if the
   *               entity was terminated with a semicolon.
   * @param expectedLength The minimum number of characters that should be
   *                       consumed. Used to validate that at least one digit
   *                       was consumed.
   * @returns The number of characters that were consumed.
   */
  emitNumericEntity(e, n) {
    var r;
    if (this.consumed <= n)
      return (r = this.errors) === null || r === void 0 || r.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
    if (e === v.SEMI)
      this.consumed += 1;
    else if (this.decodeMode === Be.Strict)
      return 0;
    return this.emitCodePoint(Gc(this.result), this.consumed), this.errors && (e !== v.SEMI && this.errors.missingSemicolonAfterCharacterReference(), this.errors.validateNumericCharacterReference(this.result)), this.consumed;
  }
  /**
   * Parses a named entity.
   *
   * Equivalent to the `Named character reference state` in the HTML spec.
   *
   * @param str The string containing the entity (or a continuation of the entity).
   * @param offset The current offset.
   * @returns The number of characters that were consumed, or -1 if the entity is incomplete.
   */
  stateNamedEntity(e, n) {
    const { decodeTree: r } = this;
    let u = r[this.treeIndex], i = (u & Ve.VALUE_LENGTH) >> 14;
    for (; n < e.length; n++, this.excess++) {
      const o = e.charCodeAt(n);
      if (this.treeIndex = r0(r, u, this.treeIndex + Math.max(1, i), o), this.treeIndex < 0)
        return this.result === 0 || // If we are parsing an attribute
        this.decodeMode === Be.Attribute && // We shouldn't have consumed any characters after the entity,
        (i === 0 || // And there should be no invalid characters.
        t0(o)) ? 0 : this.emitNotTerminatedNamedEntity();
      if (u = r[this.treeIndex], i = (u & Ve.VALUE_LENGTH) >> 14, i !== 0) {
        if (o === v.SEMI)
          return this.emitNamedEntityData(this.treeIndex, i, this.consumed + this.excess);
        this.decodeMode !== Be.Strict && (this.result = this.treeIndex, this.consumed += this.excess, this.excess = 0);
      }
    }
    return -1;
  }
  /**
   * Emit a named entity that was not terminated with a semicolon.
   *
   * @returns The number of characters consumed.
   */
  emitNotTerminatedNamedEntity() {
    var e;
    const { result: n, decodeTree: r } = this, u = (r[n] & Ve.VALUE_LENGTH) >> 14;
    return this.emitNamedEntityData(n, u, this.consumed), (e = this.errors) === null || e === void 0 || e.missingSemicolonAfterCharacterReference(), this.consumed;
  }
  /**
   * Emit a named entity.
   *
   * @param result The index of the entity in the decode tree.
   * @param valueLength The number of bytes in the entity.
   * @param consumed The number of characters consumed.
   *
   * @returns The number of characters consumed.
   */
  emitNamedEntityData(e, n, r) {
    const { decodeTree: u } = this;
    return this.emitCodePoint(n === 1 ? u[e] & ~Ve.VALUE_LENGTH : u[e + 1], r), n === 3 && this.emitCodePoint(u[e + 2], r), r;
  }
  /**
   * Signal to the parser that the end of the input was reached.
   *
   * Remaining data will be emitted and relevant errors will be produced.
   *
   * @returns The number of characters consumed.
   */
  end() {
    var e;
    switch (this.state) {
      case L.NamedEntity:
        return this.result !== 0 && (this.decodeMode !== Be.Attribute || this.result === this.treeIndex) ? this.emitNotTerminatedNamedEntity() : 0;
      case L.NumericDecimal:
        return this.emitNumericEntity(0, 2);
      case L.NumericHex:
        return this.emitNumericEntity(0, 3);
      case L.NumericStart:
        return (e = this.errors) === null || e === void 0 || e.absenceOfDigitsInNumericCharacterReference(this.consumed), 0;
      case L.EntityStart:
        return 0;
    }
  }
}
function as(t) {
  let e = "";
  const n = new n0(t, (r) => e += Zc(r));
  return function(u, i) {
    let o = 0, s = 0;
    for (; (s = u.indexOf("&", s)) >= 0; ) {
      e += u.slice(o, s), n.startEntity(i);
      const a = n.write(
        u,
        // Skip the "&"
        s + 1
      );
      if (a < 0) {
        o = s + n.end();
        break;
      }
      o = s + a, s = a === 0 ? o + 1 : o;
    }
    const l = e + u.slice(o);
    return e = "", l;
  };
}
function r0(t, e, n, r) {
  const u = (e & Ve.BRANCH_LENGTH) >> 7, i = e & Ve.JUMP_TABLE;
  if (u === 0)
    return i !== 0 && r === i ? n : -1;
  if (i) {
    const l = r - i;
    return l < 0 || l >= u ? -1 : t[n + l] - 1;
  }
  let o = n, s = o + u - 1;
  for (; o <= s; ) {
    const l = o + s >>> 1, a = t[l];
    if (a < r)
      o = l + 1;
    else if (a > r)
      s = l - 1;
    else
      return t[l + u];
  }
  return -1;
}
const u0 = as(Wc);
as(Hc);
function cs(t, e = Be.Legacy) {
  return u0(t, e);
}
function i0(t) {
  return Object.prototype.toString.call(t);
}
function fu(t) {
  return i0(t) === "[object String]";
}
const o0 = Object.prototype.hasOwnProperty;
function s0(t, e) {
  return o0.call(t, e);
}
function Vn(t) {
  return Array.prototype.slice.call(arguments, 1).forEach(function(n) {
    if (n) {
      if (typeof n != "object")
        throw new TypeError(n + "must be object");
      Object.keys(n).forEach(function(r) {
        t[r] = n[r];
      });
    }
  }), t;
}
function fs(t, e, n) {
  return [].concat(t.slice(0, e), n, t.slice(e + 1));
}
function du(t) {
  return !(t >= 55296 && t <= 57343 || t >= 64976 && t <= 65007 || (t & 65535) === 65535 || (t & 65535) === 65534 || t >= 0 && t <= 8 || t === 11 || t >= 14 && t <= 31 || t >= 127 && t <= 159 || t > 1114111);
}
function jn(t) {
  if (t > 65535) {
    t -= 65536;
    const e = 55296 + (t >> 10), n = 56320 + (t & 1023);
    return String.fromCharCode(e, n);
  }
  return String.fromCharCode(t);
}
const ds = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, l0 = /&([a-z#][a-z0-9]{1,31});/gi, a0 = new RegExp(ds.source + "|" + l0.source, "gi"), c0 = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function f0(t, e) {
  if (e.charCodeAt(0) === 35 && c0.test(e)) {
    const r = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
    return du(r) ? jn(r) : t;
  }
  const n = cs(t);
  return n !== t ? n : t;
}
function d0(t) {
  return t.indexOf("\\") < 0 ? t : t.replace(ds, "$1");
}
function It(t) {
  return t.indexOf("\\") < 0 && t.indexOf("&") < 0 ? t : t.replace(a0, function(e, n, r) {
    return n || f0(e, r);
  });
}
const h0 = /[&<>"]/, p0 = /[&<>"]/g, m0 = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function g0(t) {
  return m0[t];
}
function We(t) {
  return h0.test(t) ? t.replace(p0, g0) : t;
}
const b0 = /[.?*+^$[\]\\(){}|-]/g;
function x0(t) {
  return t.replace(b0, "\\$&");
}
function w(t) {
  switch (t) {
    case 9:
    case 32:
      return !0;
  }
  return !1;
}
function Kt(t) {
  if (t >= 8192 && t <= 8202)
    return !0;
  switch (t) {
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
function Xt(t) {
  return cu.test(t) || ss.test(t);
}
function en(t) {
  switch (t) {
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
function Qn(t) {
  return t = t.trim().replace(/\s+/g, " "), "ẞ".toLowerCase() === "Ṿ" && (t = t.replace(/ẞ/g, "ß")), t.toLowerCase().toUpperCase();
}
const M0 = { mdurl: Qc, ucmicro: Yc }, y0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  arrayReplaceAt: fs,
  assign: Vn,
  escapeHtml: We,
  escapeRE: x0,
  fromCodePoint: jn,
  has: s0,
  isMdAsciiPunct: en,
  isPunctChar: Xt,
  isSpace: w,
  isString: fu,
  isValidEntityCode: du,
  isWhiteSpace: Kt,
  lib: M0,
  normalizeReference: Qn,
  unescapeAll: It,
  unescapeMd: d0
}, Symbol.toStringTag, { value: "Module" }));
function k0(t, e, n) {
  let r, u, i, o;
  const s = t.posMax, l = t.pos;
  for (t.pos = e + 1, r = 1; t.pos < s; ) {
    if (i = t.src.charCodeAt(t.pos), i === 93 && (r--, r === 0)) {
      u = !0;
      break;
    }
    if (o = t.pos, t.md.inline.skipToken(t), i === 91) {
      if (o === t.pos - 1)
        r++;
      else if (n)
        return t.pos = l, -1;
    }
  }
  let a = -1;
  return u && (a = t.pos), t.pos = l, a;
}
function D0(t, e, n) {
  let r, u = e;
  const i = {
    ok: !1,
    pos: 0,
    str: ""
  };
  if (t.charCodeAt(u) === 60) {
    for (u++; u < n; ) {
      if (r = t.charCodeAt(u), r === 10 || r === 60)
        return i;
      if (r === 62)
        return i.pos = u + 1, i.str = It(t.slice(e + 1, u)), i.ok = !0, i;
      if (r === 92 && u + 1 < n) {
        u += 2;
        continue;
      }
      u++;
    }
    return i;
  }
  let o = 0;
  for (; u < n && (r = t.charCodeAt(u), !(r === 32 || r < 32 || r === 127)); ) {
    if (r === 92 && u + 1 < n) {
      if (t.charCodeAt(u + 1) === 32)
        break;
      u += 2;
      continue;
    }
    if (r === 40 && (o++, o > 32))
      return i;
    if (r === 41) {
      if (o === 0)
        break;
      o--;
    }
    u++;
  }
  return e === u || o !== 0 || (i.str = It(t.slice(e, u)), i.pos = u, i.ok = !0), i;
}
function N0(t, e, n, r) {
  let u, i = e;
  const o = {
    // if `true`, this is a valid link title
    ok: !1,
    // if `true`, this link can be continued on the next line
    can_continue: !1,
    // if `ok`, it's the position of the first character after the closing marker
    pos: 0,
    // if `ok`, it's the unescaped title
    str: "",
    // expected closing marker character code
    marker: 0
  };
  if (r)
    o.str = r.str, o.marker = r.marker;
  else {
    if (i >= n)
      return o;
    let s = t.charCodeAt(i);
    if (s !== 34 && s !== 39 && s !== 40)
      return o;
    e++, i++, s === 40 && (s = 41), o.marker = s;
  }
  for (; i < n; ) {
    if (u = t.charCodeAt(i), u === o.marker)
      return o.pos = i + 1, o.str += It(t.slice(e, i)), o.ok = !0, o;
    if (u === 40 && o.marker === 41)
      return o;
    u === 92 && i + 1 < n && i++, i++;
  }
  return o.can_continue = !0, o.str += It(t.slice(e, i)), o;
}
const C0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  parseLinkDestination: D0,
  parseLinkLabel: k0,
  parseLinkTitle: N0
}, Symbol.toStringTag, { value: "Module" })), Ce = {};
Ce.code_inline = function(t, e, n, r, u) {
  const i = t[e];
  return "<code" + u.renderAttrs(i) + ">" + We(i.content) + "</code>";
};
Ce.code_block = function(t, e, n, r, u) {
  const i = t[e];
  return "<pre" + u.renderAttrs(i) + "><code>" + We(t[e].content) + `</code></pre>
`;
};
Ce.fence = function(t, e, n, r, u) {
  const i = t[e], o = i.info ? It(i.info).trim() : "";
  let s = "", l = "";
  if (o) {
    const c = o.split(/(\s+)/g);
    s = c[0], l = c.slice(2).join("");
  }
  let a;
  if (n.highlight ? a = n.highlight(i.content, s, l) || We(i.content) : a = We(i.content), a.indexOf("<pre") === 0)
    return a + `
`;
  if (o) {
    const c = i.attrIndex("class"), f = i.attrs ? i.attrs.slice() : [];
    c < 0 ? f.push(["class", n.langPrefix + s]) : (f[c] = f[c].slice(), f[c][1] += " " + n.langPrefix + s);
    const d = {
      attrs: f
    };
    return `<pre><code${u.renderAttrs(d)}>${a}</code></pre>
`;
  }
  return `<pre><code${u.renderAttrs(i)}>${a}</code></pre>
`;
};
Ce.image = function(t, e, n, r, u) {
  const i = t[e];
  return i.attrs[i.attrIndex("alt")][1] = u.renderInlineAsText(i.children, n, r), u.renderToken(t, e, n);
};
Ce.hardbreak = function(t, e, n) {
  return n.xhtmlOut ? `<br />
` : `<br>
`;
};
Ce.softbreak = function(t, e, n) {
  return n.breaks ? n.xhtmlOut ? `<br />
` : `<br>
` : `
`;
};
Ce.text = function(t, e) {
  return We(t[e].content);
};
Ce.html_block = function(t, e) {
  return t[e].content;
};
Ce.html_inline = function(t, e) {
  return t[e].content;
};
function zt() {
  this.rules = Vn({}, Ce);
}
zt.prototype.renderAttrs = function(e) {
  let n, r, u;
  if (!e.attrs)
    return "";
  for (u = "", n = 0, r = e.attrs.length; n < r; n++)
    u += " " + We(e.attrs[n][0]) + '="' + We(e.attrs[n][1]) + '"';
  return u;
};
zt.prototype.renderToken = function(e, n, r) {
  const u = e[n];
  let i = "";
  if (u.hidden)
    return "";
  u.block && u.nesting !== -1 && n && e[n - 1].hidden && (i += `
`), i += (u.nesting === -1 ? "</" : "<") + u.tag, i += this.renderAttrs(u), u.nesting === 0 && r.xhtmlOut && (i += " /");
  let o = !1;
  if (u.block && (o = !0, u.nesting === 1 && n + 1 < e.length)) {
    const s = e[n + 1];
    (s.type === "inline" || s.hidden || s.nesting === -1 && s.tag === u.tag) && (o = !1);
  }
  return i += o ? `>
` : ">", i;
};
zt.prototype.renderInline = function(t, e, n) {
  let r = "";
  const u = this.rules;
  for (let i = 0, o = t.length; i < o; i++) {
    const s = t[i].type;
    typeof u[s] < "u" ? r += u[s](t, i, e, n, this) : r += this.renderToken(t, i, e);
  }
  return r;
};
zt.prototype.renderInlineAsText = function(t, e, n) {
  let r = "";
  for (let u = 0, i = t.length; u < i; u++)
    switch (t[u].type) {
      case "text":
        r += t[u].content;
        break;
      case "image":
        r += this.renderInlineAsText(t[u].children, e, n);
        break;
      case "html_inline":
      case "html_block":
        r += t[u].content;
        break;
      case "softbreak":
      case "hardbreak":
        r += `
`;
        break;
    }
  return r;
};
zt.prototype.render = function(t, e, n) {
  let r = "";
  const u = this.rules;
  for (let i = 0, o = t.length; i < o; i++) {
    const s = t[i].type;
    s === "inline" ? r += this.renderInline(t[i].children, e, n) : typeof u[s] < "u" ? r += u[s](t, i, e, n, this) : r += this.renderToken(t, i, e, n);
  }
  return r;
};
function ee() {
  this.__rules__ = [], this.__cache__ = null;
}
ee.prototype.__find__ = function(t) {
  for (let e = 0; e < this.__rules__.length; e++)
    if (this.__rules__[e].name === t)
      return e;
  return -1;
};
ee.prototype.__compile__ = function() {
  const t = this, e = [""];
  t.__rules__.forEach(function(n) {
    n.enabled && n.alt.forEach(function(r) {
      e.indexOf(r) < 0 && e.push(r);
    });
  }), t.__cache__ = {}, e.forEach(function(n) {
    t.__cache__[n] = [], t.__rules__.forEach(function(r) {
      r.enabled && (n && r.alt.indexOf(n) < 0 || t.__cache__[n].push(r.fn));
    });
  });
};
ee.prototype.at = function(t, e, n) {
  const r = this.__find__(t), u = n || {};
  if (r === -1)
    throw new Error("Parser rule not found: " + t);
  this.__rules__[r].fn = e, this.__rules__[r].alt = u.alt || [], this.__cache__ = null;
};
ee.prototype.before = function(t, e, n, r) {
  const u = this.__find__(t), i = r || {};
  if (u === -1)
    throw new Error("Parser rule not found: " + t);
  this.__rules__.splice(u, 0, {
    name: e,
    enabled: !0,
    fn: n,
    alt: i.alt || []
  }), this.__cache__ = null;
};
ee.prototype.after = function(t, e, n, r) {
  const u = this.__find__(t), i = r || {};
  if (u === -1)
    throw new Error("Parser rule not found: " + t);
  this.__rules__.splice(u + 1, 0, {
    name: e,
    enabled: !0,
    fn: n,
    alt: i.alt || []
  }), this.__cache__ = null;
};
ee.prototype.push = function(t, e, n) {
  const r = n || {};
  this.__rules__.push({
    name: t,
    enabled: !0,
    fn: e,
    alt: r.alt || []
  }), this.__cache__ = null;
};
ee.prototype.enable = function(t, e) {
  Array.isArray(t) || (t = [t]);
  const n = [];
  return t.forEach(function(r) {
    const u = this.__find__(r);
    if (u < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + r);
    }
    this.__rules__[u].enabled = !0, n.push(r);
  }, this), this.__cache__ = null, n;
};
ee.prototype.enableOnly = function(t, e) {
  Array.isArray(t) || (t = [t]), this.__rules__.forEach(function(n) {
    n.enabled = !1;
  }), this.enable(t, e);
};
ee.prototype.disable = function(t, e) {
  Array.isArray(t) || (t = [t]);
  const n = [];
  return t.forEach(function(r) {
    const u = this.__find__(r);
    if (u < 0) {
      if (e)
        return;
      throw new Error("Rules manager: invalid rule name " + r);
    }
    this.__rules__[u].enabled = !1, n.push(r);
  }, this), this.__cache__ = null, n;
};
ee.prototype.getRules = function(t) {
  return this.__cache__ === null && this.__compile__(), this.__cache__[t] || [];
};
function me(t, e, n) {
  this.type = t, this.tag = e, this.attrs = null, this.map = null, this.nesting = n, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
me.prototype.attrIndex = function(e) {
  if (!this.attrs)
    return -1;
  const n = this.attrs;
  for (let r = 0, u = n.length; r < u; r++)
    if (n[r][0] === e)
      return r;
  return -1;
};
me.prototype.attrPush = function(e) {
  this.attrs ? this.attrs.push(e) : this.attrs = [e];
};
me.prototype.attrSet = function(e, n) {
  const r = this.attrIndex(e), u = [e, n];
  r < 0 ? this.attrPush(u) : this.attrs[r] = u;
};
me.prototype.attrGet = function(e) {
  const n = this.attrIndex(e);
  let r = null;
  return n >= 0 && (r = this.attrs[n][1]), r;
};
me.prototype.attrJoin = function(e, n) {
  const r = this.attrIndex(e);
  r < 0 ? this.attrPush([e, n]) : this.attrs[r][1] = this.attrs[r][1] + " " + n;
};
function hs(t, e, n) {
  this.src = t, this.env = n, this.tokens = [], this.inlineMode = !1, this.md = e;
}
hs.prototype.Token = me;
const A0 = /\r\n?|\n/g, E0 = /\0/g;
function T0(t) {
  let e;
  e = t.src.replace(A0, `
`), e = e.replace(E0, "�"), t.src = e;
}
function I0(t) {
  let e;
  t.inlineMode ? (e = new t.Token("inline", "", 0), e.content = t.src, e.map = [0, 1], e.children = [], t.tokens.push(e)) : t.md.block.parse(t.src, t.md, t.env, t.tokens);
}
function S0(t) {
  const e = t.tokens;
  for (let n = 0, r = e.length; n < r; n++) {
    const u = e[n];
    u.type === "inline" && t.md.inline.parse(u.content, t.md, t.env, u.children);
  }
}
function w0(t) {
  return /^<a[>\s]/i.test(t);
}
function O0(t) {
  return /^<\/a\s*>/i.test(t);
}
function _0(t) {
  const e = t.tokens;
  if (t.md.options.linkify)
    for (let n = 0, r = e.length; n < r; n++) {
      if (e[n].type !== "inline" || !t.md.linkify.pretest(e[n].content))
        continue;
      let u = e[n].children, i = 0;
      for (let o = u.length - 1; o >= 0; o--) {
        const s = u[o];
        if (s.type === "link_close") {
          for (o--; u[o].level !== s.level && u[o].type !== "link_open"; )
            o--;
          continue;
        }
        if (s.type === "html_inline" && (w0(s.content) && i > 0 && i--, O0(s.content) && i++), !(i > 0) && s.type === "text" && t.md.linkify.test(s.content)) {
          const l = s.content;
          let a = t.md.linkify.match(l);
          const c = [];
          let f = s.level, d = 0;
          a.length > 0 && a[0].index === 0 && o > 0 && u[o - 1].type === "text_special" && (a = a.slice(1));
          for (let p = 0; p < a.length; p++) {
            const h = a[p].url, m = t.md.normalizeLink(h);
            if (!t.md.validateLink(m))
              continue;
            let g = a[p].text;
            a[p].schema ? a[p].schema === "mailto:" && !/^mailto:/i.test(g) ? g = t.md.normalizeLinkText("mailto:" + g).replace(/^mailto:/, "") : g = t.md.normalizeLinkText(g) : g = t.md.normalizeLinkText("http://" + g).replace(/^http:\/\//, "");
            const b = a[p].index;
            if (b > d) {
              const C = new t.Token("text", "", 0);
              C.content = l.slice(d, b), C.level = f, c.push(C);
            }
            const y = new t.Token("link_open", "a", 1);
            y.attrs = [["href", m]], y.level = f++, y.markup = "linkify", y.info = "auto", c.push(y);
            const D = new t.Token("text", "", 0);
            D.content = g, D.level = f, c.push(D);
            const k = new t.Token("link_close", "a", -1);
            k.level = --f, k.markup = "linkify", k.info = "auto", c.push(k), d = a[p].lastIndex;
          }
          if (d < l.length) {
            const p = new t.Token("text", "", 0);
            p.content = l.slice(d), p.level = f, c.push(p);
          }
          e[n].children = u = fs(u, o, c);
        }
      }
    }
}
const ps = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, z0 = /\((c|tm|r)\)/i, j0 = /\((c|tm|r)\)/ig, L0 = {
  c: "©",
  r: "®",
  tm: "™"
};
function F0(t, e) {
  return L0[e.toLowerCase()];
}
function v0(t) {
  let e = 0;
  for (let n = t.length - 1; n >= 0; n--) {
    const r = t[n];
    r.type === "text" && !e && (r.content = r.content.replace(j0, F0)), r.type === "link_open" && r.info === "auto" && e--, r.type === "link_close" && r.info === "auto" && e++;
  }
}
function R0(t) {
  let e = 0;
  for (let n = t.length - 1; n >= 0; n--) {
    const r = t[n];
    r.type === "text" && !e && ps.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–")), r.type === "link_open" && r.info === "auto" && e--, r.type === "link_close" && r.info === "auto" && e++;
  }
}
function B0(t) {
  let e;
  if (t.md.options.typographer)
    for (e = t.tokens.length - 1; e >= 0; e--)
      t.tokens[e].type === "inline" && (z0.test(t.tokens[e].content) && v0(t.tokens[e].children), ps.test(t.tokens[e].content) && R0(t.tokens[e].children));
}
const P0 = /['"]/, Di = /['"]/g, Ni = "’";
function mn(t, e, n) {
  return t.slice(0, e) + n + t.slice(e + 1);
}
function U0(t, e) {
  let n;
  const r = [];
  for (let u = 0; u < t.length; u++) {
    const i = t[u], o = t[u].level;
    for (n = r.length - 1; n >= 0 && !(r[n].level <= o); n--)
      ;
    if (r.length = n + 1, i.type !== "text")
      continue;
    let s = i.content, l = 0, a = s.length;
    e:
      for (; l < a; ) {
        Di.lastIndex = l;
        const c = Di.exec(s);
        if (!c)
          break;
        let f = !0, d = !0;
        l = c.index + 1;
        const p = c[0] === "'";
        let h = 32;
        if (c.index - 1 >= 0)
          h = s.charCodeAt(c.index - 1);
        else
          for (n = u - 1; n >= 0 && !(t[n].type === "softbreak" || t[n].type === "hardbreak"); n--)
            if (t[n].content) {
              h = t[n].content.charCodeAt(t[n].content.length - 1);
              break;
            }
        let m = 32;
        if (l < a)
          m = s.charCodeAt(l);
        else
          for (n = u + 1; n < t.length && !(t[n].type === "softbreak" || t[n].type === "hardbreak"); n++)
            if (t[n].content) {
              m = t[n].content.charCodeAt(0);
              break;
            }
        const g = en(h) || Xt(String.fromCharCode(h)), b = en(m) || Xt(String.fromCharCode(m)), y = Kt(h), D = Kt(m);
        if (D ? f = !1 : b && (y || g || (f = !1)), y ? d = !1 : g && (D || b || (d = !1)), m === 34 && c[0] === '"' && h >= 48 && h <= 57 && (d = f = !1), f && d && (f = g, d = b), !f && !d) {
          p && (i.content = mn(i.content, c.index, Ni));
          continue;
        }
        if (d)
          for (n = r.length - 1; n >= 0; n--) {
            let k = r[n];
            if (r[n].level < o)
              break;
            if (k.single === p && r[n].level === o) {
              k = r[n];
              let C, A;
              p ? (C = e.md.options.quotes[2], A = e.md.options.quotes[3]) : (C = e.md.options.quotes[0], A = e.md.options.quotes[1]), i.content = mn(i.content, c.index, A), t[k.token].content = mn(
                t[k.token].content,
                k.pos,
                C
              ), l += A.length - 1, k.token === u && (l += C.length - 1), s = i.content, a = s.length, r.length = n;
              continue e;
            }
          }
        f ? r.push({
          token: u,
          pos: c.index,
          single: p,
          level: o
        }) : d && p && (i.content = mn(i.content, c.index, Ni));
      }
  }
}
function q0(t) {
  if (t.md.options.typographer)
    for (let e = t.tokens.length - 1; e >= 0; e--)
      t.tokens[e].type !== "inline" || !P0.test(t.tokens[e].content) || U0(t.tokens[e].children, t);
}
function V0(t) {
  let e, n;
  const r = t.tokens, u = r.length;
  for (let i = 0; i < u; i++) {
    if (r[i].type !== "inline")
      continue;
    const o = r[i].children, s = o.length;
    for (e = 0; e < s; e++)
      o[e].type === "text_special" && (o[e].type = "text");
    for (e = n = 0; e < s; e++)
      o[e].type === "text" && e + 1 < s && o[e + 1].type === "text" ? o[e + 1].content = o[e].content + o[e + 1].content : (e !== n && (o[n] = o[e]), n++);
    e !== n && (o.length = n);
  }
}
const cr = [
  ["normalize", T0],
  ["block", I0],
  ["inline", S0],
  ["linkify", _0],
  ["replacements", B0],
  ["smartquotes", q0],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ["text_join", V0]
];
function hu() {
  this.ruler = new ee();
  for (let t = 0; t < cr.length; t++)
    this.ruler.push(cr[t][0], cr[t][1]);
}
hu.prototype.process = function(t) {
  const e = this.ruler.getRules("");
  for (let n = 0, r = e.length; n < r; n++)
    e[n](t);
};
hu.prototype.State = hs;
function Ae(t, e, n, r) {
  this.src = t, this.md = e, this.env = n, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0;
  const u = this.src;
  for (let i = 0, o = 0, s = 0, l = 0, a = u.length, c = !1; o < a; o++) {
    const f = u.charCodeAt(o);
    if (!c)
      if (w(f)) {
        s++, f === 9 ? l += 4 - l % 4 : l++;
        continue;
      } else
        c = !0;
    (f === 10 || o === a - 1) && (f !== 10 && o++, this.bMarks.push(i), this.eMarks.push(o), this.tShift.push(s), this.sCount.push(l), this.bsCount.push(0), c = !1, s = 0, l = 0, i = o + 1);
  }
  this.bMarks.push(u.length), this.eMarks.push(u.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
Ae.prototype.push = function(t, e, n) {
  const r = new me(t, e, n);
  return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;
};
Ae.prototype.isEmpty = function(e) {
  return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
};
Ae.prototype.skipEmptyLines = function(e) {
  for (let n = this.lineMax; e < n && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++)
    ;
  return e;
};
Ae.prototype.skipSpaces = function(e) {
  for (let n = this.src.length; e < n; e++) {
    const r = this.src.charCodeAt(e);
    if (!w(r))
      break;
  }
  return e;
};
Ae.prototype.skipSpacesBack = function(e, n) {
  if (e <= n)
    return e;
  for (; e > n; )
    if (!w(this.src.charCodeAt(--e)))
      return e + 1;
  return e;
};
Ae.prototype.skipChars = function(e, n) {
  for (let r = this.src.length; e < r && this.src.charCodeAt(e) === n; e++)
    ;
  return e;
};
Ae.prototype.skipCharsBack = function(e, n, r) {
  if (e <= r)
    return e;
  for (; e > r; )
    if (n !== this.src.charCodeAt(--e))
      return e + 1;
  return e;
};
Ae.prototype.getLines = function(e, n, r, u) {
  if (e >= n)
    return "";
  const i = new Array(n - e);
  for (let o = 0, s = e; s < n; s++, o++) {
    let l = 0;
    const a = this.bMarks[s];
    let c = a, f;
    for (s + 1 < n || u ? f = this.eMarks[s] + 1 : f = this.eMarks[s]; c < f && l < r; ) {
      const d = this.src.charCodeAt(c);
      if (w(d))
        d === 9 ? l += 4 - (l + this.bsCount[s]) % 4 : l++;
      else if (c - a < this.tShift[s])
        l++;
      else
        break;
      c++;
    }
    l > r ? i[o] = new Array(l - r + 1).join(" ") + this.src.slice(c, f) : i[o] = this.src.slice(c, f);
  }
  return i.join("");
};
Ae.prototype.Token = me;
const Q0 = 65536;
function fr(t, e) {
  const n = t.bMarks[e] + t.tShift[e], r = t.eMarks[e];
  return t.src.slice(n, r);
}
function Ci(t) {
  const e = [], n = t.length;
  let r = 0, u = t.charCodeAt(r), i = !1, o = 0, s = "";
  for (; r < n; )
    u === 124 && (i ? (s += t.substring(o, r - 1), o = r) : (e.push(s + t.substring(o, r)), s = "", o = r + 1)), i = u === 92, r++, u = t.charCodeAt(r);
  return e.push(s + t.substring(o)), e;
}
function $0(t, e, n, r) {
  if (e + 2 > n)
    return !1;
  let u = e + 1;
  if (t.sCount[u] < t.blkIndent || t.sCount[u] - t.blkIndent >= 4)
    return !1;
  let i = t.bMarks[u] + t.tShift[u];
  if (i >= t.eMarks[u])
    return !1;
  const o = t.src.charCodeAt(i++);
  if (o !== 124 && o !== 45 && o !== 58 || i >= t.eMarks[u])
    return !1;
  const s = t.src.charCodeAt(i++);
  if (s !== 124 && s !== 45 && s !== 58 && !w(s) || o === 45 && w(s))
    return !1;
  for (; i < t.eMarks[u]; ) {
    const k = t.src.charCodeAt(i);
    if (k !== 124 && k !== 45 && k !== 58 && !w(k))
      return !1;
    i++;
  }
  let l = fr(t, e + 1), a = l.split("|");
  const c = [];
  for (let k = 0; k < a.length; k++) {
    const C = a[k].trim();
    if (!C) {
      if (k === 0 || k === a.length - 1)
        continue;
      return !1;
    }
    if (!/^:?-+:?$/.test(C))
      return !1;
    C.charCodeAt(C.length - 1) === 58 ? c.push(C.charCodeAt(0) === 58 ? "center" : "right") : C.charCodeAt(0) === 58 ? c.push("left") : c.push("");
  }
  if (l = fr(t, e).trim(), l.indexOf("|") === -1 || t.sCount[e] - t.blkIndent >= 4)
    return !1;
  a = Ci(l), a.length && a[0] === "" && a.shift(), a.length && a[a.length - 1] === "" && a.pop();
  const f = a.length;
  if (f === 0 || f !== c.length)
    return !1;
  if (r)
    return !0;
  const d = t.parentType;
  t.parentType = "table";
  const p = t.md.block.ruler.getRules("blockquote"), h = t.push("table_open", "table", 1), m = [e, 0];
  h.map = m;
  const g = t.push("thead_open", "thead", 1);
  g.map = [e, e + 1];
  const b = t.push("tr_open", "tr", 1);
  b.map = [e, e + 1];
  for (let k = 0; k < a.length; k++) {
    const C = t.push("th_open", "th", 1);
    c[k] && (C.attrs = [["style", "text-align:" + c[k]]]);
    const A = t.push("inline", "", 0);
    A.content = a[k].trim(), A.children = [], t.push("th_close", "th", -1);
  }
  t.push("tr_close", "tr", -1), t.push("thead_close", "thead", -1);
  let y, D = 0;
  for (u = e + 2; u < n && !(t.sCount[u] < t.blkIndent); u++) {
    let k = !1;
    for (let A = 0, _ = p.length; A < _; A++)
      if (p[A](t, u, n, !0)) {
        k = !0;
        break;
      }
    if (k || (l = fr(t, u).trim(), !l) || t.sCount[u] - t.blkIndent >= 4 || (a = Ci(l), a.length && a[0] === "" && a.shift(), a.length && a[a.length - 1] === "" && a.pop(), D += f - a.length, D > Q0))
      break;
    if (u === e + 2) {
      const A = t.push("tbody_open", "tbody", 1);
      A.map = y = [e + 2, 0];
    }
    const C = t.push("tr_open", "tr", 1);
    C.map = [u, u + 1];
    for (let A = 0; A < f; A++) {
      const _ = t.push("td_open", "td", 1);
      c[A] && (_.attrs = [["style", "text-align:" + c[A]]]);
      const V = t.push("inline", "", 0);
      V.content = a[A] ? a[A].trim() : "", V.children = [], t.push("td_close", "td", -1);
    }
    t.push("tr_close", "tr", -1);
  }
  return y && (t.push("tbody_close", "tbody", -1), y[1] = u), t.push("table_close", "table", -1), m[1] = u, t.parentType = d, t.line = u, !0;
}
function Y0(t, e, n) {
  if (t.sCount[e] - t.blkIndent < 4)
    return !1;
  let r = e + 1, u = r;
  for (; r < n; ) {
    if (t.isEmpty(r)) {
      r++;
      continue;
    }
    if (t.sCount[r] - t.blkIndent >= 4) {
      r++, u = r;
      continue;
    }
    break;
  }
  t.line = u;
  const i = t.push("code_block", "code", 0);
  return i.content = t.getLines(e, u, 4 + t.blkIndent, !1) + `
`, i.map = [e, t.line], !0;
}
function W0(t, e, n, r) {
  let u = t.bMarks[e] + t.tShift[e], i = t.eMarks[e];
  if (t.sCount[e] - t.blkIndent >= 4 || u + 3 > i)
    return !1;
  const o = t.src.charCodeAt(u);
  if (o !== 126 && o !== 96)
    return !1;
  let s = u;
  u = t.skipChars(u, o);
  let l = u - s;
  if (l < 3)
    return !1;
  const a = t.src.slice(s, u), c = t.src.slice(u, i);
  if (o === 96 && c.indexOf(String.fromCharCode(o)) >= 0)
    return !1;
  if (r)
    return !0;
  let f = e, d = !1;
  for (; f++, !(f >= n || (u = s = t.bMarks[f] + t.tShift[f], i = t.eMarks[f], u < i && t.sCount[f] < t.blkIndent)); )
    if (t.src.charCodeAt(u) === o && !(t.sCount[f] - t.blkIndent >= 4) && (u = t.skipChars(u, o), !(u - s < l) && (u = t.skipSpaces(u), !(u < i)))) {
      d = !0;
      break;
    }
  l = t.sCount[e], t.line = f + (d ? 1 : 0);
  const p = t.push("fence", "code", 0);
  return p.info = c, p.content = t.getLines(e + 1, f, l, !0), p.markup = a, p.map = [e, t.line], !0;
}
function H0(t, e, n, r) {
  let u = t.bMarks[e] + t.tShift[e], i = t.eMarks[e];
  const o = t.lineMax;
  if (t.sCount[e] - t.blkIndent >= 4 || t.src.charCodeAt(u) !== 62)
    return !1;
  if (r)
    return !0;
  const s = [], l = [], a = [], c = [], f = t.md.block.ruler.getRules("blockquote"), d = t.parentType;
  t.parentType = "blockquote";
  let p = !1, h;
  for (h = e; h < n; h++) {
    const D = t.sCount[h] < t.blkIndent;
    if (u = t.bMarks[h] + t.tShift[h], i = t.eMarks[h], u >= i)
      break;
    if (t.src.charCodeAt(u++) === 62 && !D) {
      let C = t.sCount[h] + 1, A, _;
      t.src.charCodeAt(u) === 32 ? (u++, C++, _ = !1, A = !0) : t.src.charCodeAt(u) === 9 ? (A = !0, (t.bsCount[h] + C) % 4 === 3 ? (u++, C++, _ = !1) : _ = !0) : A = !1;
      let V = C;
      for (s.push(t.bMarks[h]), t.bMarks[h] = u; u < i; ) {
        const E = t.src.charCodeAt(u);
        if (w(E))
          E === 9 ? V += 4 - (V + t.bsCount[h] + (_ ? 1 : 0)) % 4 : V++;
        else
          break;
        u++;
      }
      p = u >= i, l.push(t.bsCount[h]), t.bsCount[h] = t.sCount[h] + 1 + (A ? 1 : 0), a.push(t.sCount[h]), t.sCount[h] = V - C, c.push(t.tShift[h]), t.tShift[h] = u - t.bMarks[h];
      continue;
    }
    if (p)
      break;
    let k = !1;
    for (let C = 0, A = f.length; C < A; C++)
      if (f[C](t, h, n, !0)) {
        k = !0;
        break;
      }
    if (k) {
      t.lineMax = h, t.blkIndent !== 0 && (s.push(t.bMarks[h]), l.push(t.bsCount[h]), c.push(t.tShift[h]), a.push(t.sCount[h]), t.sCount[h] -= t.blkIndent);
      break;
    }
    s.push(t.bMarks[h]), l.push(t.bsCount[h]), c.push(t.tShift[h]), a.push(t.sCount[h]), t.sCount[h] = -1;
  }
  const m = t.blkIndent;
  t.blkIndent = 0;
  const g = t.push("blockquote_open", "blockquote", 1);
  g.markup = ">";
  const b = [e, 0];
  g.map = b, t.md.block.tokenize(t, e, h);
  const y = t.push("blockquote_close", "blockquote", -1);
  y.markup = ">", t.lineMax = o, t.parentType = d, b[1] = t.line;
  for (let D = 0; D < c.length; D++)
    t.bMarks[D + e] = s[D], t.tShift[D + e] = c[D], t.sCount[D + e] = a[D], t.bsCount[D + e] = l[D];
  return t.blkIndent = m, !0;
}
function J0(t, e, n, r) {
  const u = t.eMarks[e];
  if (t.sCount[e] - t.blkIndent >= 4)
    return !1;
  let i = t.bMarks[e] + t.tShift[e];
  const o = t.src.charCodeAt(i++);
  if (o !== 42 && o !== 45 && o !== 95)
    return !1;
  let s = 1;
  for (; i < u; ) {
    const a = t.src.charCodeAt(i++);
    if (a !== o && !w(a))
      return !1;
    a === o && s++;
  }
  if (s < 3)
    return !1;
  if (r)
    return !0;
  t.line = e + 1;
  const l = t.push("hr", "hr", 0);
  return l.map = [e, t.line], l.markup = Array(s + 1).join(String.fromCharCode(o)), !0;
}
function Ai(t, e) {
  const n = t.eMarks[e];
  let r = t.bMarks[e] + t.tShift[e];
  const u = t.src.charCodeAt(r++);
  if (u !== 42 && u !== 45 && u !== 43)
    return -1;
  if (r < n) {
    const i = t.src.charCodeAt(r);
    if (!w(i))
      return -1;
  }
  return r;
}
function Ei(t, e) {
  const n = t.bMarks[e] + t.tShift[e], r = t.eMarks[e];
  let u = n;
  if (u + 1 >= r)
    return -1;
  let i = t.src.charCodeAt(u++);
  if (i < 48 || i > 57)
    return -1;
  for (; ; ) {
    if (u >= r)
      return -1;
    if (i = t.src.charCodeAt(u++), i >= 48 && i <= 57) {
      if (u - n >= 10)
        return -1;
      continue;
    }
    if (i === 41 || i === 46)
      break;
    return -1;
  }
  return u < r && (i = t.src.charCodeAt(u), !w(i)) ? -1 : u;
}
function Z0(t, e) {
  const n = t.level + 2;
  for (let r = e + 2, u = t.tokens.length - 2; r < u; r++)
    t.tokens[r].level === n && t.tokens[r].type === "paragraph_open" && (t.tokens[r + 2].hidden = !0, t.tokens[r].hidden = !0, r += 2);
}
function G0(t, e, n, r) {
  let u, i, o, s, l = e, a = !0;
  if (t.sCount[l] - t.blkIndent >= 4 || t.listIndent >= 0 && t.sCount[l] - t.listIndent >= 4 && t.sCount[l] < t.blkIndent)
    return !1;
  let c = !1;
  r && t.parentType === "paragraph" && t.sCount[l] >= t.blkIndent && (c = !0);
  let f, d, p;
  if ((p = Ei(t, l)) >= 0) {
    if (f = !0, o = t.bMarks[l] + t.tShift[l], d = Number(t.src.slice(o, p - 1)), c && d !== 1)
      return !1;
  } else if ((p = Ai(t, l)) >= 0)
    f = !1;
  else
    return !1;
  if (c && t.skipSpaces(p) >= t.eMarks[l])
    return !1;
  if (r)
    return !0;
  const h = t.src.charCodeAt(p - 1), m = t.tokens.length;
  f ? (s = t.push("ordered_list_open", "ol", 1), d !== 1 && (s.attrs = [["start", d]])) : s = t.push("bullet_list_open", "ul", 1);
  const g = [l, 0];
  s.map = g, s.markup = String.fromCharCode(h);
  let b = !1;
  const y = t.md.block.ruler.getRules("list"), D = t.parentType;
  for (t.parentType = "list"; l < n; ) {
    i = p, u = t.eMarks[l];
    const k = t.sCount[l] + p - (t.bMarks[l] + t.tShift[l]);
    let C = k;
    for (; i < u; ) {
      const ft = t.src.charCodeAt(i);
      if (ft === 9)
        C += 4 - (C + t.bsCount[l]) % 4;
      else if (ft === 32)
        C++;
      else
        break;
      i++;
    }
    const A = i;
    let _;
    A >= u ? _ = 1 : _ = C - k, _ > 4 && (_ = 1);
    const V = k + _;
    s = t.push("list_item_open", "li", 1), s.markup = String.fromCharCode(h);
    const E = [l, 0];
    s.map = E, f && (s.info = t.src.slice(o, p - 1));
    const G = t.tight, ze = t.tShift[l], Hn = t.sCount[l], rl = t.listIndent;
    if (t.listIndent = t.blkIndent, t.blkIndent = V, t.tight = !0, t.tShift[l] = A - t.bMarks[l], t.sCount[l] = C, A >= u && t.isEmpty(l + 1) ? t.line = Math.min(t.line + 2, n) : t.md.block.tokenize(t, l, n, !0), (!t.tight || b) && (a = !1), b = t.line - l > 1 && t.isEmpty(t.line - 1), t.blkIndent = t.listIndent, t.listIndent = rl, t.tShift[l] = ze, t.sCount[l] = Hn, t.tight = G, s = t.push("list_item_close", "li", -1), s.markup = String.fromCharCode(h), l = t.line, E[1] = l, l >= n || t.sCount[l] < t.blkIndent || t.sCount[l] - t.blkIndent >= 4)
      break;
    let Mu = !1;
    for (let ft = 0, ul = y.length; ft < ul; ft++)
      if (y[ft](t, l, n, !0)) {
        Mu = !0;
        break;
      }
    if (Mu)
      break;
    if (f) {
      if (p = Ei(t, l), p < 0)
        break;
      o = t.bMarks[l] + t.tShift[l];
    } else if (p = Ai(t, l), p < 0)
      break;
    if (h !== t.src.charCodeAt(p - 1))
      break;
  }
  return f ? s = t.push("ordered_list_close", "ol", -1) : s = t.push("bullet_list_close", "ul", -1), s.markup = String.fromCharCode(h), g[1] = l, t.line = l, t.parentType = D, a && Z0(t, m), !0;
}
function K0(t, e, n, r) {
  let u = t.bMarks[e] + t.tShift[e], i = t.eMarks[e], o = e + 1;
  if (t.sCount[e] - t.blkIndent >= 4 || t.src.charCodeAt(u) !== 91)
    return !1;
  function s(y) {
    const D = t.lineMax;
    if (y >= D || t.isEmpty(y))
      return null;
    let k = !1;
    if (t.sCount[y] - t.blkIndent > 3 && (k = !0), t.sCount[y] < 0 && (k = !0), !k) {
      const _ = t.md.block.ruler.getRules("reference"), V = t.parentType;
      t.parentType = "reference";
      let E = !1;
      for (let G = 0, ze = _.length; G < ze; G++)
        if (_[G](t, y, D, !0)) {
          E = !0;
          break;
        }
      if (t.parentType = V, E)
        return null;
    }
    const C = t.bMarks[y] + t.tShift[y], A = t.eMarks[y];
    return t.src.slice(C, A + 1);
  }
  let l = t.src.slice(u, i + 1);
  i = l.length;
  let a = -1;
  for (u = 1; u < i; u++) {
    const y = l.charCodeAt(u);
    if (y === 91)
      return !1;
    if (y === 93) {
      a = u;
      break;
    } else if (y === 10) {
      const D = s(o);
      D !== null && (l += D, i = l.length, o++);
    } else if (y === 92 && (u++, u < i && l.charCodeAt(u) === 10)) {
      const D = s(o);
      D !== null && (l += D, i = l.length, o++);
    }
  }
  if (a < 0 || l.charCodeAt(a + 1) !== 58)
    return !1;
  for (u = a + 2; u < i; u++) {
    const y = l.charCodeAt(u);
    if (y === 10) {
      const D = s(o);
      D !== null && (l += D, i = l.length, o++);
    } else if (!w(y))
      break;
  }
  const c = t.md.helpers.parseLinkDestination(l, u, i);
  if (!c.ok)
    return !1;
  const f = t.md.normalizeLink(c.str);
  if (!t.md.validateLink(f))
    return !1;
  u = c.pos;
  const d = u, p = o, h = u;
  for (; u < i; u++) {
    const y = l.charCodeAt(u);
    if (y === 10) {
      const D = s(o);
      D !== null && (l += D, i = l.length, o++);
    } else if (!w(y))
      break;
  }
  let m = t.md.helpers.parseLinkTitle(l, u, i);
  for (; m.can_continue; ) {
    const y = s(o);
    if (y === null)
      break;
    l += y, u = i, i = l.length, o++, m = t.md.helpers.parseLinkTitle(l, u, i, m);
  }
  let g;
  for (u < i && h !== u && m.ok ? (g = m.str, u = m.pos) : (g = "", u = d, o = p); u < i; ) {
    const y = l.charCodeAt(u);
    if (!w(y))
      break;
    u++;
  }
  if (u < i && l.charCodeAt(u) !== 10 && g)
    for (g = "", u = d, o = p; u < i; ) {
      const y = l.charCodeAt(u);
      if (!w(y))
        break;
      u++;
    }
  if (u < i && l.charCodeAt(u) !== 10)
    return !1;
  const b = Qn(l.slice(1, a));
  return b ? (r || (typeof t.env.references > "u" && (t.env.references = {}), typeof t.env.references[b] > "u" && (t.env.references[b] = { title: g, href: f }), t.line = o), !0) : !1;
}
const X0 = [
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
  "search",
  "section",
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
], ef = "[a-zA-Z_:][a-zA-Z0-9:._-]*", tf = "[^\"'=<>`\\x00-\\x20]+", nf = "'[^']*'", rf = '"[^"]*"', uf = "(?:" + tf + "|" + nf + "|" + rf + ")", of = "(?:\\s+" + ef + "(?:\\s*=\\s*" + uf + ")?)", ms = "<[A-Za-z][A-Za-z0-9\\-]*" + of + "*\\s*\\/?>", gs = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", sf = "<!---?>|<!--(?:[^-]|-[^-]|--[^>])*-->", lf = "<[?][\\s\\S]*?[?]>", af = "<![A-Za-z][^>]*>", cf = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", ff = new RegExp("^(?:" + ms + "|" + gs + "|" + sf + "|" + lf + "|" + af + "|" + cf + ")"), df = new RegExp("^(?:" + ms + "|" + gs + ")"), pt = [
  [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, !0],
  [/^<!--/, /-->/, !0],
  [/^<\?/, /\?>/, !0],
  [/^<![A-Z]/, />/, !0],
  [/^<!\[CDATA\[/, /\]\]>/, !0],
  [new RegExp("^</?(" + X0.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, !0],
  [new RegExp(df.source + "\\s*$"), /^$/, !1]
];
function hf(t, e, n, r) {
  let u = t.bMarks[e] + t.tShift[e], i = t.eMarks[e];
  if (t.sCount[e] - t.blkIndent >= 4 || !t.md.options.html || t.src.charCodeAt(u) !== 60)
    return !1;
  let o = t.src.slice(u, i), s = 0;
  for (; s < pt.length && !pt[s][0].test(o); s++)
    ;
  if (s === pt.length)
    return !1;
  if (r)
    return pt[s][2];
  let l = e + 1;
  if (!pt[s][1].test(o)) {
    for (; l < n && !(t.sCount[l] < t.blkIndent); l++)
      if (u = t.bMarks[l] + t.tShift[l], i = t.eMarks[l], o = t.src.slice(u, i), pt[s][1].test(o)) {
        o.length !== 0 && l++;
        break;
      }
  }
  t.line = l;
  const a = t.push("html_block", "", 0);
  return a.map = [e, l], a.content = t.getLines(e, l, t.blkIndent, !0), !0;
}
function pf(t, e, n, r) {
  let u = t.bMarks[e] + t.tShift[e], i = t.eMarks[e];
  if (t.sCount[e] - t.blkIndent >= 4)
    return !1;
  let o = t.src.charCodeAt(u);
  if (o !== 35 || u >= i)
    return !1;
  let s = 1;
  for (o = t.src.charCodeAt(++u); o === 35 && u < i && s <= 6; )
    s++, o = t.src.charCodeAt(++u);
  if (s > 6 || u < i && !w(o))
    return !1;
  if (r)
    return !0;
  i = t.skipSpacesBack(i, u);
  const l = t.skipCharsBack(i, 35, u);
  l > u && w(t.src.charCodeAt(l - 1)) && (i = l), t.line = e + 1;
  const a = t.push("heading_open", "h" + String(s), 1);
  a.markup = "########".slice(0, s), a.map = [e, t.line];
  const c = t.push("inline", "", 0);
  c.content = t.src.slice(u, i).trim(), c.map = [e, t.line], c.children = [];
  const f = t.push("heading_close", "h" + String(s), -1);
  return f.markup = "########".slice(0, s), !0;
}
function mf(t, e, n) {
  const r = t.md.block.ruler.getRules("paragraph");
  if (t.sCount[e] - t.blkIndent >= 4)
    return !1;
  const u = t.parentType;
  t.parentType = "paragraph";
  let i = 0, o, s = e + 1;
  for (; s < n && !t.isEmpty(s); s++) {
    if (t.sCount[s] - t.blkIndent > 3)
      continue;
    if (t.sCount[s] >= t.blkIndent) {
      let p = t.bMarks[s] + t.tShift[s];
      const h = t.eMarks[s];
      if (p < h && (o = t.src.charCodeAt(p), (o === 45 || o === 61) && (p = t.skipChars(p, o), p = t.skipSpaces(p), p >= h))) {
        i = o === 61 ? 1 : 2;
        break;
      }
    }
    if (t.sCount[s] < 0)
      continue;
    let d = !1;
    for (let p = 0, h = r.length; p < h; p++)
      if (r[p](t, s, n, !0)) {
        d = !0;
        break;
      }
    if (d)
      break;
  }
  if (!i)
    return !1;
  const l = t.getLines(e, s, t.blkIndent, !1).trim();
  t.line = s + 1;
  const a = t.push("heading_open", "h" + String(i), 1);
  a.markup = String.fromCharCode(o), a.map = [e, t.line];
  const c = t.push("inline", "", 0);
  c.content = l, c.map = [e, t.line - 1], c.children = [];
  const f = t.push("heading_close", "h" + String(i), -1);
  return f.markup = String.fromCharCode(o), t.parentType = u, !0;
}
function gf(t, e, n) {
  const r = t.md.block.ruler.getRules("paragraph"), u = t.parentType;
  let i = e + 1;
  for (t.parentType = "paragraph"; i < n && !t.isEmpty(i); i++) {
    if (t.sCount[i] - t.blkIndent > 3 || t.sCount[i] < 0)
      continue;
    let a = !1;
    for (let c = 0, f = r.length; c < f; c++)
      if (r[c](t, i, n, !0)) {
        a = !0;
        break;
      }
    if (a)
      break;
  }
  const o = t.getLines(e, i, t.blkIndent, !1).trim();
  t.line = i;
  const s = t.push("paragraph_open", "p", 1);
  s.map = [e, t.line];
  const l = t.push("inline", "", 0);
  return l.content = o, l.map = [e, t.line], l.children = [], t.push("paragraph_close", "p", -1), t.parentType = u, !0;
}
const gn = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  ["table", $0, ["paragraph", "reference"]],
  ["code", Y0],
  ["fence", W0, ["paragraph", "reference", "blockquote", "list"]],
  ["blockquote", H0, ["paragraph", "reference", "blockquote", "list"]],
  ["hr", J0, ["paragraph", "reference", "blockquote", "list"]],
  ["list", G0, ["paragraph", "reference", "blockquote"]],
  ["reference", K0],
  ["html_block", hf, ["paragraph", "reference", "blockquote"]],
  ["heading", pf, ["paragraph", "reference", "blockquote"]],
  ["lheading", mf],
  ["paragraph", gf]
];
function $n() {
  this.ruler = new ee();
  for (let t = 0; t < gn.length; t++)
    this.ruler.push(gn[t][0], gn[t][1], { alt: (gn[t][2] || []).slice() });
}
$n.prototype.tokenize = function(t, e, n) {
  const r = this.ruler.getRules(""), u = r.length, i = t.md.options.maxNesting;
  let o = e, s = !1;
  for (; o < n && (t.line = o = t.skipEmptyLines(o), !(o >= n || t.sCount[o] < t.blkIndent)); ) {
    if (t.level >= i) {
      t.line = n;
      break;
    }
    const l = t.line;
    let a = !1;
    for (let c = 0; c < u; c++)
      if (a = r[c](t, o, n, !1), a) {
        if (l >= t.line)
          throw new Error("block rule didn't increment state.line");
        break;
      }
    if (!a)
      throw new Error("none of the block rules matched");
    t.tight = !s, t.isEmpty(t.line - 1) && (s = !0), o = t.line, o < n && t.isEmpty(o) && (s = !0, o++, t.line = o);
  }
};
$n.prototype.parse = function(t, e, n, r) {
  if (!t)
    return;
  const u = new this.State(t, e, n, r);
  this.tokenize(u, u.line, u.lineMax);
};
$n.prototype.State = Ae;
function cn(t, e, n, r) {
  this.src = t, this.env = n, this.md = e, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
cn.prototype.pushPending = function() {
  const t = new me("text", "", 0);
  return t.content = this.pending, t.level = this.pendingLevel, this.tokens.push(t), this.pending = "", t;
};
cn.prototype.push = function(t, e, n) {
  this.pending && this.pushPending();
  const r = new me(t, e, n);
  let u = null;
  return n < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, n > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], u = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(u), r;
};
cn.prototype.scanDelims = function(t, e) {
  const n = this.posMax, r = this.src.charCodeAt(t), u = t > 0 ? this.src.charCodeAt(t - 1) : 32;
  let i = t;
  for (; i < n && this.src.charCodeAt(i) === r; )
    i++;
  const o = i - t, s = i < n ? this.src.charCodeAt(i) : 32, l = en(u) || Xt(String.fromCharCode(u)), a = en(s) || Xt(String.fromCharCode(s)), c = Kt(u), f = Kt(s), d = !f && (!a || c || l), p = !c && (!l || f || a);
  return { can_open: d && (e || !p || l), can_close: p && (e || !d || a), length: o };
};
cn.prototype.Token = me;
function bf(t) {
  switch (t) {
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
function xf(t, e) {
  let n = t.pos;
  for (; n < t.posMax && !bf(t.src.charCodeAt(n)); )
    n++;
  return n === t.pos ? !1 : (e || (t.pending += t.src.slice(t.pos, n)), t.pos = n, !0);
}
const Mf = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
function yf(t, e) {
  if (!t.md.options.linkify || t.linkLevel > 0)
    return !1;
  const n = t.pos, r = t.posMax;
  if (n + 3 > r || t.src.charCodeAt(n) !== 58 || t.src.charCodeAt(n + 1) !== 47 || t.src.charCodeAt(n + 2) !== 47)
    return !1;
  const u = t.pending.match(Mf);
  if (!u)
    return !1;
  const i = u[1], o = t.md.linkify.matchAtStart(t.src.slice(n - i.length));
  if (!o)
    return !1;
  let s = o.url;
  if (s.length <= i.length)
    return !1;
  s = s.replace(/\*+$/, "");
  const l = t.md.normalizeLink(s);
  if (!t.md.validateLink(l))
    return !1;
  if (!e) {
    t.pending = t.pending.slice(0, -i.length);
    const a = t.push("link_open", "a", 1);
    a.attrs = [["href", l]], a.markup = "linkify", a.info = "auto";
    const c = t.push("text", "", 0);
    c.content = t.md.normalizeLinkText(s);
    const f = t.push("link_close", "a", -1);
    f.markup = "linkify", f.info = "auto";
  }
  return t.pos += s.length - i.length, !0;
}
function kf(t, e) {
  let n = t.pos;
  if (t.src.charCodeAt(n) !== 10)
    return !1;
  const r = t.pending.length - 1, u = t.posMax;
  if (!e)
    if (r >= 0 && t.pending.charCodeAt(r) === 32)
      if (r >= 1 && t.pending.charCodeAt(r - 1) === 32) {
        let i = r - 1;
        for (; i >= 1 && t.pending.charCodeAt(i - 1) === 32; )
          i--;
        t.pending = t.pending.slice(0, i), t.push("hardbreak", "br", 0);
      } else
        t.pending = t.pending.slice(0, -1), t.push("softbreak", "br", 0);
    else
      t.push("softbreak", "br", 0);
  for (n++; n < u && w(t.src.charCodeAt(n)); )
    n++;
  return t.pos = n, !0;
}
const pu = [];
for (let t = 0; t < 256; t++)
  pu.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(t) {
  pu[t.charCodeAt(0)] = 1;
});
function Df(t, e) {
  let n = t.pos;
  const r = t.posMax;
  if (t.src.charCodeAt(n) !== 92 || (n++, n >= r))
    return !1;
  let u = t.src.charCodeAt(n);
  if (u === 10) {
    for (e || t.push("hardbreak", "br", 0), n++; n < r && (u = t.src.charCodeAt(n), !!w(u)); )
      n++;
    return t.pos = n, !0;
  }
  let i = t.src[n];
  if (u >= 55296 && u <= 56319 && n + 1 < r) {
    const s = t.src.charCodeAt(n + 1);
    s >= 56320 && s <= 57343 && (i += t.src[n + 1], n++);
  }
  const o = "\\" + i;
  if (!e) {
    const s = t.push("text_special", "", 0);
    u < 256 && pu[u] !== 0 ? s.content = i : s.content = o, s.markup = o, s.info = "escape";
  }
  return t.pos = n + 1, !0;
}
function Nf(t, e) {
  let n = t.pos;
  if (t.src.charCodeAt(n) !== 96)
    return !1;
  const u = n;
  n++;
  const i = t.posMax;
  for (; n < i && t.src.charCodeAt(n) === 96; )
    n++;
  const o = t.src.slice(u, n), s = o.length;
  if (t.backticksScanned && (t.backticks[s] || 0) <= u)
    return e || (t.pending += o), t.pos += s, !0;
  let l = n, a;
  for (; (a = t.src.indexOf("`", l)) !== -1; ) {
    for (l = a + 1; l < i && t.src.charCodeAt(l) === 96; )
      l++;
    const c = l - a;
    if (c === s) {
      if (!e) {
        const f = t.push("code_inline", "code", 0);
        f.markup = o, f.content = t.src.slice(n, a).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
      }
      return t.pos = l, !0;
    }
    t.backticks[c] = a;
  }
  return t.backticksScanned = !0, e || (t.pending += o), t.pos += s, !0;
}
function Cf(t, e) {
  const n = t.pos, r = t.src.charCodeAt(n);
  if (e || r !== 126)
    return !1;
  const u = t.scanDelims(t.pos, !0);
  let i = u.length;
  const o = String.fromCharCode(r);
  if (i < 2)
    return !1;
  let s;
  i % 2 && (s = t.push("text", "", 0), s.content = o, i--);
  for (let l = 0; l < i; l += 2)
    s = t.push("text", "", 0), s.content = o + o, t.delimiters.push({
      marker: r,
      length: 0,
      // disable "rule of 3" length checks meant for emphasis
      token: t.tokens.length - 1,
      end: -1,
      open: u.can_open,
      close: u.can_close
    });
  return t.pos += u.length, !0;
}
function Ti(t, e) {
  let n;
  const r = [], u = e.length;
  for (let i = 0; i < u; i++) {
    const o = e[i];
    if (o.marker !== 126 || o.end === -1)
      continue;
    const s = e[o.end];
    n = t.tokens[o.token], n.type = "s_open", n.tag = "s", n.nesting = 1, n.markup = "~~", n.content = "", n = t.tokens[s.token], n.type = "s_close", n.tag = "s", n.nesting = -1, n.markup = "~~", n.content = "", t.tokens[s.token - 1].type === "text" && t.tokens[s.token - 1].content === "~" && r.push(s.token - 1);
  }
  for (; r.length; ) {
    const i = r.pop();
    let o = i + 1;
    for (; o < t.tokens.length && t.tokens[o].type === "s_close"; )
      o++;
    o--, i !== o && (n = t.tokens[o], t.tokens[o] = t.tokens[i], t.tokens[i] = n);
  }
}
function Af(t) {
  const e = t.tokens_meta, n = t.tokens_meta.length;
  Ti(t, t.delimiters);
  for (let r = 0; r < n; r++)
    e[r] && e[r].delimiters && Ti(t, e[r].delimiters);
}
const bs = {
  tokenize: Cf,
  postProcess: Af
};
function Ef(t, e) {
  const n = t.pos, r = t.src.charCodeAt(n);
  if (e || r !== 95 && r !== 42)
    return !1;
  const u = t.scanDelims(t.pos, r === 42);
  for (let i = 0; i < u.length; i++) {
    const o = t.push("text", "", 0);
    o.content = String.fromCharCode(r), t.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker: r,
      // Total length of these series of delimiters.
      //
      length: u.length,
      // A position of the token this delimiter corresponds to.
      //
      token: t.tokens.length - 1,
      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end: -1,
      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open: u.can_open,
      close: u.can_close
    });
  }
  return t.pos += u.length, !0;
}
function Ii(t, e) {
  const n = e.length;
  for (let r = n - 1; r >= 0; r--) {
    const u = e[r];
    if (u.marker !== 95 && u.marker !== 42 || u.end === -1)
      continue;
    const i = e[u.end], o = r > 0 && e[r - 1].end === u.end + 1 && // check that first two markers match and adjacent
    e[r - 1].marker === u.marker && e[r - 1].token === u.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
    e[u.end + 1].token === i.token + 1, s = String.fromCharCode(u.marker), l = t.tokens[u.token];
    l.type = o ? "strong_open" : "em_open", l.tag = o ? "strong" : "em", l.nesting = 1, l.markup = o ? s + s : s, l.content = "";
    const a = t.tokens[i.token];
    a.type = o ? "strong_close" : "em_close", a.tag = o ? "strong" : "em", a.nesting = -1, a.markup = o ? s + s : s, a.content = "", o && (t.tokens[e[r - 1].token].content = "", t.tokens[e[u.end + 1].token].content = "", r--);
  }
}
function Tf(t) {
  const e = t.tokens_meta, n = t.tokens_meta.length;
  Ii(t, t.delimiters);
  for (let r = 0; r < n; r++)
    e[r] && e[r].delimiters && Ii(t, e[r].delimiters);
}
const xs = {
  tokenize: Ef,
  postProcess: Tf
};
function If(t, e) {
  let n, r, u, i, o = "", s = "", l = t.pos, a = !0;
  if (t.src.charCodeAt(t.pos) !== 91)
    return !1;
  const c = t.pos, f = t.posMax, d = t.pos + 1, p = t.md.helpers.parseLinkLabel(t, t.pos, !0);
  if (p < 0)
    return !1;
  let h = p + 1;
  if (h < f && t.src.charCodeAt(h) === 40) {
    for (a = !1, h++; h < f && (n = t.src.charCodeAt(h), !(!w(n) && n !== 10)); h++)
      ;
    if (h >= f)
      return !1;
    if (l = h, u = t.md.helpers.parseLinkDestination(t.src, h, t.posMax), u.ok) {
      for (o = t.md.normalizeLink(u.str), t.md.validateLink(o) ? h = u.pos : o = "", l = h; h < f && (n = t.src.charCodeAt(h), !(!w(n) && n !== 10)); h++)
        ;
      if (u = t.md.helpers.parseLinkTitle(t.src, h, t.posMax), h < f && l !== h && u.ok)
        for (s = u.str, h = u.pos; h < f && (n = t.src.charCodeAt(h), !(!w(n) && n !== 10)); h++)
          ;
    }
    (h >= f || t.src.charCodeAt(h) !== 41) && (a = !0), h++;
  }
  if (a) {
    if (typeof t.env.references > "u")
      return !1;
    if (h < f && t.src.charCodeAt(h) === 91 ? (l = h + 1, h = t.md.helpers.parseLinkLabel(t, h), h >= 0 ? r = t.src.slice(l, h++) : h = p + 1) : h = p + 1, r || (r = t.src.slice(d, p)), i = t.env.references[Qn(r)], !i)
      return t.pos = c, !1;
    o = i.href, s = i.title;
  }
  if (!e) {
    t.pos = d, t.posMax = p;
    const m = t.push("link_open", "a", 1), g = [["href", o]];
    m.attrs = g, s && g.push(["title", s]), t.linkLevel++, t.md.inline.tokenize(t), t.linkLevel--, t.push("link_close", "a", -1);
  }
  return t.pos = h, t.posMax = f, !0;
}
function Sf(t, e) {
  let n, r, u, i, o, s, l, a, c = "";
  const f = t.pos, d = t.posMax;
  if (t.src.charCodeAt(t.pos) !== 33 || t.src.charCodeAt(t.pos + 1) !== 91)
    return !1;
  const p = t.pos + 2, h = t.md.helpers.parseLinkLabel(t, t.pos + 1, !1);
  if (h < 0)
    return !1;
  if (i = h + 1, i < d && t.src.charCodeAt(i) === 40) {
    for (i++; i < d && (n = t.src.charCodeAt(i), !(!w(n) && n !== 10)); i++)
      ;
    if (i >= d)
      return !1;
    for (a = i, s = t.md.helpers.parseLinkDestination(t.src, i, t.posMax), s.ok && (c = t.md.normalizeLink(s.str), t.md.validateLink(c) ? i = s.pos : c = ""), a = i; i < d && (n = t.src.charCodeAt(i), !(!w(n) && n !== 10)); i++)
      ;
    if (s = t.md.helpers.parseLinkTitle(t.src, i, t.posMax), i < d && a !== i && s.ok)
      for (l = s.str, i = s.pos; i < d && (n = t.src.charCodeAt(i), !(!w(n) && n !== 10)); i++)
        ;
    else
      l = "";
    if (i >= d || t.src.charCodeAt(i) !== 41)
      return t.pos = f, !1;
    i++;
  } else {
    if (typeof t.env.references > "u")
      return !1;
    if (i < d && t.src.charCodeAt(i) === 91 ? (a = i + 1, i = t.md.helpers.parseLinkLabel(t, i), i >= 0 ? u = t.src.slice(a, i++) : i = h + 1) : i = h + 1, u || (u = t.src.slice(p, h)), o = t.env.references[Qn(u)], !o)
      return t.pos = f, !1;
    c = o.href, l = o.title;
  }
  if (!e) {
    r = t.src.slice(p, h);
    const m = [];
    t.md.inline.parse(
      r,
      t.md,
      t.env,
      m
    );
    const g = t.push("image", "img", 0), b = [["src", c], ["alt", ""]];
    g.attrs = b, g.children = m, g.content = r, l && b.push(["title", l]);
  }
  return t.pos = i, t.posMax = d, !0;
}
const wf = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, Of = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function _f(t, e) {
  let n = t.pos;
  if (t.src.charCodeAt(n) !== 60)
    return !1;
  const r = t.pos, u = t.posMax;
  for (; ; ) {
    if (++n >= u)
      return !1;
    const o = t.src.charCodeAt(n);
    if (o === 60)
      return !1;
    if (o === 62)
      break;
  }
  const i = t.src.slice(r + 1, n);
  if (Of.test(i)) {
    const o = t.md.normalizeLink(i);
    if (!t.md.validateLink(o))
      return !1;
    if (!e) {
      const s = t.push("link_open", "a", 1);
      s.attrs = [["href", o]], s.markup = "autolink", s.info = "auto";
      const l = t.push("text", "", 0);
      l.content = t.md.normalizeLinkText(i);
      const a = t.push("link_close", "a", -1);
      a.markup = "autolink", a.info = "auto";
    }
    return t.pos += i.length + 2, !0;
  }
  if (wf.test(i)) {
    const o = t.md.normalizeLink("mailto:" + i);
    if (!t.md.validateLink(o))
      return !1;
    if (!e) {
      const s = t.push("link_open", "a", 1);
      s.attrs = [["href", o]], s.markup = "autolink", s.info = "auto";
      const l = t.push("text", "", 0);
      l.content = t.md.normalizeLinkText(i);
      const a = t.push("link_close", "a", -1);
      a.markup = "autolink", a.info = "auto";
    }
    return t.pos += i.length + 2, !0;
  }
  return !1;
}
function zf(t) {
  return /^<a[>\s]/i.test(t);
}
function jf(t) {
  return /^<\/a\s*>/i.test(t);
}
function Lf(t) {
  const e = t | 32;
  return e >= 97 && e <= 122;
}
function Ff(t, e) {
  if (!t.md.options.html)
    return !1;
  const n = t.posMax, r = t.pos;
  if (t.src.charCodeAt(r) !== 60 || r + 2 >= n)
    return !1;
  const u = t.src.charCodeAt(r + 1);
  if (u !== 33 && u !== 63 && u !== 47 && !Lf(u))
    return !1;
  const i = t.src.slice(r).match(ff);
  if (!i)
    return !1;
  if (!e) {
    const o = t.push("html_inline", "", 0);
    o.content = i[0], zf(o.content) && t.linkLevel++, jf(o.content) && t.linkLevel--;
  }
  return t.pos += i[0].length, !0;
}
const vf = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, Rf = /^&([a-z][a-z0-9]{1,31});/i;
function Bf(t, e) {
  const n = t.pos, r = t.posMax;
  if (t.src.charCodeAt(n) !== 38 || n + 1 >= r)
    return !1;
  if (t.src.charCodeAt(n + 1) === 35) {
    const i = t.src.slice(n).match(vf);
    if (i) {
      if (!e) {
        const o = i[1][0].toLowerCase() === "x" ? parseInt(i[1].slice(1), 16) : parseInt(i[1], 10), s = t.push("text_special", "", 0);
        s.content = du(o) ? jn(o) : jn(65533), s.markup = i[0], s.info = "entity";
      }
      return t.pos += i[0].length, !0;
    }
  } else {
    const i = t.src.slice(n).match(Rf);
    if (i) {
      const o = cs(i[0]);
      if (o !== i[0]) {
        if (!e) {
          const s = t.push("text_special", "", 0);
          s.content = o, s.markup = i[0], s.info = "entity";
        }
        return t.pos += i[0].length, !0;
      }
    }
  }
  return !1;
}
function Si(t) {
  const e = {}, n = t.length;
  if (!n)
    return;
  let r = 0, u = -2;
  const i = [];
  for (let o = 0; o < n; o++) {
    const s = t[o];
    if (i.push(0), (t[r].marker !== s.marker || u !== s.token - 1) && (r = o), u = s.token, s.length = s.length || 0, !s.close)
      continue;
    e.hasOwnProperty(s.marker) || (e[s.marker] = [-1, -1, -1, -1, -1, -1]);
    const l = e[s.marker][(s.open ? 3 : 0) + s.length % 3];
    let a = r - i[r] - 1, c = a;
    for (; a > l; a -= i[a] + 1) {
      const f = t[a];
      if (f.marker === s.marker && f.open && f.end < 0) {
        let d = !1;
        if ((f.close || s.open) && (f.length + s.length) % 3 === 0 && (f.length % 3 !== 0 || s.length % 3 !== 0) && (d = !0), !d) {
          const p = a > 0 && !t[a - 1].open ? i[a - 1] + 1 : 0;
          i[o] = o - a + p, i[a] = p, s.open = !1, f.end = o, f.close = !1, c = -1, u = -2;
          break;
        }
      }
    }
    c !== -1 && (e[s.marker][(s.open ? 3 : 0) + (s.length || 0) % 3] = c);
  }
}
function Pf(t) {
  const e = t.tokens_meta, n = t.tokens_meta.length;
  Si(t.delimiters);
  for (let r = 0; r < n; r++)
    e[r] && e[r].delimiters && Si(e[r].delimiters);
}
function Uf(t) {
  let e, n, r = 0;
  const u = t.tokens, i = t.tokens.length;
  for (e = n = 0; e < i; e++)
    u[e].nesting < 0 && r--, u[e].level = r, u[e].nesting > 0 && r++, u[e].type === "text" && e + 1 < i && u[e + 1].type === "text" ? u[e + 1].content = u[e].content + u[e + 1].content : (e !== n && (u[n] = u[e]), n++);
  e !== n && (u.length = n);
}
const dr = [
  ["text", xf],
  ["linkify", yf],
  ["newline", kf],
  ["escape", Df],
  ["backticks", Nf],
  ["strikethrough", bs.tokenize],
  ["emphasis", xs.tokenize],
  ["link", If],
  ["image", Sf],
  ["autolink", _f],
  ["html_inline", Ff],
  ["entity", Bf]
], hr = [
  ["balance_pairs", Pf],
  ["strikethrough", bs.postProcess],
  ["emphasis", xs.postProcess],
  // rules for pairs separate '**' into its own text tokens, which may be left unused,
  // rule below merges unused segments back with the rest of the text
  ["fragments_join", Uf]
];
function fn() {
  this.ruler = new ee();
  for (let t = 0; t < dr.length; t++)
    this.ruler.push(dr[t][0], dr[t][1]);
  this.ruler2 = new ee();
  for (let t = 0; t < hr.length; t++)
    this.ruler2.push(hr[t][0], hr[t][1]);
}
fn.prototype.skipToken = function(t) {
  const e = t.pos, n = this.ruler.getRules(""), r = n.length, u = t.md.options.maxNesting, i = t.cache;
  if (typeof i[e] < "u") {
    t.pos = i[e];
    return;
  }
  let o = !1;
  if (t.level < u) {
    for (let s = 0; s < r; s++)
      if (t.level++, o = n[s](t, !0), t.level--, o) {
        if (e >= t.pos)
          throw new Error("inline rule didn't increment state.pos");
        break;
      }
  } else
    t.pos = t.posMax;
  o || t.pos++, i[e] = t.pos;
};
fn.prototype.tokenize = function(t) {
  const e = this.ruler.getRules(""), n = e.length, r = t.posMax, u = t.md.options.maxNesting;
  for (; t.pos < r; ) {
    const i = t.pos;
    let o = !1;
    if (t.level < u) {
      for (let s = 0; s < n; s++)
        if (o = e[s](t, !1), o) {
          if (i >= t.pos)
            throw new Error("inline rule didn't increment state.pos");
          break;
        }
    }
    if (o) {
      if (t.pos >= r)
        break;
      continue;
    }
    t.pending += t.src[t.pos++];
  }
  t.pending && t.pushPending();
};
fn.prototype.parse = function(t, e, n, r) {
  const u = new this.State(t, e, n, r);
  this.tokenize(u);
  const i = this.ruler2.getRules(""), o = i.length;
  for (let s = 0; s < o; s++)
    i[s](u);
};
fn.prototype.State = cn;
function qf(t) {
  const e = {};
  t = t || {}, e.src_Any = us.source, e.src_Cc = is.source, e.src_Z = ls.source, e.src_P = cu.source, e.src_ZPCc = [e.src_Z, e.src_P, e.src_Cc].join("|"), e.src_ZCc = [e.src_Z, e.src_Cc].join("|");
  const n = "[><｜]";
  return e.src_pseudo_letter = "(?:(?!" + n + "|" + e.src_ZPCc + ")" + e.src_Any + ")", e.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", e.src_auth = "(?:(?:(?!" + e.src_ZCc + "|[@/\\[\\]()]).)+@)?", e.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", e.src_host_terminator = "(?=$|" + n + "|" + e.src_ZPCc + ")(?!" + (t["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + e.src_ZPCc + "))", e.src_path = "(?:[/?#](?:(?!" + e.src_ZCc + "|" + n + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + e.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + e.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + e.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + e.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + e.src_ZCc + "|[']).)+\\'|\\'(?=" + e.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + e.src_ZCc + "|[.]|$)|" + (t["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + // allow `,,,` in paths
  ",(?!" + e.src_ZCc + "|$)|;(?!" + e.src_ZCc + "|$)|\\!+(?!" + e.src_ZCc + "|[!]|$)|\\?(?!" + e.src_ZCc + "|[?]|$))+|\\/)?", e.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*', e.src_xn = "xn--[a-z0-9\\-]{1,59}", e.src_domain_root = // Allow letters & digits (http://test1)
  "(?:" + e.src_xn + "|" + e.src_pseudo_letter + "{1,63})", e.src_domain = "(?:" + e.src_xn + "|(?:" + e.src_pseudo_letter + ")|(?:" + e.src_pseudo_letter + "(?:-|" + e.src_pseudo_letter + "){0,61}" + e.src_pseudo_letter + "))", e.src_host = "(?:(?:(?:(?:" + e.src_domain + ")\\.)*" + e.src_domain + "))", e.tpl_host_fuzzy = "(?:" + e.src_ip4 + "|(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%)))", e.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%))", e.src_host_strict = e.src_host + e.src_host_terminator, e.tpl_host_fuzzy_strict = e.tpl_host_fuzzy + e.src_host_terminator, e.src_host_port_strict = e.src_host + e.src_port + e.src_host_terminator, e.tpl_host_port_fuzzy_strict = e.tpl_host_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_port_no_ip_fuzzy_strict = e.tpl_host_no_ip_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + e.src_ZPCc + "|>|$))", e.tpl_email_fuzzy = "(^|" + n + '|"|\\(|' + e.src_ZCc + ")(" + e.src_email_name + "@" + e.tpl_host_fuzzy_strict + ")", e.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_fuzzy_strict + e.src_path + ")", e.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
  // but can start with > (markdown blockquote)
  "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_no_ip_fuzzy_strict + e.src_path + ")", e;
}
function qr(t) {
  return Array.prototype.slice.call(arguments, 1).forEach(function(n) {
    n && Object.keys(n).forEach(function(r) {
      t[r] = n[r];
    });
  }), t;
}
function Yn(t) {
  return Object.prototype.toString.call(t);
}
function Vf(t) {
  return Yn(t) === "[object String]";
}
function Qf(t) {
  return Yn(t) === "[object Object]";
}
function $f(t) {
  return Yn(t) === "[object RegExp]";
}
function wi(t) {
  return Yn(t) === "[object Function]";
}
function Yf(t) {
  return t.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
const Ms = {
  fuzzyLink: !0,
  fuzzyEmail: !0,
  fuzzyIP: !1
};
function Wf(t) {
  return Object.keys(t || {}).reduce(function(e, n) {
    return e || Ms.hasOwnProperty(n);
  }, !1);
}
const Hf = {
  "http:": {
    validate: function(t, e, n) {
      const r = t.slice(e);
      return n.re.http || (n.re.http = new RegExp(
        "^\\/\\/" + n.re.src_auth + n.re.src_host_port_strict + n.re.src_path,
        "i"
      )), n.re.http.test(r) ? r.match(n.re.http)[0].length : 0;
    }
  },
  "https:": "http:",
  "ftp:": "http:",
  "//": {
    validate: function(t, e, n) {
      const r = t.slice(e);
      return n.re.no_http || (n.re.no_http = new RegExp(
        "^" + n.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
        // with code comments
        "(?:localhost|(?:(?:" + n.re.src_domain + ")\\.)+" + n.re.src_domain_root + ")" + n.re.src_port + n.re.src_host_terminator + n.re.src_path,
        "i"
      )), n.re.no_http.test(r) ? e >= 3 && t[e - 3] === ":" || e >= 3 && t[e - 3] === "/" ? 0 : r.match(n.re.no_http)[0].length : 0;
    }
  },
  "mailto:": {
    validate: function(t, e, n) {
      const r = t.slice(e);
      return n.re.mailto || (n.re.mailto = new RegExp(
        "^" + n.re.src_email_name + "@" + n.re.src_host_strict,
        "i"
      )), n.re.mailto.test(r) ? r.match(n.re.mailto)[0].length : 0;
    }
  }
}, Jf = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", Zf = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function Gf(t) {
  t.__index__ = -1, t.__text_cache__ = "";
}
function Kf(t) {
  return function(e, n) {
    const r = e.slice(n);
    return t.test(r) ? r.match(t)[0].length : 0;
  };
}
function Oi() {
  return function(t, e) {
    e.normalize(t);
  };
}
function Ln(t) {
  const e = t.re = qf(t.__opts__), n = t.__tlds__.slice();
  t.onCompile(), t.__tlds_replaced__ || n.push(Jf), n.push(e.src_xn), e.src_tlds = n.join("|");
  function r(s) {
    return s.replace("%TLDS%", e.src_tlds);
  }
  e.email_fuzzy = RegExp(r(e.tpl_email_fuzzy), "i"), e.link_fuzzy = RegExp(r(e.tpl_link_fuzzy), "i"), e.link_no_ip_fuzzy = RegExp(r(e.tpl_link_no_ip_fuzzy), "i"), e.host_fuzzy_test = RegExp(r(e.tpl_host_fuzzy_test), "i");
  const u = [];
  t.__compiled__ = {};
  function i(s, l) {
    throw new Error('(LinkifyIt) Invalid schema "' + s + '": ' + l);
  }
  Object.keys(t.__schemas__).forEach(function(s) {
    const l = t.__schemas__[s];
    if (l === null)
      return;
    const a = { validate: null, link: null };
    if (t.__compiled__[s] = a, Qf(l)) {
      $f(l.validate) ? a.validate = Kf(l.validate) : wi(l.validate) ? a.validate = l.validate : i(s, l), wi(l.normalize) ? a.normalize = l.normalize : l.normalize ? i(s, l) : a.normalize = Oi();
      return;
    }
    if (Vf(l)) {
      u.push(s);
      return;
    }
    i(s, l);
  }), u.forEach(function(s) {
    t.__compiled__[t.__schemas__[s]] && (t.__compiled__[s].validate = t.__compiled__[t.__schemas__[s]].validate, t.__compiled__[s].normalize = t.__compiled__[t.__schemas__[s]].normalize);
  }), t.__compiled__[""] = { validate: null, normalize: Oi() };
  const o = Object.keys(t.__compiled__).filter(function(s) {
    return s.length > 0 && t.__compiled__[s];
  }).map(Yf).join("|");
  t.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + o + ")", "i"), t.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + o + ")", "ig"), t.re.schema_at_start = RegExp("^" + t.re.schema_search.source, "i"), t.re.pretest = RegExp(
    "(" + t.re.schema_test.source + ")|(" + t.re.host_fuzzy_test.source + ")|@",
    "i"
  ), Gf(t);
}
function Xf(t, e) {
  const n = t.__index__, r = t.__last_index__, u = t.__text_cache__.slice(n, r);
  this.schema = t.__schema__.toLowerCase(), this.index = n + e, this.lastIndex = r + e, this.raw = u, this.text = u, this.url = u;
}
function Vr(t, e) {
  const n = new Xf(t, e);
  return t.__compiled__[n.schema].normalize(n, t), n;
}
function ue(t, e) {
  if (!(this instanceof ue))
    return new ue(t, e);
  e || Wf(t) && (e = t, t = {}), this.__opts__ = qr({}, Ms, e), this.__index__ = -1, this.__last_index__ = -1, this.__schema__ = "", this.__text_cache__ = "", this.__schemas__ = qr({}, Hf, t), this.__compiled__ = {}, this.__tlds__ = Zf, this.__tlds_replaced__ = !1, this.re = {}, Ln(this);
}
ue.prototype.add = function(e, n) {
  return this.__schemas__[e] = n, Ln(this), this;
};
ue.prototype.set = function(e) {
  return this.__opts__ = qr(this.__opts__, e), this;
};
ue.prototype.test = function(e) {
  if (this.__text_cache__ = e, this.__index__ = -1, !e.length)
    return !1;
  let n, r, u, i, o, s, l, a, c;
  if (this.re.schema_test.test(e)) {
    for (l = this.re.schema_search, l.lastIndex = 0; (n = l.exec(e)) !== null; )
      if (i = this.testSchemaAt(e, n[2], l.lastIndex), i) {
        this.__schema__ = n[2], this.__index__ = n.index + n[1].length, this.__last_index__ = n.index + n[0].length + i;
        break;
      }
  }
  return this.__opts__.fuzzyLink && this.__compiled__["http:"] && (a = e.search(this.re.host_fuzzy_test), a >= 0 && (this.__index__ < 0 || a < this.__index__) && (r = e.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null && (o = r.index + r[1].length, (this.__index__ < 0 || o < this.__index__) && (this.__schema__ = "", this.__index__ = o, this.__last_index__ = r.index + r[0].length))), this.__opts__.fuzzyEmail && this.__compiled__["mailto:"] && (c = e.indexOf("@"), c >= 0 && (u = e.match(this.re.email_fuzzy)) !== null && (o = u.index + u[1].length, s = u.index + u[0].length, (this.__index__ < 0 || o < this.__index__ || o === this.__index__ && s > this.__last_index__) && (this.__schema__ = "mailto:", this.__index__ = o, this.__last_index__ = s))), this.__index__ >= 0;
};
ue.prototype.pretest = function(e) {
  return this.re.pretest.test(e);
};
ue.prototype.testSchemaAt = function(e, n, r) {
  return this.__compiled__[n.toLowerCase()] ? this.__compiled__[n.toLowerCase()].validate(e, r, this) : 0;
};
ue.prototype.match = function(e) {
  const n = [];
  let r = 0;
  this.__index__ >= 0 && this.__text_cache__ === e && (n.push(Vr(this, r)), r = this.__last_index__);
  let u = r ? e.slice(r) : e;
  for (; this.test(u); )
    n.push(Vr(this, r)), u = u.slice(this.__last_index__), r += this.__last_index__;
  return n.length ? n : null;
};
ue.prototype.matchAtStart = function(e) {
  if (this.__text_cache__ = e, this.__index__ = -1, !e.length)
    return null;
  const n = this.re.schema_at_start.exec(e);
  if (!n)
    return null;
  const r = this.testSchemaAt(e, n[2], n[0].length);
  return r ? (this.__schema__ = n[2], this.__index__ = n.index + n[1].length, this.__last_index__ = n.index + n[0].length + r, Vr(this, 0)) : null;
};
ue.prototype.tlds = function(e, n) {
  return e = Array.isArray(e) ? e : [e], n ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(r, u, i) {
    return r !== i[u - 1];
  }).reverse(), Ln(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, Ln(this), this);
};
ue.prototype.normalize = function(e) {
  e.schema || (e.url = "http://" + e.url), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = "mailto:" + e.url);
};
ue.prototype.onCompile = function() {
};
const Dt = 2147483647, ye = 36, mu = 1, tn = 26, ed = 38, td = 700, ys = 72, ks = 128, Ds = "-", nd = /^xn--/, rd = /[^\0-\x7F]/, ud = /[\x2E\u3002\uFF0E\uFF61]/g, id = {
  overflow: "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
}, pr = ye - mu, ke = Math.floor, mr = String.fromCharCode;
function Fe(t) {
  throw new RangeError(id[t]);
}
function od(t, e) {
  const n = [];
  let r = t.length;
  for (; r--; )
    n[r] = e(t[r]);
  return n;
}
function Ns(t, e) {
  const n = t.split("@");
  let r = "";
  n.length > 1 && (r = n[0] + "@", t = n[1]), t = t.replace(ud, ".");
  const u = t.split("."), i = od(u, e).join(".");
  return r + i;
}
function Cs(t) {
  const e = [];
  let n = 0;
  const r = t.length;
  for (; n < r; ) {
    const u = t.charCodeAt(n++);
    if (u >= 55296 && u <= 56319 && n < r) {
      const i = t.charCodeAt(n++);
      (i & 64512) == 56320 ? e.push(((u & 1023) << 10) + (i & 1023) + 65536) : (e.push(u), n--);
    } else
      e.push(u);
  }
  return e;
}
const sd = (t) => String.fromCodePoint(...t), ld = function(t) {
  return t >= 48 && t < 58 ? 26 + (t - 48) : t >= 65 && t < 91 ? t - 65 : t >= 97 && t < 123 ? t - 97 : ye;
}, _i = function(t, e) {
  return t + 22 + 75 * (t < 26) - ((e != 0) << 5);
}, As = function(t, e, n) {
  let r = 0;
  for (t = n ? ke(t / td) : t >> 1, t += ke(t / e); t > pr * tn >> 1; r += ye)
    t = ke(t / pr);
  return ke(r + (pr + 1) * t / (t + ed));
}, Es = function(t) {
  const e = [], n = t.length;
  let r = 0, u = ks, i = ys, o = t.lastIndexOf(Ds);
  o < 0 && (o = 0);
  for (let s = 0; s < o; ++s)
    t.charCodeAt(s) >= 128 && Fe("not-basic"), e.push(t.charCodeAt(s));
  for (let s = o > 0 ? o + 1 : 0; s < n; ) {
    const l = r;
    for (let c = 1, f = ye; ; f += ye) {
      s >= n && Fe("invalid-input");
      const d = ld(t.charCodeAt(s++));
      d >= ye && Fe("invalid-input"), d > ke((Dt - r) / c) && Fe("overflow"), r += d * c;
      const p = f <= i ? mu : f >= i + tn ? tn : f - i;
      if (d < p)
        break;
      const h = ye - p;
      c > ke(Dt / h) && Fe("overflow"), c *= h;
    }
    const a = e.length + 1;
    i = As(r - l, a, l == 0), ke(r / a) > Dt - u && Fe("overflow"), u += ke(r / a), r %= a, e.splice(r++, 0, u);
  }
  return String.fromCodePoint(...e);
}, Ts = function(t) {
  const e = [];
  t = Cs(t);
  const n = t.length;
  let r = ks, u = 0, i = ys;
  for (const l of t)
    l < 128 && e.push(mr(l));
  const o = e.length;
  let s = o;
  for (o && e.push(Ds); s < n; ) {
    let l = Dt;
    for (const c of t)
      c >= r && c < l && (l = c);
    const a = s + 1;
    l - r > ke((Dt - u) / a) && Fe("overflow"), u += (l - r) * a, r = l;
    for (const c of t)
      if (c < r && ++u > Dt && Fe("overflow"), c === r) {
        let f = u;
        for (let d = ye; ; d += ye) {
          const p = d <= i ? mu : d >= i + tn ? tn : d - i;
          if (f < p)
            break;
          const h = f - p, m = ye - p;
          e.push(
            mr(_i(p + h % m, 0))
          ), f = ke(h / m);
        }
        e.push(mr(_i(f, 0))), i = As(u, a, s === o), u = 0, ++s;
      }
    ++u, ++r;
  }
  return e.join("");
}, ad = function(t) {
  return Ns(t, function(e) {
    return nd.test(e) ? Es(e.slice(4).toLowerCase()) : e;
  });
}, cd = function(t) {
  return Ns(t, function(e) {
    return rd.test(e) ? "xn--" + Ts(e) : e;
  });
}, Is = {
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
    decode: Cs,
    encode: sd
  },
  decode: Es,
  encode: Ts,
  toASCII: cd,
  toUnicode: ad
}, fd = {
  options: {
    // Enable HTML tags in source
    html: !1,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !1,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
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
    // Internal protection, recursion limit
    maxNesting: 100
  },
  components: {
    core: {},
    block: {},
    inline: {}
  }
}, dd = {
  options: {
    // Enable HTML tags in source
    html: !1,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !1,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
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
    // Internal protection, recursion limit
    maxNesting: 20
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
}, hd = {
  options: {
    // Enable HTML tags in source
    html: !0,
    // Use '/' to close single tags (<br />)
    xhtmlOut: !0,
    // Convert '\n' in paragraphs into <br>
    breaks: !1,
    // CSS language prefix for fenced blocks
    langPrefix: "language-",
    // autoconvert URL-like texts to links
    linkify: !1,
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
    // Internal protection, recursion limit
    maxNesting: 20
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
}, pd = {
  default: fd,
  zero: dd,
  commonmark: hd
}, md = /^(vbscript|javascript|file|data):/, gd = /^data:image\/(gif|png|jpeg|webp);/;
function bd(t) {
  const e = t.trim().toLowerCase();
  return md.test(e) ? gd.test(e) : !0;
}
const Ss = ["http:", "https:", "mailto:"];
function xd(t) {
  const e = au(t, !0);
  if (e.hostname && (!e.protocol || Ss.indexOf(e.protocol) >= 0))
    try {
      e.hostname = Is.toASCII(e.hostname);
    } catch {
    }
  return an(lu(e));
}
function Md(t) {
  const e = au(t, !0);
  if (e.hostname && (!e.protocol || Ss.indexOf(e.protocol) >= 0))
    try {
      e.hostname = Is.toUnicode(e.hostname);
    } catch {
    }
  return Tt(lu(e), Tt.defaultChars + "%");
}
function fe(t, e) {
  if (!(this instanceof fe))
    return new fe(t, e);
  e || fu(t) || (e = t || {}, t = "default"), this.inline = new fn(), this.block = new $n(), this.core = new hu(), this.renderer = new zt(), this.linkify = new ue(), this.validateLink = bd, this.normalizeLink = xd, this.normalizeLinkText = Md, this.utils = y0, this.helpers = Vn({}, C0), this.options = {}, this.configure(t), e && this.set(e);
}
fe.prototype.set = function(t) {
  return Vn(this.options, t), this;
};
fe.prototype.configure = function(t) {
  const e = this;
  if (fu(t)) {
    const n = t;
    if (t = pd[n], !t)
      throw new Error('Wrong `markdown-it` preset "' + n + '", check name');
  }
  if (!t)
    throw new Error("Wrong `markdown-it` preset, can't be empty");
  return t.options && e.set(t.options), t.components && Object.keys(t.components).forEach(function(n) {
    t.components[n].rules && e[n].ruler.enableOnly(t.components[n].rules), t.components[n].rules2 && e[n].ruler2.enableOnly(t.components[n].rules2);
  }), this;
};
fe.prototype.enable = function(t, e) {
  let n = [];
  Array.isArray(t) || (t = [t]), ["core", "block", "inline"].forEach(function(u) {
    n = n.concat(this[u].ruler.enable(t, !0));
  }, this), n = n.concat(this.inline.ruler2.enable(t, !0));
  const r = t.filter(function(u) {
    return n.indexOf(u) < 0;
  });
  if (r.length && !e)
    throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + r);
  return this;
};
fe.prototype.disable = function(t, e) {
  let n = [];
  Array.isArray(t) || (t = [t]), ["core", "block", "inline"].forEach(function(u) {
    n = n.concat(this[u].ruler.disable(t, !0));
  }, this), n = n.concat(this.inline.ruler2.disable(t, !0));
  const r = t.filter(function(u) {
    return n.indexOf(u) < 0;
  });
  if (r.length && !e)
    throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + r);
  return this;
};
fe.prototype.use = function(t) {
  const e = [this].concat(Array.prototype.slice.call(arguments, 1));
  return t.apply(t, e), this;
};
fe.prototype.parse = function(t, e) {
  if (typeof t != "string")
    throw new Error("Input data should be a String");
  const n = new this.core.State(t, this, e);
  return this.core.process(n), n.tokens;
};
fe.prototype.render = function(t, e) {
  return e = e || {}, this.renderer.render(this.parse(t, e), this.options, e);
};
fe.prototype.parseInline = function(t, e) {
  const n = new this.core.State(t, this, e);
  return n.inlineMode = !0, this.core.process(n), n.tokens;
};
fe.prototype.renderInline = function(t, e) {
  return e = e || {}, this.renderer.render(this.parseInline(t, e), this.options, e);
};
const yd = new io({
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
      toDOM(t) {
        return ["h" + t.attrs.level, 0];
      }
    },
    code_block: {
      content: "text*",
      group: "block",
      code: !0,
      defining: !0,
      marks: "",
      attrs: { params: { default: "" } },
      parseDOM: [{ tag: "pre", preserveWhitespace: "full", getAttrs: (t) => ({ params: t.getAttribute("data-params") || "" }) }],
      toDOM(t) {
        return ["pre", t.attrs.params ? { "data-params": t.attrs.params } : {}, ["code", 0]];
      }
    },
    ordered_list: {
      content: "list_item+",
      group: "block",
      attrs: { order: { default: 1 }, tight: { default: !1 } },
      parseDOM: [{ tag: "ol", getAttrs(t) {
        return {
          order: t.hasAttribute("start") ? +t.getAttribute("start") : 1,
          tight: t.hasAttribute("data-tight")
        };
      } }],
      toDOM(t) {
        return ["ol", {
          start: t.attrs.order == 1 ? null : t.attrs.order,
          "data-tight": t.attrs.tight ? "true" : null
        }, 0];
      }
    },
    bullet_list: {
      content: "list_item+",
      group: "block",
      attrs: { tight: { default: !1 } },
      parseDOM: [{ tag: "ul", getAttrs: (t) => ({ tight: t.hasAttribute("data-tight") }) }],
      toDOM(t) {
        return ["ul", { "data-tight": t.attrs.tight ? "true" : null }, 0];
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
      parseDOM: [{ tag: "img[src]", getAttrs(t) {
        return {
          src: t.getAttribute("src"),
          title: t.getAttribute("title"),
          alt: t.getAttribute("alt")
        };
      } }],
      toDOM(t) {
        return ["img", t.attrs];
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
        { style: "font-style=normal", clearMark: (t) => t.type.name == "em" }
      ],
      toDOM() {
        return ["em"];
      }
    },
    strong: {
      parseDOM: [
        { tag: "strong" },
        { tag: "b", getAttrs: (t) => t.style.fontWeight != "normal" && null },
        { style: "font-weight=400", clearMark: (t) => t.type.name == "strong" },
        { style: "font-weight", getAttrs: (t) => /^(bold(er)?|[5-9]\d{2,})$/.test(t) && null }
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
      parseDOM: [{ tag: "a[href]", getAttrs(t) {
        return { href: t.getAttribute("href"), title: t.getAttribute("title") };
      } }],
      toDOM(t) {
        return ["a", t.attrs];
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
function kd(t, e) {
  if (t.isText && e.isText && I.sameSet(t.marks, e.marks))
    return t.withText(t.text + e.text);
}
class Dd {
  constructor(e, n) {
    this.schema = e, this.tokenHandlers = n, this.stack = [{ type: e.topNodeType, attrs: null, content: [], marks: I.none }];
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
    let n = this.top(), r = n.content, u = r[r.length - 1], i = this.schema.text(e, n.marks), o;
    u && (o = kd(u, i)) ? r[r.length - 1] = o : r.push(i);
  }
  // Adds the given mark to the set of active marks.
  openMark(e) {
    let n = this.top();
    n.marks = e.addToSet(n.marks);
  }
  // Removes the given mark from the set of active marks.
  closeMark(e) {
    let n = this.top();
    n.marks = e.removeFromSet(n.marks);
  }
  parseTokens(e) {
    for (let n = 0; n < e.length; n++) {
      let r = e[n], u = this.tokenHandlers[r.type];
      if (!u)
        throw new Error("Token type `" + r.type + "` not supported by Markdown parser");
      u(this, r, e, n);
    }
  }
  // Add a node at the current position.
  addNode(e, n, r) {
    let u = this.top(), i = e.createAndFill(n, r, u ? u.marks : []);
    return i ? (this.push(i), i) : null;
  }
  // Wrap subsequent content in a node of the given type.
  openNode(e, n) {
    this.stack.push({ type: e, attrs: n, content: [], marks: I.none });
  }
  // Close and return the node that is currently on top of the stack.
  closeNode() {
    let e = this.stack.pop();
    return this.addNode(e.type, e.attrs, e.content);
  }
}
function Lt(t, e, n, r) {
  return t.getAttrs ? t.getAttrs(e, n, r) : t.attrs instanceof Function ? t.attrs(e) : t.attrs;
}
function gr(t, e) {
  return t.noCloseToken || e == "code_inline" || e == "code_block" || e == "fence";
}
function zi(t) {
  return t[t.length - 1] == `
` ? t.slice(0, t.length - 1) : t;
}
function br() {
}
function Nd(t, e) {
  let n = /* @__PURE__ */ Object.create(null);
  for (let r in e) {
    let u = e[r];
    if (u.block) {
      let i = t.nodeType(u.block);
      gr(u, r) ? n[r] = (o, s, l, a) => {
        o.openNode(i, Lt(u, s, l, a)), o.addText(zi(s.content)), o.closeNode();
      } : (n[r + "_open"] = (o, s, l, a) => o.openNode(i, Lt(u, s, l, a)), n[r + "_close"] = (o) => o.closeNode());
    } else if (u.node) {
      let i = t.nodeType(u.node);
      n[r] = (o, s, l, a) => o.addNode(i, Lt(u, s, l, a));
    } else if (u.mark) {
      let i = t.marks[u.mark];
      gr(u, r) ? n[r] = (o, s, l, a) => {
        o.openMark(i.create(Lt(u, s, l, a))), o.addText(zi(s.content)), o.closeMark(i);
      } : (n[r + "_open"] = (o, s, l, a) => o.openMark(i.create(Lt(u, s, l, a))), n[r + "_close"] = (o) => o.closeMark(i));
    } else if (u.ignore)
      gr(u, r) ? n[r] = br : (n[r + "_open"] = br, n[r + "_close"] = br);
    else
      throw new RangeError("Unrecognized parsing spec " + JSON.stringify(u));
  }
  return n.text = (r, u) => r.addText(u.content), n.inline = (r, u) => r.parseTokens(u.children), n.softbreak = n.softbreak || ((r) => r.addText(" ")), n;
}
class Cd {
  /**
  Create a parser with the given configuration. You can configure
  the markdown-it parser to parse the dialect you want, and provide
  a description of the ProseMirror entities those tokens map to in
  the `tokens` object, which maps token names to descriptions of
  what to do with them. Such a description is an object, and may
  have the following properties:
  */
  constructor(e, n, r) {
    this.schema = e, this.tokenizer = n, this.tokens = r, this.tokenHandlers = Nd(e, r);
  }
  /**
  Parse a string as [CommonMark](http://commonmark.org/) markup,
  and create a ProseMirror document as prescribed by this parser's
  rules.
  
  The second argument, when given, is passed through to the
  [Markdown
  parser](https://markdown-it.github.io/markdown-it/#MarkdownIt.parse).
  */
  parse(e, n = {}) {
    let r = new Dd(this.schema, this.tokenHandlers), u;
    r.parseTokens(this.tokenizer.parse(e, n));
    do
      u = r.closeNode();
    while (r.stack.length);
    return u || this.schema.topNodeType.createAndFill();
  }
}
function ji(t, e) {
  for (; ++e < t.length; )
    if (t[e].type != "list_item_open")
      return t[e].hidden;
  return !1;
}
new Cd(yd, fe("commonmark", { html: !1 }), {
  blockquote: { block: "blockquote" },
  paragraph: { block: "paragraph" },
  list_item: { block: "list_item" },
  bullet_list: { block: "bullet_list", getAttrs: (t, e, n) => ({ tight: ji(e, n) }) },
  ordered_list: { block: "ordered_list", getAttrs: (t, e, n) => ({
    order: +t.attrGet("start") || 1,
    tight: ji(e, n)
  }) },
  heading: { block: "heading", getAttrs: (t) => ({ level: +t.tag.slice(1) }) },
  code_block: { block: "code_block", noCloseToken: !0 },
  fence: { block: "code_block", getAttrs: (t) => ({ params: t.info || "" }), noCloseToken: !0 },
  hr: { node: "horizontal_rule" },
  image: { node: "image", getAttrs: (t) => ({
    src: t.attrGet("src"),
    title: t.attrGet("title") || null,
    alt: t.children[0] && t.children[0].content || null
  }) },
  hardbreak: { node: "hard_break" },
  em: { mark: "em" },
  strong: { mark: "strong" },
  link: { mark: "link", getAttrs: (t) => ({
    href: t.attrGet("href"),
    title: t.attrGet("title") || null
  }) },
  code_inline: { mark: "code", noCloseToken: !0 }
});
class Ad {
  /**
  Construct a serializer with the given configuration. The `nodes`
  object should map node names in a given schema to function that
  take a serializer state and such a node, and serialize the node.
  */
  constructor(e, n, r = {}) {
    this.nodes = e, this.marks = n, this.options = r;
  }
  /**
  Serialize the content of the given node to
  [CommonMark](http://commonmark.org/).
  */
  serialize(e, n = {}) {
    n = Object.assign({}, this.options, n);
    let r = new Ed(this.nodes, this.marks, n);
    return r.renderContent(e), r.out;
  }
}
class Ed {
  /**
  @internal
  */
  constructor(e, n, r) {
    this.nodes = e, this.marks = n, this.options = r, this.delim = "", this.out = "", this.closed = null, this.inAutolink = void 0, this.atBlockStart = !1, this.inTightList = !1, typeof this.options.tightLists > "u" && (this.options.tightLists = !1), typeof this.options.hardBreakNodeName > "u" && (this.options.hardBreakNodeName = "hard_break");
  }
  /**
  @internal
  */
  flushClose(e = 2) {
    if (this.closed) {
      if (this.atBlank() || (this.out += `
`), e > 1) {
        let n = this.delim, r = /\s+$/.exec(n);
        r && (n = n.slice(0, n.length - r[0].length));
        for (let u = 1; u < e; u++)
          this.out += n + `
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
  wrapBlock(e, n, r, u) {
    let i = this.delim;
    this.write(n ?? e), this.delim += e, u(), this.delim = i, this.closeBlock(r);
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
  text(e, n = !0) {
    let r = e.split(`
`);
    for (let u = 0; u < r.length; u++)
      this.write(), !n && r[u][0] == "[" && /(^|[^\\])\!$/.test(this.out) && (this.out = this.out.slice(0, this.out.length - 1) + "\\!"), this.out += n ? this.esc(r[u], this.atBlockStart) : r[u], u != r.length - 1 && (this.out += `
`);
  }
  /**
  Render the given node as a block.
  */
  render(e, n, r) {
    if (!this.nodes[e.type.name])
      throw new Error("Token type `" + e.type.name + "` not supported by Markdown renderer");
    this.nodes[e.type.name](this, e, n, r);
  }
  /**
  Render the contents of `parent` as block nodes.
  */
  renderContent(e) {
    e.forEach((n, r, u) => this.render(n, e, u));
  }
  /**
  Render the contents of `parent` as inline content.
  */
  renderInline(e, n = !0) {
    this.atBlockStart = n;
    let r = [], u = "", i = (o, s, l) => {
      let a = o ? o.marks : [];
      o && o.type.name === this.options.hardBreakNodeName && (a = a.filter((m) => {
        if (l + 1 == e.childCount)
          return !1;
        let g = e.child(l + 1);
        return m.isInSet(g.marks) && (!g.isText || /\S/.test(g.text));
      }));
      let c = u;
      if (u = "", o && o.isText && a.some((m) => {
        let g = this.marks[m.type.name];
        return g && g.expelEnclosingWhitespace && !m.isInSet(r);
      })) {
        let [m, g, b] = /^(\s*)(.*)$/m.exec(o.text);
        g && (c += g, o = b ? o.withText(b) : null, o || (a = r));
      }
      if (o && o.isText && a.some((m) => {
        let g = this.marks[m.type.name];
        return g && g.expelEnclosingWhitespace && (l == e.childCount - 1 || !m.isInSet(e.child(l + 1).marks));
      })) {
        let [m, g, b] = /^(.*?)(\s*)$/m.exec(o.text);
        b && (u = b, o = g ? o.withText(g) : null, o || (a = r));
      }
      let f = a.length ? a[a.length - 1] : null, d = f && this.marks[f.type.name].escape === !1, p = a.length - (d ? 1 : 0);
      e:
        for (let m = 0; m < p; m++) {
          let g = a[m];
          if (!this.marks[g.type.name].mixable)
            break;
          for (let b = 0; b < r.length; b++) {
            let y = r[b];
            if (!this.marks[y.type.name].mixable)
              break;
            if (g.eq(y)) {
              m > b ? a = a.slice(0, b).concat(g).concat(a.slice(b, m)).concat(a.slice(m + 1, p)) : b > m && (a = a.slice(0, m).concat(a.slice(m + 1, b)).concat(g).concat(a.slice(b, p)));
              continue e;
            }
          }
        }
      let h = 0;
      for (; h < Math.min(r.length, p) && a[h].eq(r[h]); )
        ++h;
      for (; h < r.length; )
        this.text(this.markString(r.pop(), !1, e, l), !1);
      if (c && this.text(c), o) {
        for (; r.length < p; ) {
          let m = a[r.length];
          r.push(m), this.text(this.markString(m, !0, e, l), !1), this.atBlockStart = !1;
        }
        d && o.isText ? this.text(this.markString(f, !0, e, l) + o.text + this.markString(f, !1, e, l + 1), !1) : this.render(o, e, l), this.atBlockStart = !1;
      }
      o != null && o.isText && o.nodeSize > 0 && (this.atBlockStart = !1);
    };
    e.forEach(i), i(null, 0, e.childCount), this.atBlockStart = !1;
  }
  /**
  Render a node's content as a list. `delim` should be the extra
  indentation added to all lines except the first in an item,
  `firstDelim` is a function going from an item index to a
  delimiter for the first line of the item.
  */
  renderList(e, n, r) {
    this.closed && this.closed.type == e.type ? this.flushClose(3) : this.inTightList && this.flushClose(1);
    let u = typeof e.attrs.tight < "u" ? e.attrs.tight : this.options.tightLists, i = this.inTightList;
    this.inTightList = u, e.forEach((o, s, l) => {
      l && u && this.flushClose(1), this.wrapBlock(n, r(l), e, () => this.render(o, e, l));
    }), this.inTightList = i;
  }
  /**
  Escape the given string so that it can safely appear in Markdown
  content. If `startOfLine` is true, also escape characters that
  have special meaning only at the start of the line.
  */
  esc(e, n = !1) {
    return e = e.replace(/[`*\\~\[\]_]/g, (r, u) => r == "_" && u > 0 && u + 1 < e.length && e[u - 1].match(/\w/) && e[u + 1].match(/\w/) ? r : "\\" + r), n && (e = e.replace(/^(\+[ ]|[\-*>])/, "\\$&").replace(/^(\s*)(#{1,6})(\s|$)/, "$1\\$2$3").replace(/^(\s*\d+)\.\s/, "$1\\. ")), this.options.escapeExtraCharacters && (e = e.replace(this.options.escapeExtraCharacters, "\\$&")), e;
  }
  /**
  @internal
  */
  quote(e) {
    let n = e.indexOf('"') == -1 ? '""' : e.indexOf("'") == -1 ? "''" : "()";
    return n[0] + e + n[1];
  }
  /**
  Repeat the given string `n` times.
  */
  repeat(e, n) {
    let r = "";
    for (let u = 0; u < n; u++)
      r += e;
    return r;
  }
  /**
  Get the markdown string for a given opening or closing mark.
  */
  markString(e, n, r, u) {
    let i = this.marks[e.type.name], o = n ? i.open : i.close;
    return typeof o == "string" ? o : o(this, e, r, u);
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
const Td = "link", Id = {
  attrs: {
    href: {},
    title: { default: null }
  },
  inclusive: !1,
  parseDOM: [
    {
      tag: "a[href]",
      getAttrs(t) {
        return {
          href: t.getAttribute("href"),
          title: t.getAttribute("title")
        };
      }
    }
  ],
  toDOM(t) {
    return ["a", t.attrs];
  }
}, Sd = {
  open(t, e, n, r) {
    return t.inEmail = wd(e, n, r), t.inEmail ? "<" : "[";
  },
  close(t, e, n, r) {
    const { inEmail: u } = t;
    return t.inEmail = void 0, u ? ">" : "](" + e.attrs.href.replace(/[()"]/g, "\\$&") + (e.attrs.title ? ` "${e.attrs.title.replace(/"/g, '\\"')}"` : "") + ")";
  },
  mixable: !0
};
function wd(t, e, n) {
  if (!t.attrs.href.startsWith("mailto:"))
    return !1;
  const r = e.child(n).text;
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    r
  );
}
const Od = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: Td,
  schema: Id,
  serializerSpec: Sd
}, Symbol.toStringTag, { value: "Module" })), ws = [Od];
class Ze {
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
  constructor(e, n, r = {}) {
    this.match = e, this.match = e, this.handler = typeof n == "string" ? _d(n) : n, this.undoable = r.undoable !== !1, this.inCode = r.inCode || !1;
  }
}
function _d(t) {
  return function(e, n, r, u) {
    let i = t;
    if (n[1]) {
      let o = n[0].lastIndexOf(n[1]);
      i += n[0].slice(o + n[1].length), r += o;
      let s = r - u;
      s > 0 && (i = n[0].slice(o - s, o) + i, r = u);
    }
    return e.tr.insertText(i, r, u);
  };
}
const zd = 500;
function Os({ rules: t }) {
  let e = new _e({
    state: {
      init() {
        return null;
      },
      apply(n, r) {
        let u = n.getMeta(this);
        return u || (n.selectionSet || n.docChanged ? null : r);
      }
    },
    props: {
      handleTextInput(n, r, u, i) {
        return Li(n, r, u, i, t, e);
      },
      handleDOMEvents: {
        compositionend: (n) => {
          setTimeout(() => {
            let { $cursor: r } = n.state.selection;
            r && Li(n, r.pos, r.pos, "", t, e);
          });
        }
      }
    },
    isInputRules: !0
  });
  return e;
}
function Li(t, e, n, r, u, i) {
  if (t.composing)
    return !1;
  let o = t.state, s = o.doc.resolve(e), l = s.parent.textBetween(Math.max(0, s.parentOffset - zd), s.parentOffset, null, "￼") + r;
  for (let a = 0; a < u.length; a++) {
    let c = u[a];
    if (s.parent.type.spec.code) {
      if (!c.inCode)
        continue;
    } else if (c.inCode === "only")
      continue;
    let f = c.match.exec(l), d = f && c.handler(o, f, e - (f[0].length - r.length), n);
    if (d)
      return c.undoable && d.setMeta(i, { transform: d, from: e, to: n, text: r }), t.dispatch(d), !0;
  }
  return !1;
}
const jd = (t, e) => {
  let n = t.plugins;
  for (let r = 0; r < n.length; r++) {
    let u = n[r], i;
    if (u.spec.isInputRules && (i = u.getState(t))) {
      if (e) {
        let o = t.tr, s = i.transform;
        for (let l = s.steps.length - 1; l >= 0; l--)
          o.step(s.steps[l].invert(s.docs[l]));
        if (i.text) {
          let l = o.doc.resolve(i.from).marks();
          o.replaceWith(i.from, i.to, t.schema.text(i.text, l));
        } else
          o.delete(i.from, i.to);
        e(o);
      }
      return !0;
    }
  }
  return !1;
}, Ld = new Ze(/--$/, "—"), Fd = new Ze(/\.\.\.$/, "…"), vd = new Ze(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "“"), Rd = new Ze(/"$/, "”"), Bd = new Ze(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "‘"), Pd = new Ze(/'$/, "’"), Ud = [vd, Rd, Bd, Pd];
function Ge(t, e, n = null, r) {
  return new Ze(t, (u, i, o, s) => {
    let l = n instanceof Function ? n(i) : n, a = u.tr.delete(o, s), c = a.doc.resolve(o), f = c.blockRange(), d = f && Gr(f, e, l);
    if (!d)
      return null;
    a.wrap(f, d);
    let p = a.doc.resolve(o - 1).nodeBefore;
    return p && p.type == e && _t(a.doc, o - 1) && (!r || r(i, p)) && a.join(o - 1), a;
  });
}
function Wn(t, e, n = null) {
  return new Ze(t, (r, u, i, o) => {
    let s = r.doc.resolve(i), l = n instanceof Function ? n(u) : n;
    return s.node(-1).canReplaceWith(s.index(-1), s.indexAfter(-1), e) ? r.tr.delete(i, o).setBlockType(i, i, e, l) : null;
  });
}
const _s = "address", qd = {
  content: "block+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: "div.address" }],
  toDOM() {
    return ["div", { class: "address" }, 0];
  }
}, Vd = (t) => [
  // $A Address
  Ge(/^\$A\s$/, t.nodes[_s])
], Qd = (t, e) => {
  t.write(`$A

`), t.renderInline(e), t.write("$A"), t.closeBlock(e);
}, $d = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: Vd,
  name: _s,
  schema: qd,
  toGovspeak: Qd
}, Symbol.toStringTag, { value: "Module" })), Yd = "blockquote", Wd = {
  content: "paragraph+",
  group: "block",
  parseDOM: [{ tag: "blockquote" }],
  toDOM() {
    return ["blockquote", 0];
  }
}, Hd = (t, e) => {
  t.wrapBlock("> ", null, e, () => t.renderContent(e));
}, Jd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: Yd,
  schema: Wd,
  toGovspeak: Hd
}, Symbol.toStringTag, { value: "Module" })), Zd = "bullet_list", Gd = {
  content: "list_item+",
  group: "block",
  attrs: { tight: { default: !1 } },
  parseDOM: [
    {
      tag: "ul",
      getAttrs: (t) => ({ tight: t.hasAttribute("data-tight") })
    }
  ],
  toDOM(t) {
    return ["ul", { "data-tight": t.attrs.tight ? "true" : null }, 0];
  }
}, Kd = (t, e) => {
  t.renderList(e, "  ", () => (e.attrs.bullet || "*") + " ");
}, Xd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: Zd,
  schema: Gd,
  toGovspeak: Kd
}, Symbol.toStringTag, { value: "Module" })), zs = "call_to_action", eh = {
  content: "block+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: "div.call-to-action" }],
  toDOM() {
    return ["div", { class: "call-to-action" }, 0];
  }
}, th = (t) => [
  // $CTA Call to action
  Ge(/^\$CTA\s$/, t.nodes[zs])
], nh = (t, e) => {
  t.write(`$CTA

`), t.renderInline(e), t.write("$CTA"), t.closeBlock(e);
}, rh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: th,
  name: zs,
  schema: eh,
  toGovspeak: nh
}, Symbol.toStringTag, { value: "Module" })), js = "contact", uh = {
  content: "paragraph+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: 'div.contact[role="contact"][aria-label="Contact"]' }],
  toDOM() {
    return ["div", { class: "contact" }, ["p", 0]];
  }
}, ih = (t) => [
  // $C Contact
  Ge(/^\$C\s$/, t.nodes[js])
], oh = (t, e) => {
  t.write(`$C

`), t.renderInline(e), t.write("$C"), t.closeBlock(e);
}, sh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: ih,
  name: js,
  schema: uh,
  toGovspeak: oh
}, Symbol.toStringTag, { value: "Module" })), lh = "doc", ah = {
  content: "(block|heading)+"
}, ch = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: lh,
  schema: ah
}, Symbol.toStringTag, { value: "Module" })), Ls = "example_callout", fh = {
  content: "block+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: "div.example" }],
  toDOM() {
    return ["div", { class: "example" }, 0];
  }
}, dh = (t) => [
  // $E Example callout
  Ge(/^\$E\s$/, t.nodes[Ls])
], hh = (t, e) => {
  t.write(`$E

`), t.renderInline(e), t.write("$E"), t.closeBlock(e);
}, ph = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: dh,
  name: Ls,
  schema: fh,
  toGovspeak: hh
}, Symbol.toStringTag, { value: "Module" })), mh = "hard_break", gh = {
  inline: !0,
  group: "inline",
  selectable: !1,
  parseDOM: [{ tag: "br" }],
  toDOM() {
    return ["br"];
  }
}, bh = (t, e, n, r) => {
  for (let u = r + 1; u < n.childCount; u++)
    if (n.child(u).type !== e.type) {
      t.write(`\\
`);
      return;
    }
}, xh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: mh,
  schema: gh,
  toGovspeak: bh
}, Symbol.toStringTag, { value: "Module" })), Mh = "heading", yh = {
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
  toDOM(t) {
    return ["h" + t.attrs.level, 0];
  }
}, kh = (t, e) => {
  t.write(t.repeat("#", e.attrs.level) + " "), t.renderInline(e, !1), t.closeBlock(e);
}, Dh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: Mh,
  schema: yh,
  toGovspeak: kh
}, Symbol.toStringTag, { value: "Module" })), Fs = "information_callout", Nh = {
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
}, Ch = (t) => [
  // ^ Information callout
  Wn(/^\^\s$/, t.nodes[Fs])
], Ah = (t, e) => {
  t.write("^"), t.renderInline(e, !1), t.write("^"), t.closeBlock(e);
}, Eh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: Ch,
  name: Fs,
  schema: Nh,
  toGovspeak: Ah
}, Symbol.toStringTag, { value: "Module" })), Th = "list_item", Ih = {
  content: "paragraph",
  defining: !0,
  parseDOM: [{ tag: "li" }],
  toDOM() {
    return ["li", 0];
  }
}, Sh = (t, e) => {
  t.renderContent(e);
}, wh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: Th,
  schema: Ih,
  toGovspeak: Sh
}, Symbol.toStringTag, { value: "Module" })), Oh = "ordered_list", _h = {
  content: "list_item+",
  group: "block",
  attrs: { order: { default: 1 } },
  parseDOM: [
    {
      tag: "ol",
      getAttrs(t) {
        return {
          order: t.hasAttribute("start") ? +t.getAttribute("start") : 1
        };
      }
    }
  ],
  toDOM(t) {
    return t.attrs.order === 1 ? ["ol", 0] : ["ol", { start: t.attrs.order }, 0];
  }
}, zh = (t, e) => {
  const n = e.attrs.order || 1, r = String(n + e.childCount - 1).length, u = t.repeat(" ", r + 2);
  t.renderList(e, u, (i) => {
    const o = String(n + i);
    return t.repeat(" ", r - o.length) + o + ". ";
  });
}, jh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: Oh,
  schema: _h,
  toGovspeak: zh
}, Symbol.toStringTag, { value: "Module" })), Lh = "paragraph", Fh = {
  content: "inline*",
  group: "block",
  parseDOM: [{ tag: "p" }],
  toDOM() {
    return ["p", 0];
  }
}, vh = (t, e) => {
  t.renderInline(e), t.closeBlock(e);
}, Rh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: Lh,
  schema: Fh,
  toGovspeak: vh
}, Symbol.toStringTag, { value: "Module" })), vs = "steps", Bh = {
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
}, Ph = (t) => [
  // s1. steps
  Ge(/^s1.\s$/, t.nodes[vs])
], Uh = (t, e) => {
  t.renderList(e, "", (n) => "s" + (n + 1) + ". "), t.write(`
`);
}, qh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: Ph,
  name: vs,
  schema: Bh,
  toGovspeak: Uh
}, Symbol.toStringTag, { value: "Module" })), Vh = "text", Qh = {
  group: "inline"
}, $h = (t, e) => {
  t.text(e.text, !t.inAutolink);
}, Yh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  name: Vh,
  schema: Qh,
  toGovspeak: $h
}, Symbol.toStringTag, { value: "Module" })), Rs = "warning_callout", Wh = {
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
}, Hh = (t) => [
  // % Warning callout
  Wn(/^%\s$/, t.nodes[Rs])
], Jh = (t, e) => {
  t.write("%"), t.renderInline(e, !1), t.write("%"), t.closeBlock(e);
}, Zh = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  inputRules: Hh,
  name: Rs,
  schema: Wh,
  toGovspeak: Jh
}, Symbol.toStringTag, { value: "Module" })), gu = [
  Rh,
  // Paragraph must be first to be the default
  $d,
  Jd,
  Xd,
  rh,
  sh,
  ch,
  ph,
  xh,
  Dh,
  Eh,
  wh,
  qh,
  // Steps must be before ordered_list so it doesn't get overridden by ordered_list
  jh,
  Yh,
  Zh
], Gh = Object.fromEntries(
  gu.filter((t) => typeof t.toGovspeak < "u").map((t) => [t.name, t.toGovspeak])
), Kh = Object.fromEntries(
  ws.map((t) => [t.name, t.serializerSpec])
), Fi = new Ad(
  Gh,
  Kh
), Xh = Object.fromEntries(
  gu.map((t) => [t.name, t.schema])
), ep = Object.fromEntries(
  ws.map((t) => [t.name, t.schema])
), vi = new io({
  nodes: Xh,
  marks: ep
});
var He = {
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
}, Fn = {
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
}, tp = typeof navigator < "u" && /Mac/.test(navigator.platform), np = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var U = 0; U < 10; U++)
  He[48 + U] = He[96 + U] = String(U);
for (var U = 1; U <= 24; U++)
  He[U + 111] = "F" + U;
for (var U = 65; U <= 90; U++)
  He[U] = String.fromCharCode(U + 32), Fn[U] = String.fromCharCode(U);
for (var xr in He)
  Fn.hasOwnProperty(xr) || (Fn[xr] = He[xr]);
function rp(t) {
  var e = tp && t.metaKey && t.shiftKey && !t.ctrlKey && !t.altKey || np && t.shiftKey && t.key && t.key.length == 1 || t.key == "Unidentified", n = !e && t.key || (t.shiftKey ? Fn : He)[t.keyCode] || t.key || "Unidentified";
  return n == "Esc" && (n = "Escape"), n == "Del" && (n = "Delete"), n == "Left" && (n = "ArrowLeft"), n == "Up" && (n = "ArrowUp"), n == "Right" && (n = "ArrowRight"), n == "Down" && (n = "ArrowDown"), n;
}
const up = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function ip(t) {
  let e = t.split(/-(?!$)/), n = e[e.length - 1];
  n == "Space" && (n = " ");
  let r, u, i, o;
  for (let s = 0; s < e.length - 1; s++) {
    let l = e[s];
    if (/^(cmd|meta|m)$/i.test(l))
      o = !0;
    else if (/^a(lt)?$/i.test(l))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      u = !0;
    else if (/^s(hift)?$/i.test(l))
      i = !0;
    else if (/^mod$/i.test(l))
      up ? o = !0 : u = !0;
    else
      throw new Error("Unrecognized modifier name: " + l);
  }
  return r && (n = "Alt-" + n), u && (n = "Ctrl-" + n), o && (n = "Meta-" + n), i && (n = "Shift-" + n), n;
}
function op(t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let n in t)
    e[ip(n)] = t[n];
  return e;
}
function Mr(t, e, n = !0) {
  return e.altKey && (t = "Alt-" + t), e.ctrlKey && (t = "Ctrl-" + t), e.metaKey && (t = "Meta-" + t), n && e.shiftKey && (t = "Shift-" + t), t;
}
function Ri(t) {
  return new _e({ props: { handleKeyDown: Bs(t) } });
}
function Bs(t) {
  let e = op(t);
  return function(n, r) {
    let u = rp(r), i, o = e[Mr(u, r)];
    if (o && o(n.state, n.dispatch, n))
      return !0;
    if (u.length == 1 && u != " ") {
      if (r.shiftKey) {
        let s = e[Mr(u, r, !1)];
        if (s && s(n.state, n.dispatch, n))
          return !0;
      }
      if ((r.shiftKey || r.altKey || r.metaKey || u.charCodeAt(0) > 127) && (i = He[r.keyCode]) && i != u) {
        let s = e[Mr(i, r)];
        if (s && s(n.state, n.dispatch, n))
          return !0;
      }
    }
    return !1;
  };
}
var vn = 200, R = function() {
};
R.prototype.append = function(e) {
  return e.length ? (e = R.from(e), !this.length && e || e.length < vn && this.leafAppend(e) || this.length < vn && e.leafPrepend(this) || this.appendInner(e)) : this;
};
R.prototype.prepend = function(e) {
  return e.length ? R.from(e).append(this) : this;
};
R.prototype.appendInner = function(e) {
  return new sp(this, e);
};
R.prototype.slice = function(e, n) {
  return e === void 0 && (e = 0), n === void 0 && (n = this.length), e >= n ? R.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, n));
};
R.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
R.prototype.forEach = function(e, n, r) {
  n === void 0 && (n = 0), r === void 0 && (r = this.length), n <= r ? this.forEachInner(e, n, r, 0) : this.forEachInvertedInner(e, n, r, 0);
};
R.prototype.map = function(e, n, r) {
  n === void 0 && (n = 0), r === void 0 && (r = this.length);
  var u = [];
  return this.forEach(function(i, o) {
    return u.push(e(i, o));
  }, n, r), u;
};
R.from = function(e) {
  return e instanceof R ? e : e && e.length ? new Ps(e) : R.empty;
};
var Ps = /* @__PURE__ */ function(t) {
  function e(r) {
    t.call(this), this.values = r;
  }
  t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e;
  var n = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(u, i) {
    return u == 0 && i == this.length ? this : new e(this.values.slice(u, i));
  }, e.prototype.getInner = function(u) {
    return this.values[u];
  }, e.prototype.forEachInner = function(u, i, o, s) {
    for (var l = i; l < o; l++)
      if (u(this.values[l], s + l) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(u, i, o, s) {
    for (var l = i - 1; l >= o; l--)
      if (u(this.values[l], s + l) === !1)
        return !1;
  }, e.prototype.leafAppend = function(u) {
    if (this.length + u.length <= vn)
      return new e(this.values.concat(u.flatten()));
  }, e.prototype.leafPrepend = function(u) {
    if (this.length + u.length <= vn)
      return new e(u.flatten().concat(this.values));
  }, n.length.get = function() {
    return this.values.length;
  }, n.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, n), e;
}(R);
R.empty = new Ps([]);
var sp = /* @__PURE__ */ function(t) {
  function e(n, r) {
    t.call(this), this.left = n, this.right = r, this.length = n.length + r.length, this.depth = Math.max(n.depth, r.depth) + 1;
  }
  return t && (e.__proto__ = t), e.prototype = Object.create(t && t.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, u, i, o) {
    var s = this.left.length;
    if (u < s && this.left.forEachInner(r, u, Math.min(i, s), o) === !1 || i > s && this.right.forEachInner(r, Math.max(u - s, 0), Math.min(this.length, i) - s, o + s) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, u, i, o) {
    var s = this.left.length;
    if (u > s && this.right.forEachInvertedInner(r, u - s, Math.max(i, s) - s, o + s) === !1 || i < s && this.left.forEachInvertedInner(r, Math.min(u, s), i, o) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, u) {
    if (r == 0 && u == this.length)
      return this;
    var i = this.left.length;
    return u <= i ? this.left.slice(r, u) : r >= i ? this.right.slice(r - i, u - i) : this.left.slice(r, i).append(this.right.slice(0, u - i));
  }, e.prototype.leafAppend = function(r) {
    var u = this.right.leafAppend(r);
    if (u)
      return new e(this.left, u);
  }, e.prototype.leafPrepend = function(r) {
    var u = this.left.leafPrepend(r);
    if (u)
      return new e(u, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
}(R);
const lp = 500;
class he {
  constructor(e, n) {
    this.items = e, this.eventCount = n;
  }
  // Pop the latest event off the branch's history and apply it
  // to a document transform.
  popEvent(e, n) {
    if (this.eventCount == 0)
      return null;
    let r = this.items.length;
    for (; ; r--)
      if (this.items.get(r - 1).selection) {
        --r;
        break;
      }
    let u, i;
    n && (u = this.remapping(r, this.items.length), i = u.maps.length);
    let o = e.tr, s, l, a = [], c = [];
    return this.items.forEach((f, d) => {
      if (!f.step) {
        u || (u = this.remapping(r, d + 1), i = u.maps.length), i--, c.push(f);
        return;
      }
      if (u) {
        c.push(new be(f.map));
        let p = f.step.map(u.slice(i)), h;
        p && o.maybeStep(p).doc && (h = o.mapping.maps[o.mapping.maps.length - 1], a.push(new be(h, void 0, void 0, a.length + c.length))), i--, h && u.appendMap(h, i);
      } else
        o.maybeStep(f.step);
      if (f.selection)
        return s = u ? f.selection.map(u.slice(i)) : f.selection, l = new he(this.items.slice(0, r).append(c.reverse().concat(a)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: l, transform: o, selection: s };
  }
  // Create a new branch with the given transform added.
  addTransform(e, n, r, u) {
    let i = [], o = this.eventCount, s = this.items, l = !u && s.length ? s.get(s.length - 1) : null;
    for (let c = 0; c < e.steps.length; c++) {
      let f = e.steps[c].invert(e.docs[c]), d = new be(e.mapping.maps[c], f, n), p;
      (p = l && l.merge(d)) && (d = p, c ? i.pop() : s = s.slice(0, s.length - 1)), i.push(d), n && (o++, n = void 0), u || (l = d);
    }
    let a = o - r.depth;
    return a > cp && (s = ap(s, a), o -= a), new he(s.append(i), o);
  }
  remapping(e, n) {
    let r = new xt();
    return this.items.forEach((u, i) => {
      let o = u.mirrorOffset != null && i - u.mirrorOffset >= e ? r.maps.length - u.mirrorOffset : void 0;
      r.appendMap(u.map, o);
    }, e, n), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new he(this.items.append(e.map((n) => new be(n))), this.eventCount);
  }
  // When the collab module receives remote changes, the history has
  // to know about those, so that it can adjust the steps that were
  // rebased on top of the remote changes, and include the position
  // maps for the remote changes in its array of items.
  rebased(e, n) {
    if (!this.eventCount)
      return this;
    let r = [], u = Math.max(0, this.items.length - n), i = e.mapping, o = e.steps.length, s = this.eventCount;
    this.items.forEach((d) => {
      d.selection && s--;
    }, u);
    let l = n;
    this.items.forEach((d) => {
      let p = i.getMirror(--l);
      if (p == null)
        return;
      o = Math.min(o, p);
      let h = i.maps[p];
      if (d.step) {
        let m = e.steps[p].invert(e.docs[p]), g = d.selection && d.selection.map(i.slice(l + 1, p));
        g && s++, r.push(new be(h, m, g));
      } else
        r.push(new be(h));
    }, u);
    let a = [];
    for (let d = n; d < o; d++)
      a.push(new be(i.maps[d]));
    let c = this.items.slice(0, u).append(a).append(r), f = new he(c, s);
    return f.emptyItemCount() > lp && (f = f.compress(this.items.length - r.length)), f;
  }
  emptyItemCount() {
    let e = 0;
    return this.items.forEach((n) => {
      n.step || e++;
    }), e;
  }
  // Compressing a branch means rewriting it to push the air (map-only
  // items) out. During collaboration, these naturally accumulate
  // because each remote change adds one. The `upto` argument is used
  // to ensure that only the items below a given level are compressed,
  // because `rebased` relies on a clean, untouched set of items in
  // order to associate old items with rebased steps.
  compress(e = this.items.length) {
    let n = this.remapping(0, e), r = n.maps.length, u = [], i = 0;
    return this.items.forEach((o, s) => {
      if (s >= e)
        u.push(o), o.selection && i++;
      else if (o.step) {
        let l = o.step.map(n.slice(r)), a = l && l.getMap();
        if (r--, a && n.appendMap(a, r), l) {
          let c = o.selection && o.selection.map(n.slice(r));
          c && i++;
          let f = new be(a.invert(), l, c), d, p = u.length - 1;
          (d = u.length && u[p].merge(f)) ? u[p] = d : u.push(f);
        }
      } else
        o.map && r--;
    }, this.items.length, 0), new he(R.from(u.reverse()), i);
  }
}
he.empty = new he(R.empty, 0);
function ap(t, e) {
  let n;
  return t.forEach((r, u) => {
    if (r.selection && e-- == 0)
      return n = u, !1;
  }), t.slice(n);
}
class be {
  constructor(e, n, r, u) {
    this.map = e, this.step = n, this.selection = r, this.mirrorOffset = u;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let n = e.step.merge(this.step);
      if (n)
        return new be(n.getMap().invert(), n, this.selection);
    }
  }
}
class ve {
  constructor(e, n, r, u, i) {
    this.done = e, this.undone = n, this.prevRanges = r, this.prevTime = u, this.prevComposition = i;
  }
}
const cp = 20;
function fp(t, e, n, r) {
  let u = n.getMeta(st), i;
  if (u)
    return u.historyState;
  n.getMeta(pp) && (t = new ve(t.done, t.undone, null, 0, -1));
  let o = n.getMeta("appendedTransaction");
  if (n.steps.length == 0)
    return t;
  if (o && o.getMeta(st))
    return o.getMeta(st).redo ? new ve(t.done.addTransform(n, void 0, r, kn(e)), t.undone, Bi(n.mapping.maps[n.steps.length - 1]), t.prevTime, t.prevComposition) : new ve(t.done, t.undone.addTransform(n, void 0, r, kn(e)), null, t.prevTime, t.prevComposition);
  if (n.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
    let s = n.getMeta("composition"), l = t.prevTime == 0 || !o && t.prevComposition != s && (t.prevTime < (n.time || 0) - r.newGroupDelay || !dp(n, t.prevRanges)), a = o ? yr(t.prevRanges, n.mapping) : Bi(n.mapping.maps[n.steps.length - 1]);
    return new ve(t.done.addTransform(n, l ? e.selection.getBookmark() : void 0, r, kn(e)), he.empty, a, n.time, s ?? t.prevComposition);
  } else
    return (i = n.getMeta("rebased")) ? new ve(t.done.rebased(n, i), t.undone.rebased(n, i), yr(t.prevRanges, n.mapping), t.prevTime, t.prevComposition) : new ve(t.done.addMaps(n.mapping.maps), t.undone.addMaps(n.mapping.maps), yr(t.prevRanges, n.mapping), t.prevTime, t.prevComposition);
}
function dp(t, e) {
  if (!e)
    return !1;
  if (!t.docChanged)
    return !0;
  let n = !1;
  return t.mapping.maps[0].forEach((r, u) => {
    for (let i = 0; i < e.length; i += 2)
      r <= e[i + 1] && u >= e[i] && (n = !0);
  }), n;
}
function Bi(t) {
  let e = [];
  return t.forEach((n, r, u, i) => e.push(u, i)), e;
}
function yr(t, e) {
  if (!t)
    return null;
  let n = [];
  for (let r = 0; r < t.length; r += 2) {
    let u = e.map(t[r], 1), i = e.map(t[r + 1], -1);
    u <= i && n.push(u, i);
  }
  return n;
}
function hp(t, e, n) {
  let r = kn(e), u = st.get(e).spec.config, i = (n ? t.undone : t.done).popEvent(e, r);
  if (!i)
    return null;
  let o = i.selection.resolve(i.transform.doc), s = (n ? t.done : t.undone).addTransform(i.transform, e.selection.getBookmark(), u, r), l = new ve(n ? s : i.remaining, n ? i.remaining : s, null, 0, -1);
  return i.transform.setSelection(o).setMeta(st, { redo: n, historyState: l });
}
let kr = !1, Pi = null;
function kn(t) {
  let e = t.plugins;
  if (Pi != e) {
    kr = !1, Pi = e;
    for (let n = 0; n < e.length; n++)
      if (e[n].spec.historyPreserveItems) {
        kr = !0;
        break;
      }
  }
  return kr;
}
const st = new Co("history"), pp = new Co("closeHistory");
function mp(t = {}) {
  return t = {
    depth: t.depth || 100,
    newGroupDelay: t.newGroupDelay || 500
  }, new _e({
    key: st,
    state: {
      init() {
        return new ve(he.empty, he.empty, null, 0, -1);
      },
      apply(e, n, r) {
        return fp(n, r, e, t);
      }
    },
    config: t,
    props: {
      handleDOMEvents: {
        beforeinput(e, n) {
          let r = n.inputType, u = r == "historyUndo" ? nn : r == "historyRedo" ? St : null;
          return u ? (n.preventDefault(), u(e.state, e.dispatch)) : !1;
        }
      }
    }
  });
}
function Us(t, e) {
  return (n, r) => {
    let u = st.getState(n);
    if (!u || (t ? u.undone : u.done).eventCount == 0)
      return !1;
    if (r) {
      let i = hp(u, n, t);
      i && r(e ? i.scrollIntoView() : i);
    }
    return !0;
  };
}
const nn = Us(!1, !0), St = Us(!0, !0), qs = (t, e) => t.selection.empty ? !1 : (e && e(t.tr.deleteSelection().scrollIntoView()), !0);
function gp(t, e) {
  let { $cursor: n } = t.selection;
  return !n || (e ? !e.endOfTextblock("backward", t) : n.parentOffset > 0) ? null : n;
}
const bp = (t, e, n) => {
  let r = gp(t, n);
  if (!r)
    return !1;
  let u = Vs(r);
  if (!u) {
    let o = r.blockRange(), s = o && un(o);
    return s == null ? !1 : (e && e(t.tr.lift(o, s).scrollIntoView()), !0);
  }
  let i = u.nodeBefore;
  if (!i.type.spec.isolating && Ys(t, u, e))
    return !0;
  if (r.parent.content.size == 0 && (wt(i, "end") || N.isSelectable(i))) {
    let o = Kr(t.doc, r.before(), r.after(), M.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let s = t.tr.step(o);
        s.setSelection(wt(i, "end") ? T.findFrom(s.doc.resolve(s.mapping.map(u.pos, -1)), -1) : N.create(s.doc, u.pos - i.nodeSize)), e(s.scrollIntoView());
      }
      return !0;
    }
  }
  return i.isAtom && u.depth == r.depth - 1 ? (e && e(t.tr.delete(u.pos - i.nodeSize, u.pos).scrollIntoView()), !0) : !1;
};
function wt(t, e, n = !1) {
  for (let r = t; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (n && r.childCount != 1)
      return !1;
  }
  return !1;
}
const xp = (t, e, n) => {
  let { $head: r, empty: u } = t.selection, i = r;
  if (!u)
    return !1;
  if (r.parent.isTextblock) {
    if (n ? !n.endOfTextblock("backward", t) : r.parentOffset > 0)
      return !1;
    i = Vs(r);
  }
  let o = i && i.nodeBefore;
  return !o || !N.isSelectable(o) ? !1 : (e && e(t.tr.setSelection(N.create(t.doc, i.pos - o.nodeSize)).scrollIntoView()), !0);
};
function Vs(t) {
  if (!t.parent.type.spec.isolating)
    for (let e = t.depth - 1; e >= 0; e--) {
      if (t.index(e) > 0)
        return t.doc.resolve(t.before(e + 1));
      if (t.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Mp(t, e) {
  let { $cursor: n } = t.selection;
  return !n || (e ? !e.endOfTextblock("forward", t) : n.parentOffset < n.parent.content.size) ? null : n;
}
const yp = (t, e, n) => {
  let r = Mp(t, n);
  if (!r)
    return !1;
  let u = Qs(r);
  if (!u)
    return !1;
  let i = u.nodeAfter;
  if (Ys(t, u, e))
    return !0;
  if (r.parent.content.size == 0 && (wt(i, "start") || N.isSelectable(i))) {
    let o = Kr(t.doc, r.before(), r.after(), M.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let s = t.tr.step(o);
        s.setSelection(wt(i, "start") ? T.findFrom(s.doc.resolve(s.mapping.map(u.pos)), 1) : N.create(s.doc, s.mapping.map(u.pos))), e(s.scrollIntoView());
      }
      return !0;
    }
  }
  return i.isAtom && u.depth == r.depth - 1 ? (e && e(t.tr.delete(u.pos, u.pos + i.nodeSize).scrollIntoView()), !0) : !1;
}, kp = (t, e, n) => {
  let { $head: r, empty: u } = t.selection, i = r;
  if (!u)
    return !1;
  if (r.parent.isTextblock) {
    if (n ? !n.endOfTextblock("forward", t) : r.parentOffset < r.parent.content.size)
      return !1;
    i = Qs(r);
  }
  let o = i && i.nodeAfter;
  return !o || !N.isSelectable(o) ? !1 : (e && e(t.tr.setSelection(N.create(t.doc, i.pos)).scrollIntoView()), !0);
};
function Qs(t) {
  if (!t.parent.type.spec.isolating)
    for (let e = t.depth - 1; e >= 0; e--) {
      let n = t.node(e);
      if (t.index(e) + 1 < n.childCount)
        return t.doc.resolve(t.after(e + 1));
      if (n.type.spec.isolating)
        break;
    }
  return null;
}
const Qr = (t, e) => {
  let n = t.selection, r = n instanceof N, u;
  if (r) {
    if (n.node.isTextblock || !_t(t.doc, n.from))
      return !1;
    u = n.from;
  } else if (u = go(t.doc, n.from, -1), u == null)
    return !1;
  if (e) {
    let i = t.tr.join(u);
    r && i.setSelection(N.create(i.doc, u - t.doc.resolve(u).nodeBefore.nodeSize)), e(i.scrollIntoView());
  }
  return !0;
}, Dp = (t, e) => {
  let n = t.selection, r;
  if (n instanceof N) {
    if (n.node.isTextblock || !_t(t.doc, n.to))
      return !1;
    r = n.to;
  } else if (r = go(t.doc, n.to, 1), r == null)
    return !1;
  return e && e(t.tr.join(r).scrollIntoView()), !0;
}, $r = (t, e) => {
  let { $from: n, $to: r } = t.selection, u = n.blockRange(r), i = u && un(u);
  return i == null ? !1 : (e && e(t.tr.lift(u, i).scrollIntoView()), !0);
}, Np = (t, e) => {
  let { $head: n, $anchor: r } = t.selection;
  return !n.parent.type.spec.code || !n.sameParent(r) ? !1 : (e && e(t.tr.insertText(`
`).scrollIntoView()), !0);
};
function bu(t) {
  for (let e = 0; e < t.edgeCount; e++) {
    let { type: n } = t.edge(e);
    if (n.isTextblock && !n.hasRequiredAttrs())
      return n;
  }
  return null;
}
const $s = (t, e) => {
  let { $head: n, $anchor: r } = t.selection;
  if (!n.parent.type.spec.code || !n.sameParent(r))
    return !1;
  let u = n.node(-1), i = n.indexAfter(-1), o = bu(u.contentMatchAt(i));
  if (!o || !u.canReplaceWith(i, i, o))
    return !1;
  if (e) {
    let s = n.after(), l = t.tr.replaceWith(s, s, o.createAndFill());
    l.setSelection(T.near(l.doc.resolve(s), 1)), e(l.scrollIntoView());
  }
  return !0;
}, Cp = (t, e) => {
  let n = t.selection, { $from: r, $to: u } = n;
  if (n instanceof ne || r.parent.inlineContent || u.parent.inlineContent)
    return !1;
  let i = bu(u.parent.contentMatchAt(u.indexAfter()));
  if (!i || !i.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && u.index() < u.parent.childCount ? r : u).pos, s = t.tr.insert(o, i.createAndFill());
    s.setSelection(S.create(s.doc, o + 1)), e(s.scrollIntoView());
  }
  return !0;
}, Ap = (t, e) => {
  let { $cursor: n } = t.selection;
  if (!n || n.parent.content.size)
    return !1;
  if (n.depth > 1 && n.after() != n.end(-1)) {
    let i = n.before();
    if (Mt(t.doc, i))
      return e && e(t.tr.split(i).scrollIntoView()), !0;
  }
  let r = n.blockRange(), u = r && un(r);
  return u == null ? !1 : (e && e(t.tr.lift(r, u).scrollIntoView()), !0);
};
function Ep(t) {
  return (e, n) => {
    let { $from: r, $to: u } = e.selection;
    if (e.selection instanceof N && e.selection.node.isBlock)
      return !r.parentOffset || !Mt(e.doc, r.pos) ? !1 : (n && n(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.parent.isBlock)
      return !1;
    if (n) {
      let i = u.parentOffset == u.parent.content.size, o = e.tr;
      (e.selection instanceof S || e.selection instanceof ne) && o.deleteSelection();
      let s = r.depth == 0 ? null : bu(r.node(-1).contentMatchAt(r.indexAfter(-1))), l = t && t(u.parent, i), a = l ? [l] : i && s ? [{ type: s }] : void 0, c = Mt(o.doc, o.mapping.map(r.pos), 1, a);
      if (!a && !c && Mt(o.doc, o.mapping.map(r.pos), 1, s ? [{ type: s }] : void 0) && (s && (a = [{ type: s }]), c = !0), c && (o.split(o.mapping.map(r.pos), 1, a), !i && !r.parentOffset && r.parent.type != s)) {
        let f = o.mapping.map(r.before()), d = o.doc.resolve(f);
        s && r.node(-1).canReplaceWith(d.index(), d.index() + 1, s) && o.setNodeMarkup(o.mapping.map(r.before()), s);
      }
      n(o.scrollIntoView());
    }
    return !0;
  };
}
const Tp = Ep(), Yr = (t, e) => {
  let { $from: n, to: r } = t.selection, u, i = n.sharedDepth(r);
  return i == 0 ? !1 : (u = n.before(i), e && e(t.tr.setSelection(N.create(t.doc, u))), !0);
}, Ip = (t, e) => (e && e(t.tr.setSelection(new ne(t.doc))), !0);
function Sp(t, e, n) {
  let r = e.nodeBefore, u = e.nodeAfter, i = e.index();
  return !r || !u || !r.type.compatibleContent(u.type) ? !1 : !r.content.size && e.parent.canReplace(i - 1, i) ? (n && n(t.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(i, i + 1) || !(u.isTextblock || _t(t.doc, e.pos)) ? !1 : (n && n(t.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function Ys(t, e, n) {
  let r = e.nodeBefore, u = e.nodeAfter, i, o;
  if (r.type.spec.isolating || u.type.spec.isolating)
    return !1;
  if (Sp(t, e, n))
    return !0;
  let s = e.parent.canReplace(e.index(), e.index() + 1);
  if (s && (i = (o = r.contentMatchAt(r.childCount)).findWrapping(u.type)) && o.matchType(i[0] || u.type).validEnd) {
    if (n) {
      let f = e.pos + u.nodeSize, d = x.empty;
      for (let m = i.length - 1; m >= 0; m--)
        d = x.from(i[m].create(null, d));
      d = x.from(r.copy(d));
      let p = t.tr.step(new q(e.pos - 1, f, e.pos, f, new M(d, 1, 0), i.length, !0)), h = f + 2 * i.length;
      _t(p.doc, h) && p.join(h), n(p.scrollIntoView());
    }
    return !0;
  }
  let l = T.findFrom(e, 1), a = l && l.$from.blockRange(l.$to), c = a && un(a);
  if (c != null && c >= e.depth)
    return n && n(t.tr.lift(a, c).scrollIntoView()), !0;
  if (s && wt(u, "start", !0) && wt(r, "end")) {
    let f = r, d = [];
    for (; d.push(f), !f.isTextblock; )
      f = f.lastChild;
    let p = u, h = 1;
    for (; !p.isTextblock; p = p.firstChild)
      h++;
    if (f.canReplace(f.childCount, f.childCount, p.content)) {
      if (n) {
        let m = x.empty;
        for (let b = d.length - 1; b >= 0; b--)
          m = x.from(d[b].copy(m));
        let g = t.tr.step(new q(e.pos - d.length, e.pos + u.nodeSize, e.pos + h, e.pos + u.nodeSize - h, new M(m, d.length, 0), 0, !0));
        n(g.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Ws(t) {
  return function(e, n) {
    let r = e.selection, u = t < 0 ? r.$from : r.$to, i = u.depth;
    for (; u.node(i).isInline; ) {
      if (!i)
        return !1;
      i--;
    }
    return u.node(i).isTextblock ? (n && n(e.tr.setSelection(S.create(e.doc, t < 0 ? u.start(i) : u.end(i)))), !0) : !1;
  };
}
const wp = Ws(-1), Op = Ws(1);
function Se(t, e = null) {
  return function(n, r) {
    let { $from: u, $to: i } = n.selection, o = u.blockRange(i), s = o && Gr(o, t, e);
    return s ? (r && r(n.tr.wrap(o, s).scrollIntoView()), !0) : !1;
  };
}
function F(t, e = null) {
  return function(n, r) {
    let u = !1;
    for (let i = 0; i < n.selection.ranges.length && !u; i++) {
      let { $from: { pos: o }, $to: { pos: s } } = n.selection.ranges[i];
      n.doc.nodesBetween(o, s, (l, a) => {
        if (u)
          return !1;
        if (!(!l.isTextblock || l.hasMarkup(t, e)))
          if (l.type == t)
            u = !0;
          else {
            let c = n.doc.resolve(a), f = c.index();
            u = c.parent.canReplaceWith(f, f + 1, t);
          }
      });
    }
    if (!u)
      return !1;
    if (r) {
      let i = n.tr;
      for (let o = 0; o < n.selection.ranges.length; o++) {
        let { $from: { pos: s }, $to: { pos: l } } = n.selection.ranges[o];
        i.setBlockType(s, l, t, e);
      }
      r(i.scrollIntoView());
    }
    return !0;
  };
}
function _p(t, e, n) {
  for (let r = 0; r < e.length; r++) {
    let { $from: u, $to: i } = e[r], o = u.depth == 0 ? t.inlineContent && t.type.allowsMarkType(n) : !1;
    if (t.nodesBetween(u.pos, i.pos, (s) => {
      if (o)
        return !1;
      o = s.inlineContent && s.type.allowsMarkType(n);
    }), o)
      return !0;
  }
  return !1;
}
function se(t, e = null) {
  return function(n, r) {
    let { empty: u, $cursor: i, ranges: o } = n.selection;
    if (u && !i || !_p(n.doc, o, t))
      return !1;
    if (r)
      if (i)
        t.isInSet(n.storedMarks || i.marks()) ? r(n.tr.removeStoredMark(t)) : r(n.tr.addStoredMark(t.create(e)));
      else {
        let s = !1, l = n.tr;
        for (let a = 0; !s && a < o.length; a++) {
          let { $from: c, $to: f } = o[a];
          s = n.doc.rangeHasMark(c.pos, f.pos, t);
        }
        for (let a = 0; a < o.length; a++) {
          let { $from: c, $to: f } = o[a];
          if (s)
            l.removeMark(c.pos, f.pos, t);
          else {
            let d = c.pos, p = f.pos, h = c.nodeAfter, m = f.nodeBefore, g = h && h.isText ? /^\s*/.exec(h.text)[0].length : 0, b = m && m.isText ? /\s*$/.exec(m.text)[0].length : 0;
            d + g < p && (d += g, p -= b), l.addMark(d, p, t.create(e));
          }
        }
        r(l.scrollIntoView());
      }
    return !0;
  };
}
function ae(...t) {
  return function(e, n, r) {
    for (let u = 0; u < t.length; u++)
      if (t[u](e, n, r))
        return !0;
    return !1;
  };
}
let Dr = ae(qs, bp, xp), Ui = ae(qs, yp, kp);
const Ie = {
  Enter: ae(Np, Cp, Ap, Tp),
  "Mod-Enter": $s,
  Backspace: Dr,
  "Mod-Backspace": Dr,
  "Shift-Backspace": Dr,
  Delete: Ui,
  "Mod-Delete": Ui,
  "Mod-a": Ip
}, Hs = {
  "Ctrl-h": Ie.Backspace,
  "Alt-Backspace": Ie["Mod-Backspace"],
  "Ctrl-d": Ie.Delete,
  "Ctrl-Alt-Backspace": Ie["Mod-Delete"],
  "Alt-Delete": Ie["Mod-Delete"],
  "Alt-d": Ie["Mod-Delete"],
  "Ctrl-a": wp,
  "Ctrl-e": Op
};
for (let t in Ie)
  Hs[t] = Ie[t];
const zp = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform ? os.platform() == "darwin" : !1, jp = zp ? Hs : Ie;
function Lp(t = {}) {
  return new _e({
    view(e) {
      return new Fp(e, t);
    }
  });
}
class Fp {
  constructor(e, n) {
    var r;
    this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.width = (r = n.width) !== null && r !== void 0 ? r : 1, this.color = n.color === !1 ? void 0 : n.color || "black", this.class = n.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((u) => {
      let i = (o) => {
        this[u](o);
      };
      return e.dom.addEventListener(u, i), { name: u, handler: i };
    });
  }
  destroy() {
    this.handlers.forEach(({ name: e, handler: n }) => this.editorView.dom.removeEventListener(e, n));
  }
  update(e, n) {
    this.cursorPos != null && n.doc != e.state.doc && (this.cursorPos > e.state.doc.content.size ? this.setCursor(null) : this.updateOverlay());
  }
  setCursor(e) {
    e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
  }
  updateOverlay() {
    let e = this.editorView.state.doc.resolve(this.cursorPos), n = !e.parent.inlineContent, r;
    if (n) {
      let s = e.nodeBefore, l = e.nodeAfter;
      if (s || l) {
        let a = this.editorView.nodeDOM(this.cursorPos - (s ? s.nodeSize : 0));
        if (a) {
          let c = a.getBoundingClientRect(), f = s ? c.bottom : c.top;
          s && l && (f = (f + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2), r = { left: c.left, right: c.right, top: f - this.width / 2, bottom: f + this.width / 2 };
        }
      }
    }
    if (!r) {
      let s = this.editorView.coordsAtPos(this.cursorPos);
      r = { left: s.left - this.width / 2, right: s.left + this.width / 2, top: s.top, bottom: s.bottom };
    }
    let u = this.editorView.dom.offsetParent;
    this.element || (this.element = u.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none;", this.color && (this.element.style.backgroundColor = this.color)), this.element.classList.toggle("prosemirror-dropcursor-block", n), this.element.classList.toggle("prosemirror-dropcursor-inline", !n);
    let i, o;
    if (!u || u == document.body && getComputedStyle(u).position == "static")
      i = -pageXOffset, o = -pageYOffset;
    else {
      let s = u.getBoundingClientRect();
      i = s.left - u.scrollLeft, o = s.top - u.scrollTop;
    }
    this.element.style.left = r.left - i + "px", this.element.style.top = r.top - o + "px", this.element.style.width = r.right - r.left + "px", this.element.style.height = r.bottom - r.top + "px";
  }
  scheduleRemoval(e) {
    clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
  }
  dragover(e) {
    if (!this.editorView.editable)
      return;
    let n = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }), r = n && n.inside >= 0 && this.editorView.state.doc.nodeAt(n.inside), u = r && r.type.spec.disableDropCursor, i = typeof u == "function" ? u(this.editorView, n, e) : u;
    if (n && !i) {
      let o = n.pos;
      if (this.editorView.dragging && this.editorView.dragging.slice) {
        let s = bo(this.editorView.state.doc, o, this.editorView.dragging.slice);
        s != null && (o = s);
      }
      this.setCursor(o), this.scheduleRemoval(5e3);
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
class O extends T {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, n) {
    let r = e.resolve(n.map(this.head));
    return O.valid(r) ? new O(r) : T.near(r);
  }
  content() {
    return M.empty;
  }
  eq(e) {
    return e instanceof O && e.head == this.head;
  }
  toJSON() {
    return { type: "gapcursor", pos: this.head };
  }
  /**
  @internal
  */
  static fromJSON(e, n) {
    if (typeof n.pos != "number")
      throw new RangeError("Invalid input for GapCursor.fromJSON");
    return new O(e.resolve(n.pos));
  }
  /**
  @internal
  */
  getBookmark() {
    return new xu(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let n = e.parent;
    if (n.isTextblock || !vp(e) || !Rp(e))
      return !1;
    let r = n.type.spec.allowGapCursor;
    if (r != null)
      return r;
    let u = n.contentMatchAt(e.index()).defaultType;
    return u && u.isTextblock;
  }
  /**
  @internal
  */
  static findGapCursorFrom(e, n, r = !1) {
    e:
      for (; ; ) {
        if (!r && O.valid(e))
          return e;
        let u = e.pos, i = null;
        for (let o = e.depth; ; o--) {
          let s = e.node(o);
          if (n > 0 ? e.indexAfter(o) < s.childCount : e.index(o) > 0) {
            i = s.child(n > 0 ? e.indexAfter(o) : e.index(o) - 1);
            break;
          } else if (o == 0)
            return null;
          u += n;
          let l = e.doc.resolve(u);
          if (O.valid(l))
            return l;
        }
        for (; ; ) {
          let o = n > 0 ? i.firstChild : i.lastChild;
          if (!o) {
            if (i.isAtom && !i.isText && !N.isSelectable(i)) {
              e = e.doc.resolve(u + i.nodeSize * n), r = !1;
              continue e;
            }
            break;
          }
          i = o, u += n;
          let s = e.doc.resolve(u);
          if (O.valid(s))
            return s;
        }
        return null;
      }
  }
}
O.prototype.visible = !1;
O.findFrom = O.findGapCursorFrom;
T.jsonID("gapcursor", O);
class xu {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new xu(e.map(this.pos));
  }
  resolve(e) {
    let n = e.resolve(this.pos);
    return O.valid(n) ? new O(n) : T.near(n);
  }
}
function vp(t) {
  for (let e = t.depth; e >= 0; e--) {
    let n = t.index(e), r = t.node(e);
    if (n == 0) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let u = r.child(n - 1); ; u = u.lastChild) {
      if (u.childCount == 0 && !u.inlineContent || u.isAtom || u.type.spec.isolating)
        return !0;
      if (u.inlineContent)
        return !1;
    }
  }
  return !0;
}
function Rp(t) {
  for (let e = t.depth; e >= 0; e--) {
    let n = t.indexAfter(e), r = t.node(e);
    if (n == r.childCount) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let u = r.child(n); ; u = u.firstChild) {
      if (u.childCount == 0 && !u.inlineContent || u.isAtom || u.type.spec.isolating)
        return !0;
      if (u.inlineContent)
        return !1;
    }
  }
  return !0;
}
function Bp() {
  return new _e({
    props: {
      decorations: Vp,
      createSelectionBetween(t, e, n) {
        return e.pos == n.pos && O.valid(n) ? new O(n) : null;
      },
      handleClick: Up,
      handleKeyDown: Pp,
      handleDOMEvents: { beforeinput: qp }
    }
  });
}
const Pp = Bs({
  ArrowLeft: bn("horiz", -1),
  ArrowRight: bn("horiz", 1),
  ArrowUp: bn("vert", -1),
  ArrowDown: bn("vert", 1)
});
function bn(t, e) {
  const n = t == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, u, i) {
    let o = r.selection, s = e > 0 ? o.$to : o.$from, l = o.empty;
    if (o instanceof S) {
      if (!i.endOfTextblock(n) || s.depth == 0)
        return !1;
      l = !1, s = r.doc.resolve(e > 0 ? s.after() : s.before());
    }
    let a = O.findGapCursorFrom(s, e, l);
    return a ? (u && u(r.tr.setSelection(new O(a))), !0) : !1;
  };
}
function Up(t, e, n) {
  if (!t || !t.editable)
    return !1;
  let r = t.state.doc.resolve(e);
  if (!O.valid(r))
    return !1;
  let u = t.posAtCoords({ left: n.clientX, top: n.clientY });
  return u && u.inside > -1 && N.isSelectable(t.state.doc.nodeAt(u.inside)) ? !1 : (t.dispatch(t.state.tr.setSelection(new O(r))), !0);
}
function qp(t, e) {
  if (e.inputType != "insertCompositionText" || !(t.state.selection instanceof O))
    return !1;
  let { $from: n } = t.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(t.state.schema.nodes.text);
  if (!r)
    return !1;
  let u = x.empty;
  for (let o = r.length - 1; o >= 0; o--)
    u = x.from(r[o].createAndFill(null, u));
  let i = t.state.tr.replace(n.pos, n.pos, new M(u, 0, 0));
  return i.setSelection(S.near(i.doc.resolve(n.pos + 1))), t.dispatch(i), !1;
}
function Vp(t) {
  if (!(t.selection instanceof O))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", j.create(t.doc, [le.widget(t.selection.head, e, { key: "gapcursor" })]);
}
function re() {
  var t = arguments[0];
  typeof t == "string" && (t = document.createElement(t));
  var e = 1, n = arguments[1];
  if (n && typeof n == "object" && n.nodeType == null && !Array.isArray(n)) {
    for (var r in n)
      if (Object.prototype.hasOwnProperty.call(n, r)) {
        var u = n[r];
        typeof u == "string" ? t.setAttribute(r, u) : u != null && (t[r] = u);
      }
    e++;
  }
  for (; e < arguments.length; e++)
    Js(t, arguments[e]);
  return t;
}
function Js(t, e) {
  if (typeof e == "string")
    t.appendChild(document.createTextNode(e));
  else if (e != null)
    if (e.nodeType != null)
      t.appendChild(e);
    else if (Array.isArray(e))
      for (var n = 0; n < e.length; n++)
        Js(t, e[n]);
    else
      throw new RangeError("Unsupported child node: " + e);
}
const Vt = "http://www.w3.org/2000/svg", Qp = "http://www.w3.org/1999/xlink", Wr = "ProseMirror-icon";
function $p(t) {
  let e = 0;
  for (let n = 0; n < t.length; n++)
    e = (e << 5) - e + t.charCodeAt(n) | 0;
  return e;
}
function Yp(t, e) {
  let n = (t.nodeType == 9 ? t : t.ownerDocument) || document, r = n.createElement("div");
  if (r.className = Wr, e.path) {
    let { path: u, width: i, height: o } = e, s = "pm-icon-" + $p(u).toString(16);
    n.getElementById(s) || Wp(t, s, e);
    let l = r.appendChild(n.createElementNS(Vt, "svg"));
    l.style.width = i / o + "em", l.appendChild(n.createElementNS(Vt, "use")).setAttributeNS(Qp, "href", /([^#]*)/.exec(n.location.toString())[1] + "#" + s);
  } else if (e.dom)
    r.appendChild(e.dom.cloneNode(!0));
  else {
    let { text: u, css: i } = e;
    r.appendChild(n.createElement("span")).textContent = u || "", i && (r.firstChild.style.cssText = i);
  }
  return r;
}
function Wp(t, e, n) {
  let [r, u] = t.nodeType == 9 ? [t, t.body] : [t.ownerDocument || document, t], i = r.getElementById(Wr + "-collection");
  i || (i = r.createElementNS(Vt, "svg"), i.id = Wr + "-collection", i.style.display = "none", u.insertBefore(i, u.firstChild));
  let o = r.createElementNS(Vt, "symbol");
  o.id = e, o.setAttribute("viewBox", "0 0 " + n.width + " " + n.height), o.appendChild(r.createElementNS(Vt, "path")).setAttribute("d", n.path), i.appendChild(o);
}
const K = "ProseMirror-menu";
class ge {
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
    let n = this.spec, r = n.render ? n.render(e) : n.icon ? Yp(e.root, n.icon) : n.label ? re("div", null, rn(e, n.label)) : null;
    if (!r)
      throw new RangeError("MenuItem without icon or label property");
    if (n.title) {
      const i = typeof n.title == "function" ? n.title(e.state) : n.title;
      r.setAttribute("title", rn(e, i));
    }
    n.class && r.classList.add(n.class), n.css && (r.style.cssText += n.css), r.addEventListener("mousedown", (i) => {
      i.preventDefault(), r.classList.contains(K + "-disabled") || n.run(e.state, e.dispatch, e, i);
    });
    function u(i) {
      if (n.select) {
        let s = n.select(i);
        if (r.style.display = s ? "" : "none", !s)
          return !1;
      }
      let o = !0;
      if (n.enable && (o = n.enable(i) || !1, Hr(r, K + "-disabled", !o)), n.active) {
        let s = o && n.active(i) || !1;
        Hr(r, K + "-active", s);
      }
      return !0;
    }
    return { dom: r, update: u };
  }
}
function rn(t, e) {
  return t._props.translate ? t._props.translate(e) : e;
}
let Qt = { time: 0, node: null };
function Zs(t) {
  Qt.time = Date.now(), Qt.node = t.target;
}
function Gs(t) {
  return Date.now() - 100 < Qt.time && Qt.node && t.contains(Qt.node);
}
class qi {
  /**
  Create a dropdown wrapping the elements.
  */
  constructor(e, n = {}) {
    this.options = n, this.options = n || {}, this.content = Array.isArray(e) ? e : [e];
  }
  /**
  Render the dropdown menu and sub-items.
  */
  render(e) {
    let n = Ks(this.content, e), r = e.dom.ownerDocument.defaultView || window, u = re("div", {
      class: K + "-dropdown " + (this.options.class || ""),
      style: this.options.css
    }, rn(e, this.options.label || ""));
    this.options.title && u.setAttribute("title", rn(e, this.options.title));
    let i = re("div", { class: K + "-dropdown-wrap" }, u), o = null, s = null, l = () => {
      o && o.close() && (o = null, r.removeEventListener("mousedown", s));
    };
    u.addEventListener("mousedown", (c) => {
      c.preventDefault(), Zs(c), o ? l() : (o = this.expand(i, n.dom), r.addEventListener("mousedown", s = () => {
        Gs(i) || l();
      }));
    });
    function a(c) {
      let f = n.update(c);
      return i.style.display = f ? "" : "none", f;
    }
    return { dom: i, update: a };
  }
  /**
  @internal
  */
  expand(e, n) {
    let r = re("div", { class: K + "-dropdown-menu " + (this.options.class || "") }, n), u = !1;
    function i() {
      return u ? !1 : (u = !0, e.removeChild(r), !0);
    }
    return e.appendChild(r), { close: i, node: r };
  }
}
function Ks(t, e) {
  let n = [], r = [];
  for (let u = 0; u < t.length; u++) {
    let { dom: i, update: o } = t[u].render(e);
    n.push(re("div", { class: K + "-dropdown-item" }, i)), r.push(o);
  }
  return { dom: n, update: Xs(r, n) };
}
function Xs(t, e) {
  return (n) => {
    let r = !1;
    for (let u = 0; u < t.length; u++) {
      let i = t[u](n);
      e[u].style.display = i ? "" : "none", i && (r = !0);
    }
    return r;
  };
}
class Hp {
  /**
  Creates a submenu for the given group of menu elements. The
  following options are recognized:
  */
  constructor(e, n = {}) {
    this.options = n, this.content = Array.isArray(e) ? e : [e];
  }
  /**
  Renders the submenu.
  */
  render(e) {
    let n = Ks(this.content, e), r = e.dom.ownerDocument.defaultView || window, u = re("div", { class: K + "-submenu-label" }, rn(e, this.options.label || "")), i = re("div", { class: K + "-submenu-wrap" }, u, re("div", { class: K + "-submenu" }, n.dom)), o = null;
    u.addEventListener("mousedown", (l) => {
      l.preventDefault(), Zs(l), Hr(i, K + "-submenu-wrap-active", !1), o || r.addEventListener("mousedown", o = () => {
        Gs(i) || (i.classList.remove(K + "-submenu-wrap-active"), r.removeEventListener("mousedown", o), o = null);
      });
    });
    function s(l) {
      let a = n.update(l);
      return i.style.display = a ? "" : "none", a;
    }
    return { dom: i, update: s };
  }
}
function Jp(t, e) {
  let n = document.createDocumentFragment(), r = [], u = [];
  for (let o = 0; o < e.length; o++) {
    let s = e[o], l = [], a = [];
    for (let c = 0; c < s.length; c++) {
      let { dom: f, update: d } = s[c].render(t), p = re("span", { class: K + "item" }, f);
      n.appendChild(p), a.push(p), l.push(d);
    }
    l.length && (r.push(Xs(l, a)), o < e.length - 1 && u.push(n.appendChild(Zp())));
  }
  function i(o) {
    let s = !1, l = !1;
    for (let a = 0; a < r.length; a++) {
      let c = r[a](o);
      a && (u[a - 1].style.display = l && c ? "" : "none"), l = c, c && (s = !0);
    }
    return s;
  }
  return { dom: n, update: i };
}
function Zp() {
  return re("span", { class: K + "separator" });
}
const oe = {
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
}, Gp = new ge({
  title: "Join with above block",
  run: Qr,
  select: (t) => Qr(t),
  icon: oe.join
}), Kp = new ge({
  title: "Lift out of enclosing block",
  run: $r,
  select: (t) => $r(t),
  icon: oe.lift
}), Xp = new ge({
  title: "Select parent node",
  run: Yr,
  select: (t) => Yr(t),
  icon: oe.selectParentNode
});
let e1 = new ge({
  title: "Undo last change",
  run: nn,
  enable: (t) => nn(t),
  icon: oe.undo
}), t1 = new ge({
  title: "Redo last undone change",
  run: St,
  enable: (t) => St(t),
  icon: oe.redo
});
function n1(t, e) {
  let n = {
    run(r, u) {
      return Se(t, e.attrs)(r, u);
    },
    select(r) {
      return Se(t, e.attrs)(r);
    }
  };
  for (let r in e)
    n[r] = e[r];
  return new ge(n);
}
function Nr(t, e) {
  let n = F(t, e.attrs), r = {
    run: n,
    enable(u) {
      return n(u);
    },
    active(u) {
      let { $from: i, to: o, node: s } = u.selection;
      return s ? s.hasMarkup(t, e.attrs) : o <= i.end() && i.parent.hasMarkup(t, e.attrs);
    }
  };
  for (let u in e)
    r[u] = e[u];
  return new ge(r);
}
function Hr(t, e, n) {
  n ? t.classList.add(e) : t.classList.remove(e);
}
const xn = "ProseMirror-menubar";
function r1() {
  if (typeof navigator > "u")
    return !1;
  let t = navigator.userAgent;
  return !/Edge\/\d/.test(t) && /AppleWebKit/.test(t) && /Mobile\/\w+/.test(t);
}
function u1(t) {
  return new _e({
    view(e) {
      return new i1(e, t);
    }
  });
}
class i1 {
  constructor(e, n) {
    this.editorView = e, this.options = n, this.spacer = null, this.maxHeight = 0, this.widthForMaxHeight = 0, this.floating = !1, this.scrollHandler = null, this.wrapper = re("div", { class: xn + "-wrapper" }), this.menu = this.wrapper.appendChild(re("div", { class: xn })), this.menu.className = xn, e.dom.parentNode && e.dom.parentNode.replaceChild(this.wrapper, e.dom), this.wrapper.appendChild(e.dom);
    let { dom: r, update: u } = Jp(this.editorView, this.options.content);
    if (this.contentUpdate = u, this.menu.appendChild(r), this.update(), n.floating && !r1()) {
      this.updateFloat();
      let i = l1(this.wrapper);
      this.scrollHandler = (o) => {
        let s = this.editorView.root;
        (s.body || s).contains(this.wrapper) ? this.updateFloat(o.target.getBoundingClientRect ? o.target : void 0) : i.forEach((l) => l.removeEventListener("scroll", this.scrollHandler));
      }, i.forEach((o) => o.addEventListener("scroll", this.scrollHandler));
    }
  }
  update() {
    this.contentUpdate(this.editorView.state), this.floating ? this.updateScrollCursor() : (this.menu.offsetWidth != this.widthForMaxHeight && (this.widthForMaxHeight = this.menu.offsetWidth, this.maxHeight = 0), this.menu.offsetHeight > this.maxHeight && (this.maxHeight = this.menu.offsetHeight, this.menu.style.minHeight = this.maxHeight + "px"));
  }
  updateScrollCursor() {
    let e = this.editorView.root.getSelection();
    if (!e.focusNode)
      return;
    let n = e.getRangeAt(0).getClientRects(), r = n[o1(e) ? 0 : n.length - 1];
    if (!r)
      return;
    let u = this.menu.getBoundingClientRect();
    if (r.top < u.bottom && r.bottom > u.top) {
      let i = s1(this.wrapper);
      i && (i.scrollTop -= u.bottom - r.top);
    }
  }
  updateFloat(e) {
    let n = this.wrapper, r = n.getBoundingClientRect(), u = e ? Math.max(0, e.getBoundingClientRect().top) : 0;
    if (this.floating)
      if (r.top >= u || r.bottom < this.menu.offsetHeight + 10)
        this.floating = !1, this.menu.style.position = this.menu.style.left = this.menu.style.top = this.menu.style.width = "", this.menu.style.display = "", this.spacer.parentNode.removeChild(this.spacer), this.spacer = null;
      else {
        let i = (n.offsetWidth - n.clientWidth) / 2;
        this.menu.style.left = r.left + i + "px", this.menu.style.display = r.top > (this.editorView.dom.ownerDocument.defaultView || window).innerHeight ? "none" : "", e && (this.menu.style.top = u + "px");
      }
    else if (r.top < u && r.bottom >= this.menu.offsetHeight + 10) {
      this.floating = !0;
      let i = this.menu.getBoundingClientRect();
      this.menu.style.left = i.left + "px", this.menu.style.width = i.width + "px", e && (this.menu.style.top = u + "px"), this.menu.style.position = "fixed", this.spacer = re("div", { class: xn + "-spacer", style: `height: ${i.height}px` }), n.insertBefore(this.spacer, this.menu);
    }
  }
  destroy() {
    this.wrapper.parentNode && this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper);
  }
}
function o1(t) {
  return t.anchorNode == t.focusNode ? t.anchorOffset > t.focusOffset : t.anchorNode.compareDocumentPosition(t.focusNode) == Node.DOCUMENT_POSITION_FOLLOWING;
}
function s1(t) {
  for (let e = t.parentNode; e; e = e.parentNode)
    if (e.scrollHeight > e.clientHeight)
      return e;
}
function l1(t) {
  let e = [t.ownerDocument.defaultView || window];
  for (let n = t.parentNode; n; n = n.parentNode)
    e.push(n);
  return e;
}
function Ot(t, e = null) {
  return function(n, r) {
    let { $from: u, $to: i } = n.selection, o = u.blockRange(i), s = !1, l = o;
    if (!o)
      return !1;
    if (o.depth >= 2 && u.node(o.depth - 1).type.compatibleContent(t) && o.startIndex == 0) {
      if (u.index(o.depth - 1) == 0)
        return !1;
      let c = n.doc.resolve(o.start - 2);
      l = new An(c, c, o.depth), o.endIndex < o.parent.childCount && (o = new An(u, n.doc.resolve(i.end(o.depth)), o.depth)), s = !0;
    }
    let a = Gr(l, t, e, o);
    return a ? (r && r(a1(n.tr, o, a, s, t).scrollIntoView()), !0) : !1;
  };
}
function a1(t, e, n, r, u) {
  let i = x.empty;
  for (let c = n.length - 1; c >= 0; c--)
    i = x.from(n[c].type.create(n[c].attrs, i));
  t.step(new q(e.start - (r ? 2 : 0), e.end, e.start, e.end, new M(i, 0, 0), n.length, !0));
  let o = 0;
  for (let c = 0; c < n.length; c++)
    n[c].type == u && (o = c + 1);
  let s = n.length - o, l = e.start + n.length - (r ? 2 : 0), a = e.parent;
  for (let c = e.startIndex, f = e.endIndex, d = !0; c < f; c++, d = !1)
    !d && Mt(t.doc, l, s) && (t.split(l, s), l += 2 * s), l += a.child(c).nodeSize;
  return t;
}
function c1(t, e) {
  return function(n, r) {
    let { $from: u, $to: i, node: o } = n.selection;
    if (o && o.isBlock || u.depth < 2 || !u.sameParent(i))
      return !1;
    let s = u.node(-1);
    if (s.type != t)
      return !1;
    if (u.parent.content.size == 0 && u.node(-1).childCount == u.indexAfter(-1)) {
      if (u.depth == 3 || u.node(-3).type != t || u.index(-2) != u.node(-2).childCount - 1)
        return !1;
      if (r) {
        let f = x.empty, d = u.index(-1) ? 1 : u.index(-2) ? 2 : 3;
        for (let b = u.depth - d; b >= u.depth - 3; b--)
          f = x.from(u.node(b).copy(f));
        let p = u.indexAfter(-1) < u.node(-2).childCount ? 1 : u.indexAfter(-2) < u.node(-3).childCount ? 2 : 3;
        f = f.append(x.from(t.createAndFill()));
        let h = u.before(u.depth - (d - 1)), m = n.tr.replace(h, u.after(-p), new M(f, 4 - d, 0)), g = -1;
        m.doc.nodesBetween(h, m.doc.content.size, (b, y) => {
          if (g > -1)
            return !1;
          b.isTextblock && b.content.size == 0 && (g = y + 1);
        }), g > -1 && m.setSelection(T.near(m.doc.resolve(g))), r(m.scrollIntoView());
      }
      return !0;
    }
    let l = i.pos == u.end() ? s.contentMatchAt(0).defaultType : null, a = n.tr.delete(u.pos, i.pos), c = l ? [e ? { type: t, attrs: e } : null, { type: l }] : void 0;
    return Mt(a.doc, u.pos, 2, c) ? (r && r(a.split(u.pos, 2, c).scrollIntoView()), !0) : !1;
  };
}
function f1(t) {
  return function(e, n) {
    let { $from: r, $to: u } = e.selection, i = r.blockRange(u, (o) => o.childCount > 0 && o.firstChild.type == t);
    return i ? n ? r.node(i.depth - 1).type == t ? d1(e, n, t, i) : h1(e, n, i) : !0 : !1;
  };
}
function d1(t, e, n, r) {
  let u = t.tr, i = r.end, o = r.$to.end(r.depth);
  i < o && (u.step(new q(i - 1, o, i, o, new M(x.from(n.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new An(u.doc.resolve(r.$from.pos), u.doc.resolve(o), r.depth));
  const s = un(r);
  if (s == null)
    return !1;
  u.lift(r, s);
  let l = u.mapping.map(i, -1) - 1;
  return _t(u.doc, l) && u.join(l), e(u.scrollIntoView()), !0;
}
function h1(t, e, n) {
  let r = t.tr, u = n.parent;
  for (let p = n.end, h = n.endIndex - 1, m = n.startIndex; h > m; h--)
    p -= u.child(h).nodeSize, r.delete(p - 1, p + 1);
  let i = r.doc.resolve(n.start), o = i.nodeAfter;
  if (r.mapping.map(n.end) != n.start + i.nodeAfter.nodeSize)
    return !1;
  let s = n.startIndex == 0, l = n.endIndex == u.childCount, a = i.node(-1), c = i.index(-1);
  if (!a.canReplace(c + (s ? 0 : 1), c + 1, o.content.append(l ? x.empty : x.from(u))))
    return !1;
  let f = i.pos, d = f + o.nodeSize;
  return r.step(new q(f - (s ? 1 : 0), d + (l ? 1 : 0), f + 1, d - 1, new M((s ? x.empty : x.from(u.copy(x.empty))).append(l ? x.empty : x.from(u.copy(x.empty))), s ? 0 : 1, l ? 0 : 1), s ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function p1(t) {
  return function(e, n) {
    let { $from: r, $to: u } = e.selection, i = r.blockRange(u, (a) => a.childCount > 0 && a.firstChild.type == t);
    if (!i)
      return !1;
    let o = i.startIndex;
    if (o == 0)
      return !1;
    let s = i.parent, l = s.child(o - 1);
    if (l.type != t)
      return !1;
    if (n) {
      let a = l.lastChild && l.lastChild.type == s.type, c = x.from(a ? t.create() : null), f = new M(x.from(t.create(null, x.from(s.type.create(null, c)))), a ? 3 : 1, 0), d = i.start, p = i.end;
      n(e.tr.step(new q(d - (a ? 3 : 1), p, d, p, f, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const Mn = "ProseMirror-prompt";
function el(t) {
  let e = document.body.appendChild(document.createElement("div"));
  e.className = Mn;
  let n = (d) => {
    e.contains(d.target) || r();
  };
  setTimeout(() => window.addEventListener("mousedown", n), 50);
  let r = () => {
    window.removeEventListener("mousedown", n), e.parentNode && e.parentNode.removeChild(e);
  }, u = [];
  for (let d in t.fields)
    u.push(t.fields[d].render());
  let i = document.createElement("button");
  i.type = "submit", i.className = Mn + "-submit", i.textContent = "OK";
  let o = document.createElement("button");
  o.type = "button", o.className = Mn + "-cancel", o.textContent = "Cancel", o.addEventListener("click", r);
  let s = e.appendChild(document.createElement("form"));
  t.title && (s.appendChild(document.createElement("h5")).textContent = t.title), u.forEach((d) => {
    s.appendChild(document.createElement("div")).appendChild(d);
  });
  let l = s.appendChild(document.createElement("div"));
  l.className = Mn + "-buttons", l.appendChild(i), l.appendChild(document.createTextNode(" ")), l.appendChild(o);
  let a = e.getBoundingClientRect();
  e.style.top = (window.innerHeight - a.height) / 2 + "px", e.style.left = (window.innerWidth - a.width) / 2 + "px";
  let c = () => {
    let d = m1(t.fields, u);
    d && (r(), t.callback(d));
  };
  s.addEventListener("submit", (d) => {
    d.preventDefault(), c();
  }), s.addEventListener("keydown", (d) => {
    d.keyCode == 27 ? (d.preventDefault(), r()) : d.keyCode == 13 && !(d.ctrlKey || d.metaKey || d.shiftKey) ? (d.preventDefault(), c()) : d.keyCode == 9 && window.setTimeout(() => {
      e.contains(document.activeElement) || r();
    }, 500);
  });
  let f = s.elements[0];
  f && f.focus();
}
function m1(t, e) {
  let n = /* @__PURE__ */ Object.create(null), r = 0;
  for (let u in t) {
    let i = t[u], o = e[r++], s = i.read(o), l = i.validate(s);
    if (l)
      return g1(o, l), null;
    n[u] = i.clean(s);
  }
  return n;
}
function g1(t, e) {
  let n = t.parentNode, r = n.appendChild(document.createElement("div"));
  r.style.left = t.offsetLeft + t.offsetWidth + 2 + "px", r.style.top = t.offsetTop - 5 + "px", r.className = "ProseMirror-invalid", r.textContent = e, setTimeout(() => n.removeChild(r), 1500);
}
class b1 {
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
class $t extends b1 {
  render() {
    let e = document.createElement("input");
    return e.type = "text", e.placeholder = this.options.label, e.value = this.options.value || "", e.autocomplete = "off", e;
  }
}
function tl(t, e) {
  let n = t.selection.$from;
  for (let r = n.depth; r >= 0; r--) {
    let u = n.index(r);
    if (n.node(r).canReplaceWith(u, u, e))
      return !0;
  }
  return !1;
}
function x1(t) {
  return new ge({
    title: "Insert image",
    label: "Image",
    enable(e) {
      return tl(e, t);
    },
    run(e, n, r) {
      let { from: u, to: i } = e.selection, o = null;
      e.selection instanceof N && e.selection.node.type == t && (o = e.selection.node.attrs), el({
        title: "Insert image",
        fields: {
          src: new $t({ label: "Location", required: !0, value: o && o.src }),
          title: new $t({ label: "Title", value: o && o.title }),
          alt: new $t({
            label: "Description",
            value: o ? o.alt : e.doc.textBetween(u, i, " ")
          })
        },
        callback(s) {
          r.dispatch(r.state.tr.replaceSelectionWith(t.createAndFill(s))), r.focus();
        }
      });
    }
  });
}
function nl(t, e) {
  let n = {
    label: e.title,
    run: t
  };
  for (let r in e)
    n[r] = e[r];
  return !e.enable && !e.select && (n[e.enable ? "enable" : "select"] = (r) => t(r)), new ge(n);
}
function Jr(t, e) {
  let { from: n, $from: r, to: u, empty: i } = t.selection;
  return i ? !!e.isInSet(t.storedMarks || r.marks()) : t.doc.rangeHasMark(n, u, e);
}
function Cr(t, e) {
  let n = {
    active(r) {
      return Jr(r, t);
    }
  };
  for (let r in e)
    n[r] = e[r];
  return nl(se(t), n);
}
function M1(t) {
  return new ge({
    title: "Add or remove link",
    icon: oe.link,
    active(e) {
      return Jr(e, t);
    },
    enable(e) {
      return !e.selection.empty;
    },
    run(e, n, r) {
      if (Jr(e, t))
        return se(t)(e, n), !0;
      el({
        title: "Create a link",
        fields: {
          href: new $t({
            label: "Link target",
            required: !0
          }),
          title: new $t({ label: "Title" })
        },
        callback(u) {
          se(t, u)(r.state, r.dispatch), r.focus();
        }
      });
    }
  });
}
function Vi(t, e) {
  return nl(Ot(t, e.attrs), e);
}
function y1(t) {
  let e = {}, n;
  (n = t.marks.strong) && (e.toggleStrong = Cr(n, { title: "Toggle strong style", icon: oe.strong })), (n = t.marks.em) && (e.toggleEm = Cr(n, { title: "Toggle emphasis", icon: oe.em })), (n = t.marks.code) && (e.toggleCode = Cr(n, { title: "Toggle code font", icon: oe.code })), (n = t.marks.link) && (e.toggleLink = M1(n));
  let r;
  if ((r = t.nodes.image) && (e.insertImage = x1(r)), (r = t.nodes.bullet_list) && (e.wrapBulletList = Vi(r, {
    title: "Wrap in bullet list",
    icon: oe.bulletList
  })), (r = t.nodes.ordered_list) && (e.wrapOrderedList = Vi(r, {
    title: "Wrap in ordered list",
    icon: oe.orderedList
  })), (r = t.nodes.blockquote) && (e.wrapBlockQuote = n1(r, {
    title: "Wrap in block quote",
    icon: oe.blockquote
  })), (r = t.nodes.paragraph) && (e.makeParagraph = Nr(r, {
    title: "Change to paragraph",
    label: "Plain"
  })), (r = t.nodes.code_block) && (e.makeCodeBlock = Nr(r, {
    title: "Change to code block",
    label: "Code"
  })), r = t.nodes.heading)
    for (let i = 1; i <= 10; i++)
      e["makeHead" + i] = Nr(r, {
        title: "Change to heading " + i,
        label: "Level " + i,
        attrs: { level: i }
      });
  if (r = t.nodes.horizontal_rule) {
    let i = r;
    e.insertHorizontalRule = new ge({
      title: "Insert horizontal rule",
      label: "Horizontal rule",
      enable(o) {
        return tl(o, i);
      },
      run(o, s) {
        s(o.tr.replaceSelectionWith(i.create()));
      }
    });
  }
  let u = (i) => i.filter((o) => o);
  return e.insertMenu = new qi(u([e.insertImage, e.insertHorizontalRule]), { label: "Insert" }), e.typeMenu = new qi(u([e.makeParagraph, e.makeCodeBlock, e.makeHead1 && new Hp(u([
    e.makeHead1,
    e.makeHead2,
    e.makeHead3,
    e.makeHead4,
    e.makeHead5,
    e.makeHead6
  ]), { label: "Heading" })]), { label: "Type..." }), e.inlineMenu = [u([e.toggleStrong, e.toggleEm, e.toggleCode, e.toggleLink])], e.blockMenu = [u([
    e.wrapBulletList,
    e.wrapOrderedList,
    e.wrapBlockQuote,
    Gp,
    Kp,
    Xp
  ])], e.fullMenu = e.inlineMenu.concat([[e.insertMenu, e.typeMenu]], [[e1, t1]], e.blockMenu), e;
}
const Qi = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function k1(t, e) {
  let n = {}, r;
  function u(i, o) {
    if (e) {
      let s = e[i];
      if (s === !1)
        return;
      s && (i = s);
    }
    n[i] = o;
  }
  if (u("Mod-z", nn), u("Shift-Mod-z", St), u("Backspace", jd), Qi || u("Mod-y", St), u("Alt-ArrowUp", Qr), u("Alt-ArrowDown", Dp), u("Mod-BracketLeft", $r), u("Escape", Yr), (r = t.marks.strong) && (u("Mod-b", se(r)), u("Mod-B", se(r))), (r = t.marks.em) && (u("Mod-i", se(r)), u("Mod-I", se(r))), (r = t.marks.code) && u("Mod-`", se(r)), (r = t.nodes.bullet_list) && u("Shift-Ctrl-8", Ot(r)), (r = t.nodes.ordered_list) && u("Shift-Ctrl-9", Ot(r)), (r = t.nodes.blockquote) && u("Ctrl->", Se(r)), r = t.nodes.hard_break) {
    let i = r, o = ae($s, (s, l) => (l && l(s.tr.replaceSelectionWith(i.create()).scrollIntoView()), !0));
    u("Mod-Enter", o), u("Shift-Enter", o), Qi && u("Ctrl-Enter", o);
  }
  if ((r = t.nodes.list_item) && (u("Enter", c1(r)), u("Mod-[", f1(r)), u("Mod-]", p1(r))), (r = t.nodes.paragraph) && u("Shift-Ctrl-0", F(r)), (r = t.nodes.code_block) && u("Shift-Ctrl-\\", F(r)), r = t.nodes.heading)
    for (let i = 1; i <= 6; i++)
      u("Shift-Ctrl-" + i, F(r, { level: i }));
  if (r = t.nodes.horizontal_rule) {
    let i = r;
    u("Mod-_", (o, s) => (s && s(o.tr.replaceSelectionWith(i.create()).scrollIntoView()), !0));
  }
  return n;
}
function D1(t) {
  return Ge(/^\s*>\s$/, t);
}
function N1(t) {
  return Ge(/^(\d+)\.\s$/, t, (e) => ({ order: +e[1] }), (e, n) => n.childCount + n.attrs.order == +e[1]);
}
function C1(t) {
  return Ge(/^\s*([-+*])\s$/, t);
}
function A1(t) {
  return Wn(/^```$/, t);
}
function E1(t, e) {
  return Wn(new RegExp("^(#{1," + e + "})\\s$"), t, (n) => ({ level: n[1].length }));
}
function T1(t) {
  let e = Ud.concat(Fd, Ld), n;
  return (n = t.nodes.blockquote) && e.push(D1(n)), (n = t.nodes.ordered_list) && e.push(N1(n)), (n = t.nodes.bullet_list) && e.push(C1(n)), (n = t.nodes.code_block) && e.push(A1(n)), (n = t.nodes.heading) && e.push(E1(n, 6)), Os({ rules: e });
}
function I1(t) {
  let e = [
    T1(t.schema),
    Ri(k1(t.schema, t.mapKeys)),
    Ri(jp),
    Lp(),
    Bp()
  ];
  return t.menuBar !== !1 && e.push(u1({
    floating: t.floatingMenu !== !1,
    content: t.menuContent || y1(t.schema).fullMenu
  })), t.history !== !1 && e.push(mp()), e.concat(new _e({
    props: {
      attributes: { class: "ProseMirror-example-setup-style" }
    }
  }));
}
class S1 {
  constructor(e, n) {
    this.items = e, this.dom = document.createElement("div"), this.dom.className = "menubar govuk-button-group", this.dom.role = "toolbar", e.forEach(({ command: r, dom: u, customHandler: i }, o) => {
      const s = this.dom.appendChild(u);
      s.setAttribute("tabindex", o === 0 ? 0 : -1), s.addEventListener("keyup", (l) => {
        l.key === "ArrowLeft" && this.focusPreviousButton(s), l.key === "ArrowRight" && this.focusNextButton(s);
      }), s.addEventListener("click", (l) => {
        l.preventDefault(), i ? i(n.state, n.dispatch, n) : (r(n.state, n.dispatch, n), n.focus());
      });
    }), this.update(n), n.dom.parentNode.insertBefore(this.dom, n.dom);
  }
  focusPreviousButton(e) {
    let n = e.previousElementSibling;
    for (; n && n.disabled; )
      n = n.previousElementSibling;
    n && (e.setAttribute("tabindex", -1), n.setAttribute("tabindex", 0), n.focus());
  }
  focusNextButton(e) {
    let n = e.nextElementSibling;
    for (; n && n.disabled; )
      n = n.nextElementSibling;
    n && (e.setAttribute("tabindex", -1), n.setAttribute("tabindex", 0), n.focus());
  }
  update(e) {
    const n = this.dom.querySelector('[tabindex="0"]');
    if (this.items.forEach(({ command: u, dom: i, update: o }) => {
      const s = u(e.state, null, e);
      i.disabled = !s, o && o(e);
    }), !n || !n.disabled)
      return;
    const r = this.dom.querySelector("button:not(:disabled)");
    r && (n.setAttribute("tabindex", -1), r.setAttribute("tabindex", 0));
  }
  destroy() {
    this.dom.remove();
  }
}
const w1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNyAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjY3MSAxMi4yMzc1SDMuNjY2ODRWMjAuMDAwN0gwVjEuNTYxNzFIMy42NzczMlY4Ljg5NTRIMTEuNjgxNVYxLjU2MTcxSDE1LjM1ODhWMjAuMDAwN0gxMS42OTJMMTEuNjcxIDEyLjIzNzVaTTIyLjI3MzQgMi4xMTY5OEMyMS45OTQgMi4xMTA4NyAyMS43MTYxIDIuMTYwNzQgMjEuNDU2MyAyLjI2MzY1QzIxLjIzNDQgMi4zNTcwNSAyMS4wMzcyIDIuNTAwNDggMjAuODggMi42ODI3MkMyMC43MjYxIDIuODY2ODcgMjAuNjEyIDMuMDgwOSAyMC41NDQ4IDMuMzExMzJDMjAuNDcxMSAzLjU2MzAxIDIwLjQzNTggMy44MjQzNyAyMC40NCA0LjA4NjZMMTguMDgyOCAzLjg3NzA2QzE4LjA3NDEgMy4zMDg2NSAxOC4xODQ3IDIuNzQ0NzQgMTguNDA3NSAyLjIyMTc0QzE4LjYxMjYgMS43NTY3OSAxOC45MTY1IDEuMzQyMDggMTkuMjk4MSAxLjAwNjQ1QzE5LjY5MzcgMC42Njk3NDMgMjAuMTUzNCAwLjQxNjcwMyAyMC42NDk2IDAuMjYyNjAzQzIxLjE4NyAwLjA4NTkxMjEgMjEuNzQ5NiAtMC4wMDI1MzkzNiAyMi4zMTUzIDAuMDAwNjg1OTMyQzIyLjkwMyAtMC4wMDg5NjAzIDIzLjQ4NzggMC4wODMxOTg4IDI0LjA0NCAwLjI3MzA4QzI0LjUzODggMC40NDMzMzggMjQuOTk0NiAwLjcxMDQ1NSAyNS4zODUgMS4wNTg4M0MyNS43NTQ1IDEuMzk0MTcgMjYuMDQ3NSAxLjgwNTA4IDI2LjI0NDEgMi4yNjM2NUMyNi40NTQ5IDIuNzUzMjIgMjYuNTYyIDMuMjgxMTggMjYuNTU4NCAzLjgxNDJDMjYuNTYyOSA0LjQwNjgxIDI2LjQzNzcgNC45OTMyMyAyNi4xOTE3IDUuNTMyMzhDMjUuOTQzNCA2LjA3NDM2IDI1LjYxNSA2LjU3NTg3IDI1LjIxNzQgNy4wMjAwN0MyNC43OTExIDcuNDg4MTIgMjQuMzEzMSA3LjkwNjM3IDIzLjc5MjYgOC4yNjY3OUMyMy4yNzA3IDguNjUwNjIgMjIuNzI0OCA5LjAwMDU3IDIyLjE1ODIgOS4zMTQ0NkwyMS45NDg3IDkuNDI5NzFIMjYuNjk0NlYxMS41MjVIMTguMzk3MVY5LjQyOTcxQzE4LjgyMzEgOS4xOTkyMiAxOS4yNTk2IDguOTUxMjcgMTkuNzA2NyA4LjY4NTg2QzIwLjE1MzcgOC40MjA0NSAyMC41ODY3IDguMTQ0NTcgMjEuMDA1OCA3Ljg1ODJDMjEuNDI0OCA3LjU3MTg0IDIxLjgyMjkgNy4yNzE1MSAyMi4yMDAxIDYuOTU3MjFDMjIuNTU0MyA2LjY2NzA0IDIyLjg4MDUgNi4zNDQzNSAyMy4xNzQ0IDUuOTkzMzVDMjMuNDM5NiA1LjY3NDc0IDIzLjY2MTYgNS4zMjI0NiAyMy44MzQ1IDQuOTQ1NjhDMjMuOTg3MiA0LjYxNzE4IDI0LjA2OTMgNC4yNjAyNSAyNC4wNzU0IDMuODk4MDFDMjQuMDczOCAzLjY3OTk3IDI0LjAzNDkgMy40NjM4MSAyMy45NjAyIDMuMjU4OTRDMjMuODg2MSAzLjA1MzU1IDIzLjc3MjIgMi44NjQ4NCAyMy42MjQ5IDIuNzAzNjdDMjMuNDY5NiAyLjUzNjM5IDIzLjI4MDMgMi40MDQyMyAyMy4wNjk3IDIuMzE2MDNDMjIuODIxNiAyLjE5MzMgMjIuNTUwMSAyLjEyNTQxIDIyLjI3MzQgMi4xMTY5OFoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=", O1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjkiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyOSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03Ljc0MTkzIDMuODcwOTdDNy43NDE5MyA2LjAwODg0IDYuMDA4ODQgNy43NDE5NCAzLjg3MDk3IDcuNzQxOTRDMS43MzMwOSA3Ljc0MTk0IDAgNi4wMDg4NCAwIDMuODcwOTdDMCAxLjczMzA5IDEuNzMzMDkgMCAzLjg3MDk3IDBDNi4wMDg4NCAwIDcuNzQxOTMgMS43MzMwOSA3Ljc0MTkzIDMuODcwOTdaTTExLjI5MDMgNS40NDQwNFYyLjI1ODA2SDI4LjA2NDVWNS40NDQwNEgxMS4yOTAzWk0xMS4yOTAzIDE3Ljc0MTlWMTQuNTU1OUgyOC4wNjQ1VjE3Ljc0MTlIMTEuMjkwM1pNMy44NzA5NyAyMEM2LjAwODg0IDIwIDcuNzQxOTMgMTguMjY2OSA3Ljc0MTkzIDE2LjEyOUM3Ljc0MTkzIDEzLjk5MTIgNi4wMDg4NCAxMi4yNTgxIDMuODcwOTcgMTIuMjU4MUMxLjczMzA5IDEyLjI1ODEgMCAxMy45OTEyIDAgMTYuMTI5QzAgMTguMjY2OSAxLjczMzA5IDIwIDMuODcwOTcgMjBaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K", _1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNiAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkuNjQ3NDUgNS44MjY2MVYyLjgwMjQySDI1LjMyMjlWNS44MjY2MUg5LjY0NzQ1Wk05LjY0NzQ1IDE3LjUyMDJWMTQuNDk2SDI1LjMyMjlWMTcuNTIwMkg5LjY0NzQ1Wk0zLjk0MTggMFY2Ljk4NTg5SDUuNzE2VjguNTM4MzFIMC40MjM2NlY2Ljk4NTg5SDIuMTg3NzdWMi45MDMyMkgwLjQxMzU3OVYxLjM0MDczSDEuMDA4MzRDMS4yMTg4OSAxLjM0NTIxIDEuNDI5MDkgMS4zMjE0OCAxLjYzMzM0IDEuMjcwMTZDMS43NzQ2OCAxLjIzNTAzIDEuOTAzNjkgMS4xNjE4MSAyLjAwNjMyIDEuMDU4NDdDMi4wOTg3NCAwLjk1NjI5MSAyLjE2MTQ4IDAuODMwODA1IDIuMTg3NzcgMC42OTU1NjRDMi4yMDU5NyAwLjUxNzkzOCAyLjIwNTk3IDAuMzM4OTE3IDIuMTg3NzcgMC4xNjEyOVYwLjAxMDA3OTlMMy45NDE4IDBaTTIuOTg0MTQgMTMuMzE2NUMyLjc4NzA3IDEzLjMxNDEgMi41OTE1NiAxMy4zNTE4IDIuNDA5NTUgMTMuNDI3NEMyLjI1MDA3IDEzLjQ5NDYgMi4xMDg1MiAxMy41OTgyIDEuOTk2MjQgMTMuNzI5OEMxLjg4NjAxIDEzLjg1OTUgMS44MDM2NSAxNC4wMTA1IDEuNzU0MyAxNC4xNzM0QzEuNjk5ODEgMTQuMzUzMSAxLjY3MjYyIDE0LjU0IDEuNjczNjYgMTQuNzI3OEwwLjAwMDI3MjcxMyAxNC41NzY2Qy0wLjAwNTI2ODc2IDE0LjE3MTYgMC4wNzM2OTYyIDEzLjc2OTkgMC4yMzIxMjcgMTMuMzk3MkMwLjM3NTUzNCAxMy4wNjY1IDAuNTg4NzM5IDEyLjc3MDggMC44NTcxMjcgMTIuNTMwMkMxLjEzMDg0IDEyLjI5MTQgMS40NDk2IDEyLjEwOTcgMS43OTQ2MyAxMS45OTZDMi4xNzUzMiAxMS44NzE5IDIuNTczNjggMTEuODEwNiAyLjk3NDA2IDExLjgxNDVDMy4zODkyNSAxMS44MTA3IDMuODAxOTYgMTEuODc4OSA0LjE5MzgyIDEyLjAxNjFDNC41NDMzNyAxMi4xMzYyIDQuODY1NSAxMi4zMjQ2IDUuMTQxNCAxMi41NzA2QzUuNDA2MzggMTIuODExOSA1LjYxNjEzIDEzLjEwNzYgNS43NTYzMiAxMy40Mzc1QzUuOTA1NjUgMTMuNzg4IDUuOTgxMTUgMTQuMTY1NCA1Ljk3ODEgMTQuNTQ2NEM1Ljk4MTMgMTQuOTcwNSA1Ljg5MTg1IDE1LjM5MDIgNS43MTYgMTUuNzc2MkM1LjUzODM5IDE2LjE2MTggNS4zMDM5MyAxNi41MTg2IDUuMDIwNDMgMTYuODM0N0M0LjcxODc0IDE3LjE2NzIgNC4zODA1OSAxNy40NjQ4IDQuMDEyMzcgMTcuNzIxOEMzLjY0MTc4IDE3Ljk4ODEgMy4yNTQ1NyAxOC4yMzA2IDIuODUzMSAxOC40NDc2TDIuNzAxODggMTguNTI4Mkg2LjA2ODgyVjIwSDAuMjMyMTI3VjE4LjUzODNMMS4xNTk1NSAxOC4wMDRDMS40NzU0MSAxNy44MTU5IDEuNzgxMTkgMTcuNjE3NiAyLjA3Njg5IDE3LjQwOTNDMi4zNzI1OCAxNy4yMDA5IDIuNjU0ODQgMTYuOTg1OSAyLjkyMzY2IDE2Ljc2NDFDMy4xNzY3NiAxNi41NTQ1IDMuNDA5NjQgMTYuMzIxNyAzLjYxOTIyIDE2LjA2ODVDMy44MDUwNSAxNS44NDQ0IDMuOTYwOTMgMTUuNTk3IDQuMDgyOTMgMTUuMzMyN0M0LjE5NjYgMTUuMDg2MiA0LjI1NTA4IDE0LjgxNzggNC4yNTQzIDE0LjU0NjRDNC4yNTMyMSAxNC4zOTE3IDQuMjI1OTQgMTQuMjM4MyA0LjE3MzY2IDE0LjA5MjdDNC4xMjM2NiAxMy45NDQ0IDQuMDQ0ODcgMTMuODA3NCAzLjk0MTggMTMuNjg5NUMzLjgzMjQ5IDEzLjU2ODQgMy42OTg0MSAxMy40NzIxIDMuNTQ4NjYgMTMuNDA3M0MzLjM2OTA0IDEzLjMzNzQgMy4xNzY2MiAxMy4zMDY1IDIuOTg0MTQgMTMuMzE2NVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=", z1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMiAyNEMxOC42Mjc0IDI0IDI0IDE4LjYyNzQgMjQgMTJDMjQgNS4zNzI1OCAxOC42Mjc0IDAgMTIgMEM1LjM3MjU4IDAgMCA1LjM3MjU4IDAgMTJDMCAxOC42Mjc0IDUuMzcyNTggMjQgMTIgMjRaTTEyLjk1ODcgMTUuODE4MlY2TDEwLjQ5MzUgNi4wMTQxN1Y2LjIyNjY4QzEwLjUxOTEgNi40NzYzMiAxMC41MTkxIDYuNzI3OTMgMTAuNDkzNSA2Ljk3NzU3QzEwLjQ1NjYgNy4xNjc2NCAxMC4zNjg0IDcuMzQ0IDEwLjIzODUgNy40ODc2QzEwLjA5NDIgNy42MzI4NCA5LjkxMjk0IDcuNzM1NzUgOS43MTQyOSA3Ljc4NTEyQzkuNDI3MjMgNy44NTcyNSA5LjEzMTggNy44OTA2IDguODM1ODkgNy44ODQzSDhWMTAuMDgwM0gxMC40OTM1VjE1LjgxODJIOC4wMTQxN1YxOEgxNS40NTIyVjE1LjgxODJIMTIuOTU4N1oiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=", j1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE4Ljg3MjMgMS4wODA4NEMxOC41Mjg4IDAuNzM2NTcxIDE4LjEyMDQgMC40NjM3OTUgMTcuNjcwOCAwLjI3ODI4MUMxNy4yMjEzIDAuMDkyNzY2NiAxNi43Mzk0IC0wLjAwMTgwNzE4IDE2LjI1MyAyLjYxNTI2ZS0wNUMxNS43NjYxIDQuNjU4OTRlLTA2IDE1LjI4MzkgMC4wOTYzNTU2IDE0LjgzNDQgMC4yODM1MjZDMTQuMzg0OCAwLjQ3MDY5NSAxMy45NzY4IDAuNzQ0OTgzIDEzLjYzMzcgMS4wOTA1OEwxMC42MjUgNC4xMTg4MkMxMC4xNDY2IDQuNTk5NzIgOS44MDkzMSA1LjIwMjU2IDkuNjQ5NjYgNS44NjE3OUM5LjQ5IDYuNTIxMDEgOS41MTQxMyA3LjIxMTM5IDkuNzE5NDMgNy44NTc4Nkw5LjgwNzA2IDguMTMwNUwxMS4yODcxIDYuNjQwNzNWNi41NzI1N0MxMS4zMjA3IDYuMTA1OTEgMTEuNTIxMiA1LjY2NjkzIDExLjg1MTkgNS4zMzU5NkwxNC44NDExIDIuMzE3NDZDMTUuMDI0IDIuMTMzMzIgMTUuMjQxMyAxLjk4NzAxIDE1LjQ4MDcgMS44ODY4N0MxNS43MjAxIDEuNzg2NzMgMTUuOTc2OSAxLjczNDcyIDE2LjIzNjQgMS43MzM4MkMxNi40OTU5IDEuNzMyOTEgMTYuNzUzIDEuNzgzMTMgMTYuOTkzMSAxLjg4MTZDMTcuMjMzMiAxLjk4MDA3IDE3LjQ1MTYgMi4xMjQ4NiAxNy42MzU3IDIuMzA3NzJDMTcuODE5OCAyLjQ5MDU3IDE3Ljk2NjEgMi43MDc5IDE4LjA2NjMgMi45NDczQzE4LjE2NjQgMy4xODY3IDE4LjIxODQgMy40NDM0OCAxOC4yMTkzIDMuNzAyOThDMTguMjIwMiAzLjk2MjQ3IDE4LjE3IDQuMjE5NjEgMTguMDcxNSA0LjQ1OTdDMTcuOTczMSA0LjY5OTc5IDE3LjgyODMgNC45MTgxMyAxNy42NDU0IDUuMTAyMjdMMTQuNjM2NyA4LjEzMDVDMTQuMzA3MiA4LjQ2NDc2IDEzLjg2OCA4LjY2ODc3IDEzLjQwMDEgOC43MDQ5OUgxMy4zMzE5TDExLjg1MTkgMTAuMTk0OEwxMi4xMjQ1IDEwLjI4MjRDMTIuNzcyNyAxMC40ODUzIDEzLjQ2NDEgMTAuNTA2MyAxNC4xMjM1IDEwLjM0MzJDMTQuNzgyOCAxMC4xODAxIDE1LjM4NDcgOS44MzkwNiAxNS44NjM1IDkuMzU3MzhMMTguODcyMyA2LjMyOTE0QzE5LjU2NjIgNS42MzIwOCAxOS45NTU4IDQuNjg4NTUgMTkuOTU1OCAzLjcwNDk5QzE5Ljk1NTggMi43MjE0MyAxOS41NjYyIDEuNzc3OTEgMTguODcyMyAxLjA4MDg0Wk0xMC4xNTc2IDExLjkwODVMOC42Nzc1NiAxMy4zOTgzVjEzLjQ2NjRDOC42NDM5NyAxMy45MzMxIDguNDQzNDkgMTQuMzcyMSA4LjExMjgxIDE0LjcwM0w1LjEwNDA0IDE3LjcyMTVDNC43Mjk1OSAxOC4wOTM0IDQuMjIyNzUgMTguMzAxMyAzLjY5NTAyIDE4LjI5OTVDMy4xNjcyOSAxOC4yOTc2IDIuNjYxOSAxOC4wODYzIDIuMjkwMDIgMTcuNzExOEMxLjkxODE1IDE3LjMzNzQgMS43MTAyNiAxNi44MzA1IDEuNzEyMDkgMTYuMzAyOEMxLjcxMzkyIDE1Ljc3NSAxLjkyNTMxIDE1LjI2OTcgMi4yOTk3NiAxNC44OTc4TDUuMzA4NTIgMTEuODY5NUM1LjYzODAzIDExLjUzNTMgNi4wNzcxNyAxMS4zMzEzIDYuNTQ1MTMgMTEuMjk1MUg2LjYxMzI5TDguMDkzMzMgOS44MDUyOEw3LjgyMDcgOS43MTc2NUM3LjE3Mzg2IDkuNTE2NyA2LjQ4NDM2IDkuNDk2NjggNS44MjY5NiA5LjY1OTc0QzUuMTY5NTUgOS44MjI4MSA0LjU2OTMzIDEwLjE2MjcgNC4wOTEzOSAxMC42NDI3TDEuMDgyNjIgMTMuNjcwOUMwLjU2NDgwOCAxNC4xOTAzIDAuMjEyNTU4IDE0Ljg1MTUgMC4wNzAzNzk0IDE1LjU3MUMtMC4wNzE3OTg5IDE2LjI5MDUgMC4wMDI0NzQzOCAxNy4wMzYgMC4yODM4MTYgMTcuNzEzM0MwLjU2NTE1NyAxOC4zOTA2IDEuMDQwOTQgMTguOTY5MyAxLjY1MTA1IDE5LjM3NjNDMi4yNjExNyAxOS43ODMzIDIuOTc4MjMgMjAuMDAwNCAzLjcxMTY0IDIwQzQuMTk4NTkgMjAgNC42ODA3MyAxOS45MDM3IDUuMTMwMjcgMTkuNzE2NUM1LjU3OTgxIDE5LjUyOTQgNS45ODc4NyAxOS4yNTUxIDYuMzMwOTIgMTguOTA5NUw5LjMzOTY4IDE1Ljg4MTJDOS44MTg5NCAxNS40MDA5IDEwLjE1NjkgMTQuNzk4MSAxMC4zMTY2IDE0LjEzODdDMTAuNDc2MyAxMy40NzkyIDEwLjQ1MTYgMTIuNzg4NSAxMC4yNDUyIDEyLjE0MjJMMTAuMTU3NiAxMS45MDg1Wk0xMy41MDcyIDUuMzA2NzRMNS4zOTYxNiAxMy40NTY3TDUuMjY5NTggMTMuNTgzM0w2LjQ0Nzc2IDE0Ljc1MTdMMTQuNTU4OCA2LjYwMTc4TDE0LjY3NTYgNi40NzUyTDEzLjUwNzIgNS4zMDY3NFoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=", L1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAzMCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDguMzY5MjNMMjEuNjYxNSAyLjMwNzY5SDIuMzM4NDZMMTIgOC4zNjkyM1pNMTIgMTAuNzA3N0wyLjMwNzY5IDQuNjE1MzlWMTYuODMwOEgxNC45NzgyTDEyLjc1IDE5LjEzODVIMi4zMDc2OUMxLjY3MzA3IDE5LjEzODUgMCAxOS4xMzg1IDAgMTkuMTM4NUMwIDE5LjEzODUgMCAxNy40NjU0IDAgMTYuODMwOFYyLjMwNzY5QzAgMS42NzMwNyAwIDAgMCAwQzAgMCAxLjY3MzA3IDAgMi4zMDc2OSAwSDIxLjY5MjNDMjIuMzI2OSAwIDI0IDAgMjQgMEMyNCAwIDI0IDEuNjczMDcgMjQgMi4zMDc2OVY3LjgzMDc3TDIxLjY5MjMgMTAuMTM4NVY0LjYxNTM5TDEyIDEwLjcwNzdaIiBmaWxsPSIjMUMxQjFGIi8+CjxwYXRoIGQ9Ik0yOC40NjY5IDkuNjc1MjZDMjguMjA4NiA5LjQxNzA1IDI3LjkwMTcgOS4yMTI0NyAyNy41NjM4IDkuMDczMzNDMjcuMjI1OCA4LjkzNDIgMjYuODYzNiA4Ljg2MzI3IDI2LjQ5OCA4Ljg2NDY0QzI2LjEzMiA4Ljg2NDYzIDI1Ljc2OTYgOC45MzY4OSAyNS40MzE3IDkuMDc3MjdDMjUuMDkzOCA5LjIxNzY1IDI0Ljc4NzEgOS40MjMzNiAyNC41MjkyIDkuNjgyNTZMMjIuMjY3NiAxMS45NTM3QzIxLjkwODEgMTIuMzE0NCAyMS42NTQ1IDEyLjc2NjUgMjEuNTM0NSAxMy4yNjFDMjEuNDE0NSAxMy43NTU0IDIxLjQzMjcgMTQuMjczMiAyMS41ODcgMTQuNzU4TDIxLjY1MjkgMTQuOTYyNUwyMi43NjUzIDEzLjg0NTJWMTMuNzk0QzIyLjc5MDYgMTMuNDQ0IDIyLjk0MTMgMTMuMTE0OCAyMy4xODk4IDEyLjg2NjZMMjUuNDM2OCAxMC42MDI3QzI1LjU3NDIgMTAuNDY0NiAyNS43Mzc2IDEwLjM1NDkgMjUuOTE3NSAxMC4yNzk4QzI2LjA5NzUgMTAuMjA0NyAyNi4yOTA1IDEwLjE2NTcgMjYuNDg1NSAxMC4xNjVDMjYuNjgwNiAxMC4xNjQzIDI2Ljg3MzkgMTAuMjAyIDI3LjA1NDMgMTAuMjc1OEMyNy4yMzQ4IDEwLjM0OTcgMjcuMzk4OSAxMC40NTgzIDI3LjUzNzMgMTAuNTk1NEMyNy42NzU3IDEwLjczMjYgMjcuNzg1NyAxMC44OTU1IDI3Ljg2MSAxMS4wNzUxQzI3LjkzNjMgMTEuMjU0NiAyNy45NzU0IDExLjQ0NzIgMjcuOTc2IDExLjY0MTlDMjcuOTc2NyAxMS44MzY1IDI3LjkzOSAxMi4wMjkzIDI3Ljg2NSAxMi4yMDk0QzI3Ljc5MDkgMTIuMzg5NSAyNy42ODIxIDEyLjU1MzIgMjcuNTQ0NyAxMi42OTEzTDI1LjI4MzEgMTQuOTYyNUMyNS4wMzU0IDE1LjIxMzIgMjQuNzA1MyAxNS4zNjYyIDI0LjM1MzYgMTUuMzkzNEgyNC4zMDIzTDIzLjE4OTggMTYuNTEwN0wyMy4zOTQ4IDE2LjU3NjRDMjMuODgyIDE2LjcyODYgMjQuNDAxNyAxNi43NDQzIDI0Ljg5NzMgMTYuNjIyQzI1LjM5MjkgMTYuNDk5NyAyNS44NDUzIDE2LjI0MzkgMjYuMjA1MyAxNS44ODI2TDI4LjQ2NjkgMTMuNjExNUMyOC45ODg0IDEzLjA4ODcgMjkuMjgxMyAxMi4zODEgMjkuMjgxMyAxMS42NDM0QzI5LjI4MTMgMTAuOTA1NyAyOC45ODg0IDEwLjE5ODEgMjguNDY2OSA5LjY3NTI2Wk0yMS45MTYzIDE3Ljc5NkwyMC44MDM4IDE4LjkxMzNWMTguOTY0NEMyMC43Nzg2IDE5LjMxNDQgMjAuNjI3OSAxOS42NDM3IDIwLjM3OTMgMTkuODkxOUwxOC4xMTc4IDIyLjE1NThDMTcuODM2MyAyMi40MzQ3IDE3LjQ1NTMgMjIuNTkwNiAxNy4wNTg3IDIyLjU4OTJDMTYuNjYyIDIyLjU4NzggMTYuMjgyMSAyMi40MjkzIDE2LjAwMjYgMjIuMTQ4NUMxNS43MjMxIDIxLjg2NzYgMTUuNTY2OCAyMS40ODc1IDE1LjU2ODIgMjEuMDkxN0MxNS41Njk1IDIwLjY5NTkgMTUuNzI4NCAyMC4zMTY5IDE2LjAwOTkgMjAuMDM3OUwxOC4yNzE1IDE3Ljc2NjhDMTguNTE5MSAxNy41MTYxIDE4Ljg0OTIgMTcuMzYzMSAxOS4yMDEgMTcuMzM1OUgxOS4yNTIyTDIwLjM2NDcgMTYuMjE4NkwyMC4xNTk4IDE2LjE1MjlDMTkuNjczNiAxNi4wMDIxIDE5LjE1NTMgMTUuOTg3MSAxOC42NjEyIDE2LjEwOTRDMTguMTY3IDE2LjIzMTcgMTcuNzE1OCAxNi40ODY3IDE3LjM1NjYgMTYuODQ2NkwxNS4wOTUgMTkuMTE3OEMxNC43MDU4IDE5LjUwNzMgMTQuNDQxIDIwLjAwMzIgMTQuMzM0MiAyMC41NDI5QzE0LjIyNzMgMjEuMDgyNSAxNC4yODMxIDIxLjY0MTYgMTQuNDk0NiAyMi4xNDk2QzE0LjcwNjEgMjIuNjU3NiAxNS4wNjM3IDIzLjA5MTYgMTUuNTIyMyAyMy4zOTY5QzE1Ljk4MDkgMjMuNzAyMSAxNi41MTk5IDIzLjg2NDkgMTcuMDcxMiAyMy44NjQ2QzE3LjQzNzIgMjMuODY0NiAxNy43OTk2IDIzLjc5MjQgMTguMTM3NSAyMy42NTJDMTguNDc1NCAyMy41MTE2IDE4Ljc4MjEgMjMuMzA1OSAxOS4wNCAyMy4wNDY3TDIxLjMwMTUgMjAuNzc1NUMyMS42NjE4IDIwLjQxNTMgMjEuOTE1OCAxOS45NjMyIDIyLjAzNTkgMTkuNDY4NkMyMi4xNTU5IDE4Ljk3NCAyMi4xMzczIDE4LjQ1NiAyMS45ODIyIDE3Ljk3MTNMMjEuOTE2MyAxNy43OTZaTTI0LjQzNDEgMTIuODQ0N0wxOC4zMzczIDE4Ljk1NzFMMTguMjQyMiAxOS4wNTIxTDE5LjEyNzggMTkuOTI4NEwyNS4yMjQ1IDEzLjgxNkwyNS4zMTI0IDEzLjcyMUwyNC40MzQxIDEyLjg0NDdaIiBmaWxsPSJibGFjayIvPgo8L3N2Zz4K", F1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxOCAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMuMzc1IDE2Ljg3NVYxNC42MjVIMTEuMzYyNUMxMi41NDM3IDE0LjYyNSAxMy41NzAzIDE0LjI1IDE0LjQ0MjIgMTMuNUMxNS4zMTQxIDEyLjc1IDE1Ljc1IDExLjgxMjUgMTUuNzUgMTAuNjg3NUMxNS43NSA5LjU2MjUgMTUuMzE0MSA4LjYyNSAxNC40NDIyIDcuODc1QzEzLjU3MDMgNy4xMjUgMTIuNTQzNyA2Ljc1IDExLjM2MjUgNi43NUg0LjI3NUw3LjIgOS42NzVMNS42MjUgMTEuMjVMMCA1LjYyNUw1LjYyNSAwTDcuMiAxLjU3NUw0LjI3NSA0LjVIMTEuMzYyNUMxMy4xODEyIDQuNSAxNC43NDIyIDUuMDkwNjIgMTYuMDQ1MyA2LjI3MTg3QzE3LjM0ODQgNy40NTMxMiAxOCA4LjkyNSAxOCAxMC42ODc1QzE4IDEyLjQ1IDE3LjM0ODQgMTMuOTIxOSAxNi4wNDUzIDE1LjEwMzFDMTQuNzQyMiAxNi4yODQ0IDEzLjE4MTIgMTYuODc1IDExLjM2MjUgMTYuODc1SDMuMzc1WiIgZmlsbD0iYmxhY2siLz4KPC9zdmc+Cg==", v1 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTciIHZpZXdCb3g9IjAgMCAxOCAxNyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTYuNjM3NSAxNi44NzVDNC44MTg3NSAxNi44NzUgMy4yNTc4MSAxNi4yODQ0IDEuOTU0NjkgMTUuMTAzMUMwLjY1MTU2MyAxMy45MjE5IDAgMTIuNDUgMCAxMC42ODc1QzAgOC45MjUgMC42NTE1NjMgNy40NTMxMiAxLjk1NDY5IDYuMjcxODdDMy4yNTc4MSA1LjA5MDYyIDQuODE4NzUgNC41IDYuNjM3NSA0LjVIMTMuNzI1TDEwLjggMS41NzVMMTIuMzc1IDBMMTggNS42MjVMMTIuMzc1IDExLjI1TDEwLjggOS42NzVMMTMuNzI1IDYuNzVINi42Mzc1QzUuNDU2MjUgNi43NSA0LjQyOTY5IDcuMTI1IDMuNTU3ODEgNy44NzVDMi42ODU5NCA4LjYyNSAyLjI1IDkuNTYyNSAyLjI1IDEwLjY4NzVDMi4yNSAxMS44MTI1IDIuNjg1OTQgMTIuNzUgMy41NTc4MSAxMy41QzQuNDI5NjkgMTQuMjUgNS40NTYyNSAxNC42MjUgNi42Mzc1IDE0LjYyNUgxNC42MjVWMTYuODc1SDYuNjM3NVoiIGZpbGw9ImJsYWNrIi8+Cjwvc3ZnPgo=";
function Ke(t, e) {
  const n = document.createElement("button");
  n.className = "govuk-button govuk-button--secondary", n.type = "button", n.title = t;
  const r = document.createElement("img");
  return r.src = e, n.appendChild(r), n;
}
function Ar(t, e, n) {
  const r = document.createElement("select");
  return r.className = `govuk-select ${n}`, t.forEach((u, i) => {
    u.dom = document.createElement("option"), u.dom.text = u.text, u.dom.value = i, r.appendChild(u.dom);
  }), r.addEventListener("change", () => {
    t[Number(r.value)].command(
      e.state,
      e.dispatch,
      e
    ), e.focus(), r.selectedIndex = 0;
  }), {
    command: ae(...t.map((u) => u.command)),
    dom: r,
    customHandler: () => {
    },
    update: (u) => {
      t.forEach((i) => {
        i.dom.disabled = !i.command(u.state, null, u);
      });
    }
  };
}
function R1(t) {
  return {
    command: ae(
      F(t.nodes.heading, { level: 2 }),
      F(t.nodes.paragraph)
    ),
    dom: Ke("Heading 2", w1)
  };
}
function B1(t) {
  return [
    {
      text: "H",
      command: () => {
      }
    },
    {
      text: "H3",
      command: ae(
        F(t.nodes.heading, { level: 3 }),
        F(t.nodes.paragraph)
      )
    },
    {
      text: "H4",
      command: ae(
        F(t.nodes.heading, { level: 4 }),
        F(t.nodes.paragraph)
      )
    },
    {
      text: "H5",
      command: ae(
        F(t.nodes.heading, { level: 5 }),
        F(t.nodes.paragraph)
      )
    },
    {
      text: "H6",
      command: ae(
        F(t.nodes.heading, { level: 6 }),
        F(t.nodes.paragraph)
      )
    }
  ];
}
function P1(t) {
  return {
    command: Ot(t.nodes.bullet_list),
    dom: Ke("Bullet list", O1)
  };
}
function U1(t) {
  return {
    command: Ot(t.nodes.ordered_list),
    dom: Ke("Ordered list", _1)
  };
}
function q1(t) {
  return {
    command: Ot(t.nodes.steps),
    dom: Ke("Steps", z1)
  };
}
function V1(t) {
  return {
    command: se(t.marks.link),
    dom: Ke("Link", j1),
    customHandler: (e, n, r) => {
      if (!e.selection.empty && e.selection.ranges.some(
        (o) => e.doc.rangeHasMark(o.$from.pos, o.$to.pos, t.marks.link)
      )) {
        se(t.marks.link)(e, n), r.focus();
        return;
      }
      let i = null;
      if (i = prompt("Enter absolute admin paths or full public URLs"), !!i) {
        if (!e.selection.empty)
          se(t.marks.link, { href: i })(e, n);
        else {
          const o = prompt("Enter the link text");
          n(
            e.tr.addStoredMark(t.marks.link.create({ href: i })).insertText(o)
          );
        }
        r.focus();
      }
    }
  };
}
function Q1(t) {
  return {
    command: (...[e, , n]) => e.selection.empty && se(t.marks.link)(e, null, n),
    dom: Ke("Email link", L1),
    customHandler: (e, n, r) => {
      const u = prompt("Enter the email address");
      u && (n(
        e.tr.addStoredMark(t.marks.link.create({ href: `mailto:${u}` })).insertText(u)
      ), r.focus());
    }
  };
}
function $1(t) {
  return [
    {
      text: "Add text block",
      command: () => {
      }
    },
    {
      text: "Call to action",
      command: Se(t.nodes.call_to_action)
    },
    {
      text: "Information callout",
      command: ae(
        F(t.nodes.information_callout),
        F(t.nodes.paragraph)
      )
    },
    {
      text: "Warning callout",
      command: ae(
        F(t.nodes.warning_callout),
        F(t.nodes.paragraph)
      )
    },
    {
      text: "Example callout",
      command: Se(t.nodes.example_callout)
    },
    {
      text: "Contact",
      command: Se(t.nodes.contact)
    },
    {
      text: "Address",
      command: Se(t.nodes.address)
    },
    {
      text: "Blockquote",
      command: Se(t.nodes.blockquote)
    }
  ];
}
function Y1(t) {
  return [
    {
      text: "Insert",
      command: Se(t.nodes.call_to_action)
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
function W1(t) {
  return {
    command: nn,
    dom: Ke("Undo", F1)
  };
}
function H1(t) {
  return {
    command: St,
    dom: Ke("Redo", v1)
  };
}
function J1(t, e) {
  return [
    R1(t),
    Ar(B1(t), e, "headingSelect"),
    P1(t),
    U1(t),
    q1(t),
    V1(t),
    Q1(t),
    Ar($1(t), e, "textBlockSelect"),
    Ar(Y1(t), e, "insertSelect"),
    W1(),
    H1()
  ];
}
function Z1(t) {
  return new _e({
    view: (e) => new S1(J1(t, e), e)
  });
}
const G1 = (t) => {
  const e = gu.filter((n) => typeof n.inputRules < "u").flatMap((n) => n.inputRules(t));
  return Os({ rules: e });
}, K1 = (t) => {
  t.menuBar = !1;
  const e = I1(t);
  return e.pop(), e.push(
    new _e({
      props: {
        attributes: { class: "govspeak" }
      }
    })
  ), e.push(G1(t.schema)), e.push(Z1(t.schema)), e;
};
class X1 {
  constructor(e, n, r) {
    const u = bt.create({
      doc: Nt.fromSchema(vi).parse(e),
      plugins: K1({ schema: vi })
    });
    window.view = new Oc(n, {
      state: u,
      dispatchTransaction(i) {
        const o = window.view.state.apply(i);
        window.view.updateState(o), r.value = Fi.serialize(window.view.state.doc);
      }
    }), r.value = Fi.serialize(window.view.state.doc);
  }
}
window.GovspeakVisualEditor = X1;
