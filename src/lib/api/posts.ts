import { supabase } from "@/lib/supabase";
import { transformPost, transformComment } from "@/lib/transformers";
import type { Post, Comment, Media } from "@/types/index";
import { POSTS_PER_PAGE, COMMENTS_PER_PAGE, REELS_PER_PAGE } from "@/lib/constants";

/**
 * Fetches posts with user details and pagination support.
 */
export const fetchPosts = async (lastTimestamp: string | null = null, limit: number = POSTS_PER_PAGE): Promise<Post[]> => {
    let query = supabase
        .from("unified_posts")
        .select("*")
        .order("sort_timestamp", { ascending: false })
        .limit(limit);

    if (lastTimestamp) {
        query = query.lt("sort_timestamp", lastTimestamp);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(transformPost).filter((p): p is Post => p !== null);
};

/**
 * Fetches a single post by ID.
 */
export const fetchPostById = async (id: string): Promise<Post | null> => {
    const { data, error } = await supabase
        .from("posts")
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
        .eq("id", id)
        .single();

    if (error) throw error;
    return transformPost(data);
};

/**
 * Fetches posts by a specific user ID with pagination support.
 */
export const fetchPostsByUserId = async (
    userId: string,
    lastTimestamp: string | null = null,
    limit: number = POSTS_PER_PAGE,
): Promise<Post[]> => {
    let query = supabase
        .from("unified_posts")
        .select("*")
        .or(`user_id.eq.${userId},reposter_id.eq.${userId}`)
        .order("sort_timestamp", { ascending: false })
        .limit(limit);

    if (lastTimestamp) {
        query = query.lt("sort_timestamp", lastTimestamp);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(transformPost).filter((p): p is Post => p !== null);
};

/**
 * Fetches comments made by a specific user.
 */
export const fetchCommentsByUserId = async (
    userId: string,
    lastTimestamp: string | null = null,
    limit: number = COMMENTS_PER_PAGE,
): Promise<Comment[]> => {
    let query = supabase
        .from("comments")
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
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (lastTimestamp) {
        query = query.lt("created_at", lastTimestamp);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(transformComment).filter((c): c is Comment => c !== null);
};

interface AddPostParams {
    content: string;
    media?: Media[];
    type?: 'text' | 'image' | 'video';
    userId: string;
    poll?: any;
    parentId?: string | null;
    communityId?: string | null;
}

/**
 * Adds a new post with media and optional poll.
 */
export const addPost = async ({
    content,
    media = [],
    type = "text",
    userId,
    poll = null,
    parentId = null,
    communityId = null,
}: AddPostParams): Promise<Post | null> => {
    const { data, error } = await (supabase.from("posts") as any).insert([
        {
            user_id: userId,
            content,
            media,
            type,
            poll,
            parent_id: parentId,
            community_id: communityId,
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

    if (error) throw error;
    return transformPost(data?.[0]);
};

/**
 * Deletes a post by ID.
 */
export const deletePost = async (postId: string): Promise<void> => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) throw error;
};

/**
 * Deletes a comment by ID.
 */
export const deleteComment = async (commentId: string): Promise<void> => {
    const { error } = await supabase.from("comments").delete().eq("id", commentId);
    if (error) throw error;
};

/**
 * Updates a post's content or media by ID.
 */
export const updatePost = async (postId: string, data: any): Promise<void> => {
    const { error } = await (supabase.from("posts") as any).update(data).eq("id", postId);
    if (error) throw error;
};

/**
 * Updates a comment's content or media by ID.
 */
export const updateComment = async (commentId: string, data: any): Promise<void> => {
    const { error } = await (supabase.from("comments") as any).update(data).eq("id", commentId);
    if (error) throw error;
};

/**
 * Fetches comments for a post with pagination.
 */
export const fetchCommentsByPostId = async (
    postId: string,
    lastTimestamp: string | null = null,
    limit: number = COMMENTS_PER_PAGE,
    parentId: string | null = null,
): Promise<Comment[]> => {
    let query = supabase
        .from("comments")
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
        .eq("post_id", postId)
        .order("created_at", { ascending: true })
        .limit(limit);

    if (parentId) {
        query = query.eq("parent_id", parentId);
    } else {
        query = query.is("parent_id", null);
    }

    if (lastTimestamp) {
        query = query.gt("created_at", lastTimestamp);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(transformComment).filter((c): c is Comment => c !== null);
};

/**
 * Adds a comment to a post.
 */
export const addComment = async (
    postId: string,
    userId: string,
    content: string,
    media: Media[] = [],
    parentId: string | null = null
): Promise<Comment | null> => {
    const { data, error } = await (supabase
        .from("comments") as any)
        .insert([
            {
                post_id: postId,
                user_id: userId,
                content,
                media,
                parent_id: parentId,
            },
        ])
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
        );

    if (error) throw error;
    return transformComment(data?.[0]);
};

/**
 * Toggles a like on a post.
 */
export const toggleLike = async (postId: string, userId: string): Promise<boolean> => {
    if (!postId || !userId) return false;

    // Check for existing like(s) - use select().limit(1) instead of maybeSingle to avoid errors if duplicates exist
    const { data: existingLikes } = await supabase
        .from("likes")
        .select("post_id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .limit(1);

    const hasLiked = existingLikes && existingLikes.length > 0;

    if (hasLiked) {
        // Delete ALL likes for this user/post combo to be clean
        await supabase
            .from("likes")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", userId);
        return false;
    } else {
        // Insert new like
        await (supabase.from("likes") as any).insert([{ post_id: postId, user_id: userId }]);
        return true;
    }
};

/**
 * Checks if a user has liked a post.
 */
export const checkIfLiked = async (postId: string, userId: string): Promise<boolean> => {
    if (!userId || !postId) return false;
    const { data, error } = await supabase
        .from("likes")
        .select("post_id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .limit(1);
    
    if (error) {
        console.error("Error checking like status:", error);
        return false;
    }
    return data && data.length > 0;
};

/**
 * Toggles a repost on a post.
 */
export const toggleRepost = async (postId: string, userId: string): Promise<boolean> => {
    if (!postId || !userId) return false;

    const { data: existingReposts } = await supabase
        .from("reposts")
        .select("post_id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .limit(1);

    const hasReposted = existingReposts && existingReposts.length > 0;

    if (hasReposted) {
        await supabase
            .from("reposts")
            .delete()
            .eq("post_id", postId)
            .eq("user_id", userId);
        return false;
    } else {
        await (supabase
            .from("reposts") as any)
            .insert([{ post_id: postId, user_id: userId }]);
        return true;
    }
};

/**
 * Checks if a user has reposted a post.
 */
export const checkIfReposted = async (postId: string, userId: string): Promise<boolean> => {
    if (!userId || !postId) return false;
    const { data, error } = await supabase
        .from("reposts")
        .select("post_id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .limit(1);
    
    if (error) {
        console.error("Error checking repost status:", error);
        return false;
    }
    return data && data.length > 0;
};

/**
 * Searches posts by content (keywords or hashtags).
 */
export const searchPosts = async (
    queryText: string,
    lastTimestamp: string | null = null,
    limit: number = POSTS_PER_PAGE,
    communityOnly: boolean = false,
): Promise<Post[]> => {
    let supabaseQuery = supabase
        .from("unified_posts")
        .select("*")
        .ilike("content", `%${queryText}%`);

    if (communityOnly) {
        supabaseQuery = supabaseQuery
            .not("community_id", "is", null)
            .is("reposter_id", null);
    }

    supabaseQuery = supabaseQuery
        .order("sort_timestamp", { ascending: false })
        .limit(limit);

    if (lastTimestamp) {
        supabaseQuery = supabaseQuery.lt("sort_timestamp", lastTimestamp);
    }

    const { data, error } = await supabaseQuery;

    if (error) throw error;
    return (data || []).map(transformPost).filter((p): p is Post => p !== null);
};

/**
 * Fetches only posts that belong to a community.
 */
export const fetchCommunityExplorePosts = async (
    lastTimestamp: string | null = null,
    limit: number = POSTS_PER_PAGE,
): Promise<Post[]> => {
    let query = supabase
        .from("unified_posts")
        .select("*")
        .not("community_id", "is", null)
        .is("reposter_id", null)
        .order("sort_timestamp", { ascending: false })
        .limit(limit);

    if (lastTimestamp) {
        query = query.lt("sort_timestamp", lastTimestamp);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(transformPost).filter((p): p is Post => p !== null);
};

/**
 * Fetches only video posts for Reels with pagination.
 */
export const fetchReels = async (lastTimestamp: string | null = null, limit: number = REELS_PER_PAGE): Promise<Post[]> => {
    let query = supabase
        .from("unified_posts")
        .select("*")
        .eq("type", "video")
        .order("sort_timestamp", { ascending: false })
        .limit(limit);

    if (lastTimestamp) {
        query = query.lt("sort_timestamp", lastTimestamp);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []).map(transformPost).filter((p): p is Post => p !== null);
};
