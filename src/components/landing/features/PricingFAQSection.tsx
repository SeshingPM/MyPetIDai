
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FadeIn from '@/components/animations/FadeIn';
import { ChevronRight } from 'lucide-react';
import FaqAccordion from '@/components/faq/FaqAccordion';
import { FAQItem } from '@/components/faq/types';

const pricingFAQs: FAQItem[] = [
  {
    question: "How secure is my pet's information?",
    answer: "My Pet ID uses bank-level encryption to protect all your data. We implement the latest security measures including end-to-end encryption, secure authentication, and regular security audits to ensure your pet's information remains private and secure.",
    category: "security-privacy",
    keywords: ["pet data security", "encrypted pet records", "secure cloud storage", "data protection"]
  },
  {
    question: "Can I share information with my veterinarian?",
    answer: "Absolutely! My Pet ID allows you to generate secure, time-limited access links for veterinarians. You can share specific documents or your pet's entire health history. You control exactly what information is shared and for how long.",
    category: "documents",
    keywords: ["veterinarian sharing", "vet record access", "secure document sharing", "time-limited access"]
  },
  {
    question: "Is there a limit to how many pets I can add?",
    answer: "No limits! My Pet ID allows you to add unlimited pets to your account completely free. This makes My Pet ID perfect for multi-pet households, pet sitters, or small breeders who need to manage records for multiple animals.",
    category: "platform",
    keywords: ["unlimited pets", "multiple pets", "free features", "pet profiles"]
  },
  {
    question: "Is My Pet ID really completely free?",
    answer: "Yes! My Pet ID is 100% free forever. Create unlimited pet digital identities, store unlimited documents, set unlimited reminders, and use all features at no cost. No hidden fees, no credit card required, and no subscription needed.",
    category: "platform",
    keywords: ["free platform", "no cost", "no subscription", "free forever"]
  },
  {
    question: "How do reminders work?",
    answer: "You can set up unlimited customizable reminders for medications, vaccinations, vet appointments, and more. Choose how and when you want to be notified - via email, SMS, or push notifications. The system also supports recurring reminders for regular care activities.",
    category: "reminders",
    keywords: ["medication reminders", "vaccination alerts", "appointment notifications", "recurring reminders"]
  },
  {
    question: "Can I export my pet's data?",
    answer: "Yes! You can export all your pet's data at any time in standard formats like PDF, CSV, and image files. We believe your data belongs to you, so you can always download a complete archive of all documents and information.",
    category: "documents",
    keywords: ["data export", "backup pet data", "download documents", "data portability"]
  }
];

const PricingFAQSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50/60 relative overflow-hidden" aria-labelledby="pricing-faq-heading">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-0 opacity-40">
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '9s' }} />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 right-10 w-60 h-60 bg-pet-blue/20 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      </div>
      
      <div className="container-max relative z-10">
        {/* FAQ */}
        <FadeIn>
          <h3 id="pricing-faq-heading" className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h3>
          
          <div className="max-w-3xl mx-auto">
            <FaqAccordion faqs={pricingFAQs.slice(0, 4)} className="mb-6" />
            
            <div className="text-center">
              <Button asChild variant="outline" className="flex items-center gap-1">
                <Link to="/faq" state={{ scrollToTop: true }}>
                  View All FAQs
                  <ChevronRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default PricingFAQSection;