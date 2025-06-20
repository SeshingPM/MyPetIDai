# PostHog Analytics Enhancement Plan for PetDocument

## Overview

This document outlines the implementation plan for enhancing our PostHog analytics to better understand user behavior, conversion funnels, and user experience issues. The goal is to improve our ability to track key metrics that drive SaaS growth: conversion rates, user engagement, and retention.

## Current Implementation Status

Our current PostHog implementation includes:
- Basic user identification
- Page view tracking
- Event tracking capabilities
- Feature flag support

However, we've identified several gaps:
- Limited platform/device tracking
- Incomplete funnel tracking (pricing → signup → subscription)
- No time-on-page or engagement metrics
- No user frustration indicators (rage clicks, form abandonment)
- Minimal onboarding flow analytics

## Implementation Phases

### Phase 1: Core Tracking Enhancement (Week 1)

#### 1.1 Platform & Device Tracking

**File:** `src/contexts/AnalyticsContext.tsx`

```typescript
// Add to AnalyticsContext.tsx useEffect
useEffect(() => {
  if (ENABLE_ANALYTICS && user) {
    const { isAndroid, isIOS, isMobile, isSamsung, isChrome } = usePlatform();
    
    // Set user properties for platform segmentation
    posthog.people.set({
      platform: isAndroid ? 'android' : isIOS ? 'ios' : 'desktop',
      deviceType: isMobile ? 'mobile' : 'desktop',
      browser: isChrome ? 'chrome' : isSamsung ? 'samsung' : 'other'
    });
    
    // Also capture as an event for immediate analysis
    trackEvent('platform_identified', {
      platform: isAndroid ? 'android' : isIOS ? 'ios' : 'desktop',
      deviceType: isMobile ? 'mobile' : 'desktop',
      browser: isChrome ? 'chrome' : isSamsung ? 'samsung' : 'other'
    });
  }
}, [user, platform]);
```

#### 1.2 Enhanced PostHog Configuration

**File:** `src/integrations/posthog/client.ts`

```typescript
export const initPostHog = (): void => {
  // ...existing code
  
  posthog.init(POSTHOG_API_KEY, {
    // ...existing options
    
    // Enhanced session recording with heatmaps
    session_recording: {
      enabled: true,
      maskAllInputs: true,
      recordCanvas: true,
      collectFonts: false
    },
    
    // Capture more detailed page leave info
    capture_pageleave: true,
    
    // Capture form interactions
    capture_form_submit: true,
    
    // Improve performance
    bootstrap: {
      distinctID: localStorage.getItem('ph_distinct_id'),
      isIdentifiedID: localStorage.getItem('ph_is_identified')
    }
  });
};
```

#### 1.3 Define New Analytics Events

**File:** `src/utils/analytics-events.ts`

```typescript
// Add new event categories
export const PLATFORM_EVENTS = {
  PLATFORM_IDENTIFIED: 'platform_identified',
};

export const ENGAGEMENT_EVENTS = {
  PAGE_ENTRY: 'page_entry',
  PAGE_EXIT: 'page_exit',
  RAGE_CLICK: 'rage_click_detected',
  FORM_ABANDONED: 'form_abandoned',
  ELEMENT_INTERACTION: 'element_interaction',
};

export const FUNNEL_EVENTS = {
  PRICING_PAGE_EXIT: 'pricing_page_exit_without_action',
  CHECKOUT_ABANDONED: 'checkout_abandoned',
  SIGNUP_ABANDONED: 'signup_abandoned',
};
```

### Phase 2: Conversion Funnel Tracking (Week 2)

#### 2.1 Pricing Page Funnel Tracking

**File:** `src/pages/Pricing.tsx`

```typescript
// Add to useEffect
useEffect(() => {
  // Track when user visits pricing page
  trackEvent(SUBSCRIPTION_EVENTS.VIEWED_PRICING, {
    referrer: document.referrer,
    source: location.state?.source || 'direct'
  });
  
  // Track when user leaves pricing page without action
  const handleBeforeUnload = () => {
    if (!sessionStorage.getItem('checkout_started')) {
      trackEvent(FUNNEL_EVENTS.PRICING_PAGE_EXIT);
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, []);
```

#### 2.2 Checkout Funnel Tracking

**File:** `src/components/pricing/PricingCard.tsx`

```typescript
// Modify handleSubscribe function
const handleSubscribe = async () => {
  // Track when user clicks subscribe button
  trackEvent(SUBSCRIPTION_EVENTS.STARTED_CHECKOUT, {
    planType,
    planName,
    price
  });
  
  sessionStorage.setItem('checkout_started', 'true');
  // Rest of the function...
};
```

**File:** `src/hooks/useCheckout.ts`

