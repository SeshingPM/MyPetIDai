
import React, { useCallback } from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { useIsMobile } from '@/hooks/use-mobile';
import FeatureDashboardContent from './FeatureDashboardContent';
import FeatureDecorationElements from './FeatureDecorationElements';

const FeatureDashboardPreview: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Prevent edit mode interactions from bubbling up
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);
  
  return (
    <FadeIn delay={300} direction="up">
      <div className="relative mx-auto w-full h-full" onClick={handleClick}> 
        <div className="shadow-xl border border-indigo-100/60 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-xl transform lg:scale-100 lg:-translate-y-6">
          <div className="relative overflow-hidden rounded-xl" style={{ minHeight: isMobile ? '450px' : '550px' }}> 
            <div className="absolute inset-0 p-4 sm:p-6 md:p-8">
              <FeatureDashboardContent isMobile={isMobile} />
            </div>
          </div>
        </div>
        
        <FeatureDecorationElements />
      </div>
    </FadeIn>
  );
};

export default FeatureDashboardPreview;
