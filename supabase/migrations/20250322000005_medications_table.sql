-- Migration: 20250322000005_medications_table.sql
-- Description: Creates the medications table and sets up RLS policies

-- Create medications table
CREATE TABLE public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  health_record_id UUID REFERENCES public.health_records(id) ON DELETE SET NULL,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on medications table
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for medications table
CREATE POLICY "Users can view their own medications" 
  ON public.medications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create medications for their pets" 
  ON public.medications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medications" 
  ON public.medications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medications" 
  ON public.medications 
  FOR DELETE 
  USING (auth.uid() = user_id);