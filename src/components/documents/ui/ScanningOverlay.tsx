import React from 'react';

const ScanningOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 border-2 border-white/60 rounded pointer-events-none">
      <div className="absolute inset-0 border-2 border-primary/50 rounded m-4"></div>
      <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary"></div>
    </div>
  );
};

export default ScanningOverlay;
