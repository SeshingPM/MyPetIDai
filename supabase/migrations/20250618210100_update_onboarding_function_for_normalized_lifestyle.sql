-- Migration: 20250618210100_update_onboarding_function_for_normalized_lifestyle.sql
-- Description: Update create_complete_pet_profile function to work with normalized lifestyle tables

-- Drop the existing function
DROP FUNCTION IF EXISTS public.create_complete_pet_profile;

-- Create updated function that works with normalized lifestyle tables
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
    p_food TEXT, -- JSON array string
    p_treats TEXT, -- JSON array string
    p_allergies TEXT, -- JSON array string
    p_insurance TEXT,
    p_medications TEXT, -- JSON array string
    p_supplements TEXT -- JSON array string
) RETURNS JSONB AS $$
DECLARE
    v_profile_id UUID;
    v_pet_id UUID;
    v_pet_identifier TEXT;
    v_parsed_foods JSONB;
    v_parsed_treats JSONB;
    v_parsed_allergies JSONB;
    v_parsed_meds JSONB;
    v_parsed_supps JSONB;
    v_foods_array TEXT[] := '{}';
    v_treats_array TEXT[] := '{}';
    v_allergies_array TEXT[] := '{}';
    v_meds_array TEXT[] := '{}';
    v_supplements_array TEXT[] := '{}';
    v_i INTEGER;
BEGIN
    -- Update profile information with error handling
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
            registration_completed_at = NOW();
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Failed to update profile: %', SQLERRM;
    END;

    -- Parse food JSON string into array
    BEGIN
        IF p_food IS NOT NULL AND p_food != '' THEN
            v_parsed_foods := p_food::JSONB;
            SELECT ARRAY(
                SELECT jsonb_array_elements_text(v_parsed_foods)
            ) INTO v_foods_array;
            
            IF v_foods_array IS NULL THEN
                v_foods_array := '{}';
            END IF;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            v_foods_array := '{}';
    END;

    -- Parse treats JSON string into array
    BEGIN
        IF p_treats IS NOT NULL AND p_treats != '' THEN
            v_parsed_treats := p_treats::JSONB;
            SELECT ARRAY(
                SELECT jsonb_array_elements_text(v_parsed_treats)
            ) INTO v_treats_array;
            
            IF v_treats_array IS NULL THEN
                v_treats_array := '{}';
            END IF;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            v_treats_array := '{}';
    END;

    -- Parse allergies JSON string into array
    BEGIN
        IF p_allergies IS NOT NULL AND p_allergies != '' THEN
            v_parsed_allergies := p_allergies::JSONB;
            SELECT ARRAY(
                SELECT jsonb_array_elements_text(v_parsed_allergies)
            ) INTO v_allergies_array;
            
            IF v_allergies_array IS NULL THEN
                v_allergies_array := '{}';
            END IF;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            v_allergies_array := '{}';
    END;

    -- Parse medications JSON string into array
    BEGIN
        IF p_medications IS NOT NULL AND p_medications != '' THEN
            v_parsed_meds := p_medications::JSONB;
            SELECT ARRAY(
                SELECT jsonb_array_elements_text(v_parsed_meds)
            ) INTO v_meds_array;
            
            IF v_meds_array IS NULL THEN
                v_meds_array := '{}';
            END IF;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            v_meds_array := '{}';
    END;

    -- Parse supplements JSON string into array
    BEGIN
        IF p_supplements IS NOT NULL AND p_supplements != '' THEN
            v_parsed_supps := p_supplements::JSONB;
            SELECT ARRAY(
                SELECT jsonb_array_elements_text(v_parsed_supps)
            ) INTO v_supplements_array;
            
            IF v_supplements_array IS NULL THEN
                v_supplements_array := '{}';
            END IF;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            v_supplements_array := '{}';
    END;

    -- Create pet record
    BEGIN
        INSERT INTO pets (
            user_id,
            name,
            type,
            breed,
            gender,
            birth_or_adoption_date,
            photo_url
        ) VALUES (
            p_user_id,
            p_pet_name,
            p_pet_type,
            p_pet_breed,
            p_pet_gender,
            p_birth_or_adoption_date,
            p_photo_url
        ) RETURNING id, pet_identifier INTO v_pet_id, v_pet_identifier;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Failed to create pet: %', SQLERRM;
    END;

    -- Create pet profile with insurance info
    BEGIN
        INSERT INTO pet_profiles (
            pet_id,
            has_insurance,
            insurance_provider
        ) VALUES (
            v_pet_id,
            CASE WHEN p_insurance IS NOT NULL AND p_insurance != '' THEN true ELSE false END,
            p_insurance
        ) RETURNING id INTO v_profile_id;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Failed to create pet profile: %', SQLERRM;
    END;

    -- Insert foods if any
    IF array_length(v_foods_array, 1) > 0 THEN
        BEGIN
            FOR v_i IN 1..array_length(v_foods_array, 1) LOOP
                INSERT INTO pet_foods (pet_id, food_name)
                VALUES (v_pet_id, v_foods_array[v_i]);
            END LOOP;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE EXCEPTION 'Failed to insert pet foods: %', SQLERRM;
        END;
    END IF;

    -- Insert treats if any
    IF array_length(v_treats_array, 1) > 0 THEN
        BEGIN
            FOR v_i IN 1..array_length(v_treats_array, 1) LOOP
                INSERT INTO pet_treats (pet_id, treat_name)
                VALUES (v_pet_id, v_treats_array[v_i]);
            END LOOP;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE EXCEPTION 'Failed to insert pet treats: %', SQLERRM;
        END;
    END IF;

    -- Insert allergies if any
    IF array_length(v_allergies_array, 1) > 0 THEN
        BEGIN
            FOR v_i IN 1..array_length(v_allergies_array, 1) LOOP
                INSERT INTO pet_allergies (pet_id, allergen_name)
                VALUES (v_pet_id, v_allergies_array[v_i]);
            END LOOP;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE EXCEPTION 'Failed to insert pet allergies: %', SQLERRM;
        END;
    END IF;

    -- Insert medications if any
    IF array_length(v_meds_array, 1) > 0 THEN
        BEGIN
            FOR v_i IN 1..array_length(v_meds_array, 1) LOOP
                INSERT INTO pet_medications (pet_id, name)
                VALUES (v_pet_id, v_meds_array[v_i]);
            END LOOP;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE EXCEPTION 'Failed to insert pet medications: %', SQLERRM;
        END;
    END IF;

    -- Insert supplements if any
    IF array_length(v_supplements_array, 1) > 0 THEN
        BEGIN
            FOR v_i IN 1..array_length(v_supplements_array, 1) LOOP
                INSERT INTO pet_supplements (pet_id, name)
                VALUES (v_pet_id, v_supplements_array[v_i]);
            END LOOP;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE EXCEPTION 'Failed to insert pet supplements: %', SQLERRM;
        END;
    END IF;

    -- Return success response with both id and pet_identifier
    RETURN jsonb_build_object(
        'success', true,
        'pet_id', v_pet_id,
        'pet_identifier', v_pet_identifier,
        'profile_id', v_profile_id
    );

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Onboarding failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
