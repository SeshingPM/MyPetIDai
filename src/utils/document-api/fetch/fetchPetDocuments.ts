import { Document } from '@/utils/types';
import { getCurrentUser, buildDocumentsQuery, handleFetchError } from './fetchBase';
import { mapSupabaseDocToDocumentWithSignedUrl } from '../mappers';

/**
 * Fetch documents for a specific pet with simplified implementation
 */
export const fetchPetDocuments = async (
  petId: string
): Promise<Document[]> => {
  if (!petId) {
    console.error('[FetchPet] No petId provided to fetchPetDocuments');
    return [];
  }
  
  const requestId = Math.random().toString(36).substring(2, 9);
  try {
    console.log(`[FetchPet ${requestId}] Fetching documents for pet:`, petId);
    
    // Get current user
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }
    
    console.log(`[FetchPet ${requestId}] User authenticated, querying documents...`);
    
    // Build and execute query
    const query = buildDocumentsQuery(user.id, { petId, archived: false })
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`[FetchPet ${requestId}] Supabase error:`, error);
      throw error;
    }
    
    console.log(`[FetchPet ${requestId}] Found ${data?.length || 0} documents for pet ${petId}`);
    
    // Map from database format to our app format with signed URLs
    const mappedDocuments = data ? await Promise.all(data.map(doc =>
      mapSupabaseDocToDocumentWithSignedUrl(doc)
    )) : [];
    
    return mappedDocuments;
    
  } catch (error) {
    return handleFetchError(error, 'FetchPet', requestId);
  }
};
