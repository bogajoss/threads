import { formatTimeAgo } from "./utils";
import type { User, Post, Comment, Notification, Story, Community, Message, Conversation } from "@/types/index";

/**
 * Transforms a Supabase user object into the application's user format.
 */
export const transformUser = (supabaseUser: any): User | null => {
    if (!supabaseUser) return null;

    return {
        id: supabaseUser.id,
        handle: supabaseUser.username,
        name: supabaseUser.display_name,
        avatar: supabaseUser.avatar_url || "/default-avatar.webp",
        cover: supabaseUser.cover_url || "/welcome-banner.webp",
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
export const transformPost = (post: any): Post | null => {
    if (!post) return null;

    // Generate a unique feed_id for React keys if not provided by the view
    const reposterId =
        post.reposter_id || post.reposter_data?.id || post.reposted_by?.id;
    
    // Use the feed_id from the view if available, otherwise construct a stable one
    // We append a timestamp to ensure uniqueness if the same post/repost appears multiple times 
    // (e.g. in different search contexts), but we keep it stable based on the data.
    const timestamp = new Date(post.sort_timestamp || post.created_at).getTime();
    const baseKey =
        post.feed_id ||
        (reposterId ? `${post.id}-${reposterId}` : `${post.id}-orig`);
    const uniqueKey = `${baseKey}-${timestamp}`;

    const user = transformUser(post.author_data || post.user);
    if (!user) return null; // Post needs a user

    return {
        ...post,
        feed_id: uniqueKey, // Always ensure this exists
        stats: {
            comments: post.comments_count || 0,
            likes: post.likes_count || 0,
            reposts: post.mirrors_count || 0,
            views: post.views_count || 0,
            shares: post.shares_count || 0,
        },
        // Handle data from either direct table query or unified view
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
        timeAgo: formatTimeAgo(post.created_at),
    };
};

/**
 * Transforms a Supabase comment object.
 */
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

/**
 * Transforms a Supabase notification object.
 */
export const transformNotification = (n: any): Notification | null => {
    if (!n) return null;
    return {
        ...n,
        user: n.actor?.username,
        avatar: n.actor?.avatar_url || "/default-avatar.webp",
    };
};

/**
 * Transforms a Supabase story object.
 */
export const transformStory = (s: any): Story | null => {
    if (!s) return null;
    const user = transformUser(s.user);
    if (!user) return null;
    return {
        ...s,
        media: s.media_url, // Map media_url to media for the UI
        user: user,
    };
};

/**
 * Transforms a Supabase community object.
 */
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

/**
 * Transforms a Supabase message object.
 */
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
        is_read: m.is_read,
        created_at: m.created_at,
    };
};

/**
 * Transforms a Supabase conversation participant object into a conversation object.
 */
export const transformConversation = (item: any, currentUserId: string): Conversation | null => {
    if (!item || !item.conversation) return null;
    const conv = item.conversation;

    // For DMs, find the other participant. For groups, this might be null or the list of users.
    const otherParticipant = !conv.is_group 
        ? (conv.participants?.find((p: any) => p.user?.id !== currentUserId) || conv.participants?.[0])
        : null;

    const unreadCount =
        conv.messages?.filter((m: any) => {
            // Only count if it's unread
            if (m.is_read) return false;
            // Only count if I am NOT the sender
            // Ensure both IDs exist and compare case-insensitively just in case
            return m.sender_id && currentUserId && m.sender_id.toString().toLowerCase() !== currentUserId.toString().toLowerCase();
        }).length || 0;

    return {
        id: conv.id,
        isGroup: conv.is_group || false,
        name: conv.name || null,
        avatar: conv.avatar_url || null,
        creatorId: conv.creator_id || null,
        user: otherParticipant ? transformUser(otherParticipant.user) : null,
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
