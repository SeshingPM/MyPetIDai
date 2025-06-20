
import React, { useCallback } from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { useIsMobile } from '@/hooks/use-mobile';
import DashboardContent from './DashboardContent';
import DecorationElements from './DecorationElements';

const DashboardPreview: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Prevent edit mode interactions from bubbling up
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);
  
  return (
    <FadeIn delay={300} direction="up">
      <div className="relative w-full h-full mx-auto" onClick={handleClick}> 
        <div className="shadow-md border border-blue-100/80 bg-gradient-to-br from-white to-blue-50/50 rounded-xl 
          transform lg:translate-x-6 lg:scale-100 xl:scale-100">
          <div className="relative overflow-hidden rounded-xl" 
            style={{ minHeight: isMobile ? '550px' : '640px', maxWidth: isMobile ? '100%' : '980px' }}> 
            <div className="absolute inset-0 p-4 sm:p-5 overflow-hidden">
              <DashboardContent isMobile={isMobile} />
            </div>
          </div>
        </div>
        
        <DecorationElements />
      </div>
    </FadeIn>
  );
};

export default DashboardPreview;
