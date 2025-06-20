
-- Create admin check function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT raw_user_meta_data->>'isAdmin' = 'true' 
    FROM auth.users 
    WHERE id = auth.uid()
  );
END;
$$;

-- Additional RPC function to get admin statistics
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'isAdmin' = 'true'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'total_pets', (SELECT COUNT(*) FROM pets),
    'recent_signups', (
      SELECT COUNT(*) FROM auth.users 
      WHERE created_at >= NOW() - INTERVAL '7 days'
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;

