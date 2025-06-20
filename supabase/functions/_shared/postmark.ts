// Default sender email
const DEFAULT_FROM_EMAIL = "support@mypetid.vercel.app";
const MESSAGE_STREAM = "outbound";

import { ServerClient } from "https://esm.sh/postmark";

// Email interface
export interface EmailData {
  to: string;
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
}

// Get Postmark API token
export function getPostmarkApiToken(): string | null {
  const postmarkApiToken = Deno.env.get("POSTMARK_API_TOKEN");
  if (!postmarkApiToken) {
    console.error("POSTMARK_API_TOKEN environment variable is not set");
    return null;
  }
  return postmarkApiToken;
}

// Initialize Postmark client
export const postmarkClient = (() => {
  const apiToken = getPostmarkApiToken();
  if (!apiToken) {
    console.error("Failed to initialize Postmark client: API token not available");
    return null;
  }
  return new ServerClient(apiToken);
})();

// Initialize Postmark (just checks if API token is available)
export function initPostmark(): boolean {
  return postmarkClient !== null;
}

// Send email function using Postmark client
export async function sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: any; response?: any }> {
  try {
    // Check if Postmark client is initialized
    if (!postmarkClient) {
      throw new Error("Postmark client not initialized");
    }
    
    // Use default from email if not provided
    const from = emailData.from || DEFAULT_FROM_EMAIL;
    
    // Validate required fields
    if (!emailData.to || !emailData.subject) {
      throw new Error("Missing required fields: to and subject are required");
    }
    
    // Validate that either text, html, or templateId is provided
    if (!emailData.text && !emailData.html && !emailData.templateId) {
      throw new Error("Either text, html, or templateId must be provided");
    }
    
    console.log(`Sending email to ${emailData.to} with subject: ${emailData.subject}`);
    
    let response;
    
    // Send email using template if provided
    if (emailData.templateId) {
      response = await postmarkClient.sendEmailWithTemplate({
        From: from,
        To: emailData.to,
        TemplateId: parseInt(emailData.templateId),
        TemplateModel: emailData.dynamicTemplateData || {},
        MessageStream: MESSAGE_STREAM,
      });
    } else {
      // Send regular email
      response = await postmarkClient.sendEmail({
        From: from,
        To: emailData.to,
        Subject: emailData.subject,
        TextBody: emailData.text,
        HtmlBody: emailData.html,
        MessageStream: MESSAGE_STREAM,
      });
    }
    
    console.log("Email sent successfully");
    return { success: true, response };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: {
        message: error.message,
        response: error.response || null
      }
    };
  }
}
