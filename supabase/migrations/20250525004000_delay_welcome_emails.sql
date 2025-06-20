-- Migration: 20250525004000_delay_welcome_emails.sql
-- Description: Updates the welcome email system to send emails 1 hour after checkout

-- Update the cron job to run hourly instead of every minute (for production)
DO $$
DECLARE
  job_id INT;
BEGIN
  -- Check if job already exists
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'send-welcome-emails-minute';
  
  IF FOUND THEN
    -- Update existing job to run hourly
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 * * * *',  -- Run at the top of each hour
      command := 'SELECT trigger_welcome_emails();'
    );
    RAISE NOTICE 'Updated welcome email cron job to run hourly';
  END IF;
END $$;

-- Update the trigger function to add logic for 1 hour delay
CREATE OR REPLACE FUNCTION public.trigger_welcome_emails()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  project_url TEXT;
  service_role_key TEXT;
BEGIN
  -- Get URL and key from vault
  SELECT decrypted_secret INTO project_url FROM vault.decrypted_secrets WHERE name = 'SUPABASE_URL';
  SELECT decrypted_secret INTO service_role_key FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY';
  
  IF project_url IS NULL OR service_role_key IS NULL THEN
    RAISE EXCEPTION 'Required vault secrets not found';
  END IF;
  
  -- Make HTTP request to the edge function with delay parameter
  PERFORM net.http_post(
    project_url || '/functions/v1/send-welcome-emails',
    jsonb_build_object(
      'timestamp', now(),
      'delay_hours', 1
    ),
    '{}'::jsonb,
    jsonb_build_object(
      'Authorization', 'Bearer ' || service_role_key,
      'Content-Type', 'application/json'
    )
  );
END;
$$;

-- Add an index to optimize queries for delayed welcome emails
CREATE INDEX IF NOT EXISTS welcome_email_queue_delay_idx 
ON public.welcome_email_queue (registration_completed_at, email_sent);

-- Comment on the updated function
COMMENT ON FUNCTION public.trigger_welcome_emails IS 'Triggers the welcome email edge function with a 1-hour delay parameter';
