
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileLinksProps {
  scrollToSection: (sectionId: string) => void;
}

const MobileLinks: React.FC<MobileLinksProps> = ({ scrollToSection }) => {
  const location = useLocation();
  
  const links = [
    { name: 'Features', sectionId: '', path: '/features' },
    { name: 'Benefits', sectionId: '', path: '/benefits' },
    { name: 'About', sectionId: '', path: '/about' }
  ];
  
  return (
    <div className="flex flex-col gap-2">
      {links.map(link => {
        return (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              'py-2 px-3 rounded-md text-left transition-colors',
              location.pathname === link.path
                ? 'bg-accent text-primary font-medium' 
                : 'text-gray-800 hover:bg-muted'
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
};

export default MobileLinks;
