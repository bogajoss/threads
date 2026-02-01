-- Migration to support nested comment replies

-- 1. Add parent_id and replies_count to comments table
ALTER TABLE public.comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS replies_count INTEGER DEFAULT 0;

-- 2. Update handle_comment_count function to handle nested replies
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

-- 3. Update create_notification function to handle replies
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
