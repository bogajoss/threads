-- Add views_count to stories
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0;

-- Create story_views table for unique tracking
CREATE TABLE IF NOT EXISTS public.storay_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(story_id, user_id)
);

-- Enable RLS
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view story views" ON public.story_views
    FOR SELECT USING (true);

CREATE POLICY "Users can insert story views" ON public.story_views
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RPC to increment views
CREATE OR REPLACE FUNCTION public.increment_story_views(s_id UUID)
RETURNS void AS $$
BEGIN
    -- Only increment if it's a new view for this user
    INSERT INTO public.story_views (story_id, user_id)
    VALUES (s_id, auth.uid())
    ON CONFLICT (story_id, user_id) DO NOTHING;
    
    -- Update the count
    UPDATE public.stories
    SET views_count = (
        SELECT count(*)
        FROM public.story_views
        WHERE story_id = s_id
    )
    WHERE id = s_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
