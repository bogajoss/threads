import { formatTimeAgo } from "./utils";

/**
 * Transforms a Supabase user object into the application's user format.
 */
export const transformUser = (supabaseUser) => {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    handle: supabaseUser.username,
    name: supabaseUser.display_name,
    avatar:
      supabaseUser.avatar_url ||
      "/default-avatar.webp",
    cover:
      supabaseUser.cover_url ||
      "/welcome-banner.webp",
    verified: supabaseUser.is_verified,
    bio: supabaseUser.bio,
    location: supabaseUser.location,
    website: supabaseUser.website,
    follower_count: supabaseUser.follower_count || 0,
    following_count: supabaseUser.following_count || 0,
    lastSeen: supabaseUser.last_seen_at,
  };
};

/**
 * Transforms a Supabase post object into the application's post format.
 */
export const transformPost = (post) => {
  if (!post) return null;

  // Generate a unique feed_id for React keys if not provided by the view
  const reposterId = post.reposter_id || (post.reposter_data?.id) || (post.reposted_by?.id);
  // Add a random suffix to ensure uniqueness even if the same post appears multiple times in the list
  const uniqueSuffix = Math.random().toString(36).substring(2, 9);
  // We construct a base ID but ALWAYS append the random suffix to ensure frontend uniqueness
  const baseId = post.feed_id || (reposterId ? `${post.id}-${reposterId}` : `${post.id}-orig`);
  const uniqueKey = `${baseId}-${uniqueSuffix}`;

  return {
    ...post,
    feed_id: uniqueKey, // Always ensure this exists
    stats: {
      comments: post.comments_count || 0,
      likes: post.likes_count || 0,
      mirrors: post.mirrors_count || 0,
    },
    // Handle data from either direct table query or unified view
    user: transformUser(post.author_data || post.user),
    community: (post.community_data || post.communities) ? {
      ...(post.community_data || post.communities),
      avatar: (post.community_data || post.communities).avatar_url || (post.community_data || post.communities).avatar
    } : null,
    repostedBy: post.reposter_data ? {
      handle: post.reposter_data.username,
      name: post.reposter_data.display_name,
      id: post.reposter_data.id
    } : (post.reposted_by ? {
      handle: post.reposted_by.username,
      name: post.reposted_by.display_name,
      id: post.reposted_by.id
    } : null),
    timeAgo: formatTimeAgo(post.created_at),
  };
};

/**
 * Transforms a Supabase comment object.
 */
export const transformComment = (comment) => {
  if (!comment) return null;

  return {
    ...comment,
    stats: {
      likes: comment.likes_count || 0,
    },
    user: transformUser(comment.user),
    timeAgo: formatTimeAgo(comment.created_at),
  };
};

/**
 * Transforms a Supabase notification object.
 */
export const transformNotification = (n) => {
  if (!n) return null;
  return {
    ...n,
    user: n.actor?.username,
    avatar:
      n.actor?.avatar_url ||
      "/default-avatar.webp",
  };
};

/**
 * Transforms a Supabase story object.
 */
export const transformStory = (s) => {
  if (!s) return null;
  return {
    ...s,
    media: s.media_url, // Map media_url to media for the UI
    user: transformUser(s.user),
  };
};

/**
 * Transforms a Supabase community object.
 */
export const transformCommunity = (c) => {
  if (!c) return null;
  return {
    id: c.id,
    handle: c.handle,
    name: c.name,
    description: c.description,
    avatar: c.avatar_url || '/default-avatar.webp',
    cover: c.cover_url || '/welcome-banner.webp',
    membersCount: c.members_count || 0,
    postsCount: c.posts_count || 0,
    isPrivate: c.is_private,
    createdAt: c.created_at,
    type: 'community',
    creatorId: c.creator_id
  };
};

/**
 * Transforms a Supabase message object.
 */
export const transformMessage = (m) => {
  if (!m) return null;
  return {
    id: m.id,
    conversation_id: m.conversation_id,
    sender_id: m.sender_id,
    content: m.content,
    type: m.type || "text",
    media: m.media || [],
    reply_to_id: m.reply_to_id,
    is_read: m.is_read,
    created_at: m.created_at,
  };
};

/**
 * Transforms a Supabase conversation participant object into a conversation object.
 */
export const transformConversation = (item, currentUserId) => {
  if (!item || !item.conversation) return null;
  const conv = item.conversation;
  
  const otherParticipant =
    conv.participants.find((p) => p.user?.id !== currentUserId) ||
    conv.participants[0];

  const unreadCount = conv.messages?.filter(
    (m) => !m.is_read && m.sender_id !== currentUserId
  ).length || 0;

  return {
    id: conv.id,
    user: transformUser(otherParticipant?.user),
    lastMessage: conv.last_message_content || "No messages yet",
    lastMessageAt: conv.last_message_at,
    time: conv.last_message_at
      ? new Date(conv.last_message_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "",
    unread: unreadCount,
  };
};
