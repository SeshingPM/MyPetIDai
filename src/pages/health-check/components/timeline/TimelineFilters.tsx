
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar, SlidersHorizontal, FilterX } from 'lucide-react';

interface TimelineFiltersProps {
  eventTypes: string[];
  selectedEventType: string;
  onSelectEventType: (eventType: string) => void;
  dateRange: string;
  onSelectDateRange: (range: string) => void;
  onResetFilters: () => void;
}

const TimelineFilters: React.FC<TimelineFiltersProps> = ({
  eventTypes,
  selectedEventType,
  onSelectEventType,
  dateRange,
  onSelectDateRange,
  onResetFilters
}) => {
  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'year', label: 'Past Year' },
    { value: '6months', label: 'Past 6 Months' },
    { value: '3months', label: 'Past 3 Months' },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 bg-gray-50 p-3 rounded-md">
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium">Filters:</span>
        </div>
        
        <Select value={selectedEventType} onValueChange={onSelectEventType}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {eventTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={dateRange} onValueChange={onSelectDateRange}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <SelectValue placeholder="Time Period" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {dateRanges.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onResetFilters}
        className="text-xs h-8"
      >
        <FilterX className="h-3.5 w-3.5 mr-1.5" />
        Reset Filters
      </Button>
    </div>
  );
};

export default TimelineFilters;
