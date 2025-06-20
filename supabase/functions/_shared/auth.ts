// Import Deno type declarations
import "./deno.types.ts";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

/**
 * CORS headers for browser requests
 * @returns Headers object with configured CORS settings
 */
export const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("FRONTEND_URL") || "https://mypetid.vercel.app",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Response helpers
export const createResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
};

export const createErrorResponse = (
  message: string,
  details: any = null,
  status = 400
) => {
  return createResponse({ error: message, details }, status);
};

// Validate JWT token
export async function validateToken(
  req: Request
): Promise<{ valid: boolean; userId?: string; error?: string }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { valid: false, error: "Authorization header is required" };
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get JWT token from Authorization header
    const token = authHeader.replace("Bearer ", "");

    // Verify JWT token
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { valid: false, error: error?.message || "Invalid token" };
    }

    return { valid: true, userId: user.id };
  } catch (error) {
    console.error("Error validating token:", error);
    return { valid: false, error: error.message };
  }
}

/**
 * Creates a Supabase client with environment validation
 * This function ensures we're not using test databases in production
 */
export function createValidatedClient(options = {}) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
    Deno.env.get("SUPABASE_ANON_KEY") ||
    "";
  const environment = Deno.env.get("ENVIRONMENT") || "development";
  const isVercelPreview = Deno.env.get("VERCEL_ENV") === "preview";

  // Validate environment configuration - but allow test DB in preview environments
  if (
    environment === "production" &&
    !isVercelPreview &&
    supabaseUrl.includes("yyqodsrvslheazteialw")
  ) {
    throw new Error(
      "CRITICAL ERROR: Edge function using test database in production environment"
    );
  }

  // Create and return the client
  return createClient(supabaseUrl, supabaseKey, options);
}
