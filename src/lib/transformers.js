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
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Sysm",
    cover:
      supabaseUser.cover_url ||
      "https://systemadminbd.com/uploads/675346dd55e0c7.43939630.png",
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
  const uniqueKey = post.feed_id || (reposterId ? `${post.id}-${reposterId}` : `${post.id}-orig`);

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
    repostedBy: post.reposter_data ? {
      handle: post.reposter_data.username,
      name: post.reposter_data.display_name,
      id: post.reposter_data.id
    } : (post.reposted_by ? {
      handle: post.reposted_by.username,
      name: post.reposted_by.display_name,
      id: post.reposted_by.id
    } : null),
    timeAgo: new Date(post.created_at).toLocaleDateString(), // Could be improved with a proper timeAgo lib
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
    timeAgo: new Date(comment.created_at).toLocaleDateString(),
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
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Sysm",
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
