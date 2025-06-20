-- Migration: 20250322000001_pets_table.sql
-- Description: Creates the pets table and sets up RLS policies

-- Create pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('dog', 'cat')) NOT NULL,
  breed TEXT,
  gender TEXT CHECK (gender IN ('male', 'female')) NOT NULL,
  birth_or_adoption_date DATE NOT NULL,
  pet_identifier TEXT UNIQUE,
  photo_url TEXT,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on pet_identifier for faster lookups
CREATE INDEX idx_pets_pet_identifier ON public.pets(pet_identifier);

-- Enable RLS on pets table
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pets table
CREATE POLICY "Users can view their own pets" 
  ON public.pets 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pets" 
  ON public.pets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pets" 
  ON public.pets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pets" 
  ON public.pets 
  FOR DELETE 
  USING (auth.uid() = user_id);