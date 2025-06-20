
import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

interface PetIdBadgeProps {
  variant?: 'verified' | 'assigned';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const PetIdBadge: React.FC<PetIdBadgeProps> = ({ 
  variant = 'verified', 
  size = 'md',
  showIcon = true,
  className = ""
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  };

  const badgeContent = variant === 'verified' 
    ? { text: 'Pet ID Verified', icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-200' }
    : { text: 'Pet SSN Assigned', icon: Shield, color: 'bg-blue-100 text-blue-800 border-blue-200' };

  return (
    <div className={`
      inline-flex items-center gap-1.5 rounded-full border font-medium
      ${sizeClasses[size]}
      ${badgeContent.color}
      ${className}
    `}>
      {showIcon && <badgeContent.icon size={iconSizes[size]} />}
      ✔️ {badgeContent.text}
    </div>
  );
};

export default PetIdBadge;
