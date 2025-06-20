
import React from 'react';
import { motion } from 'framer-motion';
import { FAQCategory } from './types';
import { HelpCircle, LucideIcon } from 'lucide-react';

interface FAQCategoryHeaderProps {
  category: FAQCategory | null;
  className?: string;
}

const FAQCategoryHeader: React.FC<FAQCategoryHeaderProps> = ({ 
  category, 
  className = "" 
}) => {
  if (!category) return null;
  
  const Icon = category.icon as LucideIcon || HelpCircle;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`text-center ${className}`}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
        <Icon className="h-8 w-8" />
      </div>
      <h2 className="text-3xl font-bold mb-3">{category.title}</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
    </motion.div>
  );
};

export default FAQCategoryHeader;
