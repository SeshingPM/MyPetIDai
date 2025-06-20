import { Document } from '@/utils/types';
import { getCurrentUser, buildDocumentsQuery, handleFetchError } from './fetchBase';
import { mapSupabaseDocToDocumentWithSignedUrl } from '../mappers';
import { withFreshSession } from '../accessWrapper';

/**
 * Fetch only archived documents with JWT error handling and session refresh
 */
export const fetchArchivedDocuments = async (): Promise<Document[]> => {
  const requestId = Math.random().toString(36).substring(2, 9);
  console.log(`[FetchArchived ${requestId}] Fetching archived documents`);
  
  // Use the withFreshSession wrapper to ensure we have a valid session
  const result = await withFreshSession(
    async () => {
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        return [];
      }
      
      // Build and execute query
      const query = buildDocumentsQuery(user.id, { archived: true })
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`[FetchArchived ${requestId}] Supabase error:`, error);
        throw error;
      }
      
      console.log(`[FetchArchived ${requestId}] Found ${data?.length || 0} archived documents`);
      
      // Map from database format to our app format with signed URLs
      const mappedDocuments = data ? await Promise.all(data.map(doc =>
        mapSupabaseDocToDocumentWithSignedUrl(doc)
      )) : [];
      
      return mappedDocuments;
    },
    {
      operationName: 'FetchArchivedDocuments',
      showToasts: true
    }
  );
  
  // Return the result or an empty array if there was an error
  return result || [];
};
