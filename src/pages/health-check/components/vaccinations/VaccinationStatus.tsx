
import React from 'react';
import { Vaccination } from '@/utils/types';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface VaccinationStatusProps {
  vaccinations: Vaccination[];
  overdueCount: number;
  upcomingCount: number;
}

const VaccinationStatus: React.FC<VaccinationStatusProps> = ({
  vaccinations,
  overdueCount,
  upcomingCount
}) => {
  const hasVaccinations = vaccinations.length > 0;
  const protectionPercentage = hasVaccinations 
    ? ((vaccinations.length - overdueCount) / vaccinations.length) * 100
    : 0;
  
  return (
    <div className="p-4 rounded-lg bg-muted/30">
      <h3 className="text-lg font-medium mb-3">Vaccination Status</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {overdueCount > 0 ? (
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            )}
            <span className="font-medium">Protection Status</span>
          </div>
          <span className={overdueCount > 0 ? "text-orange-600 font-medium" : "text-green-600 font-medium"}>
            {overdueCount > 0 ? `${overdueCount} Overdue` : "Up to date"}
          </span>
        </div>
        
        <Progress value={protectionPercentage} className="h-2" />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Upcoming: {upcomingCount}</span>
          </div>
          <div>Total: {vaccinations.length}</div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationStatus;
