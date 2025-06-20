-- Migration: 20250611000001_update_admin_stats.sql
-- Description: Updates admin stats functions to work without subscription tables

-- Remove existing admin stats functions that are conflicting
DROP FUNCTION IF EXISTS public.get_admin_stats();
DROP FUNCTION IF EXISTS public.get_admin_stats(integer);

-- Create a consolidated admin stats function that includes the period parameter
-- without any subscription references
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
    'total_documents', (SELECT COUNT(*) FROM documents),
    'recent_signups', (
      SELECT COUNT(*) FROM auth.users 
      WHERE created_at >= NOW() - INTERVAL '1 day' * period_days
    ),
    'recent_pets_created', (
      SELECT COUNT(*) FROM pets
      WHERE created_at >= NOW() - INTERVAL '1 day' * period_days
    ),
    'recent_documents_created', (
      SELECT COUNT(*) FROM documents
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
