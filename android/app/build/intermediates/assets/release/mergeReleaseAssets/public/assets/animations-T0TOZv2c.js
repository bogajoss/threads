import {
  a as Jn,
  i as Ur,
  n as Wr,
  r as _r,
} from "./rolldown-runtime-BaZ8gS7u.js";
import { E as Kr, d as $r } from "./framework-CsA6nn9m.js";
var v = Jn(Kr(), 1),
  ti = (0, v.createContext)({});
function et(t) {
  const e = (0, v.useRef)(null);
  return (e.current === null && (e.current = t()), e.current);
}
var Qn = typeof window < "u",
  re = Qn ? v.useLayoutEffect : v.useEffect,
  oe = (0, v.createContext)(null);
function ei(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function ii(t, e) {
  const i = t.indexOf(e);
  i > -1 && t.splice(i, 1);
}
var X = (t, e, i) => (i > e ? e : i < t ? t : i),
  ae = () => {},
  it = () => {},
  Z = {},
  ts = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
function es(t) {
  return typeof t == "object" && t !== null;
}
var is = (t) => /^0[^.\s]+$/u.test(t);
function ni(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
var W = (t) => t,
  zr = (t, e) => (i) => e(t(i)),
  Ot = (...t) => t.reduce(zr),
  kt = (t, e, i) => {
    const n = e - t;
    return n === 0 ? 1 : (i - t) / n;
  },
  si = class {
    constructor() {
      this.subscriptions = [];
    }
    add(t) {
      return (ei(this.subscriptions, t), () => ii(this.subscriptions, t));
    }
    notify(t, e, i) {
      const n = this.subscriptions.length;
      if (n)
        if (n === 1) this.subscriptions[0](t, e, i);
        else
          for (let s = 0; s < n; s++) {
            const o = this.subscriptions[s];
            o && o(t, e, i);
          }
    }
    getSize() {
      return this.subscriptions.length;
    }
    clear() {
      this.subscriptions.length = 0;
    }
  },
  H = (t) => t * 1e3,
  U = (t) => t / 1e3;
function ns(t, e) {
  return e ? t * (1e3 / e) : 0;
}
var ss = (t, e, i) =>
    (((1 - 3 * i + 3 * e) * t + (3 * i - 6 * e)) * t + 3 * e) * t,
  Hr = 1e-7,
  Gr = 12;
function Xr(t, e, i, n, s) {
  let o,
    r,
    a = 0;
  do ((r = e + (i - e) / 2), (o = ss(r, n, s) - t), o > 0 ? (i = r) : (e = r));
  while (Math.abs(o) > Hr && ++a < Gr);
  return r;
}
function Nt(t, e, i, n) {
  if (t === e && i === n) return W;
  const s = (o) => Xr(o, 0, 1, t, i);
  return (o) => (o === 0 || o === 1 ? o : ss(s(o), e, n));
}
var rs = (t) => (e) => (e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2),
  os = (t) => (e) => 1 - t(1 - e),
  as = Nt(0.33, 1.53, 0.69, 0.99),
  ri = os(as),
  ls = rs(ri),
  us = (t) =>
    (t *= 2) < 1 ? 0.5 * ri(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))),
  oi = (t) => 1 - Math.sin(Math.acos(t)),
  cs = os(oi),
  hs = rs(oi),
  Yr = Nt(0.42, 0, 1, 1),
  qr = Nt(0, 0, 0.58, 1),
  fs = Nt(0.42, 0, 0.58, 1),
  Zr = (t) => Array.isArray(t) && typeof t[0] != "number",
  ds = (t) => Array.isArray(t) && typeof t[0] == "number",
  ki = {
    linear: W,
    easeIn: Yr,
    easeInOut: fs,
    easeOut: qr,
    circIn: oi,
    circInOut: hs,
    circOut: cs,
    backIn: ri,
    backInOut: ls,
    backOut: as,
    anticipate: us,
  },
  Jr = (t) => typeof t == "string",
  Ii = (t) => {
    if (ds(t)) {
      it(
        t.length === 4,
        "Cubic bezier arrays must contain four numerical values.",
        "cubic-bezier-length",
      );
      const [e, i, n, s] = t;
      return Nt(e, i, n, s);
    } else if (Jr(t))
      return (
        it(
          ki[t] !== void 0,
          `Invalid easing type '${t}'`,
          "invalid-easing-type",
        ),
        ki[t]
      );
    return t;
  },
  _t = [
    "setup",
    "read",
    "resolveKeyframes",
    "preUpdate",
    "update",
    "preRender",
    "render",
    "postRender",
  ],
  z = { value: null, addProjectionMetrics: null };
function Qr(t, e) {
  let i = new Set(),
    n = new Set(),
    s = !1,
    o = !1;
  const r = new WeakSet();
  let a = { delta: 0, timestamp: 0, isProcessing: !1 },
    l = 0;
  function c(h) {
    (r.has(h) && (u.schedule(h), t()), l++, h(a));
  }
  const u = {
    schedule: (h, f = !1, d = !1) => {
      const m = d && s ? i : n;
      return (f && r.add(h), m.has(h) || m.add(h), h);
    },
    cancel: (h) => {
      (n.delete(h), r.delete(h));
    },
    process: (h) => {
      if (((a = h), s)) {
        o = !0;
        return;
      }
      ((s = !0),
        ([i, n] = [n, i]),
        i.forEach(c),
        e && z.value && z.value.frameloop[e].push(l),
        (l = 0),
        i.clear(),
        (s = !1),
        o && ((o = !1), u.process(h)));
    },
  };
  return u;
}
var to = 40;
function ms(t, e) {
  let i = !1,
    n = !0;
  const s = { delta: 0, timestamp: 0, isProcessing: !1 },
    o = () => (i = !0),
    r = _t.reduce((y, S) => ((y[S] = Qr(o, e ? S : void 0)), y), {}),
    {
      setup: a,
      read: l,
      resolveKeyframes: c,
      preUpdate: u,
      update: h,
      preRender: f,
      render: d,
      postRender: m,
    } = r,
    T = () => {
      const y = Z.useManualTiming ? s.timestamp : performance.now();
      ((i = !1),
        Z.useManualTiming ||
          (s.delta = n ? 1e3 / 60 : Math.max(Math.min(y - s.timestamp, to), 1)),
        (s.timestamp = y),
        (s.isProcessing = !0),
        a.process(s),
        l.process(s),
        c.process(s),
        u.process(s),
        h.process(s),
        f.process(s),
        d.process(s),
        m.process(s),
        (s.isProcessing = !1),
        i && e && ((n = !1), t(T)));
    },
    g = () => {
      ((i = !0), (n = !0), s.isProcessing || t(T));
    };
  return {
    schedule: _t.reduce((y, S) => {
      const b = r[S];
      return (
        (y[S] = (V, E = !1, P = !1) => (i || g(), b.schedule(V, E, P))),
        y
      );
    }, {}),
    cancel: (y) => {
      for (let S = 0; S < _t.length; S++) r[_t[S]].cancel(y);
    },
    state: s,
    steps: r,
  };
}
var {
    schedule: C,
    cancel: J,
    state: I,
    steps: de,
  } = ms(typeof requestAnimationFrame < "u" ? requestAnimationFrame : W, !0),
  Ht;
function eo() {
  Ht = void 0;
}
var F = {
    now: () => (
      Ht === void 0 &&
        F.set(
          I.isProcessing || Z.useManualTiming ? I.timestamp : performance.now(),
        ),
      Ht
    ),
    set: (t) => {
      ((Ht = t), queueMicrotask(eo));
    },
  },
  ht = { layout: 0, mainThread: 0, waapi: 0 },
  ps = (t) => (e) => typeof e == "string" && e.startsWith(t),
  vs = ps("--"),
  io = ps("var(--"),
  ai = (t) => (io(t) ? no.test(t.split("/*")[0].trim()) : !1),
  no =
    /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function Bi(t) {
  return typeof t != "string" ? !1 : t.split("/*")[0].includes("var(--");
}
var Pt = {
    test: (t) => typeof t == "number",
    parse: parseFloat,
    transform: (t) => t,
  },
  It = { ...Pt, transform: (t) => X(0, 1, t) },
  Kt = { ...Pt, default: 1 },
  Mt = (t) => Math.round(t * 1e5) / 1e5,
  li = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function so(t) {
  return t == null;
}
var ro =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  ui = (t, e) => (i) =>
    !!(
      (typeof i == "string" && ro.test(i) && i.startsWith(t)) ||
      (e && !so(i) && Object.prototype.hasOwnProperty.call(i, e))
    ),
  gs = (t, e, i) => (n) => {
    if (typeof n != "string") return n;
    const [s, o, r, a] = n.match(li);
    return {
      [t]: parseFloat(s),
      [e]: parseFloat(o),
      [i]: parseFloat(r),
      alpha: a !== void 0 ? parseFloat(a) : 1,
    };
  },
  oo = (t) => X(0, 255, t),
  me = { ...Pt, transform: (t) => Math.round(oo(t)) },
  ut = {
    test: ui("rgb", "red"),
    parse: gs("red", "green", "blue"),
    transform: ({ red: t, green: e, blue: i, alpha: n = 1 }) =>
      "rgba(" +
      me.transform(t) +
      ", " +
      me.transform(e) +
      ", " +
      me.transform(i) +
      ", " +
      Mt(It.transform(n)) +
      ")",
  };
function ao(t) {
  let e = "",
    i = "",
    n = "",
    s = "";
  return (
    t.length > 5
      ? ((e = t.substring(1, 3)),
        (i = t.substring(3, 5)),
        (n = t.substring(5, 7)),
        (s = t.substring(7, 9)))
      : ((e = t.substring(1, 2)),
        (i = t.substring(2, 3)),
        (n = t.substring(3, 4)),
        (s = t.substring(4, 5)),
        (e += e),
        (i += i),
        (n += n),
        (s += s)),
    {
      red: parseInt(e, 16),
      green: parseInt(i, 16),
      blue: parseInt(n, 16),
      alpha: s ? parseInt(s, 16) / 255 : 1,
    }
  );
}
var Ee = { test: ui("#"), parse: ao, transform: ut.transform },
  Ut = (t) => ({
    test: (e) =>
      typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
    parse: parseFloat,
    transform: (e) => `${e}${t}`,
  }),
  Q = Ut("deg"),
  G = Ut("%"),
  x = Ut("px"),
  lo = Ut("vh"),
  uo = Ut("vw"),
  Fi = {
    ...G,
    parse: (t) => G.parse(t) / 100,
    transform: (t) => G.transform(t * 100),
  },
  vt = {
    test: ui("hsl", "hue"),
    parse: gs("hue", "saturation", "lightness"),
    transform: ({ hue: t, saturation: e, lightness: i, alpha: n = 1 }) =>
      "hsla(" +
      Math.round(t) +
      ", " +
      G.transform(Mt(e)) +
      ", " +
      G.transform(Mt(i)) +
      ", " +
      Mt(It.transform(n)) +
      ")",
  },
  R = {
    test: (t) => ut.test(t) || Ee.test(t) || vt.test(t),
    parse: (t) =>
      ut.test(t) ? ut.parse(t) : vt.test(t) ? vt.parse(t) : Ee.parse(t),
    transform: (t) =>
      typeof t == "string"
        ? t
        : t.hasOwnProperty("red")
          ? ut.transform(t)
          : vt.transform(t),
    getAnimatableNone: (t) => {
      const e = R.parse(t);
      return ((e.alpha = 0), R.transform(e));
    },
  },
  co =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function ho(t) {
  return (
    isNaN(t) &&
    typeof t == "string" &&
    (t.match(li)?.length || 0) + (t.match(co)?.length || 0) > 0
  );
}
var ys = "number",
  xs = "color",
  fo = "var",
  mo = "var(",
  ji = "${}",
  po =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Bt(t) {
  const e = t.toString(),
    i = [],
    n = { color: [], number: [], var: [] },
    s = [];
  let o = 0;
  return {
    values: i,
    split: e
      .replace(
        po,
        (r) => (
          R.test(r)
            ? (n.color.push(o), s.push(xs), i.push(R.parse(r)))
            : r.startsWith(mo)
              ? (n.var.push(o), s.push(fo), i.push(r))
              : (n.number.push(o), s.push(ys), i.push(parseFloat(r))),
          ++o,
          ji
        ),
      )
      .split(ji),
    indexes: n,
    types: s,
  };
}
function Ts(t) {
  return Bt(t).values;
}
function ws(t) {
  const { split: e, types: i } = Bt(t),
    n = e.length;
  return (s) => {
    let o = "";
    for (let r = 0; r < n; r++)
      if (((o += e[r]), s[r] !== void 0)) {
        const a = i[r];
        a === ys
          ? (o += Mt(s[r]))
          : a === xs
            ? (o += R.transform(s[r]))
            : (o += s[r]);
      }
    return o;
  };
}
var vo = (t) =>
  typeof t == "number" ? 0 : R.test(t) ? R.getAnimatableNone(t) : t;
function go(t) {
  const e = Ts(t);
  return ws(t)(e.map(vo));
}
var nt = { test: ho, parse: Ts, createTransformer: ws, getAnimatableNone: go };
function pe(t, e, i) {
  return (
    i < 0 && (i += 1),
    i > 1 && (i -= 1),
    i < 1 / 6
      ? t + (e - t) * 6 * i
      : i < 1 / 2
        ? e
        : i < 2 / 3
          ? t + (e - t) * (2 / 3 - i) * 6
          : t
  );
}
function yo({ hue: t, saturation: e, lightness: i, alpha: n }) {
  ((t /= 360), (e /= 100), (i /= 100));
  let s = 0,
    o = 0,
    r = 0;
  if (!e) s = o = r = i;
  else {
    const a = i < 0.5 ? i * (1 + e) : i + e - i * e,
      l = 2 * i - a;
    ((s = pe(l, a, t + 1 / 3)), (o = pe(l, a, t)), (r = pe(l, a, t - 1 / 3)));
  }
  return {
    red: Math.round(s * 255),
    green: Math.round(o * 255),
    blue: Math.round(r * 255),
    alpha: n,
  };
}
function Qt(t, e) {
  return (i) => (i > 0 ? e : t);
}
var D = (t, e, i) => t + (e - t) * i,
  ve = (t, e, i) => {
    const n = t * t,
      s = i * (e * e - n) + n;
    return s < 0 ? 0 : Math.sqrt(s);
  },
  xo = [Ee, ut, vt],
  To = (t) => xo.find((e) => e.test(t));
function Oi(t) {
  const e = To(t);
  if (
    (ae(
      !!e,
      `'${t}' is not an animatable color. Use the equivalent color code instead.`,
      "color-not-animatable",
    ),
    !e)
  )
    return !1;
  let i = e.parse(t);
  return (e === vt && (i = yo(i)), i);
}
var Ni = (t, e) => {
    const i = Oi(t),
      n = Oi(e);
    if (!i || !n) return Qt(t, e);
    const s = { ...i };
    return (o) => (
      (s.red = ve(i.red, n.red, o)),
      (s.green = ve(i.green, n.green, o)),
      (s.blue = ve(i.blue, n.blue, o)),
      (s.alpha = D(i.alpha, n.alpha, o)),
      ut.transform(s)
    );
  },
  Re = new Set(["none", "hidden"]);
function wo(t, e) {
  return Re.has(t) ? (i) => (i <= 0 ? t : e) : (i) => (i >= 1 ? e : t);
}
function Po(t, e) {
  return (i) => D(t, e, i);
}
function ci(t) {
  return typeof t == "number"
    ? Po
    : typeof t == "string"
      ? ai(t)
        ? Qt
        : R.test(t)
          ? Ni
          : Ao
      : Array.isArray(t)
        ? Ps
        : typeof t == "object"
          ? R.test(t)
            ? Ni
            : So
          : Qt;
}
function Ps(t, e) {
  const i = [...t],
    n = i.length,
    s = t.map((o, r) => ci(o)(o, e[r]));
  return (o) => {
    for (let r = 0; r < n; r++) i[r] = s[r](o);
    return i;
  };
}
function So(t, e) {
  const i = { ...t, ...e },
    n = {};
  for (const s in i)
    t[s] !== void 0 && e[s] !== void 0 && (n[s] = ci(t[s])(t[s], e[s]));
  return (s) => {
    for (const o in n) i[o] = n[o](s);
    return i;
  };
}
function bo(t, e) {
  const i = [],
    n = { color: 0, var: 0, number: 0 };
  for (let s = 0; s < e.values.length; s++) {
    const o = e.types[s],
      r = t.indexes[o][n[o]];
    ((i[s] = t.values[r] ?? 0), n[o]++);
  }
  return i;
}
var Ao = (t, e) => {
  const i = nt.createTransformer(e),
    n = Bt(t),
    s = Bt(e);
  return n.indexes.var.length === s.indexes.var.length &&
    n.indexes.color.length === s.indexes.color.length &&
    n.indexes.number.length >= s.indexes.number.length
    ? (Re.has(t) && !s.values.length) || (Re.has(e) && !n.values.length)
      ? wo(t, e)
      : Ot(Ps(bo(n, s), s.values), i)
    : (ae(
        !0,
        `Complex values '${t}' and '${e}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`,
        "complex-values-different",
      ),
      Qt(t, e));
};
function Ss(t, e, i) {
  return typeof t == "number" && typeof e == "number" && typeof i == "number"
    ? D(t, e, i)
    : ci(t)(t, e);
}
var Vo = (t) => {
    const e = ({ timestamp: i }) => t(i);
    return {
      start: (i = !0) => C.update(e, i),
      stop: () => J(e),
      now: () => (I.isProcessing ? I.timestamp : F.now()),
    };
  },
  bs = (t, e, i = 10) => {
    let n = "";
    const s = Math.max(Math.round(e / i), 2);
    for (let o = 0; o < s; o++)
      n += Math.round(t(o / (s - 1)) * 1e4) / 1e4 + ", ";
    return `linear(${n.substring(0, n.length - 2)})`;
  },
  As = 2e4;
function hi(t) {
  let e = 0;
  const i = 50;
  let n = t.next(e);
  for (; !n.done && e < 2e4; ) ((e += i), (n = t.next(e)));
  return e >= 2e4 ? 1 / 0 : e;
}
function Co(t, e = 100, i) {
  const n = i({ ...t, keyframes: [0, e] }),
    s = Math.min(hi(n), As);
  return {
    type: "keyframes",
    ease: (o) => n.next(s * o).value / e,
    duration: U(s),
  };
}
var Mo = 5;
function Vs(t, e, i) {
  const n = Math.max(e - Mo, 0);
  return ns(i - t(n), e - n);
}
var M = {
    stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
    duration: 800,
    bounce: 0.3,
    visualDuration: 0.3,
    restSpeed: { granular: 0.01, default: 2 },
    restDelta: { granular: 0.005, default: 0.5 },
    minDuration: 0.01,
    maxDuration: 10,
    minDamping: 0.05,
    maxDamping: 1,
  },
  ge = 0.001;
function Do({
  duration: t = M.duration,
  bounce: e = M.bounce,
  velocity: i = M.velocity,
  mass: n = M.mass,
}) {
  let s, o;
  ae(
    t <= H(M.maxDuration),
    "Spring duration must be 10 seconds or less",
    "spring-duration-limit",
  );
  let r = 1 - e;
  ((r = X(M.minDamping, M.maxDamping, r)),
    (t = X(M.minDuration, M.maxDuration, U(t))),
    r < 1
      ? ((s = (c) => {
          const u = c * r,
            h = u * t,
            f = u - i,
            d = Le(c, r),
            m = Math.exp(-h);
          return ge - (f / d) * m;
        }),
        (o = (c) => {
          const u = c * r * t,
            h = u * i + i,
            f = Math.pow(r, 2) * Math.pow(c, 2) * t,
            d = Math.exp(-u),
            m = Le(Math.pow(c, 2), r);
          return ((-s(c) + ge > 0 ? -1 : 1) * ((h - f) * d)) / m;
        }))
      : ((s = (c) => {
          const u = Math.exp(-c * t),
            h = (c - i) * t + 1;
          return -ge + u * h;
        }),
        (o = (c) => Math.exp(-c * t) * ((i - c) * (t * t)))));
  const a = 5 / t,
    l = Ro(s, o, a);
  if (((t = H(t)), isNaN(l)))
    return { stiffness: M.stiffness, damping: M.damping, duration: t };
  {
    const c = Math.pow(l, 2) * n;
    return { stiffness: c, damping: r * 2 * Math.sqrt(n * c), duration: t };
  }
}
var Eo = 12;
function Ro(t, e, i) {
  let n = i;
  for (let s = 1; s < Eo; s++) n = n - t(n) / e(n);
  return n;
}
function Le(t, e) {
  return t * Math.sqrt(1 - e * e);
}
var Lo = ["duration", "bounce"],
  ko = ["stiffness", "damping", "mass"];
