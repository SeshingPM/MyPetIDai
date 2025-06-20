
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Plus } from 'lucide-react';

interface NoRemindersStateProps {
  onAddReminder: () => void;
}

const NoRemindersState: React.FC<NoRemindersStateProps> = ({ onAddReminder }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center bg-gray-50/80 rounded-xl border border-gray-100">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <Bell size={20} className="text-primary/70" />
      </div>
      <h3 className="text-sm font-medium text-gray-700 mb-1">No upcoming reminders</h3>
      <p className="text-xs text-gray-500 mb-3 max-w-xs">
        Schedule reminders for vet visits, medications, and grooming sessions.
      </p>
      <Button 
        onClick={onAddReminder} 
        variant="outline"
        size="sm"
        className="text-xs border-primary/20 text-primary hover:bg-primary/5"
      >
        <Plus size={14} className="mr-1" />
        Add Reminder
      </Button>
    </div>
  );
};

export default NoRemindersState;
