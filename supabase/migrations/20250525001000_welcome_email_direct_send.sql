-- Migration: 20250525001000_welcome_email_direct_send.sql
-- Description: Creates a function to directly send welcome emails from SQL

-- Create a function to send welcome emails directly via HTTP
CREATE OR REPLACE FUNCTION public.send_welcome_email_direct(user_id UUID, recipient_email TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  postmark_api_token TEXT;
  postmark_from_email TEXT;
  user_name TEXT;
  http_response jsonb;
  email_html TEXT;
  email_subject TEXT := 'Welcome to PetDocument!';
BEGIN
  -- Get Postmark credentials from vault
  SELECT decrypted_secret INTO postmark_api_token FROM vault.decrypted_secrets WHERE name = 'POSTMARK_API_TOKEN';
  SELECT decrypted_secret INTO postmark_from_email FROM vault.decrypted_secrets WHERE name = 'POSTMARK_FROM_EMAIL';
  
  -- If either credential is missing, raise an error
  IF postmark_api_token IS NULL THEN
    RAISE EXCEPTION 'POSTMARK_API_TOKEN not found in vault';
  END IF;
  
  IF postmark_from_email IS NULL THEN
    RAISE EXCEPTION 'POSTMARK_FROM_EMAIL not found in vault';
  END IF;
  
  -- Get user's name from profiles
  SELECT full_name INTO user_name FROM profiles WHERE id = user_id;
  
  -- If user not found, use a generic greeting
  IF user_name IS NULL OR user_name = '' THEN
    user_name := 'there';
  END IF;
  
  -- Create the welcome email HTML
  email_html := '
  <div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
    <h2 style="color: #333;">Welcome to PetDocument!</h2>
    
    <p style="font-size: 16px; color: #444; margin: 16px 0;">
      Hi ' || user_name || ',<br><br>
      We''re thrilled to welcome you to PetDocument! You''re now part of a growing community of pet owners who are organizing their pet''s health and records with confidence and ease.
    </p>
    
    <p style="font-size: 16px; color: #444; margin: 16px 0;">
      Here''s how to get started:
    </p>
    
    <ul style="font-size: 16px; color: #444; margin: 16px 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Add your pets to your profile</li>
      <li style="margin-bottom: 8px;">Upload your first pet document</li>
      <li style="margin-bottom: 8px;">Set up reminders for upcoming vaccinations and vet visits</li>
      <li style="margin-bottom: 8px;">Explore tools to manage records and stay on top of care</li>
    </ul>
    
    <p style="font-size: 16px; color: #444; margin: 16px 0;">
      We''re here to make pet parenting simpler, smarter, and more secure.
    </p>

    <p style="font-size: 16px; color: #444; margin: 16px 0;">
      Best,<br>
      The PetDocument Team
    </p>
    
    <hr style="margin: 32px 0; border: none; border-top: 1px solid #eaeaea;" />

    <p style="font-size: 12px; color: #333; text-align: center; margin-bottom: 24px;">
      PetDocument - Securely sharing pet records made simple
    </p>

    <p style="font-size: 12px; color: #333; text-align: center;">
      This message was sent automatically by PetDocument. If you weren''t expecting this email, you can safely ignore it.<br />
      Need help? Contact us at <a href="mailto:support@petdocument.com" style="color: #4F46E5;">support@petdocument.com</a>
    </p>
  </div>
  ';
  
  -- Send email using Postmark API via HTTP request
  SELECT content INTO http_response FROM 
  net.http_post(
    'https://api.postmarkapp.com/email',
    jsonb_build_object(
      'From', postmark_from_email,
      'To', recipient_email,
      'Subject', email_subject,
      'HtmlBody', email_html,
      'MessageStream', 'outbound'
    )::text,
    'application/json',
    ARRAY[
      net.http_header('X-Postmark-Server-Token', postmark_api_token),
      net.http_header('Content-Type', 'application/json')
    ]
  );
  
  -- Return the response
  RETURN http_response;
END;
$$;

-- Create a function to process all unsent welcome emails
CREATE OR REPLACE FUNCTION public.process_all_welcome_emails()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item RECORD;
  email_result jsonb;
  success_count INTEGER := 0;
  error_count INTEGER := 0;
  status_message TEXT;
BEGIN
  -- Loop through all unsent welcome emails
  FOR item IN 
    SELECT * FROM welcome_email_queue 
    WHERE email_sent = false
    ORDER BY registration_completed_at ASC
  LOOP
    BEGIN
      -- Try to send the email
      email_result := send_welcome_email_direct(item.user_id, item.email);
      
      -- If we got here without an exception, consider it successful
      -- Update the welcome email queue record
      UPDATE welcome_email_queue SET
        email_sent = true,
        email_sent_at = NOW(),
        updated_at = NOW(),
        metadata = jsonb_build_object(
          'source', COALESCE(item.metadata->>'source', 'unknown'),
          'processed_by', 'SQL direct process',
          'send_result', email_result,
          'sent_at', NOW()
        )
      WHERE id = item.id;
      
      -- Increment success counter
      success_count := success_count + 1;
      
      -- Log success
      RAISE NOTICE 'Successfully sent welcome email to % (user ID: %)', item.email, item.user_id;
      
    EXCEPTION WHEN OTHERS THEN
      -- Log the error
      RAISE WARNING 'Error sending welcome email to % (user ID: %): %', 
        item.email, item.user_id, SQLERRM;
      
      -- Update metadata with error
      UPDATE welcome_email_queue SET
        metadata = jsonb_build_object(
          'source', COALESCE(item.metadata->>'source', 'unknown'),
          'error', SQLERRM,
          'error_time', NOW(),
          'last_error_attempt', NOW()
        )
      WHERE id = item.id;
      
      -- Increment error counter
      error_count := error_count + 1;
    END;
  END LOOP;
  
  -- Create status message
  status_message := 'Processed ' || (success_count + error_count)::TEXT || 
                   ' welcome emails. Success: ' || success_count::TEXT || 
                   ', Errors: ' || error_count::TEXT;
  
  RETURN status_message;
END;
$$;

-- Create a job to run hourly that processes welcome emails
DO $$
DECLARE
  job_id INTEGER;
BEGIN
  -- Check if job already exists
  SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'process_welcome_emails_hourly';
  
  -- If job exists, update it; otherwise create it
  IF FOUND THEN
    PERFORM cron.alter_job(
      job_id,
      schedule := '0 * * * *',      -- Run at the top of every hour
      command := 'SELECT process_all_welcome_emails();'
    );
    RAISE NOTICE 'Updated existing welcome email processing job';
  ELSE
    PERFORM cron.schedule(
      'process_welcome_emails_hourly',  -- Job name
      '0 * * * *',                     -- Cron expression (hourly)
      'SELECT process_all_welcome_emails();'
    );
    RAISE NOTICE 'Created new welcome email processing job';
  END IF;
END $$;

-- Add comments to functions
COMMENT ON FUNCTION public.send_welcome_email_direct IS 'Sends a welcome email directly via Postmark API using pg_net';
COMMENT ON FUNCTION public.process_all_welcome_emails IS 'Processes all unsent welcome emails in the queue';
