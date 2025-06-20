
import React from 'react';
import FadeIn from '@/components/animations/FadeIn';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import FeaturesGrid from './FeaturesGrid';

const Features: React.FC = () => {
  return (
    <section 
      id="features" 
      className="relative pt-28 pb-16 bg-gradient-to-b from-blue-50/80 via-white to-indigo-50/60 overflow-hidden mt-12" 
      aria-labelledby="features-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 opacity-50" aria-hidden="true">
        <div className="absolute top-0 -left-16 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '9s', animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '12s', animationDelay: '0.8s' }} />
        <div className="absolute top-3/4 left-1/4 w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '11s', animationDelay: '1.2s' }} />
      </div>
      
      <div className="relative max-w-3xl mx-auto text-center glass-panel rounded-xl p-6 shadow-xl border border-blue-100/50 bg-gradient-to-br from-white/95 to-blue-50/90">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2" aria-hidden="true">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Calendar className="text-white w-8 h-8" strokeWidth={1.5} />
          </div>
        </div>
        
        <FadeIn delay={300}>
          <h2 id="features-heading" className="text-xl md:text-2xl font-bold mb-4 pt-6 text-blue-900">Ready to give your pets the care management they deserve?</h2>
          <p className="text-base text-gray-600 mb-6" itemProp="description">
            Join thousands of pet owners who have simplified their pet care management with MyPetID.
            Start using our free platform today and experience enhanced pet wellness tracking, simplified veterinary coordination, and secure digital record keeping that veterinarians recommend.
          </p>
          <div className="text-sm text-gray-500 mb-6 italic" itemProp="additionalProperty">
            Trusted by pet owners across 50+ countries for managing complex vaccination schedules, medication reminders, and multi-pet households with our secure document storage system.
          </div>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-full shadow-md hover:shadow-lg transition-all duration-300 px-6 py-5 text-base">
            <Link to="/pricing" aria-label="View pricing plans for MyPetID">Get Started Now</Link>
          </Button>
        </FadeIn>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 opacity-70 animate-pulse-soft" aria-hidden="true"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-teal-500 opacity-70 animate-pulse-soft" aria-hidden="true"></div>
      </div>
      
      <div className="mt-20">
        <FeaturesGrid />
      </div>
    </section>
  );
};

export default Features;