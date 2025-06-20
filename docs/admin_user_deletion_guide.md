# Admin Guide: Safely Deleting a User and Associated Data

This guide provides instructions and the SQL script necessary to completely delete a user and all their associated data from the database. 

**IMPORTANT: This script performs destructive operations. Exercise extreme caution. It is highly recommended to ONLY run this in a test/staging environment or after taking a full database backup if running on production (though direct production execution is discouraged).**

## Pre-requisites & Checks

1.  **Identify Target User:** Know the email address of the user you intend to delete.
2.  **Review RLS Policies:** Before running the script, ensure that Row Level Security (RLS) policies, especially on tables like `public.subscription_payments` or any table involved in subqueries, do not interfere with the deletion process or cause type mismatch errors. The script relies on the `service_role` or a superuser to bypass most RLS, but faulty RLS logic (like comparing incorrect data types) can still cause issues.
3.  **Schema Awareness:** This script is based on the database schema as understood at the time of its creation. If the schema has changed (e.g., new tables with foreign keys to `auth.users`, or changes in column names/types like `document_emails.sender_id` or `subscription_payments.subscription_id`), this script **MUST** be updated accordingly. Failure to do so can lead to incomplete deletion or errors.

## User Deletion SQL Script

Modify the `user_email_to_delete` variable in the script before execution.

```sql
DO $$
DECLARE
    user_email_to_delete TEXT := 'user_to_delete@example.com'; -- <<<<<< CHANGE THIS EMAIL
    user_id_to_delete UUID;
    row_count INTEGER;
BEGIN
    RAISE NOTICE 'Attempting to find user with email: %', user_email_to_delete;
    SELECT id INTO user_id_to_delete FROM auth.users WHERE email = user_email_to_delete;

    IF user_id_to_delete IS NULL THEN
        RAISE WARNING 'No user found with email: %. No data will be deleted.', user_email_to_delete;
        RETURN; 
    END IF;

    RAISE NOTICE 'Starting deletion process for user: % (Email: %)', user_id_to_delete, user_email_to_delete;

    -- Section 1: Delete Storage Objects (associated with user_id via 'owner' column)
    RAISE NOTICE 'Deleting from storage.objects (documents bucket) for user: %', user_id_to_delete;
    DELETE FROM storage.objects WHERE owner = user_id_to_delete AND bucket_id = 'documents';

    RAISE NOTICE 'Deleting from storage.objects (pet-photos bucket) for user: %', user_id_to_delete;
    DELETE FROM storage.objects WHERE owner = user_id_to_delete AND bucket_id = 'pet-photos';

    -- Section 2: Delete from dependent public tables
    -- Note: Order can be important if there are inter-table dependencies not handled by ON DELETE CASCADE.

    RAISE NOTICE 'Deleting from public.subscription_payments for user: %', user_id_to_delete;
    DELETE FROM public.subscription_payments sp
    WHERE sp.subscription_id IN (SELECT s.stripe_subscription_id FROM public.subscriptions s WHERE s.user_id = user_id_to_delete); -- Assumes subscription_payments.subscription_id is TEXT

    RAISE NOTICE 'Deleting from public.document_emails for user: %', user_id_to_delete;
    DELETE FROM public.document_emails WHERE sender_id = user_id_to_delete; -- Assumes sender_id is the FK to auth.users

    RAISE NOTICE 'Deleting from public.photos for user: %', user_id_to_delete;
    DELETE FROM public.photos WHERE user_id = user_id_to_delete;
    
    RAISE NOTICE 'Deleting from public.reminders for user: %', user_id_to_delete;
    DELETE FROM public.reminders WHERE user_id = user_id_to_delete;

    RAISE NOTICE 'Deleting from public.medical_events for user: %', user_id_to_delete;
    DELETE FROM public.medical_events WHERE user_id = user_id_to_delete;

    RAISE NOTICE 'Deleting from public.medications for user: %', user_id_to_delete;
    DELETE FROM public.medications WHERE user_id = user_id_to_delete;

    RAISE NOTICE 'Deleting from public.vaccinations for user: %', user_id_to_delete;
    DELETE FROM public.vaccinations WHERE user_id = user_id_to_delete;

    RAISE NOTICE 'Deleting from public.health_records for user: %', user_id_to_delete;
    DELETE FROM public.health_records WHERE user_id = user_id_to_delete;

    RAISE NOTICE 'Deleting from public.documents for user: %', user_id_to_delete;
    DELETE FROM public.documents WHERE user_id = user_id_to_delete;

    RAISE NOTICE 'Deleting from public.pets for user: %', user_id_to_delete;
    DELETE FROM public.pets WHERE user_id = user_id_to_delete;
    
    RAISE NOTICE 'Deleting from public.subscriptions for user: %', user_id_to_delete;
    DELETE FROM public.subscriptions WHERE user_id = user_id_to_delete;

    RAISE NOTICE 'Deleting from public.referral_codes for user: %', user_id_to_delete;
    DELETE FROM public.referral_codes WHERE user_id = user_id_to_delete;

    RAISE NOTICE 'Deleting from public.referrals for user: %', user_id_to_delete;
    DELETE FROM public.referrals WHERE referrer_id = user_id_to_delete OR referred_user_id = user_id_to_delete;

    RAISE NOTICE 'Deleting from public.activity_logs for user: %', user_id_to_delete;
    DELETE FROM public.activity_logs WHERE user_id = user_id_to_delete; 

    -- Section 3: Delete the user from auth.users
    -- This should be the last step for public tables linked directly to auth.users with ON DELETE CASCADE
    -- (e.g., profiles, user_preferences, user_registration_status if they have such cascades).
    RAISE NOTICE 'Attempting to delete user from auth.users: %', user_id_to_delete;
    DELETE FROM auth.users WHERE id = user_id_to_delete;
    GET DIAGNOSTICS row_count = ROW_COUNT;

    IF row_count = 0 THEN
        RAISE WARNING 'User with ID % (Email: %) was targeted but not found in auth.users at the final delete step. This might be okay if other tables were already cleaned.', user_id_to_delete, user_email_to_delete;
    ELSE
        RAISE NOTICE 'Deletion process script successfully completed for user: % (Email: %)', user_id_to_delete, user_email_to_delete;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error during deletion for email % (ID %): SQLSTATE % - %',
            user_email_to_delete, 
            user_id_to_delete::TEXT, 
            SQLSTATE, 
            SQLERRM; 
END $$;
```

## Post-Deletion

1.  **Verification:** After running the script, verify that the user no longer exists in `auth.users` and that their related data in other tables has been removed.
    ```sql
    SELECT * FROM auth.users WHERE email = 'user_to_delete@example.com'; -- <<<<<< CHANGE THIS EMAIL
    -- Check other relevant tables as needed.
    ```
2.  **User Re-signup:** After successful deletion, the user should be able to re-signup with the same email address without issues.

## Maintaining this Script

-   **Schema Changes:** If new tables are added that have a foreign key relationship to `auth.users` (or any other table that is part of this deletion chain), this script **MUST** be updated to include a `DELETE` statement for those new tables *before* the `DELETE FROM auth.users` step.
-   **Column Name/Type Changes:** If column names or types change in relevant tables (e.g., the `sender_id` in `document_emails` or `subscription_id` in `subscription_payments`), update the script's `WHERE` clauses accordingly.
-   **RLS Policies:** Re-evaluate RLS policies if errors occur, as they can interfere with DML operations even for privileged roles if their logic is flawed (e.g., incorrect type comparisons).
