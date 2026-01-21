-- 1. Create Users Table for Metadata
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT DEFAULT 'https://static.hey.xyz/images/brands/lens.svg',
  cover_url TEXT DEFAULT 'https://static.hey.xyz/images/hero.webp',
  is_verified BOOLEAN DEFAULT FALSE,
  following_count INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure RLS is disabled as per user request (or enable with public access)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Create Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  media JSONB DEFAULT '[]'::jsonb,
  stats JSONB DEFAULT '{"likes": 0, "comments": 0, "mirrors": 0, "collects": 0}'::jsonb,
  category TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

-- 3. Create Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- 4. Create Followers Table
CREATE TABLE IF NOT EXISTS followers (
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id)
);

ALTER TABLE followers DISABLE ROW LEVEL SECURITY;
