
import React from 'react';
import { PawPrint, Bell, Search, Calendar, FileText, Activity, Plus, ChevronRight, Settings } from 'lucide-react';

interface DashboardContentProps {
  isMobile: boolean;
}

const FeatureDashboardContent: React.FC<DashboardContentProps> = ({ isMobile }) => {
  return (
    <div className="flex flex-col h-full">
      {/* Dashboard Header - Using blue gradient instead of purple */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-100/80 rounded-lg shadow-sm border border-blue-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <PawPrint size={isMobile ? 16 : 20} className="text-blue-600" />
          <span className="font-semibold text-xs sm:text-sm text-blue-950">PetDocument</span>
        </div>
        
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-white/90 rounded-full border border-blue-100">
          <Search size={14} className="text-blue-400" />
          <span className="text-xs text-blue-500 font-medium">Search documents...</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={isMobile ? 14 : 16} className="text-blue-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-teal-500 rounded-full"></span>
          </div>
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-800">JD</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-5 h-[calc(100%-44px)] sm:h-[calc(100%-60px)] mt-4">
        {/* Sidebar - With different accent colors */}
        <div className="hidden sm:block sm:col-span-3 bg-white rounded-lg p-3 h-full border border-blue-100 shadow-sm">
          <div className="mb-5">
            <h4 className="text-xs uppercase text-blue-600 font-bold mb-2.5 px-2">Documents</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3.5 text-xs sm:text-sm p-2.5 bg-gradient-to-r from-blue-50 to-cyan-100/70 rounded-md text-blue-700 font-medium">
                <FileText size={isMobile ? 14 : 16} className="flex-shrink-0" />
                <span>All Documents</span>
              </div>
              <div className="flex items-center gap-3.5 text-xs sm:text-sm p-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-md">
                <PawPrint size={isMobile ? 14 : 16} className="flex-shrink-0" />
                <span>Pet Records</span>
              </div>
              <div className="flex items-center gap-3.5 text-xs sm:text-sm p-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-md">
                <Activity size={isMobile ? 14 : 16} className="flex-shrink-0" />
                <span>Health Checkups</span>
              </div>
              <div className="flex items-center gap-3.5 text-xs sm:text-sm p-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-md">
                <Calendar size={isMobile ? 14 : 16} className="flex-shrink-0" />
                <span>Vaccination Schedule</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-xs uppercase text-blue-600 font-bold mb-2.5 px-2">Account</h4>
            <div className="flex items-center gap-3.5 text-xs sm:text-sm p-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-md">
              <Settings size={isMobile ? 14 : 16} className="flex-shrink-0" />
              <span>Document Settings</span>
            </div>
          </div>
        </div>
        
        {/* Main Content - Different layout focused on documents */}
        <div className="col-span-1 sm:col-span-9 h-full space-y-3 sm:space-y-4 pr-1 scrollbar-none">
          {/* Mobile Menu Row */}
          <div className="sm:hidden flex items-center justify-between bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <div className="text-xs font-semibold text-blue-800">Documents</div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Search size={12} className="text-blue-600" />
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <Plus size={12} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          {/* Document Categories */}
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-3">Document Categories</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center justify-center py-3 px-2 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-blue-800">Medical</span>
                <span className="text-[10px] text-gray-600">24 files</span>
              </div>
              <div className="flex flex-col items-center justify-center py-3 px-2 bg-cyan-50 rounded-lg border border-cyan-100 hover:shadow-md transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center mb-2">
                  <Calendar size={14} className="text-cyan-600" />
                </div>
                <span className="text-xs font-semibold text-cyan-800">Vaccinations</span>
                <span className="text-[10px] text-gray-600">12 files</span>
              </div>
              <div className="flex flex-col items-center justify-center py-3 px-2 bg-teal-50 rounded-lg border border-teal-100 hover:shadow-md transition-all cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center mb-2">
                  <Activity size={14} className="text-teal-600" />
                </div>
                <span className="text-xs font-semibold text-teal-800">Checkups</span>
                <span className="text-[10px] text-gray-600">8 files</span>
              </div>
            </div>
          </div>
          
          {/* Recent Documents */}
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-800">Recent Documents</h3>
              <div className="flex items-center text-[10px] text-blue-600 hover:text-blue-800 cursor-pointer">
                <span>View All</span>
                <ChevronRight size={12} className="ml-1" />
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 p-2 hover:bg-blue-50/50 rounded-md transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-blue-100">
                  <FileText size={14} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-800">Luna's Vaccination Record</div>
                  <div className="text-[10px] text-gray-600">PDF • Updated 2 days ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-blue-50/50 rounded-md transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-cyan-100">
                  <FileText size={14} className="text-cyan-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-800">Max's Vet Appointment</div>
                  <div className="text-[10px] text-gray-600">PDF • Updated yesterday</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-blue-50/50 rounded-md transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-md flex items-center justify-center bg-teal-100">
                  <FileText size={14} className="text-teal-600" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-gray-800">Bella's Medication Chart</div>
                  <div className="text-[10px] text-gray-600">PDF • Updated today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureDashboardContent;
