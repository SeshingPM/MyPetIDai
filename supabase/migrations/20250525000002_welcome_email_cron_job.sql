-- Migration: 20250525000002_welcome_email_cron_job.sql
-- Description: Sets up a cron job to trigger the welcome email edge function

-- Ensure the required extensions are enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Note: This migration assumes you have manually created the required vault secrets:
-- 1. SUPABASE_URL - The URL of your Supabase project
-- 2. SUPABASE_ANON_KEY - The anonymous key for your Supabase project
--
-- You can create these secrets manually in the SQL console using:
-- SELECT vault.create_secret('your-supabase-url', 'SUPABASE_URL', 'URL for Supabase project');
-- SELECT vault.create_secret('your-supabase-anon-key', 'SUPABASE_ANON_KEY', 'Anon key for Supabase project');

-- Check if required vault secrets exist (non-blocking warning only)
DO $$
DECLARE
  supabase_url_exists BOOLEAN;
  supabase_anon_key_exists BOOLEAN;
BEGIN
  SELECT EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL') INTO supabase_url_exists;
  SELECT EXISTS (SELECT 1 FROM vault.decrypted_secrets WHERE name = 'SUPABASE_ANON_KEY') INTO supabase_anon_key_exists;
  
  IF NOT (supabase_url_exists AND supabase_anon_key_exists) THEN
    RAISE WARNING 'One or more required vault secrets are missing. The welcome email cron job may not function correctly.';
    RAISE WARNING 'Please create the missing secrets manually in the SQL console.';
  ELSE
    RAISE NOTICE 'Required vault secrets for welcome email system found.';
  END IF;
END $$;

-- Create a SQL function to trigger the welcome email edge function
CREATE OR REPLACE FUNCTION trigger_welcome_emails()
RETURNS void
LANGUAGE 'plpgsql'
SECURITY DEFINER
AS $$
DECLARE
  project_url TEXT;
  anon_key TEXT;
BEGIN
  -- Get URL and key from vault with proper error handling
  BEGIN
    -- Retrieve secrets from vault
    SELECT decrypted_secret INTO project_url FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL';
    IF project_url IS NULL THEN
      RAISE EXCEPTION 'SUPABASE_URL not found in vault';
    END IF;
    
    SELECT decrypted_secret INTO anon_key FROM vault.decrypted_secrets WHERE name = 'SUPABASE_ANON_KEY';
    IF anon_key IS NULL THEN
      RAISE EXCEPTION 'SUPABASE_ANON_KEY not found in vault';
    END IF;
    
    -- Make HTTP request to the edge function
    PERFORM net.http_post(
      project_url || '/functions/v1/send-welcome-emails',
      jsonb_build_object('timestamp', now()),
      '{}'::jsonb,
      jsonb_build_object(
        'Authorization', 'Bearer ' || anon_key,
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

-- Set up the cron job - handle case where it might already exist
DO $$
DECLARE
  job_id INT;
BEGIN
  -- Check if job already exists
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'send-welcome-emails-minute';
  
  -- If job exists, update it; otherwise create it
  IF FOUND THEN
    PERFORM cron.alter_job(
      job_id,
      schedule := '* * * * *',      -- Run every minute (for testing)
      command := 'SELECT trigger_welcome_emails();'
    );
    RAISE NOTICE 'Updated existing welcome email cron job';
  ELSE
    PERFORM cron.schedule(
      'send-welcome-emails-minute',  -- Job name
      '* * * * *',                   -- Cron expression (every minute for testing)
      'SELECT trigger_welcome_emails();'
    );
    RAISE NOTICE 'Created new welcome email cron job';
  END IF;
  
  -- Instructions for production deployment
  RAISE NOTICE 'NOTE: For production deployment, change schedule to ''0 * * * *'' to run hourly';
END $$;
