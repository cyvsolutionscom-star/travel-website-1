-- List admins (email + id) for signed-in admins only
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE (user_id UUID, email TEXT, created_at TIMESTAMPTZ)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.user_id, u.email::TEXT, ur.created_at
  FROM public.user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  WHERE ur.role = 'admin'
    AND public.has_role(auth.uid(), 'admin')
  ORDER BY ur.created_at ASC;
$$;

-- Grant admin role to an existing auth user by email
CREATE OR REPLACE FUNCTION public.grant_admin_by_email(target_email TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_id UUID;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden: admin role required';
  END IF;

  SELECT id INTO target_id
  FROM auth.users
  WHERE lower(email) = lower(trim(target_email))
  LIMIT 1;

  IF target_id IS NULL THEN
    RAISE EXCEPTION 'No user found with that email. They must sign up first, or use Create Admin Account.';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN target_id;
END;
$$;

-- Revoke admin role (cannot remove your own admin role)
CREATE OR REPLACE FUNCTION public.revoke_admin(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden: admin role required';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot remove your own admin access';
  END IF;

  DELETE FROM public.user_roles
  WHERE user_id = target_user_id AND role = 'admin';
END;
$$;

GRANT EXECUTE ON FUNCTION public.list_admins() TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_admin_by_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_admin(UUID) TO authenticated;
