-- Fix ambiguous pet_identifier column reference in create_complete_pet_profile function
-- This migration adds table qualification to the pet_identifier column

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.create_complete_pet_profile;

-- Recreate the function with qualified column references
CREATE OR REPLACE FUNCTION public.create_complete_pet_profile(
  p_user_id UUID,
  p_pet_name TEXT,
  p_pet_type TEXT,
  p_pet_breed TEXT,
  p_pet_gender TEXT,
  p_birth_or_adoption_date DATE,
  p_photo_url TEXT,
  p_owner_full_name TEXT,
  p_owner_zip_code TEXT,
  p_owner_phone TEXT,
  p_owner_sms_opt_in BOOLEAN,
  p_food TEXT,
  p_treats TEXT,
  p_allergies TEXT,
  p_insurance TEXT,
  p_medications JSONB,
  p_supplements JSONB
)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  v_profile_id UUID;
  v_pet_id UUID;
  v_pet_identifier TEXT;
  v_medications_array TEXT[];
  v_supplements_array TEXT[];
BEGIN
  -- Update or create profile information
  INSERT INTO profiles (id, full_name, zip_code, phone, sms_opt_in, updated_at)
  VALUES (p_user_id, p_owner_full_name, p_owner_zip_code, p_owner_phone, p_owner_sms_opt_in, NOW())
  ON CONFLICT (id)
  DO UPDATE SET
    full_name = EXCLUDED.full_name,
    zip_code = EXCLUDED.zip_code,
    phone = EXCLUDED.phone,
    sms_opt_in = EXCLUDED.sms_opt_in,
    updated_at = NOW()
  RETURNING id INTO v_profile_id;
  
  -- Process medications array safely
  IF p_medications IS NOT NULL AND jsonb_typeof(p_medications) = 'array' THEN
    SELECT array_agg(m->>'name')
    FROM jsonb_array_elements(p_medications) AS m
    INTO v_medications_array;
  ELSE
    v_medications_array := ARRAY[]::TEXT[];
  END IF;
  
  -- Process supplements array safely
  IF p_supplements IS NOT NULL AND jsonb_typeof(p_supplements) = 'array' THEN
    SELECT array_agg(s::TEXT)
    FROM jsonb_array_elements_text(p_supplements) AS s
    INTO v_supplements_array;
  ELSE
    v_supplements_array := ARRAY[]::TEXT[];
  END IF;

  -- Create pet information
  INSERT INTO pets (
    user_id,
    name,
    type,
    breed,
    gender,
    birth_or_adoption_date,
    photo_url,
    food,
    treats,
    allergies,
    insurance,
    medications,
    supplements,
    created_at,
    updated_at
  )
  VALUES (
    p_user_id,
    p_pet_name,
    p_pet_type,
    p_pet_breed,
    p_pet_gender,
    p_birth_or_adoption_date,
    p_photo_url,
    p_food,
    p_treats,
    p_allergies,
    p_insurance,
    v_medications_array,
    v_supplements_array,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_pet_id;
  
  -- Get the pet_identifier with explicit table qualification to avoid ambiguity
  SELECT pets.pet_identifier INTO v_pet_identifier FROM pets WHERE id = v_pet_id;
  
  -- Return success and pet information
  RETURN jsonb_build_object(
    'success', TRUE,
    'profile_id', v_profile_id,
    'pet_id', v_pet_id,
    'pet_identifier', v_pet_identifier
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.create_complete_pet_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_complete_pet_profile TO anon;
GRANT EXECUTE ON FUNCTION public.create_complete_pet_profile TO service_role;
