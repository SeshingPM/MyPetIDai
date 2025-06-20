
import React from 'react';

const DecorationElements: React.FC = () => {
  return (
    <>
      {/* Decoration elements with reduced blur and opacity for better text clarity */}
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-400/5 rounded-full opacity-40 blur-2xl"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-400/5 rounded-full opacity-40 blur-2xl"></div>
      
      {/* Additional smaller decorative elements */}
      <div className="absolute top-1/4 right-0 w-16 h-16 bg-cyan-400/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-1/4 left-0 w-16 h-16 bg-indigo-400/10 rounded-full blur-xl"></div>
    </>
  );
};

export default DecorationElements;
