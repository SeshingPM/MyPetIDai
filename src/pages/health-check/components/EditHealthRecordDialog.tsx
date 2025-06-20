
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useHealth } from '@/contexts/health';
import { type HealthRecord } from '@/contexts/health';
import { toast } from 'sonner';

interface EditHealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: HealthRecord;
  petName: string;
}

const EditHealthRecordDialog: React.FC<EditHealthRecordDialogProps> = ({
  open,
  onOpenChange,
  record,
  petName
}) => {
  const { updateHealthRecord } = useHealth();
  const [weight, setWeight] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set initial form values when record changes, converting kg to lbs
  useEffect(() => {
    if (record) {
      // Convert from kg to lbs for display
      setWeight(record.weight ? (record.weight * 2.20462).toFixed(2) : '');
      setNotes(record.notes || '');
    }
  }, [record]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert weight from lbs to kg for storage
      const weightInLbs = weight ? parseFloat(weight) : undefined;
      const weightInKg = weightInLbs ? weightInLbs / 2.20462 : undefined;
      
      const success = await updateHealthRecord(record.id, {
        weight: weightInKg,
        notes: notes || undefined,
      });
      
      if (success) {
        toast.success(`Health record updated for ${petName}`);
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error updating health record:', error);
      toast.error('Failed to update health record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Health Record for {petName}</DialogTitle>
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
              {isSubmitting ? 'Updating...' : 'Update Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHealthRecordDialog;
