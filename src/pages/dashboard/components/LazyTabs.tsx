
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home, PawPrint, FileText, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorBoundary from '@/components/ui-custom/ErrorBoundary';

// Lazy load tab components with improved error handling
const OverviewTab = lazy(() => import('./tabs/OverviewTab'));
const PetsTab = lazy(() => import('./tabs/PetsTab'));
// Import the DocumentsTab component
const DocumentsTab = lazy(() => import('./tabs/DocumentsTab'));
const HealthCheckTab = lazy(() => import('./tabs/HealthCheckTab'));

// Loading fallback component
const TabLoading = () => (
  <div className="space-y-4 p-1">
    <Skeleton className="h-12 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
    <Skeleton className="h-40 w-full" />
  </div>
);

// Error fallback component with proper prop types
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const TabError: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-800">
    <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
    <p className="mb-4 text-sm">{error.message || "Failed to load this section"}</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md text-red-800 text-sm transition-colors"
    >
      Try again
    </button>
  </div>
);

// No longer needed as we're using TabsTrigger directly

const LazyTabs = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Reset error boundaries when tab changes
  const [errorKey, setErrorKey] = useState(0);
  
  useEffect(() => {
    // Reset error boundaries when tab changes
    setErrorKey(prev => prev + 1);
  }, [activeTab]);
  
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  
  return (
    <Tabs 
      defaultValue="overview" 
      className="space-y-6 mt-4" 
      value={activeTab} 
      onValueChange={handleTabChange}
    >
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-background/80 pt-2 pb-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Home size={18} className="mr-2 sm:mr-2" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="pets">
            <PawPrint size={18} className="mr-2 sm:mr-2" />
            <span className="hidden sm:inline">Pets</span>
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText size={18} className="mr-2 sm:mr-2" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="health">
            <Activity size={18} className="mr-2 sm:mr-2" />
            <span className="hidden sm:inline">Health</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="overview" className="space-y-4 mt-0 pt-0">
        <ErrorBoundary key={`overview-${errorKey}`} fallback={({ error, resetErrorBoundary }) => (
          <TabError error={error} resetErrorBoundary={resetErrorBoundary} />
        )}>
          <Suspense fallback={<TabLoading />}>
            <OverviewTab />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="pets" className="space-y-4 mt-0 pt-0">
        <ErrorBoundary key={`pets-${errorKey}`} fallback={({ error, resetErrorBoundary }) => (
          <TabError error={error} resetErrorBoundary={resetErrorBoundary} />
        )}>
          <Suspense fallback={<TabLoading />}>
            <PetsTab />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="documents" className="space-y-4 mt-0 pt-0">
        <ErrorBoundary key={`documents-${errorKey}`} fallback={({ error, resetErrorBoundary }) => (
          <TabError error={error} resetErrorBoundary={resetErrorBoundary} />
        )}>
          <Suspense fallback={<TabLoading />}>
            <DocumentsTab />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
      
      <TabsContent value="health" className="space-y-4 mt-0 pt-0">
        <ErrorBoundary key={`health-${errorKey}`} fallback={({ error, resetErrorBoundary }) => (
          <TabError error={error} resetErrorBoundary={resetErrorBoundary} />
        )}>
          <Suspense fallback={<TabLoading />}>
            <HealthCheckTab />
          </Suspense>
        </ErrorBoundary>
      </TabsContent>
    </Tabs>
  );
};

export default LazyTabs;
