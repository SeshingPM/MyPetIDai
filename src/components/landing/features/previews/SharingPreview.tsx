
import React from 'react';
import { Share2, Calendar, FileText, Shield, Link, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const SharingPreview: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="p-4 h-full">
      <div className="mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Recently Shared Documents</h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText size={isMobile ? 14 : 16} className="text-blue-600" />
                <span className="text-xs sm:text-sm font-medium">Vaccination Records</span>
              </div>
              <span className="bg-green-100 text-green-700 text-xs py-0.5 px-2 rounded-full flex items-center gap-1">
                <Users size={12} /> Shared
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Shared with: Dr. Johnson</span>
              <span className="text-xs text-gray-500">Expires in 7 days</span>
            </div>
          </div>
          
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText size={isMobile ? 14 : 16} className="text-blue-600" />
                <span className="text-xs sm:text-sm font-medium">Medical History</span>
              </div>
              <span className="bg-green-100 text-green-700 text-xs py-0.5 px-2 rounded-full flex items-center gap-1">
                <Users size={12} /> Shared
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Shared with: Pet Hotel</span>
              <span className="text-xs text-gray-500">Expires in 2 days</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Share a Document</h3>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-200">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">Select Document</label>
                <div className="border border-gray-300 rounded px-2 py-1 text-xs bg-gray-50 text-gray-800">
                  Medical Records - Luna.pdf
                </div>
              </div>
              <div className="w-24">
                <label className="block text-xs font-medium text-gray-700 mb-1">Expiry</label>
                <div className="border border-gray-300 rounded px-2 py-1 text-xs bg-gray-50 text-gray-800 flex items-center justify-between">
                  <span>7 days</span>
                  <Calendar size={12} className="text-gray-500" />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Recipient Email</label>
              <div className="border border-gray-300 rounded px-2 py-1 text-xs bg-gray-50 text-gray-800">
                vet@example.com
              </div>
            </div>
            
            <div className="pt-2">
              <button className="w-full bg-blue-600 text-white text-xs font-medium py-1.5 rounded flex items-center justify-center gap-1">
                <Share2 size={12} />
                Generate Secure Share Link
              </button>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Shield size={12} className="text-green-600" />
                <span>HIPAA compliant sharing</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Link size={12} className="text-blue-600" />
                <span>Link tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharingPreview;
