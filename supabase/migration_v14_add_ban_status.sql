-- Migration V14: Add Ban Status to Users
-- Adds a boolean to track if a user is banned and updates views/policies.

-- 1. Add is_banned column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- 2. Update handle_new_user trigger function to include default is_banned
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, username, display_name, role, is_banned)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', SPLIT_PART(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'name', SPLIT_PART(new.email, '@', 1)),
    'user',
    FALSE
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update unified_posts view to include is_banned in author_data
CREATE OR REPLACE VIEW public.unified_posts AS
SELECT 
    (p.id::text || '-orig') as feed_id,
    p.id, p.user_id, p.community_id, p.content, p.type, p.media, p.poll, p.quoted_post_id,
    p.likes_count, p.comments_count, p.mirrors_count, p.views_count, p.created_at, p.parent_id,
    p.created_at as sort_timestamp,
    NULL::uuid as reposter_id,
    jsonb_build_object(
        'id', u.id, 'username', u.username, 'display_name', u.display_name, 'avatar_url', u.avatar_url, 'is_verified', u.is_verified, 'role', u.role, 'is_banned', u.is_banned
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
WHERE u.is_banned = FALSE
UNION ALL
SELECT 
    (p.id::text || '-' || r.user_id::text) as feed_id,
    p.id, p.user_id, p.community_id, p.content, p.type, p.media, p.poll, p.quoted_post_id,
    p.likes_count, p.comments_count, p.mirrors_count, p.views_count, p.created_at, p.parent_id,
    r.created_at as sort_timestamp,
    r.user_id as reposter_id,
    jsonb_build_object(
        'id', u.id, 'username', u.username, 'display_name', u.display_name, 'avatar_url', u.avatar_url, 'is_verified', u.is_verified, 'role', u.role, 'is_banned', u.is_banned
    ) as author_data,
    CASE 
        WHEN p.community_id IS NOT NULL THEN jsonb_build_object('id', c.id, 'handle', c.handle, 'name', c.name, 'avatar_url', c.avatar_url)
        ELSE NULL
    END as community_data,
    jsonb_build_object(
        'id', ru.id, 'username', ru.username, 'display_name', ru.display_name, 'avatar_url', ru.avatar_url, 'role', ru.role, 'is_banned', ru.is_banned
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
LEFT JOIN public.communities c ON p.community_id = c.id
WHERE u.is_banned = FALSE AND ru.is_banned = FALSE;

-- 4. RLS Update: Banned users cannot insert/update content
CREATE OR REPLACE FUNCTION public.is_not_banned()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND is_banned = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing policies (or add new ones that check is_banned)
-- For simplicity, we'll just use the function in new policies or modify critical ones.

CREATE POLICY "Banned users cannot post" ON public.posts
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id AND public.is_not_banned());

CREATE POLICY "Banned users cannot comment" ON public.comments
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id AND public.is_not_banned());

-- 5. Admin function to toggle ban
CREATE OR REPLACE FUNCTION public.toggle_user_ban(target_user_id UUID, ban_status BOOLEAN)
RETURNS void AS $$
DECLARE
    requestor_role TEXT;
BEGIN
    SELECT role INTO requestor_role FROM public.users WHERE id = auth.uid();
    
    IF requestor_role != 'admin' AND requestor_role != 'moderator' THEN
        RAISE EXCEPTION 'Only admins or moderators can ban users';
    END IF;

    UPDATE public.users SET is_banned = ban_status WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
