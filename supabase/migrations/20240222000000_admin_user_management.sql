-- Functions for admin to manage user roles and pro status

-- 1. Function for an admin to update a user's role and pro status with validity.
CREATE OR REPLACE FUNCTION public.admin_update_user(
  p_user_id UUID,
  p_new_role TEXT DEFAULT NULL,
  p_pro_validity_days INTEGER DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_is_pro BOOLEAN;
  v_pro_expiry_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Authorization: Only admins can run this.
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Insufficient permissions: This action is restricted to administrators.';
  END IF;

  -- Validate role
  IF p_new_role IS NOT NULL AND p_new_role NOT IN ('Elite', 'Hunter', 'Newbie') THEN
    RAISE EXCEPTION 'Invalid role provided. Must be one of: Elite, Hunter, Newbie.';
  END IF;

  -- Determine pro status and expiry date
  IF p_pro_validity_days IS NOT NULL THEN
    IF p_pro_validity_days > 0 THEN
      v_is_pro := TRUE;
      v_pro_expiry_date := NOW() + (p_pro_validity_days || ' days')::interval;
    ELSE -- handles 0 or negative to turn off pro
      v_is_pro := FALSE;
      v_pro_expiry_date := NULL;
    END IF;
  ELSE -- p_pro_validity_days is NULL, so don't change pro status
      SELECT is_pro, pro_valid_till INTO v_is_pro, v_pro_expiry_date FROM public.users WHERE id = p_user_id;
  END IF;

  -- Update user record
  UPDATE public.users
  SET
    roles = COALESCE(p_new_role, roles),
    is_pro = v_is_pro,
    pro_valid_till = v_pro_expiry_date,
    updated_at = NOW()
  WHERE id = p_user_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Function to deactivate expired pro memberships. To be run by a cron job.
CREATE OR REPLACE FUNCTION public.deactivate_expired_pro_users()
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET
    is_pro = FALSE,
    pro_valid_till = NULL,
    updated_at = NOW()
  WHERE
    is_pro = TRUE AND
    pro_valid_till IS NOT NULL AND
    pro_valid_till < NOW();
END;
$$ LANGUAGE plpgsql;

-- 3. Grant permissions
GRANT EXECUTE ON FUNCTION public.admin_update_user(UUID, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.deactivate_expired_pro_users() TO authenticated; -- Or service_role if preferred for cron
