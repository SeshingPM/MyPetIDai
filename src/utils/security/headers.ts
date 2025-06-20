/**
 * Security headers for HTTP responses
 * 
 * These headers help protect against common web vulnerabilities
 * such as XSS, clickjacking, MIME sniffing attacks, and more.
 */

/**
 * Get recommended security headers for application responses
 * @returns Object containing recommended security headers
 */
export const getSecurityHeaders = () => ({
  // Helps prevent XSS attacks by controlling what resources can be loaded
  "Content-Security-Policy": 
    "default-src 'self'; " +
    "script-src 'self' https://app.posthog.com https://*.vercel-insights.com 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.supabase.co https://app.posthog.com; " +
    "frame-src 'self'; " +
    "object-src 'none';",
  
  // Prevents browsers from MIME-sniffing a response away from the declared content-type
  "X-Content-Type-Options": "nosniff",
  
  // Controls how much referrer information should be included with requests
  "Referrer-Policy": "strict-origin-when-cross-origin",
  
  // Helps prevent clickjacking attacks by preventing the page from being framed
  "X-Frame-Options": "DENY",
  
  // Legacy header for older browsers to help prevent XSS
  "X-XSS-Protection": "1; mode=block",
  
  // Enforces HTTPS connections
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  
  // Controls which browser features and APIs can be used
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
});

/**
 * Apply security headers to a response object
 * @param response The response object to modify
 * @returns The response with security headers applied
 */
export const applySecurityHeaders = (response: Response): Response => {
  const headers = getSecurityHeaders();
  const newHeaders = new Headers(response.headers);
  
  // Apply each security header
  Object.entries(headers).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  // Return a new Response with the updated headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
};
