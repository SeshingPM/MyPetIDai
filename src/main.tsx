import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/animations.css";


// Create error handler for React rendering
const handleRenderError = (error: Error) => {
  console.error("Error rendering application:", error);

  // Create error display element
  const errorDisplay = document.createElement("div");
  errorDisplay.style.padding = "20px";
  errorDisplay.style.margin = "20px";
  errorDisplay.style.backgroundColor = "#fff3f3";
  errorDisplay.style.border = "1px solid #ffcaca";
  errorDisplay.style.borderRadius = "4px";
  errorDisplay.style.fontFamily = "system-ui, sans-serif";

  errorDisplay.innerHTML = `
    <h2 style="color: #e00; margin-top: 0;">Application Error</h2>
    <p>The application failed to load properly. Please try refreshing the page.</p>
    <details>
      <summary style="cursor: pointer; color: #666;">Technical Details</summary>
      <pre style="background: #f5f5f5; padding: 10px; overflow: auto;">${error.message}</pre>
    </details>
    <button id="refresh-button" style="margin-top: 15px; padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Refresh Page
    </button>
  `;

  // Find or create container
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = "";
    rootElement.appendChild(errorDisplay);

    // Add refresh button handler
    document.getElementById("refresh-button")?.addEventListener("click", () => {
      window.location.reload();
    });
  }
};

// Create root element and render app
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Failed to find the root element");
    throw new Error("Root element not found");
  }

  console.log("Root element found, creating React root");
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <React.Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <App />
      </React.Suspense>
    </React.StrictMode>
  );

  console.log("App successfully rendered");
} catch (error) {
  console.error("Critical error during application initialization:", error);
  handleRenderError(
    error instanceof Error ? error : new Error("Unknown application error")
  );
}

// Only register service worker in production
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
