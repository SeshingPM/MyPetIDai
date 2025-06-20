import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { PetInfoStepProps, PetInfo } from '@/types/onboarding';
import { Combobox, ComboboxOption } from '@/components/ui/combobox';

// Import breed data
import { DOG_BREEDS, CAT_BREEDS } from '@/data/breeds';

// Convert breed arrays to Combobox option format
const dogBreedOptions = DOG_BREEDS.map(breed => ({ label: breed, value: breed }));
const catBreedOptions = CAT_BREEDS.map(breed => ({ label: breed, value: breed }));

// Validation schema
const petInfoSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  type: z.enum(['dog', 'cat'], { required_error: 'Pet type is required' }),
  breed: z.union([z.string().min(1), z.null()]).refine(
    (val) => val !== null && val !== '',
    { message: 'Please select your pet\'s breed' }
  ),
  gender: z.enum(['male', 'female'], { required_error: 'Gender is required' }),
  birth_or_adoption_date: z.date({ required_error: 'Birth/Adoption date is required' }),
});

type PetInfoFormValues = z.infer<typeof petInfoSchema>;

/**
 * Pet Information Step
 * First step in the onboarding flow for collecting basic pet information
 */
const PetInfoStep: React.FC<PetInfoStepProps> = ({ data, onUpdate, onNext }) => {
  // Initialize form with react-hook-form and zod validation
  const { 
    control, 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isValid } 
  } = useForm<PetInfoFormValues>({
    resolver: zodResolver(petInfoSchema),
    defaultValues: {
      name: data.name || '',
      type: data.type || undefined,
      breed: data.breed || null,
      gender: data.gender || undefined,
      birth_or_adoption_date: data.birth_or_adoption_date ? new Date(data.birth_or_adoption_date) : undefined,
    },
    mode: 'onChange',
  });

  // Watch the pet type to show appropriate breed options
  const petType = watch('type');
  
  // Get breeds based on selected pet type
  const getBreedOptions = (): ComboboxOption[] => {
    if (petType === 'dog') return dogBreedOptions;
    if (petType === 'cat') return catBreedOptions;
    return [];
  };

  // Handle form submission
  const onSubmit = (formData: PetInfoFormValues) => {
    // Convert dates to ISO strings for storage
    const updatedData: PetInfo = {
      name: formData.name,
      type: formData.type,
      breed: formData.breed,
      gender: formData.gender,
      birth_or_adoption_date: formData.birth_or_adoption_date.toISOString(),
    };
    
    // Update parent component state
    onUpdate(updatedData);
    
    // Navigate to next step
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tell us about your pet</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's start with some basic information about your furry friend
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Pet Name */}
        <div className="space-y-3">
          <Label htmlFor="name" className="text-base font-medium text-gray-900">Pet Name</Label>
          <Input
            id="name"
            placeholder="Enter your pet's name"
            {...register('name')}
            className={cn(
              "h-12 text-base",
              errors.name && 'border-red-500 focus-visible:ring-red-500'
            )}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Pet Type Selection */}
        <div className="space-y-3">
          <Label htmlFor="type" className="text-base font-medium text-gray-900">Pet Type</Label>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger
                  id="type"
                  className={cn(
                    errors.type && 'border-red-500 focus-visible:ring-red-500'
                  )}
                  aria-invalid={errors.type ? 'true' : 'false'}
                >
                  <SelectValue placeholder="Select pet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              {errors.type.message}
            </p>
          )}
        </div>

        {/* Breed Selection (conditional on pet type) */}
        <div className="space-y-3">
          <Label htmlFor="breed" className="text-base font-medium text-gray-900">Breed</Label>
          <Controller
            control={control}
            name="breed"
            render={({ field }) => (
              <Combobox
                options={getBreedOptions()}
                value={field.value}
                onChange={field.onChange}
                disabled={!petType}
                placeholder="Search for a breed"
                error={!!errors.breed}
                className={cn(
                  "h-12 text-base",
                  errors.breed && 'border-red-500 focus-visible:ring-red-500'
                )}
              />
            )}
          />
          {errors.breed && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              {errors.breed.message}
            </p>
          )}
        </div>

        {/* Gender Selection */}
        <div className="space-y-3">
          <Label htmlFor="gender" className="text-base font-medium text-gray-900">Gender</Label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger
                  id="gender"
                  className={cn(
                    errors.gender && 'border-red-500 focus-visible:ring-red-500'
                  )}
                  aria-invalid={errors.gender ? 'true' : 'false'}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              {errors.gender.message}
            </p>
          )}
        </div>

        {/* Birth/Adoption Date (required) */}
        <div className="space-y-3">
          <Label htmlFor="birth_or_adoption_date" className="text-base font-medium text-gray-900">Birth/Adoption Date</Label>
          <Controller
            control={control}
            name="birth_or_adoption_date"
            render={({ field }) => {
              const [isOpen, setIsOpen] = React.useState(false);
              
              const handleDateSelect = (date: Date | undefined) => {
                field.onChange(date);
                setIsOpen(false); // Close the popover after selection
              };
              
              const handleOpenChange = (open: boolean) => {
                setIsOpen(open);
              };
              
              // Calculate the month to display when opening the calendar
              const getDisplayMonth = () => {
                if (field.value) {
                  return field.value; // Show the month of the selected date
                }
                return new Date(); // Default to current month if no date selected
              };
              
              return (
                <Popover open={isOpen} onOpenChange={handleOpenChange}>
                  <PopoverTrigger asChild>
                    <Button
                      id="birth_or_adoption_date"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 text-base",
                        !field.value && "text-muted-foreground",
                        errors.birth_or_adoption_date && "border-red-500 focus-visible:ring-red-500"
                      )}
                      aria-invalid={errors.birth_or_adoption_date ? 'true' : 'false'}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      key={`calendar-${isOpen}-${field.value?.getTime() || 'none'}`} // Force re-render with selected date
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={handleDateSelect}
                      disabled={(date) => date > new Date()}
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1990}
                      toYear={new Date().getFullYear()}
                      defaultMonth={getDisplayMonth()}
                    />
                  </PopoverContent>
                </Popover>
              );
            }}
          />
          {errors.birth_or_adoption_date && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              {errors.birth_or_adoption_date.message}
            </p>
          )}
        </div>

        <div className="pt-6">
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-medium" 
            disabled={!isValid}
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PetInfoStep;
