
import React from 'react';
import { Activity, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeightUnit } from '@/contexts/WeightUnitContext';

const HealthCheckHeader: React.FC = () => {
  const { weightUnit, toggleWeightUnit } = useWeightUnit();
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-display font-bold">Pet Health Check</h1>
        <p className="text-gray-600">Track your pet's health records and medications</p>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleWeightUnit}
        className="flex items-center gap-1.5"
      >
        <Scale size={14} />
        {weightUnit === 'lbs' ? 'Switch to kg' : 'Switch to lbs'}
      </Button>
    </div>
  );
};

export default HealthCheckHeader;
