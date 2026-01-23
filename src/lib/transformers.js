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

  return {
    ...post,
    stats: {
      comments: post.comments_count || 0,
      likes: post.likes_count || 0,
      mirrors: post.mirrors_count || 0,
    },
    user: transformUser(post.user),
    timeAgo: new Date(post.created_at).toLocaleDateString(), // Could be improved with a proper timeAgo lib
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