function Ui(t, e) {
  return e.some((i) => t[i] !== void 0);
}
function Io(t) {
  let e = {
    velocity: M.velocity,
    stiffness: M.stiffness,
    damping: M.damping,
    mass: M.mass,
    isResolvedFromDuration: !1,
    ...t,
  };
  if (!Ui(t, ko) && Ui(t, Lo))
    if (t.visualDuration) {
      const i = t.visualDuration,
        n = (2 * Math.PI) / (i * 1.2),
        s = n * n,
        o = 2 * X(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(s);
      e = { ...e, mass: M.mass, stiffness: s, damping: o };
    } else {
      const i = Do(t);
      ((e = { ...e, ...i, mass: M.mass }), (e.isResolvedFromDuration = !0));
    }
  return e;
}
function te(t = M.visualDuration, e = M.bounce) {
  const i =
    typeof t != "object"
      ? { visualDuration: t, keyframes: [0, 1], bounce: e }
      : t;
  let { restSpeed: n, restDelta: s } = i;
  const o = i.keyframes[0],
    r = i.keyframes[i.keyframes.length - 1],
    a = { done: !1, value: o },
    {
      stiffness: l,
      damping: c,
      mass: u,
      duration: h,
      velocity: f,
      isResolvedFromDuration: d,
    } = Io({ ...i, velocity: -U(i.velocity || 0) }),
    m = f || 0,
    T = c / (2 * Math.sqrt(l * u)),
    g = r - o,
    p = U(Math.sqrt(l / u)),
    w = Math.abs(g) < 5;
  (n || (n = w ? M.restSpeed.granular : M.restSpeed.default),
    s || (s = w ? M.restDelta.granular : M.restDelta.default));
  let y;
  if (T < 1) {
    const b = Le(p, T);
    y = (V) =>
      r -
      Math.exp(-T * p * V) *
        (((m + T * p * g) / b) * Math.sin(b * V) + g * Math.cos(b * V));
  } else if (T === 1) y = (b) => r - Math.exp(-p * b) * (g + (m + p * g) * b);
  else {
    const b = p * Math.sqrt(T * T - 1);
    y = (V) => {
      const E = Math.exp(-T * p * V),
        P = Math.min(b * V, 300);
      return (
        r - (E * ((m + T * p * g) * Math.sinh(P) + b * g * Math.cosh(P))) / b
      );
    };
  }
  const S = {
    calculatedDuration: (d && h) || null,
    next: (b) => {
      const V = y(b);
      if (d) a.done = b >= h;
      else {
        let E = b === 0 ? m : 0;
        T < 1 && (E = b === 0 ? H(m) : Vs(y, b, V));
        const P = Math.abs(E) <= n,
          A = Math.abs(r - V) <= s;
        a.done = P && A;
      }
      return ((a.value = a.done ? r : V), a);
    },
    toString: () => {
      const b = Math.min(hi(S), As),
        V = bs((E) => S.next(b * E).value, b, 30);
      return b + "ms " + V;
    },
    toTransition: () => {},
  };
  return S;
}
te.applyToOptions = (t) => {
  const e = Co(t, 100, te);
  return (
    (t.ease = e.ease),
    (t.duration = H(e.duration)),
    (t.type = "keyframes"),
    t
  );
};
function ke({
  keyframes: t,
  velocity: e = 0,
  power: i = 0.8,
  timeConstant: n = 325,
  bounceDamping: s = 10,
  bounceStiffness: o = 500,
  modifyTarget: r,
  min: a,
  max: l,
  restDelta: c = 0.5,
  restSpeed: u,
}) {
  const h = t[0],
    f = { done: !1, value: h },
    d = (P) => (a !== void 0 && P < a) || (l !== void 0 && P > l),
    m = (P) =>
      a === void 0
        ? l
        : l === void 0 || Math.abs(a - P) < Math.abs(l - P)
          ? a
          : l;
  let T = i * e;
  const g = h + T,
    p = r === void 0 ? g : r(g);
  p !== g && (T = p - h);
  const w = (P) => -T * Math.exp(-P / n),
    y = (P) => p + w(P),
    S = (P) => {
      const A = w(P),
        _ = y(P);
      ((f.done = Math.abs(A) <= c), (f.value = f.done ? p : _));
    };
  let b, V;
  const E = (P) => {
    d(f.value) &&
      ((b = P),
      (V = te({
        keyframes: [f.value, m(f.value)],
        velocity: Vs(y, P, f.value),
        damping: s,
        stiffness: o,
        restDelta: c,
        restSpeed: u,
      })));
  };
  return (
    E(0),
    {
      calculatedDuration: null,
      next: (P) => {
        let A = !1;
        return (
          !V && b === void 0 && ((A = !0), S(P), E(P)),
          b !== void 0 && P >= b ? V.next(P - b) : (!A && S(P), f)
        );
      },
    }
  );
}
function Bo(t, e, i) {
  const n = [],
    s = i || Z.mix || Ss,
    o = t.length - 1;
  for (let r = 0; r < o; r++) {
    let a = s(t[r], t[r + 1]);
    (e && (a = Ot(Array.isArray(e) ? e[r] || W : e, a)), n.push(a));
  }
  return n;
}
function Cs(t, e, { clamp: i = !0, ease: n, mixer: s } = {}) {
  const o = t.length;
  if (
    (it(
      o === e.length,
      "Both input and output ranges must be the same length",
      "range-length",
    ),
    o === 1)
  )
    return () => e[0];
  if (o === 2 && e[0] === e[1]) return () => e[1];
  const r = t[0] === t[1];
  t[0] > t[o - 1] && ((t = [...t].reverse()), (e = [...e].reverse()));
  const a = Bo(e, n, s),
    l = a.length,
    c = (u) => {
      if (r && u < t[0]) return e[0];
      let h = 0;
      if (l > 1) for (; h < t.length - 2 && !(u < t[h + 1]); h++);
      const f = kt(t[h], t[h + 1], u);
      return a[h](f);
    };
  return i ? (u) => c(X(t[0], t[o - 1], u)) : c;
}
function Fo(t, e) {
  const i = t[t.length - 1];
  for (let n = 1; n <= e; n++) {
    const s = kt(0, e, n);
    t.push(D(i, 1, s));
  }
}
function jo(t) {
  const e = [0];
  return (Fo(e, t.length - 1), e);
}
function Oo(t, e) {
  return t.map((i) => i * e);
}
function No(t, e) {
  return t.map(() => e || fs).splice(0, t.length - 1);
}
function Dt({
  duration: t = 300,
  keyframes: e,
  times: i,
  ease: n = "easeInOut",
}) {
  const s = Zr(n) ? n.map(Ii) : Ii(n),
    o = { done: !1, value: e[0] },
    r = Cs(Oo(i && i.length === e.length ? i : jo(e), t), e, {
      ease: Array.isArray(s) ? s : No(e, s),
    });
  return {
    calculatedDuration: t,
    next: (a) => ((o.value = r(a)), (o.done = a >= t), o),
  };
}
var Uo = (t) => t !== null;
function fi(t, { repeat: e, repeatType: i = "loop" }, n, s = 1) {
  const o = t.filter(Uo),
    r = s < 0 || (e && i !== "loop" && e % 2 === 1) ? 0 : o.length - 1;
  return !r || n === void 0 ? o[r] : n;
}
var Wo = { decay: ke, inertia: ke, tween: Dt, keyframes: Dt, spring: te };
function Ms(t) {
  typeof t.type == "string" && (t.type = Wo[t.type]);
}
var di = class {
    constructor() {
      this.updateFinished();
    }
    get finished() {
      return this._finished;
    }
    updateFinished() {
      this._finished = new Promise((t) => {
        this.resolve = t;
      });
    }
    notifyFinished() {
      this.resolve();
    }
    then(t, e) {
      return this.finished.then(t, e);
    }
  },
  _o = (t) => t / 100,
  mi = class extends di {
    constructor(t) {
      (super(),
        (this.state = "idle"),
        (this.startTime = null),
        (this.isStopped = !1),
        (this.currentTime = 0),
        (this.holdTime = null),
        (this.playbackSpeed = 1),
        (this.stop = () => {
          const { motionValue: e } = this.options;
          (e && e.updatedAt !== F.now() && this.tick(F.now()),
            (this.isStopped = !0),
            this.state !== "idle" &&
              (this.teardown(), this.options.onStop?.()));
        }),
        ht.mainThread++,
        (this.options = t),
        this.initAnimation(),
        this.play(),
        t.autoplay === !1 && this.pause());
    }
    initAnimation() {
      const { options: t } = this;
      Ms(t);
      const {
        type: e = Dt,
        repeat: i = 0,
        repeatDelay: n = 0,
        repeatType: s,
        velocity: o = 0,
      } = t;
      let { keyframes: r } = t;
      const a = e || Dt;
      a !== Dt &&
        typeof r[0] != "number" &&
        ((this.mixKeyframes = Ot(_o, Ss(r[0], r[1]))), (r = [0, 100]));
      const l = a({ ...t, keyframes: r });
      (s === "mirror" &&
        (this.mirroredGenerator = a({
          ...t,
          keyframes: [...r].reverse(),
          velocity: -o,
        })),
        l.calculatedDuration === null && (l.calculatedDuration = hi(l)));
      const { calculatedDuration: c } = l;
      ((this.calculatedDuration = c),
        (this.resolvedDuration = c + n),
        (this.totalDuration = this.resolvedDuration * (i + 1) - n),
        (this.generator = l));
    }
    updateTime(t) {
      const e = Math.round(t - this.startTime) * this.playbackSpeed;
      this.holdTime !== null
        ? (this.currentTime = this.holdTime)
        : (this.currentTime = e);
    }
    tick(t, e = !1) {
      const {
        generator: i,
        totalDuration: n,
        mixKeyframes: s,
        mirroredGenerator: o,
        resolvedDuration: r,
        calculatedDuration: a,
      } = this;
      if (this.startTime === null) return i.next(0);
      const {
        delay: l = 0,
        keyframes: c,
        repeat: u,
        repeatType: h,
        repeatDelay: f,
        type: d,
        onUpdate: m,
        finalKeyframe: T,
      } = this.options;
      (this.speed > 0
        ? (this.startTime = Math.min(this.startTime, t))
        : this.speed < 0 &&
          (this.startTime = Math.min(t - n / this.speed, this.startTime)),
        e ? (this.currentTime = t) : this.updateTime(t));
      const g = this.currentTime - l * (this.playbackSpeed >= 0 ? 1 : -1),
        p = this.playbackSpeed >= 0 ? g < 0 : g > n;
      ((this.currentTime = Math.max(g, 0)),
        this.state === "finished" &&
          this.holdTime === null &&
          (this.currentTime = n));
      let w = this.currentTime,
        y = i;
      if (u) {
        const E = Math.min(this.currentTime, n) / r;
        let P = Math.floor(E),
          A = E % 1;
        (!A && E >= 1 && (A = 1),
          A === 1 && P--,
          (P = Math.min(P, u + 1)),
          P % 2 &&
            (h === "reverse"
              ? ((A = 1 - A), f && (A -= f / r))
              : h === "mirror" && (y = o)),
          (w = X(0, 1, A) * r));
      }
      const S = p ? { done: !1, value: c[0] } : y.next(w);
      s && (S.value = s(S.value));
      let { done: b } = S;
      !p &&
        a !== null &&
        (b =
          this.playbackSpeed >= 0
            ? this.currentTime >= n
            : this.currentTime <= 0);
      const V =
        this.holdTime === null &&
        (this.state === "finished" || (this.state === "running" && b));
      return (
        V && d !== ke && (S.value = fi(c, this.options, T, this.speed)),
        m && m(S.value),
        V && this.finish(),
        S
      );
    }
    then(t, e) {
      return this.finished.then(t, e);
    }
    get duration() {
      return U(this.calculatedDuration);
    }
    get iterationDuration() {
      const { delay: t = 0 } = this.options || {};
      return this.duration + U(t);
    }
    get time() {
      return U(this.currentTime);
    }
    set time(t) {
      ((t = H(t)),
        (this.currentTime = t),
        this.startTime === null ||
        this.holdTime !== null ||
        this.playbackSpeed === 0
          ? (this.holdTime = t)
          : this.driver &&
            (this.startTime = this.driver.now() - t / this.playbackSpeed),
        this.driver?.start(!1));
    }
    get speed() {
      return this.playbackSpeed;
    }
    set speed(t) {
      this.updateTime(F.now());
      const e = this.playbackSpeed !== t;
      ((this.playbackSpeed = t), e && (this.time = U(this.currentTime)));
    }
    play() {
      if (this.isStopped) return;
      const { driver: t = Vo, startTime: e } = this.options;
      (this.driver || (this.driver = t((n) => this.tick(n))),
        this.options.onPlay?.());
      const i = this.driver.now();
      (this.state === "finished"
        ? (this.updateFinished(), (this.startTime = i))
        : this.holdTime !== null
          ? (this.startTime = i - this.holdTime)
          : this.startTime || (this.startTime = e ?? i),
        this.state === "finished" &&
          this.speed < 0 &&
          (this.startTime += this.calculatedDuration),
        (this.holdTime = null),
        (this.state = "running"),
        this.driver.start());
    }
    pause() {
      ((this.state = "paused"),
        this.updateTime(F.now()),
        (this.holdTime = this.currentTime));
    }
    complete() {
      (this.state !== "running" && this.play(),
        (this.state = "finished"),
        (this.holdTime = null));
    }
    finish() {
      (this.notifyFinished(),
        this.teardown(),
        (this.state = "finished"),
        this.options.onComplete?.());
    }
    cancel() {
      ((this.holdTime = null),
        (this.startTime = 0),
        this.tick(0),
        this.teardown(),
        this.options.onCancel?.());
    }
    teardown() {
      ((this.state = "idle"),
        this.stopDriver(),
        (this.startTime = this.holdTime = null),
        ht.mainThread--);
    }
    stopDriver() {
      this.driver && (this.driver.stop(), (this.driver = void 0));
    }
    sample(t) {
      return ((this.startTime = 0), this.tick(t, !0));
    }
    attachTimeline(t) {
      return (
        this.options.allowFlatten &&
          ((this.options.type = "keyframes"),
          (this.options.ease = "linear"),
          this.initAnimation()),
        this.driver?.stop(),
        t.observe(this)
      );
    }
  };
function Ko(t) {
  for (let e = 1; e < t.length; e++) t[e] ?? (t[e] = t[e - 1]);
}
var ct = (t) => (t * 180) / Math.PI,
  Ie = (t) => Be(ct(Math.atan2(t[1], t[0]))),
  $o = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
    rotate: Ie,
    rotateZ: Ie,
    skewX: (t) => ct(Math.atan(t[1])),
    skewY: (t) => ct(Math.atan(t[2])),
    skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2,
  },
  Be = (t) => ((t = t % 360), t < 0 && (t += 360), t),
  Wi = Ie,
  _i = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]),
  Ki = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]),
  zo = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: _i,
    scaleY: Ki,
    scale: (t) => (_i(t) + Ki(t)) / 2,
    rotateX: (t) => Be(ct(Math.atan2(t[6], t[5]))),
    rotateY: (t) => Be(ct(Math.atan2(-t[2], t[0]))),
    rotateZ: Wi,
    rotate: Wi,
    skewX: (t) => ct(Math.atan(t[4])),
    skewY: (t) => ct(Math.atan(t[1])),
    skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2,
  };
function Fe(t) {
  return t.includes("scale") ? 1 : 0;
}
function je(t, e) {
  if (!t || t === "none") return Fe(e);
  const i = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let n, s;
  if (i) ((n = zo), (s = i));
  else {
    const a = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    ((n = $o), (s = a));
  }
  if (!s) return Fe(e);
  const o = n[e],
    r = s[1].split(",").map(Go);
  return typeof o == "function" ? o(r) : r[o];
}
var Ho = (t, e) => {
  const { transform: i = "none" } = getComputedStyle(t);
  return je(i, e);
};
function Go(t) {
  return parseFloat(t.trim());
}
var St = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY",
  ],
  bt = new Set(St),
  $i = (t) => t === Pt || t === x,
  Xo = new Set(["x", "y", "z"]),
  Yo = St.filter((t) => !Xo.has(t));
function qo(t) {
  const e = [];
  return (
    Yo.forEach((i) => {
      const n = t.getValue(i);
      n !== void 0 &&
        (e.push([i, n.get()]), n.set(i.startsWith("scale") ? 1 : 0));
    }),
    e
  );
}
var tt = {
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: i = "0" }) =>
    t.max - t.min - parseFloat(e) - parseFloat(i),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: i = "0" }) =>
    t.max - t.min - parseFloat(e) - parseFloat(i),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  x: (t, { transform: e }) => je(e, "x"),
  y: (t, { transform: e }) => je(e, "y"),
};
tt.translateX = tt.x;
tt.translateY = tt.y;
var ft = new Set(),
  Oe = !1,
  Ne = !1,
  Ue = !1;
function Ds() {
  if (Ne) {
    const t = Array.from(ft).filter((n) => n.needsMeasurement),
      e = new Set(t.map((n) => n.element)),
      i = new Map();
    (e.forEach((n) => {
      const s = qo(n);
      s.length && (i.set(n, s), n.render());
    }),
      t.forEach((n) => n.measureInitialState()),
      e.forEach((n) => {
        n.render();
        const s = i.get(n);
        s &&
          s.forEach(([o, r]) => {
            n.getValue(o)?.set(r);
          });
      }),
      t.forEach((n) => n.measureEndState()),
      t.forEach((n) => {
        n.suspendedScrollY !== void 0 && window.scrollTo(0, n.suspendedScrollY);
      }));
  }
  ((Ne = !1), (Oe = !1), ft.forEach((t) => t.complete(Ue)), ft.clear());
}
function Es() {
  ft.forEach((t) => {
    (t.readKeyframes(), t.needsMeasurement && (Ne = !0));
  });
}
function Zo() {
  ((Ue = !0), Es(), Ds(), (Ue = !1));
}
var pi = class {
    constructor(t, e, i, n, s, o = !1) {
      ((this.state = "pending"),
        (this.isAsync = !1),
        (this.needsMeasurement = !1),
        (this.unresolvedKeyframes = [...t]),
        (this.onComplete = e),
        (this.name = i),
        (this.motionValue = n),
        (this.element = s),
        (this.isAsync = o));
    }
    scheduleResolve() {
      ((this.state = "scheduled"),
        this.isAsync
          ? (ft.add(this),
            Oe || ((Oe = !0), C.read(Es), C.resolveKeyframes(Ds)))
          : (this.readKeyframes(), this.complete()));
    }
    readKeyframes() {
      const {
        unresolvedKeyframes: t,
        name: e,
        element: i,
        motionValue: n,
      } = this;
      if (t[0] === null) {
        const s = n?.get(),
          o = t[t.length - 1];
        if (s !== void 0) t[0] = s;
        else if (i && e) {
          const r = i.readValue(e, o);
          r != null && (t[0] = r);
        }
        (t[0] === void 0 && (t[0] = o), n && s === void 0 && n.set(t[0]));
      }
      Ko(t);
    }
    setFinalKeyframe() {}
    measureInitialState() {}
    renderEndStyles() {}
    measureEndState() {}
    complete(t = !1) {
      ((this.state = "complete"),
        this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t),
        ft.delete(this));
    }
    cancel() {
      this.state === "scheduled" && (ft.delete(this), (this.state = "pending"));
    }
    resume() {
      this.state === "pending" && this.scheduleResolve();
    }
  },
  Jo = (t) => t.startsWith("--");
function Qo(t, e, i) {
  Jo(e) ? t.style.setProperty(e, i) : (t.style[e] = i);
}
var ta = ni(() => window.ScrollTimeline !== void 0),
  ea = {};
function ia(t, e) {
  const i = ni(t);
  return () => ea[e] ?? i();
}
var Rs = ia(() => {
    try {
      document
        .createElement("div")
        .animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch {
      return !1;
    }
    return !0;
  }, "linearEasing"),
  Ct = ([t, e, i, n]) => `cubic-bezier(${t}, ${e}, ${i}, ${n})`,
  zi = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: Ct([0, 0.65, 0.55, 1]),
    circOut: Ct([0.55, 0, 1, 0.45]),
    backIn: Ct([0.31, 0.01, 0.66, -0.59]),
    backOut: Ct([0.33, 1.53, 0.69, 0.99]),
  };
function Ls(t, e) {
  if (t)
    return typeof t == "function"
      ? Rs()
        ? bs(t, e)
        : "ease-out"
      : ds(t)
        ? Ct(t)
        : Array.isArray(t)
          ? t.map((i) => Ls(i, e) || zi.easeOut)
          : zi[t];
}
function na(
  t,
  e,
  i,
  {
    delay: n = 0,
    duration: s = 300,
    repeat: o = 0,
    repeatType: r = "loop",
    ease: a = "easeOut",
    times: l,
  } = {},
  c = void 0,
) {
  const u = { [e]: i };
  l && (u.offset = l);
  const h = Ls(a, s);
  (Array.isArray(h) && (u.easing = h), z.value && ht.waapi++);
  const f = {
    delay: n,
    duration: s,
    easing: Array.isArray(h) ? "linear" : h,
    fill: "both",
    iterations: o + 1,
    direction: r === "reverse" ? "alternate" : "normal",
  };
  c && (f.pseudoElement = c);
  const d = t.animate(u, f);
  return (
    z.value &&
      d.finished.finally(() => {
        ht.waapi--;
      }),
    d
  );
}
function ks(t) {
  return typeof t == "function" && "applyToOptions" in t;
}
function sa({ type: t, ...e }) {
  return ks(t) && Rs()
    ? t.applyToOptions(e)
    : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
}
var ra = class extends di {
    constructor(t) {
      if (
        (super(),
        (this.finishedTime = null),
        (this.isStopped = !1),
        (this.manualStartTime = null),
        !t)
      )
        return;
      const {
        element: e,
        name: i,
        keyframes: n,
        pseudoElement: s,
        allowFlatten: o = !1,
        finalKeyframe: r,
        onComplete: a,
      } = t;
      ((this.isPseudoElement = !!s),
        (this.allowFlatten = o),
        (this.options = t),
        it(
          typeof t.type != "string",
          `Mini animate() doesn't support "type" as a string.`,
          "mini-spring",
        ));
      const l = sa(t);
      ((this.animation = na(e, i, n, l, s)),
        l.autoplay === !1 && this.animation.pause(),
        (this.animation.onfinish = () => {
          if (((this.finishedTime = this.time), !s)) {
            const c = fi(n, this.options, r, this.speed);
            (this.updateMotionValue ? this.updateMotionValue(c) : Qo(e, i, c),
              this.animation.cancel());
          }
          (a?.(), this.notifyFinished());
        }));
    }
    play() {
      this.isStopped ||
        ((this.manualStartTime = null),
        this.animation.play(),
        this.state === "finished" && this.updateFinished());
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.finish?.();
    }
    cancel() {
      try {
        this.animation.cancel();
      } catch {}
    }
    stop() {
      if (this.isStopped) return;
      this.isStopped = !0;
      const { state: t } = this;
      t === "idle" ||
        t === "finished" ||
        (this.updateMotionValue
          ? this.updateMotionValue()
          : this.commitStyles(),
        this.isPseudoElement || this.cancel());
    }
    commitStyles() {
      const t = this.options?.element;
      !this.isPseudoElement &&
        t?.isConnected &&
        this.animation.commitStyles?.();
    }
    get duration() {
      const t = this.animation.effect?.getComputedTiming?.().duration || 0;
      return U(Number(t));
    }
    get iterationDuration() {
      const { delay: t = 0 } = this.options || {};
      return this.duration + U(t);
    }
    get time() {
      return U(Number(this.animation.currentTime) || 0);
    }
    set time(t) {
      ((this.manualStartTime = null),
        (this.finishedTime = null),
        (this.animation.currentTime = H(t)));
    }
    get speed() {
      return this.animation.playbackRate;
    }
    set speed(t) {
      (t < 0 && (this.finishedTime = null), (this.animation.playbackRate = t));
    }
    get state() {
      return this.finishedTime !== null ? "finished" : this.animation.playState;
    }
    get startTime() {
      return this.manualStartTime ?? Number(this.animation.startTime);
    }
    set startTime(t) {
      this.manualStartTime = this.animation.startTime = t;
    }
    attachTimeline({ timeline: t, observe: e }) {
      return (
        this.allowFlatten &&
          this.animation.effect?.updateTiming({ easing: "linear" }),
        (this.animation.onfinish = null),
        t && ta() ? ((this.animation.timeline = t), W) : e(this)
      );
    }
  },
  Is = { anticipate: us, backInOut: ls, circInOut: hs };
function oa(t) {
  return t in Is;
}
function aa(t) {
  typeof t.ease == "string" && oa(t.ease) && (t.ease = Is[t.ease]);
}
var ye = 10,
  la = class extends ra {
    constructor(t) {
      (aa(t),
        Ms(t),
        super(t),
        t.startTime !== void 0 && (this.startTime = t.startTime),
        (this.options = t));
    }
    updateMotionValue(t) {
      const {
        motionValue: e,
        onUpdate: i,
        onComplete: n,
        element: s,
        ...o
      } = this.options;
      if (!e) return;
      if (t !== void 0) {
        e.set(t);
        return;
      }
      const r = new mi({ ...o, autoplay: !1 }),
        a = Math.max(ye, F.now() - this.startTime),
        l = X(0, ye, a - ye);
      (e.setWithVelocity(
        r.sample(Math.max(0, a - l)).value,
        r.sample(a).value,
        l,
      ),
        r.stop());
    }
  },
  Hi = (t, e) =>
    e === "zIndex"
      ? !1
      : !!(
          typeof t == "number" ||
          Array.isArray(t) ||
          (typeof t == "string" &&
            (nt.test(t) || t === "0") &&
            !t.startsWith("url("))
        );
