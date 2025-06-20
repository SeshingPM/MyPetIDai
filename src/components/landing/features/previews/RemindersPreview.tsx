
import React from 'react';
import { Calendar, Clock, Bell, PawPrint, Stethoscope, Pill } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const RemindersPreview: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="p-4 h-full">
      <div className="mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Upcoming Reminders</h3>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="min-w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Pill size={isMobile ? 14 : 16} className="text-red-700" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="text-xs sm:text-sm font-medium">Medication: Heartworm Pill</div>
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">Today</span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  8:00 AM • Luna
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="min-w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Stethoscope size={isMobile ? 14 : 16} className="text-blue-700" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="text-xs sm:text-sm font-medium">Vet Appointment</div>
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Tomorrow</span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  2:00 PM • Max
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="min-w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Calendar size={isMobile ? 14 : 16} className="text-purple-700" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="text-xs sm:text-sm font-medium">Vaccination Due</div>
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">3 days</span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  Rabies • Bella
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Reminder Settings</h3>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={isMobile ? 14 : 16} className="text-indigo-600" />
                <span className="text-xs font-medium">Email Notifications</span>
              </div>
              <div className="w-8 h-4 bg-indigo-500 rounded-full relative">
                <div className="absolute right-0 top-0 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={isMobile ? 14 : 16} className="text-indigo-600" />
                <span className="text-xs font-medium">SMS Notifications</span>
              </div>
              <div className="w-8 h-4 bg-indigo-500 rounded-full relative">
                <div className="absolute right-0 top-0 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={isMobile ? 14 : 16} className="text-indigo-600" />
                <span className="text-xs font-medium">Default Reminder Time</span>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">8:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersPreview;
