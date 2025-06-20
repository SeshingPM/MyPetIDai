
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { archiveDocument } from './archive';

/**
 * Delete a document from Supabase (now archives instead of deleting)
 */
export const deleteDocument = async (documentId: string): Promise<boolean> => {
  // For backward compatibility, we're now archiving instead of deleting
  return archiveDocument(documentId);
};
