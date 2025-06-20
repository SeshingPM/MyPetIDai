
import React, { useEffect, useState, Suspense } from 'react';
import ErrorBoundary from '@/components/ui-custom/ErrorBoundary';
import Header from '@/components/layout/Header';
import PetSidebar from '@/components/layout/sidebar';
import { 
  SidebarProvider, 
  SidebarInset,
  SidebarTrigger 
} from '@/components/ui/sidebar/index';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu } from 'lucide-react';

// Simple loading spinner
const LoadingSpinner = () => (
  <div className="fixed inset-0 bg-white/75 flex items-center justify-center z-50">
    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

// Error fallback component with proper prop types
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const LayoutErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg border border-red-100">
      <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message || "An unexpected error occurred"}</p>
      <button
        onClick={resetErrorBoundary}
        className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [defaultOpen, setDefaultOpen] = useState(!isMobile);
  const [isReady, setIsReady] = useState(false);
  
  // Update sidebar state when mobile status changes
  useEffect(() => {
    setDefaultOpen(!isMobile);
  }, [isMobile]);

  // Defer rendering slightly to prevent UI jank
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary fallback={({ error, resetErrorBoundary }) => (
      <LayoutErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
    )}>
      <SidebarProvider defaultOpen={defaultOpen} open={defaultOpen} onOpenChange={setDefaultOpen}>
        <div className="flex min-h-screen w-full bg-gray-50">
          <PetSidebar />
          <SidebarInset className="overflow-x-hidden overflow-y-auto">
            {/* Mobile floating sidebar trigger with hamburger style */}
            {isMobile && (
              <div className="fixed top-4 right-4 z-50 md:hidden bg-white p-1.5 rounded-full shadow-sm">
                <SidebarTrigger>
                  <button
                    className="flex items-center justify-center"
                    aria-label="Toggle sidebar"
                  >
                    <Menu size={20} className="text-gray-700" />
                    <span className="sr-only">Menu</span>
                  </button>
                </SidebarTrigger>
              </div>
            )}
            
            <Header />
            <div className="flex-1 p-3 sm:p-4 md:p-6 pt-16 sm:pt-4 md:pt-6 overflow-hidden">
              <div className="max-w-full mx-auto">
                <Suspense fallback={<LoadingSpinner />}>
                  {children}
                </Suspense>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  );
};

export default DashboardLayout;
