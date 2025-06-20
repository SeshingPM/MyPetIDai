-- Migration: 20250619000000_add_missing_age_column.sql
-- Description: Adds the missing age column to pets table to fix the trigger error

-- Add age column to pets table if it doesn't exist
DO $$ 
BEGIN
    -- Check if the column exists before trying to add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'pets' 
        AND column_name = 'age'
    ) THEN
        -- Add the missing age column
        ALTER TABLE public.pets ADD COLUMN age INTEGER;
        
        -- Update existing records with calculated age
        UPDATE public.pets 
        SET age = EXTRACT(YEAR FROM AGE(CURRENT_DATE, birth_or_adoption_date))::INTEGER
        WHERE birth_or_adoption_date IS NOT NULL;
        
        RAISE NOTICE 'Age column added to pets table';
    ELSE
        RAISE NOTICE 'Age column already exists in pets table';
    END IF;
END $$;
