
import React from 'react';
import ReminderCard, { ReminderProps } from './ReminderCard';

interface RemindersListProps {
  reminders: Omit<ReminderProps, 'onComplete' | 'onDelete' | 'onReschedule' | 'onEdit'>[];
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const RemindersList: React.FC<RemindersListProps> = ({
  reminders,
  onComplete,
  onDelete,
  onReschedule,
  onEdit
}) => {
  // Sort reminders by date (soonest first)
  const sortedReminders = [...reminders].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedReminders.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No reminders</h3>
          <p className="text-gray-500">You don't have any reminders scheduled.</p>
        </div>
      ) : (
        sortedReminders.map(reminder => (
          <ReminderCard
            key={reminder.id}
            id={reminder.id}
            title={reminder.title}
            date={reminder.date}
            petId={reminder.petId}
            petName={reminder.petName}
            notes={reminder.notes}
            archived={reminder.archived}
            onComplete={onComplete}
            onDelete={onDelete}
            onReschedule={onReschedule}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  );
};

export default RemindersList;
