
import React from 'react';
import FilterItem from '../FilterItem';

interface CategoryItemProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const CategoryItem: React.FC<CategoryItemProps> = (props) => {
  return <FilterItem {...props} />;
};

export default CategoryItem;
