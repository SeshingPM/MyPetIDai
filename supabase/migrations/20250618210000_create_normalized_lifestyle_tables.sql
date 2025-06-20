-- Migration: 20250618210000_create_normalized_lifestyle_tables.sql
-- Description: Create normalized lifestyle tables for better AI/ML querying and data consistency

-- Create pet_foods table
CREATE TABLE public.pet_foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    food_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pet_treats table
CREATE TABLE public.pet_treats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    treat_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pet_allergies table
CREATE TABLE public.pet_allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    allergen_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better AI/ML querying performance
CREATE INDEX idx_pet_foods_pet_id ON public.pet_foods(pet_id);
CREATE INDEX idx_pet_foods_food_name ON public.pet_foods(food_name);
CREATE INDEX idx_pet_treats_pet_id ON public.pet_treats(pet_id);
CREATE INDEX idx_pet_treats_treat_name ON public.pet_treats(treat_name);
CREATE INDEX idx_pet_allergies_pet_id ON public.pet_allergies(pet_id);
CREATE INDEX idx_pet_allergies_allergen_name ON public.pet_allergies(allergen_name);

-- Enable RLS on all new tables
ALTER TABLE public.pet_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_treats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_allergies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for pet_foods
CREATE POLICY "Users can view their own pet foods" 
    ON public.pet_foods 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_foods.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create foods for their pets" 
    ON public.pet_foods 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_foods.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own pet foods" 
    ON public.pet_foods 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_foods.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own pet foods" 
    ON public.pet_foods 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_foods.pet_id
            AND pets.user_id = auth.uid()
        )
    );

-- Create RLS policies for pet_treats
CREATE POLICY "Users can view their own pet treats" 
    ON public.pet_treats 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_treats.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create treats for their pets" 
    ON public.pet_treats 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_treats.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own pet treats" 
    ON public.pet_treats 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_treats.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own pet treats" 
    ON public.pet_treats 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_treats.pet_id
            AND pets.user_id = auth.uid()
        )
    );

-- Create RLS policies for pet_allergies
CREATE POLICY "Users can view their own pet allergies" 
    ON public.pet_allergies 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_allergies.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create allergies for their pets" 
    ON public.pet_allergies 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_allergies.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own pet allergies" 
    ON public.pet_allergies 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_allergies.pet_id
            AND pets.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own pet allergies" 
    ON public.pet_allergies 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM pets
            WHERE pets.id = pet_allergies.pet_id
            AND pets.user_id = auth.uid()
        )
    );

-- Migrate existing food_type data from pet_profiles to pet_foods
INSERT INTO public.pet_foods (pet_id, food_name)
SELECT pet_id, food_type
FROM public.pet_profiles
WHERE food_type IS NOT NULL AND food_type != '';

-- Remove the old food_type column from pet_profiles (it's now normalized)
ALTER TABLE public.pet_profiles DROP COLUMN IF EXISTS food_type;
