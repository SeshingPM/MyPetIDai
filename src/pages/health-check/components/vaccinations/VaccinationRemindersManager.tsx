
import React, { useState } from 'react';
import { Vaccination } from '@/utils/types';
import { Button } from '@/components/ui/button';
import { useVaccinationReminders } from '@/hooks/useVaccinationReminders';
import { format } from 'date-fns';
import { Bell, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface VaccinationRemindersManagerProps {
  vaccinations: Vaccination[];
  petId: string;
  petName: string;
}

const VaccinationRemindersManager: React.FC<VaccinationRemindersManagerProps> = ({
  vaccinations,
  petId,
  petName,
}) => {
  const { overdueVaccinations, upcomingVaccinations, createVaccinationReminder } = 
    useVaccinationReminders(vaccinations, petId, petName);
    
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState<Vaccination | null>(null);
  
  const handleCreateReminder = (vaccination: Vaccination) => {
    if (vaccination.expirationDate) {
      createVaccinationReminder(vaccination);
      toast.success(`Reminder created for ${vaccination.name}`);
      setIsOpen(false);
    } else {
      toast.error('This vaccination does not have an expiration date');
    }
  };
  
  const handleOpenDialog = (vaccination: Vaccination) => {
    setSelectedVaccination(vaccination);
    setIsOpen(true);
  };
  
  const reminderNeededVaccinations = [...overdueVaccinations, ...upcomingVaccinations];
  
  if (reminderNeededVaccinations.length === 0) {
    return null;
  }
  
  return (
    <>
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm mb-1">
              {reminderNeededVaccinations.length} vaccination{reminderNeededVaccinations.length !== 1 ? 's' : ''} need{reminderNeededVaccinations.length === 1 ? 's' : ''} attention
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {overdueVaccinations.length > 0 ? 
                `${overdueVaccinations.length} overdue and ` : 
                ''}
              {upcomingVaccinations.length > 0 ? 
                `${upcomingVaccinations.length} upcoming` :
                ''}
            </p>
            <Button 
              size="sm"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => handleOpenDialog(reminderNeededVaccinations[0])}
            >
              <Bell className="mr-2 h-4 w-4" />
              Create Reminders
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Vaccination Reminder</DialogTitle>
            <DialogDescription>
              Set up a reminder for this vaccination due date
            </DialogDescription>
          </DialogHeader>
          
          {selectedVaccination && (
            <div className="py-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Vaccination</p>
                  <p>{selectedVaccination.name}</p>
                </div>
                
                {selectedVaccination.expirationDate && (
                  <div>
                    <p className="text-sm font-medium">Due Date</p>
                    <p>{format(new Date(selectedVaccination.expirationDate), 'MMMM d, yyyy')}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium">Pet</p>
                  <p>{petName}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedVaccination && handleCreateReminder(selectedVaccination)}
              disabled={!selectedVaccination || !selectedVaccination.expirationDate}
            >
              <Bell className="mr-2 h-4 w-4" />
              Create Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VaccinationRemindersManager;
