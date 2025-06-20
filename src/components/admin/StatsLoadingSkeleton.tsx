
import React from 'react';
import { Card } from '@/components/ui/card';

export const StatsLoadingSkeleton = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        </Card>
      ))}
    </div>
  );
};
