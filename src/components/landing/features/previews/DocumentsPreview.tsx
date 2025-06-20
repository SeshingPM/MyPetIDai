
import React from 'react';
import { FileCheck, FileText, FileLock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const DocumentsPreview: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="p-4 h-full">
      <div className="mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Document Categories</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-800">Medical</span>
              <FileText size={isMobile ? 14 : 16} className="text-blue-600" />
            </div>
            <p className="text-xs text-blue-700">8 files</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-green-800">Insurance</span>
              <FileLock size={isMobile ? 14 : 16} className="text-green-600" />
            </div>
            <p className="text-xs text-green-700">3 files</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-purple-800">Vaccination</span>
              <FileCheck size={isMobile ? 14 : 16} className="text-purple-600" />
            </div>
            <p className="text-xs text-purple-700">5 files</p>
          </div>
        </div>
      </div>
      
      <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-2">Recent Documents</h3>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y">
        {[
          { name: "Vaccination Record", type: "PDF", date: "May 15, 2023", secure: true },
          { name: "Pet Insurance Policy", type: "PDF", date: "Apr 22, 2023", secure: true },
          { name: "Lab Results", type: "PDF", date: "Mar 10, 2023", secure: true },
        ].map((doc, i) => (
          <div key={i} className="p-3 flex items-center justify-between hover:bg-blue-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText size={isMobile ? 14 : 16} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-800">{doc.name}</p>
                <p className="text-xs text-gray-500">{doc.date}</p>
              </div>
            </div>
            {doc.secure && (
              <div className="flex items-center">
                <span className="bg-green-100 text-green-700 text-xs py-0.5 px-2 rounded-full flex items-center gap-1">
                  <FileLock size={12} /> Secure
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsPreview;
