-- Sysm Master Database Schema
-- Optimized for High Scale, Reposts, and Data Integrity

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- Critical for search

-- 2. TYPES
DO $$ BEGIN
    CREATE TYPE post_type AS ENUM ('text', 'image', 'video', 'poll', 'repost', 'file', 'reel');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE notification_type AS ENUM ('like', 'mention', 'follow', 'repost', 'comment', 'report');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES

-- Users
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT DEFAULT '/default-avatar.webp',
  cover_url TEXT DEFAULT '/welcome-banner.webp',
  website TEXT,
  location TEXT,
  
  -- Stats
  is_verified BOOLEAN DEFAULT FALSE,
  following_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  
  -- Pro & Roles
  roles TEXT DEFAULT 'Newbie' CHECK (roles IN ('Elite', 'Hunter', 'Newbie')),
  role TEXT DEFAULT 'user', -- Added column per main.sql notes
  is_pro BOOLEAN DEFAULT FALSE,
  pro_valid_till TIMESTAMP WITH TIME ZONE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,

  -- Timestamps
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admins (Defined later in main.sql but good to have early if possible, but keeping chronological with main.sql implies it might be an addon. I will include it here for cleanliness)
CREATE TABLE IF NOT EXISTS public.admins (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follows
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- Communities
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT DEFAULT '/default-avatar.webp',
  cover_url TEXT,
  creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.community_members (
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (community_id, user_id)
);

-- Content
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.posts(id) ON DELETE CASCADE, 
  
  content TEXT,
  type post_type DEFAULT 'text',
  media JSONB DEFAULT '[]'::jsonb,
  poll JSONB,
  quoted_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  
  -- Denormalized Counts
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  mirrors_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  
  -- FIX A: Stored Engagement Score (Pre-calculated)
  -- This removes the "Math in Query" bottleneck for the engagement part
  engagement_score INTEGER GENERATED ALWAYS AS (likes_count + comments_count + 1) STORED,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media JSONB DEFAULT '[]'::jsonb,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hashtags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  usage_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interactions
CREATE TABLE IF NOT EXISTS public.likes (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.comment_likes (
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.reposts (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.post_hashtags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  hashtag_id UUID REFERENCES public.hashtags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, hashtag_id)
);

CREATE TABLE IF NOT EXISTS public.link_previews (
  url TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  image TEXT,
  site_name TEXT,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_content TEXT,
  is_group BOOLEAN DEFAULT FALSE,
  name TEXT,
  avatar_url TEXT,
  creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  media JSONB DEFAULT '[]'::jsonb,
  reply_to_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.message_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Ephemeral & Activity
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  media_url TEXT NOT NULL,
  type TEXT DEFAULT 'image',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  actor_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'reel', 'user', 'community')),
    target_id UUID NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Materialized View (Trending)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.trending_hashtags AS
SELECT 
  h.name, 
  COUNT(ph.post_id) as usage_count
FROM public.hashtags h
JOIN public.post_hashtags ph ON h.id = ph.hashtag_id
JOIN public.posts p ON ph.post_id = p.id
WHERE p.created_at > (NOW() - INTERVAL '24 hours')
GROUP BY h.name
ORDER BY usage_count DESC
LIMIT 10;

CREATE UNIQUE INDEX IF NOT EXISTS idx_trending_hashtags_name ON public.trending_hashtags(name);


-- 4. STORAGE & REALTIME
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Enable realtime
DO $$ BEGIN
  alter publication supabase_realtime add table public.messages;
EXCEPTION
  WHEN OTHERS THEN null;
END $$;
DO $$ BEGIN
  alter publication supabase_realtime add table public.notifications;
EXCEPTION
  WHEN OTHERS THEN null;
END $$;
DO $$ BEGIN
  alter publication supabase_realtime add table public.message_reactions;
EXCEPTION
  WHEN OTHERS THEN null;
END $$;


-- 5. PERFORMANCE INDEXES

-- Standard FK Indexes
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON public.posts(community_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_user ON public.likes(post_id, user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_content_trgm ON public.posts USING gin (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_username_trgm ON public.users USING gin (username gin_trgm_ops);

-- FIX A: Optimized Feed Index
-- We index (created_at DESC, engagement_score DESC) together.
-- This helps the database quickly find "New" posts that also have "High Scores".
CREATE INDEX IF NOT EXISTS idx_posts_feed_opt ON public.posts(created_at DESC, engagement_score DESC);


-- 6. FUNCTIONS & ALGORITHMS

-- FIX D: Maintenance Function (Corrects Counter Drift)
-- Run this via pg_cron or manually if stats look wrong
CREATE OR REPLACE FUNCTION public.maintenance_sync_counters()
RETURNS void AS $$
BEGIN
  -- 1. Sync User Stats
  UPDATE public.users u
  SET 
    following_count = (SELECT count(*) FROM public.follows f WHERE f.follower_id = u.id),
    follower_count = (SELECT count(*) FROM public.follows f WHERE f.following_id = u.id),
    posts_count = (SELECT count(*) FROM public.posts p WHERE p.user_id = u.id);

  -- 2. Sync Post Stats
  UPDATE public.posts p
  SET 
    likes_count = (SELECT count(*) FROM public.likes l WHERE l.post_id = p.id),
    comments_count = (SELECT count(*) FROM public.comments c WHERE c.post_id = p.id),
    mirrors_count = (SELECT count(*) FROM public.reposts r WHERE r.post_id = p.id);
    
  -- 3. Sync Comment Stats
  UPDATE public.comments c
  SET
    likes_count = (SELECT count(*) FROM public.comment_likes cl WHERE cl.comment_id = c.id),
    replies_count = (SELECT count(*) FROM public.comments r WHERE r.parent_id = c.id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Other Helpers
CREATE OR REPLACE FUNCTION public.get_who_to_follow(limit_val INT DEFAULT 10)
RETURNS TABLE (id UUID, username TEXT, display_name TEXT, avatar_url TEXT, mutual_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.username, u.display_name, u.avatar_url, COUNT(f1.follower_id) as mutual_count
  FROM public.follows f1
  JOIN public.follows f2 ON f1.following_id = f2.follower_id
  JOIN public.users u ON f2.following_id = u.id
  WHERE f1.follower_id = auth.uid() AND f2.following_id != auth.uid()
  AND NOT EXISTS (SELECT 1 FROM public.follows f3 WHERE f3.follower_id = auth.uid() AND f3.following_id = f2.following_id)
  GROUP BY u.id ORDER BY mutual_count DESC LIMIT limit_val;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.refresh_trending_hashtags()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.trending_hashtags;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.check_rate_limit()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.posts WHERE user_id = auth.uid() AND created_at > (NOW() - INTERVAL '5 seconds') AND TG_TABLE_NAME = 'posts') 
  OR EXISTS (SELECT 1 FROM public.comments WHERE user_id = auth.uid() AND created_at > (NOW() - INTERVAL '5 seconds') AND TG_TABLE_NAME = 'comments') THEN
    RAISE EXCEPTION 'Rate limit exceeded: Please wait 5 seconds before posting again.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_conversation_participant(conv_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = conv_id AND user_id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION mark_messages_read(p_conversation_id UUID)
RETURNS VOID AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = p_conversation_id AND user_id = auth.uid()) THEN
    UPDATE public.messages SET is_read = true WHERE conversation_id = p_conversation_id AND sender_id != auth.uid() AND is_read = false;
  ELSE
    RAISE EXCEPTION 'Not a participant';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_not_banned()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_banned = FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.toggle_user_ban(target_user_id UUID, ban_status BOOLEAN)
RETURNS void AS $$
DECLARE requestor_role TEXT;
BEGIN
    SELECT roles INTO requestor_role FROM public.users WHERE id = auth.uid();
    IF requestor_role = 'Elite' THEN UPDATE public.users SET is_banned = ban_status WHERE id = target_user_id;
    ELSE RAISE EXCEPTION 'Insufficient permissions'; END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts SET views_count = views_count + 1 WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, username, display_name, roles, is_pro, is_banned)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'username', SPLIT_PART(new.email, '@', 1)), COALESCE(new.raw_user_meta_data->>'name', SPLIT_PART(new.email, '@', 1)), 'Newbie', FALSE, FALSE);
  RETURN new;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_follow_count() RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN UPDATE public.users SET follower_count = follower_count + 1 WHERE id = NEW.following_id; UPDATE public.users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF (TG_OP = 'DELETE') THEN UPDATE public.users SET follower_count = follower_count - 1 WHERE id = OLD.following_id; UPDATE public.users SET following_count = following_count - 1 WHERE id = OLD.follower_id; END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_post_stats() RETURNS trigger AS $$
BEGIN
  IF (TG_TABLE_NAME = 'likes') THEN
    IF (TG_OP = 'INSERT') THEN UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id; ELSE UPDATE public.posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id; END IF;
  ELSIF (TG_TABLE_NAME = 'reposts') THEN
    IF (TG_OP = 'INSERT') THEN UPDATE public.posts SET mirrors_count = mirrors_count + 1 WHERE id = NEW.post_id; ELSE UPDATE public.posts SET mirrors_count = mirrors_count - 1 WHERE id = OLD.post_id; END IF;
  END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_comment_count() RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id; IF NEW.parent_id IS NOT NULL THEN UPDATE public.comments SET replies_count = replies_count + 1 WHERE id = NEW.parent_id; END IF;
  ELSIF (TG_OP = 'DELETE') THEN UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id; IF OLD.parent_id IS NOT NULL THEN UPDATE public.comments SET replies_count = replies_count - 1 WHERE id = OLD.parent_id; END IF; END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_community_stats() RETURNS trigger AS $$
BEGIN
  IF (TG_TABLE_NAME = 'community_members') THEN IF (TG_OP = 'INSERT') THEN UPDATE public.communities SET members_count = members_count + 1 WHERE id = NEW.community_id; ELSE UPDATE public.communities SET members_count = members_count - 1 WHERE id = OLD.community_id; END IF;
  ELSIF (TG_TABLE_NAME = 'posts' AND NEW.community_id IS NOT NULL) THEN IF (TG_OP = 'INSERT') THEN UPDATE public.communities SET posts_count = posts_count + 1 WHERE id = NEW.community_id; ELSE UPDATE public.communities SET posts_count = posts_count - 1 WHERE id = OLD.community_id; END IF; END IF;
  RETURN NULL;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.extract_hashtags() RETURNS trigger AS $$
DECLARE hashtag_text TEXT; hashtag_id_val UUID;
BEGIN
  FOR hashtag_text IN SELECT unnest(regexp_matches(NEW.content, '#[[:alnum:]_]+', 'g')) LOOP
    hashtag_text := lower(hashtag_text);
    INSERT INTO public.hashtags (name, usage_count, last_used_at) VALUES (hashtag_text, 1, NOW()) ON CONFLICT (name) DO UPDATE SET usage_count = hashtags.usage_count + 1, last_used_at = NOW() RETURNING id INTO hashtag_id_val;
    INSERT INTO public.post_hashtags (post_id, hashtag_id) VALUES (NEW.id, hashtag_id_val) ON CONFLICT DO NOTHING;
  END LOOP; RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_mentions() RETURNS trigger AS $$
DECLARE mention_username TEXT; mentioned_user_id UUID;
BEGIN
  IF NEW.content IS NULL THEN RETURN NEW; END IF;
  FOR mention_username IN SELECT unnest(regexp_matches(NEW.content, '@([[:alnum:]_]+)', 'g')) LOOP
    SELECT id INTO mentioned_user_id FROM public.users WHERE lower(username) = lower(mention_username);
    IF mentioned_user_id IS NOT NULL AND mentioned_user_id != NEW.user_id THEN
      INSERT INTO public.notifications (recipient_id, actor_id, type, post_id) VALUES (mentioned_user_id, NEW.user_id, 'mention', CASE WHEN TG_TABLE_NAME = 'comments' THEN NEW.post_id ELSE NEW.id END);
    END IF;
  END LOOP; RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.create_notification() RETURNS trigger AS $$
BEGIN
  IF (TG_TABLE_NAME = 'likes') THEN INSERT INTO public.notifications (recipient_id, actor_id, type, post_id) SELECT user_id, NEW.user_id, 'like', NEW.post_id FROM public.posts WHERE id = NEW.post_id AND user_id != NEW.user_id;
  ELSIF (TG_TABLE_NAME = 'follows') THEN INSERT INTO public.notifications (recipient_id, actor_id, type) VALUES (NEW.following_id, NEW.follower_id, 'follow');
  ELSIF (TG_TABLE_NAME = 'comments') THEN INSERT INTO public.notifications (recipient_id, actor_id, type, post_id) SELECT user_id, NEW.user_id, 'comment', NEW.post_id FROM public.posts WHERE id = NEW.post_id AND user_id != NEW.user_id; IF NEW.parent_id IS NOT NULL THEN INSERT INTO public.notifications (recipient_id, actor_id, type, post_id) SELECT c.user_id, NEW.user_id, 'comment', NEW.post_id FROM public.comments c JOIN public.posts p ON c.post_id = p.id WHERE c.id = NEW.parent_id AND c.user_id != NEW.user_id AND c.user_id != p.user_id; END IF;
  ELSIF (TG_TABLE_NAME = 'reposts') THEN INSERT INTO public.notifications (recipient_id, actor_id, type, post_id) SELECT user_id, NEW.user_id, 'repost', NEW.post_id FROM public.posts WHERE id = NEW.post_id AND user_id != NEW.user_id; END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.sync_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    UPDATE public.users SET role = NEW.role WHERE id = NEW.user_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.users SET role = 'user' WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.protect_role_column()
RETURNS TRIGGER AS $$
BEGIN
  -- If role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check if the current user is an admin
    IF NOT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND role = 'admin') THEN
       -- If not admin, revert the role change (silent fail) or raise error
       -- For safety, let's raise exception
       RAISE EXCEPTION 'You are not authorized to change your role.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users; CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
