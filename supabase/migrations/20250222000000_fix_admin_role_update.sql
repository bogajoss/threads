-- ============================================================
-- Admin role setter function (SAFE VERSION)
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_set_user_role(
  p_user_id UUID,
  p_new_role TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_is_admin BOOLEAN;
BEGIN
  -- Check if caller is admin
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
  INTO v_caller_is_admin;

  IF NOT v_caller_is_admin THEN
    RAISE EXCEPTION
      'Insufficient permissions: Only administrators can change user roles.';
  END IF;

  -- Validate role
  IF p_new_role NOT IN ('user', 'moderator', 'admin') THEN
    RAISE EXCEPTION
      'Invalid role. Must be: user, moderator, or admin.';
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
$$;

GRANT EXECUTE ON FUNCTION public.admin_set_user_role(UUID, TEXT)
TO authenticated;
