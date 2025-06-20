
import React from 'react';
import BackgroundBlurs from './BackgroundBlurs';

const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <BackgroundBlurs />
    </div>
  );
};

export default HeroBackground;
