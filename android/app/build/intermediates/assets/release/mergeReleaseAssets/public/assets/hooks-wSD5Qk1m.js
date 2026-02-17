import { a as fe } from "./rolldown-runtime-BaZ8gS7u.js";
import {
  E as me,
  S as de,
  b as ee,
  c as G,
  x as oe,
} from "./framework-CsA6nn9m.js";
import { a as te, n as ie, r as ne, t as Z } from "./query-QyXblnmD.js";
import {
  $t as ge,
  At as he,
  Bt as ye,
  Ct as pe,
  Et as Pe,
  Ht as ve,
  It as _e,
  Jt as we,
  Kt as Me,
  Lt as be,
  Mt as Re,
  Nt as Se,
  Ot as $e,
  Pt as qe,
  Qt as Ce,
  Rt as Fe,
  Tt as ke,
  Ut as Le,
  Vt as Ne,
  Wt as Te,
  Xt as xe,
  Yt as De,
  _t as Qe,
  an as Ke,
  bt as Ee,
  c as Ae,
  dn as le,
  en as Oe,
  in as Be,
  jt as je,
  mn as U,
  on as Je,
  pn as I,
  qt as ze,
  rn as He,
  vt as ae,
  wt as Ve,
  xt as se,
  yt as We,
  zt as Xe,
} from "./index-0Nj-jM9P.js";
var Ge = G(),
  C = fe(me(), 1);
const Ye = (e, i, s) => {
  const t = (0, Ge.c)(16);
  let o, a;
  t[0] !== i || t[1] !== e
    ? ((o = ["follows", i, e]),
      (a = (c) => {
        const { pageParam: P } = c;
        return (i === "Followers" ? He : Be)(e, P, 10);
      }),
      (t[0] = i),
      (t[1] = e),
      (t[2] = o),
      (t[3] = a))
    : ((o = t[2]), (a = t[3]));
  const n = !!e && s;
  let y;
  t[4] !== o || t[5] !== a || t[6] !== n
    ? ((y = {
        queryKey: o,
        queryFn: a,
        initialPageParam: null,
        getNextPageParam: Ze,
        enabled: n,
      }),
      (t[4] = o),
      (t[5] = a),
      (t[6] = n),
      (t[7] = y))
    : (y = t[7]);
  const {
    data: m,
    fetchNextPage: f,
    hasNextPage: u,
    isFetchingNextPage: r,
    isLoading: v,
  } = Z(y);
  let M;
  t[8] !== m?.pages
    ? ((M = m?.pages.flatMap(Ie) || []), (t[8] = m?.pages), (t[9] = M))
    : (M = t[9]);
  const p = M;
  let g;
  return (
    t[10] !== f || t[11] !== p || t[12] !== u || t[13] !== r || t[14] !== v
      ? ((g = {
          followList: p,
          fetchNextPage: f,
          hasNextPage: u,
          isFetchingNextPage: r,
          isLoading: v,
        }),
        (t[10] = f),
        (t[11] = p),
        (t[12] = u),
        (t[13] = r),
        (t[14] = v),
        (t[15] = g))
      : (g = t[15]),
    g
  );
};
function Ze(e) {
  if (!(!e || e.length < 10)) return e[e.length - 1].followed_at;
}
function Ie(e) {
  return e;
}
const Ue = (e, i) => {
    const s = te(),
      { addToast: t } = ae(),
      o = (0, C.useCallback)(
        (c = [], P = []) =>
          c.map((h) => ({
            id: h.id,
            sender: h.sender_id === e?.id ? "me" : "them",
            senderAvatar: h.sender?.avatar,
            senderName: h.sender?.name,
            text: h.content,
            type: h.type || "text",
            media: h.media
              ? Array.isArray(h.media)
                ? h.media
                : [h.media]
              : [],
            isRead: h.is_read,
            replyToId: h.reply_to_id,
            reactions: P.filter((b) => b.message_id === h.id),
            time: new Date(h.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            updatedAt: h.updated_at,
          })),
        [e?.id],
      ),
      {
        data: a,
        fetchNextPage: n,
        hasNextPage: y,
        isFetchingNextPage: m,
        isLoading: f,
        refetch: u,
      } = Z({
        queryKey: ["messages", i],
        queryFn: ({ pageParam: c }) => _e(i, c, 20),
        initialPageParam: null,
        getNextPageParam: (c) => {
          if (!(!c || c.length < 20)) return c[c.length - 1].created_at;
        },
        enabled: !!i,
        refetchOnWindowFocus: !1,
      }),
      { data: r = [] } = ne({
        queryKey: ["reactions", i],
        queryFn: () => be(i),
        enabled: !!i,
        staleTime: 1e3 * 60 * 5,
      }),
      v = ie({
        mutationFn: ({
          convId: c,
          text: P,
          type: h = "text",
          media: b = [],
          replyToId: l = null,
        }) => ye(c, e.id, P, h, b, l),
        onSuccess: (c) => {
          c &&
            (s.invalidateQueries({ queryKey: ["messages", c.conversation_id] }),
            s.invalidateQueries({ queryKey: ["conversations", e.id] }));
        },
        onError: () => {
          t("Failed to send message", "error");
        },
      }),
      M = ie({
        mutationFn: ({ messageId: c, content: P }) => qe(c, P),
        onSuccess: (c) => {
          c &&
            (s.invalidateQueries({ queryKey: ["messages", i] }),
            s.invalidateQueries({ queryKey: ["conversations", e?.id] }));
        },
        onError: () => {
          t("Failed to edit message", "error");
        },
      }),
      p = async (c, P) => {
        if (e?.id)
          try {
            (await Ne(c, e.id, P),
              s.invalidateQueries({ queryKey: ["reactions", i] }));
          } catch (h) {
            (console.error("Failed to toggle reaction:", h),
              t("Failed to update reaction", "error"));
          }
      },
      g = async (c) => {
        try {
          (await Se(c),
            s.invalidateQueries({ queryKey: ["messages", i] }),
            s.invalidateQueries({ queryKey: ["conversations", e?.id] }));
        } catch (P) {
          (console.error("Failed to delete message:", P),
            t("Failed to delete message", "error"));
        }
      };
    return {
      messages: (0, C.useMemo)(
        () => [...(a?.pages.flatMap((c) => c) || [])].reverse(),
        [a],
      ),
      isMsgLoading: f,
      refetchMessages: u,
      fetchNextMessages: n,
      hasMoreMessages: y,
      isFetchingMoreMessages: m,
      sendMessage: (c, P, h, b, l) =>
        v.mutate({ convId: c, text: P, type: h, media: b, replyToId: l }),
      editMessage: (c, P) => M.mutate({ messageId: c, content: P }),
      isSending: v.isPending,
      isEditing: M.isPending,
      onToggleReaction: p,
      onDeleteMessage: g,
      conversationReactions: r,
      formatMessages: o,
    };
  },
  et = (e, i) => {
    const s = te(),
      [t, o] = (0, C.useState)({}),
      a = (0, C.useRef)(null),
      n = (0, C.useCallback)(
        async (m) => {
          if (!(!e?.id || !m))
            try {
              (await Xe(m, e.id),
                s.invalidateQueries({
                  queryKey: ["unread_messages_count", e.id],
                }),
                s.invalidateQueries({ queryKey: ["conversations", e.id] }));
            } catch (f) {
              console.error("Failed to mark as read:", f);
            }
        },
        [e?.id, s],
      );
    return (
      (0, C.useEffect)(() => {
        if (!e?.id) return;
        const m = U.channel(`messages_realtime:${i || "global"}`)
            .on(
              "postgres_changes",
              { event: "INSERT", schema: "public", table: "messages" },
              (u) => {
                const r = u.new;
                (i &&
                  r.conversation_id === i &&
                  (s.invalidateQueries({ queryKey: ["messages", i] }),
                  r.sender_id !== e.id && n(i)),
                  s.invalidateQueries({ queryKey: ["conversations", e.id] }),
                  r.sender_id !== e.id &&
                    s.invalidateQueries({
                      queryKey: ["unread_messages_count", e.id],
                    }),
                  o((v) => ({ ...v, [r.conversation_id]: !1 })));
              },
            )
            .on(
              "postgres_changes",
              { event: "DELETE", schema: "public", table: "messages" },
              () => {
                (s.invalidateQueries({ queryKey: ["messages"] }),
                  s.invalidateQueries({ queryKey: ["conversations", e.id] }));
              },
            )
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "message_reactions" },
              () => {
                i && s.invalidateQueries({ queryKey: ["reactions", i] });
              },
            )
            .subscribe(),
          f = U.channel("chat_typing_shared")
            .on("broadcast", { event: "typing" }, ({ payload: u }) => {
              const { conversationId: r, isTyping: v, userId: M } = u;
              M !== e.id && o((p) => ({ ...p, [r]: v }));
            })
            .subscribe();
        return (
          (a.current = f),
          () => {
            (U.removeChannel(m), U.removeChannel(f));
          }
        );
      }, [e?.id, s, i, n]),
      {
        typingStatus: t,
        sendTypingStatus: (m, f) => {
          a.current &&
            e &&
            a.current.send({
              type: "broadcast",
              event: "typing",
              payload: { conversationId: m, isTyping: f, userId: e.id },
            });
        },
        markAsRead: n,
      }
    );
  };
