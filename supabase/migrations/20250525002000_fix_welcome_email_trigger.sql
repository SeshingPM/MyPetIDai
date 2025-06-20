-- Migration: 20250525002000_fix_welcome_email_trigger.sql
-- Description: Updates the trigger_welcome_emails function to use service_role_key

-- Create or update trigger function to use service_role_key
CREATE OR REPLACE FUNCTION public.trigger_welcome_emails()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  project_url TEXT;
  service_role_key TEXT;
BEGIN
  -- Get URL and key from vault with proper error handling
  BEGIN
    -- Retrieve secrets from vault
    SELECT decrypted_secret INTO project_url FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL';
    IF project_url IS NULL THEN
      RAISE EXCEPTION 'SUPABASE_URL not found in vault';
    END IF;
    
    SELECT decrypted_secret INTO service_role_key FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY';
    IF service_role_key IS NULL THEN
      RAISE EXCEPTION 'SUPABASE_SERVICE_ROLE_KEY not found in vault';
    END IF;
    
    -- Make HTTP request to the edge function
    PERFORM net.http_post(
      project_url || '/functions/v1/send-welcome-emails',
      jsonb_build_object('timestamp', now()),
      '{}'::jsonb,
      jsonb_build_object(
        'Authorization', 'Bearer ' || service_role_key,
        'Content-Type', 'application/json'
      )
    );
    
    RAISE NOTICE 'Successfully triggered welcome email function';
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error triggering welcome email function: %', SQLERRM;
    -- This will log errors but won't break the cron job
  END;
END;
$$;

-- Create a function to check if the edge function is accessible
CREATE OR REPLACE FUNCTION public.test_welcome_email_function()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  project_url TEXT;
  service_role_key TEXT;
  response jsonb;
BEGIN
  -- Get URL and key from vault
  SELECT decrypted_secret INTO project_url FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL';
  SELECT decrypted_secret INTO service_role_key FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY';
  
  -- Make HTTP request to the edge function with debug flag
  SELECT content INTO response FROM net.http_post(
    project_url || '/functions/v1/send-welcome-emails',
    jsonb_build_object(
      'timestamp', now(),
      'debug', true,
      'test', true
    ),
    '{}'::jsonb,
    jsonb_build_object(
      'Authorization', 'Bearer ' || service_role_key,
      'Content-Type', 'application/json'
    )
  );
  
  RETURN response;
END;
$$;

-- The service role key is required for the edge function, so make sure 
-- it's stored in the vault for the above functions to work
DO $$
BEGIN
  RAISE NOTICE 'Important: Make sure SUPABASE_SERVICE_ROLE_KEY is stored in the vault';
  RAISE NOTICE 'You can test if the edge function is accessible by running:';
  RAISE NOTICE 'SELECT test_welcome_email_function();';
END $$;
