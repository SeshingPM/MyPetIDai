# PostHog Analytics Enhancement Plan: Authenticated User Tracking

## Overview

This document outlines the implementation plan for enhancing our PostHog analytics to track authenticated user sessions and dashboard metrics. This plan builds upon the existing analytics implementation and focuses specifically on tracking authenticated user behavior, dashboard engagement, and user session metrics.

## Current Authentication Tracking Status

Our current PostHog implementation includes:
- Basic user identification in PostHog
- Simple authentication event tracking (login, signup, logout)
- Limited session tracking for authenticated users
- No specific dashboard interaction metrics

## Implementation Phases

### Phase 1: Enhanced Authentication Tracking (Week 1)

#### 1.1 User Session Tracking

**File:** `src/contexts/AnalyticsContext.tsx`

```typescript
// Add to AnalyticsContext.tsx
const sessionStartTime = useRef<number | null>(null);
const previousUser = useRef<User | null>(null);

// Track authenticated session start/end
useEffect(() => {
  if (ENABLE_ANALYTICS && user && (!previousUser.current || previousUser.current.id !== user.id)) {
    // Track session start
    trackEvent('authenticated_session_started', {
      userId: user.id,
      userRole: user.user_metadata?.role || 'standard',
      subscriptionStatus: user.user_metadata?.has_subscription ? 'premium' : 'free',
      platform: user.user_metadata?.platform || 'unknown'
    });
    
    // Start session timer
    sessionStartTime.current = Date.now();
    previousUser.current = user;
  }
  
  // Track session end when user logs out or component unmounts
  return () => {
    if (ENABLE_ANALYTICS && user && sessionStartTime.current) {
      const sessionDuration = Date.now() - sessionStartTime.current;
      trackEvent('authenticated_session_ended', {
        userId: user.id,
        durationSeconds: Math.round(sessionDuration / 1000),
        durationMinutes: Math.round(sessionDuration / 60000)
      });
    }
  };
}, [user]);
```

#### 1.2 Authentication Event Enrichment

**File:** `src/contexts/AuthContext.tsx`

```typescript
// Enhance existing auth event tracking in handleSignIn function
const handleSignIn = async (email: string, password: string) => {
  const { success, session, error } = await signIn(email, password);

  if (success) {
    // Enhanced login tracking with more properties
    trackEvent(AUTH_EVENTS.LOGIN, {
      userId: session?.user.id,
      method: "email",
      timestamp: new Date().toISOString(),
      // Add platform detection
      platform: isAndroid() ? 'android' : isIOS() ? 'ios' : 'desktop',
      // Add browser info
      browser: detectBrowser().name,
      // Add referrer if available
      referrer: document.referrer || 'direct'
    });
  } else {
    // Enhanced failed login tracking
    trackEvent("login_failed", {
      error: error?.message,
      email: email.split('@')[1], // Track domain only for privacy
      timestamp: new Date().toISOString()
    });
  }

  return { success, session, error };
};
```

### Phase 2: Dashboard Metrics Tracking (Week 2)

#### 2.1 Dashboard Visit Tracking

**File:** `src/pages/dashboard/index.tsx`

```typescript
// Add to Dashboard component
const { trackEvent } = useAnalytics();

// Track dashboard visits
useEffect(() => {
  if (user && ENABLE_ANALYTICS) {
    // Track dashboard visit with detailed user properties
    trackEvent('dashboard_viewed', {
      userId: user.id,
      hasSubscription: hasActiveSubscription,
      // Add user properties
      userCreatedAt: user.created_at,
      daysSinceSignup: Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)),
      // Add device properties
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      deviceType: isMobile() ? 'mobile' : 'desktop'
    });
  }
}, [user, hasActiveSubscription]);
```

#### 2.2 Dashboard Tab Tracking

**File:** `src/pages/dashboard/components/LazyTabs.tsx`

