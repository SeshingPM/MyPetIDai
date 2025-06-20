import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  errorMessage: string;
  onRetry: () => void;
  onFallback: () => void;
  onCancel: () => void;
  showRetry?: boolean;
  isIOS?: boolean;
  initializationAttempts?: number;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  errorMessage,
  onRetry,
  onFallback,
  onCancel,
  showRetry = true,
  isIOS = false,
  initializationAttempts = 0
}) => {
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-80 text-white p-4 text-center"
      style={{ zIndex: 10 }} // Ensure error is on top
    >
      <AlertCircle className="w-12 h-12 mb-2 text-red-500" />
      <h3 className="text-lg font-semibold mb-2">Camera Error</h3>
      <p className="mb-4">{errorMessage}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {/* Only show retry option if we haven't tried too many times */}
        {showRetry && initializationAttempts < 3 && (
          <Button
            type="button"
            variant="outline"
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={onFallback}
        >
          Upload Instead
        </Button>
        <Button
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
      
      {isIOS && (
        <div className="mt-4 text-sm text-gray-300 max-w-xs">
          <p>iOS Tip: Make sure to allow camera access when prompted. If issues persist, try using the "Upload Instead" option.</p>
          {initializationAttempts >= 3 && (
            <p className="mt-2 font-medium text-red-300">Multiple camera initialization attempts failed. Please use the "Upload Instead" option.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
