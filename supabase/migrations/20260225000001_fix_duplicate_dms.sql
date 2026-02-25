-- Migration to fix duplicate DM conversations
-- Adds a stored function to atomically get or create a DM conversation

CREATE OR REPLACE FUNCTION public.get_or_create_dm(p_user_id UUID, p_target_id UUID)
RETURNS UUID AS $$
DECLARE
  v_conv_id UUID;
BEGIN
  -- 1. Try to find existing DM between these two users
  -- We look for a conversation where both are participants
  IF p_user_id = p_target_id THEN
    -- Special case for self-DM: find conversation with ONLY this user
    SELECT cp1.conversation_id INTO v_conv_id
    FROM public.conversation_participants cp1
    JOIN public.conversations c ON c.id = cp1.conversation_id
    WHERE c.is_group = FALSE
      AND cp1.user_id = p_user_id
      AND (SELECT count(*) FROM public.conversation_participants cp2 WHERE cp2.conversation_id = cp1.conversation_id) = 1
    LIMIT 1;
  ELSE
    SELECT cp1.conversation_id INTO v_conv_id
    FROM public.conversation_participants cp1
    JOIN public.conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
    JOIN public.conversations c ON c.id = cp1.conversation_id
    WHERE c.is_group = FALSE
      AND cp1.user_id = p_user_id
      AND cp2.user_id = p_target_id
      AND (SELECT count(*) FROM public.conversation_participants cp3 WHERE cp3.conversation_id = cp1.conversation_id) = 2
    LIMIT 1;
  END IF;

  -- 2. If exists, return it
  IF v_conv_id IS NOT NULL THEN
    RETURN v_conv_id;
  END IF;

  -- 3. If not, create new conversation
  INSERT INTO public.conversations (is_group, creator_id)
  VALUES (FALSE, p_user_id)
  RETURNING id INTO v_conv_id;

  -- 4. Add participants
  IF p_user_id = p_target_id THEN
    INSERT INTO public.conversation_participants (conversation_id, user_id)
    VALUES (v_conv_id, p_user_id);
  ELSE
    INSERT INTO public.conversation_participants (conversation_id, user_id)
    VALUES 
      (v_conv_id, p_user_id),
      (v_conv_id, p_target_id);
  END IF;

  RETURN v_conv_id;
EXCEPTION
  WHEN unique_violation THEN
    -- Fallback to finding it again
    IF p_user_id = p_target_id THEN
      SELECT cp1.conversation_id INTO v_conv_id
      FROM public.conversation_participants cp1
      JOIN public.conversations c ON c.id = cp1.conversation_id
      WHERE c.is_group = FALSE
        AND cp1.user_id = p_user_id
        AND (SELECT count(*) FROM public.conversation_participants cp2 WHERE cp2.conversation_id = cp1.conversation_id) = 1
      LIMIT 1;
    ELSE
      SELECT cp1.conversation_id INTO v_conv_id
      FROM public.conversation_participants cp1
      JOIN public.conversation_participants cp2 ON cp1.conversation_id = cp2.conversation_id
      JOIN public.conversations c ON c.id = cp1.conversation_id
      WHERE c.is_group = FALSE
        AND cp1.user_id = p_user_id
        AND cp2.user_id = p_target_id
      LIMIT 1;
    END IF;
    
    RETURN v_conv_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
