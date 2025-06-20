
import React from 'react';
import { Card } from '@/components/ui/card';

const LoadingState: React.FC = () => {
  return (
    <Card className="p-8 text-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2.5"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2.5"></div>
      </div>
    </Card>
  );
};

export default LoadingState;
