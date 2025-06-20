# Database Schema

This document provides a visual representation of the database schema for the Pet Document application.

## Complete Database Schema

```mermaid
erDiagram
    auth_users {
        uuid id PK
        string email
        string encrypted_password
        timestamp created_at
    }
    
    profiles {
        uuid id PK,FK
        string full_name
        string avatar_url
        array custom_categories
        timestamp created_at
        timestamp updated_at
        integer referral_points
    }
    
    pets {
        uuid id PK
        uuid user_id FK
        string name
        string breed
        integer age
        string photo_url
        boolean archived
        timestamp created_at
        timestamp updated_at
    }
    
    documents {
        uuid id PK
        string name
        string file_url
        string file_type
        string category
        timestamp created_at
        uuid user_id FK
        uuid pet_id FK
        string share_id
        timestamp share_expiry
        boolean is_favorite
        boolean archived
    }
    
    health_records {
        uuid id PK
        uuid pet_id FK
        uuid user_id FK
        timestamp record_date
        numeric weight
        string notes
        timestamp created_at
    }
    
    vaccinations {
        uuid id PK
        uuid pet_id FK
        uuid user_id FK
        string name
        timestamp date_administered
        timestamp expiration_date
        string administrator
        string batch_number
        string notes
        timestamp created_at
    }
    
    medications {
        uuid id PK
        uuid pet_id FK
        uuid user_id FK
        string name
        string dosage
        string frequency
        timestamp start_date
        timestamp end_date
        string notes
        timestamp created_at
    }
    
    medical_events {
        uuid id PK
        uuid pet_id FK
        uuid user_id FK
        string event_type
        timestamp event_date
        string provider
        string diagnosis
        string treatment
        string notes
        timestamp created_at
    }
    
    reminders {
        uuid id PK
        uuid user_id FK
        uuid pet_id FK
        string pet_name
        string title
        string notes
        timestamp date
        boolean archived
        boolean notification_sent
        string custom_time
        timestamp created_at
    }
    
    photos {
        uuid id PK
        uuid user_id FK
        uuid pet_id FK
        string url
        string caption
        timestamp created_at
    }
    
    subscriptions {
        uuid id PK
        uuid user_id FK
        string stripe_customer_id
        string stripe_subscription_id
        string plan_id
        string plan_type
        string status
        timestamp current_period_start
        timestamp current_period_end
        boolean cancel_at_period_end
        timestamp created_at
        timestamp updated_at
    }
    
    subscription_payments {
        uuid id PK
        uuid subscription_id FK
        string payment_intent_id
        numeric amount
        string currency
        string status
        timestamp created_at
    }
    
    user_preferences {
        uuid user_id PK,FK
        boolean email_notifications
        integer reminder_advance_notice
        time reminder_time
        timestamp created_at
        timestamp updated_at
    }
    
    referral_codes {
        uuid id PK
        uuid user_id FK
        string code
        timestamp created_at
        string unique_code
        integer used_count
        boolean is_active
    }
    
    referrals {
        uuid id PK
        uuid referrer_id FK
        uuid referred_user_id FK
        timestamp created_at
    }
    
    profile_completion {
        uuid id PK,FK
        boolean has_pet
        boolean has_pet_photo
        boolean has_document
        integer completion_percentage
        timestamp last_updated
        timestamp created_at
    }
    
    webhook_logs {
        uuid id PK
        string webhook_type
        string event_type
        jsonb payload
        boolean processed
        string error_message
        timestamp created_at
    }
    
    document_emails {
        uuid id PK
        uuid document_id FK
        uuid user_id FK
        string recipient_email
        string access_code
        timestamp expiry_date
        boolean accessed
        timestamp accessed_at
        timestamp created_at
    }

    auth_users ||--|| profiles : has
    auth_users ||--|| profile_completion : has
    auth_users ||--|| user_preferences : has
    auth_users ||--o{ pets : owns
    auth_users ||--o{ documents : owns
    auth_users ||--o{ subscriptions : has
    auth_users ||--o{ referral_codes : has
    
    pets ||--o{ health_records : has
    pets ||--o{ vaccinations : has
    pets ||--o{ medications : has
    pets ||--o{ medical_events : has
    pets ||--o{ reminders : has
    pets ||--o{ photos : has
    pets ||--o{ documents : linked_to
    
    documents ||--o{ document_emails : has
    
    subscriptions ||--o{ subscription_payments : has
    
    auth_users ||--o{ referrals : refers_as_referrer
    auth_users ||--o{ referrals : referred_as_user
```

## Key Relationships

- **Users (auth_users)** are at the center, connected to profiles, pets, documents, and subscriptions
- **Pets** are connected to health records, vaccinations, medications, medical events, reminders, and photos
- **Documents** can be linked to pets and have document emails
- The **referral system** connects users through referrals and referral codes
- **Subscriptions** track user payment status and have associated payments

## Table Descriptions

### User Management
- **auth_users**: Supabase built-in authentication table
- **profiles**: User profile information
- **user_preferences**: User settings for notifications and reminders
- **profile_completion**: Tracks user onboarding progress

### Pet Management
- **pets**: Basic pet information
- **health_records**: Pet health tracking
- **vaccinations**: Pet vaccination records
- **medications**: Pet medication tracking
- **medical_events**: Vet visits and other medical events
- **photos**: Pet photo gallery

### Document Management
- **documents**: Pet-related documents (medical records, certificates, etc.)
- **document_emails**: Tracks document sharing via email

### Subscription & Payment
- **subscriptions**: User subscription status
- **subscription_payments**: Payment history
- **webhook_logs**: Stripe webhook event logs

### Referral System
- **referral_codes**: User referral codes
- **referrals**: Tracks successful referrals