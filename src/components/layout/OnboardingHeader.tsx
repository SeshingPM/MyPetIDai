import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Header component specifically designed for onboarding flow
 * Features logo on left and Home button on right
 */
const OnboardingHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo on the left */}
          <Link 
            to="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <CreditCard className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-gray-900">
              MyPetID.ai
            </span>
          </Link>

          {/* Home button on the right */}
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default OnboardingHeader;
