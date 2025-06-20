
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Share a document by email
 */
export const shareDocumentByEmail = async (
  documentId: string, 
  recipientEmail: string,
  subject: string,
  message: string
): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error('You must be logged in to share documents');
      return false;
    }
    
    // First verify the document exists and belongs to this user
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userData.user.id)
      .single();
      
    if (docError || !docData) {
      toast.error('Document not found or access denied');
      return false;
    }
    
    // Insert a record of this email share
    const { error } = await supabase
      .from('document_emails')
      .insert({
        document_id: documentId,
        sender_id: userData.user.id,
        recipient_email: recipientEmail,
        subject,
        message
      });
      
    if (error) throw error;
    
    toast.success(`Document shared with ${recipientEmail}`);
    return true;
    
  } catch (error) {
    console.error('Error sharing document:', error);
    toast.error('Failed to share document. Please try again.');
    return false;
  }
};
