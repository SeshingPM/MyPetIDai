-- Migration: 20250322000003_document_emails_table.sql
-- Description: Creates the document_emails table and sets up RLS policies

-- Create document_emails table
CREATE TABLE public.document_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  sender_id UUID REFERENCES auth.users(id),
  sent_at TIMESTAMPTZ,
  status TEXT,
  subject TEXT NOT NULL,
  message TEXT
);

-- Enable RLS on document_emails table
ALTER TABLE public.document_emails ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for document_emails table
CREATE POLICY "Users can view their own email history" 
  ON public.document_emails 
  FOR SELECT 
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can send emails" 
  ON public.document_emails 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);