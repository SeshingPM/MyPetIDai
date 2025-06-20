-- Add registration_completed_at timestamp column to profiles table
-- This replaces the checkout_completed_at field which was used in the subscription model
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS registration_completed_at timestamptz DEFAULT NULL;

-- Create an index on the registration_completed_at column for efficient querying 
-- (used by welcome email functions)
CREATE INDEX IF NOT EXISTS idx_profiles_registration_completed_at 
ON public.profiles (registration_completed_at);

-- Comment on the column to document its purpose
COMMENT ON COLUMN public.profiles.registration_completed_at IS 'Timestamp when a user completes registration through the onboarding flow';

-- Create function to set registration completed timestamp
CREATE OR REPLACE FUNCTION public.set_registration_completed(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles
  SET registration_completed_at = NOW()
  WHERE id = user_id;
END;
$$;

-- Comment on the function 
COMMENT ON FUNCTION public.set_registration_completed IS 'Sets the registration_completed_at timestamp for a user';
