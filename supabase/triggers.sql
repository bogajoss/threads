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
    -- If it's a repost (quoted post)
    IF (NEW.quoted_post_id IS NOT NULL) THEN
      UPDATE public.posts SET mirrors_count = mirrors_count + 1 WHERE id = NEW.quoted_post_id;
    END IF;
  ELSIF (TG_OP = 'DELETE') THEN
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
-- 4.5. COMMENT COUNTS (NEW TABLE)
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_comment_count()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_comment_change
  AFTER INSERT OR DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_comment_count();

-- ==========================================
-- 4.7. REPOST COUNTS
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_repost_count()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.posts SET mirrors_count = mirrors_count + 1 WHERE id = NEW.post_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.posts SET mirrors_count = mirrors_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_repost_change
  AFTER INSERT OR DELETE ON public.reposts
  FOR EACH ROW EXECUTE FUNCTION public.handle_repost_count();

-- ==========================================
-- 5. USER STATS (POSTS COUNT)
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_user_posts_count()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    -- Increment only for top-level posts (optional: include comments too?)
    -- Sysm usually shows total posts including comments in the count
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

-- Function to handle conversation update when a message is deleted
CREATE OR REPLACE FUNCTION public.handle_message_delete()
RETURNS trigger AS $$
BEGIN
  UPDATE public.conversations
  SET 
    last_message_at = (SELECT created_at FROM public.messages WHERE conversation_id = OLD.conversation_id ORDER BY created_at DESC LIMIT 1),
    last_message_content = (SELECT content FROM public.messages WHERE conversation_id = OLD.conversation_id ORDER BY created_at DESC LIMIT 1)
  WHERE id = OLD.conversation_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_message_deleted
  AFTER DELETE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_message_delete();

-- ==========================================
-- 7. NOTIFICATIONS AUTOMATION
-- ==========================================

-- Function to handle notification creation
CREATE OR REPLACE FUNCTION public.create_notification()
RETURNS trigger AS $$
BEGIN
  -- 1. For LIKES
  IF (TG_TABLE_NAME = 'likes') THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
    SELECT user_id, NEW.user_id, 'like', NEW.post_id
    FROM public.posts WHERE id = NEW.post_id
    AND user_id != NEW.user_id; -- Don't notify if I like my own post
  
  -- 2. For FOLLOWS
  ELSIF (TG_TABLE_NAME = 'follows') THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type)
    VALUES (NEW.following_id, NEW.follower_id, 'follow');

  -- 3. For COMMENTS (from comments table)
  ELSIF (TG_TABLE_NAME = 'comments') THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
    SELECT user_id, NEW.user_id, 'comment', NEW.post_id
    FROM public.posts WHERE id = NEW.post_id
    AND user_id != NEW.user_id; -- Don't notify if I reply to my own post

  -- 4. For REPOSTS
  ELSIF (TG_TABLE_NAME = 'reposts') THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
    SELECT user_id, NEW.user_id, 'repost', NEW.post_id
    FROM public.posts WHERE id = NEW.post_id
    AND user_id != NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind triggers to tables
CREATE TRIGGER on_like_notification AFTER INSERT ON public.likes FOR EACH ROW EXECUTE FUNCTION public.create_notification();
CREATE TRIGGER on_follow_notification AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION public.create_notification();
CREATE TRIGGER on_comment_notification AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.create_notification();
CREATE TRIGGER on_repost_notification AFTER INSERT ON public.reposts FOR EACH ROW EXECUTE FUNCTION public.create_notification();
