import React, { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "./components/DashboardHeader";
import LazyTabs from "./components/LazyTabs";
import { DashboardProviders } from "./contexts/DashboardProviders";
import AppToaster from "@/components/common/AppToaster";
import ErrorBoundary from "@/components/ui-custom/ErrorBoundary";
import ErrorFallback from "./components/ErrorFallback";
import { useAuth } from "@/contexts/AuthContext";

// Optimized background blurs for better performance - especially on mobile
const BackgroundEffects = memo(() => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <div className="absolute -top-40 -right-20 w-60 h-60 bg-primary/10 rounded-full filter blur-2xl opacity-20"></div>
    <div className="absolute top-60 -left-20 w-60 h-60 bg-pet-purple/20 rounded-full filter blur-2xl opacity-30"></div>
    <div className="absolute bottom-0 right-10 w-40 h-40 bg-pet-blue/20 rounded-full filter blur-2xl opacity-20"></div>
  </div>
));

// Memoized header for better performance
const MemoizedHeader = memo(DashboardHeader);

// Dashboard component with streamlined code - all subscription logic removed

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Extra authentication check for direct navigation to dashboard
  useEffect(() => {
    if (!isLoading && !user) {
      console.log("User not authenticated, redirecting from dashboard");
      navigate("/login", { state: { from: "/dashboard" } });
    }
  }, [user, isLoading, navigate]);

  // Subscription success handling removed - now a free product
  
  // Grace period and subscription checks removed - now a free product
  
  // Subscription checks removed - all users have full access

  const handleError = (error: Error) => {
    // Error silently handled by error boundary
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <ErrorBoundary
          fallback={({ error, resetErrorBoundary }) => (
            <ErrorFallback
              error={error}
              resetErrorBoundary={resetErrorBoundary}
            />
          )}
          onError={handleError}
        >
          <DashboardProviders>
            <div className="relative isolate overflow-hidden">
              {/* Optimized background blurs */}
              <BackgroundEffects />

              <MemoizedHeader />
              <LazyTabs />
            </div>
          </DashboardProviders>
        </ErrorBoundary>
        <AppToaster position="top-center" />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
