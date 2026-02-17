import {
  a as us,
  i as Qr,
  n as to,
  r as eo,
  t as ge,
} from "./rolldown-runtime-BaZ8gS7u.js";
var no = ge((t) => {
    var e = Symbol.for("react.transitional.element"),
      n = Symbol.for("react.portal"),
      i = Symbol.for("react.fragment"),
      s = Symbol.for("react.strict_mode"),
      o = Symbol.for("react.profiler"),
      r = Symbol.for("react.consumer"),
      a = Symbol.for("react.context"),
      l = Symbol.for("react.forward_ref"),
      c = Symbol.for("react.suspense"),
      u = Symbol.for("react.memo"),
      h = Symbol.for("react.lazy"),
      d = Symbol.for("react.activity"),
      p = Symbol.iterator;
    function m(f) {
      return f === null || typeof f != "object"
        ? null
        : ((f = (p && f[p]) || f["@@iterator"]),
          typeof f == "function" ? f : null);
    }
    var P = {
        isMounted: function () {
          return !1;
        },
        enqueueForceUpdate: function () {},
        enqueueReplaceState: function () {},
        enqueueSetState: function () {},
      },
      y = Object.assign,
      g = {};
    function A(f, v, V) {
      ((this.props = f),
        (this.context = v),
        (this.refs = g),
        (this.updater = V || P));
    }
    ((A.prototype.isReactComponent = {}),
      (A.prototype.setState = function (f, v) {
        if (typeof f != "object" && typeof f != "function" && f != null)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables.",
          );
        this.updater.enqueueSetState(this, f, v, "setState");
      }),
      (A.prototype.forceUpdate = function (f) {
        this.updater.enqueueForceUpdate(this, f, "forceUpdate");
      }));
    function T() {}
    T.prototype = A.prototype;
    function b(f, v, V) {
      ((this.props = f),
        (this.context = v),
        (this.refs = g),
        (this.updater = V || P));
    }
    var C = (b.prototype = new T());
    ((C.constructor = b), y(C, A.prototype), (C.isPureReactComponent = !0));
    var D = Array.isArray;
    function j() {}
    var x = { H: null, A: null, T: null, S: null },
      M = Object.prototype.hasOwnProperty;
    function H(f, v, V) {
      var E = V.ref;
      return {
        $$typeof: e,
        type: f,
        key: v,
        ref: E !== void 0 ? E : null,
        props: V,
      };
    }
    function Z(f, v) {
      return H(f.type, v, f.props);
    }
    function ot(f) {
      return typeof f == "object" && f !== null && f.$$typeof === e;
    }
    function Bt(f) {
      var v = { "=": "=0", ":": "=2" };
      return (
        "$" +
        f.replace(/[=:]/g, function (V) {
          return v[V];
        })
      );
    }
    var Ft = /\/+/g;
    function bt(f, v) {
      return typeof f == "object" && f !== null && f.key != null
        ? Bt("" + f.key)
        : v.toString(36);
    }
    function O(f) {
      switch (f.status) {
        case "fulfilled":
          return f.value;
        case "rejected":
          throw f.reason;
        default:
          switch (
            (typeof f.status == "string"
              ? f.then(j, j)
              : ((f.status = "pending"),
                f.then(
                  function (v) {
                    f.status === "pending" &&
                      ((f.status = "fulfilled"), (f.value = v));
                  },
                  function (v) {
                    f.status === "pending" &&
                      ((f.status = "rejected"), (f.reason = v));
                  },
                )),
            f.status)
          ) {
            case "fulfilled":
              return f.value;
            case "rejected":
              throw f.reason;
          }
      }
      throw f;
    }
    function N(f, v, V, E, R) {
      var L = typeof f;
      (L === "undefined" || L === "boolean") && (f = null);
      var I = !1;
      if (f === null) I = !0;
      else
        switch (L) {
          case "bigint":
          case "string":
          case "number":
            I = !0;
            break;
          case "object":
            switch (f.$$typeof) {
              case e:
              case n:
                I = !0;
                break;
              case h:
                return ((I = f._init), N(I(f._payload), v, V, E, R));
            }
        }
      if (I)
        return (
          (R = R(f)),
          (I = E === "" ? "." + bt(f, 0) : E),
          D(R)
            ? ((V = ""),
              I != null && (V = I.replace(Ft, "$&/") + "/"),
              N(R, v, V, "", function (Jr) {
                return Jr;
              }))
            : R != null &&
              (ot(R) &&
                (R = Z(
                  R,
                  V +
                    (R.key == null || (f && f.key === R.key)
                      ? ""
                      : ("" + R.key).replace(Ft, "$&/") + "/") +
                    I,
                )),
              v.push(R)),
          1
        );
      I = 0;
      var et = E === "" ? "." : E + ":";
      if (D(f))
        for (var Y = 0; Y < f.length; Y++)
          ((E = f[Y]), (L = et + bt(E, Y)), (I += N(E, v, V, L, R)));
      else if (((Y = m(f)), typeof Y == "function"))
        for (f = Y.call(f), Y = 0; !(E = f.next()).done; )
          ((E = E.value), (L = et + bt(E, Y++)), (I += N(E, v, V, L, R)));
      else if (L === "object") {
        if (typeof f.then == "function") return N(O(f), v, V, E, R);
        throw (
          (v = String(f)),
          Error(
            "Objects are not valid as a React child (found: " +
              (v === "[object Object]"
                ? "object with keys {" + Object.keys(f).join(", ") + "}"
                : v) +
              "). If you meant to render a collection of children, use an array instead.",
          )
        );
      }
      return I;
    }
    function G(f, v, V) {
      if (f == null) return f;
      var E = [],
        R = 0;
      return (
        N(f, E, "", "", function (L) {
          return v.call(V, L, R++);
        }),
        E
      );
    }
    function ct(f) {
      if (f._status === -1) {
        var v = f._result;
        ((v = v()),
          v.then(
            function (V) {
              (f._status === 0 || f._status === -1) &&
                ((f._status = 1), (f._result = V));
            },
            function (V) {
              (f._status === 0 || f._status === -1) &&
                ((f._status = 2), (f._result = V));
            },
          ),
          f._status === -1 && ((f._status = 0), (f._result = v)));
      }
      if (f._status === 1) return f._result.default;
      throw f._result;
    }
    var te =
        typeof reportError == "function"
          ? reportError
          : function (f) {
              if (
                typeof window == "object" &&
                typeof window.ErrorEvent == "function"
              ) {
                var v = new window.ErrorEvent("error", {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    typeof f == "object" &&
                    f !== null &&
                    typeof f.message == "string"
                      ? String(f.message)
                      : String(f),
                  error: f,
                });
                if (!window.dispatchEvent(v)) return;
              } else if (
                typeof process == "object" &&
                typeof process.emit == "function"
              ) {
                process.emit("uncaughtException", f);
                return;
              }
              console.error(f);
            },
      Zr = {
        map: G,
        forEach: function (f, v, V) {
          G(
            f,
            function () {
              v.apply(this, arguments);
            },
            V,
          );
        },
        count: function (f) {
          var v = 0;
          return (
            G(f, function () {
              v++;
            }),
            v
          );
        },
        toArray: function (f) {
          return (
            G(f, function (v) {
              return v;
            }) || []
          );
        },
        only: function (f) {
          if (!ot(f))
            throw Error(
              "React.Children.only expected to receive a single React element child.",
            );
          return f;
        },
      };
    ((t.Activity = d),
      (t.Children = Zr),
      (t.Component = A),
      (t.Fragment = i),
      (t.Profiler = o),
      (t.PureComponent = b),
      (t.StrictMode = s),
      (t.Suspense = c),
      (t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = x),
      (t.__COMPILER_RUNTIME = {
        __proto__: null,
        c: function (f) {
          return x.H.useMemoCache(f);
        },
      }),
      (t.cache = function (f) {
        return function () {
          return f.apply(null, arguments);
        };
      }),
      (t.cacheSignal = function () {
        return null;
      }),
      (t.cloneElement = function (f, v, V) {
        if (f == null)
          throw Error(
            "The argument must be a React element, but you passed " + f + ".",
          );
        var E = y({}, f.props),
          R = f.key;
        if (v != null)
          for (L in (v.key !== void 0 && (R = "" + v.key), v))
            !M.call(v, L) ||
              L === "key" ||
              L === "__self" ||
              L === "__source" ||
              (L === "ref" && v.ref === void 0) ||
              (E[L] = v[L]);
        var L = arguments.length - 2;
        if (L === 1) E.children = V;
        else if (1 < L) {
          for (var I = Array(L), et = 0; et < L; et++)
            I[et] = arguments[et + 2];
          E.children = I;
        }
        return H(f.type, R, E);
      }),
      (t.createContext = function (f) {
        return (
          (f = {
            $$typeof: a,
            _currentValue: f,
            _currentValue2: f,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
          }),
          (f.Provider = f),
          (f.Consumer = { $$typeof: r, _context: f }),
          f
        );
      }),
      (t.createElement = function (f, v, V) {
        var E,
          R = {},
          L = null;
        if (v != null)
          for (E in (v.key !== void 0 && (L = "" + v.key), v))
            M.call(v, E) &&
              E !== "key" &&
              E !== "__self" &&
              E !== "__source" &&
              (R[E] = v[E]);
        var I = arguments.length - 2;
        if (I === 1) R.children = V;
        else if (1 < I) {
          for (var et = Array(I), Y = 0; Y < I; Y++) et[Y] = arguments[Y + 2];
          R.children = et;
        }
        if (f && f.defaultProps)
          for (E in ((I = f.defaultProps), I)) R[E] === void 0 && (R[E] = I[E]);
        return H(f, L, R);
      }),
      (t.createRef = function () {
        return { current: null };
      }),
      (t.forwardRef = function (f) {
        return { $$typeof: l, render: f };
      }),
      (t.isValidElement = ot),
      (t.lazy = function (f) {
        return {
          $$typeof: h,
          _payload: { _status: -1, _result: f },
          _init: ct,
        };
      }),
      (t.memo = function (f, v) {
        return { $$typeof: u, type: f, compare: v === void 0 ? null : v };
      }),
      (t.startTransition = function (f) {
        var v = x.T,
          V = {};
        x.T = V;
        try {
          var E = f(),
            R = x.S;
          (R !== null && R(V, E),
            typeof E == "object" &&
              E !== null &&
              typeof E.then == "function" &&
              E.then(j, te));
        } catch (L) {
          te(L);
        } finally {
          (v !== null && V.types !== null && (v.types = V.types), (x.T = v));
        }
      }),
      (t.unstable_useCacheRefresh = function () {
        return x.H.useCacheRefresh();
      }),
      (t.use = function (f) {
        return x.H.use(f);
      }),
      (t.useActionState = function (f, v, V) {
        return x.H.useActionState(f, v, V);
      }),
      (t.useCallback = function (f, v) {
        return x.H.useCallback(f, v);
      }),
      (t.useContext = function (f) {
        return x.H.useContext(f);
      }),
      (t.useDebugValue = function () {}),
      (t.useDeferredValue = function (f, v) {
        return x.H.useDeferredValue(f, v);
      }),
      (t.useEffect = function (f, v) {
        return x.H.useEffect(f, v);
      }),
      (t.useEffectEvent = function (f) {
        return x.H.useEffectEvent(f);
      }),
      (t.useId = function () {
        return x.H.useId();
      }),
      (t.useImperativeHandle = function (f, v, V) {
        return x.H.useImperativeHandle(f, v, V);
      }),
      (t.useInsertionEffect = function (f, v) {
        return x.H.useInsertionEffect(f, v);
      }),
      (t.useLayoutEffect = function (f, v) {
        return x.H.useLayoutEffect(f, v);
      }),
      (t.useMemo = function (f, v) {
        return x.H.useMemo(f, v);
      }),
      (t.useOptimistic = function (f, v) {
        return x.H.useOptimistic(f, v);
      }),
      (t.useReducer = function (f, v, V) {
        return x.H.useReducer(f, v, V);
      }),
      (t.useRef = function (f) {
        return x.H.useRef(f);
      }),
      (t.useState = function (f) {
        return x.H.useState(f);
      }),
      (t.useSyncExternalStore = function (f, v, V) {
        return x.H.useSyncExternalStore(f, v, V);
      }),
      (t.useTransition = function () {
        return x.H.useTransition();
      }),
      (t.version = "19.2.4"));
  }),
  io = ge((t, e) => {
    e.exports = no();
  });
var so = ge((t) => {
    var e = Symbol.for("react.transitional.element"),
      n = Symbol.for("react.fragment");
    function i(s, o, r) {
      var a = null;
      if (
        (r !== void 0 && (a = "" + r),
        o.key !== void 0 && (a = "" + o.key),
        "key" in o)
      ) {
        r = {};
        for (var l in o) l !== "key" && (r[l] = o[l]);
      } else r = o;
      return (
        (o = r.ref),
        { $$typeof: e, type: s, key: a, ref: o !== void 0 ? o : null, props: r }
      );
    }
    ((t.Fragment = n), (t.jsx = i), (t.jsxs = i));
  }),
  ro = ge((t, e) => {
    e.exports = so();
  }),
  w = us(io(), 1),
  pn = (0, w.createContext)({});
function dt(t) {
  const e = (0, w.useRef)(null);
  return (e.current === null && (e.current = t()), e.current);
}
var cs = typeof window < "u",
  Te = cs ? w.useLayoutEffect : w.useEffect,
  xe = (0, w.createContext)(null);
function mn(t, e) {
  t.indexOf(e) === -1 && t.push(e);
}
function vn(t, e) {
  const n = t.indexOf(e);
  n > -1 && t.splice(n, 1);
}
var rt = (t, e, n) => (n > e ? e : n < t ? t : n),
  we = () => {},
  pt = () => {},
  lt = {},
  hs = (t) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t);
function fs(t) {
  return typeof t == "object" && t !== null;
}
var ds = (t) => /^0[^.\s]+$/u.test(t);
function yn(t) {
  let e;
  return () => (e === void 0 && (e = t()), e);
}
var q = (t) => t,
  oo = (t, e) => (n) => e(t(n)),
  qt = (...t) => t.reduce(oo),
  Kt = (t, e, n) => {
    const i = e - t;
    return i === 0 ? 1 : (n - t) / i;
  },
  gn = class {
    constructor() {
      this.subscriptions = [];
    }
    add(t) {
      return (mn(this.subscriptions, t), () => vn(this.subscriptions, t));
    }
    notify(t, e, n) {
      const i = this.subscriptions.length;
      if (i)
        if (i === 1) this.subscriptions[0](t, e, n);
        else
          for (let s = 0; s < i; s++) {
            const o = this.subscriptions[s];
            o && o(t, e, n);
          }
    }
    getSize() {
      return this.subscriptions.length;
    }
    clear() {
      this.subscriptions.length = 0;
    }
  },
  tt = (t) => t * 1e3,
  X = (t) => t / 1e3;
function ps(t, e) {
  return e ? t * (1e3 / e) : 0;
}
var ms = (t, e, n) =>
    (((1 - 3 * n + 3 * e) * t + (3 * n - 6 * e)) * t + 3 * e) * t,
  ao = 1e-7,
  lo = 12;
function uo(t, e, n, i, s) {
  let o,
    r,
    a = 0;
  do ((r = e + (n - e) / 2), (o = ms(r, i, s) - t), o > 0 ? (n = r) : (e = r));
  while (Math.abs(o) > ao && ++a < lo);
  return r;
}
function Zt(t, e, n, i) {
  if (t === e && n === i) return q;
  const s = (o) => uo(o, 0, 1, t, n);
  return (o) => (o === 0 || o === 1 ? o : ms(s(o), e, i));
}
var vs = (t) => (e) => (e <= 0.5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2),
  ys = (t) => (e) => 1 - t(1 - e),
  gs = Zt(0.33, 1.53, 0.69, 0.99),
  Tn = ys(gs),
  Ts = vs(Tn),
  xs = (t) =>
    (t *= 2) < 1 ? 0.5 * Tn(t) : 0.5 * (2 - Math.pow(2, -10 * (t - 1))),
  xn = (t) => 1 - Math.sin(Math.acos(t)),
  ws = ys(xn),
  Ps = vs(xn),
  co = Zt(0.42, 0, 1, 1),
  ho = Zt(0, 0, 0.58, 1),
  Ss = Zt(0.42, 0, 0.58, 1),
  fo = (t) => Array.isArray(t) && typeof t[0] != "number",
  As = (t) => Array.isArray(t) && typeof t[0] == "number",
  Kn = {
    linear: q,
    easeIn: co,
    easeInOut: Ss,
    easeOut: ho,
    circIn: xn,
    circInOut: Ps,
    circOut: ws,
    backIn: Tn,
    backInOut: Ts,
    backOut: gs,
    anticipate: xs,
  },
  po = (t) => typeof t == "string",
  zn = (t) => {
    if (As(t)) {
      pt(
        t.length === 4,
        "Cubic bezier arrays must contain four numerical values.",
        "cubic-bezier-length",
      );
      const [e, n, i, s] = t;
      return Zt(e, n, i, s);
    } else if (po(t))
      return (
        pt(
          Kn[t] !== void 0,
          `Invalid easing type '${t}'`,
          "invalid-easing-type",
        ),
        Kn[t]
      );
    return t;
  },
  ee = [
    "setup",
    "read",
    "resolveKeyframes",
    "preUpdate",
    "update",
    "preRender",
    "render",
    "postRender",
  ],
  it = { value: null, addProjectionMetrics: null };
function mo(t, e) {
  let n = new Set(),
    i = new Set(),
    s = !1,
    o = !1;
  const r = new WeakSet();
  let a = { delta: 0, timestamp: 0, isProcessing: !1 },
    l = 0;
  function c(h) {
    (r.has(h) && (u.schedule(h), t()), l++, h(a));
  }
  const u = {
    schedule: (h, d = !1, p = !1) => {
      const m = p && s ? n : i;
      return (d && r.add(h), m.has(h) || m.add(h), h);
    },
    cancel: (h) => {
      (i.delete(h), r.delete(h));
    },
    process: (h) => {
      if (((a = h), s)) {
        o = !0;
        return;
      }
      ((s = !0),
        ([n, i] = [i, n]),
        n.forEach(c),
        e && it.value && it.value.frameloop[e].push(l),
        (l = 0),
        n.clear(),
        (s = !1),
        o && ((o = !1), u.process(h)));
    },
  };
  return u;
}
var vo = 40;
function bs(t, e) {
  let n = !1,
    i = !0;
  const s = { delta: 0, timestamp: 0, isProcessing: !1 },
    o = () => (n = !0),
    r = ee.reduce((T, b) => ((T[b] = mo(o, e ? b : void 0)), T), {}),
    {
      setup: a,
      read: l,
      resolveKeyframes: c,
      preUpdate: u,
      update: h,
      preRender: d,
      render: p,
      postRender: m,
    } = r,
    P = () => {
      const T = lt.useManualTiming ? s.timestamp : performance.now();
      ((n = !1),
        lt.useManualTiming ||
          (s.delta = i ? 1e3 / 60 : Math.max(Math.min(T - s.timestamp, vo), 1)),
        (s.timestamp = T),
        (s.isProcessing = !0),
        a.process(s),
        l.process(s),
        c.process(s),
        u.process(s),
        h.process(s),
        d.process(s),
        p.process(s),
        m.process(s),
        (s.isProcessing = !1),
        n && e && ((i = !1), t(P)));
    },
    y = () => {
      ((n = !0), (i = !0), s.isProcessing || t(P));
    };
  return {
    schedule: ee.reduce((T, b) => {
      const C = r[b];
      return (
        (T[b] = (D, j = !1, x = !1) => (n || y(), C.schedule(D, j, x))),
        T
      );
    }, {}),
    cancel: (T) => {
      for (let b = 0; b < ee.length; b++) r[ee[b]].cancel(T);
    },
    state: s,
    steps: r,
  };
}
var {
    schedule: k,
    cancel: ut,
    state: $,
    steps: Ce,
  } = bs(typeof requestAnimationFrame < "u" ? requestAnimationFrame : q, !0),
  re;
function yo() {
  re = void 0;
}
var K = {
    now: () => (
      re === void 0 &&
        K.set(
          $.isProcessing || lt.useManualTiming
            ? $.timestamp
            : performance.now(),
        ),
      re
    ),
    set: (t) => {
      ((re = t), queueMicrotask(yo));
    },
  },
  Pt = { layout: 0, mainThread: 0, waapi: 0 },
  Cs = (t) => (e) => typeof e == "string" && e.startsWith(t),
  Es = Cs("--"),
  go = Cs("var(--"),
  wn = (t) => (go(t) ? To.test(t.split("/*")[0].trim()) : !1),
  To =
    /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function Yn(t) {
  return typeof t != "string" ? !1 : t.split("/*")[0].includes("var(--");
}
var kt = {
    test: (t) => typeof t == "number",
    parse: parseFloat,
    transform: (t) => t,
  },
  zt = { ...kt, transform: (t) => rt(0, 1, t) },
  ne = { ...kt, default: 1 },
  Nt = (t) => Math.round(t * 1e5) / 1e5,
  Pn = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function xo(t) {
  return t == null;
}
var wo =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  Sn = (t, e) => (n) =>
    !!(
      (typeof n == "string" && wo.test(n) && n.startsWith(t)) ||
      (e && !xo(n) && Object.prototype.hasOwnProperty.call(n, e))
    ),
  Vs = (t, e, n) => (i) => {
    if (typeof i != "string") return i;
    const [s, o, r, a] = i.match(Pn);
    return {
      [t]: parseFloat(s),
      [e]: parseFloat(o),
      [n]: parseFloat(r),
      alpha: a !== void 0 ? parseFloat(a) : 1,
    };
  },
  Po = (t) => rt(0, 255, t),
  Ee = { ...kt, transform: (t) => Math.round(Po(t)) },
  xt = {
    test: Sn("rgb", "red"),
    parse: Vs("red", "green", "blue"),
    transform: ({ red: t, green: e, blue: n, alpha: i = 1 }) =>
      "rgba(" +
      Ee.transform(t) +
      ", " +
      Ee.transform(e) +
      ", " +
      Ee.transform(n) +
      ", " +
      Nt(zt.transform(i)) +
      ")",
  };
