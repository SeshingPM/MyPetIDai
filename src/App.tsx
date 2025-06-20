import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { SUPABASE_URL } from "@/config/env";
import logger from "@/utils/logger";
import { supabase } from "@/integrations/supabase/client";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/dashboard";
import Pets from "@/pages/Pets";
import PetDetails from "@/pages/PetDetails";
import Reminders from "@/pages/Reminders";
import Documents from "@/pages/Documents";
import AndroidUploadPage from "@/pages/AndroidUploadPage";
import IOSUploadPage from "@/pages/IOSUploadPage";
import HealthCheck from "@/pages/HealthCheck";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Referrals from "@/pages/Referrals";
import NotFound from "@/pages/NotFound";
import SharedDocument from "@/pages/SharedDocument";
import SharedDocumentDebug from "@/pages/SharedDocumentDebug";
import FAQ from "@/pages/FAQ";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Features from "@/pages/Features";
import Benefits from "@/pages/Benefits";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import VerifyHandler from "@/pages/VerifyHandler";
import VerifyEmail from "@/pages/VerifyEmail";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminReports from "@/pages/admin/AdminReports";
import SystemStatus from "@/pages/admin/SystemStatus";

import { AuthProvider } from "@/contexts/AuthContext";
import { PetsProvider } from "@/contexts/pets";
import { DocumentsProvider } from "@/contexts/DocumentsContext";
import { HealthProvider } from "@/contexts/health";
import { UserPreferencesProvider } from "@/contexts/userPreferences";
import { ReminderProvider } from "@/contexts/reminders";
import { AnalyticsProvider } from "@/contexts/AnalyticsContext";
import { WeightUnitProvider } from "@/contexts/WeightUnitContext";
import RequireAuth from "@/components/auth/RequireAuth";
import GoogleVerification from "@/components/seo/GoogleVerification";
import OnboardingFlow from "@/components/onboarding/flow/OnboardingFlow";
import ProcessingRegistration from "@/pages/ProcessingRegistration";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 15 * 60 * 1000, // 15 minutes (formerly cacheTime)
      refetchOnMount: "always",
      refetchOnReconnect: false,
    },
  },
});

function LovableDebugger() {
  useEffect(() => {
    // Run after component mounts to ensure DOM is available
    logger.info("============ APP.TSX LOVABLE DEBUGGER ============");
    logger.info("Checking for Lovable scripts from App component:");

    // Get all scripts
    const allScripts = document.querySelectorAll("script");
    logger.info("Total scripts on page:", allScripts.length);

    // Log all script sources to check for potential interference
    allScripts.forEach((script, i) => {
      const src = script.getAttribute("src") || "inline-script";
      logger.info(`Script ${i}:`, src);
    });

    // Check for window-level variables that might be overriding env vars
    logger.info("Window-level environment check:");
    // @ts-ignore - Intentionally checking global props
    const globalVars = Object.keys(window).filter(
      (key) =>
        key.includes("SUPABASE") ||
        key.includes("supabase") ||
        key.includes("env") ||
        key.includes("ENV")
    );
    logger.info("Potential environment-related globals:", globalVars);

    // Compare expected to what might be set via script tags
    logger.info(
      "Comparing expected SUPABASE_URL with any potential overrides:"
    );
    logger.info("Expected from env.ts:", SUPABASE_URL);
    logger.info(
      "Any global override:",
      (window as any).SUPABASE_URL ||
        (window as any).supabaseUrl ||
        "none found"
    );
    logger.info("=================================================");
  }, []);

  // This component doesn't render anything
  return null;
}

// Global flag to track initial page load
// Keeping initialization code for backward compatibility
if (typeof window !== "undefined") {
  // @ts-ignore - Adding a custom property to window
  window.petdocument_initial_load = true;

  // Reset the flag after 3 seconds
  setTimeout(() => {
    // @ts-ignore - Accessing custom property
    window.petdocument_initial_load = false;
  }, 3000);
}

