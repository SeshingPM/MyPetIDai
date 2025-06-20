
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import AddReminderForm from './AddReminderForm';
import EditReminderForm from './EditReminderForm';
import RescheduleReminderForm from './RescheduleReminderForm';
import { useReminders } from '@/contexts/reminders';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ReminderDialogs: React.FC = () => {
  const {
    isAddReminderDialogOpen,
    setIsAddReminderDialogOpen,
    isRescheduleDialogOpen,
    setIsRescheduleDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleAddReminder,
    handleEditReminder,
    selectedReminder,
    handleRescheduleReminder,
    setSelectedReminderId,
    pets,
  } = useReminders();
  
  // Get direct access to user auth state
  const { user } = useAuth();
  
  // Check authentication and valid reminder selection when dialogs are opened
  useEffect(() => {
    console.log('Dialog state change - selectedReminder:', selectedReminder?.id);
    
    if ((isEditDialogOpen || isRescheduleDialogOpen)) {
      if (!user?.id) {
        toast.error('You must be logged in to edit reminders');
        setIsEditDialogOpen(false);
        setIsRescheduleDialogOpen(false);
        setSelectedReminderId(null);
      } else if (!selectedReminder?.id) {
        toast.error('No reminder selected');
        setIsEditDialogOpen(false);
        setIsRescheduleDialogOpen(false);
      }
    }
  }, [isEditDialogOpen, isRescheduleDialogOpen, user?.id, selectedReminder, setIsEditDialogOpen, setIsRescheduleDialogOpen, setSelectedReminderId]);

  // Wrapper function that ensures dialog closes after submission
  // regardless of success or failure
  const handleAddReminderSubmit = (data: any) => {
    Promise.resolve(handleAddReminder(data))
      .finally(() => {
        setIsAddReminderDialogOpen(false);
      });
  };
  
  // Wrapper function for edit reminder submission
  const handleEditReminderSubmit = (data: any) => {
    // Double-check user authentication before submitting
    if (!user?.id) {
      toast.error('You must be logged in to edit a reminder');
      setIsEditDialogOpen(false);
      return;
    }
    
    // Log the reminder ID that's being edited
    console.log('Editing reminder with ID from form data:', data.id);
    
    // Make sure we're using the ID from the form data directly
    Promise.resolve(handleEditReminder({
      ...data,
      reminderId: data.id // Ensure the ID is explicitly passed to the handler
    }))
      .finally(() => {
        setIsEditDialogOpen(false);
      });
  };

  return (
    <>
      <Dialog open={isAddReminderDialogOpen} onOpenChange={setIsAddReminderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
            <DialogDescription>Create a reminder for one of your pets.</DialogDescription>
          </DialogHeader>
          <AddReminderForm
            onSubmit={handleAddReminderSubmit}
            pets={pets}
            onCancel={() => setIsAddReminderDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Reminder</DialogTitle>
            <DialogDescription>Change the date of this reminder.</DialogDescription>
          </DialogHeader>
          {selectedReminder && (
            <RescheduleReminderForm
              reminder={selectedReminder}
              onSubmit={(newDate, reminderId) => {
                // Double-check user authentication before submitting
                if (!user?.id) {
                  toast.error('You must be logged in to reschedule a reminder');
                  setIsRescheduleDialogOpen(false);
                  return;
                }
                console.log('Rescheduling reminder with ID from form:', reminderId);
                // Call handleRescheduleReminder with the explicit reminder ID
                Promise.resolve(handleRescheduleReminder({
                  newDate, // The new date to reschedule to
                  reminderId // The reminder ID to reschedule
                }));
                
                // Close the dialog after submitting
                setIsRescheduleDialogOpen(false);
              }}
              onCancel={() => {
                setIsRescheduleDialogOpen(false);
                setSelectedReminderId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Reminder</DialogTitle>
            <DialogDescription>Update the details of this reminder.</DialogDescription>
          </DialogHeader>
          {selectedReminder && (
            <EditReminderForm
              reminder={selectedReminder}
              onSubmit={handleEditReminderSubmit}
              pets={pets}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedReminderId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReminderDialogs;
