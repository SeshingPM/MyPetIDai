import React, { useEffect } from 'react';
import GlassCard from '@/components/ui-custom/GlassCard';
import { Plus, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DocumentCard from '@/components/documents/DocumentCard';
import FadeIn from '@/components/animations/FadeIn';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { fetchAllDocuments } from '@/utils/document-api/fetch';
import { Document } from '@/utils/types';

// Direct implementation of document fetching without a separate hook
const DocumentsTab: React.FC = () => {
  const navigate = useNavigate();
  
  // Directly use React Query here to ensure we're getting fresh data
  const {
    data: documents = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['dashboardDocuments'],
    queryFn: async () => {
      console.log('[DocumentsTab] Fetching documents...');
      try {
        // Fetch all documents and take only the most recent ones
        const allDocs = await fetchAllDocuments(false);
        console.log(`[DocumentsTab] Fetched ${allDocs.length} documents:`, allDocs);
        
        // Sort by createdAt in descending order (newest first)
        const sortedDocs = [...allDocs].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        const limitedDocs = sortedDocs.slice(0, 3);
        console.log(`[DocumentsTab] Returning ${limitedDocs.length} documents`);
        return limitedDocs;
      } catch (err) {
        console.error('[DocumentsTab] Error fetching documents:', err);
        throw err;
      }
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
    placeholderData: [],
  });
  
  useEffect(() => {
    console.log('[DocumentsTab] Component mounted');
    console.log('[DocumentsTab] Documents:', documents);
    
    // Force a refetch when the component mounts
    refetch().then(result => {
      console.log('[DocumentsTab] Refetch result:', result);
    }).catch(err => {
      console.error('[DocumentsTab] Refetch error:', err);
    });
    
    return () => {
      console.log('[DocumentsTab] Component unmounted');
    };
  }, [refetch]);

  // Loading state
  if (isLoading) {
    return (
      <FadeIn>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Recent Documents</h2>
            <p className="text-sm text-gray-500">Quickly access your latest uploads</p>
          </div>
          <button 
            onClick={() => navigate('/documents')}
            className="flex items-center gap-1 text-primary text-sm hover:underline"
          >
            View All <ExternalLink size={14} />
          </button>
        </div>
        <div className="space-y-2.5 sm:space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-24" />
          ))}
        </div>
      </FadeIn>
    );
  }

  // Error state
  if (error) {
    return (
      <FadeIn>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Recent Documents</h2>
            <p className="text-sm text-gray-500">Quickly access your latest uploads</p>
          </div>
          <button 
            onClick={() => navigate('/documents')}
            className="flex items-center gap-1 text-primary text-sm hover:underline"
          >
            View All <ExternalLink size={14} />
          </button>
        </div>
        <GlassCard className="p-4 text-center">
          <p className="text-red-500 mb-2">Failed to load documents</p>
          <button 
            onClick={() => navigate('/documents')}
            className="text-primary text-sm hover:underline"
          >
            View all documents
          </button>
        </GlassCard>
      </FadeIn>
    );
  }

  // Empty state
  if (documents.length === 0) {
    return (
      <FadeIn>
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Recent Documents</h2>
            <p className="text-sm text-gray-500">Quickly access your latest uploads</p>
          </div>
          <button 
            onClick={() => navigate('/documents')}
            className="flex items-center gap-1 text-primary text-sm hover:underline"
          >
            View All <ExternalLink size={14} />
          </button>
        </div>
        <GlassCard className="p-4 text-center">
          <p className="mb-2">No documents yet</p>
          <button 
            onClick={() => navigate('/documents')}
            className="text-primary text-sm hover:underline"
          >
            Add your first document
          </button>
        </GlassCard>
      </FadeIn>
    );
  }

  return (
    <FadeIn>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Recent Documents</h2>
          <p className="text-sm text-gray-500">Quickly access your latest uploads</p>
        </div>
        <button 
          onClick={() => navigate('/documents')}
          className="flex items-center gap-1 text-primary text-sm hover:underline"
        >
          View All <ExternalLink size={14} />
        </button>
      </div>
      
      <div className="space-y-2.5 sm:space-y-3">
        {documents.map((doc) => (
          <DocumentCard 
            key={doc.id} 
            document={doc}
            disableSelection={true}
          />
        ))}
        
        <GlassCard 
          className="flex items-center justify-center py-5 sm:py-6 cursor-pointer" 
          onClick={() => navigate('/documents')}
        >
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <Plus size={20} className="text-primary" />
            </div>
            <h3 className="font-medium text-gray-700 text-sm">Add New Document</h3>
          </div>
        </GlassCard>
      </div>
    </FadeIn>
  );
};

export default DocumentsTab;
