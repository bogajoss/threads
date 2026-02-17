-- ==============================================================
-- AUDIT FIX MIGRATION
-- Fixes: RPC field gaps, missing RLS policies, security holes,
--        missing functions & tables
-- ==============================================================

-- ============================================
-- 1. FIX: RPC get_posts_feed — add all needed post columns
-- ============================================
DROP FUNCTION IF EXISTS public.get_posts_feed(integer, uuid, numeric);

CREATE OR REPLACE FUNCTION public.get_posts_feed(
  limit_val INTEGER DEFAULT 20,
  last_item_id UUID DEFAULT NULL,
  last_item_score NUMERIC DEFAULT NULL
)
RETURNS TABLE (
  feed_id UUID,
  id UUID,              -- ADDED (alias of post_id, frontend expects "id")
  post_id UUID,
  created_at TIMESTAMPTZ,
  score NUMERIC,
  author_data JSONB,
  content TEXT,
  media JSONB,
  type post_type,       -- ADDED
  user_id UUID,         -- ADDED
  community_id UUID,    -- ADDED
  parent_id UUID,       -- ADDED
  poll JSONB,           -- ADDED
  quoted_post_id UUID,  -- ADDED
  likes_count INT,
  comments_count INT,
  mirrors_count INT,
  views_count INT,
  is_repost BOOLEAN,
  reposter_data JSONB,
  community_data JSONB  -- ADDED
) AS $$
BEGIN
  RETURN QUERY
  WITH feed_items AS (
    -- ORIGINAL POSTS
    SELECT
      p.id as f_id,
      p.id as p_id,
      p.created_at as sort_time,
      ( p.engagement_score / POWER( (EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600) + 2, 1.8) )::NUMERIC as rank_score,
      u.id as u_id, u.username as u_name, u.display_name as u_display, u.avatar_url as u_avatar,
      u.roles as u_roles, u.is_pro as u_pro, u.is_verified as u_verified, u.role as u_role,
      u.bio as u_bio, u.follower_count as u_followers, u.following_count as u_following,
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
      p.type != 'reel' AND
      u.is_banned = FALSE AND
      p.created_at > (NOW() - INTERVAL '7 days')

    UNION ALL

    -- REPOSTS
    SELECT
      (r.post_id::text || r.user_id::text)::UUID as f_id,
      p.id as p_id,
      r.created_at as sort_time,
      ( p.engagement_score / POWER( (EXTRACT(EPOCH FROM (NOW() - r.created_at))/3600) + 2, 1.8) )::NUMERIC as rank_score,
      u.id as u_id, u.username as u_name, u.display_name as u_display, u.avatar_url as u_avatar,
      u.roles as u_roles, u.is_pro as u_pro, u.is_verified as u_verified, u.role as u_role,
      u.bio as u_bio, u.follower_count as u_followers, u.following_count as u_following,
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
      p.type != 'reel' AND
      u.is_banned = FALSE AND ru.is_banned = FALSE AND
      r.created_at > (NOW() - INTERVAL '7 days')
  )
  SELECT
    f.f_id,
    f.p_id,           -- id (same as post_id)
    f.p_id,           -- post_id
    f.sort_time,
    f.rank_score,
    jsonb_build_object(
      'id', f.u_id, 'username', f.u_name, 'display_name', f.u_display,
      'avatar_url', f.u_avatar, 'roles', f.u_roles, 'is_pro', f.u_pro,
      'is_verified', f.u_verified, 'role', f.u_role, 'bio', f.u_bio,
      'follower_count', f.u_followers, 'following_count', f.u_following
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
    (last_item_score IS NULL OR
     f.rank_score < last_item_score OR
     (ABS(f.rank_score - last_item_score) < 0.0001 AND f.f_id < last_item_id)
    )
  ORDER BY f.rank_score DESC, f.f_id DESC
  LIMIT limit_val;
END;
$$ LANGUAGE plpgsql STABLE;


-- ============================================
-- 2. FIX: RPC get_profile_feed — add all needed post columns
-- ============================================
DROP FUNCTION IF EXISTS public.get_profile_feed(uuid, integer, timestamptz);

CREATE OR REPLACE FUNCTION public.get_profile_feed(
  target_user_id UUID,
  limit_val INTEGER DEFAULT 20,
  last_item_time TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  feed_id UUID,
  id UUID,              -- ADDED
  post_id UUID,
  created_at TIMESTAMPTZ,
  author_data JSONB,
  content TEXT,
  media JSONB,
  type post_type,       -- ADDED
  user_id UUID,         -- ADDED
  community_id UUID,    -- ADDED
  parent_id UUID,       -- ADDED
  poll JSONB,           -- ADDED
  quoted_post_id UUID,  -- ADDED
  likes_count INT,
  comments_count INT,
  mirrors_count INT,
  views_count INT,
  is_repost BOOLEAN,
  reposter_data JSONB,
  community_data JSONB  -- ADDED
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
      u.bio as u_bio, u.follower_count as u_followers, u.following_count as u_following,
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
      p.type != 'reel'

    UNION ALL

    -- USER'S REPOSTS
    SELECT
      (r.post_id::text || r.user_id::text)::UUID as f_id,
      p.id as p_id,
      r.created_at as sort_time,
      u.id as u_id, u.username as u_name, u.display_name as u_display, u.avatar_url as u_avatar,
      u.roles as u_roles, u.is_pro as u_pro, u.is_verified as u_verified, u.role as u_role,
      u.bio as u_bio, u.follower_count as u_followers, u.following_count as u_following,
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
      p.type != 'reel'
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
      'follower_count', f.u_followers, 'following_count', f.u_following
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


-- ============================================
-- 3. FIX: RPC get_reels_feed — add missing columns + mirrors_count
-- ============================================
DROP FUNCTION IF EXISTS public.get_reels_feed(integer, uuid, numeric);

CREATE OR REPLACE FUNCTION public.get_reels_feed(
  limit_val INTEGER DEFAULT 20,
  last_reel_id UUID DEFAULT NULL,
  last_reel_score NUMERIC DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  score NUMERIC,
  author_data JSONB,
  content TEXT,
  media JSONB,
  type post_type,       -- ADDED
  user_id UUID,         -- ADDED
  likes_count INT,
  comments_count INT,
  mirrors_count INT,    -- ADDED
  views_count INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.created_at,
    ( (p.engagement_score + (p.views_count * 0.1)) / POWER( (EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600) + 2, 1.5) )::NUMERIC as score,
    jsonb_build_object(
      'id', u.id, 'username', u.username, 'display_name', u.display_name,
      'avatar_url', u.avatar_url, 'roles', u.roles, 'is_pro', u.is_pro,
      'is_verified', u.is_verified, 'role', u.role, 'bio', u.bio,
      'follower_count', u.follower_count, 'following_count', u.following_count
    ) as author_data,
    p.content,
    p.media,
    p.type,
    p.user_id,
    p.likes_count,
    p.comments_count,
    p.mirrors_count,
    p.views_count
  FROM public.posts p
  JOIN public.users u ON p.user_id = u.id
  WHERE
    p.type = 'reel' AND
    u.is_banned = FALSE AND
    p.created_at > (NOW() - INTERVAL '30 days') AND
    (last_reel_score IS NULL OR
     ( (p.engagement_score + (p.views_count * 0.1)) / POWER( (EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600) + 2, 1.5) ) < last_reel_score OR
     ( ABS(( (p.engagement_score + (p.views_count * 0.1)) / POWER( (EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600) + 2, 1.5) ) - last_reel_score) < 0.0001 AND p.id < last_reel_id )
    )
  ORDER BY score DESC, p.id DESC
  LIMIT limit_val;
END;
$$ LANGUAGE plpgsql STABLE;


-- ============================================
-- 4. FIX: vote_poll RPC (was called by frontend but never defined)
-- ============================================
CREATE OR REPLACE FUNCTION public.vote_poll(
  p_post_id UUID,
  p_option_id TEXT,
  p_user_id UUID
)
RETURNS JSONB AS $$
DECLARE
  current_poll JSONB;
  updated_poll JSONB;
  option_found BOOLEAN := FALSE;
  i INT;
BEGIN
  -- Get the current poll data
  SELECT poll INTO current_poll FROM public.posts WHERE id = p_post_id;
  
  IF current_poll IS NULL THEN
    RAISE EXCEPTION 'Post has no poll data';
  END IF;
  
  -- Check if user already voted (stored in poll->'voters')
  IF current_poll->'voters' IS NOT NULL AND current_poll->'voters' ? p_user_id::text THEN
    RAISE EXCEPTION 'User has already voted';
  END IF;
  
  -- Update the vote count for the selected option
  updated_poll := current_poll;
  FOR i IN 0..jsonb_array_length(COALESCE(current_poll->'options', '[]'::jsonb)) - 1 LOOP
    IF (current_poll->'options'->i->>'id') = p_option_id THEN
      updated_poll := jsonb_set(
        updated_poll,
        ARRAY['options', i::text, 'votes'],
        to_jsonb(COALESCE((current_poll->'options'->i->>'votes')::int, 0) + 1)
      );
      option_found := TRUE;
    END IF;
  END LOOP;
  
  IF NOT option_found THEN
    RAISE EXCEPTION 'Option not found';
  END IF;
  
  -- Add user to voters
  IF updated_poll->'voters' IS NULL THEN
    updated_poll := jsonb_set(updated_poll, '{voters}', jsonb_build_object(p_user_id::text, p_option_id));
  ELSE
    updated_poll := jsonb_set(updated_poll, '{voters}', updated_poll->'voters' || jsonb_build_object(p_user_id::text, p_option_id));
  END IF;
  
  -- Save back
  UPDATE public.posts SET poll = updated_poll WHERE id = p_post_id;
  
  RETURN updated_poll;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- PRE-REQ: is_admin function (used by policies below)
-- ============================================
-- Helper function to avoid infinite recursion in policies
-- SECURITY DEFINER allows it to read admins table without triggering RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
END;
$$;


-- ============================================
-- 5. FIX: system_settings table (referenced by admin.ts but never created)
-- ============================================
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  allow_signups BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row if empty
INSERT INTO public.system_settings (maintenance_mode, allow_signups)
SELECT FALSE, TRUE
WHERE NOT EXISTS (SELECT 1 FROM public.system_settings);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write settings
DROP POLICY IF EXISTS "Admins can manage settings" ON public.system_settings;
CREATE POLICY "Admins can manage settings" ON public.system_settings FOR ALL TO authenticated
  USING ( public.is_admin() );


-- ============================================
-- 6. FIX: admins table — ENABLE RLS & ANTI-RECURSION
-- ============================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Only existing admins can read the admins table
DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;
CREATE POLICY "Admins can view admins" ON public.admins FOR SELECT TO authenticated
  USING ( public.is_admin() );

-- Only superadmins (role='admin') can insert/update/delete admins
DROP POLICY IF EXISTS "Superadmins can manage admins" ON public.admins;
CREATE POLICY "Superadmins can manage admins" ON public.admins FOR ALL TO authenticated
  USING ( EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid() AND a.role = 'admin') )
  WITH CHECK ( EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid() AND a.role = 'admin') );


-- ============================================
-- 7. FIX: Admin-bypass RLS policies for users/posts/communities
-- ============================================

-- Admins can update ANY user (for verification, banning, etc.)
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;
CREATE POLICY "Admins can update any user" ON public.users FOR UPDATE TO authenticated
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

-- Admins can delete any post (content moderation)
DROP POLICY IF EXISTS "Admins can delete any post" ON public.posts;
CREATE POLICY "Admins can delete any post" ON public.posts FOR DELETE TO authenticated
  USING ( public.is_admin() );

-- Admins can delete any community
DROP POLICY IF EXISTS "Admins can delete any community" ON public.communities;
CREATE POLICY "Admins can delete any community" ON public.communities FOR DELETE TO authenticated
  USING ( public.is_admin() );

-- Admins can view all reports (supplements existing policy)
DROP POLICY IF EXISTS "Admins can view reports" ON public.reports;
CREATE POLICY "Admins can view reports" ON public.reports FOR SELECT TO authenticated
  USING ( public.is_admin() );

-- Admins can update report status
DROP POLICY IF EXISTS "Admins can update reports" ON public.reports;
CREATE POLICY "Admins can update reports" ON public.reports FOR UPDATE TO authenticated
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );


