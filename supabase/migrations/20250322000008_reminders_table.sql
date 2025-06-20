-- Migration: 20250322000008_reminders_table.sql
-- Description: Creates the reminders table with additional columns and sets up RLS policies

-- Create reminders table
CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  pet_name TEXT NOT NULL,
  title TEXT NOT NULL,
  notes TEXT,
  date TIMESTAMPTZ NOT NULL,
  archived BOOLEAN DEFAULT false,
  notification_sent BOOLEAN DEFAULT false NOT NULL,
  custom_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on reminders table
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reminders table
CREATE POLICY "Users can manage their own data" 
  ON public.reminders 
  USING (auth.uid() = user_id);