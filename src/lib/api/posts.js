import { supabase } from "@/lib/supabase";
import { transformPost, transformComment } from "@/lib/transformers";

/**
 * Fetches posts with user details and pagination support.
 */
export const fetchPosts = async (lastTimestamp = null, limit = 10) => {
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
  return data.map(transformPost);
};

/**
 * Fetches a single post by ID.
 */
export const fetchPostById = async (id) => {
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
                name
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
export const fetchPostsByUserId = async (userId, lastTimestamp = null, limit = 10) => {
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
  return data.map(transformPost);
};

/**
 * Fetches comments made by a specific user.
 */
export const fetchCommentsByUserId = async (userId, lastTimestamp = null, limit = 10) => {
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
  return data.map(transformComment);
};

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
}) => {
  const { data, error } = await supabase.from("posts").insert([
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
            )
        `);

  if (error) throw error;
  return transformPost(data[0]);
};

/**
 * Deletes a post by ID.
 */
export const deletePost = async (postId) => {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
};

/**
 * Updates a post's content or media by ID.
 */
export const updatePost = async (postId, data) => {
  const { error } = await supabase.from("posts").update(data).eq("id", postId);
  if (error) throw error;
};

/**
 * Fetches comments for a post with pagination.
 */
export const fetchCommentsByPostId = async (postId, lastTimestamp = null, limit = 10) => {
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

  if (lastTimestamp) {
    query = query.gt("created_at", lastTimestamp);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data.map(transformComment);
};

/**
 * Adds a comment to a post.
 */
export const addComment = async (postId, userId, content, media = []) => {
  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        post_id: postId,
        user_id: userId,
        content,
        media,
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
  return transformComment(data[0]);
};

/**
 * Toggles a like on a post.
 */
export const toggleLike = async (postId, userId) => {
  const { data: existingLike } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingLike) {
    await supabase
      .from("likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    return false;
  } else {
    await supabase.from("likes").insert([{ post_id: postId, user_id: userId }]);
    return true;
  }
};

/**
 * Checks if a user has liked a post.
 */
export const checkIfLiked = async (postId, userId) => {
  if (!userId) return false;
  const { data } = await supabase
    .from("likes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
};

/**
 * Toggles a repost on a post.
 */
export const toggleRepost = async (postId, userId) => {
  const { data: existingRepost } = await supabase
    .from("reposts")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existingRepost) {
    await supabase
      .from("reposts")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    return false;
  } else {
    await supabase.from("reposts").insert([{ post_id: postId, user_id: userId }]);
    return true;
  }
};

/**
 * Checks if a user has reposted a post.
 */
export const checkIfReposted = async (postId, userId) => {
  if (!userId) return false;
  const { data } = await supabase
    .from("reposts")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
};
