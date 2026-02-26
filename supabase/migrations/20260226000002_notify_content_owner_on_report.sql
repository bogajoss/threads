-- Add content_removed notification type
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'content_removed';

-- Update the notification function to also notify the content owner
CREATE OR REPLACE FUNCTION public.notify_report_status_change()
RETURNS trigger AS $$
DECLARE
    content_owner_id UUID;
BEGIN
    -- 1. Notify the REPORTER (Original logic)
    IF OLD.status = 'pending' AND NEW.status IN ('resolved', 'dismissed') THEN
        INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
        VALUES (
            NEW.reporter_id,
            COALESCE((SELECT auth.uid()), NEW.reporter_id),
            CASE
                WHEN NEW.status = 'resolved' THEN 'report_resolved'::public.notification_type
                ELSE 'report_declined'::public.notification_type
            END,
            NULL
        );
    END IF;

    -- 2. Notify the CONTENT OWNER if the report was resolved (content removed)
    IF OLD.status = 'pending' AND NEW.status = 'resolved' THEN
        -- Determine who owned the content based on type
        IF NEW.target_type = 'post' THEN
            SELECT user_id INTO content_owner_id FROM public.posts WHERE id = NEW.target_id;
        ELSIF NEW.target_type = 'comment' THEN
            SELECT user_id INTO content_owner_id FROM public.comments WHERE id = NEW.target_id;
        END IF;

        -- If owner found, notify them
        IF content_owner_id IS NOT NULL AND content_owner_id != NEW.reporter_id THEN
            INSERT INTO public.notifications (recipient_id, actor_id, type, post_id)
            VALUES (
                content_owner_id,
                COALESCE((SELECT auth.uid()), content_owner_id), -- Admin/System is the actor
                'content_removed'::public.notification_type,
                NULL -- Post is likely already gone or being removed
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
