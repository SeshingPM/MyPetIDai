
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FAQCategory } from './types';

interface FAQSidebarProps {
  categories: FAQCategory[];
  selectedCategory: string | null;
  searchQuery: string;
  onSelectCategory: (categoryId: string) => void;
  onSearch: (query: string) => void;
  className?: string;
}

const FAQSidebar: React.FC<FAQSidebarProps> = ({
  categories,
  selectedCategory,
  searchQuery,
  onSelectCategory,
  onSearch,
  className = ""
}) => {
  const [inputValue, setInputValue] = React.useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <div className={`sticky top-6 space-y-6 ${className}`}>
      {/* Search Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          Search FAQs
        </h3>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search questions..."
            value={inputValue}
            onChange={handleSearchChange}
            className="pr-8"
          />
          {inputValue && (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Quick Search Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {['security', 'sharing', 'setup'].map((term) => (
            <button
              key={term}
              onClick={() => {setInputValue(term); onSearch(term);}}
              className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Browse by Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
              !selectedCategory 
                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">All Questions</span>
              <Badge variant="secondary" className="text-xs">
                {categories.reduce((sum, cat) => sum + cat.count, 0)}
              </Badge>
            </div>
          </button>
          
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isSelected = selectedCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  isSelected 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  {IconComponent && (
                    <IconComponent 
                      size={18} 
                      className={`${category.color || 'text-gray-500'} ${isSelected ? 'text-blue-600' : ''}`}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{category.title}</span>
                      <Badge 
                        variant={isSelected ? 'default' : 'secondary'} 
                        className="text-xs ml-2"
                      >
                        {category.count}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQSidebar;