import { formatTimeAgo } from "./utils";
import type {
  User,
  Post,
  Comment,
  Notification,
  Story,
  Community,
  Message,
  Conversation,
} from "@/types/index";

export const transformUser = (supabaseUser: any): User | null => {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    handle: supabaseUser.username,
    name: supabaseUser.display_name,
    avatar: supabaseUser.avatar_url || "/default-avatar.webp",
    cover: supabaseUser.cover_url || "/welcome-banner.webp",
    verified: supabaseUser.is_verified ?? false,
    role: supabaseUser.role || "user",
    roles: supabaseUser.roles || "Newbie",
    isPro: supabaseUser.is_pro || false,
    postsCount: supabaseUser.posts_count || 0,
    bio: supabaseUser.bio,
    location: supabaseUser.location,
    website: supabaseUser.website,
    follower_count: supabaseUser.follower_count || 0,
    following_count: supabaseUser.following_count || 0,
    lastSeen: supabaseUser.last_seen_at,
    isBanned: supabaseUser.is_banned || false,
    onboarding_completed: supabaseUser.onboarding_completed || false,
  };
};

export const transformPost = (post: any): Post | null => {
  if (!post) return null;

  const reposterId =
    post.reposter_id || post.reposter_data?.id || post.reposted_by?.id;

  const timestamp = new Date(post.sort_timestamp || post.created_at).getTime();
  
  // RPC feeds return post_id; direct queries return id
  const postId = post.id || post.post_id;
  
  const baseKey =
    post.feed_id ||
    (reposterId ? `${postId}-${reposterId}` : `${postId}-orig`);
  const uniqueKey = `${baseKey}-${timestamp}`;

  const user = transformUser(post.author_data || post.user);
  if (!user) return null;

  return {
    ...post,
    id: postId,
    feed_id: uniqueKey,
    score: post.rank_score || post.score,
    type: post.type || "text",
    user_id: post.user_id,
    community_id: post.community_id || null,
    parent_id: post.parent_id || null,
    poll: post.poll || null,
    quoted_post_id: post.quoted_post_id || null,
    stats: {
      comments: post.comments_count || 0,
      likes: post.likes_count || 0,
      reposts: post.mirrors_count || 0,
      views: post.views_count || 0,
    },
    user: user,
    community:
      post.community_data || post.communities
        ? {
            ...(post.community_data || post.communities),
            avatar:
              (post.community_data || post.communities).avatar_url ||
              (post.community_data || post.communities).avatar,
          }
        : null,
    repostedBy: post.reposter_data
      ? {
          handle: post.reposter_data.username,
          name: post.reposter_data.display_name,
          id: post.reposter_data.id,
        }
      : post.reposted_by
        ? {
            handle: post.reposted_by.username,
            name: post.reposted_by.display_name,
            id: post.reposted_by.id,
          }
        : null,
    commenterAvatars: post.commenter_avatars || [],
    timeAgo: formatTimeAgo(post.created_at),
  };
};

export const transformComment = (comment: any): Comment | null => {
  if (!comment) return null;

  const user = transformUser(comment.user);
  if (!user) return null;

  return {
    ...comment,
    parent_id: comment.parent_id,
    stats: {
      likes: comment.likes_count || 0,
      comments: comment.replies_count || 0,
    },
    user: user,
    timeAgo: formatTimeAgo(comment.created_at),
  };
};

export const transformNotification = (n: any): Notification | null => {
  if (!n) return null;
  return {
    ...n,
    user: n.actor?.username,
    avatar: n.actor?.avatar_url || "/default-avatar.webp",
  };
};

export const transformStory = (s: any): Story | null => {
  if (!s) return null;
  const user = transformUser(s.user);
  if (!user) return null;
  return {
    ...s,
    media: s.media_url,
    user: user,
  };
};

export const transformCommunity = (c: any): Community | null => {
  if (!c) return null;
  return {
    id: c.id,
    handle: c.handle,
    name: c.name,
    description: c.description,
    avatar: c.avatar_url || "/default-avatar.webp",
    cover: c.cover_url || "/welcome-banner.webp",
    membersCount: c.members_count || 0,
    postsCount: c.posts_count || 0,
    isPrivate: c.is_private,
    createdAt: c.created_at,
    type: "community",
    creatorId: c.creator_id,
  };
};

export const transformMessage = (m: any): Message | null => {
  if (!m) return null;
  return {
    id: m.id,
    conversation_id: m.conversation_id,
    sender_id: m.sender_id,
    sender: transformUser(m.sender),
    content: m.content,
    type: m.type || "text",
    media: m.media || [],
    reply_to_id: m.reply_to_id,
    reply_to: m.reply_to
      ? {
          id: m.reply_to.id,
          content: m.reply_to.content,
          sender: {
            id: m.reply_to.sender?.id,
            username: m.reply_to.sender?.username,
            display_name: m.reply_to.sender?.display_name,
          },
        }
      : null,
    is_read: m.is_read,
    created_at: m.created_at,
  };
};

export const transformConversation = (
  item: any,
  currentUserId: string,
): Conversation | null => {
  if (!item || !item.conversation) return null;
  const conv = item.conversation;

  const otherParticipant = !conv.is_group
    ? conv.participants?.find((p: any) => p.user?.id !== currentUserId) ||
      conv.participants?.[0]
    : null;

  const messages = conv.messages || [];
  const unreadCount = messages.filter((m: any) => {
    return (
      !m.is_read &&
      m.sender_id &&
      currentUserId &&
      m.sender_id.toString().toLowerCase() !==
        currentUserId.toString().toLowerCase()
    );
  }).length;

  const lastMessage = messages[0];
  const isLastMessageFromMe = lastMessage?.sender_id === currentUserId;

  return {
    id: conv.id,
    isGroup: conv.is_group || false,
    name:
      conv.name ||
      (otherParticipant ? otherParticipant.user?.display_name : "Unknown"),
    avatar:
      conv.avatar_url ||
      (otherParticipant ? otherParticipant.user?.avatar_url : null),
    creatorId: conv.creator_id || null,
    user: otherParticipant ? transformUser(otherParticipant.user) : null,
    lastMessage: conv.last_message_content || "No messages yet",
    lastMessageAt: conv.last_message_at,
    lastMessageSender: null,
    currentUserSent: isLastMessageFromMe,
    time: conv.last_message_at
      ? new Date(conv.last_message_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "",
    unread: unreadCount,
    isMuted: false,
  };
};
