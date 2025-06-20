-- Migration: 20250615000001_add_phone_to_profiles.sql
-- Description: Adds an optional phone column to the profiles table

-- Add phone column to the profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;

-- Add SMS opt-in preference column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sms_opt_in BOOLEAN DEFAULT FALSE;

-- Add index to improve query performance on phone lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles (phone);

COMMENT ON COLUMN public.profiles.phone IS 'Optional phone number for the user';
COMMENT ON COLUMN public.profiles.sms_opt_in IS 'Whether the user has opted in to receive SMS notifications';
