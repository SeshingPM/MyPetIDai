-- Fix the create_complete_pet_profile function to use proper column names
-- The previous version incorrectly used 'user_id' in profiles which doesn't exist
CREATE OR REPLACE FUNCTION create_complete_pet_profile(
  user_id UUID,
  pet_name TEXT,
  pet_type TEXT,
  pet_breed TEXT,
  pet_gender TEXT,
  birth_or_adoption_date DATE,
  photo_url TEXT,
  owner_full_name TEXT,
  owner_zip_code TEXT,
  owner_phone TEXT,
  owner_sms_opt_in BOOLEAN,
  food TEXT,
  treats TEXT,
  allergies TEXT,
  insurance TEXT,
  medications JSONB,
  supplements JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_pet_id UUID;
  pet_identifier TEXT;
  pet_profile_id UUID;
  owner_profile_id UUID;
BEGIN
  -- Start a transaction
  BEGIN
    -- Create owner profile if it doesn't exist
    -- FIXED: In Supabase, the profiles table primary key 'id' IS the user_id,
    -- there's no separate user_id column
    INSERT INTO profiles (
      id, 
      full_name, 
      zip_code, 
      phone, 
      sms_opt_in
    )
    VALUES (
      user_id, 
      owner_full_name, 
      owner_zip_code, 
      owner_phone, 
      owner_sms_opt_in
    )
    ON CONFLICT (id)
    DO UPDATE SET
      full_name = EXCLUDED.full_name,
      zip_code = EXCLUDED.zip_code,
      phone = EXCLUDED.phone,
      sms_opt_in = EXCLUDED.sms_opt_in
    RETURNING id INTO owner_profile_id;
    
    -- Insert pet data
    INSERT INTO pets (
      id,
      user_id,
      name,
      type,
      breed,
      gender,
      birth_or_adoption_date,
      photo_url
    )
    VALUES (
      gen_random_uuid(),
      user_id,
      pet_name,
      pet_type,
      pet_breed,
      pet_gender,
      birth_or_adoption_date,
      photo_url
    )
    RETURNING id, pet_identifier INTO new_pet_id, pet_identifier;
    
    -- Create pet profile
    INSERT INTO pet_profiles (
      id,
      pet_id,
      food_type,
      treats,
      allergies,
      insurance
    )
    VALUES (
      gen_random_uuid(),
      new_pet_id,
      food,
      treats,
      allergies,
      insurance
    )
    RETURNING id INTO pet_profile_id;
    
    -- Insert medications if any
    IF medications IS NOT NULL AND jsonb_array_length(medications) > 0 THEN
      INSERT INTO pet_medications (
        id,
        pet_id,
        medication_name,
        provider
      )
      SELECT
        gen_random_uuid(),
        new_pet_id,
        med->>'name',
        med->>'provider'
      FROM jsonb_array_elements(medications) AS med;
    END IF;
    
    -- Insert supplements if any
    IF supplements IS NOT NULL AND jsonb_array_length(supplements) > 0 THEN
      INSERT INTO pet_supplements (
        id,
        pet_id,
        supplement_name
      )
      SELECT
        gen_random_uuid(),
        new_pet_id,
        supplement::text
      FROM jsonb_array_elements_text(supplements) AS supplement;
    END IF;
    
    -- Return success with created IDs
    RETURN jsonb_build_object(
      'success', true,
      'pet_id', new_pet_id,
      'pet_identifier', pet_identifier,
      'pet_profile_id', pet_profile_id,
      'owner_profile_id', owner_profile_id
    );
    
    EXCEPTION WHEN OTHERS THEN
      -- Rollback will happen automatically
      RETURN jsonb_build_object(
        'success', false,
        'error', SQLERRM
      );
  END;
END;
$$;

-- Grant permissions to use this function
GRANT EXECUTE ON FUNCTION create_complete_pet_profile TO service_role;
GRANT EXECUTE ON FUNCTION create_complete_pet_profile TO authenticated;
GRANT EXECUTE ON FUNCTION create_complete_pet_profile TO anon;
