
import React from 'react';
import { Shield, QrCode, FileText, Bell, Share2, Calendar, Heart } from 'lucide-react';
import PetIdBadge from '@/components/ui-custom/PetIdBadge';

const PetIdCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-xs mx-auto overflow-hidden transform hover:scale-105 transition-transform duration-300">
      {/* Header - more compact */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-600" size={20} />
          <span className="font-bold text-gray-800 text-base">MyPetID</span>
        </div>
        <PetIdBadge variant="verified" size="md" />
      </div>
      
      {/* Pet Photo & Basic Info - more compact */}
      <div className="px-4 pb-3">
        <div className="relative mb-4">
          <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=200&h=200&fit=crop&crop=face" 
              alt="Sample pet"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="text-center mb-4">
          <h3 className="font-bold text-lg text-gray-800 mb-1">Bella</h3>
          <p className="text-gray-600 text-sm mb-3">Golden Retriever</p>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">Pet SSN</p>
            <p className="font-mono font-bold text-blue-700 text-sm">PET-2024-A7B9X</p>
          </div>
        </div>
      </div>

      {/* Quick Stats - more compact */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-green-50 rounded-lg p-2 border border-green-100">
            <FileText className="h-4 w-4 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-green-800">12</div>
            <div className="text-xs text-green-600">Documents</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-2 border border-orange-100">
            <Bell className="h-4 w-4 text-orange-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-orange-800">3</div>
            <div className="text-xs text-orange-600">Reminders</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
            <Share2 className="h-4 w-4 text-purple-600 mx-auto mb-1" />
            <div className="text-sm font-semibold text-purple-800">5</div>
            <div className="text-xs text-purple-600">Shared</div>
          </div>
        </div>
      </div>

      {/* Recent Activity - more compact */}
      <div className="px-4 pb-3">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Recent Activity</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Vaccination record updated</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Shared with Dr. Smith</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Reminder: Flea treatment</span>
          </div>
        </div>
      </div>

      {/* Quick Actions - more compact */}
      <div className="px-4 pb-3">
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors">
            <Calendar className="h-3 w-3" />
            Add Reminder
          </button>
          <button className="flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2 px-3 rounded-lg text-xs font-medium transition-colors">
            <Heart className="h-3 w-3" />
            Health Check
          </button>
        </div>
      </div>
      
      {/* QR Code - more compact */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-xs bg-gray-50 py-2 rounded-lg">
          <QrCode size={14} />
          <span>Scan for instant verification</span>
        </div>
      </div>
      
      {/* Bottom accent */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
    </div>
  );
};

export default PetIdCard;
