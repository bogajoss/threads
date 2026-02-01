-- Migration to support Group Chats

-- 1. Add group-related columns to conversations table
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS is_group BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- 2. Update existing conversations to be is_group = false
UPDATE public.conversations SET is_group = FALSE WHERE is_group IS NULL;
