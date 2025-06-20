
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface BulkActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | null | undefined;
  disabled?: boolean;
}

const BulkActionButton: React.FC<BulkActionButtonProps> = ({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = "outline",
  disabled = false
}) => {
  return (
    <Button
      size="sm"
      variant={variant}
      onClick={onClick}
      className="flex items-center gap-1"
      disabled={disabled}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
};

export default BulkActionButton;
