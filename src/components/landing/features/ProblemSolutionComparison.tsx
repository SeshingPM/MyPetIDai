
import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/animations/FadeIn';
import GlassCard from '@/components/ui-custom/GlassCard';

const comparisons = [
  {
    problem: "Frantic searching for vaccination records during vet visits",
    solution: "Instant access to complete medical history with Pet SSN",
    icon: "📄"
  },
  {
    problem: "Missing critical medication doses and vaccination deadlines",
    solution: "Smart reminders prevent health issues before they start",
    icon: "⏰"
  },
  {
    problem: "Losing important documents when you need them most",
    solution: "Secure cloud storage with bank-level encryption",
    icon: "🔒"
  },
  {
    problem: "Complicated pet information sharing with caregivers",
    solution: "One-click sharing with vets, sitters, and facilities",
    icon: "🤝"
  }
];

const ProblemSolutionComparison: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <FadeIn>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              From Pet Care Chaos to Complete Control
            </h2>
            <p className="text-xl text-gray-600">
              See how MyPetID transforms common pet care frustrations into seamless experiences
            </p>
          </div>
        </FadeIn>

        <div className="space-y-6">
          {comparisons.map((comparison, index) => (
            <FadeIn key={index} delay={index * 100}>
              <div className="grid md:grid-cols-3 gap-4 items-center">
                {/* Problem */}
                <GlassCard className="p-6 bg-red-50 border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-800 mb-2">The Problem</h3>
                      <p className="text-red-700 text-sm">{comparison.problem}</p>
                    </div>
                  </div>
                </GlassCard>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Solution */}
                <GlassCard className="p-6 bg-green-50 border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">The MyPetID Solution</h3>
                      <p className="text-green-700 text-sm">{comparison.solution}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={400}>
          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-semibold">
              <span>Ready to eliminate pet care stress?</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default ProblemSolutionComparison;
