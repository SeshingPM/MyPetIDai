-- Migration: 20250322000015_storage_policies.sql
-- Description: Updates storage policies for pet photos

-- Update storage policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can upload files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can access their own files" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
    
    -- Create new policies
    CREATE POLICY "Allow users to upload their own pet photos" 
        ON storage.objects 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (bucket_id = 'pet-photos'::text);

    CREATE POLICY "Allow public to view pet photos" 
        ON storage.objects 
        FOR SELECT 
        USING (bucket_id = 'pet-photos'::text);
END
$$;