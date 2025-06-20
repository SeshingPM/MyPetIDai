
import React from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './NavLinks';
import AuthButtons from './AuthButtons';

interface DesktopNavProps {
  isAuthenticated: boolean;
  scrollToSection: (sectionId: string) => void;
  handleSignOut: (e: React.MouseEvent) => Promise<void>;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ 
  isAuthenticated, 
  scrollToSection,
  handleSignOut
}) => {
  return (
    <nav className="hidden md:flex items-center gap-8">
      <NavLinks isAuthenticated={isAuthenticated} scrollToSection={scrollToSection} />
      
      <div className="flex items-center gap-3">
        <AuthButtons isAuthenticated={isAuthenticated} handleSignOut={handleSignOut} />
      </div>
    </nav>
  );
};

export default DesktopNav;
