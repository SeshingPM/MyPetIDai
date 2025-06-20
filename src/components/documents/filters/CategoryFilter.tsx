
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import CategoryItem from './category/CategoryItem';
import { getCategoryOptions } from './category/CategoryOptions';
import { filterContainerClass, selectTriggerClass } from './styles/FilterStyles';

interface CategoryFilterProps {
  onCategoryChange: (value: string) => void;
  selectedCategory: string;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  onCategoryChange, 
  selectedCategory,
  className
}) => {
  const categories = getCategoryOptions();
  const selectedOption = categories.find(cat => cat.value === selectedCategory) || categories[0];

  return (
    <div className={filterContainerClass(className)}>
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className={selectTriggerClass}>
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <CategoryItem 
              key={category.value}
              value={category.value}
              label={category.label}
              icon={category.icon}
            />
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryFilter;
