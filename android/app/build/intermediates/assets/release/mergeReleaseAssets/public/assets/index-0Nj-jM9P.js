const __vite__mapDeps = (
  i,
  m = __vite__mapDeps,
  d = m.f ||
    (m.f = [
      "assets/Feed-By6ojyuU.js",
      "assets/framework-CsA6nn9m.js",
      "assets/rolldown-runtime-BaZ8gS7u.js",
      "assets/framework-sg0yWRLc.css",
      "assets/ui-libs-Px4MBmNX.js",
      "assets/database-BiY55TQY.js",
      "assets/media-libs-Btb8RX-I.js",
      "assets/media-libs-CqCaMccn.css",
      "assets/animations-T0TOZv2c.js",
      "assets/linkify-BIniK2-v.js",
      "assets/text-processing-DFvQvkgt.js",
      "assets/post-oiE9jMza.js",
      "assets/query-QyXblnmD.js",
      "assets/hooks-wSD5Qk1m.js",
      "assets/VideoPlayer-BtC_qOtL.js",
      "assets/Explore-DpXENYG0.js",
      "assets/Reels-BekNg6ft.js",
      "assets/Messages-DPoCwTUt.js",
      "assets/VoiceMessage-D3bDCDxJ.js",
      "assets/Notifications-CP_711Pc.js",
      "assets/Profile-Bh7ABJcU.js",
      "assets/Community-OKlOQ4LF.js",
      "assets/PostDetails-DMIybPbX.js",
      "assets/Settings-DJ9MgSaS.js",
      "assets/HashtagFeed-C6BG_EzP.js",
      "assets/CreatePost-CEzBUgGT.js",
      "assets/page-DPT-HTUW.js",
      "assets/AuthForm-o2t8FMOD.js",
      "assets/page-U4iB1b1x.js",
    ]),
) => i.map((i) => d[i]);
import { a as ds } from "./rolldown-runtime-BaZ8gS7u.js";
import {
  C as ce,
  E as hr,
  _ as Q,
  a as pr,
  b as ye,
  c as H,
  d as xr,
  f as gr,
  g as vr,
  h as _t,
  i as br,
  m as ms,
  o as wr,
  p as us,
  v as yr,
  w as jr,
  y as pt,
} from "./framework-CsA6nn9m.js";
import {
  a as Ie,
  i as _r,
  n as we,
  o as Nr,
  r as Le,
  t as kr,
} from "./query-QyXblnmD.js";
import { t as zr } from "./database-BiY55TQY.js";
import {
  $ as fs,
  $n as Cr,
  A as hs,
  B as ps,
  Bn as Sr,
  Bt as xs,
  C as $r,
  Cn as Pr,
  Ct as Er,
  D as Mr,
  Dt as Rr,
  E as gs,
  Et as Lr,
  F as vs,
  Fn as Tr,
  Ft as Ir,
  G as bs,
  Gn as xt,
  H as ws,
  Hn as gt,
  I as Ar,
  J as ys,
  K as js,
  Kt as _s,
  L as xd,
  M as qr,
  Mt as St,
  N as Ns,
  Nn as Vt,
  Nt as ft,
  O as Fr,
  P as ks,
  Q as gd,
  Qn as Dr,
  R as zs,
  Rn as Cs,
  Rt as Hr,
  S as Ss,
  Sn as Vr,
  St as Or,
  T as vd,
  Tt as bd,
  U as $s,
  Un as Ps,
  V as wd,
  Vn as Br,
  Vt as Wr,
  W as Ur,
  Wn as Es,
  X as Ms,
  Xt as vt,
  Y as Rs,
  Yn as Gr,
  Z as Kr,
  Zn as Qr,
  Zt as Yr,
  _ as Ls,
  _t as yd,
  a as Ts,
  an as Zr,
  at as Jr,
  b as Xr,
  bn as ei,
  bt as Is,
  c as As,
  ct as qs,
  d as Fs,
  dt as Ds,
  en as $t,
  er as Nt,
  et as ti,
  f as si,
  ft as Hs,
  g as Vs,
  gn as ai,
  gt as Os,
  h as Bs,
  ht as ri,
  i as Ws,
  it as Us,
  j as Gs,
  k as ii,
  kn as ni,
  kt as et,
  l as oi,
  ln as li,
  lt as Ks,
  m as Qs,
  mn as ci,
  mt as di,
  n as Ys,
  nr as mi,
  nt as jd,
  o as _d,
  ot as Zs,
  p as ui,
  pt as Js,
  q as Nd,
  qn as ht,
  qt as fi,
  r as hi,
  rt as Xs,
  s as pi,
  sn as xi,
  st as ea,
  t as ta,
  tr as gi,
  tt as sa,
  u as vi,
  ut as aa,
  v as bi,
  vn as $e,
  vt as wi,
  w as yi,
  wn as ji,
  wt as ra,
  x as ia,
  xt as na,
  y as _i,
  yt as oa,
  z as Ni,
  zn as ki,
} from "./ui-libs-Px4MBmNX.js";
import { i as zi } from "./media-libs-Btb8RX-I.js";
import { i as la, n as Ci, r as Si, t as $i } from "./animations-T0TOZv2c.js";
(function () {
  const e = document.createElement("link").relList;
  if (e && e.supports && e.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) a(r);
  new MutationObserver((r) => {
    for (const n of r)
      if (n.type === "childList")
        for (const o of n.addedNodes)
          o.tagName === "LINK" && o.rel === "modulepreload" && a(o);
  }).observe(document, { childList: !0, subtree: !0 });
  function t(r) {
    const n = {};
    return (
      r.integrity && (n.integrity = r.integrity),
      r.referrerPolicy && (n.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === "use-credentials"
        ? (n.credentials = "include")
        : r.crossOrigin === "anonymous"
          ? (n.credentials = "omit")
          : (n.credentials = "same-origin"),
      n
    );
  }
  function a(r) {
    if (r.ep) return;
    r.ep = !0;
    const n = t(r);
    fetch(r.href, n);
  }
})();
var Pi = jr(),
  p = ds(hr(), 1),
  Ei = "https://lxywfmyoeovzthfmphbl.supabase.co",
  Mi =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4eXdmbXlvZW92enRoZm1waGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwODE0NzMsImV4cCI6MjA4NTY1NzQ3M30.z6JKtuav_V231RxgjvMs-KFn5W-fDIGWMX33DGxKPSI";
const N = zr(Ei, Mi);
var Ri = H();
function E(...s) {
  return gi(mi(s));
}
const Li = () => {
    const s = (0, Ri.c)(2),
      { pathname: e } = pt();
    let t;
    return (
      s[0] !== e ? ((t = [e]), (s[0] = e), (s[1] = t)) : (t = s[1]),
      (0, p.useEffect)(Ii, t),
      null
    );
  },
  kt = (s) =>
    typeof s != "string"
      ? !1
      : /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          s,
        ),
  Ti = (s, e) => {
    const t = document.createElement("canvas"),
      a = s.naturalWidth / s.width,
      r = s.naturalHeight / s.height;
    ((t.width = e.width * a), (t.height = e.height * r));
    const n = t.getContext("2d");
    return n
      ? ((n.imageSmoothingEnabled = !0),
        (n.imageSmoothingQuality = "high"),
        n.drawImage(
          s,
          e.x * a,
          e.y * r,
          e.width * a,
          e.height * r,
          0,
          0,
          e.width * a,
          e.height * r,
        ),
        new Promise((o, l) => {
          t.toBlob(
            (c) => {
              if (!c) {
                l(new Error("Canvas is empty"));
                return;
              }
              o(c);
            },
            "image/jpeg",
            0.95,
          );
        }))
      : Promise.reject(new Error("No 2d context"));
  },
  ca = (s) => {
    if (!s) return "";
    const e = typeof s == "string" ? new Date(s) : s,
      t = new Date().getTime() - e.getTime(),
      a = Math.floor(t / 1e3),
      r = Math.floor(a / 60),
      n = Math.floor(r / 60),
      o = Math.floor(n / 24);
    return a < 60
      ? "Just now"
      : r < 60
        ? `${r}m ago`
        : n < 24
          ? `${n}h ago`
          : o < 7
            ? `${o}d ago`
            : e.toLocaleDateString(void 0, {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              });
  },
  Cd = (s) => (typeof s != "string" ? !1 : /[\u0980-\u09FF]/.test(s)),
  Sd = (s) => {
    if (!s) return null;
    const e = s.match(/(https?:\/\/[^\s]+)/g);
    return e ? e[0] : null;
  };
function Ii() {
  window.scrollTo(0, 0);
}
const je = (s) =>
    s
      ? {
          id: s.id,
          handle: s.username,
          name: s.display_name,
          avatar: s.avatar_url || "/default-avatar.webp",
          cover: s.cover_url || "/welcome-banner.webp",
          verified: s.is_verified,
          bio: s.bio,
          location: s.location,
          website: s.website,
          follower_count: s.follower_count || 0,
          following_count: s.following_count || 0,
          lastSeen: s.last_seen_at,
        }
      : null,
  Pe = (s) => {
    if (!s) return null;
    const e = s.reposter_id || s.reposter_data?.id || s.reposted_by?.id,
      t = new Date(s.sort_timestamp || s.created_at).getTime(),
      a = `${s.feed_id || (e ? `${s.id}-${e}` : `${s.id}-orig`)}-${t}`,
      r = je(s.author_data || s.user);
    return r
      ? {
          ...s,
          feed_id: a,
          stats: {
            comments: s.comments_count || 0,
            likes: s.likes_count || 0,
            reposts: s.mirrors_count || 0,
            views: s.views_count || 0,
            shares: s.shares_count || 0,
          },
          user: r,
          community:
            s.community_data || s.communities
              ? {
                  ...(s.community_data || s.communities),
                  avatar:
                    (s.community_data || s.communities).avatar_url ||
                    (s.community_data || s.communities).avatar,
                }
              : null,
          repostedBy: s.reposter_data
            ? {
                handle: s.reposter_data.username,
                name: s.reposter_data.display_name,
                id: s.reposter_data.id,
              }
            : s.reposted_by
              ? {
                  handle: s.reposted_by.username,
                  name: s.reposted_by.display_name,
                  id: s.reposted_by.id,
                }
              : null,
          commenterAvatars: s.commenter_avatars || [],
          timeAgo: ca(s.created_at),
        }
      : null;
  },
  da = (s) => {
    if (!s) return null;
    const e = je(s.user);
    return e
      ? {
          ...s,
          parent_id: s.parent_id,
          stats: { likes: s.likes_count || 0, comments: s.replies_count || 0 },
          user: e,
          timeAgo: ca(s.created_at),
        }
      : null;
  },
  Ai = (s) =>
    s
      ? {
          ...s,
          user: s.actor?.username,
          avatar: s.actor?.avatar_url || "/default-avatar.webp",
        }
      : null,
  ma = (s) => {
    if (!s) return null;
    const e = je(s.user);
    return e ? { ...s, media: s.media_url, user: e } : null;
  },
  it = (s) =>
    s
      ? {
          id: s.id,
          handle: s.handle,
          name: s.name,
          description: s.description,
          avatar: s.avatar_url || "/default-avatar.webp",
          cover: s.cover_url || "/welcome-banner.webp",
          membersCount: s.members_count || 0,
          postsCount: s.posts_count || 0,
          isPrivate: s.is_private,
          createdAt: s.created_at,
          type: "community",
          creatorId: s.creator_id,
        }
      : null,
  Mt = (s) =>
    s
      ? {
          id: s.id,
          conversation_id: s.conversation_id,
          sender_id: s.sender_id,
          sender: je(s.sender),
          content: s.content,
          type: s.type || "text",
          media: s.media || [],
          reply_to_id: s.reply_to_id,
          is_read: s.is_read,
          created_at: s.created_at,
        }
      : null,
  qi = (s, e) => {
    if (!s || !s.conversation) return null;
    const t = s.conversation,
      a = t.is_group
        ? null
        : t.participants?.find((n) => n.user?.id !== e) || t.participants?.[0],
      r =
        t.messages?.filter((n) =>
          n.is_read
            ? !1
            : n.sender_id &&
              e &&
              n.sender_id.toString().toLowerCase() !==
                e.toString().toLowerCase(),
        ).length || 0;
    return {
      id: t.id,
      isGroup: t.is_group || !1,
      name: t.name || null,
      avatar: t.avatar_url || null,
      creatorId: t.creator_id || null,
      user: a ? je(a.user) : null,
      lastMessage: t.last_message_content || "No messages yet",
      lastMessageAt: t.last_message_at,
      time: t.last_message_at
        ? new Date(t.last_message_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      unread: r,
    };
  },
  Fi = async (s, e = {}) => {
    if (!s.type.startsWith("image/")) return s;
    const t = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1920,
      useWebWorker: !0,
      initialQuality: 0.75,
      fileType: "image/webp",
      alwaysKeepResolution: !0,
      ...e,
    };
    try {
      const a = await zi(s, t);
      return (
        console.log(`Original size: ${(s.size / 1024 / 1024).toFixed(2)} MB`),
        console.log(`Compressed size: ${(a.size / 1024 / 1024).toFixed(2)} MB`),
        a
      );
    } catch (a) {
      return (console.error("Image compression failed:", a), s);
    }
  },
  Di = (s, e = 1) =>
    new Promise((t, a) => {
      const r = document.createElement("video");
      ((r.preload = "metadata"),
        (r.src = URL.createObjectURL(s)),
        (r.muted = !0),
        (r.playsInline = !0),
        (r.onloadedmetadata = () => {
          r.currentTime = e;
        }),
        (r.onseeked = () => {
          const n = document.createElement("canvas");
          ((n.width = r.videoWidth), (n.height = r.videoHeight));
          const o = n.getContext("2d");
          if (!o) {
            (URL.revokeObjectURL(r.src),
              a(new Error("Could not get canvas context")));
            return;
          }
          (o.drawImage(r, 0, 0, n.width, n.height),
            n.toBlob(
              (l) => {
                if (!l) {
                  (URL.revokeObjectURL(r.src),
                    a(new Error("Could not create blob")));
                  return;
                }
                const c = new File([l], "thumbnail.webp", {
                  type: "image/webp",
                });
                (URL.revokeObjectURL(r.src), t(c));
              },
              "image/webp",
              0.7,
            ));
        }),
        (r.onerror = (n) => a(n)));
    }),
  Te = async (s, e = "media", t = null) => {
    let a = s,
      r = s.name.split(".").pop(),
      n = null;
    if (s.type.startsWith("image/"))
      try {
        ((a = await Fi(s)), (r = "webp"));
      } catch (m) {
        console.error("Image compression failed, uploading original:", m);
      }
    if (s.type.startsWith("video/"))
      try {
        t ? (n = (await Te(t, e)).url) : (n = (await Te(await Di(s), e)).url);
      } catch (m) {
        console.error("Failed to handle video poster:", m);
      }
    const o = `${`${crypto.randomUUID()}.${r}`}`,
      { data: l, error: c } = await N.storage.from(e).upload(o, a);
    if (c) throw c;
    const {
      data: { publicUrl: d },
    } = N.storage.from(e).getPublicUrl(l.path);
    return {
      url: d,
      poster: n,
      name: s.name,
      type: s.type.startsWith("image/")
        ? "image"
        : s.type.startsWith("video/")
          ? "video"
          : s.type.startsWith("audio/")
            ? "audio"
            : "file",
      size: a.size,
    };
  },
  at = async (s, e = "media") => {
    try {
      if (!s) return;
      const t = s.split(`/public/${e}/`);
      if (t.length < 2) return;
      const a = t[1],
        { error: r } = await N.storage.from(e).remove([a]);
      r && console.error(`Failed to delete file from storage: ${a}`, r);
    } catch (t) {
      console.error("Error in deleteFileFromUrl:", t);
    }
  },
  rt = async (s, e = "media") => {
    const t = s.filter((a) => !!a);
    t.length !== 0 && (await Promise.all(t.map((a) => at(a, e))));
  },
  ua = async (s, e = 10) => {
    const { data: t, error: a } = await N.from("users")
      .select("*")
      .or(`username.ilike.%${s}%,display_name.ilike.%${s}%`)
      .limit(e);
    if (a) throw a;
    return (t || []).map(je).filter((r) => r !== null);
  },
  fa = async (s, e = "id") => {
    let t = N.from("users").select("*");
    e === "id" ? (t = t.eq("id", s)) : (t = t.ilike("username", s));
    const { data: a, error: r } = await t.maybeSingle();
    if (r) throw r;
    return a ? je(a) : null;
  },
  $d = (s) => fa(s, "username"),
  Re = async (s) => {
    if (!s) return;
    const { error: e } = await N.from("users")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", s);
    if (e) throw e;
  },
  Hi = async (s, e) => {
    if (e.avatar || e.cover) {
      const { data: r } = await N.from("users")
        .select("avatar_url, cover_url")
        .eq("id", s)
        .single();
      r &&
        (e.avatar &&
          r.avatar_url &&
          r.avatar_url !== e.avatar &&
          r.avatar_url.includes(
            N.storage.from("media").getPublicUrl("").data.publicUrl,
          ) &&
          (await at(r.avatar_url)),
        e.cover &&
          r.cover_url &&
          r.cover_url !== e.cover &&
          r.cover_url.includes(
            N.storage.from("media").getPublicUrl("").data.publicUrl,
          ) &&
          (await at(r.cover_url)));
    }
    const t = {
      display_name: e.name,
      username: e.handle,
      avatar_url: e.avatar,
      bio: e.bio,
      cover_url: e.cover,
      website: e.website,
      location: e.location,
    };
    Object.keys(t).forEach((r) => t[r] === void 0 && delete t[r]);
    const { error: a } = await N.from("users").update(t).eq("id", s);
    if (a) throw a;
  },
  Vi = async (s, e) => {
    const { data: t } = await N.from("follows")
      .select("*")
      .eq("follower_id", s)
      .eq("following_id", e)
      .maybeSingle();
    return t
      ? (await N.from("follows")
          .delete()
          .eq("follower_id", s)
          .eq("following_id", e),
        !1)
      : (await N.from("follows").insert([{ follower_id: s, following_id: e }]),
        !0);
  },
  Oi = async (s, e) => {
    if (!s) return !1;
    const { data: t } = await N.from("follows")
      .select("*")
      .eq("follower_id", s)
      .eq("following_id", e)
      .maybeSingle();
    return !!t;
  },
  Pd = async (s, e = null, t = 10) => {
    let a = N.from("follows")
      .select(
        `
      created_at,
      user:users!follower_id (
        id,
        username,
        display_name,
        avatar_url,
        is_verified,
        bio
      )
    `,
      )
      .eq("following_id", s)
      .order("created_at", { ascending: !1 })
      .limit(t);
    e && (a = a.lt("created_at", e));
    const { data: r, error: n } = await a;
    if (n) throw n;
    return (r || []).map((o) => ({ ...je(o.user), followed_at: o.created_at }));
  },
  Ed = async (s, e = null, t = 10) => {
    let a = N.from("follows")
      .select(
        `
      created_at,
      user:users!following_id (
        id,
        username,
        display_name,
        avatar_url,
        is_verified,
        bio
      )
    `,
      )
      .eq("follower_id", s)
      .order("created_at", { ascending: !1 })
      .limit(t);
    e && (a = a.lt("created_at", e));
    const { data: r, error: n } = await a;
    if (n) throw n;
    return (r || []).map((o) => ({ ...je(o.user), followed_at: o.created_at }));
  },
  Bi = async (s) => {
    const { data: e, error: t } = await N.from("users")
      .select("follower_count, following_count")
      .eq("id", s)
      .maybeSingle();
    return t || !e
      ? { followers: 0, following: 0 }
      : { followers: e.follower_count || 0, following: e.following_count || 0 };
  };
const Wi = async (s = null, e = 10) => {
    let t = N.from("unified_posts")
      .select("*")
      .neq("type", "reel")
      .order("sort_timestamp", { ascending: !1 })
      .limit(e);
    s && (t = t.lt("sort_timestamp", s));
    const { data: a, error: r } = await t;
    if (r) throw r;
    return (a || []).map(Pe).filter((n) => n !== null);
  },
  Md = async (s) => {
    const { data: e, error: t } = await N.from("posts")
      .select(
        `
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified,
                bio,
                location,
                website,
                follower_count,
                following_count
            ),
            communities (
                id,
                handle,
                name,
                avatar_url
            ),
            quoted_post:posts!quoted_post_id (
                *,
                user:users!user_id (
                    id,
                    username,
                    display_name,
                    avatar_url,
                    is_verified
                )
            )
        `,
      )
      .eq("id", s)
      .single();
    if (t) throw t;
    return Pe(e);
  },
  Rd = async (s, e = null, t = 10) => {
    let a = N.from("unified_posts")
      .select("*")
      .or(`user_id.eq.${s},reposter_id.eq.${s}`)
      .order("sort_timestamp", { ascending: !1 })
      .limit(t);
    e && (a = a.lt("sort_timestamp", e));
    const { data: r, error: n } = await a;
    if (n) throw n;
    return (r || []).map(Pe).filter((o) => o !== null);
  },
  Ld = async (s) => {
    const { error: e } = await N.rpc("increment_post_views", { post_id: s });
    e &&
      console.error(
        "RPC increment_post_views failed, make sure to run the SQL migration:",
        e,
      );
  },
  Ui = async ({
    content: s,
    media: e = [],
    type: t = "text",
    userId: a,
    poll: r = null,
    parentId: n = null,
    communityId: o = null,
  }) => {
    const { data: l, error: c } = await N.from("posts").insert([
      {
        user_id: a,
        content: s,
        media: e,
        type: t,
        poll: r,
        parent_id: n,
        community_id: o,
      },
    ]).select(`
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            ),
            communities:community_id (
                id,
                handle,
                name,
                avatar_url
            )
        `);
    if (c) throw c;
    return Pe(l?.[0]);
  },
  Gi = async (s) => {
    const { data: e } = await N.from("posts")
      .select("media")
      .eq("id", s)
      .single();
    if (e?.media && Array.isArray(e.media)) {
      const a = [];
      (e.media.forEach((r) => {
        (r.url && a.push(r.url), r.poster && a.push(r.poster));
      }),
        a.length > 0 && (await rt(a)));
    }
    const { error: t } = await N.from("posts").delete().eq("id", s);
    if (t) throw t;
  },
  Td = async (s) => {
    const { data: e } = await N.from("comments")
      .select("media")
      .eq("id", s)
      .single();
    if (e?.media && Array.isArray(e.media)) {
      const a = [];
      (e.media.forEach((r) => {
        (r.url && a.push(r.url), r.poster && a.push(r.poster));
      }),
        a.length > 0 && (await rt(a)));
    }
    const { error: t } = await N.from("comments").delete().eq("id", s);
    if (t) throw t;
  },
  Ki = async (s, e) => {
    const { error: t } = await N.from("posts").update(e).eq("id", s);
    if (t) throw t;
  },
  Id = async (s, e) => {
    const { error: t } = await N.from("comments").update(e).eq("id", s);
    if (t) throw t;
  },
  Ad = async (s, e = null, t = 10, a = null) => {
    let r = N.from("comments")
      .select(
        `
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `,
      )
      .eq("post_id", s)
      .order("created_at", { ascending: !0 })
      .limit(t);
    (a ? (r = r.eq("parent_id", a)) : (r = r.is("parent_id", null)),
      e && (r = r.gt("created_at", e)));
    const { data: n, error: o } = await r;
    if (o) throw o;
    return (n || []).map(da).filter((l) => l !== null);
  },
  qd = async (s, e, t, a = [], r = null) => {
    const { data: n, error: o } = await N.from("comments").insert([
      { post_id: s, user_id: e, content: t, media: a, parent_id: r },
    ]).select(`
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `);
    if (o) throw o;
    return da(n?.[0]);
  },
  Fd = async (s, e) => {
    if (!s || !e) return !1;
    const { data: t } = await N.from("likes")
      .select("post_id")
      .eq("post_id", s)
      .eq("user_id", e)
      .limit(1);
    return t && t.length > 0
      ? (await N.from("likes").delete().eq("post_id", s).eq("user_id", e), !1)
      : (await N.from("likes").insert([{ post_id: s, user_id: e }]), !0);
  },
  Dd = async (s, e) => {
    if (!e || !s) return !1;
    const { data: t, error: a } = await N.from("likes")
      .select("post_id")
      .eq("post_id", s)
      .eq("user_id", e)
      .limit(1);
    return a
      ? (console.error("Error checking like status:", a), !1)
      : t && t.length > 0;
  },
  Hd = async (s, e) => {
    if (!s || !e) return !1;
    const { data: t } = await N.from("reposts")
      .select("post_id")
      .eq("post_id", s)
      .eq("user_id", e)
      .limit(1);
    return t && t.length > 0
      ? (await N.from("reposts").delete().eq("post_id", s).eq("user_id", e), !1)
      : (await N.from("reposts").insert([{ post_id: s, user_id: e }]), !0);
  },
  Vd = async (s, e) => {
    if (!e || !s) return !1;
    const { data: t, error: a } = await N.from("reposts")
      .select("post_id")
      .eq("post_id", s)
      .eq("user_id", e)
      .limit(1);
    return a
      ? (console.error("Error checking repost status:", a), !1)
      : t && t.length > 0;
  },
  Od = async (s, e = null, t = 10, a = !1) => {
    let r = N.from("unified_posts").select("*").ilike("content", `%${s}%`);
    (a && (r = r.not("community_id", "is", null).is("reposter_id", null)),
      (r = r.order("sort_timestamp", { ascending: !1 }).limit(t)),
      e && (r = r.lt("sort_timestamp", e)));
    const { data: n, error: o } = await r;
    if (o) throw o;
    return (n || []).map(Pe).filter((l) => l !== null);
  },
  Bd = async (s = null, e = 10) => {
    let t = N.from("unified_posts")
      .select("*")
      .not("community_id", "is", null)
      .is("reposter_id", null)
      .order("sort_timestamp", { ascending: !1 })
      .limit(e);
    s && (t = t.lt("sort_timestamp", s));
    const { data: a, error: r } = await t;
    if (r) throw r;
    return (a || []).map(Pe).filter((n) => n !== null);
  },
  Wd = async (s = null, e = 10) => {
    let t = N.from("unified_posts")
      .select("*")
      .eq("type", "reel")
      .order("sort_timestamp", { ascending: !1 })
      .limit(e);
    s && (t = t.lt("sort_timestamp", s));
    const { data: a, error: r } = await t;
    if (r) throw r;
    return (a || []).map(Pe).filter((n) => n !== null);
  },
  Ud = async (s, e) => {
    const { data: t } = await N.from("conversation_participants")
        .select("conversation_id, conversation:conversations!inner(is_group)")
        .eq("user_id", s)
        .eq("conversation.is_group", !1),
      a = (t || []).map((l) => l.conversation_id),
      { data: r } = await N.from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", e)
        .in("conversation_id", a)
        .maybeSingle();
    if (r) return r.conversation_id;
    const { data: n, error: o } = await N.from("conversations")
      .insert({ is_group: !1, creator_id: s })
      .select()
      .single();
    if (o) throw o;
    return (
      await N.from("conversation_participants").insert([
        { conversation_id: n.id, user_id: s },
        { conversation_id: n.id, user_id: e },
      ]),
      n.id
    );
  },
  Qi = async (s, e, t, a = null) => {
    const { data: r, error: n } = await N.from("conversations")
      .insert({ is_group: !0, name: e, avatar_url: a, creator_id: s })
      .select()
      .single();
    if (n) throw n;
    const o = r.id,
      l = Array.from(new Set([s, ...t])).map((d) => ({
        conversation_id: o,
        user_id: d,
      })),
      { error: c } = await N.from("conversation_participants").insert(l);
    if (c) throw c;
    return o;
  },
  Yi = async (s, e) => {
    const t = e.map((r) => ({ conversation_id: s, user_id: r })),
      { error: a } = await N.from("conversation_participants").insert(t);
    if (a) throw a;
  },
  Zi = async (s) => {
    if (!s) return 0;
    const { data: e } = await N.from("conversation_participants")
        .select("conversation_id")
        .eq("user_id", s),
      t = e?.map((n) => n.conversation_id) || [];
    if (t.length === 0) return 0;
    const { count: a, error: r } = await N.from("messages")
      .select("*", { count: "exact", head: !0 })
      .eq("is_read", !1)
      .neq("sender_id", s)
      .in("conversation_id", t);
    if (r) throw r;
    return a || 0;
  },
  Gd = async (s, e) => {
    if (!s) return;
    const { error: t } = await N.rpc("mark_messages_read", {
      p_conversation_id: s,
    });
    if (t) throw t;
  },
  Ji = async (s) => {
    if (!s) return [];
    const { data: e, error: t } = await N.from("conversation_participants")
      .select(
        `
            conversation:conversations (
                id,
                is_group,
                name,
                avatar_url,
                creator_id,
                last_message_at,
                last_message_content,
                participants:conversation_participants (
                    user:users (
                        id,
                        username,
                        display_name,
                        avatar_url,
                        last_seen_at
                    )
                ),
                messages (
                    id,
                    is_read,
                    sender_id
                )
            )
        `,
      )
      .eq("user_id", s);
    if (t) throw t;
    return (e || [])
      .map((a) => qi(a, s))
      .filter((a) => a !== null)
      .sort((a, r) =>
        a.lastMessageAt
          ? r.lastMessageAt
            ? new Date(r.lastMessageAt).getTime() -
              new Date(a.lastMessageAt).getTime()
            : -1
          : 1,
      );
  },
  Kd = async (s, e = null, t = 20) => {
    let a = N.from("messages")
      .select(
        `
            *,
            sender:users!sender_id (
                id,
                username,
                display_name,
                avatar_url
            )
        `,
      )
      .eq("conversation_id", s)
      .order("created_at", { ascending: !1 })
      .limit(t);
    e && (a = a.lt("created_at", e));
    const { data: r, error: n } = await a;
    if (n) throw n;
    return (r || []).map(Mt).filter((o) => o !== null);
  },
  Qd = async (s) => {
    const { data: e, error: t } = await N.from("message_reactions")
      .select("*, message:messages!inner(conversation_id)")
      .eq("message.conversation_id", s);
    if (t) throw t;
    return (e || []).map((a) => ({
      id: a.id,
      message_id: a.message_id,
      user_id: a.user_id,
      emoji: a.emoji,
      created_at: a.created_at,
    }));
  },
  Yd = async (s, e, t) => {
    const { data: a } = await N.from("message_reactions")
      .select("*")
      .eq("message_id", s)
      .eq("user_id", e)
      .maybeSingle();
    return a
      ? a.emoji === t
        ? (await N.from("message_reactions").delete().eq("id", a.id),
          { action: "removed", emoji: t })
        : (await N.from("message_reactions")
            .update({ emoji: t })
            .eq("id", a.id),
          { action: "updated", emoji: t })
      : (await N.from("message_reactions").insert([
          { message_id: s, user_id: e, emoji: t },
        ]),
        { action: "added", emoji: t });
  },
  Zd = async (s, e, t, a = "text", r = [], n = null) => {
    const { data: o, error: l } = await N.from("messages")
      .insert([
        {
          conversation_id: s,
          sender_id: e,
          content: t,
          type: a,
          media: r,
          reply_to_id: n,
        },
      ])
      .select();
    if (l) throw l;
    return (
      await N.from("conversations")
        .update({
          last_message_at: new Date().toISOString(),
          last_message_content:
            a === "image" || (r && r.length > 0) ? "Sent an image" : t,
        })
        .eq("id", s),
      Mt(o?.[0])
    );
  },
  Jd = async (s, e) => {
    const { data: t, error: a } = await N.from("messages")
      .update({ content: e })
      .eq("id", s)
      .select()
      .single();
    if (a) throw a;
    return Mt(t);
  },
  ha = async (s) => {
    const { data: e } = await N.from("messages")
      .select("media")
      .eq("conversation_id", s);
    if (e && e.length > 0) {
      const a = [];
      (e.forEach((r) => {
        r.media &&
          (Array.isArray(r.media) ? a.push(...r.media) : a.push(r.media));
      }),
        a.length > 0 && (await rt(a)));
    }
    const { error: t } = await N.from("conversations").delete().eq("id", s);
    if (t) throw t;
  },
  Xi = async (s, e) => {
    const { error: t } = await N.from("conversation_participants")
      .delete()
      .eq("conversation_id", s)
      .eq("user_id", e);
    if (t) throw t;
  },
  Xd = async (s) => {
    const { data: e } = await N.from("messages")
      .select("media")
      .eq("id", s)
      .single();
    e?.media && Array.isArray(e.media)
      ? await rt(e.media)
      : e?.media && typeof e.media == "string" && (await rt([e.media]));
    const { error: t } = await N.from("messages").delete().eq("id", s);
    if (t) throw t;
  },
  en = async (s) => {
    const { data: e, error: t } = await N.from("conversation_participants")
      .select(
        `
            user:users (
                id,
                username,
                display_name,
                avatar_url
            )
        `,
      )
      .eq("conversation_id", s);
    if (t) throw t;
    return (e || []).map((a) => a.user);
  },
  tn = async (s, e) => {
    const { data: t, error: a } = await N.from("conversations")
      .update(e)
      .eq("id", s)
      .select()
      .single();
    if (a) throw a;
    return t;
  },
  e0 = async (s, e = null, t = 10) => {
    if (!s) return [];
    let a = N.from("notifications")
      .select(
        `
            *,
            actor:users!actor_id (
                username,
                avatar_url
            )
        `,
      )
      .eq("recipient_id", s)
      .order("created_at", { ascending: !1 })
      .limit(t);
    e && (a = a.lt("created_at", e));
    const { data: r, error: n } = await a;
    if (n) throw n;
    return (r || []).map(Ai).filter((o) => o !== null);
  },
  t0 = async (s) => {
    const { error: e } = await N.from("notifications")
      .update({ is_read: !0 })
      .eq("recipient_id", s)
      .eq("is_read", !1);
    if (e) throw e;
  },
  sn = async (s) => {
    if (!s) return 0;
    const { count: e, error: t } = await N.from("notifications")
      .select("*", { count: "exact", head: !0 })
      .eq("recipient_id", s)
      .eq("is_read", !1);
    if (t) throw t;
    return e || 0;
  },
  s0 = async (s = null, e = 10) => {
    let t = N.from("stories")
      .select(
        `
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `,
      )
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: !1 })
      .limit(e);
    s && (t = t.lt("created_at", s));
    const { data: a, error: r } = await t;
    if (r) throw r;
    return (a || []).map(ma).filter((n) => n !== null);
  },
  a0 = async (s, e, t = "image") => {
    const { data: a, error: r } = await N.from("stories").insert([
      { user_id: s, media_url: e, type: t },
    ]).select(`
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `);
    if (r) throw r;
    return ma(a?.[0]);
  },
  r0 = async (s = null, e = 10) => {
    let t = N.from("communities")
      .select("*")
      .order("created_at", { ascending: !1 })
      .limit(e);
    s && (t = t.lt("created_at", s));
    const { data: a, error: r } = await t;
    if (r) throw r;
    return (a || []).map(it).filter((n) => n !== null);
  },
  i0 = async (s) => {
    const { data: e, error: t } = await N.from("communities")
      .select("*")
      .eq("handle", s)
      .single();
    if (t) throw t;
    return it(e);
  },
  n0 = async (s, e = null, t = 10) => {
    let a = N.from("unified_posts")
      .select("*")
      .eq("community_id", s)
      .is("reposter_id", null)
      .order("sort_timestamp", { ascending: !1 })
      .limit(t);
    e && (a = a.lt("sort_timestamp", e));
    const { data: r, error: n } = await a;
    if (n) throw n;
    return (r || []).map(Pe).filter((o) => o !== null);
  },
  an = async (s, e) => {
    const { data: t } = await N.from("community_members")
      .select("*")
      .eq("community_id", s)
      .eq("user_id", e)
      .maybeSingle();
    if (t) {
      const { error: a } = await N.from("community_members")
        .delete()
        .eq("community_id", s)
        .eq("user_id", e);
      if (a) throw a;
      return !1;
    } else {
      const { error: a } = await N.from("community_members").insert([
        { community_id: s, user_id: e },
      ]);
      if (a) throw a;
      return !0;
    }
  },
  rn = async (s, e) => {
    if (!e) return null;
    const { data: t } = await N.from("community_members")
      .select("*")
      .eq("community_id", s)
      .eq("user_id", e)
      .maybeSingle();
    return t;
  },
  o0 = async (s) => {
    if (!s) return [];
    const { data: e, error: t } = await N.from("community_members")
      .select(
        `
      role,
      communities (*)
    `,
      )
      .eq("user_id", s);
    if (t) throw t;
    return (e || []).map((a) => ({ ...it(a.communities), myRole: a.role }));
  },
  nn = async (s) => {
    const { data: e, error: t } = await N.from("communities")
      .insert([s])
      .select()
      .single();
    if (t) throw t;
    const { error: a } = await N.from("community_members").insert([
      { community_id: e.id, user_id: s.creator_id, role: "admin" },
    ]);
    if (a) throw a;
    return it(e);
  },
  on = async (s, e) => {
    if (e.avatar_url || e.cover_url) {
      const { data: r } = await N.from("communities")
        .select("avatar_url, cover_url")
        .eq("id", s)
        .single();
      r &&
        (e.avatar_url &&
          r.avatar_url &&
          r.avatar_url !== e.avatar_url &&
          r.avatar_url.includes(
            N.storage.from("media").getPublicUrl("").data.publicUrl,
          ) &&
          (await at(r.avatar_url)),
        e.cover_url &&
          r.cover_url &&
          r.cover_url !== e.cover_url &&
          r.cover_url.includes(
            N.storage.from("media").getPublicUrl("").data.publicUrl,
          ) &&
          (await at(r.cover_url)));
    }
    const { data: t, error: a } = await N.from("communities")
      .update(e)
      .eq("id", s)
      .select()
      .single();
    if (a) throw a;
    return it(t);
  },
  ln = async (s, e = "") => {
    let t = N.from("community_members")
      .select(
        `
      role,
      user_id,
      users:user_id!inner (
        id,
        username,
        display_name,
        avatar_url,
        is_verified
      )
    `,
      )
      .eq("community_id", s);
    e &&
      (t = t.or(`username.ilike.%${e}%,display_name.ilike.%${e}%`, {
        foreignTable: "users",
      }));
    const { data: a, error: r } = await t.limit(20);
    if (r) throw r;
    return (a || []).map((n) => ({
      role: n.role,
      userId: n.user_id,
      user: n.users,
    }));
  },
  cn = async (s, e, t) => {
    const { data: a, error: r } = await N.from("community_members")
      .update({ role: t })
      .eq("community_id", s)
      .eq("user_id", e)
      .select()
      .single();
    if (r) throw r;
    return a;
  },
  dn = async (s = 5) => {
    const { data: e, error: t } = await N.from("hashtags")
      .select("*")
      .order("usage_count", { ascending: !1 })
      .limit(s);
    if (t) throw t;
    return e || [];
  },
  mn = async (s) => {
    try {
      const e = `https://api.allorigins.win/raw?url=${encodeURIComponent(s)}`,
        t = await fetch(e);
      if (!t.ok) throw new Error("Failed to fetch preview");
      const a = await t.text(),
        r = new DOMParser().parseFromString(a, "text/html"),
        n = (o) =>
          r.querySelector(`meta[property="${o}"]`)?.getAttribute("content") ||
          r.querySelector(`meta[name="${o}"]`)?.getAttribute("content");
      return {
        title: n("og:title") || r.title || s,
        description: n("og:description") || n("description") || "",
        image: n("og:image") || n("twitter:image") || "",
        siteName: n("og:site_name") || new URL(s).hostname,
        url: s,
      };
    } catch (e) {
      return (console.error("Link preview error:", e), null);
    }
  },
  l0 = async (s) => {
    if (!s) return null;
    try {
      const { data: e } = await N.from("link_previews")
        .select("*")
        .eq("url", s)
        .maybeSingle();
      if (e)
        return (
          N.from("link_previews")
            .update({ last_used_at: new Date().toISOString() })
            .eq("url", s)
            .then(() => {}),
          {
            title: e.title,
            description: e.description,
            image: e.image,
            siteName: e.site_name,
            url: e.url,
          }
        );
      const t = await mn(s);
      return t
        ? (N.from("link_previews")
            .insert([
              {
                url: t.url,
                title: t.title,
                description: t.description,
                image: t.image,
                site_name: t.siteName,
              },
            ])
            .then(({ error: a }) => {
              a && console.error("Cache save error:", a);
            }),
          t)
        : null;
    } catch (e) {
      return (console.error("Link preview cache error:", e), null);
    }
  };
var i = ds(xr(), 1),
  pa = (0, p.createContext)(void 0);
const un = ({ children: s }) => {
    const [e, t] = (0, p.useState)(null),
      [a, r] = (0, p.useState)(!0),
      n = (0, p.useCallback)(async (h) => {
        try {
          const x = await fa(h.id);
          t(
            x || {
              id: h.id,
              name: h.email?.split("@")[0] || "User",
              handle: h.email?.split("@")[0] || "user",
              avatar: "/default-avatar.webp",
              verified: !1,
              cover: "/welcome-banner.webp",
              bio: null,
              location: null,
              website: null,
              follower_count: 0,
              following_count: 0,
              lastSeen: new Date().toISOString(),
            },
          );
        } catch (x) {
          console.error("Error fetching user profile:", x);
        } finally {
          r(!1);
        }
      }, []);
    ((0, p.useEffect)(() => {
      if (!e?.id) return;
      Re(e.id);
      const h = setInterval(() => Re(e.id), 3e4),
        x = () => {
          document.visibilityState === "visible" && Re(e.id);
        };
      return (
        window.addEventListener("visibilitychange", x),
        window.addEventListener("beforeunload", () => Re(e.id)),
        () => {
          (clearInterval(h),
            window.removeEventListener("visibilitychange", x),
            window.removeEventListener("beforeunload", () => Re(e.id)));
        }
      );
    }, [e?.id]),
      (0, p.useEffect)(() => {
        N.auth.getSession().then(({ data: { session: x } }) => {
          x ? n(x.user) : r(!1);
        });
        const {
          data: { subscription: h },
        } = N.auth.onAuthStateChange((x, u) => {
          u ? n(u.user) : (t(null), r(!1));
        });
        return () => h.unsubscribe();
      }, [n]));
    const o = (0, p.useCallback)(async ({ email: h, password: x }) => {
        const { data: u, error: f } = await N.auth.signInWithPassword({
          email: h,
          password: x,
        });
        if (f) throw f;
        return u;
      }, []),
      l = (0, p.useCallback)(
        async ({ email: h, password: x, username: u, name: f }) => {
          const {
            data: { user: g },
            error: v,
          } = await N.auth.signUp({
            email: h,
            password: x,
            options: { data: { username: u.toLowerCase(), name: f } },
          });
          if (v) throw v;
          return g;
        },
        [],
      ),
      c = (0, p.useCallback)(async () => {
        (await N.auth.signOut(), t(null));
      }, []),
      d = (0, p.useCallback)(
        async (h) => {
          e && (await Hi(e.id, h), await n(e));
        },
        [e, n],
      ),
      m = (0, p.useMemo)(
        () => ({
          currentUser: e,
          login: o,
          signup: l,
          logout: c,
          updateProfile: d,
          loading: a,
        }),
        [e, o, l, c, d, a],
      );
    return (0, i.jsx)(pa.Provider, { value: m, children: !a && s });
  },
  pe = () => {
    const s = (0, p.useContext)(pa);
    if (!s) throw new Error("useAuth must be used within an AuthProvider");
    return s;
  };
var fn = H(),
  xa = (0, p.createContext)(void 0);
const hn = (s) => {
    const e = (0, fn.c)(10),
      { children: t } = s,
      { currentUser: a } = pe();
    let r;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((r = new Set()), (e[0] = r))
      : (r = e[0]);
    const [n, o] = (0, p.useState)(r);
    let l;
    e[1] !== a
      ? ((l = () => {
          if (!a?.id) return;
          const x = N.channel("global_presence", {
            config: { presence: { key: a.id } },
          });
          return (
            x
              .on("presence", { event: "sync" }, () => {
                const u = x.presenceState(),
                  f = new Set();
                (Object.keys(u).forEach((g) => f.add(g)), o(f));
              })
              .subscribe(async (u) => {
                u === "SUBSCRIBED" &&
                  (await x.track({
                    userId: a.id,
                    online_at: new Date().toISOString(),
                  }),
                  Re(a.id));
              }),
            () => {
              (a?.id && Re(a.id), N.removeChannel(x), o(new Set()));
            }
          );
        }),
        (e[1] = a),
        (e[2] = l))
      : (l = e[2]);
    const c = a?.id;
    let d;
    (e[3] !== c ? ((d = [c]), (e[3] = c), (e[4] = d)) : (d = e[4]),
      (0, p.useEffect)(l, d));
    let m;
    e[5] !== n
      ? ((m = { onlineUsers: n }), (e[5] = n), (e[6] = m))
      : (m = e[6]);
    let h;
    return (
      e[7] !== t || e[8] !== m
        ? ((h = (0, i.jsx)(xa.Provider, { value: m, children: t })),
          (e[7] = t),
          (e[8] = m),
          (e[9] = h))
        : (h = e[9]),
      h
    );
  },
  pn = () => {
    const s = (0, p.useContext)(xa);
    if (!s)
      throw new Error("usePresence must be used within a PresenceProvider");
    return s;
  };
var xn = H(),
  ga = (0, p.createContext)(void 0);
const gn = (s) => {
    const e = (0, xn.c)(17),
      { children: t } = s,
      [a, r] = (0, p.useState)(vn),
      [n, o] = (0, p.useState)(bn),
      [l, c] = (0, p.useState)(wn);
    let d, m;
    (e[0] !== a
      ? ((d = () => {
          (localStorage.setItem("theme", a ? "dark" : "light"),
            a
              ? document.documentElement.classList.add("dark")
              : document.documentElement.classList.remove("dark"));
        }),
        (m = [a]),
        (e[0] = a),
        (e[1] = d),
        (e[2] = m))
      : ((d = e[1]), (m = e[2])),
      (0, p.useEffect)(d, m));
    let h, x;
    (e[3] !== n
      ? ((h = () => {
          (localStorage.setItem("font-size", n),
            document.documentElement.style.setProperty(
              "--app-font-size",
              { small: "14px", base: "16px", large: "18px" }[n],
            ));
        }),
        (x = [n]),
        (e[3] = n),
        (e[4] = h),
        (e[5] = x))
      : ((h = e[4]), (x = e[5])),
      (0, p.useEffect)(h, x));
    let u, f;
    (e[6] !== l
      ? ((u = () => {
          localStorage.setItem("data-saver", String(l));
        }),
        (f = [l]),
        (e[6] = l),
        (e[7] = u),
        (e[8] = f))
      : ((u = e[7]), (f = e[8])),
      (0, p.useEffect)(u, f));
    let g;
    e[9] === Symbol.for("react.memo_cache_sentinel")
      ? ((g = () => r(yn)), (e[9] = g))
      : (g = e[9]);
    const v = g;
    let b;
    e[10] !== a || e[11] !== l || e[12] !== n
      ? ((b = {
          darkMode: a,
          setDarkMode: r,
          toggleDarkMode: v,
          fontSize: n,
          setFontSize: o,
          dataSaver: l,
          setDataSaver: c,
        }),
        (e[10] = a),
        (e[11] = l),
        (e[12] = n),
        (e[13] = b))
      : (b = e[13]);
    const w = b;
    let y;
    return (
      e[14] !== t || e[15] !== w
        ? ((y = (0, i.jsx)(ga.Provider, { value: w, children: t })),
          (e[14] = t),
          (e[15] = w),
          (e[16] = y))
        : (y = e[16]),
      y
    );
  },
  va = () => {
    const s = (0, p.useContext)(ga);
    if (!s) throw new Error("useTheme must be used within a ThemeProvider");
    return s;
  };
function vn() {
  const s = localStorage.getItem("theme");
  return (
    s === "dark" ||
    (!s && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
}
function bn() {
  return localStorage.getItem("font-size") || "base";
}
function wn() {
  return localStorage.getItem("data-saver") === "true";
}
function yn(s) {
  return !s;
}
var jn = (s, e, t, a, r, n, o, l) => {
  let c = document.documentElement,
    d = ["light", "dark"];
  function m(u) {
    ((Array.isArray(s) ? s : [s]).forEach((f) => {
      let g = f === "class",
        v = g && n ? r.map((b) => n[b] || b) : r;
      g
        ? (c.classList.remove(...v), c.classList.add(n && n[u] ? n[u] : u))
        : c.setAttribute(f, u);
    }),
      h(u));
  }
  function h(u) {
    l && d.includes(u) && (c.style.colorScheme = u);
  }
  function x() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  if (a) m(a);
  else
    try {
      let u = localStorage.getItem(e) || t;
      m(o && u === "system" ? x() : u);
    } catch {}
};
var _n = p.createContext(void 0),
  Nn = { setTheme: (s) => {}, themes: [] },
  kn = () => {
    var s;
    return (s = p.useContext(_n)) != null ? s : Nn;
  };
var c0 = p.memo(
  ({
    forcedTheme: s,
    storageKey: e,
    attribute: t,
    enableSystem: a,
    enableColorScheme: r,
    defaultTheme: n,
    value: o,
    themes: l,
    nonce: c,
    scriptProps: d,
  }) => {
    let m = JSON.stringify([t, e, n, s, l, o, a, r]).slice(1, -1);
    return p.createElement("script", {
      ...d,
      suppressHydrationWarning: !0,
      nonce: typeof window > "u" ? c : "",
      dangerouslySetInnerHTML: { __html: `(${jn.toString()})(${m})` },
    });
  },
);
var zn = H(),
  Cn = (s) => {
    const e = (0, zn.c)(8);
    let t;
    e[0] !== s ? (({ ...t } = s), (e[0] = s), (e[1] = t)) : (t = e[1]);
    const { theme: a } = kn(),
      r = a === void 0 ? "system" : a;
    let n, o, l;
    e[2] === Symbol.for("react.memo_cache_sentinel")
      ? ((n = {
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-white group-[.toaster]:text-zinc-950 group-[.toaster]:border-zinc-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-zinc-950 dark:group-[.toaster]:text-zinc-50 dark:group-[.toaster]:border-zinc-800",
            description:
              "group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400",
            actionButton:
              "group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-50 dark:group-[.toast]:bg-zinc-50 dark:group-[.toast]:text-zinc-900",
            cancelButton:
              "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500 dark:group-[.toast]:bg-zinc-800 dark:group-[.toast]:text-zinc-400",
          },
        }),
        (o = {
          success: (0, i.jsx)(ki, { className: "size-4" }),
          info: (0, i.jsx)(Vr, { className: "size-4" }),
          warning: (0, i.jsx)(Hr, { className: "size-4" }),
          error: (0, i.jsx)(xi, { className: "size-4" }),
          loading: (0, i.jsx)($e, { className: "size-4 animate-spin" }),
        }),
        (l = {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        }),
        (e[2] = n),
        (e[3] = o),
        (e[4] = l))
      : ((n = e[2]), (o = e[3]), (l = e[4]));
    let c;
    return (
      e[5] !== t || e[6] !== r
        ? ((c = (0, i.jsx)(Cr, {
            theme: r,
            className: "toaster group",
            toastOptions: n,
            icons: o,
            style: l,
            ...t,
          })),
          (e[5] = t),
          (e[6] = r),
          (e[7] = c))
        : (c = e[7]),
      c
    );
  },
  Sn = H(),
  ba = (0, p.createContext)(void 0);
const $n = (s) => {
    const e = (0, Sn.c)(4),
      { children: t } = s,
      a = Pn;
    let r;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((r = { addToast: a }), (e[0] = r))
      : (r = e[0]);
    let n;
    e[1] === Symbol.for("react.memo_cache_sentinel")
      ? ((n = (0, i.jsx)(Cn, {
          position: "bottom-center",
          toastOptions: { className: "rounded-full font-bold" },
        })),
        (e[1] = n))
      : (n = e[1]);
    let o;
    return (
      e[2] !== t
        ? ((o = (0, i.jsxs)(ba.Provider, { value: r, children: [t, n] })),
          (e[2] = t),
          (e[3] = o))
        : (o = e[3]),
      o
    );
  },
  _e = () => {
    const s = (0, p.useContext)(ba);
    if (!s) throw new Error("useToast must be used within a ToastProvider");
    return s;
  };
function Pn(s, e) {
  const t = e === void 0 ? "success" : e;
  t === "error" ? Nt.error(s) : t === "info" ? Nt.info(s) : Nt.success(s);
}
var En = H(),
  wa = (0, p.createContext)(void 0);
const Mn = (s) => {
    const e = (0, En.c)(37),
      { children: t } = s,
      a = Ie();
    let r;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((r = ["posts", "feed"]), (e[0] = r))
      : (r = e[0]);
    let n;
    e[1] === Symbol.for("react.memo_cache_sentinel")
      ? ((n = {
          queryKey: r,
          queryFn: Rn,
          initialPageParam: null,
          getNextPageParam: Ln,
        }),
        (e[1] = n))
      : (n = e[1]);
    const {
      data: o,
      fetchNextPage: l,
      hasNextPage: c,
      isFetchingNextPage: d,
      isLoading: m,
      refetch: h,
    } = kr(n);
    let x;
    e[2] !== o?.pages
      ? ((x = o?.pages.flatMap(Tn) || []), (e[2] = o?.pages), (e[3] = x))
      : (x = e[3]);
    const u = x;
    let f;
    e[4] !== a
      ? ((f = {
          mutationFn: Ui,
          onSuccess: () => {
            a.invalidateQueries({ queryKey: ["posts", "feed"] });
          },
        }),
        (e[4] = a),
        (e[5] = f))
      : (f = e[5]);
    const g = we(f);
    let v;
    e[6] !== a
      ? ((v = {
          mutationFn: Gi,
          onMutate: async (q) => {
            await a.cancelQueries({ queryKey: ["posts", "feed"] });
            const F = a.getQueryData(["posts", "feed"]);
            return (
              a.setQueryData(
                ["posts", "feed"],
                (U) =>
                  U && {
                    ...U,
                    pages: U.pages.map((O) => O.filter((G) => G.id !== q)),
                  },
              ),
              { previousPosts: F }
            );
          },
          onError: (q, F, U) => {
            U?.previousPosts &&
              a.setQueryData(["posts", "feed"], U.previousPosts);
          },
          onSuccess: () => {
            a.invalidateQueries({ queryKey: ["posts", "feed"] });
          },
        }),
        (e[6] = a),
        (e[7] = v))
      : (v = e[7]);
    const b = we(v);
    let w;
    e[8] !== a
      ? ((w = {
          mutationFn: In,
          onSuccess: () => {
            a.invalidateQueries({ queryKey: ["posts", "feed"] });
          },
        }),
        (e[8] = a),
        (e[9] = w))
      : (w = e[9]);
    const y = we(w);
    let z;
    e[10] !== g
      ? ((z = async (q) => await g.mutateAsync(q)), (e[10] = g), (e[11] = z))
      : (z = e[11]);
    const j = z;
    let k;
    e[12] !== b
      ? ((k = async (q) => {
          await b.mutateAsync(q);
        }),
        (e[12] = b),
        (e[13] = k))
      : (k = e[13]);
    const S = k;
    let _;
    e[14] !== y
      ? ((_ = async (q, F) => {
          await y.mutateAsync({ postId: q, data: F });
        }),
        (e[14] = y),
        (e[15] = _))
      : (_ = e[15]);
    const $ = _,
      I = An;
    let A;
    e[16] !== u
      ? ((A = (q) => u.find((F) => F.id === q)), (e[16] = u), (e[17] = A))
      : (A = e[17]);
    const R = A;
    let M;
    e[18] !== u
      ? ((M = (q, F) => {
          const U = F === void 0 ? "feed" : F,
            O = u.filter(
              (G) =>
                !!(
                  G.user?.handle === q ||
                  (G.repostedBy && G.repostedBy.handle === q)
                ),
            );
          return U === "feed" ? O.filter(qn) : U === "media" ? O.filter(Fn) : O;
        }),
        (e[18] = u),
        (e[19] = M))
      : (M = e[19]);
    const P = M;
    let C;
    e[20] !== h ? ((C = () => h()), (e[20] = h), (e[21] = C)) : (C = e[21]);
    const T = C,
      V = c || !1;
    let W;
    e[22] !== j ||
    e[23] !== S ||
    e[24] !== l ||
    e[25] !== R ||
    e[26] !== P ||
    e[27] !== d ||
    e[28] !== m ||
    e[29] !== u ||
    e[30] !== T ||
    e[31] !== V ||
    e[32] !== $
      ? ((W = {
          posts: u,
          setPosts: I,
          addPost: j,
          deletePost: S,
          updatePost: $,
          getPostById: R,
          getUserPosts: P,
          loading: m,
          hasMore: V,
          isFetchingNextPage: d,
          fetchNextPage: l,
          refreshPosts: T,
        }),
        (e[22] = j),
        (e[23] = S),
        (e[24] = l),
        (e[25] = R),
        (e[26] = P),
        (e[27] = d),
        (e[28] = m),
        (e[29] = u),
        (e[30] = T),
        (e[31] = V),
        (e[32] = $),
        (e[33] = W))
      : (W = e[33]);
    const B = W;
    let L;
    return (
      e[34] !== t || e[35] !== B
        ? ((L = (0, i.jsx)(wa.Provider, { value: B, children: t })),
          (e[34] = t),
          (e[35] = B),
          (e[36] = L))
        : (L = e[36]),
      L
    );
  },
  d0 = () => {
    const s = (0, p.useContext)(wa);
    if (!s) throw new Error("usePosts must be used within a PostProvider");
    return s;
  };
function Rn(s) {
  const { pageParam: e } = s;
  return Wi(e, 10);
}
function Ln(s) {
  if (!(!s || s.length < 10))
    return s[s.length - 1].sort_timestamp || s[s.length - 1].created_at;
}
function Tn(s) {
  return s;
}
function In(s) {
  const { postId: e, data: t } = s;
  return Ki(e, t);
}
function An(s) {
  console.warn("setPosts is deprecated in favor of React Query cache updates");
}
function qn(s) {
  return s.parent_id === null;
}
function Fn(s) {
  return (
    s.parent_id === null &&
    (s.type === "video" || s.type === "image" || (s.media?.length || 0) > 0)
  );
}
var Dn = H(),
  ya = (0, p.createContext)(void 0);
const Hn = (s) => {
    const e = (0, Dn.c)(9),
      { children: t } = s;
    let a;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((a = { isOpen: !1, images: [], currentIndex: 0 }), (e[0] = a))
      : (a = e[0]);
    const [r, n] = (0, p.useState)(a);
    let o;
    e[1] === Symbol.for("react.memo_cache_sentinel")
      ? ((o = (f, g) => {
          const v = g === void 0 ? 0 : g;
          n({
            isOpen: !0,
            images: Array.isArray(f) ? f : [f],
            currentIndex: v,
          });
        }),
        (e[1] = o))
      : (o = e[1]);
    const l = o;
    let c;
    e[2] === Symbol.for("react.memo_cache_sentinel")
      ? ((c = () => {
          n(On);
        }),
        (e[2] = c))
      : (c = e[2]);
    const d = c;
    let m;
    e[3] === Symbol.for("react.memo_cache_sentinel")
      ? ((m = (f) => {
          n((g) => ({ ...g, currentIndex: f }));
        }),
        (e[3] = m))
      : (m = e[3]);
    const h = m;
    let x;
    e[4] !== r
      ? ((x = { ...r, openLightbox: l, closeLightbox: d, setIndex: h }),
        (e[4] = r),
        (e[5] = x))
      : (x = e[5]);
    let u;
    return (
      e[6] !== t || e[7] !== x
        ? ((u = (0, i.jsx)(ya.Provider, { value: x, children: t })),
          (e[6] = t),
          (e[7] = x),
          (e[8] = u))
        : (u = e[8]),
      u
    );
  },
  Vn = () => {
    const s = (0, p.useContext)(ya);
    if (!s)
      throw new Error("useLightbox must be used within a LightboxProvider");
    return s;
  };
function On(s) {
  return { ...s, isOpen: !1 };
}
var Bn = H(),
  Wn = (s) => {
    const e = (0, Bn.c)(26);
    let t, a, r, n, o, l, c;
    e[0] !== s
      ? (({
          children: t,
          variant: n,
          size: o,
          loading: l,
          className: c,
          disabled: a,
          ...r
        } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r),
        (e[4] = n),
        (e[5] = o),
        (e[6] = l),
        (e[7] = c))
      : ((t = e[1]),
        (a = e[2]),
        (r = e[3]),
        (n = e[4]),
        (o = e[5]),
        (l = e[6]),
        (c = e[7]));
    const d = n === void 0 ? "primary" : n,
      m = o === void 0 ? "md" : o,
      h = l === void 0 ? !1 : l,
      x = c === void 0 ? "" : c;
    let u;
    e[8] !== x || e[9] !== m || e[10] !== d
      ? ((u = E(
          "rounded-full font-bold inline-flex items-center justify-center relative overflow-hidden transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 touch-manipulation shadow-sm hover:shadow-md",
          {
            primary:
              "text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-900 dark:bg-white dark:text-black dark:border-white dark:hover:bg-zinc-200",
            secondary:
              "text-zinc-900 border border-zinc-200 bg-white hover:bg-zinc-50 dark:text-white dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800",
            outline:
              "text-zinc-900 border border-zinc-200 bg-transparent hover:bg-zinc-50 dark:text-white dark:border-zinc-800 dark:hover:bg-zinc-900",
            danger:
              "text-white bg-rose-500 hover:bg-rose-600 border border-rose-500 shadow-rose-500/10 hover:shadow-rose-500/20",
            ghost:
              "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 border-transparent shadow-none hover:shadow-none",
            violet:
              "text-white bg-violet-600 hover:bg-violet-700 border border-violet-600 shadow-violet-600/20 hover:shadow-violet-600/30",
          }[d],
          {
            sm: "px-3 py-1 text-xs",
            md: "px-5 py-2 text-sm",
            lg: "px-8 py-3 text-base",
            icon: "p-2 aspect-square",
          }[m],
          x,
        )),
        (e[8] = x),
        (e[9] = m),
        (e[10] = d),
        (e[11] = u))
      : (u = e[11]);
    const f = a || h;
    let g;
    e[12] !== h
      ? ((g =
          h &&
          (0, i.jsx)($e, { className: "mr-2 h-4 w-4 animate-spin shrink-0" })),
        (e[12] = h),
        (e[13] = g))
      : (g = e[13]);
    const v = h && "opacity-80";
    let b;
    e[14] !== v
      ? ((b = E("flex items-center gap-x-1.5", v)), (e[14] = v), (e[15] = b))
      : (b = e[15]);
    let w;
    e[16] !== t || e[17] !== b
      ? ((w = (0, i.jsx)("div", { className: b, children: t })),
        (e[16] = t),
        (e[17] = b),
        (e[18] = w))
      : (w = e[18]);
    let y;
    e[19] === Symbol.for("react.memo_cache_sentinel")
      ? ((y = (0, i.jsx)("div", {
          className:
            "absolute inset-0 bg-black/0 active:bg-black/5 transition-colors pointer-events-none",
        })),
        (e[19] = y))
      : (y = e[19]);
    let z;
    return (
      e[20] !== r || e[21] !== w || e[22] !== u || e[23] !== f || e[24] !== g
        ? ((z = (0, i.jsxs)("button", {
            className: u,
            disabled: f,
            ...r,
            children: [g, w, y],
          })),
          (e[20] = r),
          (e[21] = w),
          (e[22] = u),
          (e[23] = f),
          (e[24] = g),
          (e[25] = z))
        : (z = e[25]),
      z
    );
  },
  J = Wn,
  Un = class extends p.Component {
    state = { hasError: !1, error: null };
    static getDerivedStateFromError(s) {
      return { hasError: !0, error: s };
    }
    componentDidCatch(s, e) {
      console.error("Uncaught error:", s, e);
    }
    render() {
      return this.state.hasError
        ? (0, i.jsxs)("div", {
            className:
              "flex h-screen w-full flex-col items-center justify-center bg-white p-4 text-center dark:bg-black",
            children: [
              (0, i.jsx)("h2", {
                className:
                  "mb-2 text-2xl font-bold text-zinc-900 dark:text-white",
                children: "Something went wrong",
              }),
              (0, i.jsx)("p", {
                className: "mb-6 max-w-md text-zinc-500 dark:text-zinc-400",
                children:
                  this.state.error?.message || "An unexpected error occurred.",
              }),
              (0, i.jsx)(J, {
                onClick: () => window.location.reload(),
                className:
                  "rounded-full bg-violet-600 px-6 py-2 font-bold text-white hover:bg-violet-700",
                children: "Reload Page",
              }),
            ],
          })
        : this.props.children;
    }
  },
  Gn = Un,
  Kn = H(),
  ja = (0, p.createContext)(void 0);
const Qn = (s) => {
    const e = (0, Kn.c)(15),
      { children: t } = s,
      [a, r] = (0, p.useState)(null);
    let n;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((n = new Map()), (e[0] = n))
      : (n = e[0]);
    const o = (0, p.useRef)(n);
    let l;
    e[1] !== a
      ? ((l = (g, v, b) => {
          v === 0
            ? o.current.has(g) && o.current.delete(g)
            : o.current.set(g, { ratio: v, ...b });
          let w = null,
            y = 0.5;
          for (const [z, j] of o.current.entries())
            j.ratio > y && ((y = j.ratio), (w = z));
          w !== a && r(w);
        }),
        (e[1] = a),
        (e[2] = l))
      : (l = e[2]);
    const c = l;
    let d, m;
    (e[3] !== a
      ? ((d = () => {
          o.current.forEach((g, v) => {
            v === a ? g.play() : g.pause();
          });
        }),
        (m = [a]),
        (e[3] = a),
        (e[4] = d),
        (e[5] = m))
      : ((d = e[4]), (m = e[5])),
      (0, p.useEffect)(d, m));
    let h;
    e[6] !== a
      ? ((h = (g) => {
          (o.current.delete(g), a === g && r(null));
        }),
        (e[6] = a),
        (e[7] = h))
      : (h = e[7]);
    const x = h;
    let u;
    e[8] !== a || e[9] !== c || e[10] !== x
      ? ((u = { reportVisibility: c, unregister: x, activeVideoId: a }),
        (e[8] = a),
        (e[9] = c),
        (e[10] = x),
        (e[11] = u))
      : (u = e[11]);
    let f;
    return (
      e[12] !== t || e[13] !== u
        ? ((f = (0, i.jsx)(ja.Provider, { value: u, children: t })),
          (e[12] = t),
          (e[13] = u),
          (e[14] = f))
        : (f = e[14]),
      f
    );
  },
  m0 = () => {
    const s = (0, p.useContext)(ja);
    if (!s)
      throw new Error(
        "useVideoPlayback must be used within a VideoPlaybackProvider",
      );
    return s;
  };
var Ee = H(),
  u0 = ri;
var Yn = di,
  _a = p.forwardRef((s, e) => {
    const t = (0, Ee.c)(9);
    let a, r;
    t[0] !== s
      ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
      : ((a = t[1]), (r = t[2]));
    let n;
    t[3] !== a
      ? ((n = E(
          "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          a,
        )),
        (t[3] = a),
        (t[4] = n))
      : (n = t[4]);
    let o;
    return (
      t[5] !== r || t[6] !== e || t[7] !== n
        ? ((o = (0, i.jsx)(Js, { className: n, ...r, ref: e })),
          (t[5] = r),
          (t[6] = e),
          (t[7] = n),
          (t[8] = o))
        : (o = t[8]),
      o
    );
  });
_a.displayName = Js.displayName;
var Zn = p.forwardRef((s, e) => {
  const t = (0, Ee.c)(10);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] === Symbol.for("react.memo_cache_sentinel")
    ? ((n = (0, i.jsx)(_a, {})), (t[3] = n))
    : (n = t[3]);
  let o;
  t[4] !== a
    ? ((o = E(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full sm:rounded-lg dark:border-zinc-800 dark:bg-zinc-950",
        a,
      )),
      (t[4] = a),
      (t[5] = o))
    : (o = t[5]);
  let l;
  return (
    t[6] !== r || t[7] !== e || t[8] !== o
      ? ((l = (0, i.jsxs)(Yn, {
          children: [n, (0, i.jsx)(Ds, { ref: e, className: o, ...r })],
        })),
        (t[6] = r),
        (t[7] = e),
        (t[8] = o),
        (t[9] = l))
      : (l = t[9]),
    l
  );
});
Zn.displayName = Ds.displayName;
var Jn = (s) => {
  const e = (0, Ee.c)(8);
  let t, a;
  e[0] !== s
    ? (({ className: t, ...a } = s), (e[0] = s), (e[1] = t), (e[2] = a))
    : ((t = e[1]), (a = e[2]));
  let r;
  e[3] !== t
    ? ((r = E("flex flex-col space-y-2 text-center sm:text-left", t)),
      (e[3] = t),
      (e[4] = r))
    : (r = e[4]);
  let n;
  return (
    e[5] !== a || e[6] !== r
      ? ((n = (0, i.jsx)("div", { className: r, ...a })),
        (e[5] = a),
        (e[6] = r),
        (e[7] = n))
      : (n = e[7]),
    n
  );
};
Jn.displayName = "AlertDialogHeader";
var Xn = (s) => {
  const e = (0, Ee.c)(8);
  let t, a;
  e[0] !== s
    ? (({ className: t, ...a } = s), (e[0] = s), (e[1] = t), (e[2] = a))
    : ((t = e[1]), (a = e[2]));
  let r;
  e[3] !== t
    ? ((r = E(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        t,
      )),
      (e[3] = t),
      (e[4] = r))
    : (r = e[4]);
  let n;
  return (
    e[5] !== a || e[6] !== r
      ? ((n = (0, i.jsx)("div", { className: r, ...a })),
        (e[5] = a),
        (e[6] = r),
        (e[7] = n))
      : (n = e[7]),
    n
  );
};
Xn.displayName = "AlertDialogFooter";
var eo = p.forwardRef((s, e) => {
  const t = (0, Ee.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E("text-lg font-semibold", a)), (t[3] = a), (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(Os, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
eo.displayName = Os.displayName;
var to = p.forwardRef((s, e) => {
  const t = (0, Ee.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E("text-sm text-zinc-500 dark:text-zinc-400", a)),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(Hs, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
to.displayName = Hs.displayName;
var so = p.forwardRef((s, e) => {
  const t = (0, Ee.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E(
        "inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300",
        a,
      )),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(Ks, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
so.displayName = Ks.displayName;
var ao = p.forwardRef((s, e) => {
  const t = (0, Ee.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E(
        "inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-300",
        a,
      )),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(aa, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
ao.displayName = aa.displayName;
var Rt = H(),
  ne = p.forwardRef((s, e) => {
    const t = (0, Rt.c)(9);
    let a, r;
    t[0] !== s
      ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
      : ((a = t[1]), (r = t[2]));
    let n;
    t[3] !== a
      ? ((n = E(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          a,
        )),
        (t[3] = a),
        (t[4] = n))
      : (n = t[4]);
    let o;
    return (
      t[5] !== r || t[6] !== e || t[7] !== n
        ? ((o = (0, i.jsx)(qs, { ref: e, className: n, ...r })),
          (t[5] = r),
          (t[6] = e),
          (t[7] = n),
          (t[8] = o))
        : (o = t[8]),
      o
    );
  });
ne.displayName = qs.displayName;
var oe = p.forwardRef((s, e) => {
  const t = (0, Rt.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E("aspect-square h-full w-full", a)), (t[3] = a), (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(ea, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
oe.displayName = ea.displayName;
var me = p.forwardRef((s, e) => {
  const t = (0, Rt.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E(
        "flex h-full w-full items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800",
        a,
      )),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(Zs, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
me.displayName = Zs.displayName;
var Ne = H(),
  f0 = ti,
  h0 = Jr;
var ro = p.forwardRef((s, e) => {
  const t = (0, Ne.c)(14);
  let a, r, n, o;
  t[0] !== s
    ? (({ className: r, inset: n, children: a, ...o } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n),
      (t[4] = o))
    : ((a = t[1]), (r = t[2]), (n = t[3]), (o = t[4]));
  const l = n && "pl-8";
  let c;
  t[5] !== r || t[6] !== l
    ? ((c = E(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-900 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 dark:data-[state=open]:bg-zinc-800 dark:data-[state=open]:text-zinc-50",
        l,
        r,
      )),
      (t[5] = r),
      (t[6] = l),
      (t[7] = c))
    : (c = t[7]);
  let d;
  t[8] === Symbol.for("react.memo_cache_sentinel")
    ? ((d = (0, i.jsx)(gt, { className: "ml-auto h-4 w-4" })), (t[8] = d))
    : (d = t[8]);
  let m;
  return (
    t[9] !== a || t[10] !== o || t[11] !== e || t[12] !== c
      ? ((m = (0, i.jsxs)(Us, {
          ref: e,
          className: c,
          ...o,
          children: [a, d],
        })),
        (t[9] = a),
        (t[10] = o),
        (t[11] = e),
        (t[12] = c),
        (t[13] = m))
      : (m = t[13]),
    m
  );
});
ro.displayName = Us.displayName;
var io = p.forwardRef((s, e) => {
  const t = (0, Ne.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 text-zinc-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
        a,
      )),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(Xs, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
io.displayName = Xs.displayName;
var no = p.forwardRef((s, e) => {
  const t = (0, Ne.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 text-zinc-950 shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
        a,
      )),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(Kr, {
          children: (0, i.jsx)(js, { ref: e, className: n, ...r }),
        })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
no.displayName = js.displayName;
var oo = p.forwardRef((s, e) => {
  const t = (0, Ne.c)(11);
  let a, r, n;
  t[0] !== s
    ? (({ className: a, inset: r, ...n } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n))
    : ((a = t[1]), (r = t[2]), (n = t[3]));
  const o = r && "pl-8";
  let l;
  t[4] !== a || t[5] !== o
    ? ((l = E(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50",
        o,
        a,
      )),
      (t[4] = a),
      (t[5] = o),
      (t[6] = l))
    : (l = t[6]);
  let c;
  return (
    t[7] !== n || t[8] !== e || t[9] !== l
      ? ((c = (0, i.jsx)(ys, { ref: e, className: l, ...n })),
        (t[7] = n),
        (t[8] = e),
        (t[9] = l),
        (t[10] = c))
      : (c = t[10]),
    c
  );
});
oo.displayName = ys.displayName;
var lo = p.forwardRef((s, e) => {
  const t = (0, Ne.c)(14);
  let a, r, n, o;
  t[0] !== s
    ? (({ className: n, children: r, checked: a, ...o } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n),
      (t[4] = o))
    : ((a = t[1]), (r = t[2]), (n = t[3]), (o = t[4]));
  let l;
  t[5] !== n
    ? ((l = E(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50",
        n,
      )),
      (t[5] = n),
      (t[6] = l))
    : (l = t[6]);
  let c;
  t[7] === Symbol.for("react.memo_cache_sentinel")
    ? ((c = (0, i.jsx)("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: (0, i.jsx)(Rs, {
          children: (0, i.jsx)(xt, { className: "h-4 w-4" }),
        }),
      })),
      (t[7] = c))
    : (c = t[7]);
  let d;
  return (
    t[8] !== a || t[9] !== r || t[10] !== o || t[11] !== e || t[12] !== l
      ? ((d = (0, i.jsxs)(bs, {
          ref: e,
          className: l,
          checked: a,
          ...o,
          children: [c, r],
        })),
        (t[8] = a),
        (t[9] = r),
        (t[10] = o),
        (t[11] = e),
        (t[12] = l),
        (t[13] = d))
      : (d = t[13]),
    d
  );
});
lo.displayName = bs.displayName;
var co = p.forwardRef((s, e) => {
  const t = (0, Ne.c)(12);
  let a, r, n;
  t[0] !== s
    ? (({ className: r, children: a, ...n } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n))
    : ((a = t[1]), (r = t[2]), (n = t[3]));
  let o;
  t[4] !== r
    ? ((o = E(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50",
        r,
      )),
      (t[4] = r),
      (t[5] = o))
    : (o = t[5]);
  let l;
  t[6] === Symbol.for("react.memo_cache_sentinel")
    ? ((l = (0, i.jsx)("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: (0, i.jsx)(Rs, {
          children: (0, i.jsx)(Cs, { className: "h-2 w-2 fill-current" }),
        }),
      })),
      (t[6] = l))
    : (l = t[6]);
  let c;
  return (
    t[7] !== a || t[8] !== n || t[9] !== e || t[10] !== o
      ? ((c = (0, i.jsxs)(fs, {
          ref: e,
          className: o,
          ...n,
          children: [l, a],
        })),
        (t[7] = a),
        (t[8] = n),
        (t[9] = e),
        (t[10] = o),
        (t[11] = c))
      : (c = t[11]),
    c
  );
});
co.displayName = fs.displayName;
var mo = p.forwardRef((s, e) => {
  const t = (0, Ne.c)(11);
  let a, r, n;
  t[0] !== s
    ? (({ className: a, inset: r, ...n } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n))
    : ((a = t[1]), (r = t[2]), (n = t[3]));
  const o = r && "pl-8";
  let l;
  t[4] !== a || t[5] !== o
    ? ((l = E(
        "px-2 py-1.5 text-sm font-semibold text-zinc-950 dark:text-zinc-50",
        o,
        a,
      )),
      (t[4] = a),
      (t[5] = o),
      (t[6] = l))
    : (l = t[6]);
  let c;
  return (
    t[7] !== n || t[8] !== e || t[9] !== l
      ? ((c = (0, i.jsx)(Ms, { ref: e, className: l, ...n })),
        (t[7] = n),
        (t[8] = e),
        (t[9] = l),
        (t[10] = c))
      : (c = t[10]),
    c
  );
});
mo.displayName = Ms.displayName;
var uo = p.forwardRef((s, e) => {
  const t = (0, Ne.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E("-mx-1 my-1 h-px bg-zinc-200 dark:bg-zinc-800", a)),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(sa, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
uo.displayName = sa.displayName;
var fo = (s) => {
  const e = (0, Ne.c)(8);
  let t, a;
  e[0] !== s
    ? (({ className: t, ...a } = s), (e[0] = s), (e[1] = t), (e[2] = a))
    : ((t = e[1]), (a = e[2]));
  let r;
  e[3] !== t
    ? ((r = E(
        "ml-auto text-xs tracking-widest text-zinc-500 dark:text-zinc-400",
        t,
      )),
      (e[3] = t),
      (e[4] = r))
    : (r = e[4]);
  let n;
  return (
    e[5] !== a || e[6] !== r
      ? ((n = (0, i.jsx)("span", { className: r, ...a })),
        (e[5] = a),
        (e[6] = r),
        (e[7] = n))
      : (n = e[7]),
    n
  );
};
fo.displayName = "ContextMenuShortcut";
var tt = H(),
  Na = Er;
var ho = Or;
var ka = p.forwardRef((s, e) => {
  const t = (0, tt.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E(
        "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        a,
      )),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(na, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
ka.displayName = na.displayName;
var Lt = p.forwardRef((s, e) => {
  const t = (0, tt.c)(30);
  let a, r, n, o;
  t[0] !== s
    ? (({ className: r, children: a, onDragClose: n, ...o } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n),
      (t[4] = o))
    : ((a = t[1]), (r = t[2]), (n = t[3]), (o = t[4]));
  const l = $i(),
    c = Si(0);
  let d, m;
  t[5] === Symbol.for("react.memo_cache_sentinel")
    ? ((d = [0, 200]), (m = [1, 0.5]), (t[5] = d), (t[6] = m))
    : ((d = t[5]), (m = t[6]));
  const h = Ci(c, d, m);
  let x;
  t[7] !== l || t[8] !== n
    ? ((x = async (S, _) => {
        _.offset.y > 150 || _.velocity.y > 500
          ? n
            ? n()
            : document.querySelector("[data-dialog-close]")?.click()
          : l.start({
              y: 0,
              transition: { type: "spring", stiffness: 300, damping: 30 },
            });
      }),
      (t[7] = l),
      (t[8] = n),
      (t[9] = x))
    : (x = t[9]);
  const u = x;
  let f;
  t[10] === Symbol.for("react.memo_cache_sentinel")
    ? ((f = (0, i.jsx)(ka, {})), (t[10] = f))
    : (f = t[10]);
  let g, v;
  t[11] === Symbol.for("react.memo_cache_sentinel")
    ? ((g = { top: 0, bottom: 0 }),
      (v = { top: 0, bottom: 0.8 }),
      (t[11] = g),
      (t[12] = v))
    : ((g = t[11]), (v = t[12]));
  let b;
  t[13] !== h || t[14] !== c
    ? ((b = { y: c, opacity: h }), (t[13] = h), (t[14] = c), (t[15] = b))
    : (b = t[15]);
  let w;
  t[16] !== r
    ? ((w = E(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 bg-white p-6 shadow-lg duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-full data-[state=open]:slide-in-from-bottom-full rounded-3xl dark:border-zinc-800 dark:bg-zinc-950",
        r,
      )),
      (t[16] = r),
      (t[17] = w))
    : (w = t[17]);
  let y;
  t[18] === Symbol.for("react.memo_cache_sentinel")
    ? ((y = (0, i.jsx)("div", {
        className: "flex w-full items-center justify-center pt-2 pb-1 shrink-0",
        children: (0, i.jsx)("div", {
          className: "h-1.5 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800",
        }),
      })),
      (t[18] = y))
    : (y = t[18]);
  let z;
  t[19] === Symbol.for("react.memo_cache_sentinel")
    ? ((z = (0, i.jsxs)(wi, {
        "data-dialog-close": !0,
        className:
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-500 dark:ring-offset-zinc-950 dark:focus:ring-zinc-300 dark:data-[state=open]:bg-zinc-800 dark:data-[state=open]:text-zinc-400",
        children: [
          (0, i.jsx)(et, { className: "h-4 w-4" }),
          (0, i.jsx)("span", { className: "sr-only", children: "Close" }),
        ],
      })),
      (t[19] = z))
    : (z = t[19]);
  let j;
  t[20] !== a || t[21] !== l || t[22] !== u || t[23] !== b || t[24] !== w
    ? ((j = (0, i.jsxs)(la.div, {
        drag: "y",
        dragConstraints: g,
        dragElastic: v,
        onDragEnd: u,
        animate: l,
        style: b,
        className: w,
        children: [y, a, z],
      })),
      (t[20] = a),
      (t[21] = l),
      (t[22] = u),
      (t[23] = b),
      (t[24] = w),
      (t[25] = j))
    : (j = t[25]);
  let k;
  return (
    t[26] !== o || t[27] !== e || t[28] !== j
      ? ((k = (0, i.jsxs)(ho, {
          children: [
            f,
            (0, i.jsx)(oa, {
              ref: e,
              asChild: !0,
              "aria-describedby": void 0,
              ...o,
              children: j,
            }),
          ],
        })),
        (t[26] = o),
        (t[27] = e),
        (t[28] = j),
        (t[29] = k))
      : (k = t[29]),
    k
  );
});
Lt.displayName = oa.displayName;
var Tt = (s) => {
  const e = (0, tt.c)(8);
  let t, a;
  e[0] !== s
    ? (({ className: t, ...a } = s), (e[0] = s), (e[1] = t), (e[2] = a))
    : ((t = e[1]), (a = e[2]));
  let r;
  e[3] !== t
    ? ((r = E("flex flex-col space-y-1.5 text-center sm:text-left", t)),
      (e[3] = t),
      (e[4] = r))
    : (r = e[4]);
  let n;
  return (
    e[5] !== a || e[6] !== r
      ? ((n = (0, i.jsx)("div", { className: r, ...a })),
        (e[5] = a),
        (e[6] = r),
        (e[7] = n))
      : (n = e[7]),
    n
  );
};
Tt.displayName = "DialogHeader";
var It = (s) => {
  const e = (0, tt.c)(8);
  let t, a;
  e[0] !== s
    ? (({ className: t, ...a } = s), (e[0] = s), (e[1] = t), (e[2] = a))
    : ((t = e[1]), (a = e[2]));
  let r;
  e[3] !== t
    ? ((r = E(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
        t,
      )),
      (e[3] = t),
      (e[4] = r))
    : (r = e[4]);
  let n;
  return (
    e[5] !== a || e[6] !== r
      ? ((n = (0, i.jsx)("div", { className: r, ...a })),
        (e[5] = a),
        (e[6] = r),
        (e[7] = n))
      : (n = e[7]),
    n
  );
};
It.displayName = "DialogFooter";
var At = p.forwardRef((s, e) => {
  const t = (0, tt.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E("text-lg font-semibold leading-none tracking-tight", a)),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(ra, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
At.displayName = ra.displayName;
var za = p.forwardRef((s, e) => {
  const t = (0, tt.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E("text-sm text-zinc-500 dark:text-zinc-400", a)),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(Is, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
za.displayName = Is.displayName;
var ke = H(),
  po = Ni,
  xo = Ur,
  p0 = qr;
var go = p.forwardRef((s, e) => {
  const t = (0, ke.c)(14);
  let a, r, n, o;
  t[0] !== s
    ? (({ className: r, inset: n, children: a, ...o } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n),
      (t[4] = o))
    : ((a = t[1]), (r = t[2]), (n = t[3]), (o = t[4]));
  const l = n && "pl-8";
  let c;
  t[5] !== r || t[6] !== l
    ? ((c = E(
        "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-zinc-100 data-[state=open]:bg-zinc-100 dark:focus:bg-zinc-800 dark:data-[state=open]:bg-zinc-800",
        l,
        r,
      )),
      (t[5] = r),
      (t[6] = l),
      (t[7] = c))
    : (c = t[7]);
  let d;
  t[8] === Symbol.for("react.memo_cache_sentinel")
    ? ((d = (0, i.jsx)(gt, { className: "ml-auto h-4 w-4" })), (t[8] = d))
    : (d = t[8]);
  let m;
  return (
    t[9] !== a || t[10] !== o || t[11] !== e || t[12] !== c
      ? ((m = (0, i.jsxs)($s, {
          ref: e,
          className: c,
          ...o,
          children: [a, d],
        })),
        (t[9] = a),
        (t[10] = o),
        (t[11] = e),
        (t[12] = c),
        (t[13] = m))
      : (m = t[13]),
    m
  );
});
go.displayName = $s.displayName;
var vo = p.forwardRef((s, e) => {
  const t = (0, ke.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 text-zinc-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
        a,
      )),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(ws, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
vo.displayName = ws.displayName;
var Ca = p.forwardRef((s, e) => {
  const t = (0, ke.c)(11);
  let a, r, n;
  t[0] !== s
    ? (({ className: a, sideOffset: n, ...r } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n))
    : ((a = t[1]), (r = t[2]), (n = t[3]));
  const o = n === void 0 ? 4 : n;
  let l;
  t[4] !== a
    ? ((l = E(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white p-1 text-zinc-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
        a,
      )),
      (t[4] = a),
      (t[5] = l))
    : (l = t[5]);
  let c;
  return (
    t[6] !== r || t[7] !== e || t[8] !== o || t[9] !== l
      ? ((c = (0, i.jsx)(Ar, {
          children: (0, i.jsx)(Gs, {
            ref: e,
            sideOffset: o,
            className: l,
            ...r,
          }),
        })),
        (t[6] = r),
        (t[7] = e),
        (t[8] = o),
        (t[9] = l),
        (t[10] = c))
      : (c = t[10]),
    c
  );
});
Ca.displayName = Gs.displayName;
var mt = p.forwardRef((s, e) => {
  const t = (0, ke.c)(13);
  let a, r, n, o;
  t[0] !== s
    ? (({ className: a, inset: r, variant: o, ...n } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n),
      (t[4] = o))
    : ((a = t[1]), (r = t[2]), (n = t[3]), (o = t[4]));
  const l =
      o === "destructive" &&
      "text-rose-600 focus:bg-rose-50 focus:text-rose-600 dark:text-rose-500 dark:focus:bg-rose-950",
    c = r && "pl-8";
  let d;
  t[5] !== a || t[6] !== l || t[7] !== c
    ? ((d = E(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50",
        l,
        c,
        a,
      )),
      (t[5] = a),
      (t[6] = l),
      (t[7] = c),
      (t[8] = d))
    : (d = t[8]);
  let m;
  return (
    t[9] !== n || t[10] !== e || t[11] !== d
      ? ((m = (0, i.jsx)(Ns, { ref: e, className: d, ...n })),
        (t[9] = n),
        (t[10] = e),
        (t[11] = d),
        (t[12] = m))
      : (m = t[12]),
    m
  );
});
mt.displayName = Ns.displayName;
var bo = p.forwardRef((s, e) => {
  const t = (0, ke.c)(14);
  let a, r, n, o;
  t[0] !== s
    ? (({ className: n, children: r, checked: a, ...o } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n),
      (t[4] = o))
    : ((a = t[1]), (r = t[2]), (n = t[3]), (o = t[4]));
  let l;
  t[5] !== n
    ? ((l = E(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50",
        n,
      )),
      (t[5] = n),
      (t[6] = l))
    : (l = t[6]);
  let c;
  t[7] === Symbol.for("react.memo_cache_sentinel")
    ? ((c = (0, i.jsx)("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: (0, i.jsx)(ks, {
          children: (0, i.jsx)(xt, { className: "h-4 w-4" }),
        }),
      })),
      (t[7] = c))
    : (c = t[7]);
  let d;
  return (
    t[8] !== a || t[9] !== r || t[10] !== o || t[11] !== e || t[12] !== l
      ? ((d = (0, i.jsxs)(hs, {
          ref: e,
          className: l,
          checked: a,
          ...o,
          children: [c, r],
        })),
        (t[8] = a),
        (t[9] = r),
        (t[10] = o),
        (t[11] = e),
        (t[12] = l),
        (t[13] = d))
      : (d = t[13]),
    d
  );
});
bo.displayName = hs.displayName;
var wo = p.forwardRef((s, e) => {
  const t = (0, ke.c)(12);
  let a, r, n;
  t[0] !== s
    ? (({ className: r, children: a, ...n } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n))
    : ((a = t[1]), (r = t[2]), (n = t[3]));
  let o;
  t[4] !== r
    ? ((o = E(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50",
        r,
      )),
      (t[4] = r),
      (t[5] = o))
    : (o = t[5]);
  let l;
  t[6] === Symbol.for("react.memo_cache_sentinel")
    ? ((l = (0, i.jsx)("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: (0, i.jsx)(ks, {
          children: (0, i.jsx)(Cs, { className: "h-2 w-2 fill-current" }),
        }),
      })),
      (t[6] = l))
    : (l = t[6]);
  let c;
  return (
    t[7] !== a || t[8] !== n || t[9] !== e || t[10] !== o
      ? ((c = (0, i.jsxs)(zs, {
          ref: e,
          className: o,
          ...n,
          children: [l, a],
        })),
        (t[7] = a),
        (t[8] = n),
        (t[9] = e),
        (t[10] = o),
        (t[11] = c))
      : (c = t[11]),
    c
  );
});
wo.displayName = zs.displayName;
var yo = p.forwardRef((s, e) => {
  const t = (0, ke.c)(11);
  let a, r, n;
  t[0] !== s
    ? (({ className: a, inset: r, ...n } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n))
    : ((a = t[1]), (r = t[2]), (n = t[3]));
  const o = r && "pl-8";
  let l;
  t[4] !== a || t[5] !== o
    ? ((l = E("px-2 py-1.5 text-sm font-semibold", o, a)),
      (t[4] = a),
      (t[5] = o),
      (t[6] = l))
    : (l = t[6]);
  let c;
  return (
    t[7] !== n || t[8] !== e || t[9] !== l
      ? ((c = (0, i.jsx)(vs, { ref: e, className: l, ...n })),
        (t[7] = n),
        (t[8] = e),
        (t[9] = l),
        (t[10] = c))
      : (c = t[10]),
    c
  );
});
yo.displayName = vs.displayName;
var jo = p.forwardRef((s, e) => {
  const t = (0, ke.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E("-mx-1 my-1 h-px bg-zinc-100 dark:bg-zinc-800", a)),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(ps, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
jo.displayName = ps.displayName;
var _o = (s) => {
  const e = (0, ke.c)(8);
  let t, a;
  e[0] !== s
    ? (({ className: t, ...a } = s), (e[0] = s), (e[1] = t), (e[2] = a))
    : ((t = e[1]), (a = e[2]));
  let r;
  e[3] !== t
    ? ((r = E("ml-auto text-xs tracking-widest opacity-60", t)),
      (e[3] = t),
      (e[4] = r))
    : (r = e[4]);
  let n;
  return (
    e[5] !== a || e[6] !== r
      ? ((n = (0, i.jsx)("span", { className: r, ...a })),
        (e[5] = a),
        (e[6] = r),
        (e[7] = n))
      : (n = e[7]),
    n
  );
};
_o.displayName = "DropdownMenuShortcut";
var No = Object.defineProperty,
  ko = (s, e) => {
    for (var t in e) No(s, t, { get: e[t], enumerable: !0 });
  },
  Ce = {};
ko(Ce, {
  ActiveEmoji: () => Qa,
  Empty: () => Ka,
  List: () => Wa,
  Loading: () => Ga,
  Root: () => qa,
  Search: () => Fa,
  SkinTone: () => Ya,
  SkinToneSelector: () => Ua,
  Viewport: () => Da,
});
var Sa =
    "'Apple Color Emoji', 'Noto Color Emoji', 'Twemoji Mozilla', 'Android Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', EmojiSymbols, sans-serif",
  qt = ["none", "light", "medium-light", "medium", "medium-dark", "dark"];
function zt(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
var fe = 2,
  te = null;
function Ot(s) {
  try {
    te ??= document
      .createElement("canvas")
      .getContext("2d", { willReadFrequently: !0 });
  } catch {}
  if (
    !te ||
    (queueMicrotask(() => {
      te && (te = null);
    }),
    (te.canvas.width = fe),
    (te.canvas.height = fe),
    (te.font = `2px ${Sa}`),
    (te.textBaseline = "middle"),
    te.measureText(s).width >= fe * 2)
  )
    return !1;
  ((te.fillStyle = "#00f"), te.fillText(s, 0, 0));
  let e = te.getImageData(0, 0, fe, fe).data;
  (te.clearRect(0, 0, fe, fe), (te.fillStyle = "#f00"), te.fillText(s, 0, 0));
  let t = te.getImageData(0, 0, fe, fe).data;
  for (let a = 0; a < fe * fe * 4; a += 4)
    if (e[a] !== t[a] || e[a + 1] !== t[a + 1] || e[a + 2] !== t[a + 2])
      return !1;
  return !0;
}
function Bt(s, e, t) {
  try {
    let a = s.getItem(e);
    if (!a) throw new Error(`No value found for "${e}".`);
    return t(JSON.parse(a));
  } catch {
    return null;
  }
}
function $a(s, e, t) {
  s.setItem(e, JSON.stringify(t));
}
function Wt(s) {
  return (e) => (e === void 0 ? void 0 : s(e));
}
function Ut(s) {
  return (e) => (e === null ? null : s(e));
}
function Z(s) {
  if (typeof s != "string") throw new Error();
  return s;
}
function ut(s) {
  if (typeof s != "number") throw new Error();
  return s;
}
function Pa(s) {
  if (typeof s != "boolean") throw new Error();
  return s;
}
function Se(s) {
  return (e) => {
    if (typeof e != "object" || e === null) throw new Error();
    let t = {};
    for (let a in s) {
      let r = e[a];
      (r === void 0 && s[a](void 0), (t[a] = s[a](r)));
    }
    return t;
  };
}
function Ct(s) {
  return (e) => {
    if (!Array.isArray(e)) throw new Error();
    return (e.length > 0 && s(e[0]), e);
  };
}
var Ea = (s, e) => `${s}/${e}/data.json`,
  Ma = (s, e) => `${s}/${e}/messages.json`,
  zo = [
    "bn",
    "da",
    "de",
    "en-gb",
    "en",
    "es-mx",
    "es",
    "et",
    "fi",
    "fr",
    "hi",
    "hu",
    "it",
    "ja",
    "ko",
    "lt",
    "ms",
    "nb",
    "nl",
    "pl",
    "pt",
    "ru",
    "sv",
    "th",
    "uk",
    "vi",
    "zh-hant",
    "zh",
  ],
  Gt = "en",
  Ra = (s) => `frimousse/data/${s}`,
  Kt = "frimousse/metadata";
async function Qt(s, e) {
  try {
    return (await fetch(s, { method: "HEAD", signal: e })).headers.get("etag");
  } catch {
    return null;
  }
}
async function Co(s, e, t) {
  let [{ emojis: a, emojisEtag: r }, { messages: n, messagesEtag: o }] =
    await Promise.all([
      fetch(Ea(s, e), { signal: t }).then(async (l) => ({
        emojis: await l.json(),
        emojisEtag: l.headers.get("etag"),
      })),
      fetch(Ma(s, e), { signal: t }).then(async (l) => ({
        messages: await l.json(),
        messagesEtag: l.headers.get("etag"),
      })),
    ]);
  return { emojis: a, messages: n, emojisEtag: r, messagesEtag: o };
}
async function So(s, e, t) {
  let [a, r] = await Promise.all([Qt(Ea(s, e), t), Qt(Ma(s, e), t)]);
  return { emojisEtag: a, messagesEtag: r };
}
function $o(s) {
  return s.skins
    ? s.skins
        .filter((e) => typeof e.tone == "number")
        .reduce((e, t) => {
          let a = qt[t.tone];
          return ((e[a] = t.emoji), e);
        }, {})
    : void 0;
}
async function Yt(s, e, t) {
  let {
      emojis: a,
      emojisEtag: r,
      messages: n,
      messagesEtag: o,
    } = await Co(s, e, t),
    l = n.subgroups.find(
      (u) => u.key === "country-flag" || u.key === "subdivision-flag",
    ),
    c = n.groups.filter((u) => u.key !== "component"),
    d = a.filter((u) => "group" in u),
    m = c.map((u) => ({ index: u.order, label: zt(u.message) })),
    h = n.skinTones.reduce((u, f) => ((u[f.key] = zt(f.message)), u), {}),
    x = {
      locale: e,
      emojis: d.map((u) => ({
        emoji: u.emoji,
        category: u.group,
        version: u.version,
        label: zt(u.label),
        tags: u.tags ?? [],
        countryFlag: (l && u.subgroup === l.order) || void 0,
        skins: $o(u),
      })),
      categories: m,
      skinTones: h,
    };
  return (
    $a(localStorage, Ra(e), {
      data: x,
      metadata: { emojisEtag: r, messagesEtag: o },
    }),
    x
  );
}
function Po(s, e) {
  let t = new Map();
  for (let o of s) t.has(o.version) || t.set(o.version, o.emoji);
  let a = [...t.keys()].sort((o, l) => l - o),
    r = a[0] ?? 0,
    n = Ot("🇪🇺");
  if (typeof e == "number") return { emojiVersion: e, countryFlags: n };
  for (let o of a)
    if (Ot(t.get(o))) return { emojiVersion: o, countryFlags: n };
  return { emojiVersion: r, countryFlags: n };
}
var Eo = Se({ emojiVersion: ut, countryFlags: Pa }),
  Mo = Se({
    data: Se({
      locale: Z,
      emojis: Ct(
        Se({
          emoji: Z,
          category: ut,
          label: Z,
          version: ut,
          tags: Ct(Z),
          countryFlag: Wt(Pa),
          skins: Wt(
            Se({
              light: Z,
              "medium-light": Z,
              medium: Z,
              "medium-dark": Z,
              dark: Z,
            }),
          ),
        }),
      ),
      categories: Ct(Se({ index: ut, label: Z })),
      skinTones: Se({
        light: Z,
        "medium-light": Z,
        medium: Z,
        "medium-dark": Z,
        dark: Z,
      }),
    }),
    metadata: Se({ emojisEtag: Ut(Z), messagesEtag: Ut(Z) }),
  });
async function Ro({ locale: s, emojiVersion: e, emojibaseUrl: t, signal: a }) {
  let r =
      typeof t == "string"
        ? t
        : `https://cdn.jsdelivr.net/npm/emojibase-data@${typeof e == "number" ? Math.floor(e) : "latest"}`,
    n = Bt(sessionStorage, Kt, Eo),
    o = Bt(localStorage, Ra(s), Mo),
    l;
  if (!o) l = await Yt(r, s, a);
  else if (n) l = o.data;
  else
    try {
      let { emojisEtag: c, messagesEtag: d } = await So(r, s, a);
      l =
        !c || !d || c !== o.metadata.emojisEtag || d !== o.metadata.messagesEtag
          ? await Yt(r, s, a)
          : o.data;
    } catch {
      l = o.data;
    }
  return (
    (n ??= Po(l.emojis, e)),
    $a(sessionStorage, Kt, n),
    {
      locale: s,
      emojis: l.emojis.filter((c) => {
        let d = c.version <= n.emojiVersion;
        return c.countryFlag ? d && n.countryFlags : d;
      }),
      categories: l.categories,
      skinTones: l.skinTones,
    }
  );
}
function Zt(s) {
  return zo.includes(s)
    ? s
    : (console.warn(`Locale "${s}" is not supported, using "${Gt}" instead.`),
      Gt);
}
function Jt(s) {
  return qt.includes(s)
    ? s
    : (console.warn(`Skin tone "${s}" is not valid, using "none" instead.`),
      "none");
}
function Lo(s, e) {
  let t = [];
  if (e <= 0) return t;
  for (let a = 0, r = s.length; a < r; a += e) t.push(s.slice(a, a + e));
  return t;
}
function To(s, e) {
  if (!e) return s;
  let t = e.toLowerCase().trim(),
    a = new WeakMap();
  return s
    .filter((r) => {
      let n = 0;
      r.label.toLowerCase().includes(t) && (n += 10);
      for (let o of r.tags) o.toLowerCase().includes(t) && (n += 1);
      return n > 0 ? (a.set(r, n), !0) : !1;
    })
    .sort((r, n) => (a.get(n) ?? 0) - (a.get(r) ?? 0));
}
function Io(s, e, t, a) {
  let r = To(s.emojis, a),
    n = [],
    o = [],
    l = [],
    c = {},
    d = 0,
    m = 0;
  for (let h of r)
    (c[h.category] || (c[h.category] = []),
      c[h.category].push({
        emoji: t && t !== "none" && h.skins ? h.skins[t] : h.emoji,
        label: h.label,
      }));
  for (let h of s.categories) {
    let x = c[h.index];
    if (!x || x.length === 0) continue;
    let u = Lo(Array.from(x), e).map((f) => ({ categoryIndex: d, emojis: f }));
    (n.push(...u),
      o.push({ label: h.label, rowsCount: u.length, startRowIndex: m }),
      l.push(m),
      d++,
      (m += u.length));
  }
  return {
    count: r.length,
    categories: o,
    categoriesStartRowIndices: l,
    rows: n,
    skinTones: s.skinTones,
  };
}
function Ao(s) {
  let e = {},
    t = null,
    a = null,
    r = new Set(),
    n = () => {
      if (t) {
        ((e = t), (t = null));
        for (let d of r) d(e);
      }
      a = null;
    },
    o = () => t ?? e,
    l = (d) => {
      ((t ??= e),
        Object.assign(t, typeof d == "function" ? d(o()) : d),
        a || (a = requestAnimationFrame(n)));
    },
    c = (d) => (r.add(d), () => r.delete(d));
  return ((e = s(l, o)), { get: o, set: l, subscribe: c });
}
function qo(s) {
  let [e] = (0, p.useState)(s);
  return e;
}
function Fo(s) {
  let e = (0, p.createContext)(null);
  return {
    useStore: () => {
      let t = (0, p.useContext)(e);
      if (!t) throw new Error(s);
      return t;
    },
    Provider: ({ store: t, children: a }) =>
      (0, i.jsx)(e.Provider, { value: t, children: a }),
  };
}
function le(s, e, t = Object.is) {
  let [a, r] = (0, p.useState)(() => e(s.get()));
  return (
    (0, p.useEffect)(
      () =>
        s.subscribe(() => {
          let n = e(s.get());
          r((o) => (t(o, n) ? o : n));
        }),
      [s, e, t],
    ),
    (0, p.useDebugValue)(a),
    a
  );
}
function ve(s, e, t) {
  return le(
    s,
    (0, p.useCallback)((a) => a[e], [e]),
    t,
  );
}
var Xt = 2;
function Do(s, e, t, a, r) {
  let n = 0;
  return Ao((o, l) => ({
    locale: e,
    columns: t,
    sticky: a,
    skinTone: r,
    onEmojiSelect: s,
    data: null,
    search: "",
    interaction: "none",
    activeColumnIndex: 0,
    activeRowIndex: 0,
    rowHeight: null,
    categoryHeaderHeight: null,
    viewportWidth: null,
    viewportHeight: null,
    viewportCurrentCategoryIndex: null,
    viewportStartCategoryIndex: 0,
    viewportStartRowIndex: 0,
    viewportEndRowIndex: 0,
    rootRef: null,
    searchRef: null,
    viewportRef: null,
    listRef: null,
    updateViewportState: (c) => {
      let d = l(),
        m = c?.data ?? d.data,
        h = c?.categoryHeaderHeight ?? d.categoryHeaderHeight,
        x = c?.rowHeight ?? d.rowHeight,
        u = c?.viewportHeight ?? d.viewportHeight;
      if (!m || m.rows.length === 0 || !h || !x || !u)
        return o({
          ...c,
          viewportStartCategoryIndex: 0,
          viewportStartRowIndex: 0,
          viewportEndRowIndex: 0,
        });
      let f = 0,
        g = 0;
      for (let _ of m.categories)
        if (g++ * h + _.startRowIndex * x < n) f += h;
        else break;
      let v = m.categories.length * h + m.rows.length * x,
        b = Math.floor((Xt * x) / 2),
        w = Math.ceil((Xt * x) / 2),
        y = Math.min(n - f - b, v - u),
        z = y + u + w,
        j = Math.max(0, Math.floor(y / x)),
        k = Math.min(m.rows.length - 1, Math.ceil(z / x)),
        S = m.rows[j]?.categoryIndex;
      return o(
        S === void 0 && c
          ? c
          : {
              ...c,
              viewportStartCategoryIndex: S,
              viewportStartRowIndex: j,
              viewportEndRowIndex: k,
            },
      );
    },
    onDataChange: (c) => {
      l().updateViewportState({
        data: c,
        activeColumnIndex: 0,
        activeRowIndex: 0,
      });
    },
    onSearchChange: (c) => {
      o({ search: c, interaction: c ? "keyboard" : "none" });
    },
    onActiveEmojiChange: (c, d, m) => {
      if (
        (o({ interaction: c, activeColumnIndex: d, activeRowIndex: m }),
        c !== "keyboard")
      )
        return;
      let {
          listRef: h,
          viewportRef: x,
          sticky: u,
          rowHeight: f,
          viewportHeight: g,
          categoryHeaderHeight: v,
        } = l(),
        b = h?.current,
        w = x?.current;
      if (!b || !w || !f || !v || !g) return;
      let y = m;
      y === 0 && w.scrollTo({ top: 0, behavior: "instant" });
      let z = b.querySelector(`[aria-rowindex="${y}"]`);
      if (!(z instanceof HTMLElement)) return;
      let j = z.offsetTop,
        k = getComputedStyle(z),
        S = Number.parseFloat(k.scrollMarginTop),
        _ = Number.parseFloat(k.scrollMarginBottom),
        $ = n + S;
      u && j < n + g / 2 && ($ += v);
      let I = $ + g - _;
      (j < $ || j + f > I) &&
        w.scrollTo({
          top: Math.max(
            j < $ + v ? j - Math.max(u ? v : 0, S) : j - g + f + _,
            0,
          ),
          behavior: "instant",
        });
    },
    onActiveEmojiReset: () => {
      o({ interaction: "none", activeColumnIndex: 0, activeRowIndex: 0 });
    },
    onRowHeightChange: (c) => {
      l().updateViewportState({ rowHeight: c });
    },
    onCategoryHeaderHeightChange: (c) => {
      l().updateViewportState({ categoryHeaderHeight: c });
    },
    onViewportSizeChange: (c, d) => {
      l().updateViewportState({ viewportWidth: c, viewportHeight: d });
    },
    onViewportScroll: (c) => {
      ((n = c), l().updateViewportState());
    },
  }));
}
var { useStore: ae, Provider: Ho } = Fo("EmojiPicker.Root is missing.");
function Vo(s) {
  return s.search;
}
function Ft(s) {
  return s.interaction === "none"
    ? void 0
    : s.data?.rows[s.activeRowIndex]?.emojis[s.activeColumnIndex];
}
function Oo(s) {
  return (
    s.data === void 0 ||
    (typeof s.data?.count == "number" && s.data.count === 0)
  );
}
function Bo(s) {
  return (
    s.data === null ||
    s.viewportHeight === null ||
    s.rowHeight === null ||
    s.categoryHeaderHeight === null
  );
}
function La(s) {
  return s.data?.rows.length;
}
function Wo(s) {
  return s.data?.categories.length;
}
function Uo(s) {
  return s.data?.categoriesStartRowIndices;
}
function Go(s) {
  return s.data?.skinTones;
}
function Ta(s, e) {
  return s?.emoji === e?.emoji;
}
function Ko(s, e) {
  return s?.categoryIndex !== e?.categoryIndex ||
    s?.emojis.length !== e?.emojis.length
    ? !1
    : !!s?.emojis.every((t, a) => Ta(t, e?.emojis[a]));
}
var st = "‍",
  es = /\p{Emoji_Modifier_Base}/u,
  Qo = /\uFE0F$/,
  Yo = /\u{1F3FB}|\u{1F3FC}|\u{1F3FD}|\u{1F3FE}|\u{1F3FF}/gu,
  Zo = {
    light: "🏻",
    "medium-light": "🏼",
    medium: "🏽",
    "medium-dark": "🏾",
    dark: "🏿",
  };
function Jo(s, e) {
  if (!s.split(st).some((a) => es.test(a))) return s;
  let t = s
    .split(st)
    .map((a) => a.replace(Yo, ""))
    .join(st);
  return e === "none"
    ? t
    : t
        .split(st)
        .map((a, r, n) => {
          let o = n.length > 1;
          return !es.test(a) || (o && a === "🤝")
            ? a
            : a.replace(Qo, "") + Zo[e];
        })
        .join(st);
}
function Xo(s) {
  return qt.map((e) => ({ skinTone: e, emoji: Jo(s, e) }));
}
function Ia() {
  return (0, p.useDeferredValue)(le(ae(), Ft, Ta));
}
function Aa(s = "✋") {
  let e = ae(),
    t = ve(e, "skinTone"),
    a = (0, p.useMemo)(() => Xo(s), [s]);
  return [
    t,
    (0, p.useCallback)((r) => {
      e.set({ skinTone: r });
    }, []),
    a,
  ];
}
function Dt(s, e) {
  if (Object.is(s, e)) return !0;
  if (
    typeof s != "object" ||
    typeof e != "object" ||
    s === null ||
    e === null ||
    Array.isArray(s) !== Array.isArray(e)
  )
    return !1;
  let t = Object.keys(s),
    a = Object.keys(e);
  return t.length !== a.length ? !1 : t.every((r) => r in e && s[r] === e[r]);
}
function el(...s) {}
function tl(s, e) {
  let t = null;
  if (typeof window.requestIdleCallback == "function")
    t = window.requestIdleCallback(s, e);
  else {
    let a = Date.now();
    t = window.setTimeout(() => {
      s({
        didTimeout: !1,
        timeRemaining: () => Math.max(0, (e?.timeout ?? 50) - (Date.now() - a)),
      });
    }, 10);
  }
  return () => {
    typeof window.cancelIdleCallback == "function"
      ? window.cancelIdleCallback(t)
      : window.clearTimeout(t);
  };
}
var he = typeof window < "u" ? p.useLayoutEffect : p.useEffect;
function sl(s) {
  let e = (0, p.useRef)(s);
  return (
    he(() => {
      e.current = s;
    }),
    (0, p.useCallback)((...t) => e.current(...t), [])
  );
}
function al({ emojiVersion: s, emojibaseUrl: e }) {
  let [t, a] = (0, p.useState)(void 0),
    r = ae(),
    n = ve(r, "locale"),
    o = ve(r, "columns"),
    l = ve(r, "skinTone"),
    c = ve(r, "search");
  return (
    (0, p.useEffect)(() => {
      let d = new AbortController(),
        m = d.signal;
      return (
        Ro({ locale: n, emojiVersion: s, emojibaseUrl: e, signal: m })
          .then((h) => {
            a(h);
          })
          .catch((h) => {
            m.aborted || console.error(h);
          }),
        () => {
          d.abort();
        }
      );
    }, [s, e, n]),
    (0, p.useEffect)(() => {
      if (t)
        return tl(
          () => {
            r.get().onDataChange(Io(t, o, l, c));
          },
          { timeout: 100 },
        );
    }, [t, o, l, c]),
    null
  );
}
var qa = (0, p.forwardRef)(
    (
      {
        locale: s = "en",
        columns: e = 9,
        skinTone: t = "none",
        onEmojiSelect: a = el,
        emojiVersion: r,
        emojibaseUrl: n,
        onFocusCapture: o,
        onBlurCapture: l,
        children: c,
        style: d,
        sticky: m = !0,
        ...h
      },
      x,
    ) => {
      let u = sl(a),
        f = qo(() => Do(u, Zt(s), e, m, Jt(t))),
        [g, v] = (0, p.useState)(!1),
        b = (0, p.useRef)(null),
        w = (0, p.useCallback)((j) => {
          j && ((b.current = j), f.set({ rootRef: b }));
        }, []);
      (he(() => {
        f.set({ locale: Zt(s) });
      }, [s]),
        he(() => {
          f.set({ columns: e });
        }, [e]),
        he(() => {
          f.set({ sticky: m });
        }, [m]),
        he(() => {
          f.set({ skinTone: Jt(t) });
        }, [t]));
      let y = (0, p.useCallback)(
          (j) => {
            o?.(j);
            let { searchRef: k, viewportRef: S } = f.get(),
              _ =
                j.target === k?.current ||
                j.target.hasAttribute("frimousse-search"),
              $ =
                j.target === S?.current ||
                j.target.hasAttribute("frimousse-viewport");
            j.isDefaultPrevented() ||
              (v(_ || $),
              j.isDefaultPrevented() ||
                (v(_ || $),
                $
                  ? f.get().onActiveEmojiChange("keyboard", 0, 0)
                  : _ &&
                    f.get().search === "" &&
                    f.set({ interaction: "none" })));
          },
          [o],
        ),
        z = (0, p.useCallback)(
          (j) => {
            (l?.(j),
              !j.isDefaultPrevented() &&
                !j.currentTarget.contains(j.relatedTarget) &&
                v(!1));
          },
          [l],
        );
      return (
        he(() => {
          g || f.get().onActiveEmojiReset();
        }, [g]),
        (0, p.useImperativeHandle)(x, () => b.current),
        (0, p.useEffect)(() => {
          if (!g) return;
          function j(k) {
            if (
              k.defaultPrevented ||
              (!k.key.startsWith("Arrow") && k.key !== "Enter")
            )
              return;
            let {
              data: S,
              onEmojiSelect: _,
              onActiveEmojiChange: $,
              interaction: I,
              activeColumnIndex: A,
              activeRowIndex: R,
            } = f.get();
            if (k.key === "Enter") {
              let M = Ft(f.get());
              M && (k.preventDefault(), _(M));
            }
            if (k.key.startsWith("Arrow")) {
              let M = A,
                P = R;
              if ((k.preventDefault(), I !== "none")) {
                if (S?.rows && S.rows.length > 0)
                  switch (k.key) {
                    case "ArrowLeft":
                      if (M === 0) {
                        let C = P - 1,
                          T = S.rows[C];
                        T && ((P = C), (M = T.emojis.length - 1));
                      } else M -= 1;
                      break;
                    case "ArrowRight":
                      if (M === S.rows[P].emojis.length - 1) {
                        let C = P + 1;
                        S.rows[C] && ((P = C), (M = 0));
                      } else M += 1;
                      break;
                    case "ArrowUp": {
                      let C = S.rows[P - 1];
                      C && ((P -= 1), C.emojis[M] || (M = C.emojis.length - 1));
                      break;
                    }
                    case "ArrowDown": {
                      let C = S.rows[P + 1];
                      C && ((P += 1), C.emojis[M] || (M = C.emojis.length - 1));
                      break;
                    }
                  }
                $("keyboard", M, P);
              } else $("keyboard", 0, 0);
            }
          }
          return (
            document.addEventListener("keydown", j),
            () => {
              document.removeEventListener("keydown", j);
            }
          );
        }, [g]),
        he(() => {
          let j = null,
            k = null,
            S = null,
            _ = null,
            $ = f.subscribe((P) => {
              b.current &&
                (j !== P.viewportWidth &&
                  ((j = P.viewportWidth),
                  b.current.style.setProperty(
                    "--frimousse-viewport-width",
                    `${P.viewportWidth}px`,
                  )),
                k !== P.viewportHeight &&
                  ((k = P.viewportHeight),
                  b.current.style.setProperty(
                    "--frimousse-viewport-height",
                    `${P.viewportHeight}px`,
                  )),
                S !== P.rowHeight &&
                  ((S = P.rowHeight),
                  b.current.style.setProperty(
                    "--frimousse-row-height",
                    `${P.rowHeight}px`,
                  )),
                _ !== P.categoryHeaderHeight &&
                  ((_ = P.categoryHeaderHeight),
                  b.current.style.setProperty(
                    "--frimousse-category-header-height",
                    `${P.categoryHeaderHeight}px`,
                  )));
            }),
            {
              viewportWidth: I,
              viewportHeight: A,
              rowHeight: R,
              categoryHeaderHeight: M,
            } = f.get();
          return (
            I &&
              b.current.style.setProperty(
                "--frimousse-viewport-width",
                `${I}px`,
              ),
            A &&
              b.current.style.setProperty(
                "--frimousse-viewport-height",
                `${A}px`,
              ),
            R &&
              b.current.style.setProperty("--frimousse-row-height", `${R}px`),
            M &&
              b.current.style.setProperty(
                "--frimousse-category-header-height",
                `${M}px`,
              ),
            $
          );
        }, []),
        (0, i.jsx)("div", {
          "data-focused": g ? "" : void 0,
          "frimousse-root": "",
          onBlurCapture: z,
          onFocusCapture: y,
          ...h,
          ref: w,
          style: { "--frimousse-emoji-font": Sa, ...d },
          children: (0, i.jsxs)(Ho, {
            store: f,
            children: [(0, i.jsx)(al, { emojiVersion: r, emojibaseUrl: n }), c],
          }),
        })
      );
    },
  ),
  Fa = (0, p.forwardRef)(
    ({ value: s, defaultValue: e, onChange: t, ...a }, r) => {
      let n = ae(),
        o = (0, p.useRef)(null),
        l = (0, p.useCallback)((h) => {
          h && ((o.current = h), n.set({ searchRef: o }));
        }, []),
        c = typeof s == "string",
        d = (0, p.useRef)(c);
      ((0, p.useEffect)(() => {
        d.current = c;
      }, [c]),
        he(() => {
          n.set({
            search: typeof s == "string" ? s : typeof e == "string" ? e : "",
          });
        }, []),
        he(() => {
          typeof s == "string" && n.get().onSearchChange(s);
        }, [s]));
      let m = (0, p.useCallback)(
        (h) => {
          (t?.(h),
            h.isDefaultPrevented() || n.get().onSearchChange(h.target.value));
        },
        [t],
      );
      return (
        (0, p.useImperativeHandle)(r, () => o.current),
        (0, i.jsx)("input", {
          autoCapitalize: "off",
          autoComplete: "off",
          autoCorrect: "off",
          enterKeyHint: "done",
          "frimousse-search": "",
          placeholder: "Search…",
          spellCheck: !1,
          type: "search",
          ...a,
          defaultValue: e,
          onChange: m,
          ref: l,
          value: s,
        })
      );
    },
  ),
  rl = (0, p.memo)(() => {
    let s = Ia();
    return s
      ? (0, i.jsx)("div", {
          "aria-live": "polite",
          style: {
            border: 0,
            clip: "rect(0, 0, 0, 0)",
            height: 1,
            margin: -1,
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            whiteSpace: "nowrap",
            width: 1,
            wordWrap: "normal",
          },
          children: s.label,
        })
      : null;
  }),
  Da = (0, p.forwardRef)(
    ({ children: s, onScroll: e, onKeyDown: t, style: a, ...r }, n) => {
      let o = ae(),
        l = (0, p.useRef)(null),
        c = (0, p.useCallback)((x) => {
          x && ((l.current = x), o.set({ viewportRef: l }));
        }, []),
        d = le(o, La),
        m = le(o, Wo),
        h = (0, p.useCallback)(
          (x) => {
            (e?.(x), o.get().onViewportScroll(x.currentTarget.scrollTop));
          },
          [e],
        );
      return (
        he(() => {
          if (!l.current) return;
          let x = new ResizeObserver(([u]) => {
            let f = u?.borderBoxSize[0]?.inlineSize ?? 0,
              g = u?.borderBoxSize[0]?.blockSize ?? 0,
              {
                onViewportSizeChange: v,
                viewportHeight: b,
                viewportWidth: w,
              } = o.get();
            (b !== g || w !== f) && v(f, g);
          });
          return (
            x.observe(l.current),
            o
              .get()
              .onViewportSizeChange(
                l.current.offsetWidth,
                l.current.clientHeight,
              ),
            () => {
              x.disconnect();
            }
          );
        }, []),
        (0, p.useImperativeHandle)(n, () => l.current),
        (0, i.jsxs)("div", {
          "frimousse-viewport": "",
          ...r,
          onScroll: h,
          ref: c,
          style: {
            position: "relative",
            boxSizing: "border-box",
            contain: "layout paint",
            containIntrinsicSize:
              typeof d == "number" && typeof m == "number"
                ? `var(--frimousse-viewport-width, auto) calc(${d} * var(--frimousse-row-height) + ${m} * var(--frimousse-category-header-height))`
                : void 0,
            overflowY: "auto",
            overscrollBehavior: "contain",
            scrollbarGutter: "stable",
            willChange: "scroll-position",
            ...a,
          },
          children: [(0, i.jsx)(rl, {}), s],
        })
      );
    },
  );
function Ha(s, e, t) {
  return {
    emoji: { ...s, isActive: t },
    role: "gridcell",
    "aria-colindex": e,
    "aria-selected": t || void 0,
    "aria-label": s.label,
    "data-active": t ? "" : void 0,
    "frimousse-emoji": "",
    style: { fontFamily: "var(--frimousse-emoji-font)" },
    tabIndex: -1,
  };
}
function Va(s, e = !1) {
  return {
    role: e ? void 0 : "row",
    "aria-rowindex": e ? void 0 : s,
    "frimousse-row": "",
    style: {
      contain: e ? void 0 : "content",
      height: e ? void 0 : "var(--frimousse-row-height)",
      display: "flex",
    },
  };
}
function Oa(s, e) {
  return {
    "frimousse-category": "",
    style: {
      contain: "content",
      top: e
        ? `calc(${s} * var(--frimousse-category-header-height) + ${e.startRowIndex} * var(--frimousse-row-height))`
        : void 0,
      height: e
        ? `calc(var(--frimousse-category-header-height) + ${e.rowsCount} * var(--frimousse-row-height))`
        : void 0,
      width: "100%",
      pointerEvents: "none",
      position: "absolute",
    },
  };
}
function Ba(s, e = !1, t = !0) {
  return {
    category: s,
    "frimousse-category-header": "",
    style: {
      contain: e ? void 0 : "layout paint",
      height: e ? void 0 : "var(--frimousse-category-header-height)",
      pointerEvents: "auto",
      position: t ? "sticky" : void 0,
      top: 0,
    },
  };
}
function ts(s, e, t, a) {
  return {
    "frimousse-list-sizer": "",
    style: {
      position: "relative",
      boxSizing: "border-box",
      height: `calc(${s} * var(--frimousse-row-height) + ${e} * var(--frimousse-category-header-height))`,
      paddingTop: `calc(${t} * var(--frimousse-row-height) + ${a} * var(--frimousse-category-header-height))`,
    },
  };
}
function ss(s, e, t) {
  return {
    "aria-colcount": s,
    "aria-rowcount": e,
    "frimousse-list": "",
    style: { "--frimousse-list-columns": s, ...t },
    role: "grid",
  };
}
function il(s) {
  s.preventDefault();
}
var nl = (0, p.memo)(({ Emoji: s, emoji: e, columnIndex: t, rowIndex: a }) => {
    let r = ae(),
      n = le(r, (d) => Ft(d)?.emoji === e.emoji),
      o = (0, p.useCallback)(() => {
        r.get().onEmojiSelect(e);
      }, [e]),
      l = (0, p.useCallback)(() => {
        r.get().onActiveEmojiChange("pointer", t, a);
      }, [t, a]),
      c = (0, p.useCallback)(() => {
        r.get().onActiveEmojiReset();
      }, []);
    return (0, i.jsx)(s, {
      ...Ha(e, t, n),
      onClick: o,
      onPointerDown: il,
      onPointerEnter: l,
      onPointerLeave: c,
    });
  }),
  ol = (0, p.memo)(({ Row: s, Emoji: e, rowIndex: t }) => {
    let a = le(ae(), (r) => r.data?.rows[t], Ko);
    return a
      ? (0, i.jsx)(s, {
          ...Va(t),
          children: a.emojis.map((r, n) =>
            (0, i.jsx)(
              nl,
              { Emoji: e, columnIndex: n, emoji: r, rowIndex: t },
              r.label,
            ),
          ),
        })
      : null;
  }),
  ll = (0, p.memo)(({ CategoryHeader: s, categoryIndex: e }) => {
    let t = ae(),
      a = le(t, (n) => n.data?.categories[e], Dt),
      r = ve(t, "sticky");
    return a
      ? (0, i.jsx)("div", {
          ...Oa(e, a),
          children: (0, i.jsx)(s, { ...Ba({ label: a.label }, !1, r) }),
        })
      : null;
  }),
  as = (0, p.memo)(({ CategoryHeader: s, Row: e, Emoji: t }) => {
    let a = (0, p.useRef)(null),
      r = ae(),
      n = ve(r, "columns"),
      o = (0, p.useMemo)(() => Array(n).fill({ emoji: "🙂", label: "" }), [n]),
      l = (0, p.useMemo)(() => ({ label: "Category" }), []),
      c = (0, p.useRef)(null),
      d = (0, p.useRef)(null);
    return (
      he(() => {
        let m = a.current?.parentElement?.parentElement;
        if (!m || !c.current || !d.current) return;
        let h = new ResizeObserver((f) => {
          for (let g of f) {
            let v = g.contentRect.height,
              {
                onRowHeightChange: b,
                onCategoryHeaderHeightChange: w,
                rowHeight: y,
                categoryHeaderHeight: z,
              } = r.get();
            (g.target === c.current && y !== v && b(v),
              g.target === d.current && z !== v && w(v));
          }
        });
        (h.observe(m), h.observe(c.current), h.observe(d.current));
        let { onRowHeightChange: x, onCategoryHeaderHeightChange: u } = r.get();
        return (
          x(c.current.clientHeight),
          u(d.current.clientHeight),
          () => {
            h.disconnect();
          }
        );
      }, []),
      (0, i.jsxs)("div", {
        "aria-hidden": !0,
        ref: a,
        style: { height: 0, visibility: "hidden" },
        children: [
          (0, i.jsx)("div", {
            "frimousse-row-sizer": "",
            ref: c,
            children: (0, i.jsx)(e, {
              ...Va(-1, !0),
              children: o.map((m, h) => (0, i.jsx)(t, { ...Ha(m, h, !1) }, h)),
            }),
          }),
          (0, i.jsx)("div", {
            ...Oa(-1),
            children: (0, i.jsx)("div", {
              "frimousse-category-header-sizer": "",
              ref: d,
              children: (0, i.jsx)(s, { ...Ba(l, !0) }),
            }),
          }),
        ],
      })
    );
  });
function cl({ category: s, ...e }) {
  return (0, i.jsx)("div", { ...e, children: s.label });
}
function dl({ emoji: s, ...e }) {
  return (0, i.jsx)("button", { type: "button", ...e, children: s.emoji });
}
function ml({ ...s }) {
  return (0, i.jsx)("div", { ...s });
}
var Wa = (0, p.forwardRef)(({ style: s, components: e, ...t }, a) => {
    let r = ae(),
      n = (0, p.useRef)(null),
      o = (0, p.useCallback)((b) => {
        b && ((n.current = b), r.set({ listRef: n }));
      }, []),
      l = e?.CategoryHeader ?? cl,
      c = e?.Emoji ?? dl,
      d = e?.Row ?? ml,
      m = ve(r, "columns"),
      h = ve(r, "viewportStartRowIndex"),
      x = ve(r, "viewportEndRowIndex"),
      u = le(r, La),
      f = le(r, Uo, Dt),
      g = (0, p.useMemo)(() => f?.filter((b) => b < h).length ?? 0, [f, h]),
      v = f?.length ?? 0;
    return (
      (0, p.useImperativeHandle)(a, () => n.current),
      !u || !f || v === 0
        ? (0, i.jsx)("div", {
            ...ss(m, 0, s),
            ...t,
            children: (0, i.jsx)("div", {
              ...ts(0, 0, 0, 0),
              children: (0, i.jsx)(as, { CategoryHeader: l, Emoji: c, Row: d }),
            }),
          })
        : (0, i.jsx)("div", {
            ...ss(m, u, s),
            ...t,
            ref: o,
            children: (0, i.jsxs)("div", {
              ...ts(u, v, h, g),
              children: [
                (0, i.jsx)(as, { CategoryHeader: l, Emoji: c, Row: d }),
                Array.from({ length: x - h + 1 }, (b, w) => {
                  let y = h + w;
                  return (0, i.jsxs)(
                    p.Fragment,
                    {
                      children: [
                        f.indexOf(y) >= 0 &&
                          (0, i.jsx)("div", {
                            style: {
                              height: "var(--frimousse-category-header-height)",
                            },
                          }),
                        (0, i.jsx)(ol, { Emoji: c, Row: d, rowIndex: y }),
                      ],
                    },
                    y,
                  );
                }),
                Array.from({ length: v }, (b, w) =>
                  (0, i.jsx)(ll, { CategoryHeader: l, categoryIndex: w }, w),
                ),
              ],
            }),
          })
    );
  }),
  Ua = (0, p.forwardRef)(
    (
      { emoji: s, onClick: e, "aria-label": t = "Change skin tone", ...a },
      r,
    ) => {
      let n = le(ae(), Go, Dt),
        [o, l, c] = Aa(s),
        d = (0, p.useMemo)(
          () =>
            Math.max(
              0,
              c.findIndex((g) => g.skinTone === o),
            ),
          [o, c],
        ),
        m = c[d],
        h = c[(d + 1) % c.length].skinTone,
        x = o === "none" ? void 0 : n?.[o],
        u = h === "none" ? void 0 : n?.[h],
        f = (0, p.useCallback)(
          (g) => {
            (e?.(g), g.isDefaultPrevented() || l(h));
          },
          [e, l, h],
        );
      return (0, i.jsx)("button", {
        type: "button",
        ...a,
        "aria-label": t + (u ? ` (${u})` : ""),
        "aria-live": "polite",
        "aria-valuetext": x,
        "frimousse-skin-tone-selector": "",
        onClick: f,
        ref: r,
        children: m.emoji,
      });
    },
  );
function Ga({ children: s, ...e }) {
  return le(ae(), Bo)
    ? (0, i.jsx)("span", { "frimousse-loading": "", ...e, children: s })
    : null;
}
function ul({ children: s }) {
  return s({ search: le(ae(), Vo) });
}
function Ka({ children: s, ...e }) {
  return le(ae(), Oo)
    ? (0, i.jsx)("span", {
        "frimousse-empty": "",
        ...e,
        children: typeof s == "function" ? (0, i.jsx)(ul, { children: s }) : s,
      })
    : null;
}
function Qa({ children: s }) {
  return s({ emoji: Ia() });
}
function Ya({ children: s, emoji: e }) {
  let [t, a, r] = Aa(e);
  return s({ skinTone: t, setSkinTone: a, skinToneVariations: r });
}
qa.displayName = "EmojiPicker.Root";
Fa.displayName = "EmojiPicker.Search";
Da.displayName = "EmojiPicker.Viewport";
Wa.displayName = "EmojiPicker.List";
Ga.displayName = "EmojiPicker.Loading";
Ka.displayName = "EmojiPicker.Empty";
Ua.displayName = "EmojiPicker.SkinToneSelector";
Qa.displayName = "EmojiPicker.ActiveEmoji";
Ya.displayName = "EmojiPicker.SkinTone";
var fl = H(),
  hl = (s) => {
    const e = (0, fl.c)(10),
      { onEmojiSelect: t, className: a } = s;
    let r;
    e[0] !== a
      ? ((r = E(
          "isolate flex h-[350px] w-[320px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950",
          a,
        )),
        (e[0] = a),
        (e[1] = r))
      : (r = e[1]);
    let n;
    e[2] === Symbol.for("react.memo_cache_sentinel")
      ? ((n = (0, i.jsx)(Ce.Search, {
          className:
            "z-10 mx-3 mt-3 appearance-none rounded-lg border-none bg-zinc-100 px-3 py-2 text-sm outline-none placeholder:text-zinc-500 focus:ring-1 focus:ring-violet-500 dark:bg-zinc-900 dark:text-white",
          placeholder: "Search emojis...",
        })),
        (e[2] = n))
      : (n = e[2]);
    let o, l;
    e[3] === Symbol.for("react.memo_cache_sentinel")
      ? ((o = (0, i.jsx)(Ce.Loading, {
          className:
            "absolute inset-0 flex items-center justify-center text-sm text-zinc-400 dark:text-zinc-500",
          children: "Loading…",
        })),
        (l = (0, i.jsx)(Ce.Empty, {
          className:
            "absolute inset-0 flex items-center justify-center text-sm text-zinc-400 dark:text-zinc-500",
          children: "No emoji found.",
        })),
        (e[3] = o),
        (e[4] = l))
      : ((o = e[3]), (l = e[4]));
    let c, d;
    e[5] === Symbol.for("react.memo_cache_sentinel")
      ? ((c = (0, i.jsxs)(Ce.Viewport, {
          className: "relative flex-1 outline-none no-scrollbar",
          children: [
            o,
            l,
            (0, i.jsx)(Ce.List, {
              className: "select-none pb-2",
              components: { CategoryHeader: pl, Row: xl, Emoji: gl },
            }),
          ],
        })),
        (d = (0, i.jsx)(Ce.ActiveEmoji, { children: vl })),
        (e[5] = c),
        (e[6] = d))
      : ((c = e[5]), (d = e[6]));
    let m;
    return (
      e[7] !== t || e[8] !== r
        ? ((m = (0, i.jsxs)(Ce.Root, {
            onEmojiSelect: t,
            className: r,
            children: [n, c, d],
          })),
          (e[7] = t),
          (e[8] = r),
          (e[9] = m))
        : (m = e[9]),
      m
    );
  },
  x0 = hl;
function pl(s) {
  const { category: e, ...t } = s;
  return (0, i.jsx)("div", {
    className:
      "bg-white/80 px-4 pb-1.5 pt-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500 backdrop-blur-sm dark:bg-zinc-950/80 dark:text-zinc-400",
    ...t,
    children: e.label,
  });
}
function xl(s) {
  const { children: e, ...t } = s;
  return (0, i.jsx)("div", {
    className: "scroll-my-1 px-2",
    ...t,
    children: e,
  });
}
function gl(s) {
  const { emoji: e, ...t } = s;
  return (0, i.jsx)("button", {
    className:
      "flex aspect-square size-9 items-center justify-center rounded-lg text-xl transition-colors hover:bg-zinc-100 data-[active]:bg-violet-500/10 data-[active]:text-violet-500 dark:hover:bg-zinc-900 dark:data-[active]:bg-violet-500/20",
    ...t,
    children: e.emoji,
  });
}
function vl(s) {
  const { emoji: e } = s;
  return (0, i.jsx)("div", {
    className:
      "flex items-center gap-3 border-t border-zinc-100 p-3 dark:border-zinc-800",
    children: e
      ? (0, i.jsxs)(i.Fragment, {
          children: [
            (0, i.jsx)("span", { className: "text-2xl", children: e.emoji }),
            (0, i.jsx)("span", {
              className:
                "truncate text-xs font-bold text-zinc-600 dark:text-zinc-400",
              children: e.label.replace(/:/g, "").replace(/_/g, " "),
            }),
          ],
        })
      : (0, i.jsx)("span", {
          className: "text-xs font-medium text-zinc-400",
          children: "Select an emoji...",
        }),
  });
}
var bl = H(),
  wl = (s) => {
    const e = (0, bl.c)(33),
      {
        src: t,
        isOpen: a,
        onClose: r,
        onCropComplete: n,
        aspect: o,
        circular: l,
      } = s,
      [c, d] = (0, p.useState)(),
      [m, h] = (0, p.useState)(null),
      x = (0, p.useRef)(null);
    let u;
    e[0] !== o
      ? ((u = (R) => {
          const { width: M, height: P } = R.currentTarget;
          d(
            o
              ? pr(br({ unit: "%", width: 100 }, o, M, P), M, P)
              : { unit: "%", width: 100, height: 100, x: 0, y: 0 },
          );
        }),
        (e[0] = o),
        (e[1] = u))
      : (u = e[1]);
    const f = u;
    let g;
    e[2] !== m || e[3] !== r || e[4] !== n
      ? ((g = async () => {
          if (m && x.current)
            try {
              (n(await Ti(x.current, m)), r());
            } catch (R) {
              console.error("Error cropping image:", R);
            }
        }),
        (e[2] = m),
        (e[3] = r),
        (e[4] = n),
        (e[5] = g))
      : (g = e[5]);
    const v = g;
    let b;
    e[6] !== r ? ((b = (R) => !R && r()), (e[6] = r), (e[7] = b)) : (b = e[7]);
    let w;
    e[8] === Symbol.for("react.memo_cache_sentinel")
      ? ((w = (0, i.jsx)(Tt, {
          className: "shrink-0 p-4",
          children: (0, i.jsx)(At, { children: "Crop Image" }),
        })),
        (e[8] = w))
      : (w = e[8]);
    let y, z;
    e[9] === Symbol.for("react.memo_cache_sentinel")
      ? ((y = (R) => d(R)), (z = (R) => h(R)), (e[9] = y), (e[10] = z))
      : ((y = e[9]), (z = e[10]));
    let j;
    e[11] !== f || e[12] !== t
      ? ((j = (0, i.jsx)("img", {
          ref: x,
          src: t,
          alt: "Crop preview",
          onLoad: f,
          className: "block max-h-[60vh] w-auto",
        })),
        (e[11] = f),
        (e[12] = t),
        (e[13] = j))
      : (j = e[13]);
    let k;
    e[14] !== o || e[15] !== l || e[16] !== c || e[17] !== j
      ? ((k = (0, i.jsx)("div", {
          className:
            "flex max-h-[65vh] min-h-[300px] items-center justify-center overflow-auto bg-zinc-100/50 p-6 dark:bg-zinc-950/50",
          children: (0, i.jsx)(wr, {
            crop: c,
            onChange: y,
            onComplete: z,
            aspect: o,
            circularCrop: l,
            className: "max-w-full shadow-2xl",
            children: j,
          }),
        })),
        (e[14] = o),
        (e[15] = l),
        (e[16] = c),
        (e[17] = j),
        (e[18] = k))
      : (k = e[18]);
    let S;
    e[19] !== r
      ? ((S = (0, i.jsx)(J, {
          variant: "outline",
          onClick: r,
          className: "!w-auto px-6",
          children: "Cancel",
        })),
        (e[19] = r),
        (e[20] = S))
      : (S = e[20]);
    let _;
    e[21] !== v
      ? ((_ = (0, i.jsx)(J, {
          onClick: v,
          className: "!w-auto px-6",
          children: "Apply Crop",
        })),
        (e[21] = v),
        (e[22] = _))
      : (_ = e[22]);
    let $;
    e[23] !== _ || e[24] !== S
      ? (($ = (0, i.jsxs)(It, {
          className:
            "flex shrink-0 flex-row justify-end gap-2 bg-white p-4 dark:bg-zinc-900",
          children: [S, _],
        })),
        (e[23] = _),
        (e[24] = S),
        (e[25] = $))
      : ($ = e[25]);
    let I;
    e[26] !== $ || e[27] !== k
      ? ((I = (0, i.jsxs)(Lt, {
          className:
            "overflow-hidden bg-white p-0 sm:max-w-2xl dark:bg-zinc-900",
          children: [w, k, $],
        })),
        (e[26] = $),
        (e[27] = k),
        (e[28] = I))
      : (I = e[28]);
    let A;
    return (
      e[29] !== a || e[30] !== I || e[31] !== b
        ? ((A = (0, i.jsx)(Na, { open: a, onOpenChange: b, children: I })),
          (e[29] = a),
          (e[30] = I),
          (e[31] = b),
          (e[32] = A))
        : (A = e[32]),
      A
    );
  },
  g0 = wl,
  yl = H(),
  jl = (s) => {
    const e = (0, yl.c)(113),
      { media: t, currentIndex: a, onClose: r, onNavigate: n } = s,
      o = a === void 0 ? 0 : a,
      [l, c] = (0, p.useState)(1);
    let d;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((d = { x: 0, y: 0 }), (e[0] = d))
      : (d = e[0]);
    const [m, h] = (0, p.useState)(d),
      [x, u] = (0, p.useState)(!1);
    let f;
    e[1] === Symbol.for("react.memo_cache_sentinel")
      ? ((f = { x: 0, y: 0 }), (e[1] = f))
      : (f = e[1]);
    const [g, v] = (0, p.useState)(f),
      [b, w] = (0, p.useState)(null),
      [y, z] = (0, p.useState)(null),
      j = (0, p.useRef)(null),
      k = (0, p.useRef)(null);
    let S;
    e[2] === Symbol.for("react.memo_cache_sentinel")
      ? ((S = () => c(Nl)), (e[2] = S))
      : (S = e[2]);
    const _ = S;
    let $;
    e[3] === Symbol.for("react.memo_cache_sentinel")
      ? (($ = () => {
          c((D) => {
            const K = Math.max(D - 0.5, 1);
            return (K === 1 && h({ x: 0, y: 0 }), K);
          });
        }),
        (e[3] = $))
      : ($ = e[3]);
    const I = $;
    let A;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((A = () => {
          (c(1), h({ x: 0, y: 0 }));
        }),
        (e[4] = A))
      : (A = e[4]);
    const R = A;
    let M;
    e[5] !== o || e[6] !== n
      ? ((M = () => {
          o > 0 && (R(), n(o - 1));
        }),
        (e[5] = o),
        (e[6] = n),
        (e[7] = M))
      : (M = e[7]);
    const P = M;
    let C;
    (e[8] !== o || e[9] !== t?.length || e[10] !== n
      ? ((C = () => {
          o < (t?.length || 0) - 1 && (R(), n(o + 1));
        }),
        (e[8] = o),
        (e[9] = t?.length),
        (e[10] = n),
        (e[11] = C))
      : (C = e[11]),
      t?.length);
    const T = C;
    let V;
    e[12] !== T || e[13] !== P || e[14] !== r
      ? ((V = () => {
          const D = (K) => {
            (K.key === "Escape" && r(),
              K.key === "ArrowLeft" && P(),
              K.key === "ArrowRight" && T());
          };
          return (
            window.addEventListener("keydown", D),
            () => window.removeEventListener("keydown", D)
          );
        }),
        (e[12] = T),
        (e[13] = P),
        (e[14] = r),
        (e[15] = V))
      : (V = e[15]);
    let W;
    if (
      (e[16] !== o || e[17] !== T || e[18] !== P || e[19] !== r
        ? ((W = [o, r, P, T]),
          (e[16] = o),
          (e[17] = T),
          (e[18] = P),
          (e[19] = r),
          (e[20] = W))
        : (W = e[20]),
      (0, p.useEffect)(V, W),
      !t || t.length === 0)
    )
      return null;
    const B = t[o],
      L = typeof B != "string" && B.type === "video",
      q = typeof B == "string" ? B : B.url,
      F = t.length > 1;
    let U;
    e[21] !== L || e[22] !== m.x || e[23] !== m.y || e[24] !== l
      ? ((U = (D) => {
          l > 1 && !L && (u(!0), v({ x: D.clientX - m.x, y: D.clientY - m.y }));
        }),
        (e[21] = L),
        (e[22] = m.x),
        (e[23] = m.y),
        (e[24] = l),
        (e[25] = U))
      : (U = e[25]);
    const O = U;
    let G;
    e[26] !== g || e[27] !== x || e[28] !== L || e[29] !== l
      ? ((G = (D) => {
          x && l > 1 && !L && h({ x: D.clientX - g.x, y: D.clientY - g.y });
        }),
        (e[26] = g),
        (e[27] = x),
        (e[28] = L),
        (e[29] = l),
        (e[30] = G))
      : (G = e[30]);
    const se = G;
    let X;
    e[31] === Symbol.for("react.memo_cache_sentinel")
      ? ((X = () => u(!1)), (e[31] = X))
      : (X = e[31]);
    const Y = X;
    let de;
    e[32] !== L || e[33] !== m.x || e[34] !== m.y || e[35] !== l
      ? ((de = (D) => {
          D.touches.length === 1
            ? (w({
                x: D.touches[0].clientX,
                y: D.touches[0].clientY,
                time: Date.now(),
              }),
              l > 1 &&
                !L &&
                (u(!0),
                v({
                  x: D.touches[0].clientX - m.x,
                  y: D.touches[0].clientY - m.y,
                })))
            : D.touches.length === 2 &&
              !L &&
              z(
                Math.hypot(
                  D.touches[0].clientX - D.touches[1].clientX,
                  D.touches[0].clientY - D.touches[1].clientY,
                ),
              );
        }),
        (e[32] = L),
        (e[33] = m.x),
        (e[34] = m.y),
        (e[35] = l),
        (e[36] = de))
      : (de = e[36]);
    const xe = de;
    let ue;
    e[37] !== g || e[38] !== y || e[39] !== x || e[40] !== L || e[41] !== l
      ? ((ue = (D) => {
          if (D.touches.length === 1)
            x &&
              l > 1 &&
              !L &&
              h({
                x: D.touches[0].clientX - g.x,
                y: D.touches[0].clientY - g.y,
              });
          else if (D.touches.length === 2 && y && !L) {
            const K = Math.hypot(
              D.touches[0].clientX - D.touches[1].clientX,
              D.touches[0].clientY - D.touches[1].clientY,
            );
            (c(Math.min(Math.max(l * (K / y), 1), 4)), z(K));
          }
        }),
        (e[37] = g),
        (e[38] = y),
        (e[39] = x),
        (e[40] = L),
        (e[41] = l),
        (e[42] = ue))
      : (ue = e[42]);
    const ge = ue;
    let be;
    e[43] !== T || e[44] !== P || e[45] !== l || e[46] !== b
      ? ((be = (D) => {
          if ((D.touches.length < 2 && z(null), u(!1), b && l === 1)) {
            const K = {
                x: D.changedTouches[0].clientX,
                y: D.changedTouches[0].clientY,
              },
              dt = K.x - b.x,
              jt = K.y - b.y,
              fr = Date.now() - b.time;
            Math.abs(dt) > 50 &&
              Math.abs(jt) < 50 &&
              fr < 300 &&
              (dt > 0 ? P() : T());
          }
          w(null);
        }),
        (e[43] = T),
        (e[44] = P),
        (e[45] = l),
        (e[46] = b),
        (e[47] = be))
      : (be = e[47]);
    const ee = be;
    let ze;
    e[48] !== q || e[49] !== L
      ? ((ze = (D) => {
          D.stopPropagation();
          const K = document.createElement("a");
          ((K.href = q),
            (K.download = `sysm-${Date.now()}${L ? ".mp4" : ".jpg"}`),
            document.body.appendChild(K),
            K.click(),
            document.body.removeChild(K));
        }),
        (e[48] = q),
        (e[49] = L),
        (e[50] = ze))
      : (ze = e[50]);
    const Me = ze,
      bt = F ? `${o + 1} / ${t.length}` : L ? "Video View" : "Image View";
    let Fe;
    e[51] !== bt
      ? ((Fe = (0, i.jsx)("div", {
          className: "flex flex-col",
          children: (0, i.jsx)("span", {
            className: "text-lg font-bold text-white drop-shadow-md",
            children: bt,
          }),
        })),
        (e[51] = bt),
        (e[52] = Fe))
      : (Fe = e[52]);
    let De;
    e[53] !== L
      ? ((De =
          !L &&
          (0, i.jsxs)(i.Fragment, {
            children: [
              (0, i.jsx)("button", {
                onClick: I,
                className:
                  "hidden rounded-full p-2 text-white transition-colors hover:bg-white/10 sm:block",
                children: (0, i.jsx)(Lr, { size: 20 }),
              }),
              (0, i.jsx)("button", {
                onClick: _,
                className:
                  "hidden rounded-full p-2 text-white transition-colors hover:bg-white/10 sm:block",
                children: (0, i.jsx)(Rr, { size: 20 }),
              }),
              (0, i.jsx)("button", {
                onClick: R,
                className:
                  "rounded-full p-2 text-white transition-colors hover:bg-white/10",
                children: (0, i.jsx)(Yr, { size: 20 }),
              }),
            ],
          })),
        (e[53] = L),
        (e[54] = De))
      : (De = e[54]);
    let nt;
    e[55] === Symbol.for("react.memo_cache_sentinel")
      ? ((nt = (0, i.jsx)(Tr, { size: 20 })), (e[55] = nt))
      : (nt = e[55]);
    let He;
    e[56] !== Me
      ? ((He = (0, i.jsx)("button", {
          onClick: Me,
          className:
            "rounded-full p-2 text-white transition-colors hover:bg-white/10",
          children: nt,
        })),
        (e[56] = Me),
        (e[57] = He))
      : (He = e[57]);
    let ot;
    e[58] === Symbol.for("react.memo_cache_sentinel")
      ? ((ot = (0, i.jsx)("div", {
          className: "mx-1 hidden h-6 w-px bg-white/20 sm:block",
        })),
        (e[58] = ot))
      : (ot = e[58]);
    let lt;
    e[59] === Symbol.for("react.memo_cache_sentinel")
      ? ((lt = (0, i.jsx)(et, { size: 24 })), (e[59] = lt))
      : (lt = e[59]);
    let Ve;
    e[60] !== r
      ? ((Ve = (0, i.jsx)("button", {
          onClick: r,
          className:
            "rounded-full bg-white/10 p-2 text-white transition-all hover:bg-white/20",
          children: lt,
        })),
        (e[60] = r),
        (e[61] = Ve))
      : (Ve = e[61]);
    let Oe;
    e[62] !== De || e[63] !== He || e[64] !== Ve
      ? ((Oe = (0, i.jsxs)("div", {
          className: "flex items-center gap-1 sm:gap-3",
          onClick: kl,
          children: [De, He, ot, Ve],
        })),
        (e[62] = De),
        (e[63] = He),
        (e[64] = Ve),
        (e[65] = Oe))
      : (Oe = e[65]);
    let Be;
    e[66] !== Fe || e[67] !== Oe
      ? ((Be = (0, i.jsxs)("div", {
          className:
            "absolute left-0 right-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4",
          children: [Fe, Oe],
        })),
        (e[66] = Fe),
        (e[67] = Oe),
        (e[68] = Be))
      : (Be = e[68]);
    let We;
    e[69] !== o || e[70] !== P || e[71] !== F || e[72] !== l
      ? ((We =
          F &&
          o > 0 &&
          l === 1 &&
          (0, i.jsx)("button", {
            onClick: (D) => {
              (D.stopPropagation(), P());
            },
            className:
              "absolute left-6 z-10 hidden rounded-full bg-white/5 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-90 md:flex",
            children: (0, i.jsx)(Ps, { size: 32 }),
          })),
        (e[69] = o),
        (e[70] = P),
        (e[71] = F),
        (e[72] = l),
        (e[73] = We))
      : (We = e[73]);
    const wt = `relative ${L ? "" : "cursor-grab active:cursor-grabbing"} transition-transform duration-200 ease-out`,
      yt = `translate(${m.x}px, ${m.y}px) scale(${l})`;
    let Ue;
    e[74] !== yt
      ? ((Ue = { transform: yt }), (e[74] = yt), (e[75] = Ue))
      : (Ue = e[75]);
    let Ge;
    e[76] !== B || e[77] !== q || e[78] !== L
      ? ((Ge = L
          ? (0, i.jsx)("video", {
              src: q,
              controls: !0,
              autoPlay: !0,
              className: "max-h-[85vh] max-w-[95vw] rounded-sm shadow-2xl",
              poster: (typeof B != "string" && B.poster) || void 0,
            })
          : (0, i.jsx)("img", {
              ref: k,
              src: q,
              className:
                "max-h-[85vh] max-w-[95vw] select-none rounded-sm object-contain shadow-2xl",
              alt: "",
              draggable: !1,
            })),
        (e[76] = B),
        (e[77] = q),
        (e[78] = L),
        (e[79] = Ge))
      : (Ge = e[79]);
    let Ke;
    e[80] !== O || e[81] !== wt || e[82] !== Ue || e[83] !== Ge
      ? ((Ke = (0, i.jsx)("div", {
          className: wt,
          style: Ue,
          onMouseDown: O,
          onClick: zl,
          children: Ge,
        })),
        (e[80] = O),
        (e[81] = wt),
        (e[82] = Ue),
        (e[83] = Ge),
        (e[84] = Ke))
      : (Ke = e[84]);
    let Qe;
    e[85] !== o ||
    e[86] !== T ||
    e[87] !== F ||
    e[88] !== t.length ||
    e[89] !== l
      ? ((Qe =
          F &&
          o < t.length - 1 &&
          l === 1 &&
          (0, i.jsx)("button", {
            onClick: (D) => {
              (D.stopPropagation(), T());
            },
            className:
              "absolute right-6 z-10 hidden rounded-full bg-white/5 p-4 text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-90 md:flex",
            children: (0, i.jsx)(gt, { size: 32 }),
          })),
        (e[85] = o),
        (e[86] = T),
        (e[87] = F),
        (e[88] = t.length),
        (e[89] = l),
        (e[90] = Qe))
      : (Qe = e[90]);
    let Ye;
    e[91] !== We || e[92] !== Ke || e[93] !== Qe
      ? ((Ye = (0, i.jsxs)("div", {
          className: "relative flex h-full w-full items-center justify-center",
          children: [We, Ke, Qe],
        })),
        (e[91] = We),
        (e[92] = Ke),
        (e[93] = Qe),
        (e[94] = Ye))
      : (Ye = e[94]);
    let Ze;
    e[95] !== o || e[96] !== F || e[97] !== t || e[98] !== n
      ? ((Ze =
          F &&
          (0, i.jsx)("div", {
            className:
              "hide-scrollbar absolute bottom-8 flex max-w-[90%] gap-3 overflow-x-auto rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-xl",
            onClick: Cl,
            children: t.map((D, K) => {
              const dt = typeof D == "string" ? D : D.url,
                jt = typeof D != "string" && D.poster ? D.poster : dt;
              return (0, i.jsx)(
                "button",
                {
                  onClick: () => {
                    (R(), n(K));
                  },
                  className: `size-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${K === o ? "scale-110 border-violet-500 shadow-lg shadow-violet-500/20" : "border-transparent opacity-40 hover:opacity-100"}`,
                  children: (0, i.jsx)("img", {
                    src: jt,
                    className: "size-full object-cover",
                    alt: "",
                  }),
                },
                K,
              );
            }),
          })),
        (e[95] = o),
        (e[96] = F),
        (e[97] = t),
        (e[98] = n),
        (e[99] = Ze))
      : (Ze = e[99]);
    let Je;
    e[100] !== F || e[101] !== l
      ? ((Je =
          l === 1 &&
          F &&
          (0, i.jsx)("div", {
            className:
              "absolute bottom-4 text-[10px] font-bold uppercase tracking-widest text-white/30 md:hidden",
            children: "Swipe to navigate",
          })),
        (e[100] = F),
        (e[101] = l),
        (e[102] = Je))
      : (Je = e[102]);
    let ct;
    return (
      e[103] !== se ||
      e[104] !== ee ||
      e[105] !== ge ||
      e[106] !== xe ||
      e[107] !== r ||
      e[108] !== Be ||
      e[109] !== Ye ||
      e[110] !== Ze ||
      e[111] !== Je
        ? ((ct = (0, i.jsxs)("div", {
            ref: j,
            className:
              "fixed inset-0 z-[100] flex touch-none flex-col items-center justify-center overflow-hidden bg-black/95 backdrop-blur-md",
            onMouseMove: se,
            onMouseUp: Y,
            onMouseLeave: Y,
            onTouchStart: xe,
            onTouchMove: ge,
            onTouchEnd: ee,
            onClick: r,
            children: [Be, Ye, Ze, Je],
          })),
          (e[103] = se),
          (e[104] = ee),
          (e[105] = ge),
          (e[106] = xe),
          (e[107] = r),
          (e[108] = Be),
          (e[109] = Ye),
          (e[110] = Ze),
          (e[111] = Je),
          (e[112] = ct))
        : (ct = e[112]),
      ct
    );
  },
  _l = jl;
function Nl(s) {
  return Math.min(s + 0.5, 4);
}
function kl(s) {
  return s.stopPropagation();
}
function zl(s) {
  return s.stopPropagation();
}
function Cl(s) {
  return s.stopPropagation();
}
var Sl = H(),
  Za = p.forwardRef((s, e) => {
    const t = (0, Sl.c)(20);
    let a, r, n, o, l;
    t[0] !== s
      ? (({ className: a, label: r, type: l, textarea: o, ...n } = s),
        (t[0] = s),
        (t[1] = a),
        (t[2] = r),
        (t[3] = n),
        (t[4] = o),
        (t[5] = l))
      : ((a = t[1]), (r = t[2]), (n = t[3]), (o = t[4]), (l = t[5]));
    const c = o ? "textarea" : "input";
    let d;
    t[6] !== r
      ? ((d =
          r &&
          (0, i.jsx)("label", {
            className:
              "text-sm font-bold text-zinc-500 dark:text-zinc-400 ml-1",
            children: r,
          })),
        (t[6] = r),
        (t[7] = d))
      : (d = t[7]);
    const m = o && "min-h-[120px] resize-none";
    let h;
    t[8] !== a || t[9] !== m
      ? ((h = E(
          "flex w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-3 text-[15px] ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/20 focus-visible:border-violet-500 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-zinc-950 dark:text-white transition-all shadow-sm",
          m,
          a,
        )),
        (t[8] = a),
        (t[9] = m),
        (t[10] = h))
      : (h = t[10]);
    const x = e;
    let u;
    t[11] !== c || t[12] !== n || t[13] !== h || t[14] !== x || t[15] !== l
      ? ((u = (0, i.jsx)(c, { type: l, className: h, ref: x, ...n })),
        (t[11] = c),
        (t[12] = n),
        (t[13] = h),
        (t[14] = x),
        (t[15] = l),
        (t[16] = u))
      : (u = t[16]);
    let f;
    return (
      t[17] !== d || t[18] !== u
        ? ((f = (0, i.jsxs)("div", {
            className: "w-full space-y-1.5",
            children: [d, u],
          })),
          (t[17] = d),
          (t[18] = u),
          (t[19] = f))
        : (f = t[19]),
      f
    );
  });
Za.displayName = "Input";
var Xe = Za,
  $l = H(),
  Pl = (s) => {
    const e = (0, $l.c)(28),
      {
        isOpen: t,
        onClose: a,
        title: r,
        children: n,
        footer: o,
        description: l,
        className: c,
      } = s;
    let d;
    e[0] !== a
      ? ((d = (j) => {
          j || a();
        }),
        (e[0] = a),
        (e[1] = d))
      : (d = e[1]);
    const m = d;
    let h;
    e[2] !== c
      ? ((h = E(
          "flex max-h-[calc(100dvh-1rem)] flex-col gap-0 overflow-hidden bg-white p-0 sm:max-w-md dark:bg-zinc-900",
          c,
        )),
        (e[2] = c),
        (e[3] = h))
      : (h = e[3]);
    const x = !r && "sr-only";
    let u;
    e[4] !== x
      ? ((u = E(
          "shrink-0 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800",
          x,
        )),
        (e[4] = x),
        (e[5] = u))
      : (u = e[5]);
    let f;
    e[6] !== r
      ? ((f = (0, i.jsx)(At, {
          className: "text-center text-lg font-bold",
          children: r,
        })),
        (e[6] = r),
        (e[7] = f))
      : (f = e[7]);
    let g;
    e[8] !== l
      ? ((g = l && (0, i.jsx)(za, { className: "text-center", children: l })),
        (e[8] = l),
        (e[9] = g))
      : (g = e[9]);
    let v;
    e[10] !== u || e[11] !== f || e[12] !== g
      ? ((v = (0, i.jsxs)(Tt, { className: u, children: [f, g] })),
        (e[10] = u),
        (e[11] = f),
        (e[12] = g),
        (e[13] = v))
      : (v = e[13]);
    let b;
    e[14] !== n
      ? ((b = (0, i.jsx)("div", {
          className: "flex min-h-0 flex-1 flex-col overflow-hidden",
          children: n,
        })),
        (e[14] = n),
        (e[15] = b))
      : (b = e[15]);
    let w;
    e[16] !== o
      ? ((w =
          o &&
          (0, i.jsx)(It, {
            className:
              "shrink-0 border-t border-zinc-100 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900",
            children: o,
          })),
        (e[16] = o),
        (e[17] = w))
      : (w = e[17]);
    let y;
    e[18] !== a || e[19] !== h || e[20] !== v || e[21] !== b || e[22] !== w
      ? ((y = (0, i.jsxs)(Lt, {
          onDragClose: a,
          "aria-describedby": void 0,
          className: h,
          children: [v, b, w],
        })),
        (e[18] = a),
        (e[19] = h),
        (e[20] = v),
        (e[21] = b),
        (e[22] = w),
        (e[23] = y))
      : (y = e[23]);
    let z;
    return (
      e[24] !== m || e[25] !== t || e[26] !== y
        ? ((z = (0, i.jsx)(Na, { open: t, onOpenChange: m, children: y })),
          (e[24] = m),
          (e[25] = t),
          (e[26] = y),
          (e[27] = z))
        : (z = e[27]),
      z
    );
  },
  Ae = Pl,
  El = H(),
  Ml = (s) => {
    const e = (0, El.c)(20),
      { title: t, message: a, icon: r, showHome: n, showBack: o } = s,
      l = t === void 0 ? "Not Found" : t,
      c =
        a === void 0
          ? "The content you are looking for doesn't exist or has been removed."
          : a,
      d = r === void 0 ? Sr : r,
      m = n === void 0 ? !0 : n,
      h = o === void 0 ? !0 : o,
      x = ye();
    let u;
    e[0] !== d
      ? ((u = (0, i.jsx)("div", {
          className: "mb-6 rounded-full bg-zinc-100 p-6 dark:bg-zinc-900",
          children: (0, i.jsx)(d, {
            size: 48,
            className: "text-zinc-400 dark:text-zinc-600",
          }),
        })),
        (e[0] = d),
        (e[1] = u))
      : (u = e[1]);
    let f;
    e[2] !== l
      ? ((f = (0, i.jsx)("h2", {
          className: "mb-2 text-2xl font-black dark:text-white",
          children: l,
        })),
        (e[2] = l),
        (e[3] = f))
      : (f = e[3]);
    let g;
    e[4] !== c
      ? ((g = (0, i.jsx)("p", {
          className:
            "mb-8 max-w-xs leading-relaxed text-zinc-500 dark:text-zinc-400",
          children: c,
        })),
        (e[4] = c),
        (e[5] = g))
      : (g = e[5]);
    let v;
    e[6] !== x || e[7] !== h
      ? ((v =
          h &&
          (0, i.jsxs)(J, {
            variant: "secondary",
            onClick: () => x(-1),
            className: "rounded-full px-6",
            children: [
              (0, i.jsx)(Qr, { size: 18, className: "mr-2" }),
              "Go Back",
            ],
          })),
        (e[6] = x),
        (e[7] = h),
        (e[8] = v))
      : (v = e[8]);
    let b;
    e[9] !== x || e[10] !== m
      ? ((b =
          m &&
          (0, i.jsxs)(J, {
            onClick: () => x("/"),
            className:
              "rounded-full bg-zinc-900 px-6 text-white dark:bg-white dark:text-zinc-900",
            children: [(0, i.jsx)(ji, { size: 18, className: "mr-2" }), "Home"],
          })),
        (e[9] = x),
        (e[10] = m),
        (e[11] = b))
      : (b = e[11]);
    let w;
    e[12] !== b || e[13] !== v
      ? ((w = (0, i.jsxs)("div", {
          className: "flex flex-wrap items-center justify-center gap-3",
          children: [v, b],
        })),
        (e[12] = b),
        (e[13] = v),
        (e[14] = w))
      : (w = e[14]);
    let y;
    return (
      e[15] !== w || e[16] !== u || e[17] !== f || e[18] !== g
        ? ((y = (0, i.jsxs)("div", {
            className:
              "animate-in fade-in zoom-in-95 flex min-h-[400px] flex-col items-center justify-center p-8 text-center duration-300",
            children: [u, f, g, w],
          })),
          (e[15] = w),
          (e[16] = u),
          (e[17] = f),
          (e[18] = g),
          (e[19] = y))
        : (y = e[19]),
      y
    );
  },
  v0 = Ml,
  Rl = H(),
  b0 = Fr,
  w0 = ii;
var Ll = p.forwardRef((s, e) => {
  const t = (0, Rl.c)(13);
  let a, r, n, o;
  t[0] !== s
    ? (({ className: a, align: n, sideOffset: o, ...r } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n),
      (t[4] = o))
    : ((a = t[1]), (r = t[2]), (n = t[3]), (o = t[4]));
  const l = n === void 0 ? "center" : n,
    c = o === void 0 ? 4 : o;
  let d;
  t[5] !== a
    ? ((d = E(
        "z-50 w-72 rounded-md border border-zinc-200 bg-white p-4 text-zinc-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
        a,
      )),
      (t[5] = a),
      (t[6] = d))
    : (d = t[6]);
  let m;
  return (
    t[7] !== l || t[8] !== r || t[9] !== e || t[10] !== c || t[11] !== d
      ? ((m = (0, i.jsx)(Mr, {
          children: (0, i.jsx)(gs, {
            ref: e,
            align: l,
            sideOffset: c,
            className: d,
            ...r,
          }),
        })),
        (t[7] = l),
        (t[8] = r),
        (t[9] = e),
        (t[10] = c),
        (t[11] = d),
        (t[12] = m))
      : (m = t[12]),
    m
  );
});
Ll.displayName = gs.displayName;
var Tl = H();
const Il = (s, e) => {
  const t = (0, Tl.c)(64),
    a = s?.id,
    r = Ie(),
    { addToast: n } = _e(),
    o = s?.follower_count || 0,
    l = s?.following_count || 0;
  let c;
  t[0] !== o || t[1] !== l
    ? ((c = { followers: o, following: l }), (t[0] = o), (t[1] = l), (t[2] = c))
    : (c = t[2]);
  const [d, m] = (0, p.useState)(c);
  let h;
  t[3] !== s
    ? ((h = () => {
        s &&
          m({
            followers: s.follower_count || 0,
            following: s.following_count || 0,
          });
      }),
      (t[3] = s),
      (t[4] = h))
    : (h = t[4]);
  const x = s?.id,
    u = s?.follower_count,
    f = s?.following_count;
  let g;
  (t[5] !== x || t[6] !== u || t[7] !== f
    ? ((g = [x, u, f]), (t[5] = x), (t[6] = u), (t[7] = f), (t[8] = g))
    : (g = t[8]),
    (0, p.useEffect)(h, g));
  let v;
  t[9] !== e || t[10] !== a
    ? ((v = a && kt(a) && e && kt(e)), (t[9] = e), (t[10] = a), (t[11] = v))
    : (v = t[11]);
  const b = v;
  let w, y;
  t[12] !== e || t[13] !== a
    ? ((y = ["isFollowing", e, a]),
      (w = () => Oi(e, a)),
      (t[12] = e),
      (t[13] = a),
      (t[14] = w),
      (t[15] = y))
    : ((w = t[14]), (y = t[15]));
  const z = !!b;
  let j;
  t[16] !== w || t[17] !== z || t[18] !== y
    ? ((j = { queryKey: y, queryFn: w, enabled: z, staleTime: 1 / 0 }),
      (t[16] = w),
      (t[17] = z),
      (t[18] = y),
      (t[19] = j))
    : (j = t[19]);
  const { data: k } = Le(j),
    S = k === void 0 ? !1 : k;
  let _, $, I;
  t[20] !== a
    ? ((_ = ["followStats", a]),
      ($ = async () => {
        const F = await Bi(a);
        return (m(F), F);
      }),
      (I = !!a && kt(a)),
      (t[20] = a),
      (t[21] = _),
      (t[22] = $),
      (t[23] = I))
    : ((_ = t[21]), ($ = t[22]), (I = t[23]));
  let A;
  (t[24] !== _ || t[25] !== $ || t[26] !== I
    ? ((A = { queryKey: _, queryFn: $, enabled: I, staleTime: 6e4 }),
      (t[24] = _),
      (t[25] = $),
      (t[26] = I),
      (t[27] = A))
    : (A = t[27]),
    Le(A));
  let R;
  t[28] !== e || t[29] !== a
    ? ((R = () => Vi(e, a)), (t[28] = e), (t[29] = a), (t[30] = R))
    : (R = t[30]);
  let M;
  t[31] !== e || t[32] !== S || t[33] !== r || t[34] !== a
    ? ((M = async () => {
        await r.cancelQueries({ queryKey: ["isFollowing", e, a] });
        const F = r.getQueryData(["isFollowing", e, a]);
        return (
          r.setQueryData(["isFollowing", e, a], !S),
          m((U) => ({
            ...U,
            followers: S ? Math.max(0, U.followers - 1) : U.followers + 1,
          })),
          { previousFollowing: F }
        );
      }),
      (t[31] = e),
      (t[32] = S),
      (t[33] = r),
      (t[34] = a),
      (t[35] = M))
    : (M = t[35]);
  let P;
  t[36] !== n || t[37] !== e || t[38] !== r || t[39] !== a
    ? ((P = (F, U, O) => {
        (O?.previousFollowing !== void 0 &&
          (r.setQueryData(["isFollowing", e, a], O.previousFollowing),
          m((G) => ({
            ...G,
            followers: O.previousFollowing
              ? G.followers + 1
              : Math.max(0, G.followers - 1),
          }))),
          n("Failed to update follow status", "error"));
      }),
      (t[36] = n),
      (t[37] = e),
      (t[38] = r),
      (t[39] = a),
      (t[40] = P))
    : (P = t[40]);
  let C;
  t[41] !== e || t[42] !== r || t[43] !== a
    ? ((C = () => {
        (r.invalidateQueries({ queryKey: ["isFollowing", e, a] }),
          r.invalidateQueries({ queryKey: ["followStats", a] }));
      }),
      (t[41] = e),
      (t[42] = r),
      (t[43] = a),
      (t[44] = C))
    : (C = t[44]);
  let T;
  t[45] !== n
    ? ((T = (F) => {
        n(F ? "Followed" : "Unfollowed");
      }),
      (t[45] = n),
      (t[46] = T))
    : (T = t[46]);
  let V;
  t[47] !== R || t[48] !== M || t[49] !== P || t[50] !== C || t[51] !== T
    ? ((V = {
        mutationFn: R,
        onMutate: M,
        onError: P,
        onSettled: C,
        onSuccess: T,
      }),
      (t[47] = R),
      (t[48] = M),
      (t[49] = P),
      (t[50] = C),
      (t[51] = T),
      (t[52] = V))
    : (V = t[52]);
  const W = we(V);
  let B;
  t[53] !== n || t[54] !== e || t[55] !== W || t[56] !== b || t[57] !== a
    ? ((B = async () => {
        if (!e) return n("Please login to follow!", "error");
        if (e === a) return n("You cannot follow yourself!", "error");
        b && W.mutate();
      }),
      (t[53] = n),
      (t[54] = e),
      (t[55] = W),
      (t[56] = b),
      (t[57] = a),
      (t[58] = B))
    : (B = t[58]);
  const L = B;
  let q;
  return (
    t[59] !== W.isPending || t[60] !== L || t[61] !== S || t[62] !== d
      ? ((q = {
          isFollowing: S,
          stats: d,
          loading: W.isPending,
          handleFollow: L,
          setStats: m,
        }),
        (t[59] = W.isPending),
        (t[60] = L),
        (t[61] = S),
        (t[62] = d),
        (t[63] = q))
      : (q = t[63]),
    q
  );
};
var Al = ({ profile: s, onUserClick: e, isCommunity: t = !1 }) => {
    const { onlineUsers: a } = pn(),
      { currentUser: r } = pe(),
      { addToast: n } = _e(),
      o = a.has(s.id),
      [l, c] = (0, p.useState)(!1),
      [d, m] = (0, p.useState)(t),
      { isFollowing: h, loading: x, handleFollow: u } = Il(t ? null : s, r?.id);
    (0, p.useEffect)(() => {
      t && r && s.id
        ? rn(s.id, r.id)
            .then(c)
            .finally(() => m(!1))
        : m(!1);
    }, [t, r, s.id]);
    const f = async (S) => {
        if ((S.stopPropagation(), !r))
          return n("Please login to join communities", "error");
        m(!0);
        try {
          const _ = await an(s.id, r.id);
          (c(_),
            n(
              _
                ? `Joined ${"name" in s ? s.name : ""}`
                : `Left ${"name" in s ? s.name : ""}`,
            ));
        } catch {
          n("Failed to update membership", "error");
        } finally {
          m(!1);
        }
      },
      g = r?.id && s?.id && String(r.id) === String(s.id),
      v = t ? d : x,
      b = s?.handle || "",
      w = s?.avatar,
      y = s?.name || "",
      z = "membersCount" in s ? s.membersCount : 0,
      j = "verified" in s ? s.verified : !1,
      k = (S) => {
        (S.stopPropagation(), t ? f(S) : u());
      };
    return (0, i.jsxs)("div", {
      className:
        "group flex items-center justify-between border-b border-zinc-100 p-4 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/40",
      children: [
        (0, i.jsxs)("div", {
          className: "flex flex-1 items-center gap-3 cursor-pointer min-w-0",
          onClick: () => e(b),
          children: [
            (0, i.jsxs)("div", {
              className: "relative shrink-0",
              children: [
                (0, i.jsxs)(ne, {
                  className: `size-12 border border-zinc-200 shadow-sm dark:border-zinc-800 ${t ? "rounded-2xl" : ""}`,
                  children: [
                    (0, i.jsx)(oe, {
                      src: w || void 0,
                      alt: b,
                      className: "object-cover",
                    }),
                    (0, i.jsx)(me, {
                      className: t ? "rounded-2xl" : "",
                      children: b?.[0]?.toUpperCase(),
                    }),
                  ],
                }),
                o &&
                  !t &&
                  (0, i.jsx)("span", {
                    className:
                      "absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 shadow-sm dark:border-black",
                  }),
              ],
            }),
            (0, i.jsxs)("div", {
              className: "flex flex-col min-w-0",
              children: [
                (0, i.jsxs)("span", {
                  className:
                    "flex items-center gap-1 truncate font-extrabold text-zinc-900 dark:text-zinc-100",
                  children: [
                    y,
                    j &&
                      (0, i.jsx)(ar, {
                        size: 16,
                        className: "shrink-0 text-blue-500",
                      }),
                  ],
                }),
                (0, i.jsxs)("span", {
                  className: "truncate text-sm text-zinc-500",
                  children: ["@", b],
                }),
                t &&
                  (0, i.jsxs)("span", {
                    className: "mt-1 text-xs text-zinc-400",
                    children: [z || 0, " members"],
                  }),
              ],
            }),
          ],
        }),
        !g &&
          (0, i.jsx)(J, {
            variant: t
              ? l
                ? "secondary"
                : "outline"
              : h
                ? "secondary"
                : "outline",
            className:
              "ml-4 flex !w-auto shrink-0 items-center gap-1.5 rounded-full border-zinc-200 !px-4 !py-1.5 text-sm font-bold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800",
            onClick: k,
            disabled: v,
            children: v
              ? (0, i.jsx)($e, { className: "size-4 animate-spin" })
              : t
                ? l
                  ? (0, i.jsxs)(i.Fragment, {
                      children: [
                        (0, i.jsx)(ns, { size: 16 }),
                        (0, i.jsx)("span", {
                          className: "inline",
                          children: "Joined",
                        }),
                      ],
                    })
                  : (0, i.jsxs)(i.Fragment, {
                      children: [
                        (0, i.jsx)(is, { size: 16 }),
                        (0, i.jsx)("span", {
                          className: "inline",
                          children: "Join",
                        }),
                      ],
                    })
                : h
                  ? (0, i.jsxs)(i.Fragment, {
                      children: [
                        (0, i.jsx)(ns, { size: 16 }),
                        (0, i.jsx)("span", {
                          className: "inline",
                          children: "Following",
                        }),
                      ],
                    })
                  : (0, i.jsxs)(i.Fragment, {
                      children: [
                        (0, i.jsx)(is, { size: 16 }),
                        (0, i.jsx)("span", {
                          className: "inline",
                          children: "Follow",
                        }),
                      ],
                    }),
          }),
      ],
    });
  },
  y0 = Al,
  Ja = H(),
  ql = p.forwardRef((s, e) => {
    const t = (0, Ja.c)(15);
    let a, r, n;
    t[0] !== s
      ? (({ className: r, children: a, ...n } = s),
        (t[0] = s),
        (t[1] = a),
        (t[2] = r),
        (t[3] = n))
      : ((a = t[1]), (r = t[2]), (n = t[3]));
    let o;
    t[4] !== r
      ? ((o = E("relative overflow-hidden", r)), (t[4] = r), (t[5] = o))
      : (o = t[5]);
    let l;
    t[6] !== a
      ? ((l = (0, i.jsx)(yi, {
          className: "h-full w-full rounded-[inherit]",
          children: a,
        })),
        (t[6] = a),
        (t[7] = l))
      : (l = t[7]);
    let c, d;
    t[8] === Symbol.for("react.memo_cache_sentinel")
      ? ((c = (0, i.jsx)(Xa, {})),
        (d = (0, i.jsx)(Xr, {})),
        (t[8] = c),
        (t[9] = d))
      : ((c = t[8]), (d = t[9]));
    let m;
    return (
      t[10] !== n || t[11] !== e || t[12] !== o || t[13] !== l
        ? ((m = (0, i.jsxs)(ia, {
            ref: e,
            className: o,
            ...n,
            children: [l, c, d],
          })),
          (t[10] = n),
          (t[11] = e),
          (t[12] = o),
          (t[13] = l),
          (t[14] = m))
        : (m = t[14]),
      m
    );
  });
ql.displayName = ia.displayName;
var Xa = p.forwardRef((s, e) => {
  const t = (0, Ja.c)(14);
  let a, r, n;
  t[0] !== s
    ? (({ className: a, orientation: n, ...r } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n))
    : ((a = t[1]), (r = t[2]), (n = t[3]));
  const o = n === void 0 ? "vertical" : n,
    l =
      o === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]",
    c =
      o === "horizontal" &&
      "h-2.5 flex-col border-t border-t-transparent p-[1px]";
  let d;
  t[4] !== a || t[5] !== l || t[6] !== c
    ? ((d = E("flex touch-none select-none transition-colors", l, c, a)),
      (t[4] = a),
      (t[5] = l),
      (t[6] = c),
      (t[7] = d))
    : (d = t[7]);
  let m;
  t[8] === Symbol.for("react.memo_cache_sentinel")
    ? ((m = (0, i.jsx)($r, {
        className: "relative flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800",
      })),
      (t[8] = m))
    : (m = t[8]);
  let h;
  return (
    t[9] !== o || t[10] !== r || t[11] !== e || t[12] !== d
      ? ((h = (0, i.jsx)(Ss, {
          ref: e,
          orientation: o,
          className: d,
          ...r,
          children: m,
        })),
        (t[9] = o),
        (t[10] = r),
        (t[11] = e),
        (t[12] = d),
        (t[13] = h))
      : (h = t[13]),
    h
  );
});
Xa.displayName = Ss.displayName;
var Fl = H(),
  Dl = (s) => {
    const e = (0, Fl.c)(14),
      { value: t, onChange: a, onClear: r, placeholder: n, className: o } = s,
      l = n === void 0 ? "Search..." : n,
      c = `relative group w-full ${o === void 0 ? "" : o}`;
    let d;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((d = (0, i.jsx)(vt, {
          size: 18,
          className:
            "absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-violet-500 transition-colors",
        })),
        (e[0] = d))
      : (d = e[0]);
    let m;
    e[1] !== a
      ? ((m = (f) => a(f.target.value)), (e[1] = a), (e[2] = m))
      : (m = e[2]);
    let h;
    e[3] !== l || e[4] !== m || e[5] !== t
      ? ((h = (0, i.jsx)("input", {
          "data-search-input": "true",
          className:
            "w-full rounded-full border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-900 dark:text-white px-11 py-2.5 text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all",
          placeholder: l,
          value: t,
          onChange: m,
        })),
        (e[3] = l),
        (e[4] = m),
        (e[5] = t),
        (e[6] = h))
      : (h = e[6]);
    let x;
    e[7] !== r || e[8] !== t
      ? ((x =
          t &&
          (0, i.jsx)("button", {
            onClick: r,
            className:
              "absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors",
            children: (0, i.jsx)(et, { size: 16 }),
          })),
        (e[7] = r),
        (e[8] = t),
        (e[9] = x))
      : (x = e[9]);
    let u;
    return (
      e[10] !== c || e[11] !== h || e[12] !== x
        ? ((u = (0, i.jsxs)("div", { className: c, children: [d, h, x] })),
          (e[10] = c),
          (e[11] = h),
          (e[12] = x),
          (e[13] = u))
        : (u = e[13]),
      u
    );
  },
  rs = Dl,
  qe = H(),
  j0 = ui;
var _0 = bi,
  Hl = p.forwardRef((s, e) => {
    const t = (0, qe.c)(12);
    let a, r, n;
    t[0] !== s
      ? (({ className: r, children: a, ...n } = s),
        (t[0] = s),
        (t[1] = a),
        (t[2] = r),
        (t[3] = n))
      : ((a = t[1]), (r = t[2]), (n = t[3]));
    let o;
    t[4] !== r
      ? ((o = E(
          "flex h-9 w-full items-center justify-between rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:ring-offset-zinc-950 dark:focus:ring-zinc-300 [&>span]:line-clamp-1",
          r,
        )),
        (t[4] = r),
        (t[5] = o))
      : (o = t[5]);
    let l;
    t[6] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)(pi, {
          asChild: !0,
          children: (0, i.jsx)(Es, { className: "h-4 w-4 opacity-50" }),
        })),
        (t[6] = l))
      : (l = t[6]);
    let c;
    return (
      t[7] !== a || t[8] !== n || t[9] !== e || t[10] !== o
        ? ((c = (0, i.jsxs)(Ls, {
            ref: e,
            className: o,
            ...n,
            children: [a, l],
          })),
          (t[7] = a),
          (t[8] = n),
          (t[9] = e),
          (t[10] = o),
          (t[11] = c))
        : (c = t[11]),
      c
    );
  });
Hl.displayName = Ls.displayName;
var er = p.forwardRef((s, e) => {
  const t = (0, qe.c)(10);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E("flex cursor-default items-center justify-center py-1", a)),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  t[5] === Symbol.for("react.memo_cache_sentinel")
    ? ((o = (0, i.jsx)(Br, { className: "h-4 w-4" })), (t[5] = o))
    : (o = t[5]);
  let l;
  return (
    t[6] !== r || t[7] !== e || t[8] !== n
      ? ((l = (0, i.jsx)(Bs, { ref: e, className: n, ...r, children: o })),
        (t[6] = r),
        (t[7] = e),
        (t[8] = n),
        (t[9] = l))
      : (l = t[9]),
    l
  );
});
er.displayName = Bs.displayName;
var tr = p.forwardRef((s, e) => {
  const t = (0, qe.c)(10);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E("flex cursor-default items-center justify-center py-1", a)),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  t[5] === Symbol.for("react.memo_cache_sentinel")
    ? ((o = (0, i.jsx)(Es, { className: "h-4 w-4" })), (t[5] = o))
    : (o = t[5]);
  let l;
  return (
    t[6] !== r || t[7] !== e || t[8] !== n
      ? ((l = (0, i.jsx)(Qs, { ref: e, className: n, ...r, children: o })),
        (t[6] = r),
        (t[7] = e),
        (t[8] = n),
        (t[9] = l))
      : (l = t[9]),
    l
  );
});
tr.displayName = Qs.displayName;
var Vl = p.forwardRef((s, e) => {
  const t = (0, qe.c)(21);
  let a, r, n, o;
  t[0] !== s
    ? (({ className: r, children: a, position: o, ...n } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n),
      (t[4] = o))
    : ((a = t[1]), (r = t[2]), (n = t[3]), (o = t[4]));
  const l = o === void 0 ? "popper" : o,
    c =
      l === "popper" &&
      "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1";
  let d;
  t[5] !== r || t[6] !== c
    ? ((d = E(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-zinc-200 bg-white text-zinc-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
        c,
        r,
      )),
      (t[5] = r),
      (t[6] = c),
      (t[7] = d))
    : (d = t[7]);
  let m;
  t[8] === Symbol.for("react.memo_cache_sentinel")
    ? ((m = (0, i.jsx)(er, {})), (t[8] = m))
    : (m = t[8]);
  const h =
    l === "popper" &&
    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]";
  let x;
  t[9] !== h ? ((x = E("p-1", h)), (t[9] = h), (t[10] = x)) : (x = t[10]);
  let u;
  t[11] !== a || t[12] !== x
    ? ((u = (0, i.jsx)(_i, { className: x, children: a })),
      (t[11] = a),
      (t[12] = x),
      (t[13] = u))
    : (u = t[13]);
  let f;
  t[14] === Symbol.for("react.memo_cache_sentinel")
    ? ((f = (0, i.jsx)(tr, {})), (t[14] = f))
    : (f = t[14]);
  let g;
  return (
    t[15] !== l || t[16] !== n || t[17] !== e || t[18] !== d || t[19] !== u
      ? ((g = (0, i.jsx)(si, {
          children: (0, i.jsxs)(Ts, {
            ref: e,
            className: d,
            position: l,
            ...n,
            children: [m, u, f],
          }),
        })),
        (t[15] = l),
        (t[16] = n),
        (t[17] = e),
        (t[18] = d),
        (t[19] = u),
        (t[20] = g))
      : (g = t[20]),
    g
  );
});
Vl.displayName = Ts.displayName;
var Ol = p.forwardRef((s, e) => {
  const t = (0, qe.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E("px-2 py-1.5 text-sm font-semibold", a)), (t[3] = a), (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(Fs, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
Ol.displayName = Fs.displayName;
var Bl = p.forwardRef((s, e) => {
  const t = (0, qe.c)(14);
  let a, r, n;
  t[0] !== s
    ? (({ className: r, children: a, ...n } = s),
      (t[0] = s),
      (t[1] = a),
      (t[2] = r),
      (t[3] = n))
    : ((a = t[1]), (r = t[2]), (n = t[3]));
  let o;
  t[4] !== r
    ? ((o = E(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50",
        r,
      )),
      (t[4] = r),
      (t[5] = o))
    : (o = t[5]);
  let l;
  t[6] === Symbol.for("react.memo_cache_sentinel")
    ? ((l = (0, i.jsx)("span", {
        className:
          "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
        children: (0, i.jsx)(oi, {
          children: (0, i.jsx)(xt, { className: "h-4 w-4" }),
        }),
      })),
      (t[6] = l))
    : (l = t[6]);
  let c;
  t[7] !== a
    ? ((c = (0, i.jsx)(vi, { children: a })), (t[7] = a), (t[8] = c))
    : (c = t[8]);
  let d;
  return (
    t[9] !== n || t[10] !== e || t[11] !== o || t[12] !== c
      ? ((d = (0, i.jsxs)(As, {
          ref: e,
          className: o,
          ...n,
          children: [l, c],
        })),
        (t[9] = n),
        (t[10] = e),
        (t[11] = o),
        (t[12] = c),
        (t[13] = d))
      : (d = t[13]),
    d
  );
});
Bl.displayName = As.displayName;
var Wl = p.forwardRef((s, e) => {
  const t = (0, qe.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E("-mx-1 my-1 h-px bg-zinc-100 dark:bg-zinc-800", a)),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(Vs, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
Wl.displayName = Vs.displayName;
var Ul = H(),
  Gl = (s) => {
    const e = (0, Ul.c)(9),
      { className: t } = s,
      a = ye();
    let r;
    e[0] !== t
      ? ((r = E(
          "bg-[--card] border border-[--border] rounded-2xl p-8 flex flex-col items-center text-center gap-4 shadow-sm",
          t,
        )),
        (e[0] = t),
        (e[1] = r))
      : (r = e[1]);
    let n, o;
    e[2] === Symbol.for("react.memo_cache_sentinel")
      ? ((n = (0, i.jsxs)("div", {
          className: "relative",
          children: [
            (0, i.jsx)("div", {
              className:
                "size-16 animate-spin rounded-full border-4 border-t-transparent border-amber-400 duration-[3000ms]",
            }),
            (0, i.jsx)("span", {
              className:
                "absolute inset-0 flex items-center justify-center text-2xl",
              children: "💫",
            }),
          ],
        })),
        (o = (0, i.jsx)("h2", {
          className:
            "mt-2 text-lg font-extrabold leading-tight text-[--foreground]",
          children: "Get your Sysm account now!",
        })),
        (e[2] = n),
        (e[3] = o))
      : ((n = e[2]), (o = e[3]));
    let l;
    e[4] !== a
      ? ((l = (0, i.jsx)("button", {
          onClick: () => a("/register"),
          className:
            "w-full cursor-pointer rounded-full bg-zinc-950 py-2.5 text-sm font-black uppercase tracking-wider text-white shadow-lg transition-all hover:opacity-90 active:scale-95 dark:bg-white dark:text-zinc-950",
          children: "Signup now",
        })),
        (e[4] = a),
        (e[5] = l))
      : (l = e[5]);
    let c;
    return (
      e[6] !== r || e[7] !== l
        ? ((c = (0, i.jsxs)("div", { className: r, children: [n, o, l] })),
          (e[6] = r),
          (e[7] = l),
          (e[8] = c))
        : (c = e[8]),
      c
    );
  },
  Kl = Gl,
  Ql = H(),
  Yl = () => {
    const s = (0, Ql.c)(3);
    let e;
    s[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((e = (0, i.jsx)("div", {
          className:
            "size-11 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0",
        })),
        (s[0] = e))
      : (e = s[0]);
    let t;
    s[1] === Symbol.for("react.memo_cache_sentinel")
      ? ((t = (0, i.jsxs)("div", {
          className: "flex justify-between items-start mb-3",
          children: [
            (0, i.jsx)("div", {
              className: "h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3",
            }),
            (0, i.jsx)("div", {
              className: "h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16",
            }),
          ],
        })),
        (s[1] = t))
      : (t = s[1]);
    let a;
    return (
      s[2] === Symbol.for("react.memo_cache_sentinel")
        ? ((a = (0, i.jsx)("div", {
            className:
              "px-5 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 animate-pulse",
            children: (0, i.jsxs)("div", {
              className: "flex items-start gap-x-3",
              children: [
                e,
                (0, i.jsxs)("div", {
                  className: "flex-1 min-w-0",
                  children: [
                    t,
                    (0, i.jsxs)("div", {
                      className: "space-y-2",
                      children: [
                        (0, i.jsx)("div", {
                          className:
                            "h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full",
                        }),
                        (0, i.jsx)("div", {
                          className:
                            "h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6",
                        }),
                      ],
                    }),
                    (0, i.jsx)("div", {
                      className:
                        "h-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full mt-3",
                    }),
                  ],
                }),
              ],
            }),
          })),
          (s[2] = a))
        : (a = s[2]),
      a
    );
  },
  N0 = Yl,
  Ht = H(),
  Zl = hi,
  sr = p.forwardRef((s, e) => {
    const t = (0, Ht.c)(9);
    let a, r;
    t[0] !== s
      ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
      : ((a = t[1]), (r = t[2]));
    let n;
    t[3] !== a
      ? ((n = E(
          "inline-flex h-10 items-center justify-center rounded-md text-zinc-500 dark:text-zinc-400",
          a,
        )),
        (t[3] = a),
        (t[4] = n))
      : (n = t[4]);
    let o;
    return (
      t[5] !== r || t[6] !== e || t[7] !== n
        ? ((o = (0, i.jsx)(Ys, { ref: e, className: n, ...r })),
          (t[5] = r),
          (t[6] = e),
          (t[7] = n),
          (t[8] = o))
        : (o = t[8]),
      o
    );
  });
sr.displayName = Ys.displayName;
var Pt = p.forwardRef((s, e) => {
  const t = (0, Ht.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-zinc-950 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:text-zinc-50",
        a,
      )),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(Ws, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
Pt.displayName = Ws.displayName;
var Et = p.forwardRef((s, e) => {
  const t = (0, Ht.c)(9);
  let a, r;
  t[0] !== s
    ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
    : ((a = t[1]), (r = t[2]));
  let n;
  t[3] !== a
    ? ((n = E(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300",
        a,
      )),
      (t[3] = a),
      (t[4] = n))
    : (n = t[4]);
  let o;
  return (
    t[5] !== r || t[6] !== e || t[7] !== n
      ? ((o = (0, i.jsx)(ta, { ref: e, className: n, ...r })),
        (t[5] = r),
        (t[6] = e),
        (t[7] = n),
        (t[8] = o))
      : (o = t[8]),
    o
  );
});
Et.displayName = ta.displayName;
var Jl = H(),
  Xl = p.forwardRef((s, e) => {
    const t = (0, Jl.c)(9);
    let a, r;
    t[0] !== s
      ? (({ className: a, ...r } = s), (t[0] = s), (t[1] = a), (t[2] = r))
      : ((a = t[1]), (r = t[2]));
    let n;
    t[3] !== a
      ? ((n = E(
          "flex min-h-[80px] w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
          a,
        )),
        (t[3] = a),
        (t[4] = n))
      : (n = t[4]);
    let o;
    return (
      t[5] !== r || t[6] !== e || t[7] !== n
        ? ((o = (0, i.jsx)("textarea", { className: n, ref: e, ...r })),
          (t[5] = r),
          (t[6] = e),
          (t[7] = n),
          (t[8] = o))
        : (o = t[8]),
      o
    );
  });
Xl.displayName = "Textarea";
var ec = H(),
  tc = (s) => {
    const e = (0, ec.c)(7),
      { className: t } = s;
    let a;
    e[0] !== t
      ? ((a = E("flex items-center gap-1 px-1 py-1.5", t)),
        (e[0] = t),
        (e[1] = a))
      : (a = e[1]);
    let r, n, o;
    e[2] === Symbol.for("react.memo_cache_sentinel")
      ? ((r = (0, i.jsx)("div", {
          className:
            "size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-dot-pulse",
        })),
        (n = (0, i.jsx)("div", {
          className:
            "size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-dot-pulse [animation-delay:0.2s]",
        })),
        (o = (0, i.jsx)("div", {
          className:
            "size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-dot-pulse [animation-delay:0.4s]",
        })),
        (e[2] = r),
        (e[3] = n),
        (e[4] = o))
      : ((r = e[2]), (n = e[3]), (o = e[4]));
    let l;
    return (
      e[5] !== a
        ? ((l = (0, i.jsxs)("div", { className: a, children: [r, n, o] })),
          (e[5] = a),
          (e[6] = l))
        : (l = e[6]),
      l
    );
  },
  k0 = tc,
  sc = ({ onRefresh: s, children: e, className: t, disabled: a = !1 }) => {
    const [r, n] = (0, p.useState)(!1),
      [o, l] = (0, p.useState)(0),
      c = (0, p.useRef)(null),
      d = (0, p.useRef)(0),
      m = (0, p.useRef)(!1),
      h = 70,
      x = 120,
      u = (0, p.useCallback)(() => {
        if (!c.current) return null;
        const f = c.current.querySelector("[data-radix-scroll-area-viewport]");
        if (f) return f;
        const g = c.current.querySelector(".overflow-y-auto");
        if (g) return g;
        const v = c.current.children;
        for (let b = 0; b < v.length; b++) {
          const w = v[b];
          if (
            window.getComputedStyle(w).overflowY === "auto" ||
            window.getComputedStyle(w).overflowY === "scroll"
          )
            return w;
        }
        return c.current;
      }, []);
    return (
      (0, p.useEffect)(() => {
        const f = c.current;
        if (!f) return;
        const g = (w) => {
            if (a || r) return;
            const y = u();
            y &&
              (y.scrollTop <= 0
                ? ((d.current = w.touches[0].clientY), (m.current = !1))
                : (d.current = -1));
          },
          v = (w) => {
            if (d.current === -1 || a || r) return;
            const y = w.touches[0].clientY - d.current;
            if (y > 0) {
              const z = u();
              z &&
                z.scrollTop <= 0 &&
                (w.cancelable && w.preventDefault(),
                (m.current = !0),
                l(Math.min(y * 0.4, x)));
            } else ((m.current = !1), l(0), (d.current = -1));
          },
          b = async () => {
            if (!m.current || a || r) {
              l(0);
              return;
            }
            if (((m.current = !1), o >= h)) {
              (n(!0), l(h));
              try {
                await s();
              } catch (w) {
                console.error("Refresh failed:", w);
              } finally {
                (n(!1), l(0));
              }
            } else l(0);
          };
        return (
          f.addEventListener("touchstart", g, { passive: !0 }),
          f.addEventListener("touchmove", v, { passive: !1 }),
          f.addEventListener("touchend", b),
          f.addEventListener("touchcancel", b),
          () => {
            (f.removeEventListener("touchstart", g),
              f.removeEventListener("touchmove", v),
              f.removeEventListener("touchend", b),
              f.removeEventListener("touchcancel", b));
          }
        );
      }, [a, r, s, u, o, h, x]),
      (0, i.jsxs)("div", {
        ref: c,
        className: E("relative w-full h-full", t),
        children: [
          (0, i.jsx)("div", {
            className:
              "absolute top-0 left-0 right-0 flex justify-center items-center overflow-hidden pointer-events-none z-[60]",
            style: { height: Math.max(o, r ? h : 0) },
            children: (0, i.jsx)("div", {
              className:
                "flex flex-col items-center gap-1.5 transition-opacity duration-200 py-2",
              children: (0, i.jsx)("div", {
                className: E(
                  "flex items-center justify-center size-9 rounded-full bg-white dark:bg-zinc-800 shadow-xl border border-zinc-100 dark:border-zinc-700 transition-transform duration-200",
                  o >= h && !r ? "scale-110" : "scale-100",
                ),
                children: r
                  ? (0, i.jsx)($e, {
                      className: "size-5 text-violet-600 animate-spin",
                    })
                  : (0, i.jsx)(Dr, {
                      className: E(
                        "size-5 text-zinc-400 transition-transform duration-300",
                        o >= h ? "rotate-180 text-violet-600" : "rotate-0",
                      ),
                      style: {
                        opacity: Math.max(0.3, o / h),
                        transform: `rotate(${Math.min(o * 2, 180)}deg)`,
                      },
                    }),
              }),
            }),
          }),
          (0, i.jsx)(la.div, {
            animate: { y: r ? h : o },
            transition: { type: "spring", stiffness: 300, damping: 30 },
            className: "w-full h-full",
            children: e,
          }),
        ],
      })
    );
  },
  z0 = sc,
  re = H();
const C0 = (s) => {
    const e = (0, re.c)(10);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l, c;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M13.6006 21.0761L19.0608 17.9236C19.6437 17.5871 19.9346 17.4188 20.1465 17.1834C20.3341 16.9751 20.4759 16.7297 20.5625 16.4632C20.6602 16.1626 20.6602 15.8267 20.6602 15.1568V8.84268C20.6602 8.17277 20.6602 7.83694 20.5625 7.53638C20.4759 7.26982 20.3341 7.02428 20.1465 6.816C19.9355 6.58161 19.6453 6.41405 19.0674 6.08043L13.5996 2.92359C13.0167 2.58706 12.7259 2.41913 12.416 2.35328C12.1419 2.295 11.8584 2.295 11.5843 2.35328C11.2744 2.41914 10.9826 2.58706 10.3997 2.92359L4.93843 6.07666C4.35623 6.41279 4.06535 6.58073 3.85352 6.816C3.66597 7.02428 3.52434 7.26982 3.43773 7.53638C3.33984 7.83765 3.33984 8.17436 3.33984 8.84742V15.1524C3.33984 15.8254 3.33984 16.1619 3.43773 16.4632C3.52434 16.7297 3.66597 16.9751 3.85352 17.1834C4.06548 17.4188 4.35657 17.5871 4.93945 17.9236L10.3997 21.0761C10.9826 21.4126 11.2744 21.5806 11.5843 21.6465C11.8584 21.7047 12.1419 21.7047 12.416 21.6465C12.7259 21.5806 13.0177 21.4126 13.6006 21.0761Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (c = (0, i.jsx)("path", {
          d: "M9 11.9998C9 13.6566 10.3431 14.9998 12 14.9998C13.6569 14.9998 15 13.6566 15 11.9998C15 10.3429 13.6569 8.99976 12 8.99976C10.3431 8.99976 9 10.3429 9 11.9998Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l),
        (e[5] = c))
      : ((l = e[4]), (c = e[5]));
    let d;
    return (
      e[6] !== o || e[7] !== t || e[8] !== n
        ? ((d = (0, i.jsxs)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: [l, c],
          })),
          (e[6] = o),
          (e[7] = t),
          (e[8] = n),
          (e[9] = d))
        : (d = e[9]),
      d
    );
  },
  ar = (s) => {
    const e = (0, re.c)(10);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l, c;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z",
          fill: "currentColor",
        })),
        (c = (0, i.jsx)("path", {
          d: "M15 10L11 14L9 12",
          stroke: "white",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l),
        (e[5] = c))
      : ((l = e[4]), (c = e[5]));
    let d;
    return (
      e[6] !== o || e[7] !== t || e[8] !== n
        ? ((d = (0, i.jsxs)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: [l, c],
          })),
          (e[6] = o),
          (e[7] = t),
          (e[8] = n),
          (e[9] = d))
        : (d = e[9]),
      d
    );
  },
  S0 = (s) => {
    const e = (0, re.c)(9);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M12 8.00012L4 16.0001V20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l))
      : (l = e[4]);
    let c;
    return (
      e[5] !== o || e[6] !== t || e[7] !== n
        ? ((c = (0, i.jsx)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: l,
          })),
          (e[5] = o),
          (e[6] = t),
          (e[7] = n),
          (e[8] = c))
        : (c = e[8]),
      c
    );
  },
  is = (s) => {
    const e = (0, re.c)(9);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M15 19C15 16.7909 12.3137 15 9 15C5.68629 15 3 16.7909 3 19M19 16V13M19 13V10M19 13H16M19 13H22M9 12C6.79086 12 5 10.2091 5 8C5 5.79086 6.79086 4 9 4C11.2091 4 13 5.79086 13 8C13 10.2091 11.2091 12 9 12Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l))
      : (l = e[4]);
    let c;
    return (
      e[5] !== o || e[6] !== t || e[7] !== n
        ? ((c = (0, i.jsx)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: l,
          })),
          (e[5] = o),
          (e[6] = t),
          (e[7] = n),
          (e[8] = c))
        : (c = e[8]),
      c
    );
  },
  ns = (s) => {
    const e = (0, re.c)(9);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M15 19C15 16.7909 12.3137 15 9 15C5.68629 15 3 16.7909 3 19M21 10L17 14L15 12M9 12C6.79086 12 5 10.2091 5 8C5 5.79086 6.79086 4 9 4C11.2091 4 13 5.79086 13 8C13 10.2091 11.2091 12 9 12Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l))
      : (l = e[4]);
    let c;
    return (
      e[5] !== o || e[6] !== t || e[7] !== n
        ? ((c = (0, i.jsx)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: l,
          })),
          (e[5] = o),
          (e[6] = t),
          (e[7] = n),
          (e[8] = c))
        : (c = e[8]),
      c
    );
  },
  $0 = (s) => {
    const e = (0, re.c)(10);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l, c;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M5 9.92285C5 14.7747 9.24448 18.7869 11.1232 20.3252C11.3921 20.5454 11.5281 20.6568 11.7287 20.7132C11.8849 20.7572 12.1148 20.7572 12.271 20.7132C12.472 20.6567 12.6071 20.5463 12.877 20.3254C14.7557 18.7871 18.9999 14.7751 18.9999 9.9233C18.9999 8.08718 18.2625 6.32605 16.9497 5.02772C15.637 3.72939 13.8566 3 12.0001 3C10.1436 3 8.36301 3.7295 7.05025 5.02783C5.7375 6.32616 5 8.08674 5 9.92285Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (c = (0, i.jsx)("path", {
          d: "M10 9C10 10.1046 10.8954 11 12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l),
        (e[5] = c))
      : ((l = e[4]), (c = e[5]));
    let d;
    return (
      e[6] !== o || e[7] !== t || e[8] !== n
        ? ((d = (0, i.jsxs)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: [l, c],
          })),
          (e[6] = o),
          (e[7] = t),
          (e[8] = n),
          (e[9] = d))
        : (d = e[9]),
      d
    );
  },
  P0 = (s) => {
    const e = (0, re.c)(9);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l))
      : (l = e[4]);
    let c;
    return (
      e[5] !== o || e[6] !== t || e[7] !== n
        ? ((c = (0, i.jsx)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: l,
          })),
          (e[5] = o),
          (e[6] = t),
          (e[7] = n),
          (e[8] = c))
        : (c = e[8]),
      c
    );
  },
  E0 = (s) => {
    const e = (0, re.c)(9);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M10.3078 13.6923L15.1539 8.84619M20.1113 5.88867L16.0207 19.1833C15.6541 20.3747 15.4706 20.9707 15.1544 21.1683C14.8802 21.3396 14.5406 21.3683 14.2419 21.2443C13.8975 21.1014 13.618 20.5433 13.0603 19.428L10.4694 14.2461C10.3809 14.0691 10.3366 13.981 10.2775 13.9043C10.225 13.8363 10.1645 13.7749 10.0965 13.7225C10.0215 13.6647 9.93486 13.6214 9.76577 13.5369L4.57192 10.9399C3.45662 10.3823 2.89892 10.1032 2.75601 9.75879C2.63207 9.4601 2.66033 9.12023 2.83169 8.84597C3.02928 8.52974 3.62523 8.34603 4.81704 7.97932L18.1116 3.88867C19.0486 3.60038 19.5173 3.45635 19.8337 3.57253C20.1094 3.67373 20.3267 3.89084 20.4279 4.16651C20.544 4.48283 20.3999 4.95126 20.1119 5.88729L20.1113 5.88867Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l))
      : (l = e[4]);
    let c;
    return (
      e[5] !== o || e[6] !== t || e[7] !== n
        ? ((c = (0, i.jsx)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: l,
          })),
          (e[5] = o),
          (e[6] = t),
          (e[7] = n),
          (e[8] = c))
        : (c = e[8]),
      c
    );
  },
  rr = (s) => {
    const e = (0, re.c)(9);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M4 11.4522V16.8002C4 17.9203 4 18.4807 4.21799 18.9086C4.40973 19.2849 4.71547 19.5906 5.0918 19.7823C5.5192 20.0001 6.07899 20.0001 7.19691 20.0001H16.8031C17.921 20.0001 18.48 20.0001 18.9074 19.7823C19.2837 19.5906 19.5905 19.2849 19.7822 18.9086C20 18.4811 20 17.9216 20 16.8037V11.4522C20 10.9179 19.9995 10.6506 19.9346 10.4019C19.877 10.1816 19.7825 9.97307 19.6546 9.78464C19.5102 9.57201 19.3096 9.39569 18.9074 9.04383L14.1074 4.84383C13.3608 4.19054 12.9875 3.86406 12.5674 3.73982C12.1972 3.63035 11.8026 3.63035 11.4324 3.73982C11.0126 3.86397 10.6398 4.19014 9.89436 4.84244L5.09277 9.04383C4.69064 9.39569 4.49004 9.57201 4.3457 9.78464C4.21779 9.97307 4.12255 10.1816 4.06497 10.4019C4 10.6506 4 10.9179 4 11.4522Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l))
      : (l = e[4]);
    let c;
    return (
      e[5] !== o || e[6] !== t || e[7] !== n
        ? ((c = (0, i.jsx)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: l,
          })),
          (e[5] = o),
          (e[6] = t),
          (e[7] = n),
          (e[8] = c))
        : (c = e[8]),
      c
    );
  },
  ir = (s) => {
    const e = (0, re.c)(9);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M5.59961 19.9203L7.12357 18.7012L7.13478 18.6926C7.45249 18.4384 7.61281 18.3101 7.79168 18.2188C7.95216 18.1368 8.12328 18.0771 8.2998 18.0408C8.49877 18 8.70603 18 9.12207 18H17.8031C18.921 18 19.4806 18 19.908 17.7822C20.2843 17.5905 20.5905 17.2842 20.7822 16.9079C21 16.4805 21 15.9215 21 14.8036V7.19691C21 6.07899 21 5.5192 20.7822 5.0918C20.5905 4.71547 20.2837 4.40973 19.9074 4.21799C19.4796 4 18.9203 4 17.8002 4H6.2002C5.08009 4 4.51962 4 4.0918 4.21799C3.71547 4.40973 3.40973 4.71547 3.21799 5.0918C3 5.51962 3 6.08009 3 7.2002V18.6712C3 19.7369 3 20.2696 3.21846 20.5433C3.40845 20.7813 3.69644 20.9198 4.00098 20.9195C4.35115 20.9191 4.76744 20.5861 5.59961 19.9203Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l))
      : (l = e[4]);
    let c;
    return (
      e[5] !== o || e[6] !== t || e[7] !== n
        ? ((c = (0, i.jsx)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: l,
          })),
          (e[5] = o),
          (e[6] = t),
          (e[7] = n),
          (e[8] = c))
        : (c = e[8]),
      c
    );
  },
  nr = (s) => {
    const e = (0, re.c)(9);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M6.89761 18.1618C8.28247 19.3099 10.0607 20 12.0001 20C16.4184 20 20.0001 16.4183 20.0001 12C20.0001 11.431 19.9407 10.8758 19.8278 10.3404M6.89761 18.1618C5.12756 16.6944 4.00014 14.4789 4.00014 12C4.00014 7.58172 7.58186 4 12.0001 4C15.8494 4 19.0637 6.71853 19.8278 10.3404M6.89761 18.1618C8.85314 17.7147 11.1796 16.7828 13.526 15.4281C16.2564 13.8517 18.4773 12.0125 19.8278 10.3404M6.89761 18.1618C4.46844 18.7171 2.61159 18.5243 1.99965 17.4644C1.36934 16.3726 2.19631 14.5969 3.99999 12.709M19.8278 10.3404C21.0796 8.79041 21.5836 7.38405 21.0522 6.46374C20.5134 5.53051 19.0095 5.26939 16.9997 5.59929",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l))
      : (l = e[4]);
    let c;
    return (
      e[5] !== o || e[6] !== t || e[7] !== n
        ? ((c = (0, i.jsx)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: l,
          })),
          (e[5] = o),
          (e[6] = t),
          (e[7] = n),
          (e[8] = c))
        : (c = e[8]),
      c
    );
  },
  or = (s) => {
    const e = (0, re.c)(10);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l, c;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (c = (0, i.jsx)("path", {
          d: "M10 15V9L15 12L10 15Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l),
        (e[5] = c))
      : ((l = e[4]), (c = e[5]));
    let d;
    return (
      e[6] !== o || e[7] !== t || e[8] !== n
        ? ((d = (0, i.jsxs)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: [l, c],
          })),
          (e[6] = o),
          (e[7] = t),
          (e[8] = n),
          (e[9] = d))
        : (d = e[9]),
      d
    );
  },
  lr = (s) => {
    const e = (0, re.c)(9);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9M15 17H18.5905C18.973 17 19.1652 17 19.3201 16.9478C19.616 16.848 19.8475 16.6156 19.9473 16.3198C19.9997 16.1643 19.9997 15.9715 19.9997 15.5859C19.9997 15.4172 19.9995 15.3329 19.9863 15.2524C19.9614 15.1004 19.9024 14.9563 19.8126 14.8312C19.7651 14.7651 19.7047 14.7048 19.5858 14.5858L19.1963 14.1963C19.0706 14.0706 19 13.9001 19 13.7224V10C19 6.134 15.866 2.99999 12 3C8.13401 3.00001 5 6.13401 5 10V13.7224C5 13.9002 4.92924 14.0706 4.80357 14.1963L4.41406 14.5858C4.29477 14.7051 4.23504 14.765 4.1875 14.8312C4.09766 14.9564 4.03815 15.1004 4.0132 15.2524C4 15.3329 4 15.4172 4 15.586C4 15.9715 4 16.1642 4.05245 16.3197C4.15225 16.6156 4.3848 16.848 4.68066 16.9478C4.83556 17 5.02701 17 5.40956 17H9M18.0186 2.01367C19.3978 3.05299 20.4843 4.43177 21.1724 6.01574M5.98197 2.01367C4.60275 3.05299 3.5162 4.43177 2.82812 6.01574",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l))
      : (l = e[4]);
    let c;
    return (
      e[5] !== o || e[6] !== t || e[7] !== n
        ? ((c = (0, i.jsx)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: l,
          })),
          (e[5] = o),
          (e[6] = t),
          (e[7] = n),
          (e[8] = c))
        : (c = e[8]),
      c
    );
  },
  M0 = (s) => {
    const e = (0, re.c)(9);
    let t, a, r;
    e[0] !== s
      ? (({ size: a, className: r, ...t } = s),
        (e[0] = s),
        (e[1] = t),
        (e[2] = a),
        (e[3] = r))
      : ((t = e[1]), (a = e[2]), (r = e[3]));
    const n = a === void 0 ? 24 : a,
      o = r === void 0 ? "" : r;
    let l;
    e[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = (0, i.jsx)("path", {
          d: "M17 20C17 18.3431 14.7614 17 12 17C9.23858 17 7 18.3431 7 20M21 17.0004C21 15.7702 19.7659 14.7129 18 14.25M3 17.0004C3 15.7702 4.2341 14.7129 6 14.25M18 10.2361C18.6137 9.68679 19 8.8885 19 8C19 6.34315 17.6569 5 16 5C15.2316 5 14.5308 5.28885 14 5.76389M6 10.2361C5.38625 9.68679 5 8.8885 5 8C5 6.34315 6.34315 5 8 5C8.76835 5 9.46924 5.28885 10 5.76389M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
        })),
        (e[4] = l))
      : (l = e[4]);
    let c;
    return (
      e[5] !== o || e[6] !== t || e[7] !== n
        ? ((c = (0, i.jsx)("svg", {
            width: n,
            height: n,
            viewBox: "0 0 24 24",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            className: o,
            ...t,
            children: l,
          })),
          (e[5] = o),
          (e[6] = t),
          (e[7] = n),
          (e[8] = c))
        : (c = e[8]),
      c
    );
  };
var ac = H();
const cr = (s) => {
  const e = (0, ac.c)(16),
    t = Ie(),
    a = s?.id;
  let r;
  e[0] !== a
    ? ((r = ["unread_notifications_count", a]), (e[0] = a), (e[1] = r))
    : (r = e[1]);
  let n;
  e[2] !== s?.id
    ? ((n = () => sn(s?.id || "")), (e[2] = s?.id), (e[3] = n))
    : (n = e[3]);
  const o = !!s?.id;
  let l;
  e[4] !== r || e[5] !== n || e[6] !== o
    ? ((l = { queryKey: r, queryFn: n, enabled: o }),
      (e[4] = r),
      (e[5] = n),
      (e[6] = o),
      (e[7] = l))
    : (l = e[7]);
  const { data: c } = Le(l),
    d = c === void 0 ? 0 : c;
  let m;
  e[8] !== s || e[9] !== t
    ? ((m = () => {
        if (!s?.id) return;
        const f = N.channel(`unread_count:${s.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `recipient_id=eq.${s.id}`,
            },
            () => {
              (t.invalidateQueries({
                queryKey: ["unread_notifications_count", s.id],
              }),
                t.invalidateQueries({ queryKey: ["notifications", s.id] }));
            },
          )
          .subscribe();
        return () => {
          N.removeChannel(f);
        };
      }),
      (e[8] = s),
      (e[9] = t),
      (e[10] = m))
    : (m = e[10]);
  const h = s?.id;
  let x;
  (e[11] !== t || e[12] !== h
    ? ((x = [h, t]), (e[11] = t), (e[12] = h), (e[13] = x))
    : (x = e[13]),
    (0, p.useEffect)(m, x));
  let u;
  return (
    e[14] !== d
      ? ((u = { unreadCount: d }), (e[14] = d), (e[15] = u))
      : (u = e[15]),
    u
  );
};
var rc = H();
const dr = (s) => {
  const e = (0, rc.c)(23),
    t = s?.id;
  let a;
  e[0] !== t
    ? ((a = ["conversations", t]), (e[0] = t), (e[1] = a))
    : (a = e[1]);
  let r;
  e[2] !== s?.id
    ? ((r = () => Ji(s?.id || "")), (e[2] = s?.id), (e[3] = r))
    : (r = e[3]);
  const n = !!s?.id;
  let o;
  e[4] !== a || e[5] !== r || e[6] !== n
    ? ((o = { queryKey: a, queryFn: r, enabled: n, staleTime: 6e4 }),
      (e[4] = a),
      (e[5] = r),
      (e[6] = n),
      (e[7] = o))
    : (o = e[7]);
  const { data: l, isLoading: c, refetch: d } = Le(o);
  let m;
  e[8] !== l
    ? ((m = l === void 0 ? [] : l), (e[8] = l), (e[9] = m))
    : (m = e[9]);
  const h = m,
    x = s?.id;
  let u;
  e[10] !== x
    ? ((u = ["unread_messages_count", x]), (e[10] = x), (e[11] = u))
    : (u = e[11]);
  let f;
  e[12] !== s?.id
    ? ((f = () => Zi(s?.id || "")), (e[12] = s?.id), (e[13] = f))
    : (f = e[13]);
  const g = !!s?.id;
  let v;
  e[14] !== g || e[15] !== u || e[16] !== f
    ? ((v = { queryKey: u, queryFn: f, enabled: g, staleTime: 6e4 }),
      (e[14] = g),
      (e[15] = u),
      (e[16] = f),
      (e[17] = v))
    : (v = e[17]);
  const { data: b } = Le(v),
    w = b === void 0 ? 0 : b;
  let y;
  return (
    e[18] !== h || e[19] !== c || e[20] !== d || e[21] !== w
      ? ((y = {
          conversations: h,
          unreadCount: w,
          isConvLoading: c,
          refetchConversations: d,
        }),
        (e[18] = h),
        (e[19] = c),
        (e[20] = d),
        (e[21] = w),
        (e[22] = y))
      : (y = e[22]),
    y
  );
};
var ic = H(),
  nc = (s) => {
    const e = (0, ic.c)(23),
      { handleProfileClick: t } = s,
      { currentUser: a } = pe(),
      { unreadCount: r } = cr(a),
      { unreadCount: n } = dr(a),
      o = pt();
    let l;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = [
          { id: "home", icon: rr, path: "/feed" },
          { id: "community", icon: nr, path: "/community" },
          { id: "reels", icon: or, path: "/r" },
          { id: "messages", icon: ir, path: "/m" },
          { id: "notifications", icon: lr, path: "/notifications" },
        ]),
        (e[0] = l))
      : (l = e[0]);
    const c = l;
    let d;
    e[1] !== n || e[2] !== r
      ? ((d = c.map((y) =>
          (0, i.jsx)(
            ms,
            {
              to: y.path,
              "aria-label": y.id,
              className: lc,
              children: (z) => {
                const { isActive: j } = z;
                return (0, i.jsxs)(i.Fragment, {
                  children: [
                    (0, i.jsx)(y.icon, { size: 26, strokeWidth: j ? 2.5 : 2 }),
                    y.id === "notifications" &&
                      r > 0 &&
                      (0, i.jsx)("span", {
                        className:
                          "absolute right-[30%] top-3 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-black",
                      }),
                    y.id === "messages" &&
                      n > 0 &&
                      (0, i.jsx)("span", {
                        className:
                          "absolute right-[30%] top-3 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-black",
                      }),
                  ],
                });
              },
            },
            y.id,
          ),
        )),
        (e[1] = n),
        (e[2] = r),
        (e[3] = d))
      : (d = e[3]);
    let m;
    e[4] !== a || e[5] !== t
      ? ((m = () => {
          a && t(a.handle);
        }),
        (e[4] = a),
        (e[5] = t),
        (e[6] = m))
      : (m = e[6]);
    const h = `size-7 border-2 ${o.pathname.startsWith("/u/") ? "border-black dark:border-white" : "border-transparent opacity-70"}`,
      x = a?.avatar || "/default-avatar.webp";
    let u;
    e[7] !== x
      ? ((u = (0, i.jsx)(oe, {
          src: x,
          alt: "Profile",
          className: "object-cover",
        })),
        (e[7] = x),
        (e[8] = u))
      : (u = e[8]);
    let f;
    e[9] !== a?.handle?.[0]
      ? ((f = a?.handle?.[0]?.toUpperCase()),
        (e[9] = a?.handle?.[0]),
        (e[10] = f))
      : (f = e[10]);
    let g;
    e[11] !== f
      ? ((g = (0, i.jsx)(me, { children: f })), (e[11] = f), (e[12] = g))
      : (g = e[12]);
    let v;
    e[13] !== h || e[14] !== u || e[15] !== g
      ? ((v = (0, i.jsxs)(ne, { className: h, children: [u, g] })),
        (e[13] = h),
        (e[14] = u),
        (e[15] = g),
        (e[16] = v))
      : (v = e[16]);
    let b;
    e[17] !== m || e[18] !== v
      ? ((b = (0, i.jsx)("button", {
          onClick: m,
          "aria-label": "My Profile",
          className: "flex h-full flex-1 flex-col items-center justify-center",
          children: v,
        })),
        (e[17] = m),
        (e[18] = v),
        (e[19] = b))
      : (b = e[19]);
    let w;
    return (
      e[20] !== b || e[21] !== d
        ? ((w = (0, i.jsxs)("nav", {
            className:
              "pb-safe fixed bottom-0 left-0 right-0 z-[40] flex h-16 items-center border-t border-zinc-100 bg-white/90 backdrop-blur-md dark:border-zinc-800 dark:bg-black/90 md:hidden",
            children: [d, b],
          })),
          (e[20] = b),
          (e[21] = d),
          (e[22] = w))
        : (w = e[22]),
      w
    );
  },
  oc = nc;
function lc(s) {
  const { isActive: e } = s;
  return `relative flex h-full flex-1 flex-col items-center justify-center transition-all duration-200 ${e ? "text-black dark:text-white" : "text-zinc-400 opacity-70"}`;
}
var cc = H(),
  dc = () => {
    const s = (0, cc.c)(5);
    let e, t;
    s[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((e = (0, i.jsx)("img", {
          src: "/welcome-banner.webp",
          alt: "Welcome Banner",
          fetchPriority: "high",
          loading: "eager",
          decoding: "async",
          className:
            "h-full w-full object-cover duration-700 group-hover:scale-105",
        })),
        (t = (0, i.jsx)("div", {
          className:
            "absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent",
        })),
        (s[0] = e),
        (s[1] = t))
      : ((e = s[0]), (t = s[1]));
    let a;
    s[2] === Symbol.for("react.memo_cache_sentinel")
      ? ((a = (0, i.jsx)("h1", {
          className: "mb-1 text-3xl font-black drop-shadow-lg sm:text-4xl",
          children: "Welcome to Sysm",
        })),
        (s[2] = a))
      : (a = s[2]);
    let r;
    s[3] === Symbol.for("react.memo_cache_sentinel")
      ? ((r = (0, i.jsxs)("div", {
          className: "absolute bottom-6 left-8 text-white",
          children: [
            a,
            (0, i.jsxs)("p", {
              className:
                "tracking-wide text-sm font-medium opacity-90 drop-shadow-md sm:text-base",
              children: [
                "a social network built by",
                " ",
                (0, i.jsx)("a", {
                  href: "https://t.me/systemadminbd",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "hover:underline",
                  children: "@Systemadminbd",
                }),
              ],
            }),
          ],
        })),
        (s[3] = r))
      : (r = s[3]);
    let n;
    return (
      s[4] === Symbol.for("react.memo_cache_sentinel")
        ? ((n = (0, i.jsxs)("div", {
            className:
              "group relative mb-6 aspect-[21/9] w-full cursor-pointer overflow-hidden rounded-3xl sm:aspect-[2.5/1]",
            children: [
              e,
              t,
              r,
              (0, i.jsx)("div", {
                className: "absolute bottom-4 right-8",
                children: (0, i.jsx)("img", {
                  src: "/logo.webp",
                  className: "size-12 animate-pulse rounded-xl opacity-80",
                  alt: "",
                  loading: "lazy",
                  decoding: "async",
                }),
              }),
            ],
          })),
          (s[4] = n))
        : (n = s[4]),
      n
    );
  },
  mc = dc,
  uc = H(),
  fc = (s) => {
    const e = (0, uc.c)(32),
      { triggerClassName: t, side: a, align: r } = s,
      n = a === void 0 ? "right" : a,
      o = r === void 0 ? "start" : r,
      l = ye();
    let c;
    e[0] !== t
      ? ((c = E(
          "flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg",
          t,
        )),
        (e[0] = t),
        (e[1] = c))
      : (c = e[1]);
    let d;
    e[2] === Symbol.for("react.memo_cache_sentinel")
      ? ((d = (0, i.jsx)($t, { size: 26, strokeWidth: 2.5 })), (e[2] = d))
      : (d = e[2]);
    let m;
    e[3] !== c
      ? ((m = (0, i.jsx)(xo, {
          asChild: !0,
          children: (0, i.jsx)("button", {
            "aria-label": "Create Menu",
            className: c,
            children: d,
          }),
        })),
        (e[3] = c),
        (e[4] = m))
      : (m = e[4]);
    let h;
    e[5] !== l
      ? ((h = () => l("/create")), (e[5] = l), (e[6] = h))
      : (h = e[6]);
    let x;
    e[7] === Symbol.for("react.memo_cache_sentinel")
      ? ((x = (0, i.jsx)("div", {
          className:
            "flex size-9 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
          children: (0, i.jsx)(Zr, { size: 18 }),
        })),
        (e[7] = x))
      : (x = e[7]);
    let u;
    e[8] === Symbol.for("react.memo_cache_sentinel")
      ? ((u = (0, i.jsxs)("div", {
          className: "flex flex-col",
          children: [
            (0, i.jsx)("span", { children: "Create Post" }),
            (0, i.jsx)("span", {
              className: "text-[11px] font-medium text-zinc-500",
              children: "Share your thoughts",
            }),
          ],
        })),
        (e[8] = u))
      : (u = e[8]);
    let f;
    e[9] !== h
      ? ((f = (0, i.jsxs)(mt, {
          onClick: h,
          className:
            "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-bold text-[--foreground] transition-colors focus:bg-zinc-50 dark:focus:bg-zinc-900",
          children: [x, u],
        })),
        (e[9] = h),
        (e[10] = f))
      : (f = e[10]);
    let g;
    e[11] !== l
      ? ((g = () => l("/create", { state: { isStory: !0 } })),
        (e[11] = l),
        (e[12] = g))
      : (g = e[12]);
    let v;
    e[13] === Symbol.for("react.memo_cache_sentinel")
      ? ((v = (0, i.jsx)("div", {
          className:
            "flex size-9 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
          children: (0, i.jsx)(Pr, { size: 18 }),
        })),
        (e[13] = v))
      : (v = e[13]);
    let b;
    e[14] === Symbol.for("react.memo_cache_sentinel")
      ? ((b = (0, i.jsxs)("div", {
          className: "flex flex-col",
          children: [
            (0, i.jsx)("span", { children: "Add Story" }),
            (0, i.jsx)("span", {
              className: "text-[11px] font-medium text-zinc-500",
              children: "Disappears in 24h",
            }),
          ],
        })),
        (e[14] = b))
      : (b = e[14]);
    let w;
    e[15] !== g
      ? ((w = (0, i.jsxs)(mt, {
          onClick: g,
          className:
            "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-bold text-[--foreground] transition-colors focus:bg-zinc-50 dark:focus:bg-zinc-900",
          children: [v, b],
        })),
        (e[15] = g),
        (e[16] = w))
      : (w = e[16]);
    let y;
    e[17] !== l
      ? ((y = () => l("/create", { state: { isReel: !0 } })),
        (e[17] = l),
        (e[18] = y))
      : (y = e[18]);
    let z;
    e[19] === Symbol.for("react.memo_cache_sentinel")
      ? ((z = (0, i.jsx)("div", {
          className:
            "flex size-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
          children: (0, i.jsx)(ni, { size: 18 }),
        })),
        (e[19] = z))
      : (z = e[19]);
    let j;
    e[20] === Symbol.for("react.memo_cache_sentinel")
      ? ((j = (0, i.jsxs)("div", {
          className: "flex flex-col",
          children: [
            (0, i.jsx)("span", { children: "Create Reel" }),
            (0, i.jsx)("span", {
              className: "text-[11px] font-medium text-zinc-500",
              children: "Post a short video",
            }),
          ],
        })),
        (e[20] = j))
      : (j = e[20]);
    let k;
    e[21] !== y
      ? ((k = (0, i.jsxs)(mt, {
          onClick: y,
          className:
            "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 text-[15px] font-bold text-[--foreground] transition-colors focus:bg-zinc-50 dark:focus:bg-zinc-900",
          children: [z, j],
        })),
        (e[21] = y),
        (e[22] = k))
      : (k = e[22]);
    let S;
    e[23] !== o || e[24] !== n || e[25] !== w || e[26] !== k || e[27] !== f
      ? ((S = (0, i.jsxs)(Ca, {
          side: n,
          align: o,
          sideOffset: 12,
          className:
            "w-56 rounded-2xl border-[--border] bg-[--card] p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200",
          children: [f, w, k],
        })),
        (e[23] = o),
        (e[24] = n),
        (e[25] = w),
        (e[26] = k),
        (e[27] = f),
        (e[28] = S))
      : (S = e[28]);
    let _;
    return (
      e[29] !== S || e[30] !== m
        ? ((_ = (0, i.jsxs)(po, { children: [m, S] })),
          (e[29] = S),
          (e[30] = m),
          (e[31] = _))
        : (_ = e[31]),
      _
    );
  },
  mr = fc,
  hc = H(),
  pc = () => {
    const s = (0, hc.c)(17),
      { currentUser: e } = pe(),
      { unreadCount: t } = cr(e),
      { unreadCount: a } = dr(e);
    let r, n, o, l, c;
    s[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((r = { id: "home", icon: rr, path: "/feed" }),
        (n = { id: "community", icon: nr, path: "/community" }),
        (o = { id: "reels", icon: or, path: "/r" }),
        (l = { id: "messages", icon: ir, path: "/m" }),
        (c = { id: "notifications", icon: lr, path: "/notifications" }),
        (s[0] = r),
        (s[1] = n),
        (s[2] = o),
        (s[3] = l),
        (s[4] = c))
      : ((r = s[0]), (n = s[1]), (o = s[2]), (l = s[3]), (c = s[4]));
    const d = e ? `/u/${e.handle}` : "/login";
    let m;
    s[5] !== d
      ? ((m = [r, n, o, l, c, { id: "profile", icon: ft, path: d }]),
        (s[5] = d),
        (s[6] = m))
      : (m = s[6]);
    const h = m;
    let x;
    s[7] === Symbol.for("react.memo_cache_sentinel")
      ? ((x = (0, i.jsx)(us, {
          to: "/",
          className: "mb-8 transition-transform hover:scale-110",
          children: (0, i.jsx)("img", {
            src: "/logo.webp",
            alt: "Logo",
            className: "size-8 rounded-lg",
          }),
        })),
        (s[7] = x))
      : (x = s[7]);
    let u;
    s[8] !== a || s[9] !== h || s[10] !== t
      ? ((u = h.map((v) =>
          (0, i.jsxs)(
            ms,
            {
              to: v.path,
              "aria-label": v.id,
              className: gc,
              children: [
                (0, i.jsx)(v.icon, { size: 26, strokeWidth: 2.5 }),
                v.id === "notifications" &&
                  t > 0 &&
                  (0, i.jsx)("span", {
                    className:
                      "absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-black",
                  }),
                v.id === "messages" &&
                  a > 0 &&
                  (0, i.jsx)("span", {
                    className:
                      "absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-black",
                  }),
              ],
            },
            v.id,
          ),
        )),
        (s[8] = a),
        (s[9] = h),
        (s[10] = t),
        (s[11] = u))
      : (u = s[11]);
    let f;
    s[12] !== e
      ? ((f =
          e &&
          (0, i.jsx)("div", {
            className: "mt-2",
            children: (0, i.jsx)(mr, {
              triggerClassName:
                "rounded-xl bg-zinc-950 p-2.5 text-white dark:bg-white dark:text-zinc-950",
            }),
          })),
        (s[12] = e),
        (s[13] = f))
      : (f = s[13]);
    let g;
    return (
      s[14] !== u || s[15] !== f
        ? ((g = (0, i.jsxs)("aside", {
            className:
              "sticky top-0 hidden h-screen w-[68px] shrink-0 self-start flex-col items-center border-r border-zinc-100 bg-white py-5 transition-colors duration-200 dark:border-zinc-800 dark:bg-black md:flex",
            children: [
              x,
              (0, i.jsxs)("nav", {
                className: "flex w-full flex-col items-center gap-y-4",
                children: [u, f],
              }),
            ],
          })),
          (s[14] = u),
          (s[15] = f),
          (s[16] = g))
        : (g = s[16]),
      g
    );
  },
  xc = pc;
function gc(s) {
  const { isActive: e } = s;
  return `relative rounded-xl border border-transparent p-2.5 transition-all duration-200 ${e ? "border-zinc-200 bg-zinc-100 text-black dark:border-zinc-800 dark:bg-zinc-900 dark:text-white" : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"}`;
}
var vc = H(),
  bc = () => {
    const s = (0, vc.c)(49),
      { currentUser: e } = pe(),
      { darkMode: t, toggleDarkMode: a } = va(),
      [r, n] = (0, p.useState)(""),
      o = ye();
    let l;
    s[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((l = {
          queryKey: ["trending-hashtags"],
          queryFn: yc,
          staleTime: 3e5,
          refetchInterval: 6e4,
        }),
        (s[0] = l))
      : (l = s[0]);
    const { data: c } = Le(l);
    let d;
    s[1] !== c
      ? ((d = c === void 0 ? [] : c), (s[1] = c), (s[2] = d))
      : (d = s[2]);
    const m = d;
    let h;
    s[3] === Symbol.for("react.memo_cache_sentinel")
      ? ((h = [
          "© 2026 Sysm",
          "Terms",
          "Privacy",
          "Guidelines",
          "Discord",
          "Sysm",
          "GitHub",
          "Support",
          "Status",
        ]),
        (s[3] = h))
      : (h = s[3]);
    const x = h;
    let u;
    s[4] !== t
      ? ((u = t ? (0, i.jsx)(Wr, { size: 20 }) : (0, i.jsx)(li, { size: 20 })),
        (s[4] = t),
        (s[5] = u))
      : (u = s[5]);
    let f;
    s[6] !== u || s[7] !== a
      ? ((f = (0, i.jsx)("button", {
          onClick: a,
          className:
            "cursor-pointer rounded-full border border-zinc-100 bg-zinc-50 p-3 text-zinc-500 transition-all hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800",
          title: "Toggle Theme",
          children: u,
        })),
        (s[6] = u),
        (s[7] = a),
        (s[8] = f))
      : (f = s[8]);
    const g = f;
    if (e) {
      let I;
      s[9] === Symbol.for("react.memo_cache_sentinel")
        ? ((I = () => n("")), (s[9] = I))
        : (I = s[9]);
      let A;
      s[10] !== r
        ? ((A = (0, i.jsx)("div", {
            className: "flex-1",
            children: (0, i.jsx)(rs, { value: r, onChange: n, onClear: I }),
          })),
          (s[10] = r),
          (s[11] = A))
        : (A = s[11]);
      let R;
      s[12] !== A || s[13] !== g
        ? ((R = (0, i.jsxs)("div", {
            className: "flex items-center gap-3",
            children: [A, g],
          })),
          (s[12] = A),
          (s[13] = g),
          (s[14] = R))
        : (R = s[14]);
      let M;
      s[15] === Symbol.for("react.memo_cache_sentinel")
        ? ((M = (0, i.jsx)("h3", {
            className: "px-4 pt-4 pb-2 text-xl font-black text-[--foreground]",
            children: "What's happening",
          })),
          (s[15] = M))
        : (M = s[15]);
      let P;
      if (s[16] !== o || s[17] !== m) {
        let L;
        (s[19] !== o
          ? ((L = (q) =>
              (0, i.jsxs)(
                "div",
                {
                  onClick: () => o(`/tags/${q.name.replace(/^#/, "")}`),
                  className:
                    "group cursor-pointer px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
                  children: [
                    (0, i.jsx)("div", {
                      className:
                        "text-[13px] font-medium text-zinc-500 dark:text-zinc-400",
                      children: "Trending",
                    }),
                    (0, i.jsxs)("div", {
                      className:
                        "text-[15px] font-bold text-[--foreground] group-hover:text-violet-500 transition-colors",
                      children: ["#", q.name.replace(/^#/, "")],
                    }),
                    (0, i.jsxs)("div", {
                      className: "text-[13px] text-zinc-500 dark:text-zinc-400",
                      children: [q.usage_count, " posts"],
                    }),
                  ],
                },
                q.id,
              )),
            (s[19] = o),
            (s[20] = L))
          : (L = s[20]),
          (P = m.map(L)),
          (s[16] = o),
          (s[17] = m),
          (s[18] = P));
      } else P = s[18];
      let C;
      s[21] !== m.length
        ? ((C =
            m.length === 0 &&
            (0, i.jsx)("p", {
              className: "px-4 py-6 text-sm text-zinc-500 text-center",
              children: "No trends yet",
            })),
          (s[21] = m.length),
          (s[22] = C))
        : (C = s[22]);
      let T;
      s[23] === Symbol.for("react.memo_cache_sentinel")
        ? ((T = (0, i.jsx)("button", {
            className:
              "w-full px-4 py-4 text-left text-violet-500 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-sm font-medium",
            children: "Show more",
          })),
          (s[23] = T))
        : (T = s[23]);
      let V;
      s[24] !== P || s[25] !== C
        ? ((V = (0, i.jsxs)("div", {
            className:
              "rounded-2xl border border-[--border] bg-[--card] overflow-hidden",
            children: [
              M,
              (0, i.jsxs)("div", {
                className: "flex flex-col",
                children: [P, C, T],
              }),
            ],
          })),
          (s[24] = P),
          (s[25] = C),
          (s[26] = V))
        : (V = s[26]);
      let W;
      s[27] === Symbol.for("react.memo_cache_sentinel")
        ? ((W = (0, i.jsx)("div", {
            className:
              "flex flex-wrap gap-x-4 gap-y-2 px-2 pb-5 text-[13px] font-medium text-zinc-500",
            children: x.map(jc),
          })),
          (s[27] = W))
        : (W = s[27]);
      let B;
      return (
        s[28] !== V || s[29] !== R
          ? ((B = (0, i.jsxs)("aside", {
              className:
                "sticky top-0 hidden max-h-screen w-[350px] shrink-0 self-start flex-col gap-y-6 overflow-y-auto pt-5 lg:flex",
              children: [R, V, W],
            })),
            (s[28] = V),
            (s[29] = R),
            (s[30] = B))
          : (B = s[30]),
        B
      );
    }
    let v, b;
    s[31] !== o
      ? ((v = (0, i.jsx)("button", {
          onClick: () => o("/register"),
          className:
            "cursor-pointer flex-1 rounded-full border border-[--border] bg-[--card] py-2.5 font-bold text-[--foreground] shadow-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900",
          children: "Signup",
        })),
        (b = () => o("/login")),
        (s[31] = o),
        (s[32] = v),
        (s[33] = b))
      : ((v = s[32]), (b = s[33]));
    let w;
    s[34] === Symbol.for("react.memo_cache_sentinel")
      ? ((w = (0, i.jsx)("img", {
          src: "/logo.webp",
          alt: "",
          className: "size-4 rounded-sm",
        })),
        (s[34] = w))
      : (w = s[34]);
    let y;
    s[35] !== b
      ? ((y = (0, i.jsxs)("button", {
          onClick: b,
          className:
            "cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-full bg-zinc-950 py-2.5 font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-zinc-950",
          children: [w, "Login"],
        })),
        (s[35] = b),
        (s[36] = y))
      : (y = s[36]);
    let z;
    s[37] !== v || s[38] !== y || s[39] !== g
      ? ((z = (0, i.jsxs)("div", {
          className: "flex gap-3",
          children: [v, y, g],
        })),
        (s[37] = v),
        (s[38] = y),
        (s[39] = g),
        (s[40] = z))
      : (z = s[40]);
    let j;
    s[41] === Symbol.for("react.memo_cache_sentinel")
      ? ((j = () => n("")), (s[41] = j))
      : (j = s[41]);
    let k;
    s[42] !== r
      ? ((k = (0, i.jsx)(rs, { value: r, onChange: n, onClear: j })),
        (s[42] = r),
        (s[43] = k))
      : (k = s[43]);
    let S;
    s[44] === Symbol.for("react.memo_cache_sentinel")
      ? ((S = (0, i.jsx)(Kl, {})), (s[44] = S))
      : (S = s[44]);
    let _;
    s[45] === Symbol.for("react.memo_cache_sentinel")
      ? ((_ = (0, i.jsx)("div", {
          className:
            "flex flex-wrap gap-x-4 gap-y-2 px-2 pb-5 text-[13px] font-medium text-zinc-500",
          children: x.map(_c),
        })),
        (s[45] = _))
      : (_ = s[45]);
    let $;
    return (
      s[46] !== z || s[47] !== k
        ? (($ = (0, i.jsxs)("aside", {
            className:
              "sticky top-0 hidden max-h-screen w-[400px] shrink-0 self-start flex-col gap-y-6 overflow-y-auto pt-5 pr-4 lg:flex",
            children: [z, k, S, _],
          })),
          (s[46] = z),
          (s[47] = k),
          (s[48] = $))
        : ($ = s[48]),
      $
    );
  },
  wc = bc;
function yc() {
  return dn(5);
}
function jc(s) {
  return (0, i.jsx)(
    "a",
    { href: "#", className: "hover:underline", children: s },
    s,
  );
}
function _c(s) {
  return (0, i.jsx)(
    "a",
    { href: "#", className: "hover:underline", children: s },
    s,
  );
}
var Nc = H(),
  kc = () => {
    const s = (0, Nc.c)(23),
      e = pt(),
      t = ye(),
      { darkMode: a } = va(),
      r = e.pathname === "/" || e.pathname === "/feed",
      n = e.pathname.startsWith("/r");
    let o;
    s[0] !== e.pathname
      ? ((o =
          e.pathname.startsWith("/r") ||
          (e.pathname.startsWith("/m") && e.pathname.split("/").length > 2)),
        (s[0] = e.pathname),
        (s[1] = o))
      : (o = s[1]);
    const l = o;
    let c;
    s[2] !== t
      ? ((c = (z) => {
          t(`/u/${z}`);
        }),
        (s[2] = t),
        (s[3] = c))
      : (c = s[3]);
    const d = c,
      m = `min-h-screen ${n ? "h-screen overflow-hidden" : ""} bg-[--background] text-[--foreground] font-sans selection:bg-violet-500 selection:text-white transition-colors duration-200 ${a ? "dark" : ""}`;
    let h;
    s[4] === Symbol.for("react.memo_cache_sentinel")
      ? ((h = (0, i.jsx)(xc, {})), (s[4] = h))
      : (h = s[4]);
    const x = `flex w-full flex-1 justify-center px-0 gap-x-0 ${n ? "" : "md:px-2 md:py-3 md:gap-x-4 lg:gap-x-8"}`;
    let u;
    s[5] !== r
      ? ((u =
          r &&
          (0, i.jsx)("div", {
            className: "w-full max-w-full overflow-hidden",
            children: (0, i.jsx)(mc, {}),
          })),
        (s[5] = r),
        (s[6] = u))
      : (u = s[6]);
    let f;
    s[7] === Symbol.for("react.memo_cache_sentinel")
      ? ((f = (0, i.jsx)("div", {
          className: "w-full min-w-0",
          children: (0, i.jsx)(vr, {}),
        })),
        (s[7] = f))
      : (f = s[7]);
    let g;
    s[8] !== u
      ? ((g = (0, i.jsxs)("div", {
          className: "flex w-full min-w-0 flex-1 flex-col overflow-x-hidden",
          children: [u, f],
        })),
        (s[8] = u),
        (s[9] = g))
      : (g = s[9]);
    let v;
    s[10] !== e.pathname
      ? ((v = !e.pathname.startsWith("/m") && (0, i.jsx)(wc, {})),
        (s[10] = e.pathname),
        (s[11] = v))
      : (v = s[11]);
    let b;
    s[12] !== x || s[13] !== g || s[14] !== v
      ? ((b = (0, i.jsxs)("div", {
          className:
            "mx-auto flex min-h-screen w-full max-w-[1500px] justify-center px-0 sm:px-0",
          children: [
            h,
            (0, i.jsxs)("main", { className: x, children: [g, v] }),
          ],
        })),
        (s[12] = x),
        (s[13] = g),
        (s[14] = v),
        (s[15] = b))
      : (b = s[15]);
    let w;
    s[16] !== d || s[17] !== l
      ? ((w = !l && (0, i.jsx)(oc, { handleProfileClick: d })),
        (s[16] = d),
        (s[17] = l),
        (s[18] = w))
      : (w = s[18]);
    let y;
    return (
      s[19] !== w || s[20] !== m || s[21] !== b
        ? ((y = (0, i.jsxs)("div", { className: m, children: [b, w] })),
          (s[19] = w),
          (s[20] = m),
          (s[21] = b),
          (s[22] = y))
        : (y = s[22]),
      y
    );
  },
  zc = kc,
  Cc = H(),
  Sc = (s) => {
    const e = (0, Cc.c)(2),
      { children: t } = s;
    let a;
    return (
      e[0] !== t
        ? ((a = (0, i.jsx)("div", {
            className:
              "w-full animate-in fade-in slide-in-from-bottom-2 duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] fill-mode-forwards",
            children: t,
          })),
          (e[0] = t),
          (e[1] = a))
        : (a = e[1]),
      a
    );
  },
  ie = Sc,
  R0 = H(),
  $c = H(),
  Pc = (s) => {
    const e = (0, $c.c)(72),
      { isOpen: t, onClose: a } = s,
      { currentUser: r } = pe(),
      { addToast: n } = _e(),
      o = ye(),
      l = Ie();
    let c;
    e[0] === Symbol.for("react.memo_cache_sentinel")
      ? ((c = { name: "", handle: "", description: "", isPrivate: !1 }),
        (e[0] = c))
      : (c = e[0]);
    const [d, m] = (0, p.useState)(c);
    let h;
    e[1] !== n || e[2] !== r?.id || e[3] !== o || e[4] !== a || e[5] !== l
      ? ((h = (O) => {
          O &&
            (n(`Community "${O.name}" created!`),
            l.invalidateQueries({ queryKey: ["user-communities", r?.id] }),
            a(),
            o(`/c/${O.handle}`));
        }),
        (e[1] = n),
        (e[2] = r?.id),
        (e[3] = o),
        (e[4] = a),
        (e[5] = l),
        (e[6] = h))
      : (h = e[6]);
    let x;
    e[7] !== n
      ? ((x = (O) => {
          (console.error(O),
            n(O.message || "Failed to create community", "error"));
        }),
        (e[7] = n),
        (e[8] = x))
      : (x = e[8]);
    let u;
    e[9] !== h || e[10] !== x
      ? ((u = { mutationFn: Ec, onSuccess: h, onError: x }),
        (e[9] = h),
        (e[10] = x),
        (e[11] = u))
      : (u = e[11]);
    const f = we(u);
    let g;
    e[12] !== f ||
    e[13] !== r ||
    e[14] !== d.description ||
    e[15] !== d.handle ||
    e[16] !== d.isPrivate ||
    e[17] !== d.name
      ? ((g = (O) => {
          (O.preventDefault(),
            !(!d.name || !d.handle || !r) &&
              f.mutate({
                name: d.name,
                handle: d.handle.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                description: d.description,
                is_private: d.isPrivate,
                creator_id: r.id,
              }));
        }),
        (e[12] = f),
        (e[13] = r),
        (e[14] = d.description),
        (e[15] = d.handle),
        (e[16] = d.isPrivate),
        (e[17] = d.name),
        (e[18] = g))
      : (g = e[18]);
    const v = g;
    let b;
    e[19] !== f.isPending || e[20] !== a
      ? ((b = () => !f.isPending && a()),
        (e[19] = f.isPending),
        (e[20] = a),
        (e[21] = b))
      : (b = e[21]);
    let w;
    e[22] === Symbol.for("react.memo_cache_sentinel")
      ? ((w = (0, i.jsxs)("div", {
          className:
            "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900",
          children: [
            (0, i.jsx)("div", {
              className:
                "mb-3 flex size-20 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-black",
              children: (0, i.jsx)(St, {
                size: 32,
                className: "text-violet-600",
              }),
            }),
            (0, i.jsx)("p", {
              className:
                "max-w-[200px] text-center text-xs font-medium text-zinc-500",
              children:
                "Communities are where people with shared interests connect.",
            }),
          ],
        })),
        (e[22] = w))
      : (w = e[22]);
    let y;
    e[23] === Symbol.for("react.memo_cache_sentinel")
      ? ((y = (0, i.jsx)("label", {
          className: "ml-1 text-sm font-bold",
          children: "Community Name",
        })),
        (e[23] = y))
      : (y = e[23]);
    let z;
    e[24] !== d
      ? ((z = (O) => m({ ...d, name: O.target.value })),
        (e[24] = d),
        (e[25] = z))
      : (z = e[25]);
    let j;
    e[26] !== d.name || e[27] !== z
      ? ((j = (0, i.jsxs)("div", {
          className: "space-y-1.5",
          children: [
            y,
            (0, i.jsx)("input", {
              type: "text",
              required: !0,
              className:
                "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900",
              placeholder: "e.g. Photography Enthusiasts",
              value: d.name,
              onChange: z,
            }),
          ],
        })),
        (e[26] = d.name),
        (e[27] = z),
        (e[28] = j))
      : (j = e[28]);
    let k;
    e[29] === Symbol.for("react.memo_cache_sentinel")
      ? ((k = (0, i.jsx)("label", {
          className: "ml-1 text-sm font-bold",
          children: "Handle",
        })),
        (e[29] = k))
      : (k = e[29]);
    let S;
    e[30] === Symbol.for("react.memo_cache_sentinel")
      ? ((S = (0, i.jsx)("span", {
          className:
            "absolute left-4 top-1/2 -translate-y-1/2 font-medium text-zinc-500",
          children: "c/",
        })),
        (e[30] = S))
      : (S = e[30]);
    let _;
    e[31] !== d
      ? ((_ = (O) =>
          m({
            ...d,
            handle: O.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
          })),
        (e[31] = d),
        (e[32] = _))
      : (_ = e[32]);
    let $;
    e[33] !== d.handle || e[34] !== _
      ? (($ = (0, i.jsxs)("div", {
          className: "space-y-1.5",
          children: [
            k,
            (0, i.jsxs)("div", {
              className: "relative",
              children: [
                S,
                (0, i.jsx)("input", {
                  type: "text",
                  required: !0,
                  className:
                    "w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-8 pr-4 py-2.5 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900",
                  placeholder: "photography",
                  value: d.handle,
                  onChange: _,
                }),
              ],
            }),
          ],
        })),
        (e[33] = d.handle),
        (e[34] = _),
        (e[35] = $))
      : ($ = e[35]);
    let I;
    e[36] === Symbol.for("react.memo_cache_sentinel")
      ? ((I = (0, i.jsx)("label", {
          className: "ml-1 text-sm font-bold",
          children: "Description (Optional)",
        })),
        (e[36] = I))
      : (I = e[36]);
    let A;
    e[37] !== d
      ? ((A = (O) => m({ ...d, description: O.target.value })),
        (e[37] = d),
        (e[38] = A))
      : (A = e[38]);
    let R;
    e[39] !== d.description || e[40] !== A
      ? ((R = (0, i.jsxs)("div", {
          className: "space-y-1.5",
          children: [
            I,
            (0, i.jsx)("textarea", {
              className:
                "min-h-[100px] w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900",
              placeholder: "What is this community about?",
              value: d.description,
              onChange: A,
            }),
          ],
        })),
        (e[39] = d.description),
        (e[40] = A),
        (e[41] = R))
      : (R = e[41]);
    let M;
    e[42] === Symbol.for("react.memo_cache_sentinel")
      ? ((M = (0, i.jsxs)("div", {
          className: "flex flex-col",
          children: [
            (0, i.jsx)("span", {
              className: "text-sm font-bold",
              children: "Private Community",
            }),
            (0, i.jsx)("span", {
              className: "text-[10px] text-zinc-500",
              children: "Only Admins can post in private communities",
            }),
          ],
        })),
        (e[42] = M))
      : (M = e[42]);
    let P;
    e[43] !== d
      ? ((P = (O) => m({ ...d, isPrivate: O.target.checked })),
        (e[43] = d),
        (e[44] = P))
      : (P = e[44]);
    let C;
    e[45] !== d.isPrivate || e[46] !== P
      ? ((C = (0, i.jsxs)("div", {
          className:
            "flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900",
          children: [
            M,
            (0, i.jsx)("input", {
              type: "checkbox",
              className: "size-5 cursor-pointer rounded-md accent-violet-600",
              checked: d.isPrivate,
              onChange: P,
            }),
          ],
        })),
        (e[45] = d.isPrivate),
        (e[46] = P),
        (e[47] = C))
      : (C = e[47]);
    let T;
    e[48] !== j || e[49] !== $ || e[50] !== R || e[51] !== C
      ? ((T = (0, i.jsxs)("div", {
          className: "space-y-4",
          children: [j, $, R, C],
        })),
        (e[48] = j),
        (e[49] = $),
        (e[50] = R),
        (e[51] = C),
        (e[52] = T))
      : (T = e[52]);
    let V;
    e[53] !== f.isPending || e[54] !== a
      ? ((V = (0, i.jsx)(J, {
          type: "button",
          variant: "outline",
          className: "flex-1",
          onClick: a,
          disabled: f.isPending,
          children: "Cancel",
        })),
        (e[53] = f.isPending),
        (e[54] = a),
        (e[55] = V))
      : (V = e[55]);
    const W = f.isPending || !d.name || !d.handle;
    let B;
    e[56] !== f.isPending
      ? ((B = f.isPending
          ? (0, i.jsx)($e, { size: 18, className: "animate-spin" })
          : "Create"),
        (e[56] = f.isPending),
        (e[57] = B))
      : (B = e[57]);
    let L;
    e[58] !== W || e[59] !== B
      ? ((L = (0, i.jsx)(J, {
          type: "submit",
          className: "flex-1",
          disabled: W,
          children: B,
        })),
        (e[58] = W),
        (e[59] = B),
        (e[60] = L))
      : (L = e[60]);
    let q;
    e[61] !== V || e[62] !== L
      ? ((q = (0, i.jsxs)("div", {
          className: "flex gap-3 pt-2",
          children: [V, L],
        })),
        (e[61] = V),
        (e[62] = L),
        (e[63] = q))
      : (q = e[63]);
    let F;
    e[64] !== v || e[65] !== T || e[66] !== q
      ? ((F = (0, i.jsxs)("form", {
          onSubmit: v,
          className: "space-y-5",
          children: [w, T, q],
        })),
        (e[64] = v),
        (e[65] = T),
        (e[66] = q),
        (e[67] = F))
      : (F = e[67]);
    let U;
    return (
      e[68] !== t || e[69] !== F || e[70] !== b
        ? ((U = (0, i.jsx)(Ae, {
            isOpen: t,
            onClose: b,
            title: "Create Community",
            className: "sm:max-w-md",
            children: F,
          })),
          (e[68] = t),
          (e[69] = F),
          (e[70] = b),
          (e[71] = U))
        : (U = e[71]),
      U
    );
  },
  L0 = Pc;
function Ec(s) {
  return nn(s);
}
function T0({ isOpen: s, onClose: e, community: t, onUpdate: a }) {
  const { addToast: r } = _e(),
    [n, o] = (0, p.useState)({
      name: "",
      handle: "",
      description: "",
      avatar: "",
      cover: "",
      isPrivate: !1,
    }),
    [l, c] = (0, p.useState)(!1),
    d = (0, p.useRef)(null),
    m = (0, p.useRef)(null);
  (0, p.useEffect)(() => {
    t &&
      s &&
      o({
        name: t.name || "",
        handle: t.handle || "",
        description: t.description || "",
        avatar: t.avatar || "",
        cover: t.cover || "",
        isPrivate: t.isPrivate || !1,
      });
  }, [t, s]);
  const h = (f, g) => {
      const v = f.target.files?.[0];
      v && x(v, g);
    },
    x = async (f, g) => {
      c(!0);
      try {
        const v = await Te(f);
        (o((b) => ({ ...b, [g]: v.url })),
          r(`${g.charAt(0).toUpperCase() + g.slice(1)} uploaded!`));
      } catch {
        r(`Failed to upload ${g}`, "error");
      } finally {
        c(!1);
      }
    },
    u = async (f) => {
      if ((f.preventDefault(), !(!n.name || !n.handle || !t))) {
        c(!0);
        try {
          const g = await on(t.id, {
            name: n.name,
            handle: n.handle.toLowerCase().replace(/[^a-z0-9_]/g, ""),
            description: n.description,
            avatar_url: n.avatar,
            cover_url: n.cover,
            is_private: n.isPrivate,
          });
          (r("Community updated successfully!"), a && a(g), e());
        } catch (g) {
          (console.error(g),
            r(g.message || "Failed to update community", "error"));
        } finally {
          c(!1);
        }
      }
    };
  return (0, i.jsx)(i.Fragment, {
    children: (0, i.jsxs)(Ae, {
      isOpen: s,
      onClose: () => !l && e(),
      title: "Edit Community",
      className: "sm:max-w-xl",
      children: [
        (0, i.jsxs)("div", {
          className: "max-h-[85vh] space-y-6 overflow-y-auto px-1",
          children: [
            (0, i.jsxs)("div", {
              className: "relative",
              children: [
                (0, i.jsxs)("div", {
                  className:
                    "group relative h-32 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 sm:h-40",
                  children: [
                    n.cover &&
                      (0, i.jsx)("img", {
                        src: n.cover,
                        className: "h-full w-full object-cover",
                        alt: "",
                      }),
                    (0, i.jsx)("div", {
                      className:
                        "absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100",
                      children: (0, i.jsx)("button", {
                        onClick: () => m.current?.click(),
                        className:
                          "rounded-full bg-black/60 p-3 text-white transition-all hover:bg-black",
                        children: (0, i.jsx)(ht, { size: 20 }),
                      }),
                    }),
                  ],
                }),
                (0, i.jsx)("div", {
                  className: "absolute -bottom-8 left-6",
                  children: (0, i.jsxs)("div", {
                    className:
                      "group relative size-20 overflow-hidden rounded-2xl border-4 border-white bg-zinc-100 shadow-lg dark:border-black dark:bg-zinc-800 sm:size-24",
                    children: [
                      (0, i.jsx)("img", {
                        src: n.avatar,
                        className: "size-full object-cover",
                        alt: "",
                      }),
                      (0, i.jsx)("div", {
                        className:
                          "absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100",
                        children: (0, i.jsx)("button", {
                          onClick: () => d.current?.click(),
                          className: "p-2 text-white",
                          children: (0, i.jsx)(ht, { size: 18 }),
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
            (0, i.jsx)("div", {
              className: "pt-6",
              children: (0, i.jsxs)("form", {
                onSubmit: u,
                className: "space-y-5",
                children: [
                  (0, i.jsxs)("div", {
                    className: "space-y-4",
                    children: [
                      (0, i.jsxs)("div", {
                        className: "space-y-1.5",
                        children: [
                          (0, i.jsx)("label", {
                            className: "ml-1 text-sm font-bold",
                            children: "Community Name",
                          }),
                          (0, i.jsx)("input", {
                            type: "text",
                            required: !0,
                            className:
                              "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 font-medium outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900",
                            value: n.name,
                            onChange: (f) => o({ ...n, name: f.target.value }),
                          }),
                        ],
                      }),
                      (0, i.jsxs)("div", {
                        className: "space-y-1.5",
                        children: [
                          (0, i.jsx)("label", {
                            className: "ml-1 text-sm font-bold",
                            children: "Handle",
                          }),
                          (0, i.jsxs)("div", {
                            className: "relative",
                            children: [
                              (0, i.jsx)("span", {
                                className:
                                  "absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500",
                                children: "c/",
                              }),
                              (0, i.jsx)("input", {
                                type: "text",
                                required: !0,
                                className:
                                  "w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-8 pr-4 py-2.5 text-sm font-medium outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900",
                                value: n.handle,
                                onChange: (f) =>
                                  o({
                                    ...n,
                                    handle: f.target.value
                                      .toLowerCase()
                                      .replace(/[^a-z0-9_]/g, ""),
                                  }),
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, i.jsxs)("div", {
                        className: "space-y-1.5",
                        children: [
                          (0, i.jsx)("label", {
                            className: "ml-1 text-sm font-bold",
                            children: "Description",
                          }),
                          (0, i.jsx)("textarea", {
                            className:
                              "min-h-[100px] w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 font-medium outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900",
                            placeholder: "What is this community about?",
                            value: n.description,
                            onChange: (f) =>
                              o({ ...n, description: f.target.value }),
                          }),
                        ],
                      }),
                      (0, i.jsxs)("div", {
                        className:
                          "flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900",
                        children: [
                          (0, i.jsxs)("div", {
                            className: "flex flex-col",
                            children: [
                              (0, i.jsx)("span", {
                                className: "text-sm font-bold",
                                children: "Private Community",
                              }),
                              (0, i.jsx)("span", {
                                className: "text-[10px] text-zinc-500",
                                children:
                                  "Only Admins can post in private communities",
                              }),
                            ],
                          }),
                          (0, i.jsx)("input", {
                            type: "checkbox",
                            className:
                              "size-5 cursor-pointer rounded-md accent-violet-600",
                            checked: n.isPrivate,
                            onChange: (f) =>
                              o({ ...n, isPrivate: f.target.checked }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, i.jsxs)("div", {
                    className: "flex gap-3 py-2 pt-6",
                    children: [
                      (0, i.jsx)(J, {
                        type: "button",
                        variant: "outline",
                        className: "h-11 flex-1 rounded-xl font-bold",
                        onClick: e,
                        disabled: l,
                        children: "Cancel",
                      }),
                      (0, i.jsx)(J, {
                        type: "submit",
                        className:
                          "h-11 flex-1 rounded-xl bg-zinc-900 font-bold text-white transition-all hover:bg-zinc-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-zinc-200",
                        disabled: l || !n.name,
                        children: l
                          ? (0, i.jsx)($e, {
                              size: 18,
                              className: "animate-spin",
                            })
                          : "Save Changes",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ],
        }),
        (0, i.jsx)("input", {
          type: "file",
          ref: d,
          className: "hidden",
          accept: "image/*",
          onChange: (f) => h(f, "avatar"),
        }),
        (0, i.jsx)("input", {
          type: "file",
          ref: m,
          className: "hidden",
          accept: "image/*",
          onChange: (f) => h(f, "cover"),
        }),
      ],
    }),
  });
}
function I0({ isOpen: s, onClose: e, community: t }) {
  const { addToast: a } = _e(),
    { currentUser: r } = pe(),
    [n, o] = (0, p.useState)([]),
    [l, c] = (0, p.useState)(!1),
    [d, m] = (0, p.useState)(""),
    [h, x] = (0, p.useState)("members"),
    [u, f] = (0, p.useState)(!1),
    g = r?.id === t?.creatorId,
    v = (0, p.useCallback)(
      async (j = "") => {
        if (t?.id) {
          (c(!0), f(!0));
          try {
            o(await ln(t.id, j));
          } catch (k) {
            (console.error("Failed to load members:", k),
              a("Failed to load members", "error"));
          } finally {
            c(!1);
          }
        }
      },
      [t?.id, a],
    );
  ((0, p.useEffect)(() => {
    s && t?.id ? v("") : (m(""), o([]), f(!1));
  }, [s, t?.id, v]),
    (0, p.useEffect)(() => {
      if (d.length >= 2) {
        const j = setTimeout(() => {
          v(d);
        }, 500);
        return () => clearTimeout(j);
      } else d.length === 0 && u && v("");
    }, [d, v, u]));
  const b = async (j, k) => {
      try {
        const S = k === "admin" ? "member" : "admin";
        (await cn(t.id, j, S),
          o((_) => _.map(($) => ($.userId === j ? { ...$, role: S } : $))),
          a(`Role updated to ${S}`));
      } catch {
        a("Failed to update role", "error");
      }
    },
    w = (0, p.useMemo)(
      () => n.filter((j) => j.role === "admin" || j.userId === t.creatorId),
      [n, t.creatorId],
    ),
    y = (0, p.useMemo)(
      () => n.filter((j) => j.role !== "admin" && j.userId !== t.creatorId),
      [n, t.creatorId],
    ),
    z = (j) =>
      l
        ? (0, i.jsx)("div", {
            className: "flex items-center justify-center py-20",
            children: (0, i.jsx)($e, {
              className: "animate-spin text-violet-500",
              size: 32,
            }),
          })
        : j.length > 0
          ? (0, i.jsx)("div", {
              className: "divide-y divide-zinc-100 dark:divide-zinc-800/50",
              children: j.map((k) =>
                (0, i.jsxs)(
                  "div",
                  {
                    className:
                      "flex items-center justify-between p-4 transition-colors hover:bg-white dark:hover:bg-zinc-800/50",
                    children: [
                      (0, i.jsxs)("div", {
                        className: "flex items-center gap-3",
                        children: [
                          (0, i.jsxs)(ne, {
                            className:
                              "size-10 border border-zinc-200 shadow-sm dark:border-zinc-700",
                            children: [
                              (0, i.jsx)(oe, { src: k.user.avatar_url }),
                              (0, i.jsx)(me, {
                                children: k.user.username?.[0]?.toUpperCase(),
                              }),
                            ],
                          }),
                          (0, i.jsxs)("div", {
                            className: "min-w-0 flex flex-col",
                            children: [
                              (0, i.jsxs)("div", {
                                className: "flex items-center gap-1",
                                children: [
                                  (0, i.jsx)("span", {
                                    className: "font-bold dark:text-zinc-200",
                                    children: k.user.name,
                                  }),
                                  k.user.is_verified &&
                                    (0, i.jsx)(ar, {
                                      size: 14,
                                      className: "text-blue-500",
                                    }),
                                ],
                              }),
                              (0, i.jsxs)("span", {
                                className: "text-xs font-medium text-zinc-500",
                                children: ["@", k.user.username],
                              }),
                            ],
                          }),
                        ],
                      }),
                      (0, i.jsxs)("div", {
                        className: "flex items-center gap-2",
                        children: [
                          k.userId === t.creatorId
                            ? (0, i.jsx)("span", {
                                className:
                                  "rounded-full bg-zinc-200 px-3 py-1 text-[10px] font-black tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                                children: "OWNER",
                              })
                            : g &&
                              (0, i.jsx)("button", {
                                onClick: () => b(k.userId, k.role),
                                className: `flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all ${k.role === "admin" ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"}`,
                                children:
                                  k.role === "admin"
                                    ? (0, i.jsxs)(i.Fragment, {
                                        children: [
                                          (0, i.jsx)(_s, { size: 14 }),
                                          "Admin",
                                        ],
                                      })
                                    : (0, i.jsxs)(i.Fragment, {
                                        children: [
                                          (0, i.jsx)(ft, { size: 14 }),
                                          "Make Admin",
                                        ],
                                      }),
                              }),
                          !g &&
                            k.role === "admin" &&
                            k.userId !== t.creatorId &&
                            (0, i.jsx)("span", {
                              className:
                                "rounded-full bg-violet-50 px-3 py-1 text-[10px] font-black tracking-wider text-violet-600 dark:bg-violet-900/20 dark:text-violet-400",
                              children: "ADMIN",
                            }),
                        ],
                      }),
                    ],
                  },
                  k.userId,
                ),
              ),
            })
          : (0, i.jsxs)("div", {
              className:
                "flex flex-col items-center justify-center px-6 py-20 text-center",
              children: [
                (0, i.jsx)("div", {
                  className:
                    "mb-3 flex size-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800",
                  children: (0, i.jsx)(ft, {
                    size: 24,
                    className: "text-zinc-400",
                  }),
                }),
                (0, i.jsxs)("p", {
                  className: "text-sm font-bold dark:text-white",
                  children: ["No ", h, " found"],
                }),
                (0, i.jsx)("p", {
                  className: "mt-1 text-xs text-zinc-500",
                  children: "Try a different search term",
                }),
              ],
            });
  return (0, i.jsx)(Ae, {
    isOpen: s,
    onClose: e,
    title: "Manage Members",
    className: "sm:max-w-md",
    children: (0, i.jsxs)("div", {
      className: "space-y-4",
      children: [
        (0, i.jsxs)("div", {
          className: "relative",
          children: [
            (0, i.jsx)(vt, {
              className:
                "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400",
              size: 18,
            }),
            (0, i.jsx)("input", {
              type: "text",
              placeholder: "Search members...",
              className:
                "w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2.5 text-sm font-medium outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-900",
              value: d,
              onChange: (j) => m(j.target.value),
            }),
          ],
        }),
        (0, i.jsxs)(Zl, {
          value: h,
          onValueChange: x,
          className: "w-full",
          children: [
            (0, i.jsxs)(sr, {
              className:
                "h-11 w-full rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900",
              children: [
                (0, i.jsxs)(Pt, {
                  value: "members",
                  className:
                    "flex-1 rounded-lg font-bold data-[state=active]:bg-white dark:text-zinc-400 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white",
                  children: ["Members (", y.length, ")"],
                }),
                (0, i.jsxs)(Pt, {
                  value: "admins",
                  className:
                    "flex-1 rounded-lg font-bold data-[state=active]:bg-white dark:text-zinc-400 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-white",
                  children: ["Admins (", w.length, ")"],
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className:
                "max-h-[400px] min-h-[300px] mt-4 overflow-y-auto overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900",
              children: [
                (0, i.jsx)(Et, {
                  value: "members",
                  className: "m-0",
                  children: z(y),
                }),
                (0, i.jsx)(Et, {
                  value: "admins",
                  className: "m-0",
                  children: z(w),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
var Mc = ({ isOpen: s, onClose: e, onCreated: t }) => {
    const { currentUser: a } = pe(),
      { addToast: r } = _e(),
      n = Ie(),
      [o, l] = (0, p.useState)(""),
      [c, d] = (0, p.useState)(null),
      [m, h] = (0, p.useState)(""),
      [x, u] = (0, p.useState)([]),
      [f, g] = (0, p.useState)([]),
      [v, b] = (0, p.useState)(!1),
      [w, y] = (0, p.useState)(!1),
      z = (0, p.useRef)(null),
      j = async (_) => {
        if ((h(_), _.length < 2)) {
          u([]);
          return;
        }
        y(!0);
        try {
          u((await ua(_)).filter(($) => $.id !== a?.id));
        } catch ($) {
          console.error("Search failed:", $);
        } finally {
          y(!1);
        }
      },
      k = (_) => {
        f.find(($) => $.id === _.id)
          ? g(($) => $.filter((I) => I.id !== _.id))
          : g(($) => [...$, _]);
      },
      S = async () => {
        if (!(!a || !o.trim() || f.length === 0)) {
          b(!0);
          try {
            let _ = null;
            c && (_ = (await Te(c)).url);
            const $ = f.map((A) => A.id),
              I = await Qi(a.id, o, $, _);
            (n.invalidateQueries({ queryKey: ["conversations", a.id] }),
              r("Group created successfully!"),
              t(I),
              e(),
              l(""),
              g([]),
              d(null),
              h(""));
          } catch (_) {
            (console.error("Failed to create group:", _),
              r("Failed to create group", "error"));
          } finally {
            b(!1);
          }
        }
      };
    return (0, i.jsx)(Ae, {
      isOpen: s,
      onClose: e,
      title: "Create New Group",
      className: "sm:max-w-md",
      children: (0, i.jsxs)("div", {
        className: "px-6 pb-6 pt-8 space-y-8",
        children: [
          (0, i.jsxs)("div", {
            className: "flex flex-col items-center gap-4",
            children: [
              (0, i.jsxs)("div", {
                className: "group relative cursor-pointer",
                onClick: () => z.current?.click(),
                children: [
                  (0, i.jsx)(ne, {
                    className:
                      "size-20 border-2 border-zinc-100 dark:border-zinc-800 shadow-md",
                    children: c
                      ? (0, i.jsx)(oe, {
                          src: URL.createObjectURL(c),
                          className: "object-cover",
                        })
                      : (0, i.jsx)("div", {
                          className:
                            "flex size-full items-center justify-center bg-zinc-50 dark:bg-zinc-900",
                          children: (0, i.jsx)(St, {
                            size: 32,
                            className: "text-zinc-300",
                          }),
                        }),
                  }),
                  (0, i.jsx)("div", {
                    className:
                      "absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100",
                    children: (0, i.jsx)(ht, {
                      size: 20,
                      className: "text-white",
                    }),
                  }),
                  (0, i.jsx)("input", {
                    type: "file",
                    ref: z,
                    className: "hidden",
                    accept: "image/*",
                    onChange: (_) => d(_.target.files?.[0] || null),
                  }),
                ],
              }),
              (0, i.jsx)("span", {
                className:
                  "text-xs font-bold text-zinc-400 uppercase tracking-widest",
                children: "Group Avatar",
              }),
            ],
          }),
          (0, i.jsxs)("div", {
            className: "space-y-6",
            children: [
              (0, i.jsx)(Xe, {
                label: "Group Name",
                placeholder: "Team Discussion, Weekend Plans...",
                value: o,
                onChange: (_) => l(_.target.value),
              }),
              (0, i.jsxs)("div", {
                className: "space-y-2",
                children: [
                  (0, i.jsx)("label", {
                    className: "text-sm font-bold text-zinc-500 ml-1",
                    children: "Add Members",
                  }),
                  (0, i.jsxs)("div", {
                    className: "relative",
                    children: [
                      (0, i.jsx)(vt, {
                        className:
                          "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400",
                        size: 16,
                      }),
                      (0, i.jsx)("input", {
                        type: "text",
                        value: m,
                        onChange: (_) => j(_.target.value),
                        placeholder: "Search people...",
                        className:
                          "w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-950",
                      }),
                    ],
                  }),
                ],
              }),
              f.length > 0 &&
                (0, i.jsx)("div", {
                  className: "flex flex-wrap gap-2 py-1",
                  children: f.map((_) =>
                    (0, i.jsxs)(
                      "div",
                      {
                        className:
                          "flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2.5 py-1 text-xs font-bold text-violet-600 dark:bg-violet-500/20",
                        children: [
                          (0, i.jsxs)(ne, {
                            className: "size-4",
                            children: [
                              (0, i.jsx)(oe, { src: _.avatar }),
                              (0, i.jsx)(me, { children: _.name[0] }),
                            ],
                          }),
                          (0, i.jsx)("span", { children: _.name }),
                          (0, i.jsx)("button", {
                            onClick: () => k(_),
                            className: "hover:text-violet-800",
                            children: (0, i.jsx)(et, { size: 12 }),
                          }),
                        ],
                      },
                      _.id,
                    ),
                  ),
                }),
              (0, i.jsx)("div", {
                className: "max-h-[240px] space-y-1 overflow-y-auto pr-1",
                children: w
                  ? (0, i.jsx)("div", {
                      className: "py-4 text-center text-xs text-zinc-500",
                      children: "Searching...",
                    })
                  : m.length >= 2 && x.length === 0
                    ? (0, i.jsx)("div", {
                        className: "py-4 text-center text-xs text-zinc-500",
                        children: "No users found",
                      })
                    : x.map((_) => {
                        const $ = f.find((I) => I.id === _.id);
                        return (0, i.jsxs)(
                          "div",
                          {
                            onClick: () => k(_),
                            className: E(
                              "flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors",
                              $
                                ? "bg-violet-50 dark:bg-violet-900/20"
                                : "hover:bg-zinc-50 dark:hover:bg-zinc-900",
                            ),
                            children: [
                              (0, i.jsxs)(ne, {
                                className: "size-9",
                                children: [
                                  (0, i.jsx)(oe, { src: _.avatar }),
                                  (0, i.jsx)(me, { children: _.name[0] }),
                                ],
                              }),
                              (0, i.jsxs)("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                  (0, i.jsx)("div", {
                                    className: "truncate text-sm font-bold",
                                    children: _.name,
                                  }),
                                  (0, i.jsxs)("div", {
                                    className: "truncate text-xs text-zinc-500",
                                    children: ["@", _.handle],
                                  }),
                                ],
                              }),
                              (0, i.jsx)("div", {
                                className: E(
                                  "flex size-5 items-center justify-center rounded-full border-2 transition-all",
                                  $
                                    ? "border-violet-500 bg-violet-500 text-white"
                                    : "border-zinc-200 dark:border-zinc-700",
                                ),
                                children:
                                  $ &&
                                  (0, i.jsx)(xt, { size: 12, strokeWidth: 3 }),
                              }),
                            ],
                          },
                          _.id,
                        );
                      }),
              }),
            ],
          }),
          (0, i.jsxs)(J, {
            className: "w-full py-3",
            onClick: S,
            loading: v,
            disabled: !o.trim() || f.length === 0,
            children: [
              (0, i.jsx)(St, { className: "mr-2", size: 18 }),
              "Create Group",
            ],
          }),
        ],
      }),
    });
  },
  A0 = Mc,
  Rc = ({ isOpen: s, onClose: e, conversation: t, onUpdate: a }) => {
    const { currentUser: r } = pe(),
      { addToast: n } = _e(),
      o = Ie(),
      l = ye(),
      [c, d] = (0, p.useState)(t.name || ""),
      [m, h] = (0, p.useState)(!1),
      [x, u] = (0, p.useState)(""),
      [f, g] = (0, p.useState)([]),
      [v, b] = (0, p.useState)(!1),
      w = (0, p.useRef)(null),
      y = r?.id === t.creatorId,
      { data: z = [], isLoading: j } = Le({
        queryKey: ["conversation-participants", t.id],
        queryFn: () => en(t.id),
        enabled: s && !!t.id,
        staleTime: 1e3 * 60,
      }),
      k = we({
        mutationFn: (C) => tn(t.id, C),
        onSuccess: (C) => {
          (a(C),
            o.invalidateQueries({ queryKey: ["conversations", r?.id] }),
            n("Group updated!"));
        },
        onError: (C) => {
          n(C.message || "Update failed", "error");
        },
      }),
      S = we({
        mutationFn: (C) => Yi(t.id, [C]),
        onSuccess: () => {
          (o.invalidateQueries({
            queryKey: ["conversation-participants", t.id],
          }),
            n("Member added!"),
            u(""),
            g([]));
        },
        onError: () => n("Failed to add member", "error"),
      }),
      _ = we({
        mutationFn: () => Xi(t.id, r.id),
        onSuccess: () => {
          (o.invalidateQueries({ queryKey: ["conversations", r?.id] }),
            e(),
            n("You left the group."),
            l("/m"));
        },
        onError: () => n("Failed to leave group", "error"),
      }),
      $ = we({
        mutationFn: () => ha(t.id),
        onSuccess: () => {
          (o.invalidateQueries({ queryKey: ["conversations", r?.id] }),
            e(),
            n("Group deleted."),
            l("/m"));
        },
        onError: () => n("Failed to delete group", "error"),
      });
    p.useEffect(() => {
      s && (d(t.name || ""), h(!1), u(""), g([]));
    }, [s, t.id, t.name]);
    const I = async (C) => {
        if ((u(C), C.length < 2)) {
          g([]);
          return;
        }
        b(!0);
        try {
          const T = await ua(C),
            V = z.map((W) => W.id);
          g(T.filter((W) => !V.includes(W.id)));
        } catch (T) {
          console.error("Search failed:", T);
        } finally {
          b(!1);
        }
      },
      A = async (C) => {
        const T = C.target.files?.[0];
        if (!(!T || !y))
          try {
            const V = await Te(T);
            k.mutate({ avatar_url: V.url });
          } catch (V) {
            (console.error("Upload failed:", V),
              n("Failed to update avatar", "error"));
          }
      },
      R = () => {
        !c.trim() || c === t.name || !y || k.mutate({ name: c.trim() });
      },
      M = () => {
        !window.confirm("Are you sure you want to leave this group?") ||
          !r ||
          _.mutate();
      },
      P = () => {
        y &&
          window.confirm(
            "Are you sure you want to delete this group? All messages and media will be removed forever.",
          ) &&
          $.mutate();
      };
    return (0, i.jsx)(Ae, {
      isOpen: s,
      onClose: e,
      title: "Group Info",
      className: "sm:max-w-md",
      children: (0, i.jsx)("div", {
        className: "flex-1 overflow-y-auto p-6 scrollbar-none",
        children: (0, i.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, i.jsxs)("div", {
              className:
                "flex flex-col items-center gap-4 border-b border-zinc-100 pb-6 dark:border-zinc-800",
              children: [
                (0, i.jsxs)("div", {
                  className: "group relative",
                  children: [
                    (0, i.jsxs)(ne, {
                      className:
                        "size-24 border-4 border-white shadow-xl dark:border-zinc-900",
                      children: [
                        (0, i.jsx)(oe, {
                          src: t.avatar,
                          className: "object-cover",
                        }),
                        (0, i.jsx)(me, {
                          className:
                            "text-2xl font-black bg-zinc-100 text-zinc-400 dark:bg-zinc-800",
                          children: t.name?.[0]?.toUpperCase() || "?",
                        }),
                      ],
                    }),
                    y &&
                      (0, i.jsx)("button", {
                        onClick: () => w.current?.click(),
                        className:
                          "absolute bottom-0 right-0 rounded-full bg-violet-600 p-2 text-white shadow-lg transition-transform hover:scale-110 active:scale-95",
                        children: (0, i.jsx)(ht, { size: 16 }),
                      }),
                    (0, i.jsx)("input", {
                      type: "file",
                      ref: w,
                      className: "hidden",
                      accept: "image/*",
                      onChange: A,
                    }),
                  ],
                }),
                (0, i.jsx)("div", {
                  className: "w-full space-y-3 text-center",
                  children: y
                    ? (0, i.jsxs)("div", {
                        className: "flex gap-2",
                        children: [
                          (0, i.jsx)(Xe, {
                            value: c,
                            onChange: (C) => d(C.target.value),
                            placeholder: "Group name",
                            className: "h-10",
                          }),
                          (0, i.jsx)(J, {
                            size: "sm",
                            onClick: R,
                            loading: k.isPending,
                            disabled: c === t.name,
                            children: "Save",
                          }),
                        ],
                      })
                    : (0, i.jsx)("h3", {
                        className: "text-xl font-black dark:text-white",
                        children: t.name,
                      }),
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className: "space-y-4",
              children: [
                (0, i.jsxs)("div", {
                  className: "flex items-center justify-between px-1",
                  children: [
                    (0, i.jsxs)("h4", {
                      className:
                        "text-sm font-bold uppercase tracking-wider text-zinc-500",
                      children: ["Members · ", z.length],
                    }),
                    y &&
                      (0, i.jsx)("button", {
                        onClick: () => h(!m),
                        className: E(
                          "flex items-center gap-1.5 text-xs font-bold transition-colors",
                          m
                            ? "text-rose-500"
                            : "text-violet-600 hover:text-violet-700",
                        ),
                        children: m
                          ? (0, i.jsxs)(i.Fragment, {
                              children: [
                                (0, i.jsx)(et, { size: 14 }),
                                "Cancel",
                              ],
                            })
                          : (0, i.jsxs)(i.Fragment, {
                              children: [
                                (0, i.jsx)(Ir, { size: 14 }),
                                "Add Member",
                              ],
                            }),
                      }),
                  ],
                }),
                m &&
                  y &&
                  (0, i.jsxs)("div", {
                    className:
                      "space-y-3 animate-in slide-in-from-top-2 duration-200",
                    children: [
                      (0, i.jsxs)("div", {
                        className: "relative",
                        children: [
                          (0, i.jsx)(vt, {
                            className:
                              "absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400",
                            size: 16,
                          }),
                          (0, i.jsx)("input", {
                            type: "text",
                            value: x,
                            onChange: (C) => I(C.target.value),
                            placeholder: "Search people to add...",
                            className:
                              "w-full rounded-xl border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-800 dark:bg-zinc-950",
                          }),
                        ],
                      }),
                      f.length > 0 &&
                        (0, i.jsx)("div", {
                          className:
                            "max-h-[200px] overflow-y-auto rounded-xl border border-zinc-100 bg-zinc-50/50 p-1 dark:border-zinc-800 dark:bg-zinc-900/50",
                          children: f.map((C) =>
                            (0, i.jsxs)(
                              "div",
                              {
                                className:
                                  "flex items-center justify-between p-2 rounded-lg hover:bg-white dark:hover:bg-zinc-800 transition-colors",
                                children: [
                                  (0, i.jsxs)("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                      (0, i.jsxs)(ne, {
                                        className: "size-8",
                                        children: [
                                          (0, i.jsx)(oe, { src: C.avatar }),
                                          (0, i.jsx)(me, {
                                            children: C.name[0],
                                          }),
                                        ],
                                      }),
                                      (0, i.jsxs)("div", {
                                        className: "min-w-0",
                                        children: [
                                          (0, i.jsx)("div", {
                                            className:
                                              "truncate text-xs font-bold",
                                            children: C.name,
                                          }),
                                          (0, i.jsxs)("div", {
                                            className:
                                              "truncate text-[10px] text-zinc-500",
                                            children: ["@", C.handle],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  (0, i.jsx)("button", {
                                    disabled: S.isPending,
                                    onClick: () => S.mutate(C.id),
                                    className:
                                      "rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold text-white transition-all hover:bg-violet-700 active:scale-95 disabled:opacity-50",
                                    children: S.isPending ? "Adding..." : "Add",
                                  }),
                                ],
                              },
                              C.id,
                            ),
                          ),
                        }),
                      v &&
                        (0, i.jsx)("div", {
                          className: "py-2 text-center text-xs text-zinc-400",
                          children: "Searching...",
                        }),
                    ],
                  }),
                (0, i.jsx)("div", {
                  className: "space-y-1",
                  children: j
                    ? (0, i.jsx)("div", {
                        className: "py-8 text-center text-zinc-400",
                        children: "Loading members...",
                      })
                    : z.map((C) =>
                        (0, i.jsxs)(
                          "div",
                          {
                            className:
                              "flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900",
                            children: [
                              (0, i.jsxs)(ne, {
                                className: "size-10",
                                children: [
                                  (0, i.jsx)(oe, {
                                    src: C.avatar_url,
                                    className: "object-cover",
                                  }),
                                  (0, i.jsx)(me, {
                                    children: C.display_name?.[0],
                                  }),
                                ],
                              }),
                              (0, i.jsxs)("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                  (0, i.jsxs)("div", {
                                    className: "flex items-center gap-1.5",
                                    children: [
                                      (0, i.jsx)("span", {
                                        className: "truncate text-sm font-bold",
                                        children: C.display_name,
                                      }),
                                      C.id === t.creatorId &&
                                        (0, i.jsx)(_s, {
                                          size: 12,
                                          className: "text-violet-500",
                                        }),
                                    ],
                                  }),
                                  (0, i.jsxs)("div", {
                                    className: "truncate text-xs text-zinc-500",
                                    children: ["@", C.username],
                                  }),
                                ],
                              }),
                              C.id === r?.id &&
                                (0, i.jsx)("span", {
                                  className:
                                    "rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:bg-zinc-800",
                                  children: "You",
                                }),
                            ],
                          },
                          C.id,
                        ),
                      ),
                }),
              ],
            }),
            (0, i.jsxs)("div", {
              className: "flex flex-col gap-2 pt-2 pb-2",
              children: [
                (0, i.jsxs)(J, {
                  variant: "outline",
                  className:
                    "w-full justify-start text-zinc-600 dark:text-zinc-400",
                  onClick: M,
                  loading: _.isPending,
                  children: [
                    (0, i.jsx)(ai, { size: 18, className: "mr-2" }),
                    "Leave Group",
                  ],
                }),
                y &&
                  (0, i.jsxs)(J, {
                    variant: "ghost",
                    className:
                      "w-full justify-start text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20",
                    onClick: P,
                    loading: $.isPending,
                    children: [
                      (0, i.jsx)(xs, { size: 18, className: "mr-2" }),
                      "Delete Group",
                    ],
                  }),
                " ",
              ],
            }),
          ],
        }),
      }),
    });
  },
  q0 = Rc,
  Lc = ({ isOpen: s, onClose: e, user: t, conversationId: a }) => {
    const r = ye(),
      { addToast: n } = _e(),
      o = Ie(),
      [l, c] = p.useState(!1);
    if (!t) return null;
    const d = () => {
        (e(), r(`/u/${t.handle}`));
      },
      m = async () => {
        if (
          window.confirm(
            "Are you sure you want to delete this entire conversation? This cannot be undone.",
          )
        ) {
          c(!0);
          try {
            (await ha(a),
              o.invalidateQueries({ queryKey: ["conversations"] }),
              n("Conversation deleted."),
              e(),
              r("/m"));
          } catch (h) {
            (console.error("Delete failed:", h),
              n("Failed to delete conversation", "error"));
          } finally {
            c(!1);
          }
        }
      };
    return (0, i.jsx)(Ae, {
      isOpen: s,
      onClose: e,
      title: "Chat Details",
      className: "sm:max-w-md",
      children: (0, i.jsx)("div", {
        className: "flex-1 overflow-y-auto p-6 scrollbar-none",
        children: (0, i.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, i.jsxs)("div", {
              className:
                "flex flex-col items-center gap-4 border-b border-zinc-100 pb-6 dark:border-zinc-800",
              children: [
                (0, i.jsxs)(ne, {
                  className:
                    "size-24 border-4 border-white shadow-xl dark:border-zinc-900",
                  children: [
                    (0, i.jsx)(oe, {
                      src: t.avatar,
                      className: "object-cover",
                    }),
                    (0, i.jsx)(me, {
                      className:
                        "text-2xl font-black bg-zinc-100 text-zinc-400 dark:bg-zinc-800",
                      children: t.name?.[0]?.toUpperCase(),
                    }),
                  ],
                }),
                (0, i.jsxs)("div", {
                  className: "text-center space-y-1",
                  children: [
                    (0, i.jsx)("h3", {
                      className: "text-xl font-black dark:text-white",
                      children: t.name,
                    }),
                    (0, i.jsxs)("p", {
                      className: "text-sm font-medium text-zinc-500",
                      children: ["@", t.handle],
                    }),
                  ],
                }),
                (0, i.jsxs)(J, {
                  variant: "secondary",
                  size: "sm",
                  className: "rounded-full",
                  onClick: d,
                  children: [
                    (0, i.jsx)(ft, { size: 16, className: "mr-2" }),
                    "View Profile",
                  ],
                }),
              ],
            }),
            (t.bio || t.location || t.website) &&
              (0, i.jsxs)("div", {
                className: "space-y-3 px-1",
                children: [
                  (0, i.jsx)("h4", {
                    className:
                      "text-xs font-bold uppercase tracking-wider text-zinc-400",
                    children: "About",
                  }),
                  (0, i.jsxs)("div", {
                    className: "space-y-2",
                    children: [
                      t.bio &&
                        (0, i.jsx)("p", {
                          className: "text-sm text-zinc-600 dark:text-zinc-300",
                          children: t.bio,
                        }),
                      (0, i.jsxs)("div", {
                        className: "flex flex-wrap gap-x-4 gap-y-2",
                        children: [
                          t.location &&
                            (0, i.jsxs)("div", {
                              className:
                                "flex items-center gap-1 text-xs text-zinc-500",
                              children: [
                                (0, i.jsx)(ci, { size: 14 }),
                                t.location,
                              ],
                            }),
                          t.website &&
                            (0, i.jsxs)("a", {
                              href: t.website.startsWith("http")
                                ? t.website
                                : `https://${t.website}`,
                              target: "_blank",
                              rel: "noopener noreferrer",
                              className:
                                "flex items-center gap-1 text-xs text-violet-600 hover:underline",
                              children: [
                                (0, i.jsx)(ei, { size: 14 }),
                                t.website.replace(/^https?:\/\//, ""),
                              ],
                            }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            (0, i.jsxs)("div", {
              className: "space-y-2 pt-2",
              children: [
                (0, i.jsx)("h4", {
                  className:
                    "text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2",
                  children: "Privacy & Support",
                }),
                (0, i.jsxs)("button", {
                  className:
                    "flex w-full items-center justify-between rounded-xl p-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900",
                  children: [
                    (0, i.jsxs)("div", {
                      className: "flex items-center gap-3",
                      children: [
                        (0, i.jsx)("div", {
                          className:
                            "rounded-full bg-zinc-100 p-2 dark:bg-zinc-800 text-zinc-500",
                          children: (0, i.jsx)(Gr, { size: 18 }),
                        }),
                        (0, i.jsxs)("span", {
                          children: ["Block @", t.handle],
                        }),
                      ],
                    }),
                    (0, i.jsx)(Vt, { size: 14, className: "text-zinc-400" }),
                  ],
                }),
                (0, i.jsxs)("button", {
                  className:
                    "flex w-full items-center justify-between rounded-xl p-3 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-900",
                  children: [
                    (0, i.jsxs)("div", {
                      className: "flex items-center gap-3",
                      children: [
                        (0, i.jsx)("div", {
                          className:
                            "rounded-full bg-zinc-100 p-2 dark:bg-zinc-800 text-zinc-500",
                          children: (0, i.jsx)(fi, { size: 18 }),
                        }),
                        (0, i.jsx)("span", { children: "Report User" }),
                      ],
                    }),
                    (0, i.jsx)(Vt, { size: 14, className: "text-zinc-400" }),
                  ],
                }),
                (0, i.jsx)("div", {
                  className:
                    "pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-2 pb-2",
                  children: (0, i.jsxs)(J, {
                    variant: "ghost",
                    className:
                      "w-full justify-start text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20",
                    onClick: m,
                    loading: l,
                    children: [
                      (0, i.jsx)(xs, { size: 18, className: "mr-2" }),
                      "Delete Chat",
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
      }),
    });
  },
  F0 = Lc,
  Tc = ({
    isOpen: s,
    onClose: e,
    editProfileData: t,
    setEditProfileData: a,
  }) => {
    const { updateProfile: r } = pe(),
      { addToast: n } = _e(),
      [o, l] = (0, p.useState)(!1),
      [c, d] = (0, p.useState)(null),
      [m, h] = (0, p.useState)(null),
      x = (0, p.useRef)(null),
      u = (0, p.useRef)(null),
      f = (v, b) => {
        const w = v.target.files?.[0];
        w && (b === "avatar" ? d(w) : h(w));
      },
      g = async () => {
        l(!0);
        try {
          let v = t.avatar,
            b = t.cover;
          (c && (v = (await Te(c)).url),
            m && (b = (await Te(m)).url),
            await r({ ...t, avatar: v, cover: b }),
            d(null),
            h(null),
            e(),
            n("Profile updated!"));
        } catch (v) {
          (console.error("Failed to update profile:", v),
            n("Failed to update profile.", "error"));
        } finally {
          l(!1);
        }
      };
    return (0, i.jsx)(i.Fragment, {
      children: (0, i.jsx)(Ae, {
        isOpen: s,
        onClose: () => !o && e(),
        title: "Edit Profile",
        children: (0, i.jsxs)("div", {
          className: "space-y-6",
          children: [
            (0, i.jsx)("input", {
              type: "file",
              ref: u,
              className: "hidden",
              accept: "image/*",
              onChange: (v) => f(v, "cover"),
            }),
            (0, i.jsx)("input", {
              type: "file",
              ref: x,
              className: "hidden",
              accept: "image/*",
              onChange: (v) => f(v, "avatar"),
            }),
            (0, i.jsxs)("div", {
              className:
                "group relative h-32 cursor-pointer overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800",
              onClick: () => u.current?.click(),
              children: [
                (m || t?.cover) &&
                  (0, i.jsx)("img", {
                    src: m ? URL.createObjectURL(m) : t.cover,
                    className: "h-full w-full object-cover opacity-60",
                    alt: "",
                  }),
                (0, i.jsx)("div", {
                  className:
                    "absolute inset-0 flex items-center justify-center",
                  children: (0, i.jsx)("div", {
                    className:
                      "rounded-full bg-black/50 p-2 text-white transition-transform group-hover:scale-110",
                    children: (0, i.jsx)($t, { size: 20 }),
                  }),
                }),
              ],
            }),
            (0, i.jsx)("div", {
              className: "relative -mt-16 ml-4",
              children: (0, i.jsxs)("div", {
                className:
                  "group relative size-24 cursor-pointer overflow-hidden rounded-full border-4 border-white bg-white shadow-lg dark:border-black dark:bg-black",
                onClick: () => x.current?.click(),
                children: [
                  (c || t?.avatar) &&
                    (0, i.jsxs)(ne, {
                      className: "size-full rounded-none opacity-60",
                      children: [
                        (0, i.jsx)(oe, {
                          src: c ? URL.createObjectURL(c) : t.avatar,
                          className: "object-cover",
                        }),
                        (0, i.jsx)(me, {
                          children: t?.handle?.[0]?.toUpperCase(),
                        }),
                      ],
                    }),
                  (0, i.jsx)("div", {
                    className:
                      "absolute inset-0 flex items-center justify-center",
                    children: (0, i.jsx)("div", {
                      className:
                        "rounded-full bg-black/50 p-2 text-white transition-transform group-hover:scale-110",
                      children: (0, i.jsx)($t, { size: 16 }),
                    }),
                  }),
                ],
              }),
            }),
            (0, i.jsxs)("div", {
              className: "space-y-4",
              children: [
                (0, i.jsx)(Xe, {
                  label: "Name",
                  value: t?.name || "",
                  onChange: (v) => a({ ...t, name: v.target.value }),
                }),
                (0, i.jsx)(Xe, {
                  label: "Bio",
                  textarea: !0,
                  value: t?.bio || "",
                  onChange: (v) => a({ ...t, bio: v.target.value }),
                }),
                (0, i.jsx)(Xe, {
                  label: "Location",
                  value: t?.location || "",
                  onChange: (v) => a({ ...t, location: v.target.value }),
                }),
                (0, i.jsx)(Xe, {
                  label: "Website",
                  value: t?.website || "",
                  onChange: (v) => a({ ...t, website: v.target.value }),
                }),
              ],
            }),
            (0, i.jsx)(J, {
              className: "w-full py-3",
              loading: o,
              onClick: g,
              children: "Save changes",
            }),
          ],
        }),
      }),
    });
  },
  Ic = Tc,
  Ac = H(),
  qc = (s) => {
    const e = (0, Ac.c)(7),
      {
        isEditProfileOpen: t,
        setIsEditProfileOpen: a,
        editProfileData: r,
        setEditProfileData: n,
      } = s;
    let o;
    e[0] !== a ? ((o = () => a(!1)), (e[0] = a), (e[1] = o)) : (o = e[1]);
    let l;
    return (
      e[2] !== r || e[3] !== t || e[4] !== n || e[5] !== o
        ? ((l = (0, i.jsx)(i.Fragment, {
            children: (0, i.jsx)(Ic, {
              isOpen: t,
              onClose: o,
              editProfileData: r,
              setEditProfileData: n,
            }),
          })),
          (e[2] = r),
          (e[3] = t),
          (e[4] = n),
          (e[5] = o),
          (e[6] = l))
        : (l = e[6]),
      l
    );
  },
  Fc = qc,
  Dc = H(),
  Hc = (s) => {
    const e = (0, Dc.c)(91),
      { story: t, onClose: a } = s,
      [r, n] = (0, p.useState)(0),
      [o, l] = (0, p.useState)(0),
      [c, d] = (0, p.useState)(!1),
      m = t.stories,
      h = m[r];
    let x;
    e[0] !== r || e[1] !== a || e[2] !== m.length || e[3] !== t.user.id
      ? ((x = () => {
          r < m.length - 1 ? (n(Oc), l(0)) : a(t.user.id);
        }),
        (e[0] = r),
        (e[1] = a),
        (e[2] = m.length),
        (e[3] = t.user.id),
        (e[4] = x))
      : (x = e[4]);
    const u = x;
    let f;
    e[5] !== r
      ? ((f = () => {
          r > 0 && (n(Bc), l(0));
        }),
        (e[5] = r),
        (e[6] = f))
      : (f = e[6]);
    const g = f;
    let v;
    e[7] === Symbol.for("react.memo_cache_sentinel")
      ? ((v = (ee) => {
          (ee.stopPropagation(), d(Wc));
        }),
        (e[7] = v))
      : (v = e[7]);
    const b = v;
    let w;
    e[8] !== u || e[9] !== c
      ? ((w = () => {
          if (c) return;
          const ee = setInterval(() => {
            l((ze) => (ze >= 100 ? (u(), 100) : ze + 1));
          }, 50);
          return () => clearInterval(ee);
        }),
        (e[8] = u),
        (e[9] = c),
        (e[10] = w))
      : (w = e[10]);
    let y;
    (e[11] !== r || e[12] !== u || e[13] !== c
      ? ((y = [u, r, c]), (e[11] = r), (e[12] = u), (e[13] = c), (e[14] = y))
      : (y = e[14]),
      (0, p.useEffect)(w, y));
    let z;
    if (e[15] !== r || e[16] !== o || e[17] !== m) {
      let ee;
      (e[19] !== r || e[20] !== o
        ? ((ee = (ze, Me) =>
            (0, i.jsx)(
              "div",
              {
                className:
                  "h-full flex-1 overflow-hidden rounded-full bg-white/30",
                children: (0, i.jsx)("div", {
                  className: "h-full bg-white transition-all duration-100",
                  style: { width: Me < r ? "100%" : Me === r ? `${o}%` : "0%" },
                }),
              },
              Me,
            )),
          (e[19] = r),
          (e[20] = o),
          (e[21] = ee))
        : (ee = e[21]),
        (z = m.map(ee)),
        (e[15] = r),
        (e[16] = o),
        (e[17] = m),
        (e[18] = z));
    } else z = e[18];
    let j;
    e[22] !== z
      ? ((j = (0, i.jsx)("div", {
          className: "flex h-0.5 w-full gap-1.5 bg-transparent",
          children: z,
        })),
        (e[22] = z),
        (e[23] = j))
      : (j = e[23]);
    const k = `/u/${t.user.handle}`;
    let S;
    e[24] !== t.user.avatar || e[25] !== t.user.handle
      ? ((S = (0, i.jsx)(oe, {
          src: t.user.avatar,
          alt: t.user.handle,
          className: "object-cover",
        })),
        (e[24] = t.user.avatar),
        (e[25] = t.user.handle),
        (e[26] = S))
      : (S = e[26]);
    let _;
    e[27] !== t.user.handle?.[0]
      ? ((_ = t.user.handle?.[0]?.toUpperCase()),
        (e[27] = t.user.handle?.[0]),
        (e[28] = _))
      : (_ = e[28]);
    let $;
    e[29] !== _
      ? (($ = (0, i.jsx)(me, { children: _ })), (e[29] = _), (e[30] = $))
      : ($ = e[30]);
    let I;
    e[31] !== $ || e[32] !== S
      ? ((I = (0, i.jsxs)(ne, {
          className: "size-10 border border-white/20 shadow-sm",
          children: [S, $],
        })),
        (e[31] = $),
        (e[32] = S),
        (e[33] = I))
      : (I = e[33]);
    let A;
    e[34] !== t.user.handle
      ? ((A = (0, i.jsx)("span", {
          className: "text-sm font-bold text-white shadow-black drop-shadow-md",
          children: t.user.handle,
        })),
        (e[34] = t.user.handle),
        (e[35] = A))
      : (A = e[35]);
    let R;
    e[36] !== h.created_at
      ? ((R = new Date(h.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })),
        (e[36] = h.created_at),
        (e[37] = R))
      : (R = e[37]);
    let M;
    e[38] !== R
      ? ((M = (0, i.jsx)("span", {
          className: "text-[10px] text-white/60 shadow-black drop-shadow-md",
          children: R,
        })),
        (e[38] = R),
        (e[39] = M))
      : (M = e[39]);
    let P;
    e[40] !== A || e[41] !== M
      ? ((P = (0, i.jsxs)("div", {
          className: "flex flex-col",
          children: [A, M],
        })),
        (e[40] = A),
        (e[41] = M),
        (e[42] = P))
      : (P = e[42]);
    let C;
    e[43] !== I || e[44] !== P || e[45] !== k
      ? ((C = (0, i.jsxs)(us, {
          to: k,
          className:
            "flex items-center gap-3 transition-opacity hover:opacity-80",
          onClick: Uc,
          children: [I, P],
        })),
        (e[43] = I),
        (e[44] = P),
        (e[45] = k),
        (e[46] = C))
      : (C = e[46]);
    let T;
    e[47] !== a || e[48] !== t.user.id
      ? ((T = () => a(t.user.id)),
        (e[47] = a),
        (e[48] = t.user.id),
        (e[49] = T))
      : (T = e[49]);
    let V;
    e[50] === Symbol.for("react.memo_cache_sentinel")
      ? ((V = (0, i.jsx)(et, { size: 24 })), (e[50] = V))
      : (V = e[50]);
    let W;
    e[51] !== T
      ? ((W = (0, i.jsx)("button", {
          onClick: T,
          className:
            "rounded-full p-2 text-white transition-colors hover:bg-white/10",
          children: V,
        })),
        (e[51] = T),
        (e[52] = W))
      : (W = e[52]);
    let B;
    e[53] !== C || e[54] !== W
      ? ((B = (0, i.jsxs)("div", {
          className: "flex items-center justify-between",
          children: [C, W],
        })),
        (e[53] = C),
        (e[54] = W),
        (e[55] = B))
      : (B = e[55]);
    let L;
    e[56] !== B || e[57] !== j
      ? ((L = (0, i.jsxs)("div", {
          className:
            "absolute left-0 right-0 top-0 z-20 flex flex-col gap-4 p-4",
          children: [j, B],
        })),
        (e[56] = B),
        (e[57] = j),
        (e[58] = L))
      : (L = e[58]);
    let q;
    e[59] !== r || e[60] !== g
      ? ((q =
          r > 0 &&
          (0, i.jsx)("button", {
            onClick: (ee) => {
              (ee.stopPropagation(), g());
            },
            className:
              "absolute left-4 z-30 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-black/40 active:scale-90",
            children: (0, i.jsx)(Ps, { size: 32 }),
          })),
        (e[59] = r),
        (e[60] = g),
        (e[61] = q))
      : (q = e[61]);
    let F;
    e[62] !== h.id || e[63] !== h.media
      ? ((F = (0, i.jsx)(
          "img",
          {
            src: h.media,
            className:
              "h-full max-h-full w-full animate-in fade-in zoom-in-95 object-contain rounded-xl shadow-2xl duration-300",
            alt: "",
          },
          h.id,
        )),
        (e[62] = h.id),
        (e[63] = h.media),
        (e[64] = F))
      : (F = e[64]);
    let U;
    e[65] !== c
      ? ((U =
          c &&
          (0, i.jsx)("div", {
            className:
              "pointer-events-none absolute inset-0 z-10 flex items-center justify-center",
            children: (0, i.jsx)("div", {
              className:
                "animate-in fade-in zoom-in rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-bold text-white backdrop-blur-md duration-200",
              children: "PAUSED",
            }),
          })),
        (e[65] = c),
        (e[66] = U))
      : (U = e[66]);
    let O;
    e[67] !== F || e[68] !== U
      ? ((O = (0, i.jsxs)("div", {
          className: "relative flex h-full w-full items-center justify-center",
          children: [F, U],
        })),
        (e[67] = F),
        (e[68] = U),
        (e[69] = O))
      : (O = e[69]);
    let G;
    e[70] !== u
      ? ((G = (ee) => {
          (ee.stopPropagation(), u());
        }),
        (e[70] = u),
        (e[71] = G))
      : (G = e[71]);
    let se;
    e[72] === Symbol.for("react.memo_cache_sentinel")
      ? ((se = (0, i.jsx)(gt, { size: 32 })), (e[72] = se))
      : (se = e[72]);
    let X;
    e[73] !== G
      ? ((X = (0, i.jsx)("button", {
          onClick: G,
          className:
            "absolute right-4 z-30 rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition-all hover:bg-black/40 active:scale-90",
          children: se,
        })),
        (e[73] = G),
        (e[74] = X))
      : (X = e[74]);
    let Y;
    e[75] !== g
      ? ((Y = (0, i.jsx)("div", {
          className: "w-[30%] cursor-w-resize",
          onClick: g,
        })),
        (e[75] = g),
        (e[76] = Y))
      : (Y = e[76]);
    let de;
    e[77] === Symbol.for("react.memo_cache_sentinel")
      ? ((de = (0, i.jsx)("div", {
          className: "flex w-[40%] cursor-pointer items-center justify-center",
          onClick: b,
        })),
        (e[77] = de))
      : (de = e[77]);
    let xe;
    e[78] !== u
      ? ((xe = (0, i.jsx)("div", {
          className: "w-[30%] cursor-e-resize",
          onClick: u,
        })),
        (e[78] = u),
        (e[79] = xe))
      : (xe = e[79]);
    let ue;
    e[80] !== Y || e[81] !== xe
      ? ((ue = (0, i.jsxs)("div", {
          className: "absolute inset-0 z-20 flex",
          children: [Y, de, xe],
        })),
        (e[80] = Y),
        (e[81] = xe),
        (e[82] = ue))
      : (ue = e[82]);
    let ge;
    e[83] !== q || e[84] !== O || e[85] !== X || e[86] !== ue
      ? ((ge = (0, i.jsxs)("div", {
          className:
            "relative flex h-full w-full max-w-xl items-center justify-center p-2",
          children: [q, O, X, ue],
        })),
        (e[83] = q),
        (e[84] = O),
        (e[85] = X),
        (e[86] = ue),
        (e[87] = ge))
      : (ge = e[87]);
    let be;
    return (
      e[88] !== L || e[89] !== ge
        ? ((be = (0, i.jsxs)("div", {
            className:
              "fixed inset-0 z-[100] flex animate-in fade-in flex-col items-center justify-center bg-black duration-300",
            children: [L, ge],
          })),
          (e[88] = L),
          (e[89] = ge),
          (e[90] = be))
        : (be = e[90]),
      be
    );
  },
  Vc = Hc;
function Oc(s) {
  return s + 1;
}
function Bc(s) {
  return s - 1;
}
function Wc(s) {
  return !s;
}
function Uc(s) {
  return s.stopPropagation();
}
var Gc = H();
const Kc = () => {
  const s = (0, Gc.c)(1);
  let e;
  (s[0] === Symbol.for("react.memo_cache_sentinel")
    ? ((e = []), (s[0] = e))
    : (e = s[0]),
    (0, p.useEffect)(Yc, e));
};
function Qc(s) {
  const e = s.target;
  e.tagName === "INPUT" ||
    e.tagName === "TEXTAREA" ||
    e.isContentEditable ||
    s.ctrlKey ||
    s.altKey ||
    s.metaKey ||
    s.key.toLowerCase();
}
function Yc() {
  const s = Qc;
  return (
    window.addEventListener("keydown", s),
    () => window.removeEventListener("keydown", s)
  );
}
var ur = H(),
  Zc = (0, p.lazy)(() =>
    ce(
      () => import("./Feed-By6ojyuU.js"),
      __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    ),
  ),
  Jc = (0, p.lazy)(() =>
    ce(
      () => import("./Explore-DpXENYG0.js"),
      __vite__mapDeps([15, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    ),
  ),
  os = (0, p.lazy)(() =>
    ce(
      () => import("./Reels-BekNg6ft.js"),
      __vite__mapDeps([16, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    ),
  ),
  ls = (0, p.lazy)(() =>
    ce(
      () => import("./Messages-DPoCwTUt.js"),
      __vite__mapDeps([17, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 18, 13, 12]),
    ),
  ),
  Xc = (0, p.lazy)(() =>
    ce(
      () => import("./Notifications-CP_711Pc.js"),
      __vite__mapDeps([19, 1, 2, 3, 4, 5, 6, 7, 8, 13, 12]),
    ),
  ),
  ed = (0, p.lazy)(() =>
    ce(
      () => import("./Profile-Bh7ABJcU.js"),
      __vite__mapDeps([20, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    ),
  ),
  td = (0, p.lazy)(() =>
    ce(
      () => import("./Community-OKlOQ4LF.js"),
      __vite__mapDeps([21, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    ),
  ),
  sd = (0, p.lazy)(() =>
    ce(
      () => import("./PostDetails-DMIybPbX.js"),
      __vite__mapDeps([22, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]),
    ),
  ),
  ad = (0, p.lazy)(() =>
    ce(
      () => import("./Settings-DJ9MgSaS.js"),
      __vite__mapDeps([23, 1, 2, 3, 4, 5, 6, 7, 8, 13, 12]),
    ),
  ),
  rd = (0, p.lazy)(() =>
    ce(
      () => import("./HashtagFeed-C6BG_EzP.js"),
      __vite__mapDeps([24, 1, 2, 3, 4, 5, 12, 6, 7, 8, 9, 10, 11, 13, 14]),
    ),
  ),
  id = (0, p.lazy)(() =>
    ce(
      () => import("./CreatePost-CEzBUgGT.js"),
      __vite__mapDeps([25, 1, 2, 3, 4, 5, 12, 6, 7, 8]),
    ),
  ),
  nd = (0, p.lazy)(() =>
    ce(
      () => import("./page-DPT-HTUW.js"),
      __vite__mapDeps([26, 1, 2, 3, 4, 5, 6, 7, 8, 27]),
    ),
  ),
  od = (0, p.lazy)(() =>
    ce(
      () => import("./page-U4iB1b1x.js"),
      __vite__mapDeps([28, 1, 2, 3, 4, 5, 6, 7, 8, 27]),
    ),
  ),
  ld = () => {
    const s = (0, ur.c)(1);
    let e;
    return (
      s[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((e = (0, i.jsx)("div", {
            className: "flex h-screen w-full items-center justify-center",
            children: (0, i.jsx)($e, {
              size: 40,
              className: "animate-spin text-violet-500",
            }),
          })),
          (s[0] = e))
        : (e = s[0]),
      e
    );
  };
function cd() {
  const s = (0, ur.c)(48),
    e = pt(),
    t = ye(),
    { currentUser: a } = pe(),
    {
      isOpen: r,
      images: n,
      currentIndex: o,
      closeLightbox: l,
      setIndex: c,
    } = Vn(),
    [d, m] = (0, p.useState)(!1);
  let h;
  s[0] === Symbol.for("react.memo_cache_sentinel")
    ? ((h = {}), (s[0] = h))
    : (h = s[0]);
  const [x, u] = (0, p.useState)(h),
    [f, g] = (0, p.useState)(null);
  Kc();
  let v;
  s[1] === Symbol.for("react.memo_cache_sentinel")
    ? ((v = (0, i.jsx)(Li, {})), (s[1] = v))
    : (v = s[1]);
  let b;
  s[2] === Symbol.for("react.memo_cache_sentinel")
    ? ((b = (0, i.jsx)(ld, {})), (s[2] = b))
    : (b = s[2]);
  let w;
  s[3] === Symbol.for("react.memo_cache_sentinel")
    ? ((w = (0, i.jsx)(Q, { path: "/login", element: (0, i.jsx)(nd, {}) })),
      (s[3] = w))
    : (w = s[3]);
  let y;
  s[4] === Symbol.for("react.memo_cache_sentinel")
    ? ((y = (0, i.jsx)(Q, { path: "/register", element: (0, i.jsx)(od, {}) })),
      (s[4] = y))
    : (y = s[4]);
  let z;
  s[5] === Symbol.for("react.memo_cache_sentinel")
    ? ((z = (0, i.jsx)(zc, {})), (s[5] = z))
    : (z = s[5]);
  let j;
  s[6] === Symbol.for("react.memo_cache_sentinel")
    ? ((j = (0, i.jsx)(Q, {
        path: "/",
        element: (0, i.jsx)(_t, { to: "/feed", replace: !0 }),
      })),
      (s[6] = j))
    : (j = s[6]);
  let k;
  s[7] === Symbol.for("react.memo_cache_sentinel")
    ? ((k = (0, i.jsx)(Q, {
        path: "/feed",
        element: (0, i.jsx)(ie, {
          children: (0, i.jsx)(Zc, { onStoryClick: g }),
        }),
      })),
      (s[7] = k))
    : (k = s[7]);
  let S;
  s[8] === Symbol.for("react.memo_cache_sentinel")
    ? ((S = (0, i.jsx)(Q, {
        path: "/home",
        element: (0, i.jsx)(_t, { to: "/feed", replace: !0 }),
      })),
      (s[8] = S))
    : (S = s[8]);
  let _;
  s[9] === Symbol.for("react.memo_cache_sentinel")
    ? ((_ = (0, i.jsx)(Q, {
        path: "/community",
        element: (0, i.jsx)(ie, { children: (0, i.jsx)(Jc, {}) }),
      })),
      (s[9] = _))
    : (_ = s[9]);
  let $;
  s[10] === Symbol.for("react.memo_cache_sentinel")
    ? (($ = (0, i.jsx)(Q, {
        path: "/r",
        element: (0, i.jsx)(ie, { children: (0, i.jsx)(os, {}) }),
      })),
      (s[10] = $))
    : ($ = s[10]);
  let I;
  s[11] === Symbol.for("react.memo_cache_sentinel")
    ? ((I = (0, i.jsx)(Q, {
        path: "/r/:id",
        element: (0, i.jsx)(ie, { children: (0, i.jsx)(os, {}) }),
      })),
      (s[11] = I))
    : (I = s[11]);
  let A;
  s[12] === Symbol.for("react.memo_cache_sentinel")
    ? ((A = (0, i.jsx)(Q, {
        path: "/m",
        element: (0, i.jsx)(ie, { children: (0, i.jsx)(ls, {}) }),
      })),
      (s[12] = A))
    : (A = s[12]);
  let R;
  s[13] === Symbol.for("react.memo_cache_sentinel")
    ? ((R = (0, i.jsx)(Q, {
        path: "/settings",
        element: (0, i.jsx)(ie, { children: (0, i.jsx)(ad, {}) }),
      })),
      (s[13] = R))
    : (R = s[13]);
  let M;
  s[14] === Symbol.for("react.memo_cache_sentinel")
    ? ((M = (0, i.jsx)(Q, {
        path: "/m/:id",
        element: (0, i.jsx)(ie, { children: (0, i.jsx)(ls, {}) }),
      })),
      (s[14] = M))
    : (M = s[14]);
  let P;
  s[15] === Symbol.for("react.memo_cache_sentinel")
    ? ((P = (0, i.jsx)(Q, {
        path: "/notifications",
        element: (0, i.jsx)(ie, { children: (0, i.jsx)(Xc, {}) }),
      })),
      (s[15] = P))
    : (P = s[15]);
  let C;
  s[16] === Symbol.for("react.memo_cache_sentinel")
    ? ((C = (0, i.jsx)(Q, {
        path: "/p/:id",
        element: (0, i.jsx)(ie, { children: (0, i.jsx)(sd, {}) }),
      })),
      (s[16] = C))
    : (C = s[16]);
  let T;
  s[17] === Symbol.for("react.memo_cache_sentinel")
    ? ((T = (0, i.jsx)(Q, {
        path: "/create",
        element: (0, i.jsx)(ie, { children: (0, i.jsx)(id, {}) }),
      })),
      (s[17] = T))
    : (T = s[17]);
  let V;
  s[18] !== t
    ? ((V = (0, i.jsx)(Q, {
        path: "/c/:handle",
        element: (0, i.jsx)(ie, {
          children: (0, i.jsx)(td, {
            onPostInCommunity: (Y) => {
              t("/create", { state: { initialCommunity: Y } });
            },
          }),
        }),
      })),
      (s[18] = t),
      (s[19] = V))
    : (V = s[19]);
  let W;
  s[20] === Symbol.for("react.memo_cache_sentinel")
    ? ((W = (0, i.jsx)(Q, {
        path: "/tags/:tag",
        element: (0, i.jsx)(ie, { children: (0, i.jsx)(rd, {}) }),
      })),
      (s[20] = W))
    : (W = s[20]);
  let B;
  s[21] === Symbol.for("react.memo_cache_sentinel")
    ? ((B = (0, i.jsx)(Q, {
        path: "/u/:handle",
        element: (0, i.jsx)(ie, {
          children: (0, i.jsx)(ed, {
            onEditProfile: (Y) => {
              (u(Y), m(!0));
            },
          }),
        }),
      })),
      (s[21] = B))
    : (B = s[21]);
  let L;
  s[22] === Symbol.for("react.memo_cache_sentinel")
    ? ((L = (0, i.jsx)(Q, {
        path: "*",
        element: (0, i.jsx)(_t, { to: "/community" }),
      })),
      (s[22] = L))
    : (L = s[22]);
  let q;
  s[23] !== V
    ? ((q = (0, i.jsxs)(Q, {
        element: z,
        children: [j, k, S, _, $, I, A, R, M, P, C, T, V, W, B, L],
      })),
      (s[23] = V),
      (s[24] = q))
    : (q = s[24]);
  let F;
  s[25] !== e || s[26] !== q
    ? ((F = (0, i.jsx)(p.Suspense, {
        fallback: b,
        children: (0, i.jsxs)(
          yr,
          { location: e, children: [w, y, q] },
          e.pathname,
        ),
      })),
      (s[25] = e),
      (s[26] = q),
      (s[27] = F))
    : (F = s[27]);
  let U;
  s[28] !== x || s[29] !== d
    ? ((U = (0, i.jsx)(Fc, {
        isEditProfileOpen: d,
        setIsEditProfileOpen: m,
        editProfileData: x,
        setEditProfileData: u,
      })),
      (s[28] = x),
      (s[29] = d),
      (s[30] = U))
    : (U = s[30]);
  let O;
  s[31] !== f
    ? ((O =
        f &&
        (0, i.jsx)(Vc, {
          story: f,
          onClose: (Y) => {
            if (Y) {
              const de = JSON.parse(
                localStorage.getItem("seenStories") || "[]",
              );
              de.includes(Y) ||
                localStorage.setItem("seenStories", JSON.stringify([...de, Y]));
            }
            g(null);
          },
        })),
      (s[31] = f),
      (s[32] = O))
    : (O = s[32]);
  let G;
  s[33] !== l || s[34] !== o || s[35] !== n || s[36] !== r || s[37] !== c
    ? ((G =
        r &&
        (0, i.jsx)(_l, {
          media: n,
          currentIndex: o,
          onClose: l,
          onNavigate: c,
        })),
      (s[33] = l),
      (s[34] = o),
      (s[35] = n),
      (s[36] = r),
      (s[37] = c),
      (s[38] = G))
    : (G = s[38]);
  let se;
  s[39] !== a || s[40] !== e.pathname
    ? ((se =
        a &&
        e.pathname === "/feed" &&
        (0, i.jsx)("div", {
          className: "fixed bottom-20 right-5 z-50 md:hidden",
          children: (0, i.jsx)(mr, {
            side: "top",
            align: "end",
            triggerClassName:
              "size-12 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950",
          }),
        })),
      (s[39] = a),
      (s[40] = e.pathname),
      (s[41] = se))
    : (se = s[41]);
  let X;
  return (
    s[42] !== F || s[43] !== U || s[44] !== O || s[45] !== G || s[46] !== se
      ? ((X = (0, i.jsxs)(Qn, { children: [v, F, U, O, G, se] })),
        (s[42] = F),
        (s[43] = U),
        (s[44] = O),
        (s[45] = G),
        (s[46] = se),
        (s[47] = X))
      : (X = s[47]),
    X
  );
}
var dd = new Nr({
    defaultOptions: {
      queries: {
        staleTime: 1e3 * 60 * 5,
        gcTime: 1e3 * 60 * 30,
        retry: 1,
        refetchOnWindowFocus: !1,
      },
    },
  }),
  cs = document.getElementById("root");
cs &&
  (0, Pi.createRoot)(cs).render(
    (0, i.jsx)(p.StrictMode, {
      children: (0, i.jsx)(Gn, {
        children: (0, i.jsx)(_r, {
          client: dd,
          children: (0, i.jsx)(gr, {
            children: (0, i.jsx)(gn, {
              children: (0, i.jsx)(un, {
                children: (0, i.jsx)(hn, {
                  children: (0, i.jsx)(Mn, {
                    children: (0, i.jsx)($n, {
                      children: (0, i.jsx)(Hn, {
                        children: (0, i.jsx)(cd, {}),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  );
export {
  no as $,
  Fd as $t,
  Bl as A,
  s0 as At,
  w0 as B,
  Zd as Bt,
  Et as C,
  rn as Ct,
  Kl as D,
  o0 as Dt,
  N0 as E,
  n0 as Et,
  Xa as F,
  Ji as Ft,
  x0 as G,
  Td as Gt,
  Ae as H,
  qd as Ht,
  y0 as I,
  Kd as It,
  p0 as J,
  Md as Jt,
  po as K,
  Ad as Kt,
  Il as L,
  Qd as Lt,
  _0 as M,
  t0 as Mt,
  rs as N,
  Xd as Nt,
  j0 as O,
  an as Ot,
  ql as P,
  Jd as Pt,
  f0 as Q,
  Od as Qt,
  b0 as R,
  Ud as Rt,
  Zl as S,
  l0 as St,
  Pt as T,
  i0 as Tt,
  Xe as U,
  Dd as Ut,
  v0 as V,
  Yd as Vt,
  g0 as W,
  Vd as Wt,
  jo as X,
  Wd as Xt,
  mt as Y,
  Rd as Yt,
  xo as Z,
  Ld as Zt,
  E0 as _,
  d0 as _t,
  T0 as a,
  $d as an,
  oe as at,
  k0 as b,
  pn as bt,
  dr as c,
  Te as cn,
  ao as ct,
  S0 as d,
  ca as dn,
  Xn as dt,
  Hd as en,
  oo as et,
  is as f,
  Cd as fn,
  Jn as ft,
  C0 as g,
  Vn as gt,
  $0 as h,
  J as ht,
  I0 as i,
  Ed as in,
  me as it,
  Hl as j,
  e0 as jt,
  Vl as k,
  a0 as kt,
  ir as l,
  E as ln,
  Zn as lt,
  P0 as m,
  N as mn,
  m0 as mt,
  q0 as n,
  Oi as nn,
  h0 as nt,
  L0 as o,
  ua as on,
  u0 as ot,
  ns as p,
  kt as pn,
  eo as pt,
  Ca as q,
  Bd as qt,
  A0 as r,
  Pd as rn,
  ne as rt,
  ie as s,
  Vi as sn,
  so as st,
  F0 as t,
  Id as tn,
  uo as tt,
  M0 as u,
  Sd as un,
  to as ut,
  ar as v,
  _e as vt,
  sr as w,
  r0 as wt,
  Xl as x,
  pe as xt,
  z0 as y,
  va as yt,
  Ll as z,
  Gd as zt,
};
