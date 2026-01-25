-- Sysm Automation Triggers & Functions
-- Last Updated: 2026-01-25

-- ==========================================
-- 1. USER AUTH & PROFILES
-- ==========================================

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

-- ==========================================
-- 3. INTERACTION COUNTS (LIKES & REPOSTS)
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_post_stats()
RETURNS trigger AS $$
BEGIN
  -- Likes
  IF (TG_TABLE_NAME = 'likes') THEN
    IF (TG_OP = 'INSERT') THEN
      UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    ELSE
      UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    END IF;
  -- Reposts
  ELSIF (TG_TABLE_NAME = 'reposts') THEN
    IF (TG_OP = 'INSERT') THEN
      UPDATE public.posts SET mirrors_count = mirrors_count + 1 WHERE id = NEW.post_id;
    ELSE
      UPDATE public.posts SET mirrors_count = mirrors_count - 1 WHERE id = OLD.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. COMMENT COUNTS
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

-- ==========================================
-- 5. COMMUNITY STATS
-- ==========================================

CREATE OR REPLACE FUNCTION public.handle_community_stats()
RETURNS trigger AS $$
BEGIN
  -- Members
  IF (TG_TABLE_NAME = 'community_members') THEN
    IF (TG_OP = 'INSERT') THEN
      UPDATE public.communities SET members_count = members_count + 1 WHERE id = NEW.community_id;
    ELSE
      UPDATE public.communities SET members_count = members_count - 1 WHERE id = OLD.community_id;
    END IF;
  -- Posts
  ELSIF (TG_TABLE_NAME = 'posts' AND NEW.community_id IS NOT NULL) THEN
    IF (TG_OP = 'INSERT') THEN
      UPDATE public.communities SET posts_count = posts_count + 1 WHERE id = NEW.community_id;
    ELSE
      UPDATE public.communities SET posts_count = posts_count - 1 WHERE id = OLD.community_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 6. HASHTAG EXTRACTION
-- ==========================================

CREATE OR REPLACE FUNCTION public.extract_hashtags()
RETURNS trigger AS $$
DECLARE
  hashtag_text TEXT;
  hashtag_id_val UUID;
BEGIN
  FOR hashtag_text IN SELECT unnest(regexp_matches(NEW.content, '#[[:alnum:]_]+', 'g')) LOOP
    hashtag_text := lower(hashtag_text);
    
    INSERT INTO public.hashtags (name, usage_count, last_used_at)
    VALUES (hashtag_text, 1, NOW())
    ON CONFLICT (name) DO UPDATE 
    SET usage_count = hashtags.usage_count + 1, last_used_at = NOW()
    RETURNING id INTO hashtag_id_val;

    INSERT INTO public.post_hashtags (post_id, hashtag_id)
    VALUES (NEW.id, hashtag_id_val)
    ON CONFLICT DO NOTHING;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 7. NOTIFICATIONS
-- ==========================================

CREATE OR REPLACE FUNCTION public.create_notification()
RETURNS trigger AS $$
BEGIN
  -- Likes
  IF (TG_TABLE_NAME = 'likes') THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
    SELECT user_id, NEW.user_id, 'like', NEW.post_id
    FROM public.posts WHERE id = NEW.post_id AND user_id != NEW.user_id;
  -- Follows
  ELSIF (TG_TABLE_NAME = 'follows') THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type)
    VALUES (NEW.following_id, NEW.follower_id, 'follow');
  -- Comments
  ELSIF (TG_TABLE_NAME = 'comments') THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
    SELECT user_id, NEW.user_id, 'comment', NEW.post_id
    FROM public.posts WHERE id = NEW.post_id AND user_id != NEW.user_id;
  -- Reposts
  ELSIF (TG_TABLE_NAME = 'reposts') THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
    SELECT user_id, NEW.user_id, 'repost', NEW.post_id
    FROM public.posts WHERE id = NEW.post_id AND user_id != NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- BIND ALL TRIGGERS
-- ==========================================

-- Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Follows
DROP TRIGGER IF EXISTS on_follow_change ON public.follows;
CREATE TRIGGER on_follow_change AFTER INSERT OR DELETE ON public.follows FOR EACH ROW EXECUTE FUNCTION public.handle_follow_count();

-- Likes & Reposts
DROP TRIGGER IF EXISTS on_like_change ON public.likes;
CREATE TRIGGER on_like_change AFTER INSERT OR DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION public.handle_post_stats();

DROP TRIGGER IF EXISTS on_repost_change ON public.reposts;
CREATE TRIGGER on_repost_change AFTER INSERT OR DELETE ON public.reposts FOR EACH ROW EXECUTE FUNCTION public.handle_post_stats();

-- Comments
DROP TRIGGER IF EXISTS on_comment_change ON public.comments;
CREATE TRIGGER on_comment_change AFTER INSERT OR DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.handle_comment_count();

-- Communities
DROP TRIGGER IF EXISTS on_community_member_change ON public.community_members;
CREATE TRIGGER on_community_member_change AFTER INSERT OR DELETE ON public.community_members FOR EACH ROW EXECUTE FUNCTION public.handle_community_stats();

DROP TRIGGER IF EXISTS on_community_post_change ON public.posts;
CREATE TRIGGER on_community_post_change AFTER INSERT OR DELETE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.handle_community_stats();

-- Hashtags
DROP TRIGGER IF EXISTS on_post_hashtags ON public.posts;
CREATE TRIGGER on_post_hashtags AFTER INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION public.extract_hashtags();

-- Notifications
CREATE TRIGGER on_like_notification AFTER INSERT ON public.likes FOR EACH ROW EXECUTE FUNCTION public.create_notification();
CREATE TRIGGER on_follow_notification AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION public.create_notification();
CREATE TRIGGER on_comment_notification AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.create_notification();
CREATE TRIGGER on_repost_notification AFTER INSERT ON public.reposts FOR EACH ROW EXECUTE FUNCTION public.create_notification();