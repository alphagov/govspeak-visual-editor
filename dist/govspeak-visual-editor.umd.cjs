(function (jn) {
  typeof define == "function" && define.amd ? define(jn) : jn();
})(function () {
  "use strict";
  const jn = "";
  function V(n) {
    this.content = n;
  }
  (V.prototype = {
    constructor: V,
    find: function (n) {
      for (var e = 0; e < this.content.length; e += 2)
        if (this.content[e] === n) return e;
      return -1;
    },
    get: function (n) {
      var e = this.find(n);
      return e == -1 ? void 0 : this.content[e + 1];
    },
    update: function (n, e, t) {
      var r = t && t != n ? this.remove(t) : this,
        o = r.find(n),
        s = r.content.slice();
      return (
        o == -1 ? s.push(t || n, e) : ((s[o + 1] = e), t && (s[o] = t)),
        new V(s)
      );
    },
    remove: function (n) {
      var e = this.find(n);
      if (e == -1) return this;
      var t = this.content.slice();
      return t.splice(e, 2), new V(t);
    },
    addToStart: function (n, e) {
      return new V([n, e].concat(this.remove(n).content));
    },
    addToEnd: function (n, e) {
      var t = this.remove(n).content.slice();
      return t.push(n, e), new V(t);
    },
    addBefore: function (n, e, t) {
      var r = this.remove(e),
        o = r.content.slice(),
        s = r.find(n);
      return o.splice(s == -1 ? o.length : s, 0, e, t), new V(o);
    },
    forEach: function (n) {
      for (var e = 0; e < this.content.length; e += 2)
        n(this.content[e], this.content[e + 1]);
    },
    prepend: function (n) {
      return (
        (n = V.from(n)),
        n.size ? new V(n.content.concat(this.subtract(n).content)) : this
      );
    },
    append: function (n) {
      return (
        (n = V.from(n)),
        n.size ? new V(this.subtract(n).content.concat(n.content)) : this
      );
    },
    subtract: function (n) {
      var e = this;
      n = V.from(n);
      for (var t = 0; t < n.content.length; t += 2) e = e.remove(n.content[t]);
      return e;
    },
    toObject: function () {
      var n = {};
      return (
        this.forEach(function (e, t) {
          n[e] = t;
        }),
        n
      );
    },
    get size() {
      return this.content.length >> 1;
    },
  }),
    (V.from = function (n) {
      if (n instanceof V) return n;
      var e = [];
      if (n) for (var t in n) e.push(t, n[t]);
      return new V(e);
    });
  function _o(n, e, t) {
    for (let r = 0; ; r++) {
      if (r == n.childCount || r == e.childCount)
        return n.childCount == e.childCount ? null : t;
      let o = n.child(r),
        s = e.child(r);
      if (o == s) {
        t += o.nodeSize;
        continue;
      }
      if (!o.sameMarkup(s)) return t;
      if (o.isText && o.text != s.text) {
        for (let i = 0; o.text[i] == s.text[i]; i++) t++;
        return t;
      }
      if (o.content.size || s.content.size) {
        let i = _o(o.content, s.content, t + 1);
        if (i != null) return i;
      }
      t += o.nodeSize;
    }
  }
  function Mo(n, e, t, r) {
    for (let o = n.childCount, s = e.childCount; ; ) {
      if (o == 0 || s == 0) return o == s ? null : { a: t, b: r };
      let i = n.child(--o),
        l = e.child(--s),
        c = i.nodeSize;
      if (i == l) {
        (t -= c), (r -= c);
        continue;
      }
      if (!i.sameMarkup(l)) return { a: t, b: r };
      if (i.isText && i.text != l.text) {
        let a = 0,
          u = Math.min(i.text.length, l.text.length);
        for (
          ;
          a < u &&
          i.text[i.text.length - a - 1] == l.text[l.text.length - a - 1];

        )
          a++, t--, r--;
        return { a: t, b: r };
      }
      if (i.content.size || l.content.size) {
        let a = Mo(i.content, l.content, t - 1, r - 1);
        if (a) return a;
      }
      (t -= c), (r -= c);
    }
  }
  class y {
    constructor(e, t) {
      if (((this.content = e), (this.size = t || 0), t == null))
        for (let r = 0; r < e.length; r++) this.size += e[r].nodeSize;
    }
    nodesBetween(e, t, r, o = 0, s) {
      for (let i = 0, l = 0; l < t; i++) {
        let c = this.content[i],
          a = l + c.nodeSize;
        if (a > e && r(c, o + l, s || null, i) !== !1 && c.content.size) {
          let u = l + 1;
          c.nodesBetween(
            Math.max(0, e - u),
            Math.min(c.content.size, t - u),
            r,
            o + u,
          );
        }
        l = a;
      }
    }
    descendants(e) {
      this.nodesBetween(0, this.size, e);
    }
    textBetween(e, t, r, o) {
      let s = "",
        i = !0;
      return (
        this.nodesBetween(
          e,
          t,
          (l, c) => {
            let a = l.isText
              ? l.text.slice(Math.max(e, c) - c, t - c)
              : l.isLeaf
                ? o
                  ? typeof o == "function"
                    ? o(l)
                    : o
                  : l.type.spec.leafText
                    ? l.type.spec.leafText(l)
                    : ""
                : "";
            l.isBlock &&
              ((l.isLeaf && a) || l.isTextblock) &&
              r &&
              (i ? (i = !1) : (s += r)),
              (s += a);
          },
          0,
        ),
        s
      );
    }
    append(e) {
      if (!e.size) return this;
      if (!this.size) return e;
      let t = this.lastChild,
        r = e.firstChild,
        o = this.content.slice(),
        s = 0;
      for (
        t.isText &&
        t.sameMarkup(r) &&
        ((o[o.length - 1] = t.withText(t.text + r.text)), (s = 1));
        s < e.content.length;
        s++
      )
        o.push(e.content[s]);
      return new y(o, this.size + e.size);
    }
    cut(e, t = this.size) {
      if (e == 0 && t == this.size) return this;
      let r = [],
        o = 0;
      if (t > e)
        for (let s = 0, i = 0; i < t; s++) {
          let l = this.content[s],
            c = i + l.nodeSize;
          c > e &&
            ((i < e || c > t) &&
              (l.isText
                ? (l = l.cut(
                    Math.max(0, e - i),
                    Math.min(l.text.length, t - i),
                  ))
                : (l = l.cut(
                    Math.max(0, e - i - 1),
                    Math.min(l.content.size, t - i - 1),
                  ))),
            r.push(l),
            (o += l.nodeSize)),
            (i = c);
        }
      return new y(r, o);
    }
    cutByIndex(e, t) {
      return e == t
        ? y.empty
        : e == 0 && t == this.content.length
          ? this
          : new y(this.content.slice(e, t));
    }
    replaceChild(e, t) {
      let r = this.content[e];
      if (r == t) return this;
      let o = this.content.slice(),
        s = this.size + t.nodeSize - r.nodeSize;
      return (o[e] = t), new y(o, s);
    }
    addToStart(e) {
      return new y([e].concat(this.content), this.size + e.nodeSize);
    }
    addToEnd(e) {
      return new y(this.content.concat(e), this.size + e.nodeSize);
    }
    eq(e) {
      if (this.content.length != e.content.length) return !1;
      for (let t = 0; t < this.content.length; t++)
        if (!this.content[t].eq(e.content[t])) return !1;
      return !0;
    }
    get firstChild() {
      return this.content.length ? this.content[0] : null;
    }
    get lastChild() {
      return this.content.length ? this.content[this.content.length - 1] : null;
    }
    get childCount() {
      return this.content.length;
    }
    child(e) {
      let t = this.content[e];
      if (!t) throw new RangeError("Index " + e + " out of range for " + this);
      return t;
    }
    maybeChild(e) {
      return this.content[e] || null;
    }
    forEach(e) {
      for (let t = 0, r = 0; t < this.content.length; t++) {
        let o = this.content[t];
        e(o, r, t), (r += o.nodeSize);
      }
    }
    findDiffStart(e, t = 0) {
      return _o(this, e, t);
    }
    findDiffEnd(e, t = this.size, r = e.size) {
      return Mo(this, e, t, r);
    }
    findIndex(e, t = -1) {
      if (e == 0) return tn(0, e);
      if (e == this.size) return tn(this.content.length, e);
      if (e > this.size || e < 0)
        throw new RangeError(`Position ${e} outside of fragment (${this})`);
      for (let r = 0, o = 0; ; r++) {
        let s = this.child(r),
          i = o + s.nodeSize;
        if (i >= e) return i == e || t > 0 ? tn(r + 1, i) : tn(r, o);
        o = i;
      }
    }
    toString() {
      return "<" + this.toStringInner() + ">";
    }
    toStringInner() {
      return this.content.join(", ");
    }
    toJSON() {
      return this.content.length ? this.content.map((e) => e.toJSON()) : null;
    }
    static fromJSON(e, t) {
      if (!t) return y.empty;
      if (!Array.isArray(t))
        throw new RangeError("Invalid input for Fragment.fromJSON");
      return new y(t.map(e.nodeFromJSON));
    }
    static fromArray(e) {
      if (!e.length) return y.empty;
      let t,
        r = 0;
      for (let o = 0; o < e.length; o++) {
        let s = e[o];
        (r += s.nodeSize),
          o && s.isText && e[o - 1].sameMarkup(s)
            ? (t || (t = e.slice(0, o)),
              (t[t.length - 1] = s.withText(t[t.length - 1].text + s.text)))
            : t && t.push(s);
      }
      return new y(t || e, r);
    }
    static from(e) {
      if (!e) return y.empty;
      if (e instanceof y) return e;
      if (Array.isArray(e)) return this.fromArray(e);
      if (e.attrs) return new y([e], e.nodeSize);
      throw new RangeError(
        "Can not convert " +
          e +
          " to a Fragment" +
          (e.nodesBetween
            ? " (looks like multiple versions of prosemirror-model were loaded)"
            : ""),
      );
    }
  }
  y.empty = new y([], 0);
  const Jn = { index: 0, offset: 0 };
  function tn(n, e) {
    return (Jn.index = n), (Jn.offset = e), Jn;
  }
  function nn(n, e) {
    if (n === e) return !0;
    if (!(n && typeof n == "object") || !(e && typeof e == "object")) return !1;
    let t = Array.isArray(n);
    if (Array.isArray(e) != t) return !1;
    if (t) {
      if (n.length != e.length) return !1;
      for (let r = 0; r < n.length; r++) if (!nn(n[r], e[r])) return !1;
    } else {
      for (let r in n) if (!(r in e) || !nn(n[r], e[r])) return !1;
      for (let r in e) if (!(r in n)) return !1;
    }
    return !0;
  }
  class q {
    constructor(e, t) {
      (this.type = e), (this.attrs = t);
    }
    addToSet(e) {
      let t,
        r = !1;
      for (let o = 0; o < e.length; o++) {
        let s = e[o];
        if (this.eq(s)) return e;
        if (this.type.excludes(s.type)) t || (t = e.slice(0, o));
        else {
          if (s.type.excludes(this.type)) return e;
          !r &&
            s.type.rank > this.type.rank &&
            (t || (t = e.slice(0, o)), t.push(this), (r = !0)),
            t && t.push(s);
        }
      }
      return t || (t = e.slice()), r || t.push(this), t;
    }
    removeFromSet(e) {
      for (let t = 0; t < e.length; t++)
        if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
      return e;
    }
    isInSet(e) {
      for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
      return !1;
    }
    eq(e) {
      return this == e || (this.type == e.type && nn(this.attrs, e.attrs));
    }
    toJSON() {
      let e = { type: this.type.name };
      for (let t in this.attrs) {
        e.attrs = this.attrs;
        break;
      }
      return e;
    }
    static fromJSON(e, t) {
      if (!t) throw new RangeError("Invalid input for Mark.fromJSON");
      let r = e.marks[t.type];
      if (!r)
        throw new RangeError(`There is no mark type ${t.type} in this schema`);
      return r.create(t.attrs);
    }
    static sameSet(e, t) {
      if (e == t) return !0;
      if (e.length != t.length) return !1;
      for (let r = 0; r < e.length; r++) if (!e[r].eq(t[r])) return !1;
      return !0;
    }
    static setFrom(e) {
      if (!e || (Array.isArray(e) && e.length == 0)) return q.none;
      if (e instanceof q) return [e];
      let t = e.slice();
      return t.sort((r, o) => r.type.rank - o.type.rank), t;
    }
  }
  q.none = [];
  class rn extends Error {}
  class v {
    constructor(e, t, r) {
      (this.content = e), (this.openStart = t), (this.openEnd = r);
    }
    get size() {
      return this.content.size - this.openStart - this.openEnd;
    }
    insertAt(e, t) {
      let r = qo(this.content, e + this.openStart, t);
      return r && new v(r, this.openStart, this.openEnd);
    }
    removeBetween(e, t) {
      return new v(
        To(this.content, e + this.openStart, t + this.openStart),
        this.openStart,
        this.openEnd,
      );
    }
    eq(e) {
      return (
        this.content.eq(e.content) &&
        this.openStart == e.openStart &&
        this.openEnd == e.openEnd
      );
    }
    toString() {
      return this.content + "(" + this.openStart + "," + this.openEnd + ")";
    }
    toJSON() {
      if (!this.content.size) return null;
      let e = { content: this.content.toJSON() };
      return (
        this.openStart > 0 && (e.openStart = this.openStart),
        this.openEnd > 0 && (e.openEnd = this.openEnd),
        e
      );
    }
    static fromJSON(e, t) {
      if (!t) return v.empty;
      let r = t.openStart || 0,
        o = t.openEnd || 0;
      if (typeof r != "number" || typeof o != "number")
        throw new RangeError("Invalid input for Slice.fromJSON");
      return new v(y.fromJSON(e, t.content), r, o);
    }
    static maxOpen(e, t = !0) {
      let r = 0,
        o = 0;
      for (
        let s = e.firstChild;
        s && !s.isLeaf && (t || !s.type.spec.isolating);
        s = s.firstChild
      )
        r++;
      for (
        let s = e.lastChild;
        s && !s.isLeaf && (t || !s.type.spec.isolating);
        s = s.lastChild
      )
        o++;
      return new v(e, r, o);
    }
  }
  v.empty = new v(y.empty, 0, 0);
  function To(n, e, t) {
    let { index: r, offset: o } = n.findIndex(e),
      s = n.maybeChild(r),
      { index: i, offset: l } = n.findIndex(t);
    if (o == e || s.isText) {
      if (l != t && !n.child(i).isText)
        throw new RangeError("Removing non-flat range");
      return n.cut(0, e).append(n.cut(t));
    }
    if (r != i) throw new RangeError("Removing non-flat range");
    return n.replaceChild(r, s.copy(To(s.content, e - o - 1, t - o - 1)));
  }
  function qo(n, e, t, r) {
    let { index: o, offset: s } = n.findIndex(e),
      i = n.maybeChild(o);
    if (s == e || i.isText)
      return r && !r.canReplace(o, o, t)
        ? null
        : n.cut(0, e).append(t).append(n.cut(e));
    let l = qo(i.content, e - s - 1, t);
    return l && n.replaceChild(o, i.copy(l));
  }
  function mc(n, e, t) {
    if (t.openStart > n.depth)
      throw new rn("Inserted content deeper than insertion position");
    if (n.depth - t.openStart != e.depth - t.openEnd)
      throw new rn("Inconsistent open depths");
    return No(n, e, t, 0);
  }
  function No(n, e, t, r) {
    let o = n.index(r),
      s = n.node(r);
    if (o == e.index(r) && r < n.depth - t.openStart) {
      let i = No(n, e, t, r + 1);
      return s.copy(s.content.replaceChild(o, i));
    } else if (t.content.size)
      if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
        let i = n.parent,
          l = i.content;
        return je(
          i,
          l
            .cut(0, n.parentOffset)
            .append(t.content)
            .append(l.cut(e.parentOffset)),
        );
      } else {
        let { start: i, end: l } = gc(t, n);
        return je(s, Ro(n, i, l, e, r));
      }
    else return je(s, on(n, e, r));
  }
  function Oo(n, e) {
    if (!e.type.compatibleContent(n.type))
      throw new rn("Cannot join " + e.type.name + " onto " + n.type.name);
  }
  function Wn(n, e, t) {
    let r = n.node(t);
    return Oo(r, e.node(t)), r;
  }
  function Ge(n, e) {
    let t = e.length - 1;
    t >= 0 && n.isText && n.sameMarkup(e[t])
      ? (e[t] = n.withText(e[t].text + n.text))
      : e.push(n);
  }
  function Dt(n, e, t, r) {
    let o = (e || n).node(t),
      s = 0,
      i = e ? e.index(t) : o.childCount;
    n &&
      ((s = n.index(t)),
      n.depth > t ? s++ : n.textOffset && (Ge(n.nodeAfter, r), s++));
    for (let l = s; l < i; l++) Ge(o.child(l), r);
    e && e.depth == t && e.textOffset && Ge(e.nodeBefore, r);
  }
  function je(n, e) {
    return n.type.checkContent(e), n.copy(e);
  }
  function Ro(n, e, t, r, o) {
    let s = n.depth > o && Wn(n, e, o + 1),
      i = r.depth > o && Wn(t, r, o + 1),
      l = [];
    return (
      Dt(null, n, o, l),
      s && i && e.index(o) == t.index(o)
        ? (Oo(s, i), Ge(je(s, Ro(n, e, t, r, o + 1)), l))
        : (s && Ge(je(s, on(n, e, o + 1)), l),
          Dt(e, t, o, l),
          i && Ge(je(i, on(t, r, o + 1)), l)),
      Dt(r, null, o, l),
      new y(l)
    );
  }
  function on(n, e, t) {
    let r = [];
    if ((Dt(null, n, t, r), n.depth > t)) {
      let o = Wn(n, e, t + 1);
      Ge(je(o, on(n, e, t + 1)), r);
    }
    return Dt(e, null, t, r), new y(r);
  }
  function gc(n, e) {
    let t = e.depth - n.openStart,
      o = e.node(t).copy(n.content);
    for (let s = t - 1; s >= 0; s--) o = e.node(s).copy(y.from(o));
    return {
      start: o.resolveNoCache(n.openStart + t),
      end: o.resolveNoCache(o.content.size - n.openEnd - t),
    };
  }
  class Et {
    constructor(e, t, r) {
      (this.pos = e),
        (this.path = t),
        (this.parentOffset = r),
        (this.depth = t.length / 3 - 1);
    }
    resolveDepth(e) {
      return e == null ? this.depth : e < 0 ? this.depth + e : e;
    }
    get parent() {
      return this.node(this.depth);
    }
    get doc() {
      return this.node(0);
    }
    node(e) {
      return this.path[this.resolveDepth(e) * 3];
    }
    index(e) {
      return this.path[this.resolveDepth(e) * 3 + 1];
    }
    indexAfter(e) {
      return (
        (e = this.resolveDepth(e)),
        this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1)
      );
    }
    start(e) {
      return (e = this.resolveDepth(e)), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
    }
    end(e) {
      return (
        (e = this.resolveDepth(e)), this.start(e) + this.node(e).content.size
      );
    }
    before(e) {
      if (((e = this.resolveDepth(e)), !e))
        throw new RangeError("There is no position before the top-level node");
      return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
    }
    after(e) {
      if (((e = this.resolveDepth(e)), !e))
        throw new RangeError("There is no position after the top-level node");
      return e == this.depth + 1
        ? this.pos
        : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
    }
    get textOffset() {
      return this.pos - this.path[this.path.length - 1];
    }
    get nodeAfter() {
      let e = this.parent,
        t = this.index(this.depth);
      if (t == e.childCount) return null;
      let r = this.pos - this.path[this.path.length - 1],
        o = e.child(t);
      return r ? e.child(t).cut(r) : o;
    }
    get nodeBefore() {
      let e = this.index(this.depth),
        t = this.pos - this.path[this.path.length - 1];
      return t
        ? this.parent.child(e).cut(0, t)
        : e == 0
          ? null
          : this.parent.child(e - 1);
    }
    posAtIndex(e, t) {
      t = this.resolveDepth(t);
      let r = this.path[t * 3],
        o = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
      for (let s = 0; s < e; s++) o += r.child(s).nodeSize;
      return o;
    }
    marks() {
      let e = this.parent,
        t = this.index();
      if (e.content.size == 0) return q.none;
      if (this.textOffset) return e.child(t).marks;
      let r = e.maybeChild(t - 1),
        o = e.maybeChild(t);
      if (!r) {
        let l = r;
        (r = o), (o = l);
      }
      let s = r.marks;
      for (var i = 0; i < s.length; i++)
        s[i].type.spec.inclusive === !1 &&
          (!o || !s[i].isInSet(o.marks)) &&
          (s = s[i--].removeFromSet(s));
      return s;
    }
    marksAcross(e) {
      let t = this.parent.maybeChild(this.index());
      if (!t || !t.isInline) return null;
      let r = t.marks,
        o = e.parent.maybeChild(e.index());
      for (var s = 0; s < r.length; s++)
        r[s].type.spec.inclusive === !1 &&
          (!o || !r[s].isInSet(o.marks)) &&
          (r = r[s--].removeFromSet(r));
      return r;
    }
    sharedDepth(e) {
      for (let t = this.depth; t > 0; t--)
        if (this.start(t) <= e && this.end(t) >= e) return t;
      return 0;
    }
    blockRange(e = this, t) {
      if (e.pos < this.pos) return e.blockRange(this);
      for (
        let r =
          this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0);
        r >= 0;
        r--
      )
        if (e.pos <= this.end(r) && (!t || t(this.node(r))))
          return new sn(this, e, r);
      return null;
    }
    sameParent(e) {
      return this.pos - this.parentOffset == e.pos - e.parentOffset;
    }
    max(e) {
      return e.pos > this.pos ? e : this;
    }
    min(e) {
      return e.pos < this.pos ? e : this;
    }
    toString() {
      let e = "";
      for (let t = 1; t <= this.depth; t++)
        e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
      return e + ":" + this.parentOffset;
    }
    static resolve(e, t) {
      if (!(t >= 0 && t <= e.content.size))
        throw new RangeError("Position " + t + " out of range");
      let r = [],
        o = 0,
        s = t;
      for (let i = e; ; ) {
        let { index: l, offset: c } = i.content.findIndex(s),
          a = s - c;
        if ((r.push(i, l, o + c), !a || ((i = i.child(l)), i.isText))) break;
        (s = a - 1), (o += c + 1);
      }
      return new Et(t, r, s);
    }
    static resolveCached(e, t) {
      for (let o = 0; o < Kn.length; o++) {
        let s = Kn[o];
        if (s.pos == t && s.doc == e) return s;
      }
      let r = (Kn[Zn] = Et.resolve(e, t));
      return (Zn = (Zn + 1) % bc), r;
    }
  }
  let Kn = [],
    Zn = 0,
    bc = 12;
  class sn {
    constructor(e, t, r) {
      (this.$from = e), (this.$to = t), (this.depth = r);
    }
    get start() {
      return this.$from.before(this.depth + 1);
    }
    get end() {
      return this.$to.after(this.depth + 1);
    }
    get parent() {
      return this.$from.node(this.depth);
    }
    get startIndex() {
      return this.$from.index(this.depth);
    }
    get endIndex() {
      return this.$to.indexAfter(this.depth);
    }
  }
  const yc = Object.create(null);
  let Je = class Ao {
    constructor(e, t, r, o = q.none) {
      (this.type = e),
        (this.attrs = t),
        (this.marks = o),
        (this.content = r || y.empty);
    }
    get nodeSize() {
      return this.isLeaf ? 1 : 2 + this.content.size;
    }
    get childCount() {
      return this.content.childCount;
    }
    child(e) {
      return this.content.child(e);
    }
    maybeChild(e) {
      return this.content.maybeChild(e);
    }
    forEach(e) {
      this.content.forEach(e);
    }
    nodesBetween(e, t, r, o = 0) {
      this.content.nodesBetween(e, t, r, o, this);
    }
    descendants(e) {
      this.nodesBetween(0, this.content.size, e);
    }
    get textContent() {
      return this.isLeaf && this.type.spec.leafText
        ? this.type.spec.leafText(this)
        : this.textBetween(0, this.content.size, "");
    }
    textBetween(e, t, r, o) {
      return this.content.textBetween(e, t, r, o);
    }
    get firstChild() {
      return this.content.firstChild;
    }
    get lastChild() {
      return this.content.lastChild;
    }
    eq(e) {
      return this == e || (this.sameMarkup(e) && this.content.eq(e.content));
    }
    sameMarkup(e) {
      return this.hasMarkup(e.type, e.attrs, e.marks);
    }
    hasMarkup(e, t, r) {
      return (
        this.type == e &&
        nn(this.attrs, t || e.defaultAttrs || yc) &&
        q.sameSet(this.marks, r || q.none)
      );
    }
    copy(e = null) {
      return e == this.content
        ? this
        : new Ao(this.type, this.attrs, e, this.marks);
    }
    mark(e) {
      return e == this.marks
        ? this
        : new Ao(this.type, this.attrs, this.content, e);
    }
    cut(e, t = this.content.size) {
      return e == 0 && t == this.content.size
        ? this
        : this.copy(this.content.cut(e, t));
    }
    slice(e, t = this.content.size, r = !1) {
      if (e == t) return v.empty;
      let o = this.resolve(e),
        s = this.resolve(t),
        i = r ? 0 : o.sharedDepth(t),
        l = o.start(i),
        a = o.node(i).content.cut(o.pos - l, s.pos - l);
      return new v(a, o.depth - i, s.depth - i);
    }
    replace(e, t, r) {
      return mc(this.resolve(e), this.resolve(t), r);
    }
    nodeAt(e) {
      for (let t = this; ; ) {
        let { index: r, offset: o } = t.content.findIndex(e);
        if (((t = t.maybeChild(r)), !t)) return null;
        if (o == e || t.isText) return t;
        e -= o + 1;
      }
    }
    childAfter(e) {
      let { index: t, offset: r } = this.content.findIndex(e);
      return { node: this.content.maybeChild(t), index: t, offset: r };
    }
    childBefore(e) {
      if (e == 0) return { node: null, index: 0, offset: 0 };
      let { index: t, offset: r } = this.content.findIndex(e);
      if (r < e) return { node: this.content.child(t), index: t, offset: r };
      let o = this.content.child(t - 1);
      return { node: o, index: t - 1, offset: r - o.nodeSize };
    }
    resolve(e) {
      return Et.resolveCached(this, e);
    }
    resolveNoCache(e) {
      return Et.resolve(this, e);
    }
    rangeHasMark(e, t, r) {
      let o = !1;
      return (
        t > e &&
          this.nodesBetween(e, t, (s) => (r.isInSet(s.marks) && (o = !0), !o)),
        o
      );
    }
    get isBlock() {
      return this.type.isBlock;
    }
    get isTextblock() {
      return this.type.isTextblock;
    }
    get inlineContent() {
      return this.type.inlineContent;
    }
    get isInline() {
      return this.type.isInline;
    }
    get isText() {
      return this.type.isText;
    }
    get isLeaf() {
      return this.type.isLeaf;
    }
    get isAtom() {
      return this.type.isAtom;
    }
    toString() {
      if (this.type.spec.toDebugString)
        return this.type.spec.toDebugString(this);
      let e = this.type.name;
      return (
        this.content.size && (e += "(" + this.content.toStringInner() + ")"),
        Io(this.marks, e)
      );
    }
    contentMatchAt(e) {
      let t = this.type.contentMatch.matchFragment(this.content, 0, e);
      if (!t)
        throw new Error("Called contentMatchAt on a node with invalid content");
      return t;
    }
    canReplace(e, t, r = y.empty, o = 0, s = r.childCount) {
      let i = this.contentMatchAt(e).matchFragment(r, o, s),
        l = i && i.matchFragment(this.content, t);
      if (!l || !l.validEnd) return !1;
      for (let c = o; c < s; c++)
        if (!this.type.allowsMarks(r.child(c).marks)) return !1;
      return !0;
    }
    canReplaceWith(e, t, r, o) {
      if (o && !this.type.allowsMarks(o)) return !1;
      let s = this.contentMatchAt(e).matchType(r),
        i = s && s.matchFragment(this.content, t);
      return i ? i.validEnd : !1;
    }
    canAppend(e) {
      return e.content.size
        ? this.canReplace(this.childCount, this.childCount, e.content)
        : this.type.compatibleContent(e.type);
    }
    check() {
      this.type.checkContent(this.content);
      let e = q.none;
      for (let t = 0; t < this.marks.length; t++) e = this.marks[t].addToSet(e);
      if (!q.sameSet(e, this.marks))
        throw new RangeError(
          `Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`,
        );
      this.content.forEach((t) => t.check());
    }
    toJSON() {
      let e = { type: this.type.name };
      for (let t in this.attrs) {
        e.attrs = this.attrs;
        break;
      }
      return (
        this.content.size && (e.content = this.content.toJSON()),
        this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())),
        e
      );
    }
    static fromJSON(e, t) {
      if (!t) throw new RangeError("Invalid input for Node.fromJSON");
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
      let o = y.fromJSON(e, t.content);
      return e.nodeType(t.type).create(t.attrs, o, r);
    }
  };
  Je.prototype.text = void 0;
  class ln extends Je {
    constructor(e, t, r, o) {
      if ((super(e, t, null, o), !r))
        throw new RangeError("Empty text nodes are not allowed");
      this.text = r;
    }
    toString() {
      return this.type.spec.toDebugString
        ? this.type.spec.toDebugString(this)
        : Io(this.marks, JSON.stringify(this.text));
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
      return e == this.marks
        ? this
        : new ln(this.type, this.attrs, this.text, e);
    }
    withText(e) {
      return e == this.text
        ? this
        : new ln(this.type, this.attrs, e, this.marks);
    }
    cut(e = 0, t = this.text.length) {
      return e == 0 && t == this.text.length
        ? this
        : this.withText(this.text.slice(e, t));
    }
    eq(e) {
      return this.sameMarkup(e) && this.text == e.text;
    }
    toJSON() {
      let e = super.toJSON();
      return (e.text = this.text), e;
    }
  }
  function Io(n, e) {
    for (let t = n.length - 1; t >= 0; t--) e = n[t].type.name + "(" + e + ")";
    return e;
  }
  class We {
    constructor(e) {
      (this.validEnd = e), (this.next = []), (this.wrapCache = []);
    }
    static parse(e, t) {
      let r = new kc(e, t);
      if (r.next == null) return We.empty;
      let o = Lo(r);
      r.next && r.err("Unexpected trailing text");
      let s = Ec(Dc(o));
      return Ac(s, r), s;
    }
    matchType(e) {
      for (let t = 0; t < this.next.length; t++)
        if (this.next[t].type == e) return this.next[t].next;
      return null;
    }
    matchFragment(e, t = 0, r = e.childCount) {
      let o = this;
      for (let s = t; o && s < r; s++) o = o.matchType(e.child(s).type);
      return o;
    }
    get inlineContent() {
      return this.next.length != 0 && this.next[0].type.isInline;
    }
    get defaultType() {
      for (let e = 0; e < this.next.length; e++) {
        let { type: t } = this.next[e];
        if (!(t.isText || t.hasRequiredAttrs())) return t;
      }
      return null;
    }
    compatible(e) {
      for (let t = 0; t < this.next.length; t++)
        for (let r = 0; r < e.next.length; r++)
          if (this.next[t].type == e.next[r].type) return !0;
      return !1;
    }
    fillBefore(e, t = !1, r = 0) {
      let o = [this];
      function s(i, l) {
        let c = i.matchFragment(e, r);
        if (c && (!t || c.validEnd))
          return y.from(l.map((a) => a.createAndFill()));
        for (let a = 0; a < i.next.length; a++) {
          let { type: u, next: f } = i.next[a];
          if (!(u.isText || u.hasRequiredAttrs()) && o.indexOf(f) == -1) {
            o.push(f);
            let h = s(f, l.concat(u));
            if (h) return h;
          }
        }
        return null;
      }
      return s(this, []);
    }
    findWrapping(e) {
      for (let r = 0; r < this.wrapCache.length; r += 2)
        if (this.wrapCache[r] == e) return this.wrapCache[r + 1];
      let t = this.computeWrapping(e);
      return this.wrapCache.push(e, t), t;
    }
    computeWrapping(e) {
      let t = Object.create(null),
        r = [{ match: this, type: null, via: null }];
      for (; r.length; ) {
        let o = r.shift(),
          s = o.match;
        if (s.matchType(e)) {
          let i = [];
          for (let l = o; l.type; l = l.via) i.push(l.type);
          return i.reverse();
        }
        for (let i = 0; i < s.next.length; i++) {
          let { type: l, next: c } = s.next[i];
          !l.isLeaf &&
            !l.hasRequiredAttrs() &&
            !(l.name in t) &&
            (!o.type || c.validEnd) &&
            (r.push({ match: l.contentMatch, type: l, via: o }),
            (t[l.name] = !0));
        }
      }
      return null;
    }
    get edgeCount() {
      return this.next.length;
    }
    edge(e) {
      if (e >= this.next.length)
        throw new RangeError(`There's no ${e}th edge in this content match`);
      return this.next[e];
    }
    toString() {
      let e = [];
      function t(r) {
        e.push(r);
        for (let o = 0; o < r.next.length; o++)
          e.indexOf(r.next[o].next) == -1 && t(r.next[o].next);
      }
      return (
        t(this),
        e.map((r, o) => {
          let s = o + (r.validEnd ? "*" : " ") + " ";
          for (let i = 0; i < r.next.length; i++)
            s +=
              (i ? ", " : "") +
              r.next[i].type.name +
              "->" +
              e.indexOf(r.next[i].next);
          return s;
        }).join(`
`)
      );
    }
  }
  We.empty = new We(!0);
  class kc {
    constructor(e, t) {
      (this.string = e),
        (this.nodeTypes = t),
        (this.inline = null),
        (this.pos = 0),
        (this.tokens = e.split(/\s*(?=\b|\W|$)/)),
        this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(),
        this.tokens[0] == "" && this.tokens.shift();
    }
    get next() {
      return this.tokens[this.pos];
    }
    eat(e) {
      return this.next == e && (this.pos++ || !0);
    }
    err(e) {
      throw new SyntaxError(
        e + " (in content expression '" + this.string + "')",
      );
    }
  }
  function Lo(n) {
    let e = [];
    do e.push(xc(n));
    while (n.eat("|"));
    return e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
  function xc(n) {
    let e = [];
    do e.push(wc(n));
    while (n.next && n.next != ")" && n.next != "|");
    return e.length == 1 ? e[0] : { type: "seq", exprs: e };
  }
  function wc(n) {
    let e = Sc(n);
    for (;;)
      if (n.eat("+")) e = { type: "plus", expr: e };
      else if (n.eat("*")) e = { type: "star", expr: e };
      else if (n.eat("?")) e = { type: "opt", expr: e };
      else if (n.eat("{")) e = vc(n, e);
      else break;
    return e;
  }
  function zo(n) {
    /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
    let e = Number(n.next);
    return n.pos++, e;
  }
  function vc(n, e) {
    let t = zo(n),
      r = t;
    return (
      n.eat(",") && (n.next != "}" ? (r = zo(n)) : (r = -1)),
      n.eat("}") || n.err("Unclosed braced range"),
      { type: "range", min: t, max: r, expr: e }
    );
  }
  function Cc(n, e) {
    let t = n.nodeTypes,
      r = t[e];
    if (r) return [r];
    let o = [];
    for (let s in t) {
      let i = t[s];
      i.groups.indexOf(e) > -1 && o.push(i);
    }
    return o.length == 0 && n.err("No node type or group '" + e + "' found"), o;
  }
  function Sc(n) {
    if (n.eat("(")) {
      let e = Lo(n);
      return n.eat(")") || n.err("Missing closing paren"), e;
    } else if (/\W/.test(n.next)) n.err("Unexpected token '" + n.next + "'");
    else {
      let e = Cc(n, n.next).map(
        (t) => (
          n.inline == null
            ? (n.inline = t.isInline)
            : n.inline != t.isInline &&
              n.err("Mixing inline and block content"),
          { type: "name", value: t }
        ),
      );
      return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
    }
  }
  function Dc(n) {
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
      i.forEach((c) => (c.to = l));
    }
    function s(i, l) {
      if (i.type == "choice")
        return i.exprs.reduce((c, a) => c.concat(s(a, l)), []);
      if (i.type == "seq")
        for (let c = 0; ; c++) {
          let a = s(i.exprs[c], l);
          if (c == i.exprs.length - 1) return a;
          o(a, (l = t()));
        }
      else if (i.type == "star") {
        let c = t();
        return r(l, c), o(s(i.expr, c), c), [r(c)];
      } else if (i.type == "plus") {
        let c = t();
        return o(s(i.expr, l), c), o(s(i.expr, c), c), [r(c)];
      } else {
        if (i.type == "opt") return [r(l)].concat(s(i.expr, l));
        if (i.type == "range") {
          let c = l;
          for (let a = 0; a < i.min; a++) {
            let u = t();
            o(s(i.expr, c), u), (c = u);
          }
          if (i.max == -1) o(s(i.expr, c), c);
          else
            for (let a = i.min; a < i.max; a++) {
              let u = t();
              r(c, u), o(s(i.expr, c), u), (c = u);
            }
          return [r(c)];
        } else {
          if (i.type == "name") return [r(l, void 0, i.value)];
          throw new Error("Unknown expr type");
        }
      }
    }
  }
  function Fo(n, e) {
    return e - n;
  }
  function Bo(n, e) {
    let t = [];
    return r(e), t.sort(Fo);
    function r(o) {
      let s = n[o];
      if (s.length == 1 && !s[0].term) return r(s[0].to);
      t.push(o);
      for (let i = 0; i < s.length; i++) {
        let { term: l, to: c } = s[i];
        !l && t.indexOf(c) == -1 && r(c);
      }
    }
  }
  function Ec(n) {
    let e = Object.create(null);
    return t(Bo(n, 0));
    function t(r) {
      let o = [];
      r.forEach((i) => {
        n[i].forEach(({ term: l, to: c }) => {
          if (!l) return;
          let a;
          for (let u = 0; u < o.length; u++) o[u][0] == l && (a = o[u][1]);
          Bo(n, c).forEach((u) => {
            a || o.push([l, (a = [])]), a.indexOf(u) == -1 && a.push(u);
          });
        });
      });
      let s = (e[r.join(",")] = new We(r.indexOf(n.length - 1) > -1));
      for (let i = 0; i < o.length; i++) {
        let l = o[i][1].sort(Fo);
        s.next.push({ type: o[i][0], next: e[l.join(",")] || t(l) });
      }
      return s;
    }
  }
  function Ac(n, e) {
    for (let t = 0, r = [n]; t < r.length; t++) {
      let o = r[t],
        s = !o.validEnd,
        i = [];
      for (let l = 0; l < o.next.length; l++) {
        let { type: c, next: a } = o.next[l];
        i.push(c.name),
          s && !(c.isText || c.hasRequiredAttrs()) && (s = !1),
          r.indexOf(a) == -1 && r.push(a);
      }
      s &&
        e.err(
          "Only non-generatable nodes (" +
            i.join(", ") +
            ") in a required position (see https://prosemirror.net/docs/guide/#generatable)",
        );
    }
  }
  function Po(n) {
    let e = Object.create(null);
    for (let t in n) {
      let r = n[t];
      if (!r.hasDefault) return null;
      e[t] = r.default;
    }
    return e;
  }
  function Vo(n, e) {
    let t = Object.create(null);
    for (let r in n) {
      let o = e && e[r];
      if (o === void 0) {
        let s = n[r];
        if (s.hasDefault) o = s.default;
        else throw new RangeError("No value supplied for attribute " + r);
      }
      t[r] = o;
    }
    return t;
  }
  function $o(n) {
    let e = Object.create(null);
    if (n) for (let t in n) e[t] = new _c(n[t]);
    return e;
  }
  let Uo = class dc {
    constructor(e, t, r) {
      (this.name = e),
        (this.schema = t),
        (this.spec = r),
        (this.markSet = null),
        (this.groups = r.group ? r.group.split(" ") : []),
        (this.attrs = $o(r.attrs)),
        (this.defaultAttrs = Po(this.attrs)),
        (this.contentMatch = null),
        (this.inlineContent = null),
        (this.isBlock = !(r.inline || e == "text")),
        (this.isText = e == "text");
    }
    get isInline() {
      return !this.isBlock;
    }
    get isTextblock() {
      return this.isBlock && this.inlineContent;
    }
    get isLeaf() {
      return this.contentMatch == We.empty;
    }
    get isAtom() {
      return this.isLeaf || !!this.spec.atom;
    }
    get whitespace() {
      return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
    }
    hasRequiredAttrs() {
      for (let e in this.attrs) if (this.attrs[e].isRequired) return !0;
      return !1;
    }
    compatibleContent(e) {
      return this == e || this.contentMatch.compatible(e.contentMatch);
    }
    computeAttrs(e) {
      return !e && this.defaultAttrs ? this.defaultAttrs : Vo(this.attrs, e);
    }
    create(e = null, t, r) {
      if (this.isText)
        throw new Error("NodeType.create can't construct text nodes");
      return new Je(this, this.computeAttrs(e), y.from(t), q.setFrom(r));
    }
    createChecked(e = null, t, r) {
      return (
        (t = y.from(t)),
        this.checkContent(t),
        new Je(this, this.computeAttrs(e), t, q.setFrom(r))
      );
    }
    createAndFill(e = null, t, r) {
      if (((e = this.computeAttrs(e)), (t = y.from(t)), t.size)) {
        let i = this.contentMatch.fillBefore(t);
        if (!i) return null;
        t = i.append(t);
      }
      let o = this.contentMatch.matchFragment(t),
        s = o && o.fillBefore(y.empty, !0);
      return s ? new Je(this, e, t.append(s), q.setFrom(r)) : null;
    }
    validContent(e) {
      let t = this.contentMatch.matchFragment(e);
      if (!t || !t.validEnd) return !1;
      for (let r = 0; r < e.childCount; r++)
        if (!this.allowsMarks(e.child(r).marks)) return !1;
      return !0;
    }
    checkContent(e) {
      if (!this.validContent(e))
        throw new RangeError(
          `Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`,
        );
    }
    allowsMarkType(e) {
      return this.markSet == null || this.markSet.indexOf(e) > -1;
    }
    allowsMarks(e) {
      if (this.markSet == null) return !0;
      for (let t = 0; t < e.length; t++)
        if (!this.allowsMarkType(e[t].type)) return !1;
      return !0;
    }
    allowedMarks(e) {
      if (this.markSet == null) return e;
      let t;
      for (let r = 0; r < e.length; r++)
        this.allowsMarkType(e[r].type)
          ? t && t.push(e[r])
          : t || (t = e.slice(0, r));
      return t ? (t.length ? t : q.none) : e;
    }
    static compile(e, t) {
      let r = Object.create(null);
      e.forEach((s, i) => (r[s] = new dc(s, t, i)));
      let o = t.spec.topNode || "doc";
      if (!r[o])
        throw new RangeError(
          "Schema is missing its top node type ('" + o + "')",
        );
      if (!r.text) throw new RangeError("Every schema needs a 'text' type");
      for (let s in r.text.attrs)
        throw new RangeError("The text node type should not have attributes");
      return r;
    }
  };
  class _c {
    constructor(e) {
      (this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default")),
        (this.default = e.default);
    }
    get isRequired() {
      return !this.hasDefault;
    }
  }
  class cn {
    constructor(e, t, r, o) {
      (this.name = e),
        (this.rank = t),
        (this.schema = r),
        (this.spec = o),
        (this.attrs = $o(o.attrs)),
        (this.excluded = null);
      let s = Po(this.attrs);
      this.instance = s ? new q(this, s) : null;
    }
    create(e = null) {
      return !e && this.instance
        ? this.instance
        : new q(this, Vo(this.attrs, e));
    }
    static compile(e, t) {
      let r = Object.create(null),
        o = 0;
      return e.forEach((s, i) => (r[s] = new cn(s, o++, t, i))), r;
    }
    removeFromSet(e) {
      for (var t = 0; t < e.length; t++)
        e[t].type == this && ((e = e.slice(0, t).concat(e.slice(t + 1))), t--);
      return e;
    }
    isInSet(e) {
      for (let t = 0; t < e.length; t++) if (e[t].type == this) return e[t];
    }
    excludes(e) {
      return this.excluded.indexOf(e) > -1;
    }
  }
  class Ho {
    constructor(e) {
      this.cached = Object.create(null);
      let t = (this.spec = {});
      for (let o in e) t[o] = e[o];
      (t.nodes = V.from(e.nodes)),
        (t.marks = V.from(e.marks || {})),
        (this.nodes = Uo.compile(this.spec.nodes, this)),
        (this.marks = cn.compile(this.spec.marks, this));
      let r = Object.create(null);
      for (let o in this.nodes) {
        if (o in this.marks)
          throw new RangeError(o + " can not be both a node and a mark");
        let s = this.nodes[o],
          i = s.spec.content || "",
          l = s.spec.marks;
        (s.contentMatch = r[i] || (r[i] = We.parse(i, this.nodes))),
          (s.inlineContent = s.contentMatch.inlineContent),
          (s.markSet =
            l == "_"
              ? null
              : l
                ? Go(this, l.split(" "))
                : l == "" || !s.inlineContent
                  ? []
                  : null);
      }
      for (let o in this.marks) {
        let s = this.marks[o],
          i = s.spec.excludes;
        s.excluded = i == null ? [s] : i == "" ? [] : Go(this, i.split(" "));
      }
      (this.nodeFromJSON = this.nodeFromJSON.bind(this)),
        (this.markFromJSON = this.markFromJSON.bind(this)),
        (this.topNodeType = this.nodes[this.spec.topNode || "doc"]),
        (this.cached.wrappings = Object.create(null));
    }
    node(e, t = null, r, o) {
      if (typeof e == "string") e = this.nodeType(e);
      else if (e instanceof Uo) {
        if (e.schema != this)
          throw new RangeError(
            "Node type from different schema used (" + e.name + ")",
          );
      } else throw new RangeError("Invalid node type: " + e);
      return e.createChecked(t, r, o);
    }
    text(e, t) {
      let r = this.nodes.text;
      return new ln(r, r.defaultAttrs, e, q.setFrom(t));
    }
    mark(e, t) {
      return typeof e == "string" && (e = this.marks[e]), e.create(t);
    }
    nodeFromJSON(e) {
      return Je.fromJSON(this, e);
    }
    markFromJSON(e) {
      return q.fromJSON(this, e);
    }
    nodeType(e) {
      let t = this.nodes[e];
      if (!t) throw new RangeError("Unknown node type: " + e);
      return t;
    }
  }
  function Go(n, e) {
    let t = [];
    for (let r = 0; r < e.length; r++) {
      let o = e[r],
        s = n.marks[o],
        i = s;
      if (s) t.push(s);
      else
        for (let l in n.marks) {
          let c = n.marks[l];
          (o == "_" ||
            (c.spec.group && c.spec.group.split(" ").indexOf(o) > -1)) &&
            t.push((i = c));
        }
      if (!i) throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
    }
    return t;
  }
  class it {
    constructor(e, t) {
      (this.schema = e),
        (this.rules = t),
        (this.tags = []),
        (this.styles = []),
        t.forEach((r) => {
          r.tag ? this.tags.push(r) : r.style && this.styles.push(r);
        }),
        (this.normalizeLists = !this.tags.some((r) => {
          if (!/^(ul|ol)\b/.test(r.tag) || !r.node) return !1;
          let o = e.nodes[r.node];
          return o.contentMatch.matchType(o);
        }));
    }
    parse(e, t = {}) {
      let r = new Ko(this, t, !1);
      return r.addAll(e, t.from, t.to), r.finish();
    }
    parseSlice(e, t = {}) {
      let r = new Ko(this, t, !0);
      return r.addAll(e, t.from, t.to), v.maxOpen(r.finish());
    }
    matchTag(e, t, r) {
      for (
        let o = r ? this.tags.indexOf(r) + 1 : 0;
        o < this.tags.length;
        o++
      ) {
        let s = this.tags[o];
        if (
          qc(e, s.tag) &&
          (s.namespace === void 0 || e.namespaceURI == s.namespace) &&
          (!s.context || t.matchesContext(s.context))
        ) {
          if (s.getAttrs) {
            let i = s.getAttrs(e);
            if (i === !1) continue;
            s.attrs = i || void 0;
          }
          return s;
        }
      }
    }
    matchStyle(e, t, r, o) {
      for (
        let s = o ? this.styles.indexOf(o) + 1 : 0;
        s < this.styles.length;
        s++
      ) {
        let i = this.styles[s],
          l = i.style;
        if (
          !(
            l.indexOf(e) != 0 ||
            (i.context && !r.matchesContext(i.context)) ||
            (l.length > e.length &&
              (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))
          )
        ) {
          if (i.getAttrs) {
            let c = i.getAttrs(t);
            if (c === !1) continue;
            i.attrs = c || void 0;
          }
          return i;
        }
      }
    }
    static schemaRules(e) {
      let t = [];
      function r(o) {
        let s = o.priority == null ? 50 : o.priority,
          i = 0;
        for (; i < t.length; i++) {
          let l = t[i];
          if ((l.priority == null ? 50 : l.priority) < s) break;
        }
        t.splice(i, 0, o);
      }
      for (let o in e.marks) {
        let s = e.marks[o].spec.parseDOM;
        s &&
          s.forEach((i) => {
            r((i = Zo(i))), i.mark || i.ignore || i.clearMark || (i.mark = o);
          });
      }
      for (let o in e.nodes) {
        let s = e.nodes[o].spec.parseDOM;
        s &&
          s.forEach((i) => {
            r((i = Zo(i))), i.node || i.ignore || i.mark || (i.node = o);
          });
      }
      return t;
    }
    static fromSchema(e) {
      return (
        e.cached.domParser ||
        (e.cached.domParser = new it(e, it.schemaRules(e)))
      );
    }
  }
  const jo = {
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
      ul: !0,
    },
    Mc = {
      head: !0,
      noscript: !0,
      object: !0,
      script: !0,
      style: !0,
      title: !0,
    },
    Jo = { ol: !0, ul: !0 },
    an = 1,
    un = 2,
    At = 4;
  function Wo(n, e, t) {
    return e != null
      ? (e ? an : 0) | (e === "full" ? un : 0)
      : n && n.whitespace == "pre"
        ? an | un
        : t & ~At;
  }
  class fn {
    constructor(e, t, r, o, s, i, l) {
      (this.type = e),
        (this.attrs = t),
        (this.marks = r),
        (this.pendingMarks = o),
        (this.solid = s),
        (this.options = l),
        (this.content = []),
        (this.activeMarks = q.none),
        (this.stashMarks = []),
        (this.match = i || (l & At ? null : e.contentMatch));
    }
    findWrapping(e) {
      if (!this.match) {
        if (!this.type) return [];
        let t = this.type.contentMatch.fillBefore(y.from(e));
        if (t) this.match = this.type.contentMatch.matchFragment(t);
        else {
          let r = this.type.contentMatch,
            o;
          return (o = r.findWrapping(e.type)) ? ((this.match = r), o) : null;
        }
      }
      return this.match.findWrapping(e.type);
    }
    finish(e) {
      if (!(this.options & an)) {
        let r = this.content[this.content.length - 1],
          o;
        if (r && r.isText && (o = /[ \t\r\n\u000c]+$/.exec(r.text))) {
          let s = r;
          r.text.length == o[0].length
            ? this.content.pop()
            : (this.content[this.content.length - 1] = s.withText(
                s.text.slice(0, s.text.length - o[0].length),
              ));
        }
      }
      let t = y.from(this.content);
      return (
        !e && this.match && (t = t.append(this.match.fillBefore(y.empty, !0))),
        this.type ? this.type.create(this.attrs, t, this.marks) : t
      );
    }
    popFromStashMark(e) {
      for (let t = this.stashMarks.length - 1; t >= 0; t--)
        if (e.eq(this.stashMarks[t])) return this.stashMarks.splice(t, 1)[0];
    }
    applyPending(e) {
      for (let t = 0, r = this.pendingMarks; t < r.length; t++) {
        let o = r[t];
        (this.type ? this.type.allowsMarkType(o.type) : Oc(o.type, e)) &&
          !o.isInSet(this.activeMarks) &&
          ((this.activeMarks = o.addToSet(this.activeMarks)),
          (this.pendingMarks = o.removeFromSet(this.pendingMarks)));
      }
    }
    inlineContext(e) {
      return this.type
        ? this.type.inlineContent
        : this.content.length
          ? this.content[0].isInline
          : e.parentNode &&
            !jo.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
    }
  }
  class Ko {
    constructor(e, t, r) {
      (this.parser = e), (this.options = t), (this.isOpen = r), (this.open = 0);
      let o = t.topNode,
        s,
        i = Wo(null, t.preserveWhitespace, 0) | (r ? At : 0);
      o
        ? (s = new fn(
            o.type,
            o.attrs,
            q.none,
            q.none,
            !0,
            t.topMatch || o.type.contentMatch,
            i,
          ))
        : r
          ? (s = new fn(null, null, q.none, q.none, !0, null, i))
          : (s = new fn(
              e.schema.topNodeType,
              null,
              q.none,
              q.none,
              !0,
              null,
              i,
            )),
        (this.nodes = [s]),
        (this.find = t.findPositions),
        (this.needsBlock = !1);
    }
    get top() {
      return this.nodes[this.open];
    }
    addDOM(e) {
      e.nodeType == 3
        ? this.addTextNode(e)
        : e.nodeType == 1 && this.addElement(e);
    }
    withStyleRules(e, t) {
      let r = e.getAttribute("style");
      if (!r) return t();
      let o = this.readStyles(Nc(r));
      if (!o) return;
      let [s, i] = o,
        l = this.top;
      for (let c = 0; c < i.length; c++) this.removePendingMark(i[c], l);
      for (let c = 0; c < s.length; c++) this.addPendingMark(s[c]);
      t();
      for (let c = 0; c < s.length; c++) this.removePendingMark(s[c], l);
      for (let c = 0; c < i.length; c++) this.addPendingMark(i[c]);
    }
    addTextNode(e) {
      let t = e.nodeValue,
        r = this.top;
      if (r.options & un || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
        if (r.options & an)
          r.options & un
            ? (t = t.replace(
                /\r\n?/g,
                `
`,
              ))
            : (t = t.replace(/\r?\n|\r/g, " "));
        else if (
          ((t = t.replace(/[ \t\r\n\u000c]+/g, " ")),
          /^[ \t\r\n\u000c]/.test(t) && this.open == this.nodes.length - 1)
        ) {
          let o = r.content[r.content.length - 1],
            s = e.previousSibling;
          (!o ||
            (s && s.nodeName == "BR") ||
            (o.isText && /[ \t\r\n\u000c]$/.test(o.text))) &&
            (t = t.slice(1));
        }
        t && this.insertNode(this.parser.schema.text(t)), this.findInText(e);
      } else this.findInside(e);
    }
    addElement(e, t) {
      let r = e.nodeName.toLowerCase(),
        o;
      Jo.hasOwnProperty(r) && this.parser.normalizeLists && Tc(e);
      let s =
        (this.options.ruleFromNode && this.options.ruleFromNode(e)) ||
        (o = this.parser.matchTag(e, this, t));
      if (s ? s.ignore : Mc.hasOwnProperty(r))
        this.findInside(e), this.ignoreFallback(e);
      else if (!s || s.skip || s.closeParent) {
        s && s.closeParent
          ? (this.open = Math.max(0, this.open - 1))
          : s && s.skip.nodeType && (e = s.skip);
        let i,
          l = this.top,
          c = this.needsBlock;
        if (jo.hasOwnProperty(r))
          l.content.length &&
            l.content[0].isInline &&
            this.open &&
            (this.open--, (l = this.top)),
            (i = !0),
            l.type || (this.needsBlock = !0);
        else if (!e.firstChild) {
          this.leafFallback(e);
          return;
        }
        s && s.skip
          ? this.addAll(e)
          : this.withStyleRules(e, () => this.addAll(e)),
          i && this.sync(l),
          (this.needsBlock = c);
      } else
        this.withStyleRules(e, () => {
          this.addElementByRule(e, s, s.consuming === !1 ? o : void 0);
        });
    }
    leafFallback(e) {
      e.nodeName == "BR" &&
        this.top.type &&
        this.top.type.inlineContent &&
        this.addTextNode(
          e.ownerDocument.createTextNode(`
`),
        );
    }
    ignoreFallback(e) {
      e.nodeName == "BR" &&
        (!this.top.type || !this.top.type.inlineContent) &&
        this.findPlace(this.parser.schema.text("-"));
    }
    readStyles(e) {
      let t = q.none,
        r = q.none;
      for (let o = 0; o < e.length; o += 2)
        for (let s = void 0; ; ) {
          let i = this.parser.matchStyle(e[o], e[o + 1], this, s);
          if (!i) break;
          if (i.ignore) return null;
          if (
            (i.clearMark
              ? this.top.pendingMarks
                  .concat(this.top.activeMarks)
                  .forEach((l) => {
                    i.clearMark(l) && (r = l.addToSet(r));
                  })
              : (t = this.parser.schema.marks[i.mark]
                  .create(i.attrs)
                  .addToSet(t)),
            i.consuming === !1)
          )
            s = i;
          else break;
        }
      return [t, r];
    }
    addElementByRule(e, t, r) {
      let o, s, i;
      t.node
        ? ((s = this.parser.schema.nodes[t.node]),
          s.isLeaf
            ? this.insertNode(s.create(t.attrs)) || this.leafFallback(e)
            : (o = this.enter(s, t.attrs || null, t.preserveWhitespace)))
        : ((i = this.parser.schema.marks[t.mark].create(t.attrs)),
          this.addPendingMark(i));
      let l = this.top;
      if (s && s.isLeaf) this.findInside(e);
      else if (r) this.addElement(e, r);
      else if (t.getContent)
        this.findInside(e),
          t
            .getContent(e, this.parser.schema)
            .forEach((c) => this.insertNode(c));
      else {
        let c = e;
        typeof t.contentElement == "string"
          ? (c = e.querySelector(t.contentElement))
          : typeof t.contentElement == "function"
            ? (c = t.contentElement(e))
            : t.contentElement && (c = t.contentElement),
          this.findAround(e, c, !0),
          this.addAll(c);
      }
      o && this.sync(l) && this.open--, i && this.removePendingMark(i, l);
    }
    addAll(e, t, r) {
      let o = t || 0;
      for (
        let s = t ? e.childNodes[t] : e.firstChild,
          i = r == null ? null : e.childNodes[r];
        s != i;
        s = s.nextSibling, ++o
      )
        this.findAtPoint(e, o), this.addDOM(s);
      this.findAtPoint(e, o);
    }
    findPlace(e) {
      let t, r;
      for (let o = this.open; o >= 0; o--) {
        let s = this.nodes[o],
          i = s.findWrapping(e);
        if (
          (i && (!t || t.length > i.length) && ((t = i), (r = s), !i.length)) ||
          s.solid
        )
          break;
      }
      if (!t) return !1;
      this.sync(r);
      for (let o = 0; o < t.length; o++) this.enterInner(t[o], null, !1);
      return !0;
    }
    insertNode(e) {
      if (e.isInline && this.needsBlock && !this.top.type) {
        let t = this.textblockFromContext();
        t && this.enterInner(t);
      }
      if (this.findPlace(e)) {
        this.closeExtra();
        let t = this.top;
        t.applyPending(e.type),
          t.match && (t.match = t.match.matchType(e.type));
        let r = t.activeMarks;
        for (let o = 0; o < e.marks.length; o++)
          (!t.type || t.type.allowsMarkType(e.marks[o].type)) &&
            (r = e.marks[o].addToSet(r));
        return t.content.push(e.mark(r)), !0;
      }
      return !1;
    }
    enter(e, t, r) {
      let o = this.findPlace(e.create(t));
      return o && this.enterInner(e, t, !0, r), o;
    }
    enterInner(e, t = null, r = !1, o) {
      this.closeExtra();
      let s = this.top;
      s.applyPending(e), (s.match = s.match && s.match.matchType(e));
      let i = Wo(e, o, s.options);
      s.options & At && s.content.length == 0 && (i |= At),
        this.nodes.push(
          new fn(e, t, s.activeMarks, s.pendingMarks, r, null, i),
        ),
        this.open++;
    }
    closeExtra(e = !1) {
      let t = this.nodes.length - 1;
      if (t > this.open) {
        for (; t > this.open; t--)
          this.nodes[t - 1].content.push(this.nodes[t].finish(e));
        this.nodes.length = this.open + 1;
      }
    }
    finish() {
      return (
        (this.open = 0),
        this.closeExtra(this.isOpen),
        this.nodes[0].finish(this.isOpen || this.options.topOpen)
      );
    }
    sync(e) {
      for (let t = this.open; t >= 0; t--)
        if (this.nodes[t] == e) return (this.open = t), !0;
      return !1;
    }
    get currentPos() {
      this.closeExtra();
      let e = 0;
      for (let t = this.open; t >= 0; t--) {
        let r = this.nodes[t].content;
        for (let o = r.length - 1; o >= 0; o--) e += r[o].nodeSize;
        t && e++;
      }
      return e;
    }
    findAtPoint(e, t) {
      if (this.find)
        for (let r = 0; r < this.find.length; r++)
          this.find[r].node == e &&
            this.find[r].offset == t &&
            (this.find[r].pos = this.currentPos);
    }
    findInside(e) {
      if (this.find)
        for (let t = 0; t < this.find.length; t++)
          this.find[t].pos == null &&
            e.nodeType == 1 &&
            e.contains(this.find[t].node) &&
            (this.find[t].pos = this.currentPos);
    }
    findAround(e, t, r) {
      if (e != t && this.find)
        for (let o = 0; o < this.find.length; o++)
          this.find[o].pos == null &&
            e.nodeType == 1 &&
            e.contains(this.find[o].node) &&
            t.compareDocumentPosition(this.find[o].node) & (r ? 2 : 4) &&
            (this.find[o].pos = this.currentPos);
    }
    findInText(e) {
      if (this.find)
        for (let t = 0; t < this.find.length; t++)
          this.find[t].node == e &&
            (this.find[t].pos =
              this.currentPos - (e.nodeValue.length - this.find[t].offset));
    }
    matchesContext(e) {
      if (e.indexOf("|") > -1)
        return e.split(/\s*\|\s*/).some(this.matchesContext, this);
      let t = e.split("/"),
        r = this.options.context,
        o = !this.isOpen && (!r || r.parent.type == this.nodes[0].type),
        s = -(r ? r.depth + 1 : 0) + (o ? 0 : 1),
        i = (l, c) => {
          for (; l >= 0; l--) {
            let a = t[l];
            if (a == "") {
              if (l == t.length - 1 || l == 0) continue;
              for (; c >= s; c--) if (i(l - 1, c)) return !0;
              return !1;
            } else {
              let u =
                c > 0 || (c == 0 && o)
                  ? this.nodes[c].type
                  : r && c >= s
                    ? r.node(c - s).type
                    : null;
              if (!u || (u.name != a && u.groups.indexOf(a) == -1)) return !1;
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
          if (r && r.isTextblock && r.defaultAttrs) return r;
        }
      for (let t in this.parser.schema.nodes) {
        let r = this.parser.schema.nodes[t];
        if (r.isTextblock && r.defaultAttrs) return r;
      }
    }
    addPendingMark(e) {
      let t = Rc(e, this.top.pendingMarks);
      t && this.top.stashMarks.push(t),
        (this.top.pendingMarks = e.addToSet(this.top.pendingMarks));
    }
    removePendingMark(e, t) {
      for (let r = this.open; r >= 0; r--) {
        let o = this.nodes[r];
        if (o.pendingMarks.lastIndexOf(e) > -1)
          o.pendingMarks = e.removeFromSet(o.pendingMarks);
        else {
          o.activeMarks = e.removeFromSet(o.activeMarks);
          let i = o.popFromStashMark(e);
          i &&
            o.type &&
            o.type.allowsMarkType(i.type) &&
            (o.activeMarks = i.addToSet(o.activeMarks));
        }
        if (o == t) break;
      }
    }
  }
  function Tc(n) {
    for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
      let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
      r && Jo.hasOwnProperty(r) && t
        ? (t.appendChild(e), (e = t))
        : r == "li"
          ? (t = e)
          : r && (t = null);
    }
  }
  function qc(n, e) {
    return (
      n.matches ||
      n.msMatchesSelector ||
      n.webkitMatchesSelector ||
      n.mozMatchesSelector
    ).call(n, e);
  }
  function Nc(n) {
    let e = /\s*([\w-]+)\s*:\s*([^;]+)/g,
      t,
      r = [];
    for (; (t = e.exec(n)); ) r.push(t[1], t[2].trim());
    return r;
  }
  function Zo(n) {
    let e = {};
    for (let t in n) e[t] = n[t];
    return e;
  }
  function Oc(n, e) {
    let t = e.schema.nodes;
    for (let r in t) {
      let o = t[r];
      if (!o.allowsMarkType(n)) continue;
      let s = [],
        i = (l) => {
          s.push(l);
          for (let c = 0; c < l.edgeCount; c++) {
            let { type: a, next: u } = l.edge(c);
            if (a == e || (s.indexOf(u) < 0 && i(u))) return !0;
          }
        };
      if (i(o.contentMatch)) return !0;
    }
  }
  function Rc(n, e) {
    for (let t = 0; t < e.length; t++) if (n.eq(e[t])) return e[t];
  }
  class ve {
    constructor(e, t) {
      (this.nodes = e), (this.marks = t);
    }
    serializeFragment(e, t = {}, r) {
      r || (r = Yn(t).createDocumentFragment());
      let o = r,
        s = [];
      return (
        e.forEach((i) => {
          if (s.length || i.marks.length) {
            let l = 0,
              c = 0;
            for (; l < s.length && c < i.marks.length; ) {
              let a = i.marks[c];
              if (!this.marks[a.type.name]) {
                c++;
                continue;
              }
              if (!a.eq(s[l][0]) || a.type.spec.spanning === !1) break;
              l++, c++;
            }
            for (; l < s.length; ) o = s.pop()[1];
            for (; c < i.marks.length; ) {
              let a = i.marks[c++],
                u = this.serializeMark(a, i.isInline, t);
              u &&
                (s.push([a, o]),
                o.appendChild(u.dom),
                (o = u.contentDOM || u.dom));
            }
          }
          o.appendChild(this.serializeNodeInner(i, t));
        }),
        r
      );
    }
    serializeNodeInner(e, t) {
      let { dom: r, contentDOM: o } = ve.renderSpec(
        Yn(t),
        this.nodes[e.type.name](e),
      );
      if (o) {
        if (e.isLeaf)
          throw new RangeError("Content hole not allowed in a leaf node spec");
        this.serializeFragment(e.content, t, o);
      }
      return r;
    }
    serializeNode(e, t = {}) {
      let r = this.serializeNodeInner(e, t);
      for (let o = e.marks.length - 1; o >= 0; o--) {
        let s = this.serializeMark(e.marks[o], e.isInline, t);
        s && ((s.contentDOM || s.dom).appendChild(r), (r = s.dom));
      }
      return r;
    }
    serializeMark(e, t, r = {}) {
      let o = this.marks[e.type.name];
      return o && ve.renderSpec(Yn(r), o(e, t));
    }
    static renderSpec(e, t, r = null) {
      if (typeof t == "string") return { dom: e.createTextNode(t) };
      if (t.nodeType != null) return { dom: t };
      if (t.dom && t.dom.nodeType != null) return t;
      let o = t[0],
        s = o.indexOf(" ");
      s > 0 && ((r = o.slice(0, s)), (o = o.slice(s + 1)));
      let i,
        l = r ? e.createElementNS(r, o) : e.createElement(o),
        c = t[1],
        a = 1;
      if (
        c &&
        typeof c == "object" &&
        c.nodeType == null &&
        !Array.isArray(c)
      ) {
        a = 2;
        for (let u in c)
          if (c[u] != null) {
            let f = u.indexOf(" ");
            f > 0
              ? l.setAttributeNS(u.slice(0, f), u.slice(f + 1), c[u])
              : l.setAttribute(u, c[u]);
          }
      }
      for (let u = a; u < t.length; u++) {
        let f = t[u];
        if (f === 0) {
          if (u < t.length - 1 || u > a)
            throw new RangeError(
              "Content hole must be the only child of its parent node",
            );
          return { dom: l, contentDOM: l };
        } else {
          let { dom: h, contentDOM: p } = ve.renderSpec(e, f, r);
          if ((l.appendChild(h), p)) {
            if (i) throw new RangeError("Multiple content holes");
            i = p;
          }
        }
      }
      return { dom: l, contentDOM: i };
    }
    static fromSchema(e) {
      return (
        e.cached.domSerializer ||
        (e.cached.domSerializer = new ve(
          this.nodesFromSchema(e),
          this.marksFromSchema(e),
        ))
      );
    }
    static nodesFromSchema(e) {
      let t = Yo(e.nodes);
      return t.text || (t.text = (r) => r.text), t;
    }
    static marksFromSchema(e) {
      return Yo(e.marks);
    }
  }
  function Yo(n) {
    let e = {};
    for (let t in n) {
      let r = n[t].spec.toDOM;
      r && (e[t] = r);
    }
    return e;
  }
  function Yn(n) {
    return n.document || window.document;
  }
  const Qo = 65535,
    Xo = Math.pow(2, 16);
  function Ic(n, e) {
    return n + e * Xo;
  }
  function es(n) {
    return n & Qo;
  }
  function Lc(n) {
    return (n - (n & Qo)) / Xo;
  }
  const ts = 1,
    ns = 2,
    hn = 4,
    rs = 8;
  class Qn {
    constructor(e, t, r) {
      (this.pos = e), (this.delInfo = t), (this.recover = r);
    }
    get deleted() {
      return (this.delInfo & rs) > 0;
    }
    get deletedBefore() {
      return (this.delInfo & (ts | hn)) > 0;
    }
    get deletedAfter() {
      return (this.delInfo & (ns | hn)) > 0;
    }
    get deletedAcross() {
      return (this.delInfo & hn) > 0;
    }
  }
  class te {
    constructor(e, t = !1) {
      if (((this.ranges = e), (this.inverted = t), !e.length && te.empty))
        return te.empty;
    }
    recover(e) {
      let t = 0,
        r = es(e);
      if (!this.inverted)
        for (let o = 0; o < r; o++)
          t += this.ranges[o * 3 + 2] - this.ranges[o * 3 + 1];
      return this.ranges[r * 3] + t + Lc(e);
    }
    mapResult(e, t = 1) {
      return this._map(e, t, !1);
    }
    map(e, t = 1) {
      return this._map(e, t, !0);
    }
    _map(e, t, r) {
      let o = 0,
        s = this.inverted ? 2 : 1,
        i = this.inverted ? 1 : 2;
      for (let l = 0; l < this.ranges.length; l += 3) {
        let c = this.ranges[l] - (this.inverted ? o : 0);
        if (c > e) break;
        let a = this.ranges[l + s],
          u = this.ranges[l + i],
          f = c + a;
        if (e <= f) {
          let h = a ? (e == c ? -1 : e == f ? 1 : t) : t,
            p = c + o + (h < 0 ? 0 : u);
          if (r) return p;
          let d = e == (t < 0 ? c : f) ? null : Ic(l / 3, e - c),
            m = e == c ? ns : e == f ? ts : hn;
          return (t < 0 ? e != c : e != f) && (m |= rs), new Qn(p, m, d);
        }
        o += u - a;
      }
      return r ? e + o : new Qn(e + o, 0, null);
    }
    touches(e, t) {
      let r = 0,
        o = es(t),
        s = this.inverted ? 2 : 1,
        i = this.inverted ? 1 : 2;
      for (let l = 0; l < this.ranges.length; l += 3) {
        let c = this.ranges[l] - (this.inverted ? r : 0);
        if (c > e) break;
        let a = this.ranges[l + s],
          u = c + a;
        if (e <= u && l == o * 3) return !0;
        r += this.ranges[l + i] - a;
      }
      return !1;
    }
    forEach(e) {
      let t = this.inverted ? 2 : 1,
        r = this.inverted ? 1 : 2;
      for (let o = 0, s = 0; o < this.ranges.length; o += 3) {
        let i = this.ranges[o],
          l = i - (this.inverted ? s : 0),
          c = i + (this.inverted ? 0 : s),
          a = this.ranges[o + t],
          u = this.ranges[o + r];
        e(l, l + a, c, c + u), (s += u - a);
      }
    }
    invert() {
      return new te(this.ranges, !this.inverted);
    }
    toString() {
      return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
    }
    static offset(e) {
      return e == 0 ? te.empty : new te(e < 0 ? [0, -e, 0] : [0, 0, e]);
    }
  }
  te.empty = new te([]);
  class lt {
    constructor(e = [], t, r = 0, o = e.length) {
      (this.maps = e), (this.mirror = t), (this.from = r), (this.to = o);
    }
    slice(e = 0, t = this.maps.length) {
      return new lt(this.maps, this.mirror, e, t);
    }
    copy() {
      return new lt(
        this.maps.slice(),
        this.mirror && this.mirror.slice(),
        this.from,
        this.to,
      );
    }
    appendMap(e, t) {
      (this.to = this.maps.push(e)),
        t != null && this.setMirror(this.maps.length - 1, t);
    }
    appendMapping(e) {
      for (let t = 0, r = this.maps.length; t < e.maps.length; t++) {
        let o = e.getMirror(t);
        this.appendMap(e.maps[t], o != null && o < t ? r + o : void 0);
      }
    }
    getMirror(e) {
      if (this.mirror) {
        for (let t = 0; t < this.mirror.length; t++)
          if (this.mirror[t] == e) return this.mirror[t + (t % 2 ? -1 : 1)];
      }
    }
    setMirror(e, t) {
      this.mirror || (this.mirror = []), this.mirror.push(e, t);
    }
    appendMappingInverted(e) {
      for (
        let t = e.maps.length - 1, r = this.maps.length + e.maps.length;
        t >= 0;
        t--
      ) {
        let o = e.getMirror(t);
        this.appendMap(
          e.maps[t].invert(),
          o != null && o > t ? r - o - 1 : void 0,
        );
      }
    }
    invert() {
      let e = new lt();
      return e.appendMappingInverted(this), e;
    }
    map(e, t = 1) {
      if (this.mirror) return this._map(e, t, !0);
      for (let r = this.from; r < this.to; r++) e = this.maps[r].map(e, t);
      return e;
    }
    mapResult(e, t = 1) {
      return this._map(e, t, !1);
    }
    _map(e, t, r) {
      let o = 0;
      for (let s = this.from; s < this.to; s++) {
        let i = this.maps[s],
          l = i.mapResult(e, t);
        if (l.recover != null) {
          let c = this.getMirror(s);
          if (c != null && c > s && c < this.to) {
            (s = c), (e = this.maps[c].recover(l.recover));
            continue;
          }
        }
        (o |= l.delInfo), (e = l.pos);
      }
      return r ? e : new Qn(e, o, null);
    }
  }
  const Xn = Object.create(null);
  class H {
    getMap() {
      return te.empty;
    }
    merge(e) {
      return null;
    }
    static fromJSON(e, t) {
      if (!t || !t.stepType)
        throw new RangeError("Invalid input for Step.fromJSON");
      let r = Xn[t.stepType];
      if (!r) throw new RangeError(`No step type ${t.stepType} defined`);
      return r.fromJSON(e, t);
    }
    static jsonID(e, t) {
      if (e in Xn) throw new RangeError("Duplicate use of step JSON ID " + e);
      return (Xn[e] = t), (t.prototype.jsonID = e), t;
    }
  }
  class F {
    constructor(e, t) {
      (this.doc = e), (this.failed = t);
    }
    static ok(e) {
      return new F(e, null);
    }
    static fail(e) {
      return new F(null, e);
    }
    static fromReplace(e, t, r, o) {
      try {
        return F.ok(e.replace(t, r, o));
      } catch (s) {
        if (s instanceof rn) return F.fail(s.message);
        throw s;
      }
    }
  }
  function er(n, e, t) {
    let r = [];
    for (let o = 0; o < n.childCount; o++) {
      let s = n.child(o);
      s.content.size && (s = s.copy(er(s.content, e, s))),
        s.isInline && (s = e(s, t, o)),
        r.push(s);
    }
    return y.fromArray(r);
  }
  class Ae extends H {
    constructor(e, t, r) {
      super(), (this.from = e), (this.to = t), (this.mark = r);
    }
    apply(e) {
      let t = e.slice(this.from, this.to),
        r = e.resolve(this.from),
        o = r.node(r.sharedDepth(this.to)),
        s = new v(
          er(
            t.content,
            (i, l) =>
              !i.isAtom || !l.type.allowsMarkType(this.mark.type)
                ? i
                : i.mark(this.mark.addToSet(i.marks)),
            o,
          ),
          t.openStart,
          t.openEnd,
        );
      return F.fromReplace(e, this.from, this.to, s);
    }
    invert() {
      return new me(this.from, this.to, this.mark);
    }
    map(e) {
      let t = e.mapResult(this.from, 1),
        r = e.mapResult(this.to, -1);
      return (t.deleted && r.deleted) || t.pos >= r.pos
        ? null
        : new Ae(t.pos, r.pos, this.mark);
    }
    merge(e) {
      return e instanceof Ae &&
        e.mark.eq(this.mark) &&
        this.from <= e.to &&
        this.to >= e.from
        ? new Ae(
            Math.min(this.from, e.from),
            Math.max(this.to, e.to),
            this.mark,
          )
        : null;
    }
    toJSON() {
      return {
        stepType: "addMark",
        mark: this.mark.toJSON(),
        from: this.from,
        to: this.to,
      };
    }
    static fromJSON(e, t) {
      if (typeof t.from != "number" || typeof t.to != "number")
        throw new RangeError("Invalid input for AddMarkStep.fromJSON");
      return new Ae(t.from, t.to, e.markFromJSON(t.mark));
    }
  }
  H.jsonID("addMark", Ae);
  class me extends H {
    constructor(e, t, r) {
      super(), (this.from = e), (this.to = t), (this.mark = r);
    }
    apply(e) {
      let t = e.slice(this.from, this.to),
        r = new v(
          er(t.content, (o) => o.mark(this.mark.removeFromSet(o.marks)), e),
          t.openStart,
          t.openEnd,
        );
      return F.fromReplace(e, this.from, this.to, r);
    }
    invert() {
      return new Ae(this.from, this.to, this.mark);
    }
    map(e) {
      let t = e.mapResult(this.from, 1),
        r = e.mapResult(this.to, -1);
      return (t.deleted && r.deleted) || t.pos >= r.pos
        ? null
        : new me(t.pos, r.pos, this.mark);
    }
    merge(e) {
      return e instanceof me &&
        e.mark.eq(this.mark) &&
        this.from <= e.to &&
        this.to >= e.from
        ? new me(
            Math.min(this.from, e.from),
            Math.max(this.to, e.to),
            this.mark,
          )
        : null;
    }
    toJSON() {
      return {
        stepType: "removeMark",
        mark: this.mark.toJSON(),
        from: this.from,
        to: this.to,
      };
    }
    static fromJSON(e, t) {
      if (typeof t.from != "number" || typeof t.to != "number")
        throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
      return new me(t.from, t.to, e.markFromJSON(t.mark));
    }
  }
  H.jsonID("removeMark", me);
  class _e extends H {
    constructor(e, t) {
      super(), (this.pos = e), (this.mark = t);
    }
    apply(e) {
      let t = e.nodeAt(this.pos);
      if (!t) return F.fail("No node at mark step's position");
      let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
      return F.fromReplace(
        e,
        this.pos,
        this.pos + 1,
        new v(y.from(r), 0, t.isLeaf ? 0 : 1),
      );
    }
    invert(e) {
      let t = e.nodeAt(this.pos);
      if (t) {
        let r = this.mark.addToSet(t.marks);
        if (r.length == t.marks.length) {
          for (let o = 0; o < t.marks.length; o++)
            if (!t.marks[o].isInSet(r)) return new _e(this.pos, t.marks[o]);
          return new _e(this.pos, this.mark);
        }
      }
      return new ct(this.pos, this.mark);
    }
    map(e) {
      let t = e.mapResult(this.pos, 1);
      return t.deletedAfter ? null : new _e(t.pos, this.mark);
    }
    toJSON() {
      return {
        stepType: "addNodeMark",
        pos: this.pos,
        mark: this.mark.toJSON(),
      };
    }
    static fromJSON(e, t) {
      if (typeof t.pos != "number")
        throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
      return new _e(t.pos, e.markFromJSON(t.mark));
    }
  }
  H.jsonID("addNodeMark", _e);
  class ct extends H {
    constructor(e, t) {
      super(), (this.pos = e), (this.mark = t);
    }
    apply(e) {
      let t = e.nodeAt(this.pos);
      if (!t) return F.fail("No node at mark step's position");
      let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
      return F.fromReplace(
        e,
        this.pos,
        this.pos + 1,
        new v(y.from(r), 0, t.isLeaf ? 0 : 1),
      );
    }
    invert(e) {
      let t = e.nodeAt(this.pos);
      return !t || !this.mark.isInSet(t.marks)
        ? this
        : new _e(this.pos, this.mark);
    }
    map(e) {
      let t = e.mapResult(this.pos, 1);
      return t.deletedAfter ? null : new ct(t.pos, this.mark);
    }
    toJSON() {
      return {
        stepType: "removeNodeMark",
        pos: this.pos,
        mark: this.mark.toJSON(),
      };
    }
    static fromJSON(e, t) {
      if (typeof t.pos != "number")
        throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
      return new ct(t.pos, e.markFromJSON(t.mark));
    }
  }
  H.jsonID("removeNodeMark", ct);
  class G extends H {
    constructor(e, t, r, o = !1) {
      super(),
        (this.from = e),
        (this.to = t),
        (this.slice = r),
        (this.structure = o);
    }
    apply(e) {
      return this.structure && tr(e, this.from, this.to)
        ? F.fail("Structure replace would overwrite content")
        : F.fromReplace(e, this.from, this.to, this.slice);
    }
    getMap() {
      return new te([this.from, this.to - this.from, this.slice.size]);
    }
    invert(e) {
      return new G(
        this.from,
        this.from + this.slice.size,
        e.slice(this.from, this.to),
      );
    }
    map(e) {
      let t = e.mapResult(this.from, 1),
        r = e.mapResult(this.to, -1);
      return t.deletedAcross && r.deletedAcross
        ? null
        : new G(t.pos, Math.max(t.pos, r.pos), this.slice);
    }
    merge(e) {
      if (!(e instanceof G) || e.structure || this.structure) return null;
      if (
        this.from + this.slice.size == e.from &&
        !this.slice.openEnd &&
        !e.slice.openStart
      ) {
        let t =
          this.slice.size + e.slice.size == 0
            ? v.empty
            : new v(
                this.slice.content.append(e.slice.content),
                this.slice.openStart,
                e.slice.openEnd,
              );
        return new G(this.from, this.to + (e.to - e.from), t, this.structure);
      } else if (
        e.to == this.from &&
        !this.slice.openStart &&
        !e.slice.openEnd
      ) {
        let t =
          this.slice.size + e.slice.size == 0
            ? v.empty
            : new v(
                e.slice.content.append(this.slice.content),
                e.slice.openStart,
                this.slice.openEnd,
              );
        return new G(e.from, this.to, t, this.structure);
      } else return null;
    }
    toJSON() {
      let e = { stepType: "replace", from: this.from, to: this.to };
      return (
        this.slice.size && (e.slice = this.slice.toJSON()),
        this.structure && (e.structure = !0),
        e
      );
    }
    static fromJSON(e, t) {
      if (typeof t.from != "number" || typeof t.to != "number")
        throw new RangeError("Invalid input for ReplaceStep.fromJSON");
      return new G(t.from, t.to, v.fromJSON(e, t.slice), !!t.structure);
    }
  }
  H.jsonID("replace", G);
  class $ extends H {
    constructor(e, t, r, o, s, i, l = !1) {
      super(),
        (this.from = e),
        (this.to = t),
        (this.gapFrom = r),
        (this.gapTo = o),
        (this.slice = s),
        (this.insert = i),
        (this.structure = l);
    }
    apply(e) {
      if (
        this.structure &&
        (tr(e, this.from, this.gapFrom) || tr(e, this.gapTo, this.to))
      )
        return F.fail("Structure gap-replace would overwrite content");
      let t = e.slice(this.gapFrom, this.gapTo);
      if (t.openStart || t.openEnd) return F.fail("Gap is not a flat range");
      let r = this.slice.insertAt(this.insert, t.content);
      return r
        ? F.fromReplace(e, this.from, this.to, r)
        : F.fail("Content does not fit in gap");
    }
    getMap() {
      return new te([
        this.from,
        this.gapFrom - this.from,
        this.insert,
        this.gapTo,
        this.to - this.gapTo,
        this.slice.size - this.insert,
      ]);
    }
    invert(e) {
      let t = this.gapTo - this.gapFrom;
      return new $(
        this.from,
        this.from + this.slice.size + t,
        this.from + this.insert,
        this.from + this.insert + t,
        e
          .slice(this.from, this.to)
          .removeBetween(this.gapFrom - this.from, this.gapTo - this.from),
        this.gapFrom - this.from,
        this.structure,
      );
    }
    map(e) {
      let t = e.mapResult(this.from, 1),
        r = e.mapResult(this.to, -1),
        o = e.map(this.gapFrom, -1),
        s = e.map(this.gapTo, 1);
      return (t.deletedAcross && r.deletedAcross) || o < t.pos || s > r.pos
        ? null
        : new $(t.pos, r.pos, o, s, this.slice, this.insert, this.structure);
    }
    toJSON() {
      let e = {
        stepType: "replaceAround",
        from: this.from,
        to: this.to,
        gapFrom: this.gapFrom,
        gapTo: this.gapTo,
        insert: this.insert,
      };
      return (
        this.slice.size && (e.slice = this.slice.toJSON()),
        this.structure && (e.structure = !0),
        e
      );
    }
    static fromJSON(e, t) {
      if (
        typeof t.from != "number" ||
        typeof t.to != "number" ||
        typeof t.gapFrom != "number" ||
        typeof t.gapTo != "number" ||
        typeof t.insert != "number"
      )
        throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
      return new $(
        t.from,
        t.to,
        t.gapFrom,
        t.gapTo,
        v.fromJSON(e, t.slice),
        t.insert,
        !!t.structure,
      );
    }
  }
  H.jsonID("replaceAround", $);
  function tr(n, e, t) {
    let r = n.resolve(e),
      o = t - e,
      s = r.depth;
    for (; o > 0 && s > 0 && r.indexAfter(s) == r.node(s).childCount; )
      s--, o--;
    if (o > 0) {
      let i = r.node(s).maybeChild(r.indexAfter(s));
      for (; o > 0; ) {
        if (!i || i.isLeaf) return !0;
        (i = i.firstChild), o--;
      }
    }
    return !1;
  }
  function zc(n, e, t, r) {
    let o = [],
      s = [],
      i,
      l;
    n.doc.nodesBetween(e, t, (c, a, u) => {
      if (!c.isInline) return;
      let f = c.marks;
      if (!r.isInSet(f) && u.type.allowsMarkType(r.type)) {
        let h = Math.max(a, e),
          p = Math.min(a + c.nodeSize, t),
          d = r.addToSet(f);
        for (let m = 0; m < f.length; m++)
          f[m].isInSet(d) ||
            (i && i.to == h && i.mark.eq(f[m])
              ? (i.to = p)
              : o.push((i = new me(h, p, f[m]))));
        l && l.to == h ? (l.to = p) : s.push((l = new Ae(h, p, r)));
      }
    }),
      o.forEach((c) => n.step(c)),
      s.forEach((c) => n.step(c));
  }
  function Fc(n, e, t, r) {
    let o = [],
      s = 0;
    n.doc.nodesBetween(e, t, (i, l) => {
      if (!i.isInline) return;
      s++;
      let c = null;
      if (r instanceof cn) {
        let a = i.marks,
          u;
        for (; (u = r.isInSet(a)); )
          (c || (c = [])).push(u), (a = u.removeFromSet(a));
      } else r ? r.isInSet(i.marks) && (c = [r]) : (c = i.marks);
      if (c && c.length) {
        let a = Math.min(l + i.nodeSize, t);
        for (let u = 0; u < c.length; u++) {
          let f = c[u],
            h;
          for (let p = 0; p < o.length; p++) {
            let d = o[p];
            d.step == s - 1 && f.eq(o[p].style) && (h = d);
          }
          h
            ? ((h.to = a), (h.step = s))
            : o.push({ style: f, from: Math.max(l, e), to: a, step: s });
        }
      }
    }),
      o.forEach((i) => n.step(new me(i.from, i.to, i.style)));
  }
  function Bc(n, e, t, r = t.contentMatch) {
    let o = n.doc.nodeAt(e),
      s = [],
      i = e + 1;
    for (let l = 0; l < o.childCount; l++) {
      let c = o.child(l),
        a = i + c.nodeSize,
        u = r.matchType(c.type);
      if (!u) s.push(new G(i, a, v.empty));
      else {
        r = u;
        for (let f = 0; f < c.marks.length; f++)
          t.allowsMarkType(c.marks[f].type) || n.step(new me(i, a, c.marks[f]));
        if (c.isText && !t.spec.code) {
          let f,
            h = /\r?\n|\r/g,
            p;
          for (; (f = h.exec(c.text)); )
            p ||
              (p = new v(
                y.from(t.schema.text(" ", t.allowedMarks(c.marks))),
                0,
                0,
              )),
              s.push(new G(i + f.index, i + f.index + f[0].length, p));
        }
      }
      i = a;
    }
    if (!r.validEnd) {
      let l = r.fillBefore(y.empty, !0);
      n.replace(i, i, new v(l, 0, 0));
    }
    for (let l = s.length - 1; l >= 0; l--) n.step(s[l]);
  }
  function Pc(n, e, t) {
    return (
      (e == 0 || n.canReplace(e, n.childCount)) &&
      (t == n.childCount || n.canReplace(0, t))
    );
  }
  function _t(n) {
    let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
    for (let r = n.depth; ; --r) {
      let o = n.$from.node(r),
        s = n.$from.index(r),
        i = n.$to.indexAfter(r);
      if (r < n.depth && o.canReplace(s, i, t)) return r;
      if (r == 0 || o.type.spec.isolating || !Pc(o, s, i)) break;
    }
    return null;
  }
  function Vc(n, e, t) {
    let { $from: r, $to: o, depth: s } = e,
      i = r.before(s + 1),
      l = o.after(s + 1),
      c = i,
      a = l,
      u = y.empty,
      f = 0;
    for (let d = s, m = !1; d > t; d--)
      m || r.index(d) > 0
        ? ((m = !0), (u = y.from(r.node(d).copy(u))), f++)
        : c--;
    let h = y.empty,
      p = 0;
    for (let d = s, m = !1; d > t; d--)
      m || o.after(d + 1) < o.end(d)
        ? ((m = !0), (h = y.from(o.node(d).copy(h))), p++)
        : a++;
    n.step(new $(c, a, i, l, new v(u.append(h), f, p), u.size - f, !0));
  }
  function nr(n, e, t = null, r = n) {
    let o = $c(n, e),
      s = o && Uc(r, e);
    return s ? o.map(ss).concat({ type: e, attrs: t }).concat(s.map(ss)) : null;
  }
  function ss(n) {
    return { type: n, attrs: null };
  }
  function $c(n, e) {
    let { parent: t, startIndex: r, endIndex: o } = n,
      s = t.contentMatchAt(r).findWrapping(e);
    if (!s) return null;
    let i = s.length ? s[0] : e;
    return t.canReplaceWith(r, o, i) ? s : null;
  }
  function Uc(n, e) {
    let { parent: t, startIndex: r, endIndex: o } = n,
      s = t.child(r),
      i = e.contentMatch.findWrapping(s.type);
    if (!i) return null;
    let c = (i.length ? i[i.length - 1] : e).contentMatch;
    for (let a = r; c && a < o; a++) c = c.matchType(t.child(a).type);
    return !c || !c.validEnd ? null : i;
  }
  function Hc(n, e, t) {
    let r = y.empty;
    for (let i = t.length - 1; i >= 0; i--) {
      if (r.size) {
        let l = t[i].type.contentMatch.matchFragment(r);
        if (!l || !l.validEnd)
          throw new RangeError(
            "Wrapper type given to Transform.wrap does not form valid content of its parent wrapper",
          );
      }
      r = y.from(t[i].type.create(t[i].attrs, r));
    }
    let o = e.start,
      s = e.end;
    n.step(new $(o, s, o, s, new v(r, 0, 0), t.length, !0));
  }
  function Gc(n, e, t, r, o) {
    if (!r.isTextblock)
      throw new RangeError("Type given to setBlockType should be a textblock");
    let s = n.steps.length;
    n.doc.nodesBetween(e, t, (i, l) => {
      if (
        i.isTextblock &&
        !i.hasMarkup(r, o) &&
        jc(n.doc, n.mapping.slice(s).map(l), r)
      ) {
        n.clearIncompatible(n.mapping.slice(s).map(l, 1), r);
        let c = n.mapping.slice(s),
          a = c.map(l, 1),
          u = c.map(l + i.nodeSize, 1);
        return (
          n.step(
            new $(
              a,
              u,
              a + 1,
              u - 1,
              new v(y.from(r.create(o, null, i.marks)), 0, 0),
              1,
              !0,
            ),
          ),
          !1
        );
      }
    });
  }
  function jc(n, e, t) {
    let r = n.resolve(e),
      o = r.index();
    return r.parent.canReplaceWith(o, o + 1, t);
  }
  function Jc(n, e, t, r, o) {
    let s = n.doc.nodeAt(e);
    if (!s) throw new RangeError("No node at given position");
    t || (t = s.type);
    let i = t.create(r, null, o || s.marks);
    if (s.isLeaf) return n.replaceWith(e, e + s.nodeSize, i);
    if (!t.validContent(s.content))
      throw new RangeError("Invalid content for node type " + t.name);
    n.step(
      new $(
        e,
        e + s.nodeSize,
        e + 1,
        e + s.nodeSize - 1,
        new v(y.from(i), 0, 0),
        1,
        !0,
      ),
    );
  }
  function at(n, e, t = 1, r) {
    let o = n.resolve(e),
      s = o.depth - t,
      i = (r && r[r.length - 1]) || o.parent;
    if (
      s < 0 ||
      o.parent.type.spec.isolating ||
      !o.parent.canReplace(o.index(), o.parent.childCount) ||
      !i.type.validContent(
        o.parent.content.cutByIndex(o.index(), o.parent.childCount),
      )
    )
      return !1;
    for (let a = o.depth - 1, u = t - 2; a > s; a--, u--) {
      let f = o.node(a),
        h = o.index(a);
      if (f.type.spec.isolating) return !1;
      let p = f.content.cutByIndex(h, f.childCount),
        d = r && r[u + 1];
      d && (p = p.replaceChild(0, d.type.create(d.attrs)));
      let m = (r && r[u]) || f;
      if (!f.canReplace(h + 1, f.childCount) || !m.type.validContent(p))
        return !1;
    }
    let l = o.indexAfter(s),
      c = r && r[0];
    return o.node(s).canReplaceWith(l, l, c ? c.type : o.node(s + 1).type);
  }
  function Wc(n, e, t = 1, r) {
    let o = n.doc.resolve(e),
      s = y.empty,
      i = y.empty;
    for (let l = o.depth, c = o.depth - t, a = t - 1; l > c; l--, a--) {
      s = y.from(o.node(l).copy(s));
      let u = r && r[a];
      i = y.from(u ? u.type.create(u.attrs, i) : o.node(l).copy(i));
    }
    n.step(new G(e, e, new v(s.append(i), t, t), !0));
  }
  function ut(n, e) {
    let t = n.resolve(e),
      r = t.index();
    return is(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
  }
  function is(n, e) {
    return !!(n && e && !n.isLeaf && n.canAppend(e));
  }
  function ls(n, e, t = -1) {
    let r = n.resolve(e);
    for (let o = r.depth; ; o--) {
      let s,
        i,
        l = r.index(o);
      if (
        (o == r.depth
          ? ((s = r.nodeBefore), (i = r.nodeAfter))
          : t > 0
            ? ((s = r.node(o + 1)), l++, (i = r.node(o).maybeChild(l)))
            : ((s = r.node(o).maybeChild(l - 1)), (i = r.node(o + 1))),
        s && !s.isTextblock && is(s, i) && r.node(o).canReplace(l, l + 1))
      )
        return e;
      if (o == 0) break;
      e = t < 0 ? r.before(o) : r.after(o);
    }
  }
  function Kc(n, e, t) {
    let r = new G(e - t, e + t, v.empty, !0);
    n.step(r);
  }
  function Zc(n, e, t) {
    let r = n.resolve(e);
    if (r.parent.canReplaceWith(r.index(), r.index(), t)) return e;
    if (r.parentOffset == 0)
      for (let o = r.depth - 1; o >= 0; o--) {
        let s = r.index(o);
        if (r.node(o).canReplaceWith(s, s, t)) return r.before(o + 1);
        if (s > 0) return null;
      }
    if (r.parentOffset == r.parent.content.size)
      for (let o = r.depth - 1; o >= 0; o--) {
        let s = r.indexAfter(o);
        if (r.node(o).canReplaceWith(s, s, t)) return r.after(o + 1);
        if (s < r.node(o).childCount) return null;
      }
    return null;
  }
  function cs(n, e, t) {
    let r = n.resolve(e);
    if (!t.content.size) return e;
    let o = t.content;
    for (let s = 0; s < t.openStart; s++) o = o.firstChild.content;
    for (let s = 1; s <= (t.openStart == 0 && t.size ? 2 : 1); s++)
      for (let i = r.depth; i >= 0; i--) {
        let l =
            i == r.depth
              ? 0
              : r.pos <= (r.start(i + 1) + r.end(i + 1)) / 2
                ? -1
                : 1,
          c = r.index(i) + (l > 0 ? 1 : 0),
          a = r.node(i),
          u = !1;
        if (s == 1) u = a.canReplace(c, c, o);
        else {
          let f = a.contentMatchAt(c).findWrapping(o.firstChild.type);
          u = f && a.canReplaceWith(c, c, f[0]);
        }
        if (u) return l == 0 ? r.pos : l < 0 ? r.before(i + 1) : r.after(i + 1);
      }
    return null;
  }
  function rr(n, e, t = e, r = v.empty) {
    if (e == t && !r.size) return null;
    let o = n.resolve(e),
      s = n.resolve(t);
    return as(o, s, r) ? new G(e, t, r) : new Yc(o, s, r).fit();
  }
  function as(n, e, t) {
    return (
      !t.openStart &&
      !t.openEnd &&
      n.start() == e.start() &&
      n.parent.canReplace(n.index(), e.index(), t.content)
    );
  }
  class Yc {
    constructor(e, t, r) {
      (this.$from = e),
        (this.$to = t),
        (this.unplaced = r),
        (this.frontier = []),
        (this.placed = y.empty);
      for (let o = 0; o <= e.depth; o++) {
        let s = e.node(o);
        this.frontier.push({
          type: s.type,
          match: s.contentMatchAt(e.indexAfter(o)),
        });
      }
      for (let o = e.depth; o > 0; o--)
        this.placed = y.from(e.node(o).copy(this.placed));
    }
    get depth() {
      return this.frontier.length - 1;
    }
    fit() {
      for (; this.unplaced.size; ) {
        let a = this.findFittable();
        a ? this.placeNodes(a) : this.openMore() || this.dropNode();
      }
      let e = this.mustMoveInline(),
        t = this.placed.size - this.depth - this.$from.depth,
        r = this.$from,
        o = this.close(e < 0 ? this.$to : r.doc.resolve(e));
      if (!o) return null;
      let s = this.placed,
        i = r.depth,
        l = o.depth;
      for (; i && l && s.childCount == 1; )
        (s = s.firstChild.content), i--, l--;
      let c = new v(s, i, l);
      return e > -1
        ? new $(r.pos, e, this.$to.pos, this.$to.end(), c, t)
        : c.size || r.pos != this.$to.pos
          ? new G(r.pos, o.pos, c)
          : null;
    }
    findFittable() {
      let e = this.unplaced.openStart;
      for (
        let t = this.unplaced.content, r = 0, o = this.unplaced.openEnd;
        r < e;
        r++
      ) {
        let s = t.firstChild;
        if ((t.childCount > 1 && (o = 0), s.type.spec.isolating && o <= r)) {
          e = r;
          break;
        }
        t = s.content;
      }
      for (let t = 1; t <= 2; t++)
        for (let r = t == 1 ? e : this.unplaced.openStart; r >= 0; r--) {
          let o,
            s = null;
          r
            ? ((s = or(this.unplaced.content, r - 1).firstChild),
              (o = s.content))
            : (o = this.unplaced.content);
          let i = o.firstChild;
          for (let l = this.depth; l >= 0; l--) {
            let { type: c, match: a } = this.frontier[l],
              u,
              f = null;
            if (
              t == 1 &&
              (i
                ? a.matchType(i.type) || (f = a.fillBefore(y.from(i), !1))
                : s && c.compatibleContent(s.type))
            )
              return { sliceDepth: r, frontierDepth: l, parent: s, inject: f };
            if (t == 2 && i && (u = a.findWrapping(i.type)))
              return { sliceDepth: r, frontierDepth: l, parent: s, wrap: u };
            if (s && a.matchType(s.type)) break;
          }
        }
    }
    openMore() {
      let { content: e, openStart: t, openEnd: r } = this.unplaced,
        o = or(e, t);
      return !o.childCount || o.firstChild.isLeaf
        ? !1
        : ((this.unplaced = new v(
            e,
            t + 1,
            Math.max(r, o.size + t >= e.size - r ? t + 1 : 0),
          )),
          !0);
    }
    dropNode() {
      let { content: e, openStart: t, openEnd: r } = this.unplaced,
        o = or(e, t);
      if (o.childCount <= 1 && t > 0) {
        let s = e.size - t <= t + o.size;
        this.unplaced = new v(Mt(e, t - 1, 1), t - 1, s ? t - 1 : r);
      } else this.unplaced = new v(Mt(e, t, 1), t, r);
    }
    placeNodes({
      sliceDepth: e,
      frontierDepth: t,
      parent: r,
      inject: o,
      wrap: s,
    }) {
      for (; this.depth > t; ) this.closeFrontierNode();
      if (s) for (let m = 0; m < s.length; m++) this.openFrontierNode(s[m]);
      let i = this.unplaced,
        l = r ? r.content : i.content,
        c = i.openStart - e,
        a = 0,
        u = [],
        { match: f, type: h } = this.frontier[t];
      if (o) {
        for (let m = 0; m < o.childCount; m++) u.push(o.child(m));
        f = f.matchFragment(o);
      }
      let p = l.size + e - (i.content.size - i.openEnd);
      for (; a < l.childCount; ) {
        let m = l.child(a),
          g = f.matchType(m.type);
        if (!g) break;
        a++,
          (a > 1 || c == 0 || m.content.size) &&
            ((f = g),
            u.push(
              us(
                m.mark(h.allowedMarks(m.marks)),
                a == 1 ? c : 0,
                a == l.childCount ? p : -1,
              ),
            ));
      }
      let d = a == l.childCount;
      d || (p = -1),
        (this.placed = Tt(this.placed, t, y.from(u))),
        (this.frontier[t].match = f),
        d &&
          p < 0 &&
          r &&
          r.type == this.frontier[this.depth].type &&
          this.frontier.length > 1 &&
          this.closeFrontierNode();
      for (let m = 0, g = l; m < p; m++) {
        let b = g.lastChild;
        this.frontier.push({
          type: b.type,
          match: b.contentMatchAt(b.childCount),
        }),
          (g = b.content);
      }
      this.unplaced = d
        ? e == 0
          ? v.empty
          : new v(Mt(i.content, e - 1, 1), e - 1, p < 0 ? i.openEnd : e - 1)
        : new v(Mt(i.content, e, a), i.openStart, i.openEnd);
    }
    mustMoveInline() {
      if (!this.$to.parent.isTextblock) return -1;
      let e = this.frontier[this.depth],
        t;
      if (
        !e.type.isTextblock ||
        !sr(this.$to, this.$to.depth, e.type, e.match, !1) ||
        (this.$to.depth == this.depth &&
          (t = this.findCloseLevel(this.$to)) &&
          t.depth == this.depth)
      )
        return -1;
      let { depth: r } = this.$to,
        o = this.$to.after(r);
      for (; r > 1 && o == this.$to.end(--r); ) ++o;
      return o;
    }
    findCloseLevel(e) {
      e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
        let { match: r, type: o } = this.frontier[t],
          s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)),
          i = sr(e, t, o, r, s);
        if (i) {
          for (let l = t - 1; l >= 0; l--) {
            let { match: c, type: a } = this.frontier[l],
              u = sr(e, l, a, c, !0);
            if (!u || u.childCount) continue e;
          }
          return {
            depth: t,
            fit: i,
            move: s ? e.doc.resolve(e.after(t + 1)) : e,
          };
        }
      }
    }
    close(e) {
      let t = this.findCloseLevel(e);
      if (!t) return null;
      for (; this.depth > t.depth; ) this.closeFrontierNode();
      t.fit.childCount && (this.placed = Tt(this.placed, t.depth, t.fit)),
        (e = t.move);
      for (let r = t.depth + 1; r <= e.depth; r++) {
        let o = e.node(r),
          s = o.type.contentMatch.fillBefore(o.content, !0, e.index(r));
        this.openFrontierNode(o.type, o.attrs, s);
      }
      return e;
    }
    openFrontierNode(e, t = null, r) {
      let o = this.frontier[this.depth];
      (o.match = o.match.matchType(e)),
        (this.placed = Tt(this.placed, this.depth, y.from(e.create(t, r)))),
        this.frontier.push({ type: e, match: e.contentMatch });
    }
    closeFrontierNode() {
      let t = this.frontier.pop().match.fillBefore(y.empty, !0);
      t.childCount && (this.placed = Tt(this.placed, this.frontier.length, t));
    }
  }
  function Mt(n, e, t) {
    return e == 0
      ? n.cutByIndex(t, n.childCount)
      : n.replaceChild(
          0,
          n.firstChild.copy(Mt(n.firstChild.content, e - 1, t)),
        );
  }
  function Tt(n, e, t) {
    return e == 0
      ? n.append(t)
      : n.replaceChild(
          n.childCount - 1,
          n.lastChild.copy(Tt(n.lastChild.content, e - 1, t)),
        );
  }
  function or(n, e) {
    for (let t = 0; t < e; t++) n = n.firstChild.content;
    return n;
  }
  function us(n, e, t) {
    if (e <= 0) return n;
    let r = n.content;
    return (
      e > 1 &&
        (r = r.replaceChild(
          0,
          us(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0),
        )),
      e > 0 &&
        ((r = n.type.contentMatch.fillBefore(r).append(r)),
        t <= 0 &&
          (r = r.append(
            n.type.contentMatch.matchFragment(r).fillBefore(y.empty, !0),
          ))),
      n.copy(r)
    );
  }
  function sr(n, e, t, r, o) {
    let s = n.node(e),
      i = o ? n.indexAfter(e) : n.index(e);
    if (i == s.childCount && !t.compatibleContent(s.type)) return null;
    let l = r.fillBefore(s.content, !0, i);
    return l && !Qc(t, s.content, i) ? l : null;
  }
  function Qc(n, e, t) {
    for (let r = t; r < e.childCount; r++)
      if (!n.allowsMarks(e.child(r).marks)) return !0;
    return !1;
  }
  function Xc(n) {
    return n.spec.defining || n.spec.definingForContent;
  }
  function ea(n, e, t, r) {
    if (!r.size) return n.deleteRange(e, t);
    let o = n.doc.resolve(e),
      s = n.doc.resolve(t);
    if (as(o, s, r)) return n.step(new G(e, t, r));
    let i = hs(o, n.doc.resolve(t));
    i[i.length - 1] == 0 && i.pop();
    let l = -(o.depth + 1);
    i.unshift(l);
    for (let h = o.depth, p = o.pos - 1; h > 0; h--, p--) {
      let d = o.node(h).type.spec;
      if (d.defining || d.definingAsContext || d.isolating) break;
      i.indexOf(h) > -1 ? (l = h) : o.before(h) == p && i.splice(1, 0, -h);
    }
    let c = i.indexOf(l),
      a = [],
      u = r.openStart;
    for (let h = r.content, p = 0; ; p++) {
      let d = h.firstChild;
      if ((a.push(d), p == r.openStart)) break;
      h = d.content;
    }
    for (let h = u - 1; h >= 0; h--) {
      let p = a[h],
        d = Xc(p.type);
      if (d && !p.sameMarkup(o.node(Math.abs(l) - 1))) u = h;
      else if (d || !p.type.isTextblock) break;
    }
    for (let h = r.openStart; h >= 0; h--) {
      let p = (h + u + 1) % (r.openStart + 1),
        d = a[p];
      if (d)
        for (let m = 0; m < i.length; m++) {
          let g = i[(m + c) % i.length],
            b = !0;
          g < 0 && ((b = !1), (g = -g));
          let k = o.node(g - 1),
            S = o.index(g - 1);
          if (k.canReplaceWith(S, S, d.type, d.marks))
            return n.replace(
              o.before(g),
              b ? s.after(g) : t,
              new v(fs(r.content, 0, r.openStart, p), p, r.openEnd),
            );
        }
    }
    let f = n.steps.length;
    for (
      let h = i.length - 1;
      h >= 0 && (n.replace(e, t, r), !(n.steps.length > f));
      h--
    ) {
      let p = i[h];
      p < 0 || ((e = o.before(p)), (t = s.after(p)));
    }
  }
  function fs(n, e, t, r, o) {
    if (e < t) {
      let s = n.firstChild;
      n = n.replaceChild(0, s.copy(fs(s.content, e + 1, t, r, s)));
    }
    if (e > r) {
      let s = o.contentMatchAt(0),
        i = s.fillBefore(n).append(n);
      n = i.append(s.matchFragment(i).fillBefore(y.empty, !0));
    }
    return n;
  }
  function ta(n, e, t, r) {
    if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
      let o = Zc(n.doc, e, r.type);
      o != null && (e = t = o);
    }
    n.replaceRange(e, t, new v(y.from(r), 0, 0));
  }
  function na(n, e, t) {
    let r = n.doc.resolve(e),
      o = n.doc.resolve(t),
      s = hs(r, o);
    for (let i = 0; i < s.length; i++) {
      let l = s[i],
        c = i == s.length - 1;
      if ((c && l == 0) || r.node(l).type.contentMatch.validEnd)
        return n.delete(r.start(l), o.end(l));
      if (
        l > 0 &&
        (c || r.node(l - 1).canReplace(r.index(l - 1), o.indexAfter(l - 1)))
      )
        return n.delete(r.before(l), o.after(l));
    }
    for (let i = 1; i <= r.depth && i <= o.depth; i++)
      if (
        e - r.start(i) == r.depth - i &&
        t > r.end(i) &&
        o.end(i) - t != o.depth - i
      )
        return n.delete(r.before(i), t);
    n.delete(e, t);
  }
  function hs(n, e) {
    let t = [],
      r = Math.min(n.depth, e.depth);
    for (let o = r; o >= 0; o--) {
      let s = n.start(o);
      if (
        s < n.pos - (n.depth - o) ||
        e.end(o) > e.pos + (e.depth - o) ||
        n.node(o).type.spec.isolating ||
        e.node(o).type.spec.isolating
      )
        break;
      (s == e.start(o) ||
        (o == n.depth &&
          o == e.depth &&
          n.parent.inlineContent &&
          e.parent.inlineContent &&
          o &&
          e.start(o - 1) == s - 1)) &&
        t.push(o);
    }
    return t;
  }
  class ft extends H {
    constructor(e, t, r) {
      super(), (this.pos = e), (this.attr = t), (this.value = r);
    }
    apply(e) {
      let t = e.nodeAt(this.pos);
      if (!t) return F.fail("No node at attribute step's position");
      let r = Object.create(null);
      for (let s in t.attrs) r[s] = t.attrs[s];
      r[this.attr] = this.value;
      let o = t.type.create(r, null, t.marks);
      return F.fromReplace(
        e,
        this.pos,
        this.pos + 1,
        new v(y.from(o), 0, t.isLeaf ? 0 : 1),
      );
    }
    getMap() {
      return te.empty;
    }
    invert(e) {
      return new ft(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
    }
    map(e) {
      let t = e.mapResult(this.pos, 1);
      return t.deletedAfter ? null : new ft(t.pos, this.attr, this.value);
    }
    toJSON() {
      return {
        stepType: "attr",
        pos: this.pos,
        attr: this.attr,
        value: this.value,
      };
    }
    static fromJSON(e, t) {
      if (typeof t.pos != "number" || typeof t.attr != "string")
        throw new RangeError("Invalid input for AttrStep.fromJSON");
      return new ft(t.pos, t.attr, t.value);
    }
  }
  H.jsonID("attr", ft);
  class qt extends H {
    constructor(e, t) {
      super(), (this.attr = e), (this.value = t);
    }
    apply(e) {
      let t = Object.create(null);
      for (let o in e.attrs) t[o] = e.attrs[o];
      t[this.attr] = this.value;
      let r = e.type.create(t, e.content, e.marks);
      return F.ok(r);
    }
    getMap() {
      return te.empty;
    }
    invert(e) {
      return new qt(this.attr, e.attrs[this.attr]);
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
      return new qt(t.attr, t.value);
    }
  }
  H.jsonID("docAttr", qt);
  let ht = class extends Error {};
  (ht = function n(e) {
    let t = Error.call(this, e);
    return (t.__proto__ = n.prototype), t;
  }),
    (ht.prototype = Object.create(Error.prototype)),
    (ht.prototype.constructor = ht),
    (ht.prototype.name = "TransformError");
  class ra {
    constructor(e) {
      (this.doc = e),
        (this.steps = []),
        (this.docs = []),
        (this.mapping = new lt());
    }
    get before() {
      return this.docs.length ? this.docs[0] : this.doc;
    }
    step(e) {
      let t = this.maybeStep(e);
      if (t.failed) throw new ht(t.failed);
      return this;
    }
    maybeStep(e) {
      let t = e.apply(this.doc);
      return t.failed || this.addStep(e, t.doc), t;
    }
    get docChanged() {
      return this.steps.length > 0;
    }
    addStep(e, t) {
      this.docs.push(this.doc),
        this.steps.push(e),
        this.mapping.appendMap(e.getMap()),
        (this.doc = t);
    }
    replace(e, t = e, r = v.empty) {
      let o = rr(this.doc, e, t, r);
      return o && this.step(o), this;
    }
    replaceWith(e, t, r) {
      return this.replace(e, t, new v(y.from(r), 0, 0));
    }
    delete(e, t) {
      return this.replace(e, t, v.empty);
    }
    insert(e, t) {
      return this.replaceWith(e, e, t);
    }
    replaceRange(e, t, r) {
      return ea(this, e, t, r), this;
    }
    replaceRangeWith(e, t, r) {
      return ta(this, e, t, r), this;
    }
    deleteRange(e, t) {
      return na(this, e, t), this;
    }
    lift(e, t) {
      return Vc(this, e, t), this;
    }
    join(e, t = 1) {
      return Kc(this, e, t), this;
    }
    wrap(e, t) {
      return Hc(this, e, t), this;
    }
    setBlockType(e, t = e, r, o = null) {
      return Gc(this, e, t, r, o), this;
    }
    setNodeMarkup(e, t, r = null, o) {
      return Jc(this, e, t, r, o), this;
    }
    setNodeAttribute(e, t, r) {
      return this.step(new ft(e, t, r)), this;
    }
    setDocAttribute(e, t) {
      return this.step(new qt(e, t)), this;
    }
    addNodeMark(e, t) {
      return this.step(new _e(e, t)), this;
    }
    removeNodeMark(e, t) {
      if (!(t instanceof q)) {
        let r = this.doc.nodeAt(e);
        if (!r) throw new RangeError("No node at position " + e);
        if (((t = t.isInSet(r.marks)), !t)) return this;
      }
      return this.step(new ct(e, t)), this;
    }
    split(e, t = 1, r) {
      return Wc(this, e, t, r), this;
    }
    addMark(e, t, r) {
      return zc(this, e, t, r), this;
    }
    removeMark(e, t, r) {
      return Fc(this, e, t, r), this;
    }
    clearIncompatible(e, t, r) {
      return Bc(this, e, t, r), this;
    }
  }
  const ir = Object.create(null);
  class T {
    constructor(e, t, r) {
      (this.$anchor = e),
        (this.$head = t),
        (this.ranges = r || [new oa(e.min(t), e.max(t))]);
    }
    get anchor() {
      return this.$anchor.pos;
    }
    get head() {
      return this.$head.pos;
    }
    get from() {
      return this.$from.pos;
    }
    get to() {
      return this.$to.pos;
    }
    get $from() {
      return this.ranges[0].$from;
    }
    get $to() {
      return this.ranges[0].$to;
    }
    get empty() {
      let e = this.ranges;
      for (let t = 0; t < e.length; t++)
        if (e[t].$from.pos != e[t].$to.pos) return !1;
      return !0;
    }
    content() {
      return this.$from.doc.slice(this.from, this.to, !0);
    }
    replace(e, t = v.empty) {
      let r = t.content.lastChild,
        o = null;
      for (let l = 0; l < t.openEnd; l++) (o = r), (r = r.lastChild);
      let s = e.steps.length,
        i = this.ranges;
      for (let l = 0; l < i.length; l++) {
        let { $from: c, $to: a } = i[l],
          u = e.mapping.slice(s);
        e.replaceRange(u.map(c.pos), u.map(a.pos), l ? v.empty : t),
          l == 0 && ms(e, s, (r ? r.isInline : o && o.isTextblock) ? -1 : 1);
      }
    }
    replaceWith(e, t) {
      let r = e.steps.length,
        o = this.ranges;
      for (let s = 0; s < o.length; s++) {
        let { $from: i, $to: l } = o[s],
          c = e.mapping.slice(r),
          a = c.map(i.pos),
          u = c.map(l.pos);
        s
          ? e.deleteRange(a, u)
          : (e.replaceRangeWith(a, u, t), ms(e, r, t.isInline ? -1 : 1));
      }
    }
    static findFrom(e, t, r = !1) {
      let o = e.parent.inlineContent
        ? new I(e)
        : pt(e.node(0), e.parent, e.pos, e.index(), t, r);
      if (o) return o;
      for (let s = e.depth - 1; s >= 0; s--) {
        let i =
          t < 0
            ? pt(e.node(0), e.node(s), e.before(s + 1), e.index(s), t, r)
            : pt(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, t, r);
        if (i) return i;
      }
      return null;
    }
    static near(e, t = 1) {
      return this.findFrom(e, t) || this.findFrom(e, -t) || new ne(e.node(0));
    }
    static atStart(e) {
      return pt(e, e, 0, 0, 1) || new ne(e);
    }
    static atEnd(e) {
      return pt(e, e, e.content.size, e.childCount, -1) || new ne(e);
    }
    static fromJSON(e, t) {
      if (!t || !t.type)
        throw new RangeError("Invalid input for Selection.fromJSON");
      let r = ir[t.type];
      if (!r) throw new RangeError(`No selection type ${t.type} defined`);
      return r.fromJSON(e, t);
    }
    static jsonID(e, t) {
      if (e in ir)
        throw new RangeError("Duplicate use of selection JSON ID " + e);
      return (ir[e] = t), (t.prototype.jsonID = e), t;
    }
    getBookmark() {
      return I.between(this.$anchor, this.$head).getBookmark();
    }
  }
  T.prototype.visible = !0;
  class oa {
    constructor(e, t) {
      (this.$from = e), (this.$to = t);
    }
  }
  let ps = !1;
  function ds(n) {
    !ps &&
      !n.parent.inlineContent &&
      ((ps = !0),
      console.warn(
        "TextSelection endpoint not pointing into a node with inline content (" +
          n.parent.type.name +
          ")",
      ));
  }
  class I extends T {
    constructor(e, t = e) {
      ds(e), ds(t), super(e, t);
    }
    get $cursor() {
      return this.$anchor.pos == this.$head.pos ? this.$head : null;
    }
    map(e, t) {
      let r = e.resolve(t.map(this.head));
      if (!r.parent.inlineContent) return T.near(r);
      let o = e.resolve(t.map(this.anchor));
      return new I(o.parent.inlineContent ? o : r, r);
    }
    replace(e, t = v.empty) {
      if ((super.replace(e, t), t == v.empty)) {
        let r = this.$from.marksAcross(this.$to);
        r && e.ensureMarks(r);
      }
    }
    eq(e) {
      return e instanceof I && e.anchor == this.anchor && e.head == this.head;
    }
    getBookmark() {
      return new pn(this.anchor, this.head);
    }
    toJSON() {
      return { type: "text", anchor: this.anchor, head: this.head };
    }
    static fromJSON(e, t) {
      if (typeof t.anchor != "number" || typeof t.head != "number")
        throw new RangeError("Invalid input for TextSelection.fromJSON");
      return new I(e.resolve(t.anchor), e.resolve(t.head));
    }
    static create(e, t, r = t) {
      let o = e.resolve(t);
      return new this(o, r == t ? o : e.resolve(r));
    }
    static between(e, t, r) {
      let o = e.pos - t.pos;
      if (((!r || o) && (r = o >= 0 ? 1 : -1), !t.parent.inlineContent)) {
        let s = T.findFrom(t, r, !0) || T.findFrom(t, -r, !0);
        if (s) t = s.$head;
        else return T.near(t, r);
      }
      return (
        e.parent.inlineContent ||
          (o == 0
            ? (e = t)
            : ((e = (T.findFrom(e, -r, !0) || T.findFrom(e, r, !0)).$anchor),
              e.pos < t.pos != o < 0 && (e = t))),
        new I(e, t)
      );
    }
  }
  T.jsonID("text", I);
  class pn {
    constructor(e, t) {
      (this.anchor = e), (this.head = t);
    }
    map(e) {
      return new pn(e.map(this.anchor), e.map(this.head));
    }
    resolve(e) {
      return I.between(e.resolve(this.anchor), e.resolve(this.head));
    }
  }
  class D extends T {
    constructor(e) {
      let t = e.nodeAfter,
        r = e.node(0).resolve(e.pos + t.nodeSize);
      super(e, r), (this.node = t);
    }
    map(e, t) {
      let { deleted: r, pos: o } = t.mapResult(this.anchor),
        s = e.resolve(o);
      return r ? T.near(s) : new D(s);
    }
    content() {
      return new v(y.from(this.node), 0, 0);
    }
    eq(e) {
      return e instanceof D && e.anchor == this.anchor;
    }
    toJSON() {
      return { type: "node", anchor: this.anchor };
    }
    getBookmark() {
      return new lr(this.anchor);
    }
    static fromJSON(e, t) {
      if (typeof t.anchor != "number")
        throw new RangeError("Invalid input for NodeSelection.fromJSON");
      return new D(e.resolve(t.anchor));
    }
    static create(e, t) {
      return new D(e.resolve(t));
    }
    static isSelectable(e) {
      return !e.isText && e.type.spec.selectable !== !1;
    }
  }
  (D.prototype.visible = !1), T.jsonID("node", D);
  class lr {
    constructor(e) {
      this.anchor = e;
    }
    map(e) {
      let { deleted: t, pos: r } = e.mapResult(this.anchor);
      return t ? new pn(r, r) : new lr(r);
    }
    resolve(e) {
      let t = e.resolve(this.anchor),
        r = t.nodeAfter;
      return r && D.isSelectable(r) ? new D(t) : T.near(t);
    }
  }
  class ne extends T {
    constructor(e) {
      super(e.resolve(0), e.resolve(e.content.size));
    }
    replace(e, t = v.empty) {
      if (t == v.empty) {
        e.delete(0, e.doc.content.size);
        let r = T.atStart(e.doc);
        r.eq(e.selection) || e.setSelection(r);
      } else super.replace(e, t);
    }
    toJSON() {
      return { type: "all" };
    }
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
      return sa;
    }
  }
  T.jsonID("all", ne);
  const sa = {
    map() {
      return this;
    },
    resolve(n) {
      return new ne(n);
    },
  };
  function pt(n, e, t, r, o, s = !1) {
    if (e.inlineContent) return I.create(n, t);
    for (
      let i = r - (o > 0 ? 0 : 1);
      o > 0 ? i < e.childCount : i >= 0;
      i += o
    ) {
      let l = e.child(i);
      if (l.isAtom) {
        if (!s && D.isSelectable(l))
          return D.create(n, t - (o < 0 ? l.nodeSize : 0));
      } else {
        let c = pt(n, l, t + o, o < 0 ? l.childCount : 0, o, s);
        if (c) return c;
      }
      t += l.nodeSize * o;
    }
    return null;
  }
  function ms(n, e, t) {
    let r = n.steps.length - 1;
    if (r < e) return;
    let o = n.steps[r];
    if (!(o instanceof G || o instanceof $)) return;
    let s = n.mapping.maps[r],
      i;
    s.forEach((l, c, a, u) => {
      i == null && (i = u);
    }),
      n.setSelection(T.near(n.doc.resolve(i), t));
  }
  const gs = 1,
    dn = 2,
    bs = 4;
  class ia extends ra {
    constructor(e) {
      super(e.doc),
        (this.curSelectionFor = 0),
        (this.updated = 0),
        (this.meta = Object.create(null)),
        (this.time = Date.now()),
        (this.curSelection = e.selection),
        (this.storedMarks = e.storedMarks);
    }
    get selection() {
      return (
        this.curSelectionFor < this.steps.length &&
          ((this.curSelection = this.curSelection.map(
            this.doc,
            this.mapping.slice(this.curSelectionFor),
          )),
          (this.curSelectionFor = this.steps.length)),
        this.curSelection
      );
    }
    setSelection(e) {
      if (e.$from.doc != this.doc)
        throw new RangeError(
          "Selection passed to setSelection must point at the current document",
        );
      return (
        (this.curSelection = e),
        (this.curSelectionFor = this.steps.length),
        (this.updated = (this.updated | gs) & ~dn),
        (this.storedMarks = null),
        this
      );
    }
    get selectionSet() {
      return (this.updated & gs) > 0;
    }
    setStoredMarks(e) {
      return (this.storedMarks = e), (this.updated |= dn), this;
    }
    ensureMarks(e) {
      return (
        q.sameSet(this.storedMarks || this.selection.$from.marks(), e) ||
          this.setStoredMarks(e),
        this
      );
    }
    addStoredMark(e) {
      return this.ensureMarks(
        e.addToSet(this.storedMarks || this.selection.$head.marks()),
      );
    }
    removeStoredMark(e) {
      return this.ensureMarks(
        e.removeFromSet(this.storedMarks || this.selection.$head.marks()),
      );
    }
    get storedMarksSet() {
      return (this.updated & dn) > 0;
    }
    addStep(e, t) {
      super.addStep(e, t),
        (this.updated = this.updated & ~dn),
        (this.storedMarks = null);
    }
    setTime(e) {
      return (this.time = e), this;
    }
    replaceSelection(e) {
      return this.selection.replace(this, e), this;
    }
    replaceSelectionWith(e, t = !0) {
      let r = this.selection;
      return (
        t &&
          (e = e.mark(
            this.storedMarks ||
              (r.empty
                ? r.$from.marks()
                : r.$from.marksAcross(r.$to) || q.none),
          )),
        r.replaceWith(this, e),
        this
      );
    }
    deleteSelection() {
      return this.selection.replace(this), this;
    }
    insertText(e, t, r) {
      let o = this.doc.type.schema;
      if (t == null)
        return e
          ? this.replaceSelectionWith(o.text(e), !0)
          : this.deleteSelection();
      {
        if ((r == null && (r = t), (r = r ?? t), !e))
          return this.deleteRange(t, r);
        let s = this.storedMarks;
        if (!s) {
          let i = this.doc.resolve(t);
          s = r == t ? i.marks() : i.marksAcross(this.doc.resolve(r));
        }
        return (
          this.replaceRangeWith(t, r, o.text(e, s)),
          this.selection.empty || this.setSelection(T.near(this.selection.$to)),
          this
        );
      }
    }
    setMeta(e, t) {
      return (this.meta[typeof e == "string" ? e : e.key] = t), this;
    }
    getMeta(e) {
      return this.meta[typeof e == "string" ? e : e.key];
    }
    get isGeneric() {
      for (let e in this.meta) return !1;
      return !0;
    }
    scrollIntoView() {
      return (this.updated |= bs), this;
    }
    get scrolledIntoView() {
      return (this.updated & bs) > 0;
    }
  }
  function ys(n, e) {
    return !e || !n ? n : n.bind(e);
  }
  class Nt {
    constructor(e, t, r) {
      (this.name = e),
        (this.init = ys(t.init, r)),
        (this.apply = ys(t.apply, r));
    }
  }
  const la = [
    new Nt("doc", {
      init(n) {
        return n.doc || n.schema.topNodeType.createAndFill();
      },
      apply(n) {
        return n.doc;
      },
    }),
    new Nt("selection", {
      init(n, e) {
        return n.selection || T.atStart(e.doc);
      },
      apply(n) {
        return n.selection;
      },
    }),
    new Nt("storedMarks", {
      init(n) {
        return n.storedMarks || null;
      },
      apply(n, e, t, r) {
        return r.selection.$cursor ? n.storedMarks : null;
      },
    }),
    new Nt("scrollToSelection", {
      init() {
        return 0;
      },
      apply(n, e) {
        return n.scrolledIntoView ? e + 1 : e;
      },
    }),
  ];
  class cr {
    constructor(e, t) {
      (this.schema = e),
        (this.plugins = []),
        (this.pluginsByKey = Object.create(null)),
        (this.fields = la.slice()),
        t &&
          t.forEach((r) => {
            if (this.pluginsByKey[r.key])
              throw new RangeError(
                "Adding different instances of a keyed plugin (" + r.key + ")",
              );
            this.plugins.push(r),
              (this.pluginsByKey[r.key] = r),
              r.spec.state && this.fields.push(new Nt(r.key, r.spec.state, r));
          });
    }
  }
  class dt {
    constructor(e) {
      this.config = e;
    }
    get schema() {
      return this.config.schema;
    }
    get plugins() {
      return this.config.plugins;
    }
    apply(e) {
      return this.applyTransaction(e).state;
    }
    filterTransaction(e, t = -1) {
      for (let r = 0; r < this.config.plugins.length; r++)
        if (r != t) {
          let o = this.config.plugins[r];
          if (
            o.spec.filterTransaction &&
            !o.spec.filterTransaction.call(o, e, this)
          )
            return !1;
        }
      return !0;
    }
    applyTransaction(e) {
      if (!this.filterTransaction(e)) return { state: this, transactions: [] };
      let t = [e],
        r = this.applyInner(e),
        o = null;
      for (;;) {
        let s = !1;
        for (let i = 0; i < this.config.plugins.length; i++) {
          let l = this.config.plugins[i];
          if (l.spec.appendTransaction) {
            let c = o ? o[i].n : 0,
              a = o ? o[i].state : this,
              u =
                c < t.length &&
                l.spec.appendTransaction.call(l, c ? t.slice(c) : t, a, r);
            if (u && r.filterTransaction(u, i)) {
              if ((u.setMeta("appendedTransaction", e), !o)) {
                o = [];
                for (let f = 0; f < this.config.plugins.length; f++)
                  o.push(
                    f < i ? { state: r, n: t.length } : { state: this, n: 0 },
                  );
              }
              t.push(u), (r = r.applyInner(u)), (s = !0);
            }
            o && (o[i] = { state: r, n: t.length });
          }
        }
        if (!s) return { state: r, transactions: t };
      }
    }
    applyInner(e) {
      if (!e.before.eq(this.doc))
        throw new RangeError("Applying a mismatched transaction");
      let t = new dt(this.config),
        r = this.config.fields;
      for (let o = 0; o < r.length; o++) {
        let s = r[o];
        t[s.name] = s.apply(e, this[s.name], this, t);
      }
      return t;
    }
    get tr() {
      return new ia(this);
    }
    static create(e) {
      let t = new cr(e.doc ? e.doc.type.schema : e.schema, e.plugins),
        r = new dt(t);
      for (let o = 0; o < t.fields.length; o++)
        r[t.fields[o].name] = t.fields[o].init(e, r);
      return r;
    }
    reconfigure(e) {
      let t = new cr(this.schema, e.plugins),
        r = t.fields,
        o = new dt(t);
      for (let s = 0; s < r.length; s++) {
        let i = r[s].name;
        o[i] = this.hasOwnProperty(i) ? this[i] : r[s].init(e, o);
      }
      return o;
    }
    toJSON(e) {
      let t = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
      if (
        (this.storedMarks &&
          (t.storedMarks = this.storedMarks.map((r) => r.toJSON())),
        e && typeof e == "object")
      )
        for (let r in e) {
          if (r == "doc" || r == "selection")
            throw new RangeError(
              "The JSON fields `doc` and `selection` are reserved",
            );
          let o = e[r],
            s = o.spec.state;
          s && s.toJSON && (t[r] = s.toJSON.call(o, this[o.key]));
        }
      return t;
    }
    static fromJSON(e, t, r) {
      if (!t) throw new RangeError("Invalid input for EditorState.fromJSON");
      if (!e.schema)
        throw new RangeError("Required config field 'schema' missing");
      let o = new cr(e.schema, e.plugins),
        s = new dt(o);
      return (
        o.fields.forEach((i) => {
          if (i.name == "doc") s.doc = Je.fromJSON(e.schema, t.doc);
          else if (i.name == "selection")
            s.selection = T.fromJSON(s.doc, t.selection);
          else if (i.name == "storedMarks")
            t.storedMarks &&
              (s.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
          else {
            if (r)
              for (let l in r) {
                let c = r[l],
                  a = c.spec.state;
                if (
                  c.key == i.name &&
                  a &&
                  a.fromJSON &&
                  Object.prototype.hasOwnProperty.call(t, l)
                ) {
                  s[i.name] = a.fromJSON.call(c, e, t[l], s);
                  return;
                }
              }
            s[i.name] = i.init(e, s);
          }
        }),
        s
      );
    }
  }
  function ks(n, e, t) {
    for (let r in n) {
      let o = n[r];
      o instanceof Function
        ? (o = o.bind(e))
        : r == "handleDOMEvents" && (o = ks(o, e, {})),
        (t[r] = o);
    }
    return t;
  }
  class Me {
    constructor(e) {
      (this.spec = e),
        (this.props = {}),
        e.props && ks(e.props, this, this.props),
        (this.key = e.key ? e.key.key : xs("plugin"));
    }
    getState(e) {
      return e[this.key];
    }
  }
  const ar = Object.create(null);
  function xs(n) {
    return n in ar ? n + "$" + ++ar[n] : ((ar[n] = 0), n + "$");
  }
  class ws {
    constructor(e = "key") {
      this.key = xs(e);
    }
    get(e) {
      return e.config.pluginsByKey[this.key];
    }
    getState(e) {
      return e[this.key];
    }
  }
  const W = function (n) {
      for (var e = 0; ; e++) if (((n = n.previousSibling), !n)) return e;
    },
    Ot = function (n) {
      let e = n.assignedSlot || n.parentNode;
      return e && e.nodeType == 11 ? e.host : e;
    };
  let vs = null;
  const Ce = function (n, e, t) {
      let r = vs || (vs = document.createRange());
      return r.setEnd(n, t ?? n.nodeValue.length), r.setStart(n, e || 0), r;
    },
    Ke = function (n, e, t, r) {
      return t && (Cs(n, e, t, r, -1) || Cs(n, e, t, r, 1));
    },
    ca = /^(img|br|input|textarea|hr)$/i;
  function Cs(n, e, t, r, o) {
    for (;;) {
      if (n == t && e == r) return !0;
      if (e == (o < 0 ? 0 : ge(n))) {
        let s = n.parentNode;
        if (
          !s ||
          s.nodeType != 1 ||
          ur(n) ||
          ca.test(n.nodeName) ||
          n.contentEditable == "false"
        )
          return !1;
        (e = W(n) + (o < 0 ? 0 : 1)), (n = s);
      } else if (n.nodeType == 1) {
        if (
          ((n = n.childNodes[e + (o < 0 ? -1 : 0)]),
          n.contentEditable == "false")
        )
          return !1;
        e = o < 0 ? ge(n) : 0;
      } else return !1;
    }
  }
  function ge(n) {
    return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
  }
  function aa(n, e, t) {
    for (let r = e == 0, o = e == ge(n); r || o; ) {
      if (n == t) return !0;
      let s = W(n);
      if (((n = n.parentNode), !n)) return !1;
      (r = r && s == 0), (o = o && s == ge(n));
    }
  }
  function ur(n) {
    let e;
    for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode);
    return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
  }
  const mn = function (n) {
    return (
      n.focusNode &&
      Ke(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset)
    );
  };
  function Ze(n, e) {
    let t = document.createEvent("Event");
    return (
      t.initEvent("keydown", !0, !0), (t.keyCode = n), (t.key = t.code = e), t
    );
  }
  function ua(n) {
    let e = n.activeElement;
    for (; e && e.shadowRoot; ) e = e.shadowRoot.activeElement;
    return e;
  }
  function fa(n, e, t) {
    if (n.caretPositionFromPoint)
      try {
        let r = n.caretPositionFromPoint(e, t);
        if (r) return { node: r.offsetNode, offset: r.offset };
      } catch {}
    if (n.caretRangeFromPoint) {
      let r = n.caretRangeFromPoint(e, t);
      if (r) return { node: r.startContainer, offset: r.startOffset };
    }
  }
  const be = typeof navigator < "u" ? navigator : null,
    Ss = typeof document < "u" ? document : null,
    Te = (be && be.userAgent) || "",
    fr = /Edge\/(\d+)/.exec(Te),
    Ds = /MSIE \d/.exec(Te),
    hr = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Te),
    X = !!(Ds || hr || fr),
    qe = Ds ? document.documentMode : hr ? +hr[1] : fr ? +fr[1] : 0,
    ue = !X && /gecko\/(\d+)/i.test(Te);
  ue && +(/Firefox\/(\d+)/.exec(Te) || [0, 0])[1];
  const pr = !X && /Chrome\/(\d+)/.exec(Te),
    j = !!pr,
    ha = pr ? +pr[1] : 0,
    K = !X && !!be && /Apple Computer/.test(be.vendor),
    mt = K && (/Mobile\/\w+/.test(Te) || (!!be && be.maxTouchPoints > 2)),
    se = mt || (be ? /Mac/.test(be.platform) : !1),
    pa = be ? /Win/.test(be.platform) : !1,
    fe = /Android \d/.test(Te),
    Rt = !!Ss && "webkitFontSmoothing" in Ss.documentElement.style,
    da = Rt
      ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1]
      : 0;
  function ma(n) {
    return {
      left: 0,
      right: n.documentElement.clientWidth,
      top: 0,
      bottom: n.documentElement.clientHeight,
    };
  }
  function Se(n, e) {
    return typeof n == "number" ? n : n[e];
  }
  function ga(n) {
    let e = n.getBoundingClientRect(),
      t = e.width / n.offsetWidth || 1,
      r = e.height / n.offsetHeight || 1;
    return {
      left: e.left,
      right: e.left + n.clientWidth * t,
      top: e.top,
      bottom: e.top + n.clientHeight * r,
    };
  }
  function Es(n, e, t) {
    let r = n.someProp("scrollThreshold") || 0,
      o = n.someProp("scrollMargin") || 5,
      s = n.dom.ownerDocument;
    for (let i = t || n.dom; i; i = Ot(i)) {
      if (i.nodeType != 1) continue;
      let l = i,
        c = l == s.body,
        a = c ? ma(s) : ga(l),
        u = 0,
        f = 0;
      if (
        (e.top < a.top + Se(r, "top")
          ? (f = -(a.top - e.top + Se(o, "top")))
          : e.bottom > a.bottom - Se(r, "bottom") &&
            (f =
              e.bottom - e.top > a.bottom - a.top
                ? e.top + Se(o, "top") - a.top
                : e.bottom - a.bottom + Se(o, "bottom")),
        e.left < a.left + Se(r, "left")
          ? (u = -(a.left - e.left + Se(o, "left")))
          : e.right > a.right - Se(r, "right") &&
            (u = e.right - a.right + Se(o, "right")),
        u || f)
      )
        if (c) s.defaultView.scrollBy(u, f);
        else {
          let h = l.scrollLeft,
            p = l.scrollTop;
          f && (l.scrollTop += f), u && (l.scrollLeft += u);
          let d = l.scrollLeft - h,
            m = l.scrollTop - p;
          e = {
            left: e.left - d,
            top: e.top - m,
            right: e.right - d,
            bottom: e.bottom - m,
          };
        }
      if (c || /^(fixed|sticky)$/.test(getComputedStyle(i).position)) break;
    }
  }
  function ba(n) {
    let e = n.dom.getBoundingClientRect(),
      t = Math.max(0, e.top),
      r,
      o;
    for (
      let s = (e.left + e.right) / 2, i = t + 1;
      i < Math.min(innerHeight, e.bottom);
      i += 5
    ) {
      let l = n.root.elementFromPoint(s, i);
      if (!l || l == n.dom || !n.dom.contains(l)) continue;
      let c = l.getBoundingClientRect();
      if (c.top >= t - 20) {
        (r = l), (o = c.top);
        break;
      }
    }
    return { refDOM: r, refTop: o, stack: As(n.dom) };
  }
  function As(n) {
    let e = [],
      t = n.ownerDocument;
    for (
      let r = n;
      r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t);
      r = Ot(r)
    );
    return e;
  }
  function ya({ refDOM: n, refTop: e, stack: t }) {
    let r = n ? n.getBoundingClientRect().top : 0;
    _s(t, r == 0 ? 0 : r - e);
  }
  function _s(n, e) {
    for (let t = 0; t < n.length; t++) {
      let { dom: r, top: o, left: s } = n[t];
      r.scrollTop != o + e && (r.scrollTop = o + e),
        r.scrollLeft != s && (r.scrollLeft = s);
    }
  }
  let gt = null;
  function ka(n) {
    if (n.setActive) return n.setActive();
    if (gt) return n.focus(gt);
    let e = As(n);
    n.focus(
      gt == null
        ? {
            get preventScroll() {
              return (gt = { preventScroll: !0 }), !0;
            },
          }
        : void 0,
    ),
      gt || ((gt = !1), _s(e, 0));
  }
  function Ms(n, e) {
    let t,
      r = 2e8,
      o,
      s = 0,
      i = e.top,
      l = e.top,
      c,
      a;
    for (let u = n.firstChild, f = 0; u; u = u.nextSibling, f++) {
      let h;
      if (u.nodeType == 1) h = u.getClientRects();
      else if (u.nodeType == 3) h = Ce(u).getClientRects();
      else continue;
      for (let p = 0; p < h.length; p++) {
        let d = h[p];
        if (d.top <= i && d.bottom >= l) {
          (i = Math.max(d.bottom, i)), (l = Math.min(d.top, l));
          let m =
            d.left > e.left
              ? d.left - e.left
              : d.right < e.left
                ? e.left - d.right
                : 0;
          if (m < r) {
            (t = u),
              (r = m),
              (o =
                m && t.nodeType == 3
                  ? { left: d.right < e.left ? d.right : d.left, top: e.top }
                  : e),
              u.nodeType == 1 &&
                m &&
                (s = f + (e.left >= (d.left + d.right) / 2 ? 1 : 0));
            continue;
          }
        } else
          d.top > e.top &&
            !c &&
            d.left <= e.left &&
            d.right >= e.left &&
            ((c = u),
            (a = {
              left: Math.max(d.left, Math.min(d.right, e.left)),
              top: d.top,
            }));
        !t &&
          ((e.left >= d.right && e.top >= d.top) ||
            (e.left >= d.left && e.top >= d.bottom)) &&
          (s = f + 1);
      }
    }
    return (
      !t && c && ((t = c), (o = a), (r = 0)),
      t && t.nodeType == 3
        ? xa(t, o)
        : !t || (r && t.nodeType == 1)
          ? { node: n, offset: s }
          : Ms(t, o)
    );
  }
  function xa(n, e) {
    let t = n.nodeValue.length,
      r = document.createRange();
    for (let o = 0; o < t; o++) {
      r.setEnd(n, o + 1), r.setStart(n, o);
      let s = Ne(r, 1);
      if (s.top != s.bottom && dr(e, s))
        return {
          node: n,
          offset: o + (e.left >= (s.left + s.right) / 2 ? 1 : 0),
        };
    }
    return { node: n, offset: 0 };
  }
  function dr(n, e) {
    return (
      n.left >= e.left - 1 &&
      n.left <= e.right + 1 &&
      n.top >= e.top - 1 &&
      n.top <= e.bottom + 1
    );
  }
  function wa(n, e) {
    let t = n.parentNode;
    return t &&
      /^li$/i.test(t.nodeName) &&
      e.left < n.getBoundingClientRect().left
      ? t
      : n;
  }
  function va(n, e, t) {
    let { node: r, offset: o } = Ms(e, t),
      s = -1;
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
      if (!l) return null;
      if (
        l.dom.nodeType == 1 &&
        ((l.node.isBlock && l.parent && !i) || !l.contentDOM)
      ) {
        let c = l.dom.getBoundingClientRect();
        if (
          (l.node.isBlock &&
            l.parent &&
            !i &&
            ((i = !0),
            c.left > r.left || c.top > r.top
              ? (o = l.posBefore)
              : (c.right < r.left || c.bottom < r.top) && (o = l.posAfter)),
          !l.contentDOM && o < 0 && !l.node.isText)
        )
          return (
            l.node.isBlock
              ? r.top < (c.top + c.bottom) / 2
              : r.left < (c.left + c.right) / 2
          )
            ? l.posBefore
            : l.posAfter;
      }
      s = l.dom.parentNode;
    }
    return o > -1 ? o : n.docView.posFromDOM(e, t, -1);
  }
  function Ts(n, e, t) {
    let r = n.childNodes.length;
    if (r && t.top < t.bottom)
      for (
        let o = Math.max(
            0,
            Math.min(
              r - 1,
              Math.floor((r * (e.top - t.top)) / (t.bottom - t.top)) - 2,
            ),
          ),
          s = o;
        ;

      ) {
        let i = n.childNodes[s];
        if (i.nodeType == 1) {
          let l = i.getClientRects();
          for (let c = 0; c < l.length; c++) {
            let a = l[c];
            if (dr(e, a)) return Ts(i, e, a);
          }
        }
        if ((s = (s + 1) % r) == o) break;
      }
    return n;
  }
  function Sa(n, e) {
    let t = n.dom.ownerDocument,
      r,
      o = 0,
      s = fa(t, e.left, e.top);
    s && ({ node: r, offset: o } = s);
    let i = (n.root.elementFromPoint ? n.root : t).elementFromPoint(
        e.left,
        e.top,
      ),
      l;
    if (!i || !n.dom.contains(i.nodeType != 1 ? i.parentNode : i)) {
      let a = n.dom.getBoundingClientRect();
      if (!dr(e, a) || ((i = Ts(n.dom, e, a)), !i)) return null;
    }
    if (K) for (let a = i; r && a; a = Ot(a)) a.draggable && (r = void 0);
    if (((i = wa(i, e)), r)) {
      if (
        ue &&
        r.nodeType == 1 &&
        ((o = Math.min(o, r.childNodes.length)), o < r.childNodes.length)
      ) {
        let u = r.childNodes[o],
          f;
        u.nodeName == "IMG" &&
          (f = u.getBoundingClientRect()).right <= e.left &&
          f.bottom > e.top &&
          o++;
      }
      let a;
      Rt &&
        o &&
        r.nodeType == 1 &&
        (a = r.childNodes[o - 1]).nodeType == 1 &&
        a.contentEditable == "false" &&
        a.getBoundingClientRect().top >= e.top &&
        o--,
        r == n.dom &&
        o == r.childNodes.length - 1 &&
        r.lastChild.nodeType == 1 &&
        e.top > r.lastChild.getBoundingClientRect().bottom
          ? (l = n.state.doc.content.size)
          : (o == 0 ||
              r.nodeType != 1 ||
              r.childNodes[o - 1].nodeName != "BR") &&
            (l = Ca(n, r, o, e));
    }
    l == null && (l = va(n, i, e));
    let c = n.docView.nearestDesc(i, !0);
    return { pos: l, inside: c ? c.posAtStart - c.border : -1 };
  }
  function qs(n) {
    return n.top < n.bottom || n.left < n.right;
  }
  function Ne(n, e) {
    let t = n.getClientRects();
    if (t.length) {
      let r = t[e < 0 ? 0 : t.length - 1];
      if (qs(r)) return r;
    }
    return Array.prototype.find.call(t, qs) || n.getBoundingClientRect();
  }
  const Da = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
  function Ns(n, e, t) {
    let {
        node: r,
        offset: o,
        atom: s,
      } = n.docView.domFromPos(e, t < 0 ? -1 : 1),
      i = Rt || ue;
    if (r.nodeType == 3)
      if (
        i &&
        (Da.test(r.nodeValue) || (t < 0 ? !o : o == r.nodeValue.length))
      ) {
        let c = Ne(Ce(r, o, o), t);
        if (
          ue &&
          o &&
          /\s/.test(r.nodeValue[o - 1]) &&
          o < r.nodeValue.length
        ) {
          let a = Ne(Ce(r, o - 1, o - 1), -1);
          if (a.top == c.top) {
            let u = Ne(Ce(r, o, o + 1), -1);
            if (u.top != c.top) return It(u, u.left < a.left);
          }
        }
        return c;
      } else {
        let c = o,
          a = o,
          u = t < 0 ? 1 : -1;
        return (
          t < 0 && !o
            ? (a++, (u = -1))
            : t >= 0 && o == r.nodeValue.length
              ? (c--, (u = 1))
              : t < 0
                ? c--
                : a++,
          It(Ne(Ce(r, c, a), u), u < 0)
        );
      }
    if (!n.state.doc.resolve(e - (s || 0)).parent.inlineContent) {
      if (s == null && o && (t < 0 || o == ge(r))) {
        let c = r.childNodes[o - 1];
        if (c.nodeType == 1) return mr(c.getBoundingClientRect(), !1);
      }
      if (s == null && o < ge(r)) {
        let c = r.childNodes[o];
        if (c.nodeType == 1) return mr(c.getBoundingClientRect(), !0);
      }
      return mr(r.getBoundingClientRect(), t >= 0);
    }
    if (s == null && o && (t < 0 || o == ge(r))) {
      let c = r.childNodes[o - 1],
        a =
          c.nodeType == 3
            ? Ce(c, ge(c) - (i ? 0 : 1))
            : c.nodeType == 1 && (c.nodeName != "BR" || !c.nextSibling)
              ? c
              : null;
      if (a) return It(Ne(a, 1), !1);
    }
    if (s == null && o < ge(r)) {
      let c = r.childNodes[o];
      for (; c.pmViewDesc && c.pmViewDesc.ignoreForCoords; ) c = c.nextSibling;
      let a = c
        ? c.nodeType == 3
          ? Ce(c, 0, i ? 0 : 1)
          : c.nodeType == 1
            ? c
            : null
        : null;
      if (a) return It(Ne(a, -1), !0);
    }
    return It(Ne(r.nodeType == 3 ? Ce(r) : r, -t), t >= 0);
  }
  function It(n, e) {
    if (n.width == 0) return n;
    let t = e ? n.left : n.right;
    return { top: n.top, bottom: n.bottom, left: t, right: t };
  }
  function mr(n, e) {
    if (n.height == 0) return n;
    let t = e ? n.top : n.bottom;
    return { top: t, bottom: t, left: n.left, right: n.right };
  }
  function Os(n, e, t) {
    let r = n.state,
      o = n.root.activeElement;
    r != e && n.updateState(e), o != n.dom && n.focus();
    try {
      return t();
    } finally {
      r != e && n.updateState(r), o != n.dom && o && o.focus();
    }
  }
  function Ea(n, e, t) {
    let r = e.selection,
      o = t == "up" ? r.$from : r.$to;
    return Os(n, e, () => {
      let { node: s } = n.docView.domFromPos(o.pos, t == "up" ? -1 : 1);
      for (;;) {
        let l = n.docView.nearestDesc(s, !0);
        if (!l) break;
        if (l.node.isBlock) {
          s = l.contentDOM || l.dom;
          break;
        }
        s = l.dom.parentNode;
      }
      let i = Ns(n, o.pos, 1);
      for (let l = s.firstChild; l; l = l.nextSibling) {
        let c;
        if (l.nodeType == 1) c = l.getClientRects();
        else if (l.nodeType == 3)
          c = Ce(l, 0, l.nodeValue.length).getClientRects();
        else continue;
        for (let a = 0; a < c.length; a++) {
          let u = c[a];
          if (
            u.bottom > u.top + 1 &&
            (t == "up"
              ? i.top - u.top > (u.bottom - i.top) * 2
              : u.bottom - i.bottom > (i.bottom - u.top) * 2)
          )
            return !1;
        }
      }
      return !0;
    });
  }
  const Aa = /[\u0590-\u08ac]/;
  function _a(n, e, t) {
    let { $head: r } = e.selection;
    if (!r.parent.isTextblock) return !1;
    let o = r.parentOffset,
      s = !o,
      i = o == r.parent.content.size,
      l = n.domSelection();
    return !Aa.test(r.parent.textContent) || !l.modify
      ? t == "left" || t == "backward"
        ? s
        : i
      : Os(n, e, () => {
          let {
              focusNode: c,
              focusOffset: a,
              anchorNode: u,
              anchorOffset: f,
            } = n.domSelectionRange(),
            h = l.caretBidiLevel;
          l.modify("move", t, "character");
          let p = r.depth ? n.docView.domAfterPos(r.before()) : n.dom,
            { focusNode: d, focusOffset: m } = n.domSelectionRange(),
            g =
              (d && !p.contains(d.nodeType == 1 ? d : d.parentNode)) ||
              (c == d && a == m);
          try {
            l.collapse(u, f),
              c && (c != u || a != f) && l.extend && l.extend(c, a);
          } catch {}
          return h != null && (l.caretBidiLevel = h), g;
        });
  }
  let Rs = null,
    Is = null,
    Ls = !1;
  function Ma(n, e, t) {
    return Rs == e && Is == t
      ? Ls
      : ((Rs = e),
        (Is = t),
        (Ls = t == "up" || t == "down" ? Ea(n, e, t) : _a(n, e, t)));
  }
  const ie = 0,
    zs = 1,
    Ye = 2,
    ye = 3;
  class Lt {
    constructor(e, t, r, o) {
      (this.parent = e),
        (this.children = t),
        (this.dom = r),
        (this.contentDOM = o),
        (this.dirty = ie),
        (r.pmViewDesc = this);
    }
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
    parseRule() {
      return null;
    }
    stopEvent(e) {
      return !1;
    }
    get size() {
      let e = 0;
      for (let t = 0; t < this.children.length; t++) e += this.children[t].size;
      return e;
    }
    get border() {
      return 0;
    }
    destroy() {
      (this.parent = void 0),
        this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
      for (let e = 0; e < this.children.length; e++) this.children[e].destroy();
    }
    posBeforeChild(e) {
      for (let t = 0, r = this.posAtStart; ; t++) {
        let o = this.children[t];
        if (o == e) return r;
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
      if (
        this.contentDOM &&
        this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode)
      )
        if (r < 0) {
          let s, i;
          if (e == this.contentDOM) s = e.childNodes[t - 1];
          else {
            for (; e.parentNode != this.contentDOM; ) e = e.parentNode;
            s = e.previousSibling;
          }
          for (; s && !((i = s.pmViewDesc) && i.parent == this); )
            s = s.previousSibling;
          return s ? this.posBeforeChild(i) + i.size : this.posAtStart;
        } else {
          let s, i;
          if (e == this.contentDOM) s = e.childNodes[t];
          else {
            for (; e.parentNode != this.contentDOM; ) e = e.parentNode;
            s = e.nextSibling;
          }
          for (; s && !((i = s.pmViewDesc) && i.parent == this); )
            s = s.nextSibling;
          return s ? this.posBeforeChild(i) : this.posAtEnd;
        }
      let o;
      if (e == this.dom && this.contentDOM) o = t > W(this.contentDOM);
      else if (
        this.contentDOM &&
        this.contentDOM != this.dom &&
        this.dom.contains(this.contentDOM)
      )
        o = e.compareDocumentPosition(this.contentDOM) & 2;
      else if (this.dom.firstChild) {
        if (t == 0)
          for (let s = e; ; s = s.parentNode) {
            if (s == this.dom) {
              o = !1;
              break;
            }
            if (s.previousSibling) break;
          }
        if (o == null && t == e.childNodes.length)
          for (let s = e; ; s = s.parentNode) {
            if (s == this.dom) {
              o = !0;
              break;
            }
            if (s.nextSibling) break;
          }
      }
      return o ?? r > 0 ? this.posAtEnd : this.posAtStart;
    }
    nearestDesc(e, t = !1) {
      for (let r = !0, o = e; o; o = o.parentNode) {
        let s = this.getDesc(o),
          i;
        if (s && (!t || s.node))
          if (
            r &&
            (i = s.nodeDOM) &&
            !(i.nodeType == 1
              ? i.contains(e.nodeType == 1 ? e : e.parentNode)
              : i == e)
          )
            r = !1;
          else return s;
      }
    }
    getDesc(e) {
      let t = e.pmViewDesc;
      for (let r = t; r; r = r.parent) if (r == this) return t;
    }
    posFromDOM(e, t, r) {
      for (let o = e; o; o = o.parentNode) {
        let s = this.getDesc(o);
        if (s) return s.localPosFromDOM(e, t, r);
      }
      return -1;
    }
    descAt(e) {
      for (let t = 0, r = 0; t < this.children.length; t++) {
        let o = this.children[t],
          s = r + o.size;
        if (r == e && s != r) {
          for (; !o.border && o.children.length; ) o = o.children[0];
          return o;
        }
        if (e < s) return o.descAt(e - r - o.border);
        r = s;
      }
    }
    domFromPos(e, t) {
      if (!this.contentDOM) return { node: this.dom, offset: 0, atom: e + 1 };
      let r = 0,
        o = 0;
      for (let s = 0; r < this.children.length; r++) {
        let i = this.children[r],
          l = s + i.size;
        if (l > e || i instanceof Ps) {
          o = e - s;
          break;
        }
        s = l;
      }
      if (o) return this.children[r].domFromPos(o - this.children[r].border, t);
      for (
        let s;
        r && !(s = this.children[r - 1]).size && s instanceof Fs && s.side >= 0;
        r--
      );
      if (t <= 0) {
        let s,
          i = !0;
        for (
          ;
          (s = r ? this.children[r - 1] : null),
            !(!s || s.dom.parentNode == this.contentDOM);
          r--, i = !1
        );
        return s && t && i && !s.border && !s.domAtom
          ? s.domFromPos(s.size, t)
          : { node: this.contentDOM, offset: s ? W(s.dom) + 1 : 0 };
      } else {
        let s,
          i = !0;
        for (
          ;
          (s = r < this.children.length ? this.children[r] : null),
            !(!s || s.dom.parentNode == this.contentDOM);
          r++, i = !1
        );
        return s && i && !s.border && !s.domAtom
          ? s.domFromPos(0, t)
          : {
              node: this.contentDOM,
              offset: s ? W(s.dom) : this.contentDOM.childNodes.length,
            };
      }
    }
    parseRange(e, t, r = 0) {
      if (this.children.length == 0)
        return {
          node: this.contentDOM,
          from: e,
          to: t,
          fromOffset: 0,
          toOffset: this.contentDOM.childNodes.length,
        };
      let o = -1,
        s = -1;
      for (let i = r, l = 0; ; l++) {
        let c = this.children[l],
          a = i + c.size;
        if (o == -1 && e <= a) {
          let u = i + c.border;
          if (
            e >= u &&
            t <= a - c.border &&
            c.node &&
            c.contentDOM &&
            this.contentDOM.contains(c.contentDOM)
          )
            return c.parseRange(e, t, u);
          e = i;
          for (let f = l; f > 0; f--) {
            let h = this.children[f - 1];
            if (
              h.size &&
              h.dom.parentNode == this.contentDOM &&
              !h.emptyChildAt(1)
            ) {
              o = W(h.dom) + 1;
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
            if (
              f.size &&
              f.dom.parentNode == this.contentDOM &&
              !f.emptyChildAt(-1)
            ) {
              s = W(f.dom);
              break;
            }
            t += f.size;
          }
          s == -1 && (s = this.contentDOM.childNodes.length);
          break;
        }
        i = a;
      }
      return {
        node: this.contentDOM,
        from: e,
        to: t,
        fromOffset: o,
        toOffset: s,
      };
    }
    emptyChildAt(e) {
      if (this.border || !this.contentDOM || !this.children.length) return !1;
      let t = this.children[e < 0 ? 0 : this.children.length - 1];
      return t.size == 0 || t.emptyChildAt(e);
    }
    domAfterPos(e) {
      let { node: t, offset: r } = this.domFromPos(e, 0);
      if (t.nodeType != 1 || r == t.childNodes.length)
        throw new RangeError("No node after pos " + e);
      return t.childNodes[r];
    }
    setSelection(e, t, r, o = !1) {
      let s = Math.min(e, t),
        i = Math.max(e, t);
      for (let h = 0, p = 0; h < this.children.length; h++) {
        let d = this.children[h],
          m = p + d.size;
        if (s > p && i < m)
          return d.setSelection(e - p - d.border, t - p - d.border, r, o);
        p = m;
      }
      let l = this.domFromPos(e, e ? -1 : 1),
        c = t == e ? l : this.domFromPos(t, t ? -1 : 1),
        a = r.getSelection(),
        u = !1;
      if ((ue || K) && e == t) {
        let { node: h, offset: p } = l;
        if (h.nodeType == 3) {
          if (
            ((u = !!(
              p &&
              h.nodeValue[p - 1] ==
                `
`
            )),
            u && p == h.nodeValue.length)
          )
            for (let d = h, m; d; d = d.parentNode) {
              if ((m = d.nextSibling)) {
                m.nodeName == "BR" &&
                  (l = c = { node: m.parentNode, offset: W(m) + 1 });
                break;
              }
              let g = d.pmViewDesc;
              if (g && g.node && g.node.isBlock) break;
            }
        } else {
          let d = h.childNodes[p - 1];
          u = d && (d.nodeName == "BR" || d.contentEditable == "false");
        }
      }
      if (
        ue &&
        a.focusNode &&
        a.focusNode != c.node &&
        a.focusNode.nodeType == 1
      ) {
        let h = a.focusNode.childNodes[a.focusOffset];
        h && h.contentEditable == "false" && (o = !0);
      }
      if (
        !(o || (u && K)) &&
        Ke(l.node, l.offset, a.anchorNode, a.anchorOffset) &&
        Ke(c.node, c.offset, a.focusNode, a.focusOffset)
      )
        return;
      let f = !1;
      if ((a.extend || e == t) && !u) {
        a.collapse(l.node, l.offset);
        try {
          e != t && a.extend(c.node, c.offset), (f = !0);
        } catch {}
      }
      if (!f) {
        if (e > t) {
          let p = l;
          (l = c), (c = p);
        }
        let h = document.createRange();
        h.setEnd(c.node, c.offset),
          h.setStart(l.node, l.offset),
          a.removeAllRanges(),
          a.addRange(h);
      }
    }
    ignoreMutation(e) {
      return !this.contentDOM && e.type != "selection";
    }
    get contentLost() {
      return (
        this.contentDOM &&
        this.contentDOM != this.dom &&
        !this.dom.contains(this.contentDOM)
      );
    }
    markDirty(e, t) {
      for (let r = 0, o = 0; o < this.children.length; o++) {
        let s = this.children[o],
          i = r + s.size;
        if (r == i ? e <= i && t >= r : e < i && t > r) {
          let l = r + s.border,
            c = i - s.border;
          if (e >= l && t <= c) {
            (this.dirty = e == r || t == i ? Ye : zs),
              e == l &&
              t == c &&
              (s.contentLost || s.dom.parentNode != this.contentDOM)
                ? (s.dirty = ye)
                : s.markDirty(e - l, t - l);
            return;
          } else
            s.dirty =
              s.dom == s.contentDOM &&
              s.dom.parentNode == this.contentDOM &&
              !s.children.length
                ? Ye
                : ye;
        }
        r = i;
      }
      this.dirty = Ye;
    }
    markParentsDirty() {
      let e = 1;
      for (let t = this.parent; t; t = t.parent, e++) {
        let r = e == 1 ? Ye : zs;
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
  class Fs extends Lt {
    constructor(e, t, r, o) {
      let s,
        i = t.type.toDOM;
      if (
        (typeof i == "function" &&
          (i = i(r, () => {
            if (!s) return o;
            if (s.parent) return s.parent.posBeforeChild(s);
          })),
        !t.type.spec.raw)
      ) {
        if (i.nodeType != 1) {
          let l = document.createElement("span");
          l.appendChild(i), (i = l);
        }
        (i.contentEditable = "false"), i.classList.add("ProseMirror-widget");
      }
      super(e, [], i, null), (this.widget = t), (this.widget = t), (s = this);
    }
    matchesWidget(e) {
      return this.dirty == ie && e.type.eq(this.widget.type);
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
  class Ta extends Lt {
    constructor(e, t, r, o) {
      super(e, [], t, null), (this.textDOM = r), (this.text = o);
    }
    get size() {
      return this.text.length;
    }
    localPosFromDOM(e, t) {
      return e != this.textDOM
        ? this.posAtStart + (t ? this.size : 0)
        : this.posAtStart + t;
    }
    domFromPos(e) {
      return { node: this.textDOM, offset: e };
    }
    ignoreMutation(e) {
      return e.type === "characterData" && e.target.nodeValue == e.oldValue;
    }
  }
  class Qe extends Lt {
    constructor(e, t, r, o) {
      super(e, [], r, o), (this.mark = t);
    }
    static create(e, t, r, o) {
      let s = o.nodeViews[t.type.name],
        i = s && s(t, o, r);
      return (
        (!i || !i.dom) &&
          (i = ve.renderSpec(document, t.type.spec.toDOM(t, r))),
        new Qe(e, t, i.dom, i.contentDOM || i.dom)
      );
    }
    parseRule() {
      return this.dirty & ye || this.mark.type.spec.reparseInView
        ? null
        : {
            mark: this.mark.type.name,
            attrs: this.mark.attrs,
            contentElement: this.contentDOM,
          };
    }
    matchesMark(e) {
      return this.dirty != ye && this.mark.eq(e);
    }
    markDirty(e, t) {
      if ((super.markDirty(e, t), this.dirty != ie)) {
        let r = this.parent;
        for (; !r.node; ) r = r.parent;
        r.dirty < this.dirty && (r.dirty = this.dirty), (this.dirty = ie);
      }
    }
    slice(e, t, r) {
      let o = Qe.create(this.parent, this.mark, !0, r),
        s = this.children,
        i = this.size;
      t < i && (s = yr(s, t, i, r)), e > 0 && (s = yr(s, 0, e, r));
      for (let l = 0; l < s.length; l++) s[l].parent = o;
      return (o.children = s), o;
    }
  }
  class Oe extends Lt {
    constructor(e, t, r, o, s, i, l, c, a) {
      super(e, [], s, i),
        (this.node = t),
        (this.outerDeco = r),
        (this.innerDeco = o),
        (this.nodeDOM = l);
    }
    static create(e, t, r, o, s, i) {
      let l = s.nodeViews[t.type.name],
        c,
        a =
          l &&
          l(
            t,
            s,
            () => {
              if (!c) return i;
              if (c.parent) return c.parent.posBeforeChild(c);
            },
            r,
            o,
          ),
        u = a && a.dom,
        f = a && a.contentDOM;
      if (t.isText) {
        if (!u) u = document.createTextNode(t.text);
        else if (u.nodeType != 3)
          throw new RangeError("Text must be rendered as a DOM text node");
      } else
        u ||
          ({ dom: u, contentDOM: f } = ve.renderSpec(
            document,
            t.type.spec.toDOM(t),
          ));
      !f &&
        !t.isText &&
        u.nodeName != "BR" &&
        (u.hasAttribute("contenteditable") || (u.contentEditable = "false"),
        t.type.spec.draggable && (u.draggable = !0));
      let h = u;
      return (
        (u = Us(u, r, t)),
        a
          ? (c = new qa(e, t, r, o, u, f || null, h, a, s, i + 1))
          : t.isText
            ? new gn(e, t, r, o, u, h, s)
            : new Oe(e, t, r, o, u, f || null, h, s, i + 1)
      );
    }
    parseRule() {
      if (this.node.type.spec.reparseInView) return null;
      let e = { node: this.node.type.name, attrs: this.node.attrs };
      if (
        (this.node.type.whitespace == "pre" && (e.preserveWhitespace = "full"),
        !this.contentDOM)
      )
        e.getContent = () => this.node.content;
      else if (!this.contentLost) e.contentElement = this.contentDOM;
      else {
        for (let t = this.children.length - 1; t >= 0; t--) {
          let r = this.children[t];
          if (this.dom.contains(r.dom.parentNode)) {
            e.contentElement = r.dom.parentNode;
            break;
          }
        }
        e.contentElement || (e.getContent = () => y.empty);
      }
      return e;
    }
    matchesNode(e, t, r) {
      return (
        this.dirty == ie &&
        e.eq(this.node) &&
        br(t, this.outerDeco) &&
        r.eq(this.innerDeco)
      );
    }
    get size() {
      return this.node.nodeSize;
    }
    get border() {
      return this.node.isLeaf ? 0 : 1;
    }
    updateChildren(e, t) {
      let r = this.node.inlineContent,
        o = t,
        s = e.composing ? this.localCompositionInfo(e, t) : null,
        i = s && s.pos > -1 ? s : null,
        l = s && s.pos < 0,
        c = new Oa(this, i && i.node, e);
      La(
        this.node,
        this.innerDeco,
        (a, u, f) => {
          a.spec.marks
            ? c.syncToMarks(a.spec.marks, r, e)
            : a.type.side >= 0 &&
              !f &&
              c.syncToMarks(
                u == this.node.childCount ? q.none : this.node.child(u).marks,
                r,
                e,
              ),
            c.placeWidget(a, e, o);
        },
        (a, u, f, h) => {
          c.syncToMarks(a.marks, r, e);
          let p;
          c.findNodeMatch(a, u, f, h) ||
            (l &&
              e.state.selection.from > o &&
              e.state.selection.to < o + a.nodeSize &&
              (p = c.findIndexWithChild(s.node)) > -1 &&
              c.updateNodeAt(a, u, f, p, e)) ||
            c.updateNextNode(a, u, f, e, h, o) ||
            c.addNode(a, u, f, e, o),
            (o += a.nodeSize);
        },
      ),
        c.syncToMarks([], r, e),
        this.node.isTextblock && c.addTextblockHacks(),
        c.destroyRest(),
        (c.changed || this.dirty == Ye) &&
          (i && this.protectLocalComposition(e, i),
          Vs(this.contentDOM, this.children, e),
          mt && za(this.dom));
    }
    localCompositionInfo(e, t) {
      let { from: r, to: o } = e.state.selection;
      if (
        !(e.state.selection instanceof I) ||
        r < t ||
        o > t + this.node.content.size
      )
        return null;
      let s = e.domSelectionRange(),
        i = Fa(s.focusNode, s.focusOffset);
      if (!i || !this.dom.contains(i.parentNode)) return null;
      if (this.node.inlineContent) {
        let l = i.nodeValue,
          c = Ba(this.node.content, l, r - t, o - t);
        return c < 0 ? null : { node: i, pos: c, text: l };
      } else return { node: i, pos: -1, text: "" };
    }
    protectLocalComposition(e, { node: t, pos: r, text: o }) {
      if (this.getDesc(t)) return;
      let s = t;
      for (; s.parentNode != this.contentDOM; s = s.parentNode) {
        for (; s.previousSibling; ) s.parentNode.removeChild(s.previousSibling);
        for (; s.nextSibling; ) s.parentNode.removeChild(s.nextSibling);
        s.pmViewDesc && (s.pmViewDesc = void 0);
      }
      let i = new Ta(this, s, t, o);
      e.input.compositionNodes.push(i),
        (this.children = yr(this.children, r, r + o.length, e, i));
    }
    update(e, t, r, o) {
      return this.dirty == ye || !e.sameMarkup(this.node)
        ? !1
        : (this.updateInner(e, t, r, o), !0);
    }
    updateInner(e, t, r, o) {
      this.updateOuterDeco(t),
        (this.node = e),
        (this.innerDeco = r),
        this.contentDOM && this.updateChildren(o, this.posAtStart),
        (this.dirty = ie);
    }
    updateOuterDeco(e) {
      if (br(e, this.outerDeco)) return;
      let t = this.nodeDOM.nodeType != 1,
        r = this.dom;
      (this.dom = $s(
        this.dom,
        this.nodeDOM,
        gr(this.outerDeco, this.node, t),
        gr(e, this.node, t),
      )),
        this.dom != r &&
          ((r.pmViewDesc = void 0), (this.dom.pmViewDesc = this)),
        (this.outerDeco = e);
    }
    selectNode() {
      this.nodeDOM.nodeType == 1 &&
        this.nodeDOM.classList.add("ProseMirror-selectednode"),
        (this.contentDOM || !this.node.type.spec.draggable) &&
          (this.dom.draggable = !0);
    }
    deselectNode() {
      this.nodeDOM.nodeType == 1 &&
        this.nodeDOM.classList.remove("ProseMirror-selectednode"),
        (this.contentDOM || !this.node.type.spec.draggable) &&
          this.dom.removeAttribute("draggable");
    }
    get domAtom() {
      return this.node.isAtom;
    }
  }
  function Bs(n, e, t, r, o) {
    Us(r, e, n);
    let s = new Oe(void 0, n, e, t, r, r, r, o, 0);
    return s.contentDOM && s.updateChildren(o, 0), s;
  }
  class gn extends Oe {
    constructor(e, t, r, o, s, i, l) {
      super(e, t, r, o, s, null, i, l, 0);
    }
    parseRule() {
      let e = this.nodeDOM.parentNode;
      for (; e && e != this.dom && !e.pmIsDeco; ) e = e.parentNode;
      return { skip: e || !0 };
    }
    update(e, t, r, o) {
      return this.dirty == ye ||
        (this.dirty != ie && !this.inParent()) ||
        !e.sameMarkup(this.node)
        ? !1
        : (this.updateOuterDeco(t),
          (this.dirty != ie || e.text != this.node.text) &&
            e.text != this.nodeDOM.nodeValue &&
            ((this.nodeDOM.nodeValue = e.text),
            o.trackWrites == this.nodeDOM && (o.trackWrites = null)),
          (this.node = e),
          (this.dirty = ie),
          !0);
    }
    inParent() {
      let e = this.parent.contentDOM;
      for (let t = this.nodeDOM; t; t = t.parentNode) if (t == e) return !0;
      return !1;
    }
    domFromPos(e) {
      return { node: this.nodeDOM, offset: e };
    }
    localPosFromDOM(e, t, r) {
      return e == this.nodeDOM
        ? this.posAtStart + Math.min(t, this.node.text.length)
        : super.localPosFromDOM(e, t, r);
    }
    ignoreMutation(e) {
      return e.type != "characterData" && e.type != "selection";
    }
    slice(e, t, r) {
      let o = this.node.cut(e, t),
        s = document.createTextNode(o.text);
      return new gn(this.parent, o, this.outerDeco, this.innerDeco, s, s, r);
    }
    markDirty(e, t) {
      super.markDirty(e, t),
        this.dom != this.nodeDOM &&
          (e == 0 || t == this.nodeDOM.nodeValue.length) &&
          (this.dirty = ye);
    }
    get domAtom() {
      return !1;
    }
  }
  class Ps extends Lt {
    parseRule() {
      return { ignore: !0 };
    }
    matchesHack(e) {
      return this.dirty == ie && this.dom.nodeName == e;
    }
    get domAtom() {
      return !0;
    }
    get ignoreForCoords() {
      return this.dom.nodeName == "IMG";
    }
  }
  class qa extends Oe {
    constructor(e, t, r, o, s, i, l, c, a, u) {
      super(e, t, r, o, s, i, l, a, u), (this.spec = c);
    }
    update(e, t, r, o) {
      if (this.dirty == ye) return !1;
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
      this.spec.setSelection
        ? this.spec.setSelection(e, t, r)
        : super.setSelection(e, t, r, o);
    }
    destroy() {
      this.spec.destroy && this.spec.destroy(), super.destroy();
    }
    stopEvent(e) {
      return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
    }
    ignoreMutation(e) {
      return this.spec.ignoreMutation
        ? this.spec.ignoreMutation(e)
        : super.ignoreMutation(e);
    }
  }
  function Vs(n, e, t) {
    let r = n.firstChild,
      o = !1;
    for (let s = 0; s < e.length; s++) {
      let i = e[s],
        l = i.dom;
      if (l.parentNode == n) {
        for (; l != r; ) (r = Hs(r)), (o = !0);
        r = r.nextSibling;
      } else (o = !0), n.insertBefore(l, r);
      if (i instanceof Qe) {
        let c = r ? r.previousSibling : n.lastChild;
        Vs(i.contentDOM, i.children, t), (r = c ? c.nextSibling : n.firstChild);
      }
    }
    for (; r; ) (r = Hs(r)), (o = !0);
    o && t.trackWrites == n && (t.trackWrites = null);
  }
  const zt = function (n) {
    n && (this.nodeName = n);
  };
  zt.prototype = Object.create(null);
  const Xe = [new zt()];
  function gr(n, e, t) {
    if (n.length == 0) return Xe;
    let r = t ? Xe[0] : new zt(),
      o = [r];
    for (let s = 0; s < n.length; s++) {
      let i = n[s].type.attrs;
      if (i) {
        i.nodeName && o.push((r = new zt(i.nodeName)));
        for (let l in i) {
          let c = i[l];
          c != null &&
            (t &&
              o.length == 1 &&
              o.push((r = new zt(e.isInline ? "span" : "div"))),
            l == "class"
              ? (r.class = (r.class ? r.class + " " : "") + c)
              : l == "style"
                ? (r.style = (r.style ? r.style + ";" : "") + c)
                : l != "nodeName" && (r[l] = c));
        }
      }
    }
    return o;
  }
  function $s(n, e, t, r) {
    if (t == Xe && r == Xe) return e;
    let o = e;
    for (let s = 0; s < r.length; s++) {
      let i = r[s],
        l = t[s];
      if (s) {
        let c;
        (l &&
          l.nodeName == i.nodeName &&
          o != n &&
          (c = o.parentNode) &&
          c.nodeName.toLowerCase() == i.nodeName) ||
          ((c = document.createElement(i.nodeName)),
          (c.pmIsDeco = !0),
          c.appendChild(o),
          (l = Xe[0])),
          (o = c);
      }
      Na(o, l || Xe[0], i);
    }
    return o;
  }
  function Na(n, e, t) {
    for (let r in e)
      r != "class" &&
        r != "style" &&
        r != "nodeName" &&
        !(r in t) &&
        n.removeAttribute(r);
    for (let r in t)
      r != "class" &&
        r != "style" &&
        r != "nodeName" &&
        t[r] != e[r] &&
        n.setAttribute(r, t[r]);
    if (e.class != t.class) {
      let r = e.class ? e.class.split(" ").filter(Boolean) : [],
        o = t.class ? t.class.split(" ").filter(Boolean) : [];
      for (let s = 0; s < r.length; s++)
        o.indexOf(r[s]) == -1 && n.classList.remove(r[s]);
      for (let s = 0; s < o.length; s++)
        r.indexOf(o[s]) == -1 && n.classList.add(o[s]);
      n.classList.length == 0 && n.removeAttribute("class");
    }
    if (e.style != t.style) {
      if (e.style) {
        let r =
            /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g,
          o;
        for (; (o = r.exec(e.style)); ) n.style.removeProperty(o[1]);
      }
      t.style && (n.style.cssText += t.style);
    }
  }
  function Us(n, e, t) {
    return $s(n, n, Xe, gr(e, t, n.nodeType != 1));
  }
  function br(n, e) {
    if (n.length != e.length) return !1;
    for (let t = 0; t < n.length; t++) if (!n[t].type.eq(e[t].type)) return !1;
    return !0;
  }
  function Hs(n) {
    let e = n.nextSibling;
    return n.parentNode.removeChild(n), e;
  }
  class Oa {
    constructor(e, t, r) {
      (this.lock = t),
        (this.view = r),
        (this.index = 0),
        (this.stack = []),
        (this.changed = !1),
        (this.top = e),
        (this.preMatch = Ra(e.node.content, e));
    }
    destroyBetween(e, t) {
      if (e != t) {
        for (let r = e; r < t; r++) this.top.children[r].destroy();
        this.top.children.splice(e, t - e), (this.changed = !0);
      }
    }
    destroyRest() {
      this.destroyBetween(this.index, this.top.children.length);
    }
    syncToMarks(e, t, r) {
      let o = 0,
        s = this.stack.length >> 1,
        i = Math.min(s, e.length);
      for (
        ;
        o < i &&
        (o == s - 1 ? this.top : this.stack[(o + 1) << 1]).matchesMark(e[o]) &&
        e[o].type.spec.spanning !== !1;

      )
        o++;
      for (; o < s; )
        this.destroyRest(),
          (this.top.dirty = ie),
          (this.index = this.stack.pop()),
          (this.top = this.stack.pop()),
          s--;
      for (; s < e.length; ) {
        this.stack.push(this.top, this.index + 1);
        let l = -1;
        for (
          let c = this.index;
          c < Math.min(this.index + 3, this.top.children.length);
          c++
        ) {
          let a = this.top.children[c];
          if (a.matchesMark(e[s]) && !this.isLocked(a.dom)) {
            l = c;
            break;
          }
        }
        if (l > -1)
          l > this.index &&
            ((this.changed = !0), this.destroyBetween(this.index, l)),
            (this.top = this.top.children[this.index]);
        else {
          let c = Qe.create(this.top, e[s], t, r);
          this.top.children.splice(this.index, 0, c),
            (this.top = c),
            (this.changed = !0);
        }
        (this.index = 0), s++;
      }
    }
    findNodeMatch(e, t, r, o) {
      let s = -1,
        i;
      if (
        o >= this.preMatch.index &&
        (i = this.preMatch.matches[o - this.preMatch.index]).parent ==
          this.top &&
        i.matchesNode(e, t, r)
      )
        s = this.top.children.indexOf(i, this.index);
      else
        for (
          let l = this.index, c = Math.min(this.top.children.length, l + 5);
          l < c;
          l++
        ) {
          let a = this.top.children[l];
          if (a.matchesNode(e, t, r) && !this.preMatch.matched.has(a)) {
            s = l;
            break;
          }
        }
      return s < 0
        ? !1
        : (this.destroyBetween(this.index, s), this.index++, !0);
    }
    updateNodeAt(e, t, r, o, s) {
      let i = this.top.children[o];
      return (
        i.dirty == ye && i.dom == i.contentDOM && (i.dirty = Ye),
        i.update(e, t, r, s)
          ? (this.destroyBetween(this.index, o), this.index++, !0)
          : !1
      );
    }
    findIndexWithChild(e) {
      for (;;) {
        let t = e.parentNode;
        if (!t) return -1;
        if (t == this.top.contentDOM) {
          let r = e.pmViewDesc;
          if (r) {
            for (let o = this.index; o < this.top.children.length; o++)
              if (this.top.children[o] == r) return o;
          }
          return -1;
        }
        e = t;
      }
    }
    updateNextNode(e, t, r, o, s, i) {
      for (let l = this.index; l < this.top.children.length; l++) {
        let c = this.top.children[l];
        if (c instanceof Oe) {
          let a = this.preMatch.matched.get(c);
          if (a != null && a != s) return !1;
          let u = c.dom,
            f,
            h =
              this.isLocked(u) &&
              !(
                e.isText &&
                c.node &&
                c.node.isText &&
                c.nodeDOM.nodeValue == e.text &&
                c.dirty != ye &&
                br(t, c.outerDeco)
              );
          if (!h && c.update(e, t, r, o))
            return (
              this.destroyBetween(this.index, l),
              c.dom != u && (this.changed = !0),
              this.index++,
              !0
            );
          if (!h && (f = this.recreateWrapper(c, e, t, r, o, i)))
            return (
              (this.top.children[this.index] = f),
              f.contentDOM &&
                ((f.dirty = Ye), f.updateChildren(o, i + 1), (f.dirty = ie)),
              (this.changed = !0),
              this.index++,
              !0
            );
          break;
        }
      }
      return !1;
    }
    recreateWrapper(e, t, r, o, s, i) {
      if (
        e.dirty ||
        t.isAtom ||
        !e.children.length ||
        !e.node.content.eq(t.content)
      )
        return null;
      let l = Oe.create(this.top, t, r, o, s, i);
      if (l.contentDOM) {
        (l.children = e.children), (e.children = []);
        for (let c of l.children) c.parent = l;
      }
      return e.destroy(), l;
    }
    addNode(e, t, r, o, s) {
      let i = Oe.create(this.top, e, t, r, o, s);
      i.contentDOM && i.updateChildren(o, s + 1),
        this.top.children.splice(this.index++, 0, i),
        (this.changed = !0);
    }
    placeWidget(e, t, r) {
      let o =
        this.index < this.top.children.length
          ? this.top.children[this.index]
          : null;
      if (
        o &&
        o.matchesWidget(e) &&
        (e == o.widget || !o.widget.type.toDOM.parentNode)
      )
        this.index++;
      else {
        let s = new Fs(this.top, e, t, r);
        this.top.children.splice(this.index++, 0, s), (this.changed = !0);
      }
    }
    addTextblockHacks() {
      let e = this.top.children[this.index - 1],
        t = this.top;
      for (; e instanceof Qe; )
        (t = e), (e = t.children[t.children.length - 1]);
      (!e ||
        !(e instanceof gn) ||
        /\n$/.test(e.node.text) ||
        (this.view.requiresGeckoHackNode && /\s$/.test(e.node.text))) &&
        ((K || j) &&
          e &&
          e.dom.contentEditable == "false" &&
          this.addHackNode("IMG", t),
        this.addHackNode("BR", this.top));
    }
    addHackNode(e, t) {
      if (
        t == this.top &&
        this.index < t.children.length &&
        t.children[this.index].matchesHack(e)
      )
        this.index++;
      else {
        let r = document.createElement(e);
        e == "IMG" && ((r.className = "ProseMirror-separator"), (r.alt = "")),
          e == "BR" && (r.className = "ProseMirror-trailingBreak");
        let o = new Ps(this.top, [], r, null);
        t != this.top
          ? t.children.push(o)
          : t.children.splice(this.index++, 0, o),
          (this.changed = !0);
      }
    }
    isLocked(e) {
      return (
        this.lock &&
        (e == this.lock ||
          (e.nodeType == 1 && e.contains(this.lock.parentNode)))
      );
    }
  }
  function Ra(n, e) {
    let t = e,
      r = t.children.length,
      o = n.childCount,
      s = new Map(),
      i = [];
    e: for (; o > 0; ) {
      let l;
      for (;;)
        if (r) {
          let a = t.children[r - 1];
          if (a instanceof Qe) (t = a), (r = a.children.length);
          else {
            (l = a), r--;
            break;
          }
        } else {
          if (t == e) break e;
          (r = t.parent.children.indexOf(t)), (t = t.parent);
        }
      let c = l.node;
      if (c) {
        if (c != n.child(o - 1)) break;
        --o, s.set(l, o), i.push(l);
      }
    }
    return { index: o, matched: s, matches: i.reverse() };
  }
  function Ia(n, e) {
    return n.type.side - e.type.side;
  }
  function La(n, e, t, r) {
    let o = e.locals(n),
      s = 0;
    if (o.length == 0) {
      for (let a = 0; a < n.childCount; a++) {
        let u = n.child(a);
        r(u, o, e.forChild(s, u), a), (s += u.nodeSize);
      }
      return;
    }
    let i = 0,
      l = [],
      c = null;
    for (let a = 0; ; ) {
      let u, f;
      for (; i < o.length && o[i].to == s; ) {
        let g = o[i++];
        g.widget && (u ? (f || (f = [u])).push(g) : (u = g));
      }
      if (u)
        if (f) {
          f.sort(Ia);
          for (let g = 0; g < f.length; g++) t(f[g], a, !!c);
        } else t(u, a, !!c);
      let h, p;
      if (c) (p = -1), (h = c), (c = null);
      else if (a < n.childCount) (p = a), (h = n.child(a++));
      else break;
      for (let g = 0; g < l.length; g++) l[g].to <= s && l.splice(g--, 1);
      for (; i < o.length && o[i].from <= s && o[i].to > s; ) l.push(o[i++]);
      let d = s + h.nodeSize;
      if (h.isText) {
        let g = d;
        i < o.length && o[i].from < g && (g = o[i].from);
        for (let b = 0; b < l.length; b++) l[b].to < g && (g = l[b].to);
        g < d && ((c = h.cut(g - s)), (h = h.cut(0, g - s)), (d = g), (p = -1));
      } else for (; i < o.length && o[i].to <= d; ) i++;
      let m = h.isInline && !h.isLeaf ? l.filter((g) => !g.inline) : l.slice();
      r(h, m, e.forChild(s, h), p), (s = d);
    }
  }
  function za(n) {
    if (n.nodeName == "UL" || n.nodeName == "OL") {
      let e = n.style.cssText;
      (n.style.cssText = e + "; list-style: square !important"),
        window.getComputedStyle(n).listStyle,
        (n.style.cssText = e);
    }
  }
  function Fa(n, e) {
    for (;;) {
      if (n.nodeType == 3) return n;
      if (n.nodeType == 1 && e > 0) {
        if (n.childNodes.length > e && n.childNodes[e].nodeType == 3)
          return n.childNodes[e];
        (n = n.childNodes[e - 1]), (e = ge(n));
      } else if (n.nodeType == 1 && e < n.childNodes.length)
        (n = n.childNodes[e]), (e = 0);
      else return null;
    }
  }
  function Ba(n, e, t, r) {
    for (let o = 0, s = 0; o < n.childCount && s <= r; ) {
      let i = n.child(o++),
        l = s;
      if (((s += i.nodeSize), !i.isText)) continue;
      let c = i.text;
      for (; o < n.childCount; ) {
        let a = n.child(o++);
        if (((s += a.nodeSize), !a.isText)) break;
        c += a.text;
      }
      if (s >= t) {
        if (s >= r && c.slice(r - e.length - l, r - l) == e)
          return r - e.length;
        let a = l < r ? c.lastIndexOf(e, r - l - 1) : -1;
        if (a >= 0 && a + e.length + l >= t) return l + a;
        if (
          t == r &&
          c.length >= r + e.length - l &&
          c.slice(r - l, r - l + e.length) == e
        )
          return r;
      }
    }
    return -1;
  }
  function yr(n, e, t, r, o) {
    let s = [];
    for (let i = 0, l = 0; i < n.length; i++) {
      let c = n[i],
        a = l,
        u = (l += c.size);
      a >= t || u <= e
        ? s.push(c)
        : (a < e && s.push(c.slice(0, e - a, r)),
          o && (s.push(o), (o = void 0)),
          u > t && s.push(c.slice(t - a, c.size, r)));
    }
    return s;
  }
  function kr(n, e = null) {
    let t = n.domSelectionRange(),
      r = n.state.doc;
    if (!t.focusNode) return null;
    let o = n.docView.nearestDesc(t.focusNode),
      s = o && o.size == 0,
      i = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
    if (i < 0) return null;
    let l = r.resolve(i),
      c,
      a;
    if (mn(t)) {
      for (c = l; o && !o.node; ) o = o.parent;
      let u = o.node;
      if (
        o &&
        u.isAtom &&
        D.isSelectable(u) &&
        o.parent &&
        !(u.isInline && aa(t.focusNode, t.focusOffset, o.dom))
      ) {
        let f = o.posBefore;
        a = new D(i == f ? l : r.resolve(f));
      }
    } else {
      let u = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
      if (u < 0) return null;
      c = r.resolve(u);
    }
    if (!a) {
      let u = e == "pointer" || (n.state.selection.head < l.pos && !s) ? 1 : -1;
      a = wr(n, c, l, u);
    }
    return a;
  }
  function Gs(n) {
    return n.editable
      ? n.hasFocus()
      : Qs(n) &&
          document.activeElement &&
          document.activeElement.contains(n.dom);
  }
  function De(n, e = !1) {
    let t = n.state.selection;
    if ((Ks(n, t), !!Gs(n))) {
      if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && j) {
        let r = n.domSelectionRange(),
          o = n.domObserver.currentSelection;
        if (
          r.anchorNode &&
          o.anchorNode &&
          Ke(r.anchorNode, r.anchorOffset, o.anchorNode, o.anchorOffset)
        ) {
          (n.input.mouseDown.delayedSelectionSync = !0),
            n.domObserver.setCurSelection();
          return;
        }
      }
      if ((n.domObserver.disconnectSelection(), n.cursorWrapper)) Va(n);
      else {
        let { anchor: r, head: o } = t,
          s,
          i;
        js &&
          !(t instanceof I) &&
          (t.$from.parent.inlineContent || (s = Js(n, t.from)),
          !t.empty && !t.$from.parent.inlineContent && (i = Js(n, t.to))),
          n.docView.setSelection(r, o, n.root, e),
          js && (s && Ws(s), i && Ws(i)),
          t.visible
            ? n.dom.classList.remove("ProseMirror-hideselection")
            : (n.dom.classList.add("ProseMirror-hideselection"),
              "onselectionchange" in document && Pa(n));
      }
      n.domObserver.setCurSelection(), n.domObserver.connectSelection();
    }
  }
  const js = K || (j && ha < 63);
  function Js(n, e) {
    let { node: t, offset: r } = n.docView.domFromPos(e, 0),
      o = r < t.childNodes.length ? t.childNodes[r] : null,
      s = r ? t.childNodes[r - 1] : null;
    if (K && o && o.contentEditable == "false") return xr(o);
    if (
      (!o || o.contentEditable == "false") &&
      (!s || s.contentEditable == "false")
    ) {
      if (o) return xr(o);
      if (s) return xr(s);
    }
  }
  function xr(n) {
    return (
      (n.contentEditable = "true"),
      K && n.draggable && ((n.draggable = !1), (n.wasDraggable = !0)),
      n
    );
  }
  function Ws(n) {
    (n.contentEditable = "false"),
      n.wasDraggable && ((n.draggable = !0), (n.wasDraggable = null));
  }
  function Pa(n) {
    let e = n.dom.ownerDocument;
    e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
    let t = n.domSelectionRange(),
      r = t.anchorNode,
      o = t.anchorOffset;
    e.addEventListener(
      "selectionchange",
      (n.input.hideSelectionGuard = () => {
        (t.anchorNode != r || t.anchorOffset != o) &&
          (e.removeEventListener("selectionchange", n.input.hideSelectionGuard),
          setTimeout(() => {
            (!Gs(n) || n.state.selection.visible) &&
              n.dom.classList.remove("ProseMirror-hideselection");
          }, 20));
      }),
    );
  }
  function Va(n) {
    let e = n.domSelection(),
      t = document.createRange(),
      r = n.cursorWrapper.dom,
      o = r.nodeName == "IMG";
    o ? t.setEnd(r.parentNode, W(r) + 1) : t.setEnd(r, 0),
      t.collapse(!1),
      e.removeAllRanges(),
      e.addRange(t),
      !o &&
        !n.state.selection.visible &&
        X &&
        qe <= 11 &&
        ((r.disabled = !0), (r.disabled = !1));
  }
  function Ks(n, e) {
    if (e instanceof D) {
      let t = n.docView.descAt(e.from);
      t != n.lastSelectedViewDesc &&
        (Zs(n), t && t.selectNode(), (n.lastSelectedViewDesc = t));
    } else Zs(n);
  }
  function Zs(n) {
    n.lastSelectedViewDesc &&
      (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(),
      (n.lastSelectedViewDesc = void 0));
  }
  function wr(n, e, t, r) {
    return (
      n.someProp("createSelectionBetween", (o) => o(n, e, t)) ||
      I.between(e, t, r)
    );
  }
  function Ys(n) {
    return n.editable && !n.hasFocus() ? !1 : Qs(n);
  }
  function Qs(n) {
    let e = n.domSelectionRange();
    if (!e.anchorNode) return !1;
    try {
      return (
        n.dom.contains(
          e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode,
        ) &&
        (n.editable ||
          n.dom.contains(
            e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode,
          ))
      );
    } catch {
      return !1;
    }
  }
  function $a(n) {
    let e = n.docView.domFromPos(n.state.selection.anchor, 0),
      t = n.domSelectionRange();
    return Ke(e.node, e.offset, t.anchorNode, t.anchorOffset);
  }
  function vr(n, e) {
    let { $anchor: t, $head: r } = n.selection,
      o = e > 0 ? t.max(r) : t.min(r),
      s = o.parent.inlineContent
        ? o.depth
          ? n.doc.resolve(e > 0 ? o.after() : o.before())
          : null
        : o;
    return s && T.findFrom(s, e);
  }
  function Re(n, e) {
    return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
  }
  function Xs(n, e, t) {
    let r = n.state.selection;
    if (r instanceof I)
      if (t.indexOf("s") > -1) {
        let { $head: o } = r,
          s = o.textOffset ? null : e < 0 ? o.nodeBefore : o.nodeAfter;
        if (!s || s.isText || !s.isLeaf) return !1;
        let i = n.state.doc.resolve(o.pos + s.nodeSize * (e < 0 ? -1 : 1));
        return Re(n, new I(r.$anchor, i));
      } else if (r.empty) {
        if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
          let o = vr(n.state, e);
          return o && o instanceof D ? Re(n, o) : !1;
        } else if (!(se && t.indexOf("m") > -1)) {
          let o = r.$head,
            s = o.textOffset ? null : e < 0 ? o.nodeBefore : o.nodeAfter,
            i;
          if (!s || s.isText) return !1;
          let l = e < 0 ? o.pos - s.nodeSize : o.pos;
          return s.isAtom || ((i = n.docView.descAt(l)) && !i.contentDOM)
            ? D.isSelectable(s)
              ? Re(
                  n,
                  new D(e < 0 ? n.state.doc.resolve(o.pos - s.nodeSize) : o),
                )
              : Rt
                ? Re(n, new I(n.state.doc.resolve(e < 0 ? l : l + s.nodeSize)))
                : !1
            : !1;
        }
      } else return !1;
    else {
      if (r instanceof D && r.node.isInline)
        return Re(n, new I(e > 0 ? r.$to : r.$from));
      {
        let o = vr(n.state, e);
        return o ? Re(n, o) : !1;
      }
    }
  }
  function bn(n) {
    return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
  }
  function Ft(n, e) {
    let t = n.pmViewDesc;
    return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
  }
  function bt(n, e) {
    return e < 0 ? Ua(n) : Ha(n);
  }
  function Ua(n) {
    let e = n.domSelectionRange(),
      t = e.focusNode,
      r = e.focusOffset;
    if (!t) return;
    let o,
      s,
      i = !1;
    for (
      ue && t.nodeType == 1 && r < bn(t) && Ft(t.childNodes[r], -1) && (i = !0);
      ;

    )
      if (r > 0) {
        if (t.nodeType != 1) break;
        {
          let l = t.childNodes[r - 1];
          if (Ft(l, -1)) (o = t), (s = --r);
          else if (l.nodeType == 3) (t = l), (r = t.nodeValue.length);
          else break;
        }
      } else {
        if (ei(t)) break;
        {
          let l = t.previousSibling;
          for (; l && Ft(l, -1); )
            (o = t.parentNode), (s = W(l)), (l = l.previousSibling);
          if (l) (t = l), (r = bn(t));
          else {
            if (((t = t.parentNode), t == n.dom)) break;
            r = 0;
          }
        }
      }
    i ? Cr(n, t, r) : o && Cr(n, o, s);
  }
  function Ha(n) {
    let e = n.domSelectionRange(),
      t = e.focusNode,
      r = e.focusOffset;
    if (!t) return;
    let o = bn(t),
      s,
      i;
    for (;;)
      if (r < o) {
        if (t.nodeType != 1) break;
        let l = t.childNodes[r];
        if (Ft(l, 1)) (s = t), (i = ++r);
        else break;
      } else {
        if (ei(t)) break;
        {
          let l = t.nextSibling;
          for (; l && Ft(l, 1); )
            (s = l.parentNode), (i = W(l) + 1), (l = l.nextSibling);
          if (l) (t = l), (r = 0), (o = bn(t));
          else {
            if (((t = t.parentNode), t == n.dom)) break;
            r = o = 0;
          }
        }
      }
    s && Cr(n, s, i);
  }
  function ei(n) {
    let e = n.pmViewDesc;
    return e && e.node && e.node.isBlock;
  }
  function Ga(n, e) {
    for (; n && e == n.childNodes.length && !ur(n); )
      (e = W(n) + 1), (n = n.parentNode);
    for (; n && e < n.childNodes.length; ) {
      let t = n.childNodes[e];
      if (t.nodeType == 3) return t;
      if (t.nodeType == 1 && t.contentEditable == "false") break;
      (n = t), (e = 0);
    }
  }
  function ja(n, e) {
    for (; n && !e && !ur(n); ) (e = W(n)), (n = n.parentNode);
    for (; n && e; ) {
      let t = n.childNodes[e - 1];
      if (t.nodeType == 3) return t;
      if (t.nodeType == 1 && t.contentEditable == "false") break;
      (n = t), (e = n.childNodes.length);
    }
  }
  function Cr(n, e, t) {
    if (e.nodeType != 3) {
      let s, i;
      (i = Ga(e, t))
        ? ((e = i), (t = 0))
        : (s = ja(e, t)) && ((e = s), (t = s.nodeValue.length));
    }
    let r = n.domSelection();
    if (mn(r)) {
      let s = document.createRange();
      s.setEnd(e, t), s.setStart(e, t), r.removeAllRanges(), r.addRange(s);
    } else r.extend && r.extend(e, t);
    n.domObserver.setCurSelection();
    let { state: o } = n;
    setTimeout(() => {
      n.state == o && De(n);
    }, 50);
  }
  function ti(n, e) {
    let t = n.state.doc.resolve(e);
    if (!(j || pa) && t.parent.inlineContent) {
      let o = n.coordsAtPos(e);
      if (e > t.start()) {
        let s = n.coordsAtPos(e - 1),
          i = (s.top + s.bottom) / 2;
        if (i > o.top && i < o.bottom && Math.abs(s.left - o.left) > 1)
          return s.left < o.left ? "ltr" : "rtl";
      }
      if (e < t.end()) {
        let s = n.coordsAtPos(e + 1),
          i = (s.top + s.bottom) / 2;
        if (i > o.top && i < o.bottom && Math.abs(s.left - o.left) > 1)
          return s.left > o.left ? "ltr" : "rtl";
      }
    }
    return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
  }
  function ni(n, e, t) {
    let r = n.state.selection;
    if (
      (r instanceof I && !r.empty) ||
      t.indexOf("s") > -1 ||
      (se && t.indexOf("m") > -1)
    )
      return !1;
    let { $from: o, $to: s } = r;
    if (!o.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
      let i = vr(n.state, e);
      if (i && i instanceof D) return Re(n, i);
    }
    if (!o.parent.inlineContent) {
      let i = e < 0 ? o : s,
        l = r instanceof ne ? T.near(i, e) : T.findFrom(i, e);
      return l ? Re(n, l) : !1;
    }
    return !1;
  }
  function ri(n, e) {
    if (!(n.state.selection instanceof I)) return !0;
    let { $head: t, $anchor: r, empty: o } = n.state.selection;
    if (!t.sameParent(r)) return !0;
    if (!o) return !1;
    if (n.endOfTextblock(e > 0 ? "forward" : "backward")) return !0;
    let s = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
    if (s && !s.isText) {
      let i = n.state.tr;
      return (
        e < 0
          ? i.delete(t.pos - s.nodeSize, t.pos)
          : i.delete(t.pos, t.pos + s.nodeSize),
        n.dispatch(i),
        !0
      );
    }
    return !1;
  }
  function oi(n, e, t) {
    n.domObserver.stop(), (e.contentEditable = t), n.domObserver.start();
  }
  function Ja(n) {
    if (!K || n.state.selection.$head.parentOffset > 0) return !1;
    let { focusNode: e, focusOffset: t } = n.domSelectionRange();
    if (
      e &&
      e.nodeType == 1 &&
      t == 0 &&
      e.firstChild &&
      e.firstChild.contentEditable == "false"
    ) {
      let r = e.firstChild;
      oi(n, r, "true"), setTimeout(() => oi(n, r, "false"), 20);
    }
    return !1;
  }
  function Wa(n) {
    let e = "";
    return (
      n.ctrlKey && (e += "c"),
      n.metaKey && (e += "m"),
      n.altKey && (e += "a"),
      n.shiftKey && (e += "s"),
      e
    );
  }
  function Ka(n, e) {
    let t = e.keyCode,
      r = Wa(e);
    if (t == 8 || (se && t == 72 && r == "c")) return ri(n, -1) || bt(n, -1);
    if ((t == 46 && !e.shiftKey) || (se && t == 68 && r == "c"))
      return ri(n, 1) || bt(n, 1);
    if (t == 13 || t == 27) return !0;
    if (t == 37 || (se && t == 66 && r == "c")) {
      let o = t == 37 ? (ti(n, n.state.selection.from) == "ltr" ? -1 : 1) : -1;
      return Xs(n, o, r) || bt(n, o);
    } else if (t == 39 || (se && t == 70 && r == "c")) {
      let o = t == 39 ? (ti(n, n.state.selection.from) == "ltr" ? 1 : -1) : 1;
      return Xs(n, o, r) || bt(n, o);
    } else {
      if (t == 38 || (se && t == 80 && r == "c"))
        return ni(n, -1, r) || bt(n, -1);
      if (t == 40 || (se && t == 78 && r == "c"))
        return Ja(n) || ni(n, 1, r) || bt(n, 1);
      if (r == (se ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90))
        return !0;
    }
    return !1;
  }
  function si(n, e) {
    n.someProp("transformCopied", (p) => {
      e = p(e, n);
    });
    let t = [],
      { content: r, openStart: o, openEnd: s } = e;
    for (
      ;
      o > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1;

    ) {
      o--, s--;
      let p = r.firstChild;
      t.push(p.type.name, p.attrs != p.type.defaultAttrs ? p.attrs : null),
        (r = p.content);
    }
    let i = n.someProp("clipboardSerializer") || ve.fromSchema(n.state.schema),
      l = pi(),
      c = l.createElement("div");
    c.appendChild(i.serializeFragment(r, { document: l }));
    let a = c.firstChild,
      u,
      f = 0;
    for (; a && a.nodeType == 1 && (u = fi[a.nodeName.toLowerCase()]); ) {
      for (let p = u.length - 1; p >= 0; p--) {
        let d = l.createElement(u[p]);
        for (; c.firstChild; ) d.appendChild(c.firstChild);
        c.appendChild(d), f++;
      }
      a = c.firstChild;
    }
    a &&
      a.nodeType == 1 &&
      a.setAttribute(
        "data-pm-slice",
        `${o} ${s}${f ? ` -${f}` : ""} ${JSON.stringify(t)}`,
      );
    let h =
      n.someProp("clipboardTextSerializer", (p) => p(e, n)) ||
      e.content.textBetween(
        0,
        e.content.size,
        `

`,
      );
    return { dom: c, text: h };
  }
  function ii(n, e, t, r, o) {
    let s = o.parent.type.spec.code,
      i,
      l;
    if (!t && !e) return null;
    let c = e && (r || s || !t);
    if (c) {
      if (
        (n.someProp("transformPastedText", (h) => {
          e = h(e, s || r, n);
        }),
        s)
      )
        return e
          ? new v(
              y.from(
                n.state.schema.text(
                  e.replace(
                    /\r\n?/g,
                    `
`,
                  ),
                ),
              ),
              0,
              0,
            )
          : v.empty;
      let f = n.someProp("clipboardTextParser", (h) => h(e, o, r, n));
      if (f) l = f;
      else {
        let h = o.marks(),
          { schema: p } = n.state,
          d = ve.fromSchema(p);
        (i = document.createElement("div")),
          e.split(/(?:\r\n?|\n)+/).forEach((m) => {
            let g = i.appendChild(document.createElement("p"));
            m && g.appendChild(d.serializeNode(p.text(m, h)));
          });
      }
    } else
      n.someProp("transformPastedHTML", (f) => {
        t = f(t, n);
      }),
        (i = Qa(t)),
        Rt && Xa(i);
    let a = i && i.querySelector("[data-pm-slice]"),
      u =
        a &&
        /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(
          a.getAttribute("data-pm-slice") || "",
        );
    if (u && u[3])
      for (let f = +u[3]; f > 0; f--) {
        let h = i.firstChild;
        for (; h && h.nodeType != 1; ) h = h.nextSibling;
        if (!h) break;
        i = h;
      }
    if (
      (l ||
        (l = (
          n.someProp("clipboardParser") ||
          n.someProp("domParser") ||
          it.fromSchema(n.state.schema)
        ).parseSlice(i, {
          preserveWhitespace: !!(c || u),
          context: o,
          ruleFromNode(h) {
            return h.nodeName == "BR" &&
              !h.nextSibling &&
              h.parentNode &&
              !Za.test(h.parentNode.nodeName)
              ? { ignore: !0 }
              : null;
          },
        })),
      u)
    )
      l = eu(ui(l, +u[1], +u[2]), u[4]);
    else if (
      ((l = v.maxOpen(Ya(l.content, o), !0)), l.openStart || l.openEnd)
    ) {
      let f = 0,
        h = 0;
      for (
        let p = l.content.firstChild;
        f < l.openStart && !p.type.spec.isolating;
        f++, p = p.firstChild
      );
      for (
        let p = l.content.lastChild;
        h < l.openEnd && !p.type.spec.isolating;
        h++, p = p.lastChild
      );
      l = ui(l, f, h);
    }
    return (
      n.someProp("transformPasted", (f) => {
        l = f(l, n);
      }),
      l
    );
  }
  const Za =
    /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
  function Ya(n, e) {
    if (n.childCount < 2) return n;
    for (let t = e.depth; t >= 0; t--) {
      let o = e.node(t).contentMatchAt(e.index(t)),
        s,
        i = [];
      if (
        (n.forEach((l) => {
          if (!i) return;
          let c = o.findWrapping(l.type),
            a;
          if (!c) return (i = null);
          if ((a = i.length && s.length && ci(c, s, l, i[i.length - 1], 0)))
            i[i.length - 1] = a;
          else {
            i.length && (i[i.length - 1] = ai(i[i.length - 1], s.length));
            let u = li(l, c);
            i.push(u), (o = o.matchType(u.type)), (s = c);
          }
        }),
        i)
      )
        return y.from(i);
    }
    return n;
  }
  function li(n, e, t = 0) {
    for (let r = e.length - 1; r >= t; r--) n = e[r].create(null, y.from(n));
    return n;
  }
  function ci(n, e, t, r, o) {
    if (o < n.length && o < e.length && n[o] == e[o]) {
      let s = ci(n, e, t, r.lastChild, o + 1);
      if (s) return r.copy(r.content.replaceChild(r.childCount - 1, s));
      if (
        r
          .contentMatchAt(r.childCount)
          .matchType(o == n.length - 1 ? t.type : n[o + 1])
      )
        return r.copy(r.content.append(y.from(li(t, n, o + 1))));
    }
  }
  function ai(n, e) {
    if (e == 0) return n;
    let t = n.content.replaceChild(n.childCount - 1, ai(n.lastChild, e - 1)),
      r = n.contentMatchAt(n.childCount).fillBefore(y.empty, !0);
    return n.copy(t.append(r));
  }
  function Sr(n, e, t, r, o, s) {
    let i = e < 0 ? n.firstChild : n.lastChild,
      l = i.content;
    return (
      n.childCount > 1 && (s = 0),
      o < r - 1 && (l = Sr(l, e, t, r, o + 1, s)),
      o >= t &&
        (l =
          e < 0
            ? i
                .contentMatchAt(0)
                .fillBefore(l, s <= o)
                .append(l)
            : l.append(i.contentMatchAt(i.childCount).fillBefore(y.empty, !0))),
      n.replaceChild(e < 0 ? 0 : n.childCount - 1, i.copy(l))
    );
  }
  function ui(n, e, t) {
    return (
      e < n.openStart &&
        (n = new v(
          Sr(n.content, -1, e, n.openStart, 0, n.openEnd),
          e,
          n.openEnd,
        )),
      t < n.openEnd &&
        (n = new v(Sr(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)),
      n
    );
  }
  const fi = {
    thead: ["table"],
    tbody: ["table"],
    tfoot: ["table"],
    caption: ["table"],
    colgroup: ["table"],
    col: ["table", "colgroup"],
    tr: ["table", "tbody"],
    td: ["table", "tbody", "tr"],
    th: ["table", "tbody", "tr"],
  };
  let hi = null;
  function pi() {
    return hi || (hi = document.implementation.createHTMLDocument("title"));
  }
  function Qa(n) {
    let e = /^(\s*<meta [^>]*>)*/.exec(n);
    e && (n = n.slice(e[0].length));
    let t = pi().createElement("div"),
      r = /<([a-z][^>\s]+)/i.exec(n),
      o;
    if (
      ((o = r && fi[r[1].toLowerCase()]) &&
        (n =
          o.map((s) => "<" + s + ">").join("") +
          n +
          o
            .map((s) => "</" + s + ">")
            .reverse()
            .join("")),
      (t.innerHTML = n),
      o)
    )
      for (let s = 0; s < o.length; s++) t = t.querySelector(o[s]) || t;
    return t;
  }
  function Xa(n) {
    let e = n.querySelectorAll(
      j ? "span:not([class]):not([style])" : "span.Apple-converted-space",
    );
    for (let t = 0; t < e.length; t++) {
      let r = e[t];
      r.childNodes.length == 1 &&
        r.textContent == " " &&
        r.parentNode &&
        r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
    }
  }
  function eu(n, e) {
    if (!n.size) return n;
    let t = n.content.firstChild.type.schema,
      r;
    try {
      r = JSON.parse(e);
    } catch {
      return n;
    }
    let { content: o, openStart: s, openEnd: i } = n;
    for (let l = r.length - 2; l >= 0; l -= 2) {
      let c = t.nodes[r[l]];
      if (!c || c.hasRequiredAttrs()) break;
      (o = y.from(c.create(r[l + 1], o))), s++, i++;
    }
    return new v(o, s, i);
  }
  const Z = {},
    Y = {},
    tu = { touchstart: !0, touchmove: !0 };
  class nu {
    constructor() {
      (this.shiftKey = !1),
        (this.mouseDown = null),
        (this.lastKeyCode = null),
        (this.lastKeyCodeTime = 0),
        (this.lastClick = { time: 0, x: 0, y: 0, type: "" }),
        (this.lastSelectionOrigin = null),
        (this.lastSelectionTime = 0),
        (this.lastIOSEnter = 0),
        (this.lastIOSEnterFallbackTimeout = -1),
        (this.lastFocus = 0),
        (this.lastTouch = 0),
        (this.lastAndroidDelete = 0),
        (this.composing = !1),
        (this.composingTimeout = -1),
        (this.compositionNodes = []),
        (this.compositionEndedAt = -2e8),
        (this.compositionID = 1),
        (this.compositionPendingChanges = 0),
        (this.domChangeCount = 0),
        (this.eventHandlers = Object.create(null)),
        (this.hideSelectionGuard = null);
    }
  }
  function ru(n) {
    for (let e in Z) {
      let t = Z[e];
      n.dom.addEventListener(
        e,
        (n.input.eventHandlers[e] = (r) => {
          su(n, r) && !Er(n, r) && (n.editable || !(r.type in Y)) && t(n, r);
        }),
        tu[e] ? { passive: !0 } : void 0,
      );
    }
    K && n.dom.addEventListener("input", () => null), Dr(n);
  }
  function Ie(n, e) {
    (n.input.lastSelectionOrigin = e), (n.input.lastSelectionTime = Date.now());
  }
  function ou(n) {
    n.domObserver.stop();
    for (let e in n.input.eventHandlers)
      n.dom.removeEventListener(e, n.input.eventHandlers[e]);
    clearTimeout(n.input.composingTimeout),
      clearTimeout(n.input.lastIOSEnterFallbackTimeout);
  }
  function Dr(n) {
    n.someProp("handleDOMEvents", (e) => {
      for (let t in e)
        n.input.eventHandlers[t] ||
          n.dom.addEventListener(
            t,
            (n.input.eventHandlers[t] = (r) => Er(n, r)),
          );
    });
  }
  function Er(n, e) {
    return n.someProp("handleDOMEvents", (t) => {
      let r = t[e.type];
      return r ? r(n, e) || e.defaultPrevented : !1;
    });
  }
  function su(n, e) {
    if (!e.bubbles) return !0;
    if (e.defaultPrevented) return !1;
    for (let t = e.target; t != n.dom; t = t.parentNode)
      if (!t || t.nodeType == 11 || (t.pmViewDesc && t.pmViewDesc.stopEvent(e)))
        return !1;
    return !0;
  }
  function iu(n, e) {
    !Er(n, e) && Z[e.type] && (n.editable || !(e.type in Y)) && Z[e.type](n, e);
  }
  (Y.keydown = (n, e) => {
    let t = e;
    if (
      ((n.input.shiftKey = t.keyCode == 16 || t.shiftKey),
      !mi(n, t) &&
        ((n.input.lastKeyCode = t.keyCode),
        (n.input.lastKeyCodeTime = Date.now()),
        !(fe && j && t.keyCode == 13)))
    )
      if (
        (t.keyCode != 229 && n.domObserver.forceFlush(),
        mt && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey)
      ) {
        let r = Date.now();
        (n.input.lastIOSEnter = r),
          (n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
            n.input.lastIOSEnter == r &&
              (n.someProp("handleKeyDown", (o) => o(n, Ze(13, "Enter"))),
              (n.input.lastIOSEnter = 0));
          }, 200));
      } else
        n.someProp("handleKeyDown", (r) => r(n, t)) || Ka(n, t)
          ? t.preventDefault()
          : Ie(n, "key");
  }),
    (Y.keyup = (n, e) => {
      e.keyCode == 16 && (n.input.shiftKey = !1);
    }),
    (Y.keypress = (n, e) => {
      let t = e;
      if (
        mi(n, t) ||
        !t.charCode ||
        (t.ctrlKey && !t.altKey) ||
        (se && t.metaKey)
      )
        return;
      if (n.someProp("handleKeyPress", (o) => o(n, t))) {
        t.preventDefault();
        return;
      }
      let r = n.state.selection;
      if (!(r instanceof I) || !r.$from.sameParent(r.$to)) {
        let o = String.fromCharCode(t.charCode);
        !/[\r\n]/.test(o) &&
          !n.someProp("handleTextInput", (s) =>
            s(n, r.$from.pos, r.$to.pos, o),
          ) &&
          n.dispatch(n.state.tr.insertText(o).scrollIntoView()),
          t.preventDefault();
      }
    });
  function yn(n) {
    return { left: n.clientX, top: n.clientY };
  }
  function lu(n, e) {
    let t = e.x - n.clientX,
      r = e.y - n.clientY;
    return t * t + r * r < 100;
  }
  function Ar(n, e, t, r, o) {
    if (r == -1) return !1;
    let s = n.state.doc.resolve(r);
    for (let i = s.depth + 1; i > 0; i--)
      if (
        n.someProp(e, (l) =>
          i > s.depth
            ? l(n, t, s.nodeAfter, s.before(i), o, !0)
            : l(n, t, s.node(i), s.before(i), o, !1),
        )
      )
        return !0;
    return !1;
  }
  function yt(n, e, t) {
    n.focused || n.focus();
    let r = n.state.tr.setSelection(e);
    t == "pointer" && r.setMeta("pointer", !0), n.dispatch(r);
  }
  function cu(n, e) {
    if (e == -1) return !1;
    let t = n.state.doc.resolve(e),
      r = t.nodeAfter;
    return r && r.isAtom && D.isSelectable(r)
      ? (yt(n, new D(t), "pointer"), !0)
      : !1;
  }
  function au(n, e) {
    if (e == -1) return !1;
    let t = n.state.selection,
      r,
      o;
    t instanceof D && (r = t.node);
    let s = n.state.doc.resolve(e);
    for (let i = s.depth + 1; i > 0; i--) {
      let l = i > s.depth ? s.nodeAfter : s.node(i);
      if (D.isSelectable(l)) {
        r &&
        t.$from.depth > 0 &&
        i >= t.$from.depth &&
        s.before(t.$from.depth + 1) == t.$from.pos
          ? (o = s.before(t.$from.depth))
          : (o = s.before(i));
        break;
      }
    }
    return o != null ? (yt(n, D.create(n.state.doc, o), "pointer"), !0) : !1;
  }
  function uu(n, e, t, r, o) {
    return (
      Ar(n, "handleClickOn", e, t, r) ||
      n.someProp("handleClick", (s) => s(n, e, r)) ||
      (o ? au(n, t) : cu(n, t))
    );
  }
  function fu(n, e, t, r) {
    return (
      Ar(n, "handleDoubleClickOn", e, t, r) ||
      n.someProp("handleDoubleClick", (o) => o(n, e, r))
    );
  }
  function hu(n, e, t, r) {
    return (
      Ar(n, "handleTripleClickOn", e, t, r) ||
      n.someProp("handleTripleClick", (o) => o(n, e, r)) ||
      pu(n, t, r)
    );
  }
  function pu(n, e, t) {
    if (t.button != 0) return !1;
    let r = n.state.doc;
    if (e == -1)
      return r.inlineContent
        ? (yt(n, I.create(r, 0, r.content.size), "pointer"), !0)
        : !1;
    let o = r.resolve(e);
    for (let s = o.depth + 1; s > 0; s--) {
      let i = s > o.depth ? o.nodeAfter : o.node(s),
        l = o.before(s);
      if (i.inlineContent)
        yt(n, I.create(r, l + 1, l + 1 + i.content.size), "pointer");
      else if (D.isSelectable(i)) yt(n, D.create(r, l), "pointer");
      else continue;
      return !0;
    }
  }
  function _r(n) {
    return kn(n);
  }
  const di = se ? "metaKey" : "ctrlKey";
  Z.mousedown = (n, e) => {
    let t = e;
    n.input.shiftKey = t.shiftKey;
    let r = _r(n),
      o = Date.now(),
      s = "singleClick";
    o - n.input.lastClick.time < 500 &&
      lu(t, n.input.lastClick) &&
      !t[di] &&
      (n.input.lastClick.type == "singleClick"
        ? (s = "doubleClick")
        : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")),
      (n.input.lastClick = { time: o, x: t.clientX, y: t.clientY, type: s });
    let i = n.posAtCoords(yn(t));
    i &&
      (s == "singleClick"
        ? (n.input.mouseDown && n.input.mouseDown.done(),
          (n.input.mouseDown = new du(n, i, t, !!r)))
        : (s == "doubleClick" ? fu : hu)(n, i.pos, i.inside, t)
          ? t.preventDefault()
          : Ie(n, "pointer"));
  };
  class du {
    constructor(e, t, r, o) {
      (this.view = e),
        (this.pos = t),
        (this.event = r),
        (this.flushed = o),
        (this.delayedSelectionSync = !1),
        (this.mightDrag = null),
        (this.startDoc = e.state.doc),
        (this.selectNode = !!r[di]),
        (this.allowDefault = r.shiftKey);
      let s, i;
      if (t.inside > -1) (s = e.state.doc.nodeAt(t.inside)), (i = t.inside);
      else {
        let u = e.state.doc.resolve(t.pos);
        (s = u.parent), (i = u.depth ? u.before() : 0);
      }
      const l = o ? null : r.target,
        c = l ? e.docView.nearestDesc(l, !0) : null;
      this.target = c ? c.dom : null;
      let { selection: a } = e.state;
      ((r.button == 0 &&
        s.type.spec.draggable &&
        s.type.spec.selectable !== !1) ||
        (a instanceof D && a.from <= i && a.to > i)) &&
        (this.mightDrag = {
          node: s,
          pos: i,
          addAttr: !!(this.target && !this.target.draggable),
          setUneditable: !!(
            this.target &&
            ue &&
            !this.target.hasAttribute("contentEditable")
          ),
        }),
        this.target &&
          this.mightDrag &&
          (this.mightDrag.addAttr || this.mightDrag.setUneditable) &&
          (this.view.domObserver.stop(),
          this.mightDrag.addAttr && (this.target.draggable = !0),
          this.mightDrag.setUneditable &&
            setTimeout(() => {
              this.view.input.mouseDown == this &&
                this.target.setAttribute("contentEditable", "false");
            }, 20),
          this.view.domObserver.start()),
        e.root.addEventListener("mouseup", (this.up = this.up.bind(this))),
        e.root.addEventListener(
          "mousemove",
          (this.move = this.move.bind(this)),
        ),
        Ie(e, "pointer");
    }
    done() {
      this.view.root.removeEventListener("mouseup", this.up),
        this.view.root.removeEventListener("mousemove", this.move),
        this.mightDrag &&
          this.target &&
          (this.view.domObserver.stop(),
          this.mightDrag.addAttr && this.target.removeAttribute("draggable"),
          this.mightDrag.setUneditable &&
            this.target.removeAttribute("contentEditable"),
          this.view.domObserver.start()),
        this.delayedSelectionSync && setTimeout(() => De(this.view)),
        (this.view.input.mouseDown = null);
    }
    up(e) {
      if ((this.done(), !this.view.dom.contains(e.target))) return;
      let t = this.pos;
      this.view.state.doc != this.startDoc &&
        (t = this.view.posAtCoords(yn(e))),
        this.updateAllowDefault(e),
        this.allowDefault || !t
          ? Ie(this.view, "pointer")
          : uu(this.view, t.pos, t.inside, e, this.selectNode)
            ? e.preventDefault()
            : e.button == 0 &&
                (this.flushed ||
                  (K && this.mightDrag && !this.mightDrag.node.isAtom) ||
                  (j &&
                    !this.view.state.selection.visible &&
                    Math.min(
                      Math.abs(t.pos - this.view.state.selection.from),
                      Math.abs(t.pos - this.view.state.selection.to),
                    ) <= 2))
              ? (yt(
                  this.view,
                  T.near(this.view.state.doc.resolve(t.pos)),
                  "pointer",
                ),
                e.preventDefault())
              : Ie(this.view, "pointer");
    }
    move(e) {
      this.updateAllowDefault(e),
        Ie(this.view, "pointer"),
        e.buttons == 0 && this.done();
    }
    updateAllowDefault(e) {
      !this.allowDefault &&
        (Math.abs(this.event.x - e.clientX) > 4 ||
          Math.abs(this.event.y - e.clientY) > 4) &&
        (this.allowDefault = !0);
    }
  }
  (Z.touchstart = (n) => {
    (n.input.lastTouch = Date.now()), _r(n), Ie(n, "pointer");
  }),
    (Z.touchmove = (n) => {
      (n.input.lastTouch = Date.now()), Ie(n, "pointer");
    }),
    (Z.contextmenu = (n) => _r(n));
  function mi(n, e) {
    return n.composing
      ? !0
      : K && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500
        ? ((n.input.compositionEndedAt = -2e8), !0)
        : !1;
  }
  const mu = fe ? 5e3 : -1;
  (Y.compositionstart = Y.compositionupdate =
    (n) => {
      if (!n.composing) {
        n.domObserver.flush();
        let { state: e } = n,
          t = e.selection.$from;
        if (
          e.selection.empty &&
          (e.storedMarks ||
            (!t.textOffset &&
              t.parentOffset &&
              t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
        )
          (n.markCursor = n.state.storedMarks || t.marks()),
            kn(n, !0),
            (n.markCursor = null);
        else if (
          (kn(n),
          ue &&
            e.selection.empty &&
            t.parentOffset &&
            !t.textOffset &&
            t.nodeBefore.marks.length)
        ) {
          let r = n.domSelectionRange();
          for (
            let o = r.focusNode, s = r.focusOffset;
            o && o.nodeType == 1 && s != 0;

          ) {
            let i = s < 0 ? o.lastChild : o.childNodes[s - 1];
            if (!i) break;
            if (i.nodeType == 3) {
              n.domSelection().collapse(i, i.nodeValue.length);
              break;
            } else (o = i), (s = -1);
          }
        }
        n.input.composing = !0;
      }
      gi(n, mu);
    }),
    (Y.compositionend = (n, e) => {
      n.composing &&
        ((n.input.composing = !1),
        (n.input.compositionEndedAt = e.timeStamp),
        (n.input.compositionPendingChanges = n.domObserver.pendingRecords()
          .length
          ? n.input.compositionID
          : 0),
        n.input.compositionPendingChanges &&
          Promise.resolve().then(() => n.domObserver.flush()),
        n.input.compositionID++,
        gi(n, 20));
    });
  function gi(n, e) {
    clearTimeout(n.input.composingTimeout),
      e > -1 && (n.input.composingTimeout = setTimeout(() => kn(n), e));
  }
  function bi(n) {
    for (
      n.composing &&
      ((n.input.composing = !1), (n.input.compositionEndedAt = gu()));
      n.input.compositionNodes.length > 0;

    )
      n.input.compositionNodes.pop().markParentsDirty();
  }
  function gu() {
    let n = document.createEvent("Event");
    return n.initEvent("event", !0, !0), n.timeStamp;
  }
  function kn(n, e = !1) {
    if (!(fe && n.domObserver.flushingSoon >= 0)) {
      if (
        (n.domObserver.forceFlush(), bi(n), e || (n.docView && n.docView.dirty))
      ) {
        let t = kr(n);
        return (
          t && !t.eq(n.state.selection)
            ? n.dispatch(n.state.tr.setSelection(t))
            : n.updateState(n.state),
          !0
        );
      }
      return !1;
    }
  }
  function bu(n, e) {
    if (!n.dom.parentNode) return;
    let t = n.dom.parentNode.appendChild(document.createElement("div"));
    t.appendChild(e),
      (t.style.cssText = "position: fixed; left: -10000px; top: 10px");
    let r = getSelection(),
      o = document.createRange();
    o.selectNodeContents(e),
      n.dom.blur(),
      r.removeAllRanges(),
      r.addRange(o),
      setTimeout(() => {
        t.parentNode && t.parentNode.removeChild(t), n.focus();
      }, 50);
  }
  const Bt = (X && qe < 15) || (mt && da < 604);
  Z.copy = Y.cut = (n, e) => {
    let t = e,
      r = n.state.selection,
      o = t.type == "cut";
    if (r.empty) return;
    let s = Bt ? null : t.clipboardData,
      i = r.content(),
      { dom: l, text: c } = si(n, i);
    s
      ? (t.preventDefault(),
        s.clearData(),
        s.setData("text/html", l.innerHTML),
        s.setData("text/plain", c))
      : bu(n, l),
      o &&
        n.dispatch(
          n.state.tr
            .deleteSelection()
            .scrollIntoView()
            .setMeta("uiEvent", "cut"),
        );
  };
  function yu(n) {
    return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1
      ? n.content.firstChild
      : null;
  }
  function ku(n, e) {
    if (!n.dom.parentNode) return;
    let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code,
      r = n.dom.parentNode.appendChild(
        document.createElement(t ? "textarea" : "div"),
      );
    t || (r.contentEditable = "true"),
      (r.style.cssText = "position: fixed; left: -10000px; top: 10px"),
      r.focus();
    let o = n.input.shiftKey && n.input.lastKeyCode != 45;
    setTimeout(() => {
      n.focus(),
        r.parentNode && r.parentNode.removeChild(r),
        t
          ? Pt(n, r.value, null, o, e)
          : Pt(n, r.textContent, r.innerHTML, o, e);
    }, 50);
  }
  function Pt(n, e, t, r, o) {
    let s = ii(n, e, t, r, n.state.selection.$from);
    if (n.someProp("handlePaste", (c) => c(n, o, s || v.empty))) return !0;
    if (!s) return !1;
    let i = yu(s),
      l = i
        ? n.state.tr.replaceSelectionWith(i, r)
        : n.state.tr.replaceSelection(s);
    return (
      n.dispatch(
        l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste"),
      ),
      !0
    );
  }
  function yi(n) {
    let e = n.getData("text/plain") || n.getData("Text");
    if (e) return e;
    let t = n.getData("text/uri-list");
    return t ? t.replace(/\r?\n/g, " ") : "";
  }
  Y.paste = (n, e) => {
    let t = e;
    if (n.composing && !fe) return;
    let r = Bt ? null : t.clipboardData,
      o = n.input.shiftKey && n.input.lastKeyCode != 45;
    r && Pt(n, yi(r), r.getData("text/html"), o, t)
      ? t.preventDefault()
      : ku(n, t);
  };
  class ki {
    constructor(e, t, r) {
      (this.slice = e), (this.move = t), (this.node = r);
    }
  }
  const xi = se ? "altKey" : "ctrlKey";
  (Z.dragstart = (n, e) => {
    let t = e,
      r = n.input.mouseDown;
    if ((r && r.done(), !t.dataTransfer)) return;
    let o = n.state.selection,
      s = o.empty ? null : n.posAtCoords(yn(t)),
      i;
    if (
      !(s && s.pos >= o.from && s.pos <= (o instanceof D ? o.to - 1 : o.to))
    ) {
      if (r && r.mightDrag) i = D.create(n.state.doc, r.mightDrag.pos);
      else if (t.target && t.target.nodeType == 1) {
        let u = n.docView.nearestDesc(t.target, !0);
        u &&
          u.node.type.spec.draggable &&
          u != n.docView &&
          (i = D.create(n.state.doc, u.posBefore));
      }
    }
    let l = (i || n.state.selection).content(),
      { dom: c, text: a } = si(n, l);
    t.dataTransfer.clearData(),
      t.dataTransfer.setData(Bt ? "Text" : "text/html", c.innerHTML),
      (t.dataTransfer.effectAllowed = "copyMove"),
      Bt || t.dataTransfer.setData("text/plain", a),
      (n.dragging = new ki(l, !t[xi], i));
  }),
    (Z.dragend = (n) => {
      let e = n.dragging;
      window.setTimeout(() => {
        n.dragging == e && (n.dragging = null);
      }, 50);
    }),
    (Y.dragover = Y.dragenter = (n, e) => e.preventDefault()),
    (Y.drop = (n, e) => {
      let t = e,
        r = n.dragging;
      if (((n.dragging = null), !t.dataTransfer)) return;
      let o = n.posAtCoords(yn(t));
      if (!o) return;
      let s = n.state.doc.resolve(o.pos),
        i = r && r.slice;
      i
        ? n.someProp("transformPasted", (d) => {
            i = d(i, n);
          })
        : (i = ii(
            n,
            yi(t.dataTransfer),
            Bt ? null : t.dataTransfer.getData("text/html"),
            !1,
            s,
          ));
      let l = !!(r && !t[xi]);
      if (n.someProp("handleDrop", (d) => d(n, t, i || v.empty, l))) {
        t.preventDefault();
        return;
      }
      if (!i) return;
      t.preventDefault();
      let c = i ? cs(n.state.doc, s.pos, i) : s.pos;
      c == null && (c = s.pos);
      let a = n.state.tr;
      if (l) {
        let { node: d } = r;
        d ? d.replace(a) : a.deleteSelection();
      }
      let u = a.mapping.map(c),
        f = i.openStart == 0 && i.openEnd == 0 && i.content.childCount == 1,
        h = a.doc;
      if (
        (f
          ? a.replaceRangeWith(u, u, i.content.firstChild)
          : a.replaceRange(u, u, i),
        a.doc.eq(h))
      )
        return;
      let p = a.doc.resolve(u);
      if (
        f &&
        D.isSelectable(i.content.firstChild) &&
        p.nodeAfter &&
        p.nodeAfter.sameMarkup(i.content.firstChild)
      )
        a.setSelection(new D(p));
      else {
        let d = a.mapping.map(c);
        a.mapping.maps[a.mapping.maps.length - 1].forEach(
          (m, g, b, k) => (d = k),
        ),
          a.setSelection(wr(n, p, a.doc.resolve(d)));
      }
      n.focus(), n.dispatch(a.setMeta("uiEvent", "drop"));
    }),
    (Z.focus = (n) => {
      (n.input.lastFocus = Date.now()),
        n.focused ||
          (n.domObserver.stop(),
          n.dom.classList.add("ProseMirror-focused"),
          n.domObserver.start(),
          (n.focused = !0),
          setTimeout(() => {
            n.docView &&
              n.hasFocus() &&
              !n.domObserver.currentSelection.eq(n.domSelectionRange()) &&
              De(n);
          }, 20));
    }),
    (Z.blur = (n, e) => {
      let t = e;
      n.focused &&
        (n.domObserver.stop(),
        n.dom.classList.remove("ProseMirror-focused"),
        n.domObserver.start(),
        t.relatedTarget &&
          n.dom.contains(t.relatedTarget) &&
          n.domObserver.currentSelection.clear(),
        (n.focused = !1));
    }),
    (Z.beforeinput = (n, e) => {
      if (j && fe && e.inputType == "deleteContentBackward") {
        n.domObserver.flushSoon();
        let { domChangeCount: r } = n.input;
        setTimeout(() => {
          if (
            n.input.domChangeCount != r ||
            (n.dom.blur(),
            n.focus(),
            n.someProp("handleKeyDown", (s) => s(n, Ze(8, "Backspace"))))
          )
            return;
          let { $cursor: o } = n.state.selection;
          o &&
            o.pos > 0 &&
            n.dispatch(n.state.tr.delete(o.pos - 1, o.pos).scrollIntoView());
        }, 50);
      }
    });
  for (let n in Y) Z[n] = Y[n];
  function Vt(n, e) {
    if (n == e) return !0;
    for (let t in n) if (n[t] !== e[t]) return !1;
    for (let t in e) if (!(t in n)) return !1;
    return !0;
  }
  class xn {
    constructor(e, t) {
      (this.toDOM = e),
        (this.spec = t || et),
        (this.side = this.spec.side || 0);
    }
    map(e, t, r, o) {
      let { pos: s, deleted: i } = e.mapResult(
        t.from + o,
        this.side < 0 ? -1 : 1,
      );
      return i ? null : new le(s - r, s - r, this);
    }
    valid() {
      return !0;
    }
    eq(e) {
      return (
        this == e ||
        (e instanceof xn &&
          ((this.spec.key && this.spec.key == e.spec.key) ||
            (this.toDOM == e.toDOM && Vt(this.spec, e.spec))))
      );
    }
    destroy(e) {
      this.spec.destroy && this.spec.destroy(e);
    }
  }
  class Le {
    constructor(e, t) {
      (this.attrs = e), (this.spec = t || et);
    }
    map(e, t, r, o) {
      let s = e.map(t.from + o, this.spec.inclusiveStart ? -1 : 1) - r,
        i = e.map(t.to + o, this.spec.inclusiveEnd ? 1 : -1) - r;
      return s >= i ? null : new le(s, i, this);
    }
    valid(e, t) {
      return t.from < t.to;
    }
    eq(e) {
      return (
        this == e ||
        (e instanceof Le && Vt(this.attrs, e.attrs) && Vt(this.spec, e.spec))
      );
    }
    static is(e) {
      return e.type instanceof Le;
    }
    destroy() {}
  }
  class Mr {
    constructor(e, t) {
      (this.attrs = e), (this.spec = t || et);
    }
    map(e, t, r, o) {
      let s = e.mapResult(t.from + o, 1);
      if (s.deleted) return null;
      let i = e.mapResult(t.to + o, -1);
      return i.deleted || i.pos <= s.pos
        ? null
        : new le(s.pos - r, i.pos - r, this);
    }
    valid(e, t) {
      let { index: r, offset: o } = e.content.findIndex(t.from),
        s;
      return o == t.from && !(s = e.child(r)).isText && o + s.nodeSize == t.to;
    }
    eq(e) {
      return (
        this == e ||
        (e instanceof Mr && Vt(this.attrs, e.attrs) && Vt(this.spec, e.spec))
      );
    }
    destroy() {}
  }
  class le {
    constructor(e, t, r) {
      (this.from = e), (this.to = t), (this.type = r);
    }
    copy(e, t) {
      return new le(e, t, this.type);
    }
    eq(e, t = 0) {
      return (
        this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to
      );
    }
    map(e, t, r) {
      return this.type.map(e, this, t, r);
    }
    static widget(e, t, r) {
      return new le(e, e, new xn(t, r));
    }
    static inline(e, t, r, o) {
      return new le(e, t, new Le(r, o));
    }
    static node(e, t, r, o) {
      return new le(e, t, new Mr(r, o));
    }
    get spec() {
      return this.type.spec;
    }
    get inline() {
      return this.type instanceof Le;
    }
    get widget() {
      return this.type instanceof xn;
    }
  }
  const kt = [],
    et = {};
  class B {
    constructor(e, t) {
      (this.local = e.length ? e : kt), (this.children = t.length ? t : kt);
    }
    static create(e, t) {
      return t.length ? wn(t, e, 0, et) : J;
    }
    find(e, t, r) {
      let o = [];
      return this.findInner(e ?? 0, t ?? 1e9, o, 0, r), o;
    }
    findInner(e, t, r, o, s) {
      for (let i = 0; i < this.local.length; i++) {
        let l = this.local[i];
        l.from <= t &&
          l.to >= e &&
          (!s || s(l.spec)) &&
          r.push(l.copy(l.from + o, l.to + o));
      }
      for (let i = 0; i < this.children.length; i += 3)
        if (this.children[i] < t && this.children[i + 1] > e) {
          let l = this.children[i] + 1;
          this.children[i + 2].findInner(e - l, t - l, r, o + l, s);
        }
    }
    map(e, t, r) {
      return this == J || e.maps.length == 0
        ? this
        : this.mapInner(e, t, 0, 0, r || et);
    }
    mapInner(e, t, r, o, s) {
      let i;
      for (let l = 0; l < this.local.length; l++) {
        let c = this.local[l].map(e, r, o);
        c && c.type.valid(t, c)
          ? (i || (i = [])).push(c)
          : s.onRemove && s.onRemove(this.local[l].spec);
      }
      return this.children.length
        ? xu(this.children, i || [], e, t, r, o, s)
        : i
          ? new B(i.sort(tt), kt)
          : J;
    }
    add(e, t) {
      return t.length
        ? this == J
          ? B.create(e, t)
          : this.addInner(e, t, 0)
        : this;
    }
    addInner(e, t, r) {
      let o,
        s = 0;
      e.forEach((l, c) => {
        let a = c + r,
          u;
        if ((u = vi(t, l, a))) {
          for (o || (o = this.children.slice()); s < o.length && o[s] < c; )
            s += 3;
          o[s] == c
            ? (o[s + 2] = o[s + 2].addInner(l, u, a + 1))
            : o.splice(s, 0, c, c + l.nodeSize, wn(u, l, a + 1, et)),
            (s += 3);
        }
      });
      let i = wi(s ? Ci(t) : t, -r);
      for (let l = 0; l < i.length; l++)
        i[l].type.valid(e, i[l]) || i.splice(l--, 1);
      return new B(
        i.length ? this.local.concat(i).sort(tt) : this.local,
        o || this.children,
      );
    }
    remove(e) {
      return e.length == 0 || this == J ? this : this.removeInner(e, 0);
    }
    removeInner(e, t) {
      let r = this.children,
        o = this.local;
      for (let s = 0; s < r.length; s += 3) {
        let i,
          l = r[s] + t,
          c = r[s + 1] + t;
        for (let u = 0, f; u < e.length; u++)
          (f = e[u]) &&
            f.from > l &&
            f.to < c &&
            ((e[u] = null), (i || (i = [])).push(f));
        if (!i) continue;
        r == this.children && (r = this.children.slice());
        let a = r[s + 2].removeInner(i, l + 1);
        a != J ? (r[s + 2] = a) : (r.splice(s, 3), (s -= 3));
      }
      if (o.length) {
        for (let s = 0, i; s < e.length; s++)
          if ((i = e[s]))
            for (let l = 0; l < o.length; l++)
              o[l].eq(i, t) &&
                (o == this.local && (o = this.local.slice()), o.splice(l--, 1));
      }
      return r == this.children && o == this.local
        ? this
        : o.length || r.length
          ? new B(o, r)
          : J;
    }
    forChild(e, t) {
      if (this == J) return this;
      if (t.isLeaf) return B.empty;
      let r, o;
      for (let l = 0; l < this.children.length; l += 3)
        if (this.children[l] >= e) {
          this.children[l] == e && (r = this.children[l + 2]);
          break;
        }
      let s = e + 1,
        i = s + t.content.size;
      for (let l = 0; l < this.local.length; l++) {
        let c = this.local[l];
        if (c.from < i && c.to > s && c.type instanceof Le) {
          let a = Math.max(s, c.from) - s,
            u = Math.min(i, c.to) - s;
          a < u && (o || (o = [])).push(c.copy(a, u));
        }
      }
      if (o) {
        let l = new B(o.sort(tt), kt);
        return r ? new ze([l, r]) : l;
      }
      return r || J;
    }
    eq(e) {
      if (this == e) return !0;
      if (
        !(e instanceof B) ||
        this.local.length != e.local.length ||
        this.children.length != e.children.length
      )
        return !1;
      for (let t = 0; t < this.local.length; t++)
        if (!this.local[t].eq(e.local[t])) return !1;
      for (let t = 0; t < this.children.length; t += 3)
        if (
          this.children[t] != e.children[t] ||
          this.children[t + 1] != e.children[t + 1] ||
          !this.children[t + 2].eq(e.children[t + 2])
        )
          return !1;
      return !0;
    }
    locals(e) {
      return Tr(this.localsInner(e));
    }
    localsInner(e) {
      if (this == J) return kt;
      if (e.inlineContent || !this.local.some(Le.is)) return this.local;
      let t = [];
      for (let r = 0; r < this.local.length; r++)
        this.local[r].type instanceof Le || t.push(this.local[r]);
      return t;
    }
  }
  (B.empty = new B([], [])), (B.removeOverlap = Tr);
  const J = B.empty;
  class ze {
    constructor(e) {
      this.members = e;
    }
    map(e, t) {
      const r = this.members.map((o) => o.map(e, t, et));
      return ze.from(r);
    }
    forChild(e, t) {
      if (t.isLeaf) return B.empty;
      let r = [];
      for (let o = 0; o < this.members.length; o++) {
        let s = this.members[o].forChild(e, t);
        s != J && (s instanceof ze ? (r = r.concat(s.members)) : r.push(s));
      }
      return ze.from(r);
    }
    eq(e) {
      if (!(e instanceof ze) || e.members.length != this.members.length)
        return !1;
      for (let t = 0; t < this.members.length; t++)
        if (!this.members[t].eq(e.members[t])) return !1;
      return !0;
    }
    locals(e) {
      let t,
        r = !0;
      for (let o = 0; o < this.members.length; o++) {
        let s = this.members[o].localsInner(e);
        if (s.length)
          if (!t) t = s;
          else {
            r && ((t = t.slice()), (r = !1));
            for (let i = 0; i < s.length; i++) t.push(s[i]);
          }
      }
      return t ? Tr(r ? t : t.sort(tt)) : kt;
    }
    static from(e) {
      switch (e.length) {
        case 0:
          return J;
        case 1:
          return e[0];
        default:
          return new ze(
            e.every((t) => t instanceof B)
              ? e
              : e.reduce(
                  (t, r) => t.concat(r instanceof B ? r : r.members),
                  [],
                ),
          );
      }
    }
  }
  function xu(n, e, t, r, o, s, i) {
    let l = n.slice();
    for (let a = 0, u = s; a < t.maps.length; a++) {
      let f = 0;
      t.maps[a].forEach((h, p, d, m) => {
        let g = m - d - (p - h);
        for (let b = 0; b < l.length; b += 3) {
          let k = l[b + 1];
          if (k < 0 || h > k + u - f) continue;
          let S = l[b] + u - f;
          p >= S
            ? (l[b + 1] = h <= S ? -2 : -1)
            : h >= u && g && ((l[b] += g), (l[b + 1] += g));
        }
        f += g;
      }),
        (u = t.maps[a].map(u, -1));
    }
    let c = !1;
    for (let a = 0; a < l.length; a += 3)
      if (l[a + 1] < 0) {
        if (l[a + 1] == -2) {
          (c = !0), (l[a + 1] = -1);
          continue;
        }
        let u = t.map(n[a] + s),
          f = u - o;
        if (f < 0 || f >= r.content.size) {
          c = !0;
          continue;
        }
        let h = t.map(n[a + 1] + s, -1),
          p = h - o,
          { index: d, offset: m } = r.content.findIndex(f),
          g = r.maybeChild(d);
        if (g && m == f && m + g.nodeSize == p) {
          let b = l[a + 2].mapInner(t, g, u + 1, n[a] + s + 1, i);
          b != J
            ? ((l[a] = f), (l[a + 1] = p), (l[a + 2] = b))
            : ((l[a + 1] = -2), (c = !0));
        } else c = !0;
      }
    if (c) {
      let a = wu(l, n, e, t, o, s, i),
        u = wn(a, r, 0, i);
      e = u.local;
      for (let f = 0; f < l.length; f += 3)
        l[f + 1] < 0 && (l.splice(f, 3), (f -= 3));
      for (let f = 0, h = 0; f < u.children.length; f += 3) {
        let p = u.children[f];
        for (; h < l.length && l[h] < p; ) h += 3;
        l.splice(h, 0, u.children[f], u.children[f + 1], u.children[f + 2]);
      }
    }
    return new B(e.sort(tt), l);
  }
  function wi(n, e) {
    if (!e || !n.length) return n;
    let t = [];
    for (let r = 0; r < n.length; r++) {
      let o = n[r];
      t.push(new le(o.from + e, o.to + e, o.type));
    }
    return t;
  }
  function wu(n, e, t, r, o, s, i) {
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
  function vi(n, e, t) {
    if (e.isLeaf) return null;
    let r = t + e.nodeSize,
      o = null;
    for (let s = 0, i; s < n.length; s++)
      (i = n[s]) &&
        i.from > t &&
        i.to < r &&
        ((o || (o = [])).push(i), (n[s] = null));
    return o;
  }
  function Ci(n) {
    let e = [];
    for (let t = 0; t < n.length; t++) n[t] != null && e.push(n[t]);
    return e;
  }
  function wn(n, e, t, r) {
    let o = [],
      s = !1;
    e.forEach((l, c) => {
      let a = vi(n, l, c + t);
      if (a) {
        s = !0;
        let u = wn(a, l, t + c + 1, r);
        u != J && o.push(c, c + l.nodeSize, u);
      }
    });
    let i = wi(s ? Ci(n) : n, -t).sort(tt);
    for (let l = 0; l < i.length; l++)
      i[l].type.valid(e, i[l]) ||
        (r.onRemove && r.onRemove(i[l].spec), i.splice(l--, 1));
    return i.length || o.length ? new B(i, o) : J;
  }
  function tt(n, e) {
    return n.from - e.from || n.to - e.to;
  }
  function Tr(n) {
    let e = n;
    for (let t = 0; t < e.length - 1; t++) {
      let r = e[t];
      if (r.from != r.to)
        for (let o = t + 1; o < e.length; o++) {
          let s = e[o];
          if (s.from == r.from) {
            s.to != r.to &&
              (e == n && (e = n.slice()),
              (e[o] = s.copy(s.from, r.to)),
              Si(e, o + 1, s.copy(r.to, s.to)));
            continue;
          } else {
            s.from < r.to &&
              (e == n && (e = n.slice()),
              (e[t] = r.copy(r.from, s.from)),
              Si(e, o, r.copy(s.from, r.to)));
            break;
          }
        }
    }
    return e;
  }
  function Si(n, e, t) {
    for (; e < n.length && tt(t, n[e]) > 0; ) e++;
    n.splice(e, 0, t);
  }
  function qr(n) {
    let e = [];
    return (
      n.someProp("decorations", (t) => {
        let r = t(n.state);
        r && r != J && e.push(r);
      }),
      n.cursorWrapper && e.push(B.create(n.state.doc, [n.cursorWrapper.deco])),
      ze.from(e)
    );
  }
  const vu = {
      childList: !0,
      characterData: !0,
      characterDataOldValue: !0,
      attributes: !0,
      attributeOldValue: !0,
      subtree: !0,
    },
    Cu = X && qe <= 11;
  class Su {
    constructor() {
      (this.anchorNode = null),
        (this.anchorOffset = 0),
        (this.focusNode = null),
        (this.focusOffset = 0);
    }
    set(e) {
      (this.anchorNode = e.anchorNode),
        (this.anchorOffset = e.anchorOffset),
        (this.focusNode = e.focusNode),
        (this.focusOffset = e.focusOffset);
    }
    clear() {
      this.anchorNode = this.focusNode = null;
    }
    eq(e) {
      return (
        e.anchorNode == this.anchorNode &&
        e.anchorOffset == this.anchorOffset &&
        e.focusNode == this.focusNode &&
        e.focusOffset == this.focusOffset
      );
    }
  }
  class Du {
    constructor(e, t) {
      (this.view = e),
        (this.handleDOMChange = t),
        (this.queue = []),
        (this.flushingSoon = -1),
        (this.observer = null),
        (this.currentSelection = new Su()),
        (this.onCharData = null),
        (this.suppressingSelectionUpdates = !1),
        (this.observer =
          window.MutationObserver &&
          new window.MutationObserver((r) => {
            for (let o = 0; o < r.length; o++) this.queue.push(r[o]);
            X &&
            qe <= 11 &&
            r.some(
              (o) =>
                (o.type == "childList" && o.removedNodes.length) ||
                (o.type == "characterData" &&
                  o.oldValue.length > o.target.nodeValue.length),
            )
              ? this.flushSoon()
              : this.flush();
          })),
        Cu &&
          (this.onCharData = (r) => {
            this.queue.push({
              target: r.target,
              type: "characterData",
              oldValue: r.prevValue,
            }),
              this.flushSoon();
          }),
        (this.onSelectionChange = this.onSelectionChange.bind(this));
    }
    flushSoon() {
      this.flushingSoon < 0 &&
        (this.flushingSoon = window.setTimeout(() => {
          (this.flushingSoon = -1), this.flush();
        }, 20));
    }
    forceFlush() {
      this.flushingSoon > -1 &&
        (window.clearTimeout(this.flushingSoon),
        (this.flushingSoon = -1),
        this.flush());
    }
    start() {
      this.observer &&
        (this.observer.takeRecords(), this.observer.observe(this.view.dom, vu)),
        this.onCharData &&
          this.view.dom.addEventListener(
            "DOMCharacterDataModified",
            this.onCharData,
          ),
        this.connectSelection();
    }
    stop() {
      if (this.observer) {
        let e = this.observer.takeRecords();
        if (e.length) {
          for (let t = 0; t < e.length; t++) this.queue.push(e[t]);
          window.setTimeout(() => this.flush(), 20);
        }
        this.observer.disconnect();
      }
      this.onCharData &&
        this.view.dom.removeEventListener(
          "DOMCharacterDataModified",
          this.onCharData,
        ),
        this.disconnectSelection();
    }
    connectSelection() {
      this.view.dom.ownerDocument.addEventListener(
        "selectionchange",
        this.onSelectionChange,
      );
    }
    disconnectSelection() {
      this.view.dom.ownerDocument.removeEventListener(
        "selectionchange",
        this.onSelectionChange,
      );
    }
    suppressSelectionUpdates() {
      (this.suppressingSelectionUpdates = !0),
        setTimeout(() => (this.suppressingSelectionUpdates = !1), 50);
    }
    onSelectionChange() {
      if (Ys(this.view)) {
        if (this.suppressingSelectionUpdates) return De(this.view);
        if (X && qe <= 11 && !this.view.state.selection.empty) {
          let e = this.view.domSelectionRange();
          if (
            e.focusNode &&
            Ke(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset)
          )
            return this.flushSoon();
        }
        this.flush();
      }
    }
    setCurSelection() {
      this.currentSelection.set(this.view.domSelectionRange());
    }
    ignoreSelectionChange(e) {
      if (!e.focusNode) return !0;
      let t = new Set(),
        r;
      for (let s = e.focusNode; s; s = Ot(s)) t.add(s);
      for (let s = e.anchorNode; s; s = Ot(s))
        if (t.has(s)) {
          r = s;
          break;
        }
      let o = r && this.view.docView.nearestDesc(r);
      if (
        o &&
        o.ignoreMutation({
          type: "selection",
          target: r.nodeType == 3 ? r.parentNode : r,
        })
      )
        return this.setCurSelection(), !0;
    }
    pendingRecords() {
      if (this.observer)
        for (let e of this.observer.takeRecords()) this.queue.push(e);
      return this.queue;
    }
    flush() {
      let { view: e } = this;
      if (!e.docView || this.flushingSoon > -1) return;
      let t = this.pendingRecords();
      t.length && (this.queue = []);
      let r = e.domSelectionRange(),
        o =
          !this.suppressingSelectionUpdates &&
          !this.currentSelection.eq(r) &&
          Ys(e) &&
          !this.ignoreSelectionChange(r),
        s = -1,
        i = -1,
        l = !1,
        c = [];
      if (e.editable)
        for (let u = 0; u < t.length; u++) {
          let f = this.registerMutation(t[u], c);
          f &&
            ((s = s < 0 ? f.from : Math.min(f.from, s)),
            (i = i < 0 ? f.to : Math.max(f.to, i)),
            f.typeOver && (l = !0));
        }
      if (ue && c.length > 1) {
        let u = c.filter((f) => f.nodeName == "BR");
        if (u.length == 2) {
          let f = u[0],
            h = u[1];
          f.parentNode && f.parentNode.parentNode == h.parentNode
            ? h.remove()
            : f.remove();
        }
      }
      let a = null;
      s < 0 &&
      o &&
      e.input.lastFocus > Date.now() - 200 &&
      Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 &&
      mn(r) &&
      (a = kr(e)) &&
      a.eq(T.near(e.state.doc.resolve(0), 1))
        ? ((e.input.lastFocus = 0),
          De(e),
          this.currentSelection.set(r),
          e.scrollToSelection())
        : (s > -1 || o) &&
          (s > -1 && (e.docView.markDirty(s, i), Eu(e)),
          this.handleDOMChange(s, i, l, c),
          e.docView && e.docView.dirty
            ? e.updateState(e.state)
            : this.currentSelection.eq(r) || De(e),
          this.currentSelection.set(r));
    }
    registerMutation(e, t) {
      if (t.indexOf(e.target) > -1) return null;
      let r = this.view.docView.nearestDesc(e.target);
      if (
        (e.type == "attributes" &&
          (r == this.view.docView ||
            e.attributeName == "contenteditable" ||
            (e.attributeName == "style" &&
              !e.oldValue &&
              !e.target.getAttribute("style")))) ||
        !r ||
        r.ignoreMutation(e)
      )
        return null;
      if (e.type == "childList") {
        for (let u = 0; u < e.addedNodes.length; u++) t.push(e.addedNodes[u]);
        if (
          r.contentDOM &&
          r.contentDOM != r.dom &&
          !r.contentDOM.contains(e.target)
        )
          return { from: r.posBefore, to: r.posAfter };
        let o = e.previousSibling,
          s = e.nextSibling;
        if (X && qe <= 11 && e.addedNodes.length)
          for (let u = 0; u < e.addedNodes.length; u++) {
            let { previousSibling: f, nextSibling: h } = e.addedNodes[u];
            (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) &&
              (o = f),
              (!h || Array.prototype.indexOf.call(e.addedNodes, h) < 0) &&
                (s = h);
          }
        let i = o && o.parentNode == e.target ? W(o) + 1 : 0,
          l = r.localPosFromDOM(e.target, i, -1),
          c = s && s.parentNode == e.target ? W(s) : e.target.childNodes.length,
          a = r.localPosFromDOM(e.target, c, 1);
        return { from: l, to: a };
      } else
        return e.type == "attributes"
          ? { from: r.posAtStart - r.border, to: r.posAtEnd + r.border }
          : {
              from: r.posAtStart,
              to: r.posAtEnd,
              typeOver: e.target.nodeValue == e.oldValue,
            };
    }
  }
  let Di = new WeakMap(),
    Ei = !1;
  function Eu(n) {
    if (
      !Di.has(n) &&
      (Di.set(n, null),
      ["normal", "nowrap", "pre-line"].indexOf(
        getComputedStyle(n.dom).whiteSpace,
      ) !== -1)
    ) {
      if (((n.requiresGeckoHackNode = ue), Ei)) return;
      console.warn(
        "ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package.",
      ),
        (Ei = !0);
    }
  }
  function Au(n) {
    let e;
    function t(c) {
      c.preventDefault(),
        c.stopImmediatePropagation(),
        (e = c.getTargetRanges()[0]);
    }
    n.dom.addEventListener("beforeinput", t, !0),
      document.execCommand("indent"),
      n.dom.removeEventListener("beforeinput", t, !0);
    let r = e.startContainer,
      o = e.startOffset,
      s = e.endContainer,
      i = e.endOffset,
      l = n.domAtPos(n.state.selection.anchor);
    return (
      Ke(l.node, l.offset, s, i) && ([r, o, s, i] = [s, i, r, o]),
      { anchorNode: r, anchorOffset: o, focusNode: s, focusOffset: i }
    );
  }
  function _u(n, e, t) {
    let {
        node: r,
        fromOffset: o,
        toOffset: s,
        from: i,
        to: l,
      } = n.docView.parseRange(e, t),
      c = n.domSelectionRange(),
      a,
      u = c.anchorNode;
    if (
      (u &&
        n.dom.contains(u.nodeType == 1 ? u : u.parentNode) &&
        ((a = [{ node: u, offset: c.anchorOffset }]),
        mn(c) || a.push({ node: c.focusNode, offset: c.focusOffset })),
      j && n.input.lastKeyCode === 8)
    )
      for (let g = s; g > o; g--) {
        let b = r.childNodes[g - 1],
          k = b.pmViewDesc;
        if (b.nodeName == "BR" && !k) {
          s = g;
          break;
        }
        if (!k || k.size) break;
      }
    let f = n.state.doc,
      h = n.someProp("domParser") || it.fromSchema(n.state.schema),
      p = f.resolve(i),
      d = null,
      m = h.parse(r, {
        topNode: p.parent,
        topMatch: p.parent.contentMatchAt(p.index()),
        topOpen: !0,
        from: o,
        to: s,
        preserveWhitespace: p.parent.type.whitespace == "pre" ? "full" : !0,
        findPositions: a,
        ruleFromNode: Mu,
        context: p,
      });
    if (a && a[0].pos != null) {
      let g = a[0].pos,
        b = a[1] && a[1].pos;
      b == null && (b = g), (d = { anchor: g + i, head: b + i });
    }
    return { doc: m, sel: d, from: i, to: l };
  }
  function Mu(n) {
    let e = n.pmViewDesc;
    if (e) return e.parseRule();
    if (n.nodeName == "BR" && n.parentNode) {
      if (K && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
        let t = document.createElement("div");
        return t.appendChild(document.createElement("li")), { skip: t };
      } else if (
        n.parentNode.lastChild == n ||
        (K && /^(tr|table)$/i.test(n.parentNode.nodeName))
      )
        return { ignore: !0 };
    } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
      return { ignore: !0 };
    return null;
  }
  const Tu =
    /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
  function qu(n, e, t, r, o) {
    let s =
      n.input.compositionPendingChanges ||
      (n.composing ? n.input.compositionID : 0);
    if (((n.input.compositionPendingChanges = 0), e < 0)) {
      let E =
          n.input.lastSelectionTime > Date.now() - 50
            ? n.input.lastSelectionOrigin
            : null,
        M = kr(n, E);
      if (M && !n.state.selection.eq(M)) {
        if (
          j &&
          fe &&
          n.input.lastKeyCode === 13 &&
          Date.now() - 100 < n.input.lastKeyCodeTime &&
          n.someProp("handleKeyDown", (Ue) => Ue(n, Ze(13, "Enter")))
        )
          return;
        let Q = n.state.tr.setSelection(M);
        E == "pointer"
          ? Q.setMeta("pointer", !0)
          : E == "key" && Q.scrollIntoView(),
          s && Q.setMeta("composition", s),
          n.dispatch(Q);
      }
      return;
    }
    let i = n.state.doc.resolve(e),
      l = i.sharedDepth(t);
    (e = i.before(l + 1)), (t = n.state.doc.resolve(t).after(l + 1));
    let c = n.state.selection,
      a = _u(n, e, t),
      u = n.state.doc,
      f = u.slice(a.from, a.to),
      h,
      p;
    n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime
      ? ((h = n.state.selection.to), (p = "end"))
      : ((h = n.state.selection.from), (p = "start")),
      (n.input.lastKeyCode = null);
    let d = Ru(f.content, a.doc.content, a.from, h, p);
    if (
      ((mt && n.input.lastIOSEnter > Date.now() - 225) || fe) &&
      o.some((E) => E.nodeType == 1 && !Tu.test(E.nodeName)) &&
      (!d || d.endA >= d.endB) &&
      n.someProp("handleKeyDown", (E) => E(n, Ze(13, "Enter")))
    ) {
      n.input.lastIOSEnter = 0;
      return;
    }
    if (!d)
      if (
        r &&
        c instanceof I &&
        !c.empty &&
        c.$head.sameParent(c.$anchor) &&
        !n.composing &&
        !(a.sel && a.sel.anchor != a.sel.head)
      )
        d = { start: c.from, endA: c.to, endB: c.to };
      else {
        if (a.sel) {
          let E = Ai(n, n.state.doc, a.sel);
          if (E && !E.eq(n.state.selection)) {
            let M = n.state.tr.setSelection(E);
            s && M.setMeta("composition", s), n.dispatch(M);
          }
        }
        return;
      }
    if (
      j &&
      n.cursorWrapper &&
      a.sel &&
      a.sel.anchor == n.cursorWrapper.deco.from &&
      a.sel.head == a.sel.anchor
    ) {
      let E = d.endB - d.start;
      a.sel = { anchor: a.sel.anchor + E, head: a.sel.anchor + E };
    }
    n.input.domChangeCount++,
      n.state.selection.from < n.state.selection.to &&
        d.start == d.endB &&
        n.state.selection instanceof I &&
        (d.start > n.state.selection.from &&
        d.start <= n.state.selection.from + 2 &&
        n.state.selection.from >= a.from
          ? (d.start = n.state.selection.from)
          : d.endA < n.state.selection.to &&
            d.endA >= n.state.selection.to - 2 &&
            n.state.selection.to <= a.to &&
            ((d.endB += n.state.selection.to - d.endA),
            (d.endA = n.state.selection.to))),
      X &&
        qe <= 11 &&
        d.endB == d.start + 1 &&
        d.endA == d.start &&
        d.start > a.from &&
        a.doc.textBetween(d.start - a.from - 1, d.start - a.from + 1) == "  " &&
        (d.start--, d.endA--, d.endB--);
    let m = a.doc.resolveNoCache(d.start - a.from),
      g = a.doc.resolveNoCache(d.endB - a.from),
      b = u.resolve(d.start),
      k = m.sameParent(g) && m.parent.inlineContent && b.end() >= d.endA,
      S;
    if (
      ((mt &&
        n.input.lastIOSEnter > Date.now() - 225 &&
        (!k || o.some((E) => E.nodeName == "DIV" || E.nodeName == "P"))) ||
        (!k &&
          m.pos < a.doc.content.size &&
          !m.sameParent(g) &&
          (S = T.findFrom(a.doc.resolve(m.pos + 1), 1, !0)) &&
          S.head == g.pos)) &&
      n.someProp("handleKeyDown", (E) => E(n, Ze(13, "Enter")))
    ) {
      n.input.lastIOSEnter = 0;
      return;
    }
    if (
      n.state.selection.anchor > d.start &&
      Ou(u, d.start, d.endA, m, g) &&
      n.someProp("handleKeyDown", (E) => E(n, Ze(8, "Backspace")))
    ) {
      fe && j && n.domObserver.suppressSelectionUpdates();
      return;
    }
    j && fe && d.endB == d.start && (n.input.lastAndroidDelete = Date.now()),
      fe &&
        !k &&
        m.start() != g.start() &&
        g.parentOffset == 0 &&
        m.depth == g.depth &&
        a.sel &&
        a.sel.anchor == a.sel.head &&
        a.sel.head == d.endA &&
        ((d.endB -= 2),
        (g = a.doc.resolveNoCache(d.endB - a.from)),
        setTimeout(() => {
          n.someProp("handleKeyDown", function (E) {
            return E(n, Ze(13, "Enter"));
          });
        }, 20));
    let A = d.start,
      _ = d.endA,
      x,
      N,
      L;
    if (k) {
      if (m.pos == g.pos)
        X &&
          qe <= 11 &&
          m.parentOffset == 0 &&
          (n.domObserver.suppressSelectionUpdates(),
          setTimeout(() => De(n), 20)),
          (x = n.state.tr.delete(A, _)),
          (N = u.resolve(d.start).marksAcross(u.resolve(d.endA)));
      else if (
        d.endA == d.endB &&
        (L = Nu(
          m.parent.content.cut(m.parentOffset, g.parentOffset),
          b.parent.content.cut(b.parentOffset, d.endA - b.start()),
        ))
      )
        (x = n.state.tr),
          L.type == "add"
            ? x.addMark(A, _, L.mark)
            : x.removeMark(A, _, L.mark);
      else if (
        m.parent.child(m.index()).isText &&
        m.index() == g.index() - (g.textOffset ? 0 : 1)
      ) {
        let E = m.parent.textBetween(m.parentOffset, g.parentOffset);
        if (n.someProp("handleTextInput", (M) => M(n, A, _, E))) return;
        x = n.state.tr.insertText(E, A, _);
      }
    }
    if (
      (x ||
        (x = n.state.tr.replace(
          A,
          _,
          a.doc.slice(d.start - a.from, d.endB - a.from),
        )),
      a.sel)
    ) {
      let E = Ai(n, x.doc, a.sel);
      E &&
        !(
          (j &&
            fe &&
            n.composing &&
            E.empty &&
            (d.start != d.endB ||
              n.input.lastAndroidDelete < Date.now() - 100) &&
            (E.head == A || E.head == x.mapping.map(_) - 1)) ||
          (X && E.empty && E.head == A)
        ) &&
        x.setSelection(E);
    }
    N && x.ensureMarks(N),
      s && x.setMeta("composition", s),
      n.dispatch(x.scrollIntoView());
  }
  function Ai(n, e, t) {
    return Math.max(t.anchor, t.head) > e.content.size
      ? null
      : wr(n, e.resolve(t.anchor), e.resolve(t.head));
  }
  function Nu(n, e) {
    let t = n.firstChild.marks,
      r = e.firstChild.marks,
      o = t,
      s = r,
      i,
      l,
      c;
    for (let u = 0; u < r.length; u++) o = r[u].removeFromSet(o);
    for (let u = 0; u < t.length; u++) s = t[u].removeFromSet(s);
    if (o.length == 1 && s.length == 0)
      (l = o[0]), (i = "add"), (c = (u) => u.mark(l.addToSet(u.marks)));
    else if (o.length == 0 && s.length == 1)
      (l = s[0]), (i = "remove"), (c = (u) => u.mark(l.removeFromSet(u.marks)));
    else return null;
    let a = [];
    for (let u = 0; u < e.childCount; u++) a.push(c(e.child(u)));
    if (y.from(a).eq(n)) return { mark: l, type: i };
  }
  function Ou(n, e, t, r, o) {
    if (
      !r.parent.isTextblock ||
      t - e <= o.pos - r.pos ||
      Nr(r, !0, !1) < o.pos
    )
      return !1;
    let s = n.resolve(e);
    if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
      return !1;
    let i = n.resolve(Nr(s, !0, !0));
    return !i.parent.isTextblock || i.pos > t || Nr(i, !0, !1) < t
      ? !1
      : r.parent.content.cut(r.parentOffset).eq(i.parent.content);
  }
  function Nr(n, e, t) {
    let r = n.depth,
      o = e ? n.end() : n.pos;
    for (; r > 0 && (e || n.indexAfter(r) == n.node(r).childCount); )
      r--, o++, (e = !1);
    if (t) {
      let s = n.node(r).maybeChild(n.indexAfter(r));
      for (; s && !s.isLeaf; ) (s = s.firstChild), o++;
    }
    return o;
  }
  function Ru(n, e, t, r, o) {
    let s = n.findDiffStart(e, t);
    if (s == null) return null;
    let { a: i, b: l } = n.findDiffEnd(e, t + n.size, t + e.size);
    if (o == "end") {
      let c = Math.max(0, s - Math.min(i, l));
      r -= i + c - s;
    }
    if (i < s && n.size < e.size) {
      let c = r <= s && r >= i ? s - r : 0;
      (s -= c),
        s && s < e.size && _i(e.textBetween(s - 1, s + 1)) && (s += c ? 1 : -1),
        (l = s + (l - i)),
        (i = s);
    } else if (l < s) {
      let c = r <= s && r >= l ? s - r : 0;
      (s -= c),
        s && s < n.size && _i(n.textBetween(s - 1, s + 1)) && (s += c ? 1 : -1),
        (i = s + (i - l)),
        (l = s);
    }
    return { start: s, endA: i, endB: l };
  }
  function _i(n) {
    if (n.length != 2) return !1;
    let e = n.charCodeAt(0),
      t = n.charCodeAt(1);
    return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
  }
  class Iu {
    constructor(e, t) {
      (this._root = null),
        (this.focused = !1),
        (this.trackWrites = null),
        (this.mounted = !1),
        (this.markCursor = null),
        (this.cursorWrapper = null),
        (this.lastSelectedViewDesc = void 0),
        (this.input = new nu()),
        (this.prevDirectPlugins = []),
        (this.pluginViews = []),
        (this.requiresGeckoHackNode = !1),
        (this.dragging = null),
        (this._props = t),
        (this.state = t.state),
        (this.directPlugins = t.plugins || []),
        this.directPlugins.forEach(Oi),
        (this.dispatch = this.dispatch.bind(this)),
        (this.dom = (e && e.mount) || document.createElement("div")),
        e &&
          (e.appendChild
            ? e.appendChild(this.dom)
            : typeof e == "function"
              ? e(this.dom)
              : e.mount && (this.mounted = !0)),
        (this.editable = qi(this)),
        Ti(this),
        (this.nodeViews = Ni(this)),
        (this.docView = Bs(this.state.doc, Mi(this), qr(this), this.dom, this)),
        (this.domObserver = new Du(this, (r, o, s, i) => qu(this, r, o, s, i))),
        this.domObserver.start(),
        ru(this),
        this.updatePluginViews();
    }
    get composing() {
      return this.input.composing;
    }
    get props() {
      if (this._props.state != this.state) {
        let e = this._props;
        this._props = {};
        for (let t in e) this._props[t] = e[t];
        this._props.state = this.state;
      }
      return this._props;
    }
    update(e) {
      e.handleDOMEvents != this._props.handleDOMEvents && Dr(this);
      let t = this._props;
      (this._props = e),
        e.plugins && (e.plugins.forEach(Oi), (this.directPlugins = e.plugins)),
        this.updateStateInner(e.state, t);
    }
    setProps(e) {
      let t = {};
      for (let r in this._props) t[r] = this._props[r];
      t.state = this.state;
      for (let r in e) t[r] = e[r];
      this.update(t);
    }
    updateState(e) {
      this.updateStateInner(e, this._props);
    }
    updateStateInner(e, t) {
      var r;
      let o = this.state,
        s = !1,
        i = !1;
      e.storedMarks && this.composing && (bi(this), (i = !0)), (this.state = e);
      let l = o.plugins != e.plugins || this._props.plugins != t.plugins;
      if (
        l ||
        this._props.plugins != t.plugins ||
        this._props.nodeViews != t.nodeViews
      ) {
        let p = Ni(this);
        zu(p, this.nodeViews) && ((this.nodeViews = p), (s = !0));
      }
      (l || t.handleDOMEvents != this._props.handleDOMEvents) && Dr(this),
        (this.editable = qi(this)),
        Ti(this);
      let c = qr(this),
        a = Mi(this),
        u =
          o.plugins != e.plugins && !o.doc.eq(e.doc)
            ? "reset"
            : e.scrollToSelection > o.scrollToSelection
              ? "to selection"
              : "preserve",
        f = s || !this.docView.matchesNode(e.doc, a, c);
      (f || !e.selection.eq(o.selection)) && (i = !0);
      let h =
        u == "preserve" &&
        i &&
        this.dom.style.overflowAnchor == null &&
        ba(this);
      if (i) {
        this.domObserver.stop();
        let p =
          f &&
          (X || j) &&
          !this.composing &&
          !o.selection.empty &&
          !e.selection.empty &&
          Lu(o.selection, e.selection);
        if (f) {
          let d = j
            ? (this.trackWrites = this.domSelectionRange().focusNode)
            : null;
          (s || !this.docView.update(e.doc, a, c, this)) &&
            (this.docView.updateOuterDeco([]),
            this.docView.destroy(),
            (this.docView = Bs(e.doc, a, c, this.dom, this))),
            d && !this.trackWrites && (p = !0);
        }
        p ||
        !(
          this.input.mouseDown &&
          this.domObserver.currentSelection.eq(this.domSelectionRange()) &&
          $a(this)
        )
          ? De(this, p)
          : (Ks(this, e.selection), this.domObserver.setCurSelection()),
          this.domObserver.start();
      }
      this.updatePluginViews(o),
        !((r = this.dragging) === null || r === void 0) &&
          r.node &&
          !o.doc.eq(e.doc) &&
          this.updateDraggedNode(this.dragging, o),
        u == "reset"
          ? (this.dom.scrollTop = 0)
          : u == "to selection"
            ? this.scrollToSelection()
            : h && ya(h);
    }
    scrollToSelection() {
      let e = this.domSelectionRange().focusNode;
      if (!this.someProp("handleScrollToSelection", (t) => t(this)))
        if (this.state.selection instanceof D) {
          let t = this.docView.domAfterPos(this.state.selection.from);
          t.nodeType == 1 && Es(this, t.getBoundingClientRect(), e);
        } else Es(this, this.coordsAtPos(this.state.selection.head, 1), e);
    }
    destroyPluginViews() {
      let e;
      for (; (e = this.pluginViews.pop()); ) e.destroy && e.destroy();
    }
    updatePluginViews(e) {
      if (
        !e ||
        e.plugins != this.state.plugins ||
        this.directPlugins != this.prevDirectPlugins
      ) {
        (this.prevDirectPlugins = this.directPlugins),
          this.destroyPluginViews();
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
      let r = e.node,
        o = -1;
      if (this.state.doc.nodeAt(r.from) == r.node) o = r.from;
      else {
        let s = r.from + (this.state.doc.content.size - t.doc.content.size);
        (s > 0 && this.state.doc.nodeAt(s)) == r.node && (o = s);
      }
      this.dragging = new ki(
        e.slice,
        e.move,
        o < 0 ? void 0 : D.create(this.state.doc, o),
      );
    }
    someProp(e, t) {
      let r = this._props && this._props[e],
        o;
      if (r != null && (o = t ? t(r) : r)) return o;
      for (let i = 0; i < this.directPlugins.length; i++) {
        let l = this.directPlugins[i].props[e];
        if (l != null && (o = t ? t(l) : l)) return o;
      }
      let s = this.state.plugins;
      if (s)
        for (let i = 0; i < s.length; i++) {
          let l = s[i].props[e];
          if (l != null && (o = t ? t(l) : l)) return o;
        }
    }
    hasFocus() {
      if (X) {
        let e = this.root.activeElement;
        if (e == this.dom) return !0;
        if (!e || !this.dom.contains(e)) return !1;
        for (; e && this.dom != e && this.dom.contains(e); ) {
          if (e.contentEditable == "false") return !1;
          e = e.parentElement;
        }
        return !0;
      }
      return this.root.activeElement == this.dom;
    }
    focus() {
      this.domObserver.stop(),
        this.editable && ka(this.dom),
        De(this),
        this.domObserver.start();
    }
    get root() {
      let e = this._root;
      if (e == null) {
        for (let t = this.dom.parentNode; t; t = t.parentNode)
          if (t.nodeType == 9 || (t.nodeType == 11 && t.host))
            return (
              t.getSelection ||
                (Object.getPrototypeOf(t).getSelection = () =>
                  t.ownerDocument.getSelection()),
              (this._root = t)
            );
      }
      return e || document;
    }
    updateRoot() {
      this._root = null;
    }
    posAtCoords(e) {
      return Sa(this, e);
    }
    coordsAtPos(e, t = 1) {
      return Ns(this, e, t);
    }
    domAtPos(e, t = 0) {
      return this.docView.domFromPos(e, t);
    }
    nodeDOM(e) {
      let t = this.docView.descAt(e);
      return t ? t.nodeDOM : null;
    }
    posAtDOM(e, t, r = -1) {
      let o = this.docView.posFromDOM(e, t, r);
      if (o == null) throw new RangeError("DOM position not inside the editor");
      return o;
    }
    endOfTextblock(e, t) {
      return Ma(this, t || this.state, e);
    }
    pasteHTML(e, t) {
      return Pt(this, "", e, !1, t || new ClipboardEvent("paste"));
    }
    pasteText(e, t) {
      return Pt(this, e, null, !0, t || new ClipboardEvent("paste"));
    }
    destroy() {
      this.docView &&
        (ou(this),
        this.destroyPluginViews(),
        this.mounted
          ? (this.docView.update(this.state.doc, [], qr(this), this),
            (this.dom.textContent = ""))
          : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom),
        this.docView.destroy(),
        (this.docView = null));
    }
    get isDestroyed() {
      return this.docView == null;
    }
    dispatchEvent(e) {
      return iu(this, e);
    }
    dispatch(e) {
      let t = this._props.dispatchTransaction;
      t ? t.call(this, e) : this.updateState(this.state.apply(e));
    }
    domSelectionRange() {
      return K &&
        this.root.nodeType === 11 &&
        ua(this.dom.ownerDocument) == this.dom
        ? Au(this)
        : this.domSelection();
    }
    domSelection() {
      return this.root.getSelection();
    }
  }
  function Mi(n) {
    let e = Object.create(null);
    return (
      (e.class = "ProseMirror"),
      (e.contenteditable = String(n.editable)),
      n.someProp("attributes", (t) => {
        if ((typeof t == "function" && (t = t(n.state)), t))
          for (let r in t)
            r == "class"
              ? (e.class += " " + t[r])
              : r == "style"
                ? (e.style = (e.style ? e.style + ";" : "") + t[r])
                : !e[r] &&
                  r != "contenteditable" &&
                  r != "nodeName" &&
                  (e[r] = String(t[r]));
      }),
      e.translate || (e.translate = "no"),
      [le.node(0, n.state.doc.content.size, e)]
    );
  }
  function Ti(n) {
    if (n.markCursor) {
      let e = document.createElement("img");
      (e.className = "ProseMirror-separator"),
        e.setAttribute("mark-placeholder", "true"),
        e.setAttribute("alt", ""),
        (n.cursorWrapper = {
          dom: e,
          deco: le.widget(n.state.selection.head, e, {
            raw: !0,
            marks: n.markCursor,
          }),
        });
    } else n.cursorWrapper = null;
  }
  function qi(n) {
    return !n.someProp("editable", (e) => e(n.state) === !1);
  }
  function Lu(n, e) {
    let t = Math.min(
      n.$anchor.sharedDepth(n.head),
      e.$anchor.sharedDepth(e.head),
    );
    return n.$anchor.start(t) != e.$anchor.start(t);
  }
  function Ni(n) {
    let e = Object.create(null);
    function t(r) {
      for (let o in r)
        Object.prototype.hasOwnProperty.call(e, o) || (e[o] = r[o]);
    }
    return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
  }
  function zu(n, e) {
    let t = 0,
      r = 0;
    for (let o in n) {
      if (n[o] != e[o]) return !0;
      t++;
    }
    for (let o in e) r++;
    return t != r;
  }
  function Oi(n) {
    if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
      throw new RangeError(
        "Plugins passed directly to the view must not have a state component",
      );
  }
  function re() {
    var n = arguments[0];
    typeof n == "string" && (n = document.createElement(n));
    var e = 1,
      t = arguments[1];
    if (t && typeof t == "object" && t.nodeType == null && !Array.isArray(t)) {
      for (var r in t)
        if (Object.prototype.hasOwnProperty.call(t, r)) {
          var o = t[r];
          typeof o == "string" ? n.setAttribute(r, o) : o != null && (n[r] = o);
        }
      e++;
    }
    for (; e < arguments.length; e++) Ri(n, arguments[e]);
    return n;
  }
  function Ri(n, e) {
    if (typeof e == "string") n.appendChild(document.createTextNode(e));
    else if (e != null)
      if (e.nodeType != null) n.appendChild(e);
      else if (Array.isArray(e)) for (var t = 0; t < e.length; t++) Ri(n, e[t]);
      else throw new RangeError("Unsupported child node: " + e);
  }
  const Ii = (n, e) =>
    n.selection.empty
      ? !1
      : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
  function Fu(n, e) {
    let { $cursor: t } = n.selection;
    return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0)
      ? null
      : t;
  }
  const Bu = (n, e, t) => {
    let r = Fu(n, t);
    if (!r) return !1;
    let o = Li(r);
    if (!o) {
      let i = r.blockRange(),
        l = i && _t(i);
      return l == null ? !1 : (e && e(n.tr.lift(i, l).scrollIntoView()), !0);
    }
    let s = o.nodeBefore;
    if (!s.type.spec.isolating && Bi(n, o, e)) return !0;
    if (r.parent.content.size == 0 && (xt(s, "end") || D.isSelectable(s))) {
      let i = rr(n.doc, r.before(), r.after(), v.empty);
      if (i && i.slice.size < i.to - i.from) {
        if (e) {
          let l = n.tr.step(i);
          l.setSelection(
            xt(s, "end")
              ? T.findFrom(l.doc.resolve(l.mapping.map(o.pos, -1)), -1)
              : D.create(l.doc, o.pos - s.nodeSize),
          ),
            e(l.scrollIntoView());
        }
        return !0;
      }
    }
    return s.isAtom && o.depth == r.depth - 1
      ? (e && e(n.tr.delete(o.pos - s.nodeSize, o.pos).scrollIntoView()), !0)
      : !1;
  };
  function xt(n, e, t = !1) {
    for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
      if (r.isTextblock) return !0;
      if (t && r.childCount != 1) return !1;
    }
    return !1;
  }
  const Pu = (n, e, t) => {
    let { $head: r, empty: o } = n.selection,
      s = r;
    if (!o) return !1;
    if (r.parent.isTextblock) {
      if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0) return !1;
      s = Li(r);
    }
    let i = s && s.nodeBefore;
    return !i || !D.isSelectable(i)
      ? !1
      : (e &&
          e(
            n.tr
              .setSelection(D.create(n.doc, s.pos - i.nodeSize))
              .scrollIntoView(),
          ),
        !0);
  };
  function Li(n) {
    if (!n.parent.type.spec.isolating)
      for (let e = n.depth - 1; e >= 0; e--) {
        if (n.index(e) > 0) return n.doc.resolve(n.before(e + 1));
        if (n.node(e).type.spec.isolating) break;
      }
    return null;
  }
  function Vu(n, e) {
    let { $cursor: t } = n.selection;
    return !t ||
      (e
        ? !e.endOfTextblock("forward", n)
        : t.parentOffset < t.parent.content.size)
      ? null
      : t;
  }
  const $u = (n, e, t) => {
      let r = Vu(n, t);
      if (!r) return !1;
      let o = zi(r);
      if (!o) return !1;
      let s = o.nodeAfter;
      if (Bi(n, o, e)) return !0;
      if (r.parent.content.size == 0 && (xt(s, "start") || D.isSelectable(s))) {
        let i = rr(n.doc, r.before(), r.after(), v.empty);
        if (i && i.slice.size < i.to - i.from) {
          if (e) {
            let l = n.tr.step(i);
            l.setSelection(
              xt(s, "start")
                ? T.findFrom(l.doc.resolve(l.mapping.map(o.pos)), 1)
                : D.create(l.doc, l.mapping.map(o.pos)),
            ),
              e(l.scrollIntoView());
          }
          return !0;
        }
      }
      return s.isAtom && o.depth == r.depth - 1
        ? (e && e(n.tr.delete(o.pos, o.pos + s.nodeSize).scrollIntoView()), !0)
        : !1;
    },
    Uu = (n, e, t) => {
      let { $head: r, empty: o } = n.selection,
        s = r;
      if (!o) return !1;
      if (r.parent.isTextblock) {
        if (
          t
            ? !t.endOfTextblock("forward", n)
            : r.parentOffset < r.parent.content.size
        )
          return !1;
        s = zi(r);
      }
      let i = s && s.nodeAfter;
      return !i || !D.isSelectable(i)
        ? !1
        : (e && e(n.tr.setSelection(D.create(n.doc, s.pos)).scrollIntoView()),
          !0);
    };
  function zi(n) {
    if (!n.parent.type.spec.isolating)
      for (let e = n.depth - 1; e >= 0; e--) {
        let t = n.node(e);
        if (n.index(e) + 1 < t.childCount) return n.doc.resolve(n.after(e + 1));
        if (t.type.spec.isolating) break;
      }
    return null;
  }
  const Or = (n, e) => {
      let t = n.selection,
        r = t instanceof D,
        o;
      if (r) {
        if (t.node.isTextblock || !ut(n.doc, t.from)) return !1;
        o = t.from;
      } else if (((o = ls(n.doc, t.from, -1)), o == null)) return !1;
      if (e) {
        let s = n.tr.join(o);
        r &&
          s.setSelection(
            D.create(s.doc, o - n.doc.resolve(o).nodeBefore.nodeSize),
          ),
          e(s.scrollIntoView());
      }
      return !0;
    },
    Hu = (n, e) => {
      let t = n.selection,
        r;
      if (t instanceof D) {
        if (t.node.isTextblock || !ut(n.doc, t.to)) return !1;
        r = t.to;
      } else if (((r = ls(n.doc, t.to, 1)), r == null)) return !1;
      return e && e(n.tr.join(r).scrollIntoView()), !0;
    },
    Rr = (n, e) => {
      let { $from: t, $to: r } = n.selection,
        o = t.blockRange(r),
        s = o && _t(o);
      return s == null ? !1 : (e && e(n.tr.lift(o, s).scrollIntoView()), !0);
    },
    Gu = (n, e) => {
      let { $head: t, $anchor: r } = n.selection;
      return !t.parent.type.spec.code || !t.sameParent(r)
        ? !1
        : (e &&
            e(
              n.tr
                .insertText(
                  `
`,
                )
                .scrollIntoView(),
            ),
          !0);
    };
  function Ir(n) {
    for (let e = 0; e < n.edgeCount; e++) {
      let { type: t } = n.edge(e);
      if (t.isTextblock && !t.hasRequiredAttrs()) return t;
    }
    return null;
  }
  const Fi = (n, e) => {
      let { $head: t, $anchor: r } = n.selection;
      if (!t.parent.type.spec.code || !t.sameParent(r)) return !1;
      let o = t.node(-1),
        s = t.indexAfter(-1),
        i = Ir(o.contentMatchAt(s));
      if (!i || !o.canReplaceWith(s, s, i)) return !1;
      if (e) {
        let l = t.after(),
          c = n.tr.replaceWith(l, l, i.createAndFill());
        c.setSelection(T.near(c.doc.resolve(l), 1)), e(c.scrollIntoView());
      }
      return !0;
    },
    ju = (n, e) => {
      let t = n.selection,
        { $from: r, $to: o } = t;
      if (t instanceof ne || r.parent.inlineContent || o.parent.inlineContent)
        return !1;
      let s = Ir(o.parent.contentMatchAt(o.indexAfter()));
      if (!s || !s.isTextblock) return !1;
      if (e) {
        let i = (!r.parentOffset && o.index() < o.parent.childCount ? r : o)
            .pos,
          l = n.tr.insert(i, s.createAndFill());
        l.setSelection(I.create(l.doc, i + 1)), e(l.scrollIntoView());
      }
      return !0;
    },
    Ju = (n, e) => {
      let { $cursor: t } = n.selection;
      if (!t || t.parent.content.size) return !1;
      if (t.depth > 1 && t.after() != t.end(-1)) {
        let s = t.before();
        if (at(n.doc, s)) return e && e(n.tr.split(s).scrollIntoView()), !0;
      }
      let r = t.blockRange(),
        o = r && _t(r);
      return o == null ? !1 : (e && e(n.tr.lift(r, o).scrollIntoView()), !0);
    };
  function Wu(n) {
    return (e, t) => {
      let { $from: r, $to: o } = e.selection;
      if (e.selection instanceof D && e.selection.node.isBlock)
        return !r.parentOffset || !at(e.doc, r.pos)
          ? !1
          : (t && t(e.tr.split(r.pos).scrollIntoView()), !0);
      if (!r.parent.isBlock) return !1;
      if (t) {
        let s = o.parentOffset == o.parent.content.size,
          i = e.tr;
        (e.selection instanceof I || e.selection instanceof ne) &&
          i.deleteSelection();
        let l =
            r.depth == 0
              ? null
              : Ir(r.node(-1).contentMatchAt(r.indexAfter(-1))),
          c = n && n(o.parent, s),
          a = c ? [c] : s && l ? [{ type: l }] : void 0,
          u = at(i.doc, i.mapping.map(r.pos), 1, a);
        if (
          (!a &&
            !u &&
            at(i.doc, i.mapping.map(r.pos), 1, l ? [{ type: l }] : void 0) &&
            (l && (a = [{ type: l }]), (u = !0)),
          u &&
            (i.split(i.mapping.map(r.pos), 1, a),
            !s && !r.parentOffset && r.parent.type != l))
        ) {
          let f = i.mapping.map(r.before()),
            h = i.doc.resolve(f);
          l &&
            r.node(-1).canReplaceWith(h.index(), h.index() + 1, l) &&
            i.setNodeMarkup(i.mapping.map(r.before()), l);
        }
        t(i.scrollIntoView());
      }
      return !0;
    };
  }
  const Ku = Wu(),
    Lr = (n, e) => {
      let { $from: t, to: r } = n.selection,
        o,
        s = t.sharedDepth(r);
      return s == 0
        ? !1
        : ((o = t.before(s)),
          e && e(n.tr.setSelection(D.create(n.doc, o))),
          !0);
    },
    Zu = (n, e) => (e && e(n.tr.setSelection(new ne(n.doc))), !0);
  function Yu(n, e, t) {
    let r = e.nodeBefore,
      o = e.nodeAfter,
      s = e.index();
    return !r || !o || !r.type.compatibleContent(o.type)
      ? !1
      : !r.content.size && e.parent.canReplace(s - 1, s)
        ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0)
        : !e.parent.canReplace(s, s + 1) || !(o.isTextblock || ut(n.doc, e.pos))
          ? !1
          : (t &&
              t(
                n.tr
                  .clearIncompatible(
                    e.pos,
                    r.type,
                    r.contentMatchAt(r.childCount),
                  )
                  .join(e.pos)
                  .scrollIntoView(),
              ),
            !0);
  }
  function Bi(n, e, t) {
    let r = e.nodeBefore,
      o = e.nodeAfter,
      s,
      i;
    if (r.type.spec.isolating || o.type.spec.isolating) return !1;
    if (Yu(n, e, t)) return !0;
    let l = e.parent.canReplace(e.index(), e.index() + 1);
    if (
      l &&
      (s = (i = r.contentMatchAt(r.childCount)).findWrapping(o.type)) &&
      i.matchType(s[0] || o.type).validEnd
    ) {
      if (t) {
        let f = e.pos + o.nodeSize,
          h = y.empty;
        for (let m = s.length - 1; m >= 0; m--)
          h = y.from(s[m].create(null, h));
        h = y.from(r.copy(h));
        let p = n.tr.step(
            new $(e.pos - 1, f, e.pos, f, new v(h, 1, 0), s.length, !0),
          ),
          d = f + 2 * s.length;
        ut(p.doc, d) && p.join(d), t(p.scrollIntoView());
      }
      return !0;
    }
    let c = T.findFrom(e, 1),
      a = c && c.$from.blockRange(c.$to),
      u = a && _t(a);
    if (u != null && u >= e.depth)
      return t && t(n.tr.lift(a, u).scrollIntoView()), !0;
    if (l && xt(o, "start", !0) && xt(r, "end")) {
      let f = r,
        h = [];
      for (; h.push(f), !f.isTextblock; ) f = f.lastChild;
      let p = o,
        d = 1;
      for (; !p.isTextblock; p = p.firstChild) d++;
      if (f.canReplace(f.childCount, f.childCount, p.content)) {
        if (t) {
          let m = y.empty;
          for (let b = h.length - 1; b >= 0; b--) m = y.from(h[b].copy(m));
          let g = n.tr.step(
            new $(
              e.pos - h.length,
              e.pos + o.nodeSize,
              e.pos + d,
              e.pos + o.nodeSize - d,
              new v(m, h.length, 0),
              0,
              !0,
            ),
          );
          t(g.scrollIntoView());
        }
        return !0;
      }
    }
    return !1;
  }
  function Pi(n) {
    return function (e, t) {
      let r = e.selection,
        o = n < 0 ? r.$from : r.$to,
        s = o.depth;
      for (; o.node(s).isInline; ) {
        if (!s) return !1;
        s--;
      }
      return o.node(s).isTextblock
        ? (t &&
            t(
              e.tr.setSelection(I.create(e.doc, n < 0 ? o.start(s) : o.end(s))),
            ),
          !0)
        : !1;
    };
  }
  const Qu = Pi(-1),
    Xu = Pi(1);
  function zr(n, e = null) {
    return function (t, r) {
      let { $from: o, $to: s } = t.selection,
        i = o.blockRange(s),
        l = i && nr(i, n, e);
      return l ? (r && r(t.tr.wrap(i, l).scrollIntoView()), !0) : !1;
    };
  }
  function vn(n, e = null) {
    return function (t, r) {
      let o = !1;
      for (let s = 0; s < t.selection.ranges.length && !o; s++) {
        let {
          $from: { pos: i },
          $to: { pos: l },
        } = t.selection.ranges[s];
        t.doc.nodesBetween(i, l, (c, a) => {
          if (o) return !1;
          if (!(!c.isTextblock || c.hasMarkup(n, e)))
            if (c.type == n) o = !0;
            else {
              let u = t.doc.resolve(a),
                f = u.index();
              o = u.parent.canReplaceWith(f, f + 1, n);
            }
        });
      }
      if (!o) return !1;
      if (r) {
        let s = t.tr;
        for (let i = 0; i < t.selection.ranges.length; i++) {
          let {
            $from: { pos: l },
            $to: { pos: c },
          } = t.selection.ranges[i];
          s.setBlockType(l, c, n, e);
        }
        r(s.scrollIntoView());
      }
      return !0;
    };
  }
  function ef(n, e, t) {
    for (let r = 0; r < e.length; r++) {
      let { $from: o, $to: s } = e[r],
        i = o.depth == 0 ? n.inlineContent && n.type.allowsMarkType(t) : !1;
      if (
        (n.nodesBetween(o.pos, s.pos, (l) => {
          if (i) return !1;
          i = l.inlineContent && l.type.allowsMarkType(t);
        }),
        i)
      )
        return !0;
    }
    return !1;
  }
  function Fe(n, e = null) {
    return function (t, r) {
      let { empty: o, $cursor: s, ranges: i } = t.selection;
      if ((o && !s) || !ef(t.doc, i, n)) return !1;
      if (r)
        if (s)
          n.isInSet(t.storedMarks || s.marks())
            ? r(t.tr.removeStoredMark(n))
            : r(t.tr.addStoredMark(n.create(e)));
        else {
          let l = !1,
            c = t.tr;
          for (let a = 0; !l && a < i.length; a++) {
            let { $from: u, $to: f } = i[a];
            l = t.doc.rangeHasMark(u.pos, f.pos, n);
          }
          for (let a = 0; a < i.length; a++) {
            let { $from: u, $to: f } = i[a];
            if (l) c.removeMark(u.pos, f.pos, n);
            else {
              let h = u.pos,
                p = f.pos,
                d = u.nodeAfter,
                m = f.nodeBefore,
                g = d && d.isText ? /^\s*/.exec(d.text)[0].length : 0,
                b = m && m.isText ? /\s*$/.exec(m.text)[0].length : 0;
              h + g < p && ((h += g), (p -= b)), c.addMark(h, p, n.create(e));
            }
          }
          r(c.scrollIntoView());
        }
      return !0;
    };
  }
  function Cn(...n) {
    return function (e, t, r) {
      for (let o = 0; o < n.length; o++) if (n[o](e, t, r)) return !0;
      return !1;
    };
  }
  let Fr = Cn(Ii, Bu, Pu),
    Vi = Cn(Ii, $u, Uu);
  const Ee = {
      Enter: Cn(Gu, ju, Ju, Ku),
      "Mod-Enter": Fi,
      Backspace: Fr,
      "Mod-Backspace": Fr,
      "Shift-Backspace": Fr,
      Delete: Vi,
      "Mod-Delete": Vi,
      "Mod-a": Zu,
    },
    $i = {
      "Ctrl-h": Ee.Backspace,
      "Alt-Backspace": Ee["Mod-Backspace"],
      "Ctrl-d": Ee.Delete,
      "Ctrl-Alt-Backspace": Ee["Mod-Delete"],
      "Alt-Delete": Ee["Mod-Delete"],
      "Alt-d": Ee["Mod-Delete"],
      "Ctrl-a": Qu,
      "Ctrl-e": Xu,
    };
  for (let n in Ee) $i[n] = Ee[n];
  const tf = (
    typeof navigator < "u"
      ? /Mac|iP(hone|[oa]d)/.test(navigator.platform)
      : typeof os < "u" && os.platform
        ? os.platform() == "darwin"
        : !1
  )
    ? $i
    : Ee;
  var Sn = 200,
    P = function () {};
  (P.prototype.append = function (e) {
    return e.length
      ? ((e = P.from(e)),
        (!this.length && e) ||
          (e.length < Sn && this.leafAppend(e)) ||
          (this.length < Sn && e.leafPrepend(this)) ||
          this.appendInner(e))
      : this;
  }),
    (P.prototype.prepend = function (e) {
      return e.length ? P.from(e).append(this) : this;
    }),
    (P.prototype.appendInner = function (e) {
      return new nf(this, e);
    }),
    (P.prototype.slice = function (e, t) {
      return (
        e === void 0 && (e = 0),
        t === void 0 && (t = this.length),
        e >= t
          ? P.empty
          : this.sliceInner(Math.max(0, e), Math.min(this.length, t))
      );
    }),
    (P.prototype.get = function (e) {
      if (!(e < 0 || e >= this.length)) return this.getInner(e);
    }),
    (P.prototype.forEach = function (e, t, r) {
      t === void 0 && (t = 0),
        r === void 0 && (r = this.length),
        t <= r
          ? this.forEachInner(e, t, r, 0)
          : this.forEachInvertedInner(e, t, r, 0);
    }),
    (P.prototype.map = function (e, t, r) {
      t === void 0 && (t = 0), r === void 0 && (r = this.length);
      var o = [];
      return (
        this.forEach(
          function (s, i) {
            return o.push(e(s, i));
          },
          t,
          r,
        ),
        o
      );
    }),
    (P.from = function (e) {
      return e instanceof P ? e : e && e.length ? new Ui(e) : P.empty;
    });
  var Ui = (function (n) {
    function e(r) {
      n.call(this), (this.values = r);
    }
    n && (e.__proto__ = n),
      (e.prototype = Object.create(n && n.prototype)),
      (e.prototype.constructor = e);
    var t = { length: { configurable: !0 }, depth: { configurable: !0 } };
    return (
      (e.prototype.flatten = function () {
        return this.values;
      }),
      (e.prototype.sliceInner = function (o, s) {
        return o == 0 && s == this.length
          ? this
          : new e(this.values.slice(o, s));
      }),
      (e.prototype.getInner = function (o) {
        return this.values[o];
      }),
      (e.prototype.forEachInner = function (o, s, i, l) {
        for (var c = s; c < i; c++)
          if (o(this.values[c], l + c) === !1) return !1;
      }),
      (e.prototype.forEachInvertedInner = function (o, s, i, l) {
        for (var c = s - 1; c >= i; c--)
          if (o(this.values[c], l + c) === !1) return !1;
      }),
      (e.prototype.leafAppend = function (o) {
        if (this.length + o.length <= Sn)
          return new e(this.values.concat(o.flatten()));
      }),
      (e.prototype.leafPrepend = function (o) {
        if (this.length + o.length <= Sn)
          return new e(o.flatten().concat(this.values));
      }),
      (t.length.get = function () {
        return this.values.length;
      }),
      (t.depth.get = function () {
        return 0;
      }),
      Object.defineProperties(e.prototype, t),
      e
    );
  })(P);
  P.empty = new Ui([]);
  var nf = (function (n) {
    function e(t, r) {
      n.call(this),
        (this.left = t),
        (this.right = r),
        (this.length = t.length + r.length),
        (this.depth = Math.max(t.depth, r.depth) + 1);
    }
    return (
      n && (e.__proto__ = n),
      (e.prototype = Object.create(n && n.prototype)),
      (e.prototype.constructor = e),
      (e.prototype.flatten = function () {
        return this.left.flatten().concat(this.right.flatten());
      }),
      (e.prototype.getInner = function (r) {
        return r < this.left.length
          ? this.left.get(r)
          : this.right.get(r - this.left.length);
      }),
      (e.prototype.forEachInner = function (r, o, s, i) {
        var l = this.left.length;
        if (
          (o < l && this.left.forEachInner(r, o, Math.min(s, l), i) === !1) ||
          (s > l &&
            this.right.forEachInner(
              r,
              Math.max(o - l, 0),
              Math.min(this.length, s) - l,
              i + l,
            ) === !1)
        )
          return !1;
      }),
      (e.prototype.forEachInvertedInner = function (r, o, s, i) {
        var l = this.left.length;
        if (
          (o > l &&
            this.right.forEachInvertedInner(
              r,
              o - l,
              Math.max(s, l) - l,
              i + l,
            ) === !1) ||
          (s < l &&
            this.left.forEachInvertedInner(r, Math.min(o, l), s, i) === !1)
        )
          return !1;
      }),
      (e.prototype.sliceInner = function (r, o) {
        if (r == 0 && o == this.length) return this;
        var s = this.left.length;
        return o <= s
          ? this.left.slice(r, o)
          : r >= s
            ? this.right.slice(r - s, o - s)
            : this.left.slice(r, s).append(this.right.slice(0, o - s));
      }),
      (e.prototype.leafAppend = function (r) {
        var o = this.right.leafAppend(r);
        if (o) return new e(this.left, o);
      }),
      (e.prototype.leafPrepend = function (r) {
        var o = this.left.leafPrepend(r);
        if (o) return new e(o, this.right);
      }),
      (e.prototype.appendInner = function (r) {
        return this.left.depth >= Math.max(this.right.depth, r.depth) + 1
          ? new e(this.left, new e(this.right, r))
          : new e(this, r);
      }),
      e
    );
  })(P);
  const rf = 500;
  class he {
    constructor(e, t) {
      (this.items = e), (this.eventCount = t);
    }
    popEvent(e, t) {
      if (this.eventCount == 0) return null;
      let r = this.items.length;
      for (; ; r--)
        if (this.items.get(r - 1).selection) {
          --r;
          break;
        }
      let o, s;
      t && ((o = this.remapping(r, this.items.length)), (s = o.maps.length));
      let i = e.tr,
        l,
        c,
        a = [],
        u = [];
      return (
        this.items.forEach(
          (f, h) => {
            if (!f.step) {
              o || ((o = this.remapping(r, h + 1)), (s = o.maps.length)),
                s--,
                u.push(f);
              return;
            }
            if (o) {
              u.push(new ke(f.map));
              let p = f.step.map(o.slice(s)),
                d;
              p &&
                i.maybeStep(p).doc &&
                ((d = i.mapping.maps[i.mapping.maps.length - 1]),
                a.push(new ke(d, void 0, void 0, a.length + u.length))),
                s--,
                d && o.appendMap(d, s);
            } else i.maybeStep(f.step);
            if (f.selection)
              return (
                (l = o ? f.selection.map(o.slice(s)) : f.selection),
                (c = new he(
                  this.items.slice(0, r).append(u.reverse().concat(a)),
                  this.eventCount - 1,
                )),
                !1
              );
          },
          this.items.length,
          0,
        ),
        { remaining: c, transform: i, selection: l }
      );
    }
    addTransform(e, t, r, o) {
      let s = [],
        i = this.eventCount,
        l = this.items,
        c = !o && l.length ? l.get(l.length - 1) : null;
      for (let u = 0; u < e.steps.length; u++) {
        let f = e.steps[u].invert(e.docs[u]),
          h = new ke(e.mapping.maps[u], f, t),
          p;
        (p = c && c.merge(h)) &&
          ((h = p), u ? s.pop() : (l = l.slice(0, l.length - 1))),
          s.push(h),
          t && (i++, (t = void 0)),
          o || (c = h);
      }
      let a = i - r.depth;
      return a > sf && ((l = of(l, a)), (i -= a)), new he(l.append(s), i);
    }
    remapping(e, t) {
      let r = new lt();
      return (
        this.items.forEach(
          (o, s) => {
            let i =
              o.mirrorOffset != null && s - o.mirrorOffset >= e
                ? r.maps.length - o.mirrorOffset
                : void 0;
            r.appendMap(o.map, i);
          },
          e,
          t,
        ),
        r
      );
    }
    addMaps(e) {
      return this.eventCount == 0
        ? this
        : new he(this.items.append(e.map((t) => new ke(t))), this.eventCount);
    }
    rebased(e, t) {
      if (!this.eventCount) return this;
      let r = [],
        o = Math.max(0, this.items.length - t),
        s = e.mapping,
        i = e.steps.length,
        l = this.eventCount;
      this.items.forEach((h) => {
        h.selection && l--;
      }, o);
      let c = t;
      this.items.forEach((h) => {
        let p = s.getMirror(--c);
        if (p == null) return;
        i = Math.min(i, p);
        let d = s.maps[p];
        if (h.step) {
          let m = e.steps[p].invert(e.docs[p]),
            g = h.selection && h.selection.map(s.slice(c + 1, p));
          g && l++, r.push(new ke(d, m, g));
        } else r.push(new ke(d));
      }, o);
      let a = [];
      for (let h = t; h < i; h++) a.push(new ke(s.maps[h]));
      let u = this.items.slice(0, o).append(a).append(r),
        f = new he(u, l);
      return (
        f.emptyItemCount() > rf &&
          (f = f.compress(this.items.length - r.length)),
        f
      );
    }
    emptyItemCount() {
      let e = 0;
      return (
        this.items.forEach((t) => {
          t.step || e++;
        }),
        e
      );
    }
    compress(e = this.items.length) {
      let t = this.remapping(0, e),
        r = t.maps.length,
        o = [],
        s = 0;
      return (
        this.items.forEach(
          (i, l) => {
            if (l >= e) o.push(i), i.selection && s++;
            else if (i.step) {
              let c = i.step.map(t.slice(r)),
                a = c && c.getMap();
              if ((r--, a && t.appendMap(a, r), c)) {
                let u = i.selection && i.selection.map(t.slice(r));
                u && s++;
                let f = new ke(a.invert(), c, u),
                  h,
                  p = o.length - 1;
                (h = o.length && o[p].merge(f)) ? (o[p] = h) : o.push(f);
              }
            } else i.map && r--;
          },
          this.items.length,
          0,
        ),
        new he(P.from(o.reverse()), s)
      );
    }
  }
  he.empty = new he(P.empty, 0);
  function of(n, e) {
    let t;
    return (
      n.forEach((r, o) => {
        if (r.selection && e-- == 0) return (t = o), !1;
      }),
      n.slice(t)
    );
  }
  class ke {
    constructor(e, t, r, o) {
      (this.map = e),
        (this.step = t),
        (this.selection = r),
        (this.mirrorOffset = o);
    }
    merge(e) {
      if (this.step && e.step && !e.selection) {
        let t = e.step.merge(this.step);
        if (t) return new ke(t.getMap().invert(), t, this.selection);
      }
    }
  }
  class Be {
    constructor(e, t, r, o, s) {
      (this.done = e),
        (this.undone = t),
        (this.prevRanges = r),
        (this.prevTime = o),
        (this.prevComposition = s);
    }
  }
  const sf = 20;
  function lf(n, e, t, r) {
    let o = t.getMeta(Pe),
      s;
    if (o) return o.historyState;
    t.getMeta(af) && (n = new Be(n.done, n.undone, null, 0, -1));
    let i = t.getMeta("appendedTransaction");
    if (t.steps.length == 0) return n;
    if (i && i.getMeta(Pe))
      return i.getMeta(Pe).redo
        ? new Be(
            n.done.addTransform(t, void 0, r, Dn(e)),
            n.undone,
            Hi(t.mapping.maps[t.steps.length - 1]),
            n.prevTime,
            n.prevComposition,
          )
        : new Be(
            n.done,
            n.undone.addTransform(t, void 0, r, Dn(e)),
            null,
            n.prevTime,
            n.prevComposition,
          );
    if (
      t.getMeta("addToHistory") !== !1 &&
      !(i && i.getMeta("addToHistory") === !1)
    ) {
      let l = t.getMeta("composition"),
        c =
          n.prevTime == 0 ||
          (!i &&
            n.prevComposition != l &&
            (n.prevTime < (t.time || 0) - r.newGroupDelay ||
              !cf(t, n.prevRanges))),
        a = i
          ? Br(n.prevRanges, t.mapping)
          : Hi(t.mapping.maps[t.steps.length - 1]);
      return new Be(
        n.done.addTransform(
          t,
          c ? e.selection.getBookmark() : void 0,
          r,
          Dn(e),
        ),
        he.empty,
        a,
        t.time,
        l ?? n.prevComposition,
      );
    } else
      return (s = t.getMeta("rebased"))
        ? new Be(
            n.done.rebased(t, s),
            n.undone.rebased(t, s),
            Br(n.prevRanges, t.mapping),
            n.prevTime,
            n.prevComposition,
          )
        : new Be(
            n.done.addMaps(t.mapping.maps),
            n.undone.addMaps(t.mapping.maps),
            Br(n.prevRanges, t.mapping),
            n.prevTime,
            n.prevComposition,
          );
  }
  function cf(n, e) {
    if (!e) return !1;
    if (!n.docChanged) return !0;
    let t = !1;
    return (
      n.mapping.maps[0].forEach((r, o) => {
        for (let s = 0; s < e.length; s += 2)
          r <= e[s + 1] && o >= e[s] && (t = !0);
      }),
      t
    );
  }
  function Hi(n) {
    let e = [];
    return n.forEach((t, r, o, s) => e.push(o, s)), e;
  }
  function Br(n, e) {
    if (!n) return null;
    let t = [];
    for (let r = 0; r < n.length; r += 2) {
      let o = e.map(n[r], 1),
        s = e.map(n[r + 1], -1);
      o <= s && t.push(o, s);
    }
    return t;
  }
  function Gi(n, e, t, r) {
    let o = Dn(e),
      s = Pe.get(e).spec.config,
      i = (r ? n.undone : n.done).popEvent(e, o);
    if (!i) return;
    let l = i.selection.resolve(i.transform.doc),
      c = (r ? n.done : n.undone).addTransform(
        i.transform,
        e.selection.getBookmark(),
        s,
        o,
      ),
      a = new Be(r ? c : i.remaining, r ? i.remaining : c, null, 0, -1);
    t(
      i.transform
        .setSelection(l)
        .setMeta(Pe, { redo: r, historyState: a })
        .scrollIntoView(),
    );
  }
  let Pr = !1,
    ji = null;
  function Dn(n) {
    let e = n.plugins;
    if (ji != e) {
      (Pr = !1), (ji = e);
      for (let t = 0; t < e.length; t++)
        if (e[t].spec.historyPreserveItems) {
          Pr = !0;
          break;
        }
    }
    return Pr;
  }
  const Pe = new ws("history"),
    af = new ws("closeHistory");
  function uf(n = {}) {
    return (
      (n = { depth: n.depth || 100, newGroupDelay: n.newGroupDelay || 500 }),
      new Me({
        key: Pe,
        state: {
          init() {
            return new Be(he.empty, he.empty, null, 0, -1);
          },
          apply(e, t, r) {
            return lf(t, r, e, n);
          },
        },
        config: n,
        props: {
          handleDOMEvents: {
            beforeinput(e, t) {
              let r = t.inputType,
                o = r == "historyUndo" ? En : r == "historyRedo" ? $t : null;
              return o ? (t.preventDefault(), o(e.state, e.dispatch)) : !1;
            },
          },
        },
      })
    );
  }
  const En = (n, e) => {
      let t = Pe.getState(n);
      return !t || t.done.eventCount == 0 ? !1 : (e && Gi(t, n, e, !1), !0);
    },
    $t = (n, e) => {
      let t = Pe.getState(n);
      return !t || t.undone.eventCount == 0 ? !1 : (e && Gi(t, n, e, !0), !0);
    },
    Ut = "http://www.w3.org/2000/svg",
    ff = "http://www.w3.org/1999/xlink",
    Vr = "ProseMirror-icon";
  function hf(n) {
    let e = 0;
    for (let t = 0; t < n.length; t++) e = ((e << 5) - e + n.charCodeAt(t)) | 0;
    return e;
  }
  function pf(n, e) {
    let t = (n.nodeType == 9 ? n : n.ownerDocument) || document,
      r = t.createElement("div");
    if (((r.className = Vr), e.path)) {
      let { path: o, width: s, height: i } = e,
        l = "pm-icon-" + hf(o).toString(16);
      t.getElementById(l) || df(n, l, e);
      let c = r.appendChild(t.createElementNS(Ut, "svg"));
      (c.style.width = s / i + "em"),
        c
          .appendChild(t.createElementNS(Ut, "use"))
          .setAttributeNS(
            ff,
            "href",
            /([^#]*)/.exec(t.location.toString())[1] + "#" + l,
          );
    } else if (e.dom) r.appendChild(e.dom.cloneNode(!0));
    else {
      let { text: o, css: s } = e;
      (r.appendChild(t.createElement("span")).textContent = o || ""),
        s && (r.firstChild.style.cssText = s);
    }
    return r;
  }
  function df(n, e, t) {
    let [r, o] =
        n.nodeType == 9 ? [n, n.body] : [n.ownerDocument || document, n],
      s = r.getElementById(Vr + "-collection");
    s ||
      ((s = r.createElementNS(Ut, "svg")),
      (s.id = Vr + "-collection"),
      (s.style.display = "none"),
      o.insertBefore(s, o.firstChild));
    let i = r.createElementNS(Ut, "symbol");
    (i.id = e),
      i.setAttribute("viewBox", "0 0 " + t.width + " " + t.height),
      i.appendChild(r.createElementNS(Ut, "path")).setAttribute("d", t.path),
      s.appendChild(i);
  }
  const ee = "ProseMirror-menu";
  class pe {
    constructor(e) {
      this.spec = e;
    }
    render(e) {
      let t = this.spec,
        r = t.render
          ? t.render(e)
          : t.icon
            ? pf(e.root, t.icon)
            : t.label
              ? re("div", null, Ht(e, t.label))
              : null;
      if (!r) throw new RangeError("MenuItem without icon or label property");
      if (t.title) {
        const s = typeof t.title == "function" ? t.title(e.state) : t.title;
        r.setAttribute("title", Ht(e, s));
      }
      t.class && r.classList.add(t.class),
        t.css && (r.style.cssText += t.css),
        r.addEventListener("mousedown", (s) => {
          s.preventDefault(),
            r.classList.contains(ee + "-disabled") ||
              t.run(e.state, e.dispatch, e, s);
        });
      function o(s) {
        if (t.select) {
          let l = t.select(s);
          if (((r.style.display = l ? "" : "none"), !l)) return !1;
        }
        let i = !0;
        if (
          (t.enable && ((i = t.enable(s) || !1), $r(r, ee + "-disabled", !i)),
          t.active)
        ) {
          let l = (i && t.active(s)) || !1;
          $r(r, ee + "-active", l);
        }
        return !0;
      }
      return { dom: r, update: o };
    }
  }
  function Ht(n, e) {
    return n._props.translate ? n._props.translate(e) : e;
  }
  let Gt = { time: 0, node: null };
  function Ji(n) {
    (Gt.time = Date.now()), (Gt.node = n.target);
  }
  function Wi(n) {
    return Date.now() - 100 < Gt.time && Gt.node && n.contains(Gt.node);
  }
  class Ki {
    constructor(e, t = {}) {
      (this.options = t),
        (this.options = t || {}),
        (this.content = Array.isArray(e) ? e : [e]);
    }
    render(e) {
      let t = Zi(this.content, e),
        r = e.dom.ownerDocument.defaultView || window,
        o = re(
          "div",
          {
            class: ee + "-dropdown " + (this.options.class || ""),
            style: this.options.css,
          },
          Ht(e, this.options.label || ""),
        );
      this.options.title && o.setAttribute("title", Ht(e, this.options.title));
      let s = re("div", { class: ee + "-dropdown-wrap" }, o),
        i = null,
        l = null,
        c = () => {
          i && i.close() && ((i = null), r.removeEventListener("mousedown", l));
        };
      o.addEventListener("mousedown", (u) => {
        u.preventDefault(),
          Ji(u),
          i
            ? c()
            : ((i = this.expand(s, t.dom)),
              r.addEventListener(
                "mousedown",
                (l = () => {
                  Wi(s) || c();
                }),
              ));
      });
      function a(u) {
        let f = t.update(u);
        return (s.style.display = f ? "" : "none"), f;
      }
      return { dom: s, update: a };
    }
    expand(e, t) {
      let r = re(
          "div",
          { class: ee + "-dropdown-menu " + (this.options.class || "") },
          t,
        ),
        o = !1;
      function s() {
        return o ? !1 : ((o = !0), e.removeChild(r), !0);
      }
      return e.appendChild(r), { close: s, node: r };
    }
  }
  function Zi(n, e) {
    let t = [],
      r = [];
    for (let o = 0; o < n.length; o++) {
      let { dom: s, update: i } = n[o].render(e);
      t.push(re("div", { class: ee + "-dropdown-item" }, s)), r.push(i);
    }
    return { dom: t, update: Yi(r, t) };
  }
  function Yi(n, e) {
    return (t) => {
      let r = !1;
      for (let o = 0; o < n.length; o++) {
        let s = n[o](t);
        (e[o].style.display = s ? "" : "none"), s && (r = !0);
      }
      return r;
    };
  }
  class mf {
    constructor(e, t = {}) {
      (this.options = t), (this.content = Array.isArray(e) ? e : [e]);
    }
    render(e) {
      let t = Zi(this.content, e),
        r = e.dom.ownerDocument.defaultView || window,
        o = re(
          "div",
          { class: ee + "-submenu-label" },
          Ht(e, this.options.label || ""),
        ),
        s = re(
          "div",
          { class: ee + "-submenu-wrap" },
          o,
          re("div", { class: ee + "-submenu" }, t.dom),
        ),
        i = null;
      o.addEventListener("mousedown", (c) => {
        c.preventDefault(),
          Ji(c),
          $r(s, ee + "-submenu-wrap-active", !1),
          i ||
            r.addEventListener(
              "mousedown",
              (i = () => {
                Wi(s) ||
                  (s.classList.remove(ee + "-submenu-wrap-active"),
                  r.removeEventListener("mousedown", i),
                  (i = null));
              }),
            );
      });
      function l(c) {
        let a = t.update(c);
        return (s.style.display = a ? "" : "none"), a;
      }
      return { dom: s, update: l };
    }
  }
  function gf(n, e) {
    let t = document.createDocumentFragment(),
      r = [],
      o = [];
    for (let i = 0; i < e.length; i++) {
      let l = e[i],
        c = [],
        a = [];
      for (let u = 0; u < l.length; u++) {
        let { dom: f, update: h } = l[u].render(n),
          p = re("span", { class: ee + "item" }, f);
        t.appendChild(p), a.push(p), c.push(h);
      }
      c.length &&
        (r.push(Yi(c, a)), i < e.length - 1 && o.push(t.appendChild(bf())));
    }
    function s(i) {
      let l = !1,
        c = !1;
      for (let a = 0; a < r.length; a++) {
        let u = r[a](i);
        a && (o[a - 1].style.display = c && u ? "" : "none"),
          (c = u),
          u && (l = !0);
      }
      return l;
    }
    return { dom: t, update: s };
  }
  function bf() {
    return re("span", { class: ee + "separator" });
  }
  const ce = {
      join: {
        width: 800,
        height: 900,
        path: "M0 75h800v125h-800z M0 825h800v-125h-800z M250 400h100v-100h100v100h100v100h-100v100h-100v-100h-100z",
      },
      lift: {
        width: 1024,
        height: 1024,
        path: "M219 310v329q0 7-5 12t-12 5q-8 0-13-5l-164-164q-5-5-5-13t5-13l164-164q5-5 13-5 7 0 12 5t5 12zM1024 749v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12zM1024 530v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 310v109q0 7-5 12t-12 5h-621q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h621q7 0 12 5t5 12zM1024 91v109q0 7-5 12t-12 5h-987q-7 0-12-5t-5-12v-109q0-7 5-12t12-5h987q7 0 12 5t5 12z",
      },
      selectParentNode: { text: "⬚", css: "font-weight: bold" },
      undo: {
        width: 1024,
        height: 1024,
        path: "M761 1024c113-206 132-520-313-509v253l-384-384 384-384v248c534-13 594 472 313 775z",
      },
      redo: {
        width: 1024,
        height: 1024,
        path: "M576 248v-248l384 384-384 384v-253c-446-10-427 303-313 509-280-303-221-789 313-775z",
      },
      strong: {
        width: 805,
        height: 1024,
        path: "M317 869q42 18 80 18 214 0 214-191 0-65-23-102-15-25-35-42t-38-26-46-14-48-6-54-1q-41 0-57 5 0 30-0 90t-0 90q0 4-0 38t-0 55 2 47 6 38zM309 442q24 4 62 4 46 0 81-7t62-25 42-51 14-81q0-40-16-70t-45-46-61-24-70-8q-28 0-74 7 0 28 2 86t2 86q0 15-0 45t-0 45q0 26 0 39zM0 950l1-53q8-2 48-9t60-15q4-6 7-15t4-19 3-18 1-21 0-19v-37q0-561-12-585-2-4-12-8t-25-6-28-4-27-2-17-1l-2-47q56-1 194-6t213-5q13 0 39 0t38 0q40 0 78 7t73 24 61 40 42 59 16 78q0 29-9 54t-22 41-36 32-41 25-48 22q88 20 146 76t58 141q0 57-20 102t-53 74-78 48-93 27-100 8q-25 0-75-1t-75-1q-60 0-175 6t-132 6z",
      },
      em: {
        width: 585,
        height: 1024,
        path: "M0 949l9-48q3-1 46-12t63-21q16-20 23-57 0-4 35-165t65-310 29-169v-14q-13-7-31-10t-39-4-33-3l10-58q18 1 68 3t85 4 68 1q27 0 56-1t69-4 56-3q-2 22-10 50-17 5-58 16t-62 19q-4 10-8 24t-5 22-4 26-3 24q-15 84-50 239t-44 203q-1 5-7 33t-11 51-9 47-3 32l0 10q9 2 105 17-1 25-9 56-6 0-18 0t-18 0q-16 0-49-5t-49-5q-78-1-117-1-29 0-81 5t-69 6z",
      },
      code: {
        width: 896,
        height: 1024,
        path: "M608 192l-96 96 224 224-224 224 96 96 288-320-288-320zM288 192l-288 320 288 320 96-96-224-224 224-224-96-96z",
      },
      link: {
        width: 951,
        height: 1024,
        path: "M832 694q0-22-16-38l-118-118q-16-16-38-16-24 0-41 18 1 1 10 10t12 12 8 10 7 14 2 15q0 22-16 38t-38 16q-8 0-15-2t-14-7-10-8-12-12-10-10q-18 17-18 41 0 22 16 38l117 118q15 15 38 15 22 0 38-14l84-83q16-16 16-38zM430 292q0-22-16-38l-117-118q-16-16-38-16-22 0-38 15l-84 83q-16 16-16 38 0 22 16 38l118 118q15 15 38 15 24 0 41-17-1-1-10-10t-12-12-8-10-7-14-2-15q0-22 16-38t38-16q8 0 15 2t14 7 10 8 12 12 10 10q18-17 18-41zM941 694q0 68-48 116l-84 83q-47 47-116 47-69 0-116-48l-117-118q-47-47-47-116 0-70 50-119l-50-50q-49 50-118 50-68 0-116-48l-118-118q-48-48-48-116t48-116l84-83q47-47 116-47 69 0 116 48l117 118q47 47 47 116 0 70-50 119l50 50q49-50 118-50 68 0 116 48l118 118q48 48 48 116z",
      },
      bulletList: {
        width: 768,
        height: 896,
        path: "M0 512h128v-128h-128v128zM0 256h128v-128h-128v128zM0 768h128v-128h-128v128zM256 512h512v-128h-512v128zM256 256h512v-128h-512v128zM256 768h512v-128h-512v128z",
      },
      orderedList: {
        width: 768,
        height: 896,
        path: "M320 512h448v-128h-448v128zM320 768h448v-128h-448v128zM320 128v128h448v-128h-448zM79 384h78v-256h-36l-85 23v50l43-2v185zM189 590c0-36-12-78-96-78-33 0-64 6-83 16l1 66c21-10 42-15 67-15s32 11 32 28c0 26-30 58-110 112v50h192v-67l-91 2c49-30 87-66 87-113l1-1z",
      },
      blockquote: {
        width: 640,
        height: 896,
        path: "M0 448v256h256v-256h-128c0 0 0-128 128-128v-128c0 0-256 0-256 256zM640 320v-128c0 0-256 0-256 256v256h256v-256h-128c0 0 0-128 128-128z",
      },
    },
    yf = new pe({
      title: "Join with above block",
      run: Or,
      select: (n) => Or(n),
      icon: ce.join,
    }),
    kf = new pe({
      title: "Lift out of enclosing block",
      run: Rr,
      select: (n) => Rr(n),
      icon: ce.lift,
    }),
    xf = new pe({
      title: "Select parent node",
      run: Lr,
      select: (n) => Lr(n),
      icon: ce.selectParentNode,
    });
  let wf = new pe({
      title: "Undo last change",
      run: En,
      enable: (n) => En(n),
      icon: ce.undo,
    }),
    vf = new pe({
      title: "Redo last undone change",
      run: $t,
      enable: (n) => $t(n),
      icon: ce.redo,
    });
  function jt(n, e) {
    let t = {
      run(r, o) {
        return zr(n, e.attrs)(r, o);
      },
      select(r) {
        return zr(n, e.attrs)(r);
      },
    };
    for (let r in e) t[r] = e[r];
    return new pe(t);
  }
  function Jt(n, e) {
    let t = vn(n, e.attrs),
      r = {
        run: t,
        enable(o) {
          return t(o);
        },
        active(o) {
          let { $from: s, to: i, node: l } = o.selection;
          return l
            ? l.hasMarkup(n, e.attrs)
            : i <= s.end() && s.parent.hasMarkup(n, e.attrs);
        },
      };
    for (let o in e) r[o] = e[o];
    return new pe(r);
  }
  function $r(n, e, t) {
    t ? n.classList.add(e) : n.classList.remove(e);
  }
  const An = "ProseMirror-menubar";
  function Cf() {
    if (typeof navigator > "u") return !1;
    let n = navigator.userAgent;
    return (
      !/Edge\/\d/.test(n) && /AppleWebKit/.test(n) && /Mobile\/\w+/.test(n)
    );
  }
  function Sf(n) {
    return new Me({
      view(e) {
        return new Df(e, n);
      },
    });
  }
  class Df {
    constructor(e, t) {
      (this.editorView = e),
        (this.options = t),
        (this.spacer = null),
        (this.maxHeight = 0),
        (this.widthForMaxHeight = 0),
        (this.floating = !1),
        (this.scrollHandler = null),
        (this.wrapper = re("div", { class: An + "-wrapper" })),
        (this.menu = this.wrapper.appendChild(re("div", { class: An }))),
        (this.menu.className = An),
        e.dom.parentNode && e.dom.parentNode.replaceChild(this.wrapper, e.dom),
        this.wrapper.appendChild(e.dom);
      let { dom: r, update: o } = gf(this.editorView, this.options.content);
      if (
        ((this.contentUpdate = o),
        this.menu.appendChild(r),
        this.update(),
        t.floating && !Cf())
      ) {
        this.updateFloat();
        let s = _f(this.wrapper);
        (this.scrollHandler = (i) => {
          let l = this.editorView.root;
          (l.body || l).contains(this.wrapper)
            ? this.updateFloat(
                i.target.getBoundingClientRect ? i.target : void 0,
              )
            : s.forEach((c) =>
                c.removeEventListener("scroll", this.scrollHandler),
              );
        }),
          s.forEach((i) => i.addEventListener("scroll", this.scrollHandler));
      }
    }
    update() {
      this.contentUpdate(this.editorView.state),
        this.floating
          ? this.updateScrollCursor()
          : (this.menu.offsetWidth != this.widthForMaxHeight &&
              ((this.widthForMaxHeight = this.menu.offsetWidth),
              (this.maxHeight = 0)),
            this.menu.offsetHeight > this.maxHeight &&
              ((this.maxHeight = this.menu.offsetHeight),
              (this.menu.style.minHeight = this.maxHeight + "px")));
    }
    updateScrollCursor() {
      let e = this.editorView.root.getSelection();
      if (!e.focusNode) return;
      let t = e.getRangeAt(0).getClientRects(),
        r = t[Ef(e) ? 0 : t.length - 1];
      if (!r) return;
      let o = this.menu.getBoundingClientRect();
      if (r.top < o.bottom && r.bottom > o.top) {
        let s = Af(this.wrapper);
        s && (s.scrollTop -= o.bottom - r.top);
      }
    }
    updateFloat(e) {
      let t = this.wrapper,
        r = t.getBoundingClientRect(),
        o = e ? Math.max(0, e.getBoundingClientRect().top) : 0;
      if (this.floating)
        if (r.top >= o || r.bottom < this.menu.offsetHeight + 10)
          (this.floating = !1),
            (this.menu.style.position =
              this.menu.style.left =
              this.menu.style.top =
              this.menu.style.width =
                ""),
            (this.menu.style.display = ""),
            this.spacer.parentNode.removeChild(this.spacer),
            (this.spacer = null);
        else {
          let s = (t.offsetWidth - t.clientWidth) / 2;
          (this.menu.style.left = r.left + s + "px"),
            (this.menu.style.display =
              r.top >
              (this.editorView.dom.ownerDocument.defaultView || window)
                .innerHeight
                ? "none"
                : ""),
            e && (this.menu.style.top = o + "px");
        }
      else if (r.top < o && r.bottom >= this.menu.offsetHeight + 10) {
        this.floating = !0;
        let s = this.menu.getBoundingClientRect();
        (this.menu.style.left = s.left + "px"),
          (this.menu.style.width = s.width + "px"),
          e && (this.menu.style.top = o + "px"),
          (this.menu.style.position = "fixed"),
          (this.spacer = re("div", {
            class: An + "-spacer",
            style: `height: ${s.height}px`,
          })),
          t.insertBefore(this.spacer, this.menu);
      }
    }
    destroy() {
      this.wrapper.parentNode &&
        this.wrapper.parentNode.replaceChild(this.editorView.dom, this.wrapper);
    }
  }
  function Ef(n) {
    return n.anchorNode == n.focusNode
      ? n.anchorOffset > n.focusOffset
      : n.anchorNode.compareDocumentPosition(n.focusNode) ==
          Node.DOCUMENT_POSITION_FOLLOWING;
  }
  function Af(n) {
    for (let e = n.parentNode; e; e = e.parentNode)
      if (e.scrollHeight > e.clientHeight) return e;
  }
  function _f(n) {
    let e = [n.ownerDocument.defaultView || window];
    for (let t = n.parentNode; t; t = t.parentNode) e.push(t);
    return e;
  }
  class Ve {
    constructor(e, t, r = {}) {
      (this.match = e),
        (this.match = e),
        (this.handler = typeof t == "string" ? Mf(t) : t),
        (this.undoable = r.undoable !== !1);
    }
  }
  function Mf(n) {
    return function (e, t, r, o) {
      let s = n;
      if (t[1]) {
        let i = t[0].lastIndexOf(t[1]);
        (s += t[0].slice(i + t[1].length)), (r += i);
        let l = r - o;
        l > 0 && ((s = t[0].slice(i - l, i) + s), (r = o));
      }
      return e.tr.insertText(s, r, o);
    };
  }
  const Tf = 500;
  function Qi({ rules: n }) {
    let e = new Me({
      state: {
        init() {
          return null;
        },
        apply(t, r) {
          let o = t.getMeta(this);
          return o || (t.selectionSet || t.docChanged ? null : r);
        },
      },
      props: {
        handleTextInput(t, r, o, s) {
          return Xi(t, r, o, s, n, e);
        },
        handleDOMEvents: {
          compositionend: (t) => {
            setTimeout(() => {
              let { $cursor: r } = t.state.selection;
              r && Xi(t, r.pos, r.pos, "", n, e);
            });
          },
        },
      },
      isInputRules: !0,
    });
    return e;
  }
  function Xi(n, e, t, r, o, s) {
    if (n.composing) return !1;
    let i = n.state,
      l = i.doc.resolve(e);
    if (l.parent.type.spec.code) return !1;
    let c =
      l.parent.textBetween(
        Math.max(0, l.parentOffset - Tf),
        l.parentOffset,
        null,
        "￼",
      ) + r;
    for (let a = 0; a < o.length; a++) {
      let u = o[a],
        f = u.match.exec(c),
        h = f && u.handler(i, f, e - (f[0].length - r.length), t);
      if (h)
        return (
          u.undoable && h.setMeta(s, { transform: h, from: e, to: t, text: r }),
          n.dispatch(h),
          !0
        );
    }
    return !1;
  }
  const qf = (n, e) => {
      let t = n.plugins;
      for (let r = 0; r < t.length; r++) {
        let o = t[r],
          s;
        if (o.spec.isInputRules && (s = o.getState(n))) {
          if (e) {
            let i = n.tr,
              l = s.transform;
            for (let c = l.steps.length - 1; c >= 0; c--)
              i.step(l.steps[c].invert(l.docs[c]));
            if (s.text) {
              let c = i.doc.resolve(s.from).marks();
              i.replaceWith(s.from, s.to, n.schema.text(s.text, c));
            } else i.delete(s.from, s.to);
            e(i);
          }
          return !0;
        }
      }
      return !1;
    },
    Nf = new Ve(/--$/, "—"),
    Of = new Ve(/\.\.\.$/, "…"),
    Rf = new Ve(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(")$/, "“"),
    If = new Ve(/"$/, "”"),
    Lf = new Ve(/(?:^|[\s\{\[\(\<'"\u2018\u201C])(')$/, "‘"),
    zf = new Ve(/'$/, "’"),
    Ff = [Rf, If, Lf, zf];
  function nt(n, e, t = null, r) {
    return new Ve(n, (o, s, i, l) => {
      let c = t instanceof Function ? t(s) : t,
        a = o.tr.delete(i, l),
        u = a.doc.resolve(i),
        f = u.blockRange(),
        h = f && nr(f, e, c);
      if (!h) return null;
      a.wrap(f, h);
      let p = a.doc.resolve(i - 1).nodeBefore;
      return (
        p &&
          p.type == e &&
          ut(a.doc, i - 1) &&
          (!r || r(s, p)) &&
          a.join(i - 1),
        a
      );
    });
  }
  function _n(n, e, t = null) {
    return new Ve(n, (r, o, s, i) => {
      let l = r.doc.resolve(s),
        c = t instanceof Function ? t(o) : t;
      return l.node(-1).canReplaceWith(l.index(-1), l.indexAfter(-1), e)
        ? r.tr.delete(s, i).setBlockType(s, s, e, c)
        : null;
    });
  }
  const Ur = "address",
    el = Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          buildMenu: ({ menu: n, schema: e }) => {
            n.typeMenu.content.push(jt(e.nodes[Ur], { label: "Address" }));
          },
          inputRules: (n) => [nt(/^\$A\s$/, n.nodes[Ur])],
          name: Ur,
          schema: {
            content: "block+",
            group: "block",
            defining: !0,
            parseDOM: [{ tag: "div.address" }],
            toDOM() {
              return ["div", { class: "address" }, 0];
            },
          },
          toGovspeak: (n, e) => {
            n.write(`$A

`),
              n.renderInline(e),
              n.write("$A"),
              n.closeBlock(e);
          },
        },
        Symbol.toStringTag,
        { value: "Module" },
      ),
    ),
    Hr = "call_to_action",
    tl = Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          buildMenu: ({ menu: n, schema: e }) => {
            n.typeMenu.content.push(
              jt(e.nodes[Hr], { label: "Call to action" }),
            );
          },
          inputRules: (n) => [nt(/^\$CTA\s$/, n.nodes[Hr])],
          name: Hr,
          schema: {
            content: "block+",
            group: "block",
            defining: !0,
            parseDOM: [{ tag: "div.call-to-action" }],
            toDOM() {
              return ["div", { class: "call-to-action" }, 0];
            },
          },
          toGovspeak: (n, e) => {
            n.write(`$CTA

`),
              n.renderInline(e),
              n.write("$CTA"),
              n.closeBlock(e);
          },
        },
        Symbol.toStringTag,
        { value: "Module" },
      ),
    ),
    Gr = "contact",
    nl = Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          buildMenu: ({ menu: n, schema: e }) => {
            n.typeMenu.content.push(jt(e.nodes[Gr], { label: "Contact" }));
          },
          inputRules: (n) => [nt(/^\$C\s$/, n.nodes[Gr])],
          name: Gr,
          schema: {
            content: "block+",
            group: "block",
            defining: !0,
            parseDOM: [
              { tag: 'div.contact[role="contact"][aria-label="Contact"]' },
            ],
            toDOM() {
              return ["div", { class: "contact" }, ["p", 0]];
            },
          },
          toGovspeak: (n, e) => {
            n.write(`$C

`),
              n.renderInline(e),
              n.write("$C"),
              n.closeBlock(e);
          },
        },
        Symbol.toStringTag,
        { value: "Module" },
      ),
    ),
    jr = "example_callout",
    rl = Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          buildMenu: ({ menu: n, schema: e }) => {
            n.typeMenu.content.push(
              jt(e.nodes[jr], { label: "Example callout" }),
            );
          },
          inputRules: (n) => [nt(/^\$E\s$/, n.nodes[jr])],
          name: jr,
          schema: {
            content: "block+",
            group: "block",
            defining: !0,
            parseDOM: [{ tag: "div.example" }],
            toDOM() {
              return ["div", { class: "example" }, 0];
            },
          },
          toGovspeak: (n, e) => {
            n.write(`$E

`),
              n.renderInline(e),
              n.write("$E"),
              n.closeBlock(e);
          },
        },
        Symbol.toStringTag,
        { value: "Module" },
      ),
    ),
    Jr = "information_callout",
    ol = Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          buildMenu: ({ menu: n, schema: e }) => {
            n.typeMenu.content.push(
              Jt(e.nodes[Jr], { label: "Information callout" }),
            );
          },
          inputRules: (n) => [_n(/^\^\s$/, n.nodes[Jr])],
          name: Jr,
          schema: {
            content: "inline*",
            group: "block",
            defining: !0,
            parseDOM: [
              {
                tag: 'div.application-notice.info-notice[role="note"][aria-label="Information"]',
              },
            ],
            toDOM() {
              return [
                "div",
                { class: "application-notice info-notice" },
                ["p", 0],
              ];
            },
          },
          toGovspeak: (n, e) => {
            n.write("^"), n.renderInline(e, !1), n.write("^"), n.closeBlock(e);
          },
        },
        Symbol.toStringTag,
        { value: "Module" },
      ),
    ),
    Wr = "warning_callout",
    sl = Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          buildMenu: ({ menu: n, schema: e }) => {
            n.typeMenu.content.push(
              Jt(e.nodes[Wr], { label: "Warning callout" }),
            );
          },
          inputRules: (n) => [_n(/^%\s$/, n.nodes[Wr])],
          name: Wr,
          schema: {
            content: "inline*",
            group: "block",
            defining: !0,
            parseDOM: [
              {
                tag: 'div.application-notice.help-notice[role="note"][aria-label="Warning"]',
              },
            ],
            toDOM() {
              return [
                "div",
                { class: "application-notice help-notice" },
                ["p", 0],
              ];
            },
          },
          toGovspeak: (n, e) => {
            n.write("%"), n.renderInline(e, !1), n.write("%"), n.closeBlock(e);
          },
        },
        Symbol.toStringTag,
        { value: "Module" },
      ),
    );
  function Bf(n) {
    return n &&
      n.__esModule &&
      Object.prototype.hasOwnProperty.call(n, "default")
      ? n.default
      : n;
  }
  function Pf(n) {
    if (n.__esModule) return n;
    var e = n.default;
    if (typeof e == "function") {
      var t = function r() {
        return this instanceof r
          ? Reflect.construct(e, arguments, this.constructor)
          : e.apply(this, arguments);
      };
      t.prototype = e.prototype;
    } else t = {};
    return (
      Object.defineProperty(t, "__esModule", { value: !0 }),
      Object.keys(n).forEach(function (r) {
        var o = Object.getOwnPropertyDescriptor(n, r);
        Object.defineProperty(
          t,
          r,
          o.get
            ? o
            : {
                enumerable: !0,
                get: function () {
                  return n[r];
                },
              },
        );
      }),
      t
    );
  }
  var R = {},
    il = {
      Aacute: "Á",
      aacute: "á",
      Abreve: "Ă",
      abreve: "ă",
      ac: "∾",
      acd: "∿",
      acE: "∾̳",
      Acirc: "Â",
      acirc: "â",
      acute: "´",
      Acy: "А",
      acy: "а",
      AElig: "Æ",
      aelig: "æ",
      af: "⁡",
      Afr: "𝔄",
      afr: "𝔞",
      Agrave: "À",
      agrave: "à",
      alefsym: "ℵ",
      aleph: "ℵ",
      Alpha: "Α",
      alpha: "α",
      Amacr: "Ā",
      amacr: "ā",
      amalg: "⨿",
      amp: "&",
      AMP: "&",
      andand: "⩕",
      And: "⩓",
      and: "∧",
      andd: "⩜",
      andslope: "⩘",
      andv: "⩚",
      ang: "∠",
      ange: "⦤",
      angle: "∠",
      angmsdaa: "⦨",
      angmsdab: "⦩",
      angmsdac: "⦪",
      angmsdad: "⦫",
      angmsdae: "⦬",
      angmsdaf: "⦭",
      angmsdag: "⦮",
      angmsdah: "⦯",
      angmsd: "∡",
      angrt: "∟",
      angrtvb: "⊾",
      angrtvbd: "⦝",
      angsph: "∢",
      angst: "Å",
      angzarr: "⍼",
      Aogon: "Ą",
      aogon: "ą",
      Aopf: "𝔸",
      aopf: "𝕒",
      apacir: "⩯",
      ap: "≈",
      apE: "⩰",
      ape: "≊",
      apid: "≋",
      apos: "'",
      ApplyFunction: "⁡",
      approx: "≈",
      approxeq: "≊",
      Aring: "Å",
      aring: "å",
      Ascr: "𝒜",
      ascr: "𝒶",
      Assign: "≔",
      ast: "*",
      asymp: "≈",
      asympeq: "≍",
      Atilde: "Ã",
      atilde: "ã",
      Auml: "Ä",
      auml: "ä",
      awconint: "∳",
      awint: "⨑",
      backcong: "≌",
      backepsilon: "϶",
      backprime: "‵",
      backsim: "∽",
      backsimeq: "⋍",
      Backslash: "∖",
      Barv: "⫧",
      barvee: "⊽",
      barwed: "⌅",
      Barwed: "⌆",
      barwedge: "⌅",
      bbrk: "⎵",
      bbrktbrk: "⎶",
      bcong: "≌",
      Bcy: "Б",
      bcy: "б",
      bdquo: "„",
      becaus: "∵",
      because: "∵",
      Because: "∵",
      bemptyv: "⦰",
      bepsi: "϶",
      bernou: "ℬ",
      Bernoullis: "ℬ",
      Beta: "Β",
      beta: "β",
      beth: "ℶ",
      between: "≬",
      Bfr: "𝔅",
      bfr: "𝔟",
      bigcap: "⋂",
      bigcirc: "◯",
      bigcup: "⋃",
      bigodot: "⨀",
      bigoplus: "⨁",
      bigotimes: "⨂",
      bigsqcup: "⨆",
      bigstar: "★",
      bigtriangledown: "▽",
      bigtriangleup: "△",
      biguplus: "⨄",
      bigvee: "⋁",
      bigwedge: "⋀",
      bkarow: "⤍",
      blacklozenge: "⧫",
      blacksquare: "▪",
      blacktriangle: "▴",
      blacktriangledown: "▾",
      blacktriangleleft: "◂",
      blacktriangleright: "▸",
      blank: "␣",
      blk12: "▒",
      blk14: "░",
      blk34: "▓",
      block: "█",
      bne: "=⃥",
      bnequiv: "≡⃥",
      bNot: "⫭",
      bnot: "⌐",
      Bopf: "𝔹",
      bopf: "𝕓",
      bot: "⊥",
      bottom: "⊥",
      bowtie: "⋈",
      boxbox: "⧉",
      boxdl: "┐",
      boxdL: "╕",
      boxDl: "╖",
      boxDL: "╗",
      boxdr: "┌",
      boxdR: "╒",
      boxDr: "╓",
      boxDR: "╔",
      boxh: "─",
      boxH: "═",
      boxhd: "┬",
      boxHd: "╤",
      boxhD: "╥",
      boxHD: "╦",
      boxhu: "┴",
      boxHu: "╧",
      boxhU: "╨",
      boxHU: "╩",
      boxminus: "⊟",
      boxplus: "⊞",
      boxtimes: "⊠",
      boxul: "┘",
      boxuL: "╛",
      boxUl: "╜",
      boxUL: "╝",
      boxur: "└",
      boxuR: "╘",
      boxUr: "╙",
      boxUR: "╚",
      boxv: "│",
      boxV: "║",
      boxvh: "┼",
      boxvH: "╪",
      boxVh: "╫",
      boxVH: "╬",
      boxvl: "┤",
      boxvL: "╡",
      boxVl: "╢",
      boxVL: "╣",
      boxvr: "├",
      boxvR: "╞",
      boxVr: "╟",
      boxVR: "╠",
      bprime: "‵",
      breve: "˘",
      Breve: "˘",
      brvbar: "¦",
      bscr: "𝒷",
      Bscr: "ℬ",
      bsemi: "⁏",
      bsim: "∽",
      bsime: "⋍",
      bsolb: "⧅",
      bsol: "\\",
      bsolhsub: "⟈",
      bull: "•",
      bullet: "•",
      bump: "≎",
      bumpE: "⪮",
      bumpe: "≏",
      Bumpeq: "≎",
      bumpeq: "≏",
      Cacute: "Ć",
      cacute: "ć",
      capand: "⩄",
      capbrcup: "⩉",
      capcap: "⩋",
      cap: "∩",
      Cap: "⋒",
      capcup: "⩇",
      capdot: "⩀",
      CapitalDifferentialD: "ⅅ",
      caps: "∩︀",
      caret: "⁁",
      caron: "ˇ",
      Cayleys: "ℭ",
      ccaps: "⩍",
      Ccaron: "Č",
      ccaron: "č",
      Ccedil: "Ç",
      ccedil: "ç",
      Ccirc: "Ĉ",
      ccirc: "ĉ",
      Cconint: "∰",
      ccups: "⩌",
      ccupssm: "⩐",
      Cdot: "Ċ",
      cdot: "ċ",
      cedil: "¸",
      Cedilla: "¸",
      cemptyv: "⦲",
      cent: "¢",
      centerdot: "·",
      CenterDot: "·",
      cfr: "𝔠",
      Cfr: "ℭ",
      CHcy: "Ч",
      chcy: "ч",
      check: "✓",
      checkmark: "✓",
      Chi: "Χ",
      chi: "χ",
      circ: "ˆ",
      circeq: "≗",
      circlearrowleft: "↺",
      circlearrowright: "↻",
      circledast: "⊛",
      circledcirc: "⊚",
      circleddash: "⊝",
      CircleDot: "⊙",
      circledR: "®",
      circledS: "Ⓢ",
      CircleMinus: "⊖",
      CirclePlus: "⊕",
      CircleTimes: "⊗",
      cir: "○",
      cirE: "⧃",
      cire: "≗",
      cirfnint: "⨐",
      cirmid: "⫯",
      cirscir: "⧂",
      ClockwiseContourIntegral: "∲",
      CloseCurlyDoubleQuote: "”",
      CloseCurlyQuote: "’",
      clubs: "♣",
      clubsuit: "♣",
      colon: ":",
      Colon: "∷",
      Colone: "⩴",
      colone: "≔",
      coloneq: "≔",
      comma: ",",
      commat: "@",
      comp: "∁",
      compfn: "∘",
      complement: "∁",
      complexes: "ℂ",
      cong: "≅",
      congdot: "⩭",
      Congruent: "≡",
      conint: "∮",
      Conint: "∯",
      ContourIntegral: "∮",
      copf: "𝕔",
      Copf: "ℂ",
      coprod: "∐",
      Coproduct: "∐",
      copy: "©",
      COPY: "©",
      copysr: "℗",
      CounterClockwiseContourIntegral: "∳",
      crarr: "↵",
      cross: "✗",
      Cross: "⨯",
      Cscr: "𝒞",
      cscr: "𝒸",
      csub: "⫏",
      csube: "⫑",
      csup: "⫐",
      csupe: "⫒",
      ctdot: "⋯",
      cudarrl: "⤸",
      cudarrr: "⤵",
      cuepr: "⋞",
      cuesc: "⋟",
      cularr: "↶",
      cularrp: "⤽",
      cupbrcap: "⩈",
      cupcap: "⩆",
      CupCap: "≍",
      cup: "∪",
      Cup: "⋓",
      cupcup: "⩊",
      cupdot: "⊍",
      cupor: "⩅",
      cups: "∪︀",
      curarr: "↷",
      curarrm: "⤼",
      curlyeqprec: "⋞",
      curlyeqsucc: "⋟",
      curlyvee: "⋎",
      curlywedge: "⋏",
      curren: "¤",
      curvearrowleft: "↶",
      curvearrowright: "↷",
      cuvee: "⋎",
      cuwed: "⋏",
      cwconint: "∲",
      cwint: "∱",
      cylcty: "⌭",
      dagger: "†",
      Dagger: "‡",
      daleth: "ℸ",
      darr: "↓",
      Darr: "↡",
      dArr: "⇓",
      dash: "‐",
      Dashv: "⫤",
      dashv: "⊣",
      dbkarow: "⤏",
      dblac: "˝",
      Dcaron: "Ď",
      dcaron: "ď",
      Dcy: "Д",
      dcy: "д",
      ddagger: "‡",
      ddarr: "⇊",
      DD: "ⅅ",
      dd: "ⅆ",
      DDotrahd: "⤑",
      ddotseq: "⩷",
      deg: "°",
      Del: "∇",
      Delta: "Δ",
      delta: "δ",
      demptyv: "⦱",
      dfisht: "⥿",
      Dfr: "𝔇",
      dfr: "𝔡",
      dHar: "⥥",
      dharl: "⇃",
      dharr: "⇂",
      DiacriticalAcute: "´",
      DiacriticalDot: "˙",
      DiacriticalDoubleAcute: "˝",
      DiacriticalGrave: "`",
      DiacriticalTilde: "˜",
      diam: "⋄",
      diamond: "⋄",
      Diamond: "⋄",
      diamondsuit: "♦",
      diams: "♦",
      die: "¨",
      DifferentialD: "ⅆ",
      digamma: "ϝ",
      disin: "⋲",
      div: "÷",
      divide: "÷",
      divideontimes: "⋇",
      divonx: "⋇",
      DJcy: "Ђ",
      djcy: "ђ",
      dlcorn: "⌞",
      dlcrop: "⌍",
      dollar: "$",
      Dopf: "𝔻",
      dopf: "𝕕",
      Dot: "¨",
      dot: "˙",
      DotDot: "⃜",
      doteq: "≐",
      doteqdot: "≑",
      DotEqual: "≐",
      dotminus: "∸",
      dotplus: "∔",
      dotsquare: "⊡",
      doublebarwedge: "⌆",
      DoubleContourIntegral: "∯",
      DoubleDot: "¨",
      DoubleDownArrow: "⇓",
      DoubleLeftArrow: "⇐",
      DoubleLeftRightArrow: "⇔",
      DoubleLeftTee: "⫤",
      DoubleLongLeftArrow: "⟸",
      DoubleLongLeftRightArrow: "⟺",
      DoubleLongRightArrow: "⟹",
      DoubleRightArrow: "⇒",
      DoubleRightTee: "⊨",
      DoubleUpArrow: "⇑",
      DoubleUpDownArrow: "⇕",
      DoubleVerticalBar: "∥",
      DownArrowBar: "⤓",
      downarrow: "↓",
      DownArrow: "↓",
      Downarrow: "⇓",
      DownArrowUpArrow: "⇵",
      DownBreve: "̑",
      downdownarrows: "⇊",
      downharpoonleft: "⇃",
      downharpoonright: "⇂",
      DownLeftRightVector: "⥐",
      DownLeftTeeVector: "⥞",
      DownLeftVectorBar: "⥖",
      DownLeftVector: "↽",
      DownRightTeeVector: "⥟",
      DownRightVectorBar: "⥗",
      DownRightVector: "⇁",
      DownTeeArrow: "↧",
      DownTee: "⊤",
      drbkarow: "⤐",
      drcorn: "⌟",
      drcrop: "⌌",
      Dscr: "𝒟",
      dscr: "𝒹",
      DScy: "Ѕ",
      dscy: "ѕ",
      dsol: "⧶",
      Dstrok: "Đ",
      dstrok: "đ",
      dtdot: "⋱",
      dtri: "▿",
      dtrif: "▾",
      duarr: "⇵",
      duhar: "⥯",
      dwangle: "⦦",
      DZcy: "Џ",
      dzcy: "џ",
      dzigrarr: "⟿",
      Eacute: "É",
      eacute: "é",
      easter: "⩮",
      Ecaron: "Ě",
      ecaron: "ě",
      Ecirc: "Ê",
      ecirc: "ê",
      ecir: "≖",
      ecolon: "≕",
      Ecy: "Э",
      ecy: "э",
      eDDot: "⩷",
      Edot: "Ė",
      edot: "ė",
      eDot: "≑",
      ee: "ⅇ",
      efDot: "≒",
      Efr: "𝔈",
      efr: "𝔢",
      eg: "⪚",
      Egrave: "È",
      egrave: "è",
      egs: "⪖",
      egsdot: "⪘",
      el: "⪙",
      Element: "∈",
      elinters: "⏧",
      ell: "ℓ",
      els: "⪕",
      elsdot: "⪗",
      Emacr: "Ē",
      emacr: "ē",
      empty: "∅",
      emptyset: "∅",
      EmptySmallSquare: "◻",
      emptyv: "∅",
      EmptyVerySmallSquare: "▫",
      emsp13: " ",
      emsp14: " ",
      emsp: " ",
      ENG: "Ŋ",
      eng: "ŋ",
      ensp: " ",
      Eogon: "Ę",
      eogon: "ę",
      Eopf: "𝔼",
      eopf: "𝕖",
      epar: "⋕",
      eparsl: "⧣",
      eplus: "⩱",
      epsi: "ε",
      Epsilon: "Ε",
      epsilon: "ε",
      epsiv: "ϵ",
      eqcirc: "≖",
      eqcolon: "≕",
      eqsim: "≂",
      eqslantgtr: "⪖",
      eqslantless: "⪕",
      Equal: "⩵",
      equals: "=",
      EqualTilde: "≂",
      equest: "≟",
      Equilibrium: "⇌",
      equiv: "≡",
      equivDD: "⩸",
      eqvparsl: "⧥",
      erarr: "⥱",
      erDot: "≓",
      escr: "ℯ",
      Escr: "ℰ",
      esdot: "≐",
      Esim: "⩳",
      esim: "≂",
      Eta: "Η",
      eta: "η",
      ETH: "Ð",
      eth: "ð",
      Euml: "Ë",
      euml: "ë",
      euro: "€",
      excl: "!",
      exist: "∃",
      Exists: "∃",
      expectation: "ℰ",
      exponentiale: "ⅇ",
      ExponentialE: "ⅇ",
      fallingdotseq: "≒",
      Fcy: "Ф",
      fcy: "ф",
      female: "♀",
      ffilig: "ﬃ",
      fflig: "ﬀ",
      ffllig: "ﬄ",
      Ffr: "𝔉",
      ffr: "𝔣",
      filig: "ﬁ",
      FilledSmallSquare: "◼",
      FilledVerySmallSquare: "▪",
      fjlig: "fj",
      flat: "♭",
      fllig: "ﬂ",
      fltns: "▱",
      fnof: "ƒ",
      Fopf: "𝔽",
      fopf: "𝕗",
      forall: "∀",
      ForAll: "∀",
      fork: "⋔",
      forkv: "⫙",
      Fouriertrf: "ℱ",
      fpartint: "⨍",
      frac12: "½",
      frac13: "⅓",
      frac14: "¼",
      frac15: "⅕",
      frac16: "⅙",
      frac18: "⅛",
      frac23: "⅔",
      frac25: "⅖",
      frac34: "¾",
      frac35: "⅗",
      frac38: "⅜",
      frac45: "⅘",
      frac56: "⅚",
      frac58: "⅝",
      frac78: "⅞",
      frasl: "⁄",
      frown: "⌢",
      fscr: "𝒻",
      Fscr: "ℱ",
      gacute: "ǵ",
      Gamma: "Γ",
      gamma: "γ",
      Gammad: "Ϝ",
      gammad: "ϝ",
      gap: "⪆",
      Gbreve: "Ğ",
      gbreve: "ğ",
      Gcedil: "Ģ",
      Gcirc: "Ĝ",
      gcirc: "ĝ",
      Gcy: "Г",
      gcy: "г",
      Gdot: "Ġ",
      gdot: "ġ",
      ge: "≥",
      gE: "≧",
      gEl: "⪌",
      gel: "⋛",
      geq: "≥",
      geqq: "≧",
      geqslant: "⩾",
      gescc: "⪩",
      ges: "⩾",
      gesdot: "⪀",
      gesdoto: "⪂",
      gesdotol: "⪄",
      gesl: "⋛︀",
      gesles: "⪔",
      Gfr: "𝔊",
      gfr: "𝔤",
      gg: "≫",
      Gg: "⋙",
      ggg: "⋙",
      gimel: "ℷ",
      GJcy: "Ѓ",
      gjcy: "ѓ",
      gla: "⪥",
      gl: "≷",
      glE: "⪒",
      glj: "⪤",
      gnap: "⪊",
      gnapprox: "⪊",
      gne: "⪈",
      gnE: "≩",
      gneq: "⪈",
      gneqq: "≩",
      gnsim: "⋧",
      Gopf: "𝔾",
      gopf: "𝕘",
      grave: "`",
      GreaterEqual: "≥",
      GreaterEqualLess: "⋛",
      GreaterFullEqual: "≧",
      GreaterGreater: "⪢",
      GreaterLess: "≷",
      GreaterSlantEqual: "⩾",
      GreaterTilde: "≳",
      Gscr: "𝒢",
      gscr: "ℊ",
      gsim: "≳",
      gsime: "⪎",
      gsiml: "⪐",
      gtcc: "⪧",
      gtcir: "⩺",
      gt: ">",
      GT: ">",
      Gt: "≫",
      gtdot: "⋗",
      gtlPar: "⦕",
      gtquest: "⩼",
      gtrapprox: "⪆",
      gtrarr: "⥸",
      gtrdot: "⋗",
      gtreqless: "⋛",
      gtreqqless: "⪌",
      gtrless: "≷",
      gtrsim: "≳",
      gvertneqq: "≩︀",
      gvnE: "≩︀",
      Hacek: "ˇ",
      hairsp: " ",
      half: "½",
      hamilt: "ℋ",
      HARDcy: "Ъ",
      hardcy: "ъ",
      harrcir: "⥈",
      harr: "↔",
      hArr: "⇔",
      harrw: "↭",
      Hat: "^",
      hbar: "ℏ",
      Hcirc: "Ĥ",
      hcirc: "ĥ",
      hearts: "♥",
      heartsuit: "♥",
      hellip: "…",
      hercon: "⊹",
      hfr: "𝔥",
      Hfr: "ℌ",
      HilbertSpace: "ℋ",
      hksearow: "⤥",
      hkswarow: "⤦",
      hoarr: "⇿",
      homtht: "∻",
      hookleftarrow: "↩",
      hookrightarrow: "↪",
      hopf: "𝕙",
      Hopf: "ℍ",
      horbar: "―",
      HorizontalLine: "─",
      hscr: "𝒽",
      Hscr: "ℋ",
      hslash: "ℏ",
      Hstrok: "Ħ",
      hstrok: "ħ",
      HumpDownHump: "≎",
      HumpEqual: "≏",
      hybull: "⁃",
      hyphen: "‐",
      Iacute: "Í",
      iacute: "í",
      ic: "⁣",
      Icirc: "Î",
      icirc: "î",
      Icy: "И",
      icy: "и",
      Idot: "İ",
      IEcy: "Е",
      iecy: "е",
      iexcl: "¡",
      iff: "⇔",
      ifr: "𝔦",
      Ifr: "ℑ",
      Igrave: "Ì",
      igrave: "ì",
      ii: "ⅈ",
      iiiint: "⨌",
      iiint: "∭",
      iinfin: "⧜",
      iiota: "℩",
      IJlig: "Ĳ",
      ijlig: "ĳ",
      Imacr: "Ī",
      imacr: "ī",
      image: "ℑ",
      ImaginaryI: "ⅈ",
      imagline: "ℐ",
      imagpart: "ℑ",
      imath: "ı",
      Im: "ℑ",
      imof: "⊷",
      imped: "Ƶ",
      Implies: "⇒",
      incare: "℅",
      in: "∈",
      infin: "∞",
      infintie: "⧝",
      inodot: "ı",
      intcal: "⊺",
      int: "∫",
      Int: "∬",
      integers: "ℤ",
      Integral: "∫",
      intercal: "⊺",
      Intersection: "⋂",
      intlarhk: "⨗",
      intprod: "⨼",
      InvisibleComma: "⁣",
      InvisibleTimes: "⁢",
      IOcy: "Ё",
      iocy: "ё",
      Iogon: "Į",
      iogon: "į",
      Iopf: "𝕀",
      iopf: "𝕚",
      Iota: "Ι",
      iota: "ι",
      iprod: "⨼",
      iquest: "¿",
      iscr: "𝒾",
      Iscr: "ℐ",
      isin: "∈",
      isindot: "⋵",
      isinE: "⋹",
      isins: "⋴",
      isinsv: "⋳",
      isinv: "∈",
      it: "⁢",
      Itilde: "Ĩ",
      itilde: "ĩ",
      Iukcy: "І",
      iukcy: "і",
      Iuml: "Ï",
      iuml: "ï",
      Jcirc: "Ĵ",
      jcirc: "ĵ",
      Jcy: "Й",
      jcy: "й",
      Jfr: "𝔍",
      jfr: "𝔧",
      jmath: "ȷ",
      Jopf: "𝕁",
      jopf: "𝕛",
      Jscr: "𝒥",
      jscr: "𝒿",
      Jsercy: "Ј",
      jsercy: "ј",
      Jukcy: "Є",
      jukcy: "є",
      Kappa: "Κ",
      kappa: "κ",
      kappav: "ϰ",
      Kcedil: "Ķ",
      kcedil: "ķ",
      Kcy: "К",
      kcy: "к",
      Kfr: "𝔎",
      kfr: "𝔨",
      kgreen: "ĸ",
      KHcy: "Х",
      khcy: "х",
      KJcy: "Ќ",
      kjcy: "ќ",
      Kopf: "𝕂",
      kopf: "𝕜",
      Kscr: "𝒦",
      kscr: "𝓀",
      lAarr: "⇚",
      Lacute: "Ĺ",
      lacute: "ĺ",
      laemptyv: "⦴",
      lagran: "ℒ",
      Lambda: "Λ",
      lambda: "λ",
      lang: "⟨",
      Lang: "⟪",
      langd: "⦑",
      langle: "⟨",
      lap: "⪅",
      Laplacetrf: "ℒ",
      laquo: "«",
      larrb: "⇤",
      larrbfs: "⤟",
      larr: "←",
      Larr: "↞",
      lArr: "⇐",
      larrfs: "⤝",
      larrhk: "↩",
      larrlp: "↫",
      larrpl: "⤹",
      larrsim: "⥳",
      larrtl: "↢",
      latail: "⤙",
      lAtail: "⤛",
      lat: "⪫",
      late: "⪭",
      lates: "⪭︀",
      lbarr: "⤌",
      lBarr: "⤎",
      lbbrk: "❲",
      lbrace: "{",
      lbrack: "[",
      lbrke: "⦋",
      lbrksld: "⦏",
      lbrkslu: "⦍",
      Lcaron: "Ľ",
      lcaron: "ľ",
      Lcedil: "Ļ",
      lcedil: "ļ",
      lceil: "⌈",
      lcub: "{",
      Lcy: "Л",
      lcy: "л",
      ldca: "⤶",
      ldquo: "“",
      ldquor: "„",
      ldrdhar: "⥧",
      ldrushar: "⥋",
      ldsh: "↲",
      le: "≤",
      lE: "≦",
      LeftAngleBracket: "⟨",
      LeftArrowBar: "⇤",
      leftarrow: "←",
      LeftArrow: "←",
      Leftarrow: "⇐",
      LeftArrowRightArrow: "⇆",
      leftarrowtail: "↢",
      LeftCeiling: "⌈",
      LeftDoubleBracket: "⟦",
      LeftDownTeeVector: "⥡",
      LeftDownVectorBar: "⥙",
      LeftDownVector: "⇃",
      LeftFloor: "⌊",
      leftharpoondown: "↽",
      leftharpoonup: "↼",
      leftleftarrows: "⇇",
      leftrightarrow: "↔",
      LeftRightArrow: "↔",
      Leftrightarrow: "⇔",
      leftrightarrows: "⇆",
      leftrightharpoons: "⇋",
      leftrightsquigarrow: "↭",
      LeftRightVector: "⥎",
      LeftTeeArrow: "↤",
      LeftTee: "⊣",
      LeftTeeVector: "⥚",
      leftthreetimes: "⋋",
      LeftTriangleBar: "⧏",
      LeftTriangle: "⊲",
      LeftTriangleEqual: "⊴",
      LeftUpDownVector: "⥑",
      LeftUpTeeVector: "⥠",
      LeftUpVectorBar: "⥘",
      LeftUpVector: "↿",
      LeftVectorBar: "⥒",
      LeftVector: "↼",
      lEg: "⪋",
      leg: "⋚",
      leq: "≤",
      leqq: "≦",
      leqslant: "⩽",
      lescc: "⪨",
      les: "⩽",
      lesdot: "⩿",
      lesdoto: "⪁",
      lesdotor: "⪃",
      lesg: "⋚︀",
      lesges: "⪓",
      lessapprox: "⪅",
      lessdot: "⋖",
      lesseqgtr: "⋚",
      lesseqqgtr: "⪋",
      LessEqualGreater: "⋚",
      LessFullEqual: "≦",
      LessGreater: "≶",
      lessgtr: "≶",
      LessLess: "⪡",
      lesssim: "≲",
      LessSlantEqual: "⩽",
      LessTilde: "≲",
      lfisht: "⥼",
      lfloor: "⌊",
      Lfr: "𝔏",
      lfr: "𝔩",
      lg: "≶",
      lgE: "⪑",
      lHar: "⥢",
      lhard: "↽",
      lharu: "↼",
      lharul: "⥪",
      lhblk: "▄",
      LJcy: "Љ",
      ljcy: "љ",
      llarr: "⇇",
      ll: "≪",
      Ll: "⋘",
      llcorner: "⌞",
      Lleftarrow: "⇚",
      llhard: "⥫",
      lltri: "◺",
      Lmidot: "Ŀ",
      lmidot: "ŀ",
      lmoustache: "⎰",
      lmoust: "⎰",
      lnap: "⪉",
      lnapprox: "⪉",
      lne: "⪇",
      lnE: "≨",
      lneq: "⪇",
      lneqq: "≨",
      lnsim: "⋦",
      loang: "⟬",
      loarr: "⇽",
      lobrk: "⟦",
      longleftarrow: "⟵",
      LongLeftArrow: "⟵",
      Longleftarrow: "⟸",
      longleftrightarrow: "⟷",
      LongLeftRightArrow: "⟷",
      Longleftrightarrow: "⟺",
      longmapsto: "⟼",
      longrightarrow: "⟶",
      LongRightArrow: "⟶",
      Longrightarrow: "⟹",
      looparrowleft: "↫",
      looparrowright: "↬",
      lopar: "⦅",
      Lopf: "𝕃",
      lopf: "𝕝",
      loplus: "⨭",
      lotimes: "⨴",
      lowast: "∗",
      lowbar: "_",
      LowerLeftArrow: "↙",
      LowerRightArrow: "↘",
      loz: "◊",
      lozenge: "◊",
      lozf: "⧫",
      lpar: "(",
      lparlt: "⦓",
      lrarr: "⇆",
      lrcorner: "⌟",
      lrhar: "⇋",
      lrhard: "⥭",
      lrm: "‎",
      lrtri: "⊿",
      lsaquo: "‹",
      lscr: "𝓁",
      Lscr: "ℒ",
      lsh: "↰",
      Lsh: "↰",
      lsim: "≲",
      lsime: "⪍",
      lsimg: "⪏",
      lsqb: "[",
      lsquo: "‘",
      lsquor: "‚",
      Lstrok: "Ł",
      lstrok: "ł",
      ltcc: "⪦",
      ltcir: "⩹",
      lt: "<",
      LT: "<",
      Lt: "≪",
      ltdot: "⋖",
      lthree: "⋋",
      ltimes: "⋉",
      ltlarr: "⥶",
      ltquest: "⩻",
      ltri: "◃",
      ltrie: "⊴",
      ltrif: "◂",
      ltrPar: "⦖",
      lurdshar: "⥊",
      luruhar: "⥦",
      lvertneqq: "≨︀",
      lvnE: "≨︀",
      macr: "¯",
      male: "♂",
      malt: "✠",
      maltese: "✠",
      Map: "⤅",
      map: "↦",
      mapsto: "↦",
      mapstodown: "↧",
      mapstoleft: "↤",
      mapstoup: "↥",
      marker: "▮",
      mcomma: "⨩",
      Mcy: "М",
      mcy: "м",
      mdash: "—",
      mDDot: "∺",
      measuredangle: "∡",
      MediumSpace: " ",
      Mellintrf: "ℳ",
      Mfr: "𝔐",
      mfr: "𝔪",
      mho: "℧",
      micro: "µ",
      midast: "*",
      midcir: "⫰",
      mid: "∣",
      middot: "·",
      minusb: "⊟",
      minus: "−",
      minusd: "∸",
      minusdu: "⨪",
      MinusPlus: "∓",
      mlcp: "⫛",
      mldr: "…",
      mnplus: "∓",
      models: "⊧",
      Mopf: "𝕄",
      mopf: "𝕞",
      mp: "∓",
      mscr: "𝓂",
      Mscr: "ℳ",
      mstpos: "∾",
      Mu: "Μ",
      mu: "μ",
      multimap: "⊸",
      mumap: "⊸",
      nabla: "∇",
      Nacute: "Ń",
      nacute: "ń",
      nang: "∠⃒",
      nap: "≉",
      napE: "⩰̸",
      napid: "≋̸",
      napos: "ŉ",
      napprox: "≉",
      natural: "♮",
      naturals: "ℕ",
      natur: "♮",
      nbsp: " ",
      nbump: "≎̸",
      nbumpe: "≏̸",
      ncap: "⩃",
      Ncaron: "Ň",
      ncaron: "ň",
      Ncedil: "Ņ",
      ncedil: "ņ",
      ncong: "≇",
      ncongdot: "⩭̸",
      ncup: "⩂",
      Ncy: "Н",
      ncy: "н",
      ndash: "–",
      nearhk: "⤤",
      nearr: "↗",
      neArr: "⇗",
      nearrow: "↗",
      ne: "≠",
      nedot: "≐̸",
      NegativeMediumSpace: "​",
      NegativeThickSpace: "​",
      NegativeThinSpace: "​",
      NegativeVeryThinSpace: "​",
      nequiv: "≢",
      nesear: "⤨",
      nesim: "≂̸",
      NestedGreaterGreater: "≫",
      NestedLessLess: "≪",
      NewLine: `
`,
      nexist: "∄",
      nexists: "∄",
      Nfr: "𝔑",
      nfr: "𝔫",
      ngE: "≧̸",
      nge: "≱",
      ngeq: "≱",
      ngeqq: "≧̸",
      ngeqslant: "⩾̸",
      nges: "⩾̸",
      nGg: "⋙̸",
      ngsim: "≵",
      nGt: "≫⃒",
      ngt: "≯",
      ngtr: "≯",
      nGtv: "≫̸",
      nharr: "↮",
      nhArr: "⇎",
      nhpar: "⫲",
      ni: "∋",
      nis: "⋼",
      nisd: "⋺",
      niv: "∋",
      NJcy: "Њ",
      njcy: "њ",
      nlarr: "↚",
      nlArr: "⇍",
      nldr: "‥",
      nlE: "≦̸",
      nle: "≰",
      nleftarrow: "↚",
      nLeftarrow: "⇍",
      nleftrightarrow: "↮",
      nLeftrightarrow: "⇎",
      nleq: "≰",
      nleqq: "≦̸",
      nleqslant: "⩽̸",
      nles: "⩽̸",
      nless: "≮",
      nLl: "⋘̸",
      nlsim: "≴",
      nLt: "≪⃒",
      nlt: "≮",
      nltri: "⋪",
      nltrie: "⋬",
      nLtv: "≪̸",
      nmid: "∤",
      NoBreak: "⁠",
      NonBreakingSpace: " ",
      nopf: "𝕟",
      Nopf: "ℕ",
      Not: "⫬",
      not: "¬",
      NotCongruent: "≢",
      NotCupCap: "≭",
      NotDoubleVerticalBar: "∦",
      NotElement: "∉",
      NotEqual: "≠",
      NotEqualTilde: "≂̸",
      NotExists: "∄",
      NotGreater: "≯",
      NotGreaterEqual: "≱",
      NotGreaterFullEqual: "≧̸",
      NotGreaterGreater: "≫̸",
      NotGreaterLess: "≹",
      NotGreaterSlantEqual: "⩾̸",
      NotGreaterTilde: "≵",
      NotHumpDownHump: "≎̸",
      NotHumpEqual: "≏̸",
      notin: "∉",
      notindot: "⋵̸",
      notinE: "⋹̸",
      notinva: "∉",
      notinvb: "⋷",
      notinvc: "⋶",
      NotLeftTriangleBar: "⧏̸",
      NotLeftTriangle: "⋪",
      NotLeftTriangleEqual: "⋬",
      NotLess: "≮",
      NotLessEqual: "≰",
      NotLessGreater: "≸",
      NotLessLess: "≪̸",
      NotLessSlantEqual: "⩽̸",
      NotLessTilde: "≴",
      NotNestedGreaterGreater: "⪢̸",
      NotNestedLessLess: "⪡̸",
      notni: "∌",
      notniva: "∌",
      notnivb: "⋾",
      notnivc: "⋽",
      NotPrecedes: "⊀",
      NotPrecedesEqual: "⪯̸",
      NotPrecedesSlantEqual: "⋠",
      NotReverseElement: "∌",
      NotRightTriangleBar: "⧐̸",
      NotRightTriangle: "⋫",
      NotRightTriangleEqual: "⋭",
      NotSquareSubset: "⊏̸",
      NotSquareSubsetEqual: "⋢",
      NotSquareSuperset: "⊐̸",
      NotSquareSupersetEqual: "⋣",
      NotSubset: "⊂⃒",
      NotSubsetEqual: "⊈",
      NotSucceeds: "⊁",
      NotSucceedsEqual: "⪰̸",
      NotSucceedsSlantEqual: "⋡",
      NotSucceedsTilde: "≿̸",
      NotSuperset: "⊃⃒",
      NotSupersetEqual: "⊉",
      NotTilde: "≁",
      NotTildeEqual: "≄",
      NotTildeFullEqual: "≇",
      NotTildeTilde: "≉",
      NotVerticalBar: "∤",
      nparallel: "∦",
      npar: "∦",
      nparsl: "⫽⃥",
      npart: "∂̸",
      npolint: "⨔",
      npr: "⊀",
      nprcue: "⋠",
      nprec: "⊀",
      npreceq: "⪯̸",
      npre: "⪯̸",
      nrarrc: "⤳̸",
      nrarr: "↛",
      nrArr: "⇏",
      nrarrw: "↝̸",
      nrightarrow: "↛",
      nRightarrow: "⇏",
      nrtri: "⋫",
      nrtrie: "⋭",
      nsc: "⊁",
      nsccue: "⋡",
      nsce: "⪰̸",
      Nscr: "𝒩",
      nscr: "𝓃",
      nshortmid: "∤",
      nshortparallel: "∦",
      nsim: "≁",
      nsime: "≄",
      nsimeq: "≄",
      nsmid: "∤",
      nspar: "∦",
      nsqsube: "⋢",
      nsqsupe: "⋣",
      nsub: "⊄",
      nsubE: "⫅̸",
      nsube: "⊈",
      nsubset: "⊂⃒",
      nsubseteq: "⊈",
      nsubseteqq: "⫅̸",
      nsucc: "⊁",
      nsucceq: "⪰̸",
      nsup: "⊅",
      nsupE: "⫆̸",
      nsupe: "⊉",
      nsupset: "⊃⃒",
      nsupseteq: "⊉",
      nsupseteqq: "⫆̸",
      ntgl: "≹",
      Ntilde: "Ñ",
      ntilde: "ñ",
      ntlg: "≸",
      ntriangleleft: "⋪",
      ntrianglelefteq: "⋬",
      ntriangleright: "⋫",
      ntrianglerighteq: "⋭",
      Nu: "Ν",
      nu: "ν",
      num: "#",
      numero: "№",
      numsp: " ",
      nvap: "≍⃒",
      nvdash: "⊬",
      nvDash: "⊭",
      nVdash: "⊮",
      nVDash: "⊯",
      nvge: "≥⃒",
      nvgt: ">⃒",
      nvHarr: "⤄",
      nvinfin: "⧞",
      nvlArr: "⤂",
      nvle: "≤⃒",
      nvlt: "<⃒",
      nvltrie: "⊴⃒",
      nvrArr: "⤃",
      nvrtrie: "⊵⃒",
      nvsim: "∼⃒",
      nwarhk: "⤣",
      nwarr: "↖",
      nwArr: "⇖",
      nwarrow: "↖",
      nwnear: "⤧",
      Oacute: "Ó",
      oacute: "ó",
      oast: "⊛",
      Ocirc: "Ô",
      ocirc: "ô",
      ocir: "⊚",
      Ocy: "О",
      ocy: "о",
      odash: "⊝",
      Odblac: "Ő",
      odblac: "ő",
      odiv: "⨸",
      odot: "⊙",
      odsold: "⦼",
      OElig: "Œ",
      oelig: "œ",
      ofcir: "⦿",
      Ofr: "𝔒",
      ofr: "𝔬",
      ogon: "˛",
      Ograve: "Ò",
      ograve: "ò",
      ogt: "⧁",
      ohbar: "⦵",
      ohm: "Ω",
      oint: "∮",
      olarr: "↺",
      olcir: "⦾",
      olcross: "⦻",
      oline: "‾",
      olt: "⧀",
      Omacr: "Ō",
      omacr: "ō",
      Omega: "Ω",
      omega: "ω",
      Omicron: "Ο",
      omicron: "ο",
      omid: "⦶",
      ominus: "⊖",
      Oopf: "𝕆",
      oopf: "𝕠",
      opar: "⦷",
      OpenCurlyDoubleQuote: "“",
      OpenCurlyQuote: "‘",
      operp: "⦹",
      oplus: "⊕",
      orarr: "↻",
      Or: "⩔",
      or: "∨",
      ord: "⩝",
      order: "ℴ",
      orderof: "ℴ",
      ordf: "ª",
      ordm: "º",
      origof: "⊶",
      oror: "⩖",
      orslope: "⩗",
      orv: "⩛",
      oS: "Ⓢ",
      Oscr: "𝒪",
      oscr: "ℴ",
      Oslash: "Ø",
      oslash: "ø",
      osol: "⊘",
      Otilde: "Õ",
      otilde: "õ",
      otimesas: "⨶",
      Otimes: "⨷",
      otimes: "⊗",
      Ouml: "Ö",
      ouml: "ö",
      ovbar: "⌽",
      OverBar: "‾",
      OverBrace: "⏞",
      OverBracket: "⎴",
      OverParenthesis: "⏜",
      para: "¶",
      parallel: "∥",
      par: "∥",
      parsim: "⫳",
      parsl: "⫽",
      part: "∂",
      PartialD: "∂",
      Pcy: "П",
      pcy: "п",
      percnt: "%",
      period: ".",
      permil: "‰",
      perp: "⊥",
      pertenk: "‱",
      Pfr: "𝔓",
      pfr: "𝔭",
      Phi: "Φ",
      phi: "φ",
      phiv: "ϕ",
      phmmat: "ℳ",
      phone: "☎",
      Pi: "Π",
      pi: "π",
      pitchfork: "⋔",
      piv: "ϖ",
      planck: "ℏ",
      planckh: "ℎ",
      plankv: "ℏ",
      plusacir: "⨣",
      plusb: "⊞",
      pluscir: "⨢",
      plus: "+",
      plusdo: "∔",
      plusdu: "⨥",
      pluse: "⩲",
      PlusMinus: "±",
      plusmn: "±",
      plussim: "⨦",
      plustwo: "⨧",
      pm: "±",
      Poincareplane: "ℌ",
      pointint: "⨕",
      popf: "𝕡",
      Popf: "ℙ",
      pound: "£",
      prap: "⪷",
      Pr: "⪻",
      pr: "≺",
      prcue: "≼",
      precapprox: "⪷",
      prec: "≺",
      preccurlyeq: "≼",
      Precedes: "≺",
      PrecedesEqual: "⪯",
      PrecedesSlantEqual: "≼",
      PrecedesTilde: "≾",
      preceq: "⪯",
      precnapprox: "⪹",
      precneqq: "⪵",
      precnsim: "⋨",
      pre: "⪯",
      prE: "⪳",
      precsim: "≾",
      prime: "′",
      Prime: "″",
      primes: "ℙ",
      prnap: "⪹",
      prnE: "⪵",
      prnsim: "⋨",
      prod: "∏",
      Product: "∏",
      profalar: "⌮",
      profline: "⌒",
      profsurf: "⌓",
      prop: "∝",
      Proportional: "∝",
      Proportion: "∷",
      propto: "∝",
      prsim: "≾",
      prurel: "⊰",
      Pscr: "𝒫",
      pscr: "𝓅",
      Psi: "Ψ",
      psi: "ψ",
      puncsp: " ",
      Qfr: "𝔔",
      qfr: "𝔮",
      qint: "⨌",
      qopf: "𝕢",
      Qopf: "ℚ",
      qprime: "⁗",
      Qscr: "𝒬",
      qscr: "𝓆",
      quaternions: "ℍ",
      quatint: "⨖",
      quest: "?",
      questeq: "≟",
      quot: '"',
      QUOT: '"',
      rAarr: "⇛",
      race: "∽̱",
      Racute: "Ŕ",
      racute: "ŕ",
      radic: "√",
      raemptyv: "⦳",
      rang: "⟩",
      Rang: "⟫",
      rangd: "⦒",
      range: "⦥",
      rangle: "⟩",
      raquo: "»",
      rarrap: "⥵",
      rarrb: "⇥",
      rarrbfs: "⤠",
      rarrc: "⤳",
      rarr: "→",
      Rarr: "↠",
      rArr: "⇒",
      rarrfs: "⤞",
      rarrhk: "↪",
      rarrlp: "↬",
      rarrpl: "⥅",
      rarrsim: "⥴",
      Rarrtl: "⤖",
      rarrtl: "↣",
      rarrw: "↝",
      ratail: "⤚",
      rAtail: "⤜",
      ratio: "∶",
      rationals: "ℚ",
      rbarr: "⤍",
      rBarr: "⤏",
      RBarr: "⤐",
      rbbrk: "❳",
      rbrace: "}",
      rbrack: "]",
      rbrke: "⦌",
      rbrksld: "⦎",
      rbrkslu: "⦐",
      Rcaron: "Ř",
      rcaron: "ř",
      Rcedil: "Ŗ",
      rcedil: "ŗ",
      rceil: "⌉",
      rcub: "}",
      Rcy: "Р",
      rcy: "р",
      rdca: "⤷",
      rdldhar: "⥩",
      rdquo: "”",
      rdquor: "”",
      rdsh: "↳",
      real: "ℜ",
      realine: "ℛ",
      realpart: "ℜ",
      reals: "ℝ",
      Re: "ℜ",
      rect: "▭",
      reg: "®",
      REG: "®",
      ReverseElement: "∋",
      ReverseEquilibrium: "⇋",
      ReverseUpEquilibrium: "⥯",
      rfisht: "⥽",
      rfloor: "⌋",
      rfr: "𝔯",
      Rfr: "ℜ",
      rHar: "⥤",
      rhard: "⇁",
      rharu: "⇀",
      rharul: "⥬",
      Rho: "Ρ",
      rho: "ρ",
      rhov: "ϱ",
      RightAngleBracket: "⟩",
      RightArrowBar: "⇥",
      rightarrow: "→",
      RightArrow: "→",
      Rightarrow: "⇒",
      RightArrowLeftArrow: "⇄",
      rightarrowtail: "↣",
      RightCeiling: "⌉",
      RightDoubleBracket: "⟧",
      RightDownTeeVector: "⥝",
      RightDownVectorBar: "⥕",
      RightDownVector: "⇂",
      RightFloor: "⌋",
      rightharpoondown: "⇁",
      rightharpoonup: "⇀",
      rightleftarrows: "⇄",
      rightleftharpoons: "⇌",
      rightrightarrows: "⇉",
      rightsquigarrow: "↝",
      RightTeeArrow: "↦",
      RightTee: "⊢",
      RightTeeVector: "⥛",
      rightthreetimes: "⋌",
      RightTriangleBar: "⧐",
      RightTriangle: "⊳",
      RightTriangleEqual: "⊵",
      RightUpDownVector: "⥏",
      RightUpTeeVector: "⥜",
      RightUpVectorBar: "⥔",
      RightUpVector: "↾",
      RightVectorBar: "⥓",
      RightVector: "⇀",
      ring: "˚",
      risingdotseq: "≓",
      rlarr: "⇄",
      rlhar: "⇌",
      rlm: "‏",
      rmoustache: "⎱",
      rmoust: "⎱",
      rnmid: "⫮",
      roang: "⟭",
      roarr: "⇾",
      robrk: "⟧",
      ropar: "⦆",
      ropf: "𝕣",
      Ropf: "ℝ",
      roplus: "⨮",
      rotimes: "⨵",
      RoundImplies: "⥰",
      rpar: ")",
      rpargt: "⦔",
      rppolint: "⨒",
      rrarr: "⇉",
      Rrightarrow: "⇛",
      rsaquo: "›",
      rscr: "𝓇",
      Rscr: "ℛ",
      rsh: "↱",
      Rsh: "↱",
      rsqb: "]",
      rsquo: "’",
      rsquor: "’",
      rthree: "⋌",
      rtimes: "⋊",
      rtri: "▹",
      rtrie: "⊵",
      rtrif: "▸",
      rtriltri: "⧎",
      RuleDelayed: "⧴",
      ruluhar: "⥨",
      rx: "℞",
      Sacute: "Ś",
      sacute: "ś",
      sbquo: "‚",
      scap: "⪸",
      Scaron: "Š",
      scaron: "š",
      Sc: "⪼",
      sc: "≻",
      sccue: "≽",
      sce: "⪰",
      scE: "⪴",
      Scedil: "Ş",
      scedil: "ş",
      Scirc: "Ŝ",
      scirc: "ŝ",
      scnap: "⪺",
      scnE: "⪶",
      scnsim: "⋩",
      scpolint: "⨓",
      scsim: "≿",
      Scy: "С",
      scy: "с",
      sdotb: "⊡",
      sdot: "⋅",
      sdote: "⩦",
      searhk: "⤥",
      searr: "↘",
      seArr: "⇘",
      searrow: "↘",
      sect: "§",
      semi: ";",
      seswar: "⤩",
      setminus: "∖",
      setmn: "∖",
      sext: "✶",
      Sfr: "𝔖",
      sfr: "𝔰",
      sfrown: "⌢",
      sharp: "♯",
      SHCHcy: "Щ",
      shchcy: "щ",
      SHcy: "Ш",
      shcy: "ш",
      ShortDownArrow: "↓",
      ShortLeftArrow: "←",
      shortmid: "∣",
      shortparallel: "∥",
      ShortRightArrow: "→",
      ShortUpArrow: "↑",
      shy: "­",
      Sigma: "Σ",
      sigma: "σ",
      sigmaf: "ς",
      sigmav: "ς",
      sim: "∼",
      simdot: "⩪",
      sime: "≃",
      simeq: "≃",
      simg: "⪞",
      simgE: "⪠",
      siml: "⪝",
      simlE: "⪟",
      simne: "≆",
      simplus: "⨤",
      simrarr: "⥲",
      slarr: "←",
      SmallCircle: "∘",
      smallsetminus: "∖",
      smashp: "⨳",
      smeparsl: "⧤",
      smid: "∣",
      smile: "⌣",
      smt: "⪪",
      smte: "⪬",
      smtes: "⪬︀",
      SOFTcy: "Ь",
      softcy: "ь",
      solbar: "⌿",
      solb: "⧄",
      sol: "/",
      Sopf: "𝕊",
      sopf: "𝕤",
      spades: "♠",
      spadesuit: "♠",
      spar: "∥",
      sqcap: "⊓",
      sqcaps: "⊓︀",
      sqcup: "⊔",
      sqcups: "⊔︀",
      Sqrt: "√",
      sqsub: "⊏",
      sqsube: "⊑",
      sqsubset: "⊏",
      sqsubseteq: "⊑",
      sqsup: "⊐",
      sqsupe: "⊒",
      sqsupset: "⊐",
      sqsupseteq: "⊒",
      square: "□",
      Square: "□",
      SquareIntersection: "⊓",
      SquareSubset: "⊏",
      SquareSubsetEqual: "⊑",
      SquareSuperset: "⊐",
      SquareSupersetEqual: "⊒",
      SquareUnion: "⊔",
      squarf: "▪",
      squ: "□",
      squf: "▪",
      srarr: "→",
      Sscr: "𝒮",
      sscr: "𝓈",
      ssetmn: "∖",
      ssmile: "⌣",
      sstarf: "⋆",
      Star: "⋆",
      star: "☆",
      starf: "★",
      straightepsilon: "ϵ",
      straightphi: "ϕ",
      strns: "¯",
      sub: "⊂",
      Sub: "⋐",
      subdot: "⪽",
      subE: "⫅",
      sube: "⊆",
      subedot: "⫃",
      submult: "⫁",
      subnE: "⫋",
      subne: "⊊",
      subplus: "⪿",
      subrarr: "⥹",
      subset: "⊂",
      Subset: "⋐",
      subseteq: "⊆",
      subseteqq: "⫅",
      SubsetEqual: "⊆",
      subsetneq: "⊊",
      subsetneqq: "⫋",
      subsim: "⫇",
      subsub: "⫕",
      subsup: "⫓",
      succapprox: "⪸",
      succ: "≻",
      succcurlyeq: "≽",
      Succeeds: "≻",
      SucceedsEqual: "⪰",
      SucceedsSlantEqual: "≽",
      SucceedsTilde: "≿",
      succeq: "⪰",
      succnapprox: "⪺",
      succneqq: "⪶",
      succnsim: "⋩",
      succsim: "≿",
      SuchThat: "∋",
      sum: "∑",
      Sum: "∑",
      sung: "♪",
      sup1: "¹",
      sup2: "²",
      sup3: "³",
      sup: "⊃",
      Sup: "⋑",
      supdot: "⪾",
      supdsub: "⫘",
      supE: "⫆",
      supe: "⊇",
      supedot: "⫄",
      Superset: "⊃",
      SupersetEqual: "⊇",
      suphsol: "⟉",
      suphsub: "⫗",
      suplarr: "⥻",
      supmult: "⫂",
      supnE: "⫌",
      supne: "⊋",
      supplus: "⫀",
      supset: "⊃",
      Supset: "⋑",
      supseteq: "⊇",
      supseteqq: "⫆",
      supsetneq: "⊋",
      supsetneqq: "⫌",
      supsim: "⫈",
      supsub: "⫔",
      supsup: "⫖",
      swarhk: "⤦",
      swarr: "↙",
      swArr: "⇙",
      swarrow: "↙",
      swnwar: "⤪",
      szlig: "ß",
      Tab: "	",
      target: "⌖",
      Tau: "Τ",
      tau: "τ",
      tbrk: "⎴",
      Tcaron: "Ť",
      tcaron: "ť",
      Tcedil: "Ţ",
      tcedil: "ţ",
      Tcy: "Т",
      tcy: "т",
      tdot: "⃛",
      telrec: "⌕",
      Tfr: "𝔗",
      tfr: "𝔱",
      there4: "∴",
      therefore: "∴",
      Therefore: "∴",
      Theta: "Θ",
      theta: "θ",
      thetasym: "ϑ",
      thetav: "ϑ",
      thickapprox: "≈",
      thicksim: "∼",
      ThickSpace: "  ",
      ThinSpace: " ",
      thinsp: " ",
      thkap: "≈",
      thksim: "∼",
      THORN: "Þ",
      thorn: "þ",
      tilde: "˜",
      Tilde: "∼",
      TildeEqual: "≃",
      TildeFullEqual: "≅",
      TildeTilde: "≈",
      timesbar: "⨱",
      timesb: "⊠",
      times: "×",
      timesd: "⨰",
      tint: "∭",
      toea: "⤨",
      topbot: "⌶",
      topcir: "⫱",
      top: "⊤",
      Topf: "𝕋",
      topf: "𝕥",
      topfork: "⫚",
      tosa: "⤩",
      tprime: "‴",
      trade: "™",
      TRADE: "™",
      triangle: "▵",
      triangledown: "▿",
      triangleleft: "◃",
      trianglelefteq: "⊴",
      triangleq: "≜",
      triangleright: "▹",
      trianglerighteq: "⊵",
      tridot: "◬",
      trie: "≜",
      triminus: "⨺",
      TripleDot: "⃛",
      triplus: "⨹",
      trisb: "⧍",
      tritime: "⨻",
      trpezium: "⏢",
      Tscr: "𝒯",
      tscr: "𝓉",
      TScy: "Ц",
      tscy: "ц",
      TSHcy: "Ћ",
      tshcy: "ћ",
      Tstrok: "Ŧ",
      tstrok: "ŧ",
      twixt: "≬",
      twoheadleftarrow: "↞",
      twoheadrightarrow: "↠",
      Uacute: "Ú",
      uacute: "ú",
      uarr: "↑",
      Uarr: "↟",
      uArr: "⇑",
      Uarrocir: "⥉",
      Ubrcy: "Ў",
      ubrcy: "ў",
      Ubreve: "Ŭ",
      ubreve: "ŭ",
      Ucirc: "Û",
      ucirc: "û",
      Ucy: "У",
      ucy: "у",
      udarr: "⇅",
      Udblac: "Ű",
      udblac: "ű",
      udhar: "⥮",
      ufisht: "⥾",
      Ufr: "𝔘",
      ufr: "𝔲",
      Ugrave: "Ù",
      ugrave: "ù",
      uHar: "⥣",
      uharl: "↿",
      uharr: "↾",
      uhblk: "▀",
      ulcorn: "⌜",
      ulcorner: "⌜",
      ulcrop: "⌏",
      ultri: "◸",
      Umacr: "Ū",
      umacr: "ū",
      uml: "¨",
      UnderBar: "_",
      UnderBrace: "⏟",
      UnderBracket: "⎵",
      UnderParenthesis: "⏝",
      Union: "⋃",
      UnionPlus: "⊎",
      Uogon: "Ų",
      uogon: "ų",
      Uopf: "𝕌",
      uopf: "𝕦",
      UpArrowBar: "⤒",
      uparrow: "↑",
      UpArrow: "↑",
      Uparrow: "⇑",
      UpArrowDownArrow: "⇅",
      updownarrow: "↕",
      UpDownArrow: "↕",
      Updownarrow: "⇕",
      UpEquilibrium: "⥮",
      upharpoonleft: "↿",
      upharpoonright: "↾",
      uplus: "⊎",
      UpperLeftArrow: "↖",
      UpperRightArrow: "↗",
      upsi: "υ",
      Upsi: "ϒ",
      upsih: "ϒ",
      Upsilon: "Υ",
      upsilon: "υ",
      UpTeeArrow: "↥",
      UpTee: "⊥",
      upuparrows: "⇈",
      urcorn: "⌝",
      urcorner: "⌝",
      urcrop: "⌎",
      Uring: "Ů",
      uring: "ů",
      urtri: "◹",
      Uscr: "𝒰",
      uscr: "𝓊",
      utdot: "⋰",
      Utilde: "Ũ",
      utilde: "ũ",
      utri: "▵",
      utrif: "▴",
      uuarr: "⇈",
      Uuml: "Ü",
      uuml: "ü",
      uwangle: "⦧",
      vangrt: "⦜",
      varepsilon: "ϵ",
      varkappa: "ϰ",
      varnothing: "∅",
      varphi: "ϕ",
      varpi: "ϖ",
      varpropto: "∝",
      varr: "↕",
      vArr: "⇕",
      varrho: "ϱ",
      varsigma: "ς",
      varsubsetneq: "⊊︀",
      varsubsetneqq: "⫋︀",
      varsupsetneq: "⊋︀",
      varsupsetneqq: "⫌︀",
      vartheta: "ϑ",
      vartriangleleft: "⊲",
      vartriangleright: "⊳",
      vBar: "⫨",
      Vbar: "⫫",
      vBarv: "⫩",
      Vcy: "В",
      vcy: "в",
      vdash: "⊢",
      vDash: "⊨",
      Vdash: "⊩",
      VDash: "⊫",
      Vdashl: "⫦",
      veebar: "⊻",
      vee: "∨",
      Vee: "⋁",
      veeeq: "≚",
      vellip: "⋮",
      verbar: "|",
      Verbar: "‖",
      vert: "|",
      Vert: "‖",
      VerticalBar: "∣",
      VerticalLine: "|",
      VerticalSeparator: "❘",
      VerticalTilde: "≀",
      VeryThinSpace: " ",
      Vfr: "𝔙",
      vfr: "𝔳",
      vltri: "⊲",
      vnsub: "⊂⃒",
      vnsup: "⊃⃒",
      Vopf: "𝕍",
      vopf: "𝕧",
      vprop: "∝",
      vrtri: "⊳",
      Vscr: "𝒱",
      vscr: "𝓋",
      vsubnE: "⫋︀",
      vsubne: "⊊︀",
      vsupnE: "⫌︀",
      vsupne: "⊋︀",
      Vvdash: "⊪",
      vzigzag: "⦚",
      Wcirc: "Ŵ",
      wcirc: "ŵ",
      wedbar: "⩟",
      wedge: "∧",
      Wedge: "⋀",
      wedgeq: "≙",
      weierp: "℘",
      Wfr: "𝔚",
      wfr: "𝔴",
      Wopf: "𝕎",
      wopf: "𝕨",
      wp: "℘",
      wr: "≀",
      wreath: "≀",
      Wscr: "𝒲",
      wscr: "𝓌",
      xcap: "⋂",
      xcirc: "◯",
      xcup: "⋃",
      xdtri: "▽",
      Xfr: "𝔛",
      xfr: "𝔵",
      xharr: "⟷",
      xhArr: "⟺",
      Xi: "Ξ",
      xi: "ξ",
      xlarr: "⟵",
      xlArr: "⟸",
      xmap: "⟼",
      xnis: "⋻",
      xodot: "⨀",
      Xopf: "𝕏",
      xopf: "𝕩",
      xoplus: "⨁",
      xotime: "⨂",
      xrarr: "⟶",
      xrArr: "⟹",
      Xscr: "𝒳",
      xscr: "𝓍",
      xsqcup: "⨆",
      xuplus: "⨄",
      xutri: "△",
      xvee: "⋁",
      xwedge: "⋀",
      Yacute: "Ý",
      yacute: "ý",
      YAcy: "Я",
      yacy: "я",
      Ycirc: "Ŷ",
      ycirc: "ŷ",
      Ycy: "Ы",
      ycy: "ы",
      yen: "¥",
      Yfr: "𝔜",
      yfr: "𝔶",
      YIcy: "Ї",
      yicy: "ї",
      Yopf: "𝕐",
      yopf: "𝕪",
      Yscr: "𝒴",
      yscr: "𝓎",
      YUcy: "Ю",
      yucy: "ю",
      yuml: "ÿ",
      Yuml: "Ÿ",
      Zacute: "Ź",
      zacute: "ź",
      Zcaron: "Ž",
      zcaron: "ž",
      Zcy: "З",
      zcy: "з",
      Zdot: "Ż",
      zdot: "ż",
      zeetrf: "ℨ",
      ZeroWidthSpace: "​",
      Zeta: "Ζ",
      zeta: "ζ",
      zfr: "𝔷",
      Zfr: "ℨ",
      ZHcy: "Ж",
      zhcy: "ж",
      zigrarr: "⇝",
      zopf: "𝕫",
      Zopf: "ℤ",
      Zscr: "𝒵",
      zscr: "𝓏",
      zwj: "‍",
      zwnj: "‌",
    },
    Kr =
      /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/,
    wt = {},
    ll = {};
  function Vf(n) {
    var e,
      t,
      r = ll[n];
    if (r) return r;
    for (r = ll[n] = [], e = 0; e < 128; e++)
      (t = String.fromCharCode(e)),
        /^[0-9a-z]$/i.test(t)
          ? r.push(t)
          : r.push("%" + ("0" + e.toString(16).toUpperCase()).slice(-2));
    for (e = 0; e < n.length; e++) r[n.charCodeAt(e)] = n[e];
    return r;
  }
  function Mn(n, e, t) {
    var r,
      o,
      s,
      i,
      l,
      c = "";
    for (
      typeof e != "string" && ((t = e), (e = Mn.defaultChars)),
        typeof t > "u" && (t = !0),
        l = Vf(e),
        r = 0,
        o = n.length;
      r < o;
      r++
    ) {
      if (
        ((s = n.charCodeAt(r)),
        t &&
          s === 37 &&
          r + 2 < o &&
          /^[0-9a-f]{2}$/i.test(n.slice(r + 1, r + 3)))
      ) {
        (c += n.slice(r, r + 3)), (r += 2);
        continue;
      }
      if (s < 128) {
        c += l[s];
        continue;
      }
      if (s >= 55296 && s <= 57343) {
        if (
          s >= 55296 &&
          s <= 56319 &&
          r + 1 < o &&
          ((i = n.charCodeAt(r + 1)), i >= 56320 && i <= 57343)
        ) {
          (c += encodeURIComponent(n[r] + n[r + 1])), r++;
          continue;
        }
        c += "%EF%BF%BD";
        continue;
      }
      c += encodeURIComponent(n[r]);
    }
    return c;
  }
  (Mn.defaultChars = ";/?:@&=+$,-_.!~*'()#"), (Mn.componentChars = "-_.!~*'()");
  var $f = Mn,
    cl = {};
  function Uf(n) {
    var e,
      t,
      r = cl[n];
    if (r) return r;
    for (r = cl[n] = [], e = 0; e < 128; e++)
      (t = String.fromCharCode(e)), r.push(t);
    for (e = 0; e < n.length; e++)
      (t = n.charCodeAt(e)),
        (r[t] = "%" + ("0" + t.toString(16).toUpperCase()).slice(-2));
    return r;
  }
  function Tn(n, e) {
    var t;
    return (
      typeof e != "string" && (e = Tn.defaultChars),
      (t = Uf(e)),
      n.replace(/(%[a-f0-9]{2})+/gi, function (r) {
        var o,
          s,
          i,
          l,
          c,
          a,
          u,
          f = "";
        for (o = 0, s = r.length; o < s; o += 3) {
          if (((i = parseInt(r.slice(o + 1, o + 3), 16)), i < 128)) {
            f += t[i];
            continue;
          }
          if (
            (i & 224) === 192 &&
            o + 3 < s &&
            ((l = parseInt(r.slice(o + 4, o + 6), 16)), (l & 192) === 128)
          ) {
            (u = ((i << 6) & 1984) | (l & 63)),
              u < 128 ? (f += "��") : (f += String.fromCharCode(u)),
              (o += 3);
            continue;
          }
          if (
            (i & 240) === 224 &&
            o + 6 < s &&
            ((l = parseInt(r.slice(o + 4, o + 6), 16)),
            (c = parseInt(r.slice(o + 7, o + 9), 16)),
            (l & 192) === 128 && (c & 192) === 128)
          ) {
            (u = ((i << 12) & 61440) | ((l << 6) & 4032) | (c & 63)),
              u < 2048 || (u >= 55296 && u <= 57343)
                ? (f += "���")
                : (f += String.fromCharCode(u)),
              (o += 6);
            continue;
          }
          if (
            (i & 248) === 240 &&
            o + 9 < s &&
            ((l = parseInt(r.slice(o + 4, o + 6), 16)),
            (c = parseInt(r.slice(o + 7, o + 9), 16)),
            (a = parseInt(r.slice(o + 10, o + 12), 16)),
            (l & 192) === 128 && (c & 192) === 128 && (a & 192) === 128)
          ) {
            (u =
              ((i << 18) & 1835008) |
              ((l << 12) & 258048) |
              ((c << 6) & 4032) |
              (a & 63)),
              u < 65536 || u > 1114111
                ? (f += "����")
                : ((u -= 65536),
                  (f += String.fromCharCode(
                    55296 + (u >> 10),
                    56320 + (u & 1023),
                  ))),
              (o += 9);
            continue;
          }
          f += "�";
        }
        return f;
      })
    );
  }
  (Tn.defaultChars = ";/?:@&=+$,#"), (Tn.componentChars = "");
  var Hf = Tn,
    Gf = function (e) {
      var t = "";
      return (
        (t += e.protocol || ""),
        (t += e.slashes ? "//" : ""),
        (t += e.auth ? e.auth + "@" : ""),
        e.hostname && e.hostname.indexOf(":") !== -1
          ? (t += "[" + e.hostname + "]")
          : (t += e.hostname || ""),
        (t += e.port ? ":" + e.port : ""),
        (t += e.pathname || ""),
        (t += e.search || ""),
        (t += e.hash || ""),
        t
      );
    };
  function qn() {
    (this.protocol = null),
      (this.slashes = null),
      (this.auth = null),
      (this.port = null),
      (this.hostname = null),
      (this.hash = null),
      (this.search = null),
      (this.pathname = null);
  }
  var jf = /^([a-z0-9.+-]+:)/i,
    Jf = /:[0-9]*$/,
    Wf = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
    Kf = [
      "<",
      ">",
      '"',
      "`",
      " ",
      "\r",
      `
`,
      "	",
    ],
    Zf = ["{", "}", "|", "\\", "^", "`"].concat(Kf),
    Yf = ["'"].concat(Zf),
    al = ["%", "/", "?", ";", "#"].concat(Yf),
    ul = ["/", "?", "#"],
    Qf = 255,
    fl = /^[+a-z0-9A-Z_-]{0,63}$/,
    Xf = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    hl = { javascript: !0, "javascript:": !0 },
    pl = {
      http: !0,
      https: !0,
      ftp: !0,
      gopher: !0,
      file: !0,
      "http:": !0,
      "https:": !0,
      "ftp:": !0,
      "gopher:": !0,
      "file:": !0,
    };
  function eh(n, e) {
    if (n && n instanceof qn) return n;
    var t = new qn();
    return t.parse(n, e), t;
  }
  (qn.prototype.parse = function (n, e) {
    var t,
      r,
      o,
      s,
      i,
      l = n;
    if (((l = l.trim()), !e && n.split("#").length === 1)) {
      var c = Wf.exec(l);
      if (c) return (this.pathname = c[1]), c[2] && (this.search = c[2]), this;
    }
    var a = jf.exec(l);
    if (
      (a &&
        ((a = a[0]),
        (o = a.toLowerCase()),
        (this.protocol = a),
        (l = l.substr(a.length))),
      (e || a || l.match(/^\/\/[^@\/]+@[^@\/]+/)) &&
        ((i = l.substr(0, 2) === "//"),
        i && !(a && hl[a]) && ((l = l.substr(2)), (this.slashes = !0))),
      !hl[a] && (i || (a && !pl[a])))
    ) {
      var u = -1;
      for (t = 0; t < ul.length; t++)
        (s = l.indexOf(ul[t])), s !== -1 && (u === -1 || s < u) && (u = s);
      var f, h;
      for (
        u === -1 ? (h = l.lastIndexOf("@")) : (h = l.lastIndexOf("@", u)),
          h !== -1 &&
            ((f = l.slice(0, h)), (l = l.slice(h + 1)), (this.auth = f)),
          u = -1,
          t = 0;
        t < al.length;
        t++
      )
        (s = l.indexOf(al[t])), s !== -1 && (u === -1 || s < u) && (u = s);
      u === -1 && (u = l.length), l[u - 1] === ":" && u--;
      var p = l.slice(0, u);
      (l = l.slice(u)),
        this.parseHost(p),
        (this.hostname = this.hostname || "");
      var d =
        this.hostname[0] === "[" &&
        this.hostname[this.hostname.length - 1] === "]";
      if (!d) {
        var m = this.hostname.split(/\./);
        for (t = 0, r = m.length; t < r; t++) {
          var g = m[t];
          if (g && !g.match(fl)) {
            for (var b = "", k = 0, S = g.length; k < S; k++)
              g.charCodeAt(k) > 127 ? (b += "x") : (b += g[k]);
            if (!b.match(fl)) {
              var A = m.slice(0, t),
                _ = m.slice(t + 1),
                x = g.match(Xf);
              x && (A.push(x[1]), _.unshift(x[2])),
                _.length && (l = _.join(".") + l),
                (this.hostname = A.join("."));
              break;
            }
          }
        }
      }
      this.hostname.length > Qf && (this.hostname = ""),
        d &&
          (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
    }
    var N = l.indexOf("#");
    N !== -1 && ((this.hash = l.substr(N)), (l = l.slice(0, N)));
    var L = l.indexOf("?");
    return (
      L !== -1 && ((this.search = l.substr(L)), (l = l.slice(0, L))),
      l && (this.pathname = l),
      pl[o] && this.hostname && !this.pathname && (this.pathname = ""),
      this
    );
  }),
    (qn.prototype.parseHost = function (n) {
      var e = Jf.exec(n);
      e &&
        ((e = e[0]),
        e !== ":" && (this.port = e.substr(1)),
        (n = n.substr(0, n.length - e.length))),
        n && (this.hostname = n);
    });
  var th = eh;
  (wt.encode = $f), (wt.decode = Hf), (wt.format = Gf), (wt.parse = th);
  var rt = {},
    Zr,
    dl;
  function ml() {
    return (
      dl ||
        ((dl = 1),
        (Zr =
          /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/)),
      Zr
    );
  }
  var Yr, gl;
  function bl() {
    return gl || ((gl = 1), (Yr = /[\0-\x1F\x7F-\x9F]/)), Yr;
  }
  var Qr, yl;
  function nh() {
    return (
      yl ||
        ((yl = 1),
        (Qr =
          /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/)),
      Qr
    );
  }
  var Xr, kl;
  function xl() {
    return (
      kl ||
        ((kl = 1),
        (Xr = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/)),
      Xr
    );
  }
  var wl;
  function rh() {
    return (
      wl ||
        ((wl = 1),
        (rt.Any = ml()),
        (rt.Cc = bl()),
        (rt.Cf = nh()),
        (rt.P = Kr),
        (rt.Z = xl())),
      rt
    );
  }
  (function (n) {
    function e(w) {
      return Object.prototype.toString.call(w);
    }
    function t(w) {
      return e(w) === "[object String]";
    }
    var r = Object.prototype.hasOwnProperty;
    function o(w, O) {
      return r.call(w, O);
    }
    function s(w) {
      var O = Array.prototype.slice.call(arguments, 1);
      return (
        O.forEach(function (C) {
          if (C) {
            if (typeof C != "object") throw new TypeError(C + "must be object");
            Object.keys(C).forEach(function (He) {
              w[He] = C[He];
            });
          }
        }),
        w
      );
    }
    function i(w, O, C) {
      return [].concat(w.slice(0, O), C, w.slice(O + 1));
    }
    function l(w) {
      return !(
        (w >= 55296 && w <= 57343) ||
        (w >= 64976 && w <= 65007) ||
        (w & 65535) === 65535 ||
        (w & 65535) === 65534 ||
        (w >= 0 && w <= 8) ||
        w === 11 ||
        (w >= 14 && w <= 31) ||
        (w >= 127 && w <= 159) ||
        w > 1114111
      );
    }
    function c(w) {
      if (w > 65535) {
        w -= 65536;
        var O = 55296 + (w >> 10),
          C = 56320 + (w & 1023);
        return String.fromCharCode(O, C);
      }
      return String.fromCharCode(w);
    }
    var a = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g,
      u = /&([a-z#][a-z0-9]{1,31});/gi,
      f = new RegExp(a.source + "|" + u.source, "gi"),
      h = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i,
      p = il;
    function d(w, O) {
      var C;
      return o(p, O)
        ? p[O]
        : O.charCodeAt(0) === 35 &&
            h.test(O) &&
            ((C =
              O[1].toLowerCase() === "x"
                ? parseInt(O.slice(2), 16)
                : parseInt(O.slice(1), 10)),
            l(C))
          ? c(C)
          : w;
    }
    function m(w) {
      return w.indexOf("\\") < 0 ? w : w.replace(a, "$1");
    }
    function g(w) {
      return w.indexOf("\\") < 0 && w.indexOf("&") < 0
        ? w
        : w.replace(f, function (O, C, He) {
            return C || d(O, He);
          });
    }
    var b = /[&<>"]/,
      k = /[&<>"]/g,
      S = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
    function A(w) {
      return S[w];
    }
    function _(w) {
      return b.test(w) ? w.replace(k, A) : w;
    }
    var x = /[.?*+^$[\]\\(){}|-]/g;
    function N(w) {
      return w.replace(x, "\\$&");
    }
    function L(w) {
      switch (w) {
        case 9:
        case 32:
          return !0;
      }
      return !1;
    }
    function E(w) {
      if (w >= 8192 && w <= 8202) return !0;
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
    var M = Kr;
    function Q(w) {
      return M.test(w);
    }
    function Ue(w) {
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
    function en(w) {
      return (
        (w = w.trim().replace(/\s+/g, " ")),
        "ẞ".toLowerCase() === "Ṿ" && (w = w.replace(/ẞ/g, "ß")),
        w.toLowerCase().toUpperCase()
      );
    }
    (n.lib = {}),
      (n.lib.mdurl = wt),
      (n.lib.ucmicro = rh()),
      (n.assign = s),
      (n.isString = t),
      (n.has = o),
      (n.unescapeMd = m),
      (n.unescapeAll = g),
      (n.isValidEntityCode = l),
      (n.fromCodePoint = c),
      (n.escapeHtml = _),
      (n.arrayReplaceAt = i),
      (n.isSpace = L),
      (n.isWhiteSpace = E),
      (n.isMdAsciiPunct = Ue),
      (n.isPunctChar = Q),
      (n.escapeRE = N),
      (n.normalizeReference = en);
  })(R);
  var Nn = {},
    oh = function (e, t, r) {
      var o,
        s,
        i,
        l,
        c = -1,
        a = e.posMax,
        u = e.pos;
      for (e.pos = t + 1, o = 1; e.pos < a; ) {
        if (((i = e.src.charCodeAt(e.pos)), i === 93 && (o--, o === 0))) {
          s = !0;
          break;
        }
        if (((l = e.pos), e.md.inline.skipToken(e), i === 91)) {
          if (l === e.pos - 1) o++;
          else if (r) return (e.pos = u), -1;
        }
      }
      return s && (c = e.pos), (e.pos = u), c;
    },
    vl = R.unescapeAll,
    sh = function (e, t, r) {
      var o,
        s,
        i = t,
        l = { ok: !1, pos: 0, lines: 0, str: "" };
      if (e.charCodeAt(i) === 60) {
        for (i++; i < r; ) {
          if (((o = e.charCodeAt(i)), o === 10 || o === 60)) return l;
          if (o === 62)
            return (
              (l.pos = i + 1), (l.str = vl(e.slice(t + 1, i))), (l.ok = !0), l
            );
          if (o === 92 && i + 1 < r) {
            i += 2;
            continue;
          }
          i++;
        }
        return l;
      }
      for (
        s = 0;
        i < r && ((o = e.charCodeAt(i)), !(o === 32 || o < 32 || o === 127));

      ) {
        if (o === 92 && i + 1 < r) {
          if (e.charCodeAt(i + 1) === 32) break;
          i += 2;
          continue;
        }
        if (o === 40 && (s++, s > 32)) return l;
        if (o === 41) {
          if (s === 0) break;
          s--;
        }
        i++;
      }
      return (
        t === i ||
          s !== 0 ||
          ((l.str = vl(e.slice(t, i))), (l.pos = i), (l.ok = !0)),
        l
      );
    },
    ih = R.unescapeAll,
    lh = function (e, t, r) {
      var o,
        s,
        i = 0,
        l = t,
        c = { ok: !1, pos: 0, lines: 0, str: "" };
      if (l >= r || ((s = e.charCodeAt(l)), s !== 34 && s !== 39 && s !== 40))
        return c;
      for (l++, s === 40 && (s = 41); l < r; ) {
        if (((o = e.charCodeAt(l)), o === s))
          return (
            (c.pos = l + 1),
            (c.lines = i),
            (c.str = ih(e.slice(t + 1, l))),
            (c.ok = !0),
            c
          );
        if (o === 40 && s === 41) return c;
        o === 10
          ? i++
          : o === 92 && l + 1 < r && (l++, e.charCodeAt(l) === 10 && i++),
          l++;
      }
      return c;
    };
  (Nn.parseLinkLabel = oh),
    (Nn.parseLinkDestination = sh),
    (Nn.parseLinkTitle = lh);
  var ch = R.assign,
    ah = R.unescapeAll,
    ot = R.escapeHtml,
    xe = {};
  (xe.code_inline = function (n, e, t, r, o) {
    var s = n[e];
    return "<code" + o.renderAttrs(s) + ">" + ot(s.content) + "</code>";
  }),
    (xe.code_block = function (n, e, t, r, o) {
      var s = n[e];
      return (
        "<pre" +
        o.renderAttrs(s) +
        "><code>" +
        ot(n[e].content) +
        `</code></pre>
`
      );
    }),
    (xe.fence = function (n, e, t, r, o) {
      var s = n[e],
        i = s.info ? ah(s.info).trim() : "",
        l = "",
        c = "",
        a,
        u,
        f,
        h,
        p;
      return (
        i && ((f = i.split(/(\s+)/g)), (l = f[0]), (c = f.slice(2).join(""))),
        t.highlight
          ? (a = t.highlight(s.content, l, c) || ot(s.content))
          : (a = ot(s.content)),
        a.indexOf("<pre") === 0
          ? a +
            `
`
          : i
            ? ((u = s.attrIndex("class")),
              (h = s.attrs ? s.attrs.slice() : []),
              u < 0
                ? h.push(["class", t.langPrefix + l])
                : ((h[u] = h[u].slice()), (h[u][1] += " " + t.langPrefix + l)),
              (p = { attrs: h }),
              "<pre><code" +
                o.renderAttrs(p) +
                ">" +
                a +
                `</code></pre>
`)
            : "<pre><code" +
              o.renderAttrs(s) +
              ">" +
              a +
              `</code></pre>
`
      );
    }),
    (xe.image = function (n, e, t, r, o) {
      var s = n[e];
      return (
        (s.attrs[s.attrIndex("alt")][1] = o.renderInlineAsText(
          s.children,
          t,
          r,
        )),
        o.renderToken(n, e, t)
      );
    }),
    (xe.hardbreak = function (n, e, t) {
      return t.xhtmlOut
        ? `<br />
`
        : `<br>
`;
    }),
    (xe.softbreak = function (n, e, t) {
      return t.breaks
        ? t.xhtmlOut
          ? `<br />
`
          : `<br>
`
        : `
`;
    }),
    (xe.text = function (n, e) {
      return ot(n[e].content);
    }),
    (xe.html_block = function (n, e) {
      return n[e].content;
    }),
    (xe.html_inline = function (n, e) {
      return n[e].content;
    });
  function vt() {
    this.rules = ch({}, xe);
  }
  (vt.prototype.renderAttrs = function (e) {
    var t, r, o;
    if (!e.attrs) return "";
    for (o = "", t = 0, r = e.attrs.length; t < r; t++)
      o += " " + ot(e.attrs[t][0]) + '="' + ot(e.attrs[t][1]) + '"';
    return o;
  }),
    (vt.prototype.renderToken = function (e, t, r) {
      var o,
        s = "",
        i = !1,
        l = e[t];
      return l.hidden
        ? ""
        : (l.block &&
            l.nesting !== -1 &&
            t &&
            e[t - 1].hidden &&
            (s += `
`),
          (s += (l.nesting === -1 ? "</" : "<") + l.tag),
          (s += this.renderAttrs(l)),
          l.nesting === 0 && r.xhtmlOut && (s += " /"),
          l.block &&
            ((i = !0),
            l.nesting === 1 &&
              t + 1 < e.length &&
              ((o = e[t + 1]),
              (o.type === "inline" ||
                o.hidden ||
                (o.nesting === -1 && o.tag === l.tag)) &&
                (i = !1))),
          (s += i
            ? `>
`
            : ">"),
          s);
    }),
    (vt.prototype.renderInline = function (n, e, t) {
      for (var r, o = "", s = this.rules, i = 0, l = n.length; i < l; i++)
        (r = n[i].type),
          typeof s[r] < "u"
            ? (o += s[r](n, i, e, t, this))
            : (o += this.renderToken(n, i, e));
      return o;
    }),
    (vt.prototype.renderInlineAsText = function (n, e, t) {
      for (var r = "", o = 0, s = n.length; o < s; o++)
        n[o].type === "text"
          ? (r += n[o].content)
          : n[o].type === "image"
            ? (r += this.renderInlineAsText(n[o].children, e, t))
            : n[o].type === "softbreak" &&
              (r += `
`);
      return r;
    }),
    (vt.prototype.render = function (n, e, t) {
      var r,
        o,
        s,
        i = "",
        l = this.rules;
      for (r = 0, o = n.length; r < o; r++)
        (s = n[r].type),
          s === "inline"
            ? (i += this.renderInline(n[r].children, e, t))
            : typeof l[s] < "u"
              ? (i += l[s](n, r, e, t, this))
              : (i += this.renderToken(n, r, e, t));
      return i;
    });
  var uh = vt;
  function de() {
    (this.__rules__ = []), (this.__cache__ = null);
  }
  (de.prototype.__find__ = function (n) {
    for (var e = 0; e < this.__rules__.length; e++)
      if (this.__rules__[e].name === n) return e;
    return -1;
  }),
    (de.prototype.__compile__ = function () {
      var n = this,
        e = [""];
      n.__rules__.forEach(function (t) {
        t.enabled &&
          t.alt.forEach(function (r) {
            e.indexOf(r) < 0 && e.push(r);
          });
      }),
        (n.__cache__ = {}),
        e.forEach(function (t) {
          (n.__cache__[t] = []),
            n.__rules__.forEach(function (r) {
              r.enabled &&
                ((t && r.alt.indexOf(t) < 0) || n.__cache__[t].push(r.fn));
            });
        });
    }),
    (de.prototype.at = function (n, e, t) {
      var r = this.__find__(n),
        o = t || {};
      if (r === -1) throw new Error("Parser rule not found: " + n);
      (this.__rules__[r].fn = e),
        (this.__rules__[r].alt = o.alt || []),
        (this.__cache__ = null);
    }),
    (de.prototype.before = function (n, e, t, r) {
      var o = this.__find__(n),
        s = r || {};
      if (o === -1) throw new Error("Parser rule not found: " + n);
      this.__rules__.splice(o, 0, {
        name: e,
        enabled: !0,
        fn: t,
        alt: s.alt || [],
      }),
        (this.__cache__ = null);
    }),
    (de.prototype.after = function (n, e, t, r) {
      var o = this.__find__(n),
        s = r || {};
      if (o === -1) throw new Error("Parser rule not found: " + n);
      this.__rules__.splice(o + 1, 0, {
        name: e,
        enabled: !0,
        fn: t,
        alt: s.alt || [],
      }),
        (this.__cache__ = null);
    }),
    (de.prototype.push = function (n, e, t) {
      var r = t || {};
      this.__rules__.push({ name: n, enabled: !0, fn: e, alt: r.alt || [] }),
        (this.__cache__ = null);
    }),
    (de.prototype.enable = function (n, e) {
      Array.isArray(n) || (n = [n]);
      var t = [];
      return (
        n.forEach(function (r) {
          var o = this.__find__(r);
          if (o < 0) {
            if (e) return;
            throw new Error("Rules manager: invalid rule name " + r);
          }
          (this.__rules__[o].enabled = !0), t.push(r);
        }, this),
        (this.__cache__ = null),
        t
      );
    }),
    (de.prototype.enableOnly = function (n, e) {
      Array.isArray(n) || (n = [n]),
        this.__rules__.forEach(function (t) {
          t.enabled = !1;
        }),
        this.enable(n, e);
    }),
    (de.prototype.disable = function (n, e) {
      Array.isArray(n) || (n = [n]);
      var t = [];
      return (
        n.forEach(function (r) {
          var o = this.__find__(r);
          if (o < 0) {
            if (e) return;
            throw new Error("Rules manager: invalid rule name " + r);
          }
          (this.__rules__[o].enabled = !1), t.push(r);
        }, this),
        (this.__cache__ = null),
        t
      );
    }),
    (de.prototype.getRules = function (n) {
      return (
        this.__cache__ === null && this.__compile__(), this.__cache__[n] || []
      );
    });
  var eo = de,
    fh = /\r\n?|\n/g,
    hh = /\0/g,
    ph = function (e) {
      var t;
      (t = e.src.replace(
        fh,
        `
`,
      )),
        (t = t.replace(hh, "�")),
        (e.src = t);
    },
    dh = function (e) {
      var t;
      e.inlineMode
        ? ((t = new e.Token("inline", "", 0)),
          (t.content = e.src),
          (t.map = [0, 1]),
          (t.children = []),
          e.tokens.push(t))
        : e.md.block.parse(e.src, e.md, e.env, e.tokens);
    },
    mh = function (e) {
      var t = e.tokens,
        r,
        o,
        s;
      for (o = 0, s = t.length; o < s; o++)
        (r = t[o]),
          r.type === "inline" &&
            e.md.inline.parse(r.content, e.md, e.env, r.children);
    },
    gh = R.arrayReplaceAt;
  function bh(n) {
    return /^<a[>\s]/i.test(n);
  }
  function yh(n) {
    return /^<\/a\s*>/i.test(n);
  }
  var kh = function (e) {
      var t,
        r,
        o,
        s,
        i,
        l,
        c,
        a,
        u,
        f,
        h,
        p,
        d,
        m,
        g,
        b,
        k = e.tokens,
        S;
      if (e.md.options.linkify) {
        for (r = 0, o = k.length; r < o; r++)
          if (!(k[r].type !== "inline" || !e.md.linkify.pretest(k[r].content)))
            for (s = k[r].children, d = 0, t = s.length - 1; t >= 0; t--) {
              if (((l = s[t]), l.type === "link_close")) {
                for (t--; s[t].level !== l.level && s[t].type !== "link_open"; )
                  t--;
                continue;
              }
              if (
                (l.type === "html_inline" &&
                  (bh(l.content) && d > 0 && d--, yh(l.content) && d++),
                !(d > 0) && l.type === "text" && e.md.linkify.test(l.content))
              ) {
                for (
                  u = l.content,
                    S = e.md.linkify.match(u),
                    c = [],
                    p = l.level,
                    h = 0,
                    S.length > 0 &&
                      S[0].index === 0 &&
                      t > 0 &&
                      s[t - 1].type === "text_special" &&
                      (S = S.slice(1)),
                    a = 0;
                  a < S.length;
                  a++
                )
                  (m = S[a].url),
                    (g = e.md.normalizeLink(m)),
                    e.md.validateLink(g) &&
                      ((b = S[a].text),
                      S[a].schema
                        ? S[a].schema === "mailto:" && !/^mailto:/i.test(b)
                          ? (b = e.md
                              .normalizeLinkText("mailto:" + b)
                              .replace(/^mailto:/, ""))
                          : (b = e.md.normalizeLinkText(b))
                        : (b = e.md
                            .normalizeLinkText("http://" + b)
                            .replace(/^http:\/\//, "")),
                      (f = S[a].index),
                      f > h &&
                        ((i = new e.Token("text", "", 0)),
                        (i.content = u.slice(h, f)),
                        (i.level = p),
                        c.push(i)),
                      (i = new e.Token("link_open", "a", 1)),
                      (i.attrs = [["href", g]]),
                      (i.level = p++),
                      (i.markup = "linkify"),
                      (i.info = "auto"),
                      c.push(i),
                      (i = new e.Token("text", "", 0)),
                      (i.content = b),
                      (i.level = p),
                      c.push(i),
                      (i = new e.Token("link_close", "a", -1)),
                      (i.level = --p),
                      (i.markup = "linkify"),
                      (i.info = "auto"),
                      c.push(i),
                      (h = S[a].lastIndex));
                h < u.length &&
                  ((i = new e.Token("text", "", 0)),
                  (i.content = u.slice(h)),
                  (i.level = p),
                  c.push(i)),
                  (k[r].children = s = gh(s, t, c));
              }
            }
      }
    },
    Cl = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/,
    xh = /\((c|tm|r)\)/i,
    wh = /\((c|tm|r)\)/gi,
    vh = { c: "©", r: "®", tm: "™" };
  function Ch(n, e) {
    return vh[e.toLowerCase()];
  }
  function Sh(n) {
    var e,
      t,
      r = 0;
    for (e = n.length - 1; e >= 0; e--)
      (t = n[e]),
        t.type === "text" && !r && (t.content = t.content.replace(wh, Ch)),
        t.type === "link_open" && t.info === "auto" && r--,
        t.type === "link_close" && t.info === "auto" && r++;
  }
  function Dh(n) {
    var e,
      t,
      r = 0;
    for (e = n.length - 1; e >= 0; e--)
      (t = n[e]),
        t.type === "text" &&
          !r &&
          Cl.test(t.content) &&
          (t.content = t.content
            .replace(/\+-/g, "±")
            .replace(/\.{2,}/g, "…")
            .replace(/([?!])…/g, "$1..")
            .replace(/([?!]){4,}/g, "$1$1$1")
            .replace(/,{2,}/g, ",")
            .replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—")
            .replace(/(^|\s)--(?=\s|$)/gm, "$1–")
            .replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")),
        t.type === "link_open" && t.info === "auto" && r--,
        t.type === "link_close" && t.info === "auto" && r++;
  }
  var Eh = function (e) {
      var t;
      if (e.md.options.typographer)
        for (t = e.tokens.length - 1; t >= 0; t--)
          e.tokens[t].type === "inline" &&
            (xh.test(e.tokens[t].content) && Sh(e.tokens[t].children),
            Cl.test(e.tokens[t].content) && Dh(e.tokens[t].children));
    },
    Sl = R.isWhiteSpace,
    Dl = R.isPunctChar,
    El = R.isMdAsciiPunct,
    Ah = /['"]/,
    Al = /['"]/g,
    _l = "’";
  function On(n, e, t) {
    return n.slice(0, e) + t + n.slice(e + 1);
  }
  function _h(n, e) {
    var t, r, o, s, i, l, c, a, u, f, h, p, d, m, g, b, k, S, A, _, x;
    for (A = [], t = 0; t < n.length; t++) {
      for (
        r = n[t], c = n[t].level, k = A.length - 1;
        k >= 0 && !(A[k].level <= c);
        k--
      );
      if (((A.length = k + 1), r.type === "text")) {
        (o = r.content), (i = 0), (l = o.length);
        e: for (; i < l && ((Al.lastIndex = i), (s = Al.exec(o)), !!s); ) {
          if (
            ((g = b = !0),
            (i = s.index + 1),
            (S = s[0] === "'"),
            (u = 32),
            s.index - 1 >= 0)
          )
            u = o.charCodeAt(s.index - 1);
          else
            for (
              k = t - 1;
              k >= 0 &&
              !(n[k].type === "softbreak" || n[k].type === "hardbreak");
              k--
            )
              if (n[k].content) {
                u = n[k].content.charCodeAt(n[k].content.length - 1);
                break;
              }
          if (((f = 32), i < l)) f = o.charCodeAt(i);
          else
            for (
              k = t + 1;
              k < n.length &&
              !(n[k].type === "softbreak" || n[k].type === "hardbreak");
              k++
            )
              if (n[k].content) {
                f = n[k].content.charCodeAt(0);
                break;
              }
          if (
            ((h = El(u) || Dl(String.fromCharCode(u))),
            (p = El(f) || Dl(String.fromCharCode(f))),
            (d = Sl(u)),
            (m = Sl(f)),
            m ? (g = !1) : p && (d || h || (g = !1)),
            d ? (b = !1) : h && (m || p || (b = !1)),
            f === 34 && s[0] === '"' && u >= 48 && u <= 57 && (b = g = !1),
            g && b && ((g = h), (b = p)),
            !g && !b)
          ) {
            S && (r.content = On(r.content, s.index, _l));
            continue;
          }
          if (b) {
            for (
              k = A.length - 1;
              k >= 0 && ((a = A[k]), !(A[k].level < c));
              k--
            )
              if (a.single === S && A[k].level === c) {
                (a = A[k]),
                  S
                    ? ((_ = e.md.options.quotes[2]),
                      (x = e.md.options.quotes[3]))
                    : ((_ = e.md.options.quotes[0]),
                      (x = e.md.options.quotes[1])),
                  (r.content = On(r.content, s.index, x)),
                  (n[a.token].content = On(n[a.token].content, a.pos, _)),
                  (i += x.length - 1),
                  a.token === t && (i += _.length - 1),
                  (o = r.content),
                  (l = o.length),
                  (A.length = k);
                continue e;
              }
          }
          g
            ? A.push({ token: t, pos: s.index, single: S, level: c })
            : b && S && (r.content = On(r.content, s.index, _l));
        }
      }
    }
  }
  var Mh = function (e) {
      var t;
      if (e.md.options.typographer)
        for (t = e.tokens.length - 1; t >= 0; t--)
          e.tokens[t].type !== "inline" ||
            !Ah.test(e.tokens[t].content) ||
            _h(e.tokens[t].children, e);
    },
    Th = function (e) {
      var t,
        r,
        o,
        s,
        i,
        l,
        c = e.tokens;
      for (t = 0, r = c.length; t < r; t++)
        if (c[t].type === "inline") {
          for (o = c[t].children, i = o.length, s = 0; s < i; s++)
            o[s].type === "text_special" && (o[s].type = "text");
          for (s = l = 0; s < i; s++)
            o[s].type === "text" && s + 1 < i && o[s + 1].type === "text"
              ? (o[s + 1].content = o[s].content + o[s + 1].content)
              : (s !== l && (o[l] = o[s]), l++);
          s !== l && (o.length = l);
        }
    };
  function Ct(n, e, t) {
    (this.type = n),
      (this.tag = e),
      (this.attrs = null),
      (this.map = null),
      (this.nesting = t),
      (this.level = 0),
      (this.children = null),
      (this.content = ""),
      (this.markup = ""),
      (this.info = ""),
      (this.meta = null),
      (this.block = !1),
      (this.hidden = !1);
  }
  (Ct.prototype.attrIndex = function (e) {
    var t, r, o;
    if (!this.attrs) return -1;
    for (t = this.attrs, r = 0, o = t.length; r < o; r++)
      if (t[r][0] === e) return r;
    return -1;
  }),
    (Ct.prototype.attrPush = function (e) {
      this.attrs ? this.attrs.push(e) : (this.attrs = [e]);
    }),
    (Ct.prototype.attrSet = function (e, t) {
      var r = this.attrIndex(e),
        o = [e, t];
      r < 0 ? this.attrPush(o) : (this.attrs[r] = o);
    }),
    (Ct.prototype.attrGet = function (e) {
      var t = this.attrIndex(e),
        r = null;
      return t >= 0 && (r = this.attrs[t][1]), r;
    }),
    (Ct.prototype.attrJoin = function (e, t) {
      var r = this.attrIndex(e);
      r < 0
        ? this.attrPush([e, t])
        : (this.attrs[r][1] = this.attrs[r][1] + " " + t);
    });
  var to = Ct,
    qh = to;
  function Ml(n, e, t) {
    (this.src = n),
      (this.env = t),
      (this.tokens = []),
      (this.inlineMode = !1),
      (this.md = e);
  }
  Ml.prototype.Token = qh;
  var Nh = Ml,
    Oh = eo,
    no = [
      ["normalize", ph],
      ["block", dh],
      ["inline", mh],
      ["linkify", kh],
      ["replacements", Eh],
      ["smartquotes", Mh],
      ["text_join", Th],
    ];
  function ro() {
    this.ruler = new Oh();
    for (var n = 0; n < no.length; n++) this.ruler.push(no[n][0], no[n][1]);
  }
  (ro.prototype.process = function (n) {
    var e, t, r;
    for (r = this.ruler.getRules(""), e = 0, t = r.length; e < t; e++) r[e](n);
  }),
    (ro.prototype.State = Nh);
  var Rh = ro,
    oo = R.isSpace;
  function so(n, e) {
    var t = n.bMarks[e] + n.tShift[e],
      r = n.eMarks[e];
    return n.src.slice(t, r);
  }
  function Tl(n) {
    var e = [],
      t = 0,
      r = n.length,
      o,
      s = !1,
      i = 0,
      l = "";
    for (o = n.charCodeAt(t); t < r; )
      o === 124 &&
        (s
          ? ((l += n.substring(i, t - 1)), (i = t))
          : (e.push(l + n.substring(i, t)), (l = ""), (i = t + 1))),
        (s = o === 92),
        t++,
        (o = n.charCodeAt(t));
    return e.push(l + n.substring(i)), e;
  }
  var Ih = function (e, t, r, o) {
      var s, i, l, c, a, u, f, h, p, d, m, g, b, k, S, A, _, x;
      if (
        t + 2 > r ||
        ((u = t + 1), e.sCount[u] < e.blkIndent) ||
        e.sCount[u] - e.blkIndent >= 4 ||
        ((l = e.bMarks[u] + e.tShift[u]), l >= e.eMarks[u]) ||
        ((_ = e.src.charCodeAt(l++)), _ !== 124 && _ !== 45 && _ !== 58) ||
        l >= e.eMarks[u] ||
        ((x = e.src.charCodeAt(l++)),
        x !== 124 && x !== 45 && x !== 58 && !oo(x)) ||
        (_ === 45 && oo(x))
      )
        return !1;
      for (; l < e.eMarks[u]; ) {
        if (
          ((s = e.src.charCodeAt(l)),
          s !== 124 && s !== 45 && s !== 58 && !oo(s))
        )
          return !1;
        l++;
      }
      for (
        i = so(e, t + 1), f = i.split("|"), d = [], c = 0;
        c < f.length;
        c++
      ) {
        if (((m = f[c].trim()), !m)) {
          if (c === 0 || c === f.length - 1) continue;
          return !1;
        }
        if (!/^:?-+:?$/.test(m)) return !1;
        m.charCodeAt(m.length - 1) === 58
          ? d.push(m.charCodeAt(0) === 58 ? "center" : "right")
          : m.charCodeAt(0) === 58
            ? d.push("left")
            : d.push("");
      }
      if (
        ((i = so(e, t).trim()),
        i.indexOf("|") === -1 ||
          e.sCount[t] - e.blkIndent >= 4 ||
          ((f = Tl(i)),
          f.length && f[0] === "" && f.shift(),
          f.length && f[f.length - 1] === "" && f.pop(),
          (h = f.length),
          h === 0 || h !== d.length))
      )
        return !1;
      if (o) return !0;
      for (
        k = e.parentType,
          e.parentType = "table",
          A = e.md.block.ruler.getRules("blockquote"),
          p = e.push("table_open", "table", 1),
          p.map = g = [t, 0],
          p = e.push("thead_open", "thead", 1),
          p.map = [t, t + 1],
          p = e.push("tr_open", "tr", 1),
          p.map = [t, t + 1],
          c = 0;
        c < f.length;
        c++
      )
        (p = e.push("th_open", "th", 1)),
          d[c] && (p.attrs = [["style", "text-align:" + d[c]]]),
          (p = e.push("inline", "", 0)),
          (p.content = f[c].trim()),
          (p.children = []),
          (p = e.push("th_close", "th", -1));
      for (
        p = e.push("tr_close", "tr", -1),
          p = e.push("thead_close", "thead", -1),
          u = t + 2;
        u < r && !(e.sCount[u] < e.blkIndent);
        u++
      ) {
        for (S = !1, c = 0, a = A.length; c < a; c++)
          if (A[c](e, u, r, !0)) {
            S = !0;
            break;
          }
        if (S || ((i = so(e, u).trim()), !i) || e.sCount[u] - e.blkIndent >= 4)
          break;
        for (
          f = Tl(i),
            f.length && f[0] === "" && f.shift(),
            f.length && f[f.length - 1] === "" && f.pop(),
            u === t + 2 &&
              ((p = e.push("tbody_open", "tbody", 1)),
              (p.map = b = [t + 2, 0])),
            p = e.push("tr_open", "tr", 1),
            p.map = [u, u + 1],
            c = 0;
          c < h;
          c++
        )
          (p = e.push("td_open", "td", 1)),
            d[c] && (p.attrs = [["style", "text-align:" + d[c]]]),
            (p = e.push("inline", "", 0)),
            (p.content = f[c] ? f[c].trim() : ""),
            (p.children = []),
            (p = e.push("td_close", "td", -1));
        p = e.push("tr_close", "tr", -1);
      }
      return (
        b && ((p = e.push("tbody_close", "tbody", -1)), (b[1] = u)),
        (p = e.push("table_close", "table", -1)),
        (g[1] = u),
        (e.parentType = k),
        (e.line = u),
        !0
      );
    },
    Lh = function (e, t, r) {
      var o, s, i;
      if (e.sCount[t] - e.blkIndent < 4) return !1;
      for (s = o = t + 1; o < r; ) {
        if (e.isEmpty(o)) {
          o++;
          continue;
        }
        if (e.sCount[o] - e.blkIndent >= 4) {
          o++, (s = o);
          continue;
        }
        break;
      }
      return (
        (e.line = s),
        (i = e.push("code_block", "code", 0)),
        (i.content =
          e.getLines(t, s, 4 + e.blkIndent, !1) +
          `
`),
        (i.map = [t, e.line]),
        !0
      );
    },
    zh = function (e, t, r, o) {
      var s,
        i,
        l,
        c,
        a,
        u,
        f,
        h = !1,
        p = e.bMarks[t] + e.tShift[t],
        d = e.eMarks[t];
      if (
        e.sCount[t] - e.blkIndent >= 4 ||
        p + 3 > d ||
        ((s = e.src.charCodeAt(p)), s !== 126 && s !== 96) ||
        ((a = p), (p = e.skipChars(p, s)), (i = p - a), i < 3) ||
        ((f = e.src.slice(a, p)),
        (l = e.src.slice(p, d)),
        s === 96 && l.indexOf(String.fromCharCode(s)) >= 0)
      )
        return !1;
      if (o) return !0;
      for (
        c = t;
        c++,
          !(
            c >= r ||
            ((p = a = e.bMarks[c] + e.tShift[c]),
            (d = e.eMarks[c]),
            p < d && e.sCount[c] < e.blkIndent)
          );

      )
        if (
          e.src.charCodeAt(p) === s &&
          !(e.sCount[c] - e.blkIndent >= 4) &&
          ((p = e.skipChars(p, s)),
          !(p - a < i) && ((p = e.skipSpaces(p)), !(p < d)))
        ) {
          h = !0;
          break;
        }
      return (
        (i = e.sCount[t]),
        (e.line = c + (h ? 1 : 0)),
        (u = e.push("fence", "code", 0)),
        (u.info = l),
        (u.content = e.getLines(t + 1, c, i, !0)),
        (u.markup = f),
        (u.map = [t, e.line]),
        !0
      );
    },
    Fh = R.isSpace,
    Bh = function (e, t, r, o) {
      var s,
        i,
        l,
        c,
        a,
        u,
        f,
        h,
        p,
        d,
        m,
        g,
        b,
        k,
        S,
        A,
        _,
        x,
        N,
        L,
        E = e.lineMax,
        M = e.bMarks[t] + e.tShift[t],
        Q = e.eMarks[t];
      if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(M) !== 62)
        return !1;
      if (o) return !0;
      for (
        d = [],
          m = [],
          k = [],
          S = [],
          x = e.md.block.ruler.getRules("blockquote"),
          b = e.parentType,
          e.parentType = "blockquote",
          h = t;
        h < r &&
        ((L = e.sCount[h] < e.blkIndent),
        (M = e.bMarks[h] + e.tShift[h]),
        (Q = e.eMarks[h]),
        !(M >= Q));
        h++
      ) {
        if (e.src.charCodeAt(M++) === 62 && !L) {
          for (
            c = e.sCount[h] + 1,
              e.src.charCodeAt(M) === 32
                ? (M++, c++, (s = !1), (A = !0))
                : e.src.charCodeAt(M) === 9
                  ? ((A = !0),
                    (e.bsCount[h] + c) % 4 === 3
                      ? (M++, c++, (s = !1))
                      : (s = !0))
                  : (A = !1),
              p = c,
              d.push(e.bMarks[h]),
              e.bMarks[h] = M;
            M < Q && ((i = e.src.charCodeAt(M)), Fh(i));

          ) {
            i === 9 ? (p += 4 - ((p + e.bsCount[h] + (s ? 1 : 0)) % 4)) : p++;
            M++;
          }
          (u = M >= Q),
            m.push(e.bsCount[h]),
            (e.bsCount[h] = e.sCount[h] + 1 + (A ? 1 : 0)),
            k.push(e.sCount[h]),
            (e.sCount[h] = p - c),
            S.push(e.tShift[h]),
            (e.tShift[h] = M - e.bMarks[h]);
          continue;
        }
        if (u) break;
        for (_ = !1, l = 0, a = x.length; l < a; l++)
          if (x[l](e, h, r, !0)) {
            _ = !0;
            break;
          }
        if (_) {
          (e.lineMax = h),
            e.blkIndent !== 0 &&
              (d.push(e.bMarks[h]),
              m.push(e.bsCount[h]),
              S.push(e.tShift[h]),
              k.push(e.sCount[h]),
              (e.sCount[h] -= e.blkIndent));
          break;
        }
        d.push(e.bMarks[h]),
          m.push(e.bsCount[h]),
          S.push(e.tShift[h]),
          k.push(e.sCount[h]),
          (e.sCount[h] = -1);
      }
      for (
        g = e.blkIndent,
          e.blkIndent = 0,
          N = e.push("blockquote_open", "blockquote", 1),
          N.markup = ">",
          N.map = f = [t, 0],
          e.md.block.tokenize(e, t, h),
          N = e.push("blockquote_close", "blockquote", -1),
          N.markup = ">",
          e.lineMax = E,
          e.parentType = b,
          f[1] = e.line,
          l = 0;
        l < S.length;
        l++
      )
        (e.bMarks[l + t] = d[l]),
          (e.tShift[l + t] = S[l]),
          (e.sCount[l + t] = k[l]),
          (e.bsCount[l + t] = m[l]);
      return (e.blkIndent = g), !0;
    },
    Ph = R.isSpace,
    Vh = function (e, t, r, o) {
      var s,
        i,
        l,
        c,
        a = e.bMarks[t] + e.tShift[t],
        u = e.eMarks[t];
      if (
        e.sCount[t] - e.blkIndent >= 4 ||
        ((s = e.src.charCodeAt(a++)), s !== 42 && s !== 45 && s !== 95)
      )
        return !1;
      for (i = 1; a < u; ) {
        if (((l = e.src.charCodeAt(a++)), l !== s && !Ph(l))) return !1;
        l === s && i++;
      }
      return i < 3
        ? !1
        : (o ||
            ((e.line = t + 1),
            (c = e.push("hr", "hr", 0)),
            (c.map = [t, e.line]),
            (c.markup = Array(i + 1).join(String.fromCharCode(s)))),
          !0);
    },
    ql = R.isSpace;
  function Nl(n, e) {
    var t, r, o, s;
    return (
      (r = n.bMarks[e] + n.tShift[e]),
      (o = n.eMarks[e]),
      (t = n.src.charCodeAt(r++)),
      (t !== 42 && t !== 45 && t !== 43) ||
      (r < o && ((s = n.src.charCodeAt(r)), !ql(s)))
        ? -1
        : r
    );
  }
  function Ol(n, e) {
    var t,
      r = n.bMarks[e] + n.tShift[e],
      o = r,
      s = n.eMarks[e];
    if (o + 1 >= s || ((t = n.src.charCodeAt(o++)), t < 48 || t > 57))
      return -1;
    for (;;) {
      if (o >= s) return -1;
      if (((t = n.src.charCodeAt(o++)), t >= 48 && t <= 57)) {
        if (o - r >= 10) return -1;
        continue;
      }
      if (t === 41 || t === 46) break;
      return -1;
    }
    return o < s && ((t = n.src.charCodeAt(o)), !ql(t)) ? -1 : o;
  }
  function $h(n, e) {
    var t,
      r,
      o = n.level + 2;
    for (t = e + 2, r = n.tokens.length - 2; t < r; t++)
      n.tokens[t].level === o &&
        n.tokens[t].type === "paragraph_open" &&
        ((n.tokens[t + 2].hidden = !0), (n.tokens[t].hidden = !0), (t += 2));
  }
  var Uh = function (e, t, r, o) {
      var s,
        i,
        l,
        c,
        a,
        u,
        f,
        h,
        p,
        d,
        m,
        g,
        b,
        k,
        S,
        A,
        _,
        x,
        N,
        L,
        E,
        M,
        Q,
        Ue,
        en,
        w,
        O,
        C = t,
        He = !1,
        pc = !0;
      if (
        e.sCount[C] - e.blkIndent >= 4 ||
        (e.listIndent >= 0 &&
          e.sCount[C] - e.listIndent >= 4 &&
          e.sCount[C] < e.blkIndent)
      )
        return !1;
      if (
        (o &&
          e.parentType === "paragraph" &&
          e.sCount[C] >= e.blkIndent &&
          (He = !0),
        (M = Ol(e, C)) >= 0)
      ) {
        if (
          ((f = !0),
          (Ue = e.bMarks[C] + e.tShift[C]),
          (b = Number(e.src.slice(Ue, M - 1))),
          He && b !== 1)
        )
          return !1;
      } else if ((M = Nl(e, C)) >= 0) f = !1;
      else return !1;
      if (He && e.skipSpaces(M) >= e.eMarks[C]) return !1;
      if (o) return !0;
      for (
        g = e.src.charCodeAt(M - 1),
          m = e.tokens.length,
          f
            ? ((O = e.push("ordered_list_open", "ol", 1)),
              b !== 1 && (O.attrs = [["start", b]]))
            : (O = e.push("bullet_list_open", "ul", 1)),
          O.map = d = [C, 0],
          O.markup = String.fromCharCode(g),
          Q = !1,
          w = e.md.block.ruler.getRules("list"),
          _ = e.parentType,
          e.parentType = "list";
        C < r;

      ) {
        for (
          E = M,
            k = e.eMarks[C],
            u = S = e.sCount[C] + M - (e.bMarks[C] + e.tShift[C]);
          E < k;

        ) {
          if (((s = e.src.charCodeAt(E)), s === 9))
            S += 4 - ((S + e.bsCount[C]) % 4);
          else if (s === 32) S++;
          else break;
          E++;
        }
        if (
          ((i = E),
          i >= k ? (a = 1) : (a = S - u),
          a > 4 && (a = 1),
          (c = u + a),
          (O = e.push("list_item_open", "li", 1)),
          (O.markup = String.fromCharCode(g)),
          (O.map = h = [C, 0]),
          f && (O.info = e.src.slice(Ue, M - 1)),
          (L = e.tight),
          (N = e.tShift[C]),
          (x = e.sCount[C]),
          (A = e.listIndent),
          (e.listIndent = e.blkIndent),
          (e.blkIndent = c),
          (e.tight = !0),
          (e.tShift[C] = i - e.bMarks[C]),
          (e.sCount[C] = S),
          i >= k && e.isEmpty(C + 1)
            ? (e.line = Math.min(e.line + 2, r))
            : e.md.block.tokenize(e, C, r, !0),
          (!e.tight || Q) && (pc = !1),
          (Q = e.line - C > 1 && e.isEmpty(e.line - 1)),
          (e.blkIndent = e.listIndent),
          (e.listIndent = A),
          (e.tShift[C] = N),
          (e.sCount[C] = x),
          (e.tight = L),
          (O = e.push("list_item_close", "li", -1)),
          (O.markup = String.fromCharCode(g)),
          (C = e.line),
          (h[1] = C),
          C >= r || e.sCount[C] < e.blkIndent || e.sCount[C] - e.blkIndent >= 4)
        )
          break;
        for (en = !1, l = 0, p = w.length; l < p; l++)
          if (w[l](e, C, r, !0)) {
            en = !0;
            break;
          }
        if (en) break;
        if (f) {
          if (((M = Ol(e, C)), M < 0)) break;
          Ue = e.bMarks[C] + e.tShift[C];
        } else if (((M = Nl(e, C)), M < 0)) break;
        if (g !== e.src.charCodeAt(M - 1)) break;
      }
      return (
        f
          ? (O = e.push("ordered_list_close", "ol", -1))
          : (O = e.push("bullet_list_close", "ul", -1)),
        (O.markup = String.fromCharCode(g)),
        (d[1] = C),
        (e.line = C),
        (e.parentType = _),
        pc && $h(e, m),
        !0
      );
    },
    Hh = R.normalizeReference,
    Rn = R.isSpace,
    Gh = function (e, t, r, o) {
      var s,
        i,
        l,
        c,
        a,
        u,
        f,
        h,
        p,
        d,
        m,
        g,
        b,
        k,
        S,
        A,
        _ = 0,
        x = e.bMarks[t] + e.tShift[t],
        N = e.eMarks[t],
        L = t + 1;
      if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(x) !== 91)
        return !1;
      for (; ++x < N; )
        if (e.src.charCodeAt(x) === 93 && e.src.charCodeAt(x - 1) !== 92) {
          if (x + 1 === N || e.src.charCodeAt(x + 1) !== 58) return !1;
          break;
        }
      for (
        c = e.lineMax,
          S = e.md.block.ruler.getRules("reference"),
          d = e.parentType,
          e.parentType = "reference";
        L < c && !e.isEmpty(L);
        L++
      )
        if (!(e.sCount[L] - e.blkIndent > 3) && !(e.sCount[L] < 0)) {
          for (k = !1, u = 0, f = S.length; u < f; u++)
            if (S[u](e, L, c, !0)) {
              k = !0;
              break;
            }
          if (k) break;
        }
      for (
        b = e.getLines(t, L, e.blkIndent, !1).trim(), N = b.length, x = 1;
        x < N;
        x++
      ) {
        if (((s = b.charCodeAt(x)), s === 91)) return !1;
        if (s === 93) {
          p = x;
          break;
        } else
          s === 10
            ? _++
            : s === 92 && (x++, x < N && b.charCodeAt(x) === 10 && _++);
      }
      if (p < 0 || b.charCodeAt(p + 1) !== 58) return !1;
      for (x = p + 2; x < N; x++)
        if (((s = b.charCodeAt(x)), s === 10)) _++;
        else if (!Rn(s)) break;
      if (
        ((m = e.md.helpers.parseLinkDestination(b, x, N)),
        !m.ok || ((a = e.md.normalizeLink(m.str)), !e.md.validateLink(a)))
      )
        return !1;
      for (x = m.pos, _ += m.lines, i = x, l = _, g = x; x < N; x++)
        if (((s = b.charCodeAt(x)), s === 10)) _++;
        else if (!Rn(s)) break;
      for (
        m = e.md.helpers.parseLinkTitle(b, x, N),
          x < N && g !== x && m.ok
            ? ((A = m.str), (x = m.pos), (_ += m.lines))
            : ((A = ""), (x = i), (_ = l));
        x < N && ((s = b.charCodeAt(x)), !!Rn(s));

      )
        x++;
      if (x < N && b.charCodeAt(x) !== 10 && A)
        for (A = "", x = i, _ = l; x < N && ((s = b.charCodeAt(x)), !!Rn(s)); )
          x++;
      return (x < N && b.charCodeAt(x) !== 10) || ((h = Hh(b.slice(1, p))), !h)
        ? !1
        : (o ||
            (typeof e.env.references > "u" && (e.env.references = {}),
            typeof e.env.references[h] > "u" &&
              (e.env.references[h] = { title: A, href: a }),
            (e.parentType = d),
            (e.line = t + _ + 1)),
          !0);
    },
    jh = [
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
      "ul",
    ],
    In = {},
    Jh = "[a-zA-Z_:][a-zA-Z0-9:._-]*",
    Wh = "[^\"'=<>`\\x00-\\x20]+",
    Kh = "'[^']*'",
    Zh = '"[^"]*"',
    Yh = "(?:" + Wh + "|" + Kh + "|" + Zh + ")",
    Qh = "(?:\\s+" + Jh + "(?:\\s*=\\s*" + Yh + ")?)",
    Rl = "<[A-Za-z][A-Za-z0-9\\-]*" + Qh + "*\\s*\\/?>",
    Il = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>",
    Xh = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->",
    ep = "<[?][\\s\\S]*?[?]>",
    tp = "<![A-Z]+\\s+[^>]*>",
    np = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
    rp = new RegExp(
      "^(?:" + Rl + "|" + Il + "|" + Xh + "|" + ep + "|" + tp + "|" + np + ")",
    ),
    op = new RegExp("^(?:" + Rl + "|" + Il + ")");
  (In.HTML_TAG_RE = rp), (In.HTML_OPEN_CLOSE_TAG_RE = op);
  var sp = jh,
    ip = In.HTML_OPEN_CLOSE_TAG_RE,
    St = [
      [
        /^<(script|pre|style|textarea)(?=(\s|>|$))/i,
        /<\/(script|pre|style|textarea)>/i,
        !0,
      ],
      [/^<!--/, /-->/, !0],
      [/^<\?/, /\?>/, !0],
      [/^<![A-Z]/, />/, !0],
      [/^<!\[CDATA\[/, /\]\]>/, !0],
      [new RegExp("^</?(" + sp.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, !0],
      [new RegExp(ip.source + "\\s*$"), /^$/, !1],
    ],
    lp = function (e, t, r, o) {
      var s,
        i,
        l,
        c,
        a = e.bMarks[t] + e.tShift[t],
        u = e.eMarks[t];
      if (
        e.sCount[t] - e.blkIndent >= 4 ||
        !e.md.options.html ||
        e.src.charCodeAt(a) !== 60
      )
        return !1;
      for (
        c = e.src.slice(a, u), s = 0;
        s < St.length && !St[s][0].test(c);
        s++
      );
      if (s === St.length) return !1;
      if (o) return St[s][2];
      if (((i = t + 1), !St[s][1].test(c))) {
        for (; i < r && !(e.sCount[i] < e.blkIndent); i++)
          if (
            ((a = e.bMarks[i] + e.tShift[i]),
            (u = e.eMarks[i]),
            (c = e.src.slice(a, u)),
            St[s][1].test(c))
          ) {
            c.length !== 0 && i++;
            break;
          }
      }
      return (
        (e.line = i),
        (l = e.push("html_block", "", 0)),
        (l.map = [t, i]),
        (l.content = e.getLines(t, i, e.blkIndent, !0)),
        !0
      );
    },
    Ll = R.isSpace,
    cp = function (e, t, r, o) {
      var s,
        i,
        l,
        c,
        a = e.bMarks[t] + e.tShift[t],
        u = e.eMarks[t];
      if (
        e.sCount[t] - e.blkIndent >= 4 ||
        ((s = e.src.charCodeAt(a)), s !== 35 || a >= u)
      )
        return !1;
      for (i = 1, s = e.src.charCodeAt(++a); s === 35 && a < u && i <= 6; )
        i++, (s = e.src.charCodeAt(++a));
      return i > 6 || (a < u && !Ll(s))
        ? !1
        : (o ||
            ((u = e.skipSpacesBack(u, a)),
            (l = e.skipCharsBack(u, 35, a)),
            l > a && Ll(e.src.charCodeAt(l - 1)) && (u = l),
            (e.line = t + 1),
            (c = e.push("heading_open", "h" + String(i), 1)),
            (c.markup = "########".slice(0, i)),
            (c.map = [t, e.line]),
            (c = e.push("inline", "", 0)),
            (c.content = e.src.slice(a, u).trim()),
            (c.map = [t, e.line]),
            (c.children = []),
            (c = e.push("heading_close", "h" + String(i), -1)),
            (c.markup = "########".slice(0, i))),
          !0);
    },
    ap = function (e, t, r) {
      var o,
        s,
        i,
        l,
        c,
        a,
        u,
        f,
        h,
        p = t + 1,
        d,
        m = e.md.block.ruler.getRules("paragraph");
      if (e.sCount[t] - e.blkIndent >= 4) return !1;
      for (
        d = e.parentType, e.parentType = "paragraph";
        p < r && !e.isEmpty(p);
        p++
      )
        if (!(e.sCount[p] - e.blkIndent > 3)) {
          if (
            e.sCount[p] >= e.blkIndent &&
            ((a = e.bMarks[p] + e.tShift[p]),
            (u = e.eMarks[p]),
            a < u &&
              ((h = e.src.charCodeAt(a)),
              (h === 45 || h === 61) &&
                ((a = e.skipChars(a, h)), (a = e.skipSpaces(a)), a >= u)))
          ) {
            f = h === 61 ? 1 : 2;
            break;
          }
          if (!(e.sCount[p] < 0)) {
            for (s = !1, i = 0, l = m.length; i < l; i++)
              if (m[i](e, p, r, !0)) {
                s = !0;
                break;
              }
            if (s) break;
          }
        }
      return f
        ? ((o = e.getLines(t, p, e.blkIndent, !1).trim()),
          (e.line = p + 1),
          (c = e.push("heading_open", "h" + String(f), 1)),
          (c.markup = String.fromCharCode(h)),
          (c.map = [t, e.line]),
          (c = e.push("inline", "", 0)),
          (c.content = o),
          (c.map = [t, e.line - 1]),
          (c.children = []),
          (c = e.push("heading_close", "h" + String(f), -1)),
          (c.markup = String.fromCharCode(h)),
          (e.parentType = d),
          !0)
        : !1;
    },
    up = function (e, t, r) {
      var o,
        s,
        i,
        l,
        c,
        a,
        u = t + 1,
        f = e.md.block.ruler.getRules("paragraph");
      for (
        a = e.parentType, e.parentType = "paragraph";
        u < r && !e.isEmpty(u);
        u++
      )
        if (!(e.sCount[u] - e.blkIndent > 3) && !(e.sCount[u] < 0)) {
          for (s = !1, i = 0, l = f.length; i < l; i++)
            if (f[i](e, u, r, !0)) {
              s = !0;
              break;
            }
          if (s) break;
        }
      return (
        (o = e.getLines(t, u, e.blkIndent, !1).trim()),
        (e.line = u),
        (c = e.push("paragraph_open", "p", 1)),
        (c.map = [t, e.line]),
        (c = e.push("inline", "", 0)),
        (c.content = o),
        (c.map = [t, e.line]),
        (c.children = []),
        (c = e.push("paragraph_close", "p", -1)),
        (e.parentType = a),
        !0
      );
    },
    zl = to,
    Ln = R.isSpace;
  function we(n, e, t, r) {
    var o, s, i, l, c, a, u, f;
    for (
      this.src = n,
        this.md = e,
        this.env = t,
        this.tokens = r,
        this.bMarks = [],
        this.eMarks = [],
        this.tShift = [],
        this.sCount = [],
        this.bsCount = [],
        this.blkIndent = 0,
        this.line = 0,
        this.lineMax = 0,
        this.tight = !1,
        this.ddIndent = -1,
        this.listIndent = -1,
        this.parentType = "root",
        this.level = 0,
        this.result = "",
        s = this.src,
        f = !1,
        i = l = a = u = 0,
        c = s.length;
      l < c;
      l++
    ) {
      if (((o = s.charCodeAt(l)), !f))
        if (Ln(o)) {
          a++, o === 9 ? (u += 4 - (u % 4)) : u++;
          continue;
        } else f = !0;
      (o === 10 || l === c - 1) &&
        (o !== 10 && l++,
        this.bMarks.push(i),
        this.eMarks.push(l),
        this.tShift.push(a),
        this.sCount.push(u),
        this.bsCount.push(0),
        (f = !1),
        (a = 0),
        (u = 0),
        (i = l + 1));
    }
    this.bMarks.push(s.length),
      this.eMarks.push(s.length),
      this.tShift.push(0),
      this.sCount.push(0),
      this.bsCount.push(0),
      (this.lineMax = this.bMarks.length - 1);
  }
  (we.prototype.push = function (n, e, t) {
    var r = new zl(n, e, t);
    return (
      (r.block = !0),
      t < 0 && this.level--,
      (r.level = this.level),
      t > 0 && this.level++,
      this.tokens.push(r),
      r
    );
  }),
    (we.prototype.isEmpty = function (e) {
      return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
    }),
    (we.prototype.skipEmptyLines = function (e) {
      for (
        var t = this.lineMax;
        e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]);
        e++
      );
      return e;
    }),
    (we.prototype.skipSpaces = function (e) {
      for (
        var t, r = this.src.length;
        e < r && ((t = this.src.charCodeAt(e)), !!Ln(t));
        e++
      );
      return e;
    }),
    (we.prototype.skipSpacesBack = function (e, t) {
      if (e <= t) return e;
      for (; e > t; ) if (!Ln(this.src.charCodeAt(--e))) return e + 1;
      return e;
    }),
    (we.prototype.skipChars = function (e, t) {
      for (var r = this.src.length; e < r && this.src.charCodeAt(e) === t; e++);
      return e;
    }),
    (we.prototype.skipCharsBack = function (e, t, r) {
      if (e <= r) return e;
      for (; e > r; ) if (t !== this.src.charCodeAt(--e)) return e + 1;
      return e;
    }),
    (we.prototype.getLines = function (e, t, r, o) {
      var s,
        i,
        l,
        c,
        a,
        u,
        f,
        h = e;
      if (e >= t) return "";
      for (u = new Array(t - e), s = 0; h < t; h++, s++) {
        for (
          i = 0,
            f = c = this.bMarks[h],
            h + 1 < t || o ? (a = this.eMarks[h] + 1) : (a = this.eMarks[h]);
          c < a && i < r;

        ) {
          if (((l = this.src.charCodeAt(c)), Ln(l)))
            l === 9 ? (i += 4 - ((i + this.bsCount[h]) % 4)) : i++;
          else if (c - f < this.tShift[h]) i++;
          else break;
          c++;
        }
        i > r
          ? (u[s] = new Array(i - r + 1).join(" ") + this.src.slice(c, a))
          : (u[s] = this.src.slice(c, a));
      }
      return u.join("");
    }),
    (we.prototype.Token = zl);
  var fp = we,
    hp = eo,
    zn = [
      ["table", Ih, ["paragraph", "reference"]],
      ["code", Lh],
      ["fence", zh, ["paragraph", "reference", "blockquote", "list"]],
      ["blockquote", Bh, ["paragraph", "reference", "blockquote", "list"]],
      ["hr", Vh, ["paragraph", "reference", "blockquote", "list"]],
      ["list", Uh, ["paragraph", "reference", "blockquote"]],
      ["reference", Gh],
      ["html_block", lp, ["paragraph", "reference", "blockquote"]],
      ["heading", cp, ["paragraph", "reference", "blockquote"]],
      ["lheading", ap],
      ["paragraph", up],
    ];
  function Fn() {
    this.ruler = new hp();
    for (var n = 0; n < zn.length; n++)
      this.ruler.push(zn[n][0], zn[n][1], { alt: (zn[n][2] || []).slice() });
  }
  (Fn.prototype.tokenize = function (n, e, t) {
    for (
      var r,
        o,
        s,
        i = this.ruler.getRules(""),
        l = i.length,
        c = e,
        a = !1,
        u = n.md.options.maxNesting;
      c < t &&
      ((n.line = c = n.skipEmptyLines(c)),
      !(c >= t || n.sCount[c] < n.blkIndent));

    ) {
      if (n.level >= u) {
        n.line = t;
        break;
      }
      for (s = n.line, o = 0; o < l; o++)
        if (((r = i[o](n, c, t, !1)), r)) {
          if (s >= n.line)
            throw new Error("block rule didn't increment state.line");
          break;
        }
      if (!r) throw new Error("none of the block rules matched");
      (n.tight = !a),
        n.isEmpty(n.line - 1) && (a = !0),
        (c = n.line),
        c < t && n.isEmpty(c) && ((a = !0), c++, (n.line = c));
    }
  }),
    (Fn.prototype.parse = function (n, e, t, r) {
      var o;
      n &&
        ((o = new this.State(n, e, t, r)), this.tokenize(o, o.line, o.lineMax));
    }),
    (Fn.prototype.State = fp);
  var pp = Fn;
  function dp(n) {
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
  for (
    var mp = function (e, t) {
        for (var r = e.pos; r < e.posMax && !dp(e.src.charCodeAt(r)); ) r++;
        return r === e.pos
          ? !1
          : (t || (e.pending += e.src.slice(e.pos, r)), (e.pos = r), !0);
      },
      gp = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i,
      bp = function (e, t) {
        var r, o, s, i, l, c, a, u;
        return !e.md.options.linkify ||
          e.linkLevel > 0 ||
          ((r = e.pos), (o = e.posMax), r + 3 > o) ||
          e.src.charCodeAt(r) !== 58 ||
          e.src.charCodeAt(r + 1) !== 47 ||
          e.src.charCodeAt(r + 2) !== 47 ||
          ((s = e.pending.match(gp)), !s) ||
          ((i = s[1]),
          (l = e.md.linkify.matchAtStart(e.src.slice(r - i.length))),
          !l) ||
          ((c = l.url), c.length <= i.length) ||
          ((c = c.replace(/\*+$/, "")),
          (a = e.md.normalizeLink(c)),
          !e.md.validateLink(a))
          ? !1
          : (t ||
              ((e.pending = e.pending.slice(0, -i.length)),
              (u = e.push("link_open", "a", 1)),
              (u.attrs = [["href", a]]),
              (u.markup = "linkify"),
              (u.info = "auto"),
              (u = e.push("text", "", 0)),
              (u.content = e.md.normalizeLinkText(c)),
              (u = e.push("link_close", "a", -1)),
              (u.markup = "linkify"),
              (u.info = "auto")),
            (e.pos += c.length - i.length),
            !0);
      },
      yp = R.isSpace,
      kp = function (e, t) {
        var r,
          o,
          s,
          i = e.pos;
        if (e.src.charCodeAt(i) !== 10) return !1;
        if (((r = e.pending.length - 1), (o = e.posMax), !t))
          if (r >= 0 && e.pending.charCodeAt(r) === 32)
            if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
              for (s = r - 1; s >= 1 && e.pending.charCodeAt(s - 1) === 32; )
                s--;
              (e.pending = e.pending.slice(0, s)), e.push("hardbreak", "br", 0);
            } else
              (e.pending = e.pending.slice(0, -1)),
                e.push("softbreak", "br", 0);
          else e.push("softbreak", "br", 0);
        for (i++; i < o && yp(e.src.charCodeAt(i)); ) i++;
        return (e.pos = i), !0;
      },
      xp = R.isSpace,
      io = [],
      Fl = 0;
    Fl < 256;
    Fl++
  )
    io.push(0);
  "\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function (n) {
    io[n.charCodeAt(0)] = 1;
  });
  var wp = function (e, t) {
      var r,
        o,
        s,
        i,
        l,
        c = e.pos,
        a = e.posMax;
      if (e.src.charCodeAt(c) !== 92 || (c++, c >= a)) return !1;
      if (((r = e.src.charCodeAt(c)), r === 10)) {
        for (
          t || e.push("hardbreak", "br", 0), c++;
          c < a && ((r = e.src.charCodeAt(c)), !!xp(r));

        )
          c++;
        return (e.pos = c), !0;
      }
      return (
        (i = e.src[c]),
        r >= 55296 &&
          r <= 56319 &&
          c + 1 < a &&
          ((o = e.src.charCodeAt(c + 1)),
          o >= 56320 && o <= 57343 && ((i += e.src[c + 1]), c++)),
        (s = "\\" + i),
        t ||
          ((l = e.push("text_special", "", 0)),
          r < 256 && io[r] !== 0 ? (l.content = i) : (l.content = s),
          (l.markup = s),
          (l.info = "escape")),
        (e.pos = c + 1),
        !0
      );
    },
    vp = function (e, t) {
      var r,
        o,
        s,
        i,
        l,
        c,
        a,
        u,
        f = e.pos,
        h = e.src.charCodeAt(f);
      if (h !== 96) return !1;
      for (r = f, f++, o = e.posMax; f < o && e.src.charCodeAt(f) === 96; ) f++;
      if (
        ((s = e.src.slice(r, f)),
        (a = s.length),
        e.backticksScanned && (e.backticks[a] || 0) <= r)
      )
        return t || (e.pending += s), (e.pos += a), !0;
      for (c = f; (l = e.src.indexOf("`", c)) !== -1; ) {
        for (c = l + 1; c < o && e.src.charCodeAt(c) === 96; ) c++;
        if (((u = c - l), u === a))
          return (
            t ||
              ((i = e.push("code_inline", "code", 0)),
              (i.markup = s),
              (i.content = e.src
                .slice(f, l)
                .replace(/\n/g, " ")
                .replace(/^ (.+) $/, "$1"))),
            (e.pos = c),
            !0
          );
        e.backticks[u] = l;
      }
      return (e.backticksScanned = !0), t || (e.pending += s), (e.pos += a), !0;
    },
    Bn = {};
  Bn.tokenize = function (e, t) {
    var r,
      o,
      s,
      i,
      l,
      c = e.pos,
      a = e.src.charCodeAt(c);
    if (
      t ||
      a !== 126 ||
      ((o = e.scanDelims(e.pos, !0)),
      (i = o.length),
      (l = String.fromCharCode(a)),
      i < 2)
    )
      return !1;
    for (
      i % 2 && ((s = e.push("text", "", 0)), (s.content = l), i--), r = 0;
      r < i;
      r += 2
    )
      (s = e.push("text", "", 0)),
        (s.content = l + l),
        e.delimiters.push({
          marker: a,
          length: 0,
          token: e.tokens.length - 1,
          end: -1,
          open: o.can_open,
          close: o.can_close,
        });
    return (e.pos += o.length), !0;
  };
  function Bl(n, e) {
    var t,
      r,
      o,
      s,
      i,
      l = [],
      c = e.length;
    for (t = 0; t < c; t++)
      (o = e[t]),
        o.marker === 126 &&
          o.end !== -1 &&
          ((s = e[o.end]),
          (i = n.tokens[o.token]),
          (i.type = "s_open"),
          (i.tag = "s"),
          (i.nesting = 1),
          (i.markup = "~~"),
          (i.content = ""),
          (i = n.tokens[s.token]),
          (i.type = "s_close"),
          (i.tag = "s"),
          (i.nesting = -1),
          (i.markup = "~~"),
          (i.content = ""),
          n.tokens[s.token - 1].type === "text" &&
            n.tokens[s.token - 1].content === "~" &&
            l.push(s.token - 1));
    for (; l.length; ) {
      for (
        t = l.pop(), r = t + 1;
        r < n.tokens.length && n.tokens[r].type === "s_close";

      )
        r++;
      r--,
        t !== r &&
          ((i = n.tokens[r]), (n.tokens[r] = n.tokens[t]), (n.tokens[t] = i));
    }
  }
  Bn.postProcess = function (e) {
    var t,
      r = e.tokens_meta,
      o = e.tokens_meta.length;
    for (Bl(e, e.delimiters), t = 0; t < o; t++)
      r[t] && r[t].delimiters && Bl(e, r[t].delimiters);
  };
  var Pn = {};
  Pn.tokenize = function (e, t) {
    var r,
      o,
      s,
      i = e.pos,
      l = e.src.charCodeAt(i);
    if (t || (l !== 95 && l !== 42)) return !1;
    for (o = e.scanDelims(e.pos, l === 42), r = 0; r < o.length; r++)
      (s = e.push("text", "", 0)),
        (s.content = String.fromCharCode(l)),
        e.delimiters.push({
          marker: l,
          length: o.length,
          token: e.tokens.length - 1,
          end: -1,
          open: o.can_open,
          close: o.can_close,
        });
    return (e.pos += o.length), !0;
  };
  function Pl(n, e) {
    var t,
      r,
      o,
      s,
      i,
      l,
      c = e.length;
    for (t = c - 1; t >= 0; t--)
      (r = e[t]),
        !(r.marker !== 95 && r.marker !== 42) &&
          r.end !== -1 &&
          ((o = e[r.end]),
          (l =
            t > 0 &&
            e[t - 1].end === r.end + 1 &&
            e[t - 1].marker === r.marker &&
            e[t - 1].token === r.token - 1 &&
            e[r.end + 1].token === o.token + 1),
          (i = String.fromCharCode(r.marker)),
          (s = n.tokens[r.token]),
          (s.type = l ? "strong_open" : "em_open"),
          (s.tag = l ? "strong" : "em"),
          (s.nesting = 1),
          (s.markup = l ? i + i : i),
          (s.content = ""),
          (s = n.tokens[o.token]),
          (s.type = l ? "strong_close" : "em_close"),
          (s.tag = l ? "strong" : "em"),
          (s.nesting = -1),
          (s.markup = l ? i + i : i),
          (s.content = ""),
          l &&
            ((n.tokens[e[t - 1].token].content = ""),
            (n.tokens[e[r.end + 1].token].content = ""),
            t--));
  }
  Pn.postProcess = function (e) {
    var t,
      r = e.tokens_meta,
      o = e.tokens_meta.length;
    for (Pl(e, e.delimiters), t = 0; t < o; t++)
      r[t] && r[t].delimiters && Pl(e, r[t].delimiters);
  };
  var Cp = R.normalizeReference,
    lo = R.isSpace,
    Sp = function (e, t) {
      var r,
        o,
        s,
        i,
        l,
        c,
        a,
        u,
        f,
        h = "",
        p = "",
        d = e.pos,
        m = e.posMax,
        g = e.pos,
        b = !0;
      if (
        e.src.charCodeAt(e.pos) !== 91 ||
        ((l = e.pos + 1),
        (i = e.md.helpers.parseLinkLabel(e, e.pos, !0)),
        i < 0)
      )
        return !1;
      if (((c = i + 1), c < m && e.src.charCodeAt(c) === 40)) {
        for (
          b = !1, c++;
          c < m && ((o = e.src.charCodeAt(c)), !(!lo(o) && o !== 10));
          c++
        );
        if (c >= m) return !1;
        if (
          ((g = c),
          (a = e.md.helpers.parseLinkDestination(e.src, c, e.posMax)),
          a.ok)
        ) {
          for (
            h = e.md.normalizeLink(a.str),
              e.md.validateLink(h) ? (c = a.pos) : (h = ""),
              g = c;
            c < m && ((o = e.src.charCodeAt(c)), !(!lo(o) && o !== 10));
            c++
          );
          if (
            ((a = e.md.helpers.parseLinkTitle(e.src, c, e.posMax)),
            c < m && g !== c && a.ok)
          )
            for (
              p = a.str, c = a.pos;
              c < m && ((o = e.src.charCodeAt(c)), !(!lo(o) && o !== 10));
              c++
            );
        }
        (c >= m || e.src.charCodeAt(c) !== 41) && (b = !0), c++;
      }
      if (b) {
        if (typeof e.env.references > "u") return !1;
        if (
          (c < m && e.src.charCodeAt(c) === 91
            ? ((g = c + 1),
              (c = e.md.helpers.parseLinkLabel(e, c)),
              c >= 0 ? (s = e.src.slice(g, c++)) : (c = i + 1))
            : (c = i + 1),
          s || (s = e.src.slice(l, i)),
          (u = e.env.references[Cp(s)]),
          !u)
        )
          return (e.pos = d), !1;
        (h = u.href), (p = u.title);
      }
      return (
        t ||
          ((e.pos = l),
          (e.posMax = i),
          (f = e.push("link_open", "a", 1)),
          (f.attrs = r = [["href", h]]),
          p && r.push(["title", p]),
          e.linkLevel++,
          e.md.inline.tokenize(e),
          e.linkLevel--,
          (f = e.push("link_close", "a", -1))),
        (e.pos = c),
        (e.posMax = m),
        !0
      );
    },
    Dp = R.normalizeReference,
    co = R.isSpace,
    Ep = function (e, t) {
      var r,
        o,
        s,
        i,
        l,
        c,
        a,
        u,
        f,
        h,
        p,
        d,
        m,
        g = "",
        b = e.pos,
        k = e.posMax;
      if (
        e.src.charCodeAt(e.pos) !== 33 ||
        e.src.charCodeAt(e.pos + 1) !== 91 ||
        ((c = e.pos + 2),
        (l = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1)),
        l < 0)
      )
        return !1;
      if (((a = l + 1), a < k && e.src.charCodeAt(a) === 40)) {
        for (
          a++;
          a < k && ((o = e.src.charCodeAt(a)), !(!co(o) && o !== 10));
          a++
        );
        if (a >= k) return !1;
        for (
          m = a,
            f = e.md.helpers.parseLinkDestination(e.src, a, e.posMax),
            f.ok &&
              ((g = e.md.normalizeLink(f.str)),
              e.md.validateLink(g) ? (a = f.pos) : (g = "")),
            m = a;
          a < k && ((o = e.src.charCodeAt(a)), !(!co(o) && o !== 10));
          a++
        );
        if (
          ((f = e.md.helpers.parseLinkTitle(e.src, a, e.posMax)),
          a < k && m !== a && f.ok)
        )
          for (
            h = f.str, a = f.pos;
            a < k && ((o = e.src.charCodeAt(a)), !(!co(o) && o !== 10));
            a++
          );
        else h = "";
        if (a >= k || e.src.charCodeAt(a) !== 41) return (e.pos = b), !1;
        a++;
      } else {
        if (typeof e.env.references > "u") return !1;
        if (
          (a < k && e.src.charCodeAt(a) === 91
            ? ((m = a + 1),
              (a = e.md.helpers.parseLinkLabel(e, a)),
              a >= 0 ? (i = e.src.slice(m, a++)) : (a = l + 1))
            : (a = l + 1),
          i || (i = e.src.slice(c, l)),
          (u = e.env.references[Dp(i)]),
          !u)
        )
          return (e.pos = b), !1;
        (g = u.href), (h = u.title);
      }
      return (
        t ||
          ((s = e.src.slice(c, l)),
          e.md.inline.parse(s, e.md, e.env, (d = [])),
          (p = e.push("image", "img", 0)),
          (p.attrs = r =
            [
              ["src", g],
              ["alt", ""],
            ]),
          (p.children = d),
          (p.content = s),
          h && r.push(["title", h])),
        (e.pos = a),
        (e.posMax = k),
        !0
      );
    },
    Ap =
      /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/,
    _p = /^([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)$/,
    Mp = function (e, t) {
      var r,
        o,
        s,
        i,
        l,
        c,
        a = e.pos;
      if (e.src.charCodeAt(a) !== 60) return !1;
      for (l = e.pos, c = e.posMax; ; ) {
        if (++a >= c || ((i = e.src.charCodeAt(a)), i === 60)) return !1;
        if (i === 62) break;
      }
      return (
        (r = e.src.slice(l + 1, a)),
        _p.test(r)
          ? ((o = e.md.normalizeLink(r)),
            e.md.validateLink(o)
              ? (t ||
                  ((s = e.push("link_open", "a", 1)),
                  (s.attrs = [["href", o]]),
                  (s.markup = "autolink"),
                  (s.info = "auto"),
                  (s = e.push("text", "", 0)),
                  (s.content = e.md.normalizeLinkText(r)),
                  (s = e.push("link_close", "a", -1)),
                  (s.markup = "autolink"),
                  (s.info = "auto")),
                (e.pos += r.length + 2),
                !0)
              : !1)
          : Ap.test(r)
            ? ((o = e.md.normalizeLink("mailto:" + r)),
              e.md.validateLink(o)
                ? (t ||
                    ((s = e.push("link_open", "a", 1)),
                    (s.attrs = [["href", o]]),
                    (s.markup = "autolink"),
                    (s.info = "auto"),
                    (s = e.push("text", "", 0)),
                    (s.content = e.md.normalizeLinkText(r)),
                    (s = e.push("link_close", "a", -1)),
                    (s.markup = "autolink"),
                    (s.info = "auto")),
                  (e.pos += r.length + 2),
                  !0)
                : !1)
            : !1
      );
    },
    Tp = In.HTML_TAG_RE;
  function qp(n) {
    return /^<a[>\s]/i.test(n);
  }
  function Np(n) {
    return /^<\/a\s*>/i.test(n);
  }
  function Op(n) {
    var e = n | 32;
    return e >= 97 && e <= 122;
  }
  var Rp = function (e, t) {
      var r,
        o,
        s,
        i,
        l = e.pos;
      return !e.md.options.html ||
        ((s = e.posMax), e.src.charCodeAt(l) !== 60 || l + 2 >= s) ||
        ((r = e.src.charCodeAt(l + 1)),
        r !== 33 && r !== 63 && r !== 47 && !Op(r)) ||
        ((o = e.src.slice(l).match(Tp)), !o)
        ? !1
        : (t ||
            ((i = e.push("html_inline", "", 0)),
            (i.content = o[0]),
            qp(i.content) && e.linkLevel++,
            Np(i.content) && e.linkLevel--),
          (e.pos += o[0].length),
          !0);
    },
    Vl = il,
    Ip = R.has,
    Lp = R.isValidEntityCode,
    $l = R.fromCodePoint,
    zp = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i,
    Fp = /^&([a-z][a-z0-9]{1,31});/i,
    Bp = function (e, t) {
      var r,
        o,
        s,
        i,
        l = e.pos,
        c = e.posMax;
      if (e.src.charCodeAt(l) !== 38 || l + 1 >= c) return !1;
      if (((r = e.src.charCodeAt(l + 1)), r === 35)) {
        if (((s = e.src.slice(l).match(zp)), s))
          return (
            t ||
              ((o =
                s[1][0].toLowerCase() === "x"
                  ? parseInt(s[1].slice(1), 16)
                  : parseInt(s[1], 10)),
              (i = e.push("text_special", "", 0)),
              (i.content = Lp(o) ? $l(o) : $l(65533)),
              (i.markup = s[0]),
              (i.info = "entity")),
            (e.pos += s[0].length),
            !0
          );
      } else if (((s = e.src.slice(l).match(Fp)), s && Ip(Vl, s[1])))
        return (
          t ||
            ((i = e.push("text_special", "", 0)),
            (i.content = Vl[s[1]]),
            (i.markup = s[0]),
            (i.info = "entity")),
          (e.pos += s[0].length),
          !0
        );
      return !1;
    };
  function Ul(n) {
    var e,
      t,
      r,
      o,
      s,
      i,
      l,
      c,
      a = {},
      u = n.length;
    if (u) {
      var f = 0,
        h = -2,
        p = [];
      for (e = 0; e < u; e++)
        if (
          ((r = n[e]),
          p.push(0),
          (n[f].marker !== r.marker || h !== r.token - 1) && (f = e),
          (h = r.token),
          (r.length = r.length || 0),
          !!r.close)
        ) {
          for (
            a.hasOwnProperty(r.marker) ||
              (a[r.marker] = [-1, -1, -1, -1, -1, -1]),
              s = a[r.marker][(r.open ? 3 : 0) + (r.length % 3)],
              t = f - p[f] - 1,
              i = t;
            t > s;
            t -= p[t] + 1
          )
            if (
              ((o = n[t]),
              o.marker === r.marker &&
                o.open &&
                o.end < 0 &&
                ((l = !1),
                (o.close || r.open) &&
                  (o.length + r.length) % 3 === 0 &&
                  (o.length % 3 !== 0 || r.length % 3 !== 0) &&
                  (l = !0),
                !l))
            ) {
              (c = t > 0 && !n[t - 1].open ? p[t - 1] + 1 : 0),
                (p[e] = e - t + c),
                (p[t] = c),
                (r.open = !1),
                (o.end = e),
                (o.close = !1),
                (i = -1),
                (h = -2);
              break;
            }
          i !== -1 &&
            (a[r.marker][(r.open ? 3 : 0) + ((r.length || 0) % 3)] = i);
        }
    }
  }
  var Pp = function (e) {
      var t,
        r = e.tokens_meta,
        o = e.tokens_meta.length;
      for (Ul(e.delimiters), t = 0; t < o; t++)
        r[t] && r[t].delimiters && Ul(r[t].delimiters);
    },
    Vp = function (e) {
      var t,
        r,
        o = 0,
        s = e.tokens,
        i = e.tokens.length;
      for (t = r = 0; t < i; t++)
        s[t].nesting < 0 && o--,
          (s[t].level = o),
          s[t].nesting > 0 && o++,
          s[t].type === "text" && t + 1 < i && s[t + 1].type === "text"
            ? (s[t + 1].content = s[t].content + s[t + 1].content)
            : (t !== r && (s[r] = s[t]), r++);
      t !== r && (s.length = r);
    },
    ao = to,
    Hl = R.isWhiteSpace,
    Gl = R.isPunctChar,
    jl = R.isMdAsciiPunct;
  function Wt(n, e, t, r) {
    (this.src = n),
      (this.env = t),
      (this.md = e),
      (this.tokens = r),
      (this.tokens_meta = Array(r.length)),
      (this.pos = 0),
      (this.posMax = this.src.length),
      (this.level = 0),
      (this.pending = ""),
      (this.pendingLevel = 0),
      (this.cache = {}),
      (this.delimiters = []),
      (this._prev_delimiters = []),
      (this.backticks = {}),
      (this.backticksScanned = !1),
      (this.linkLevel = 0);
  }
  (Wt.prototype.pushPending = function () {
    var n = new ao("text", "", 0);
    return (
      (n.content = this.pending),
      (n.level = this.pendingLevel),
      this.tokens.push(n),
      (this.pending = ""),
      n
    );
  }),
    (Wt.prototype.push = function (n, e, t) {
      this.pending && this.pushPending();
      var r = new ao(n, e, t),
        o = null;
      return (
        t < 0 &&
          (this.level--, (this.delimiters = this._prev_delimiters.pop())),
        (r.level = this.level),
        t > 0 &&
          (this.level++,
          this._prev_delimiters.push(this.delimiters),
          (this.delimiters = []),
          (o = { delimiters: this.delimiters })),
        (this.pendingLevel = this.level),
        this.tokens.push(r),
        this.tokens_meta.push(o),
        r
      );
    }),
    (Wt.prototype.scanDelims = function (n, e) {
      var t = n,
        r,
        o,
        s,
        i,
        l,
        c,
        a,
        u,
        f,
        h = !0,
        p = !0,
        d = this.posMax,
        m = this.src.charCodeAt(n);
      for (
        r = n > 0 ? this.src.charCodeAt(n - 1) : 32;
        t < d && this.src.charCodeAt(t) === m;

      )
        t++;
      return (
        (s = t - n),
        (o = t < d ? this.src.charCodeAt(t) : 32),
        (a = jl(r) || Gl(String.fromCharCode(r))),
        (f = jl(o) || Gl(String.fromCharCode(o))),
        (c = Hl(r)),
        (u = Hl(o)),
        u ? (h = !1) : f && (c || a || (h = !1)),
        c ? (p = !1) : a && (u || f || (p = !1)),
        e ? ((i = h), (l = p)) : ((i = h && (!p || a)), (l = p && (!h || f))),
        { can_open: i, can_close: l, length: s }
      );
    }),
    (Wt.prototype.Token = ao);
  var $p = Wt,
    Jl = eo,
    uo = [
      ["text", mp],
      ["linkify", bp],
      ["newline", kp],
      ["escape", wp],
      ["backticks", vp],
      ["strikethrough", Bn.tokenize],
      ["emphasis", Pn.tokenize],
      ["link", Sp],
      ["image", Ep],
      ["autolink", Mp],
      ["html_inline", Rp],
      ["entity", Bp],
    ],
    fo = [
      ["balance_pairs", Pp],
      ["strikethrough", Bn.postProcess],
      ["emphasis", Pn.postProcess],
      ["fragments_join", Vp],
    ];
  function Kt() {
    var n;
    for (this.ruler = new Jl(), n = 0; n < uo.length; n++)
      this.ruler.push(uo[n][0], uo[n][1]);
    for (this.ruler2 = new Jl(), n = 0; n < fo.length; n++)
      this.ruler2.push(fo[n][0], fo[n][1]);
  }
  (Kt.prototype.skipToken = function (n) {
    var e,
      t,
      r = n.pos,
      o = this.ruler.getRules(""),
      s = o.length,
      i = n.md.options.maxNesting,
      l = n.cache;
    if (typeof l[r] < "u") {
      n.pos = l[r];
      return;
    }
    if (n.level < i) {
      for (t = 0; t < s; t++)
        if ((n.level++, (e = o[t](n, !0)), n.level--, e)) {
          if (r >= n.pos)
            throw new Error("inline rule didn't increment state.pos");
          break;
        }
    } else n.pos = n.posMax;
    e || n.pos++, (l[r] = n.pos);
  }),
    (Kt.prototype.tokenize = function (n) {
      for (
        var e,
          t,
          r,
          o = this.ruler.getRules(""),
          s = o.length,
          i = n.posMax,
          l = n.md.options.maxNesting;
        n.pos < i;

      ) {
        if (((r = n.pos), n.level < l)) {
          for (t = 0; t < s; t++)
            if (((e = o[t](n, !1)), e)) {
              if (r >= n.pos)
                throw new Error("inline rule didn't increment state.pos");
              break;
            }
        }
        if (e) {
          if (n.pos >= i) break;
          continue;
        }
        n.pending += n.src[n.pos++];
      }
      n.pending && n.pushPending();
    }),
    (Kt.prototype.parse = function (n, e, t, r) {
      var o,
        s,
        i,
        l = new this.State(n, e, t, r);
      for (
        this.tokenize(l), s = this.ruler2.getRules(""), i = s.length, o = 0;
        o < i;
        o++
      )
        s[o](l);
    }),
    (Kt.prototype.State = $p);
  var Up = Kt,
    ho,
    Wl;
  function Hp() {
    return (
      Wl ||
        ((Wl = 1),
        (ho = function (n) {
          var e = {};
          (n = n || {}),
            (e.src_Any = ml().source),
            (e.src_Cc = bl().source),
            (e.src_Z = xl().source),
            (e.src_P = Kr.source),
            (e.src_ZPCc = [e.src_Z, e.src_P, e.src_Cc].join("|")),
            (e.src_ZCc = [e.src_Z, e.src_Cc].join("|"));
          var t = "[><｜]";
          return (
            (e.src_pseudo_letter =
              "(?:(?!" + t + "|" + e.src_ZPCc + ")" + e.src_Any + ")"),
            (e.src_ip4 =
              "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)"),
            (e.src_auth = "(?:(?:(?!" + e.src_ZCc + "|[@/\\[\\]()]).)+@)?"),
            (e.src_port =
              "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?"),
            (e.src_host_terminator =
              "(?=$|" +
              t +
              "|" +
              e.src_ZPCc +
              ")(?!" +
              (n["---"] ? "-(?!--)|" : "-|") +
              "_|:\\d|\\.-|\\.(?!$|" +
              e.src_ZPCc +
              "))"),
            (e.src_path =
              "(?:[/?#](?:(?!" +
              e.src_ZCc +
              "|" +
              t +
              `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` +
              e.src_ZCc +
              "|\\]).)*\\]|\\((?:(?!" +
              e.src_ZCc +
              "|[)]).)*\\)|\\{(?:(?!" +
              e.src_ZCc +
              '|[}]).)*\\}|\\"(?:(?!' +
              e.src_ZCc +
              `|["]).)+\\"|\\'(?:(?!` +
              e.src_ZCc +
              "|[']).)+\\'|\\'(?=" +
              e.src_pseudo_letter +
              "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" +
              e.src_ZCc +
              "|[.]|$)|" +
              (n["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") +
              ",(?!" +
              e.src_ZCc +
              "|$)|;(?!" +
              e.src_ZCc +
              "|$)|\\!+(?!" +
              e.src_ZCc +
              "|[!]|$)|\\?(?!" +
              e.src_ZCc +
              "|[?]|$))+|\\/)?"),
            (e.src_email_name =
              '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*'),
            (e.src_xn = "xn--[a-z0-9\\-]{1,59}"),
            (e.src_domain_root =
              "(?:" + e.src_xn + "|" + e.src_pseudo_letter + "{1,63})"),
            (e.src_domain =
              "(?:" +
              e.src_xn +
              "|(?:" +
              e.src_pseudo_letter +
              ")|(?:" +
              e.src_pseudo_letter +
              "(?:-|" +
              e.src_pseudo_letter +
              "){0,61}" +
              e.src_pseudo_letter +
              "))"),
            (e.src_host =
              "(?:(?:(?:(?:" + e.src_domain + ")\\.)*" + e.src_domain + "))"),
            (e.tpl_host_fuzzy =
              "(?:" +
              e.src_ip4 +
              "|(?:(?:(?:" +
              e.src_domain +
              ")\\.)+(?:%TLDS%)))"),
            (e.tpl_host_no_ip_fuzzy =
              "(?:(?:(?:" + e.src_domain + ")\\.)+(?:%TLDS%))"),
            (e.src_host_strict = e.src_host + e.src_host_terminator),
            (e.tpl_host_fuzzy_strict =
              e.tpl_host_fuzzy + e.src_host_terminator),
            (e.src_host_port_strict =
              e.src_host + e.src_port + e.src_host_terminator),
            (e.tpl_host_port_fuzzy_strict =
              e.tpl_host_fuzzy + e.src_port + e.src_host_terminator),
            (e.tpl_host_port_no_ip_fuzzy_strict =
              e.tpl_host_no_ip_fuzzy + e.src_port + e.src_host_terminator),
            (e.tpl_host_fuzzy_test =
              "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" +
              e.src_ZPCc +
              "|>|$))"),
            (e.tpl_email_fuzzy =
              "(^|" +
              t +
              '|"|\\(|' +
              e.src_ZCc +
              ")(" +
              e.src_email_name +
              "@" +
              e.tpl_host_fuzzy_strict +
              ")"),
            (e.tpl_link_fuzzy =
              "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" +
              e.src_ZPCc +
              "))((?![$+<=>^`|｜])" +
              e.tpl_host_port_fuzzy_strict +
              e.src_path +
              ")"),
            (e.tpl_link_no_ip_fuzzy =
              "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" +
              e.src_ZPCc +
              "))((?![$+<=>^`|｜])" +
              e.tpl_host_port_no_ip_fuzzy_strict +
              e.src_path +
              ")"),
            e
          );
        })),
      ho
    );
  }
  function po(n) {
    var e = Array.prototype.slice.call(arguments, 1);
    return (
      e.forEach(function (t) {
        t &&
          Object.keys(t).forEach(function (r) {
            n[r] = t[r];
          });
      }),
      n
    );
  }
  function Vn(n) {
    return Object.prototype.toString.call(n);
  }
  function Gp(n) {
    return Vn(n) === "[object String]";
  }
  function jp(n) {
    return Vn(n) === "[object Object]";
  }
  function Jp(n) {
    return Vn(n) === "[object RegExp]";
  }
  function Kl(n) {
    return Vn(n) === "[object Function]";
  }
  function Wp(n) {
    return n.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
  }
  var Zl = { fuzzyLink: !0, fuzzyEmail: !0, fuzzyIP: !1 };
  function Kp(n) {
    return Object.keys(n || {}).reduce(function (e, t) {
      return e || Zl.hasOwnProperty(t);
    }, !1);
  }
  var Zp = {
      "http:": {
        validate: function (n, e, t) {
          var r = n.slice(e);
          return (
            t.re.http ||
              (t.re.http = new RegExp(
                "^\\/\\/" +
                  t.re.src_auth +
                  t.re.src_host_port_strict +
                  t.re.src_path,
                "i",
              )),
            t.re.http.test(r) ? r.match(t.re.http)[0].length : 0
          );
        },
      },
      "https:": "http:",
      "ftp:": "http:",
      "//": {
        validate: function (n, e, t) {
          var r = n.slice(e);
          return (
            t.re.no_http ||
              (t.re.no_http = new RegExp(
                "^" +
                  t.re.src_auth +
                  "(?:localhost|(?:(?:" +
                  t.re.src_domain +
                  ")\\.)+" +
                  t.re.src_domain_root +
                  ")" +
                  t.re.src_port +
                  t.re.src_host_terminator +
                  t.re.src_path,
                "i",
              )),
            t.re.no_http.test(r)
              ? (e >= 3 && n[e - 3] === ":") || (e >= 3 && n[e - 3] === "/")
                ? 0
                : r.match(t.re.no_http)[0].length
              : 0
          );
        },
      },
      "mailto:": {
        validate: function (n, e, t) {
          var r = n.slice(e);
          return (
            t.re.mailto ||
              (t.re.mailto = new RegExp(
                "^" + t.re.src_email_name + "@" + t.re.src_host_strict,
                "i",
              )),
            t.re.mailto.test(r) ? r.match(t.re.mailto)[0].length : 0
          );
        },
      },
    },
    Yp =
      "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]",
    Qp =
      "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split(
        "|",
      );
  function Xp(n) {
    (n.__index__ = -1), (n.__text_cache__ = "");
  }
  function ed(n) {
    return function (e, t) {
      var r = e.slice(t);
      return n.test(r) ? r.match(n)[0].length : 0;
    };
  }
  function Yl() {
    return function (n, e) {
      e.normalize(n);
    };
  }
  function $n(n) {
    var e = (n.re = Hp()(n.__opts__)),
      t = n.__tlds__.slice();
    n.onCompile(),
      n.__tlds_replaced__ || t.push(Yp),
      t.push(e.src_xn),
      (e.src_tlds = t.join("|"));
    function r(l) {
      return l.replace("%TLDS%", e.src_tlds);
    }
    (e.email_fuzzy = RegExp(r(e.tpl_email_fuzzy), "i")),
      (e.link_fuzzy = RegExp(r(e.tpl_link_fuzzy), "i")),
      (e.link_no_ip_fuzzy = RegExp(r(e.tpl_link_no_ip_fuzzy), "i")),
      (e.host_fuzzy_test = RegExp(r(e.tpl_host_fuzzy_test), "i"));
    var o = [];
    n.__compiled__ = {};
    function s(l, c) {
      throw new Error('(LinkifyIt) Invalid schema "' + l + '": ' + c);
    }
    Object.keys(n.__schemas__).forEach(function (l) {
      var c = n.__schemas__[l];
      if (c !== null) {
        var a = { validate: null, link: null };
        if (((n.__compiled__[l] = a), jp(c))) {
          Jp(c.validate)
            ? (a.validate = ed(c.validate))
            : Kl(c.validate)
              ? (a.validate = c.validate)
              : s(l, c),
            Kl(c.normalize)
              ? (a.normalize = c.normalize)
              : c.normalize
                ? s(l, c)
                : (a.normalize = Yl());
          return;
        }
        if (Gp(c)) {
          o.push(l);
          return;
        }
        s(l, c);
      }
    }),
      o.forEach(function (l) {
        n.__compiled__[n.__schemas__[l]] &&
          ((n.__compiled__[l].validate =
            n.__compiled__[n.__schemas__[l]].validate),
          (n.__compiled__[l].normalize =
            n.__compiled__[n.__schemas__[l]].normalize));
      }),
      (n.__compiled__[""] = { validate: null, normalize: Yl() });
    var i = Object.keys(n.__compiled__)
      .filter(function (l) {
        return l.length > 0 && n.__compiled__[l];
      })
      .map(Wp)
      .join("|");
    (n.re.schema_test = RegExp(
      "(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")",
      "i",
    )),
      (n.re.schema_search = RegExp(
        "(^|(?!_)(?:[><｜]|" + e.src_ZPCc + "))(" + i + ")",
        "ig",
      )),
      (n.re.schema_at_start = RegExp("^" + n.re.schema_search.source, "i")),
      (n.re.pretest = RegExp(
        "(" +
          n.re.schema_test.source +
          ")|(" +
          n.re.host_fuzzy_test.source +
          ")|@",
        "i",
      )),
      Xp(n);
  }
  function td(n, e) {
    var t = n.__index__,
      r = n.__last_index__,
      o = n.__text_cache__.slice(t, r);
    (this.schema = n.__schema__.toLowerCase()),
      (this.index = t + e),
      (this.lastIndex = r + e),
      (this.raw = o),
      (this.text = o),
      (this.url = o);
  }
  function mo(n, e) {
    var t = new td(n, e);
    return n.__compiled__[t.schema].normalize(t, n), t;
  }
  function oe(n, e) {
    if (!(this instanceof oe)) return new oe(n, e);
    e || (Kp(n) && ((e = n), (n = {}))),
      (this.__opts__ = po({}, Zl, e)),
      (this.__index__ = -1),
      (this.__last_index__ = -1),
      (this.__schema__ = ""),
      (this.__text_cache__ = ""),
      (this.__schemas__ = po({}, Zp, n)),
      (this.__compiled__ = {}),
      (this.__tlds__ = Qp),
      (this.__tlds_replaced__ = !1),
      (this.re = {}),
      $n(this);
  }
  (oe.prototype.add = function (e, t) {
    return (this.__schemas__[e] = t), $n(this), this;
  }),
    (oe.prototype.set = function (e) {
      return (this.__opts__ = po(this.__opts__, e)), this;
    }),
    (oe.prototype.test = function (e) {
      if (((this.__text_cache__ = e), (this.__index__ = -1), !e.length))
        return !1;
      var t, r, o, s, i, l, c, a, u;
      if (this.re.schema_test.test(e)) {
        for (
          c = this.re.schema_search, c.lastIndex = 0;
          (t = c.exec(e)) !== null;

        )
          if (((s = this.testSchemaAt(e, t[2], c.lastIndex)), s)) {
            (this.__schema__ = t[2]),
              (this.__index__ = t.index + t[1].length),
              (this.__last_index__ = t.index + t[0].length + s);
            break;
          }
      }
      return (
        this.__opts__.fuzzyLink &&
          this.__compiled__["http:"] &&
          ((a = e.search(this.re.host_fuzzy_test)),
          a >= 0 &&
            (this.__index__ < 0 || a < this.__index__) &&
            (r = e.match(
              this.__opts__.fuzzyIP
                ? this.re.link_fuzzy
                : this.re.link_no_ip_fuzzy,
            )) !== null &&
            ((i = r.index + r[1].length),
            (this.__index__ < 0 || i < this.__index__) &&
              ((this.__schema__ = ""),
              (this.__index__ = i),
              (this.__last_index__ = r.index + r[0].length)))),
        this.__opts__.fuzzyEmail &&
          this.__compiled__["mailto:"] &&
          ((u = e.indexOf("@")),
          u >= 0 &&
            (o = e.match(this.re.email_fuzzy)) !== null &&
            ((i = o.index + o[1].length),
            (l = o.index + o[0].length),
            (this.__index__ < 0 ||
              i < this.__index__ ||
              (i === this.__index__ && l > this.__last_index__)) &&
              ((this.__schema__ = "mailto:"),
              (this.__index__ = i),
              (this.__last_index__ = l)))),
        this.__index__ >= 0
      );
    }),
    (oe.prototype.pretest = function (e) {
      return this.re.pretest.test(e);
    }),
    (oe.prototype.testSchemaAt = function (e, t, r) {
      return this.__compiled__[t.toLowerCase()]
        ? this.__compiled__[t.toLowerCase()].validate(e, r, this)
        : 0;
    }),
    (oe.prototype.match = function (e) {
      var t = 0,
        r = [];
      this.__index__ >= 0 &&
        this.__text_cache__ === e &&
        (r.push(mo(this, t)), (t = this.__last_index__));
      for (var o = t ? e.slice(t) : e; this.test(o); )
        r.push(mo(this, t)),
          (o = o.slice(this.__last_index__)),
          (t += this.__last_index__);
      return r.length ? r : null;
    }),
    (oe.prototype.matchAtStart = function (e) {
      if (((this.__text_cache__ = e), (this.__index__ = -1), !e.length))
        return null;
      var t = this.re.schema_at_start.exec(e);
      if (!t) return null;
      var r = this.testSchemaAt(e, t[2], t[0].length);
      return r
        ? ((this.__schema__ = t[2]),
          (this.__index__ = t.index + t[1].length),
          (this.__last_index__ = t.index + t[0].length + r),
          mo(this, 0))
        : null;
    }),
    (oe.prototype.tlds = function (e, t) {
      return (
        (e = Array.isArray(e) ? e : [e]),
        t
          ? ((this.__tlds__ = this.__tlds__
              .concat(e)
              .sort()
              .filter(function (r, o, s) {
                return r !== s[o - 1];
              })
              .reverse()),
            $n(this),
            this)
          : ((this.__tlds__ = e.slice()),
            (this.__tlds_replaced__ = !0),
            $n(this),
            this)
      );
    }),
    (oe.prototype.normalize = function (e) {
      e.schema || (e.url = "http://" + e.url),
        e.schema === "mailto:" &&
          !/^mailto:/i.test(e.url) &&
          (e.url = "mailto:" + e.url);
    }),
    (oe.prototype.onCompile = function () {});
  var nd = oe;
  const rd = Pf(
    Object.freeze(
      Object.defineProperty(
        { __proto__: null, default: {} },
        Symbol.toStringTag,
        { value: "Module" },
      ),
    ),
  );
  var od = {
      options: {
        html: !1,
        xhtmlOut: !1,
        breaks: !1,
        langPrefix: "language-",
        linkify: !1,
        typographer: !1,
        quotes: "“”‘’",
        highlight: null,
        maxNesting: 100,
      },
      components: { core: {}, block: {}, inline: {} },
    },
    sd = {
      options: {
        html: !1,
        xhtmlOut: !1,
        breaks: !1,
        langPrefix: "language-",
        linkify: !1,
        typographer: !1,
        quotes: "“”‘’",
        highlight: null,
        maxNesting: 20,
      },
      components: {
        core: { rules: ["normalize", "block", "inline", "text_join"] },
        block: { rules: ["paragraph"] },
        inline: {
          rules: ["text"],
          rules2: ["balance_pairs", "fragments_join"],
        },
      },
    },
    id = {
      options: {
        html: !0,
        xhtmlOut: !0,
        breaks: !1,
        langPrefix: "language-",
        linkify: !1,
        typographer: !1,
        quotes: "“”‘’",
        highlight: null,
        maxNesting: 20,
      },
      components: {
        core: { rules: ["normalize", "block", "inline", "text_join"] },
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
            "paragraph",
          ],
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
            "text",
          ],
          rules2: ["balance_pairs", "emphasis", "fragments_join"],
        },
      },
    },
    Zt = R,
    ld = Nn,
    cd = uh,
    ad = Rh,
    ud = pp,
    fd = Up,
    hd = nd,
    st = wt,
    Ql = rd,
    pd = { default: od, zero: sd, commonmark: id },
    dd = /^(vbscript|javascript|file|data):/,
    md = /^data:image\/(gif|png|jpeg|webp);/;
  function gd(n) {
    var e = n.trim().toLowerCase();
    return dd.test(e) ? !!md.test(e) : !0;
  }
  var Xl = ["http:", "https:", "mailto:"];
  function bd(n) {
    var e = st.parse(n, !0);
    if (e.hostname && (!e.protocol || Xl.indexOf(e.protocol) >= 0))
      try {
        e.hostname = Ql.toASCII(e.hostname);
      } catch {}
    return st.encode(st.format(e));
  }
  function yd(n) {
    var e = st.parse(n, !0);
    if (e.hostname && (!e.protocol || Xl.indexOf(e.protocol) >= 0))
      try {
        e.hostname = Ql.toUnicode(e.hostname);
      } catch {}
    return st.decode(st.format(e), st.decode.defaultChars + "%");
  }
  function ae(n, e) {
    if (!(this instanceof ae)) return new ae(n, e);
    e || Zt.isString(n) || ((e = n || {}), (n = "default")),
      (this.inline = new fd()),
      (this.block = new ud()),
      (this.core = new ad()),
      (this.renderer = new cd()),
      (this.linkify = new hd()),
      (this.validateLink = gd),
      (this.normalizeLink = bd),
      (this.normalizeLinkText = yd),
      (this.utils = Zt),
      (this.helpers = Zt.assign({}, ld)),
      (this.options = {}),
      this.configure(n),
      e && this.set(e);
  }
  (ae.prototype.set = function (n) {
    return Zt.assign(this.options, n), this;
  }),
    (ae.prototype.configure = function (n) {
      var e = this,
        t;
      if (Zt.isString(n) && ((t = n), (n = pd[t]), !n))
        throw new Error('Wrong `markdown-it` preset "' + t + '", check name');
      if (!n) throw new Error("Wrong `markdown-it` preset, can't be empty");
      return (
        n.options && e.set(n.options),
        n.components &&
          Object.keys(n.components).forEach(function (r) {
            n.components[r].rules &&
              e[r].ruler.enableOnly(n.components[r].rules),
              n.components[r].rules2 &&
                e[r].ruler2.enableOnly(n.components[r].rules2);
          }),
        this
      );
    }),
    (ae.prototype.enable = function (n, e) {
      var t = [];
      Array.isArray(n) || (n = [n]),
        ["core", "block", "inline"].forEach(function (o) {
          t = t.concat(this[o].ruler.enable(n, !0));
        }, this),
        (t = t.concat(this.inline.ruler2.enable(n, !0)));
      var r = n.filter(function (o) {
        return t.indexOf(o) < 0;
      });
      if (r.length && !e)
        throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + r);
      return this;
    }),
    (ae.prototype.disable = function (n, e) {
      var t = [];
      Array.isArray(n) || (n = [n]),
        ["core", "block", "inline"].forEach(function (o) {
          t = t.concat(this[o].ruler.disable(n, !0));
        }, this),
        (t = t.concat(this.inline.ruler2.disable(n, !0)));
      var r = n.filter(function (o) {
        return t.indexOf(o) < 0;
      });
      if (r.length && !e)
        throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + r);
      return this;
    }),
    (ae.prototype.use = function (n) {
      var e = [this].concat(Array.prototype.slice.call(arguments, 1));
      return n.apply(n, e), this;
    }),
    (ae.prototype.parse = function (n, e) {
      if (typeof n != "string")
        throw new Error("Input data should be a String");
      var t = new this.core.State(n, this, e);
      return this.core.process(t), t.tokens;
    }),
    (ae.prototype.render = function (n, e) {
      return (
        (e = e || {}), this.renderer.render(this.parse(n, e), this.options, e)
      );
    }),
    (ae.prototype.parseInline = function (n, e) {
      var t = new this.core.State(n, this, e);
      return (t.inlineMode = !0), this.core.process(t), t.tokens;
    }),
    (ae.prototype.renderInline = function (n, e) {
      return (
        (e = e || {}),
        this.renderer.render(this.parseInline(n, e), this.options, e)
      );
    });
  var kd = ae,
    xd = kd;
  const wd = Bf(xd),
    go = new Ho({
      nodes: {
        doc: { content: "block+" },
        paragraph: {
          content: "inline*",
          group: "block",
          parseDOM: [{ tag: "p" }],
          toDOM() {
            return ["p", 0];
          },
        },
        blockquote: {
          content: "block+",
          group: "block",
          parseDOM: [{ tag: "blockquote" }],
          toDOM() {
            return ["blockquote", 0];
          },
        },
        horizontal_rule: {
          group: "block",
          parseDOM: [{ tag: "hr" }],
          toDOM() {
            return ["div", ["hr"]];
          },
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
            { tag: "h6", attrs: { level: 6 } },
          ],
          toDOM(n) {
            return ["h" + n.attrs.level, 0];
          },
        },
        code_block: {
          content: "text*",
          group: "block",
          code: !0,
          defining: !0,
          marks: "",
          attrs: { params: { default: "" } },
          parseDOM: [
            {
              tag: "pre",
              preserveWhitespace: "full",
              getAttrs: (n) => ({
                params: n.getAttribute("data-params") || "",
              }),
            },
          ],
          toDOM(n) {
            return [
              "pre",
              n.attrs.params ? { "data-params": n.attrs.params } : {},
              ["code", 0],
            ];
          },
        },
        ordered_list: {
          content: "list_item+",
          group: "block",
          attrs: { order: { default: 1 }, tight: { default: !1 } },
          parseDOM: [
            {
              tag: "ol",
              getAttrs(n) {
                return {
                  order: n.hasAttribute("start") ? +n.getAttribute("start") : 1,
                  tight: n.hasAttribute("data-tight"),
                };
              },
            },
          ],
          toDOM(n) {
            return [
              "ol",
              {
                start: n.attrs.order == 1 ? null : n.attrs.order,
                "data-tight": n.attrs.tight ? "true" : null,
              },
              0,
            ];
          },
        },
        bullet_list: {
          content: "list_item+",
          group: "block",
          attrs: { tight: { default: !1 } },
          parseDOM: [
            {
              tag: "ul",
              getAttrs: (n) => ({ tight: n.hasAttribute("data-tight") }),
            },
          ],
          toDOM(n) {
            return ["ul", { "data-tight": n.attrs.tight ? "true" : null }, 0];
          },
        },
        list_item: {
          content: "block+",
          defining: !0,
          parseDOM: [{ tag: "li" }],
          toDOM() {
            return ["li", 0];
          },
        },
        text: { group: "inline" },
        image: {
          inline: !0,
          attrs: { src: {}, alt: { default: null }, title: { default: null } },
          group: "inline",
          draggable: !0,
          parseDOM: [
            {
              tag: "img[src]",
              getAttrs(n) {
                return {
                  src: n.getAttribute("src"),
                  title: n.getAttribute("title"),
                  alt: n.getAttribute("alt"),
                };
              },
            },
          ],
          toDOM(n) {
            return ["img", n.attrs];
          },
        },
        hard_break: {
          inline: !0,
          group: "inline",
          selectable: !1,
          parseDOM: [{ tag: "br" }],
          toDOM() {
            return ["br"];
          },
        },
      },
      marks: {
        em: {
          parseDOM: [
            { tag: "i" },
            { tag: "em" },
            { style: "font-style=italic" },
            {
              style: "font-style=normal",
              clearMark: (n) => n.type.name == "em",
            },
          ],
          toDOM() {
            return ["em"];
          },
        },
        strong: {
          parseDOM: [
            { tag: "strong" },
            {
              tag: "b",
              getAttrs: (n) => n.style.fontWeight != "normal" && null,
            },
            {
              style: "font-weight=400",
              clearMark: (n) => n.type.name == "strong",
            },
            {
              style: "font-weight",
              getAttrs: (n) => /^(bold(er)?|[5-9]\d{2,})$/.test(n) && null,
            },
          ],
          toDOM() {
            return ["strong"];
          },
        },
        link: {
          attrs: { href: {}, title: { default: null } },
          inclusive: !1,
          parseDOM: [
            {
              tag: "a[href]",
              getAttrs(n) {
                return {
                  href: n.getAttribute("href"),
                  title: n.getAttribute("title"),
                };
              },
            },
          ],
          toDOM(n) {
            return ["a", n.attrs];
          },
        },
        code: {
          parseDOM: [{ tag: "code" }],
          toDOM() {
            return ["code"];
          },
        },
      },
    });
  function vd(n, e) {
    if (n.isText && e.isText && q.sameSet(n.marks, e.marks))
      return n.withText(n.text + e.text);
  }
  class Cd {
    constructor(e, t) {
      (this.schema = e),
        (this.tokenHandlers = t),
        (this.stack = [
          { type: e.topNodeType, attrs: null, content: [], marks: q.none },
        ]);
    }
    top() {
      return this.stack[this.stack.length - 1];
    }
    push(e) {
      this.stack.length && this.top().content.push(e);
    }
    addText(e) {
      if (!e) return;
      let t = this.top(),
        r = t.content,
        o = r[r.length - 1],
        s = this.schema.text(e, t.marks),
        i;
      o && (i = vd(o, s)) ? (r[r.length - 1] = i) : r.push(s);
    }
    openMark(e) {
      let t = this.top();
      t.marks = e.addToSet(t.marks);
    }
    closeMark(e) {
      let t = this.top();
      t.marks = e.removeFromSet(t.marks);
    }
    parseTokens(e) {
      for (let t = 0; t < e.length; t++) {
        let r = e[t],
          o = this.tokenHandlers[r.type];
        if (!o)
          throw new Error(
            "Token type `" + r.type + "` not supported by Markdown parser",
          );
        o(this, r, e, t);
      }
    }
    addNode(e, t, r) {
      let o = this.top(),
        s = e.createAndFill(t, r, o ? o.marks : []);
      return s ? (this.push(s), s) : null;
    }
    openNode(e, t) {
      this.stack.push({ type: e, attrs: t, content: [], marks: q.none });
    }
    closeNode() {
      let e = this.stack.pop();
      return this.addNode(e.type, e.attrs, e.content);
    }
  }
  function Yt(n, e, t, r) {
    return n.getAttrs
      ? n.getAttrs(e, t, r)
      : n.attrs instanceof Function
        ? n.attrs(e)
        : n.attrs;
  }
  function bo(n, e) {
    return (
      n.noCloseToken || e == "code_inline" || e == "code_block" || e == "fence"
    );
  }
  function ec(n) {
    return n[n.length - 1] ==
      `
`
      ? n.slice(0, n.length - 1)
      : n;
  }
  function yo() {}
  function Sd(n, e) {
    let t = Object.create(null);
    for (let r in e) {
      let o = e[r];
      if (o.block) {
        let s = n.nodeType(o.block);
        bo(o, r)
          ? (t[r] = (i, l, c, a) => {
              i.openNode(s, Yt(o, l, c, a)),
                i.addText(ec(l.content)),
                i.closeNode();
            })
          : ((t[r + "_open"] = (i, l, c, a) => i.openNode(s, Yt(o, l, c, a))),
            (t[r + "_close"] = (i) => i.closeNode()));
      } else if (o.node) {
        let s = n.nodeType(o.node);
        t[r] = (i, l, c, a) => i.addNode(s, Yt(o, l, c, a));
      } else if (o.mark) {
        let s = n.marks[o.mark];
        bo(o, r)
          ? (t[r] = (i, l, c, a) => {
              i.openMark(s.create(Yt(o, l, c, a))),
                i.addText(ec(l.content)),
                i.closeMark(s);
            })
          : ((t[r + "_open"] = (i, l, c, a) =>
              i.openMark(s.create(Yt(o, l, c, a)))),
            (t[r + "_close"] = (i) => i.closeMark(s)));
      } else if (o.ignore)
        bo(o, r)
          ? (t[r] = yo)
          : ((t[r + "_open"] = yo), (t[r + "_close"] = yo));
      else
        throw new RangeError("Unrecognized parsing spec " + JSON.stringify(o));
    }
    return (
      (t.text = (r, o) => r.addText(o.content)),
      (t.inline = (r, o) => r.parseTokens(o.children)),
      (t.softbreak = t.softbreak || ((r) => r.addText(" "))),
      t
    );
  }
  class Dd {
    constructor(e, t, r) {
      (this.schema = e),
        (this.tokenizer = t),
        (this.tokens = r),
        (this.tokenHandlers = Sd(e, r));
    }
    parse(e, t = {}) {
      let r = new Cd(this.schema, this.tokenHandlers),
        o;
      r.parseTokens(this.tokenizer.parse(e, t));
      do o = r.closeNode();
      while (r.stack.length);
      return o || this.schema.topNodeType.createAndFill();
    }
  }
  function tc(n, e) {
    for (; ++e < n.length; )
      if (n[e].type != "list_item_open") return n[e].hidden;
    return !1;
  }
  new Dd(go, wd("commonmark", { html: !1 }), {
    blockquote: { block: "blockquote" },
    paragraph: { block: "paragraph" },
    list_item: { block: "list_item" },
    bullet_list: {
      block: "bullet_list",
      getAttrs: (n, e, t) => ({ tight: tc(e, t) }),
    },
    ordered_list: {
      block: "ordered_list",
      getAttrs: (n, e, t) => ({
        order: +n.attrGet("start") || 1,
        tight: tc(e, t),
      }),
    },
    heading: {
      block: "heading",
      getAttrs: (n) => ({ level: +n.tag.slice(1) }),
    },
    code_block: { block: "code_block", noCloseToken: !0 },
    fence: {
      block: "code_block",
      getAttrs: (n) => ({ params: n.info || "" }),
      noCloseToken: !0,
    },
    hr: { node: "horizontal_rule" },
    image: {
      node: "image",
      getAttrs: (n) => ({
        src: n.attrGet("src"),
        title: n.attrGet("title") || null,
        alt: (n.children[0] && n.children[0].content) || null,
      }),
    },
    hardbreak: { node: "hard_break" },
    em: { mark: "em" },
    strong: { mark: "strong" },
    link: {
      mark: "link",
      getAttrs: (n) => ({
        href: n.attrGet("href"),
        title: n.attrGet("title") || null,
      }),
    },
    code_inline: { mark: "code", noCloseToken: !0 },
  });
  class Ed {
    constructor(e, t, r = {}) {
      (this.nodes = e), (this.marks = t), (this.options = r);
    }
    serialize(e, t = {}) {
      t = Object.assign({}, this.options, t);
      let r = new Ad(this.nodes, this.marks, t);
      return r.renderContent(e), r.out;
    }
  }
  class Ad {
    constructor(e, t, r) {
      (this.nodes = e),
        (this.marks = t),
        (this.options = r),
        (this.delim = ""),
        (this.out = ""),
        (this.closed = null),
        (this.inAutolink = void 0),
        (this.atBlockStart = !1),
        (this.inTightList = !1),
        typeof this.options.tightLists > "u" && (this.options.tightLists = !1),
        typeof this.options.hardBreakNodeName > "u" &&
          (this.options.hardBreakNodeName = "hard_break");
    }
    flushClose(e = 2) {
      if (this.closed) {
        if (
          (this.atBlank() ||
            (this.out += `
`),
          e > 1)
        ) {
          let t = this.delim,
            r = /\s+$/.exec(t);
          r && (t = t.slice(0, t.length - r[0].length));
          for (let o = 1; o < e; o++)
            this.out +=
              t +
              `
`;
        }
        this.closed = null;
      }
    }
    wrapBlock(e, t, r, o) {
      let s = this.delim;
      this.write(t ?? e),
        (this.delim += e),
        o(),
        (this.delim = s),
        this.closeBlock(r);
    }
    atBlank() {
      return /(^|\n)$/.test(this.out);
    }
    ensureNewLine() {
      this.atBlank() ||
        (this.out += `
`);
    }
    write(e) {
      this.flushClose(),
        this.delim && this.atBlank() && (this.out += this.delim),
        e && (this.out += e);
    }
    closeBlock(e) {
      this.closed = e;
    }
    text(e, t = !0) {
      let r = e.split(`
`);
      for (let o = 0; o < r.length; o++)
        this.write(),
          !t &&
            r[o][0] == "[" &&
            /(^|[^\\])\!$/.test(this.out) &&
            (this.out = this.out.slice(0, this.out.length - 1) + "\\!"),
          (this.out += t ? this.esc(r[o], this.atBlockStart) : r[o]),
          o != r.length - 1 &&
            (this.out += `
`);
    }
    render(e, t, r) {
      if (typeof t == "number") throw new Error("!");
      if (!this.nodes[e.type.name])
        throw new Error(
          "Token type `" + e.type.name + "` not supported by Markdown renderer",
        );
      this.nodes[e.type.name](this, e, t, r);
    }
    renderContent(e) {
      e.forEach((t, r, o) => this.render(t, e, o));
    }
    renderInline(e) {
      this.atBlockStart = !0;
      let t = [],
        r = "",
        o = (s, i, l) => {
          let c = s ? s.marks : [];
          s &&
            s.type.name === this.options.hardBreakNodeName &&
            (c = c.filter((d) => {
              if (l + 1 == e.childCount) return !1;
              let m = e.child(l + 1);
              return d.isInSet(m.marks) && (!m.isText || /\S/.test(m.text));
            }));
          let a = r;
          if (
            ((r = ""),
            s &&
              s.isText &&
              c.some((d) => {
                let m = this.marks[d.type.name];
                return m && m.expelEnclosingWhitespace && !d.isInSet(t);
              }))
          ) {
            let [d, m, g] = /^(\s*)(.*)$/m.exec(s.text);
            m && ((a += m), (s = g ? s.withText(g) : null), s || (c = t));
          }
          if (
            s &&
            s.isText &&
            c.some((d) => {
              let m = this.marks[d.type.name];
              return (
                m &&
                m.expelEnclosingWhitespace &&
                (l == e.childCount - 1 || !d.isInSet(e.child(l + 1).marks))
              );
            })
          ) {
            let [d, m, g] = /^(.*?)(\s*)$/m.exec(s.text);
            g && ((r = g), (s = m ? s.withText(m) : null), s || (c = t));
          }
          let u = c.length ? c[c.length - 1] : null,
            f = u && this.marks[u.type.name].escape === !1,
            h = c.length - (f ? 1 : 0);
          e: for (let d = 0; d < h; d++) {
            let m = c[d];
            if (!this.marks[m.type.name].mixable) break;
            for (let g = 0; g < t.length; g++) {
              let b = t[g];
              if (!this.marks[b.type.name].mixable) break;
              if (m.eq(b)) {
                d > g
                  ? (c = c
                      .slice(0, g)
                      .concat(m)
                      .concat(c.slice(g, d))
                      .concat(c.slice(d + 1, h)))
                  : g > d &&
                    (c = c
                      .slice(0, d)
                      .concat(c.slice(d + 1, g))
                      .concat(m)
                      .concat(c.slice(g, h)));
                continue e;
              }
            }
          }
          let p = 0;
          for (; p < Math.min(t.length, h) && c[p].eq(t[p]); ) ++p;
          for (; p < t.length; )
            this.text(this.markString(t.pop(), !1, e, l), !1);
          if ((a && this.text(a), s)) {
            for (; t.length < h; ) {
              let d = c[t.length];
              t.push(d),
                this.text(this.markString(d, !0, e, l), !1),
                (this.atBlockStart = !1);
            }
            f && s.isText
              ? this.text(
                  this.markString(u, !0, e, l) +
                    s.text +
                    this.markString(u, !1, e, l + 1),
                  !1,
                )
              : this.render(s, e, l),
              (this.atBlockStart = !1);
          }
          s != null && s.isText && s.nodeSize > 0 && (this.atBlockStart = !1);
        };
      e.forEach(o), o(null, 0, e.childCount), (this.atBlockStart = !1);
    }
    renderList(e, t, r) {
      this.closed && this.closed.type == e.type
        ? this.flushClose(3)
        : this.inTightList && this.flushClose(1);
      let o =
          typeof e.attrs.tight < "u" ? e.attrs.tight : this.options.tightLists,
        s = this.inTightList;
      (this.inTightList = o),
        e.forEach((i, l, c) => {
          c && o && this.flushClose(1),
            this.wrapBlock(t, r(c), e, () => this.render(i, e, c));
        }),
        (this.inTightList = s);
    }
    esc(e, t = !1) {
      return (
        (e = e.replace(/[`*\\~\[\]_]/g, (r, o) =>
          r == "_" &&
          o > 0 &&
          o + 1 < e.length &&
          e[o - 1].match(/\w/) &&
          e[o + 1].match(/\w/)
            ? r
            : "\\" + r,
        )),
        t &&
          (e = e
            .replace(/^[\-*+>]/, "\\$&")
            .replace(/^(\s*)(#{1,6})(\s|$)/, "$1\\$2$3")
            .replace(/^(\s*\d+)\.\s/, "$1\\. ")),
        this.options.escapeExtraCharacters &&
          (e = e.replace(this.options.escapeExtraCharacters, "\\$&")),
        e
      );
    }
    quote(e) {
      let t = e.indexOf('"') == -1 ? '""' : e.indexOf("'") == -1 ? "''" : "()";
      return t[0] + e + t[1];
    }
    repeat(e, t) {
      let r = "";
      for (let o = 0; o < t; o++) r += e;
      return r;
    }
    markString(e, t, r, o) {
      let s = this.marks[e.type.name],
        i = t ? s.open : s.close;
      return typeof i == "string" ? i : i(this, e, r, o);
    }
    getEnclosingWhitespace(e) {
      return {
        leading: (e.match(/^(\s+)/) || [void 0])[0],
        trailing: (e.match(/(\s+)$/) || [void 0])[0],
      };
    }
  }
  const _d = {
      blockquote(n, e) {
        n.wrapBlock("> ", null, e, () => n.renderContent(e));
      },
      code_block(n, e) {
        const t = e.textContent.match(/`{3,}/gm),
          r = t ? t.sort().slice(-1)[0] + "`" : "```";
        n.write(
          r +
            (e.attrs.params || "") +
            `
`,
        ),
          n.text(e.textContent, !1),
          n.write(`
`),
          n.write(r),
          n.closeBlock(e);
      },
      heading(n, e) {
        n.write(n.repeat("#", e.attrs.level) + " "),
          n.renderInline(e, !1),
          n.closeBlock(e);
      },
      horizontal_rule(n, e) {
        n.write(e.attrs.markup || "---"), n.closeBlock(e);
      },
      bullet_list(n, e) {
        n.renderList(e, "  ", () => (e.attrs.bullet || "*") + " ");
      },
      ordered_list(n, e) {
        let t = e.attrs.order || 1,
          r = String(t + e.childCount - 1).length,
          o = n.repeat(" ", r + 2);
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
        n.write(
          "![" +
            n.esc(e.attrs.alt || "") +
            "](" +
            e.attrs.src.replace(/[\(\)]/g, "\\$&") +
            (e.attrs.title
              ? ' "' + e.attrs.title.replace(/"/g, '\\"') + '"'
              : "") +
            ")",
        );
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
      },
    },
    Md = Object.values(
      Object.assign({
        "./nodes/addresses.js": el,
        "./nodes/call_to_action.js": tl,
        "./nodes/contacts.js": nl,
        "./nodes/example_callout.js": rl,
        "./nodes/information_callout.js": ol,
        "./nodes/warning_callout.js": sl,
      }),
    ),
    Td = Object.fromEntries(Md.map((n) => [n.name, n.toGovspeak])),
    qd = Object.assign(_d, Td),
    nc = new Ed(qd, {
      em: { open: "*", close: "*", mixable: !0, expelEnclosingWhitespace: !0 },
      strong: {
        open: "**",
        close: "**",
        mixable: !0,
        expelEnclosingWhitespace: !0,
      },
      link: {
        open(n, e, t, r) {
          return (n.inAutolink = Nd(e, t, r)), n.inAutolink ? "<" : "[";
        },
        close(n, e, t, r) {
          let { inAutolink: o } = n;
          return (
            (n.inAutolink = void 0),
            o
              ? ">"
              : "](" +
                e.attrs.href.replace(/[\(\)"]/g, "\\$&") +
                (e.attrs.title
                  ? ` "${e.attrs.title.replace(/"/g, '\\"')}"`
                  : "") +
                ")"
          );
        },
        mixable: !0,
      },
      code: {
        open(n, e, t, r) {
          return rc(t.child(r), -1);
        },
        close(n, e, t, r) {
          return rc(t.child(r - 1), 1);
        },
        escape: !1,
      },
    });
  function rc(n, e) {
    let t = /`+/g,
      r,
      o = 0;
    if (n.isText) for (; (r = t.exec(n.text)); ) o = Math.max(o, r[0].length);
    let s = o > 0 && e > 0 ? " `" : "`";
    for (let i = 0; i < o; i++) s += "`";
    return o > 0 && e < 0 && (s += " "), s;
  }
  function Nd(n, e, t) {
    if (n.attrs.title || !/^\w+:/.test(n.attrs.href)) return !1;
    let r = e.child(t);
    return !r.isText ||
      r.text != n.attrs.href ||
      r.marks[r.marks.length - 1] != n
      ? !1
      : t == e.childCount - 1 || !n.isInSet(e.child(t + 1).marks);
  }
  const Od = ["ol", 0],
    Rd = ["ul", 0],
    Id = ["li", 0],
    Ld = {
      attrs: { order: { default: 1 } },
      parseDOM: [
        {
          tag: "ol",
          getAttrs(n) {
            return {
              order: n.hasAttribute("start") ? +n.getAttribute("start") : 1,
            };
          },
        },
      ],
      toDOM(n) {
        return n.attrs.order == 1 ? Od : ["ol", { start: n.attrs.order }, 0];
      },
    },
    zd = {
      parseDOM: [{ tag: "ul" }],
      toDOM() {
        return Rd;
      },
    },
    Fd = {
      parseDOM: [{ tag: "li" }],
      toDOM() {
        return Id;
      },
      defining: !0,
    };
  function ko(n, e) {
    let t = {};
    for (let r in n) t[r] = n[r];
    for (let r in e) t[r] = e[r];
    return t;
  }
  function Bd(n, e, t) {
    return n.append({
      ordered_list: ko(Ld, { content: "list_item+", group: t }),
      bullet_list: ko(zd, { content: "list_item+", group: t }),
      list_item: ko(Fd, { content: e }),
    });
  }
  function xo(n, e = null) {
    return function (t, r) {
      let { $from: o, $to: s } = t.selection,
        i = o.blockRange(s),
        l = !1,
        c = i;
      if (!i) return !1;
      if (
        i.depth >= 2 &&
        o.node(i.depth - 1).type.compatibleContent(n) &&
        i.startIndex == 0
      ) {
        if (o.index(i.depth - 1) == 0) return !1;
        let u = t.doc.resolve(i.start - 2);
        (c = new sn(u, u, i.depth)),
          i.endIndex < i.parent.childCount &&
            (i = new sn(o, t.doc.resolve(s.end(i.depth)), i.depth)),
          (l = !0);
      }
      let a = nr(c, n, e, i);
      return a ? (r && r(Pd(t.tr, i, a, l, n).scrollIntoView()), !0) : !1;
    };
  }
  function Pd(n, e, t, r, o) {
    let s = y.empty;
    for (let u = t.length - 1; u >= 0; u--)
      s = y.from(t[u].type.create(t[u].attrs, s));
    n.step(
      new $(
        e.start - (r ? 2 : 0),
        e.end,
        e.start,
        e.end,
        new v(s, 0, 0),
        t.length,
        !0,
      ),
    );
    let i = 0;
    for (let u = 0; u < t.length; u++) t[u].type == o && (i = u + 1);
    let l = t.length - i,
      c = e.start + t.length - (r ? 2 : 0),
      a = e.parent;
    for (let u = e.startIndex, f = e.endIndex, h = !0; u < f; u++, h = !1)
      !h && at(n.doc, c, l) && (n.split(c, l), (c += 2 * l)),
        (c += a.child(u).nodeSize);
    return n;
  }
  function Vd(n, e) {
    return function (t, r) {
      let { $from: o, $to: s, node: i } = t.selection;
      if ((i && i.isBlock) || o.depth < 2 || !o.sameParent(s)) return !1;
      let l = o.node(-1);
      if (l.type != n) return !1;
      if (
        o.parent.content.size == 0 &&
        o.node(-1).childCount == o.indexAfter(-1)
      ) {
        if (
          o.depth == 3 ||
          o.node(-3).type != n ||
          o.index(-2) != o.node(-2).childCount - 1
        )
          return !1;
        if (r) {
          let f = y.empty,
            h = o.index(-1) ? 1 : o.index(-2) ? 2 : 3;
          for (let b = o.depth - h; b >= o.depth - 3; b--)
            f = y.from(o.node(b).copy(f));
          let p =
            o.indexAfter(-1) < o.node(-2).childCount
              ? 1
              : o.indexAfter(-2) < o.node(-3).childCount
                ? 2
                : 3;
          f = f.append(y.from(n.createAndFill()));
          let d = o.before(o.depth - (h - 1)),
            m = t.tr.replace(d, o.after(-p), new v(f, 4 - h, 0)),
            g = -1;
          m.doc.nodesBetween(d, m.doc.content.size, (b, k) => {
            if (g > -1) return !1;
            b.isTextblock && b.content.size == 0 && (g = k + 1);
          }),
            g > -1 && m.setSelection(T.near(m.doc.resolve(g))),
            r(m.scrollIntoView());
        }
        return !0;
      }
      let c = s.pos == o.end() ? l.contentMatchAt(0).defaultType : null,
        a = t.tr.delete(o.pos, s.pos),
        u = c ? [e ? { type: n, attrs: e } : null, { type: c }] : void 0;
      return at(a.doc, o.pos, 2, u)
        ? (r && r(a.split(o.pos, 2, u).scrollIntoView()), !0)
        : !1;
    };
  }
  function $d(n) {
    return function (e, t) {
      let { $from: r, $to: o } = e.selection,
        s = r.blockRange(o, (i) => i.childCount > 0 && i.firstChild.type == n);
      return s
        ? t
          ? r.node(s.depth - 1).type == n
            ? Ud(e, t, n, s)
            : Hd(e, t, s)
          : !0
        : !1;
    };
  }
  function Ud(n, e, t, r) {
    let o = n.tr,
      s = r.end,
      i = r.$to.end(r.depth);
    s < i &&
      (o.step(
        new $(
          s - 1,
          i,
          s,
          i,
          new v(y.from(t.create(null, r.parent.copy())), 1, 0),
          1,
          !0,
        ),
      ),
      (r = new sn(o.doc.resolve(r.$from.pos), o.doc.resolve(i), r.depth)));
    const l = _t(r);
    if (l == null) return !1;
    o.lift(r, l);
    let c = o.mapping.map(s, -1) - 1;
    return ut(o.doc, c) && o.join(c), e(o.scrollIntoView()), !0;
  }
  function Hd(n, e, t) {
    let r = n.tr,
      o = t.parent;
    for (let p = t.end, d = t.endIndex - 1, m = t.startIndex; d > m; d--)
      (p -= o.child(d).nodeSize), r.delete(p - 1, p + 1);
    let s = r.doc.resolve(t.start),
      i = s.nodeAfter;
    if (r.mapping.map(t.end) != t.start + s.nodeAfter.nodeSize) return !1;
    let l = t.startIndex == 0,
      c = t.endIndex == o.childCount,
      a = s.node(-1),
      u = s.index(-1);
    if (
      !a.canReplace(
        u + (l ? 0 : 1),
        u + 1,
        i.content.append(c ? y.empty : y.from(o)),
      )
    )
      return !1;
    let f = s.pos,
      h = f + i.nodeSize;
    return (
      r.step(
        new $(
          f - (l ? 1 : 0),
          h + (c ? 1 : 0),
          f + 1,
          h - 1,
          new v(
            (l ? y.empty : y.from(o.copy(y.empty))).append(
              c ? y.empty : y.from(o.copy(y.empty)),
            ),
            l ? 0 : 1,
            c ? 0 : 1,
          ),
          l ? 0 : 1,
        ),
      ),
      e(r.scrollIntoView()),
      !0
    );
  }
  function Gd(n) {
    return function (e, t) {
      let { $from: r, $to: o } = e.selection,
        s = r.blockRange(o, (a) => a.childCount > 0 && a.firstChild.type == n);
      if (!s) return !1;
      let i = s.startIndex;
      if (i == 0) return !1;
      let l = s.parent,
        c = l.child(i - 1);
      if (c.type != n) return !1;
      if (t) {
        let a = c.lastChild && c.lastChild.type == l.type,
          u = y.from(a ? n.create() : null),
          f = new v(
            y.from(n.create(null, y.from(l.type.create(null, u)))),
            a ? 3 : 1,
            0,
          ),
          h = s.start,
          p = s.end;
        t(
          e.tr.step(new $(h - (a ? 3 : 1), p, h, p, f, 1, !0)).scrollIntoView(),
        );
      }
      return !0;
    };
  }
  const wo = Object.entries(
    Object.assign({
      "./nodes/addresses.js": el,
      "./nodes/call_to_action.js": tl,
      "./nodes/contacts.js": nl,
      "./nodes/example_callout.js": rl,
      "./nodes/information_callout.js": ol,
      "./nodes/warning_callout.js": sl,
    }),
  ).map((n) => n[1]);
  let Qt = go.spec.nodes;
  (Qt = Bd(Qt, "paragraph block*", "block")),
    wo.forEach((n) => {
      Qt = Qt.addToEnd(n.name, n.schema);
    });
  const jd = go.spec.marks.remove("em"),
    oc = new Ho({ nodes: Qt, marks: jd });
  for (
    var $e = {
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
        222: "'",
      },
      Un = {
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
        222: '"',
      },
      Jd = typeof navigator < "u" && /Mac/.test(navigator.platform),
      Wd =
        typeof navigator < "u" &&
        /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(
          navigator.userAgent,
        ),
      U = 0;
    U < 10;
    U++
  )
    $e[48 + U] = $e[96 + U] = String(U);
  for (var U = 1; U <= 24; U++) $e[U + 111] = "F" + U;
  for (var U = 65; U <= 90; U++)
    ($e[U] = String.fromCharCode(U + 32)), (Un[U] = String.fromCharCode(U));
  for (var vo in $e) Un.hasOwnProperty(vo) || (Un[vo] = $e[vo]);
  function Kd(n) {
    var e =
        (Jd && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey) ||
        (Wd && n.shiftKey && n.key && n.key.length == 1) ||
        n.key == "Unidentified",
      t =
        (!e && n.key) ||
        (n.shiftKey ? Un : $e)[n.keyCode] ||
        n.key ||
        "Unidentified";
    return (
      t == "Esc" && (t = "Escape"),
      t == "Del" && (t = "Delete"),
      t == "Left" && (t = "ArrowLeft"),
      t == "Up" && (t = "ArrowUp"),
      t == "Right" && (t = "ArrowRight"),
      t == "Down" && (t = "ArrowDown"),
      t
    );
  }
  const Zd =
    typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
  function Yd(n) {
    let e = n.split(/-(?!$)/),
      t = e[e.length - 1];
    t == "Space" && (t = " ");
    let r, o, s, i;
    for (let l = 0; l < e.length - 1; l++) {
      let c = e[l];
      if (/^(cmd|meta|m)$/i.test(c)) i = !0;
      else if (/^a(lt)?$/i.test(c)) r = !0;
      else if (/^(c|ctrl|control)$/i.test(c)) o = !0;
      else if (/^s(hift)?$/i.test(c)) s = !0;
      else if (/^mod$/i.test(c)) Zd ? (i = !0) : (o = !0);
      else throw new Error("Unrecognized modifier name: " + c);
    }
    return (
      r && (t = "Alt-" + t),
      o && (t = "Ctrl-" + t),
      i && (t = "Meta-" + t),
      s && (t = "Shift-" + t),
      t
    );
  }
  function Qd(n) {
    let e = Object.create(null);
    for (let t in n) e[Yd(t)] = n[t];
    return e;
  }
  function Co(n, e, t = !0) {
    return (
      e.altKey && (n = "Alt-" + n),
      e.ctrlKey && (n = "Ctrl-" + n),
      e.metaKey && (n = "Meta-" + n),
      t && e.shiftKey && (n = "Shift-" + n),
      n
    );
  }
  function sc(n) {
    return new Me({ props: { handleKeyDown: ic(n) } });
  }
  function ic(n) {
    let e = Qd(n);
    return function (t, r) {
      let o = Kd(r),
        s,
        i = e[Co(o, r)];
      if (i && i(t.state, t.dispatch, t)) return !0;
      if (o.length == 1 && o != " ") {
        if (r.shiftKey) {
          let l = e[Co(o, r, !1)];
          if (l && l(t.state, t.dispatch, t)) return !0;
        }
        if (
          (r.shiftKey || r.altKey || r.metaKey || o.charCodeAt(0) > 127) &&
          (s = $e[r.keyCode]) &&
          s != o
        ) {
          let l = e[Co(s, r)];
          if (l && l(t.state, t.dispatch, t)) return !0;
        }
      }
      return !1;
    };
  }
  function Xd(n = {}) {
    return new Me({
      view(e) {
        return new em(e, n);
      },
    });
  }
  class em {
    constructor(e, t) {
      var r;
      (this.editorView = e),
        (this.cursorPos = null),
        (this.element = null),
        (this.timeout = -1),
        (this.width = (r = t.width) !== null && r !== void 0 ? r : 1),
        (this.color = t.color === !1 ? void 0 : t.color || "black"),
        (this.class = t.class),
        (this.handlers = ["dragover", "dragend", "drop", "dragleave"].map(
          (o) => {
            let s = (i) => {
              this[o](i);
            };
            return e.dom.addEventListener(o, s), { name: o, handler: s };
          },
        ));
    }
    destroy() {
      this.handlers.forEach(({ name: e, handler: t }) =>
        this.editorView.dom.removeEventListener(e, t),
      );
    }
    update(e, t) {
      this.cursorPos != null &&
        t.doc != e.state.doc &&
        (this.cursorPos > e.state.doc.content.size
          ? this.setCursor(null)
          : this.updateOverlay());
    }
    setCursor(e) {
      e != this.cursorPos &&
        ((this.cursorPos = e),
        e == null
          ? (this.element.parentNode.removeChild(this.element),
            (this.element = null))
          : this.updateOverlay());
    }
    updateOverlay() {
      let e = this.editorView.state.doc.resolve(this.cursorPos),
        t = !e.parent.inlineContent,
        r;
      if (t) {
        let l = e.nodeBefore,
          c = e.nodeAfter;
        if (l || c) {
          let a = this.editorView.nodeDOM(
            this.cursorPos - (l ? l.nodeSize : 0),
          );
          if (a) {
            let u = a.getBoundingClientRect(),
              f = l ? u.bottom : u.top;
            l &&
              c &&
              (f =
                (f +
                  this.editorView
                    .nodeDOM(this.cursorPos)
                    .getBoundingClientRect().top) /
                2),
              (r = {
                left: u.left,
                right: u.right,
                top: f - this.width / 2,
                bottom: f + this.width / 2,
              });
          }
        }
      }
      if (!r) {
        let l = this.editorView.coordsAtPos(this.cursorPos);
        r = {
          left: l.left - this.width / 2,
          right: l.left + this.width / 2,
          top: l.top,
          bottom: l.bottom,
        };
      }
      let o = this.editorView.dom.offsetParent;
      this.element ||
        ((this.element = o.appendChild(document.createElement("div"))),
        this.class && (this.element.className = this.class),
        (this.element.style.cssText =
          "position: absolute; z-index: 50; pointer-events: none;"),
        this.color && (this.element.style.backgroundColor = this.color)),
        this.element.classList.toggle("prosemirror-dropcursor-block", t),
        this.element.classList.toggle("prosemirror-dropcursor-inline", !t);
      let s, i;
      if (
        !o ||
        (o == document.body && getComputedStyle(o).position == "static")
      )
        (s = -pageXOffset), (i = -pageYOffset);
      else {
        let l = o.getBoundingClientRect();
        (s = l.left - o.scrollLeft), (i = l.top - o.scrollTop);
      }
      (this.element.style.left = r.left - s + "px"),
        (this.element.style.top = r.top - i + "px"),
        (this.element.style.width = r.right - r.left + "px"),
        (this.element.style.height = r.bottom - r.top + "px");
    }
    scheduleRemoval(e) {
      clearTimeout(this.timeout),
        (this.timeout = setTimeout(() => this.setCursor(null), e));
    }
    dragover(e) {
      if (!this.editorView.editable) return;
      let t = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }),
        r = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside),
        o = r && r.type.spec.disableDropCursor,
        s = typeof o == "function" ? o(this.editorView, t, e) : o;
      if (t && !s) {
        let i = t.pos;
        if (this.editorView.dragging && this.editorView.dragging.slice) {
          let l = cs(
            this.editorView.state.doc,
            i,
            this.editorView.dragging.slice,
          );
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
      (e.target == this.editorView.dom ||
        !this.editorView.dom.contains(e.relatedTarget)) &&
        this.setCursor(null);
    }
  }
  class z extends T {
    constructor(e) {
      super(e, e);
    }
    map(e, t) {
      let r = e.resolve(t.map(this.head));
      return z.valid(r) ? new z(r) : T.near(r);
    }
    content() {
      return v.empty;
    }
    eq(e) {
      return e instanceof z && e.head == this.head;
    }
    toJSON() {
      return { type: "gapcursor", pos: this.head };
    }
    static fromJSON(e, t) {
      if (typeof t.pos != "number")
        throw new RangeError("Invalid input for GapCursor.fromJSON");
      return new z(e.resolve(t.pos));
    }
    getBookmark() {
      return new So(this.anchor);
    }
    static valid(e) {
      let t = e.parent;
      if (t.isTextblock || !tm(e) || !nm(e)) return !1;
      let r = t.type.spec.allowGapCursor;
      if (r != null) return r;
      let o = t.contentMatchAt(e.index()).defaultType;
      return o && o.isTextblock;
    }
    static findGapCursorFrom(e, t, r = !1) {
      e: for (;;) {
        if (!r && z.valid(e)) return e;
        let o = e.pos,
          s = null;
        for (let i = e.depth; ; i--) {
          let l = e.node(i);
          if (t > 0 ? e.indexAfter(i) < l.childCount : e.index(i) > 0) {
            s = l.child(t > 0 ? e.indexAfter(i) : e.index(i) - 1);
            break;
          } else if (i == 0) return null;
          o += t;
          let c = e.doc.resolve(o);
          if (z.valid(c)) return c;
        }
        for (;;) {
          let i = t > 0 ? s.firstChild : s.lastChild;
          if (!i) {
            if (s.isAtom && !s.isText && !D.isSelectable(s)) {
              (e = e.doc.resolve(o + s.nodeSize * t)), (r = !1);
              continue e;
            }
            break;
          }
          (s = i), (o += t);
          let l = e.doc.resolve(o);
          if (z.valid(l)) return l;
        }
        return null;
      }
    }
  }
  (z.prototype.visible = !1),
    (z.findFrom = z.findGapCursorFrom),
    T.jsonID("gapcursor", z);
  class So {
    constructor(e) {
      this.pos = e;
    }
    map(e) {
      return new So(e.map(this.pos));
    }
    resolve(e) {
      let t = e.resolve(this.pos);
      return z.valid(t) ? new z(t) : T.near(t);
    }
  }
  function tm(n) {
    for (let e = n.depth; e >= 0; e--) {
      let t = n.index(e),
        r = n.node(e);
      if (t == 0) {
        if (r.type.spec.isolating) return !0;
        continue;
      }
      for (let o = r.child(t - 1); ; o = o.lastChild) {
        if (
          (o.childCount == 0 && !o.inlineContent) ||
          o.isAtom ||
          o.type.spec.isolating
        )
          return !0;
        if (o.inlineContent) return !1;
      }
    }
    return !0;
  }
  function nm(n) {
    for (let e = n.depth; e >= 0; e--) {
      let t = n.indexAfter(e),
        r = n.node(e);
      if (t == r.childCount) {
        if (r.type.spec.isolating) return !0;
        continue;
      }
      for (let o = r.child(t); ; o = o.firstChild) {
        if (
          (o.childCount == 0 && !o.inlineContent) ||
          o.isAtom ||
          o.type.spec.isolating
        )
          return !0;
        if (o.inlineContent) return !1;
      }
    }
    return !0;
  }
  function rm() {
    return new Me({
      props: {
        decorations: lm,
        createSelectionBetween(n, e, t) {
          return e.pos == t.pos && z.valid(t) ? new z(t) : null;
        },
        handleClick: sm,
        handleKeyDown: om,
        handleDOMEvents: { beforeinput: im },
      },
    });
  }
  const om = ic({
    ArrowLeft: Hn("horiz", -1),
    ArrowRight: Hn("horiz", 1),
    ArrowUp: Hn("vert", -1),
    ArrowDown: Hn("vert", 1),
  });
  function Hn(n, e) {
    const t = n == "vert" ? (e > 0 ? "down" : "up") : e > 0 ? "right" : "left";
    return function (r, o, s) {
      let i = r.selection,
        l = e > 0 ? i.$to : i.$from,
        c = i.empty;
      if (i instanceof I) {
        if (!s.endOfTextblock(t) || l.depth == 0) return !1;
        (c = !1), (l = r.doc.resolve(e > 0 ? l.after() : l.before()));
      }
      let a = z.findGapCursorFrom(l, e, c);
      return a ? (o && o(r.tr.setSelection(new z(a))), !0) : !1;
    };
  }
  function sm(n, e, t) {
    if (!n || !n.editable) return !1;
    let r = n.state.doc.resolve(e);
    if (!z.valid(r)) return !1;
    let o = n.posAtCoords({ left: t.clientX, top: t.clientY });
    return o && o.inside > -1 && D.isSelectable(n.state.doc.nodeAt(o.inside))
      ? !1
      : (n.dispatch(n.state.tr.setSelection(new z(r))), !0);
  }
  function im(n, e) {
    if (
      e.inputType != "insertCompositionText" ||
      !(n.state.selection instanceof z)
    )
      return !1;
    let { $from: t } = n.state.selection,
      r = t.parent
        .contentMatchAt(t.index())
        .findWrapping(n.state.schema.nodes.text);
    if (!r) return !1;
    let o = y.empty;
    for (let i = r.length - 1; i >= 0; i--)
      o = y.from(r[i].createAndFill(null, o));
    let s = n.state.tr.replace(t.pos, t.pos, new v(o, 0, 0));
    return s.setSelection(I.near(s.doc.resolve(t.pos + 1))), n.dispatch(s), !1;
  }
  function lm(n) {
    if (!(n.selection instanceof z)) return null;
    let e = document.createElement("div");
    return (
      (e.className = "ProseMirror-gapcursor"),
      B.create(n.doc, [le.widget(n.selection.head, e, { key: "gapcursor" })])
    );
  }
  const Gn = "ProseMirror-prompt";
  function lc(n) {
    let e = document.body.appendChild(document.createElement("div"));
    e.className = Gn;
    let t = (h) => {
      e.contains(h.target) || r();
    };
    setTimeout(() => window.addEventListener("mousedown", t), 50);
    let r = () => {
        window.removeEventListener("mousedown", t),
          e.parentNode && e.parentNode.removeChild(e);
      },
      o = [];
    for (let h in n.fields) o.push(n.fields[h].render());
    let s = document.createElement("button");
    (s.type = "submit"), (s.className = Gn + "-submit"), (s.textContent = "OK");
    let i = document.createElement("button");
    (i.type = "button"),
      (i.className = Gn + "-cancel"),
      (i.textContent = "Cancel"),
      i.addEventListener("click", r);
    let l = e.appendChild(document.createElement("form"));
    n.title &&
      (l.appendChild(document.createElement("h5")).textContent = n.title),
      o.forEach((h) => {
        l.appendChild(document.createElement("div")).appendChild(h);
      });
    let c = l.appendChild(document.createElement("div"));
    (c.className = Gn + "-buttons"),
      c.appendChild(s),
      c.appendChild(document.createTextNode(" ")),
      c.appendChild(i);
    let a = e.getBoundingClientRect();
    (e.style.top = (window.innerHeight - a.height) / 2 + "px"),
      (e.style.left = (window.innerWidth - a.width) / 2 + "px");
    let u = () => {
      let h = cm(n.fields, o);
      h && (r(), n.callback(h));
    };
    l.addEventListener("submit", (h) => {
      h.preventDefault(), u();
    }),
      l.addEventListener("keydown", (h) => {
        h.keyCode == 27
          ? (h.preventDefault(), r())
          : h.keyCode == 13 && !(h.ctrlKey || h.metaKey || h.shiftKey)
            ? (h.preventDefault(), u())
            : h.keyCode == 9 &&
              window.setTimeout(() => {
                e.contains(document.activeElement) || r();
              }, 500);
      });
    let f = l.elements[0];
    f && f.focus();
  }
  function cm(n, e) {
    let t = Object.create(null),
      r = 0;
    for (let o in n) {
      let s = n[o],
        i = e[r++],
        l = s.read(i),
        c = s.validate(l);
      if (c) return am(i, c), null;
      t[o] = s.clean(l);
    }
    return t;
  }
  function am(n, e) {
    let t = n.parentNode,
      r = t.appendChild(document.createElement("div"));
    (r.style.left = n.offsetLeft + n.offsetWidth + 2 + "px"),
      (r.style.top = n.offsetTop - 5 + "px"),
      (r.className = "ProseMirror-invalid"),
      (r.textContent = e),
      setTimeout(() => t.removeChild(r), 1500);
  }
  class um {
    constructor(e) {
      this.options = e;
    }
    read(e) {
      return e.value;
    }
    validateType(e) {
      return null;
    }
    validate(e) {
      return !e && this.options.required
        ? "Required field"
        : this.validateType(e) ||
            (this.options.validate ? this.options.validate(e) : null);
    }
    clean(e) {
      return this.options.clean ? this.options.clean(e) : e;
    }
  }
  class Xt extends um {
    render() {
      let e = document.createElement("input");
      return (
        (e.type = "text"),
        (e.placeholder = this.options.label),
        (e.value = this.options.value || ""),
        (e.autocomplete = "off"),
        e
      );
    }
  }
  function cc(n, e) {
    let t = n.selection.$from;
    for (let r = t.depth; r >= 0; r--) {
      let o = t.index(r);
      if (t.node(r).canReplaceWith(o, o, e)) return !0;
    }
    return !1;
  }
  function fm(n) {
    return new pe({
      title: "Insert image",
      label: "Image",
      enable(e) {
        return cc(e, n);
      },
      run(e, t, r) {
        let { from: o, to: s } = e.selection,
          i = null;
        e.selection instanceof D &&
          e.selection.node.type == n &&
          (i = e.selection.node.attrs),
          lc({
            title: "Insert image",
            fields: {
              src: new Xt({
                label: "Location",
                required: !0,
                value: i && i.src,
              }),
              title: new Xt({ label: "Title", value: i && i.title }),
              alt: new Xt({
                label: "Description",
                value: i ? i.alt : e.doc.textBetween(o, s, " "),
              }),
            },
            callback(l) {
              r.dispatch(r.state.tr.replaceSelectionWith(n.createAndFill(l))),
                r.focus();
            },
          });
      },
    });
  }
  function ac(n, e) {
    let t = { label: e.title, run: n };
    for (let r in e) t[r] = e[r];
    return (
      !e.enable &&
        !e.select &&
        (t[e.enable ? "enable" : "select"] = (r) => n(r)),
      new pe(t)
    );
  }
  function Do(n, e) {
    let { from: t, $from: r, to: o, empty: s } = n.selection;
    return s
      ? !!e.isInSet(n.storedMarks || r.marks())
      : n.doc.rangeHasMark(t, o, e);
  }
  function Eo(n, e) {
    let t = {
      active(r) {
        return Do(r, n);
      },
    };
    for (let r in e) t[r] = e[r];
    return ac(Fe(n), t);
  }
  function hm(n) {
    return new pe({
      title: "Add or remove link",
      icon: ce.link,
      active(e) {
        return Do(e, n);
      },
      enable(e) {
        return !e.selection.empty;
      },
      run(e, t, r) {
        if (Do(e, n)) return Fe(n)(e, t), !0;
        lc({
          title: "Create a link",
          fields: {
            href: new Xt({ label: "Link target", required: !0 }),
            title: new Xt({ label: "Title" }),
          },
          callback(o) {
            Fe(n, o)(r.state, r.dispatch), r.focus();
          },
        });
      },
    });
  }
  function uc(n, e) {
    return ac(xo(n, e.attrs), e);
  }
  function fc(n) {
    let e = {},
      t;
    (t = n.marks.strong) &&
      (e.toggleStrong = Eo(t, {
        title: "Toggle strong style",
        icon: ce.strong,
      })),
      (t = n.marks.em) &&
        (e.toggleEm = Eo(t, { title: "Toggle emphasis", icon: ce.em })),
      (t = n.marks.code) &&
        (e.toggleCode = Eo(t, { title: "Toggle code font", icon: ce.code })),
      (t = n.marks.link) && (e.toggleLink = hm(t));
    let r;
    if (
      ((r = n.nodes.image) && (e.insertImage = fm(r)),
      (r = n.nodes.bullet_list) &&
        (e.wrapBulletList = uc(r, {
          title: "Wrap in bullet list",
          icon: ce.bulletList,
        })),
      (r = n.nodes.ordered_list) &&
        (e.wrapOrderedList = uc(r, {
          title: "Wrap in ordered list",
          icon: ce.orderedList,
        })),
      (r = n.nodes.blockquote) &&
        (e.wrapBlockQuote = jt(r, {
          title: "Wrap in block quote",
          icon: ce.blockquote,
        })),
      (r = n.nodes.paragraph) &&
        (e.makeParagraph = Jt(r, {
          title: "Change to paragraph",
          label: "Plain",
        })),
      (r = n.nodes.code_block) &&
        (e.makeCodeBlock = Jt(r, {
          title: "Change to code block",
          label: "Code",
        })),
      (r = n.nodes.heading))
    )
      for (let s = 1; s <= 10; s++)
        e["makeHead" + s] = Jt(r, {
          title: "Change to heading " + s,
          label: "Level " + s,
          attrs: { level: s },
        });
    if ((r = n.nodes.horizontal_rule)) {
      let s = r;
      e.insertHorizontalRule = new pe({
        title: "Insert horizontal rule",
        label: "Horizontal rule",
        enable(i) {
          return cc(i, s);
        },
        run(i, l) {
          l(i.tr.replaceSelectionWith(s.create()));
        },
      });
    }
    let o = (s) => s.filter((i) => i);
    return (
      (e.insertMenu = new Ki(o([e.insertImage, e.insertHorizontalRule]), {
        label: "Insert",
      })),
      (e.typeMenu = new Ki(
        o([
          e.makeParagraph,
          e.makeCodeBlock,
          e.makeHead1 &&
            new mf(
              o([
                e.makeHead1,
                e.makeHead2,
                e.makeHead3,
                e.makeHead4,
                e.makeHead5,
                e.makeHead6,
              ]),
              { label: "Heading" },
            ),
        ]),
        { label: "Type..." },
      )),
      (e.inlineMenu = [
        o([e.toggleStrong, e.toggleEm, e.toggleCode, e.toggleLink]),
      ]),
      (e.blockMenu = [
        o([e.wrapBulletList, e.wrapOrderedList, e.wrapBlockQuote, yf, kf, xf]),
      ]),
      (e.fullMenu = e.inlineMenu.concat(
        [[e.insertMenu, e.typeMenu]],
        [[wf, vf]],
        e.blockMenu,
      )),
      e
    );
  }
  const hc =
    typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
  function pm(n, e) {
    let t = {},
      r;
    function o(s, i) {
      if (e) {
        let l = e[s];
        if (l === !1) return;
        l && (s = l);
      }
      t[s] = i;
    }
    if (
      (o("Mod-z", En),
      o("Shift-Mod-z", $t),
      o("Backspace", qf),
      hc || o("Mod-y", $t),
      o("Alt-ArrowUp", Or),
      o("Alt-ArrowDown", Hu),
      o("Mod-BracketLeft", Rr),
      o("Escape", Lr),
      (r = n.marks.strong) && (o("Mod-b", Fe(r)), o("Mod-B", Fe(r))),
      (r = n.marks.em) && (o("Mod-i", Fe(r)), o("Mod-I", Fe(r))),
      (r = n.marks.code) && o("Mod-`", Fe(r)),
      (r = n.nodes.bullet_list) && o("Shift-Ctrl-8", xo(r)),
      (r = n.nodes.ordered_list) && o("Shift-Ctrl-9", xo(r)),
      (r = n.nodes.blockquote) && o("Ctrl->", zr(r)),
      (r = n.nodes.hard_break))
    ) {
      let s = r,
        i = Cn(
          Fi,
          (l, c) => (
            c && c(l.tr.replaceSelectionWith(s.create()).scrollIntoView()), !0
          ),
        );
      o("Mod-Enter", i), o("Shift-Enter", i), hc && o("Ctrl-Enter", i);
    }
    if (
      ((r = n.nodes.list_item) &&
        (o("Enter", Vd(r)), o("Mod-[", $d(r)), o("Mod-]", Gd(r))),
      (r = n.nodes.paragraph) && o("Shift-Ctrl-0", vn(r)),
      (r = n.nodes.code_block) && o("Shift-Ctrl-\\", vn(r)),
      (r = n.nodes.heading))
    )
      for (let s = 1; s <= 6; s++) o("Shift-Ctrl-" + s, vn(r, { level: s }));
    if ((r = n.nodes.horizontal_rule)) {
      let s = r;
      o(
        "Mod-_",
        (i, l) => (
          l && l(i.tr.replaceSelectionWith(s.create()).scrollIntoView()), !0
        ),
      );
    }
    return t;
  }
  function dm(n) {
    return nt(/^\s*>\s$/, n);
  }
  function mm(n) {
    return nt(
      /^(\d+)\.\s$/,
      n,
      (e) => ({ order: +e[1] }),
      (e, t) => t.childCount + t.attrs.order == +e[1],
    );
  }
  function gm(n) {
    return nt(/^\s*([-+*])\s$/, n);
  }
  function bm(n) {
    return _n(/^```$/, n);
  }
  function ym(n, e) {
    return _n(new RegExp("^(#{1," + e + "})\\s$"), n, (t) => ({
      level: t[1].length,
    }));
  }
  function km(n) {
    let e = Ff.concat(Of, Nf),
      t;
    return (
      (t = n.nodes.blockquote) && e.push(dm(t)),
      (t = n.nodes.ordered_list) && e.push(mm(t)),
      (t = n.nodes.bullet_list) && e.push(gm(t)),
      (t = n.nodes.code_block) && e.push(bm(t)),
      (t = n.nodes.heading) && e.push(ym(t, 6)),
      Qi({ rules: e })
    );
  }
  function xm(n) {
    let e = [km(n.schema), sc(pm(n.schema, n.mapKeys)), sc(tf), Xd(), rm()];
    return (
      n.menuBar !== !1 &&
        e.push(
          Sf({
            floating: n.floatingMenu !== !1,
            content: n.menuContent || fc(n.schema).fullMenu,
          }),
        ),
      n.history !== !1 && e.push(uf()),
      e.concat(
        new Me({
          props: { attributes: { class: "ProseMirror-example-setup-style" } },
        }),
      )
    );
  }
  const wm = (n) => {
      const e = fc(n);
      return (
        e.typeMenu.content[2].content.shift(),
        wo.forEach((t) => {
          t.buildMenu({ menu: e, schema: n });
        }),
        e.fullMenu
      );
    },
    vm = (n) => {
      const e = wo.flatMap((t) => t.inputRules(n));
      return Qi({ rules: e });
    },
    Cm = (n) => {
      n.menuContent = wm(n.schema);
      const e = xm(n);
      return (
        e.pop(),
        e.push(new Me({ props: { attributes: { class: "govspeak" } } })),
        e.push(vm(n.schema)),
        e
      );
    };
  class Sm {
    constructor(e, t, r) {
      let o = dt.create({
        doc: it.fromSchema(oc).parse(e),
        plugins: Cm({ schema: oc }),
      });
      (window.view = new Iu(t, {
        state: o,
        dispatchTransaction(s) {
          let i = view.state.apply(s);
          view.updateState(i), (r.value = nc.serialize(window.view.state.doc));
        },
      })),
        (r.value = nc.serialize(window.view.state.doc));
    }
  }
  window.GovspeakVisualEditor = Sm;
});
