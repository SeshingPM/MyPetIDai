
import React from 'react';
import { AlertCircle } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { getComparisonData, getAllFeatures } from './comparison/comparisonData';
import ComparisonTable from './comparison/ComparisonTable';
import MobileComparisonCard from './comparison/MobileComparisonCard';
import { useIsMobile } from '@/hooks/use-mobile';

const ComparisonTool: React.FC = () => {
  const comparisonsData = getComparisonData();
  const features = getAllFeatures(comparisonsData);
  const isMobile = useIsMobile();

  return (
    <div className="max-w-5xl mx-auto px-4">
      <FadeIn>
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Why Choose My Pet ID?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See how our complete pet document platform compares to alternatives for managing your pet's important information
          </p>
        </div>

        {isMobile ? (
          // Mobile view - cards
          <div className="w-full">
            {comparisonsData.map((item, index) => (
              <FadeIn key={index} delay={index * 50}>
                <MobileComparisonCard item={item} />
              </FadeIn>
            ))}
          </div>
        ) : (
          // Desktop view - table
          <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
            <ComparisonTable 
              comparisonsData={comparisonsData} 
              features={features} 
            />
          </div>
        )}
        
        <div className="flex justify-center mt-6">
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 max-w-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                This side-by-side comparison shows how My Pet ID provides a comprehensive solution 
                compared to traditional approaches, general apps, and pet service portals.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default ComparisonTool;