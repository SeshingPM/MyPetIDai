
import React, { useState, useEffect } from 'react';
import { usePets } from '@/contexts/pets';
import { useHealth } from '@/contexts/health';
import { Pet } from '@/contexts/pets/types';
import { MedicalEvent } from '@/utils/types';
import HealthCheckHeader from './components/HealthCheckHeader';
import FadeIn from '@/components/animations/FadeIn';
import VaccinationSection from './components/vaccinations/VaccinationSection';
import MedicationSection from './components/medications/MedicationSection';
import MedicalHistoryTimeline from './components/timeline/MedicalHistoryTimeline';
import AddHealthRecordDialog from './components/records/AddHealthRecordDialog';
import AddMedicalEventDialog from './components/timeline/AddMedicalEventDialog';
import EditMedicalEventDialog from './components/timeline/EditMedicalEventDialog';
import { Card, CardContent } from "@/components/ui/card";
import PetSelector from './components/PetSelector';
import TabButton from './components/TabButton';
import RecordsTabContent from './components/tabs/RecordsTabContent';
import HealthAssessmentCard from './components/assessment/HealthAssessmentCard';
import { useSearchParams } from 'react-router-dom';

const HealthCheckContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { pets } = usePets();
  const { getHealthRecordsForPet, loading } = useHealth();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isAddRecordDialogOpen, setIsAddRecordDialogOpen] = useState(false);
  const [isAddMedicalEventDialogOpen, setIsAddMedicalEventDialogOpen] = useState(false);
  const [isEditMedicalEventDialogOpen, setIsEditMedicalEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null);
  const [activeTab, setActiveTab] = useState("records");
  
  useEffect(() => {
    if (pets.length > 0) {
      const petId = searchParams.get('pet');
      
      // If there's a pet ID in URL params and it exists in our pets list, select it
      if (petId) {
        const petFromParams = pets.find(p => p.id === petId && !p.archived);
        if (petFromParams) {
          setSelectedPet(petFromParams);
          return;
        }
      }
      
      // Otherwise, if no pet is selected yet, select the first active pet
      if (!selectedPet) {
        const activePets = pets.filter(pet => !pet.archived);
        if (activePets.length > 0) {
          setSelectedPet(activePets[0]);
        }
      }
    }
  }, [pets, selectedPet, searchParams]);
  
  const handlePetChange = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    if (pet) {
      setSelectedPet(pet);
    }
  };

  const handleEditEvent = (event: MedicalEvent) => {
    setSelectedEvent(event);
    setIsEditMedicalEventDialogOpen(true);
  };
  
  const healthRecords = selectedPet 
    ? getHealthRecordsForPet(selectedPet.id) 
    : [];
  
  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
      <div className="relative isolate overflow-hidden">
        <div className="absolute -top-40 -right-20 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        <div className="absolute top-60 -left-20 w-80 h-80 bg-pet-purple/20 rounded-full filter blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-pet-blue/20 rounded-full filter blur-3xl opacity-20 -z-10"></div>
        
        <FadeIn delay={100}>
          <HealthCheckHeader />
        </FadeIn>
        
        <Card className="mb-4 sm:mb-6 border-gray-100 shadow-sm">
          <CardContent className="p-3 sm:p-4 sm:pt-6">
            <FadeIn delay={200}>
              <PetSelector 
                pets={pets.filter(pet => !pet.archived)}
                selectedPetId={selectedPet?.id}
                onSelectPet={handlePetChange}
              />
            </FadeIn>
          </CardContent>
        </Card>
        
        <FadeIn delay={300}>
          {loading ? (
            <div className="text-center py-6 sm:py-12">
              <p className="text-gray-500">Loading health records...</p>
            </div>
          ) : selectedPet ? (
            <>
              <HealthAssessmentCard 
                petId={selectedPet.id}
                petName={selectedPet.name}
                className="mb-4 sm:mb-6"
                onTabChange={setActiveTab}
              />
              
              <Card className="border-gray-100 shadow-sm">
                <CardContent className="p-3 sm:p-4 sm:pt-6">
                  <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100">
                    <TabButton 
                      active={activeTab === "records"} 
                      onClick={() => setActiveTab("records")}
                      label="Health Records"
                    />
                    <TabButton 
                      active={activeTab === "vaccinations"} 
                      onClick={() => setActiveTab("vaccinations")}
                      label="Vaccinations"
                    />
                    <TabButton 
                      active={activeTab === "medications"} 
                      onClick={() => setActiveTab("medications")}
                      label="Medications"
                    />
                    <TabButton 
                      active={activeTab === "timeline"} 
                      onClick={() => setActiveTab("timeline")}
                      label="Medical Timeline"
                    />
                  </div>
                  
                  {activeTab === "records" && (
                    <RecordsTabContent 
                      petId={selectedPet.id}
                      petName={selectedPet.name}
                      healthRecords={healthRecords}
                      onAddRecord={() => setIsAddRecordDialogOpen(true)}
                    />
                  )}
                  
                  {activeTab === "vaccinations" && (
                    <VaccinationSection
                      petId={selectedPet.id}
                      petName={selectedPet.name}
                    />
                  )}
                  
                  {activeTab === "medications" && (
                    <MedicationSection
                      petId={selectedPet.id}
                      petName={selectedPet.name}
                    />
                  )}
                  
                  {activeTab === "timeline" && (
                    <MedicalHistoryTimeline
                      petId={selectedPet.id}
                      petName={selectedPet.name}
                      onAddEvent={() => setIsAddMedicalEventDialogOpen(true)}
                      onEditEvent={handleEditEvent}
                    />
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-gray-100 shadow-sm">
              <CardContent className="py-8 sm:py-12 text-center">
                <p className="text-gray-500">
                  {pets.length > 0 
                    ? 'Please select a pet to view health records' 
                    : 'Add a pet first to track health records'}
                </p>
              </CardContent>
            </Card>
          )}
        </FadeIn>
      </div>
      
      {selectedPet && (
        <>
          <AddHealthRecordDialog
            open={isAddRecordDialogOpen}
            onOpenChange={setIsAddRecordDialogOpen}
            petId={selectedPet.id}
            petName={selectedPet.name}
          />
          
          <AddMedicalEventDialog
            open={isAddMedicalEventDialogOpen}
            onOpenChange={setIsAddMedicalEventDialogOpen}
            petId={selectedPet.id}
            petName={selectedPet.name}
          />

          <EditMedicalEventDialog
            open={isEditMedicalEventDialogOpen}
            onOpenChange={setIsEditMedicalEventDialogOpen}
            event={selectedEvent}
            petName={selectedPet.name}
          />
        </>
      )}
    </div>
  );
};

export default HealthCheckContent;
