-- Migration V11: Add commenter_avatars to unified_posts view for Threads-style reply indicators

DROP VIEW IF EXISTS public.unified_posts;

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
        'id', u.id, 'username', u.username, 'display_name', u.display_name, 'avatar_url', u.avatar_url, 'is_verified', u.is_verified
    ) as author_data,
    CASE 
        WHEN p.community_id IS NOT NULL THEN jsonb_build_object('id', c.id, 'handle', c.handle, 'name', c.name, 'avatar_url', c.avatar_url)
        ELSE NULL
    END as community_data,
    jsonb_build_object(
        'id', ru.id, 'username', ru.username, 'display_name', ru.display_name, 'avatar_url', ru.avatar_url
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
