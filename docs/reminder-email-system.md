# Reminder Email System Documentation

## Overview

The PetDocument reminder email system automatically sends email notifications to users for their upcoming pet-related reminders. The system consists of:

1. A Supabase Edge Function (`send-reminder-emails`) that processes and sends reminder emails
2. A PostgreSQL cron job that triggers this function at regular intervals
3. Postmark integration for reliable email delivery
4. User preferences for controlling notification settings

```mermaid
graph TD
    A[PostgreSQL Cron Job] -->|Triggers at scheduled times| B[send-reminder-emails Function]
    B -->|Fetches reminders| C[Supabase Database]
    B -->|Sends emails| D[Postmark API]
    B -->|Updates reminder status| C
    E[User] -->|Sets preferences| F[User Preferences]
    F -->|Controls| B
```

## Implementation Details

### Components

1. **Database Tables**:
   - `reminders`: Stores reminder data with a `notification_sent` boolean field
   - `user_preferences`: Stores user email notification settings

2. **Edge Function**:
   - `send-reminder-emails`: Processes pending reminders and sends emails

3. **Scheduler**:
   - PostgreSQL `pg_cron` extension: Schedules the function execution
   - PostgreSQL `pg_net` extension: Makes HTTP calls to the function

### Function Logic

The `send-reminder-emails` function:
1. Fetches users with email notifications enabled
2. For each user, retrieves pending reminders
3. Sends email notifications via Postmark
4. Updates reminders to mark them as notified

## Deployment Instructions

### Environment Variables

The following environment variables must be set in your Supabase project for the reminder email system to function properly:

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTMARK_API_TOKEN` | API token for Postmark |
| `SUPABASE_URL` | URL of your Supabase project | `https://your-project-ref.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for database operations | `eyJxxxxxxxxxxxxxxxxxxxxxxxx` |
| `SUPABASE_ANON_KEY` | Anonymous key for public operations | `eyJxxxxxxxxxxxxxxxxxxxxxxxx` |
| `DEFAULT_FROM_EMAIL` | Default sender email address | `support@petdocument.com` |

To set these variables:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the URL and keys
4. Go to Settings > Functions
5. Add the environment variables

### Prerequisites

- Supabase project with database access
- Admin access to enable PostgreSQL extensions
- Postmark API token configured in environment variables

### Step 1: Deploy the Edge Function

1. Ensure the `send-reminder-emails` function is deployed:

```bash
cd supabase/functions
supabase functions deploy send-reminder-emails --project-ref your-project-ref
```

2. Verify the function is working by manually invoking it:

```bash
curl -X POST 'https://your-project-ref.supabase.co/functions/v1/send-reminder-emails' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json'
```

### Step 2: Enable and Configure pg_cron

1. Connect to your Supabase database using the SQL Editor.

2. Enable the required extensions:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

3. Verify pg_cron is properly installed:

```sql
-- Check if pg_cron is available
SELECT * FROM pg_extension WHERE extname = 'pg_cron';
```

4. Configure pg_cron settings (if needed):

```sql
-- Optional: Configure pg_cron to use a specific database
ALTER SYSTEM SET cron.database_name = 'postgres';

-- Optional: Set the maximum number of concurrent jobs
ALTER SYSTEM SET cron.max_running_jobs = 5;

-- Apply the configuration changes
SELECT pg_reload_conf();
```

5. Verify pg_cron is running:

```sql
-- Check if the pg_cron background worker is running
SELECT * FROM pg_stat_activity WHERE application_name = 'pg_cron';
```

> **Note**: In Supabase, pg_cron runs in the same database as your application data. Make sure your database has sufficient resources to handle both your application workload and the scheduled jobs.

### Step 3: Store Credentials in Vault

Store your project URL and API key securely:

```sql
-- Store credentials securely in Supabase Vault
SELECT vault.create_secret('project_url', 'https://your-project-ref.supabase.co');
SELECT vault.create_secret('supabase_anon_key', 'YOUR_SUPABASE_ANON_KEY');
```

### Step 4: Create the Cron Job

Set up a cron job to run hourly (or at your preferred interval):

```sql
-- Create a cron job to run every hour
SELECT cron.schedule(
  'send-reminder-emails-hourly',  -- Job name
  '0 * * * *',                    -- Cron expression (hourly)
  'SELECT net.http_post(
    (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''project_url'') || ''/functions/v1/send-reminder-emails'',
    jsonb_build_object(''timestamp'', now()),
    ''{}'',
    jsonb_build_object(
      ''Authorization'', ''Bearer '' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''supabase_anon_key''),
      ''Content-Type'', ''application/json''
    )
  ) as request_id;'
);
```

