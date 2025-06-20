-- Migration: 20250323000005_create_documents_bucket.sql
-- Description: Creates documents storage bucket for the application

-- Create the documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('documents', 'documents', false, false, 10485760, '{image/jpeg,image/png,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document}')
ON CONFLICT (id) DO NOTHING;

-- Create policies for the documents bucket
DO $$
BEGIN
    -- Create upload policy
    CREATE POLICY "Allow users to upload their own documents" 
        ON storage.objects 
        FOR INSERT 
        TO authenticated 
        WITH CHECK (bucket_id = 'documents'::text);

    -- Create read policy
    CREATE POLICY "Allow users to view their own documents" 
        ON storage.objects 
        FOR SELECT 
        TO authenticated 
        USING (bucket_id = 'documents'::text);
        
    -- Create update policy
    CREATE POLICY "Allow users to update their own documents" 
        ON storage.objects 
        FOR UPDATE 
        TO authenticated 
        USING (bucket_id = 'documents'::text);
        
    -- Create delete policy
    CREATE POLICY "Allow users to delete their own documents" 
        ON storage.objects 
        FOR DELETE 
        TO authenticated 
        USING (bucket_id = 'documents'::text);
END
$$;