import { supabase } from "@/lib/supabase";
import { transformPost, transformComment } from "@/lib/transformers";
import type { Post, Comment, Media } from "@/types/index";
import {
  POSTS_PER_PAGE,
  COMMENTS_PER_PAGE,
  REELS_PER_PAGE,
} from "@/lib/constants";
import { deleteMultipleFiles } from "./storage";
import { isValidUUID } from "@/lib/utils";

export const fetchPosts = async (
  cursor: string | null = null,
  limit: number = POSTS_PER_PAGE,
  seed: string = "default",
): Promise<Post[]> => {
  let lastItemId = null;
  let lastItemScore = null;

  if (cursor) {
    if (cursor.includes(":")) {
      const parts = cursor.split(":");
      lastItemId = parts[0];
      lastItemScore = parseFloat(parts[1]);
    } else {
      // Fallback for unexpected cursor format or pure timestamp
      // If pure timestamp, we can't really paginate the score-based feed correctly without score.
      // But maybe the client isn't updated yet.
      // Let's just try to parse it as ID if it looks like UUID, else ignore.
    }
  }

  const params: any = {
    limit_val: limit,
    random_seed: seed,
  };

  if (lastItemId && isValidUUID(lastItemId)) params.last_item_id = lastItemId;
  if (lastItemScore !== null) params.last_item_score = lastItemScore;

  const { data, error } = await supabase.rpc("get_posts_feed", params);

  if (error) throw error;

  return (data || [])
    .map((p: any) =>
      transformPost({
        ...p,
        mirrors_count: p.mirrors_count || 0,
      }),
    )
    .filter((p): p is Post => p !== null);
};

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
                following_count,
                role,
                roles,
                is_pro
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
                    is_verified,
                    role,
                    roles,
                    is_pro
                )
            )
        `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return transformPost(data);
};

export const fetchPostsByUserId = async (
  userId: string,
  lastTimestamp: string | null = null,
  limit: number = POSTS_PER_PAGE,
  type: string | null = null,
): Promise<Post[]> => {
  // Guard against invalid UUIDs
  if (!userId || !isValidUUID(userId)) {
    console.warn("fetchPostsByUserId called with invalid userId:", userId);
    return [];
  }

  // Normalize type: 'posts' means null (non-reel posts)
  const normalizedType = type === 'posts' ? null : type;
  
  // Try the RPC first
  const { data, error } = await supabase.rpc("get_profile_feed", {
    target_user_id: userId,
    limit_val: limit,
    last_item_time: lastTimestamp || undefined,
    filter_mode: normalizedType,
  });

  if (error) {
    console.error("RPC get_profile_feed failed:", error);
    // Fallback to direct query if RPC fails
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
          follower_count,
          following_count,
          role,
          roles,
          is_pro
        ),
        communities (
          id,
          handle,
          name,
          avatar_url
        )
      `,
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (normalizedType === 'reel') {
      query = query.eq("type", "reel");
    } else if (normalizedType === 'all') {
      // No type filter
    } else {
      // Default: exclude reels
      query = query.neq("type", "reel");
    }

    if (lastTimestamp) {
      query = query.lt("created_at", lastTimestamp);
    }

    const { data: fallbackData, error: fallbackError } = await query;

    if (fallbackError) throw fallbackError;
    return (fallbackData || [])
      .map((p: any) => transformPost(p))
      .filter((p): p is Post => p !== null);
  }

  return (data || [])
    .map((p: any) =>
      transformPost({
        ...p,
        // RPC returns flat structure, transformPost handles it if we map clearly
      }),
    )
    .filter((p): p is Post => p !== null);
};

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
  return (data || [])
    .map(transformComment)
    .filter((c): c is Comment => c !== null);
};

interface AddPostParams {
  content: string;
  media?: Media[];
  type?: "text" | "image" | "video" | "reel" | "poll" | "file";
  userId: string;
  poll?: any;
  parentId?: string | null;
  communityId?: string | null;
  quotedPostId?: string | null;
}

export const incrementPostViews = async (postId: string): Promise<void> => {
  const { error } = await (supabase.rpc as any)("increment_post_views", {
    post_id: postId,
  });
  if (error) {
    console.error(
      "RPC increment_post_views failed, make sure to run the SQL migration:",
      error,
    );
  }
};

