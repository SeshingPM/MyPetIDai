
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  onClick?: () => void;
  variant?: 'default' | 'bordered' | 'subtle' | 'primary' | 'gradient' | 'accent';
  color?: 'blue' | 'purple' | 'green' | 'pink' | 'orange' | 'default';
  compact?: boolean; // Added new prop for compact sizing
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hoverEffect = false,
  padding = 'medium',
  onClick,
  variant = 'default',
  color = 'default',
  compact = false // Default to false for backward compatibility
}) => {
  const paddingClasses = {
    none: 'p-0',
    small: 'p-2 sm:p-3',
    medium: 'p-3 sm:p-4',
    large: 'p-4 sm:p-6'
  };

  const variantClasses = {
    default: 'bg-white border border-gray-100 shadow-sm',
    bordered: 'bg-white border-2 shadow-sm',
    subtle: 'bg-white/95 shadow-sm',
    primary: 'bg-primary/10 border border-primary/20 shadow-md',
    gradient: 'bg-gradient-to-br from-white to-blue-50/90 shadow-md',
    accent: 'bg-accent/20 border border-accent/30 shadow-md'
  };

  const colorClasses = {
    default: 'border-indigo-100',
    blue: 'border-blue-200 from-white to-blue-50/80',
    purple: 'border-purple-200 from-white to-purple-50/80',
    green: 'border-green-200 from-white to-green-50/80',
    pink: 'border-pink-200 from-white to-pink-50/80',
    orange: 'border-orange-200 from-white to-orange-50/80'
  };

  const sizeClasses = compact ? 'max-w-xs sm:max-w-sm mx-auto' : '';

  return (
    <div
      className={cn(
        'glass-card rounded-xl transition-all duration-300',
        paddingClasses[padding],
        variantClasses[variant],
        colorClasses[color],
        sizeClasses,
        hoverEffect && 'hover:shadow-lg hover:scale-[1.02] cursor-pointer',
        className
      )}
      onClick={onClick}
      role="article"
    >
      {children}
    </div>
  );
};

export default GlassCard;
