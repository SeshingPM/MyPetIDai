import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { usePets } from '@/contexts/pets';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PetSelectorProps {
  selectedPetId: string | undefined;
  onSelectPet: (petId: string | undefined) => void;
  disabled?: boolean;
}

const PetSelector: React.FC<PetSelectorProps> = ({
  selectedPetId,
  onSelectPet,
  disabled = false
}) => {
  const { pets = [] } = usePets();
  
  // If no pets exist, show disabled selector with help tooltip
  if (pets.length === 0) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="pet-select">Assign to Pet</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a pet to assign documents</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Select disabled value="none">
          <SelectTrigger id="pet-select">
            <SelectValue placeholder="No pets available" />
          </SelectTrigger>
        </Select>
      </div>
    );
  }
  
  const handlePetChange = (value: string) => {
    // Convert "none" to undefined for the pet ID
    onSelectPet(value === "none" ? undefined : value);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="pet-select">Assign to Pet</Label>
      <Select 
        value={selectedPetId || "none"} 
        onValueChange={handlePetChange}
        disabled={disabled}
      >
        <SelectTrigger id="pet-select">
          <SelectValue placeholder="Select a pet" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">General (No pet)</SelectItem>
          {pets.map(pet => (
            <SelectItem key={pet.id} value={pet.id}>
              {pet.name} {pet.breed ? `(${pet.breed})` : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PetSelector;
