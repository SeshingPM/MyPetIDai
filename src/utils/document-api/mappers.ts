import { Document } from '../types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Create a signed URL for a document if needed
 */
export const createSignedUrlIfNeeded = async (fileUrl: string): Promise<string> => {
  if (!fileUrl || !fileUrl.includes('/documents/')) return fileUrl;
  
  try {
    // Check if it's already a signed URL with a valid token
    if (fileUrl.includes('token=')) {
      // Optional: Check if the URL is about to expire and refresh if needed
      // This would require parsing the JWT to check expiration
      // For simplicity, we'll just create a new one
    }
    
    // Ensure we have a fresh session before creating signed URLs
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.warn('No active session found when creating signed URL');
      return fileUrl;
    }
    
    // Check if token is about to expire (within 5 minutes)
    const expiresAt = session.expires_at;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const fiveMinutesInSeconds = 5 * 60;
    
    if (expiresAt && expiresAt - nowInSeconds < fiveMinutesInSeconds) {
      console.info('Session token nearing expiration, refreshing before creating signed URL...');
      
      // Explicitly refresh the token
      const { error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError) {
        console.error('Failed to refresh session:', refreshError);
        return fileUrl;
      }
    }
    
    // Extract the path from the URL
    const urlObj = new URL(fileUrl);
    const pathParts = urlObj.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === 'documents');
    if (bucketIndex === -1) return fileUrl;
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    
    // Create a signed URL with shorter expiry to reduce chance of using stale tokens
    // 4 hours instead of 24 hours
    const { data, error } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 60 * 60 * 4); // 4 hour expiry
      
    if (error) {
      // Handle specific JWT errors
      if (error.message?.includes('JWT') || error.message?.includes('token') || error.message?.includes('401')) {
        console.error('JWT error when creating signed URL:', error);
        
        // Try to refresh the session and retry once
        const refreshResult = await supabase.auth.refreshSession();
        if (refreshResult.error) {
          throw new Error('Failed to refresh session: ' + refreshResult.error.message);
        }
        
        // Retry with fresh token
        const retryResult = await supabase.storage
          .from('documents')
          .createSignedUrl(filePath, 60 * 60 * 4);
          
        return retryResult.data?.signedUrl || fileUrl;
      }
      
      throw error;
    }
    
    return data?.signedUrl || fileUrl;
  } catch (error) {
    console.error('Error converting to signed URL:', error);
    // Return original URL as fallback
    return fileUrl;
  }
};

/**
 * Map a Supabase document to our Document type
 */
export const mapSupabaseDocToDocument = (doc: any): Document => {
  return {
    id: doc.id,
    name: doc.name,
    fileUrl: doc.file_url,
    fileType: doc.file_type,
    category: doc.category,
    createdAt: doc.created_at,
    userId: doc.user_id,
    petId: doc.pet_id || undefined, // Ensure petId is properly mapped
    shareUrl: doc.share_id ? `${window.location.origin}/shared/${doc.share_id}` : undefined,
    shareExpiry: doc.share_expiry ? new Date(doc.share_expiry) : null,
    uploadDate: new Date(doc.created_at), // For compatibility with old code
    isFavorite: doc.is_favorite || false, // Add favorite status
    archived: doc.archived || false // Add archived status
  };
};

/**
 * Map a Supabase document to our Document type with signed URLs
 */
export const mapSupabaseDocToDocumentWithSignedUrl = async (doc: any): Promise<Document> => {
  const baseDoc = mapSupabaseDocToDocument(doc);
  
  // Create a signed URL for the document if needed
  if (baseDoc.fileUrl) {
    baseDoc.fileUrl = await createSignedUrlIfNeeded(baseDoc.fileUrl);
  }
  
  return baseDoc;
};
