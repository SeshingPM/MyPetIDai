-- Migration: 20250322000009_user_preferences_table.sql
-- Description: Creates the user_preferences table with alterations and sets up RLS policies

-- Create user_preferences table
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  reminder_advance_notice INTEGER DEFAULT 24,
  reminder_time TIME WITHOUT TIME ZONE DEFAULT '09:00:00'::TIME WITHOUT TIME ZONE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on user_preferences table
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_preferences table
CREATE POLICY "Users can manage their own data" 
  ON public.user_preferences 
  USING (auth.uid() = user_id);