
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import FeedbackForm from './FeedbackForm';

interface FeedbackDialogProps {
  trigger?: React.ReactNode;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ trigger }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Share your thoughts to help us improve the app. Report bugs or suggest new features.
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm onSubmitSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