function ua(t) {
  const e = t[0];
  if (t.length === 1) return !0;
  for (let i = 0; i < t.length; i++) if (t[i] !== e) return !0;
}
function ca(t, e, i, n) {
  const s = t[0];
  if (s === null) return !1;
  if (e === "display" || e === "visibility") return !0;
  const o = t[t.length - 1],
    r = Hi(s, e),
    a = Hi(o, e);
  return (
    ae(
      r === a,
      `You are trying to animate ${e} from "${s}" to "${o}". "${r ? o : s}" is not an animatable value.`,
      "value-not-animatable",
    ),
    !r || !a ? !1 : ua(t) || ((i === "spring" || ks(i)) && n)
  );
}
function We(t) {
  ((t.duration = 0), (t.type = "keyframes"));
}
var ha = new Set(["opacity", "clipPath", "filter", "transform"]),
  fa = ni(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function da(t) {
  const {
    motionValue: e,
    name: i,
    repeatDelay: n,
    repeatType: s,
    damping: o,
    type: r,
  } = t;
  if (!(e?.owner?.current instanceof HTMLElement)) return !1;
  const { onUpdate: a, transformTemplate: l } = e.owner.getProps();
  return (
    fa() &&
    i &&
    ha.has(i) &&
    (i !== "transform" || !l) &&
    !a &&
    !n &&
    s !== "mirror" &&
    o !== 0 &&
    r !== "inertia"
  );
}
var ma = 40,
  pa = class extends di {
    constructor({
      autoplay: t = !0,
      delay: e = 0,
      type: i = "keyframes",
      repeat: n = 0,
      repeatDelay: s = 0,
      repeatType: o = "loop",
      keyframes: r,
      name: a,
      motionValue: l,
      element: c,
      ...u
    }) {
      (super(),
        (this.stop = () => {
          (this._animation && (this._animation.stop(), this.stopTimeline?.()),
            this.keyframeResolver?.cancel());
        }),
        (this.createdAt = F.now()));
      const h = {
        autoplay: t,
        delay: e,
        type: i,
        repeat: n,
        repeatDelay: s,
        repeatType: o,
        name: a,
        motionValue: l,
        element: c,
        ...u,
      };
      ((this.keyframeResolver = new (c?.KeyframeResolver || pi)(
        r,
        (f, d, m) => this.onKeyframesResolved(f, d, h, !m),
        a,
        l,
        c,
      )),
        this.keyframeResolver?.scheduleResolve());
    }
    onKeyframesResolved(t, e, i, n) {
      this.keyframeResolver = void 0;
      const {
        name: s,
        type: o,
        velocity: r,
        delay: a,
        isHandoff: l,
        onUpdate: c,
      } = i;
      ((this.resolvedAt = F.now()),
        ca(t, s, o, r) ||
          ((Z.instantAnimations || !a) && c?.(fi(t, i, e)),
          (t[0] = t[t.length - 1]),
          We(i),
          (i.repeat = 0)));
      const u = {
          startTime: n
            ? this.resolvedAt
              ? this.resolvedAt - this.createdAt > ma
                ? this.resolvedAt
                : this.createdAt
              : this.createdAt
            : void 0,
          finalKeyframe: e,
          ...i,
          keyframes: t,
        },
        h = !l && da(u),
        f = u.motionValue?.owner?.current,
        d = h ? new la({ ...u, element: f }) : new mi(u);
      (d.finished
        .then(() => {
          this.notifyFinished();
        })
        .catch(W),
        this.pendingTimeline &&
          ((this.stopTimeline = d.attachTimeline(this.pendingTimeline)),
          (this.pendingTimeline = void 0)),
        (this._animation = d));
    }
    get finished() {
      return this._animation ? this.animation.finished : this._finished;
    }
    then(t, e) {
      return this.finished.finally(t).then(() => {});
    }
    get animation() {
      return (
        this._animation || (this.keyframeResolver?.resume(), Zo()),
        this._animation
      );
    }
    get duration() {
      return this.animation.duration;
    }
    get iterationDuration() {
      return this.animation.iterationDuration;
    }
    get time() {
      return this.animation.time;
    }
    set time(t) {
      this.animation.time = t;
    }
    get speed() {
      return this.animation.speed;
    }
    get state() {
      return this.animation.state;
    }
    set speed(t) {
      this.animation.speed = t;
    }
    get startTime() {
      return this.animation.startTime;
    }
    attachTimeline(t) {
      return (
        this._animation
          ? (this.stopTimeline = this.animation.attachTimeline(t))
          : (this.pendingTimeline = t),
        () => this.stop()
      );
    }
    play() {
      this.animation.play();
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.complete();
    }
    cancel() {
      (this._animation && this.animation.cancel(),
        this.keyframeResolver?.cancel());
    }
  };
function Bs(t, e, i, n = 0, s = 1) {
  const o = Array.from(t)
      .sort((l, c) => l.sortNodePosition(c))
      .indexOf(e),
    r = t.size,
    a = (r - 1) * n;
  return typeof i == "function" ? i(o, r) : s === 1 ? o * n : a - o * n;
}
var va = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function ga(t) {
  const e = va.exec(t);
  if (!e) return [,];
  const [, i, n, s] = e;
  return [`--${i ?? n}`, s];
}
var ya = 4;
function Fs(t, e, i = 1) {
  it(
    i <= ya,
    `Max CSS variable fallback depth detected in property "${t}". This may indicate a circular fallback dependency.`,
    "max-css-var-depth",
  );
  const [n, s] = ga(t);
  if (!n) return;
  const o = window.getComputedStyle(e).getPropertyValue(n);
  if (o) {
    const r = o.trim();
    return ts(r) ? parseFloat(r) : r;
  }
  return ai(s) ? Fs(s, e, i + 1) : s;
}
var xa = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  Ta = (t) => ({
    type: "spring",
    stiffness: 550,
    damping: t === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10,
  }),
  wa = { type: "keyframes", duration: 0.8 },
  Pa = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  Sa = (t, { keyframes: e }) =>
    e.length > 2
      ? wa
      : bt.has(t)
        ? t.startsWith("scale")
          ? Ta(e[1])
          : xa
        : Pa,
  ba = (t) => t !== null;
function Aa(t, { repeat: e, repeatType: i = "loop" }, n) {
  const s = t.filter(ba),
    o = e && i !== "loop" && e % 2 === 1 ? 0 : s.length - 1;
  return !o || n === void 0 ? s[o] : n;
}
function vi(t, e) {
  return t?.[e] ?? t?.default ?? t;
}
function Va({
  when: t,
  delay: e,
  delayChildren: i,
  staggerChildren: n,
  staggerDirection: s,
  repeat: o,
  repeatType: r,
  repeatDelay: a,
  from: l,
  elapsed: c,
  ...u
}) {
  return !!Object.keys(u).length;
}
var gi =
  (t, e, i, n = {}, s, o) =>
  (r) => {
    const a = vi(n, t) || {},
      l = a.delay || n.delay || 0;
    let { elapsed: c = 0 } = n;
    c = c - H(l);
    const u = {
      keyframes: Array.isArray(i) ? i : [null, i],
      ease: "easeOut",
      velocity: e.getVelocity(),
      ...a,
      delay: -c,
      onUpdate: (f) => {
        (e.set(f), a.onUpdate && a.onUpdate(f));
      },
      onComplete: () => {
        (r(), a.onComplete && a.onComplete());
      },
      name: t,
      motionValue: e,
      element: o ? void 0 : s,
    };
    (Va(a) || Object.assign(u, Sa(t, u)),
      u.duration && (u.duration = H(u.duration)),
      u.repeatDelay && (u.repeatDelay = H(u.repeatDelay)),
      u.from !== void 0 && (u.keyframes[0] = u.from));
    let h = !1;
    if (
      ((u.type === !1 || (u.duration === 0 && !u.repeatDelay)) &&
        (We(u), u.delay === 0 && (h = !0)),
      (Z.instantAnimations || Z.skipAnimations || s?.shouldSkipAnimations) &&
        ((h = !0), We(u), (u.delay = 0)),
      (u.allowFlatten = !a.type && !a.ease),
      h && !o && e.get() !== void 0)
    ) {
      const f = Aa(u.keyframes, a);
      if (f !== void 0) {
        C.update(() => {
          (u.onUpdate(f), u.onComplete());
        });
        return;
      }
    }
    return a.isSync ? new mi(u) : new pa(u);
  };
function Gi(t) {
  const e = [{}, {}];
  return (
    t?.values.forEach((i, n) => {
      ((e[0][n] = i.get()), (e[1][n] = i.getVelocity()));
    }),
    e
  );
}
function yi(t, e, i, n) {
  if (typeof e == "function") {
    const [s, o] = Gi(n);
    e = e(i !== void 0 ? i : t.custom, s, o);
  }
  if (
    (typeof e == "string" && (e = t.variants && t.variants[e]),
    typeof e == "function")
  ) {
    const [s, o] = Gi(n);
    e = e(i !== void 0 ? i : t.custom, s, o);
  }
  return e;
}
function wt(t, e, i) {
  const n = t.getProps();
  return yi(n, e, i !== void 0 ? i : n.custom, t);
}
var js = new Set(["width", "height", "top", "left", "right", "bottom", ...St]),
  Xi = 30,
  Ca = (t) => !isNaN(parseFloat(t)),
  Et = { current: void 0 },
  Ma = class {
    constructor(t, e = {}) {
      ((this.canTrackVelocity = null),
        (this.events = {}),
        (this.updateAndNotify = (i) => {
          const n = F.now();
          if (
            (this.updatedAt !== n && this.setPrevFrameValue(),
            (this.prev = this.current),
            this.setCurrent(i),
            this.current !== this.prev &&
              (this.events.change?.notify(this.current), this.dependents))
          )
            for (const s of this.dependents) s.dirty();
        }),
        (this.hasAnimated = !1),
        this.setCurrent(t),
        (this.owner = e.owner));
    }
    setCurrent(t) {
      ((this.current = t),
        (this.updatedAt = F.now()),
        this.canTrackVelocity === null &&
          t !== void 0 &&
          (this.canTrackVelocity = Ca(this.current)));
    }
    setPrevFrameValue(t = this.current) {
      ((this.prevFrameValue = t), (this.prevUpdatedAt = this.updatedAt));
    }
    onChange(t) {
      return this.on("change", t);
    }
    on(t, e) {
      this.events[t] || (this.events[t] = new si());
      const i = this.events[t].add(e);
      return t === "change"
        ? () => {
            (i(),
              C.read(() => {
                this.events.change.getSize() || this.stop();
              }));
          }
        : i;
    }
    clearListeners() {
      for (const t in this.events) this.events[t].clear();
    }
    attach(t, e) {
      ((this.passiveEffect = t), (this.stopPassiveEffect = e));
    }
    set(t) {
      this.passiveEffect
        ? this.passiveEffect(t, this.updateAndNotify)
        : this.updateAndNotify(t);
    }
    setWithVelocity(t, e, i) {
      (this.set(e),
        (this.prev = void 0),
        (this.prevFrameValue = t),
        (this.prevUpdatedAt = this.updatedAt - i));
    }
    jump(t, e = !0) {
      (this.updateAndNotify(t),
        (this.prev = t),
        (this.prevUpdatedAt = this.prevFrameValue = void 0),
        e && this.stop(),
        this.stopPassiveEffect && this.stopPassiveEffect());
    }
    dirty() {
      this.events.change?.notify(this.current);
    }
    addDependent(t) {
      (this.dependents || (this.dependents = new Set()),
        this.dependents.add(t));
    }
    removeDependent(t) {
      this.dependents && this.dependents.delete(t);
    }
    get() {
      return (Et.current && Et.current.push(this), this.current);
    }
    getPrevious() {
      return this.prev;
    }
    getVelocity() {
      const t = F.now();
      if (
        !this.canTrackVelocity ||
        this.prevFrameValue === void 0 ||
        t - this.updatedAt > Xi
      )
        return 0;
      const e = Math.min(this.updatedAt - this.prevUpdatedAt, Xi);
      return ns(parseFloat(this.current) - parseFloat(this.prevFrameValue), e);
    }
    start(t) {
      return (
        this.stop(),
        new Promise((e) => {
          ((this.hasAnimated = !0),
            (this.animation = t(e)),
            this.events.animationStart && this.events.animationStart.notify());
        }).then(() => {
          (this.events.animationComplete &&
            this.events.animationComplete.notify(),
            this.clearAnimation());
        })
      );
    }
    stop() {
      (this.animation &&
        (this.animation.stop(),
        this.events.animationCancel && this.events.animationCancel.notify()),
        this.clearAnimation());
    }
    isAnimating() {
      return !!this.animation;
    }
    clearAnimation() {
      delete this.animation;
    }
    destroy() {
      (this.dependents?.clear(),
        this.events.destroy?.notify(),
        this.clearListeners(),
        this.stop(),
        this.stopPassiveEffect && this.stopPassiveEffect());
    }
  };
function dt(t, e) {
  return new Ma(t, e);
}
var _e = (t) => Array.isArray(t);
function Da(t, e, i) {
  t.hasValue(e) ? t.getValue(e).set(i) : t.addValue(e, dt(i));
}
function Ea(t) {
  return _e(t) ? t[t.length - 1] || 0 : t;
}
function xi(t, e) {
  let { transitionEnd: i = {}, transition: n = {}, ...s } = wt(t, e) || {};
  s = { ...s, ...i };
  for (const o in s) Da(t, o, Ea(s[o]));
}
var B = (t) => !!(t && t.getVelocity);
function Ra(t) {
  return !!(B(t) && t.add);
}
function Ke(t, e) {
  const i = t.getValue("willChange");
  if (Ra(i)) return i.add(e);
  if (!i && Z.WillChange) {
    const n = new Z.WillChange("auto");
    (t.addValue("willChange", n), n.add(e));
  }
}
function Ti(t) {
  return t.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
var La = "framerAppearId",
  Os = "data-" + Ti(La);
function Ns(t) {
  return t.props[Os];
}
function ka({ protectedKeys: t, needsAnimating: e }, i) {
  const n = t.hasOwnProperty(i) && e[i] !== !0;
  return ((e[i] = !1), n);
}
function Us(t, e, { delay: i = 0, transitionOverride: n, type: s } = {}) {
  let { transition: o = t.getDefaultTransition(), transitionEnd: r, ...a } = e;
  const l = o?.reduceMotion;
  n && (o = n);
  const c = [],
    u = s && t.animationState && t.animationState.getState()[s];
  for (const h in a) {
    const f = t.getValue(h, t.latestValues[h] ?? null),
      d = a[h];
    if (d === void 0 || (u && ka(u, h))) continue;
    const m = { delay: i, ...vi(o || {}, h) },
      T = f.get();
    if (
      T !== void 0 &&
      !f.isAnimating &&
      !Array.isArray(d) &&
      d === T &&
      !m.velocity
    )
      continue;
    let g = !1;
    if (window.MotionHandoffAnimation) {
      const y = Ns(t);
      if (y) {
        const S = window.MotionHandoffAnimation(y, h, C);
        S !== null && ((m.startTime = S), (g = !0));
      }
    }
    Ke(t, h);
    const p = l ?? t.shouldReduceMotion;
    f.start(gi(h, f, d, p && js.has(h) ? { type: !1 } : m, t, g));
    const w = f.animation;
    w && c.push(w);
  }
  return (
    r &&
      Promise.all(c).then(() => {
        C.update(() => {
          r && xi(t, r);
        });
      }),
    c
  );
}
function $e(t, e, i = {}) {
  const n = wt(t, e, i.type === "exit" ? t.presenceContext?.custom : void 0);
  let { transition: s = t.getDefaultTransition() || {} } = n || {};
  i.transitionOverride && (s = i.transitionOverride);
  const o = n ? () => Promise.all(Us(t, n, i)) : () => Promise.resolve(),
    r =
      t.variantChildren && t.variantChildren.size
        ? (l = 0) => {
            const {
              delayChildren: c = 0,
              staggerChildren: u,
              staggerDirection: h,
            } = s;
            return Ia(t, e, l, c, u, h, i);
          }
        : () => Promise.resolve(),
    { when: a } = s;
  if (a) {
    const [l, c] = a === "beforeChildren" ? [o, r] : [r, o];
    return l().then(() => c());
  } else return Promise.all([o(), r(i.delay)]);
}
function Ia(t, e, i = 0, n = 0, s = 0, o = 1, r) {
  const a = [];
  for (const l of t.variantChildren)
    (l.notify("AnimationStart", e),
      a.push(
        $e(l, e, {
          ...r,
          delay:
            i +
            (typeof n == "function" ? 0 : n) +
            Bs(t.variantChildren, l, n, s, o),
        }).then(() => l.notify("AnimationComplete", e)),
      ));
  return Promise.all(a);
}
function Ws(t, e, i = {}) {
  t.notify("AnimationStart", e);
  let n;
  if (Array.isArray(e)) {
    const s = e.map((o) => $e(t, o, i));
    n = Promise.all(s);
  } else if (typeof e == "string") n = $e(t, e, i);
  else {
    const s = typeof e == "function" ? wt(t, e, i.custom) : e;
    n = Promise.all(Us(t, s, i));
  }
  return n.then(() => {
    t.notify("AnimationComplete", e);
  });
}
var Ba = { test: (t) => t === "auto", parse: (t) => t },
  _s = (t) => (e) => e.test(t),
  Ks = [Pt, x, G, Q, uo, lo, Ba],
  Yi = (t) => Ks.find(_s(t));
function Fa(t) {
  return typeof t == "number"
    ? t === 0
    : t !== null
      ? t === "none" || t === "0" || is(t)
      : !0;
}
var ja = new Set(["brightness", "contrast", "saturate", "opacity"]);
function Oa(t) {
  const [e, i] = t.slice(0, -1).split("(");
  if (e === "drop-shadow") return t;
  const [n] = i.match(li) || [];
  if (!n) return t;
  const s = i.replace(n, "");
  let o = ja.has(e) ? 1 : 0;
  return (n !== i && (o *= 100), e + "(" + o + s + ")");
}
var Na = /\b([a-z-]*)\(.*?\)/gu,
  ze = {
    ...nt,
    getAnimatableNone: (t) => {
      const e = t.match(Na);
      return e ? e.map(Oa).join(" ") : t;
    },
  },
  qi = { ...Pt, transform: Math.round },
  Ua = {
    rotate: Q,
    rotateX: Q,
    rotateY: Q,
    rotateZ: Q,
    scale: Kt,
    scaleX: Kt,
    scaleY: Kt,
    scaleZ: Kt,
    skew: Q,
    skewX: Q,
    skewY: Q,
    distance: x,
    translateX: x,
    translateY: x,
    translateZ: x,
    x,
    y: x,
    z: x,
    perspective: x,
    transformPerspective: x,
    opacity: It,
    originX: Fi,
    originY: Fi,
    originZ: x,
  },
  wi = {
    borderWidth: x,
    borderTopWidth: x,
    borderRightWidth: x,
    borderBottomWidth: x,
    borderLeftWidth: x,
    borderRadius: x,
    borderTopLeftRadius: x,
    borderTopRightRadius: x,
    borderBottomRightRadius: x,
    borderBottomLeftRadius: x,
    width: x,
    maxWidth: x,
    height: x,
    maxHeight: x,
    top: x,
    right: x,
    bottom: x,
    left: x,
    inset: x,
    insetBlock: x,
    insetBlockStart: x,
    insetBlockEnd: x,
    insetInline: x,
    insetInlineStart: x,
    insetInlineEnd: x,
    padding: x,
    paddingTop: x,
    paddingRight: x,
    paddingBottom: x,
    paddingLeft: x,
    paddingBlock: x,
    paddingBlockStart: x,
    paddingBlockEnd: x,
    paddingInline: x,
    paddingInlineStart: x,
    paddingInlineEnd: x,
    margin: x,
    marginTop: x,
    marginRight: x,
    marginBottom: x,
    marginLeft: x,
    marginBlock: x,
    marginBlockStart: x,
    marginBlockEnd: x,
    marginInline: x,
    marginInlineStart: x,
    marginInlineEnd: x,
    fontSize: x,
    backgroundPositionX: x,
    backgroundPositionY: x,
    ...Ua,
    zIndex: qi,
    fillOpacity: It,
    strokeOpacity: It,
    numOctaves: qi,
  },
  Wa = {
    ...wi,
    color: R,
    backgroundColor: R,
    outlineColor: R,
    fill: R,
    stroke: R,
    borderColor: R,
    borderTopColor: R,
    borderRightColor: R,
    borderBottomColor: R,
    borderLeftColor: R,
    filter: ze,
    WebkitFilter: ze,
  },
  $s = (t) => Wa[t];
function zs(t, e) {
  let i = $s(t);
  return (
    i !== ze && (i = nt),
    i.getAnimatableNone ? i.getAnimatableNone(e) : void 0
  );
}
var _a = new Set(["auto", "none", "0"]);
function Ka(t, e, i) {
  let n = 0,
    s;
  for (; n < t.length && !s; ) {
    const o = t[n];
    (typeof o == "string" && !_a.has(o) && Bt(o).values.length && (s = t[n]),
      n++);
  }
  if (s && i) for (const o of e) t[o] = zs(i, s);
}
var $a = class extends pi {
  constructor(t, e, i, n, s) {
    super(t, e, i, n, s, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: e, name: i } = this;
    if (!e || !e.current) return;
    super.readKeyframes();
    for (let a = 0; a < t.length; a++) {
      let l = t[a];
      if (typeof l == "string" && ((l = l.trim()), ai(l))) {
        const c = Fs(l, e.current);
        (c !== void 0 && (t[a] = c),
          a === t.length - 1 && (this.finalKeyframe = l));
      }
    }
    if ((this.resolveNoneKeyframes(), !js.has(i) || t.length !== 2)) return;
    const [n, s] = t,
      o = Yi(n),
      r = Yi(s);
    if (Bi(n) !== Bi(s) && tt[i]) {
      this.needsMeasurement = !0;
      return;
    }
    if (o !== r)
      if ($i(o) && $i(r))
        for (let a = 0; a < t.length; a++) {
          const l = t[a];
          typeof l == "string" && (t[a] = parseFloat(l));
        }
      else tt[i] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: e } = this,
      i = [];
    for (let n = 0; n < t.length; n++) (t[n] === null || Fa(t[n])) && i.push(n);
    i.length && Ka(t, i, e);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: e, name: i } = this;
    if (!t || !t.current) return;
    (i === "height" && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = tt[i](
        t.measureViewportBox(),
        window.getComputedStyle(t.current),
      )),
      (e[0] = this.measuredOrigin));
    const n = e[e.length - 1];
    n !== void 0 && t.getValue(i, n).jump(n, !1);
  }
  measureEndState() {
    const { element: t, name: e, unresolvedKeyframes: i } = this;
    if (!t || !t.current) return;
    const n = t.getValue(e);
    n && n.jump(this.measuredOrigin, !1);
    const s = i.length - 1,
      o = i[s];
    ((i[s] = tt[e](t.measureViewportBox(), window.getComputedStyle(t.current))),
      o !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = o),
      this.removedTransforms?.length &&
        this.removedTransforms.forEach(([r, a]) => {
          t.getValue(r).set(a);
        }),
      this.resolveNoneKeyframes());
  }
};
function Hs(t, e, i) {
  if (t == null) return [];
  if (t instanceof EventTarget) return [t];
  if (typeof t == "string") {
    let n = document;
    e && (n = e.current);
    const s = i?.[t] ?? n.querySelectorAll(t);
    return s ? Array.from(s) : [];
  }
  return Array.from(t).filter((n) => n != null);
}
var Gs = (t, e) => (e && typeof t == "number" ? e.transform(t) : t);
function He(t) {
  return es(t) && "offsetHeight" in t;
}
var { schedule: Pi, cancel: Xc } = ms(queueMicrotask, !1),
  $ = { x: !1, y: !1 };
function Xs() {
  return $.x || $.y;
}
function za(t) {
  return t === "x" || t === "y"
    ? $[t]
      ? null
      : (($[t] = !0),
        () => {
          $[t] = !1;
        })
    : $.x || $.y
      ? null
      : (($.x = $.y = !0),
        () => {
          $.x = $.y = !1;
        });
}
function Ys(t, e) {
  const i = Hs(t),
    n = new AbortController(),
    s = { passive: !0, ...e, signal: n.signal };
  return [i, s, () => n.abort()];
}
function Zi(t) {
  return !(t.pointerType === "touch" || Xs());
}
function Ha(t, e, i = {}) {
  const [n, s, o] = Ys(t, i),
    r = (a) => {
      if (!Zi(a)) return;
      const { target: l } = a,
        c = e(l, a);
      if (typeof c != "function" || !l) return;
      const u = (h) => {
        Zi(h) && (c(h), l.removeEventListener("pointerleave", u));
      };
      l.addEventListener("pointerleave", u, s);
    };
  return (
    n.forEach((a) => {
      a.addEventListener("pointerenter", r, s);
    }),
    o
  );
}
var qs = (t, e) => (e ? (t === e ? !0 : qs(t, e.parentElement)) : !1),
  Si = (t) =>
    t.pointerType === "mouse"
      ? typeof t.button != "number" || t.button <= 0
      : t.isPrimary !== !1,
  Ga = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);
function Xa(t) {
  return Ga.has(t.tagName) || t.isContentEditable === !0;
}
var Ya = new Set(["INPUT", "SELECT", "TEXTAREA"]);
function qa(t) {
  return Ya.has(t.tagName) || t.isContentEditable === !0;
}
var Gt = new WeakSet();
function Ji(t) {
  return (e) => {
    e.key === "Enter" && t(e);
  };
}
function xe(t, e) {
  t.dispatchEvent(
    new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 }),
  );
}
var Za = (t, e) => {
  const i = t.currentTarget;
  if (!i) return;
  const n = Ji(() => {
    if (Gt.has(i)) return;
    xe(i, "down");
    const s = Ji(() => {
        xe(i, "up");
      }),
      o = () => xe(i, "cancel");
    (i.addEventListener("keyup", s, e), i.addEventListener("blur", o, e));
  });
  (i.addEventListener("keydown", n, e),
    i.addEventListener("blur", () => i.removeEventListener("keydown", n), e));
};
function Qi(t) {
  return Si(t) && !Xs();
}
function Ja(t, e, i = {}) {
  const [n, s, o] = Ys(t, i),
    r = (a) => {
      const l = a.currentTarget;
      if (!Qi(a)) return;
      Gt.add(l);
      const c = e(l, a),
        u = (d, m) => {
          (window.removeEventListener("pointerup", h),
            window.removeEventListener("pointercancel", f),
            Gt.has(l) && Gt.delete(l),
            Qi(d) && typeof c == "function" && c(d, { success: m }));
        },
        h = (d) => {
          u(
            d,
            l === window ||
              l === document ||
              i.useGlobalTarget ||
              qs(l, d.target),
          );
        },
        f = (d) => {
          u(d, !1);
        };
      (window.addEventListener("pointerup", h, s),
        window.addEventListener("pointercancel", f, s));
    };
  return (
    n.forEach((a) => {
      ((i.useGlobalTarget ? window : a).addEventListener("pointerdown", r, s),
        He(a) &&
          (a.addEventListener("focus", (l) => Za(l, s)),
          !Xa(a) && !a.hasAttribute("tabindex") && (a.tabIndex = 0)));
    }),
    o
  );
}
function bi(t) {
  return es(t) && "ownerSVGElement" in t;
}
var Xt = new WeakMap(),
  Yt,
  Zs = (t, e, i) => (n, s) =>
    s && s[0]
      ? s[0][t + "Size"]
      : bi(n) && "getBBox" in n
        ? n.getBBox()[e]
        : n[i],
  Qa = Zs("inline", "width", "offsetWidth"),
  tl = Zs("block", "height", "offsetHeight");
