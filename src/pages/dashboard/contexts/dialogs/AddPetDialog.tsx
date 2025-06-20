
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AddPetForm from '@/components/pets/AddPetForm';
import { toast } from 'sonner';
import { usePets } from '@/contexts/pets';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export interface AddPetDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPetDialog: React.FC<AddPetDialogProps> = ({ isOpen, onClose }) => {
  const { refetchPets } = usePets();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePetSuccess = async (petId?: string) => {
    if (isProcessing) return; // Prevent multiple calls

    try {
      setIsProcessing(true);
      // Refresh the pets list to show the new pet
      if (petId) {
        await refetchPets();
        toast.success(`Pet added successfully!`);
      }
    } catch (error) {
      console.error('Error in handlePetSuccess:', error);
      toast.error('There was an error refreshing the pet list. Please reload the page.');
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50 rounded-lg">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Processing...</span>
          </div>
        )}
        <DialogHeader>
          <DialogTitle>Add a New Pet</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new pet to your dashboard.
          </DialogDescription>
        </DialogHeader>
        <AddPetForm 
          onSuccess={handlePetSuccess}
          onCancel={handleClose}
          isLoading={isProcessing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddPetDialog;
