
import React from 'react';

interface CategoryBadgeProps {
  category: string;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const getCategoryColor = () => {
    switch (category) {
      case 'Medical':
      case 'Medical Report':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Insurance':
      case 'Insurance Policy':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Vaccination':
      case 'Vaccination Record':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Registration':
      case 'Adoption Certificate':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Training':
      case 'Training Certificate':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Photos':
        return 'bg-pet-purple/20 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor()} inline-flex items-center`}>
      {category}
    </span>
  );
};

export default CategoryBadge;
