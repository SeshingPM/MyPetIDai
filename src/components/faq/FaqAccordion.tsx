
import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { FAQItem } from './types';
import { Badge } from '@/components/ui/badge';

interface FaqAccordionProps {
  faqs: FAQItem[];
  className?: string;
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({
  faqs,
  className = ""
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  // Helper function to convert string with line breaks to paragraphs
  const formatAnswer = (answer: React.ReactNode) => {
    if (typeof answer !== 'string') return answer;
    
    return answer.split('\n\n').map((paragraph, i) => {
      // Check if this is a list (starts with • or number.)
      if (paragraph.trim().match(/^[0-9]+\.\s/)) {
        // Numbered list
        const items = paragraph.split(/\n/).map(item => item.trim()).filter(Boolean);
        return (
          <ol key={i} className="list-decimal pl-4 space-y-1 my-2">
            {items.map((item, j) => {
              const content = item.replace(/^[0-9]+\.\s/, '');
              return <li key={j}>{content}</li>;
            })}
          </ol>
        );
      } else if (paragraph.trim().includes('\n• ')) {
        // Bullet list
        const items = paragraph.split(/\n•/).map(item => item.trim()).filter(Boolean);
        return (
          <ul key={i} className="list-disc pl-4 space-y-1 my-2">
            {items.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        );
      } else {
        // Regular paragraph
        return <p key={i} className="my-2">{paragraph}</p>;
      }
    });
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
      aria-label="Frequently Asked Questions"
    >
      <Accordion type="single" collapsible className="w-full space-y-2">
        {faqs.map((faq, index) => (
          <motion.div key={index} variants={item}>
            <AccordionItem 
              value={`item-${index}`} 
              className="border border-gray-200/60 rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:shadow-md focus-within:shadow-md data-[state=open]:shadow-md data-[state=open]:border-blue-200"
            >
              <AccordionTrigger className="py-4 px-5 text-left hover:no-underline group">
                <div className="flex-grow font-medium text-base group-hover:text-blue-700 transition-colors">{faq.question}</div>
              </AccordionTrigger>
              <AccordionContent className="px-5 py-4 bg-gradient-to-br from-gray-50/50 to-blue-50/30">
                <div className="text-gray-700 prose prose-sm max-w-none">
                  {formatAnswer(faq.answer)}
                  
                  {faq.keywords && (
                    <div className="mt-3 pt-3 border-t border-gray-200/50">
                      <p className="text-xs text-gray-500 mb-1.5">Related topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {faq.keywords.slice(0, 3).map((keyword, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
      
      {faqs.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Showing {faqs.length} {faqs.length === 1 ? 'question' : 'questions'}
        </div>
      )}
    </motion.div>
  );
};

export default FaqAccordion;