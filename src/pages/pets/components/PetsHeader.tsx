
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PetsHeaderProps {
  onAddPet: () => void;
}

const PetsHeader: React.FC<PetsHeaderProps> = ({ onAddPet }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-display font-bold">Your Pets</h1>
        <p className="text-gray-600">Manage and organize your pet profiles</p>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button 
                disabled={true}
                className="btn-primary opacity-70 cursor-not-allowed"
              >
                <Plus size={18} className="mr-2" />
                Add Pet
                <AlertCircle size={16} className="ml-2 text-yellow-500" />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>The Add Pet feature is temporarily unavailable while we update our onboarding flow. Please check back soon.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default PetsHeader;
