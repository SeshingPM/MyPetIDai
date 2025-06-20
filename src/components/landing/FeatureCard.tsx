
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  color,
  gradient
}) => {
  return (
    <div className="group h-full">
      <div 
        className="h-full rounded-xl overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 border border-gray-100/80 bg-white/90 p-4 flex flex-col relative"
        tabIndex={0}
        role="article"
      >
        {/* Gradient overlay - optimized for performance */}
        <div className={cn(
          "absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-300",
          "bg-gradient-to-br",
          gradient
        )} aria-hidden="true" />
        
        {/* Card content */}
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center mb-3 shadow-md",
          "bg-gradient-to-br",
          gradient
        )}>
          <Icon className="text-white" size={24} strokeWidth={1.5} aria-hidden="true" />
        </div>
        
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2 group-hover:text-blue-700 transition-colors duration-300">{title}</h3>
          <p className="text-gray-600 text-sm flex-grow">{description}</p>
        </div>
        
        {/* Bottom decorative line that animates on hover */}
        <div 
          className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 group-hover:w-full transition-all duration-500"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default React.memo(FeatureCard);
