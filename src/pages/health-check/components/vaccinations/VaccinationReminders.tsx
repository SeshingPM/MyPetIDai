
import React from 'react';
import { Vaccination } from '@/utils/types';
import { format, differenceInDays } from 'date-fns';
import { Bell, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface VaccinationRemindersProps {
  vaccinations: Vaccination[];
}

const VaccinationReminders: React.FC<VaccinationRemindersProps> = ({ vaccinations }) => {
  const today = new Date();
  
  // Sort by those expiring soonest
  const sortedVaccinations = [...vaccinations].sort((a, b) => {
    if (!a.expirationDate) return 1;
    if (!b.expirationDate) return -1;
    return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
  });

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium flex items-center">
        <Bell className="h-5 w-5 mr-2 text-amber-500" />
        Upcoming Vaccinations
      </h3>
      
      {sortedVaccinations.map((vaccination) => {
        if (!vaccination.expirationDate) return null;
        
        const daysUntilExpiration = differenceInDays(
          new Date(vaccination.expirationDate),
          today
        );
        
        return (
          <Alert key={vaccination.id} variant="default" className="bg-amber-50 border-amber-200">
            <div className="flex items-start">
              <Calendar className="h-4 w-4 mt-0.5 mr-2 text-amber-600" />
              <div>
                <AlertTitle>
                  {vaccination.name} due in {daysUntilExpiration} days
                </AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">
                  Expires on {format(new Date(vaccination.expirationDate), 'MMMM d, yyyy')}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        );
      })}
    </div>
  );
};

export default VaccinationReminders;
