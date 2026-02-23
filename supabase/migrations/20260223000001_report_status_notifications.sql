-- Add report outcome notification types and notify reporters when status is reviewed.

ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'report_resolved';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'report_declined';

CREATE OR REPLACE FUNCTION public.notify_report_status_change()
RETURNS trigger AS $$
BEGIN
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

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_report_status_change_notify ON public.reports;

CREATE TRIGGER on_report_status_change_notify
AFTER UPDATE OF status ON public.reports
FOR EACH ROW
EXECUTE FUNCTION public.notify_report_status_change();
