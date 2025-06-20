
import React, { memo } from 'react';
import PetsSection from './overview/PetsSection';
import DocumentsContainer from './overview/DocumentsContainer';
import RemindersSection from './overview/RemindersSection';
import OptimizedHealthSection from './overview/OptimizedHealthSection';

// Performance optimization for overview tab
const OverviewTab: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top section - full width Pets */}
      <div className="w-full">
        <PetsSection />
      </div>
      
      {/* Middle section - Health status */}
      <div className="w-full">
        <OptimizedHealthSection />
      </div>
      
      {/* Bottom row with reminders and documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RemindersSection />
        <DocumentsContainer />
      </div>
    </div>
  );
};

export default memo(OverviewTab);
