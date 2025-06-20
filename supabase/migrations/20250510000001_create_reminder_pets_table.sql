-- Migration: 20250510000001_create_reminder_pets_table.sql
-- Description: Creates the reminder_pets junction table to support many-to-many relationships

-- Create reminder_pets junction table
CREATE TABLE public.reminder_pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID NOT NULL REFERENCES public.reminders(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reminder_id, pet_id)
);

-- Enable RLS on reminder_pets table
ALTER TABLE public.reminder_pets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reminder_pets table
CREATE POLICY "Users can manage their own reminder_pets relationships" 
  ON public.reminder_pets 
  USING (
    auth.uid() IN (
      SELECT user_id 
      FROM public.reminders 
      WHERE id = reminder_id
    )
  );

-- Create indexes for performance
CREATE INDEX idx_reminder_pets_reminder_id ON public.reminder_pets(reminder_id);
CREATE INDEX idx_reminder_pets_pet_id ON public.reminder_pets(pet_id);

-- Migration step to move existing pet associations into the junction table
INSERT INTO public.reminder_pets (reminder_id, pet_id)
SELECT id as reminder_id, pet_id
FROM public.reminders
WHERE pet_id IS NOT NULL; 