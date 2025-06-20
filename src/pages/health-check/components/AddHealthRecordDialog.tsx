
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useHealth } from '@/contexts/health';
import { toast } from 'sonner';

interface AddHealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petId: string;
  petName: string;
}

const AddHealthRecordDialog: React.FC<AddHealthRecordDialogProps> = ({
  open,
  onOpenChange,
  petId,
  petName
}) => {
  const { addHealthRecord } = useHealth();
  const [weight, setWeight] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert weight to number or undefined if empty
      // Convert from lbs to kg for storage (as the backend expects kg)
      const weightInLbs = weight ? parseFloat(weight) : undefined;
      const weightInKg = weightInLbs ? weightInLbs / 2.20462 : undefined;
      
      const recordId = await addHealthRecord({
        petId,
        weight: weightInKg,
        notes: notes || undefined,
      });
      
      if (recordId) {
        toast.success(`Health record added for ${petName}`);
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error adding health record:', error);
      toast.error('Failed to add health record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setWeight('');
    setNotes('');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Health Record for {petName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (lbs)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter weight in lbs"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about your pet's health"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHealthRecordDialog;