```typescript
// Add to LazyTabs component
const { trackEvent } = useAnalytics();
const { user } = useAuth();

// Track tab changes
const handleTabChange = (tabName: string) => {
  if (user && ENABLE_ANALYTICS) {
    trackEvent('dashboard_tab_changed', {
      tabName,
      userId: user.id,
      previousTab: currentTab
    });
    
    setCurrentTab(tabName);
  }
};
```

#### 2.3 Dashboard Action Tracking

**File:** `src/utils/analytics-events.ts`

```typescript
// Add new dashboard event categories
export const DASHBOARD_EVENTS = {
  VIEWED: 'dashboard_viewed',
  TAB_CHANGED: 'dashboard_tab_changed',
  FEATURE_USED: 'dashboard_feature_used',
  DOCUMENT_ACTION: 'dashboard_document_action',
  PET_ACTION: 'dashboard_pet_action',
  SETTINGS_CHANGED: 'dashboard_settings_changed'
};
```

### Phase 3: User Interaction Tracking (Week 3)

#### 3.1 Feature Usage Tracking

**File:** `src/utils/analytics-helpers.ts` (new file)

```typescript
import { trackEvent } from '@/integrations/posthog/client';
import { useAuth } from '@/contexts/AuthContext';
import { DASHBOARD_EVENTS } from '@/utils/analytics-events';

/**
 * Track feature usage by authenticated users
 */
export const trackFeatureUsage = (
  featureName: string,
  actionType: 'view' | 'interact' | 'complete',
  metadata?: Record<string, any>
) => {
  const { user } = useAuth();
  
  if (!user || !ENABLE_ANALYTICS) return;
  
  trackEvent(DASHBOARD_EVENTS.FEATURE_USED, {
    userId: user.id,
    feature: featureName,
    action: actionType,
    subscriptionTier: user.user_metadata?.has_subscription ? 'premium' : 'free',
    timestamp: new Date().toISOString(),
    ...metadata
  });
};
```

#### 3.2 Click Tracking for Dashboard Elements

**File:** `src/utils/analytics-helpers.ts`

```typescript
/**
 * Set up click tracking for dashboard elements
 */
export const setupDashboardClickTracking = () => {
  const { user } = useAuth();
  
  if (!user || !ENABLE_ANALYTICS) return;
  
  // Track clicks on important dashboard elements
  document.addEventListener('click', (event) => {
    // Get the clicked element
    const element = event.target as HTMLElement;
    
    // Check if it has a data-track attribute
    const trackId = element.getAttribute('data-track-id');
    
    if (trackId) {
      trackEvent('element_clicked', {
        userId: user.id,
        elementId: trackId,
        path: window.location.pathname,
        elementText: element.textContent?.trim().substring(0, 50) || '',
        timestamp: new Date().toISOString()
      });
    }
  });
};
```

#### 3.3 Time on Page Tracking for Authenticated Users

**File:** `src/contexts/AnalyticsContext.tsx`

```typescript
// Enhance existing time on page tracking for authenticated users
useEffect(() => {
  if (ENABLE_ANALYTICS) {
    const { pathname } = location;
    const currentTime = Date.now();
    
    // If we have a previous page entry time, calculate duration
    if (pageEntryTime) {
      const timeSpentMs = currentTime - pageEntryTime;
      
      // Enhanced tracking for authenticated users
      trackEvent(ENGAGEMENT_EVENTS.PAGE_EXIT, {
        path: pathname,
        timeSpentSeconds: Math.round(timeSpentMs / 1000),
        timeSpentMinutes: Math.round(timeSpentMs / 60000),
        // Add authentication status
        isAuthenticated: !!user,
        // Add user ID if authenticated
        ...(user ? { userId: user.id } : {}),
        // Add subscription status if authenticated
        ...(user ? { 
          hasSubscription: user.user_metadata?.has_subscription || false 
        } : {})
      });
    }
    
    // Reset entry time for new page
    setPageEntryTime(currentTime);
  }
}, [location, user]);
```

### Phase 4: Dashboard Component Tracking (Week 4)

#### 4.1 Pet Management Tracking

**File:** `src/components/pets/PetCard.tsx`

