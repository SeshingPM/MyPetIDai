
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PhotoInput from './photo/PhotoInput';
import { usePets } from '@/contexts/pets';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface AddPetFormProps {
  onSuccess: (petId?: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AddPetForm: React.FC<AddPetFormProps> = ({ 
  onSuccess,
  onCancel,
  isLoading = false
}) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [birthDate, setDate] = useState<Date | undefined>(undefined);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const { addPet } = usePets();
  
  const handlePhotoChange = (file: File | null) => {
    setPhotoFile(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !breed || !birthDate) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Format the date for the API
    const formattedDate = birthDate ? format(birthDate, 'yyyy-MM-dd') : '';
    
    try {
      setSubmitting(true);
      
      // Use the actual addPet function from context
      const petId = await addPet({
        name,
        breed,
        birthDate: formattedDate,
        photoFile: photoFile || undefined
      });
      
      // Call the success callback with the new pet ID
      onSuccess(petId || undefined);
      
      // Reset form
      setName('');
      setBreed('');
      setDate(undefined);
      setPhotoFile(null);
    } catch (error) {
      console.error('Error adding pet:', error);
      toast.error('Failed to add pet. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div>
          <Label htmlFor="pet-photo" className="block mb-1 text-sm font-medium">
            Pet Photo <span className="text-gray-400 text-xs">(optional)</span>
          </Label>
          <div className="w-full">
            <PhotoInput 
              value={photoFile} 
              onChange={handlePhotoChange} 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="pet-name" className="block mb-1 text-sm font-medium">
            Name
          </Label>
          <Input
            id="pet-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pet's name"
            required
            className="w-full h-9"
          />
        </div>
        
        <div>
          <Label htmlFor="pet-breed" className="block mb-1 text-sm font-medium">
            Breed
          </Label>
          <Input
            id="pet-breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="Pet's breed"
            required
            className="w-full h-9"
          />
        </div>
        
        <div>
          <Label htmlFor="pet-birth-date" className="block mb-1 text-sm font-medium">
            Birth Date
          </Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                id="pet-birth-date"
                variant="outline"
                className={cn(
                  "w-full h-9 justify-start text-left font-normal text-sm",
                  !birthDate && "text-muted-foreground"
                )}
                onClick={() => setCalendarOpen(true)}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {birthDate ? format(birthDate, "PPP") : <span>Select birth date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={(date) => {
                  setDate(date);
                  setCalendarOpen(false);
                }}
                disabled={(date) => date > new Date()}
                initialFocus
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]",
                  cell: "h-8 w-8 text-center text-xs p-0 relative rounded-md focus-within:relative focus-within:z-20 transition-colors",
                  nav_button: "h-6 w-6 bg-background p-0 opacity-70 hover:opacity-100 transition-opacity",
                  nav_button_previous: "absolute left-1 top-1",
                  nav_button_next: "absolute right-1 top-1",
                  caption: "flex justify-center py-1 relative items-center",
                  caption_label: "text-xs font-medium",
                  months: "flex flex-col space-y-3 transition-all",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-3">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
          size="sm"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={submitting || !name || !breed || !birthDate}
          size="sm"
        >
          {submitting || isLoading ? 'Adding Pet...' : 'Add Pet'}
        </Button>
      </div>
    </form>
  );
};

export default AddPetForm;
