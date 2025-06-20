
import React from 'react';
import MobileMenuBar from './MobileMenuBar';
import StatsCards from './StatsCards';
import PetsPreview from './PetsPreview';
import RemindersPreview from './RemindersPreview';

interface DashboardMainContentProps {
  isMobile: boolean;
}

const DashboardMainContent: React.FC<DashboardMainContentProps> = ({ isMobile }) => {
  return (
    <div className="col-span-1 sm:col-span-9 h-full space-y-4 pr-2 overflow-hidden">
      <MobileMenuBar isMobile={isMobile} />
      <StatsCards isMobile={isMobile} />
      <PetsPreview isMobile={isMobile} />
      <RemindersPreview isMobile={isMobile} />
    </div>
  );
};

export default DashboardMainContent;
