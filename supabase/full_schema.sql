-- Sysm Full Database Schema
-- Last Updated: 2026-01-22

-- ==========================================
-- 1. IDENTITY & PROFILES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sysm',
  cover_url TEXT DEFAULT 'https://systemadminbd.com/uploads/675346dd55e0c7.43939630.png',
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

-- ==========================================
-- 2. CONTENT (POSTS, COMMENTS, REELS)
-- ==========================================

CREATE TYPE post_type AS ENUM ('text', 'image', 'video', 'poll', 'repost', 'file');

CREATE TABLE IF NOT EXISTS public.communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  handle TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/identicon/svg?seed=community',
  cover_url TEXT,
  creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  members_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE, -- Link to community
  parent_id UUID REFERENCES public.posts(id) ON DELETE CASCADE, -- For Reposts/Threads
  content TEXT,
  type post_type DEFAULT 'text',
  media JSONB DEFAULT '[]'::jsonb, -- Store objects like {type: 'image', src: '...''}
  poll JSONB, -- Store {options: [...], totalVotes: 0}
  quoted_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  mirrors_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  media JSONB DEFAULT '[]'::jsonb,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Interaction Tables
CREATE TABLE IF NOT EXISTS public.likes (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- ==========================================
-- 2.5. VIEWS (UNIFIED FEED)
-- ==========================================

CREATE OR REPLACE VIEW public.unified_posts AS
SELECT 
    (p.id::text || '-orig') as feed_id, -- Unique identifier
    p.id, p.user_id, p.community_id, p.content, p.type, p.media, p.poll, p.quoted_post_id,
    p.likes_count, p.comments_count, p.mirrors_count, p.created_at, p.parent_id,
    p.created_at as sort_timestamp,
    NULL::uuid as reposter_id,
    jsonb_build_object(
        'id', u.id,
        'username', u.username,
        'display_name', u.display_name,
        'avatar_url', u.avatar_url,
        'is_verified', u.is_verified
    ) as author_data,
    CASE 
        WHEN p.community_id IS NOT NULL THEN jsonb_build_object(
            'id', c.id,
            'handle', c.handle,
            'name', c.name
        )
        ELSE NULL
    END as community_data,
    NULL::jsonb as reposter_data
FROM public.posts p
JOIN public.users u ON p.user_id = u.id
LEFT JOIN public.communities c ON p.community_id = c.id
UNION ALL
SELECT 
    (p.id::text || '-' || r.user_id::text) as feed_id, -- Unique identifier
    p.id, p.user_id, p.community_id, p.content, p.type, p.media, p.poll, p.quoted_post_id,
    p.likes_count, p.comments_count, p.mirrors_count, p.created_at, p.parent_id,
    r.created_at as sort_timestamp,
    r.user_id as reposter_id,
    jsonb_build_object(
        'id', u.id,
        'username', u.username,
        'display_name', u.display_name,
        'avatar_url', u.avatar_url,
        'is_verified', u.is_verified
    ) as author_data,
    CASE 
        WHEN p.community_id IS NOT NULL THEN jsonb_build_object(
            'id', c.id,
            'handle', c.handle,
            'name', c.name
        )
        ELSE NULL
    END as community_data,
    jsonb_build_object(
        'id', ru.id,
        'username', ru.username,
        'display_name', ru.display_name,
        'avatar_url', ru.avatar_url
    ) as reposter_data
FROM public.reposts r
JOIN public.posts p ON r.post_id = p.id
JOIN public.users u ON p.user_id = u.id
JOIN public.users ru ON r.user_id = ru.id
LEFT JOIN public.communities c ON p.community_id = c.id;

-- Relationship hints for PostgREST
COMMENT ON COLUMN public.unified_posts.user_id IS 'FK users(id)';
COMMENT ON COLUMN public.unified_posts.community_id IS 'FK communities(id)';
COMMENT ON COLUMN public.unified_posts.reposter_id IS 'FK users(id)';
COMMENT ON COLUMN public.unified_posts.quoted_post_id IS 'FK posts(id)';
COMMENT ON COLUMN public.unified_posts.parent_id IS 'FK posts(id)';

-- ==========================================
-- 3. COMMUNICATION (CHAT)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_content TEXT
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

-- ==========================================
-- 4. EPHEMERAL & ACTIVITY
-- ==========================================

CREATE TABLE IF NOT EXISTS public.stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  media_url TEXT NOT NULL,
  type TEXT DEFAULT 'image',
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TYPE notification_type AS ENUM ('like', 'mention', 'follow', 'repost', 'comment');

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  actor_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. AUTOMATION (TRIGGERS & FUNCTIONS)
-- ==========================================

-- Trigger to create profile on signup
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

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- 6. SECURITY (RLS - DISABLED PER USER REQUEST)
-- ==========================================

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reposts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions DISABLE ROW LEVEL SECURITY;

-- ==========================================
-- 7. STORAGE (MEDIA BUCKET)
-- ==========================================

-- Enable storage if not already enabled (this is usually enabled by default)
-- CREATE EXTENSION IF NOT EXISTS "storage";

-- Create the 'media' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- 1. Allow public access to read files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- 2. Allow authenticated users to upload files
CREATE POLICY "Authenticated Users Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

-- 3. Allow owners to delete their files
CREATE POLICY "Owners Delete" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.uid() = owner);

-- ==========================================
-- 8. REALTIME SUBSCRIPTIONS
-- ==========================================

-- Enable Realtime for the messages table
-- Note: You must run this in your Supabase SQL Editor to enable realtime.
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table message_reactions;