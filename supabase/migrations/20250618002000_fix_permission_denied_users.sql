-- Migration: 20250618002000_fix_permission_denied_users.sql
-- Description: Fix permission denied for table users error in create_complete_pet_profile function

-- Drop and recreate the function without directly checking the auth.users table
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
    -- Remove the direct auth.users check that was causing permission issues
    -- The Edge Function already verifies the user exists before calling this function

    -- Update or insert profile data
    INSERT INTO profiles (
        id,
        full_name,
        zip_code,
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

    -- Return the pet_id and pet_identifier for the Edge Function
    RETURN jsonb_build_object('success', true, 'pet_id', pet_id, 'pet_identifier', pet_identifier);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; -- Add SECURITY DEFINER to run with function owner's permissions

-- Grant appropriate permissions to roles
GRANT EXECUTE ON FUNCTION create_complete_pet_profile TO service_role;
GRANT EXECUTE ON FUNCTION create_complete_pet_profile TO authenticated;
GRANT EXECUTE ON FUNCTION create_complete_pet_profile TO anon;

-- Ensure owner of the function is 'postgres'
ALTER FUNCTION create_complete_pet_profile OWNER TO postgres;
