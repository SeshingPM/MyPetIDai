
import React from 'react';
import { PawPrint, FileText, Calendar } from 'lucide-react';

interface StatsCardsProps {
  isMobile: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ isMobile }) => {
  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 sm:p-4 shadow-sm border border-blue-200/40">
        <div className="flex justify-between mb-2 sm:mb-3">
          <span className="text-xs sm:text-sm text-blue-800 font-semibold">Total Pets</span>
          <PawPrint size={isMobile ? 14 : 18} className="text-blue-600" />
        </div>
        <div className="text-base sm:text-xl font-bold text-blue-900">3</div>
      </div>
      <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-lg p-3 sm:p-4 shadow-sm border border-cyan-200/40">
        <div className="flex justify-between mb-2 sm:mb-3">
          <span className="text-xs sm:text-sm text-cyan-800 font-semibold">Documents</span>
          <FileText size={isMobile ? 14 : 18} className="text-cyan-600" />
        </div>
        <div className="text-base sm:text-xl font-bold text-cyan-900">12</div>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-lg p-3 sm:p-4 shadow-sm border border-indigo-200/40">
        <div className="flex justify-between mb-2 sm:mb-3">
          <span className="text-xs sm:text-sm text-indigo-800 font-semibold">Reminders</span>
          <Calendar size={isMobile ? 14 : 18} className="text-indigo-600" />
        </div>
        <div className="text-base sm:text-xl font-bold text-indigo-900">5</div>
      </div>
    </div>
  );
};

export default StatsCards;
