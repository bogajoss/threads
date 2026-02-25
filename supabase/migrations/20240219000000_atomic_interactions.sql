-- Atomic Toggle Like and Repost functions to prevent race conditions and 409 conflicts

CREATE OR REPLACE FUNCTION public.toggle_like(
  p_post_id UUID DEFAULT NULL,
  p_comment_id UUID DEFAULT NULL,
  p_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  -- Ensure exactly one is provided
  IF (p_post_id IS NOT NULL AND p_comment_id IS NOT NULL) OR (p_post_id IS NULL AND p_comment_id IS NULL) THEN
    RAISE EXCEPTION 'Must provide either post_id or comment_id, not both.';
  END IF;

  IF p_post_id IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.likes 
      WHERE post_id = p_post_id AND user_id = p_user_id
    ) INTO v_exists;

    IF v_exists THEN
      DELETE FROM public.likes 
      WHERE post_id = p_post_id AND user_id = p_user_id;
      RETURN FALSE;
    ELSE
      INSERT INTO public.likes (post_id, user_id)
      VALUES (p_post_id, p_user_id)
      ON CONFLICT (post_id, user_id) DO NOTHING;
      RETURN TRUE;
    END IF;
  ELSE
    SELECT EXISTS (
      SELECT 1 FROM public.comment_likes 
      WHERE comment_id = p_comment_id AND user_id = p_user_id
    ) INTO v_exists;

    IF v_exists THEN
      DELETE FROM public.comment_likes 
      WHERE comment_id = p_comment_id AND user_id = p_user_id;
      RETURN FALSE;
    ELSE
      INSERT INTO public.comment_likes (comment_id, user_id)
      VALUES (p_comment_id, p_user_id)
      ON CONFLICT (comment_id, user_id) DO NOTHING;
      RETURN TRUE;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.toggle_repost(p_post_id UUID, p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.reposts 
    WHERE post_id = p_post_id AND user_id = p_user_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.reposts 
    WHERE post_id = p_post_id AND user_id = p_user_id;
    RETURN FALSE;
  ELSE
    INSERT INTO public.reposts (post_id, user_id)
    VALUES (p_post_id, p_user_id)
    ON CONFLICT (post_id, user_id) DO NOTHING;
    RETURN TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
