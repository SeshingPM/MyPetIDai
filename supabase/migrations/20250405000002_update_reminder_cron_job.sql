-- -- Migration: 20250405000002_update_reminder_cron_job.sql
-- -- Description: Updates the cron job for reminder emails with the correct service role token
-- --
-- -- ENVIRONMENT CONFIGURATION:
-- -- This migration is configured for the PRODUCTION environment.
-- -- For TEST environment, use the following values:
-- --   - URL: https://yyqodsrvslheazteialw.supabase.co
-- --   - Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5cW9kc3J2c2xoZWF6dGVpYWx3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTg4ODk3MywiZXhwIjoyMDU3NDY0OTczfQ.1CSCD-ED8roJ8ZaElTSQ6fD8N6CZyY1DtQ0yw8pWF9Y

-- -- Unschedule the existing job
-- SELECT cron.unschedule('send-reminder-emails-hourly');

-- -- Create a new cron job with the correct service role token
-- SELECT cron.schedule(
--   'send-reminder-emails-hourly',  -- Job name
--   '0 * * * *',                    -- Cron expression (hourly at minute 0)
--   -- PRODUCTION ENVIRONMENT CONFIGURATION
--   -- For TEST environment, replace the URL and Bearer token with the test values from the comments above
--   'SELECT net.http_post(''https://nmzqcbyuqxyhnnafpyil.supabase.co/functions/v1/send-reminder-emails'', jsonb_build_object(''timestamp'', now()), ''{}'', jsonb_build_object(''Authorization'', ''Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tenFjYnl1cXh5aG5uYWZweWlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjc1MTk2MCwiZXhwIjoyMDU4MzI3OTYwfQ.XJ3SvCcaEZb_hL37hO1EU2Viaiwof1mrN_xIRw144Q4'', ''Content-Type'', ''application/json'')) as request_id;'
-- );

-- -- Log that the migration was successful
-- DO $$
-- BEGIN
--   RAISE NOTICE 'Reminder email cron job has been updated successfully';
-- END $$;