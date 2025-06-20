import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PetsListSkeleton: React.FC = () => {
  // Create an array to render multiple skeleton cards
  const skeletonItems = Array.from({ length: 5 }, (_, index) => index);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {skeletonItems.map((index) => (
        <div key={index} className="aspect-[3/2] border rounded-lg p-4 animate-pulse">
          <div className="flex items-start h-full">
            {/* Pet photo skeleton */}
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full mr-4"></div>
            
            <div className="flex-1 flex flex-col justify-between h-full">
              <div>
                {/* Pet name skeleton */}
                <Skeleton className="h-6 w-24 mb-2" />
                
                {/* Pet breed and age skeleton */}
                <Skeleton className="h-4 w-32 mb-3" />
                
                {/* Pet details skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              
              {/* Action buttons skeleton */}
              <div className="flex justify-end space-x-2 mt-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Add pet card skeleton */}
      <div className="aspect-[3/2] border rounded-lg bg-gray-50">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4" />
            <Skeleton className="h-5 w-24 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetsListSkeleton;
