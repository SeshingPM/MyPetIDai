import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useConditionalDeferredRender from '@/hooks/use-conditional-deferred-render';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import DocumentsList from '@/components/documents/DocumentsList';
import DocumentsLoadingState from '@/components/documents/DocumentsLoadingState';
import DocumentsSkeleton from '@/components/documents/DocumentsSkeleton';
import DocumentsErrorState from '@/components/documents/DocumentsErrorState';
import DocumentsEmptyState from '@/components/documents/DocumentsEmptyState';
import { Document } from '@/utils/types';
import { fetchArchivedDocuments } from '@/utils/document-api/fetch';

interface DocumentsTabsProps {
  className?: string;
  documents?: Document[];
  isLoading?: boolean;
  error?: Error;
  refetch?: () => void;
  onAddDocument?: () => void;
  onEmailDocument?: (document: Document) => void;
  onShareDocument?: (document: Document) => void;
  onToggleFavorite?: (document: Document) => void;
  onEditDocument?: (document: Document) => void;
}

const DocumentsTabs: React.FC<DocumentsTabsProps> = ({
  className,
  documents,
  isLoading = false,
  error,
  refetch,
  onAddDocument,
  onEmailDocument,
  onShareDocument,
  onToggleFavorite,
  onEditDocument
}) => {
  // State for data readiness to prevent empty state flicker
  const [dataReady, setDataReady] = useState(false);
  const [activeDataReady, setActiveDataReady] = useState(false);
  const [archivedDataReady, setArchivedDataReady] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [archivedDocuments, setArchivedDocuments] = useState<Document[]>([]);
  const [isLoadingArchived, setIsLoadingArchived] = useState(false);
  const [archivedError, setArchivedError] = useState<Error | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('active');
  const [bookmarkedDocuments, setBookmarkedDocuments] = useState<Document[]>([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(false);
  const [bookmarkedError, setBookmarkedError] = useState<Error | null>(null);
  const [hasLoadedBookmarks, setHasLoadedBookmarks] = useState(false);
  const [bookmarkedDataReady, setBookmarkedDataReady] = useState(false);
  const [hasLoadedArchived, setHasLoadedArchived] = useState(false);
  
  // Synchronized deferred renders for empty states that only start after loading completes
  const shouldRenderActiveEmptyState = useConditionalDeferredRender(
    'documents-empty-state',
    // Only start timer when loading is complete AND data is ready AND we know we have no documents
    !isLoading && activeDataReady && documents !== undefined && documents.length === 0,
    800
  );
  
  const shouldRenderBookmarksEmptyState = useConditionalDeferredRender(
    'bookmarks-empty-state',
    !isLoadingBookmarks && bookmarkedDataReady && bookmarkedDocuments !== undefined && bookmarkedDocuments.length === 0,
    800
  );
  
  const shouldRenderArchivedEmptyState = useConditionalDeferredRender(
    'archived-empty-state',
    !isLoadingArchived && archivedDataReady && archivedDocuments !== undefined && archivedDocuments.length === 0,
    800
  );
  
  // Effect to handle active data readiness
  useEffect(() => {
    // When starting to load, reset the ready state
    if (isLoading) {
      setActiveDataReady(false);
      return;
    }
    
    // When loading is done, set data as ready but with a delay
    // This ensures a smooth transition to the document list or empty state
    if (!isLoading && documents !== undefined) {
      const timer = setTimeout(() => {
        setActiveDataReady(true);
      }, 400); // Slightly longer delay to ensure smooth transition
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, documents]);

  // Determine the initial tab based on the URL path
  const getInitialTab = (): string => {
    if (location.pathname.startsWith('/documents/active')) {
      return 'active';
    } else if (location.pathname.startsWith('/documents/archived')) {
      return 'archived';
    } else if (location.pathname.startsWith('/documents/bookmarks')) {
      return 'bookmarks';
    } else {
      return 'active'; // Default to active
    }
  };

  // Set initial tab on component mount
  useEffect(() => {
    setCurrentTab(getInitialTab());
  }, []);

  // Function to handle tab changes
  const handleTabChange = (tab: string) => {
    // Update local state
    setCurrentTab(tab);
    
    // Update URL to reflect the active tab
    if (tab === 'active') {
      navigate('/documents/active');
    } else if (tab === 'archived') {
      navigate('/documents/archived');
    } else if (tab === 'bookmarks') {
      navigate('/documents/bookmarks');
      
      // Load bookmarked documents if they haven't been loaded yet
      if (!hasLoadedBookmarks) {
        loadBookmarkedDocuments();
      }
    }

    // Clear the category filter when switching tabs
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  // Effect to handle archived data readiness
  useEffect(() => {
    if (!isLoadingArchived && archivedDocuments !== undefined) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setArchivedDataReady(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else if (isLoadingArchived) {
      setArchivedDataReady(false);
    }
  }, [isLoadingArchived, archivedDocuments]);
  
  // Effect to handle bookmarks data readiness
  useEffect(() => {
    if (!isLoadingBookmarks && bookmarkedDocuments !== undefined) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setBookmarkedDataReady(true);
      }, 300);
      
      return () => clearTimeout(timer);
    } else if (isLoadingBookmarks) {
      setBookmarkedDataReady(false);
    }
  }, [isLoadingBookmarks, bookmarkedDocuments]);
  
  // Load archived or bookmarked documents when the respective tab is selected
  useEffect(() => {
    if (currentTab === 'archived' && !hasLoadedArchived) {
      loadArchivedDocuments();
    } else if (currentTab === 'bookmarks' && !hasLoadedBookmarks) {
      loadBookmarkedDocuments();
    }
  }, [currentTab, hasLoadedArchived, hasLoadedBookmarks]);

  // Load archived documents
  const loadArchivedDocuments = async () => {
    try {
      setIsLoadingArchived(true);
      const archived = await fetchArchivedDocuments();
      setArchivedDocuments(archived);
      setHasLoadedArchived(true);
    } catch (error) {
      console.error('Error loading archived documents:', error);
      setArchivedError(error as Error);
    } finally {
      setIsLoadingArchived(false);
    }
  };

  // Load bookmarked documents
  const loadBookmarkedDocuments = async () => {
    try {
      setIsLoadingBookmarks(true);
      
      // Filter documents to get only bookmarked ones
      const bookmarked = documents?.filter(doc => doc.isFavorite) || [];
      setBookmarkedDocuments(bookmarked);
      setHasLoadedBookmarks(true);
    } catch (error) {
      console.error('Error filtering bookmarked documents:', error);
      setBookmarkedError(error as Error);
    } finally {
      setIsLoadingBookmarks(false);
    }
  };

  // Handle document deletion (for active documents)
  const handleDocumentDeleted = () => {
    if (refetch) {
      refetch();
    }
  };

  // Handle toggling a document's favorite status
  const handleToggleFavorite = async (document: Document) => {
    try {
      // If the parent component provided a toggleFavorite handler, use that
      if (onToggleFavorite) {
        await onToggleFavorite(document);
      }
      
      // Update local state of bookmarked documents
      if (hasLoadedBookmarks) {
        // If we're marking a document as favorite, add it to bookmarks
        if (!document.isFavorite) {
          setBookmarkedDocuments(prev => [...prev, { ...document, isFavorite: true }]);
        } else {
          // If we're removing a favorite, remove it from bookmarks
          setBookmarkedDocuments(prev => 
            prev.filter(doc => doc.id !== document.id)
          );
        }
        
        // Force refresh of bookmarked documents to ensure they're in sync
        if (currentTab === 'bookmarks') {
          setTimeout(() => {
            loadBookmarkedDocuments();
          }, 300);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Handle document restoration (for archived view)
  const handleDocumentRestored = () => {
    // Refresh both active and archived documents
    if (refetch) {
      refetch();
    }
    
    // Reload archived documents
    const reloadArchivedDocuments = async () => {
      try {
        setIsLoadingArchived(true);
        const archived = await fetchArchivedDocuments();
        setArchivedDocuments(archived);
        setHasLoadedArchived(true);
      } catch (error) {
        console.error('Error reloading archived documents:', error);
        setArchivedError(error as Error);
      } finally {
        setIsLoadingArchived(false);
      }
    };
    
    reloadArchivedDocuments();
    
    // Also reload bookmarked documents if they have been loaded previously
    if (hasLoadedBookmarks) {
      loadBookmarkedDocuments();
    }
  };

  // Helper function to render bookmarked tab content
  const renderBookmarkedTabContent = useCallback(() => {
    // Conservative Loading Check
    // Show skeleton during loading or when bookmarked documents is undefined
    if (isLoadingBookmarks || !bookmarkedDataReady || bookmarkedDocuments === undefined) {
      return <DocumentsSkeleton />;
    }
    
    // Error state after loading completes
    if (bookmarkedError) {
      return <DocumentsErrorState onRetry={() => handleTabChange('bookmarks')} />;
    }
    
    // If we have documents, show them immediately
    if (bookmarkedDocuments.length > 0) {
      return (
        <DocumentsList
          documents={bookmarkedDocuments}
          onDocumentDeleted={handleDocumentDeleted}
          onToggleFavorite={handleToggleFavorite}
          onEmailDocument={onEmailDocument}
          onShareDocument={onShareDocument}
          onEditDocument={onEditDocument}
        />
      );
    }
    
    // For empty state, either show skeleton or empty state based on deferred render
    return shouldRenderBookmarksEmptyState ? (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No bookmarked documents</h3>
        <p className="text-gray-500 mt-2">Star a document to add it to your bookmarks for quick access.</p>
      </div>
    ) : (
      <DocumentsSkeleton />
    );
  }, [
    bookmarkedDataReady, 
    isLoadingBookmarks, 
    bookmarkedError, 
    bookmarkedDocuments, 
    shouldRenderBookmarksEmptyState,
    handleDocumentDeleted, 
    handleToggleFavorite, 
    onEmailDocument, 
    onShareDocument, 
    onEditDocument,
    handleTabChange
  ]);

  // Helper function to render active tab content
  const renderActiveTabContent = useCallback(() => {
    // Always show skeleton during loading or when data isn't ready
    if (isLoading || !activeDataReady || documents === undefined) {
      return <DocumentsSkeleton />;
    }
    
    // Check for errors after loading is complete
    if (error) {
      return <DocumentsErrorState onRetry={refetch} />;
    }
    
    // If we have documents, show them immediately
    if (documents.length > 0) {
      return (
        <DocumentsList
          documents={documents}
          onDocumentDeleted={handleDocumentDeleted}
          onToggleFavorite={handleToggleFavorite}
          onEmailDocument={onEmailDocument}
          onShareDocument={onShareDocument}
          onEditDocument={onEditDocument}
        />
      );
    }
    
    // For empty state, either show skeleton or empty state based on deferred render
    // The conditional deferred render will only return true after loading is complete,
    // we know we have no documents, AND a sufficient delay has passed
    return shouldRenderActiveEmptyState ? (
      <DocumentsEmptyState onAddDocument={onAddDocument} />
    ) : (
      <DocumentsSkeleton />
    );
  }, [
    activeDataReady, 
    isLoading, 
    documents, 
    error, 
    shouldRenderActiveEmptyState,
    refetch, 
    onAddDocument, 
    handleDocumentDeleted, 
    handleToggleFavorite,
    onEmailDocument, 
    onShareDocument, 
    onEditDocument
  ]);

  // Helper function to render archived tab content
  const renderArchivedTabContent = useCallback(() => {
    // Conservative Loading Check
    // Show skeleton during loading, when data isn't ready, or when documents is undefined
    if (isLoadingArchived || !archivedDataReady || archivedDocuments === undefined) {
      return <DocumentsSkeleton />;
    }
    
    // Show error states after loading completes
    if (archivedError) {
      return <DocumentsErrorState onRetry={() => handleTabChange('archived')} />;
    }
    
    // If we have documents, show them immediately
    if (archivedDocuments.length > 0) {
      return (
        <DocumentsList
          documents={archivedDocuments}
          onDocumentDeleted={handleDocumentRestored}
          onDocumentRestored={handleDocumentRestored}
          onEmailDocument={onEmailDocument}
          onShareDocument={onShareDocument}
          isArchiveView={true}
        />
      );
    }
    
    // For empty state, either show skeleton or empty state based on deferred render
    return shouldRenderArchivedEmptyState ? (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No archived documents</h3>
        <p className="text-gray-500 mt-2">Documents you archive will appear here.</p>
      </div>
    ) : (
      <DocumentsSkeleton />
    );
  }, [
    archivedDataReady, 
    isLoadingArchived, 
    archivedError, 
    archivedDocuments,
    shouldRenderArchivedEmptyState,
    handleTabChange, 
    handleDocumentRestored, 
    onEmailDocument, 
    onShareDocument
  ]);

  return (
    <Tabs
      defaultValue={currentTab}
      className={cn("w-full", className)}
      onValueChange={handleTabChange}
    >
      <TabsList className="bg-secondary rounded-md p-1">
        <TabsTrigger
          value="active"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md"
        >
          Active
        </TabsTrigger>
        <TabsTrigger
          value="bookmarks"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md"
        >
          Bookmarks
        </TabsTrigger>
        <TabsTrigger
          value="archived"
          className="data-[state=active]:bg-background data-[state=active]:text-foreground rounded-md"
        >
          Archived
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="active"
        className="mt-4 border-none p-0 outline-none"
        forceMount
      >
        {currentTab === 'active' && renderActiveTabContent()}
      </TabsContent>

      <TabsContent
        value="bookmarks"
        className="mt-4 border-none p-0 outline-none"
        forceMount
      >
        {currentTab === 'bookmarks' && renderBookmarkedTabContent()}
      </TabsContent>

      <TabsContent
        value="archived"
        className="mt-4 border-none p-0 outline-none"
        forceMount
      >
        {currentTab === 'archived' && renderArchivedTabContent()}
      </TabsContent>
    </Tabs>
  );
};

export default DocumentsTabs;
