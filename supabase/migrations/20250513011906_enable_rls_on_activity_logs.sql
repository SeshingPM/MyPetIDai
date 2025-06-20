-- Enable Row Level Security (RLS) on public.activity_logs
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own activity logs
CREATE POLICY "Users can view their own activity logs"
ON public.activity_logs
FOR SELECT
USING (auth.uid() = user_id); -- Assumes user_id column links to auth.users.id

-- Policy: Allow service_role to perform all actions (if needed for admin/backend)
-- Adjust as necessary for your security model. If logs are only inserted by triggers
-- or specific backend functions, you might not need a broad service_role policy for INSERT/UPDATE/DELETE.
CREATE POLICY "Service role has full access to activity logs"
ON public.activity_logs
FOR ALL -- Or be more specific: FOR SELECT, INSERT, UPDATE, DELETE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- IMPORTANT: Review if any other roles (e.g., 'authenticated' for general insert if applicable,
-- or specific function roles) need INSERT permissions. 
-- Typically, direct INSERT by users might not be desired for logs.

COMMENT ON TABLE public.activity_logs IS 'RLS enabled. Users can view their own logs. Service role has full access.';