function So(t) {
  let e = "",
    n = "",
    i = "",
    s = "";
  return (
    t.length > 5
      ? ((e = t.substring(1, 3)),
        (n = t.substring(3, 5)),
        (i = t.substring(5, 7)),
        (s = t.substring(7, 9)))
      : ((e = t.substring(1, 2)),
        (n = t.substring(2, 3)),
        (i = t.substring(3, 4)),
        (s = t.substring(4, 5)),
        (e += e),
        (n += n),
        (i += i),
        (s += s)),
    {
      red: parseInt(e, 16),
      green: parseInt(n, 16),
      blue: parseInt(i, 16),
      alpha: s ? parseInt(s, 16) / 255 : 1,
    }
  );
}
var We = { test: Sn("#"), parse: So, transform: xt.transform },
  Jt = (t) => ({
    test: (e) =>
      typeof e == "string" && e.endsWith(t) && e.split(" ").length === 1,
    parse: parseFloat,
    transform: (e) => `${e}${t}`,
  }),
  ht = Jt("deg"),
  st = Jt("%"),
  S = Jt("px"),
  Ao = Jt("vh"),
  bo = Jt("vw"),
  Gn = {
    ...st,
    parse: (t) => st.parse(t) / 100,
    transform: (t) => st.transform(t * 100),
  },
  Et = {
    test: Sn("hsl", "hue"),
    parse: Vs("hue", "saturation", "lightness"),
    transform: ({ hue: t, saturation: e, lightness: n, alpha: i = 1 }) =>
      "hsla(" +
      Math.round(t) +
      ", " +
      st.transform(Nt(e)) +
      ", " +
      st.transform(Nt(n)) +
      ", " +
      Nt(zt.transform(i)) +
      ")",
  },
  _ = {
    test: (t) => xt.test(t) || We.test(t) || Et.test(t),
    parse: (t) =>
      xt.test(t) ? xt.parse(t) : Et.test(t) ? Et.parse(t) : We.parse(t),
    transform: (t) =>
      typeof t == "string"
        ? t
        : t.hasOwnProperty("red")
          ? xt.transform(t)
          : Et.transform(t),
    getAnimatableNone: (t) => {
      const e = _.parse(t);
      return ((e.alpha = 0), _.transform(e));
    },
  },
  Co =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function Eo(t) {
  return (
    isNaN(t) &&
    typeof t == "string" &&
    (t.match(Pn)?.length || 0) + (t.match(Co)?.length || 0) > 0
  );
}
var Ms = "number",
  Ds = "color",
  Vo = "var",
  Mo = "var(",
  Xn = "${}",
  Do =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Yt(t) {
  const e = t.toString(),
    n = [],
    i = { color: [], number: [], var: [] },
    s = [];
  let o = 0;
  return {
    values: n,
    split: e
      .replace(
        Do,
        (r) => (
          _.test(r)
            ? (i.color.push(o), s.push(Ds), n.push(_.parse(r)))
            : r.startsWith(Mo)
              ? (i.var.push(o), s.push(Vo), n.push(r))
              : (i.number.push(o), s.push(Ms), n.push(parseFloat(r))),
          ++o,
          Xn
        ),
      )
      .split(Xn),
    indexes: i,
    types: s,
  };
}
function Rs(t) {
  return Yt(t).values;
}
function Ls(t) {
  const { split: e, types: n } = Yt(t),
    i = e.length;
  return (s) => {
    let o = "";
    for (let r = 0; r < i; r++)
      if (((o += e[r]), s[r] !== void 0)) {
        const a = n[r];
        a === Ms
          ? (o += Nt(s[r]))
          : a === Ds
            ? (o += _.transform(s[r]))
            : (o += s[r]);
      }
    return o;
  };
}
var Ro = (t) =>
  typeof t == "number" ? 0 : _.test(t) ? _.getAnimatableNone(t) : t;
function Lo(t) {
  const e = Rs(t);
  return Ls(t)(e.map(Ro));
}
var mt = { test: Eo, parse: Rs, createTransformer: Ls, getAnimatableNone: Lo };
function Ve(t, e, n) {
  return (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6
      ? t + (e - t) * 6 * n
      : n < 1 / 2
        ? e
        : n < 2 / 3
          ? t + (e - t) * (2 / 3 - n) * 6
          : t
  );
}
function ko({ hue: t, saturation: e, lightness: n, alpha: i }) {
  ((t /= 360), (e /= 100), (n /= 100));
  let s = 0,
    o = 0,
    r = 0;
  if (!e) s = o = r = n;
  else {
    const a = n < 0.5 ? n * (1 + e) : n + e - n * e,
      l = 2 * n - a;
    ((s = Ve(l, a, t + 1 / 3)), (o = Ve(l, a, t)), (r = Ve(l, a, t - 1 / 3)));
  }
  return {
    red: Math.round(s * 255),
    green: Math.round(o * 255),
    blue: Math.round(r * 255),
    alpha: i,
  };
}
function fe(t, e) {
  return (n) => (n > 0 ? e : t);
}
var F = (t, e, n) => t + (e - t) * n,
  Me = (t, e, n) => {
    const i = t * t,
      s = n * (e * e - i) + i;
    return s < 0 ? 0 : Math.sqrt(s);
  },
  Io = [We, xt, Et],
  jo = (t) => Io.find((e) => e.test(t));
function qn(t) {
  const e = jo(t);
  if (
    (we(
      !!e,
      `'${t}' is not an animatable color. Use the equivalent color code instead.`,
      "color-not-animatable",
    ),
    !e)
  )
    return !1;
  let n = e.parse(t);
  return (e === Et && (n = ko(n)), n);
}
var Zn = (t, e) => {
    const n = qn(t),
      i = qn(e);
    if (!n || !i) return fe(t, e);
    const s = { ...n };
    return (o) => (
      (s.red = Me(n.red, i.red, o)),
      (s.green = Me(n.green, i.green, o)),
      (s.blue = Me(n.blue, i.blue, o)),
      (s.alpha = F(n.alpha, i.alpha, o)),
      xt.transform(s)
    );
  },
  He = new Set(["none", "hidden"]);
function Bo(t, e) {
  return He.has(t) ? (n) => (n <= 0 ? t : e) : (n) => (n >= 1 ? e : t);
}
function Fo(t, e) {
  return (n) => F(t, e, n);
}
function An(t) {
  return typeof t == "number"
    ? Fo
    : typeof t == "string"
      ? wn(t)
        ? fe
        : _.test(t)
          ? Zn
          : No
      : Array.isArray(t)
        ? ks
        : typeof t == "object"
          ? _.test(t)
            ? Zn
            : _o
          : fe;
}
function ks(t, e) {
  const n = [...t],
    i = n.length,
    s = t.map((o, r) => An(o)(o, e[r]));
  return (o) => {
    for (let r = 0; r < i; r++) n[r] = s[r](o);
    return n;
  };
}
function _o(t, e) {
  const n = { ...t, ...e },
    i = {};
  for (const s in n)
    t[s] !== void 0 && e[s] !== void 0 && (i[s] = An(t[s])(t[s], e[s]));
  return (s) => {
    for (const o in i) n[o] = i[o](s);
    return n;
  };
}
function Oo(t, e) {
  const n = [],
    i = { color: 0, var: 0, number: 0 };
  for (let s = 0; s < e.values.length; s++) {
    const o = e.types[s],
      r = t.indexes[o][i[o]];
    ((n[s] = t.values[r] ?? 0), i[o]++);
  }
  return n;
}
var No = (t, e) => {
  const n = mt.createTransformer(e),
    i = Yt(t),
    s = Yt(e);
  return i.indexes.var.length === s.indexes.var.length &&
    i.indexes.color.length === s.indexes.color.length &&
    i.indexes.number.length >= s.indexes.number.length
    ? (He.has(t) && !s.values.length) || (He.has(e) && !i.values.length)
      ? Bo(t, e)
      : qt(ks(Oo(i, s), s.values), n)
    : (we(
        !0,
        `Complex values '${t}' and '${e}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`,
        "complex-values-different",
      ),
      fe(t, e));
};
function Is(t, e, n) {
  return typeof t == "number" && typeof e == "number" && typeof n == "number"
    ? F(t, e, n)
    : An(t)(t, e);
}
var Uo = (t) => {
    const e = ({ timestamp: n }) => t(n);
    return {
      start: (n = !0) => k.update(e, n),
      stop: () => ut(e),
      now: () => ($.isProcessing ? $.timestamp : K.now()),
    };
  },
  js = (t, e, n = 10) => {
    let i = "";
    const s = Math.max(Math.round(e / n), 2);
    for (let o = 0; o < s; o++)
      i += Math.round(t(o / (s - 1)) * 1e4) / 1e4 + ", ";
    return `linear(${i.substring(0, i.length - 2)})`;
  },
  Bs = 2e4;
function bn(t) {
  let e = 0;
  const n = 50;
  let i = t.next(e);
  for (; !i.done && e < 2e4; ) ((e += n), (i = t.next(e)));
  return e >= 2e4 ? 1 / 0 : e;
}
function $o(t, e = 100, n) {
  const i = n({ ...t, keyframes: [0, e] }),
    s = Math.min(bn(i), Bs);
  return {
    type: "keyframes",
    ease: (o) => i.next(s * o).value / e,
    duration: X(s),
  };
}
var Wo = 5;
function Fs(t, e, n) {
  const i = Math.max(e - Wo, 0);
  return ps(n - t(i), e - i);
}
var B = {
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
  De = 0.001;
function Ho({
  duration: t = B.duration,
  bounce: e = B.bounce,
  velocity: n = B.velocity,
  mass: i = B.mass,
}) {
  let s, o;
  we(
    t <= tt(B.maxDuration),
    "Spring duration must be 10 seconds or less",
    "spring-duration-limit",
  );
  let r = 1 - e;
  ((r = rt(B.minDamping, B.maxDamping, r)),
    (t = rt(B.minDuration, B.maxDuration, X(t))),
    r < 1
      ? ((s = (c) => {
          const u = c * r,
            h = u * t,
            d = u - n,
            p = Ke(c, r),
            m = Math.exp(-h);
          return De - (d / p) * m;
        }),
        (o = (c) => {
          const u = c * r * t,
            h = u * n + n,
            d = Math.pow(r, 2) * Math.pow(c, 2) * t,
            p = Math.exp(-u),
            m = Ke(Math.pow(c, 2), r);
          return ((-s(c) + De > 0 ? -1 : 1) * ((h - d) * p)) / m;
        }))
      : ((s = (c) => {
          const u = Math.exp(-c * t),
            h = (c - n) * t + 1;
          return -De + u * h;
        }),
        (o = (c) => Math.exp(-c * t) * ((n - c) * (t * t)))));
  const a = 5 / t,
    l = zo(s, o, a);
  if (((t = tt(t)), isNaN(l)))
    return { stiffness: B.stiffness, damping: B.damping, duration: t };
  {
    const c = Math.pow(l, 2) * i;
    return { stiffness: c, damping: r * 2 * Math.sqrt(i * c), duration: t };
  }
}
var Ko = 12;
function zo(t, e, n) {
  let i = n;
  for (let s = 1; s < Ko; s++) i = i - t(i) / e(i);
  return i;
}
function Ke(t, e) {
  return t * Math.sqrt(1 - e * e);
}
var Yo = ["duration", "bounce"],
  Go = ["stiffness", "damping", "mass"];
function Jn(t, e) {
  return e.some((n) => t[n] !== void 0);
}
function Xo(t) {
  let e = {
    velocity: B.velocity,
    stiffness: B.stiffness,
    damping: B.damping,
    mass: B.mass,
    isResolvedFromDuration: !1,
    ...t,
  };
  if (!Jn(t, Go) && Jn(t, Yo))
    if (t.visualDuration) {
      const n = t.visualDuration,
        i = (2 * Math.PI) / (n * 1.2),
        s = i * i,
        o = 2 * rt(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(s);
      e = { ...e, mass: B.mass, stiffness: s, damping: o };
    } else {
      const n = Ho(t);
      ((e = { ...e, ...n, mass: B.mass }), (e.isResolvedFromDuration = !0));
    }
  return e;
}
function de(t = B.visualDuration, e = B.bounce) {
  const n =
    typeof t != "object"
      ? { visualDuration: t, keyframes: [0, 1], bounce: e }
      : t;
  let { restSpeed: i, restDelta: s } = n;
  const o = n.keyframes[0],
    r = n.keyframes[n.keyframes.length - 1],
    a = { done: !1, value: o },
    {
      stiffness: l,
      damping: c,
      mass: u,
      duration: h,
      velocity: d,
      isResolvedFromDuration: p,
    } = Xo({ ...n, velocity: -X(n.velocity || 0) }),
    m = d || 0,
    P = c / (2 * Math.sqrt(l * u)),
    y = r - o,
    g = X(Math.sqrt(l / u)),
    A = Math.abs(y) < 5;
  (i || (i = A ? B.restSpeed.granular : B.restSpeed.default),
    s || (s = A ? B.restDelta.granular : B.restDelta.default));
  let T;
  if (P < 1) {
    const C = Ke(g, P);
    T = (D) =>
      r -
      Math.exp(-P * g * D) *
        (((m + P * g * y) / C) * Math.sin(C * D) + y * Math.cos(C * D));
  } else if (P === 1) T = (C) => r - Math.exp(-g * C) * (y + (m + g * y) * C);
  else {
    const C = g * Math.sqrt(P * P - 1);
    T = (D) => {
      const j = Math.exp(-P * g * D),
        x = Math.min(C * D, 300);
      return (
        r - (j * ((m + P * g * y) * Math.sinh(x) + C * y * Math.cosh(x))) / C
      );
    };
  }
  const b = {
    calculatedDuration: (p && h) || null,
    next: (C) => {
      const D = T(C);
      if (p) a.done = C >= h;
      else {
        let j = C === 0 ? m : 0;
        P < 1 && (j = C === 0 ? tt(m) : Fs(T, C, D));
        const x = Math.abs(j) <= i,
          M = Math.abs(r - D) <= s;
        a.done = x && M;
      }
      return ((a.value = a.done ? r : D), a);
    },
    toString: () => {
      const C = Math.min(bn(b), Bs),
        D = js((j) => b.next(C * j).value, C, 30);
      return C + "ms " + D;
    },
    toTransition: () => {},
  };
  return b;
}
de.applyToOptions = (t) => {
  const e = $o(t, 100, de);
  return (
    (t.ease = e.ease),
    (t.duration = tt(e.duration)),
    (t.type = "keyframes"),
    t
  );
};
function ze({
  keyframes: t,
  velocity: e = 0,
  power: n = 0.8,
  timeConstant: i = 325,
  bounceDamping: s = 10,
  bounceStiffness: o = 500,
  modifyTarget: r,
  min: a,
  max: l,
  restDelta: c = 0.5,
  restSpeed: u,
}) {
  const h = t[0],
    d = { done: !1, value: h },
    p = (x) => (a !== void 0 && x < a) || (l !== void 0 && x > l),
    m = (x) =>
      a === void 0
        ? l
        : l === void 0 || Math.abs(a - x) < Math.abs(l - x)
          ? a
          : l;
  let P = n * e;
  const y = h + P,
    g = r === void 0 ? y : r(y);
  g !== y && (P = g - h);
  const A = (x) => -P * Math.exp(-x / i),
    T = (x) => g + A(x),
    b = (x) => {
      const M = A(x),
        H = T(x);
      ((d.done = Math.abs(M) <= c), (d.value = d.done ? g : H));
    };
  let C, D;
  const j = (x) => {
    p(d.value) &&
      ((C = x),
      (D = de({
        keyframes: [d.value, m(d.value)],
        velocity: Fs(T, x, d.value),
        damping: s,
        stiffness: o,
        restDelta: c,
        restSpeed: u,
      })));
  };
  return (
    j(0),
    {
      calculatedDuration: null,
      next: (x) => {
        let M = !1;
        return (
          !D && C === void 0 && ((M = !0), b(x), j(x)),
          C !== void 0 && x >= C ? D.next(x - C) : (!M && b(x), d)
        );
      },
    }
  );
}
function qo(t, e, n) {
  const i = [],
    s = n || lt.mix || Is,
    o = t.length - 1;
  for (let r = 0; r < o; r++) {
    let a = s(t[r], t[r + 1]);
    (e && (a = qt(Array.isArray(e) ? e[r] || q : e, a)), i.push(a));
  }
  return i;
}
function _s(t, e, { clamp: n = !0, ease: i, mixer: s } = {}) {
  const o = t.length;
  if (
    (pt(
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
  const a = qo(e, i, s),
    l = a.length,
    c = (u) => {
      if (r && u < t[0]) return e[0];
      let h = 0;
      if (l > 1) for (; h < t.length - 2 && !(u < t[h + 1]); h++);
      const d = Kt(t[h], t[h + 1], u);
      return a[h](d);
    };
  return n ? (u) => c(rt(t[0], t[o - 1], u)) : c;
}
function Zo(t, e) {
  const n = t[t.length - 1];
  for (let i = 1; i <= e; i++) {
    const s = Kt(0, e, i);
    t.push(F(n, 1, s));
  }
}
function Jo(t) {
  const e = [0];
  return (Zo(e, t.length - 1), e);
}
function Qo(t, e) {
  return t.map((n) => n * e);
}
function ta(t, e) {
  return t.map(() => e || Ss).splice(0, t.length - 1);
}
function Ut({
  duration: t = 300,
  keyframes: e,
  times: n,
  ease: i = "easeInOut",
}) {
  const s = fo(i) ? i.map(zn) : zn(i),
    o = { done: !1, value: e[0] },
    r = _s(Qo(n && n.length === e.length ? n : Jo(e), t), e, {
      ease: Array.isArray(s) ? s : ta(e, s),
    });
  return {
    calculatedDuration: t,
    next: (a) => ((o.value = r(a)), (o.done = a >= t), o),
  };
}
var ea = (t) => t !== null;
function Cn(t, { repeat: e, repeatType: n = "loop" }, i, s = 1) {
  const o = t.filter(ea),
    r = s < 0 || (e && n !== "loop" && e % 2 === 1) ? 0 : o.length - 1;
  return !r || i === void 0 ? o[r] : i;
}
var na = { decay: ze, inertia: ze, tween: Ut, keyframes: Ut, spring: de };
function Os(t) {
  typeof t.type == "string" && (t.type = na[t.type]);
}
var En = class {
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
  ia = (t) => t / 100,
  Vn = class extends En {
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
          (e && e.updatedAt !== K.now() && this.tick(K.now()),
            (this.isStopped = !0),
            this.state !== "idle" &&
              (this.teardown(), this.options.onStop?.()));
        }),
        Pt.mainThread++,
        (this.options = t),
        this.initAnimation(),
        this.play(),
        t.autoplay === !1 && this.pause());
    }
    initAnimation() {
      const { options: t } = this;
      Os(t);
      const {
        type: e = Ut,
        repeat: n = 0,
        repeatDelay: i = 0,
        repeatType: s,
        velocity: o = 0,
      } = t;
      let { keyframes: r } = t;
      const a = e || Ut;
      a !== Ut &&
        typeof r[0] != "number" &&
        ((this.mixKeyframes = qt(ia, Is(r[0], r[1]))), (r = [0, 100]));
      const l = a({ ...t, keyframes: r });
      (s === "mirror" &&
        (this.mirroredGenerator = a({
          ...t,
          keyframes: [...r].reverse(),
          velocity: -o,
        })),
        l.calculatedDuration === null && (l.calculatedDuration = bn(l)));
      const { calculatedDuration: c } = l;
      ((this.calculatedDuration = c),
        (this.resolvedDuration = c + i),
        (this.totalDuration = this.resolvedDuration * (n + 1) - i),
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
        generator: n,
        totalDuration: i,
        mixKeyframes: s,
        mirroredGenerator: o,
        resolvedDuration: r,
        calculatedDuration: a,
      } = this;
      if (this.startTime === null) return n.next(0);
      const {
        delay: l = 0,
        keyframes: c,
        repeat: u,
        repeatType: h,
        repeatDelay: d,
        type: p,
        onUpdate: m,
        finalKeyframe: P,
      } = this.options;
      (this.speed > 0
        ? (this.startTime = Math.min(this.startTime, t))
        : this.speed < 0 &&
          (this.startTime = Math.min(t - i / this.speed, this.startTime)),
        e ? (this.currentTime = t) : this.updateTime(t));
      const y = this.currentTime - l * (this.playbackSpeed >= 0 ? 1 : -1),
        g = this.playbackSpeed >= 0 ? y < 0 : y > i;
      ((this.currentTime = Math.max(y, 0)),
        this.state === "finished" &&
          this.holdTime === null &&
          (this.currentTime = i));
      let A = this.currentTime,
        T = n;
      if (u) {
        const j = Math.min(this.currentTime, i) / r;
        let x = Math.floor(j),
          M = j % 1;
        (!M && j >= 1 && (M = 1),
          M === 1 && x--,
          (x = Math.min(x, u + 1)),
          x % 2 &&
            (h === "reverse"
              ? ((M = 1 - M), d && (M -= d / r))
              : h === "mirror" && (T = o)),
          (A = rt(0, 1, M) * r));
      }
      const b = g ? { done: !1, value: c[0] } : T.next(A);
      s && (b.value = s(b.value));
      let { done: C } = b;
      !g &&
        a !== null &&
        (C =
          this.playbackSpeed >= 0
            ? this.currentTime >= i
            : this.currentTime <= 0);
      const D =
        this.holdTime === null &&
        (this.state === "finished" || (this.state === "running" && C));
      return (
        D && p !== ze && (b.value = Cn(c, this.options, P, this.speed)),
        m && m(b.value),
        D && this.finish(),
        b
      );
    }
    then(t, e) {
      return this.finished.then(t, e);
    }
    get duration() {
      return X(this.calculatedDuration);
    }
    get iterationDuration() {
      const { delay: t = 0 } = this.options || {};
      return this.duration + X(t);
    }
    get time() {
      return X(this.currentTime);
    }
    set time(t) {
      ((t = tt(t)),
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
      this.updateTime(K.now());
      const e = this.playbackSpeed !== t;
      ((this.playbackSpeed = t), e && (this.time = X(this.currentTime)));
    }
    play() {
      if (this.isStopped) return;
      const { driver: t = Uo, startTime: e } = this.options;
      (this.driver || (this.driver = t((i) => this.tick(i))),
        this.options.onPlay?.());
      const n = this.driver.now();
      (this.state === "finished"
        ? (this.updateFinished(), (this.startTime = n))
        : this.holdTime !== null
          ? (this.startTime = n - this.holdTime)
          : this.startTime || (this.startTime = e ?? n),
        this.state === "finished" &&
          this.speed < 0 &&
          (this.startTime += this.calculatedDuration),
        (this.holdTime = null),
        (this.state = "running"),
        this.driver.start());
    }
    pause() {
      ((this.state = "paused"),
        this.updateTime(K.now()),
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
        Pt.mainThread--);
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
function sa(t) {
  for (let e = 1; e < t.length; e++) t[e] ?? (t[e] = t[e - 1]);
}
var wt = (t) => (t * 180) / Math.PI,
  Ye = (t) => Ge(wt(Math.atan2(t[1], t[0]))),
  ra = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
    rotate: Ye,
    rotateZ: Ye,
    skewX: (t) => wt(Math.atan(t[1])),
    skewY: (t) => wt(Math.atan(t[2])),
    skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2,
  },
  Ge = (t) => ((t = t % 360), t < 0 && (t += 360), t),
  Qn = Ye,
  ti = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]),
  ei = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]),
  oa = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: ti,
    scaleY: ei,
    scale: (t) => (ti(t) + ei(t)) / 2,
    rotateX: (t) => Ge(wt(Math.atan2(t[6], t[5]))),
    rotateY: (t) => Ge(wt(Math.atan2(-t[2], t[0]))),
    rotateZ: Qn,
    rotate: Qn,
    skewX: (t) => wt(Math.atan(t[4])),
    skewY: (t) => wt(Math.atan(t[1])),
    skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2,
  };
