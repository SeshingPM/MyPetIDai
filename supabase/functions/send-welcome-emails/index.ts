import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";
import { corsHeaders, createResponse, createErrorResponse, validateToken } from "../_shared/auth.ts";
import { sendEmail } from "../_shared/postmark.ts";

// Add Deno namespace declaration to fix linting errors
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

interface WelcomeEmailQueueItem {
  id: string;
  user_id: string;
  email: string;
  registration_completed_at: string;
  email_sent: boolean;
  email_sent_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

interface UserProfile {
  id: string;
  full_name?: string;
}

serve(async (req) => {
  console.log("Processing welcome emails");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // Parse request body to get delay parameter
  let delayHours = 1; // Default to 1 hour delay
  
  try {
    const requestData = await req.json();
    if (requestData && typeof requestData.delay_hours === 'number') {
      delayHours = requestData.delay_hours;
      console.log(`Using custom delay of ${delayHours} hours`);
    } else {
      console.log(`Using default delay of ${delayHours} hours`);
    }
  } catch (error) {
    console.log('No delay parameter specified, using default delay');
  }
  
  // Get the authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return createErrorResponse("Authorization header is required", null, 401);
  }
  
  // Extract the token
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // Decode the token without verification to check the role
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const decoded = JSON.parse(atob(tokenParts[1]));
      
      // If it's a service role token, allow the request
      if (decoded.role === 'service_role') {
        console.log("Authenticated using service role token");
      } else {
        // For non-service role tokens, validate normally
        const { valid, error } = await validateToken(req);
        if (!valid) {
          return createErrorResponse(error || "Unauthorized", null, 401);
        }
      }
    } else {
      // Not a JWT token, validate normally
      const { valid, error } = await validateToken(req);
      if (!valid) {
        return createErrorResponse(error || "Unauthorized", null, 401);
      }
    }
  } catch (e) {
    console.error("Error validating token:", e);
    return createErrorResponse("Invalid token format", null, 401);
  }
  
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    // Enhanced logging of available environment variables (without showing actual values)
    console.log("Environment variables check:");
    console.log("- SUPABASE_URL exists:", !!Deno.env.get("SUPABASE_URL"));
    console.log("- SUPABASE_SERVICE_ROLE_KEY exists:", !!Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    console.log("- POSTMARK_API_TOKEN exists:", !!Deno.env.get("POSTMARK_API_TOKEN"));
    console.log("- POSTMARK_FROM_EMAIL exists:", !!Deno.env.get("POSTMARK_FROM_EMAIL"));
    
    if (!supabaseUrl) {
      throw new Error("SUPABASE_URL environment variable is not set");
    }
    
    if (!supabaseServiceKey) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is not set");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get current time in UTC
    const now = new Date();
    
    // Calculate cutoff time for delayed emails
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - delayHours);
    const cutoffTimeISOString = cutoffTime.toISOString();
    
    console.log(`Looking for unsent welcome emails older than ${delayHours} hour(s) (before ${cutoffTimeISOString})`);
    
    // Detailed logging of query parameters
    console.log("Query parameters for welcome_email_queue:");
    console.log("- Table: welcome_email_queue");
    console.log("- Conditions: email_sent = false AND registration_completed_at <= cutoff time");
    console.log("- Order: registration_completed_at ascending");
    
    const { data: queueItems, error: queueError } = await supabase
      .from('welcome_email_queue')
      .select('*')
      .eq('email_sent', false)
      .lte('registration_completed_at', cutoffTimeISOString)
      .order('registration_completed_at', { ascending: true });
      
    console.log("Database query response:");
    console.log("- Raw data:", JSON.stringify(queueItems));
    console.log("- Queue items found:", queueItems ? queueItems.length : 0);
    console.log("- Error:", queueError ? queueError.message : "None");
    
    // Log specific item details to help with debugging
    if (queueItems && queueItems.length > 0) {
      console.log("First queue item details:");
      console.log("- ID:", queueItems[0].id);
      console.log("- User ID:", queueItems[0].user_id);
      console.log("- Email:", queueItems[0].email);
      console.log("- Created at:", queueItems[0].created_at);
      console.log("- Email sent flag:", queueItems[0].email_sent);
    } else {
      console.log("No queue items found - this is unexpected since we confirmed there's an unsent email in the database");
    }
    
    if (queueError) {
      throw new Error(`Error fetching welcome email queue: ${queueError.message}`);
    }
    
    if (!queueItems || queueItems.length === 0) {
      console.log("No pending welcome emails to send");
      return createResponse({ message: "No pending welcome emails to send" });
    }
    
    console.log(`Found ${queueItems.length} welcome emails to send`);
    
    // Process each welcome email
    const processedEmails = [];
    
    for (const item of queueItems as WelcomeEmailQueueItem[]) {
      // Get user profile to get their full name
      const { data: userProfile, error: userProfileError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', item.user_id)
        .single();
      
      if (userProfileError) {
        console.error(`Error fetching user profile for user ${item.user_id}: ${userProfileError.message}`);
        continue;
      }
      
      // Send welcome email
      try {
        console.log(`Attempting to send welcome email to ${item.email} (user ${item.user_id})`);
        
        // Validate email format
        if (!item.email || !item.email.includes('@')) {
          console.error(`Invalid email format for user ${item.user_id}: ${item.email}`);
          continue;
        }
        
        // Check initialization of Postmark client
        const postmarkInitialized = await import("../_shared/postmark.ts").then(module => module.initPostmark());
        console.log("Postmark client initialized:", postmarkInitialized);
        
        if (!postmarkInitialized) {
          console.error("Postmark client not initialized - check POSTMARK_API_TOKEN environment variable");
          continue;
        }
        
        // Send email using Postmark
        console.log("Sending email with parameters:");
        console.log("- To:", item.email);
        console.log("- Subject: Welcome to MyPetID!");
        console.log("- User name:", userProfile?.full_name || 'there');
        
        const emailResult = await sendEmail({
          to: item.email,
          subject: "Welcome to MyPetID!",
          html: getWelcomeEmailHtml(userProfile?.full_name || 'there')
          // Note: from, MESSAGE_STREAM and other defaults are handled in the shared postmark.ts module
        });
        
        console.log("Email send result:", JSON.stringify(emailResult));
        
        if (!emailResult.success) {
          console.error(`Error sending welcome email for user ${item.user_id}: ${JSON.stringify(emailResult.error)}`);
          continue;
        }
        
        // Mark the welcome email as sent in the database
        console.log(`Marking welcome email as sent for ${item.id}`);
        
        const updatePayload = { 
          email_sent: true,
          email_sent_at: now.toISOString(),
          updated_at: now.toISOString()
        };
        
        console.log("Update payload:", JSON.stringify(updatePayload));
        
        const { data, error: updateError } = await supabase
          .from('welcome_email_queue')
          .update(updatePayload)
          .eq('id', item.id)
          .select()
          .single();
        
        if (updateError) {
          console.error(`Error updating welcome email status for ${item.id}: ${updateError.message}`);
          console.error("Full error:", JSON.stringify(updateError));
          continue;
        }
        
        console.log(`Successfully updated welcome email status for ${item.id}`);
        console.log("Updated data:", JSON.stringify(data));
        
        console.log(`Sent welcome email to ${item.email} (user ID: ${item.user_id})`);
        processedEmails.push({
          id: item.id,
          user_id: item.user_id,
          email: item.email,
          status: 'sent'
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error processing welcome email for user ${item.user_id}: ${errorMessage}`);
      }
    }
    
    return createResponse({
      message: `Processed ${processedEmails.length} welcome emails`,
      processed: processedEmails
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "No stack trace available";
    
    console.error("Error processing welcome emails:", errorMessage);
    console.error("Error stack trace:", errorStack);
    console.error("Error full details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    // Check for specific error types and provide more detailed messages
    if (errorMessage.includes("SUPABASE_URL")) {
      return createErrorResponse("Supabase configuration error", "SUPABASE_URL environment variable is missing", 500);
    } else if (errorMessage.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return createErrorResponse("Supabase configuration error", "SUPABASE_SERVICE_ROLE_KEY environment variable is missing", 500);
    } else if (errorMessage.includes("POSTMARK")) {
      return createErrorResponse("Email service configuration error", "Postmark API credentials are missing or invalid", 500);
    }
    
    return createErrorResponse("Error processing welcome emails", errorMessage, 500);
  }
});

/**
 * Generate the HTML content for the welcome email
 * 
 * @param name User's name or default greeting
 * @returns HTML content for the welcome email
 */
function getWelcomeEmailHtml(name: string): string {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
    <h2 style="color: #333;">Welcome to MyPetID!</h2>
    
    <p style="font-size: 16px; color: #444; margin: 16px 0;">
      Hi ${name},<br><br>
      We're thrilled to welcome you to MyPetID! You're now part of a growing community of pet owners who are organizing their pet's health and records with confidence and ease.
    </p>
    
    <p style="font-size: 16px; color: #444; margin: 16px 0;">
      Here's how to get started:
    </p>
    
    <ul style="font-size: 16px; color: #444; margin: 16px 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Add your pets to your profile</li>
      <li style="margin-bottom: 8px;">Upload your first pet document</li>
      <li style="margin-bottom: 8px;">Set up reminders for upcoming vaccinations and vet visits</li>
      <li style="margin-bottom: 8px;">Explore tools to manage records and stay on top of care</li>
    </ul>
    
    <p style="font-size: 16px; color: #444; margin: 16px 0;">
      We're here to make pet parenting simpler, smarter, and more secure.
    </p>

    <p style="font-size: 16px; color: #444; margin: 16px 0;">
      Best,<br>
      The MyPetID Team
    </p>
    
    <hr style="margin: 32px 0; border: none; border-top: 1px solid #eaeaea;" />

    <p style="font-size: 12px; color: #333; text-align: center; margin-bottom: 24px;">
      MyPetID - Smarter Digital ID & Health Management for Pets
    </p>

    <p style="font-size: 12px; color: #333; text-align: center;">
      This message was sent automatically by MyPetID. If you weren't expecting this email, you can safely ignore it.<br />
      Need help? Contact us at <a href="mailto:support@mypetid.vercel.app" style="color: #4F46E5;">support@mypetid.vercel.app</a>
    </p>
  </div>
`;
}