-- ============================================
-- 8. FIX: toggle_user_ban — check admins table, not roles column
-- ============================================
CREATE OR REPLACE FUNCTION public.toggle_user_ban(target_user_id UUID, ban_status BOOLEAN)
RETURNS void AS $$
BEGIN
    -- Check if caller is an admin or moderator via the helper function
    IF NOT public.is_admin() THEN
      RAISE EXCEPTION 'Insufficient permissions: must be admin or moderator';
    END IF;
    
    UPDATE public.users SET is_banned = ban_status WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================
-- 9. FIX: community_members UPDATE policy (was missing)
-- ============================================
-- Community admins/moderators can update member roles
DROP POLICY IF EXISTS "Community admins can update member roles" ON public.community_members;
CREATE POLICY "Community admins can update member roles" ON public.community_members FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = community_members.community_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('admin', 'moderator')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.community_members cm
      WHERE cm.community_id = community_members.community_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('admin', 'moderator')
    )
  );


-- ============================================
-- 10. FIX: Storage RLS policies for 'media' bucket
-- ============================================

-- Allow authenticated users to upload files to media bucket
DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK ( bucket_id = 'media' );

-- Allow public read access (bucket is public)
DROP POLICY IF EXISTS "Public read access for media" ON storage.objects;
CREATE POLICY "Public read access for media" ON storage.objects FOR SELECT TO authenticated, anon
  USING ( bucket_id = 'media' );

-- Allow users to update their own uploads
DROP POLICY IF EXISTS "Users can update own media" ON storage.objects;
CREATE POLICY "Users can update own media" ON storage.objects FOR UPDATE TO authenticated
  USING ( bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text )
  WITH CHECK ( bucket_id = 'media' );

-- Allow users to delete media (for cleanup)
DROP POLICY IF EXISTS "Authenticated users can delete media" ON storage.objects;
CREATE POLICY "Authenticated users can delete media" ON storage.objects FOR DELETE TO authenticated
  USING ( bucket_id = 'media' );


-- ============================================
-- 11. FIX: Communities DELETE policy for creators
-- ============================================
DROP POLICY IF EXISTS "Creators can delete their communities" ON public.communities;
CREATE POLICY "Creators can delete their communities" ON public.communities FOR DELETE TO authenticated
  USING ( (select auth.uid()) = creator_id );
