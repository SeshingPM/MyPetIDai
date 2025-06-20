
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DocumentGridProps {
  children: React.ReactNode;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="grid gap-5 sm:gap-4 grid-cols-1">
      {children}
    </div>
  );
};

export default DocumentGrid;
