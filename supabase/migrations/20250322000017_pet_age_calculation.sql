-- Migration: 20250322000017_pet_age_calculation.sql
-- Description: Creates a function to calculate pet age automatically from birth_or_adoption_date

-- Add a trigger to keep the age column synchronized with birth_or_adoption_date (for backward compatibility)
CREATE OR REPLACE FUNCTION update_pet_age()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate age in years based on birth_or_adoption_date
    NEW.age = EXTRACT(YEAR FROM AGE(CURRENT_DATE, NEW.birth_or_adoption_date));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pet_age_trigger
BEFORE INSERT OR UPDATE OF birth_or_adoption_date ON pets
FOR EACH ROW
EXECUTE FUNCTION update_pet_age();
