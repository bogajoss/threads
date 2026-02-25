-- Add type and duration to comments
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'text';
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS duration INTEGER;

-- Update notification logic to handle voice comments if needed (usually handled by type 'comment' already)