var tt = G();
const st = (e, i) => {
  const s = (0, tt.c)(22),
    {
      conversations: t,
      unreadCount: o,
      isConvLoading: a,
      refetchConversations: n,
    } = Ae(e),
    {
      messages: y,
      isMsgLoading: m,
      refetchMessages: f,
      fetchNextMessages: u,
      hasMoreMessages: r,
      isFetchingMoreMessages: v,
      sendMessage: M,
      editMessage: p,
      isSending: g,
      isEditing: c,
      onToggleReaction: P,
      onDeleteMessage: h,
      conversationReactions: b,
      formatMessages: l,
    } = Ue(e, i),
    { typingStatus: d, sendTypingStatus: _, markAsRead: w } = et(e, i);
  let R;
  return (
    s[0] !== b ||
    s[1] !== t ||
    s[2] !== p ||
    s[3] !== u ||
    s[4] !== l ||
    s[5] !== r ||
    s[6] !== a ||
    s[7] !== c ||
    s[8] !== v ||
    s[9] !== m ||
    s[10] !== g ||
    s[11] !== w ||
    s[12] !== y ||
    s[13] !== h ||
    s[14] !== P ||
    s[15] !== n ||
    s[16] !== f ||
    s[17] !== M ||
    s[18] !== _ ||
    s[19] !== d ||
    s[20] !== o
      ? ((R = {
          conversations: t,
          unreadCount: o,
          isConvLoading: a,
          refetchConversations: n,
          refetchMessages: f,
          sendMessage: M,
          editMessage: p,
          sendTypingStatus: _,
          typingStatus: d,
          markAsRead: w,
          formatMessages: l,
          onToggleReaction: P,
          onDeleteMessage: h,
          conversationReactions: b,
          isSending: g,
          isEditing: c,
          messages: y,
          isMsgLoading: m,
          fetchNextMessages: u,
          hasMoreMessages: r,
          isFetchingMoreMessages: v,
        }),
        (s[0] = b),
        (s[1] = t),
        (s[2] = p),
        (s[3] = u),
        (s[4] = l),
        (s[5] = r),
        (s[6] = a),
        (s[7] = c),
        (s[8] = v),
        (s[9] = m),
        (s[10] = g),
        (s[11] = w),
        (s[12] = y),
        (s[13] = h),
        (s[14] = P),
        (s[15] = n),
        (s[16] = f),
        (s[17] = M),
        (s[18] = _),
        (s[19] = d),
        (s[20] = o),
        (s[21] = R))
      : (R = s[21]),
    R
  );
};
var it = G();
const Wt = (e, i, s) => {
  const t = (0, it.c)(92),
    o = te(),
    { addToast: a } = ae();
  let n;
  t[0] !== i
    ? ((n = i || { comments: 0, likes: 0, mirrors: 0, reposts: 0 }),
      (t[0] = i),
      (t[1] = n))
    : (n = t[1]);
  const [y, m] = (0, C.useState)(n);
  let f, u;
  (t[2] !== i
    ? ((f = () => {
        i && m((Q) => ({ ...Q, ...i }));
      }),
      (u = [i]),
      (t[2] = i),
      (t[3] = f),
      (t[4] = u))
    : ((f = t[3]), (u = t[4])),
    (0, C.useEffect)(f, u));
  const r = s?.id;
  let v;
  t[5] !== e || t[6] !== r
    ? ((v = ["post", e, "liked", r]), (t[5] = e), (t[6] = r), (t[7] = v))
    : (v = t[7]);
  let M;
  t[8] !== s?.id || t[9] !== e
    ? ((M = () => Le(e, s?.id)), (t[8] = s?.id), (t[9] = e), (t[10] = M))
    : (M = t[10]);
  let p;
  t[11] !== s || t[12] !== e
    ? ((p = !!s && I(e) && I(s.id)), (t[11] = s), (t[12] = e), (t[13] = p))
    : (p = t[13]);
  let g;
  t[14] !== v || t[15] !== M || t[16] !== p
    ? ((g = { queryKey: v, queryFn: M, enabled: p, staleTime: 6e5 }),
      (t[14] = v),
      (t[15] = M),
      (t[16] = p),
      (t[17] = g))
    : (g = t[17]);
  const { data: c } = ne(g),
    P = c === void 0 ? !1 : c,
    h = s?.id;
  let b;
  t[18] !== e || t[19] !== h
    ? ((b = ["post", e, "reposted", h]), (t[18] = e), (t[19] = h), (t[20] = b))
    : (b = t[20]);
  let l;
  t[21] !== s?.id || t[22] !== e
    ? ((l = () => Te(e, s?.id)), (t[21] = s?.id), (t[22] = e), (t[23] = l))
    : (l = t[23]);
  let d;
  t[24] !== s || t[25] !== e
    ? ((d = !!s && I(e) && I(s.id)), (t[24] = s), (t[25] = e), (t[26] = d))
    : (d = t[26]);
  let _;
  t[27] !== b || t[28] !== l || t[29] !== d
    ? ((_ = { queryKey: b, queryFn: l, enabled: d, staleTime: 6e5 }),
      (t[27] = b),
      (t[28] = l),
      (t[29] = d),
      (t[30] = _))
    : (_ = t[30]);
  const { data: w } = ne(_),
    R = w === void 0 ? !1 : w;
  let S;
  t[31] !== s?.id || t[32] !== e
    ? ((S = () => ge(e, s?.id)), (t[31] = s?.id), (t[32] = e), (t[33] = S))
    : (S = t[33]);
  let T;
  t[34] !== s?.id || t[35] !== e || t[36] !== o
    ? ((T = async () => {
        await o.cancelQueries({ queryKey: ["post", e, "liked", s?.id] });
        const Q = o.getQueryData(["post", e, "liked", s?.id]);
        return (
          o.setQueryData(["post", e, "liked", s?.id], !Q),
          m((j) => ({
            ...j,
            likes: Q ? (j.likes || 0) - 1 : (j.likes || 0) + 1,
          })),
          { previousLiked: Q }
        );
      }),
      (t[34] = s?.id),
      (t[35] = e),
      (t[36] = o),
      (t[37] = T))
    : (T = t[37]);
  let N;
  t[38] !== a || t[39] !== s?.id || t[40] !== e || t[41] !== o
    ? ((N = (Q, j, $) => {
        ($?.previousLiked !== void 0 &&
          (o.setQueryData(["post", e, "liked", s?.id], $.previousLiked),
          m((z) => ({
            ...z,
            likes: $.previousLiked ? (z.likes || 0) + 1 : (z.likes || 0) - 1,
          }))),
          a("Failed to update like", "error"));
      }),
      (t[38] = a),
      (t[39] = s?.id),
      (t[40] = e),
      (t[41] = o),
      (t[42] = N))
    : (N = t[42]);
  let A;
  t[43] !== s?.id || t[44] !== e || t[45] !== o
    ? ((A = () => {
        o.invalidateQueries({ queryKey: ["post", e, "liked", s?.id] });
      }),
      (t[43] = s?.id),
      (t[44] = e),
      (t[45] = o),
      (t[46] = A))
    : (A = t[46]);
  let B;
  t[47] !== S || t[48] !== T || t[49] !== N || t[50] !== A
    ? ((B = { mutationFn: S, onMutate: T, onError: N, onSettled: A }),
      (t[47] = S),
      (t[48] = T),
      (t[49] = N),
      (t[50] = A),
      (t[51] = B))
    : (B = t[51]);
  const F = ie(B);
  let x;
  t[52] !== s?.id || t[53] !== e
    ? ((x = () => Oe(e, s?.id)), (t[52] = s?.id), (t[53] = e), (t[54] = x))
    : (x = t[54]);
  let q;
  t[55] !== s?.id || t[56] !== e || t[57] !== o
    ? ((q = async () => {
        await o.cancelQueries({ queryKey: ["post", e, "reposted", s?.id] });
        const Q = o.getQueryData(["post", e, "reposted", s?.id]);
        return (
          o.setQueryData(["post", e, "reposted", s?.id], !Q),
          m((j) => ({
            ...j,
            reposts: Q ? (j.reposts || 0) - 1 : (j.reposts || 0) + 1,
            mirrors: Q ? (j.mirrors || 0) - 1 : (j.mirrors || 0) + 1,
          })),
          { previousReposted: Q }
        );
      }),
      (t[55] = s?.id),
      (t[56] = e),
      (t[57] = o),
      (t[58] = q))
    : (q = t[58]);
  let E;
  t[59] !== a || t[60] !== s?.id || t[61] !== e || t[62] !== o
    ? ((E = (Q, j, $) => {
        ($?.previousReposted !== void 0 &&
          (o.setQueryData(["post", e, "reposted", s?.id], $.previousReposted),
          m((z) => ({
            ...z,
            reposts: $.previousReposted
              ? (z.reposts || 0) + 1
              : (z.reposts || 0) - 1,
            mirrors: $.previousReposted
              ? (z.mirrors || 0) + 1
              : (z.mirrors || 0) - 1,
          }))),
          a("Failed to update repost", "error"));
      }),
      (t[59] = a),
      (t[60] = s?.id),
      (t[61] = e),
      (t[62] = o),
      (t[63] = E))
    : (E = t[63]);
  let L;
  t[64] !== s?.id || t[65] !== e || t[66] !== o
    ? ((L = () => {
        o.invalidateQueries({ queryKey: ["post", e, "reposted", s?.id] });
      }),
      (t[64] = s?.id),
      (t[65] = e),
      (t[66] = o),
      (t[67] = L))
    : (L = t[67]);
  let K;
  t[68] !== a
    ? ((K = (Q) => {
        a(Q ? "Reposted!" : "Removed repost");
      }),
      (t[68] = a),
      (t[69] = K))
    : (K = t[69]);
  let D;
  t[70] !== x || t[71] !== q || t[72] !== E || t[73] !== L || t[74] !== K
    ? ((D = {
        mutationFn: x,
        onMutate: q,
        onError: E,
        onSettled: L,
        onSuccess: K,
      }),
      (t[70] = x),
      (t[71] = q),
      (t[72] = E),
      (t[73] = L),
      (t[74] = K),
      (t[75] = D))
    : (D = t[75]);
  const H = ie(D);
  let J;
  t[76] !== a || t[77] !== s || t[78] !== F || t[79] !== e
    ? ((J = async (Q) => {
        if ((Q && Q.stopPropagation(), !s))
          return a("Please login to like!", "error");
        !I(e) || !I(s.id) || F.mutate();
      }),
      (t[76] = a),
      (t[77] = s),
      (t[78] = F),
      (t[79] = e),
      (t[80] = J))
    : (J = t[80]);
  const O = J;
  let k;
  t[81] !== a || t[82] !== s || t[83] !== e || t[84] !== H
    ? ((k = async (Q) => {
        if ((Q && Q.stopPropagation(), !s))
          return a("Please login to repost!", "error");
        !I(e) || !I(s.id) || H.mutate();
      }),
      (t[81] = a),
      (t[82] = s),
      (t[83] = e),
      (t[84] = H),
      (t[85] = k))
    : (k = t[85]);
  const V = k;
  let W;
  return (
    t[86] !== O || t[87] !== V || t[88] !== P || t[89] !== R || t[90] !== y
      ? ((W = {
          liked: P,
          reposted: R,
          localStats: y,
          setLocalStats: m,
          handleLike: O,
          handleRepost: V,
        }),
        (t[86] = O),
        (t[87] = V),
        (t[88] = P),
        (t[89] = R),
        (t[90] = y),
        (t[91] = W))
      : (W = t[91]),
    W
  );
};
var nt = G();
const Xt = (e) => {
  const i = (0, nt.c)(5);
  let s;
  i[0] !== e ? ((s = () => le(e)), (i[0] = e), (i[1] = s)) : (s = i[1]);
  const [t, o] = (0, C.useState)(s);
  let a, n;
  return (
    i[2] !== e
      ? ((a = () => {
          if (!e) return;
          const y = setTimeout(() => {
              o(le(e));
            }, 0),
            m = setInterval(() => {
              o(le(e));
            }, 6e4);
          return () => {
            (clearTimeout(y), clearInterval(m));
          };
        }),
        (n = [e]),
        (i[2] = e),
        (i[3] = a),
        (i[4] = n))
      : ((a = i[3]), (n = i[4])),
    (0, C.useEffect)(a, n),
    t
  );
};
var at = G();
const Gt = () => {
  const e = (0, at.c)(30),
    [i, s] = (0, C.useState)(!1),
    [t, o] = (0, C.useState)(!1),
    [a, n] = (0, C.useState)(0),
    [y, m] = (0, C.useState)(null),
    [f, u] = (0, C.useState)(null),
    r = (0, C.useRef)(null),
    v = (0, C.useRef)(null);
  let M;
  e[0] === Symbol.for("react.memo_cache_sentinel")
    ? ((M = []), (e[0] = M))
    : (M = e[0]);
  const p = (0, C.useRef)(M);
  let g, c;
  (e[1] !== f
    ? ((g = () => () => {
        (v.current && clearInterval(v.current),
          r.current &&
            r.current.state !== "inactive" &&
            (r.current.stop(), r.current.stream.getTracks().forEach(ot)),
          f && URL.revokeObjectURL(f));
      }),
      (c = [f]),
      (e[1] = f),
      (e[2] = g),
      (e[3] = c))
    : ((g = e[2]), (c = e[3])),
    (0, C.useEffect)(g, c));
  let P;
  e[4] === Symbol.for("react.memo_cache_sentinel")
    ? ((P = () => {
        v.current = window.setInterval(() => {
          n(rt);
        }, 1e3);
      }),
      (e[4] = P))
    : (P = e[4]);
  const h = P;
  let b;
  e[5] === Symbol.for("react.memo_cache_sentinel")
    ? ((b = () => {
        v.current && (clearInterval(v.current), (v.current = null));
      }),
      (e[5] = b))
    : (b = e[5]);
  const l = b;
  let d;
  e[6] === Symbol.for("react.memo_cache_sentinel")
    ? ((d = async () => {
        try {
          const L = await navigator.mediaDevices.getUserMedia({ audio: !0 }),
            K = new MediaRecorder(L);
          ((r.current = K),
            (p.current = []),
            (K.ondataavailable = (D) => {
              D.data.size > 0 && p.current.push(D.data);
            }),
            (K.onstop = () => {
              const D = new Blob(p.current, { type: "audio/webm;codecs=opus" }),
                H = URL.createObjectURL(D);
              (m(D), u(H), L.getTracks().forEach(lt));
            }),
            K.start(),
            s(!0),
            o(!1),
            n(0),
            h());
        } catch (L) {
          const K = L;
          throw (console.error("Error accessing microphone:", K), K);
        }
      }),
      (e[6] = d))
    : (d = e[6]);
  const _ = d;
  let w;
  e[7] !== i
    ? ((w = () => {
        r.current && i && (r.current.stop(), s(!1), o(!1), l());
      }),
      (e[7] = i),
      (e[8] = w))
    : (w = e[8]);
  const R = w;
  let S;
  e[9] !== t || e[10] !== i
    ? ((S = () => {
        r.current && i && !t && (r.current.pause(), o(!0), l());
      }),
      (e[9] = t),
      (e[10] = i),
      (e[11] = S))
    : (S = e[11]);
  const T = S;
  let N;
  e[12] !== t || e[13] !== i
    ? ((N = () => {
        r.current && i && t && (r.current.resume(), o(!1), h());
      }),
      (e[12] = t),
      (e[13] = i),
      (e[14] = N))
    : (N = e[14]);
  const A = N;
  let B;
  e[15] !== i
    ? ((B = () => {
        r.current &&
          i &&
          (r.current.stop(),
          (r.current.onstop = null),
          s(!1),
          o(!1),
          l(),
          n(0),
          r.current.stream && r.current.stream.getTracks().forEach(ct));
      }),
      (e[15] = i),
      (e[16] = B))
    : (B = e[16]);
  const F = B;
  let x;
  e[17] !== f
    ? ((x = () => {
        (f && URL.revokeObjectURL(f), m(null), u(null), n(0));
      }),
      (e[17] = f),
      (e[18] = x))
    : (x = e[18]);
  const q = x;
  let E;
  return (
    e[19] !== y ||
    e[20] !== f ||
    e[21] !== F ||
    e[22] !== q ||
    e[23] !== t ||
    e[24] !== i ||
    e[25] !== T ||
    e[26] !== a ||
    e[27] !== A ||
    e[28] !== R
      ? ((E = {
          isRecording: i,
          isPaused: t,
          recordingTime: a,
          startRecording: _,
          stopRecording: R,
          pauseRecording: T,
          resumeRecording: A,
          cancelRecording: F,
          audioBlob: y,
          audioUrl: f,
          clearAudio: q,
        }),
        (e[19] = y),
        (e[20] = f),
        (e[21] = F),
        (e[22] = q),
        (e[23] = t),
        (e[24] = i),
        (e[25] = T),
        (e[26] = a),
        (e[27] = A),
        (e[28] = R),
        (e[29] = E))
      : (E = e[29]),
    E
  );
};
function ot(e) {
  return e.stop();
}
function rt(e) {
  return e + 1;
}
function lt(e) {
  return e.stop();
}
function ct(e) {
  return e.stop();
}
var ut = G();
const Yt = (e, i, s) => {
  const t = (0, ut.c)(31),
    o = te();
  let a, n;
  t[0] !== s || t[1] !== e
    ? ((a = ["comments", e, s]),
      (n = (w) => {
        const { pageParam: R } = w;
        return Me(e, R, 10, s);
      }),
      (t[0] = s),
      (t[1] = e),
      (t[2] = a),
      (t[3] = n))
    : ((a = t[2]), (n = t[3]));
  let y;
  t[4] !== i
    ? ((y = i ? { pages: [i], pageParams: [null] } : void 0),
      (t[4] = i),
      (t[5] = y))
    : (y = t[5]);
  const m = !!e;
  let f;
  t[6] !== a || t[7] !== n || t[8] !== y || t[9] !== m
    ? ((f = {
        queryKey: a,
        queryFn: n,
        initialPageParam: null,
        getNextPageParam: dt,
        initialData: y,
        enabled: m,
      }),
      (t[6] = a),
      (t[7] = n),
      (t[8] = y),
      (t[9] = m),
      (t[10] = f))
    : (f = t[10]);
  const {
    data: u,
    fetchNextPage: r,
    hasNextPage: v,
    isFetchingNextPage: M,
    isLoading: p,
    refetch: g,
  } = Z(f);
  let c;
  t[11] !== u?.pages
    ? ((c = u?.pages.flatMap(ft) || []), (t[11] = u?.pages), (t[12] = c))
    : (c = t[12]);
  const P = c;
  let h;
  t[13] !== e
    ? ((h = (w) => {
        const { userId: R, content: S, media: T, replyToId: N } = w;
        return ve(e, R, S, T, N);
      }),
      (t[13] = e),
      (t[14] = h))
    : (h = t[14]);
  let b;
  t[15] !== s || t[16] !== e || t[17] !== o
    ? ((b = () => {
        (o.invalidateQueries({ queryKey: ["comments", e] }),
          s && o.invalidateQueries({ queryKey: ["comments", e, s] }));
      }),
      (t[15] = s),
      (t[16] = e),
      (t[17] = o),
      (t[18] = b))
    : (b = t[18]);
  let l;
  t[19] !== h || t[20] !== b
    ? ((l = { mutationFn: h, onSuccess: b }),
      (t[19] = h),
      (t[20] = b),
      (t[21] = l))
    : (l = t[21]);
  const d = ie(l);
  let _;
  return (
    t[22] !== d.isPending ||
    t[23] !== d.mutateAsync ||
    t[24] !== P ||
    t[25] !== r ||
    t[26] !== v ||
    t[27] !== M ||
    t[28] !== p ||
    t[29] !== g
      ? ((_ = {
          comments: P,
          fetchNextPage: r,
          hasNextPage: v,
          isFetchingNextPage: M,
          isLoading: p,
          refetch: g,
          addComment: d.mutateAsync,
          isSubmitting: d.isPending,
        }),
        (t[22] = d.isPending),
        (t[23] = d.mutateAsync),
        (t[24] = P),
        (t[25] = r),
        (t[26] = v),
        (t[27] = M),
        (t[28] = p),
        (t[29] = g),
        (t[30] = _))
      : (_ = t[30]),
    _
  );
};
function dt(e) {
  if (!(!e || e.length < 10)) return e[e.length - 1].created_at;
}
function ft(e) {
  return e;
}
var mt = G();
const Zt = () => {
  const e = (0, mt.c)(53),
    { handle: i } = oe(),
    s = ee(),
    { currentUser: t } = se(),
    { addToast: o } = ae();
  let a, n;
  e[0] !== i
    ? ((a = ["profile", i]),
      (n = () => Ke(i)),
      (e[0] = i),
      (e[1] = a),
      (e[2] = n))
    : ((a = e[1]), (n = e[2]));
  const y = !!i;
  let m;
  e[3] !== a || e[4] !== n || e[5] !== y
    ? ((m = { queryKey: a, queryFn: n, enabled: y, staleTime: 3e5 }),
      (e[3] = a),
      (e[4] = n),
      (e[5] = y),
      (e[6] = m))
    : (m = e[6]);
  const { data: f, isLoading: u } = ne(m),
    [r, v] = (0, C.useState)("feed"),
    M = f?.id;
  let p;
  e[7] !== M
    ? ((p = ["posts", "user", M]), (e[7] = M), (e[8] = p))
    : (p = e[8]);
  let g;
  e[9] !== f?.id
    ? ((g = ($) => {
        const { pageParam: z } = $;
        return De(f?.id, z, 10);
      }),
      (e[9] = f?.id),
      (e[10] = g))
    : (g = e[10]);
  const c = !!f?.id;
  let P;
  e[11] !== p || e[12] !== g || e[13] !== c
    ? ((P = {
        queryKey: p,
        queryFn: g,
        enabled: c,
        initialPageParam: null,
        getNextPageParam: gt,
      }),
      (e[11] = p),
      (e[12] = g),
      (e[13] = c),
      (e[14] = P))
    : (P = e[14]);
  const {
    data: h,
    fetchNextPage: b,
    hasNextPage: l,
    isFetchingNextPage: d,
    isLoading: _,
  } = Z(P);
  let w;
  e[15] !== h?.pages
    ? ((w = h?.pages.flatMap(ht) || []), (e[15] = h?.pages), (e[16] = w))
    : (w = e[16]);
  const R = w,
    [S, T] = (0, C.useState)(!1),
    [N, A] = (0, C.useState)("Followers"),
    {
      followList: B,
      fetchNextPage: F,
      hasNextPage: x,
      isFetchingNextPage: q,
      isLoading: E,
    } = Ye(f?.id, N, S);
  let L;
  e[17] === Symbol.for("react.memo_cache_sentinel")
    ? ((L = ($) => {
        (A($), T(!0));
      }),
      (e[17] = L))
    : (L = e[17]);
  const K = L;
  let D;
  e: {
    if (r === "feed") {
      let $;
      (e[18] !== R
        ? (($ = R.filter(yt)), (e[18] = R), (e[19] = $))
        : ($ = e[19]),
        (D = $));
      break e;
    }
    if (r === "media") {
      let $;
      (e[20] !== R
        ? (($ = R.filter(pt)), (e[20] = R), (e[21] = $))
        : ($ = e[21]),
        (D = $));
      break e;
    }
    if (r === "collections") {
      let $;
      (e[22] === Symbol.for("react.memo_cache_sentinel")
        ? (($ = []), (e[22] = $))
        : ($ = e[22]),
        (D = $));
      break e;
    }
    D = R;
  }
  const H = D;
  let J;
  e[23] !== s
    ? ((J = ($) => {
        s(`/p/${$}`);
      }),
      (e[23] = s),
      (e[24] = J))
    : (J = e[24]);
  const O = J;
  let k;
  e[25] !== i || e[26] !== s
    ? ((k = ($) => {
        $ !== i && s(`/u/${$}`);
      }),
      (e[25] = i),
      (e[26] = s),
      (e[27] = k))
    : (k = e[27]);
  const V = k;
  let W;
  e[28] !== b
    ? ((W = ($) => {
        b();
      }),
      (e[28] = b),
      (e[29] = W))
    : (W = e[29]);
  const Q = W;
  let j;
  return (
    e[30] !== r ||
    e[31] !== o ||
    e[32] !== t ||
    e[33] !== F ||
    e[34] !== H ||
    e[35] !== B ||
    e[36] !== N ||
    e[37] !== i ||
    e[38] !== O ||
    e[39] !== V ||
    e[40] !== x ||
    e[41] !== l ||
    e[42] !== q ||
    e[43] !== d ||
    e[44] !== S ||
    e[45] !== E ||
    e[46] !== Q ||
    e[47] !== _ ||
    e[48] !== u ||
    e[49] !== s ||
    e[50] !== f ||
    e[51] !== R
      ? ((j = {
          handle: i,
          profile: f,
          loading: u,
          userPosts: R,
          setUserPosts: Pt,
          activeProfileTab: r,
          setActiveProfileTab: v,
          loadingPosts: _,
          isFetchingMorePosts: d,
          hasMorePosts: l,
          filteredPosts: H,
          isFollowModalOpen: S,
          setIsFollowModalOpen: T,
          followModalType: N,
          followListData: B,
          isListLoading: E,
          isFetchingMoreFollows: q,
          hasMoreFollows: x,
          openFollowModal: K,
          fetchNextFollows: F,
          handlePostClick: O,
          handleUserClick: V,
          loadUserPosts: Q,
          currentUser: t,
          addToast: o,
          navigate: s,
        }),
        (e[30] = r),
        (e[31] = o),
        (e[32] = t),
        (e[33] = F),
        (e[34] = H),
        (e[35] = B),
        (e[36] = N),
        (e[37] = i),
        (e[38] = O),
        (e[39] = V),
        (e[40] = x),
        (e[41] = l),
        (e[42] = q),
        (e[43] = d),
        (e[44] = S),
        (e[45] = E),
        (e[46] = Q),
        (e[47] = _),
        (e[48] = u),
        (e[49] = s),
        (e[50] = f),
        (e[51] = R),
        (e[52] = j))
      : (j = e[52]),
    j
  );
};
function gt(e) {
  if (!(!e || e.length < 10))
    return e[e.length - 1].sort_timestamp || e[e.length - 1].created_at;
}
function ht(e) {
  return e;
}
function yt(e) {
  return e.community_id === null && e.parent_id === null;
}
function pt(e) {
  return (
    e.community_id === null &&
    e.parent_id === null &&
    (e.type === "video" ||
      e.type === "image" ||
      (e.media && e.media.length > 0))
  );
}
function Pt() {
  return console.warn("setUserPosts is deprecated");
}
var vt = G();
const It = () => {
  const e = (0, vt.c)(75),
    { handle: i } = oe(),
    s = ee(),
    { currentUser: t } = se(),
    { addToast: o } = ae(),
    a = te();
  let n, y;
  e[0] !== i
    ? ((n = ["community", i]),
      (y = () => ke(i)),
      (e[0] = i),
      (e[1] = n),
      (e[2] = y))
    : ((n = e[1]), (y = e[2]));
  const m = !!i;
  let f;
  e[3] !== n || e[4] !== y || e[5] !== m
    ? ((f = { queryKey: n, queryFn: y, enabled: m, staleTime: 6e5 }),
      (e[3] = n),
      (e[4] = y),
      (e[5] = m),
      (e[6] = f))
    : (f = e[6]);
  const { data: u, isLoading: r, refetch: v } = ne(f),
    M = u?.id,
    p = t?.id;
  let g;
  e[7] !== M || e[8] !== p
    ? ((g = ["community", M, "membership", p]),
      (e[7] = M),
      (e[8] = p),
      (e[9] = g))
    : (g = e[9]);
  let c;
  e[10] !== u?.id || e[11] !== t?.id
    ? ((c = () => pe(u?.id, t?.id)),
      (e[10] = u?.id),
      (e[11] = t?.id),
      (e[12] = c))
    : (c = e[12]);
  const P = !!u?.id && !!t?.id;
  let h;
  e[13] !== g || e[14] !== c || e[15] !== P
    ? ((h = { queryKey: g, queryFn: c, enabled: P, staleTime: 3e5 }),
      (e[13] = g),
      (e[14] = c),
      (e[15] = P),
      (e[16] = h))
    : (h = e[16]);
  const { data: b } = ne(h),
    l = !!b,
    d = b?.role || null,
    _ = u?.id;
  let w;
  e[17] !== _
    ? ((w = ["posts", "community", _]), (e[17] = _), (e[18] = w))
    : (w = e[18]);
  let R;
  e[19] !== u?.id
    ? ((R = (j) => {
        const { pageParam: $ } = j;
        return Pe(u?.id, $, 10);
      }),
      (e[19] = u?.id),
      (e[20] = R))
    : (R = e[20]);
  const S = !!u?.id;
  let T;
  e[21] !== w || e[22] !== R || e[23] !== S
    ? ((T = {
        queryKey: w,
        queryFn: R,
        enabled: S,
        initialPageParam: null,
        getNextPageParam: _t,
      }),
      (e[21] = w),
      (e[22] = R),
      (e[23] = S),
      (e[24] = T))
    : (T = e[24]);
  const {
    data: N,
    fetchNextPage: A,
    hasNextPage: B,
    isFetchingNextPage: F,
    isLoading: x,
  } = Z(T);
  let q;
  e[25] !== N?.pages
    ? ((q = N?.pages.flatMap(wt) || []), (e[25] = N?.pages), (e[26] = q))
    : (q = e[26]);
  const E = q;
  let L;
  e[27] !== u?.id || e[28] !== t?.id
    ? ((L = () => $e(u?.id, t?.id)),
      (e[27] = u?.id),
      (e[28] = t?.id),
      (e[29] = L))
    : (L = e[29]);
  let K;
  e[30] !== u?.id || e[31] !== t?.id || e[32] !== i || e[33] !== a
    ? ((K = async () => {
        (await a.cancelQueries({
          queryKey: ["community", u?.id, "membership", t?.id],
        }),
          await a.cancelQueries({ queryKey: ["community", i] }));
        const j = a.getQueryData(["community", u?.id, "membership", t?.id]),
          $ = a.getQueryData(["community", i]);
        return (
          a.setQueryData(
            ["community", u?.id, "membership", t?.id],
            j ? null : { role: "member" },
          ),
          a.setQueryData(
            ["community", i],
            (z) =>
              z && {
                ...z,
                membersCount: j ? z.membersCount - 1 : z.membersCount + 1,
              },
          ),
          { previousMembership: j, previousCommunity: $ }
        );
      }),
      (e[30] = u?.id),
      (e[31] = t?.id),
      (e[32] = i),
      (e[33] = a),
      (e[34] = K))
    : (K = e[34]);
  let D;
  e[35] !== o ||
  e[36] !== u?.id ||
  e[37] !== t?.id ||
  e[38] !== i ||
  e[39] !== a
    ? ((D = (j, $, z) => {
        (z?.previousMembership !== void 0 &&
          a.setQueryData(
            ["community", u?.id, "membership", t?.id],
            z.previousMembership,
          ),
          z?.previousCommunity &&
            a.setQueryData(["community", i], z.previousCommunity),
          o("Failed to update membership", "error"));
      }),
      (e[35] = o),
      (e[36] = u?.id),
      (e[37] = t?.id),
      (e[38] = i),
      (e[39] = a),
      (e[40] = D))
    : (D = e[40]);
  let H;
  e[41] !== u?.id || e[42] !== t?.id || e[43] !== i || e[44] !== a
    ? ((H = () => {
        (a.invalidateQueries({
          queryKey: ["community", u?.id, "membership", t?.id],
        }),
          a.invalidateQueries({ queryKey: ["community", i] }));
      }),
      (e[41] = u?.id),
      (e[42] = t?.id),
      (e[43] = i),
      (e[44] = a),
      (e[45] = H))
    : (H = e[45]);
  let J;
  e[46] !== o || e[47] !== u
    ? ((J = (j) => {
        u && o(j ? `Joined ${u.name}` : `Left ${u.name}`);
      }),
      (e[46] = o),
      (e[47] = u),
      (e[48] = J))
    : (J = e[48]);
  let O;
  e[49] !== L || e[50] !== K || e[51] !== D || e[52] !== H || e[53] !== J
    ? ((O = {
        mutationFn: L,
        onMutate: K,
        onError: D,
        onSettled: H,
        onSuccess: J,
      }),
      (e[49] = L),
      (e[50] = K),
      (e[51] = D),
      (e[52] = H),
      (e[53] = J),
      (e[54] = O))
    : (O = e[54]);
  const k = ie(O);
  let V;
  e[55] !== o || e[56] !== t || e[57] !== k
    ? ((V = async () => {
        if (!t) return o("Please login to join communities", "error");
        k.mutate();
      }),
      (e[55] = o),
      (e[56] = t),
      (e[57] = k),
      (e[58] = V))
    : (V = e[58]);
  const W = V;
  let Q;
  return (
    e[59] !== o ||
    e[60] !== u ||
    e[61] !== E ||
    e[62] !== t ||
    e[63] !== A ||
    e[64] !== W ||
    e[65] !== B ||
    e[66] !== F ||
    e[67] !== l ||
    e[68] !== k.isPending ||
    e[69] !== r ||
    e[70] !== x ||
    e[71] !== s ||
    e[72] !== v ||
    e[73] !== d
      ? ((Q = {
          community: u,
          loading: r,
          isMember: l,
          userRole: d,
          isJoining: k.isPending,
          communityPosts: E,
          loadingPosts: x,
          isFetchingMorePosts: F,
          hasMorePosts: B,
          handleJoinToggle: W,
          loadCommunityPosts: A,
          refetchCommunity: v,
          currentUser: t,
          addToast: o,
          navigate: s,
        }),
        (e[59] = o),
        (e[60] = u),
        (e[61] = E),
        (e[62] = t),
        (e[63] = A),
        (e[64] = W),
        (e[65] = B),
        (e[66] = F),
        (e[67] = l),
        (e[68] = k.isPending),
        (e[69] = r),
        (e[70] = x),
        (e[71] = s),
        (e[72] = v),
        (e[73] = d),
        (e[74] = Q))
      : (Q = e[74]),
    Q
  );
};
function _t(e) {
  if (!(!e || e.length < 10)) return e[e.length - 1].sort_timestamp;
}
function wt(e) {
  return e;
}
var Mt = G();
const Ut = () => {
  const e = (0, Mt.c)(48),
    { currentUser: i } = se(),
    s = ee(),
    [t, o] = de();
  let a;
  e[0] !== t ? ((a = t.get("q") || ""), (e[0] = t), (e[1] = a)) : (a = e[1]);
  const n = a;
  let y;
  e[2] !== t || e[3] !== n
    ? ((y = t.get("tab") || (n ? "posts" : "communities")),
      (e[2] = t),
      (e[3] = n),
      (e[4] = y))
    : (y = e[4]);
  const m = y,
    [f, u] = (0, C.useState)(!1);
  let r;
  e[5] === Symbol.for("react.memo_cache_sentinel")
    ? ((r = ["explore", "communities"]), (e[5] = r))
    : (r = e[5]);
  let v;
  e[6] === Symbol.for("react.memo_cache_sentinel")
    ? ((v = {
        queryKey: r,
        queryFn: bt,
        initialPageParam: null,
        getNextPageParam: Rt,
      }),
      (e[6] = v))
    : (v = e[6]);
  const {
    data: M,
    fetchNextPage: p,
    hasNextPage: g,
    isFetchingNextPage: c,
    isLoading: P,
  } = Z(v);
  let h;
  e[7] !== M?.pages
    ? ((h = M?.pages.flatMap(St) || []), (e[7] = M?.pages), (e[8] = h))
    : (h = e[8]);
  const b = h;
  let l, d;
  e[9] !== n
    ? ((l = ["explore", "posts", n]),
      (d = (O) => {
        const { pageParam: k } = O;
        return n ? Ce(n, k, 10, !0) : ze(k, 10);
      }),
      (e[9] = n),
      (e[10] = l),
      (e[11] = d))
    : ((l = e[10]), (d = e[11]));
  let _;
  e[12] !== l || e[13] !== d
    ? ((_ = {
        queryKey: l,
        queryFn: d,
        initialPageParam: null,
        getNextPageParam: $t,
      }),
      (e[12] = l),
      (e[13] = d),
      (e[14] = _))
    : (_ = e[14]);
  const {
    data: w,
    fetchNextPage: R,
    hasNextPage: S,
    isFetchingNextPage: T,
    isLoading: N,
  } = Z(_);
  let A;
  e[15] !== w?.pages
    ? ((A = w?.pages.flatMap(qt) || []), (e[15] = w?.pages), (e[16] = A))
    : (A = e[16]);
  const B = A;
  let F = b;
  if (n) {
    let O;
    if (e[17] !== F || e[18] !== n) {
      let k;
      (e[20] !== n
        ? ((k = (V) =>
            V.name?.toLowerCase().includes(n.toLowerCase()) ||
            V.handle?.toLowerCase().includes(n.toLowerCase())),
          (e[20] = n),
          (e[21] = k))
        : (k = e[21]),
        (O = F.filter(k)),
        (e[17] = F),
        (e[18] = n),
        (e[19] = O));
    } else O = e[19];
    F = O;
  }
  const x = F;
  let q;
  e[22] !== s
    ? ((q = (O) => {
        s(`/c/${O}`);
      }),
      (e[22] = s),
      (e[23] = q))
    : (q = e[23]);
  const E = q;
  let L;
  e[24] !== o
    ? ((L = (O) => {
        o((k) => (O ? k.set("q", O) : k.delete("q"), k), { replace: !0 });
      }),
      (e[24] = o),
      (e[25] = L))
    : (L = e[25]);
  const K = L;
  let D;
  e[26] !== o
    ? ((D = (O) => {
        o((k) => (k.set("tab", O), k), { replace: !0 });
      }),
      (e[26] = o),
      (e[27] = D))
    : (D = e[27]);
  const H = D;
  let J;
  return (
    e[28] !== m ||
    e[29] !== b ||
    e[30] !== i ||
    e[31] !== p ||
    e[32] !== R ||
    e[33] !== x ||
    e[34] !== E ||
    e[35] !== K ||
    e[36] !== H ||
    e[37] !== g ||
    e[38] !== S ||
    e[39] !== P ||
    e[40] !== f ||
    e[41] !== c ||
    e[42] !== T ||
    e[43] !== N ||
    e[44] !== s ||
    e[45] !== B ||
    e[46] !== n
      ? ((J = {
          currentUser: i,
          searchQuery: n,
          setSearchQuery: K,
          activeTab: m,
          setActiveTab: H,
          isCreateModalOpen: f,
          setIsCreateModalOpen: u,
          communitiesData: b,
          isCommunitiesLoading: P,
          isFetchingMoreCommunities: c,
          hasMoreCommunities: g,
          postsData: B,
          isPostsLoading: N,
          isFetchingMorePosts: T,
          hasMorePosts: S,
          filteredCommunities: x,
          handleCommunityClick: E,
          loadCommunities: p,
          loadPosts: R,
          navigate: s,
        }),
        (e[28] = m),
        (e[29] = b),
        (e[30] = i),
        (e[31] = p),
        (e[32] = R),
        (e[33] = x),
        (e[34] = E),
        (e[35] = K),
        (e[36] = H),
        (e[37] = g),
        (e[38] = S),
        (e[39] = P),
        (e[40] = f),
        (e[41] = c),
        (e[42] = T),
        (e[43] = N),
        (e[44] = s),
        (e[45] = B),
        (e[46] = n),
        (e[47] = J))
      : (J = e[47]),
    J
  );
};
function bt(e) {
  const { pageParam: i } = e;
  return Ve(i, 10);
}
function Rt(e) {
  if (!(!e || e.length < 10)) return e[e.length - 1].createdAt;
}
function St(e) {
  return e;
}
function $t(e) {
  if (!(!e || e.length < 10)) return e[e.length - 1].sort_timestamp;
}
function qt(e) {
  return e;
}
var Ct = G();
const es = () => {
  const e = (0, Ct.c)(21),
    { currentUser: i } = se(),
    {
      posts: s,
      loading: t,
      hasMore: o,
      isFetchingNextPage: a,
      fetchNextPage: n,
      refreshPosts: y,
    } = Qe(),
    { addToast: m } = ae(),
    f = ee();
  let u;
  e[0] === Symbol.for("react.memo_cache_sentinel")
    ? ((u = ["stories"]), (e[0] = u))
    : (u = e[0]);
  let r;
  e[1] === Symbol.for("react.memo_cache_sentinel")
    ? ((r = {
        queryKey: u,
        queryFn: Ft,
        initialPageParam: null,
        getNextPageParam: kt,
        refetchInterval: 6e4,
      }),
      (e[1] = r))
    : (r = e[1]);
  const { data: v, isLoading: M } = Z(r);
  let p;
  if (e[2] !== v?.pages) {
    const d = v?.pages.flatMap(Lt) || [],
      _ = JSON.parse(localStorage.getItem("seenStories") || "[]");
    ((p = d
      .reduce(Nt, [])
      .map((w) => ({ ...w, isSeen: _.includes(w.user.id) }))),
      (e[2] = v?.pages),
      (e[3] = p));
  } else p = e[3];
  const g = p;
  let c;
  e[4] !== f
    ? ((c = (d) => {
        f(`/p/${d}`);
      }),
      (e[4] = f),
      (e[5] = c))
    : (c = e[5]);
  const P = c;
  let h;
  e[6] !== f
    ? ((h = (d) => {
        f(`/u/${d}`);
      }),
      (e[6] = f),
      (e[7] = h))
    : (h = e[7]);
  const b = h;
  let l;
  return (
    e[8] !== m ||
    e[9] !== i ||
    e[10] !== n ||
    e[11] !== g ||
    e[12] !== P ||
    e[13] !== b ||
    e[14] !== o ||
    e[15] !== s ||
    e[16] !== a ||
    e[17] !== t ||
    e[18] !== M ||
    e[19] !== y
      ? ((l = {
          currentUser: i,
          homePosts: s,
          groupedStories: g,
          isPostsLoading: t,
          isStoriesLoading: M,
          hasMore: o,
          isFetchingNextPage: a,
          fetchNextPage: n,
          refreshPosts: y,
          addToast: m,
          handlePostClick: P,
          handleUserClick: b,
        }),
        (e[8] = m),
        (e[9] = i),
        (e[10] = n),
        (e[11] = g),
        (e[12] = P),
        (e[13] = b),
        (e[14] = o),
        (e[15] = s),
        (e[16] = a),
        (e[17] = t),
        (e[18] = M),
        (e[19] = y),
        (e[20] = l))
      : (l = e[20]),
    l
  );
};
function Ft(e) {
  const { pageParam: i } = e;
  return he(i, 10);
}
function kt(e) {
  if (!(!e || e.length < 10)) return e[e.length - 1].created_at;
}
function Lt(e) {
  return e;
}
function Nt(e, i) {
  const s = e.find((t) => t.user.id === i.user_id);
  return (
    s ? s.stories.push(i) : e.push({ user: i.user, stories: [i], isSeen: !1 }),
    e
  );
}
var Tt = G();
const ts = () => {
  const e = (0, Tt.c)(61),
    { id: i } = oe(),
    s = ee(),
    { currentUser: t } = se(),
    { onlineUsers: o } = Ee(),
    a = te(),
    [n, y] = (0, C.useState)("");
  let m;
  e[0] === Symbol.for("react.memo_cache_sentinel")
    ? ((m = []), (e[0] = m))
    : (m = e[0]);
  const [f, u] = (0, C.useState)(m),
    {
      conversations: r,
      isConvLoading: v,
      refetchConversations: M,
      refetchMessages: p,
      sendMessage: g,
      editMessage: c,
      sendTypingStatus: P,
      typingStatus: h,
      markAsRead: b,
      formatMessages: l,
      onDeleteMessage: d,
      onToggleReaction: _,
      conversationReactions: w,
      messages: R,
      isMsgLoading: S,
      fetchNextMessages: T,
      hasMoreMessages: N,
      isFetchingMoreMessages: A,
    } = st(t, i);
  let B;
  e: {
    if (!i || r.length === 0) {
      B = null;
      break e;
    }
    let X;
    (e[1] !== r || e[2] !== i
      ? ((X = r.find((Y) => Y.id === i) || null),
        (e[1] = r),
        (e[2] = i),
        (e[3] = X))
      : (X = e[3]),
      (B = X));
  }
  const F = B;
  let x, q;
  (e[4] !== i || e[5] !== b
    ? ((x = () => {
        i && b(i);
      }),
      (q = [i, b]),
      (e[4] = i),
      (e[5] = b),
      (e[6] = x),
      (e[7] = q))
    : ((x = e[6]), (q = e[7])),
    (0, C.useEffect)(x, q));
  let E;
  e[8] !== r || e[9] !== t?.id || e[10] !== n
    ? ((E = () => {
        const X = setTimeout(async () => {
          if (n.length > 1) {
            const Y = await Je(n),
              ce = r.map(xt);
            u(Y.filter((ue) => ue.id !== t?.id && !ce.includes(ue.id)));
          } else u([]);
        }, 300);
        return () => clearTimeout(X);
      }),
      (e[8] = r),
      (e[9] = t?.id),
      (e[10] = n),
      (e[11] = E))
    : (E = e[11]);
  const L = t?.id;
  let K;
  (e[12] !== r || e[13] !== n || e[14] !== L
    ? ((K = [n, r, L]), (e[12] = r), (e[13] = n), (e[14] = L), (e[15] = K))
    : (K = e[15]),
    (0, C.useEffect)(E, K));
  let D;
  e[16] !== t || e[17] !== s || e[18] !== a
    ? ((D = async (X) => {
        if (t)
          try {
            const Y = await Fe(t.id, X.id);
            (a.invalidateQueries({ queryKey: ["conversations", t.id] }),
              y(""),
              s(`/m/${Y}`));
          } catch (Y) {
            console.error("Failed to start conversation:", Y);
          }
      }),
      (e[16] = t),
      (e[17] = s),
      (e[18] = a),
      (e[19] = D))
    : (D = e[19]);
  const H = D;
  let J;
  e[20] !== s
    ? ((J = (X) => {
        s(`/m/${X.id}`);
      }),
      (e[20] = s),
      (e[21] = J))
    : (J = e[21]);
  const O = J;
  let k;
  e[22] !== w || e[23] !== l || e[24] !== R
    ? ((k = l(R, w)), (e[22] = w), (e[23] = l), (e[24] = R), (e[25] = k))
    : (k = e[25]);
  const V = k;
  let W;
  if (e[26] !== r || e[27] !== n) {
    let X;
    (e[29] !== n
      ? ((X = (Y) =>
          Y.user?.name?.toLowerCase().includes(n.toLowerCase()) ||
          Y.user?.handle?.toLowerCase().includes(n.toLowerCase()) ||
          Y.lastMessage?.toLowerCase().includes(n.toLowerCase())),
        (e[29] = n),
        (e[30] = X))
      : (X = e[30]),
      (W = r.filter(X)),
      (e[26] = r),
      (e[27] = n),
      (e[28] = W));
  } else W = e[28];
  const Q = W,
    j = F && h[F.id];
  let $;
  e[31] !== o || e[32] !== F
    ? (($ = F && F.user?.id && o.has(F.user.id)),
      (e[31] = o),
      (e[32] = F),
      (e[33] = $))
    : ($ = e[33]);
  const z = $;
  let re;
  return (
    e[34] !== r ||
    e[35] !== j ||
    e[36] !== t ||
    e[37] !== c ||
    e[38] !== T ||
    e[39] !== Q ||
    e[40] !== O ||
    e[41] !== H ||
    e[42] !== N ||
    e[43] !== i ||
    e[44] !== v ||
    e[45] !== A ||
    e[46] !== S ||
    e[47] !== V ||
    e[48] !== n ||
    e[49] !== s ||
    e[50] !== d ||
    e[51] !== _ ||
    e[52] !== o ||
    e[53] !== z ||
    e[54] !== M ||
    e[55] !== p ||
    e[56] !== F ||
    e[57] !== g ||
    e[58] !== P ||
    e[59] !== f
      ? ((re = {
          id: i,
          currentUser: t,
          onlineUsers: o,
          msgSearchQuery: n,
          setMsgSearchQuery: y,
          userSearchResults: f,
          conversations: r,
          filteredConversations: Q,
          selectedConversation: F,
          localMessages: V,
          isConvLoading: v,
          isMsgLoading: S,
          currentIsTyping: j,
          otherUserIsOnline: z,
          handleStartConversation: H,
          handleSelectConversation: O,
          refetchConversations: M,
          refetchMessages: p,
          sendMessage: g,
          editMessage: c,
          onDeleteMessage: d,
          sendTypingStatus: P,
          onToggleReaction: _,
          navigate: s,
          fetchNextMessages: T,
          hasMoreMessages: N,
          isFetchingMoreMessages: A,
        }),
        (e[34] = r),
        (e[35] = j),
        (e[36] = t),
        (e[37] = c),
        (e[38] = T),
        (e[39] = Q),
        (e[40] = O),
        (e[41] = H),
        (e[42] = N),
        (e[43] = i),
        (e[44] = v),
        (e[45] = A),
        (e[46] = S),
        (e[47] = V),
        (e[48] = n),
        (e[49] = s),
        (e[50] = d),
        (e[51] = _),
        (e[52] = o),
        (e[53] = z),
        (e[54] = M),
        (e[55] = p),
        (e[56] = F),
        (e[57] = g),
        (e[58] = P),
        (e[59] = f),
        (e[60] = re))
      : (re = e[60]),
    re
  );
};
function xt(e) {
  return e.user?.id;
}
var Dt = G();
const ss = () => {
  const e = (0, Dt.c)(48),
    { currentUser: i } = se(),
    s = ee(),
    t = te(),
    o = i?.id;
  let a;
  e[0] !== o
    ? ((a = ["notifications", o]), (e[0] = o), (e[1] = a))
    : (a = e[1]);
  let n;
  e[2] !== i?.id
    ? ((n = (q) => {
        const { pageParam: E } = q;
        return je(i?.id, E, 10);
      }),
      (e[2] = i?.id),
      (e[3] = n))
    : (n = e[3]);
  const y = !!i?.id;
  let m;
  e[4] !== a || e[5] !== n || e[6] !== y
    ? ((m = {
        queryKey: a,
        queryFn: n,
        enabled: y,
        initialPageParam: null,
        getNextPageParam: Qt,
      }),
      (e[4] = a),
      (e[5] = n),
      (e[6] = y),
      (e[7] = m))
    : (m = e[7]);
  const {
    data: f,
    fetchNextPage: u,
    hasNextPage: r,
    isFetchingNextPage: v,
    isLoading: M,
    refetch: p,
  } = Z(m);
  let g;
  e[8] !== f?.pages
    ? ((g = f?.pages.flatMap(Kt) || []), (e[8] = f?.pages), (e[9] = g))
    : (g = e[9]);
  const c = g;
  let P;
  e[10] !== i || e[11] !== t
    ? ((P = () => {
        if (!i?.id) return;
        const q = U.channel(`user_notifications:${i.id}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notifications",
              filter: `recipient_id=eq.${i.id}`,
            },
            () => {
              t.invalidateQueries({ queryKey: ["notifications", i.id] });
            },
          )
          .subscribe();
        return () => {
          U.removeChannel(q);
        };
      }),
      (e[10] = i),
      (e[11] = t),
      (e[12] = P))
    : (P = e[12]);
  const h = i?.id;
  let b;
  (e[13] !== t || e[14] !== h
    ? ((b = [h, t]), (e[13] = t), (e[14] = h), (e[15] = b))
    : (b = e[15]),
    (0, C.useEffect)(P, b));
  let l;
  e[16] !== i
    ? ((l = () => (i ? Re(i.id) : Promise.resolve())), (e[16] = i), (e[17] = l))
    : (l = e[17]);
  let d, _, w;
  e[18] !== i?.id || e[19] !== t
    ? ((d = async () => {
        await t.cancelQueries({ queryKey: ["notifications", i?.id] });
        const q = t.getQueryData(["notifications", i?.id]);
        return (
          t.setQueryData(["notifications", i?.id], Ot),
          { previousNotifications: q }
        );
      }),
      (_ = (q, E, L) => {
        L?.previousNotifications &&
          t.setQueryData(["notifications", i?.id], L.previousNotifications);
      }),
      (w = () => {
        t.invalidateQueries({ queryKey: ["notifications", i?.id] });
      }),
      (e[18] = i?.id),
      (e[19] = t),
      (e[20] = d),
      (e[21] = _),
      (e[22] = w))
    : ((d = e[20]), (_ = e[21]), (w = e[22]));
  let R;
  e[23] !== d || e[24] !== _ || e[25] !== w || e[26] !== l
    ? ((R = { mutationFn: l, onMutate: d, onError: _, onSettled: w }),
      (e[23] = d),
      (e[24] = _),
      (e[25] = w),
      (e[26] = l),
      (e[27] = R))
    : (R = e[27]);
  const S = ie(R);
  let T;
  e[28] !== s
    ? ((T = (q) => {
        q.type === "follow"
          ? s(`/u/${q.user}`)
          : q.post_id && s(`/p/${q.post_id}`);
      }),
      (e[28] = s),
      (e[29] = T))
    : (T = e[29]);
  const N = T;
  let A;
  e[30] !== i?.id || e[31] !== S || e[32] !== c
    ? ((A = () => {
        i?.id && c.some(Bt) && S.mutate();
      }),
      (e[30] = i?.id),
      (e[31] = S),
      (e[32] = c),
      (e[33] = A))
    : (A = e[33]);
  const B = i?.id;
  let F;
  (e[34] !== S || e[35] !== c.length || e[36] !== B
    ? ((F = [B, c.length, S]),
      (e[34] = S),
      (e[35] = c.length),
      (e[36] = B),
      (e[37] = F))
    : (F = e[37]),
    (0, C.useEffect)(A, F));
  let x;
  return (
    e[38] !== i ||
    e[39] !== u ||
    e[40] !== N ||
    e[41] !== r ||
    e[42] !== v ||
    e[43] !== M ||
    e[44] !== s ||
    e[45] !== c ||
    e[46] !== p
      ? ((x = {
          currentUser: i,
          notifications: c,
          isLoading: M,
          isFetchingMore: v,
          hasMore: r,
          loadNotifications: u,
          refreshNotifications: p,
          handleNotificationClick: N,
          navigate: s,
        }),
        (e[38] = i),
        (e[39] = u),
        (e[40] = N),
        (e[41] = r),
        (e[42] = v),
        (e[43] = M),
        (e[44] = s),
        (e[45] = c),
        (e[46] = p),
        (e[47] = x))
      : (x = e[47]),
    x
  );
};
function Qt(e) {
  if (!(!e || e.length < 10)) return e[e.length - 1].created_at;
}
function Kt(e) {
  return e;
}
function Et(e) {
  return { ...e, is_read: !0 };
}
function At(e) {
  return e.map(Et);
}
function Ot(e) {
  return e && { ...e, pages: e.pages.map(At) };
}
function Bt(e) {
  return !e.is_read;
}
var jt = G();
const is = () => {
    const e = (0, jt.c)(23),
      { id: i } = oe(),
      s = ee(),
      { currentUser: t } = se(),
      { addToast: o } = ae(),
      a = te();
    let n, y;
    e[0] !== i
      ? ((n = ["post", i]),
        (y = async () => {
          if (!i || !I(i)) throw new Error("Invalid post ID");
          return we(i);
        }),
        (e[0] = i),
        (e[1] = n),
        (e[2] = y))
      : ((n = e[1]), (y = e[2]));
    const m = !!i;
    let f;
    e[3] !== n || e[4] !== y || e[5] !== m
      ? ((f = { queryKey: n, queryFn: y, enabled: m, retry: !1 }),
        (e[3] = n),
        (e[4] = y),
        (e[5] = m),
        (e[6] = f))
      : (f = e[6]);
    const { data: u, isLoading: r, isError: v } = ne(f);
    let M;
    e[7] !== s
      ? ((M = (l) => {
          s(`/u/${l}`);
        }),
        (e[7] = s),
        (e[8] = M))
      : (M = e[8]);
    const p = M;
    let g;
    e[9] !== s
      ? ((g = () => {
          s(-1);
        }),
        (e[9] = s),
        (e[10] = g))
      : (g = e[10]);
    const c = g;
    let P;
    e[11] !== a
      ? ((P = (l, d, _) => {
          a.setQueryData(
            ["post", l],
            (w) => w && { ...w, content: d, media: _ },
          );
        }),
        (e[11] = a),
        (e[12] = P))
      : (P = e[12]);
    const h = P;
    let b;
    return (
      e[13] !== o ||
      e[14] !== t ||
      e[15] !== c ||
      e[16] !== h ||
      e[17] !== p ||
      e[18] !== v ||
      e[19] !== r ||
      e[20] !== s ||
      e[21] !== u
        ? ((b = {
            post: u,
            isLoading: r,
            isError: v,
            currentUser: t,
            addToast: o,
            navigate: s,
            handleUserClick: p,
            handleDelete: c,
            handleUpdate: h,
          }),
          (e[13] = o),
          (e[14] = t),
          (e[15] = c),
          (e[16] = h),
          (e[17] = p),
          (e[18] = v),
          (e[19] = r),
          (e[20] = s),
          (e[21] = u),
          (e[22] = b))
        : (b = e[22]),
      b
    );
  },
  ns = () => {
    const e = ee(),
      { id: i } = oe(),
      [s] = de(),
      t = i || s.get("id"),
      o = (0, C.useRef)(null),
      a = (0, C.useRef)(new Map()),
      [n, y] = (0, C.useState)(null),
      [m, f] = (0, C.useState)(!0),
      {
        data: u,
        fetchNextPage: r,
        hasNextPage: v,
        isFetchingNextPage: M,
        isLoading: p,
      } = Z({
        queryKey: ["reels"],
        queryFn: ({ pageParam: l }) => xe(l, 10),
        initialPageParam: null,
        getNextPageParam: (l) => {
          if (!(!l || l.length < 10))
            return l[l.length - 1].sort_timestamp || l[l.length - 1].created_at;
        },
      }),
      g = (0, C.useMemo)(() => u?.pages.flatMap((l) => l) || [], [u]);
    ((0, C.useEffect)(() => {
      if (g.length > 0)
        if (t)
          if (g.find((l) => l.id === t)) {
            y(t);
            const l = a.current.get(t);
            l && l.scrollIntoView({ behavior: "instant" });
          } else n || y(g[0].id);
        else n || y(g[0].id);
    }, [g, t, n]),
      (0, C.useEffect)(() => {
        if (g.length === 0) return;
        const l = { root: o.current, threshold: 0.6 },
          d = (w) => {
            w.forEach((R) => {
              if (R.isIntersecting) {
                const S = R.target.getAttribute("data-id");
                S && y(S);
              }
            });
          },
          _ = new IntersectionObserver(d, l);
        return (a.current.forEach((w) => _.observe(w)), () => _.disconnect());
      }, [g.length]));
    const c = () => {
      f(!m);
    };
    (0, C.useEffect)(() => {
      const l = (d) => {
        const _ = d.target;
        if (
          !(
            _.tagName === "INPUT" ||
            _.tagName === "TEXTAREA" ||
            _.isContentEditable
          ) &&
          !(d.ctrlKey || d.altKey || d.metaKey)
        )
          switch (d.key) {
            case "ArrowUp":
              (d.preventDefault(), h());
              break;
            case "ArrowDown":
              (d.preventDefault(), P());
              break;
            case "m":
            case "M":
              c();
              break;
            case " ":
              d.preventDefault();
              const w = a.current.get(n || "");
              if (w) {
                const R = w.querySelector(".reel-item");
                R && R.click();
              }
              break;
          }
      };
      return (
        window.addEventListener("keydown", l),
        () => window.removeEventListener("keydown", l)
      );
    }, [n, g, m]);
    const P = () => {
        if (g.length === 0) return;
        const l = g.findIndex((d) => d.id === n);
        if (l < g.length - 1) {
          const d = g[l + 1];
          a.current.get(d.id)?.scrollIntoView({ behavior: "smooth" });
        }
      },
      h = () => {
        if (g.length === 0) return;
        const l = g.findIndex((d) => d.id === n);
        if (l > 0) {
          const d = g[l - 1];
          a.current.get(d.id)?.scrollIntoView({ behavior: "smooth" });
        }
      },
      b = (l, d) => {
        d ? a.current.set(l, d) : a.current.delete(l);
      };
    return (
      (0, C.useEffect)(() => {
        const l = () => {
            if (!o.current || M || !v) return;
            const {
              scrollTop: _,
              scrollHeight: w,
              clientHeight: R,
            } = o.current;
            _ + R >= w - 800 && r();
          },
          d = o.current;
        if (d)
          return (
            d.addEventListener("scroll", l),
            () => d.removeEventListener("scroll", l)
          );
      }, [M, v, r]),
      {
        reels: g,
        loading: p,
        loadingMore: M,
        activeReelId: n,
        hasMore: v,
        isMuted: m,
        containerRef: o,
        setReelRef: b,
        navigate: e,
        toggleMute: c,
        scrollToNext: P,
        scrollToPrev: h,
        loadReels: r,
      }
    );
  },
  as = () => {
    const { currentUser: e, logout: i } = se(),
      {
        darkMode: s,
        toggleDarkMode: t,
        fontSize: o,
        setFontSize: a,
        dataSaver: n,
        setDataSaver: y,
      } = We(),
      { addToast: m } = ae(),
      [f, u] = (0, C.useState)(!1),
      [r, v] = (0, C.useState)({ newPassword: "", confirmPassword: "" }),
      [M, p] = (0, C.useState)(!1),
      g = async () => {
        try {
          (await i(), m("Logged out successfully"));
        } catch (_) {
          (console.error("Logout error:", _), m("Failed to logout"));
        }
      };
    return {
      currentUser: e,
      darkMode: s,
      toggleDarkMode: t,
      fontSize: o,
      setFontSize: a,
      dataSaver: n,
      setDataSaver: y,
      isChangingPassword: f,
      setIsChangingPassword: u,
      passwordData: r,
      setPasswordData: v,
      loading: M,
      handleLogout: g,
      handlePasswordChange: async (_) => {
        if ((_.preventDefault(), r.newPassword !== r.confirmPassword)) {
          m("Passwords do not match", "error");
          return;
        }
        if (r.newPassword.length < 6) {
          m("Password must be at least 6 characters", "error");
          return;
        }
        p(!0);
        try {
          const { error: w } = await U.auth.updateUser({
            password: r.newPassword,
          });
          if (w) throw w;
          (m("Password updated successfully!"),
            u(!1),
            v({ newPassword: "", confirmPassword: "" }));
        } catch (w) {
          (console.error("Password update error:", w),
            m(w.message || "Failed to update password", "error"));
        } finally {
          p(!1);
        }
      },
      handlePasswordReset: async () => {
        if (e?.email) {
          p(!0);
          try {
            const { error: _ } = await U.auth.resetPasswordForEmail(e.email, {
              redirectTo: `${window.location.origin}/settings?type=recovery`,
            });
            if (_) throw _;
            m("Password reset email sent!");
          } catch (_) {
            (console.error("Reset password error:", _),
              m(_.message || "Failed to send reset email", "error"));
          } finally {
            p(!1);
          }
        }
      },
      handleClearCache: () => {
        (["seenStories", "font-size", "data-saver", "theme"].forEach((_) =>
          localStorage.removeItem(_),
        ),
          m("Cache cleared! Reloading..."),
          setTimeout(() => window.location.reload(), 1500));
      },
      handleDownloadData: async () => {
        if (e) {
          p(!0);
          try {
            const _ = {
                user: {
                  id: e.id,
                  handle: e.handle,
                  name: e.name,
                  email: e.email,
                },
                exportDate: new Date().toISOString(),
                note: "This is a mock export of your Sysm data.",
              },
              w = new Blob([JSON.stringify(_, null, 2)], {
                type: "application/json",
              }),
              R = URL.createObjectURL(w),
              S = document.createElement("a");
            ((S.href = R),
              (S.download = `sysm-data-${e.handle}.json`),
              S.click(),
              URL.revokeObjectURL(R),
              m("Data export started!"));
          } catch {
            m("Failed to export data", "error");
          } finally {
            p(!1);
          }
        }
      },
      handleDeleteAccount: () => {
        window.confirm(
          "Are you absolutely sure? This will permanently delete your account and all associated data. This action is irreversible.",
        ) &&
          (m("Account deletion request submitted. Logging out..."),
          setTimeout(g, 2e3));
      },
      handleReportBug: () => {
        window.prompt("Please describe the bug you found:") &&
          m("Bug reported! Thank you for your feedback.");
      },
    };
  };
export {
  ts as a,
  It as c,
  Gt as d,
  Xt as f,
  ss as i,
  Zt as l,
  ns as n,
  es as o,
  Wt as p,
  is as r,
  Ut as s,
  as as t,
  Yt as u,
};
