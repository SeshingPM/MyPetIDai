
import React from 'react';
import { QrCode, Shield, Globe, CreditCard, CheckCircle, Camera, Share2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const IdentityPreview: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="p-4 h-full bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-200/40 rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        {/* Pet ID Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">Digital Pet Identity</h3>
            <div className="flex items-center gap-1">
              <Shield size={14} className="text-green-600" />
              <span className="text-xs text-green-600 font-medium">Verified</span>
            </div>
          </div>
          
          {/* Pet ID Card Design */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-lg p-4 text-white mb-3 relative overflow-hidden">
            {/* Card pattern */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs opacity-80 font-medium">Pet SSN</p>
                  <p className="text-lg font-bold">#PET-2024-7891</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <QrCode size={isMobile ? 24 : 28} className="text-white" />
                </div>
              </div>
              
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold">Luna Martinez</p>
                    <p className="text-xs opacity-80">Golden Retriever • 3 years</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Camera size={16} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            <button className="bg-blue-50 hover:bg-blue-100 rounded-lg p-2 flex flex-col items-center gap-1 transition-colors">
              <Share2 size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Share</span>
            </button>
            <button className="bg-purple-50 hover:bg-purple-100 rounded-lg p-2 flex flex-col items-center gap-1 transition-colors">
              <Globe size={16} className="text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Access</span>
            </button>
            <button className="bg-green-50 hover:bg-green-100 rounded-lg p-2 flex flex-col items-center gap-1 transition-colors">
              <CreditCard size={16} className="text-green-600" />
              <span className="text-xs font-medium text-green-700">Wallet</span>
            </button>
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <h4 className="text-xs font-medium text-gray-700 mb-3">Identity Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-xs text-gray-700">Veterinary Verified</span>
              </div>
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-500" />
                <span className="text-xs text-gray-700">Microchip Linked</span>
              </div>
              <span className="text-xs text-green-600 font-medium">Synced</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-blue-500" />
                <span className="text-xs text-gray-700">Global Recognition</span>
              </div>
              <span className="text-xs text-blue-600 font-medium">Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityPreview;