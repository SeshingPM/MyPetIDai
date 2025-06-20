import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, createResponse, createErrorResponse, validateToken } from "../_shared/auth.ts";
import { sendEmail } from "../_shared/postmark.ts";

interface FeedbackData {
  type: 'bug' | 'feature' | 'other';
  description: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

serve(async (req) => {
  console.log("Processing feedback submission");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Validate JWT token
  const { valid, userId, error } = await validateToken(req);
  if (!valid) {
    return createErrorResponse(error || "Unauthorized", null, 401);
  }
  
  try {
    
    // Parse request body
    const feedbackData: FeedbackData = await req.json();
    
    // Log the incoming feedback data
    console.log("Received feedback:", feedbackData);
    
    // Send email using Postmark
    const emailResult = await sendEmail({
      to: "support@mypetid.vercel.app",
      subject: `New Customer Feedback - ${feedbackData.type}`,
      html: `
        <h2>New Feedback Submission</h2>
        <p><strong>Feedback Type:</strong> ${feedbackData.type}</p>
        <p><strong>Description:</strong> ${feedbackData.description}</p>
        <h3>User Info:</h3>
        <p><strong>User ID:</strong> ${feedbackData.userId || userId || 'Anonymous'}</p>
        <p><strong>Name:</strong> ${feedbackData.userName || 'N/A'}</p>
        <p><strong>Email:</strong> ${feedbackData.userEmail || 'N/A'}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `
    });
    
    if (!emailResult.success) {
      console.error("Error sending feedback email:", emailResult.error);
      return createErrorResponse("Error sending feedback email", emailResult.error, 500);
    }
    
    return createResponse({ 
      success: true, 
      message: "Feedback sent to support team" 
    });
  } catch (error) {
    console.error(`Error processing feedback: ${error.message}`);
    return createErrorResponse(error.message, null, 500);
  }
});
