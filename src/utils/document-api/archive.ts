
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '../types';

/**
 * Archive a document instead of deleting it
 */
export const archiveDocument = async (documentId: string): Promise<boolean> => {
  try {
    if (!documentId) {
      console.error('Invalid document ID provided to archiveDocument');
      return false;
    }
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      toast.error('You must be logged in to archive documents');
      return false;
    }
    
    console.log(`Attempting to archive document: ${documentId}`);
    
    // Update the document to mark it as archived and remove from bookmarks
    // This implements the requirement that archived documents can't be bookmarked
    const { error, data } = await supabase
      .from('documents')
      .update({ 
        archived: true,
        is_favorite: false // Remove from bookmarks when archived
      })
      .eq('id', documentId)
      .eq('user_id', userData.user.id)
      .select();
      
    if (error) {
      console.error('Supabase error archiving document:', error);
      throw error;
    }
    
    console.log('Archive operation result:', data);
    
    toast.success('Document moved to archive');
    return true;
    
  } catch (error) {
    console.error('Error archiving document:', error);
    toast.error('Failed to archive document. Please try again.');
    return false;
  }
};

/**
 * Restore a document from archive
 */
export const restoreDocument = async (documentId: string): Promise<boolean> => {
  try {
    if (!documentId) {
      console.error('Invalid document ID provided to restoreDocument');
      return false;
    }
    
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      toast.error('You must be logged in to restore documents');
      return false;
    }
    
    // Update the document to unmark it as archived
    const { error } = await supabase
      .from('documents')
      .update({ archived: false })
      .eq('id', documentId)
      .eq('user_id', userData.user.id);
      
    if (error) {
      console.error('Supabase error restoring document:', error);
      throw error;
    }
    
    toast.success('Document restored successfully');
    return true;
    
  } catch (error) {
    console.error('Error restoring document:', error);
    toast.error('Failed to restore document. Please try again.');
    return false;
  }
};

/**
 * Permanently delete a document from archive with additional safeguards
 */
export const permanentlyDeleteDocument = async (documentId: string): Promise<boolean> => {
  try {
    // Validation
    if (!documentId) {
      console.error('Invalid document ID provided to permanentlyDeleteDocument');
      toast.error('Invalid document ID');
      return false;
    }

    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error('Auth error in permanentlyDeleteDocument:', authError);
      toast.error('Authentication error. Please try again.');
      return false;
    }
    
    if (!userData?.user) {
      toast.error('You must be logged in to delete documents');
      return false;
    }
    
    // First check if document exists and is accessible to the user
    const { data: documentData, error: fetchError } = await supabase
      .from('documents')
      .select('id, archived')
      .eq('id', documentId)
      .eq('user_id', userData.user.id)
      .maybeSingle();
      
    if (fetchError) {
      console.error('Error fetching document before deletion:', fetchError);
      toast.error('Error checking document before deletion');
      return false;
    }
    
    if (!documentData) {
      console.error('Document not found or not accessible');
      toast.error('Cannot delete document. It may have been already removed.');
      return false;
    }
    
    try {
      // Properly wait for delete operation to complete
      const { error: deleteError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', userData.user.id);
        
      if (deleteError) {
        console.error('Error deleting document from Supabase:', deleteError);
        throw deleteError;
      }
      
      // Successfully deleted
      toast.success('Document permanently deleted');
      return true;
    } catch (deleteErr) {
      console.error('Deletion operation failed:', deleteErr);
      toast.error('Failed to delete document. Please try again.');
      return false;
    }
    
  } catch (error) {
    console.error('Error in permanentlyDeleteDocument:', error);
    toast.error('Failed to delete document. Please try again.');
    return false;
  }
};
