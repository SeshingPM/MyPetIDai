
import React from 'react';
import { PawPrint, Bell, Search } from 'lucide-react';

interface DashboardHeaderProps {
  isMobile: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ isMobile }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <PawPrint size={isMobile ? 18 : 22} className="text-blue-600" />
        <span className="font-semibold text-sm sm:text-base text-gray-900">PetDocument</span>
      </div>
      
      <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
        <Search size={16} className="text-gray-500" />
        <span className="text-sm text-gray-500 font-medium">Search...</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell size={isMobile ? 16 : 18} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
        </div>
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">JD</div>
      </div>
    </div>
  );
};

export default DashboardHeader;
