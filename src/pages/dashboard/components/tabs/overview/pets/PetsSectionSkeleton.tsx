import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PetsSectionSkeleton: React.FC = () => {
  // Create an array to render multiple skeleton cards
  const skeletonItems = Array.from({ length: 4 }, (_, index) => index);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {skeletonItems.map((index) => (
        <div key={index} className="border rounded-lg p-3 animate-pulse">
          <div className="flex flex-col h-full">
            {/* Pet photo skeleton */}
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
            
            {/* Pet name skeleton */}
            <Skeleton className="h-5 w-20 mx-auto mb-2" />
            
            {/* Pet breed and age skeleton */}
            <Skeleton className="h-4 w-24 mx-auto mb-3" />
            
            {/* Pet details skeleton */}
            <div className="space-y-2 mt-auto">
              <div className="flex items-center justify-center">
                <Skeleton className="h-3 w-4 mr-2" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center justify-center">
                <Skeleton className="h-3 w-4 mr-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetsSectionSkeleton;
