
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<boolean> | boolean;
  title?: string;
  description?: string;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  title = "Permanently delete document?",
  description = "This action cannot be undone. This document will be permanently deleted from your account."
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state on component mount
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset error state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setError(null);
      setIsDeleting(false);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (isDeleting) return;
    
    try {
      setIsDeleting(true);
      setError(null);
      
      // Create a timeout promise to abort if operation takes too long
      const timeoutPromise = new Promise<boolean>((_, reject) => 
        setTimeout(() => reject(new Error('Operation timed out')), 10000)
      );
      
      // Execute the delete operation with timeout safety
      const resultPromise = Promise.resolve(onConfirm());
      const result = await Promise.race([resultPromise, timeoutPromise]);
      
      if (!result) {
        throw new Error('Delete operation failed');
      }
      
      // Close the dialog only on success - but only if component is still mounted
      if (mounted) {
        // Add a slight delay to let state updates process first
        setTimeout(() => {
          onOpenChange(false);
        }, 100);
      }
    } catch (error) {
      console.error('Error during delete confirmation:', error);
      if (mounted) {
        setError('Failed to delete. Please try again.');
        toast.error('Delete operation failed. Please try again.');
      }
    } finally {
      // Always reset the deleting state if component is still mounted
      if (mounted) {
        setTimeout(() => {
          setIsDeleting(false);
        }, 200);
      }
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(newOpen) => {
      // Prevent closing while in progress
      if (isDeleting) return;
      onOpenChange(newOpen);
    }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <div className="text-red-500 text-sm py-2 px-4 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Permanently'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
