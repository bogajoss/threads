-- Migration to add character limit on posts based on user's pro status

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION public.check_post_character_limit()
RETURNS TRIGGER AS $$
DECLARE
  is_pro_user BOOLEAN;
  character_limit INTEGER;
  regular_limit INTEGER := 500;
  pro_limit INTEGER := 2500;
BEGIN
  -- Get the user's pro status
  SELECT is_pro INTO is_pro_user FROM public.users WHERE id = NEW.user_id;

  -- Set character limit based on pro status
  IF COALESCE(is_pro_user, false) THEN
    character_limit := pro_limit;
  ELSE
    character_limit := regular_limit;
  END IF;

  -- Check if post content exceeds the limit
  IF char_length(NEW.content) > character_limit THEN
    RAISE EXCEPTION 'Post content exceeds character limit. Pro users: % characters, others: % characters.', pro_limit, regular_limit;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the trigger
CREATE TRIGGER before_post_insert_check_char_limit
BEFORE INSERT ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.check_post_character_limit();
