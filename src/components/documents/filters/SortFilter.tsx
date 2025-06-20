
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowDownAZ, 
  ArrowUpZA, 
  Clock, 
  CalendarClock
} from 'lucide-react';
import { SortOption } from '@/utils/document-sorting';
import { cn } from '@/lib/utils';

interface SortFilterProps {
  onSortChange: (value: SortOption) => void;
  selectedSort: SortOption;
  className?: string;
}

const SortFilter: React.FC<SortFilterProps> = ({ 
  onSortChange, 
  selectedSort,
  className
}) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: <Clock className="h-4 w-4 text-primary" /> },
    { value: 'oldest', label: 'Oldest First', icon: <CalendarClock className="h-4 w-4 text-gray-500" /> },
    { value: 'a-z', label: 'Name (A-Z)', icon: <ArrowDownAZ className="h-4 w-4 text-green-500" /> },
    { value: 'z-a', label: 'Name (Z-A)', icon: <ArrowUpZA className="h-4 w-4 text-pink-500" /> },
  ] as const;

  const selectedOption = sortOptions.find(opt => opt.value === selectedSort) || sortOptions[0];

  return (
    <div className={className}>
      <Select 
        value={selectedSort} 
        onValueChange={(value) => onSortChange(value as SortOption)}
      >
        <SelectTrigger className={cn(
          "bg-white/80 border-gray-200",
          "hover:border-primary/30 focus:border-primary/40",
          "focus:ring-2 focus:ring-primary/20",
          "h-11 transition-all duration-200"
        )}>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem 
              key={option.value} 
              value={option.value}
              className="flex items-center"
            >
              <div className="flex items-center gap-2">
                {option.icon}
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortFilter;
