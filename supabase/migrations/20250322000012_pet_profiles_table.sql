-- Migration: 20250322000012_pet_profiles_table.sql
-- Description: Creates the pet_profiles table for storing pet lifestyle information

CREATE TABLE public.pet_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  food_type TEXT,
  has_insurance BOOLEAN DEFAULT false,
  insurance_provider TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on pet_profiles table
ALTER TABLE public.pet_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pet_profiles table
CREATE POLICY "Users can view their own pet profiles" 
  ON public.pet_profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_profiles.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own pet profiles" 
  ON public.pet_profiles 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_profiles.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own pet profiles" 
  ON public.pet_profiles 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_profiles.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own pet profiles" 
  ON public.pet_profiles 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_profiles.pet_id
      AND pets.user_id = auth.uid()
    )
  );

-- Create pet_supplements table for storing supplement information
CREATE TABLE public.pet_supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on pet_supplements table
ALTER TABLE public.pet_supplements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pet_supplements table
CREATE POLICY "Users can view their own pet supplements" 
  ON public.pet_supplements 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_supplements.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own pet supplements" 
  ON public.pet_supplements 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_supplements.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own pet supplements" 
  ON public.pet_supplements 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_supplements.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own pet supplements" 
  ON public.pet_supplements 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_supplements.pet_id
      AND pets.user_id = auth.uid()
    )
  );

-- Create pet_medications table for storing medication information
CREATE TABLE public.pet_medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT,
  frequency TEXT,
  provider TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on pet_medications table
ALTER TABLE public.pet_medications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pet_medications table
CREATE POLICY "Users can view their own pet medications" 
  ON public.pet_medications 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_medications.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own pet medications" 
  ON public.pet_medications 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_medications.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own pet medications" 
  ON public.pet_medications 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_medications.pet_id
      AND pets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own pet medications" 
  ON public.pet_medications 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM pets
      WHERE pets.id = pet_medications.pet_id
      AND pets.user_id = auth.uid()
    )
  );

-- Create treats field in pet profiles
ALTER TABLE public.pet_profiles ADD COLUMN treats TEXT[];
