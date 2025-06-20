
import React from 'react';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

interface CameraErrorProps {
  errorMessage: string;
  onCancel: () => void;
}

const CameraError: React.FC<CameraErrorProps> = ({ errorMessage, onCancel }) => {
  return (
    <div className="text-center py-4">
      <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-500 mb-4">{errorMessage}</p>
      <Button variant="outline" onClick={onCancel}>Close</Button>
    </div>
  );
};

export default CameraError;
