
import React from 'react';
import { Bell, CalendarCheck, CalendarClock, CalendarX, Archive } from 'lucide-react';

const ReminderColorKey: React.FC = () => {
  return (
    <div className="flex flex-wrap gap-3 mb-4 text-xs sm:text-sm">
      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
        <div className="bg-amber-100 rounded-full p-1.5">
          <CalendarClock size={14} className="text-amber-600" />
        </div>
        <span>Today</span>
      </div>
      
      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
        <div className="bg-blue-100 rounded-full p-1.5">
          <Bell size={14} className="text-blue-600" />
        </div>
        <span>Upcoming</span>
      </div>
      
      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
        <div className="bg-red-100 rounded-full p-1.5">
          <CalendarX size={14} className="text-red-600" />
        </div>
        <span>Overdue</span>
      </div>
      
      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
        <div className="bg-green-100 rounded-full p-1.5">
          <CalendarCheck size={14} className="text-green-600" />
        </div>
        <span>Completed</span>
      </div>
      
      <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
        <div className="bg-gray-100 rounded-full p-1.5">
          <Archive size={14} className="text-gray-600" />
        </div>
        <span>Archived</span>
      </div>
    </div>
  );
};

export default ReminderColorKey;