export const addPost = async ({
  content,
  media = [],
  type = "text",
  userId,
  poll = null,
  parentId = null,
  communityId = null,
  quotedPostId = null,
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
      quoted_post_id: quotedPostId,
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

export const deletePost = async (postId: string): Promise<void> => {
  const { data: post } = await (supabase
    .from("posts")
    .select("media")
    .eq("id", postId)
    .single() as any);

  if (post?.media && Array.isArray(post.media)) {
    const urlsToDelete: string[] = [];
    post.media.forEach((m: any) => {
      if (m.url) urlsToDelete.push(m.url);
      if (m.poster) urlsToDelete.push(m.poster);
    });

    if (urlsToDelete.length > 0) {
      await deleteMultipleFiles(urlsToDelete);
    }
  }

  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) throw error;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  const { data: comment } = await (supabase
    .from("comments")
    .select("media")
    .eq("id", commentId)
    .single() as any);

  if (comment?.media && Array.isArray(comment.media)) {
    const urlsToDelete: string[] = [];
    comment.media.forEach((m: any) => {
      if (m.url) urlsToDelete.push(m.url);
      if (m.poster) urlsToDelete.push(m.poster);
    });

    if (urlsToDelete.length > 0) {
      await deleteMultipleFiles(urlsToDelete);
    }
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);
  if (error) throw error;
};

export const updatePost = async (postId: string, data: any): Promise<void> => {
  const { error } = await (supabase.from("posts") as any)
    .update(data)
    .eq("id", postId);
  if (error) throw error;
};

export const updateComment = async (
  commentId: string,
  data: any,
): Promise<void> => {
  const { error } = await (supabase.from("comments") as any)
    .update(data)
    .eq("id", commentId);
  if (error) throw error;
};

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
  return (data || [])
    .map(transformComment)
    .filter((c): c is Comment => c !== null);
};