function App() {
  // Refresh session on app start to ensure we have a valid token
  useEffect(() => {
    const refreshSessionOnStart = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (data.session) {
          // Proactively refresh the token if it exists
          const refreshResult = await supabase.auth.refreshSession();
          if (refreshResult.error) {
            logger.error(
              "Error refreshing session on app start:",
              refreshResult.error
            );
          } else {
            logger.info("Session refreshed successfully on app start");
          }
        } else {
          logger.info("No active session to refresh on app start");
        }
      } catch (err) {
        logger.error("Unexpected error refreshing session on app start:", err);
      }
    };

    refreshSessionOnStart();
  }, []);

  // Handle auth redirects for password reset
  const [initializing, setInitializing] = useState(true);

  // Initialize Android debugging
  useEffect(() => {
    // Log initial app state
    if (typeof window !== "undefined") {
      logger.info("App component mounted");
    }
  }, []);

  useEffect(() => {
    // Handle auth redirect for password reset
    if (
      window.location.hash &&
      window.location.hash.includes("type=recovery")
    ) {
      // We'll let the auth context handle the redirect and token storage
      logger.info("Detected recovery flow, redirecting to reset password");

      // The hash will be processed by the Supabase client
      // We just need to make sure we route to the reset-password page after
      const params = new URLSearchParams(window.location.hash.substring(1));
      if (params.get("type") === "recovery") {
        // We'll redirect to reset-password after Supabase processes the hash
        setTimeout(() => {
          window.location.href = "/reset-password";
        }, 500); // Small delay to allow Supabase to process the hash
      }
    }
    setInitializing(false);
  }, []);

  // Don't render anything while handling recovery redirect
  if (
    initializing &&
    window.location.hash &&
    window.location.hash.includes("type=recovery")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Processing recovery link...
      </div>
    );
  }

  useEffect(() => {
    // Store a flag when the page becomes hidden (user navigates away)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        sessionStorage.setItem("wasHidden", "true");
      } else {
        // When page becomes visible again
        const wasHidden = sessionStorage.getItem("wasHidden");
        if (wasHidden === "true") {
          // Clear the flag
          sessionStorage.removeItem("wasHidden");

          // Prevent the refresh by stopping any pending navigation
          const preventReload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            return (e.returnValue = "");
          };

          window.addEventListener("beforeunload", preventReload);

          // Remove the event listener after a short delay
          setTimeout(() => {
            window.removeEventListener("beforeunload", preventReload);
          }, 100);
        }
      }
    };

    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AnalyticsProvider>
              <UserPreferencesProvider>
                <PetsProvider>
                  <HealthProvider>
                    <DocumentsProvider>
                      <WeightUnitProvider>
                        <ReminderProvider>
                        {/* Google Search Console Verification */}
                        <GoogleVerification />

                        <LovableDebugger />

                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/verify-email" element={<VerifyEmail />} />
                          <Route path="/verify-handler" element={<VerifyHandler />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/reset-password" element={<ResetPassword />} />
                          <Route path="/onboarding" element={<OnboardingFlow />} />
                          <Route path="/processing-registration" element={<ProcessingRegistration />} />
                          <Route path="/faq" element={<FAQ />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/features" element={<Features />} />
                          <Route path="/benefits" element={<Benefits />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/documents/shared/:id" element={<SharedDocument />} />
                          <Route path="/shared/:shareId/*" element={<SharedDocument />} />
                          <Route path="/shared/:shareId" element={<SharedDocument />} />
                          <Route path="/shared/debug/:shareId" element={<SharedDocumentDebug />} />
                          <Route path="/terms" element={<Terms />} />
                          <Route path="/privacy" element={<Privacy />} />

                          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                          
                          {/* Admin routes */}
                          <Route path="/admin" element={<RequireAuth requireAdmin={true}><AdminDashboard /></RequireAuth>} />
                          <Route path="/admin/users" element={<RequireAuth requireAdmin={true}><AdminUsers /></RequireAuth>} />
                          <Route path="/admin/settings" element={<RequireAuth requireAdmin={true}><AdminSettings /></RequireAuth>} />
                          <Route path="/admin/reports" element={<RequireAuth requireAdmin={true}><AdminReports /></RequireAuth>} />
                          <Route path="/admin/system-status" element={<RequireAuth requireAdmin={true}><SystemStatus /></RequireAuth>} />
                          
                          {/* Protected routes */}
                          <Route element={<RequireAuth><Outlet /></RequireAuth>}>
                            <Route path="/pets" element={<Pets />} />
                            <Route path="/pets/:petId" element={<PetDetails />} />
                            <Route path="/reminders" element={<Reminders />} />
                            <Route path="/documents" element={<Documents />} />
                            <Route path="/upload" element={<AndroidUploadPage />} />
                            <Route path="/ios-upload" element={<IOSUploadPage />} />
                            <Route path="/health-check" element={<HealthCheck />} />
                          </Route>
                          
                          {/* Authenticated routes */}
                          <Route element={<RequireAuth><Outlet /></RequireAuth>}>
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/referrals" element={<Referrals />} />
                          </Route>
                          
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                        <Toaster position="top-right" />
                        </ReminderProvider>
                      </WeightUnitProvider>
                    </DocumentsProvider>
                  </HealthProvider>
                </PetsProvider>
              </UserPreferencesProvider>
            </AnalyticsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
}

export default App;
