
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

interface NoRemindersSectionProps {
  onAddReminder: () => void;
}

const NoRemindersSection: React.FC<NoRemindersSectionProps> = ({ onAddReminder }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50/50 rounded-xl border border-gray-100">
      <div className="w-16 h-16 rounded-full bg-pet-pink/20 flex items-center justify-center mb-4">
        <Bell size={28} className="text-primary/70" />
      </div>
      <h3 className="text-base font-medium text-gray-700 mb-2">No reminders yet</h3>
      <p className="text-gray-500 mb-4 max-w-md text-sm">
        Add reminders for vet appointments, medications, grooming sessions, and more.
      </p>
      <Button 
        onClick={onAddReminder} 
        className="bg-gradient-to-r from-primary to-primary/80 hover:shadow-md transition-all"
      >
        Add First Reminder
      </Button>
    </div>
  );
};

export default NoRemindersSection;
