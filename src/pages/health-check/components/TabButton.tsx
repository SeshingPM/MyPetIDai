
import React from 'react';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ 
  active, 
  onClick, 
  label, 
  icon,
  disabled = false 
}) => {
  return (
    <button 
      onClick={onClick}
      className={`py-2 px-3 text-sm font-medium relative transition-colors focus:outline-none rounded-md ${
        active 
          ? 'text-primary' 
          : 'text-muted-foreground hover:text-foreground'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={active ? `${label} (active tab)` : label}
      aria-selected={active}
      role="tab"
      aria-controls={`${label.toLowerCase()}-panel`}
      disabled={disabled}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span className="hidden sm:inline-block">{icon}</span>}
        <span>{label}</span>
      </div>
      
      {active && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-sm" />
      )}
    </button>
  );
};

export default TabButton;
