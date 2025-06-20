
import React from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { Target, CheckCircle, Sparkles } from 'lucide-react';

const WhyOurTeamSection: React.FC = () => {
  return (
    <FadeIn delay={500}>
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 rounded-3xl text-white overflow-hidden shadow-xl">
        {/* Enhanced background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full -translate-x-24 -translate-y-24" />
          <div className="absolute bottom-0 right-0 w-36 h-36 bg-white rounded-full translate-x-18 translate-y-18" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12" />
        </div>
        
        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-2xl font-bold">Why Our Team Makes the Difference</h4>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <Target className="w-4 h-4 text-blue-200" />
                </div>
                <h5 className="font-bold text-lg text-blue-100">Deep Industry Expertise</h5>
              </div>
              <p className="text-blue-50 text-sm leading-relaxed">
                Our leadership combines specialized knowledge in pet healthcare documentation, veterinary record 
                systems, and secure information management. This unique blend allows us to create solutions that 
                truly understand the needs of pet parents, veterinarians, and pet service providers.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-purple-200" />
                </div>
                <h5 className="font-bold text-lg text-purple-100">Comprehensive Pet Care Vision</h5>
              </div>
              <p className="text-purple-50 text-sm leading-relaxed">
                We've simplified the organization of vaccination records, medication schedules, microchip information, 
                insurance policies, and other critical documents that keep your pets healthy and safe throughout their lives. 
                Our platform grows with your pet family's needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default WhyOurTeamSection;