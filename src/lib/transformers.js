/**
 * Transforms a Supabase user object into the application's user format.
 */
export const transformUser = (supabaseUser) => {
    if (!supabaseUser) return null;
    
    return {
        id: supabaseUser.id,
        handle: supabaseUser.username,
        name: supabaseUser.display_name,
        avatar: supabaseUser.avatar_url || 'https://static.hey.xyz/images/brands/lens.svg',
        cover: supabaseUser.cover_url || 'https://static.hey.xyz/images/hero.webp',
        verified: supabaseUser.is_verified,
        bio: supabaseUser.bio,
        location: supabaseUser.location,
        website: supabaseUser.website,
        follower_count: supabaseUser.follower_count || 0,
        following_count: supabaseUser.following_count || 0,
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
            collects: post.collects_count || 0,
            mirrors: post.mirrors_count || 0
        },
        user: transformUser(post.user),
        timeAgo: new Date(post.created_at).toLocaleDateString() // Could be improved with a proper timeAgo lib
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
        avatar: n.actor?.avatar_url || 'https://static.hey.xyz/images/brands/lens.svg'
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
        user: transformUser(s.user)
    };
};

/**
 * Transforms a Supabase conversation participant object.
 */
export const transformConversation = (item, userId) => {
    const otherParticipant = item.other_participants?.find(p => p.user_id !== userId) || item.other_participants?.[0];
    const otherUser = otherParticipant?.user;
    
    return {
        id: item.conversation.id,
        handle: otherUser?.username,
        user: transformUser(otherUser),
        lastMessage: 'Open to see messages',
        time: new Date(item.conversation.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: 0
    };
};
