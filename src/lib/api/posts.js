import { supabase } from "@/lib/supabase";
import { transformPost } from "@/lib/transformers";

/**
 * Fetches posts with user details and pagination support.
 */
export const fetchPosts = async (lastTimestamp = null, limit = 10) => {
  let query = supabase
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
            )
        `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    query = query.lt("created_at", lastTimestamp);
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
  return data.map(transformPost);
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
}) => {
  const { data, error } = await supabase.from("posts").insert([
    {
      user_id: userId,
      content,
      media,
      type,
      poll,
      parent_id: parentId,
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
    .from("posts")
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
    .eq("parent_id", postId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (lastTimestamp) {
    query = query.gt("created_at", lastTimestamp);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data.map(transformPost);
};

/**
 * Adds a comment to a post.
 */
export const addComment = async (postId, userId, content, media = []) => {
  const { data, error } = await supabase.from("posts").insert([
    {
      parent_id: postId,
      user_id: userId,
      content,
      media,
      type: media.length > 0 ? (media[0].type === "video" ? "video" : "image") : "text",
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
