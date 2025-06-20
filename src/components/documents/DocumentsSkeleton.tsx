import React from 'react';

const DocumentsSkeleton: React.FC = () => {
  // Create an array of 3 items to render 3 skeleton cards
  const skeletonItems = Array.from({ length: 3 }, (_, index) => index);

  return (
    <div className="space-y-4">
      {skeletonItems.map((index) => (
        <div 
          key={index}
          className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 animate-pulse"
        >
          {/* Document icon and title row */}
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-md bg-gray-200 mr-3"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
          
          {/* Metadata row */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          {/* Tags/categories */}
          <div className="flex mt-3 space-x-2">
            <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
            <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentsSkeleton;
