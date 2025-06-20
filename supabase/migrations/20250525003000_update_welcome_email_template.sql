-- Migration: 20250525003000_update_welcome_email_template.sql
-- Description: Updates the welcome email template with improved footer styling

-- Create or replace the direct email sending function with updated template
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
  email_subject TEXT := 'Welcome to MyPetID!';
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
  
  -- Create the welcome email HTML with updated footer
  email_html := '
  <div style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
    <h2 style="color: #333;">Welcome to MyPetID!</h2>
    
    <p style="font-size: 16px; color: #444; margin: 16px 0;">
      Hi ' || user_name || ',<br><br>
      We''re thrilled to welcome you to MyPetID! You''re now part of a growing community of pet owners who are organizing their pet''s health and records with confidence and ease.
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
      The MyPetID Team
    </p>
    
    <hr style="margin: 32px 0; border: none; border-top: 1px solid #eaeaea;" />

    <p style="font-size: 12px; color: #333; text-align: center; margin-bottom: 24px;">
      MyPetID - Securely sharing pet records made simple
    </p>

    <p style="font-size: 12px; color: #333; text-align: center;">
      This message was sent automatically by MyPetID. If you weren''t expecting this email, you can safely ignore it.<br />
      Need help? Contact us at <a href="mailto:support@mypetid.vercel.app" style="color: #4F46E5;">support@mypetid.vercel.app</a>
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

-- Update the function comment
COMMENT ON FUNCTION public.send_welcome_email_direct IS 'Sends a welcome email directly via Postmark API using pg_net with updated template';