DROP TRIGGER IF EXISTS on_follow_change ON public.follows; CREATE TRIGGER on_follow_change AFTER INSERT OR DELETE ON public.follows FOR EACH ROW EXECUTE FUNCTION public.handle_follow_count();
DROP TRIGGER IF EXISTS on_like_change ON public.likes; CREATE TRIGGER on_like_change AFTER INSERT OR DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION public.handle_post_stats();
DROP TRIGGER IF EXISTS on_repost_change ON public.reposts; CREATE TRIGGER on_repost_change AFTER INSERT OR DELETE ON public.reposts FOR EACH ROW EXECUTE FUNCTION public.handle_post_stats();
DROP TRIGGER IF EXISTS on_comment_change ON public.comments; CREATE TRIGGER on_comment_change AFTER INSERT OR DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.handle_comment_count();
DROP TRIGGER IF EXISTS on_community_member_change ON public.community_members; CREATE TRIGGER on_community_member_change AFTER INSERT OR DELETE ON public.community_members FOR EACH ROW EXECUTE FUNCTION public.handle_community_stats();
DROP TRIGGER IF EXISTS on_community_post_change ON public.posts; CREATE TRIGGER on_community_post_change AFTER INSERT OR DELETE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.handle_community_stats();
DROP TRIGGER IF EXISTS on_post_hashtags ON public.posts; CREATE TRIGGER on_post_hashtags AFTER INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION public.extract_hashtags();
DROP TRIGGER IF EXISTS on_like_notification ON public.likes; CREATE TRIGGER on_like_notification AFTER INSERT ON public.likes FOR EACH ROW EXECUTE FUNCTION public.create_notification();
DROP TRIGGER IF EXISTS on_follow_notification ON public.follows; CREATE TRIGGER on_follow_notification AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION public.create_notification();
DROP TRIGGER IF EXISTS on_comment_notification ON public.comments; CREATE TRIGGER on_comment_notification AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.create_notification();
DROP TRIGGER IF EXISTS on_repost_notification ON public.reposts; CREATE TRIGGER on_repost_notification AFTER INSERT ON public.reposts FOR EACH ROW EXECUTE FUNCTION public.create_notification();
DROP TRIGGER IF EXISTS on_post_mentions ON public.posts; CREATE TRIGGER on_post_mentions AFTER INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION public.handle_mentions();
DROP TRIGGER IF EXISTS on_comment_mentions ON public.comments; CREATE TRIGGER on_comment_mentions AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.handle_mentions();
DROP TRIGGER IF EXISTS on_post_rate_limit ON public.posts; CREATE TRIGGER on_post_rate_limit BEFORE INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION public.check_rate_limit();
DROP TRIGGER IF EXISTS on_comment_rate_limit ON public.comments; CREATE TRIGGER on_comment_rate_limit BEFORE INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.check_rate_limit();
DROP TRIGGER IF EXISTS on_admin_change ON public.admins; CREATE TRIGGER on_admin_change AFTER INSERT OR UPDATE OR DELETE ON public.admins FOR EACH ROW EXECUTE FUNCTION public.sync_admin_role();
DROP TRIGGER IF EXISTS on_user_update_protect_role ON public.users; CREATE TRIGGER on_user_update_protect_role BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.protect_role_column();

