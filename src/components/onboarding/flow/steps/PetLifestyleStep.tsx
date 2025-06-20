import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { PetLifestyle, PetLifestyleStepProps } from '@/types/onboarding';
import { MultiCombobox, ComboboxOption } from '@/components/ui/multi-combobox';
import { Combobox } from '@/components/ui/combobox';

// Import data
import { MEDICATIONS, SUPPLEMENTS } from '@/data/medications';
import { FOODS_BY_PET_TYPE } from '@/data/foods';
import { TREATS_BY_PET_TYPE } from '@/data/treats';
import { ALLERGIES_BY_PET_TYPE } from '@/data/allergies';
import { PET_INSURANCE_PROVIDERS } from '@/data/insurance';

// Convert arrays to ComboboxOption format
const medicationOptions: ComboboxOption[] = MEDICATIONS.map(med => ({ label: med, value: med }));
const supplementOptions: ComboboxOption[] = SUPPLEMENTS.map(supp => ({ label: supp, value: supp }));
const insuranceOptions: ComboboxOption[] = PET_INSURANCE_PROVIDERS.map(provider => ({ label: provider, value: provider }));

/**
 * Pet Lifestyle Step
 * Third step in the onboarding flow for collecting pet lifestyle information
 */
const PetLifestyleStep: React.FC<PetLifestyleStepProps> = ({ 
  data, 
  petType,
  onUpdate, 
  onNext, 
  onPrevious 
}) => {
  // State for all multi-select fields
  const [food, setFood] = useState<string[]>((data.food || []).filter(item => item !== null && item !== undefined));
  const [treats, setTreats] = useState<string[]>((data.treats || []).filter(item => item !== null && item !== undefined));
  const [allergies, setAllergies] = useState<string[]>((data.allergies || []).filter(item => item !== null && item !== undefined));
  const [medications, setMedications] = useState<string[]>((data.medications || []).filter(med => med !== null && med !== undefined));
  const [supplements, setSupplements] = useState<string[]>((data.supplements || []).filter(supp => supp !== null && supp !== undefined));
  const [insurance, setInsurance] = useState<string>(data.insurance || '');
  
  // Create conditional option lists based on pet type
  const foodOptions: ComboboxOption[] = useMemo(() => {
    const foods = petType === 'dog' ? FOODS_BY_PET_TYPE.dog : 
                  petType === 'cat' ? FOODS_BY_PET_TYPE.cat : 
                  [...FOODS_BY_PET_TYPE.dog, ...FOODS_BY_PET_TYPE.cat];
    return foods.map(food => ({ label: food, value: food }));
  }, [petType]);

  const treatOptions: ComboboxOption[] = useMemo(() => {
    const treats = petType === 'dog' ? TREATS_BY_PET_TYPE.dog : 
                   petType === 'cat' ? TREATS_BY_PET_TYPE.cat : 
                   [...TREATS_BY_PET_TYPE.dog, ...TREATS_BY_PET_TYPE.cat];
    return treats.map(treat => ({ label: treat, value: treat }));
  }, [petType]);

  const allergyOptions: ComboboxOption[] = useMemo(() => {
    const allergies = ALLERGIES_BY_PET_TYPE.dog; // Same for both dogs and cats
    return allergies.map(allergy => ({ label: allergy, value: allergy }));
  }, []);
  
  // Handle multi-select changes
  const handleFoodChange = (values: string[]) => {
    const filteredValues = values.filter(value => value !== null && value !== undefined);
    setFood(filteredValues);
  };

  const handleTreatsChange = (values: string[]) => {
    const filteredValues = values.filter(value => value !== null && value !== undefined);
    setTreats(filteredValues);
  };

  const handleAllergiesChange = (values: string[]) => {
    const filteredValues = values.filter(value => value !== null && value !== undefined);
    setAllergies(filteredValues);
  };

  const handleMedicationChange = (values: string[]) => {
    const filteredValues = values.filter(value => value !== null && value !== undefined);
    setMedications(filteredValues);
  };

  const handleSupplementChange = (values: string[]) => {
    const filteredValues = values.filter(value => value !== null && value !== undefined);
    setSupplements(filteredValues);
  };

  const handleInsuranceChange = (value: string) => {
    setInsurance(value);
  };

  // Handle direct submission without form data since we manage state directly
  const handleDirectSubmit = () => {
    // Update parent component state with combined data
    const updatedData: PetLifestyle = {
      food,
      treats,
      allergies,
      insurance,
      medications,
      supplements,
    };
    
    onUpdate(updatedData);
    
    // Navigate to next step
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Pet Lifestyle</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Tell us about your pet's diet and health needs
        </p>
      </div>

      <div className="space-y-6">
        {/* Food */}
        <div className="space-y-2">
          <Label htmlFor="food">Food *</Label>
          <MultiCombobox
            options={foodOptions}
            values={food}
            onChange={handleFoodChange}
            placeholder={`Search for ${petType || 'pet'} foods`}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Select all foods your {petType || 'pet'} regularly eats (you can choose multiple)
          </p>
        </div>

        {/* Treats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="treats">Treats</Label>
            <span className="text-xs text-gray-500">(Optional)</span>
          </div>
          <MultiCombobox
            options={treatOptions}
            values={treats}
            onChange={handleTreatsChange}
            placeholder={`Search for ${petType || 'pet'} treats`}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Select treats your {petType || 'pet'} enjoys (you can choose multiple)
          </p>
        </div>

        {/* Allergies */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="allergies">Allergies</Label>
            <span className="text-xs text-gray-500">(Optional)</span>
          </div>
          <MultiCombobox
            options={allergyOptions}
            values={allergies}
            onChange={handleAllergiesChange}
            placeholder="Search for known allergies"
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Select any known allergies or sensitivities (you can choose multiple)
          </p>
        </div>

        {/* Medications */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="medications">Medications</Label>
            <span className="text-xs text-gray-500">(Optional)</span>
          </div>
          <MultiCombobox
            options={medicationOptions}
            values={medications}
            onChange={handleMedicationChange}
            placeholder="Search for medications"
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Select any current medications (you can choose multiple)
          </p>
        </div>

        {/* Supplements */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="supplements">Supplements</Label>
            <span className="text-xs text-gray-500">(Optional)</span>
          </div>
          <MultiCombobox
            options={supplementOptions}
            values={supplements}
            onChange={handleSupplementChange}
            placeholder="Search for supplements"
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Select any supplements your {petType || 'pet'} takes (you can choose multiple)
          </p>
        </div>

        {/* Insurance */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="insurance">Insurance</Label>
            <span className="text-xs text-gray-500">(Optional)</span>
          </div>
          <Combobox
            options={insuranceOptions}
            value={insurance}
            onChange={handleInsuranceChange}
            placeholder="Select insurance provider"
            className="w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            className="sm:flex-1"
            onClick={onPrevious}
          >
            Back
          </Button>
          <Button 
            type="button" 
            className="sm:flex-1"
            onClick={handleDirectSubmit}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetLifestyleStep;
