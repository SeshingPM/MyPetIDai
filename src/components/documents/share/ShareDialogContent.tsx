
import React from 'react';
import { useShareDialog } from './ShareDialogContext';
import LoadingState from './LoadingState';
import ExistingShareLink from './ExistingShareLink';
import GenerateShareLink from './GenerateShareLink';

interface ShareDialogContentProps {
  onOpenChange: (open: boolean) => void;
}

const ShareDialogContent: React.FC<ShareDialogContentProps> = ({ onOpenChange }) => {
  const { loadingInitial, hasLink } = useShareDialog();

  if (loadingInitial) {
    return <LoadingState open={true} onOpenChange={onOpenChange} />;
  }

  return (
    <div className="space-y-4 py-2">
      {hasLink ? <ExistingShareLink /> : <GenerateShareLink />}
    </div>
  );
};

export default ShareDialogContent;
