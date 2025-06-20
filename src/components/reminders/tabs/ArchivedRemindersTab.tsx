
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Archive } from 'lucide-react';
import RemindersList from '../RemindersList';
import { useReminders } from '@/contexts/reminders';

const ArchivedRemindersTab: React.FC = () => {
  const { archivedReminders, handleClearArchive } = useReminders();

  return (
    <div className="space-y-4 animate-fade-in-up">
      {archivedReminders.length > 0 ? (
        <>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 rounded-full p-1.5">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>
              <h2 className="text-lg font-medium text-gray-700">Archived Reminders</h2>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleClearArchive}
              className="flex items-center gap-1 shadow-sm"
            >
              <Archive size={16} />
              Clear Archive
            </Button>
          </div>
          <Separator className="my-4" />
          <RemindersList reminders={archivedReminders} />
        </>
      ) : (
        <div className="text-center py-12 mt-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <Archive className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No archived reminders</h3>
          <p className="text-gray-500">Completed reminders will appear here</p>
        </div>
      )}
    </div>
  );
};

export default ArchivedRemindersTab;
