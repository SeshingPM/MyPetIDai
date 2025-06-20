-- Migration: 20250618030000_fix_json_conversion.sql
-- Description: Fixes the JSON string conversion issue in the create_complete_pet_profile function

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
    p_medications TEXT, -- Changed from JSONB to TEXT since it's passed as a string
    p_supplements TEXT  -- Changed from JSONB to TEXT since it's passed as a string
) RETURNS JSONB AS $$
DECLARE
    profile_id UUID;
    pet_id UUID;
    pet_identifier TEXT;
    parsed_meds JSONB;
    parsed_supps JSONB;
    meds_array TEXT[] := '{}';
    supplements_array TEXT[] := '{}';
    i INTEGER;
BEGIN
    -- Update profile information
    BEGIN
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
    EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'Failed to update profile: ' || SQLERRM);
    END;

    -- Parse JSON strings into JSONB with error handling
    BEGIN
        -- Only try to parse if not null and not empty
        IF p_medications IS NOT NULL AND p_medications != '' THEN
            parsed_meds := p_medications::JSONB;
            
            -- Extract medication names safely
            IF jsonb_typeof(parsed_meds) = 'array' AND jsonb_array_length(parsed_meds) > 0 THEN
                SELECT array_agg(med->>'name')
                FROM jsonb_array_elements(parsed_meds) med
                WHERE med->>'name' IS NOT NULL
                INTO meds_array;
                
                -- Default to empty array if NULL
                IF meds_array IS NULL THEN
                    meds_array := '{}';
                END IF;
            END IF;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- If JSON parsing fails, log it but continue
        meds_array := '{}';
    END;

    BEGIN
        -- Only try to parse if not null and not empty
        IF p_supplements IS NOT NULL AND p_supplements != '' THEN
            parsed_supps := p_supplements::JSONB;
            
            -- Extract supplement names safely
            IF jsonb_typeof(parsed_supps) = 'array' AND jsonb_array_length(parsed_supps) > 0 THEN
                SELECT array_agg(supp::TEXT)
                FROM jsonb_array_elements_text(parsed_supps) supp
                WHERE supp IS NOT NULL
                INTO supplements_array;
                
                -- Default to empty array if NULL
                IF supplements_array IS NULL THEN
                    supplements_array := '{}';
                END IF;
            END IF;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- If JSON parsing fails, log it but continue
        supplements_array := '{}';
    END;

    -- Insert pet record
    BEGIN
        INSERT INTO pets (
            name,
            type,
            breed,
            gender,
            birth_or_adoption_date,
            photo_url,
            user_id
        ) VALUES (
            p_pet_name,
            p_pet_type,
            p_pet_breed,
            p_pet_gender,
            p_birth_or_adoption_date,
            p_photo_url,
            p_user_id
        ) RETURNING id, pet_identifier INTO pet_id, pet_identifier;
        
        IF pet_id IS NULL THEN
            RETURN jsonb_build_object('success', false, 'error', 'Failed to create pet record: No ID returned');
        END IF;
    EXCEPTION WHEN OTHERS THEN
        RETURN jsonb_build_object('success', false, 'error', 'Failed to create pet record: ' || SQLERRM);
    END;

    -- Insert basic pet profile
    BEGIN
        INSERT INTO pet_profiles (pet_id, food_type) 
        VALUES (pet_id, p_food);
    EXCEPTION WHEN OTHERS THEN
        -- Continue even if this fails
        NULL;
    END;

    -- Try to add treats if column exists
    BEGIN
        UPDATE pet_profiles 
        SET treats = ARRAY[p_treats]
        WHERE pet_id = pet_id;
    EXCEPTION WHEN OTHERS THEN
        -- Continue even if this fails
        NULL;
    END;

    -- Try to add insurance info if columns exist
    BEGIN
        UPDATE pet_profiles 
        SET insurance_provider = p_insurance,
            has_insurance = CASE WHEN p_insurance IS NOT NULL AND p_insurance != '' THEN TRUE ELSE FALSE END
        WHERE pet_id = pet_id;
    EXCEPTION WHEN OTHERS THEN
        -- Continue even if this fails
        NULL;
    END;

    -- Try to add allergies if column exists
    BEGIN
        UPDATE pet_profiles 
        SET allergies = p_allergies
        WHERE pet_id = pet_id;
    EXCEPTION WHEN OTHERS THEN
        -- Continue even if this fails
        NULL;
    END;

    -- Insert supplements if any
    IF array_length(supplements_array, 1) > 0 THEN
        BEGIN
            FOR i IN 1..array_length(supplements_array, 1) LOOP
                INSERT INTO pet_supplements (pet_id, name)
                VALUES (pet_id, supplements_array[i]);
            END LOOP;
        EXCEPTION WHEN OTHERS THEN
            -- Continue even if this fails
            NULL;
        END;
    END IF;

    -- Insert medications if any
    IF array_length(meds_array, 1) > 0 THEN
        BEGIN
            FOR i IN 1..array_length(meds_array, 1) LOOP
                INSERT INTO pet_medications (pet_id, name)
                VALUES (pet_id, meds_array[i]);
            END LOOP;
        EXCEPTION WHEN OTHERS THEN
            -- Continue even if this fails
            NULL;
        END;
    END IF;

    -- Return the pet_identifier - this is critical for the Edge Function
    IF pet_identifier IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Pet created but identifier not generated');
    END IF;

    RETURN jsonb_build_object('success', true, 'pet_id', pet_identifier);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
