-- Migration: 20250323000004_create_storage_buckets.sql
-- Description: Creates required storage buckets for the application

-- Create the pet-photos bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('pet-photos', 'pet-photos', false, false, 5242880, '{image/jpeg,image/png,image/webp}')
ON CONFLICT (id) DO NOTHING;

-- Note: Policies for this bucket are created in 20250322000015_storage_policies.sql