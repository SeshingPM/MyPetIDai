
import React from 'react';
import { useReminders } from '@/contexts/reminders';
import ReminderCard from '@/components/reminders/ReminderCard';
import NoRemindersState from './NoRemindersState';
import RemindersSkeleton from './RemindersSkeleton';
import { Reminder } from '@/contexts/reminders/types';
import { AlertCircle } from 'lucide-react';

interface RemindersSectionContentProps {
  displayReminders: Reminder[];
  loading: boolean;
  error: string | null;
}

const RemindersSectionContent: React.FC<RemindersSectionContentProps> = ({
  displayReminders,
  loading,
  error
}) => {
  const { 
    handleCompleteReminder, 
    handleOpenRescheduleDialog,
    handleOpenEditDialog,
    setIsAddReminderDialogOpen 
  } = useReminders();

  if (loading) {
    return <RemindersSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-sm text-red-600 flex items-center gap-2">
        <AlertCircle size={16} />
        <span>Unable to load reminders. Please try again later.</span>
      </div>
    );
  }

  if (displayReminders.length === 0) {
    return (
      <NoRemindersState 
        onAddReminder={() => setIsAddReminderDialogOpen(true)} 
      />
    );
  }

  return (
    <div className="space-y-3">
      {displayReminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          id={reminder.id}
          title={reminder.title}
          date={reminder.date}
          petId={reminder.petId}
          petName={reminder.petName}
          notes={reminder.notes}
          onComplete={handleCompleteReminder}
          onReschedule={handleOpenRescheduleDialog}
          onEdit={(id) => {
            console.log('Dashboard: Edit button clicked for reminder ID:', id);
            handleOpenEditDialog(id);
          }}
          dashboardView={true} // Use the dashboard view layout
        />
      ))}
    </div>
  );
};

export default RemindersSectionContent;
