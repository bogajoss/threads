-- ============================================================================
-- PART 2: Fix protect_role_column function (run this AFTER Part 1)
-- This allows SECURITY DEFINER functions to bypass the role protection
-- ============================================================================

CREATE OR REPLACE FUNCTION public.protect_role_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow updates from SECURITY DEFINER functions (like sync_admin_role)
  IF current_setting('app.settings.is_secure', TRUE) = 'true' THEN
    RETURN NEW;
  END IF;

  -- If role is being changed
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Check if the current user is an admin
    IF NOT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND role = 'admin') THEN
       RAISE EXCEPTION 'You are not authorized to change role.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
