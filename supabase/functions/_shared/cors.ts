/**
 * Shared CORS configuration for Supabase Edge Functions
 * Provides secure CORS handling with specific allowed origins
 */

// Add Deno namespace declaration for TypeScript
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Define allowed origins
const allowedOrigins = [
  // Use proper type handling for Deno environment
  (typeof Deno !== "undefined" ? Deno.env.get("FRONTEND_URL") : undefined) || "https://yourapp.com",
  // Add additional authorized domains as needed
  "https://staging.yourapp.com",
  // During local development only
  "http://localhost:3000",
  "http://localhost:5173",
];

/**
 * Get appropriate CORS headers based on the request origin
 * @param requestOrigin The origin from the incoming request
 * @returns CORS headers object
 */
export function getCorsHeaders(requestOrigin?: string) {
  // Match the request origin against our allowed origins
  const origin = requestOrigin && allowedOrigins.includes(requestOrigin)
    ? requestOrigin 
    : allowedOrigins[0];
    
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };
}

/**
 * Handle CORS preflight requests
 * @param req The incoming request
 * @returns Response object for OPTIONS requests or null for other methods
 */
export function handleCors(req: Request): Response | null {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    const origin = req.headers.get("origin") || "";
    return new Response(null, { 
      headers: getCorsHeaders(origin)
    });
  }
  
  return null;
}
