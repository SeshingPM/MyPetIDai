import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import SEO from "@/components/seo/SEO";
import DocumentHeader from "@/components/shared-document/DocumentHeader";
import DocumentFooter from "@/components/shared-document/DocumentFooter";
import LoadingState from "@/components/shared-document/LoadingState";
import ErrorState from "@/components/shared-document/ErrorState";
import DocumentContent from "@/components/shared-document/DocumentContent";
import { useDocumentLoader } from "@/hooks/useDocumentLoader";

const SharedDocument: React.FC = () => {
  const params = useParams<{ shareId: string }>();
  const shareId = params.shareId;

  useEffect(() => {
    console.log(
      "[DEBUG] SharedDocument component mounted with params:",
      params
    );
    console.log("[DEBUG] Extracted shareId:", shareId);

    // Check if the URL contains additional segments after the shareId
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    console.log("[DEBUG] Path segments:", pathSegments);

    if (pathSegments.length > 2 && pathSegments[0] === "shared") {
      console.log(
        "[DEBUG] Warning: URL contains more than one segment after /shared/"
      );
      console.log(
        "[DEBUG] This might be causing routing issues - expected format is /shared/:shareId"
      );
    }
  }, [params, shareId]);

  const { document, loading, error } = useDocumentLoader({ shareId });

  useEffect(() => {
    console.log("[DEBUG] Document loader state:", { document, loading, error });
  }, [document, loading, error]);

  return (
    <>
      <SEO
        title={
          document ? `${document.name} - Shared Document` : "Shared Document"
        }
        description="View a shared document"
      />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DocumentHeader />

        <main className="flex-grow container max-w-3xl mx-auto px-4 py-8">
          {loading ? (
            <LoadingState />
          ) : error && !document ? (
            <ErrorState error={error} />
          ) : document ? (
            <DocumentContent document={document} />
          ) : null}
        </main>

        <DocumentFooter />
      </div>
    </>
  );
};

export default SharedDocument;