### Step 5: Test the Cron Job

After setting up the cron job, you should test it to ensure it's working correctly:

1. Manually trigger the job to verify it works:

```sql
-- Manually run the job
SELECT cron.job_run((SELECT jobid FROM cron.job WHERE jobname = 'send-reminder-emails-hourly'));
```

2. Check the job run details to see if it executed successfully:

```sql
-- Check the job run details
SELECT * FROM cron.job_run_details
WHERE jobname = 'send-reminder-emails-hourly'
ORDER BY start_time DESC LIMIT 1;
```

3. Verify the Edge Function logs in the Supabase dashboard to confirm the function was called.

### Step 6: Verify Deployment

1. Check that the cron job is scheduled:

```sql
SELECT * FROM cron.job;
```

2. Wait for the next scheduled execution and check the logs in the Supabase dashboard.

## Maintenance Procedures

### Monitoring

1. **Function Logs**:
   - Regularly check the Supabase Edge Function logs in the Supabase dashboard
   - Look for errors or warnings related to the `send-reminder-emails` function

2. **Cron Job Status**:
   - Check the status of the cron job:
   ```sql
   SELECT * FROM cron.job_run_details WHERE jobname = 'send-reminder-emails-hourly' ORDER BY start_time DESC LIMIT 10;
   ```

3. **Email Delivery**:
   - Monitor Postmark dashboard for email delivery statistics
   - Set up Postmark alerts for bounces or delivery issues

### Updating the Schedule

To change the frequency of reminder emails:

```sql
-- Update the existing cron job
SELECT cron.alter_job(
  job_id := (SELECT jobid FROM cron.job WHERE jobname = 'send-reminder-emails-hourly'),
  schedule := '0 */2 * * *'  -- Example: Run every 2 hours
);
```

### Pausing the System

If you need to temporarily disable reminder emails:

```sql
-- Pause the cron job
SELECT cron.unschedule(
  (SELECT jobid FROM cron.job WHERE jobname = 'send-reminder-emails-hourly')
);
```

To resume:

```sql
-- Resume the cron job with the same schedule
SELECT cron.schedule(
  'send-reminder-emails-hourly',
  '0 * * * *',
  'SELECT net.http_post(
    (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''project_url'') || ''/functions/v1/send-reminder-emails'',
    jsonb_build_object(''timestamp'', now()),
    ''{}'',
    jsonb_build_object(
      ''Authorization'', ''Bearer '' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = ''supabase_anon_key''),
      ''Content-Type'', ''application/json''
    )
  ) as request_id;'
);
```

## Troubleshooting

### Common Issues

1. **Emails Not Being Sent**:
   - Check the Edge Function logs for errors
   - Verify Postmark API token is correctly set in environment variables
   - Ensure users have email notifications enabled in preferences

2. **Cron Job Not Running**:
   - Verify the cron job is scheduled:
   ```sql
   SELECT * FROM cron.job WHERE jobname = 'send-reminder-emails-hourly';
   ```
   - Check for errors in the job run details:
   ```sql
   SELECT * FROM cron.job_run_details WHERE jobname = 'send-reminder-emails-hourly' ORDER BY start_time DESC LIMIT 1;
   ```

3. **Function Timing Out**:
   - If processing many reminders, consider batching the processing
   - Optimize database queries in the function

### Debugging

1. **Manual Function Invocation**:
   - Test the function directly:
   ```bash
   curl -X POST 'https://your-project-ref.supabase.co/functions/v1/send-reminder-emails' \
     -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
     -H 'Content-Type: application/json'
   ```

2. **Database Validation**:
   - Check for pending reminders:
   ```sql
   SELECT COUNT(*) FROM reminders WHERE notification_sent = false AND date > NOW();
   ```
   - Verify user preferences:
   ```sql
   SELECT COUNT(*) FROM user_preferences WHERE email_notifications = true;
   ```

## Security Considerations

1. **API Key Protection**:
   - Use the Supabase service role token for authentication between the cron job and the edge function
   - The service role token has the necessary permissions to access the function and the database
   - In production, store this token securely and rotate it periodically

2. **Function Access**:
   - Ensure the function validates JWT tokens for user-specific operations
   - Implement proper error handling to avoid leaking sensitive information

3. **Email Content**:
   - Do not include sensitive personal information in emails
   - Use generic links that require authentication to view full details

## Performance Optimization

1. **Batch Processing**:
   - If the number of reminders grows large, implement batch processing
   - Consider adding a limit to the number of reminders processed per run

