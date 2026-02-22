-- ============================================================
-- Fix protect_role_column function
-- This allows SECURITY DEFINER functions to bypass the role protection
-- ============================================================

CREATE OR REPLACE FUNCTION public.protect_role_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
  -- Check for secure context set by admin_set_user_role
  IF current_setting('app.settings.is_secure', TRUE) = 'true' THEN
    RETURN NEW;
  END IF;

  IF NEW.role IS DISTINCT FROM OLD.role THEN
    IF NOT EXISTS (
      SELECT 1
      FROM public.admins
      WHERE user_id = auth.uid()
        AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'You are not authorized to change role.';
    END IF;
  END IF;

  RETURN NEW;
END;
$func$;
