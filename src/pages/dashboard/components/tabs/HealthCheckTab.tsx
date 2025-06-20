
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Stethoscope } from 'lucide-react';
import { useHealth } from '@/contexts/health';
import { usePets } from '@/contexts/PetsContext';
import FadeIn from '@/components/animations/FadeIn';

const HealthCheckTab: React.FC = () => {
  const { healthRecords, vaccinations, loading } = useHealth();
  const { pets } = usePets();
  
  // Filter only active pets
  const activePets = pets.filter(pet => !pet.archived);
  
  return (
    <FadeIn delay={200}>
      <div className="grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <Card className="col-span-full flex items-center justify-center h-40">
            <div className="animate-pulse text-gray-400">Loading health data...</div>
          </Card>
        ) : activePets.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto mb-4 bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center">
                <Stethoscope className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Pets Added</h3>
              <p className="text-gray-500 mb-4">Add pets to track their health records and vaccinations</p>
              <Button asChild>
                <Link to="/pets">Add Pets</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {activePets.map(pet => {
              const petHealthRecords = healthRecords.filter(record => record.petId === pet.id);
              const petVaccinations = vaccinations.filter(vax => vax.petId === pet.id);
              
              const hasHealthRecords = petHealthRecords.length > 0;
              const hasVaccinations = petVaccinations.length > 0;
              // Fixed: using expirationDate instead of dueDate
              const hasUpToDateVaccinations = petVaccinations.some(vax => 
                vax.expirationDate && new Date(vax.expirationDate) > new Date()
              );
              
              // Determine health status icon
              const getStatusIcon = () => {
                if (hasHealthRecords && hasUpToDateVaccinations) {
                  return <ShieldCheck className="h-6 w-6 text-green-500" />;
                } else if (hasHealthRecords || hasVaccinations) {
                  return <Activity className="h-6 w-6 text-amber-500" />;
                } else {
                  return <Stethoscope className="h-6 w-6 text-gray-400" />;
                }
              };
              
              return (
                <Card key={pet.id} className="overflow-hidden border-none shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-base font-medium">{pet.name}</CardTitle>
                      {getStatusIcon()}
                    </div>
                    {/* Fixed: using pet.breed or displaying just the breed if pet.type doesn't exist */}
                    <CardDescription>{pet.breed || 'Pet'}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Health Records:</span>
                        <span className="font-medium">{petHealthRecords.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Vaccinations:</span>
                        <span className="font-medium">{petVaccinations.length}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={`/health-check?pet=${pet.id}`}>View Health Details</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            
            <Card className="col-span-full md:col-span-2 lg:col-span-3 bg-gradient-to-r from-primary/10 to-purple-100/30 shadow-sm">
              <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-medium mb-1">Complete Health Check</h3>
                  <p className="text-gray-600">View and manage all pet health records and vaccinations</p>
                </div>
                <Button asChild>
                  <Link to="/health-check">Go to Health Check</Link>
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </FadeIn>
  );
};

export default HealthCheckTab;
