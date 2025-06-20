
import { toast } from 'sonner';

export const handleApiError = (error: any, defaultMessage: string): null => {
  console.error(defaultMessage, error);
  toast.error(defaultMessage);
  return null;
};
