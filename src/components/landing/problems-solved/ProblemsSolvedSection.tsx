
import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';
import { cn } from '@/lib/utils';

interface ProblemCardProps {
  title: string;
  before: string;
  after: string;
  delay?: number;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ title, before, after, delay = 0 }) => {
  return (
    <FadeIn delay={delay} direction="up">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-900">{title}</h3>
          
          <div className="space-y-3">
            {/* Before */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                <X size={12} className="text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 leading-relaxed">{before}</p>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="flex justify-center py-1">
              <ArrowRight size={16} className="text-gray-400" />
            </div>
            
            {/* After */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <Check size={12} className="text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-green-700 font-medium leading-relaxed">{after}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

const ProblemsSolvedSection: React.FC = () => {
  const problems = [
    {
      title: "Lost Medical Records",
      before: "Frantically searching for vaccination papers before boarding or vet visits.",
      after: "All records instantly accessible on your phone, ready to share."
    },
    {
      title: "Missed Care & Appointments",
      before: "Forgetting medication schedules or vaccination due dates.",
      after: "Smart reminders ensure your pet never misses critical care."
    },
    {
      title: "Disorganized Information",
      before: "Papers scattered everywhere, making it impossible to find anything quickly.",
      after: "Centralized, organized system with instant search and access."
    },
    {
      title: "Sharing With Caregivers",
      before: "Struggling to provide complete information to pet sitters or family.",
      after: "Secure, controlled sharing of specific information instantly."
    },
    {
      title: "Emergency Situations",
      before: "Lacking critical information during emergencies when time matters most.",
      after: "Emergency profile with essential health info, accessible instantly."
    },
    {
      title: "Health Tracking",
      before: "No clear picture of your pet's health history or patterns over time.",
      after: "Comprehensive health timeline helping you make informed decisions."
    }
  ];

  return (
    <section 
      id="problems-solved" 
      className="py-12 bg-gradient-to-b from-blue-50/40 to-white relative"
      itemScope 
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content="Pet Care Problems Solved by PetDocument" />
      <meta itemProp="itemListOrder" content="Unordered" />
      <meta itemProp="numberOfItems" content={problems.length.toString()} />
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-0 opacity-30">
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-blue-400/15 rounded-full blur-2xl" />
        <div className="absolute top-1/4 right-1/4 w-56 h-56 bg-indigo-400/15 rounded-full blur-2xl" />
      </div>
      
      <div className="container-max relative z-10">
        <FadeIn>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              <span className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Problems We Solve
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transform everyday pet care challenges into seamless experiences
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {problems.map((problem, index) => (
            <div 
              key={index} 
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={(index + 1).toString()} />
              <ProblemCard
                title={problem.title}
                before={problem.before}
                after={problem.after}
                delay={index * 50}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSolvedSection;