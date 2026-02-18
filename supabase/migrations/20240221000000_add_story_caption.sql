-- Add content column to stories table to support captions
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS content TEXT;
