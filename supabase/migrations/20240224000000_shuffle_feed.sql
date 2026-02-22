-- Dynamic Feed Shuffling
-- Adds deterministic jitter to scores based on a random seed from the frontend

-- 1. Update Posts Feed with Random Seed
CREATE OR REPLACE FUNCTION public.get_posts_feed(
  limit_val INTEGER DEFAULT 20, 
  last_item_id UUID DEFAULT NULL, 
  last_item_score NUMERIC DEFAULT NULL,
  random_seed TEXT DEFAULT 'default'
)
RETURNS TABLE (
  feed_id UUID,
  post_id UUID,
  created_at TIMESTAMPTZ,
  score NUMERIC,
  author_data JSONB,
  content TEXT,
  media JSONB,
  likes_count INT,
  comments_count INT,
  mirrors_count INT,
  views_count INT,
  is_repost BOOLEAN,
  reposter_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH feed_items AS (
    -- 1. ORIGINAL POSTS
    SELECT 
      p.id as f_id,
      p.id as p_id,
      p.created_at as sort_time,
      -- Base Rank Score (Gravity + Engagement)
      ( p.engagement_score / POWER( (EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600) + 2, 1.8) )::NUMERIC as base_score,
      u.id as u_id, u.username as u_name, u.avatar_url as u_avatar, u.roles as u_roles, u.is_pro as u_pro,
      p.content, p.media, p.likes_count, p.comments_count, p.mirrors_count, p.views_count,
      FALSE as is_repost,
      NULL::jsonb as reposter_json
    FROM public.posts p
    JOIN public.users u ON p.user_id = u.id
    WHERE 
      p.type != 'reel' AND
      u.is_banned = FALSE AND
      p.created_at > (NOW() - INTERVAL '7 days')

    UNION ALL

    -- 2. REPOSTS
    SELECT 
      r.post_id as f_id,
      p.id as p_id,
      r.created_at as sort_time,
      ( p.engagement_score / POWER( (EXTRACT(EPOCH FROM (NOW() - r.created_at))/3600) + 2, 1.8) )::NUMERIC as base_score,
      u.id as u_id, u.username as u_name, u.avatar_url as u_avatar, u.roles as u_roles, u.is_pro as u_pro,
      p.content, p.media, p.likes_count, p.comments_count, p.mirrors_count, p.views_count,
      TRUE as is_repost,
      jsonb_build_object('username', ru.username, 'avatar_url', ru.avatar_url) as reposter_json
    FROM public.reposts r
    JOIN public.posts p ON r.post_id = p.id
    JOIN public.users u ON p.user_id = u.id 
    JOIN public.users ru ON r.user_id = ru.id
    WHERE 
      p.type != 'reel' AND
      u.is_banned = FALSE AND ru.is_banned = FALSE AND
      r.created_at > (NOW() - INTERVAL '7 days')
  ),
  scored_items AS (
    SELECT 
      f.*,
      -- Apply deterministic Jitter based on seed + ID
      -- hash_text(seed || id) results in a pseudo-random value between -0.05 and +0.05
      (f.base_score + ((('0x' || left(md5(random_seed || f.f_id::text), 8))::bit(32)::int::float / 2147483647.0) * 0.1))::NUMERIC as rank_score
    FROM feed_items f
  )
  SELECT 
    s.f_id,
    s.p_id,
    s.sort_time,
    s.rank_score,
    jsonb_build_object('username', s.u_name, 'avatar_url', s.u_avatar, 'roles', s.u_roles, 'is_pro', s.u_pro),
    s.content,
    s.media,
    s.likes_count,
    s.comments_count,
    s.mirrors_count,
    s.views_count,
    s.is_repost,
    s.reposter_json
  FROM scored_items s
  WHERE 
    (last_item_score IS NULL OR 
     s.rank_score < last_item_score OR
     (ABS(s.rank_score - last_item_score) < 0.0001 AND s.f_id < last_item_id)
    )
  ORDER BY s.rank_score DESC, s.f_id DESC
  LIMIT limit_val;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2. Update Reels Feed with Random Seed
CREATE OR REPLACE FUNCTION public.get_reels_feed(
  limit_val INTEGER DEFAULT 20, 
  last_reel_id UUID DEFAULT NULL, 
  last_reel_score NUMERIC DEFAULT NULL,
  random_seed TEXT DEFAULT 'default'
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  score NUMERIC,
  author_data JSONB,
  content TEXT,
  media JSONB,
  likes_count INT,
  comments_count INT,
  views_count INT
) AS $$
BEGIN
  RETURN QUERY
  WITH raw_reels AS (
    SELECT 
      p.id,
      p.created_at,
      -- Base Score
      ( (p.engagement_score + (p.views_count * 0.1)) / POWER( (EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600) + 2, 1.5) )::NUMERIC as base_score,
      jsonb_build_object('username', u.username, 'avatar_url', u.avatar_url, 'roles', u.roles, 'is_pro', u.is_pro) as author_data,
      p.content,
      p.media,
      p.likes_count,
      p.comments_count,
      p.views_count
    FROM public.posts p
    JOIN public.users u ON p.user_id = u.id
    WHERE 
      p.type = 'reel' AND
      u.is_banned = FALSE AND
      p.created_at > (NOW() - INTERVAL '30 days')
  ),
  scored_reels AS (
    SELECT 
      r.*,
      -- Apply Jitter (±0.2 for reels to make them more dynamic)
      (r.base_score + ((('0x' || left(md5(random_seed || r.id::text), 8))::bit(32)::int::float / 2147483647.0) * 0.2))::NUMERIC as rank_score
    FROM raw_reels r
  )
  SELECT 
    s.id,
    s.created_at,
    s.rank_score,
    s.author_data,
    s.content,
    s.media,
    s.likes_count,
    s.comments_count,
    s.views_count
  FROM scored_reels s
  WHERE 
    (last_reel_score IS NULL OR 
     s.rank_score < last_reel_score OR
     ( ABS(s.rank_score - last_reel_score) < 0.0001 AND s.id < last_reel_id )
    )
  ORDER BY s.rank_score DESC, s.id DESC
  LIMIT limit_val;
END;
$$ LANGUAGE plpgsql STABLE;
