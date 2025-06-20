import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Image, ArrowLeft, Activity, Stethoscope, Scale, Syringe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HealthRecord, Vaccination, MedicalEvent } from '@/utils/types';
import { format } from 'date-fns';
import { useWeightUnit } from '@/contexts/WeightUnitContext';
import { kgToLbs, formatWeight } from '@/utils/weight-converter';

interface HealthTabProps {
  petId: string;
  petName: string;
  healthRecords: HealthRecord[];
  vaccinations: Vaccination[];
  medicalEvents: MedicalEvent[];
}

const HealthTab: React.FC<HealthTabProps> = ({ 
  petId, 
  petName, 
  healthRecords, 
  vaccinations, 
  medicalEvents 
}) => {
  const navigate = useNavigate();
  const { weightUnit, toggleWeightUnit } = useWeightUnit();
  
  // Sort records by date (newest first)
  const sortedHealthRecords = [...healthRecords].sort(
    (a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime()
  );
  
  const latestHealthRecord = sortedHealthRecords[0];
  
  // Get upcoming vaccinations (not expired)
  const upcomingVaccinations = vaccinations.filter(v => 
    v.expirationDate && new Date(v.expirationDate) > new Date()
  ).sort((a, b) => 
    new Date(a.expirationDate || '').getTime() - new Date(b.expirationDate || '').getTime()
  );
  
  // Get recent medical events
  const recentMedicalEvents = [...medicalEvents]
    .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
    .slice(0, 3);
  
  const handleNavigateToHealth = () => {
    navigate('/health-check');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold">{petName}'s Health</h2>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleWeightUnit}
            className="flex items-center gap-1.5 ml-2"
          >
            <Scale size={14} />
            {weightUnit === 'lbs' ? 'Switch to kg' : 'Switch to lbs'}
          </Button>
        </div>
        <Button onClick={handleNavigateToHealth}>
          View Complete Health Records
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Latest Health Record Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              Latest Health Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestHealthRecord ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Date: {format(new Date(latestHealthRecord.recordDate), 'MMMM d, yyyy')}
                </p>
                {latestHealthRecord.weight && (
                  <p>Weight: <span className="font-medium">
                    {formatWeight(
                      weightUnit === 'kg' 
                        ? latestHealthRecord.weight 
                        : kgToLbs(latestHealthRecord.weight),
                      weightUnit
                    )}
                  </span></p>
                )}
                {latestHealthRecord.notes && (
                  <div>
                    <p className="font-medium mb-1">Notes:</p>
                    <p className="text-sm">{latestHealthRecord.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                <p>No health records found</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={handleNavigateToHealth}>
                  Add Health Record
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Vaccination Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Syringe className="mr-2 h-5 w-5 text-green-500" />
              Vaccination Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {vaccinations.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Total: {vaccinations.length} vaccination{vaccinations.length !== 1 ? 's' : ''}
                </p>
                
                {upcomingVaccinations.length > 0 ? (
                  <div>
                    <p className="font-medium mb-1">Next due:</p>
                    <div className="space-y-2">
                      {upcomingVaccinations.slice(0, 2).map(vax => (
                        <div key={vax.id} className="flex justify-between items-center">
                          <span>{vax.name}</span>
                          <span className="text-sm font-medium">
                            {vax.expirationDate 
                              ? format(new Date(vax.expirationDate), 'MMM d, yyyy')
                              : 'No expiration'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>No upcoming vaccinations due</p>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                <p>No vaccination records found</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={handleNavigateToHealth}>
                  Add Vaccination
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Medical Events Card */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Stethoscope className="mr-2 h-5 w-5 text-blue-500" />
              Recent Medical Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentMedicalEvents.length > 0 ? (
              <div className="space-y-4">
                {recentMedicalEvents.map(event => (
                  <div key={event.id} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{event.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(event.eventDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <p className="text-sm mb-1">{event.eventType}</p>
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    )}
                  </div>
                ))}
                {medicalEvents.length > 3 && (
                  <div className="text-center pt-2">
                    <Button variant="link" size="sm" onClick={handleNavigateToHealth}>
                      View all {medicalEvents.length} medical events
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                <p>No medical events recorded</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={handleNavigateToHealth}>
                  Add Medical Event
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HealthTab;
