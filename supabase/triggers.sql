-- Trigger to automatically create a profile in the 'users' table when a new user signs up via Supabase Auth
-- This ensures data consistency even if the frontend call fails.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, username, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'username', SPLIT_PART(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'name', SPLIT_PART(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 2. INTERACTION COUNTS (FOLLOWS)
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_follow_count()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.users SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
    UPDATE public.users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.users SET follower_count = follower_count - 1 WHERE id = OLD.following_id;
    UPDATE public.users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.handle_follow_count();

-- ==========================================
-- 3. INTERACTION COUNTS (LIKES)
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_like_count()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_like_count();

-- ==========================================
-- 4. INTERACTION COUNTS (COMMENTS & REPOSTS)
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_post_interaction_count()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    -- If it's a comment
    IF (NEW.parent_id IS NOT NULL) THEN
      UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.parent_id;
    END IF;
    -- If it's a repost (quoted post)
    IF (NEW.quoted_post_id IS NOT NULL) THEN
      UPDATE public.posts SET mirrors_count = mirrors_count + 1 WHERE id = NEW.quoted_post_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
    -- If it's a comment
    IF (OLD.parent_id IS NOT NULL) THEN
      UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.parent_id;
    END IF;
    -- If it's a repost (quoted post)
    IF (OLD.quoted_post_id IS NOT NULL) THEN
      UPDATE public.posts SET mirrors_count = mirrors_count - 1 WHERE id = OLD.quoted_post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_post_interaction_change
  AFTER INSERT OR DELETE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_interaction_count();

-- ==========================================
-- 5. USER STATS (POSTS COUNT)
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_user_posts_count()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    -- Increment only for top-level posts (optional: include comments too?)
    -- Hey usually shows total posts including comments in the count
    UPDATE public.users SET posts_count = posts_count + 1 WHERE id = NEW.user_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.users SET posts_count = posts_count - 1 WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_post_user_stats_change
  AFTER INSERT OR DELETE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_posts_count();

-- ==========================================
-- 6. CHAT METADATA (LAST MESSAGE)
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS trigger AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message_at = NEW.created_at,
    last_message_content = NEW.content
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();