function Xe(t) {
  return t.includes("scale") ? 1 : 0;
}
function qe(t, e) {
  if (!t || t === "none") return Xe(e);
  const n = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let i, s;
  if (n) ((i = oa), (s = n));
  else {
    const a = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    ((i = ra), (s = a));
  }
  if (!s) return Xe(e);
  const o = i[e],
    r = s[1].split(",").map(la);
  return typeof o == "function" ? o(r) : r[o];
}
var aa = (t, e) => {
  const { transform: n = "none" } = getComputedStyle(t);
  return qe(n, e);
};
function la(t) {
  return parseFloat(t.trim());
}
var It = [
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
  jt = new Set(It),
  ni = (t) => t === kt || t === S,
  ua = new Set(["x", "y", "z"]),
  ca = It.filter((t) => !ua.has(t));
function ha(t) {
  const e = [];
  return (
    ca.forEach((n) => {
      const i = t.getValue(n);
      i !== void 0 &&
        (e.push([n, i.get()]), i.set(n.startsWith("scale") ? 1 : 0));
    }),
    e
  );
}
var ft = {
  width: ({ x: t }, { paddingLeft: e = "0", paddingRight: n = "0" }) =>
    t.max - t.min - parseFloat(e) - parseFloat(n),
  height: ({ y: t }, { paddingTop: e = "0", paddingBottom: n = "0" }) =>
    t.max - t.min - parseFloat(e) - parseFloat(n),
  top: (t, { top: e }) => parseFloat(e),
  left: (t, { left: e }) => parseFloat(e),
  bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
  right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
  x: (t, { transform: e }) => qe(e, "x"),
  y: (t, { transform: e }) => qe(e, "y"),
};
ft.translateX = ft.x;
ft.translateY = ft.y;
var St = new Set(),
  Ze = !1,
  Je = !1,
  Qe = !1;
function Ns() {
  if (Je) {
    const t = Array.from(St).filter((i) => i.needsMeasurement),
      e = new Set(t.map((i) => i.element)),
      n = new Map();
    (e.forEach((i) => {
      const s = ha(i);
      s.length && (n.set(i, s), i.render());
    }),
      t.forEach((i) => i.measureInitialState()),
      e.forEach((i) => {
        i.render();
        const s = n.get(i);
        s &&
          s.forEach(([o, r]) => {
            i.getValue(o)?.set(r);
          });
      }),
      t.forEach((i) => i.measureEndState()),
      t.forEach((i) => {
        i.suspendedScrollY !== void 0 && window.scrollTo(0, i.suspendedScrollY);
      }));
  }
  ((Je = !1), (Ze = !1), St.forEach((t) => t.complete(Qe)), St.clear());
}
function Us() {
  St.forEach((t) => {
    (t.readKeyframes(), t.needsMeasurement && (Je = !0));
  });
}
function fa() {
  ((Qe = !0), Us(), Ns(), (Qe = !1));
}
var Mn = class {
    constructor(t, e, n, i, s, o = !1) {
      ((this.state = "pending"),
        (this.isAsync = !1),
        (this.needsMeasurement = !1),
        (this.unresolvedKeyframes = [...t]),
        (this.onComplete = e),
        (this.name = n),
        (this.motionValue = i),
        (this.element = s),
        (this.isAsync = o));
    }
    scheduleResolve() {
      ((this.state = "scheduled"),
        this.isAsync
          ? (St.add(this),
            Ze || ((Ze = !0), k.read(Us), k.resolveKeyframes(Ns)))
          : (this.readKeyframes(), this.complete()));
    }
    readKeyframes() {
      const {
        unresolvedKeyframes: t,
        name: e,
        element: n,
        motionValue: i,
      } = this;
      if (t[0] === null) {
        const s = i?.get(),
          o = t[t.length - 1];
        if (s !== void 0) t[0] = s;
        else if (n && e) {
          const r = n.readValue(e, o);
          r != null && (t[0] = r);
        }
        (t[0] === void 0 && (t[0] = o), i && s === void 0 && i.set(t[0]));
      }
      sa(t);
    }
    setFinalKeyframe() {}
    measureInitialState() {}
    renderEndStyles() {}
    measureEndState() {}
    complete(t = !1) {
      ((this.state = "complete"),
        this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t),
        St.delete(this));
    }
    cancel() {
      this.state === "scheduled" && (St.delete(this), (this.state = "pending"));
    }
    resume() {
      this.state === "pending" && this.scheduleResolve();
    }
  },
  da = (t) => t.startsWith("--");
function pa(t, e, n) {
  da(e) ? t.style.setProperty(e, n) : (t.style[e] = n);
}
var ma = yn(() => window.ScrollTimeline !== void 0),
  va = {};
function ya(t, e) {
  const n = yn(t);
  return () => va[e] ?? n();
}
var $s = ya(() => {
    try {
      document
        .createElement("div")
        .animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch {
      return !1;
    }
    return !0;
  }, "linearEasing"),
  Ot = ([t, e, n, i]) => `cubic-bezier(${t}, ${e}, ${n}, ${i})`,
  ii = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: Ot([0, 0.65, 0.55, 1]),
    circOut: Ot([0.55, 0, 1, 0.45]),
    backIn: Ot([0.31, 0.01, 0.66, -0.59]),
    backOut: Ot([0.33, 1.53, 0.69, 0.99]),
  };
