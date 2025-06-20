
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface DocumentsErrorStateProps {
  error?: Error | null;
  onRetry: () => void;
}

const DocumentsErrorState: React.FC<DocumentsErrorStateProps> = ({ error, onRetry }) => {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-red-700 mb-2">Failed to load documents</h3>
        <p className="text-red-600/80 mb-6 max-w-md mx-auto">
          There was an error loading your documents. This could be due to a network issue or a problem with the server.
          {error && <span className="block mt-2 text-sm font-mono">{error.message}</span>}
        </p>
        <Button 
          variant="outline" 
          onClick={onRetry} 
          className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
};

export default DocumentsErrorState;
