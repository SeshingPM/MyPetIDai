import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Debug version of the shared document page - no authentication checks
 */
const SharedDocumentDebug: React.FC = () => {
  const params = useParams<{ shareId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const shareId = params.shareId;
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  useEffect(() => {
    // Log page information
    addLog(`Debug page loaded with path: ${location.pathname}`);
    addLog(`ShareId from params: ${shareId}`);
    addLog(`Full URL: ${window.location.href}`);

    const fetchDocument = async () => {
      if (!shareId) {
        addLog("No shareId found in URL params");
        setError("Invalid share link");
        setLoading(false);
        return;
      }

      addLog(`Looking up document with shareId: ${shareId}`);

      try {
        // Query the document by share ID - directly using supabase client
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("share_id", shareId)
          .maybeSingle();

        addLog(`Query completed. Error: ${error?.message || "none"}`);
        addLog(`Document found: ${data ? "yes" : "no"}`);

        if (error) {
          setError(`Database query error: ${error.message}`);
          addLog(`Error details: ${JSON.stringify(error)}`);
        } else if (!data) {
          setError("Document not found or link expired");
          addLog("No document data returned");
        } else {
          setDocument(data);
          addLog(`Document name: ${data.name}`);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Error fetching document: ${errorMessage}`);
        addLog(`Exception: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [shareId, location]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-6 shadow-md mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Shared Document Debug View
          </h1>
          <p className="text-gray-500 mb-4">
            Troubleshooting shared document access
          </p>

          <div className="mb-4 p-3 border border-gray-200 rounded-md">
            <h2 className="text-lg font-semibold">URL Parameters</h2>
            <p className="mb-1">
              <strong>ShareID:</strong> {shareId || "Not found"}
            </p>
            <p className="mb-1">
              <strong>Full Path:</strong> {location.pathname}
            </p>
          </div>

          <div className="mb-4 p-3 border border-gray-200 rounded-md">
            <h2 className="text-lg font-semibold">Status</h2>
            <p className="mb-1">
              <strong>Loading:</strong> {loading ? "Yes" : "No"}
            </p>
            <p className="mb-1">
              <strong>Error:</strong> {error || "None"}
            </p>
            <p className="mb-1">
              <strong>Document found:</strong> {document ? "Yes" : "No"}
            </p>
          </div>

          {document && (
            <div className="mb-4 p-3 border border-gray-200 rounded-md bg-green-50">
              <h2 className="text-lg font-semibold text-green-700">
                Document Information
              </h2>
              <p className="mb-1">
                <strong>Name:</strong> {document.name}
              </p>
              <p className="mb-1">
                <strong>Created:</strong>{" "}
                {new Date(document.created_at).toLocaleString()}
              </p>
              {document.share_expiry && (
                <p className="mb-1">
                  <strong>Expires:</strong>{" "}
                  {new Date(document.share_expiry).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>

        <div
          className="bg-black text-green-400 p-4 rounded-lg shadow-md overflow-auto"
          style={{ maxHeight: "400px" }}
        >
          <h2 className="text-xl mb-2 font-mono">Debug Logs</h2>
          <div className="font-mono text-sm">
            {logs.map((log, i) => (
              <div key={i} className="border-b border-gray-800 py-1">
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate("/shared/" + shareId)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Standard View
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharedDocumentDebug;
