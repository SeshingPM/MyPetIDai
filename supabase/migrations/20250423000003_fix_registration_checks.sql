
-- Update the has_valid_access function to be more lenient
CREATE OR REPLACE FUNCTION public.has_valid_access(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  has_registration BOOLEAN;
  is_admin BOOLEAN;
BEGIN
  -- Check if user is admin
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = p_user_id 
    AND raw_user_meta_data->>'isAdmin' = 'true'
  ) INTO is_admin;
  
  -- Admins always have access
  IF is_admin THEN
    RETURN TRUE;
  END IF;

  -- Check if the user has completed registration status
  SELECT EXISTS (
    SELECT 1 FROM public.user_registration_status
    WHERE user_id = p_user_id AND registration_status = 'completed'
  ) INTO has_registration;
  
  -- If they have completed registration, return true
  IF has_registration THEN
    RETURN TRUE;
  END IF;
  
  -- All features are free now - auto-create a completed registration status for all users
  INSERT INTO public.user_registration_status (
    user_id, 
    registration_status, 
    created_at, 
    updated_at,
    registration_completed_at
  ) VALUES (
    p_user_id,
    'completed',
    NOW(),
    NOW(),
    NOW()
  ) ON CONFLICT (user_id) DO UPDATE 
  SET registration_status = 'completed',
      updated_at = NOW(),
      registration_completed_at = NOW()
  WHERE user_registration_status.user_id = p_user_id;
  
  -- All users have access since all features are free
  RETURN TRUE;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.has_valid_access(UUID) TO authenticated;
