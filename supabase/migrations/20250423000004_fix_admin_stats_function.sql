
-- Remove existing admin stats functions that are conflicting
DROP FUNCTION IF EXISTS public.get_admin_stats();

-- Create a consolidated admin stats function that includes the period parameter
CREATE OR REPLACE FUNCTION public.get_admin_stats(period_days integer DEFAULT 7)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'isAdmin' = 'true'
  ) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'total_pets', (SELECT COUNT(*) FROM pets),
    'recent_signups', (
      SELECT COUNT(*) FROM auth.users 
      WHERE created_at >= NOW() - INTERVAL '1 day' * period_days
    ),
    'recent_activities', (
      SELECT COALESCE(
        json_agg(
          json_build_object(
            'id', id,
            'user_id', user_id,
            'action', action,
            'created_at', created_at,
            'entity_type', entity_type,
            'entity_id', entity_id
          )
        ),
        '[]'::json
      )
      FROM (
        SELECT id, user_id, action, created_at, entity_type, entity_id
        FROM user_activities
        WHERE created_at >= NOW() - INTERVAL '1 day' * period_days
        ORDER BY created_at DESC
        LIMIT 10
      ) recent
    )
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.get_admin_stats(integer) TO authenticated;

-- Check for user_activities table and create if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_activities') THEN
    CREATE TABLE public.user_activities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      action TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      entity_type TEXT,
      entity_id TEXT
    );
    
    -- Add RLS policies
    ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Admins can read all activities" 
      ON public.user_activities 
      FOR SELECT 
      USING (
        EXISTS (
          SELECT 1 FROM auth.users 
          WHERE id = auth.uid() 
          AND raw_user_meta_data->>'isAdmin' = 'true'
        )
      );
      
    CREATE POLICY "Users can read their own activities" 
      ON public.user_activities 
      FOR SELECT 
      USING (auth.uid() = user_id);
      
    CREATE POLICY "Users can insert their own activities" 
      ON public.user_activities 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;
