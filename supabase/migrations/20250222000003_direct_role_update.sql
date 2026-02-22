-- ============================================================
-- Working admin role setter - uses direct users.role update
-- ============================================================

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

  -- Apply role change - update admins table AND users.role directly
  IF p_new_role = 'user' THEN
    DELETE FROM public.admins
    WHERE user_id = p_user_id;
    
    -- Also update users.role directly
    UPDATE public.users SET role = 'user' WHERE id = p_user_id;
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
    
    -- Also update users.role directly
    UPDATE public.users SET role = p_new_role WHERE id = p_user_id;
  END IF;
END;
$func$;

GRANT EXECUTE ON FUNCTION public.admin_set_user_role(UUID, TEXT)
TO authenticated;
