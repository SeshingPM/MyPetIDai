
import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardMainContent from './DashboardMainContent';

interface DashboardContentProps {
  isMobile: boolean;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ isMobile }) => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <DashboardHeader isMobile={isMobile} />
      
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 h-[calc(100%-60px)] sm:h-[calc(100%-68px)] mt-3 overflow-hidden">
        <DashboardSidebar isMobile={isMobile} />
        <DashboardMainContent isMobile={isMobile} />
      </div>
    </div>
  );
};

export default DashboardContent;
