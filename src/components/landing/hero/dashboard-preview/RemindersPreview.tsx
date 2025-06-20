
import React from 'react';
import { Calendar, Pill } from 'lucide-react';

interface RemindersPreviewProps {
  isMobile: boolean;
}

const RemindersPreview: React.FC<RemindersPreviewProps> = ({ isMobile }) => {
  return (
    <div>
      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 px-0.5">Upcoming Reminders</h3>
      <div className="bg-white rounded-lg shadow-sm p-2.5 sm:p-3 border border-gray-100/80">
        <div className="flex items-center gap-2.5 sm:gap-3 border-b border-gray-100 pb-2 mb-2">
          <div className="min-w-6 h-6 sm:min-w-8 sm:h-8 rounded-full bg-blue-100/80 flex items-center justify-center flex-shrink-0">
            <Calendar size={isMobile ? 14 : 16} className="text-blue-700" />
          </div>
          <div className="flex-grow">
            <div className="text-xs sm:text-sm font-semibold text-gray-800">Vet Appointment</div>
            <div className="text-[9px] sm:text-xs text-gray-700">Tomorrow • 2:00 PM</div>
          </div>
          <div className="px-2 py-1 bg-amber-100/70 rounded-full">
            <span className="text-[9px] sm:text-xs text-amber-700 font-semibold">Upcoming</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="min-w-6 h-6 sm:min-w-8 sm:h-8 rounded-full bg-purple-100/80 flex items-center justify-center flex-shrink-0">
            <Pill size={isMobile ? 14 : 16} className="text-purple-700" />
          </div>
          <div className="flex-grow">
            <div className="text-xs sm:text-sm font-semibold text-gray-800">Medication Reminder</div>
            <div className="text-[9px] sm:text-xs text-gray-700">Friday • 8:00 AM</div>
          </div>
          <div className="px-2 py-1 bg-blue-100/70 rounded-full">
            <span className="text-[9px] sm:text-xs text-blue-700 font-semibold">Scheduled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersPreview;
