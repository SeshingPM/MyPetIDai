
import React, { useCallback } from 'react';
import { Calendar, FileText, MoreHorizontal, Activity, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import { usePets } from '@/contexts/pets';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getFormattedAge } from '@/utils/age-calculator';

import { useReminders } from '@/contexts/reminders';
import { useDocuments } from '@/contexts/DocumentsContext';
import { useHealth } from '@/contexts/health';

interface PetCardProps {
  pet: {
    id: string;
    name: string;
    breed: string;
    birthDate: string;
    photoUrl: string;
    petIdentifier?: string;
  };
  onClick?: () => void;
  className?: string;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onClick, className }) => {
  const navigate = useNavigate();
  const { deletePet } = usePets();
  
  // Use the reminders context
  const { reminders } = useReminders();
  const petReminders = reminders.filter(reminder =>
    reminder.petId === pet.id && !reminder.archived
  );
  
  // Use the documents context
  const { getDocumentsForPet } = useDocuments();
  const petDocuments = getDocumentsForPet(pet.id);
  
  // Use the health context
  const { getHealthRecordsForPet, getVaccinationsForPet } = useHealth();
  const healthRecords = getHealthRecordsForPet(pet.id);
  const vaccinations = getVaccinationsForPet(pet.id);
  
  // Count pending vaccinations (those that are expired)
  const pendingVaccinations = vaccinations.filter(v => 
    v.expirationDate && new Date(v.expirationDate) < new Date()
  ).length;
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/pets/${pet.id}`);
    }
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking on dropdown
  };

  // Use useCallback to prevent recreation of this function on each render
  const handleRemovePet = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    e.preventDefault(); // Prevent any potential default actions
    try {
      deletePet(pet.id);
      // Toast is now managed in the deletePet hook to prevent duplicates
    } catch (error) {
      toast.error('Failed to archive pet. Please try again.');
    }
  }, [pet.id, deletePet]);

  const handleEditPet = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/pets/${pet.id}`);
  };

  const handleViewHealthRecords = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/pets/${pet.id}?tab=health`);
  };

  // Generate a background gradient based on the pet's name (for consistent colors per pet)
  const getGradientStyle = () => {
    const gradients = [
      'from-blue-400 to-purple-500',
      'from-green-400 to-blue-500',
      'from-yellow-400 to-orange-500',
      'from-pink-400 to-purple-500',
      'from-blue-400 to-green-500'
    ];
    
    // Use the first character's code to pick a consistent gradient
    const index = pet.name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div 
      className={cn(
        "rounded-lg shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer border border-gray-100/80", 
        className
      )} 
      onClick={handleCardClick}
    >
      <div className="relative h-40 rounded-t-lg overflow-hidden">
        {pet.photoUrl ? (
          <img 
            src={pet.photoUrl} 
            alt={`${pet.name} the pet`} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getGradientStyle()} flex items-center justify-center`}>
            <span className="text-3xl font-semibold text-white drop-shadow-md">{pet.name.charAt(0)}</span>
          </div>
        )}
        
        <div className="absolute top-3 right-3" onClick={handleDropdownClick}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white transition-colors shadow-sm p-0">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border border-gray-100 shadow-lg">
              <DropdownMenuItem className="cursor-pointer py-2.5 hover:bg-primary/5" onClick={handleEditPet}>Edit Pet</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer py-2.5 hover:bg-primary/5" onClick={handleViewHealthRecords}>View Health Records</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500 cursor-pointer py-2.5 hover:bg-red-50" onClick={handleRemovePet}>Remove Pet</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-medium mb-1">{pet.name}</h3>
        <p className="text-gray-600 mb-1">{pet.breed}, {getFormattedAge(pet.birthDate)} old</p>
        {pet.petIdentifier && (
          <p className="text-sm text-primary mb-4 font-medium">Pet ID: {pet.petIdentifier}</p>
        )}
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center text-sm text-gray-500">
            <div className="bg-amber-100/50 p-1.5 rounded-full mr-1">
              <Calendar size={14} className="text-amber-500" />
            </div>
            <span>{petReminders.length} reminder{petReminders.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <div className="bg-purple-100/50 p-1.5 rounded-full mr-1">
              <Activity size={14} className="text-purple-500" />
            </div>
            <span>
              {healthRecords.length} health record{healthRecords.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <div className="bg-blue-100/50 p-1.5 rounded-full mr-1">
              <File size={14} className="text-blue-500" />
            </div>
            <span>
              {petDocuments.length} document{petDocuments.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <div className={`${pendingVaccinations > 0 ? 'bg-red-100/50' : 'bg-green-100/50'} p-1.5 rounded-full mr-1`}>
              <FileText size={14} className={pendingVaccinations > 0 ? 'text-red-500' : 'text-green-500'} />
            </div>
            <span>
              {pendingVaccinations > 0 ? `${pendingVaccinations} vaccination${pendingVaccinations !== 1 ? 's' : ''} needed` : `${vaccinations.length} vaccination${vaccinations.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
