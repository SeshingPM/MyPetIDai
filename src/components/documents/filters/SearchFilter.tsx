
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { filterContainerClass, searchInputClass, filterIconClass, clearButtonClass } from './styles/FilterStyles';

interface SearchFilterProps {
  onSearchChange: (value: string) => void;
  searchValue: string;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
  onSearchChange, 
  searchValue,
  className
}) => {
  return (
    <div className={filterContainerClass(className)}>
      <div className={filterIconClass}>
        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
      </div>
      <Input
        type="text"
        placeholder="Search documents..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className={searchInputClass}
      />
      {searchValue && (
        <button
          onClick={() => onSearchChange('')}
          className={clearButtonClass}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