```typescript
// Add to PetCard component
const { trackEvent } = useAnalytics();
const { user } = useAuth();

// Track pet card interactions
const trackPetInteraction = (action: string) => {
  if (!user || !ENABLE_ANALYTICS) return;
  
  trackEvent(DASHBOARD_EVENTS.PET_ACTION, {
    userId: user.id,
    petId: pet.id,
    action,
    petType: pet.type,
    petAge: pet.age,
    timestamp: new Date().toISOString()
  });
};

// Add to click handlers
const handleViewDetails = () => {
  trackPetInteraction('view_details');
  navigate(`/pet-details/${pet.id}`);
};

const handleEditPet = () => {
  trackPetInteraction('edit');
  setIsEditing(true);
};
```

#### 4.2 Document Management Tracking

**File:** `src/components/documents/DocumentCard.tsx` (or equivalent)

```typescript
// Add to document interaction handlers
const handleViewDocument = () => {
  if (!user || !ENABLE_ANALYTICS) return;
  
  trackEvent(DASHBOARD_EVENTS.DOCUMENT_ACTION, {
    userId: user.id,
    documentId: document.id,
    action: 'view',
    documentType: document.type,
    documentSize: document.size,
    timestamp: new Date().toISOString()
  });
  
  openDocument(document.id);
};

const handleDownloadDocument = () => {
  if (!user || !ENABLE_ANALYTICS) return;
  
  trackEvent(DASHBOARD_EVENTS.DOCUMENT_ACTION, {
    userId: user.id,
    documentId: document.id,
    action: 'download',
    documentType: document.type,
    documentSize: document.size,
    timestamp: new Date().toISOString()
  });
  
  downloadDocument(document.id);
};
```

### Phase 5: Integration & Testing (Week 5)

#### 5.1 App.tsx Integration

**File:** `src/App.tsx`

```typescript
// Add imports
import { setupDashboardClickTracking } from '@/utils/analytics-helpers';

// Add to component initialization
useEffect(() => {
  if (ENABLE_ANALYTICS && user) {
    // Initialize dashboard click tracking for authenticated users
    setupDashboardClickTracking();
  }
}, [user]);
```

#### 5.2 Testing Plan

1. **Authentication Flow Testing**
   - Test login, signup, and logout flows
   - Verify user properties are correctly set in PostHog
   - Test session duration tracking

2. **Dashboard Interaction Testing**
   - Test dashboard visit tracking
   - Test tab change tracking
   - Test feature usage tracking

3. **Component Interaction Testing**
   - Test pet management tracking
   - Test document management tracking
   - Test settings changes tracking

## PostHog Dashboard Configuration

Once the enhanced tracking is implemented, configure the following in the PostHog dashboard:

### 1. Authenticated User Dashboard

Create a dashboard with:
1. Daily active authenticated users
2. Average session duration by user type (free vs. premium)
3. Session frequency by user segment
4. User retention by subscription status

### 2. Dashboard Engagement Metrics

Create a dashboard with:
1. Most used dashboard tabs
2. Most popular features
3. Time spent on dashboard vs. other pages
4. Feature usage by subscription status

### 3. User Behavior Analysis

Create a dashboard with:
1. Document management patterns
2. Pet management patterns
3. Settings changes frequency
4. Feature adoption rates

### 4. User Frustration Detection

Create a dashboard with:
1. Rage clicks by authenticated users
2. Error rates by feature
3. Form abandonment rates
4. Session recordings of frustrated users

## Expected Outcomes

This enhanced analytics implementation will provide:

1. **Detailed user engagement metrics**
   - Understand how users interact with your dashboard
   - Identify most and least used features
   - Track time spent on different sections

2. **User segmentation insights**
   - Compare behavior between free and premium users
   - Analyze platform-specific usage patterns
   - Identify power users vs. casual users

3. **Retention optimization opportunities**
   - Understand what keeps users coming back
   - Identify features that drive engagement
   - Spot early warning signs of churn

4. **Product development guidance**
   - Prioritize features based on actual usage
   - Identify pain points in the user experience
   - Make data-driven decisions about new features
