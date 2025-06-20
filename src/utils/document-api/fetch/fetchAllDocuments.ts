import { Document } from '@/utils/types';
import { getCurrentUser, buildDocumentsQuery, handleFetchError } from './fetchBase';
import { mapSupabaseDocToDocumentWithSignedUrl } from '../mappers';
import { withFreshSession } from '../accessWrapper';

/**
 * Fetch all documents with JWT error handling and session refresh
 */
export const fetchAllDocuments = async (
  includeArchived: boolean = false
): Promise<Document[]> => {
  const requestId = Math.random().toString(36).substring(2, 9);
  console.log(`[FetchAll ${requestId}] Fetching ALL documents, includeArchived:`, includeArchived);
  
  // Use the withFreshSession wrapper to ensure we have a valid session
  const result = await withFreshSession(
    async () => {
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        return [];
      }
      
      console.log(`[FetchAll ${requestId}] Fetching documents for user:`, user.id);
      
      // Build and execute query
      const query = buildDocumentsQuery(user.id, { archived: includeArchived ? undefined : false })
        .order('created_at', { ascending: false })
        .limit(1000);
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`[FetchAll ${requestId}] Supabase query error:`, error);
        throw error;
      }
      
      const documentCount = data?.length || 0;
      console.log(`[FetchAll ${requestId}] Fetched ${documentCount} documents successfully`);
      
      // Map from database format to our app format with signed URLs
      const mappedDocuments = data ? await Promise.all(data.map(doc =>
        mapSupabaseDocToDocumentWithSignedUrl(doc)
      )) : [];
      
      return mappedDocuments;
    },
    {
      operationName: 'FetchAllDocuments',
      showToasts: true
    }
  );
  
  // Return the result or an empty array if there was an error
  return result || [];
};