-- 8. ALGORITHMIC FEEDS (FIX A + B: UNION REPOSTS + OPTIMIZED SCORING)

CREATE OR REPLACE FUNCTION public.get_posts_feed(
  limit_val INTEGER DEFAULT 20, 
  last_item_id UUID DEFAULT NULL, 
  last_item_score NUMERIC DEFAULT NULL
)
RETURNS TABLE (
  feed_id UUID,         -- Determines Pagination ID (Post ID or Repost ID)
  post_id UUID,         -- Actual Content ID (For clicking/viewing)
  created_at TIMESTAMPTZ, -- Sort Time (Repost time for reposts, Post time for posts)
  score NUMERIC,
  author_data JSONB,
  content TEXT,
  media JSONB,
  likes_count INT,
  comments_count INT,
  mirrors_count INT, -- Added this
  views_count INT,
  is_repost BOOLEAN,
  reposter_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH feed_items AS (
    -- 1. ORIGINAL POSTS
    SELECT 
      p.id as f_id,
      p.id as p_id,
      p.created_at as sort_time,
      -- Use pre-calculated engagement_score for speed
      ( p.engagement_score / POWER( (EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600) + 2, 1.8) )::NUMERIC as rank_score,
      u.id as u_id, u.username as u_name, u.avatar_url as u_avatar, u.roles as u_roles, u.is_pro as u_pro,
      p.content, p.media, p.likes_count, p.comments_count, p.mirrors_count, p.views_count,
      FALSE as is_repost,
      NULL::jsonb as reposter_json
    FROM public.posts p
    JOIN public.users u ON p.user_id = u.id
    WHERE 
      p.type != 'reel' AND
      u.is_banned = FALSE AND
      p.created_at > (NOW() - INTERVAL '7 days')

    UNION ALL

    -- 2. REPOSTS (FIX B)
    SELECT 
      r.post_id || r.user_id as f_id, -- Composite ID for uniqueness if needed, or just r.post_id if unique enough per user context
      p.id as p_id,
      r.created_at as sort_time, -- CRITICAL: Rank by when it was REPOSTED, not created
      -- Score uses Repost Time for gravity, but Original Engagement
      ( p.engagement_score / POWER( (EXTRACT(EPOCH FROM (NOW() - r.created_at))/3600) + 2, 1.8) )::NUMERIC as rank_score,
      u.id as u_id, u.username as u_name, u.avatar_url as u_avatar, u.roles as u_roles, u.is_pro as u_pro,
      p.content, p.media, p.likes_count, p.comments_count, p.mirrors_count, p.views_count,
      TRUE as is_repost,
      jsonb_build_object('username', ru.username, 'avatar_url', ru.avatar_url) as reposter_json
    FROM public.reposts r
    JOIN public.posts p ON r.post_id = p.id
    JOIN public.users u ON p.user_id = u.id -- Original Author
    JOIN public.users ru ON r.user_id = ru.id -- Reposter
    WHERE 
      p.type != 'reel' AND
      u.is_banned = FALSE AND ru.is_banned = FALSE AND
      r.created_at > (NOW() - INTERVAL '7 days')
  )
  SELECT 
    f.f_id,
    f.p_id,
    f.sort_time,
    f.rank_score,
    jsonb_build_object('username', f.u_name, 'avatar_url', f.u_avatar, 'roles', f.u_roles, 'is_pro', f.u_pro),
    f.content,
    f.media,
    f.likes_count,
    f.comments_count,
    f.mirrors_count,
    f.views_count,
    f.is_repost,
    f.reposter_json
  FROM feed_items f
  WHERE 
    (last_item_score IS NULL OR 
     f.rank_score < last_item_score OR
     (ABS(f.rank_score - last_item_score) < 0.0001 AND f.f_id < last_item_id)
    )
  ORDER BY f.rank_score DESC, f.f_id DESC
  LIMIT limit_val;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.get_reels_feed(
  limit_val INTEGER DEFAULT 20, 
  last_reel_id UUID DEFAULT NULL, 
  last_reel_score NUMERIC DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  created_at TIMESTAMPTZ,
  score NUMERIC,
  author_data JSONB,
  content TEXT,
  media JSONB,
  likes_count INT,
  comments_count INT,
  views_count INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.created_at,
    -- Reels Score: Higher gravity on views, longer shelf life
    -- Uses engagement_score + views logic
    ( (p.engagement_score + (p.views_count * 0.1)) / POWER( (EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600) + 2, 1.5) )::NUMERIC as score,
    jsonb_build_object('username', u.username, 'avatar_url', u.avatar_url, 'roles', u.roles, 'is_pro', u.is_pro) as author_data,
    p.content,
    p.media,
    p.likes_count,
    p.comments_count,
    p.views_count
  FROM public.posts p
  JOIN public.users u ON p.user_id = u.id
  WHERE 
    p.type = 'reel' AND
    u.is_banned = FALSE AND
    p.created_at > (NOW() - INTERVAL '30 days') AND
    (last_reel_score IS NULL OR 
     ( (p.engagement_score + (p.views_count * 0.1)) / POWER( (EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600) + 2, 1.5) ) < last_reel_score OR
     ( ABS(( (p.engagement_score + (p.views_count * 0.1)) / POWER( (EXTRACT(EPOCH FROM (NOW() - p.created_at))/3600) + 2, 1.5) ) - last_reel_score) < 0.0001 AND p.id < last_reel_id )
    )
  ORDER BY score DESC, p.id DESC
  LIMIT limit_val;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.get_profile_feed(
  target_user_id UUID,
  limit_val INTEGER DEFAULT 20, 
  last_item_time TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  feed_id UUID,
  post_id UUID,
  created_at TIMESTAMPTZ,
  author_data JSONB,
  content TEXT,
  media JSONB,
  likes_count INT,
  comments_count INT,
  mirrors_count INT,
  views_count INT,
  is_repost BOOLEAN,
  reposter_data JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH feed_items AS (
    -- 1. USER'S POSTS
    SELECT 
      p.id as f_id,
      p.id as p_id,
      p.created_at as sort_time,
      u.id as u_id, u.username as u_name, u.avatar_url as u_avatar, u.roles as u_roles, u.is_pro as u_pro,
      p.content, p.media, p.likes_count, p.comments_count, p.mirrors_count, p.views_count,
      FALSE as is_repost,
      NULL::jsonb as reposter_json
    FROM public.posts p
    JOIN public.users u ON p.user_id = u.id
    WHERE 
      p.user_id = target_user_id AND
      p.type != 'reel'

    UNION ALL

    -- 2. USER'S REPOSTS
    SELECT 
      r.post_id || r.user_id as f_id,
      p.id as p_id,
      r.created_at as sort_time,
      u.id as u_id, u.username as u_name, u.avatar_url as u_avatar, u.roles as u_roles, u.is_pro as u_pro,
      p.content, p.media, p.likes_count, p.comments_count, p.mirrors_count, p.views_count,
      TRUE as is_repost,
      jsonb_build_object('username', ru.username, 'avatar_url', ru.avatar_url) as reposter_json
    FROM public.reposts r
    JOIN public.posts p ON r.post_id = p.id
    JOIN public.users u ON p.user_id = u.id 
    JOIN public.users ru ON r.user_id = ru.id
    WHERE 
      r.user_id = target_user_id AND
      p.type != 'reel'
  )
  SELECT 
    f.f_id,
    f.p_id,
    f.sort_time,
    jsonb_build_object('username', f.u_name, 'avatar_url', f.u_avatar, 'roles', f.u_roles, 'is_pro', f.u_pro),
    f.content,
    f.media,
    f.likes_count,
    f.comments_count,
    f.mirrors_count,
    f.views_count,
    f.is_repost,
    f.reposter_json
  FROM feed_items f
  WHERE 
    (last_item_time IS NULL OR f.sort_time < last_item_time)
  ORDER BY f.sort_time DESC
  LIMIT limit_val;
END;
$$ LANGUAGE plpgsql STABLE;

-- 9. SEARCH & RLS (UNCHANGED)
CREATE OR REPLACE FUNCTION public.search_content(search_query TEXT, limit_val INT DEFAULT 10) RETURNS TABLE(id UUID, content TEXT, type post_type, author_username TEXT) AS $$
BEGIN RETURN QUERY SELECT p.id, p.content, p.type, u.username FROM public.posts p JOIN public.users u ON p.user_id = u.id WHERE p.content ILIKE '%' || search_query || '%' OR similarity(p.content, search_query) > 0.1 ORDER BY similarity(p.content, search_query) DESC, p.created_at DESC LIMIT limit_val; END; $$ LANGUAGE plpgsql STABLE;

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reposts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_previews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- POLICIES
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.users;
CREATE POLICY "Profiles are viewable by everyone" ON public.users FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE TO authenticated USING ( (select auth.uid()) = id ) WITH CHECK ( (select auth.uid()) = id );

DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id AND public.is_not_banned() );

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE TO authenticated USING ( (select auth.uid()) = user_id ) WITH CHECK ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id AND public.is_not_banned() );

DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE TO authenticated USING ( (select auth.uid()) = user_id ) WITH CHECK ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;
CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Authenticated users can like posts" ON public.likes;
CREATE POLICY "Authenticated users can like posts" ON public.likes FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Users can unlike posts" ON public.likes;
CREATE POLICY "Users can unlike posts" ON public.likes FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON public.comment_likes;
CREATE POLICY "Comment likes are viewable by everyone" ON public.comment_likes FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Authenticated users can like comments" ON public.comment_likes;
CREATE POLICY "Authenticated users can like comments" ON public.comment_likes FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Users can unlike comments" ON public.comment_likes;
CREATE POLICY "Users can unlike comments" ON public.comment_likes FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Reposts are viewable by everyone" ON public.reposts;
CREATE POLICY "Reposts are viewable by everyone" ON public.reposts FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Authenticated users can repost" ON public.reposts;
CREATE POLICY "Authenticated users can repost" ON public.reposts FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Users can remove their reposts" ON public.reposts;
CREATE POLICY "Users can remove their reposts" ON public.reposts FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Follows are viewable by everyone" ON public.follows;
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Authenticated users can follow others" ON public.follows;
CREATE POLICY "Authenticated users can follow others" ON public.follows FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = follower_id );

