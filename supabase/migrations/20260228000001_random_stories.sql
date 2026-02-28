-- Create a function to get 9 random active stories
CREATE OR REPLACE FUNCTION get_random_stories(limit_count INT DEFAULT 9)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  media_url TEXT,
  type TEXT,
  content TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  views_count INT,
  user_data JSONB
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.user_id,
    s.media_url,
    s.type,
    s.content,
    s.expires_at,
    s.created_at,
    (SELECT COUNT(*)::INT FROM public.story_views sv WHERE sv.story_id = s.id) as views_count,
    jsonb_build_object(
      'id', u.id,
      'display_name', u.display_name,
      'username', u.username,
      'avatar_url', u.avatar_url,
      'is_verified', u.is_verified,
      'role', u.role,
      'roles', u.roles
    ) as user_data
  FROM public.stories s
  JOIN public.users u ON s.user_id = u.id
  WHERE s.expires_at > NOW()
  ORDER BY RANDOM()
  LIMIT limit_count;
END;
$$;
