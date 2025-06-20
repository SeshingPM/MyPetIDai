
import React from 'react';

interface PetsPreviewProps {
  isMobile: boolean;
}

const PetsPreview: React.FC<PetsPreviewProps> = ({ isMobile }) => {
  return (
    <div className="mb-3">
      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 px-0.5">Your Pets</h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-2.5 sm:p-3 flex flex-col hover:shadow-md transition-all border border-gray-100/80 hover:border-blue-200 hover:scale-[1.02] cursor-pointer">
            <div className="w-full h-12 sm:h-20 rounded-md mb-2 flex items-center justify-center overflow-hidden">
              {i === 0 && (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-200 flex items-center justify-center">
                  <span className="text-lg sm:text-3xl font-semibold text-white drop-shadow-sm">L</span>
                </div>
              )}
              {i === 1 && (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-200 flex items-center justify-center">
                  <span className="text-lg sm:text-3xl font-semibold text-white drop-shadow-sm">M</span>
                </div>
              )}
              {i === 2 && (
                <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-200 flex items-center justify-center">
                  <span className="text-lg sm:text-3xl font-semibold text-white drop-shadow-sm">B</span>
                </div>
              )}
            </div>
            <span className="font-semibold text-[11px] sm:text-sm text-gray-900">{["Luna", "Max", "Bella"][i]}</span>
            <span className="text-[9px] sm:text-xs text-gray-700 mt-0.5 sm:mt-1">{["Golden Retriever", "Maine Coon", "Labrador"][i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetsPreview;
