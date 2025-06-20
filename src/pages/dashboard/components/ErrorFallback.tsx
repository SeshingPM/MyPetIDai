
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="p-4 border border-red-300 rounded bg-red-50 text-red-800">
      <h2 className="text-lg font-medium">Something went wrong</h2>
      <p className="mt-1 text-sm">We've encountered an error. Please try again or refresh the page.</p>
      <Button 
        className="mt-3 bg-red-600 hover:bg-red-700"
        onClick={resetErrorBoundary}
      >
        Try again
      </Button>
    </div>
  );
};

export default ErrorFallback;
