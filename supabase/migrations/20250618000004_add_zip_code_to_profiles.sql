-- Migration: 20250618000003_add_zip_code_to_profiles.sql
-- Description: Adds a zip_code column to the profiles table

-- Add zip_code column to the profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS zip_code TEXT;

-- Create an index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_zip_code ON public.profiles (zip_code);

-- Add a comment to document the column's purpose
COMMENT ON COLUMN public.profiles.zip_code IS 'User postal/zip code for location-based services';
