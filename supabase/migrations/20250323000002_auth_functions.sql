-- Migration: 20250323000002_auth_functions.sql
-- Description: Creates functions to access auth schema tables

-- Function to get a user by email from auth.users
CREATE OR REPLACE FUNCTION public.get_user_by_email(p_email TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT
) 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.email::TEXT
  FROM auth.users u
  WHERE u.email = p_email;
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.get_user_by_email(TEXT) TO authenticated, anon, service_role;