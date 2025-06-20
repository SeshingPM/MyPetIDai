-- Migration: 20250322000006_vaccinations_table.sql
-- Description: Creates the vaccinations table and sets up RLS policies

-- Create vaccinations table
CREATE TABLE public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_administered TIMESTAMPTZ NOT NULL,
  expiration_date TIMESTAMPTZ,
  administrator TEXT,
  batch_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on vaccinations table
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vaccinations table
CREATE POLICY "Users can manage their own data" 
  ON public.vaccinations 
  USING (auth.uid() = user_id);