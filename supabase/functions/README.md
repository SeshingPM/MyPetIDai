# Supabase Functions for PetDocument

This directory contains Supabase Edge Functions for the PetDocument application.

## Email Functions

The following functions handle email sending using Postmark:

- `send-contact-email`: Sends emails from the contact form
- `send-feedback`: Sends user feedback to the support team
- `send-reminder-emails`: Sends reminder notifications to users

## Shared Modules

The `_shared` directory contains shared modules used by multiple functions:

- `postmark.ts`: Postmark email service
- `auth.ts`: JWT validation and response helpers

## Environment Variables

The following environment variables are required:

```
POSTMARK_API_TOKEN=your_postmark_api_token
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Local Development

To run a function locally:

```bash
npx supabase functions serve send-feedback
```

To test JWT validation locally, you need to include a valid JWT token in the Authorization header:

```bash
curl -X POST http://localhost:54321/functions/v1/send-feedback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"type":"feature","description":"Add dark mode"}'
```

## Testing

You can test the Postmark service using the test script:

```bash
deno run --allow-env --allow-net supabase/functions/test-postmark.ts
```

Make sure to update the recipient email address in the script before running it.

## Deployment

To deploy a function to production:

```bash
npx supabase functions deploy send-feedback
```

Make sure to set the environment variables in the Supabase dashboard before deploying.