
import React from 'react';
import { PawPrint, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PetsSectionHeaderProps {
  title: string;
  description: string;
}

const PetsSectionHeader: React.FC<PetsSectionHeaderProps> = ({ title, description }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-row items-center justify-between pb-2 relative z-10">
      <div>
        <h3 className="text-lg font-semibold flex items-center">
          <PawPrint size={18} className="mr-2 text-primary" />
          {title}
        </h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <Button 
        onClick={() => navigate('/pets')} 
        variant="ghost" 
        size="sm"
        className="text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors"
      >
        View All
        <ArrowRight size={14} />
      </Button>
    </div>
  );
};

export default PetsSectionHeader;
