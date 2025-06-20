-- Migration: 20250618001500_fix_onboarding_function.sql
-- Description: Fixes the create_complete_pet_profile function to use correct column names and return the pet_id

CREATE OR REPLACE FUNCTION public.create_complete_pet_profile(
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
) RETURNS JSONB AS $$
DECLARE
    profile_id UUID;
    pet_id UUID;
    pet_identifier TEXT;
    meds_array TEXT[];
    supplements_array TEXT[];
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'User not found');
    END IF;

    -- FIXED: In Supabase, the profiles table primary key 'id' IS the user_id,
    -- no separate user_id column exists
    INSERT INTO profiles (
        id,
        full_name,
        zip_code,  -- Using the newly created zip_code column
        phone,
        sms_opt_in,
        registration_completed_at
    ) VALUES (
        user_id,
        owner_full_name,
        owner_zip_code,
        owner_phone,
        owner_sms_opt_in,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        zip_code = EXCLUDED.zip_code,
        phone = EXCLUDED.phone,
        sms_opt_in = EXCLUDED.sms_opt_in,
        registration_completed_at = EXCLUDED.registration_completed_at
    RETURNING id INTO profile_id;

    -- Convert JSON arrays to text arrays with null handling
    IF medications IS NOT NULL AND jsonb_array_length(medications) > 0 THEN
        SELECT array_agg(med->>'name')
        FROM jsonb_array_elements(medications) med
        WHERE med->>'name' IS NOT NULL
        INTO meds_array;
    ELSE
        meds_array := ARRAY[]::TEXT[];
    END IF;

    IF supplements IS NOT NULL AND jsonb_array_length(supplements) > 0 THEN
        SELECT array_agg(supp::TEXT)
        FROM jsonb_array_elements_text(supplements) supp
        WHERE supp IS NOT NULL
        INTO supplements_array;
    ELSE
        supplements_array := ARRAY[]::TEXT[];
    END IF;

    -- Insert pet record
    INSERT INTO pets (
        name,
        type,
        breed,
        gender,
        birth_or_adoption_date,
        photo_url,
        owner_id
    ) VALUES (
        pet_name,
        pet_type,
        pet_breed,
        pet_gender,
        birth_or_adoption_date,
        photo_url,
        user_id
    ) RETURNING id, pet_identifier INTO pet_id, pet_identifier;

    -- Insert pet lifestyle info
    INSERT INTO pet_profiles (
        pet_id,
        food,
        treats,
        allergies,
        insurance,
        medications,
        supplements
    ) VALUES (
        pet_id,
        food,
        treats,
        allergies,
        insurance,
        meds_array,
        supplements_array
    );

    -- FIXED: Return the pet_identifier so the Edge Function can display it
    RETURN jsonb_build_object('success', true, 'pet_id', pet_identifier);
END;
$$ LANGUAGE plpgsql;
