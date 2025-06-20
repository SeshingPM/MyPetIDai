
import React from 'react';
import { SelectItem } from '@/components/ui/select';

interface FilterItemProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  children?: React.ReactNode; // Added children as an optional prop
}

const FilterItem: React.FC<FilterItemProps> = ({ value, label, icon, children }) => {
  return (
    <SelectItem 
      value={value}
      className="flex items-center"
    >
      <div className="flex items-center gap-2">
        {icon}
        {label}
      </div>
      {children}
    </SelectItem>
  );
};

export default FilterItem;