DROP POLICY IF EXISTS "Users can unfollow" ON public.follows;
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE TO authenticated USING ( (select auth.uid()) = follower_id );

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT TO authenticated USING ( (select auth.uid()) = recipient_id );

DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE TO authenticated USING ( (select auth.uid()) = recipient_id ) WITH CHECK ( (select auth.uid()) = recipient_id );

DROP POLICY IF EXISTS "Communities are viewable by everyone" ON public.communities;
CREATE POLICY "Communities are viewable by everyone" ON public.communities FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Authenticated users can create communities" ON public.communities;
CREATE POLICY "Authenticated users can create communities" ON public.communities FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = creator_id );

DROP POLICY IF EXISTS "Creators can update their communities" ON public.communities;
CREATE POLICY "Creators can update their communities" ON public.communities FOR UPDATE TO authenticated USING ( (select auth.uid()) = creator_id ) WITH CHECK ( (select auth.uid()) = creator_id );

DROP POLICY IF EXISTS "Community memberships are viewable by everyone" ON public.community_members;
CREATE POLICY "Community memberships are viewable by everyone" ON public.community_members FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Users can join communities" ON public.community_members;
CREATE POLICY "Users can join communities" ON public.community_members FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Users can leave communities" ON public.community_members;
CREATE POLICY "Users can leave communities" ON public.community_members FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Stories are viewable by everyone" ON public.stories;
CREATE POLICY "Stories are viewable by everyone" ON public.stories FOR SELECT TO authenticated, anon USING ( expires_at > NOW() );

