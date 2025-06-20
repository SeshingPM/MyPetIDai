
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <Card className="p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold mb-2">{error}</h2>
      <p className="text-gray-500 mb-6">
        The document you're looking for is not available or the link has expired.
      </p>
      <Link to="/">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          Go to Homepage
        </Button>
      </Link>
    </Card>
  );
};

export default ErrorState;
