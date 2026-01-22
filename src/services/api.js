import { supabase } from '@/lib/supabase';
import { transformUser, transformPost, transformNotification, transformConversation, transformStory } from '@/lib/transformers';
import { compressImage } from '@/lib/compression';

/**
 * Uploads a file to Supabase Storage.
 */
export const uploadFile = async (file, bucket = 'media') => {
    // Compress if it's an image
    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
        fileToUpload = await compressImage(file);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

    return {
        url: publicUrl,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' :
            file.type.startsWith('video/') ? 'video' : 'file',
        size: fileToUpload.size
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
                is_verified,
                bio,
                location,
                website,
                follower_count,
                following_count
            )
        `)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(transformPost);
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
                is_verified,
                bio,
                location,
                website,
                follower_count,
                following_count
            )
        `)
        .eq('id', id)
        .single();

    if (error) throw error;
    return transformPost(data);
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
        .select(`
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `);

    if (error) throw error;
    return transformPost(data[0]);
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
        const transformed = transformUser(user);
        acc[transformed.handle] = transformed;
        return acc;
    }, {});
};

/**
 * Fetches a single profile by handle.
 */
export const fetchProfileByHandle = async (handle) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', handle)
        .maybeSingle();

    if (error) throw error;
    return transformUser(data);
};

/**
 * Updates a user profile.
 */
export const updateProfile = async (userId, updatedFields) => {
    const { error } = await supabase
        .from('users')
        .update({
            display_name: updatedFields.name,
            username: updatedFields.handle,
            avatar_url: updatedFields.avatar,
            bio: updatedFields.bio,
            cover_url: updatedFields.cover,
            website: updatedFields.website,
            location: updatedFields.location
        })
        .eq('id', userId);

    if (error) throw error;
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
    return data.map(transformNotification);
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
                user_id,
                user:users (
                    id,
                    username,
                    display_name,
                    avatar_url
                )
            )
        `)
        .eq('user_id', userId);

    if (error) throw error;
    return data.map(item => transformConversation(item, userId));
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
    return data.map(transformPost);
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
        .select(`
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `);

    if (error) throw error;
    return transformPost(data[0]);
};

/**
 * Toggles a like on a post.
 */
export const toggleLike = async (postId, userId) => {
    const { data: existingLike } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .maybeSingle();

    if (existingLike) {
        await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId);
        return false;
    } else {
        await supabase.from('likes').insert([{ post_id: postId, user_id: userId }]);
        return true;
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
        await supabase.from('follows').delete().eq('follower_id', followerId).eq('following_id', followingId);
        return false;
    } else {
        await supabase.from('follows').insert([{ follower_id: followerId, following_id: followingId }]);
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
 * Fetches follow stats.
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

/**
 * Fetches recent stories.
 */
export const fetchStories = async () => {
    const { data, error } = await supabase
        .from('stories')
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
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(transformStory);
};

/**
 * Adds a new story.
 */
export const addStory = async (userId, mediaUrl, type = 'image') => {
    const { data, error } = await supabase
        .from('stories')
        .insert([{
            user_id: userId,
            media_url: mediaUrl,
            type,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }])
        .select(`
            *,
            user:users!user_id (
                id,
                username,
                display_name,
                avatar_url,
                is_verified
            )
        `);

    if (error) throw error;
    return transformStory(data[0]);
};
