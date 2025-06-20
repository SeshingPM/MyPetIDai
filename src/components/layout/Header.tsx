
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollNavigation } from '@/hooks/useScrollNavigation';
import { cn } from '@/lib/utils';
import DesktopNav from './navigation/DesktopNav';
import MobileMenu from './navigation/MobileMenu';
import { CreditCard } from 'lucide-react'; // Changed from FileText to CreditCard for Pet ID concept

const Header: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isScrolled, scrollToSection } = useScrollNavigation();
  
  // Now using real auth state
  const isAuthenticated = !!user;

  // Show navigation on landing page, FAQ page, About page, Features page, Benefits page, Contact page, and Pricing page
  const showNavigation = location.pathname === '/' || 
                         location.pathname === '/faq' || 
                         location.pathname === '/about' ||
                         location.pathname === '/features' ||
                         location.pathname === '/benefits' ||
                         location.pathname === '/contact' ||
                         location.pathname === '/pricing';
                         
  // Check if we're on a dashboard/authenticated route that has the sidebar
  const isOnDashboardRoute = location.pathname.startsWith('/dashboard') ||
                             location.pathname.startsWith('/pets') ||
                             location.pathname.startsWith('/documents') ||
                             location.pathname.startsWith('/reminders') ||
                             location.pathname.startsWith('/profile') ||
                             location.pathname.startsWith('/settings') ||
                             location.pathname.startsWith('/health-check') ||
                             location.pathname.startsWith('/referrals');

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      // Error handling is already in the original code
    }
  };

  // Don't render header at all if on dashboard route
  if (isOnDashboardRoute) {
    return null;
  }

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300',
        isScrolled ? 'backdrop-blur-md bg-white/80 shadow-sm' : 'bg-transparent'
      )}
    >
      <div className="container-max flex items-center justify-between">
        {/* Logo on the left */}
        <Link to="/" className="flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl hidden sm:inline-block">MyPetID</span>
        </Link>

        {/* Navigation Components - Shown on landing page, FAQ page, About page, Features page, Benefits page, Contact page, and Pricing page */}
        {showNavigation && (
          <>
            <DesktopNav 
              isAuthenticated={isAuthenticated} 
              scrollToSection={scrollToSection}
              handleSignOut={handleSignOut}
            />
            
            <MobileMenu 
              isAuthenticated={isAuthenticated} 
              scrollToSection={scrollToSection}
              handleSignOut={handleSignOut}
            />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
