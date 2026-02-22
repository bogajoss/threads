-- ============================================================
-- Complete fix for admin role management
-- Run BOTH parts together
-- ============================================================

-- PART 1: Update protect_role_column to allow admin changes via session flag
CREATE OR REPLACE FUNCTION public.protect_role_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
  -- Check for secure context set by admin functions
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

-- PART 2: Admin role setter function with proper session config
DROP FUNCTION IF EXISTS public.admin_set_user_role(UUID, TEXT);

CREATE FUNCTION public.admin_set_user_role(
  p_user_id UUID,
  p_new_role TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO public
AS $func$
DECLARE
  v_caller_is_admin BOOLEAN;
BEGIN
  -- Enable secure bypass for this transaction
  PERFORM set_config('app.settings.is_secure', 'true', false);

  -- Verify caller is admin
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
  INTO v_caller_is_admin;

  IF NOT v_caller_is_admin THEN
    RAISE EXCEPTION 'Insufficient permissions: Only administrators can change user roles.';
  END IF;

  -- Validate role
  IF p_new_role NOT IN ('user','moderator','admin') THEN
    RAISE EXCEPTION 'Invalid role. Must be: user, moderator, or admin.';
  END IF;

  -- Apply role change
  IF p_new_role = 'user' THEN
    DELETE FROM public.admins
    WHERE user_id = p_user_id;
  ELSE
    IF EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = p_user_id
    ) THEN
      UPDATE public.admins
      SET role = p_new_role
      WHERE user_id = p_user_id;
    ELSE
      INSERT INTO public.admins (user_id, role)
      VALUES (p_user_id, p_new_role);
    END IF;
  END IF;
END;
$func$;

GRANT EXECUTE ON FUNCTION public.admin_set_user_role(UUID, TEXT)
TO authenticated;