```typescript
// Add to useEffect
useEffect(() => {
  return () => {
    // If component unmounts and checkout was not completed
    if (state.isLoading) {
      trackEvent(FUNNEL_EVENTS.CHECKOUT_ABANDONED, {
        planType,
        reason: 'page_abandoned'
      });
    }
  };
}, [state.isLoading, planType]);
```

#### 2.3 Signup Funnel Tracking

**File:** `src/components/auth/SignupForm.tsx` (or equivalent)

```typescript
// Add to form submission handler
const handleSubmit = async (values) => {
  trackEvent('signup_started', {
    source: location.state?.source || 'direct',
    referrer: document.referrer
  });
  
  // Existing signup logic...
  
  // On success
  trackEvent('signup_completed', {
    source: location.state?.source || 'direct'
  });
  
  // On error
  trackEvent('signup_failed', {
    reason: error.message,
    source: location.state?.source || 'direct'
  });
};
```

### Phase 3: User Engagement Metrics (Week 3)

#### 3.1 Time on Page Tracking

**File:** `src/contexts/AnalyticsContext.tsx`

```typescript
// Add to component
const [pageEntryTime, setPageEntryTime] = useState<number | null>(null);

// Track time spent when location changes
useEffect(() => {
  if (ENABLE_ANALYTICS) {
    const { pathname } = location;
    const currentTime = Date.now();
    
    // If we have a previous page entry time, calculate duration
    if (pageEntryTime) {
      const timeSpentMs = currentTime - pageEntryTime;
      trackEvent(ENGAGEMENT_EVENTS.PAGE_EXIT, {
        path: pathname,
        timeSpentSeconds: Math.round(timeSpentMs / 1000),
        timeSpentMinutes: Math.round(timeSpentMs / 60000)
      });
    }
    
    // Reset entry time for new page
    setPageEntryTime(currentTime);
    
    // Track page entry
    trackEvent(ENGAGEMENT_EVENTS.PAGE_ENTRY, {
      path: pathname,
      title: document.title
    });
  }
}, [location]);
```

#### 3.2 Element Interaction Tracking

**File:** `src/utils/analytics-helpers.ts` (new file)

```typescript
import { trackEvent } from '@/integrations/posthog/client';
import { ENGAGEMENT_EVENTS } from '@/utils/analytics-events';

/**
 * Track interactions with important UI elements
 */
export const trackElementInteraction = (
  elementType: string,
  elementId: string,
  action: 'click' | 'hover' | 'focus' | 'blur',
  additionalProps?: Record<string, any>
) => {
  trackEvent(ENGAGEMENT_EVENTS.ELEMENT_INTERACTION, {
    elementType,
    elementId,
    action,
    path: window.location.pathname,
    ...additionalProps
  });
};
```

### Phase 4: User Frustration Detection (Week 4)

#### 4.1 Rage Click Detection

**File:** `src/utils/analytics-helpers.ts`

```typescript
/**
 * Set up rage click detection
 */
export const setupRageClickDetection = () => {
  let clickCount = 0;
  let lastClickTime = 0;
  let lastClickTarget = null;
  
  document.addEventListener('click', (event) => {
    const currentTime = Date.now();
    
    // If click is within 500ms of last click and on same target
    if (currentTime - lastClickTime < 500 && event.target === lastClickTarget) {
      clickCount++;
      
      // 3+ rapid clicks on same element = rage click
      if (clickCount >= 3) {
        const path = window.location.pathname;
        const targetElement = event.target.tagName;
        const targetId = event.target.id || '';
        const targetClass = event.target.className || '';
        
        trackEvent(ENGAGEMENT_EVENTS.RAGE_CLICK, {
          path,
          targetElement,
          targetId,
          targetClass,
          clickCount
        });
        
        // Reset after logging
        clickCount = 0;
      }
    } else {
      // Reset counter for new click sequence
      clickCount = 1;
    }
    
    lastClickTime = currentTime;
    lastClickTarget = event.target;
  });
};
```

#### 4.2 Form Abandonment Tracking

**File:** `src/utils/analytics-helpers.ts`

```typescript
/**
 * Track form abandonment
 */
export const trackFormAbandonment = (formId: string) => {
  const formInputs = document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`);
  
  formInputs.forEach(input => {
    input.addEventListener('change', () => {
      // Mark form as started
      sessionStorage.setItem(`form_${formId}_started`, 'true');
    });
  });
  
  // Track abandonment on page navigation
  return () => {
    if (sessionStorage.getItem(`form_${formId}_started`) === 'true' && 
        !sessionStorage.getItem(`form_${formId}_completed`)) {
      trackEvent(ENGAGEMENT_EVENTS.FORM_ABANDONED, { formId });
      sessionStorage.removeItem(`form_${formId}_started`);
    }
  };
};

/**
 * Mark form as completed (call on successful submission)
 */
