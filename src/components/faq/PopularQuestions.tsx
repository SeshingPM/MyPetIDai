
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronRight } from 'lucide-react';
import { FAQItem } from './types';

interface PopularQuestionsProps {
  faqs: FAQItem[];
  onQuestionClick: (index: number) => void;
  className?: string;
}

const PopularQuestions: React.FC<PopularQuestionsProps> = ({
  faqs,
  onQuestionClick,
  className = ""
}) => {
  // Get the first 5 questions as "popular"
  const popularQuestions = faqs.slice(0, 5);

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
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 ${className}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Popular Questions</h3>
      </div>
      
      <div className="space-y-3">
        {popularQuestions.map((faq, index) => (
          <motion.button
            key={index}
            variants={item}
            onClick={() => onQuestionClick(index)}
            className="w-full text-left p-3 bg-white rounded-lg hover:shadow-md transition-all duration-200 border border-gray-100 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors line-clamp-2">
                {faq.question}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default PopularQuestions;