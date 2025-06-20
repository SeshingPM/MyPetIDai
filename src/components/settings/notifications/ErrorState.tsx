
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => Promise<void>;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="font-medium text-lg mb-2">Failed to load notification preferences</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button 
          variant="outline"
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorState;
