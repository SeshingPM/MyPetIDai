
import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface ShareLinkExpiryProps {
  expiryDate: Date | string | null;
  showIcon?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  formatString?: string;
  prefix?: string;
}

/**
 * A reusable component for displaying share link expiry times
 */
const ShareLinkExpiry: React.FC<ShareLinkExpiryProps> = ({
  expiryDate,
  showIcon = true,
  className = "flex items-center text-sm text-muted-foreground",
  iconClassName = "h-4 w-4 mr-2",
  textClassName = "",
  formatString = "MMM dd, yyyy 'at' h:mm a",
  prefix = "Expires on",
}) => {
  if (!expiryDate) {
    return null;
  }

  // Convert string to Date if needed
  const date = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;
  
  // Format the date using date-fns
  const formattedDate = format(date, formatString);

  return (
    <div className={className} data-testid="share-link-expiry">
      {showIcon && <Clock className={iconClassName} />}
      <span className={textClassName}>
        {`${prefix} ${formattedDate}`}
      </span>
    </div>
  );
};

export default ShareLinkExpiry;
