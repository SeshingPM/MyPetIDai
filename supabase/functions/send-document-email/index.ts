import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import {
  corsHeaders,
  createResponse,
  createErrorResponse,
  validateToken,
  createValidatedClient,
} from "../_shared/auth.ts";
import { sendEmail } from "../_shared/postmark.ts";
import { addHours } from "https://esm.sh/date-fns@2.30.0";

// Handle preflight CORS
const handleCors = (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
};

serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Validate request method
  if (req.method !== "POST") {
    return createErrorResponse("Method not allowed", null, 405);
  }

  try {
    // Validate JWT token
    const { valid, userId, error: authError } = await validateToken(req);

    if (!valid || !userId) {
      return createErrorResponse(
        "Unauthorized: " + (authError || "Invalid token"),
        null,
        401
      );
    }

    // Get request body
    const { documentId, recipientEmail, subject, message } = await req.json();

    // Validate required parameters
    if (!documentId || !recipientEmail) {
      return createErrorResponse(
        "Missing required fields: documentId and recipientEmail are required",
        null,
        400
      );
    }

    // Initialize Supabase client with service role key
    const supabase = createValidatedClient();

    // Validate document exists and belongs to user
    const { data: document, error: documentError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", userId)
      .single();

    if (documentError || !document) {
      console.error("Error fetching document:", documentError);
      return createErrorResponse(
        "Document not found or access denied",
        documentError,
        404
      );
    }

    // Log user ID for debugging
    console.log("Looking up profile for user ID:", userId);

    // Try multiple profile lookup approaches

    // 1. First try: direct profiles table lookup - prioritize full_name field
    const { data: senderProfile, error: senderError } = await supabase
      .from("profiles")
      .select("full_name, display_name, id, email")
      .eq("id", userId)
      .single();

    console.log("Profile lookup result:", {
      found: !!senderProfile,
      error: senderError?.message || null,
      fields: senderProfile ? Object.keys(senderProfile) : [],
    });

    // Determine sender name using available data
    let senderName = "Someone";

    // Prioritize full_name from the profiles table
    if (senderProfile) {
      if (senderProfile.full_name) {
        senderName = senderProfile.full_name;
      } else if (senderProfile.display_name) {
        senderName = senderProfile.display_name;
      } else if (senderProfile.email) {
        senderName = senderProfile.email.split("@")[0];
      }
    }

    // If no profile data, fall back to auth user data
    if (senderName === "Someone") {
      // Fall back to auth user data
      const { data: authUserData } =
        await supabase.auth.admin.getUserById(userId);

      if (authUserData?.user) {
        if (authUserData.user.user_metadata?.full_name) {
          senderName = authUserData.user.user_metadata.full_name;
        } else if (authUserData.user.user_metadata?.name) {
          senderName = authUserData.user.user_metadata.name;
        } else if (authUserData.user.email) {
          senderName = authUserData.user.email.split("@")[0];
        }
      }
    }

    console.log("Final sender name:", senderName);

    // Generate a share link or use existing one
    let shareId = document.share_id;
    let shareUrl;

    if (
      !shareId ||
      !document.share_expiry ||
      new Date(document.share_expiry) < new Date()
    ) {
      // Create a new share link if it doesn't exist or has expired
      shareId = `share_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      const shareExpiry = addHours(new Date(), 48).toISOString();

      // Update the document with the new share info
      const { error: updateError } = await supabase
        .from("documents")
        .update({
          share_id: shareId,
          share_expiry: shareExpiry,
        })
        .eq("id", documentId);

      if (updateError) {
        console.error("Error updating document with share link:", updateError);
        return createErrorResponse(
          "Failed to generate share link",
          updateError,
          500
        );
      }
    }

    // Construct the share URL based on the origin from the request
    const origin = req.headers.get("origin") || "https://mypetid.vercel.app";
    shareUrl = `${origin}/shared/${shareId}`;

    // Format expire date nicely if available
    let expiryMessage = "";
    if (document.share_expiry) {
      const expiry = new Date(document.share_expiry);
      expiryMessage = `This link will expire on ${expiry.toLocaleDateString()} at ${expiry.toLocaleTimeString()}.`;
    }

    // Send the email using Postmark
    const emailResult = await sendEmail({
      to: recipientEmail,
      subject: subject || `Secure MyPetID`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <h2 style="color: #333;">${senderName} shared a document with you</h2>

          ${message ? `<p style="margin: 16px 0; font-size: 16px;">"${message}"</p>` : ""}

          <p style="font-size: 16px; color: #444; margin: 16px 0;">
            You've received a document titled <strong>${document.name}</strong> via MyPetID.
          </p>

          <p style="font-size: 16px; margin-bottom: 24px;">
            Click the button below to view it securely:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${shareUrl}" 
              style="background-color: #4F46E5; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin-bottom: 15px;">
              View Document
            </a>
          </div>

          <p style="font-size: 14px; color: #666; margin-bottom: 8px;">
            ${expiryMessage}
          </p>
          <p style="font-size: 14px; color: #666;">
            No account is needed — just click and view.
          </p>

          <hr style="margin: 32px 0; border: none; border-top: 1px solid #eaeaea;" />

          <p style="font-size: 12px; color: #aaa; text-align: center; margin-bottom: 24px;">
            MyPetID · Smarter Digital ID & Health Management for Pets
          </p>

          <p style="font-size: 12px; color: #999;">
            This message was sent automatically by MyPetID. If you weren't expecting this email, you can safely ignore it.<br />
            Need help? Contact us at <a href="mailto:support@mypetid.vercel.app" style="color: #4F46E5;">support@mypetid.vercel.app</a>
          </p>
        </div>
      `,
    });

    if (!emailResult.success) {
      console.error("Error sending email:", emailResult.error);
      return createErrorResponse(
        "Failed to send email",
        emailResult.error,
        500
      );
    }

    // Record the email in our database
    const { error: dbError } = await supabase.from("document_emails").insert({
      document_id: documentId,
      sender_id: userId,
      recipient_email: recipientEmail,
      subject: subject || `Secure MyPetID`,
      message: message || "",
      share_url: shareUrl,
    });

    if (dbError) {
      console.error("Error recording email in database:", dbError);
      // Non-blocking error - we still sent the email
    }

    // Return success response
    return createResponse({
      success: true,
      message: "Email sent successfully",
      shareUrl,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return createErrorResponse(
      "An unexpected error occurred",
      error.message,
      500
    );
  }
});