DROP POLICY IF EXISTS "Authenticated users can create stories" ON public.stories;
CREATE POLICY "Authenticated users can create stories" ON public.stories FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Users can delete their own stories" ON public.stories;
CREATE POLICY "Users can delete their own stories" ON public.stories FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

DROP POLICY IF EXISTS "Hashtags are viewable by everyone" ON public.hashtags;
CREATE POLICY "Hashtags are viewable by everyone" ON public.hashtags FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Post hashtags are viewable by everyone" ON public.post_hashtags;
CREATE POLICY "Post hashtags are viewable by everyone" ON public.post_hashtags FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Link previews are viewable by everyone" ON public.link_previews;
CREATE POLICY "Link previews are viewable by everyone" ON public.link_previews FOR SELECT TO authenticated, anon USING ( true );

DROP POLICY IF EXISTS "Users can create reports" ON public.reports;
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Conversations select policy" ON public.conversations;
CREATE POLICY "Conversations select policy" ON public.conversations FOR SELECT TO authenticated USING ( public.is_conversation_participant(id) OR creator_id = auth.uid() );

DROP POLICY IF EXISTS "Conversations insert policy" ON public.conversations;
CREATE POLICY "Conversations insert policy" ON public.conversations FOR INSERT TO authenticated WITH CHECK ( true );

