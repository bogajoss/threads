-- Migration V12: Add User Role
-- Adds a global role to users for administrative purposes.

-- 1. Add role column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' 
CHECK (role IN ('user', 'admin', 'moderator'));

-- 2. Update handle_new_user trigger function to include default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, username, display_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', SPLIT_PART(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'name', SPLIT_PART(new.email, '@', 1)),
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update unified_posts view to include role in author_data
CREATE OR REPLACE VIEW public.unified_posts AS
SELECT 
    (p.id::text || '-orig') as feed_id,
    p.id, p.user_id, p.community_id, p.content, p.type, p.media, p.poll, p.quoted_post_id,
    p.likes_count, p.comments_count, p.mirrors_count, p.views_count, p.created_at, p.parent_id,
    p.created_at as sort_timestamp,
    NULL::uuid as reposter_id,
    jsonb_build_object(
        'id', u.id, 'username', u.username, 'display_name', u.display_name, 'avatar_url', u.avatar_url, 'is_verified', u.is_verified, 'role', u.role
    ) as author_data,
    CASE 
        WHEN p.community_id IS NOT NULL THEN jsonb_build_object('id', c.id, 'handle', c.handle, 'name', c.name, 'avatar_url', c.avatar_url)
        ELSE NULL
    END as community_data,
    NULL::jsonb as reposter_data,
    (
      SELECT jsonb_agg(avatar_url)
      FROM (
        SELECT u_c.avatar_url
        FROM public.comments cm
        JOIN public.users u_c ON cm.user_id = u_c.id
        WHERE cm.post_id = p.id
        ORDER BY cm.created_at DESC
        LIMIT 3
      ) sub
    ) as commenter_avatars
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
        'id', u.id, 'username', u.username, 'display_name', u.display_name, 'avatar_url', u.avatar_url, 'is_verified', u.is_verified, 'role', u.role
    ) as author_data,
    CASE 
        WHEN p.community_id IS NOT NULL THEN jsonb_build_object('id', c.id, 'handle', c.handle, 'name', c.name, 'avatar_url', c.avatar_url)
        ELSE NULL
    END as community_data,
    jsonb_build_object(
        'id', ru.id, 'username', ru.username, 'display_name', ru.display_name, 'avatar_url', ru.avatar_url, 'role', ru.role
    ) as reposter_data,
    (
      SELECT jsonb_agg(avatar_url)
      FROM (
        SELECT u_c.avatar_url
        FROM public.comments cm
        JOIN public.users u_c ON cm.user_id = u_c.id
        WHERE cm.post_id = p.id
        ORDER BY cm.created_at DESC
        LIMIT 3
      ) sub
    ) as commenter_avatars
FROM public.reposts r
JOIN public.posts p ON r.post_id = p.id
JOIN public.users u ON p.user_id = u.id
JOIN public.users ru ON r.user_id = ru.id
LEFT JOIN public.communities c ON p.community_id = c.id;
