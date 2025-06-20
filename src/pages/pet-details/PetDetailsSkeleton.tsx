import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PetDetailsSkeleton: React.FC = () => {
  return (
    <div className="container-max pt-4 pb-16">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
      
      {/* Pet photo and details section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Pet photo */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <div className="flex flex-col items-center">
              {/* Pet photo skeleton */}
              <div className="mb-4 w-full relative">
                <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Photo buttons skeleton */}
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Pet details and tabs */}
        <div className="md:col-span-2">
          {/* Pet name and edit button */}
          <div className="flex justify-between items-center mb-2">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-8 w-16" />
          </div>
          
          {/* Pet breed and age */}
          <Skeleton className="h-6 w-48 mb-6" />
          
          {/* Pet details section */}
          <div className="mb-6">
            <Skeleton className="h-7 w-28 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-64" />
              </div>
            </div>
          </div>
          
          {/* Tabs skeleton */}
          <div className="mt-8">
            <Tabs defaultValue="reminders" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="reminders" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Skeleton className="h-5 w-24" />
                </TabsTrigger>
                <TabsTrigger value="health" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Skeleton className="h-5 w-16" />
                </TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Skeleton className="h-5 w-24" />
                </TabsTrigger>
              </TabsList>
              
              {/* Tab content skeleton */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-10 w-32" />
                </div>
                
                {/* Reminders list skeleton */}
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 animate-pulse">
                      <div className="flex justify-between items-center">
                        <div>
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsSkeleton;
