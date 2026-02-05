-- Sysm Master Database Schema (Merged)
-- Merged from: full_schema.sql, migration_v2-v9, triggers.sql

-- ==========================================
-- skeletor.sql
-- (Extensions, Tables, Views, Storage)
-- ==========================================

-- 1. EXTENSIONS & TYPES
CREATE TYPE post_type AS ENUM ('text', 'image', 'video', 'poll', 'repost', 'file', 'reel');
CREATE TYPE notification_type AS ENUM ('like', 'mention', 'follow', 'repost', 'comment');

-- 2. IDENTITY & PROFILES
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
  is_verified BOOLEAN DEFAULT FALSE,
  following_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Self-referencing join table for follows
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

-- 3. COMMUNITIES
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

-- 4. CONTENT (POSTS, COMMENTS, HASHTAGS)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.posts(id) ON DELETE CASCADE, -- For Reposts/Threads
  content TEXT,
  type post_type DEFAULT 'text',
  media JSONB DEFAULT '[]'::jsonb,
  poll JSONB,
  quoted_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  mirrors_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
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

-- Join Tables for Interactions
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

-- 5. CHAT & MESSAGING
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

-- 6. EPHEMERAL & ACTIVITY
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

-- 7. VIEWS (UNIFIED FEED)
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

-- Relationship hints for API
COMMENT ON COLUMN public.unified_posts.user_id IS 'FK users(id)';
COMMENT ON COLUMN public.unified_posts.community_id IS 'FK communities(id)';
COMMENT ON COLUMN public.unified_posts.reposter_id IS 'FK users(id)';

-- 8. STORAGE & REALTIME
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.message_reactions;


-- ==========================================
-- triggers.sql
-- (Functions, RPCs, Triggers)
-- ==========================================

-- 1. Helpers & RPCs
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conv_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.conversation_participants 
    WHERE conversation_id = conv_id 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET views_count = views_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION mark_messages_read(p_conversation_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Check if the current user is a participant
  IF EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = p_conversation_id
    AND user_id = auth.uid()
  ) THEN
    -- Update unread messages sent by others
    UPDATE public.messages
    SET is_read = true
    WHERE conversation_id = p_conversation_id
    AND sender_id != auth.uid()
    AND is_read = false;
  ELSE
    RAISE EXCEPTION 'Not a participant of this conversation';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger Functions
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

CREATE OR REPLACE FUNCTION public.handle_comment_count()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    -- Increment post's total comment count
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    
    -- If it's a reply, increment parent comment's replies_count
    IF NEW.parent_id IS NOT NULL THEN
      UPDATE public.comments SET replies_count = replies_count + 1 WHERE id = NEW.parent_id;
    END IF;
    
  ELSIF (TG_OP = 'DELETE') THEN
    -- Decrement post's total comment count
    UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    
    -- If it was a reply, decrement parent comment's replies_count
    IF OLD.parent_id IS NOT NULL THEN
      UPDATE public.comments SET replies_count = replies_count - 1 WHERE id = OLD.parent_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

CREATE OR REPLACE FUNCTION public.handle_mentions()
RETURNS trigger AS $$
DECLARE
  mention_username TEXT;
  mentioned_user_id UUID;
BEGIN
  IF NEW.content IS NULL THEN
    RETURN NEW;
  END IF;

  FOR mention_username IN 
    SELECT unnest(regexp_matches(NEW.content, '@([[:alnum:]_]+)', 'g'))
  LOOP
    SELECT id INTO mentioned_user_id 
    FROM public.users 
    WHERE lower(username) = lower(mention_username);
    
    IF mentioned_user_id IS NOT NULL AND mentioned_user_id != NEW.user_id THEN
      INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
      VALUES (
        mentioned_user_id, 
        NEW.user_id, 
        'mention', 
        CASE WHEN TG_TABLE_NAME = 'comments' THEN NEW.post_id ELSE NEW.id END
      );
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
  -- Comments & Replies
  ELSIF (TG_TABLE_NAME = 'comments') THEN
    -- 1. Notify the Post Author
    INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
    SELECT user_id, NEW.user_id, 'comment', NEW.post_id
    FROM public.posts 
    WHERE id = NEW.post_id AND user_id != NEW.user_id;

    -- 2. If it's a reply, notify the Parent Comment Author (if different from post author and reply actor)
    IF NEW.parent_id IS NOT NULL THEN
      INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
      SELECT c.user_id, NEW.user_id, 'comment', NEW.post_id
      FROM public.comments c
      JOIN public.posts p ON c.post_id = p.id
      WHERE c.id = NEW.parent_id 
        AND c.user_id != NEW.user_id -- Don't notify yourself
        AND c.user_id != p.user_id; -- Avoid double notification if parent author is post author
    END IF;
  -- Reposts
  ELSIF (TG_TABLE_NAME = 'reposts') THEN
    INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
    SELECT user_id, NEW.user_id, 'repost', NEW.post_id
    FROM public.posts WHERE id = NEW.post_id AND user_id != NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger Bindings
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_follow_change ON public.follows;
CREATE TRIGGER on_follow_change AFTER INSERT OR DELETE ON public.follows FOR EACH ROW EXECUTE FUNCTION public.handle_follow_count();

