-- Fix: Allow admins to update user system role (admin/moderator/user)
-- This bypasses the protect_role_column trigger issue

CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  p_user_id UUID,
  p_new_role TEXT
)
RETURNS void AS $$
DECLARE
  v_caller_is_admin BOOLEAN;
BEGIN
  -- Check if caller is admin
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE user_id = auth.uid() AND role = 'admin'
  ) INTO v_caller_is_admin;

  IF NOT v_caller_is_admin THEN
    RAISE EXCEPTION 'Insufficient permissions: Only administrators can change user roles.';
  END IF;

  -- Validate role
  IF p_new_role NOT IN ('user', 'moderator', 'admin') THEN
    RAISE EXCEPTION 'Invalid role. Must be: user, moderator, or admin.';
  END IF;

  -- Update admins table (triggers will sync to users.role)
  IF p_new_role = 'user' THEN
    -- Remove from admins table
    DELETE FROM public.admins WHERE user_id = p_user_id;
  ELSE
    -- Upsert into admins table
    INSERT INTO public.admins (user_id, role)
    VALUES (p_user_id, p_new_role)
    ON CONFLICT (user_id) DO UPDATE SET role = p_new_role;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.admin_set_user_role(UUID, TEXT) TO authenticated;

-- Also fix protect_role_column to allow SECURITY DEFINER functions
CREATE OR REPLACE FUNCTION public.protect_role_column()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow updates from SECURITY DEFINER functions (like sync_admin_role)
  -- Check if this is a secure context by checking pg_settings
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