function el({ target: t, borderBoxSize: e }) {
  Xt.get(t)?.forEach((i) => {
    i(t, {
      get width() {
        return Qa(t, e);
      },
      get height() {
        return tl(t, e);
      },
    });
  });
}
function il(t) {
  t.forEach(el);
}
function nl() {
  typeof ResizeObserver > "u" || (Yt = new ResizeObserver(il));
}
function sl(t, e) {
  Yt || nl();
  const i = Hs(t);
  return (
    i.forEach((n) => {
      let s = Xt.get(n);
      (s || ((s = new Set()), Xt.set(n, s)), s.add(e), Yt?.observe(n));
    }),
    () => {
      i.forEach((n) => {
        const s = Xt.get(n);
        (s?.delete(e), s?.size || Yt?.unobserve(n));
      });
    }
  );
}
var qt = new Set(),
  gt;
function rl() {
  ((gt = () => {
    const t = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      },
    };
    qt.forEach((e) => e(t));
  }),
    window.addEventListener("resize", gt));
}
function ol(t) {
  return (
    qt.add(t),
    gt || rl(),
    () => {
      (qt.delete(t),
        !qt.size &&
          typeof gt == "function" &&
          (window.removeEventListener("resize", gt), (gt = void 0)));
    }
  );
}
function tn(t, e) {
  return typeof t == "function" ? ol(t) : sl(t, e);
}
function al(t) {
  return bi(t) && t.tagName === "svg";
}
function ll(...t) {
  const e = !Array.isArray(t[0]),
    i = e ? 0 : -1,
    n = t[0 + i],
    s = t[1 + i],
    o = t[2 + i],
    r = t[3 + i],
    a = Cs(s, o, r);
  return e ? a(n) : a;
}
var ul = [...Ks, R, nt],
  cl = (t) => ul.find(_s(t)),
  en = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
  yt = () => ({ x: en(), y: en() }),
  nn = () => ({ min: 0, max: 0 }),
  L = () => ({ x: nn(), y: nn() }),
  Ge = { current: null },
  Js = { current: !1 },
  hl = typeof window < "u";
function fl() {
  if (((Js.current = !0), !!hl))
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"),
        e = () => (Ge.current = t.matches);
      (t.addEventListener("change", e), e());
    } else Ge.current = !1;
}
var dl = new WeakMap();
function le(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function Ft(t) {
  return typeof t == "string" || Array.isArray(t);
}
var Ai = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit",
  ],
  Vi = ["initial", ...Ai];
function ue(t) {
  return le(t.animate) || Vi.some((e) => Ft(t[e]));
}
function Qs(t) {
  return !!(ue(t) || t.variants);
}
function ml(t, e, i) {
  for (const n in e) {
    const s = e[n],
      o = i[n];
    if (B(s)) t.addValue(n, s);
    else if (B(o)) t.addValue(n, dt(s, { owner: t }));
    else if (o !== s)
      if (t.hasValue(n)) {
        const r = t.getValue(n);
        r.liveStyle === !0 ? r.jump(s) : r.hasAnimated || r.set(s);
      } else {
        const r = t.getStaticValue(n);
        t.addValue(n, dt(r !== void 0 ? r : s, { owner: t }));
      }
  }
  for (const n in i) e[n] === void 0 && t.removeValue(n);
  return e;
}
var sn = [
    "AnimationStart",
    "AnimationComplete",
    "Update",
    "BeforeLayoutMeasure",
    "LayoutMeasure",
    "LayoutAnimationStart",
    "LayoutAnimationComplete",
  ],
  ee = {};
function tr(t) {
  ee = t;
}
function pl() {
  return ee;
}
var vl = class {
    scrapeMotionValuesFromProps(t, e, i) {
      return {};
    }
    constructor(
      {
        parent: t,
        props: e,
        presenceContext: i,
        reducedMotionConfig: n,
        skipAnimations: s,
        blockInitialAnimation: o,
        visualState: r,
      },
      a = {},
    ) {
      ((this.current = null),
        (this.children = new Set()),
        (this.isVariantNode = !1),
        (this.isControllingVariants = !1),
        (this.shouldReduceMotion = null),
        (this.shouldSkipAnimations = !1),
        (this.values = new Map()),
        (this.KeyframeResolver = pi),
        (this.features = {}),
        (this.valueSubscriptions = new Map()),
        (this.prevMotionValues = {}),
        (this.events = {}),
        (this.propEventSubscriptions = {}),
        (this.notifyUpdate = () => this.notify("Update", this.latestValues)),
        (this.render = () => {
          this.current &&
            (this.triggerBuild(),
            this.renderInstance(
              this.current,
              this.renderState,
              this.props.style,
              this.projection,
            ));
        }),
        (this.renderScheduledAt = 0),
        (this.scheduleRender = () => {
          const f = F.now();
          this.renderScheduledAt < f &&
            ((this.renderScheduledAt = f), C.render(this.render, !1, !0));
        }));
      const { latestValues: l, renderState: c } = r;
      ((this.latestValues = l),
        (this.baseTarget = { ...l }),
        (this.initialValues = e.initial ? { ...l } : {}),
        (this.renderState = c),
        (this.parent = t),
        (this.props = e),
        (this.presenceContext = i),
        (this.depth = t ? t.depth + 1 : 0),
        (this.reducedMotionConfig = n),
        (this.skipAnimationsConfig = s),
        (this.options = a),
        (this.blockInitialAnimation = !!o),
        (this.isControllingVariants = ue(e)),
        (this.isVariantNode = Qs(e)),
        this.isVariantNode && (this.variantChildren = new Set()),
        (this.manuallyAnimateOnMount = !!(t && t.current)));
      const { willChange: u, ...h } = this.scrapeMotionValuesFromProps(
        e,
        {},
        this,
      );
      for (const f in h) {
        const d = h[f];
        l[f] !== void 0 && B(d) && d.set(l[f]);
      }
    }
    mount(t) {
      ((this.current = t),
        dl.set(t, this),
        this.projection &&
          !this.projection.instance &&
          this.projection.mount(t),
        this.parent &&
          this.isVariantNode &&
          !this.isControllingVariants &&
          (this.removeFromVariantTree = this.parent.addVariantChild(this)),
        this.values.forEach((e, i) => this.bindToMotionValue(i, e)),
        this.reducedMotionConfig === "never"
          ? (this.shouldReduceMotion = !1)
          : this.reducedMotionConfig === "always"
            ? (this.shouldReduceMotion = !0)
            : (Js.current || fl(), (this.shouldReduceMotion = Ge.current)),
        (this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1),
        this.parent?.addChild(this),
        this.update(this.props, this.presenceContext));
    }
    unmount() {
      (this.projection && this.projection.unmount(),
        J(this.notifyUpdate),
        J(this.render),
        this.valueSubscriptions.forEach((t) => t()),
        this.valueSubscriptions.clear(),
        this.removeFromVariantTree && this.removeFromVariantTree(),
        this.parent?.removeChild(this));
      for (const t in this.events) this.events[t].clear();
      for (const t in this.features) {
        const e = this.features[t];
        e && (e.unmount(), (e.isMounted = !1));
      }
      this.current = null;
    }
    addChild(t) {
      (this.children.add(t),
        this.enteringChildren ?? (this.enteringChildren = new Set()),
        this.enteringChildren.add(t));
    }
    removeChild(t) {
      (this.children.delete(t),
        this.enteringChildren && this.enteringChildren.delete(t));
    }
    bindToMotionValue(t, e) {
      this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)();
      const i = bt.has(t);
      i && this.onBindTransform && this.onBindTransform();
      const n = e.on("change", (o) => {
        ((this.latestValues[t] = o),
          this.props.onUpdate && C.preRender(this.notifyUpdate),
          i && this.projection && (this.projection.isTransformDirty = !0),
          this.scheduleRender());
      });
      let s;
      (typeof window < "u" &&
        window.MotionCheckAppearSync &&
        (s = window.MotionCheckAppearSync(this, t, e)),
        this.valueSubscriptions.set(t, () => {
          (n(), s && s(), e.owner && e.stop());
        }));
    }
    sortNodePosition(t) {
      return !this.current ||
        !this.sortInstanceNodePosition ||
        this.type !== t.type
        ? 0
        : this.sortInstanceNodePosition(this.current, t.current);
    }
    updateFeatures() {
      let t = "animation";
      for (t in ee) {
        const e = ee[t];
        if (!e) continue;
        const { isEnabled: i, Feature: n } = e;
        if (
          (!this.features[t] &&
            n &&
            i(this.props) &&
            (this.features[t] = new n(this)),
          this.features[t])
        ) {
          const s = this.features[t];
          s.isMounted ? s.update() : (s.mount(), (s.isMounted = !0));
        }
      }
    }
    triggerBuild() {
      this.build(this.renderState, this.latestValues, this.props);
    }
    measureViewportBox() {
      return this.current
        ? this.measureInstanceViewportBox(this.current, this.props)
        : L();
    }
    getStaticValue(t) {
      return this.latestValues[t];
    }
    setStaticValue(t, e) {
      this.latestValues[t] = e;
    }
    update(t, e) {
      ((t.transformTemplate || this.props.transformTemplate) &&
        this.scheduleRender(),
        (this.prevProps = this.props),
        (this.props = t),
        (this.prevPresenceContext = this.presenceContext),
        (this.presenceContext = e));
      for (let i = 0; i < sn.length; i++) {
        const n = sn[i];
        this.propEventSubscriptions[n] &&
          (this.propEventSubscriptions[n](),
          delete this.propEventSubscriptions[n]);
        const s = t["on" + n];
        s && (this.propEventSubscriptions[n] = this.on(n, s));
      }
      ((this.prevMotionValues = ml(
        this,
        this.scrapeMotionValuesFromProps(t, this.prevProps || {}, this),
        this.prevMotionValues,
      )),
        this.handleChildMotionValue && this.handleChildMotionValue());
    }
    getProps() {
      return this.props;
    }
    getVariant(t) {
      return this.props.variants ? this.props.variants[t] : void 0;
    }
    getDefaultTransition() {
      return this.props.transition;
    }
    getTransformPagePoint() {
      return this.props.transformPagePoint;
    }
    getClosestVariantNode() {
      return this.isVariantNode
        ? this
        : this.parent
          ? this.parent.getClosestVariantNode()
          : void 0;
    }
    addVariantChild(t) {
      const e = this.getClosestVariantNode();
      if (e)
        return (
          e.variantChildren && e.variantChildren.add(t),
          () => e.variantChildren.delete(t)
        );
    }
    addValue(t, e) {
      const i = this.values.get(t);
      e !== i &&
        (i && this.removeValue(t),
        this.bindToMotionValue(t, e),
        this.values.set(t, e),
        (this.latestValues[t] = e.get()));
    }
    removeValue(t) {
      this.values.delete(t);
      const e = this.valueSubscriptions.get(t);
      (e && (e(), this.valueSubscriptions.delete(t)),
        delete this.latestValues[t],
        this.removeValueFromRenderState(t, this.renderState));
    }
    hasValue(t) {
      return this.values.has(t);
    }
    getValue(t, e) {
      if (this.props.values && this.props.values[t])
        return this.props.values[t];
      let i = this.values.get(t);
      return (
        i === void 0 &&
          e !== void 0 &&
          ((i = dt(e === null ? void 0 : e, { owner: this })),
          this.addValue(t, i)),
        i
      );
    }
    readValue(t, e) {
      let i =
        this.latestValues[t] !== void 0 || !this.current
          ? this.latestValues[t]
          : (this.getBaseTargetFromProps(this.props, t) ??
            this.readValueFromInstance(this.current, t, this.options));
      return (
        i != null &&
          (typeof i == "string" && (ts(i) || is(i))
            ? (i = parseFloat(i))
            : !cl(i) && nt.test(e) && (i = zs(t, e)),
          this.setBaseTarget(t, B(i) ? i.get() : i)),
        B(i) ? i.get() : i
      );
    }
    setBaseTarget(t, e) {
      this.baseTarget[t] = e;
    }
    getBaseTarget(t) {
      const { initial: e } = this.props;
      let i;
      if (typeof e == "string" || typeof e == "object") {
        const s = yi(this.props, e, this.presenceContext?.custom);
        s && (i = s[t]);
      }
      if (e && i !== void 0) return i;
      const n = this.getBaseTargetFromProps(this.props, t);
      return n !== void 0 && !B(n)
        ? n
        : this.initialValues[t] !== void 0 && i === void 0
          ? void 0
          : this.baseTarget[t];
    }
    on(t, e) {
      return (
        this.events[t] || (this.events[t] = new si()),
        this.events[t].add(e)
      );
    }
    notify(t, ...e) {
      this.events[t] && this.events[t].notify(...e);
    }
    scheduleRenderMicrotask() {
      Pi.render(this.render);
    }
  },
  er = class extends vl {
    constructor() {
      (super(...arguments), (this.KeyframeResolver = $a));
    }
    sortInstanceNodePosition(t, e) {
      return t.compareDocumentPosition(e) & 2 ? 1 : -1;
    }
    getBaseTargetFromProps(t, e) {
      const i = t.style;
      return i ? i[e] : void 0;
    }
    removeValueFromRenderState(t, { vars: e, style: i }) {
      (delete e[t], delete i[t]);
    }
    handleChildMotionValue() {
      this.childSubscription &&
        (this.childSubscription(), delete this.childSubscription);
      const { children: t } = this.props;
      B(t) &&
        (this.childSubscription = t.on("change", (e) => {
          this.current && (this.current.textContent = `${e}`);
        }));
    }
  },
  st = class {
    constructor(t) {
      ((this.isMounted = !1), (this.node = t));
    }
    update() {}
  };
function ir({ top: t, left: e, right: i, bottom: n }) {
  return { x: { min: e, max: i }, y: { min: t, max: n } };
}
function gl({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function yl(t, e) {
  if (!e) return t;
  const i = e({ x: t.left, y: t.top }),
    n = e({ x: t.right, y: t.bottom });
  return { top: i.y, left: i.x, bottom: n.y, right: n.x };
}
function Te(t) {
  return t === void 0 || t === 1;
}
function Xe({ scale: t, scaleX: e, scaleY: i }) {
  return !Te(t) || !Te(e) || !Te(i);
}
function at(t) {
  return (
    Xe(t) ||
    nr(t) ||
    t.z ||
    t.rotate ||
    t.rotateX ||
    t.rotateY ||
    t.skewX ||
    t.skewY
  );
}
function nr(t) {
  return rn(t.x) || rn(t.y);
}
function rn(t) {
  return t && t !== "0%";
}
function ie(t, e, i) {
  return i + e * (t - i);
}
function on(t, e, i, n, s) {
  return (s !== void 0 && (t = ie(t, s, n)), ie(t, i, n) + e);
}
function Ye(t, e = 0, i = 1, n, s) {
  ((t.min = on(t.min, e, i, n, s)), (t.max = on(t.max, e, i, n, s)));
}
function sr(t, { x: e, y: i }) {
  (Ye(t.x, e.translate, e.scale, e.originPoint),
    Ye(t.y, i.translate, i.scale, i.originPoint));
}
var an = 0.999999999999,
  ln = 1.0000000000001;
function xl(t, e, i, n = !1) {
  const s = i.length;
  if (!s) return;
  e.x = e.y = 1;
  let o, r;
  for (let a = 0; a < s; a++) {
    ((o = i[a]), (r = o.projectionDelta));
    const { visualElement: l } = o.options;
    (l && l.props.style && l.props.style.display === "contents") ||
      (n &&
        o.options.layoutScroll &&
        o.scroll &&
        o !== o.root &&
        Tt(t, { x: -o.scroll.offset.x, y: -o.scroll.offset.y }),
      r && ((e.x *= r.x.scale), (e.y *= r.y.scale), sr(t, r)),
      n && at(o.latestValues) && Tt(t, o.latestValues));
  }
  (e.x < ln && e.x > an && (e.x = 1), e.y < ln && e.y > an && (e.y = 1));
}
function xt(t, e) {
  ((t.min = t.min + e), (t.max = t.max + e));
}
function un(t, e, i, n, s = 0.5) {
  Ye(t, e, i, D(t.min, t.max, s), n);
}
function Tt(t, e) {
  (un(t.x, e.x, e.scaleX, e.scale, e.originX),
    un(t.y, e.y, e.scaleY, e.scale, e.originY));
}
function rr(t, e) {
  return ir(yl(t.getBoundingClientRect(), e));
}
function Tl(t, e, i) {
  const n = rr(t, i),
    { scroll: s } = e;
  return (s && (xt(n.x, s.offset.x), xt(n.y, s.offset.y)), n);
}
var wl = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
  },
  Pl = St.length;
function Sl(t, e, i) {
  let n = "",
    s = !0;
  for (let o = 0; o < Pl; o++) {
    const r = St[o],
      a = t[r];
    if (a === void 0) continue;
    let l = !0;
    if (typeof a == "number") l = a === (r.startsWith("scale") ? 1 : 0);
    else {
      const c = parseFloat(a);
      l = r.startsWith("scale") ? c === 1 : c === 0;
    }
    if (!l || i) {
      const c = Gs(a, wi[r]);
      if (!l) {
        s = !1;
        const u = wl[r] || r;
        n += `${u}(${c}) `;
      }
      i && (e[r] = c);
    }
  }
  return ((n = n.trim()), i ? (n = i(e, s ? "" : n)) : s && (n = "none"), n);
}
function Ci(t, e, i) {
  const { style: n, vars: s, transformOrigin: o } = t;
  let r = !1,
    a = !1;
  for (const l in e) {
    const c = e[l];
    if (bt.has(l)) {
      r = !0;
      continue;
    } else if (vs(l)) {
      s[l] = c;
      continue;
    } else {
      const u = Gs(c, wi[l]);
      l.startsWith("origin") ? ((a = !0), (o[l] = u)) : (n[l] = u);
    }
  }
  if (
    (e.transform ||
      (r || i
        ? (n.transform = Sl(e, t.transform, i))
        : n.transform && (n.transform = "none")),
    a)
  ) {
    const { originX: l = "50%", originY: c = "50%", originZ: u = 0 } = o;
    n.transformOrigin = `${l} ${c} ${u}`;
  }
}
function or(t, { style: e, vars: i }, n, s) {
  const o = t.style;
  let r;
  for (r in e) o[r] = e[r];
  s?.applyProjectionStyles(o, n);
  for (r in i) o.setProperty(r, i[r]);
}
function cn(t, e) {
  return e.max === e.min ? 0 : (t / (e.max - e.min)) * 100;
}
var Vt = {
    correct: (t, e) => {
      if (!e.target) return t;
      if (typeof t == "string")
        if (x.test(t)) t = parseFloat(t);
        else return t;
      return `${cn(t, e.target.x)}% ${cn(t, e.target.y)}%`;
    },
  },
  bl = {
    correct: (t, { treeScale: e, projectionDelta: i }) => {
      const n = t,
        s = nt.parse(t);
      if (s.length > 5) return n;
      const o = nt.createTransformer(t),
        r = typeof s[0] != "number" ? 1 : 0,
        a = i.x.scale * e.x,
        l = i.y.scale * e.y;
      ((s[0 + r] /= a), (s[1 + r] /= l));
      const c = D(a, l, 0.5);
      return (
        typeof s[2 + r] == "number" && (s[2 + r] /= c),
        typeof s[3 + r] == "number" && (s[3 + r] /= c),
        o(s)
      );
    },
  },
  qe = {
    borderRadius: {
      ...Vt,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ],
    },
    borderTopLeftRadius: Vt,
    borderTopRightRadius: Vt,
    borderBottomLeftRadius: Vt,
    borderBottomRightRadius: Vt,
    boxShadow: bl,
  };
function ar(t, { layout: e, layoutId: i }) {
  return (
    bt.has(t) ||
    t.startsWith("origin") ||
    ((e || i !== void 0) && (!!qe[t] || t === "opacity"))
  );
}
function Mi(t, e, i) {
  const n = t.style,
    s = e?.style,
    o = {};
  if (!n) return o;
  for (const r in n)
    (B(n[r]) ||
      (s && B(s[r])) ||
      ar(r, t) ||
      i?.getValue(r)?.liveStyle !== void 0) &&
      (o[r] = n[r]);
  return o;
}
function Al(t) {
  return window.getComputedStyle(t);
}
var Vl = class extends er {
    constructor() {
      (super(...arguments), (this.type = "html"), (this.renderInstance = or));
    }
    readValueFromInstance(t, e) {
      if (bt.has(e)) return this.projection?.isProjecting ? Fe(e) : Ho(t, e);
      {
        const i = Al(t),
          n = (vs(e) ? i.getPropertyValue(e) : i[e]) || 0;
        return typeof n == "string" ? n.trim() : n;
      }
    }
    measureInstanceViewportBox(t, { transformPagePoint: e }) {
      return rr(t, e);
    }
    build(t, e, i) {
      Ci(t, e, i.transformTemplate);
    }
    scrapeMotionValuesFromProps(t, e, i) {
      return Mi(t, e, i);
    }
  },
  Cl = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
  Ml = { offset: "strokeDashoffset", array: "strokeDasharray" };
function Dl(t, e, i = 1, n = 0, s = !0) {
  t.pathLength = 1;
  const o = s ? Cl : Ml;
  ((t[o.offset] = `${-n}`), (t[o.array] = `${e} ${i}`));
}
var El = ["offsetDistance", "offsetPath", "offsetRotate", "offsetAnchor"];
function lr(
  t,
  {
    attrX: e,
    attrY: i,
    attrScale: n,
    pathLength: s,
    pathSpacing: o = 1,
    pathOffset: r = 0,
    ...a
  },
  l,
  c,
  u,
) {
  if ((Ci(t, a, c), l)) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  ((t.attrs = t.style), (t.style = {}));
  const { attrs: h, style: f } = t;
  (h.transform && ((f.transform = h.transform), delete h.transform),
    (f.transform || h.transformOrigin) &&
      ((f.transformOrigin = h.transformOrigin ?? "50% 50%"),
      delete h.transformOrigin),
    f.transform &&
      ((f.transformBox = u?.transformBox ?? "fill-box"),
      delete h.transformBox));
  for (const d of El) h[d] !== void 0 && ((f[d] = h[d]), delete h[d]);
  (e !== void 0 && (h.x = e),
    i !== void 0 && (h.y = i),
    n !== void 0 && (h.scale = n),
    s !== void 0 && Dl(h, s, o, r, !1));
}
var ur = new Set([
    "baseFrequency",
    "diffuseConstant",
    "kernelMatrix",
    "kernelUnitLength",
    "keySplines",
    "keyTimes",
    "limitingConeAngle",
    "markerHeight",
    "markerWidth",
    "numOctaves",
    "targetX",
    "targetY",
    "surfaceScale",
    "specularConstant",
    "specularExponent",
    "stdDeviation",
    "tableValues",
    "viewBox",
    "gradientTransform",
    "pathLength",
    "startOffset",
    "textLength",
    "lengthAdjust",
  ]),
  cr = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function Rl(t, e, i, n) {
  or(t, e, void 0, n);
  for (const s in e.attrs) t.setAttribute(ur.has(s) ? s : Ti(s), e.attrs[s]);
}
function hr(t, e, i) {
  const n = Mi(t, e, i);
  for (const s in t)
    if (B(t[s]) || B(e[s])) {
      const o =
        St.indexOf(s) !== -1
          ? "attr" + s.charAt(0).toUpperCase() + s.substring(1)
          : s;
      n[o] = t[s];
    }
  return n;
}
var Ll = class extends er {
    constructor() {
      (super(...arguments),
        (this.type = "svg"),
        (this.isSVGTag = !1),
        (this.measureInstanceViewportBox = L));
    }
    getBaseTargetFromProps(t, e) {
      return t[e];
    }
    readValueFromInstance(t, e) {
      if (bt.has(e)) {
        const i = $s(e);
        return (i && i.default) || 0;
      }
      return ((e = ur.has(e) ? e : Ti(e)), t.getAttribute(e));
    }
    scrapeMotionValuesFromProps(t, e, i) {
      return hr(t, e, i);
    }
    build(t, e, i) {
      lr(t, e, this.isSVGTag, i.transformTemplate, i.style);
    }
    renderInstance(t, e, i, n) {
      Rl(t, e, i, n);
    }
    mount(t) {
      ((this.isSVGTag = cr(t.tagName)), super.mount(t));
    }
  },
  kl = Vi.length;
