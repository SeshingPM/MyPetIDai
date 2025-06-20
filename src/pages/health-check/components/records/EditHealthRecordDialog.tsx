
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useHealth } from '@/contexts/health';
import { type HealthRecord } from '@/contexts/health';
import { toast } from 'sonner';
import { useWeightUnit } from '@/contexts/WeightUnitContext';
import { lbsToKg, kgToLbs } from '@/utils/weight-converter';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import DatePickerField from '../common/DatePickerField';

interface EditHealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: HealthRecord;
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

const EditHealthRecordDialog: React.FC<EditHealthRecordDialogProps> = ({
  open,
  onOpenChange,
  record,
  petName
}) => {
  const { updateHealthRecord } = useHealth();
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
  
  // Set initial form values when record changes
  useEffect(() => {
    if (record) {
      // Convert from kg to the selected unit for display
      const displayWeight = record.weight ?
        (weightUnit === 'lbs' ? kgToLbs(record.weight).toFixed(2) : record.weight.toFixed(2)) : '';
      form.setValue('weight', displayWeight);
      form.setValue('notes', record.notes || '');
      form.setValue('recordDate', new Date(record.recordDate));
    }
  }, [record, form]);
  
  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Convert weight to kg for storage if needed
      const weight = values.weight ? parseFloat(values.weight) : undefined;
      const weightInKg = weight ? 
        (weightUnit === 'lbs' ? lbsToKg(weight) : weight) : 
        undefined;
      
      const success = await updateHealthRecord(record.id, {
        weight: weightInKg,
        notes: values.notes || undefined,
        recordDate: values.recordDate.toISOString(),
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
                {isSubmitting ? 'Updating...' : 'Update Record'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHealthRecordDialog;