export const addComment = async (
  postId: string,
  userId: string,
  content: string,
  media: Media[] = [],
  parentId: string | null = null,
  type: string = "text",
  duration: number | null = null,
): Promise<Comment | null> => {
  const { data, error } = await (supabase.from("comments") as any)
    .insert([
      {
        post_id: postId,
        user_id: userId,
        content,
        media,
        parent_id: parentId,
        type,
        duration,
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

export const toggleLike = async (
  userId: string,
  postId?: string | null,
  commentId?: string | null,
): Promise<boolean> => {
  if (!userId) return false;

  // Ensure we send only one ID to the backend
  const p_post_id = commentId ? null : (postId || null);
  const p_comment_id = commentId || null;

  try {
    const { data, error } = await (supabase.rpc as any)("toggle_like", {
      p_user_id: userId,
      p_post_id: p_post_id,
      p_comment_id: p_comment_id,
    });

    if (error && (error.code === "PGRST202" || (error as any).status === 404)) {
      // Fallback if RPC is missing or fails (though updated RPC should handle this)
       if (commentId) {
         const { data: existing } = await supabase
           .from("comment_likes")
           .select("comment_id") 
           .eq("comment_id", commentId)
           .eq("user_id", userId)
           .maybeSingle();

         if (existing) {
           await supabase
             .from("comment_likes")
             .delete()
             .eq("comment_id", commentId)
             .eq("user_id", userId);
           return false;
         } else {
            await (supabase.from("comment_likes") as any).insert([
             { comment_id: commentId, user_id: userId },
           ]);
           return true; 
         }
       } else if (postId) {
          const { data: existing } = await supabase
            .from("likes")
            .select("post_id")
            .eq("post_id", postId)
            .eq("user_id", userId)
            .maybeSingle();

          if (existing) {
            await supabase
              .from("likes")
              .delete()
              .eq("post_id", postId)
              .eq("user_id", userId);
            return false;
          } else {
             await (supabase.from("likes") as any).insert([
              { post_id: postId, user_id: userId },
            ]);
            return true;
          }
       }
    }

    if (error) throw error;
    return !!data;
  } catch (err) {
    console.error("toggleLike error:", err);
    return false;
  }
};

export const checkIfLiked = async (
  userId: string,
  postId?: string | null,
  commentId?: string | null,
): Promise<boolean> => {
  if (!userId || (!postId && !commentId)) return false;

  const table = commentId ? "comment_likes" : "likes";
  const idColumn = commentId ? "comment_id" : "post_id";
  const targetId = (commentId || postId) as string;

  const { data, error } = await supabase
    .from(table)
    .select(idColumn)
    .eq(idColumn, targetId)
    .eq("user_id", userId)
    .limit(1);

  if (error) {
    console.error("Error checking like status:", error);
    return false;
  }
  return data && data.length > 0;
};

export const toggleRepost = async (
  userId: string,
  postId?: string | null,
  commentId?: string | null,
): Promise<boolean> => {
  if (!userId) return false;

  // Ensure we send only one ID to the backend
  const p_post_id = commentId ? null : (postId || null);
  const p_comment_id = commentId || null;

  try {
     const { data, error } = await (supabase.rpc as any)("toggle_repost", {
      p_user_id: userId,
      p_post_id: p_post_id,
      p_comment_id: p_comment_id,
    });

    if (error && (error.code === "PGRST202" || (error as any).status === 404)) {
       // Fallback logic
       if (commentId) {
          const { data: existing } = await supabase
            .from("reposts")
            .select("comment_id")
            .eq("comment_id", commentId)
            .eq("user_id", userId)
            .maybeSingle();
            
          if (existing) {
            await supabase
              .from("reposts")
              .delete()
              .eq("comment_id", commentId)
              .eq("user_id", userId);
            return false;
          } else {
             await (supabase.from("reposts") as any).insert([
               { comment_id: commentId, user_id: userId }
             ]);
             return true;
          }
       } else if (postId) {
          const { data: existing } = await supabase
            .from("reposts")
            .select("post_id")
            .eq("post_id", postId)
            .eq("user_id", userId)
            .maybeSingle();

          if (existing) {
            await supabase
              .from("reposts")
              .delete()
              .eq("post_id", postId)
              .eq("user_id", userId);
            return false;
          } else {
            await (supabase.from("reposts") as any).insert([
              { post_id: postId, user_id: userId }
            ]);
            return true;
          }
       }
    }

    if (error) throw error;
    return !!data;
  } catch (err) {
    console.error("toggleRepost error:", err);
    return false;
  }
};

export const checkIfReposted = async (
  userId: string,
  postId?: string | null,
  commentId?: string | null
): Promise<boolean> => {
  if (!userId || (!postId && !commentId)) return false;

  const table = commentId ? "reposts" : "reposts"; // Both reposts now (with columns)
  const idCol = commentId ? "comment_id" : "post_id";
  const targetId = (commentId || postId) as string;

  const { data, error } = await supabase
    .from(table)
    .select(idCol)
    .eq(idCol, targetId)
    .eq("user_id", userId)
    .limit(1);

  if (error) {
    console.error("Error checking repost status:", error);
    return false;
  }
  return data && data.length > 0;
};

export const searchPosts = async (
  queryText: string,
  lastTimestamp: string | null = null,
  limit: number = POSTS_PER_PAGE,
  communityOnly: boolean = false,
): Promise<Post[]> => {
  let supabaseQuery = supabase
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
                role,
                roles,
                is_pro
            ),
            communities (
                id,
                handle,
                name,
                avatar_url
            )
        `,
    )
    .ilike("content", `%${queryText}%`);

  if (communityOnly) {
    supabaseQuery = supabaseQuery.not("community_id", "is", null);
  }

  supabaseQuery = supabaseQuery
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    supabaseQuery = supabaseQuery.lt("created_at", lastTimestamp);
  }

  const { data, error } = await supabaseQuery;

  if (error) throw error;
  return (data || []).map(transformPost).filter((p): p is Post => p !== null);
};

export const fetchExplorePosts = async (
  page: number = 1,
): Promise<Post[]> => {
  const topLimit = 5;
  const randomLimit = 5;
  const offset = (page - 1) * topLimit;

  // 1. Fetch top posts based on views
  const { data: topData, error: topError } = await supabase
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
                role,
                roles,
                is_pro
            ),
            communities (
                id,
                handle,
                name,
                avatar_url
            )
        `,
    )
    .neq("type", "reel")
    .order("views_count", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + topLimit - 1);

  if (topError) throw topError;
  const topPosts = (topData || []).map(transformPost).filter(Boolean) as Post[];

  // 2. Fetch random posts
  // We fetch a pool and shuffle
  const { data: randomData, error: randomError } = await supabase
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
                role,
                roles,
                is_pro
            ),
            communities (
                id,
                handle,
                name,
                avatar_url
            )
        `,
    )
    .neq("type", "reel")
    .limit(50);

  if (randomError) throw randomError;

  let allRandom = (randomData || [])
    .map(transformPost)
    .filter((p: any) => p && !topPosts.find(tp => tp.id === p.id)) as Post[];
  
  allRandom = allRandom.sort(() => Math.random() - 0.5).slice(0, randomLimit);

  return [...topPosts, ...allRandom];
};

export const fetchCommunityExplorePosts = async (
  lastTimestamp: string | null = null,
  limit: number = POSTS_PER_PAGE,
): Promise<Post[]> => {
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
                role,
                roles,
                is_pro
            ),
            communities (
                id,
                handle,
                name,
                avatar_url
            )
        `,
    )
    .not("community_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (lastTimestamp) {
    query = query.lt("created_at", lastTimestamp);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []).map(transformPost).filter((p): p is Post => p !== null);
};

export const fetchReels = async (
  cursor: string | null = null,
  limit: number = REELS_PER_PAGE,
  seed: string = "default",
): Promise<Post[]> => {
  let lastReelId = null;
  let lastReelScore = null;

  if (cursor) {
    const parts = cursor.split(":");
    if (parts.length === 2) {
      lastReelId = parts[0];
      lastReelScore = parseFloat(parts[1]);
    }
  }

  const { data, error } = await supabase.rpc("get_reels_feed", {
    limit_val: limit,
    last_reel_id: lastReelId || undefined,
    last_reel_score: lastReelScore || undefined,
    random_seed: seed,
  });

  if (error) throw error;

  return (data || [])
    .map((p: any) =>
      transformPost({
        ...p,
        mirrors_count: p.mirrors_count || 0,
      }),
    )
    .filter((p): p is Post => p !== null);
};

export const votePoll = async (
  postId: string,
  optionId: string,
  userId: string,
): Promise<any> => {
  const { data, error } = await (supabase.rpc as any)("vote_poll", {
    p_post_id: postId,
    p_option_id: optionId,
    p_user_id: userId,
  });
  if (error) throw error;
  return data;
};
