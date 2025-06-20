
import React, { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, Image, ArrowLeft, Activity } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import { usePets } from '@/contexts/pets';
import { useHealth } from '@/contexts/health';

// Import our components
import PetProfile from '@/components/pet-details/PetProfile';
import RemindersTab from '@/components/pet-details/RemindersTab';
import DocumentsTab from '@/components/pet-details/DocumentsTab';
import PhotosTab from '@/components/pet-details/PhotosTab';
import HealthTab from '@/components/pet-details/HealthTab';

// Pet type definition
interface Pet {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  photoUrl: string;
}

interface PetDetailsContentProps {
  pet: Pet | null;
}

const PetDetailsContent: React.FC<PetDetailsContentProps> = ({ pet }) => {
  const navigate = useNavigate();
  const { deletePet } = usePets();
  const { getHealthRecordsForPet, getVaccinationsForPet, getMedicalEventsForPet } = useHealth();
  const processingRef = useRef<Set<string>>(new Set());

  // Use useCallback to prevent recreation of this function on each render
  const handleDelete = useCallback(() => {
    if (pet) {
      // Extra protection against duplicate operations
      if (processingRef.current.has(pet.id)) {
        console.log('Already processing this pet, skipping duplicate action');
        return;
      }
      
      processingRef.current.add(pet.id);
      deletePet(pet.id);
      
      // Navigate after a short delay to ensure state updates complete
      setTimeout(() => {
        navigate('/pets');
        // Remove from processing after navigation
        processingRef.current.delete(pet.id);
      }, 500);
    }
  }, [pet, deletePet, navigate]);

  if (!pet) return null;

  // Get health data for this pet
  const healthRecords = getHealthRecordsForPet(pet.id);
  const vaccinations = getVaccinationsForPet(pet.id);
  const medicalEvents = getMedicalEventsForPet(pet.id);

  return (
    <main className="pt-16 pb-16">
      <div className="container-max">
        <FadeIn delay={100}>
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => navigate('/pets')}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Pets
          </Button>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Pet Profile Section */}
            <PetProfile pet={pet} onDelete={handleDelete} />
            
            {/* Pet Information Tabs */}
            <div className="w-full md:w-2/3">
              <Tabs defaultValue="reminders" className="w-full">
                {/* Mobile-specific tabs with horizontal scrolling (only visible on small screens) */}
                <div className="relative mb-6 md:hidden">
                  <div className="overflow-x-auto scrollbar-hide px-4">
                    <TabsList className="flex w-max min-w-full border-none bg-transparent p-0 space-x-2">
                      <TabsTrigger 
                        value="reminders" 
                        className="flex-shrink-0 whitespace-nowrap px-4 py-2 text-sm rounded-full"
                      >
                        <Calendar size={16} className="mr-2" /> Reminders
                      </TabsTrigger>
                      <TabsTrigger 
                        value="health" 
                        className="flex-shrink-0 whitespace-nowrap px-4 py-2 text-sm rounded-full"
                      >
                        <Activity size={16} className="mr-2" /> Health
                      </TabsTrigger>
                      <TabsTrigger 
                        value="documents" 
                        className="flex-shrink-0 whitespace-nowrap px-4 py-2 text-sm rounded-full"
                      >
                        <FileText size={16} className="mr-2" /> Documents
                      </TabsTrigger>
                      <TabsTrigger 
                        value="photos" 
                        className="flex-shrink-0 whitespace-nowrap px-4 py-2 text-sm rounded-full"
                      >
                        <Image size={16} className="mr-2" /> Photos
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  {/* Add fade effect on edges for better UX */}
                  <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                  <div className="absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                </div>
                
                {/* Desktop tabs (original styling, only visible on medium screens and up) */}
                <TabsList className="hidden md:grid md:grid-cols-4 mb-6">
                  <TabsTrigger value="reminders" className="text-base">
                    <Calendar size={18} className="mr-2" /> Reminders
                  </TabsTrigger>
                  <TabsTrigger value="health" className="text-base">
                    <Activity size={18} className="mr-2" /> Health
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="text-base">
                    <FileText size={18} className="mr-2" /> Documents
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="text-base">
                    <Image size={18} className="mr-2" /> Photos
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="reminders" className="mt-0">
                  <RemindersTab petId={pet.id} petName={pet.name} />
                </TabsContent>
                
                <TabsContent value="health" className="mt-0">
                  <HealthTab 
                    petId={pet.id} 
                    petName={pet.name} 
                    healthRecords={healthRecords}
                    vaccinations={vaccinations}
                    medicalEvents={medicalEvents}
                  />
                </TabsContent>
                
                <TabsContent value="documents" className="mt-0">
                  <DocumentsTab petId={pet.id} petName={pet.name} />
                </TabsContent>
                
                <TabsContent value="photos" className="mt-0">
                  <PhotosTab petId={pet.id} petName={pet.name} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
};

export default PetDetailsContent;
