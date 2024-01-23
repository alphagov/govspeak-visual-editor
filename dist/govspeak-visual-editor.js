function V(n) {
  this.content = n;
}
V.prototype = {
  constructor: V,
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
    return o == -1 ? s.push(t || n, e) : (s[o + 1] = e, t && (s[o] = t)), new V(s);
  },
  // :: (string) → OrderedMap
  // Return a map with the given key removed, if it existed.
  remove: function(n) {
    var e = this.find(n);
    if (e == -1)
      return this;
    var t = this.content.slice();
    return t.splice(e, 2), new V(t);
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the start of the map.
  addToStart: function(n, e) {
    return new V([n, e].concat(this.remove(n).content));
  },
  // :: (string, any) → OrderedMap
  // Add a new key to the end of the map.
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new V(t);
  },
  // :: (string, string, any) → OrderedMap
  // Add a key after the given key. If `place` is not found, the new
  // key is added to the end.
  addBefore: function(n, e, t) {
    var r = this.remove(e), o = r.content.slice(), s = r.find(n);
    return o.splice(s == -1 ? o.length : s, 0, e, t), new V(o);
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
    return n = V.from(n), n.size ? new V(n.content.concat(this.subtract(n).content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a new map by appending the keys in this map that don't
  // appear in `map` after the keys in `map`.
  append: function(n) {
    return n = V.from(n), n.size ? new V(this.subtract(n).content.concat(n.content)) : this;
  },
  // :: (union<Object, OrderedMap>) → OrderedMap
  // Create a map containing all the keys in this map that don't
  // appear in `map`.
  subtract: function(n) {
    var e = this;
    n = V.from(n);
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
V.from = function(n) {
  if (n instanceof V)
    return n;
  var e = [];
  if (n)
    for (var t in n)
      e.push(t, n[t]);
  return new V(e);
};
function ki(n, e, t) {
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
      let i = ki(o.content, s.content, t + 1);
      if (i != null)
        return i;
    }
    t += o.nodeSize;
  }
}
function yi(n, e, t, r) {
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
      let a = yi(i.content, l.content, t - 1, r - 1);
      if (a)
        return a;
    }
    t -= c, r -= c;
  }
}
class k {
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
    return new k(o, this.size + e.size);
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
    return new k(r, o);
  }
  /**
  @internal
  */
  cutByIndex(e, t) {
    return e == t ? k.empty : e == 0 && t == this.content.length ? this : new k(this.content.slice(e, t));
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
    return o[e] = t, new k(o, s);
  }
  /**
  Create a new fragment by prepending the given node to this
  fragment.
  */
  addToStart(e) {
    return new k([e].concat(this.content), this.size + e.nodeSize);
  }
  /**
  Create a new fragment by appending the given node to this
  fragment.
  */
  addToEnd(e) {
    return new k(this.content.concat(e), this.size + e.nodeSize);
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
    return ki(this, e, t);
  }
  /**
  Find the first position, searching from the end, at which this
  fragment and the given fragment differ, or `null` if they are
  the same. Since this position will not be the same in both
  nodes, an object with two separate positions is returned.
  */
  findDiffEnd(e, t = this.size, r = e.size) {
    return yi(this, e, t, r);
  }
  /**
  Find the index and inner offset corresponding to a given relative
  position in this fragment. The result object will be reused
  (overwritten) the next time the function is called. (Not public.)
  */
  findIndex(e, t = -1) {
    if (e == 0)
      return tn(0, e);
    if (e == this.size)
      return tn(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, o = 0; ; r++) {
      let s = this.child(r), i = o + s.nodeSize;
      if (i >= e)
        return i == e || t > 0 ? tn(r + 1, i) : tn(r, o);
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
      return k.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new k(t.map(e.nodeFromJSON));
  }
  /**
  Build a fragment from an array of nodes. Ensures that adjacent
  text nodes with the same marks are joined together.
  */
  static fromArray(e) {
    if (!e.length)
      return k.empty;
    let t, r = 0;
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      r += s.nodeSize, o && s.isText && e[o - 1].sameMarkup(s) ? (t || (t = e.slice(0, o)), t[t.length - 1] = s.withText(t[t.length - 1].text + s.text)) : t && t.push(s);
    }
    return new k(t || e, r);
  }
  /**
  Create a fragment from something that can be interpreted as a
  set of nodes. For `null`, it returns the empty fragment. For a
  fragment, the fragment itself. For a node or array of nodes, a
  fragment containing those nodes.
  */
  static from(e) {
    if (!e)
      return k.empty;
    if (e instanceof k)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new k([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
k.empty = new k([], 0);
const Wn = { index: 0, offset: 0 };
function tn(n, e) {
  return Wn.index = n, Wn.offset = e, Wn;
}
function dn(n, e) {
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
      if (!dn(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !dn(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
class O {
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
    return this == e || this.type == e.type && dn(this.attrs, e.attrs);
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
      return O.none;
    if (e instanceof O)
      return [e];
    let t = e.slice();
    return t.sort((r, o) => r.type.rank - o.type.rank), t;
  }
}
O.none = [];
class mn extends Error {
}
class C {
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
    return r && new C(r, this.openStart, this.openEnd);
  }
  /**
  @internal
  */
  removeBetween(e, t) {
    return new C(xi(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
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
      return C.empty;
    let r = t.openStart || 0, o = t.openEnd || 0;
    if (typeof r != "number" || typeof o != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new C(k.fromJSON(e, t.content), r, o);
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
    return new C(e, r, o);
  }
}
C.empty = new C(k.empty, 0, 0);
function xi(n, e, t) {
  let { index: r, offset: o } = n.findIndex(e), s = n.maybeChild(r), { index: i, offset: l } = n.findIndex(t);
  if (o == e || s.isText) {
    if (l != t && !n.child(i).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != i)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, s.copy(xi(s.content, e - o - 1, t - o - 1)));
}
function wi(n, e, t, r) {
  let { index: o, offset: s } = n.findIndex(e), i = n.maybeChild(o);
  if (s == e || i.isText)
    return r && !r.canReplace(o, o, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let l = wi(i.content, e - s - 1, t);
  return l && n.replaceChild(o, i.copy(l));
}
function dc(n, e, t) {
  if (t.openStart > n.depth)
    throw new mn("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new mn("Inconsistent open depths");
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
      return Ye(i, l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: i, end: l } = mc(t, n);
      return Ye(s, Si(n, i, l, e, r));
    }
  else
    return Ye(s, gn(n, e, r));
}
function vi(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new mn("Cannot join " + e.type.name + " onto " + n.type.name);
}
function Er(n, e, t) {
  let r = n.node(t);
  return vi(r, e.node(t)), r;
}
function Ze(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Ot(n, e, t, r) {
  let o = (e || n).node(t), s = 0, i = e ? e.index(t) : o.childCount;
  n && (s = n.index(t), n.depth > t ? s++ : n.textOffset && (Ze(n.nodeAfter, r), s++));
  for (let l = s; l < i; l++)
    Ze(o.child(l), r);
  e && e.depth == t && e.textOffset && Ze(e.nodeBefore, r);
}
function Ye(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function Si(n, e, t, r, o) {
  let s = n.depth > o && Er(n, e, o + 1), i = r.depth > o && Er(t, r, o + 1), l = [];
  return Ot(null, n, o, l), s && i && e.index(o) == t.index(o) ? (vi(s, i), Ze(Ye(s, Si(n, e, t, r, o + 1)), l)) : (s && Ze(Ye(s, gn(n, e, o + 1)), l), Ot(e, t, o, l), i && Ze(Ye(i, gn(t, r, o + 1)), l)), Ot(r, null, o, l), new k(l);
}
function gn(n, e, t) {
  let r = [];
  if (Ot(null, n, t, r), n.depth > t) {
    let o = Er(n, e, t + 1);
    Ze(Ye(o, gn(n, e, t + 1)), r);
  }
  return Ot(e, null, t, r), new k(r);
}
function mc(n, e) {
  let t = e.depth - n.openStart, o = e.node(t).copy(n.content);
  for (let s = t - 1; s >= 0; s--)
    o = e.node(s).copy(k.from(o));
  return {
    start: o.resolveNoCache(n.openStart + t),
    end: o.resolveNoCache(o.content.size - n.openEnd - t)
  };
}
class Pt {
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
      return O.none;
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
        return new bn(this, e, r);
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
    return new Pt(t, r, s);
  }
  /**
  @internal
  */
  static resolveCached(e, t) {
    for (let o = 0; o < Jn.length; o++) {
      let s = Jn[o];
      if (s.pos == t && s.doc == e)
        return s;
    }
    let r = Jn[Gn] = Pt.resolve(e, t);
    return Gn = (Gn + 1) % gc, r;
  }
}
let Jn = [], Gn = 0, gc = 12;
class bn {
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
const bc = /* @__PURE__ */ Object.create(null);
let Qe = class Ar {
  /**
  @internal
  */
  constructor(e, t, r, o = O.none) {
    this.type = e, this.attrs = t, this.marks = o, this.content = r || k.empty;
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
    return this.type == e && dn(this.attrs, t || e.defaultAttrs || bc) && O.sameSet(this.marks, r || O.none);
  }
  /**
  Create a new node with the same markup as this node, containing
  the given content (or empty, if no content is given).
  */
  copy(e = null) {
    return e == this.content ? this : new Ar(this.type, this.attrs, e, this.marks);
  }
  /**
  Create a copy of this node, with the given set of marks instead
  of the node's own marks.
  */
  mark(e) {
    return e == this.marks ? this : new Ar(this.type, this.attrs, this.content, e);
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
      return C.empty;
    let o = this.resolve(e), s = this.resolve(t), i = r ? 0 : o.sharedDepth(t), l = o.start(i), a = o.node(i).content.cut(o.pos - l, s.pos - l);
    return new C(a, o.depth - i, s.depth - i);
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
    return dc(this.resolve(e), this.resolve(t), r);
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
    return Pt.resolveCached(this, e);
  }
  /**
  @internal
  */
  resolveNoCache(e) {
    return Pt.resolve(this, e);
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
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), _i(this.marks, e);
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
  canReplace(e, t, r = k.empty, o = 0, s = r.childCount) {
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
    let e = O.none;
    for (let t = 0; t < this.marks.length; t++)
      e = this.marks[t].addToSet(e);
    if (!O.sameSet(e, this.marks))
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
    let o = k.fromJSON(e, t.content);
    return e.nodeType(t.type).create(t.attrs, o, r);
  }
};
Qe.prototype.text = void 0;
class kn extends Qe {
  /**
  @internal
  */
  constructor(e, t, r, o) {
    if (super(e, t, null, o), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : _i(this.marks, JSON.stringify(this.text));
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
    return e == this.marks ? this : new kn(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new kn(this.type, this.attrs, e, this.marks);
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
function _i(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class tt {
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
    let r = new kc(e, t);
    if (r.next == null)
      return tt.empty;
    let o = Di(r);
    r.next && r.err("Unexpected trailing text");
    let s = _c(Sc(o));
    return Dc(s, r), s;
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
        return k.from(l.map((a) => a.createAndFill()));
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
tt.empty = new tt(!0);
class kc {
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
function Di(n) {
  let e = [];
  do
    e.push(yc(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function yc(n) {
  let e = [];
  do
    e.push(xc(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function xc(n) {
  let e = vc(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = wc(n, e);
    else
      break;
  return e;
}
function Ao(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function wc(n, e) {
  let t = Ao(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Ao(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function Cc(n, e) {
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
function vc(n) {
  if (n.eat("(")) {
    let e = Di(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = Cc(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Sc(n) {
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
function Ei(n, e) {
  return e - n;
}
function Mo(n, e) {
  let t = [];
  return r(e), t.sort(Ei);
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
function _c(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Mo(n, 0));
  function t(r) {
    let o = [];
    r.forEach((i) => {
      n[i].forEach(({ term: l, to: c }) => {
        if (!l)
          return;
        let a;
        for (let u = 0; u < o.length; u++)
          o[u][0] == l && (a = o[u][1]);
        Mo(n, c).forEach((u) => {
          a || o.push([l, a = []]), a.indexOf(u) == -1 && a.push(u);
        });
      });
    });
    let s = e[r.join(",")] = new tt(r.indexOf(n.length - 1) > -1);
    for (let i = 0; i < o.length; i++) {
      let l = o[i][1].sort(Ei);
      s.next.push({ type: o[i][0], next: e[l.join(",")] || t(l) });
    }
    return s;
  }
}
function Dc(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let o = r[t], s = !o.validEnd, i = [];
    for (let l = 0; l < o.next.length; l++) {
      let { type: c, next: a } = o.next[l];
      i.push(c.name), s && !(c.isText || c.hasRequiredAttrs()) && (s = !1), r.indexOf(a) == -1 && r.push(a);
    }
    s && e.err("Only non-generatable nodes (" + i.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function Ai(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function Mi(n, e) {
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
function Ti(n) {
  let e = /* @__PURE__ */ Object.create(null);
  if (n)
    for (let t in n)
      e[t] = new Ec(n[t]);
  return e;
}
let To = class Oi {
  /**
  @internal
  */
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = Ti(r.attrs), this.defaultAttrs = Ai(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
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
    return this.contentMatch == tt.empty;
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
    return !e && this.defaultAttrs ? this.defaultAttrs : Mi(this.attrs, e);
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
    return new Qe(this, this.computeAttrs(e), k.from(t), O.setFrom(r));
  }
  /**
  Like [`create`](https://prosemirror.net/docs/ref/#model.NodeType.create), but check the given content
  against the node type's content restrictions, and throw an error
  if it doesn't match.
  */
  createChecked(e = null, t, r) {
    return t = k.from(t), this.checkContent(t), new Qe(this, this.computeAttrs(e), t, O.setFrom(r));
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
    if (e = this.computeAttrs(e), t = k.from(t), t.size) {
      let i = this.contentMatch.fillBefore(t);
      if (!i)
        return null;
      t = i.append(t);
    }
    let o = this.contentMatch.matchFragment(t), s = o && o.fillBefore(k.empty, !0);
    return s ? new Qe(this, e, t.append(s), O.setFrom(r)) : null;
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
    return t ? t.length ? t : O.none : e;
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((s, i) => r[s] = new Oi(s, t, i));
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
class Ec {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Tn {
  /**
  @internal
  */
  constructor(e, t, r, o) {
    this.name = e, this.rank = t, this.schema = r, this.spec = o, this.attrs = Ti(o.attrs), this.excluded = null;
    let s = Ai(this.attrs);
    this.instance = s ? new O(this, s) : null;
  }
  /**
  Create a mark of this type. `attrs` may be `null` or an object
  containing only some of the mark's attributes. The others, if
  they have defaults, will be added.
  */
  create(e = null) {
    return !e && this.instance ? this.instance : new O(this, Mi(this.attrs, e));
  }
  /**
  @internal
  */
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), o = 0;
    return e.forEach((s, i) => r[s] = new Tn(s, o++, t, i)), r;
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
class Ni {
  /**
  Construct a schema from a schema [specification](https://prosemirror.net/docs/ref/#model.SchemaSpec).
  */
  constructor(e) {
    this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let o in e)
      t[o] = e[o];
    t.nodes = V.from(e.nodes), t.marks = V.from(e.marks || {}), this.nodes = To.compile(this.spec.nodes, this), this.marks = Tn.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let o in this.nodes) {
      if (o in this.marks)
        throw new RangeError(o + " can not be both a node and a mark");
      let s = this.nodes[o], i = s.spec.content || "", l = s.spec.marks;
      s.contentMatch = r[i] || (r[i] = tt.parse(i, this.nodes)), s.inlineContent = s.contentMatch.inlineContent, s.markSet = l == "_" ? null : l ? Oo(this, l.split(" ")) : l == "" || !s.inlineContent ? [] : null;
    }
    for (let o in this.marks) {
      let s = this.marks[o], i = s.spec.excludes;
      s.excluded = i == null ? [s] : i == "" ? [] : Oo(this, i.split(" "));
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
    else if (e instanceof To) {
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
    return new kn(r, r.defaultAttrs, e, O.setFrom(t));
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
    return Qe.fromJSON(this, e);
  }
  /**
  Deserialize a mark from its JSON representation. This method is
  bound.
  */
  markFromJSON(e) {
    return O.fromJSON(this, e);
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
function Oo(n, e) {
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
class gt {
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
    let r = new qo(this, t, !1);
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
    let r = new qo(this, t, !0);
    return r.addAll(e, t.from, t.to), C.maxOpen(r.finish());
  }
  /**
  @internal
  */
  matchTag(e, t, r) {
    for (let o = r ? this.tags.indexOf(r) + 1 : 0; o < this.tags.length; o++) {
      let s = this.tags[o];
      if (Tc(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || t.matchesContext(s.context))) {
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
        r(i = Ro(i)), i.mark || i.ignore || i.clearMark || (i.mark = o);
      });
    }
    for (let o in e.nodes) {
      let s = e.nodes[o].spec.parseDOM;
      s && s.forEach((i) => {
        r(i = Ro(i)), i.node || i.ignore || i.mark || (i.node = o);
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
    return e.cached.domParser || (e.cached.domParser = new gt(e, gt.schemaRules(e)));
  }
}
const qi = {
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
}, Ac = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Ri = { ol: !0, ul: !0 }, yn = 1, xn = 2, Nt = 4;
function No(n, e, t) {
  return e != null ? (e ? yn : 0) | (e === "full" ? xn : 0) : n && n.whitespace == "pre" ? yn | xn : t & ~Nt;
}
class nn {
  constructor(e, t, r, o, s, i, l) {
    this.type = e, this.attrs = t, this.marks = r, this.pendingMarks = o, this.solid = s, this.options = l, this.content = [], this.activeMarks = O.none, this.stashMarks = [], this.match = i || (l & Nt ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(k.from(e));
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
    if (!(this.options & yn)) {
      let r = this.content[this.content.length - 1], o;
      if (r && r.isText && (o = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let s = r;
        r.text.length == o[0].length ? this.content.pop() : this.content[this.content.length - 1] = s.withText(s.text.slice(0, s.text.length - o[0].length));
      }
    }
    let t = k.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(k.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  popFromStashMark(e) {
    for (let t = this.stashMarks.length - 1; t >= 0; t--)
      if (e.eq(this.stashMarks[t]))
        return this.stashMarks.splice(t, 1)[0];
  }
  applyPending(e) {
    for (let t = 0, r = this.pendingMarks; t < r.length; t++) {
      let o = r[t];
      (this.type ? this.type.allowsMarkType(o.type) : Nc(o.type, e)) && !o.isInSet(this.activeMarks) && (this.activeMarks = o.addToSet(this.activeMarks), this.pendingMarks = o.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !qi.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class qo {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0;
    let o = t.topNode, s, i = No(null, t.preserveWhitespace, 0) | (r ? Nt : 0);
    o ? s = new nn(o.type, o.attrs, O.none, O.none, !0, t.topMatch || o.type.contentMatch, i) : r ? s = new nn(null, null, O.none, O.none, !0, null, i) : s = new nn(e.schema.topNodeType, null, O.none, O.none, !0, null, i), this.nodes = [s], this.find = t.findPositions, this.needsBlock = !1;
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
    let o = this.readStyles(Oc(r));
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
    if (r.options & xn || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
      if (r.options & yn)
        r.options & xn ? t = t.replace(/\r\n?/g, `
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
    Ri.hasOwnProperty(r) && this.parser.normalizeLists && Mc(e);
    let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (o = this.parser.matchTag(e, this, t));
    if (s ? s.ignore : Ac.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!s || s.skip || s.closeParent) {
      s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
      let i, l = this.top, c = this.needsBlock;
      if (qi.hasOwnProperty(r))
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
    let t = O.none, r = O.none;
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
    let i = No(e, o, s.options);
    s.options & Nt && s.content.length == 0 && (i |= Nt), this.nodes.push(new nn(e, t, s.activeMarks, s.pendingMarks, r, null, i)), this.open++;
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
    let t = qc(e, this.top.pendingMarks);
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
function Mc(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Ri.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function Tc(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function Oc(n) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g, t, r = [];
  for (; t = e.exec(n); )
    r.push(t[1], t[2].trim());
  return r;
}
function Ro(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function Nc(n, e) {
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
function qc(n, e) {
  for (let t = 0; t < e.length; t++)
    if (n.eq(e[t]))
      return e[t];
}
class _e {
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
    r || (r = Kn(t).createDocumentFragment());
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
    let { dom: r, contentDOM: o } = _e.renderSpec(Kn(t), this.nodes[e.type.name](e));
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
    return o && _e.renderSpec(Kn(r), o(e, t));
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
        let { dom: h, contentDOM: p } = _e.renderSpec(e, f, r);
        if (l.appendChild(h), p) {
          if (i)
            throw new RangeError("Multiple content holes");
          i = p;
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
    return e.cached.domSerializer || (e.cached.domSerializer = new _e(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  /**
  Gather the serializers in a schema's node specs into an object.
  This can be useful as a base to build a custom serializer from.
  */
  static nodesFromSchema(e) {
    let t = Io(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  /**
  Gather the serializers in a schema's mark specs into an object.
  */
  static marksFromSchema(e) {
    return Io(e.marks);
  }
}
function Io(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function Kn(n) {
  return n.document || window.document;
}
const Ii = 65535, Fi = Math.pow(2, 16);
function Rc(n, e) {
  return n + e * Fi;
}
function Fo(n) {
  return n & Ii;
}
function Ic(n) {
  return (n - (n & Ii)) / Fi;
}
const zi = 1, Li = 2, fn = 4, Bi = 8;
class Mr {
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
    return (this.delInfo & Bi) > 0;
  }
  /**
  Tells you whether the token before the mapped position was deleted.
  */
  get deletedBefore() {
    return (this.delInfo & (zi | fn)) > 0;
  }
  /**
  True when the token after the mapped position was deleted.
  */
  get deletedAfter() {
    return (this.delInfo & (Li | fn)) > 0;
  }
  /**
  Tells whether any of the steps mapped through deletes across the
  position (including both the token before and after the
  position).
  */
  get deletedAcross() {
    return (this.delInfo & fn) > 0;
  }
}
class te {
  /**
  Create a position map. The modifications to the document are
  represented as an array of numbers, in which each group of three
  represents a modified chunk as `[start, oldSize, newSize]`.
  */
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && te.empty)
      return te.empty;
  }
  /**
  @internal
  */
  recover(e) {
    let t = 0, r = Fo(e);
    if (!this.inverted)
      for (let o = 0; o < r; o++)
        t += this.ranges[o * 3 + 2] - this.ranges[o * 3 + 1];
    return this.ranges[r * 3] + t + Ic(e);
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
        let h = a ? e == c ? -1 : e == f ? 1 : t : t, p = c + o + (h < 0 ? 0 : u);
        if (r)
          return p;
        let d = e == (t < 0 ? c : f) ? null : Rc(l / 3, e - c), m = e == c ? Li : e == f ? zi : fn;
        return (t < 0 ? e != c : e != f) && (m |= Bi), new Mr(p, m, d);
      }
      o += u - a;
    }
    return r ? e + o : new Mr(e + o, 0, null);
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
class ht {
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
    return new ht(this.maps, this.mirror, e, t);
  }
  /**
  @internal
  */
  copy() {
    return new ht(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
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
    let e = new ht();
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
    return r ? e : new Mr(e, o, null);
  }
}
const Zn = /* @__PURE__ */ Object.create(null);
class J {
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
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = Zn[t.stepType];
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
    if (e in Zn)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return Zn[e] = t, t.prototype.jsonID = e, t;
  }
}
class L {
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
    return new L(e, null);
  }
  /**
  Create a failed step result.
  */
  static fail(e) {
    return new L(null, e);
  }
  /**
  Call [`Node.replace`](https://prosemirror.net/docs/ref/#model.Node.replace) with the given
  arguments. Create a successful result if it succeeds, and a
  failed one if it throws a `ReplaceError`.
  */
  static fromReplace(e, t, r, o) {
    try {
      return L.ok(e.replace(t, r, o));
    } catch (s) {
      if (s instanceof mn)
        return L.fail(s.message);
      throw s;
    }
  }
}
function Yr(n, e, t) {
  let r = [];
  for (let o = 0; o < n.childCount; o++) {
    let s = n.child(o);
    s.content.size && (s = s.copy(Yr(s.content, e, s))), s.isInline && (s = e(s, t, o)), r.push(s);
  }
  return k.fromArray(r);
}
class Re extends J {
  /**
  Create a mark step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), o = r.node(r.sharedDepth(this.to)), s = new C(Yr(t.content, (i, l) => !i.isAtom || !l.type.allowsMarkType(this.mark.type) ? i : i.mark(this.mark.addToSet(i.marks)), o), t.openStart, t.openEnd);
    return L.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new be(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Re(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Re && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Re(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new Re(t.from, t.to, e.markFromJSON(t.mark));
  }
}
J.jsonID("addMark", Re);
class be extends J {
  /**
  Create a mark-removing step.
  */
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new C(Yr(t.content, (o) => o.mark(this.mark.removeFromSet(o.marks)), e), t.openStart, t.openEnd);
    return L.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new Re(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new be(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof be && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new be(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
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
    return new be(t.from, t.to, e.markFromJSON(t.mark));
  }
}
J.jsonID("removeMark", be);
class Ie extends J {
  /**
  Create a node mark step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return L.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return L.fromReplace(e, this.pos, this.pos + 1, new C(k.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let o = 0; o < t.marks.length; o++)
          if (!t.marks[o].isInSet(r))
            return new Ie(this.pos, t.marks[o]);
        return new Ie(this.pos, this.mark);
      }
    }
    return new bt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Ie(t.pos, this.mark);
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
    return new Ie(t.pos, e.markFromJSON(t.mark));
  }
}
J.jsonID("addNodeMark", Ie);
class bt extends J {
  /**
  Create a mark-removing step.
  */
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return L.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return L.fromReplace(e, this.pos, this.pos + 1, new C(k.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new Ie(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new bt(t.pos, this.mark);
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
    return new bt(t.pos, e.markFromJSON(t.mark));
  }
}
J.jsonID("removeNodeMark", bt);
class j extends J {
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
    return this.structure && Tr(e, this.from, this.to) ? L.fail("Structure replace would overwrite content") : L.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new te([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new j(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new j(t.pos, Math.max(t.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof j) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? C.empty : new C(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new j(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? C.empty : new C(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new j(e.from, this.to, t, this.structure);
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
    return new j(t.from, t.to, C.fromJSON(e, t.slice), !!t.structure);
  }
}
J.jsonID("replace", j);
class U extends J {
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
    if (this.structure && (Tr(e, this.from, this.gapFrom) || Tr(e, this.gapTo, this.to)))
      return L.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return L.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? L.fromReplace(e, this.from, this.to, r) : L.fail("Content does not fit in gap");
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
    let t = this.gapTo - this.gapFrom;
    return new U(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), o = e.map(this.gapFrom, -1), s = e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || o < t.pos || s > r.pos ? null : new U(t.pos, r.pos, o, s, this.slice, this.insert, this.structure);
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
    return new U(t.from, t.to, t.gapFrom, t.gapTo, C.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
J.jsonID("replaceAround", U);
function Tr(n, e, t) {
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
function Fc(n, e, t, r) {
  let o = [], s = [], i, l;
  n.doc.nodesBetween(e, t, (c, a, u) => {
    if (!c.isInline)
      return;
    let f = c.marks;
    if (!r.isInSet(f) && u.type.allowsMarkType(r.type)) {
      let h = Math.max(a, e), p = Math.min(a + c.nodeSize, t), d = r.addToSet(f);
      for (let m = 0; m < f.length; m++)
        f[m].isInSet(d) || (i && i.to == h && i.mark.eq(f[m]) ? i.to = p : o.push(i = new be(h, p, f[m])));
      l && l.to == h ? l.to = p : s.push(l = new Re(h, p, r));
    }
  }), o.forEach((c) => n.step(c)), s.forEach((c) => n.step(c));
}
function zc(n, e, t, r) {
  let o = [], s = 0;
  n.doc.nodesBetween(e, t, (i, l) => {
    if (!i.isInline)
      return;
    s++;
    let c = null;
    if (r instanceof Tn) {
      let a = i.marks, u;
      for (; u = r.isInSet(a); )
        (c || (c = [])).push(u), a = u.removeFromSet(a);
    } else
      r ? r.isInSet(i.marks) && (c = [r]) : c = i.marks;
    if (c && c.length) {
      let a = Math.min(l + i.nodeSize, t);
      for (let u = 0; u < c.length; u++) {
        let f = c[u], h;
        for (let p = 0; p < o.length; p++) {
          let d = o[p];
          d.step == s - 1 && f.eq(o[p].style) && (h = d);
        }
        h ? (h.to = a, h.step = s) : o.push({ style: f, from: Math.max(l, e), to: a, step: s });
      }
    }
  }), o.forEach((i) => n.step(new be(i.from, i.to, i.style)));
}
function Lc(n, e, t, r = t.contentMatch) {
  let o = n.doc.nodeAt(e), s = [], i = e + 1;
  for (let l = 0; l < o.childCount; l++) {
    let c = o.child(l), a = i + c.nodeSize, u = r.matchType(c.type);
    if (!u)
      s.push(new j(i, a, C.empty));
    else {
      r = u;
      for (let f = 0; f < c.marks.length; f++)
        t.allowsMarkType(c.marks[f].type) || n.step(new be(i, a, c.marks[f]));
      if (c.isText && !t.spec.code) {
        let f, h = /\r?\n|\r/g, p;
        for (; f = h.exec(c.text); )
          p || (p = new C(k.from(t.schema.text(" ", t.allowedMarks(c.marks))), 0, 0)), s.push(new j(i + f.index, i + f.index + f[0].length, p));
      }
    }
    i = a;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(k.empty, !0);
    n.replace(i, i, new C(l, 0, 0));
  }
  for (let l = s.length - 1; l >= 0; l--)
    n.step(s[l]);
}
function Bc(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function Kt(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth; ; --r) {
    let o = n.$from.node(r), s = n.$from.index(r), i = n.$to.indexAfter(r);
    if (r < n.depth && o.canReplace(s, i, t))
      return r;
    if (r == 0 || o.type.spec.isolating || !Bc(o, s, i))
      break;
  }
  return null;
}
function Pc(n, e, t) {
  let { $from: r, $to: o, depth: s } = e, i = r.before(s + 1), l = o.after(s + 1), c = i, a = l, u = k.empty, f = 0;
  for (let d = s, m = !1; d > t; d--)
    m || r.index(d) > 0 ? (m = !0, u = k.from(r.node(d).copy(u)), f++) : c--;
  let h = k.empty, p = 0;
  for (let d = s, m = !1; d > t; d--)
    m || o.after(d + 1) < o.end(d) ? (m = !0, h = k.from(o.node(d).copy(h)), p++) : a++;
  n.step(new U(c, a, i, l, new C(u.append(h), f, p), u.size - f, !0));
}
function Qr(n, e, t = null, r = n) {
  let o = Vc(n, e), s = o && $c(r, e);
  return s ? o.map(zo).concat({ type: e, attrs: t }).concat(s.map(zo)) : null;
}
function zo(n) {
  return { type: n, attrs: null };
}
function Vc(n, e) {
  let { parent: t, startIndex: r, endIndex: o } = n, s = t.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let i = s.length ? s[0] : e;
  return t.canReplaceWith(r, o, i) ? s : null;
}
function $c(n, e) {
  let { parent: t, startIndex: r, endIndex: o } = n, s = t.child(r), i = e.contentMatch.findWrapping(s.type);
  if (!i)
    return null;
  let c = (i.length ? i[i.length - 1] : e).contentMatch;
  for (let a = r; c && a < o; a++)
    c = c.matchType(t.child(a).type);
  return !c || !c.validEnd ? null : i;
}
function Uc(n, e, t) {
  let r = k.empty;
  for (let i = t.length - 1; i >= 0; i--) {
    if (r.size) {
      let l = t[i].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = k.from(t[i].type.create(t[i].attrs, r));
  }
  let o = e.start, s = e.end;
  n.step(new U(o, s, o, s, new C(r, 0, 0), t.length, !0));
}
function Hc(n, e, t, r, o) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = n.steps.length;
  n.doc.nodesBetween(e, t, (i, l) => {
    if (i.isTextblock && !i.hasMarkup(r, o) && jc(n.doc, n.mapping.slice(s).map(l), r)) {
      n.clearIncompatible(n.mapping.slice(s).map(l, 1), r);
      let c = n.mapping.slice(s), a = c.map(l, 1), u = c.map(l + i.nodeSize, 1);
      return n.step(new U(a, u, a + 1, u - 1, new C(k.from(r.create(o, null, i.marks)), 0, 0), 1, !0)), !1;
    }
  });
}
function jc(n, e, t) {
  let r = n.resolve(e), o = r.index();
  return r.parent.canReplaceWith(o, o + 1, t);
}
function Wc(n, e, t, r, o) {
  let s = n.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  t || (t = s.type);
  let i = t.create(r, null, o || s.marks);
  if (s.isLeaf)
    return n.replaceWith(e, e + s.nodeSize, i);
  if (!t.validContent(s.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new U(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new C(k.from(i), 0, 0), 1, !0));
}
function pt(n, e, t = 1, r) {
  let o = n.resolve(e), s = o.depth - t, i = r && r[r.length - 1] || o.parent;
  if (s < 0 || o.parent.type.spec.isolating || !o.parent.canReplace(o.index(), o.parent.childCount) || !i.type.validContent(o.parent.content.cutByIndex(o.index(), o.parent.childCount)))
    return !1;
  for (let a = o.depth - 1, u = t - 2; a > s; a--, u--) {
    let f = o.node(a), h = o.index(a);
    if (f.type.spec.isolating)
      return !1;
    let p = f.content.cutByIndex(h, f.childCount), d = r && r[u + 1];
    d && (p = p.replaceChild(0, d.type.create(d.attrs)));
    let m = r && r[u] || f;
    if (!f.canReplace(h + 1, f.childCount) || !m.type.validContent(p))
      return !1;
  }
  let l = o.indexAfter(s), c = r && r[0];
  return o.node(s).canReplaceWith(l, l, c ? c.type : o.node(s + 1).type);
}
function Jc(n, e, t = 1, r) {
  let o = n.doc.resolve(e), s = k.empty, i = k.empty;
  for (let l = o.depth, c = o.depth - t, a = t - 1; l > c; l--, a--) {
    s = k.from(o.node(l).copy(s));
    let u = r && r[a];
    i = k.from(u ? u.type.create(u.attrs, i) : o.node(l).copy(i));
  }
  n.step(new j(e, e, new C(s.append(i), t, t), !0));
}
function wt(n, e) {
  let t = n.resolve(e), r = t.index();
  return Pi(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function Pi(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function Vi(n, e, t = -1) {
  let r = n.resolve(e);
  for (let o = r.depth; ; o--) {
    let s, i, l = r.index(o);
    if (o == r.depth ? (s = r.nodeBefore, i = r.nodeAfter) : t > 0 ? (s = r.node(o + 1), l++, i = r.node(o).maybeChild(l)) : (s = r.node(o).maybeChild(l - 1), i = r.node(o + 1)), s && !s.isTextblock && Pi(s, i) && r.node(o).canReplace(l, l + 1))
      return e;
    if (o == 0)
      break;
    e = t < 0 ? r.before(o) : r.after(o);
  }
}
function Gc(n, e, t) {
  let r = new j(e - t, e + t, C.empty, !0);
  n.step(r);
}
function Kc(n, e, t) {
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
function $i(n, e, t) {
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
function Xr(n, e, t = e, r = C.empty) {
  if (e == t && !r.size)
    return null;
  let o = n.resolve(e), s = n.resolve(t);
  return Ui(o, s, r) ? new j(e, t, r) : new Zc(o, s, r).fit();
}
function Ui(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class Zc {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = k.empty;
    for (let o = 0; o <= e.depth; o++) {
      let s = e.node(o);
      this.frontier.push({
        type: s.type,
        match: s.contentMatchAt(e.indexAfter(o))
      });
    }
    for (let o = e.depth; o > 0; o--)
      this.placed = k.from(e.node(o).copy(this.placed));
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
    let c = new C(s, i, l);
    return e > -1 ? new U(r.pos, e, this.$to.pos, this.$to.end(), c, t) : c.size || r.pos != this.$to.pos ? new j(r.pos, o.pos, c) : null;
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
        r ? (s = Yn(this.unplaced.content, r - 1).firstChild, o = s.content) : o = this.unplaced.content;
        let i = o.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: c, match: a } = this.frontier[l], u, f = null;
          if (t == 1 && (i ? a.matchType(i.type) || (f = a.fillBefore(k.from(i), !1)) : s && c.compatibleContent(s.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, inject: f };
          if (t == 2 && i && (u = a.findWrapping(i.type)))
            return { sliceDepth: r, frontierDepth: l, parent: s, wrap: u };
          if (s && a.matchType(s.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, o = Yn(e, t);
    return !o.childCount || o.firstChild.isLeaf ? !1 : (this.unplaced = new C(e, t + 1, Math.max(r, o.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, o = Yn(e, t);
    if (o.childCount <= 1 && t > 0) {
      let s = e.size - t <= t + o.size;
      this.unplaced = new C(At(e, t - 1, 1), t - 1, s ? t - 1 : r);
    } else
      this.unplaced = new C(At(e, t, 1), t, r);
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
    let p = l.size + e - (i.content.size - i.openEnd);
    for (; a < l.childCount; ) {
      let m = l.child(a), g = f.matchType(m.type);
      if (!g)
        break;
      a++, (a > 1 || c == 0 || m.content.size) && (f = g, u.push(Hi(m.mark(h.allowedMarks(m.marks)), a == 1 ? c : 0, a == l.childCount ? p : -1)));
    }
    let d = a == l.childCount;
    d || (p = -1), this.placed = Mt(this.placed, t, k.from(u)), this.frontier[t].match = f, d && p < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, g = l; m < p; m++) {
      let b = g.lastChild;
      this.frontier.push({ type: b.type, match: b.contentMatchAt(b.childCount) }), g = b.content;
    }
    this.unplaced = d ? e == 0 ? C.empty : new C(At(i.content, e - 1, 1), e - 1, p < 0 ? i.openEnd : e - 1) : new C(At(i.content, e, a), i.openStart, i.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !Qn(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, o = this.$to.after(r);
    for (; r > 1 && o == this.$to.end(--r); )
      ++o;
    return o;
  }
  findCloseLevel(e) {
    e:
      for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
        let { match: r, type: o } = this.frontier[t], s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), i = Qn(e, t, o, r, s);
        if (i) {
          for (let l = t - 1; l >= 0; l--) {
            let { match: c, type: a } = this.frontier[l], u = Qn(e, l, a, c, !0);
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
    t.fit.childCount && (this.placed = Mt(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let o = e.node(r), s = o.type.contentMatch.fillBefore(o.content, !0, e.index(r));
      this.openFrontierNode(o.type, o.attrs, s);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let o = this.frontier[this.depth];
    o.match = o.match.matchType(e), this.placed = Mt(this.placed, this.depth, k.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(k.empty, !0);
    t.childCount && (this.placed = Mt(this.placed, this.frontier.length, t));
  }
}
function At(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(At(n.firstChild.content, e - 1, t)));
}
function Mt(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(Mt(n.lastChild.content, e - 1, t)));
}
function Yn(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Hi(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Hi(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(k.empty, !0)))), n.copy(r);
}
function Qn(n, e, t, r, o) {
  let s = n.node(e), i = o ? n.indexAfter(e) : n.index(e);
  if (i == s.childCount && !t.compatibleContent(s.type))
    return null;
  let l = r.fillBefore(s.content, !0, i);
  return l && !Yc(t, s.content, i) ? l : null;
}
function Yc(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function Qc(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function Xc(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let o = n.doc.resolve(e), s = n.doc.resolve(t);
  if (Ui(o, s, r))
    return n.step(new j(e, t, r));
  let i = Wi(o, n.doc.resolve(t));
  i[i.length - 1] == 0 && i.pop();
  let l = -(o.depth + 1);
  i.unshift(l);
  for (let h = o.depth, p = o.pos - 1; h > 0; h--, p--) {
    let d = o.node(h).type.spec;
    if (d.defining || d.definingAsContext || d.isolating)
      break;
    i.indexOf(h) > -1 ? l = h : o.before(h) == p && i.splice(1, 0, -h);
  }
  let c = i.indexOf(l), a = [], u = r.openStart;
  for (let h = r.content, p = 0; ; p++) {
    let d = h.firstChild;
    if (a.push(d), p == r.openStart)
      break;
    h = d.content;
  }
  for (let h = u - 1; h >= 0; h--) {
    let p = a[h], d = Qc(p.type);
    if (d && !p.sameMarkup(o.node(Math.abs(l) - 1)))
      u = h;
    else if (d || !p.type.isTextblock)
      break;
  }
  for (let h = r.openStart; h >= 0; h--) {
    let p = (h + u + 1) % (r.openStart + 1), d = a[p];
    if (d)
      for (let m = 0; m < i.length; m++) {
        let g = i[(m + c) % i.length], b = !0;
        g < 0 && (b = !1, g = -g);
        let y = o.node(g - 1), S = o.index(g - 1);
        if (y.canReplaceWith(S, S, d.type, d.marks))
          return n.replace(o.before(g), b ? s.after(g) : t, new C(ji(r.content, 0, r.openStart, p), p, r.openEnd));
      }
  }
  let f = n.steps.length;
  for (let h = i.length - 1; h >= 0 && (n.replace(e, t, r), !(n.steps.length > f)); h--) {
    let p = i[h];
    p < 0 || (e = o.before(p), t = s.after(p));
  }
}
function ji(n, e, t, r, o) {
  if (e < t) {
    let s = n.firstChild;
    n = n.replaceChild(0, s.copy(ji(s.content, e + 1, t, r, s)));
  }
  if (e > r) {
    let s = o.contentMatchAt(0), i = s.fillBefore(n).append(n);
    n = i.append(s.matchFragment(i).fillBefore(k.empty, !0));
  }
  return n;
}
function ea(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let o = Kc(n.doc, e, r.type);
    o != null && (e = t = o);
  }
  n.replaceRange(e, t, new C(k.from(r), 0, 0));
}
function ta(n, e, t) {
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
class dt extends J {
  /**
  Construct an attribute step.
  */
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return L.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let s in t.attrs)
      r[s] = t.attrs[s];
    r[this.attr] = this.value;
    let o = t.type.create(r, null, t.marks);
    return L.fromReplace(e, this.pos, this.pos + 1, new C(k.from(o), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return te.empty;
  }
  invert(e) {
    return new dt(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new dt(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new dt(t.pos, t.attr, t.value);
  }
}
J.jsonID("attr", dt);
class Vt extends J {
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
    return L.ok(r);
  }
  getMap() {
    return te.empty;
  }
  invert(e) {
    return new Vt(this.attr, e.attrs[this.attr]);
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
    return new Vt(t.attr, t.value);
  }
}
J.jsonID("docAttr", Vt);
let kt = class extends Error {
};
kt = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
kt.prototype = Object.create(Error.prototype);
kt.prototype.constructor = kt;
kt.prototype.name = "TransformError";
class na {
  /**
  Create a transform that starts with the given document.
  */
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new ht();
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
      throw new kt(t.failed);
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
  replace(e, t = e, r = C.empty) {
    let o = Xr(this.doc, e, t, r);
    return o && this.step(o), this;
  }
  /**
  Replace the given range with the given content, which may be a
  fragment, node, or array of nodes.
  */
  replaceWith(e, t, r) {
    return this.replace(e, t, new C(k.from(r), 0, 0));
  }
  /**
  Delete the content between the given positions.
  */
  delete(e, t) {
    return this.replace(e, t, C.empty);
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
    return Xc(this, e, t, r), this;
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
    return ea(this, e, t, r), this;
  }
  /**
  Delete the given range, expanding it to cover fully covered
  parent nodes until a valid replace is found.
  */
  deleteRange(e, t) {
    return ta(this, e, t), this;
  }
  /**
  Split the content in the given range off from its parent, if there
  is sibling content before or after it, and move it up the tree to
  the depth specified by `target`. You'll probably want to use
  [`liftTarget`](https://prosemirror.net/docs/ref/#transform.liftTarget) to compute `target`, to make
  sure the lift is valid.
  */
  lift(e, t) {
    return Pc(this, e, t), this;
  }
  /**
  Join the blocks around the given position. If depth is 2, their
  last and first siblings are also joined, and so on.
  */
  join(e, t = 1) {
    return Gc(this, e, t), this;
  }
  /**
  Wrap the given [range](https://prosemirror.net/docs/ref/#model.NodeRange) in the given set of wrappers.
  The wrappers are assumed to be valid in this position, and should
  probably be computed with [`findWrapping`](https://prosemirror.net/docs/ref/#transform.findWrapping).
  */
  wrap(e, t) {
    return Uc(this, e, t), this;
  }
  /**
  Set the type of all textblocks (partly) between `from` and `to` to
  the given node type with the given attributes.
  */
  setBlockType(e, t = e, r, o = null) {
    return Hc(this, e, t, r, o), this;
  }
  /**
  Change the type, attributes, and/or marks of the node at `pos`.
  When `type` isn't given, the existing node type is preserved,
  */
  setNodeMarkup(e, t, r = null, o) {
    return Wc(this, e, t, r, o), this;
  }
  /**
  Set a single attribute on a given node to a new value.
  The `pos` addresses the document content. Use `setDocAttribute`
  to set attributes on the document itself.
  */
  setNodeAttribute(e, t, r) {
    return this.step(new dt(e, t, r)), this;
  }
  /**
  Set a single attribute on the document to a new value.
  */
  setDocAttribute(e, t) {
    return this.step(new Vt(e, t)), this;
  }
  /**
  Add a mark to the node at position `pos`.
  */
  addNodeMark(e, t) {
    return this.step(new Ie(e, t)), this;
  }
  /**
  Remove a mark (or a mark of the given type) from the node at
  position `pos`.
  */
  removeNodeMark(e, t) {
    if (!(t instanceof O)) {
      let r = this.doc.nodeAt(e);
      if (!r)
        throw new RangeError("No node at position " + e);
      if (t = t.isInSet(r.marks), !t)
        return this;
    }
    return this.step(new bt(e, t)), this;
  }
  /**
  Split the node at the given position, and optionally, if `depth` is
  greater than one, any number of nodes above that. By default, the
  parts split off will inherit the node type of the original node.
  This can be changed by passing an array of types and attributes to
  use after the split.
  */
  split(e, t = 1, r) {
    return Jc(this, e, t, r), this;
  }
  /**
  Add the given mark to the inline content between `from` and `to`.
  */
  addMark(e, t, r) {
    return Fc(this, e, t, r), this;
  }
  /**
  Remove marks from inline nodes between `from` and `to`. When
  `mark` is a single mark, remove precisely that mark. When it is
  a mark type, remove all marks of that type. When it is null,
  remove all marks of any type.
  */
  removeMark(e, t, r) {
    return zc(this, e, t, r), this;
  }
  /**
  Removes all marks and nodes from the content of the node at
  `pos` that don't match the given new parent node type. Accepts
  an optional starting [content match](https://prosemirror.net/docs/ref/#model.ContentMatch) as
  third argument.
  */
  clearIncompatible(e, t, r) {
    return Lc(this, e, t, r), this;
  }
}
const Xn = /* @__PURE__ */ Object.create(null);
class T {
  /**
  Initialize a selection with the head and anchor and ranges. If no
  ranges are given, constructs a single range across `$anchor` and
  `$head`.
  */
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new ra(e.min(t), e.max(t))];
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
  replace(e, t = C.empty) {
    let r = t.content.lastChild, o = null;
    for (let l = 0; l < t.openEnd; l++)
      o = r, r = r.lastChild;
    let s = e.steps.length, i = this.ranges;
    for (let l = 0; l < i.length; l++) {
      let { $from: c, $to: a } = i[l], u = e.mapping.slice(s);
      e.replaceRange(u.map(c.pos), u.map(a.pos), l ? C.empty : t), l == 0 && Po(e, s, (r ? r.isInline : o && o.isTextblock) ? -1 : 1);
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
      s ? e.deleteRange(a, u) : (e.replaceRangeWith(a, u, t), Po(e, r, t.isInline ? -1 : 1));
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
    let o = e.parent.inlineContent ? new I(e) : at(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (o)
      return o;
    for (let s = e.depth - 1; s >= 0; s--) {
      let i = t < 0 ? at(e.node(0), e.node(s), e.before(s + 1), e.index(s), t, r) : at(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, t, r);
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
    return this.findFrom(e, t) || this.findFrom(e, -t) || new ne(e.node(0));
  }
  /**
  Find the cursor or leaf node selection closest to the start of
  the given document. Will return an
  [`AllSelection`](https://prosemirror.net/docs/ref/#state.AllSelection) if no valid position
  exists.
  */
  static atStart(e) {
    return at(e, e, 0, 0, 1) || new ne(e);
  }
  /**
  Find the cursor or leaf node selection closest to the end of the
  given document.
  */
  static atEnd(e) {
    return at(e, e, e.content.size, e.childCount, -1) || new ne(e);
  }
  /**
  Deserialize the JSON representation of a selection. Must be
  implemented for custom classes (as a static class method).
  */
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = Xn[t.type];
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
    if (e in Xn)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Xn[e] = t, t.prototype.jsonID = e, t;
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
    return I.between(this.$anchor, this.$head).getBookmark();
  }
}
T.prototype.visible = !0;
class ra {
  /**
  Create a range.
  */
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Lo = !1;
function Bo(n) {
  !Lo && !n.parent.inlineContent && (Lo = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class I extends T {
  /**
  Construct a text selection between the given points.
  */
  constructor(e, t = e) {
    Bo(e), Bo(t), super(e, t);
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
      return T.near(r);
    let o = e.resolve(t.map(this.anchor));
    return new I(o.parent.inlineContent ? o : r, r);
  }
  replace(e, t = C.empty) {
    if (super.replace(e, t), t == C.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof I && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new On(this.anchor, this.head);
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
    return new I(e.resolve(t.anchor), e.resolve(t.head));
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
      let s = T.findFrom(t, r, !0) || T.findFrom(t, -r, !0);
      if (s)
        t = s.$head;
      else
        return T.near(t, r);
    }
    return e.parent.inlineContent || (o == 0 ? e = t : (e = (T.findFrom(e, -r, !0) || T.findFrom(e, r, !0)).$anchor, e.pos < t.pos != o < 0 && (e = t))), new I(e, t);
  }
}
T.jsonID("text", I);
class On {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new On(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return I.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class _ extends T {
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
    return r ? T.near(s) : new _(s);
  }
  content() {
    return new C(k.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof _ && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new eo(this.anchor);
  }
  /**
  @internal
  */
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new _(e.resolve(t.anchor));
  }
  /**
  Create a node selection from non-resolved positions.
  */
  static create(e, t) {
    return new _(e.resolve(t));
  }
  /**
  Determines whether the given node may be selected as a node
  selection.
  */
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
_.prototype.visible = !1;
T.jsonID("node", _);
class eo {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new On(r, r) : new eo(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && _.isSelectable(r) ? new _(t) : T.near(t);
  }
}
class ne extends T {
  /**
  Create an all-selection over the given document.
  */
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = C.empty) {
    if (t == C.empty) {
      e.delete(0, e.doc.content.size);
      let r = T.atStart(e.doc);
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
    return new ne(e);
  }
  map(e) {
    return new ne(e);
  }
  eq(e) {
    return e instanceof ne;
  }
  getBookmark() {
    return oa;
  }
}
T.jsonID("all", ne);
const oa = {
  map() {
    return this;
  },
  resolve(n) {
    return new ne(n);
  }
};
function at(n, e, t, r, o, s = !1) {
  if (e.inlineContent)
    return I.create(n, t);
  for (let i = r - (o > 0 ? 0 : 1); o > 0 ? i < e.childCount : i >= 0; i += o) {
    let l = e.child(i);
    if (l.isAtom) {
      if (!s && _.isSelectable(l))
        return _.create(n, t - (o < 0 ? l.nodeSize : 0));
    } else {
      let c = at(n, l, t + o, o < 0 ? l.childCount : 0, o, s);
      if (c)
        return c;
    }
    t += l.nodeSize * o;
  }
  return null;
}
function Po(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let o = n.steps[r];
  if (!(o instanceof j || o instanceof U))
    return;
  let s = n.mapping.maps[r], i;
  s.forEach((l, c, a, u) => {
    i == null && (i = u);
  }), n.setSelection(T.near(n.doc.resolve(i), t));
}
const Vo = 1, rn = 2, $o = 4;
class sa extends na {
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
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | Vo) & ~rn, this.storedMarks = null, this;
  }
  /**
  Whether the selection was explicitly updated by this transaction.
  */
  get selectionSet() {
    return (this.updated & Vo) > 0;
  }
  /**
  Set the current stored marks.
  */
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= rn, this;
  }
  /**
  Make sure the current stored marks or, if that is null, the marks
  at the selection, match the given set of marks. Does nothing if
  this is already the case.
  */
  ensureMarks(e) {
    return O.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
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
    return (this.updated & rn) > 0;
  }
  /**
  @internal
  */
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~rn, this.storedMarks = null;
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
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || O.none))), r.replaceWith(this, e), this;
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
      return this.replaceRangeWith(t, r, o.text(e, s)), this.selection.empty || this.setSelection(T.near(this.selection.$to)), this;
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
    return this.updated |= $o, this;
  }
  /**
  True when this transaction has had `scrollIntoView` called on it.
  */
  get scrolledIntoView() {
    return (this.updated & $o) > 0;
  }
}
function Uo(n, e) {
  return !e || !n ? n : n.bind(e);
}
class Tt {
  constructor(e, t, r) {
    this.name = e, this.init = Uo(t.init, r), this.apply = Uo(t.apply, r);
  }
}
const ia = [
  new Tt("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new Tt("selection", {
    init(n, e) {
      return n.selection || T.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new Tt("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new Tt("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class er {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = ia.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new Tt(r.key, r.spec.state, r));
    });
  }
}
class ft {
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
    let t = new ft(this.config), r = this.config.fields;
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
    return new sa(this);
  }
  /**
  Create a new state.
  */
  static create(e) {
    let t = new er(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new ft(t);
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
    let t = new er(this.schema, e.plugins), r = t.fields, o = new ft(t);
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
    let o = new er(e.schema, e.plugins), s = new ft(o);
    return o.fields.forEach((i) => {
      if (i.name == "doc")
        s.doc = Qe.fromJSON(e.schema, t.doc);
      else if (i.name == "selection")
        s.selection = T.fromJSON(s.doc, t.selection);
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
class $e {
  /**
  Create a plugin.
  */
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Ji(e.props, this, this.props), this.key = e.key ? e.key.key : Gi("plugin");
  }
  /**
  Extract the plugin's state field from an editor state.
  */
  getState(e) {
    return e[this.key];
  }
}
const tr = /* @__PURE__ */ Object.create(null);
function Gi(n) {
  return n in tr ? n + "$" + ++tr[n] : (tr[n] = 0, n + "$");
}
class Ki {
  /**
  Create a plugin key.
  */
  constructor(e = "key") {
    this.key = Gi(e);
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
const K = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, $t = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let Ho = null;
const ve = function(n, e, t) {
  let r = Ho || (Ho = document.createRange());
  return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
}, nt = function(n, e, t, r) {
  return t && (jo(n, e, t, r, -1) || jo(n, e, t, r, 1));
}, la = /^(img|br|input|textarea|hr)$/i;
function jo(n, e, t, r, o) {
  for (; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (o < 0 ? 0 : ge(n))) {
      let s = n.parentNode;
      if (!s || s.nodeType != 1 || to(n) || la.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = K(n) + (o < 0 ? 0 : 1), n = s;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (o < 0 ? -1 : 0)], n.contentEditable == "false")
        return !1;
      e = o < 0 ? ge(n) : 0;
    } else
      return !1;
  }
}
function ge(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function ca(n, e, t) {
  for (let r = e == 0, o = e == ge(n); r || o; ) {
    if (n == t)
      return !0;
    let s = K(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && s == 0, o = o && s == ge(n);
  }
}
function to(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Nn = function(n) {
  return n.focusNode && nt(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function We(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function aa(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function ua(n, e, t) {
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
const ke = typeof navigator < "u" ? navigator : null, Wo = typeof document < "u" ? document : null, Ue = ke && ke.userAgent || "", Or = /Edge\/(\d+)/.exec(Ue), Zi = /MSIE \d/.exec(Ue), Nr = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Ue), ee = !!(Zi || Nr || Or), ze = Zi ? document.documentMode : Nr ? +Nr[1] : Or ? +Or[1] : 0, he = !ee && /gecko\/(\d+)/i.test(Ue);
he && +(/Firefox\/(\d+)/.exec(Ue) || [0, 0])[1];
const qr = !ee && /Chrome\/(\d+)/.exec(Ue), W = !!qr, fa = qr ? +qr[1] : 0, Z = !ee && !!ke && /Apple Computer/.test(ke.vendor), yt = Z && (/Mobile\/\w+/.test(Ue) || !!ke && ke.maxTouchPoints > 2), se = yt || (ke ? /Mac/.test(ke.platform) : !1), ha = ke ? /Win/.test(ke.platform) : !1, ue = /Android \d/.test(Ue), Zt = !!Wo && "webkitFontSmoothing" in Wo.documentElement.style, pa = Zt ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function da(n) {
  return {
    left: 0,
    right: n.documentElement.clientWidth,
    top: 0,
    bottom: n.documentElement.clientHeight
  };
}
function Ce(n, e) {
  return typeof n == "number" ? n : n[e];
}
function ma(n) {
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
  for (let i = t || n.dom; i; i = $t(i)) {
    if (i.nodeType != 1)
      continue;
    let l = i, c = l == s.body, a = c ? da(s) : ma(l), u = 0, f = 0;
    if (e.top < a.top + Ce(r, "top") ? f = -(a.top - e.top + Ce(o, "top")) : e.bottom > a.bottom - Ce(r, "bottom") && (f = e.bottom - e.top > a.bottom - a.top ? e.top + Ce(o, "top") - a.top : e.bottom - a.bottom + Ce(o, "bottom")), e.left < a.left + Ce(r, "left") ? u = -(a.left - e.left + Ce(o, "left")) : e.right > a.right - Ce(r, "right") && (u = e.right - a.right + Ce(o, "right")), u || f)
      if (c)
        s.defaultView.scrollBy(u, f);
      else {
        let h = l.scrollLeft, p = l.scrollTop;
        f && (l.scrollTop += f), u && (l.scrollLeft += u);
        let d = l.scrollLeft - h, m = l.scrollTop - p;
        e = { left: e.left - d, top: e.top - m, right: e.right - d, bottom: e.bottom - m };
      }
    if (c || /^(fixed|sticky)$/.test(getComputedStyle(i).position))
      break;
  }
}
function ga(n) {
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
  return { refDOM: r, refTop: o, stack: Yi(n.dom) };
}
function Yi(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = $t(r))
    ;
  return e;
}
function ba({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  Qi(t, r == 0 ? 0 : r - e);
}
function Qi(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: o, left: s } = n[t];
    r.scrollTop != o + e && (r.scrollTop = o + e), r.scrollLeft != s && (r.scrollLeft = s);
  }
}
let it = null;
function ka(n) {
  if (n.setActive)
    return n.setActive();
  if (it)
    return n.focus(it);
  let e = Yi(n);
  n.focus(it == null ? {
    get preventScroll() {
      return it = { preventScroll: !0 }, !0;
    }
  } : void 0), it || (it = !1, Qi(e, 0));
}
function Xi(n, e) {
  let t, r = 2e8, o, s = 0, i = e.top, l = e.top, c, a;
  for (let u = n.firstChild, f = 0; u; u = u.nextSibling, f++) {
    let h;
    if (u.nodeType == 1)
      h = u.getClientRects();
    else if (u.nodeType == 3)
      h = ve(u).getClientRects();
    else
      continue;
    for (let p = 0; p < h.length; p++) {
      let d = h[p];
      if (d.top <= i && d.bottom >= l) {
        i = Math.max(d.bottom, i), l = Math.min(d.top, l);
        let m = d.left > e.left ? d.left - e.left : d.right < e.left ? e.left - d.right : 0;
        if (m < r) {
          t = u, r = m, o = m && t.nodeType == 3 ? {
            left: d.right < e.left ? d.right : d.left,
            top: e.top
          } : e, u.nodeType == 1 && m && (s = f + (e.left >= (d.left + d.right) / 2 ? 1 : 0));
          continue;
        }
      } else
        d.top > e.top && !c && d.left <= e.left && d.right >= e.left && (c = u, a = { left: Math.max(d.left, Math.min(d.right, e.left)), top: d.top });
      !t && (e.left >= d.right && e.top >= d.top || e.left >= d.left && e.top >= d.bottom) && (s = f + 1);
    }
  }
  return !t && c && (t = c, o = a, r = 0), t && t.nodeType == 3 ? ya(t, o) : !t || r && t.nodeType == 1 ? { node: n, offset: s } : Xi(t, o);
}
function ya(n, e) {
  let t = n.nodeValue.length, r = document.createRange();
  for (let o = 0; o < t; o++) {
    r.setEnd(n, o + 1), r.setStart(n, o);
    let s = Me(r, 1);
    if (s.top != s.bottom && no(e, s))
      return { node: n, offset: o + (e.left >= (s.left + s.right) / 2 ? 1 : 0) };
  }
  return { node: n, offset: 0 };
}
function no(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function xa(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function wa(n, e, t) {
  let { node: r, offset: o } = Xi(e, t), s = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let i = r.getBoundingClientRect();
    s = i.left != i.right && t.left > (i.left + i.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, o, s);
}
function Ca(n, e, t, r) {
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
function el(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let o = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), s = o; ; ) {
      let i = n.childNodes[s];
      if (i.nodeType == 1) {
        let l = i.getClientRects();
        for (let c = 0; c < l.length; c++) {
          let a = l[c];
          if (no(e, a))
            return el(i, e, a);
        }
      }
      if ((s = (s + 1) % r) == o)
        break;
    }
  return n;
}
function va(n, e) {
  let t = n.dom.ownerDocument, r, o = 0, s = ua(t, e.left, e.top);
  s && ({ node: r, offset: o } = s);
  let i = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), l;
  if (!i || !n.dom.contains(i.nodeType != 1 ? i.parentNode : i)) {
    let a = n.dom.getBoundingClientRect();
    if (!no(e, a) || (i = el(n.dom, e, a), !i))
      return null;
  }
  if (Z)
    for (let a = i; r && a; a = $t(a))
      a.draggable && (r = void 0);
  if (i = xa(i, e), r) {
    if (he && r.nodeType == 1 && (o = Math.min(o, r.childNodes.length), o < r.childNodes.length)) {
      let u = r.childNodes[o], f;
      u.nodeName == "IMG" && (f = u.getBoundingClientRect()).right <= e.left && f.bottom > e.top && o++;
    }
    let a;
    Zt && o && r.nodeType == 1 && (a = r.childNodes[o - 1]).nodeType == 1 && a.contentEditable == "false" && a.getBoundingClientRect().top >= e.top && o--, r == n.dom && o == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? l = n.state.doc.content.size : (o == 0 || r.nodeType != 1 || r.childNodes[o - 1].nodeName != "BR") && (l = Ca(n, r, o, e));
  }
  l == null && (l = wa(n, i, e));
  let c = n.docView.nearestDesc(i, !0);
  return { pos: l, inside: c ? c.posAtStart - c.border : -1 };
}
function Go(n) {
  return n.top < n.bottom || n.left < n.right;
}
function Me(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let r = t[e < 0 ? 0 : t.length - 1];
    if (Go(r))
      return r;
  }
  return Array.prototype.find.call(t, Go) || n.getBoundingClientRect();
}
const Sa = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function tl(n, e, t) {
  let { node: r, offset: o, atom: s } = n.docView.domFromPos(e, t < 0 ? -1 : 1), i = Zt || he;
  if (r.nodeType == 3)
    if (i && (Sa.test(r.nodeValue) || (t < 0 ? !o : o == r.nodeValue.length))) {
      let c = Me(ve(r, o, o), t);
      if (he && o && /\s/.test(r.nodeValue[o - 1]) && o < r.nodeValue.length) {
        let a = Me(ve(r, o - 1, o - 1), -1);
        if (a.top == c.top) {
          let u = Me(ve(r, o, o + 1), -1);
          if (u.top != c.top)
            return Dt(u, u.left < a.left);
        }
      }
      return c;
    } else {
      let c = o, a = o, u = t < 0 ? 1 : -1;
      return t < 0 && !o ? (a++, u = -1) : t >= 0 && o == r.nodeValue.length ? (c--, u = 1) : t < 0 ? c-- : a++, Dt(Me(ve(r, c, a), u), u < 0);
    }
  if (!n.state.doc.resolve(e - (s || 0)).parent.inlineContent) {
    if (s == null && o && (t < 0 || o == ge(r))) {
      let c = r.childNodes[o - 1];
      if (c.nodeType == 1)
        return nr(c.getBoundingClientRect(), !1);
    }
    if (s == null && o < ge(r)) {
      let c = r.childNodes[o];
      if (c.nodeType == 1)
        return nr(c.getBoundingClientRect(), !0);
    }
    return nr(r.getBoundingClientRect(), t >= 0);
  }
  if (s == null && o && (t < 0 || o == ge(r))) {
    let c = r.childNodes[o - 1], a = c.nodeType == 3 ? ve(c, ge(c) - (i ? 0 : 1)) : c.nodeType == 1 && (c.nodeName != "BR" || !c.nextSibling) ? c : null;
    if (a)
      return Dt(Me(a, 1), !1);
  }
  if (s == null && o < ge(r)) {
    let c = r.childNodes[o];
    for (; c.pmViewDesc && c.pmViewDesc.ignoreForCoords; )
      c = c.nextSibling;
    let a = c ? c.nodeType == 3 ? ve(c, 0, i ? 0 : 1) : c.nodeType == 1 ? c : null : null;
    if (a)
      return Dt(Me(a, -1), !0);
  }
  return Dt(Me(r.nodeType == 3 ? ve(r) : r, -t), t >= 0);
}
function Dt(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function nr(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function nl(n, e, t) {
  let r = n.state, o = n.root.activeElement;
  r != e && n.updateState(e), o != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), o != n.dom && o && o.focus();
  }
}
function _a(n, e, t) {
  let r = e.selection, o = t == "up" ? r.$from : r.$to;
  return nl(n, e, () => {
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
    let i = tl(n, o.pos, 1);
    for (let l = s.firstChild; l; l = l.nextSibling) {
      let c;
      if (l.nodeType == 1)
        c = l.getClientRects();
      else if (l.nodeType == 3)
        c = ve(l, 0, l.nodeValue.length).getClientRects();
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
const Da = /[\u0590-\u08ac]/;
function Ea(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let o = r.parentOffset, s = !o, i = o == r.parent.content.size, l = n.domSelection();
  return !Da.test(r.parent.textContent) || !l.modify ? t == "left" || t == "backward" ? s : i : nl(n, e, () => {
    let { focusNode: c, focusOffset: a, anchorNode: u, anchorOffset: f } = n.domSelectionRange(), h = l.caretBidiLevel;
    l.modify("move", t, "character");
    let p = r.depth ? n.docView.domAfterPos(r.before()) : n.dom, { focusNode: d, focusOffset: m } = n.domSelectionRange(), g = d && !p.contains(d.nodeType == 1 ? d : d.parentNode) || c == d && a == m;
    try {
      l.collapse(u, f), c && (c != u || a != f) && l.extend && l.extend(c, a);
    } catch {
    }
    return h != null && (l.caretBidiLevel = h), g;
  });
}
let Ko = null, Zo = null, Yo = !1;
function Aa(n, e, t) {
  return Ko == e && Zo == t ? Yo : (Ko = e, Zo = t, Yo = t == "up" || t == "down" ? _a(n, e, t) : Ea(n, e, t));
}
const ce = 0, Qo = 1, Je = 2, ye = 3;
class Yt {
  constructor(e, t, r, o) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = o, this.dirty = ce, r.pmViewDesc = this;
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
      o = t > K(this.contentDOM);
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
      if (l > e || i instanceof ol) {
        o = e - s;
        break;
      }
      s = l;
    }
    if (o)
      return this.children[r].domFromPos(o - this.children[r].border, t);
    for (let s; r && !(s = this.children[r - 1]).size && s instanceof rl && s.side >= 0; r--)
      ;
    if (t <= 0) {
      let s, i = !0;
      for (; s = r ? this.children[r - 1] : null, !(!s || s.dom.parentNode == this.contentDOM); r--, i = !1)
        ;
      return s && t && i && !s.border && !s.domAtom ? s.domFromPos(s.size, t) : { node: this.contentDOM, offset: s ? K(s.dom) + 1 : 0 };
    } else {
      let s, i = !0;
      for (; s = r < this.children.length ? this.children[r] : null, !(!s || s.dom.parentNode == this.contentDOM); r++, i = !1)
        ;
      return s && i && !s.border && !s.domAtom ? s.domFromPos(0, t) : { node: this.contentDOM, offset: s ? K(s.dom) : this.contentDOM.childNodes.length };
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
            o = K(h.dom) + 1;
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
            s = K(f.dom);
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
    for (let h = 0, p = 0; h < this.children.length; h++) {
      let d = this.children[h], m = p + d.size;
      if (s > p && i < m)
        return d.setSelection(e - p - d.border, t - p - d.border, r, o);
      p = m;
    }
    let l = this.domFromPos(e, e ? -1 : 1), c = t == e ? l : this.domFromPos(t, t ? -1 : 1), a = r.getSelection(), u = !1;
    if ((he || Z) && e == t) {
      let { node: h, offset: p } = l;
      if (h.nodeType == 3) {
        if (u = !!(p && h.nodeValue[p - 1] == `
`), u && p == h.nodeValue.length)
          for (let d = h, m; d; d = d.parentNode) {
            if (m = d.nextSibling) {
              m.nodeName == "BR" && (l = c = { node: m.parentNode, offset: K(m) + 1 });
              break;
            }
            let g = d.pmViewDesc;
            if (g && g.node && g.node.isBlock)
              break;
          }
      } else {
        let d = h.childNodes[p - 1];
        u = d && (d.nodeName == "BR" || d.contentEditable == "false");
      }
    }
    if (he && a.focusNode && a.focusNode != c.node && a.focusNode.nodeType == 1) {
      let h = a.focusNode.childNodes[a.focusOffset];
      h && h.contentEditable == "false" && (o = !0);
    }
    if (!(o || u && Z) && nt(l.node, l.offset, a.anchorNode, a.anchorOffset) && nt(c.node, c.offset, a.focusNode, a.focusOffset))
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
        let p = l;
        l = c, c = p;
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
          this.dirty = e == r || t == i ? Je : Qo, e == l && t == c && (s.contentLost || s.dom.parentNode != this.contentDOM) ? s.dirty = ye : s.markDirty(e - l, t - l);
          return;
        } else
          s.dirty = s.dom == s.contentDOM && s.dom.parentNode == this.contentDOM && !s.children.length ? Je : ye;
      }
      r = i;
    }
    this.dirty = Je;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? Je : Qo;
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
class rl extends Yt {
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
    return this.dirty == ce && e.type.eq(this.widget.type);
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
class Ma extends Yt {
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
class rt extends Yt {
  constructor(e, t, r, o) {
    super(e, [], r, o), this.mark = t;
  }
  static create(e, t, r, o) {
    let s = o.nodeViews[t.type.name], i = s && s(t, o, r);
    return (!i || !i.dom) && (i = _e.renderSpec(document, t.type.spec.toDOM(t, r))), new rt(e, t, i.dom, i.contentDOM || i.dom);
  }
  parseRule() {
    return this.dirty & ye || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
  }
  matchesMark(e) {
    return this.dirty != ye && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != ce) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = ce;
    }
  }
  slice(e, t, r) {
    let o = rt.create(this.parent, this.mark, !0, r), s = this.children, i = this.size;
    t < i && (s = Fr(s, t, i, r)), e > 0 && (s = Fr(s, 0, e, r));
    for (let l = 0; l < s.length; l++)
      s[l].parent = o;
    return o.children = s, o;
  }
}
class Le extends Yt {
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
      u || ({ dom: u, contentDOM: f } = _e.renderSpec(document, t.type.spec.toDOM(t)));
    !f && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let h = u;
    return u = ll(u, r, t), a ? c = new Ta(e, t, r, o, u, f || null, h, a, s, i + 1) : t.isText ? new qn(e, t, r, o, u, h, s) : new Le(e, t, r, o, u, f || null, h, s, i + 1);
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
      e.contentElement || (e.getContent = () => k.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return this.dirty == ce && e.eq(this.node) && Ir(t, this.outerDeco) && r.eq(this.innerDeco);
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
    let r = this.node.inlineContent, o = t, s = e.composing ? this.localCompositionInfo(e, t) : null, i = s && s.pos > -1 ? s : null, l = s && s.pos < 0, c = new Na(this, i && i.node, e);
    Ia(this.node, this.innerDeco, (a, u, f) => {
      a.spec.marks ? c.syncToMarks(a.spec.marks, r, e) : a.type.side >= 0 && !f && c.syncToMarks(u == this.node.childCount ? O.none : this.node.child(u).marks, r, e), c.placeWidget(a, e, o);
    }, (a, u, f, h) => {
      c.syncToMarks(a.marks, r, e);
      let p;
      c.findNodeMatch(a, u, f, h) || l && e.state.selection.from > o && e.state.selection.to < o + a.nodeSize && (p = c.findIndexWithChild(s.node)) > -1 && c.updateNodeAt(a, u, f, p, e) || c.updateNextNode(a, u, f, e, h, o) || c.addNode(a, u, f, e, o), o += a.nodeSize;
    }), c.syncToMarks([], r, e), this.node.isTextblock && c.addTextblockHacks(), c.destroyRest(), (c.changed || this.dirty == Je) && (i && this.protectLocalComposition(e, i), sl(this.contentDOM, this.children, e), yt && Fa(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: o } = e.state.selection;
    if (!(e.state.selection instanceof I) || r < t || o > t + this.node.content.size)
      return null;
    let s = e.domSelectionRange(), i = za(s.focusNode, s.focusOffset);
    if (!i || !this.dom.contains(i.parentNode))
      return null;
    if (this.node.inlineContent) {
      let l = i.nodeValue, c = La(this.node.content, l, r - t, o - t);
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
    let i = new Ma(this, s, t, o);
    e.input.compositionNodes.push(i), this.children = Fr(this.children, r, r + o.length, e, i);
  }
  // If this desc must be updated to match the given node decoration,
  // do so and return true.
  update(e, t, r, o) {
    return this.dirty == ye || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, o), !0);
  }
  updateInner(e, t, r, o) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(o, this.posAtStart), this.dirty = ce;
  }
  updateOuterDeco(e) {
    if (Ir(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = il(this.dom, this.nodeDOM, Rr(this.outerDeco, this.node, t), Rr(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
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
function Xo(n, e, t, r, o) {
  ll(r, e, n);
  let s = new Le(void 0, n, e, t, r, r, r, o, 0);
  return s.contentDOM && s.updateChildren(o, 0), s;
}
class qn extends Le {
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
    return this.dirty == ye || this.dirty != ce && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != ce || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, o.trackWrites == this.nodeDOM && (o.trackWrites = null)), this.node = e, this.dirty = ce, !0);
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
    return new qn(this.parent, o, this.outerDeco, this.innerDeco, s, s, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = ye);
  }
  get domAtom() {
    return !1;
  }
}
class ol extends Yt {
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
class Ta extends Le {
  constructor(e, t, r, o, s, i, l, c, a, u) {
    super(e, t, r, o, s, i, l, a, u), this.spec = c;
  }
  // A custom `update` method gets to decide whether the update goes
  // through. If it does, and there's a `contentDOM` node, our logic
  // updates the children.
  update(e, t, r, o) {
    if (this.dirty == ye)
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
function sl(n, e, t) {
  let r = n.firstChild, o = !1;
  for (let s = 0; s < e.length; s++) {
    let i = e[s], l = i.dom;
    if (l.parentNode == n) {
      for (; l != r; )
        r = es(r), o = !0;
      r = r.nextSibling;
    } else
      o = !0, n.insertBefore(l, r);
    if (i instanceof rt) {
      let c = r ? r.previousSibling : n.lastChild;
      sl(i.contentDOM, i.children, t), r = c ? c.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = es(r), o = !0;
  o && t.trackWrites == n && (t.trackWrites = null);
}
const qt = function(n) {
  n && (this.nodeName = n);
};
qt.prototype = /* @__PURE__ */ Object.create(null);
const Ge = [new qt()];
function Rr(n, e, t) {
  if (n.length == 0)
    return Ge;
  let r = t ? Ge[0] : new qt(), o = [r];
  for (let s = 0; s < n.length; s++) {
    let i = n[s].type.attrs;
    if (i) {
      i.nodeName && o.push(r = new qt(i.nodeName));
      for (let l in i) {
        let c = i[l];
        c != null && (t && o.length == 1 && o.push(r = new qt(e.isInline ? "span" : "div")), l == "class" ? r.class = (r.class ? r.class + " " : "") + c : l == "style" ? r.style = (r.style ? r.style + ";" : "") + c : l != "nodeName" && (r[l] = c));
      }
    }
  }
  return o;
}
function il(n, e, t, r) {
  if (t == Ge && r == Ge)
    return e;
  let o = e;
  for (let s = 0; s < r.length; s++) {
    let i = r[s], l = t[s];
    if (s) {
      let c;
      l && l.nodeName == i.nodeName && o != n && (c = o.parentNode) && c.nodeName.toLowerCase() == i.nodeName || (c = document.createElement(i.nodeName), c.pmIsDeco = !0, c.appendChild(o), l = Ge[0]), o = c;
    }
    Oa(o, l || Ge[0], i);
  }
  return o;
}
function Oa(n, e, t) {
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
function ll(n, e, t) {
  return il(n, n, Ge, Rr(e, t, n.nodeType != 1));
}
function Ir(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function es(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Na {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = qa(e.node.content, e);
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
      this.destroyRest(), this.top.dirty = ce, this.index = this.stack.pop(), this.top = this.stack.pop(), s--;
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
        let c = rt.create(this.top, e[s], t, r);
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
    return i.dirty == ye && i.dom == i.contentDOM && (i.dirty = Je), i.update(e, t, r, s) ? (this.destroyBetween(this.index, o), this.index++, !0) : !1;
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
      if (c instanceof Le) {
        let a = this.preMatch.matched.get(c);
        if (a != null && a != s)
          return !1;
        let u = c.dom, f, h = this.isLocked(u) && !(e.isText && c.node && c.node.isText && c.nodeDOM.nodeValue == e.text && c.dirty != ye && Ir(t, c.outerDeco));
        if (!h && c.update(e, t, r, o))
          return this.destroyBetween(this.index, l), c.dom != u && (this.changed = !0), this.index++, !0;
        if (!h && (f = this.recreateWrapper(c, e, t, r, o, i)))
          return this.top.children[this.index] = f, f.contentDOM && (f.dirty = Je, f.updateChildren(o, i + 1), f.dirty = ce), this.changed = !0, this.index++, !0;
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
    let l = Le.create(this.top, t, r, o, s, i);
    if (l.contentDOM) {
      l.children = e.children, e.children = [];
      for (let c of l.children)
        c.parent = l;
    }
    return e.destroy(), l;
  }
  // Insert the node as a newly created node desc.
  addNode(e, t, r, o, s) {
    let i = Le.create(this.top, e, t, r, o, s);
    i.contentDOM && i.updateChildren(o, s + 1), this.top.children.splice(this.index++, 0, i), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let o = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (o && o.matchesWidget(e) && (e == o.widget || !o.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let s = new rl(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  // Make sure a textblock looks and behaves correctly in
  // contentEditable.
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof rt; )
      t = e, e = t.children[t.children.length - 1];
    (!e || // Empty textblock
    !(e instanceof qn) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((Z || W) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let o = new ol(this.top, [], r, null);
      t != this.top ? t.children.push(o) : t.children.splice(this.index++, 0, o), this.changed = !0;
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || e.nodeType == 1 && e.contains(this.lock.parentNode));
  }
}
function qa(n, e) {
  let t = e, r = t.children.length, o = n.childCount, s = /* @__PURE__ */ new Map(), i = [];
  e:
    for (; o > 0; ) {
      let l;
      for (; ; )
        if (r) {
          let a = t.children[r - 1];
          if (a instanceof rt)
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
function Ra(n, e) {
  return n.type.side - e.type.side;
}
function Ia(n, e, t, r) {
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
        f.sort(Ra);
        for (let g = 0; g < f.length; g++)
          t(f[g], a, !!c);
      } else
        t(u, a, !!c);
    let h, p;
    if (c)
      p = -1, h = c, c = null;
    else if (a < n.childCount)
      p = a, h = n.child(a++);
    else
      break;
    for (let g = 0; g < l.length; g++)
      l[g].to <= s && l.splice(g--, 1);
    for (; i < o.length && o[i].from <= s && o[i].to > s; )
      l.push(o[i++]);
    let d = s + h.nodeSize;
    if (h.isText) {
      let g = d;
      i < o.length && o[i].from < g && (g = o[i].from);
      for (let b = 0; b < l.length; b++)
        l[b].to < g && (g = l[b].to);
      g < d && (c = h.cut(g - s), h = h.cut(0, g - s), d = g, p = -1);
    } else
      for (; i < o.length && o[i].to <= d; )
        i++;
    let m = h.isInline && !h.isLeaf ? l.filter((g) => !g.inline) : l.slice();
    r(h, m, e.forChild(s, h), p), s = d;
  }
}
function Fa(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function za(n, e) {
  for (; ; ) {
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.childNodes.length > e && n.childNodes[e].nodeType == 3)
        return n.childNodes[e];
      n = n.childNodes[e - 1], e = ge(n);
    } else if (n.nodeType == 1 && e < n.childNodes.length)
      n = n.childNodes[e], e = 0;
    else
      return null;
  }
}
function La(n, e, t, r) {
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
function Fr(n, e, t, r, o) {
  let s = [];
  for (let i = 0, l = 0; i < n.length; i++) {
    let c = n[i], a = l, u = l += c.size;
    a >= t || u <= e ? s.push(c) : (a < e && s.push(c.slice(0, e - a, r)), o && (s.push(o), o = void 0), u > t && s.push(c.slice(t - a, c.size, r)));
  }
  return s;
}
function ro(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let o = n.docView.nearestDesc(t.focusNode), s = o && o.size == 0, i = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (i < 0)
    return null;
  let l = r.resolve(i), c, a;
  if (Nn(t)) {
    for (c = l; o && !o.node; )
      o = o.parent;
    let u = o.node;
    if (o && u.isAtom && _.isSelectable(u) && o.parent && !(u.isInline && ca(t.focusNode, t.focusOffset, o.dom))) {
      let f = o.posBefore;
      a = new _(i == f ? l : r.resolve(f));
    }
  } else {
    let u = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (u < 0)
      return null;
    c = r.resolve(u);
  }
  if (!a) {
    let u = e == "pointer" || n.state.selection.head < l.pos && !s ? 1 : -1;
    a = oo(n, c, l, u);
  }
  return a;
}
function cl(n) {
  return n.editable ? n.hasFocus() : ul(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function De(n, e = !1) {
  let t = n.state.selection;
  if (al(n, t), !!cl(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && W) {
      let r = n.domSelectionRange(), o = n.domObserver.currentSelection;
      if (r.anchorNode && o.anchorNode && nt(r.anchorNode, r.anchorOffset, o.anchorNode, o.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      Pa(n);
    else {
      let { anchor: r, head: o } = t, s, i;
      ts && !(t instanceof I) && (t.$from.parent.inlineContent || (s = ns(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (i = ns(n, t.to))), n.docView.setSelection(r, o, n.root, e), ts && (s && rs(s), i && rs(i)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Ba(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const ts = Z || W && fa < 63;
function ns(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), o = r < t.childNodes.length ? t.childNodes[r] : null, s = r ? t.childNodes[r - 1] : null;
  if (Z && o && o.contentEditable == "false")
    return rr(o);
  if ((!o || o.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (o)
      return rr(o);
    if (s)
      return rr(s);
  }
}
function rr(n) {
  return n.contentEditable = "true", Z && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function rs(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function Ba(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, o = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != o) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!cl(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function Pa(n) {
  let e = n.domSelection(), t = document.createRange(), r = n.cursorWrapper.dom, o = r.nodeName == "IMG";
  o ? t.setEnd(r.parentNode, K(r) + 1) : t.setEnd(r, 0), t.collapse(!1), e.removeAllRanges(), e.addRange(t), !o && !n.state.selection.visible && ee && ze <= 11 && (r.disabled = !0, r.disabled = !1);
}
function al(n, e) {
  if (e instanceof _) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (ss(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    ss(n);
}
function ss(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function oo(n, e, t, r) {
  return n.someProp("createSelectionBetween", (o) => o(n, e, t)) || I.between(e, t, r);
}
function is(n) {
  return n.editable && !n.hasFocus() ? !1 : ul(n);
}
function ul(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function Va(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return nt(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function zr(n, e) {
  let { $anchor: t, $head: r } = n.selection, o = e > 0 ? t.max(r) : t.min(r), s = o.parent.inlineContent ? o.depth ? n.doc.resolve(e > 0 ? o.after() : o.before()) : null : o;
  return s && T.findFrom(s, e);
}
function Te(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function ls(n, e, t) {
  let r = n.state.selection;
  if (r instanceof I)
    if (t.indexOf("s") > -1) {
      let { $head: o } = r, s = o.textOffset ? null : e < 0 ? o.nodeBefore : o.nodeAfter;
      if (!s || s.isText || !s.isLeaf)
        return !1;
      let i = n.state.doc.resolve(o.pos + s.nodeSize * (e < 0 ? -1 : 1));
      return Te(n, new I(r.$anchor, i));
    } else if (r.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let o = zr(n.state, e);
        return o && o instanceof _ ? Te(n, o) : !1;
      } else if (!(se && t.indexOf("m") > -1)) {
        let o = r.$head, s = o.textOffset ? null : e < 0 ? o.nodeBefore : o.nodeAfter, i;
        if (!s || s.isText)
          return !1;
        let l = e < 0 ? o.pos - s.nodeSize : o.pos;
        return s.isAtom || (i = n.docView.descAt(l)) && !i.contentDOM ? _.isSelectable(s) ? Te(n, new _(e < 0 ? n.state.doc.resolve(o.pos - s.nodeSize) : o)) : Zt ? Te(n, new I(n.state.doc.resolve(e < 0 ? l : l + s.nodeSize))) : !1 : !1;
      }
    } else
      return !1;
  else {
    if (r instanceof _ && r.node.isInline)
      return Te(n, new I(e > 0 ? r.$to : r.$from));
    {
      let o = zr(n.state, e);
      return o ? Te(n, o) : !1;
    }
  }
}
function wn(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Rt(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function lt(n, e) {
  return e < 0 ? $a(n) : Ua(n);
}
function $a(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let o, s, i = !1;
  for (he && t.nodeType == 1 && r < wn(t) && Rt(t.childNodes[r], -1) && (i = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let l = t.childNodes[r - 1];
        if (Rt(l, -1))
          o = t, s = --r;
        else if (l.nodeType == 3)
          t = l, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (fl(t))
        break;
      {
        let l = t.previousSibling;
        for (; l && Rt(l, -1); )
          o = t.parentNode, s = K(l), l = l.previousSibling;
        if (l)
          t = l, r = wn(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  i ? Lr(n, t, r) : o && Lr(n, o, s);
}
function Ua(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let o = wn(t), s, i;
  for (; ; )
    if (r < o) {
      if (t.nodeType != 1)
        break;
      let l = t.childNodes[r];
      if (Rt(l, 1))
        s = t, i = ++r;
      else
        break;
    } else {
      if (fl(t))
        break;
      {
        let l = t.nextSibling;
        for (; l && Rt(l, 1); )
          s = l.parentNode, i = K(l) + 1, l = l.nextSibling;
        if (l)
          t = l, r = 0, o = wn(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = o = 0;
        }
      }
    }
  s && Lr(n, s, i);
}
function fl(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function Ha(n, e) {
  for (; n && e == n.childNodes.length && !to(n); )
    e = K(n) + 1, n = n.parentNode;
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = 0;
  }
}
function ja(n, e) {
  for (; n && !e && !to(n); )
    e = K(n), n = n.parentNode;
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3)
      return t;
    if (t.nodeType == 1 && t.contentEditable == "false")
      break;
    n = t, e = n.childNodes.length;
  }
}
function Lr(n, e, t) {
  if (e.nodeType != 3) {
    let s, i;
    (i = Ha(e, t)) ? (e = i, t = 0) : (s = ja(e, t)) && (e = s, t = s.nodeValue.length);
  }
  let r = n.domSelection();
  if (Nn(r)) {
    let s = document.createRange();
    s.setEnd(e, t), s.setStart(e, t), r.removeAllRanges(), r.addRange(s);
  } else
    r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: o } = n;
  setTimeout(() => {
    n.state == o && De(n);
  }, 50);
}
function cs(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(W || ha) && t.parent.inlineContent) {
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
function as(n, e, t) {
  let r = n.state.selection;
  if (r instanceof I && !r.empty || t.indexOf("s") > -1 || se && t.indexOf("m") > -1)
    return !1;
  let { $from: o, $to: s } = r;
  if (!o.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let i = zr(n.state, e);
    if (i && i instanceof _)
      return Te(n, i);
  }
  if (!o.parent.inlineContent) {
    let i = e < 0 ? o : s, l = r instanceof ne ? T.near(i, e) : T.findFrom(i, e);
    return l ? Te(n, l) : !1;
  }
  return !1;
}
function us(n, e) {
  if (!(n.state.selection instanceof I))
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
function fs(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function Wa(n) {
  if (!Z || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    fs(n, r, "true"), setTimeout(() => fs(n, r, "false"), 20);
  }
  return !1;
}
function Ja(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function Ga(n, e) {
  let t = e.keyCode, r = Ja(e);
  if (t == 8 || se && t == 72 && r == "c")
    return us(n, -1) || lt(n, -1);
  if (t == 46 && !e.shiftKey || se && t == 68 && r == "c")
    return us(n, 1) || lt(n, 1);
  if (t == 13 || t == 27)
    return !0;
  if (t == 37 || se && t == 66 && r == "c") {
    let o = t == 37 ? cs(n, n.state.selection.from) == "ltr" ? -1 : 1 : -1;
    return ls(n, o, r) || lt(n, o);
  } else if (t == 39 || se && t == 70 && r == "c") {
    let o = t == 39 ? cs(n, n.state.selection.from) == "ltr" ? 1 : -1 : 1;
    return ls(n, o, r) || lt(n, o);
  } else {
    if (t == 38 || se && t == 80 && r == "c")
      return as(n, -1, r) || lt(n, -1);
    if (t == 40 || se && t == 78 && r == "c")
      return Wa(n) || as(n, 1, r) || lt(n, 1);
    if (r == (se ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
      return !0;
  }
  return !1;
}
function hl(n, e) {
  n.someProp("transformCopied", (p) => {
    e = p(e, n);
  });
  let t = [], { content: r, openStart: o, openEnd: s } = e;
  for (; o > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    o--, s--;
    let p = r.firstChild;
    t.push(p.type.name, p.attrs != p.type.defaultAttrs ? p.attrs : null), r = p.content;
  }
  let i = n.someProp("clipboardSerializer") || _e.fromSchema(n.state.schema), l = kl(), c = l.createElement("div");
  c.appendChild(i.serializeFragment(r, { document: l }));
  let a = c.firstChild, u, f = 0;
  for (; a && a.nodeType == 1 && (u = bl[a.nodeName.toLowerCase()]); ) {
    for (let p = u.length - 1; p >= 0; p--) {
      let d = l.createElement(u[p]);
      for (; c.firstChild; )
        d.appendChild(c.firstChild);
      c.appendChild(d), f++;
    }
    a = c.firstChild;
  }
  a && a.nodeType == 1 && a.setAttribute("data-pm-slice", `${o} ${s}${f ? ` -${f}` : ""} ${JSON.stringify(t)}`);
  let h = n.someProp("clipboardTextSerializer", (p) => p(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: c, text: h };
}
function pl(n, e, t, r, o) {
  let s = o.parent.type.spec.code, i, l;
  if (!t && !e)
    return null;
  let c = e && (r || s || !t);
  if (c) {
    if (n.someProp("transformPastedText", (h) => {
      e = h(e, s || r, n);
    }), s)
      return e ? new C(k.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0) : C.empty;
    let f = n.someProp("clipboardTextParser", (h) => h(e, o, r, n));
    if (f)
      l = f;
    else {
      let h = o.marks(), { schema: p } = n.state, d = _e.fromSchema(p);
      i = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let g = i.appendChild(document.createElement("p"));
        m && g.appendChild(d.serializeNode(p.text(m, h)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (f) => {
      t = f(t, n);
    }), i = Ya(t), Zt && Qa(i);
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
  if (l || (l = (n.someProp("clipboardParser") || n.someProp("domParser") || gt.fromSchema(n.state.schema)).parseSlice(i, {
    preserveWhitespace: !!(c || u),
    context: o,
    ruleFromNode(h) {
      return h.nodeName == "BR" && !h.nextSibling && h.parentNode && !Ka.test(h.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    l = Xa(hs(l, +u[1], +u[2]), u[4]);
  else if (l = C.maxOpen(Za(l.content, o), !0), l.openStart || l.openEnd) {
    let f = 0, h = 0;
    for (let p = l.content.firstChild; f < l.openStart && !p.type.spec.isolating; f++, p = p.firstChild)
      ;
    for (let p = l.content.lastChild; h < l.openEnd && !p.type.spec.isolating; h++, p = p.lastChild)
      ;
    l = hs(l, f, h);
  }
  return n.someProp("transformPasted", (f) => {
    l = f(l, n);
  }), l;
}
const Ka = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Za(n, e) {
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
      if (a = i.length && s.length && ml(c, s, l, i[i.length - 1], 0))
        i[i.length - 1] = a;
      else {
        i.length && (i[i.length - 1] = gl(i[i.length - 1], s.length));
        let u = dl(l, c);
        i.push(u), o = o.matchType(u.type), s = c;
      }
    }), i)
      return k.from(i);
  }
  return n;
}
function dl(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, k.from(n));
  return n;
}
function ml(n, e, t, r, o) {
  if (o < n.length && o < e.length && n[o] == e[o]) {
    let s = ml(n, e, t, r.lastChild, o + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(o == n.length - 1 ? t.type : n[o + 1]))
      return r.copy(r.content.append(k.from(dl(t, n, o + 1))));
  }
}
function gl(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, gl(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(k.empty, !0);
  return n.copy(t.append(r));
}
function Br(n, e, t, r, o, s) {
  let i = e < 0 ? n.firstChild : n.lastChild, l = i.content;
  return n.childCount > 1 && (s = 0), o < r - 1 && (l = Br(l, e, t, r, o + 1, s)), o >= t && (l = e < 0 ? i.contentMatchAt(0).fillBefore(l, s <= o).append(l) : l.append(i.contentMatchAt(i.childCount).fillBefore(k.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, i.copy(l));
}
function hs(n, e, t) {
  return e < n.openStart && (n = new C(Br(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new C(Br(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const bl = {
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
let ps = null;
function kl() {
  return ps || (ps = document.implementation.createHTMLDocument("title"));
}
function Ya(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = kl().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), o;
  if ((o = r && bl[r[1].toLowerCase()]) && (n = o.map((s) => "<" + s + ">").join("") + n + o.map((s) => "</" + s + ">").reverse().join("")), t.innerHTML = n, o)
    for (let s = 0; s < o.length; s++)
      t = t.querySelector(o[s]) || t;
  return t;
}
function Qa(n) {
  let e = n.querySelectorAll(W ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == " " && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function Xa(n, e) {
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
    o = k.from(c.create(r[l + 1], o)), s++, i++;
  }
  return new C(o, s, i);
}
const Y = {}, Q = {}, eu = { touchstart: !0, touchmove: !0 };
class tu {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "" }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastAndroidDelete = 0, this.composing = !1, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.compositionID = 1, this.compositionPendingChanges = 0, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function nu(n) {
  for (let e in Y) {
    let t = Y[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      ou(n, r) && !so(n, r) && (n.editable || !(r.type in Q)) && t(n, r);
    }, eu[e] ? { passive: !0 } : void 0);
  }
  Z && n.dom.addEventListener("input", () => null), Pr(n);
}
function Fe(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function ru(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function Pr(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => so(n, r));
  });
}
function so(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function ou(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function su(n, e) {
  !so(n, e) && Y[e.type] && (n.editable || !(e.type in Q)) && Y[e.type](n, e);
}
Q.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !xl(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(ue && W && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), yt && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (o) => o(n, We(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else
      n.someProp("handleKeyDown", (r) => r(n, t)) || Ga(n, t) ? t.preventDefault() : Fe(n, "key");
};
Q.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
Q.keypress = (n, e) => {
  let t = e;
  if (xl(n, t) || !t.charCode || t.ctrlKey && !t.altKey || se && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (o) => o(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof I) || !r.$from.sameParent(r.$to)) {
    let o = String.fromCharCode(t.charCode);
    !/[\r\n]/.test(o) && !n.someProp("handleTextInput", (s) => s(n, r.$from.pos, r.$to.pos, o)) && n.dispatch(n.state.tr.insertText(o).scrollIntoView()), t.preventDefault();
  }
};
function Rn(n) {
  return { left: n.clientX, top: n.clientY };
}
function iu(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function io(n, e, t, r, o) {
  if (r == -1)
    return !1;
  let s = n.state.doc.resolve(r);
  for (let i = s.depth + 1; i > 0; i--)
    if (n.someProp(e, (l) => i > s.depth ? l(n, t, s.nodeAfter, s.before(i), o, !0) : l(n, t, s.node(i), s.before(i), o, !1)))
      return !0;
  return !1;
}
function mt(n, e, t) {
  n.focused || n.focus();
  let r = n.state.tr.setSelection(e);
  t == "pointer" && r.setMeta("pointer", !0), n.dispatch(r);
}
function lu(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && _.isSelectable(r) ? (mt(n, new _(t), "pointer"), !0) : !1;
}
function cu(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, o;
  t instanceof _ && (r = t.node);
  let s = n.state.doc.resolve(e);
  for (let i = s.depth + 1; i > 0; i--) {
    let l = i > s.depth ? s.nodeAfter : s.node(i);
    if (_.isSelectable(l)) {
      r && t.$from.depth > 0 && i >= t.$from.depth && s.before(t.$from.depth + 1) == t.$from.pos ? o = s.before(t.$from.depth) : o = s.before(i);
      break;
    }
  }
  return o != null ? (mt(n, _.create(n.state.doc, o), "pointer"), !0) : !1;
}
function au(n, e, t, r, o) {
  return io(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (s) => s(n, e, r)) || (o ? cu(n, t) : lu(n, t));
}
function uu(n, e, t, r) {
  return io(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (o) => o(n, e, r));
}
function fu(n, e, t, r) {
  return io(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (o) => o(n, e, r)) || hu(n, t, r);
}
function hu(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (mt(n, I.create(r, 0, r.content.size), "pointer"), !0) : !1;
  let o = r.resolve(e);
  for (let s = o.depth + 1; s > 0; s--) {
    let i = s > o.depth ? o.nodeAfter : o.node(s), l = o.before(s);
    if (i.inlineContent)
      mt(n, I.create(r, l + 1, l + 1 + i.content.size), "pointer");
    else if (_.isSelectable(i))
      mt(n, _.create(r, l), "pointer");
    else
      continue;
    return !0;
  }
}
function lo(n) {
  return Cn(n);
}
const yl = se ? "metaKey" : "ctrlKey";
Y.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = lo(n), o = Date.now(), s = "singleClick";
  o - n.input.lastClick.time < 500 && iu(t, n.input.lastClick) && !t[yl] && (n.input.lastClick.type == "singleClick" ? s = "doubleClick" : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")), n.input.lastClick = { time: o, x: t.clientX, y: t.clientY, type: s };
  let i = n.posAtCoords(Rn(t));
  i && (s == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new pu(n, i, t, !!r)) : (s == "doubleClick" ? uu : fu)(n, i.pos, i.inside, t) ? t.preventDefault() : Fe(n, "pointer"));
};
class pu {
  constructor(e, t, r, o) {
    this.view = e, this.pos = t, this.event = r, this.flushed = o, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[yl], this.allowDefault = r.shiftKey;
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
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || a instanceof _ && a.from <= i && a.to > i) && (this.mightDrag = {
      node: s,
      pos: i,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && he && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Fe(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => De(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Rn(e))), this.updateAllowDefault(e), this.allowDefault || !t ? Fe(this.view, "pointer") : au(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || // Safari ignores clicks on draggable elements
    Z && this.mightDrag && !this.mightDrag.node.isAtom || // Chrome will sometimes treat a node selection as a
    // cursor, but still report that the node is selected
    // when asked through getSelection. You'll then get a
    // situation where clicking at the point where that
    // (hidden) cursor is doesn't change the selection, and
    // thus doesn't get a reaction from ProseMirror. This
    // works around that.
    W && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (mt(this.view, T.near(this.view.state.doc.resolve(t.pos)), "pointer"), e.preventDefault()) : Fe(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), Fe(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
Y.touchstart = (n) => {
  n.input.lastTouch = Date.now(), lo(n), Fe(n, "pointer");
};
Y.touchmove = (n) => {
  n.input.lastTouch = Date.now(), Fe(n, "pointer");
};
Y.contextmenu = (n) => lo(n);
function xl(n, e) {
  return n.composing ? !0 : Z && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const du = ue ? 5e3 : -1;
Q.compositionstart = Q.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      n.markCursor = n.state.storedMarks || t.marks(), Cn(n, !0), n.markCursor = null;
    else if (Cn(n), he && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
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
  wl(n, du);
};
Q.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, n.input.compositionPendingChanges = n.domObserver.pendingRecords().length ? n.input.compositionID : 0, n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()), n.input.compositionID++, wl(n, 20));
};
function wl(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => Cn(n), e));
}
function Cl(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = mu()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function mu() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function Cn(n, e = !1) {
  if (!(ue && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Cl(n), e || n.docView && n.docView.dirty) {
      let t = ro(n);
      return t && !t.eq(n.state.selection) ? n.dispatch(n.state.tr.setSelection(t)) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function gu(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), o = document.createRange();
  o.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(o), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const Ut = ee && ze < 15 || yt && pa < 604;
Y.copy = Q.cut = (n, e) => {
  let t = e, r = n.state.selection, o = t.type == "cut";
  if (r.empty)
    return;
  let s = Ut ? null : t.clipboardData, i = r.content(), { dom: l, text: c } = hl(n, i);
  s ? (t.preventDefault(), s.clearData(), s.setData("text/html", l.innerHTML), s.setData("text/plain", c)) : gu(n, l), o && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function bu(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function ku(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus();
  let o = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? Ht(n, r.value, null, o, e) : Ht(n, r.textContent, r.innerHTML, o, e);
  }, 50);
}
function Ht(n, e, t, r, o) {
  let s = pl(n, e, t, r, n.state.selection.$from);
  if (n.someProp("handlePaste", (c) => c(n, o, s || C.empty)))
    return !0;
  if (!s)
    return !1;
  let i = bu(s), l = i ? n.state.tr.replaceSelectionWith(i, r) : n.state.tr.replaceSelection(s);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function vl(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e)
    return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
Q.paste = (n, e) => {
  let t = e;
  if (n.composing && !ue)
    return;
  let r = Ut ? null : t.clipboardData, o = n.input.shiftKey && n.input.lastKeyCode != 45;
  r && Ht(n, vl(r), r.getData("text/html"), o, t) ? t.preventDefault() : ku(n, t);
};
class Sl {
  constructor(e, t, r) {
    this.slice = e, this.move = t, this.node = r;
  }
}
const _l = se ? "altKey" : "ctrlKey";
Y.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let o = n.state.selection, s = o.empty ? null : n.posAtCoords(Rn(t)), i;
  if (!(s && s.pos >= o.from && s.pos <= (o instanceof _ ? o.to - 1 : o.to))) {
    if (r && r.mightDrag)
      i = _.create(n.state.doc, r.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let u = n.docView.nearestDesc(t.target, !0);
      u && u.node.type.spec.draggable && u != n.docView && (i = _.create(n.state.doc, u.posBefore));
    }
  }
  let l = (i || n.state.selection).content(), { dom: c, text: a } = hl(n, l);
  t.dataTransfer.clearData(), t.dataTransfer.setData(Ut ? "Text" : "text/html", c.innerHTML), t.dataTransfer.effectAllowed = "copyMove", Ut || t.dataTransfer.setData("text/plain", a), n.dragging = new Sl(l, !t[_l], i);
};
Y.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
Q.dragover = Q.dragenter = (n, e) => e.preventDefault();
Q.drop = (n, e) => {
  let t = e, r = n.dragging;
  if (n.dragging = null, !t.dataTransfer)
    return;
  let o = n.posAtCoords(Rn(t));
  if (!o)
    return;
  let s = n.state.doc.resolve(o.pos), i = r && r.slice;
  i ? n.someProp("transformPasted", (d) => {
    i = d(i, n);
  }) : i = pl(n, vl(t.dataTransfer), Ut ? null : t.dataTransfer.getData("text/html"), !1, s);
  let l = !!(r && !t[_l]);
  if (n.someProp("handleDrop", (d) => d(n, t, i || C.empty, l))) {
    t.preventDefault();
    return;
  }
  if (!i)
    return;
  t.preventDefault();
  let c = i ? $i(n.state.doc, s.pos, i) : s.pos;
  c == null && (c = s.pos);
  let a = n.state.tr;
  if (l) {
    let { node: d } = r;
    d ? d.replace(a) : a.deleteSelection();
  }
  let u = a.mapping.map(c), f = i.openStart == 0 && i.openEnd == 0 && i.content.childCount == 1, h = a.doc;
  if (f ? a.replaceRangeWith(u, u, i.content.firstChild) : a.replaceRange(u, u, i), a.doc.eq(h))
    return;
  let p = a.doc.resolve(u);
  if (f && _.isSelectable(i.content.firstChild) && p.nodeAfter && p.nodeAfter.sameMarkup(i.content.firstChild))
    a.setSelection(new _(p));
  else {
    let d = a.mapping.map(c);
    a.mapping.maps[a.mapping.maps.length - 1].forEach((m, g, b, y) => d = y), a.setSelection(oo(n, p, a.doc.resolve(d)));
  }
  n.focus(), n.dispatch(a.setMeta("uiEvent", "drop"));
};
Y.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && De(n);
  }, 20));
};
Y.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
Y.beforeinput = (n, e) => {
  if (W && ue && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (s) => s(n, We(8, "Backspace")))))
        return;
      let { $cursor: o } = n.state.selection;
      o && o.pos > 0 && n.dispatch(n.state.tr.delete(o.pos - 1, o.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in Q)
  Y[n] = Q[n];
function jt(n, e) {
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
class vn {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || Xe, this.side = this.spec.side || 0;
  }
  map(e, t, r, o) {
    let { pos: s, deleted: i } = e.mapResult(t.from + o, this.side < 0 ? -1 : 1);
    return i ? null : new le(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof vn && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && jt(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class Be {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Xe;
  }
  map(e, t, r, o) {
    let s = e.map(t.from + o, this.spec.inclusiveStart ? -1 : 1) - r, i = e.map(t.to + o, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= i ? null : new le(s, i, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof Be && jt(this.attrs, e.attrs) && jt(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof Be;
  }
  destroy() {
  }
}
class co {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Xe;
  }
  map(e, t, r, o) {
    let s = e.mapResult(t.from + o, 1);
    if (s.deleted)
      return null;
    let i = e.mapResult(t.to + o, -1);
    return i.deleted || i.pos <= s.pos ? null : new le(s.pos - r, i.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: o } = e.content.findIndex(t.from), s;
    return o == t.from && !(s = e.child(r)).isText && o + s.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof co && jt(this.attrs, e.attrs) && jt(this.spec, e.spec);
  }
  destroy() {
  }
}
class le {
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
    return new le(e, t, this.type);
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
    return new le(e, e, new vn(t, r));
  }
  /**
  Creates an inline decoration, which adds the given attributes to
  each inline node between `from` and `to`.
  */
  static inline(e, t, r, o) {
    return new le(e, t, new Be(r, o));
  }
  /**
  Creates a node decoration. `from` and `to` should point precisely
  before and after a node in the document. That node, and only that
  node, will receive the given attributes.
  */
  static node(e, t, r, o) {
    return new le(e, t, new co(r, o));
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
    return this.type instanceof Be;
  }
  /**
  @internal
  */
  get widget() {
    return this.type instanceof vn;
  }
}
const ut = [], Xe = {};
class B {
  /**
  @internal
  */
  constructor(e, t) {
    this.local = e.length ? e : ut, this.children = t.length ? t : ut;
  }
  /**
  Create a set of decorations, using the structure of the given
  document. This will consume (modify) the `decorations` array, so
  you must make a copy if you want need to preserve that.
  */
  static create(e, t) {
    return t.length ? Sn(t, e, 0, Xe) : H;
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
    return this == H || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || Xe);
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
    return this.children.length ? yu(this.children, i || [], e, t, r, o, s) : i ? new B(i.sort(et), ut) : H;
  }
  /**
  Add the given array of decorations to the ones in the set,
  producing a new set. Consumes the `decorations` array. Needs
  access to the current document to create the appropriate tree
  structure.
  */
  add(e, t) {
    return t.length ? this == H ? B.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let o, s = 0;
    e.forEach((l, c) => {
      let a = c + r, u;
      if (u = El(t, l, a)) {
        for (o || (o = this.children.slice()); s < o.length && o[s] < c; )
          s += 3;
        o[s] == c ? o[s + 2] = o[s + 2].addInner(l, u, a + 1) : o.splice(s, 0, c, c + l.nodeSize, Sn(u, l, a + 1, Xe)), s += 3;
      }
    });
    let i = Dl(s ? Al(t) : t, -r);
    for (let l = 0; l < i.length; l++)
      i[l].type.valid(e, i[l]) || i.splice(l--, 1);
    return new B(i.length ? this.local.concat(i).sort(et) : this.local, o || this.children);
  }
  /**
  Create a new set that contains the decorations in this set, minus
  the ones in the given array.
  */
  remove(e) {
    return e.length == 0 || this == H ? this : this.removeInner(e, 0);
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
      a != H ? r[s + 2] = a : (r.splice(s, 3), s -= 3);
    }
    if (o.length) {
      for (let s = 0, i; s < e.length; s++)
        if (i = e[s])
          for (let l = 0; l < o.length; l++)
            o[l].eq(i, t) && (o == this.local && (o = this.local.slice()), o.splice(l--, 1));
    }
    return r == this.children && o == this.local ? this : o.length || r.length ? new B(o, r) : H;
  }
  /**
  @internal
  */
  forChild(e, t) {
    if (this == H)
      return this;
    if (t.isLeaf)
      return B.empty;
    let r, o;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let s = e + 1, i = s + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let c = this.local[l];
      if (c.from < i && c.to > s && c.type instanceof Be) {
        let a = Math.max(s, c.from) - s, u = Math.min(i, c.to) - s;
        a < u && (o || (o = [])).push(c.copy(a, u));
      }
    }
    if (o) {
      let l = new B(o.sort(et), ut);
      return r ? new Ne([l, r]) : l;
    }
    return r || H;
  }
  /**
  @internal
  */
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof B) || this.local.length != e.local.length || this.children.length != e.children.length)
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
    return ao(this.localsInner(e));
  }
  /**
  @internal
  */
  localsInner(e) {
    if (this == H)
      return ut;
    if (e.inlineContent || !this.local.some(Be.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof Be || t.push(this.local[r]);
    return t;
  }
}
B.empty = new B([], []);
B.removeOverlap = ao;
const H = B.empty;
class Ne {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((o) => o.map(e, t, Xe));
    return Ne.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return B.empty;
    let r = [];
    for (let o = 0; o < this.members.length; o++) {
      let s = this.members[o].forChild(e, t);
      s != H && (s instanceof Ne ? r = r.concat(s.members) : r.push(s));
    }
    return Ne.from(r);
  }
  eq(e) {
    if (!(e instanceof Ne) || e.members.length != this.members.length)
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
    return t ? ao(r ? t : t.sort(et)) : ut;
  }
  // Create a group for the given array of decoration sets, or return
  // a single set when possible.
  static from(e) {
    switch (e.length) {
      case 0:
        return H;
      case 1:
        return e[0];
      default:
        return new Ne(e.every((t) => t instanceof B) ? e : e.reduce((t, r) => t.concat(r instanceof B ? r : r.members), []));
    }
  }
}
function yu(n, e, t, r, o, s, i) {
  let l = n.slice();
  for (let a = 0, u = s; a < t.maps.length; a++) {
    let f = 0;
    t.maps[a].forEach((h, p, d, m) => {
      let g = m - d - (p - h);
      for (let b = 0; b < l.length; b += 3) {
        let y = l[b + 1];
        if (y < 0 || h > y + u - f)
          continue;
        let S = l[b] + u - f;
        p >= S ? l[b + 1] = h <= S ? -2 : -1 : h >= u && g && (l[b] += g, l[b + 1] += g);
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
      let h = t.map(n[a + 1] + s, -1), p = h - o, { index: d, offset: m } = r.content.findIndex(f), g = r.maybeChild(d);
      if (g && m == f && m + g.nodeSize == p) {
        let b = l[a + 2].mapInner(t, g, u + 1, n[a] + s + 1, i);
        b != H ? (l[a] = f, l[a + 1] = p, l[a + 2] = b) : (l[a + 1] = -2, c = !0);
      } else
        c = !0;
    }
  if (c) {
    let a = xu(l, n, e, t, o, s, i), u = Sn(a, r, 0, i);
    e = u.local;
    for (let f = 0; f < l.length; f += 3)
      l[f + 1] < 0 && (l.splice(f, 3), f -= 3);
    for (let f = 0, h = 0; f < u.children.length; f += 3) {
      let p = u.children[f];
      for (; h < l.length && l[h] < p; )
        h += 3;
      l.splice(h, 0, u.children[f], u.children[f + 1], u.children[f + 2]);
    }
  }
  return new B(e.sort(et), l);
}
function Dl(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let o = n[r];
    t.push(new le(o.from + e, o.to + e, o.type));
  }
  return t;
}
function xu(n, e, t, r, o, s, i) {
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
function El(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, o = null;
  for (let s = 0, i; s < n.length; s++)
    (i = n[s]) && i.from > t && i.to < r && ((o || (o = [])).push(i), n[s] = null);
  return o;
}
function Al(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function Sn(n, e, t, r) {
  let o = [], s = !1;
  e.forEach((l, c) => {
    let a = El(n, l, c + t);
    if (a) {
      s = !0;
      let u = Sn(a, l, t + c + 1, r);
      u != H && o.push(c, c + l.nodeSize, u);
    }
  });
  let i = Dl(s ? Al(n) : n, -t).sort(et);
  for (let l = 0; l < i.length; l++)
    i[l].type.valid(e, i[l]) || (r.onRemove && r.onRemove(i[l].spec), i.splice(l--, 1));
  return i.length || o.length ? new B(i, o) : H;
}
function et(n, e) {
  return n.from - e.from || n.to - e.to;
}
function ao(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let o = t + 1; o < e.length; o++) {
        let s = e[o];
        if (s.from == r.from) {
          s.to != r.to && (e == n && (e = n.slice()), e[o] = s.copy(s.from, r.to), ds(e, o + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, s.from), ds(e, o, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function ds(n, e, t) {
  for (; e < n.length && et(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function or(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != H && e.push(r);
  }), n.cursorWrapper && e.push(B.create(n.state.doc, [n.cursorWrapper.deco])), Ne.from(e);
}
const wu = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, Cu = ee && ze <= 11;
class vu {
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
class Su {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new vu(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let o = 0; o < r.length; o++)
        this.queue.push(r[o]);
      ee && ze <= 11 && r.some((o) => o.type == "childList" && o.removedNodes.length || o.type == "characterData" && o.oldValue.length > o.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), Cu && (this.onCharData = (r) => {
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
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, wu)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
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
    if (is(this.view)) {
      if (this.suppressingSelectionUpdates)
        return De(this.view);
      if (ee && ze <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && nt(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
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
    for (let s = e.focusNode; s; s = $t(s))
      t.add(s);
    for (let s = e.anchorNode; s; s = $t(s))
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
    let r = e.domSelectionRange(), o = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && is(e) && !this.ignoreSelectionChange(r), s = -1, i = -1, l = !1, c = [];
    if (e.editable)
      for (let u = 0; u < t.length; u++) {
        let f = this.registerMutation(t[u], c);
        f && (s = s < 0 ? f.from : Math.min(f.from, s), i = i < 0 ? f.to : Math.max(f.to, i), f.typeOver && (l = !0));
      }
    if (he && c.length > 1) {
      let u = c.filter((f) => f.nodeName == "BR");
      if (u.length == 2) {
        let f = u[0], h = u[1];
        f.parentNode && f.parentNode.parentNode == h.parentNode ? h.remove() : f.remove();
      }
    }
    let a = null;
    s < 0 && o && e.input.lastFocus > Date.now() - 200 && Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 && Nn(r) && (a = ro(e)) && a.eq(T.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, De(e), this.currentSelection.set(r), e.scrollToSelection()) : (s > -1 || o) && (s > -1 && (e.docView.markDirty(s, i), _u(e)), this.handleDOMChange(s, i, l, c), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || De(e), this.currentSelection.set(r));
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
      if (ee && ze <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: f, nextSibling: h } = e.addedNodes[u];
          (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (o = f), (!h || Array.prototype.indexOf.call(e.addedNodes, h) < 0) && (s = h);
        }
      let i = o && o.parentNode == e.target ? K(o) + 1 : 0, l = r.localPosFromDOM(e.target, i, -1), c = s && s.parentNode == e.target ? K(s) : e.target.childNodes.length, a = r.localPosFromDOM(e.target, c, 1);
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
let ms = /* @__PURE__ */ new WeakMap(), gs = !1;
function _u(n) {
  if (!ms.has(n) && (ms.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = he, gs)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), gs = !0;
  }
}
function Du(n) {
  let e;
  function t(c) {
    c.preventDefault(), c.stopImmediatePropagation(), e = c.getTargetRanges()[0];
  }
  n.dom.addEventListener("beforeinput", t, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", t, !0);
  let r = e.startContainer, o = e.startOffset, s = e.endContainer, i = e.endOffset, l = n.domAtPos(n.state.selection.anchor);
  return nt(l.node, l.offset, s, i) && ([r, o, s, i] = [s, i, r, o]), { anchorNode: r, anchorOffset: o, focusNode: s, focusOffset: i };
}
function Eu(n, e, t) {
  let { node: r, fromOffset: o, toOffset: s, from: i, to: l } = n.docView.parseRange(e, t), c = n.domSelectionRange(), a, u = c.anchorNode;
  if (u && n.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (a = [{ node: u, offset: c.anchorOffset }], Nn(c) || a.push({ node: c.focusNode, offset: c.focusOffset })), W && n.input.lastKeyCode === 8)
    for (let g = s; g > o; g--) {
      let b = r.childNodes[g - 1], y = b.pmViewDesc;
      if (b.nodeName == "BR" && !y) {
        s = g;
        break;
      }
      if (!y || y.size)
        break;
    }
  let f = n.state.doc, h = n.someProp("domParser") || gt.fromSchema(n.state.schema), p = f.resolve(i), d = null, m = h.parse(r, {
    topNode: p.parent,
    topMatch: p.parent.contentMatchAt(p.index()),
    topOpen: !0,
    from: o,
    to: s,
    preserveWhitespace: p.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: a,
    ruleFromNode: Au,
    context: p
  });
  if (a && a[0].pos != null) {
    let g = a[0].pos, b = a[1] && a[1].pos;
    b == null && (b = g), d = { anchor: g + i, head: b + i };
  }
  return { doc: m, sel: d, from: i, to: l };
}
function Au(n) {
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
const Mu = /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Tu(n, e, t, r, o) {
  let s = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (n.input.compositionPendingChanges = 0, e < 0) {
    let D = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, M = ro(n, D);
    if (M && !n.state.selection.eq(M)) {
      if (W && ue && n.input.lastKeyCode === 13 && Date.now() - 100 < n.input.lastKeyCodeTime && n.someProp("handleKeyDown", (Ee) => Ee(n, We(13, "Enter"))))
        return;
      let G = n.state.tr.setSelection(M);
      D == "pointer" ? G.setMeta("pointer", !0) : D == "key" && G.scrollIntoView(), s && G.setMeta("composition", s), n.dispatch(G);
    }
    return;
  }
  let i = n.state.doc.resolve(e), l = i.sharedDepth(t);
  e = i.before(l + 1), t = n.state.doc.resolve(t).after(l + 1);
  let c = n.state.selection, a = Eu(n, e, t), u = n.state.doc, f = u.slice(a.from, a.to), h, p;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (h = n.state.selection.to, p = "end") : (h = n.state.selection.from, p = "start"), n.input.lastKeyCode = null;
  let d = qu(f.content, a.doc.content, a.from, h, p);
  if ((yt && n.input.lastIOSEnter > Date.now() - 225 || ue) && o.some((D) => D.nodeType == 1 && !Mu.test(D.nodeName)) && (!d || d.endA >= d.endB) && n.someProp("handleKeyDown", (D) => D(n, We(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!d)
    if (r && c instanceof I && !c.empty && c.$head.sameParent(c.$anchor) && !n.composing && !(a.sel && a.sel.anchor != a.sel.head))
      d = { start: c.from, endA: c.to, endB: c.to };
    else {
      if (a.sel) {
        let D = bs(n, n.state.doc, a.sel);
        if (D && !D.eq(n.state.selection)) {
          let M = n.state.tr.setSelection(D);
          s && M.setMeta("composition", s), n.dispatch(M);
        }
      }
      return;
    }
  if (W && n.cursorWrapper && a.sel && a.sel.anchor == n.cursorWrapper.deco.from && a.sel.head == a.sel.anchor) {
    let D = d.endB - d.start;
    a.sel = { anchor: a.sel.anchor + D, head: a.sel.anchor + D };
  }
  n.input.domChangeCount++, n.state.selection.from < n.state.selection.to && d.start == d.endB && n.state.selection instanceof I && (d.start > n.state.selection.from && d.start <= n.state.selection.from + 2 && n.state.selection.from >= a.from ? d.start = n.state.selection.from : d.endA < n.state.selection.to && d.endA >= n.state.selection.to - 2 && n.state.selection.to <= a.to && (d.endB += n.state.selection.to - d.endA, d.endA = n.state.selection.to)), ee && ze <= 11 && d.endB == d.start + 1 && d.endA == d.start && d.start > a.from && a.doc.textBetween(d.start - a.from - 1, d.start - a.from + 1) == "  " && (d.start--, d.endA--, d.endB--);
  let m = a.doc.resolveNoCache(d.start - a.from), g = a.doc.resolveNoCache(d.endB - a.from), b = u.resolve(d.start), y = m.sameParent(g) && m.parent.inlineContent && b.end() >= d.endA, S;
  if ((yt && n.input.lastIOSEnter > Date.now() - 225 && (!y || o.some((D) => D.nodeName == "DIV" || D.nodeName == "P")) || !y && m.pos < a.doc.content.size && !m.sameParent(g) && (S = T.findFrom(a.doc.resolve(m.pos + 1), 1, !0)) && S.head == g.pos) && n.someProp("handleKeyDown", (D) => D(n, We(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > d.start && Nu(u, d.start, d.endA, m, g) && n.someProp("handleKeyDown", (D) => D(n, We(8, "Backspace")))) {
    ue && W && n.domObserver.suppressSelectionUpdates();
    return;
  }
  W && ue && d.endB == d.start && (n.input.lastAndroidDelete = Date.now()), ue && !y && m.start() != g.start() && g.parentOffset == 0 && m.depth == g.depth && a.sel && a.sel.anchor == a.sel.head && a.sel.head == d.endA && (d.endB -= 2, g = a.doc.resolveNoCache(d.endB - a.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(D) {
      return D(n, We(13, "Enter"));
    });
  }, 20));
  let E = d.start, A = d.endA, x, N, F;
  if (y) {
    if (m.pos == g.pos)
      ee && ze <= 11 && m.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => De(n), 20)), x = n.state.tr.delete(E, A), N = u.resolve(d.start).marksAcross(u.resolve(d.endA));
    else if (
      // Adding or removing a mark
      d.endA == d.endB && (F = Ou(m.parent.content.cut(m.parentOffset, g.parentOffset), b.parent.content.cut(b.parentOffset, d.endA - b.start())))
    )
      x = n.state.tr, F.type == "add" ? x.addMark(E, A, F.mark) : x.removeMark(E, A, F.mark);
    else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let D = m.parent.textBetween(m.parentOffset, g.parentOffset);
      if (n.someProp("handleTextInput", (M) => M(n, E, A, D)))
        return;
      x = n.state.tr.insertText(D, E, A);
    }
  }
  if (x || (x = n.state.tr.replace(E, A, a.doc.slice(d.start - a.from, d.endB - a.from))), a.sel) {
    let D = bs(n, x.doc, a.sel);
    D && !(W && ue && n.composing && D.empty && (d.start != d.endB || n.input.lastAndroidDelete < Date.now() - 100) && (D.head == E || D.head == x.mapping.map(A) - 1) || ee && D.empty && D.head == E) && x.setSelection(D);
  }
  N && x.ensureMarks(N), s && x.setMeta("composition", s), n.dispatch(x.scrollIntoView());
}
function bs(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : oo(n, e.resolve(t.anchor), e.resolve(t.head));
}
function Ou(n, e) {
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
  if (k.from(a).eq(n))
    return { mark: l, type: i };
}
function Nu(n, e, t, r, o) {
  if (!r.parent.isTextblock || // The content must have shrunk
  t - e <= o.pos - r.pos || // newEnd must point directly at or after the end of the block that newStart points into
  sr(r, !0, !1) < o.pos)
    return !1;
  let s = n.resolve(e);
  if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
    return !1;
  let i = n.resolve(sr(s, !0, !0));
  return !i.parent.isTextblock || i.pos > t || sr(i, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(i.parent.content);
}
function sr(n, e, t) {
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
function qu(n, e, t, r, o) {
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
    s -= c, s && s < e.size && ks(e.textBetween(s - 1, s + 1)) && (s += c ? 1 : -1), l = s + (l - i), i = s;
  } else if (l < s) {
    let c = r <= s && r >= l ? s - r : 0;
    s -= c, s && s < n.size && ks(n.textBetween(s - 1, s + 1)) && (s += c ? 1 : -1), i = s + (i - l), l = s;
  }
  return { start: s, endA: i, endB: l };
}
function ks(n) {
  if (n.length != 2)
    return !1;
  let e = n.charCodeAt(0), t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
class Ru {
  /**
  Create a view. `place` may be a DOM node that the editor should
  be appended to, a function that will place it into the document,
  or an object whose `mount` property holds the node to use as the
  document container. If it is `null`, the editor will not be
  added to the document.
  */
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new tu(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(vs), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = ws(this), xs(this), this.nodeViews = Cs(this), this.docView = Xo(this.state.doc, ys(this), or(this), this.dom, this), this.domObserver = new Su(this, (r, o, s, i) => Tu(this, r, o, s, i)), this.domObserver.start(), nu(this), this.updatePluginViews();
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
    e.handleDOMEvents != this._props.handleDOMEvents && Pr(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(vs), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
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
      let p = Cs(this);
      Fu(p, this.nodeViews) && (this.nodeViews = p, s = !0);
    }
    (l || t.handleDOMEvents != this._props.handleDOMEvents) && Pr(this), this.editable = ws(this), xs(this);
    let c = or(this), a = ys(this), u = o.plugins != e.plugins && !o.doc.eq(e.doc) ? "reset" : e.scrollToSelection > o.scrollToSelection ? "to selection" : "preserve", f = s || !this.docView.matchesNode(e.doc, a, c);
    (f || !e.selection.eq(o.selection)) && (i = !0);
    let h = u == "preserve" && i && this.dom.style.overflowAnchor == null && ga(this);
    if (i) {
      this.domObserver.stop();
      let p = f && (ee || W) && !this.composing && !o.selection.empty && !e.selection.empty && Iu(o.selection, e.selection);
      if (f) {
        let d = W ? this.trackWrites = this.domSelectionRange().focusNode : null;
        (s || !this.docView.update(e.doc, a, c, this)) && (this.docView.updateOuterDeco([]), this.docView.destroy(), this.docView = Xo(e.doc, a, c, this.dom, this)), d && !this.trackWrites && (p = !0);
      }
      p || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && Va(this)) ? De(this, p) : (al(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(o), !((r = this.dragging) === null || r === void 0) && r.node && !o.doc.eq(e.doc) && this.updateDraggedNode(this.dragging, o), u == "reset" ? this.dom.scrollTop = 0 : u == "to selection" ? this.scrollToSelection() : h && ba(h);
  }
  /**
  @internal
  */
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!this.someProp("handleScrollToSelection", (t) => t(this)))
      if (this.state.selection instanceof _) {
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
    this.dragging = new Sl(e.slice, e.move, o < 0 ? void 0 : _.create(this.state.doc, o));
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
    if (ee) {
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
    this.domObserver.stop(), this.editable && ka(this.dom), De(this), this.domObserver.start();
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
    return va(this, e);
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
    return tl(this, e, t);
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
    return Aa(this, t || this.state, e);
  }
  /**
  Run the editor's paste logic with the given HTML string. The
  `event`, if given, will be passed to the
  [`handlePaste`](https://prosemirror.net/docs/ref/#view.EditorProps.handlePaste) hook.
  */
  pasteHTML(e, t) {
    return Ht(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  /**
  Run the editor's paste logic with the given plain-text input.
  */
  pasteText(e, t) {
    return Ht(this, e, null, !0, t || new ClipboardEvent("paste"));
  }
  /**
  Removes the editor from the DOM and destroys all [node
  views](https://prosemirror.net/docs/ref/#view.NodeView).
  */
  destroy() {
    this.docView && (ru(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], or(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null);
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
    return su(this, e);
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
    return Z && this.root.nodeType === 11 && aa(this.dom.ownerDocument) == this.dom ? Du(this) : this.domSelection();
  }
  /**
  @internal
  */
  domSelection() {
    return this.root.getSelection();
  }
}
function ys(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" ? e.class += " " + t[r] : r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), e.translate || (e.translate = "no"), [le.node(0, n.state.doc.content.size, e)];
}
function xs(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: le.widget(n.state.selection.head, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function ws(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function Iu(n, e) {
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
function Fu(n, e) {
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
function vs(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
function re() {
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
    Ml(n, arguments[e]);
  return n;
}
function Ml(n, e) {
  if (typeof e == "string")
    n.appendChild(document.createTextNode(e));
  else if (e != null)
    if (e.nodeType != null)
      n.appendChild(e);
    else if (Array.isArray(e))
      for (var t = 0; t < e.length; t++)
        Ml(n, e[t]);
    else
      throw new RangeError("Unsupported child node: " + e);
}
const Tl = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function zu(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const Lu = (n, e, t) => {
  let r = zu(n, t);
  if (!r)
    return !1;
  let o = Ol(r);
  if (!o) {
    let i = r.blockRange(), l = i && Kt(i);
    return l == null ? !1 : (e && e(n.tr.lift(i, l).scrollIntoView()), !0);
  }
  let s = o.nodeBefore;
  if (!s.type.spec.isolating && Rl(n, o, e))
    return !0;
  if (r.parent.content.size == 0 && (xt(s, "end") || _.isSelectable(s))) {
    let i = Xr(n.doc, r.before(), r.after(), C.empty);
    if (i && i.slice.size < i.to - i.from) {
      if (e) {
        let l = n.tr.step(i);
        l.setSelection(xt(s, "end") ? T.findFrom(l.doc.resolve(l.mapping.map(o.pos, -1)), -1) : _.create(l.doc, o.pos - s.nodeSize)), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && o.depth == r.depth - 1 ? (e && e(n.tr.delete(o.pos - s.nodeSize, o.pos).scrollIntoView()), !0) : !1;
};
function xt(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Bu = (n, e, t) => {
  let { $head: r, empty: o } = n.selection, s = r;
  if (!o)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    s = Ol(r);
  }
  let i = s && s.nodeBefore;
  return !i || !_.isSelectable(i) ? !1 : (e && e(n.tr.setSelection(_.create(n.doc, s.pos - i.nodeSize)).scrollIntoView()), !0);
};
function Ol(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Pu(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Vu = (n, e, t) => {
  let r = Pu(n, t);
  if (!r)
    return !1;
  let o = Nl(r);
  if (!o)
    return !1;
  let s = o.nodeAfter;
  if (Rl(n, o, e))
    return !0;
  if (r.parent.content.size == 0 && (xt(s, "start") || _.isSelectable(s))) {
    let i = Xr(n.doc, r.before(), r.after(), C.empty);
    if (i && i.slice.size < i.to - i.from) {
      if (e) {
        let l = n.tr.step(i);
        l.setSelection(xt(s, "start") ? T.findFrom(l.doc.resolve(l.mapping.map(o.pos)), 1) : _.create(l.doc, l.mapping.map(o.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && o.depth == r.depth - 1 ? (e && e(n.tr.delete(o.pos, o.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, $u = (n, e, t) => {
  let { $head: r, empty: o } = n.selection, s = r;
  if (!o)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    s = Nl(r);
  }
  let i = s && s.nodeAfter;
  return !i || !_.isSelectable(i) ? !1 : (e && e(n.tr.setSelection(_.create(n.doc, s.pos)).scrollIntoView()), !0);
};
function Nl(n) {
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
const Vr = (n, e) => {
  let t = n.selection, r = t instanceof _, o;
  if (r) {
    if (t.node.isTextblock || !wt(n.doc, t.from))
      return !1;
    o = t.from;
  } else if (o = Vi(n.doc, t.from, -1), o == null)
    return !1;
  if (e) {
    let s = n.tr.join(o);
    r && s.setSelection(_.create(s.doc, o - n.doc.resolve(o).nodeBefore.nodeSize)), e(s.scrollIntoView());
  }
  return !0;
}, Uu = (n, e) => {
  let t = n.selection, r;
  if (t instanceof _) {
    if (t.node.isTextblock || !wt(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = Vi(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, $r = (n, e) => {
  let { $from: t, $to: r } = n.selection, o = t.blockRange(r), s = o && Kt(o);
  return s == null ? !1 : (e && e(n.tr.lift(o, s).scrollIntoView()), !0);
}, Hu = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function uo(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const ql = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let o = t.node(-1), s = t.indexAfter(-1), i = uo(o.contentMatchAt(s));
  if (!i || !o.canReplaceWith(s, s, i))
    return !1;
  if (e) {
    let l = t.after(), c = n.tr.replaceWith(l, l, i.createAndFill());
    c.setSelection(T.near(c.doc.resolve(l), 1)), e(c.scrollIntoView());
  }
  return !0;
}, ju = (n, e) => {
  let t = n.selection, { $from: r, $to: o } = t;
  if (t instanceof ne || r.parent.inlineContent || o.parent.inlineContent)
    return !1;
  let s = uo(o.parent.contentMatchAt(o.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let i = (!r.parentOffset && o.index() < o.parent.childCount ? r : o).pos, l = n.tr.insert(i, s.createAndFill());
    l.setSelection(I.create(l.doc, i + 1)), e(l.scrollIntoView());
  }
  return !0;
}, Wu = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let s = t.before();
    if (pt(n.doc, s))
      return e && e(n.tr.split(s).scrollIntoView()), !0;
  }
  let r = t.blockRange(), o = r && Kt(r);
  return o == null ? !1 : (e && e(n.tr.lift(r, o).scrollIntoView()), !0);
};
function Ju(n) {
  return (e, t) => {
    let { $from: r, $to: o } = e.selection;
    if (e.selection instanceof _ && e.selection.node.isBlock)
      return !r.parentOffset || !pt(e.doc, r.pos) ? !1 : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
    if (!r.parent.isBlock)
      return !1;
    if (t) {
      let s = o.parentOffset == o.parent.content.size, i = e.tr;
      (e.selection instanceof I || e.selection instanceof ne) && i.deleteSelection();
      let l = r.depth == 0 ? null : uo(r.node(-1).contentMatchAt(r.indexAfter(-1))), c = n && n(o.parent, s), a = c ? [c] : s && l ? [{ type: l }] : void 0, u = pt(i.doc, i.mapping.map(r.pos), 1, a);
      if (!a && !u && pt(i.doc, i.mapping.map(r.pos), 1, l ? [{ type: l }] : void 0) && (l && (a = [{ type: l }]), u = !0), u && (i.split(i.mapping.map(r.pos), 1, a), !s && !r.parentOffset && r.parent.type != l)) {
        let f = i.mapping.map(r.before()), h = i.doc.resolve(f);
        l && r.node(-1).canReplaceWith(h.index(), h.index() + 1, l) && i.setNodeMarkup(i.mapping.map(r.before()), l);
      }
      t(i.scrollIntoView());
    }
    return !0;
  };
}
const Gu = Ju(), Ur = (n, e) => {
  let { $from: t, to: r } = n.selection, o, s = t.sharedDepth(r);
  return s == 0 ? !1 : (o = t.before(s), e && e(n.tr.setSelection(_.create(n.doc, o))), !0);
}, Ku = (n, e) => (e && e(n.tr.setSelection(new ne(n.doc))), !0);
function Zu(n, e, t) {
  let r = e.nodeBefore, o = e.nodeAfter, s = e.index();
  return !r || !o || !r.type.compatibleContent(o.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(o.isTextblock || wt(n.doc, e.pos)) ? !1 : (t && t(n.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function Rl(n, e, t) {
  let r = e.nodeBefore, o = e.nodeAfter, s, i;
  if (r.type.spec.isolating || o.type.spec.isolating)
    return !1;
  if (Zu(n, e, t))
    return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (l && (s = (i = r.contentMatchAt(r.childCount)).findWrapping(o.type)) && i.matchType(s[0] || o.type).validEnd) {
    if (t) {
      let f = e.pos + o.nodeSize, h = k.empty;
      for (let m = s.length - 1; m >= 0; m--)
        h = k.from(s[m].create(null, h));
      h = k.from(r.copy(h));
      let p = n.tr.step(new U(e.pos - 1, f, e.pos, f, new C(h, 1, 0), s.length, !0)), d = f + 2 * s.length;
      wt(p.doc, d) && p.join(d), t(p.scrollIntoView());
    }
    return !0;
  }
  let c = T.findFrom(e, 1), a = c && c.$from.blockRange(c.$to), u = a && Kt(a);
  if (u != null && u >= e.depth)
    return t && t(n.tr.lift(a, u).scrollIntoView()), !0;
  if (l && xt(o, "start", !0) && xt(r, "end")) {
    let f = r, h = [];
    for (; h.push(f), !f.isTextblock; )
      f = f.lastChild;
    let p = o, d = 1;
    for (; !p.isTextblock; p = p.firstChild)
      d++;
    if (f.canReplace(f.childCount, f.childCount, p.content)) {
      if (t) {
        let m = k.empty;
        for (let b = h.length - 1; b >= 0; b--)
          m = k.from(h[b].copy(m));
        let g = n.tr.step(new U(e.pos - h.length, e.pos + o.nodeSize, e.pos + d, e.pos + o.nodeSize - d, new C(m, h.length, 0), 0, !0));
        t(g.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Il(n) {
  return function(e, t) {
    let r = e.selection, o = n < 0 ? r.$from : r.$to, s = o.depth;
    for (; o.node(s).isInline; ) {
      if (!s)
        return !1;
      s--;
    }
    return o.node(s).isTextblock ? (t && t(e.tr.setSelection(I.create(e.doc, n < 0 ? o.start(s) : o.end(s)))), !0) : !1;
  };
}
const Yu = Il(-1), Qu = Il(1);
function Hr(n, e = null) {
  return function(t, r) {
    let { $from: o, $to: s } = t.selection, i = o.blockRange(s), l = i && Qr(i, n, e);
    return l ? (r && r(t.tr.wrap(i, l).scrollIntoView()), !0) : !1;
  };
}
function hn(n, e = null) {
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
function Xu(n, e, t) {
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
function qe(n, e = null) {
  return function(t, r) {
    let { empty: o, $cursor: s, ranges: i } = t.selection;
    if (o && !s || !Xu(t.doc, i, n))
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
            let h = u.pos, p = f.pos, d = u.nodeAfter, m = f.nodeBefore, g = d && d.isText ? /^\s*/.exec(d.text)[0].length : 0, b = m && m.isText ? /\s*$/.exec(m.text)[0].length : 0;
            h + g < p && (h += g, p -= b), c.addMark(h, p, n.create(e));
          }
        }
        r(c.scrollIntoView());
      }
    return !0;
  };
}
function In(...n) {
  return function(e, t, r) {
    for (let o = 0; o < n.length; o++)
      if (n[o](e, t, r))
        return !0;
    return !1;
  };
}
let ir = In(Tl, Lu, Bu), Ss = In(Tl, Vu, $u);
const Se = {
  Enter: In(Hu, ju, Wu, Gu),
  "Mod-Enter": ql,
  Backspace: ir,
  "Mod-Backspace": ir,
  "Shift-Backspace": ir,
  Delete: Ss,
  "Mod-Delete": Ss,
  "Mod-a": Ku
}, Fl = {
  "Ctrl-h": Se.Backspace,
  "Alt-Backspace": Se["Mod-Backspace"],
  "Ctrl-d": Se.Delete,
  "Ctrl-Alt-Backspace": Se["Mod-Delete"],
  "Alt-Delete": Se["Mod-Delete"],
  "Alt-d": Se["Mod-Delete"],
  "Ctrl-a": Yu,
  "Ctrl-e": Qu
};
for (let n in Se)
  Fl[n] = Se[n];
const ef = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform ? os.platform() == "darwin" : !1, tf = ef ? Fl : Se;
var _n = 200, P = function() {
};
P.prototype.append = function(e) {
  return e.length ? (e = P.from(e), !this.length && e || e.length < _n && this.leafAppend(e) || this.length < _n && e.leafPrepend(this) || this.appendInner(e)) : this;
};
P.prototype.prepend = function(e) {
  return e.length ? P.from(e).append(this) : this;
};
P.prototype.appendInner = function(e) {
  return new nf(this, e);
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
  return e instanceof P ? e : e && e.length ? new zl(e) : P.empty;
};
var zl = /* @__PURE__ */ function(n) {
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
    if (this.length + o.length <= _n)
      return new e(this.values.concat(o.flatten()));
  }, e.prototype.leafPrepend = function(o) {
    if (this.length + o.length <= _n)
      return new e(o.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
}(P);
P.empty = new zl([]);
var nf = /* @__PURE__ */ function(n) {
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
const rf = 500;
class fe {
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
        u.push(new me(f.map));
        let p = f.step.map(o.slice(s)), d;
        p && i.maybeStep(p).doc && (d = i.mapping.maps[i.mapping.maps.length - 1], a.push(new me(d, void 0, void 0, a.length + u.length))), s--, d && o.appendMap(d, s);
      } else
        i.maybeStep(f.step);
      if (f.selection)
        return l = o ? f.selection.map(o.slice(s)) : f.selection, c = new fe(this.items.slice(0, r).append(u.reverse().concat(a)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: c, transform: i, selection: l };
  }
  // Create a new branch with the given transform added.
  addTransform(e, t, r, o) {
    let s = [], i = this.eventCount, l = this.items, c = !o && l.length ? l.get(l.length - 1) : null;
    for (let u = 0; u < e.steps.length; u++) {
      let f = e.steps[u].invert(e.docs[u]), h = new me(e.mapping.maps[u], f, t), p;
      (p = c && c.merge(h)) && (h = p, u ? s.pop() : l = l.slice(0, l.length - 1)), s.push(h), t && (i++, t = void 0), o || (c = h);
    }
    let a = i - r.depth;
    return a > sf && (l = of(l, a), i -= a), new fe(l.append(s), i);
  }
  remapping(e, t) {
    let r = new ht();
    return this.items.forEach((o, s) => {
      let i = o.mirrorOffset != null && s - o.mirrorOffset >= e ? r.maps.length - o.mirrorOffset : void 0;
      r.appendMap(o.map, i);
    }, e, t), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new fe(this.items.append(e.map((t) => new me(t))), this.eventCount);
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
      let p = s.getMirror(--c);
      if (p == null)
        return;
      i = Math.min(i, p);
      let d = s.maps[p];
      if (h.step) {
        let m = e.steps[p].invert(e.docs[p]), g = h.selection && h.selection.map(s.slice(c + 1, p));
        g && l++, r.push(new me(d, m, g));
      } else
        r.push(new me(d));
    }, o);
    let a = [];
    for (let h = t; h < i; h++)
      a.push(new me(s.maps[h]));
    let u = this.items.slice(0, o).append(a).append(r), f = new fe(u, l);
    return f.emptyItemCount() > rf && (f = f.compress(this.items.length - r.length)), f;
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
          let f = new me(a.invert(), c, u), h, p = o.length - 1;
          (h = o.length && o[p].merge(f)) ? o[p] = h : o.push(f);
        }
      } else
        i.map && r--;
    }, this.items.length, 0), new fe(P.from(o.reverse()), s);
  }
}
fe.empty = new fe(P.empty, 0);
function of(n, e) {
  let t;
  return n.forEach((r, o) => {
    if (r.selection && e-- == 0)
      return t = o, !1;
  }), n.slice(t);
}
class me {
  constructor(e, t, r, o) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = o;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t)
        return new me(t.getMap().invert(), t, this.selection);
    }
  }
}
class Oe {
  constructor(e, t, r, o, s) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = o, this.prevComposition = s;
  }
}
const sf = 20;
function lf(n, e, t, r) {
  let o = t.getMeta(Pe), s;
  if (o)
    return o.historyState;
  t.getMeta(af) && (n = new Oe(n.done, n.undone, null, 0, -1));
  let i = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (i && i.getMeta(Pe))
    return i.getMeta(Pe).redo ? new Oe(n.done.addTransform(t, void 0, r, pn(e)), n.undone, _s(t.mapping.maps[t.steps.length - 1]), n.prevTime, n.prevComposition) : new Oe(n.done, n.undone.addTransform(t, void 0, r, pn(e)), null, n.prevTime, n.prevComposition);
  if (t.getMeta("addToHistory") !== !1 && !(i && i.getMeta("addToHistory") === !1)) {
    let l = t.getMeta("composition"), c = n.prevTime == 0 || !i && n.prevComposition != l && (n.prevTime < (t.time || 0) - r.newGroupDelay || !cf(t, n.prevRanges)), a = i ? lr(n.prevRanges, t.mapping) : _s(t.mapping.maps[t.steps.length - 1]);
    return new Oe(n.done.addTransform(t, c ? e.selection.getBookmark() : void 0, r, pn(e)), fe.empty, a, t.time, l ?? n.prevComposition);
  } else
    return (s = t.getMeta("rebased")) ? new Oe(n.done.rebased(t, s), n.undone.rebased(t, s), lr(n.prevRanges, t.mapping), n.prevTime, n.prevComposition) : new Oe(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), lr(n.prevRanges, t.mapping), n.prevTime, n.prevComposition);
}
function cf(n, e) {
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
function _s(n) {
  let e = [];
  return n.forEach((t, r, o, s) => e.push(o, s)), e;
}
function lr(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let o = e.map(n[r], 1), s = e.map(n[r + 1], -1);
    o <= s && t.push(o, s);
  }
  return t;
}
function Ll(n, e, t, r) {
  let o = pn(e), s = Pe.get(e).spec.config, i = (r ? n.undone : n.done).popEvent(e, o);
  if (!i)
    return;
  let l = i.selection.resolve(i.transform.doc), c = (r ? n.done : n.undone).addTransform(i.transform, e.selection.getBookmark(), s, o), a = new Oe(r ? c : i.remaining, r ? i.remaining : c, null, 0, -1);
  t(i.transform.setSelection(l).setMeta(Pe, { redo: r, historyState: a }).scrollIntoView());
}
let cr = !1, Ds = null;
function pn(n) {
  let e = n.plugins;
  if (Ds != e) {
    cr = !1, Ds = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        cr = !0;
        break;
      }
  }
  return cr;
}
const Pe = new Ki("history"), af = new Ki("closeHistory");
function uf(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new $e({
    key: Pe,
    state: {
      init() {
        return new Oe(fe.empty, fe.empty, null, 0, -1);
      },
      apply(e, t, r) {
        return lf(t, r, e, n);
      }
    },
    config: n,
    props: {
      handleDOMEvents: {
        beforeinput(e, t) {
          let r = t.inputType, o = r == "historyUndo" ? Dn : r == "historyRedo" ? Wt : null;
          return o ? (t.preventDefault(), o(e.state, e.dispatch)) : !1;
        }
      }
    }
  });
}
const Dn = (n, e) => {
  let t = Pe.getState(n);
  return !t || t.done.eventCount == 0 ? !1 : (e && Ll(t, n, e, !1), !0);
}, Wt = (n, e) => {
  let t = Pe.getState(n);
  return !t || t.undone.eventCount == 0 ? !1 : (e && Ll(t, n, e, !0), !0);
}, It = "http://www.w3.org/2000/svg", ff = "http://www.w3.org/1999/xlink", jr = "ProseMirror-icon";
function hf(n) {
  let e = 0;
  for (let t = 0; t < n.length; t++)
    e = (e << 5) - e + n.charCodeAt(t) | 0;
  return e;
}
function pf(n, e) {
  let t = (n.nodeType == 9 ? n : n.ownerDocument) || document, r = t.createElement("div");
  if (r.className = jr, e.path) {
    let { path: o, width: s, height: i } = e, l = "pm-icon-" + hf(o).toString(16);
    t.getElementById(l) || df(n, l, e);
    let c = r.appendChild(t.createElementNS(It, "svg"));
    c.style.width = s / i + "em", c.appendChild(t.createElementNS(It, "use")).setAttributeNS(ff, "href", /([^#]*)/.exec(t.location.toString())[1] + "#" + l);
  } else if (e.dom)
    r.appendChild(e.dom.cloneNode(!0));
  else {
    let { text: o, css: s } = e;
    r.appendChild(t.createElement("span")).textContent = o || "", s && (r.firstChild.style.cssText = s);
  }
  return r;
}
function df(n, e, t) {
  let [r, o] = n.nodeType == 9 ? [n, n.body] : [n.ownerDocument || document, n], s = r.getElementById(jr + "-collection");
  s || (s = r.createElementNS(It, "svg"), s.id = jr + "-collection", s.style.display = "none", o.insertBefore(s, o.firstChild));
  let i = r.createElementNS(It, "symbol");
  i.id = e, i.setAttribute("viewBox", "0 0 " + t.width + " " + t.height), i.appendChild(r.createElementNS(It, "path")).setAttribute("d", t.path), s.appendChild(i);
}
const X = "ProseMirror-menu";
class pe {
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
    let t = this.spec, r = t.render ? t.render(e) : t.icon ? pf(e.root, t.icon) : t.label ? re("div", null, Jt(e, t.label)) : null;
    if (!r)
      throw new RangeError("MenuItem without icon or label property");
    if (t.title) {
      const s = typeof t.title == "function" ? t.title(e.state) : t.title;
      r.setAttribute("title", Jt(e, s));
    }
    t.class && r.classList.add(t.class), t.css && (r.style.cssText += t.css), r.addEventListener("mousedown", (s) => {
      s.preventDefault(), r.classList.contains(X + "-disabled") || t.run(e.state, e.dispatch, e, s);
    });
    function o(s) {
      if (t.select) {
        let l = t.select(s);
        if (r.style.display = l ? "" : "none", !l)
          return !1;
      }
      let i = !0;
      if (t.enable && (i = t.enable(s) || !1, Wr(r, X + "-disabled", !i)), t.active) {
        let l = i && t.active(s) || !1;
        Wr(r, X + "-active", l);
      }
      return !0;
    }
    return { dom: r, update: o };
  }
}
function Jt(n, e) {
  return n._props.translate ? n._props.translate(e) : e;
}
let Ft = { time: 0, node: null };
function Bl(n) {
  Ft.time = Date.now(), Ft.node = n.target;
}
function Pl(n) {
  return Date.now() - 100 < Ft.time && Ft.node && n.contains(Ft.node);
}
class Es {
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
    let t = Vl(this.content, e), r = e.dom.ownerDocument.defaultView || window, o = re("div", {
      class: X + "-dropdown " + (this.options.class || ""),
      style: this.options.css
    }, Jt(e, this.options.label || ""));
    this.options.title && o.setAttribute("title", Jt(e, this.options.title));
    let s = re("div", { class: X + "-dropdown-wrap" }, o), i = null, l = null, c = () => {
      i && i.close() && (i = null, r.removeEventListener("mousedown", l));
    };
    o.addEventListener("mousedown", (u) => {
      u.preventDefault(), Bl(u), i ? c() : (i = this.expand(s, t.dom), r.addEventListener("mousedown", l = () => {
        Pl(s) || c();
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
    let r = re("div", { class: X + "-dropdown-menu " + (this.options.class || "") }, t), o = !1;
    function s() {
      return o ? !1 : (o = !0, e.removeChild(r), !0);
    }
    return e.appendChild(r), { close: s, node: r };
  }
}
function Vl(n, e) {
  let t = [], r = [];
  for (let o = 0; o < n.length; o++) {
    let { dom: s, update: i } = n[o].render(e);
    t.push(re("div", { class: X + "-dropdown-item" }, s)), r.push(i);
  }
  return { dom: t, update: $l(r, t) };
}
function $l(n, e) {
  return (t) => {
    let r = !1;
    for (let o = 0; o < n.length; o++) {
      let s = n[o](t);
      e[o].style.display = s ? "" : "none", s && (r = !0);
    }
    return r;
  };
}
class mf {
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
    let t = Vl(this.content, e), r = e.dom.ownerDocument.defaultView || window, o = re("div", { class: X + "-submenu-label" }, Jt(e, this.options.label || "")), s = re("div", { class: X + "-submenu-wrap" }, o, re("div", { class: X + "-submenu" }, t.dom)), i = null;
    o.addEventListener("mousedown", (c) => {
      c.preventDefault(), Bl(c), Wr(s, X + "-submenu-wrap-active", !1), i || r.addEventListener("mousedown", i = () => {
        Pl(s) || (s.classList.remove(X + "-submenu-wrap-active"), r.removeEventListener("mousedown", i), i = null);
      });
    });
    function l(c) {
      let a = t.update(c);
      return s.style.display = a ? "" : "none", a;
    }
    return { dom: s, update: l };
  }
}
function gf(n, e) {
  let t = document.createDocumentFragment(), r = [], o = [];
  for (let i = 0; i < e.length; i++) {
    let l = e[i], c = [], a = [];
    for (let u = 0; u < l.length; u++) {
      let { dom: f, update: h } = l[u].render(n), p = re("span", { class: X + "item" }, f);
      t.appendChild(p), a.push(p), c.push(h);
    }
    c.length && (r.push($l(c, a)), i < e.length - 1 && o.push(t.appendChild(bf())));
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
function bf() {
  return re("span", { class: X + "separator" });
}
const ie = {
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
}, kf = new pe({
  title: "Join with above block",
  run: Vr,
  select: (n) => Vr(n),
  icon: ie.join
}), yf = new pe({
  title: "Lift out of enclosing block",
  run: $r,
  select: (n) => $r(n),
  icon: ie.lift
}), xf = new pe({
  title: "Select parent node",
  run: Ur,
  select: (n) => Ur(n),
  icon: ie.selectParentNode
});
let wf = new pe({
  title: "Undo last change",
  run: Dn,
  enable: (n) => Dn(n),
  icon: ie.undo
}), Cf = new pe({
  title: "Redo last undone change",
  run: Wt,
  enable: (n) => Wt(n),
  icon: ie.redo
});
function Qt(n, e) {
  let t = {
    run(r, o) {
      return Hr(n, e.attrs)(r, o);
    },
    select(r) {
      return Hr(n, e.attrs)(r);
    }
  };
  for (let r in e)
    t[r] = e[r];
  return new pe(t);
}
function zt(n, e) {
  let t = hn(n, e.attrs), r = {
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
  return new pe(r);
}
function Wr(n, e, t) {
  t ? n.classList.add(e) : n.classList.remove(e);
}
const on = "ProseMirror-menubar";
function vf() {
  if (typeof navigator > "u")
    return !1;
  let n = navigator.userAgent;
  return !/Edge\/\d/.test(n) && /AppleWebKit/.test(n) && /Mobile\/\w+/.test(n);
}
function Sf(n) {
  return new $e({
    view(e) {
      return new _f(e, n);
    }
  });
}
class _f {
  constructor(e, t) {
    this.editorView = e, this.options = t, this.spacer = null, this.maxHeight = 0, this.widthForMaxHeight = 0, this.floating = !1, this.scrollHandler = null, this.wrapper = re("div", { class: on + "-wrapper" }), this.menu = this.wrapper.appendChild(re("div", { class: on })), this.menu.className = on, e.dom.parentNode && e.dom.parentNode.replaceChild(this.wrapper, e.dom), this.wrapper.appendChild(e.dom);
    let { dom: r, update: o } = gf(this.editorView, this.options.content);
    if (this.contentUpdate = o, this.menu.appendChild(r), this.update(), t.floating && !vf()) {
      this.updateFloat();
      let s = Af(this.wrapper);
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
    let t = e.getRangeAt(0).getClientRects(), r = t[Df(e) ? 0 : t.length - 1];
    if (!r)
      return;
    let o = this.menu.getBoundingClientRect();
    if (r.top < o.bottom && r.bottom > o.top) {
      let s = Ef(this.wrapper);
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
      this.menu.style.left = s.left + "px", this.menu.style.width = s.width + "px", e && (this.menu.style.top = o + "px"), this.menu.style.position = "fixed", this.spacer = re("div", { class: on + "-spacer", style: `height: ${s.height}px` }), t.insertBefore(this.spacer, this.menu);
    }
  }
  destroy() {
    this.wrapper.parentNode && this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper);
  }
}
function Df(n) {
  return n.anchorNode == n.focusNode ? n.anchorOffset > n.focusOffset : n.anchorNode.compareDocumentPosition(n.focusNode) == Node.DOCUMENT_POSITION_FOLLOWING;
}
function Ef(n) {
  for (let e = n.parentNode; e; e = e.parentNode)
    if (e.scrollHeight > e.clientHeight)
      return e;
}
function Af(n) {
  let e = [n.ownerDocument.defaultView || window];
  for (let t = n.parentNode; t; t = t.parentNode)
    e.push(t);
  return e;
}
class He {
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
    this.match = e, this.match = e, this.handler = typeof t == "string" ? Mf(t) : t, this.undoable = r.undoable !== !1;
  }
}
function Mf(n) {
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
const Tf = 500;
function Ul({ rules: n }) {
  let e = new $e({
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
        return As(t, r, o, s, n, e);
      },
      handleDOMEvents: {
        compositionend: (t) => {
          setTimeout(() => {
            let { $cursor: r } = t.state.selection;
            r && As(t, r.pos, r.pos, "", n, e);
          });
        }
      }
    },
    isInputRules: !0
  });
  return e;
}
function As(n, e, t, r, o, s) {
  if (n.composing)
    return !1;
  let i = n.state, l = i.doc.resolve(e);
  if (l.parent.type.spec.code)
    return !1;
  let c = l.parent.textBetween(Math.max(0, l.parentOffset - Tf), l.parentOffset, null, "￼") + r;
  for (let a = 0; a < o.length; a++) {
    let u = o[a], f = u.match.exec(c), h = f && u.handler(i, f, e - (f[0].length - r.length), t);
    if (h)
      return u.undoable && h.setMeta(s, { transform: h, from: e, to: t, text: r }), n.dispatch(h), !0;
  }
  return !1;
}
const Of = (n, e) => {
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
}, Nf = new He(/--$/, "—"), qf = new He(/\.\.\.$/, "…"), Rf = new He(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "“"), If = new He(/"$/, "”"), Ff = new He(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "‘"), zf = new He(/'$/, "’"), Lf = [Rf, If, Ff, zf];
function st(n, e, t = null, r) {
  return new He(n, (o, s, i, l) => {
    let c = t instanceof Function ? t(s) : t, a = o.tr.delete(i, l), u = a.doc.resolve(i), f = u.blockRange(), h = f && Qr(f, e, c);
    if (!h)
      return null;
    a.wrap(f, h);
    let p = a.doc.resolve(i - 1).nodeBefore;
    return p && p.type == e && wt(a.doc, i - 1) && (!r || r(s, p)) && a.join(i - 1), a;
  });
}
function Fn(n, e, t = null) {
  return new He(n, (r, o, s, i) => {
    let l = r.doc.resolve(s), c = t instanceof Function ? t(o) : t;
    return l.node(-1).canReplaceWith(l.index(-1), l.indexAfter(-1), e) ? r.tr.delete(s, i).setBlockType(s, s, e, c) : null;
  });
}
const fo = "address", Bf = {
  content: "block+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: "div.address" }],
  toDOM() {
    return ["div", { class: "address" }, 0];
  }
}, Pf = ({ menu: n, schema: e }) => {
  n.typeMenu.content.push(
    Qt(e.nodes[fo], {
      label: "Address"
    })
  );
}, Vf = (n) => [
  // $A Address
  st(/^\$A\s$/, n.nodes[fo])
], $f = (n, e) => {
  n.write(`$A

`), n.renderInline(e), n.write("$A"), n.closeBlock(e);
}, Hl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  buildMenu: Pf,
  inputRules: Vf,
  name: fo,
  schema: Bf,
  toGovspeak: $f
}, Symbol.toStringTag, { value: "Module" })), ho = "call_to_action", Uf = {
  content: "block+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: "div.call-to-action" }],
  toDOM() {
    return ["div", { class: "call-to-action" }, 0];
  }
}, Hf = ({ menu: n, schema: e }) => {
  n.typeMenu.content.push(
    Qt(e.nodes[ho], {
      label: "Call to action"
    })
  );
}, jf = (n) => [
  // $CTA Call to action
  st(/^\$CTA\s$/, n.nodes[ho])
], Wf = (n, e) => {
  n.write(`$CTA

`), n.renderInline(e), n.write("$CTA"), n.closeBlock(e);
}, jl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  buildMenu: Hf,
  inputRules: jf,
  name: ho,
  schema: Uf,
  toGovspeak: Wf
}, Symbol.toStringTag, { value: "Module" })), po = "contact", Jf = {
  content: "block+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: 'div.contact[role="contact"][aria-label="Contact"]' }],
  toDOM() {
    return ["div", { class: "contact" }, ["p", 0]];
  }
}, Gf = ({ menu: n, schema: e }) => {
  n.typeMenu.content.push(
    Qt(e.nodes[po], {
      label: "Contact"
    })
  );
}, Kf = (n) => [
  // $C Contact
  st(/^\$C\s$/, n.nodes[po])
], Zf = (n, e) => {
  n.write(`$C

`), n.renderInline(e), n.write("$C"), n.closeBlock(e);
}, Wl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  buildMenu: Gf,
  inputRules: Kf,
  name: po,
  schema: Jf,
  toGovspeak: Zf
}, Symbol.toStringTag, { value: "Module" })), mo = "example_callout", Yf = {
  content: "block+",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: "div.example" }],
  toDOM() {
    return ["div", { class: "example" }, 0];
  }
}, Qf = ({ menu: n, schema: e }) => {
  n.typeMenu.content.push(
    Qt(e.nodes[mo], {
      label: "Example callout"
    })
  );
}, Xf = (n) => [
  // $E Example callout
  st(/^\$E\s$/, n.nodes[mo])
], eh = (n, e) => {
  n.write(`$E

`), n.renderInline(e), n.write("$E"), n.closeBlock(e);
}, Jl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  buildMenu: Qf,
  inputRules: Xf,
  name: mo,
  schema: Yf,
  toGovspeak: eh
}, Symbol.toStringTag, { value: "Module" })), go = "information_callout", th = {
  content: "inline*",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: 'div.application-notice.info-notice[role="note"][aria-label="Information"]' }],
  toDOM() {
    return ["div", { class: "application-notice info-notice" }, ["p", 0]];
  }
}, nh = ({ menu: n, schema: e }) => {
  n.typeMenu.content.push(
    zt(e.nodes[go], {
      label: "Information callout"
    })
  );
}, rh = (n) => [
  // ^ Information callout
  Fn(/^\^\s$/, n.nodes[go])
], oh = (n, e) => {
  n.write("^"), n.renderInline(e, !1), n.write("^"), n.closeBlock(e);
}, Gl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  buildMenu: nh,
  inputRules: rh,
  name: go,
  schema: th,
  toGovspeak: oh
}, Symbol.toStringTag, { value: "Module" })), bo = "warning_callout", sh = {
  content: "inline*",
  group: "block",
  defining: !0,
  parseDOM: [{ tag: 'div.application-notice.help-notice[role="note"][aria-label="Warning"]' }],
  toDOM() {
    return ["div", { class: "application-notice help-notice" }, ["p", 0]];
  }
}, ih = ({ menu: n, schema: e }) => {
  n.typeMenu.content.push(
    zt(e.nodes[bo], {
      label: "Warning callout"
    })
  );
}, lh = (n) => [
  // % Warning callout
  Fn(/^%\s$/, n.nodes[bo])
], ch = (n, e) => {
  n.write("%"), n.renderInline(e, !1), n.write("%"), n.closeBlock(e);
}, Kl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  buildMenu: ih,
  inputRules: lh,
  name: bo,
  schema: sh,
  toGovspeak: ch
}, Symbol.toStringTag, { value: "Module" }));
function ah(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
function uh(n) {
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
var R = {};
const fh = "Á", hh = "á", ph = "Ă", dh = "ă", mh = "∾", gh = "∿", bh = "∾̳", kh = "Â", yh = "â", xh = "´", wh = "А", Ch = "а", vh = "Æ", Sh = "æ", _h = "⁡", Dh = "𝔄", Eh = "𝔞", Ah = "À", Mh = "à", Th = "ℵ", Oh = "ℵ", Nh = "Α", qh = "α", Rh = "Ā", Ih = "ā", Fh = "⨿", zh = "&", Lh = "&", Bh = "⩕", Ph = "⩓", Vh = "∧", $h = "⩜", Uh = "⩘", Hh = "⩚", jh = "∠", Wh = "⦤", Jh = "∠", Gh = "⦨", Kh = "⦩", Zh = "⦪", Yh = "⦫", Qh = "⦬", Xh = "⦭", ep = "⦮", tp = "⦯", np = "∡", rp = "∟", op = "⊾", sp = "⦝", ip = "∢", lp = "Å", cp = "⍼", ap = "Ą", up = "ą", fp = "𝔸", hp = "𝕒", pp = "⩯", dp = "≈", mp = "⩰", gp = "≊", bp = "≋", kp = "'", yp = "⁡", xp = "≈", wp = "≊", Cp = "Å", vp = "å", Sp = "𝒜", _p = "𝒶", Dp = "≔", Ep = "*", Ap = "≈", Mp = "≍", Tp = "Ã", Op = "ã", Np = "Ä", qp = "ä", Rp = "∳", Ip = "⨑", Fp = "≌", zp = "϶", Lp = "‵", Bp = "∽", Pp = "⋍", Vp = "∖", $p = "⫧", Up = "⊽", Hp = "⌅", jp = "⌆", Wp = "⌅", Jp = "⎵", Gp = "⎶", Kp = "≌", Zp = "Б", Yp = "б", Qp = "„", Xp = "∵", ed = "∵", td = "∵", nd = "⦰", rd = "϶", od = "ℬ", sd = "ℬ", id = "Β", ld = "β", cd = "ℶ", ad = "≬", ud = "𝔅", fd = "𝔟", hd = "⋂", pd = "◯", dd = "⋃", md = "⨀", gd = "⨁", bd = "⨂", kd = "⨆", yd = "★", xd = "▽", wd = "△", Cd = "⨄", vd = "⋁", Sd = "⋀", _d = "⤍", Dd = "⧫", Ed = "▪", Ad = "▴", Md = "▾", Td = "◂", Od = "▸", Nd = "␣", qd = "▒", Rd = "░", Id = "▓", Fd = "█", zd = "=⃥", Ld = "≡⃥", Bd = "⫭", Pd = "⌐", Vd = "𝔹", $d = "𝕓", Ud = "⊥", Hd = "⊥", jd = "⋈", Wd = "⧉", Jd = "┐", Gd = "╕", Kd = "╖", Zd = "╗", Yd = "┌", Qd = "╒", Xd = "╓", em = "╔", tm = "─", nm = "═", rm = "┬", om = "╤", sm = "╥", im = "╦", lm = "┴", cm = "╧", am = "╨", um = "╩", fm = "⊟", hm = "⊞", pm = "⊠", dm = "┘", mm = "╛", gm = "╜", bm = "╝", km = "└", ym = "╘", xm = "╙", wm = "╚", Cm = "│", vm = "║", Sm = "┼", _m = "╪", Dm = "╫", Em = "╬", Am = "┤", Mm = "╡", Tm = "╢", Om = "╣", Nm = "├", qm = "╞", Rm = "╟", Im = "╠", Fm = "‵", zm = "˘", Lm = "˘", Bm = "¦", Pm = "𝒷", Vm = "ℬ", $m = "⁏", Um = "∽", Hm = "⋍", jm = "⧅", Wm = "\\", Jm = "⟈", Gm = "•", Km = "•", Zm = "≎", Ym = "⪮", Qm = "≏", Xm = "≎", eg = "≏", tg = "Ć", ng = "ć", rg = "⩄", og = "⩉", sg = "⩋", ig = "∩", lg = "⋒", cg = "⩇", ag = "⩀", ug = "ⅅ", fg = "∩︀", hg = "⁁", pg = "ˇ", dg = "ℭ", mg = "⩍", gg = "Č", bg = "č", kg = "Ç", yg = "ç", xg = "Ĉ", wg = "ĉ", Cg = "∰", vg = "⩌", Sg = "⩐", _g = "Ċ", Dg = "ċ", Eg = "¸", Ag = "¸", Mg = "⦲", Tg = "¢", Og = "·", Ng = "·", qg = "𝔠", Rg = "ℭ", Ig = "Ч", Fg = "ч", zg = "✓", Lg = "✓", Bg = "Χ", Pg = "χ", Vg = "ˆ", $g = "≗", Ug = "↺", Hg = "↻", jg = "⊛", Wg = "⊚", Jg = "⊝", Gg = "⊙", Kg = "®", Zg = "Ⓢ", Yg = "⊖", Qg = "⊕", Xg = "⊗", e0 = "○", t0 = "⧃", n0 = "≗", r0 = "⨐", o0 = "⫯", s0 = "⧂", i0 = "∲", l0 = "”", c0 = "’", a0 = "♣", u0 = "♣", f0 = ":", h0 = "∷", p0 = "⩴", d0 = "≔", m0 = "≔", g0 = ",", b0 = "@", k0 = "∁", y0 = "∘", x0 = "∁", w0 = "ℂ", C0 = "≅", v0 = "⩭", S0 = "≡", _0 = "∮", D0 = "∯", E0 = "∮", A0 = "𝕔", M0 = "ℂ", T0 = "∐", O0 = "∐", N0 = "©", q0 = "©", R0 = "℗", I0 = "∳", F0 = "↵", z0 = "✗", L0 = "⨯", B0 = "𝒞", P0 = "𝒸", V0 = "⫏", $0 = "⫑", U0 = "⫐", H0 = "⫒", j0 = "⋯", W0 = "⤸", J0 = "⤵", G0 = "⋞", K0 = "⋟", Z0 = "↶", Y0 = "⤽", Q0 = "⩈", X0 = "⩆", eb = "≍", tb = "∪", nb = "⋓", rb = "⩊", ob = "⊍", sb = "⩅", ib = "∪︀", lb = "↷", cb = "⤼", ab = "⋞", ub = "⋟", fb = "⋎", hb = "⋏", pb = "¤", db = "↶", mb = "↷", gb = "⋎", bb = "⋏", kb = "∲", yb = "∱", xb = "⌭", wb = "†", Cb = "‡", vb = "ℸ", Sb = "↓", _b = "↡", Db = "⇓", Eb = "‐", Ab = "⫤", Mb = "⊣", Tb = "⤏", Ob = "˝", Nb = "Ď", qb = "ď", Rb = "Д", Ib = "д", Fb = "‡", zb = "⇊", Lb = "ⅅ", Bb = "ⅆ", Pb = "⤑", Vb = "⩷", $b = "°", Ub = "∇", Hb = "Δ", jb = "δ", Wb = "⦱", Jb = "⥿", Gb = "𝔇", Kb = "𝔡", Zb = "⥥", Yb = "⇃", Qb = "⇂", Xb = "´", e1 = "˙", t1 = "˝", n1 = "`", r1 = "˜", o1 = "⋄", s1 = "⋄", i1 = "⋄", l1 = "♦", c1 = "♦", a1 = "¨", u1 = "ⅆ", f1 = "ϝ", h1 = "⋲", p1 = "÷", d1 = "÷", m1 = "⋇", g1 = "⋇", b1 = "Ђ", k1 = "ђ", y1 = "⌞", x1 = "⌍", w1 = "$", C1 = "𝔻", v1 = "𝕕", S1 = "¨", _1 = "˙", D1 = "⃜", E1 = "≐", A1 = "≑", M1 = "≐", T1 = "∸", O1 = "∔", N1 = "⊡", q1 = "⌆", R1 = "∯", I1 = "¨", F1 = "⇓", z1 = "⇐", L1 = "⇔", B1 = "⫤", P1 = "⟸", V1 = "⟺", $1 = "⟹", U1 = "⇒", H1 = "⊨", j1 = "⇑", W1 = "⇕", J1 = "∥", G1 = "⤓", K1 = "↓", Z1 = "↓", Y1 = "⇓", Q1 = "⇵", X1 = "̑", ek = "⇊", tk = "⇃", nk = "⇂", rk = "⥐", ok = "⥞", sk = "⥖", ik = "↽", lk = "⥟", ck = "⥗", ak = "⇁", uk = "↧", fk = "⊤", hk = "⤐", pk = "⌟", dk = "⌌", mk = "𝒟", gk = "𝒹", bk = "Ѕ", kk = "ѕ", yk = "⧶", xk = "Đ", wk = "đ", Ck = "⋱", vk = "▿", Sk = "▾", _k = "⇵", Dk = "⥯", Ek = "⦦", Ak = "Џ", Mk = "џ", Tk = "⟿", Ok = "É", Nk = "é", qk = "⩮", Rk = "Ě", Ik = "ě", Fk = "Ê", zk = "ê", Lk = "≖", Bk = "≕", Pk = "Э", Vk = "э", $k = "⩷", Uk = "Ė", Hk = "ė", jk = "≑", Wk = "ⅇ", Jk = "≒", Gk = "𝔈", Kk = "𝔢", Zk = "⪚", Yk = "È", Qk = "è", Xk = "⪖", ey = "⪘", ty = "⪙", ny = "∈", ry = "⏧", oy = "ℓ", sy = "⪕", iy = "⪗", ly = "Ē", cy = "ē", ay = "∅", uy = "∅", fy = "◻", hy = "∅", py = "▫", dy = " ", my = " ", gy = " ", by = "Ŋ", ky = "ŋ", yy = " ", xy = "Ę", wy = "ę", Cy = "𝔼", vy = "𝕖", Sy = "⋕", _y = "⧣", Dy = "⩱", Ey = "ε", Ay = "Ε", My = "ε", Ty = "ϵ", Oy = "≖", Ny = "≕", qy = "≂", Ry = "⪖", Iy = "⪕", Fy = "⩵", zy = "=", Ly = "≂", By = "≟", Py = "⇌", Vy = "≡", $y = "⩸", Uy = "⧥", Hy = "⥱", jy = "≓", Wy = "ℯ", Jy = "ℰ", Gy = "≐", Ky = "⩳", Zy = "≂", Yy = "Η", Qy = "η", Xy = "Ð", ex = "ð", tx = "Ë", nx = "ë", rx = "€", ox = "!", sx = "∃", ix = "∃", lx = "ℰ", cx = "ⅇ", ax = "ⅇ", ux = "≒", fx = "Ф", hx = "ф", px = "♀", dx = "ﬃ", mx = "ﬀ", gx = "ﬄ", bx = "𝔉", kx = "𝔣", yx = "ﬁ", xx = "◼", wx = "▪", Cx = "fj", vx = "♭", Sx = "ﬂ", _x = "▱", Dx = "ƒ", Ex = "𝔽", Ax = "𝕗", Mx = "∀", Tx = "∀", Ox = "⋔", Nx = "⫙", qx = "ℱ", Rx = "⨍", Ix = "½", Fx = "⅓", zx = "¼", Lx = "⅕", Bx = "⅙", Px = "⅛", Vx = "⅔", $x = "⅖", Ux = "¾", Hx = "⅗", jx = "⅜", Wx = "⅘", Jx = "⅚", Gx = "⅝", Kx = "⅞", Zx = "⁄", Yx = "⌢", Qx = "𝒻", Xx = "ℱ", ew = "ǵ", tw = "Γ", nw = "γ", rw = "Ϝ", ow = "ϝ", sw = "⪆", iw = "Ğ", lw = "ğ", cw = "Ģ", aw = "Ĝ", uw = "ĝ", fw = "Г", hw = "г", pw = "Ġ", dw = "ġ", mw = "≥", gw = "≧", bw = "⪌", kw = "⋛", yw = "≥", xw = "≧", ww = "⩾", Cw = "⪩", vw = "⩾", Sw = "⪀", _w = "⪂", Dw = "⪄", Ew = "⋛︀", Aw = "⪔", Mw = "𝔊", Tw = "𝔤", Ow = "≫", Nw = "⋙", qw = "⋙", Rw = "ℷ", Iw = "Ѓ", Fw = "ѓ", zw = "⪥", Lw = "≷", Bw = "⪒", Pw = "⪤", Vw = "⪊", $w = "⪊", Uw = "⪈", Hw = "≩", jw = "⪈", Ww = "≩", Jw = "⋧", Gw = "𝔾", Kw = "𝕘", Zw = "`", Yw = "≥", Qw = "⋛", Xw = "≧", eC = "⪢", tC = "≷", nC = "⩾", rC = "≳", oC = "𝒢", sC = "ℊ", iC = "≳", lC = "⪎", cC = "⪐", aC = "⪧", uC = "⩺", fC = ">", hC = ">", pC = "≫", dC = "⋗", mC = "⦕", gC = "⩼", bC = "⪆", kC = "⥸", yC = "⋗", xC = "⋛", wC = "⪌", CC = "≷", vC = "≳", SC = "≩︀", _C = "≩︀", DC = "ˇ", EC = " ", AC = "½", MC = "ℋ", TC = "Ъ", OC = "ъ", NC = "⥈", qC = "↔", RC = "⇔", IC = "↭", FC = "^", zC = "ℏ", LC = "Ĥ", BC = "ĥ", PC = "♥", VC = "♥", $C = "…", UC = "⊹", HC = "𝔥", jC = "ℌ", WC = "ℋ", JC = "⤥", GC = "⤦", KC = "⇿", ZC = "∻", YC = "↩", QC = "↪", XC = "𝕙", ev = "ℍ", tv = "―", nv = "─", rv = "𝒽", ov = "ℋ", sv = "ℏ", iv = "Ħ", lv = "ħ", cv = "≎", av = "≏", uv = "⁃", fv = "‐", hv = "Í", pv = "í", dv = "⁣", mv = "Î", gv = "î", bv = "И", kv = "и", yv = "İ", xv = "Е", wv = "е", Cv = "¡", vv = "⇔", Sv = "𝔦", _v = "ℑ", Dv = "Ì", Ev = "ì", Av = "ⅈ", Mv = "⨌", Tv = "∭", Ov = "⧜", Nv = "℩", qv = "Ĳ", Rv = "ĳ", Iv = "Ī", Fv = "ī", zv = "ℑ", Lv = "ⅈ", Bv = "ℐ", Pv = "ℑ", Vv = "ı", $v = "ℑ", Uv = "⊷", Hv = "Ƶ", jv = "⇒", Wv = "℅", Jv = "∞", Gv = "⧝", Kv = "ı", Zv = "⊺", Yv = "∫", Qv = "∬", Xv = "ℤ", eS = "∫", tS = "⊺", nS = "⋂", rS = "⨗", oS = "⨼", sS = "⁣", iS = "⁢", lS = "Ё", cS = "ё", aS = "Į", uS = "į", fS = "𝕀", hS = "𝕚", pS = "Ι", dS = "ι", mS = "⨼", gS = "¿", bS = "𝒾", kS = "ℐ", yS = "∈", xS = "⋵", wS = "⋹", CS = "⋴", vS = "⋳", SS = "∈", _S = "⁢", DS = "Ĩ", ES = "ĩ", AS = "І", MS = "і", TS = "Ï", OS = "ï", NS = "Ĵ", qS = "ĵ", RS = "Й", IS = "й", FS = "𝔍", zS = "𝔧", LS = "ȷ", BS = "𝕁", PS = "𝕛", VS = "𝒥", $S = "𝒿", US = "Ј", HS = "ј", jS = "Є", WS = "є", JS = "Κ", GS = "κ", KS = "ϰ", ZS = "Ķ", YS = "ķ", QS = "К", XS = "к", e_ = "𝔎", t_ = "𝔨", n_ = "ĸ", r_ = "Х", o_ = "х", s_ = "Ќ", i_ = "ќ", l_ = "𝕂", c_ = "𝕜", a_ = "𝒦", u_ = "𝓀", f_ = "⇚", h_ = "Ĺ", p_ = "ĺ", d_ = "⦴", m_ = "ℒ", g_ = "Λ", b_ = "λ", k_ = "⟨", y_ = "⟪", x_ = "⦑", w_ = "⟨", C_ = "⪅", v_ = "ℒ", S_ = "«", __ = "⇤", D_ = "⤟", E_ = "←", A_ = "↞", M_ = "⇐", T_ = "⤝", O_ = "↩", N_ = "↫", q_ = "⤹", R_ = "⥳", I_ = "↢", F_ = "⤙", z_ = "⤛", L_ = "⪫", B_ = "⪭", P_ = "⪭︀", V_ = "⤌", $_ = "⤎", U_ = "❲", H_ = "{", j_ = "[", W_ = "⦋", J_ = "⦏", G_ = "⦍", K_ = "Ľ", Z_ = "ľ", Y_ = "Ļ", Q_ = "ļ", X_ = "⌈", eD = "{", tD = "Л", nD = "л", rD = "⤶", oD = "“", sD = "„", iD = "⥧", lD = "⥋", cD = "↲", aD = "≤", uD = "≦", fD = "⟨", hD = "⇤", pD = "←", dD = "←", mD = "⇐", gD = "⇆", bD = "↢", kD = "⌈", yD = "⟦", xD = "⥡", wD = "⥙", CD = "⇃", vD = "⌊", SD = "↽", _D = "↼", DD = "⇇", ED = "↔", AD = "↔", MD = "⇔", TD = "⇆", OD = "⇋", ND = "↭", qD = "⥎", RD = "↤", ID = "⊣", FD = "⥚", zD = "⋋", LD = "⧏", BD = "⊲", PD = "⊴", VD = "⥑", $D = "⥠", UD = "⥘", HD = "↿", jD = "⥒", WD = "↼", JD = "⪋", GD = "⋚", KD = "≤", ZD = "≦", YD = "⩽", QD = "⪨", XD = "⩽", eE = "⩿", tE = "⪁", nE = "⪃", rE = "⋚︀", oE = "⪓", sE = "⪅", iE = "⋖", lE = "⋚", cE = "⪋", aE = "⋚", uE = "≦", fE = "≶", hE = "≶", pE = "⪡", dE = "≲", mE = "⩽", gE = "≲", bE = "⥼", kE = "⌊", yE = "𝔏", xE = "𝔩", wE = "≶", CE = "⪑", vE = "⥢", SE = "↽", _E = "↼", DE = "⥪", EE = "▄", AE = "Љ", ME = "љ", TE = "⇇", OE = "≪", NE = "⋘", qE = "⌞", RE = "⇚", IE = "⥫", FE = "◺", zE = "Ŀ", LE = "ŀ", BE = "⎰", PE = "⎰", VE = "⪉", $E = "⪉", UE = "⪇", HE = "≨", jE = "⪇", WE = "≨", JE = "⋦", GE = "⟬", KE = "⇽", ZE = "⟦", YE = "⟵", QE = "⟵", XE = "⟸", eA = "⟷", tA = "⟷", nA = "⟺", rA = "⟼", oA = "⟶", sA = "⟶", iA = "⟹", lA = "↫", cA = "↬", aA = "⦅", uA = "𝕃", fA = "𝕝", hA = "⨭", pA = "⨴", dA = "∗", mA = "_", gA = "↙", bA = "↘", kA = "◊", yA = "◊", xA = "⧫", wA = "(", CA = "⦓", vA = "⇆", SA = "⌟", _A = "⇋", DA = "⥭", EA = "‎", AA = "⊿", MA = "‹", TA = "𝓁", OA = "ℒ", NA = "↰", qA = "↰", RA = "≲", IA = "⪍", FA = "⪏", zA = "[", LA = "‘", BA = "‚", PA = "Ł", VA = "ł", $A = "⪦", UA = "⩹", HA = "<", jA = "<", WA = "≪", JA = "⋖", GA = "⋋", KA = "⋉", ZA = "⥶", YA = "⩻", QA = "◃", XA = "⊴", eM = "◂", tM = "⦖", nM = "⥊", rM = "⥦", oM = "≨︀", sM = "≨︀", iM = "¯", lM = "♂", cM = "✠", aM = "✠", uM = "↦", fM = "↦", hM = "↧", pM = "↤", dM = "↥", mM = "▮", gM = "⨩", bM = "М", kM = "м", yM = "—", xM = "∺", wM = "∡", CM = " ", vM = "ℳ", SM = "𝔐", _M = "𝔪", DM = "℧", EM = "µ", AM = "*", MM = "⫰", TM = "∣", OM = "·", NM = "⊟", qM = "−", RM = "∸", IM = "⨪", FM = "∓", zM = "⫛", LM = "…", BM = "∓", PM = "⊧", VM = "𝕄", $M = "𝕞", UM = "∓", HM = "𝓂", jM = "ℳ", WM = "∾", JM = "Μ", GM = "μ", KM = "⊸", ZM = "⊸", YM = "∇", QM = "Ń", XM = "ń", eT = "∠⃒", tT = "≉", nT = "⩰̸", rT = "≋̸", oT = "ŉ", sT = "≉", iT = "♮", lT = "ℕ", cT = "♮", aT = " ", uT = "≎̸", fT = "≏̸", hT = "⩃", pT = "Ň", dT = "ň", mT = "Ņ", gT = "ņ", bT = "≇", kT = "⩭̸", yT = "⩂", xT = "Н", wT = "н", CT = "–", vT = "⤤", ST = "↗", _T = "⇗", DT = "↗", ET = "≠", AT = "≐̸", MT = "​", TT = "​", OT = "​", NT = "​", qT = "≢", RT = "⤨", IT = "≂̸", FT = "≫", zT = "≪", LT = `
`, BT = "∄", PT = "∄", VT = "𝔑", $T = "𝔫", UT = "≧̸", HT = "≱", jT = "≱", WT = "≧̸", JT = "⩾̸", GT = "⩾̸", KT = "⋙̸", ZT = "≵", YT = "≫⃒", QT = "≯", XT = "≯", eO = "≫̸", tO = "↮", nO = "⇎", rO = "⫲", oO = "∋", sO = "⋼", iO = "⋺", lO = "∋", cO = "Њ", aO = "њ", uO = "↚", fO = "⇍", hO = "‥", pO = "≦̸", dO = "≰", mO = "↚", gO = "⇍", bO = "↮", kO = "⇎", yO = "≰", xO = "≦̸", wO = "⩽̸", CO = "⩽̸", vO = "≮", SO = "⋘̸", _O = "≴", DO = "≪⃒", EO = "≮", AO = "⋪", MO = "⋬", TO = "≪̸", OO = "∤", NO = "⁠", qO = " ", RO = "𝕟", IO = "ℕ", FO = "⫬", zO = "¬", LO = "≢", BO = "≭", PO = "∦", VO = "∉", $O = "≠", UO = "≂̸", HO = "∄", jO = "≯", WO = "≱", JO = "≧̸", GO = "≫̸", KO = "≹", ZO = "⩾̸", YO = "≵", QO = "≎̸", XO = "≏̸", eN = "∉", tN = "⋵̸", nN = "⋹̸", rN = "∉", oN = "⋷", sN = "⋶", iN = "⧏̸", lN = "⋪", cN = "⋬", aN = "≮", uN = "≰", fN = "≸", hN = "≪̸", pN = "⩽̸", dN = "≴", mN = "⪢̸", gN = "⪡̸", bN = "∌", kN = "∌", yN = "⋾", xN = "⋽", wN = "⊀", CN = "⪯̸", vN = "⋠", SN = "∌", _N = "⧐̸", DN = "⋫", EN = "⋭", AN = "⊏̸", MN = "⋢", TN = "⊐̸", ON = "⋣", NN = "⊂⃒", qN = "⊈", RN = "⊁", IN = "⪰̸", FN = "⋡", zN = "≿̸", LN = "⊃⃒", BN = "⊉", PN = "≁", VN = "≄", $N = "≇", UN = "≉", HN = "∤", jN = "∦", WN = "∦", JN = "⫽⃥", GN = "∂̸", KN = "⨔", ZN = "⊀", YN = "⋠", QN = "⊀", XN = "⪯̸", e2 = "⪯̸", t2 = "⤳̸", n2 = "↛", r2 = "⇏", o2 = "↝̸", s2 = "↛", i2 = "⇏", l2 = "⋫", c2 = "⋭", a2 = "⊁", u2 = "⋡", f2 = "⪰̸", h2 = "𝒩", p2 = "𝓃", d2 = "∤", m2 = "∦", g2 = "≁", b2 = "≄", k2 = "≄", y2 = "∤", x2 = "∦", w2 = "⋢", C2 = "⋣", v2 = "⊄", S2 = "⫅̸", _2 = "⊈", D2 = "⊂⃒", E2 = "⊈", A2 = "⫅̸", M2 = "⊁", T2 = "⪰̸", O2 = "⊅", N2 = "⫆̸", q2 = "⊉", R2 = "⊃⃒", I2 = "⊉", F2 = "⫆̸", z2 = "≹", L2 = "Ñ", B2 = "ñ", P2 = "≸", V2 = "⋪", $2 = "⋬", U2 = "⋫", H2 = "⋭", j2 = "Ν", W2 = "ν", J2 = "#", G2 = "№", K2 = " ", Z2 = "≍⃒", Y2 = "⊬", Q2 = "⊭", X2 = "⊮", eq = "⊯", tq = "≥⃒", nq = ">⃒", rq = "⤄", oq = "⧞", sq = "⤂", iq = "≤⃒", lq = "<⃒", cq = "⊴⃒", aq = "⤃", uq = "⊵⃒", fq = "∼⃒", hq = "⤣", pq = "↖", dq = "⇖", mq = "↖", gq = "⤧", bq = "Ó", kq = "ó", yq = "⊛", xq = "Ô", wq = "ô", Cq = "⊚", vq = "О", Sq = "о", _q = "⊝", Dq = "Ő", Eq = "ő", Aq = "⨸", Mq = "⊙", Tq = "⦼", Oq = "Œ", Nq = "œ", qq = "⦿", Rq = "𝔒", Iq = "𝔬", Fq = "˛", zq = "Ò", Lq = "ò", Bq = "⧁", Pq = "⦵", Vq = "Ω", $q = "∮", Uq = "↺", Hq = "⦾", jq = "⦻", Wq = "‾", Jq = "⧀", Gq = "Ō", Kq = "ō", Zq = "Ω", Yq = "ω", Qq = "Ο", Xq = "ο", eR = "⦶", tR = "⊖", nR = "𝕆", rR = "𝕠", oR = "⦷", sR = "“", iR = "‘", lR = "⦹", cR = "⊕", aR = "↻", uR = "⩔", fR = "∨", hR = "⩝", pR = "ℴ", dR = "ℴ", mR = "ª", gR = "º", bR = "⊶", kR = "⩖", yR = "⩗", xR = "⩛", wR = "Ⓢ", CR = "𝒪", vR = "ℴ", SR = "Ø", _R = "ø", DR = "⊘", ER = "Õ", AR = "õ", MR = "⨶", TR = "⨷", OR = "⊗", NR = "Ö", qR = "ö", RR = "⌽", IR = "‾", FR = "⏞", zR = "⎴", LR = "⏜", BR = "¶", PR = "∥", VR = "∥", $R = "⫳", UR = "⫽", HR = "∂", jR = "∂", WR = "П", JR = "п", GR = "%", KR = ".", ZR = "‰", YR = "⊥", QR = "‱", XR = "𝔓", eI = "𝔭", tI = "Φ", nI = "φ", rI = "ϕ", oI = "ℳ", sI = "☎", iI = "Π", lI = "π", cI = "⋔", aI = "ϖ", uI = "ℏ", fI = "ℎ", hI = "ℏ", pI = "⨣", dI = "⊞", mI = "⨢", gI = "+", bI = "∔", kI = "⨥", yI = "⩲", xI = "±", wI = "±", CI = "⨦", vI = "⨧", SI = "±", _I = "ℌ", DI = "⨕", EI = "𝕡", AI = "ℙ", MI = "£", TI = "⪷", OI = "⪻", NI = "≺", qI = "≼", RI = "⪷", II = "≺", FI = "≼", zI = "≺", LI = "⪯", BI = "≼", PI = "≾", VI = "⪯", $I = "⪹", UI = "⪵", HI = "⋨", jI = "⪯", WI = "⪳", JI = "≾", GI = "′", KI = "″", ZI = "ℙ", YI = "⪹", QI = "⪵", XI = "⋨", eF = "∏", tF = "∏", nF = "⌮", rF = "⌒", oF = "⌓", sF = "∝", iF = "∝", lF = "∷", cF = "∝", aF = "≾", uF = "⊰", fF = "𝒫", hF = "𝓅", pF = "Ψ", dF = "ψ", mF = " ", gF = "𝔔", bF = "𝔮", kF = "⨌", yF = "𝕢", xF = "ℚ", wF = "⁗", CF = "𝒬", vF = "𝓆", SF = "ℍ", _F = "⨖", DF = "?", EF = "≟", AF = '"', MF = '"', TF = "⇛", OF = "∽̱", NF = "Ŕ", qF = "ŕ", RF = "√", IF = "⦳", FF = "⟩", zF = "⟫", LF = "⦒", BF = "⦥", PF = "⟩", VF = "»", $F = "⥵", UF = "⇥", HF = "⤠", jF = "⤳", WF = "→", JF = "↠", GF = "⇒", KF = "⤞", ZF = "↪", YF = "↬", QF = "⥅", XF = "⥴", ez = "⤖", tz = "↣", nz = "↝", rz = "⤚", oz = "⤜", sz = "∶", iz = "ℚ", lz = "⤍", cz = "⤏", az = "⤐", uz = "❳", fz = "}", hz = "]", pz = "⦌", dz = "⦎", mz = "⦐", gz = "Ř", bz = "ř", kz = "Ŗ", yz = "ŗ", xz = "⌉", wz = "}", Cz = "Р", vz = "р", Sz = "⤷", _z = "⥩", Dz = "”", Ez = "”", Az = "↳", Mz = "ℜ", Tz = "ℛ", Oz = "ℜ", Nz = "ℝ", qz = "ℜ", Rz = "▭", Iz = "®", Fz = "®", zz = "∋", Lz = "⇋", Bz = "⥯", Pz = "⥽", Vz = "⌋", $z = "𝔯", Uz = "ℜ", Hz = "⥤", jz = "⇁", Wz = "⇀", Jz = "⥬", Gz = "Ρ", Kz = "ρ", Zz = "ϱ", Yz = "⟩", Qz = "⇥", Xz = "→", eL = "→", tL = "⇒", nL = "⇄", rL = "↣", oL = "⌉", sL = "⟧", iL = "⥝", lL = "⥕", cL = "⇂", aL = "⌋", uL = "⇁", fL = "⇀", hL = "⇄", pL = "⇌", dL = "⇉", mL = "↝", gL = "↦", bL = "⊢", kL = "⥛", yL = "⋌", xL = "⧐", wL = "⊳", CL = "⊵", vL = "⥏", SL = "⥜", _L = "⥔", DL = "↾", EL = "⥓", AL = "⇀", ML = "˚", TL = "≓", OL = "⇄", NL = "⇌", qL = "‏", RL = "⎱", IL = "⎱", FL = "⫮", zL = "⟭", LL = "⇾", BL = "⟧", PL = "⦆", VL = "𝕣", $L = "ℝ", UL = "⨮", HL = "⨵", jL = "⥰", WL = ")", JL = "⦔", GL = "⨒", KL = "⇉", ZL = "⇛", YL = "›", QL = "𝓇", XL = "ℛ", eB = "↱", tB = "↱", nB = "]", rB = "’", oB = "’", sB = "⋌", iB = "⋊", lB = "▹", cB = "⊵", aB = "▸", uB = "⧎", fB = "⧴", hB = "⥨", pB = "℞", dB = "Ś", mB = "ś", gB = "‚", bB = "⪸", kB = "Š", yB = "š", xB = "⪼", wB = "≻", CB = "≽", vB = "⪰", SB = "⪴", _B = "Ş", DB = "ş", EB = "Ŝ", AB = "ŝ", MB = "⪺", TB = "⪶", OB = "⋩", NB = "⨓", qB = "≿", RB = "С", IB = "с", FB = "⊡", zB = "⋅", LB = "⩦", BB = "⤥", PB = "↘", VB = "⇘", $B = "↘", UB = "§", HB = ";", jB = "⤩", WB = "∖", JB = "∖", GB = "✶", KB = "𝔖", ZB = "𝔰", YB = "⌢", QB = "♯", XB = "Щ", eP = "щ", tP = "Ш", nP = "ш", rP = "↓", oP = "←", sP = "∣", iP = "∥", lP = "→", cP = "↑", aP = "­", uP = "Σ", fP = "σ", hP = "ς", pP = "ς", dP = "∼", mP = "⩪", gP = "≃", bP = "≃", kP = "⪞", yP = "⪠", xP = "⪝", wP = "⪟", CP = "≆", vP = "⨤", SP = "⥲", _P = "←", DP = "∘", EP = "∖", AP = "⨳", MP = "⧤", TP = "∣", OP = "⌣", NP = "⪪", qP = "⪬", RP = "⪬︀", IP = "Ь", FP = "ь", zP = "⌿", LP = "⧄", BP = "/", PP = "𝕊", VP = "𝕤", $P = "♠", UP = "♠", HP = "∥", jP = "⊓", WP = "⊓︀", JP = "⊔", GP = "⊔︀", KP = "√", ZP = "⊏", YP = "⊑", QP = "⊏", XP = "⊑", e3 = "⊐", t3 = "⊒", n3 = "⊐", r3 = "⊒", o3 = "□", s3 = "□", i3 = "⊓", l3 = "⊏", c3 = "⊑", a3 = "⊐", u3 = "⊒", f3 = "⊔", h3 = "▪", p3 = "□", d3 = "▪", m3 = "→", g3 = "𝒮", b3 = "𝓈", k3 = "∖", y3 = "⌣", x3 = "⋆", w3 = "⋆", C3 = "☆", v3 = "★", S3 = "ϵ", _3 = "ϕ", D3 = "¯", E3 = "⊂", A3 = "⋐", M3 = "⪽", T3 = "⫅", O3 = "⊆", N3 = "⫃", q3 = "⫁", R3 = "⫋", I3 = "⊊", F3 = "⪿", z3 = "⥹", L3 = "⊂", B3 = "⋐", P3 = "⊆", V3 = "⫅", $3 = "⊆", U3 = "⊊", H3 = "⫋", j3 = "⫇", W3 = "⫕", J3 = "⫓", G3 = "⪸", K3 = "≻", Z3 = "≽", Y3 = "≻", Q3 = "⪰", X3 = "≽", e5 = "≿", t5 = "⪰", n5 = "⪺", r5 = "⪶", o5 = "⋩", s5 = "≿", i5 = "∋", l5 = "∑", c5 = "∑", a5 = "♪", u5 = "¹", f5 = "²", h5 = "³", p5 = "⊃", d5 = "⋑", m5 = "⪾", g5 = "⫘", b5 = "⫆", k5 = "⊇", y5 = "⫄", x5 = "⊃", w5 = "⊇", C5 = "⟉", v5 = "⫗", S5 = "⥻", _5 = "⫂", D5 = "⫌", E5 = "⊋", A5 = "⫀", M5 = "⊃", T5 = "⋑", O5 = "⊇", N5 = "⫆", q5 = "⊋", R5 = "⫌", I5 = "⫈", F5 = "⫔", z5 = "⫖", L5 = "⤦", B5 = "↙", P5 = "⇙", V5 = "↙", $5 = "⤪", U5 = "ß", H5 = "	", j5 = "⌖", W5 = "Τ", J5 = "τ", G5 = "⎴", K5 = "Ť", Z5 = "ť", Y5 = "Ţ", Q5 = "ţ", X5 = "Т", eV = "т", tV = "⃛", nV = "⌕", rV = "𝔗", oV = "𝔱", sV = "∴", iV = "∴", lV = "∴", cV = "Θ", aV = "θ", uV = "ϑ", fV = "ϑ", hV = "≈", pV = "∼", dV = "  ", mV = " ", gV = " ", bV = "≈", kV = "∼", yV = "Þ", xV = "þ", wV = "˜", CV = "∼", vV = "≃", SV = "≅", _V = "≈", DV = "⨱", EV = "⊠", AV = "×", MV = "⨰", TV = "∭", OV = "⤨", NV = "⌶", qV = "⫱", RV = "⊤", IV = "𝕋", FV = "𝕥", zV = "⫚", LV = "⤩", BV = "‴", PV = "™", VV = "™", $V = "▵", UV = "▿", HV = "◃", jV = "⊴", WV = "≜", JV = "▹", GV = "⊵", KV = "◬", ZV = "≜", YV = "⨺", QV = "⃛", XV = "⨹", e8 = "⧍", t8 = "⨻", n8 = "⏢", r8 = "𝒯", o8 = "𝓉", s8 = "Ц", i8 = "ц", l8 = "Ћ", c8 = "ћ", a8 = "Ŧ", u8 = "ŧ", f8 = "≬", h8 = "↞", p8 = "↠", d8 = "Ú", m8 = "ú", g8 = "↑", b8 = "↟", k8 = "⇑", y8 = "⥉", x8 = "Ў", w8 = "ў", C8 = "Ŭ", v8 = "ŭ", S8 = "Û", _8 = "û", D8 = "У", E8 = "у", A8 = "⇅", M8 = "Ű", T8 = "ű", O8 = "⥮", N8 = "⥾", q8 = "𝔘", R8 = "𝔲", I8 = "Ù", F8 = "ù", z8 = "⥣", L8 = "↿", B8 = "↾", P8 = "▀", V8 = "⌜", $8 = "⌜", U8 = "⌏", H8 = "◸", j8 = "Ū", W8 = "ū", J8 = "¨", G8 = "_", K8 = "⏟", Z8 = "⎵", Y8 = "⏝", Q8 = "⋃", X8 = "⊎", e4 = "Ų", t4 = "ų", n4 = "𝕌", r4 = "𝕦", o4 = "⤒", s4 = "↑", i4 = "↑", l4 = "⇑", c4 = "⇅", a4 = "↕", u4 = "↕", f4 = "⇕", h4 = "⥮", p4 = "↿", d4 = "↾", m4 = "⊎", g4 = "↖", b4 = "↗", k4 = "υ", y4 = "ϒ", x4 = "ϒ", w4 = "Υ", C4 = "υ", v4 = "↥", S4 = "⊥", _4 = "⇈", D4 = "⌝", E4 = "⌝", A4 = "⌎", M4 = "Ů", T4 = "ů", O4 = "◹", N4 = "𝒰", q4 = "𝓊", R4 = "⋰", I4 = "Ũ", F4 = "ũ", z4 = "▵", L4 = "▴", B4 = "⇈", P4 = "Ü", V4 = "ü", $4 = "⦧", U4 = "⦜", H4 = "ϵ", j4 = "ϰ", W4 = "∅", J4 = "ϕ", G4 = "ϖ", K4 = "∝", Z4 = "↕", Y4 = "⇕", Q4 = "ϱ", X4 = "ς", e6 = "⊊︀", t6 = "⫋︀", n6 = "⊋︀", r6 = "⫌︀", o6 = "ϑ", s6 = "⊲", i6 = "⊳", l6 = "⫨", c6 = "⫫", a6 = "⫩", u6 = "В", f6 = "в", h6 = "⊢", p6 = "⊨", d6 = "⊩", m6 = "⊫", g6 = "⫦", b6 = "⊻", k6 = "∨", y6 = "⋁", x6 = "≚", w6 = "⋮", C6 = "|", v6 = "‖", S6 = "|", _6 = "‖", D6 = "∣", E6 = "|", A6 = "❘", M6 = "≀", T6 = " ", O6 = "𝔙", N6 = "𝔳", q6 = "⊲", R6 = "⊂⃒", I6 = "⊃⃒", F6 = "𝕍", z6 = "𝕧", L6 = "∝", B6 = "⊳", P6 = "𝒱", V6 = "𝓋", $6 = "⫋︀", U6 = "⊊︀", H6 = "⫌︀", j6 = "⊋︀", W6 = "⊪", J6 = "⦚", G6 = "Ŵ", K6 = "ŵ", Z6 = "⩟", Y6 = "∧", Q6 = "⋀", X6 = "≙", e$ = "℘", t$ = "𝔚", n$ = "𝔴", r$ = "𝕎", o$ = "𝕨", s$ = "℘", i$ = "≀", l$ = "≀", c$ = "𝒲", a$ = "𝓌", u$ = "⋂", f$ = "◯", h$ = "⋃", p$ = "▽", d$ = "𝔛", m$ = "𝔵", g$ = "⟷", b$ = "⟺", k$ = "Ξ", y$ = "ξ", x$ = "⟵", w$ = "⟸", C$ = "⟼", v$ = "⋻", S$ = "⨀", _$ = "𝕏", D$ = "𝕩", E$ = "⨁", A$ = "⨂", M$ = "⟶", T$ = "⟹", O$ = "𝒳", N$ = "𝓍", q$ = "⨆", R$ = "⨄", I$ = "△", F$ = "⋁", z$ = "⋀", L$ = "Ý", B$ = "ý", P$ = "Я", V$ = "я", $$ = "Ŷ", U$ = "ŷ", H$ = "Ы", j$ = "ы", W$ = "¥", J$ = "𝔜", G$ = "𝔶", K$ = "Ї", Z$ = "ї", Y$ = "𝕐", Q$ = "𝕪", X$ = "𝒴", e9 = "𝓎", t9 = "Ю", n9 = "ю", r9 = "ÿ", o9 = "Ÿ", s9 = "Ź", i9 = "ź", l9 = "Ž", c9 = "ž", a9 = "З", u9 = "з", f9 = "Ż", h9 = "ż", p9 = "ℨ", d9 = "​", m9 = "Ζ", g9 = "ζ", b9 = "𝔷", k9 = "ℨ", y9 = "Ж", x9 = "ж", w9 = "⇝", C9 = "𝕫", v9 = "ℤ", S9 = "𝒵", _9 = "𝓏", D9 = "‍", E9 = "‌", A9 = {
  Aacute: fh,
  aacute: hh,
  Abreve: ph,
  abreve: dh,
  ac: mh,
  acd: gh,
  acE: bh,
  Acirc: kh,
  acirc: yh,
  acute: xh,
  Acy: wh,
  acy: Ch,
  AElig: vh,
  aelig: Sh,
  af: _h,
  Afr: Dh,
  afr: Eh,
  Agrave: Ah,
  agrave: Mh,
  alefsym: Th,
  aleph: Oh,
  Alpha: Nh,
  alpha: qh,
  Amacr: Rh,
  amacr: Ih,
  amalg: Fh,
  amp: zh,
  AMP: Lh,
  andand: Bh,
  And: Ph,
  and: Vh,
  andd: $h,
  andslope: Uh,
  andv: Hh,
  ang: jh,
  ange: Wh,
  angle: Jh,
  angmsdaa: Gh,
  angmsdab: Kh,
  angmsdac: Zh,
  angmsdad: Yh,
  angmsdae: Qh,
  angmsdaf: Xh,
  angmsdag: ep,
  angmsdah: tp,
  angmsd: np,
  angrt: rp,
  angrtvb: op,
  angrtvbd: sp,
  angsph: ip,
  angst: lp,
  angzarr: cp,
  Aogon: ap,
  aogon: up,
  Aopf: fp,
  aopf: hp,
  apacir: pp,
  ap: dp,
  apE: mp,
  ape: gp,
  apid: bp,
  apos: kp,
  ApplyFunction: yp,
  approx: xp,
  approxeq: wp,
  Aring: Cp,
  aring: vp,
  Ascr: Sp,
  ascr: _p,
  Assign: Dp,
  ast: Ep,
  asymp: Ap,
  asympeq: Mp,
  Atilde: Tp,
  atilde: Op,
  Auml: Np,
  auml: qp,
  awconint: Rp,
  awint: Ip,
  backcong: Fp,
  backepsilon: zp,
  backprime: Lp,
  backsim: Bp,
  backsimeq: Pp,
  Backslash: Vp,
  Barv: $p,
  barvee: Up,
  barwed: Hp,
  Barwed: jp,
  barwedge: Wp,
  bbrk: Jp,
  bbrktbrk: Gp,
  bcong: Kp,
  Bcy: Zp,
  bcy: Yp,
  bdquo: Qp,
  becaus: Xp,
  because: ed,
  Because: td,
  bemptyv: nd,
  bepsi: rd,
  bernou: od,
  Bernoullis: sd,
  Beta: id,
  beta: ld,
  beth: cd,
  between: ad,
  Bfr: ud,
  bfr: fd,
  bigcap: hd,
  bigcirc: pd,
  bigcup: dd,
  bigodot: md,
  bigoplus: gd,
  bigotimes: bd,
  bigsqcup: kd,
  bigstar: yd,
  bigtriangledown: xd,
  bigtriangleup: wd,
  biguplus: Cd,
  bigvee: vd,
  bigwedge: Sd,
  bkarow: _d,
  blacklozenge: Dd,
  blacksquare: Ed,
  blacktriangle: Ad,
  blacktriangledown: Md,
  blacktriangleleft: Td,
  blacktriangleright: Od,
  blank: Nd,
  blk12: qd,
  blk14: Rd,
  blk34: Id,
  block: Fd,
  bne: zd,
  bnequiv: Ld,
  bNot: Bd,
  bnot: Pd,
  Bopf: Vd,
  bopf: $d,
  bot: Ud,
  bottom: Hd,
  bowtie: jd,
  boxbox: Wd,
  boxdl: Jd,
  boxdL: Gd,
  boxDl: Kd,
  boxDL: Zd,
  boxdr: Yd,
  boxdR: Qd,
  boxDr: Xd,
  boxDR: em,
  boxh: tm,
  boxH: nm,
  boxhd: rm,
  boxHd: om,
  boxhD: sm,
  boxHD: im,
  boxhu: lm,
  boxHu: cm,
  boxhU: am,
  boxHU: um,
  boxminus: fm,
  boxplus: hm,
  boxtimes: pm,
  boxul: dm,
  boxuL: mm,
  boxUl: gm,
  boxUL: bm,
  boxur: km,
  boxuR: ym,
  boxUr: xm,
  boxUR: wm,
  boxv: Cm,
  boxV: vm,
  boxvh: Sm,
  boxvH: _m,
  boxVh: Dm,
  boxVH: Em,
  boxvl: Am,
  boxvL: Mm,
  boxVl: Tm,
  boxVL: Om,
  boxvr: Nm,
  boxvR: qm,
  boxVr: Rm,
  boxVR: Im,
  bprime: Fm,
  breve: zm,
  Breve: Lm,
  brvbar: Bm,
  bscr: Pm,
  Bscr: Vm,
  bsemi: $m,
  bsim: Um,
  bsime: Hm,
  bsolb: jm,
  bsol: Wm,
  bsolhsub: Jm,
  bull: Gm,
  bullet: Km,
  bump: Zm,
  bumpE: Ym,
  bumpe: Qm,
  Bumpeq: Xm,
  bumpeq: eg,
  Cacute: tg,
  cacute: ng,
  capand: rg,
  capbrcup: og,
  capcap: sg,
  cap: ig,
  Cap: lg,
  capcup: cg,
  capdot: ag,
  CapitalDifferentialD: ug,
  caps: fg,
  caret: hg,
  caron: pg,
  Cayleys: dg,
  ccaps: mg,
  Ccaron: gg,
  ccaron: bg,
  Ccedil: kg,
  ccedil: yg,
  Ccirc: xg,
  ccirc: wg,
  Cconint: Cg,
  ccups: vg,
  ccupssm: Sg,
  Cdot: _g,
  cdot: Dg,
  cedil: Eg,
  Cedilla: Ag,
  cemptyv: Mg,
  cent: Tg,
  centerdot: Og,
  CenterDot: Ng,
  cfr: qg,
  Cfr: Rg,
  CHcy: Ig,
  chcy: Fg,
  check: zg,
  checkmark: Lg,
  Chi: Bg,
  chi: Pg,
  circ: Vg,
  circeq: $g,
  circlearrowleft: Ug,
  circlearrowright: Hg,
  circledast: jg,
  circledcirc: Wg,
  circleddash: Jg,
  CircleDot: Gg,
  circledR: Kg,
  circledS: Zg,
  CircleMinus: Yg,
  CirclePlus: Qg,
  CircleTimes: Xg,
  cir: e0,
  cirE: t0,
  cire: n0,
  cirfnint: r0,
  cirmid: o0,
  cirscir: s0,
  ClockwiseContourIntegral: i0,
  CloseCurlyDoubleQuote: l0,
  CloseCurlyQuote: c0,
  clubs: a0,
  clubsuit: u0,
  colon: f0,
  Colon: h0,
  Colone: p0,
  colone: d0,
  coloneq: m0,
  comma: g0,
  commat: b0,
  comp: k0,
  compfn: y0,
  complement: x0,
  complexes: w0,
  cong: C0,
  congdot: v0,
  Congruent: S0,
  conint: _0,
  Conint: D0,
  ContourIntegral: E0,
  copf: A0,
  Copf: M0,
  coprod: T0,
  Coproduct: O0,
  copy: N0,
  COPY: q0,
  copysr: R0,
  CounterClockwiseContourIntegral: I0,
  crarr: F0,
  cross: z0,
  Cross: L0,
  Cscr: B0,
  cscr: P0,
  csub: V0,
  csube: $0,
  csup: U0,
  csupe: H0,
  ctdot: j0,
  cudarrl: W0,
  cudarrr: J0,
  cuepr: G0,
  cuesc: K0,
  cularr: Z0,
  cularrp: Y0,
  cupbrcap: Q0,
  cupcap: X0,
  CupCap: eb,
  cup: tb,
  Cup: nb,
  cupcup: rb,
  cupdot: ob,
  cupor: sb,
  cups: ib,
  curarr: lb,
  curarrm: cb,
  curlyeqprec: ab,
  curlyeqsucc: ub,
  curlyvee: fb,
  curlywedge: hb,
  curren: pb,
  curvearrowleft: db,
  curvearrowright: mb,
  cuvee: gb,
  cuwed: bb,
  cwconint: kb,
  cwint: yb,
  cylcty: xb,
  dagger: wb,
  Dagger: Cb,
  daleth: vb,
  darr: Sb,
  Darr: _b,
  dArr: Db,
  dash: Eb,
  Dashv: Ab,
  dashv: Mb,
  dbkarow: Tb,
  dblac: Ob,
  Dcaron: Nb,
  dcaron: qb,
  Dcy: Rb,
  dcy: Ib,
  ddagger: Fb,
  ddarr: zb,
  DD: Lb,
  dd: Bb,
  DDotrahd: Pb,
  ddotseq: Vb,
  deg: $b,
  Del: Ub,
  Delta: Hb,
  delta: jb,
  demptyv: Wb,
  dfisht: Jb,
  Dfr: Gb,
  dfr: Kb,
  dHar: Zb,
  dharl: Yb,
  dharr: Qb,
  DiacriticalAcute: Xb,
  DiacriticalDot: e1,
  DiacriticalDoubleAcute: t1,
  DiacriticalGrave: n1,
  DiacriticalTilde: r1,
  diam: o1,
  diamond: s1,
  Diamond: i1,
  diamondsuit: l1,
  diams: c1,
  die: a1,
  DifferentialD: u1,
  digamma: f1,
  disin: h1,
  div: p1,
  divide: d1,
  divideontimes: m1,
  divonx: g1,
  DJcy: b1,
  djcy: k1,
  dlcorn: y1,
  dlcrop: x1,
  dollar: w1,
  Dopf: C1,
  dopf: v1,
  Dot: S1,
  dot: _1,
  DotDot: D1,
  doteq: E1,
  doteqdot: A1,
  DotEqual: M1,
  dotminus: T1,
  dotplus: O1,
  dotsquare: N1,
  doublebarwedge: q1,
  DoubleContourIntegral: R1,
  DoubleDot: I1,
  DoubleDownArrow: F1,
  DoubleLeftArrow: z1,
  DoubleLeftRightArrow: L1,
  DoubleLeftTee: B1,
  DoubleLongLeftArrow: P1,
  DoubleLongLeftRightArrow: V1,
  DoubleLongRightArrow: $1,
  DoubleRightArrow: U1,
  DoubleRightTee: H1,
  DoubleUpArrow: j1,
  DoubleUpDownArrow: W1,
  DoubleVerticalBar: J1,
  DownArrowBar: G1,
  downarrow: K1,
  DownArrow: Z1,
  Downarrow: Y1,
  DownArrowUpArrow: Q1,
  DownBreve: X1,
  downdownarrows: ek,
  downharpoonleft: tk,
  downharpoonright: nk,
  DownLeftRightVector: rk,
  DownLeftTeeVector: ok,
  DownLeftVectorBar: sk,
  DownLeftVector: ik,
  DownRightTeeVector: lk,
  DownRightVectorBar: ck,
  DownRightVector: ak,
  DownTeeArrow: uk,
  DownTee: fk,
  drbkarow: hk,
  drcorn: pk,
  drcrop: dk,
  Dscr: mk,
  dscr: gk,
  DScy: bk,
  dscy: kk,
  dsol: yk,
  Dstrok: xk,
  dstrok: wk,
  dtdot: Ck,
  dtri: vk,
  dtrif: Sk,
  duarr: _k,
  duhar: Dk,
  dwangle: Ek,
  DZcy: Ak,
  dzcy: Mk,
  dzigrarr: Tk,
  Eacute: Ok,
  eacute: Nk,
  easter: qk,
  Ecaron: Rk,
  ecaron: Ik,
  Ecirc: Fk,
  ecirc: zk,
  ecir: Lk,
  ecolon: Bk,
  Ecy: Pk,
  ecy: Vk,
  eDDot: $k,
  Edot: Uk,
  edot: Hk,
  eDot: jk,
  ee: Wk,
  efDot: Jk,
  Efr: Gk,
  efr: Kk,
  eg: Zk,
  Egrave: Yk,
  egrave: Qk,
  egs: Xk,
  egsdot: ey,
  el: ty,
  Element: ny,
  elinters: ry,
  ell: oy,
  els: sy,
  elsdot: iy,
  Emacr: ly,
  emacr: cy,
  empty: ay,
  emptyset: uy,
  EmptySmallSquare: fy,
  emptyv: hy,
  EmptyVerySmallSquare: py,
  emsp13: dy,
  emsp14: my,
  emsp: gy,
  ENG: by,
  eng: ky,
  ensp: yy,
  Eogon: xy,
  eogon: wy,
  Eopf: Cy,
  eopf: vy,
  epar: Sy,
  eparsl: _y,
  eplus: Dy,
  epsi: Ey,
  Epsilon: Ay,
  epsilon: My,
  epsiv: Ty,
  eqcirc: Oy,
  eqcolon: Ny,
  eqsim: qy,
  eqslantgtr: Ry,
  eqslantless: Iy,
  Equal: Fy,
  equals: zy,
  EqualTilde: Ly,
  equest: By,
  Equilibrium: Py,
  equiv: Vy,
  equivDD: $y,
  eqvparsl: Uy,
  erarr: Hy,
  erDot: jy,
  escr: Wy,
  Escr: Jy,
  esdot: Gy,
  Esim: Ky,
  esim: Zy,
  Eta: Yy,
  eta: Qy,
  ETH: Xy,
  eth: ex,
  Euml: tx,
  euml: nx,
  euro: rx,
  excl: ox,
  exist: sx,
  Exists: ix,
  expectation: lx,
  exponentiale: cx,
  ExponentialE: ax,
  fallingdotseq: ux,
  Fcy: fx,
  fcy: hx,
  female: px,
  ffilig: dx,
  fflig: mx,
  ffllig: gx,
  Ffr: bx,
  ffr: kx,
  filig: yx,
  FilledSmallSquare: xx,
  FilledVerySmallSquare: wx,
  fjlig: Cx,
  flat: vx,
  fllig: Sx,
  fltns: _x,
  fnof: Dx,
  Fopf: Ex,
  fopf: Ax,
  forall: Mx,
  ForAll: Tx,
  fork: Ox,
  forkv: Nx,
  Fouriertrf: qx,
  fpartint: Rx,
  frac12: Ix,
  frac13: Fx,
  frac14: zx,
  frac15: Lx,
  frac16: Bx,
  frac18: Px,
  frac23: Vx,
  frac25: $x,
  frac34: Ux,
  frac35: Hx,
  frac38: jx,
  frac45: Wx,
  frac56: Jx,
  frac58: Gx,
  frac78: Kx,
  frasl: Zx,
  frown: Yx,
  fscr: Qx,
  Fscr: Xx,
  gacute: ew,
  Gamma: tw,
  gamma: nw,
  Gammad: rw,
  gammad: ow,
  gap: sw,
  Gbreve: iw,
  gbreve: lw,
  Gcedil: cw,
  Gcirc: aw,
  gcirc: uw,
  Gcy: fw,
  gcy: hw,
  Gdot: pw,
  gdot: dw,
  ge: mw,
  gE: gw,
  gEl: bw,
  gel: kw,
  geq: yw,
  geqq: xw,
  geqslant: ww,
  gescc: Cw,
  ges: vw,
  gesdot: Sw,
  gesdoto: _w,
  gesdotol: Dw,
  gesl: Ew,
  gesles: Aw,
  Gfr: Mw,
  gfr: Tw,
  gg: Ow,
  Gg: Nw,
  ggg: qw,
  gimel: Rw,
  GJcy: Iw,
  gjcy: Fw,
  gla: zw,
  gl: Lw,
  glE: Bw,
  glj: Pw,
  gnap: Vw,
  gnapprox: $w,
  gne: Uw,
  gnE: Hw,
  gneq: jw,
  gneqq: Ww,
  gnsim: Jw,
  Gopf: Gw,
  gopf: Kw,
  grave: Zw,
  GreaterEqual: Yw,
  GreaterEqualLess: Qw,
  GreaterFullEqual: Xw,
  GreaterGreater: eC,
  GreaterLess: tC,
  GreaterSlantEqual: nC,
  GreaterTilde: rC,
  Gscr: oC,
  gscr: sC,
  gsim: iC,
  gsime: lC,
  gsiml: cC,
  gtcc: aC,
  gtcir: uC,
  gt: fC,
  GT: hC,
  Gt: pC,
  gtdot: dC,
  gtlPar: mC,
  gtquest: gC,
  gtrapprox: bC,
  gtrarr: kC,
  gtrdot: yC,
  gtreqless: xC,
  gtreqqless: wC,
  gtrless: CC,
  gtrsim: vC,
  gvertneqq: SC,
  gvnE: _C,
  Hacek: DC,
  hairsp: EC,
  half: AC,
  hamilt: MC,
  HARDcy: TC,
  hardcy: OC,
  harrcir: NC,
  harr: qC,
  hArr: RC,
  harrw: IC,
  Hat: FC,
  hbar: zC,
  Hcirc: LC,
  hcirc: BC,
  hearts: PC,
  heartsuit: VC,
  hellip: $C,
  hercon: UC,
  hfr: HC,
  Hfr: jC,
  HilbertSpace: WC,
  hksearow: JC,
  hkswarow: GC,
  hoarr: KC,
  homtht: ZC,
  hookleftarrow: YC,
  hookrightarrow: QC,
  hopf: XC,
  Hopf: ev,
  horbar: tv,
  HorizontalLine: nv,
  hscr: rv,
  Hscr: ov,
  hslash: sv,
  Hstrok: iv,
  hstrok: lv,
  HumpDownHump: cv,
  HumpEqual: av,
  hybull: uv,
  hyphen: fv,
  Iacute: hv,
  iacute: pv,
  ic: dv,
  Icirc: mv,
  icirc: gv,
  Icy: bv,
  icy: kv,
  Idot: yv,
  IEcy: xv,
  iecy: wv,
  iexcl: Cv,
  iff: vv,
  ifr: Sv,
  Ifr: _v,
  Igrave: Dv,
  igrave: Ev,
  ii: Av,
  iiiint: Mv,
  iiint: Tv,
  iinfin: Ov,
  iiota: Nv,
  IJlig: qv,
  ijlig: Rv,
  Imacr: Iv,
  imacr: Fv,
  image: zv,
  ImaginaryI: Lv,
  imagline: Bv,
  imagpart: Pv,
  imath: Vv,
  Im: $v,
  imof: Uv,
  imped: Hv,
  Implies: jv,
  incare: Wv,
  in: "∈",
  infin: Jv,
  infintie: Gv,
  inodot: Kv,
  intcal: Zv,
  int: Yv,
  Int: Qv,
  integers: Xv,
  Integral: eS,
  intercal: tS,
  Intersection: nS,
  intlarhk: rS,
  intprod: oS,
  InvisibleComma: sS,
  InvisibleTimes: iS,
  IOcy: lS,
  iocy: cS,
  Iogon: aS,
  iogon: uS,
  Iopf: fS,
  iopf: hS,
  Iota: pS,
  iota: dS,
  iprod: mS,
  iquest: gS,
  iscr: bS,
  Iscr: kS,
  isin: yS,
  isindot: xS,
  isinE: wS,
  isins: CS,
  isinsv: vS,
  isinv: SS,
  it: _S,
  Itilde: DS,
  itilde: ES,
  Iukcy: AS,
  iukcy: MS,
  Iuml: TS,
  iuml: OS,
  Jcirc: NS,
  jcirc: qS,
  Jcy: RS,
  jcy: IS,
  Jfr: FS,
  jfr: zS,
  jmath: LS,
  Jopf: BS,
  jopf: PS,
  Jscr: VS,
  jscr: $S,
  Jsercy: US,
  jsercy: HS,
  Jukcy: jS,
  jukcy: WS,
  Kappa: JS,
  kappa: GS,
  kappav: KS,
  Kcedil: ZS,
  kcedil: YS,
  Kcy: QS,
  kcy: XS,
  Kfr: e_,
  kfr: t_,
  kgreen: n_,
  KHcy: r_,
  khcy: o_,
  KJcy: s_,
  kjcy: i_,
  Kopf: l_,
  kopf: c_,
  Kscr: a_,
  kscr: u_,
  lAarr: f_,
  Lacute: h_,
  lacute: p_,
  laemptyv: d_,
  lagran: m_,
  Lambda: g_,
  lambda: b_,
  lang: k_,
  Lang: y_,
  langd: x_,
  langle: w_,
  lap: C_,
  Laplacetrf: v_,
  laquo: S_,
  larrb: __,
  larrbfs: D_,
  larr: E_,
  Larr: A_,
  lArr: M_,
  larrfs: T_,
  larrhk: O_,
  larrlp: N_,
  larrpl: q_,
  larrsim: R_,
  larrtl: I_,
  latail: F_,
  lAtail: z_,
  lat: L_,
  late: B_,
  lates: P_,
  lbarr: V_,
  lBarr: $_,
  lbbrk: U_,
  lbrace: H_,
  lbrack: j_,
  lbrke: W_,
  lbrksld: J_,
  lbrkslu: G_,
  Lcaron: K_,
  lcaron: Z_,
  Lcedil: Y_,
  lcedil: Q_,
  lceil: X_,
  lcub: eD,
  Lcy: tD,
  lcy: nD,
  ldca: rD,
  ldquo: oD,
  ldquor: sD,
  ldrdhar: iD,
  ldrushar: lD,
  ldsh: cD,
  le: aD,
  lE: uD,
  LeftAngleBracket: fD,
  LeftArrowBar: hD,
  leftarrow: pD,
  LeftArrow: dD,
  Leftarrow: mD,
  LeftArrowRightArrow: gD,
  leftarrowtail: bD,
  LeftCeiling: kD,
  LeftDoubleBracket: yD,
  LeftDownTeeVector: xD,
  LeftDownVectorBar: wD,
  LeftDownVector: CD,
  LeftFloor: vD,
  leftharpoondown: SD,
  leftharpoonup: _D,
  leftleftarrows: DD,
  leftrightarrow: ED,
  LeftRightArrow: AD,
  Leftrightarrow: MD,
  leftrightarrows: TD,
  leftrightharpoons: OD,
  leftrightsquigarrow: ND,
  LeftRightVector: qD,
  LeftTeeArrow: RD,
  LeftTee: ID,
  LeftTeeVector: FD,
  leftthreetimes: zD,
  LeftTriangleBar: LD,
  LeftTriangle: BD,
  LeftTriangleEqual: PD,
  LeftUpDownVector: VD,
  LeftUpTeeVector: $D,
  LeftUpVectorBar: UD,
  LeftUpVector: HD,
  LeftVectorBar: jD,
  LeftVector: WD,
  lEg: JD,
  leg: GD,
  leq: KD,
  leqq: ZD,
  leqslant: YD,
  lescc: QD,
  les: XD,
  lesdot: eE,
  lesdoto: tE,
  lesdotor: nE,
  lesg: rE,
  lesges: oE,
  lessapprox: sE,
  lessdot: iE,
  lesseqgtr: lE,
  lesseqqgtr: cE,
  LessEqualGreater: aE,
  LessFullEqual: uE,
  LessGreater: fE,
  lessgtr: hE,
  LessLess: pE,
  lesssim: dE,
  LessSlantEqual: mE,
  LessTilde: gE,
  lfisht: bE,
  lfloor: kE,
  Lfr: yE,
  lfr: xE,
  lg: wE,
  lgE: CE,
  lHar: vE,
  lhard: SE,
  lharu: _E,
  lharul: DE,
  lhblk: EE,
  LJcy: AE,
  ljcy: ME,
  llarr: TE,
  ll: OE,
  Ll: NE,
  llcorner: qE,
  Lleftarrow: RE,
  llhard: IE,
  lltri: FE,
  Lmidot: zE,
  lmidot: LE,
  lmoustache: BE,
  lmoust: PE,
  lnap: VE,
  lnapprox: $E,
  lne: UE,
  lnE: HE,
  lneq: jE,
  lneqq: WE,
  lnsim: JE,
  loang: GE,
  loarr: KE,
  lobrk: ZE,
  longleftarrow: YE,
  LongLeftArrow: QE,
  Longleftarrow: XE,
  longleftrightarrow: eA,
  LongLeftRightArrow: tA,
  Longleftrightarrow: nA,
  longmapsto: rA,
  longrightarrow: oA,
  LongRightArrow: sA,
  Longrightarrow: iA,
  looparrowleft: lA,
  looparrowright: cA,
  lopar: aA,
  Lopf: uA,
  lopf: fA,
  loplus: hA,
  lotimes: pA,
  lowast: dA,
  lowbar: mA,
  LowerLeftArrow: gA,
  LowerRightArrow: bA,
  loz: kA,
  lozenge: yA,
  lozf: xA,
  lpar: wA,
  lparlt: CA,
  lrarr: vA,
  lrcorner: SA,
  lrhar: _A,
  lrhard: DA,
  lrm: EA,
  lrtri: AA,
  lsaquo: MA,
  lscr: TA,
  Lscr: OA,
  lsh: NA,
  Lsh: qA,
  lsim: RA,
  lsime: IA,
  lsimg: FA,
  lsqb: zA,
  lsquo: LA,
  lsquor: BA,
  Lstrok: PA,
  lstrok: VA,
  ltcc: $A,
  ltcir: UA,
  lt: HA,
  LT: jA,
  Lt: WA,
  ltdot: JA,
  lthree: GA,
  ltimes: KA,
  ltlarr: ZA,
  ltquest: YA,
  ltri: QA,
  ltrie: XA,
  ltrif: eM,
  ltrPar: tM,
  lurdshar: nM,
  luruhar: rM,
  lvertneqq: oM,
  lvnE: sM,
  macr: iM,
  male: lM,
  malt: cM,
  maltese: aM,
  Map: "⤅",
  map: uM,
  mapsto: fM,
  mapstodown: hM,
  mapstoleft: pM,
  mapstoup: dM,
  marker: mM,
  mcomma: gM,
  Mcy: bM,
  mcy: kM,
  mdash: yM,
  mDDot: xM,
  measuredangle: wM,
  MediumSpace: CM,
  Mellintrf: vM,
  Mfr: SM,
  mfr: _M,
  mho: DM,
  micro: EM,
  midast: AM,
  midcir: MM,
  mid: TM,
  middot: OM,
  minusb: NM,
  minus: qM,
  minusd: RM,
  minusdu: IM,
  MinusPlus: FM,
  mlcp: zM,
  mldr: LM,
  mnplus: BM,
  models: PM,
  Mopf: VM,
  mopf: $M,
  mp: UM,
  mscr: HM,
  Mscr: jM,
  mstpos: WM,
  Mu: JM,
  mu: GM,
  multimap: KM,
  mumap: ZM,
  nabla: YM,
  Nacute: QM,
  nacute: XM,
  nang: eT,
  nap: tT,
  napE: nT,
  napid: rT,
  napos: oT,
  napprox: sT,
  natural: iT,
  naturals: lT,
  natur: cT,
  nbsp: aT,
  nbump: uT,
  nbumpe: fT,
  ncap: hT,
  Ncaron: pT,
  ncaron: dT,
  Ncedil: mT,
  ncedil: gT,
  ncong: bT,
  ncongdot: kT,
  ncup: yT,
  Ncy: xT,
  ncy: wT,
  ndash: CT,
  nearhk: vT,
  nearr: ST,
  neArr: _T,
  nearrow: DT,
  ne: ET,
  nedot: AT,
  NegativeMediumSpace: MT,
  NegativeThickSpace: TT,
  NegativeThinSpace: OT,
  NegativeVeryThinSpace: NT,
  nequiv: qT,
  nesear: RT,
  nesim: IT,
  NestedGreaterGreater: FT,
  NestedLessLess: zT,
  NewLine: LT,
  nexist: BT,
  nexists: PT,
  Nfr: VT,
  nfr: $T,
  ngE: UT,
  nge: HT,
  ngeq: jT,
  ngeqq: WT,
  ngeqslant: JT,
  nges: GT,
  nGg: KT,
  ngsim: ZT,
  nGt: YT,
  ngt: QT,
  ngtr: XT,
  nGtv: eO,
  nharr: tO,
  nhArr: nO,
  nhpar: rO,
  ni: oO,
  nis: sO,
  nisd: iO,
  niv: lO,
  NJcy: cO,
  njcy: aO,
  nlarr: uO,
  nlArr: fO,
  nldr: hO,
  nlE: pO,
  nle: dO,
  nleftarrow: mO,
  nLeftarrow: gO,
  nleftrightarrow: bO,
  nLeftrightarrow: kO,
  nleq: yO,
  nleqq: xO,
  nleqslant: wO,
  nles: CO,
  nless: vO,
  nLl: SO,
  nlsim: _O,
  nLt: DO,
  nlt: EO,
  nltri: AO,
  nltrie: MO,
  nLtv: TO,
  nmid: OO,
  NoBreak: NO,
  NonBreakingSpace: qO,
  nopf: RO,
  Nopf: IO,
  Not: FO,
  not: zO,
  NotCongruent: LO,
  NotCupCap: BO,
  NotDoubleVerticalBar: PO,
  NotElement: VO,
  NotEqual: $O,
  NotEqualTilde: UO,
  NotExists: HO,
  NotGreater: jO,
  NotGreaterEqual: WO,
  NotGreaterFullEqual: JO,
  NotGreaterGreater: GO,
  NotGreaterLess: KO,
  NotGreaterSlantEqual: ZO,
  NotGreaterTilde: YO,
  NotHumpDownHump: QO,
  NotHumpEqual: XO,
  notin: eN,
  notindot: tN,
  notinE: nN,
  notinva: rN,
  notinvb: oN,
  notinvc: sN,
  NotLeftTriangleBar: iN,
  NotLeftTriangle: lN,
  NotLeftTriangleEqual: cN,
  NotLess: aN,
  NotLessEqual: uN,
  NotLessGreater: fN,
  NotLessLess: hN,
  NotLessSlantEqual: pN,
  NotLessTilde: dN,
  NotNestedGreaterGreater: mN,
  NotNestedLessLess: gN,
  notni: bN,
  notniva: kN,
  notnivb: yN,
  notnivc: xN,
  NotPrecedes: wN,
  NotPrecedesEqual: CN,
  NotPrecedesSlantEqual: vN,
  NotReverseElement: SN,
  NotRightTriangleBar: _N,
  NotRightTriangle: DN,
  NotRightTriangleEqual: EN,
  NotSquareSubset: AN,
  NotSquareSubsetEqual: MN,
  NotSquareSuperset: TN,
  NotSquareSupersetEqual: ON,
  NotSubset: NN,
  NotSubsetEqual: qN,
  NotSucceeds: RN,
  NotSucceedsEqual: IN,
  NotSucceedsSlantEqual: FN,
  NotSucceedsTilde: zN,
  NotSuperset: LN,
  NotSupersetEqual: BN,
  NotTilde: PN,
  NotTildeEqual: VN,
  NotTildeFullEqual: $N,
  NotTildeTilde: UN,
  NotVerticalBar: HN,
  nparallel: jN,
  npar: WN,
  nparsl: JN,
  npart: GN,
  npolint: KN,
  npr: ZN,
  nprcue: YN,
  nprec: QN,
  npreceq: XN,
  npre: e2,
  nrarrc: t2,
  nrarr: n2,
  nrArr: r2,
  nrarrw: o2,
  nrightarrow: s2,
  nRightarrow: i2,
  nrtri: l2,
  nrtrie: c2,
  nsc: a2,
  nsccue: u2,
  nsce: f2,
  Nscr: h2,
  nscr: p2,
  nshortmid: d2,
  nshortparallel: m2,
  nsim: g2,
  nsime: b2,
  nsimeq: k2,
  nsmid: y2,
  nspar: x2,
  nsqsube: w2,
  nsqsupe: C2,
  nsub: v2,
  nsubE: S2,
  nsube: _2,
  nsubset: D2,
  nsubseteq: E2,
  nsubseteqq: A2,
  nsucc: M2,
  nsucceq: T2,
  nsup: O2,
  nsupE: N2,
  nsupe: q2,
  nsupset: R2,
  nsupseteq: I2,
  nsupseteqq: F2,
  ntgl: z2,
  Ntilde: L2,
  ntilde: B2,
  ntlg: P2,
  ntriangleleft: V2,
  ntrianglelefteq: $2,
  ntriangleright: U2,
  ntrianglerighteq: H2,
  Nu: j2,
  nu: W2,
  num: J2,
  numero: G2,
  numsp: K2,
  nvap: Z2,
  nvdash: Y2,
  nvDash: Q2,
  nVdash: X2,
  nVDash: eq,
  nvge: tq,
  nvgt: nq,
  nvHarr: rq,
  nvinfin: oq,
  nvlArr: sq,
  nvle: iq,
  nvlt: lq,
  nvltrie: cq,
  nvrArr: aq,
  nvrtrie: uq,
  nvsim: fq,
  nwarhk: hq,
  nwarr: pq,
  nwArr: dq,
  nwarrow: mq,
  nwnear: gq,
  Oacute: bq,
  oacute: kq,
  oast: yq,
  Ocirc: xq,
  ocirc: wq,
  ocir: Cq,
  Ocy: vq,
  ocy: Sq,
  odash: _q,
  Odblac: Dq,
  odblac: Eq,
  odiv: Aq,
  odot: Mq,
  odsold: Tq,
  OElig: Oq,
  oelig: Nq,
  ofcir: qq,
  Ofr: Rq,
  ofr: Iq,
  ogon: Fq,
  Ograve: zq,
  ograve: Lq,
  ogt: Bq,
  ohbar: Pq,
  ohm: Vq,
  oint: $q,
  olarr: Uq,
  olcir: Hq,
  olcross: jq,
  oline: Wq,
  olt: Jq,
  Omacr: Gq,
  omacr: Kq,
  Omega: Zq,
  omega: Yq,
  Omicron: Qq,
  omicron: Xq,
  omid: eR,
  ominus: tR,
  Oopf: nR,
  oopf: rR,
  opar: oR,
  OpenCurlyDoubleQuote: sR,
  OpenCurlyQuote: iR,
  operp: lR,
  oplus: cR,
  orarr: aR,
  Or: uR,
  or: fR,
  ord: hR,
  order: pR,
  orderof: dR,
  ordf: mR,
  ordm: gR,
  origof: bR,
  oror: kR,
  orslope: yR,
  orv: xR,
  oS: wR,
  Oscr: CR,
  oscr: vR,
  Oslash: SR,
  oslash: _R,
  osol: DR,
  Otilde: ER,
  otilde: AR,
  otimesas: MR,
  Otimes: TR,
  otimes: OR,
  Ouml: NR,
  ouml: qR,
  ovbar: RR,
  OverBar: IR,
  OverBrace: FR,
  OverBracket: zR,
  OverParenthesis: LR,
  para: BR,
  parallel: PR,
  par: VR,
  parsim: $R,
  parsl: UR,
  part: HR,
  PartialD: jR,
  Pcy: WR,
  pcy: JR,
  percnt: GR,
  period: KR,
  permil: ZR,
  perp: YR,
  pertenk: QR,
  Pfr: XR,
  pfr: eI,
  Phi: tI,
  phi: nI,
  phiv: rI,
  phmmat: oI,
  phone: sI,
  Pi: iI,
  pi: lI,
  pitchfork: cI,
  piv: aI,
  planck: uI,
  planckh: fI,
  plankv: hI,
  plusacir: pI,
  plusb: dI,
  pluscir: mI,
  plus: gI,
  plusdo: bI,
  plusdu: kI,
  pluse: yI,
  PlusMinus: xI,
  plusmn: wI,
  plussim: CI,
  plustwo: vI,
  pm: SI,
  Poincareplane: _I,
  pointint: DI,
  popf: EI,
  Popf: AI,
  pound: MI,
  prap: TI,
  Pr: OI,
  pr: NI,
  prcue: qI,
  precapprox: RI,
  prec: II,
  preccurlyeq: FI,
  Precedes: zI,
  PrecedesEqual: LI,
  PrecedesSlantEqual: BI,
  PrecedesTilde: PI,
  preceq: VI,
  precnapprox: $I,
  precneqq: UI,
  precnsim: HI,
  pre: jI,
  prE: WI,
  precsim: JI,
  prime: GI,
  Prime: KI,
  primes: ZI,
  prnap: YI,
  prnE: QI,
  prnsim: XI,
  prod: eF,
  Product: tF,
  profalar: nF,
  profline: rF,
  profsurf: oF,
  prop: sF,
  Proportional: iF,
  Proportion: lF,
  propto: cF,
  prsim: aF,
  prurel: uF,
  Pscr: fF,
  pscr: hF,
  Psi: pF,
  psi: dF,
  puncsp: mF,
  Qfr: gF,
  qfr: bF,
  qint: kF,
  qopf: yF,
  Qopf: xF,
  qprime: wF,
  Qscr: CF,
  qscr: vF,
  quaternions: SF,
  quatint: _F,
  quest: DF,
  questeq: EF,
  quot: AF,
  QUOT: MF,
  rAarr: TF,
  race: OF,
  Racute: NF,
  racute: qF,
  radic: RF,
  raemptyv: IF,
  rang: FF,
  Rang: zF,
  rangd: LF,
  range: BF,
  rangle: PF,
  raquo: VF,
  rarrap: $F,
  rarrb: UF,
  rarrbfs: HF,
  rarrc: jF,
  rarr: WF,
  Rarr: JF,
  rArr: GF,
  rarrfs: KF,
  rarrhk: ZF,
  rarrlp: YF,
  rarrpl: QF,
  rarrsim: XF,
  Rarrtl: ez,
  rarrtl: tz,
  rarrw: nz,
  ratail: rz,
  rAtail: oz,
  ratio: sz,
  rationals: iz,
  rbarr: lz,
  rBarr: cz,
  RBarr: az,
  rbbrk: uz,
  rbrace: fz,
  rbrack: hz,
  rbrke: pz,
  rbrksld: dz,
  rbrkslu: mz,
  Rcaron: gz,
  rcaron: bz,
  Rcedil: kz,
  rcedil: yz,
  rceil: xz,
  rcub: wz,
  Rcy: Cz,
  rcy: vz,
  rdca: Sz,
  rdldhar: _z,
  rdquo: Dz,
  rdquor: Ez,
  rdsh: Az,
  real: Mz,
  realine: Tz,
  realpart: Oz,
  reals: Nz,
  Re: qz,
  rect: Rz,
  reg: Iz,
  REG: Fz,
  ReverseElement: zz,
  ReverseEquilibrium: Lz,
  ReverseUpEquilibrium: Bz,
  rfisht: Pz,
  rfloor: Vz,
  rfr: $z,
  Rfr: Uz,
  rHar: Hz,
  rhard: jz,
  rharu: Wz,
  rharul: Jz,
  Rho: Gz,
  rho: Kz,
  rhov: Zz,
  RightAngleBracket: Yz,
  RightArrowBar: Qz,
  rightarrow: Xz,
  RightArrow: eL,
  Rightarrow: tL,
  RightArrowLeftArrow: nL,
  rightarrowtail: rL,
  RightCeiling: oL,
  RightDoubleBracket: sL,
  RightDownTeeVector: iL,
  RightDownVectorBar: lL,
  RightDownVector: cL,
  RightFloor: aL,
  rightharpoondown: uL,
  rightharpoonup: fL,
  rightleftarrows: hL,
  rightleftharpoons: pL,
  rightrightarrows: dL,
  rightsquigarrow: mL,
  RightTeeArrow: gL,
  RightTee: bL,
  RightTeeVector: kL,
  rightthreetimes: yL,
  RightTriangleBar: xL,
  RightTriangle: wL,
  RightTriangleEqual: CL,
  RightUpDownVector: vL,
  RightUpTeeVector: SL,
  RightUpVectorBar: _L,
  RightUpVector: DL,
  RightVectorBar: EL,
  RightVector: AL,
  ring: ML,
  risingdotseq: TL,
  rlarr: OL,
  rlhar: NL,
  rlm: qL,
  rmoustache: RL,
  rmoust: IL,
  rnmid: FL,
  roang: zL,
  roarr: LL,
  robrk: BL,
  ropar: PL,
  ropf: VL,
  Ropf: $L,
  roplus: UL,
  rotimes: HL,
  RoundImplies: jL,
  rpar: WL,
  rpargt: JL,
  rppolint: GL,
  rrarr: KL,
  Rrightarrow: ZL,
  rsaquo: YL,
  rscr: QL,
  Rscr: XL,
  rsh: eB,
  Rsh: tB,
  rsqb: nB,
  rsquo: rB,
  rsquor: oB,
  rthree: sB,
  rtimes: iB,
  rtri: lB,
  rtrie: cB,
  rtrif: aB,
  rtriltri: uB,
  RuleDelayed: fB,
  ruluhar: hB,
  rx: pB,
  Sacute: dB,
  sacute: mB,
  sbquo: gB,
  scap: bB,
  Scaron: kB,
  scaron: yB,
  Sc: xB,
  sc: wB,
  sccue: CB,
  sce: vB,
  scE: SB,
  Scedil: _B,
  scedil: DB,
  Scirc: EB,
  scirc: AB,
  scnap: MB,
  scnE: TB,
  scnsim: OB,
  scpolint: NB,
  scsim: qB,
  Scy: RB,
  scy: IB,
  sdotb: FB,
  sdot: zB,
  sdote: LB,
  searhk: BB,
  searr: PB,
  seArr: VB,
  searrow: $B,
  sect: UB,
  semi: HB,
  seswar: jB,
  setminus: WB,
  setmn: JB,
  sext: GB,
  Sfr: KB,
  sfr: ZB,
  sfrown: YB,
  sharp: QB,
  SHCHcy: XB,
  shchcy: eP,
  SHcy: tP,
  shcy: nP,
  ShortDownArrow: rP,
  ShortLeftArrow: oP,
  shortmid: sP,
  shortparallel: iP,
  ShortRightArrow: lP,
  ShortUpArrow: cP,
  shy: aP,
  Sigma: uP,
  sigma: fP,
  sigmaf: hP,
  sigmav: pP,
  sim: dP,
  simdot: mP,
  sime: gP,
  simeq: bP,
  simg: kP,
  simgE: yP,
  siml: xP,
  simlE: wP,
  simne: CP,
  simplus: vP,
  simrarr: SP,
  slarr: _P,
  SmallCircle: DP,
  smallsetminus: EP,
  smashp: AP,
  smeparsl: MP,
  smid: TP,
  smile: OP,
  smt: NP,
  smte: qP,
  smtes: RP,
  SOFTcy: IP,
  softcy: FP,
  solbar: zP,
  solb: LP,
  sol: BP,
  Sopf: PP,
  sopf: VP,
  spades: $P,
  spadesuit: UP,
  spar: HP,
  sqcap: jP,
  sqcaps: WP,
  sqcup: JP,
  sqcups: GP,
  Sqrt: KP,
  sqsub: ZP,
  sqsube: YP,
  sqsubset: QP,
  sqsubseteq: XP,
  sqsup: e3,
  sqsupe: t3,
  sqsupset: n3,
  sqsupseteq: r3,
  square: o3,
  Square: s3,
  SquareIntersection: i3,
  SquareSubset: l3,
  SquareSubsetEqual: c3,
  SquareSuperset: a3,
  SquareSupersetEqual: u3,
  SquareUnion: f3,
  squarf: h3,
  squ: p3,
  squf: d3,
  srarr: m3,
  Sscr: g3,
  sscr: b3,
  ssetmn: k3,
  ssmile: y3,
  sstarf: x3,
  Star: w3,
  star: C3,
  starf: v3,
  straightepsilon: S3,
  straightphi: _3,
  strns: D3,
  sub: E3,
  Sub: A3,
  subdot: M3,
  subE: T3,
  sube: O3,
  subedot: N3,
  submult: q3,
  subnE: R3,
  subne: I3,
  subplus: F3,
  subrarr: z3,
  subset: L3,
  Subset: B3,
  subseteq: P3,
  subseteqq: V3,
  SubsetEqual: $3,
  subsetneq: U3,
  subsetneqq: H3,
  subsim: j3,
  subsub: W3,
  subsup: J3,
  succapprox: G3,
  succ: K3,
  succcurlyeq: Z3,
  Succeeds: Y3,
  SucceedsEqual: Q3,
  SucceedsSlantEqual: X3,
  SucceedsTilde: e5,
  succeq: t5,
  succnapprox: n5,
  succneqq: r5,
  succnsim: o5,
  succsim: s5,
  SuchThat: i5,
  sum: l5,
  Sum: c5,
  sung: a5,
  sup1: u5,
  sup2: f5,
  sup3: h5,
  sup: p5,
  Sup: d5,
  supdot: m5,
  supdsub: g5,
  supE: b5,
  supe: k5,
  supedot: y5,
  Superset: x5,
  SupersetEqual: w5,
  suphsol: C5,
  suphsub: v5,
  suplarr: S5,
  supmult: _5,
  supnE: D5,
  supne: E5,
  supplus: A5,
  supset: M5,
  Supset: T5,
  supseteq: O5,
  supseteqq: N5,
  supsetneq: q5,
  supsetneqq: R5,
  supsim: I5,
  supsub: F5,
  supsup: z5,
  swarhk: L5,
  swarr: B5,
  swArr: P5,
  swarrow: V5,
  swnwar: $5,
  szlig: U5,
  Tab: H5,
  target: j5,
  Tau: W5,
  tau: J5,
  tbrk: G5,
  Tcaron: K5,
  tcaron: Z5,
  Tcedil: Y5,
  tcedil: Q5,
  Tcy: X5,
  tcy: eV,
  tdot: tV,
  telrec: nV,
  Tfr: rV,
  tfr: oV,
  there4: sV,
  therefore: iV,
  Therefore: lV,
  Theta: cV,
  theta: aV,
  thetasym: uV,
  thetav: fV,
  thickapprox: hV,
  thicksim: pV,
  ThickSpace: dV,
  ThinSpace: mV,
  thinsp: gV,
  thkap: bV,
  thksim: kV,
  THORN: yV,
  thorn: xV,
  tilde: wV,
  Tilde: CV,
  TildeEqual: vV,
  TildeFullEqual: SV,
  TildeTilde: _V,
  timesbar: DV,
  timesb: EV,
  times: AV,
  timesd: MV,
  tint: TV,
  toea: OV,
  topbot: NV,
  topcir: qV,
  top: RV,
  Topf: IV,
  topf: FV,
  topfork: zV,
  tosa: LV,
  tprime: BV,
  trade: PV,
  TRADE: VV,
  triangle: $V,
  triangledown: UV,
  triangleleft: HV,
  trianglelefteq: jV,
  triangleq: WV,
  triangleright: JV,
  trianglerighteq: GV,
  tridot: KV,
  trie: ZV,
  triminus: YV,
  TripleDot: QV,
  triplus: XV,
  trisb: e8,
  tritime: t8,
  trpezium: n8,
  Tscr: r8,
  tscr: o8,
  TScy: s8,
  tscy: i8,
  TSHcy: l8,
  tshcy: c8,
  Tstrok: a8,
  tstrok: u8,
  twixt: f8,
  twoheadleftarrow: h8,
  twoheadrightarrow: p8,
  Uacute: d8,
  uacute: m8,
  uarr: g8,
  Uarr: b8,
  uArr: k8,
  Uarrocir: y8,
  Ubrcy: x8,
  ubrcy: w8,
  Ubreve: C8,
  ubreve: v8,
  Ucirc: S8,
  ucirc: _8,
  Ucy: D8,
  ucy: E8,
  udarr: A8,
  Udblac: M8,
  udblac: T8,
  udhar: O8,
  ufisht: N8,
  Ufr: q8,
  ufr: R8,
  Ugrave: I8,
  ugrave: F8,
  uHar: z8,
  uharl: L8,
  uharr: B8,
  uhblk: P8,
  ulcorn: V8,
  ulcorner: $8,
  ulcrop: U8,
  ultri: H8,
  Umacr: j8,
  umacr: W8,
  uml: J8,
  UnderBar: G8,
  UnderBrace: K8,
  UnderBracket: Z8,
  UnderParenthesis: Y8,
  Union: Q8,
  UnionPlus: X8,
  Uogon: e4,
  uogon: t4,
  Uopf: n4,
  uopf: r4,
  UpArrowBar: o4,
  uparrow: s4,
  UpArrow: i4,
  Uparrow: l4,
  UpArrowDownArrow: c4,
  updownarrow: a4,
  UpDownArrow: u4,
  Updownarrow: f4,
  UpEquilibrium: h4,
  upharpoonleft: p4,
  upharpoonright: d4,
  uplus: m4,
  UpperLeftArrow: g4,
  UpperRightArrow: b4,
  upsi: k4,
  Upsi: y4,
  upsih: x4,
  Upsilon: w4,
  upsilon: C4,
  UpTeeArrow: v4,
  UpTee: S4,
  upuparrows: _4,
  urcorn: D4,
  urcorner: E4,
  urcrop: A4,
  Uring: M4,
  uring: T4,
  urtri: O4,
  Uscr: N4,
  uscr: q4,
  utdot: R4,
  Utilde: I4,
  utilde: F4,
  utri: z4,
  utrif: L4,
  uuarr: B4,
  Uuml: P4,
  uuml: V4,
  uwangle: $4,
  vangrt: U4,
  varepsilon: H4,
  varkappa: j4,
  varnothing: W4,
  varphi: J4,
  varpi: G4,
  varpropto: K4,
  varr: Z4,
  vArr: Y4,
  varrho: Q4,
  varsigma: X4,
  varsubsetneq: e6,
  varsubsetneqq: t6,
  varsupsetneq: n6,
  varsupsetneqq: r6,
  vartheta: o6,
  vartriangleleft: s6,
  vartriangleright: i6,
  vBar: l6,
  Vbar: c6,
  vBarv: a6,
  Vcy: u6,
  vcy: f6,
  vdash: h6,
  vDash: p6,
  Vdash: d6,
  VDash: m6,
  Vdashl: g6,
  veebar: b6,
  vee: k6,
  Vee: y6,
  veeeq: x6,
  vellip: w6,
  verbar: C6,
  Verbar: v6,
  vert: S6,
  Vert: _6,
  VerticalBar: D6,
  VerticalLine: E6,
  VerticalSeparator: A6,
  VerticalTilde: M6,
  VeryThinSpace: T6,
  Vfr: O6,
  vfr: N6,
  vltri: q6,
  vnsub: R6,
  vnsup: I6,
  Vopf: F6,
  vopf: z6,
  vprop: L6,
  vrtri: B6,
  Vscr: P6,
  vscr: V6,
  vsubnE: $6,
  vsubne: U6,
  vsupnE: H6,
  vsupne: j6,
  Vvdash: W6,
  vzigzag: J6,
  Wcirc: G6,
  wcirc: K6,
  wedbar: Z6,
  wedge: Y6,
  Wedge: Q6,
  wedgeq: X6,
  weierp: e$,
  Wfr: t$,
  wfr: n$,
  Wopf: r$,
  wopf: o$,
  wp: s$,
  wr: i$,
  wreath: l$,
  Wscr: c$,
  wscr: a$,
  xcap: u$,
  xcirc: f$,
  xcup: h$,
  xdtri: p$,
  Xfr: d$,
  xfr: m$,
  xharr: g$,
  xhArr: b$,
  Xi: k$,
  xi: y$,
  xlarr: x$,
  xlArr: w$,
  xmap: C$,
  xnis: v$,
  xodot: S$,
  Xopf: _$,
  xopf: D$,
  xoplus: E$,
  xotime: A$,
  xrarr: M$,
  xrArr: T$,
  Xscr: O$,
  xscr: N$,
  xsqcup: q$,
  xuplus: R$,
  xutri: I$,
  xvee: F$,
  xwedge: z$,
  Yacute: L$,
  yacute: B$,
  YAcy: P$,
  yacy: V$,
  Ycirc: $$,
  ycirc: U$,
  Ycy: H$,
  ycy: j$,
  yen: W$,
  Yfr: J$,
  yfr: G$,
  YIcy: K$,
  yicy: Z$,
  Yopf: Y$,
  yopf: Q$,
  Yscr: X$,
  yscr: e9,
  YUcy: t9,
  yucy: n9,
  yuml: r9,
  Yuml: o9,
  Zacute: s9,
  zacute: i9,
  Zcaron: l9,
  zcaron: c9,
  Zcy: a9,
  zcy: u9,
  Zdot: f9,
  zdot: h9,
  zeetrf: p9,
  ZeroWidthSpace: d9,
  Zeta: m9,
  zeta: g9,
  zfr: b9,
  Zfr: k9,
  ZHcy: y9,
  zhcy: x9,
  zigrarr: w9,
  zopf: C9,
  Zopf: v9,
  Zscr: S9,
  zscr: _9,
  zwj: D9,
  zwnj: E9
};
var Zl = A9, ko = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/, Ct = {}, Ms = {};
function M9(n) {
  var e, t, r = Ms[n];
  if (r)
    return r;
  for (r = Ms[n] = [], e = 0; e < 128; e++)
    t = String.fromCharCode(e), /^[0-9a-z]$/i.test(t) ? r.push(t) : r.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
  for (e = 0; e < n.length; e++)
    r[n.charCodeAt(e)] = n[e];
  return r;
}
function zn(n, e, t) {
  var r, o, s, i, l, c = "";
  for (typeof e != "string" && (t = e, e = zn.defaultChars), typeof t > "u" && (t = !0), l = M9(e), r = 0, o = n.length; r < o; r++) {
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
zn.defaultChars = ";/?:@&=+$,-_.!~*'()#";
zn.componentChars = "-_.!~*'()";
var T9 = zn, Ts = {};
function O9(n) {
  var e, t, r = Ts[n];
  if (r)
    return r;
  for (r = Ts[n] = [], e = 0; e < 128; e++)
    t = String.fromCharCode(e), r.push(t);
  for (e = 0; e < n.length; e++)
    t = n.charCodeAt(e), r[t] = "%" + ("0" + t.toString(16).toUpperCase()).slice(-2);
  return r;
}
function Ln(n, e) {
  var t;
  return typeof e != "string" && (e = Ln.defaultChars), t = O9(e), n.replace(/(%[a-f0-9]{2})+/gi, function(r) {
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
Ln.defaultChars = ";/?:@&=+$,#";
Ln.componentChars = "";
var N9 = Ln, q9 = function(e) {
  var t = "";
  return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
};
function En() {
  this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
var R9 = /^([a-z0-9.+-]+:)/i, I9 = /:[0-9]*$/, F9 = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, z9 = ["<", ">", '"', "`", " ", "\r", `
`, "	"], L9 = ["{", "}", "|", "\\", "^", "`"].concat(z9), B9 = ["'"].concat(L9), Os = ["%", "/", "?", ";", "#"].concat(B9), Ns = ["/", "?", "#"], P9 = 255, qs = /^[+a-z0-9A-Z_-]{0,63}$/, V9 = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, Rs = {
  javascript: !0,
  "javascript:": !0
}, Is = {
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
function $9(n, e) {
  if (n && n instanceof En)
    return n;
  var t = new En();
  return t.parse(n, e), t;
}
En.prototype.parse = function(n, e) {
  var t, r, o, s, i, l = n;
  if (l = l.trim(), !e && n.split("#").length === 1) {
    var c = F9.exec(l);
    if (c)
      return this.pathname = c[1], c[2] && (this.search = c[2]), this;
  }
  var a = R9.exec(l);
  if (a && (a = a[0], o = a.toLowerCase(), this.protocol = a, l = l.substr(a.length)), (e || a || l.match(/^\/\/[^@\/]+@[^@\/]+/)) && (i = l.substr(0, 2) === "//", i && !(a && Rs[a]) && (l = l.substr(2), this.slashes = !0)), !Rs[a] && (i || a && !Is[a])) {
    var u = -1;
    for (t = 0; t < Ns.length; t++)
      s = l.indexOf(Ns[t]), s !== -1 && (u === -1 || s < u) && (u = s);
    var f, h;
    for (u === -1 ? h = l.lastIndexOf("@") : h = l.lastIndexOf("@", u), h !== -1 && (f = l.slice(0, h), l = l.slice(h + 1), this.auth = f), u = -1, t = 0; t < Os.length; t++)
      s = l.indexOf(Os[t]), s !== -1 && (u === -1 || s < u) && (u = s);
    u === -1 && (u = l.length), l[u - 1] === ":" && u--;
    var p = l.slice(0, u);
    l = l.slice(u), this.parseHost(p), this.hostname = this.hostname || "";
    var d = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!d) {
      var m = this.hostname.split(/\./);
      for (t = 0, r = m.length; t < r; t++) {
        var g = m[t];
        if (g && !g.match(qs)) {
          for (var b = "", y = 0, S = g.length; y < S; y++)
            g.charCodeAt(y) > 127 ? b += "x" : b += g[y];
          if (!b.match(qs)) {
            var E = m.slice(0, t), A = m.slice(t + 1), x = g.match(V9);
            x && (E.push(x[1]), A.unshift(x[2])), A.length && (l = A.join(".") + l), this.hostname = E.join(".");
            break;
          }
        }
      }
    }
    this.hostname.length > P9 && (this.hostname = ""), d && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
  }
  var N = l.indexOf("#");
  N !== -1 && (this.hash = l.substr(N), l = l.slice(0, N));
  var F = l.indexOf("?");
  return F !== -1 && (this.search = l.substr(F), l = l.slice(0, F)), l && (this.pathname = l), Is[o] && this.hostname && !this.pathname && (this.pathname = ""), this;
};
En.prototype.parseHost = function(n) {
  var e = I9.exec(n);
  e && (e = e[0], e !== ":" && (this.port = e.substr(1)), n = n.substr(0, n.length - e.length)), n && (this.hostname = n);
};
var U9 = $9;
Ct.encode = T9;
Ct.decode = N9;
Ct.format = q9;
Ct.parse = U9;
var je = {}, ar, Fs;
function Yl() {
  return Fs || (Fs = 1, ar = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/), ar;
}
var ur, zs;
function Ql() {
  return zs || (zs = 1, ur = /[\0-\x1F\x7F-\x9F]/), ur;
}
var fr, Ls;
function H9() {
  return Ls || (Ls = 1, fr = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/), fr;
}
var hr, Bs;
function Xl() {
  return Bs || (Bs = 1, hr = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/), hr;
}
var Ps;
function j9() {
  return Ps || (Ps = 1, je.Any = Yl(), je.Cc = Ql(), je.Cf = H9(), je.P = ko, je.Z = Xl()), je;
}
(function(n) {
  function e(w) {
    return Object.prototype.toString.call(w);
  }
  function t(w) {
    return e(w) === "[object String]";
  }
  var r = Object.prototype.hasOwnProperty;
  function o(w, q) {
    return r.call(w, q);
  }
  function s(w) {
    var q = Array.prototype.slice.call(arguments, 1);
    return q.forEach(function(v) {
      if (v) {
        if (typeof v != "object")
          throw new TypeError(v + "must be object");
        Object.keys(v).forEach(function(Ae) {
          w[Ae] = v[Ae];
        });
      }
    }), w;
  }
  function i(w, q, v) {
    return [].concat(w.slice(0, q), v, w.slice(q + 1));
  }
  function l(w) {
    return !(w >= 55296 && w <= 57343 || w >= 64976 && w <= 65007 || (w & 65535) === 65535 || (w & 65535) === 65534 || w >= 0 && w <= 8 || w === 11 || w >= 14 && w <= 31 || w >= 127 && w <= 159 || w > 1114111);
  }
  function c(w) {
    if (w > 65535) {
      w -= 65536;
      var q = 55296 + (w >> 10), v = 56320 + (w & 1023);
      return String.fromCharCode(q, v);
    }
    return String.fromCharCode(w);
  }
  var a = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g, u = /&([a-z#][a-z0-9]{1,31});/gi, f = new RegExp(a.source + "|" + u.source, "gi"), h = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i, p = Zl;
  function d(w, q) {
    var v;
    return o(p, q) ? p[q] : q.charCodeAt(0) === 35 && h.test(q) && (v = q[1].toLowerCase() === "x" ? parseInt(q.slice(2), 16) : parseInt(q.slice(1), 10), l(v)) ? c(v) : w;
  }
  function m(w) {
    return w.indexOf("\\") < 0 ? w : w.replace(a, "$1");
  }
  function g(w) {
    return w.indexOf("\\") < 0 && w.indexOf("&") < 0 ? w : w.replace(f, function(q, v, Ae) {
      return v || d(q, Ae);
    });
  }
  var b = /[&<>"]/, y = /[&<>"]/g, S = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  };
  function E(w) {
    return S[w];
  }
  function A(w) {
    return b.test(w) ? w.replace(y, E) : w;
  }
  var x = /[.?*+^$[\]\\(){}|-]/g;
  function N(w) {
    return w.replace(x, "\\$&");
  }
  function F(w) {
    switch (w) {
      case 9:
      case 32:
        return !0;
    }
    return !1;
  }
  function D(w) {
    if (w >= 8192 && w <= 8202)
      return !0;
    switch (w) {
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
  var M = ko;
  function G(w) {
    return M.test(w);
  }
  function Ee(w) {
    switch (w) {
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
  function _t(w) {
    return w = w.trim().replace(/\s+/g, " "), "ẞ".toLowerCase() === "Ṿ" && (w = w.replace(/ẞ/g, "ß")), w.toLowerCase().toUpperCase();
  }
  n.lib = {}, n.lib.mdurl = Ct, n.lib.ucmicro = j9(), n.assign = s, n.isString = t, n.has = o, n.unescapeMd = m, n.unescapeAll = g, n.isValidEntityCode = l, n.fromCodePoint = c, n.escapeHtml = A, n.arrayReplaceAt = i, n.isSpace = F, n.isWhiteSpace = D, n.isMdAsciiPunct = Ee, n.isPunctChar = G, n.escapeRE = N, n.normalizeReference = _t;
})(R);
var Bn = {}, W9 = function(e, t, r) {
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
}, Vs = R.unescapeAll, J9 = function(e, t, r) {
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
        return l.pos = i + 1, l.str = Vs(e.slice(t + 1, i)), l.ok = !0, l;
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
  return t === i || s !== 0 || (l.str = Vs(e.slice(t, i)), l.pos = i, l.ok = !0), l;
}, G9 = R.unescapeAll, K9 = function(e, t, r) {
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
      return c.pos = l + 1, c.lines = i, c.str = G9(e.slice(t + 1, l)), c.ok = !0, c;
    if (o === 40 && s === 41)
      return c;
    o === 10 ? i++ : o === 92 && l + 1 < r && (l++, e.charCodeAt(l) === 10 && i++), l++;
  }
  return c;
};
Bn.parseLinkLabel = W9;
Bn.parseLinkDestination = J9;
Bn.parseLinkTitle = K9;
var Z9 = R.assign, Y9 = R.unescapeAll, ot = R.escapeHtml, xe = {};
xe.code_inline = function(n, e, t, r, o) {
  var s = n[e];
  return "<code" + o.renderAttrs(s) + ">" + ot(s.content) + "</code>";
};
xe.code_block = function(n, e, t, r, o) {
  var s = n[e];
  return "<pre" + o.renderAttrs(s) + "><code>" + ot(n[e].content) + `</code></pre>
`;
};
xe.fence = function(n, e, t, r, o) {
  var s = n[e], i = s.info ? Y9(s.info).trim() : "", l = "", c = "", a, u, f, h, p;
  return i && (f = i.split(/(\s+)/g), l = f[0], c = f.slice(2).join("")), t.highlight ? a = t.highlight(s.content, l, c) || ot(s.content) : a = ot(s.content), a.indexOf("<pre") === 0 ? a + `
` : i ? (u = s.attrIndex("class"), h = s.attrs ? s.attrs.slice() : [], u < 0 ? h.push(["class", t.langPrefix + l]) : (h[u] = h[u].slice(), h[u][1] += " " + t.langPrefix + l), p = {
    attrs: h
  }, "<pre><code" + o.renderAttrs(p) + ">" + a + `</code></pre>
`) : "<pre><code" + o.renderAttrs(s) + ">" + a + `</code></pre>
`;
};
xe.image = function(n, e, t, r, o) {
  var s = n[e];
  return s.attrs[s.attrIndex("alt")][1] = o.renderInlineAsText(s.children, t, r), o.renderToken(n, e, t);
};
xe.hardbreak = function(n, e, t) {
  return t.xhtmlOut ? `<br />
` : `<br>
`;
};
xe.softbreak = function(n, e, t) {
  return t.breaks ? t.xhtmlOut ? `<br />
` : `<br>
` : `
`;
};
xe.text = function(n, e) {
  return ot(n[e].content);
};
xe.html_block = function(n, e) {
  return n[e].content;
};
xe.html_inline = function(n, e) {
  return n[e].content;
};
function vt() {
  this.rules = Z9({}, xe);
}
vt.prototype.renderAttrs = function(e) {
  var t, r, o;
  if (!e.attrs)
    return "";
  for (o = "", t = 0, r = e.attrs.length; t < r; t++)
    o += " " + ot(e.attrs[t][0]) + '="' + ot(e.attrs[t][1]) + '"';
  return o;
};
vt.prototype.renderToken = function(e, t, r) {
  var o, s = "", i = !1, l = e[t];
  return l.hidden ? "" : (l.block && l.nesting !== -1 && t && e[t - 1].hidden && (s += `
`), s += (l.nesting === -1 ? "</" : "<") + l.tag, s += this.renderAttrs(l), l.nesting === 0 && r.xhtmlOut && (s += " /"), l.block && (i = !0, l.nesting === 1 && t + 1 < e.length && (o = e[t + 1], (o.type === "inline" || o.hidden || o.nesting === -1 && o.tag === l.tag) && (i = !1))), s += i ? `>
` : ">", s);
};
vt.prototype.renderInline = function(n, e, t) {
  for (var r, o = "", s = this.rules, i = 0, l = n.length; i < l; i++)
    r = n[i].type, typeof s[r] < "u" ? o += s[r](n, i, e, t, this) : o += this.renderToken(n, i, e);
  return o;
};
vt.prototype.renderInlineAsText = function(n, e, t) {
  for (var r = "", o = 0, s = n.length; o < s; o++)
    n[o].type === "text" ? r += n[o].content : n[o].type === "image" ? r += this.renderInlineAsText(n[o].children, e, t) : n[o].type === "softbreak" && (r += `
`);
  return r;
};
vt.prototype.render = function(n, e, t) {
  var r, o, s, i = "", l = this.rules;
  for (r = 0, o = n.length; r < o; r++)
    s = n[r].type, s === "inline" ? i += this.renderInline(n[r].children, e, t) : typeof l[s] < "u" ? i += l[s](n, r, e, t, this) : i += this.renderToken(n, r, e, t);
  return i;
};
var Q9 = vt;
function de() {
  this.__rules__ = [], this.__cache__ = null;
}
de.prototype.__find__ = function(n) {
  for (var e = 0; e < this.__rules__.length; e++)
    if (this.__rules__[e].name === n)
      return e;
  return -1;
};
de.prototype.__compile__ = function() {
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
de.prototype.at = function(n, e, t) {
  var r = this.__find__(n), o = t || {};
  if (r === -1)
    throw new Error("Parser rule not found: " + n);
  this.__rules__[r].fn = e, this.__rules__[r].alt = o.alt || [], this.__cache__ = null;
};
de.prototype.before = function(n, e, t, r) {
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
de.prototype.after = function(n, e, t, r) {
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
de.prototype.push = function(n, e, t) {
  var r = t || {};
  this.__rules__.push({
    name: n,
    enabled: !0,
    fn: e,
    alt: r.alt || []
  }), this.__cache__ = null;
};
de.prototype.enable = function(n, e) {
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
de.prototype.enableOnly = function(n, e) {
  Array.isArray(n) || (n = [n]), this.__rules__.forEach(function(t) {
    t.enabled = !1;
  }), this.enable(n, e);
};
de.prototype.disable = function(n, e) {
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
de.prototype.getRules = function(n) {
  return this.__cache__ === null && this.__compile__(), this.__cache__[n] || [];
};
var yo = de, X9 = /\r\n?|\n/g, e7 = /\0/g, t7 = function(e) {
  var t;
  t = e.src.replace(X9, `
`), t = t.replace(e7, "�"), e.src = t;
}, n7 = function(e) {
  var t;
  e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}, r7 = function(e) {
  var t = e.tokens, r, o, s;
  for (o = 0, s = t.length; o < s; o++)
    r = t[o], r.type === "inline" && e.md.inline.parse(r.content, e.md, e.env, r.children);
}, o7 = R.arrayReplaceAt;
function s7(n) {
  return /^<a[>\s]/i.test(n);
}
function i7(n) {
  return /^<\/a\s*>/i.test(n);
}
var l7 = function(e) {
  var t, r, o, s, i, l, c, a, u, f, h, p, d, m, g, b, y = e.tokens, S;
  if (e.md.options.linkify) {
    for (r = 0, o = y.length; r < o; r++)
      if (!(y[r].type !== "inline" || !e.md.linkify.pretest(y[r].content)))
        for (s = y[r].children, d = 0, t = s.length - 1; t >= 0; t--) {
          if (l = s[t], l.type === "link_close") {
            for (t--; s[t].level !== l.level && s[t].type !== "link_open"; )
              t--;
            continue;
          }
          if (l.type === "html_inline" && (s7(l.content) && d > 0 && d--, i7(l.content) && d++), !(d > 0) && l.type === "text" && e.md.linkify.test(l.content)) {
            for (u = l.content, S = e.md.linkify.match(u), c = [], p = l.level, h = 0, S.length > 0 && S[0].index === 0 && t > 0 && s[t - 1].type === "text_special" && (S = S.slice(1)), a = 0; a < S.length; a++)
              m = S[a].url, g = e.md.normalizeLink(m), e.md.validateLink(g) && (b = S[a].text, S[a].schema ? S[a].schema === "mailto:" && !/^mailto:/i.test(b) ? b = e.md.normalizeLinkText("mailto:" + b).replace(/^mailto:/, "") : b = e.md.normalizeLinkText(b) : b = e.md.normalizeLinkText("http://" + b).replace(/^http:\/\//, ""), f = S[a].index, f > h && (i = new e.Token("text", "", 0), i.content = u.slice(h, f), i.level = p, c.push(i)), i = new e.Token("link_open", "a", 1), i.attrs = [["href", g]], i.level = p++, i.markup = "linkify", i.info = "auto", c.push(i), i = new e.Token("text", "", 0), i.content = b, i.level = p, c.push(i), i = new e.Token("link_close", "a", -1), i.level = --p, i.markup = "linkify", i.info = "auto", c.push(i), h = S[a].lastIndex);
            h < u.length && (i = new e.Token("text", "", 0), i.content = u.slice(h), i.level = p, c.push(i)), y[r].children = s = o7(s, t, c);
          }
        }
  }
}, ec = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, c7 = /\((c|tm|r)\)/i, a7 = /\((c|tm|r)\)/ig, u7 = {
  c: "©",
  r: "®",
  tm: "™"
};
function f7(n, e) {
  return u7[e.toLowerCase()];
}
function h7(n) {
  var e, t, r = 0;
  for (e = n.length - 1; e >= 0; e--)
    t = n[e], t.type === "text" && !r && (t.content = t.content.replace(a7, f7)), t.type === "link_open" && t.info === "auto" && r--, t.type === "link_close" && t.info === "auto" && r++;
}
function p7(n) {
  var e, t, r = 0;
  for (e = n.length - 1; e >= 0; e--)
    t = n[e], t.type === "text" && !r && ec.test(t.content) && (t.content = t.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–")), t.type === "link_open" && t.info === "auto" && r--, t.type === "link_close" && t.info === "auto" && r++;
}
var d7 = function(e) {
  var t;
  if (e.md.options.typographer)
    for (t = e.tokens.length - 1; t >= 0; t--)
      e.tokens[t].type === "inline" && (c7.test(e.tokens[t].content) && h7(e.tokens[t].children), ec.test(e.tokens[t].content) && p7(e.tokens[t].children));
}, $s = R.isWhiteSpace, Us = R.isPunctChar, Hs = R.isMdAsciiPunct, m7 = /['"]/, js = /['"]/g, Ws = "’";
function sn(n, e, t) {
  return n.slice(0, e) + t + n.slice(e + 1);
}
function g7(n, e) {
  var t, r, o, s, i, l, c, a, u, f, h, p, d, m, g, b, y, S, E, A, x;
  for (E = [], t = 0; t < n.length; t++) {
    for (r = n[t], c = n[t].level, y = E.length - 1; y >= 0 && !(E[y].level <= c); y--)
      ;
    if (E.length = y + 1, r.type === "text") {
      o = r.content, i = 0, l = o.length;
      e:
        for (; i < l && (js.lastIndex = i, s = js.exec(o), !!s); ) {
          if (g = b = !0, i = s.index + 1, S = s[0] === "'", u = 32, s.index - 1 >= 0)
            u = o.charCodeAt(s.index - 1);
          else
            for (y = t - 1; y >= 0 && !(n[y].type === "softbreak" || n[y].type === "hardbreak"); y--)
              if (n[y].content) {
                u = n[y].content.charCodeAt(n[y].content.length - 1);
                break;
              }
          if (f = 32, i < l)
            f = o.charCodeAt(i);
          else
            for (y = t + 1; y < n.length && !(n[y].type === "softbreak" || n[y].type === "hardbreak"); y++)
              if (n[y].content) {
                f = n[y].content.charCodeAt(0);
                break;
              }
          if (h = Hs(u) || Us(String.fromCharCode(u)), p = Hs(f) || Us(String.fromCharCode(f)), d = $s(u), m = $s(f), m ? g = !1 : p && (d || h || (g = !1)), d ? b = !1 : h && (m || p || (b = !1)), f === 34 && s[0] === '"' && u >= 48 && u <= 57 && (b = g = !1), g && b && (g = h, b = p), !g && !b) {
            S && (r.content = sn(r.content, s.index, Ws));
            continue;
          }
          if (b) {
            for (y = E.length - 1; y >= 0 && (a = E[y], !(E[y].level < c)); y--)
              if (a.single === S && E[y].level === c) {
                a = E[y], S ? (A = e.md.options.quotes[2], x = e.md.options.quotes[3]) : (A = e.md.options.quotes[0], x = e.md.options.quotes[1]), r.content = sn(r.content, s.index, x), n[a.token].content = sn(
                  n[a.token].content,
                  a.pos,
                  A
                ), i += x.length - 1, a.token === t && (i += A.length - 1), o = r.content, l = o.length, E.length = y;
                continue e;
              }
          }
          g ? E.push({
            token: t,
            pos: s.index,
            single: S,
            level: c
          }) : b && S && (r.content = sn(r.content, s.index, Ws));
        }
    }
  }
}
var b7 = function(e) {
  var t;
  if (e.md.options.typographer)
    for (t = e.tokens.length - 1; t >= 0; t--)
      e.tokens[t].type !== "inline" || !m7.test(e.tokens[t].content) || g7(e.tokens[t].children, e);
}, k7 = function(e) {
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
function St(n, e, t) {
  this.type = n, this.tag = e, this.attrs = null, this.map = null, this.nesting = t, this.level = 0, this.children = null, this.content = "", this.markup = "", this.info = "", this.meta = null, this.block = !1, this.hidden = !1;
}
St.prototype.attrIndex = function(e) {
  var t, r, o;
  if (!this.attrs)
    return -1;
  for (t = this.attrs, r = 0, o = t.length; r < o; r++)
    if (t[r][0] === e)
      return r;
  return -1;
};
St.prototype.attrPush = function(e) {
  this.attrs ? this.attrs.push(e) : this.attrs = [e];
};
St.prototype.attrSet = function(e, t) {
  var r = this.attrIndex(e), o = [e, t];
  r < 0 ? this.attrPush(o) : this.attrs[r] = o;
};
St.prototype.attrGet = function(e) {
  var t = this.attrIndex(e), r = null;
  return t >= 0 && (r = this.attrs[t][1]), r;
};
St.prototype.attrJoin = function(e, t) {
  var r = this.attrIndex(e);
  r < 0 ? this.attrPush([e, t]) : this.attrs[r][1] = this.attrs[r][1] + " " + t;
};
var xo = St, y7 = xo;
function tc(n, e, t) {
  this.src = n, this.env = t, this.tokens = [], this.inlineMode = !1, this.md = e;
}
tc.prototype.Token = y7;
var x7 = tc, w7 = yo, pr = [
  ["normalize", t7],
  ["block", n7],
  ["inline", r7],
  ["linkify", l7],
  ["replacements", d7],
  ["smartquotes", b7],
  // `text_join` finds `text_special` tokens (for escape sequences)
  // and joins them with the rest of the text
  ["text_join", k7]
];
function wo() {
  this.ruler = new w7();
  for (var n = 0; n < pr.length; n++)
    this.ruler.push(pr[n][0], pr[n][1]);
}
wo.prototype.process = function(n) {
  var e, t, r;
  for (r = this.ruler.getRules(""), e = 0, t = r.length; e < t; e++)
    r[e](n);
};
wo.prototype.State = x7;
var C7 = wo, dr = R.isSpace;
function mr(n, e) {
  var t = n.bMarks[e] + n.tShift[e], r = n.eMarks[e];
  return n.src.slice(t, r);
}
function Js(n) {
  var e = [], t = 0, r = n.length, o, s = !1, i = 0, l = "";
  for (o = n.charCodeAt(t); t < r; )
    o === 124 && (s ? (l += n.substring(i, t - 1), i = t) : (e.push(l + n.substring(i, t)), l = "", i = t + 1)), s = o === 92, t++, o = n.charCodeAt(t);
  return e.push(l + n.substring(i)), e;
}
var v7 = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h, p, d, m, g, b, y, S, E, A, x;
  if (t + 2 > r || (u = t + 1, e.sCount[u] < e.blkIndent) || e.sCount[u] - e.blkIndent >= 4 || (l = e.bMarks[u] + e.tShift[u], l >= e.eMarks[u]) || (A = e.src.charCodeAt(l++), A !== 124 && A !== 45 && A !== 58) || l >= e.eMarks[u] || (x = e.src.charCodeAt(l++), x !== 124 && x !== 45 && x !== 58 && !dr(x)) || A === 45 && dr(x))
    return !1;
  for (; l < e.eMarks[u]; ) {
    if (s = e.src.charCodeAt(l), s !== 124 && s !== 45 && s !== 58 && !dr(s))
      return !1;
    l++;
  }
  for (i = mr(e, t + 1), f = i.split("|"), d = [], c = 0; c < f.length; c++) {
    if (m = f[c].trim(), !m) {
      if (c === 0 || c === f.length - 1)
        continue;
      return !1;
    }
    if (!/^:?-+:?$/.test(m))
      return !1;
    m.charCodeAt(m.length - 1) === 58 ? d.push(m.charCodeAt(0) === 58 ? "center" : "right") : m.charCodeAt(0) === 58 ? d.push("left") : d.push("");
  }
  if (i = mr(e, t).trim(), i.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4 || (f = Js(i), f.length && f[0] === "" && f.shift(), f.length && f[f.length - 1] === "" && f.pop(), h = f.length, h === 0 || h !== d.length))
    return !1;
  if (o)
    return !0;
  for (y = e.parentType, e.parentType = "table", E = e.md.block.ruler.getRules("blockquote"), p = e.push("table_open", "table", 1), p.map = g = [t, 0], p = e.push("thead_open", "thead", 1), p.map = [t, t + 1], p = e.push("tr_open", "tr", 1), p.map = [t, t + 1], c = 0; c < f.length; c++)
    p = e.push("th_open", "th", 1), d[c] && (p.attrs = [["style", "text-align:" + d[c]]]), p = e.push("inline", "", 0), p.content = f[c].trim(), p.children = [], p = e.push("th_close", "th", -1);
  for (p = e.push("tr_close", "tr", -1), p = e.push("thead_close", "thead", -1), u = t + 2; u < r && !(e.sCount[u] < e.blkIndent); u++) {
    for (S = !1, c = 0, a = E.length; c < a; c++)
      if (E[c](e, u, r, !0)) {
        S = !0;
        break;
      }
    if (S || (i = mr(e, u).trim(), !i) || e.sCount[u] - e.blkIndent >= 4)
      break;
    for (f = Js(i), f.length && f[0] === "" && f.shift(), f.length && f[f.length - 1] === "" && f.pop(), u === t + 2 && (p = e.push("tbody_open", "tbody", 1), p.map = b = [t + 2, 0]), p = e.push("tr_open", "tr", 1), p.map = [u, u + 1], c = 0; c < h; c++)
      p = e.push("td_open", "td", 1), d[c] && (p.attrs = [["style", "text-align:" + d[c]]]), p = e.push("inline", "", 0), p.content = f[c] ? f[c].trim() : "", p.children = [], p = e.push("td_close", "td", -1);
    p = e.push("tr_close", "tr", -1);
  }
  return b && (p = e.push("tbody_close", "tbody", -1), b[1] = u), p = e.push("table_close", "table", -1), g[1] = u, e.parentType = y, e.line = u, !0;
}, S7 = function(e, t, r) {
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
}, _7 = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h = !1, p = e.bMarks[t] + e.tShift[t], d = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || p + 3 > d || (s = e.src.charCodeAt(p), s !== 126 && s !== 96) || (a = p, p = e.skipChars(p, s), i = p - a, i < 3) || (f = e.src.slice(a, p), l = e.src.slice(p, d), s === 96 && l.indexOf(String.fromCharCode(s)) >= 0))
    return !1;
  if (o)
    return !0;
  for (c = t; c++, !(c >= r || (p = a = e.bMarks[c] + e.tShift[c], d = e.eMarks[c], p < d && e.sCount[c] < e.blkIndent)); )
    if (e.src.charCodeAt(p) === s && !(e.sCount[c] - e.blkIndent >= 4) && (p = e.skipChars(p, s), !(p - a < i) && (p = e.skipSpaces(p), !(p < d)))) {
      h = !0;
      break;
    }
  return i = e.sCount[t], e.line = c + (h ? 1 : 0), u = e.push("fence", "code", 0), u.info = l, u.content = e.getLines(t + 1, c, i, !0), u.markup = f, u.map = [t, e.line], !0;
}, D7 = R.isSpace, E7 = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h, p, d, m, g, b, y, S, E, A, x, N, F, D = e.lineMax, M = e.bMarks[t] + e.tShift[t], G = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(M) !== 62)
    return !1;
  if (o)
    return !0;
  for (d = [], m = [], y = [], S = [], x = e.md.block.ruler.getRules("blockquote"), b = e.parentType, e.parentType = "blockquote", h = t; h < r && (F = e.sCount[h] < e.blkIndent, M = e.bMarks[h] + e.tShift[h], G = e.eMarks[h], !(M >= G)); h++) {
    if (e.src.charCodeAt(M++) === 62 && !F) {
      for (c = e.sCount[h] + 1, e.src.charCodeAt(M) === 32 ? (M++, c++, s = !1, E = !0) : e.src.charCodeAt(M) === 9 ? (E = !0, (e.bsCount[h] + c) % 4 === 3 ? (M++, c++, s = !1) : s = !0) : E = !1, p = c, d.push(e.bMarks[h]), e.bMarks[h] = M; M < G && (i = e.src.charCodeAt(M), D7(i)); ) {
        i === 9 ? p += 4 - (p + e.bsCount[h] + (s ? 1 : 0)) % 4 : p++;
        M++;
      }
      u = M >= G, m.push(e.bsCount[h]), e.bsCount[h] = e.sCount[h] + 1 + (E ? 1 : 0), y.push(e.sCount[h]), e.sCount[h] = p - c, S.push(e.tShift[h]), e.tShift[h] = M - e.bMarks[h];
      continue;
    }
    if (u)
      break;
    for (A = !1, l = 0, a = x.length; l < a; l++)
      if (x[l](e, h, r, !0)) {
        A = !0;
        break;
      }
    if (A) {
      e.lineMax = h, e.blkIndent !== 0 && (d.push(e.bMarks[h]), m.push(e.bsCount[h]), S.push(e.tShift[h]), y.push(e.sCount[h]), e.sCount[h] -= e.blkIndent);
      break;
    }
    d.push(e.bMarks[h]), m.push(e.bsCount[h]), S.push(e.tShift[h]), y.push(e.sCount[h]), e.sCount[h] = -1;
  }
  for (g = e.blkIndent, e.blkIndent = 0, N = e.push("blockquote_open", "blockquote", 1), N.markup = ">", N.map = f = [t, 0], e.md.block.tokenize(e, t, h), N = e.push("blockquote_close", "blockquote", -1), N.markup = ">", e.lineMax = D, e.parentType = b, f[1] = e.line, l = 0; l < S.length; l++)
    e.bMarks[l + t] = d[l], e.tShift[l + t] = S[l], e.sCount[l + t] = y[l], e.bsCount[l + t] = m[l];
  return e.blkIndent = g, !0;
}, A7 = R.isSpace, M7 = function(e, t, r, o) {
  var s, i, l, c, a = e.bMarks[t] + e.tShift[t], u = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || (s = e.src.charCodeAt(a++), s !== 42 && s !== 45 && s !== 95))
    return !1;
  for (i = 1; a < u; ) {
    if (l = e.src.charCodeAt(a++), l !== s && !A7(l))
      return !1;
    l === s && i++;
  }
  return i < 3 ? !1 : (o || (e.line = t + 1, c = e.push("hr", "hr", 0), c.map = [t, e.line], c.markup = Array(i + 1).join(String.fromCharCode(s))), !0);
}, nc = R.isSpace;
function Gs(n, e) {
  var t, r, o, s;
  return r = n.bMarks[e] + n.tShift[e], o = n.eMarks[e], t = n.src.charCodeAt(r++), t !== 42 && t !== 45 && t !== 43 || r < o && (s = n.src.charCodeAt(r), !nc(s)) ? -1 : r;
}
function Ks(n, e) {
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
  return o < s && (t = n.src.charCodeAt(o), !nc(t)) ? -1 : o;
}
function T7(n, e) {
  var t, r, o = n.level + 2;
  for (t = e + 2, r = n.tokens.length - 2; t < r; t++)
    n.tokens[t].level === o && n.tokens[t].type === "paragraph_open" && (n.tokens[t + 2].hidden = !0, n.tokens[t].hidden = !0, t += 2);
}
var O7 = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h, p, d, m, g, b, y, S, E, A, x, N, F, D, M, G, Ee, _t, w, q, v = t, Ae = !1, Eo = !0;
  if (e.sCount[v] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[v] - e.listIndent >= 4 && e.sCount[v] < e.blkIndent)
    return !1;
  if (o && e.parentType === "paragraph" && e.sCount[v] >= e.blkIndent && (Ae = !0), (M = Ks(e, v)) >= 0) {
    if (f = !0, Ee = e.bMarks[v] + e.tShift[v], b = Number(e.src.slice(Ee, M - 1)), Ae && b !== 1)
      return !1;
  } else if ((M = Gs(e, v)) >= 0)
    f = !1;
  else
    return !1;
  if (Ae && e.skipSpaces(M) >= e.eMarks[v])
    return !1;
  if (o)
    return !0;
  for (g = e.src.charCodeAt(M - 1), m = e.tokens.length, f ? (q = e.push("ordered_list_open", "ol", 1), b !== 1 && (q.attrs = [["start", b]])) : q = e.push("bullet_list_open", "ul", 1), q.map = d = [v, 0], q.markup = String.fromCharCode(g), G = !1, w = e.md.block.ruler.getRules("list"), A = e.parentType, e.parentType = "list"; v < r; ) {
    for (D = M, y = e.eMarks[v], u = S = e.sCount[v] + M - (e.bMarks[v] + e.tShift[v]); D < y; ) {
      if (s = e.src.charCodeAt(D), s === 9)
        S += 4 - (S + e.bsCount[v]) % 4;
      else if (s === 32)
        S++;
      else
        break;
      D++;
    }
    if (i = D, i >= y ? a = 1 : a = S - u, a > 4 && (a = 1), c = u + a, q = e.push("list_item_open", "li", 1), q.markup = String.fromCharCode(g), q.map = h = [v, 0], f && (q.info = e.src.slice(Ee, M - 1)), F = e.tight, N = e.tShift[v], x = e.sCount[v], E = e.listIndent, e.listIndent = e.blkIndent, e.blkIndent = c, e.tight = !0, e.tShift[v] = i - e.bMarks[v], e.sCount[v] = S, i >= y && e.isEmpty(v + 1) ? e.line = Math.min(e.line + 2, r) : e.md.block.tokenize(e, v, r, !0), (!e.tight || G) && (Eo = !1), G = e.line - v > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = E, e.tShift[v] = N, e.sCount[v] = x, e.tight = F, q = e.push("list_item_close", "li", -1), q.markup = String.fromCharCode(g), v = e.line, h[1] = v, v >= r || e.sCount[v] < e.blkIndent || e.sCount[v] - e.blkIndent >= 4)
      break;
    for (_t = !1, l = 0, p = w.length; l < p; l++)
      if (w[l](e, v, r, !0)) {
        _t = !0;
        break;
      }
    if (_t)
      break;
    if (f) {
      if (M = Ks(e, v), M < 0)
        break;
      Ee = e.bMarks[v] + e.tShift[v];
    } else if (M = Gs(e, v), M < 0)
      break;
    if (g !== e.src.charCodeAt(M - 1))
      break;
  }
  return f ? q = e.push("ordered_list_close", "ol", -1) : q = e.push("bullet_list_close", "ul", -1), q.markup = String.fromCharCode(g), d[1] = v, e.line = v, e.parentType = A, Eo && T7(e, m), !0;
}, N7 = R.normalizeReference, ln = R.isSpace, q7 = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h, p, d, m, g, b, y, S, E, A = 0, x = e.bMarks[t] + e.tShift[t], N = e.eMarks[t], F = t + 1;
  if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(x) !== 91)
    return !1;
  for (; ++x < N; )
    if (e.src.charCodeAt(x) === 93 && e.src.charCodeAt(x - 1) !== 92) {
      if (x + 1 === N || e.src.charCodeAt(x + 1) !== 58)
        return !1;
      break;
    }
  for (c = e.lineMax, S = e.md.block.ruler.getRules("reference"), d = e.parentType, e.parentType = "reference"; F < c && !e.isEmpty(F); F++)
    if (!(e.sCount[F] - e.blkIndent > 3) && !(e.sCount[F] < 0)) {
      for (y = !1, u = 0, f = S.length; u < f; u++)
        if (S[u](e, F, c, !0)) {
          y = !0;
          break;
        }
      if (y)
        break;
    }
  for (b = e.getLines(t, F, e.blkIndent, !1).trim(), N = b.length, x = 1; x < N; x++) {
    if (s = b.charCodeAt(x), s === 91)
      return !1;
    if (s === 93) {
      p = x;
      break;
    } else
      s === 10 ? A++ : s === 92 && (x++, x < N && b.charCodeAt(x) === 10 && A++);
  }
  if (p < 0 || b.charCodeAt(p + 1) !== 58)
    return !1;
  for (x = p + 2; x < N; x++)
    if (s = b.charCodeAt(x), s === 10)
      A++;
    else if (!ln(s))
      break;
  if (m = e.md.helpers.parseLinkDestination(b, x, N), !m.ok || (a = e.md.normalizeLink(m.str), !e.md.validateLink(a)))
    return !1;
  for (x = m.pos, A += m.lines, i = x, l = A, g = x; x < N; x++)
    if (s = b.charCodeAt(x), s === 10)
      A++;
    else if (!ln(s))
      break;
  for (m = e.md.helpers.parseLinkTitle(b, x, N), x < N && g !== x && m.ok ? (E = m.str, x = m.pos, A += m.lines) : (E = "", x = i, A = l); x < N && (s = b.charCodeAt(x), !!ln(s)); )
    x++;
  if (x < N && b.charCodeAt(x) !== 10 && E)
    for (E = "", x = i, A = l; x < N && (s = b.charCodeAt(x), !!ln(s)); )
      x++;
  return x < N && b.charCodeAt(x) !== 10 || (h = N7(b.slice(1, p)), !h) ? !1 : (o || (typeof e.env.references > "u" && (e.env.references = {}), typeof e.env.references[h] > "u" && (e.env.references[h] = { title: E, href: a }), e.parentType = d, e.line = t + A + 1), !0);
}, R7 = [
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
], Pn = {}, I7 = "[a-zA-Z_:][a-zA-Z0-9:._-]*", F7 = "[^\"'=<>`\\x00-\\x20]+", z7 = "'[^']*'", L7 = '"[^"]*"', B7 = "(?:" + F7 + "|" + z7 + "|" + L7 + ")", P7 = "(?:\\s+" + I7 + "(?:\\s*=\\s*" + B7 + ")?)", rc = "<[A-Za-z][A-Za-z0-9\\-]*" + P7 + "*\\s*\\/?>", oc = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", V7 = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->", $7 = "<[?][\\s\\S]*?[?]>", U7 = "<![A-Z]+\\s+[^>]*>", H7 = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>", j7 = new RegExp("^(?:" + rc + "|" + oc + "|" + V7 + "|" + $7 + "|" + U7 + "|" + H7 + ")"), W7 = new RegExp("^(?:" + rc + "|" + oc + ")");
Pn.HTML_TAG_RE = j7;
Pn.HTML_OPEN_CLOSE_TAG_RE = W7;
var J7 = R7, G7 = Pn.HTML_OPEN_CLOSE_TAG_RE, ct = [
  [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, !0],
  [/^<!--/, /-->/, !0],
  [/^<\?/, /\?>/, !0],
  [/^<![A-Z]/, />/, !0],
  [/^<!\[CDATA\[/, /\]\]>/, !0],
  [new RegExp("^</?(" + J7.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, !0],
  [new RegExp(G7.source + "\\s*$"), /^$/, !1]
], K7 = function(e, t, r, o) {
  var s, i, l, c, a = e.bMarks[t] + e.tShift[t], u = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(a) !== 60)
    return !1;
  for (c = e.src.slice(a, u), s = 0; s < ct.length && !ct[s][0].test(c); s++)
    ;
  if (s === ct.length)
    return !1;
  if (o)
    return ct[s][2];
  if (i = t + 1, !ct[s][1].test(c)) {
    for (; i < r && !(e.sCount[i] < e.blkIndent); i++)
      if (a = e.bMarks[i] + e.tShift[i], u = e.eMarks[i], c = e.src.slice(a, u), ct[s][1].test(c)) {
        c.length !== 0 && i++;
        break;
      }
  }
  return e.line = i, l = e.push("html_block", "", 0), l.map = [t, i], l.content = e.getLines(t, i, e.blkIndent, !0), !0;
}, Zs = R.isSpace, Z7 = function(e, t, r, o) {
  var s, i, l, c, a = e.bMarks[t] + e.tShift[t], u = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || (s = e.src.charCodeAt(a), s !== 35 || a >= u))
    return !1;
  for (i = 1, s = e.src.charCodeAt(++a); s === 35 && a < u && i <= 6; )
    i++, s = e.src.charCodeAt(++a);
  return i > 6 || a < u && !Zs(s) ? !1 : (o || (u = e.skipSpacesBack(u, a), l = e.skipCharsBack(u, 35, a), l > a && Zs(e.src.charCodeAt(l - 1)) && (u = l), e.line = t + 1, c = e.push("heading_open", "h" + String(i), 1), c.markup = "########".slice(0, i), c.map = [t, e.line], c = e.push("inline", "", 0), c.content = e.src.slice(a, u).trim(), c.map = [t, e.line], c.children = [], c = e.push("heading_close", "h" + String(i), -1), c.markup = "########".slice(0, i)), !0);
}, Y7 = function(e, t, r) {
  var o, s, i, l, c, a, u, f, h, p = t + 1, d, m = e.md.block.ruler.getRules("paragraph");
  if (e.sCount[t] - e.blkIndent >= 4)
    return !1;
  for (d = e.parentType, e.parentType = "paragraph"; p < r && !e.isEmpty(p); p++)
    if (!(e.sCount[p] - e.blkIndent > 3)) {
      if (e.sCount[p] >= e.blkIndent && (a = e.bMarks[p] + e.tShift[p], u = e.eMarks[p], a < u && (h = e.src.charCodeAt(a), (h === 45 || h === 61) && (a = e.skipChars(a, h), a = e.skipSpaces(a), a >= u)))) {
        f = h === 61 ? 1 : 2;
        break;
      }
      if (!(e.sCount[p] < 0)) {
        for (s = !1, i = 0, l = m.length; i < l; i++)
          if (m[i](e, p, r, !0)) {
            s = !0;
            break;
          }
        if (s)
          break;
      }
    }
  return f ? (o = e.getLines(t, p, e.blkIndent, !1).trim(), e.line = p + 1, c = e.push("heading_open", "h" + String(f), 1), c.markup = String.fromCharCode(h), c.map = [t, e.line], c = e.push("inline", "", 0), c.content = o, c.map = [t, e.line - 1], c.children = [], c = e.push("heading_close", "h" + String(f), -1), c.markup = String.fromCharCode(h), e.parentType = d, !0) : !1;
}, Q7 = function(e, t, r) {
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
}, sc = xo, Vn = R.isSpace;
function we(n, e, t, r) {
  var o, s, i, l, c, a, u, f;
  for (this.src = n, this.md = e, this.env = t, this.tokens = r, this.bMarks = [], this.eMarks = [], this.tShift = [], this.sCount = [], this.bsCount = [], this.blkIndent = 0, this.line = 0, this.lineMax = 0, this.tight = !1, this.ddIndent = -1, this.listIndent = -1, this.parentType = "root", this.level = 0, this.result = "", s = this.src, f = !1, i = l = a = u = 0, c = s.length; l < c; l++) {
    if (o = s.charCodeAt(l), !f)
      if (Vn(o)) {
        a++, o === 9 ? u += 4 - u % 4 : u++;
        continue;
      } else
        f = !0;
    (o === 10 || l === c - 1) && (o !== 10 && l++, this.bMarks.push(i), this.eMarks.push(l), this.tShift.push(a), this.sCount.push(u), this.bsCount.push(0), f = !1, a = 0, u = 0, i = l + 1);
  }
  this.bMarks.push(s.length), this.eMarks.push(s.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
}
we.prototype.push = function(n, e, t) {
  var r = new sc(n, e, t);
  return r.block = !0, t < 0 && this.level--, r.level = this.level, t > 0 && this.level++, this.tokens.push(r), r;
};
we.prototype.isEmpty = function(e) {
  return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
};
we.prototype.skipEmptyLines = function(e) {
  for (var t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++)
    ;
  return e;
};
we.prototype.skipSpaces = function(e) {
  for (var t, r = this.src.length; e < r && (t = this.src.charCodeAt(e), !!Vn(t)); e++)
    ;
  return e;
};
we.prototype.skipSpacesBack = function(e, t) {
  if (e <= t)
    return e;
  for (; e > t; )
    if (!Vn(this.src.charCodeAt(--e)))
      return e + 1;
  return e;
};
we.prototype.skipChars = function(e, t) {
  for (var r = this.src.length; e < r && this.src.charCodeAt(e) === t; e++)
    ;
  return e;
};
we.prototype.skipCharsBack = function(e, t, r) {
  if (e <= r)
    return e;
  for (; e > r; )
    if (t !== this.src.charCodeAt(--e))
      return e + 1;
  return e;
};
we.prototype.getLines = function(e, t, r, o) {
  var s, i, l, c, a, u, f, h = e;
  if (e >= t)
    return "";
  for (u = new Array(t - e), s = 0; h < t; h++, s++) {
    for (i = 0, f = c = this.bMarks[h], h + 1 < t || o ? a = this.eMarks[h] + 1 : a = this.eMarks[h]; c < a && i < r; ) {
      if (l = this.src.charCodeAt(c), Vn(l))
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
we.prototype.Token = sc;
var X7 = we, eU = yo, cn = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  ["table", v7, ["paragraph", "reference"]],
  ["code", S7],
  ["fence", _7, ["paragraph", "reference", "blockquote", "list"]],
  ["blockquote", E7, ["paragraph", "reference", "blockquote", "list"]],
  ["hr", M7, ["paragraph", "reference", "blockquote", "list"]],
  ["list", O7, ["paragraph", "reference", "blockquote"]],
  ["reference", q7],
  ["html_block", K7, ["paragraph", "reference", "blockquote"]],
  ["heading", Z7, ["paragraph", "reference", "blockquote"]],
  ["lheading", Y7],
  ["paragraph", Q7]
];
function $n() {
  this.ruler = new eU();
  for (var n = 0; n < cn.length; n++)
    this.ruler.push(cn[n][0], cn[n][1], { alt: (cn[n][2] || []).slice() });
}
$n.prototype.tokenize = function(n, e, t) {
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
$n.prototype.parse = function(n, e, t, r) {
  var o;
  n && (o = new this.State(n, e, t, r), this.tokenize(o, o.line, o.lineMax));
};
$n.prototype.State = X7;
var tU = $n;
function nU(n) {
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
var rU = function(e, t) {
  for (var r = e.pos; r < e.posMax && !nU(e.src.charCodeAt(r)); )
    r++;
  return r === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, r)), e.pos = r, !0);
}, oU = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i, sU = function(e, t) {
  var r, o, s, i, l, c, a, u;
  return !e.md.options.linkify || e.linkLevel > 0 || (r = e.pos, o = e.posMax, r + 3 > o) || e.src.charCodeAt(r) !== 58 || e.src.charCodeAt(r + 1) !== 47 || e.src.charCodeAt(r + 2) !== 47 || (s = e.pending.match(oU), !s) || (i = s[1], l = e.md.linkify.matchAtStart(e.src.slice(r - i.length)), !l) || (c = l.url, c.length <= i.length) || (c = c.replace(/\*+$/, ""), a = e.md.normalizeLink(c), !e.md.validateLink(a)) ? !1 : (t || (e.pending = e.pending.slice(0, -i.length), u = e.push("link_open", "a", 1), u.attrs = [["href", a]], u.markup = "linkify", u.info = "auto", u = e.push("text", "", 0), u.content = e.md.normalizeLinkText(c), u = e.push("link_close", "a", -1), u.markup = "linkify", u.info = "auto"), e.pos += c.length - i.length, !0);
}, iU = R.isSpace, lU = function(e, t) {
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
  for (i++; i < o && iU(e.src.charCodeAt(i)); )
    i++;
  return e.pos = i, !0;
}, cU = R.isSpace, Co = [];
for (var Ys = 0; Ys < 256; Ys++)
  Co.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(n) {
  Co[n.charCodeAt(0)] = 1;
});
var aU = function(e, t) {
  var r, o, s, i, l, c = e.pos, a = e.posMax;
  if (e.src.charCodeAt(c) !== 92 || (c++, c >= a))
    return !1;
  if (r = e.src.charCodeAt(c), r === 10) {
    for (t || e.push("hardbreak", "br", 0), c++; c < a && (r = e.src.charCodeAt(c), !!cU(r)); )
      c++;
    return e.pos = c, !0;
  }
  return i = e.src[c], r >= 55296 && r <= 56319 && c + 1 < a && (o = e.src.charCodeAt(c + 1), o >= 56320 && o <= 57343 && (i += e.src[c + 1], c++)), s = "\\" + i, t || (l = e.push("text_special", "", 0), r < 256 && Co[r] !== 0 ? l.content = i : l.content = s, l.markup = s, l.info = "escape"), e.pos = c + 1, !0;
}, uU = function(e, t) {
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
}, Un = {};
Un.tokenize = function(e, t) {
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
function Qs(n, e) {
  var t, r, o, s, i, l = [], c = e.length;
  for (t = 0; t < c; t++)
    o = e[t], o.marker === 126 && o.end !== -1 && (s = e[o.end], i = n.tokens[o.token], i.type = "s_open", i.tag = "s", i.nesting = 1, i.markup = "~~", i.content = "", i = n.tokens[s.token], i.type = "s_close", i.tag = "s", i.nesting = -1, i.markup = "~~", i.content = "", n.tokens[s.token - 1].type === "text" && n.tokens[s.token - 1].content === "~" && l.push(s.token - 1));
  for (; l.length; ) {
    for (t = l.pop(), r = t + 1; r < n.tokens.length && n.tokens[r].type === "s_close"; )
      r++;
    r--, t !== r && (i = n.tokens[r], n.tokens[r] = n.tokens[t], n.tokens[t] = i);
  }
}
Un.postProcess = function(e) {
  var t, r = e.tokens_meta, o = e.tokens_meta.length;
  for (Qs(e, e.delimiters), t = 0; t < o; t++)
    r[t] && r[t].delimiters && Qs(e, r[t].delimiters);
};
var Hn = {};
Hn.tokenize = function(e, t) {
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
function Xs(n, e) {
  var t, r, o, s, i, l, c = e.length;
  for (t = c - 1; t >= 0; t--)
    r = e[t], !(r.marker !== 95 && r.marker !== 42) && r.end !== -1 && (o = e[r.end], l = t > 0 && e[t - 1].end === r.end + 1 && // check that first two markers match and adjacent
    e[t - 1].marker === r.marker && e[t - 1].token === r.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
    e[r.end + 1].token === o.token + 1, i = String.fromCharCode(r.marker), s = n.tokens[r.token], s.type = l ? "strong_open" : "em_open", s.tag = l ? "strong" : "em", s.nesting = 1, s.markup = l ? i + i : i, s.content = "", s = n.tokens[o.token], s.type = l ? "strong_close" : "em_close", s.tag = l ? "strong" : "em", s.nesting = -1, s.markup = l ? i + i : i, s.content = "", l && (n.tokens[e[t - 1].token].content = "", n.tokens[e[r.end + 1].token].content = "", t--));
}
Hn.postProcess = function(e) {
  var t, r = e.tokens_meta, o = e.tokens_meta.length;
  for (Xs(e, e.delimiters), t = 0; t < o; t++)
    r[t] && r[t].delimiters && Xs(e, r[t].delimiters);
};
var fU = R.normalizeReference, gr = R.isSpace, hU = function(e, t) {
  var r, o, s, i, l, c, a, u, f, h = "", p = "", d = e.pos, m = e.posMax, g = e.pos, b = !0;
  if (e.src.charCodeAt(e.pos) !== 91 || (l = e.pos + 1, i = e.md.helpers.parseLinkLabel(e, e.pos, !0), i < 0))
    return !1;
  if (c = i + 1, c < m && e.src.charCodeAt(c) === 40) {
    for (b = !1, c++; c < m && (o = e.src.charCodeAt(c), !(!gr(o) && o !== 10)); c++)
      ;
    if (c >= m)
      return !1;
    if (g = c, a = e.md.helpers.parseLinkDestination(e.src, c, e.posMax), a.ok) {
      for (h = e.md.normalizeLink(a.str), e.md.validateLink(h) ? c = a.pos : h = "", g = c; c < m && (o = e.src.charCodeAt(c), !(!gr(o) && o !== 10)); c++)
        ;
      if (a = e.md.helpers.parseLinkTitle(e.src, c, e.posMax), c < m && g !== c && a.ok)
        for (p = a.str, c = a.pos; c < m && (o = e.src.charCodeAt(c), !(!gr(o) && o !== 10)); c++)
          ;
    }
    (c >= m || e.src.charCodeAt(c) !== 41) && (b = !0), c++;
  }
  if (b) {
    if (typeof e.env.references > "u")
      return !1;
    if (c < m && e.src.charCodeAt(c) === 91 ? (g = c + 1, c = e.md.helpers.parseLinkLabel(e, c), c >= 0 ? s = e.src.slice(g, c++) : c = i + 1) : c = i + 1, s || (s = e.src.slice(l, i)), u = e.env.references[fU(s)], !u)
      return e.pos = d, !1;
    h = u.href, p = u.title;
  }
  return t || (e.pos = l, e.posMax = i, f = e.push("link_open", "a", 1), f.attrs = r = [["href", h]], p && r.push(["title", p]), e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, f = e.push("link_close", "a", -1)), e.pos = c, e.posMax = m, !0;
}, pU = R.normalizeReference, br = R.isSpace, dU = function(e, t) {
  var r, o, s, i, l, c, a, u, f, h, p, d, m, g = "", b = e.pos, y = e.posMax;
  if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91 || (c = e.pos + 2, l = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1), l < 0))
    return !1;
  if (a = l + 1, a < y && e.src.charCodeAt(a) === 40) {
    for (a++; a < y && (o = e.src.charCodeAt(a), !(!br(o) && o !== 10)); a++)
      ;
    if (a >= y)
      return !1;
    for (m = a, f = e.md.helpers.parseLinkDestination(e.src, a, e.posMax), f.ok && (g = e.md.normalizeLink(f.str), e.md.validateLink(g) ? a = f.pos : g = ""), m = a; a < y && (o = e.src.charCodeAt(a), !(!br(o) && o !== 10)); a++)
      ;
    if (f = e.md.helpers.parseLinkTitle(e.src, a, e.posMax), a < y && m !== a && f.ok)
      for (h = f.str, a = f.pos; a < y && (o = e.src.charCodeAt(a), !(!br(o) && o !== 10)); a++)
        ;
    else
      h = "";
    if (a >= y || e.src.charCodeAt(a) !== 41)
      return e.pos = b, !1;
    a++;
  } else {
    if (typeof e.env.references > "u")
      return !1;
    if (a < y && e.src.charCodeAt(a) === 91 ? (m = a + 1, a = e.md.helpers.parseLinkLabel(e, a), a >= 0 ? i = e.src.slice(m, a++) : a = l + 1) : a = l + 1, i || (i = e.src.slice(c, l)), u = e.env.references[pU(i)], !u)
      return e.pos = b, !1;
    g = u.href, h = u.title;
  }
  return t || (s = e.src.slice(c, l), e.md.inline.parse(
    s,
    e.md,
    e.env,
    d = []
  ), p = e.push("image", "img", 0), p.attrs = r = [["src", g], ["alt", ""]], p.children = d, p.content = s, h && r.push(["title", h])), e.pos = a, e.posMax = y, !0;
}, mU = /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, gU = /^([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)$/, bU = function(e, t) {
  var r, o, s, i, l, c, a = e.pos;
  if (e.src.charCodeAt(a) !== 60)
    return !1;
  for (l = e.pos, c = e.posMax; ; ) {
    if (++a >= c || (i = e.src.charCodeAt(a), i === 60))
      return !1;
    if (i === 62)
      break;
  }
  return r = e.src.slice(l + 1, a), gU.test(r) ? (o = e.md.normalizeLink(r), e.md.validateLink(o) ? (t || (s = e.push("link_open", "a", 1), s.attrs = [["href", o]], s.markup = "autolink", s.info = "auto", s = e.push("text", "", 0), s.content = e.md.normalizeLinkText(r), s = e.push("link_close", "a", -1), s.markup = "autolink", s.info = "auto"), e.pos += r.length + 2, !0) : !1) : mU.test(r) ? (o = e.md.normalizeLink("mailto:" + r), e.md.validateLink(o) ? (t || (s = e.push("link_open", "a", 1), s.attrs = [["href", o]], s.markup = "autolink", s.info = "auto", s = e.push("text", "", 0), s.content = e.md.normalizeLinkText(r), s = e.push("link_close", "a", -1), s.markup = "autolink", s.info = "auto"), e.pos += r.length + 2, !0) : !1) : !1;
}, kU = Pn.HTML_TAG_RE;
function yU(n) {
  return /^<a[>\s]/i.test(n);
}
function xU(n) {
  return /^<\/a\s*>/i.test(n);
}
function wU(n) {
  var e = n | 32;
  return e >= 97 && e <= 122;
}
var CU = function(e, t) {
  var r, o, s, i, l = e.pos;
  return !e.md.options.html || (s = e.posMax, e.src.charCodeAt(l) !== 60 || l + 2 >= s) || (r = e.src.charCodeAt(l + 1), r !== 33 && r !== 63 && r !== 47 && !wU(r)) || (o = e.src.slice(l).match(kU), !o) ? !1 : (t || (i = e.push("html_inline", "", 0), i.content = o[0], yU(i.content) && e.linkLevel++, xU(i.content) && e.linkLevel--), e.pos += o[0].length, !0);
}, ei = Zl, vU = R.has, SU = R.isValidEntityCode, ti = R.fromCodePoint, _U = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, DU = /^&([a-z][a-z0-9]{1,31});/i, EU = function(e, t) {
  var r, o, s, i, l = e.pos, c = e.posMax;
  if (e.src.charCodeAt(l) !== 38 || l + 1 >= c)
    return !1;
  if (r = e.src.charCodeAt(l + 1), r === 35) {
    if (s = e.src.slice(l).match(_U), s)
      return t || (o = s[1][0].toLowerCase() === "x" ? parseInt(s[1].slice(1), 16) : parseInt(s[1], 10), i = e.push("text_special", "", 0), i.content = SU(o) ? ti(o) : ti(65533), i.markup = s[0], i.info = "entity"), e.pos += s[0].length, !0;
  } else if (s = e.src.slice(l).match(DU), s && vU(ei, s[1]))
    return t || (i = e.push("text_special", "", 0), i.content = ei[s[1]], i.markup = s[0], i.info = "entity"), e.pos += s[0].length, !0;
  return !1;
};
function ni(n) {
  var e, t, r, o, s, i, l, c, a = {}, u = n.length;
  if (u) {
    var f = 0, h = -2, p = [];
    for (e = 0; e < u; e++)
      if (r = n[e], p.push(0), (n[f].marker !== r.marker || h !== r.token - 1) && (f = e), h = r.token, r.length = r.length || 0, !!r.close) {
        for (a.hasOwnProperty(r.marker) || (a[r.marker] = [-1, -1, -1, -1, -1, -1]), s = a[r.marker][(r.open ? 3 : 0) + r.length % 3], t = f - p[f] - 1, i = t; t > s; t -= p[t] + 1)
          if (o = n[t], o.marker === r.marker && o.open && o.end < 0 && (l = !1, (o.close || r.open) && (o.length + r.length) % 3 === 0 && (o.length % 3 !== 0 || r.length % 3 !== 0) && (l = !0), !l)) {
            c = t > 0 && !n[t - 1].open ? p[t - 1] + 1 : 0, p[e] = e - t + c, p[t] = c, r.open = !1, o.end = e, o.close = !1, i = -1, h = -2;
            break;
          }
        i !== -1 && (a[r.marker][(r.open ? 3 : 0) + (r.length || 0) % 3] = i);
      }
  }
}
var AU = function(e) {
  var t, r = e.tokens_meta, o = e.tokens_meta.length;
  for (ni(e.delimiters), t = 0; t < o; t++)
    r[t] && r[t].delimiters && ni(r[t].delimiters);
}, MU = function(e) {
  var t, r, o = 0, s = e.tokens, i = e.tokens.length;
  for (t = r = 0; t < i; t++)
    s[t].nesting < 0 && o--, s[t].level = o, s[t].nesting > 0 && o++, s[t].type === "text" && t + 1 < i && s[t + 1].type === "text" ? s[t + 1].content = s[t].content + s[t + 1].content : (t !== r && (s[r] = s[t]), r++);
  t !== r && (s.length = r);
}, vo = xo, ri = R.isWhiteSpace, oi = R.isPunctChar, si = R.isMdAsciiPunct;
function Xt(n, e, t, r) {
  this.src = n, this.env = t, this.md = e, this.tokens = r, this.tokens_meta = Array(r.length), this.pos = 0, this.posMax = this.src.length, this.level = 0, this.pending = "", this.pendingLevel = 0, this.cache = {}, this.delimiters = [], this._prev_delimiters = [], this.backticks = {}, this.backticksScanned = !1, this.linkLevel = 0;
}
Xt.prototype.pushPending = function() {
  var n = new vo("text", "", 0);
  return n.content = this.pending, n.level = this.pendingLevel, this.tokens.push(n), this.pending = "", n;
};
Xt.prototype.push = function(n, e, t) {
  this.pending && this.pushPending();
  var r = new vo(n, e, t), o = null;
  return t < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, t > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], o = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(o), r;
};
Xt.prototype.scanDelims = function(n, e) {
  var t = n, r, o, s, i, l, c, a, u, f, h = !0, p = !0, d = this.posMax, m = this.src.charCodeAt(n);
  for (r = n > 0 ? this.src.charCodeAt(n - 1) : 32; t < d && this.src.charCodeAt(t) === m; )
    t++;
  return s = t - n, o = t < d ? this.src.charCodeAt(t) : 32, a = si(r) || oi(String.fromCharCode(r)), f = si(o) || oi(String.fromCharCode(o)), c = ri(r), u = ri(o), u ? h = !1 : f && (c || a || (h = !1)), c ? p = !1 : a && (u || f || (p = !1)), e ? (i = h, l = p) : (i = h && (!p || a), l = p && (!h || f)), {
    can_open: i,
    can_close: l,
    length: s
  };
};
Xt.prototype.Token = vo;
var TU = Xt, ii = yo, kr = [
  ["text", rU],
  ["linkify", sU],
  ["newline", lU],
  ["escape", aU],
  ["backticks", uU],
  ["strikethrough", Un.tokenize],
  ["emphasis", Hn.tokenize],
  ["link", hU],
  ["image", dU],
  ["autolink", bU],
  ["html_inline", CU],
  ["entity", EU]
], yr = [
  ["balance_pairs", AU],
  ["strikethrough", Un.postProcess],
  ["emphasis", Hn.postProcess],
  // rules for pairs separate '**' into its own text tokens, which may be left unused,
  // rule below merges unused segments back with the rest of the text
  ["fragments_join", MU]
];
function en() {
  var n;
  for (this.ruler = new ii(), n = 0; n < kr.length; n++)
    this.ruler.push(kr[n][0], kr[n][1]);
  for (this.ruler2 = new ii(), n = 0; n < yr.length; n++)
    this.ruler2.push(yr[n][0], yr[n][1]);
}
en.prototype.skipToken = function(n) {
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
en.prototype.tokenize = function(n) {
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
en.prototype.parse = function(n, e, t, r) {
  var o, s, i, l = new this.State(n, e, t, r);
  for (this.tokenize(l), s = this.ruler2.getRules(""), i = s.length, o = 0; o < i; o++)
    s[o](l);
};
en.prototype.State = TU;
var OU = en, xr, li;
function NU() {
  return li || (li = 1, xr = function(n) {
    var e = {};
    n = n || {}, e.src_Any = Yl().source, e.src_Cc = Ql().source, e.src_Z = Xl().source, e.src_P = ko.source, e.src_ZPCc = [e.src_Z, e.src_P, e.src_Cc].join("|"), e.src_ZCc = [e.src_Z, e.src_Cc].join("|");
    var t = "[><｜]";
    return e.src_pseudo_letter = "(?:(?!" + t + "|" + e.src_ZPCc + ")" + e.src_Any + ")", e.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)", e.src_auth = "(?:(?:(?!" + e.src_ZCc + "|[@/\\[\\]()]).)+@)?", e.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?", e.src_host_terminator = "(?=$|" + t + "|" + e.src_ZPCc + ")(?!" + (n["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + e.src_ZPCc + "))", e.src_path = "(?:[/?#](?:(?!" + e.src_ZCc + "|" + t + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + e.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + e.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + e.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + e.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + e.src_ZCc + "|[']).)+\\'|\\'(?=" + e.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + e.src_ZCc + "|[.]|$)|" + (n["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + ",(?!" + e.src_ZCc + "|$)|;(?!" + e.src_ZCc + "|$)|\\!+(?!" + e.src_ZCc + "|[!]|$)|\\?(?!" + e.src_ZCc + "|[?]|$))+|\\/)?", e.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*', e.src_xn = "xn--[a-z0-9\\-]{1,59}", e.src_domain_root = // Allow letters & digits (http://test1)
    "(?:" + e.src_xn + "|" + e.src_pseudo_letter + "{1,63})", e.src_domain = "(?:" + e.src_xn + "|(?:" + e.src_pseudo_letter + ")|(?:" + e.src_pseudo_letter + "(?:-|" + e.src_pseudo_letter + "){0,61}" + e.src_pseudo_letter + "))", e.src_host = "(?:(?:(?:(?:" + e.src_domain + ")\\.)*" + e.src_domain + "))", e.tpl_host_fuzzy = "(?:" + e.src_ip4 + "|(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%)))", e.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%))", e.src_host_strict = e.src_host + e.src_host_terminator, e.tpl_host_fuzzy_strict = e.tpl_host_fuzzy + e.src_host_terminator, e.src_host_port_strict = e.src_host + e.src_port + e.src_host_terminator, e.tpl_host_port_fuzzy_strict = e.tpl_host_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_port_no_ip_fuzzy_strict = e.tpl_host_no_ip_fuzzy + e.src_port + e.src_host_terminator, e.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + e.src_ZPCc + "|>|$))", e.tpl_email_fuzzy = "(^|" + t + '|"|\\(|' + e.src_ZCc + ")(" + e.src_email_name + "@" + e.tpl_host_fuzzy_strict + ")", e.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_fuzzy_strict + e.src_path + ")", e.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
    // but can start with > (markdown blockquote)
    "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + e.src_ZPCc + "))((?![$+<=>^`|｜])" + e.tpl_host_port_no_ip_fuzzy_strict + e.src_path + ")", e;
  }), xr;
}
function Jr(n) {
  var e = Array.prototype.slice.call(arguments, 1);
  return e.forEach(function(t) {
    t && Object.keys(t).forEach(function(r) {
      n[r] = t[r];
    });
  }), n;
}
function jn(n) {
  return Object.prototype.toString.call(n);
}
function qU(n) {
  return jn(n) === "[object String]";
}
function RU(n) {
  return jn(n) === "[object Object]";
}
function IU(n) {
  return jn(n) === "[object RegExp]";
}
function ci(n) {
  return jn(n) === "[object Function]";
}
function FU(n) {
  return n.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
}
var ic = {
  fuzzyLink: !0,
  fuzzyEmail: !0,
  fuzzyIP: !1
};
function zU(n) {
  return Object.keys(n || {}).reduce(function(e, t) {
    return e || ic.hasOwnProperty(t);
  }, !1);
}
var LU = {
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
}, BU = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]", PU = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
function VU(n) {
  n.__index__ = -1, n.__text_cache__ = "";
}
function $U(n) {
  return function(e, t) {
    var r = e.slice(t);
    return n.test(r) ? r.match(n)[0].length : 0;
  };
}
function ai() {
  return function(n, e) {
    e.normalize(n);
  };
}
function An(n) {
  var e = n.re = NU()(n.__opts__), t = n.__tlds__.slice();
  n.onCompile(), n.__tlds_replaced__ || t.push(BU), t.push(e.src_xn), e.src_tlds = t.join("|");
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
      if (n.__compiled__[l] = a, RU(c)) {
        IU(c.validate) ? a.validate = $U(c.validate) : ci(c.validate) ? a.validate = c.validate : s(l, c), ci(c.normalize) ? a.normalize = c.normalize : c.normalize ? s(l, c) : a.normalize = ai();
        return;
      }
      if (qU(c)) {
        o.push(l);
        return;
      }
      s(l, c);
    }
  }), o.forEach(function(l) {
    n.__compiled__[n.__schemas__[l]] && (n.__compiled__[l].validate = n.__compiled__[n.__schemas__[l]].validate, n.__compiled__[l].normalize = n.__compiled__[n.__schemas__[l]].normalize);
  }), n.__compiled__[""] = { validate: null, normalize: ai() };
  var i = Object.keys(n.__compiled__).filter(function(l) {
    return l.length > 0 && n.__compiled__[l];
  }).map(FU).join("|");
  n.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")", "i"), n.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")", "ig"), n.re.schema_at_start = RegExp("^" + n.re.schema_search.source, "i"), n.re.pretest = RegExp(
    "(" + n.re.schema_test.source + ")|(" + n.re.host_fuzzy_test.source + ")|@",
    "i"
  ), VU(n);
}
function UU(n, e) {
  var t = n.__index__, r = n.__last_index__, o = n.__text_cache__.slice(t, r);
  this.schema = n.__schema__.toLowerCase(), this.index = t + e, this.lastIndex = r + e, this.raw = o, this.text = o, this.url = o;
}
function Gr(n, e) {
  var t = new UU(n, e);
  return n.__compiled__[t.schema].normalize(t, n), t;
}
function oe(n, e) {
  if (!(this instanceof oe))
    return new oe(n, e);
  e || zU(n) && (e = n, n = {}), this.__opts__ = Jr({}, ic, e), this.__index__ = -1, this.__last_index__ = -1, this.__schema__ = "", this.__text_cache__ = "", this.__schemas__ = Jr({}, LU, n), this.__compiled__ = {}, this.__tlds__ = PU, this.__tlds_replaced__ = !1, this.re = {}, An(this);
}
oe.prototype.add = function(e, t) {
  return this.__schemas__[e] = t, An(this), this;
};
oe.prototype.set = function(e) {
  return this.__opts__ = Jr(this.__opts__, e), this;
};
oe.prototype.test = function(e) {
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
oe.prototype.pretest = function(e) {
  return this.re.pretest.test(e);
};
oe.prototype.testSchemaAt = function(e, t, r) {
  return this.__compiled__[t.toLowerCase()] ? this.__compiled__[t.toLowerCase()].validate(e, r, this) : 0;
};
oe.prototype.match = function(e) {
  var t = 0, r = [];
  this.__index__ >= 0 && this.__text_cache__ === e && (r.push(Gr(this, t)), t = this.__last_index__);
  for (var o = t ? e.slice(t) : e; this.test(o); )
    r.push(Gr(this, t)), o = o.slice(this.__last_index__), t += this.__last_index__;
  return r.length ? r : null;
};
oe.prototype.matchAtStart = function(e) {
  if (this.__text_cache__ = e, this.__index__ = -1, !e.length)
    return null;
  var t = this.re.schema_at_start.exec(e);
  if (!t)
    return null;
  var r = this.testSchemaAt(e, t[2], t[0].length);
  return r ? (this.__schema__ = t[2], this.__index__ = t.index + t[1].length, this.__last_index__ = t.index + t[0].length + r, Gr(this, 0)) : null;
};
oe.prototype.tlds = function(e, t) {
  return e = Array.isArray(e) ? e : [e], t ? (this.__tlds__ = this.__tlds__.concat(e).sort().filter(function(r, o, s) {
    return r !== s[o - 1];
  }).reverse(), An(this), this) : (this.__tlds__ = e.slice(), this.__tlds_replaced__ = !0, An(this), this);
};
oe.prototype.normalize = function(e) {
  e.schema || (e.url = "http://" + e.url), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = "mailto:" + e.url);
};
oe.prototype.onCompile = function() {
};
var HU = oe;
const jU = {}, WU = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: jU
}, Symbol.toStringTag, { value: "Module" })), JU = /* @__PURE__ */ uh(WU);
var GU = {
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
}, KU = {
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
}, ZU = {
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
}, Lt = R, YU = Bn, QU = Q9, XU = C7, eH = tU, tH = OU, nH = HU, Ke = Ct, lc = JU, rH = {
  default: GU,
  zero: KU,
  commonmark: ZU
}, oH = /^(vbscript|javascript|file|data):/, sH = /^data:image\/(gif|png|jpeg|webp);/;
function iH(n) {
  var e = n.trim().toLowerCase();
  return oH.test(e) ? !!sH.test(e) : !0;
}
var cc = ["http:", "https:", "mailto:"];
function lH(n) {
  var e = Ke.parse(n, !0);
  if (e.hostname && (!e.protocol || cc.indexOf(e.protocol) >= 0))
    try {
      e.hostname = lc.toASCII(e.hostname);
    } catch {
    }
  return Ke.encode(Ke.format(e));
}
function cH(n) {
  var e = Ke.parse(n, !0);
  if (e.hostname && (!e.protocol || cc.indexOf(e.protocol) >= 0))
    try {
      e.hostname = lc.toUnicode(e.hostname);
    } catch {
    }
  return Ke.decode(Ke.format(e), Ke.decode.defaultChars + "%");
}
function ae(n, e) {
  if (!(this instanceof ae))
    return new ae(n, e);
  e || Lt.isString(n) || (e = n || {}, n = "default"), this.inline = new tH(), this.block = new eH(), this.core = new XU(), this.renderer = new QU(), this.linkify = new nH(), this.validateLink = iH, this.normalizeLink = lH, this.normalizeLinkText = cH, this.utils = Lt, this.helpers = Lt.assign({}, YU), this.options = {}, this.configure(n), e && this.set(e);
}
ae.prototype.set = function(n) {
  return Lt.assign(this.options, n), this;
};
ae.prototype.configure = function(n) {
  var e = this, t;
  if (Lt.isString(n) && (t = n, n = rH[t], !n))
    throw new Error('Wrong `markdown-it` preset "' + t + '", check name');
  if (!n)
    throw new Error("Wrong `markdown-it` preset, can't be empty");
  return n.options && e.set(n.options), n.components && Object.keys(n.components).forEach(function(r) {
    n.components[r].rules && e[r].ruler.enableOnly(n.components[r].rules), n.components[r].rules2 && e[r].ruler2.enableOnly(n.components[r].rules2);
  }), this;
};
ae.prototype.enable = function(n, e) {
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
ae.prototype.disable = function(n, e) {
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
ae.prototype.use = function(n) {
  var e = [this].concat(Array.prototype.slice.call(arguments, 1));
  return n.apply(n, e), this;
};
ae.prototype.parse = function(n, e) {
  if (typeof n != "string")
    throw new Error("Input data should be a String");
  var t = new this.core.State(n, this, e);
  return this.core.process(t), t.tokens;
};
ae.prototype.render = function(n, e) {
  return e = e || {}, this.renderer.render(this.parse(n, e), this.options, e);
};
ae.prototype.parseInline = function(n, e) {
  var t = new this.core.State(n, this, e);
  return t.inlineMode = !0, this.core.process(t), t.tokens;
};
ae.prototype.renderInline = function(n, e) {
  return e = e || {}, this.renderer.render(this.parseInline(n, e), this.options, e);
};
var aH = ae, uH = aH;
const fH = /* @__PURE__ */ ah(uH), So = new Ni({
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
function hH(n, e) {
  if (n.isText && e.isText && O.sameSet(n.marks, e.marks))
    return n.withText(n.text + e.text);
}
class pH {
  constructor(e, t) {
    this.schema = e, this.tokenHandlers = t, this.stack = [{ type: e.topNodeType, attrs: null, content: [], marks: O.none }];
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
    o && (i = hH(o, s)) ? r[r.length - 1] = i : r.push(s);
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
    this.stack.push({ type: e, attrs: t, content: [], marks: O.none });
  }
  // Close and return the node that is currently on top of the stack.
  closeNode() {
    let e = this.stack.pop();
    return this.addNode(e.type, e.attrs, e.content);
  }
}
function Et(n, e, t, r) {
  return n.getAttrs ? n.getAttrs(e, t, r) : n.attrs instanceof Function ? n.attrs(e) : n.attrs;
}
function wr(n, e) {
  return n.noCloseToken || e == "code_inline" || e == "code_block" || e == "fence";
}
function ui(n) {
  return n[n.length - 1] == `
` ? n.slice(0, n.length - 1) : n;
}
function Cr() {
}
function dH(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in e) {
    let o = e[r];
    if (o.block) {
      let s = n.nodeType(o.block);
      wr(o, r) ? t[r] = (i, l, c, a) => {
        i.openNode(s, Et(o, l, c, a)), i.addText(ui(l.content)), i.closeNode();
      } : (t[r + "_open"] = (i, l, c, a) => i.openNode(s, Et(o, l, c, a)), t[r + "_close"] = (i) => i.closeNode());
    } else if (o.node) {
      let s = n.nodeType(o.node);
      t[r] = (i, l, c, a) => i.addNode(s, Et(o, l, c, a));
    } else if (o.mark) {
      let s = n.marks[o.mark];
      wr(o, r) ? t[r] = (i, l, c, a) => {
        i.openMark(s.create(Et(o, l, c, a))), i.addText(ui(l.content)), i.closeMark(s);
      } : (t[r + "_open"] = (i, l, c, a) => i.openMark(s.create(Et(o, l, c, a))), t[r + "_close"] = (i) => i.closeMark(s));
    } else if (o.ignore)
      wr(o, r) ? t[r] = Cr : (t[r + "_open"] = Cr, t[r + "_close"] = Cr);
    else
      throw new RangeError("Unrecognized parsing spec " + JSON.stringify(o));
  }
  return t.text = (r, o) => r.addText(o.content), t.inline = (r, o) => r.parseTokens(o.children), t.softbreak = t.softbreak || ((r) => r.addText(" ")), t;
}
class mH {
  /**
  Create a parser with the given configuration. You can configure
  the markdown-it parser to parse the dialect you want, and provide
  a description of the ProseMirror entities those tokens map to in
  the `tokens` object, which maps token names to descriptions of
  what to do with them. Such a description is an object, and may
  have the following properties:
  */
  constructor(e, t, r) {
    this.schema = e, this.tokenizer = t, this.tokens = r, this.tokenHandlers = dH(e, r);
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
    let r = new pH(this.schema, this.tokenHandlers), o;
    r.parseTokens(this.tokenizer.parse(e, t));
    do
      o = r.closeNode();
    while (r.stack.length);
    return o || this.schema.topNodeType.createAndFill();
  }
}
function fi(n, e) {
  for (; ++e < n.length; )
    if (n[e].type != "list_item_open")
      return n[e].hidden;
  return !1;
}
new mH(So, fH("commonmark", { html: !1 }), {
  blockquote: { block: "blockquote" },
  paragraph: { block: "paragraph" },
  list_item: { block: "list_item" },
  bullet_list: { block: "bullet_list", getAttrs: (n, e, t) => ({ tight: fi(e, t) }) },
  ordered_list: { block: "ordered_list", getAttrs: (n, e, t) => ({
    order: +n.attrGet("start") || 1,
    tight: fi(e, t)
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
class gH {
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
    let r = new bH(this.nodes, this.marks, t);
    return r.renderContent(e), r.out;
  }
}
class bH {
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
      s && s.type.name === this.options.hardBreakNodeName && (c = c.filter((d) => {
        if (l + 1 == e.childCount)
          return !1;
        let m = e.child(l + 1);
        return d.isInSet(m.marks) && (!m.isText || /\S/.test(m.text));
      }));
      let a = r;
      if (r = "", s && s.isText && c.some((d) => {
        let m = this.marks[d.type.name];
        return m && m.expelEnclosingWhitespace && !d.isInSet(t);
      })) {
        let [d, m, g] = /^(\s*)(.*)$/m.exec(s.text);
        m && (a += m, s = g ? s.withText(g) : null, s || (c = t));
      }
      if (s && s.isText && c.some((d) => {
        let m = this.marks[d.type.name];
        return m && m.expelEnclosingWhitespace && (l == e.childCount - 1 || !d.isInSet(e.child(l + 1).marks));
      })) {
        let [d, m, g] = /^(.*?)(\s*)$/m.exec(s.text);
        g && (r = g, s = m ? s.withText(m) : null, s || (c = t));
      }
      let u = c.length ? c[c.length - 1] : null, f = u && this.marks[u.type.name].escape === !1, h = c.length - (f ? 1 : 0);
      e:
        for (let d = 0; d < h; d++) {
          let m = c[d];
          if (!this.marks[m.type.name].mixable)
            break;
          for (let g = 0; g < t.length; g++) {
            let b = t[g];
            if (!this.marks[b.type.name].mixable)
              break;
            if (m.eq(b)) {
              d > g ? c = c.slice(0, g).concat(m).concat(c.slice(g, d)).concat(c.slice(d + 1, h)) : g > d && (c = c.slice(0, d).concat(c.slice(d + 1, g)).concat(m).concat(c.slice(g, h)));
              continue e;
            }
          }
        }
      let p = 0;
      for (; p < Math.min(t.length, h) && c[p].eq(t[p]); )
        ++p;
      for (; p < t.length; )
        this.text(this.markString(t.pop(), !1, e, l), !1);
      if (a && this.text(a), s) {
        for (; t.length < h; ) {
          let d = c[t.length];
          t.push(d), this.text(this.markString(d, !0, e, l), !1), this.atBlockStart = !1;
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
const kH = {
  blockquote(n, e) {
    n.wrapBlock("> ", null, e, () => n.renderContent(e));
  },
  code_block(n, e) {
    const t = e.textContent.match(/`{3,}/gm), r = t ? t.sort().slice(-1)[0] + "`" : "```";
    n.write(r + (e.attrs.params || "") + `
`), n.text(e.textContent, !1), n.write(`
`), n.write(r), n.closeBlock(e);
  },
  heading(n, e) {
    n.write(n.repeat("#", e.attrs.level) + " "), n.renderInline(e, !1), n.closeBlock(e);
  },
  horizontal_rule(n, e) {
    n.write(e.attrs.markup || "---"), n.closeBlock(e);
  },
  bullet_list(n, e) {
    n.renderList(e, "  ", () => (e.attrs.bullet || "*") + " ");
  },
  ordered_list(n, e) {
    let t = e.attrs.order || 1, r = String(t + e.childCount - 1).length, o = n.repeat(" ", r + 2);
    n.renderList(e, o, (s) => {
      let i = String(t + s);
      return n.repeat(" ", r - i.length) + i + ". ";
    });
  },
  list_item(n, e) {
    n.renderContent(e);
  },
  paragraph(n, e) {
    n.renderInline(e), n.closeBlock(e);
  },
  image(n, e) {
    n.write("![" + n.esc(e.attrs.alt || "") + "](" + e.attrs.src.replace(/[\(\)]/g, "\\$&") + (e.attrs.title ? ' "' + e.attrs.title.replace(/"/g, '\\"') + '"' : "") + ")");
  },
  hard_break(n, e, t, r) {
    for (let o = r + 1; o < t.childCount; o++)
      if (t.child(o).type != e.type) {
        n.write(`\\
`);
        return;
      }
  },
  text(n, e) {
    n.text(e.text, !n.inAutolink);
  }
}, yH = /* @__PURE__ */ Object.assign({ "./nodes/addresses.js": Hl, "./nodes/call_to_action.js": jl, "./nodes/contacts.js": Wl, "./nodes/example_callout.js": Jl, "./nodes/information_callout.js": Gl, "./nodes/warning_callout.js": Kl }), xH = Object.values(yH), wH = Object.fromEntries(xH.map((n) => [n.name, n.toGovspeak])), CH = Object.assign(kH, wH), hi = new gH(CH, {
  em: { open: "*", close: "*", mixable: !0, expelEnclosingWhitespace: !0 },
  strong: { open: "**", close: "**", mixable: !0, expelEnclosingWhitespace: !0 },
  link: {
    open(n, e, t, r) {
      return n.inAutolink = vH(e, t, r), n.inAutolink ? "<" : "[";
    },
    close(n, e, t, r) {
      let { inAutolink: o } = n;
      return n.inAutolink = void 0, o ? ">" : "](" + e.attrs.href.replace(/[\(\)"]/g, "\\$&") + (e.attrs.title ? ` "${e.attrs.title.replace(/"/g, '\\"')}"` : "") + ")";
    },
    mixable: !0
  },
  code: {
    open(n, e, t, r) {
      return pi(t.child(r), -1);
    },
    close(n, e, t, r) {
      return pi(t.child(r - 1), 1);
    },
    escape: !1
  }
});
function pi(n, e) {
  let t = /`+/g, r, o = 0;
  if (n.isText)
    for (; r = t.exec(n.text); )
      o = Math.max(o, r[0].length);
  let s = o > 0 && e > 0 ? " `" : "`";
  for (let i = 0; i < o; i++)
    s += "`";
  return o > 0 && e < 0 && (s += " "), s;
}
function vH(n, e, t) {
  if (n.attrs.title || !/^\w+:/.test(n.attrs.href))
    return !1;
  let r = e.child(t);
  return !r.isText || r.text != n.attrs.href || r.marks[r.marks.length - 1] != n ? !1 : t == e.childCount - 1 || !n.isInSet(e.child(t + 1).marks);
}
const SH = ["ol", 0], _H = ["ul", 0], DH = ["li", 0], EH = {
  attrs: { order: { default: 1 } },
  parseDOM: [{ tag: "ol", getAttrs(n) {
    return { order: n.hasAttribute("start") ? +n.getAttribute("start") : 1 };
  } }],
  toDOM(n) {
    return n.attrs.order == 1 ? SH : ["ol", { start: n.attrs.order }, 0];
  }
}, AH = {
  parseDOM: [{ tag: "ul" }],
  toDOM() {
    return _H;
  }
}, MH = {
  parseDOM: [{ tag: "li" }],
  toDOM() {
    return DH;
  },
  defining: !0
};
function vr(n, e) {
  let t = {};
  for (let r in n)
    t[r] = n[r];
  for (let r in e)
    t[r] = e[r];
  return t;
}
function TH(n, e, t) {
  return n.append({
    ordered_list: vr(EH, { content: "list_item+", group: t }),
    bullet_list: vr(AH, { content: "list_item+", group: t }),
    list_item: vr(MH, { content: e })
  });
}
function Kr(n, e = null) {
  return function(t, r) {
    let { $from: o, $to: s } = t.selection, i = o.blockRange(s), l = !1, c = i;
    if (!i)
      return !1;
    if (i.depth >= 2 && o.node(i.depth - 1).type.compatibleContent(n) && i.startIndex == 0) {
      if (o.index(i.depth - 1) == 0)
        return !1;
      let u = t.doc.resolve(i.start - 2);
      c = new bn(u, u, i.depth), i.endIndex < i.parent.childCount && (i = new bn(o, t.doc.resolve(s.end(i.depth)), i.depth)), l = !0;
    }
    let a = Qr(c, n, e, i);
    return a ? (r && r(OH(t.tr, i, a, l, n).scrollIntoView()), !0) : !1;
  };
}
function OH(n, e, t, r, o) {
  let s = k.empty;
  for (let u = t.length - 1; u >= 0; u--)
    s = k.from(t[u].type.create(t[u].attrs, s));
  n.step(new U(e.start - (r ? 2 : 0), e.end, e.start, e.end, new C(s, 0, 0), t.length, !0));
  let i = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == o && (i = u + 1);
  let l = t.length - i, c = e.start + t.length - (r ? 2 : 0), a = e.parent;
  for (let u = e.startIndex, f = e.endIndex, h = !0; u < f; u++, h = !1)
    !h && pt(n.doc, c, l) && (n.split(c, l), c += 2 * l), c += a.child(u).nodeSize;
  return n;
}
function NH(n, e) {
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
        let f = k.empty, h = o.index(-1) ? 1 : o.index(-2) ? 2 : 3;
        for (let b = o.depth - h; b >= o.depth - 3; b--)
          f = k.from(o.node(b).copy(f));
        let p = o.indexAfter(-1) < o.node(-2).childCount ? 1 : o.indexAfter(-2) < o.node(-3).childCount ? 2 : 3;
        f = f.append(k.from(n.createAndFill()));
        let d = o.before(o.depth - (h - 1)), m = t.tr.replace(d, o.after(-p), new C(f, 4 - h, 0)), g = -1;
        m.doc.nodesBetween(d, m.doc.content.size, (b, y) => {
          if (g > -1)
            return !1;
          b.isTextblock && b.content.size == 0 && (g = y + 1);
        }), g > -1 && m.setSelection(T.near(m.doc.resolve(g))), r(m.scrollIntoView());
      }
      return !0;
    }
    let c = s.pos == o.end() ? l.contentMatchAt(0).defaultType : null, a = t.tr.delete(o.pos, s.pos), u = c ? [e ? { type: n, attrs: e } : null, { type: c }] : void 0;
    return pt(a.doc, o.pos, 2, u) ? (r && r(a.split(o.pos, 2, u).scrollIntoView()), !0) : !1;
  };
}
function qH(n) {
  return function(e, t) {
    let { $from: r, $to: o } = e.selection, s = r.blockRange(o, (i) => i.childCount > 0 && i.firstChild.type == n);
    return s ? t ? r.node(s.depth - 1).type == n ? RH(e, t, n, s) : IH(e, t, s) : !0 : !1;
  };
}
function RH(n, e, t, r) {
  let o = n.tr, s = r.end, i = r.$to.end(r.depth);
  s < i && (o.step(new U(s - 1, i, s, i, new C(k.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new bn(o.doc.resolve(r.$from.pos), o.doc.resolve(i), r.depth));
  const l = Kt(r);
  if (l == null)
    return !1;
  o.lift(r, l);
  let c = o.mapping.map(s, -1) - 1;
  return wt(o.doc, c) && o.join(c), e(o.scrollIntoView()), !0;
}
function IH(n, e, t) {
  let r = n.tr, o = t.parent;
  for (let p = t.end, d = t.endIndex - 1, m = t.startIndex; d > m; d--)
    p -= o.child(d).nodeSize, r.delete(p - 1, p + 1);
  let s = r.doc.resolve(t.start), i = s.nodeAfter;
  if (r.mapping.map(t.end) != t.start + s.nodeAfter.nodeSize)
    return !1;
  let l = t.startIndex == 0, c = t.endIndex == o.childCount, a = s.node(-1), u = s.index(-1);
  if (!a.canReplace(u + (l ? 0 : 1), u + 1, i.content.append(c ? k.empty : k.from(o))))
    return !1;
  let f = s.pos, h = f + i.nodeSize;
  return r.step(new U(f - (l ? 1 : 0), h + (c ? 1 : 0), f + 1, h - 1, new C((l ? k.empty : k.from(o.copy(k.empty))).append(c ? k.empty : k.from(o.copy(k.empty))), l ? 0 : 1, c ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function FH(n) {
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
      let a = c.lastChild && c.lastChild.type == l.type, u = k.from(a ? n.create() : null), f = new C(k.from(n.create(null, k.from(l.type.create(null, u)))), a ? 3 : 1, 0), h = s.start, p = s.end;
      t(e.tr.step(new U(h - (a ? 3 : 1), p, h, p, f, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
const zH = /* @__PURE__ */ Object.assign({ "./nodes/addresses.js": Hl, "./nodes/call_to_action.js": jl, "./nodes/contacts.js": Wl, "./nodes/example_callout.js": Jl, "./nodes/information_callout.js": Gl, "./nodes/warning_callout.js": Kl }), _o = Object.entries(zH).map((n) => n[1]);
let Gt = So.spec.nodes;
Gt = TH(Gt, "paragraph block*", "block");
_o.forEach((n) => {
  Gt = Gt.addToEnd(n.name, n.schema);
});
const di = new Ni({
  nodes: Gt,
  marks: So.spec.marks
});
var Ve = {
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
}, Mn = {
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
}, LH = typeof navigator < "u" && /Mac/.test(navigator.platform), BH = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var $ = 0; $ < 10; $++)
  Ve[48 + $] = Ve[96 + $] = String($);
for (var $ = 1; $ <= 24; $++)
  Ve[$ + 111] = "F" + $;
for (var $ = 65; $ <= 90; $++)
  Ve[$] = String.fromCharCode($ + 32), Mn[$] = String.fromCharCode($);
for (var Sr in Ve)
  Mn.hasOwnProperty(Sr) || (Mn[Sr] = Ve[Sr]);
function PH(n) {
  var e = LH && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || BH && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Mn : Ve)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const VH = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function $H(n) {
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
      VH ? i = !0 : o = !0;
    else
      throw new Error("Unrecognized modifier name: " + c);
  }
  return r && (t = "Alt-" + t), o && (t = "Ctrl-" + t), i && (t = "Meta-" + t), s && (t = "Shift-" + t), t;
}
function UH(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[$H(t)] = n[t];
  return e;
}
function _r(n, e, t = !0) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t && e.shiftKey && (n = "Shift-" + n), n;
}
function mi(n) {
  return new $e({ props: { handleKeyDown: ac(n) } });
}
function ac(n) {
  let e = UH(n);
  return function(t, r) {
    let o = PH(r), s, i = e[_r(o, r)];
    if (i && i(t.state, t.dispatch, t))
      return !0;
    if (o.length == 1 && o != " ") {
      if (r.shiftKey) {
        let l = e[_r(o, r, !1)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
      if ((r.shiftKey || r.altKey || r.metaKey || o.charCodeAt(0) > 127) && (s = Ve[r.keyCode]) && s != o) {
        let l = e[_r(s, r)];
        if (l && l(t.state, t.dispatch, t))
          return !0;
      }
    }
    return !1;
  };
}
function HH(n = {}) {
  return new $e({
    view(e) {
      return new jH(e, n);
    }
  });
}
class jH {
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
        let l = $i(this.editorView.state.doc, i, this.editorView.dragging.slice);
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
class z extends T {
  /**
  Create a gap cursor.
  */
  constructor(e) {
    super(e, e);
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    return z.valid(r) ? new z(r) : T.near(r);
  }
  content() {
    return C.empty;
  }
  eq(e) {
    return e instanceof z && e.head == this.head;
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
    return new z(e.resolve(t.pos));
  }
  /**
  @internal
  */
  getBookmark() {
    return new Do(this.anchor);
  }
  /**
  @internal
  */
  static valid(e) {
    let t = e.parent;
    if (t.isTextblock || !WH(e) || !JH(e))
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
        if (!r && z.valid(e))
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
          if (z.valid(c))
            return c;
        }
        for (; ; ) {
          let i = t > 0 ? s.firstChild : s.lastChild;
          if (!i) {
            if (s.isAtom && !s.isText && !_.isSelectable(s)) {
              e = e.doc.resolve(o + s.nodeSize * t), r = !1;
              continue e;
            }
            break;
          }
          s = i, o += t;
          let l = e.doc.resolve(o);
          if (z.valid(l))
            return l;
        }
        return null;
      }
  }
}
z.prototype.visible = !1;
z.findFrom = z.findGapCursorFrom;
T.jsonID("gapcursor", z);
class Do {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new Do(e.map(this.pos));
  }
  resolve(e) {
    let t = e.resolve(this.pos);
    return z.valid(t) ? new z(t) : T.near(t);
  }
}
function WH(n) {
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
function JH(n) {
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
function GH() {
  return new $e({
    props: {
      decorations: QH,
      createSelectionBetween(n, e, t) {
        return e.pos == t.pos && z.valid(t) ? new z(t) : null;
      },
      handleClick: ZH,
      handleKeyDown: KH,
      handleDOMEvents: { beforeinput: YH }
    }
  });
}
const KH = ac({
  ArrowLeft: an("horiz", -1),
  ArrowRight: an("horiz", 1),
  ArrowUp: an("vert", -1),
  ArrowDown: an("vert", 1)
});
function an(n, e) {
  const t = n == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, o, s) {
    let i = r.selection, l = e > 0 ? i.$to : i.$from, c = i.empty;
    if (i instanceof I) {
      if (!s.endOfTextblock(t) || l.depth == 0)
        return !1;
      c = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let a = z.findGapCursorFrom(l, e, c);
    return a ? (o && o(r.tr.setSelection(new z(a))), !0) : !1;
  };
}
function ZH(n, e, t) {
  if (!n || !n.editable)
    return !1;
  let r = n.state.doc.resolve(e);
  if (!z.valid(r))
    return !1;
  let o = n.posAtCoords({ left: t.clientX, top: t.clientY });
  return o && o.inside > -1 && _.isSelectable(n.state.doc.nodeAt(o.inside)) ? !1 : (n.dispatch(n.state.tr.setSelection(new z(r))), !0);
}
function YH(n, e) {
  if (e.inputType != "insertCompositionText" || !(n.state.selection instanceof z))
    return !1;
  let { $from: t } = n.state.selection, r = t.parent.contentMatchAt(t.index()).findWrapping(n.state.schema.nodes.text);
  if (!r)
    return !1;
  let o = k.empty;
  for (let i = r.length - 1; i >= 0; i--)
    o = k.from(r[i].createAndFill(null, o));
  let s = n.state.tr.replace(t.pos, t.pos, new C(o, 0, 0));
  return s.setSelection(I.near(s.doc.resolve(t.pos + 1))), n.dispatch(s), !1;
}
function QH(n) {
  if (!(n.selection instanceof z))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", B.create(n.doc, [le.widget(n.selection.head, e, { key: "gapcursor" })]);
}
const un = "ProseMirror-prompt";
function uc(n) {
  let e = document.body.appendChild(document.createElement("div"));
  e.className = un;
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
  s.type = "submit", s.className = un + "-submit", s.textContent = "OK";
  let i = document.createElement("button");
  i.type = "button", i.className = un + "-cancel", i.textContent = "Cancel", i.addEventListener("click", r);
  let l = e.appendChild(document.createElement("form"));
  n.title && (l.appendChild(document.createElement("h5")).textContent = n.title), o.forEach((h) => {
    l.appendChild(document.createElement("div")).appendChild(h);
  });
  let c = l.appendChild(document.createElement("div"));
  c.className = un + "-buttons", c.appendChild(s), c.appendChild(document.createTextNode(" ")), c.appendChild(i);
  let a = e.getBoundingClientRect();
  e.style.top = (window.innerHeight - a.height) / 2 + "px", e.style.left = (window.innerWidth - a.width) / 2 + "px";
  let u = () => {
    let h = XH(n.fields, o);
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
function XH(n, e) {
  let t = /* @__PURE__ */ Object.create(null), r = 0;
  for (let o in n) {
    let s = n[o], i = e[r++], l = s.read(i), c = s.validate(l);
    if (c)
      return ej(i, c), null;
    t[o] = s.clean(l);
  }
  return t;
}
function ej(n, e) {
  let t = n.parentNode, r = t.appendChild(document.createElement("div"));
  r.style.left = n.offsetLeft + n.offsetWidth + 2 + "px", r.style.top = n.offsetTop - 5 + "px", r.className = "ProseMirror-invalid", r.textContent = e, setTimeout(() => t.removeChild(r), 1500);
}
class tj {
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
class Bt extends tj {
  render() {
    let e = document.createElement("input");
    return e.type = "text", e.placeholder = this.options.label, e.value = this.options.value || "", e.autocomplete = "off", e;
  }
}
function fc(n, e) {
  let t = n.selection.$from;
  for (let r = t.depth; r >= 0; r--) {
    let o = t.index(r);
    if (t.node(r).canReplaceWith(o, o, e))
      return !0;
  }
  return !1;
}
function nj(n) {
  return new pe({
    title: "Insert image",
    label: "Image",
    enable(e) {
      return fc(e, n);
    },
    run(e, t, r) {
      let { from: o, to: s } = e.selection, i = null;
      e.selection instanceof _ && e.selection.node.type == n && (i = e.selection.node.attrs), uc({
        title: "Insert image",
        fields: {
          src: new Bt({ label: "Location", required: !0, value: i && i.src }),
          title: new Bt({ label: "Title", value: i && i.title }),
          alt: new Bt({
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
function hc(n, e) {
  let t = {
    label: e.title,
    run: n
  };
  for (let r in e)
    t[r] = e[r];
  return !e.enable && !e.select && (t[e.enable ? "enable" : "select"] = (r) => n(r)), new pe(t);
}
function Zr(n, e) {
  let { from: t, $from: r, to: o, empty: s } = n.selection;
  return s ? !!e.isInSet(n.storedMarks || r.marks()) : n.doc.rangeHasMark(t, o, e);
}
function Dr(n, e) {
  let t = {
    active(r) {
      return Zr(r, n);
    }
  };
  for (let r in e)
    t[r] = e[r];
  return hc(qe(n), t);
}
function rj(n) {
  return new pe({
    title: "Add or remove link",
    icon: ie.link,
    active(e) {
      return Zr(e, n);
    },
    enable(e) {
      return !e.selection.empty;
    },
    run(e, t, r) {
      if (Zr(e, n))
        return qe(n)(e, t), !0;
      uc({
        title: "Create a link",
        fields: {
          href: new Bt({
            label: "Link target",
            required: !0
          }),
          title: new Bt({ label: "Title" })
        },
        callback(o) {
          qe(n, o)(r.state, r.dispatch), r.focus();
        }
      });
    }
  });
}
function gi(n, e) {
  return hc(Kr(n, e.attrs), e);
}
function pc(n) {
  let e = {}, t;
  (t = n.marks.strong) && (e.toggleStrong = Dr(t, { title: "Toggle strong style", icon: ie.strong })), (t = n.marks.em) && (e.toggleEm = Dr(t, { title: "Toggle emphasis", icon: ie.em })), (t = n.marks.code) && (e.toggleCode = Dr(t, { title: "Toggle code font", icon: ie.code })), (t = n.marks.link) && (e.toggleLink = rj(t));
  let r;
  if ((r = n.nodes.image) && (e.insertImage = nj(r)), (r = n.nodes.bullet_list) && (e.wrapBulletList = gi(r, {
    title: "Wrap in bullet list",
    icon: ie.bulletList
  })), (r = n.nodes.ordered_list) && (e.wrapOrderedList = gi(r, {
    title: "Wrap in ordered list",
    icon: ie.orderedList
  })), (r = n.nodes.blockquote) && (e.wrapBlockQuote = Qt(r, {
    title: "Wrap in block quote",
    icon: ie.blockquote
  })), (r = n.nodes.paragraph) && (e.makeParagraph = zt(r, {
    title: "Change to paragraph",
    label: "Plain"
  })), (r = n.nodes.code_block) && (e.makeCodeBlock = zt(r, {
    title: "Change to code block",
    label: "Code"
  })), r = n.nodes.heading)
    for (let s = 1; s <= 10; s++)
      e["makeHead" + s] = zt(r, {
        title: "Change to heading " + s,
        label: "Level " + s,
        attrs: { level: s }
      });
  if (r = n.nodes.horizontal_rule) {
    let s = r;
    e.insertHorizontalRule = new pe({
      title: "Insert horizontal rule",
      label: "Horizontal rule",
      enable(i) {
        return fc(i, s);
      },
      run(i, l) {
        l(i.tr.replaceSelectionWith(s.create()));
      }
    });
  }
  let o = (s) => s.filter((i) => i);
  return e.insertMenu = new Es(o([e.insertImage, e.insertHorizontalRule]), { label: "Insert" }), e.typeMenu = new Es(o([e.makeParagraph, e.makeCodeBlock, e.makeHead1 && new mf(o([
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
    kf,
    yf,
    xf
  ])], e.fullMenu = e.inlineMenu.concat([[e.insertMenu, e.typeMenu]], [[wf, Cf]], e.blockMenu), e;
}
const bi = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function oj(n, e) {
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
  if (o("Mod-z", Dn), o("Shift-Mod-z", Wt), o("Backspace", Of), bi || o("Mod-y", Wt), o("Alt-ArrowUp", Vr), o("Alt-ArrowDown", Uu), o("Mod-BracketLeft", $r), o("Escape", Ur), (r = n.marks.strong) && (o("Mod-b", qe(r)), o("Mod-B", qe(r))), (r = n.marks.em) && (o("Mod-i", qe(r)), o("Mod-I", qe(r))), (r = n.marks.code) && o("Mod-`", qe(r)), (r = n.nodes.bullet_list) && o("Shift-Ctrl-8", Kr(r)), (r = n.nodes.ordered_list) && o("Shift-Ctrl-9", Kr(r)), (r = n.nodes.blockquote) && o("Ctrl->", Hr(r)), r = n.nodes.hard_break) {
    let s = r, i = In(ql, (l, c) => (c && c(l.tr.replaceSelectionWith(s.create()).scrollIntoView()), !0));
    o("Mod-Enter", i), o("Shift-Enter", i), bi && o("Ctrl-Enter", i);
  }
  if ((r = n.nodes.list_item) && (o("Enter", NH(r)), o("Mod-[", qH(r)), o("Mod-]", FH(r))), (r = n.nodes.paragraph) && o("Shift-Ctrl-0", hn(r)), (r = n.nodes.code_block) && o("Shift-Ctrl-\\", hn(r)), r = n.nodes.heading)
    for (let s = 1; s <= 6; s++)
      o("Shift-Ctrl-" + s, hn(r, { level: s }));
  if (r = n.nodes.horizontal_rule) {
    let s = r;
    o("Mod-_", (i, l) => (l && l(i.tr.replaceSelectionWith(s.create()).scrollIntoView()), !0));
  }
  return t;
}
function sj(n) {
  return st(/^\s*>\s$/, n);
}
function ij(n) {
  return st(/^(\d+)\.\s$/, n, (e) => ({ order: +e[1] }), (e, t) => t.childCount + t.attrs.order == +e[1]);
}
function lj(n) {
  return st(/^\s*([-+*])\s$/, n);
}
function cj(n) {
  return Fn(/^```$/, n);
}
function aj(n, e) {
  return Fn(new RegExp("^(#{1," + e + "})\\s$"), n, (t) => ({ level: t[1].length }));
}
function uj(n) {
  let e = Lf.concat(qf, Nf), t;
  return (t = n.nodes.blockquote) && e.push(sj(t)), (t = n.nodes.ordered_list) && e.push(ij(t)), (t = n.nodes.bullet_list) && e.push(lj(t)), (t = n.nodes.code_block) && e.push(cj(t)), (t = n.nodes.heading) && e.push(aj(t, 6)), Ul({ rules: e });
}
function fj(n) {
  let e = [
    uj(n.schema),
    mi(oj(n.schema, n.mapKeys)),
    mi(tf),
    HH(),
    GH()
  ];
  return n.menuBar !== !1 && e.push(Sf({
    floating: n.floatingMenu !== !1,
    content: n.menuContent || pc(n.schema).fullMenu
  })), n.history !== !1 && e.push(uf()), e.concat(new $e({
    props: {
      attributes: { class: "ProseMirror-example-setup-style" }
    }
  }));
}
const hj = (n) => {
  const e = pc(n);
  return _o.forEach((t) => {
    t.buildMenu({ menu: e, schema: n });
  }), e.fullMenu;
}, pj = (n) => {
  const e = _o.flatMap((t) => t.inputRules(n));
  return Ul({ rules: e });
}, dj = (n) => {
  n.menuContent = hj(n.schema);
  const e = fj(n);
  return e.pop(), e.push(new $e({
    props: {
      attributes: { class: "govspeak" }
    }
  })), e.push(pj(n.schema)), e;
};
class mj {
  constructor(e, t, r) {
    let o = ft.create({
      doc: gt.fromSchema(di).parse(e),
      plugins: dj({ schema: di })
    });
    window.view = new Ru(t, {
      state: o,
      dispatchTransaction(s) {
        let i = view.state.apply(s);
        view.updateState(i), r.value = hi.serialize(window.view.state.doc);
      }
    }), r.value = hi.serialize(window.view.state.doc);
  }
}
export {
  mj as default
};
