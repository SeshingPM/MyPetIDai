
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

const DocumentsLoadingState: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <>
      {/* Loading state for filters */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200 animate-pulse">
        <Skeleton className="h-10 w-full mb-4" />
        <div className="flex flex-col md:flex-row gap-3">
          <Skeleton className="h-10 w-full md:w-[200px]" />
          <Skeleton className="h-10 w-full md:w-[200px]" />
        </div>
      </div>
      
      {/* Loading state for stats */}
      <div className="mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-24 hidden md:block" />
        </div>
      </div>
      
      {/* Loading state for documents */}
      <div className={isMobile ? "space-y-4" : "grid grid-cols-1 gap-4 md:grid-cols-2"}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse border border-gray-200">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-8 w-32 mt-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default DocumentsLoadingState;
