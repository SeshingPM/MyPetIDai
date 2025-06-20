
import React from 'react';
import { BarChart3, PawPrint, FileText, Activity, Calendar } from 'lucide-react';

interface MobileMenuBarProps {
  isMobile: boolean;
}

const MobileMenuBar: React.FC<MobileMenuBarProps> = ({ isMobile }) => {
  // Prevent edit mode interactions
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  return (
    <div 
      className="flex sm:hidden items-center justify-between bg-white rounded-lg p-3 border border-gray-100/80 shadow-sm mb-4"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100">
          <BarChart3 size={16} className="text-blue-600" />
        </div>
        <span className="text-sm font-semibold text-gray-900">Dashboard</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 bg-pink-100 rounded-full">
          <PawPrint size={16} className="text-pink-600" />
        </div>
        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full">
          <FileText size={16} className="text-indigo-600" />
        </div>
        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
          <Activity size={16} className="text-green-600" />
        </div>
        <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-full">
          <Calendar size={16} className="text-amber-600" />
        </div>
      </div>
    </div>
  );
};

export default MobileMenuBar;
