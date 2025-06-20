import { Document } from '@/utils/types';

// Cache configuration
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

// Document cache structure with typed interfaces
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface DocumentCache {
  allDocuments?: CacheEntry<Document[]>;
  petDocuments: Map<string, CacheEntry<Document[]>>;
  archivedDocuments?: CacheEntry<Document[]>;
}

// Initialize the cache store
const documentCache: DocumentCache = {
  petDocuments: new Map<string, CacheEntry<Document[]>>()
};

/**
 * Store documents in the cache
 */
export const cacheDocuments = (
  documents: Document[], 
  cacheKey: string = 'all'
): void => {
  const now = Date.now();
  
  if (cacheKey === 'all') {
    documentCache.allDocuments = { data: documents, timestamp: now };
  } else if (cacheKey === 'archived') {
    documentCache.archivedDocuments = { data: documents, timestamp: now };
  } else {
    // Assume it's a pet ID if not 'all' or 'archived'
    documentCache.petDocuments.set(cacheKey, { data: documents, timestamp: now });
  }
  
  console.log(`[Cache] Stored ${documents.length} documents for key: ${cacheKey}`);
};

/**
 * Get documents from cache if available and not expired
 */
export const getCachedDocuments = (
  cacheKey: string = 'all'
): Document[] | null => {
  const now = Date.now();
  let cacheEntry: CacheEntry<Document[]> | undefined;
  
  if (cacheKey === 'all') {
    cacheEntry = documentCache.allDocuments;
  } else if (cacheKey === 'archived') {
    cacheEntry = documentCache.archivedDocuments;
  } else {
    // Assume it's a pet ID
    cacheEntry = documentCache.petDocuments.get(cacheKey);
  }
  
  // Return null if no cache entry exists or if it's expired
  if (!cacheEntry || (now - cacheEntry.timestamp > CACHE_TTL)) {
    return null;
  }
  
  console.log(`[Cache] Using cached ${cacheEntry.data.length} documents for key: ${cacheKey}`);
  return cacheEntry.data;
};

/**
 * Clear specific cache or all caches
 */
export const clearDocumentCache = (cacheKey?: string): void => {
  if (!cacheKey) {
    // Clear all caches
    documentCache.allDocuments = undefined;
    documentCache.archivedDocuments = undefined;
    documentCache.petDocuments.clear();
    console.log('[Cache] Cleared all document caches');
    return;
  }
  
  if (cacheKey === 'all') {
    documentCache.allDocuments = undefined;
  } else if (cacheKey === 'archived') {
    documentCache.archivedDocuments = undefined;
  } else {
    // Assume it's a pet ID
    documentCache.petDocuments.delete(cacheKey);
  }
  
  console.log(`[Cache] Cleared cache for key: ${cacheKey}`);
};

/**
 * Invalidate document caches based on changes
 */
export const invalidateDocumentCaches = (petId?: string): void => {
  // Always invalidate the main documents cache
  documentCache.allDocuments = undefined;
  
  // If we have a pet ID, only invalidate that pet's cache
  if (petId) {
    documentCache.petDocuments.delete(petId);
    console.log(`[Cache] Invalidated caches for petId: ${petId} and all documents`);
  } else {
    // Otherwise invalidate all pet document caches
    documentCache.petDocuments.clear();
    console.log('[Cache] Invalidated all document caches');
  }
};
