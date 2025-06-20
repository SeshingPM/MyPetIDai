
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface NoDocumentStateProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NoDocumentState: React.FC<NoDocumentStateProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Document</DialogTitle>
          <DialogDescription>
            No document selected to share
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 text-center text-gray-500">
          Please select a document to share
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoDocumentState;
