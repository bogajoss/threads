import { a as l } from "./rolldown-runtime-BaZ8gS7u.js";
import { o as i, s as n } from "./animations-pEILWrFP.js";
import { c as m } from "./framework-di2JoXyY.js";
var u = m(),
  p = l(n(), 1),
  t = l(i(), 1),
  d = () => {
    const e = (0, u.c)(5);
    let s, r;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((s = (0, t.jsx)("h1", {
          className: "text-4xl font-extrabold tracking-tight lg:text-5xl",
          children: "Terms of Service",
        })),
        (r = (0, t.jsx)("p", {
          className: "text-xl text-zinc-500",
          children: "Last updated: February 7, 2026",
        })),
        (e[0] = s),
        (e[1] = r))
      : ((s = e[0]), (r = e[1]));
    let o;
    e[2] === Symbol.for("react.memo_cache_sentinel")
      ? ((o = (0, t.jsxs)("section", {
          className: "mt-8 space-y-4",
          children: [
            (0, t.jsx)("h2", {
              className: "text-2xl font-bold",
              children: "1. Acceptance of Terms",
            }),
            (0, t.jsx)("p", {
              children:
                "By accessing or using Sysm, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.",
            }),
          ],
        })),
        (e[2] = o))
      : (o = e[2]);
    let a;
    e[3] === Symbol.for("react.memo_cache_sentinel")
      ? ((a = (0, t.jsxs)("section", {
          className: "space-y-4",
          children: [
            (0, t.jsx)("h2", {
              className: "text-2xl font-bold",
              children: "2. User Conduct",
            }),
            (0, t.jsx)("p", {
              children:
                "You are responsible for your use of Sysm and for any content you provide. You agree to use the service in compliance with all applicable laws and regulations.",
            }),
          ],
        })),
        (e[3] = a))
      : (a = e[3]);
    let c;
    return (
      e[4] === Symbol.for("react.memo_cache_sentinel")
        ? ((c = (0, t.jsxs)("div", {
            className: "space-y-6",
            children: [
              s,
              r,
              o,
              a,
              (0, t.jsxs)("section", {
                className: "space-y-4",
                children: [
                  (0, t.jsx)("h2", {
                    className: "text-2xl font-bold",
                    children: "3. Content",
                  }),
                  (0, t.jsx)("p", {
                    children:
                      "You retain your rights to any content you submit, post or display on or through the services. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license.",
                  }),
                ],
              }),
            ],
          })),
          (e[4] = c))
        : (c = e[4]),
      c
    );
  },
  y = d;
export { y as default };
