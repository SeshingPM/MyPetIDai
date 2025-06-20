
import React from 'react';
import FadeIn from '@/components/animations/FadeIn';

const FeaturesHeader: React.FC = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-10">
      <FadeIn>
        <h2 
          id="feature-details-heading" 
          className="text-3xl md:text-4xl font-display font-bold mb-4 relative"
          itemScope itemType="https://schema.org/WebPageElement"
        >
          <span 
            className="bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent 
            drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] relative z-10"
            itemProp="name"
          >
            Complete Digital Pet Identity Platform
          </span>
        </h2>
      </FadeIn>
      <FadeIn delay={100}>
        <p 
          className="text-lg text-gray-600 mb-6"
          itemProp="description"
        >
          MyPetID.ai provides a comprehensive My Pet ID system, 
          creating permanent digital identities that include secure document storage, instant ownership verification, 
          and seamless sharing capabilities. Our platform is designed by pet owners, for pet owners — and it's completely free.
        </p>
      </FadeIn>
    </div>
  );
};

export default FeaturesHeader;