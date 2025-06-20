-- Migration: 20250406000002_create_get_user_email_function.sql
-- Description: Creates a function to get a user's email from auth.users

-- Create a function to get a user's email from auth.users
CREATE OR REPLACE FUNCTION public.get_user_email(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER -- This is important to allow the function to access auth schema
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get the email from auth.users
  SELECT email INTO user_email
  FROM auth.users
  WHERE id = user_id;
  
  RETURN user_email;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_email(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_email(UUID) TO service_role;