DROP TRIGGER IF EXISTS on_like_change ON public.likes;
CREATE TRIGGER on_like_change AFTER INSERT OR DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION public.handle_post_stats();

DROP TRIGGER IF EXISTS on_repost_change ON public.reposts;
CREATE TRIGGER on_repost_change AFTER INSERT OR DELETE ON public.reposts FOR EACH ROW EXECUTE FUNCTION public.handle_post_stats();

DROP TRIGGER IF EXISTS on_comment_change ON public.comments;
CREATE TRIGGER on_comment_change AFTER INSERT OR DELETE ON public.comments FOR EACH ROW EXECUTE FUNCTION public.handle_comment_count();

DROP TRIGGER IF EXISTS on_community_member_change ON public.community_members;
CREATE TRIGGER on_community_member_change AFTER INSERT OR DELETE ON public.community_members FOR EACH ROW EXECUTE FUNCTION public.handle_community_stats();

DROP TRIGGER IF EXISTS on_community_post_change ON public.posts;
CREATE TRIGGER on_community_post_change AFTER INSERT OR DELETE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.handle_community_stats();

DROP TRIGGER IF EXISTS on_post_hashtags ON public.posts;
CREATE TRIGGER on_post_hashtags AFTER INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION public.extract_hashtags();

DROP TRIGGER IF EXISTS on_like_notification ON public.likes;
CREATE TRIGGER on_like_notification AFTER INSERT ON public.likes FOR EACH ROW EXECUTE FUNCTION public.create_notification();

DROP TRIGGER IF EXISTS on_follow_notification ON public.follows;
CREATE TRIGGER on_follow_notification AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION public.create_notification();

DROP TRIGGER IF EXISTS on_comment_notification ON public.comments;
CREATE TRIGGER on_comment_notification AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.create_notification();

DROP TRIGGER IF EXISTS on_repost_notification ON public.reposts;
CREATE TRIGGER on_repost_notification AFTER INSERT ON public.reposts FOR EACH ROW EXECUTE FUNCTION public.create_notification();

DROP TRIGGER IF EXISTS on_post_mentions ON public.posts;
CREATE TRIGGER on_post_mentions AFTER INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION public.handle_mentions();

DROP TRIGGER IF EXISTS on_comment_mentions ON public.comments;
CREATE TRIGGER on_comment_mentions AFTER INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.handle_mentions();


-- ==========================================
-- rls.sql
-- (Row Level Security Policies)
-- ==========================================

-- 1. Enable RLS
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

-- 2. General Policies

-- Users
CREATE POLICY "Profiles are viewable by everyone" ON public.users FOR SELECT TO authenticated, anon USING ( true );
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE TO authenticated USING ( (select auth.uid()) = id ) WITH CHECK ( (select auth.uid()) = id );

-- Posts
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT TO authenticated, anon USING ( true );
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE TO authenticated USING ( (select auth.uid()) = user_id ) WITH CHECK ( (select auth.uid()) = user_id );
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

-- Comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT TO authenticated, anon USING ( true );
CREATE POLICY "Authenticated users can create comments" ON public.comments FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE TO authenticated USING ( (select auth.uid()) = user_id ) WITH CHECK ( (select auth.uid()) = user_id );
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

-- Likes/Reposts
CREATE POLICY "Likes are viewable by everyone" ON public.likes FOR SELECT TO authenticated, anon USING ( true );
CREATE POLICY "Authenticated users can like posts" ON public.likes FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );
CREATE POLICY "Users can unlike posts" ON public.likes FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

CREATE POLICY "Comment likes are viewable by everyone" ON public.comment_likes FOR SELECT TO authenticated, anon USING ( true );
CREATE POLICY "Authenticated users can like comments" ON public.comment_likes FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );
CREATE POLICY "Users can unlike comments" ON public.comment_likes FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

CREATE POLICY "Reposts are viewable by everyone" ON public.reposts FOR SELECT TO authenticated, anon USING ( true );
CREATE POLICY "Authenticated users can repost" ON public.reposts FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );
CREATE POLICY "Users can remove their reposts" ON public.reposts FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

-- Follows
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT TO authenticated, anon USING ( true );
CREATE POLICY "Authenticated users can follow others" ON public.follows FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = follower_id );
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE TO authenticated USING ( (select auth.uid()) = follower_id );

-- Notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT TO authenticated USING ( (select auth.uid()) = recipient_id );
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE TO authenticated USING ( (select auth.uid()) = recipient_id ) WITH CHECK ( (select auth.uid()) = recipient_id );

-- Communities
CREATE POLICY "Communities are viewable by everyone" ON public.communities FOR SELECT TO authenticated, anon USING ( true );
CREATE POLICY "Authenticated users can create communities" ON public.communities FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = creator_id );
CREATE POLICY "Creators can update their communities" ON public.communities FOR UPDATE TO authenticated USING ( (select auth.uid()) = creator_id ) WITH CHECK ( (select auth.uid()) = creator_id );
CREATE POLICY "Community memberships are viewable by everyone" ON public.community_members FOR SELECT TO authenticated, anon USING ( true );
CREATE POLICY "Users can join communities" ON public.community_members FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );
CREATE POLICY "Users can leave communities" ON public.community_members FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

-- Stories
CREATE POLICY "Stories are viewable by everyone" ON public.stories FOR SELECT TO authenticated, anon USING ( expires_at > NOW() );
CREATE POLICY "Authenticated users can create stories" ON public.stories FOR INSERT TO authenticated WITH CHECK ( (select auth.uid()) = user_id );
CREATE POLICY "Users can delete their own stories" ON public.stories FOR DELETE TO authenticated USING ( (select auth.uid()) = user_id );

-- Hashtags & Misc
CREATE POLICY "Hashtags are viewable by everyone" ON public.hashtags FOR SELECT TO authenticated, anon USING ( true );
CREATE POLICY "Post hashtags are viewable by everyone" ON public.post_hashtags FOR SELECT TO authenticated, anon USING ( true );
CREATE POLICY "Link previews are viewable by everyone" ON public.link_previews FOR SELECT TO authenticated, anon USING ( true );

-- 3. Messaging Policies (Consolidated)

-- Conversations
CREATE POLICY "Conversations select policy" ON public.conversations FOR SELECT TO authenticated USING ( public.is_conversation_participant(id) );
CREATE POLICY "Conversations insert policy" ON public.conversations FOR INSERT TO authenticated WITH CHECK ( true );
CREATE POLICY "Conversations update policy" ON public.conversations FOR UPDATE TO authenticated USING ( public.is_conversation_participant(id) ) WITH CHECK ( public.is_conversation_participant(id) );
CREATE POLICY "Conversations delete policy" ON public.conversations FOR DELETE TO authenticated USING ( public.is_conversation_participant(id) );

-- Participants
CREATE POLICY "Participants select policy" ON public.conversation_participants FOR SELECT TO authenticated USING ( user_id = auth.uid() OR public.is_conversation_participant(conversation_id) );
CREATE POLICY "Participants insert policy" ON public.conversation_participants FOR INSERT TO authenticated WITH CHECK ( user_id = auth.uid() OR public.is_conversation_participant(conversation_id) );
CREATE POLICY "Participants delete policy" ON public.conversation_participants FOR DELETE TO authenticated USING ( user_id = auth.uid() OR public.is_conversation_participant(conversation_id) );

-- Messages
CREATE POLICY "Messages select policy" ON public.messages FOR SELECT TO authenticated USING ( public.is_conversation_participant(conversation_id) );
CREATE POLICY "Messages insert policy" ON public.messages FOR INSERT TO authenticated WITH CHECK ( sender_id = auth.uid() AND public.is_conversation_participant(conversation_id) );
CREATE POLICY "Messages update policy" ON public.messages FOR UPDATE TO authenticated USING ( sender_id = auth.uid() AND public.is_conversation_participant(conversation_id) ) WITH CHECK ( sender_id = auth.uid() AND public.is_conversation_participant(conversation_id) );

-- Reactions
CREATE POLICY "Reactions select policy" ON public.message_reactions FOR SELECT TO authenticated USING ( EXISTS ( SELECT 1 FROM public.messages m WHERE m.id = message_id AND public.is_conversation_participant(m.conversation_id) ) );
CREATE POLICY "Reactions insert policy" ON public.message_reactions FOR INSERT TO authenticated WITH CHECK ( user_id = auth.uid() AND EXISTS ( SELECT 1 FROM public.messages m WHERE m.id = message_id AND public.is_conversation_participant(m.conversation_id) ) );
CREATE POLICY "Reactions update policy" ON public.message_reactions FOR UPDATE TO authenticated USING ( user_id = auth.uid() ) WITH CHECK ( user_id = auth.uid() );
CREATE POLICY "Reactions delete policy" ON public.message_reactions FOR DELETE TO authenticated USING ( user_id = auth.uid() );