function Ws(t, e) {
  if (t)
    return typeof t == "function"
      ? $s()
        ? js(t, e)
        : "ease-out"
      : As(t)
        ? Ot(t)
        : Array.isArray(t)
          ? t.map((n) => Ws(n, e) || ii.easeOut)
          : ii[t];
}
function ga(
  t,
  e,
  n,
  {
    delay: i = 0,
    duration: s = 300,
    repeat: o = 0,
    repeatType: r = "loop",
    ease: a = "easeOut",
    times: l,
  } = {},
  c = void 0,
) {
  const u = { [e]: n };
  l && (u.offset = l);
  const h = Ws(a, s);
  (Array.isArray(h) && (u.easing = h), it.value && Pt.waapi++);
  const d = {
    delay: i,
    duration: s,
    easing: Array.isArray(h) ? "linear" : h,
    fill: "both",
    iterations: o + 1,
    direction: r === "reverse" ? "alternate" : "normal",
  };
  c && (d.pseudoElement = c);
  const p = t.animate(u, d);
  return (
    it.value &&
      p.finished.finally(() => {
        Pt.waapi--;
      }),
    p
  );
}
function Hs(t) {
  return typeof t == "function" && "applyToOptions" in t;
}
function Ta({ type: t, ...e }) {
  return Hs(t) && $s()
    ? t.applyToOptions(e)
    : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e);
}
var xa = class extends En {
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
        name: n,
        keyframes: i,
        pseudoElement: s,
        allowFlatten: o = !1,
        finalKeyframe: r,
        onComplete: a,
      } = t;
      ((this.isPseudoElement = !!s),
        (this.allowFlatten = o),
        (this.options = t),
        pt(
          typeof t.type != "string",
          `Mini animate() doesn't support "type" as a string.`,
          "mini-spring",
        ));
      const l = Ta(t);
      ((this.animation = ga(e, n, i, l, s)),
        l.autoplay === !1 && this.animation.pause(),
        (this.animation.onfinish = () => {
          if (((this.finishedTime = this.time), !s)) {
            const c = Cn(i, this.options, r, this.speed);
            (this.updateMotionValue ? this.updateMotionValue(c) : pa(e, n, c),
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
      return X(Number(t));
    }
    get iterationDuration() {
      const { delay: t = 0 } = this.options || {};
      return this.duration + X(t);
    }
    get time() {
      return X(Number(this.animation.currentTime) || 0);
    }
    set time(t) {
      ((this.manualStartTime = null),
        (this.finishedTime = null),
        (this.animation.currentTime = tt(t)));
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
        t && ma() ? ((this.animation.timeline = t), q) : e(this)
      );
    }
  },
  Ks = { anticipate: xs, backInOut: Ts, circInOut: Ps };
function wa(t) {
  return t in Ks;
}
function Pa(t) {
  typeof t.ease == "string" && wa(t.ease) && (t.ease = Ks[t.ease]);
}
var Re = 10,
  Sa = class extends xa {
    constructor(t) {
      (Pa(t),
        Os(t),
        super(t),
        t.startTime !== void 0 && (this.startTime = t.startTime),
        (this.options = t));
    }
    updateMotionValue(t) {
      const {
        motionValue: e,
        onUpdate: n,
        onComplete: i,
        element: s,
        ...o
      } = this.options;
      if (!e) return;
      if (t !== void 0) {
        e.set(t);
        return;
      }
      const r = new Vn({ ...o, autoplay: !1 }),
        a = Math.max(Re, K.now() - this.startTime),
        l = rt(0, Re, a - Re);
      (e.setWithVelocity(
        r.sample(Math.max(0, a - l)).value,
        r.sample(a).value,
        l,
      ),
        r.stop());
    }
  },
  si = (t, e) =>
    e === "zIndex"
      ? !1
      : !!(
          typeof t == "number" ||
          Array.isArray(t) ||
          (typeof t == "string" &&
            (mt.test(t) || t === "0") &&
            !t.startsWith("url("))
        );
function Aa(t) {
  const e = t[0];
  if (t.length === 1) return !0;
  for (let n = 0; n < t.length; n++) if (t[n] !== e) return !0;
}
function ba(t, e, n, i) {
  const s = t[0];
  if (s === null) return !1;
  if (e === "display" || e === "visibility") return !0;
  const o = t[t.length - 1],
    r = si(s, e),
    a = si(o, e);
  return (
    we(
      r === a,
      `You are trying to animate ${e} from "${s}" to "${o}". "${r ? o : s}" is not an animatable value.`,
      "value-not-animatable",
    ),
    !r || !a ? !1 : Aa(t) || ((n === "spring" || Hs(n)) && i)
  );
}
function tn(t) {
  ((t.duration = 0), (t.type = "keyframes"));
}
var Ca = new Set(["opacity", "clipPath", "filter", "transform"]),
  Ea = yn(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function Va(t) {
  const {
    motionValue: e,
    name: n,
    repeatDelay: i,
    repeatType: s,
    damping: o,
    type: r,
  } = t;
  if (!(e?.owner?.current instanceof HTMLElement)) return !1;
  const { onUpdate: a, transformTemplate: l } = e.owner.getProps();
  return (
    Ea() &&
    n &&
    Ca.has(n) &&
    (n !== "transform" || !l) &&
    !a &&
    !i &&
    s !== "mirror" &&
    o !== 0 &&
    r !== "inertia"
  );
}
var Ma = 40,
  Da = class extends En {
    constructor({
      autoplay: t = !0,
      delay: e = 0,
      type: n = "keyframes",
      repeat: i = 0,
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
        (this.createdAt = K.now()));
      const h = {
        autoplay: t,
        delay: e,
        type: n,
        repeat: i,
        repeatDelay: s,
        repeatType: o,
        name: a,
        motionValue: l,
        element: c,
        ...u,
      };
      ((this.keyframeResolver = new (c?.KeyframeResolver || Mn)(
        r,
        (d, p, m) => this.onKeyframesResolved(d, p, h, !m),
        a,
        l,
        c,
      )),
        this.keyframeResolver?.scheduleResolve());
    }
    onKeyframesResolved(t, e, n, i) {
      this.keyframeResolver = void 0;
      const {
        name: s,
        type: o,
        velocity: r,
        delay: a,
        isHandoff: l,
        onUpdate: c,
      } = n;
      ((this.resolvedAt = K.now()),
        ba(t, s, o, r) ||
          ((lt.instantAnimations || !a) && c?.(Cn(t, n, e)),
          (t[0] = t[t.length - 1]),
          tn(n),
          (n.repeat = 0)));
      const u = {
          startTime: i
            ? this.resolvedAt
              ? this.resolvedAt - this.createdAt > Ma
                ? this.resolvedAt
                : this.createdAt
              : this.createdAt
            : void 0,
          finalKeyframe: e,
          ...n,
          keyframes: t,
        },
        h = !l && Va(u),
        d = u.motionValue?.owner?.current,
        p = h ? new Sa({ ...u, element: d }) : new Vn(u);
      (p.finished
        .then(() => {
          this.notifyFinished();
        })
        .catch(q),
        this.pendingTimeline &&
          ((this.stopTimeline = p.attachTimeline(this.pendingTimeline)),
          (this.pendingTimeline = void 0)),
        (this._animation = p));
    }
    get finished() {
      return this._animation ? this.animation.finished : this._finished;
    }
    then(t, e) {
      return this.finished.finally(t).then(() => {});
    }
    get animation() {
      return (
        this._animation || (this.keyframeResolver?.resume(), fa()),
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
function zs(t, e, n, i = 0, s = 1) {
  const o = Array.from(t)
      .sort((l, c) => l.sortNodePosition(c))
      .indexOf(e),
    r = t.size,
    a = (r - 1) * i;
  return typeof n == "function" ? n(o, r) : s === 1 ? o * i : a - o * i;
}
var Ra = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function La(t) {
  const e = Ra.exec(t);
  if (!e) return [,];
  const [, n, i, s] = e;
  return [`--${n ?? i}`, s];
}
var ka = 4;
function Ys(t, e, n = 1) {
  pt(
    n <= ka,
    `Max CSS variable fallback depth detected in property "${t}". This may indicate a circular fallback dependency.`,
    "max-css-var-depth",
  );
  const [i, s] = La(t);
  if (!i) return;
  const o = window.getComputedStyle(e).getPropertyValue(i);
  if (o) {
    const r = o.trim();
    return hs(r) ? parseFloat(r) : r;
  }
  return wn(s) ? Ys(s, e, n + 1) : s;
}
var Ia = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  ja = (t) => ({
    type: "spring",
    stiffness: 550,
    damping: t === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10,
  }),
  Ba = { type: "keyframes", duration: 0.8 },
  Fa = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  _a = (t, { keyframes: e }) =>
    e.length > 2
      ? Ba
      : jt.has(t)
        ? t.startsWith("scale")
          ? ja(e[1])
          : Ia
        : Fa,
  Oa = (t) => t !== null;
function Na(t, { repeat: e, repeatType: n = "loop" }, i) {
  const s = t.filter(Oa),
    o = e && n !== "loop" && e % 2 === 1 ? 0 : s.length - 1;
  return !o || i === void 0 ? s[o] : i;
}
function Gs(t, e) {
  if (t?.inherit && e) {
    const { inherit: n, ...i } = t;
    return { ...e, ...i };
  }
  return t;
}
function Dn(t, e) {
  const n = t?.[e] ?? t?.default ?? t;
  return n !== t ? Gs(n, t) : n;
}
function Ua({
  when: t,
  delay: e,
  delayChildren: n,
  staggerChildren: i,
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
var Rn =
  (t, e, n, i = {}, s, o) =>
  (r) => {
    const a = Dn(i, t) || {},
      l = a.delay || i.delay || 0;
    let { elapsed: c = 0 } = i;
    c = c - tt(l);
    const u = {
      keyframes: Array.isArray(n) ? n : [null, n],
      ease: "easeOut",
      velocity: e.getVelocity(),
      ...a,
      delay: -c,
      onUpdate: (d) => {
        (e.set(d), a.onUpdate && a.onUpdate(d));
      },
      onComplete: () => {
        (r(), a.onComplete && a.onComplete());
      },
      name: t,
      motionValue: e,
      element: o ? void 0 : s,
    };
    (Ua(a) || Object.assign(u, _a(t, u)),
      u.duration && (u.duration = tt(u.duration)),
      u.repeatDelay && (u.repeatDelay = tt(u.repeatDelay)),
      u.from !== void 0 && (u.keyframes[0] = u.from));
    let h = !1;
    if (
      ((u.type === !1 || (u.duration === 0 && !u.repeatDelay)) &&
        (tn(u), u.delay === 0 && (h = !0)),
      (lt.instantAnimations || lt.skipAnimations || s?.shouldSkipAnimations) &&
        ((h = !0), tn(u), (u.delay = 0)),
      (u.allowFlatten = !a.type && !a.ease),
      h && !o && e.get() !== void 0)
    ) {
      const d = Na(u.keyframes, a);
      if (d !== void 0) {
        k.update(() => {
          (u.onUpdate(d), u.onComplete());
        });
        return;
      }
    }
    return a.isSync ? new Vn(u) : new Da(u);
  };
function ri(t) {
  const e = [{}, {}];
  return (
    t?.values.forEach((n, i) => {
      ((e[0][i] = n.get()), (e[1][i] = n.getVelocity()));
    }),
    e
  );
}
function Ln(t, e, n, i) {
  if (typeof e == "function") {
    const [s, o] = ri(i);
    e = e(n !== void 0 ? n : t.custom, s, o);
  }
  if (
    (typeof e == "string" && (e = t.variants && t.variants[e]),
    typeof e == "function")
  ) {
    const [s, o] = ri(i);
    e = e(n !== void 0 ? n : t.custom, s, o);
  }
  return e;
}
function Lt(t, e, n) {
  const i = t.getProps();
  return Ln(i, e, n !== void 0 ? n : i.custom, t);
}
var Xs = new Set(["width", "height", "top", "left", "right", "bottom", ...It]),
  oi = 30,
  $a = (t) => !isNaN(parseFloat(t)),
  $t = { current: void 0 },
  Wa = class {
    constructor(t, e = {}) {
      ((this.canTrackVelocity = null),
        (this.events = {}),
        (this.updateAndNotify = (n) => {
          const i = K.now();
          if (
            (this.updatedAt !== i && this.setPrevFrameValue(),
            (this.prev = this.current),
            this.setCurrent(n),
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
        (this.updatedAt = K.now()),
        this.canTrackVelocity === null &&
          t !== void 0 &&
          (this.canTrackVelocity = $a(this.current)));
    }
    setPrevFrameValue(t = this.current) {
      ((this.prevFrameValue = t), (this.prevUpdatedAt = this.updatedAt));
    }
    onChange(t) {
      return this.on("change", t);
    }
    on(t, e) {
      this.events[t] || (this.events[t] = new gn());
      const n = this.events[t].add(e);
      return t === "change"
        ? () => {
            (n(),
              k.read(() => {
                this.events.change.getSize() || this.stop();
              }));
          }
        : n;
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
    setWithVelocity(t, e, n) {
      (this.set(e),
        (this.prev = void 0),
        (this.prevFrameValue = t),
        (this.prevUpdatedAt = this.updatedAt - n));
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
      return ($t.current && $t.current.push(this), this.current);
    }
    getPrevious() {
      return this.prev;
    }
    getVelocity() {
      const t = K.now();
      if (
        !this.canTrackVelocity ||
        this.prevFrameValue === void 0 ||
        t - this.updatedAt > oi
      )
        return 0;
      const e = Math.min(this.updatedAt - this.prevUpdatedAt, oi);
      return ps(parseFloat(this.current) - parseFloat(this.prevFrameValue), e);
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
function At(t, e) {
  return new Wa(t, e);
}
var en = (t) => Array.isArray(t);
function Ha(t, e, n) {
  t.hasValue(e) ? t.getValue(e).set(n) : t.addValue(e, At(n));
}
function Ka(t) {
  return en(t) ? t[t.length - 1] || 0 : t;
}
function kn(t, e) {
  let { transitionEnd: n = {}, transition: i = {}, ...s } = Lt(t, e) || {};
  s = { ...s, ...n };
  for (const o in s) Ha(t, o, Ka(s[o]));
}
var W = (t) => !!(t && t.getVelocity);
function za(t) {
  return !!(W(t) && t.add);
}
function nn(t, e) {
  const n = t.getValue("willChange");
  if (za(n)) return n.add(e);
  if (!n && lt.WillChange) {
    const i = new lt.WillChange("auto");
    (t.addValue("willChange", i), i.add(e));
  }
}
function In(t) {
  return t.replace(/([A-Z])/g, (e) => `-${e.toLowerCase()}`);
}
var Ya = "framerAppearId",
  qs = "data-" + In(Ya);
function Zs(t) {
  return t.props[qs];
}
function Ga({ protectedKeys: t, needsAnimating: e }, n) {
  const i = t.hasOwnProperty(n) && e[n] !== !0;
  return ((e[n] = !1), i);
}
function Js(t, e, { delay: n = 0, transitionOverride: i, type: s } = {}) {
  let { transition: o, transitionEnd: r, ...a } = e;
  const l = t.getDefaultTransition();
  o = o ? Gs(o, l) : l;
  const c = o?.reduceMotion;
  i && (o = i);
  const u = [],
    h = s && t.animationState && t.animationState.getState()[s];
  for (const d in a) {
    const p = t.getValue(d, t.latestValues[d] ?? null),
      m = a[d];
    if (m === void 0 || (h && Ga(h, d))) continue;
    const P = { delay: n, ...Dn(o || {}, d) },
      y = p.get();
    if (
      y !== void 0 &&
      !p.isAnimating &&
      !Array.isArray(m) &&
      m === y &&
      !P.velocity
    )
      continue;
    let g = !1;
    if (window.MotionHandoffAnimation) {
      const b = Zs(t);
      if (b) {
        const C = window.MotionHandoffAnimation(b, d, k);
        C !== null && ((P.startTime = C), (g = !0));
      }
    }
    nn(t, d);
    const A = c ?? t.shouldReduceMotion;
    p.start(Rn(d, p, m, A && Xs.has(d) ? { type: !1 } : P, t, g));
    const T = p.animation;
    T && u.push(T);
  }
  if (r) {
    const d = () =>
      k.update(() => {
        r && kn(t, r);
      });
    u.length ? Promise.all(u).then(d) : d();
  }
  return u;
}
function sn(t, e, n = {}) {
  const i = Lt(t, e, n.type === "exit" ? t.presenceContext?.custom : void 0);
  let { transition: s = t.getDefaultTransition() || {} } = i || {};
  n.transitionOverride && (s = n.transitionOverride);
  const o = i ? () => Promise.all(Js(t, i, n)) : () => Promise.resolve(),
    r =
      t.variantChildren && t.variantChildren.size
        ? (l = 0) => {
            const {
              delayChildren: c = 0,
              staggerChildren: u,
              staggerDirection: h,
            } = s;
            return Xa(t, e, l, c, u, h, n);
          }
        : () => Promise.resolve(),
    { when: a } = s;
  if (a) {
    const [l, c] = a === "beforeChildren" ? [o, r] : [r, o];
    return l().then(() => c());
  } else return Promise.all([o(), r(n.delay)]);
}
function Xa(t, e, n = 0, i = 0, s = 0, o = 1, r) {
  const a = [];
  for (const l of t.variantChildren)
    (l.notify("AnimationStart", e),
      a.push(
        sn(l, e, {
          ...r,
          delay:
            n +
            (typeof i == "function" ? 0 : i) +
            zs(t.variantChildren, l, i, s, o),
        }).then(() => l.notify("AnimationComplete", e)),
      ));
  return Promise.all(a);
}
function Qs(t, e, n = {}) {
  t.notify("AnimationStart", e);
  let i;
  if (Array.isArray(e)) {
    const s = e.map((o) => sn(t, o, n));
    i = Promise.all(s);
  } else if (typeof e == "string") i = sn(t, e, n);
  else {
    const s = typeof e == "function" ? Lt(t, e, n.custom) : e;
    i = Promise.all(Js(t, s, n));
  }
  return i.then(() => {
    t.notify("AnimationComplete", e);
  });
}
var qa = { test: (t) => t === "auto", parse: (t) => t },
  tr = (t) => (e) => e.test(t),
  er = [kt, S, st, ht, bo, Ao, qa],
  ai = (t) => er.find(tr(t));
function Za(t) {
  return typeof t == "number"
    ? t === 0
    : t !== null
      ? t === "none" || t === "0" || ds(t)
      : !0;
}
var Ja = new Set(["brightness", "contrast", "saturate", "opacity"]);
function Qa(t) {
  const [e, n] = t.slice(0, -1).split("(");
  if (e === "drop-shadow") return t;
  const [i] = n.match(Pn) || [];
  if (!i) return t;
  const s = n.replace(i, "");
  let o = Ja.has(e) ? 1 : 0;
  return (i !== n && (o *= 100), e + "(" + o + s + ")");
}
var tl = /\b([a-z-]*)\(.*?\)/gu,
  rn = {
    ...mt,
    getAnimatableNone: (t) => {
      const e = t.match(tl);
      return e ? e.map(Qa).join(" ") : t;
    },
  },
  li = { ...kt, transform: Math.round },
  el = {
    rotate: ht,
    rotateX: ht,
    rotateY: ht,
    rotateZ: ht,
    scale: ne,
    scaleX: ne,
    scaleY: ne,
    scaleZ: ne,
    skew: ht,
    skewX: ht,
    skewY: ht,
    distance: S,
    translateX: S,
    translateY: S,
    translateZ: S,
    x: S,
    y: S,
    z: S,
    perspective: S,
    transformPerspective: S,
    opacity: zt,
    originX: Gn,
    originY: Gn,
    originZ: S,
  },
  jn = {
    borderWidth: S,
    borderTopWidth: S,
    borderRightWidth: S,
    borderBottomWidth: S,
    borderLeftWidth: S,
    borderRadius: S,
    borderTopLeftRadius: S,
    borderTopRightRadius: S,
    borderBottomRightRadius: S,
    borderBottomLeftRadius: S,
    width: S,
    maxWidth: S,
    height: S,
    maxHeight: S,
    top: S,
    right: S,
    bottom: S,
    left: S,
    inset: S,
    insetBlock: S,
    insetBlockStart: S,
    insetBlockEnd: S,
    insetInline: S,
    insetInlineStart: S,
    insetInlineEnd: S,
    padding: S,
    paddingTop: S,
    paddingRight: S,
    paddingBottom: S,
    paddingLeft: S,
    paddingBlock: S,
    paddingBlockStart: S,
    paddingBlockEnd: S,
    paddingInline: S,
    paddingInlineStart: S,
    paddingInlineEnd: S,
    margin: S,
    marginTop: S,
    marginRight: S,
    marginBottom: S,
    marginLeft: S,
    marginBlock: S,
    marginBlockStart: S,
    marginBlockEnd: S,
    marginInline: S,
    marginInlineStart: S,
    marginInlineEnd: S,
    fontSize: S,
    backgroundPositionX: S,
    backgroundPositionY: S,
    ...el,
    zIndex: li,
    fillOpacity: zt,
    strokeOpacity: zt,
    numOctaves: li,
  },
  nl = {
    ...jn,
    color: _,
    backgroundColor: _,
    outlineColor: _,
    fill: _,
    stroke: _,
    borderColor: _,
    borderTopColor: _,
    borderRightColor: _,
    borderBottomColor: _,
    borderLeftColor: _,
    filter: rn,
    WebkitFilter: rn,
  },
  nr = (t) => nl[t];
function ir(t, e) {
  let n = nr(t);
  return (
    n !== rn && (n = mt),
    n.getAnimatableNone ? n.getAnimatableNone(e) : void 0
  );
}
var il = new Set(["auto", "none", "0"]);
function sl(t, e, n) {
  let i = 0,
    s;
  for (; i < t.length && !s; ) {
    const o = t[i];
    (typeof o == "string" && !il.has(o) && Yt(o).values.length && (s = t[i]),
      i++);
  }
  if (s && n) for (const o of e) t[o] = ir(n, s);
}
var rl = class extends Mn {
  constructor(t, e, n, i, s) {
    super(t, e, n, i, s, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: t, element: e, name: n } = this;
    if (!e || !e.current) return;
    super.readKeyframes();
    for (let a = 0; a < t.length; a++) {
      let l = t[a];
      if (typeof l == "string" && ((l = l.trim()), wn(l))) {
        const c = Ys(l, e.current);
        (c !== void 0 && (t[a] = c),
          a === t.length - 1 && (this.finalKeyframe = l));
      }
    }
    if ((this.resolveNoneKeyframes(), !Xs.has(n) || t.length !== 2)) return;
    const [i, s] = t,
      o = ai(i),
      r = ai(s);
    if (Yn(i) !== Yn(s) && ft[n]) {
      this.needsMeasurement = !0;
      return;
    }
    if (o !== r)
      if (ni(o) && ni(r))
        for (let a = 0; a < t.length; a++) {
          const l = t[a];
          typeof l == "string" && (t[a] = parseFloat(l));
        }
      else ft[n] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: t, name: e } = this,
      n = [];
    for (let i = 0; i < t.length; i++) (t[i] === null || Za(t[i])) && n.push(i);
    n.length && sl(t, n, e);
  }
  measureInitialState() {
    const { element: t, unresolvedKeyframes: e, name: n } = this;
    if (!t || !t.current) return;
    (n === "height" && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = ft[n](
        t.measureViewportBox(),
        window.getComputedStyle(t.current),
      )),
      (e[0] = this.measuredOrigin));
    const i = e[e.length - 1];
    i !== void 0 && t.getValue(n, i).jump(i, !1);
  }
  measureEndState() {
    const { element: t, name: e, unresolvedKeyframes: n } = this;
    if (!t || !t.current) return;
    const i = t.getValue(e);
    i && i.jump(this.measuredOrigin, !1);
    const s = n.length - 1,
      o = n[s];
    ((n[s] = ft[e](t.measureViewportBox(), window.getComputedStyle(t.current))),
      o !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = o),
      this.removedTransforms?.length &&
        this.removedTransforms.forEach(([r, a]) => {
          t.getValue(r).set(a);
        }),
      this.resolveNoneKeyframes());
  }
};
function sr(t, e, n) {
  if (t == null) return [];
  if (t instanceof EventTarget) return [t];
  if (typeof t == "string") {
    let i = document;
    e && (i = e.current);
    const s = n?.[t] ?? i.querySelectorAll(t);
    return s ? Array.from(s) : [];
  }
  return Array.from(t).filter((i) => i != null);
}
var rr = (t, e) => (e && typeof t == "number" ? e.transform(t) : t);
function on(t) {
  return fs(t) && "offsetHeight" in t;
}
var { schedule: Bn, cancel: uh } = bs(queueMicrotask, !1),
  Q = { x: !1, y: !1 };
function or() {
  return Q.x || Q.y;
}
function ol(t) {
  return t === "x" || t === "y"
    ? Q[t]
      ? null
      : ((Q[t] = !0),
        () => {
          Q[t] = !1;
        })
    : Q.x || Q.y
      ? null
      : ((Q.x = Q.y = !0),
        () => {
          Q.x = Q.y = !1;
        });
}
function ar(t, e) {
  const n = sr(t),
    i = new AbortController(),
    s = { passive: !0, ...e, signal: i.signal };
  return [n, s, () => i.abort()];
}
function al(t) {
  return !(t.pointerType === "touch" || or());
}
function ll(t, e, n = {}) {
  const [i, s, o] = ar(t, n);
  return (
    i.forEach((r) => {
      let a = !1,
        l = !1,
        c;
      const u = () => {
          r.removeEventListener("pointerleave", m);
        },
        h = (y) => {
          (c && (c(y), (c = void 0)), u());
        },
        d = (y) => {
          ((a = !1),
            window.removeEventListener("pointerup", d),
            window.removeEventListener("pointercancel", d),
            l && ((l = !1), h(y)));
        },
        p = () => {
          ((a = !0),
            window.addEventListener("pointerup", d, s),
            window.addEventListener("pointercancel", d, s));
        },
        m = (y) => {
          if (y.pointerType !== "touch") {
            if (a) {
              l = !0;
              return;
            }
            h(y);
          }
        },
        P = (y) => {
          if (!al(y)) return;
          l = !1;
          const g = e(r, y);
          typeof g == "function" &&
            ((c = g), r.addEventListener("pointerleave", m, s));
        };
      (r.addEventListener("pointerenter", P, s),
        r.addEventListener("pointerdown", p, s));
    }),
    o
  );
}
var lr = (t, e) => (e ? (t === e ? !0 : lr(t, e.parentElement)) : !1),
  Fn = (t) =>
    t.pointerType === "mouse"
      ? typeof t.button != "number" || t.button <= 0
      : t.isPrimary !== !1,
  ul = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);
function cl(t) {
  return ul.has(t.tagName) || t.isContentEditable === !0;
}
var hl = new Set(["INPUT", "SELECT", "TEXTAREA"]);
function fl(t) {
  return hl.has(t.tagName) || t.isContentEditable === !0;
}
var oe = new WeakSet();
function ui(t) {
  return (e) => {
    e.key === "Enter" && t(e);
  };
}
function Le(t, e) {
  t.dispatchEvent(
    new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 }),
  );
}
var dl = (t, e) => {
  const n = t.currentTarget;
  if (!n) return;
  const i = ui(() => {
    if (oe.has(n)) return;
    Le(n, "down");
    const s = ui(() => {
        Le(n, "up");
      }),
      o = () => Le(n, "cancel");
    (n.addEventListener("keyup", s, e), n.addEventListener("blur", o, e));
  });
  (n.addEventListener("keydown", i, e),
    n.addEventListener("blur", () => n.removeEventListener("keydown", i), e));
};
function ci(t) {
  return Fn(t) && !or();
}
var hi = new WeakSet();
function pl(t, e, n = {}) {
  const [i, s, o] = ar(t, n),
    r = (a) => {
      const l = a.currentTarget;
      if (!ci(a) || hi.has(a)) return;
      (oe.add(l), n.stopPropagation && hi.add(a));
      const c = e(l, a),
        u = (p, m) => {
          (window.removeEventListener("pointerup", h),
            window.removeEventListener("pointercancel", d),
            oe.has(l) && oe.delete(l),
            ci(p) && typeof c == "function" && c(p, { success: m }));
        },
        h = (p) => {
          u(
            p,
            l === window ||
              l === document ||
              n.useGlobalTarget ||
              lr(l, p.target),
          );
        },
        d = (p) => {
          u(p, !1);
        };
      (window.addEventListener("pointerup", h, s),
        window.addEventListener("pointercancel", d, s));
    };
  return (
    i.forEach((a) => {
      ((n.useGlobalTarget ? window : a).addEventListener("pointerdown", r, s),
        on(a) &&
          (a.addEventListener("focus", (l) => dl(l, s)),
          !cl(a) && !a.hasAttribute("tabindex") && (a.tabIndex = 0)));
    }),
    o
  );
}
function _n(t) {
  return fs(t) && "ownerSVGElement" in t;
}
var ae = new WeakMap(),
  le,
  ur = (t, e, n) => (i, s) =>
    s && s[0]
      ? s[0][t + "Size"]
      : _n(i) && "getBBox" in i
        ? i.getBBox()[e]
        : i[n],
  ml = ur("inline", "width", "offsetWidth"),
  vl = ur("block", "height", "offsetHeight");
function yl({ target: t, borderBoxSize: e }) {
  ae.get(t)?.forEach((n) => {
    n(t, {
      get width() {
        return ml(t, e);
      },
      get height() {
        return vl(t, e);
      },
    });
  });
}
function gl(t) {
  t.forEach(yl);
}
function Tl() {
  typeof ResizeObserver > "u" || (le = new ResizeObserver(gl));
}
function xl(t, e) {
  le || Tl();
  const n = sr(t);
  return (
    n.forEach((i) => {
      let s = ae.get(i);
      (s || ((s = new Set()), ae.set(i, s)), s.add(e), le?.observe(i));
    }),
    () => {
      n.forEach((i) => {
        const s = ae.get(i);
        (s?.delete(e), s?.size || le?.unobserve(i));
      });
    }
  );
}
var ue = new Set(),
  Vt;
function wl() {
  ((Vt = () => {
    const t = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      },
    };
    ue.forEach((e) => e(t));
  }),
    window.addEventListener("resize", Vt));
}
function Pl(t) {
  return (
    ue.add(t),
    Vt || wl(),
    () => {
      (ue.delete(t),
        !ue.size &&
          typeof Vt == "function" &&
          (window.removeEventListener("resize", Vt), (Vt = void 0)));
    }
  );
}
function fi(t, e) {
  return typeof t == "function" ? Pl(t) : xl(t, e);
}
function Sl(t) {
  return _n(t) && t.tagName === "svg";
}
function Al(...t) {
  const e = !Array.isArray(t[0]),
    n = e ? 0 : -1,
    i = t[0 + n],
    s = t[1 + n],
    o = t[2 + n],
    r = t[3 + n],
    a = _s(s, o, r);
  return e ? a(i) : a;
}
var bl = [...er, _, mt],
  Cl = (t) => bl.find(tr(t)),
  di = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
  Mt = () => ({ x: di(), y: di() }),
  pi = () => ({ min: 0, max: 0 }),
  U = () => ({ x: pi(), y: pi() }),
  an = { current: null },
  cr = { current: !1 },
  El = typeof window < "u";
function Vl() {
  if (((cr.current = !0), !!El))
    if (window.matchMedia) {
      const t = window.matchMedia("(prefers-reduced-motion)"),
        e = () => (an.current = t.matches);
      (t.addEventListener("change", e), e());
    } else an.current = !1;
}
var Ml = new WeakMap();
function Pe(t) {
  return t !== null && typeof t == "object" && typeof t.start == "function";
}
function Gt(t) {
  return typeof t == "string" || Array.isArray(t);
}
var On = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit",
  ],
  Nn = ["initial", ...On];
function Se(t) {
  return Pe(t.animate) || Nn.some((e) => Gt(t[e]));
}
function hr(t) {
  return !!(Se(t) || t.variants);
}
function Dl(t, e, n) {
  for (const i in e) {
    const s = e[i],
      o = n[i];
    if (W(s)) t.addValue(i, s);
    else if (W(o)) t.addValue(i, At(s, { owner: t }));
    else if (o !== s)
      if (t.hasValue(i)) {
        const r = t.getValue(i);
        r.liveStyle === !0 ? r.jump(s) : r.hasAnimated || r.set(s);
      } else {
        const r = t.getStaticValue(i);
        t.addValue(i, At(r !== void 0 ? r : s, { owner: t }));
      }
  }
  for (const i in n) e[i] === void 0 && t.removeValue(i);
  return e;
}
var mi = [
    "AnimationStart",
    "AnimationComplete",
    "Update",
    "BeforeLayoutMeasure",
    "LayoutMeasure",
    "LayoutAnimationStart",
    "LayoutAnimationComplete",
  ],
  pe = {};
function fr(t) {
  pe = t;
}
function Rl() {
  return pe;
}
var Ll = class {
    scrapeMotionValuesFromProps(t, e, n) {
      return {};
    }
    constructor(
      {
        parent: t,
        props: e,
        presenceContext: n,
        reducedMotionConfig: i,
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
        (this.KeyframeResolver = Mn),
        (this.features = {}),
        (this.valueSubscriptions = new Map()),
        (this.prevMotionValues = {}),
        (this.hasBeenMounted = !1),
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
          const d = K.now();
          this.renderScheduledAt < d &&
            ((this.renderScheduledAt = d), k.render(this.render, !1, !0));
        }));
      const { latestValues: l, renderState: c } = r;
      ((this.latestValues = l),
        (this.baseTarget = { ...l }),
        (this.initialValues = e.initial ? { ...l } : {}),
        (this.renderState = c),
        (this.parent = t),
        (this.props = e),
        (this.presenceContext = n),
        (this.depth = t ? t.depth + 1 : 0),
        (this.reducedMotionConfig = i),
        (this.skipAnimationsConfig = s),
        (this.options = a),
        (this.blockInitialAnimation = !!o),
        (this.isControllingVariants = Se(e)),
        (this.isVariantNode = hr(e)),
        this.isVariantNode && (this.variantChildren = new Set()),
        (this.manuallyAnimateOnMount = !!(t && t.current)));
      const { willChange: u, ...h } = this.scrapeMotionValuesFromProps(
        e,
        {},
        this,
      );
      for (const d in h) {
        const p = h[d];
        l[d] !== void 0 && W(p) && p.set(l[d]);
      }
    }
    mount(t) {
      if (this.hasBeenMounted)
        for (const e in this.initialValues)
          (this.values.get(e)?.jump(this.initialValues[e]),
            (this.latestValues[e] = this.initialValues[e]));
      ((this.current = t),
        Ml.set(t, this),
        this.projection &&
          !this.projection.instance &&
          this.projection.mount(t),
        this.parent &&
          this.isVariantNode &&
          !this.isControllingVariants &&
          (this.removeFromVariantTree = this.parent.addVariantChild(this)),
        this.values.forEach((e, n) => this.bindToMotionValue(n, e)),
        this.reducedMotionConfig === "never"
          ? (this.shouldReduceMotion = !1)
          : this.reducedMotionConfig === "always"
            ? (this.shouldReduceMotion = !0)
            : (cr.current || Vl(), (this.shouldReduceMotion = an.current)),
        (this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1),
        this.parent?.addChild(this),
        this.update(this.props, this.presenceContext),
        (this.hasBeenMounted = !0));
    }
    unmount() {
      (this.projection && this.projection.unmount(),
        ut(this.notifyUpdate),
        ut(this.render),
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
      const n = jt.has(t);
      n && this.onBindTransform && this.onBindTransform();
      const i = e.on("change", (o) => {
        ((this.latestValues[t] = o),
          this.props.onUpdate && k.preRender(this.notifyUpdate),
          n && this.projection && (this.projection.isTransformDirty = !0),
          this.scheduleRender());
      });
      let s;
      (typeof window < "u" &&
        window.MotionCheckAppearSync &&
        (s = window.MotionCheckAppearSync(this, t, e)),
        this.valueSubscriptions.set(t, () => {
          (i(), s && s(), e.owner && e.stop());
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
      for (t in pe) {
        const e = pe[t];
        if (!e) continue;
        const { isEnabled: n, Feature: i } = e;
        if (
          (!this.features[t] &&
            i &&
            n(this.props) &&
            (this.features[t] = new i(this)),
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
        : U();
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
      for (let n = 0; n < mi.length; n++) {
        const i = mi[n];
        this.propEventSubscriptions[i] &&
          (this.propEventSubscriptions[i](),
          delete this.propEventSubscriptions[i]);
        const s = t["on" + i];
        s && (this.propEventSubscriptions[i] = this.on(i, s));
      }
      ((this.prevMotionValues = Dl(
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
      const n = this.values.get(t);
      e !== n &&
        (n && this.removeValue(t),
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
      let n = this.values.get(t);
      return (
        n === void 0 &&
          e !== void 0 &&
          ((n = At(e === null ? void 0 : e, { owner: this })),
          this.addValue(t, n)),
        n
      );
    }
    readValue(t, e) {
      let n =
        this.latestValues[t] !== void 0 || !this.current
          ? this.latestValues[t]
          : (this.getBaseTargetFromProps(this.props, t) ??
            this.readValueFromInstance(this.current, t, this.options));
      return (
        n != null &&
          (typeof n == "string" && (hs(n) || ds(n))
            ? (n = parseFloat(n))
            : !Cl(n) && mt.test(e) && (n = ir(t, e)),
          this.setBaseTarget(t, W(n) ? n.get() : n)),
        W(n) ? n.get() : n
      );
    }
    setBaseTarget(t, e) {
      this.baseTarget[t] = e;
    }
    getBaseTarget(t) {
      const { initial: e } = this.props;
      let n;
      if (typeof e == "string" || typeof e == "object") {
        const s = Ln(this.props, e, this.presenceContext?.custom);
        s && (n = s[t]);
      }
      if (e && n !== void 0) return n;
      const i = this.getBaseTargetFromProps(this.props, t);
      return i !== void 0 && !W(i)
        ? i
        : this.initialValues[t] !== void 0 && n === void 0
          ? void 0
          : this.baseTarget[t];
    }
    on(t, e) {
      return (
        this.events[t] || (this.events[t] = new gn()),
        this.events[t].add(e)
      );
    }
    notify(t, ...e) {
      this.events[t] && this.events[t].notify(...e);
    }
    scheduleRenderMicrotask() {
      Bn.render(this.render);
    }
  },
  dr = class extends Ll {
    constructor() {
      (super(...arguments), (this.KeyframeResolver = rl));
    }
    sortInstanceNodePosition(t, e) {
      return t.compareDocumentPosition(e) & 2 ? 1 : -1;
    }
    getBaseTargetFromProps(t, e) {
      const n = t.style;
      return n ? n[e] : void 0;
    }
    removeValueFromRenderState(t, { vars: e, style: n }) {
      (delete e[t], delete n[t]);
    }
    handleChildMotionValue() {
      this.childSubscription &&
        (this.childSubscription(), delete this.childSubscription);
      const { children: t } = this.props;
      W(t) &&
        (this.childSubscription = t.on("change", (e) => {
          this.current && (this.current.textContent = `${e}`);
        }));
    }
  },
  vt = class {
    constructor(t) {
      ((this.isMounted = !1), (this.node = t));
    }
    update() {}
  };
function pr({ top: t, left: e, right: n, bottom: i }) {
  return { x: { min: e, max: n }, y: { min: t, max: i } };
}
function kl({ x: t, y: e }) {
  return { top: e.min, right: t.max, bottom: e.max, left: t.min };
}
function Il(t, e) {
  if (!e) return t;
  const n = e({ x: t.left, y: t.top }),
    i = e({ x: t.right, y: t.bottom });
  return { top: n.y, left: n.x, bottom: i.y, right: i.x };
}
function ke(t) {
  return t === void 0 || t === 1;
}
function ln({ scale: t, scaleX: e, scaleY: n }) {
  return !ke(t) || !ke(e) || !ke(n);
}
function gt(t) {
  return (
    ln(t) ||
    mr(t) ||
    t.z ||
    t.rotate ||
    t.rotateX ||
    t.rotateY ||
    t.skewX ||
    t.skewY
  );
}
function mr(t) {
  return vi(t.x) || vi(t.y);
}
function vi(t) {
  return t && t !== "0%";
}
function me(t, e, n) {
  return n + e * (t - n);
}
function yi(t, e, n, i, s) {
  return (s !== void 0 && (t = me(t, s, i)), me(t, n, i) + e);
}
function un(t, e = 0, n = 1, i, s) {
  ((t.min = yi(t.min, e, n, i, s)), (t.max = yi(t.max, e, n, i, s)));
}
function vr(t, { x: e, y: n }) {
  (un(t.x, e.translate, e.scale, e.originPoint),
    un(t.y, n.translate, n.scale, n.originPoint));
}
var gi = 0.999999999999,
  Ti = 1.0000000000001;
function jl(t, e, n, i = !1) {
  const s = n.length;
  if (!s) return;
  e.x = e.y = 1;
  let o, r;
  for (let a = 0; a < s; a++) {
    ((o = n[a]), (r = o.projectionDelta));
    const { visualElement: l } = o.options;
    (l && l.props.style && l.props.style.display === "contents") ||
      (i &&
        o.options.layoutScroll &&
        o.scroll &&
        o !== o.root &&
        Rt(t, { x: -o.scroll.offset.x, y: -o.scroll.offset.y }),
      r && ((e.x *= r.x.scale), (e.y *= r.y.scale), vr(t, r)),
      i && gt(o.latestValues) && Rt(t, o.latestValues));
  }
  (e.x < Ti && e.x > gi && (e.x = 1), e.y < Ti && e.y > gi && (e.y = 1));
}
function Dt(t, e) {
  ((t.min = t.min + e), (t.max = t.max + e));
}
function xi(t, e, n, i, s = 0.5) {
  un(t, e, n, F(t.min, t.max, s), i);
}
function Rt(t, e) {
  (xi(t.x, e.x, e.scaleX, e.scale, e.originX),
    xi(t.y, e.y, e.scaleY, e.scale, e.originY));
}
function yr(t, e) {
  return pr(Il(t.getBoundingClientRect(), e));
}
function Bl(t, e, n) {
  const i = yr(t, n),
    { scroll: s } = e;
  return (s && (Dt(i.x, s.offset.x), Dt(i.y, s.offset.y)), i);
}
var Fl = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
  },
  _l = It.length;
function Ol(t, e, n) {
  let i = "",
    s = !0;
  for (let o = 0; o < _l; o++) {
    const r = It[o],
      a = t[r];
    if (a === void 0) continue;
    let l = !0;
    if (typeof a == "number") l = a === (r.startsWith("scale") ? 1 : 0);
    else {
      const c = parseFloat(a);
      l = r.startsWith("scale") ? c === 1 : c === 0;
    }
    if (!l || n) {
      const c = rr(a, jn[r]);
      if (!l) {
        s = !1;
        const u = Fl[r] || r;
        i += `${u}(${c}) `;
      }
      n && (e[r] = c);
    }
  }
  return ((i = i.trim()), n ? (i = n(e, s ? "" : i)) : s && (i = "none"), i);
}
function Un(t, e, n) {
  const { style: i, vars: s, transformOrigin: o } = t;
  let r = !1,
    a = !1;
  for (const l in e) {
    const c = e[l];
    if (jt.has(l)) {
      r = !0;
      continue;
    } else if (Es(l)) {
      s[l] = c;
      continue;
    } else {
      const u = rr(c, jn[l]);
      l.startsWith("origin") ? ((a = !0), (o[l] = u)) : (i[l] = u);
    }
  }
  if (
    (e.transform ||
      (r || n
        ? (i.transform = Ol(e, t.transform, n))
        : i.transform && (i.transform = "none")),
    a)
  ) {
    const { originX: l = "50%", originY: c = "50%", originZ: u = 0 } = o;
    i.transformOrigin = `${l} ${c} ${u}`;
  }
}
function gr(t, { style: e, vars: n }, i, s) {
  const o = t.style;
  let r;
  for (r in e) o[r] = e[r];
  s?.applyProjectionStyles(o, i);
  for (r in n) o.setProperty(r, n[r]);
}
function wi(t, e) {
  return e.max === e.min ? 0 : (t / (e.max - e.min)) * 100;
}
var _t = {
    correct: (t, e) => {
      if (!e.target) return t;
      if (typeof t == "string")
        if (S.test(t)) t = parseFloat(t);
        else return t;
      return `${wi(t, e.target.x)}% ${wi(t, e.target.y)}%`;
    },
  },
  Nl = {
    correct: (t, { treeScale: e, projectionDelta: n }) => {
      const i = t,
        s = mt.parse(t);
      if (s.length > 5) return i;
      const o = mt.createTransformer(t),
        r = typeof s[0] != "number" ? 1 : 0,
        a = n.x.scale * e.x,
        l = n.y.scale * e.y;
      ((s[0 + r] /= a), (s[1 + r] /= l));
      const c = F(a, l, 0.5);
      return (
        typeof s[2 + r] == "number" && (s[2 + r] /= c),
        typeof s[3 + r] == "number" && (s[3 + r] /= c),
        o(s)
      );
    },
  },
  cn = {
    borderRadius: {
      ..._t,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ],
    },
    borderTopLeftRadius: _t,
    borderTopRightRadius: _t,
    borderBottomLeftRadius: _t,
    borderBottomRightRadius: _t,
    boxShadow: Nl,
  };
function Tr(t, { layout: e, layoutId: n }) {
  return (
    jt.has(t) ||
    t.startsWith("origin") ||
    ((e || n !== void 0) && (!!cn[t] || t === "opacity"))
  );
}
function $n(t, e, n) {
  const i = t.style,
    s = e?.style,
    o = {};
  if (!i) return o;
  for (const r in i)
    (W(i[r]) ||
      (s && W(s[r])) ||
      Tr(r, t) ||
      n?.getValue(r)?.liveStyle !== void 0) &&
      (o[r] = i[r]);
  return o;
}
function Ul(t) {
  return window.getComputedStyle(t);
}
var $l = class extends dr {
    constructor() {
      (super(...arguments), (this.type = "html"), (this.renderInstance = gr));
    }
    readValueFromInstance(t, e) {
      if (jt.has(e)) return this.projection?.isProjecting ? Xe(e) : aa(t, e);
      {
        const n = Ul(t),
          i = (Es(e) ? n.getPropertyValue(e) : n[e]) || 0;
        return typeof i == "string" ? i.trim() : i;
      }
    }
    measureInstanceViewportBox(t, { transformPagePoint: e }) {
      return yr(t, e);
    }
    build(t, e, n) {
      Un(t, e, n.transformTemplate);
    }
    scrapeMotionValuesFromProps(t, e, n) {
      return $n(t, e, n);
    }
  },
  Wl = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
  Hl = { offset: "strokeDashoffset", array: "strokeDasharray" };
function Kl(t, e, n = 1, i = 0, s = !0) {
  t.pathLength = 1;
  const o = s ? Wl : Hl;
  ((t[o.offset] = `${-i}`), (t[o.array] = `${e} ${n}`));
}
var zl = ["offsetDistance", "offsetPath", "offsetRotate", "offsetAnchor"];
function xr(
  t,
  {
    attrX: e,
    attrY: n,
    attrScale: i,
    pathLength: s,
    pathSpacing: o = 1,
    pathOffset: r = 0,
    ...a
  },
  l,
  c,
  u,
) {
  if ((Un(t, a, c), l)) {
    t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
    return;
  }
  ((t.attrs = t.style), (t.style = {}));
  const { attrs: h, style: d } = t;
  (h.transform && ((d.transform = h.transform), delete h.transform),
    (d.transform || h.transformOrigin) &&
      ((d.transformOrigin = h.transformOrigin ?? "50% 50%"),
      delete h.transformOrigin),
    d.transform &&
      ((d.transformBox = u?.transformBox ?? "fill-box"),
      delete h.transformBox));
  for (const p of zl) h[p] !== void 0 && ((d[p] = h[p]), delete h[p]);
  (e !== void 0 && (h.x = e),
    n !== void 0 && (h.y = n),
    i !== void 0 && (h.scale = i),
    s !== void 0 && Kl(h, s, o, r, !1));
}
var wr = new Set([
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
  Pr = (t) => typeof t == "string" && t.toLowerCase() === "svg";
function Yl(t, e, n, i) {
  gr(t, e, void 0, i);
  for (const s in e.attrs) t.setAttribute(wr.has(s) ? s : In(s), e.attrs[s]);
}
function Sr(t, e, n) {
  const i = $n(t, e, n);
  for (const s in t)
    if (W(t[s]) || W(e[s])) {
      const o =
        It.indexOf(s) !== -1
          ? "attr" + s.charAt(0).toUpperCase() + s.substring(1)
          : s;
      i[o] = t[s];
    }
  return i;
}
var Gl = class extends dr {
    constructor() {
      (super(...arguments),
        (this.type = "svg"),
        (this.isSVGTag = !1),
        (this.measureInstanceViewportBox = U));
    }
    getBaseTargetFromProps(t, e) {
      return t[e];
    }
    readValueFromInstance(t, e) {
      if (jt.has(e)) {
        const n = nr(e);
        return (n && n.default) || 0;
      }
      return ((e = wr.has(e) ? e : In(e)), t.getAttribute(e));
    }
    scrapeMotionValuesFromProps(t, e, n) {
      return Sr(t, e, n);
    }
    build(t, e, n) {
      xr(t, e, this.isSVGTag, n.transformTemplate, n.style);
    }
    renderInstance(t, e, n, i) {
      Yl(t, e, n, i);
    }
    mount(t) {
      ((this.isSVGTag = Pr(t.tagName)), super.mount(t));
    }
  },
  Xl = Nn.length;
function Ar(t) {
  if (!t) return;
  if (!t.isControllingVariants) {
    const n = t.parent ? Ar(t.parent) || {} : {};
    return (t.props.initial !== void 0 && (n.initial = t.props.initial), n);
  }
  const e = {};
  for (let n = 0; n < Xl; n++) {
    const i = Nn[n],
      s = t.props[i];
    (Gt(s) || s === !1) && (e[i] = s);
  }
  return e;
}
function br(t, e) {
  if (!Array.isArray(e)) return !1;
  const n = e.length;
  if (n !== t.length) return !1;
  for (let i = 0; i < n; i++) if (e[i] !== t[i]) return !1;
  return !0;
}
var ql = [...On].reverse(),
  Zl = On.length;
function Jl(t) {
  return (e) =>
    Promise.all(e.map(({ animation: n, options: i }) => Qs(t, n, i)));
}
function Ql(t) {
  let e = Jl(t),
    n = Pi(),
    i = !0;
  const s = (l) => (c, u) => {
    const h = Lt(t, u, l === "exit" ? t.presenceContext?.custom : void 0);
    if (h) {
      const { transition: d, transitionEnd: p, ...m } = h;
      c = { ...c, ...m, ...p };
    }
    return c;
  };
  function o(l) {
    e = l(t);
  }
  function r(l) {
    const { props: c } = t,
      u = Ar(t.parent) || {},
      h = [],
      d = new Set();
    let p = {},
      m = 1 / 0;
    for (let y = 0; y < Zl; y++) {
      const g = ql[y],
        A = n[g],
        T = c[g] !== void 0 ? c[g] : u[g],
        b = Gt(T),
        C = g === l ? A.isActive : null;
      C === !1 && (m = y);
      let D = T === u[g] && T !== c[g] && b;
      if (
        (D && i && t.manuallyAnimateOnMount && (D = !1),
        (A.protectedKeys = { ...p }),
        (!A.isActive && C === null) ||
          (!T && !A.prevProp) ||
          Pe(T) ||
          typeof T == "boolean")
      )
        continue;
      const j = tu(A.prevProp, T);
      let x = j || (g === l && A.isActive && !D && b) || (y > m && b),
        M = !1;
      const H = Array.isArray(T) ? T : [T];
      let Z = H.reduce(s(g), {});
      C === !1 && (Z = {});
      const { prevResolvedValues: ot = {} } = A,
        Bt = { ...ot, ...Z },
        Ft = (O) => {
          ((x = !0),
            d.has(O) && ((M = !0), d.delete(O)),
            (A.needsAnimating[O] = !0));
          const N = t.getValue(O);
          N && (N.liveStyle = !1);
        };
      for (const O in Bt) {
        const N = Z[O],
          G = ot[O];
        if (p.hasOwnProperty(O)) continue;
        let ct = !1;
        (en(N) && en(G) ? (ct = !br(N, G)) : (ct = N !== G),
          ct
            ? N != null
              ? Ft(O)
              : d.add(O)
            : N !== void 0 && d.has(O)
              ? Ft(O)
              : (A.protectedKeys[O] = !0));
      }
      ((A.prevProp = T),
        (A.prevResolvedValues = Z),
        A.isActive && (p = { ...p, ...Z }),
        i && t.blockInitialAnimation && (x = !1));
      const bt = D && j;
      x &&
        (!bt || M) &&
        h.push(
          ...H.map((O) => {
            const N = { type: g };
            if (
              typeof O == "string" &&
              i &&
              !bt &&
              t.manuallyAnimateOnMount &&
              t.parent
            ) {
              const { parent: G } = t,
                ct = Lt(G, O);
              if (G.enteringChildren && ct) {
                const { delayChildren: te } = ct.transition || {};
                N.delay = zs(G.enteringChildren, t, te);
              }
            }
            return { animation: O, options: N };
          }),
        );
    }
    if (d.size) {
      const y = {};
      if (typeof c.initial != "boolean") {
        const g = Lt(t, Array.isArray(c.initial) ? c.initial[0] : c.initial);
        g && g.transition && (y.transition = g.transition);
      }
      (d.forEach((g) => {
        const A = t.getBaseTarget(g),
          T = t.getValue(g);
        (T && (T.liveStyle = !0), (y[g] = A ?? null));
      }),
        h.push({ animation: y }));
    }
    let P = !!h.length;
    return (
      i &&
        (c.initial === !1 || c.initial === c.animate) &&
        !t.manuallyAnimateOnMount &&
        (P = !1),
      (i = !1),
      P ? e(h) : Promise.resolve()
    );
  }
  function a(l, c) {
    if (n[l].isActive === c) return Promise.resolve();
    (t.variantChildren?.forEach((h) => h.animationState?.setActive(l, c)),
      (n[l].isActive = c));
    const u = r(l);
    for (const h in n) n[h].protectedKeys = {};
    return u;
  }
  return {
    animateChanges: r,
    setActive: a,
    setAnimateFunction: o,
    getState: () => n,
    reset: () => {
      n = Pi();
    },
  };
}
function tu(t, e) {
  return typeof e == "string" ? e !== t : Array.isArray(e) ? !br(e, t) : !1;
}
function yt(t = !1) {
  return {
    isActive: t,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {},
  };
}
function Pi() {
  return {
    animate: yt(!0),
    whileInView: yt(),
    whileHover: yt(),
    whileTap: yt(),
    whileDrag: yt(),
    whileFocus: yt(),
    exit: yt(),
  };
}
function Si(t, e) {
  ((t.min = e.min), (t.max = e.max));
}
function J(t, e) {
  (Si(t.x, e.x), Si(t.y, e.y));
}
function Ai(t, e) {
  ((t.translate = e.translate),
    (t.scale = e.scale),
    (t.originPoint = e.originPoint),
    (t.origin = e.origin));
}
var Cr = 1e-4,
  eu = 1 - Cr,
  nu = 1 + Cr,
  Er = 0.01,
  iu = 0 - Er,
  su = 0 + Er;
function z(t) {
  return t.max - t.min;
}
function ru(t, e, n) {
  return Math.abs(t - e) <= n;
}
function bi(t, e, n, i = 0.5) {
  ((t.origin = i),
    (t.originPoint = F(e.min, e.max, t.origin)),
    (t.scale = z(n) / z(e)),
    (t.translate = F(n.min, n.max, t.origin) - t.originPoint),
    ((t.scale >= eu && t.scale <= nu) || isNaN(t.scale)) && (t.scale = 1),
    ((t.translate >= iu && t.translate <= su) || isNaN(t.translate)) &&
      (t.translate = 0));
}
function Wt(t, e, n, i) {
  (bi(t.x, e.x, n.x, i ? i.originX : void 0),
    bi(t.y, e.y, n.y, i ? i.originY : void 0));
}
function Ci(t, e, n) {
  ((t.min = n.min + e.min), (t.max = t.min + z(e)));
}
function ou(t, e, n) {
  (Ci(t.x, e.x, n.x), Ci(t.y, e.y, n.y));
}
function Ei(t, e, n) {
  ((t.min = e.min - n.min), (t.max = t.min + z(e)));
}
function ve(t, e, n) {
  (Ei(t.x, e.x, n.x), Ei(t.y, e.y, n.y));
}
function Vi(t, e, n, i, s) {
  return (
    (t -= e),
    (t = me(t, 1 / n, i)),
    s !== void 0 && (t = me(t, 1 / s, i)),
    t
  );
}
function au(t, e = 0, n = 1, i = 0.5, s, o = t, r = t) {
  if (
    (st.test(e) &&
      ((e = parseFloat(e)), (e = F(r.min, r.max, e / 100) - r.min)),
    typeof e != "number")
  )
    return;
  let a = F(o.min, o.max, i);
  (t === o && (a -= e),
    (t.min = Vi(t.min, e, n, a, s)),
    (t.max = Vi(t.max, e, n, a, s)));
}
function Mi(t, e, [n, i, s], o, r) {
  au(t, e[n], e[i], e[s], e.scale, o, r);
}
var lu = ["x", "scaleX", "originX"],
  uu = ["y", "scaleY", "originY"];
function Di(t, e, n, i) {
  (Mi(t.x, e, lu, n ? n.x : void 0, i ? i.x : void 0),
    Mi(t.y, e, uu, n ? n.y : void 0, i ? i.y : void 0));
}
function Ri(t) {
  return t.translate === 0 && t.scale === 1;
}
function Vr(t) {
  return Ri(t.x) && Ri(t.y);
}
function Li(t, e) {
  return t.min === e.min && t.max === e.max;
}
function cu(t, e) {
  return Li(t.x, e.x) && Li(t.y, e.y);
}
function ki(t, e) {
  return (
    Math.round(t.min) === Math.round(e.min) &&
    Math.round(t.max) === Math.round(e.max)
  );
}
function Mr(t, e) {
  return ki(t.x, e.x) && ki(t.y, e.y);
}
function Ii(t) {
  return z(t.x) / z(t.y);
}
function ji(t, e) {
  return (
    t.translate === e.translate &&
    t.scale === e.scale &&
    t.originPoint === e.originPoint
  );
}
function nt(t) {
  return [t("x"), t("y")];
}
function hu(t, e, n) {
  let i = "";
  const s = t.x.translate / e.x,
    o = t.y.translate / e.y,
    r = n?.z || 0;
  if (
    ((s || o || r) && (i = `translate3d(${s}px, ${o}px, ${r}px) `),
    (e.x !== 1 || e.y !== 1) && (i += `scale(${1 / e.x}, ${1 / e.y}) `),
    n)
  ) {
    const {
      transformPerspective: c,
      rotate: u,
      rotateX: h,
      rotateY: d,
      skewX: p,
      skewY: m,
    } = n;
    (c && (i = `perspective(${c}px) ${i}`),
      u && (i += `rotate(${u}deg) `),
      h && (i += `rotateX(${h}deg) `),
      d && (i += `rotateY(${d}deg) `),
      p && (i += `skewX(${p}deg) `),
      m && (i += `skewY(${m}deg) `));
  }
  const a = t.x.scale * e.x,
    l = t.y.scale * e.y;
  return ((a !== 1 || l !== 1) && (i += `scale(${a}, ${l})`), i || "none");
}
var Dr = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
  fu = Dr.length,
  Bi = (t) => (typeof t == "string" ? parseFloat(t) : t),
  Fi = (t) => typeof t == "number" || S.test(t);
function du(t, e, n, i, s, o) {
  s
    ? ((t.opacity = F(0, n.opacity ?? 1, pu(i))),
      (t.opacityExit = F(e.opacity ?? 1, 0, mu(i))))
    : o && (t.opacity = F(e.opacity ?? 1, n.opacity ?? 1, i));
  for (let r = 0; r < fu; r++) {
    const a = `border${Dr[r]}Radius`;
    let l = _i(e, a),
      c = _i(n, a);
    (l === void 0 && c === void 0) ||
      (l || (l = 0),
      c || (c = 0),
      l === 0 || c === 0 || Fi(l) === Fi(c)
        ? ((t[a] = Math.max(F(Bi(l), Bi(c), i), 0)),
          (st.test(c) || st.test(l)) && (t[a] += "%"))
        : (t[a] = c));
  }
  (e.rotate || n.rotate) && (t.rotate = F(e.rotate || 0, n.rotate || 0, i));
}
function _i(t, e) {
  return t[e] !== void 0 ? t[e] : t.borderRadius;
}
var pu = Rr(0, 0.5, ws),
  mu = Rr(0.5, 0.95, q);
function Rr(t, e, n) {
  return (i) => (i < t ? 0 : i > e ? 1 : n(Kt(t, e, i)));
}
function vu(t, e, n) {
  const i = W(t) ? t : At(t);
  return (i.start(Rn("", i, e, n)), i.animation);
}
function Xt(t, e, n, i = { passive: !0 }) {
  return (t.addEventListener(e, n, i), () => t.removeEventListener(e, n));
}
var yu = (t, e) => t.depth - e.depth,
  gu = class {
    constructor() {
      ((this.children = []), (this.isDirty = !1));
    }
    add(t) {
      (mn(this.children, t), (this.isDirty = !0));
    }
    remove(t) {
      (vn(this.children, t), (this.isDirty = !0));
    }
    forEach(t) {
      (this.isDirty && this.children.sort(yu),
        (this.isDirty = !1),
        this.children.forEach(t));
    }
  };
function Tu(t, e) {
  const n = K.now(),
    i = ({ timestamp: s }) => {
      const o = s - n;
      o >= e && (ut(i), t(o - e));
    };
  return (k.setup(i, !0), () => ut(i));
}
function ce(t) {
  return W(t) ? t.get() : t;
}
var xu = class {
    constructor() {
      this.members = [];
    }
    add(t) {
      (mn(this.members, t), t.scheduleRender());
    }
    remove(t) {
      if (
        (vn(this.members, t),
        t === this.prevLead && (this.prevLead = void 0),
        t === this.lead)
      ) {
        const e = this.members[this.members.length - 1];
        e && this.promote(e);
      }
    }
    relegate(t) {
      const e = this.members.findIndex((i) => t === i);
      if (e === 0) return !1;
      let n;
      for (let i = e; i >= 0; i--) {
        const s = this.members[i];
        if (s.isPresent !== !1) {
          n = s;
          break;
        }
      }
      return n ? (this.promote(n), !0) : !1;
    }
    promote(t, e) {
      const n = this.lead;
      if (t !== n && ((this.prevLead = n), (this.lead = t), t.show(), n)) {
        (n.instance && n.scheduleRender(), t.scheduleRender());
        const i = n.options.layoutDependency,
          s = t.options.layoutDependency;
        (i !== void 0 && s !== void 0 && i === s) ||
          ((t.resumeFrom = n),
          e && (t.resumeFrom.preserveOpacity = !0),
          n.snapshot &&
            ((t.snapshot = n.snapshot),
            (t.snapshot.latestValues = n.animationValues || n.latestValues)),
          t.root && t.root.isUpdating && (t.isLayoutDirty = !0));
        const { crossfade: o } = t.options;
        o === !1 && n.hide();
      }
    }
    exitAnimationComplete() {
      this.members.forEach((t) => {
        const { options: e, resumingFrom: n } = t;
        (e.onExitComplete && e.onExitComplete(),
          n && n.options.onExitComplete && n.options.onExitComplete());
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
  he = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 },
  Tt = { nodes: 0, calculatedTargetDeltas: 0, calculatedProjections: 0 },
  Ie = ["", "X", "Y", "Z"],
  wu = 1e3,
  Pu = 0;
function je(t, e, n, i) {
  const { latestValues: s } = e;
  s[t] && ((n[t] = s[t]), e.setStaticValue(t, 0), i && (i[t] = 0));
}
function Lr(t) {
  if (((t.hasCheckedOptimisedAppear = !0), t.root === t)) return;
  const { visualElement: e } = t.options;
  if (!e) return;
  const n = Zs(e);
  if (window.MotionHasOptimisedAnimation(n, "transform")) {
    const { layout: s, layoutId: o } = t.options;
    window.MotionCancelOptimisedAnimation(n, "transform", k, !(s || o));
  }
  const { parent: i } = t;
  i && !i.hasCheckedOptimisedAppear && Lr(i);
}
function kr({
  attachResizeListener: t,
  defaultParent: e,
  measureScroll: n,
  checkIsScrollRoot: i,
  resetTransform: s,
}) {
  return class {
    constructor(r = {}, a = e?.()) {
      ((this.id = Pu++),
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
            it.value &&
              (Tt.nodes =
                Tt.calculatedTargetDeltas =
                Tt.calculatedProjections =
                  0),
            this.nodes.forEach(bu),
            this.nodes.forEach(Mu),
            this.nodes.forEach(Du),
            this.nodes.forEach(Cu),
            it.addProjectionMetrics && it.addProjectionMetrics(Tt));
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
      this.root === this && (this.nodes = new gu());
    }
    addEventListener(r, a) {
      return (
        this.eventHandlers.has(r) || this.eventHandlers.set(r, new gn()),
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
      ((this.isSVG = _n(r) && !Sl(r)), (this.instance = r));
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
        const d = () => (this.root.updateBlockedByResize = !1);
        (k.read(() => {
          h = window.innerWidth;
        }),
          t(r, () => {
            const p = window.innerWidth;
            p !== h &&
              ((h = p),
              (this.root.updateBlockedByResize = !0),
              u && u(),
              (u = Tu(d, 250)),
              he.hasAnimatedSinceResize &&
                ((he.hasAnimatedSinceResize = !1), this.nodes.forEach(Ui)));
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
              hasRelativeLayoutChanged: d,
              layout: p,
            }) => {
              if (this.isTreeAnimationBlocked()) {
                ((this.target = void 0), (this.relativeTarget = void 0));
                return;
              }
              const m =
                  this.options.transition || c.getDefaultTransition() || ju,
                { onLayoutAnimationStart: P, onLayoutAnimationComplete: y } =
                  c.getProps(),
                g = !this.targetLayout || !Mr(this.targetLayout, p),
                A = !h && d;
              if (
                this.options.layoutRoot ||
                this.resumeFrom ||
                A ||
                (h && (g || !this.currentAnimation))
              ) {
                this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0));
                const T = { ...Dn(m, "layout"), onPlay: P, onComplete: y };
                ((c.shouldReduceMotion || this.options.layoutRoot) &&
                  ((T.delay = 0), (T.type = !1)),
                  this.startAnimation(T),
                  this.setAnimationOrigin(u, A));
              } else
                (h || Ui(this),
                  this.isLead() &&
                    this.options.onExitComplete &&
                    this.options.onExitComplete());
              this.targetLayout = p;
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
        ut(this.updateProjection));
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
        this.nodes && this.nodes.forEach(Ru),
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
          Lr(this),
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
          this.nodes.forEach(Oi));
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(Ni);
        return;
      }
      ((this.animationCommitId = this.animationId),
        this.isUpdating
          ? ((this.isUpdating = !1),
            this.nodes.forEach(Vu),
            this.nodes.forEach(Su),
            this.nodes.forEach(Au))
          : this.nodes.forEach(Ni),
        this.clearAllSnapshots());
      const r = K.now();
      (($.delta = rt(0, 1e3 / 60, r - $.timestamp)),
        ($.timestamp = r),
        ($.isProcessing = !0),
        Ce.update.process($),
        Ce.preRender.process($),
        Ce.render.process($),
        ($.isProcessing = !1));
    }
    didUpdate() {
      this.updateScheduled ||
        ((this.updateScheduled = !0), Bn.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      (this.nodes.forEach(Eu), this.sharedNodes.forEach(Lu));
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0),
        k.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      k.postRender(() => {
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
          !z(this.snapshot.measuredBox.x) &&
          !z(this.snapshot.measuredBox.y) &&
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
        (this.layoutCorrected = U()),
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
        const l = i(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: r,
          isRoot: l,
          offset: n(this.instance),
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
        a = this.projectionDelta && !Vr(this.projectionDelta),
        l = this.getTransformTemplate(),
        c = l ? l(this.latestValues, "") : void 0,
        u = c !== this.prevTransformTemplateValue;
      r &&
        this.instance &&
        (a || gt(this.latestValues) || u) &&
        (s(this.instance, c),
        (this.shouldResetTransform = !1),
        this.scheduleRender());
    }
    measure(r = !0) {
      const a = this.measurePageBox();
      let l = this.removeElementScroll(a);
      return (
        r && (l = this.removeTransform(l)),
        Bu(l),
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
      if (!r) return U();
      const a = r.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(Fu))) {
        const { scroll: l } = this.root;
        l && (Dt(a.x, l.offset.x), Dt(a.y, l.offset.y));
      }
      return a;
    }
    removeElementScroll(r) {
      const a = U();
      if ((J(a, r), this.scroll?.wasRoot)) return a;
      for (let l = 0; l < this.path.length; l++) {
        const c = this.path[l],
          { scroll: u, options: h } = c;
        c !== this.root &&
          u &&
          h.layoutScroll &&
          (u.wasRoot && J(a, r), Dt(a.x, u.offset.x), Dt(a.y, u.offset.y));
      }
      return a;
    }
    applyTransform(r, a = !1) {
      const l = U();
      J(l, r);
      for (let c = 0; c < this.path.length; c++) {
        const u = this.path[c];
        (!a &&
          u.options.layoutScroll &&
          u.scroll &&
          u !== u.root &&
          Rt(l, { x: -u.scroll.offset.x, y: -u.scroll.offset.y }),
          gt(u.latestValues) && Rt(l, u.latestValues));
      }
      return (gt(this.latestValues) && Rt(l, this.latestValues), l);
    }
    removeTransform(r) {
      const a = U();
      J(a, r);
      for (let l = 0; l < this.path.length; l++) {
        const c = this.path[l];
        if (!c.instance || !gt(c.latestValues)) continue;
        ln(c.latestValues) && c.updateSnapshot();
        const u = U();
        (J(u, c.measurePageBox()),
          Di(a, c.latestValues, c.snapshot ? c.snapshot.layoutBox : void 0, u));
      }
      return (gt(this.latestValues) && Di(a, this.latestValues), a);
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
        this.relativeParent.resolvedRelativeTargetAt !== $.timestamp &&
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
      this.resolvedRelativeTargetAt = $.timestamp;
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
            ((this.target = U()), (this.targetWithTransforms = U())),
          this.relativeTarget &&
          this.relativeTargetOrigin &&
          this.relativeParent &&
          this.relativeParent.target
            ? (this.forceRelativeParentToResolveTarget(),
              ou(this.target, this.relativeTarget, this.relativeParent.target))
            : this.targetDelta
              ? (this.resumingFrom
                  ? (this.target = this.applyTransform(this.layout.layoutBox))
                  : J(this.target, this.layout.layoutBox),
                vr(this.target, this.targetDelta))
              : J(this.target, this.layout.layoutBox),
          this.attemptToResolveRelativeTarget &&
            ((this.attemptToResolveRelativeTarget = !1),
            h &&
            !!h.resumingFrom == !!this.resumingFrom &&
            !h.options.layoutScroll &&
            h.target &&
            this.animationProgress !== 1
              ? this.createRelativeTarget(h, this.target, h.target)
              : (this.relativeParent = this.relativeTarget = void 0)),
          it.value && Tt.calculatedTargetDeltas++));
    }
    getClosestProjectingParent() {
      if (
        !(
          !this.parent ||
          ln(this.parent.latestValues) ||
          mr(this.parent.latestValues)
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
        (this.relativeTarget = U()),
        (this.relativeTargetOrigin = U()),
        ve(this.relativeTargetOrigin, a, l),
        J(this.relativeTarget, this.relativeTargetOrigin));
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
        this.resolvedRelativeTargetAt === $.timestamp && (l = !1),
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
      J(this.layoutCorrected, this.layout.layoutBox);
      const h = this.treeScale.x,
        d = this.treeScale.y;
      (jl(this.layoutCorrected, this.treeScale, this.path, a),
        r.layout &&
          !r.target &&
          (this.treeScale.x !== 1 || this.treeScale.y !== 1) &&
          ((r.target = r.layout.layoutBox), (r.targetWithTransforms = U())));
      const { target: p } = r;
      if (!p) {
        this.prevProjectionDelta &&
          (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      (!this.projectionDelta || !this.prevProjectionDelta
        ? this.createProjectionDeltas()
        : (Ai(this.prevProjectionDelta.x, this.projectionDelta.x),
          Ai(this.prevProjectionDelta.y, this.projectionDelta.y)),
        Wt(this.projectionDelta, this.layoutCorrected, p, this.latestValues),
        (this.treeScale.x !== h ||
          this.treeScale.y !== d ||
          !ji(this.projectionDelta.x, this.prevProjectionDelta.x) ||
          !ji(this.projectionDelta.y, this.prevProjectionDelta.y)) &&
          ((this.hasProjected = !0),
          this.scheduleRender(),
          this.notifyListeners("projectionUpdate", p)),
        it.value && Tt.calculatedProjections++);
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
      ((this.prevProjectionDelta = Mt()),
        (this.projectionDelta = Mt()),
        (this.projectionDeltaWithTransform = Mt()));
    }
    setAnimationOrigin(r, a = !1) {
      const l = this.snapshot,
        c = l ? l.latestValues : {},
        u = { ...this.latestValues },
        h = Mt();
      ((!this.relativeParent || !this.relativeParent.options.layoutRoot) &&
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !a));
      const d = U(),
        p =
          (l ? l.source : void 0) !==
          (this.layout ? this.layout.source : void 0),
        m = this.getStack(),
        P = !m || m.members.length <= 1,
        y = !!(p && !P && this.options.crossfade === !0 && !this.path.some(Iu));
      this.animationProgress = 0;
      let g;
      ((this.mixTargetDelta = (A) => {
        const T = A / 1e3;
        ($i(h.x, r.x, T),
          $i(h.y, r.y, T),
          this.setTargetDelta(h),
          this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.layout &&
            this.relativeParent &&
            this.relativeParent.layout &&
            (ve(d, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
            ku(this.relativeTarget, this.relativeTargetOrigin, d, T),
            g && cu(this.relativeTarget, g) && (this.isProjectionDirty = !1),
            g || (g = U()),
            J(g, this.relativeTarget)),
          p &&
            ((this.animationValues = u), du(u, c, this.latestValues, T, y, P)),
          this.root.scheduleUpdateProjection(),
          this.scheduleRender(),
          (this.animationProgress = T));
      }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0));
    }
    startAnimation(r) {
      (this.notifyListeners("animationStart"),
        this.currentAnimation?.stop(),
        this.resumingFrom?.currentAnimation?.stop(),
        this.pendingAnimation &&
          (ut(this.pendingAnimation), (this.pendingAnimation = void 0)),
        (this.pendingAnimation = k.update(() => {
          ((he.hasAnimatedSinceResize = !0),
            Pt.layout++,
            this.motionValue || (this.motionValue = At(0)),
            (this.currentAnimation = vu(this.motionValue, [0, 1e3], {
              ...r,
              velocity: 0,
              isSync: !0,
              onUpdate: (a) => {
                (this.mixTargetDelta(a), r.onUpdate && r.onUpdate(a));
              },
              onStop: () => {
                Pt.layout--;
              },
              onComplete: () => {
                (Pt.layout--,
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
        (this.mixTargetDelta && this.mixTargetDelta(wu),
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
          Ir(this.options.animationType, this.layout.layoutBox, c.layoutBox)
        ) {
          l = this.target || U();
          const h = z(this.layout.layoutBox.x);
          ((l.x.min = r.target.x.min), (l.x.max = l.x.min + h));
          const d = z(this.layout.layoutBox.y);
          ((l.y.min = r.target.y.min), (l.y.max = l.y.min + d));
        }
        (J(a, l),
          Rt(a, u),
          Wt(this.projectionDeltaWithTransform, this.layoutCorrected, a, u));
      }
    }
    registerSharedNode(r, a) {
      (this.sharedNodes.has(r) || this.sharedNodes.set(r, new xu()),
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
      l.z && je("z", r, c, this.animationValues);
      for (let u = 0; u < Ie.length; u++)
        (je(`rotate${Ie[u]}`, r, c, this.animationValues),
          je(`skew${Ie[u]}`, r, c, this.animationValues));
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
          (r.pointerEvents = ce(a?.pointerEvents) || ""),
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
          (r.pointerEvents = ce(a?.pointerEvents) || "")),
          this.hasProjected &&
            !gt(this.latestValues) &&
            ((r.transform = l ? l({}, "") : "none"), (this.hasProjected = !1)));
        return;
      }
      r.visibility = "";
      const u = c.animationValues || c.latestValues;
      this.applyTransformsToTarget();
      let h = hu(this.projectionDeltaWithTransform, this.treeScale, u);
      (l && (h = l(u, h)), (r.transform = h));
      const { x: d, y: p } = this.projectionDelta;
      ((r.transformOrigin = `${d.origin * 100}% ${p.origin * 100}% 0`),
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
      for (const m in cn) {
        if (u[m] === void 0) continue;
        const { correct: P, applyTo: y, isCSSVariable: g } = cn[m],
          A = h === "none" ? u[m] : P(u[m], c);
        if (y) {
          const T = y.length;
          for (let b = 0; b < T; b++) r[y[b]] = A;
        } else
          g ? (this.options.visualElement.renderState.vars[m] = A) : (r[m] = A);
      }
      this.options.layoutId &&
        (r.pointerEvents = c === this ? ce(a?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      (this.root.nodes.forEach((r) => r.currentAnimation?.stop()),
        this.root.nodes.forEach(Oi),
        this.root.sharedNodes.clear());
    }
  };
}
function Su(t) {
  t.updateLayout();
}
function Au(t) {
  const e = t.resumeFrom?.snapshot || t.snapshot;
  if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
    const { layoutBox: n, measuredBox: i } = t.layout,
      { animationType: s } = t.options,
      o = e.source !== t.layout.source;
    s === "size"
      ? nt((u) => {
          const h = o ? e.measuredBox[u] : e.layoutBox[u],
            d = z(h);
          ((h.min = n[u].min), (h.max = h.min + d));
        })
      : Ir(s, e.layoutBox, n) &&
        nt((u) => {
          const h = o ? e.measuredBox[u] : e.layoutBox[u],
            d = z(n[u]);
          ((h.max = h.min + d),
            t.relativeTarget &&
              !t.currentAnimation &&
              ((t.isProjectionDirty = !0),
              (t.relativeTarget[u].max = t.relativeTarget[u].min + d)));
        });
    const r = Mt();
    Wt(r, n, e.layoutBox);
    const a = Mt();
    o ? Wt(a, t.applyTransform(i, !0), e.measuredBox) : Wt(a, n, e.layoutBox);
    const l = !Vr(r);
    let c = !1;
    if (!t.resumeFrom) {
      const u = t.getClosestProjectingParent();
      if (u && !u.resumeFrom) {
        const { snapshot: h, layout: d } = u;
        if (h && d) {
          const p = U();
          ve(p, e.layoutBox, h.layoutBox);
          const m = U();
          (ve(m, n, d.layoutBox),
            Mr(p, m) || (c = !0),
            u.options.layoutRoot &&
              ((t.relativeTarget = m),
              (t.relativeTargetOrigin = p),
              (t.relativeParent = u)));
        }
      }
    }
    t.notifyListeners("didUpdate", {
      layout: n,
      snapshot: e,
      delta: a,
      layoutDelta: r,
      hasLayoutChanged: l,
      hasRelativeLayoutChanged: c,
    });
  } else if (t.isLead()) {
    const { onExitComplete: n } = t.options;
    n && n();
  }
  t.options.transition = void 0;
}
function bu(t) {
  (it.value && Tt.nodes++,
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
function Cu(t) {
  t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1;
}
function Eu(t) {
  t.clearSnapshot();
}
function Oi(t) {
  t.clearMeasurements();
}
function Ni(t) {
  t.isLayoutDirty = !1;
}
function Vu(t) {
  const { visualElement: e } = t.options;
  (e && e.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"),
    t.resetTransform());
}
function Ui(t) {
  (t.finishAnimation(),
    (t.targetDelta = t.relativeTarget = t.target = void 0),
    (t.isProjectionDirty = !0));
}
function Mu(t) {
  t.resolveTargetDelta();
}
function Du(t) {
  t.calcProjection();
}
function Ru(t) {
  t.resetSkewAndRotation();
}
function Lu(t) {
  t.removeLeadSnapshot();
}
function $i(t, e, n) {
  ((t.translate = F(e.translate, 0, n)),
    (t.scale = F(e.scale, 1, n)),
    (t.origin = e.origin),
    (t.originPoint = e.originPoint));
}
function Wi(t, e, n, i) {
  ((t.min = F(e.min, n.min, i)), (t.max = F(e.max, n.max, i)));
}
function ku(t, e, n, i) {
  (Wi(t.x, e.x, n.x, i), Wi(t.y, e.y, n.y, i));
}
function Iu(t) {
  return t.animationValues && t.animationValues.opacityExit !== void 0;
}
var ju = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  Hi = (t) =>
    typeof navigator < "u" &&
    navigator.userAgent &&
    navigator.userAgent.toLowerCase().includes(t),
  Ki = Hi("applewebkit/") && !Hi("chrome/") ? Math.round : q;
function zi(t) {
  ((t.min = Ki(t.min)), (t.max = Ki(t.max)));
}
function Bu(t) {
  (zi(t.x), zi(t.y));
}
function Ir(t, e, n) {
  return (
    t === "position" || (t === "preserve-aspect" && !ru(Ii(e), Ii(n), 0.2))
  );
}
function Fu(t) {
  return t !== t.root && t.scroll?.wasRoot;
}
var _u = kr({
    attachResizeListener: (t, e) => Xt(t, "resize", e),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
      y: document.documentElement.scrollTop || document.body?.scrollTop || 0,
    }),
    checkIsScrollRoot: () => !0,
  }),
  Be = { current: void 0 },
  jr = kr({
    measureScroll: (t) => ({ x: t.scrollLeft, y: t.scrollTop }),
    defaultParent: () => {
      if (!Be.current) {
        const t = new _u({});
        (t.mount(window), t.setOptions({ layoutScroll: !0 }), (Be.current = t));
      }
      return Be.current;
    },
    resetTransform: (t, e) => {
      t.style.transform = e !== void 0 ? e : "none";
    },
    checkIsScrollRoot: (t) => window.getComputedStyle(t).position === "fixed",
  }),
  Ae = (0, w.createContext)({
    transformPagePoint: (t) => t,
    isStatic: !1,
    reducedMotion: "never",
  });
function Yi(t, e) {
  if (typeof t == "function") return t(e);
  t != null && (t.current = e);
}
function Ou(...t) {
  return (e) => {
    let n = !1;
    const i = t.map((s) => {
      const o = Yi(s, e);
      return (!n && typeof o == "function" && (n = !0), o);
    });
    if (n)
      return () => {
        for (let s = 0; s < i.length; s++) {
          const o = i[s];
          typeof o == "function" ? o() : Yi(t[s], null);
        }
      };
  };
}
function Nu(...t) {
  return w.useCallback(Ou(...t), t);
}
var at = us(ro(), 1),
  Uu = class extends w.Component {
    getSnapshotBeforeUpdate(t) {
      const e = this.props.childRef.current;
      if (e && t.isPresent && !this.props.isPresent && this.props.pop !== !1) {
        const n = e.offsetParent,
          i = (on(n) && n.offsetWidth) || 0,
          s = (on(n) && n.offsetHeight) || 0,
          o = this.props.sizeRef.current;
        ((o.height = e.offsetHeight || 0),
          (o.width = e.offsetWidth || 0),
          (o.top = e.offsetTop),
          (o.left = e.offsetLeft),
          (o.right = i - o.width - o.left),
          (o.bottom = s - o.height - o.top));
      }
      return null;
    }
    componentDidUpdate() {}
    render() {
      return this.props.children;
    }
  };
function $u({
  children: t,
  isPresent: e,
  anchorX: n,
  anchorY: i,
  root: s,
  pop: o,
}) {
  const r = (0, w.useId)(),
    a = (0, w.useRef)(null),
    l = (0, w.useRef)({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }),
    { nonce: c } = (0, w.useContext)(Ae),
    u = Nu(a, t.props?.ref ?? t?.ref);
  return (
    (0, w.useInsertionEffect)(() => {
      const {
        width: h,
        height: d,
        top: p,
        left: m,
        right: P,
        bottom: y,
      } = l.current;
      if (e || o === !1 || !a.current || !h || !d) return;
      const g = n === "left" ? `left: ${m}` : `right: ${P}`,
        A = i === "bottom" ? `bottom: ${y}` : `top: ${p}`;
      a.current.dataset.motionPopId = r;
      const T = document.createElement("style");
      c && (T.nonce = c);
      const b = s ?? document.head;
      return (
        b.appendChild(T),
        T.sheet &&
          T.sheet.insertRule(`
          [data-motion-pop-id="${r}"] {
            position: absolute !important;
            width: ${h}px !important;
            height: ${d}px !important;
            ${g}px !important;
            ${A}px !important;
          }
        `),
        () => {
          b.contains(T) && b.removeChild(T);
        }
      );
    }, [e]),
    (0, at.jsx)(Uu, {
      isPresent: e,
      childRef: a,
      sizeRef: l,
      pop: o,
      children: o === !1 ? t : w.cloneElement(t, { ref: u }),
    })
  );
}
var Wu = ({
  children: t,
  initial: e,
  isPresent: n,
  onExitComplete: i,
  custom: s,
  presenceAffectsLayout: o,
  mode: r,
  anchorX: a,
  anchorY: l,
  root: c,
}) => {
  const u = dt(Hu),
    h = (0, w.useId)();
  let d = !0,
    p = (0, w.useMemo)(
      () => (
        (d = !1),
        {
          id: h,
          initial: e,
          isPresent: n,
          custom: s,
          onExitComplete: (m) => {
            u.set(m, !0);
            for (const P of u.values()) if (!P) return;
            i && i();
          },
          register: (m) => (u.set(m, !1), () => u.delete(m)),
        }
      ),
      [n, u, i],
    );
  return (
    o && d && (p = { ...p }),
    (0, w.useMemo)(() => {
      u.forEach((m, P) => u.set(P, !1));
    }, [n]),
    w.useEffect(() => {
      !n && !u.size && i && i();
    }, [n]),
    (t = (0, at.jsx)($u, {
      pop: r === "popLayout",
      isPresent: n,
      anchorX: a,
      anchorY: l,
      root: c,
      children: t,
    })),
    (0, at.jsx)(xe.Provider, { value: p, children: t })
  );
};
function Hu() {
  return new Map();
}
function Br(t = !0) {
  const e = (0, w.useContext)(xe);
  if (e === null) return [!0, null];
  const { isPresent: n, onExitComplete: i, register: s } = e,
    o = (0, w.useId)();
  (0, w.useEffect)(() => {
    if (t) return s(o);
  }, [t]);
  const r = (0, w.useCallback)(() => t && i && i(o), [o, i, t]);
  return !n && i ? [!1, r] : [!0];
}
var ie = (t) => t.key || "";
function Gi(t) {
  const e = [];
  return (
    w.Children.forEach(t, (n) => {
      (0, w.isValidElement)(n) && e.push(n);
    }),
    e
  );
}
var hh = ({
    children: t,
    custom: e,
    initial: n = !0,
    onExitComplete: i,
    presenceAffectsLayout: s = !0,
    mode: o = "sync",
    propagate: r = !1,
    anchorX: a = "left",
    anchorY: l = "top",
    root: c,
  }) => {
    const [u, h] = Br(r),
      d = (0, w.useMemo)(() => Gi(t), [t]),
      p = r && !u ? [] : d.map(ie),
      m = (0, w.useRef)(!0),
      P = (0, w.useRef)(d),
      y = dt(() => new Map()),
      g = (0, w.useRef)(new Set()),
      [A, T] = (0, w.useState)(d),
      [b, C] = (0, w.useState)(d);
    Te(() => {
      ((m.current = !1), (P.current = d));
      for (let x = 0; x < b.length; x++) {
        const M = ie(b[x]);
        p.includes(M)
          ? (y.delete(M), g.current.delete(M))
          : y.get(M) !== !0 && y.set(M, !1);
      }
    }, [b, p.length, p.join("-")]);
    const D = [];
    if (d !== A) {
      let x = [...d];
      for (let M = 0; M < b.length; M++) {
        const H = b[M],
          Z = ie(H);
        p.includes(Z) || (x.splice(M, 0, H), D.push(H));
      }
      return (o === "wait" && D.length && (x = D), C(Gi(x)), T(d), null);
    }
    const { forceRender: j } = (0, w.useContext)(pn);
    return (0, at.jsx)(at.Fragment, {
      children: b.map((x) => {
        const M = ie(x),
          H = r && !u ? !1 : d === b || p.includes(M),
          Z = () => {
            if (g.current.has(M)) return;
            if ((g.current.add(M), y.has(M))) y.set(M, !0);
            else return;
            let ot = !0;
            (y.forEach((Bt) => {
              Bt || (ot = !1);
            }),
              ot && (j?.(), C(P.current), r && h?.(), i && i()));
          };
        return (0, at.jsx)(
          Wu,
          {
            isPresent: H,
            initial: !m.current || n ? void 0 : !1,
            custom: e,
            presenceAffectsLayout: s,
            mode: o,
            root: c,
            onExitComplete: H ? void 0 : Z,
            anchorX: a,
            anchorY: l,
            children: x,
          },
          M,
        );
      }),
    });
  },
  Fr = (0, w.createContext)({ strict: !1 }),
  Xi = {
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
  qi = !1;
function Ku() {
  if (qi) return;
  const t = {};
  for (const e in Xi) t[e] = { isEnabled: (n) => Xi[e].some((i) => !!n[i]) };
  (fr(t), (qi = !0));
}
function _r() {
  return (Ku(), Rl());
}
function zu(t) {
  const e = _r();
  for (const n in t) e[n] = { ...e[n], ...t[n] };
  fr(e);
}
var Yu = new Set([
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
  "propagate",
  "ignoreStrict",
  "viewport",
]);
function ye(t) {
  return (
    t.startsWith("while") ||
    (t.startsWith("drag") && t !== "draggable") ||
    t.startsWith("layout") ||
    t.startsWith("onTap") ||
    t.startsWith("onPan") ||
    t.startsWith("onLayout") ||
    Yu.has(t)
  );
}
var Gu = eo({ default: () => Or }, 1),
  Or,
  Xu = to(() => {
    throw (
      (Or = {}),
      new Error(
        'Could not resolve "@emotion/is-prop-valid" imported by "framer-motion". Is it installed?',
      )
    );
  }),
  Nr = (t) => !ye(t);
function qu(t) {
  typeof t == "function" && (Nr = (e) => (e.startsWith("on") ? !ye(e) : t(e)));
}
try {
  qu((Xu(), Qr(Gu)).default);
} catch {}
function Zu(t, e, n) {
  const i = {};
  for (const s in t)
    (s === "values" && typeof t.values == "object") ||
      ((Nr(s) ||
        (n === !0 && ye(s)) ||
        (!e && !ye(s)) ||
        (t.draggable && s.startsWith("onDrag"))) &&
        (i[s] = t[s]));
  return i;
}
var be = (0, w.createContext)({});
function Ju(t, e) {
  if (Se(t)) {
    const { initial: n, animate: i } = t;
    return {
      initial: n === !1 || Gt(n) ? n : void 0,
      animate: Gt(i) ? i : void 0,
    };
  }
  return t.inherit !== !1 ? e : {};
}
function Qu(t) {
  const { initial: e, animate: n } = Ju(t, (0, w.useContext)(be));
  return (0, w.useMemo)(() => ({ initial: e, animate: n }), [Zi(e), Zi(n)]);
}
function Zi(t) {
  return Array.isArray(t) ? t.join(" ") : t;
}
var Wn = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
function Ur(t, e, n) {
  for (const i in e) !W(e[i]) && !Tr(i, n) && (t[i] = e[i]);
}
function tc({ transformTemplate: t }, e) {
  return (0, w.useMemo)(() => {
    const n = Wn();
    return (Un(n, e, t), Object.assign({}, n.vars, n.style));
  }, [e]);
}
function ec(t, e) {
  const n = t.style || {},
    i = {};
  return (Ur(i, n, t), Object.assign(i, tc(t, e)), i);
}
function nc(t, e) {
  const n = {},
    i = ec(t, e);
  return (
    t.drag &&
      t.dragListener !== !1 &&
      ((n.draggable = !1),
      (i.userSelect = i.WebkitUserSelect = i.WebkitTouchCallout = "none"),
      (i.touchAction =
        t.drag === !0 ? "none" : `pan-${t.drag === "x" ? "y" : "x"}`)),
    t.tabIndex === void 0 &&
      (t.onTap || t.onTapStart || t.whileTap) &&
      (n.tabIndex = 0),
    (n.style = i),
    n
  );
}
var $r = () => ({ ...Wn(), attrs: {} });
function ic(t, e, n, i) {
  const s = (0, w.useMemo)(() => {
    const o = $r();
    return (
      xr(o, e, Pr(i), t.transformTemplate, t.style),
      { ...o.attrs, style: { ...o.style } }
    );
  }, [e]);
  if (t.style) {
    const o = {};
    (Ur(o, t.style, t), (s.style = { ...o, ...s.style }));
  }
  return s;
}
var sc = [
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
function Hn(t) {
  return typeof t != "string" || t.includes("-")
    ? !1
    : !!(sc.indexOf(t) > -1 || /[A-Z]/u.test(t));
}
function rc(t, e, n, { latestValues: i }, s, o = !1, r) {
  const a = ((r ?? Hn(t)) ? ic : nc)(e, i, s, t),
    l = Zu(e, typeof t == "string", o),
    c = t !== w.Fragment ? { ...l, ...a, ref: n } : {},
    { children: u } = e,
    h = (0, w.useMemo)(() => (W(u) ? u.get() : u), [u]);
  return (0, w.createElement)(t, { ...c, children: h });
}
function oc({ scrapeMotionValuesFromProps: t, createRenderState: e }, n, i, s) {
  return { latestValues: ac(n, i, s, t), renderState: e() };
}
function ac(t, e, n, i) {
  const s = {},
    o = i(t, {});
  for (const d in o) s[d] = ce(o[d]);
  let { initial: r, animate: a } = t;
  const l = Se(t),
    c = hr(t);
  e &&
    c &&
    !l &&
    t.inherit !== !1 &&
    (r === void 0 && (r = e.initial), a === void 0 && (a = e.animate));
  let u = n ? n.initial === !1 : !1;
  u = u || r === !1;
  const h = u ? a : r;
  if (h && typeof h != "boolean" && !Pe(h)) {
    const d = Array.isArray(h) ? h : [h];
    for (let p = 0; p < d.length; p++) {
      const m = Ln(t, d[p]);
      if (m) {
        const { transitionEnd: P, transition: y, ...g } = m;
        for (const A in g) {
          let T = g[A];
          if (Array.isArray(T)) {
            const b = u ? T.length - 1 : 0;
            T = T[b];
          }
          T !== null && (s[A] = T);
        }
        for (const A in P) s[A] = P[A];
      }
    }
  }
  return s;
}
var Wr = (t) => (e, n) => {
    const i = (0, w.useContext)(be),
      s = (0, w.useContext)(xe),
      o = () => oc(t, e, i, s);
    return n ? o() : dt(o);
  },
  lc = Wr({ scrapeMotionValuesFromProps: $n, createRenderState: Wn }),
  uc = Wr({ scrapeMotionValuesFromProps: Sr, createRenderState: $r }),
  cc = Symbol.for("motionComponentSymbol");
function hc(t, e, n) {
  const i = (0, w.useRef)(n);
  (0, w.useInsertionEffect)(() => {
    i.current = n;
  });
  const s = (0, w.useRef)(null);
  return (0, w.useCallback)(
    (o) => {
      (o && t.onMount?.(o), e && (o ? e.mount(o) : e.unmount()));
      const r = i.current;
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
var Hr = (0, w.createContext)({});
function Ct(t) {
  return (
    t &&
    typeof t == "object" &&
    Object.prototype.hasOwnProperty.call(t, "current")
  );
}
function fc(t, e, n, i, s, o) {
  const { visualElement: r } = (0, w.useContext)(be),
    a = (0, w.useContext)(Fr),
    l = (0, w.useContext)(xe),
    c = (0, w.useContext)(Ae),
    u = c.reducedMotion,
    h = c.skipAnimations,
    d = (0, w.useRef)(null),
    p = (0, w.useRef)(!1);
  ((i = i || a.renderer),
    !d.current &&
      i &&
      ((d.current = i(t, {
        visualState: e,
        parent: r,
        props: n,
        presenceContext: l,
        blockInitialAnimation: l ? l.initial === !1 : !1,
        reducedMotionConfig: u,
        skipAnimations: h,
        isSVG: o,
      })),
      p.current && d.current && (d.current.manuallyAnimateOnMount = !0)));
  const m = d.current,
    P = (0, w.useContext)(Hr);
  m &&
    !m.projection &&
    s &&
    (m.type === "html" || m.type === "svg") &&
    dc(d.current, n, s, P);
  const y = (0, w.useRef)(!1);
  (0, w.useInsertionEffect)(() => {
    m && y.current && m.update(n, l);
  });
  const g = n[qs],
    A = (0, w.useRef)(
      !!g &&
        !window.MotionHandoffIsComplete?.(g) &&
        window.MotionHasOptimisedAnimation?.(g),
    );
  return (
    Te(() => {
      ((p.current = !0),
        m &&
          ((y.current = !0),
          (window.MotionIsMounted = !0),
          m.updateFeatures(),
          m.scheduleRenderMicrotask(),
          A.current && m.animationState && m.animationState.animateChanges()));
    }),
    (0, w.useEffect)(() => {
      m &&
        (!A.current && m.animationState && m.animationState.animateChanges(),
        A.current &&
          (queueMicrotask(() => {
            window.MotionHandoffMarkAsComplete?.(g);
          }),
          (A.current = !1)),
        (m.enteringChildren = void 0));
    }),
    m
  );
}
function dc(t, e, n, i) {
  const {
    layoutId: s,
    layout: o,
    drag: r,
    dragConstraints: a,
    layoutScroll: l,
    layoutRoot: c,
    layoutCrossfade: u,
  } = e;
  ((t.projection = new n(
    t.latestValues,
    e["data-framer-portal-id"] ? void 0 : Kr(t.parent),
  )),
    t.projection.setOptions({
      layoutId: s,
      layout: o,
      alwaysMeasureLayout: !!r || (a && Ct(a)),
      visualElement: t,
      animationType: typeof o == "string" ? o : "both",
      initialPromotionConfig: i,
      crossfade: u,
      layoutScroll: l,
      layoutRoot: c,
    }));
}
function Kr(t) {
  if (t) return t.options.allowProjection !== !1 ? t.projection : Kr(t.parent);
}
function Fe(t, { forwardMotionProps: e = !1, type: n } = {}, i, s) {
  i && zu(i);
  const o = n ? n === "svg" : Hn(t),
    r = o ? uc : lc;
  function a(c, u) {
    let h;
    const d = { ...(0, w.useContext)(Ae), ...c, layoutId: pc(c) },
      { isStatic: p } = d,
      m = Qu(c),
      P = r(c, p);
    if (!p && cs) {
      mc(d, i);
      const y = vc(d);
      ((h = y.MeasureLayout),
        (m.visualElement = fc(t, P, d, s, y.ProjectionNode, o)));
    }
    return (0, at.jsxs)(be.Provider, {
      value: m,
      children: [
        h && m.visualElement
          ? (0, at.jsx)(h, { visualElement: m.visualElement, ...d })
          : null,
        rc(t, c, hc(P, m.visualElement, u), P, p, e, o),
      ],
    });
  }
  a.displayName = `motion.${typeof t == "string" ? t : `create(${t.displayName ?? t.name ?? ""})`}`;
  const l = (0, w.forwardRef)(a);
  return ((l[cc] = t), l);
}
function pc({ layoutId: t }) {
  const e = (0, w.useContext)(pn).id;
  return e && t !== void 0 ? e + "-" + t : t;
}
function mc(t, e) {
  (0, w.useContext)(Fr).strict;
}
function vc(t) {
  const { drag: e, layout: n } = _r();
  if (!e && !n) return {};
  const i = { ...e, ...n };
  return {
    MeasureLayout:
      e?.isEnabled(t) || n?.isEnabled(t) ? i.MeasureLayout : void 0,
    ProjectionNode: i.ProjectionNode,
  };
}
function yc(t, e) {
  if (typeof Proxy > "u") return Fe;
  const n = new Map(),
    i = (o, r) => Fe(o, r, t, e),
    s = (o, r) => i(o, r);
  return new Proxy(s, {
    get: (o, r) =>
      r === "create"
        ? i
        : (n.has(r) || n.set(r, Fe(r, void 0, t, e)), n.get(r)),
  });
}
var gc = (t, e) =>
    (e.isSVG ?? Hn(t))
      ? new Gl(e)
      : new $l(e, { allowProjection: t !== w.Fragment }),
  Tc = class extends vt {
    constructor(t) {
      (super(t), t.animationState || (t.animationState = Ql(t)));
    }
    updateAnimationControlsSubscription() {
      const { animate: t } = this.node.getProps();
      Pe(t) && (this.unmountControls = t.subscribe(this.node));
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
  xc = 0,
  wc = class extends vt {
    constructor() {
      (super(...arguments), (this.id = xc++));
    }
    update() {
      if (!this.node.presenceContext) return;
      const { isPresent: t, onExitComplete: e } = this.node.presenceContext,
        { isPresent: n } = this.node.prevPresenceContext || {};
      if (!this.node.animationState || t === n) return;
      const i = this.node.animationState.setActive("exit", !t);
      e &&
        !t &&
        i.then(() => {
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
  Pc = { animation: { Feature: Tc }, exit: { Feature: wc } };
function Qt(t) {
  return { point: { x: t.pageX, y: t.pageY } };
}
var Sc = (t) => (e) => Fn(e) && t(e, Qt(e));
function Ht(t, e, n, i) {
  return Xt(t, e, Sc(n), i);
}
var zr = ({ current: t }) => (t ? t.ownerDocument.defaultView : null),
  Ji = (t, e) => Math.abs(t - e);
function Ac(t, e) {
  const n = Ji(t.x, e.x),
    i = Ji(t.y, e.y);
  return Math.sqrt(n ** 2 + i ** 2);
}
var Qi = new Set(["auto", "scroll"]),
  Yr = class {
    constructor(
      t,
      e,
      {
        transformPagePoint: n,
        contextWindow: i = window,
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
          const h = Oe(this.lastMoveEventInfo, this.history),
            d = this.startEvent !== null,
            p = Ac(h.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
          if (!d && !p) return;
          const { point: m } = h,
            { timestamp: P } = $;
          this.history.push({ ...m, timestamp: P });
          const { onStart: y, onMove: g } = this.handlers;
          (d ||
            (y && y(this.lastMoveEvent, h),
            (this.startEvent = this.lastMoveEvent)),
            g && g(this.lastMoveEvent, h));
        }),
        (this.handlePointerMove = (h, d) => {
          ((this.lastMoveEvent = h),
            (this.lastMoveEventInfo = _e(d, this.transformPagePoint)),
            k.update(this.updatePoint, !0));
        }),
        (this.handlePointerUp = (h, d) => {
          this.end();
          const {
            onEnd: p,
            onSessionEnd: m,
            resumeAnimation: P,
          } = this.handlers;
          if (
            ((this.dragSnapToOrigin || !this.startEvent) && P && P(),
            !(this.lastMoveEvent && this.lastMoveEventInfo))
          )
            return;
          const y = Oe(
            h.type === "pointercancel"
              ? this.lastMoveEventInfo
              : _e(d, this.transformPagePoint),
            this.history,
          );
          (this.startEvent && p && p(h, y), m && m(h, y));
        }),
        !Fn(t))
      )
        return;
      ((this.dragSnapToOrigin = s),
        (this.handlers = e),
        (this.transformPagePoint = n),
        (this.distanceThreshold = o),
        (this.contextWindow = i || window));
      const a = _e(Qt(t), this.transformPagePoint),
        { point: l } = a,
        { timestamp: c } = $;
      this.history = [{ ...l, timestamp: c }];
      const { onSessionStart: u } = e;
      (u && u(t, Oe(a, this.history)),
        (this.removeListeners = qt(
          Ht(this.contextWindow, "pointermove", this.handlePointerMove),
          Ht(this.contextWindow, "pointerup", this.handlePointerUp),
          Ht(this.contextWindow, "pointercancel", this.handlePointerUp),
        )),
        r && this.startScrollTracking(r));
    }
    startScrollTracking(t) {
      let e = t.parentElement;
      for (; e; ) {
        const n = getComputedStyle(e);
        ((Qi.has(n.overflowX) || Qi.has(n.overflowY)) &&
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
      const n = t === window,
        i = n
          ? { x: window.scrollX, y: window.scrollY }
          : { x: t.scrollLeft, y: t.scrollTop },
        s = { x: i.x - e.x, y: i.y - e.y };
      (s.x === 0 && s.y === 0) ||
        (n
          ? this.lastMoveEventInfo &&
            ((this.lastMoveEventInfo.point.x += s.x),
            (this.lastMoveEventInfo.point.y += s.y))
          : this.history.length > 0 &&
            ((this.history[0].x -= s.x), (this.history[0].y -= s.y)),
        this.scrollPositions.set(t, i),
        k.update(this.updatePoint, !0));
    }
    updateHandlers(t) {
      this.handlers = t;
    }
    end() {
      (this.removeListeners && this.removeListeners(),
        this.removeScrollListeners && this.removeScrollListeners(),
        this.scrollPositions.clear(),
        ut(this.updatePoint));
    }
  };
function _e(t, e) {
  return e ? { point: e(t.point) } : t;
}
function ts(t, e) {
  return { x: t.x - e.x, y: t.y - e.y };
}
function Oe({ point: t }, e) {
  return {
    point: t,
    delta: ts(t, Gr(e)),
    offset: ts(t, bc(e)),
    velocity: Cc(e, 0.1),
  };
}
function bc(t) {
  return t[0];
}
function Gr(t) {
  return t[t.length - 1];
}
function Cc(t, e) {
  if (t.length < 2) return { x: 0, y: 0 };
  let n = t.length - 1,
    i = null;
  const s = Gr(t);
  for (; n >= 0 && ((i = t[n]), !(s.timestamp - i.timestamp > tt(e))); ) n--;
  if (!i) return { x: 0, y: 0 };
  i === t[0] &&
    t.length > 2 &&
    s.timestamp - i.timestamp > tt(e) * 2 &&
    (i = t[1]);
  const o = X(s.timestamp - i.timestamp);
  if (o === 0) return { x: 0, y: 0 };
  const r = { x: (s.x - i.x) / o, y: (s.y - i.y) / o };
  return (r.x === 1 / 0 && (r.x = 0), r.y === 1 / 0 && (r.y = 0), r);
}
function Ec(t, { min: e, max: n }, i) {
  return (
    e !== void 0 && t < e
      ? (t = i ? F(e, t, i.min) : Math.max(t, e))
      : n !== void 0 && t > n && (t = i ? F(n, t, i.max) : Math.min(t, n)),
    t
  );
}
function es(t, e, n) {
  return {
    min: e !== void 0 ? t.min + e : void 0,
    max: n !== void 0 ? t.max + n - (t.max - t.min) : void 0,
  };
}
function Vc(t, { top: e, left: n, bottom: i, right: s }) {
  return { x: es(t.x, n, s), y: es(t.y, e, i) };
}
function ns(t, e) {
  let n = e.min - t.min,
    i = e.max - t.max;
  return (
    e.max - e.min < t.max - t.min && ([n, i] = [i, n]),
    { min: n, max: i }
  );
}
function Mc(t, e) {
  return { x: ns(t.x, e.x), y: ns(t.y, e.y) };
}
function Dc(t, e) {
  let n = 0.5;
  const i = z(t),
    s = z(e);
  return (
    s > i
      ? (n = Kt(e.min, e.max - i, t.min))
      : i > s && (n = Kt(t.min, t.max - s, e.min)),
    rt(0, 1, n)
  );
}
function Rc(t, e) {
  const n = {};
  return (
    e.min !== void 0 && (n.min = e.min - t.min),
    e.max !== void 0 && (n.max = e.max - t.min),
    n
  );
}
var hn = 0.35;
function Lc(t = hn) {
  return (
    t === !1 ? (t = 0) : t === !0 && (t = hn),
    { x: is(t, "left", "right"), y: is(t, "top", "bottom") }
  );
}
function is(t, e, n) {
  return { min: ss(t, e), max: ss(t, n) };
}
function ss(t, e) {
  return typeof t == "number" ? t : t[e] || 0;
}
var kc = new WeakMap(),
  Ic = class {
    constructor(t) {
      ((this.openDragLock = null),
        (this.isDragging = !1),
        (this.currentDirection = null),
        (this.originPoint = { x: 0, y: 0 }),
        (this.constraints = !1),
        (this.hasMutatedConstraints = !1),
        (this.elastic = U()),
        (this.latestPointerEvent = null),
        (this.latestPanInfo = null),
        (this.visualElement = t));
    }
    start(t, { snapToCursor: e = !1, distanceThreshold: n } = {}) {
      const { presenceContext: i } = this.visualElement;
      if (i && i.isPresent === !1) return;
      const s = (u) => {
          (e && this.snapToCursor(Qt(u).point), this.stopAnimation());
        },
        o = (u, h) => {
          const {
            drag: d,
            dragPropagation: p,
            onDragStart: m,
          } = this.getProps();
          if (
            d &&
            !p &&
            (this.openDragLock && this.openDragLock(),
            (this.openDragLock = ol(d)),
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
            nt((y) => {
              let g = this.getAxisMotionValue(y).get() || 0;
              if (st.test(g)) {
                const { projection: A } = this.visualElement;
                if (A && A.layout) {
                  const T = A.layout.layoutBox[y];
                  T && (g = z(T) * (parseFloat(g) / 100));
                }
              }
              this.originPoint[y] = g;
            }),
            m && k.update(() => m(u, h), !1, !0),
            nn(this.visualElement, "transform"));
          const { animationState: P } = this.visualElement;
          P && P.setActive("whileDrag", !0);
        },
        r = (u, h) => {
          ((this.latestPointerEvent = u), (this.latestPanInfo = h));
          const {
            dragPropagation: d,
            dragDirectionLock: p,
            onDirectionLock: m,
            onDrag: P,
          } = this.getProps();
          if (!d && !this.openDragLock) return;
          const { offset: y } = h;
          if (p && this.currentDirection === null) {
            ((this.currentDirection = Bc(y)),
              this.currentDirection !== null && m && m(this.currentDirection));
            return;
          }
          (this.updateAxis("x", h.point, y),
            this.updateAxis("y", h.point, y),
            this.visualElement.render(),
            P && k.update(() => P(u, h), !1, !0));
        },
        a = (u, h) => {
          ((this.latestPointerEvent = u),
            (this.latestPanInfo = h),
            this.stop(u, h),
            (this.latestPointerEvent = null),
            (this.latestPanInfo = null));
        },
        l = () => {
          const { dragSnapToOrigin: u } = this.getProps();
          (u || this.constraints) && this.startAnimation({ x: 0, y: 0 });
        },
        { dragSnapToOrigin: c } = this.getProps();
      this.panSession = new Yr(
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
          distanceThreshold: n,
          contextWindow: zr(this.visualElement),
          element: this.visualElement.current,
        },
      );
    }
    stop(t, e) {
      const n = t || this.latestPointerEvent,
        i = e || this.latestPanInfo,
        s = this.isDragging;
      if ((this.cancel(), !s || !i || !n)) return;
      const { velocity: o } = i;
      this.startAnimation(o);
      const { onDragEnd: r } = this.getProps();
      r && k.postRender(() => r(n, i));
    }
    cancel() {
      this.isDragging = !1;
      const { projection: t, animationState: e } = this.visualElement;
      (t && (t.isAnimationBlocked = !1), this.endPanSession());
      const { dragPropagation: n } = this.getProps();
      (!n &&
        this.openDragLock &&
        (this.openDragLock(), (this.openDragLock = null)),
        e && e.setActive("whileDrag", !1));
    }
    endPanSession() {
      (this.panSession && this.panSession.end(), (this.panSession = void 0));
    }
    updateAxis(t, e, n) {
      const { drag: i } = this.getProps();
      if (!n || !se(t, i, this.currentDirection)) return;
      const s = this.getAxisMotionValue(t);
      let o = this.originPoint[t] + n[t];
      (this.constraints &&
        this.constraints[t] &&
        (o = Ec(o, this.constraints[t], this.elastic[t])),
        s.set(o));
    }
    resolveConstraints() {
      const { dragConstraints: t, dragElastic: e } = this.getProps(),
        n =
          this.visualElement.projection && !this.visualElement.projection.layout
            ? this.visualElement.projection.measure(!1)
            : this.visualElement.projection?.layout,
        i = this.constraints;
      (t && Ct(t)
        ? this.constraints || (this.constraints = this.resolveRefConstraints())
        : t && n
          ? (this.constraints = Vc(n.layoutBox, t))
          : (this.constraints = !1),
        (this.elastic = Lc(e)),
        i !== this.constraints &&
          !Ct(t) &&
          n &&
          this.constraints &&
          !this.hasMutatedConstraints &&
          nt((s) => {
            this.constraints !== !1 &&
              this.getAxisMotionValue(s) &&
              (this.constraints[s] = Rc(n.layoutBox[s], this.constraints[s]));
          }));
    }
    resolveRefConstraints() {
      const { dragConstraints: t, onMeasureDragConstraints: e } =
        this.getProps();
      if (!t || !Ct(t)) return !1;
      const n = t.current;
      pt(
        n !== null,
        "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.",
        "drag-constraints-ref",
      );
      const { projection: i } = this.visualElement;
      if (!i || !i.layout) return !1;
      const s = Bl(n, i.root, this.visualElement.getTransformPagePoint());
      let o = Mc(i.layout.layoutBox, s);
      if (e) {
        const r = e(kl(o));
        ((this.hasMutatedConstraints = !!r), r && (o = pr(r)));
      }
      return o;
    }
    startAnimation(t) {
      const {
          drag: e,
          dragMomentum: n,
          dragElastic: i,
          dragTransition: s,
          dragSnapToOrigin: o,
          onDragTransitionEnd: r,
        } = this.getProps(),
        a = this.constraints || {},
        l = nt((c) => {
          if (!se(c, e, this.currentDirection)) return;
          let u = (a && a[c]) || {};
          o && (u = { min: 0, max: 0 });
          const h = i ? 200 : 1e6,
            d = i ? 40 : 1e7,
            p = {
              type: "inertia",
              velocity: n ? t[c] : 0,
              bounceStiffness: h,
              bounceDamping: d,
              timeConstant: 750,
              restDelta: 1,
              restSpeed: 10,
              ...s,
              ...u,
            };
          return this.startAxisValueAnimation(c, p);
        });
      return Promise.all(l).then(r);
    }
    startAxisValueAnimation(t, e) {
      const n = this.getAxisMotionValue(t);
      return (
        nn(this.visualElement, t),
        n.start(Rn(t, n, 0, e, this.visualElement, !1))
      );
    }
    stopAnimation() {
      nt((t) => this.getAxisMotionValue(t).stop());
    }
    getAxisMotionValue(t) {
      const e = `_drag${t.toUpperCase()}`,
        n = this.visualElement.getProps(),
        i = n[e];
      return (
        i ||
        this.visualElement.getValue(t, (n.initial ? n.initial[t] : void 0) || 0)
      );
    }
    snapToCursor(t) {
      nt((e) => {
        const { drag: n } = this.getProps();
        if (!se(e, n, this.currentDirection)) return;
        const { projection: i } = this.visualElement,
          s = this.getAxisMotionValue(e);
        if (i && i.layout) {
          const { min: o, max: r } = i.layout.layoutBox[e],
            a = s.get() || 0;
          s.set(t[e] - F(o, r, 0.5) + a);
        }
      });
    }
    scalePositionWithinConstraints() {
      if (!this.visualElement.current) return;
      const { drag: t, dragConstraints: e } = this.getProps(),
        { projection: n } = this.visualElement;
      if (!Ct(e) || !n || !this.constraints) return;
      this.stopAnimation();
      const i = { x: 0, y: 0 };
      nt((o) => {
        const r = this.getAxisMotionValue(o);
        if (r && this.constraints !== !1) {
          const a = r.get();
          i[o] = Dc({ min: a, max: a }, this.constraints[o]);
        }
      });
      const { transformTemplate: s } = this.visualElement.getProps();
      ((this.visualElement.current.style.transform = s ? s({}, "") : "none"),
        n.root && n.root.updateScroll(),
        n.updateLayout(),
        (this.constraints = !1),
        this.resolveConstraints(),
        nt((o) => {
          if (!se(o, t, null)) return;
          const r = this.getAxisMotionValue(o),
            { min: a, max: l } = this.constraints[o];
          r.set(F(a, l, i[o]));
        }),
        this.visualElement.render());
    }
    addListeners() {
      if (!this.visualElement.current) return;
      kc.set(this.visualElement, this);
      const t = this.visualElement.current,
        e = Ht(t, "pointerdown", (l) => {
          const { drag: c, dragListener: u = !0 } = this.getProps(),
            h = l.target,
            d = h !== t && fl(h);
          c && u && !d && this.start(l);
        });
      let n;
      const i = () => {
          const { dragConstraints: l } = this.getProps();
          Ct(l) &&
            l.current &&
            ((this.constraints = this.resolveRefConstraints()),
            n ||
              (n = jc(t, l.current, () =>
                this.scalePositionWithinConstraints(),
              )));
        },
        { projection: s } = this.visualElement,
        o = s.addEventListener("measure", i);
      (s && !s.layout && (s.root && s.root.updateScroll(), s.updateLayout()),
        k.read(i));
      const r = Xt(window, "resize", () =>
          this.scalePositionWithinConstraints(),
        ),
        a = s.addEventListener(
          "didUpdate",
          ({ delta: l, hasLayoutChanged: c }) => {
            this.isDragging &&
              c &&
              (nt((u) => {
                const h = this.getAxisMotionValue(u);
                h &&
                  ((this.originPoint[u] += l[u].translate),
                  h.set(h.get() + l[u].translate));
              }),
              this.visualElement.render());
          },
        );
      return () => {
        (r(), e(), o(), a && a(), n && n());
      };
    }
    getProps() {
      const t = this.visualElement.getProps(),
        {
          drag: e = !1,
          dragDirectionLock: n = !1,
          dragPropagation: i = !1,
          dragConstraints: s = !1,
          dragElastic: o = hn,
          dragMomentum: r = !0,
        } = t;
      return {
        ...t,
        drag: e,
        dragDirectionLock: n,
        dragPropagation: i,
        dragConstraints: s,
        dragElastic: o,
        dragMomentum: r,
      };
    }
  };
function rs(t) {
  let e = !0;
  return () => {
    if (e) {
      e = !1;
      return;
    }
    t();
  };
}
function jc(t, e, n) {
  const i = fi(t, rs(n)),
    s = fi(e, rs(n));
  return () => {
    (i(), s());
  };
}
function se(t, e, n) {
  return (e === !0 || e === t) && (n === null || n === t);
}
function Bc(t, e = 10) {
  let n = null;
  return (Math.abs(t.y) > e ? (n = "y") : Math.abs(t.x) > e && (n = "x"), n);
}
var Fc = class extends vt {
    constructor(t) {
      (super(t),
        (this.removeGroupControls = q),
        (this.removeListeners = q),
        (this.controls = new Ic(t)));
    }
    mount() {
      const { dragControls: t } = this.node.getProps();
      (t && (this.removeGroupControls = t.subscribe(this.controls)),
        (this.removeListeners = this.controls.addListeners() || q));
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
  Ne = (t) => (e, n) => {
    t && k.update(() => t(e, n), !1, !0);
  },
  _c = class extends vt {
    constructor() {
      (super(...arguments), (this.removePointerDownListener = q));
    }
    onPointerDown(t) {
      this.session = new Yr(t, this.createPanHandlers(), {
        transformPagePoint: this.node.getTransformPagePoint(),
        contextWindow: zr(this.node),
      });
    }
    createPanHandlers() {
      const {
        onPanSessionStart: t,
        onPanStart: e,
        onPan: n,
        onPanEnd: i,
      } = this.node.getProps();
      return {
        onSessionStart: Ne(t),
        onStart: Ne(e),
        onMove: Ne(n),
        onEnd: (s, o) => {
          (delete this.session, i && k.postRender(() => i(s, o)));
        },
      };
    }
    mount() {
      this.removePointerDownListener = Ht(
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
  Ue = !1,
  Oc = class extends w.Component {
    componentDidMount() {
      const {
          visualElement: t,
          layoutGroup: e,
          switchLayoutGroup: n,
          layoutId: i,
        } = this.props,
        { projection: s } = t;
      (s &&
        (e.group && e.group.add(s),
        n && n.register && i && n.register(s),
        Ue && s.root.didUpdate(),
        s.addEventListener("animationComplete", () => {
          this.safeToRemove();
        }),
        s.setOptions({
          ...s.options,
          layoutDependency: this.props.layoutDependency,
          onExitComplete: () => this.safeToRemove(),
        })),
        (he.hasEverUpdated = !0));
    }
    getSnapshotBeforeUpdate(t) {
      const {
          layoutDependency: e,
          visualElement: n,
          drag: i,
          isPresent: s,
        } = this.props,
        { projection: o } = n;
      return (
        o &&
          ((o.isPresent = s),
          t.layoutDependency !== e &&
            o.setOptions({ ...o.options, layoutDependency: e }),
          (Ue = !0),
          i || t.layoutDependency !== e || e === void 0 || t.isPresent !== s
            ? o.willUpdate()
            : this.safeToRemove(),
          t.isPresent !== s &&
            (s
              ? o.promote()
              : o.relegate() ||
                k.postRender(() => {
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
        Bn.postRender(() => {
          !t.currentAnimation && t.isLead() && this.safeToRemove();
        }));
    }
    componentWillUnmount() {
      const {
          visualElement: t,
          layoutGroup: e,
          switchLayoutGroup: n,
        } = this.props,
        { projection: i } = t;
      ((Ue = !0),
        i &&
          (i.scheduleCheckAfterUnmount(),
          e && e.group && e.group.remove(i),
          n && n.deregister && n.deregister(i)));
    }
    safeToRemove() {
      const { safeToRemove: t } = this.props;
      t && t();
    }
    render() {
      return null;
    }
  };
function Xr(t) {
  const [e, n] = Br(),
    i = (0, w.useContext)(pn);
  return (0, at.jsx)(Oc, {
    ...t,
    layoutGroup: i,
    switchLayoutGroup: (0, w.useContext)(Hr),
    isPresent: e,
    safeToRemove: n,
  });
}
var Nc = {
  pan: { Feature: _c },
  drag: { Feature: Fc, ProjectionNode: jr, MeasureLayout: Xr },
};
function os(t, e, n) {
  const { props: i } = t;
  t.animationState &&
    i.whileHover &&
    t.animationState.setActive("whileHover", n === "Start");
  const s = i["onHover" + n];
  s && k.postRender(() => s(e, Qt(e)));
}
var Uc = class extends vt {
    mount() {
      const { current: t } = this.node;
      t &&
        (this.unmount = ll(
          t,
          (e, n) => (os(this.node, n, "Start"), (i) => os(this.node, i, "End")),
        ));
    }
    unmount() {}
  },
  $c = class extends vt {
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
      this.unmount = qt(
        Xt(this.node.current, "focus", () => this.onFocus()),
        Xt(this.node.current, "blur", () => this.onBlur()),
      );
    }
    unmount() {}
  };
function as(t, e, n) {
  const { props: i } = t;
  if (t.current instanceof HTMLButtonElement && t.current.disabled) return;
  t.animationState &&
    i.whileTap &&
    t.animationState.setActive("whileTap", n === "Start");
  const s = i["onTap" + (n === "End" ? "" : n)];
  s && k.postRender(() => s(e, Qt(e)));
}
var Wc = class extends vt {
    mount() {
      const { current: t } = this.node;
      if (!t) return;
      const { globalTapTarget: e, propagate: n } = this.node.props;
      this.unmount = pl(
        t,
        (i, s) => (
          as(this.node, s, "Start"),
          (o, { success: r }) => as(this.node, o, r ? "End" : "Cancel")
        ),
        { useGlobalTarget: e, stopPropagation: n?.tap === !1 },
      );
    }
    unmount() {}
  },
  fn = new WeakMap(),
  $e = new WeakMap(),
  Hc = (t) => {
    const e = fn.get(t.target);
    e && e(t);
  },
  Kc = (t) => {
    t.forEach(Hc);
  };
function zc({ root: t, ...e }) {
  const n = t || document;
  $e.has(n) || $e.set(n, {});
  const i = $e.get(n),
    s = JSON.stringify(e);
  return (
    i[s] || (i[s] = new IntersectionObserver(Kc, { root: t, ...e })),
    i[s]
  );
}
function Yc(t, e, n) {
  const i = zc(e);
  return (
    fn.set(t, n),
    i.observe(t),
    () => {
      (fn.delete(t), i.unobserve(t));
    }
  );
}
var Gc = { some: 0, all: 1 },
  Xc = class extends vt {
    constructor() {
      (super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1));
    }
    startObserver() {
      this.unmount();
      const { viewport: t = {} } = this.node.getProps(),
        { root: e, margin: n, amount: i = "some", once: s } = t,
        o = {
          root: e ? e.current : void 0,
          rootMargin: n,
          threshold: typeof i == "number" ? i : Gc[i],
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
      return Yc(this.node.current, o, r);
    }
    mount() {
      this.startObserver();
    }
    update() {
      if (typeof IntersectionObserver > "u") return;
      const { props: t, prevProps: e } = this.node;
      ["amount", "margin", "root"].some(qc(t, e)) && this.startObserver();
    }
    unmount() {}
  };
function qc({ viewport: t = {} }, { viewport: e = {} } = {}) {
  return (n) => t[n] !== e[n];
}
var Zc = {
    inView: { Feature: Xc },
    tap: { Feature: Wc },
    focus: { Feature: $c },
    hover: { Feature: Uc },
  },
  Jc = { layout: { ProjectionNode: jr, MeasureLayout: Xr } },
  Qc = { ...Pc, ...Zc, ...Nc, ...Jc },
  fh = yc(Qc, gc);
function th(t) {
  const e = dt(() => At(t)),
    { isStatic: n } = (0, w.useContext)(Ae);
  if (n) {
    const [, i] = (0, w.useState)(t);
    (0, w.useEffect)(() => e.on("change", i), []);
  }
  return e;
}
function qr(t, e) {
  const n = th(e()),
    i = () => n.set(e());
  return (
    i(),
    Te(() => {
      const s = () => k.preRender(i, !1, !0),
        o = t.map((r) => r.on("change", s));
      return () => {
        (o.forEach((r) => r()), ut(i));
      };
    }),
    n
  );
}
function eh(t) {
  (($t.current = []), t());
  const e = qr($t.current, t);
  return (($t.current = void 0), e);
}
function nh(t, e, n, i) {
  if (typeof t == "function") return eh(t);
  if (n !== void 0 && !Array.isArray(n) && typeof e != "function")
    return ih(t, e, n, i);
  const s = typeof e == "function" ? e : Al(e, n, i);
  return Array.isArray(t) ? ls(t, s) : ls([t], ([o]) => s(o));
}
function ls(t, e) {
  const n = dt(() => []);
  return qr(t, () => {
    n.length = 0;
    const i = t.length;
    for (let s = 0; s < i; s++) n[s] = t[s].get();
    return e(n);
  });
}
function ih(t, e, n, i) {
  const s = dt(() => Object.keys(n)),
    o = dt(() => ({}));
  for (const r of s) o[r] = nh(t, e, n[r], i);
  return o;
}
function sh(t) {
  t.values.forEach((e) => e.stop());
}
function dn(t, e) {
  [...e].reverse().forEach((n) => {
    const i = t.getVariant(n);
    (i && kn(t, i),
      t.variantChildren &&
        t.variantChildren.forEach((s) => {
          dn(s, e);
        }));
  });
}
function rh(t, e) {
  if (Array.isArray(e)) return dn(t, e);
  if (typeof e == "string") return dn(t, [e]);
  kn(t, e);
}
function oh() {
  let t = !1;
  const e = new Set(),
    n = {
      subscribe(i) {
        return (
          e.add(i),
          () => {
            e.delete(i);
          }
        );
      },
      start(i, s) {
        pt(
          t,
          "controls.start() should only be called after a component has mounted. Consider calling within a useEffect hook.",
        );
        const o = [];
        return (
          e.forEach((r) => {
            o.push(Qs(r, i, { transitionOverride: s }));
          }),
          Promise.all(o)
        );
      },
      set(i) {
        return (
          pt(
            t,
            "controls.set() should only be called after a component has mounted. Consider calling within a useEffect hook.",
          ),
          e.forEach((s) => {
            rh(s, i);
          })
        );
      },
      stop() {
        e.forEach((i) => {
          sh(i);
        });
      },
      mount() {
        return (
          (t = !0),
          () => {
            ((t = !1), n.stop());
          }
        );
      },
    };
  return n;
}
function ah() {
  const t = dt(oh);
  return (Te(t.mount, []), t);
}
var dh = ah;
export { hh as a, fh as i, nh as n, ro as o, th as r, io as s, dh as t };
