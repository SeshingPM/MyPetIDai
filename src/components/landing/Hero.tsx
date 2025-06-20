
import React from 'react';
import HeroBackground from './hero/HeroBackground';
import HeroContent from './hero/HeroContent';

const Hero: React.FC = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/30 via-white to-purple-50/20 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <HeroBackground />
      <HeroContent />
    </section>
  );
};

export default Hero;
