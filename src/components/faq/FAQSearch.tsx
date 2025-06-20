
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface FAQSearchProps {
  onSearch: (query: string) => void;
  className?: string;
}

const FAQSearch: React.FC<FAQSearchProps> = ({ onSearch, className = "" }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`max-w-2xl mx-auto ${className}`}
    >
      <form 
        onSubmit={handleSubmit}
        className="relative flex shadow-sm rounded-lg overflow-hidden border border-gray-200 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <Input
          type="text"
          placeholder="Search for answers, e.g. 'pet medical records' or 'sharing documents'"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pl-10"
        />
        
        {inputValue && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={handleClear}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 h-8 px-2 text-gray-500"
          >
            Clear
          </Button>
        )}
        
        <Button type="submit" className="rounded-l-none">
          Search
        </Button>
      </form>
      
      <div className="mt-2 text-center text-sm text-gray-500">
        <button 
          type="button" 
          onClick={() => {setInputValue("security"); onSearch("security");}}
          className="mx-1.5 text-primary hover:underline focus:outline-none focus:underline"
        >
          Security
        </button>
        <span className="mx-0.5">•</span>
        <button 
          type="button" 
          onClick={() => {setInputValue("sharing"); onSearch("sharing");}}
          className="mx-1.5 text-primary hover:underline focus:outline-none focus:underline"
        >
          Sharing
        </button>
        <span className="mx-0.5">•</span>
        <button 
          type="button" 
          onClick={() => {setInputValue("subscription"); onSearch("subscription");}}
          className="mx-1.5 text-primary hover:underline focus:outline-none focus:underline"
        >
          Subscription
        </button>
      </div>
    </motion.div>
  );
};

export default FAQSearch;