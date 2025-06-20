
import React from 'react';
import { PawPrint, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui-custom/GlassCard';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PetsEmptyStateProps {
  onAddPet: () => void;
}

const PetsEmptyState: React.FC<PetsEmptyStateProps> = ({ onAddPet }) => {
  return (
    <GlassCard className="col-span-full flex flex-col items-center justify-center py-8 text-center">
      <div className="w-16 h-16 rounded-full bg-pet-purple/20 flex items-center justify-center mb-4">
        <PawPrint size={32} className="text-primary/70" />
      </div>
      <h3 className="text-base font-medium text-gray-600 mb-2">No pets added yet</h3>
      <p className="text-gray-500 mb-4 max-w-md text-sm">
        Add your first pet to start tracking their health records, appointments, and more.
      </p>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button 
                disabled={true}
                className="bg-gradient-to-r from-primary to-primary/80 opacity-70 cursor-not-allowed"
              >
                <Plus size={16} className="mr-2" />
                Add Your First Pet
                <AlertCircle size={16} className="ml-2 text-yellow-500" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>The Add Pet feature is temporarily unavailable while we update our onboarding flow. Please check back soon.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </GlassCard>
  );
};

export default PetsEmptyState;
