
import React from 'react';

const LoadingPhotosState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="animate-pulse flex justify-center">
        <div className="h-24 w-24 bg-gray-200 rounded-md"></div>
      </div>
      <p className="text-gray-500 mt-4">Loading photos...</p>
    </div>
  );
};

export default LoadingPhotosState;
