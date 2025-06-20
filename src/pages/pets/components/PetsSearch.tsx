
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PetsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const PetsSearch: React.FC<PetsSearchProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative mb-8">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <Input
        className="pl-10"
        placeholder="Search pets by name or breed..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
      />
    </div>
  );
};

export default PetsSearch;
