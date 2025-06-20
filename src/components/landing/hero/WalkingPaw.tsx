
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface WalkingPawProps {
  Icon: LucideIcon;
  size: number;
  color: string;
  startPosition: string;
  delay: string;
  duration: string;
  yPosition: string;
}

const WalkingPaw: React.FC<WalkingPawProps> = ({ 
  Icon, 
  size, 
  color, 
  startPosition, 
  delay,
  duration,
  yPosition
}) => {
  return (
    <div 
      className={`absolute ${yPosition} ${startPosition} z-20 animate-walk`} 
      style={{ 
        animationDuration: duration, 
        animationDelay: delay,
        animationIterationCount: 'infinite'
      }}
    >
      <Icon size={size} className={color} />
    </div>
  );
};

export default WalkingPaw;