DROP POLICY IF EXISTS "Conversations update policy" ON public.conversations;
CREATE POLICY "Conversations update policy" ON public.conversations FOR UPDATE TO authenticated USING ( public.is_conversation_participant(id) OR creator_id = auth.uid() ) WITH CHECK ( public.is_conversation_participant(id) OR creator_id = auth.uid() );

DROP POLICY IF EXISTS "Conversations delete policy" ON public.conversations;
CREATE POLICY "Conversations delete policy" ON public.conversations FOR DELETE TO authenticated USING ( public.is_conversation_participant(id) OR creator_id = auth.uid() );

DROP POLICY IF EXISTS "Participants select policy" ON public.conversation_participants;
CREATE POLICY "Participants select policy" ON public.conversation_participants FOR SELECT TO authenticated USING ( user_id = auth.uid() OR public.is_conversation_participant(conversation_id) );

DROP POLICY IF EXISTS "Participants insert policy" ON public.conversation_participants;
CREATE POLICY "Participants insert policy" ON public.conversation_participants FOR INSERT TO authenticated WITH CHECK ( user_id = auth.uid() OR public.is_conversation_participant(conversation_id) );

DROP POLICY IF EXISTS "Participants delete policy" ON public.conversation_participants;
CREATE POLICY "Participants delete policy" ON public.conversation_participants FOR DELETE TO authenticated USING ( user_id = auth.uid() OR public.is_conversation_participant(conversation_id) );

