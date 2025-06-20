
import React from 'react';
import { motion } from 'framer-motion';
import FaqAccordion from './FaqAccordion';
import PopularQuestions from './PopularQuestions';
import { FAQItem } from './types';

interface EnhancedFAQContentProps {
  faqs: FAQItem[];
  allFaqs: FAQItem[];
  searchQuery: string;
  selectedCategory: string | null;
  categoryTitle?: string;
  onQuestionClick?: (index: number) => void;
  className?: string;
}

const EnhancedFAQContent: React.FC<EnhancedFAQContentProps> = ({
  faqs,
  allFaqs,
  searchQuery,
  selectedCategory,
  categoryTitle,
  onQuestionClick,
  className = ""
}) => {
  const showPopularQuestions = !searchQuery && !selectedCategory;
  
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Popular Questions - Only show when viewing all questions */}
      {showPopularQuestions && (
        <PopularQuestions 
          faqs={allFaqs} 
          onQuestionClick={onQuestionClick || (() => {})}
        />
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Search Results: "{searchQuery}"
          </h2>
          <p className="text-gray-600">
            {faqs.length === 0
              ? "No results found. Try a different search term or browse categories."
              : `Found ${faqs.length} question${faqs.length !== 1 ? "s" : ""} matching your search.`}
          </p>
        </motion.div>
      )}

      {/* Category Header */}
      {selectedCategory && categoryTitle && !searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{categoryTitle}</h2>
          <p className="text-gray-600">
            {faqs.length === 0
              ? "No questions in this category yet."
              : `${faqs.length} question${faqs.length !== 1 ? "s" : ""} in this category.`}
          </p>
        </motion.div>
      )}

      {/* All Questions Header */}
      {!searchQuery && !selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Questions</h2>
          <p className="text-gray-600">
            Browse our complete collection of frequently asked questions about MyPetID.ai
          </p>
        </motion.div>
      )}

      {/* FAQ Content */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {faqs.length > 0 ? (
          <div className="p-6">
            <FaqAccordion faqs={faqs} />
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0118 12a7.962 7.962 0 01-2.209 5.291L18 21l-3.8-3.8-.496.496a1 1 0 01-1.414 0L9.172 16.172z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "No results found" : "No questions available"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? "Try adjusting your search terms or browse categories"
                  : "Check back later or contact support for assistance"
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedFAQContent;