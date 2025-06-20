
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders, createResponse, createErrorResponse } from "../_shared/auth.ts";
import { sendEmail } from "../_shared/postmark.ts";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

serve(async (req) => {
  console.log("Processing contact form submission");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    
    // Parse request body
    const contactData: ContactFormData = await req.json();
    
    // Log the incoming contact data
    console.log("Received contact form submission:", contactData);
    
    // Send email using Postmark
    const emailResult = await sendEmail({
      to: "support@mypetid.ai",
      subject: `Contact Form Submission: ${contactData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <h3>Message:</h3>
        <p>${contactData.message}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `
    });
    
    if (!emailResult.success) {
      console.error("Error sending contact email:", emailResult.error);
      return createErrorResponse("Error sending contact email", emailResult.error, 500);
    }
    
    return createResponse({ 
      success: true, 
      message: "Contact form submitted successfully" 
    });
  } catch (error) {
    console.error(`Error processing contact form: ${error.message}`);
    return createErrorResponse(error.message, null, 500);
  }
});
