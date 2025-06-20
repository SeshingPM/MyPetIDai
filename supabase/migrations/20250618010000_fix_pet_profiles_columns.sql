-- Migration: 20250618010000_fix_pet_profiles_columns.sql
-- Description: Fixes the create_complete_pet_profile function to use correct pet_profiles table columns

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
) RETURNS JSONB AS $$
DECLARE
    profile_id UUID;
    pet_id UUID;
    pet_identifier TEXT;
    meds_array TEXT[];
    supplements_array TEXT[];
    i INTEGER;
BEGIN
    -- Check if user exists
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
        RETURN jsonb_build_object('success', false, 'error', 'User not found');
    END IF;

    -- Update profile information
    INSERT INTO profiles (
        id,
        full_name,
        zip_code,
        phone,
        sms_opt_in,
        registration_completed_at
    ) VALUES (
        p_user_id,
        p_owner_full_name,
        p_owner_zip_code,
        p_owner_phone,
        p_owner_sms_opt_in,
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
    IF p_medications IS NOT NULL AND jsonb_array_length(p_medications) > 0 THEN
        SELECT array_agg(med->>'name')
        FROM jsonb_array_elements(p_medications) med
        WHERE med->>'name' IS NOT NULL
        INTO meds_array;
    ELSE
        meds_array := ARRAY[]::TEXT[];
    END IF;

    IF p_supplements IS NOT NULL AND jsonb_array_length(p_supplements) > 0 THEN
        SELECT array_agg(supp::TEXT)
        FROM jsonb_array_elements_text(p_supplements) supp
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
        user_id -- This is the correct column name for the user ID in the pets table
    ) VALUES (
        p_pet_name,
        p_pet_type,
        p_pet_breed,
        p_pet_gender,
        p_birth_or_adoption_date,
        p_photo_url,
        p_user_id
    ) RETURNING id, pet_identifier INTO pet_id, pet_identifier;

    -- Insert pet lifestyle info into pet_profiles table with correct column names
    INSERT INTO pet_profiles (
        pet_id,
        food_type,        -- Changed from 'food' to 'food_type'
        treats,           -- Added in the ALTER TABLE statement
        has_insurance,    -- Changed from 'insurance' to boolean flag
        insurance_provider -- Store the actual provider name if provided
    ) VALUES (
        pet_id,
        p_food,
        ARRAY[p_treats],  -- Convert treats to array as required by schema
        CASE WHEN p_insurance IS NOT NULL AND p_insurance != '' THEN TRUE ELSE FALSE END,
        p_insurance
    );
    
    -- Store allergies as a tag or note (create the column if it doesn't exist)
    BEGIN
        ALTER TABLE pet_profiles ADD COLUMN IF NOT EXISTS allergies TEXT;
        
        UPDATE pet_profiles
        SET allergies = p_allergies
        WHERE pet_id = pet_id;
    EXCEPTION WHEN OTHERS THEN
        -- If column exists but has a different type, handle gracefully
        NULL;
    END;

    -- Insert supplements into the pet_supplements table
    IF supplements_array IS NOT NULL AND array_length(supplements_array, 1) > 0 THEN
        FOR i IN 1..array_length(supplements_array, 1) LOOP
            INSERT INTO pet_supplements (pet_id, name)
            VALUES (pet_id, supplements_array[i]);
        END LOOP;
    END IF;

    -- Insert medications into the pet_medications table
    IF meds_array IS NOT NULL AND array_length(meds_array, 1) > 0 THEN
        FOR i IN 1..array_length(meds_array, 1) LOOP
            INSERT INTO pet_medications (pet_id, name)
            VALUES (pet_id, meds_array[i]);
        END LOOP;
    END IF;

    -- Return the pet_identifier
    RETURN jsonb_build_object('success', true, 'pet_id', pet_identifier);
END;
$$ LANGUAGE plpgsql;
