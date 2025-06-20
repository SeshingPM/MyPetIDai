-- Migration: 20250322000016_pet_id_generation.sql
-- Description: Creates a function to generate unique pet IDs

-- Function to generate a unique pet ID
CREATE OR REPLACE FUNCTION generate_unique_pet_id(
  p_pet_type TEXT,
  p_gender TEXT,
  p_birth_date DATE
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_type_char CHAR(1);
  v_gender_char CHAR(1);
  v_year_code CHAR(2);
  v_random_code CHAR(4);
  v_pet_id TEXT;
  v_is_unique BOOLEAN := FALSE;
  v_attempts INTEGER := 0;
  v_max_attempts INTEGER := 10;
BEGIN
  -- Determine type character
  v_type_char := CASE WHEN p_pet_type = 'dog' THEN 'D' ELSE 'C' END;
  
  -- Determine gender character
  v_gender_char := CASE WHEN p_gender = 'male' THEN 'M' ELSE 'F' END;
  
  -- Extract year code (last 2 digits of year)
  v_year_code := RIGHT(EXTRACT(YEAR FROM p_birth_date)::TEXT, 2);
  
  -- Try to generate a unique ID (with retry logic)
  WHILE NOT v_is_unique AND v_attempts < v_max_attempts LOOP
    -- Generate random 4-digit code
    v_random_code := LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0');
    
    -- Construct pet ID
    v_pet_id := v_type_char || v_gender_char || '-' || v_year_code || '-' || v_random_code;
    
    -- Check if this ID already exists
    PERFORM 1 FROM pets WHERE pet_identifier = v_pet_id;
    
    -- If no rows returned, the ID is unique
    v_is_unique := NOT FOUND;
    
    v_attempts := v_attempts + 1;
  END LOOP;
  
  -- If we couldn't generate a unique ID after max attempts, raise an error
  IF NOT v_is_unique THEN
    RAISE EXCEPTION 'Could not generate a unique pet ID after % attempts', v_max_attempts;
  END IF;
  
  RETURN v_pet_id;
END;
$$;

-- Create a trigger to automatically generate pet_identifier if not provided
CREATE OR REPLACE FUNCTION set_pet_identifier()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate if pet_identifier is NULL or empty
  IF NEW.pet_identifier IS NULL OR NEW.pet_identifier = '' THEN
    NEW.pet_identifier := generate_unique_pet_id(NEW.type, NEW.gender, NEW.birth_or_adoption_date);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_pet_insert
BEFORE INSERT ON pets
FOR EACH ROW
EXECUTE FUNCTION set_pet_identifier();
