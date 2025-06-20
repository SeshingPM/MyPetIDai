
import React from 'react';
import { motion } from 'framer-motion';
import { FAQCategory } from './types';
import { HelpCircle, LucideIcon } from 'lucide-react';

interface FaqCategoriesGridProps {
  categories: FAQCategory[];
  onSelectCategory: (categoryId: string) => void;
  selectedCategory?: string | null;
  className?: string;
}

const FaqCategoriesGrid: React.FC<FaqCategoriesGridProps> = ({
  categories,
  onSelectCategory,
  selectedCategory = null,
  className = ""
}) => {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {categories.map((category) => {
        const Icon = category.icon as LucideIcon || HelpCircle;
        
        return (
          <motion.div key={category.id} variants={item}>
            <button
              onClick={() => onSelectCategory(category.id)}
              className={`w-full text-left p-6 rounded-xl transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`flex items-center mb-3 ${selectedCategory === category.id ? 'text-white' : 'text-primary'}`}>
                {Icon && <Icon className="h-6 w-6" />}
                <span className="ml-2 font-semibold">{category.count} questions</span>
              </div>
              <h3 className="text-lg font-bold mb-1">{category.title}</h3>
              <p className={selectedCategory === category.id ? 'text-white/90' : 'text-gray-500'}>
                {category.description}
              </p>
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FaqCategoriesGrid;
