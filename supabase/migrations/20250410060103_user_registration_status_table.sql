-- Migration: 20250410060103_user_registration_status_table.sql
-- Description: Creates a table to track user registration status

-- Create user_registration_status table
CREATE TABLE IF NOT EXISTS public.user_registration_status (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'abandoned'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  registration_completed_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_registration_status_status ON public.user_registration_status(registration_status);

-- Enable RLS on user_registration_status table
ALTER TABLE public.user_registration_status ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view their own registration status
CREATE POLICY "Users can view their own registration status"
  ON public.user_registration_status
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy to allow service role to manage all registration statuses
CREATE POLICY "Service role can manage all registration statuses"
  ON public.user_registration_status
  USING (auth.role() = 'service_role');

-- Policy to allow INSERT from service role
CREATE POLICY "Service role can insert registration statuses"
  ON public.user_registration_status
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Policy to allow UPDATE from service role
CREATE POLICY "Service role can update registration statuses"
  ON public.user_registration_status
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- Function to check if a user has completed registration
CREATE OR REPLACE FUNCTION public.has_completed_registration(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_completed BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_registration_status
    WHERE user_id = p_user_id AND registration_status = 'completed'
  ) INTO is_completed;
  
  RETURN is_completed;
END;
$$;

-- Grant permissions
GRANT SELECT ON public.user_registration_status TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.has_completed_registration(UUID) TO authenticated, anon, service_role;

