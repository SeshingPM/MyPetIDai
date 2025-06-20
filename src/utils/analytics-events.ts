/**
 * Standardized analytics events for MyPetID
 *
 * This file defines constants for all analytics events to ensure consistency
 * and prevent typos when tracking events throughout the application.
 */

// Authentication events
export const AUTH_EVENTS = {
  SIGN_UP: "user_signed_up",
  LOGIN: "user_logged_in",
  LOGOUT: "user_logged_out",
  PASSWORD_RESET: "password_reset_requested",
  PASSWORD_CHANGED: "password_changed",
  EMAIL_VERIFICATION: "email_verified",
  SESSION_STARTED: "authenticated_session_started",
  SESSION_ENDED: "authenticated_session_ended",
  LOGIN_FAILED: "login_failed",
};

// Document events
export const DOCUMENT_EVENTS = {
  UPLOADED: "document_uploaded",
  VIEWED: "document_viewed",
  DOWNLOADED: "document_downloaded",
  SHARED: "document_shared",
  DELETED: "document_deleted",
  RENAMED: "document_renamed",
  CATEGORIZED: "document_categorized",
};

// Pet events
export const PET_EVENTS = {
  CREATED: "pet_created",
  UPDATED: "pet_updated",
  DELETED: "pet_deleted",
  PROFILE_VIEWED: "pet_profile_viewed",
};

// Health record events
export const HEALTH_EVENTS = {
  VACCINATION_ADDED: "vaccination_added",
  VACCINATION_UPDATED: "vaccination_updated",
  MEDICATION_ADDED: "medication_added",
  MEDICATION_UPDATED: "medication_updated",
  MEDICAL_EVENT_ADDED: "medical_event_added",
  MEDICAL_EVENT_UPDATED: "medical_event_updated",
};

// Reminder events
export const REMINDER_EVENTS = {
  CREATED: "reminder_created",
  UPDATED: "reminder_updated",
  DELETED: "reminder_deleted",
  COMPLETED: "reminder_completed",
  DISMISSED: "reminder_dismissed",
};

// This section previously contained subscription events - removed
// All subscription functionality has been removed as the platform is now 100% free
export const SUBSCRIPTION_EVENTS = {};

// User preference events
export const PREFERENCE_EVENTS = {
  THEME_CHANGED: "theme_changed",
  NOTIFICATION_TOGGLED: "notification_toggled",
  LANGUAGE_CHANGED: "language_changed",
};

// Feature usage events
export const FEATURE_EVENTS = {
  SEARCH_USED: "search_used",
  FILTER_APPLIED: "filter_applied",
  SORT_APPLIED: "sort_applied",
  EXPORT_GENERATED: "export_generated",
  REPORT_GENERATED: "report_generated",
};

// Error events
export const ERROR_EVENTS = {
  UPLOAD_FAILED: "upload_failed",
  API_ERROR: "api_error",
  VALIDATION_ERROR: "validation_error",
  SERVER_ERROR: "server_error",
};

// Onboarding events
export const ONBOARDING_EVENTS = {
  STARTED: "onboarding_started",
  STEP_COMPLETED: "onboarding_step_completed",
  COMPLETED: "onboarding_completed",
  SKIPPED: "onboarding_skipped",
};

// Platform events
export const PLATFORM_EVENTS = {
  PLATFORM_IDENTIFIED: "platform_identified",
};

// Engagement events
export const ENGAGEMENT_EVENTS = {
  PAGE_ENTRY: "page_entry",
  PAGE_EXIT: "page_exit",
  RAGE_CLICK: "rage_click_detected",
  FORM_ABANDONED: "form_abandoned",
  ELEMENT_INTERACTION: "element_interaction",
};

// Funnel events
export const FUNNEL_EVENTS = {
  // Removed pricing and checkout related events - platform is now 100% free
  SIGNUP_ABANDONED: "signup_abandoned",
};

// Dashboard events
export const DASHBOARD_EVENTS = {
  VIEWED: "dashboard_viewed",
  TAB_CHANGED: "dashboard_tab_changed",
  FEATURE_USED: "dashboard_feature_used",
  DOCUMENT_ACTION: "dashboard_document_action",
  PET_ACTION: "dashboard_pet_action",
  SETTINGS_CHANGED: "dashboard_settings_changed",
};
