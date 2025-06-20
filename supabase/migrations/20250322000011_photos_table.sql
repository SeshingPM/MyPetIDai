-- Migration: 20250322000011_photos_table.sql
-- Description: Creates the photos table and sets up RLS policies

-- Create photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  pet_id uuid NOT NULL REFERENCES public.pets(id),
  url text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on photos table
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for photos
CREATE POLICY "Users can view their own photos" 
  ON public.photos 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own photos" 
  ON public.photos 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own photos" 
  ON public.photos 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);