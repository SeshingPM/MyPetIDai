
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavLinksProps {
  isAuthenticated: boolean;
  isMobile?: boolean;
  scrollToSection: (sectionId: string) => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ isAuthenticated, isMobile, scrollToSection }) => {
  const location = useLocation();
  
  const links = [
    { name: 'Features', path: '/features', sectionId: '' },
    { name: 'Benefits', path: '/benefits', sectionId: '' },
    { name: 'About', path: '/about', sectionId: '' }
  ];
  
  return (
    <>
      {links.map(link => {
        return (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              'transition-colors duration-200 hover:text-primary text-sm sm:text-base',
              location.pathname === link.path ? 'text-primary font-medium' : 'text-gray-700'
            )}
          >
            {link.name}
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;