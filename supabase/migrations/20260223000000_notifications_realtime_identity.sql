-- Ensure notifications realtime works reliably for INSERT/UPDATE/DELETE
-- so recipient_id-based filters match on UPDATE/DELETE payloads.

ALTER TABLE public.notifications REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN OTHERS THEN NULL;
END $$;
