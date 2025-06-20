
import React from 'react';
import { CalendarClock, Activity, Shield, Stethoscope, Check, Clock, Info } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import FeatureDecorationElements from '../../hero/dashboard-preview/FeatureDecorationElements';

const HealthCheckPreview: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="p-4 h-full relative">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <FeatureDecorationElements />
      </div>
      
      <div className="relative z-10">
        {/* Health Assessment Section */}
        <div className="mb-4">
          <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Health Assessment</h3>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200 shadow-sm">
            <div className="flex items-center mb-2">
              <Shield size={isMobile ? 14 : 16} className="text-green-600 mr-2" />
              <span className="text-xs font-medium text-green-800">Overall Health: Good</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-700">Vaccination Status</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-xs text-green-700 ml-1">85%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-700">Medical Records</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <span className="text-xs text-green-700 ml-1">100%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-green-700">Medication Adherence</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-xs text-green-700 ml-1">92%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Medical History Timeline */}
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Medical Timeline</h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y">
          {/* Timeline Items */}
          <div className="p-3">
            <div className="flex items-start">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <Stethoscope size={isMobile ? 12 : 14} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-medium text-gray-800">Annual Check-up</div>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">All vitals normal, excellent health condition</p>
              </div>
            </div>
          </div>
          
          <div className="p-3">
            <div className="flex items-start">
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <Activity size={isMobile ? 12 : 14} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-medium text-gray-800">Vaccination</div>
                  <span className="text-xs text-gray-500">2 weeks ago</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Rabies vaccine - Valid for 3 years</p>
              </div>
            </div>
          </div>
          
          <div className="p-3">
            <div className="flex items-start">
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                <Clock size={isMobile ? 12 : 14} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-medium text-gray-800">Upcoming: Dental Cleaning</div>
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">In 3 days</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Regular dental maintenance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckPreview;
