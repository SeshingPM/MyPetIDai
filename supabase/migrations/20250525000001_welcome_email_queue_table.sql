-- Create welcome email queue table
CREATE TABLE IF NOT EXISTS public.welcome_email_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  registration_completed_at TIMESTAMPTZ NOT NULL,
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add indexes for query performance
CREATE INDEX IF NOT EXISTS welcome_email_queue_user_id_idx ON public.welcome_email_queue(user_id);
CREATE INDEX IF NOT EXISTS welcome_email_queue_registration_completed_at_idx ON public.welcome_email_queue(registration_completed_at);
CREATE INDEX IF NOT EXISTS welcome_email_queue_email_sent_idx ON public.welcome_email_queue(email_sent);

-- Add RLS policies for security
ALTER TABLE public.welcome_email_queue ENABLE ROW LEVEL SECURITY;

-- Only allow service roles to access this table
CREATE POLICY "Service roles can manage welcome_email_queue"
  ON public.welcome_email_queue
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Add comment to table
COMMENT ON TABLE public.welcome_email_queue IS 'Queue for sending welcome emails 1 hour after checkout completion';
