# iOS Safari Subscription Fix

## Problem Description

iOS Safari users were getting stuck on `/dashboard` after clicking a Supabase magic link because `pendingPriceId` was lost due to Safari's Intelligent Tracking Prevention (ITP). This happened because our app was only using localStorage for storing the `pendingPriceId` and Safari's storage partitioning can cause this data to be lost between sessions.

## Solution Implemented

We've implemented a dual-storage approach that uses both localStorage (for backwards compatibility) and a database fallback specifically to address the iOS Safari issue:

### 1. Created Database Table

A new table called `user_pending_subscriptions` with the following schema:

```sql
CREATE TABLE public.user_pending_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  pending_price_id TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_ip TEXT,
  user_agent TEXT
);
```

With RLS policies to ensure secure access:
- Users can read their own pending subscription data
- Users can delete their own pending subscription data
- No INSERT policy (handled via Edge Function)

### 2. Created Edge Function: store-pending-subscription

This function:
- Accepts `{ email, pendingPriceId }` via POST request
- Normalizes the email to lowercase
- Validates inputs
- Captures user-agent and request IP for debugging
- Uses Supabase service role key for database operations
- Uses restricted CORS headers
- Logs overwrites for debugging

### 3. Updated Signup Flow

In `useSubscription.ts`:
- Still stores `pendingPriceId` in localStorage (for backwards compatibility)
- Added call to the Edge Function to persist email + pendingPriceId to the DB
- Handles errors gracefully to allow signup flow to continue even if DB storage fails

### 4. Updated VerifyHandler.tsx

In the email verification handler:
- First checks localStorage for pendingPriceId (existing behavior)
- If not found, falls back to querying the database
- Logs the source of the pendingPriceId (localStorage vs database)
- Includes browser detection for debugging
- Deletes the record from the database after retrieval
- Redirects to Stripe Checkout with the retrieved pendingPriceId

### 5. Added Logging & Observability

- Added browser detection utility for debugging
- Added detailed logging at each step
- Database table includes TTL via expires_at field

## Testing

To test this implementation:

1. **Regular Browser Flow:**
   - Go to pricing page
   - Select a plan
   - Complete sign up
   - Verify the magic link redirects properly to checkout

2. **iOS Safari Specific Testing:**
   - On an iOS device using Safari, go to pricing page
   - Select a plan (this will store in both localStorage and database)
   - Complete sign up
   - Open the verification link in Safari
   - Verify it correctly retrieves the pendingPriceId from database and redirects to checkout

3. **Monitoring:**
   - Check logs for entries with "VerifyHandler:" prefix
   - Look for records in the `user_pending_subscriptions` table
   - Monitor the "source" attribute in logs to see if users are using the localStorage or database fallback

## Technical Notes

1. TypeScript typing for the new table will need to be updated in your database types
2. The Supabase Edge Function requires deployment to be accessible
3. The database TTL is set to 24 hours to automatically clean up unused records
