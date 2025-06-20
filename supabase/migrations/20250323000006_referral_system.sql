-- Migration: 20250323000006_referral_system.sql
-- Description: Adds referral system tables and fixes increment_referral_points function

-- Add referral_points to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'referral_points'
    ) THEN
        ALTER TABLE public.profiles
        ADD COLUMN referral_points INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create profile_completion table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profile_completion (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    has_pet BOOLEAN DEFAULT FALSE,
    has_pet_photo BOOLEAN DEFAULT FALSE,
    has_document BOOLEAN DEFAULT FALSE,
    completion_percentage INTEGER DEFAULT 0,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create referral_codes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.referral_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    unique_code TEXT UNIQUE,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_user_referral_code UNIQUE (user_id)
);

-- Create referrals table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_referred_user UNIQUE (referred_user_id)
);

-- Enable RLS on tables
ALTER TABLE public.profile_completion ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create or replace functions
CREATE OR REPLACE FUNCTION public.is_referral_code_available(code_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.referral_codes
    WHERE LOWER(unique_code) = LOWER(code_to_check)
  );
END;
$function$;

-- Fix the increment_referral_points function to handle NULL values
CREATE OR REPLACE FUNCTION public.increment_referral_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Increment the referrer's points, handling NULL values
  UPDATE public.profiles
  SET referral_points = COALESCE(referral_points, 0) + 1
  WHERE id = NEW.referrer_id;
  
  -- Increment the used_count for the referral code, handling NULL values
  UPDATE public.referral_codes
  SET used_count = COALESCE(used_count, 0) + 1
  WHERE user_id = NEW.referrer_id;
  
  RETURN NEW;
END;
$function$;

-- Profile completion functions
CREATE OR REPLACE FUNCTION public.update_profile_completion_document()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Update has_document when a document is added
  UPDATE public.profile_completion
  SET 
    has_document = TRUE,
    completion_percentage = CASE 
      WHEN has_pet AND has_pet_photo THEN 100
      WHEN has_pet OR has_pet_photo THEN 66
      ELSE 33
    END,
    last_updated = NOW()
  WHERE id = NEW.user_id AND has_document = FALSE;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profile_completion_pet()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Update profile completion when a pet is added
  UPDATE public.profile_completion
  SET 
    has_pet = TRUE,
    completion_percentage = CASE 
      WHEN has_document THEN 100
      WHEN has_pet_photo THEN 66
      ELSE 33
    END,
    last_updated = NOW()
  WHERE id = NEW.user_id AND has_pet = FALSE;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profile_completion_pet_photo()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Update has_pet_photo when photo_url is added or updated and not null
  IF NEW.photo_url IS NOT NULL AND NEW.photo_url <> '' THEN
    UPDATE public.profile_completion
    SET 
      has_pet_photo = TRUE,
      completion_percentage = CASE 
        WHEN has_document THEN 100
        WHEN has_pet THEN 66
        ELSE 33
      END,
      last_updated = NOW()
    WHERE id = NEW.user_id AND has_pet_photo = FALSE;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update handle_new_user function to include profile_completion
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Insert a row into public.profiles
  INSERT INTO public.profiles (id, full_name, custom_categories)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    ARRAY[]::TEXT[]
  );
  
  -- Insert a row into public.user_preferences
  INSERT INTO public.user_preferences (user_id, email_notifications, reminder_advance_notice, reminder_time)
  VALUES (
    NEW.id,
    true,
    24,
    '09:00:00'
  );
  
  -- Insert a row into public.profile_completion
  INSERT INTO public.profile_completion (id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$function$;

-- Create triggers if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_document_added') THEN
        CREATE TRIGGER on_document_added
        AFTER INSERT ON public.documents
        FOR EACH ROW
        EXECUTE FUNCTION update_profile_completion_document();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_pet_added') THEN
        CREATE TRIGGER on_pet_added
        AFTER INSERT ON public.pets
        FOR EACH ROW
        EXECUTE FUNCTION update_profile_completion_pet();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_pet_photo_updated') THEN
        CREATE TRIGGER on_pet_photo_updated
        AFTER INSERT OR UPDATE ON public.pets
        FOR EACH ROW
        EXECUTE FUNCTION update_profile_completion_pet_photo();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_referral_added') THEN
        CREATE TRIGGER on_referral_added
        AFTER INSERT ON public.referrals
        FOR EACH ROW
        EXECUTE FUNCTION increment_referral_points();
    END IF;
END $$;

-- Create RLS policies using DO blocks to check if they exist first
-- Profile completion policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'profile_completion'
        AND policyname = 'Users can view their own profile completion'
    ) THEN
        CREATE POLICY "Users can view their own profile completion"
        ON public.profile_completion
        FOR SELECT
        TO public
        USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'profile_completion'
        AND policyname = 'Users can update their own profile completion'
    ) THEN
        CREATE POLICY "Users can update their own profile completion"
        ON public.profile_completion
        FOR UPDATE
        TO public
        USING (auth.uid() = id);
    END IF;
END $$;

-- Referral code policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'referral_codes'
        AND policyname = 'Users can view any referral code'
    ) THEN
        CREATE POLICY "Users can view any referral code"
        ON public.referral_codes
        FOR SELECT
        TO public
        USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'referral_codes'
        AND policyname = 'Users can insert their own referral codes'
    ) THEN
        CREATE POLICY "Users can insert their own referral codes"
        ON public.referral_codes
        FOR INSERT
        TO public
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'referral_codes'
        AND policyname = 'Users can update their own referral codes'
    ) THEN
        CREATE POLICY "Users can update their own referral codes"
        ON public.referral_codes
        FOR UPDATE
        TO public
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Referrals policies
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'referrals'
        AND policyname = 'System can insert referrals'
    ) THEN
        CREATE POLICY "System can insert referrals"
        ON public.referrals
        FOR INSERT
        TO public
        WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'referrals'
        AND policyname = 'Users can view their own referrals'
    ) THEN
        CREATE POLICY "Users can view their own referrals"
        ON public.referrals
        FOR SELECT
        TO public
        USING (auth.uid() = referrer_id);
    END IF;
END $$;

-- Update existing profiles to have a default value for referral_points
UPDATE public.profiles
SET referral_points = 0
WHERE referral_points IS NULL;