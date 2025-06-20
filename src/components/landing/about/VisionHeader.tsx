
import React from 'react';
import { Badge } from '@/components/ui/badge';

const VisionHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      <Badge 
        variant="outline" 
        className="mb-4 px-6 py-2 text-lg border-2 border-primary/50 text-primary font-semibold scale-105 shadow-sm transform hover:scale-110 transition-transform duration-300"
      >
        Our Vision
      </Badge>
      <h2 id="about-heading" className="text-3xl md:text-4xl font-display font-bold mb-4">
        <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
          Revolutionizing Pet Identity & Care Through Technology
        </span>
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Built by pet parents for pet parents. We believe every pet deserves a permanent digital identity 
        that simplifies care, secures records, and strengthens the bond between pets and their families.
      </p>
    </div>
  );
};

export default VisionHeader;
