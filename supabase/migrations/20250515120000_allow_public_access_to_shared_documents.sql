-- Migration: 20250515120000_allow_public_access_to_shared_documents.sql
-- Description: Adds RLS policy to allow public access to shared documents

-- Create policy to allow anyone to access shared documents
-- This enables unauthenticated users to view documents shared with them
-- But only if the document has a share_id and hasn't expired
CREATE POLICY "Allow public access to shared documents" 
ON public.documents
FOR SELECT
USING (
  share_id IS NOT NULL AND 
  share_expiry > NOW()
);

-- Add comment explaining the policy
COMMENT ON POLICY "Allow public access to shared documents" ON public.documents IS 
'Allows unauthenticated access to documents that have been explicitly shared and have not expired'; 