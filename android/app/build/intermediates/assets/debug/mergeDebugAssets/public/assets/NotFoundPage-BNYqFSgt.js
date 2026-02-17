import { a as m } from "./rolldown-runtime-BaZ8gS7u.js";
import { o as d, s as x } from "./animations-pEILWrFP.js";
import { c as f, u as o } from "./framework-di2JoXyY.js";
import { Zt as h, sr as u, wn as b } from "./ui-libs-yzUERV1o.js";
var p = f(),
  y = m(x(), 1),
  t = m(d(), 1),
  k = () => {
    const e = (0, p.c)(7);
    let r;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((r = (0, t.jsx)("h1", {
          className:
            "text-9xl font-black tracking-tighter text-zinc-100 dark:text-zinc-900",
          children: "404",
        })),
        (e[0] = r))
      : (r = e[0]);
    let s, a, i;
    e[1] === Symbol.for("react.memo_cache_sentinel")
      ? ((s = (0, t.jsxs)("div", {
          className: "relative mb-8",
          children: [
            r,
            (0, t.jsx)("div", {
              className: "absolute inset-0 flex items-center justify-center",
              children: (0, t.jsx)("div", {
                className:
                  "rounded-2xl bg-white p-4 shadow-2xl dark:bg-zinc-800",
                children: (0, t.jsx)(h, {
                  size: 48,
                  className: "text-violet-500 animate-pulse",
                }),
              }),
            }),
          ],
        })),
        (a = (0, t.jsx)("h2", {
          className:
            "text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl",
          children: "Page not found",
        })),
        (i = (0, t.jsx)("p", {
          className: "mt-4 max-w-md text-lg text-zinc-500",
          children:
            "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.",
        })),
        (e[1] = s),
        (e[2] = a),
        (e[3] = i))
      : ((s = e[1]), (a = e[2]), (i = e[3]));
    let l;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, t.jsxs)(o, {
          to: "/feed",
          className:
            "flex items-center justify-center gap-2 rounded-full bg-black px-8 py-3 font-bold text-white transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black",
          children: [(0, t.jsx)(b, { size: 20 }), "Back to Feed"],
        })),
        (e[4] = l))
      : (l = e[4]);
    let c;
    e[5] === Symbol.for("react.memo_cache_sentinel")
      ? ((c = (0, t.jsxs)("div", {
          className:
            "mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row",
          children: [
            l,
            (0, t.jsxs)("button", {
              onClick: v,
              className:
                "flex items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-3 font-bold text-black transition-all hover:bg-zinc-50 active:scale-95 dark:border-zinc-800 dark:bg-black dark:text-white dark:hover:bg-zinc-900",
              children: [(0, t.jsx)(u, { size: 20 }), "Go Back"],
            }),
          ],
        })),
        (e[5] = c))
      : (c = e[5]);
    let n;
    return (
      e[6] === Symbol.for("react.memo_cache_sentinel")
        ? ((n = (0, t.jsxs)("div", {
            className:
              "flex min-h-[60vh] flex-col items-center justify-center text-center",
            children: [
              s,
              a,
              i,
              c,
              (0, t.jsx)("div", {
                className: "mt-12",
                children: (0, t.jsxs)("p", {
                  className: "text-sm text-zinc-400",
                  children: [
                    "Think this is a mistake? ",
                    (0, t.jsx)(o, {
                      to: "/support",
                      className: "text-violet-500 hover:underline",
                      children: "Contact Support",
                    }),
                  ],
                }),
              }),
            ],
          })),
          (e[6] = n))
        : (n = e[6]),
      n
    );
  },
  w = k;
function v() {
  return window.history.back();
}
export { w as default };
