-- Migration script to move comments from 'posts' table to dedicated 'comments' table

-- 1. Create the comment_likes table
CREATE TABLE IF NOT EXISTS public.comment_likes (
  comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);

-- 2. Migrate existing comments
INSERT INTO public.comments (id, post_id, user_id, content, media, likes_count, created_at)
SELECT id, parent_id, user_id, content, media, likes_count, created_at
FROM public.posts
WHERE parent_id IS NOT NULL;

-- 3. Migrate likes for those comments
INSERT INTO public.comment_likes (comment_id, user_id, created_at)
SELECT l.post_id, l.user_id, l.created_at
FROM public.likes l
JOIN public.comments c ON l.post_id = c.id;

-- 4. Delete old comment rows from posts table
DELETE FROM public.posts WHERE parent_id IS NOT NULL;

-- 5. Sync comment counts
UPDATE public.posts p
SET comments_count = (
  SELECT count(*) 
  FROM public.comments c 
  WHERE c.post_id = p.id
);

-- 6. Disable RLS
ALTER TABLE public.comment_likes DISABLE ROW LEVEL SECURITY;
