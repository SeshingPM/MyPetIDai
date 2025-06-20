
import React from 'react';
import FadeIn from '@/components/animations/FadeIn';
import PetIdCard from './PetIdCard';

const PetIdPreview: React.FC = () => {
  return (
    <div className="relative max-w-sm mx-auto">
      {/* Background decorative elements - more subtle */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-blue-200/15 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-indigo-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-purple-200/15 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <FadeIn delay={500}>
        <div className="relative z-10">
          <PetIdCard />
        </div>
      </FadeIn>
      
      {/* Text below card - more compact */}
      <FadeIn delay={700}>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            ✨ Your pet's official digital identity
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">🔒 Secure</span>
            <span className="flex items-center gap-1">🌍 Global Access</span>
            <span className="flex items-center gap-1">⚡ Instant Verification</span>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default PetIdPreview;
