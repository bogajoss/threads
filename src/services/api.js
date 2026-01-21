import { supabase } from '../lib/supabase';

/**
 * Uploads a file to Supabase Storage.
 * @param {File} file 
 * @param {string} bucket 
 */
export const uploadFile = async (file, bucket = 'media') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return {
        url: publicUrl,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' :
            file.type.startsWith('video/') ? 'video' : 'file',
        size: file.size
    };
};

/**
 * Fetches all posts with user details.
 */
export const fetchPosts = async () => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }

    return data.map(post => ({
        ...post,
        stats: {
            comments: post.comments_count || 0,
            likes: post.likes_count || 0,
            collects: post.collects_count || 0,
            mirrors: post.mirrors_count || 0
        },
        user: {
            ...post.user,
            handle: post.user.username,
            name: post.user.display_name,
            avatar: post.user.avatar_url,
            verified: post.user.is_verified
        },
        timeAgo: new Date(post.created_at).toLocaleDateString()
    }));
};

/**
 * Fetches a single post by ID.
 */
export const fetchPostById = async (id) => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `)
        .eq('id', id)
        .single();

    if (error) throw error;

    return {
        ...data,
        stats: {
            comments: data.comments_count || 0,
            likes: data.likes_count || 0,
            collects: data.collects_count || 0,
            mirrors: data.mirrors_count || 0
        },
        user: {
            ...data.user,
            handle: data.user.username,
            name: data.user.display_name,
            avatar: data.user.avatar_url,
            verified: data.user.is_verified
        },
        timeAgo: new Date(data.created_at).toLocaleDateString()
    };
};

/**
 * Adds a new post with media and optional poll.
 */
export const addPost = async ({ content, media = [], type = 'text', userId, poll = null, parentId = null }) => {
    const { data, error } = await supabase
        .from('posts')
        .insert([{
            user_id: userId,
            content,
            media,
            type,
            poll,
            parent_id: parentId,
            created_at: new Date().toISOString()
        }])
        .select();

    if (error) throw error;
    return {
        ...data[0],
        stats: { comments: 0, likes: 0, collects: 0, mirrors: 0 }
    };
};

/**
 * Fetches all user profiles.
 */
export const fetchProfiles = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*');

    if (error) throw error;

    return data.reduce((acc, user) => {
        acc[user.username] = {
            ...user,
            handle: user.username,
            name: user.display_name,
            avatar: user.avatar_url,
            verified: user.is_verified
        };
        return acc;
    }, {});
};

/**
 * Fetches notifications for the recipient_id.
 */
export const fetchNotifications = async (userId) => {
    if (!userId) return [];

    const { data, error } = await supabase
        .from('notifications')
        .select(`
            *,
            actor:users!actor_id (
                username,
                avatar_url
            )
        `)
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(n => ({
        ...n,
        user: n.actor.username,
        avatar: n.actor.avatar_url
    }));
};

/**
 * Fetches conversations for the current user.
 */
export const fetchConversations = async (userId) => {
    if (!userId) return [];

    const { data, error } = await supabase
        .from('conversation_participants')
        .select(`
            conversation:conversations (
                id,
                last_message_at
            ),
            other_participants:conversation_participants!inner (
                user:users (
                    username,
                    display_name,
                    avatar_url
                )
            )
        `)
        .eq('user_id', userId)
        .neq('other_participants.user_id', userId);

    if (error) throw error;

    return data.map(item => {
        const otherUser = item.other_participants[0]?.user;
        return {
            id: item.conversation.id,
            handle: otherUser?.username,
            user: {
                handle: otherUser?.username,
                name: otherUser?.display_name,
                avatar: otherUser?.avatar_url
            },
            lastMessage: 'Open to see messages',
            time: new Date(item.conversation.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: 0
        };
    });
};

/**
 * Fetches messages for a specific conversation.
 */
export const fetchMessages = async (conversationId) => {
    const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
};

/**
 * Sends a new message and updates conversation timestamp.
 */
export const sendMessage = async (conversationId, senderId, content) => {
    const { data, error } = await supabase
        .from('messages')
        .insert([{ conversation_id: conversationId, sender_id: senderId, content }])
        .select();

    if (error) throw error;

    await supabase
        .from('conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', conversationId);

    return data[0];
};

/**
 * Fetches all comments for a post.
 */
export const fetchCommentsByPostId = async (postId) => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `)
        .eq('parent_id', postId)
        .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(comment => ({
        ...comment,
        user: {
            ...comment.user,
            handle: comment.user.username,
            name: comment.user.display_name,
            avatar: comment.user.avatar_url,
            verified: comment.user.is_verified
        },
        timeAgo: new Date(comment.created_at).toLocaleDateString()
    }));
};

/**
 * Adds a comment to a post.
 */
export const addComment = async (postId, userId, content) => {
    const { data, error } = await supabase
        .from('posts')
        .insert([{
            parent_id: postId,
            user_id: userId,
            content,
            type: 'text',
            created_at: new Date().toISOString()
        }])
        .select();

    if (error) throw error;
    return {
        ...data[0],
        stats: { comments: 0, likes: 0, collects: 0, mirrors: 0 }
    };
};

/**
 * Toggles a like on a post.
 */
export const toggleLike = async (postId, userId) => {
    // Check if already liked
    const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

    if (existingLike) {
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', userId);
        if (error) throw error;
        return false; // Unliked
    } else {
        const { error } = await supabase
            .from('likes')
            .insert([{ post_id: postId, user_id: userId }]);
        if (error) throw error;
        return true; // Liked
    }
};

/**
 * Checks if a user has liked a post.
 */
export const checkIfLiked = async (postId, userId) => {
    if (!userId) return false;
    const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();
    return !!data;
};

/**
 * Toggles a follow on a user.
 */
export const toggleFollow = async (followerId, followingId) => {
    const { data: existingFollow } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .maybeSingle();

    if (existingFollow) {
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', followerId)
            .eq('following_id', followingId);
        if (error) throw error;
        return false;
    } else {
        const { error } = await supabase
            .from('follows')
            .insert([{ follower_id: followerId, following_id: followingId }]);
        if (error) throw error;
        return true;
    }
};

/**
 * Checks if a user is following another user.
 */
export const checkIfFollowing = async (followerId, followingId) => {
    if (!followerId) return false;
    const { data } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .maybeSingle();
    return !!data;
};

/**
 * Fetches follow stats (follower/following counts).
 */
export const fetchFollowStats = async (userId) => {
    const { data, error } = await supabase
        .from('users')
        .select('follower_count, following_count')
        .eq('id', userId)
        .maybeSingle();

    if (error || !data) return { followers: 0, following: 0 };

    return {
        followers: data.follower_count || 0,
        following: data.following_count || 0
    };
};
