
import React from 'react';

const FeatureDecorationElements: React.FC = () => {
  return (
    // Decorative elements with reduced blur for better text clarity
    <>
      <div className="absolute -top-1 -right-1 w-14 h-14 rounded-full bg-gradient-to-br from-blue-400/10 to-cyan-500/20 blur-xl" aria-hidden="true"></div>
      <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-500/20 blur-xl" aria-hidden="true"></div>
      <div className="absolute top-1/3 -right-3 w-3 h-3 rounded-full bg-blue-400" aria-hidden="true"></div>
      <div className="absolute top-1/2 -left-2 w-2 h-2 rounded-full bg-cyan-500" aria-hidden="true"></div>
      <div className="absolute bottom-10 right-5 w-1.5 h-1.5 rounded-full bg-teal-500" aria-hidden="true"></div>
      <div className="absolute top-10 left-10 w-1.5 h-1.5 rounded-full bg-blue-400" aria-hidden="true"></div>
    </>
  );
};

export default FeatureDecorationElements;
