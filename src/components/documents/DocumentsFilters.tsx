
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import SearchFilter from './filters/SearchFilter';
import CategoryFilter from './filters/CategoryFilter';
import SortFilter from './filters/SortFilter';
import { SortOption } from '@/utils/document-sorting';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface DocumentsFiltersProps {
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  searchValue: string;
  selectedCategory: string;
  selectedSort: SortOption;
}

const DocumentsFilters: React.FC<DocumentsFiltersProps> = ({
  onSearchChange,
  onCategoryChange,
  onSortChange,
  searchValue,
  selectedCategory,
  selectedSort
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "mb-6 relative overflow-hidden",
      "bg-gradient-to-r from-white to-gray-50",
      "border border-gray-100 shadow-sm",
      "rounded-xl p-5"
    )}>
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 to-primary/10"></div>
      
      <SearchFilter 
        onSearchChange={onSearchChange}
        searchValue={searchValue}
        className="mb-4"
      />
      
      <div className={cn(
        isMobile ? "flex flex-col space-y-3" : "flex items-center justify-between",
        "relative z-10"
      )}>
        <CategoryFilter
          onCategoryChange={onCategoryChange}
          selectedCategory={selectedCategory}
          className={isMobile ? 'w-full' : 'w-[210px]'}
        />
        
        {!isMobile && <Separator orientation="vertical" className="h-8 mx-2 opacity-30" />}
        
        <SortFilter
          onSortChange={onSortChange}
          selectedSort={selectedSort}
          className={isMobile ? 'w-full' : 'w-[210px]'}
        />
      </div>
    </div>
  );
};

export default DocumentsFilters;
