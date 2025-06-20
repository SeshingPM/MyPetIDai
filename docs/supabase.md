# Supabase Implementation Reference

This document provides a concise reference to the Supabase implementation in the PetDocument project. It focuses on pointing to the actual code files rather than duplicating content.

## Table of Contents

1. [Database Schema](#database-schema)
2. [Edge Functions](#edge-functions)
3. [Client Implementation](#client-implementation)
4. [Storage Configuration](#storage-configuration)
5. [Environment Management](#environment-management)

## Database Schema

The database schema is defined through migration files in the `supabase/migrations/` directory.

### Core Tables

- **pets**: User's pet information
  - Definition: [`20250322000001_pets_table.sql`](../supabase/migrations/20250322000001_pets_table.sql)
  - Purpose: Stores information about users' pets

- **documents**: Pet-related document storage
  - Definition: [`20250322000002_documents_table.sql`](../supabase/migrations/20250322000002_documents_table.sql)
  - Purpose: Stores information about pet-related documents

- **document_emails**: Document sharing tracking
  - Definition: [`20250322000003_document_emails_table.sql`](../supabase/migrations/20250322000003_document_emails_table.sql)
  - Purpose: Tracks emails sent for document sharing

### Health Records

- **health_records**: Pet health information
  - Definition: [`20250322000004_health_records_table.sql`](../supabase/migrations/20250322000004_health_records_table.sql)
  - Purpose: Stores basic health information for pets

- **medications**: Pet medication tracking
  - Definition: [`20250322000005_medications_table.sql`](../supabase/migrations/20250322000005_medications_table.sql)
  - Purpose: Tracks medications for pets

- **vaccinations**: Pet vaccination records
  - Definition: [`20250322000006_vaccinations_table.sql`](../supabase/migrations/20250322000006_vaccinations_table.sql)
  - Purpose: Tracks vaccinations for pets

- **medical_events**: Pet medical event tracking
  - Definition: [`20250322000007_medical_events_table.sql`](../supabase/migrations/20250322000007_medical_events_table.sql)
  - Purpose: Tracks medical events for pets

### User-Related Tables

- **profiles**: User profile information
  - Definition: [`20250322000010_profiles_table.sql`](../supabase/migrations/20250322000010_profiles_table.sql)
  - Purpose: Stores additional user profile information

- **user_preferences**: User application settings
  - Definition: [`20250322000009_user_preferences_table.sql`](../supabase/migrations/20250322000009_user_preferences_table.sql)
  - Purpose: Stores user preferences for the application

- **reminders**: Pet event reminders
  - Definition: [`20250322000008_reminders_table.sql`](../supabase/migrations/20250322000008_reminders_table.sql)
  - Purpose: Stores reminders for pet-related events

### Media Tables

- **photos**: Pet photo storage
  - Definition: [`20250322000011_photos_table.sql`](../supabase/migrations/20250322000011_photos_table.sql)
  - Purpose: Stores photos related to pets

### Subscription Tables

- **subscriptions**: User subscription tracking
  - Definition: [`20250322000012_subscriptions_table.sql`](../supabase/migrations/20250322000012_subscriptions_table.sql)
  - Purpose: Tracks user subscriptions

- **subscription_payments**: Payment tracking
  - Definition: [`20250322000014_subscription_payments_table.sql`](../supabase/migrations/20250322000014_subscription_payments_table.sql)
  - Purpose: Tracks payments for subscriptions

- **webhook_logs**: Stripe webhook logging
  - Definition: [`20250322000013_webhook_logs_table.sql`](../supabase/migrations/20250322000013_webhook_logs_table.sql)
  - Purpose: Logs Stripe webhook events for debugging

### Security Policies

- **Row-Level Security (RLS)**: Access control policies
  - Implementation: Found within each table migration file
  - Additional policies: [`20250322000015_storage_policies.sql`](../supabase/migrations/20250322000015_storage_policies.sql)

### Database Functions and Triggers

- **User Triggers**: User-related automation
  - Implementation: [`20250323000001_user_triggers.sql`](../supabase/migrations/20250323000001_user_triggers.sql)

- **Auth Functions**: Authentication helpers
  - Implementation: [`20250323000002_auth_functions.sql`](../supabase/migrations/20250323000002_auth_functions.sql)

- **Subscription Helpers**: Subscription management
  - Implementation: [`20250323000003_subscription_helpers.sql`](../supabase/migrations/20250323000003_subscription_helpers.sql)

## Edge Functions

Serverless functions running on Deno, located in `supabase/functions/`.

### Available Functions

- **create-checkout-session**: Stripe checkout session creation
  - Implementation: [`supabase/functions/create-checkout-session/index.ts`](../supabase/functions/create-checkout-session/index.ts)
  - Purpose: Creates Stripe checkout sessions for subscription purchases

- **stripe-webhook**: Stripe event handler
  - Implementation: [`supabase/functions/stripe-webhook/index.ts`](../supabase/functions/stripe-webhook/index.ts)
  - Purpose: Processes webhook events from Stripe for subscription management

- **get-stripe-data**: Stripe product information
  - Implementation: [`supabase/functions/get-stripe-data/index.ts`](../supabase/functions/get-stripe-data/index.ts)
  - Purpose: Retrieves Stripe product and pricing information for the frontend

- **send-contact-email**: Contact form handler
  - Implementation: [`supabase/functions/send-contact-email/index.ts`](../supabase/functions/send-contact-email/index.ts)
  - Purpose: Processes contact form submissions

- **send-feedback**: Feedback submission handler
  - Implementation: [`supabase/functions/send-feedback/index.ts`](../supabase/functions/send-feedback/index.ts)
  - Purpose: Handles user feedback submissions

- **send-reminder-emails**: Automated notifications
  - Implementation: [`supabase/functions/send-reminder-emails/index.ts`](../supabase/functions/send-reminder-emails/index.ts)
  - Purpose: Sends email notifications for upcoming pet reminders

### Environment Configuration

- **Function Environment Variables**:
  - Local development: [`supabase/functions/.env`](../supabase/functions/.env)
  - Test environment: [`supabase/functions/.env.test`](../supabase/functions/.env.test)
  - Production environment: [`supabase/functions/.env.prod`](../supabase/functions/.env.prod)

## Client Implementation

The Supabase client configuration and usage patterns.

### Client Configuration

- **Client Setup**: [`src/integrations/supabase/client.ts`](../src/integrations/supabase/client.ts)
  - Configures authentication, error handling, and global options

### Type Definitions

- **Database Types**: [`src/integrations/supabase/types.ts`](../src/integrations/supabase/types.ts)
  - TypeScript types for database tables and operations

### Authentication

- **Auth Context**: [`src/contexts/AuthContext.tsx`](../src/contexts/AuthContext.tsx)
  - Manages authentication state and user sessions

### API Usage

- **Document Operations**: [`src/utils/document-api.ts`](../src/utils/document-api.ts)
  - Document CRUD operations using Supabase client

- **Document Sharing**: [`src/utils/document-sharing.ts`](../src/utils/document-sharing.ts)
  - Document sharing functionality

## Storage Configuration

Supabase Storage configuration for file storage.

### Storage Buckets

- **Pet Photos Bucket**: 
  - Creation: [`20250323000004_create_storage_buckets.sql`](../supabase/migrations/20250323000004_create_storage_buckets.sql)
  - Purpose: Stores pet photos

- **Documents Bucket**:
  - Creation: [`20250323000005_create_documents_bucket.sql`](../supabase/migrations/20250323000005_create_documents_bucket.sql)
  - Purpose: Stores pet-related documents

### Access Control

- **Storage Policies**:
  - Implementation: [`20250322000015_storage_policies.sql`](../supabase/migrations/20250322000015_storage_policies.sql)
  - Purpose: Controls access to storage buckets

### Client Usage

- **Photo Upload**: [`src/hooks/usePhotoUpload.ts`](../src/hooks/usePhotoUpload.ts)
  - Handles photo uploads to Supabase storage

- **Document Operations**: [`src/hooks/useDocumentOperations.ts`](../src/hooks/useDocumentOperations.ts)
  - Handles document uploads and management

## Environment Management

Environment configuration and management.

### Configuration Files

- **Local Environment**: [`supabase/config.toml`](../supabase/config.toml)
  - Local development configuration

- **Test Environment**: [`supabase/config.test.toml`](../supabase/config.test.toml)
  - Test environment configuration

- **Production Environment**: [`supabase/config.prod.toml`](../supabase/config.prod.toml)
  - Production environment configuration

### Environment Variables

- **Frontend Environment**:
  - Template: [`.env.example`](../.env.example)
  - Local development: [`.env.local.example`](../.env.local.example)
  - Production: [`.env.production`](../.env.production)
  - Test: [`.env.test`](../.env.test)

- **Edge Function Environment**:
  - Local development: [`supabase/functions/.env`](../supabase/functions/.env)
  - Test environment: [`supabase/functions/.env.test`](../supabase/functions/.env.test)
  - Production environment: [`supabase/functions/.env.prod`](../supabase/functions/.env.prod)

### Environment Configuration

- **Frontend Config**: [`src/config/env.ts`](../src/config/env.ts)
  - Loads and validates environment variables