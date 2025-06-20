
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoadingState: React.FC<LoadingStateProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            Loading document share status...
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoadingState;
