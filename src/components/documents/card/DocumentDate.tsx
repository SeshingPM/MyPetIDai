
import React from 'react';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface DocumentDateProps {
  date: Date;
}

const DocumentDate: React.FC<DocumentDateProps> = ({ date }) => {
  const isMobile = useIsMobile();
  
  const formatDate = (date: Date): string => {
    try {
      // Use shorter date format on mobile
      return format(date, isMobile ? 'MM/dd/yy' : 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <span className="text-xs text-gray-500 whitespace-nowrap">
      {formatDate(date)}
    </span>
  );
};

export default DocumentDate;
