import { a as C } from "./rolldown-runtime-BaZ8gS7u.js";
import {
  E as F,
  b as H,
  c as P,
  d as U,
  t as q,
} from "./framework-CsA6nn9m.js";
import "./database-BiY55TQY.js";
import { en as E, vn as L } from "./ui-libs-Px4MBmNX.js";
import "./media-libs-Btb8RX-I.js";
import "./animations-T0TOZv2c.js";
import {
  D as M,
  E as R,
  F as A,
  P as $,
  at as B,
  it as W,
  rt as Y,
  y as D,
} from "./index-0Nj-jM9P.js";
import "./VideoPlayer-BtC_qOtL.js";
import { n as I } from "./post-oiE9jMza.js";
import "./text-processing-DFvQvkgt.js";
import "./linkify-BIniK2-v.js";
import { o as T } from "./hooks-wSD5Qk1m.js";
var G = P(),
  ce = C(F(), 1),
  s = C(U(), 1),
  J = (v) => {
    const e = (0, G.c)(24),
      { user: t, onClick: d, isAddStory: l, isSeen: r } = v,
      n = l === void 0 ? !1 : l,
      u = `relative p-0.5 rounded-full ${n ? "bg-transparent" : r !== void 0 && r ? "bg-zinc-200 dark:bg-zinc-800" : "bg-gradient-to-tr from-yellow-400 via-pink-500 to-violet-600"}`;
    let c;
    e[0] !== t.avatar || e[1] !== t.handle
      ? ((c = (0, s.jsx)(B, {
          src: t.avatar,
          alt: t.handle,
          className: "object-cover",
        })),
        (e[0] = t.avatar),
        (e[1] = t.handle),
        (e[2] = c))
      : (c = e[2]);
    let i;
    e[3] !== t.handle?.[0]
      ? ((i = t.handle?.[0]?.toUpperCase()), (e[3] = t.handle?.[0]), (e[4] = i))
      : (i = e[4]);
    let a;
    e[5] !== i
      ? ((a = (0, s.jsx)(W, { children: i })), (e[5] = i), (e[6] = a))
      : (a = e[6]);
    let o;
    e[7] !== c || e[8] !== a
      ? ((o = (0, s.jsxs)(Y, {
          className:
            "size-14 border border-zinc-100 dark:border-zinc-800 sm:size-16",
          children: [c, a],
        })),
        (e[7] = c),
        (e[8] = a),
        (e[9] = o))
      : (o = e[9]);
    let m;
    e[10] !== n
      ? ((m =
          n &&
          (0, s.jsx)("div", {
            className:
              "absolute bottom-0 right-0 rounded-full border-2 border-white bg-violet-600 p-1 text-white shadow-lg dark:border-black",
            children: (0, s.jsx)(E, { size: 14, strokeWidth: 3 }),
          })),
        (e[10] = n),
        (e[11] = m))
      : (m = e[11]);
    let h;
    e[12] !== o || e[13] !== m
      ? ((h = (0, s.jsx)("div", {
          className: "rounded-full bg-white p-0.5 dark:bg-black",
          children: (0, s.jsxs)("div", {
            className: "relative",
            children: [o, m],
          }),
        })),
        (e[12] = o),
        (e[13] = m),
        (e[14] = h))
      : (h = e[14]);
    let f;
    e[15] !== u || e[16] !== h
      ? ((f = (0, s.jsx)("div", { className: u, children: h })),
        (e[15] = u),
        (e[16] = h),
        (e[17] = f))
      : (f = e[17]);
    const p = n ? "Add Story" : t.handle;
    let x;
    e[18] !== p
      ? ((x = (0, s.jsx)("span", {
          className:
            "w-16 truncate text-center text-[11px] font-semibold leading-tight text-zinc-600 dark:text-zinc-400",
          children: p,
        })),
        (e[18] = p),
        (e[19] = x))
      : (x = e[19]);
    let b;
    return (
      e[20] !== d || e[21] !== f || e[22] !== x
        ? ((b = (0, s.jsxs)("button", {
            onClick: d,
            className: "group flex shrink-0 flex-col items-center gap-2",
            children: [f, x],
          })),
          (e[20] = d),
          (e[21] = f),
          (e[22] = x),
          (e[23] = b))
        : (b = e[23]),
      b
    );
  },
  S = J,
  w = P(),
  K = (v) => {
    const e = (0, w.c)(19),
      { currentUser: t, groupedStories: d, onAddStory: l, onStoryClick: r } = v;
    let n;
    e[0] !== t || e[1] !== l
      ? ((n = t && (0, s.jsx)(S, { user: t, isAddStory: !0, onClick: l })),
        (e[0] = t),
        (e[1] = l),
        (e[2] = n))
      : (n = e[2]);
    let u;
    if (e[3] !== d || e[4] !== r) {
      let h;
      (e[6] !== r
        ? ((h = (f) =>
            (0, s.jsx)(
              S,
              { user: f.user, isSeen: f.isSeen, onClick: () => r(f) },
              f.user.id,
            )),
          (e[6] = r),
          (e[7] = h))
        : (h = e[7]),
        (u = d.map(h)),
        (e[3] = d),
        (e[4] = r),
        (e[5] = u));
    } else u = e[5];
    let c;
    e[8] !== n || e[9] !== u
      ? ((c = (0, s.jsxs)("div", {
          className: "flex w-max gap-4 px-4 py-4",
          children: [n, u],
        })),
        (e[8] = n),
        (e[9] = u),
        (e[10] = c))
      : (c = e[10]);
    let i;
    e[11] === Symbol.for("react.memo_cache_sentinel")
      ? ((i = (0, s.jsx)(A, {
          orientation: "horizontal",
          className: "hidden",
        })),
        (e[11] = i))
      : (i = e[11]);
    let a;
    e[12] !== c
      ? ((a = (0, s.jsxs)($, {
          className:
            "w-full border-b border-zinc-100 bg-white dark:bg-black dark:border-zinc-800",
          children: [c, i],
        })),
        (e[12] = c),
        (e[13] = a))
      : (a = e[13]);
    let o;
    e[14] !== t
      ? ((o =
          !t &&
          (0, s.jsx)("div", {
            className: "px-4 py-2 md:hidden",
            children: (0, s.jsx)(M, { className: "p-6" }),
          })),
        (e[14] = t),
        (e[15] = o))
      : (o = e[15]);
    let m;
    return (
      e[16] !== a || e[17] !== o
        ? ((m = (0, s.jsxs)("div", {
            className: "bg-white dark:bg-black",
            children: [a, o],
          })),
          (e[16] = a),
          (e[17] = o),
          (e[18] = m))
        : (m = e[18]),
      m
    );
  },
  O = (v) => {
    const e = (0, w.c)(4),
      { isFetchingNextPage: t, hasMore: d, hasPosts: l } = v;
    let r;
    return (
      e[0] !== d || e[1] !== l || e[2] !== t
        ? ((r = (0, s.jsx)("div", {
            className: "flex justify-center py-8",
            children: t
              ? (0, s.jsx)(L, {
                  className: "animate-spin text-violet-500",
                  size: 24,
                })
              : d
                ? (0, s.jsx)("div", { className: "h-4" })
                : l
                  ? (0, s.jsx)("p", {
                      className: "text-sm font-medium text-zinc-500",
                      children: "You've reached the end of the feed.",
                    })
                  : (0, s.jsxs)("div", {
                      className: "p-20 text-center text-zinc-500",
                      children: [
                        (0, s.jsx)("p", {
                          className: "text-lg font-medium",
                          children: "No posts yet.",
                        }),
                        (0, s.jsx)("p", {
                          className: "text-sm",
                          children: "Be the first to share something amazing!",
                        }),
                      ],
                    }),
          })),
          (e[0] = d),
          (e[1] = l),
          (e[2] = t),
          (e[3] = r))
        : (r = e[3]),
      r
    );
  },
  Q = (v) => {
    const e = (0, w.c)(31),
      { onStoryClick: t } = v,
      d = H(),
      {
        currentUser: l,
        homePosts: r,
        groupedStories: n,
        isPostsLoading: u,
        isStoriesLoading: c,
        hasMore: i,
        isFetchingNextPage: a,
        fetchNextPage: o,
        refreshPosts: m,
        handlePostClick: h,
        handleUserClick: f,
      } = T();
    if (u || c) {
      let z;
      return (
        e[0] === Symbol.for("react.memo_cache_sentinel")
          ? ((z = (0, s.jsxs)("div", {
              className:
                "min-h-screen overflow-hidden rounded-none border-y border-zinc-100 bg-white dark:bg-black dark:border-zinc-800 md:rounded-xl md:border",
              children: [
                (0, s.jsxs)($, {
                  className:
                    "w-full whitespace-nowrap border-b border-zinc-100 dark:border-zinc-800",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "flex w-max gap-3 px-4 py-4",
                      children: [
                        (0, s.jsx)("div", {
                          className:
                            "size-16 shrink-0 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900",
                        }),
                        (0, s.jsx)("div", {
                          className:
                            "size-16 shrink-0 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900",
                        }),
                        (0, s.jsx)("div", {
                          className:
                            "size-16 shrink-0 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900",
                        }),
                      ],
                    }),
                    (0, s.jsx)(A, {
                      orientation: "horizontal",
                      className: "hidden",
                    }),
                  ],
                }),
                [1, 2, 3].map(V),
              ],
            })),
            (e[0] = z))
          : (z = e[0]),
        z
      );
    }
    let p;
    e[1] !== m
      ? ((p = async () => await m()), (e[1] = m), (e[2] = p))
      : (p = e[2]);
    let x;
    e[3] !== l || e[4] !== n || e[5] !== d || e[6] !== t
      ? ((x = () =>
          (0, s.jsx)(K, {
            currentUser: l,
            groupedStories: n,
            onAddStory: () => d("/create", { state: { isStory: !0 } }),
            onStoryClick: t,
          })),
        (e[3] = l),
        (e[4] = n),
        (e[5] = d),
        (e[6] = t),
        (e[7] = x))
      : (x = e[7]);
    let b;
    e[8] !== i || e[9] !== r || e[10] !== a
      ? ((b = () =>
          (0, s.jsx)(O, {
            isFetchingNextPage: a,
            hasMore: i,
            hasPosts: r.length > 0,
          })),
        (e[8] = i),
        (e[9] = r),
        (e[10] = a),
        (e[11] = b))
      : (b = e[11]);
    let g;
    e[12] !== x || e[13] !== b
      ? ((g = { Header: x, Footer: b }), (e[12] = x), (e[13] = b), (e[14] = g))
      : (g = e[14]);
    let j;
    e[15] !== o || e[16] !== i || e[17] !== a
      ? ((j = () => {
          i && !a && o();
        }),
        (e[15] = o),
        (e[16] = i),
        (e[17] = a),
        (e[18] = j))
      : (j = e[18]);
    let k;
    e[19] !== l || e[20] !== h || e[21] !== f
      ? ((k = (z, y) =>
          (0, s.jsx)(
            I,
            { ...y, currentUser: l, onClick: () => h(y.id), onUserClick: f },
            y.feed_id || y.id,
          )),
        (e[19] = l),
        (e[20] = h),
        (e[21] = f),
        (e[22] = k))
      : (k = e[22]);
    let N;
    e[23] !== r || e[24] !== g || e[25] !== j || e[26] !== k
      ? ((N = (0, s.jsx)(q, {
          useWindowScroll: !0,
          data: r,
          components: g,
          endReached: j,
          itemContent: k,
        })),
        (e[23] = r),
        (e[24] = g),
        (e[25] = j),
        (e[26] = k),
        (e[27] = N))
      : (N = e[27]);
    let _;
    return (
      e[28] !== p || e[29] !== N
        ? ((_ = (0, s.jsx)("div", {
            className:
              "w-full max-w-full overflow-hidden min-h-screen rounded-none border-y border-zinc-100 bg-white shadow-sm dark:bg-black dark:border-zinc-800 md:rounded-xl md:border",
            children: (0, s.jsx)(D, { onRefresh: p, children: N }),
          })),
          (e[28] = p),
          (e[29] = N),
          (e[30] = _))
        : (_ = e[30]),
      _
    );
  },
  me = Q;
function V(v) {
  return (0, s.jsx)(R, {}, v);
}
export { me as default };
