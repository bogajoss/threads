const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/VideoPlayer-Mxs0V9Sv.js",
      "assets/framework-di2JoXyY.js",
      "assets/database-CdmW3A7f.js",
      "assets/animations-pEILWrFP.js",
      "assets/rolldown-runtime-BaZ8gS7u.js",
      "assets/framework-sg0yWRLc.css",
      "assets/media-libs-D2H42K39.js",
      "assets/media-libs-CqCaMccn.css",
      "assets/VideoPlayer-D5zTel2q.js",
      "assets/index-ZcVyY9rV.js",
      "assets/ui-libs-yzUERV1o.js",
      "assets/query-CXZjka15.js",
      "assets/index-DwjlrYQu.css",
      "assets/dist-CXJwIUEX.js",
    ]),
) => i.map((i) => d[i]);
import { a as ot } from "./rolldown-runtime-BaZ8gS7u.js";
import { o as wt, s as Ct } from "./animations-pEILWrFP.js";
import {
  _ as ae,
  b as ct,
  c as B,
  n as $t,
  u as _t,
} from "./framework-di2JoXyY.js";
import { r as St } from "./query-CXZjka15.js";
import {
  Bn as Ft,
  En as fe,
  Fn as Pt,
  In as Tt,
  It as Mt,
  Jn as It,
  Ln as Rt,
  Lt as Et,
  Mn as Dt,
  Nn as Ae,
  On as Le,
  Rn as be,
  Un as At,
  Xt as Lt,
  Zt as Ot,
  _n as Ut,
  an as Wt,
  bn as Bt,
  en as je,
  er as Vt,
  hn as dt,
  kt as le,
  ln as qt,
  nn as Ht,
  pn as Gt,
  rn as Jt,
  sn as Qt,
  tn as Xt,
  zt as Kt,
} from "./ui-libs-yzUERV1o.js";
import {
  $ as Zt,
  Ct as Yt,
  D as es,
  Dt as mt,
  J as xt,
  Jt as ts,
  Kt as ss,
  O as is,
  Ot as ls,
  Q as as,
  Qt as ns,
  S as rs,
  St as os,
  Vt as Oe,
  Wt as cs,
  Yt as ds,
  Zt as ms,
  _n as H,
  _t as Ue,
  an as We,
  bn as Be,
  cn as xs,
  dt as Z,
  et as Ve,
  f as fs,
  ft as qe,
  g as hs,
  gn as ze,
  gt as He,
  hn as us,
  ht as Ge,
  l as ft,
  ln as ps,
  lt as Y,
  mt as Je,
  nt as gs,
  p as vs,
  pt as Qe,
  rn as bs,
  rt as js,
  sn as zs,
  tt as ie,
  u as ks,
  ut as ee,
  v as he,
  vn as xe,
  vt as Xe,
  wt as Ne,
  xt as Ns,
  y as ys,
  yt as Ke,
} from "./index-ZcVyY9rV.js";
import { t as ye } from "./text-processing-C3TjCoM3.js";
import { t as we } from "./linkify-FEcu8M-7.js";
import { p as ws, u as Ze } from "./hooks-WavgvGBm.js";
var Cs = B(),
  N = ot(Ct(), 1),
  t = ot(wt(), 1),
  $s = (i) => {
    const e = (0, Cs.c)(37),
      {
        isComment: s,
        liked: r,
        reposted: l,
        handleLike: a,
        handleRepost: n,
        handleCommentClick: d,
        handleShareClick: c,
        isDetail: g,
      } = i;
    if (g !== void 0 && g) {
      let k;
      e[0] !== a || e[1] !== r
        ? ((k = (0, t.jsx)(G, {
            icon: fe,
            label: "Like",
            type: "like",
            onClick: a,
            active: r,
          })),
          (e[0] = a),
          (e[1] = r),
          (e[2] = k))
        : (k = e[2]);
      let j;
      e[3] !== n || e[4] !== s || e[5] !== l
        ? ((j =
            !s &&
            (0, t.jsx)(G, {
              icon: je,
              label: "Repost",
              type: "repost",
              onClick: n,
              active: l,
            })),
          (e[3] = n),
          (e[4] = s),
          (e[5] = l),
          (e[6] = j))
        : (j = e[6]);
      let z;
      e[7] !== d
        ? ((z = (0, t.jsx)(G, {
            icon: ft,
            label: "Comment",
            type: "comment",
            onClick: d,
          })),
          (e[7] = d),
          (e[8] = z))
        : (z = e[8]);
      let o;
      e[9] !== c || e[10] !== s
        ? ((o =
            !s &&
            (0, t.jsx)(G, {
              icon: he,
              label: "Share",
              type: "share",
              onClick: c,
            })),
          (e[9] = c),
          (e[10] = s),
          (e[11] = o))
        : (o = e[11]);
      let $;
      return (
        e[12] !== k || e[13] !== j || e[14] !== z || e[15] !== o
          ? (($ = (0, t.jsxs)("div", {
              className: "mt-4 flex w-full items-center justify-around py-1",
              children: [k, j, z, o],
            })),
            (e[12] = k),
            (e[13] = j),
            (e[14] = z),
            (e[15] = o),
            (e[16] = $))
          : ($ = e[16]),
        $
      );
    }
    const p = `flex items-center gap-x-1 ${s ? "mt-1.5" : "mt-3"}`,
      f = s ? 16 : 18;
    let u;
    e[17] !== a || e[18] !== r || e[19] !== f
      ? ((u = (0, t.jsx)(G, {
          icon: fe,
          size: f,
          type: "like",
          onClick: a,
          active: r,
        })),
        (e[17] = a),
        (e[18] = r),
        (e[19] = f),
        (e[20] = u))
      : (u = e[20]);
    const b = s ? 16 : 18;
    let h;
    e[21] !== d || e[22] !== b
      ? ((h = (0, t.jsx)(G, {
          icon: dt,
          size: b,
          type: "comment",
          onClick: d,
        })),
        (e[21] = d),
        (e[22] = b),
        (e[23] = h))
      : (h = e[23]);
    const x = s ? 16 : 18;
    let v;
    e[24] !== n || e[25] !== l || e[26] !== x
      ? ((v = (0, t.jsx)(G, {
          icon: je,
          size: x,
          type: "repost",
          onClick: n,
          active: l,
        })),
        (e[24] = n),
        (e[25] = l),
        (e[26] = x),
        (e[27] = v))
      : (v = e[27]);
    let m;
    e[28] !== c || e[29] !== s
      ? ((m =
          !s && c && (0, t.jsx)(G, { icon: he, type: "share", onClick: c })),
        (e[28] = c),
        (e[29] = s),
        (e[30] = m))
      : (m = e[30]);
    let w;
    return (
      e[31] !== p || e[32] !== u || e[33] !== h || e[34] !== v || e[35] !== m
        ? ((w = (0, t.jsxs)("div", { className: p, children: [u, h, v, m] })),
          (e[31] = p),
          (e[32] = u),
          (e[33] = h),
          (e[34] = v),
          (e[35] = m),
          (e[36] = w))
        : (w = e[36]),
      w
    );
  },
  Ye = $s,
  _s = B(),
  Ss = (i) => {
    const e = (0, _s.c)(38),
      {
        views: s,
        likes: r,
        comments: l,
        isDetail: a,
        isComment: n,
        onRepliesClick: d,
      } = i,
      c = a === void 0 ? !1 : a,
      g = n === void 0 ? !1 : n;
    if (c) {
      const v = s || 0;
      let m;
      e[0] !== v
        ? ((m = (0, t.jsx)("span", {
            className: "font-bold text-black dark:text-white",
            children: v,
          })),
          (e[0] = v),
          (e[1] = m))
        : (m = e[1]);
      let w;
      e[2] === Symbol.for("react.memo_cache_sentinel")
        ? ((w = (0, t.jsx)("span", {
            className: "opacity-70",
            children: "Views",
          })),
          (e[2] = w))
        : (w = e[2]);
      let k;
      e[3] !== m
        ? ((k = (0, t.jsxs)("div", {
            className: "flex items-center gap-x-1",
            children: [m, " ", w],
          })),
          (e[3] = m),
          (e[4] = k))
        : (k = e[4]);
      const j = r || 0;
      let z;
      e[5] !== j
        ? ((z = (0, t.jsx)("span", {
            className: "font-bold text-black dark:text-white",
            children: j,
          })),
          (e[5] = j),
          (e[6] = z))
        : (z = e[6]);
      let o;
      e[7] === Symbol.for("react.memo_cache_sentinel")
        ? ((o = (0, t.jsx)("span", {
            className: "opacity-70",
            children: "Likes",
          })),
          (e[7] = o))
        : (o = e[7]);
      let $;
      e[8] !== z
        ? (($ = (0, t.jsxs)("div", {
            className: "flex items-center gap-x-1",
            children: [z, " ", o],
          })),
          (e[8] = z),
          (e[9] = $))
        : ($ = e[9]);
      const S = l || 0;
      let T;
      e[10] !== S
        ? ((T = (0, t.jsx)("span", {
            className: "font-bold text-black dark:text-white",
            children: S,
          })),
          (e[10] = S),
          (e[11] = T))
        : (T = e[11]);
      let P;
      e[12] === Symbol.for("react.memo_cache_sentinel")
        ? ((P = (0, t.jsx)("span", {
            className: "opacity-70",
            children: "Comments",
          })),
          (e[12] = P))
        : (P = e[12]);
      let C;
      e[13] !== T
        ? ((C = (0, t.jsxs)("div", {
            className: "flex items-center gap-x-1",
            children: [T, " ", P],
          })),
          (e[13] = T),
          (e[14] = C))
        : (C = e[14]);
      let M;
      return (
        e[15] !== $ || e[16] !== C || e[17] !== k
          ? ((M = (0, t.jsxs)("div", {
              className:
                "mt-4 flex items-center gap-x-6 border-b border-zinc-100 pb-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400",
              children: [k, $, C],
            })),
            (e[15] = $),
            (e[16] = C),
            (e[17] = k),
            (e[18] = M))
          : (M = e[18]),
        M
      );
    }
    if (l === 0 && r === 0 && (s === 0 || g)) return null;
    const p = `mt-1 flex items-center gap-x-1.5 px-0.5 ${g ? "text-[12px]" : "text-[14px]"} font-medium text-zinc-500 dark:text-zinc-400`;
    let f;
    e[19] !== l || e[20] !== g || e[21] !== r || e[22] !== s
      ? ((f =
          s > 0 &&
          !g &&
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsxs)("span", {
                className: "hover:underline",
                children: [s, " ", s === 1 ? "view" : "views"],
              }),
              (l > 0 || r > 0) &&
                (0, t.jsx)("span", { className: "opacity-50", children: "·" }),
            ],
          })),
        (e[19] = l),
        (e[20] = g),
        (e[21] = r),
        (e[22] = s),
        (e[23] = f))
      : (f = e[23]);
    let u;
    e[24] !== l || e[25] !== d
      ? ((u =
          l > 0 &&
          (0, t.jsxs)("button", {
            className: "hover:underline",
            onClick: (v) => {
              (v.stopPropagation(), d && d(v));
            },
            children: [l, " ", l === 1 ? "reply" : "replies"],
          })),
        (e[24] = l),
        (e[25] = d),
        (e[26] = u))
      : (u = e[26]);
    let b;
    e[27] !== l || e[28] !== r
      ? ((b =
          l > 0 &&
          r > 0 &&
          (0, t.jsx)("span", { className: "opacity-50", children: "·" })),
        (e[27] = l),
        (e[28] = r),
        (e[29] = b))
      : (b = e[29]);
    let h;
    e[30] !== r
      ? ((h =
          r > 0 &&
          (0, t.jsxs)("button", {
            className: "hover:underline",
            children: [r, " ", r === 1 ? "like" : "likes"],
          })),
        (e[30] = r),
        (e[31] = h))
      : (h = e[31]);
    let x;
    return (
      e[32] !== p || e[33] !== f || e[34] !== u || e[35] !== b || e[36] !== h
        ? ((x = (0, t.jsxs)("div", { className: p, children: [f, u, b, h] })),
          (e[32] = p),
          (e[33] = f),
          (e[34] = u),
          (e[35] = b),
          (e[36] = h),
          (e[37] = x))
        : (x = e[37]),
      x
    );
  },
  et = Ss,
  Fs = B(),
  Ps = (i) => {
    const e = (0, Fs.c)(43),
      {
        user: s,
        timeAgo: r,
        community: l,
        onUserClick: a,
        actionsMenu: n,
        isComment: d,
        isDetail: c,
        showAvatar: g,
      } = i,
      p = g === void 0 ? !1 : g,
      f = ae();
    let u;
    e[0] !== a || e[1] !== s.handle
      ? ((u = (I) => {
          (I.stopPropagation(), a && a(s.handle));
        }),
        (e[0] = a),
        (e[1] = s.handle),
        (e[2] = u))
      : (u = e[2]);
    const b = u;
    let h;
    e[3] !== l || e[4] !== f
      ? ((h = (I) => {
          (I.stopPropagation(), l && f(`/c/${l.handle}`));
        }),
        (e[3] = l),
        (e[4] = f),
        (e[5] = h))
      : (h = e[5]);
    const x = h,
      v = `flex items-center justify-between ${c ? "pb-4" : "min-h-[40px] mb-1"}`;
    let m;
    e[6] !== b ||
    e[7] !== d ||
    e[8] !== c ||
    e[9] !== p ||
    e[10] !== s.avatar ||
    e[11] !== s.handle
      ? ((m =
          p &&
          (0, t.jsx)("button", {
            className: "shrink-0",
            onClick: b,
            children: (0, t.jsxs)(Y, {
              className: `${c ? "size-12" : d ? "size-8" : "size-10"} border-0 shadow-sm`,
              children: [
                (0, t.jsx)(Z, {
                  src: s.avatar,
                  alt: s.handle,
                  className: "object-cover",
                }),
                (0, t.jsx)(ee, {
                  className: "text-xs",
                  children: s.handle[0]?.toUpperCase(),
                }),
              ],
            }),
          })),
        (e[6] = b),
        (e[7] = d),
        (e[8] = c),
        (e[9] = p),
        (e[10] = s.avatar),
        (e[11] = s.handle),
        (e[12] = m))
      : (m = e[12]);
    const w = `flex shrink-0 items-center gap-1 font-bold text-zinc-900 hover:underline dark:text-white ${c ? "text-base sm:text-lg" : d ? "text-[14px]" : "text-[15px]"}`;
    let k;
    e[13] !== s.handle
      ? ((k = (0, t.jsx)("span", {
          className: "max-w-[150px] truncate sm:max-w-none",
          children: s.handle,
        })),
        (e[13] = s.handle),
        (e[14] = k))
      : (k = e[14]);
    let j;
    e[15] !== d || e[16] !== c || e[17] !== s.verified
      ? ((j =
          s.verified &&
          (0, t.jsx)(ys, {
            size: c ? 16 : d ? 12 : 14,
            className: "text-blue-500",
          })),
        (e[15] = d),
        (e[16] = c),
        (e[17] = s.verified),
        (e[18] = j))
      : (j = e[18]);
    let z;
    e[19] !== b || e[20] !== w || e[21] !== k || e[22] !== j
      ? ((z = (0, t.jsxs)("button", {
          className: w,
          onClick: b,
          children: [k, j],
        })),
        (e[19] = b),
        (e[20] = w),
        (e[21] = k),
        (e[22] = j),
        (e[23] = z))
      : (z = e[23]);
    let o;
    e[24] !== l || e[25] !== x || e[26] !== c
      ? ((o =
          l &&
          (0, t.jsxs)("div", {
            className: "flex min-w-0 items-center gap-1 text-zinc-500",
            children: [
              (0, t.jsx)(ks, {
                size: c ? 14 : 12,
                className: "shrink-0 text-zinc-400",
              }),
              (0, t.jsxs)("button", {
                className: `flex items-center gap-1 font-bold text-zinc-900 hover:underline dark:text-zinc-100 ${c ? "text-[14px] sm:text-[15px]" : "text-[13px]"}`,
                onClick: x,
                children: [
                  (0, t.jsxs)(Y, {
                    className:
                      "size-3.5 shrink-0 border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800",
                    children: [
                      (0, t.jsx)(Z, {
                        src: l.avatar,
                        alt: l.name,
                        className: "object-cover",
                      }),
                      (0, t.jsx)(ee, {
                        className: "text-[6px] font-bold text-zinc-500",
                        children: l.name?.[0]?.toUpperCase(),
                      }),
                    ],
                  }),
                  (0, t.jsx)("span", {
                    className: "max-w-[150px] truncate sm:max-w-none",
                    children: l.name,
                  }),
                ],
              }),
            ],
          })),
        (e[24] = l),
        (e[25] = x),
        (e[26] = c),
        (e[27] = o))
      : (o = e[27]);
    let $;
    e[28] !== o || e[29] !== z
      ? (($ = (0, t.jsx)("div", {
          className: "flex min-w-0 flex-1 flex-col",
          children: (0, t.jsx)("div", {
            className: "flex flex-wrap items-center gap-x-1.5 leading-none",
            children: (0, t.jsxs)("div", {
              className: "flex min-w-0 max-w-full items-center gap-1.5",
              children: [z, o],
            }),
          }),
        })),
        (e[28] = o),
        (e[29] = z),
        (e[30] = $))
      : ($ = e[30]);
    let S;
    e[31] !== $ || e[32] !== m
      ? ((S = (0, t.jsxs)("div", {
          className: "flex items-center gap-x-3 flex-1 min-w-0",
          children: [m, $],
        })),
        (e[31] = $),
        (e[32] = m),
        (e[33] = S))
      : (S = e[33]);
    const T = r || "Recent";
    let P;
    e[34] !== T
      ? ((P = (0, t.jsx)("span", {
          className:
            "whitespace-nowrap text-[12px] text-zinc-500 dark:text-zinc-400",
          children: T,
        })),
        (e[34] = T),
        (e[35] = P))
      : (P = e[35]);
    let C;
    e[36] !== n || e[37] !== P
      ? ((C = (0, t.jsxs)("div", {
          className: "-mt-1 flex items-center gap-2",
          children: [P, n],
        })),
        (e[36] = n),
        (e[37] = P),
        (e[38] = C))
      : (C = e[38]);
    let M;
    return (
      e[39] !== S || e[40] !== C || e[41] !== v
        ? ((M = (0, t.jsxs)("div", { className: v, children: [S, C] })),
          (e[39] = S),
          (e[40] = C),
          (e[41] = v),
          (e[42] = M))
        : (M = e[42]),
      M
    );
  },
  tt = Ps,
  Ts = B(),
  Ms = (i) => {
    const e = (0, Ts.c)(45),
      {
        content: s,
        isDetail: r,
        isEditing: l,
        editedContent: a,
        setEditedContent: n,
        onCancelEdit: d,
        onSaveEdit: c,
        isUpdating: g,
        contentClass: p,
      } = i,
      f = ae(),
      [u, b] = (0, N.useState)(!1),
      h = typeof s == "string" && Be(s);
    if (l && n) {
      let C;
      e[0] !== n
        ? ((C = (R) => n(R.target.value)), (e[0] = n), (e[1] = C))
        : (C = e[1]);
      const M = `min-h-[100px] w-full rounded-xl border-zinc-200 bg-zinc-50 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900 ${Be(a || "") ? "font-bangla text-lg" : "font-english"}`;
      let I;
      e[2] !== a || e[3] !== C || e[4] !== M
        ? ((I = (0, t.jsx)(rs, {
            value: a,
            onChange: C,
            className: M,
            autoFocus: !0,
          })),
          (e[2] = a),
          (e[3] = C),
          (e[4] = M),
          (e[5] = I))
        : (I = e[5]);
      let E;
      e[6] !== d
        ? ((E = (0, t.jsx)("button", {
            onClick: d,
            className:
              "px-4 py-1.5 text-sm font-bold text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300",
            children: "Cancel",
          })),
          (e[6] = d),
          (e[7] = E))
        : (E = e[7]);
      let D;
      e[8] !== s || e[9] !== a || e[10] !== g
        ? ((D = g || !a?.trim() || a === s),
          (e[8] = s),
          (e[9] = a),
          (e[10] = g),
          (e[11] = D))
        : (D = e[11]);
      const O = g ? "Saving..." : "Save";
      let L;
      e[12] !== c || e[13] !== D || e[14] !== O
        ? ((L = (0, t.jsx)("button", {
            onClick: c,
            disabled: D,
            className:
              "rounded-full bg-violet-600 px-4 py-1.5 text-sm font-bold text-white transition-all hover:bg-violet-700 disabled:opacity-50 active:scale-95",
            children: O,
          })),
          (e[12] = c),
          (e[13] = D),
          (e[14] = O),
          (e[15] = L))
        : (L = e[15]);
      let y;
      e[16] !== E || e[17] !== L
        ? ((y = (0, t.jsxs)("div", {
            className: "flex justify-end gap-2",
            children: [E, L],
          })),
          (e[16] = E),
          (e[17] = L),
          (e[18] = y))
        : (y = e[18]);
      let _;
      return (
        e[19] !== I || e[20] !== y
          ? ((_ = (0, t.jsxs)("div", {
              className: "mt-2 flex flex-col gap-2",
              onClick: Is,
              children: [I, y],
            })),
            (e[19] = I),
            (e[20] = y),
            (e[21] = _))
          : (_ = e[21]),
        _
      );
    }
    const x = !r && s.length > 280;
    let v;
    e[22] !== s || e[23] !== u || e[24] !== x
      ? ((v = x && !u ? s.substring(0, 280) : s),
        (e[22] = s),
        (e[23] = u),
        (e[24] = x),
        (e[25] = v))
      : (v = e[25]);
    const m = v,
      w = r
        ? "text-lg leading-relaxed sm:text-xl sm:leading-8"
        : "text-[15px] leading-relaxed",
      k = h ? "font-bangla text-[1.15em]" : "font-english";
    let j;
    e[26] !== p || e[27] !== w || e[28] !== k
      ? ((j = H("whitespace-pre-line break-words", w, k, p)),
        (e[26] = p),
        (e[27] = w),
        (e[28] = k),
        (e[29] = j))
      : (j = e[29]);
    let z;
    e[30] !== f
      ? ((z = {
          ...we,
          render: (C) => {
            const { attributes: M, content: I } = C,
              { href: E, ...D } = M,
              O = window.location.origin;
            if (E.includes("internal.tag/")) {
              const y = decodeURIComponent(E.split("internal.tag/")[1]);
              return (0, t.jsxs)(
                "span",
                {
                  ...D,
                  className: H(
                    "cursor-pointer font-bold text-rose-600 hover:underline dark:text-rose-400 font-bangla",
                    D.className,
                  ),
                  onClick: (_) => {
                    (_.stopPropagation(), f(`/tags/${y}`));
                  },
                  children: ["#", y],
                },
                I,
              );
            }
            let L = null;
            return (
              E.startsWith("/")
                ? (L = E)
                : E.startsWith(O) && (L = E.replace(O, "")),
              L
                ? (0, t.jsx)(
                    "span",
                    {
                      ...D,
                      className: H(
                        "cursor-pointer font-medium text-violet-600 hover:underline dark:text-violet-400",
                        D.className,
                      ),
                      onClick: (y) => {
                        (y.stopPropagation(), f(L));
                      },
                      children: I,
                    },
                    I,
                  )
                : (0, t.jsx)(
                    "a",
                    {
                      href: E,
                      ...D,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: H(
                        "text-violet-600 hover:underline dark:text-violet-400",
                        D.className,
                      ),
                      onClick: Rs,
                      children: I,
                    },
                    I,
                  )
            );
          },
        }),
        (e[30] = f),
        (e[31] = z))
      : (z = e[31]);
    let o;
    e[32] !== m
      ? ((o =
          typeof m == "string"
            ? m.replace(/#([\u0980-\u09FF\w]+)/g, "https://internal.tag/$1")
            : m),
        (e[32] = m),
        (e[33] = o))
      : (o = e[33]);
    let $;
    e[34] !== z || e[35] !== o
      ? (($ = (0, t.jsx)(ye, { options: z, children: o })),
        (e[34] = z),
        (e[35] = o),
        (e[36] = $))
      : ($ = e[36]);
    const S = x && !u && "...";
    let T;
    e[37] !== u || e[38] !== x
      ? ((T =
          x &&
          (0, t.jsx)("button", {
            onClick: (C) => {
              (C.stopPropagation(), b(!u));
            },
            className:
              "ml-1 cursor-pointer font-bold text-rose-600 hover:underline dark:text-rose-400",
            children: u ? "Show less" : "See more",
          })),
        (e[37] = u),
        (e[38] = x),
        (e[39] = T))
      : (T = e[39]);
    let P;
    return (
      e[40] !== j || e[41] !== $ || e[42] !== S || e[43] !== T
        ? ((P = (0, t.jsxs)("div", { className: j, children: [$, S, T] })),
          (e[40] = j),
          (e[41] = $),
          (e[42] = S),
          (e[43] = T),
          (e[44] = P))
        : (P = e[44]),
      P
    );
  },
  st = Ms;
function Is(i) {
  return i.stopPropagation();
}
function Rs(i) {
  return i.stopPropagation();
}
var Es = B(),
  Ds = (i) => {
    const e = (0, Es.c)(28),
      {
        media: s,
        isEditing: r,
        editedMedia: l,
        setEditedMedia: a,
        newFiles: n,
        setNewFiles: d,
      } = i;
    let c;
    e[0] !== l
      ? ((c = l === void 0 ? [] : l), (e[0] = l), (e[1] = c))
      : (c = e[1]);
    const g = c;
    let p;
    e[2] !== n
      ? ((p = n === void 0 ? [] : n), (e[2] = n), (e[3] = p))
      : (p = e[3]);
    const f = p,
      u = (0, N.useRef)(null);
    if (r && a && d) {
      let h;
      if (e[4] !== g || e[5] !== a) {
        let j;
        (e[7] !== a
          ? ((j = (z, o) =>
              (0, t.jsxs)(
                "div",
                {
                  className:
                    "group relative aspect-square overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800",
                  children: [
                    z.type === "video"
                      ? (0, t.jsx)("div", {
                          className:
                            "flex size-full items-center justify-center bg-zinc-100 dark:bg-zinc-900",
                          children: (0, t.jsx)(Ae, {
                            size: 24,
                            className: "text-zinc-400",
                          }),
                        })
                      : (0, t.jsx)("img", {
                          src: z.url || z.src,
                          className: "size-full object-cover",
                          alt: "",
                        }),
                    (0, t.jsx)("button", {
                      onClick: ($) => {
                        ($.stopPropagation(),
                          a((S) => S.filter((T, P) => P !== o)));
                      },
                      className:
                        "absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black",
                      children: (0, t.jsx)(le, { size: 16 }),
                    }),
                  ],
                },
                `old-${o}`,
              )),
            (e[7] = a),
            (e[8] = j))
          : (j = e[8]),
          (h = g.map(j)),
          (e[4] = g),
          (e[5] = a),
          (e[6] = h));
      } else h = e[6];
      let x;
      if (e[9] !== f || e[10] !== d) {
        let j;
        (e[12] !== d
          ? ((j = (z, o) =>
              (0, t.jsxs)(
                "div",
                {
                  className:
                    "group relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-violet-500 bg-violet-50/10",
                  children: [
                    z.type.startsWith("image/")
                      ? (0, t.jsx)("img", {
                          src: URL.createObjectURL(z),
                          className: "size-full object-cover",
                          alt: "",
                        })
                      : (0, t.jsx)("div", {
                          className:
                            "flex size-full items-center justify-center",
                          children: (0, t.jsx)(Ae, {
                            size: 24,
                            className: "animate-pulse text-violet-500",
                          }),
                        }),
                    (0, t.jsx)("button", {
                      onClick: ($) => {
                        ($.stopPropagation(),
                          d((S) => S.filter((T, P) => P !== o)));
                      },
                      className:
                        "absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black",
                      children: (0, t.jsx)(le, { size: 16 }),
                    }),
                    (0, t.jsx)("div", {
                      className:
                        "absolute bottom-1 left-1 rounded bg-violet-600 px-1 text-[8px] font-bold text-white",
                      children: "NEW",
                    }),
                  ],
                },
                `new-${o}`,
              )),
            (e[12] = d),
            (e[13] = j))
          : (j = e[13]),
          (x = f.map(j)),
          (e[9] = f),
          (e[10] = d),
          (e[11] = x));
      } else x = e[11];
      let v;
      e[14] !== g.length || e[15] !== f.length
        ? ((v =
            g.length + f.length < 4 &&
            (0, t.jsxs)("button", {
              onClick: (j) => {
                (j.stopPropagation(), u.current?.click());
              },
              className:
                "relative flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-zinc-200 text-zinc-400 transition-all hover:border-violet-500 hover:bg-violet-50/5 hover:text-violet-500 dark:border-zinc-800",
              children: [
                (0, t.jsx)(Xt, { size: 20 }),
                (0, t.jsx)("span", {
                  className: "text-[10px] font-bold",
                  children: "Add Media",
                }),
              ],
            })),
          (e[14] = g.length),
          (e[15] = f.length),
          (e[16] = v))
        : (v = e[16]);
      let m;
      e[17] !== h || e[18] !== x || e[19] !== v
        ? ((m = (0, t.jsxs)("div", {
            className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
            children: [h, x, v],
          })),
          (e[17] = h),
          (e[18] = x),
          (e[19] = v),
          (e[20] = m))
        : (m = e[20]);
      let w;
      e[21] !== d
        ? ((w = (0, t.jsx)("input", {
            type: "file",
            ref: u,
            onChange: (j) => {
              if (j.target.files) {
                const z = Array.from(j.target.files);
                d((o) => [...o, ...z]);
              }
            },
            multiple: !0,
            className: "hidden",
            accept: "image/*,video/*",
          })),
          (e[21] = d),
          (e[22] = w))
        : (w = e[22]);
      let k;
      return (
        e[23] !== m || e[24] !== w
          ? ((k = (0, t.jsxs)("div", {
              className: "mt-3 space-y-3",
              children: [m, w],
            })),
            (e[23] = m),
            (e[24] = w),
            (e[25] = k))
          : (k = e[25]),
        k
      );
    }
    if (!s || s.length === 0) return null;
    let b;
    return (
      e[26] !== s
        ? ((b = (0, t.jsx)(ni, { items: s })), (e[26] = s), (e[27] = b))
        : (b = e[27]),
      b
    );
  },
  it = Ds,
  As = B(),
  Ls = (i) => {
    const e = (0, As.c)(35),
      {
        icon: s,
        count: r,
        label: l,
        onClick: a,
        active: n,
        activeColorClass: d,
        size: c,
        type: g,
      } = i,
      p = c === void 0 ? 18 : c,
      f = g === void 0 ? "default" : g;
    let u, b, h, x, v;
    if (
      e[0] !== n ||
      e[1] !== d ||
      e[2] !== r ||
      e[3] !== l ||
      e[4] !== a ||
      e[5] !== f
    ) {
      const T = {
        like: {
          hoverBg: "group-hover:bg-rose-500/10",
          hoverText: "group-hover:text-rose-500",
          activeText: "text-rose-500",
          activeFill: "fill-rose-500",
        },
        repost: {
          hoverBg: "group-hover:bg-emerald-500/10",
          hoverText: "group-hover:text-emerald-500",
          activeText: "text-emerald-500",
          activeFill: "fill-emerald-500",
        },
        comment: {
          hoverBg: "group-hover:bg-sky-500/10",
          hoverText: "group-hover:text-sky-500",
          activeText: "text-sky-500",
          activeFill: "fill-sky-500",
        },
        share: {
          hoverBg: "group-hover:bg-violet-500/10",
          hoverText: "group-hover:text-violet-500",
          activeText: "text-violet-500",
          activeFill: "fill-violet-500",
        },
        default: {
          hoverBg: "group-hover:bg-zinc-500/10",
          hoverText: "group-hover:text-zinc-500",
          activeText: "text-zinc-900 dark:text-white",
          activeFill: "fill-current",
        },
      };
      u = T[f] || T.default;
      const P = d || u.activeText;
      (e[11] !== a
        ? ((h = (C) => {
            (C.stopPropagation(), a && a(C));
          }),
          (e[11] = a),
          (e[12] = h))
        : (h = e[12]),
        (x = `${l} ${r !== void 0 ? `(${r})` : ""}`),
        (v = H(
          "group -ml-2 flex items-center gap-x-0.5 rounded-xl px-2 py-1.5 text-[12px] font-bold transition-all sm:gap-x-1 sm:text-[13px]",
          n ? P : "text-zinc-500",
          !n && u.hoverText,
        )),
        (b = H(
          "rounded-full p-2 transition-all duration-200",
          !n && u.hoverBg,
        )),
        (e[0] = n),
        (e[1] = d),
        (e[2] = r),
        (e[3] = l),
        (e[4] = a),
        (e[5] = f),
        (e[6] = u),
        (e[7] = b),
        (e[8] = h),
        (e[9] = x),
        (e[10] = v));
    } else ((u = e[6]), (b = e[7]), (h = e[8]), (x = e[9]), (v = e[10]));
    const m = n ? 2.5 : 2,
      w = n && u.activeFill;
    let k;
    e[13] !== w
      ? ((k = H("transition-colors duration-200", w)), (e[13] = w), (e[14] = k))
      : (k = e[14]);
    let j;
    e[15] !== s || e[16] !== p || e[17] !== m || e[18] !== k
      ? ((j = (0, t.jsx)(s, { size: p, strokeWidth: m, className: k })),
        (e[15] = s),
        (e[16] = p),
        (e[17] = m),
        (e[18] = k),
        (e[19] = j))
      : (j = e[19]);
    let z;
    e[20] !== j || e[21] !== b
      ? ((z = (0, t.jsx)("div", { className: b, children: j })),
        (e[20] = j),
        (e[21] = b),
        (e[22] = z))
      : (z = e[22]);
    let o;
    e[23] !== l
      ? ((o =
          l &&
          (0, t.jsx)("span", { className: "hidden xs:inline", children: l })),
        (e[23] = l),
        (e[24] = o))
      : (o = e[24]);
    let $;
    e[25] !== n || e[26] !== r
      ? (($ =
          r != null &&
          (0, t.jsx)("span", {
            className: H("transition-all", n ? "font-black" : "font-bold"),
            children: r || 0,
          })),
        (e[25] = n),
        (e[26] = r),
        (e[27] = $))
      : ($ = e[27]);
    let S;
    return (
      e[28] !== z ||
      e[29] !== o ||
      e[30] !== $ ||
      e[31] !== h ||
      e[32] !== x ||
      e[33] !== v
        ? ((S = (0, t.jsxs)("button", {
            onClick: h,
            "aria-label": x,
            className: v,
            children: [z, o, $],
          })),
          (e[28] = z),
          (e[29] = o),
          (e[30] = $),
          (e[31] = h),
          (e[32] = x),
          (e[33] = v),
          (e[34] = S))
        : (S = e[34]),
      S
    );
  },
  G = Ls,
  Os = B(),
  Us = (i) => {
    const e = (0, Os.c)(18),
      { poll: s, onVote: r } = i,
      l = s.options.reduce(Ws, 0),
      [a, n] = (0, N.useState)(null);
    let d;
    e[0] !== r || e[1] !== a
      ? ((d = (h) => {
          a || (n(h), r && r(h));
        }),
        (e[0] = r),
        (e[1] = a),
        (e[2] = d))
      : (d = e[2]);
    const c = d;
    let g;
    if (e[3] !== c || e[4] !== s.options || e[5] !== l || e[6] !== a) {
      let h;
      (e[8] !== c || e[9] !== l || e[10] !== a
        ? ((h = (x, v) => {
            const m =
                l > 0
                  ? Math.round(
                      ((x.votes + (a === x.id ? 1 : 0)) / (l + (a ? 1 : 0))) *
                        100,
                    )
                  : 0,
              w = a === x.id;
            return (0, t.jsxs)(
              "div",
              {
                onClick: () => c(x.id),
                className: `relative h-10 w-full overflow-hidden rounded-xl border cursor-pointer ${w ? "border-violet-500 dark:border-violet-500" : "border-zinc-200 dark:border-zinc-700"}`,
                children: [
                  a &&
                    (0, t.jsx)("div", {
                      className:
                        "absolute left-0 top-0 h-full bg-zinc-200 transition-all duration-500 dark:bg-zinc-800",
                      style: { width: `${m}%` },
                    }),
                  (0, t.jsxs)("div", {
                    className:
                      "absolute inset-0 z-10 flex items-center justify-between px-4",
                    children: [
                      (0, t.jsxs)("span", {
                        className: `text-sm font-medium ${w ? "font-bold text-violet-600" : "text-zinc-700 dark:text-zinc-200"}`,
                        children: [
                          x.text,
                          " ",
                          w &&
                            (0, t.jsx)(It, {
                              size: 14,
                              className: "mb-0.5 inline ml-1",
                            }),
                        ],
                      }),
                      a &&
                        (0, t.jsxs)("span", {
                          className:
                            "text-sm font-bold text-zinc-900 dark:text-white",
                          children: [m, "%"],
                        }),
                    ],
                  }),
                ],
              },
              x.id || v,
            );
          }),
          (e[8] = c),
          (e[9] = l),
          (e[10] = a),
          (e[11] = h))
        : (h = e[11]),
        (g = s.options.map(h)),
        (e[3] = c),
        (e[4] = s.options),
        (e[5] = l),
        (e[6] = a),
        (e[7] = g));
    } else g = e[7];
    const p = l + (a ? 1 : 0),
      f = a ? "6 days left" : "Click to vote";
    let u;
    e[12] !== p || e[13] !== f
      ? ((u = (0, t.jsxs)("div", {
          className: "pl-1 text-xs text-zinc-500 dark:text-zinc-400",
          children: [p, " votes •", " ", f],
        })),
        (e[12] = p),
        (e[13] = f),
        (e[14] = u))
      : (u = e[14]);
    let b;
    return (
      e[15] !== g || e[16] !== u
        ? ((b = (0, t.jsxs)("div", {
            className: "mt-3 space-y-2",
            children: [g, u],
          })),
          (e[15] = g),
          (e[16] = u),
          (e[17] = b))
        : (b = e[17]),
      b
    );
  },
  lt = Us;
function Ws(i, e) {
  return i + e.votes;
}
var Bs = B(),
  Vs = (i) => {
    const e = (0, Bs.c)(30),
      { user: s, time: r, content: l } = i,
      a = ae();
    let n;
    e[0] !== s.avatar || e[1] !== s.handle
      ? ((n = (0, t.jsx)(Z, { src: s.avatar, alt: s.handle })),
        (e[0] = s.avatar),
        (e[1] = s.handle),
        (e[2] = n))
      : (n = e[2]);
    let d;
    e[3] !== s.handle[0]
      ? ((d = s.handle[0]?.toUpperCase()), (e[3] = s.handle[0]), (e[4] = d))
      : (d = e[4]);
    let c;
    e[5] !== d
      ? ((c = (0, t.jsx)(ee, { children: d })), (e[5] = d), (e[6] = c))
      : (c = e[6]);
    let g;
    e[7] !== n || e[8] !== c
      ? ((g = (0, t.jsxs)(Y, { className: "size-6", children: [n, c] })),
        (e[7] = n),
        (e[8] = c),
        (e[9] = g))
      : (g = e[9]);
    let p;
    e[10] !== s.handle
      ? ((p = (0, t.jsx)("span", {
          className: "text-sm font-semibold",
          children: s.handle,
        })),
        (e[10] = s.handle),
        (e[11] = p))
      : (p = e[11]);
    let f;
    e[12] !== g || e[13] !== p
      ? ((f = (0, t.jsxs)("div", {
          className: "flex items-center gap-x-2",
          children: [g, p],
        })),
        (e[12] = g),
        (e[13] = p),
        (e[14] = f))
      : (f = e[14]);
    let u;
    e[15] !== r
      ? ((u = (0, t.jsx)("span", {
          className: "text-xs text-zinc-500 sm:text-sm",
          children: r,
        })),
        (e[15] = r),
        (e[16] = u))
      : (u = e[16]);
    let b;
    e[17] !== f || e[18] !== u
      ? ((b = (0, t.jsxs)("div", {
          className: "mb-2 flex items-center justify-between gap-x-2",
          children: [f, u],
        })),
        (e[17] = f),
        (e[18] = u),
        (e[19] = b))
      : (b = e[19]);
    let h;
    e[20] !== a
      ? ((h = {
          ...we,
          render: (w) => {
            const { attributes: k, content: j } = w,
              { href: z, ...o } = k,
              $ = window.location.origin;
            let S = null;
            return (
              z.startsWith("/")
                ? (S = z)
                : z.startsWith($) && (S = z.replace($, "")),
              S
                ? (0, t.jsx)(
                    "span",
                    {
                      ...o,
                      className: H(
                        "cursor-pointer font-medium text-violet-600 hover:underline dark:text-violet-400",
                        o.className,
                      ),
                      onClick: (T) => {
                        (T.stopPropagation(), a(S));
                      },
                      children: j,
                    },
                    j,
                  )
                : (0, t.jsx)(
                    "a",
                    {
                      href: z,
                      ...o,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      className: H(
                        "text-violet-600 hover:underline dark:text-violet-400",
                        o.className,
                      ),
                      onClick: qs,
                      children: j,
                    },
                    j,
                  )
            );
          },
        }),
        (e[20] = a),
        (e[21] = h))
      : (h = e[21]);
    let x;
    e[22] !== l
      ? ((x = (0, t.jsx)("p", {
          className:
            "whitespace-pre-line text-sm text-zinc-800 dark:text-zinc-300",
          children: l,
        })),
        (e[22] = l),
        (e[23] = x))
      : (x = e[23]);
    let v;
    e[24] !== x || e[25] !== h
      ? ((v = (0, t.jsx)(ye, { options: h, children: x })),
        (e[24] = x),
        (e[25] = h),
        (e[26] = v))
      : (v = e[26]);
    let m;
    return (
      e[27] !== v || e[28] !== b
        ? ((m = (0, t.jsxs)("div", { className: "p-4", children: [b, v] })),
          (e[27] = v),
          (e[28] = b),
          (e[29] = m))
        : (m = e[29]),
      m
    );
  },
  at = Vs;
function qs(i) {
  return i.stopPropagation();
}
var Hs = B(),
  Gs = (i) => {
    const e = (0, Hs.c)(54),
      {
        currentUser: s,
        newComment: r,
        setNewComment: l,
        handleSubmitComment: a,
        loading: n,
        selectedFiles: d,
        setSelectedFiles: c,
        isUploading: g,
      } = i;
    let p;
    e[0] !== d
      ? ((p = d === void 0 ? [] : d), (e[0] = d), (e[1] = p))
      : (p = e[1]);
    const f = p,
      u = (0, N.useRef)(null);
    let b;
    e[2] !== c
      ? ((b = (A) => {
          if (A.target.files) {
            const U = Array.from(A.target.files);
            c && c((V) => [...V, ...U]);
          }
        }),
        (e[2] = c),
        (e[3] = b))
      : (b = e[3]);
    const h = b;
    let x;
    e[4] !== c
      ? ((x = (A) => {
          c && c((U) => U.filter((V, J) => J !== A));
        }),
        (e[4] = c),
        (e[5] = x))
      : (x = e[5]);
    const v = x;
    let m;
    e[6] !== c
      ? ((m = (A) => {
          const U = A.clipboardData.files;
          if (U && U.length > 0) {
            const V = Array.from(U).filter(Js);
            V.length > 0 && (A.preventDefault(), c && c((J) => [...J, ...V]));
          }
        }),
        (e[6] = c),
        (e[7] = m))
      : (m = e[7]);
    const w = m;
    if (!s) {
      let A;
      return (
        e[8] === Symbol.for("react.memo_cache_sentinel")
          ? ((A = (0, t.jsx)("div", {
              className:
                "border-y border-zinc-100 bg-zinc-50/30 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900/10",
              children: (0, t.jsx)("p", {
                className: "text-sm text-zinc-500",
                children: "Please login to join the conversation.",
              }),
            })),
            (e[8] = A))
          : (A = e[8]),
        A
      );
    }
    let k;
    e[9] !== s.avatar || e[10] !== s.handle
      ? ((k = (0, t.jsx)(Z, {
          src: s.avatar,
          alt: s.handle,
          className: "object-cover",
        })),
        (e[9] = s.avatar),
        (e[10] = s.handle),
        (e[11] = k))
      : (k = e[11]);
    let j;
    e[12] !== s.handle?.[0]
      ? ((j = s.handle?.[0]?.toUpperCase()),
        (e[12] = s.handle?.[0]),
        (e[13] = j))
      : (j = e[13]);
    let z;
    e[14] !== j
      ? ((z = (0, t.jsx)(ee, { children: j })), (e[14] = j), (e[15] = z))
      : (z = e[15]);
    let o;
    e[16] !== k || e[17] !== z
      ? ((o = (0, t.jsxs)(Y, {
          className: "size-9 border border-zinc-200 dark:border-zinc-700",
          children: [k, z],
        })),
        (e[16] = k),
        (e[17] = z),
        (e[18] = o))
      : (o = e[18]);
    let $;
    e[19] !== l
      ? (($ = (A) => l(A.target.value)), (e[19] = l), (e[20] = $))
      : ($ = e[20]);
    let S;
    e[21] !== w || e[22] !== r || e[23] !== $
      ? ((S = (0, t.jsx)("textarea", {
          id: "comment-input",
          className:
            "min-h-[60px] w-full resize-none bg-transparent text-base outline-none placeholder:text-zinc-500 dark:text-white",
          placeholder: "Post your reply...",
          value: r,
          onChange: $,
          onPaste: w,
        })),
        (e[21] = w),
        (e[22] = r),
        (e[23] = $),
        (e[24] = S))
      : (S = e[24]);
    let T;
    e[25] !== v || e[26] !== f
      ? ((T =
          f.length > 0 &&
          (0, t.jsx)("div", {
            className: "mt-2 mb-2 flex flex-wrap gap-2",
            children: f.map((A, U) =>
              (0, t.jsxs)(
                "div",
                {
                  className:
                    "relative size-20 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800",
                  children: [
                    A.type.startsWith("image/")
                      ? (0, t.jsx)("img", {
                          src: URL.createObjectURL(A),
                          className: "size-full object-cover",
                          alt: "",
                        })
                      : (0, t.jsx)("div", {
                          className:
                            "flex size-full items-center justify-center bg-zinc-100 dark:bg-zinc-800",
                          children: (0, t.jsx)(Qt, {
                            size: 20,
                            className: "text-zinc-500",
                          }),
                        }),
                    (0, t.jsx)("button", {
                      onClick: () => v(U),
                      className:
                        "absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black",
                      children: (0, t.jsx)(le, { size: 12 }),
                    }),
                  ],
                },
                U,
              ),
            ),
          })),
        (e[25] = v),
        (e[26] = f),
        (e[27] = T))
      : (T = e[27]);
    let P;
    e[28] === Symbol.for("react.memo_cache_sentinel")
      ? ((P = () => u.current?.click()), (e[28] = P))
      : (P = e[28]);
    let C;
    e[29] === Symbol.for("react.memo_cache_sentinel")
      ? ((C = (0, t.jsx)("button", {
          type: "button",
          onClick: P,
          className:
            "rounded-full p-2 text-violet-600 transition-colors hover:bg-violet-50 dark:hover:bg-zinc-800",
          title: "Attach media",
          children: (0, t.jsx)(hs, { size: 20 }),
        })),
        (e[29] = C))
      : (C = e[29]);
    let M;
    e[30] !== h
      ? ((M = (0, t.jsxs)("div", {
          className: "flex gap-1 text-violet-600",
          children: [
            C,
            (0, t.jsx)("input", {
              type: "file",
              ref: u,
              onChange: h,
              multiple: !0,
              className: "hidden",
              accept: "image/*,video/*,application/pdf",
            }),
          ],
        })),
        (e[30] = h),
        (e[31] = M))
      : (M = e[31]);
    const I = n || g ? "primary" : "animated";
    let E;
    e[32] !== g || e[33] !== n
      ? ((E = !(n || g) && (0, t.jsx)(he, { size: 20 })),
        (e[32] = g),
        (e[33] = n),
        (e[34] = E))
      : (E = e[34]);
    const D = n || g;
    let O;
    e[35] !== r || e[36] !== f.length
      ? ((O = !r.trim() && f.length === 0),
        (e[35] = r),
        (e[36] = f.length),
        (e[37] = O))
      : (O = e[37]);
    let L;
    e[38] !== a || e[39] !== I || e[40] !== E || e[41] !== D || e[42] !== O
      ? ((L = (0, t.jsx)(Ns, {
          variant: I,
          icon: E,
          className: "min-w-[70px] !w-auto",
          onClick: a,
          loading: D,
          disabled: O,
          children: "Reply",
        })),
        (e[38] = a),
        (e[39] = I),
        (e[40] = E),
        (e[41] = D),
        (e[42] = O),
        (e[43] = L))
      : (L = e[43]);
    let y;
    e[44] !== M || e[45] !== L
      ? ((y = (0, t.jsxs)("div", {
          className:
            "mt-2 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800",
          children: [M, L],
        })),
        (e[44] = M),
        (e[45] = L),
        (e[46] = y))
      : (y = e[46]);
    let _;
    e[47] !== S || e[48] !== T || e[49] !== y
      ? ((_ = (0, t.jsxs)("div", { className: "flex-1", children: [S, T, y] })),
        (e[47] = S),
        (e[48] = T),
        (e[49] = y),
        (e[50] = _))
      : (_ = e[50]);
    let R;
    return (
      e[51] !== _ || e[52] !== o
        ? ((R = (0, t.jsx)("div", {
            className:
              "border-y border-zinc-100 bg-zinc-50/30 p-4 dark:border-zinc-800 dark:bg-zinc-900/10",
            children: (0, t.jsxs)("div", {
              className: "flex gap-3",
              children: [o, _],
            }),
          })),
          (e[51] = _),
          (e[52] = o),
          (e[53] = R))
        : (R = e[53]),
      R
    );
  },
  ht = N.memo(Gs);
function Js(i) {
  return i.type.startsWith("image/");
}
var Qs = B(),
  Xs = (i) => {
    const e = (0, Qs.c)(30),
      { url: s } = i;
    let r, l;
    e[0] !== s
      ? ((r = ["link-preview", s]),
        (l = () => ls(s)),
        (e[0] = s),
        (e[1] = r),
        (e[2] = l))
      : ((r = e[1]), (l = e[2]));
    const a = !!s;
    let n;
    e[3] !== r || e[4] !== l || e[5] !== a
      ? ((n = { queryKey: r, queryFn: l, staleTime: 864e5, enabled: a }),
        (e[3] = r),
        (e[4] = l),
        (e[5] = a),
        (e[6] = n))
      : (n = e[6]);
    const { data: d, isLoading: c, isError: g } = St(n);
    if (c) {
      let k;
      return (
        e[7] === Symbol.for("react.memo_cache_sentinel")
          ? ((k = (0, t.jsx)("div", {
              className:
                "mt-3 flex h-24 animate-pulse items-center justify-center overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50",
              children: (0, t.jsx)(Le, {
                className: "animate-spin text-zinc-300 dark:text-zinc-700",
                size: 24,
              }),
            })),
            (e[7] = k))
          : (k = e[7]),
        k
      );
    }
    if (g || !d || (!d.title && !d.image)) return null;
    let p;
    e[8] !== d.image || e[9] !== d.title
      ? ((p =
          d.image &&
          (0, t.jsx)("div", {
            className:
              "aspect-[1.91/1] w-full overflow-hidden border-b border-zinc-100 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900",
            children: (0, t.jsx)("img", {
              src: d.image,
              alt: d.title ?? void 0,
              className:
                "h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]",
              onError: Zs,
            }),
          })),
        (e[8] = d.image),
        (e[9] = d.title),
        (e[10] = p))
      : (p = e[10]);
    let f;
    e[11] === Symbol.for("react.memo_cache_sentinel")
      ? ((f = (0, t.jsx)(Le, { size: 12 })), (e[11] = f))
      : (f = e[11]);
    let u;
    e[12] !== d.siteName
      ? ((u = (0, t.jsxs)("div", {
          className:
            "flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600",
          children: [f, (0, t.jsx)("span", { children: d.siteName })],
        })),
        (e[12] = d.siteName),
        (e[13] = u))
      : (u = e[13]);
    let b;
    e[14] !== d.title
      ? ((b = (0, t.jsx)("div", {
          className:
            "line-clamp-2 text-[15px] font-bold leading-snug transition-colors group-hover:text-violet-700 dark:text-white",
          children: d.title,
        })),
        (e[14] = d.title),
        (e[15] = b))
      : (b = e[15]);
    let h;
    e[16] !== d.description
      ? ((h =
          d.description &&
          (0, t.jsx)("p", {
            className:
              "line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400",
            children: d.description,
          })),
        (e[16] = d.description),
        (e[17] = h))
      : (h = e[17]);
    let x;
    e[18] === Symbol.for("react.memo_cache_sentinel")
      ? ((x = (0, t.jsx)(Rt, { size: 10 })), (e[18] = x))
      : (x = e[18]);
    let v;
    e[19] !== s
      ? ((v = (0, t.jsxs)("div", {
          className:
            "flex items-center gap-1 pt-1 text-[11px] font-medium text-zinc-500",
          children: [
            x,
            (0, t.jsx)("span", { className: "truncate", children: s }),
          ],
        })),
        (e[19] = s),
        (e[20] = v))
      : (v = e[20]);
    let m;
    e[21] !== v || e[22] !== u || e[23] !== b || e[24] !== h
      ? ((m = (0, t.jsxs)("div", {
          className: "space-y-1 p-3.5",
          children: [u, b, h, v],
        })),
        (e[21] = v),
        (e[22] = u),
        (e[23] = b),
        (e[24] = h),
        (e[25] = m))
      : (m = e[25]);
    let w;
    return (
      e[26] !== m || e[27] !== p || e[28] !== s
        ? ((w = (0, t.jsxs)("a", {
            href: s,
            target: "_blank",
            rel: "noopener noreferrer",
            className:
              "group mt-3 flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900",
            onClick: Ks,
            children: [p, m],
          })),
          (e[26] = m),
          (e[27] = p),
          (e[28] = s),
          (e[29] = w))
        : (w = e[29]),
      w
    );
  },
  nt = Xs;
function Ks(i) {
  return i.stopPropagation();
}
function Zs(i) {
  return (i.target.style.display = "none");
}
var Ys = B(),
  ei = (i) => {
    const e = (0, Ys.c)(15),
      { file: s } = i;
    let r;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((r = (0, t.jsx)("div", {
          className:
            "flex size-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-900/30",
          children: (0, t.jsx)(Pt, { size: 20 }),
        })),
        (e[0] = r))
      : (r = e[0]);
    let l;
    e[1] !== s.name
      ? ((l = (0, t.jsx)("div", {
          className: "truncate text-sm font-bold dark:text-white",
          children: s.name,
        })),
        (e[1] = s.name),
        (e[2] = l))
      : (l = e[2]);
    let a;
    e[3] !== s.size
      ? ((a =
          s.size !== void 0 &&
          (0, t.jsxs)("div", {
            className: "text-xs uppercase text-zinc-500",
            children: [(s.size / 1024 / 1024).toFixed(2), " MB"],
          })),
        (e[3] = s.size),
        (e[4] = a))
      : (a = e[4]);
    let n;
    e[5] !== l || e[6] !== a
      ? ((n = (0, t.jsxs)("div", {
          className: "min-w-0 flex-1",
          children: [l, a],
        })),
        (e[5] = l),
        (e[6] = a),
        (e[7] = n))
      : (n = e[7]);
    let d;
    e[8] === Symbol.for("react.memo_cache_sentinel")
      ? ((d = (0, t.jsx)(Ft, { size: 18 })), (e[8] = d))
      : (d = e[8]);
    let c;
    e[9] !== s.name || e[10] !== s.url
      ? ((c = (0, t.jsx)("a", {
          href: s.url,
          download: s.name,
          className:
            "p-2 text-zinc-400 transition-colors hover:text-violet-600",
          onClick: si,
          children: d,
        })),
        (e[9] = s.name),
        (e[10] = s.url),
        (e[11] = c))
      : (c = e[11]);
    let g;
    return (
      e[12] !== n || e[13] !== c
        ? ((g = (0, t.jsxs)("div", {
            className:
              "group mt-3 flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 p-3 transition-colors hover:border-violet-500/30 dark:border-zinc-800 dark:bg-zinc-900/10",
            children: [r, n, c],
          })),
          (e[12] = n),
          (e[13] = c),
          (e[14] = g))
        : (g = e[14]),
      g
    );
  },
  ti = ei;
function si(i) {
  return i.stopPropagation();
}
var ut = B(),
  ii = N.lazy(() =>
    ct(
      () => import("./VideoPlayer-Mxs0V9Sv.js"),
      __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    ),
  ),
  li = (i) => {
    const e = (0, ut.c)(10),
      { item: s, onClick: r } = i,
      [l, a] = (0, N.useState)(!1);
    let n;
    e[0] !== l
      ? ((n =
          !l &&
          (0, t.jsx)("div", {
            className:
              "absolute inset-0 animate-pulse bg-zinc-200 dark:bg-zinc-800",
          })),
        (e[0] = l),
        (e[1] = n))
      : (n = e[1]);
    const d = s.url || s.src,
      c = `size-full object-cover transition-all duration-500 hover:scale-[1.02] ${l ? "opacity-100" : "opacity-0"}`;
    let g;
    e[2] === Symbol.for("react.memo_cache_sentinel")
      ? ((g = () => a(!0)), (e[2] = g))
      : (g = e[2]);
    let p;
    e[3] !== d || e[4] !== c
      ? ((p = (0, t.jsx)("img", {
          src: d,
          className: c,
          alt: "",
          loading: "lazy",
          onLoad: g,
        })),
        (e[3] = d),
        (e[4] = c),
        (e[5] = p))
      : (p = e[5]);
    let f;
    return (
      e[6] !== r || e[7] !== n || e[8] !== p
        ? ((f = (0, t.jsxs)("div", {
            className: "relative size-full overflow-hidden",
            onClick: r,
            children: [n, p],
          })),
          (e[6] = r),
          (e[7] = n),
          (e[8] = p),
          (e[9] = f))
        : (f = e[9]),
      f
    );
  },
  ai = (i) => {
    const e = (0, ut.c)(3),
      { items: s } = i,
      r = s === void 0 ? [] : s,
      { openLightbox: l } = os();
    if (!r || (Array.isArray(r) && r.length === 0)) return null;
    const a = Array.isArray(r) ? r : [r],
      n = a.filter(ri),
      d = a.filter(oi),
      c = n.some(ci),
      g = (h) => {
        const x = n.filter(di).map(mi),
          v = n[h];
        l(x, x.indexOf(v.url || v.src));
      },
      p = "mt-2 space-y-2",
      f =
        n.length > 0 &&
        (0, t.jsx)("div", {
          className: `grid gap-2 overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 ${n.length === 1 ? "grid-cols-1" : n.length === 2 ? (c ? "aspect-[8/9] grid-cols-1 grid-rows-2" : "aspect-[16/9] grid-cols-2") : (n.length === 3, "aspect-[16/9] grid-cols-2 grid-rows-2")}`,
          children: n.map((h, x) =>
            (0, t.jsx)(
              "div",
              {
                className: `relative cursor-pointer overflow-hidden bg-zinc-100 dark:bg-zinc-900 ${n.length === 3 && x === 0 ? "row-span-2" : ""}`,
                children:
                  h.type === "video"
                    ? (0, t.jsx)(N.Suspense, {
                        fallback: (0, t.jsx)("div", {
                          className:
                            "flex aspect-video w-full items-center justify-center bg-zinc-100 dark:bg-zinc-900",
                          children: (0, t.jsx)("div", {
                            className:
                              "size-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent",
                          }),
                        }),
                        children: (0, t.jsx)(ii, {
                          src: h.url,
                          poster: h.poster || void 0,
                        }),
                      })
                    : (0, t.jsx)(li, {
                        item: h,
                        onClick: (v) => {
                          (v.stopPropagation(), g(x));
                        },
                      }),
              },
              x,
            ),
          ),
        }),
      u = d.map(xi);
    let b;
    return (
      e[0] !== f || e[1] !== u
        ? ((b = (0, t.jsxs)("div", { className: p, children: [f, u] })),
          (e[0] = f),
          (e[1] = u),
          (e[2] = b))
        : (b = e[2]),
      b
    );
  },
  ni = ai;
function ri(i) {
  return i.type === "image" || i.type === "video";
}
function oi(i) {
  return i.type === "file";
}
function ci(i) {
  return i.type === "video";
}
function di(i) {
  return i.type === "image";
}
function mi(i) {
  return i.url || i.src;
}
function xi(i, e) {
  return (0, t.jsx)(ti, { file: i }, e);
}
var pt = B(),
  fi = (i) => {
    const e = (0, pt.c)(6),
      { avatars: s } = i;
    if (!s || s.length === 0) return null;
    let r, l;
    if (e[0] !== s) {
      const n = s.slice(0, 3);
      ((r = "relative mt-2 h-7 w-7"),
        (l = n.map((d, c) => {
          let g, p;
          return (
            n.length === 1
              ? ((g = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"),
                (p = "size-5"))
              : n.length === 2
                ? ((p = "size-4"),
                  (g = c === 0 ? "top-0 right-0" : "bottom-0 left-0"))
                : ((p = c === 0 ? "size-3.5" : "size-3"),
                  c === 0
                    ? (g = "top-0 right-0")
                    : c === 1
                      ? (g = "bottom-0 right-0")
                      : (g = "top-1/2 left-0 -translate-y-1/2")),
            (0, t.jsx)(
              "div",
              {
                className: `absolute rounded-full border border-white bg-zinc-100 dark:border-black dark:bg-zinc-800 overflow-hidden shadow-sm ${g} ${p}`,
                style: { zIndex: 10 - c },
                children: (0, t.jsx)("img", {
                  src: d,
                  alt: "",
                  className: "h-full w-full object-cover",
                }),
              },
              c,
            )
          );
        })),
        (e[0] = s),
        (e[1] = r),
        (e[2] = l));
    } else ((r = e[1]), (l = e[2]));
    let a;
    return (
      e[3] !== r || e[4] !== l
        ? ((a = (0, t.jsx)("div", { className: r, children: l })),
          (e[3] = r),
          (e[4] = l),
          (e[5] = a))
        : (a = e[5]),
      a
    );
  },
  rt = (i) => {
    const e = (0, pt.c)(32),
      {
        id: s,
        user: r,
        isCurrentUser: l,
        isComment: a,
        onEdit: n,
        onDelete: d,
        addToast: c,
        trigger: g,
      } = i;
    let p;
    e[0] !== g
      ? ((p = (0, t.jsx)(js, { asChild: !0, onClick: pi, children: g })),
        (e[0] = g),
        (e[1] = p))
      : (p = e[1]);
    let f;
    e[2] !== c || e[3] !== s || e[4] !== a
      ? ((f =
          !a &&
          (0, t.jsxs)(ie, {
            className: "cursor-pointer gap-2 py-2.5",
            onClick: (k) => {
              (k.stopPropagation(),
                navigator.clipboard.writeText(
                  `${window.location.origin}/p/${s}`,
                ),
                c("Link copied"));
            },
            children: [
              (0, t.jsx)(Lt, { size: 16 }),
              (0, t.jsx)("span", { children: "Copy link" }),
            ],
          })),
        (e[2] = c),
        (e[3] = s),
        (e[4] = a),
        (e[5] = f))
      : (f = e[5]);
    let u;
    e[6] !== c || e[7] !== a
      ? ((u =
          !a &&
          (0, t.jsxs)(ie, {
            className: "cursor-pointer gap-2 py-2.5",
            onClick: (k) => {
              (k.stopPropagation(), c("Post reported"));
            },
            children: [
              (0, t.jsx)(Dt, { size: 16 }),
              (0, t.jsx)("span", { children: "Report post" }),
            ],
          })),
        (e[6] = c),
        (e[7] = a),
        (e[8] = u))
      : (u = e[8]);
    let b;
    e[9] !== c || e[10] !== l || e[11] !== r
      ? ((b =
          !l &&
          (0, t.jsxs)(ie, {
            className: "cursor-pointer gap-2 py-2.5",
            onClick: (k) => {
              (k.stopPropagation(), c("User blocked"));
            },
            children: [
              (0, t.jsx)(Mt, { size: 16 }),
              (0, t.jsxs)("span", { children: ["Block @", r.handle] }),
            ],
          })),
        (e[9] = c),
        (e[10] = l),
        (e[11] = r),
        (e[12] = b))
      : (b = e[12]);
    let h;
    e[13] !== a || e[14] !== l || e[15] !== n
      ? ((h =
          l &&
          (0, t.jsxs)(ie, {
            onClick: (k) => {
              (k.stopPropagation(), n());
            },
            className: "cursor-pointer gap-2 py-2.5",
            children: [
              (0, t.jsx)(Jt, { size: 16 }),
              "Edit ",
              a ? "Comment" : "Post",
            ],
          })),
        (e[13] = a),
        (e[14] = l),
        (e[15] = n),
        (e[16] = h))
      : (h = e[16]);
    let x;
    e[17] !== f || e[18] !== u || e[19] !== b || e[20] !== h
      ? ((x = (0, t.jsxs)(Ve, { children: [f, u, b, h] })),
        (e[17] = f),
        (e[18] = u),
        (e[19] = b),
        (e[20] = h),
        (e[21] = x))
      : (x = e[21]);
    let v;
    e[22] !== a || e[23] !== l || e[24] !== d
      ? ((v =
          l &&
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(gs, {}),
              (0, t.jsx)(Ve, {
                children: (0, t.jsxs)(ie, {
                  variant: "destructive",
                  className: "cursor-pointer gap-2 py-2.5",
                  onClick: (k) => {
                    (k.stopPropagation(), d());
                  },
                  children: [
                    (0, t.jsx)(Kt, { size: 16 }),
                    (0, t.jsxs)("span", {
                      children: ["Delete ", a ? "comment" : "post"],
                    }),
                  ],
                }),
              }),
            ],
          })),
        (e[22] = a),
        (e[23] = l),
        (e[24] = d),
        (e[25] = v))
      : (v = e[25]);
    let m;
    e[26] !== x || e[27] !== v
      ? ((m = (0, t.jsxs)(Zt, {
          align: "end",
          className:
            "w-48 rounded-xl border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900",
          children: [x, v],
        })),
        (e[26] = x),
        (e[27] = v),
        (e[28] = m))
      : (m = e[28]);
    let w;
    return (
      e[29] !== p || e[30] !== m
        ? ((w = (0, t.jsxs)(as, { children: [p, m] })),
          (e[29] = p),
          (e[30] = m),
          (e[31] = w))
        : (w = e[31]),
      w
    );
  },
  ke = ({
    id: i,
    user: e,
    timeAgo: s,
    content: r,
    contentClass: l,
    media: a,
    quotedPost: n,
    stats: d,
    onClick: c,
    repostedBy: g,
    onUserClick: p,
    currentUser: f,
    poll: u,
    isDetail: b,
    initialComments: h,
    onDelete: x,
    onUpdate: v,
    isComment: m,
    onReply: w,
    community: k,
    parent_id: j,
    post_id: z,
    commenterAvatars: o = [],
  }) => {
    const $ = ae(),
      { addToast: S } = Ne(),
      {
        liked: T,
        reposted: P,
        localStats: C,
        setLocalStats: M,
        handleLike: I,
        handleRepost: E,
      } = ws(i, d, f),
      { deletePost: D, updatePost: O } = Yt(),
      {
        comments: L,
        fetchNextPage: y,
        hasNextPage: _,
        isFetchingNextPage: R,
        addComment: A,
        isSubmitting: U,
      } = Ze(i, h),
      [V, J] = (0, N.useState)(""),
      [ue, Ce] = (0, N.useState)([]),
      [vt, $e] = (0, N.useState)(!1),
      [_e, te] = (0, N.useState)(!1),
      [ne, X] = (0, N.useState)(!1),
      [Q, re] = (0, N.useState)(r),
      [oe, ce] = (0, N.useState)(a || []),
      [de, se] = (0, N.useState)([]),
      [Se, Fe] = (0, N.useState)(!1),
      [bt, pe] = (0, N.useState)(!1),
      [ge, me] = (0, N.useState)(null),
      [ve, Pe] = (0, N.useState)(!1),
      { comments: jt, refetch: Te } = Ze(z || i, [], ve ? i : void 0),
      { ref: Me, inView: Ie } = $t({ threshold: 0.5, triggerOnce: !0 });
    (0, N.useEffect)(() => {
      if (Ie && !m) {
        const F = setTimeout(() => {
          bs(i).catch(console.error);
        }, 1500);
        return () => clearTimeout(F);
      }
    }, [Ie, i, m]);
    const zt = (0, N.useCallback)(async () => {
        !i || (!z && !i) || C.comments === 0 || (Pe(!0), Te());
      }, [i, z, C.comments, Te]),
      Re = async () => {
        const F =
          JSON.stringify(oe) !== JSON.stringify(a || []) || de.length > 0;
        if (!Q.trim() || (Q === r && !F)) {
          X(!1);
          return;
        }
        Fe(!0);
        try {
          const W = [];
          for (const K of de) {
            const yt = await ze(K);
            W.push(yt);
          }
          const q = [...oe, ...W];
          (m
            ? await zs(i, { content: Q, media: q })
            : await O(i, { content: Q, media: q }),
            se([]),
            X(!1),
            S(`${m ? "Comment" : "Post"} updated`),
            v && v(i, Q, q));
        } catch (W) {
          (console.error(`Failed to update ${m ? "comment" : "post"}:`, W),
            S(`Failed to update ${m ? "comment" : "post"}`));
        } finally {
          Fe(!1);
        }
      },
      Ee = async (F) => {
        F && F.stopPropagation();
        try {
          (m ? await ms(i) : await D(i),
            S(`${m ? "Comment" : "Post"} deleted successfully`),
            x && x(i));
        } catch (W) {
          (console.error(`Failed to delete ${m ? "comment" : "post"}:`, W),
            S(`Failed to delete ${m ? "comment" : "post"}`));
        } finally {
          te(!1);
        }
      },
      kt = async (F) => {
        if ((F.preventDefault(), !((!V.trim() && ue.length === 0) || !f))) {
          $e(!0);
          try {
            const W = [];
            for (const q of ue) {
              const K = await ze(q);
              W.push(K);
            }
            (await A({ userId: f.id, content: V, media: W, replyToId: ge?.id }),
              J(""),
              Ce([]),
              me(null),
              M((q) => ({ ...q, comments: (q.comments || 0) + 1 })),
              S("Reply posted!"));
          } catch (W) {
            (console.error("Failed to post comment:", W),
              S("Failed to post reply."));
          } finally {
            $e(!1);
          }
        }
      },
      De = f?.handle === e.handle,
      Nt = (F, W) => {
        (me(W ? { handle: F, id: m ? j || i : W } : null),
          J((q) => {
            const K = `@${F} `;
            return q.includes(K) ? q : K + q;
          }),
          document.getElementById("comment-input")?.focus());
      };
    return b
      ? (0, t.jsxs)("div", {
          className: "flex flex-col",
          ref: Me,
          children: [
            (0, t.jsxs)("article", {
              className: "p-5 dark:bg-black",
              children: [
                (0, t.jsx)(tt, {
                  user: e,
                  timeAgo: s,
                  community: k,
                  onUserClick: p,
                  isDetail: !0,
                  showAvatar: !0,
                  actionsMenu: (0, t.jsx)(rt, {
                    id: i,
                    user: e,
                    isCurrentUser: De,
                    isComment: m,
                    onEdit: () => X(!0),
                    onDelete: () => te(!0),
                    addToast: S,
                    trigger: (0, t.jsx)("button", {
                      "aria-label": "More options",
                      className:
                        "rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
                      children: (0, t.jsx)(be, { size: 20 }),
                    }),
                  }),
                }),
                (0, t.jsx)(st, {
                  content: r,
                  isDetail: !0,
                  isEditing: ne,
                  editedContent: Q,
                  setEditedContent: re,
                  onCancelEdit: () => {
                    (X(!1), re(r), ce(a || []), se([]));
                  },
                  onSaveEdit: Re,
                  isUpdating: Se,
                  contentClass: l,
                }),
                xe(r) && (0, t.jsx)(nt, { url: xe(r) }),
                (0, t.jsx)(it, {
                  media: a,
                  isEditing: ne,
                  editedMedia: oe,
                  setEditedMedia: ce,
                  newFiles: de,
                  setNewFiles: se,
                }),
                u && (0, t.jsx)(lt, { poll: u, onVote: (F) => xs(i, F, f.id) }),
                n &&
                  (0, t.jsx)("div", {
                    className:
                      "mt-4 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm dark:border-zinc-700",
                    children: (0, t.jsx)(at, { ...n }),
                  }),
                (0, t.jsx)(et, {
                  views: C.views || 0,
                  likes: C.likes || 0,
                  comments: C.comments || 0,
                  isDetail: !0,
                }),
                (0, t.jsx)(Ye, {
                  liked: T,
                  reposted: P,
                  handleLike: I,
                  handleRepost: E,
                  handleCommentClick: () =>
                    document.getElementById("comment-input")?.focus(),
                  handleShareClick: () => pe(!0),
                  isDetail: !0,
                  isComment: m,
                }),
              ],
            }),
            ge &&
              (0, t.jsxs)("div", {
                className:
                  "flex items-center justify-between bg-zinc-50 px-5 py-2 dark:bg-zinc-900/50",
                children: [
                  (0, t.jsxs)("span", {
                    className: "text-sm text-zinc-500",
                    children: [
                      "Replying to",
                      " ",
                      (0, t.jsxs)("span", {
                        className: "font-bold text-violet-600",
                        children: ["@", ge.handle],
                      }),
                    ],
                  }),
                  (0, t.jsx)("button", {
                    onClick: () => me(null),
                    className:
                      "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200",
                    children: (0, t.jsx)(le, { size: 16 }),
                  }),
                ],
              }),
            (0, t.jsx)(ht, {
              currentUser: f,
              newComment: V,
              setNewComment: J,
              handleSubmitComment: kt,
              loading: U,
              selectedFiles: ue,
              setSelectedFiles: Ce,
              isUploading: vt,
            }),
            (0, t.jsxs)("div", {
              className: "divide-y divide-zinc-100 dark:divide-zinc-800",
              children: [
                (0, t.jsx)("div", {
                  className: "divide-y divide-zinc-100 dark:divide-zinc-800",
                  children: (0, t.jsxs)(t.Fragment, {
                    children: [
                      _ &&
                        L.length > 0 &&
                        (0, t.jsxs)("button", {
                          onClick: () => y(),
                          disabled: R,
                          className:
                            "flex w-full items-center justify-center gap-2 py-3 text-sm font-bold text-violet-600 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900",
                          children: [
                            R &&
                              (0, t.jsx)("span", {
                                className: "animate-spin",
                                children: "⌛",
                              }),
                            "View more replies",
                          ],
                        }),
                      L.map((F) =>
                        (0, t.jsx)(
                          ke,
                          {
                            ...F,
                            isComment: !0,
                            post_id: i,
                            onReply: Nt,
                            onUserClick: p,
                            currentUser: f,
                            stats: {
                              likes: F.stats?.likes || 0,
                              comments: F.stats?.comments || 0,
                              reposts: F.stats?.reposts || 0,
                            },
                            timeAgo: F.timeAgo || F.created_at,
                          },
                          F.id,
                        ),
                      ),
                    ],
                  }),
                }),
                (0, t.jsx)(qe, {
                  open: _e,
                  onOpenChange: te,
                  children: (0, t.jsxs)(Ge, {
                    onClick: (F) => F.stopPropagation(),
                    children: [
                      (0, t.jsxs)(Xe, {
                        children: [
                          (0, t.jsx)(Ke, {
                            children: "Are you absolutely sure?",
                          }),
                          (0, t.jsx)(He, {
                            children:
                              "This action cannot be undone. This will permanently delete your post and all its comments.",
                          }),
                        ],
                      }),
                      (0, t.jsxs)(Ue, {
                        children: [
                          (0, t.jsx)(Je, {
                            onClick: (F) => F.stopPropagation(),
                            children: "Cancel",
                          }),
                          (0, t.jsx)(Qe, {
                            onClick: Ee,
                            className: "bg-rose-500 hover:bg-rose-600",
                            children: "Delete",
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        })
      : (0, t.jsxs)("article", {
          ref: Me,
          onClick: c,
          className: `px-4 transition-all ${m ? "py-2 bg-transparent hover:bg-zinc-50/30 dark:hover:bg-zinc-800/20" : "py-4 bg-white hover:bg-zinc-50/30 dark:bg-black dark:hover:bg-white/[0.02]"} ${c ? "cursor-pointer" : ""}`,
          children: [
            g &&
              (0, t.jsxs)("div", {
                className:
                  "mb-2 ml-1 flex items-center space-x-1.5 text-[13px] font-semibold text-zinc-600",
                children: [
                  (0, t.jsx)(je, { size: 14, className: "text-zinc-500" }),
                  (0, t.jsxs)("span", {
                    className:
                      "flex cursor-pointer items-center text-zinc-700 hover:underline dark:text-zinc-300",
                    onClick: (F) => {
                      (F.stopPropagation(), p && p(g.handle));
                    },
                    children: [g.handle, " Reposted"],
                  }),
                ],
              }),
            (0, t.jsxs)("div", {
              className: "flex items-start gap-x-3",
              children: [
                (0, t.jsxs)("div", {
                  className:
                    "flex shrink-0 flex-col items-center self-stretch pt-0.5",
                  children: [
                    (0, t.jsx)("div", {
                      className: "cursor-pointer",
                      onClick: (F) => {
                        (F.stopPropagation(), p && p(e.handle));
                      },
                      children: (0, t.jsxs)(Y, {
                        className: `${m ? "size-8" : "size-10"} border-0 shadow-sm`,
                        children: [
                          (0, t.jsx)(Z, {
                            src: e.avatar,
                            alt: e.handle,
                            className: "object-cover",
                          }),
                          (0, t.jsx)(ee, {
                            className: "text-xs",
                            children: e.handle[0]?.toUpperCase(),
                          }),
                        ],
                      }),
                    }),
                    ((!m && C.comments > 0) || (m && !j && C.comments > 0)) &&
                      (0, t.jsxs)(t.Fragment, {
                        children: [
                          (0, t.jsx)("div", {
                            className:
                              "mt-2 w-0.5 flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800",
                          }),
                          !m &&
                            (0, t.jsx)(fi, {
                              avatars:
                                o.length > 0
                                  ? o
                                  : (L || [])
                                      .slice(0, 3)
                                      .map((F) => F.user.avatar),
                            }),
                        ],
                      }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className: "flex min-w-0 flex-1 flex-col",
                  children: [
                    (0, t.jsx)(tt, {
                      user: e,
                      timeAgo: s,
                      community: k,
                      onUserClick: p,
                      isComment: m,
                      actionsMenu: (0, t.jsx)(rt, {
                        id: i,
                        user: e,
                        isCurrentUser: De,
                        isComment: m,
                        onEdit: () => X(!0),
                        onDelete: () => te(!0),
                        addToast: S,
                        trigger: (0, t.jsx)("button", {
                          "aria-label": "More options",
                          className:
                            "rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 group-hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:group-hover:bg-zinc-800/50",
                          children: (0, t.jsx)(be, { size: 18 }),
                        }),
                      }),
                    }),
                    (0, t.jsx)(st, {
                      content: r,
                      isEditing: ne,
                      editedContent: Q,
                      setEditedContent: re,
                      onCancelEdit: () => {
                        (X(!1), re(r), ce(a || []), se([]));
                      },
                      onSaveEdit: Re,
                      isUpdating: Se,
                      contentClass: l,
                    }),
                    xe(r) && (0, t.jsx)(nt, { url: xe(r) }),
                    (0, t.jsx)(it, {
                      media: a,
                      isEditing: ne,
                      editedMedia: oe,
                      setEditedMedia: ce,
                      newFiles: de,
                      setNewFiles: se,
                    }),
                    u && (0, t.jsx)(lt, { poll: u }),
                    n &&
                      (0, t.jsx)("div", {
                        className:
                          "mt-3 overflow-hidden rounded-2xl border border-zinc-200 shadow-sm transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900",
                        onClick: (F) => {
                          (F.stopPropagation(), $(`/p/${n.id}`));
                        },
                        children: (0, t.jsx)(at, { ...n }),
                      }),
                    (0, t.jsx)(Ye, {
                      liked: T,
                      reposted: P,
                      handleLike: I,
                      handleRepost: E,
                      handleCommentClick: (F) => {
                        (F?.stopPropagation(), w ? w(e.handle, i) : c && c());
                      },
                      handleShareClick: (F) => {
                        (F?.stopPropagation(), pe(!0));
                      },
                      isComment: m,
                    }),
                    (0, t.jsx)(et, {
                      views: C.views || 0,
                      likes: C.likes || 0,
                      comments: C.comments || 0,
                      isComment: m,
                      onRepliesClick: () => {
                        ve ? Pe(!1) : zt();
                      },
                    }),
                    ve &&
                      (0, t.jsxs)("div", {
                        className: "relative mt-2 space-y-0",
                        children: [
                          (0, t.jsx)("div", {
                            className:
                              "absolute left-[19px] top-0 bottom-4 w-0.5 bg-zinc-100 dark:bg-zinc-800",
                          }),
                          (0, t.jsx)("div", {
                            className: "flex flex-col",
                            children: jt.map((F) =>
                              (0, t.jsxs)(
                                "div",
                                {
                                  className: "relative",
                                  children: [
                                    (0, t.jsx)("div", {
                                      className:
                                        "absolute left-[19px] top-5 h-0.5 w-4 bg-zinc-100 dark:bg-zinc-800",
                                    }),
                                    (0, t.jsx)("div", {
                                      className: "pl-6",
                                      children: (0, t.jsx)(ke, {
                                        ...F,
                                        isComment: !0,
                                        post_id: z || i,
                                        onReply: w,
                                        onUserClick: p,
                                        currentUser: f,
                                        stats: {
                                          likes: F.stats?.likes || 0,
                                          comments: F.stats?.comments || 0,
                                          reposts: F.stats?.reposts || 0,
                                        },
                                        timeAgo: F.timeAgo || F.created_at,
                                      }),
                                    }),
                                  ],
                                },
                                F.id,
                              ),
                            ),
                          }),
                        ],
                      }),
                    (0, t.jsx)(gt, {
                      isOpen: bt,
                      onClose: () => pe(!1),
                      url: `${window.location.origin}/p/${i}`,
                      title: "Share Post",
                    }),
                    (0, t.jsx)(qe, {
                      open: _e,
                      onOpenChange: te,
                      children: (0, t.jsxs)(Ge, {
                        onClick: (F) => F.stopPropagation(),
                        children: [
                          (0, t.jsxs)(Xe, {
                            children: [
                              (0, t.jsx)(Ke, {
                                children: "Are you absolutely sure?",
                              }),
                              (0, t.jsx)(He, {
                                children:
                                  "This action cannot be undone. This will permanently delete your post and all its comments.",
                              }),
                            ],
                          }),
                          (0, t.jsxs)(Ue, {
                            children: [
                              (0, t.jsx)(Je, {
                                onClick: (F) => F.stopPropagation(),
                                children: "Cancel",
                              }),
                              (0, t.jsx)(Qe, {
                                onClick: Ee,
                                className: "bg-rose-500 hover:bg-rose-600",
                                children: "Delete",
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
  };
function hi(i, e) {
  const s =
      (!i.media && !e.media) ||
      (i.media?.length === e.media?.length &&
        i.media?.every((l, a) => l.url === e.media?.[a].url)),
    r = i.repostedBy?.handle === e.repostedBy?.handle;
  return (
    i.id === e.id &&
    i.content === e.content &&
    i.timeAgo === e.timeAgo &&
    i.user.id === e.user.id &&
    i.user.avatar === e.user.avatar &&
    i.stats.likes === e.stats.likes &&
    i.stats.comments === e.stats.comments &&
    i.stats.reposts === e.stats.reposts &&
    i.currentUser?.id === e.currentUser?.id &&
    !!s &&
    !!r
  );
}
var ui = N.memo(ke, hi);
function pi(i) {
  return i.stopPropagation();
}
var gi = ({ isOpen: i, onClose: e, url: s, title: r = "Share" }) => {
    const [l, a] = (0, N.useState)(!1),
      [n, d] = (0, N.useState)(""),
      [c, g] = (0, N.useState)([]),
      [p, f] = (0, N.useState)(!1),
      [u, b] = (0, N.useState)(null),
      { addToast: h } = Ne(),
      { currentUser: x } = mt(),
      v = (0, N.useCallback)(async () => {
        if (x) {
          f(!0);
          try {
            g(
              (await Oe(x.id))
                .map((o) => o.user)
                .filter((o) => o !== null)
                .slice(0, 5),
            );
          } catch (o) {
            console.error("Failed to fetch conversations:", o);
          } finally {
            f(!1);
          }
        }
      }, [x]);
    (0, N.useEffect)(() => {
      i && x ? v() : (d(""), g([]));
    }, [i, x, v]);
    const m = (0, N.useCallback)(async () => {
      if (x) {
        f(!0);
        try {
          g(
            (await Oe(x.id))
              .map((o) => o.user)
              .filter(
                (o) =>
                  o !== null &&
                  (o.name?.toLowerCase().includes(n.toLowerCase()) ||
                    o.handle.toLowerCase().includes(n.toLowerCase())),
              ),
          );
        } catch (o) {
          console.error("Search failed:", o);
        } finally {
          f(!1);
        }
      }
    }, [n, x]);
    (0, N.useEffect)(() => {
      const o = setTimeout(() => {
        n.trim() && i ? m() : !n.trim() && i && v();
      }, 300);
      return () => clearTimeout(o);
    }, [n, i, m, v]);
    const w = async (o) => {
        o && o.stopPropagation();
        try {
          (await navigator.clipboard.writeText(s),
            a(!0),
            h("Link copied to clipboard!", "success"),
            setTimeout(() => a(!1), 2e3));
        } catch ($) {
          (console.error("Failed to copy:", $),
            h("Failed to copy link", "error"));
        }
      },
      k = async (o) => {
        if (x) {
          b(o.id);
          try {
            (await ss(await cs(x.id, o.id), x.id, s, "text"),
              h(`Sent to ${o.name || o.handle}!`, "success"));
          } catch ($) {
            (console.error("Failed to send message:", $),
              h("Failed to send message", "error"));
          } finally {
            b(null);
          }
        }
      },
      j = [
        {
          name: "X",
          icon: Et,
          color: "bg-black text-white",
          href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(s)}`,
        },
        {
          name: "Facebook",
          icon: Tt,
          color: "bg-[#1877F2] text-white",
          href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(s)}`,
        },
        {
          name: "LinkedIn",
          icon: Bt,
          color: "bg-[#0A66C2] text-white",
          href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(s)}`,
        },
        {
          name: "WhatsApp",
          icon: Gt,
          color: "bg-[#25D366] text-white",
          href: `https://wa.me/?text=${encodeURIComponent(s)}`,
        },
        {
          name: "Email",
          icon: Ut,
          color: "bg-zinc-600 text-white",
          href: `mailto:?body=${encodeURIComponent(s)}`,
        },
      ],
      z = async () => {
        if (navigator.share)
          try {
            await navigator.share({ title: r, url: s });
          } catch (o) {
            o.name !== "AbortError" && console.error("Native share failed:", o);
          }
        else w();
      };
    return (0, t.jsx)(xt, {
      isOpen: i,
      onClose: e,
      title: r,
      className: "max-w-[420px] !p-0 overflow-hidden",
      children: (0, t.jsxs)("div", {
        className: "flex h-full flex-col bg-white dark:bg-zinc-900",
        children: [
          (0, t.jsx)("div", {
            className: "px-5 pb-2 pt-4",
            children: (0, t.jsxs)("div", {
              className: "group relative",
              children: [
                (0, t.jsx)(Ot, {
                  className:
                    "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-violet-500",
                }),
                (0, t.jsx)("input", {
                  type: "text",
                  placeholder: "Search people...",
                  value: n,
                  onChange: (o) => d(o.target.value),
                  className:
                    "w-full rounded-xl border-none bg-zinc-100 py-2.5 pl-10 pr-4 text-sm transition-all focus:ring-2 focus:ring-violet-500/20 outline-none dark:bg-zinc-800/50",
                }),
              ],
            }),
          }),
          (0, t.jsx)("div", {
            className:
              "no-scrollbar flex min-h-[100px] items-center gap-4 overflow-x-auto px-5 py-4",
            children: p
              ? (0, t.jsx)("div", {
                  className: "flex flex-1 justify-center",
                  children: (0, t.jsx)("span", {
                    className: "animate-pulse font-bold text-zinc-400",
                    children: "Loading...",
                  }),
                })
              : c.length > 0
                ? c.map((o) =>
                    (0, t.jsxs)(
                      "button",
                      {
                        onClick: () => k(o),
                        disabled: u !== null,
                        className:
                          "group flex shrink-0 flex-col items-center gap-1.5 disabled:opacity-50",
                        children: [
                          (0, t.jsxs)("div", {
                            className: "relative",
                            children: [
                              (0, t.jsx)("div", {
                                className:
                                  "size-14 overflow-hidden rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-105 bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-900",
                                children: (0, t.jsx)("img", {
                                  src:
                                    o.avatar ||
                                    `https://i.pravatar.cc/150?u=${o.id}`,
                                  alt: o.handle,
                                  className: "size-full object-cover",
                                }),
                              }),
                              u === o.id &&
                                (0, t.jsx)("div", {
                                  className:
                                    "absolute inset-0 flex items-center justify-center rounded-full bg-black/40",
                                  children: (0, t.jsx)("span", {
                                    className:
                                      "animate-pulse text-white font-bold",
                                    children: "...",
                                  }),
                                }),
                            ],
                          }),
                          (0, t.jsx)("span", {
                            className:
                              "max-w-[60px] truncate text-[10px] font-medium text-zinc-500 dark:text-zinc-400",
                            children: o.name?.split(" ")[0] || o.handle,
                          }),
                        ],
                      },
                      o.id,
                    ),
                  )
                : (0, t.jsx)("div", {
                    className: "flex-1 py-2 text-center",
                    children: (0, t.jsx)("span", {
                      className: "text-xs text-zinc-400",
                      children: "No people found",
                    }),
                  }),
          }),
          (0, t.jsx)("div", {
            className: "mx-5 h-px bg-zinc-100 dark:bg-zinc-800",
          }),
          (0, t.jsxs)("div", {
            className: "grid grid-cols-5 gap-2 px-5 py-6",
            children: [
              j.map((o) =>
                (0, t.jsxs)(
                  "a",
                  {
                    href: o.href,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "group flex flex-col items-center gap-2",
                    children: [
                      (0, t.jsx)("div", {
                        className: `size-12 ${o.color} flex items-center justify-center rounded-2xl shadow-md transition-all group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-lg`,
                        children: (0, t.jsx)(o.icon, {
                          size: 20,
                          strokeWidth: 2.5,
                        }),
                      }),
                      (0, t.jsx)("span", {
                        className:
                          "text-[10px] font-bold uppercase tracking-tighter text-zinc-500 dark:text-zinc-400",
                        children: o.name,
                      }),
                    ],
                  },
                  o.name,
                ),
              ),
              (0, t.jsxs)("button", {
                onClick: z,
                className: "group flex flex-col items-center gap-2",
                children: [
                  (0, t.jsx)("div", {
                    className:
                      "flex size-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-zinc-600 shadow-sm transition-all group-hover:-translate-y-1 group-hover:scale-110 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
                    children: (0, t.jsx)(be, { size: 20, strokeWidth: 2.5 }),
                  }),
                  (0, t.jsx)("span", {
                    className:
                      "text-[10px] font-bold uppercase tracking-tighter text-zinc-500 dark:text-zinc-400",
                    children: "More",
                  }),
                ],
              }),
            ],
          }),
          (0, t.jsx)("div", {
            className: "px-5 pb-6",
            children: (0, t.jsxs)("div", {
              className: "group relative",
              children: [
                (0, t.jsx)("input", {
                  type: "text",
                  readOnly: !0,
                  value: s,
                  className:
                    "w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3.5 pl-4 pr-14 text-sm font-medium transition-colors focus:outline-none group-hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:group-hover:border-zinc-700",
                }),
                (0, t.jsx)("button", {
                  onClick: w,
                  className: `absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-xl h-10 px-4 text-xs font-bold shadow-sm transition-all active:scale-95 ${l ? "bg-emerald-500 text-white" : "bg-zinc-900 text-white hover:opacity-90 dark:bg-white dark:text-zinc-900"}`,
                  children: l
                    ? (0, t.jsxs)(t.Fragment, {
                        children: [
                          (0, t.jsx)(Vt, { size: 14, strokeWidth: 3 }),
                          (0, t.jsx)("span", { children: "Copied" }),
                        ],
                      })
                    : (0, t.jsxs)(t.Fragment, {
                        children: [
                          (0, t.jsx)(At, { size: 14, strokeWidth: 3 }),
                          (0, t.jsx)("span", { children: "Copy" }),
                        ],
                      }),
                }),
              ],
            }),
          }),
          (0, t.jsx)("div", {
            className: "px-5 pb-5",
            children: (0, t.jsxs)("button", {
              onClick: e,
              className:
                "group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-900 py-4 font-bold text-white transition-all hover:shadow-xl hover:shadow-zinc-900/10 active:scale-[0.98] dark:bg-white dark:text-zinc-900 dark:hover:shadow-white/10",
              children: [
                (0, t.jsx)("div", {
                  className:
                    "absolute inset-0 bg-gradient-to-r from-zinc-500 to-zinc-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                }),
                (0, t.jsx)("div", {
                  className: "relative flex items-center gap-2",
                  children: (0, t.jsx)("span", { children: "Close" }),
                }),
              ],
            }),
          }),
        ],
      }),
    });
  },
  gt = gi,
  vi = N.lazy(() =>
    ct(
      () => import("./dist-CXJwIUEX.js"),
      __vite__mapDeps([13, 1, 2, 3, 4, 5, 6, 7]),
    ).then((i) => ({ default: i.Plyr })),
  ),
  bi = N.memo(
    ({ reel: i, isActive: e, isMuted: s }) => {
      const r = ae(),
        { currentUser: l } = mt(),
        { addToast: a } = Ne(),
        n = (0, N.useRef)(null),
        [d, c] = (0, N.useState)(!1),
        [g, p] = (0, N.useState)(!1),
        [f, u] = (0, N.useState)(!1),
        [b, h] = (0, N.useState)(!1),
        [x, v] = (0, N.useState)(null),
        [m, w] = (0, N.useState)(!1),
        [k, j] = (0, N.useState)(i.stats?.likes || 0),
        [z, o] = (0, N.useState)(!1),
        [$, S] = (0, N.useState)(0),
        T = (0, N.useRef)(null),
        P = (0, N.useMemo)(
          () =>
            Array.isArray(i.media)
              ? i.media[0]?.src || i.media[0]?.url
              : i.media?.src || i.media?.url || i.url,
          [i.media, i.url],
        );
      ((0, N.useEffect)(() => {
        h(!1);
        const y = n.current?.plyr;
        if (y && typeof y.on == "function") {
          const _ = () => h(!0);
          return (
            y.on("ready", _),
            y.on("canplay", _),
            y.on("loadeddata", _),
            () => {
              typeof y.off == "function" &&
                (y.off("ready", _),
                y.off("canplay", _),
                y.off("loadeddata", _));
            }
          );
        } else {
          const _ = setTimeout(() => h(!0), 1e3);
          return () => clearTimeout(_);
        }
      }, [P]),
        (0, N.useEffect)(() => {
          let y;
          const _ = n.current?.plyr;
          return (
            _ &&
              b &&
              (e
                ? (y = setTimeout(() => {
                    if (typeof _.play == "function") {
                      const R = _.play();
                      R !== void 0 &&
                        R.catch(() => {
                          _ && ((_.muted = !0), _.play().catch(() => {}));
                        });
                    }
                  }, 100))
                : typeof _.pause == "function" && _.pause()),
            () => {
              y && clearTimeout(y);
            }
          );
        }, [e, b]),
        (0, N.useEffect)(() => {
          if (!l?.id || !e) return;
          (async () => {
            try {
              const [_, R] = await Promise.all([
                ds(i.id, l.id),
                ps(l.id, i.user?.id),
              ]);
              (w(_), o(R));
            } catch (_) {
              console.error("Failed to check interaction status:", _);
            }
          })();
        }, [i.id, l?.id, e, i.user?.id]),
        (0, N.useEffect)(() => {
          n.current?.plyr && (n.current.plyr.muted = s);
        }, [s]),
        (0, N.useEffect)(() => {
          const y = n.current?.plyr;
          if (!y || !e) return;
          const _ = () => {
            const R = y.currentTime,
              A = y.duration;
            A > 0 && S((R / A) * 100);
          };
          if (typeof y.on == "function")
            return (
              y.on("timeupdate", _),
              () => {
                typeof y.off == "function" && y.off("timeupdate", _);
              }
            );
        }, [e]),
        (0, N.useEffect)(
          () => () => {
            T.current && clearTimeout(T.current);
          },
          [],
        ));
      const C = (y) => {
          const _ = y.target;
          _.closest("button") ||
            _.closest("a") ||
            _.closest(".plyr__controls") ||
            (T.current
              ? (clearTimeout(T.current), (T.current = null), I())
              : (T.current = setTimeout(() => {
                  ((T.current = null), M());
                }, 250)));
        },
        M = () => {
          const y = n.current?.plyr;
          y &&
            (y.paused
              ? (y.play().catch(() => {}), v("play"))
              : (y.pause(), v("pause")),
            setTimeout(() => v(null), 800));
        },
        I = async () => {
          if (l && (c(!0), setTimeout(() => c(!1), 1e3), !m)) {
            (w(!0), j((y) => y + 1));
            try {
              await We(i.id, l.id);
            } catch {
              (w(!1), j((y) => y - 1));
            }
          }
        },
        E = async (y) => {
          if ((y.stopPropagation(), !l)) return;
          const _ = !m;
          (w(_), j((R) => (_ ? R + 1 : R - 1)));
          try {
            await We(i.id, l.id);
          } catch {
            (w(!_), j((R) => (_ ? R - 1 : R + 1)));
          }
        },
        D = async (y) => {
          if ((y.stopPropagation(), !l)) return;
          const _ = !z;
          o(_);
          try {
            await us(l.id, i.user?.id);
          } catch {
            o(!_);
          }
        },
        O = (y) => {
          (y.stopPropagation(), u(!0));
        },
        L = (0, N.useMemo)(
          () => ({
            source: { type: "video", sources: [{ src: P, type: "video/mp4" }] },
            options: {
              controls: [],
              loop: { active: !0 },
              clickToPlay: !1,
              ratio: "9:16",
              autoplay: !0,
              muted: !0,
              playsinline: !0,
            },
          }),
          [P],
        );
      return (0, t.jsxs)("div", {
        "data-id": i.id,
        className:
          "reel-item relative flex h-[100dvh] w-full snap-start items-center justify-center overflow-hidden bg-black cursor-pointer",
        onClick: C,
        children: [
          (0, t.jsxs)("div", {
            className:
              "relative flex h-full w-full max-w-[450px] items-center justify-center",
            children: [
              (0, t.jsx)("div", {
                className: "w-full",
                children: (0, t.jsx)(N.Suspense, {
                  fallback: (0, t.jsx)("div", {
                    className: "aspect-[9/16] w-full bg-zinc-900 animate-pulse",
                  }),
                  children: (0, t.jsx)(vi, { ref: n, ...L }),
                }),
              }),
              !b &&
                (0, t.jsx)("div", {
                  className:
                    "absolute inset-0 z-[60] flex items-center justify-center bg-zinc-900",
                  children: (0, t.jsx)(is, {}),
                }),
              d &&
                (0, t.jsx)("div", {
                  className:
                    "pointer-events-none absolute inset-0 z-50 flex items-center justify-center",
                  children: (0, t.jsx)("div", {
                    className:
                      "animate-in zoom-in-50 fade-out fill-mode-forwards duration-500",
                    children: (0, t.jsx)(fe, {
                      size: 120,
                      fill: "white",
                      className:
                        "scale-125 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]",
                    }),
                  }),
                }),
              x &&
                (0, t.jsx)("div", {
                  className:
                    "pointer-events-none absolute inset-0 z-50 flex items-center justify-center",
                  children: (0, t.jsx)("div", {
                    className:
                      "animate-in fade-in zoom-in-90 scale-100 animate-out zoom-out-110 fade-out fill-mode-forwards duration-500",
                    children: (0, t.jsx)("div", {
                      className:
                        "rounded-full border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md",
                      children:
                        x === "play"
                          ? (0, t.jsx)(Ht, {
                              size: 50,
                              fill: "white",
                              className: "ml-1.5 text-white",
                            })
                          : (0, t.jsx)(Wt, {
                              size: 50,
                              fill: "white",
                              className: "text-white",
                            }),
                    }),
                  }),
                }),
              (0, t.jsx)("div", {
                className:
                  "pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60",
              }),
              (0, t.jsxs)("div", {
                className:
                  "pointer-events-none absolute bottom-6 left-4 right-16 text-white",
                children: [
                  (0, t.jsxs)("div", {
                    className:
                      "pointer-events-auto mb-3 flex items-center gap-2",
                    children: [
                      (0, t.jsxs)(_t, {
                        to: `/u/${i.user?.handle}`,
                        className:
                          "flex items-center gap-2 transition-opacity hover:opacity-80",
                        onClick: (y) => y.stopPropagation(),
                        children: [
                          (0, t.jsxs)(Y, {
                            className: "size-10 border-2 border-white",
                            children: [
                              (0, t.jsx)(Z, {
                                src: i.user?.avatar,
                                alt: i.user?.handle,
                                className: "object-cover",
                              }),
                              (0, t.jsx)(ee, {
                                children: i.user?.handle?.[0]?.toUpperCase(),
                              }),
                            ],
                          }),
                          (0, t.jsxs)("span", {
                            className: "font-bold",
                            children: ["@", i.user?.handle],
                          }),
                        ],
                      }),
                      l?.id !== i.user?.id &&
                        (0, t.jsx)("button", {
                          className: `ml-2 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${z ? "border border-white/50 bg-transparent text-white" : "bg-white text-black hover:bg-zinc-200"}`,
                          onClick: D,
                          children: z
                            ? (0, t.jsxs)(t.Fragment, {
                                children: [
                                  (0, t.jsx)(vs, { size: 14 }),
                                  (0, t.jsx)("span", {
                                    className: "hidden sm:inline",
                                    children: "Following",
                                  }),
                                ],
                              })
                            : (0, t.jsxs)(t.Fragment, {
                                children: [
                                  (0, t.jsx)(fs, { size: 14 }),
                                  (0, t.jsx)("span", {
                                    className: "hidden sm:inline",
                                    children: "Follow",
                                  }),
                                ],
                              }),
                        }),
                    ],
                  }),
                  (0, t.jsx)(ye, {
                    options: {
                      ...we,
                      render: ({ attributes: y, content: _ }) => {
                        const { href: R, ...A } = y,
                          U =
                            !R.startsWith("/") &&
                            (R.startsWith("http") || R.startsWith("www"));
                        return R.startsWith("/u/") ||
                          R.startsWith("/tags/") ||
                          R.startsWith("/c/") ||
                          R.startsWith("/explore")
                          ? (0, t.jsx)(
                              "span",
                              {
                                ...A,
                                className:
                                  "cursor-pointer font-bold text-white hover:underline",
                                onClick: (V) => {
                                  (V.stopPropagation(), r(R));
                                },
                                children: _,
                              },
                              _,
                            )
                          : (0, t.jsx)(
                              "a",
                              {
                                href: R,
                                ...A,
                                className: "text-white hover:underline",
                                target: U ? "_blank" : void 0,
                                rel: U ? "noopener noreferrer" : void 0,
                                onClick: (V) => V.stopPropagation(),
                                children: _,
                              },
                              _,
                            );
                      },
                    },
                    children: (0, t.jsx)("p", {
                      className: "mb-3 line-clamp-2 text-sm",
                      children: i.content,
                    }),
                  }),
                  (0, t.jsxs)("div", {
                    className: "flex items-center gap-2 text-xs opacity-90",
                    children: [
                      (0, t.jsx)(qt, {
                        size: 14,
                        className: "animate-spin-slow",
                      }),
                      (0, t.jsxs)("span", {
                        children: ["Original Audio - ", i.user?.handle],
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className:
                  "absolute bottom-6 right-2 z-10 flex flex-col items-center gap-6",
                children: [
                  (0, t.jsxs)("div", {
                    className:
                      "pointer-events-auto flex flex-col items-center gap-1",
                    children: [
                      (0, t.jsx)("button", {
                        className: `rounded-full p-3 backdrop-blur-md transition-all active:scale-90 ${m ? "bg-rose-500/20 text-rose-500" : "bg-zinc-800/50 text-white hover:bg-zinc-700"}`,
                        onClick: E,
                        children: (0, t.jsx)(fe, {
                          size: 28,
                          fill: m ? "currentColor" : "none",
                        }),
                      }),
                      (0, t.jsx)("span", {
                        className: "text-xs font-bold text-white",
                        children: k,
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className:
                      "pointer-events-auto flex flex-col items-center gap-1",
                    children: [
                      (0, t.jsx)("button", {
                        className:
                          "rounded-full bg-zinc-800/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-zinc-700 active:scale-90",
                        onClick: (y) => {
                          (y.stopPropagation(), p(!0));
                        },
                        children: (0, t.jsx)(ft, { size: 28 }),
                      }),
                      (0, t.jsx)("span", {
                        className: "text-xs font-bold text-white",
                        children: i.stats?.comments || 0,
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className:
                      "pointer-events-auto flex flex-col items-center gap-1",
                    children: [
                      (0, t.jsx)("button", {
                        className:
                          "rounded-full bg-zinc-800/50 p-3 text-white backdrop-blur-md transition-colors hover:bg-zinc-700 active:scale-90",
                        onClick: O,
                        children: (0, t.jsx)(he, { size: 28 }),
                      }),
                      (0, t.jsx)("span", {
                        className: "text-xs font-bold text-white",
                        children: i.stats?.shares || 0,
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)("div", {
                className:
                  "absolute bottom-0 left-0 z-50 h-[3px] w-full bg-white/20",
                children: (0, t.jsx)("div", {
                  className:
                    "h-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-100 ease-linear",
                  style: { width: `${$}%` },
                }),
              }),
            ],
          }),
          (0, t.jsx)(zi, {
            isOpen: g,
            onClose: () => p(!1),
            reelId: i.id,
            currentUser: l,
            showToast: a,
          }),
          (0, t.jsx)(gt, {
            isOpen: f,
            onClose: () => u(!1),
            url: `${window.location.origin}/r/${i.id}`,
            title: "Share Reel",
          }),
        ],
      });
    },
    (i, e) =>
      i.isActive === e.isActive &&
      i.reel.id === e.reel.id &&
      i.isMuted === e.isMuted,
  ),
  Pi = bi,
  ji = ({ isOpen: i, onClose: e, reelId: s, currentUser: r, showToast: l }) => {
    const [a, n] = (0, N.useState)([]),
      [d, c] = (0, N.useState)(!1),
      [g, p] = (0, N.useState)(!1),
      [f, u] = (0, N.useState)(""),
      [b, h] = (0, N.useState)([]),
      [x, v] = (0, N.useState)(!1),
      [m, w] = (0, N.useState)(!0),
      [k, j] = (0, N.useState)(!1),
      [z, o] = (0, N.useState)(null),
      $ = (0, N.useRef)(a);
    (0, N.useEffect)(() => {
      $.current = a;
    }, [a]);
    const S = (0, N.useCallback)(
      async (P = !1) => {
        if (s) {
          P ? j(!0) : c(!0);
          try {
            const C = $.current,
              M = await ns(
                s,
                P && C.length > 0 ? C[C.length - 1].created_at : null,
                10,
              );
            (M.length < 10 ? w(!1) : w(!0), n(P ? (I) => [...I, ...M] : M));
          } catch (C) {
            (console.error("Failed to load comments:", C),
              l && l("Failed to load comments", "error"));
          } finally {
            (c(!1), j(!1));
          }
        }
      },
      [s, l],
    );
    (0, N.useEffect)(() => {
      i && s ? S() : (n([]), w(!0));
    }, [i, s, S]);
    const T = async (P) => {
      if ((P.preventDefault(), !((!f.trim() && b.length === 0) || !r))) {
        (p(!0), v(!0));
        try {
          const C = [];
          for (const M of b) {
            const I = await ze(M);
            C.push(I);
          }
          (await ts(s, r.id, f, C, z?.id),
            u(""),
            h([]),
            o(null),
            l && l("Reply posted!"),
            S());
        } catch (C) {
          (console.error("Failed to post comment:", C),
            l && l("Failed to post reply.", "error"));
        } finally {
          (p(!1), v(!1));
        }
      }
    };
    return (0, t.jsx)(xt, {
      isOpen: i,
      onClose: e,
      title: "Comments",
      className: "max-sm:h-[95dvh] h-[85vh] overflow-hidden !p-0 sm:max-w-xl",
      children: (0, t.jsxs)("div", {
        className:
          "flex h-full flex-col overflow-hidden bg-white dark:bg-zinc-900",
        children: [
          (0, t.jsx)("div", {
            className:
              "mx-auto my-3 h-1.5 w-12 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-800 sm:hidden",
          }),
          (0, t.jsx)("div", {
            className:
              "flex-1 overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800",
            children: d
              ? (0, t.jsx)("div", {
                  className: "flex flex-col",
                  children: [1, 2, 3].map((P) => (0, t.jsx)(es, {}, P)),
                })
              : a.length > 0
                ? (0, t.jsxs)("div", {
                    className: "flex flex-col",
                    children: [
                      a.map((P) =>
                        (0, t.jsx)(
                          ui,
                          {
                            ...P,
                            isComment: !0,
                            post_id: s,
                            currentUser: r,
                            showToast: l,
                            onReply: (C, M) => {
                              (o(M ? { handle: C, id: M } : null),
                                u((I) =>
                                  I.includes(`@${C}`) ? I : I + `@${C} `,
                                ));
                            },
                            onDelete: (C) =>
                              n((M) => M.filter((I) => I.id !== C)),
                            onUpdate: (C, M, I) =>
                              n((E) =>
                                E.map((D) =>
                                  D.id === C
                                    ? { ...D, content: M, media: I }
                                    : D,
                                ),
                              ),
                          },
                          P.id,
                        ),
                      ),
                      m &&
                        (0, t.jsxs)("button", {
                          onClick: () => S(!0),
                          disabled: k,
                          className:
                            "flex w-full items-center justify-center gap-2 py-6 text-sm font-bold text-violet-600 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900",
                          children: [
                            k &&
                              (0, t.jsx)("span", {
                                className: "mr-2 animate-pulse",
                                children: "...",
                              }),
                            "View more replies",
                          ],
                        }),
                    ],
                  })
                : (0, t.jsxs)("div", {
                    className:
                      "flex h-full min-h-[300px] flex-col items-center justify-center p-8 text-center text-zinc-500",
                    children: [
                      (0, t.jsx)("div", {
                        className:
                          "mb-4 flex size-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900",
                        children: (0, t.jsx)(dt, {
                          size: 32,
                          className: "text-zinc-400",
                        }),
                      }),
                      (0, t.jsx)("p", {
                        className: "text-lg font-bold dark:text-zinc-300",
                        children: "No comments yet",
                      }),
                      (0, t.jsx)("p", {
                        className: "text-sm dark:text-zinc-500",
                        children: "Be the first to share what you think!",
                      }),
                    ],
                  }),
          }),
          (0, t.jsxs)("div", {
            className:
              "shrink-0 border-t border-zinc-100 bg-white pb-safe dark:border-zinc-800 dark:bg-zinc-900",
            children: [
              z &&
                (0, t.jsxs)("div", {
                  className:
                    "flex items-center justify-between border-b border-zinc-50 bg-zinc-50/50 px-4 py-2 dark:border-zinc-800/50 dark:bg-zinc-900/50",
                  children: [
                    (0, t.jsxs)("span", {
                      className: "text-xs text-zinc-500",
                      children: [
                        "Replying to",
                        " ",
                        (0, t.jsxs)("span", {
                          className: "font-bold text-violet-600",
                          children: ["@", z.handle],
                        }),
                      ],
                    }),
                    (0, t.jsx)("button", {
                      onClick: () => o(null),
                      className:
                        "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200",
                      children: (0, t.jsx)(le, { size: 14 }),
                    }),
                  ],
                }),
              (0, t.jsx)(ht, {
                currentUser: r,
                newComment: f,
                setNewComment: u,
                handleSubmitComment: T,
                loading: g,
                selectedFiles: b,
                setSelectedFiles: h,
                isUploading: x,
              }),
            ],
          }),
        ],
      }),
    });
  },
  zi = ji,
  Ti = B();
export { ui as n, Pi as t };
