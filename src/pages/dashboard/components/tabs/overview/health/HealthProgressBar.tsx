
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface HealthProgressBarProps {
  label: string;
  value: number;
  total: number;
  color?: string;
}

const HealthProgressBar: React.FC<HealthProgressBarProps> = ({ 
  label, 
  value, 
  total,
  color = 'bg-primary'
}) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value} of {total} pets</span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2" 
      />
    </div>
  );
};

export default HealthProgressBar;