function fr(t) {
  if (!t) return;
  if (!t.isControllingVariants) {
    const i = t.parent ? fr(t.parent) || {} : {};
    return (t.props.initial !== void 0 && (i.initial = t.props.initial), i);
  }
  const e = {};
  for (let i = 0; i < kl; i++) {
    const n = Vi[i],
      s = t.props[n];
    (Ft(s) || s === !1) && (e[n] = s);
  }
  return e;
}
function dr(t, e) {
  if (!Array.isArray(e)) return !1;
  const i = e.length;
  if (i !== t.length) return !1;
  for (let n = 0; n < i; n++) if (e[n] !== t[n]) return !1;
  return !0;
}
var Il = [...Ai].reverse(),
  Bl = Ai.length;
function Fl(t) {
  return (e) =>
    Promise.all(e.map(({ animation: i, options: n }) => Ws(t, i, n)));
}
function jl(t) {
  let e = Fl(t),
    i = hn(),
    n = !0;
  const s = (l) => (c, u) => {
    const h = wt(t, u, l === "exit" ? t.presenceContext?.custom : void 0);
    if (h) {
      const { transition: f, transitionEnd: d, ...m } = h;
      c = { ...c, ...m, ...d };
    }
    return c;
  };
  function o(l) {
    e = l(t);
  }
  function r(l) {
    const { props: c } = t,
      u = fr(t.parent) || {},
      h = [],
      f = new Set();
    let d = {},
      m = 1 / 0;
    for (let g = 0; g < Bl; g++) {
      const p = Il[g],
        w = i[p],
        y = c[p] !== void 0 ? c[p] : u[p],
        S = Ft(y),
        b = p === l ? w.isActive : null;
      b === !1 && (m = g);
      let V = y === u[p] && y !== c[p] && S;
      if (
        (V && n && t.manuallyAnimateOnMount && (V = !1),
        (w.protectedKeys = { ...d }),
        (!w.isActive && b === null) ||
          (!y && !w.prevProp) ||
          le(y) ||
          typeof y == "boolean")
      )
        continue;
      const E = Ol(w.prevProp, y);
      let P = E || (p === l && w.isActive && !V && S) || (g > m && S),
        A = !1;
      const _ = Array.isArray(y) ? y : [y];
      let Y = _.reduce(s(p), {});
      b === !1 && (Y = {});
      const { prevResolvedValues: At = {} } = w,
        fe = { ...At, ...Y },
        Ri = (k) => {
          ((P = !0),
            f.has(k) && ((A = !0), f.delete(k)),
            (w.needsAnimating[k] = !0));
          const O = t.getValue(k);
          O && (O.liveStyle = !1);
        };
      for (const k in fe) {
        const O = Y[k],
          rt = At[k];
        if (d.hasOwnProperty(k)) continue;
        let mt = !1;
        (_e(O) && _e(rt) ? (mt = !dr(O, rt)) : (mt = O !== rt),
          mt
            ? O != null
              ? Ri(k)
              : f.add(k)
            : O !== void 0 && f.has(k)
              ? Ri(k)
              : (w.protectedKeys[k] = !0));
      }
      ((w.prevProp = y),
        (w.prevResolvedValues = Y),
        w.isActive && (d = { ...d, ...Y }),
        n && t.blockInitialAnimation && (P = !1));
      const Li = V && E;
      P &&
        (!Li || A) &&
        h.push(
          ..._.map((k) => {
            const O = { type: p };
            if (
              typeof k == "string" &&
              n &&
              !Li &&
              t.manuallyAnimateOnMount &&
              t.parent
            ) {
              const { parent: rt } = t,
                mt = wt(rt, k);
              if (rt.enteringChildren && mt) {
                const { delayChildren: Nr } = mt.transition || {};
                O.delay = Bs(rt.enteringChildren, t, Nr);
              }
            }
            return { animation: k, options: O };
          }),
        );
    }
    if (f.size) {
      const g = {};
      if (typeof c.initial != "boolean") {
        const p = wt(t, Array.isArray(c.initial) ? c.initial[0] : c.initial);
        p && p.transition && (g.transition = p.transition);
      }
      (f.forEach((p) => {
        const w = t.getBaseTarget(p),
          y = t.getValue(p);
        (y && (y.liveStyle = !0), (g[p] = w ?? null));
      }),
        h.push({ animation: g }));
    }
    let T = !!h.length;
    return (
      n &&
        (c.initial === !1 || c.initial === c.animate) &&
        !t.manuallyAnimateOnMount &&
        (T = !1),
      (n = !1),
      T ? e(h) : Promise.resolve()
    );
  }
  function a(l, c) {
    if (i[l].isActive === c) return Promise.resolve();
    (t.variantChildren?.forEach((h) => h.animationState?.setActive(l, c)),
      (i[l].isActive = c));
    const u = r(l);
    for (const h in i) i[h].protectedKeys = {};
    return u;
  }
  return {
    animateChanges: r,
    setActive: a,
    setAnimateFunction: o,
    getState: () => i,
    reset: () => {
      i = hn();
    },
  };
}
function Ol(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !dr(e, t) : !1;
}
function ot(t = !1) {
  return {
    isActive: t,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {},
  };
}
function hn() {
  return {
    animate: ot(!0),
    whileInView: ot(),
    whileHover: ot(),
    whileTap: ot(),
    whileDrag: ot(),
    whileFocus: ot(),
    exit: ot(),
  };
}
function fn(t, e) {
  ((t.min = e.min), (t.max = e.max));
}
function K(t, e) {
  (fn(t.x, e.x), fn(t.y, e.y));
}
function dn(t, e) {
  ((t.translate = e.translate),
    (t.scale = e.scale),
    (t.originPoint = e.originPoint),
    (t.origin = e.origin));
}
var mr = 1e-4,
  Nl = 1 - mr,
  Ul = 1 + mr,
  pr = 0.01,
  Wl = 0 - pr,
  _l = 0 + pr;
function j(t) {
  return t.max - t.min;
}
function Kl(t, e, i) {
  return Math.abs(t - e) <= i;
}
function mn(t, e, i, n = 0.5) {
  ((t.origin = n),
    (t.originPoint = D(e.min, e.max, t.origin)),
    (t.scale = j(i) / j(e)),
    (t.translate = D(i.min, i.max, t.origin) - t.originPoint),
    ((t.scale >= Nl && t.scale <= Ul) || isNaN(t.scale)) && (t.scale = 1),
    ((t.translate >= Wl && t.translate <= _l) || isNaN(t.translate)) &&
      (t.translate = 0));
}
function Rt(t, e, i, n) {
  (mn(t.x, e.x, i.x, n ? n.originX : void 0),
    mn(t.y, e.y, i.y, n ? n.originY : void 0));
}
function pn(t, e, i) {
  ((t.min = i.min + e.min), (t.max = t.min + j(e)));
}
function $l(t, e, i) {
  (pn(t.x, e.x, i.x), pn(t.y, e.y, i.y));
}
function vn(t, e, i) {
  ((t.min = e.min - i.min), (t.max = t.min + j(e)));
}
function ne(t, e, i) {
  (vn(t.x, e.x, i.x), vn(t.y, e.y, i.y));
}
function gn(t, e, i, n, s) {
  return (
    (t -= e),
    (t = ie(t, 1 / i, n)),
    s !== void 0 && (t = ie(t, 1 / s, n)),
    t
  );
}
function zl(t, e = 0, i = 1, n = 0.5, s, o = t, r = t) {
  if (
    (G.test(e) && ((e = parseFloat(e)), (e = D(r.min, r.max, e / 100) - r.min)),
    typeof e != "number")
  )
    return;
  let a = D(o.min, o.max, n);
  (t === o && (a -= e),
    (t.min = gn(t.min, e, i, a, s)),
    (t.max = gn(t.max, e, i, a, s)));
}
function yn(t, e, [i, n, s], o, r) {
  zl(t, e[i], e[n], e[s], e.scale, o, r);
}
var Hl = ["x", "scaleX", "originX"],
  Gl = ["y", "scaleY", "originY"];
function xn(t, e, i, n) {
  (yn(t.x, e, Hl, i ? i.x : void 0, n ? n.x : void 0),
    yn(t.y, e, Gl, i ? i.y : void 0, n ? n.y : void 0));
}
function Tn(t) {
  return t.translate === 0 && t.scale === 1;
}
function vr(t) {
  return Tn(t.x) && Tn(t.y);
}
function wn(t, e) {
  return t.min === e.min && t.max === e.max;
}
function Xl(t, e) {
  return wn(t.x, e.x) && wn(t.y, e.y);
}
function Pn(t, e) {
  return (
    Math.round(t.min) === Math.round(e.min) &&
    Math.round(t.max) === Math.round(e.max)
  );
}
function gr(t, e) {
  return Pn(t.x, e.x) && Pn(t.y, e.y);
}
function Sn(t) {
  return j(t.x) / j(t.y);
}
function bn(t, e) {
  return (
    t.translate === e.translate &&
    t.scale === e.scale &&
    t.originPoint === e.originPoint
  );
}
function N(t) {
  return [t("x"), t("y")];
}
function Yl(t, e, i) {
  let n = "";
  const s = t.x.translate / e.x,
    o = t.y.translate / e.y,
    r = i?.z || 0;
  if (
    ((s || o || r) && (n = `translate3d(${s}px, ${o}px, ${r}px) `),
    (e.x !== 1 || e.y !== 1) && (n += `scale(${1 / e.x}, ${1 / e.y}) `),
    i)
  ) {
    const {
      transformPerspective: c,
      rotate: u,
      rotateX: h,
      rotateY: f,
      skewX: d,
      skewY: m,
    } = i;
    (c && (n = `perspective(${c}px) ${n}`),
      u && (n += `rotate(${u}deg) `),
      h && (n += `rotateX(${h}deg) `),
      f && (n += `rotateY(${f}deg) `),
      d && (n += `skewX(${d}deg) `),
      m && (n += `skewY(${m}deg) `));
  }
  const a = t.x.scale * e.x,
    l = t.y.scale * e.y;
  return ((a !== 1 || l !== 1) && (n += `scale(${a}, ${l})`), n || "none");
}
var yr = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
  ql = yr.length,
  An = (t) => (typeof t == "string" ? parseFloat(t) : t),
  Vn = (t) => typeof t == "number" || x.test(t);
function Zl(t, e, i, n, s, o) {
  s
    ? ((t.opacity = D(0, i.opacity ?? 1, Jl(n))),
      (t.opacityExit = D(e.opacity ?? 1, 0, Ql(n))))
    : o && (t.opacity = D(e.opacity ?? 1, i.opacity ?? 1, n));
  for (let r = 0; r < ql; r++) {
    const a = `border${yr[r]}Radius`;
    let l = Cn(e, a),
      c = Cn(i, a);
    (l === void 0 && c === void 0) ||
      (l || (l = 0),
      c || (c = 0),
      l === 0 || c === 0 || Vn(l) === Vn(c)
        ? ((t[a] = Math.max(D(An(l), An(c), n), 0)),
          (G.test(c) || G.test(l)) && (t[a] += "%"))
        : (t[a] = c));
  }
  (e.rotate || i.rotate) && (t.rotate = D(e.rotate || 0, i.rotate || 0, n));
}
function Cn(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
var Jl = xr(0, 0.5, cs),
  Ql = xr(0.5, 0.95, W);
function xr(t, e, i) {
  return (n) => (n < t ? 0 : n > e ? 1 : i(kt(t, e, n)));
}
function tu(t, e, i) {
  const n = B(t) ? t : dt(t);
  return (n.start(gi("", n, e, i)), n.animation);
}
function jt(t, e, i, n = { passive: !0 }) {
  return (t.addEventListener(e, i, n), () => t.removeEventListener(e, i));
}
var eu = (t, e) => t.depth - e.depth,
  iu = class {
    constructor() {
      ((this.children = []), (this.isDirty = !1));
    }
    add(t) {
      (ei(this.children, t), (this.isDirty = !0));
    }
    remove(t) {
      (ii(this.children, t), (this.isDirty = !0));
    }
    forEach(t) {
      (this.isDirty && this.children.sort(eu),
        (this.isDirty = !1),
        this.children.forEach(t));
    }
  };
function nu(t, e) {
  const i = F.now(),
    n = ({ timestamp: s }) => {
      const o = s - i;
      o >= e && (J(n), t(o - e));
    };
  return (C.setup(n, !0), () => J(n));
}
function Zt(t) {
  return B(t) ? t.get() : t;
}
var su = class {
    constructor() {
      this.members = [];
    }
    add(t) {
      (ei(this.members, t), t.scheduleRender());
    }
    remove(t) {
      if (
        (ii(this.members, t),
        t === this.prevLead && (this.prevLead = void 0),
        t === this.lead)
      ) {
        const e = this.members[this.members.length - 1];
        e && this.promote(e);
      }
    }
    relegate(t) {
      const e = this.members.findIndex((n) => t === n);
      if (e === 0) return !1;
      let i;
      for (let n = e; n >= 0; n--) {
        const s = this.members[n];
        if (s.isPresent !== !1) {
          i = s;
          break;
        }
      }
      return i ? (this.promote(i), !0) : !1;
    }
    promote(t, e) {
      const i = this.lead;
      if (t !== i && ((this.prevLead = i), (this.lead = t), t.show(), i)) {
        (i.instance && i.scheduleRender(), t.scheduleRender());
        const n = i.options.layoutDependency,
          s = t.options.layoutDependency;
        (n !== void 0 && s !== void 0 && n === s) ||
          ((t.resumeFrom = i),
          e && (t.resumeFrom.preserveOpacity = !0),
          i.snapshot &&
            ((t.snapshot = i.snapshot),
            (t.snapshot.latestValues = i.animationValues || i.latestValues)),
          t.root && t.root.isUpdating && (t.isLayoutDirty = !0));
        const { crossfade: o } = t.options;
        o === !1 && i.hide();
      }
    }
    exitAnimationComplete() {
      this.members.forEach((t) => {
        const { options: e, resumingFrom: i } = t;
        (e.onExitComplete && e.onExitComplete(),
          i && i.options.onExitComplete && i.options.onExitComplete());
      });
    }
    scheduleRender() {
      this.members.forEach((t) => {
        t.instance && t.scheduleRender(!1);
      });
    }
    removeLeadSnapshot() {
      this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
    }
  },
  Jt = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 },
  lt = { nodes: 0, calculatedTargetDeltas: 0, calculatedProjections: 0 },
  we = ["", "X", "Y", "Z"],
  ru = 1e3,
  ou = 0;
