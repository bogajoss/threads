-- Migration to add Views Counter (FIXED)

-- 1. Add views_count to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- 2. Drop and recreate unified_posts view to include views_count
-- We use DROP because Postgres doesn't allow adding columns in the middle of a view with REPLACE
DROP VIEW IF EXISTS public.unified_posts CASCADE;

CREATE OR REPLACE VIEW public.unified_posts AS
SELECT 
    (p.id::text || '-orig') as feed_id,
    p.id, p.user_id, p.community_id, p.content, p.type, p.media, p.poll, p.quoted_post_id,
    p.likes_count, p.comments_count, p.mirrors_count, p.views_count, p.created_at, p.parent_id,
    p.created_at as sort_timestamp,
    NULL::uuid as reposter_id,
    jsonb_build_object(
        'id', u.id, 'username', u.username, 'display_name', u.display_name, 'avatar_url', u.avatar_url, 'is_verified', u.is_verified
    ) as author_data,
    CASE 
        WHEN p.community_id IS NOT NULL THEN jsonb_build_object('id', c.id, 'handle', c.handle, 'name', c.name, 'avatar_url', c.avatar_url)
        ELSE NULL
    END as community_data,
    NULL::jsonb as reposter_data
FROM public.posts p
JOIN public.users u ON p.user_id = u.id
LEFT JOIN public.communities c ON p.community_id = c.id
UNION ALL
SELECT 
    (p.id::text || '-' || r.user_id::text) as feed_id,
    p.id, p.user_id, p.community_id, p.content, p.type, p.media, p.poll, p.quoted_post_id,
    p.likes_count, p.comments_count, p.mirrors_count, p.views_count, p.created_at, p.parent_id,
    r.created_at as sort_timestamp,
    r.user_id as reposter_id,
    jsonb_build_object(
        'id', u.id, 'username', u.username, 'display_name', u.display_name, 'avatar_url', u.avatar_url, 'is_verified', u.is_verified
    ) as author_data,
    CASE 
        WHEN p.community_id IS NOT NULL THEN jsonb_build_object('id', c.id, 'handle', c.handle, 'name', c.name, 'avatar_url', c.avatar_url)
        ELSE NULL
    END as community_data,
    jsonb_build_object(
        'id', ru.id, 'username', ru.username, 'display_name', ru.display_name, 'avatar_url', ru.avatar_url
    ) as reposter_data
FROM public.reposts r
JOIN public.posts p ON r.post_id = p.id
JOIN public.users u ON p.user_id = u.id
JOIN public.users ru ON r.user_id = ru.id
LEFT JOIN public.communities c ON p.community_id = c.id;

-- Relationship hints for API
COMMENT ON COLUMN public.unified_posts.user_id IS 'FK users(id)';
COMMENT ON COLUMN public.unified_posts.community_id IS 'FK communities(id)';
COMMENT ON COLUMN public.unified_posts.reposter_id IS 'FK users(id)';

-- 3. Add RPC function to increment views atomically
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET views_count = views_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;