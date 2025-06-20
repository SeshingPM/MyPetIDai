
import React from 'react';
import { BarChart3, PawPrint, FileText, Activity, Calendar, Settings } from 'lucide-react';

interface DashboardSidebarProps {
  isMobile: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isMobile }) => {
  return (
    <div className="hidden sm:block sm:col-span-3 bg-white rounded-lg p-3 h-full border border-gray-100 shadow-sm overflow-hidden">
      <div className="mb-5">
        <h4 className="text-xs uppercase text-gray-600 font-bold mb-2 px-2">Menu</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-md text-blue-700 font-medium">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100">
              <BarChart3 size={14} className="text-blue-600" />
            </div>
            <span className="text-xs sm:text-sm whitespace-nowrap font-semibold">Dashboard</span>
          </div>
          
          <div className="flex items-center gap-2 p-2 text-gray-700 hover:bg-pink-50 hover:text-pink-700 transition-colors rounded-md">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-pink-100">
              <PawPrint size={14} className="text-pink-600" />
            </div>
            <span className="text-xs sm:text-sm whitespace-nowrap font-medium">Pets</span>
          </div>
          
          <div className="flex items-center gap-2 p-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors rounded-md">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100">
              <FileText size={14} className="text-indigo-600" />
            </div>
            <span className="text-xs sm:text-sm whitespace-nowrap font-medium">Docs</span>
          </div>
          
          <div className="flex items-center gap-2 p-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors rounded-md">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-green-100">
              <Activity size={14} className="text-green-600" />
            </div>
            <span className="text-xs sm:text-sm whitespace-nowrap font-medium">Health</span>
          </div>
          
          <div className="flex items-center gap-2 p-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors rounded-md">
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-amber-100">
              <Calendar size={14} className="text-amber-600" />
            </div>
            <span className="text-xs sm:text-sm whitespace-nowrap font-medium">Reminders</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-xs uppercase text-gray-600 font-bold mb-2 px-2">Settings</h4>
        <div className="flex items-center gap-2 p-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors rounded-md">
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-purple-100">
            <Settings size={14} className="text-purple-600" />
          </div>
          <span className="text-xs sm:text-sm whitespace-nowrap font-medium">Preferences</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
