-- Migration: 20250406000001_allow_null_pet_id_in_reminders.sql
-- Description: Modifies the reminders table to allow NULL values for pet_id

-- First, drop the existing foreign key constraint
ALTER TABLE public.reminders
DROP CONSTRAINT reminders_pet_id_fkey;

-- Then modify the pet_id column to allow NULL values
ALTER TABLE public.reminders
ALTER COLUMN pet_id DROP NOT NULL;

-- Re-add the foreign key constraint with ON DELETE CASCADE, but allow NULL values
ALTER TABLE public.reminders
ADD CONSTRAINT reminders_pet_id_fkey
FOREIGN KEY (pet_id)
REFERENCES public.pets(id)
ON DELETE CASCADE;

-- Update existing 'none' pet_id values to NULL
UPDATE public.reminders
SET pet_id = NULL
WHERE pet_id = '00000000-0000-0000-0000-000000000000';