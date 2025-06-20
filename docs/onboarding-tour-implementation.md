# Onboarding Tour Implementation

This document outlines the implementation of the 3-step welcome onboarding tour for first-time users of the PetDocument app.

## Overview

The onboarding tour is a guided introduction to the PetDocument app's core functionality that appears when a user logs in for the first time. It walks users through three key actions:

1. Adding a pet profile
2. Uploading a document for that pet
3. Setting a reminder for future pet care

The tour is designed to increase user engagement by guiding new users through the app's core value proposition immediately after signup.

## Technical Implementation

### User State Tracking

- The onboarding tour's display state is controlled by a `has_completed_onboarding` flag stored in Supabase user metadata
- No database migrations or schema changes are required as this uses the existing metadata functionality
- The flag persists across sessions and devices for the same user account

### Component Architecture

```
src/
├── components/
│   └── onboarding/
│       ├── OnboardingTour.tsx           # Main container component
│       └── steps/
│           ├── AddPetStep.tsx           # Step 1: Add pet profile
│           ├── UploadDocumentStep.tsx   # Step 2: Upload document
│           └── SetReminderStep.tsx      # Step 3: Set reminder
├── hooks/
│   └── useOnboardingStatus.ts           # Hook to manage onboarding state
└── utils/
    └── deviceDetection.ts               # Platform detection for responsive UI
```

### Component Flow

1. The `useOnboardingStatus` hook checks if the `has_completed_onboarding` flag exists in the user's metadata
2. If the flag is missing or false, the tour is displayed on the dashboard
3. As the user progresses through steps, state is maintained in the `OnboardingTour` component
4. Upon completion (or if skipped), the metadata is updated to mark onboarding as complete

### Responsive Considerations

The onboarding tour is designed to work across all devices with specific adaptations:

- **Mobile:** Optimized layout with stacked elements and appropriate spacing
- **Android:** Special consideration for document uploads via the platform-specific method
- **iOS:** Compatible with iOS upload restrictions
- **Desktop:** Full-featured experience with all capabilities

### Integration Points

The tour integrates with existing app functionality:

- **Pet Creation:** Reuses `AddPetForm` component
- **Document Upload:** Adapts the file upload pattern from `PetProfilePictureUpload` component
- **Reminder Creation:** Uses the existing `AddReminderForm` component

## User Experience

### Display Triggers

- Appears on the first successful login (immediately after authentication)
- Only shows once per user (tracked via Supabase user metadata)
- Can be skipped at any point

### UI Components

- Step progress indicator showing 3 steps (1 → 2 → 3)
- Navigation controls ("Skip Tour", "Back", "Finish Tour")
- Clear instructions at each step
- Responsive layout adapting to screen size

## Testing Considerations

To test the onboarding tour:

1. Create a new test user account
2. Log in with the new account to see the tour
3. To reset the tour for an existing user (for testing), call:
   ```typescript
   // In development tools console
   const { resetOnboarding } = useOnboardingStatus();
   resetOnboarding();
   ```

## Future Enhancements

Potential improvements for future iterations:

- Analytics tracking for onboarding completion rates
- A/B testing different onboarding flows
- Allowing users to revisit the tour from settings
- Adding more interactive elements or tooltips

## Related Documentation

- [User Authentication Flow](./forgot-password.md) - Relates to the login process
- [Document Upload Implementation](./document-scanner-refactoring.md) - Document upload functionality