DROP POLICY IF EXISTS "Messages select policy" ON public.messages;
CREATE POLICY "Messages select policy" ON public.messages FOR SELECT TO authenticated USING ( public.is_conversation_participant(conversation_id) );

DROP POLICY IF EXISTS "Messages insert policy" ON public.messages;
CREATE POLICY "Messages insert policy" ON public.messages FOR INSERT TO authenticated WITH CHECK ( sender_id = auth.uid() AND public.is_conversation_participant(conversation_id) );

DROP POLICY IF EXISTS "Messages update policy" ON public.messages;
CREATE POLICY "Messages update policy" ON public.messages FOR UPDATE TO authenticated USING ( sender_id = auth.uid() AND public.is_conversation_participant(conversation_id) ) WITH CHECK ( sender_id = auth.uid() AND public.is_conversation_participant(conversation_id) );

DROP POLICY IF EXISTS "Reactions select policy" ON public.message_reactions;
CREATE POLICY "Reactions select policy" ON public.message_reactions FOR SELECT TO authenticated USING ( EXISTS ( SELECT 1 FROM public.messages m WHERE m.id = message_id AND public.is_conversation_participant(m.conversation_id) ) );

DROP POLICY IF EXISTS "Reactions insert policy" ON public.message_reactions;
CREATE POLICY "Reactions insert policy" ON public.message_reactions FOR INSERT TO authenticated WITH CHECK ( user_id = auth.uid() AND EXISTS ( SELECT 1 FROM public.messages m WHERE m.id = message_id AND public.is_conversation_participant(m.conversation_id) ) );

DROP POLICY IF EXISTS "Reactions update policy" ON public.message_reactions;
CREATE POLICY "Reactions update policy" ON public.message_reactions FOR UPDATE TO authenticated USING ( user_id = auth.uid() ) WITH CHECK ( user_id = auth.uid() );

DROP POLICY IF EXISTS "Reactions delete policy" ON public.message_reactions;
CREATE POLICY "Reactions delete policy" ON public.message_reactions FOR DELETE TO authenticated USING ( user_id = auth.uid() );

-- FIX F: Update Reports Policy to include Admins
DROP POLICY IF EXISTS "Elite/Admins can view and manage reports" ON public.reports;
CREATE POLICY "Elite/Admins can view and manage reports" ON public.reports FOR ALL TO authenticated USING ( 
  EXISTS ( 
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND (roles = 'Elite' OR role IN ('admin', 'moderator'))
  ) 
);
