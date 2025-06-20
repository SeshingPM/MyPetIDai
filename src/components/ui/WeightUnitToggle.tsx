import React from 'react';
import { Button } from '@/components/ui/button';
import { useWeightUnit } from '@/contexts/WeightUnitContext';
import { ScaleIcon } from 'lucide-react';

/**
 * Component for toggling between weight units (lbs/kg)
 */
interface WeightUnitToggleProps {
  className?: string;
}

const WeightUnitToggle: React.FC<WeightUnitToggleProps> = ({ className }) => {
  const { weightUnit, toggleWeightUnit } = useWeightUnit();
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleWeightUnit}
      className={className}
    >
      <ScaleIcon size={14} className="mr-1" />
      {weightUnit === 'lbs' ? 'Switch to kg' : 'Switch to lbs'}
    </Button>
  );
};

export default WeightUnitToggle;
