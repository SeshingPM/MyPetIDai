
import React from 'react';

const BackgroundBlurs: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Top left blur */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-100/80 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob" />
      
      {/* Top right blur */}
      <div className="absolute top-20 right-0 w-[350px] h-[350px] bg-purple-100/80 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000" />
      
      {/* Bottom blur */}
      <div className="absolute bottom-20 left-1/4 w-[500px] h-[500px] bg-pink-100/80 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000" />
      
      {/* Additional subtle blurs */}
      <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] bg-indigo-100/80 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 animate-blob animation-delay-3000" />
    </div>
  );
};

export default BackgroundBlurs;
