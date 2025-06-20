
import React from 'react';
import { Plus, PawPrint, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useReminders } from '@/contexts/reminders';
import { useDialogs } from '../../contexts/DialogContext';

const AddNewDropdown = () => {
  const { setIsAddReminderDialogOpen } = useReminders();
  const { openAddPetDialog } = useDialogs();

  const handleAddReminder = () => {
    setIsAddReminderDialogOpen(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-1.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-300">
          <Plus className="h-4 w-4" />
          <span>Add New</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border border-gray-100 shadow-lg bg-white/95 backdrop-blur-sm">
        <DropdownMenuItem onClick={openAddPetDialog} className="hover:bg-primary/5 cursor-pointer py-2.5">
          <PawPrint className="h-4 w-4 mr-2 text-primary" />
          <span>Add Pet</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddReminder} className="hover:bg-primary/5 cursor-pointer py-2.5">
          <Bell className="h-4 w-4 mr-2 text-primary" />
          <span>Add Reminder</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AddNewDropdown;
