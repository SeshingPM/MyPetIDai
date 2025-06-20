
import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import MobileLinks from './MobileLinks';
import AuthButtons from './AuthButtons';

interface MobileMenuProps {
  scrollToSection: (sectionId: string) => void;
  isAuthenticated: boolean;
  handleSignOut: (e: React.MouseEvent) => Promise<void>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  scrollToSection, 
  isAuthenticated,
  handleSignOut
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button 
          className="md:hidden text-gray-700 bg-white p-2.5 rounded-md shadow-sm border border-gray-200"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] max-w-xs px-4 py-6">
        <div className="flex flex-col gap-4">
          <MobileLinks scrollToSection={scrollToSection} />
          
          <div className="flex flex-col gap-3 mt-4">
            <AuthButtons 
              isAuthenticated={isAuthenticated} 
              isMobile={true} 
              handleSignOut={handleSignOut} 
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