export const markFormCompleted = (formId: string) => {
  sessionStorage.setItem(`form_${formId}_completed`, 'true');
};
```

### Phase 5: Onboarding Flow Tracking (Week 5)

#### 5.1 Onboarding Tour Tracking

**File:** `src/components/onboarding/OnboardingTour.tsx`

```typescript
// Add to component
useEffect(() => {
  // Track when onboarding starts
  trackEvent(ONBOARDING_EVENTS.STARTED);
  
  return () => {
    // If onboarding was not completed when component unmounts
    if (currentStep < 3) {
      trackEvent(ONBOARDING_EVENTS.SKIPPED, {
        lastCompletedStep: currentStep
      });
    }
  };
}, []);

// Modify nextStep function
const nextStep = (): void => {
  trackEvent(ONBOARDING_EVENTS.STEP_COMPLETED, {
    stepNumber: currentStep,
    stepName: ['AddPet', 'UploadDocument', 'SetReminder'][currentStep - 1]
  });
  setCurrentStep((prev) => Math.min(prev + 1, 3));
};

// Modify handleCompleteTour function
const handleCompleteTour = async (): Promise<void> => {
  trackEvent(ONBOARDING_EVENTS.COMPLETED);
  // Rest of the function...
};
```

#### 5.2 Onboarding Step Tracking

**File:** `src/components/onboarding/steps/AddPetStep.tsx`

```typescript
// Add to handlePetSuccess
const handlePetSuccess = async (petId?: string) => {
  if (isProcessing) return;

  try {
    setIsProcessing(true);
    if (petId) {
      await refetchPets();
      
      // Track successful pet addition
      trackEvent('onboarding_pet_added', { petId });
      
      logger.info('Pet added successfully during onboarding, id:', petId);
      onPetAdded(petId);
    }
  } catch (error) {
    // Track error
    trackEvent('onboarding_pet_error', { 
      error: error.message 
    });
    
    logger.error('Error after adding pet during onboarding:', error);
    toast.error('Something went wrong. Please try again.');
  } finally {
    setIsProcessing(false);
    setIsFormVisible(false);
  }
};
```

Apply similar tracking to other onboarding steps.

### Phase 6: Integration & Testing (Week 6)

#### 6.1 App.tsx Integration

**File:** `src/App.tsx`

```typescript
// Add imports
import { setupRageClickDetection } from '@/utils/analytics-helpers';

// Add to component initialization
useEffect(() => {
  if (ENABLE_ANALYTICS) {
    // Initialize rage click detection
    setupRageClickDetection();
  }
}, []);
```

#### 6.2 Testing Plan

1. **Platform Detection Testing**
   - Test on iOS, Android, and Desktop devices
   - Verify platform properties are correctly set in PostHog

2. **Funnel Testing**
   - Complete test journeys through pricing → checkout → signup
   - Verify events are captured at each step
   - Test abandonment scenarios

3. **Engagement Metrics Testing**
   - Verify time-on-page tracking across different pages
   - Test element interaction tracking

4. **Frustration Detection Testing**
   - Test rage click detection
   - Test form abandonment tracking

5. **Onboarding Flow Testing**
   - Complete and abandon onboarding flows
   - Verify step completion tracking

## PostHog Dashboard Configuration

Once the enhanced tracking is implemented, configure the following in the PostHog dashboard:

### 1. User Funnel Analysis

Create a funnel visualization with these steps:
1. `viewed_pricing_page`
2. `started_checkout`
3. `signup_started` (if applicable)
4. `completed_checkout`

### 2. User Engagement Dashboard

Create a dashboard with:
1. Average time spent per page
2. Pages with highest engagement
3. Pages with highest exit rates
4. User session duration trends

### 3. User Frustration Dashboard

Create a dashboard with:
1. Rage clicks by page/element
2. Form abandonment rates
3. Error events frequency
4. Session recordings of frustrated users

### 4. Platform Segmentation

Create segments for:
1. iOS users
2. Android users
3. Desktop users

Apply these segments to all dashboards for platform-specific insights.

## Expected Outcomes

This enhanced analytics implementation will provide:

1. **Clear visibility into conversion bottlenecks**
   - Identify where users drop off in the pricing → signup funnel
   - Understand platform-specific conversion issues

2. **Better understanding of user engagement**
   - Know which features keep users engaged
   - Identify underutilized features

3. **Improved user experience**
   - Detect and fix frustration points
   - Optimize the onboarding flow

4. **Data-driven decision making**
   - Prioritize features based on usage patterns
   - Target improvements to specific platforms

## Maintenance Plan

1. **Regular Review**
   - Weekly review of key metrics
   - Monthly deep-dive analysis

2. **Continuous Improvement**
   - Add tracking for new features
   - Refine existing tracking based on insights

3. **Documentation**
   - Keep analytics events documentation updated
   - Document dashboard configurations
