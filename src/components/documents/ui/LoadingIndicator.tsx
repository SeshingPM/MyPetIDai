import React from 'react';
import { Button } from '@/components/ui/button';

interface LoadingIndicatorProps {
  message?: string;
  isIOS?: boolean;
  initializationAttempts?: number;
  isInIframe?: boolean;
  isPrivateMode?: boolean;
  onFallback: () => void;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Starting camera...',
  isIOS = false,
  initializationAttempts = 0,
  isInIframe = false,
  isPrivateMode = false,
  onFallback
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
        <p>{message}</p>
        {isIOS && initializationAttempts > 0 && (
          <p className="mt-2 text-xs text-gray-300">
            This may take a moment on iOS...
          </p>
        )}
        {isIOS && (isInIframe || isPrivateMode) && (
          <Button 
            variant="link" 
            className="text-blue-400 mt-4"
            onClick={onFallback}
          >
            Try file upload instead
          </Button>
        )}
      </div>
    </div>
  );
};

export default LoadingIndicator;
