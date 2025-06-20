# Supabase Migrations

This directory contains database migrations for the MyPetID application.

## Migration Naming Convention

Migrations follow a timestamp-based naming convention:

```
YYYYMMDDHHMMSS_descriptive_name.sql
```

For example: `20250322000001_pets_table.sql`

## Migration Organization

Each migration file is focused on a single table or related set of operations:

1. **Table Migrations**: One file per table that includes:
   - Table creation
   - Indexes for that table
   - RLS policies for that table
   - Any alterations or constraints

2. **Storage Policies**: Separate file for storage bucket policies

## Migration Order

Migrations are executed in order based on their timestamp prefix. The current migrations are:

1. `20250322000001_pets_table.sql` - Creates the pets table and its RLS policies
2. `20250322000002_documents_table.sql` - Creates the documents table with indexes and RLS policies
3. `20250322000003_document_emails_table.sql` - Creates the document_emails table and RLS policies
4. `20250322000004_health_records_table.sql` - Creates the health_records table and RLS policies
5. `20250322000005_medications_table.sql` - Creates the medications table and RLS policies
6. `20250322000006_vaccinations_table.sql` - Creates the vaccinations table and RLS policies
7. `20250322000007_medical_events_table.sql` - Creates the medical_events table with constraints and RLS policies
8. `20250322000008_reminders_table.sql` - Creates the reminders table with additional columns and RLS policies
9. `20250322000009_user_preferences_table.sql` - Creates the user_preferences table with alterations and RLS policies
10. `20250322000010_profiles_table.sql` - Creates the profiles table and RLS policies
11. `20250322000011_photos_table.sql` - Creates the photos table and RLS policies
12. `20250322000013_webhook_logs_table.sql` - Creates the webhook_logs table with indexes and RLS policies
13. `20250322000015_storage_policies.sql` - Updates storage policies for pet photos

## Utility Scripts

Utility scripts that are not migrations are stored in the `/supabase/scripts/` directory:

- `check_users_and_pets.sql` - Diagnostic script to check users and pets tables