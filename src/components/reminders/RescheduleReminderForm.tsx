
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Reminder } from '@/contexts/reminders/types';

interface RescheduleReminderFormProps {
  reminder: Reminder;
  onSubmit: (newDate: Date, reminderId: string) => void;
  onCancel: () => void;
}

const RescheduleReminderForm: React.FC<RescheduleReminderFormProps> = ({ 
  reminder, 
  onSubmit, 
  onCancel 
}) => {
  const [newDate, setNewDate] = React.useState<Date>(reminder.date);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Rescheduling reminder with ID:', reminder.id);
    onSubmit(newDate, reminder.id);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium">Reminder Details</div>
        <div className="bg-gray-50 p-3 rounded-md text-sm">
          <div className="font-semibold">{reminder.title}</div>
          {reminder.petName && <div className="text-gray-600">For {reminder.petName}</div>}
          <div className="text-gray-600 mt-1 flex items-center">
            <CalendarIcon size={14} className="mr-1 text-gray-400" />
            <span>Currently set for {format(reminder.date, 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm font-medium">Pick a new date</div>
        <div className="border rounded-md p-2">
          <Calendar
            mode="single"
            selected={newDate}
            onSelect={(date) => date && setNewDate(date)}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            initialFocus
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Reschedule
        </Button>
      </div>
    </form>
  );
};

export default RescheduleReminderForm;
