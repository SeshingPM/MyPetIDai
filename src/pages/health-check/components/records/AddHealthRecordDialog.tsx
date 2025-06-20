
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useHealth } from '@/contexts/health';
import { toast } from 'sonner';
import { useWeightUnit } from '@/contexts/WeightUnitContext';
import { lbsToKg } from '@/utils/weight-converter';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DatePickerField from '../common/DatePickerField';

interface AddHealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petId: string;
  petName: string;
}

const formSchema = z.object({
  weight: z.string().optional(),
  notes: z.string().optional(),
  recordDate: z.date({
    required_error: "Record date is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AddHealthRecordDialog: React.FC<AddHealthRecordDialogProps> = ({
  open,
  onOpenChange,
  petId,
  petName
}) => {
  const { addHealthRecord } = useHealth();
  const { weightUnit } = useWeightUnit();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: '',
      notes: '',
      recordDate: new Date(),
    }
  });
  
  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Convert weight to kg for storage if needed
      const weight = values.weight ? parseFloat(values.weight) : undefined;
      const weightInKg = weight ? 
        (weightUnit === 'lbs' ? lbsToKg(weight) : weight) : 
        undefined;
      
      const recordId = await addHealthRecord({
        petId,
        weight: weightInKg,
        notes: values.notes || undefined,
        recordDate: values.recordDate.toISOString(),
      });
      
      if (recordId) {
        toast.success(`Health record added for ${petName}`);
        form.reset();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error adding health record:', error);
      toast.error('Failed to add health record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSubmitting) {
        if (!newOpen) {
          form.reset();
        }
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Health Record for {petName}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="recordDate"
              render={({ field }) => (
                <DatePickerField
                  form={form}
                  name="recordDate"
                  label="Record Date"
                  placeholder="Select record date"
                />
              )}
            />
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight ({weightUnit})</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                min="0"
                placeholder={`Enter weight in ${weightUnit}`}
                {...form.register('weight')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about your pet's health"
                {...form.register('notes')}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHealthRecordDialog;
