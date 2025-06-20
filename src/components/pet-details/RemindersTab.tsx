
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AddReminderForm from '@/components/reminders/AddReminderForm';
import RemindersList from '@/components/reminders/RemindersList';
import { useReminders } from '@/contexts/reminders';

interface RemindersTabProps {
  petId: string;
  petName: string;
}

const RemindersTab: React.FC<RemindersTabProps> = ({ petId, petName }) => {
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const { 
    handleAddReminder, 
    reminders,
    handleCompleteReminder, 
    handleOpenRescheduleDialog,
    handleOpenEditDialog 
  } = useReminders();

  // Filter reminders for this specific pet
  const petReminders = reminders.filter(
    reminder => reminder.petId === petId && !reminder.archived
  );

  const handleAddReminderSubmit = (data: any) => {
    // Add reminder and then close the dialog regardless of success or failure
    Promise.resolve(handleAddReminder(data))
      .finally(() => {
        setIsAddReminderOpen(false);
      });
  };

  return (
    <>
      <GlassCard>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Reminders</h2>
          <Button 
            size="sm" 
            onClick={() => setIsAddReminderOpen(true)}
            className="gap-1"
          >
            <Plus size={16} />
            Add Reminder
          </Button>
        </div>
        
        {petReminders.length > 0 ? (
          <RemindersList
            reminders={petReminders}
            onComplete={handleCompleteReminder}
            onReschedule={handleOpenRescheduleDialog}
            onEdit={handleOpenEditDialog}
          />
        ) : (
          <div className="text-center py-8">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No reminders yet</h3>
            <p className="text-gray-500 mb-6">
              Add reminders for vet appointments, medications, and more.
            </p>
            <Button onClick={() => setIsAddReminderOpen(true)}>
              <Calendar size={16} className="mr-2" />
              Add Reminder
            </Button>
          </div>
        )}
      </GlassCard>

      {/* Add Reminder Dialog */}
      <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Reminder for {petName}</DialogTitle>
            <DialogDescription>
              Create a new reminder for vet visits, medications, or other pet care tasks.
            </DialogDescription>
          </DialogHeader>
          <AddReminderForm 
            onSubmit={handleAddReminderSubmit} 
            pets={[{ id: petId, name: petName }]} 
            onCancel={() => setIsAddReminderOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RemindersTab;
