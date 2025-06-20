# Send Document Email Function

This Supabase Edge Function enables sending document share links via email using Postmark.

## Overview

The function:

1. Creates or uses an existing share link for a document
2. Sends an email with the share link using Postmark
3. Records the email in the database

## API

### Endpoint

```
POST /functions/v1/send-document-email
```

### Headers

- `Authorization`: Bearer token from authenticated user
- `Content-Type`: application/json

### Request Body

```json
{
  "documentId": "uuid-of-document",
  "recipientEmail": "recipient@example.com",
  "subject": "Document shared with you: Document Name", // Optional
  "message": "Custom message to include in email" // Optional
}
```

### Response

Success (200):

```json
{
  "success": true,
  "message": "Email sent successfully",
  "shareUrl": "https://petdocument.com/shared/share_abc123"
}
```

Error (4xx/5xx):

```json
{
  "error": "Error message",
  "details": {} // Optional error details
}
```

## Implementation Details

- The function automatically creates a new share link if one doesn't exist or has expired
- Share links expire after 48 hours by default
- Emails are sent using Postmark with HTML formatting
- The function requires authentication to prevent abuse

## Deployment

Deploy the function using the Supabase CLI:

```bash
supabase functions deploy send-document-email --no-verify-jwt
```

## Testing

You can test the function with cURL:

```bash
curl -X POST 'https://yyqodsrvslheazteialw.supabase.co/functions/v1/send-document-email' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"documentId":"uuid","recipientEmail":"test@example.com","subject":"Test Email","message":"Testing document sharing"}'
```
