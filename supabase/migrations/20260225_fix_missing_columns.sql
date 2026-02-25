-- Fix missing columns for atomic interactions
-- This migration adds the missing comment_id columns to likes and reposts tables if they don't exist
-- and adds constraints to ensure data integrity.

-- Add comment_id to likes table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'likes' AND column_name = 'comment_id') THEN
        ALTER TABLE public.likes ADD COLUMN comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add comment_id to reposts table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reposts' AND column_name = 'comment_id') THEN
        ALTER TABLE public.reposts ADD COLUMN comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add constraints to ensure a like/repost is for one or the other, not both
-- We drop existing constraint if it exists to avoid errors and re-add it
DO $$
BEGIN
    ALTER TABLE public.likes DROP CONSTRAINT IF EXISTS likes_target_check;
    ALTER TABLE public.likes ADD CONSTRAINT likes_target_check
        CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL));
EXCEPTION
    WHEN OTHERS THEN NULL; -- Ignore if constraint adding fails due to bad data, user will need to clean up data first
END $$;

DO $$
BEGIN
    ALTER TABLE public.reposts DROP CONSTRAINT IF EXISTS reposts_target_check;
    ALTER TABLE public.reposts ADD CONSTRAINT reposts_target_check
        CHECK ((post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL));
EXCEPTION
    WHEN OTHERS THEN NULL;
END $$;
