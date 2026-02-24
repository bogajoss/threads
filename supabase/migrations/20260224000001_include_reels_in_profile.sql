-- Update get_profile_feed to support type filtering (specifically for reels)
DROP FUNCTION IF EXISTS public.get_profile_feed(uuid, integer, timestamptz);

CREATE OR REPLACE FUNCTION public.get_profile_feed(
  target_user_id UUID,
  limit_val INTEGER DEFAULT 20,
  last_item_time TIMESTAMPTZ DEFAULT NULL,
  p_type TEXT DEFAULT NULL
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
  community_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH feed_items AS (
    -- USER'S POSTS
    SELECT
      p.id as f_id,
      p.id as p_id,
      p.created_at as sort_time,
      u.id as u_id, u.username as u_name, u.display_name as u_display, u.avatar_url as u_avatar,
      u.roles as u_roles, u.is_pro as u_pro, u.is_verified as u_verified, u.role as u_role,
      u.bio as u_bio, u.follower_count as u_follower_count, u.following_count as u_following_count,
      p.content, p.media, p.type, p.user_id, p.community_id, p.parent_id, p.poll, p.quoted_post_id,
      p.likes_count, p.comments_count, p.mirrors_count, p.views_count,
      FALSE as is_repost,
      NULL::jsonb as reposter_json,
      CASE WHEN p.community_id IS NOT NULL THEN (
        SELECT jsonb_build_object('id', c.id, 'handle', c.handle, 'name', c.name, 'avatar_url', c.avatar_url)
        FROM public.communities c WHERE c.id = p.community_id
      ) ELSE NULL END as community_json
    FROM public.posts p
    JOIN public.users u ON p.user_id = u.id
    WHERE
      p.user_id = target_user_id AND
      (
        (p_type IS NULL AND p.type != 'reel') OR
        (p_type = 'reel' AND p.type = 'reel') OR
        (p_type = 'all') OR
        (p_type != 'reel' AND p_type != 'all' AND p.type = p_type::post_type)
      )

    UNION ALL

    -- USER'S REPOSTS
    SELECT
      md5(r.post_id::text || r.user_id::text)::uuid as f_id,
      p.id as p_id,
      r.created_at as sort_time,
      u.id as u_id, u.username as u_name, u.display_name as u_display, u.avatar_url as u_avatar,
      u.roles as u_roles, u.is_pro as u_pro, u.is_verified as u_verified, u.role as u_role,
      u.bio as u_bio, u.follower_count as u_follower_count, u.following_count as u_following_count,
      p.content, p.media, p.type, p.user_id, p.community_id, p.parent_id, p.poll, p.quoted_post_id,
      p.likes_count, p.comments_count, p.mirrors_count, p.views_count,
      TRUE as is_repost,
      jsonb_build_object('id', ru.id, 'username', ru.username, 'display_name', ru.display_name, 'avatar_url', ru.avatar_url) as reposter_json,
      CASE WHEN p.community_id IS NOT NULL THEN (
        SELECT jsonb_build_object('id', c.id, 'handle', c.handle, 'name', c.name, 'avatar_url', c.avatar_url)
        FROM public.communities c WHERE c.id = p.community_id
      ) ELSE NULL END as community_json
    FROM public.reposts r
    JOIN public.posts p ON r.post_id = p.id
    JOIN public.users u ON p.user_id = u.id
    JOIN public.users ru ON r.user_id = ru.id
    WHERE
      r.user_id = target_user_id AND
      (
        (p_type IS NULL AND p.type != 'reel') OR
        (p_type = 'reel' AND p.type = 'reel') OR
        (p_type = 'all') OR
        (p_type != 'reel' AND p_type != 'all' AND p.type = p_type::post_type)
      )
  )
  SELECT
    f.f_id,
    f.p_id,           -- id
    f.p_id,           -- post_id
    f.sort_time,
    jsonb_build_object(
      'id', f.u_id, 'username', f.u_name, 'display_name', f.u_display,
      'avatar_url', f.u_avatar, 'roles', f.u_roles, 'is_pro', f.u_pro,
      'is_verified', f.u_verified, 'role', f.u_role, 'bio', f.u_bio,
      'follower_count', f.u_follower_count, 'following_count', f.u_following_count
    ),
    f.content,
    f.media,
    f.type,
    f.user_id,
    f.community_id,
    f.parent_id,
    f.poll,
    f.quoted_post_id,
    f.likes_count,
    f.comments_count,
    f.mirrors_count,
    f.views_count,
    f.is_repost,
    f.reposter_json,
    f.community_json
  FROM feed_items f
  WHERE
    (last_item_time IS NULL OR f.sort_time < last_item_time)
  ORDER BY f.sort_time DESC
  LIMIT limit_val;
END;
$$ LANGUAGE plpgsql STABLE;
