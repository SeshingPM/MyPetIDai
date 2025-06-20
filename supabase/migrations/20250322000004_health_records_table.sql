-- Migration: 20250322000004_health_records_table.sql
-- Description: Creates the health_records table and sets up RLS policies

-- Create health_records table
CREATE TABLE public.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  weight NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on health_records table
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for health_records table
CREATE POLICY "Users can view their own health records" 
  ON public.health_records 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create health records for their pets" 
  ON public.health_records 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health records" 
  ON public.health_records 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health records" 
  ON public.health_records 
  FOR DELETE 
  USING (auth.uid() = user_id);