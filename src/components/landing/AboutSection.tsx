
import React from 'react';
import VisionHeader from './about/VisionHeader';
import StorySection from './about/StorySection';
import MissionValuesSection from './about/MissionValuesSection';
import ExpertiseSection from './about/ExpertiseSection';
import TestimonialsSection from './about/TestimonialsSection';
import CtaSection from './about/CtaSection';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-indigo-50/60 via-white to-blue-50/50 relative overflow-hidden" aria-labelledby="about-heading">
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10 opacity-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '8s', animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDuration: '9s', animationDelay: '1s' }} />
      </div>
      
      <div className="container-max relative z-10">
        <div className="max-w-4xl mx-auto">
          <div itemScope itemType="https://schema.org/Article">
            <meta itemProp="headline" content="About My Pet ID" />
            <meta itemProp="description" content="Complete pet document management solution" />
            
            <VisionHeader />
            
            <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
              <div itemProp="articleSection">
                <StorySection />
              </div>
              <div itemProp="articleSection">
                <MissionValuesSection />
              </div>
            </div>
            
            <div itemProp="articleSection">
              <ExpertiseSection />
            </div>
            
            <div itemProp="reviewBody">
              <TestimonialsSection />
            </div>
            
            <CtaSection />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;