2. **Indexing**:
   - Ensure proper indexes on the `reminders` table:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_reminders_notification ON reminders(notification_sent, date);
   CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
   ```

3. **Caching**:
   - Consider caching user preferences to reduce database load

## Future Enhancements

1. **Retry Mechanism**:
   - Implement a retry system for failed email deliveries

2. **Notification Templates**:
   - Create customizable email templates in Postmark

3. **Delivery Analytics**:
   - Track open rates and engagement with reminder emails

4. **Multi-channel Notifications**:
   - Extend the system to support SMS or push notifications

## Migration Implementation

To implement all the required components as a single migration file, you can create a SQL migration that combines all the steps described above. This approach ensures that all necessary components are set up in the correct order and with proper dependencies.

### Migration File Example

Create a new file in the `supabase/migrations` directory with a name like `20250405000001_setup_reminder_cron_job.sql`:

```sql
-- Migration: 20250405000001_setup_reminder_cron_job.sql
-- Description: Sets up pg_cron and pg_net extensions and configures a cron job for reminder emails

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS vault;

-- Store credentials securely in Supabase Vault
-- Replace 'your-project-ref' with your actual Supabase project reference
SELECT vault.create_secret(
  'project_url',
  'https://your-project-ref.supabase.co'
);

-- Replace 'your-anon-key' with your actual Supabase anon key
SELECT vault.create_secret(
  'supabase_anon_key',
  'your-anon-key'
);

-- Create a cron job to run hourly
-- This job will trigger the send-reminder-emails function
SELECT cron.schedule(
  'send-reminder-emails-hourly',  -- Job name
  '0 * * * *',                    -- Cron expression (hourly at minute 0)
  $$
  SELECT net.http_post(
    (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'project_url') || '/functions/v1/send-reminder-emails',
    jsonb_build_object('timestamp', now())::text,
    'application/json',
    jsonb_build_object(
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_anon_key')
    )
  ) as request_id;
  $$
);

-- Create an index to optimize reminder queries
CREATE INDEX IF NOT EXISTS idx_reminders_notification ON reminders(notification_sent, date);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);

-- Log that the migration was successful
DO $$
BEGIN
  RAISE NOTICE 'Reminder email cron job has been set up successfully';
END $$;
```

### Applying the Migration

1. Save the file in the `supabase/migrations` directory.

2. Replace the placeholder values with your actual Supabase project reference and anon key.

3. Apply the migration using the Supabase CLI:
   ```bash
   supabase migration up
   ```

4. Verify that all components were set up correctly:
   ```sql
   -- Check extensions
   SELECT * FROM pg_extension WHERE extname IN ('pg_cron', 'pg_net', 'vault');
   
   -- Check vault secrets
   SELECT * FROM vault.decrypted_secrets;
   
   -- Check cron job
   SELECT * FROM cron.job WHERE jobname = 'send-reminder-emails-hourly';
   ```

### Authentication Between Cron Job and Edge Function

The system uses the Supabase service role token for authentication between the PostgreSQL cron job and the Edge Function:

1. **How it works**:
   - The service role token has the necessary permissions to access the function and the database
   - The cron job includes this token in the Authorization header when calling the function
   - The function validates the JWT token using Supabase's built-in authentication
   - This approach leverages Supabase's security model without requiring custom authentication logic

2. **Implementation**:
   - In the Edge Function:
   ```typescript
   // Standard JWT validation using Supabase's auth system
   const { valid, error } = await validateToken(req);
   if (!valid) {
     return createErrorResponse(error || "Unauthorized", null, 401);
   }
   ```

   - In the cron job SQL:
   ```sql
   SELECT net.http_post(
     'http://localhost:54321/functions/v1/send-reminder-emails',
     jsonb_build_object('timestamp', now()),
     '{}'::jsonb,
     jsonb_build_object(
       'Authorization', 'Bearer ---',
       'Content-Type', 'application/json'
     )
   ) as request_id;
   ```

3. **Security best practices**:
   - Use different service role tokens for each environment (development, staging, production)
   - Store the service role token securely (e.g., in environment variables or a secrets manager)
   - Limit the permissions of the service role if possible
   - Monitor for unauthorized access attempts

### Security Note
The migration file contains sensitive information (the service role token). After applying the migration:

1. Consider removing or securing the migration file to prevent unauthorized access.
2. In production environments, use a more secure method to inject these secrets, such as:
   - Environment variables
   - A dedicated secrets management service
   - Manual setup of the vault secrets by an administrator