function Pe(t, e, i, n) {
  const { latestValues: s } = e;
  s[t] && ((i[t] = s[t]), e.setStaticValue(t, 0), n && (n[t] = 0));
}
function Tr(t) {
  if (((t.hasCheckedOptimisedAppear = !0), t.root === t)) return;
  const { visualElement: e } = t.options;
  if (!e) return;
  const i = Ns(e);
  if (window.MotionHasOptimisedAnimation(i, "transform")) {
    const { layout: s, layoutId: o } = t.options;
    window.MotionCancelOptimisedAnimation(i, "transform", C, !(s || o));
  }
  const { parent: n } = t;
  n && !n.hasCheckedOptimisedAppear && Tr(n);
}
function wr({
  attachResizeListener: t,
  defaultParent: e,
  measureScroll: i,
  checkIsScrollRoot: n,
  resetTransform: s,
}) {
  return class {
    constructor(r = {}, a = e?.()) {
      ((this.id = ou++),
        (this.animationId = 0),
        (this.animationCommitId = 0),
        (this.children = new Set()),
        (this.options = {}),
        (this.isTreeAnimating = !1),
        (this.isAnimationBlocked = !1),
        (this.isLayoutDirty = !1),
        (this.isProjectionDirty = !1),
        (this.isSharedProjectionDirty = !1),
        (this.isTransformDirty = !1),
        (this.updateManuallyBlocked = !1),
        (this.updateBlockedByResize = !1),
        (this.isUpdating = !1),
        (this.isSVG = !1),
        (this.needsReset = !1),
        (this.shouldResetTransform = !1),
        (this.hasCheckedOptimisedAppear = !1),
        (this.treeScale = { x: 1, y: 1 }),
        (this.eventHandlers = new Map()),
        (this.hasTreeAnimated = !1),
        (this.layoutVersion = 0),
        (this.updateScheduled = !1),
        (this.scheduleUpdate = () => this.update()),
        (this.projectionUpdateScheduled = !1),
        (this.checkUpdateFailed = () => {
          this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
        }),
        (this.updateProjection = () => {
          ((this.projectionUpdateScheduled = !1),
            z.value &&
              (lt.nodes =
                lt.calculatedTargetDeltas =
                lt.calculatedProjections =
                  0),
            this.nodes.forEach(uu),
            this.nodes.forEach(du),
            this.nodes.forEach(mu),
            this.nodes.forEach(cu),
            z.addProjectionMetrics && z.addProjectionMetrics(lt));
        }),
        (this.resolvedRelativeTargetAt = 0),
        (this.linkedParentVersion = 0),
        (this.hasProjected = !1),
        (this.isVisible = !0),
        (this.animationProgress = 0),
        (this.sharedNodes = new Map()),
        (this.latestValues = r),
        (this.root = a ? a.root || a : this),
        (this.path = a ? [...a.path, a] : []),
        (this.parent = a),
        (this.depth = a ? a.depth + 1 : 0));
      for (let l = 0; l < this.path.length; l++)
        this.path[l].shouldResetTransform = !0;
      this.root === this && (this.nodes = new iu());
    }
    addEventListener(r, a) {
      return (
        this.eventHandlers.has(r) || this.eventHandlers.set(r, new si()),
        this.eventHandlers.get(r).add(a)
      );
    }
    notifyListeners(r, ...a) {
      const l = this.eventHandlers.get(r);
      l && l.notify(...a);
    }
    hasListeners(r) {
      return this.eventHandlers.has(r);
    }
    mount(r) {
      if (this.instance) return;
      ((this.isSVG = bi(r) && !al(r)), (this.instance = r));
      const { layoutId: a, layout: l, visualElement: c } = this.options;
      if (
        (c && !c.current && c.mount(r),
        this.root.nodes.add(this),
        this.parent && this.parent.children.add(this),
        this.root.hasTreeAnimated && (l || a) && (this.isLayoutDirty = !0),
        t)
      ) {
        let u,
          h = 0;
        const f = () => (this.root.updateBlockedByResize = !1);
        (C.read(() => {
          h = window.innerWidth;
        }),
          t(r, () => {
            const d = window.innerWidth;
            d !== h &&
              ((h = d),
              (this.root.updateBlockedByResize = !0),
              u && u(),
              (u = nu(f, 250)),
              Jt.hasAnimatedSinceResize &&
                ((Jt.hasAnimatedSinceResize = !1), this.nodes.forEach(En)));
          }));
      }
      (a && this.root.registerSharedNode(a, this),
        this.options.animate !== !1 &&
          c &&
          (a || l) &&
          this.addEventListener(
            "didUpdate",
            ({
              delta: u,
              hasLayoutChanged: h,
              hasRelativeLayoutChanged: f,
              layout: d,
            }) => {
              if (this.isTreeAnimationBlocked()) {
                ((this.target = void 0), (this.relativeTarget = void 0));
                return;
              }
              const m =
                  this.options.transition || c.getDefaultTransition() || xu,
                { onLayoutAnimationStart: T, onLayoutAnimationComplete: g } =
                  c.getProps(),
                p = !this.targetLayout || !gr(this.targetLayout, d),
                w = !h && f;
              if (
                this.options.layoutRoot ||
                this.resumeFrom ||
                w ||
                (h && (p || !this.currentAnimation))
              ) {
                this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0));
                const y = { ...vi(m, "layout"), onPlay: T, onComplete: g };
                ((c.shouldReduceMotion || this.options.layoutRoot) &&
                  ((y.delay = 0), (y.type = !1)),
                  this.startAnimation(y),
                  this.setAnimationOrigin(u, w));
              } else
                (h || En(this),
                  this.isLead() &&
                    this.options.onExitComplete &&
                    this.options.onExitComplete());
              this.targetLayout = d;
            },
          ));
    }
    unmount() {
      (this.options.layoutId && this.willUpdate(),
        this.root.nodes.remove(this));
      const r = this.getStack();
      (r && r.remove(this),
        this.parent && this.parent.children.delete(this),
        (this.instance = void 0),
        this.eventHandlers.clear(),
        J(this.updateProjection));
    }
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return (
        this.isAnimationBlocked ||
        (this.parent && this.parent.isTreeAnimationBlocked()) ||
        !1
      );
    }
    startUpdate() {
      this.isUpdateBlocked() ||
        ((this.isUpdating = !0),
        this.nodes && this.nodes.forEach(pu),
        this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: r } = this.options;
      return r && r.getProps().transformTemplate;
    }
    willUpdate(r = !0) {
      if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (
        (window.MotionCancelOptimisedAnimation &&
          !this.hasCheckedOptimisedAppear &&
          Tr(this),
        !this.root.isUpdating && this.root.startUpdate(),
        this.isLayoutDirty)
      )
        return;
      this.isLayoutDirty = !0;
      for (let u = 0; u < this.path.length; u++) {
        const h = this.path[u];
        ((h.shouldResetTransform = !0),
          h.updateScroll("snapshot"),
          h.options.layoutRoot && h.willUpdate(!1));
      }
      const { layoutId: a, layout: l } = this.options;
      if (a === void 0 && !l) return;
      const c = this.getTransformTemplate();
      ((this.prevTransformTemplateValue = c
        ? c(this.latestValues, "")
        : void 0),
        this.updateSnapshot(),
        r && this.notifyListeners("willUpdate"));
    }
    update() {
      if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
        (this.unblockUpdate(),
          this.clearAllSnapshots(),
          this.nodes.forEach(Mn));
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Dn);
        return;
      }
      ((this.animationCommitId = this.animationId),
        this.isUpdating
          ? ((this.isUpdating = !1),
            this.nodes.forEach(fu),
            this.nodes.forEach(au),
            this.nodes.forEach(lu))
          : this.nodes.forEach(Dn),
        this.clearAllSnapshots());
      const r = F.now();
      ((I.delta = X(0, 1e3 / 60, r - I.timestamp)),
        (I.timestamp = r),
        (I.isProcessing = !0),
        de.update.process(I),
        de.preRender.process(I),
        de.render.process(I),
        (I.isProcessing = !1));
    }
    didUpdate() {
      this.updateScheduled ||
        ((this.updateScheduled = !0), Pi.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      (this.nodes.forEach(hu), this.sharedNodes.forEach(vu));
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0),
        C.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      C.postRender(() => {
        this.isLayoutDirty
          ? this.root.didUpdate()
          : this.root.checkUpdateFailed();
      });
    }
    updateSnapshot() {
      this.snapshot ||
        !this.instance ||
        ((this.snapshot = this.measure()),
        this.snapshot &&
          !j(this.snapshot.measuredBox.x) &&
          !j(this.snapshot.measuredBox.y) &&
          (this.snapshot = void 0));
    }
    updateLayout() {
      if (
        !this.instance ||
        (this.updateScroll(),
        !(this.options.alwaysMeasureLayout && this.isLead()) &&
          !this.isLayoutDirty)
      )
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let l = 0; l < this.path.length; l++) this.path[l].updateScroll();
      const r = this.layout;
      ((this.layout = this.measure(!1)),
        this.layoutVersion++,
        (this.layoutCorrected = L()),
        (this.isLayoutDirty = !1),
        (this.projectionDelta = void 0),
        this.notifyListeners("measure", this.layout.layoutBox));
      const { visualElement: a } = this.options;
      a &&
        a.notify(
          "LayoutMeasure",
          this.layout.layoutBox,
          r ? r.layoutBox : void 0,
        );
    }
    updateScroll(r = "measure") {
      let a = !!(this.options.layoutScroll && this.instance);
      if (
        (this.scroll &&
          this.scroll.animationId === this.root.animationId &&
          this.scroll.phase === r &&
          (a = !1),
        a && this.instance)
      ) {
        const l = n(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: r,
          isRoot: l,
          offset: i(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : l,
        };
      }
    }
    resetTransform() {
      if (!s) return;
      const r =
          this.isLayoutDirty ||
          this.shouldResetTransform ||
          this.options.alwaysMeasureLayout,
        a = this.projectionDelta && !vr(this.projectionDelta),
        l = this.getTransformTemplate(),
        c = l ? l(this.latestValues, "") : void 0,
        u = c !== this.prevTransformTemplateValue;
      r &&
        this.instance &&
        (a || at(this.latestValues) || u) &&
        (s(this.instance, c),
        (this.shouldResetTransform = !1),
        this.scheduleRender());
    }
    measure(r = !0) {
      const a = this.measurePageBox();
      let l = this.removeElementScroll(a);
      return (
        r && (l = this.removeTransform(l)),
        Tu(l),
        {
          animationId: this.root.animationId,
          measuredBox: a,
          layoutBox: l,
          latestValues: {},
          source: this.id,
        }
      );
    }
    measurePageBox() {
      const { visualElement: r } = this.options;
      if (!r) return L();
      const a = r.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(wu))) {
        const { scroll: l } = this.root;
        l && (xt(a.x, l.offset.x), xt(a.y, l.offset.y));
      }
      return a;
    }
    removeElementScroll(r) {
      const a = L();
      if ((K(a, r), this.scroll?.wasRoot)) return a;
      for (let l = 0; l < this.path.length; l++) {
        const c = this.path[l],
          { scroll: u, options: h } = c;
        c !== this.root &&
          u &&
          h.layoutScroll &&
          (u.wasRoot && K(a, r), xt(a.x, u.offset.x), xt(a.y, u.offset.y));
      }
      return a;
    }
    applyTransform(r, a = !1) {
      const l = L();
      K(l, r);
      for (let c = 0; c < this.path.length; c++) {
        const u = this.path[c];
        (!a &&
          u.options.layoutScroll &&
          u.scroll &&
          u !== u.root &&
          Tt(l, { x: -u.scroll.offset.x, y: -u.scroll.offset.y }),
          at(u.latestValues) && Tt(l, u.latestValues));
      }
      return (at(this.latestValues) && Tt(l, this.latestValues), l);
    }
    removeTransform(r) {
      const a = L();
      K(a, r);
      for (let l = 0; l < this.path.length; l++) {
        const c = this.path[l];
        if (!c.instance || !at(c.latestValues)) continue;
        Xe(c.latestValues) && c.updateSnapshot();
        const u = L();
        (K(u, c.measurePageBox()),
          xn(a, c.latestValues, c.snapshot ? c.snapshot.layoutBox : void 0, u));
      }
      return (at(this.latestValues) && xn(a, this.latestValues), a);
    }
    setTargetDelta(r) {
      ((this.targetDelta = r),
        this.root.scheduleUpdateProjection(),
        (this.isProjectionDirty = !0));
    }
    setOptions(r) {
      this.options = {
        ...this.options,
        ...r,
        crossfade: r.crossfade !== void 0 ? r.crossfade : !0,
      };
    }
    clearMeasurements() {
      ((this.scroll = void 0),
        (this.layout = void 0),
        (this.snapshot = void 0),
        (this.prevTransformTemplateValue = void 0),
        (this.targetDelta = void 0),
        (this.target = void 0),
        (this.isLayoutDirty = !1));
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent &&
        this.relativeParent.resolvedRelativeTargetAt !== I.timestamp &&
        this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(r = !1) {
      const a = this.getLead();
      (this.isProjectionDirty || (this.isProjectionDirty = a.isProjectionDirty),
        this.isTransformDirty || (this.isTransformDirty = a.isTransformDirty),
        this.isSharedProjectionDirty ||
          (this.isSharedProjectionDirty = a.isSharedProjectionDirty));
      const l = !!this.resumingFrom || this !== a;
      if (
        !(
          r ||
          (l && this.isSharedProjectionDirty) ||
          this.isProjectionDirty ||
          this.parent?.isProjectionDirty ||
          this.attemptToResolveRelativeTarget ||
          this.root.updateBlockedByResize
        )
      )
        return;
      const { layout: c, layoutId: u } = this.options;
      if (!this.layout || !(c || u)) return;
      this.resolvedRelativeTargetAt = I.timestamp;
      const h = this.getClosestProjectingParent();
      (h &&
        this.linkedParentVersion !== h.layoutVersion &&
        !h.options.layoutRoot &&
        this.removeRelativeTarget(),
        !this.targetDelta &&
          !this.relativeTarget &&
          (h && h.layout
            ? this.createRelativeTarget(
                h,
                this.layout.layoutBox,
                h.layout.layoutBox,
              )
            : this.removeRelativeTarget()),
        !(!this.relativeTarget && !this.targetDelta) &&
          (this.target ||
            ((this.target = L()), (this.targetWithTransforms = L())),
          this.relativeTarget &&
          this.relativeTargetOrigin &&
          this.relativeParent &&
          this.relativeParent.target
            ? (this.forceRelativeParentToResolveTarget(),
              $l(this.target, this.relativeTarget, this.relativeParent.target))
            : this.targetDelta
              ? (this.resumingFrom
                  ? (this.target = this.applyTransform(this.layout.layoutBox))
                  : K(this.target, this.layout.layoutBox),
                sr(this.target, this.targetDelta))
              : K(this.target, this.layout.layoutBox),
          this.attemptToResolveRelativeTarget &&
            ((this.attemptToResolveRelativeTarget = !1),
            h &&
            !!h.resumingFrom == !!this.resumingFrom &&
            !h.options.layoutScroll &&
            h.target &&
            this.animationProgress !== 1
              ? this.createRelativeTarget(h, this.target, h.target)
              : (this.relativeParent = this.relativeTarget = void 0)),
          z.value && lt.calculatedTargetDeltas++));
    }
    getClosestProjectingParent() {
      if (
        !(
          !this.parent ||
          Xe(this.parent.latestValues) ||
          nr(this.parent.latestValues)
        )
      )
        return this.parent.isProjecting()
          ? this.parent
          : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!(
        (this.relativeTarget || this.targetDelta || this.options.layoutRoot) &&
        this.layout
      );
    }
    createRelativeTarget(r, a, l) {
      ((this.relativeParent = r),
        (this.linkedParentVersion = r.layoutVersion),
        this.forceRelativeParentToResolveTarget(),
        (this.relativeTarget = L()),
        (this.relativeTargetOrigin = L()),
        ne(this.relativeTargetOrigin, a, l),
        K(this.relativeTarget, this.relativeTargetOrigin));
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      const r = this.getLead(),
        a = !!this.resumingFrom || this !== r;
      let l = !0;
      if (
        ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (l = !1),
        a &&
          (this.isSharedProjectionDirty || this.isTransformDirty) &&
          (l = !1),
        this.resolvedRelativeTargetAt === I.timestamp && (l = !1),
        l)
      )
        return;
      const { layout: c, layoutId: u } = this.options;
      if (
        ((this.isTreeAnimating = !!(
          (this.parent && this.parent.isTreeAnimating) ||
          this.currentAnimation ||
          this.pendingAnimation
        )),
        this.isTreeAnimating ||
          (this.targetDelta = this.relativeTarget = void 0),
        !this.layout || !(c || u))
      )
        return;
      K(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x,
        f = this.treeScale.y;
      (xl(this.layoutCorrected, this.treeScale, this.path, a),
        r.layout &&
          !r.target &&
          (this.treeScale.x !== 1 || this.treeScale.y !== 1) &&
          ((r.target = r.layout.layoutBox), (r.targetWithTransforms = L())));
      const { target: d } = r;
      if (!d) {
        this.prevProjectionDelta &&
          (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      (!this.projectionDelta || !this.prevProjectionDelta
        ? this.createProjectionDeltas()
        : (dn(this.prevProjectionDelta.x, this.projectionDelta.x),
          dn(this.prevProjectionDelta.y, this.projectionDelta.y)),
        Rt(this.projectionDelta, this.layoutCorrected, d, this.latestValues),
        (this.treeScale.x !== h ||
          this.treeScale.y !== f ||
          !bn(this.projectionDelta.x, this.prevProjectionDelta.x) ||
          !bn(this.projectionDelta.y, this.prevProjectionDelta.y)) &&
          ((this.hasProjected = !0),
          this.scheduleRender(),
          this.notifyListeners("projectionUpdate", d)),
        z.value && lt.calculatedProjections++);
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(r = !0) {
      if ((this.options.visualElement?.scheduleRender(), r)) {
        const a = this.getStack();
        a && a.scheduleRender();
      }
      this.resumingFrom &&
        !this.resumingFrom.instance &&
        (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      ((this.prevProjectionDelta = yt()),
        (this.projectionDelta = yt()),
        (this.projectionDeltaWithTransform = yt()));
    }
    setAnimationOrigin(r, a = !1) {
      const l = this.snapshot,
        c = l ? l.latestValues : {},
        u = { ...this.latestValues },
        h = yt();
      ((!this.relativeParent || !this.relativeParent.options.layoutRoot) &&
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !a));
      const f = L(),
        d =
          (l ? l.source : void 0) !==
          (this.layout ? this.layout.source : void 0),
        m = this.getStack(),
        T = !m || m.members.length <= 1,
        g = !!(d && !T && this.options.crossfade === !0 && !this.path.some(yu));
      this.animationProgress = 0;
      let p;
      ((this.mixTargetDelta = (w) => {
        const y = w / 1e3;
        (Rn(h.x, r.x, y),
          Rn(h.y, r.y, y),
          this.setTargetDelta(h),
          this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.layout &&
            this.relativeParent &&
            this.relativeParent.layout &&
            (ne(f, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
            gu(this.relativeTarget, this.relativeTargetOrigin, f, y),
            p && Xl(this.relativeTarget, p) && (this.isProjectionDirty = !1),
            p || (p = L()),
            K(p, this.relativeTarget)),
          d &&
            ((this.animationValues = u), Zl(u, c, this.latestValues, y, g, T)),
          this.root.scheduleUpdateProjection(),
          this.scheduleRender(),
          (this.animationProgress = y));
      }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0));
    }
    startAnimation(r) {
      (this.notifyListeners("animationStart"),
        this.currentAnimation?.stop(),
        this.resumingFrom?.currentAnimation?.stop(),
        this.pendingAnimation &&
          (J(this.pendingAnimation), (this.pendingAnimation = void 0)),
        (this.pendingAnimation = C.update(() => {
          ((Jt.hasAnimatedSinceResize = !0),
            ht.layout++,
            this.motionValue || (this.motionValue = dt(0)),
            (this.currentAnimation = tu(this.motionValue, [0, 1e3], {
              ...r,
              velocity: 0,
              isSync: !0,
              onUpdate: (a) => {
                (this.mixTargetDelta(a), r.onUpdate && r.onUpdate(a));
              },
              onStop: () => {
                ht.layout--;
              },
              onComplete: () => {
                (ht.layout--,
                  r.onComplete && r.onComplete(),
                  this.completeAnimation());
              },
            })),
            this.resumingFrom &&
              (this.resumingFrom.currentAnimation = this.currentAnimation),
            (this.pendingAnimation = void 0));
        })));
    }
    completeAnimation() {
      this.resumingFrom &&
        ((this.resumingFrom.currentAnimation = void 0),
        (this.resumingFrom.preserveOpacity = void 0));
      const r = this.getStack();
      (r && r.exitAnimationComplete(),
        (this.resumingFrom =
          this.currentAnimation =
          this.animationValues =
            void 0),
        this.notifyListeners("animationComplete"));
    }
    finishAnimation() {
      (this.currentAnimation &&
        (this.mixTargetDelta && this.mixTargetDelta(ru),
        this.currentAnimation.stop()),
        this.completeAnimation());
    }
    applyTransformsToTarget() {
      const r = this.getLead();
      let {
        targetWithTransforms: a,
        target: l,
        layout: c,
        latestValues: u,
      } = r;
      if (!(!a || !l || !c)) {
        if (
          this !== r &&
          this.layout &&
          c &&
          Pr(this.options.animationType, this.layout.layoutBox, c.layoutBox)
        ) {
          l = this.target || L();
          const h = j(this.layout.layoutBox.x);
          ((l.x.min = r.target.x.min), (l.x.max = l.x.min + h));
          const f = j(this.layout.layoutBox.y);
          ((l.y.min = r.target.y.min), (l.y.max = l.y.min + f));
        }
        (K(a, l),
          Tt(a, u),
          Rt(this.projectionDeltaWithTransform, this.layoutCorrected, a, u));
      }
    }
    registerSharedNode(r, a) {
      (this.sharedNodes.has(r) || this.sharedNodes.set(r, new su()),
        this.sharedNodes.get(r).add(a));
      const l = a.options.initialPromotionConfig;
      a.promote({
        transition: l ? l.transition : void 0,
        preserveFollowOpacity:
          l && l.shouldPreserveFollowOpacity
            ? l.shouldPreserveFollowOpacity(a)
            : void 0,
      });
    }
    isLead() {
      const r = this.getStack();
      return r ? r.lead === this : !0;
    }
    getLead() {
      const { layoutId: r } = this.options;
      return r ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId: r } = this.options;
      return r ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId: r } = this.options;
      if (r) return this.root.sharedNodes.get(r);
    }
    promote({ needsReset: r, transition: a, preserveFollowOpacity: l } = {}) {
      const c = this.getStack();
      (c && c.promote(this, l),
        r && ((this.projectionDelta = void 0), (this.needsReset = !0)),
        a && this.setOptions({ transition: a }));
    }
    relegate() {
      const r = this.getStack();
      return r ? r.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: r } = this.options;
      if (!r) return;
      let a = !1;
      const { latestValues: l } = r;
      if (
        ((l.z ||
          l.rotate ||
          l.rotateX ||
          l.rotateY ||
          l.rotateZ ||
          l.skewX ||
          l.skewY) &&
          (a = !0),
        !a)
      )
        return;
      const c = {};
      l.z && Pe("z", r, c, this.animationValues);
      for (let u = 0; u < we.length; u++)
        (Pe(`rotate${we[u]}`, r, c, this.animationValues),
          Pe(`skew${we[u]}`, r, c, this.animationValues));
      r.render();
      for (const u in c)
        (r.setStaticValue(u, c[u]),
          this.animationValues && (this.animationValues[u] = c[u]));
      r.scheduleRender();
    }
    applyProjectionStyles(r, a) {
      if (!this.instance || this.isSVG) return;
      if (!this.isVisible) {
        r.visibility = "hidden";
        return;
      }
      const l = this.getTransformTemplate();
      if (this.needsReset) {
        ((this.needsReset = !1),
          (r.visibility = ""),
          (r.opacity = ""),
          (r.pointerEvents = Zt(a?.pointerEvents) || ""),
          (r.transform = l ? l(this.latestValues, "") : "none"));
        return;
      }
      const c = this.getLead();
      if (!this.projectionDelta || !this.layout || !c.target) {
        (this.options.layoutId &&
          ((r.opacity =
            this.latestValues.opacity !== void 0
              ? this.latestValues.opacity
              : 1),
          (r.pointerEvents = Zt(a?.pointerEvents) || "")),
          this.hasProjected &&
            !at(this.latestValues) &&
            ((r.transform = l ? l({}, "") : "none"), (this.hasProjected = !1)));
        return;
      }
      r.visibility = "";
      const u = c.animationValues || c.latestValues;
      this.applyTransformsToTarget();
      let h = Yl(this.projectionDeltaWithTransform, this.treeScale, u);
      (l && (h = l(u, h)), (r.transform = h));
      const { x: f, y: d } = this.projectionDelta;
      ((r.transformOrigin = `${f.origin * 100}% ${d.origin * 100}% 0`),
        c.animationValues
          ? (r.opacity =
              c === this
                ? (u.opacity ?? this.latestValues.opacity ?? 1)
                : this.preserveOpacity
                  ? this.latestValues.opacity
                  : u.opacityExit)
          : (r.opacity =
              c === this
                ? u.opacity !== void 0
                  ? u.opacity
                  : ""
                : u.opacityExit !== void 0
                  ? u.opacityExit
                  : 0));
      for (const m in qe) {
        if (u[m] === void 0) continue;
        const { correct: T, applyTo: g, isCSSVariable: p } = qe[m],
          w = h === "none" ? u[m] : T(u[m], c);
        if (g) {
          const y = g.length;
          for (let S = 0; S < y; S++) r[g[S]] = w;
        } else
          p ? (this.options.visualElement.renderState.vars[m] = w) : (r[m] = w);
      }
      this.options.layoutId &&
        (r.pointerEvents = c === this ? Zt(a?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      (this.root.nodes.forEach((r) => r.currentAnimation?.stop()),
        this.root.nodes.forEach(Mn),
        this.root.sharedNodes.clear());
    }
  };
}
function au(t) {
  t.updateLayout();
}
function lu(t) {
  const e = t.resumeFrom?.snapshot || t.snapshot;
  if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
    const { layoutBox: i, measuredBox: n } = t.layout,
      { animationType: s } = t.options,
      o = e.source !== t.layout.source;
    s === "size"
      ? N((u) => {
          const h = o ? e.measuredBox[u] : e.layoutBox[u],
            f = j(h);
          ((h.min = i[u].min), (h.max = h.min + f));
        })
      : Pr(s, e.layoutBox, i) &&
        N((u) => {
          const h = o ? e.measuredBox[u] : e.layoutBox[u],
            f = j(i[u]);
          ((h.max = h.min + f),
            t.relativeTarget &&
              !t.currentAnimation &&
              ((t.isProjectionDirty = !0),
              (t.relativeTarget[u].max = t.relativeTarget[u].min + f)));
        });
    const r = yt();
    Rt(r, i, e.layoutBox);
    const a = yt();
    o ? Rt(a, t.applyTransform(n, !0), e.measuredBox) : Rt(a, i, e.layoutBox);
    const l = !vr(r);
    let c = !1;
    if (!t.resumeFrom) {
      const u = t.getClosestProjectingParent();
      if (u && !u.resumeFrom) {
        const { snapshot: h, layout: f } = u;
        if (h && f) {
          const d = L();
          ne(d, e.layoutBox, h.layoutBox);
          const m = L();
          (ne(m, i, f.layoutBox),
            gr(d, m) || (c = !0),
            u.options.layoutRoot &&
              ((t.relativeTarget = m),
              (t.relativeTargetOrigin = d),
              (t.relativeParent = u)));
        }
      }
    }
    t.notifyListeners("didUpdate", {
      layout: i,
      snapshot: e,
      delta: a,
      layoutDelta: r,
      hasLayoutChanged: l,
      hasRelativeLayoutChanged: c,
    });
  } else if (t.isLead()) {
    const { onExitComplete: i } = t.options;
    i && i();
  }
  t.options.transition = void 0;
}
function uu(t) {
  (z.value && lt.nodes++,
    t.parent &&
      (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty),
      t.isSharedProjectionDirty ||
        (t.isSharedProjectionDirty = !!(
          t.isProjectionDirty ||
          t.parent.isProjectionDirty ||
          t.parent.isSharedProjectionDirty
        )),
      t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty)));
}
function cu(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function hu(t) {
  t.clearSnapshot();
}
function Mn(t) {
  t.clearMeasurements();
}
function Dn(t) {
  t.isLayoutDirty = !1;
}
function fu(t) {
  const { visualElement: e } = t.options;
  (e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"),
    t.resetTransform());
}
function En(t) {
  (t.finishAnimation(),
    (t.targetDelta = t.relativeTarget = t.target = void 0),
    (t.isProjectionDirty = !0));
}
function du(t) {
  t.resolveTargetDelta();
}
function mu(t) {
  t.calcProjection();
}
function pu(t) {
  t.resetSkewAndRotation();
}
function vu(t) {
  t.removeLeadSnapshot();
}
function Rn(t, e, i) {
  ((t.translate = D(e.translate, 0, i)),
    (t.scale = D(e.scale, 1, i)),
    (t.origin = e.origin),
    (t.originPoint = e.originPoint));
}
function Ln(t, e, i, n) {
  ((t.min = D(e.min, i.min, n)), (t.max = D(e.max, i.max, n)));
}
function gu(t, e, i, n) {
  (Ln(t.x, e.x, i.x, n), Ln(t.y, e.y, i.y, n));
}
function yu(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
var xu = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  kn = (t) =>
    typeof navigator < "u" &&
    navigator.userAgent &&
    navigator.userAgent.toLowerCase().includes(t),
  In = kn("applewebkit/") && !kn("chrome/") ? Math.round : W;
function Bn(t) {
  ((t.min = In(t.min)), (t.max = In(t.max)));
}
function Tu(t) {
  (Bn(t.x), Bn(t.y));
}
function Pr(t, e, i) {
  return (
    t === "position" || (t === "preserve-aspect" && !Kl(Sn(e), Sn(i), 0.2))
  );
}
function wu(t) {
  return t !== t.root && t.scroll?.wasRoot;
}
var Pu = wr({
    attachResizeListener: (t, e) => jt(t, "resize", e),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
      y: document.documentElement.scrollTop || document.body?.scrollTop || 0,
    }),
    checkIsScrollRoot: () => !0,
  }),
  Se = { current: void 0 },
  Sr = wr({
    measureScroll: (t) => ({ x: t.scrollLeft, y: t.scrollTop }),
    defaultParent: () => {
      if (!Se.current) {
        const t = new Pu({});
        (t.mount(window), t.setOptions({ layoutScroll: !0 }), (Se.current = t));
      }
      return Se.current;
    },
    resetTransform: (t, e) => {
      t.style.transform = e !== void 0 ? e : "none";
    },
    checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed",
  }),
  ce = (0, v.createContext)({
    transformPagePoint: (t) => t,
    isStatic: !1,
    reducedMotion: "never",
  });
function Fn(t, e) {
  if (typeof t == "function") return t(e);
  t != null && (t.current = e);
}
function Su(...t) {
  return (e) => {
    let i = !1;
    const n = t.map((s) => {
      const o = Fn(s, e);
      return (!i && typeof o == "function" && (i = !0), o);
    });
    if (i)
      return () => {
        for (let s = 0; s < n.length; s++) {
          const o = n[s];
          typeof o == "function" ? o() : Fn(t[s], null);
        }
      };
  };
}
function bu(...t) {
  return v.useCallback(Su(...t), t);
}
var q = Jn($r(), 1),
  Au = class extends v.Component {
    getSnapshotBeforeUpdate(t) {
      const e = this.props.childRef.current;
      if (e && t.isPresent && !this.props.isPresent) {
        const i = e.offsetParent,
          n = (He(i) && i.offsetWidth) || 0,
          s = (He(i) && i.offsetHeight) || 0,
          o = this.props.sizeRef.current;
        ((o.height = e.offsetHeight || 0),
          (o.width = e.offsetWidth || 0),
          (o.top = e.offsetTop),
          (o.left = e.offsetLeft),
          (o.right = n - o.width - o.left),
          (o.bottom = s - o.height - o.top));
      }
      return null;
    }
    componentDidUpdate() {}
    render() {
      return this.props.children;
    }
  };
