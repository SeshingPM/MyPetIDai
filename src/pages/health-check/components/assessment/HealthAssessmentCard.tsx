import React from 'react';
import { useHealth } from '@/contexts/health';
import { Card, CardContent } from '@/components/ui/card';
import { categorizeVaccinations } from '../vaccinations/utils/dateUtils';
import { ShieldCheck, Stethoscope, Calendar, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isAfter, differenceInDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useReminders } from '@/contexts/reminders';
import { Button } from '@/components/ui/button';

interface HealthAssessmentCardProps {
  petId: string;
  petName: string;
  className?: string;
  onTabChange?: (tabName: string) => void;
}

const HealthAssessmentCard: React.FC<HealthAssessmentCardProps> = ({ 
  petId, 
  petName,
  className,
  onTabChange
}) => {
  const { 
    getHealthRecordsForPet,
    getVaccinationsForPet,
    getMedicalEventsForPet,
    getMedicationsForPet
  } = useHealth();
  const { setIsAddReminderDialogOpen, handleAddReminder } = useReminders();
  
  const healthRecords = getHealthRecordsForPet(petId);
  const vaccinations = getVaccinationsForPet(petId);
  const medicalEvents = getMedicalEventsForPet(petId);
  const medications = getMedicationsForPet(petId);
  
  const sortedRecords = [...healthRecords].sort(
    (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
  );
  const latestRecord = sortedRecords[0];
  
  const hasRecentHealthCheck = latestRecord && 
    differenceInDays(new Date(), new Date(latestRecord.recordDate)) <= 180;
    
  const { overdue, upcoming } = categorizeVaccinations(vaccinations);
  
  const today = new Date();
  const ongoingMedications = medications.filter(med => 
    (!med.endDate || isAfter(new Date(med.endDate), today))
  );
  
  const getOverallStatus = () => {
    if (overdue.length > 0) return 'warning';
    if (!hasRecentHealthCheck) return 'attention';
    return 'good';
  };
  
  const status = getOverallStatus();
  
  const handleAddVaccinationReminder = (vaccinationName: string, dueDate: Date) => {
    handleAddReminder({
      title: `Vaccination due: ${vaccinationName}`,
      date: dueDate,
      petId: petId,
      notes: `Vaccination for ${petName} is due on ${format(dueDate, 'MMMM d, yyyy')}.`
    });
  };

  const handleHealthStatusClick = () => {
    if (onTabChange) onTabChange("records");
  };

  const handleVaccinationsClick = () => {
    if (onTabChange) onTabChange("vaccinations");
  };

  const handleLastCheckupClick = () => {
    if (onTabChange) onTabChange("records");
  };

  const handleAlertClick = (e: React.MouseEvent) => {
    if (onTabChange) onTabChange("records");
  };

  const handleOverdueVaccinationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTabChange) onTabChange("vaccinations");
  };

  const handleUpcomingVaccinationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTabChange) onTabChange("vaccinations");
  };

  const handleCheckupReminderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onTabChange) onTabChange("records");
  };
  
  return (
    <Card className={cn("border-gray-100 shadow-sm overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div 
            className="col-span-1 md:col-span-3 p-4 flex items-center hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={handleHealthStatusClick}
            role="button"
            tabIndex={0}
            aria-label="View health records"
          >
            <div className={cn(
              "p-2 rounded-full mr-3",
              status === 'good' ? "bg-green-100" : status === 'warning' ? "bg-orange-100" : "bg-amber-100"
            )}>
              <ShieldCheck className={cn(
                "h-5 w-5", 
                status === 'good' ? "text-green-500" : status === 'warning' ? "text-orange-500" : "text-amber-500"
              )} />
            </div>
            <div>
              <h3 className="font-medium text-sm">Overall Health</h3>
              <p className={cn(
                "text-sm font-medium",
                status === 'good' ? "text-green-600" : status === 'warning' ? "text-orange-600" : "text-amber-600"
              )}>
                {status === 'good' 
                  ? 'Good' 
                  : status === 'warning' 
                    ? 'Needs attention' 
                    : 'Check-up recommended'}
              </p>
            </div>
          </div>
          
          <div 
            className="col-span-1 md:col-span-3 p-4 flex items-start hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={handleVaccinationsClick}
            role="button"
            tabIndex={0}
            aria-label="View vaccinations"
          >
            <div className="p-2 rounded-full mr-3 mt-0.5 bg-blue-100">
              <Stethoscope className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Vaccinations</h3>
              {vaccinations.length > 0 ? (
                <div className="space-y-1">
                  {overdue.length > 0 && (
                    <p className="text-sm text-orange-600 font-medium">
                      {overdue.length} overdue vaccination{overdue.length !== 1 ? 's' : ''}
                    </p>
                  )}
                  {upcoming.length > 0 && (
                    <p className="text-sm text-amber-600">
                      {upcoming.length} upcoming vaccination{upcoming.length !== 1 ? 's' : ''}
                    </p>
                  )}
                  {overdue.length === 0 && upcoming.length === 0 && (
                    <p className="text-sm text-green-600">All up to date</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No vaccinations recorded</p>
              )}
            </div>
          </div>
          
          <div 
            className="col-span-1 md:col-span-3 p-4 flex items-start hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={handleLastCheckupClick}
            role="button"
            tabIndex={0}
            aria-label="View last check-up"
          >
            <div className="p-2 rounded-full mr-3 mt-0.5 bg-purple-100">
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Last Check-up</h3>
              {latestRecord ? (
                <div>
                  <p className="text-sm">
                    {format(new Date(latestRecord.recordDate), 'MMM d, yyyy')}
                  </p>
                  {!hasRecentHealthCheck && (
                    <p className="text-sm text-amber-600 font-medium mt-1">
                      Check-up recommended
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No records found</p>
              )}
            </div>
          </div>
          
          <div 
            className="col-span-1 md:col-span-3 p-4 flex items-start hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={handleAlertClick}
            role="button"
            tabIndex={0}
            aria-label="View alerts"
          >
            <div className="p-2 rounded-full mr-3 mt-0.5 bg-amber-100">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Alerts</h3>
              {(overdue.length > 0 || upcoming.length > 0 || !hasRecentHealthCheck) ? (
                <div className="space-y-2">
                  {overdue.length > 0 && (
                    <div className="text-sm text-orange-600">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-orange-600 hover:text-orange-700 hover:bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOverdueVaccinationClick(e);
                              }}
                            >
                              Overdue vaccinations
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Go to vaccinations section</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                  
                  {upcoming.length > 0 && upcoming[0].expirationDate && (
                    <div className="text-sm text-amber-600">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-amber-600 hover:text-amber-700 hover:bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpcomingVaccinationClick(e);
                              }}
                            >
                              {upcoming[0].name} due soon
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Go to vaccinations section</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                  
                  {!hasRecentHealthCheck && (
                    <div className="text-sm text-amber-600">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-amber-600 hover:text-amber-700 hover:bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckupReminderClick(e);
                              }}
                            >
                              Schedule a check-up
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Go to health records section</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No alerts</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthAssessmentCard;
