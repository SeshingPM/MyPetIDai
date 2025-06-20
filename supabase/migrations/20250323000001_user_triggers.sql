-- Migration: 20250323000001_user_triggers.sql
-- Description: Creates triggers to automatically create profile and user_preferences records when a user is created

-- Create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a row into public.profiles
  INSERT INTO public.profiles (id, full_name, custom_categories)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    ARRAY[]::TEXT[]
  );
  
  -- Insert a row into public.user_preferences
  INSERT INTO public.user_preferences (user_id, email_notifications, reminder_advance_notice, reminder_time)
  VALUES (
    NEW.id,
    true,
    24,
    '09:00:00'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that calls the function when a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();