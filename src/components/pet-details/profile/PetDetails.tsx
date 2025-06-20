
import React, { useState } from 'react';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Save, X, CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { usePets } from '@/contexts/PetsContext';
import { calculateAge, formatAge } from '@/utils/age-calculator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface PetDetailsProps {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
}

const PetDetails: React.FC<PetDetailsProps> = ({ id, name, breed, birthDate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedBreed, setEditedBreed] = useState(breed);
  const [editedBirthDate, setEditedBirthDate] = useState(birthDate);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    // Parse the string date into a Date object
    try {
      return birthDate ? parse(birthDate, 'yyyy-MM-dd', new Date()) : undefined;
    } catch (e) {
      console.error('Error parsing date:', e);
      return undefined;
    }
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { updatePet } = usePets();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form values on cancel
    setEditedName(name);
    setEditedBreed(breed);
    setEditedBirthDate(birthDate);
    // Reset the selected date
    try {
      setSelectedDate(birthDate ? parse(birthDate, 'yyyy-MM-dd', new Date()) : undefined);
    } catch (e) {
      console.error('Error parsing date on cancel:', e);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      // Format the selected date for the API
      const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
      
      await updatePet(id, {
        name: editedName,
        breed: editedBreed,
        birthDate: formattedDate
      });
      
      // Update the local state with the formatted date
      setEditedBirthDate(formattedDate);
      
      toast.success('Pet details updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating pet:', error);
      toast.error('Failed to update pet details');
    }
  };

  return (
    <>
      {isEditing ? (
        <>
          <div className="space-y-4 mb-4">
            <div>
              <Label htmlFor="pet-name">Name</Label>
              <Input
                id="pet-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pet-breed">Breed</Label>
              <Input
                id="pet-breed"
                value={editedBreed}
                onChange={(e) => setEditedBreed(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pet-birth-date">Birth Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="pet-birth-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !selectedDate && "text-muted-foreground"
                    )}
                    onClick={() => setCalendarOpen(true)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Select birth date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    classNames={{
                      day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
                      cell: "h-10 w-10 text-center text-sm p-0 relative rounded-md focus-within:relative focus-within:z-20 transition-colors",
                      nav_button: "h-7 w-7 bg-background p-0 opacity-70 hover:opacity-100 transition-opacity",
                      nav_button_previous: "absolute left-1 top-1",
                      nav_button_next: "absolute right-1 top-1",
                      caption: "flex justify-center py-2 relative items-center",
                      caption_label: "text-sm font-medium",
                      months: "flex flex-col space-y-4 transition-all",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" className="flex items-center gap-1">
              <Save size={16} /> Save
            </Button>
            <Button 
              onClick={handleCancel} 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <X size={16} /> Cancel
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold">{name}</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleEdit} 
              className="flex items-center gap-1"
            >
              <Edit2 size={16} /> Edit
            </Button>
          </div>
          <p className="text-lg text-gray-600 mb-6">{breed}, {formatAge(calculateAge(birthDate))} old</p>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Pet Details</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Age:</dt>
                <dd>{formatAge(calculateAge(birthDate))}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Breed:</dt>
                <dd>{breed}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Birth Date:</dt>
                <dd>{birthDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">ID:</dt>
                <dd className="text-sm">{id}</dd>
              </div>
            </dl>
          </div>
        </>
      )}
    </>
  );
};

export default PetDetails;
