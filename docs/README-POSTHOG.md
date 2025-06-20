# PostHog Analytics Integration for PetDocument

## Overview

This guide explains how to use PostHog analytics in the PetDocument application. PostHog helps track user behavior to improve retention, understand feature usage, and identify drop-off points.

## Setup

### 1. Environment Configuration

Add the following variables to your `.env.local` file:

```
# PostHog Analytics
VITE_POSTHOG_API_KEY=your_posthog_api_key
VITE_POSTHOG_API_HOST=https://app.posthog.com
VITE_ENABLE_ANALYTICS=true
```

You can get your PostHog API key from your PostHog instance settings.

### 2. Install Dependencies

```bash
npm install posthog-js
```

## Usage

### Tracking Events

The application uses standardized events defined in `src/utils/analytics-events.ts`. To track an event:

```typescript
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { DOCUMENT_EVENTS } from "@/utils/analytics-events";

const { trackEvent } = useAnalytics();

// Track a document upload event
trackEvent(DOCUMENT_EVENTS.UPLOADED, {
  method: "drag_and_drop",
  fileType: file.type,
  fileSize: file.size,
  fileName: file.name,
});
```

### Feature Flags and A/B Testing

To use PostHog feature flags:

```typescript
import { useAnalytics } from "@/contexts/AnalyticsContext";

const { isFeatureEnabled, getFeatureFlagVariant } = useAnalytics();

// Check if a feature is enabled for the current user
const isPremiumFeaturesEnabled = isFeatureEnabled("premium-features", false);

// Get the variant for an A/B test
const pricingVariant = getFeatureFlagVariant("pricing-display", "default");
```

## Key Tracked Events

- **Authentication**: Signup, login, logout
- **Documents**: Upload, view, download, share
- **Pets**: Create, update, delete
- **Health Records**: Add vaccinations, medications, medical events
- **Reminders**: Create, update, complete
- **User Journey**: Page views, feature usage

## Recommended PostHog Dashboards

1. **User Journey Funnel**:

   - Signup → First Pet Added → First Document Upload → Return Visit

2. **Document Management**:

   - Upload Methods (drag-drop vs. file browser vs. scanner)
   - Document Types
   - Upload Success Rate

3. **Retention Analysis**:

   - Weekly Active Users
   - Monthly Returning Users

4. **Feature Usage**:
   - Most Popular Features
   - Feature Adoption Rate

## Recommended PostHog Plugins

1. **Session Recording**: Understand user behavior and identify pain points
2. **Path Analysis**: See how users navigate through your application
3. **Retention Analysis**: Track how many users return to your app and when
4. **Feature Flags**: Roll out features gradually or A/B test changes
5. **S3 Export**: Export analytics data to S3 for further analysis

## Privacy Considerations

- PostHog is configured to mask input fields for privacy
- Avoid tracking sensitive information like medical details
- User data is identified only by Supabase user ID, not personal information

## Troubleshooting

- Check browser console for PostHog initialization errors
- Verify that `VITE_ENABLE_ANALYTICS` is set to `true`
- Confirm PostHog API key is correctly set in environment variables
