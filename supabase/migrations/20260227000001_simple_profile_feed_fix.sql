-- Simple fix for get_profile_feed - ensure function signature matches calls
-- Run this AFTER the previous migration

-- Drop all versions of the function first
DROP FUNCTION IF EXISTS public.get_profile_feed(UUID, INTEGER, TIMESTAMPTZ, TEXT);
DROP FUNCTION IF EXISTS public.get_profile_feed(UUID, INTEGER, TIMESTAMPTZ);
DROP FUNCTION IF EXISTS public.get_profile_feed(UUID, INTEGER);

-- Create a simple, reliable version
CREATE OR REPLACE FUNCTION public.get_profile_feed(
  target_user_id UUID,
  limit_val INTEGER DEFAULT 20,
  last_item_time TIMESTAMPTZ DEFAULT NULL,
  p_type TEXT DEFAULT 'posts'  -- Default to 'posts' (non-reels)
)
RETURNS TABLE (
  feed_id UUID,
  id UUID,
  post_id UUID,
  created_at TIMESTAMPTZ,
  author_data JSONB,
  content TEXT,
  media JSONB,
  type post_type,
  user_id UUID,
  community_id UUID,
  parent_id UUID,
  poll JSONB,
  quoted_post_id UUID,
  likes_count INT,
  comments_count INT,
  mirrors_count INT,
  views_count INT,
  is_repost BOOLEAN,
  reposter_data JSONB,
  community_data JSONB,
  is_pinned BOOLEAN,
  pinned_at TIMESTAMPTZ
) AS $$
BEGIN
  -- Handle NULL type - default to 'posts'
  IF p_type IS NULL THEN
    p_type := 'posts';
  END IF;

  RETURN QUERY
  SELECT
    f.f_id AS feed_id,
    f.p_id AS id,
    f.p_id AS post_id,
    f.sort_time AS created_at,
    jsonb_build_object(
      'id', f.u_id, 
      'username', f.u_name, 
      'display_name', f.u_display,
      'avatar_url', f.u_avatar, 
      'roles', COALESCE(f.u_roles, 'user'), 
      'is_pro', COALESCE(f.u_pro, false),
      'is_verified', COALESCE(f.u_verified, false), 
      'role', COALESCE(f.u_role, 'user'), 
      'bio', f.u_bio,
      'follower_count', COALESCE(f.u_follower_count, 0), 
      'following_count', COALESCE(f.u_following_count, 0)
    ) AS author_data,
    f.content,
    COALESCE(f.media, '[]'::jsonb) AS media,
    COALESCE(f.type, 'text'::post_type) AS type,
    f.user_id,
    f.community_id,
    f.parent_id,
    f.poll,
    f.quoted_post_id,
    COALESCE(f.likes_count, 0) AS likes_count,
    COALESCE(f.comments_count, 0) AS comments_count,
    COALESCE(f.mirrors_count, 0) AS mirrors_count,
    COALESCE(f.views_count, 0) AS views_count,
    COALESCE(f.is_repost, false) AS is_repost,
    f.reposter_json AS reposter_data,
    f.community_json AS community_data,
    COALESCE(f.is_pinned, false) AS is_pinned,
    f.pinned_at
  FROM (
    -- USER'S POSTS
    SELECT
      p.id as f_id,
      p.id as p_id,
      p.created_at as sort_time,
      u.id as u_id, 
      COALESCE(u.username, 'unknown') as u_name, 
      COALESCE(u.display_name, u.username) as u_display, 
      u.avatar_url as u_avatar,
      COALESCE(u.roles, 'user') as u_roles, 
      COALESCE(u.is_pro, false) as u_pro, 
      COALESCE(u.is_verified, false) as u_verified, 
      COALESCE(u.role, 'user') as u_role,
      u.bio as u_bio, 
      COALESCE(u.follower_count, 0) as u_follower_count, 
      COALESCE(u.following_count, 0) as u_following_count,
      p.content, 
      p.media, 
      COALESCE(p.type, 'text'::post_type) as type, 
      p.user_id, 
      p.community_id, 
      p.parent_id, 
      p.poll, 
      p.quoted_post_id,
      COALESCE(p.likes_count, 0) as likes_count, 
      COALESCE(p.comments_count, 0) as comments_count, 
      COALESCE(p.mirrors_count, 0) as mirrors_count, 
      COALESCE(p.views_count, 0) as views_count,
      FALSE as is_repost,
      NULL::jsonb as reposter_json,
      CASE WHEN p.community_id IS NOT NULL THEN (
        SELECT jsonb_build_object(
          'id', c.id, 
          'handle', c.handle, 
          'name', c.name, 
          'avatar_url', c.avatar_url
        )
        FROM public.communities c 
        WHERE c.id = p.community_id
      ) ELSE NULL END as community_json,
      COALESCE(p.is_pinned, false) as is_pinned,
      p.pinned_at
    FROM public.posts p
    JOIN public.users u ON p.user_id = u.id
    WHERE
      p.user_id = target_user_id
      AND (
        -- 'posts' = all posts except reels
        (p_type = 'posts' AND COALESCE(p.type, 'text') != 'reel')
        -- 'reel' = only reels
        OR (p_type = 'reel' AND p.type = 'reel')
        -- 'all' = everything
        OR (p_type = 'all')
        -- Specific type match
        OR (p.type = p_type::post_type)
      )

    UNION ALL

    -- USER'S REPOSTS
    SELECT
      md5((r.post_id::text || r.user_id::text)::uuid::text)::uuid as f_id,
      p.id as p_id,
      r.created_at as sort_time,
      u.id as u_id, 
      COALESCE(u.username, 'unknown') as u_name, 
      COALESCE(u.display_name, u.username) as u_display, 
      u.avatar_url as u_avatar,
      COALESCE(u.roles, 'user') as u_roles, 
      COALESCE(u.is_pro, false) as u_pro, 
      COALESCE(u.is_verified, false) as u_verified, 
      COALESCE(u.role, 'user') as u_role,
      u.bio as u_bio, 
      COALESCE(u.follower_count, 0) as u_follower_count, 
      COALESCE(u.following_count, 0) as u_following_count,
      p.content, 
      p.media, 
      COALESCE(p.type, 'text'::post_type) as type, 
      p.user_id, 
      p.community_id, 
      p.parent_id, 
      p.poll, 
      p.quoted_post_id,
      COALESCE(p.likes_count, 0) as likes_count, 
      COALESCE(p.comments_count, 0) as comments_count, 
      COALESCE(p.mirrors_count, 0) as mirrors_count, 
      COALESCE(p.views_count, 0) as views_count,
      TRUE as is_repost,
      jsonb_build_object(
        'id', ru.id, 
        'username', ru.username, 
        'display_name', ru.display_name, 
        'avatar_url', ru.avatar_url
      ) as reposter_json,
      CASE WHEN p.community_id IS NOT NULL THEN (
        SELECT jsonb_build_object(
          'id', c.id, 
          'handle', c.handle, 
          'name', c.name, 
          'avatar_url', c.avatar_url
        )
        FROM public.communities c 
        WHERE c.id = p.community_id
      ) ELSE NULL END as community_json,
      FALSE as is_pinned,
      NULL::timestamptz as pinned_at
    FROM public.reposts r
    JOIN public.posts p ON r.post_id = p.id
    JOIN public.users u ON p.user_id = u.id
    JOIN public.users ru ON r.user_id = ru.id
    WHERE
      r.user_id = target_user_id
      AND (
        -- 'posts' = all posts except reels
        (p_type = 'posts' AND COALESCE(p.type, 'text') != 'reel')
        -- 'reel' = only reels
        OR (p_type = 'reel' AND p.type = 'reel')
        -- 'all' = everything
        OR (p_type = 'all')
        -- Specific type match
        OR (p.type = p_type::post_type)
      )
  ) f
  WHERE
    (last_item_time IS NULL OR f.sort_time < last_item_time)
  ORDER BY 
    f.is_pinned DESC, 
    f.pinned_at DESC NULLS LAST, 
    f.sort_time DESC
  LIMIT limit_val;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_profile_feed(UUID, INTEGER, TIMESTAMPTZ, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile_feed(UUID, INTEGER, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_profile_feed(UUID, INTEGER) TO authenticated;
