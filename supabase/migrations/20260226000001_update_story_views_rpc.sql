-- Update increment_story_views to return the new count
CREATE OR REPLACE FUNCTION public.increment_story_views(s_id UUID)
RETURNS integer AS $$
DECLARE
    new_count integer;
BEGIN
    -- Only increment if it's a new view for this user
    INSERT INTO public.story_views (story_id, user_id)
    VALUES (s_id, auth.uid())
    ON CONFLICT (story_id, user_id) DO NOTHING;
    
    -- Update the count and return the latest value
    UPDATE public.stories
    SET views_count = (
        SELECT count(*)
        FROM public.story_views
        WHERE story_id = s_id
    )
    WHERE id = s_id
    RETURNING views_count INTO new_count;
    
    RETURN COALESCE(new_count, (SELECT views_count FROM public.stories WHERE id = s_id));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
