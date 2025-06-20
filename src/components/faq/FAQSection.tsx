import React from 'react';
import { Helmet } from 'react-helmet-async';
import { HelpCircle, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import FaqAccordion from './FaqAccordion';
import { FAQItem } from './types';
import { motion } from 'framer-motion';

const defaultFAQs: FAQItem[] = [
  {
    question: "Is MyPetID.ai really completely free?",
    answer: "Yes! MyPetID.ai is 100% free for pet owners. Create unlimited pet digital identities, assign My Pet IDs, store documents, set reminders, and use all features at no cost. No hidden fees, no credit card required, and no subscription needed.",
    category: "platform",
    keywords: ["free platform", "no cost", "free My Pet ID", "no subscription", "free for pet owners"]
  },
  {
    question: "What is a My Pet ID and how does it work?",
    answer: "A My Pet ID is a unique digital identifier assigned to your pet's profile. Like a personal ID number, it provides permanent identity verification, simplifies document sharing with vets and caregivers, and serves as proof of ownership for your pet's entire lifetime.",
    category: "identity",
    keywords: ["My Pet ID", "pet digital identity", "digital identity", "pet ID number", "unique pet identifier"]
  },
  {
    question: "How secure is my pet's digital identity?",
    answer: "Your pet's digital identity is protected with bank-level encryption and security protocols. We use industry-standard authentication, secure cloud storage, and never share your pet's information with third parties without your explicit permission. You control exactly who can access your pet's data.",
    category: "security-privacy",
    keywords: ["pet identity security", "encrypted pet data", "secure digital identity", "pet data protection", "privacy"]
  },
  {
    question: "Can I create digital identities for multiple pets?",
    answer: "Absolutely! You can create unlimited pet profiles and assign unique My Pet IDs to each one. Whether you have one pet or dozens, MyPetID.ai accommodates all your pets with individual digital identities, documents, and reminders - all completely free for pet owners.",
    category: "platform",
    keywords: ["multiple pets", "unlimited pets", "multiple My Pet IDs", "multi-pet digital identity", "pet family"]
  },
  {
    question: "How do I share my pet's digital identity with my vet?",
    answer: "Sharing is simple! You can generate secure, temporary links to share specific information with your vet, groomer, or pet sitter. They can access your pet's verification and any documents you choose to share, making appointments and care coordination much easier.",
    category: "sharing",
    keywords: ["share pet identity", "veterinarian sharing", "vet access", "pet profile sharing", "secure sharing"]
  }
];

interface FAQSectionProps {
  faqs?: FAQItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  includeBadge?: boolean;
  category?: string;
  structuredData?: boolean;
  showAllLink?: boolean;
  isEmpty?: boolean;
}

const FAQSection: React.FC<FAQSectionProps> = ({ 
  faqs = defaultFAQs,
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about creating your pet's free digital identity with MyPetID.ai.",
  className = "",
  includeBadge = true,
  category,
  structuredData = true,
  showAllLink = true,
  isEmpty = false
}) => {
  // Filter FAQs by category if specified, otherwise show only first 5
  const filteredFAQs = category 
    ? faqs.filter(faq => faq.category === category)
    : faqs.slice(0, 5);
    
  // Prepare structured data for SEO
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": filteredFAQs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": typeof faq.answer === 'string' 
          ? faq.answer 
          : "Please visit our FAQ page for a detailed answer to this question."
      }
    }))
  };

  return (
    <section id="faq" className={`py-8 relative overflow-hidden ${className}`} aria-labelledby="faq-heading">
      {structuredData && filteredFAQs.length > 0 && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(faqStructuredData)}
          </script>
        </Helmet>
      )}
      
      {/* Colorful background elements */}
      <div className="absolute inset-0 -z-10 opacity-20" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl" />
        <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-xl" />
        <div className="absolute top-2/3 left-1/6 w-24 h-24 bg-gradient-to-br from-green-400 to-teal-400 rounded-full blur-lg" />
        <div className="absolute bottom-1/4 right-1/6 w-28 h-28 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-lg" />
      </div>
      
      <div className="container-max">
        {(title || subtitle) && (
          <div className="max-w-3xl mx-auto text-center mb-6">
            {includeBadge && (
              <div className="flex justify-center mb-3">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200/50">
                  <HelpCircle size={16} className="mr-1.5" />
                  Support
                </div>
              </div>
            )}
            
            {title && (
              <h2 id="faq-heading" className="text-2xl md:text-3xl font-display font-bold mb-3 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="max-w-3xl mx-auto">
          {isEmpty ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 px-6 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-100"
            >
              <Search className="h-10 w-10 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium mb-2">No matching questions found</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Try adjusting your search terms or browse through our categories.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/contact" className="flex items-center gap-1">
                  Contact Support
                  <ChevronRight size={14} />
                </Link>
              </Button>
            </motion.div>
          ) : (
            <div className="relative">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 rounded-xl pointer-events-none" />
              <FaqAccordion faqs={filteredFAQs} />
            </div>
          )}
          
          {showAllLink && filteredFAQs.length > 0 && (
            <div className="mt-6 text-center">
              <Button asChild variant="outline" className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <Link to="/faq" state={{ scrollToTop: true }} className="flex items-center gap-1.5">
                  View all FAQs
                  <ChevronRight size={16} />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;