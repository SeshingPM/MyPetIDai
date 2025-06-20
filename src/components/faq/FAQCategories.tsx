
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { FAQCategory } from './types';

interface FAQCategoriesProps {
  categories: FAQCategory[];
  onSelectCategory: (categoryId: string) => void;
  selectedCategory: string | null;
  className?: string;
}

const FAQCategories: React.FC<FAQCategoriesProps> = ({
  categories,
  onSelectCategory,
  selectedCategory,
  className = ""
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={`space-y-4 ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Browse by Category</h2>
        <p className="text-gray-600">Find answers organized by topic area</p>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={container}
      >
        {categories.map((category) => {
          const IconComponent = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              variants={item}
              onClick={() => onSelectCategory(category.id)}
              className={`
                group relative p-6 rounded-xl border-2 transition-all duration-300 text-left
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                {IconComponent && (
                  <div className={`
                    p-3 rounded-lg transition-colors
                    ${isSelected 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                    }
                  `}>
                    <IconComponent size={24} />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`
                      font-semibold transition-colors
                      ${isSelected ? 'text-blue-900' : 'text-gray-900 group-hover:text-blue-700'}
                    `}>
                      {category.title}
                    </h3>
                    <Badge 
                      variant={isSelected ? 'default' : 'secondary'}
                      className={`
                        text-xs
                        ${isSelected ? 'bg-blue-600' : 'bg-gray-500'}
                      `}
                    >
                      {category.count}
                    </Badge>
                  </div>
                  <p className={`
                    text-sm leading-relaxed
                    ${isSelected ? 'text-blue-700' : 'text-gray-600 group-hover:text-gray-700'}
                  `}>
                    {category.description}
                  </p>
                </div>
              </div>
              
              {isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-blue-500"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>
      
      <div className="text-center pt-4">
        <button
          onClick={() => onSelectCategory('')}
          className={`
            px-6 py-2 rounded-lg transition-colors text-sm font-medium
            ${selectedCategory 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-blue-100 text-blue-700'
            }
          `}
        >
          {selectedCategory ? 'Show All Categories' : 'Viewing All Questions'}
        </button>
      </div>
    </motion.div>
  );
};

export default FAQCategories;