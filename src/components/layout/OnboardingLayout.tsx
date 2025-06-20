import React from 'react';
import OnboardingHeader from './OnboardingHeader';
import Footer from './Footer';

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout wrapper for onboarding flow pages
 * Provides consistent header with logo and Home button, plus footer
 */
const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/20 flex flex-col">
      <OnboardingHeader />
      
      {/* Main content area with top padding to account for fixed header */}
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OnboardingLayout;
