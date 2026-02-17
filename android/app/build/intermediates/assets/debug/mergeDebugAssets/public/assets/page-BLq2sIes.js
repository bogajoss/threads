import { a } from "./rolldown-runtime-BaZ8gS7u.js";
import { o, s as m } from "./animations-pEILWrFP.js";
import { _ as s, c as n } from "./framework-di2JoXyY.js";
import "./database-CdmW3A7f.js";
import "./ui-libs-yzUERV1o.js";
import "./media-libs-D2H42K39.js";
import { s as p } from "./index-ZcVyY9rV.js";
import { t as c } from "./AuthForm-B8pES_9O.js";
var u = n(),
  b = a(m(), 1),
  i = a(o(), 1),
  _ = () => {
    const r = (0, u.c)(2),
      e = s();
    let t;
    return (
      r[0] !== e
        ? ((t = (0, i.jsx)("div", {
            className:
              "flex min-h-screen items-center justify-center bg-white p-4 dark:bg-black",
            children: (0, i.jsx)(p, {
              children: (0, i.jsx)(c, {
                type: "signup",
                onComplete: () => e("/"),
                onSwitch: () => e("/login"),
              }),
            }),
          })),
          (r[0] = e),
          (r[1] = t))
        : (t = r[1]),
      t
    );
  },
  q = _;
export { q as default };
