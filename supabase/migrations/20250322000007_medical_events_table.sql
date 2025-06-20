-- Migration: 20250322000007_medical_events_table.sql
-- Description: Creates the medical_events table with constraints and sets up RLS policies

-- Create medical_events table
CREATE TABLE public.medical_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_date TIMESTAMPTZ NOT NULL,
  event_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  provider TEXT,
  cost NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add event_type constraint to medical_events
ALTER TABLE public.medical_events 
  ADD CONSTRAINT medical_events_event_type_check 
  CHECK (event_type = ANY (ARRAY['checkup'::text, 'emergency'::text, 'procedure'::text, 'vaccination'::text, 'medication'::text, 'other'::text]));

-- Enable RLS on medical_events table
ALTER TABLE public.medical_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for medical_events table
CREATE POLICY "Users can manage their own data" 
  ON public.medical_events 
  USING (auth.uid() = user_id);