function Vu({ children: t, isPresent: e, anchorX: i, anchorY: n, root: s }) {
  const o = (0, v.useId)(),
    r = (0, v.useRef)(null),
    a = (0, v.useRef)({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    { nonce: l } = (0, v.useContext)(ce),
    c = bu(r, t.props?.ref ?? t?.ref);
  return (
    (0, v.useInsertionEffect)(() => {
      const {
        width: u,
        height: h,
        top: f,
        left: d,
        right: m,
        bottom: T,
      } = a.current;
      if (e || !r.current || !u || !h) return;
      const g = i === "left" ? `left: ${d}` : `right: ${m}`,
        p = n === "bottom" ? `bottom: ${T}` : `top: ${f}`;
      r.current.dataset.motionPopId = o;
      const w = document.createElement("style");
      l && (w.nonce = l);
      const y = s ?? document.head;
      return (
        y.appendChild(w),
        w.sheet &&
          w.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${u}px !important;
            height: ${h}px !important;
            ${g}px !important;
            ${p}px !important;
          }
        `),
        () => {
          y.contains(w) && y.removeChild(w);
        }
      );
    }, [e]),
    (0, q.jsx)(Au, {
      isPresent: e,
      childRef: r,
      sizeRef: a,
      children: v.cloneElement(t, { ref: c }),
    })
  );
}
var Cu = ({
  children: t,
  initial: e,
  isPresent: i,
  onExitComplete: n,
  custom: s,
  presenceAffectsLayout: o,
  mode: r,
  anchorX: a,
  anchorY: l,
  root: c,
}) => {
  const u = et(Mu),
    h = (0, v.useId)();
  let f = !0,
    d = (0, v.useMemo)(
      () => (
        (f = !1),
        {
          id: h,
          initial: e,
          isPresent: i,
          custom: s,
          onExitComplete: (m) => {
            u.set(m, !0);
            for (const T of u.values()) if (!T) return;
            n && n();
          },
          register: (m) => (u.set(m, !1), () => u.delete(m)),
        }
      ),
      [i, u, n],
    );
  return (
    o && f && (d = { ...d }),
    (0, v.useMemo)(() => {
      u.forEach((m, T) => u.set(T, !1));
    }, [i]),
    v.useEffect(() => {
      !i && !u.size && n && n();
    }, [i]),
    r === "popLayout" &&
      (t = (0, q.jsx)(Vu, {
        isPresent: i,
        anchorX: a,
        anchorY: l,
        root: c,
        children: t,
      })),
    (0, q.jsx)(oe.Provider, { value: d, children: t })
  );
};
function Mu() {
  return new Map();
}
function br(t = !0) {
  const e = (0, v.useContext)(oe);
  if (e === null) return [!0, null];
  const { isPresent: i, onExitComplete: n, register: s } = e,
    o = (0, v.useId)();
  (0, v.useEffect)(() => {
    if (t) return s(o);
  }, [t]);
  const r = (0, v.useCallback)(() => t && n && n(o), [o, n, t]);
  return !i && n ? [!1, r] : [!0];
}
var $t = (t) => t.key || "";
function jn(t) {
  const e = [];
  return (
    v.Children.forEach(t, (i) => {
      (0, v.isValidElement)(i) && e.push(i);
    }),
    e
  );
}
var qc = ({
    children: t,
    custom: e,
    initial: i = !0,
    onExitComplete: n,
    presenceAffectsLayout: s = !0,
    mode: o = "sync",
    propagate: r = !1,
    anchorX: a = "left",
    anchorY: l = "top",
    root: c,
  }) => {
    const [u, h] = br(r),
      f = (0, v.useMemo)(() => jn(t), [t]),
      d = r && !u ? [] : f.map($t),
      m = (0, v.useRef)(!0),
      T = (0, v.useRef)(f),
      g = et(() => new Map()),
      p = (0, v.useRef)(new Set()),
      [w, y] = (0, v.useState)(f),
      [S, b] = (0, v.useState)(f);
    re(() => {
      ((m.current = !1), (T.current = f));
      for (let P = 0; P < S.length; P++) {
        const A = $t(S[P]);
        d.includes(A)
          ? (g.delete(A), p.current.delete(A))
          : g.get(A) !== !0 && g.set(A, !1);
      }
    }, [S, d.length, d.join("-")]);
    const V = [];
    if (f !== w) {
      let P = [...f];
      for (let A = 0; A < S.length; A++) {
        const _ = S[A],
          Y = $t(_);
        d.includes(Y) || (P.splice(A, 0, _), V.push(_));
      }
      return (o === "wait" && V.length && (P = V), b(jn(P)), y(f), null);
    }
    const { forceRender: E } = (0, v.useContext)(ti);
    return (0, q.jsx)(q.Fragment, {
      children: S.map((P) => {
        const A = $t(P),
          _ = r && !u ? !1 : f === S || d.includes(A),
          Y = () => {
            if (p.current.has(A)) return;
            if ((p.current.add(A), g.has(A))) g.set(A, !0);
            else return;
            let At = !0;
            (g.forEach((fe) => {
              fe || (At = !1);
            }),
              At && (E?.(), b(T.current), r && h?.(), n && n()));
          };
        return (0, q.jsx)(
          Cu,
          {
            isPresent: _,
            initial: !m.current || i ? void 0 : !1,
            custom: e,
            presenceAffectsLayout: s,
            mode: o,
            root: c,
            onExitComplete: _ ? void 0 : Y,
            anchorX: a,
            anchorY: l,
            children: P,
          },
          A,
        );
      }),
    });
  },
  Ar = (0, v.createContext)({ strict: !1 }),
  On = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag",
    ],
    exit: ["exit"],
    drag: ["drag", "dragControls"],
    focus: ["whileFocus"],
    hover: ["whileHover", "onHoverStart", "onHoverEnd"],
    tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
    pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
    inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
    layout: ["layout", "layoutId"],
  },
  Nn = !1;
function Du() {
  if (Nn) return;
  const t = {};
  for (const e in On) t[e] = { isEnabled: (i) => On[e].some((n) => !!i[n]) };
  (tr(t), (Nn = !0));
}
function Vr() {
  return (Du(), pl());
}
function Eu(t) {
  const e = Vr();
  for (const i in t) e[i] = { ...e[i], ...t[i] };
  tr(e);
}
var Ru = new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "ignoreStrict",
  "viewport",
]);
function se(t) {
  return (
    t.startsWith("while") ||
    (t.startsWith("drag") && t !== "draggable") ||
    t.startsWith("layout") ||
    t.startsWith("onTap") ||
    t.startsWith("onPan") ||
    t.startsWith("onLayout") ||
    Ru.has(t)
  );
}
var Lu = _r({ default: () => Cr }, 1),
  Cr,
  ku = Wr(() => {
    throw (
      (Cr = {}),
      new Error(
        'Could not resolve "@emotion/is-prop-valid" imported by "framer-motion". Is it installed?',
      )
    );
  }),
  Mr = (t) => !se(t);
function Iu(t) {
  typeof t == "function" && (Mr = (e) => (e.startsWith("on") ? !se(e) : t(e)));
}
try {
  Iu((ku(), Ur(Lu)).default);
} catch {}
function Bu(t, e, i) {
  const n = {};
  for (const s in t)
    (s === "values" && typeof t.values == "object") ||
      ((Mr(s) ||
        (i === !0 && se(s)) ||
        (!e && !se(s)) ||
        (t.draggable && s.startsWith("onDrag"))) &&
        (n[s] = t[s]));
  return n;
}
var he = (0, v.createContext)({});
function Fu(t, e) {
  if (ue(t)) {
    const { initial: i, animate: n } = t;
    return {
      initial: i === !1 || Ft(i) ? i : void 0,
      animate: Ft(n) ? n : void 0,
    };
  }
  return t.inherit !== !1 ? e : {};
}
function ju(t) {
  const { initial: e, animate: i } = Fu(t, (0, v.useContext)(he));
  return (0, v.useMemo)(() => ({ initial: e, animate: i }), [Un(e), Un(i)]);
}
function Un(t) {
  return Array.isArray(t) ? t.join(" ") : t;
}
var Di = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
function Dr(t, e, i) {
  for (const n in e) !B(e[n]) && !ar(n, i) && (t[n] = e[n]);
}
function Ou({ transformTemplate: t }, e) {
  return (0, v.useMemo)(() => {
    const i = Di();
    return (Ci(i, e, t), Object.assign({}, i.vars, i.style));
  }, [e]);
}
function Nu(t, e) {
  const i = t.style || {},
    n = {};
  return (Dr(n, i, t), Object.assign(n, Ou(t, e)), n);
}
function Uu(t, e) {
  const i = {},
    n = Nu(t, e);
  return (
    t.drag &&
      t.dragListener !== !1 &&
      ((i.draggable = !1),
      (n.userSelect = n.WebkitUserSelect = n.WebkitTouchCallout = "none"),
      (n.touchAction =
        t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`)),
    t.tabIndex === void 0 &&
      (t.onTap || t.onTapStart || t.whileTap) &&
      (i.tabIndex = 0),
    (i.style = n),
    i
  );
}
var Er = () => ({ ...Di(), attrs: {} });
function Wu(t, e, i, n) {
  const s = (0, v.useMemo)(() => {
    const o = Er();
    return (
      lr(o, e, cr(n), t.transformTemplate, t.style),
      { ...o.attrs, style: { ...o.style } }
    );
  }, [e]);
  if (t.style) {
    const o = {};
    (Dr(o, t.style, t), (s.style = { ...o, ...s.style }));
  }
  return s;
}
var _u = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view",
];
function Ei(t) {
  return typeof t != "string" || t.includes("-")
    ? !1
    : !!(_u.indexOf(t) > -1 || /[A-Z]/u.test(t));
}
function Ku(t, e, i, { latestValues: n }, s, o = !1, r) {
  const a = ((r ?? Ei(t)) ? Wu : Uu)(e, n, s, t),
    l = Bu(e, typeof t == "string", o),
    c = t !== v.Fragment ? { ...l, ...a, ref: i } : {},
    { children: u } = e,
    h = (0, v.useMemo)(() => (B(u) ? u.get() : u), [u]);
  return (0, v.createElement)(t, { ...c, children: h });
}
function $u({ scrapeMotionValuesFromProps: t, createRenderState: e }, i, n, s) {
  return { latestValues: zu(i, n, s, t), renderState: e() };
}
function zu(t, e, i, n) {
  const s = {},
    o = n(t, {});
  for (const f in o) s[f] = Zt(o[f]);
  let { initial: r, animate: a } = t;
  const l = ue(t),
    c = Qs(t);
  e &&
    c &&
    !l &&
    t.inherit !== !1 &&
    (r === void 0 && (r = e.initial), a === void 0 && (a = e.animate));
  let u = i ? i.initial === !1 : !1;
  u = u || r === !1;
  const h = u ? a : r;
  if (h && typeof h != "boolean" && !le(h)) {
    const f = Array.isArray(h) ? h : [h];
    for (let d = 0; d < f.length; d++) {
      const m = yi(t, f[d]);
      if (m) {
        const { transitionEnd: T, transition: g, ...p } = m;
        for (const w in p) {
          let y = p[w];
          if (Array.isArray(y)) {
            const S = u ? y.length - 1 : 0;
            y = y[S];
          }
          y !== null && (s[w] = y);
        }
        for (const w in T) s[w] = T[w];
      }
    }
  }
  return s;
}
var Rr = (t) => (e, i) => {
    const n = (0, v.useContext)(he),
      s = (0, v.useContext)(oe),
      o = () => $u(t, e, n, s);
    return i ? o() : et(o);
  },
  Hu = Rr({ scrapeMotionValuesFromProps: Mi, createRenderState: Di }),
  Gu = Rr({ scrapeMotionValuesFromProps: hr, createRenderState: Er }),
  Xu = Symbol.for("motionComponentSymbol");
function Yu(t, e, i) {
  const n = (0, v.useRef)(i);
  (0, v.useInsertionEffect)(() => {
    n.current = i;
  });
  const s = (0, v.useRef)(null);
  return (0, v.useCallback)(
    (o) => {
      (o && t.onMount?.(o), e && (o ? e.mount(o) : e.unmount()));
      const r = n.current;
      if (typeof r == "function")
        if (o) {
          const a = r(o);
          typeof a == "function" && (s.current = a);
        } else s.current ? (s.current(), (s.current = null)) : r(o);
      else r && (r.current = o);
    },
    [e],
  );
}
var Lr = (0, v.createContext)({});
function pt(t) {
  return (
    t &&
    typeof t == "object" &&
    Object.prototype.hasOwnProperty.call(t, "current")
  );
}
function qu(t, e, i, n, s, o) {
  const { visualElement: r } = (0, v.useContext)(he),
    a = (0, v.useContext)(Ar),
    l = (0, v.useContext)(oe),
    c = (0, v.useContext)(ce),
    u = c.reducedMotion,
    h = c.skipAnimations,
    f = (0, v.useRef)(null),
    d = (0, v.useRef)(!1);
  ((n = n || a.renderer),
    !f.current &&
      n &&
      ((f.current = n(t, {
        visualState: e,
        parent: r,
        props: i,
        presenceContext: l,
        blockInitialAnimation: l ? l.initial === !1 : !1,
        reducedMotionConfig: u,
        skipAnimations: h,
        isSVG: o,
      })),
      d.current && f.current && (f.current.manuallyAnimateOnMount = !0)));
  const m = f.current,
    T = (0, v.useContext)(Lr);
  m &&
    !m.projection &&
    s &&
    (m.type === "html" || m.type === "svg") &&
    Zu(f.current, i, s, T);
  const g = (0, v.useRef)(!1);
  (0, v.useInsertionEffect)(() => {
    m && g.current && m.update(i, l);
  });
  const p = i[Os],
    w = (0, v.useRef)(
      !!p &&
        !window.MotionHandoffIsComplete?.(p) &&
        window.MotionHasOptimisedAnimation?.(p),
    );
  return (
    re(() => {
      ((d.current = !0),
        m &&
          ((g.current = !0),
          (window.MotionIsMounted = !0),
          m.updateFeatures(),
          m.scheduleRenderMicrotask(),
          w.current && m.animationState && m.animationState.animateChanges()));
    }),
    (0, v.useEffect)(() => {
      m &&
        (!w.current && m.animationState && m.animationState.animateChanges(),
        w.current &&
          (queueMicrotask(() => {
            window.MotionHandoffMarkAsComplete?.(p);
          }),
          (w.current = !1)),
        (m.enteringChildren = void 0));
    }),
    m
  );
}
function Zu(t, e, i, n) {
  const {
    layoutId: s,
    layout: o,
    drag: r,
    dragConstraints: a,
    layoutScroll: l,
    layoutRoot: c,
    layoutCrossfade: u,
  } = e;
  ((t.projection = new i(
    t.latestValues,
    e["data-framer-portal-id"] ? void 0 : kr(t.parent),
  )),
    t.projection.setOptions({
      layoutId: s,
      layout: o,
      alwaysMeasureLayout: !!r || (a && pt(a)),
      visualElement: t,
      animationType: typeof o == "string" ? o : "both",
      initialPromotionConfig: n,
      crossfade: u,
      layoutScroll: l,
      layoutRoot: c,
    }));
}
function kr(t) {
  if (t) return t.options.allowProjection !== !1 ? t.projection : kr(t.parent);
}
function be(t, { forwardMotionProps: e = !1, type: i } = {}, n, s) {
  n && Eu(n);
  const o = i ? i === "svg" : Ei(t),
    r = o ? Gu : Hu;
  function a(c, u) {
    let h;
    const f = { ...(0, v.useContext)(ce), ...c, layoutId: Ju(c) },
      { isStatic: d } = f,
      m = ju(c),
      T = r(c, d);
    if (!d && Qn) {
      Qu(f, n);
      const g = tc(f);
      ((h = g.MeasureLayout),
        (m.visualElement = qu(t, T, f, s, g.ProjectionNode, o)));
    }
    return (0, q.jsxs)(he.Provider, {
      value: m,
      children: [
        h && m.visualElement
          ? (0, q.jsx)(h, { visualElement: m.visualElement, ...f })
          : null,
        Ku(t, c, Yu(T, m.visualElement, u), T, d, e, o),
      ],
    });
  }
  a.displayName = `motion.${typeof t == "string" ? t : `create(${t.displayName ?? t.name ?? ""})`}`;
  const l = (0, v.forwardRef)(a);
  return ((l[Xu] = t), l);
}
function Ju({ layoutId: t }) {
  const e = (0, v.useContext)(ti).id;
  return e && t !== void 0 ? e + "-" + t : t;
}
function Qu(t, e) {
  (0, v.useContext)(Ar).strict;
}
function tc(t) {
  const { drag: e, layout: i } = Vr();
  if (!e && !i) return {};
  const n = { ...e, ...i };
  return {
    MeasureLayout:
      e?.isEnabled(t) || i?.isEnabled(t) ? n.MeasureLayout : void 0,
    ProjectionNode: n.ProjectionNode,
  };
}
function ec(t, e) {
  if (typeof Proxy > "u") return be;
  const i = new Map(),
    n = (o, r) => be(o, r, t, e),
    s = (o, r) => n(o, r);
  return new Proxy(s, {
    get: (o, r) =>
      r === "create"
        ? n
        : (i.has(r) || i.set(r, be(r, void 0, t, e)), i.get(r)),
  });
}
var ic = (t, e) =>
    (e.isSVG ?? Ei(t))
      ? new Ll(e)
      : new Vl(e, { allowProjection: t !== v.Fragment }),
  nc = class extends st {
    constructor(t) {
      (super(t), t.animationState || (t.animationState = jl(t)));
    }
    updateAnimationControlsSubscription() {
      const { animate: t } = this.node.getProps();
      le(t) && (this.unmountControls = t.subscribe(this.node));
    }
    mount() {
      this.updateAnimationControlsSubscription();
    }
    update() {
      const { animate: t } = this.node.getProps(),
        { animate: e } = this.node.prevProps || {};
      t !== e && this.updateAnimationControlsSubscription();
    }
    unmount() {
      (this.node.animationState.reset(), this.unmountControls?.());
    }
  },
  sc = 0,
  rc = class extends st {
    constructor() {
      (super(...arguments), (this.id = sc++));
    }
    update() {
      if (!this.node.presenceContext) return;
      const { isPresent: t, onExitComplete: e } = this.node.presenceContext,
        { isPresent: i } = this.node.prevPresenceContext || {};
      if (!this.node.animationState || t === i) return;
      const n = this.node.animationState.setActive("exit", !t);
      e &&
        !t &&
        n.then(() => {
          e(this.id);
        });
    }
    mount() {
      const { register: t, onExitComplete: e } =
        this.node.presenceContext || {};
      (e && e(this.id), t && (this.unmount = t(this.id)));
    }
    unmount() {}
  },
  oc = { animation: { Feature: nc }, exit: { Feature: rc } };
function Wt(t) {
  return { point: { x: t.pageX, y: t.pageY } };
}
var ac = (t) => (e) => Si(e) && t(e, Wt(e));
function Lt(t, e, i, n) {
  return jt(t, e, ac(i), n);
}
var Ir = ({ current: t }) => (t ? t.ownerDocument.defaultView : null),
  Wn = (t, e) => Math.abs(t - e);
function lc(t, e) {
  const i = Wn(t.x, e.x),
    n = Wn(t.y, e.y);
  return Math.sqrt(i ** 2 + n ** 2);
}
var _n = new Set(["auto", "scroll"]),
  Br = class {
    constructor(
      t,
      e,
      {
        transformPagePoint: i,
        contextWindow: n = window,
        dragSnapToOrigin: s = !1,
        distanceThreshold: o = 3,
        element: r,
      } = {},
    ) {
      if (
        ((this.startEvent = null),
        (this.lastMoveEvent = null),
        (this.lastMoveEventInfo = null),
        (this.handlers = {}),
        (this.contextWindow = window),
        (this.scrollPositions = new Map()),
        (this.removeScrollListeners = null),
        (this.onElementScroll = (h) => {
          this.handleScroll(h.target);
        }),
        (this.onWindowScroll = () => {
          this.handleScroll(window);
        }),
        (this.updatePoint = () => {
          if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
          const h = Ve(this.lastMoveEventInfo, this.history),
            f = this.startEvent !== null,
            d = lc(h.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
          if (!f && !d) return;
          const { point: m } = h,
            { timestamp: T } = I;
          this.history.push({ ...m, timestamp: T });
          const { onStart: g, onMove: p } = this.handlers;
          (f ||
            (g && g(this.lastMoveEvent, h),
            (this.startEvent = this.lastMoveEvent)),
            p && p(this.lastMoveEvent, h));
        }),
        (this.handlePointerMove = (h, f) => {
          ((this.lastMoveEvent = h),
            (this.lastMoveEventInfo = Ae(f, this.transformPagePoint)),
            C.update(this.updatePoint, !0));
        }),
        (this.handlePointerUp = (h, f) => {
          this.end();
          const {
            onEnd: d,
            onSessionEnd: m,
            resumeAnimation: T,
          } = this.handlers;
          if (
            ((this.dragSnapToOrigin || !this.startEvent) && T && T(),
            !(this.lastMoveEvent && this.lastMoveEventInfo))
          )
            return;
          const g = Ve(
            h.type === "pointercancel"
              ? this.lastMoveEventInfo
              : Ae(f, this.transformPagePoint),
            this.history,
          );
          (this.startEvent && d && d(h, g), m && m(h, g));
        }),
        !Si(t))
      )
        return;
      ((this.dragSnapToOrigin = s),
        (this.handlers = e),
        (this.transformPagePoint = i),
        (this.distanceThreshold = o),
        (this.contextWindow = n || window));
      const a = Ae(Wt(t), this.transformPagePoint),
        { point: l } = a,
        { timestamp: c } = I;
      this.history = [{ ...l, timestamp: c }];
      const { onSessionStart: u } = e;
      (u && u(t, Ve(a, this.history)),
        (this.removeListeners = Ot(
          Lt(this.contextWindow, "pointermove", this.handlePointerMove),
          Lt(this.contextWindow, "pointerup", this.handlePointerUp),
          Lt(this.contextWindow, "pointercancel", this.handlePointerUp),
        )),
        r && this.startScrollTracking(r));
    }
    startScrollTracking(t) {
      let e = t.parentElement;
      for (; e; ) {
        const i = getComputedStyle(e);
        ((_n.has(i.overflowX) || _n.has(i.overflowY)) &&
          this.scrollPositions.set(e, { x: e.scrollLeft, y: e.scrollTop }),
          (e = e.parentElement));
      }
      (this.scrollPositions.set(window, {
        x: window.scrollX,
        y: window.scrollY,
      }),
        window.addEventListener("scroll", this.onElementScroll, {
          capture: !0,
          passive: !0,
        }),
        window.addEventListener("scroll", this.onWindowScroll, { passive: !0 }),
        (this.removeScrollListeners = () => {
          (window.removeEventListener("scroll", this.onElementScroll, {
            capture: !0,
          }),
            window.removeEventListener("scroll", this.onWindowScroll));
        }));
    }
    handleScroll(t) {
      const e = this.scrollPositions.get(t);
      if (!e) return;
      const i = t === window,
        n = i
          ? { x: window.scrollX, y: window.scrollY }
          : { x: t.scrollLeft, y: t.scrollTop },
        s = { x: n.x - e.x, y: n.y - e.y };
      (s.x === 0 && s.y === 0) ||
        (i
          ? this.lastMoveEventInfo &&
            ((this.lastMoveEventInfo.point.x += s.x),
            (this.lastMoveEventInfo.point.y += s.y))
          : this.history.length > 0 &&
            ((this.history[0].x -= s.x), (this.history[0].y -= s.y)),
        this.scrollPositions.set(t, n),
        C.update(this.updatePoint, !0));
    }
    updateHandlers(t) {
      this.handlers = t;
    }
    end() {
      (this.removeListeners && this.removeListeners(),
        this.removeScrollListeners && this.removeScrollListeners(),
        this.scrollPositions.clear(),
        J(this.updatePoint));
    }
  };
function Ae(t, e) {
  return e ? { point: e(t.point) } : t;
}
function Kn(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function Ve({ point: t }, e) {
  return {
    point: t,
    delta: Kn(t, Fr(e)),
    offset: Kn(t, uc(e)),
    velocity: cc(e, 0.1),
  };
}
function uc(t) {
  return t[0];
}
function Fr(t) {
  return t[t.length - 1];
}
function cc(t, e) {
  if (t.length < 2) return { x: 0, y: 0 };
  let i = t.length - 1,
    n = null;
  const s = Fr(t);
  for (; i >= 0 && ((n = t[i]), !(s.timestamp - n.timestamp > H(e))); ) i--;
  if (!n) return { x: 0, y: 0 };
  const o = U(s.timestamp - n.timestamp);
  if (o === 0) return { x: 0, y: 0 };
  const r = { x: (s.x - n.x) / o, y: (s.y - n.y) / o };
  return (r.x === 1 / 0 && (r.x = 0), r.y === 1 / 0 && (r.y = 0), r);
}
function hc(t, { min: e, max: i }, n) {
  return (
    e !== void 0 && t < e
      ? (t = n ? D(e, t, n.min) : Math.max(t, e))
      : i !== void 0 && t > i && (t = n ? D(i, t, n.max) : Math.min(t, i)),
    t
  );
}
function $n(t, e, i) {
  return {
    min: e !== void 0 ? t.min + e : void 0,
    max: i !== void 0 ? t.max + i - (t.max - t.min) : void 0,
  };
}
function fc(t, { top: e, left: i, bottom: n, right: s }) {
  return { x: $n(t.x, i, s), y: $n(t.y, e, n) };
}
function zn(t, e) {
  let i = e.min - t.min,
    n = e.max - t.max;
  return (
    e.max - e.min < t.max - t.min && ([i, n] = [n, i]),
    { min: i, max: n }
  );
}
function dc(t, e) {
  return { x: zn(t.x, e.x), y: zn(t.y, e.y) };
}
function mc(t, e) {
  let i = 0.5;
  const n = j(t),
    s = j(e);
  return (
    s > n
      ? (i = kt(e.min, e.max - n, t.min))
      : n > s && (i = kt(t.min, t.max - s, e.min)),
    X(0, 1, i)
  );
}
function pc(t, e) {
  const i = {};
  return (
    e.min !== void 0 && (i.min = e.min - t.min),
    e.max !== void 0 && (i.max = e.max - t.min),
    i
  );
}
var Ze = 0.35;
function vc(t = Ze) {
  return (
    t === !1 ? (t = 0) : t === !0 && (t = Ze),
    { x: Hn(t, "left", "right"), y: Hn(t, "top", "bottom") }
  );
}
function Hn(t, e, i) {
  return { min: Gn(t, e), max: Gn(t, i) };
}
function Gn(t, e) {
  return typeof t == "number" ? t : t[e] || 0;
}
var gc = new WeakMap(),
  yc = class {
    constructor(t) {
      ((this.openDragLock = null),
        (this.isDragging = !1),
        (this.currentDirection = null),
        (this.originPoint = { x: 0, y: 0 }),
        (this.constraints = !1),
        (this.hasMutatedConstraints = !1),
        (this.elastic = L()),
        (this.latestPointerEvent = null),
        (this.latestPanInfo = null),
        (this.visualElement = t));
    }
    start(t, { snapToCursor: e = !1, distanceThreshold: i } = {}) {
      const { presenceContext: n } = this.visualElement;
      if (n && n.isPresent === !1) return;
      const s = (u) => {
          e
            ? (this.stopAnimation(), this.snapToCursor(Wt(u).point))
            : this.pauseAnimation();
        },
        o = (u, h) => {
          this.stopAnimation();
          const {
            drag: f,
            dragPropagation: d,
            onDragStart: m,
          } = this.getProps();
          if (
            f &&
            !d &&
            (this.openDragLock && this.openDragLock(),
            (this.openDragLock = za(f)),
            !this.openDragLock)
          )
            return;
          ((this.latestPointerEvent = u),
            (this.latestPanInfo = h),
            (this.isDragging = !0),
            (this.currentDirection = null),
            this.resolveConstraints(),
            this.visualElement.projection &&
              ((this.visualElement.projection.isAnimationBlocked = !0),
              (this.visualElement.projection.target = void 0)),
            N((g) => {
              let p = this.getAxisMotionValue(g).get() || 0;
              if (G.test(p)) {
                const { projection: w } = this.visualElement;
                if (w && w.layout) {
                  const y = w.layout.layoutBox[g];
                  y && (p = j(y) * (parseFloat(p) / 100));
                }
              }
              this.originPoint[g] = p;
            }),
            m && C.update(() => m(u, h), !1, !0),
            Ke(this.visualElement, "transform"));
          const { animationState: T } = this.visualElement;
          T && T.setActive("whileDrag", !0);
        },
        r = (u, h) => {
          ((this.latestPointerEvent = u), (this.latestPanInfo = h));
          const {
            dragPropagation: f,
            dragDirectionLock: d,
            onDirectionLock: m,
            onDrag: T,
          } = this.getProps();
          if (!f && !this.openDragLock) return;
          const { offset: g } = h;
          if (d && this.currentDirection === null) {
            ((this.currentDirection = Tc(g)),
              this.currentDirection !== null && m && m(this.currentDirection));
            return;
          }
          (this.updateAxis("x", h.point, g),
            this.updateAxis("y", h.point, g),
            this.visualElement.render(),
            T && C.update(() => T(u, h), !1, !0));
        },
        a = (u, h) => {
          ((this.latestPointerEvent = u),
            (this.latestPanInfo = h),
            this.stop(u, h),
            (this.latestPointerEvent = null),
            (this.latestPanInfo = null));
        },
        l = () =>
          N(
            (u) =>
              this.getAnimationState(u) === "paused" &&
              this.getAxisMotionValue(u).animation?.play(),
          ),
        { dragSnapToOrigin: c } = this.getProps();
      this.panSession = new Br(
        t,
        {
          onSessionStart: s,
          onStart: o,
          onMove: r,
          onSessionEnd: a,
          resumeAnimation: l,
        },
        {
          transformPagePoint: this.visualElement.getTransformPagePoint(),
          dragSnapToOrigin: c,
          distanceThreshold: i,
          contextWindow: Ir(this.visualElement),
          element: this.visualElement.current,
        },
      );
    }
    stop(t, e) {
      const i = t || this.latestPointerEvent,
        n = e || this.latestPanInfo,
        s = this.isDragging;
      if ((this.cancel(), !s || !n || !i)) return;
      const { velocity: o } = n;
      this.startAnimation(o);
      const { onDragEnd: r } = this.getProps();
      r && C.postRender(() => r(i, n));
    }
    cancel() {
      this.isDragging = !1;
      const { projection: t, animationState: e } = this.visualElement;
      (t && (t.isAnimationBlocked = !1), this.endPanSession());
      const { dragPropagation: i } = this.getProps();
      (!i &&
        this.openDragLock &&
        (this.openDragLock(), (this.openDragLock = null)),
        e && e.setActive("whileDrag", !1));
    }
    endPanSession() {
      (this.panSession && this.panSession.end(), (this.panSession = void 0));
    }
    updateAxis(t, e, i) {
      const { drag: n } = this.getProps();
      if (!i || !zt(t, n, this.currentDirection)) return;
      const s = this.getAxisMotionValue(t);
      let o = this.originPoint[t] + i[t];
      (this.constraints &&
        this.constraints[t] &&
        (o = hc(o, this.constraints[t], this.elastic[t])),
        s.set(o));
    }
    resolveConstraints() {
      const { dragConstraints: t, dragElastic: e } = this.getProps(),
        i =
          this.visualElement.projection && !this.visualElement.projection.layout
            ? this.visualElement.projection.measure(!1)
            : this.visualElement.projection?.layout,
        n = this.constraints;
      (t && pt(t)
        ? this.constraints || (this.constraints = this.resolveRefConstraints())
        : t && i
          ? (this.constraints = fc(i.layoutBox, t))
          : (this.constraints = !1),
        (this.elastic = vc(e)),
        n !== this.constraints &&
          !pt(t) &&
          i &&
          this.constraints &&
          !this.hasMutatedConstraints &&
          N((s) => {
            this.constraints !== !1 &&
              this.getAxisMotionValue(s) &&
              (this.constraints[s] = pc(i.layoutBox[s], this.constraints[s]));
          }));
    }
    resolveRefConstraints() {
      const { dragConstraints: t, onMeasureDragConstraints: e } =
        this.getProps();
      if (!t || !pt(t)) return !1;
      const i = t.current;
      it(
        i !== null,
        "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.",
        "drag-constraints-ref",
      );
      const { projection: n } = this.visualElement;
      if (!n || !n.layout) return !1;
      const s = Tl(i, n.root, this.visualElement.getTransformPagePoint());
      let o = dc(n.layout.layoutBox, s);
      if (e) {
        const r = e(gl(o));
        ((this.hasMutatedConstraints = !!r), r && (o = ir(r)));
      }
      return o;
    }
    startAnimation(t) {
      const {
          drag: e,
          dragMomentum: i,
          dragElastic: n,
          dragTransition: s,
          dragSnapToOrigin: o,
          onDragTransitionEnd: r,
        } = this.getProps(),
        a = this.constraints || {},
        l = N((c) => {
          if (!zt(c, e, this.currentDirection)) return;
          let u = (a && a[c]) || {};
          o && (u = { min: 0, max: 0 });
          const h = n ? 200 : 1e6,
            f = n ? 40 : 1e7,
            d = {
              type: "inertia",
              velocity: i ? t[c] : 0,
              bounceStiffness: h,
              bounceDamping: f,
              timeConstant: 750,
              restDelta: 1,
              restSpeed: 10,
              ...s,
              ...u,
            };
          return this.startAxisValueAnimation(c, d);
        });
      return Promise.all(l).then(r);
    }
    startAxisValueAnimation(t, e) {
      const i = this.getAxisMotionValue(t);
      return (
        Ke(this.visualElement, t),
        i.start(gi(t, i, 0, e, this.visualElement, !1))
      );
    }
    stopAnimation() {
      N((t) => this.getAxisMotionValue(t).stop());
    }
    pauseAnimation() {
      N((t) => this.getAxisMotionValue(t).animation?.pause());
    }
    getAnimationState(t) {
      return this.getAxisMotionValue(t).animation?.state;
    }
    getAxisMotionValue(t) {
      const e = `_drag${t.toUpperCase()}`,
        i = this.visualElement.getProps(),
        n = i[e];
      return (
        n ||
        this.visualElement.getValue(t, (i.initial ? i.initial[t] : void 0) || 0)
      );
    }
    snapToCursor(t) {
      N((e) => {
        const { drag: i } = this.getProps();
        if (!zt(e, i, this.currentDirection)) return;
        const { projection: n } = this.visualElement,
          s = this.getAxisMotionValue(e);
        if (n && n.layout) {
          const { min: o, max: r } = n.layout.layoutBox[e],
            a = s.get() || 0;
          s.set(t[e] - D(o, r, 0.5) + a);
        }
      });
    }
    scalePositionWithinConstraints() {
      if (!this.visualElement.current) return;
      const { drag: t, dragConstraints: e } = this.getProps(),
        { projection: i } = this.visualElement;
      if (!pt(e) || !i || !this.constraints) return;
      this.stopAnimation();
      const n = { x: 0, y: 0 };
      N((o) => {
        const r = this.getAxisMotionValue(o);
        if (r && this.constraints !== !1) {
          const a = r.get();
          n[o] = mc({ min: a, max: a }, this.constraints[o]);
        }
      });
      const { transformTemplate: s } = this.visualElement.getProps();
      ((this.visualElement.current.style.transform = s ? s({}, "") : "none"),
        i.root && i.root.updateScroll(),
        i.updateLayout(),
        (this.constraints = !1),
        this.resolveConstraints(),
        N((o) => {
          if (!zt(o, t, null)) return;
          const r = this.getAxisMotionValue(o),
            { min: a, max: l } = this.constraints[o];
          r.set(D(a, l, n[o]));
        }),
        this.visualElement.render());
    }
    addListeners() {
      if (!this.visualElement.current) return;
      gc.set(this.visualElement, this);
      const t = this.visualElement.current,
        e = Lt(t, "pointerdown", (l) => {
          const { drag: c, dragListener: u = !0 } = this.getProps(),
            h = l.target,
            f = h !== t && qa(h);
          c && u && !f && this.start(l);
        });
      let i;
      const n = () => {
          const { dragConstraints: l } = this.getProps();
          pt(l) &&
            l.current &&
            ((this.constraints = this.resolveRefConstraints()),
            i ||
              (i = xc(t, l.current, () =>
                this.scalePositionWithinConstraints(),
              )));
        },
        { projection: s } = this.visualElement,
        o = s.addEventListener("measure", n);
      (s && !s.layout && (s.root && s.root.updateScroll(), s.updateLayout()),
        C.read(n));
      const r = jt(window, "resize", () =>
          this.scalePositionWithinConstraints(),
        ),
        a = s.addEventListener(
          "didUpdate",
          ({ delta: l, hasLayoutChanged: c }) => {
            this.isDragging &&
              c &&
              (N((u) => {
                const h = this.getAxisMotionValue(u);
                h &&
                  ((this.originPoint[u] += l[u].translate),
                  h.set(h.get() + l[u].translate));
              }),
              this.visualElement.render());
          },
        );
      return () => {
        (r(), e(), o(), a && a(), i && i());
      };
    }
    getProps() {
      const t = this.visualElement.getProps(),
        {
          drag: e = !1,
          dragDirectionLock: i = !1,
          dragPropagation: n = !1,
          dragConstraints: s = !1,
          dragElastic: o = Ze,
          dragMomentum: r = !0,
        } = t;
      return {
        ...t,
        drag: e,
        dragDirectionLock: i,
        dragPropagation: n,
        dragConstraints: s,
        dragElastic: o,
        dragMomentum: r,
      };
    }
  };
function Xn(t) {
  let e = !0;
  return () => {
    if (e) {
      e = !1;
      return;
    }
    t();
  };
}
function xc(t, e, i) {
  const n = tn(t, Xn(i)),
    s = tn(e, Xn(i));
  return () => {
    (n(), s());
  };
}
function zt(t, e, i) {
  return (e === !0 || e === t) && (i === null || i === t);
}
function Tc(t, e = 10) {
  let i = null;
  return (Math.abs(t.y) > e ? (i = "y") : Math.abs(t.x) > e && (i = "x"), i);
}
var wc = class extends st {
    constructor(t) {
      (super(t),
        (this.removeGroupControls = W),
        (this.removeListeners = W),
        (this.controls = new yc(t)));
    }
    mount() {
      const { dragControls: t } = this.node.getProps();
      (t && (this.removeGroupControls = t.subscribe(this.controls)),
        (this.removeListeners = this.controls.addListeners() || W));
    }
    update() {
      const { dragControls: t } = this.node.getProps(),
        { dragControls: e } = this.node.prevProps || {};
      t !== e &&
        (this.removeGroupControls(),
        t && (this.removeGroupControls = t.subscribe(this.controls)));
    }
    unmount() {
      (this.removeGroupControls(),
        this.removeListeners(),
        this.controls.isDragging || this.controls.endPanSession());
    }
  },
  Ce = (t) => (e, i) => {
    t && C.update(() => t(e, i), !1, !0);
  },
  Pc = class extends st {
    constructor() {
      (super(...arguments), (this.removePointerDownListener = W));
    }
    onPointerDown(t) {
      this.session = new Br(t, this.createPanHandlers(), {
        transformPagePoint: this.node.getTransformPagePoint(),
        contextWindow: Ir(this.node),
      });
    }
    createPanHandlers() {
      const {
        onPanSessionStart: t,
        onPanStart: e,
        onPan: i,
        onPanEnd: n,
      } = this.node.getProps();
      return {
        onSessionStart: Ce(t),
        onStart: Ce(e),
        onMove: Ce(i),
        onEnd: (s, o) => {
          (delete this.session, n && C.postRender(() => n(s, o)));
        },
      };
    }
    mount() {
      this.removePointerDownListener = Lt(
        this.node.current,
        "pointerdown",
        (t) => this.onPointerDown(t),
      );
    }
    update() {
      this.session && this.session.updateHandlers(this.createPanHandlers());
    }
    unmount() {
      (this.removePointerDownListener(), this.session && this.session.end());
    }
  },
  Me = !1,
  Sc = class extends v.Component {
    componentDidMount() {
      const {
          visualElement: t,
          layoutGroup: e,
          switchLayoutGroup: i,
          layoutId: n,
        } = this.props,
        { projection: s } = t;
      (s &&
        (e.group && e.group.add(s),
        i && i.register && n && i.register(s),
        Me && s.root.didUpdate(),
        s.addEventListener("animationComplete", () => {
          this.safeToRemove();
        }),
        s.setOptions({
          ...s.options,
          layoutDependency: this.props.layoutDependency,
          onExitComplete: () => this.safeToRemove(),
        })),
        (Jt.hasEverUpdated = !0));
    }
    getSnapshotBeforeUpdate(t) {
      const {
          layoutDependency: e,
          visualElement: i,
          drag: n,
          isPresent: s,
        } = this.props,
        { projection: o } = i;
      return (
        o &&
          ((o.isPresent = s),
          t.layoutDependency !== e &&
            o.setOptions({ ...o.options, layoutDependency: e }),
          (Me = !0),
          n || t.layoutDependency !== e || e === void 0 || t.isPresent !== s
            ? o.willUpdate()
            : this.safeToRemove(),
          t.isPresent !== s &&
            (s
              ? o.promote()
              : o.relegate() ||
                C.postRender(() => {
                  const r = o.getStack();
                  (!r || !r.members.length) && this.safeToRemove();
                }))),
        null
      );
    }
    componentDidUpdate() {
      const { projection: t } = this.props.visualElement;
      t &&
        (t.root.didUpdate(),
        Pi.postRender(() => {
          !t.currentAnimation && t.isLead() && this.safeToRemove();
        }));
    }
    componentWillUnmount() {
      const {
          visualElement: t,
          layoutGroup: e,
          switchLayoutGroup: i,
        } = this.props,
        { projection: n } = t;
      ((Me = !0),
        n &&
          (n.scheduleCheckAfterUnmount(),
          e && e.group && e.group.remove(n),
          i && i.deregister && i.deregister(n)));
    }
    safeToRemove() {
      const { safeToRemove: t } = this.props;
      t && t();
    }
    render() {
      return null;
    }
  };
function jr(t) {
  const [e, i] = br(),
    n = (0, v.useContext)(ti);
  return (0, q.jsx)(Sc, {
    ...t,
    layoutGroup: n,
    switchLayoutGroup: (0, v.useContext)(Lr),
    isPresent: e,
    safeToRemove: i,
  });
}
var bc = {
  pan: { Feature: Pc },
  drag: { Feature: wc, ProjectionNode: Sr, MeasureLayout: jr },
};
function Yn(t, e, i) {
  const { props: n } = t;
  t.animationState &&
    n.whileHover &&
    t.animationState.setActive("whileHover", i === "Start");
  const s = n["onHover" + i];
  s && C.postRender(() => s(e, Wt(e)));
}
var Ac = class extends st {
    mount() {
      const { current: t } = this.node;
      t &&
        (this.unmount = Ha(
          t,
          (e, i) => (Yn(this.node, i, "Start"), (n) => Yn(this.node, n, "End")),
        ));
    }
    unmount() {}
  },
  Vc = class extends st {
    constructor() {
      (super(...arguments), (this.isActive = !1));
    }
    onFocus() {
      let t = !1;
      try {
        t = this.node.current.matches(":focus-visible");
      } catch {
        t = !0;
      }
      !t ||
        !this.node.animationState ||
        (this.node.animationState.setActive("whileFocus", !0),
        (this.isActive = !0));
    }
    onBlur() {
      !this.isActive ||
        !this.node.animationState ||
        (this.node.animationState.setActive("whileFocus", !1),
        (this.isActive = !1));
    }
    mount() {
      this.unmount = Ot(
        jt(this.node.current, "focus", () => this.onFocus()),
        jt(this.node.current, "blur", () => this.onBlur()),
      );
    }
    unmount() {}
  };
function qn(t, e, i) {
  const { props: n } = t;
  if (t.current instanceof HTMLButtonElement && t.current.disabled) return;
  t.animationState &&
    n.whileTap &&
    t.animationState.setActive("whileTap", i === "Start");
  const s = n["onTap" + (i === "End" ? "" : i)];
  s && C.postRender(() => s(e, Wt(e)));
}
var Cc = class extends st {
    mount() {
      const { current: t } = this.node;
      t &&
        (this.unmount = Ja(
          t,
          (e, i) => (
            qn(this.node, i, "Start"),
            (n, { success: s }) => qn(this.node, n, s ? "End" : "Cancel")
          ),
          { useGlobalTarget: this.node.props.globalTapTarget },
        ));
    }
    unmount() {}
  },
  Je = new WeakMap(),
  De = new WeakMap(),
  Mc = (t) => {
    const e = Je.get(t.target);
    e && e(t);
  },
  Dc = (t) => {
    t.forEach(Mc);
  };
function Ec({ root: t, ...e }) {
  const i = t || document;
  De.has(i) || De.set(i, {});
  const n = De.get(i),
    s = JSON.stringify(e);
  return (
    n[s] || (n[s] = new IntersectionObserver(Dc, { root: t, ...e })),
    n[s]
  );
}
function Rc(t, e, i) {
  const n = Ec(e);
  return (
    Je.set(t, i),
    n.observe(t),
    () => {
      (Je.delete(t), n.unobserve(t));
    }
  );
}
var Lc = { some: 0, all: 1 },
  kc = class extends st {
    constructor() {
      (super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1));
    }
    startObserver() {
      this.unmount();
      const { viewport: t = {} } = this.node.getProps(),
        { root: e, margin: i, amount: n = "some", once: s } = t,
        o = {
          root: e ? e.current : void 0,
          rootMargin: i,
          threshold: typeof n == "number" ? n : Lc[n],
        },
        r = (a) => {
          const { isIntersecting: l } = a;
          if (
            this.isInView === l ||
            ((this.isInView = l), s && !l && this.hasEnteredView)
          )
            return;
          (l && (this.hasEnteredView = !0),
            this.node.animationState &&
              this.node.animationState.setActive("whileInView", l));
          const { onViewportEnter: c, onViewportLeave: u } =
              this.node.getProps(),
            h = l ? c : u;
          h && h(a);
        };
      return Rc(this.node.current, o, r);
    }
    mount() {
      this.startObserver();
    }
    update() {
      if (typeof IntersectionObserver > "u") return;
      const { props: t, prevProps: e } = this.node;
      ["amount", "margin", "root"].some(Ic(t, e)) && this.startObserver();
    }
    unmount() {}
  };
function Ic({ viewport: t = {} }, { viewport: e = {} } = {}) {
  return (i) => t[i] !== e[i];
}
var Bc = {
    inView: { Feature: kc },
    tap: { Feature: Cc },
    focus: { Feature: Vc },
    hover: { Feature: Ac },
  },
  Fc = { layout: { ProjectionNode: Sr, MeasureLayout: jr } },
  jc = { ...oc, ...Bc, ...bc, ...Fc },
  Zc = ec(jc, ic);
function Oc(t) {
  const e = et(() => dt(t)),
    { isStatic: i } = (0, v.useContext)(ce);
  if (i) {
    const [, n] = (0, v.useState)(t);
    (0, v.useEffect)(() => e.on("change", n), []);
  }
  return e;
}
function Or(t, e) {
  const i = Oc(e()),
    n = () => i.set(e());
  return (
    n(),
    re(() => {
      const s = () => C.preRender(n, !1, !0),
        o = t.map((r) => r.on("change", s));
      return () => {
        (o.forEach((r) => r()), J(n));
      };
    }),
    i
  );
}
function Nc(t) {
  ((Et.current = []), t());
  const e = Or(Et.current, t);
  return ((Et.current = void 0), e);
}
function Uc(t, e, i, n) {
  if (typeof t == "function") return Nc(t);
  if (i !== void 0 && !Array.isArray(i) && typeof e != "function")
    return Wc(t, e, i, n);
  const s = typeof e == "function" ? e : ll(e, i, n);
  return Array.isArray(t) ? Zn(t, s) : Zn([t], ([o]) => s(o));
}
function Zn(t, e) {
  const i = et(() => []);
  return Or(t, () => {
    i.length = 0;
    const n = t.length;
    for (let s = 0; s < n; s++) i[s] = t[s].get();
    return e(i);
  });
}
function Wc(t, e, i, n) {
  const s = et(() => Object.keys(i)),
    o = et(() => ({}));
  for (const r of s) o[r] = Uc(t, e, i[r], n);
  return o;
}
function _c(t) {
  t.values.forEach((e) => e.stop());
}
function Qe(t, e) {
  [...e].reverse().forEach((i) => {
    const n = t.getVariant(i);
    (n && xi(t, n),
      t.variantChildren &&
        t.variantChildren.forEach((s) => {
          Qe(s, e);
        }));
  });
}
function Kc(t, e) {
  if (Array.isArray(e)) return Qe(t, e);
  if (typeof e == "string") return Qe(t, [e]);
  xi(t, e);
}
function $c() {
  let t = !1;
  const e = new Set(),
    i = {
      subscribe(n) {
        return (
          e.add(n),
          () => {
            e.delete(n);
          }
        );
      },
      start(n, s) {
        it(
          t,
          "controls.start() should only be called after a component has mounted. Consider calling within a useEffect hook.",
        );
        const o = [];
        return (
          e.forEach((r) => {
            o.push(Ws(r, n, { transitionOverride: s }));
          }),
          Promise.all(o)
        );
      },
      set(n) {
        return (
          it(
            t,
            "controls.set() should only be called after a component has mounted. Consider calling within a useEffect hook.",
          ),
          e.forEach((s) => {
            Kc(s, n);
          })
        );
      },
      stop() {
        e.forEach((n) => {
          _c(n);
        });
      },
      mount() {
        return (
          (t = !0),
          () => {
            ((t = !1), i.stop());
          }
        );
      },
    };
  return i;
}
function zc() {
  const t = et($c);
  return (re(t.mount, []), t);
}
var Jc = zc;
export { qc as a, Zc as i, Uc as n, Oc as r, Jc as t };
